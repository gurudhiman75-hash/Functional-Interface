# Question Studio background batches on staging

The admin build exposes **Run in background** when
`VITE_QUESTION_STUDIO_BACKGROUND_BATCHES=true`. Each submission is scoped to
one registered package and chapter. It accepts up to 250 questions per
language, processes at most 20 questions per child run, and saves finished
child runs to the existing Review queue.

## Rollout order

1. Apply the existing async enqueue, lease and bulk operation migrations to
   the isolated staging database, followed by
   `20261120_question_studio_background_batches.sql`. Apply the migration before
   deploying the new API if manual bulk operations are already enabled.
2. Build the Cloud Run API image. Create a separate staging Cloud Run Job
   using the same image and its staging database connection. Override its
   command with `node` and pass these two arguments:
   `--import=/app/artifacts/api-server/cloud-run-preload.mjs` and
   `/app/artifacts/api-server/dist/question-studio-background-job.mjs`.
3. Configure the following flags on the staging API and job. Schedule the
   job to execute every minute with an identity authorized to run that job.
   Smoke-test a manual job execution before exposing the feature in the UI.

   ```dotenv
   EXAMTREE_API_STAGING=true
   EXAMTREE_QS_BACKGROUND_BATCHES_ENABLED=true
   EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED=true
   EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED=true
   EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED=true
   EXAMTREE_QUESTION_STUDIO_TASK_CLAIM_ENABLED=true
   EXAMTREE_QUESTION_STUDIO_TASK_REVIEW_COMMIT_ENABLED=true
   ```

4. Rebuild the staging admin preview with
   `VITE_QUESTION_STUDIO_BACKGROUND_BATCHES=true`. Queue a single SAP question
   and a Mixture & Alligation job over 20 questions. Close the tab and reopen
   the job using its resume URL. Verify that all children reach Review and
   confirm the standard editor and Question Bank handoff using an approved
   sample. Repeat for supported Hindi and Punjabi output.

Generation starts on a scheduled job execution. A failed child stops later
children in its operation, while saved questions from earlier children remain
in Review. The worker retries transient compute failures using the existing
lease attempt limit.
