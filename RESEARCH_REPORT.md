# RESEARCH_REPORT — ecom

> **Tech Stack:** Django REST Framework, React + Redux Toolkit, PostgreSQL, PayPal, Docker Compose

---

## 1. Key Architecture Findings

- **DRF + React** with separate dev servers (`:8000` backend, `:3000` frontend)
- **RTK Query** provides caching, dedup, auto-invalidation — less boilerplate than legacy Redux
- **API versioning**: `/api/v1/` prefix for smooth evolution
- **CORS**: `django-cors-headers` with explicit whitelist — never wildcard in production
- **Throttling**: 5-10 req/min on auth endpoints; per-endpoint DRF config

## 2. PostgreSQL Performance

- **Indexing**: B-Tree (default), GIN (JSONB), functional indexes for wrapped columns
- **N+1**: `select_related` (FK), `prefetch_related` (M2M); `Prefetch(to_attr=...)` for speed
- **ArrayAgg**: Single SQL vs N+2 — less memory than `prefetch_related`
- **Bulk ops**: `bulk_create`/`bulk_update` with `batch_size=500`
- **Iterator**: `iterator(chunk_size=2000)` uses ~16× less RAM
- **Pooling**: pgBouncer (`POOL_MODE=transaction`) + `CONN_MAX_AGE=600`
- **Profiling**: django-silk (dev), slow query log (prod)

## 3. Docker & Production Deployment

- **Multi-stage builds**: Builder → production copies only site-packages, non-root `django` user
- **Gunicorn**: `2-4 × CPU cores` workers, `gthread` class, `max-requests=1000`
- **Nginx**: Rate limiting (10r/s general, 30r/s API), 30d static cache
- **Services**: PostgreSQL 16-alpine + Redis 7-alpine (256mb) + Nginx 1.25-alpine
- **Health**: `@never_cache` JSON endpoint; pg_dump backups, 7-day rotation
- **Monitoring**: Sentry (`traces_sample_rate=0.1`), JSON logging, Docker Swarm/K8s

## 4. PayPal Integration (REST API v2)

- **Flow**: Smart Buttons (`@paypal/react-paypal-js`) → Orders API v2 → webhook confirmation
- **Server-side price**: Never trust client — compute from catalog
- **OAuth caching**: In-memory with 60s buffer; `PayPal-Request-Id` UUID for idempotency
- **Webhooks over IPN**: `PAYMENT.CAPTURE.COMPLETED`, signature verification
- **PCI DSS**: SAQ A (card data never touches your servers)
- **2026 Orders v2**: add Level 2/3 purchase data to lower processing costs; `PayPal-Request-Id` idempotency header retained 6-72h; `@paypal/react-paypal-js` v6 ships web-component buttons (`<paypal-button>`)

## 5. JWT Authentication

- **SimpleJWT**: Access 5 min, refresh 1 day; `ROTATE_REFRESH_TOKENS=True`, `BLACKLIST_AFTER_ROTATION=True`
- **Storage**: Access in memory only, refresh in httpOnly/SameSite=Strict cookie
- **Axios**: Auto 401 → refresh → retry
- **Rate limit** auth (5-10 req/min); HTTPS; minimal payload

## 6. React + Bootstrap

- **Components**: Navbar, Card, Button, Modal, Form, Carousel, Alert, Badge, Spinner, Pagination
- **Best practices**: Tree-shake imports, SCSS `_variables.scss` for theming, lock version
- **React 2026**: Functional + hooks; custom hooks (useAuth, useCart); `React.lazy()` splitting; feature-based folders

## 7. Security Essentials

- **Django**: SECRET_KEY in env, DEBUG=False, HSTS, X-Frame-Options DENY
- **PayPal**: Server-side price, idempotency keys, webhook verification
- **Frontend**: httpOnly cookies (never localStorage), CSP, sanitize UGC
- **Infra**: Non-root containers, Trivy, secrets via env, SSL, Nginx rate limiting
- **Deps**: `pip-audit` or Dependabot

## 8. Common Pitfalls (Top 8)

| Pitfall | Impact | Solution |
|---------|--------|----------|
| Client-side price | Fraud | Server-side catalog pricing |
| No idempotency | Duplicate charges | `PayPal-Request-Id` UUID |
| django-paypal (IPN) | Deprecated | Orders API v2 + Webhooks |
| Missing select_related | N+1 queries | Profiling + Prefetch |
| Full model serialization | Bloated payloads | `only()`, `defer()`, lean serializers |
| JWT in localStorage | XSS theft | httpOnly + SameSite=Strict |
| No connection pooling | Connection exhaustion | pgBouncer + CONN_MAX_AGE |
| Single Gunicorn worker | Poor throughput | 2-4 × CPU cores gthread |

## 9. Related Projects

- **xamehi / xamehi.tv** — shared Django + React and PayPal patterns
- **cookiecutter-django-tailwind** — shared Django/DRF conventions
- **Django-Scrapy-Selenium** — shared Django architecture


| Resource | URL | Domain |
|----------|-----|--------|
| DRF Best Practices 2026 | kellton.com/kellton-tech-blog/designing-rest-apis-with-django-rest-api-framework | API design |
| PostgreSQL Tips for Django | blog.gitguardian.com/10-tips-to-optimize-postgresql-queries-in-your-django-project | DB opt |
| Production Django + Docker | medium.com/@sizanmahmud08/production-ready-django-with-docker-in-2026 | Deploy |
| PayPal Django Integration | micropyramid.com/blog/e-commerce-paypal-integration-with-django | Payments |
| JWT in DRF Complete Guide | medium.com/@onurmaciit/mastering-jwt-authentication-in-django-rest-framework | Auth |
| Bootstrap in React Guide | mitsoftware.com/en/blog/guide-to-using-bootstrap-in-react-projects | Frontend |
