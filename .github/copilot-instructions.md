# Copilot Instructions

Project-wide guidance for the ecommerce platform.

## Source of truth

- `projects/ecom/AGENTS.md`
- `README.md`
- `frontend/`
- Django backend files

## Commands

Run from the project root:

```bash
python -m venv env
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
python manage.py test
python manage.py collectstatic
python manage.py check --deploy
cd frontend && npm install
cd frontend && npm start
cd frontend && npm test
cd frontend && npm run build
```

## Architecture

- Django REST backend serves product, cart, checkout, and admin workflows.
- React frontend uses Redux + Thunk and React Bootstrap.
- PayPal integration is part of the user checkout flow.

## Conventions

- Use DRF serializers and ViewSets for API boundaries.
- Keep Redux code in the actions/reducers/constants pattern.
- Use environment variables for secrets and storage credentials.
- Preserve proxy/backend URL expectations when editing frontend code.

