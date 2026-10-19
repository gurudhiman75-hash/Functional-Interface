#!/usr/bin/env python3
"""Independent Examtree QS production canary fail-safe cleanup.

Read-only by default. --apply is authorized ONLY inside the named isolated
Cloud Run cleanup Job after the pinned 15-minute canary deadline. Designed
for Cloud Scheduler -> Cloud Run Jobs :run, not a Cloud Shell nohup process.

Cleanup is deliberately idempotent: pause queue, clear receiver + worker
approval, clear dispatcher approval, verify all, and pause cleanup Scheduler.
No secrets printed; no GCP IAM grants, DB access, task deletion or publishing.
"""
import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys

PROJECT="sarbedutech"
REGION="asia-south1"
RECEIVER="examtree-qs-receiver-prod"
WORKER="examtree-universal-prod"
DISPATCHER="examtree-qs-dispatch-prod"
QUEUE="examtree-qs-prod"
SCHEDULER="examtree-qs-prod-canary-cleanup-trigger"
JOB="examtree-qs-prod-canary-cleanup"
EXPECTED_IDENTITIES={
    RECEIVER:"examtree-qs-receiver-prod@sarbedutech.iam.gserviceaccount.com",
    WORKER:"examtree-qs-worker-prod@sarbedutech.iam.gserviceaccount.com",
}
SVC_FLAGS={
    RECEIVER:"EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED",
    WORKER:"EXAMTREE_QS_PRODUCTION_WORKER_APPROVED",
}

def error_category(stderr):
    """Classify stderr without ever printing credentials, URLs or raw output."""
    normalized=(stderr or "").lower()
    if "artifactregistry.repositories.downloadartifacts" in normalized or (
        "artifact registry" in normalized and ("permission" in normalized or "denied" in normalized)
    ):
        return "IMAGE_ACCESS_DENIED"
    if "permission_denied" in normalized or "permission denied" in normalized or "403" in normalized:
        return "PERMISSION_DENIED"
    if "not found" in normalized or "404" in normalized:
        return "RESOURCE_NOT_FOUND"
    if "failed_precondition" in normalized:
        return "FAILED_PRECONDITION"
    if "invalid_argument" in normalized or "invalid argument" in normalized:
        return "INVALID_ARGUMENT"
    if "conflict" in normalized or "409" in normalized:
        return "CONFLICT"
    return "UNKNOWN_GCLOUD_FAILURE"


def call(args,timeout=180):
    try:
        result=subprocess.run(["gcloud",*args,"--project="+PROJECT],
                              text=True,capture_output=True,timeout=timeout,check=False)
    except (OSError,subprocess.TimeoutExpired):
        raise RuntimeError("gcloud unavailable/timeout")
    if result.returncode:
        # gcloud stderr can contain sensitive service metadata: never emit it.
        raise RuntimeError("GCP_"+error_category(result.stderr))
    return result.stdout

def describe(args):
    raw=call([*args,"--format=json"])
    try:
        value=json.loads(raw)
    except ValueError:
        raise RuntimeError("Invalid GCP metadata")
    if not isinstance(value,dict):
        raise RuntimeError("Unexpected GCP metadata")
    return value

def flags(service):
    data=describe(["run","services","describe",service,"--region="+REGION])
    spec=((data.get("spec") or {}).get("template") or {}).get("spec") or {}
    if spec.get("serviceAccountName")!=EXPECTED_IDENTITIES[service]:
        raise RuntimeError("Production service identity changed: "+service)
    containers=spec.get("containers") or []
    if len(containers)!=1:
        raise RuntimeError("Unexpected production container configuration")
    values=containers[0].get("env") or []
    if not isinstance(values,list) or len({x.get("name") for x in values})!=len(values):
        raise RuntimeError("Invalid service environment metadata")
    return {x.get("name"):x.get("value") for x in values}

def dispatcher_approval():
    """Inspect the exact dispatcher Job image container, without secret values."""
    data=describe(["run","jobs","describe",DISPATCHER,"--region="+REGION])
    obj=(data.get("spec") or {}).get("template") or {}
    # Support the gcloud v1 nested Job template representation.
    for _ in range(4):
        if not isinstance(obj,dict):
            raise RuntimeError("Unexpected dispatcher metadata")
        if "containers" in obj:
            break
        obj=obj.get("spec",obj.get("template",{}))
    containers=obj.get("containers") or []
    if len(containers)!=1:
        raise RuntimeError("Unexpected dispatcher container configuration")
    env=containers[0].get("env") or []
    if not isinstance(env,list) or any(not isinstance(x,dict) for x in env):
        raise RuntimeError("Invalid dispatcher environment")
    keys=[x.get("name") for x in env]
    if len(keys)!=len(set(keys)):
        raise RuntimeError("Duplicate dispatcher environment variable")
    return {x.get("name"):x.get("value") for x in env}.get(
        "EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED")


def queue_state():
    data=describe(["tasks","queues","describe",QUEUE,"--location="+REGION])
    return data.get("state")

def release_deadline(env,now):
    if env.get("EXAMTREE_QS_PRODUCTION_CANARY_ONLY")!="true":
        raise RuntimeError("Production canary scope not approved")
    raw=env.get("EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT","")
    if not re.fullmatch(r"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z",raw):
        raise RuntimeError("Invalid UTC release deadline")
    expires=dt.datetime.fromisoformat(raw.replace("Z","+00:00"))
    if not dt.datetime(2026,10,19,tzinfo=dt.timezone.utc)<=expires<=dt.datetime(2026,12,31,tzinfo=dt.timezone.utc):
        raise RuntimeError("Release timestamp outside approved 2026 window")
    if now<expires:
        raise RuntimeError("Canary deadline has not elapsed")
    return expires

