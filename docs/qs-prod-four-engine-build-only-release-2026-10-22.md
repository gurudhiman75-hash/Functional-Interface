# Question Studio — build-only production release boundary (2026-10-22)

**This is NOT authorization to activate generation.** The existing production queue `examtree-qs-prod` remains PAUSED, receiver and worker approval flags stay OFF, dispatcher remains OFF, and the cleanup Scheduler remains PAUSED between canaries. Do not reuse historical COM-001 run `c71b5ccb-8aa6-44e0-b0a5-01a3607a9c98` or cancelled run `48aaff58-d0cb-4345-be5f-491089b72f10`. Never blindly retry uncertain enqueue / task execution.

## Existing build-only configurations
- Receiver / enqueue image: `cloudbuild.examtree-qs-prod-task-receiver.yaml`, `Dockerfile.examtree-qs-prod-task-receiver`.
- Compute image: `cloudbuild.examtree-qs-prod-universal-worker.yaml`, `Dockerfile.examtree-qs-prod-universal-worker`.
- Both builds require an explicitly specified `_IMAGE` and **do not deploy**, change IAM, schedule jobs, connect DB, or resume Cloud Tasks.
- Choose a **new immutable release tag based on exact reviewed New-main commit** for each image, then record built Artifact Registry SHA256 digests. Tags alone are not deployment pins.
- Use the existing approved build identity and established Artifact Registry repo; do not grant Owner/Editor privileges to expedite this release.
- No Cloud Shell required for manual Cloud Build trigger, but console builds still need existing repo integration and IAM. Never trigger a build with production deployment actions.

## Strict pre-activation checks
1. Read the real *latest* Git commit + successful CI, ensure source image includes receiver, worker, reviewed enqueue job and review-only policy.
2. Verify rebuilt worker and receiver images from digests without shifting Cloud Run traffic. Existing disabled revisions must continue serving.
3. The old `scripts/qs-prod-canary-console-preflight.py` is hard-pinned to the **previous** COM-001 run and cannot approve a fresh four-engine canary. Do NOT bypass it by replacing only its RUN_ID; its expected modes, cleanup and permissions must be revised and tested as a coherent release.
4. Select **one newly approved exact engine/package/CP** which passes the *actual built canonical manifest* safety fields, not merely the offline example identifiers. Review-only, English, count=1, expiry <=15 minutes, no question bank/publication.
5. Confirm the production receiver and production worker independently enforce the **same new** approved run ID, exact CP scope, worker seed and TTL; the separate reviewed enqueue job must require explicit execution approval.
6. Before activation, verify zero queued/running DB runs and zero pending Cloud Tasks/outbox (read-only); verify project `sarbedutech`, region `asia-south1`, service accounts, private OIDC, token bindings, max retries 0, cost limits.
7. Pin independently verifiable rollback to an immutable cleanup job image with the new deadline. Re-check exact cleanup identity, permissions, Scheduler OAuth target, role-condition expiry, serving disabled revision pinning. The audit on October 21 demonstrated permission `cloudscheduler.jobs.pause` granted to cleanup SA, **not** a new end-to-end rollback dry run.
8. The cleanup IAM time-bound grant expires **2026-10-24 05:30 IST**. Do not arm a rollback that runs after that expiry. Verify condition against the real planned execution time.
9. Prove cleanup automatic rollback works for this release before authorizing production traffic changes. Do not replace the independent rollback with a Cloud Shell session or a manual reminder.
10. Require fresh explicit production-change approval naming the run ID, CP and exact pinned digests. Only then may an operator activate one exact run; normal production queue and dispatcher must stay disabled.

## Evidence snapshot
Previous COM-001 canary: exactly one review question stored, none published; rollback logs show queue paused, receiver and worker OFF/pinned, dispatcher OFF, then `GCP_PERMISSION_DENIED` on final Scheduler operation. Later Cloud Audit Logs screenshot showed cleanup service account had `cloudscheduler.jobs.pause` **granted:true** and successful `PauseJob` status; still no fresh new-release rollback test.

**Stop conditions:** mismatched image, unknown running task, uncertain job execution, expired IAM condition, no fresh rollback proof, missing approved CP in canonical manifest, or unverified production flags. No deployment or queue resume from this document.
