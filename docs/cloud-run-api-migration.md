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

## Live Neon database and staging isolation — mandatory

**Correction (2026-10-11):** Render and Cloud Run staging initially both used the
**live production Neon main branch**, project `empty-sunset-07552954`, branch
`br-morning-bar-atttdxj4`. Calling it a "TEST database" was incorrect:
whether any existing records are disposable must not be assumed. The NUM-001
review-only generation smokes on 2026-10-11 saved **four real generated
questions** (one plus three) into this live shared branch, although review
locks prevented student publication. Never rerun those writes against main.

An existing copy-on-write branch `examtree-cloudrun-api-staging-20261010`
(`br-tiny-dust-at9gpdbj`) has now been provisioned with its own **0.25 CU**
compute `ep-wild-water-atrzmssw.c-9.us-east-1.aws.neon.tech`. It is a
snapshot from October 10 and does not automatically contain subsequent
generation runs or changes made to main.

**The branch's existence alone does not isolate the Cloud Run service.**
Until the separate Secret Manager binding is installed and the revised
Cloud Run staging revision is healthy, staging **still uses production Neon**.
Do not run any staging generation, payment, attempt, migration or outbox-write
tests before that change is verified.

From Cloud Shell, with the branch's connection URL copied **privately** from
Neon (do not put it in chat or in a shell command), run:

```bash
cd ~/Functional-Interface
git switch New-main && git pull --ff-only origin New-main
EXAMTREE_STAGING_DB_SWITCH_APPROVED=yes \
  bash scripts/isolate-examtree-cloudrun-staging-neon.sh
```

The script uses hidden input, validates the **exact staging endpoint host**,
checks TLS and database name, stores the URL only in the dedicated
`examtree-api-staging-database-url` secret, grants staging runtime identity
access, and rebinds only the Cloud Run **staging** API and inert staging job.
It disables the staging job command as well as setting
`EXAMTREE_API_STAGING=true`, and verifies the service's disabled
`OUTBOX_PUBLISHER_ENABLED` and `GENERATION_JOB_WORKER_ENABLED` flags.
It does **not** touch Render, Cloudflare routing, Cloud Run production
services, Firebase Auth, Cashfree production credentials or actual job
executions. This step creates a new Secret Manager version and Cloud Run
staging revisions, and can incur Google Cloud/Neon usage. Never publish
connection strings, Firebase tokens or payment keys in logs.

Future staging image deployment
(`scripts/deploy-examtree-api-cloudrun-staging.sh`) now requires this
dedicated secret and rejects a URL that points at the live Neon main endpoint.
Staging generation smoke refuses to proceed if the service has the old
main-database secret binding.

The existing Neon main URL/secret `examtree-api-database-url` must remain
available to Render and the verified daily backup/restore system. Do not
rotate or overwrite it as part of staging isolation.

### One-time staging prerequisites

- Verify Google Cloud billing alerts. The new Neon compute may use
  additional plan allowance; the account did not permit a custom
  autosuspend timeout, so inspect its actual configured suspend setting.
- Keep `EXAMTREE_API_STAGING=true`, Cashfree sandbox only, no worker
  scheduler, and no live student traffic.
- The staging Cloud Run runtime service account
  `examtree-api-runtime@sarbedutech.iam.gserviceaccount.com` uses
  Firebase ADC and Secret Manager. Never copy Render's private JSON key.
- New **staging** run IDs after isolation will not appear in Render's
  admin UI, which correctly continues to use Neon main. Verify staging
  reads via the Cloud Run staging API, not the live website.

### Staging AI provider policy
The existing API's production mode normally requires an AI extraction provider key. This staging deployment intentionally **does not require AI keys for the basic API health/auth/DB smoke checks**, using the narrow gate `EXAMTREE_API_RUNTIME=cloud-run` and `EXAMTREE_API_STAGING=true`. AI-powered routes cannot successfully call a provider without credentials. **Before production Cloud Run cutover**, configure the real AI provider keys through Secret Manager and deploy without `EXAMTREE_API_STAGING`; the strict startup check then applies again. Do not use this staging configuration as the final production backend.

Catalogue/test-series initialization is deliberately NOT performed on every Cloud Run startup; run the separately approved schema/catalogue bootstrap first. Render behavior is unchanged.

## Stage the new API after CI
```bash
cd ~/Functional-Interface
git checkout New-main
git pull --ff-only origin New-main
EXAMTREE_BUDGET_READY=yes bash scripts/deploy-examtree-api-cloudrun-staging.sh sarbedutech
```
The script builds a standalone API image, mounts the **isolated Neon staging database URL** from Secret Manager, deploys `examtree-api-staging`, checks `/health` and safe negative E2E tests for unauthorized Question Studio generation and unsigned Cashfree webhooks, and creates a scheduled-worker Cloud Run Job definition without executing it or creating a Scheduler trigger. It does not modify Render, Cloudflare, Firebase Auth allowed domains, Cashfree merchant webhooks, or the mobile app. Node API background timers do not start in Cloud Run mode. The canonical Neon client remains unchanged. Limit Cloud Run instance count until production DB connection headroom is measured; the current driver default can open up to 10 connections per instance.


