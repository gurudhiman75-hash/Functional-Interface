#!/usr/bin/env python3
"""Independent, release-pinned rollback for Examtree QS chapter review.
Default: read-only. --apply: Cloud Run Job only, after an explicit UTC deadline.
No database, task dispatch, question publishing, secret reading, or IAM edits.
"""
import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys
import uuid

PROJECT = "sarbedutech"
REGION = "asia-south1"
QUEUE = "examtree-qs-prod"
DISPATCHER = "examtree-qs-dispatch-prod"
JOB = "examtree-qs-prod-chapter-rollback"
SCHEDULER = "examtree-qs-prod-chapter-rollback-trigger"
SCHEDULER_ID = "examtree-qs-chapter-sched@sarbedutech.iam.gserviceaccount.com"
MAX_WINDOW = dt.timedelta(hours=24)
UTC = dt.timezone.utc
BLOCKED_RELEASE_IDS = {"c71b5ccb-8aa6-44e0-b0a5-01a3607a9c98", "48aaff58-d0cb-4345-be5f-491089b72f10"}

# Immutable release candidate digests and known-good 100%-serving baselines,
# captured during the October 23 chapter image verification. NEVER use LATEST.
SERVICES = {
    "examtree-api": {
        "baseline": "examtree-api-00002-mch",
        "sa": "examtree-api-prod-runtime@sarbedutech.iam.gserviceaccount.com",
        "digest": "sha256:da61519a43dd7ef0abc167910e197b8ce1615777d701e24ac89a7c209f2ea8f3",
        "off": ("EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_APPROVED",
                "EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_ROUTE_APPROVED"),
    },
    "examtree-qs-receiver-prod": {
        "baseline": "examtree-qs-receiver-prod-00025-27d",
        "sa": "examtree-qs-receiver-prod@sarbedutech.iam.gserviceaccount.com",
        "digest": "sha256:e0970ae19211b1d0fa13c0b021dde878210b614cd2586fee9d1e40e1229dd89c",
        "off": ("EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_APPROVED",
                "EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED"),
    },
    "examtree-universal-prod": {
        "baseline": "examtree-universal-prod-00021-5q7",
        "sa": "examtree-qs-worker-prod@sarbedutech.iam.gserviceaccount.com",
        "digest": "sha256:22b88e9a9f1fe1f5c78c7bb5dd42196797203967fb9fd10d4bf7e68e6ee5cf5a",
        "off": ("EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_APPROVED",
                "EXAMTREE_QS_PRODUCTION_WORKER_APPROVED"),
    },
}

class Stop(RuntimeError):
    pass

def parse_utc(raw):
    if not isinstance(raw, str) or not raw.endswith("Z"):
        raise Stop("UTC Z timestamp required")
    try:
        stamp = dt.datetime.fromisoformat(raw.replace("Z", "+00:00"))
    except ValueError:
        raise Stop("Invalid UTC timestamp") from None
    if stamp.utcoffset() != dt.timedelta(0):
        raise Stop("UTC timestamp required")
    return stamp

def release_window(env, now):
    """Expiry is independent of Cloud Shell, and must be <=24h after arming."""
    if env.get("EXAMTREE_QS_CHAPTER_ROLLBACK_ARMED") != "true" or \
       env.get("EXAMTREE_QS_CHAPTER_ROLLBACK_APPLY_APPROVED") != "true":
        raise Stop("Chapter rollback not explicitly armed")
    run_id = env.get("EXAMTREE_QS_CHAPTER_ROLLBACK_RELEASE_ID", "")
    try:
        parsed = uuid.UUID(run_id)
        if parsed.version != 4 or str(parsed) != run_id or run_id in BLOCKED_RELEASE_IDS:
            raise ValueError()
    except (ValueError, TypeError, AttributeError):
        raise Stop("Fresh UUIDv4 chapter release ID required") from None
    start = parse_utc(env.get("EXAMTREE_QS_CHAPTER_ROLLBACK_STARTED_AT"))
    expiry = parse_utc(env.get("EXAMTREE_QS_CHAPTER_ROLLBACK_EXPIRES_AT"))
    if not start < expiry or expiry - start > MAX_WINDOW or \
       start > now + dt.timedelta(minutes=2):
        raise Stop("Invalid 24-hour maximum chapter release window")
    return start, expiry

