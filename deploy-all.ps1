# Portfolio Deployment Script
# This script builds and deploys both frontend and admin

Write-Host "🚀 Starting Portfolio Deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if .env files exist
$frontendEnv = Test-Path "frontend\.env"
$adminEnv = Test-Path "admin\.env"

if (-not $frontendEnv -or -not $adminEnv) {
    Write-Host "⚠️  WARNING: .env files not found!" -ForegroundColor Yellow
    Write-Host "Please create .env files in frontend and admin directories"
    Write-Host "Example content:"
    Write-Host "VITE_API_URL=https://your-backend-url.onrender.com"
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Build and Deploy Frontend
Write-Host "📦 Building Frontend..." -ForegroundColor Green
Set-Location frontend
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend built successfully!" -ForegroundColor Green
    Write-Host "🌐 Deploying Frontend to Surge..." -ForegroundColor Cyan
    surge dist falcon-portfolio.surge.sh
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend deployed to https://falcon-portfolio.surge.sh" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend deployment failed!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
}

Set-Location ..
Write-Host ""

# Build and Deploy Admin
Write-Host "📦 Building Admin Panel..." -ForegroundColor Green
Set-Location admin
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Admin Panel built successfully!" -ForegroundColor Green
    Write-Host "🌐 Deploying Admin Panel to Surge..." -ForegroundColor Cyan
    surge dist falcon-admin.surge.sh
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Admin Panel deployed to https://falcon-admin.surge.sh" -ForegroundColor Green
    } else {
        Write-Host "❌ Admin Panel deployment failed!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Admin Panel build failed!" -ForegroundColor Red
}

Set-Location ..
Write-Host ""
Write-Host "🎉 Deployment process completed!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your URLs:" -ForegroundColor Yellow
Write-Host "Frontend: https://falcon-portfolio.surge.sh" -ForegroundColor White
Write-Host "Admin:    https://falcon-admin.surge.sh" -ForegroundColor White
Write-Host ""

