/*
 * npm run check:build - fails when the committed build outputs do not match
 * what the current sources produce.
 *
 * Vercel serves the committed files as they are (no build step), so a
 * source change without a rebuild ships stale CSS/JS/HTML. This rebuilds
 * into a scratch folder with the same three steps as `npm run build` and
 * compares, line endings normalised:
 *   index.html, dist/output.css, dist/site.min.css, dist/js/*.min.js
 * It also fails when src/critical.css was generated from different CSS than
 * the sources now produce (its header records that hash).
 *
 * --staged (used by the pre-commit hook) additionally fails when fresh
 * outputs exist in the working tree but are not staged, so the commit would
 * still carry the old ones.
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { spawnSync, execFileSync } = require("child_process");

const staged = process.argv.includes("--staged");
const FIX = "Run `npm run build:critical` before committing.";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "aqua-check-build-"));
const env = { ...process.env, BUILD_OUT_DIR: tmp };
const posix = (p) => p.split(path.sep).join("/");

function run(label, args) {
  const result = spawnSync(process.execPath, args, {
    env,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout + result.stderr);
    fail([`${label} failed (exit ${result.status}).`]);
  }
}

function fail(lines) {
  console.error(
    ["", "[check:build] Build outputs are stale or missing:", ...lines.map((l) => `  - ${l}`), "", FIX, ""].join("\n"),
  );
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(1);
}

const read = (file) =>
  fs.existsSync(file) ? fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n") : null;
const hash = (text) =>
  crypto.createHash("sha256").update(text).digest("hex").slice(0, 10);

run("build-html.js", ["scripts/build-html.js"]);
run("tailwindcss", [
  require.resolve("tailwindcss/lib/cli.js"),
  "-i",
  "./src/input.css",
  "-o",
  path.join(tmp, "dist/output.css"),
  "--minify",
  // Same content as tailwind.config.js, but the freshly built page.
  "--content",
  `${posix(path.join(tmp, "index.html"))},./js/**/*.js`,
]);
run("build-assets.js", ["scripts/build-assets.js"]);

const outputs = [
  "index.html",
  "dist/output.css",
  "dist/site.min.css",
  ...new Set([
    ...fs.readdirSync(path.join(tmp, "dist/js")).map((f) => `dist/js/${f}`),
    ...(fs.existsSync("dist/js") ? fs.readdirSync("dist/js").map((f) => `dist/js/${f}`) : []),
  ]),
];

const problems = [];

for (const file of outputs) {
  const fresh = read(path.join(tmp, file));
  const committed = read(file);
  if (fresh === null) problems.push(`${file} exists but the build no longer produces it`);
  else if (committed === null) problems.push(`${file} is missing`);
  else if (fresh !== committed) problems.push(`${file} differs from a fresh build`);
}

const merged = read(path.join(tmp, ".cache/site.merged.css"));
const critical = read("src/critical.css") || "";
const builtFrom = (critical.match(/built from merged CSS ([0-9a-f]{10})/) || [])[1];
if (builtFrom !== hash(merged)) {
  problems.push(
    `src/critical.css was generated from CSS ${builtFrom || "?"}, sources now give ${hash(merged)}`,
  );
}

if (staged && !problems.length) {
  // Fresh outputs that are not staged would leave the old ones in the commit.
  const unstaged = execFileSync(
    "git",
    ["diff", "--name-only", "--", ...outputs, "src/critical.css"],
    { encoding: "utf8" },
  ).trim();
  if (unstaged) {
    problems.push(
      `rebuilt but not staged: ${unstaged.split("\n").join(", ")} (git add them)`,
    );
  }
}

fs.rmSync(tmp, { recursive: true, force: true });

if (problems.length) fail(problems);
console.log(`[check:build] OK - ${outputs.length} outputs and src/critical.css match the sources.`);
