#!/usr/bin/env bash
set -euo pipefail

# This script is operator-controlled and creates no schedule unless a
# real read-only GCS freshness check and its failure alert both pass.
[[ "$#" -eq 1 && "${1:-}" == "--apply" ]] || {
  echo 'Usage: FRESHNESS_ALERT_CHANNEL=projects/sarbedutech/notificationChannels/<id> bash ops/neon-backup-freshness/deploy.sh --apply' >&2
  exit 2
}
PROJECT=sarbedutech
REGION=us-east1
BUCKET=sarbedutech
JOB=examtree-neon-backup-freshness
SCHEDULE=examtree-neon-backup-freshness-trigger
SERVICE_ACCOUNT="examtree-neon-watchdog@${PROJECT}.iam.gserviceaccount.com"
SCHEDULER_SERVICE_ACCOUNT="examtree-neon-scheduler@${PROJECT}.iam.gserviceaccount.com"
MAIN_SCHEDULE=examtree-neon-backup-daily-trigger
CHANNEL="${FRESHNESS_ALERT_CHANNEL:-}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
stage="initial preflight"
trap 'status=$?; echo "ERROR: backup freshness deployment stopped at: $stage (exit $status)" >&2' ERR

python3 - "$CHANNEL" <<'PY'
import re,sys
if not re.fullmatch(r'projects/sarbedutech/notificationChannels/[0-9]+', sys.argv[1]):
    sys.exit('FRESHNESS_ALERT_CHANNEL must be an existing Cloud Monitoring channel in sarbedutech')
PY
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || {
  echo "Select Google Cloud project sarbedutech first" >&2; exit 2;
}
stage="verify first scheduled daily backup exists"
[[ "$(gcloud scheduler jobs describe "$MAIN_SCHEDULE" --project="$PROJECT" --location="$REGION" --format='value(state)')" == ENABLED ]] || {
  echo "Daily backup scheduler is not enabled" >&2; exit 2;
}
gcloud iam service-accounts describe "$SCHEDULER_SERVICE_ACCOUNT" --project="$PROJECT" >/dev/null

stage="check no duplicate watcher schedule or monitoring alert"
if gcloud scheduler jobs describe "$SCHEDULE" --project="$PROJECT" --location="$REGION" >/dev/null 2>&1; then
  echo "A freshness schedule already exists: inspect instead of overwriting." >&2
  exit 2
fi
if gcloud monitoring policies list --project="$PROJECT" --format='value(displayName)' |
   grep -Fxq 'Examtree - daily Neon backup missing'; then
  echo "A freshness monitoring policy already exists: inspect before rerunning." >&2
  exit 2
fi

stage="create restricted read-only freshness identity"
if ! gcloud iam service-accounts describe "$SERVICE_ACCOUNT" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create examtree-neon-watchdog \
    --project="$PROJECT" --display-name='Examtree encrypted backup freshness (read-only)'
fi
for attempt in 1 2 3 4 5 6; do
  if gcloud iam service-accounts describe "$SERVICE_ACCOUNT" --project="$PROJECT" >/dev/null 2>&1; then
    break
  fi
  if [[ "$attempt" == 6 ]]; then echo 'Backup watchdog service account not visible' >&2; exit 2; fi
  sleep "$(( 3 * attempt ))"
done
stage="grant read-only backup bucket access"
for attempt in 1 2 3 4 5; do
  if gcloud storage buckets add-iam-policy-binding "gs://$BUCKET" \
    --member="serviceAccount:$SERVICE_ACCOUNT" --role='roles/storage.objectViewer'; then
    break
  fi
  if [[ "$attempt" == 5 ]]; then echo 'Could not grant read-only backup object access' >&2; exit 2; fi
  sleep "$(( 3 * attempt ))"
done

stage="deploy isolated Cloud Run freshness job"
# Gen2 execution environment with unthrottled 1 vCPU requires at least 512Mi.
gcloud run jobs deploy "$JOB" --source "$ROOT" \
  --project="$PROJECT" --region="$REGION" \
  --service-account="$SERVICE_ACCOUNT" --tasks=1 --parallelism=1 \
  --max-retries=0 --task-timeout=120s --memory=512Mi --cpu=1 \
  --set-env-vars='BACKUP_BUCKET=sarbedutech,BACKUP_PREFIX=neon-backups/daily'

stage="authorize existing scheduler identity"
gcloud run jobs add-iam-policy-binding "$JOB" --project="$PROJECT" --region="$REGION" \
  --member="serviceAccount:$SCHEDULER_SERVICE_ACCOUNT" --role='roles/run.invoker'

stage="check real private daily backup objects today"
echo 'Checking backup freshness against the actual private bucket.'
gcloud run jobs execute "$JOB" --project="$PROJECT" --region="$REGION" --wait

stage="create missing-backup email policy"
POLICY="$(mktemp)"
trap 'rm -f -- "$POLICY"' EXIT
python3 - "$POLICY" "$CHANNEL" <<'PY'
import json,sys
policy = {
    'displayName': 'Examtree - daily Neon backup missing',
    'combiner': 'OR', 'enabled': True,
    'conditions': [{
        'displayName': 'Watchdog found no complete encrypted backup today',
        'conditionMatchedLog': {
            'filter': 'resource.type="cloud_run_job" AND '
                      'resource.labels.job_name="examtree-neon-backup-freshness" AND '
                      'textPayload:"EXAMTREE_NEON_BACKUP_FRESHNESS_FAILED"'
        }
    }],
    'notificationChannels': [sys.argv[2]],
    'alertStrategy': {
        'notificationRateLimit': {'period': '3600s'},
        'autoClose': '86400s'
    },
    'documentation': {
        'mimeType': 'text/markdown',
        'content': 'No encrypted Neon backup+checksum pair in private GCS today. '
                   'Inspect Cloud Scheduler, Cloud Run job executions, and '
                   'gs://sarbedutech/neon-backups/daily/. '
                   'Do not delete the previous valid backup.'
    }
}
with open(sys.argv[1], 'w') as stream:
    json.dump(policy, stream)
PY
gcloud monitoring policies create --project="$PROJECT" --policy-from-file="$POLICY"

stage="enable independent daily 06:30 IST check"
gcloud scheduler jobs create http "$SCHEDULE" --project="$PROJECT" \
  --location="$REGION" --schedule='30 6 * * *' --time-zone='Asia/Kolkata' \
  --uri="https://run.googleapis.com/v2/projects/$PROJECT/locations/$REGION/jobs/$JOB:run" \
  --http-method=POST --message-body='{}' \
  --headers='Content-Type=application/json' \
  --oauth-service-account-email="$SCHEDULER_SERVICE_ACCOUNT" \
  --max-retry-attempts=1 \
  --description='Alert when no complete, fresh encrypted Neon backup exists today (IST)'

echo 'PASS: backup freshness checked today; daily 06:30 IST watchdog and email policy enabled.'
echo 'Confirm Monitoring channel email delivery separately; watchdog execution creation itself can also fail.'
