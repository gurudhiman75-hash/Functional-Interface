# Question Studio isolated staging dispatcher — deployment boundary

The image built by `cloudbuild.examtree-qs-staging-dispatcher.yaml` runs
`artifacts/api-server/dist/qs-staging-dispatch-once.mjs` ONCE, then exits.
It does not start an HTTP server, schedule itself, create migrations, or
enable the existing admin Generate API. It MUST NOT replace the main API or
either existing `examtree-api-background*` Cloud Run job.

## Required safeguards before any deployment

1. Deployment target is a new Cloud Run Job named
   `examtree-qs-dispatch-staging`, project `sarbedutech`,
   region `asia-south1`. No Cloud Scheduler trigger.
2. Queue `examtree-qs-staging` must remain PAUSED. Execute the job manually
   for each one-shot validation. Do not resume it automatically.
3. Use a dedicated staging dispatch service account with only
   `roles/cloudtasks.enqueuer` scoped to that queue, and access to ONLY the
   isolated staging validation database URL secret. Do not reuse production
   DB credentials or broad API service accounts.
4. Job config MUST include the following guarded values:
   `EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED=true`,
   `EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED=true`,
   `EXAMTREE_QUESTION_STUDIO_TASK_DISPATCH_ENABLED=true`,
   `EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED=true`,
   `EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED=true`,
   `EXAMTREE_QUESTION_STUDIO_TASK_PROJECT=sarbedutech`,
   `EXAMTREE_QUESTION_STUDIO_TASK_REGION=asia-south1`,
   `EXAMTREE_QUESTION_STUDIO_TASK_QUEUE=examtree-qs-staging`.
   `EXAMTREE_API_STAGING=true`, `EXAMTREE_API_RUNTIME=cloud-run` are
   set in the image.
5. Set `EXAMTREE_QUESTION_STUDIO_TASK_HANDLER_URL` to the exact isolated
   QS receiver canonical service URL plus
   `/internal/question-studio/async-task`, and
   `EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE` to its exact origin without a
   path. `EXAMTREE_QUESTION_STUDIO_TASK_SERVICE_ACCOUNT` must be
   `examtree-qs-task-staging@sarbedutech.iam.gserviceaccount.com`.
6. Inject `DATABASE_URL` from the existing *isolated validation branch*
   Secret Manager secret, never plaintext and never the main API database.
   Validate the effective secret version and branch binding before running.
7. Limit retries at the **job execution** layer to 0 (the dispatcher has
   its own durable outbox retry budget); restrict job tasks to 1, parallelism
   to 1, and avoid scheduling/automatic executions.
8. First test with no eligible `question_studio.generation_run.queued.v1`
   outbox events and expect `STAGING_OUTBOX_EMPTY`. Then create exactly one
   approved disposable outbox event on the isolated validation branch and
   invoke the job once. Verify deterministic Cloud Task name, published_at
   after successful enqueue, and still-PAUSED queue.
9. Verify missing/wrong service account, invalid queue, cancelled/terminal
   run, duplicate event and transport failure cases without enabling
   production or normal worker routing.

A successful job image build is NOT approval to create/execute a job or
turn on automatic admin-side generation.
