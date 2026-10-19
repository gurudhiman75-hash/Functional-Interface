#!/usr/bin/env python3
"""One-shot, fail-closed Examtree production OIDC health probe via Cloud Run V2.

Defaults to READ ONLY. --run additionally requires the explicit approval
EXAMTREE_QS_PROD_OIDC_V2_APPROVED=yes and creates/runs two FIXED jobs, each
using an immutable digest of the already deployed private production service
image, an existing least-privilege runtime identity, and GET /health only.

No IAM grants, Cloud Tasks resume, scheduler, dispatcher, production approvals,
database operations, secret values, generation or student publication.
Do NOT rerun --run after a failed/disconnected attempt: use check-only mode.
Jobs persist for forensic inspection and cannot be overwritten by this script.
"""
import argparse
import importlib.util
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

SRC = Path(__file__).with_name("validate-examtree-qs-prod-native-oidc-v2.py")
_spec = importlib.util.spec_from_file_location("qs_prod_v2_validate", SRC)
if _spec is None or _spec.loader is None:
    raise SystemExit("STOP: validated V2 definition unavailable")
validator = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(validator)
native = validator.native
PROJECT = "sarbedutech"
REGION = "asia-south1"
ROOT = f"projects/{PROJECT}/locations/{REGION}"
JOBS = {item[0] for item in native.PROBES}
ID = re.compile(r"^[a-z][a-z0-9-]{1,62}$")
OP = re.compile(r"^projects/(?:sarbedutech|1083299267005)/locations/asia-south1/operations/[A-Za-z0-9_-]+$")
EXEC = re.compile(r"^projects/(?:sarbedutech|1083299267005)/locations/asia-south1/jobs/(examtree-qs-prod-oidc-check-receiver|examtree-qs-prod-oidc-check-worker)/executions/[A-Za-z0-9-]+$")
ERR_STATUSES = {"INVALID_ARGUMENT", "PERMISSION_DENIED", "UNAUTHENTICATED", "FAILED_PRECONDITION", "NOT_FOUND", "RESOURCE_EXHAUSTED", "ALREADY_EXISTS", "UNAVAILABLE", "INTERNAL"}

class GateError(Exception):
    pass

def safe_api(method, resource, token, body=None, query=""):
    """A single strict HTTPS authority, no redirects, bounded responses."""
    if method not in ("GET", "POST") or not resource.startswith(ROOT):
        raise GateError("unapproved API request")
    if any(c in resource for c in ("?", "#", "..", "%", "@")):
        raise GateError("unsafe Cloud Run resource path")
    url = "https://run.googleapis.com/v2/" + resource + query
    req = urllib.request.Request(
        url, method=method,
        data=(json.dumps(body, separators=(",", ":")).encode("utf-8") if body is not None else None),
        headers={"Authorization": "Bearer " + token,
                 "Accept": "application/json", "Content-Type": "application/json"})
    try:
        with validator.open_validation(req) as resp:
            code, content = resp.status, resp.read(32001)
    except urllib.error.HTTPError as exc:
        code, content = exc.code, exc.read(32001)
    except (OSError, urllib.error.URLError, TimeoutError):
        raise GateError("Cloud Run API unavailable or timed out; inspect resources before retry")
    if len(content) > 32000:
        raise GateError("oversized Cloud Run API response")
    try:
        obj = json.loads(content.decode("utf-8")) if content else {}
    except (ValueError, UnicodeDecodeError):
        raise GateError("non-JSON Cloud Run API response")
    if not isinstance(obj, dict):
        raise GateError("unexpected Cloud Run API response structure")
    if code < 200 or code >= 300:
        e = obj.get("error") or {}
        status = e.get("status") if isinstance(e, dict) else None
        status = status if status in ERR_STATUSES else "UNKNOWN"
        raise GateError("Cloud Run API returned HTTP " + str(code) + " / " + status +
                        " (details withheld; inspect job/permissions before retry)")
    return obj

def get_job(name, token):
    return safe_api("GET", ROOT + "/jobs/" + name, token)

def job_executions(name, token):
    doc = safe_api("GET", ROOT + "/jobs/" + name + "/executions", token, query="?pageSize=10")
    records = doc.get("executions", [])
    if not isinstance(records, list):
        raise GateError("unexpected execution list")
    return records

def verify_created_job(job, plan, token):
    obj = get_job(job, token)
    if obj.get("name") not in (ROOT + "/jobs/" + job,
                               f"projects/1083299267005/locations/{REGION}/jobs/{job}"):
        raise GateError("unexpected created job identity")
    template = obj.get("template") or {}
    actual = template.get("template") or {}
    expected = plan["template"]["template"]
    containers = actual.get("containers") or []
    wanted = expected["containers"][0]
    if (template.get("taskCount") != 1 or template.get("parallelism") != 1
        or actual.get("serviceAccount") != expected["serviceAccount"]
        or actual.get("maxRetries", 0) != 0
        or len(containers) != 1
        or containers[0].get("image") != wanted["image"]
        or containers[0].get("command") != ["node", "-e"]
        or containers[0].get("args") != wanted["args"]):
        raise GateError("created Job differs from approved health-only contract; do not execute")
    def env_dict(values):
        if not isinstance(values, list) or any(not isinstance(x, dict) for x in values):
            raise GateError("unexpected job environment")
        names = [x.get("name") for x in values]
        if len(names) != len(set(names)) or any(x.get("valueSource") for x in values):
            raise GateError("unexpected duplicate or secret environment binding")
        return {x.get("name"): x.get("value") for x in values}
    if env_dict(containers[0].get("env", [])) != env_dict(wanted["env"]):
        raise GateError("created job environment changed; do not execute")
    if str(actual.get("timeout", "75s")) not in ("75s", "75.0s"):
        raise GateError("unexpected execution timeout")
    return obj

