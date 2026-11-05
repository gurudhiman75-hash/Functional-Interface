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

## Phase 3: gated admin API and cockpit (2026-11-05)

Added `admin-question-studio-async-bulk.ts` under the already authenticated Question Studio router. It is separately gated by `EXAMTREE_QS_BULK_ASYNC_REVIEW_ENABLED=true` **in addition to** existing explicit, time-limited production chapter-review approvals, queue/outbox controls and dispatcher approvals. The frontend likewise requires both `VITE_QUESTION_STUDIO_ASYNC_PRODUCTION_CHAPTER=true` and `VITE_QUESTION_STUDIO_BULK_ASYNC_REVIEW=true`. None of these values are set or deployed by this PR.

- POST `/api/admin/question-studio/bulk-async`: owner-scoped idempotent parent reservation, validating each 1–20 child against immutable manifest, runtime package authority and current chapter-review scope. No enqueue here.
- GET `/api/admin/question-studio/bulk-async/:operationId`: owner-scoped read-only progress with current child run state and generated-item counts, never raw snapshot secrets.
- POST `/api/admin/question-studio/bulk-async/:operationId/children/:index/launch`: explicit admin action, transactional single-child claim, independent live release recheck, existing durable enqueue and exact-run dispatcher. A child with an uncertain result is never automatically retried; no other child can launch until previous runs reach review.
- POST `/api/admin/question-studio/bulk-async/:operationId/children/:index/reconcile`: checks the original enqueue idempotency row, canonical request SHA, authenticated owner, outbox event and existing generation run, then links it. **Never enqueues or dispatches.**
- Cockpit: opt-in mode, saved parent URL, live aggregate status, per-child review counts and explicit launch/reconciliation controls. Existing synchronous flow remains unchanged.

### Validation and deployment blockers

Pure planning smoke checks passed in a separate local Node harness. **The actual repository tests, admin TypeScript build, database migration and full staging E2E have not been executed in this session**; a smoke-harness result is not a repository CI pass.

Before merging or enabling:
1. Run `node --test tests/qs-async-bulk-plan.test.mjs tests/qs-async-bulk-persistence-contract.test.mjs tests/qs-prod-chapter-review-batches.test.mjs`, then both admin and API builds/typechecks.
2. Apply migration only to an isolated Neon staging branch. Verify transactional reservation under concurrent same-key requests, lost-response reconciliation, SQL constraints and partial failures.
3. Validate staging task claim/commit paths, admin RBAC, exact owner isolation and child series 1–20. Check that no question is published automatically.
4. Independently verify **both** queue pause/rollback controls, expiry, Cloud Run revisions and signed OIDC. Keep existing ordinary production queue paused.
5. Obtain explicit deployment approval and enable flags only after the above checks. Bulk release remains off otherwise.

The current UX intentionally requires **one explicit administrator launch per child run**; it is not an autonomous 250-question job scheduler. Adding fully automatic follow-on child dispatch would require its own bounded, durable orchestration and production authorization.
