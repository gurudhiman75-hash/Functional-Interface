# Question Studio — opt-in staged enqueue HTTP endpoint (13 Oct 2026)

The seven Universal worker compute-only cases passed on Cloud Run `numfix`, the isolated Neon test branch received the two additive migrations, and an independent Postgres 17 CI suite proved schema constraints and rollback. None of those exercises authenticated API task delivery end-to-end.

This PR mounts an **explicitly separate** admin route `POST /api/admin/question-studio/runs/async-staging` behind the existing `authenticate` middleware and `content.generation.run` admin permission. It is not the canonical website Generate route (`POST /runs`) and is disabled on Render and production Cloud Run, regardless of the other feature flags.

For staging-only activation, all conditions must hold:
- `EXAMTREE_API_RUNTIME=cloud-run` and `EXAMTREE_API_STAGING=true`
- `EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED=true`
- `EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED=true`
- `EXAMTREE_QUESTION_STUDIO_STAGING_ENQUEUE_APPROVED=true`
- The API's `DATABASE_URL` must point to an **isolated Neon test branch with both migrations applied**. This is a deployment prerequisite, not automatically verified by the code.

The staging request uses exactly the validated remote compute envelope (`request`, `count`, `selectedCpIds`, optional exam profile and source-difficulty fields) and an `Idempotency-Key` header of 8–128 characters. It rejects missing admin identity or key, malformed payload, and oversized requests. It calls the existing internal transactional enqueue service; new requests return HTTP 202 with run ID/status, and same-key identical retries return HTTP 200 with the existing run receipt. Mismatched same-key payloads fail 409. No task worker is called directly by this route.

**Do not enable** this staging endpoint until the real Cloud Tasks queue and signed receiver have passed negative auth tests, the correct Neon branch is configured, and a separate deployment approval has been obtained. The generic outbox publisher excludes queue events, so queued rows will remain pending unless the dedicated dispatcher is separately activated.

No Cloudflare routing, production Neon migration, student data, payments/Cashfree, Render, or live Generate behavior is modified simply by merging this source. A staging-only API image update and manual end-to-end test are required afterward.
