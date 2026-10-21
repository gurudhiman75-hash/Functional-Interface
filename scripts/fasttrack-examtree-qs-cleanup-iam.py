#!/usr/bin/env python3
"""One-pass Examtree QS cleanup IAM preparation; does not activate generation.

--check (default): read-only inventory and safety checks, no IAM edits.
--apply: with EXAMTREE_QS_CLEANUP_IAM_APPROVED=yes, create custom MINIMAL
project roles, bind mutation roles only on the two production Cloud Run services
and one dispatcher Job, queue-pause role on only the production Tasks queue,
and a short-lived Scheduler-pause project binding. Service Account User is
granted only on the existing identities required by those updates.

Never deploys/runs Cloud Run, alters flags, resumes Tasks, schedules anything,
creates a Question Studio request, or reads database/Secret Manager credentials.
"""
import argparse
import datetime as dt
import json
import os
import subprocess
import sys

PROJECT="sarbedutech"
REGION="asia-south1"
CLEANUP="examtree-qs-canary-cleanup@"+PROJECT+".iam.gserviceaccount.com"
SCHED_ID="examtree-qs-canary-trigger@"+PROJECT+".iam.gserviceaccount.com"
CLEANUP_JOB="examtree-qs-prod-canary-cleanup"
TRIGGER="examtree-qs-prod-canary-cleanup-trigger"
DISPATCHER="examtree-qs-dispatch-prod"
QUEUE="examtree-qs-prod"
SERVICES=("examtree-qs-receiver-prod","examtree-universal-prod")
FLAGS={
    SERVICES[0]:"EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED",
    SERVICES[1]:"EXAMTREE_QS_PRODUCTION_WORKER_APPROVED",
}
CUTOFF="2026-10-22T00:00:00Z"  # Reauthorize after this; pause-only project grant expires.
ROLES={
    "examtreeQsCanarySvcControl":("run.services.get","run.services.update","run.revisions.get"),
    "examtreeQsCanaryJobControl":("run.jobs.get","run.jobs.update"),
    "examtreeQsCanaryQueuePause":("cloudtasks.queues.get","cloudtasks.queues.pause"),
    "examtreeQsCanarySchedulerPause":(
        "cloudscheduler.jobs.get","cloudscheduler.jobs.pause",
        "run.operations.get","resourcemanager.projects.get"
    ),
}
class Stop(Exception): pass

def call(args,timeout=100):
    try:
        proc=subprocess.run(["gcloud",*args,"--project="+PROJECT],
                            capture_output=True,text=True,timeout=timeout,check=False)
    except (OSError,subprocess.TimeoutExpired):
        raise Stop("gcloud unavailable or timed out")
    if proc.returncode:
        # Raw API errors may include account names, service configuration or URLs.
        raise Stop("Google Cloud command failed: "+
                   " ".join(args[:min(4,len(args))])+
                   " (inspect Cloud Shell error locally; no blind retries)")
    return proc.stdout

def try_json(args):
    try:
        raw=call([*args,"--format=json"])
    except Stop:
        return None
    try:
        return json.loads(raw)
    except ValueError:
        return None

def required_json(args):
    value=try_json(args)
    if not isinstance(value,dict):
        raise Stop("required GCP metadata unavailable: "+" ".join(args[:3]))
    return value

def identity(spec):
    """Find one explicit Cloud Run service account, not a default."""
    found=[]
    def walk(obj):
        if isinstance(obj,dict):
            for k,v in obj.items():
                if k in ("serviceAccountName","serviceAccount") and isinstance(v,str):
                    found.append(v)
                elif isinstance(v,(dict,list)):
                    walk(v)
        elif isinstance(obj,list):
            for x in obj:walk(x)
    walk(spec)
    candidates={v for v in found if v.endswith("@"+PROJECT+".iam.gserviceaccount.com")}
    if len(candidates)!=1 or len(found)!=1:
        raise Stop("runtime identity missing or ambiguous")
    return next(iter(candidates))

def service_disabled(name):
    d=required_json(["run","services","describe",name,"--region="+REGION])
    sa=identity(d.get("spec") or {})
    spec=((d.get("spec") or {}).get("template") or {}).get("spec") or {}
    containers=spec.get("containers") or []
    if len(containers)!=1:raise Stop("unexpected service container layout: "+name)
    values=containers[0].get("env") or []
    if not isinstance(values,list) or any(not isinstance(e,dict) for e in values):
        raise Stop("unexpected service environment: "+name)
    keys=[x.get("name") for x in values]
    if len(set(keys))!=len(keys):
        raise Stop("duplicate production environment variables: "+name)
    env={x.get("name"):x.get("value") for x in values}
    if env.get(FLAGS[name])!="false":
        raise Stop("production service is not disabled: "+name)
    return sa

def get_job(name):
    return required_json(["run","jobs","describe",name,"--region="+REGION])

