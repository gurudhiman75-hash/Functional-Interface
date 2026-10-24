# Examtree QS — isolated production chapter-review dispatch (source only)

**As of 2026-10-24 this change is NOT deployed. Do not enable generation.**

## Purpose
Provide the missing separation between the PAUSED existing production queue
`examtree-qs-prod` and bounded, review-only full-chapter requests for the
four engines: quant-v4, reasoning-v1, language-v1 and knowledge-v1.

- The admin-only `POST /api/admin/question-studio/runs/async-production-chapter`
  continues enforcing admin RBAC, immutable canonical manifest, explicit release
  scope, idempotency and batch limits 1–20. It now writes the **distinct**
  `question_studio.generation_run.chapter_review_queued.v1` outbox event.
- Idempotency keys are domain-separated with a fixed-size SHA256 namespace.
  The existing stage/standard `question_studio.generation_run.queued.v1`
  flow remains unchanged.
- The existing generic, log-only outbox publisher explicitly excludes **both**
  Cloud Tasks event types, so it cannot mark chapter events delivered without
  creating tasks. This is a required code change to any deployed generic publisher.
- A separate one-shot Cloud Run Job source
  `examtree-qs-chapter-dispatch-prod` dispatches exactly **one pinned run UUIDv4**
  to the **dedicated** queue `examtree-qs-chapter-prod`. Its query requires both
  the chapter event type and run UUID, holds the outbox row lock, and re-checks
  the persisted canonical chapter scope before any Cloud Tasks creation.
  Standard dispatcher cannot consume this chapter event.
- Dedicated Cloud Tasks queue uses only the private production receiver and
  `examtree-qs-task-prod@sarbedutech.iam.gserviceaccount.com` for signed OIDC
  with the matching base-service origin audience. Existing private receiver/worker
  independently recheck the persisted chapter snapshot and review-only rules.
- The dedicated dispatcher requires its exact Cloud Run Job identity, one task,
  a fresh run UUIDv4, valid release expiry and all independent production gates.
  It refuses to run when ordinary production dispatcher approval is true.
- New build-only artifacts:
  `Dockerfile.examtree-qs-prod-chapter-dispatcher`,
  `cloudbuild.examtree-qs-prod-chapter-dispatcher-build-only.yaml`,
  `artifacts/api-server/build-qs-prod-chapter-dispatcher.mjs`.
  The image embeds the authoritative canonical package manifest, not a mock.
  **Building does not grant release approval, create a queue or deploy a job.**

## Non-negotiable blockers before first chapter batch

1. Verify this source and its tests in GitHub. Build and pin the new dispatcher
   image only after review. Deploy a **distinct** Cloud Run Job at 0 executions,
   all approvals OFF, task count 1, maxRetries 0; do not reuse the old dispatcher.
2. Create `examtree-qs-chapter-prod` **PAUSED**, with max concurrency 1,
   throughput 1 task/s, and an explicitly reviewed retry/deadline policy.
   Grant dispatch identity task creation only on that queue; grant receiver
   invoker to the preexisting task service account as appropriate. Do not
   grant the new job access to or resume `examtree-qs-prod`.
3. **Extend and independently verify timed rollback to pause BOTH queues**,
   disable all active chapter approvals and restore all three pinned
   baseline revisions. The currently deployed rollback controller only pauses
   `examtree-qs-prod`, so it is insufficient to authorize this new queue.
   Include a non-overlapping expiry and independent scheduler.
4. Confirm all three candidate Cloud Run services advertise eligible
   review-only packages in their **baked** canonical manifests, and verify
   signed OIDC, Neon transactional outbox/run leases, review persistence,
   idempotency, alerting and cost ceilings.
5. Release only one explicitly approved admin run at a time; approve separate
   batches for the four engines. Never auto-publish students' questions. The
   frontend remains default-OFF until live authorization and review UX are proven.

No queue, Scheduler, traffic, IAM, Secret Manager, Neon, student publishing,
GCP deployment or production approval changes are made by this PR. Source
alone does not verify real-time Cloud Tasks or rollback behavior.

## Offline checks

`node --test tests/qs-prod-chapter-isolated-dispatch.test.mjs`

The build-only Cloud Build config also runs the isolated dispatcher tests prior
to publishing its image. Review the rollout requirements before any live build.
