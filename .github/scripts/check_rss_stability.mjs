import { readFile } from "node:fs/promises";

const [generatedSource = "output/dist/rss.xml", siteURL, changedIssue = ""] =
  process.argv.slice(2);
if (!siteURL) {
  throw new Error(
    "Usage: check_rss_stability.mjs <generated-rss> <site-url> [changed-issue]",
  );
}

async function readSource(source) {
  if (/^https?:\/\//.test(source)) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${source}: ${response.status}`);
    }
    return response.text();
  }
  return readFile(source, "utf8");
}

function element(item, name) {
  const match = item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\/${name}>`));
  return match?.[1]?.trim();
}

function issueEntries(xml, source) {
  const entries = new Map();
  const items = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
  for (const [, item] of items) {
    const link = element(item, "link");
    const guid = element(item, "guid");
    const number = `${link}\n${guid}`.match(/\/issue-(\d+)(?:\/|$)/)?.[1];
    if (!number || !guid) {
      throw new Error(`Could not identify an issue GUID in ${source}`);
    }
    if (entries.has(number)) {
      throw new Error(`Duplicate RSS item for issue #${number} in ${source}`);
    }
    entries.set(number, {
      guid,
      link,
      title: element(item, "title"),
      description: element(item, "description"),
      pubDate: element(item, "pubDate"),
    });
  }
  if (entries.size === 0) {
    throw new Error(`No RSS items found in ${source}`);
  }
  return entries;
}

const normalizedSiteURL = siteURL.replace(/\/+$/, "");
const liveSource = `${normalizedSiteURL}/rss.xml`;
const [generatedXML, liveXML] = await Promise.all([
  readSource(generatedSource),
  readSource(liveSource),
]);
const generated = issueEntries(generatedXML, generatedSource);
const live = issueEntries(liveXML, liveSource);

for (const [number, entry] of generated) {
  const expected = `${normalizedSiteURL}/posts/issue-${number}/`;
  if (entry.guid !== expected || entry.link !== expected) {
    throw new Error(
      `RSS identity for issue #${number} changed from the stable form: ${JSON.stringify(entry)}`,
    );
  }
  const previous = live.get(number);
  if (previous && number !== changedIssue) {
    for (const field of ["guid", "link", "title", "description", "pubDate"]) {
      if (previous[field] !== entry[field]) {
        throw new Error(
          `RSS ${field} for unchanged issue #${number} differs from production: ${previous[field]} -> ${entry[field]}`,
        );
      }
    }
  }
}

console.log(
  `RSS stability: ${generated.size} generated items checked against ${live.size} production items`,
);
