# Examtree: retire Render only after full Cloud Run handover

Status: **implementation guardrails and test plan, NOT permission to turn on live sales or remove Render**.

## Current verified routing (2026-10-31)

- Cloudflare Pages `functional-interface`, `New-main`, serves `examtree.in`.
- Student API reaches Cloud Run `examtree-api` in `sarbedutech/asia-south1`, production traffic on `examtree-api-00025-xhd`.
- The current Cloud Run revision intentionally has `EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER=true`, `EXAMTREE_SALES_DISABLED=true`, `EXAMTREE_PAYMENT_PROVIDER=none`, `GENERATION_JOB_WORKER_ENABLED=false` and `OUTBOX_PUBLISHER_ENABLED=false`.
- Cloudflare production `EXAMTREE_ADMIN_UPSTREAM=cloud-run-deterministic` sends **admin bootstrap** to Cloud Run where the existing guard rejects it (503). Fix the admin-capable backend before enabling the public admin flag; don't mistake it for an RBAC failure.
- `/api/admin/commerce/*`, legacy payment webhooks/reconciliation and many admin routes still use Render.
- An older revision tag `qs-chapter-6f96fb3441` is in use. Do not repoint, remove, or change its Cloud Tasks/dispatcher targets.
- Neon policy migration and public free/premium access checks passed. Authenticated premium entitlement and administrative workflows are still unverified.

## Gate A: all *nonfinancial* administrator routes

1. Verify the actual production image digest and traffic, secret references (never log values), IAM, Firebase Auth, Storage, Notes Studio/AI dependencies, Question Studio worker URLs, database connection, and available memory.
2. Provision/verify narrowly scoped Cloud Run runtime secret access for production OpenAI/other required admin providers. Do **not** put credentials in environment-variable plaintext, GitHub or Cloudflare.
3. Build the reviewed `New-main` image. Create a **zero-traffic** tagged admin candidate with `EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER=false` and **without** `EXAMTREE_ADMIN_DETERMINISTIC_ONLY=true`; retain `EXAMTREE_SALES_DISABLED=true`, `EXAMTREE_PAYMENT_PROVIDER=none`, the live-main Neon secret, and all disabled worker/queue flags.
4. Test the tagged URL with an existing authorized Firebase administrator: session bootstrap, RBAC/denials, Questions, Tests, Test Series, packages, access-policy read, Notes Studio, Current Affairs, media operations. Use read-only operations first; writes require separate explicit release approval.
5. Confirm old student public routes, private IAM and required authentication; prove fail-closed `/api/admin/commerce/*` and merchant paths on the sales-paused candidate.
6. Route Pages `EXAMTREE_ADMIN_UPSTREAM=cloud-run` **only after the verified admin-capable image serves normal Cloud Run traffic**. A production Pages redeploy is needed for the env value. The separate finance bridge stays on Render. Verify `/admin/login` and all admin workspaces. Roll back the Pages variable on failure.

## Gate B: payments and finance (separate merchant release)

1. Inventory the *actual* provider/webhook registrations, Cashfree live merchant mode, existing pending orders, refunds/reconciliation, legacy Razorpay paths, and all outgoing `notify_url` definitions. Ensure no existing callbacks are lost.
2. Verify GCP Secret Manager mappings for `CASHFREE_CLIENT_ID`, `CASHFREE_CLIENT_SECRET`, any existing Razorpay keys still required for historical order reconciliation and webhook signature verification; do not reveal values.
3. Exercise the candidate in an **isolated** database with Cashfree sandbox, including signature validation, duplicate/replayed notifications, retry handling, idempotent finalization, refunds, partial failures and out-of-order notifications. No production purchase or order mutation during this gate.
4. Only after production merchant readiness and signed-off rollout, provision a zero-traffic Cloud Run candidate with `EXAMTREE_FINANCE_CLOUDRUN_APPROVED=true`, `EXAMTREE_PAYMENT_PROVIDER=cashfree` and `EXAMTREE_SALES_DISABLED=false`. Preserve all Question Studio disabled flags and the current DB secret.
5. Verify payment route responses, auth/RBAC, signature controls, idempotency, and a guarded rollback procedure. Coordinate callback cutover: exactly one payment processor must own each provider notification and reconciliation action. Historical orders and grants remain unchanged.
6. The new independent Pages flag `EXAMTREE_FINANCE_UPSTREAM=cloud-run` is **OFF by default**. Set it only after all of the above is verified and the corresponding Cloud Run revision is healthy. Keep `EXAMTREE_ADMIN_UPSTREAM=cloud-run` explicitly.
7. Only after sustained monitoring, old-order replay/reconciliation, and all Render path inventory is empty may Render be retired. Do not auto-disable an old webhook receiver simply because API traffic moved.

## Gate C: remaining infrastructure and shutdown

- Audit `/api/*` Cloudflare forwarding, all external mobile/API clients, webhook targets, scheduled jobs, private worker-to-worker calls, service accounts, secrets, Firebase files/storage and email/notification providers.
- Restore/admin user access and verify full RBAC. Confirm a non-admin cannot bootstrap.
- Validate Question Studio generation, queues, workers, scheduler, rollback and zero side effects from migration. Enabling any queue is a **separate** action.
- Verify production Neon backups and rollback points.
- Measure error rates and payment webhook 2xx rates after cutover. Preserve old revision and Render as fallback until the acceptance window ends.

## Rollback boundaries

- Admin failure: revert Pages admin upstream to Render and redeploy Pages, **without** changing student Cloud Run traffic.
- Finance failure: revert Pages finance upstream to Render, coordinate provider notifications so no callback is processed twice, and monitor pending orders.
- API failure: shift normal Cloud Run traffic to the previously verified revision only after inspecting its status and compatibility with the current DB; keep the Question Studio tagged revision untouched.

## Not authorized by this change

This PR changes routing capabilities and tests but does not deploy Cloud Run, change Pages production variables, enable sales, retarget webhooks, modify Neon data, resume a queue, or retire Render.
