#!/usr/bin/env python3
"""Validate Examtree production native OIDC health-only jobs WITHOUT creating them.

Uses Cloud Run V2 jobs.create?validateOnly=true, a documented validation mode
that does NOT persist a resource. Reuses existing pinned image digest, fixed
service identities and disabled-only preflight. No IAM, jobs, queue, DB,
receiver POST or generator changes. Does not prove the older V1 YAML deploy
path; any later live job must use the separately approved, validated V2 body.
"""
import importlib.util
import json
import re
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("prepare-examtree-qs-prod-native-oidc.py")
spec = importlib.util.spec_from_file_location("native_qs_prod", MODULE_PATH)
if spec is None or spec.loader is None:
    raise SystemExit("STOP: native verifier source unavailable")
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)

PROJECT = "sarbedutech"
REGION = "asia-south1"
ALLOWED_STATUS = {"INVALID_ARGUMENT", "PERMISSION_DENIED", "UNAUTHENTICATED",
                  "FAILED_PRECONDITION", "NOT_FOUND", "RESOURCE_EXHAUSTED",
                  "ALREADY_EXISTS", "UNAVAILABLE", "INTERNAL"}
SAFE_FIELD = re.compile(r"^[A-Za-z0-9_.\[\]/-]{1,160}$")


def token_for_current_user():
    try:
        p = subprocess.run(["gcloud", "auth", "print-access-token"],
                           capture_output=True, text=True, timeout=30, check=False)
    except (OSError, subprocess.TimeoutExpired):
        return None
    token = p.stdout.strip()
    if p.returncode != 0 or not 30 <= len(token) <= 10000:
        return None
    # Never log, persist or put the token in process argv/URLs.
    return token


def v2_job(job, image, account, service, marker, endpoint):
    # Same locked-down source and identity as the old V1 YAML; V2 field names
    # differ ("serviceAccount", "timeout"). This version is for validation only.
    env = {"QS_PROBE_JOB": job,
           "QS_PROBE_TARGET_SERVICE": service,
           "QS_PROBE_RUNTIME_EMAIL": account,
           "QS_PROBE_HEALTH_MARKER": marker,
           "QS_PROBE_ORIGIN": endpoint}
    return {
        "template": {
            "taskCount": 1,
            "parallelism": 1,
            "template": {
                "serviceAccount": account,
                "maxRetries": 0,
                "timeout": "75s",
                "containers": [{
                    "image": image,
                    "command": ["node", "-e"],
                    "args": [native.NODE_SOURCE],
                    "env": [{"name": k, "value": v} for k, v in env.items()]
                }]
            }
        }
    }


def validation_url(job):
    return ("https://run.googleapis.com/v2/projects/" + PROJECT
            + "/locations/" + REGION + "/jobs?"
            + urllib.parse.urlencode({"jobId": job, "validateOnly": "true"}))


def validate_request(job, body, token):
    req = urllib.request.Request(
        validation_url(job),
        data=json.dumps(body, separators=(",", ":")).encode("utf-8"),
        method="POST",
        headers={"Authorization": "Bearer " + token,
                 "Content-Type": "application/json",
                 "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            status = resp.status
            payload = resp.read(16001)
    except urllib.error.HTTPError as exc:
        status = exc.code
        payload = exc.read(16001)
    except (urllib.error.URLError, OSError, TimeoutError):
        return "REVIEW", "Cloud Run validation endpoint unavailable"
    if status in (200, 201):
        return "PASS", "V2 validateOnly accepted; no job created"
    try:
        data = json.loads(payload.decode("utf-8")) if len(payload) <= 16000 else {}
        err = data.get("error") or {}
    except (ValueError, UnicodeDecodeError, AttributeError):
        err = {}
    google_status = err.get("status")
    safe_status = google_status if google_status in ALLOWED_STATUS else "UNKNOWN"
    fields = []
    for d in (err.get("details", []) if isinstance(err.get("details"), list) else []):
        for x in (d.get("fieldViolations", []) if isinstance(d, dict) else []):
            f = x.get("field") if isinstance(x, dict) else None
            if isinstance(f, str) and SAFE_FIELD.fullmatch(f):
                fields.append(f)
    # NEVER output raw response message or the original job body.
    hint = "; field(s): " + ", ".join(fields[:4]) if fields else ""
    return ("REVIEW" if status in (401, 403, 429, 503) else "BLOCK",
            "HTTP " + str(status) + " / " + safe_status + hint)


def main():
    print("EXAMTREE QS PROD PRIVATE OIDC — V2 VALIDATION ONLY", flush=True)
    native.preflight()
    existing = native.run_json(["run", "jobs", "list", "--region=" + REGION])
    native.must(isinstance(existing, list), "job listing not available")
    names = {x.get("metadata", {}).get("name") or
             (x.get("name") or "").split("/")[-1] for x in existing}
    plans = []
    for job, service, account, marker in native.PROBES:
        native.must(job not in names, "probe job already exists; inspect: " + job)
        endpoint, image = native.inspect_service(service)
        plans.append((job, v2_job(job, image, account, service, marker, endpoint)))
        print("PASS: immutable image and dedicated service identity: " + job, flush=True)
    token = token_for_current_user()
    if not token:
        print("REVIEW: Cloud Shell user access token unavailable (no IAM changes)", flush=True)
        return 2
    issues = 0
    for job, body in plans:
        status, explanation = validate_request(job, body, token)
        print(status + ": " + job + " — " + explanation, flush=True)
        if status != "PASS":
            issues += 1
    del token
    native.preflight()
    print("NO JOBS CREATED, EXECUTED OR MODIFIED; CLOUD TASKS REMAIN PAUSED.")
    if issues:
        print("RESULT: VALIDATION INCOMPLETE; DO NOT RUN PRODUCTION PROBES.")
        return 2
    print("RESULT: V2 VALIDATION PASSED; NO JOBS CREATED OR EXECUTED.")
    print("NOTE: V1 gcloud jobs replace is not validated by this V2 check.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (RuntimeError, ValueError, TypeError, KeyError) as exc:
        # Existing source error texts contain fixed resource names, never tokens.
        print("STOP: production validation prerequisites failed: " + str(exc), file=sys.stderr)
        raise SystemExit(2)
