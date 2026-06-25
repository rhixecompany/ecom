# Architecture — ecom

## Overview
A full-stack ecommerce platform with Django REST backend serving a React SPA frontend.

## Architecture

### Backend (Django REST)
- **API Layer**: DRF ViewSets and Serializers
- **Auth**: SimpleJWT token-based authentication
- **Models**: Product, Order, User, Review, OrderItem
- **Endpoints**: RESTful CRUD for products, orders, users

### Frontend (React + Redux)
- **State**: Redux store with Thunk middleware for async actions
- **Components**: React Bootstrap UI components
- **Routing**: React Router v5 for page navigation
- **API Calls**: Axios with JWT token in headers

### Payment Flow
```
User → Frontend (Cart) → PayPal Button → PayPal API → Backend Webhook → Order Created
```

## Key Design Decisions
1. Separated frontend/backend (not monolithic)
2. Redux for global state management
3. JWT authentication for stateless API access
4. PayPal client-side integration with server verification
