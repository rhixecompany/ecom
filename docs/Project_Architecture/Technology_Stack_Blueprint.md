# Technology Stack Blueprint

## Project: ecom — Ecommerce Platform

> **Generated:** 2026-06-25  
> **Generator:** technology-stack-blueprint-generator  
> **Analysis Depth:** Comprehensive

---

## Overview

A full-stack ecommerce platform with a Django REST Framework backend and React/Redux frontend. Features product management, shopping cart, and PayPal payment integration.

**Project Type:** Full-Stack Ecommerce Application  
**Stack Type:** Dual-stack (Django + React)

---

## Technology Stack

### Languages & Runtimes

| Technology | Version | Usage |
|---|---|---|
| Python | ^3.10 | Backend language |
| JavaScript (ES6+) | — | Frontend language |
| Node.js | — | JavaScript runtime |
| HTML/CSS | — | Templates & styling |

### Backend Stack

| Category | Technologies |
|---|---|
| **Web Framework** | Django (latest) |
| **API Framework** | Django REST Framework |
| **Database** | PostgreSQL |
| **Serving** | Gunicorn |
| **Deployment** | Docker Compose |

### Frontend Stack

| Category | Technologies |
|---|---|
| **UI Framework** | React ^18.2.0 |
| **State Management** | Redux ^4.2.1, redux-thunk ^2.4.2 |
| **Routing** | React Router DOM ^5.2.0 |
| **UI Library** | React Bootstrap ^2.8.0, Bootstrap ^5.3.0 |
| **HTTP Client** | Axios ^1.4.0 |
| **Payments** | react-paypal-button-v2 ^2.6.3 |
| **Build Tool** | react-scripts 5.0.1 (Create React App) |
| **Testing** | @testing-library/react, @testing-library/jest-dom |

---

## Licensing

| Component | License |
|---|---|
| ecom app | (not specified) |

---

## Project Structure

```
ecom/
├── backend/
│   ├── requirements.txt
│   ├── manage.py
│   └── ... (Django apps)
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── store/         # Redux store
│       └── __tests__/
├── docker-compose.yml
└── AGENTS.md
```

---

## Key Scripts

| Command | Description |
|---|---|
| `python manage.py runserver` | Django backend server |
| `python manage.py test` | Run backend tests |
| `npm start` | React frontend dev server |
| `npm test` | Run frontend tests |
| `npm run build` | Production frontend build |

---

## API Endpoints

| Route | Purpose |
|---|---|
| `/api/v1/` | REST API base URL |
| `/api/v1/products/` | Product CRUD |
| `/api/v1/orders/` | Order management |
| `/api/v1/users/` | User management |

---

## Coding Conventions

- **Backend**: PEP 8, class-based views, Django best practices
- **Frontend**: React functional components, Redux for state
- **Environment**: `.env` for secrets (never committed)
- **Settings**: Separate settings per environment
- **API**: RESTful design at `/api/v1/`

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                 ecom Platform                        │
├──────────────────┬──────────────────────────────────┤
│   Backend (DRF)  │    Frontend (React)              │
│                  │                                  │
│  Django REST API │  React 18 + Redux                │
│  PostgreSQL      │  React Bootstrap                 │
│  Gunicorn        │  React Router                    │
│  Docker          │  Axios HTTP client               │
│                  │  PayPal Integration               │
├──────────────────┴──────────────────────────────────┤
│  API: /api/v1/                                      │
│  Payments: PayPal (react-paypal-button-v2)          │
│  Deployment: Docker Compose                         │
└─────────────────────────────────────────────────────┘
```
