# Ecom — Project Folder Structure Blueprint

> **Project:** ecom — Django + React Ecommerce Platform  
> **Generated:** 2026-07-24  
> **Source:** On-disk directory tree analysis

---

## 1. Full Directory Tree

```
ecom/
│
├── AGENTS.md                          # Project context & commands for AI agents
├── API_REFERENCE.md                   # REST API endpoint reference
├── ARCHITECTURE.md                    # Architecture overview
├── AUDIT_ecom.md                      # Project audit report
├── CHANGELOG.md                       # Release history
├── CODE_OF_CONDUCT.md                 # Community guidelines
├── CONTRIBUTING.md                    # Contribution guide
├── DATABASE_SCHEMA.md                 # Database ERD
├── DEPLOYMENT_GUIDE.md                # Production deployment steps
├── DEVELOPMENT_GUIDE.md               # Local setup guide
├── README.md                          # Project overview
├── REPOSITORY_SUMMARY.md              # Summary for AI consumption
├── RESEARCH_REPORT.md                 # Competitive research
├── SECURITY.md                        # Security policy
├── SETUP_GUIDE.md                     # Setup instructions
├── TESTING_GUIDE.md                   # Test documentation
├── THE_STORY_OF_THIS_REPO.md          # Repo origin history
│
├── code-exemplars.md                  # Code style examples
├── copilot-instructions.md            # GitHub Copilot config
├── cross-linking-report.md            # Doc cross-reference report
├── execution-summary.md               # Previous workflow execution summary
├── folder-structure.md                # Legacy folder structure doc
├── project-workflow.md                # Workflow documentation
├── technology-stack.md                # Legacy tech stack doc
├── validation-report.md               # Validation results
├── web-research-ecom.md               # Web research output
│
├── manage.py                          # Django CLI entry point
├── requirements.txt                   # Python dependencies (pip)
├── Pipfile                            # Python dependencies (Pipenv)
├── Pipfile.lock                       # Locked Pipenv dependencies
├── runtime.txt                        # Python version (3.10.4)
├── modules.txt                        # Installed Python modules list
├── Procfile                           # Heroku deployment command
├── .env.example                       # Environment variable template
├── .gitignore                         # Git exclusion rules
│
├── ecom.service                       # Systemd service unit
├── ecom.socket                        # Systemd socket unit
├── install.sh                         # Deployment install script
│
├── ecom/                              # Django project configuration
│   ├── __init__.py
│   ├── settings.py                    # Django settings (SQLite dev, CORS, JWT)
│   ├── urls.py                        # Root URL configuration
│   ├── wsgi.py                        # WSGI application
│   └── asgi.py                        # ASGI application
│
├── base/                              # Django app (core ecommerce logic)
│   ├── __init__.py
│   ├── apps.py                        # App config (BaseConfig)
│   ├── admin.py                       # Admin registration (Product, Review, Order, etc.)
│   ├── models.py                      # Product, Review, Order, OrderItem, ShippingAddress
│   ├── serializers.py                 # DRF serializers (User, Product, Order, etc.)
│   ├── products.py                    # Static product seed data (6 products)
│   ├── signals.py                     # pre_save hook: sync user.username = user.email
│   ├── tests.py                       # Placeholder test file
│   │
│   ├── migrations/
│   │   ├── __init__.py
│   │   └── 0001_initial.py            # Initial database migration
│   │
│   ├── urls/                          # Per-feature URL routing
│   │   ├── product_urls.py            # /api/products/ routes
│   │   ├── order_urls.py              # /api/orders/ routes
│   │   └── user_urls.py               # /api/users/ routes
│   │
│   └── views/                         # Per-feature API views
│       ├── product_views.py           # Product CRUD, reviews, image upload
│       ├── order_views.py             # Order creation, payment, delivery
│       └── user_views.py              # Auth, registration, profile, admin
│
├── frontend/                          # React SPA frontend
│   ├── package.json                   # Node dependencies
│   ├── package-lock.json              # Locked dependencies
│   ├── public/
│   │   └── index.html                 # SPA entry HTML
│   │
│   └── src/
│       ├── index.js                   # React entry point
│       ├── index.css                  # Global styles
│       ├── App.js                     # Root component (HashRouter + Route definitions)
│       ├── store.js                   # Redux store (combineReducers, thunk middleware)
│       │
│       ├── constants/                 # Redux action type constants
│       │   ├── productConstants.js
│       │   ├── cartConstants.js
│       │   ├── orderConstants.js
│       │   └── userConstants.js
│       │
│       ├── actions/                   # Redux action creators (async thunks)
│       │   ├── productActions.js
│       │   ├── cartActions.js
│       │   ├── orderActions.js
│       │   └── userActions.js
│       │
│       ├── reducers/                  # Redux reducers
│       │   ├── productReducers.js
│       │   ├── cartReducers.js
│       │   ├── orderReducers.js
│       │   └── userReducers.js
│       │
│       ├── screens/                   # Page-level components
│       │   ├── HomeScreen.js          # Product listing with carousel + pagination
│       │   ├── ProductScreen.js       # Product detail + reviews
│       │   ├── CartScreen.js          # Shopping cart management
│       │   ├── LoginScreen.js         # User login
│       │   ├── RegisterScreen.js      # User registration
│       │   ├── ProfileScreen.js       # User profile edit
│       │   ├── ShippingScreen.js      # Shipping address form
│       │   ├── PaymentScreen.js       # Payment method selection
│       │   ├── PlaceOrderScreen.js    # Order summary + place
│       │   ├── OrderScreen.js         # Order detail + PayPal button
│       │   ├── UserListScreen.js      # Admin: user management
│       │   ├── UserEditScreen.js      # Admin: edit user
│       │   ├── ProductListScreen.js   # Admin: product management
│       │   ├── ProductEditScreen.js   # Admin: edit product
│       │   └── OrderListScreen.js     # Admin: order management
│       │
│       └── components/                # Reusable UI components
│           ├── Header.js              # Navbar with search, cart icon, user menu
│           ├── Footer.js              # Page footer
│           ├── Product.js             # Product card
│           ├── Rating.js              # Star rating display
│           ├── Loader.js              # Loading spinner
│           ├── Message.js             # Alert messages
│           ├── FormContainer.js       # Form layout wrapper
│           ├── CheckoutSteps.js       # Progress indicator (shipping → payment → place)
│           ├── Paginate.js            # Pagination component
│           ├── ProductCarousel.js     # Top-rated product carousel
│           ├── SearchBox.js           # Product search input
│           └── productConstants.js    # Product constants (shared)
│
├── resources/
│   ├── products.js                    # Frontend product seed data (JS)
│   ├── products.py                    # Backend product seed data (Python)
│   ├── bucket-policy.txt             # S3 bucket policy template
│   ├── favicon.ico                    # Site favicon
│   └── images/
│       ├── sample.jpg
│       ├── airpods.jpg
│       ├── alexa.jpg
│       ├── camera.jpg
│       ├── mouse.jpg
│       ├── phone.jpg
│       └── playstation.jpg
│
├── docs/
│   ├── README.md                      # Documentation index
│   ├── ARCHITECTURE.md                # Detailed architecture doc
│   ├── AUDIT_REPORT.md                # Code audit report
│   ├── CONTRIBUTING.md                # Contribution guide (docs)
│   ├── DEVELOPER_GUIDE.md             # Developer setup guide
│   ├── USER_GUIDE.md                  # End-user guide
│   ├── ecom-triage-context.md         # Triage context for debugging
│   ├── create-docx.js                 # Docx generator script (Node.js)
│   ├── package.json                   # Docs NPM package
│   ├── package-lock.json
│   ├── node_modules/                  # Docs dependencies
│   ├── RhixeCompany_Ecom_Documentation.docx  # Generated documentation
│   │
│   └── Project_Architecture/          # Blueprint documents
│       ├── exemplars.md
│       ├── Workflow_Analysis.md
│       ├── Project_Architecture_Blueprint.md
│       ├── Project_Folder_Structure.md
│       ├── Technology_Stack_Blueprint.md
│       ├── ecom_architecture.md       # ← Current file
│       ├── ecom_folders.md            # ← Current file
│       ├── ecom_techstack.md          # ← Current file
│       └── projects/ecom/             # Mirror copies in subdir
│           ├── ecom_architecture.md
│           ├── ecom_folders.md
│           └── ecom_techstack.md
│
├── .github/
│   └── workflows/
│       └── ci.yml                     # CI pipeline (Python check + test)
│
├── .vscode/
│   ├── extensions.json                # Recommended VS Code extensions
│   ├── settings.json                  # Workspace settings
│   ├── launch.json                    # Debug configurations
│   └── tasks.json                     # Build tasks
│
└── db.sqlite3                         # SQLite development database (committed)
```

