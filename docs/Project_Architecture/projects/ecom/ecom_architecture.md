# Ecom — System Architecture Blueprint

> **Project:** ecom — Django + React Ecommerce Platform  
> **Generated:** 2026-07-24  
> **Mirror of:** `../ecom_architecture.md`

---

## 1. High-Level Architecture

Ecom is a **dual-stack** ecommerce platform: a Django REST Framework backend serves a React SPA frontend via RESTful JSON APIs.

```mermaid
graph TB
    subgraph "Client Tier"
        Browser["🌐 Browser"]
    end

    subgraph "Frontend Tier (React SPA)"
        React["React 18 + React Router"]
        Redux["Redux Store (Thunk Middleware)"]
        Components["React Bootstrap Components & Screens"]
        Axios["Axios HTTP Client (JWT Bearer Token)"]
    end

    subgraph "Backend Tier (Django REST)"
        Django["Django 3.1 WSGI/ASGI"]
        DRF["Django REST Framework (function-based views)"]
        JWT["SimpleJWT Auth (Access + Refresh Tokens)"]
        Serializers["DRF Serializers (Validation + Data Transform)"]
        Models["Django ORM Models (Product, Order, User)"]
        Admin["Django Admin /admin/"]
    end

    subgraph "Data Tier"
        DB[("SQLite (Dev) / PostgreSQL (Prod)")]
        Media[("Media Storage (Local / S3)")]
    end

    subgraph "External Services"
        PayPal["PayPal API (client-side SDK)"]
    end

    Browser --> React
    React --> Axios
    Axios --> DRF
    DRF --> JWT
    DRF --> Serializers
    Serializers --> Models
    Models --> DB
    React --> PayPal
    PayPal --> DRF
    DRF --> Admin
    Django --> Media
```

---

## 2. Request Lifecycle

```mermaid
sequenceDiagram
    participant U as User Browser
    participant R as React SPA
    participant A as Axios
    participant D as Django DRF
    participant DB as Database
    participant P as PayPal

    U->>R: Browse products
    R->>A: GET /api/products/
    A->>D: HTTP GET (JWT)
    D->>DB: Query Product
    DB-->>D: Product instances
    D-->>A: JSON (ProductSerializer)
    A-->>R: Dispatch action, update Redux
    R-->>U: Render product list

    U->>R: Checkout
    R->>P: Create PayPal order
    P-->>R: Payment approval
    R->>A: POST /api/orders/
    A->>D: Create Order + OrderItem + ShippingAddress
    D->>DB: Persist, update stock
    D-->>A: Order confirmation
    A-->>R: Update Redux
    R-->>U: Order confirmation
```

---

## 3. Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| Separate frontend/backend | Independent dev cycles, clear API contract |
| Function-based DRF views | Simpler than ViewSets for this scale |
| Redux + Thunk (not Toolkit) | Classic Redux — mature, well-understood |
| HashRouter | Avoids server-side URL handling for SPA |
| SimpleJWT 30d tokens | Pragmatic — users stay logged in |
| SQLite dev → PostgreSQL prod | Zero-config dev, production-grade persistence |
| PayPal client-side SDK | Tokenization by PayPal; backend verifies |

---

## 4. Backend Models

| Model | Fields | Relationships |
|-------|--------|--------------|
| **Product** | `_id`, `name`, `image`, `brand`, `category`, `description`, `rating`, `numReviews`, `price`, `countInStock`, `createdAt` | FK → User (seller) |
| **Review** | `_id`, `name`, `rating`, `comment`, `createdAt` | FK → Product, FK → User |
| **Order** | `_id`, `paymentMethod`, `taxPrice`, `shippingPrice`, `totalPrice`, `isPaid`, `paidAt`, `isDelivered`, `deliveredAt`, `createdAt` | FK → User |
| **OrderItem** | `_id`, `name`, `qty`, `price`, `image` | FK → Product, FK → Order |
| **ShippingAddress** | `_id`, `address`, `city`, `postalCode`, `country`, `shippingPrice` | OneToOne → Order |
