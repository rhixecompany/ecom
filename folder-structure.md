# Folder Structure — ecom

```
ecom/
├── backend/                     # Django project root
│   ├── ecom/                    # Django project config
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/                    # Django applications
│   │   ├── products/            # Product management
│   │   ├── orders/              # Order processing
│   │   ├── users/               # User accounts
│   │   └── payments/            # PayPal integration
│   ├── static/                  # Static files
│   ├── templates/               # Django templates
│   ├── manage.py
│   └── requirements.txt
├── frontend/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── screens/             # Page-level components
│   │   ├── actions/             # Redux actions
│   │   ├── reducers/            # Redux reducers
│   │   ├── constants/           # Action constants
│   │   └── utils/               # Utilities
│   ├── package.json
│   └── ... (CRA setup)
├── Procfile                     # Heroku deployment
└── AGENTS.md
```
