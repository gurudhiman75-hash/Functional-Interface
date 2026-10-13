# Question Studio — staging-only signed Cloud Tasks receiver (not deployed)

The universal Cloud Run generation worker passed 7/7 compute-only cases on tagged staging `numfix`. The async code foundation has separately merged status API, enqueue/idempotency schema proposal, Cloud Tasks dispatcher, Google OIDC identity validation, durable leases and atomic Neon review saving.

## End-to-end code path added here

A lazily loaded `POST /internal/question-studio/async-task` route is mounted **before** the public API's 25 MB JSON parser and independently restricts task requests to 2 KB. Only Cloud Run staging may activate it; Render and production Cloud Run return 503 even if someone reaches the direct service URL.

When all required flags are explicitly set later:
1. Verify a Google-signed RS256 OIDC token. Check issuer, signature, exact service-account email and exact Cloud Run audience. Do not authenticate through spoofable Cloud Tasks headers, Firebase browser tokens or cookies.
2. Parse only `{runId:UUID,queueVersion:1}`. Reject arbitrary HTTP input.
3. Refuse to claim the run if the universal worker URL or internal worker token is missing.
4. Claim the canonical queued Neon record using the token-fenced transactional 240-second lease (three attempts maximum).
5. For completed/cancelled/failed tasks, return 204 with no compute; for an active competing lease, return retryable 503.
6. Extract the canonical normalized request **from Neon**, not from the task HTTP body, and revalidate engine, package, CP, language and source difficulty policy.
7. Generate with the standalone universal worker and atomically commit review items/versions, audit/outbox and review status only with the current live lease token.
8. Return 204 only after persistence commits; failures return 503 for configured Cloud Tasks retries.

## Activation requires all flags, none enabled by this PR

```
EXAMTREE_API_RUNTIME=cloud-run
EXAMTREE_API_STAGING=true
EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED=true
EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED=true
EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED=true
EXAMTREE_QUESTION_STUDIO_TASK_CLAIM_ENABLED=true
EXAMTREE_QUESTION_STUDIO_TASK_REVIEW_COMMIT_ENABLED=true
EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_ROUTE_ENABLED=true
EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED=true
```

It also requires independently verified OIDC audience/service-account settings and a valid universal worker URL/token. Nothing is configured by merging this source.

## Blockers before we can run an actual task

- On a temporary Neon branch, migrate and validate `20261013_question_studio_async_enqueue_idempotency.sql` and `20261013_question_studio_task_leases.sql`. Obtain explicit approval before any production Neon schema writes.
- Run integration tests for same-key double click, duplicate task, retry-after-commit, task crash after compute, stale lease, cancellation, invalid NUM-001 difficulty, real multilingual generation, and rollback of item/version/audit/outbox writes.
- Deploy tagged staging admin API at **0% traffic**, first verify 503 with flags off, then signed/OIDC invalid and authenticated negative probes, and only then stage a disposable 1/3/20-question end-to-end test against isolated Neon.
- Create and configure actual Cloud Tasks queue and OIDC service account with dedicated least-privilege IAM; task dispatcher remains disabled and unattached until the receiver and schema tests pass.
- Production API is deliberately not eligible for activation in this PR. Current web Generate, Cloudflare, Render finance, Cashfree, student test attempts and production admin routing remain unchanged.

**No Google Cloud deployment, Cloud Tasks queue, Neon migration or live question persistence was performed in this PR.**
