const { spawn } = require("node:child_process");
const path = require("node:path");

const port = process.env.PORT || process.env.WEBSITE_PORT || 8080;
const serveExecutable = process.platform === "win32" ? "npx.cmd" : "npx";

const child = spawn(
  serveExecutable,
  ["serve", "dist", "-s", "-l", String(port)],
  {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
    shell: true,
    env: process.env,
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
