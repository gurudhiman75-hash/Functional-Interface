# Cashfree SANDBOX — read-only Examtree reconciliation check

The independent Neon audit dated 2026-10-11 found two expired canonical
payment-pending orders, two signed historical Cashfree success-event payment IDs
disagreeing with local provider payment IDs, and one unresolved created refund.

Never issue a new refund POST, close an order, rewrite a payment ID or grant
entitlements based only on this local inventory. The connected Cashfree
merchant account may not be the same sandbox account.

## Run once in Google Cloud Shell

Prerequisites: current Google Cloud Shell account may read the existing
Secret Manager secrets examtree-api-database-url,
examtree-cashfree-sandbox-client-id, and
examtree-cashfree-sandbox-client-secret. PostgreSQL 17 client is installed.

    cd ~/Functional-Interface
    git switch New-main
    git pull --ff-only origin New-main
    python3 scripts/audit-cashfree-sandbox-readonly.py

The script reads inventory with fixed read-only SQL and CA-verified Neon TLS,
then makes GET calls to https://sandbox.cashfree.com/pg ONLY. It never issues
payment captures, refunds, entitlement grants, cancellation, database writes
or Cloud Run changes. Cashfree API version 2025-01-01 matches the live source.
It reports anonymized order hashes, local statuses, counts and finding codes,
not secrets, raw payment IDs, student data or API bodies.

Exit 2 means there are provider findings requiring manual review, which is
expected until evidence is reconciled. Exit 1 indicates unavailable secrets,
database errors or provider transport failures. Exit 0 means this limited
inventory had no findings; it does NOT alone certify production payments.

Provider missing HTTP 404: verify that the sandbox merchant account in the
two existing Secret Manager secrets owns the historical order. Do not assume a
missing record means no payment occurred.

Signed webhook/payment reference mismatch: preserve all records and compare
with Cashfree's GET evidence. An old 19-digit JavaScript rounding error might
explain the conflict but never justifies unconditional local mutation.

Unresolved created refund: if the provider has accepted or processed it, use
the existing narrowly guarded refund reconciliation flow after independent
verification. If provider says 404, verify the merchant environment before
considering another POST.

Pending orders: do not close or revoke based on local expiry alone; gateway
payment retry and delayed webhook delivery need an explicit reviewed policy.

Once reviewed, proceed to authenticated Cloud Run staging payment, attempt,
superadmin RBAC and negative authorization tests before frontend/API cutover.
No live traffic or production provider webhook changes are authorized here.

## Exact payment/refund evidence for historical rounding

The audit emits a separate anonymized REFUND_REVIEW line for each unresolved
refund. It checks whether the refund's exact Cashfree payment ID appears both in
a successful provider payment GET and in a verified, processed webhook tied to
the same order, capture amount and currency. It also flags missing mandatory
refund details. This information is **diagnostic only**; it does not mutate
the local payment ID or refund status.

To process a successful refund, the existing API must independently verify
the complete refund evidence and (where needed) its strict legacy JavaScript
Number rounding predicate, then perform an idempotent, transactionally safe
reconciliation. Gateway success alone never authorizes a blind SQL update.
A partial refund leaves the student's existing entitlement active.
