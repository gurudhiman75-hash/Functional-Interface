# Question Studio production async — gated dispatcher foundation (not activated)

Date: 2026-10-15. Branch: New-main. Project: sarbedutech; region: asia-south1.

## What this change does
- Adds a **separate production-only** one-shot Cloud Run Job executable and Dockerfile.
- Adds an independent **build-only** Cloud Build YAML. The build config publishes an image only; it cannot deploy a job, alter IAM, run migrations, create queues, or affect production traffic.
- Does **not** edit existing staging dispatcher/receiver, normal API/Generate endpoints, Cloudflare, student publishing, Neon, Cashfree, Scheduler or queue.
- Staging watchdog/recovery remains isolated and unchanged. No production watchdog or recovery is provided by this PR.

## Production dispatcher admission — all required
The job will reject configuration unless ALL hold:
1. EXAMTREE_API_RUNTIME=cloud-run and EXAMTREE_API_STAGING=false (set in the production-only container).
2. EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED=true.
3. EXAMTREE_QS_PRODUCTION_DATABASE_BINDING_VERIFIED=true, **only after independent secret-to-database verification**.
4. EXAMTREE_QS_PRODUCTION_RECEIVER_OIDC_VERIFIED=true, **only after live IAM/OIDC verification**.
5. EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED=true, EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED=true, EXAMTREE_QUESTION_STUDIO_TASK_DISPATCH_ENABLED=true, EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED=true.
6. EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED must NOT be true and EXAMTREE_QS_STAGING_EXPIRED_RECOVERY_ENABLED must NOT be true.
7. Queue exact examtree-qs-prod, region asia-south1, project sarbedutech.
8. Task OIDC service account exact examtree-qs-task-prod@sarbedutech.iam.gserviceaccount.com.
9. Receiver origin must be a separately deployed Cloud Run host beginning examtree-qs-receiver-prod- and ending .run.app; task path exactly /internal/question-studio/async-task; OIDC audience is exact origin.

These environment gates are **not** IAM or database verification; a human must verify secrets and cloud resources. Do not set the positive approval flags on any live job yet.

## Hard blockers before production activation
- Production-specific *signed OIDC* task receiver with production-only runtime authorization and private Cloud Run invoker IAM. The current standalone receiver rejects non-staging runtime. Do not just change staging flags or reuse staging receiver URL.
- Dedicated production Cloud Tasks queue, dispatcher runtime service account, task OIDC service account, private receiver and separate worker identity/secret. No staging service identities or staging Neon branch.
- Verified production Neon migration compatibility, run/outbox/leases/idempotency schema, back-up/restore and retention; record approved Secret Manager binding privately. Never expose DATABASE_URL in logs or PR.
- Production worker compute isolation, approved batches and realistic 1/3/10/50 load/soak checks; existing dispatcher handles only one event per execution. Capacity is inadequate for broad default at five-minute cadence.
- Production-specific Monitoring alerts for scheduler, dispatcher and receiver errors; silence/absence and retry exhaustion; paid usage limits. Staging email verification cannot substitute.
- Admin persistent queued/running/review resume flow, duplicate protection, cancel/retry semantics and cost budget.
- An explicit go-live decision before creating/resuming a production queue or scheduler, enabling flags, applying Neon migrations, or switching canonical Generate.

## Execution boundaries (future, separate approval)
1. Build the **production-only** image using cloudbuild.examtree-qs-prod-dispatcher.yaml with an explicitly configured _IMAGE in a production-only Artifact Registry repository and least-privilege dedicated build identity. Building does not mean deploying.
2. Separately validate and deploy a guarded production-only receiver, worker, IAM and DB schema at **zero active traffic**; never reuse the staging admin API as a receiver.
3. Provision a new **PAUSED** production queue and production-only job (tasks=1, parallelism=1, retries=0). Verify resource names, image SHA and Secret Manager binding without executing any enqueue.
4. After release approval only: run disposable canary, inspect one end-to-end run to Review without duplicates/publishing, prove monitoring, then stage progressive admin rollout. Existing synchronous Generate stays default until approved.

**Status:** code/build isolation prepared; NOT production-ready; no GCP changes performed.
