const fs = require("fs");

const sourcePath = "index.html";
const html = fs.readFileSync(sourcePath, "utf8");

const htmlTagMatch = html.match(/<html\b[^>]*>/i);
const htmlTag = htmlTagMatch ? htmlTagMatch[0] : '<html lang="ar" dir="rtl">';

const headMatch = html.match(/<head\b[^>]*>[\s\S]*?<\/head>/i);
if (!headMatch) {
  throw new Error("Could not find <head>...</head>");
}

const bodyMatch = html.match(/<body\b([^>]*)>([\s\S]*?)<\/body>/i);
if (!bodyMatch) {
  throw new Error("Could not find <body>...</body>");
}

const head = headMatch[0].trim();
const bodyAttrs = bodyMatch[1] || "";
let body = bodyMatch[2];

const scripts = [];
body = body.replace(/\s*<script\b[\s\S]*?<\/script>\s*/gi, (match) => {
  scripts.push(match.trim());
  return "\n";
});

let header = "";
body = body.replace(/\s*(<header\b[\s\S]*?<\/header>)\s*/i, (match, captured) => {
  header = captured.trim();
  return "\n";
});

if (!header) {
  console.warn("Warning: no <header> found. header.html will be empty.");
}

const main = body.trim();
const bodyOpen = `<body${bodyAttrs}>`;

fs.writeFileSync("src/template.html", `<!DOCTYPE html>
${htmlTag}
{{> head}}
${bodyOpen}
{{> header}}
{{> main}}
{{> scripts}}
</body>
</html>
`, "utf8");

fs.writeFileSync("src/partials/head.html", head + "\n", "utf8");
fs.writeFileSync("src/partials/header.html", header + "\n", "utf8");
fs.writeFileSync("src/partials/main.html", main + "\n", "utf8");
fs.writeFileSync("src/partials/scripts.html", scripts.join("\n\n") + "\n", "utf8");

console.log("Split completed:");
console.log("- src/template.html");
console.log("- src/partials/head.html");
console.log("- src/partials/header.html");
console.log("- src/partials/main.html");
console.log("- src/partials/scripts.html");
