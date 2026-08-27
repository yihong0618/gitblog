import { readFile } from "node:fs/promises";

const [generatedSource = "output/dist/rss.xml", siteURL, changedIssue = ""] =
  process.argv.slice(2);
const githubAPIURL = process.env.GITHUB_API_URL ?? "https://api.github.com";
const githubRepository = process.env.GITHUB_REPOSITORY;
const githubToken = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
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

async function currentIssueUpdatedAt(number) {
  if (!githubRepository) {
    throw new Error(
      `GITHUB_REPOSITORY is required to verify stale RSS changes for issue #${number}`,
    );
  }

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (githubToken) headers.Authorization = `Bearer ${githubToken}`;

  const source = `${githubAPIURL}/repos/${githubRepository}/issues/${number}`;
  const response = await fetch(source, { headers });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch current metadata for issue #${number}: ${response.status}`,
    );
  }
  const issue = await response.json();
  if (!issue.updated_at) {
    throw new Error(`GitHub returned no updated_at for issue #${number}`);
  }
  return issue.updated_at;
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
    const fields = ["guid", "link", "title", "description", "pubDate"];
    const changedFields = fields.filter(
      (field) => previous[field] !== entry[field],
    );
    if (changedFields.length === 0) continue;

    // A failed deployment can leave production behind GitHub. In that case,
    // later events must be able to deploy the accumulated, legitimate change.
    // Verify the generated date against GitHub so a non-deterministic RSS date
    // still fails instead of being mistaken for recovery.
    if (changedFields.includes("pubDate")) {
      const updatedAt = await currentIssueUpdatedAt(number);
      if (Date.parse(entry.pubDate) === Date.parse(updatedAt)) {
        console.log(
          `RSS recovery: issue #${number} has pending production changes verified against GitHub (${changedFields.join(", ")})`,
        );
        continue;
      }
    }

    const field = changedFields[0];
    throw new Error(
      `RSS ${field} for unchanged issue #${number} differs from production: ${previous[field]} -> ${entry[field]}`,
    );
  }
}

console.log(
  `RSS stability: ${generated.size} generated items checked against ${live.size} production items`,
);
