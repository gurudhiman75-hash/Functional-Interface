# Examtree QS production universal worker — build-only, no activation

Date: 2026-10-15. Project `sarbedutech`; region `asia-south1`.

## What changed
- Add a production-only wrapper and `Dockerfile.examtree-qs-prod-universal-worker` around the existing deterministic universal generator. The worker remains **compute-only**, receives no `DATABASE_URL`, Firebase or Cashfree credentials, and writes no student questions.
- With `EXAMTREE_QS_PRODUCTION_WORKER_APPROVED` unset or false the process starts safely on port 8080, returns `GET /health` 200 with `ready:false`, and returns HTTP 503 for all other routes. No worker token or Neon URL is needed to boot.
- Even with approval true, the image rejects non-production service name, staging flags or a database URL and requires a dedicated production worker shared secret. Do **not** set approval true without live IAM/cost/security checks.
- Only the independently gated `examtree-qs-receiver-prod` task receiver sends an additional Google-signed Cloud Run **ID token** to the production worker, using the Cloud Run metadata server and the exact worker service URL as audience. Fail closed on wrong service, staging runtime, missing authorization or Google metadata errors. The existing staging client continues sending the application worker token only.
- The receiver also sends its separate `X-Examtree-Worker-Token` application credential; the worker checks it as before. This is defense-in-depth **with private Cloud Run IAM**.
- `cloudbuild.examtree-qs-prod-universal-worker.yaml` only builds and pushes an image and does not modify GCP services, tasks, scheduler, IAM, secrets or databases.

## Controlled future deployment
1. Build from `New-main` using the production Dockerfile and a new tag under `asia-south1-docker.pkg.dev/sarbedutech/examtree-qs-prod-builds/examtree-universal-prod:<immutable-tag>`. Do not copy the existing staging image tag into production.
2. Create a separate service `examtree-universal-prod`, location `asia-south1`, dedicated **runtime** service account e.g. `examtree-qs-worker-prod@sarbedutech.iam.gserviceaccount.com`, port 8080, memory **2Gi** and concurrency 1, max instances 1. Use **Require authentication**, not public access.
3. Initially set `EXAMTREE_QS_PRODUCTION_WORKER_APPROVED=false`, no worker token secret, no `DATABASE_URL`. Verify Cloud Run Ready and health-only result from within an appropriately authenticated operator context. Never treat health status alone as task-readiness.
4. Grant `roles/run.invoker` on **this worker service only** to `examtree-qs-receiver-prod@sarbedutech.iam.gserviceaccount.com`. Do not grant invoker at project level; do not grant `allUsers` or `allAuthenticatedUsers`.
5. Before any active generation, create a distinct production worker token in Secret Manager. Grant only the dedicated production worker runtime identity and receiver runtime identity the least needed secret accessor permissions on this secret, and verify it is not the staging worker token. Both receiver and worker must agree on the value and use Secret Manager bindings; never paste tokens into GitHub or chat.
6. Verify production Neon schema/migration and backups separately; receiver must be the **only** component with DB access. Existing `main` lacks async task lease and enqueue idempotency tables.
7. Explicit acceptance approval, signed/OIDC invocation, one disposable canary to Review, load/soak/budget checks and UI state management are still required. Keep `examtree-qs-prod` **PAUSED**, `examtree-qs-dispatch-prod` unexecuted and all production approvals false until independent confirmation. No production scheduler or automatic student publication.

**This PR is code/build only. It does not deploy or activate production generation.**
