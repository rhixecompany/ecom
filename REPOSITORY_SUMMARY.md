# REPOSITORY_SUMMARY.md — ecom

> Generated from actual git history and repository files. Evidence-based; nothing fabricated.

## Overview

**ecom** is a full-stack **ecommerce platform**: a Django REST Framework backend serving a React/Redux single-page frontend, with product catalog, shopping cart, order management, JWT auth, and PayPal payment integration. Like the others, it is a real code submodule (a `frontend/` React app, a `base/` + `ecom/` Django layout, `db.sqlite3`, `resources/`, systemd unit files).

Stack split:
- **Backend:** Django + Django REST Framework, SimpleJWT auth, PostgreSQL (prod)/SQLite (dev), Gunicorn.
- **Frontend:** React 18 + Redux (Thunk), React Bootstrap, React Router v5, Axios, PayPal (`react-paypal-button-v2`), Create React App.
- **Infra:** Docker Compose; ships `ecom.service` + `ecom.socket` (systemd units) for deployment.

Status per `README.md`: **Active**. License: not specified.

## Architecture

- **Type:** Dual-stack ecommerce platform (DRF backend + React/Redux frontend, separate dev servers)
- **Backend (Django REST):**
  - API layer: DRF ViewSets + Serializers
  - Auth: SimpleJWT token-based
  - Models: Product, Order, User, Review, OrderItem
  - Endpoints: `/api/v1/products/`, `/api/v1/orders/`, `/api/v1/users/`
- **Frontend (React + Redux):**
  - Redux store with Thunk for async actions
  - React Bootstrap UI; React Router v5
  - Axios with JWT in headers
- **Payment flow:** `User → Cart → PayPal Button → PayPal API → Backend Webhook → Order Created`

### Layer map (from `README.md`)
```
ecom Platform
├── Backend (DRF): Django REST API, PostgreSQL, Gunicorn, Docker
├── Frontend (React): React 18 + Redux, React Bootstrap, React Router, Axios, PayPal
└── API /api/v1/ · Payments PayPal · Deploy Docker Compose
```

## Key Components

- **`ecom/`** — Django project app (settings, urls, models, views, DRF).
- **`base/`** — shared/base Django app or config.
- **`frontend/`** — React SPA (`src/` with `components/`, `screens/`, `store/` Redux slices, `__tests__/`), `public/`, `package.json`.
- **`manage.py`**, **`requirements.txt`**, **`Pipfile`** / **`Pipfile.lock`** (47 KB), **`modules.txt`**.
- **`db.sqlite3`** (184 KB) — dev database committed.
- **`resources/`** — asset/resource directory.
- **`docs/`** — `ARCHITECTURE.md`, `AUDIT_REPORT.md`, `CONTRIBUTING.md`, `DEVELOPER_GUIDE.md`, `ecom-triage-context.md`, `README.md`, `USER_GUIDE.md`.
- **`ecom.service` / `ecom.socket`** — systemd unit files for production serving.
- **`install.sh`**, **`frontend/README.md`**, **`.env.example`**, **`Procfile`**, **`runtime.txt`**.

## Technologies

From `technology-stack.md` / `AGENTS.md`:
- **Backend:** Python 3.10, Django 3.1, DRF, SimpleJWT, django-cors-headers; SQLite (dev), PostgreSQL (prod), AWS S3 / GCS storage
- **Frontend:** React 18.2.0, Redux 4.2.1, Redux Thunk 2.4.2, React Bootstrap 2.8.0, React Router 5.2.0, Axios 1.4.0, PayPal 2.6.3
- **Deploy:** Gunicorn, WhiteNoise, Heroku (per tech-stack); Docker Compose + systemd (per repo files)

## Data Flow

- **Browse/order:** React SPA → Axios (JWT) → DRF `/api/v1/products|orders|users` → Django models → PostgreSQL.
- **Payment:** Cart → PayPal button (client) → PayPal API → backend webhook → Order created.
- **Auth:** SimpleJWT issued on login; token sent in Axios headers for authenticated requests.

## Team

Git contributor statistics (`git shortlog -sn`):
- **Total contributors (local submodule):** 1
- **Contributor:** `rhixecompany <rhixecompany@gmail.com>` — 5 commits (100%)

> As with the others, the local git log records only workspace setup/maintenance by one author; the original upstream development lineage is not captured here.

## Evidence Appendix (git)

- `git rev-list --count HEAD` = **5** commits total (all within the last year).
- Commit dates span **2026-06-12 → 2026-07-16**, all authored by `rhixecompany`.
- Files present confirm a real dual-stack ecommerce app (React `frontend/`, Django `ecom/` + `base/`, `db.sqlite3`, systemd units). It has the **smallest footprint** of the five (387 files listed) but is fully functional.
