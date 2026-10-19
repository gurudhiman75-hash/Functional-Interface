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

def call(args,timeout=180):
    try:
        result=subprocess.run(["gcloud",*args,"--project="+PROJECT],
                              text=True,capture_output=True,timeout=timeout,check=False)
    except (OSError,subprocess.TimeoutExpired):
        raise RuntimeError("gcloud unavailable/timeout")
    if result.returncode:
        # gcloud stderr can contain sensitive service metadata: never emit it.
        raise RuntimeError("Google Cloud command failed")
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
    # Both must be set false. Do not fail early if one write fails:
    # attempt the other service even if a prior step returned nonzero.
    errors=[]
    for service,flag in ((WORKER,SVC_FLAGS[WORKER]),(RECEIVER,SVC_FLAGS[RECEIVER])):
        try:
            call(["run","services","update",service,"--region="+REGION,
                  "--update-env-vars="+flag+"=false","--quiet"],timeout=320)
            print("CLEANUP: approval OFF for "+service,flush=True)
        except RuntimeError:
            errors.append(service)
    try:
        call(["run","jobs","update",DISPATCHER,"--region="+REGION,
              "--update-env-vars=EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED=false",
              "--quiet"],timeout=240)
    except RuntimeError:
        errors.append(DISPATCHER)
    final,state=snapshot()
    if state!="PAUSED" or any(final[s].get(flag)!="false" for s,flag in SVC_FLAGS.items()):
        errors.append("verification")
    if errors:
        raise RuntimeError("Cleanup incomplete for: "+",".join(errors)+
                           "; scheduler remains active to retry")
    print("PASS: queue PAUSED and receiver/worker approvals FALSE",flush=True)
    # Stop recurring scheduler ONLY after both flags have been verified OFF.
    call(["scheduler","jobs","pause",SCHEDULER,"--location="+REGION])
    print("RESULT: CANARY CLEANUP COMPLETE; SCHEDULER PAUSED",flush=True)
    return 0

if __name__=="__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as e:
        print("STOP: "+str(e),file=sys.stderr)
        print("NOTE: Never enable generation because cleanup failed.",file=sys.stderr)
        raise SystemExit(2)
