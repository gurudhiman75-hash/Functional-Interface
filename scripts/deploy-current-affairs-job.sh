#!/usr/bin/env bash
# Deploys the Current Affairs Cloud Run Jobs and their schedules.
# Usage: EXAMTREE_CA_SCHEDULE_APPROVED=yes bash scripts/deploy-current-affairs-job.sh IMAGE
# IMAGE is an API image built from Dockerfile.examtree-cloudrun-api.
# Run scripts/examtree-api-schema-bootstrap.sh first so migrations are applied.
set -euo pipefail
PROJECT="sarbedutech"
REGION="asia-south1"
IMAGE="${1:-}"
SA="examtree-api-runtime@$PROJECT.iam.gserviceaccount.com"
SCHEDULER_SA="examtree-cloud-scheduler@$PROJECT.iam.gserviceaccount.com"
DB_SECRET="examtree-api-database-url"
TAVILY_SECRET="${EXAMTREE_TAVILY_SECRET:-}"
if [[ -z "$IMAGE" || "${EXAMTREE_CA_SCHEDULE_APPROVED:-}" != "yes" ]]; then
  echo "Usage: EXAMTREE_CA_SCHEDULE_APPROVED=yes bash $0 IMAGE" >&2
  exit 2
fi
gcloud services enable cloudscheduler.googleapis.com --project="$PROJECT" >/dev/null
if ! gcloud iam service-accounts describe "$SCHEDULER_SA" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "${SCHEDULER_SA%%@*}" --project="$PROJECT" \
    --display-name="Examtree background job Scheduler invoker" >/dev/null
fi
SECRETS="DATABASE_URL=$DB_SECRET:latest"
if [[ -n "$TAVILY_SECRET" ]]; then
  SECRETS+=",TAVILY_API_KEY=$TAVILY_SECRET:latest"
  gcloud secrets add-iam-policy-binding "$TAVILY_SECRET" --project="$PROJECT" \
    --member="serviceAccount:$SA" --role=roles/secretmanager.secretAccessor >/dev/null
fi

deploy() {
  local mode="$1" schedule="$2" timeout="$3"
  local job="examtree-current-affairs-$mode"
  local trigger="$job-schedule"
  gcloud run jobs deploy "$job" --project="$PROJECT" --region="$REGION" \
    --image="$IMAGE" --service-account="$SA" --memory=2Gi --cpu=1 \
    --tasks=1 --parallelism=1 --task-timeout="$timeout" --max-retries=0 \
    --command=node --args=artifacts/api-server/dist/current-affairs-job.mjs \
    --set-env-vars="NODE_ENV=production,EXAMTREE_API_RUNTIME=cloud-run,CURRENT_AFFAIRS_JOB_MODE=$mode" \
    --set-secrets="$SECRETS" --quiet
  gcloud run jobs add-iam-policy-binding "$job" --project="$PROJECT" --region="$REGION" \
    --member="serviceAccount:$SCHEDULER_SA" --role=roles/run.invoker >/dev/null
  local verb=create
  if gcloud scheduler jobs describe "$trigger" --project="$PROJECT" --location="$REGION" >/dev/null 2>&1; then
    verb=update
  fi
  gcloud scheduler jobs "$verb" http "$trigger" \
    --project="$PROJECT" --location="$REGION" --time-zone="Asia/Kolkata" \
    --schedule="$schedule" --http-method=POST \
    --uri="https://run.googleapis.com/v2/projects/$PROJECT/locations/$REGION/jobs/$job:run" \
    --oauth-service-account-email="$SCHEDULER_SA" \
    --oauth-token-scope="https://www.googleapis.com/auth/cloud-platform" \
    --max-retry-attempts=0
}

# The daily pass starts well clear of the ingest slots: both use shared run keys.
deploy daily "10 5 * * *" 3600
deploy ingest "40 8,11,14,17,20,23 * * *" 1800
echo "Done. Test now: gcloud run jobs execute examtree-current-affairs-ingest --region=$REGION --project=$PROJECT --wait"
