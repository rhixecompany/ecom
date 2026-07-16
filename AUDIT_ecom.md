# AUDIT_ecom.md

> Read-only repo-management audit — Phases 0, 2, 3.
> Destructive phases (1: branch delete/push, 4: create CI) HELD for user approval.
> Generated: 2026-07-16

## Overview
- **Type**: Django e-commerce application (backend `ecom/`, `base/` apps; `frontend/` subdir; systemd unit files `ecom.service`/`ecom.socket`).
- **Docs present**: `README.md`, `AGENTS.md`, `ARCHITECTURE.md`, `API_REFERENCE.md`, plus guides.
- **Tooling**: Python (Django, Pipfile + Pipfile.lock, requirements.txt), systemd, Docker (Procfile, runtime.txt).
- **Manifest**: `requirements.txt` + `Pipfile`/`Pipfile.lock` (Python). No `package.json` at root (frontend may have its own).

## Disk Usage
- `2.2M` (excludes `.git`, `node_modules`, `venv`, `__pycache__`, `dist`, `build`, `target`).
- Largest non-source artifacts: `db.sqlite3` (~184 KB), `Pipfile.lock` (~47 KB).

## Entrypoint
- Detected: `manage.py` present (Django entry: `python manage.py runserver`).
- No `package.json` `main`/`start`, no `main.py`/`def main` in root.
- Deployment: `Procfile` (Heroku), `ecom.service`/`ecom.socket` (systemd).

## Gitignore Audit (missing entries)
`.gitignore` EXISTS (3728 bytes). Coverage check against the standard baseline:

| Entry | Status |
|-------|--------|
| `node_modules/` | PRESENT |
| `.env` | **MISSING** |
| `*.pyc` | PRESENT |
| `__pycache__/` | PRESENT |
| `dist/` | PRESENT |
| `build/` | PRESENT |
| `.next/` | **MISSING** |
| `venv/` | **MISSING** |
| `.DS_Store` | **MISSING** |

**Missing entries:** `.env`, `.next/`, `venv/`, `.DS_Store`
- Impact: **HIGH for `.env`** — there is a `.env.example` (commit-time template) but `.env` itself is NOT in `.gitignore`, so a real `.env` could be accidentally committed. Verified `.env` is currently NOT tracked, but the gap is a real risk. `.next/` not relevant (no Next app). `venv/`/`.DS_Store` are standard hygiene gaps.

## Dependency Audit (manifest type, top deps, audit-tool availability)
- **Manifest type**: `requirements.txt` + `Pipfile`/`Pipfile.lock` (Python). No JS manifest at root.
- **Top deps (from requirements.txt)**: `django==3.1.14`, `djangorestframework==3.13.1`, `djangorestframework-simplejwt==5.2.0`, `django-cors-headers==3.11.0`, `django-ckeditor==6.3.2`, `boto3==1.14.31`, `botocore==1.17.31`, `certifi==2020.4.5.1`, `click==7.1.2`, `cs50==5.0.4`.
- **AUDIT FLAG — OUTDATED/KNOWN-BAD**: `requirements.txt` pins **2020-era versions** that are significantly outdated and several have known CVEs:
  - `django==3.1.14` (EOL — 3.1 reached end-of-life; current LTS is 4.2/5.x).
  - `certifi==2020.4.5.1` (very old CA bundle).
  - `boto3==1.14.31` / `botocore==1.17.31` (2020; many fixes since).
  - `click==7.1.2`, `chardet==3.0.4`, `astroid==2.4.2`, `autopep8==1.5.4` — all dated.
  - These should be upgraded and audited via `pip-audit`.
- **Audit tool availability**: `pip-audit` NOT installed (note only). `pip list` available. Recommend `pip install pip-audit` and running against `requirements.txt` / `Pipfile.lock` under user approval.

## Branch State
```
* development
  production
```
- Two branches: `development` (current) and `production`.
- No stray `master` or orphan branches. Branch naming follows the `development`/`production` convention.

## Destructive Phases HELD (pending approval)
- **Phase 1** (branch deletion / push): HELD. No branches slated for deletion; nothing pushed.
- **Phase 4** (create CI): HELD. No CI workflow file created (repo has `.github/`; not modified).

> Next step (approval required, PRIORITY): add `.env` to `.gitignore`, then run `pip-audit` on the outdated deps, then optionally proceed to Phase 1/4.
