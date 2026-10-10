# Examtree: Render → Cloud Run API migration

**Migration status:** staged implementation, **NOT** traffic cutover. The website remains on Cloudflare Pages, Firebase handles user identity and files, Neon remains the single system-of-record PostgreSQL, and the existing Cashfree merchant integration is unchanged. Keep Render running until final sign-off.

## Services
| Current | Target | Stage |
| --- | --- | --- |
| Render `examtree-new` Express API | Cloud Run `examtree-api-staging` | Stage only, 2 GiB/1 CPU, min=0, max=1, 10 concurrency |
| Render in-process outbox+push timers | Cloud Run Job `examtree-api-background-staging`, invoked by Cloud Scheduler after cutover | Job deployed but NOT scheduled/executed |
| Cloud Run `examtree-generation-staging` | Keep as isolated, scalable Question Studio compute | Already staging-tested |
| Cloudflare Pages `/api/*` proxy to Render | `EXAMTREE_API_UPSTREAM_ORIGIN` Pages environment binding | Not set until E2E gates pass |
| Mobile app direct Render API | New Cloud Run URL or first-party API domain | Requires separate client/APK rollout |
| Cashfree webhook registered URL | Switch to the validated first-party API endpoint **after** payment sandbox and production verification | No change yet |

## Existing Neon test database and secrets — one-time preparation
The owner confirmed that **Neon `main` currently contains test accounts and test attempts only**, with no real student data. Therefore **no second Neon compute endpoint or permanent database is required** for this migration. Use the existing Neon connection, retaining existing test data. A separate Neon branch `examtree-cloudrun-api-staging-20261010` was created without compute during planning; it is **not needed** for this phase and will not be connected or billed for a compute endpoint.

Important: Cloud Run staging and Render will temporarily share the **same database**. Initial API startup can ensure approved exam/test-series catalogue rows. This is acceptable for today's disposable test environment, but do not run duplicate payment/webhook or notification jobs, do not trigger real refunds, and do not enable schema migrations while the two APIs overlap. Test accounts may be used; preserve any test records you want to keep. Reassess isolation before onboarding real students.

