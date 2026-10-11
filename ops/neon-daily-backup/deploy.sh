#!/usr/bin/env bash
set -euo pipefail

# Operator-only activation, never modifies the Examtree API or frontend.
if [[ "${1:-}" != '--apply' || "$#" -ne 1 ]]; then
  echo 'Usage: bash ops/neon-daily-backup/deploy.sh --apply' >&2
  echo 'Save a recovery copy of the backup encryption key first; see README.' >&2
  exit 2
fi
PROJECT=sarbedutech
REGION=us-east1
BUCKET=sarbedutech
JOB=examtree-neon-backup-daily
SCHEDULER_JOB=examtree-neon-backup-daily-trigger
BACKUP_SA="examtree-neon-backup@${PROJECT}.iam.gserviceaccount.com"
SCHEDULER_SA="examtree-neon-scheduler@${PROJECT}.iam.gserviceaccount.com"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for cmd in gcloud python3 mktemp; do
  command -v "$cmd" >/dev/null || { echo "Missing $cmd" >&2; exit 2; }
done
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] ||
  { echo "Select GCP project sarbedutech with: gcloud config set project sarbedutech" >&2; exit 2; }
for secret in examtree-api-database-url examtree-neon-backup-passphrase; do
  gcloud secrets describe "$secret" --project="$PROJECT" >/dev/null ||
    { echo "Required Secret Manager secret not found: $secret" >&2; exit 2; }
  [[ -n "$(gcloud secrets versions list "$secret" --project="$PROJECT" --filter='state=enabled' --format='value(name)' --limit=1)" ]] ||
    { echo "No active version for Secret Manager secret: $secret" >&2; exit 2; }
done

bucket_json="$(mktemp)"
trap 'rm -f "$bucket_json"' EXIT
gcloud storage buckets describe "gs://$BUCKET" --format=json > "$bucket_json"
python3 - "$bucket_json" <<'PY'
import json,sys
x=json.load(open(sys.argv[1]))
config=x.get('iamConfiguration',{})
if x.get('name')!='sarbedutech':
    sys.exit('Wrong Cloud Storage bucket')
if config.get('publicAccessPrevention')!='enforced':
    sys.exit('Public access prevention is not enforced on sarbedutech')
if not config.get('uniformBucketLevelAccess',{}).get('enabled',False):
    sys.exit('Uniform bucket-level access must be enabled on sarbedutech')
PY

echo 'Creating dedicated service accounts, narrow IAM and a Cloud Run backup job.'
echo 'Cloud Run, Cloud Scheduler, Cloud Build, Secrets and GCS may incur charges.'
gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
  artifactregistry.googleapis.com secretmanager.googleapis.com \
  cloudscheduler.googleapis.com --project="$PROJECT"

if ! gcloud iam service-accounts describe "$BACKUP_SA" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create examtree-neon-backup \
    --display-name='Examtree encrypted Neon backup job' --project="$PROJECT"
fi
if ! gcloud iam service-accounts describe "$SCHEDULER_SA" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create examtree-neon-scheduler \
    --display-name='Examtree daily backup scheduler invoker' --project="$PROJECT"
fi
for secret in examtree-api-database-url examtree-neon-backup-passphrase; do
  gcloud secrets add-iam-policy-binding "$secret" --project="$PROJECT" \
    --member="serviceAccount:$BACKUP_SA" --role='roles/secretmanager.secretAccessor'
done
for role in roles/storage.objectCreator roles/storage.objectViewer; do
  gcloud storage buckets add-iam-policy-binding "gs://$BUCKET" \
    --member="serviceAccount:$BACKUP_SA" --role="$role"
done

gcloud run jobs deploy "$JOB" --source "$DIR" \
  --project="$PROJECT" --region="$REGION" \
  --service-account="$BACKUP_SA" \
  --tasks=1 --parallelism=1 --max-retries=0 \
  --task-timeout=900s --memory=512Mi --cpu=1 \
  --set-env-vars='BACKUP_BUCKET=sarbedutech,BACKUP_PREFIX=neon-backups/daily' \
  --set-secrets='DATABASE_URL=examtree-api-database-url:latest,BACKUP_PASSPHRASE=examtree-neon-backup-passphrase:latest'

gcloud run jobs add-iam-policy-binding "$JOB" --project="$PROJECT" --region="$REGION" \
  --member="serviceAccount:$SCHEDULER_SA" --role='roles/run.invoker'

echo 'Running first real encrypted backup. Daily scheduler stays disabled unless this succeeds.'
gcloud run jobs execute "$JOB" --project="$PROJECT" --region="$REGION" --wait

if gcloud scheduler jobs describe "$SCHEDULER_JOB" --project="$PROJECT" --location="$REGION" >/dev/null 2>&1; then
  echo 'An existing scheduler job was found. Refusing to overwrite it.' >&2
  exit 2
fi
# 03:30 IST daily; US daylight savings do not affect this timezone.
gcloud scheduler jobs create http "$SCHEDULER_JOB" --project="$PROJECT" \
  --location="$REGION" --schedule='30 3 * * *' --time-zone='Asia/Kolkata' \
  --uri="https://run.googleapis.com/v2/projects/$PROJECT/locations/$REGION/jobs/$JOB:run" \
  --http-method=POST --message-body='{}' \
  --headers='Content-Type=application/json' \
  --oauth-service-account-email="$SCHEDULER_SA" \
  --max-retry-attempts=1 \
  --description='Encrypted Neon backup to private sarbedutech Cloud Storage'

echo 'PASS: first real backup succeeded and daily 03:30 IST Cloud Scheduler job created.'
echo 'NEXT: run retention-30-days.sh and setup-alerts.sh as described in README.'
