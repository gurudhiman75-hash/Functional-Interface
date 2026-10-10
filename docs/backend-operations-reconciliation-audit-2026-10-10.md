# ExamTree backend operations & commerce reconciliation — 10 October 2026

All findings were independently read from the current Neon project/branch and
the authenticated code repository. No frontend changes or financial transactions.

## Outbox / queued jobs

- `platform.outbox_events`: 15 total, **15 published**, **0 pending**,
  **0 outstanding retry errors**, including 11 Question Studio generation-created
  events. The earlier 14-event pending backlog has cleared.
- `operations.jobs`: 0 rows; no queued, running, failed or stale processing jobs
  to clean up *in this table*. This does not prove that all separate generation
  workers or their external queues are idle or correctly scheduled.
- Cloud Run API background job is provisioned by deployment script but deliberately
  **not scheduled/executed** while Render may still be polling the same dataset.
  Do not enable duplicate consumers.

## Cashfree recorded state (four test orders)

- One captured/paid order with an active entitlement to the sandbox test.
- One fully refunded order with the entitlement revoked.
- One failed and one user-dropped/cancelled payment attempt, both pending
  as canonical orders and both with **zero entitlement grants**.
- Two pending canonical orders have `expires_at < now()`: provider verification
  is required before final cancellation or closure.
- One `created` ₹5 partial refund request has **no provider refund reference**
  and has not been processed. **Do not retry POST blindly**: provider might have
  accepted the original request, and a duplicate could cause a second refund.
- Each captured order has two stored signed/processed Cashfree success events
  containing **different** payment IDs; one event per order does not match
  the immutable captured provider payment reference. The historical records
  have no `processing_error` flag for those mismatches. The modern webhook
  includes a mismatch-reconciliation branch, but the old events must be
  checked against the actual Cashfree **sandbox** provider before being marked
  resolved. Do not infer two real captures based only on stored events.
- The connected Cashfree merchant account did not locate the sandbox test order.
  Connected merchant production and sandbox records can differ; true provider
  settlement is **not independently verified**.

## Operational visibility added

Authenticated, read-only route:
`GET /api/admin/commerce/orders/reconciliation/health`

Permission: `commerce.orders.read`. Response includes limited sets
of conflicting signed success references, unresolved refunds and expired
canonical pending orders, plus counts/truncation warning.
No gateway calls, mutations, retries, captures or entitlement changes.

## Neon backup and resilience findings

Neon project `ExamTree`:
- Default branch `main` is **not protected**.
- Automatic snapshot schedule on `main` is **empty**.
- Snapshot list is **empty**.
- Project history retention is **21,600 seconds = 6 hours**.
- Subscription currently reports `free_v3`; supported snapshot scheduling and
  retention limits must be checked against the account before enabling backups.
- An isolated staging branch exists but is not an ongoing snapshot schedule or
  a verified point-in-time restore.

**Production gate:** decide backup retention and perform a restore drill on a
separate branch before accepting real student purchases. Do not assume the
six-hour history or a one-time staging branch is a durable backup.
Changing Neon plan, snapshots, branch protection, or connection security
may have cost/access implications and was **not** done in this audit.

## Before production migration

1. Verify Cashfree sandbox orders and refunds at Cashfree itself; reconcile the
   conflicting success evidence and unresolved partial refund.
2. Decide expired order closure rules, and separately test failed/abandoned
   payment retries, idempotency, webhook replay and order-to-entitlement parity.
3. Document and activate a single background scheduler when Render background
   duties are deliberately migrated.
4. Agree backup/restore policy for Neon with a verified restore test.
5. Keep the live website on its current API until backend handover is approved.
