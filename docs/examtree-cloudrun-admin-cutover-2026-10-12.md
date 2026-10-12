# ExamTree admin API cutover — controlled handover (12 October 2026)

## Scope and current behavior

Student-facing Pages `/api` is routed to public production Cloud Run. Existing `/api/admin/*` still routes to Render. Production Cloud Run denies direct admin requests with `ADMIN_HANDLED_BY_RENDER_DURING_CUTOVER` while `EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER=true`. Purchase creation remains disabled in Cloud Run.

This change **does not promote the admin API by merging**. Pages uses an independent flag: `EXAMTREE_ADMIN_UPSTREAM=cloud-run`. Absent/empty/unknown values keep all admin on Render. `/api/admin/commerce/*` and all existing provider webhooks and old-order reconciliation remain on Render even after admin promotion. The production Cloud Run API additionally rejects direct finance admin calls while new sales remain paused.

## Preflight — required before deployment

1. Use Cloud Shell on `sarbedutech`, region `asia-south1`. Pull the reviewed New-main branch. Run `bash scripts/preflight-examtree-cloudrun-admin-cutover.sh`. It performs read-only checks of the live Neon MAIN secret mapping, Ready revision, disabled sales and workers, and whether `examtree-openai-api-key` has an enabled Secret Manager version. It **never reveals** the API key.
2. If the secret is missing, create a **new production** Secret Manager secret using secure Cloud Console entry. Never paste the key into GitHub, chat, logs, Cloudflare, or the shell command line. Do not reuse sandbox/provisional provider credentials.
3. Verify production runtime service account `examtree-api-prod-runtime@sarbedutech.iam.gserviceaccount.com` has `roles/secretmanager.secretAccessor` for the new secret. Confirm additional IAM permissions for Firebase Authentication, Storage and FCM features actually used by admin routes; do not grant broad project-wide access.
4. Ensure the latest production API image includes the backend finance fail-closed guard from this change. Create a reviewed, tagged admin-capable revision using that image, Secret Manager mapping `OPENAI_API_KEY=examtree-openai-api-key:latest`, `AI_EXTRACTION_PROVIDER=openai`, and `EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER=false`. **Retain** `EXAMTREE_SALES_DISABLED=true`, `EXAMTREE_PAYMENT_PROVIDER=none`, `GENERATION_JOB_WORKER_ENABLED=false`, `OUTBOX_PUBLISHER_ENABLED=false`, and the exact live-main Neon database secret mapping. Do not run the inert background job or update Cashfree webhooks. Roll out with no traffic/targeted revision tests first when feasible; do not overwrite working student traffic unverified.

## Admin acceptance

With an **existing** authorized admin Firebase token (enter securely in Cloud Shell, never paste into chat), test the admin-capable Cloud Run revision directly:

- `GET /api/admin/question-studio/capabilities` returns authenticated JSON for an admin with matching rights; a regular student receives 403, and anonymous access receives 401.
- `GET /api/admin/question-studio/review-page` loads expected review data under current permission scoping and no-store response caching.
- Check admin session and the main admin pages for superadmin RBAC, Firebase permissions, Neon schema access, media/Storage, Notes Studio AI configuration, and Quick Question Studio generation-worker references.
- Verify no role-bypass, no preview-only data, no background publisher execution, no new purchases, and that direct `/api/admin/commerce/orders` returns `FINANCE_HANDLED_BY_RENDER_DURING_CUTOVER` (503).
- If a write-backed acceptance test is essential, use an existing disposable admin/test record and require explicit approval before creating any run, publishing any question, changing a role, sending notifications, or touching finance.

After all direct admin checks pass, set Cloudflare Pages **Production** environment variable
`EXAMTREE_ADMIN_UPSTREAM=cloud-run` on project `functional-interface`, keeping
`EXAMTREE_API_UPSTREAM_ORIGIN=https://examtree-api-1083299267005.asia-south1.run.app`.
Trigger a production Pages redeploy and verify the new deployment contains BOTH bindings.
Recheck `https://examtree.in/admin`, `/admin/login`, Question Studio, Notes Studio,
content and student operations. Finance routes must still resolve to Render.

## Rollback

First remove `EXAMTREE_ADMIN_UPSTREAM` (or set to `render`) in Cloudflare Pages Production, **then redeploy Pages**. Admin immediately routes back to Render; existing student routes remain on Cloud Run. Only then revert/disable the new Cloud Run admin revision if needed. Do not remove the student upstream variable, disable Render, activate sales, rotate merchant keys, execute a scheduled job, or alter Neon schemas during this rollback.

## Final closure conditions

`Admin live on Cloud Run` can be reported only after authenticated admin session, RBAC-denial, Question Studio/Notes Studio and media checks succeed through the public `examtree.in` Pages route and rollback is tested. Until then this is **prepared, not cut over**. Cashfree/finance, workers and old Android remain separate migration phases.
