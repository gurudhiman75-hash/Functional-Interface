# Examtree QS — independent full-chapter rollback (source-only)

**Live release status (2026-10-26):** The pinned `ef518db500293ccefde2465be14284c585081204` API, receiver and worker images are deployed as the `qs-chapter-ef518db5` tagged candidates at 0% ordinary traffic. Their `/health` checks returned HTTP 200; private receiver/worker checks used the intended task-to-receiver and receiver-to-worker OIDC identities. The chapter dispatcher and refreshed rollback images below are installed in their dedicated Jobs. Generation approvals remain false and both queues remain paused.

The independent one-minute Scheduler successfully invoked rollback execution `examtree-qs-prod-chapter-rollback-px848` with an expired UTC test window. The execution succeeded, reasserted the pinned baselines and disabled state, and paused its Scheduler. The operator then disarmed both rollback flags and reran the read-only rollback preflight successfully. **This proof began with disabled approvals, paused queues and baseline traffic; it does not prove rollback from an active chapter release or a live permission-failure scenario.** The historical COM-001 cleanup remains separate.

## Release pinned in reviewed source

- GCP project `sarbedutech`; region `asia-south1`.
- Dedicated Cloud Run Job: `examtree-qs-prod-chapter-rollback`.
- Separate chapter dispatcher Job: `examtree-qs-chapter-dispatch-prod`, which must be independently disabled during rollback.
- Two queues: existing `examtree-qs-prod` and dedicated `examtree-qs-chapter-prod` (both must be PAUSED until approval).
- Dedicated Cloud Scheduler: `examtree-qs-prod-chapter-rollback-trigger` (must be created PAUSED).
- Scheduler service identity: `examtree-qs-chapter-sched@sarbedutech.iam.gserviceaccount.com`.
- New rollback runtime identity (to create separately): `examtree-qs-chapter-rollback@sarbedutech.iam.gserviceaccount.com`.
- Known-good fallback revisions: API `examtree-api-00002-mch`, receiver `examtree-qs-receiver-prod-00025-27d`, worker `examtree-universal-prod-00021-5q7`.
- Candidate image digests are pinned in `scripts/rollback-examtree-qs-prod-chapter.py`. Changing a fallback revision or image requires a new reviewed commit.

## Verified 2026-10-26 candidate images

The operator confirmed these immutable Artifact Registry digests from the build-only release, source SHA `ef518db500293ccefde2465be14284c585081204`:

| Cloud Run service | Verified release digest |
|---|---|
| `examtree-api` | `sha256:fe5b42ff05a0a787b1a0f20d216fafe630327bc3efb141df8d05c03bfc89aefd` |
| `examtree-qs-receiver-prod` | `sha256:bc52c906d25b8c742988c726ad2c549cf9c6f62688c4243bf8da6ec50607b919` |
| `examtree-universal-prod` | `sha256:37ad6061dc661dc59e07f38bc55ec654c383cb2f005553cec785b1b23b7336e3` |

### Additional build-only artifacts

The chapter dispatcher and refreshed rollback controller were built from release-pin branch commit `1866ef38fbf2b19f7bd2abea4bdb11c59a729f76`. Both builds passed their configured checks and are deployed to their dedicated Jobs with generation disabled:

| Artifact | Build ID | Immutable image digest |
|---|---|---|
| `examtree-qs-chapter-dispatch-prod` | `fb22146c-907e-4aee-8770-cc6b12dedee2` | `sha256:7ea0f08ac9a4eb957f619255aaa3ce2eb4fc156e179e034f1c42a7c723de68c6` |
| `examtree-qs-prod-chapter-rollback` | `69e1a41c-2477-4a45-823b-e63a65fecc0b` | `sha256:08dfd48709fb0f979c97ad6d8ba748eff4d6bcffde390d5e683f28ca098b87b1` |

The current service candidates are API `examtree-api-00023-goz`, receiver `examtree-qs-receiver-prod-00054-qac`, and worker `examtree-universal-prod-00054-cid`. Ordinary traffic remains 100% on the three pinned baselines. The independent chapter dispatcher is disabled. Deployment does not authorize generation: baked manifest agreement, the authenticated admin workflow, bounded review persistence, matching scope/expiry and active-release recovery remain release gates.

