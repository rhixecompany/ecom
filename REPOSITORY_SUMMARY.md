# REPOSITORY_SUMMARY.md

# ecom — Django + React Ecommerce

**Generated:** 2026-07-25  
**Status:** Maintenance (Legacy Django 3.1)  
**Path:** `projects/ecom/`

---

## Architecture

| Property      | Value                                                                  |
| ------------- | ---------------------------------------------------------------------- |
| **Type**      | Dual-stack ecommerce platform                                          |
| **Pattern**   | DRF backend + React/Redux frontend, separate dev servers               |
| **Reference** | [Workflow Analysis](../docs/Project_Architecture/Workflow_Analysis.md) |

Django REST Framework + React/Redux + PayPal. Full ecommerce stack with separate backend (`backend/`) and frontend (`frontend/`) directories.

---

## Technology Stack

| Layer        | Technology                    |
| ------------ | ----------------------------- |
| **Backend**  | Django 3.1, DRF, Python 3.10+ |
| **Frontend** | React + Redux Toolkit         |
| **Database** | PostgreSQL                    |
| **Payments** | PayPal                        |
| **Infra**    | Docker Compose                |

---

## Project Structure

```
ecom/
├── backend/                    # Django project
│   ├── requirements.txt
│   └── ... (Django apps)
├── frontend/                   # React app
│   ├── package.json
│   └── src/
└── docker-compose.yml
```

---

## Commands

```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py migrate && python manage.py makemigrations
python manage.py runserver
python manage.py test

# Frontend
cd frontend
npm install
npm start
npm test
```

---

## Issues

| Issue             | Severity | Notes                               |
| ----------------- | -------- | ----------------------------------- |
| Django 3.1        | CRITICAL | EOL since 2021, no security patches |
| No CI/CD          | HIGH     | No GitHub Actions workflow          |
| Legacy PayPal SDK | MEDIUM   | Should upgrade to latest            |

---

## CI/CD

**Missing:** No project-level GitHub Actions workflow. Relies on root `pr-ci.yml` only.
