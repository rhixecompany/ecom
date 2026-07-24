# Ecom — Technology Stack Blueprint

> **Project:** ecom — Django + React Ecommerce Platform  
> **Generated:** 2026-07-24  
> **Mirror of:** `../ecom_techstack.md`

---

## Stack Overview

### Languages & Runtimes

| Technology | Version | Usage |
|-----------|---------|-------|
| Python | 3.10.4 | Backend |
| JavaScript (ES6+) | — | Frontend |
| Node.js | — | React build tooling |
| HTML/CSS | — | UI structure & style |

### Backend

| Category | Technology | Version |
|----------|-----------|---------|
| Web Framework | Django | 3.1.14 |
| API Framework | Django REST Framework | 3.13.1 |
| Auth | SimpleJWT | 5.2.0 |
| CORS | django-cors-headers | 3.11.0 |
| WSGI Server | Gunicorn | 20.1.0 |
| Static Files | WhiteNoise | 5.1.0 |
| DB (dev) | SQLite | built-in |
| DB (prod) | PostgreSQL | via psycopg2-binary 2.9.3 |
| File Storage | AWS S3 (via django-storages + boto3) | optional |
| Filtering | django-filter | 21.1 |

### Frontend

| Category | Technology | Version |
|----------|-----------|---------|
| UI Library | React | 18.2.0 |
| State Management | Redux | 4.2.1 |
| Async Middleware | Redux Thunk | 2.4.2 |
| Routing | React Router DOM | 5.2.0 |
| CSS Framework | Bootstrap | 5.3.0 |
| React Components | React Bootstrap | 2.8.0 |
| HTTP Client | Axios | 1.4.0 |
| Payments | react-paypal-button-v2 | 2.6.3 |
| DevTools | @redux-devtools/extension | 3.2.5 |
| Testing | @testing-library/react | 13.4.0 |

### DevOps

| Tool | Purpose |
|------|---------|
| GitHub Actions | CI pipeline (Python check) |
| Heroku | PaaS production hosting |
| Systemd | Linux service management |
| Docker Compose | Container orchestration (documented) |

---

## Key API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/users/login/` | — | Obtain JWT token |
| POST | `/api/users/register/` | — | Create account |
| GET | `/api/products/` | — | List products (paginated) |
| GET | `/api/products/:pk/` | — | Product detail |
| GET | `/api/products/top/` | — | Top-rated products |
| POST | `/api/orders/` | JWT | Create order (checkout) |
| PUT | `/api/orders/:pk/pay/` | JWT | Mark order paid |
| GET | `/api/admin/` | Admin | Django admin panel |

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DJANGO_SECRET_KEY` | ✅ | Django secret |
| `DATABASE_URL` | Prod | PostgreSQL connection |
| `PAYPAL_CLIENT_ID` | ✅ | PayPal SDK client ID |
| `PAYPAL_CLIENT_SECRET` | ✅ | PayPal server secret |
