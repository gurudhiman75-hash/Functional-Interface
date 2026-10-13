# Question Studio Cloud Tasks OIDC receiver authentication (not mounted)

The outbound Cloud Tasks dispatcher was merged in PR #3359 but is still disabled; no tasks, queue, Cloud Run job, frontend changes or Neon schema changes have been applied.

This PR adds a standalone verifier intended for a **future** internal task handler. It uses Google's public JWKS (`https://www.googleapis.com/oauth2/v3/certs`) to validate the RS256 signature, issuer (`accounts.google.com`), exact configured Cloud Run audience, exact service-account email, `email_verified`, numeric subject and bounded issuance/expiration. Signing keys are cached for five minutes with refresh on unknown key. A forged `X-CloudTasks-TaskName` header cannot authenticate a request.

The task body is intentionally limited to two fields: `{runId: UUID, queueVersion: 1}`. No browser cookies, Firebase tokens, prompt snapshots or generated questions are accepted.

## Deployment boundary

The verifier module is NOT mounted as `/internal/question-studio/async-task`. It cannot start a task, read Neon, generate questions, or authorize access merely by merging. This prevents publicly reachable incomplete receiver logic.

Before implementing that endpoint, finish durable database claim/lease, idempotent review saves, retry-after-commit tests, and cancellation checking. Only then introduce an internal route guarded by this Google OIDC validator, explicitly configured with `EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE` and `EXAMTREE_QUESTION_STUDIO_TASK_SERVICE_ACCOUNT`; deploy tagged staging with 0% traffic and verify negative token tests against real Cloud Run.

The request-identity service account must be granted only the necessary `roles/run.invoker` on the target Cloud Run service. A future Cloud Tasks queue must send a freshly minted OIDC token with the exact Cloud Run service origin as audience. Do not treat Cloud Tasks headers or Cloudflare cookies as an alternative to signature verification. All queue flags remain OFF.
