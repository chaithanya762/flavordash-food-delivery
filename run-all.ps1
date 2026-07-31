Write-Host "🚀 Starting Food Delivery App Microservices..." -ForegroundColor Green

# 1. Config Server (8888)
Write-Host "Starting Config Server (Port 8888)..." -ForegroundColor Yellow
Start-Process java -ArgumentList "-jar", "config-server/target/config-server-1.0.0.jar" -WindowStyle Normal
Start-Sleep -Seconds 4

# 2. Eureka Server (8761)
Write-Host "Starting Eureka Server (Port 8761)..." -ForegroundColor Yellow
Start-Process java -ArgumentList "-jar", "eureka-server/target/eureka-server-1.0.0.jar" -WindowStyle Normal
Start-Sleep -Seconds 4

# 3. User Service (8081)
Write-Host "Starting User Service (Port 8081)..." -ForegroundColor Yellow
Start-Process java -ArgumentList "-jar", "user-service/target/user-service-1.0.0.jar" -WindowStyle Normal

# 4. Product Service (8082)
Write-Host "Starting Product Service (Port 8082)..." -ForegroundColor Yellow
Start-Process java -ArgumentList "-jar", "product-service/target/product-service-1.0.0.jar" -WindowStyle Normal

# 5. Order Service (8083)
Write-Host "Starting Order Service (Port 8083)..." -ForegroundColor Yellow
Start-Process java -ArgumentList "-jar", "order-service/target/order-service-1.0.0.jar" -WindowStyle Normal

# 6. Payment Service (8084)
Write-Host "Starting Payment Service (Port 8084)..." -ForegroundColor Yellow
Start-Process java -ArgumentList "-jar", "payment-service/target/payment-service-1.0.0.jar" -WindowStyle Normal

# 7. API Gateway (8080)
Write-Host "Starting API Gateway (Port 8080)..." -ForegroundColor Yellow
Start-Process java -ArgumentList "-jar", "api-gateway/target/api-gateway-1.0.0.jar" -WindowStyle Normal

# 8. Frontend (3000)
Write-Host "Starting React Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process npm -ArgumentList "run", "dev" -WorkingDirectory "frontend" -WindowStyle Normal

Write-Host "`n✅ All services launched!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔍 Eureka Dashboard: http://localhost:8761" -ForegroundColor Cyan
