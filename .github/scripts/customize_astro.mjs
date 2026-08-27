import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";

const headerPath =
  process.argv[2] ?? "output/src/components/Header.astro";
const configPath = process.argv[3] ?? "output/astro-paper.config.ts";
const postsPath = process.argv[4] ?? "output/src/content/posts";
const postOgPath =
  process.argv[5] ?? "output/src/pages/posts/[...slug]/index.png.ts";
const siteOgPath = process.argv[6] ?? "output/src/pages/og.png.ts";
const ogFontSourceDir = process.env.OG_CJK_FONT_DIR ?? ".cache/fonts";
const ogFontTargetDir = process.argv[7] ?? "output/src/assets/fonts";
const astroConfigPath = process.argv[8] ?? "output/astro.config.ts";
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

async function addCjkFontConfig(path) {
  let source = await readFile(path, "utf8");
  const fontsStart = `  fonts: [\n    {\n      name: "Google Sans Code",`;
  const fontsWithCjk = `  fonts: [\n    {\n      name: "Noto Sans SC",\n      cssVariable: "--font-noto-sans-sc",\n      provider: fontProviders.local(),\n      options: {\n        variants: [\n          {\n            src: ["./src/assets/fonts/NotoSansCJKsc-Regular.otf"],\n            weight: 400,\n            style: "normal",\n          },\n          {\n            src: ["./src/assets/fonts/NotoSansCJKsc-Bold.otf"],\n            weight: 700,\n            style: "normal",\n          },\n        ],\n      },\n    },\n    {\n      name: "Google Sans Code",`;
  source = replaceExactly(
    source,
    fontsStart,
    fontsWithCjk,
    "Astro fonts configuration",
    path,
  );
  await writeFile(path, source);
}

async function addCjkOgFont(path, routeUrl) {
  let source = await readFile(path, "utf8");
  const googleFonts = `  const fonts = fontData["--font-google-sans-code"];`;
  source = replaceExactly(
    source,
    googleFonts,
    `${googleFonts}\n  const cjkFonts = fontData["--font-noto-sans-sc"];`,
    "Google font data lookup",
    path,
  );

  const boldFontPath = `  const boldFontPath = getFontPathByWeight(fonts, 700);`;
  source = replaceExactly(
    source,
    boldFontPath,
    `${boldFontPath}\n  const cjkRegularFontPath = getFontPathByWeight(cjkFonts, 400);\n  const cjkBoldFontPath = getFontPathByWeight(cjkFonts, 700);`,
    "Google font path lookup",
    path,
  );

  const missingFontCheck = `  if (regularFontPath === undefined || boldFontPath === undefined) {`;
  source = replaceExactly(
    source,
    missingFontCheck,
    `  if (\n    regularFontPath === undefined ||\n    boldFontPath === undefined ||\n    cjkRegularFontPath === undefined ||\n    cjkBoldFontPath === undefined\n  ) {`,
    "missing font check",
    path,
  );

  const fontLoadEnd = `  ]);\n\n  const svg = await satori(`;
  source = replaceExactly(
    source,
    fontLoadEnd,
    `  ]);\n  const [cjkRegularData, cjkBoldData] = await Promise.all([\n    fetch(experimental_getFontFileURL(cjkRegularFontPath, ${routeUrl})).then(\n      res => res.arrayBuffer()\n    ),\n    fetch(experimental_getFontFileURL(cjkBoldFontPath, ${routeUrl})).then(res =>\n      res.arrayBuffer()\n    ),\n  ]);\n\n  const svg = await satori(`,
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
  const fontListWithCjk = `        {\n          name: "Google Sans Code",\n          data: boldData,\n          weight: 700,\n          style: "normal",\n        },\n        {\n          name: "Noto Sans SC",\n          data: cjkRegularData,\n          weight: 400,\n          style: "normal",\n        },\n        {\n          name: "Noto Sans SC",\n          data: cjkBoldData,\n          weight: 700,\n          style: "normal",\n        },\n      ],`;
  source = replaceExactly(
    source,
    fontListEnd,
    fontListWithCjk,
    "OG font list",
    path,
  );

  await writeFile(path, source);
}

await mkdir(ogFontTargetDir, { recursive: true });
await Promise.all([
  copyFile(
    `${ogFontSourceDir}/NotoSansCJKsc-Regular.otf`,
    `${ogFontTargetDir}/NotoSansCJKsc-Regular.otf`,
  ),
  copyFile(
    `${ogFontSourceDir}/NotoSansCJKsc-Bold.otf`,
    `${ogFontTargetDir}/NotoSansCJKsc-Bold.otf`,
  ),
]);
await addCjkFontConfig(astroConfigPath);
await Promise.all([
  addCjkOgFont(postOgPath, "url"),
  addCjkOgFont(siteOgPath, "context.url"),
]);
