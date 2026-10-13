# Question Studio — gated outbox-to-Cloud Tasks delivery foundation

## Why this change

The existing generic `outbox-publisher.ts` only logs events before marking them published. It would otherwise mark future `question_studio.generation_run.queued.v1` events as published **without creating tasks**. This change makes that failure impossible by excluding that single event type from the generic publisher's SQL claim.

This PR introduces a separate durable event publisher for **Cloud Tasks**, but nothing starts it and no queue or task receiver exists yet. Simply merging does not send Cloud Tasks, edit Neon, change the admin Generate button, or add Google Cloud costs.

## Transport

- Exact event allowlist: `question_studio.generation_run.queued.v1` for canonical `generation_run` aggregates. Locks one row `FOR UPDATE SKIP LOCKED`; only marks published **after** successful Cloud Tasks acceptance or an idempotent HTTP 409.
- Cloud Task deterministic name: `qs-<outbox_event_uuid_without_dashes>`. If a process crashes between remote task acceptance and Neon acknowledgement, retrying uses the same name. Duplicate Cloud Tasks task invocations still require a task receiver with database-level idempotency.
- Cloud Task body: `{runId,queueVersion:1}`, base64-encoded. No question content, user credentials, Firebase ID token, database URL or provider secrets.
- Task endpoint: strictly HTTPS Cloud Run `/internal/question-studio/async-task` path. Google Cloud Tasks injects a Google-signed OIDC token for a configured service account, audience equals the Cloud Run origin. The future task receiver MUST verify the actual signed token, issuer, audience and service account identity. Do **not** rely only on spoofable Cloud Tasks headers.
- The dispatcher uses Google Cloud runtime metadata credentials for the Cloud Tasks REST create-task API; no static key files or additional SDK credentials. 12-second request timeout and bounded error logging.
- Backoff 1 minute, max eight create attempts before six-hour investigation hold. Terminal or cancelled runs never generate new tasks.

## Fail-closed switches

None are enabled by default, and the dispatcher function is not mounted or called from `app.ts`, old outbox publisher, any Cloud Run Job, or a cron.

```
EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED=true
EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED=true
EXAMTREE_QUESTION_STUDIO_TASK_DISPATCH_ENABLED=true
EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED=true
```

All four are required before any dispatcher call even attempts a database claim. The runtime config additionally requires an approved same-origin Cloud Run handler URL, task audience, Cloud Tasks queue/project/location, and OIDC service account.

## Next required stages (not in this PR)

1. Implement and test the `/internal/question-studio/async-task` receiver, rejecting unsigned/wrong-audience/wrong-email requests and using database claim/lease; keep unmounted until staging proofs.
2. Add atomic *review* persistence using existing `generation_runs`, `generation_run_items`, `generation_item_versions`, audit and outbox tables; abort/rollback on any content or validation error. Test task-replay after DB commit, races, and crash-after-compute-before-commit.
3. Prepare and approve the unapplied enqueue-idempotency migration on a Neon temporary branch. Check migrations and claims before production DB changes.
4. Provision Cloud Tasks in `sarbedutech` region `asia-south1` with sensible rate limits and capped attempts. Grant a dedicated Cloud Run runtime identity only `roles/cloudtasks.enqueuer`, and Cloud Tasks OIDC service account only the correct target `roles/run.invoker`. Review service-account-user permissions for dispatch. Do not set anonymous access on a task-only service.
5. Create a gated Cloud Run Job for dispatcher execution; staging-only with dry-run event evidence, IAM and budgets, then a separate explicit production approval.
6. Wire the canonical admin POST Generate to the enqueue transaction behind a new verified flag, return 202; add progress polling/retry/cancel UI while preserving all legacy 201 responses.

**Do not turn on either enqueue or dispatch flags until the receiver, DB transaction guarantees and staging end-to-end checks pass.** Existing universal worker `numfix` staging acceptance (7/7) does not prove task delivery or Neon review persistence.
