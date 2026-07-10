# RESEARCH_REPORT — ecom

> **Type:** Project research report | **Updated:** 2026-07-10

**Type:** Dual-stack ecommerce platform  
**Tech Stack:** Django REST Framework, React + Redux Toolkit, PostgreSQL, PayPal, Docker Compose  
**Status:** Active

---

## Similar Projects

| Project | URL | Why Relevant |
|---------|-----|--------------|
| django-react-ecommerce | <https://github.com/aishwaryaw/E-commerce-website-using-React-and-Django> | similar Django + React ecommerce pattern |
| JustDjango PayPal guide | <https://justdjango.com/blog/django-react-paypal-payments> | PayPal webhook + Django integration |
| multivendor ecommerce DRF | <https://dev.to/destinyfranks/build-a-multivendor-e-commerce-website-using-django-react-django-rest-framework-4115> | multivendor ecommerce with DRF + React |

---

## Key Findings

### DRF + React Ecommerce Architecture (2026)

- **Architecture Pattern**: Django REST Framework backend + React/Redux frontend with separate dev servers (backend `:8000`, frontend `:3000`/`5173`)
- **API Design**: DRF ViewSets + Serializers is the standard pattern for ecommerce APIs; API versioning via `/api/v1/` URL path prefix (most common 2026 pattern)
- **State Management**: Redux Toolkit + RTK Query provides built-in caching, automatic invalidation, reduces boilerplate significantly vs legacy Redux
- **Data Fetching**: RTK Query is the recommended approach — eliminates hand-written data fetching/caching logic, integrates directly with Redux store
- **Authentication**: Django's built-in auth + DRF token auth (SimpleJWT); frontend handles state with access token in memory, refresh token in httpOnly cookie
- **CORS**: `django-cors-headers` required; whitelist frontend origins explicitly
- **Production**: Docker Compose with separate backend/frontend services; shared `.env`; separate settings per environment

### SimpleJWT Authentication with React Frontend Patterns

- **Package**: `djangorestframework-simplejwt` (Jazzband maintained) — provides JWT auth backend for DRF
- **Token Strategy**: Short-lived access tokens (5-15 min) + long-lived refresh tokens (1-7 days); store access in memory (React state/context), refresh in httpOnly cookie
- **Frontend Integration**:
  - Axios interceptors to attach `Authorization: Bearer <access_token>` header
  - Automatic token refresh on 401 responses using refresh endpoint
  - Protected routes via React Router guards checking auth state
  - Example repo: `SimpleJWT/drf-SimpleJWT-React` on GitHub
- **CSRF**: Use Django's CSRF protection for session auth; for JWT, ensure `X-CSRFToken` header on mutating requests if using session fallback
- **Key Settings**: `ACCESS_TOKEN_LIFETIME`, `REFRESH_TOKEN_LIFETIME`, `ROTATE_REFRESH_TOKENS=True`, `BLACKLIST_AFTER_ROTATION=True`

### PayPal Integration with DRF Backend and React Checkout (2026)

