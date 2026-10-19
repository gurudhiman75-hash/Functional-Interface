# Examtree QS — one-run production canary scope (source only)

This change adds a mandatory, **default-deny** scope to the production receiver. It does not deploy a Cloud Run revision, update service flags or secrets, create an outbox row, create a Cloud Task, force task execution or publish a question.

## Hard constraints

- Production receiver continues to require all of its existing explicit production approvals, private Cloud Run invoker identity, and a verified Google-signed OIDC task ID token.
- In addition, `EXAMTREE_QS_PRODUCTION_CANARY_ONLY=true` must be explicitly set, along with `EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID` (UUID) and `EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT` (UTC ISO8601 timestamp).
- The receiver **always rejects** any request with a different run ID or invalid/expired deadline. Deadline must be no farther than **15 minutes** in the future when the request arrives. There is intentionally **no non-canary fallback** even if someone switches all general approval flags to true.
- After verifying the signed ID token and canary scope, the transactional Neon run-row lock verifies the stored immutable task snapshot: `count=1`, `packageId=COM-001`, `engineId=knowledge-v1`, `language=en`, `selectedCpIds=[COM-001-CP-001]`, seeded, queue version 1. Invalid snapshots are rejected **before** lease or run-status writes.
- Existing synchronous question generation, staging Cloud Tasks and student-facing API routes are unaffected by this source change.

## Safer future delivery approach

Google Cloud Tasks `projects.locations.queues.tasks.run` [can force precisely one named task to dispatch even while the production queue remains PAUSED](https://docs.cloud.google.com/tasks/docs/reference/rest/v2/projects.locations.queues.tasks/run). This avoids resuming the queue and processing an unbounded backlog.

**No run is authorized yet.** A task forced to run could retry in a later queue resume if it fails, so its identity and state must be checked afterward and any failed/disposable task handled deliberately rather than purging the whole queue.

## Still required before a live production canary

1. Verify the exact currently deployed receiver/worker images, Neon main branch, package capabilities JSON and `COM-001` membership. The new source guard is not effective until a reviewed new production receiver image has actually been deployed.
2. Design and test a **single-use enqueue** which writes exactly one generation run, unique idempotency reservation, and outbox event. Do not expose the existing generic `recordQuestionStudioEnqueueIntent` via a public admin API just for this test.
3. Obtain an explicitly authorized disposable admin identity and pinned canary run UUID. Confirm zero unrelated queue tasks and no unfinished production async runs.
4. Establish a **disconnect-resistant cleanup** of production receiver AND worker approval flags, independent of a Cloud Shell terminal. The time gate limits receiver POSTs but does **not** automatically disable worker flags. Do not skip this.
5. Verify actual production monitoring delivery and the agreed monthly billing limits. Owner reported ₹300 Cloud Run enforced cap and ₹500 full-project budget alerts.
6. Only after independent approval, create one Cloud Task while queue PAUSED and manually force that one task with `tasks.run`. Confirm one signed POST, one worker request, one review item and one version, no duplicates and no student publication.
7. Restore both production approvals FALSE; retain queue PAUSED, dispatcher OFF, production scheduler OFF. Verify Neon rows and notifications, including failed tasks.

**The presence of these guards is not sufficient to declare the one-question canary safe to execute.** The separate release script must fail closed on each missing prerequisite.

## Local checks

`node --test tests/qs-prod-one-run-canary-guard.test.mjs`

Use existing receiver build pipeline only after the tests and review are complete; do not deploy changes automatically.