### Disabled baseline preflight with staged candidates

The disabled-only operator preflight validates both desired and observed traffic against the exact pinned receiver/worker baseline revision names. It independently verifies Ready state, immutable image digest, expected runtime identity, matching secret references and disabled approval values on the serving baseline and latest candidate template. A different candidate image does not imply serving-image drift when traffic is explicitly pinned to the reviewed baseline. The strict template-equality validator remains available for workflows that require identical serving/template configuration. Both Google-reported short service origins and the verified deterministic regional origins are accepted for receiver and worker URL bindings.


## What the rollback controller enforces

The immutable image defaults to **read-only metadata verification**. It only accepts `--apply` within the exact named singleton Cloud Run Job, after being independently armed with all these environment variables:

- `EXAMTREE_QS_CHAPTER_ROLLBACK_ARMED=true`
- `EXAMTREE_QS_CHAPTER_ROLLBACK_APPLY_APPROVED=true`
- `EXAMTREE_QS_CHAPTER_ROLLBACK_RELEASE_ID` = new UUIDv4 for this release
- `EXAMTREE_QS_CHAPTER_ROLLBACK_STARTED_AT` = UTC Z timestamp
- `EXAMTREE_QS_CHAPTER_ROLLBACK_EXPIRES_AT` = UTC Z timestamp no more than 24 hours after start

Before expiry, scheduled runs make no changes. After expiry, it:

1. Pauses and verifies BOTH the existing `examtree-qs-prod` and the dedicated `examtree-qs-chapter-prod` Cloud Tasks queues. If either queue is missing or cannot be paused, rollback fails closed and leaves its Scheduler enabled.
2. Disables BOTH the normal `examtree-qs-dispatch-prod` and dedicated `examtree-qs-chapter-dispatch-prod` Job approval flags, verifying both are `false`.
3. Checks exact service runtime accounts, immutable release image digests, permitted approvals and Ready, disabled fallback revisions.
4. For API, Receiver, Worker, turns off chapter-approval flags in the *template* using a new zero-traffic revision, and pins 100% ordinary traffic to the exact known-good fallback revision (never LATEST).
5. Independently verifies live traffic, template approvals, both dispatcher Jobs, both queues and cleanup Scheduler. Only after complete recovery does it pause **its own** Scheduler.

Any failure produces a sanitized STOP; the independent Scheduler stays active for incident investigation. After verifying a serving release digest and Ready, disabled fallback revision, the controller also attempts to route normal traffic to the pinned safe revision **even if a service-template approval-toggle update is denied**; it still reports rollback incomplete and requires investigation (for example, tagged or non-default routes may remain reachable). The controller does not access Neon, read secrets, publish questions, or modify IAM. Pausing queue does not terminate requests already in flight.

## Separate mandatory production-change approval

This pull request is **only a GitHub implementation**. Do not enable generation because the code exists. After source review and CI:

1. Build one separate rollback image with `cloudbuild.examtree-qs-prod-chapter-rollback-build-only.yaml`, pin its resulting **SHA256** digest.
2. Verify the pinned fallback revisions still serve production and that their approval flags are disabled. Confirm immutable image digests, actual chapter manifest and canonical CP eligibility. Stop for drift.
3. Create **dedicated** runtime and scheduler service identities. Assign rollback runtime only least-privilege get/update for exactly the three Cloud Run services and both dispatcher Jobs, get/pause on each of the two named queues, get/pause Scheduler, revision get, and actAs scoped to the named runtime service identities. No database access, Secret Manager access, project Editor/Owner, or broad service invocation. Use a fresh IAM condition lasting beyond the planned rollback deadline.
4. Create a **new Cloud Run Job** from the immutable rollback image, one task, parallelism one, job retries zero. Initially use read-only default arguments. Create a separate Scheduler, initially PAUSED, with a one-minute cadence and OAuth-authenticated POST to `https://run.googleapis.com/v2/projects/sarbedutech/locations/asia-south1/jobs/examtree-qs-prod-chapter-rollback:run`.
5. Independently test and **prove** that the Scheduler runs the job with the intended identity, that expiry disables generation and restores all three baseline revisions, and that a simulated failure keeps both queues paused wherever permitted and Scheduler active. Safely isolate the test; do not run the live rollback as a simulation.
6. Only with fresh production approval arm exact UUID/expiry and `--apply` on the dedicated Job, enable and verify its Scheduler, then separately authorize the scoped API/Receiver/Worker release. Job expiry must match the chapter-review expiry on the three services.
7. Confirm Cloud Tasks idempotency for maxAttempts=3; verify worker OIDC, Neon run/outbox atomicity, cost ceiling, monitoring, admin RBAC, front-end routing and review-only persistence. Only then permit bounded chapter batches (1–20 questions).

