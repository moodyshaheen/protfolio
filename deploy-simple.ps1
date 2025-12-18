# Simple Deploy Script - No Backend Needed!
param(
    [string]$ProjectsJsonPath
)

$frontendDir = "C:\Users\falcon\OneDrive\Desktop\protfilio\frontend"
$targetFile = "$frontendDir\public\projects.json"

Write-Host "🚀 Starting deployment..." -ForegroundColor Cyan

# Copy projects.json to frontend/public
if (Test-Path $ProjectsJsonPath) {
    Copy-Item $ProjectsJsonPath $targetFile -Force
    Write-Host "✅ Projects copied to frontend/public" -ForegroundColor Green
} else {
    Write-Host "❌ Projects file not found: $ProjectsJsonPath" -ForegroundColor Red
    exit 1
}

# Build frontend
Write-Host "`n📦 Building frontend..." -ForegroundColor Cyan
Set-Location $frontendDir
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Deploy to Surge
Write-Host "`n🌐 Deploying to Surge..." -ForegroundColor Cyan
surge dist falcon-portfolio.surge.sh

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 Deployment complete!" -ForegroundColor Green
    Write-Host "📍 Your site: https://falcon-portfolio.surge.sh" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