def safe_cli_failure_class(stderr):
    """Classify CLI errors without logging image URLs, secret values or tokens."""
    lowered = (stderr or "").lower()
    if "artifactregistry.repositories.downloadartifacts" in lowered:
        return "ARTIFACT_REGISTRY_DOWNLOAD_DENIED"
    if "iam.serviceaccounts.actas" in lowered:
        return "SERVICE_ACCOUNT_ACTAS_DENIED"
    if "secretmanager" in lowered and ("denied" in lowered or "permission" in lowered):
        return "SECRET_MANAGER_ACCESS_DENIED"
    if "permission" in lowered and ("denied" in lowered or "not granted" in lowered):
        return "IAM_PERMISSION_DENIED"
    if ("another operation" in lowered or "already in progress" in lowered or
            "currently being updated" in lowered or "concurrent update" in lowered):
        return "CONCURRENT_UPDATE"
    if "not found" in lowered and ("image" in lowered or "repository" in lowered):
        return "IMAGE_OR_REPOSITORY_NOT_FOUND"
    if ("unrecognized arguments" in lowered or "unrecognized argument" in lowered
            or "no such option" in lowered or "invalid choice" in lowered):
        return "CLI_ARGUMENT_REJECTED"
    if ("revision" in lowered and ("not ready" in lowered or "failed" in lowered)) or \
       "failed to start" in lowered:
        return "REVISION_NOT_READY"
    if "deadline exceeded" in lowered or "timed out" in lowered:
        return "OPERATION_TIMEOUT"
    if "quota" in lowered or "resource_exhausted" in lowered:
        return "QUOTA_OR_CAPACITY"
    if "failed precondition" in lowered or "failed_precondition" in lowered:
        return "FAILED_PRECONDITION"
    if "conflict" in lowered or "aborted" in lowered:
        return "CONFLICT"
    return "UNCLASSIFIED"


# Fixed whitelist prevents raw CLI stderr, secret names or resource IDs from
# leaking through the failure channel. Never print untrusted CLI output.
REPORTED_PERMISSIONS = (
    "run.services.update", "run.services.get", "run.operations.get",
    "run.revisions.get", "run.services.getIamPolicy",
    "iam.serviceAccounts.actAs", "artifactregistry.repositories.downloadArtifacts",
    "secretmanager.secrets.get", "secretmanager.versions.access",
    "serviceusage.services.use", "run.routes.invoke",
)


def safe_denied_permission(stderr):
    raw = stderr or ""
    if not re.search(r"denied|permission|forbidden|\\b403\\b", raw, re.I):
        return "NOT_SPECIFIED"
    for item in REPORTED_PERMISSIONS:
        if re.search(r"(?<![A-Za-z0-9_.])" + re.escape(item) +
                     r"(?![A-Za-z0-9_.])", raw, re.I):
            return item
    return "NOT_SPECIFIED"


def command(*parts):
    try:
        p = subprocess.run(["gcloud", *parts, "--project=" + PROJECT],
                           capture_output=True, text=True, timeout=240, check=False)
    except (OSError, subprocess.TimeoutExpired):
        raise Stop("gcloud unavailable or timed out") from None
    if p.returncode:
        # Never print raw CLI stderr/stdout (could contain credentials/URLs).
        # Release-blocking failures are instead grouped into fixed safe classes.
        raise Stop("Cloud operation failed: " + " ".join(parts[:3]) +
                   " [exit=" + str(p.returncode) + ", category=" +
                   safe_cli_failure_class(p.stderr) + ", permission=" +
                   safe_denied_permission(p.stderr) + "]") from None
    return p.stdout

def fetch(*parts):
    try:
        result = json.loads(command(*parts, "--format=json"))
    except (ValueError, TypeError):
        raise Stop("Invalid Cloud metadata response") from None
    if not isinstance(result, dict):
        raise Stop("Expected Cloud metadata object")
    return result

def env_values(spec):
    c = spec.get("containers") or []
    if len(c) != 1:
        raise Stop("Expected one Cloud Run container")
    rows = c[0].get("env") or []
    if len(rows) != len({x.get("name") for x in rows if isinstance(x, dict)}):
        raise Stop("Duplicate Cloud Run environment entries")
    if any(not isinstance(x, dict) or "name" not in x for x in rows):
        raise Stop("Invalid Cloud Run environment")
    return {x["name"]: x.get("value") for x in rows}

def template(doc):
    return ((doc.get("spec") or {}).get("template") or {}).get("spec") or {}

