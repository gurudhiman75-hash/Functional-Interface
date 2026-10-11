# ExamTree Render → Cloud Run: final production handover (2026-10-11)

## Verified and closed — do NOT rerun historical write tests against live Neon

- Existing student-session lifecycle and Cashfree sandbox functional tests were
  already exercised before the staging branch split. Their historical evidence
  remains valid **for those deployments and data versions**, not as proof of a
  new production revision.
- Encrypted offsite Neon backup and isolated restore drill passed. Automated
  03:30 IST backup and 06:30 IST freshness schedules configured.
- Question Studio generation and production review GET verified; 8/8 after
  Cloudflare's urllib false-positive was fixed using curl.
- Production Render and Cloudflare Pages continue using the Neon **main**
  branch. Cloud Run **staging** uses its own branch
  `examtree-cloudrun-api-staging-20261010`; no scheduled staging jobs;
  isolated old-run absence and staging service health verified.
- 13/13 operations configuration checks passed. Note: existence of one job
  execution and archive is NOT proof of ongoing backup success/freshness.
- The Pages build script already sets BOTH `VITE_API_BASE_URL=/api` and
  `VITE_API_URL=/api`. Verify **compiled** deployed assets before cutover.

## Code safeguards prepared, not necessarily deployed on Render

1. Outbox: `publishOneLocked()` holds the PostgreSQL `FOR UPDATE SKIP LOCKED`
   row lock through dispatch and publication. Previously the lock was released
   before publication, permitting concurrent duplicate processing. At present
   dispatch logs a durable event; if external message publication is added,
   downstream idempotency is STILL required for crash recovery.
2. Render notification polling can be disabled with
   `MOBILE_NOTIFICATION_WORKER_ENABLED=false`; Render's existing outbox flag
   is `OUTBOX_PUBLISHER_ENABLED=false`. Render has AUTO-DEPLOY **OFF**:
   merging this code is NOT proof the new opt-out is active on Render.
3. Cloud Run API does not start either timer when
   `EXAMTREE_API_RUNTIME=cloud-run`.
4. Cloud Run *staging* background job has no executions and refuses
   execution. Do NOT enable its scheduler.
5. Production Scheduler script additionally checks the actual production
   job references `examtree-api-database-url`, is not staging, and has
   a non-disabled command. It still requires explicit
   `EXAMTREE_RENDER_STOPPED=yes` and
   `EXAMTREE_BACKGROUND_JOB_VERIFIED=yes`. Never turn on two publishers
   against live Neon simultaneously.

## Run read-only production readiness now

```bash
cd ~/Functional-Interface
git switch New-main && git pull --ff-only origin New-main
python3 scripts/inspect-examtree-cloudrun-production-handover.py
```

Expect PENDING for any missing or inaccessible `examtree-api` production
service, live Cashfree secrets, AI provider key mapping, the separate
`examtree-api-background` Job, or compiled Pages assets.
**Do NOT substitute `examtree-api-staging` for production.**
This inspector NEVER runs jobs, fetches secret values, triggers payments,
or changes the production API gateway.

## Safe sequence to finish actual migration

A. Prepare and build the final **production** Cloud Run API image from the
merged and tested `New-main` revision. Use a separate runtime identity,
production Neon main URL secret (ONLY for production), live Cashfree secret
mappings and configured AI provider keys. Production service must have
`EXAMTREE_API_RUNTIME=cloud-run`, `EXAMTREE_API_STAGING=false`,
`OUTBOX_PUBLISHER_ENABLED=false`,
`GENERATION_JOB_WORKER_ENABLED=false` and **min=0** initially.
Never expose a staging endpoint with a live payment configuration.
Use a private IAM-gated candidate service; do not authorize anonymous access
until cutover approval and independent full authenticated checks.
No schema migration at container startup.

B. Validate candidate auth, admin RBAC, student reads and payment security on
the new revision (without repeating financial writes where historical tests
already established behavior). Confirm live merchant settings and signed
webhook endpoint; reconcile earlier mismatched historical provider IDs based
on Cashfree provider evidence. Do not edit payment IDs or retry refunds
blindly. Check source-to-compiled frontend API paths, mobile APK API base URL,
Firebase allowed domains, CORS, cookies, payment redirects, DNS/TLS and
rollback action.

C. Deploy updated Render code **before** attempting the worker handover:
Render auto-deploy is OFF. Confirm logs indicate the new polling flags can
be read. While Render is still primary, keep its current workers enabled.

D. At a deliberate low-traffic cutover window, stop Render's outbox and
notification pollers using the opt-out flags and a confirmed Render
redeploy/restart; verify via deployment/environment/logs and no outstanding
in-flight delivery. Do not stop the API or disable existing Cashfree webhook
while transactions are pending.

E. Deploy a separate production `examtree-api-background` Job with live
Neon credentials and the vetted production image. A controlled validation
execution can send real FCM notifications: do not run unless explicitly
authorized and Render pollers are confirmed off. Confirm bounded tasks,
single-task parallelism, no duplicate claims, retries/error visibility. Only
then use the gated `scripts/enable-examtree-api-background-scheduler.sh`.

F. Promote the private API candidate to public once its endpoints, live
Cashfree webhook registration/verification, routing and rollback are ready.
Set Cloudflare Pages Production variable
`EXAMTREE_API_UPSTREAM_ORIGIN=https://<production-service>.run.app`
ONLY at approved cutover. Keep Pages' compiled student/admin API calls at
same-origin `/api`. Update the Android build/backend target and release APK.
Observe payments, auth, attempts, Question Studio, FCM and admin metrics.

G. Rollback: remove the Cloudflare upstream override to restore Render, and
stop the Cloud Run Scheduler **before** re-enabling Render's timers. Restore
the previous Cashfree webhook configuration if changed; keep a tested
rollback-capable Render version throughout. Do not reverse production DB
schema changes without a tested restoration plan.

## What remains outside an automated staging PASS

- A dedicated production Cloud Run service is a separate deployment;
  staging success does **not** create one.
- Production app and Cloud Run job are deliberately not deployed or scheduled
  by merging safety code. Cutover changes access, billing and financial routing.
- Provider evidence for historical webhook/payment reference discrepancies
  requires Cashfree-side independent verification, separate from functional
  sandbox test success.
- Provider dashboard, Render live environment, mobile APK and Cloudflare
  production binding must be independently verified before user-facing handoff.