## Authenticated staging acceptance using existing test identities

After basic security and CORS checks pass, validate Firebase identity using
existing, disposable test-student and bootstrapped-superadmin accounts.

    cd ~/Functional-Interface
    git switch New-main
    git pull --ff-only origin New-main
    bash scripts/verify-examtree-cloudrun-authenticated.sh student

When the student checks pass, test the separate superadmin account:

    bash scripts/verify-examtree-cloudrun-authenticated.sh admin

The script interactively requests a fresh Firebase ID token via HIDDEN
terminal input. NEVER paste a token into ChatGPT, logs, repository, or shell
command arguments; these are bearer credentials. Do not substitute a Google
Cloud IAM identity token. To obtain your own current Firebase ID token, log
in to the Examtree website, open browser DevTools Network, and select an
authenticated API request with its Authorization Bearer header. Copy only the
token (not the header name) to the hidden Cloud Shell prompt, never the chat.
Use disposable accounts and avoid sharing screenshots with bearer tokens.

Student mode reads profile and purchases and verifies student finance RBAC is
denied. Superadmin mode reads orders and Cashfree reconciliation diagnostics.
The script resolves the actual Cloud Run staging URL, and never sends POST,
PATCH, DELETE, refund, attempt, or background job requests.

CAUTION: Examtree authentication middleware can reconcile a verified Firebase
identity and update the last-login timestamp even on GET routes. These are
existing application side effects in the database currently bound to Cloud Run, so use
established disposable test users, not real student identities.

These tests do not establish signed provider webhook delivery, attempt writes,
idempotent refunds, or background job readiness. Render and public routing
remain untouched pending separate evidence and explicit approval.


## Expired paid-test access preflight (2026-10-11)

The Neon main dataset at the time of the earlier smoke had one published test,
`T-CF-SANDBOX-20261009`, with three scored questions and a paid product link.
Both historical one-day sandbox entitlements are past their validity end:
one was refunded and revoked; the other retains database status `active`
but expired at 2026-10-11 03:26:43 UTC. Effective paid access must therefore
remain DENIED; a student account should not silently regain access because
the ledger status is still `active`.

Verify the actual Cloud Run staging entitlement middleware using an existing
test-student Firebase ID token entered at a hidden prompt:

    bash scripts/verify-examtree-cloudrun-paid-test-expiry.sh

The script sends GETs only and checks that effective entitlement access
returns `allowed=false`, `paidAccessRequired=true`, and
`reason=entitlement_required`, and that test questions are rejected with
403. It makes no checkout, attempt, refund or manual entitlement changes.
Authentication middleware can still update identity/login metadata.

**Positive test submission is blocked until a deliberate fixture is prepared.**
Do NOT extend the expired paid entitlements, create a new Cashfree payment,
rewrite order status, or bypass `requireTestAccess` merely to make the test
pass. The next phase should use an isolated, approved free test publication
or an explicitly approved, correctly audited disposable entitlement before
starting/saving/submitting any new attempt. Staging and Render shared Neon before isolation
main, so fixture creation affects both APIs and needs operator approval.

### Authenticated NUM-001 staging persistence — 2026-10-11
- One question generated through the deployed Cloud Run API and the shared remote
  Question Studio worker (run `802f5472-41f5-4c61-904e-2187fedd01a3`,
  public code `GEN-20261011-7535FFC2`).
- Independent Neon read: one `review` generation run, one unreviewed item and
  version, one audit event, one outbox event. Saved stem, four options,
  correct answer and explanation were mathematically consistent.
- Both run and item lifecycle prohibit Question Bank writes, automatic
  publication and mock/student test eligibility. `validationResult=pending`
  retains manual editorial review.
- **Difficulty contract discrepancy:** the API smoke requested `Easy`;
  planner allocated `Easy: 1`; persisted item still has source label `Hard`.
  This is explained by NUM-001 Number System's declared
  `difficultyFilterSupported: false`: profile generation preserves the
  original source label instead of forcing it to match a quota. Do not
  claim that E/M/H output filter works, change source labels, or mark the
  per-tier generation gate passed. The staging smoke has been changed to
  `Mixed` for further infrastructure validation. Difficulty-filter support
  and accurate UI/API descriptions require a separate content-engine fix.
- A three-question authenticated run, independent payload check and admin UI
  generation flow are still pending.