- **Modern Flow**: PayPal JavaScript SDK (Smart Payment Buttons) on frontend + REST Orders API v2 on backend + Webhooks for fulfillment
- **Legacy**: `django-paypal` package uses deprecated IPN/Payments Standard — **avoid for new projects**
- **Backend (Django)**:
  - Store credentials in env vars: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_MODE` (sandbox/live)
  - Cache OAuth access token (client_credentials grant) with 60s early refresh
  - Create Order endpoint: `POST /v2/checkout/orders` with `intent: "CAPTURE"`, server-side price lookup (never trust client amounts)
  - Capture Order endpoint: `POST /v2/checkout/orders/{id}/capture` after buyer approval
  - Idempotency: Use `PayPal-Request-Id` header (UUID) on create/capture to prevent duplicates
  - Persist `paypal_order_id`, `capture_id`, amount, status in `Order` model for reconciliation
- **Frontend (React)**:
  - Load PayPal SDK: `https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD`
  - `createOrder`: call Django create-order endpoint, return `orderID`
  - `onApprove`: call Django capture-order endpoint, handle COMPLETED/FAILED
  - CSRF: send `X-CSRFToken` header from Django cookie
- **Webhooks (Critical)**:
  - Subscribe to `PAYMENT.CAPTURE.COMPLETED` and `PAYMENT.CAPTURE.DENIED`
  - Verify signature via `POST /v1/notifications/verify-webhook-signature` with raw request body + transmission headers
  - Only fulfill orders after webhook verification succeeds
  - Handle idempotency: check order status before fulfilling

### React Redux Toolkit + RTK Query for Ecommerce State Management

- **RTK Query** (included in `@reduxjs/toolkit`) — purpose-built for data fetching/caching, eliminates hand-written thunks
- **Core APIs**: `createApi()`, `fetchBaseQuery()`, auto-generated React hooks (`useGetProductsQuery`, `useCreateOrderMutation`)
- **Ecommerce Patterns**:
  - **API Slice**: Define base URL (`/api/v1/`), endpoints for products, cart, orders, auth
  - **Caching**: Automatic deduplication; `keepUnusedDataFor` for stale-while-revalidate
  - **Invalidation**: Tags-based invalidation — `providesTags: ['Products']` on queries, `invalidatesTags: ['Products']` on mutations
  - **Optimistic Updates**: `onQueryStarted` with `updateQueryData` for instant UI feedback
  - **Auth**: Include token in `fetchBaseQuery` `prepareHeaders` callback
- **Store Setup**: Add `api.reducerPath` reducer + `api.middleware` to `configureStore`
- **Comparison**: RTK Query vs TanStack Query — RTK Query integrates with Redux DevTools, normalized cache via tags; TanStack Query has more flexible cache but separate store

### Django + React Dual-Server Development Proxy Configuration (2024-2025)

- **Vite (React 18 default)**: Configure `server.proxy` in `vite.config.js`/`vite.config.ts`
  ```js
  export default defineConfig({
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  })
  ```
- **Environment Variables**: Use `VITE_API_BASE_URL` in `.env` for production API URL; proxy only active in dev (`npm run dev`)
- **CORS (Django)**: `django-cors-headers` — `CORS_ALLOWED_ORIGINS = ['http://localhost:5173']` (Vite default), `CORS_ALLOW_CREDENTIALS = True` for cookies
- **CSRF**: Django sets `csrftoken` cookie; frontend reads via `document.cookie` and sends `X-CSRFToken` header on mutating requests
- **Production**: Build React (`npm run build`), serve static files via Django WhiteNoise or Nginx; no proxy needed (same origin)
- **Common Pitfall**: Proxy works in dev only; after `npm run build`, ensure API calls use absolute URLs or same-origin paths

### PostgreSQL Ecommerce Schema Patterns (Products, Orders, Carts)

**Core Tables**:
| Table | Key Columns | Notes |
|-------|-------------|-------|
| `users` (Custom User) | `id`, `email`, `password`, `first_name`, `last_name`, `is_staff` | Extend `AbstractUser`; email as USERNAME_FIELD |
| `categories` | `id`, `name`, `slug`, `description`, `parent_id` (self-FK) | Hierarchical categories via MPTT or recursive CTE |
| `products` | `id`, `category_id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `created_at` | `price` = `DecimalField(max_digits=10, decimal_places=2)`; index on `category_id`, `is_active` |
| `product_images` | `id`, `product_id`, `image`, `alt_text`, `is_primary` | One-to-many; store in media/ or cloud (S3/GCS) |
| `product_variants` | `id`, `product_id`, `name` (Size/Color), `sku`, `price_adjustment`, `stock` | Optional — for products with variations |
| `carts` | `id`, `user_id` (nullable FK), `session_key` (for guests), `created_at`, `updated_at` | One cart per user/session |
| `cart_items` | `id`, `cart_id`, `product_id`, `variant_id` (nullable), `quantity`, `unit_price` | `unit_price` snapshot at add time; unique constraint on `(cart_id, product_id, variant_id)` |
| `orders` | `id`, `user_id`, `status`, `subtotal`, `tax`, `shipping`, `total`, `shipping_address` (JSONB), `billing_address` (JSONB), `paypal_order_id`, `paypal_capture_id`, `created_at` | `status`: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED, REFUNDED |
| `order_items` | `id`, `order_id`, `product_id`, `variant_id`, `product_name`, `variant_name`, `quantity`, `unit_price`, `total_price` | Denormalize name/price for historical accuracy |
| `payments` | `id`, `order_id`, `provider` (paypal/stripe), `provider_id`, `amount`, `currency`, `status`, `raw_response` (JSONB) | Links to PayPal capture_id; webhook updates status |

**Indexes**: 
- `products`: `(category_id, is_active)`, `(slug)` unique
- `orders`: `(user_id, created_at)`, `(paypal_order_id)` unique
- `cart_items`: `(cart_id, product_id, variant_id)` unique
- `order_items`: `(order_id)`

**Django ORM Optimizations**: 
- `select_related('category')` on product queries
- `prefetch_related('images', 'variants')` for product detail
- `annotate()` for cart totals, order counts

### DRF API Versioning and Pagination Best Practices

**Versioning** (DRF built-in):
- **Recommended**: `URLPathVersioning` — `/api/v1/products/`, `/api/v2/products/`
- **Settings**:
  ```python
  REST_FRAMEWORK = {
      'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
      'DEFAULT_VERSION': 'v1',
      'ALLOWED_VERSIONS': ['v1', 'v2'],
      'VERSION_PARAM': 'version',
  }
  ```
