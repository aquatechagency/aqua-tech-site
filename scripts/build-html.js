const fs = require("fs");
const path = require("path");

const templatePath = "src/template.html";
const partialsDir = "src/partials";
// BUILD_OUT_DIR lets check-build.js build into a scratch folder.
const outputPath = path.join(process.env.BUILD_OUT_DIR || ".", "index.html");

function renderPartials(input) {
  let html = input;
  let previous = "";

  while (html !== previous) {
    previous = html;

    html = html.replace(/{{>\s*([a-zA-Z0-9_-]+)\s*}}/g, (_, name) => {
      const partialPath = path.join(partialsDir, `${name}.html`);

      if (!fs.existsSync(partialPath)) {
        throw new Error(`Missing partial: ${partialPath}`);
      }

      return fs.readFileSync(partialPath, "utf8").trim();
    });
  }

  if (/{{>/.test(html)) {
    throw new Error("Unresolved partial placeholder found in generated HTML");
  }

  return html;
}

function replaceSectionWithPartial(html, id, partialName) {
  const partialPath = path.join(partialsDir, `${partialName}.html`);

  if (!fs.existsSync(partialPath)) {
    throw new Error(`Missing partial: ${partialPath}`);
  }

  const pattern = new RegExp(
    `<section\\b(?=[^>]*\\bid=["']${id}["'])[^>]*>[\\s\\S]*?<\\/section>`,
    "gi",
  );
  const matches = html.match(pattern) || [];

  if (matches.length !== 1) {
    throw new Error(
      `Expected exactly one #${id} section, found ${matches.length}`,
    );
  }

  return html.replace(pattern, fs.readFileSync(partialPath, "utf8").trim());
}

function replaceElementWithPartial(html, tagName, partialName) {
  const partialPath = path.join(partialsDir, `${partialName}.html`);

  if (!fs.existsSync(partialPath)) {
    throw new Error(`Missing partial: ${partialPath}`);
  }

  const pattern = new RegExp(
    `<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`,
    "gi",
  );
  const matches = html.match(pattern) || [];

  if (matches.length !== 1) {
    throw new Error(
      `Expected exactly one <${tagName}> element, found ${matches.length}`,
    );
  }

  return html.replace(pattern, fs.readFileSync(partialPath, "utf8").trim());
}

function replaceFirstElementWithPartial(html, tagName, partialName) {
  const partialPath = path.join(partialsDir, `${partialName}.html`);

  if (!fs.existsSync(partialPath)) {
    throw new Error(`Missing partial: ${partialPath}`);
  }

  const pattern = new RegExp(
    `<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`,
    "i",
  );

  if (!pattern.test(html)) {
    throw new Error(`Expected a <${tagName}> element`);
  }

  return html.replace(pattern, fs.readFileSync(partialPath, "utf8").trim());
}

function removeSectionById(html, id) {
  const pattern = new RegExp(
    `<section\\b(?=[^>]*\\bid=["']${id}["'])[^>]*>[\\s\\S]*?<\\/section>`,
    "gi",
  );
  const matches = html.match(pattern) || [];

  if (matches.length > 1) {
    throw new Error(`Expected at most one #${id} section, found ${matches.length}`);
  }

  return html.replace(pattern, "");
}

function removeAnchorsByHref(html, href) {
  const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `<a\\b(?=[^>]*\\bhref=["']${escapedHref}["'])[^>]*>[\\s\\S]*?<\\/a\\s*>`,
    "gi",
  );

  return html.replace(pattern, "");
}

const template = fs.readFileSync(templatePath, "utf8");
let html = renderPartials(template);

html = replaceFirstElementWithPartial(html, "header", "header");
html = replaceSectionWithPartial(html, "flow", "overview");
html = replaceSectionWithPartial(html, "trust", "about");
html = replaceSectionWithPartial(html, "services", "services");
html = replaceSectionWithPartial(html, "solutions", "solutions");
html = replaceSectionWithPartial(html, "faq", "faq");
html = replaceSectionWithPartial(html, "contact", "contact");
html = removeSectionById(html, "offers");
html = removeSectionById(html, "security");
html = removeSectionById(html, "support");
html = removeAnchorsByHref(html, "#offers");
html = removeAnchorsByHref(html, "#security");
html = removeAnchorsByHref(html, "#support");
html = replaceElementWithPartial(html, "footer", "footer");

html = html.replace(/[ \t]+(?=\r?$)/gm, "").replace(/\r\n/g, "\n");

fs.writeFileSync(outputPath, html.trimEnd() + "\n", "utf8");

console.log("index.html built from partials");
