# Universal Question Studio — durable generation queue design and status API

## Validated state (13 Oct 2026)

Seven *compute-only* generation tests passed on Cloud Run tagged `numfix` at 0% staging traffic, including a NUM-001 request without difficulty override flags. The other six cover TRG-002 1/3, OPS-001, ENG-001, COM-001 and NUM-001 3. This is NOT a live admin end-to-end test. Existing `POST /api/admin/question-studio/runs` still returns a completed run with status `review` and performs its own Neon transaction. The universal remote worker is opt-in; it has no Neon credentials.

Neon already contains `content.generation_runs` with `status`, `attempt_number`, `request_snapshot`, `started_at`, `completed_at`, `failure_reason` and unique `public_code`. `content.generation_run_items` has a unique `(generation_run_id,item_number)` index and `content.generation_item_versions` a unique `(generation_item_id,version_number)` index.

## Phase 1: polling surface in this PR (no queue activation)

`GET /api/admin/question-studio/runs/:runId/status` — authenticated `content.generation.read` admin only. Returns ID, publicCode, status, attemptNumber, requestedCount, generatedCount, run timestamps, sanitized failure indicator and retryAfterSeconds (3 while queued/running/validation). No snapshots, raw failure reasons, Firebase tokens or generated questions. No DB writes. Invalid UUID → 400, unknown → 404. Client helper `getQuestionStudioRunProgress(runId)` is ready for future admin UI integration.

**Existing POST response, review UI, production Cloudflare routes, Cashfree and Neon data remain unchanged.** No migration or new database tables required for Phase 1.

## Phase 2: actual durable asynchronous work (not yet implemented)

1. Add opt-in `EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED=true` to the *canonical admin API*, default false. Validate admin permissions/engine/package/CP/count/difficulty through the SAME path used by today's sync `POST /runs`, including specialized chapter routing exclusions. Never route a future queue handler ahead of governed legacy paths without verifying compatibility.
2. On `Generate`, transactionally create one `content.generation_runs` row in `queued` with normalized request snapshot, unique publicCode, creator, deadline, and an event in `platform.outbox_events` for task dispatch. Return HTTP 202 `{id,publicCode,status:"queued",retryAfterSeconds:3}`. Add a durable **idempotency key** per admin request scoped to the creator, not just an in-memory lock or timestamp.
3. Cloud Tasks dispatcher publishes authenticated tasks from committed outbox events; set explicit rate limits/max attempts/backoff and service-account OIDC authentication. Handle Cloud Tasks retries and at-least-once delivery; do not assume exactly-once. Reconcile outbox/task scheduling failures before enabling the UI.
4. Internal API task receiver authenticates the configured Cloud Tasks service account and checks a generation run's persisted status and claim/lease atomically. Transition `queued → running`. **Never place Firebase ID tokens or full question data in task payloads**; use run ID only. Remote universal worker still only computes question batches and cannot write Neon.
5. Persist all review items, item versions, audit event, outbox event and the `review` run-status transition in **one SQL transaction**. Idempotency must cover claimed tasks, review item numbers and failed retries. Duplicate delivery after commit returns success without additional items or publication.
6. On failure, record sanitized `failed` outcome and internal diagnostics; use bounded retries with dead-letter triage and explicit admin Retry action; no unbounded looping. Cancellation should be allowed for queued runs and best-effort running ones, with atomic state compare-and-set.
7. Admin UI should handle both 201 immediate completion (legacy) and 202 queued response. Poll status using server `retryAfterSeconds` while active, then refresh paged review on `review`; display queued/running/failed/retry/cancel states. Refresh/navigation cannot create a second generation run.

## Release gates

- No provider key needed for deterministic CPs; AI Notes Studio stays on Render.
- No direct promotion from staging-tag `numfix` to the production API or production worker. Use separate hardened production worker identity/secret; prefer IAM-private invocation rather than a publicly accessible secret-protected worker.
- Unit/integration tests: duplicate tasks, process crash after compute/before commit, retry after commit, unauthorized task invocation, invalid CP, mixed languages, NUM-001 source policy, batch limits, 1/3/20-question load, Neon atomic writes, RBAC student 403, status polling.
- **Do not flip the async feature flag or Cloudflare admin override** until complete end-to-end staging tests, budgets/alerts, and manual admin approval. Keep Render for finance, Cashfree, and unverified AI admin features.
