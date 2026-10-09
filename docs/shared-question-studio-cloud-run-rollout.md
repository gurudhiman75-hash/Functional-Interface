# Examtree shared Question Studio Cloud Run — Stage 1 (NUM-001 + TRG-002)

## Goal
Use **one** Cloud Run scale-to-zero service for isolated, approved Question Studio compute. The first stage adds **NUM-001** (Number Structure, Divisibility, Factors, HCF/LCM) alongside **TRG-002** (Heights & Distances). NUM-002's governed CP008–CP014 runtimes, all other Quant, Reasoning, English, and Static GK remain *planned* and are **not** silently rerouted.

## Architecture
1. Authenticated admin POST `/api/admin/question-studio/runs`.
2. Render API still owns Firebase auth, `content.generation.run` RBAC, CP/language validation, generation run, item versions, audit event, outbox, and review-only approval gates.
3. When `QUESTION_STUDIO_SHARED_WORKER_URL` is set, **NUM-001 only** uses an early lazy route `admin-question-studio-num001-remote.ts`, avoiding heavy legacy registry initialization. If the URL is **absent**, NUM-001 still uses the unchanged legacy code.
4. API POSTs to `/internal/question-studio/generate` on the shared service over HTTPS with the existing `QUESTION_STUDIO_WORKER_TOKEN` shared secret.
5. Worker executes an **explicit per-chapter worker-thread bundle**. It never uses production DB credentials or Firebase keys. It rejects unknown chapters; `NUM-001` is `REVIEW_ONLY`. Compute failure **does not fall back** to Render generation.
6. Existing TRG-002 production routing and original `examtree-trg002-staging` Cloud Run service are **unchanged**. Shared service can run TRG-002 in staging to prove its common compute protocol; traffic cutover for TRG-002 is a separate step.

## Deploy staging via Google Cloud Shell
Get source at the merged SHA only after CI green:

```sh
cd ~/Functional-Interface
git fetch origin New-main
git checkout New-main
git pull --ff-only origin New-main
EXAMTREE_BUDGET_READY=yes bash scripts/deploy-shared-question-studio-staging.sh sarbedutech
```

The script reuses `asia-south1`, Artifact Registry `examtree-workers`, existing runtime service account `examtree-gen-runtime`, and Secret Manager secret `examtree-trg002-worker-token`. It creates separate Cloud Run service `examtree-generation-staging` with 2 GiB/1 CPU, min 0, max 1, concurrency 1, timeout 180s. It checks health, unauthenticated POST 401, real NUM-001 and TRG-002 1- and 3-question generation. **No Render configuration is changed.**

Do not switch until the staging output prints `SHARED STAGING READY: https://...`. The Docker image adds storage: verify the Artifact Registry total and the Google Cloud Billing report; free tier is shared across images/services, not per service.

## Production rollout (after both stage smoke tests)
- In Render Environment add `QUESTION_STUDIO_SHARED_WORKER_URL` using the **new** shared Cloud Run URL, while retaining existing `QUESTION_STUDIO_WORKER_TOKEN` unchanged. Configure both securely together if the token isn't present; never paste it in chat.
- Deploy updated `New-main`, and test one then three **NUM-001** questions from the real authenticated admin. Verify each generates a **review** run and exact item count, all NUM-001 items have `questionBankWritable=false`, no test eligibility, CP identity and explanation intact. Compare deterministic seeds with local outputs. Review duplicate handling before retrying timeouts.
- Test a previous TRG-002 batch and a NUM-002 batch to confirm **both are unaffected**.
- Query Render logs for `NUM-001 remote generation started/saved`, and Cloud Run logs for `shared_generation_started/finished`. No secrets in logs.
- If failures occur, remove only `QUESTION_STUDIO_SHARED_WORKER_URL` and redeploy; this restores the old NUM-001 handler. Avoid automatic retries because generation persistence may have completed before network loss.

## Future isolated chapter adapters
Next add NUM-002 CP008–CP014, preserving the approved CP013/CP014 precedence and localized output. After parity tests add the remaining Quant adapters, Reasoning, English, and Static GK as separate worker bundles behind the same *package allowlist and service*; not one eager-loaded monolith. Each migration needs tests for CP selection, lifecycle, deterministic seed, exact question count, and DB persistence. Increase Cloud Run memory only based on observed memory metrics; max 1 caps concurrency and costs but does not guarantee zero bill.
