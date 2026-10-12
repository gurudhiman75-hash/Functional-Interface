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

## Proceed using sandbox keys while production credentials are unavailable

**Decision 2026-10-11:** Production Cashfree client ID/secret and production
OpenAI API key are not yet present in Google Secret Manager. **Do not**
substitute Cashfree sandbox keys into `examtree-api` while it points at live
Neon main. That would create mixed-environment orders and risk misleading
payment status and entitlement records.

Instead, reuse **existing** `examtree-api-staging` connected to isolated Neon
`examtree-api-staging-database-url` and Cashfree **sandbox** secrets. The
historical read-only operational preflight already confirmed the staging
payment mode and disabled API background pollers; never assume those settings
cannot have changed without checking them again.

The checked-in staging deployment script creates a new container image and
recreates the staging background job. For the **existing sandbox environment**,
prefer the more conservative
`scripts/refresh-examtree-cloudrun-staging-sandbox.sh`. It checks that staging
still has the isolated database/sandbox credentials/worker flags, requires
explicit build-cost approval, builds reviewed New-main, updates **only the
staging API image**, and checks those conditions again. It neither modifies
the inert `examtree-api-background-staging` Job nor executes it. It uses
read-only health/catalogue GETs after deployment.

```bash
cd ~/Functional-Interface
git switch New-main && git pull --ff-only origin New-main
EXAMTREE_STAGING_SANDBOX_REFRESH_APPROVED=yes EXAMTREE_BUDGET_READY=yes \
  bash scripts/refresh-examtree-cloudrun-staging-sandbox.sh
```

Production Render, Cashfree live settings, Cloudflare routing and deployed
Android apps remain unchanged. Prior student + Cashfree sandbox tests do not
need to be repeated unless the changed code materially affects the feature.

**Production cutover remains blocked** until production merchant credentials,
AI provider configuration, a private production candidate, explicit
webhook/worker handover and rollback acceptance are complete.

## Provision the PRIVATE production candidate (separate approval)

The read-only preflight originally reported **2 passed / 3 pending**:
staging isolated, scheduler absent, while the production Cloud Run API and
production background Job did not yet exist. It also found no locally compiled
Pages artifacts in the Cloud Shell checkout. That last result does **not**
establish that the published website has broken API routing; published
Question Studio reads already passed through Pages.

A separate, guarded deployment script now exists:
`scripts/deploy-examtree-api-cloudrun-production-candidate.sh`.

It fails *before any new GCP resources* unless these **four Secret Manager
secrets have enabled versions** (names only; never paste values into chat):

- `examtree-api-database-url` — Neon live MAIN, never the staging snapshot
- `examtree-cashfree-production-client-id` — production merchant, NOT sandbox
- `examtree-cashfree-production-client-secret` — production merchant, NOT sandbox
- `examtree-openai-api-key` — production API-backed AI features

If any is missing, use the official production merchant/provider dashboards
and Secret Manager secure entry to provision it. **Do not** invent credentials,
use sandbox keys as production, copy a service-account JSON key to GitHub,
or expose any key in messages or command output.

To provision after verifying cloud budget and explicitly approving a
PRIVATE staging-independent production candidate, from a clean New-main
Cloud Shell checkout run:

```bash
git switch New-main
git pull --ff-only origin New-main
EXAMTREE_PRODUCTION_CANDIDATE_APPROVED=yes EXAMTREE_BUDGET_READY=yes \
  bash scripts/deploy-examtree-api-cloudrun-production-candidate.sh
```

The script creates or reuses a dedicated **production runtime service account**
and grants only the required Secret Manager access, builds the approved API
image, deploys `examtree-api` with **no unauthenticated invoker**, binds
`EXAMTREE_API_ORIGIN` to the candidate's Cloud Run URL, and defines a distinct
`examtree-api-background` Job with the command `/usr/bin/false` to make it
**inert**. It **does not execute the job, schedule it, register a Cashfree
webhook, switch Cloudflare/DNS, deploy Render, change staging, or release an APK**.
Google Cloud billing may increase. It refuses to overwrite any existing
production Cloud Run API or Job; in a partial deployment, inspect manually
rather than forcing reruns.

Afterward, re-run the read-only inspector:

```bash
python3 scripts/inspect-examtree-cloudrun-production-handover.py
```

The private API requires an IAM-authenticated smoke, independent Firebase
roles review and properly scoped FCM permission for the eventual worker
identity. Those cannot be inferred from the mere presence of a service
definition. The eventual public promotion and job activation are **separate**
cutover decisions.

## Neon production hostname compatibility (2026-10-12)

The initial PRIVATE Cloud Run candidate preflight stopped before making changes:
`examtree-api-database-url` passed database-name and TLS checks but its
hostname was classified `POSSIBLE_PRODUCTION_POOLER`. The validator had
incorrectly allowed only the primary direct Neon endpoint. Neon reports
**four** exact host aliases for the actual live MAIN compute
`ep-polished-king-atj47i5y`: main direct, main pooler, bound compute
`-mkv` direct and bound `-mkv` pooler. The validator now accepts exactly
these four **registered** production hosts while rejecting the staging
branch, prefixes/lookalikes and all unknown Neon hosts. No existing Secret
Manager version or Render credential is overwritten.

