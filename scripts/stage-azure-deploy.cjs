const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.join(__dirname, "..");
const distPath = path.join(projectRoot, "dist");
const targetPath = path.join(projectRoot, "azure-deploy");

const copyRecursive = (source, destination) => {
  fs.mkdirSync(destination, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(sourcePath, destinationPath);
      continue;
    }

    fs.copyFileSync(sourcePath, destinationPath);
  }
};

if (!fs.existsSync(path.join(distPath, "index.html"))) {
  console.error("dist/index.html not found. Run `npm run build` first.");
  process.exit(1);
}

if (fs.existsSync(targetPath)) {
  fs.rmSync(targetPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}

fs.mkdirSync(targetPath, { recursive: true });
copyRecursive(distPath, targetPath);

fs.writeFileSync(
  path.join(targetPath, ".deployment"),
  `[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=false
`,
);

console.log(`Azure deploy package ready at ${targetPath}`);
