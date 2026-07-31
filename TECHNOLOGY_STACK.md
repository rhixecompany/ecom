# 🏗 Technology Stack Blueprint - ecom

**Project Path:** `projects/ecom`
**Generated:** 2026-07-28
**Status:** Maintenance (Legacy Django 3.1 + React/Redux)

---

## Architecture Overview

**Pattern:** Dual-stack — Separate Django REST backend + React/Redux frontend
**Structure:**
```
ecom/
├── backend/      # Django 3.1 + DRF
└── frontend/     # React + Redux Toolkit
```

---

## Backend Stack (`backend/`)

| Category | Technology | Version | License |
|----------|-----------|---------|---------|
| **Framework** | Django | 3.1.14 | BSD |
| **API** | Django REST Framework | 3.13.1 | MIT |
| **Language** | Python | 3.10 | PSF |
| **Database** | PostgreSQL | Latest | PostgreSQL |
| **Auth** | SimpleJWT | 5.2.0 | MIT |
| **CORS** | django-cors-headers | 3.11.0 | MIT |
| **Admin** | django-ckeditor | 6.3.2 | BSD |
| **Forms** | django-crispy-forms | 1.14.0 | MIT |
| **Filters** | django-filter | 21.1 | MIT |
| **Static Files** | WhiteNoise | 5.1.0 | MIT |
| **Storage** | django-storages + boto3/S3 | 1.12.3 / 1.14.31 | BSD |
| **Payments** | PayPal SDK | Latest | - |
| **WSGI** | Gunicorn | 20.1.0 | MIT |
| **Env** | python-dotenv | 0.20.0 | BSD |

### Key Dependencies (`requirements.txt` / `Pipfile`)
```text
Django==3.1.14
djangorestframework==3.13.1
djangorestframework-simplejwt==5.2.0
django-cors-headers==3.11.0
django-ckeditor==6.3.2
django-crispy-forms==1.14.0
django-filter==21.1
django-js-asset==2.0.0
django-storages==1.12.3
gunicorn==20.1.0
psycopg2-binary==2.9.3
boto3==1.14.31
botocore==1.17.31
python-dotenv==0.20.0
paypalrestsdk==1.13.1
```

---

## Frontend Stack (`frontend/`)

| Category | Technology | Version | License |
|----------|-----------|---------|---------|
| **Framework** | React | 18.x | MIT |
| **State** | Redux Toolkit | Latest | MIT |
| **HTTP** | Axios | Latest | MIT |
| **UI** | Bootstrap / Custom CSS | Latest | MIT |
| **Testing** | @testing-library/react | Latest | MIT |
| **Build** | Create React App (react-scripts) | 5.x | MIT |

### Key Dependencies (`frontend/package.json`)
```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.x",
    "axios": "^1.x",
    "bootstrap": "^5.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-redux": "^8.x",
    "react-router-dom": "^6.x",
    "redux-thunk": "^2.x"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.x",
    "@testing-library/react": "^13.x",
    "@testing-library/user-event": "^14.x",
    "react-scripts": "5.0.1"
  }
}
```

---

## API Design

```
GET    /api/v1/products/           # List products
GET    /api/v1/products/{id}/      # Product detail
POST   /api/v1/cart/               # Add to cart
GET    /api/v1/cart/               # View cart
POST   /api/v1/orders/             # Create order
GET    /api/v1/orders/             # List orders
POST   /api/v1/payments/paypal/    # PayPal payment
POST   /api/v1/auth/login/         # JWT login
POST   /api/v1/auth/register/      # Registration
```

---

## Database Models

```python
# backend/apps/core/models.py
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    stock = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(choices=ORDER_STATUS)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    paypal_order_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items')
    product = models.ForeignKey(Product)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
```

---

## Project Structure

```
ecom/
├── backend/
│   ├── apps/
│   │   ├── core/              # Products, orders, cart
│   │   ├── accounts/          # User management
│   │   └── payments/          # PayPal integration
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── local.py
│   │   │   └── production.py
│   │   └── urls.py
│   ├── manage.py
│   ├── requirements.txt
│   └── Pipfile
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── slices/
│   │   │   └── api/
│   │   ├── services/
│   │   └── App.js
│   ├── package.json
│   └── package-lock.json
└── docker-compose.yml
```

---

## Development Workflow

### Backend
```bash
cd backend
pip install -r requirements.txt
# or: pipenv install
python manage.py migrate
python manage.py runserver  # :8000
```

### Frontend
```bash
cd frontend
npm install
npm start  # :3000, proxies API to :8000
```

### Full Stack
```bash
# Terminal 1
cd backend && python manage.py runserver

# Terminal 2
cd frontend && npm start

# Or Docker
docker-compose up -d
```

---

## Settings Configuration

### Django Settings (`config/settings/`)
- **base.py** — Shared config
- **local.py** — Debug=True, SQLite, console email
- **production.py** — Debug=False, PostgreSQL, S3, Gunicorn

### Environment Variables (`.env`)
```env
SECRET_KEY=...
DEBUG=False
DATABASE_URL=postgres://...
ALLOWED_HOSTS=example.com
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_STORAGE_BUCKET_NAME=...
```

---

## Deployment

### Production Stack
```
Nginx (reverse proxy, SSL)
    ├─▶ Gunicorn :8000 (Django)
    └─▶ Static files (WhiteNoise/S3)
```

### Docker Compose
```yaml
services:
  backend:
    build: ./backend
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000
    volumes: [...]
    environment: [...]
  
  frontend:
    build: ./frontend
    command: npm run build && serve -s build
    ports: ["3000:3000"]
  
  db:
    image: postgres:15
    volumes: [...]
  
  redis:
    image: redis:7
```

---

## Quality & Testing

| Layer | Tool | Command |
|-------|------|---------|
| **Python Lint** | flake8/pylint (legacy) | `flake8 backend/` |
| **Python Type** | mypy (not configured) | - |
| **Python Test** | pytest / Django test | `python manage.py test` |
| **JS Lint** | ESLect (CRA default) | `npm run lint` |
| **JS Test** | Jest (CRA default) | `npm test` |

---

## CI/CD

**Workflow:** `.github/workflows/ecom-ci.yml`

1. **Backend**: Install → lint → test → build Docker
2. **Frontend**: Install → lint → test → build
3. **Integration**: Docker compose up → smoke tests

---

## Known Issues & Migration Path

| Issue | Impact | Resolution |
|-------|--------|------------|
| Django 3.1 EOL (April 2022) | Security, no updates | Upgrade to Django 5.x |
| Python 3.10 EOL (Oct 2026) | End of support | Upgrade to 3.12+ |
| CRA deprecated | No updates, slow | Migrate to Vite/Next.js |
| Redux Toolkit v1 | Old patterns | Upgrade to v2 |
| No TypeScript | No type safety | Add TypeScript |

**Recommended Migration:**
1. Upgrade Django → 5.x, Python → 3.12
2. Replace CRA frontend with Next.js 15 (App Router)
3. Add TypeScript across stack
4. Migrate to Drizzle ORM or keep DRF with proper typing
5. Use modern auth (NextAuth.js or Django Allauth)

---

## License Summary

| Component | License |
|-----------|---------|
| Django/DRF | BSD / MIT |
| React/Redux | MIT |
| Bootstrap | MIT |
| PayPal SDK | Proprietary (PayPal) |
| All others | MIT / BSD |

---

*Generated by Hermes Agent Technology Stack Blueprint Generator*