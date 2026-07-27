# RESEARCH_REPORT — ecom

> **Type:** Project research report | **Updated:** 2026-07-28

**Type:** Dual-stack ecommerce platform
**Tech Stack:** Django REST Framework, React + Redux Toolkit, PostgreSQL, PayPal, Docker Compose
**Status:** Active

---

## Similar Projects

| Project | URL | Why Relevant |
|---------|-----|--------------|
| django-react-ecommerce | <https://github.com/aishwaryaw/E-commerce-website-using-React-and-Django> | Django + React ecommerce pattern |
| JustDjango PayPal guide | <https://justdjango.com/blog/django-react-paypal-payments> | PayPal + Django webhook integration |

---

## Key Findings

### DRF + React Ecommerce Architecture (2026)
- **DRF backend** + React/Redux frontend with separate dev servers; proxy API in dev
- **Redux Toolkit + RTK Query** provides built-in caching and auto-invalidation
- **SimpleJWT**: short-lived access tokens (5-15 min) + long-lived refresh tokens (memory/httpOnly)
- **CORS**: `django-cors-headers` with explicit origins, never wildcard in production
- **Docker Compose** with separate backend/frontend services; per-environment `.env`

### PayPal Integration
- **Modern flow**: PayPal JS SDK (Smart Buttons) frontend + REST Orders API v2 backend
- Legacy `django-paypal` uses deprecated IPN — avoid for new projects
- **Always verify on server** — never trust client-side payment signals
- `ROTATE_REFRESH_TOKENS=True`, `BLACKLIST_AFTER_ROTATION=True` for SimpleJWT

---

## Cheatsheets & Quick Reference

| Topic | Resource | Type |
|-------|----------|------|
| DRF Docs | <https://www.django-rest-framework.org> | Docs |
| SimpleJWT | <https://django-rest-framework-simplejwt.readthedocs.io> | Docs |
| PayPal Orders API | <https://developer.paypal.com/docs/api/orders/v2> | API Docs |

---

## Best Practices

1. **RTK Query for API state** — built-in caching, deduplication, auto-invalidation
2. **Server-side payment verification** — never trust client-side success signals
3. **Separate .env per environment** — dev/staging/production credentials isolated
4. **CORS whitelist** — explicit frontend origins; never wildcard in production
5. **API versioning** — `/api/v1/` URL prefix for future compatibility

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
|---------|--------|-----------|
| Client-side payment verification | Fraud | Always verify on server |
| Legacy django-paypal | Deprecated IPN | Use PayPal Orders API v2 |
| Missing CORS config | Frontend can't reach API | `django-cors-headers` with explicit origins |
| JWT leaks | Account takeover | Access token in memory only; httpOnly refresh cookie |

---

## Performance

1. **RTK Query caching** — automatic cache invalidation reduces redundant API calls
2. **`select_related`/`prefetch_related`** — prevent N+1 in product listings
3. **Docker Compose multi-stage builds** — smaller production images
4. **Gunicorn workers** — `2-4 × CPU cores` for DRF serving
5. **PostgreSQL connection pooling** — `CONN_MAX_AGE` for persistent connections

---

## Security

1. **Server-side payment verification** — never trust client-side signals
2. **SimpleJWT blacklist** — `BLACKLIST_AFTER_ROTATION=True` for token revocation
3. **Secure CORS** — explicit origins, never credentials wildcard
4. **CSRF protection** — ensure `X-CSRFToken` header on mutating requests
5. **Rate limit auth endpoints** — protect against brute force; 6 CVEs patched in Django early 2026

---

## Testing & Quality Assurance

1. **pytest + pytest-django** — backend tests with DB isolation; factory-boy for fixtures
2. **React Testing Library** — component/integration tests for Redux-connected components
3. **CI matrix testing** — Python 3.10–3.13; Node 18+ for frontend; parallel workers
4. **Coverage enforcement** — `--cov-fail-under=80` backend; frontend coverage via Istanbul
5. **End-to-end** — Playwright for checkout flow regression tests (Pay sandbox)

---

## Related Projects (in workspace)

- **xamehi** — shared Django + React architecture patterns
- **xamehi.tv** — shared DRF + PayPal integration patterns
- **cookiecutter-django-tailwind** — shared Django/DRF conventions
- **Django-Scrapy-Selenium** — shared Django + DRF architecture
- **profile** — shared Django + DRF conventions

---

## Resources

| Resource | URL | Description |
|----------|-----|-------------|
| DRF Docs | <https://www.django-rest-framework.org> | API framework |
| SimpleJWT | <https://django-rest-framework-simplejwt.readthedocs.io> | JWT auth |
| PayPal Orders API | <https://developer.paypal.com/docs/api/orders/v2> | Payment processing |
| RTK Query | <https://redux-toolkit.js.org/rtk-query/overview> | Data fetching |

### Research Methodology
- **Web search:** web_search (2026 DRF ecommerce patterns, PayPal best practices)
- **Documentation:** web_extract (PayPal, SimpleJWT, DRF docs)
- **Last verified:** 2026-07-28
