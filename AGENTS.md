# Ecom - Full-Stack Ecommerce Platform Context

Django REST Framework + React/Redux ecommerce with PayPal.

## Architecture
- **Backend**: Django REST Framework (Python)
- **Frontend**: React + Redux
- **Database**: PostgreSQL
- **Payments**: PayPal
- **Deployment**: Docker Compose

## Conventions
- **Backend**: PEP 8, type hints, Django best practices
- **Frontend**: Redux Toolkit, functional components
- API endpoints at `/api/v1/`
- Tests in `tests/` (backend) and `__tests__/` (frontend)

## Commands
```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py runserver

# Frontend
cd frontend
npm install
npm start

# Database
python manage.py migrate
python manage.py makemigrations

# Tests
python manage.py test
npm test
```

## Important Notes
- PayPal credentials in `.env` — never commit
- Separate settings for dev/staging/prod
- Media files served via Django in dev