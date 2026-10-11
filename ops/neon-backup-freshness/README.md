# Examtree: independent daily backup freshness watchdog

The primary encrypted Neon PostgreSQL backup runs at **03:30 Asia/Kolkata** every day. The existing Cloud Monitoring alert watches for backup worker failure logs, but it cannot catch a scheduler that never starts the worker.

This watchdog separately runs at **06:30 IST**. It checks **metadata only** on the private GCS bucket, without database or encryption secrets. It fails unless at least one nonempty daily encrypted GPG dump and its matching SHA256 manifest were both uploaded on the **current calendar day in Asia/Kolkata**. Failures emit the EXAMTREE_NEON_BACKUP_FRESHNESS_FAILED log marker for a Cloud Monitoring email alert.

Its own Cloud Run Job and examtree-neon-watchdog read-only service account get bucket-scoped objectViewer only. The script reuses the existing Scheduler invoker identity. It never deletes or modifies backups.

## Activate after first encrypted daily backup succeeds

Confirm the existing 03:30 schedule is ENABLED and that a valid encrypted dump + manifest were uploaded **today in India**. The notification channel created in the earlier setup is:

    projects/sarbedutech/notificationChannels/3875048863295925837

From Google Cloud Shell:

    cd ~/Functional-Interface
    git switch New-main
    git pull --ff-only origin New-main

    export FRESHNESS_ALERT_CHANNEL='projects/sarbedutech/notificationChannels/3875048863295925837'
    bash ops/neon-backup-freshness/deploy.sh --apply
    unset FRESHNESS_ALERT_CHANNEL

This can incur small extra Cloud Build, Cloud Run, Scheduler, Storage operations, and Monitoring charges. The activation first deploys and runs one real read-only check, then creates the failure alert and **06:30 IST** Scheduler job. It rejects duplicate jobs or alerts. The main backup schedule, retention, secret and encrypted objects remain untouched.

## Verify

    gcloud run jobs executions list --job=examtree-neon-backup-freshness \
      --region=us-east1 --project=sarbedutech --limit=3
    gcloud scheduler jobs describe examtree-neon-backup-freshness-trigger \
      --project=sarbedutech --location=us-east1 \
      --format='yaml(name,state,schedule,timeZone)'
    gcloud monitoring policies list --project=sarbedutech \
      --format='value(displayName)'

Verify email notification delivery using Cloud Monitoring; do not corrupt or delete real backups just to simulate an alert. Scheduler HTTP success by itself confirms only that Cloud Run execution was requested; also inspect successful object pairs and job executions.

## Important limitations

- A failure of the **watchdog's own Scheduler** that prevents it from starting produces no watchdog failure log. A fully independent uptime monitor or metric-absence policy can cover that later.
- The watcher checks *recency and existence*, not decryptability; primary backup tests GPG and downloaded object integrity. Periodically repeat an isolated restore drill.
- Email alert delivery is only effective if the Cloud Monitoring email channel can actually deliver to its configured address.
- This does not create or rotate the encryption key and does not touch the manual Oct 11 recovery archive.

Pause just the watchdog:

    gcloud scheduler jobs pause examtree-neon-backup-freshness-trigger \
      --project=sarbedutech --location=us-east1
