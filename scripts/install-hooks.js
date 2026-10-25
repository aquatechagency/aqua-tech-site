/*
 * npm "prepare": point git at .githooks/ so the pre-commit build check runs.
 * Silent no-op where there is no git (CI, a zip download), so `npm install`
 * never fails because of it.
 */
const { execFileSync } = require("child_process");

try {
  execFileSync("git", ["rev-parse", "--is-inside-work-tree"], { stdio: "ignore" });
  execFileSync("git", ["config", "core.hooksPath", ".githooks"], { stdio: "ignore" });
} catch (_error) {
  // Not a git checkout: nothing to install.
}
