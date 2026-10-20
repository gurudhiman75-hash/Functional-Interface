#!/usr/bin/env python3
"""Read-only production QS serving drift report; no secrets, tokens, or writes.

Inspect the revision currently serving traffic, not the latest-created revision.
Only report environment KEY NAMES and classification; never print values,
secret names, URIs, IAM credentials, or gcloud stderr.
"""
import json
import re
import subprocess
import sys

from qs_prod_serving_revision import serving_revision_name, _env, _single_container

P = "sarbedutech"
R = "asia-south1"
SERVICES = (
    ("examtree-qs-receiver-prod", "EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED",
     "examtree-qs-receiver-prod@sarbedutech.iam.gserviceaccount.com"),
    ("examtree-universal-prod", "EXAMTREE_QS_PRODUCTION_WORKER_APPROVED",
     "examtree-qs-worker-prod@sarbedutech.iam.gserviceaccount.com"),
)
SAFE_NAME = re.compile(r"^[A-Z][A-Z0-9_]{0,94}$")


def get(*args):
    try:
        p = subprocess.run(["gcloud", *args, "--project=" + P, "--format=json"],
                           capture_output=True, text=True, timeout=90, check=False)
    except (OSError, subprocess.TimeoutExpired):
        raise RuntimeError("gcloud command unavailable or timed out") from None
    if p.returncode != 0:
        raise RuntimeError("GCP read-only metadata lookup failed") from None
    try:
        obj = json.loads(p.stdout)
        if not isinstance(obj, dict):
            raise ValueError()
        return obj
    except ValueError:
        raise RuntimeError("GCP metadata not a JSON object") from None


def _safe(name):
    return name if isinstance(name, str) and SAFE_NAME.fullmatch(name) else "<invalid-key-name>"


def analyse(name, flag, identity, svc, rev):
    """No output of sensitive environment values or secret references."""
    live_name = serving_revision_name(svc, name)
    if (rev.get("metadata") or {}).get("name") != live_name:
        raise ValueError("serving revision identity is inconsistent")
    conditions = (rev.get("status") or {}).get("conditions") or []
    ready = any(isinstance(c, dict) and c.get("type") == "Ready" and c.get("status") == "True"
                for c in conditions)
    target = (((svc.get("spec") or {}).get("template") or {}).get("spec") or {})
    serving = rev.get("spec") or {}
    dc, lc = _single_container(target), _single_container(serving)
    de, le = _env(dc), _env(lc)
    def flag_state(items):
        x = items.get(flag)
        return x[0] if x and x[0] in ("true", "false") and not x[1] else "MISSING_OR_UNSAFE"

    print("SERVICE:", name)
    print("SERVING_REVISION:", live_name)
    print("SERVING_READY:", str(ready))
    print("APPROVAL_TEMPLATE:", flag_state(de))
    print("APPROVAL_SERVING:", flag_state(le))
    issues = []
    if not ready:
        issues.append("serving revision not Ready")
    if serving.get("serviceAccountName") != target.get("serviceAccountName") or serving.get("serviceAccountName") != identity:
        issues.append("runtime service account mismatch")
    if not dc.get("image") or dc.get("image") != lc.get("image"):
        issues.append("image mismatch")
    for k in ("command", "args"):
        if (dc.get(k) or []) != (lc.get(k) or []):
            issues.append(k + " mismatch")
    for key in sorted(set(de) | set(le)):
        if key not in de:
            print("ENV_DIFF:", _safe(key), "present only on serving revision")
        elif key not in le:
            print("ENV_DIFF:", _safe(key), "present only on service template")
        elif de[key] != le[key]:
            where = ("SECRET_REF_MISMATCH" if de[key][1] or le[key][1]
                     else "VALUE_MISMATCH")
            print("ENV_DIFF:", _safe(key), where)
        if key not in de or key not in le or de[key] != le[key]:
            issues.append("environment mismatch")
    if flag_state(le) != "false":
        issues.append("serving revision approval is not explicitly false")
    if flag_state(de) != "false":
        issues.append("service template approval is not explicitly false")
    result = len(issues) == 0
    print("SERVICE_RESULT:", "MATCHED_AND_DISABLED" if result else "DRIFT_OR_UNSAFE")
    return result


def main():
    print("EXAMTREE QS PROD -- SERVING REVISION DRIFT (READ ONLY)")
    queue = get("tasks", "queues", "describe", "examtree-qs-prod",
                "--location=" + R)
    scheduler = get("scheduler", "jobs", "describe",
                    "examtree-qs-prod-canary-cleanup-trigger",
                    "--location=" + R)
    print("QUEUE:", queue.get("state", "UNKNOWN"))
    print("CLEANUP_SCHEDULER:", scheduler.get("state", "UNKNOWN"))
    safe = queue.get("state") == "PAUSED" and scheduler.get("state") == "PAUSED"
    if not safe:
        print("STOP: queue or cleanup Scheduler not PAUSED")
        return 2
    for name, flag, sa in SERVICES:
        try:
            service = get("run", "services", "describe", name, "--region=" + R)
            revision = serving_revision_name(service, name)
            doc = get("run", "revisions", "describe", revision, "--region=" + R)
            safe &= analyse(name, flag, sa, service, doc)
        except (ValueError, RuntimeError) as exc:
            print("STOP:", name, "could not be verified:", str(exc))
            safe = False
    print("RESULT:", "SAFE_AND_MATCHED" if safe else "DRIFT_REQUIRES_CORRECTION")
    print("NO PRODUCTION CHANGES; NO SECRET VALUES READ; NO GENERATION")
    return 0 if safe else 2


if __name__ == "__main__":
    raise SystemExit(main())
