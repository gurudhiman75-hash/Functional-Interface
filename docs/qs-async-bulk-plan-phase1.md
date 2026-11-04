# Question Studio: bulk async chapter review (phase 1, source only)

The current default Question Studio cockpit already splits requests of up to 250 questions into multiple synchronous runs. The isolated production chapter-review async route is separately guarded and intentionally accepts at most 20 questions per run.

This change adds an **inert** planner for future 1–250-question asynchronous parent operations. It allocates balanced child batches of at most 20, rejects invalid CP selections, and derives stable, domain-separated per-child idempotency keys. It **does not** wire an endpoint, change the 20-question production authorization limit, change flags, enqueue tasks, or publish questions.

## Needed before production use

1. Add a durable parent bulk operation table with admin identity, canonical request hash, status, child run IDs and child state transitions, and a unique parent idempotency reservation. Reconcile existing children on retries before any new dispatch.
2. Route through existing chapter review's RBAC, immutable canonical manifest, scope checks, review-only guarantees, expiry and production gating. Keep separate child-level 1–20 verification at receiver and worker; never treat a parent authorization as a bypass.
3. Permit **one explicitly approved child** to dispatch at a time. Wait for its verified terminal state and independently approved next release before dispatching another. Do not automatically resume paused queues or activate production flags.
4. Persist and report parent-level completed/failed/queued counts and individual run links. A partial failure must preserve all completed child review items without retrying uncertain work.
5. Independently validate the timed rollback for both queues, rollout expiry, Cloud Run service revisions, OIDC, cost ceilings, audit events and staging full-loop tests before any production activation.

Offline planner tests: `node --test tests/qs-async-bulk-plan.test.mjs`

No production infrastructure or student-facing behavior changes are part of this phase.
