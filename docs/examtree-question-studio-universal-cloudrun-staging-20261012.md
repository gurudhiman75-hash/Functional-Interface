# Universal Question Studio — Cloud Run staging acceptance

PR #3349 merged the universal deterministic worker to New-main after 11 CI workflows passed. This was not a production deployment.

## Manual staging sequence

Review Google Cloud billing budget and alerts before executing in Cloud Shell.

    cd ~/Functional-Interface
    git switch New-main
    git pull --ff-only origin New-main
    gcloud config set project sarbedutech
    EXAMTREE_BUDGET_READY=yes EXAMTREE_UNIVERSAL_STAGING_APPROVED=yes bash scripts/deploy-question-studio-universal-staging.sh
    EXAMTREE_BUDGET_READY=yes EXAMTREE_UNIVERSAL_STAGING_CHECK_APPROVED=yes bash scripts/verify-question-studio-universal-staging.sh

The first script deploys a separate 2 GiB, 1 vCPU, at-most-one-instance universal staging compute worker. The second verifies its ready revision, forbidden credential absence, health, missing-token rejection (401), unknown-path rejection (404), and real compute batches.

Smoke set: Quant TRG-002 (1 and 3 questions), Reasoning OPS-001 (1), English ENG-001 CP013 (1), Static GK COM-001 (1), and Quant NUM-001 CP001 (3). All cases assert exact package, engine, question count, generation provenance, stems, options, answer and explanation without printing content or secrets.

## Safety and promotion

- This is compute-only. It cannot write Neon questions, approvals, user data or payments.
- Failures block promotion. Diagnose Cloud Run memory/runtime/source asset issues without sharing worker tokens.
- The staging image must never be configured as a production API worker. Production requires a separate deployment and production token.
- The student API, Render fallback, Cashfree, and the tagged admin candidate remain unchanged.
- The worker has a 120-second compute timeout; the Cloud Run service has 180 seconds. Slow chapters should be chunked with a durable queue rather than increasing timeouts forever.
- The universal URL is opt-in, and specialized legacy routes have not all moved. A full Generate-to-Queue-to-Worker-to-Neon flow also requires authenticated Cloud Tasks delivery, idempotent persistence and a progress UI.
