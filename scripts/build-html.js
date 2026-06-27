const fs = require("fs");
const path = require("path");

const templatePath = "src/template.html";
const partialsDir = "src/partials";
const outputPath = "index.html";

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

const template = fs.readFileSync(templatePath, "utf8");
const html = renderPartials(template);

fs.writeFileSync(outputPath, html.trimEnd() + "\n", "utf8");

console.log("index.html built from partials");
