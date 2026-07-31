# 🍔 FlavorDash — Next-Gen Microservices Food Delivery Platform

### 💖 Made with ❤️ by **Chaithanya**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring_Cloud-Eureka-orange.svg)](https://spring.io/projects/spring-cloud)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![Author](https://img.shields.io/badge/Crafted_By-Chaithanya-ff6b35.svg)](#)

**FlavorDash** is an enterprise-grade, event-driven food delivery web application built using **Spring Boot 3 microservices** and a **React 18 + Vite** frontend.

---

## 🏗️ Architecture Overview

```mermaid
graph TD
    Client[React 18 God-Mode Frontend] -->|Port 8080| Gateway[API Gateway]
    Gateway -->|Discovery| Eureka[Eureka Server :8761]
    Gateway -->|Config| Config[Config Server :8888]
    
    Gateway -->|User API| UserSvc[User Service :8081]
    Gateway -->|Product API| ProdSvc[Product Service :8082]
    Gateway -->|Order API| OrderSvc[Order Service :8083]
    Gateway -->|Payment API| PaySvc[Payment Service :8084]

    OrderSvc -->|Event Stream| Kafka[Apache Kafka Event Bus]
    PaySvc -->|Payment Events| Kafka
```

---

## ⚡ Key Differentiators & Features

1. **🛒 Swiggy/Zomato-Style Floating Cart Bar**: Real-time bottom bar with 1-tap checkout access.
2. **👥 Collaborative Group Order & Instant Bill Split**: Share room code (`FLAVOR-4892`) and split UPI bills dynamically.
3. **🧠 AI Macro-Nutrient & Diet Engine**: Filter by **High Protein 💪**, **Keto 🥑**, **Jain 🌿**, or **Low Calorie ⚡**.
4. **👨‍🍳 Live Kitchen Merchant Portal (`/kitchen`)**: Manage incoming orders & menu stock status in real-time.
5. **🛵 Rider App & GPS Tracker (`/driver`)**: Interactive delivery partner dashboard with route simulation.
6. **⚙️ Live Backend Diagnostics Modal**: Real-time health monitoring of all 7 Spring Boot microservices directly from the navbar.

---

## 🔌 Microservices & API Registry

| Service Name | Port | Base Path | Database |
|---|---|---|---|
| **API Gateway** | `8080` | `/api/*` | Netty / Reactive Proxy |
| **User Service** | `8081` | `/api/users` | H2 / PostgreSQL |
| **Product Service** | `8082` | `/api/products` | H2 / PostgreSQL |
| **Order Service** | `8083` | `/api/orders` | H2 / PostgreSQL |
| **Payment Service** | `8084` | `/api/payments` | H2 / PostgreSQL |
| **Eureka Server** | `8761` | `/` | In-Memory Registry |
| **Config Server** | `8888` | `/` | Native YAML Store |

---

## 🚀 How to Run Locally

### 1. Run Microservices (Spring Boot)
```bash
./run-all.ps1
```

### 2. Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

### ✨ Crafted with passion & ❤️ by **Chaithanya** (`@chaithanya762`)
