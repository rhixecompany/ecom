# Developer Guide

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

## Local Development Setup

### Backend (Django)

1. **Clone the repository**
   ```bash
   git clone https://github.com/rhixecompany/ecom.git
   cd ecom
   ```

2. **Create virtual environment**
   ```bash
   # Using pipenv (recommended)
   pipenv shell

   # Or using venv
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # venv\Scripts\activate   # Windows
   ```

3. **Install dependencies**
   ```bash
   pipenv install --skip-lock

   # Or using requirements.txt
   pip install -r requirements.txt
   ```

4. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server**
   ```bash
   python manage.py runserver
   ```

   Backend runs at `http://localhost:8000`

### Frontend (React)

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

   Frontend runs at `http://localhost:3000`

## Running Tests

### Django Tests
```bash
python manage.py test
```

### React Tests
```bash
cd frontend
npm test
```

## Project Structure

### Backend Structure
```
ecom/
├── ecom/                    # Django project settings
│   ├── settings.py          # Configuration
│   ├── urls.py              # URL routing
│   └── wsgi.py              # WSGI config
├── base/                    # Main application
│   ├── models.py            # Database models
│   ├── views.py             # API views
│   ├── serializers.py       # DRF serializers
│   ├── urls.py              # App URLs
│   ├── admin.py             # Admin interface
│   └── migrations/          # Database migrations
├── db.sqlite3               # SQLite database
├── requirements.txt         # Python dependencies
├── Pipfile                  # Pipenv dependencies
├── manage.py                # Django management
└── Procfile                 # Deployment config
```

### Frontend Structure
```
frontend/
├── public/                  # Static public assets
├── src/                     # React source code
│   ├── actions/             # Redux actions
│   ├── components/          # Reusable components
│   ├── constants/           # Action type constants
│   ├── reducers/            # Redux reducers
│   ├── screens/             # Page components
│   ├── App.js               # Main app component
│   ├── index.js             # Entry point
│   └── store.js             # Redux store
├── package.json             # Node dependencies
└── .env                     # Environment config
```

## API Documentation

### Products API

```bash
# List products
GET /api/products/

# Product detail
GET /api/products/<id>/

# Create product (admin)
POST /api/products/
Authorization: Bearer <token>

# Update product (admin)
PUT /api/products/<id>/
Authorization: Bearer <token>

# Delete product (admin)
DELETE /api/products/<id>/
Authorization: Bearer <token>
```

### Orders API

```bash
# List orders
GET /api/orders/
Authorization: Bearer <token>

# Create order
POST /api/orders/

# Order detail
GET /api/orders/<id>/
Authorization: Bearer <token>

# Pay order
PUT /api/orders/<id>/pay/
Authorization: Bearer <token>

# Mark delivered (admin)
PUT /api/orders/<id>/deliver/
Authorization: Bearer <token>
```

### Authentication API

```bash
# Login
POST /api/users/login/
Body: {"email": "user@example.com", "password": "password"}

# Register
POST /api/users/register/
Body: {"name": "Name", "email": "user@example.com", "password": "password"}

# Get profile
GET /api/users/profile/
Authorization: Bearer <token>

# Update profile
PUT /api/users/profile/
Authorization: Bearer <token>
```

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (optional, defaults to SQLite)
DB_NAME=ecom
DB_USER=postgres
DB_PASS=password
DB_HOST=localhost
DB_PORT=5432
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

## Common Development Tasks

### Create a new Django model

1. Add model to `base/models.py`
2. Create migration: `python manage.py makemigrations`
3. Apply migration: `python manage.py migrate`
4. Add to admin: Edit `base/admin.py`

### Add a new React page

1. Create component in `frontend/src/screens/`
2. Add route in `frontend/src/App.js`
3. Add navigation link in header

### Add a new API endpoint

1. Add view in `base/views/`
2. Add serializer in `base/serializers.py`
3. Add URL pattern in `base/urls/`

## Troubleshooting

### Backend Issues

**Port already in use**
```bash
# Find process using port 8000
lsof -i :8000
# Kill process
kill -9 <PID>
```

**Database migration errors**
```bash
# Reset database
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Frontend Issues

**Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

**Port already in use**
```bash
# Use different port
PORT=3001 npm start
```

## Code Style

### Python (Django)

- Follow PEP 8
- Use Black for formatting
- Use isort for imports
- Add docstrings to classes and functions

### JavaScript (React)

- Use ESLint
- Follow Airbnb style guide
- Use functional components with hooks
- Prefer const over let

## Deployment

### Production Build (Frontend)
```bash
cd frontend
npm run build
```

The build output is served by Django from `frontend/build/`.

### Deploy to Heroku

```bash
# Add Procfile
echo "web: gunicorn ecom.wsgi" > Procfile

# Deploy
git push heroku main
```

## Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://reactjs.org/)
- [Redux Documentation](https://redux.js.org/)