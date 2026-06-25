# Ecom — Django + React Ecommerce

## Architecture
- **Type:** Dual-stack ecommerce platform (Django REST + React)
- **Pattern:** DRF backend + React/Redux frontend, separate dev servers
- **Reference:** [Workflow Analysis](docs/Project_Architecture/Workflow_Analysis.md), [Exemplars](docs/Project_Architecture/exemplars.md)

Django REST Framework + React/Redux + PayPal. Full ecommerce stack with separate backend (`backend/`) and frontend (`frontend/`) directories.

## Stack
- **Backend:** Django REST Framework, Python 3.10+
- **Frontend:** React + Redux Toolkit
- **Database:** PostgreSQL
- **Payments:** PayPal
- **Infra:** Docker Compose

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

## Conventions
- API at `/api/v1/` prefix
- Backend tests in `tests/`; frontend tests in `__tests__/`
- Separate settings per environment (dev/staging/prod)
- `.env` — never commit
- PEP 8 for Python; Prettier for JavaScript/React

## Notes
- Dual dev servers: backend on `:8000`, frontend on `:3000`
- Proxy frontend API calls to backend in development
- Docker Compose for production deployment
