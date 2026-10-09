# Question Studio compute isolation — initial low-budget rollout

**Scope:** TRG-002 (Trigonometry — Heights & Distances) generation. Other Question Studio packages still use their existing handlers; this is not a claim that all chapters have been migrated.

## Why this exists

- The public Render Free API has a 512 MiB memory limit and ~0.15 CPU. A Node worker thread does **not** have an independent container memory limit: the worker and the API can still exhaust the same 512 MiB.
- The Quant exam-profile planner generates up to twice the requested candidate count and ranks candidates before persisting the final questions. Changing the final count from five to three does not eliminate chapter-import startup cost.
- Render health-check timeouts occurred on October 8 even for non-generation paths; PostgreSQL reachability must be audited separately.
- The legacy pattern generation-job poller is a separate subsystem from Question Studio and was logging that the public `generation_jobs` relation did not exist. It now defaults to **off** in production API processes (opt in only with `GENERATION_JOB_WORKER_ENABLED=true` after a schema check and a separate worker allocation).

## Architecture and isolation boundary

1. An authenticated administrator sends the **unchanged** `POST /api/admin/question-studio/runs` TRG-002 request.
2. The normal API route validates auth, RBAC, CPs, language, difficulty, count and lifecycle rules. **The API retains DB writes and review provenance.**
3. If `QUESTION_STUDIO_TRG002_WORKER_URL` is **not** set, it uses the existing local worker thread (backward-compatible; still subject to 512 MiB).
4. If the URL **is** set, API calls `POST /internal/trg002/generate` on a dedicated Cloud Run service, with `X-Examtree-Worker-Token`. There is **no fallback** to the local worker if remote compute fails: a fallback could OOM the public API.
5. Cloud Run handles one generation request per instance, inside its own worker thread and its own 2 GiB container allocation. It has no DB credentials, Firebase credentials, or payment credentials. It returns a batch to the API, which commits the existing atomic review records.
6. The API and worker report count, elapsed time and memory (RSS). The worker also measures startup, authority import and generation phases. No question text, student information or secrets are logged.

## Required configuration

**Remote Cloud Run service**

- Container: `Dockerfile.question-studio-worker` at the repo root.
- Cloud Run region: Mumbai (`asia-south1`) is the preferred starting point for an India-first product; keep regional network costs in mind.
- Initially: 1 vCPU, **2 GiB RAM**, concurrency **1**, minimum instances **0**, maximum instances **1**, request timeout **180 seconds**.
- Secret environment variable `QUESTION_STUDIO_WORKER_TOKEN` (at least 32 random characters), stored in Secret Manager or another secure secret mechanism. Never put it in source or a `VITE_*` variable.
- The worker offers `GET /health` and authenticated `POST /internal/trg002/generate`. Everything else is 404.

**Student API (Render, until its own migration)**

- `QUESTION_STUDIO_TRG002_WORKER_URL=https://YOUR-WORKER-URL`
- `QUESTION_STUDIO_WORKER_TOKEN=` the same secret, supplied through Render's private environment configuration
- `GENERATION_JOB_WORKER_ENABLED=false` (or unset) in production
- Keep existing Neon/Firebase/Cashfree secrets **only** on the API; do not copy them to Cloud Run compute.

The current worker uses application-level token authentication over HTTPS. With a public Cloud Run endpoint, any caller can reach the health route, but unauthorized generation is denied. Stronger future deployment: private Cloud Run IAM invocation with API-issued Google ID tokens, after the API is migrated to Google Cloud. Never send a worker token over HTTP outside localhost.

## Build and deployment outline

1. Create a private Docker/Artifact Registry repository in Google Cloud, with billing budget alerts configured **before** builds. Cloud Build, Artifact Registry storage, egress, logs and running workloads can incur charges even when Cloud Run requests qualify for its monthly free allocation.
2. Build an image with:
   `docker build -f Dockerfile.question-studio-worker -t <registry>/examtree/trg002-worker:<version> .`
3. Push the image with `docker push <registry>/examtree/trg002-worker:<version>`.
4. Deploy to Cloud Run with the resource limits described above, mapping the token as a secret. For example:
   `gcloud run deploy examtree-trg002-worker --image <registry>/examtree/trg002-worker:<version> --region asia-south1 --cpu 1 --memory 2Gi --concurrency 1 --min-instances 0 --max-instances 1 --timeout 180`
   Decide access policy explicitly: the present client uses the application token; it does not yet sign Google IAM identity tokens. A restricted ingress/IAM setup will require a matching client auth implementation.
