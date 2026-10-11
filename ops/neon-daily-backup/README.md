# Examtree — encrypted daily Neon backups

IMPORTANT: A GitHub merge does NOT activate scheduled backups. Cloud Shell operator activation is required.

The manually verified GCS backup remains at gs://sarbedutech/neon-backups/ and is not modified. New backups are stored under gs://sarbedutech/neon-backups/daily/. The schedule is 03:30 Asia/Kolkata daily, via Cloud Scheduler invoking a dedicated Cloud Run Job in us-east1. PostgreSQL 17 pg_dump streams directly to GPG AES256, validates decrypted archive, uploads encrypted backup and matching SHA256 manifest, and verifies both downloaded copies. No plaintext dump is written.

Two new service accounts are used: one receives access to the two required Secret Manager secrets and objectCreator/objectViewer on the backup bucket (no deletion), and a second gets run.invoker on the specific backup Job only. Cloud Run, Cloud Build, Artifact Registry, Scheduler, Secret Manager, Storage and Monitoring can incur charges.

## 1. Prepare a separate automated backup key

Choose a random 32+ character passphrase and save an **independent, off-cloud recovery copy** in a password manager BEFORE putting it in Secret Manager. It is separate from the older manual backup passphrase. Do not share it in ChatGPT or commit it to Git.

In Google Cloud Shell:

    cd ~/Functional-Interface
    git switch New-main
    git pull --ff-only origin New-main
    gcloud config set project sarbedutech

Safely create the new Secret Manager secret:

    read -r -s -p 'Saved 32+ character new backup key: ' BACKUP_KEY </dev/tty
    printf '\n' >/dev/tty
    if [[ ${#BACKUP_KEY} -lt 32 ]]; then
      echo 'Key too short; not saved' >&2
    else
      printf '%s' "$BACKUP_KEY" | gcloud secrets create examtree-neon-backup-passphrase \
        --project=sarbedutech --replication-policy=automatic --data-file=-
    fi
    unset BACKUP_KEY

If the secret already exists, do NOT recreate or rotate it. The deploy script requires a valid enabled version of this secret and the existing examtree-api-database-url. Keep the recovery copy in a separate password manager.

## 2. Deploy and enable schedule (explicit)

    bash ops/neon-daily-backup/deploy.sh --apply

The script checks bucket security, deploys a new isolated Cloud Run Job and service accounts with narrow IAM, and runs one real backup first. Only after that succeeds does it create the daily Cloud Scheduler trigger. It refuses to overwrite an existing schedule.

Check the first execution and matching encrypted files:

    gcloud run jobs executions list --job=examtree-neon-backup-daily \
      --region=us-east1 --project=sarbedutech --limit=5
    gcloud scheduler jobs describe examtree-neon-backup-daily-trigger \
      --location=us-east1 --project=sarbedutech
    gcloud storage ls -l gs://sarbedutech/neon-backups/daily/

A Scheduler HTTP 2xx only proves the execution was requested, not that the backup completed. Confirm Cloud Run execution status and output.

## 3. Apply 30-day retention (explicit)

    gcloud storage buckets describe gs://sarbedutech \
      --format='json(lifecycle,softDeletePolicy,retentionPolicy)'
    bash ops/neon-daily-backup/retention-30-days.sh --apply

A prefix-only lifecycle rule deletes objects older than 30 days under neon-backups/daily/; the verified manual backup in the parent prefix is excluded. Script refuses to overwrite existing lifecycle policies. Cloud Storage soft delete can retain deleted objects longer and generate storage costs.

## 4. Configure a failure email alert (explicit)

Provide an operations email address in Cloud Shell, without sharing it in chat:

    BACKUP_ALERT_EMAIL='ops@example.com' \
      bash ops/neon-daily-backup/setup-alerts.sh --apply

Creates a Cloud Monitoring email channel and a log alert on the EXAMTREE_NEON_DAILY_BACKUP_FAILED marker emitted by failed job runs. Verify the channel and test email delivery. This does NOT detect a scheduler that never triggers; a separate backup-freshness watchdog remains necessary.

## Recovery scope and pause

- Monthly, download a daily GCS archive and matching checksum, then perform a fresh isolated Neon restore. The one-time October 11 restore script refers to a deleted test endpoint and MUST NOT be reused for future restores.
- Keep the Secret Manager key and off-cloud recovery copy. Older encrypted archives need their corresponding key.
- A Neon logical backup does not include Firebase Auth/Storage, Cashfree provider data, Cloud Run infrastructure, or other secrets.
- Firebase Admin SDK's existing project-wide Storage Admin role still inherits access to the backup bucket, requiring separate IAM review.
- Pause future runs without deleting any backups:

      gcloud scheduler jobs pause examtree-neon-backup-daily-trigger \
        --project=sarbedutech --location=us-east1
