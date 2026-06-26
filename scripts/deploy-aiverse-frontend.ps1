# Deploy AIVerseNewFrontendApp to Azure Web App: aiverse-frontend
# Does NOT change App Service auth (MFA), custom domains, or TLS settings.
#
# Prerequisites:
#   - Azure CLI: https://learn.microsoft.com/cli/azure/install-azure-cli-windows
#   - Logged in: az login
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
$stagingPath = Join-Path $projectRoot "azure-deploy"
$zipPath = Join-Path $projectRoot "aiverse-frontend-deploy.zip"

if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "Azure CLI (az) is not installed. Install it, run 'az login', then rerun this script."
}

Write-Host "Building and staging Azure deploy package..."
Push-Location $projectRoot
npm run prepare:azure
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    exit $LASTEXITCODE
}
Pop-Location

if (-not (Test-Path (Join-Path $stagingPath "index.html"))) {
    Write-Error "azure-deploy\index.html not found."
}

Write-Host "Creating deployment zip..."
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Push-Location $stagingPath
Compress-Archive -Path * -DestinationPath $zipPath -Force
Pop-Location

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

az webapp config appsettings set `
    --resource-group $ResourceGroup `
    --name $WebAppName `
    --settings SCM_DO_BUILD_DURING_DEPLOYMENT=false `
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