- **URLConf**: `path('api/v1/', include('api.v1.urls', namespace='v1'))`
- **Serializer Context**: Include `request` in serializer context for version-aware hyperlinks
- **Deprecation**: Use `DeprecationWarning` headers; sunset headers for deprecated versions

**Pagination**:
- **Global Default** (settings):
  ```python
  REST_FRAMEWORK = {
      'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
      'PAGE_SIZE': 20,
  }
  ```
- **Per-View Override**: `pagination_class = PageNumberPagination` + `page_size = 50`
- **Client Control**: `page_size_query_param = 'page_size'` + `max_page_size = 100`
- **Styles**: `PageNumberPagination` (most common), `LimitOffsetPagination`, `CursorPagination` (for large datasets/real-time)
- **Response Format**: `{count, next, previous, results}` — standard DRF envelope

---

## Cheatsheets & Quick Reference

| Topic | Resource | Type |
|-------|----------|------|
| DRF API Versioning | <https://oneuptime.com/blog/post/2026-02-02-django-api-versioning/> | Guide |
| DRF Versioning Docs | <https://www.django-rest-framework.org/api-guide/versioning> | Docs |
| DRF Pagination | <https://www.django-rest-framework.org/api-guide/pagination> | Docs |
| PayPal + Django | <https://micropyramid.com/blog/e-commerce-paypal-integration-with-django> | Tutorial |
| PayPal Orders API v2 | <https://developer.paypal.com/docs/api/orders/v2/> | Reference |
| RTK Query Overview | <https://redux-toolkit.js.org/rtk-query/overview> | Docs |
| RTK Query Tutorial | <https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics> | Tutorial |
| SimpleJWT Docs | <https://django-rest-framework-simplejwt.readthedocs.io> | Docs |
| Vite Proxy Config | <https://vite.dev/config/server-options#server-proxy> | Docs |
| Ecommerce DB Schema | <https://skemato.com/blog/ecommerce-database-design-example> | Reference |
| Django + React + Redux | <https://sixfeetup.com/blog/django-and-react-with-redux> | Article |

---

## Best Practices

1. **API versioning** — use `/api/v1/` URL prefix from day one for backward-compatible evolution
2. **Separate backend/frontend** — independent `backend/` and `frontend/` dirs; separate dev servers
3. **PayPal webhooks** — verify webhook signatures server-side before fulfilling orders
4. **RTK Query** — use for API data fetching with automatic cache invalidation on mutations
5. **Short-lived JWT access tokens** — store in memory, refresh via httpOnly cookie
6. **Server-side price calculation** — never trust client-provided prices; lookup from catalog
7. **Idempotency keys** — use `PayPal-Request-Id` on create/capture to prevent duplicate orders
8. **PostgreSQL indexes** — add on frequently filtered fields (category, price, status, user_id)
9. **DRF query optimization** — `select_related`/`prefetch_related` on ViewSets to avoid N+1
10. **Vite proxy in dev** — `/api` → `http://localhost:8000` with rewrite; CORS only for production

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
|---------|--------|-----------|
| No API versioning | breaking changes affect clients | use `/api/v1/` from day one |
| PayPal webhook unverified | fraudulent order processing | verify webhook signature via PayPal SDK |
| CORS misconfiguration | frontend can't reach API | add django-cors-headers; whitelist origins |
| No pagination on list endpoints | slow API responses | add DRF pagination (PageNumberPagination) |
| Client-side price trust | price tampering | compute totals server-side from catalog |
| Access token in localStorage | XSS token theft | store in memory; refresh token in httpOnly cookie |
| Missing DB indexes | slow queries at scale | index foreign keys + filter columns |
| N+1 queries in serializers | degraded API performance | use `select_related`/`prefetch_related` in ViewSet `get_queryset` |
| Proxy not working in production | broken API calls after build | proxy is dev-only; serve frontend from Django/Nginx in prod |

---

## Performance

1. **RTK Query caching** — minimizes redundant API calls; `keepUnusedDataFor` for stale-while-revalidate
2. **DRF pagination** — PageNumberPagination; configurable page size via `page_size_query_param`
3. **PostgreSQL indexes** — add on frequently filtered fields (category, price, status, user_id)
4. **select_related / prefetch_related** — optimize DRF serializer queries with eager loading
5. **Database connection pooling** — use `django-db-geventpool` or PgBouncer for Gunicorn workers
6. **Static files** — WhiteNoise for Django; Vite build output with hash filenames for caching
7. **CDN** — serve media/static via CloudFront/Cloudflare in production

---

## Security

