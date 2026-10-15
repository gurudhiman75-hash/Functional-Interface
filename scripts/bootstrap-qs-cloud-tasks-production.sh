#!/usr/bin/env bash
# Prepare separate production Question Studio queue and service identities.
# DEFAULT IS READ-ONLY. No scheduler, IAM grants, API deploy, DB access,
# generation, Cloud Run execution, queue resume or student publication.
set -euo pipefail
set +x

PROJECT=sarbedutech
REGION=asia-south1
QUEUE=examtree-qs-prod
DISPATCH_SA=examtree-qs-dispatch-prod
TASK_SA=examtree-qs-task-prod
MODE="${MODE:-check}"

if [[ "$MODE" != check && "$MODE" != provision ]]; then
  echo "STOP: MODE must be check or provision" >&2; exit 2
fi
command -v gcloud >/dev/null || { echo "STOP: gcloud CLI required" >&2; exit 2; }
command -v python3 >/dev/null || { echo "STOP: python3 required" >&2; exit 2; }
active_project="$(gcloud config get-value project 2>/dev/null)"
[[ "$active_project" == "$PROJECT" ]] || {
  echo "STOP: select exactly Google Cloud project $PROJECT" >&2; exit 2;
}
echo "Examtree QS production identity/queue preflight: project=$PROJECT region=$REGION mode=$MODE"
gcloud services list --enabled --project="$PROJECT" \
  --filter="config.name:cloudtasks.googleapis.com" \
  --format="value(config.name)" | grep -qx "cloudtasks.googleapis.com" || {
  echo "STOP: Cloud Tasks API is not enabled; no changes made" >&2; exit 2;
}

account_exists() {
  gcloud iam service-accounts describe "$1@$PROJECT.iam.gserviceaccount.com" \
    --project="$PROJECT" >/dev/null 2>&1
}
queue_exists() {
  gcloud tasks queues describe "$QUEUE" --project="$PROJECT" \
    --location="$REGION" >/dev/null 2>&1
}

for account in "$DISPATCH_SA" "$TASK_SA"; do
  if account_exists "$account"; then
    echo "EXISTS: service account $account@$PROJECT.iam.gserviceaccount.com"
  else
    echo "MISSING: service account $account@$PROJECT.iam.gserviceaccount.com"
  fi
done

if queue_exists; then
  state="$(gcloud tasks queues describe "$QUEUE" --project="$PROJECT" \
    --location="$REGION" --format=json | python3 -c \
    'import json,sys; print(json.load(sys.stdin).get("state","UNKNOWN"))')"
  echo "EXISTS: queue=$QUEUE state=$state"
else
  state="MISSING"
  echo "MISSING: queue=$QUEUE"
fi

if [[ "$MODE" == check ]]; then
  echo "CHECK ONLY: zero resources created or modified."
  exit 0
fi

# Confirm both independent approvals before the first mutation.
[[ "${EXAMTREE_QS_PROD_INFRA_PROVISION_APPROVED:-}" == "yes" ]] || {
  echo "STOP: provision requires EXAMTREE_QS_PROD_INFRA_PROVISION_APPROVED=yes" >&2
  exit 2
}
[[ "${EXAMTREE_QS_PROD_PAUSED_ONLY_APPROVED:-}" == "yes" ]] || {
  echo "STOP: provision requires EXAMTREE_QS_PROD_PAUSED_ONLY_APPROVED=yes" >&2
  exit 2
}
# NEVER change the state or settings of an unexpected pre-existing queue.
[[ "$state" == "MISSING" ]] || {
  echo "STOP: production queue already exists; inspect it manually before any change" >&2
  exit 2
}

for account in "$DISPATCH_SA" "$TASK_SA"; do
  if ! account_exists "$account"; then
    gcloud iam service-accounts create "$account" --project="$PROJECT" \
      --display-name="Examtree Question Studio production $account"
    echo "CREATED: identity $account"
  fi
done

gcloud tasks queues create "$QUEUE" --project="$PROJECT" --location="$REGION" \
  --max-dispatches-per-second=1 --max-concurrent-dispatches=1 --max-attempts=3
# No dispatcher/receiver has been deployed or granted IAM; still explicitly pause.
gcloud tasks queues pause "$QUEUE" --project="$PROJECT" --location="$REGION"
final_state="$(gcloud tasks queues describe "$QUEUE" --project="$PROJECT" \
  --location="$REGION" --format=json | python3 -c \
  'import json,sys; print(json.load(sys.stdin).get("state","UNKNOWN"))')"
[[ "$final_state" == PAUSED ]] || {
  echo "STOP: queue did not confirm PAUSED; block all IAM and rollout" >&2
  exit 1
}
echo "PAUSED: queue=$QUEUE"
echo "DONE: dedicated production identities and PAUSED queue only."
echo "NOT DONE: IAM grants, service deployment, scheduler, Neon migrations, async flags, worker or traffic."
