#!/usr/bin/env python3
"""Read-only Examtree migration operations preflight.

Checks Cloud Run staging, isolation of background jobs, Neon GCS daily
backup and freshness schedules, encrypted archive/manifest presence, and
bucket retention. No secret reads, financial requests, deployment, or writes.
The results are *operational evidence*, not a production cutover command.
"""
import json
import os
import pathlib
import re
import subprocess
import sys

PROJECT = "sarbedutech"
ROOT = pathlib.Path(__file__).resolve().parents[1]
STAGING_API = "examtree-api-staging"
STAGING_JOB = "examtree-api-background-staging"
PRODUCTION_SCHEDULER = "examtree-api-background-every-5m"
BACKUP_JOB = "examtree-neon-backup-daily"
BACKUP_SCHEDULER = "examtree-neon-backup-daily-trigger"
FRESHNESS_JOB = "examtree-neon-backup-freshness"
FRESHNESS_SCHEDULER = "examtree-neon-backup-freshness-trigger"
BACKUP_PREFIX = "gs://sarbedutech/neon-backups/daily/"


def run(*args):
    try:
        p = subprocess.run(args, capture_output=True, text=True, timeout=35, check=False)
        return (p.returncode == 0, p.stdout)
    except (OSError, subprocess.TimeoutExpired):
        return (False, "")


def get_json(*args):
    ok, output = run(*args, "--format=json")
    if not ok:
        return None
    try:
        return json.loads(output)
    except ValueError:
        return None


def record(state, message):
    print(f"{state}: {message}")
    return state


def daily_pairs(paths):
    names = {x.rsplit("/", 1)[-1] for x in paths if x.startswith(BACKUP_PREFIX)}
    dumps = {x for x in names if x.endswith(".dump.gpg")}
    return sorted(x for x in dumps if x + ".sha256" in names)


def has_lifecycle_rule(bucket):
    rule = (bucket.get("lifecycle") or {}).get("rule") or []
    for item in rule:
        action, condition = item.get("action") or {}, item.get("condition") or {}
        prefixes = condition.get("matchesPrefix") or []
        if action.get("type") == "Delete" and "neon-backups/daily/" in prefixes and condition.get("age") == 30:
            return True
    return False


def bucket_access_protected(bucket):
    """GCS places publicAccessPrevention inside iamConfiguration.

    Do not treat a missing field as proof that access is protected.
    """
    if not isinstance(bucket, dict):
        return False
    iam = bucket.get("iamConfiguration") or {}
    uniform = (iam.get("uniformBucketLevelAccess") or {}).get("enabled") is True
    pap = iam.get("publicAccessPrevention", bucket.get("publicAccessPrevention"))
    return uniform and isinstance(pap, str) and pap.lower() == "enforced"


def schedule_matches(s, cron, tz):
    if not isinstance(s, dict):
        return False
    return (s.get("state") == "ENABLED" and s.get("schedule") == cron
            and s.get("timeZone") == tz)


def staging_safe(service):
    if not isinstance(service, dict):
        return False
    containers = (((service.get("spec") or {}).get("template") or {}).get("spec") or {}).get("containers") or []
    if len(containers) != 1:
        return False
    env = {e.get("name"): e.get("value") for e in containers[0].get("env") or []}
    return all([
        env.get("EXAMTREE_API_RUNTIME") == "cloud-run",
        env.get("EXAMTREE_API_STAGING") == "true",
        env.get("EXAMTREE_PAYMENT_PROVIDER") == "cashfree",
        env.get("CASHFREE_ENV") == "sandbox",
        env.get("OUTBOX_PUBLISHER_ENABLED") == "false",
        env.get("GENERATION_JOB_WORKER_ENABLED") == "false",
    ])


def description(name, kind, region):
    return get_json("gcloud", "run", kind, "describe", name,
                    "--project=" + PROJECT, "--region=" + region)


def executions(job, region):
    return get_json("gcloud", "run", "jobs", "executions", "list",
                    "--job=" + job, "--project=" + PROJECT,
                    "--region=" + region, "--limit=5")


def schedule(name, region):
    return get_json("gcloud", "scheduler", "jobs", "describe", name,
                    "--project=" + PROJECT, "--location=" + region)


