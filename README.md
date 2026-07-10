# Ecom — Ecommerce Platform

> **Stack:** Django REST Framework + React/Redux | **Type:** Full-Stack Ecommerce | **Status:** Active

A full-stack ecommerce platform with a Django REST Framework backend and React/Redux frontend. Features product management, shopping cart, and PayPal payment integration.

---

## Technology Stack

### Backend

| Category | Technology |
|---|---|
| **Web Framework** | Django (latest) |
| **API Framework** | Django REST Framework (DRF) |
| **Language** | Python ^3.10 |
| **Authentication** | SimpleJWT |
| **Database** | PostgreSQL |
| **Serving** | Gunicorn |

### Frontend

| Category | Technology |
|---|---|
| **UI Framework** | React ^18.2.0 |
| **State Management** | Redux ^4.2.1, redux-thunk |
| **Routing** | React Router DOM ^5.2.0 |
| **UI Library** | React Bootstrap ^2.8.0, Bootstrap ^5.3.0 |
| **HTTP Client** | Axios ^1.4.0 |
| **Payments** | react-paypal-button-v2 |
| **Build Tool** | Create React App (react-scripts 5.0.1) |

## Architecture

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

## Project Structure

```
ecom/
├── backend/
│   ├── requirements.txt
│   ├── manage.py
│   └── ... (Django apps & settings)
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── components/      # React components
│       ├── screens/         # Page-level components
│       ├── store/           # Redux store (actions, reducers, constants)
│       └── __tests__/       # Frontend tests
├── docker-compose.yml
└── docs/Project_Architecture/
```

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py makemigrations
python manage.py runserver
python manage.py test
```

### Frontend

```bash
cd frontend
npm install
npm start        # Development server
npm test         # Run tests
npm run build    # Production build
```

### Docker

```bash
docker compose up -d
```

## API Endpoints

| Route | Purpose |
|---|---|
| `/api/v1/` | REST API base URL |
| `/api/v1/products/` | Product CRUD operations |
| `/api/v1/orders/` | Order management |
| `/api/v1/users/` | User management |

## Key Features

- **Product Catalog** — Browse and search products
- **Shopping Cart** — Add/remove items, manage quantities
- **Order Management** — Create and track orders
- **User Authentication** — JWT-based authentication
- **PayPal Integration** — Secure payment processing
- **Admin Dashboard** — Manage products, orders, users

## Coding Standards

### Backend

- **PEP 8**: Python style guide
- **DRF ViewSets + Serializers**: RESTful API design
- **SimpleJWT**: Token-based authentication
- **Serializer validation**: Input validation at API level

### Frontend

- **React functional components**: Modern React patterns
- **Redux state management**: `constants/actions/reducers` → components
- **Axios with JWT**: Authenticated HTTP requests
- **React Bootstrap**: UI component library

## Security

- No secrets in VCS (`.env` never committed)
- CORS via django-cors-headers
- DRF serializer validation
- JWT token authentication

## Deployment

- **Docker Compose**: Containerized deployment
- **Gunicorn**: WSGI server for production

## License

Not specified.
