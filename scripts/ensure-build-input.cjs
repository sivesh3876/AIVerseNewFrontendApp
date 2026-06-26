const fs = require("node:fs");
const path = require("node:path");

const requiredFiles = [
  "src/main.jsx",
  "src/App.jsx",
  "index.html",
  "vite.config.js",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(process.cwd(), file)),
);

if (missing.length > 0) {
  console.error("\nBuild aborted: required source files are missing:");
  missing.forEach((file) => console.error(`  - ${file}`));
  console.error(
    "\nDeploy the full project (including src/), not dist.zip or dist/ only.",
  );
  console.error("Recommended: npm run deploy:azure\n");
  process.exit(1);
}
