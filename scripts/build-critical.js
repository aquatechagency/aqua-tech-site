/*
 * Generates src/critical.css: the rules from the merged stylesheet that can
 * affect what is on screen before the full stylesheet arrives.
 *
 * Kept: every rule whose selector matches an element outside <main> and
 * <footer> (skip link, header, consent bar, floating buttons), in the hero,
 * in any position: fixed/sticky element, or html/body/main, in Arabic and
 * English, at 375 / 768 / 1440,
 * with the header both resting and scrolled and the menu both closed and
 * open. Selectors are matched with user-action pseudo-classes and
 * pseudo-elements stripped, so :hover / ::before variants of those elements
 * are kept too. Over-inclusion is harmless; a missing rule would only show
 * until the full stylesheet applies.
 *
 * Rules are copied as written in the source (vendor prefixes survive), in
 * source order, inside the same @media / @supports wrappers. @font-face is
 * always kept, @keyframes when a kept rule names them.
 *
 * Usage (needs Chrome; set CHROME_PATH if it is not in the default place):
 *   npm run build:critical            -> build, generate, build again
 *   node scripts/build-critical.js [url]   (default http://localhost:4180/)
 */
const fs = require("fs");
const crypto = require("crypto");
const postcss = require("postcss");
const puppeteer = require("puppeteer-core");

const url = process.argv[2] || "http://localhost:4180/";
const mergedPath = ".cache/site.merged.css";
const outPath = "src/critical.css";
const chromePath =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const VIEWPORTS = [
  { width: 375, height: 812, isMobile: true, hasTouch: true },
  { width: 768, height: 1024, isMobile: true, hasTouch: true },
  { width: 1440, height: 900 },
];
const LANGS = ["ar", "en"];

function hash(text) {
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, 10);
}

async function matchedSelectors(selectors) {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
  });
  const matched = new Set();

  try {
    for (const viewport of VIEWPORTS) {
      for (const lang of LANGS) {
        for (const state of ["resting", "scrolled-menu-open"]) {
          const page = await browser.newPage();
          await page.setViewport(viewport);
          await page.evaluateOnNewDocument((l) => {
            localStorage.setItem("aqua_lang", l);
          }, lang);
          await page.goto(url, { waitUntil: "networkidle0" });
          // Let the hero entrance and the depth/motion scripts settle.
          await new Promise((r) => setTimeout(r, 2500));

          if (state === "scrolled-menu-open") {
            await page.evaluate(() => {
              document
                .querySelector("body > header")
                ?.classList.add("is-aqua-header-scrolled");
              if (window.innerWidth < 1024) {
                document.getElementById("menuToggle")?.click();
              }
            });
            await new Promise((r) => setTimeout(r, 300));
          }

          const hits = await page.evaluate((list) => {
            const roots = new Set([
              document.documentElement,
              document.body,
              document.querySelector("main"),
            ]);
            const critical = new Set(roots);
            const addTree = (el) => {
              if (!el) return;
              critical.add(el);
              el.querySelectorAll("*").forEach((child) => critical.add(child));
            };

            // Everything outside <main>/<footer> sits above or over the first
            // screen (skip link, header, consent bar, floating buttons), even
            // when its rule parks it off-screen.
            document
              .querySelectorAll("body > :not(main):not(footer):not(script)")
              .forEach(addTree);
            addTree(document.querySelector(".aqua-signature-hero"));
            document.querySelectorAll("body *").forEach((el) => {
              const position = getComputedStyle(el).position;
              if (position === "fixed" || position === "sticky") addTree(el);
            });

            const STRIP =
              /::?(?:before|after|placeholder|selection|backdrop|marker|first-line|first-letter|-webkit-[a-z-]+|-moz-[a-z-]+|hover|focus-visible|focus-within|focus|active|visited|checked|disabled|enabled|placeholder-shown|invalid|valid|required|optional|autofill)(?![a-z-])/g;

            const matches = (selector) => {
              let nodes;
              try {
                nodes = document.querySelectorAll(selector);
              } catch (_error) {
                return false;
              }
              for (const node of nodes) if (critical.has(node)) return true;
              return false;
            };

            return list.filter((selector) => {
              if (matches(selector)) return true;
              const stripped = selector
                .split(",")
                .map((part) => part.replace(STRIP, "").trim() || "*")
                .join(",");
              return stripped !== selector && matches(stripped);
            });
          }, selectors);

          hits.forEach((selector) => matched.add(selector));
          await page.close();
        }
      }
    }
  } finally {
    await browser.close();
  }

  return matched;
}

(async () => {
  if (!fs.existsSync(mergedPath)) {
    throw new Error(`${mergedPath} is missing - run \`npm run build\` first.`);
  }

  const merged = fs.readFileSync(mergedPath, "utf8").replace(/\r\n/g, "\n");
  const root = postcss.parse(merged);

  const selectors = new Set();
  root.walkRules((rule) => {
    if (rule.parent?.type === "atrule" && /keyframes$/i.test(rule.parent.name)) {
      return;
    }
    selectors.add(rule.selector);
  });

  const keep = await matchedSelectors([...selectors]);

  /* Drop every rule that did not match, then empty wrappers. Keyframes are
     decided after, from the animation names the kept rules use. */
  root.walkComments((comment) => comment.remove());
  root.walkRules((rule) => {
    if (rule.parent?.type === "atrule" && /keyframes$/i.test(rule.parent.name)) {
      return;
    }
    if (!keep.has(rule.selector)) rule.remove();
  });

  const animationNames = new Set();
  root.walkDecls(/^(-webkit-)?animation(-name)?$/i, (decl) => {
    decl.value
      .split(",")
      .flatMap((part) => part.trim().split(/\s+/))
      .forEach((token) => animationNames.add(token));
  });

  root.walkAtRules((atRule) => {
    if (/keyframes$/i.test(atRule.name) && !animationNames.has(atRule.params.trim())) {
      atRule.remove();
    }
  });

  let removedEmpty = true;
  while (removedEmpty) {
    removedEmpty = false;
    root.walkAtRules((atRule) => {
      if (/^(media|supports|layer|container)$/i.test(atRule.name) && !atRule.nodes?.length) {
        atRule.remove();
        removedEmpty = true;
      }
    });
  }

  const header =
    `/* Generated by scripts/build-critical.js - do not edit by hand.\n` +
    `   built from merged CSS ${hash(merged)}, ${keep.size} of ${selectors.size} selectors kept. */\n`;
  const output = header + root.toString().trim() + "\n";

  /* A broken page load (server down, script error) matches next to nothing.
     Refuse to replace a good file with that; the floors sit well below the
     real extract (~360 selectors, ~74KB). */
  if (keep.size < 150 || Buffer.byteLength(output) < 20 * 1024) {
    throw new Error(
      `Only ${keep.size} selectors / ${Buffer.byteLength(output)} bytes matched - ` +
        `is ${url} serving the current build? ${outPath} left unchanged.`,
    );
  }

  // Write next to the target and rename, so an interrupted run never leaves
  // a partial file behind.
  fs.writeFileSync(`${outPath}.tmp`, output);
  fs.renameSync(`${outPath}.tmp`, outPath);
  console.log(
    `[build-critical] ${keep.size}/${selectors.size} selectors kept -> ${outPath} ` +
      `(${(fs.statSync(outPath).size / 1024).toFixed(1)}KB unminified)`,
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
