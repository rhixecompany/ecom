# Ecom — Django + React Ecommerce

**Naming**: `snake_case` for Python files/variables/functions; `PascalCase` for Django classes/models; `PascalCase` for React components; `camelCase` for JS variables/functions; `UPPER_SNAKE_CASE` for Redux action constants; `kebab-case` for directories.

**Patterns**: DRF ViewSets + Serializers for API; SimpleJWT authentication; React/Redux flux architecture (`constants → actions → reducers → components`); PayPal payment integration; Axios with JWT interceptor; separate backend/frontend environments.

**Structure**: `backend/` (Django/DRF); `frontend/` (React/Redux); `frontend/src/components/` (reusable components); `frontend/src/screens/` (page-level components); `frontend/src/{actions,reducers,constants}/` (Redux); `backend/tests/` and `frontend/__tests__/` (tests).

**Python/Django**: Python 3.10+; Django REST Framework; PEP 8 conventions; Black formatter; ViewSets + Serializers for CRUD; SimpleJWT for token auth; PostgreSQL (production); SQLite (development); `tests/` directory.

**React/Redux**: React with Redux Toolkit; React Bootstrap for UI; Axios for HTTP with JWT Bearer token; CRA configuration; ESLint via react-app preset.

**API**: RESTful at `/api/v1/`; DRF ViewSets + Serializers; JWT authentication via SimpleJWT; CORS enabled via django-cors-headers; PayPal order creation + capture endpoints.

**Security**: No `SECRET_KEY` or `.env` in VCS; DRF serializer validation for all inputs; CORS restricted in production; JWT token expiration enforced; PayPal credentials server-side only.

**Env**: `SECRET_KEY`, `DATABASE_URL`, `JWT_SECRET`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `CORS_ORIGINS`.

**Commands**: `cd backend && pip install -r requirements.txt && python manage.py migrate && python manage.py runserver` (backend); `cd frontend && npm install && npm start` (frontend); `python manage.py test` (backend tests); `npm test` (frontend tests); Docker Compose for production.
