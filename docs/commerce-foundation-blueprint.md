# ExamTree Commerce foundation

## Decision

Commerce must be implemented as a server-authoritative ledger. Browser state, payment-provider callbacks, package pages and administrator forms must never directly grant access.

The implementation sequence is:

1. canonical product/package catalogue and immutable versions
2. orders with frozen commercial snapshots
3. provider payment attempts and append-only webhook events
4. coupon validation and redemption accounting
5. entitlement grants and revocations
6. student discovery, checkout and My Packages
7. administrative packages, orders/payments, coupons and entitlements
8. reconciliation, refunds, quality diagnostics and freeze audit

## Core invariants

- A package is a stable identity; commercial edits create a new immutable package version.
- Every order stores a frozen item, price, discount, tax and total snapshot.
- Money is stored in integer minor units plus an ISO-4217 currency code.
- Payment-provider IDs are unique and idempotent.
- Webhook payloads are append-only evidence; duplicate provider events are ignored safely.
- A successful payment does not itself authorize test access. A separate transactional entitlement grant does.
- Entitlements point to the purchased immutable package version and may be time bounded.
- Revocation never deletes purchase evidence.
- Coupons are evaluated server-side against dates, limits, minimum order value, products and users.
- Refunds and payment reversals do not rewrite the original order or payment event.
- All administrative mutations append immutable `platform.audit_events` evidence.

## Canonical schemas

The additive migration creates a `commerce` schema with:

- `products`
- `product_versions`
- `product_version_tests`
- `coupons`
- `coupon_products`
- `orders`
- `order_items`
- `coupon_redemptions`
- `payment_attempts`
- `payment_events`
- `refunds`
- `entitlements`
- `entitlement_tests`

## Product lifecycle

Stable product statuses:

- `draft`
- `active`
- `archived`

Version publication freezes title, description, currency, list price, sale price, validity, included tests and configuration. Existing orders and entitlements continue to reference the purchased version.

## Order lifecycle

- `created`
- `payment_pending`
- `paid`
- `cancelled`
- `expired`
- `partially_refunded`
- `refunded`
- `payment_failed`

Only the server may transition order state. Paid status requires verified provider evidence or an explicitly audited zero-value order flow.

## Payment lifecycle

- `created`
- `authorized`
- `captured`
- `failed`
- `cancelled`
- `refunded`
- `partially_refunded`

Provider webhooks are verified before use. API callbacks from the browser are treated only as hints and cannot mark an order paid.

## Entitlement lifecycle

- `active`
- `expired`
- `revoked`

An entitlement is granted idempotently from a paid order item. Access checks must resolve active entitlements server-side and compare the requested test against immutable `entitlement_tests` rows.

## Permissions

Planned granular permissions:

- `commerce.products.read`
- `commerce.products.manage`
- `commerce.orders.read`
- `commerce.orders.manage`
- `commerce.coupons.read`
- `commerce.coupons.manage`
- `commerce.entitlements.read`
- `commerce.entitlements.manage`

The migration adds these permission records but does not assign them to non-super-admin roles automatically.

## Security boundaries

- No card, UPI credential or payment secret is stored.
- Provider webhook secrets remain environment-only.
- Raw provider payloads are retained as JSON evidence with sensitive headers excluded.
- Student-facing order reads are identity scoped.
- Administrative reads require granular commerce permissions.
- Manual entitlement grants/revocations require a reason, audit evidence and idempotency key.
- Order and payment exports must exclude provider secrets and unnecessary personal data.

## Deployment status

The schema migration is source-only until explicitly applied and verified against the canonical Neon project. Commerce navigation must remain non-live until the migration, API builds, authenticated reads, idempotency tests and payment webhook verification are complete.