**Never resume the queue, change existing production traffic, set any approval to true or publish questions as a consequence of this PR.** The old canary cleanup must stay distinct and paused.

## Local/offline verification

`python3 tests/test-qs-prod-chapter-rollback.py -v`

CI workflow: `.github/workflows/qs-prod-chapter-rollback.yml`. No Google credentials needed.

## Remaining proof before generation

Offline source tests do **not** prove the live Cloud Run rollback. The following remain release blockers: verified independent job invocation, safe end-to-end expiry rollback, fresh IAM, matching chapter scope/expiry, transactional duplicate task safety, alerting/cost limits and frontend enablement.

## Simulated expiry/recovery — offline only (2026-10-24)

The new `tests/test-qs-prod-chapter-rollback-simulation.py` drives the
**same controller** through an isolated in-memory Cloud API while testing:

- Scheduler successfully authenticated and deadline elapsed, prior active candidate revision, queued work active;
- exact queue pause, dispatcher approval OFF, three service template approvals OFF,
  routing each to an exact immutable baseline, and Scheduler self-pause last;
- no mutation before the release deadline or when approval is missing;
- rejection of a wrong Scheduler OAuth identity before any change;
- permission-denied during a service rollback: queue remains PAUSED, Scheduler stays ENABLED;
- unexpected serving image and expiry mismatch: queue remains PAUSED, Scheduler stays ENABLED.

This test is runnable without any Cloud credentials and **cannot touch
production**. It proves control-flow behavior under mocked metadata, **not**
Cloud Run's actual IAM/revision-update semantics or end-to-end live expiry rollback.
In particular, on an unknown live release digest the rollback controller
stops rather than routing that unrecognized live image; the queue is paused,
but a live HTTP route might remain. This is a production rollout blocker to
evaluate independently (and is **not** a successful full recovery).
Never use these tests as permission to enable normal generation.

Run locally: `python3 tests/test-qs-prod-chapter-rollback-simulation.py -v`.
Future build-only submissions run this simulation before building the image.
A controller source change requires a new immutable image build and separately approved, disarmed Job update. A merge does not change the running Cloud Run Job.

## Dual-queue release invariant (2026-10-24)

The updated controller requires BOTH production queues to exist and be PAUSED during the read-only preflight. Its post-expiry routine independently attempts to pause each queue before touching dispatcher or service traffic. Any inability to verify both queues PAUSED leaves the rollback Scheduler enabled and fails the release; it never claims a full rollback from just the old queue being paused. The rollback runtime identity additionally needs Cloud Tasks `queues.get` and `queues.pause` scoped to the new queue (with no resume/create permission). The new queue must be created PAUSED and never resumed until separately approved. **Do not activate the chapter dispatcher or chapter admin route until the new rollback image is deployed/disarmed and its actual dual-queue behavior has been verified.**

## Chapter dispatcher rollback gate (2026-10-24)

PR #3475 added an isolated review-only Cloud Run Job `examtree-qs-chapter-dispatch-prod`. Controller source must now explicitly read `EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_APPROVED` and force it `false` before declaring rollback complete; an IAM-denied update is a **hard failure** and leaves the independent rollback Scheduler enabled. Assign the rollback runtime identity `run.jobs.get` and `run.jobs.update` on the dedicated chapter dispatcher Job, with the narrowest supported resource-scoped binding. The controller requires BOTH dispatchers disabled even in its read-only preflight. **Newly built candidate API, receiver and worker image digests are not automatically trusted by this controller; a separate reviewed SHA256 pin update is needed before any live activation.** No source change automatically changes Cloud Run.