def operation_done(name, token, max_seconds=120):
    if not OP.fullmatch(name):
        raise GateError("unrecognized Cloud Run operation identifier")
    end = time.monotonic() + max_seconds
    while time.monotonic() < end:
        operation = safe_api("GET", name, token)
        if operation.get("done") is True:
            if operation.get("error"):
                status = (operation["error"] or {}).get("status")
                status = status if status in ERR_STATUSES else "UNKNOWN"
                raise GateError("Cloud Run asynchronous operation failed: " + status)
            return operation.get("response") or {}
        time.sleep(4)
    raise GateError("Cloud Run operation still pending; inspect before retry")

def wait_execution(name, token):
    if not EXEC.fullmatch(name):
        raise GateError("unexpected Cloud Run execution name")
    end = time.monotonic() + 180
    while time.monotonic() < end:
        d = safe_api("GET", name, token)
        if d.get("completionTime"):
            if (d.get("taskCount") == 1 and d.get("succeededCount") == 1
                and not d.get("failedCount", 0) and not d.get("cancelledCount", 0)
                and not d.get("retriedCount", 0)):
                return
            raise GateError("Cloud Run execution did not succeed exactly once; inspect logs")
        time.sleep(5)
    raise GateError("execution not completed within time limit; inspect before retry")

def check_names(token):
    """Check for *any* partial resource before creating anything."""
    found = []
    for job, *_ in native.PROBES:
        try:
            obj = get_job(job, token)
        except GateError as exc:
            if "HTTP 404 / NOT_FOUND" in str(exc):
                print("PASS: not yet created: " + job, flush=True)
                continue
            raise
        found.append(job)
        print("EXISTS: " + job + " (no automatic overwrite/re-execution)", flush=True)
        runs = job_executions(job, token)
        print("INFO: existing executions for " + job + ": " + str(len(runs)) +
              (" or more" if len(runs) == 10 else ""), flush=True)
    return found

def produce_plans():
    plans=[]
    for job,service,account,marker in native.PROBES:
        if job not in JOBS or not ID.fullmatch(job):
            raise GateError("unapproved probe Job ID")
        endpoint,image=native.inspect_service(service)
        plan=validator.v2_job(job,image,account,service,marker,endpoint)
        plans.append((job,plan))
        print("PASS: pinned deployed image and existing private identity: " + job, flush=True)
    return plans

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--run", action="store_true",
                   help="create and execute two explicitly approved health-only Cloud Run V2 jobs")
    args=p.parse_args()
    print("EXAMTREE QS PROD OIDC V2 — " + ("CREATE + HEALTH ONLY" if args.run else "READ-ONLY RESOURCE CHECK"),flush=True)
    native.preflight()
    plans=produce_plans()
    token=validator.token_for_current_user()
    if not token:
        raise GateError("unable to obtain current user's OAuth access token")
    try:
        prior=check_names(token)
        if prior:
            print("STOP: existing probe jobs require manual inspection; never replay",flush=True)
            return 2
        if not args.run:
            print("RESULT: NO PROBE JOBS EXIST; NO CHANGES MADE",flush=True)
            return 0
        if __import__("os").environ.get("EXAMTREE_QS_PROD_OIDC_V2_APPROVED")!="yes":
            raise GateError("explicit EXAMTREE_QS_PROD_OIDC_V2_APPROVED=yes required")
        # Revalidate the exact same body before each write using documented V2 validateOnly.
        for job,plan in plans:
            print("CHECK: V2 validateOnly for " + job,flush=True)
            verdict, reason=validator.validate_request(job,plan,token)
            if verdict!="PASS":
                raise GateError("validation did not pass for " + job + ": " + reason)
        for job,plan in plans:
            native.preflight()
            print("CREATE: " + job,flush=True)
            # No validateOnly here: explicit V2 creation approved by the caller.
            operation=safe_api("POST", ROOT+"/jobs", token, plan, query="?jobId="+job)
            print("ACCEPTED: Cloud Run V2 create request for " + job,flush=True)
            operation_done(operation.get("name",""),token)
            verify_created_job(job,plan,token)
            if job_executions(job,token):
                raise GateError("job already has executions; do not repeat")
            native.preflight()
            print("EXECUTE: one signed health-only run for " + job,flush=True)
            op=safe_api("POST",ROOT+"/jobs/"+job+":run",token,{"validateOnly":False})
            print("ACCEPTED: one execution requested for " + job,flush=True)
            response=operation_done(op.get("name",""),token)
            ex_name=response.get("name")
            if not isinstance(ex_name,str) or not EXEC.fullmatch(ex_name):
                # Operation might complete without embedding response; only inspect.
                entries=job_executions(job,token)
                if len(entries)!=1 or not EXEC.fullmatch(entries[0].get("name","")):
                    raise GateError("execution reference unavailable; inspect logs, do not retry")
                ex_name=entries[0]["name"]
            wait_execution(ex_name,token)
            print("PASS: signed private GET /health returned ready=false: " + job,flush=True)
            native.preflight()
        print("RESULT: BOTH SERVICE-NATIVE HEALTH-ONLY JOBS COMPLETED; GENERATION OFF",flush=True)
        print("NOTE: NOT an end-to-end signed Cloud Tasks POST or generation test.",flush=True)
        return 0
    finally:
        del token

if __name__=="__main__":
    try:
        sys.exit(main())
    except (GateError, RuntimeError, TypeError, ValueError, KeyError) as e:
        print("STOP: "+str(e),file=sys.stderr)
        print("DO NOT RE-RUN --run. Inspect Cloud Run Jobs/Executions and paused queue.",file=sys.stderr)
        sys.exit(2)
