# Examtree — finish non-financial admin on Cloud Run

Status: manual scripts prepared, not yet executed. No production routing switch is implied by merging these scripts.

## Order

All commands are for existing project `sarbedutech`, region `asia-south1`, checked out on clean and current `New-main`. Budget/alerts must already be reviewed.

### A. Deploy production deterministic Question Studio workers

```bash
cd ~/Functional-Interface
git switch New-main
git pull --ff-only origin New-main
gcloud config set project sarbedutech
EXAMTREE_BUDGET_READY=yes EXAMTREE_PRODUCTION_WORKERS_APPROVED=yes \
  bash scripts/deploy-examtree-cloudrun-production-question-workers.sh
```

The script builds two independent 2 GiB / 1 vCPU worker services and creates an isolated production worker token in Secret Manager. It checks health, rejects anonymous generation, and generates 1/3 deterministic questions in memory for TRG-002 and NUM-001 with no Neon credentials. It does **not** change the student or admin API, Render, Cloudflare or payment routes.

If partial deployment fails, do not rerun indiscriminately; inspect the created service and contact support for a targeted recovery.

### B. Transfer existing AI provider key securely

```bash
bash scripts/configure-examtree-cloudrun-admin-provider-secret.sh
bash scripts/preflight-examtree-cloudrun-admin-cutover.sh
```

The one-time script uses an interactive hidden prompt to create `examtree-openai-api-key`. It never prints the key or stores it in GitHub. The key can be reused **if it is an existing authorized OpenAI API key**; a Render deployment configured with Gemini, DeepSeek, or Claude does not automatically provide an OpenAI key.

No key or Firebase token should be pasted into chat, screenshots, terminal logs or GitHub.

### C. Deploy tagged admin candidate, with ZERO website traffic

```bash
EXAMTREE_BUDGET_READY=yes EXAMTREE_PRODUCTION_ADMIN_CANARY_APPROVED=yes \
  bash scripts/deploy-examtree-cloudrun-admin-zero-traffic.sh
```

This script verifies student traffic is 100% on the previous healthy revision, builds a reviewed image, pins the old revision's 100% traffic, and tags `admin-candidate` with 0%. It injects existing Neon main, OpenAI and production worker Secret Manager references; payments remain disabled, outbox and background jobs remain disabled. It verifies `/health` 200, anonymous Question Studio 401, direct finance 503, catalog 200 with sales disabled, and unchanged student traffic.

**This is not the public switch.** It prints a `CANDIDATE_URL` for authorized read-only tests.

### D. Acceptance before cutover

Run the guarded read-only acceptance script in Cloud Shell. It discovers the candidate's 0%-traffic tag itself and prompts for a fresh superadmin ID token without displaying it:

```bash
bash scripts/verify-examtree-cloudrun-admin-tagged-readonly.sh
```

With an existing disposable superadmin account and a fresh Firebase ID token, also verify:
- Read-only `GET /api/admin/question-studio/capabilities` and `GET /api/admin/question-studio/review-page` (200); student account (403), anonymous (401).
- Admin bootstrap and RBAC, Notes Studio read, student/exam management read, Storage media permissions.
- Finance always returns 503 direct Cloud Run and stays Render-proxied through Cloudflare.
- Approved disposable review-only TRG-002 and NUM-001 generation: 1 then 3, only after explicit user authorization for database writes. Review lifecycle remains isolated; no publication or outbox dispatch.
- Check latest Cloud Run logs for memory, 401/403, DB TLS and provider errors.

Only after these pass, promote candidate Cloud Run revision deliberately with `gcloud run services update-traffic examtree-api --to-revisions=REVISION=100` using its **verified exact revision name**, then set Cloudflare Pages Production `EXAMTREE_ADMIN_UPSTREAM=cloud-run` and redeploy Pages. Never use `--to-latest` blindly. Test through `examtree.in` and prepare quick Pages rollback to `render`.

## Explicitly NOT migrated

Cashfree webhooks, orders, refunds, payment reconciliation, background scheduled jobs, and old Android direct-Render builds are excluded. Render cannot be shut down merely because the admin phase passes.
