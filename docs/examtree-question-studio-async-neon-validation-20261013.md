# Question Studio — isolated Neon queue schema gate (13 October 2026)

## Real Neon validation

Project: `empty-sunset-07552954`. A *nondefault* branch was created from main:
`examtree-qs-async-queue-validation-20261013` (`br-flat-credit-atqi4rqe`).

**Only this isolated branch** received the existing additive repository migrations:
- `20261013_question_studio_async_enqueue_idempotency.sql`
- `20261013_question_studio_task_leases.sql`

Verified with actual Neon PostgreSQL:
- Primary unique `(actor_firebase_uid,idempotency_key)` and one-reservation-per-run uniqueness.
- Per-actor scoping of idempotency keys and 64-hex SHA validation.
- Unique one-row-per-run lease and bounded attempts (attempt four rejected).
- Lease-token rotation and stale-token conditional update returning zero rows.
- Expiry constraint and FK definitions.
- Synthetic one-item review commit with version 1, audit event and outbox event in a transaction. A deliberately invalid second item's version caused its nested savepoint to roll back without corrupting the first item.
- A fresh read-only query of production `main` confirmed both new tables were absent and the synthetic run IDs were absent.

**Scope limit:** These are SQL schema and simulated transaction checks, not a claim that the real Node receiver and Cloud Tasks queue have executed end-to-end. The Neon branch contains clearly marked disposable synthetic QA records; do not wire any live API to it without isolation review. Deleting the branch after validation requires a separate explicit approval. Neon branches and computes may incur usage charges.

## CI gate

`tests/sql/question-studio-async-neon-migration-smoke.sql` applies the same constraints to an ephemeral Postgres 17 container in GitHub Actions, tests same-key replay, unique run reservations, hash checks, lease claims, stale token refusal, attempt limit, invalid expiry and SQL rollback. It uses no Neon credentials and no customer records.

## Still to do before live enabling

1. Run actual Node enqueue, signed receiver, lease and fenced review-save code against a disposable Neon branch with concurrency tests. Only schema-shaped SQL has been verified today.
2. Build Cloud Tasks queue with dedicated OIDC identity, rate and retry budgets, no public task-handler authentication bypass.
3. Integrate admin Generate POST and progress UI behind opt-in flags; add 202 response, idempotency token, retries, cancellation and honest progress.
4. Run 1/3/20-question end-to-end staging across all engines, multilingual tests, cost and rollback checks.
5. Apply production migrations and enable queue only after explicit approval and full cutover gates.

**No production database migrations, payments, student attempt changes, Cloud Run production deployment, or Cloudflare routing changes were made.**
