# Examtree — independent production canary cleanup job

**Source-only preparation. NO production changes authorized by this file.**

Project: `sarbedutech`. Region: `asia-south1`.
Cleanup Cloud Run Job: `examtree-qs-prod-canary-cleanup`.
Cloud Scheduler: `examtree-qs-prod-canary-cleanup-trigger`.

## Required architecture before any 1-question canary

Build `Dockerfile.examtree-qs-prod-canary-cleanup` to a uniquely versioned Artifact Registry image, **pin its digest**, and review image provenance. Create **one** private Cloud Run Job running the pinned image, with exactly one task and a small retry budget. Use a dedicated cleanup service account with permissions scoped to the named receiver and worker services, prod dispatcher job, the prod Cloud Tasks queue, and the named cleanup Cloud Scheduler job. The cleanup identity must never receive DB read/write permission, Secret Manager access, or student/admin API credentials.

Pin these environment values on the cleanup Job:

- `GOOGLE_CLOUD_PROJECT=sarbedutech`
- `CLOUDSDK_CORE_PROJECT=sarbedutech`
- `EXAMTREE_QS_PRODUCTION_CANARY_ONLY=true`
- `EXAMTREE_QS_PRODUCTION_CANARY_CLEANUP_APPROVED=true`
- `EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT=<ISO UTC expiration no more than 15 minutes after initial activation>`

The Cloud Run runtime provides the `CLOUD_RUN_JOB`, `CLOUD_RUN_TASK_COUNT`, and `CLOUD_RUN_TASK_INDEX` variables. The job will refuse --apply unless the job name is exact, task count/index are one/zero, and the deadline has elapsed.

Use a **dedicated Scheduler invocation identity** with permission only to invoke this cleanup Job. A Google API Cloud Run Jobs `jobs.run` request requires **OAuth**, not an ordinary service URL ID token. Target the documented API endpoint:

`POST https://run.googleapis.com/v2/projects/sarbedutech/locations/asia-south1/jobs/examtree-qs-prod-canary-cleanup:run`

Create the Scheduler with a UTC minute cadence, initially **PAUSED**. Before enabling any receiver/worker approvals, verify Scheduler has correct service identity, OAuth configuration, URL and POST body, then **resume it**. The cleanup Job will reject premature invocations, but its succeeding post-deadline run will disable the receiver and worker approvals and self-pause the scheduler. Avoid relying on Cloud Shell `nohup` or shell traps for rollback.

## Cleanup operations (idempotent)

1. Check exact GCP project, named Cloud Run Job, expiry, service identities and existing approval flags.
2. Keep/put `examtree-qs-prod` Cloud Tasks queue **PAUSED**.
3. Update `examtree-universal-prod` to `EXAMTREE_QS_PRODUCTION_WORKER_APPROVED=false`.
4. Update `examtree-qs-receiver-prod` to `EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED=false`.
5. Disable `EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED` on `examtree-qs-dispatch-prod`.
6. Re-read private receiver/worker and queue, require both flags `false` and queue `PAUSED`.
7. Pause `examtree-qs-prod-canary-cleanup-trigger` **only after** verification passes.

If a step fails, the runner prints a sanitized failure. Keep the Scheduler enabled for later attempts; manually investigate IAM, revision startup, billing caps and Cloud Monitoring incident alerts. Do **not** auto-delete a Cloud Task or any generation record.

**Important:** The source-level receiver and worker TTL checks prevent accepting new question work after expiry even if cleanup IAM fails. The independent cleanup job, however, must be deployed and its Scheduler configured and verified before any production activation. This source file does NOT create those resources.

## Bounded production canary order — not authorization

- Do not expose an async enqueue route in the public admin API.
- Validate the disposable admin ID and immutable image digest; assert no old queued runs/tasks.
- Deploy the guarded production receiver and worker revisions only with a separate explicit change approval; verify the 15-minute TTL and pinned run ID match on both.
- Create + verify the rollback Job and Scheduler **before** activating the canary, then resume cleanup Scheduler.
- Authorize one Cloud Run enqueue Job call (task count 1, attempt 0). Expect exactly one Neon run, outbox event and unique idempotency row.
- Create precisely one deterministic Cloud Task for that outbox event **while the queue stays PAUSED**, force it through Google `tasks.run` once. Do not invoke the production dispatcher or resume normal scheduling.
- Check exactly one review item/version; no student publishing; inspect task and lease state. Never blind-retry a failed task.
- Wait for cleanup Scheduler to restore approvals FALSE or perform an independently authorized immediate rollback.
- Only after an operator has verified both flags OFF and queue PAUSED may the cleanup schedule be paused/decommissioned.

## Offline checks

`python3 scripts/test-examtree-qs-prod-canary-cleanup.py`

`python3 scripts/cleanup-examtree-qs-prod-canary.py`

Second command is read-only without `--apply`. Running `--apply` outside the named Cloud Run Job fails closed.

No changes to production services, IAM, Scheduler, Cloud Tasks, Neon, payments, attempts or student content are allowed by merging these files.
