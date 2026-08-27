import { readdir, readFile, writeFile } from "node:fs/promises";

const headerPath =
  process.argv[2] ?? "output/src/components/Header.astro";
const configPath = process.argv[3] ?? "output/astro-paper.config.ts";
const postsPath = process.argv[4] ?? "output/src/content/posts";
const { SOCIAL_X_URL, SOCIAL_TELEGRAM_URL } = process.env;
if (!SOCIAL_X_URL || !SOCIAL_TELEGRAM_URL) {
  throw new Error(
    "SOCIAL_X_URL and SOCIAL_TELEGRAM_URL must be configured in the workflow",
  );
}
const header = await readFile(headerPath, "utf8");
const config = await readFile(configPath, "utf8");

const defaultAboutNav = `        <li class="col-span-2">
          <a
            href={getRelativeLocaleUrl(locale, "about")}
            class:list={{ "active-nav": isActive("/about") }}
          >
            {t.nav.about}
          </a>
        </li>`;

const tagNav = `        <li class="col-span-2">
          <a
            href={getRelativeLocaleUrl(locale, "tags/top")}
            class:list={{ "active-nav": currentPath === "/tags/top" }}
          >
            Top
          </a>
        </li>
        <li class="col-span-2">
          <a
            href={getRelativeLocaleUrl(locale, "tags/about")}
            class:list={{ "active-nav": currentPath === "/tags/about" }}
          >
            {t.nav.about}
          </a>
        </li>`;

const matches = header.split(defaultAboutNav).length - 1;
if (matches !== 1) {
  throw new Error(
    `Expected exactly one default About navigation item in ${headerPath}, found ${matches}`,
  );
}

await writeFile(headerPath, header.replace(defaultAboutNav, tagNav));

const socialsStart = config.indexOf("\n  socials:");
const shareLinksStart = config.indexOf("\n  shareLinks:", socialsStart);
if (socialsStart < 0 || shareLinksStart < 0) {
  throw new Error(`Could not find the socials configuration in ${configPath}`);
}

const socialsBlock = config.slice(socialsStart, shareLinksStart);
const githubURL = socialsBlock.match(
  /\{\s*name:\s*"github",\s*url:\s*("[^"]+")\s*\}/,
)?.[1];
if (!githubURL) {
  throw new Error(`Could not preserve the GitHub social link in ${configPath}`);
}

const socialLinks = `
  socials: [
    { name: "github", url: ${githubURL} },
    { name: "x", url: ${JSON.stringify(SOCIAL_X_URL)} },
    { name: "telegram", url: ${JSON.stringify(SOCIAL_TELEGRAM_URL)} },
  ],`;

await writeFile(
  configPath,
  config.slice(0, socialsStart) + socialLinks + config.slice(shareLinksStart),
);

const generatedCommentsHeading =
  /\n## Comments\n(?=\n### [^\n]+\n\n\[View comment\]\()/;
const githubCommentsHeading = "\n## Comments from GitHub issue\n";
let customizedCommentSections = 0;

for (const entry of await readdir(postsPath, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

  const postPath = `${postsPath}/${entry.name}`;
  const post = await readFile(postPath, "utf8");
  const customizedPost = post.replace(
    generatedCommentsHeading,
    githubCommentsHeading,
  );
  if (customizedPost === post) continue;

  await writeFile(postPath, customizedPost);
  customizedCommentSections += 1;
}

if (customizedCommentSections === 0) {
  throw new Error(`Could not find any generated comment sections in ${postsPath}`);
}
