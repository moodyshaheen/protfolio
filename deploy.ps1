# Portfolio Deployment Script
# This script exports projects from admin, copies to frontend, builds, and deploys

Write-Host "🚀 Starting deployment process..." -ForegroundColor Cyan

# Step 1: Check if exported file exists
$exportedFile = "C:\Users\falcon\Downloads\portfolio_projects.json"
$targetFile = "C:\Users\falcon\OneDrive\Desktop\protfilio\frontend\public\projects.json"
$frontendDir = "C:\Users\falcon\OneDrive\Desktop\protfilio\frontend"

if (Test-Path $exportedFile) {
    Write-Host "✅ Found exported projects file" -ForegroundColor Green
    
    # Copy to frontend public folder
    Copy-Item $exportedFile $targetFile -Force
    Write-Host "✅ Copied projects.json to frontend/public" -ForegroundColor Green
} else {
    Write-Host "⚠️  No exported file found. Using existing projects.json" -ForegroundColor Yellow
}

# Step 2: Build frontend
Write-Host "`n📦 Building frontend..." -ForegroundColor Cyan
Set-Location $frontendDir
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 3: Deploy to Surge
Write-Host "`n🌐 Deploying to Surge..." -ForegroundColor Cyan
surge dist falcon-portfolio.surge.sh

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 Deployment complete!" -ForegroundColor Green
    Write-Host "📍 Your site: https://falcon-portfolio.surge.sh" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

