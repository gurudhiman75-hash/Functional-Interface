# Examtree: Admin & deterministic Question Studio Cloud Run pilot, no OpenAI key

## Result and scope

This is a **no-provider**, staged handover. The existing production workers `examtree-trg002-prod` and `examtree-generation-prod` are already deployed and tested independently. Cloud Run `examtree-api` continues to serve student traffic; the normal website's admin routes currently stay on Render.

The new `EXAMTREE_ADMIN_DETERMINISTIC_ONLY=true` backend flag is permitted **only** when production sales and background workers are off, and the admin delegation flag is false. It bypasses the otherwise strict production AI startup validation solely for this configuration.

The matching Cloudflare Pages **Production** value will eventually be `EXAMTREE_ADMIN_UPSTREAM=cloud-run-deterministic` (distinct from full `cloud-run`). This routes ONLY:

- `/api/admin/session` and descendant paths
- `/api/admin/question-studio` and descendant paths

to the validated production Cloud Run API. The rest of `/api/admin/*`, including **all Notes Studio and Current Affairs**, remains on Render. Commerce / finance, Cashfree webhooks, and old order reconciliation stay on Render. Direct run.app attempts to invoke unsupported admin/AI routes fail closed, independent of Cloudflare. This does not claim all admin APIs have migrated.

## First production operation: create a zero-traffic admin revision

Review budget/alerts for Cloud Build and Cloud Run, then use Cloud Shell:

```bash
cd ~/Functional-Interface
git switch New-main
git pull --ff-only origin New-main
gcloud config set project sarbedutech

EXAMTREE_BUDGET_READY=yes EXAMTREE_PRODUCTION_ADMIN_CANARY_APPROVED=yes \
  bash scripts/deploy-examtree-cloudrun-admin-noai-zero-traffic.sh
```

The script:

1. Asserts the existing live service is production Cloud Run, sales-disabled, admin-delegated-to-Render, without AI/payment keys, that worker flags are off, and that all student traffic currently targets the healthy revision.
2. Verifies existing production TRG-002 and shared workers and production worker secret; it does not redeploy or trigger compute workers.
3. Builds a new API image on the current `New-main`, grants only worker-secret access to the API service account, and deploys a tagged `admin-candidate` revision with **0% traffic**. It does not require any AI provider key.
4. Verifies old student revision still gets 100% traffic, candidate 0%, candidate /health 200, anonymous Question Studio denial 401, direct finance denial 503, direct Notes Studio / Current Affairs / student-management admin denial 503, and student catalogue GET 200 with purchases disabled.
5. Prints the tagged `CANDIDATE_URL`. Save the URL, not secrets or tokens.

**Do not use the earlier `deploy-examtree-cloudrun-admin-zero-traffic.sh`** for this pilot: it intentionally requires OpenAI. No provider key is required for the new `...-admin-noai-zero-traffic.sh`.

If the script fails after a partial deploy, inspect the revision and build logs before retrying. Existing student traffic remains pinned unless an unrelated operator explicitly moves it.

## Authenticated acceptance (read-only)

Use an existing superadmin Firebase ID token, entered interactively into Cloud Shell (hidden); never paste a token into chat:

```bash
bash scripts/verify-examtree-cloudrun-admin-noai-tagged-readonly.sh
```

Verify:
- `GET /api/admin/question-studio/capabilities` 200, with proper package CP/language/review metadata.
- `GET /api/admin/question-studio/review-page?page=1&pageSize=1` 200.
- Anonymous access is 401; an ordinary student must be denied 403 (test separately using their own disposable token).
- Direct tagged `/api/admin/notes-studio-v2/*`, `/api/admin/current-affairs/*`, non-whitelisted admin areas, and `/api/admin/commerce/*` return fail-closed 503 and never exercise those handlers.

If authorized, optionally test creation of 1/3 review-only TRG-002 and NUM-001 runs via the canonical admin API and verify Neon records and review statuses. This **writes review-only data** and must not be done without explicit approval. It must not publish any content, call Cashfree, or start workers/outbox publishers.

## Promotion (ONLY after acceptance, not automatic)

After checking the actual tagged revision name and rollback point, update Cloud Run production traffic to the verified admin-capable revision (do not use `--to-latest` casually), and confirm student API, auth, catalog and sales-disabled gates. The Cloudflare Pages upstream origin stays the existing `examtree-api` service URL. Then set Pages **Production** `EXAMTREE_ADMIN_UPSTREAM=cloud-run-deterministic` and redeploy Pages. Verify through `examtree.in` that session and Question Studio go to Cloud Run while Notes Studio, admin finance, Current Affairs and other unverified admin features remain on Render.

On failure: set Pages `EXAMTREE_ADMIN_UPSTREAM=render` (or remove it) and redeploy; then route the Cloud Run service back to the previously serving student revision if needed. Never turn off Render at this stage.

## Not yet migrated

Notes Studio AI and ingestion, Current Affairs AI, all other unverified admin APIs, Cashfree refunds/webhooks/orders, old Android direct Render calls, and scheduled background workers. A true **full-admin** cutover requires provider configuration or per-feature routing and acceptance.