This validates branch identity by known endpoint, not database **connectivity**.
Neon currently reports `pooler_enabled=false` on the production compute; a
pooled hostname may not be available for new connections even when it is
registered. If the private Cloud Run candidate fails to establish a live
PostgreSQL session, **do not switch Cloudflare**. First verify the existing
pooled alias against Neon and consider creating a **separate Cloud Run-only
direct connection secret**, rather than modifying any Render/shared backup
database secret. Never change the live Neon role/password for this test.

## Approved phased cutover: student API on Cloud Run, Render temporarily retained

Owner approved a web backend switch **before Cashfree live activation**, with
new purchases disabled. It is a **phased** move, not full Render shutdown:

- The new Cloud Run **production** API uses the existing live Neon MAIN
  database. **Never** route students to isolated `examtree-api-staging`.
- Set `EXAMTREE_PRODUCTION_SALES_PAUSED=yes` so the production API blocks
  canonical and legacy purchase creation before any writes, and the student
  checkout is visibly unavailable.
- Set `EXAMTREE_PRODUCTION_ADMIN_DEFERRED_TO_RENDER=yes` to enable the
  temporary no-AI-key bridge. This mode is permitted only while sales remain
  paused: `EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER=true`.
  Cloudflare keeps **all** `/api/admin/*` endpoints (including Question Studio
  and admin session) on Render, while direct Cloud Run admin routes fail closed.
  No OpenAI production key is required for this **limited student API** mode.
- Cloudflare likewise keeps existing provider webhooks, old-order confirm and
  reconciliation, legacy payment verification and admin finance on Render.
  Purchases are OFF. There are **no live or sandbox Cashfree credentials on
  the Cloud Run production API**.
- Render continues handling existing payment callbacks, the admin panel and
  background polling during the transition. Do **not** stop Render, activate
  a second worker/scheduler, revoke its payment keys, or change Cashfree's
  registered webhook.
- Older Android APKs have embedded Render endpoints. New mobile builds use
  `https://examtree.in/api`; older builds keep using Render until upgraded.

This temporary bridge is suitable only for a phased migration, not the final
claim that Render has been retired. It makes student-facing API service
availability possible without live Cashfree or OpenAI credentials **provided
that the production Cloud Run candidate is built and passes verification**.
AI/admin remains available from Render rather than degrading Question Studio.

From a clean up-to-date `New-main` Cloud Shell checkout after explicit
cost/candidate approval:

```bash
EXAMTREE_PRODUCTION_SALES_PAUSED=yes \
EXAMTREE_PRODUCTION_ADMIN_DEFERRED_TO_RENDER=yes \
EXAMTREE_PRODUCTION_CANDIDATE_APPROVED=yes \
EXAMTREE_BUDGET_READY=yes \
bash scripts/deploy-examtree-api-cloudrun-production-candidate.sh
```

This creates a PRIVATE production `examtree-api` service and an inert
`examtree-api-background` job. It does NOT switch the public API route,
change Render/Cashfree, or start a worker. The only required existing
secret is `examtree-api-database-url`; validation rejects staging Neon.
The script fails rather than overwriting any existing production API/job.

Next, validate the private candidate's authenticated health, catalog
(`salesEnabled:false`), blocked checkout (503 with
`SALES_TEMPORARILY_UNAVAILABLE`), delegated admin requests
(`ADMIN_HANDLED_BY_RENDER_DURING_CUTOVER`), Firebase permissions, and
no worker execution. Prove the Cloudflare Pages deployment includes its
staging-host reject rule and temporary Render admin/payment bypass.
**Only then**, authorize public invoker and update the Pages Production
`EXAMTREE_API_UPSTREAM_ORIGIN` to the verified dedicated `examtree-api`
production URL. Independently recheck live endpoints and rollback.

Rollback: clear that Pages variable to restore Render immediately; avoid
changing Neon or worker settings during rollback. The payment/admin Render
bypass must be removed only at a **later** production merchant/AI cutover,
with its own verification and plan.

## One-command private candidate acceptance (2026-10-12)

The `examtree-api` production candidate exists, has a private Cloud Run
invoker policy, and is separate from the isolated `examtree-api-staging`.
**A deployed revision is NOT proof of live Neon connectivity.**

Run the following **read-only and non-mutating** acceptance gate using Cloud
Shell's authenticated Cloud Run proxy:

```bash
cd ~/Functional-Interface
git switch New-main && git pull --ff-only origin New-main
gcloud config set project sarbedutech
bash scripts/verify-examtree-cloudrun-production-private.sh
```

