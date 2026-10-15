# Examtree Question Studio async operations — staging readiness

Updated: 2026-10-15. Scope: isolated Cloud Run staging admin API, one-shot Cloud Run dispatcher, Cloud Scheduler every 5 minutes, `examtree-qs-staging` Cloud Tasks, universal worker, **isolated** Neon branch `br-flat-credit-atqi4rqe`.

## Verified

- Browser-initiated automatic run `GEN-20261015-1C43FB2E` completed with 1/1 COM-001 review item on 2026-10-15 at 09:01:34 IST. Neon durable event published, OIDC Cloud Task worker lease completed and run status became `review`. No automatic student publishing.
- Staging request isolation and four-engine single/batch worker checks, idempotent tasks, authorization and one-shot dispatcher were previously verified.
- On 2026-10-15, isolated Neon returned **3 of 3 completed** for runs with `queueVersion=1` and a matching durable `question_studio.generation_run.queued.v1` outbox event; zero failed, queued, overdue or expired lease.
- At the same time, seven old synthetic validation runs remained beyond their deadlines, but **none had a matching queue outbox event**. Do not count these as real admin enqueue incidents or auto-retry them.

## New read-only control

`GET /api/admin/question-studio/operations/staging`

- Requires existing Firebase admin authentication (mounted inside authenticated bulk router) and `content.generation.read`.
- Available only when `EXAMTREE_API_RUNTIME=cloud-run`, `EXAMTREE_API_STAGING=true`, and `EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED=true`.
- Queries 30 days of outbox-backed canonical queued runs. Reports queued, running, complete/review, failed, overdue, awaiting dispatch, delayed dispatch, delayed tasks, expired leases, last enqueue/dispatch/completion, and at most ten sanitized incident codes. No SQL errors, prompts, generated questions, tokens or personal data returned.
- Frontend surfaces database metrics every 60 seconds only in the staging async build. **It cannot prove Cloud Scheduler is enabled or Cloud Tasks is unpaused**; check Google Cloud Monitoring separately.

## Alert and incident policy (initial)

| Signal | Investigate if | Where |
| --- | --- | --- |
| Scheduler not invoking | No new successful `examtree-qs-dispatch-staging` executions for >10 min while scheduler enabled | Cloud Scheduler execution logs and Cloud Run Job History |
| Outbox dispatch delayed | Event unpublished >10 min after creation | Question Studio staging operations panel + dispatcher logs |
| Task queue backlog | Outbox published but run still queued >10 min | Staging operations panel + Cloud Tasks queue and receiver logs |
| Run deadline exceeded | `due_at` in past and status queued/running | Operations panel and run status |
| Expired lease | Running with an expired uncompleted lease | Operations panel, Cloud Tasks attempt logs |
| Exhausted/failed | Any real outbox-backed run failed | Operations panel, review queue, GCP receiver logs |

**Never automatically replay expired runs solely because DB status is queued/running.** Cloud Tasks delivers at least once; safe failure recovery must coordinate live task inventory, existing idempotent event name, run deadline, and leases. Do not directly edit item/attempt/outbox records, republish student content, or clear the entire queue during investigation.

## Safe operational response

1. For a staging incident, inspect `GEN-...` public code in read-only API/Neon view, identify latest dispatcher run, Cloud Task name `qs-<outbox UUID without hyphens>`, OIDC receiver response and worker outcome. Keep credentials out of logs.
2. If widespread errors appear, **pause Scheduler first, then pause staging Cloud Tasks**. Retain outstanding work and existing run status. Avoid a purge unless all queued IDs are explicitly identified as disposable.
3. After fixing the root cause, restore one bounded task/one dispatcher job first. Validate the exact run reaches Review without duplicates; resume normal staging schedule after verification.
4. If a run has expired/no task/terminal retry budget, treat it as requiring an operator-owned recovery or cancellation path. A new request must not reuse an old idempotency key with different inputs; do not silently spawn duplicate runs.
5. Keep automated student publication and production commerce/attempt services outside this subsystem.

## Go/no-go: making async the default

**NO-GO today for broad production default.** The functional staging path is proven, but production readiness still requires:

- Automated Cloud Scheduler + Cloud Tasks failures alerts to the operator, not just a browser panel.
- Tested deliberate recovery for exhausted retries, deadlines and permanently stranded runs, with audit events.
- Bounded throughput/load soak for 1, 3, 10 and 50 questions across all four engines, and predictable cloud costs. **Dispatcher currently publishes at most one queued event per five-minute invocation** (12 runs/hour); improve safely with bounded batch dispatch or more frequent scheduling before large-scale usage.
- Review status paging/reconnect and interrupted-browser experience; no loss of a run when the admin closes the page.
- Production-separated Neon, Cloud Run services, OIDC identities, secret permissions, worker images and task queue; staging identities must not be promoted directly.
- Explicit user approval for default UI switch and production queue/database/traffic activation.

The existing synchronous Generate path remains the default; async remains **explicit staging opt-in**. No billing or student-facing change is authorized by this document.
