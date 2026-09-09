# Deploy AIVerseNewFrontendApp to DEV Azure Web App: dev-aiverse-frontend
# Custom domain (when configured): https://dev-aiverse.espire.com
#
# Usage:
#   .\scripts\deploy-dev-aiverse-frontend.ps1

param(
    [string]$WebAppName = "dev-aiverse-frontend",
    [string]$ResourceGroup = "aiverse-rg"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$stagingPath = Join-Path $projectRoot "azure-deploy"
$zipPath = Join-Path $projectRoot "dev-aiverse-frontend-deploy.zip"
$envFile = Join-Path $projectRoot ".env.dev"

if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "Azure CLI (az) is not installed."
}
if (-not (Test-Path $envFile)) {
    Write-Error ".env.dev not found. Create it with VITE_API_BASE_URL for the dev Function App."
}

Write-Host "Building dev frontend package (API -> dev-func-aiverse-backend)..."
Push-Location $projectRoot

Copy-Item $envFile (Join-Path $projectRoot ".env.production.local") -Force
try {
    npm run prepare:azure
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
} finally {
    Remove-Item (Join-Path $projectRoot ".env.production.local") -Force -ErrorAction SilentlyContinue
}
Pop-Location

if (-not (Test-Path (Join-Path $stagingPath "index.html"))) {
    Write-Error "azure-deploy\index.html not found."
}

Write-Host "Creating deployment zip (tar)..."
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}
Push-Location $stagingPath
tar.exe -a -cf $zipPath *
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Write-Error "Failed to create deployment zip."
}
Pop-Location

Write-Host "Ensuring Azure startup command serves static build..."
$startupCommand = 'npx -y serve@14.2.6 . -s -l ${PORT:-8080}'
az webapp config set `
    --resource-group $ResourceGroup `
    --name $WebAppName `
    --startup-file $startupCommand `
    --output none

az webapp config appsettings set `
    --resource-group $ResourceGroup `
    --name $WebAppName `
    --settings SCM_DO_BUILD_DURING_DEPLOYMENT=false `
    --output none

Write-Host "Deploying to DEV $WebAppName..."
az webapp deploy `
    --resource-group $ResourceGroup `
    --name $WebAppName `
    --src-path $zipPath `
    --type zip `
    --restart true

Write-Host "Dev frontend deployment complete."
Write-Host "Site: https://$WebAppName.azurewebsites.net"
Write-Host "Custom domain (if configured): https://dev-aiverse.espire.com"