def safety():
    project=required_json(["projects","describe",PROJECT])
    if project.get("projectId")!=PROJECT:
        raise Stop("unexpected GCP project")
    queue=required_json(["tasks","queues","describe",QUEUE,"--location="+REGION])
    if queue.get("state")!="PAUSED":raise Stop("production queue is NOT PAUSED")
    dispatcher=get_job(DISPATCHER)
    dispatch_sa=identity(dispatcher.get("spec") or {})
    job=get_job(CLEANUP_JOB)
    if identity(job.get("spec") or {})!=CLEANUP:
        raise Stop("cleanup Job identity mismatch")
    schedule=required_json(["scheduler","jobs","describe",TRIGGER,"--location="+REGION])
    if schedule.get("state")!="PAUSED":
        raise Stop("cleanup Scheduler must remain PAUSED during IAM setup")
    target=schedule.get("httpTarget") or {}
    if target.get("uri")!=(
        "https://run.googleapis.com/v2/projects/"+PROJECT+"/locations/"+REGION+
        "/jobs/"+CLEANUP_JOB+":run"):
        raise Stop("unexpected Scheduler API target")
    if (target.get("oauthToken") or {}).get("serviceAccountEmail")!=SCHED_ID:
        raise Stop("unexpected Scheduler OAuth identity")
    cleanup_env={}
    def scan(obj):
        if isinstance(obj,dict):
            if "env" in obj and isinstance(obj["env"],list):
                for e in obj["env"]:
                    if isinstance(e,dict) and "name" in e:
                        cleanup_env[e["name"]]=e.get("value")
            for v in obj.values():scan(v)
        elif isinstance(obj,list):
            for v in obj:scan(v)
    scan(job.get("spec") or {})
    if cleanup_env.get("EXAMTREE_QS_PRODUCTION_CANARY_CLEANUP_APPROVED")!="false":
        raise Stop("cleanup Job must remain DISABLED during IAM setup")
    if cleanup_env.get("EXAMTREE_QS_PRODUCTION_CANARY_ONLY")!="false":
        raise Stop("cleanup Job canary scope must remain OFF")
    if "--help" not in json.dumps((job.get("spec") or {})):
        raise Stop("cleanup Job must be help-only during IAM setup")
    invoker=required_json(["run","jobs","get-iam-policy",CLEANUP_JOB,"--region="+REGION])
    if not any(b.get("role")=="roles/run.invoker" and
               "serviceAccount:"+SCHED_ID in b.get("members",[])
               for b in invoker.get("bindings",[])):
        raise Stop("Scheduler identity not granted invocation on cleanup Job")
    for s in SERVICES:
        service_accounts[s]=service_disabled(s)
    service_accounts[DISPATCHER]=dispatch_sa
    print("PASS: queue PAUSED, services OFF, cleanup Job help-only, Scheduler PAUSED",flush=True)
    print("PASS: three exact runtime service identities and Scheduler invoker",flush=True)

service_accounts={}

def ensure_role(name,perms):
    role="projects/"+PROJECT+"/roles/"+name
    current=try_json(["iam","roles","describe",name])
    if current is None:
        call(["iam","roles","create",name,
              "--title=Examtree QS Canary "+name,
              "--description=Short-lived cleanup-only permissions",
              "--permissions="+",".join(perms),
              "--stage=GA","--quiet"])
    else:
        if set(current.get("includedPermissions") or [])!=set(perms) or current.get("deleted"):
            raise Stop("existing custom role does not match reviewed minimal permissions: "+name)
    final=required_json(["iam","roles","describe",name])
    if set(final.get("includedPermissions") or [])!=set(perms):
        raise Stop("custom role verification mismatch: "+name)
    print("PASS: exact minimal role: "+name,flush=True)
    return role

def bind(args):
    call([*args,"--quiet"])
    print("PASS: applied reviewed IAM binding",flush=True)

def apply():
    if os.environ.get("EXAMTREE_QS_CLEANUP_IAM_APPROVED")!="yes":
        raise Stop("explicit EXAMTREE_QS_CLEANUP_IAM_APPROVED=yes required")
    if dt.datetime.now(dt.timezone.utc)>=dt.datetime.fromisoformat(CUTOFF.replace("Z","+00:00")):
        raise Stop("IAM expiry cutoff already elapsed; re-review release")
    roles={name:ensure_role(name,perms) for name,perms in ROLES.items()}
    member="serviceAccount:"+CLEANUP
    for name in SERVICES:
        bind(["run","services","add-iam-policy-binding",name,
              "--region="+REGION,"--member="+member,
              "--role="+roles["examtreeQsCanarySvcControl"]])
    bind(["run","jobs","add-iam-policy-binding",DISPATCHER,
          "--region="+REGION,"--member="+member,
          "--role="+roles["examtreeQsCanaryJobControl"]])
    bind(["tasks","queues","add-iam-policy-binding",QUEUE,
          "--location="+REGION,"--member="+member,
          "--role="+roles["examtreeQsCanaryQueuePause"]])
    # No grant of token creation or project-wide admin roles. Only actAs on
    # the exact existing service accounts (for Cloud Run revision updates).
    for account in sorted(set(service_accounts.values())):
        bind(["iam","service-accounts","add-iam-policy-binding",account,
              "--member="+member,"--role=roles/iam.serviceAccountUser"])
    # Cloud Scheduler has no per-job IAM policy for pause permission.
    # Grant ONLY jobs.pause/get + operation read with a strict time deadline.
    expression="request.time < timestamp('"+CUTOFF+"')"
    bind(["projects","add-iam-policy-binding",PROJECT,
          "--member="+member,"--role="+roles["examtreeQsCanarySchedulerPause"],
          "--condition=title=ExamtreeQsCanaryCleanupExpiry,expression="+expression])
    # Recheck still disabled after IAM changes.
    safety()
    print("RESULT: LIMITED CLEANUP IAM CONFIGURED; SCHEDULER STILL PAUSED, GENERATION OFF")

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--apply",action="store_true",help="grant reviewed minimal IAM bindings")
    opts=p.parse_args()
    print("EXAMTREE QS CANARY — "+("SCOPED IAM SETUP" if opts.apply else "READ-ONLY FAST CHECK"),flush=True)
    safety()
    if opts.apply:
        apply()
    else:
        print("RESULT: READY FOR REVIEWED IAM SETUP; NO CHANGES MADE")
    return 0

if __name__=="__main__":
    try:
        raise SystemExit(main())
    except Stop as exc:
        print("STOP: "+str(exc),file=sys.stderr)
        print("No queue resume, generation activation or Cloud Run execution requested.",file=sys.stderr)
        raise SystemExit(2)
