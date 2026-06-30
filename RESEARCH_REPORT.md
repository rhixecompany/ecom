# RESEARCH_REPORT — ecom

> **Type:** Project research report | **Updated:** 2026-06-29

**Type:** Dual-stack ecommerce platform
**Tech Stack:** Django REST Framework, React + Redux Toolkit, PostgreSQL, PayPal, Docker Compose
**Status:** Active

---

## Similar Projects

| Project | URL | Why Relevant |
|---------|-----|--------------|
| django-react-ecommerce | https://github.com/aishwaryaw/E-commerce-website-using-React-and-Django | similar Django + React ecommerce pattern |
| JustDjango PayPal guide | https://justdjango.com/blog/django-react-paypal-payments | PayPal webhook + Django integration |
| multivendor ecommerce DRF | https://dev.to/destinyfranks/build-a-multivendor-e-commerce-website-using-django-react-django-rest-framework-4115 | multivendor ecommerce with DRF + React |

---

## Key Findings

### DRF + React Ecommerce Architecture (2026)
- DRF ViewSets + Serializers is the standard backend pattern for ecommerce APIs
- Redux Toolkit + RTK Query provides built-in caching, automatic invalidation, reduces boilerplate
- API versioning via `/api/v1/` prefix with URL path versioning (most common 2026 pattern)
- Django + React full-stack: use Django's built-in auth + DRF token auth; frontend handles state

### PayPal Integration (2026)
- PayPal Orders API v2 (create + capture) is the modern approach
- JavaScript SDK buttons + Django webhooks for fulfillment
- `dj-paypal` package provides Django model wrappers for billing plans and webhooks
- Webhook verification essential — PayPal signs payloads; verify server-side before processing

### Docker Compose Deployment
- Dual dev servers: backend on `:8000`, frontend on `:3000` with proxy for API calls
- Docker Compose for production with separate backend and frontend services
- Shared `.env` across services; separate settings per environment (dev/staging/prod)

---

## Cheatsheets & Quick Reference

| Topic | Resource | Type |
|-------|----------|------|
| DRF API versioning | https://oneuptime.com/blog/post/2026-02-02-django-api-versioning/ | Guide |
| PayPal + Django | https://justdjango.com/blog/django-react-paypal-payments | Tutorial |
| RTK Query | https://redux-toolkit.js.org/rtk-query/overview | Docs |
| Multivendor ecommerce | https://dev.to/destinyfranks/build-a-multivendor-e-commerce-website-using-django-react-django-rest-framework-4115 | Tutorial |

---

## Best Practices

1. **API versioning** — use `/api/v1/` URL prefix for backward-compatible evolution
2. **Separate backend/frontend** — independent `backend/` and `frontend/` dirs; separate dev servers
3. **PayPal webhooks** — verify webhook signatures server-side before fulfilling
4. **RTK Query** — use for API data fetching with automatic cache invalidation on mutations

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
|---------|--------|-----------|
| No API versioning | breaking changes affect clients | use `/api/v1/` from day one |
| PayPal webhook unverified | fraudulent order processing | verify webhook signature via PayPal SDK |
| CORS misconfiguration | frontend can't reach API | add django-cors-headers; whitelist origins |
| No pagination on list endpoints | slow API responses | add DRF pagination (PageNumberPagination) |

---

## Performance

1. **RTK Query caching** — minimizes redundant API calls; `keepUnusedDataFor` for stale-while-revalidate
2. **DRF pagination** — PageNumberPagination; configurable page size
3. **PostgreSQL indexes** — add on frequently filtered fields (category, price, status)
4. **select_related / prefetch_related** — optimize DRF serializer queries with eager loading

---

## Security

1. **JWT auth** — short-lived access tokens + long-lived refresh tokens; store access in memory, not localStorage
2. **PayPal webhook verification** — validate `PAYPAL-AUTH-ALGO` and webhook ID
3. **CORS hardening** — restrict `CORS_ALLOWED_ORIGINS` to known frontend domains
4. **SQL injection prevention** — DRF Serializer validation + Django ORM; never raw SQL

---

## Related Projects (in workspace)

- **cookiecutter-django-tailwind** — shared layered Django settings pattern
- **profile** — Django monolith; Django + Docker + PostgreSQL overlap
- **xamehi.tv** — also uses DRF + PayPal + React (though older React 17)
- **xamehi** — dual-backend architecture with Django + React

---

## Resources

| Resource | URL | Description |
|----------|-----|-------------|
| DRF Docs | https://www.django-rest-framework.org/ | DRF official docs |
| Redux Toolkit | https://redux-toolkit.js.org/ | Redux Toolkit docs |
| PayPal API | https://developer.paypal.com/docs/api/orders/v2/ | PayPal Orders API v2 |
| Docker Compose | https://docs.docker.com/compose/ | Docker Compose docs |
