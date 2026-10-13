# Question Studio — token-fenced atomic Neon review commit (NOT activated)

Following the validated universal Cloud Run staging worker (seven compute-only cases), the read-only progress API (#3356), gated enqueue/idempotency (#3358), safe Cloud Tasks dispatcher (#3359), Google-signed task identity (#3360), and durable lease claim foundation (#3361), the queue still needs exactly-once *effects* on Neon. Cloud Tasks itself only promises at-least-once delivery.

## What this PR prepares

- A pure validator compares the persisted `queueVersion:1` snapshot to the remote worker result. It rejects mismatched package, engine, CP/count, missing question stem/options/answer/explanation, or empty generation provenance.
- An unmounted commit helper runs under a single Neon transaction. It locks the canonical generation run and its task lease row in the same order as the claim helper.
- Only `running` tasks with the matching, unexpired `lease_token` may write. A stale worker is rejected, even after another worker reclaimed an expired lease. A cancelled/failed run cannot commit.
- Inserts one `generation_run_items` row and one initial `generation_item_versions` record per candidate, plus an audit event, a review-created outbox event, and the `review` status/lease completion. All statements commit together or all roll back.
- If a task arrives after the batch is already in `review`, `partially_approved`, or `approved`, it returns `already_committed` only after verifying that all expected initial review items and version 1 records exist. It does not duplicate records.
- Review-item lifecycle properties are derived from the current authorized Question Studio package registry, overriding any lifecycle flags embedded in worker output. Candidates are always saved with `validationResult:"pending"`. No `content.questions` or student/test publication write occurs in the helper.

## Disabled-by-default gates

The helper is not imported by the API, not connected to Cloud Tasks, and cannot run unless all three are explicitly enabled:

```
EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED=true
EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED=true
EXAMTREE_QUESTION_STUDIO_TASK_REVIEW_COMMIT_ENABLED=true
```

## Required next validation

1. Implement one signed-OIDC receiver that parses only `{runId,queueVersion:1}`, claims the run through the durable lease service, invokes `runUniversalStudioRemote` for the persisted normalized input, and calls the fenced review helper. Require an appropriate retryable response for busy leases, while completed runs are safe no-op responses.
2. Reconcile the canonical run payload and original sync Request Snapshot, including optional exam profile and package runtime mode, across representative real packages/languages.
3. On a **Neon temporary branch only**, apply both *unapplied* migrations (enqueue-idempotency and leases) with explicit user approval, run concurrent duplicate-delivery and simulated-crash scenarios, compare initial version counts, and inspect rollback.
4. Deploy a zero-traffic tagged Cloud Run admin candidate with the receiver, check wrong service account/issuer/audience rejection, worker compute parity, 1/3/20 questions and exact-once Neon writes. Do not enable Cloud Tasks or live routing until these gates pass.

No DB migration, Cloud Tasks service, Google Cloud key, Cloudflare setting, production worker deployment, finance/Cashfree or student route changes occur by merging this code.
