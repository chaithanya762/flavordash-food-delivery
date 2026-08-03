# FlavorDash — Full-Stack Microservices Food Delivery Platform

FlavorDash is a full-stack, enterprise-grade food delivery application. The system is engineered using a **Java 17 Spring Boot 3 Microservices** backend and a responsive **React 18 + Vite** frontend. It provides a real-time, multi-role ecosystem seamlessly linking **Customers**, **Hotel Managers (Kitchen Desk)**, and **Rider Agents (GPS Telemetry)**.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18, Vite
- **Routing**: React Router DOM v6
- **State Management**: React Context API (`AuthContext`, `CartContext`, `OrderContext`, `ToastContext`)
- **Styling**: Vanilla CSS3 (Custom design system, glassmorphism, responsive grid layouts)

### Backend Microservices
- **Language & Core**: Java 17, Spring Boot 3.2.5
- **API Gateway**: Spring Cloud Gateway (Port 8080)
- **Service Discovery**: Netflix Eureka Server (Port 8761)
- **Config Management**: Spring Cloud Config Server (Port 8888)
- **Domain Services**:
  - `User Service` (Port 8081) — Handles registration, role authorization, and user profiles
  - `Product Service` (Port 8082) — Manages menu dishes, regional categories, and inventory stock
  - `Order Service` (Port 8083) — Manages order creation, status workflows, and tracking
  - `Payment Service` (Port 8084) — Handles payment verification and transaction records
- **Data & Persistence**: H2 In-Memory RDBMS (Development) / PostgreSQL (Production), Spring Data JPA
- **Inter-Service Communication**: OpenFeign REST Clients & Event Bus

---

## ✨ Features & User Roles

### 1. 👤 Customer Portal (`/`, `/menu`, `/cart`, `/checkout`, `/orders`)
- **Regional Menu Browsing**: Explore 27 authentic regional dishes across 7 categories (Main Dishes, Rice & Biryani, Breads, South Indian, Street Food, Sweets, Drinks).
- **Interactive Cart & Stepper**: Quantity stepper buttons (`- QTY +`) directly on food cards with real-time total calculation.
- **Express Checkout**: Select delivery location and payment method (UPI / GPay, Credit/Debit Card, Cash on Delivery).
- **Real-Time 5-Stage Order Tracker**: Live order progress tracking (`RECEIVED` ➔ `COOKING` ➔ `READY` ➔ `DISPATCHED` ➔ `DELIVERED`).
- **Strict Order Ownership**: Displays strictly the current user's active and past orders with no clutter.

### 2. 👨‍🍳 Hotel Manager Kitchen Desk (`/kitchen`)
- **Multi-Restaurant Support**: Pre-seeded manager accounts for all 18 menu restaurants (Punjab Rasoi, Paradise Biryani, MTR 1924, Haveli, etc.).
- **Kitchen Workflow Pipeline**: Progress incoming orders from `RECEIVED` ➔ `COOKING` ➔ `READY` ➔ `DISPATCHED`.
- **Inventory Stock Control**: Toggle dish availability (`🟢 In Stock` / `🔴 Sold Out`) to update frontend menus in real time.
- **Automatic Archive**: Completed (`DELIVERED`) and cancelled orders automatically archive from the active kitchen desk.

### 3. 🛵 Rider Agent GPS Portal (`/driver`)
- **Live GPS Telemetry Simulation**: Real-time coordinate stream (`LAT: 28.6139° N | LON: 77.2090° E`) and dynamic route marker movement.
- **Dispatch Task Queue**: Pick up ready orders and complete deliveries.
- **Rider Delivery Credits**: Earn **+1 Credit** per completed delivery, tracked on the rider profile dashboard.
- **Automatic Archive**: Delivered tasks automatically clear from the active dispatch queue.

### 4. 🚫 Order Cancellation & Refund System
- **Customer Cancellation**: Cancel orders at `RECEIVED` stage (100% full refund) or `COOKING` stage (50% partial refund).
- **Merchant / Rider Cancellation**: Cancel active orders with a specified reason, triggering an automatic 100% full refund to the customer.

---

## 🏗️ Architecture Diagram & Registry

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

| Service | Port | Endpoint Base | Purpose |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `8080` | `/api/*` | Central proxy routing requests to microservices |
| **User Service** | `8081` | `/api/users` | Manages user accounts and authentication |
| **Product Service** | `8082` | `/api/products` | Manages menu items and stock availability |
| **Order Service** | `8083` | `/api/orders` | Manages order workflow and status transitions |
| **Eureka Server** | `8761` | `/` | Service registration and discovery server |
| **Config Server** | `8888` | `/` | Central configuration repository |

---

## 🔑 Test Accounts & Demo Credentials

| Role | Name / Restaurant | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | Alex Johnson | `alex@example.com` | `password123` | `/menu` & `/orders` |
| **Customer** | Priya Sharma | `customer@flavordash.com` | `password123` | `/menu` & `/orders` |
| **Hotel Manager** | Punjab Rasoi | `chef@rasoi.in` | `password123` | Kitchen Desk (`/kitchen`) |
| **Hotel Manager** | Paradise Biryani | `hotel@flavordash.com` | `password123` | Kitchen Desk (`/kitchen`) |
| **Hotel Manager** | Haveli North Indian | `haveli@hotel.in` | `password123` | Kitchen Desk (`/kitchen`) |
| **Hotel Manager** | MTR 1924 | `mtr1924@hotel.in` | `password123` | Kitchen Desk (`/kitchen`) |
| **Rider Agent** | Ramesh Kumar | `ramesh@rider.in` | `password123` | Rider Portal (`/driver`) |
| **Rider Agent** | Suresh Verma | `rider@flavordash.com` | `password123` | Rider Portal (`/driver`) |

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- Java JDK (v17+)
- Maven (v3.8+)

### 1. Clone & Run Frontend
```bash
git clone https://github.com/chaithanya762/flavordash-food-delivery.git
cd flavordash-food-delivery/frontend
npm install
npm run dev
```
Access the application at **[http://localhost:3000](http://localhost:3000)**.

### 2. Run Microservices
```bash
# Start Config Server (Port 8888)
java -jar config-server/target/config-server-1.0.0.jar

# Start Eureka Discovery Server (Port 8761)
java -jar eureka-server/target/eureka-server-1.0.0.jar

# Start Domain Services & Gateway
java -jar user-service/target/user-service-1.0.0.jar
java -jar product-service/target/product-service-1.0.0.jar
java -jar order-service/target/order-service-1.0.0.jar
java -jar api-gateway/target/api-gateway-1.0.0.jar
```

---

## 🌐 Production Deployment

- **Frontend Deployment**: Hosted on **Vercel** (`https://flavordash-food-delivery.vercel.app`)
- **Backend Deployment**: Configured for **Render / Railway**
- **Repository**: [https://github.com/chaithanya762/flavordash-food-delivery](https://github.com/chaithanya762/flavordash-food-delivery)

---

### Made with ❤️ by Chaithanya
