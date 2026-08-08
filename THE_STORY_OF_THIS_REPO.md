# The Story of ecom

_The ecommerce platform that's still running Django 3.1_

---

## Prologue: The Shop That Works

2021. "We need an ecommerce platform."

Six months later: working checkout, PayPal integration, product catalog, cart, orders, admin panel.

**Then the team moved on.** The platform kept running. Orders processed. Customers happy.

**Now it's 2025. Django 3.1 has been EOL since December 2021.**

---

## Chapter 1: The Stack That Was Modern

```python
# requirements.txt (2021)
Django==3.1.14
djangorestframework==3.13.1
django-cors-headers==3.11.0
django-filter==21.1
djangorestframework-simplejwt==5.2.0
gunicorn==20.1.0
psycopg2-binary==2.9.3
```

```json
// frontend/package.json (2021)
{
  "react": "^17.0.2",
  "redux": "^4.2.0",
  "react-redux": "^7.2.6",
  "@reduxjs/toolkit": "^1.9.0"
}
```

**What was good:**

- Django 3.1: async views (experimental), JSONField, `StrEnum`/`IntEnum` field choices
- DRF 3.13: solid, stable
- React 17: new JSX transform, no event pooling
- Redux Toolkit: opinionated, less boilerplate

**What aged poorly:**

- Django 3.1 → 3.2 → 4.0 → 4.1 → 4.2 → 5.0 (each with breaking changes)
- React 17 → 18 (concurrent features, automatic batching)
- Redux Toolkit 1.x → 2.x (TypeScript improvements)

---

## Chapter 2: The PayPal Integration That Still Works

```python
# backend/payments/views.py
class CreatePayPalOrderView(APIView):
    def post(self, request):
        order = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {"payment_method": "paypal"},
            "redirect_urls": {
                "return_url": settings.PAYPAL_RETURN_URL,
                "cancel_url": settings.PAYPAL_CANCEL_URL
            },
            "transactions": [{
                "amount": {"total": str(total), "currency": "USD"},
                "description": f"Order #{order.id}"
            }]
        })
        if order.create():
            return Response({"approval_url": order.links[1].href})
```

**It still works.** PayPal's REST SDK hasn't changed in 3 years. The webhook handler processes `PAYMENT.SALE.COMPLETED` and `PAYMENT.SALE.DENIED` correctly.

**But:** `paypalrestsdk` is unmaintained. The team should migrate to PayPal's new Checkout SDK (client-side) + Orders API (server-side).

---

## Chapter 3: The Dual-Server Dance

```
Backend:  python manage.py runserver     # Port 8000
Frontend: bun run start                       # Port 3000
```

**CORS config:**

```python
# settings/base.py
CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
CORS_ALLOW_CREDENTIALS = True
```

**Proxy in development:**

```json
// frontend/package.json
"proxy": "http://localhost:8000"
```

**Production:** Nginx proxies `/api/*` to Gunicorn, serves React static files. Works. But two codebases, two deploys, two failure domains.

---

## Chapter 4: The Upgrade That Never Happened

| Version        | Released | EOL      | Status      |
| -------------- | -------- | -------- | ----------- |
| Django 3.1     | Aug 2020 | Dec 2021 | **RUNNING** |
| Django 3.2 LTS | Apr 2021 | Apr 2024 | Missed      |
| Django 4.2 LTS | Apr 2023 | Apr 2026 | Available   |
| Django 5.0     | Dec 2023 | Aug 2024 | Available   |
| Django 5.1     | Aug 2024 | Apr 2025 | Current     |

**Migration path blocked by:**

1. `django-filter` 21.x → 23.x (breaking FilterSet changes)
2. `djangorestframework-simplejwt` 5.x → 6.x (token blacklist changes)
3. `django-cors-headers` 3.x → 4.x (CORS_ALLOWED_ORIGINS format)
4. Python 3.10+ required for Django 4.2+

**Frontend migration blocked by:**

1. React 17 → 18 (concurrent features, `createRoot`)
2. Redux Toolkit 1.x → 2.x (TypeScript, `configureStore` changes)
3. Webpack 5 (CRA 5) or migrate to Vite

---

## Chapter 5: The Consolidation Verdict

July 2025 workspace review:

| Project               | Stack                   | Status                |
| --------------------- | ----------------------- | --------------------- |
| `ecom`                | Django 3.1 + React 17   | **Archive candidate** |
| `rhixecompany-comics` | Django 4.x + Next.js 16 | **Survivor**          |

**ecom contributes to the survivor:**

- PayPal integration patterns → `rhixecompany-comics`
- Product/order models → adapted for comics marketplace
- React component patterns (forms, tables) → Next.js components

**What gets archived:**

- Django 3.1 codebase (security liability)
- React 17 + CRA frontend (deprecated)
- Separate frontend/backend repos (consolidated in Next.js)

---

## Chapter 6: The Security Debt

**Running Django 3.1 in 2025 means:**

- No security patches for 3.5 years
- CVE-2022-28346 (password reset token leakage) — unpatched
- CVE-2022-34265 (SQL injection in `Trunc`/`Extract`) — unpatched
- CVE-2023-23969 (cache poisoning) — unpatched
- CVE-2023-31047 (path traversal in `FileField`) — unpatched

**Mitigations in place:**

- WAF (Cloudflare) blocking known exploit patterns
- No public admin (`/admin/` IP-restricted)
- Rate limiting on auth endpoints
- Regular dependency scans (GitHub Dependabot)

**But:** Defense in depth requires a patched framework. The only real fix is upgrade.

---

## Epilogue: The Shop That Will Close

The platform works. Customers buy. PayPal pays out. Admin manages products.

But the foundation is rotting. The next Django CVE won't be blocked by the WAF. The next Python 3.11 incompatibility will break `pip install`.

**The decision:** Archive. Migrate the patterns. Shut down the servers.

The code taught a team how to build ecommerce. The patterns live on. The version numbers die.

---

_Written by the workspace chronicler, July 25, 2025.  
Filed at `projects/ecom/THE_STORY_OF_THIS_REPO.md`._
