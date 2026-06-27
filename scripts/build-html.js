const fs = require("fs");
const path = require("path");

const templatePath = "src/template.html";
const partialsDir = "src/partials";
const outputPath = "index.html";

let html = fs.readFileSync(templatePath, "utf8");

html = html.replace(/{{>\s*([a-zA-Z0-9_-]+)\s*}}/g, (_, name) => {
  const partialPath = path.join(partialsDir, `${name}.html`);

  if (!fs.existsSync(partialPath)) {
    throw new Error(`Missing partial: ${partialPath}`);
  }

  return fs.readFileSync(partialPath, "utf8").trim();
});

fs.writeFileSync(outputPath, html.trimEnd() + "\n", "utf8");

console.log("index.html built from partials");
