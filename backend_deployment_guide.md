# 🛡️ Free Spring Boot Backend Microservices Deployment Guide

This guide explains how to host your Spring Boot 3 backend microservices and databases on **100% free cloud platforms** (Render, Koyeb, Supabase, Neon).

---

## ⚡ Option 1: Deploying via Render.com (Recommended Free Tier)

**Render** provides free web service hosting for Docker containers and Java Spring Boot services.

### Step 1: Push Project to GitHub
Ensure all microservice files and `Dockerfile`s are pushed to GitHub:
```bash
git remote add origin https://github.com/chaithanya762/flavordash-food-delivery.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Each Microservice on Render
1. Sign in to **[Render.com](https://render.com)** with your GitHub account.
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository `flavordash-food-delivery`.
4. Deploy the services in this order:

| Priority | Service Name | Root Directory | Build Command | Start Command |
|---|---|---|---|---|
| 1️⃣ | `config-server` | `config-server` | `mvn clean package -DskipTests` | `java -jar target/config-server-1.0.0.jar` |
| 2️⃣ | `eureka-server` | `eureka-server` | `mvn clean package -DskipTests` | `java -jar target/eureka-server-1.0.0.jar` |
| 3️⃣ | `product-service` | `product-service` | `mvn clean package -DskipTests` | `java -jar target/product-service-1.0.0.jar` |
| 4️⃣ | `user-service` | `user-service` | `mvn clean package -DskipTests` | `java -jar target/user-service-1.0.0.jar` |
| 5️⃣ | `order-service` | `order-service` | `mvn clean package -DskipTests` | `java -jar target/order-service-1.0.0.jar` |
| 6️⃣ | `payment-service` | `payment-service` | `mvn clean package -DskipTests` | `java -jar target/payment-service-1.0.0.jar` |
| 7️⃣ | `api-gateway` | `api-gateway` | `mvn clean package -DskipTests` | `java -jar target/api-gateway-1.0.0.jar` |

---

## ⚡ Option 2: Free PostgreSQL Cloud Database (Neon / Supabase)

If you want persistent PostgreSQL database hosting instead of H2 in-memory:
1. Create a free database on **[Neon.tech](https://neon.tech)** or **[Supabase.com](https://supabase.com)**.
2. Get your connection string (e.g. `jdbc:postgresql://ep-xxx.neon.tech/flavordash`).
3. Add environment variables in Render:
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<neon-host>:5432/flavordash`
   - `SPRING_DATASOURCE_USERNAME`: `<username>`
   - `SPRING_DATASOURCE_PASSWORD`: `<password>`

---

## ⚡ Option 3: Connect Frontend to Deployed Backend

In your frontend `frontend/src/api/api.js`, update `API_BASE_URL` to point to your live deployed API Gateway on Render:

```javascript
// frontend/src/api/api.js
const API_BASE_URL = 'https://flavordash-api-gateway.onrender.com/api';
```