def main():
    if len(sys.argv) != 1:
        raise SystemExit("Usage: python3 scripts/inspect-examtree-migration-operations.py")
    ok, project = run("gcloud", "config", "get-value", "project")
    if not ok or project.strip() != PROJECT:
        raise SystemExit("FAIL: select GCP project sarbedutech first; nothing changed")
    states = []
    print("EXAMTREE CLOUD RUN + BACKUP OPERATIONS — READ ONLY")
    print("No secrets, DB writes, deployments, worker runs or changes to Cloudflare/Render.")

    api = description(STAGING_API, "services", "asia-south1")
    states.append(record("PASS" if staging_safe(api) else "CHECK",
                         "Cloud Run staging has sandbox payment mode and disabled API background loops"
                         if staging_safe(api) else "Cloud Run staging flags unavailable or unsafe"))
    job = description(STAGING_JOB, "jobs", "asia-south1")
    states.append(record("PASS" if job else "CHECK", "staging background job definition "
                         + ("exists" if job else "not found")))
    if job:
        history = executions(STAGING_JOB, "asia-south1")
        states.append(record("PASS" if history == [] else "CHECK",
                             "staging background job has no executions"
                             if history == [] else "staging background job executions present or unavailable; inspect before proceeding"))
    prod_scheds = get_json("gcloud", "scheduler", "jobs", "list",
                           "--project=" + PROJECT, "--location=asia-south1")
    scheduled = (isinstance(prod_scheds, list) and any(
        x.get("name", "").endswith("/" + PRODUCTION_SCHEDULER)
        for x in prod_scheds if isinstance(x, dict)))
    scheduler_known = isinstance(prod_scheds, list)
    states.append(record("PASS" if scheduler_known and not scheduled else "CHECK",
                         "production outbox/FCM scheduler absent"
                         if scheduler_known and not scheduled else "production scheduler present or list unavailable: check overlapping Render workers"))

    backup_job = description(BACKUP_JOB, "jobs", "us-east1")
    states.append(record("PASS" if backup_job else "PENDING",
                         "daily Neon encrypted-backup Cloud Run Job "
                         + ("exists" if backup_job else "not verified")))
    backup_sched = schedule(BACKUP_SCHEDULER, "us-east1")
    backup_enabled = schedule_matches(backup_sched, "30 3 * * *", "Asia/Kolkata")
    states.append(record("PASS" if backup_enabled else "PENDING",
                         "03:30 IST daily backup scheduler " + ("enabled" if backup_enabled else "missing, disabled, or unexpected")))
    if backup_job:
        hist = executions(BACKUP_JOB, "us-east1")
        states.append(record("PASS" if isinstance(hist, list) and hist else "PENDING",
                             f"daily backup executions found: {len(hist)}" if isinstance(hist, list) and hist
                             else "no backup job executions verified"))

    ok, listing = run("gcloud", "storage", "ls", BACKUP_PREFIX, "--project=" + PROJECT)
    pairs = daily_pairs(listing.splitlines()) if ok else []
    states.append(record("PASS" if pairs else "PENDING",
                         f"daily encrypted archive/manifest pairs found: {len(pairs)}" if pairs
                         else "no daily encrypted archive/manifest pair verified"))
    bucket = get_json("gcloud", "storage", "buckets", "describe", "gs://sarbedutech")
    policy = has_lifecycle_rule(bucket or {})
    states.append(record("PASS" if policy else "PENDING",
                         "30-day lifecycle on daily-backup prefix "
                         + ("configured" if policy else "not verified")))
    protected = bucket_access_protected(bucket)
    states.append(record("PASS" if protected else "CHECK",
                         "backup bucket uniform access and public access prevention "
                         + ("enforced" if protected else "not fully verified")))

    freshness_job = description(FRESHNESS_JOB, "jobs", "us-east1")
    states.append(record("PASS" if freshness_job else "PENDING",
                         "independent freshness watchdog " + ("job exists" if freshness_job else "job missing")))
    freshness_sched = schedule(FRESHNESS_SCHEDULER, "us-east1")
    enabled = schedule_matches(freshness_sched, "30 6 * * *", "Asia/Kolkata")
    states.append(record("PASS" if enabled else "PENDING",
                         "06:30 IST freshness check " + ("scheduled" if enabled else "not verified")))
    if freshness_job:
        hist = executions(FRESHNESS_JOB, "us-east1")
        states.append(record("PASS" if isinstance(hist, list) and hist else "PENDING",
                             f"freshness watchdog executions found: {len(hist)}" if isinstance(hist, list) and hist
                             else "no freshness watchdog execution verified"))

    print(f"SUMMARY: passed={states.count('PASS')} pending={states.count('PENDING')} check={states.count('CHECK')}")
    print("NOTE: existence of executions/files does not establish their success or current-day freshness.")
    print("NOTE: do not start background jobs until Render's overlapping pollers are stopped.")
    if "CHECK" in states or "PENDING" in states:
        sys.exit(2)


if __name__ == "__main__":
    main()
