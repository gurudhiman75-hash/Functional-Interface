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
# Never schedule the isolated staging dataset, nor an inert staging image.
# Examine only Cloud Run configuration; do not print secret values.
if ! gcloud run jobs describe "$JOB" --project="$PROJECT" --region="$REGION" --format=json |
  python3 -c '
import json,sys
try:
 job=json.load(sys.stdin)
 spec=job["spec"]["template"]["spec"]["template"]["spec"]
 containers=spec["containers"]
 assert len(containers)==1
 container=containers[0]
 env={e.get("name"):e for e in container.get("env",[])}
 assert (env.get("EXAMTREE_API_RUNTIME") or {}).get("value")=="cloud-run"
 assert (env.get("EXAMTREE_API_STAGING") or {}).get("value")!="true"
 assert ((env.get("DATABASE_URL") or {}).get("valueFrom") or {}).get("secretKeyRef",{}).get("name")=="examtree-api-database-url"
 command=container.get("command") or []
 assert command and command[0]!="false" and "/usr/bin/false" not in command
 assert "examtree-api" in container.get("image","")
except (AssertionError,KeyError,ValueError,TypeError):
 sys.exit(1)
' ; then
  echo "Refusing to schedule: production job must use main Neon secret and non-staging Cloud Run configuration." >&2
  exit 2
fi
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