The script checks the existing private service and inert background job,
Firebase project, worker-off settings, Neon MAIN Secret Manager reference,
sales disabled and admin delegated, absence of public invoker and scheduler,
and that the latest production revision is ready. It then starts a local
`gcloud run services proxy` for authenticated access to the **private**
production service; verifies `GET /health`, live Neon catalog
`GET /api/commerce/products` with `salesEnabled:false`, blocked anonymous
empty-body `POST /api/commerce/orders` (503 before any order write), and
rejected direct Cloud Run `GET /api/admin/session` (503, leaving admin on
Render). The script stops its proxy automatically and never displays tokens,
credentials, customer data or catalog contents. It cannot issue real orders,
execute workers, or change production routing.

Any failure = **NO CUTOVER**. In particular a recognized Neon pooler hostname
does not establish DB connectivity until `/api/commerce/products` returns
HTTP 200 from the production Cloud Run service.

Once this gate passes, separately verify authenticated student test reads
via the PRIVATE production candidate using a fresh disposable-student Firebase
ID token, and confirm live Cloudflare Pages has the checked-in admin/payment
Render bypass. Only then consider a controlled public invoker change and
same-domain Cloudflare production upstream override. Never switch public
traffic merely because Cloud Build or `/health` passed.

## Authenticated student HTTP 401 investigation (2026-10-12)

After the private production preflight passed, the first disposable-student
Firebase read check returned `HTTP 401` at `GET /api/users/me/profile`.
No Cloudflare routing changed, and no mutation was attempted. This is **not**
proof the production API can authenticate students. The previous script
tested the application token through `gcloud run services proxy`, which
also attaches Cloud Run IAM authentication and can interfere with the
application's Authorization header. An expired ID token, wrong Firebase
project, missing production service account Firebase permission or revoked
student session are also possible causes.

The next revision of
`scripts/verify-examtree-cloudrun-production-student-auth.sh` requires
an **up-to-date** ID token for an **already-used disposable student** and
does a local, non-cryptographic JWT audience/expiration check before any
request. Google's Cloud Run IAM token is sent explicitly as
`X-Serverless-Authorization`; the **original** Firebase JWT remains in
`Authorization`. This separation is documented by Cloud Run. The backend
still performs all signature/revocation checks. The tester logs only an HTTP
status and safe API `code` if a request fails; never display JWT values,
emails, names or full responses.

Run from Cloud Shell with newly refreshed test-user token, paste only into
hidden prompt:

```bash
cd ~/Functional-Interface
git switch New-main && git pull --ff-only origin New-main
gcloud config set project sarbedutech
bash scripts/verify-examtree-cloudrun-production-student-auth.sh
```

If `AUTH_TOKEN_INVALID` persists after a refreshed valid-audience token,
investigate the dedicated production Cloud Run service account's ability to
perform Firebase revocation lookups (`verifyIdToken(token, true)` uses a
Firebase Auth account lookup), including Cloud Logging. Do not relax token
validation, create a new production account, or change the live frontend
route merely to pass the smoke.

## Student account acceptance after private production catalog gate (2026-10-12)

The owner ran `bash scripts/verify-examtree-cloudrun-production-private.sh`
against deployed revision `examtree-api-00002-mch`, image
`0125146f0254f1f2`. All results passed: private IAM, inert job,
absent scheduler, /health 200, MAIN Neon-backed catalogue HTTP 200 with
`salesEnabled:false` and one product, empty anonymous order blocked 503,
and direct admin delegated 503. Public Cloudflare routing was unchanged.

**Next run the existing disposable-student, hidden-token GET-only check:**

```bash
cd ~/Functional-Interface
git switch New-main && git pull --ff-only origin New-main
gcloud config set project sarbedutech
bash scripts/verify-examtree-cloudrun-production-student-auth.sh
```

Use an **already used disposable student account**, never a superadmin,
real paying customer or a new signup. Paste the Firebase ID token into the
hidden Cloud Shell prompt, never in chat. The script starts and stops an
authenticated local proxy; it checks structured student profile and purchases
GET responses, and that direct admin remains delegated. It never requests
refunds, attempts, purchase creation, workers, Firebase secret values, or
public Cloud Run invocation changes. Some Firebase middleware updates the
user-to-Neon identity mapping during GET; this is why only an existing
disposable student may be used.

Only if it passes, independently verify Cloudflare proxy routes all
`/api/admin/*`, legacy Cashfree/Razorpay verification, existing-order
confirm/reconcile, and webhooks to Render; verify production Pages has
deployed the matching function code. Public Cloud Run access is **not**
configured yet. Do not set `EXAMTREE_API_UPSTREAM_ORIGIN` on `examtree.in`
until Cloud Run's public invoker policy is ready and origin controls, JWT
authorization, Firebase student reads, rollback steps, and smoke tests are
all validated. Keep payment purchases disabled, and keep Render live as the
temporary admin, finance, and old-Android backend. The student API phase
**is not** a complete Render shutdown.

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