1. Retrieve the **existing Neon main connection string** privately in the Neon dashboard (or the provider's credentials UI). Do **not** paste credentials here.
2. In Google Cloud Shell, create the Secret Manager secret `examtree-api-database-url` if it does not exist: `gcloud secrets create examtree-api-database-url --project=sarbedutech --replication-policy=automatic`. Add a version using a hidden shell prompt:
   ```bash
   read -srp "Paste EXISTING Neon main URL (test data only): " EXAMTREE_DATABASE_URL; echo
   printf '%s' "$EXAMTREE_DATABASE_URL" | gcloud secrets versions add examtree-api-database-url --project=sarbedutech --data-file=-
   unset EXAMTREE_DATABASE_URL
   ```
   Never paste the database URL, password, or Cloud Run worker token into chat. This secret is for **staging with test data only**; before live enrollment, rotate/split deployment credentials if required.
3. The pre-existing Secret Manager secret `examtree-trg002-worker-token` is reused. A dedicated Cloud Run runtime service account `examtree-api-runtime` authenticates to Firebase using ADC; grant only necessary Firebase/Firestore/Storage/FCM permissions if the service reports authorization failures. No JSON private key should be copied from Render.
4. Verify Google Cloud billing alerts and Artifact Registry storage. Deployment images, CPU/RAM/requests, Neon egress, Secret Manager and future Scheduler can incur charges. min-instances=0 is not a guarantee of no bill.

## Stage the new API after CI
```bash
cd ~/Functional-Interface
git checkout New-main
git pull --ff-only origin New-main
EXAMTREE_BUDGET_READY=yes bash scripts/deploy-examtree-api-cloudrun-staging.sh sarbedutech
```
The Docker image build runs `scripts/smoke-examtree-cloudrun-startup.mjs` to verify the actual production-mode Express bundle can bind `/health` with a deliberately unreachable local PostgreSQL socket and no AI extraction API key; no external credentials are used. Only `EXAMTREE_CLOUDRUN_STAGING=true` on the explicitly tagged Cloud Run staging service can start without an AI provider. Production Render and future production Cloud Run deployments continue to require an AI extraction provider key unless deliberately redesigned. Catalogue reconciliation is deferred until after Cloud Run binds its port, rather than gating startup on Neon cold starts.

The script builds a standalone API image, mounts the **existing Neon main test-database URL** from Secret Manager, deploys `examtree-api-staging`, checks `/health` and safe negative E2E tests for unauthorized Question Studio generation and unsigned Cashfree webhooks, and creates a scheduled-worker Cloud Run Job definition without executing it or creating a Scheduler trigger. It does not modify Render, Cloudflare, Firebase Auth allowed domains, Cashfree merchant webhooks, or the mobile app. Node API background timers do not start in Cloud Run mode. The canonical Neon client remains unchanged. Limit Cloud Run instance count until production DB connection headroom is measured; the current driver default can open up to 10 connections per instance.

## Acceptance gates before Cloudflare cutover
- [ ] `GET /health` 200, and configured API functions do not return 502/503.
- [ ] Firebase Google and mobile-number auth verified using Google-managed service identity; admin RBAC denied to ordinary student and allowed for superadmin.
- [ ] Student discovery, category/exam/test-series views, active test session creation, answer saves, submit, analytics and attempt retrieval; confirm all test writes persist in **existing Neon main** (and can be distinguished from earlier Render test runs).
- [ ] Question Studio NUM-001 (1/3 questions) through **authenticated** admin endpoint; generated question versions remain REVIEW_ONLY, not automatically inserted into Question Bank; TRG-002 and NUM-002 unchanged.
- [ ] Cashfree **sandbox** checkout, signed payment callbacks, captured entitlement, failed/user-dropped attempts, refund evidence check; ensure raw webhook body and idempotency preserved. Production merchant webhook URL is NOT changed until complete.
- [ ] Check current affairs, learn resources, mobile Home promotions and notification delivery using explicitly disposable test data.
- [ ] Validate Neon connection pool while Cloud Run scales; ensure background job is bounded and never runs concurrently with Render's timers against the same data.
- [ ] Verify custom domain, cookie/CORS, Firebase Auth authorized domains, Cloudflare proxy routing, Android build/base URL, all payment callback redirects and webhook registration.
- [ ] Use the checked-in `scripts/examtree-api-schema-bootstrap.sh` as the separate schema migration authority: run it with `EXAMTREE_SCHEMA_MIGRATION_APPROVED=yes` and the securely provided `DATABASE_URL` only after reviewing the latest migrations and database recovery plan. Never run migrations implicitly in the container build. Confirm this process works before shutting down Render's `build-api.sh` migration authority. The Cloud Run image build deliberately **does not run database migrations**.

## Cutover — only after acceptance
1. Decide API origin for mobile (prefer stable `api.examtree.in`, if DNS and TLS are configured; direct Cloud Run URL may be used temporarily), test on a new APK.
2. Confirm the existing Neon main test database will become the production source of truth only after final schema, payment and privacy reviews. Move to separate runtime credentials and validate backups/point-in-time recovery before live student onboarding.
3. Deploy production Cloud Run API with production secret mapping and independent runtime identity. Validate all endpoints and rollback before moving public traffic.
4. **First rebuild BOTH Vite frontends to use the same-origin API proxy:** set `VITE_API_BASE_URL=/api` for the student app and `VITE_API_URL=/api` for the admin app in the Cloudflare production build environment, then rebuild/redeploy Cloudflare Pages. The checked-in `artifacts/examtree/.env.production` and `artifacts/admin-app/.env.production` still contain direct Render URLs, so changing only the Pages Function upstream would leave the browser calling Render. With both build-time variables set and the final Pages output assembled, run `VITE_API_BASE_URL=/api VITE_API_URL=/api node scripts/check-examtree-cloudflare-cutover.mjs` and require PASS. Before any Cloud Run cutover, verify same-origin Pages proxy continues to pass all auth/session flows with Render fallback. The preflight checks actual compiled .js/.html assets, not just index.html. The Android app also needs its own API endpoint update and released APK.
5. Set Cloudflare Pages Production **environment variable** `EXAMTREE_API_UPSTREAM_ORIGIN=https://<validated-cloud-run-host>.run.app`, preserving the existing Pages build. The Pages Function ignores client-supplied upstream parameters and supports rollback by removing that variable.
6. Move Cashfree webhook configuration to the new verified first-party URL; keep signature verification and transactional idempotency checks unchanged. Mobile app base URL must also be migrated and shipped before Render suspension.
7. Turn off Render's in-process notification/outbox processors and drain pending campaigns/events; only then deploy a **separate production Cloud Run Job** named `examtree-api-background` with production secrets and validate it once. After confirming the original Render service has stopped and the new background job is correct, run `scripts/enable-examtree-api-background-scheduler.sh` with `EXAMTREE_CUTOVER_READY=yes EXAMTREE_RENDER_STOPPED=yes EXAMTREE_BACKGROUND_JOB_VERIFIED=yes` to create a dedicated Scheduler invoker with limited `roles/run.invoker` authority. NEVER apply the Scheduler script to the staging job. Validate job success, retries and duplicate prevention. **Do not run both pollers against the same production DB.**
8. Observe production traffic, purchases, refunds, test sessions and admin for a full validation window. Suspend Render only after proven rollback and successful sustained operations.

## Rollback
Remove `EXAMTREE_API_UPSTREAM_ORIGIN` from Cloudflare Pages Production to restore the existing Render API. Stop scheduled Cloud Run Jobs before re-enabling Render's pollers. Keep original Cashfree webhook URL registered until the new endpoint is confirmed. Restore Android base URL only through a new APK/config rollout. Never roll back schema changes without a tested database plan.
