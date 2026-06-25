# Deploy AIVerseNewFrontendApp to Azure Web App: aiverse-frontend
# Does NOT change App Service auth (MFA), custom domains, or TLS settings.
#
# Prerequisites:
#   - Azure CLI: https://learn.microsoft.com/cli/azure/install-azure-cli-windows
#   - Logged in: az login
#   - Access to the resource group that hosts aiverse-frontend
#
# Usage:
#   .\scripts\deploy-aiverse-frontend.ps1
#   .\scripts\deploy-aiverse-frontend.ps1 -ResourceGroup "your-rg-name"

param(
    [string]$WebAppName = "aiverse-frontend",
    [string]$ResourceGroup = ""
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$distPath = Join-Path $projectRoot "dist"
$stagingPath = Join-Path $projectRoot ".azure-deploy"
$zipPath = Join-Path $projectRoot "aiverse-frontend-deploy.zip"

if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "Azure CLI (az) is not installed. Install it, run 'az login', then rerun this script."
}

Write-Host "Building production bundle..."
Push-Location $projectRoot
npm run build
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    exit $LASTEXITCODE
}
Pop-Location

if (-not (Test-Path (Join-Path $distPath "index.html"))) {
    Write-Error "Build failed: dist\index.html not found."
}

if (-not (Test-Path (Join-Path $distPath "web.config"))) {
    Write-Error "dist\web.config not found. Ensure public\web.config exists before building."
}

Write-Host "Preparing Azure runtime package..."
if (Test-Path $stagingPath) {
    Remove-Item $stagingPath -Recurse -Force
}
New-Item -ItemType Directory -Path $stagingPath | Out-Null

Copy-Item -Path (Join-Path $distPath "*") -Destination $stagingPath -Recurse -Force
Copy-Item -Path (Join-Path $projectRoot "scripts\azure-start.cjs") -Destination (Join-Path $stagingPath "azure-start.cjs") -Force

@'
{
  "name": "aiverse-frontend",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "start": "node azure-start.cjs"
  },
  "dependencies": {
    "serve": "^14.2.6"
  }
}
'@ | Set-Content -Path (Join-Path $stagingPath "package.json") -Encoding UTF8

@'
const { spawn } = require("node:child_process");

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
'@ | Set-Content -Path (Join-Path $stagingPath "azure-start.cjs") -Encoding UTF8

Write-Host "Creating deployment zip..."
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Push-Location $stagingPath
Compress-Archive -Path * -DestinationPath $zipPath -Force
Pop-Location

Remove-Item $stagingPath -Recurse -Force

if (-not $ResourceGroup) {
    Write-Host "Looking up resource group for $WebAppName..."
    $ResourceGroup = az webapp show --name $WebAppName --query resourceGroup -o tsv 2>$null
    if (-not $ResourceGroup) {
        Write-Error "Could not resolve resource group. Pass -ResourceGroup explicitly."
    }
}

Write-Host "Ensuring Azure startup command is npm start..."
az webapp config set `
    --resource-group $ResourceGroup `
    --name $WebAppName `
    --startup-file "npm start" `
    --output none

Write-Host "Deploying to $WebAppName (resource group: $ResourceGroup)..."
Write-Host "Note: App Service Authentication / MFA settings are not modified by this deploy."

az webapp deploy `
    --resource-group $ResourceGroup `
    --name $WebAppName `
    --src-path $zipPath `
    --type zip `
    --clean true `
    --restart true

Write-Host "Deployment complete."
Write-Host "Site: https://$WebAppName.azurewebsites.net"
Write-Host "Custom domain (if configured): https://aiverse.espire.com"
