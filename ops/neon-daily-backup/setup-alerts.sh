#!/usr/bin/env bash
set -euo pipefail
# Alert on Cloud Run container failures; does not detect missed schedules.
[[ "${1:-}" == '--apply' && "$#" -eq 1 && -n "${BACKUP_ALERT_EMAIL:-}" ]] || {
  echo 'Usage: BACKUP_ALERT_EMAIL=you@example.com bash setup-alerts.sh --apply' >&2
  exit 2
}
PROJECT=sarbedutech
policy_file="$(mktemp)"
trap 'rm -f "$policy_file"' EXIT
gcloud services enable monitoring.googleapis.com logging.googleapis.com --project="$PROJECT"
if gcloud monitoring policies list --project="$PROJECT" --format='value(displayName)' |
   grep -Fxq 'Examtree - daily Neon backup failed'; then
  echo 'Existing alert found; inspect rather than create a duplicate.' >&2
  exit 2
fi
channel="$(gcloud beta monitoring channels create --project="$PROJECT" \
  --display-name='Examtree Neon backup owner' --type=email \
  --channel-labels="email_address=$BACKUP_ALERT_EMAIL" --format='value(name)')"
[[ "$channel" == projects/*/notificationChannels/* ]] || {
  echo 'Cloud Monitoring did not return a valid notification channel.' >&2
  exit 2
}
python3 - "$policy_file" "$channel" <<'PY'
import json,sys
config={
  'displayName':'Examtree - daily Neon backup failed',
  'combiner':'OR', 'enabled':True,
  'conditions':[{
    'displayName':'Backup container exited unsuccessfully',
    'conditionMatchedLog':{
      'filter':'resource.type="cloud_run_job" AND '
               'resource.labels.job_name="examtree-neon-backup-daily" AND '
               'textPayload:"EXAMTREE_NEON_DAILY_BACKUP_FAILED"'
    }
  }],
  'notificationChannels':[sys.argv[2]],
  'alertStrategy':{'notificationRateLimit':{'period':'3600s'},'autoClose':'86400s'},
  'documentation':{'mimeType':'text/markdown',
    'content':'Examtree encrypted Neon backup failed. Check Cloud Run job logs and gs://sarbedutech/neon-backups/daily/. Do not delete the last verified backup.'}
}
with open(sys.argv[1],'w') as f: json.dump(config,f)
PY
gcloud monitoring policies create --project="$PROJECT" --policy-from-file="$policy_file"
echo 'PASS: Cloud Monitoring failure alert created; verify your email notification channel.'
echo 'A separate backup-freshness watchdog is still required to catch missed runs.'
