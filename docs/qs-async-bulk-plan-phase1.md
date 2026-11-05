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

## Phase 2: durable reservation groundwork (2026-11-05)

Added an **unapplied** schema in `20261105_question_studio_async_bulk_operations.sql` for a parent operation and its child reservation rows, with a unique actor/idempotency tuple and unique child generation-run links. The unmounted `async-bulk-reservations.ts` writes parent and child plan rows in one transaction, checks canonical request identity on retry, and fails closed if the persisted plan is incomplete. It does not create child generation runs or Cloud Tasks.

Added pure `async-bulk-progress.mjs` aggregation that retains completed child references, identifies partial failures and uncertain work, and never implies incomplete runs have succeeded. Tests: `node --test tests/qs-async-bulk-plan.test.mjs tests/qs-async-bulk-persistence-contract.test.mjs`.

### Still required (not implemented)

- Apply the migration in isolated staging **after reviewing schema compatibility** and validate transactional retry behavior against actual Neon; these source-level tests are not DB integration tests.
- Create a separately RBAC-gated, opt-in parent reservation endpoint. Independently check each proposed child against canonical package manifest and live release authorization.
- Implement durable child dispatch reservation/state transitions and reconciliation against the canonical single-run idempotency table. Dispatch only a separately approved child; do not blindly retry uncertain runs.
- Provide an authenticated, ownership-scoped progress endpoint joining generation-run progress to child rows, plus a cockpit progress UI and resume links.
- Validate independent timed rollback, paused queues, cost ceilings, signed task identity and full staging E2E before enabling any production async workflow.
