# Question Studio async queue: executable SQL integration gate

This CI is intentionally **not** an end-to-end Cloud Tasks or universal generation worker test. It runs the production TypeScript enqueue, task claim and atomic review-save functions against a disposable PostgreSQL 17 container using synthetic OPS-001 questions. Only the deterministic engine registry and the SQL client import are substituted by test-only stubs. The actual prepared SQL strings, transactions, locks, state checks, item/version persistence, audit and outbox logic are executed by a real PostgreSQL connection.

The workflow executes both repository queue migrations after creating only the minimal canonical table structures from existing Neon. It deliberately cannot connect to Neon because it requires `QS_CI_ISOLATED_POSTGRES=yes` and a disposable `postgres://examtree_ci:...` connection URI.

Acceptance scenarios:
- Runtime flags off reject enqueue.
- Two concurrent same-idempotency-key requests return one run, and a changed payload returns a 409 conflict.
- One task claims a run; a duplicate concurrent task gets `busy`.
- A wrong lease token is denied before saving any items.
- Correct lease saves exactly two review items and version-1 payloads, audit event and outbox event in one transaction.
- Worker-injected eligibility is overridden by package-authoritative review-only policy.
- A duplicate delivery after commit reports `already_committed` and saves no additional questions.
- Injected SQL error during the second version insert rolls back all item inserts and status transition, leaving the run retryable. Retrying with the current lease after removing the injected failure completes the review.
- An expired lease can be reclaimed with a new token; the old worker cannot write.
- Cancelled runs cannot be claimed.

This is a **development safety gate**, not permission to enable production Cloud Tasks. The signed OIDC HTTP request, actual universal worker compute, Neon production migration, Cloud Tasks IAM, and admin Generate UI still require separate end-to-end staging and authorization. No production data, deployment, GCP service, Cloudflare environment or Cashfree settings are touched by this PR.