def assert_job_context(env,now):
    if env.get("CLOUD_RUN_JOB")!=JOB or env.get("CLOUD_RUN_TASK_COUNT")!="1" or \
       env.get("CLOUD_RUN_TASK_INDEX")!="0" or \
       env.get("EXAMTREE_QS_PRODUCTION_CANARY_CLEANUP_APPROVED")!="true" or \
       env.get("GOOGLE_CLOUD_PROJECT")!=PROJECT:
        raise RuntimeError("Cleanup runtime is not the authorized Job")
    release_deadline(env,now)

def snapshot():
    actual={service:flags(service) for service in SVC_FLAGS}
    state=queue_state()
    return actual,state

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--apply",action="store_true",
                    help="destructive Cloud Run service config cleanup; requires named Job")
    args=ap.parse_args()
    print("EXAMTREE QS PROD CANARY CLEANUP — "+("APPLY" if args.apply else "READ ONLY"),flush=True)
    active=call(["config","get-value","project"]).strip()
    if active!=PROJECT:
        raise RuntimeError("Active GCP project must be sarbedutech")
    now=dt.datetime.now(dt.timezone.utc)
    if args.apply:
        assert_job_context(os.environ,now)
    configs,queue=snapshot()
    if queue not in ("PAUSED","RUNNING"):
        raise RuntimeError("Cannot inspect production queue state")
    for service,config in configs.items():
        value=config.get(SVC_FLAGS[service])
        if value not in ("true","false"):
            raise RuntimeError("Unknown approval state for "+service)
    if not args.apply:
        print("PASS: known production services and queue readable; no changes made")
        print("QUEUE: "+queue)
        for service,c in configs.items():
            print(service+" approved: "+c[SVC_FLAGS[service]])
        return 0

    # Only these exact production resources; no database writes or secret reads.
    if queue!="PAUSED":
        print("CLEANUP: pausing production queue first",flush=True)
        call(["tasks","queues","pause",QUEUE,"--location="+REGION])
    else:
        print("PASS: production queue already PAUSED",flush=True)
    # Skip revisions when approval is already FALSE: updates can require
    # Artifact Registry pulls and service identity impersonation unnecessarily.
    errors=[]
    modified=[]
    for service,flag in ((WORKER,SVC_FLAGS[WORKER]),(RECEIVER,SVC_FLAGS[RECEIVER])):
        if configs[service][flag]=="false":
            print("PASS: already disabled, no revision: "+service,flush=True)
            continue
        try:
            call(["run","services","update",service,"--region="+REGION,
                  "--update-env-vars="+flag+"=false","--quiet"],timeout=320)
            modified.append(service)
            print("CLEANUP: approval OFF for "+service,flush=True)
        except RuntimeError as e:
            errors.append(service+" ["+str(e)+"]")
    try:
        dispatch_before=dispatcher_approval()
        if dispatch_before=="false":
            print("PASS: dispatcher already disabled, no revision",flush=True)
        else:
            call(["run","jobs","update",DISPATCHER,"--region="+REGION,
                  "--update-env-vars=EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED=false",
                  "--quiet"],timeout=240)
            modified.append(DISPATCHER)
    except RuntimeError as e:
        errors.append(DISPATCHER+" ["+str(e)+"]")
    final,state=snapshot()
    if state!="PAUSED" or any(final[s].get(flag)!="false" for s,flag in SVC_FLAGS.items()):
        errors.append("receiver/worker/queue verification")
    try:
        if dispatcher_approval()!="false":
            errors.append("dispatcher verification")
    except RuntimeError as e:
        errors.append("dispatcher verification ["+str(e)+"]")
    if errors:
        raise RuntimeError("Cleanup incomplete for: "+",".join(errors)+
                           "; scheduler must remain active for authorized recovery")
    print("PASS: queue PAUSED, receiver/worker/dispatcher approvals FALSE",flush=True)
    # Stop recurring scheduler ONLY after all disabled flags are verified.
    sched=describe(["scheduler","jobs","describe",SCHEDULER,"--location="+REGION])
    if sched.get("state")=="ENABLED":
        call(["scheduler","jobs","pause",SCHEDULER,"--location="+REGION])
    elif sched.get("state")!="PAUSED":
        raise RuntimeError("Unexpected cleanup Scheduler state")
    if describe(["scheduler","jobs","describe",SCHEDULER,
                 "--location="+REGION]).get("state")!="PAUSED":
        raise RuntimeError("Scheduler still enabled after attempted cleanup")
    print("RESULT: CANARY CLEANUP COMPLETE; SCHEDULER PAUSED",flush=True)
    if not modified:
        print("NOTE: DISABLED CONFIG VERIFIED; true-to-false rollback NOT exercised",flush=True)
    else:
        print("NOTE: production approvals changed: "+",".join(modified),flush=True)
    return 0

if __name__=="__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as e:
        print("STOP: "+str(e),file=sys.stderr)
        print("NOTE: Never enable generation because cleanup failed.",file=sys.stderr)
        raise SystemExit(2)