## Acceptance gates before Cloudflare cutover
- [ ] `GET /health` 200, and configured API functions do not return 502/503.
- [ ] Firebase Google and mobile-number auth verified using Google-managed service identity; admin RBAC denied to ordinary student and allowed for superadmin.
- [ ] Student discovery, category/exam/test-series views, active test session creation, answer saves, submit, analytics and attempt retrieval; confirm all test writes persist in **isolated Neon staging** (and can be distinguished from earlier Render test runs).
- [ ] Question Studio NUM-001 (1/3 questions) through **authenticated** admin endpoint; generated question versions remain REVIEW_ONLY, not automatically inserted into Question Bank; TRG-002 and NUM-002 unchanged.
- [ ] Cashfree **sandbox** checkout, signed payment callbacks, captured entitlement, failed/user-dropped attempts, refund evidence check; ensure raw webhook body and idempotency preserved. Production merchant webhook URL is NOT changed until complete.
- [ ] Check current affairs, learn resources, mobile Home promotions and notification delivery using explicitly disposable test data.
- [ ] Validate Neon connection pool while Cloud Run scales; ensure background job is bounded and never runs concurrently with Render's timers against the same data.
- [ ] Verify custom domain, cookie/CORS, Firebase Auth authorized domains, Cloudflare proxy routing, Android build/base URL, all payment callback redirects and webhook registration.
- [ ] Use the checked-in `scripts/examtree-api-schema-bootstrap.sh` as the separate schema migration authority: run it with `EXAMTREE_SCHEMA_MIGRATION_APPROVED=yes` and the securely provided `DATABASE_URL` only after reviewing the latest migrations and database recovery plan. Never run migrations implicitly in the container build. Confirm this process works before shutting down Render's `build-api.sh` migration authority. The Cloud Run image build deliberately **does not run database migrations**.

## Cutover — only after acceptance
1. Decide API origin for mobile (prefer stable `api.examtree.in`, if DNS and TLS are configured; direct Cloud Run URL may be used temporarily), test on a new APK.
2. Confirm that Neon main remains the production source of truth, while Cloud Run staging uses its separate branch. Move to separate runtime credentials and validate backups/point-in-time recovery before live student onboarding.
3. Deploy production Cloud Run API with production secret mapping and independent runtime identity. Validate all endpoints and rollback before moving public traffic.
4. **First rebuild BOTH Vite frontends to use the same-origin API proxy:** set `VITE_API_BASE_URL=/api` for the student app and `VITE_API_URL=/api` for the admin app in the Cloudflare production build environment, then rebuild/redeploy Cloudflare Pages. The checked-in `artifacts/examtree/.env.production` and `artifacts/admin-app/.env.production` still contain direct Render URLs, so changing only the Pages Function upstream would leave the browser calling Render. With both build-time variables set and the final Pages output assembled, run `VITE_API_BASE_URL=/api VITE_API_URL=/api node scripts/check-examtree-cloudflare-cutover.mjs` and require PASS. Before any Cloud Run cutover, verify same-origin Pages proxy continues to pass all auth/session flows with Render fallback. The preflight checks actual compiled .js/.html assets, not just index.html. The Android app also needs its own API endpoint update and released APK.
5. Set Cloudflare Pages Production **environment variable** `EXAMTREE_API_UPSTREAM_ORIGIN=https://<validated-cloud-run-host>.run.app`, preserving the existing Pages build. The Pages Function ignores client-supplied upstream parameters and supports rollback by removing that variable.
6. Move Cashfree webhook configuration to the new verified first-party URL; keep signature verification and transactional idempotency checks unchanged. Mobile app base URL must also be migrated and shipped before Render suspension.
7. Turn off Render's in-process notification/outbox processors and drain pending campaigns/events; only then deploy a **separate production Cloud Run Job** named `examtree-api-background` with production secrets and validate it once. After confirming the original Render service has stopped and the new background job is correct, run `scripts/enable-examtree-api-background-scheduler.sh` with `EXAMTREE_CUTOVER_READY=yes EXAMTREE_RENDER_STOPPED=yes EXAMTREE_BACKGROUND_JOB_VERIFIED=yes` to create a dedicated Scheduler invoker with limited `roles/run.invoker` authority. NEVER apply the Scheduler script to the staging job. Validate job success, retries and duplicate prevention. **Do not run both pollers against the same production DB.**
8. Observe production traffic, purchases, refunds, test sessions and admin for a full validation window. Suspend Render only after proven rollback and successful sustained operations.

## Rollback
Remove `EXAMTREE_API_UPSTREAM_ORIGIN` from Cloudflare Pages Production to restore the existing Render API. Stop scheduled Cloud Run Jobs before re-enabling Render's pollers. Keep original Cashfree webhook URL registered until the new endpoint is confirmed. Restore Android base URL only through a new APK/config rollout. Never roll back schema changes without a tested database plan.
