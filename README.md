# FlavorDash — Full-Stack Food Delivery Application

A full-stack food delivery application built with **React 18 + Vite** on the frontend and a **Java 17 Spring Boot 3 Microservices** backend architecture.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Context API, CSS3
- **Backend**: Java 17, Spring Boot 3.2.5, Spring Cloud Gateway, Netflix Eureka Service Discovery, Spring Data JPA
- **Database**: H2 In-Memory Database (Development) / PostgreSQL Compatible
- **Deployment**: Vercel (Frontend), Render (Backend Microservices)

---

## ✨ Features Overview

### 1. Customer Portal (`/`, `/menu`, `/cart`, `/checkout`, `/orders`)
- **Menu Browsing**: Filter 27 authentic regional dishes across 7 categories.
- **Cart & Checkout**: Interactive quantity controls, itemized order summary, express checkout, and payment method selection (UPI, Credit Card, Cash on Delivery).
- **Live Order Tracking**: Real-time 5-stage order progress tracking (`RECEIVED` ➔ `COOKING` ➔ `READY` ➔ `DISPATCHED` ➔ `DELIVERED`).
- **Order Receipts**: View payment transaction details and receipts.

### 2. Hotel Manager Kitchen Desk (`/kitchen`)
- **Multi-Restaurant Support**: Pre-seeded accounts for 18 menu restaurants (e.g. Punjab Rasoi, Paradise Biryani, MTR 1924, etc.).
- **Order Pipeline Management**: Update order statuses from `RECEIVED` ➔ `COOKING` ➔ `READY` ➔ `DISPATCHED`.
- **Inventory Stock Control**: Toggle dish availability (`In Stock` / `Sold Out`) to update menu items in real time.
- **Queue Cleanup**: Completed (`DELIVERED`) and cancelled orders automatically archive to keep the kitchen desk clutter-free.

### 3. Rider Agent GPS Portal (`/driver`)
- **GPS Telemetry Simulation**: Real-time coordinate telemetry stream (`LAT: 28.6139° N | LON: 77.2090° E`) and route navigation.
- **Dispatch Queue**: Accept ready orders and mark deliveries complete.
- **Rider Delivery Credits**: Earn **+1 Credit** per completed delivery tracked in the rider profile.
- **Queue Cleanup**: Delivered tasks automatically archive from the active dispatch queue.

### 4. Order Cancellation & Refund System
- **Customer Cancellation**: Cancel orders at `RECEIVED` stage (100% full refund) or `COOKING` stage (50% partial refund).
- **Merchant / Rider Cancellation**: Cancel orders with a specified reason, automatically processing a 100% full refund to the customer.

---

## 🏗️ Microservices Architecture

```
                       +-------------------------+
                       |   React 18 Frontend     |
                       |   (Port 3000 / Vercel)  |
                       +------------+------------+
                                    |
                                    v
                       +-------------------------+
                       |    Spring Cloud Gateway |
                       |       (Port 8080)       |
                       +------------+------------+
                                    |
        +---------------------------+---------------------------+
        |                           |                           |
        v                           v                           v
+---------------+           +---------------+           +---------------+
|  User Service |           |Product Service|           | Order Service |
|  (Port 8081)  |           |  (Port 8082)  |           |  (Port 8083)  |
+---------------+           +---------------+           +---------------+
```

| Microservice | Port | Base Path | Description |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `8080` | `/api/*` | Routes client requests to microservices |
| **User Service** | `8081` | `/api/users` | Handles user registration and profiles |
| **Product Service** | `8082` | `/api/products` | Manages menu items, categories, and inventory stock |
| **Order Service** | `8083` | `/api/orders` | Manages order placement, status updates, and tracking |
| **Eureka Server** | `8761` | `/` | Service discovery registry |
| **Config Server** | `8888` | `/` | Centralized configuration management |

---

## 🔑 Test Accounts & Credentials

### Hotel Managers (Kitchen Portal - `/kitchen`):
- **Punjab Rasoi**: `chef@rasoi.in` | Password: `password123`
- **Paradise Biryani**: `hotel@flavordash.com` | Password: `password123`
- **Haveli North Indian**: `haveli@hotel.in` | Password: `password123`
- **MTR 1924**: `mtr1924@hotel.in` | Password: `password123`

### Rider Agents (Rider Portal - `/driver`):
- **Ramesh Kumar**: `ramesh@rider.in` | Password: `password123`
- **Suresh Verma**: `rider@flavordash.com` | Password: `password123`

### Customers (`/` & `/menu`):
- **Alex Johnson**: `alex@example.com` | Password: `password123`
- **Priya Sharma**: `customer@flavordash.com` | Password: `password123`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK (v17+)
- Maven (v3.8+)

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run at **http://localhost:3000**.

### 2. Backend Setup
```bash
# Start Config Server
java -jar config-server/target/config-server-1.0.0.jar

# Start Eureka Server
java -jar eureka-server/target/eureka-server-1.0.0.jar

# Start Services
java -jar user-service/target/user-service-1.0.0.jar
java -jar product-service/target/product-service-1.0.0.jar
java -jar order-service/target/order-service-1.0.0.jar
java -jar api-gateway/target/api-gateway-1.0.0.jar
```

---

## 🌐 Deployment

- **Frontend**: Deployed on **Vercel** (`https://flavordash-food-delivery.vercel.app`)
- **Backend**: Configured for deployment on **Render / Railway**
- **Repository**: [github.com/chaithanya762/flavordash-food-delivery](https://github.com/chaithanya762/flavordash-food-delivery)

---

## 📄 License

This project is licensed under the MIT License.
