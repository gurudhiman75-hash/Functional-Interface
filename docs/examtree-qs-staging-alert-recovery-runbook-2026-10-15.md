# Question Studio staging — automatic incident alerts and fail-closed recovery

Date: 2026-10-15. Project: `sarbedutech`; region: `asia-south1`; Cloud Run **Job**: `examtree-qs-dispatch-staging`; Cloud Scheduler: `examtree-qs-dispatch-staging-scheduler-trigger`; Cloud Tasks: `examtree-qs-staging`. Source branch: `New-main`.

## Activation and safety

**This PR does not change Google Cloud resources or the deployed job image.** The job runs its existing immutable container until an operator builds `cloudbuild.examtree-qs-staging-dispatcher.yaml` and deploys that image to the *same isolated staging job*. Never deploy to production API or student/commerce services. First test on the isolated Neon branch, with max job tasks=1, parallelism=1 and the Cloud Tasks concurrency=1 / 1 task per second / max attempts=3 safeguards unchanged.

The watchdog is active only inside the **existing scheduled staging dispatcher** once the updated job image is deployed. It requires staging runtime, explicit queue/outbox/dispatch feature flags, and the exact staging project/region/queue. It runs **after** the normal one-event dispatcher and logs:
- `EXAMTREE_QS_STAGING_WATCHDOG_OK` when real outbox-backed generation runs are healthy;
- `EXAMTREE_QS_STAGING_INCIDENT` (stderr, ERROR severity) for delayed enqueue-to-dispatch >10min, task queue-to-claim >10min, overdue request, expired lease or a recently failed request;
- `EXAMTREE_QS_STAGING_HEALTH_CHECK_FAILED` if its read-only DB checks fail, with a nonzero Cloud Run Job exit;
- `STAGING_DISPATCH_FAILED` if the dispatcher itself fails, with a nonzero exit.

Only runs with an actual `question_studio.generation_run.queued.v1` outbox event and `queueVersion=1` are checked. Synthetic old validation rows must not trigger an incident. Counts and at most five public `GEN-...` identifiers are logged, never questions, bearer tokens, DB secrets or prompt contents.

## Optional fail-closed recovery — OFF by default

`EXAMTREE_QS_STAGING_EXPIRED_RECOVERY_ENABLED=true` on **the staging Cloud Run dispatcher job only** enables recovery once the updated image and log-alert policies have been verified. Do not set the flag on the production API or any worker.

Each scheduled invocation can mark at most **one** genuinely outbox-backed `queued`/`running` run as `failed` if its own `due_at` passed **more than 10 minutes ago** and there is **no active task lease**. A `FOR UPDATE OF r SKIP LOCKED` lock shares the lock order used by task claiming and final review commits, so a concurrently completed run cannot be overwritten. Recovery writes one system audit event `question_studio.generation_run.deadline_expired` and one `EXAMTREE_QS_STAGING_RUN_QUARANTINED` log. No new Cloud Task is created, no job is re-enqueued, and nothing is automatically approved/published. If the already-queued Cloud Task arrives later, the receiver sees a terminal run and acknowledges it as a no-op. **Never enable auto-replay of expired or exhausted runs.**

To disable recovery immediately, remove/set the flag false, deploying a job revision if required. Existing successful review items are not touched.

## Configure two Google Cloud **log-based alerts** (operator action)

Cloud Shell is not required. Open [Logs Explorer](https://console.cloud.google.com/logs/query?project=sarbedutech), select the project's correct region/log scope, paste one filter, click **Run query** and then **Actions → Create log alert** (or equivalent). Choose a verified email notification channel and minimum **5–15 minutes** between notifications. The filters match errors after the updated job is deployed; they won't match before first event.

**Policy A: Examtree QS staging worker/dispatcher failures**
```text
resource.type="cloud_run_job"
resource.labels.job_name="examtree-qs-dispatch-staging"
severity>=ERROR
(
  SEARCH("EXAMTREE_QS_STAGING_INCIDENT")
  OR SEARCH("EXAMTREE_QS_STAGING_HEALTH_CHECK_FAILED")
  OR SEARCH("EXAMTREE_QS_STAGING_RUN_QUARANTINED")
  OR SEARCH("STAGING_DISPATCH_FAILED")
)
```

**Policy B: Examtree QS Scheduler invocation failure**
```text
resource.type="cloud_scheduler_job"
resource.labels.job_id="examtree-qs-dispatch-staging-scheduler-trigger"
resource.labels.location="asia-south1"
severity>=ERROR
```

These are separate alerts because a Scheduler authentication/permission failure means the Cloud Run dispatcher never starts and cannot emit its own warning. Also check Cloud Run Job execution failure metrics and Scheduler run-history independently: **the absence of new logs is not caught by a log-match alert**. For detecting scheduler silence, configure a metric-based absence alert on successful dispatcher executions over >10–15min (requires appropriate Monitoring metric series; validate against actual metrics rather than inventing metric names).

Google Cloud's documented flow for log-based alerts: https://docs.cloud.google.com/logging/docs/alerting/log-based-alerts

## Deployment verification and go/no-go

1. Record the current Cloud Run Job image digest. Build `Dockerfile.examtree-qs-staging-dispatcher`, and update **only** `examtree-qs-dispatch-staging`. Preserve runtime service account, isolated `DATABASE_URL` secret, environment variables, task=1, parallelism=1, max retries=0, and five-minute Scheduler trigger.
2. Without enabling recovery flag, **execute job once** on empty outbox. Confirm job succeeds and logs `STAGING_OUTBOX_EMPTY` and `EXAMTREE_QS_STAGING_WATCHDOG_OK`; neither event should trigger the error policy.
3. Create one disposable **staging** generation through the UI (do not run tasks manually), wait until Review and verify one version and one audit trail in isolated Neon. If the job's watchdog sees a failure, investigate before further activation.
4. In Cloud Logging, verify Policy A can match emitted error logs (through a controlled isolated test), and Policy B can match a historical Scheduler `PERMISSION_DENIED` event or another safe test without breaking live routing. Verify operator receives a test notification.
5. Only after both alert policies work, consider enabling the optional recovery flag for real terminal abandonment; monitor audits, no duplicate review items, and 1-per-job recovery bound.
6. Do **not** enable async as the production default yet: production-separated Neon/Cloud Run/IAM queue, bounded batch throughput, alerts+recoveries, mobile reconnection history, and explicit release approval are still required.

Operator emergency stop: pause **Scheduler** first, then pause **Cloud Tasks staging queue**; inspect exact run IDs and job logs. Avoid `Purge queue`, manual SQL status edits, reusing idempotency keys for different requests, or accidentally routing production billing/student traffic to staging.
