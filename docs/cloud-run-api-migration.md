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

## Staging database and secrets — one-time preparation
1. Create a **Neon staging branch** (not the active Examtree production branch), and obtain its connection URL. This API invokes catalogue initialization during startup; never point staging at production by default.
2. Use Google Cloud Shell to create a Secret Manager secret named `examtree-api-database-url`. Create the empty secret if it does not exist: `gcloud secrets create examtree-api-database-url --project=sarbedutech --replication-policy=automatic`. Then add the staging Neon URL from an interactive hidden prompt:
   ```bash
   read -srp "Paste STAGING Neon URL (not production): " STAGING_DATABASE_URL; echo
   printf '%s' "$STAGING_DATABASE_URL" | gcloud secrets versions add examtree-api-database-url --project=sarbedutech --data-file=-
   unset STAGING_DATABASE_URL
   ```
   Never paste URLs containing credentials or tokens in ChatGPT.
3. The other required secret, `examtree-trg002-worker-token`, already exists in project `sarbedutech`; the deploy script will reuse it. The API uses a **dedicated** service account `examtree-api-runtime`, and Google Application Default Credentials for Firebase instead of exporting a service-account private key. If Firebase API permissions are denied, assign only the appropriate Firebase/Firestore/Storage/FCM roles to this service identity, rather than creating a JSON key.
4. Confirm Google Cloud billing budget alerts and Artifact Registry storage. Costs may arise from builds, image storage, Cloud Run CPU/memory/requests, Neon network egress, Secret Manager and a future Scheduler. Scale-to-zero does **not** guarantee zero costs.

## Stage the new API after CI
```bash
cd ~/Functional-Interface
git checkout New-main
git pull --ff-only origin New-main
EXAMTREE_BUDGET_READY=yes bash scripts/deploy-examtree-api-cloudrun-staging.sh sarbedutech
```
The script builds a standalone API image, mounts a staging DB URL from Secret Manager, deploys `examtree-api-staging`, checks `/health`, and creates a scheduled-worker Cloud Run Job definition without executing it or creating a Scheduler trigger. It does not modify Render, Cloudflare, Firebase Auth allowed domains, Cashfree merchant webhooks, or the mobile app. Node API background timers do not start in Cloud Run mode.

## Acceptance gates before Cloudflare cutover
- [ ] `GET /health` 200, and configured API functions do not return 502/503.
- [ ] Firebase Google and mobile-number auth verified using Google-managed service identity; admin RBAC denied to ordinary student and allowed for superadmin.
- [ ] Student discovery, category/exam/test-series views, active test session creation, answer saves, submit, analytics and attempt retrieval; confirm all writes persist in the intended DB.
- [ ] Question Studio NUM-001 (1/3 questions) through **authenticated** admin endpoint; generated question versions remain REVIEW_ONLY, not automatically inserted into Question Bank; TRG-002 and NUM-002 unchanged.
- [ ] Cashfree **sandbox** checkout, signed payment callbacks, captured entitlement, failed/user-dropped attempts, refund evidence check; ensure raw webhook body and idempotency preserved. Production merchant webhook URL is NOT changed until complete.
- [ ] Check current affairs, learn resources, mobile Home promotions and notification delivery using staging data.
- [ ] Validate Neon connection pool while Cloud Run scales; ensure background job is bounded and never runs concurrently with Render's timers against the same data.
- [ ] Verify custom domain, cookie/CORS, Firebase Auth authorized domains, Cloudflare proxy routing, Android build/base URL, all payment callback redirects and webhook registration.
- [ ] Confirm a separate schema migration workflow before shutting down Render's `build-api.sh` migration authority. The Cloud Run image build deliberately **does not run database migrations**.

## Cutover — only after acceptance
1. Decide API origin for mobile (prefer stable `api.examtree.in`, if DNS and TLS are configured; direct Cloud Run URL may be used temporarily), test on a new APK.
2. Configure required **production** secrets in Secret Manager separately from staging. Never reuse the staging Neon URL as the production DB by accident.
3. Deploy production Cloud Run API with production secret mapping and independent runtime identity. Validate all endpoints and rollback before moving public traffic.
4. Set Cloudflare Pages Production **environment variable** `EXAMTREE_API_UPSTREAM_ORIGIN=https://<validated-cloud-run-host>.run.app`, preserving the existing Pages build. The Pages Function ignores client-supplied upstream parameters and supports rollback by removing that variable.
5. Move Cashfree webhook configuration to the new verified first-party URL; keep signature verification and transactional idempotency checks unchanged. Mobile app base URL must also be migrated and shipped before Render suspension.
6. Turn off Render's in-process notification/outbox processors and drain pending campaigns/events; only then deploy a **separate production Cloud Run Job** named `examtree-api-background` with production secrets and validate it once. After confirming the original Render service has stopped and the new background job is correct, run `scripts/enable-examtree-api-background-scheduler.sh` with `EXAMTREE_CUTOVER_READY=yes EXAMTREE_RENDER_STOPPED=yes EXAMTREE_BACKGROUND_JOB_VERIFIED=yes` to create a dedicated Scheduler invoker with limited `roles/run.invoker` authority. NEVER apply the Scheduler script to the staging job. Validate job success, retries and duplicate prevention. **Do not run both pollers against the same production DB.**
7. Observe production traffic, purchases, refunds, test sessions and admin for a full validation window. Suspend Render only after proven rollback and successful sustained operations.

## Rollback
Remove `EXAMTREE_API_UPSTREAM_ORIGIN` from Cloudflare Pages Production to restore the existing Render API. Stop scheduled Cloud Run Jobs before re-enabling Render's pollers. Keep original Cashfree webhook URL registered until the new endpoint is confirmed. Restore Android base URL only through a new APK/config rollout. Never roll back schema changes without a tested database plan.
