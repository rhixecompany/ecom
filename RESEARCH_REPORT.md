# RESEARCH_REPORT — ecom

> **Type:** Project research report | **Updated:** 2026-06-25

---

**Type:** Dual-stack ecommerce platform
**Tech Stack:** DRF, React/Redux Toolkit, PostgreSQL, PayPal, Docker Compose
**Status:** Active

---

## Similar Projects

| Project | URL | Why Relevant |
| ------- | --- | ------------ |
| django-react-ecommerce | https://github.com/aishwaryaw/E-commerce-website-using-React-and-Django | Reference — similar Django + React ecommerce pattern |
| JustDjango PayPal guide | https://justdjango.com/blog/django-react-paypal-payments | PayPal webhook + Django integration tutorial |

---

## Key Findings

### DRF + React Ecommerce Architecture

- DRF ViewSets + Serializers pattern is the standard backend architecture for ecommerce APIs (dev.to, 2026)
- Redux Toolkit + RTK Query provides built-in caching, automatic invalidation, and reduces boilerplate vs classic Redux (medium.com/@mernstackdevbykevin, 2026)
- API at `/api/v1/` prefix with URL path versioning is the recommended versioning strategy (oneuptime.com, 2026)

### PayPal Integration

- PayPal Orders API v2 (create + capture) is the modern approach; integrates via JavaScript SDK buttons + Django webhooks (micropyramid.com)
- `dj-paypal` package provides Django model wrappers for PayPal billing plans and webhooks (github.com/HearthSim/dj-paypal)
- Webhook verification is essential — PayPal signs payloads; verify signature server-side before processing

### Docker Compose Deployment

- Dual dev servers: backend on `:8000`, frontend on `:3000` with proxy for API calls (project README)
- Docker Compose for production with separate backend and frontend services; environment variables shared via `.env`

---

## Cheatsheets & Quick Reference

| Topic | Resource | Type |
| ----- | -------- | ---- |
| DRF API versioning | https://oneuptime.com/blog/post/2026-02-02-django-api-versioning/ | Guide |
| PayPal + Django | https://justdjango.com/blog/django-react-paypal-payments | Tutorial |
| RTK Query | https://redux-toolkit.js.org/rtk-query/overview | Docs |

---

## Best Practices

1. **API versioning** — Use URL path versioning (`/api/v1/`) for clear backward-compatible evolution
2. **Separate backend/frontend** — Maintain independent `backend/` and `frontend/` directories with separate dev servers
3. **PayPal webhooks** — Always verify webhook signatures server-side before fulfilling orders
4. **RTK Query cache** — Use RTK Query for API data fetching with automatic cache invalidation on mutations

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
| ------- | ------ | --------- |
| No API versioning | Breaking changes affect existing clients | Use `/api/v1/` URL prefix from day one |
| PayPal webhook unverified | Fraudulent order processing | Verify webhook signature via PayPal SDK |
| CORS misconfiguration | Frontend can't reach API | Add django-cors-headers; configure CORS_ORIGIN_WHITELIST |
| No pagination on list endpoints | Slow API responses | Add DRF pagination (PageNumberPagination recommended) |

---

## Performance

1. **RTK Query caching** — Minimizes redundant API calls; configure `keepUnusedDataFor` for stale-while-revalidate
2. **DRF pagination** — Use PageNumberPagination with configurable page size to limit response payloads
3. **PostgreSQL indexes** — Add indexes on frequently filtered fields (category, price, status) in model Meta
4. **Select_related / prefetch_related** — Optimize DRF serializer queries with eager loading

---

## Security

1. **JWT auth** — Use short-lived access tokens + long-lived refresh tokens; store access tokens in memory, not localStorage
2. **PayPal webhook verification** — Validate `PAYPAL-AUTH-ALGO` and webhook ID before processing
3. **CORS hardening** — Restrict `CORS_ALLOWED_ORIGINS` to known frontend domains in production
4. **SQL injection prevention** — DRF Serializer validation + Django ORM queries; never use raw SQL

---

## Related Projects (in workspace)

- **cookiecutter-django-tailwind** — Shares layered Django settings pattern
- **xamehi.tv** — Also uses DRF + PayPal + React (though older React 17)
- **xamehi** — Dual-backend architecture with Django + React; ecom uses single Django backend

---

## Resources

| Resource | URL | Description |
| -------- | --- | ----------- |
| DRF Docs | https://www.django-rest-framework.org/ | Django REST Framework official docs |
| Redux Toolkit | https://redux-toolkit.js.org/ | Redux Toolkit official docs |
| PayPal API | https://developer.paypal.com/docs/api/orders/v2/ | PayPal Orders API v2 |
| Docker Compose | https://docs.docker.com/compose/ | Docker Compose documentation |

---