---

## 2. Layout Summary

| Area | Path | Purpose |
|------|------|---------|
| **Django Config** | `ecom/` | Project settings, URL routing, WSGI/ASGI entry |
| **Core App** | `base/` | Models, API views, serializers, admin, migrations |
| **Frontend App** | `frontend/` | React SPA with Redux state management |
| **Static Assets** | `resources/` | Product images, seed data, favicon |
| **Documentation** | `docs/` | Guides, reports, architecture blueprints |
| **CI/CD** | `.github/workflows/` | GitHub Actions CI pipeline |
| **IDE Config** | `.vscode/` | Editor settings, debug configs, tasks |

---

## 3. Framework Conventions

| Layer | Convention | Examples |
|-------|------------|----------|
| **Django apps** | Single `base/` app (not split per domain) | `base/models.py`, `base/views/` |
| **Django URLs** | Per-feature URL modules under `base/urls/` | `product_urls.py`, `order_urls.py` |
| **API Views** | Function-based `@api_view` decorators | `getProducts`, `addOrderItems` |
| **Redux** | Classic Redux (actions/constants/reducers) — not Toolkit | `store.js` uses `applyMiddleware(thunk)` |
| **React Components** | Screens (page-level) vs Components (reusable) | `screens/HomeScreen.js`, `components/Header.js` |
| **Routes** | HashRouter (not BrowserRouter) | `#/`, `#/login`, `#/admin/productlist` |

---

## 4. Key File Counts (source only, excluding node_modules and .git)

| Category | Count |
|----------|-------|
| Python files (.py) | 20+ |
| JavaScript files (.js) | 30+ |
| Markdown docs (.md) | 25+ |
| Static images | 7 |
| Migration files | 1 (initial) |
