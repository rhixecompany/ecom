# Architecture

## Overview

The RhixeCompany Ecom platform follows a traditional server-side rendered web application architecture with a REST API backend and a separate React frontend. The backend handles business logic, database operations, and authentication, while the frontend provides the user interface and state management.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                         │
│  ┌─────────────────────┐  ┌──────────────────────────────┐   │
│  │   React Frontend    │  │       Static Assets           │   │
│  │   (localhost:3000)  │  │   (CSS, JS, Images)           │   │
│  └─────────────────────┘  └────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Django Backend                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Django Server                         │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │   │
│  │  │  REST API   │  │   Views     │  │  Static Files  │  │   │
│  │  │  (JWT Auth) │  │  (Templates)│  │  (WhiteNoise)  │  │   │
│  │  └─────────────┘  └─────────────┘  └────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌───────────────────────────┴────────────────────────────┐   │
│  │                    Django ORM                            │   │
│  │  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌───────────┐  │   │
│  │  │Product  │  │  Order   │  │  User   │  │  Review   │  │   │
│  │  │ Model   │  │  Model   │  │  Model  │  │  Model    │  │   │
│  │  └─────────┘  └──────────┘  └────────┘  └───────────┘  │   │
│  └───────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                 Database (SQLite/PostgreSQL)             │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐    │
│  │   PayPal    │  │   AWS S3     │  │   Email (SMTP)      │    │
│  │   (Payments)│  │   (Images)  │  │   (Notifications)  │    │
│  └──────────────┘  └──────────────┘  └─────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Backend Architecture (Django)

### Project Structure

```
ecom/
├── ecom/                    # Main Django project
│   ├── settings.py         # Django settings configuration
│   ├── urls.py              # URL routing
│   ├── wsgi.py              # WSGI application
│   └── asgi.py              # ASGI application
├── base/                    # Main application
│   ├── models.py            # Database models
│   ├── views.py             # API views
│   ├── serializers.py       # DRF serializers
│   ├── urls.py              # URL patterns
│   ├── admin.py             # Admin configuration
│   └── signals.py           # Django signals
└── manage.py                # Django management script
```

### Models

| Model | Description |
|-------|-------------|
| **Product** | E-commerce products with name, price, description, image, brand, category |
| **Review** | Product reviews with rating (1-5) and comments |
| **Order** | Customer orders with payment and delivery status |
| **OrderItem** | Individual items within an order |
| **ShippingAddress** | Delivery address for orders |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products/` | GET, POST | List/create products |
| `/api/products/<id>/` | GET, PUT, DELETE | Product CRUD |
| `/api/products/<id>/reviews/` | GET, POST | Product reviews |
| `/api/orders/` | GET, POST | List/create orders |
| `/api/orders/<id>/` | GET, PUT | Order details |
| `/api/orders/<id>/pay/` | PUT | Mark order as paid |
| `/api/orders/<id>/deliver/` | PUT | Mark order as delivered |
| `/api/users/` | GET, POST | User management |
| `/api/users/login/` | POST | User authentication |
| `/api/users/profile/` | GET, PUT | User profile |

### Authentication

- **JWT (JSON Web Tokens)** via `djangorestframework-simplejwt`
- Access token lifetime: 30 days
- Refresh token lifetime: 1 day
- Authorization header: `Bearer <token>`

## Frontend Architecture (React)

### Project Structure

```
frontend/src/
├── App.js                   # Main application component
├── index.js                 # React entry point
├── store.js                 # Redux store configuration
├── actions/                 # Redux actions
│   ├── productActions.js
│   ├── userActions.js
│   ├── orderActions.js
│   └── cartActions.js
├── reducers/                # Redux reducers
│   ├── productReducers.js
│   ├── userReducers.js
│   ├── orderReducers.js
│   └── cartReducers.js
├── constants/               # Action type constants
├── screens/                 # Page components
│   ├── HomeScreen.js
│   ├── ProductScreen.js
│   ├── CartScreen.js
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── ProfileScreen.js
│   ├── OrderScreen.js
│   ├── OrderListScreen.js
│   ├── ProductListScreen.js
│   ├── ProductEditScreen.js
│   ├── UserListScreen.js
│   ├── UserEditScreen.js
│   ├── ShippingScreen.js
│   ├── PaymentScreen.js
│   ├── PlaceOrderScreen.js
│   └── CheckoutSteps.js
└── components/              # Reusable UI components
    ├── Header.js
    ├── Footer.js
    ├── Product.js
    ├── Rating.js
    ├── SearchBox.js
    ├── Paginate.js
    ├── Message.js
    ├── Loader.js
    ├── FormContainer.js
    ├── ProductCarousel.js
    └── CheckoutSteps.js
```

### State Management (Redux)

The application uses Redux for centralized state management:

- **cartReducer**: Shopping cart items and totals
- **userReducer**: Authentication state and user info
- **productReducer**: Product listings and details
- **orderReducer**: Order history and current order

### Routing (React Router)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomeScreen | Homepage with product listings |
| `/product/:id` | ProductScreen | Product details |
| `/cart` | CartScreen | Shopping cart |
| `/login` | LoginScreen | User login |
| `/register` | RegisterScreen | User registration |
| `/profile` | ProfileScreen | User profile |
| `/admin/orderlist` | OrderListScreen | Admin order management |
| `/admin/productlist` | ProductListScreen | Admin product management |
| `/admin/userlist` | UserListScreen | Admin user management |

## Security Considerations

### Backend

- CORS enabled for all origins (`CORS_ALLOW_ALL_ORIGINS = True`)
- JWT token-based authentication
- CSRF protection enabled
- X-Frame-Options middleware (clickjacking protection)
- Static file serving via WhiteNoise
- Secret key exposed in settings (should use environment variables in production)

### Recommendations for Production

1. **Environment Variables**: Move `SECRET_KEY` and database credentials to environment variables
2. **HTTPS**: Enable SSL/TLS in production
3. **CORS Restriction**: Limit `ALLOWED_HOSTS` and CORS origins
4. **Static Files**: Use cloud storage (AWS S3) instead of local filesystem
5. **Database**: Switch from SQLite to PostgreSQL for production
6. **Security Headers**: Add additional security headers (HSTS, CSP)

## Deployment

### Development
- Django: `python manage.py runserver`
- React: `npm start` (port 3000)
- Proxy configured to forward API requests to Django

### Production (Heroku-style)
- Debug mode disabled (`DEBUG = False`)
- WhiteNoise for static file serving
- Database: PostgreSQL
- File storage: AWS S3 (optional)

## Data Flow

1. **Product Browsing**: React → API → Django → SQLite → Response → React
2. **Add to Cart**: React (Redux) → Local state update
3. **Place Order**: React → API → Django → Database → Order confirmation
4. **Payment**: React → PayPal SDK → PayPal API → Confirmation → Django update
5. **Admin Actions**: React → JWT Auth → Django → Database CRUD operations