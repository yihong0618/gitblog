import { readFile, writeFile } from "node:fs/promises";

const headerPath =
  process.argv[2] ?? "output/src/components/Header.astro";
const configPath = process.argv[3] ?? "output/astro-paper.config.ts";
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
