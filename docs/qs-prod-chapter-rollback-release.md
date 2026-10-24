# Examtree QS — independent full-chapter rollback (source-only)

**NOT deployed or authorized for production.** This is separate from the historical COM-001 cleanup and its expired IAM conditions.

## Release pinned in reviewed source

- GCP project `sarbedutech`; region `asia-south1`.
- Dedicated Cloud Run Job: `examtree-qs-prod-chapter-rollback`.
- Dedicated Cloud Scheduler: `examtree-qs-prod-chapter-rollback-trigger` (must be created PAUSED).
- Scheduler service identity: `examtree-qs-chapter-rollback-scheduler@sarbedutech.iam.gserviceaccount.com`.
- New rollback runtime identity (to create separately): `examtree-qs-chapter-rollback@sarbedutech.iam.gserviceaccount.com`.
- Known-good fallback revisions: API `examtree-api-00002-mch`, receiver `examtree-qs-receiver-prod-00025-27d`, worker `examtree-universal-prod-00021-5q7`.
- Candidate image digests are pinned in `scripts/rollback-examtree-qs-prod-chapter.py`. Changing a fallback revision or image requires a new reviewed commit.

## What the rollback controller enforces

The immutable image defaults to **read-only metadata verification**. It only accepts `--apply` within the exact named singleton Cloud Run Job, after being independently armed with all these environment variables:

- `EXAMTREE_QS_CHAPTER_ROLLBACK_ARMED=true`
- `EXAMTREE_QS_CHAPTER_ROLLBACK_APPLY_APPROVED=true`
- `EXAMTREE_QS_CHAPTER_ROLLBACK_RELEASE_ID` = new UUIDv4 for this release
- `EXAMTREE_QS_CHAPTER_ROLLBACK_STARTED_AT` = UTC Z timestamp
- `EXAMTREE_QS_CHAPTER_ROLLBACK_EXPIRES_AT` = UTC Z timestamp no more than 24 hours after start

Before expiry, scheduled runs make no changes. After expiry, it:

1. Pauses and verifies the production `examtree-qs-prod` Cloud Tasks queue.
2. Disables the production dispatch Job's approval.
3. Checks exact service runtime accounts, immutable release image digests, permitted approvals and Ready, disabled fallback revisions.
4. For API, Receiver, Worker, turns off chapter-approval flags in the *template* using a new zero-traffic revision, and pins 100% ordinary traffic to the exact known-good fallback revision (never LATEST).
5. Independently verifies live traffic, template approvals, dispatcher, queue and cleanup Scheduler. Only after complete recovery does it pause **its own** Scheduler.

Any failure produces a sanitized STOP; the independent Scheduler stays active for incident investigation. The controller does not access Neon, read secrets, publish questions, or modify IAM. Pausing queue does not terminate requests already in flight.

## Separate mandatory production-change approval

This pull request is **only a GitHub implementation**. Do not enable generation because the code exists. After source review and CI:

1. Build one separate rollback image with `cloudbuild.examtree-qs-prod-chapter-rollback-build-only.yaml`, pin its resulting **SHA256** digest.
2. Verify the pinned fallback revisions still serve production and that their approval flags are disabled. Confirm immutable image digests, actual chapter manifest and canonical CP eligibility. Stop for drift.
3. Create **dedicated** runtime and scheduler service identities. Assign rollback runtime only least-privilege get/update for exactly the three Cloud Run services and the dispatcher Job, get/pause on the single queue, get/pause Scheduler, revision get, and actAs scoped to the named runtime service identities. No database access, Secret Manager access, project Editor/Owner, or broad service invocation. Use a fresh IAM condition lasting beyond the planned rollback deadline.
4. Create a **new Cloud Run Job** from the immutable rollback image, one task, parallelism one, job retries zero. Initially use read-only default arguments. Create a separate Scheduler, initially PAUSED, with a one-minute cadence and OAuth-authenticated POST to `https://run.googleapis.com/v2/projects/sarbedutech/locations/asia-south1/jobs/examtree-qs-prod-chapter-rollback:run`.
5. Independently test and **prove** that the Scheduler runs the job with the intended identity, that expiry disables generation and restores all three baseline revisions, and that a simulated failure keeps the queue paused and Scheduler active. Safely isolate the test; do not run the live rollback as a simulation.
6. Only with fresh production approval arm exact UUID/expiry and `--apply` on the dedicated Job, enable and verify its Scheduler, then separately authorize the scoped API/Receiver/Worker release. Job expiry must match the chapter-review expiry on the three services.
7. Confirm Cloud Tasks idempotency for maxAttempts=3; verify worker OIDC, Neon run/outbox atomicity, cost ceiling, monitoring, admin RBAC, front-end routing and review-only persistence. Only then permit bounded chapter batches (1–20 questions).

**Never resume the queue, change existing production traffic, set any approval to true or publish questions as a consequence of this PR.** The old canary cleanup must stay distinct and paused.

## Local/offline verification

`python3 tests/test-qs-prod-chapter-rollback.py -v`

CI workflow: `.github/workflows/qs-prod-chapter-rollback.yml`. No Google credentials needed.

## Remaining proof before generation

Offline source tests do **not** prove the live Cloud Run rollback. The following remain release blockers: verified independent job invocation, safe end-to-end expiry rollback, fresh IAM, matching chapter scope/expiry, transactional duplicate task safety, alerting/cost limits and frontend enablement.
