#!/usr/bin/env bash
set -euo pipefail
# Final cutover step ONLY. Never activate for staging or before Render has
# stopped all background pollers. A job schedule can send real FCM notifications.
PROJECT="sarbedutech"
REGION="asia-south1"
JOB="examtree-api-background"
SCHEDULER="examtree-api-background-every-5m"
SCHEDULER_SA="examtree-cloud-scheduler"
if [[ "${EXAMTREE_CUTOVER_READY:-}" != "yes"
   || "${EXAMTREE_RENDER_STOPPED:-}" != "yes"
   || "${EXAMTREE_BACKGROUND_JOB_VERIFIED:-}" != "yes" ]]; then
  echo "Refusing to schedule: require EXAMTREE_CUTOVER_READY=yes EXAMTREE_RENDER_STOPPED=yes EXAMTREE_BACKGROUND_JOB_VERIFIED=yes" >&2
  exit 2
fi
gcloud run jobs describe "$JOB" --project="$PROJECT" --region="$REGION" >/dev/null || {
  echo "Production Cloud Run Job is absent; do not schedule staging." >&2; exit 1;
}
gcloud services enable cloudscheduler.googleapis.com --project="$PROJECT" >/dev/null
EMAIL="$SCHEDULER_SA@$PROJECT.iam.gserviceaccount.com"
if ! gcloud iam service-accounts describe "$EMAIL" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$SCHEDULER_SA" --project="$PROJECT" \
    --display-name="Examtree background job Scheduler invoker" >/dev/null
fi
gcloud run jobs add-iam-policy-binding "$JOB" --project="$PROJECT" --region="$REGION" \
  --member="serviceAccount:$EMAIL" --role=roles/run.invoker >/dev/null

URI="https://run.googleapis.com/v2/projects/$PROJECT/locations/$REGION/jobs/$JOB:run"
if gcloud scheduler jobs describe "$SCHEDULER" --project="$PROJECT" --location="$REGION" >/dev/null 2>&1; then
  echo "Scheduler job already exists; refusing to overwrite an existing schedule." >&2
  exit 1
fi
gcloud scheduler jobs create http "$SCHEDULER" \
  --project="$PROJECT" --location="$REGION" --time-zone="Asia/Kolkata" \
  --schedule="*/5 * * * *" --http-method=POST --uri="$URI" \
  --oauth-service-account-email="$EMAIL" \
  --oauth-token-scope="https://www.googleapis.com/auth/cloud-platform" \
  --max-retry-attempts=0
echo "Scheduled background job $JOB every five minutes; monitor the first executions."
