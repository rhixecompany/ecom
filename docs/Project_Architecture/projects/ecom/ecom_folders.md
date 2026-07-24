# Ecom — Project Folder Structure Blueprint

> **Project:** ecom — Django + React Ecommerce Platform  
> **Generated:** 2026-07-24  
> **Mirror of:** `../ecom_folders.md`

---

## Complete Directory Tree

```
ecom/
│
├── AGENTS.md                        # Project context & commands
├── manage.py                        # Django CLI entry point
├── requirements.txt                 # Python dependencies
├── Pipfile / Pipfile.lock           # Pipenv deps
├── runtime.txt                      # Python 3.10.4
├── Procfile                         # Heroku deploy
├── .env.example                     # Environment vars template
│
├── ecom/                            # Django project config
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── base/                            # Core Django app
│   ├── __init__.py
│   ├── apps.py                      # BaseConfig
│   ├── admin.py                     # Admin: Product, Review, Order, etc.
│   ├── models.py                    # Product, Review, Order, OrderItem, ShippingAddress
│   ├── serializers.py               # DRF serializers
│   ├── products.py                  # Seed data
│   ├── signals.py                   # pre_save User hook
│   ├── tests.py
│   ├── migrations/
│   │   ├── __init__.py
│   │   └── 0001_initial.py
│   ├── urls/
│   │   ├── product_urls.py
│   │   ├── order_urls.py
│   │   └── user_urls.py
│   └── views/
│       ├── product_views.py
│       ├── order_views.py
│       └── user_views.py
│
├── frontend/                        # React SPA
│   ├── package.json
│   ├── public/index.html
│   └── src/
│       ├── index.js / index.css
│       ├── App.js                   # Routes
│       ├── store.js                 # Redux store
│       ├── constants/               # Action type constants
│       ├── actions/                 # Async thunk actions
│       ├── reducers/                # Reducers
│       ├── screens/                 # 15 page-level components
│       └── components/              # 11 reusable components
│
├── resources/                       # Assets
│   ├── products.js / products.py    # Seed data
│   └── images/                      # 7 product images
│
├── docs/                            # Documentation
│   ├── Project_Architecture/
│   │   ├── ecom_architecture.md
│   │   ├── ecom_folders.md
│   │   ├── ecom_techstack.md
│   │   ├── project_architecture_blueprint.md
│   │   └── ...
│   └── ...
│
├── .github/workflows/ci.yml         # CI pipeline
├── .vscode/                         # Editor config
├── ecom.service / ecom.socket       # Systemd units
└── db.sqlite3                       # Dev database
```