1. **JWT auth** — short-lived access tokens + long-lived refresh tokens; store access in memory, not localStorage
2. **PayPal webhook verification** — validate `PAYPAL-AUTH-ALGO` and webhook ID via verify-webhook-signature endpoint
3. **CORS hardening** — restrict `CORS_ALLOWED_ORIGINS` to known frontend domains only
4. **SQL injection prevention** — DRF Serializer validation + Django ORM; never raw SQL
5. **CSRF protection** — Django CSRF middleware + `X-CSRFToken` header on mutating requests
6. **Rate limiting** — `django-ratelimit` or DRF throttling on auth/payment endpoints
7. **Environment secrets** — never commit `.env`; use Docker secrets / platform secret managers in prod
8. **HTTPS everywhere** — enforce in production; `SECURE_SSL_REDIRECT = True`, `SESSION_COOKIE_SECURE = True`

---

## Related Projects (in workspace)

- **cookiecutter-django-tailwind** — shared layered Django settings pattern
- **profile** — Django monolith; Django + Docker + PostgreSQL overlap
- **xamehi.tv** — also uses DRF + PayPal + React (though older React 17)
- **xamehi** — dual-backend architecture with Django + React
- **rhixecompany-comics** — Django + DRF + PostgreSQL

---

## Resources

| Resource | URL | Description |
|----------|-----|-------------|
| DRF Docs | <https://www.django-rest-framework.org/> | DRF official docs |
| Redux Toolkit | <https://redux-toolkit.js.org/> | Redux Toolkit docs |
| RTK Query | <https://redux-toolkit.js.org/rtk-query/overview> | RTK Query docs |
| SimpleJWT | <https://django-rest-framework-simplejwt.readthedocs.io> | SimpleJWT docs |
| PayPal API | <https://developer.paypal.com/docs/api/orders/v2/> | PayPal Orders API v2 |
| PayPal Integration Guide | <https://micropyramid.com/blog/e-commerce-paypal-integration-with-django> | Modern PayPal + Django guide |
| Django + React + Redux | <https://sixfeetup.com/blog/django-and-react-with-redux> | Architecture article |
| Vite Proxy | <https://vite.dev/config/server-options#server-proxy> | Vite dev server proxy config |
| Ecommerce DB Design | <https://skemato.com/blog/ecommerce-database-design-example> | Schema reference |
| DRF Versioning | <https://www.django-rest-framework.org/api-guide/versioning> | Versioning guide |
| DRF Pagination | <https://www.django-rest-framework.org/api-guide/pagination> | Pagination guide |

---

## New Findings (2026-07-10 Update)

### Architecture Decisions Confirmed

1. **Vite over CRA**: React 18 projects should use Vite (not Create React App) — faster dev server, native proxy support, better build performance
2. **RTK Query over React Query**: Since we're using Redux Toolkit, RTK Query is the natural choice — integrated DevTools, tag-based invalidation, no extra dependency
3. **URL Path Versioning**: `/api/v1/` is the industry standard for 2026; simpler than header-based for clients and debugging
4. **PayPal Orders API v2 + Webhooks**: Modern integration pattern; avoid legacy `django-paypal` package
5. **PostgreSQL JSONB**: Use for flexible address storage (shipping/billing) and PayPal raw webhook responses

### Implementation Priorities

| Priority | Task | Effort |
|----------|------|--------|
| 1 | Set up Django project with DRF, SimpleJWT, CORS, PostgreSQL | Medium |
| 2 | Configure API versioning (`/api/v1/`) + pagination defaults | Low |
| 3 | Build core models: User, Category, Product, Cart, Order, Payment | High |
| 4 | Implement SimpleJWT auth endpoints + React auth flow (login/register/refresh) | Medium |
| 5 | Set up Vite React + Redux Toolkit + RTK Query + React Router 5 + React Bootstrap | Medium |
| 6 | Configure Vite proxy for `/api` → `http://localhost:8000` | Low |
| 7 | Build product catalog, cart, checkout flows with RTK Query | High |
| 8 | Integrate PayPal Smart Buttons + Django create/capture endpoints + webhooks | High |
| 9 | Docker Compose for dev/prod with separate services | Medium |
| 10 | Add tests, CI/CD, production hardening | Ongoing |

### Tech Version Pinning (2026)

| Package | Version | Notes |
|---------|---------|-------|
| Django | 5.0+ | LTS preferred |
| DRF | 3.15+ | |
| SimpleJWT | 5.3+ | |
| PostgreSQL | 16+ | |
| Gunicorn | 21+ | |
| React | 18.3+ | |
| Redux Toolkit | 2.2+ | Includes RTK Query |
| React Router | 5.3+ | v5 (not v6) per stack |
| React Bootstrap | 2.10+ | |
| Axios | 1.7+ | |
| Vite | 5.4+ | |
| PayPal SDK | Latest | Load from CDN |

---

*Report generated via web-research-pipeline | Queries executed: 7 | Sources: 15+*