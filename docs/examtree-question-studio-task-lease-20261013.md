# Question Studio — durable task-claim lease (not active)

Cloud Tasks retries mean a task can arrive twice, concurrently, or after a process crash. The queue events are reserved for the dedicated Cloud Tasks dispatcher (PR #3359), and Google-signed sender identity has a standalone verifier (PR #3360). **Neither piece is live.**

This PR prepares one additional *unapplied* Neon migration, `content.generation_run_task_leases`, with a unique primary key per generation run, random lease token, attempt counter, claim time, and expiry. The claim helper serializes updates under `SELECT ... FOR UPDATE` against `content.generation_runs` and the lease row:

- Only `queueVersion:1` runs with `queued`/`running` status may claim.
- Active lease blocks a duplicate Cloud Tasks delivery.
- After expiry, a new claim rotates the token and increments attempt count. Old workers cannot safely commit once the future finalizer validates the new token.
- At most three claims and 240-second leases. Terminal runs cannot be claimed; cancelled, failed and already-reviewed runs return terminal/no-work.
- On expired run deadline or exhausted claims, the service can mark the run `failed` in the same transaction with a sanitized reason.
- No generation, database migration, task receipt, publication, or Cloud Run deployment takes place merely by compiling or merging the helper.

Activation is gated by **all three explicit flags**, none set or wired:

```
EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED=true
EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED=true
EXAMTREE_QUESTION_STUDIO_TASK_CLAIM_ENABLED=true
```

## Still required before safe execution

1. Implement atomic review-item/version persistence with a fencing-token check and a single audit/outbox commit. Duplicate task delivery after commit must return success without adding items.
2. Mount a receiver authenticated with Google-signed OIDC, validate only `{runId,queueVersion:1}`, check the canonical snapshot, and call the remote deterministic worker **only after a lease is claimed**.
3. Test race/cancellation, process crash, delayed retry, wrong token, bad CP, oversize output, and 20-question budgets against an isolated Neon branch with both pending migrations.
4. Apply schema migration only after reviewed Neon temporary-branch tests and explicit user approval. There is **no** migration deployment in this PR.
5. Provision Cloud Tasks, IAM and Cloud Run job via separate staging-first operational approval. Keep Cloudflare, finance/Cashfree, Render and student API unchanged.
