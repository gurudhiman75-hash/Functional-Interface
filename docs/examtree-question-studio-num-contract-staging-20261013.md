# Universal Question Studio — NUM-001 corrected staging revision (13 October 2026)

The current `fix-candidate` revision of `examtree-universal-staging` passed all six compute-only acceptance tests: TRG-002 (1 and 3), OPS-001 (1), ENG-001 (1), COM-001 (1), NUM-001 (3). The corrected staging verifier supplied the canonical admin request's NUM-001 flags (`difficultyFilterSupported=false`, `forwardLegacyExamProfile=true`). These are real Cloud Run results; they are not proof of the no-override worker change or all-package coverage.

PR #3353 also merged a **code-level** source-policy fix, so the universal worker itself derives Number System difficulty support from its registered package. That code is in `New-main` but not the already-tested container image. This staged rollout updates the **existing staging service only**, as a new tagged revision with zero percent traffic.

### Cloud Shell: create the latest no-traffic candidate

Review billing budget/alerts (Cloud Build and Cloud Run incur costs), then:

```bash
cd ~/Functional-Interface
git switch New-main
git pull --ff-only origin New-main
gcloud config set project sarbedutech
EXAMTREE_BUDGET_READY=yes EXAMTREE_UNIVERSAL_STAGING_NUM_CONTRACT_APPROVED=yes \
  bash scripts/deploy-question-studio-universal-staging-numfix.sh
```

This is not the original `deploy-question-studio-universal-staging.sh`; that script correctly refuses to replace an existing service. The new script requires the original serving revision still has 100% traffic, the older `fix-candidate` tag exists at 0%, runtime identity and secret are unchanged, and `numfix` does not already exist. It deploys from the clean, latest `New-main`, requiring approval and preserving traffic.

### Accept seven staging cases (compute-only)

```bash
EXAMTREE_BUDGET_READY=yes EXAMTREE_UNIVERSAL_STAGING_CHECK_APPROVED=yes \
  EXAMTREE_UNIVERSAL_STAGING_TAG=numfix \
  bash scripts/verify-question-studio-universal-staging.sh
```

This verifies the six previously passing cases **plus** NUM-001 CP001 (one question) with the request difficulty field and the caller's difficulty-filter/profile flags entirely omitted. It also checks the actual question's generation context and the batch provenance both report `difficultyFilterApplied=false`. It does not write to Neon or publish content. The script fails closed on missing/incorrect revision, 0% traffic safety violations, unauthorized generation, bad question counts/answers/explanations, or false difficulty claims.

Do not promote either candidate until all seven pass and production/API rollout gates are separately approved. **No Cloudflare, production Cloud Run API, Render, Neon, Cashfree, job queue or production worker changes are included.**

After acceptance, a separate staging-traffic promotion can be considered. The intended `Generate → Queue → Worker → Neon Review` UX still requires a durable job queue, idempotent persistence, and admin progress UI; this staging success alone does not activate those features.

### Recovery after tag-length failure without another build

If Cloud Build already succeeded for image tag `280e82c21b038b2c210f897b359d3cf653a64fe7` but Cloud Run rejected the earlier overlong tag, **reuse that exact image** after confirming the Artifact Registry tag is present:

```bash
EXAMTREE_BUDGET_READY=yes EXAMTREE_UNIVERSAL_STAGING_NUM_CONTRACT_APPROVED=yes \\
EXAMTREE_UNIVERSAL_REUSE_IMAGE_SHA=280e82c21b038b2c210f897b359d3cf653a64fe7 \\
bash scripts/deploy-question-studio-universal-staging-num-contract-candidate.sh
```

This path skips Cloud Build entirely. It still creates one zero-traffic Cloud Run candidate revision, which may incur normal staging service charges. If `numfix` already exists, stop and verify it instead.
