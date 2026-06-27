const fs = require("fs");

const sourcePath = "src/partials/main.html";
const templatePath = "src/template.html";

const source = fs.readFileSync(sourcePath, "utf8");

// Keep a backup before changing structure
fs.writeFileSync("src/partials/main.backup.html", source, "utf8");

// Extract content before <main> as consent/top extras
const mainMatch = source.match(/<main\b([^>]*)>([\s\S]*?)<\/main>/i);
if (!mainMatch) {
  throw new Error("Could not find <main>...</main> in src/partials/main.html");
}

const beforeMain = source.slice(0, mainMatch.index).trim();
const mainAttrs = mainMatch[1] || "";
const mainInner = mainMatch[2].trim();
const afterMain = source.slice(mainMatch.index + mainMatch[0].length).trim();

fs.writeFileSync("src/partials/consent.html", beforeMain ? beforeMain + "\n" : "", "utf8");

// Extract all top-level section blocks
const sections = mainInner.match(/<section\b[\s\S]*?<\/section>/gi) || [];

if (sections.length < 8) {
  throw new Error(`Expected multiple sections, found only ${sections.length}`);
}

const used = new Set();

function sectionId(block) {
  const m = block.match(/\sid=["']([^"']+)["']/i);
  return m ? m[1] : "";
}

function writePartial(name, content) {
  fs.writeFileSync(`src/partials/${name}.html`, content.trim() + "\n", "utf8");
}

let unnamedCount = 0;

for (const section of sections) {
  const id = sectionId(section);

  if (!id) {
    unnamedCount += 1;
    if (unnamedCount === 1) {
      writePartial("hero", section);
      used.add(section);
    } else if (unnamedCount === 2) {
      writePartial("overview", section);
      used.add(section);
    } else {
      writePartial(`section-${unnamedCount}`, section);
      used.add(section);
    }
    continue;
  }

  const allowed = [
    "about",
    "services",
    "solutions",
    "results",
    "security",
    "faq",
    "contact"
  ];

  if (allowed.includes(id)) {
    writePartial(id, section);
    used.add(section);
  }
}

// Extract footer
let rest = afterMain;
let footer = "";

rest = rest.replace(/\s*(<footer\b[\s\S]*?<\/footer>)\s*/i, (_, captured) => {
  footer = captured.trim();
  return "\n";
});

writePartial("footer", footer);
writePartial("floating", rest.trim());

// Replace main.html with a clean wrapper note, not the full page
const cleanMain = `<main class="pt-20" id="top">
{{> hero}}
{{> overview}}
{{> about}}
{{> services}}
{{> solutions}}
{{> results}}
{{> security}}
{{> faq}}
{{> contact}}
</main>
`;

fs.writeFileSync("src/partials/main.html", cleanMain, "utf8");

// Read current template and preserve html/head/body/header/scripts structure
let template = fs.readFileSync(templatePath, "utf8");

const htmlTag = (template.match(/<html\b[^>]*>/i) || ['<html lang="ar" dir="rtl">'])[0];
const bodyOpen = (template.match(/<body\b[^>]*>/i) || ['<body>'])[0];

const newTemplate = `<!DOCTYPE html>
${htmlTag}
{{> head}}
${bodyOpen}
{{> header}}
{{> consent}}
{{> main}}
{{> footer}}
{{> floating}}
{{> scripts}}
</body>
</html>
`;

fs.writeFileSync(templatePath, newTemplate, "utf8");

console.log("Advanced partial split completed:");
console.log("- consent.html");
console.log("- hero.html");
console.log("- overview.html");
console.log("- about.html");
console.log("- services.html");
console.log("- solutions.html");
console.log("- results.html");
console.log("- security.html");
console.log("- faq.html");
console.log("- contact.html");
console.log("- footer.html");
console.log("- floating.html");
console.log("- main.html now acts as wrapper");
console.log("- main.backup.html created");
