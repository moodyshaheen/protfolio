# Script to setup environment variables for Frontend and Admin
# Run this after you get your Render backend URL

param(
    [Parameter(Mandatory=$true)]
    [string]$BackendUrl
)

Write-Host "🔧 Setting up environment variables..." -ForegroundColor Cyan
Write-Host ""

# Frontend .env
$frontendEnv = "VITE_API_URL=$BackendUrl"
Set-Content -Path "frontend\.env" -Value $frontendEnv
Write-Host "✅ Created frontend/.env" -ForegroundColor Green

# Admin .env
$adminEnv = "VITE_API_URL=$BackendUrl"
Set-Content -Path "admin\.env" -Value $adminEnv
Write-Host "✅ Created admin/.env" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Environment files created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Build and deploy frontend: cd frontend; npm run build; surge dist falcon-portfolio.surge.sh"
Write-Host "2. Build and deploy admin: cd admin; npm run build; surge dist falcon-admin.surge.sh"

