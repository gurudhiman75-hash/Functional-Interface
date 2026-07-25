# Business Analytics freeze readiness

## Canonical scope

Business Analytics is a read-only administrative reporting surface over the canonical Commerce ledger. It covers:

- 7, 30, 90 and 365-day reporting windows
- gross revenue from paid, partially refunded and refunded orders
- processed refunds and net revenue
- created-to-paid order conversion
- paying-student count and average order value
- equal-length previous-window comparison
- daily gross, refund and net series
- package orders, buyers, revenue and active entitlements
- coupon paid-redemption, discount and attributed-revenue metrics
- bounded aggregate CSV export without student PII
- data-quality diagnostics for payment, refund and entitlement inconsistencies

## Deliberately excluded

- student ranks or leaderboards
- personally identifiable CSV exports
- mutation or financial reconciliation actions
- speculative lifetime value, retention or attribution models
- tax accounting beyond the frozen order fields
- cross-currency conversion

## Revenue contract

Gross revenue is recognized from canonical orders with a paid timestamp and a status of `paid`, `partially_refunded` or `refunded`. Net revenue subtracts only canonical refunds whose status is `processed`. Requested or failed refunds do not reduce revenue.

The workspace preserves stored currency codes and formats values using the `en-US` locale. It does not convert currencies.

## Access and privacy

The API and workspace require `commerce.orders.read`. The CSV contains aggregate order evidence only: order number, paid time, status, currency and monetary totals. It excludes student identity fields.

## Freeze decision

The source is freeze-ready for this declared aggregate scope once the static validator, API build, admin typecheck, tests and build pass in CI. Production correctness still requires authenticated deployment verification against real Commerce activity.
