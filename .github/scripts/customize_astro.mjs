import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const headerPath =
  process.argv[2] ?? "output/src/components/Header.astro";
const configPath = process.argv[3] ?? "output/astro-paper.config.ts";
const postsPath = process.argv[4] ?? "output/src/content/posts";
const postOgPath =
  process.argv[5] ?? "output/src/pages/posts/[...slug]/index.png.ts";
const siteOgPath = process.argv[6] ?? "output/src/pages/og.png.ts";
const ogFontSource =
  process.env.OG_CJK_FONT_PATH ?? ".cache/fonts/NotoSansSC.ttf";
const ogFontTarget =
  process.argv[7] ?? "output/src/assets/fonts/NotoSansSC.ttf";
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

function replaceExactly(source, pattern, replacement, description, path) {
  const matches = source.split(pattern).length - 1;
  if (matches !== 1) {
    throw new Error(
      `Expected exactly one ${description} in ${path}, found ${matches}`,
    );
  }
  return source.replace(pattern, replacement);
}

async function addCjkOgFont(path, routeUrl) {
  let source = await readFile(path, "utf8");
  const apiRouteImport = 'import type { APIRoute } from "astro";';
  source = replaceExactly(
    source,
    apiRouteImport,
    `${apiRouteImport}\nimport cjkFontPath from "@/assets/fonts/NotoSansSC.ttf?url";`,
    "Astro API route import",
    path,
  );

  const fontLoadEnd = `  ]);\n\n  const svg = await satori(`;
  source = replaceExactly(
    source,
    fontLoadEnd,
    `  ]);\n  const cjkData = await fetch(\n    experimental_getFontFileURL(cjkFontPath, ${routeUrl}),\n  ).then(res => res.arrayBuffer());\n\n  const svg = await satori(`,
    "OG font loading block",
    path,
  );

  const rootStyle = `          display: "flex",\n          alignItems: "center",\n          justifyContent: "center",`;
  const rootStyleWithFont = `${rootStyle}\n          fontFamily: "Google Sans Code, Noto Sans SC",`;
  if (source.includes(`${rootStyle}\n          fontFamily: "Google Sans Code",`)) {
    source = replaceExactly(
      source,
      `${rootStyle}\n          fontFamily: "Google Sans Code",`,
      rootStyleWithFont,
      "OG root font family",
      path,
    );
  } else {
    source = replaceExactly(
      source,
      rootStyle,
      rootStyleWithFont,
      "OG root style",
      path,
    );
  }

  const fontListEnd = `        {\n          name: "Google Sans Code",\n          data: boldData,\n          weight: 700,\n          style: "normal",\n        },\n      ],`;
  const fontListWithCjk = `        {\n          name: "Google Sans Code",\n          data: boldData,\n          weight: 700,\n          style: "normal",\n        },\n        {\n          name: "Noto Sans SC",\n          data: cjkData,\n          weight: 400,\n          style: "normal",\n        },\n        {\n          name: "Noto Sans SC",\n          data: cjkData,\n          weight: 700,\n          style: "normal",\n        },\n      ],`;
  source = replaceExactly(
    source,
    fontListEnd,
    fontListWithCjk,
    "OG font list",
    path,
  );

  await writeFile(path, source);
}

await mkdir(dirname(ogFontTarget), { recursive: true });
await copyFile(ogFontSource, ogFontTarget);
await Promise.all([
  addCjkOgFont(postOgPath, "url"),
  addCjkOgFont(siteOgPath, "context.url"),
]);
