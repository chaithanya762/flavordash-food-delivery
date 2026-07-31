# FlavorDash 1-Click Free Deployment Helper Script

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  FlavorDash 1-Click Free Cloud Deployer       " -ForegroundColor Gold
Write-Host "===============================================" -ForegroundColor Cyan

# 1. Check Git
Write-Host "`n1. Initializing Git Repository..." -ForegroundColor Yellow
git init
git add .
git commit -m "Deploy FlavorDash God-Mode App & Spring Boot Microservices"

Write-Host "`n2. Public Live Tunnel (Localtunnel)..." -ForegroundColor Yellow
Write-Host "Exposing http://localhost:3000 to the world..." -ForegroundColor Green
npx localtunnel --port 3000
