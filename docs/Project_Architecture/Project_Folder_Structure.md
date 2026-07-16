# Project Folder Structure Blueprint

## Project: ecom — Django + React Ecommerce Platform

**Generated:** 2026-06-25  
**Project Type:** Django Python + React Frontend (Full Stack Ecommerce)  
**Auto-detected:** Yes (Django — `manage.py`, `base/`, `ecom/`; React — `frontend/src/`)

---

## Directory Tree

```
ecom/
├── .github/
│   └── workflows/
├── .vscode/
├── AGENTS.md
├── API_REFERENCE.md
├── ARCHITECTURE.md
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── DATABASE_SCHEMA.md
├── DEPLOYMENT_GUIDE.md
├── DEVELOPMENT_GUIDE.md
├── Pipfile / Pipfile.lock
├── Procfile
├── README.md
├── RESEARCH_REPORT.md
├── SECURITY.md
├── SETUP_GUIDE.md
├── TESTING_GUIDE.md
├── base/                       # Django app(s)
│   ├── migrations/
│   ├── urls/
│   └── views/
├── code-exemplars.md
├── copilot-instructions.md
├── cross-linking-report.md
├── db.sqlite3
├── docs/
│   └── Project_Architecture/
├── ecom/                       # Django project config
├── env/                        # Python virtual environment
├── execution-summary.md
├── folder-structure.md
├── frontend/                   # React frontend
│   ├── public/
│   └── src/
│       ├── actions/
│       ├── components/
│       ├── constants/
│       ├── reducers/
│       └── screens/
├── manage.py
├── project-workflow.md
├── requirements.txt
├── resources/
│   └── images/
├── technology-stack.md
├── ecom.service / ecom.socket  # Systemd service files
└── validation-report.md
```

---

## Naming Conventions

| Convention | Pattern | Examples |
| --- | --- | --- |
| **Django apps** | lowercase | `base/`, `ecom/` |
| **React source** | kebab-case | `frontend/src/`, `frontend/src/components/` |
| **React modules** | lowercase | `actions/`, `constants/`, `reducers/`, `screens/` |
| **Config/setup** | dotted-prefix | `.github/`, `.vscode/` |
| **Systemd units** | lowercase.service | `ecom.service`, `ecom.socket` |

---

## File Placement Patterns

- **Backend (Django)**: `base/`, `ecom/`, `manage.py`
- **Frontend (React)**: `frontend/src/` with Redux-style structure
- **Python deps**: `requirements.txt`, `Pipfile`
- **Deployment**: `Procfile`, `ecom.service`, `ecom.socket`
- **Static assets**: `resources/images/`

---

## Project Type Indicators

| Indicator | Value |
| --- | --- |
| Has `manage.py` | ✅ Django project |
| Has `frontend/src/` with React | ✅ React frontend |
| Has `Pipfile` | ✅ Python Pipenv |
| Has `Procfile` | ✅ Heroku deployable |
| Has systemd service files | ✅ Linux production deployment |
| Has `db.sqlite3` | ✅ SQLite dev database |

---

## Key Architecture Decisions

1. **Django REST backend** with `base/` app handling core ecommerce logic.
2. **React frontend** with Redux-style architecture (actions, constants, reducers).
3. **Pipenv** for Python dependency management.
4. **Systemd integration** — production deployment via systemd services.
5. **Heroku-ready** with `Procfile`.
