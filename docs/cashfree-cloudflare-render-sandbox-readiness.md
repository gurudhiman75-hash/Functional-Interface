# ExamTree Cashfree: Cloudflare Pages + Render sandbox readiness

> Scope: **sandbox only**. PR #3253 is draft and must not be deployed to collect real money until the separate real-provider acceptance tests pass.

## Confirmed hosting layout (9 October 2026)

- Student Cloudflare Pages origin: `https://functional-interface.pages.dev`.
- Backend Render API origin: `https://examtree-new.onrender.com` (`New-main`, manual deployment).
- Pages proxies browser `/api/*` requests to Render. Cashfree webhooks must instead target the public Render API **directly**.
- Website domain must be whitelisted in Cashfree's merchant dashboard before real checkout is opened.

## Render configuration for an isolated sandbox deploy

| Variable | Sandbox value / source |
| --- | --- |
| `EXAMTREE_PAYMENT_PROVIDER` | `cashfree` |
| `CASHFREE_ENV` | `sandbox` |
| `CASHFREE_CLIENT_ID` | Cashfree **sandbox** app credentials — secret value in environment only |
| `CASHFREE_CLIENT_SECRET` | Cashfree **sandbox** secret — never commit or send in chat |
| `EXAMTREE_PUBLIC_ORIGIN` | `https://functional-interface.pages.dev` (or an approved test domain) |
| `EXAMTREE_API_ORIGIN` | `https://examtree-new.onrender.com` (or the actual isolated sandbox API host) |

**Isolation required:** Do not enable sandbox checkout on the student-facing production Render service or use production commerce database records for test purchases. Prefer a separate staging API and database when validating refunds or entitlement grants. Setting env vars alone does not deploy PR #3253.

## Callback contract

- Cashfree `order_meta.return_url` is `EXAMTREE_PUBLIC_ORIGIN + /orders/:orderId` (student browser).
- Cashfree `order_meta.notify_url` is `EXAMTREE_API_ORIGIN + /api/billing/cashfree/webhook` (direct signed provider-to-API webhook).
- Returning to the browser never grants access. The backend must independently validate the captured payment and reconcile entitlements before a test becomes available.
- Restrict callback origins to HTTPS (HTTP permitted only for localhost development).
- The automated `cashfree-payments.test.mjs` test uses mocked Cashfree responses; it **does not** prove sandbox provider connectivity.

## Before production

1. Obtain provider sandbox credentials in the isolated API service, without recording secret values in source control.
2. Confirm Cashfree merchant website whitelisting for the actual checkout domain.
3. Verify webhook delivery and signature, success, failure, repeat delivery, expired order, and interrupted redirect.
4. Verify one paid entitlement is granted **once** and the matching package/tests unlock for the correct signed-in user.
5. Verify a safe Cashfree refund workflow, its reconciliation, and entitlement revocation policy. Cashfree sandbox refund requests now use Cashfree's own API, are verified through Cashfree's refund status endpoint (or signed status webhook), and only a verified full refund revokes entitlements. Production refunds remain disabled unless `CASHFREE_REFUNDS_ENABLED=true` is explicitly configured in a reviewed rollout. Verify pending, success, failure, webhook replay, and full/partial refund access policy before production rollout.
6. Review Privacy Policy, Terms, Contact and Refund Policy, customer-facing support details and any applicable charges.
7. Verify actual merchant processing fee / promotional eligibility in Cashfree Dashboard before displaying fee estimates as a guaranteed rate. Public promotional pricing is not proof of account-specific pricing.
8. Complete CI, sandbox acceptance and production rollback checks before merging or enabling live payment settings.
