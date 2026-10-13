#!/usr/bin/env bash
# Examtree Question Studio Cloud Tasks staging bootstrap.
# Default is read-only. Set MODE=provision explicitly to create a PAUSED queue and
# a dedicated task OIDC identity. This never deploys or changes API env vars.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
QUEUE=examtree-qs-staging
TASK_SA=examtree-qs-task-staging
API=examtree-api-staging
VALIDATION_BRANCH=br-flat-credit-atqi4rqe
MODE="${MODE:-check}"
[[ "$MODE" == "check" || "$MODE" == "provision" ]] || { echo "MODE must be check or provision" >&2; exit 2; }
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || { echo "Select project $PROJECT first" >&2; exit 2; }
command -v gcloud >/dev/null
echo "Project=$PROJECT region=$REGION mode=$MODE"
gcloud services list --enabled --project="$PROJECT" --filter="config.name:cloudtasks.googleapis.com" --format="value(config.name)" | grep -qx 'cloudtasks.googleapis.com' || { echo "Cloud Tasks API not enabled" >&2; exit 2; }
for service in "$API" examtree-universal-staging; do
  ready="$(gcloud run services describe "$service" --project="$PROJECT" --region="$REGION" --format="value(status.latestReadyRevisionName)")"
  [[ -n "$ready" ]] || { echo "Missing ready service: $service" >&2; exit 2; }
  echo "READY: $service ($ready)"
done
echo "NOTE: isolated Neon branch is $VALIDATION_BRANCH; this script does NOT alter DATABASE_URL."
echo "NOTE: existing staging API is publicly invokable. Verify in-app OIDC before accepting tasks."
echo "NOTE: verify deployed receiver code, staging-only permissions, worker route, and Neon DB target before enabling flags."
if gcloud tasks queues describe "$QUEUE" --project="$PROJECT" --location="$REGION" --format="value(name)" >/dev/null 2>&1; then
  echo "EXISTS: queue $QUEUE"
else
  echo "MISSING: queue $QUEUE"
fi
if gcloud iam service-accounts describe "$TASK_SA@$PROJECT.iam.gserviceaccount.com" --project="$PROJECT" --format="value(email)" >/dev/null 2>&1; then
  echo "EXISTS: task service account $TASK_SA"
else
  echo "MISSING: task service account $TASK_SA"
fi
if [[ "$MODE" == check ]]; then
  echo "CHECK ONLY: no changes made. To create isolated identity and a paused queue, run MODE=provision."
  exit 0
fi
[[ "${EXAMTREE_QS_STAGING_PROVISION_APPROVED:-}" == "yes" ]] || { echo "Provision requires EXAMTREE_QS_STAGING_PROVISION_APPROVED=yes" >&2; exit 2; }
if ! gcloud iam service-accounts describe "$TASK_SA@$PROJECT.iam.gserviceaccount.com" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$TASK_SA" --project="$PROJECT" --display-name="Examtree QS staging task OIDC"
fi
if ! gcloud tasks queues describe "$QUEUE" --project="$PROJECT" --location="$REGION" >/dev/null 2>&1; then
  gcloud tasks queues create "$QUEUE" --project="$PROJECT" --location="$REGION" --max-dispatches-per-second=1 --max-concurrent-dispatches=1 --max-attempts=3
fi
gcloud tasks queues pause "$QUEUE" --project="$PROJECT" --location="$REGION"
echo "PAUSED: $QUEUE"
echo "Provisioned identity and queue only. No IAM grants, API deploy, DB changes, generation, or production edits."
echo "STOP: Before resume, confirm validation branch DB binding, migrations, receiver OIDC verifier, and IAM roles."
