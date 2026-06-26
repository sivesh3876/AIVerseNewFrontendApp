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
  fs.rmSync(targetPath, { recursive: true, force: true });
}

fs.mkdirSync(targetPath, { recursive: true });
copyRecursive(distPath, targetPath);

fs.writeFileSync(
  path.join(targetPath, "package.json"),
  `${JSON.stringify(
    {
      name: "aiverse-frontend",
      private: true,
      version: "1.0.0",
      scripts: {
        start: "node azure-start.cjs",
      },
      dependencies: {
        serve: "^14.2.6",
      },
    },
    null,
    2,
  )}\n`,
);

fs.writeFileSync(
  path.join(targetPath, "azure-start.cjs"),
  `const { spawn } = require("node:child_process");

const port = process.env.PORT || process.env.WEBSITE_PORT || 8080;
const serveExecutable = process.platform === "win32" ? "npx.cmd" : "npx";

const child = spawn(
  serveExecutable,
  ["serve", ".", "-s", "-l", String(port)],
  { stdio: "inherit", shell: true, env: process.env },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
`,
);

fs.writeFileSync(
  path.join(targetPath, ".deployment"),
  `[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=false
`,
);

console.log(`Azure deploy package ready at ${targetPath}`);
