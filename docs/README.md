# RhixeCompany E-Commerce Platform

A full-featured e-commerce website built with Django (backend) and React (frontend).

## Overview

RhixeCompany Ecom is a production-ready e-commerce platform featuring user authentication, product management, shopping cart, order processing, and payment integration via PayPal. The backend provides a REST API with JWT authentication, while the frontend offers a responsive React-based user interface.

## Features

- **Shopping Cart**: Full-featured cart with add/remove items, quantity adjustment
- **Product Catalog**: Product listings with search, pagination, and filtering
- **Product Reviews**: Rating and review system for products
- **User Accounts**: Registration, login, profile management, order history
- **Admin Dashboard**: Product, user, and order management for administrators
- **Order Processing**: Complete checkout flow with shipping and payment
- **Payment Integration**: PayPal and credit card payment processing
- **Mobile Responsive**: Fully responsive design for all devices

## Quick Start

### Backend Setup (Django)

```bash
# Navigate to project directory
cd ecom

# Create and activate virtual environment
pipenv shell

# Install dependencies
pipenv install --skip-lock

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

### Frontend Setup (React)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## Documentation

- [Architecture](ARCHITECTURE.md) - System design and components
- [User Guide](USER_GUIDE.md) - Usage examples and configuration
- [Developer Guide](DEVELOPER_GUIDE.md) - Development setup and contribution
- [Contributing](CONTRIBUTING.md) - Contribution guidelines

## Tech Stack

- **Backend**: Django 4.0, Django REST Framework, SQLite/PostgreSQL
- **Frontend**: React 18, Redux, React Router
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Payment**: PayPal SDK
- **Database**: SQLite (development), PostgreSQL (production)
- **Deployment**: WhiteNoise, AWS S3

## Live Demo

Visit [https://www.rhixe.company/](https://www.rhixe.company/) to see the live application.

## License

Proprietary - All rights reserved