def target_revision(service, name):
    result = fetch("run", "revisions", "describe", name, "--region=" + REGION)
    if (result.get("metadata") or {}).get("name") != name:
        raise Stop("Revision name mismatch: " + service)
    if not any(x.get("type") == "Ready" and x.get("status") == "True"
               for x in (result.get("status") or {}).get("conditions") or []):
        raise Stop("Revision not Ready: " + service)
    return result

def positive_traffic(doc):
    return [x for x in (doc.get("status") or {}).get("traffic") or []
            if (x.get("percent") or 0) > 0]

def positive_spec_traffic(doc):
    return [x for x in (doc.get("spec") or {}).get("traffic") or []
            if (x.get("percent") or 0) > 0]

def validate_service(service, config, expected_expiry=None):
    doc = fetch("run", "services", "describe", service, "--region=" + REGION)
    baseline = target_revision(service, config["baseline"])
    if baseline.get("spec", {}).get("serviceAccountName") != config["sa"]:
        raise Stop("Baseline service-account mismatch: " + service)
    if any(env_values(baseline["spec"]).get(flag) == "true" for flag in config["off"]):
        raise Stop("Baseline is not chapter-disabled: " + service)
    # Receiver/worker baselines must additionally be fully inactive.
    if service != "examtree-api" and any(
        env_values(baseline["spec"]).get(flag) != "false"
        for flag in config["off"] if flag != "EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_APPROVED"
    ):
        raise Stop("Baseline execution approval is not false: " + service)
    current = positive_traffic(doc)
    if len(current) != 1 or current[0].get("percent") != 100:
        raise Stop("Unexpected live traffic split: " + service)
    live = current[0].get("revisionName")
    if not isinstance(live, str) or not live.startswith(service + "-"):
        raise Stop("Unexpected serving revision: " + service)
    if live != config["baseline"]:
        rev = target_revision(service, live)
        if rev.get("spec", {}).get("serviceAccountName") != config["sa"]:
            raise Stop("Release service-account mismatch: " + service)
        if not (rev.get("status", {}).get("imageDigest") or "").endswith(
            "@" + config["digest"]
        ):
            raise Stop("Unrecognized live release image: " + service)
        values = env_values(rev["spec"])
        approval_states = [values.get(flag) for flag in config["off"]]
        if any(x not in ("true", "false", None) for x in approval_states):
            raise Stop("Invalid release approval values: " + service)
        if "true" in approval_states:
            if any(x != "true" for x in approval_states):
                raise Stop("Partial release approvals: " + service)
            observed_expiry = values.get("EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_EXPIRES_AT")
            if not observed_expiry or (expected_expiry is not None and observed_expiry != expected_expiry):
                raise Stop("Release expiry mismatch: " + service)
            if not values.get("EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_SCOPE_JSON"):
                raise Stop("Release canonical scope missing: " + service)
            if values.get("EXAMTREE_API_RUNTIME") != "cloud-run" or values.get("EXAMTREE_API_STAGING") != "false":
                raise Stop("Release runtime/staging mismatch: " + service)
    return doc, live

def assert_job(env):
    if env.get("CLOUD_RUN_JOB") != JOB or env.get("CLOUD_RUN_TASK_COUNT") != "1" or \
       env.get("CLOUD_RUN_TASK_INDEX") != "0" or \
       env.get("GOOGLE_CLOUD_PROJECT") != PROJECT:
        raise Stop("Apply only permitted in exact singleton Cloud Run Job")

def verify_scheduler():
    doc = fetch("scheduler", "jobs", "describe", SCHEDULER, "--location=" + REGION)
    uri = "https://run.googleapis.com/v2/projects/" + PROJECT + "/locations/" + \
          REGION + "/jobs/" + JOB + ":run"
    target = doc.get("httpTarget") or {}
    if target.get("uri") != uri or target.get("httpMethod") != "POST" or \
       (target.get("oauthToken") or {}).get("serviceAccountEmail") != SCHEDULER_ID:
        raise Stop("Scheduler target or OAuth identity mismatched")
    if doc.get("state") not in ("ENABLED", "PAUSED"):
        raise Stop("Unknown scheduler state")
    return doc["state"]

def verify_disabled(service, config):
    doc = fetch("run", "services", "describe", service, "--region=" + REGION)
    traffic = positive_traffic(doc)
    desired = positive_spec_traffic(doc)
    if len(traffic) != 1 or len(desired) != 1 or \
       traffic[0].get("percent") != 100 or desired[0].get("percent") != 100 or \
       traffic[0].get("revisionName") != config["baseline"] or \
       desired[0].get("revisionName") != config["baseline"] or \
       desired[0].get("latestRevision") is True:
        raise Stop("Rollback traffic not pinned to baseline: " + service)
    values = env_values(template(doc))
    if any(values.get(flag) != "false" for flag in config["off"]):
        raise Stop("Latest service template approval not false: " + service)

