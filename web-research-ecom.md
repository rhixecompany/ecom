# Web Research Report — ecom

> **Type:** Supplementary web research | **Date:** 2026-07-16
> **Tech Stack:** PostgreSQL, React, JavaScript, Django REST Framework, Python, Bootstrap, PayPal, Django, Docker
> **Status:** Research complete
> **Source:** Web search + extraction from 10+ curated articles (2025-2026)

---

## Table of Contents

1. [DRF + React Architecture & Best Practices](#1-drf--react-architecture--best-practices)
2. [PostgreSQL Performance Optimization for Django](#2-postgresql-performance-optimization-for-django)
3. [Docker Compose Production Configuration](#3-docker-compose-production-configuration)
4. [PayPal Integration — Modern REST API Guide](#4-paypal-integration--modern-rest-api-guide)
5. [React + Bootstrap Integration Guide](#5-react--bootstrap-integration-guide)
6. [JWT Authentication Best Practices](#6-jwt-authentication-best-practices)
7. [Security Checklist](#7-security-checklist)
8. [Common Pitfalls](#8-common-pitfalls)
9. [Sources](#9-sources)

---

## 1. DRF + React Architecture & Best Practices

### API Versioning
- Prefix endpoints with version (`/api/v1/products/`) to evolve the API without breaking existing clients
- DRF supports versioning via URL paths or namespaces natively
- Allows smooth client transitions while introducing new features

### Data Serialization
- **Keep payloads lean** — include only essential fields; avoid sending serialized full models every time
- For nested data, manually define relationships to avoid over-fetching
- Use `values()` or `values_list()` for read-only queries to avoid loading full model instances
- For serialized output, use `only()` / `defer()` on querysets to select only needed columns

### Modular Design
- Separate concerns: **models** for data, **serializers** for transformation, **views** for request handling
- This keeps the codebase clean and enables team members to work on separate components without conflicts

### Request Throttling
- Protect API from abuse using DRF's built-in throttling
- Set caps per user or IP address
- Critical for auth endpoints to prevent brute force: 5-10 requests/min on `/api/token/`

### CORS
- Always use `django-cors-headers` with explicit origin whitelist
- Never use `CORS_ALLOW_ALL_ORIGINS=True` in production
- Frontend dev server at `localhost:3000` needs `CORS_ALLOWED_ORIGINS` entry

### Pagination
- DRF built-in pagination splits responses into manageable chunks
- Configure globally or per-endpoint
- Typical page size: 12-24 for product listings

### RTK Query (Frontend)
- Redux Toolkit + RTK Query provides built-in caching, deduplication, auto-invalidation
- Use `createApi` with `fetchBaseQuery` as the base — reduces boilerplate significantly vs legacy Redux
- Automatically caches GET responses and invalidates on mutations

---

## 2. PostgreSQL Performance Optimization for Django

### Query Optimization Mindset
- **Optimization is a never-ending process** — not a one-off task
- What works well today may not perform in 6 months as data grows
- Always monitor, test, measure, and improve iteratively

### Tooling for Query Analysis
```python
from django.db import connection, reset_queries
reset_queries()
qs = Person.objects.only("id")[:10]
print("SQL:", qs.query)
print("PG plan:", qs.explain(ANALYZE=True))
print("Queries:", connection.queries)  # needs DEBUG=True
```
- Use **[Silk profiler](https://github.com/jazzband/django-silk)** on development for query profiling
- Scrape PostgreSQL slow query log (`log_min_duration_statement`) in production
- Monitor database locks and instance vitals (CPU, memory, IO)

### Select Only What You Need
- Use `only()` / `defer()` to fetch specific fields instead of full row (`*`)
- Use `values()` / `values_list()` when you don't need model instances — saves model instantiation overhead
- **Warning**: accessing a field not in `only()` triggers an additional query — check `connection.queries` to catch this

### Indexing Strategy
- **Always index**: primary keys (auto), foreign keys (auto), fields used in `WHERE`, `ORDER BY`, `GROUP BY`
- Choose correct index type:
  - **B-Tree** (default) — equality + range queries, sorting, `LIKE` patterns
  - **HASH** — equality only (`=`), no ordering support
  - **GIN** — complex types: arrays, JSONB, full-text search
- **Beware function sabotage**: wrapping a column in `UPPER()` renders a regular index useless — use functional indexes instead:
  ```python
  class Meta:
      indexes = [
          Index(Upper('name'), name='person_name_upper_idx'),
      ]
  ```

### N+1 Query Prevention — `select_related` vs `prefetch_related`
- **`select_related`** — for ForeignKey/OneToOne (SQL JOIN, single query)
- **`prefetch_related`** — for ManyToMany / reverse FK (separate queries + python join)
- Performance tip: use `Prefetch('relation', to_attr='cached_attr')` to store results in a list instead of QuerySet — significantly faster for iteration
- For read-heavy aggregation, use PostgreSQL `ArrayAgg` instead of `prefetch_related`:
  ```python
  from django.contrib.postgres.aggregates import ArrayAgg
  User.objects.annotate(writings_titles=ArrayAgg("writings__title"))
  .values_list("email", "writings_titles", named=True)
  ```
  This generates a single SQL query instead of N+2, and reduces Django memory overhead.

### Aggregation vs Subqueries
- Complex JOINs with `GROUP BY` can consume huge memory — PostgreSQL builds temporary structures
- **Subqueries sometimes outperform** a single massive query — test both paths
- Use `ArraySubquery` and `OuterRef` for correlated subqueries when aggregation becomes too heavy

### Bulk Writes
- Use `bulk_create()`, `bulk_update()`, `Queryset.update()` instead of individual saves
- Always specify `batch_size` to avoid gigantic queries (e.g., `batch_size=500`)
- Split into smaller transactions when atomicity across the entire dataset isn't needed:
  ```python
  from itertools import grouper
  from django.db import transaction
  CHUNK_SIZE = 500
  for chunk in grouper(big_list, CHUNK_SIZE):
      with transaction.atomic():
          Book.objects.bulk_create(chunk)
  ```

### Memory Efficiency
- Use `iterator()` instead of loading entire result set into memory:
  ```python
  for person in Person.objects.iterator(chunk_size=2000):
      ...  # ~16x less RAM than Person.objects.all()
  ```
- Before Django 4.1, `iterator()` couldn't be combined with `prefetch_related()`

### Connection Pooling
- PostgreSQL spawns a new OS process per connection — **connection pooling is essential**
- Use **pgBouncer** with `POOL_MODE=transaction`
- Set `CONN_MAX_AGE` (e.g., 600 seconds) in Django settings for persistent connections
- Docker Compose pgBouncer config:
  ```yaml
  pgbouncer:
    image: edoburu/pgbouncer:latest
    environment:
      - DATABASE_URL=postgresql://${DB_USER}:***@db:5432/${DB_NAME}
      - POOL_MODE=transaction
      - MAX_CLIENT_CONN=100
  ```

### Production vs Local Differences
- Execution plans differ dramatically between local (3 users) and production (millions of rows)
- Local: focus on query count and complexity
- Production: analyze actual execution plans, check for Seq Scans
- Keep table statistics updated — enable `autovacuum` for frequently-changing tables

---

## 3. Docker Compose Production Configuration

### Multi-Stage Dockerfile
```dockerfile
# Stage 1: Builder
FROM python:3.12-slim-bullseye as builder
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y gcc postgresql-client libpq-dev gettext
WORKDIR /app
COPY requirements/production.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Stage 2: Production
FROM python:3.12-slim-bullseye
RUN groupadd -r django && useradd -r -g django django
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --chown=django:django ./app /app
USER django
EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
```

### Gunicorn Configuration
```bash
exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 4 \
  --worker-class gthread \
  --threads 2 \
  --worker-tmp-dir /dev/shm \
  --max-requests 1000 \
  --max-requests-jitter 50 \
  --timeout 120 \
  --graceful-timeout 30 \
  --keep-alive 5 \
  --access-logfile - \
  --error-logfile - \
  --log-level info
```
- **Workers formula**: `2-4 × CPU cores`
- `max-requests` + `jitter` prevents memory leaks by recycling workers
- `--worker-tmp-dir /dev/shm` uses RAM for temporary files

### Nginx Configuration Highlights
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;

# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;

# Static files — long cache
location /static/ {
    alias /app/staticfiles/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}

# Media files — moderate cache
location /media/ {
    alias /app/media/;
    expires 7d;
    add_header Cache-Control "public";
}

# API endpoint — higher rate limit
location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://django;
}
```

### Docker Compose Production Checklist
| Component | Image | Key Config |
|-----------|-------|------------|
| DB | `postgres:16-alpine` | Named volume, healthcheck, `restart: unless-stopped` |
| Redis | `redis:7-alpine` | `--appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru` |
| Web | Custom | Resource limits: 2 CPU, 2G RAM |
| Nginx | `nginx:1.25-alpine` | Volume mounts for static/media (ro), SSL, resource limits (1 CPU, 512M) |
| pgAdmin | `dpage/pgadmin4` | Only via Nginx in production — no direct port exposure |

### Health Check Endpoint
```python
from django.http import JsonResponse
from django.views.decorators.cache import never_cache

@never_cache
def health_check(request):
    return JsonResponse({'status': 'healthy'}, status=200)
```

### Backups
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U ${DB_USER} ${DB_NAME} | gzip > /backups/db_$DATE.sql.gz
tar -czf /backups/media_$DATE.tar.gz ./media
find /backups -name "*.gz" -mtime +7 -delete
```

### Monitoring
- **Sentry**: Error tracking with `sentry-sdk`, `traces_sample_rate=0.1`
- **Structured logging**: `json-file` driver with `max-size=10m`, `max-file=3`
- **Scaling**: Docker Swarm or Kubernetes for horizontal replication (3+ replicas recommended)

---

## 4. PayPal Integration — Modern REST API Guide

### Architecture Overview
The modern flow eliminates legacy `django-paypal` (IPN) in favor of:
1. **Frontend**: PayPal JavaScript SDK (Smart Buttons) via `@paypal/react-paypal-js`
2. **Backend**: PayPal REST Orders API v2 via Django views
3. **Async verification**: Webhooks (`PAYMENT.CAPTURE.COMPLETED`) replacing IPN

> **Key rule**: Never trust client-side payment success signals — always verify on the server.

### API Credential Storage
```python
# settings.py
PAYPAL_CLIENT_ID = os.environ["PAYPAL_CLIENT_ID"]
PAYPAL_CLIENT_SECRET = os.environ["PAYPAL_CLIENT_SECRET"]
PAYPAL_WEBHOOK_ID = os.environ["PAYPAL_WEBHOOK_ID"]
PAYPAL_MODE = os.environ.get("PAYPAL_MODE", "sandbox")
PAYPAL_API_BASE = (
    "https://api-m.paypal.com" if PAYPAL_MODE == "live" else "https://api-m.sandbox.paypal.com"
)
```

### OAuth Token Caching
```python
import time, requests
from django.conf import settings

_token_cache = {"access_token": None, "expires_at": 0}

def get_access_token():
    if _token_cache["access_token"] and time.time() < _token_cache["expires_at"]:
        return _token_cache["access_token"]
    resp = requests.post(
        f"{settings.PAYPAL_API_BASE}/v1/oauth2/token",
        auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET),
        data={"grant_type": "client_credentials"},
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()
    _token_cache["access_token"] = data["access_token"]
    _token_cache["expires_at"] = time.time() + data["expires_in"] - 60  # 60s buffer
    return _token_cache["access_token"]
```

### Order Model
```python
class Order(models.Model):
    paypal_order_id = models.CharField(max_length=64, unique=True, db_index=True)
    capture_id = models.CharField(max_length=64, blank=True, default="")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="USD")
    status = models.CharField(max_length=16, choices=[
        ("CREATED", "Created"), ("APPROVED", "Approved"),
        ("COMPLETED", "Completed"), ("FAILED", "Failed"),
    ], default="CREATED")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Idempotent Order Capture
```python
@require_POST
def capture_order(request, order_id):
    order = Order.objects.filter(paypal_order_id=order_id).first()
    if order is None:
        return JsonResponse({"error": "Unknown order"}, status=404)
    if order.status == "COMPLETED":  # Already captured
        return JsonResponse({"status": "COMPLETED"})
    # ... capture via PayPal API ...
```
- Use **`PayPal-Request-Id`** (UUID) header for idempotency on create-order
- Set **server-side price book** (catalog dict) — never accept price from the frontend

### Smart Payment Buttons (Frontend)
```javascript
paypal.Buttons({
    createOrder: function () {
        return fetch('/api/paypal/create-order/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify({ product_id: 'tshirt-001' }),
        }).then(res => res.json()).then(data => data.id);
    },
    onApprove: function (data) {
        return fetch('/api/paypal/capture-order/' + data.orderID + '/', {
            method: 'POST', headers: { 'X-CSRFToken': csrftoken },
        }).then(res => res.json()).then(result => {
            if (result.status === 'COMPLETED') window.location.href = '/checkout/thank-you/';
        });
    },
    onError: function (err) { console.error('PayPal error', err); },
}).render('#paypal-button-container');
```

### Webhook Verification (replacing IPN)
- Subscribe to `PAYMENT.CAPTURE.COMPLETED` on PayPal Developer Dashboard
- Compare webhook `event_type` and verify signature using `PAYPAL_WEBHOOK_ID`
- Do not fulfill orders based on client-side success — always wait for webhook confirmation

### PCI DSS Note
- PayPal Smart Buttons = **SAQ A** (lightest compliance tier)
- Card data never touches your servers — PayPal hosts the UI

---

## 5. React + Bootstrap Integration Guide

### Installation
```bash
npm install react-bootstrap bootstrap
```
Import in `src/index.js`:
```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

### Key Components for Ecommerce
| Component | Use Case |
|-----------|----------|
| `Navbar`, `Nav` | Main navigation, category menu |
| `Card` | Product cards with image, title, price |
| `Button` | Add to cart, checkout actions |
| `Modal` | Quick-view product details, cart summary |
| `Form`, `Form.Control` | Checkout forms, search, filters |
| `Carousel` | Product image gallery, hero banners |
| `Alert` | Cart notifications, error messages |
| `Badge` | Cart item count, discount/sale labels |
| `Spinner` | Loading states for API calls |
| `Pagination` | Product listing page navigation |

### Form with Validation Example
```jsx
import { Form, Button } from 'react-bootstrap';

const CheckoutForm = () => (
  <Form>
    <Form.Group controlId="formEmail">
      <Form.Label>Email</Form.Label>
      <Form.Control type="email" placeholder="Enter email" required />
    </Form.Group>
    <Form.Group controlId="formAddress">
      <Form.Label>Shipping Address</Form.Label>
      <Form.Control type="text" placeholder="Street address" />
    </Form.Group>
    <Button variant="primary" type="submit">Place Order</Button>
  </Form>
);
```

### Best Practices
1. **Maintain consistency** — use Bootstrap components for coherent team-wide interface
2. **Avoid overloading** — import only the components and styles you need (tree-shaking)
3. **Learn utility classes** — `d-flex`, `mt-3`, `text-center` for quick adjustments without custom CSS
4. **Override with SCSS variables** — `npm install node-sass` + custom `_variables.scss` for brand theming
5. **Keep Bootstrap version locked** — major versions break patterns; use `package.json` lock file

### React Best Practices (2026)
- **Functional components + hooks** — no class components for new code
- **Component composition** — small, reusable, single-responsibility components
- **Custom hooks** — extract shared logic (useAuth, useCart, usePayPal)
- **Lazy loading** — `React.lazy()` + `Suspense` for route-level code splitting
- **Memoization** — `React.memo` for pure components, `useMemo`/`useCallback` for expensive computations
- **Folder structure** — feature-based (components/, pages/, hooks/, services/, store/)

---

## 6. JWT Authentication Best Practices

### SimpleJWT Configuration
```python
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
}
```

### Token Storage — HttpOnly Cookies over localStorage
| Storage | Risk |
|---------|------|
| `localStorage` | **XSS-vulnerable** — any injected script can read tokens |
| `httpOnly` cookie | XSS-proof — JavaScript cannot read it |
| Memory (Redux/Vuex) | Lost on page refresh; short-lived access only |

**Recommended approach**: Access token in memory → httpOnly refresh cookie
```python
# Backend cookie settings
SIMPLE_JWT.update({
    'AUTH_COOKIE': 'access_token',
    'REFRESH_COOKIE': 'refresh_token',
    'AUTH_COOKIE_HTTP_ONLY': True,
    'AUTH_COOKIE_SECURE': True,  # HTTPS only in production
    'AUTH_COOKIE_SAMESITE': 'Strict',
})
```

### Frontend Axios Interceptor
```javascript
import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1/' });

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      await axios.post('/api/token/refresh/', {}, { withCredentials: true });
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Security Considerations
- **Short-lived access tokens** (5-15 min) limit damage from leaks
- **Token rotation** — each refresh issues a new refresh token and blacklists the old one
- **Rate limit auth endpoints** — 5-10 requests/min on `/api/token/`
- **Blacklist compromised tokens** — `BLACKLIST_AFTER_ROTATION=True` requires `rest_framework_simplejwt.token_blacklist` app
- **HTTPS everywhere** — tokens are bearer credentials; plain HTTP exposes them
- **Minimize token payload** — only include essential claims (`user_id`, `exp`, `iat`); avoid storing roles/permissions in the token if they change frequently

### DRF Authentication Classes Order
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',  # optional fallback
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}
```

---

## 7. Security Checklist

### Django Backend
- [ ] `SECRET_KEY` in environment variable, never in settings.py
- [ ] `DEBUG=False` in production
- [ ] `ALLOWED_HOSTS` restricted to known domains
- [ ] `SECURE_SSL_REDIRECT=True`
- [ ] `SESSION_COOKIE_SECURE=True`, `CSRF_COOKIE_SECURE=True`
- [ ] `SECURE_HSTS_SECONDS=31536000`, `SECURE_HSTS_INCLUDE_SUBDOMAINS=True`
- [ ] `X_FRAME_OPTIONS='DENY'`
- [ ] `SECURE_CONTENT_TYPE_NOSNIFF=True`
- [ ] Rate limiting on auth endpoints
- [ ] CORS whitelist — explicit origins; never wildcard
- [ ] CSRF protection on all state-changing requests
- [ ] Input validation on all serializer fields
- [ ] SQL injection protection — use Django ORM, never raw SQL without parameterization
- [ ] Keep dependencies updated (`pip-audit` or `dependabot`)
- [ ] Sentry error tracking with `send_default_pii=False`

### Docker/Infrastructure
- [ ] Non-root users in containers (`USER django`)
- [ ] Multi-stage builds to minimize image size
- [ ] Image vulnerability scanning (Trivy, Docker Scout)
- [ ] Secrets via environment variables or Docker secrets — never in image layers
- [ ] SSL/TLS via Let's Encrypt
- [ ] Nginx rate limiting to prevent DOS
- [ ] Regular database backups
- [ ] Log rotation (`max-size: 10m`, `max-file: 3`)
- [ ] Docker Compose resource limits (`cpus: '2'`, `memory: 2G`)

### PayPal
- [ ] Server-side price determination — never trust client-provided amounts
- [ ] Idempotency keys on order creation
- [ ] Webhook signature verification
- [ ] Store `capture_id` for refund capability
- [ ] SAQ A compliance (card data doesn't touch your server)

### React Frontend
- [ ] CSRF token on all mutating API requests
- [ ] JWT in httpOnly cookie (not localStorage)
- [ ] URL validation for any user-provided links
- [ ] Content Security Policy headers
- [ ] Sanitize user-generated content (product reviews, etc.)
- [ ] Lazy load routes to prevent shipping unused code

---

## 8. Common Pitfalls

| # | Pitfall | Impact | Solution |
|---|---------|--------|----------|
| 1 | **Client-side payment price** | Fraud (users can pay less) | Always compute price server-side from catalog |
| 2 | **No idempotency on PayPal orders** | Duplicate charges | Use `PayPal-Request-Id` header with UUID |
| 3 | **Using `django-paypal` (IPN)** | Deprecated, unreliable | Use PayPal Orders API v2 + Webhooks |
| 4 | **Missing `select_related` / `prefetch_related`** | N+1 query explosion | Profile with django-silk; use Prefetch aggressively |
| 5 | **Sending full model data in API** | Bloated payloads, slow renders | Use `only()`, `defer()`, custom serializers with limited fields |
| 6 | **No pagination on product listings** | Timeout on large catalogs | Use DRF pagination (page size 12-24) |
| 7 | **CORS wildcard in production** | Security vulnerability | Explicit origin whitelist only |
| 8 | **JWT in localStorage** | XSS token theft | Use httpOnly cookies with SameSite=Strict |
| 9 | **Long-lived access tokens (>30 min)** | Extended leak window | Set 5-15 min; use refresh rotation |
| 10 | **No rate limiting on API** | Brute force, DOS | DRF throttling + Nginx limit_req |
| 11 | **Running with DEBUG=True** | Info disclosure | CI gate prevents DEBUG in production settings |
| 12 | **No database connection pooling** | Connection exhaustion | pgBouncer + `CONN_MAX_AGE` |
| 13 | **All-in-one Dockerfile without multi-stage** | Large images (500MB+) | Multi-stage — separate builder from runtime |
| 14 | **Hardcoded secrets in Dockerfile** | Secrets leak into registry | Use `.env` + `--env-file` never in build args |
| 15 | **Forgetting `@never_cache` on health check** | Stale health status | Cache-control headers on monitoring endpoints |
| 16 | **Over-indexing** | Slow writes, wasted storage | Index only what's used in WHERE/ORDER BY/GROUP BY |
| 17 | **`prefetch_related` with large collections** | Huge IN clause, slow Python joins | Use `Prefetch(to_attr=...)`, `ArrayAgg`, or subqueries |
| 18 | **Missing static file compression** | Slow page loads | Enable Nginx gzip + WhiteNoise compression |
| 19 | **No Redis caching** | Repeated DB hits for same data | Cache product listings, category trees, session data |
| 20 | **Single Gunicorn worker** | Poor throughput | `2-4 × CPU cores` workers with `gthread` worker class |

---

## 9. Sources

| URL | Content |
|-----|---------|
| [Kellton — DRF Best Practices 2026](https://www.kellton.com/kellton-tech-blog/designing-rest-apis-with-django-rest-api-framework) | DRF best practices for scalable APIs: versioning, serialization, pagination, throttling |
| [GitGuardian — 10 PostgreSQL Tips for Django](https://blog.gitguardian.com/10-tips-to-optimize-postgresql-queries-in-your-django-project) | Detailed PostgreSQL optimization: indexing, aggregation vs subqueries, bulk writes, RAM management |
| [Medium — Production-Ready Django with Docker 2026](https://medium.com/@sizanmahmud08/production-ready-django-with-docker-in-2026-complete-guide-with-nginx-postgresql-and-best-1fb248e65983) | Full Docker Compose config: multi-stage build, Nginx, Gunicorn, Redis, pgBouncer, Sentry, backups |
| [MicroPyramid — PayPal Django Integration 2026](https://micropyramid.com/blog/e-commerce-paypal-integration-with-django) | Modern PayPal flow: Orders API v2, OAuth caching, Smart Buttons, webhooks, idempotency |
| [MiTSoftware — Bootstrap in React 2026](https://mitsoftware.com/en/blog/guide-to-using-bootstrap-in-react-projects) | React Bootstrap integration guide: components, forms, modals, SCSS customization |
| [Medium — Mastering JWT in DRF](https://medium.com/@onurmaciit/mastering-jwt-authentication-in-django-rest-framework-best-practices-and-techniques-d47f906f530a) | JWT best practices: short-lived tokens, rotation, blacklisting, asymmetric signing, cache validation |
| [Level Up Coding — JWT in HttpOnly Cookies](https://levelup.gitconnected.com/wt-in-http-only-cookies-2025-secure-authentication-with-django-rest-react-06c6edd4b892) | Secure JWT storage: httpOnly cookie approach vs localStorage risk |