5. Verify `/health`, then send a **staging** one-question and three-question generation request using the existing authenticated admin UI. Check the TRG-002 package, correct count, review items, difficulty and lifecycle flags, deterministic replay and request audit events.
6. Check API RSS vs worker RSS/latency in logs and simulate a remote failure; the API must return a controlled error without running the local thread or crashing students' exam sessions.
7. Only after the staging checks pass, set the two remote env vars on the production API. To roll back, remove `QUESTION_STUDIO_TRG002_WORKER_URL` (this returns TRG-002 to its original, memory-risky local thread), or temporarily disable admin generation. Do **not** move student traffic or payment webhooks in this rollout.

## Verification

- Lightweight local contract tests: `node --test artifacts/api-server/tests/trg002-worker-service.test.mjs`.
- Standalone worker build: `node artifacts/api-server/build-trg002-worker.mjs` (requires workspace dependencies).
- The existing API runtime build still smoke-tests a one-question TRG-002 compiled worker.
- Test a **three-question** real run on the compute service before considering this production-ready.
- Inspect `trg002_worker_memory` logs for `startup`, `authority_loaded`, `batch_ready`, not just the API request duration.
- The Render build now tests worker syntax and access validation without generating real questions.
- Do not assume 2 GiB is always necessary: reduce to 1 GiB only after profiling shows sufficient peak headroom. Do not introduce a hard 512 MiB V8 heap flag as a substitute for proper isolation.

## Follow-up phases (not included in this PR)

- Generalize the compute protocol for all registered Question Studio engines and specialized chapter routes. Retain their distinct lifecycle/review policies; do not route every chapter through TRG-002.
- Replace synchronous long-running HTTP generation with a durable, idempotent queue and `202 + jobId` status/progress. The old `generation_jobs` table belongs to the **separate** pattern generator and must not be confused with `content.generation_runs` review records.
- Add job deduplication, retries, timeouts, cancellation and a dead-letter strategy before allowing several cloud instances.
- Move frontend static hosting to Cloudflare Pages and keep the student API separate from the admin-generation service if needed. Test Neon connection latency and pool sizing from the chosen region.

## October 2026 — one-command staging workflow

A guarded staging script and dedicated Cloud Build configuration have been added:

- `cloudbuild.trg002.yaml` — builds the compute-only Dockerfile, not the student/admin/API server.
- `scripts/deploy-trg002-cloudrun-staging.sh` — creates a dedicated minimal runtime identity, protected Secret Manager token, Mumbai Artifact Registry and the **staging** Cloud Run service; deploys with 2 GiB, 1 vCPU, min 0, max 1, concurrency 1; checks that unauthenticated generation is rejected and that one- and three-question generation both work.
- The normal production-build smoke now also generates **three questions**, catching simple capacity regressions before deployment.

**Preconditions (interactive Google Cloud Shell):**

1. Select your intended Google Cloud project and enable billing. Create a budget and email alerts under **Billing → Budgets & alerts**. Where available, configure an eligible Cloud Run spend-cap budget. Budget alerts alone are not spending caps.
2. If this is the Firebase project's underlying Google Cloud project, confirm its billing scope and existing services before choosing it; you may prefer a dedicated project to isolate expenditure.
3. Ensure your current Google identity can create Cloud Run services, create Secret Manager secrets/service accounts, enable APIs and submit Cloud Builds. Cloud Build's service account must be allowed to push images to Artifact Registry (e.g. `roles/artifactregistry.writer`).
4. Open Google Cloud Shell, clone the latest **New-main** repository using your normal GitHub authorization, then from the repository root run:

```bash
EXAMTREE_BUDGET_READY=yes bash scripts/deploy-trg002-cloudrun-staging.sh YOUR_GOOGLE_CLOUD_PROJECT_ID
```

The script is **manual**, not triggered by git merges. It uploads source to Cloud Build (build charges/storage may apply), creates/uses a dedicated secret, and prints the staging HTTPS URL after authentication and generation checks. It does not alter your Render environment variables or production routing. Run it only after reviewing any expected Google charges and permissions.

**Credential handoff:** The API and Cloud Run must use the same `QUESTION_STUDIO_WORKER_TOKEN`. Retrieve it directly inside your authenticated Google Cloud Shell or use a secure secret-delivery mechanism to populate Render's private environment settings; never place it in a GitHub source file, frontend Vite environment variable, terminal transcript sent to another user, or this chat. Add `QUESTION_STUDIO_TRG002_WORKER_URL` only after the staging review/storage tests have passed.

**Important:** The worker deliberately uses an application token over HTTPS and enables public Cloud Run ingress for compatibility with Render. Unauthorized compute is rejected before heavy authority import. A future version should use native Cloud Run IAM / short-lived identity tokens rather than a shared token, if the API moves to Google Cloud or workload identity can be established.
