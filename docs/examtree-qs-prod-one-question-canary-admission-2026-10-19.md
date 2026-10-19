# Examtree Question Studio — first production canary admission

**Status:** preparation / read-only. This file does not authorize production generation.

Project `sarbedutech`; region `asia-south1`; production queue `examtree-qs-prod`.

## Verified as of 2026-10-19

- The two private service-native signed **GET /health** requests returned `ready:false`, for the dedicated task identity → receiver and receiver identity → worker. These were **health-only** verifications, not actual task delivery.
- Monitoring has three enabled production alert policies with existing notification channel metadata. Live email delivery of **these particular new alerts** has **not** been proven.
- Owner confirmed Cloud Run monthly spend cap updated to ₹300 and a new project-wide ₹500 alerts-only budget. Billing metadata still requires independent verification if the operator's IAM account cannot list budgets.
- Read-only Neon inspection of production `main` showed `content.generation_enqueue_idempotency`, `content.generation_run_task_leases`, `content.generation_runs`, `platform.outbox_events`, status enum `queued/running/review`, and **zero** active leases, outstanding async runs or unpublished Question Studio async outbox events at the time of inspection.
- The production queue remains **PAUSED** and all production generation approvals remain **OFF** in the latest completed safety preflight.

## Narrow test contract (not a broad rollout)

One authorized disposable admin-only generation request, `count=1`, seeded and pinned to one supported engine/package/CP such as `COM-001` **only after verifying current package manifest compatibility**. A unique idempotency key must identify exactly one canonical run. Save to admin `review` only — never content bank, paid tests, student pages or automatic approval. Limit to **one** task dispatch and **one** private receiver request. Run no scheduler or background incident recovery. Leave existing normal student API and public frontend routes unchanged.

### Gate before enabling anything

1. Run `python3 scripts/verify-examtree-qs-prod-one-question-canary-admission.py`. **No BLOCK** and independently resolve each REVIEW item; the script never grants activation.
2. Confirm the **exact** disposable admin identity and approved package manifest. Production `recordQuestionStudioEnqueueIntent` is currently not mounted as the normal production admin API route, so an authenticated **single-run** enqueue mechanism must be built and independently tested rather than opening a general-purpose `Generate` endpoint.
3. Review a single-use production canary execution plan with a positive allowlist for **one run ID**, **one task**, **one package**, **count=1**, **review-only**, **no retries or bulk publish**. Capture source revision digests, production env variables and Secret Manager references before changes. No raw secrets in logs.
4. Prove a **disconnect-resistant rollback** that can always PAUSE the queue and return receiver/worker/dispatcher gates to FALSE even if Cloud Shell disappears mid-test. Never assume a shell `trap` alone protects against a disconnected session. No automatic rollback mechanism is implemented by this PR.
5. Require independent authorization **after** safety controls and rollback are reviewed. Do not use the existing V1 Cloud Run job replace command; the earlier OIDC health jobs required separately validated V2 API calls.

### Required observations for acceptance

- Exactly one `content.generation_runs` row with a uniquely reserved idempotency key and exactly one matching `question_studio.generation_run.queued.v1` outbox row.
- Exactly one Cloud Tasks task name tied deterministically to the outbox event; authenticated POST to the private production receiver is verified (the two GET /health checks do **not** prove POST behavior).
- Exactly one worker call with generated question, four plausible options, correct answer and clear explanation.
- Exactly one `content.generation_run_items` row and one version-1 `content.generation_item_versions` row. Canonical status reaches `review`, with completed lease; repeated delivery never inserts a duplicate.
- No row inserted or updated in `content.questions`, student tests or other publication/commerce surfaces.
- Queue PAUSED; dispatcher, worker and receiver approval flags FALSE; no newly enabled production scheduler or automatic retries; alert and budget surfaces reviewed.

**STOP immediately** if an unknown task/run appears, service identity or image differs, DB lease/commit fails, unexpected student publication occurs, monitoring is blind, or a rollback cannot be guaranteed. Preserve failed task/run IDs for investigation; do not purge or replay unknown production work.

## Current decision

**NO-GO for live production writes yet.** The core database schema and private service identity gates passed, but a **bounded single-run enqueue mechanism and disconnect-resistant rollback** are not yet implemented, and email delivery of the new production-specific alerts remains unverified. The read-only checker only verifies that baseline safety persists.
