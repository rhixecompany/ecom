# Project Workflow — ecom

## Development

```bash
# Backend
cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver  # Runs on :9000

# Frontend (separate terminal)
cd frontend
npm install
npm start  # Runs on :3000 (proxied to :9000)
```

## Testing
```bash
python manage.py test   # Django tests
cd frontend && npm test  # React tests
```

## Deployment
```bash
# Backend
python manage.py collectstatic
gunicorn ecom.wsgi:application --bind 0.0.0.0:9000

# Frontend
cd frontend && npm run build
```