def dispatcher_approved():
    doc = fetch("run", "jobs", "describe", DISPATCHER, "--region=" + REGION)
    obj = doc.get("spec") or {}
    for _ in range(6):
        if "containers" in obj:
            break
        obj = obj.get("template") or obj.get("spec") or {}
    return env_values(obj).get("EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED")

def perform_rollback(expected_expiry=None):
    # A failed later step MUST leave the queue paused and scheduler enabled.
    queue = fetch("tasks", "queues", "describe", QUEUE, "--location=" + REGION)
    if queue.get("state") not in ("PAUSED", "RUNNING"):
        raise Stop("Unrecognized production queue state")
    if queue["state"] != "PAUSED":
        command("tasks", "queues", "pause", QUEUE, "--location=" + REGION)
    if fetch("tasks", "queues", "describe", QUEUE,
             "--location=" + REGION).get("state") != "PAUSED":
        raise Stop("Failed to pause production queue")
    failures = []
    try:
        if dispatcher_approved() != "false":
            command("run", "jobs", "update", DISPATCHER, "--region=" + REGION,
                    "--update-env-vars=EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED=false",
                    "--quiet")
        if dispatcher_approved() != "false":
            raise Stop("Dispatcher remains approved")
    except Stop as exc:
        failures.append(str(exc))
    # Stop new admin enqueue first, then receiver and worker routes.
    for service, cfg in SERVICES.items():
        try:
            validate_service(service, cfg, expected_expiry)
            doc = fetch("run", "services", "describe", service, "--region=" + REGION)
            flags = env_values(template(doc))
            if any(flags.get(key) != "false" for key in cfg["off"]):
                updates = ",".join(key + "=false" for key in cfg["off"])
                command("run", "services", "update", service, "--region=" + REGION,
                        "--update-env-vars=" + updates, "--no-traffic", "--quiet")
            # Pin previously verified Ready, disabled baseline; never --to-latest.
            command("run", "services", "update-traffic", service,
                    "--region=" + REGION,
                    "--to-revisions=" + cfg["baseline"] + "=100", "--quiet")
            verify_disabled(service, cfg)
            print("PASS: verified disabled baseline for " + service, flush=True)
        except Stop as exc:
            failures.append(str(exc))
    if failures:
        raise Stop("Rollback incomplete; Scheduler must remain enabled: " +
                   "; ".join(failures))
    if fetch("tasks", "queues", "describe", QUEUE,
             "--location=" + REGION).get("state") != "PAUSED":
        raise Stop("Queue not paused after rollback")
    if dispatcher_approved() != "false":
        raise Stop("Dispatcher not disabled after rollback")
    for service, cfg in SERVICES.items():
        verify_disabled(service, cfg)
    if verify_scheduler() == "ENABLED":
        command("scheduler", "jobs", "pause", SCHEDULER, "--location=" + REGION)
    if verify_scheduler() != "PAUSED":
        raise Stop("Unable to verify scheduler paused")
    print("RESULT: CHAPTER ROLLBACK COMPLETE; no generation approval", flush=True)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true",
                        help="scheduled post-deadline release rollback only")
    args = parser.parse_args()
    if command("config", "get-value", "project").strip() != PROJECT:
        raise Stop("Wrong active project")
    now = dt.datetime.now(UTC)
    if args.apply:
        assert_job(os.environ)
        _, expiry = release_window(os.environ, now)
        if verify_scheduler() != "ENABLED":
            raise Stop("Rollback Scheduler is not independently armed")
        if now < expiry:
            print("PASS: deadline not reached; no changes", flush=True)
            return 0
        perform_rollback(os.environ["EXAMTREE_QS_CHAPTER_ROLLBACK_EXPIRES_AT"])
    else:
        # Read-only operator preflight, never reads secrets.
        state = verify_scheduler()
        for service, cfg in SERVICES.items():
            validate_service(service, cfg)
        q = fetch("tasks", "queues", "describe", QUEUE, "--location=" + REGION)
        print("CHECK: private chapter rollback baseline and release digests validated")
        print("QUEUE: " + str(q.get("state")) + "; SCHEDULER: " + state)
        print("NO CHANGES MADE")
    return 0

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Stop as exc:
        print("STOP: " + str(exc), file=sys.stderr)
        raise SystemExit(2)
