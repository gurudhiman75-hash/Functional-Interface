# Commerce Freeze Readiness

## Declared canonical scope

The ExamTree Commerce domain now covers:

- package catalogue and immutable package versions
- ordered package test membership
- server-authoritative checkout and frozen pricing snapshots
- Razorpay payment attempts and signature-verified webhook events
- coupon validation and paid redemption evidence
- partial and full refund reconciliation
- paid and manual entitlements
- server-side paid-test delivery and attempt-start enforcement
- aggregate, currency-scoped Business Analytics and PII-free CSV export

## Invariants

1. Browser input never determines price, discount, payment capture, refund completion, or access.
2. A payment capture must match a canonical provider order, amount, and currency.
3. Payment events are append-only and idempotent by provider event identity.
4. Entitlements are issued separately from payment capture and remain traceable to immutable order-item evidence.
5. Full processed refunds revoke order-issued active entitlements; partial refunds do not silently alter access.
6. Package versions and purchased commercial snapshots are immutable.
7. Aggregate analytics do not export student PII or combine currencies.
8. Administrative mutations require granular Commerce permissions and immutable audit events.

## Final audit corrections

The freeze pass corrected two aggregation defects:

- order-ledger refunds no longer use `SUM(DISTINCT amount)`, which could undercount two legitimate refunds with the same amount
- package revenue is preaggregated independently from entitlement joins, preventing multiplication when more than one entitlement record references an order item

## Freeze decision

Commerce is source freeze-ready for the declared scope. Changes should now be limited to:

- confirmed correctness or security defects
- provider compatibility changes
- schema compatibility
- performance hardening that preserves metric definitions
- separately designed additions such as multi-item refund allocation, accounting exports, taxes, invoices, subscriptions, or additional payment providers

## Verification boundary

Source freeze readiness is not equivalent to production certification. Production certification still requires:

- successful Commerce freeze CI
- authenticated deployed admin smoke tests
- a real provider capture and duplicate-webhook replay
- a real coupon redemption
- partial and full refund tests with verified provider events
- entitlement grant, expiry, revocation, and paid-test access tests
- analytics reconciliation against known paid and refunded orders

No fake financial records should be inserted into the production database for these checks.
