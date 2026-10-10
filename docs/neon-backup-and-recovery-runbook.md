# ExamTree — Neon backup and recovery runbook (10 October 2026)

## Current verified reality

Neon project `ExamTree` (`empty-sunset-07552954`) uses branch `main`
(`br-morning-bar-atttdxj4`) on the **Free** plan. The current project API
reports `history_retention_seconds=21600` (**six hours**), an empty scheduled
snapshot configuration, and **no snapshots**. Branch protection is off.

A separate Cloud Run staging branch
(`examtree-cloudrun-api-staging-20261010`,
`br-tiny-dust-at9gpdbj`) exists, created from main at
2026-10-10 05:13:18 UTC, but it currently has **no compute**. An old
copy-on-write branch is NOT a periodically updated, independent backup and
cannot be used to recover later writes on main.

This runbook adds a secure **operator-invoked** logical backup path and an
archive-verification path. They are not a replacement for scheduled offsite
storage or a real isolated restore drill. No new paid features are enabled.

## Prerequisites

- Cloud Shell access to GCP project `sarbedutech` and its existing secret
  `examtree-api-database-url`, whose value points to the single canonical
  Neon PostgreSQL database.
- `pg_dump`, `pg_restore`, `gpg`, `python3`, and `sha256sum`. The
  PostgreSQL client major version must be **17 or newer** for Neon PostgreSQL 17.
  Check: `pg_dump --version` and `pg_restore --version`.
- Adequate private disk space and a **separate private destination outside
  Neon and Cloud Shell**. Do not store a database archive in Git, a public
  bucket, an issue attachment, a shared conversation or an app static folder.
- A strong passphrase kept independently of the encrypted backup. Loss of
  this passphrase means the backup cannot be decrypted.

## 1. Make one encrypted logical backup — no gateway or schema changes

From Google Cloud Shell, after reviewing the scripts in `New-main`:

```bash
cd ~/Functional-Interface
git switch New-main
git pull --ff-only origin New-main
pg_dump --version
pg_restore --version

DATABASE_URL="$(gcloud secrets versions access latest \
  --project=sarbedutech \
  --secret=examtree-api-database-url)" \
bash scripts/backup-examtree-neon.sh "$HOME/examtree-private-backups"
```

The script parses the connection URL into libpq environment values (the
password never appears in argv), enforces hostname suffix `.neon.tech` and
verified TLS, requests a strong encryption passphrase twice from the terminal,
streams a `pg_dump --format=custom` directly to `gpg` AES-256 encryption,
and verifies the decrypted `pg_restore --list` catalogue without extracting
any data. The output consists of private
`examtree-neon-<UTC>-<pid>.dump.gpg` and its `.sha256` manifest.

On Google Cloud Shell, libpq's default `~/.postgresql/root.crt` is often
absent. The script now selects a readable system CA bundle (normally
`/etc/ssl/certs/ca-certificates.crt`) for `PGSSLROOTCERT` while retaining
`PGSSLMODE=verify-full`. If a trusted bundle cannot be found, the script
fails before creating any backup. To supply the OS bundle explicitly:

```bash
test -s /etc/ssl/certs/ca-certificates.crt
PGSSLROOTCERT=/etc/ssl/certs/ca-certificates.crt \
DATABASE_URL="$(gcloud secrets versions access latest \
  --project=sarbedutech --secret=examtree-api-database-url)" \
bash scripts/backup-examtree-neon.sh "$HOME/examtree-private-backups"
```

Do **not** work around missing CA roots by lowering `PGSSLMODE` to
`require`, `prefer`, or `disable`. PostgreSQL 16+ also supports
`PGSSLROOTCERT=system` where the client TLS library is configured with
OS root certificates. An explicit OS CA file is preferred for Cloud Shell.

It rejects output inside the repository. If any step fails, the intermediate
encrypted file is deleted. It never changes main, creates a customer order,
calls Cashfree, or starts a background worker. It also does **not**
automatically upload the archive anywhere.

If a private passphrase file is already managed separately, the optional
`EXAMTREE_BACKUP_KEY_FILE` environment variable may point at it, provided
the file is mode 600/400 and contains at least 24 bytes. Never commit or
upload a key file together with the archive.

## 2. Verify a copied archive

Copy both the `.dump.gpg` file and matching `.sha256` to a **private,
durable, independently controlled destination** (for example, private
object storage with restricted access and retention, or encrypted offline
storage). Store the decryption passphrase separately.

After copying back to a trusted operator machine, verify:

```bash
bash scripts/verify-examtree-neon-backup.sh \
  "/absolute/path/to/examtree-neon-YYYYMMDDTHHMMSSZ-PID.dump.gpg"
```

The verifier checks SHA256 of the **encrypted** file, successful GPG
decryption and successful parsing of the PostgreSQL archive catalogue.
It does not connect to or modify a database. This is a catalogue/integrity
test, NOT a full-row restore verification.

## 3. Full restore drill (required before production acceptance)

Do NOT restore this archive over `main` or over the currently used Cloud
Run/Render database. Use a newly provisioned, deliberately isolated,
non-production Neon branch with its own compute and a distinct blank
database, after reviewing available free compute allowance and potential
costs. Confirm the restore target's exact hostname, branch identity,
database and permissions before executing any `pg_restore` command.

An authorized operator should:

1. Freeze the archive metadata and checksum, and keep its passphrase secret.
2. Prepare a new **empty** throwaway database on an isolated branch, with no
   API service, Render worker, scheduler, webhook, or notification consumer
   using it. Do not point anything at the canonical branch.
3. Restore the decrypted custom archive with `pg_restore --exit-on-error`
   (omit owner/ACL restoration); log error counts, not row-level personal data.
4. Verify schema objects, key table counts, referential integrity, selected
   immutable test/result records and commerce entitlements against a
   consistent source inventory taken at backup time.
5. Check that no outbound jobs, webhooks, emails, or Cashfree operations ran
   during the drill. Record time taken, operator, restoration target branch,
   archive checksum, and final outcome.
6. Decommission the throwaway restore environment after sign-off; never
   repoint production to it without a separate migration decision.

**Backup scope:** `pg_dump` captures one PostgreSQL database's schema and
data. It does not capture cluster roles, Neon compute settings, Neon
branch/snapshot policies, Cloud Run secrets, Firebase users/Storage, Cashfree
provider records, frontend assets, or external file storage.
Separate backup/security controls must cover those systems.

## 4. Production backup policy still to decide

- Agree on recovery point objective (RPO) and recovery time objective (RTO).
- Design independent, automated, encrypted offsite backups (daily or more
  frequent as determined by the RPO), retention and test restores.
- Review Neon plan capabilities before enabling paid snapshot scheduling.
  The API currently reports no snapshots or snapshot schedule.
- Protect the main branch when supported by the selected Neon plan.
- Review main compute's `suspend_timeout_seconds=0` (no autosuspend);
  whether to change this depends on expected uptime and plan quota.
- Keep Render and Cloud Run API connection strings and background workers
  stable until application migration is explicitly approved.

## Verification boundary

As of this change, the repository provides an encryption+archive-verification
implementation and offline fixture CI. **No actual backup has yet been
produced or independently stored offsite**, and **no full restore drill**
has been run. Do not mark database disaster-recovery readiness complete until
those operational steps pass.
