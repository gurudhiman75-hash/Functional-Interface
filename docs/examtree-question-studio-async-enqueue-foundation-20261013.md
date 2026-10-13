# Question Studio async queue — atomic enqueue foundation

This is the **next, disabled-by-default step** after passing all seven universal Cloud Run staging generation tests and merging the authenticated progress API in PR #3356.

## What this PR adds

- An unapplied, reversible-by-not-applying SQL migration: `content.generation_enqueue_idempotency`. A unique `(actor_firebase_uid,idempotency_key)` reservation points to exactly one canonical generation run. This ensures retries and double clicks do not create duplicate jobs.
- Pure request validation and stable SHA-256 hashing of canonical fields (no Firebase bearer token, email, or arbitrary extra client fields). The same request with reordered JSON keys hashes identically, but changed CP/language/count does not.
- An **internal, unused** enqueue function that is off unless both `EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED=true` and `EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED=true` are explicitly set at runtime. It performs server-side package validation, then transactionally inserts a `queued` generation run, idempotency record, audit event, and outbox event. If another request with the same key already exists, it rolls back the new run and safely reads the prior receipt; a different request with the same key is a 409 conflict.
- Outbox event name: `question_studio.generation_run.queued.v1`, payload contains only run ID and queue version. **No Cloud Tasks request is issued in this PR.**

## What remains and must be approved separately

1. Review and apply the migration to an isolated Neon branch, run collision/rollback/concurrency tests there, then separately approve production application. Do not apply DDL from a chat merely to test.
2. Add outbox-to-Cloud-Tasks delivery with an allowlisted event type, OIDC identity and bounded retries. The existing generic outbox publisher must not accidentally consume the new event before its handler exists.
3. Add an authenticated task receiver that claims `queued` runs exactly once using a durable lease, calls the production universal worker, validates output and atomically saves item versions and review records. Include task-after-commit duplicate tests and crash-recovery tests.
4. Add API `POST /runs` opt-in branch that reuses the exact current package validation and respects specialized legacy routes, returning 202 without breaking existing 201 review returns.
5. Add the admin UI progress polling, retry and cancel actions. No background tasks should start from a browser refresh.
6. Verify superadmin/student RBAC, representative CPs in all four engines, 1/3/20 questions, source-ruled NUM-001 difficulty, multi-language, Neon persistence and rollback on staging before enabling live routing.

Neither the SQL migration nor new service is applied or invoked by a merge. Existing admin Generate button, Cloudflare, Render/Cashfree and student routes remain unchanged. The audited tests in this PR require no user data and never write to Neon.
