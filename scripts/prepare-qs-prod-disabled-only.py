#!/usr/bin/env python3
"""One controlled, disabled-only Examtree production QS IAM/binding release.

Default is check-only. --apply changes ONLY the pinned receiver service,
dispatcher job, and narrowly scoped IAM bindings. It never executes any job,
invokes a receiver, changes worker service, resumes a queue or scheduler,
or enables any production Question Studio approval flag.
"""
import argparse
import json
import subprocess
import sys
from urllib.parse import urlsplit
from qs_prod_serving_revision import serving_revision_name, verify_pinned_disabled_revision

P="sarbedutech"
N="1083299267005"
R="asia-south1"
RECEIVER="examtree-qs-receiver-prod"
WORKER="examtree-universal-prod"
JOB="examtree-qs-dispatch-prod"
QUEUE="examtree-qs-prod"
DB_SECRET="examtree-api-database-url"
WORKER_SECRET="examtree-qs-prod-universal-worker-token"
RECEIVER_SA=f"examtree-qs-receiver-prod@{P}.iam.gserviceaccount.com"
WORKER_SA=f"examtree-qs-worker-prod@{P}.iam.gserviceaccount.com"
DISPATCH_SA=f"examtree-qs-dispatch-prod@{P}.iam.gserviceaccount.com"
TASK_SA=f"examtree-qs-task-prod@{P}.iam.gserviceaccount.com"
AGENT_SA=f"service-{N}@gcp-sa-cloudtasks.iam.gserviceaccount.com"
RECEIVER_URL=f"https://{RECEIVER}-{N}.{R}.run.app"
WORKER_URL=f"https://{WORKER}-{N}.{R}.run.app"
TASK_URL=RECEIVER_URL+"/internal/question-studio/async-task"
DISABLED_BASELINES={
    RECEIVER:"examtree-qs-receiver-prod-00025-27d",
    WORKER:"examtree-universal-prod-00021-5q7",
}

def cloud(args, *, json_result=False, sensitive=False):
    # No shell, no xtrace, no printing full command/output on error.
    r=subprocess.run(["gcloud", *args, "--project="+P] +
                     (["--format=json"] if json_result else []),
                     text=True,capture_output=True,timeout=90)
    if r.returncode:
        # Only print the fixed verb and resource identifier, never stderr/stdout
        # (which can contain access tokens, URLs or service-account details).
        operation=" ".join(args[:3])
        if len(args)>3 and not sensitive and args[0] in ("iam","run","tasks","scheduler"):
            operation+=" ["+args[3]+"]"
        raise RuntimeError("GCP command failed: "+operation+
                           " (exit "+str(r.returncode)+"); details suppressed to protect credentials.")
    if json_result:
        return json.loads(r.stdout)
    return r.stdout

def ensure(condition,message):
    if not condition: raise RuntimeError("STOP: "+message)

def service(name):
    return cloud(["run","services","describe",name,"--region="+R],json_result=True)

def spec_env(spec):
    cs=spec.get("containers") or []
    return {v["name"]:v for v in cs[0].get("env",[])} if cs else {}

def env_val(env,key):
    return (env.get(key) or {}).get("value")

def secret_ref(env,key):
    return ((env.get(key) or {}).get("valueFrom") or {}).get("secretKeyRef",{}).get("name")

def policy(*args):
    return cloud([*args],json_result=True)

def has_grant(doc,role,member):
    return any(x.get("role")==role and member in x.get("members",[])
               for x in doc.get("bindings",[]))

def check_oidc_service(name,invoker):
    doc=policy("run","services","get-iam-policy",name,"--region="+R)
    grants=[x for x in doc.get("bindings",[]) if x.get("role")=="roles/run.invoker"]
    members={m for x in grants for m in x.get("members",[])}
    ensure(members=={"serviceAccount:"+invoker},
           name+" service-level invoker IAM differs from verified private-only contract")
    ensure(not any("allUsers" in x.get("members",[]) or
                   "allAuthenticatedUsers" in x.get("members",[])
                   for x in doc.get("bindings",[])),name+" has public service-level IAM")
    return doc

def endpoint_config(value,origin):
    if not value:return False
    v=urlsplit(value)
    return (v.scheme=="https" and v.netloc==urlsplit(origin).netloc
            and v.path in ("","/") and not v.query and not v.fragment)

def check_preflight():
    active=subprocess.run(["gcloud","config","get-value","project"],
                          capture_output=True,text=True,timeout=20)
    ensure(active.returncode==0 and active.stdout.strip()==P,"active project is not sarbedutech")
    info=cloud(["projects","describe",P],json_result=True)
    ensure(str(info.get("projectNumber"))==N,"project number differs")
    q=cloud(["tasks","queues","describe",QUEUE,"--location="+R],json_result=True)
    ensure(q.get("state")=="PAUSED","production queue is NOT PAUSED")
    ensure((q.get("rateLimits") or {}).get("maxConcurrentDispatches")==1 and
           (q.get("retryConfig") or {}).get("maxAttempts")==3,"production queue throttling changed")
    # Google-managed Cloud Tasks service agent cannot reliably be inspected
    # using iam.serviceAccounts.get, unlike our user-managed identities.
    for sa in (TASK_SA,RECEIVER_SA,WORKER_SA,DISPATCH_SA):
        cloud(["iam","service-accounts","describe",sa],json_result=True)
    project_iam=cloud(["projects","get-iam-policy",P],json_result=True)
    ensure(any(binding.get("role")=="roles/cloudtasks.serviceAgent" and
               "serviceAccount:"+AGENT_SA in binding.get("members",[]) and
               not binding.get("condition")
               for binding in project_iam.get("bindings",[])),
           "Cloud Tasks managed service agent lacks unconditional "
           "roles/cloudtasks.serviceAgent on project; do not apply bindings")
    service_docs={name:service(name) for name in (RECEIVER,WORKER)}
    for name,sa,caller in ((RECEIVER,RECEIVER_SA,TASK_SA),(WORKER,WORKER_SA,RECEIVER_SA)):
        d=service_docs[name]
        sp=((d.get("spec") or {}).get("template") or {}).get("spec") or {}
        ensure(sp.get("serviceAccountName")==sa,name+" runtime account unexpected")
        # Inspect the revision actually serving 100% traffic. Cloud Run can
        # retire an unserved latest-created revision after a safe rollback.
        # Never mistake that metadata difference for an unhealthy live service.
        try:
            live_name=serving_revision_name(d,name)
            live=cloud(["run","revisions","describe",live_name,"--region="+R],json_result=True)
            verify_pinned_disabled_revision(d,live,name,DISABLED_BASELINES[name],sa)
        except ValueError as exc:
            raise RuntimeError("STOP: "+name+" unsafe serving revision: "+str(exc)) from exc
        status=d.get("status") or {}
        ensure((status.get("url") or "").startswith("https://"+name+"-"),
               name+" reported service URL unexpected")
        check_oidc_service(name,caller)
        env=spec_env(sp)
        ensure(env_val(env,"EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED" if name==RECEIVER
                       else "EXAMTREE_QS_PRODUCTION_WORKER_APPROVED")=="false",
               name+" approval must stay explicitly false")
        if name==RECEIVER:
            ensure(env_val(env,"EXAMTREE_QUESTION_STUDIO_TASK_SERVICE_ACCOUNT")==TASK_SA,
                   "receiver OIDC service account mismatch")
            receiver_origins=(RECEIVER_URL,status.get("url") or "")
            worker_origins=(WORKER_URL,(service_docs[WORKER].get("status") or {}).get("url") or "")
            ensure(any(endpoint_config(env_val(env,"EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE"),origin)
                       for origin in receiver_origins),
                   "receiver OIDC audience not a verified production service origin")
            ensure(any(endpoint_config(env_val(env,"QUESTION_STUDIO_UNIVERSAL_WORKER_URL"),origin)
                       for origin in worker_origins),
                   "receiver worker URL not a verified production service origin")
            existing_db=secret_ref(env,"DATABASE_URL")
            ensure(not existing_db or existing_db==DB_SECRET,"receiver database secret is unexpected")
            ensure(not env_val(env,"DATABASE_URL"),"receiver database secret supplied in plaintext")
            ensure(secret_ref(env,"QUESTION_STUDIO_WORKER_TOKEN")==WORKER_SECRET,
                   "receiver worker token secret reference unexpected")
        else:
            ensure("DATABASE_URL" not in env,"compute worker must not receive database credentials")
            ensure(secret_ref(env,"QUESTION_STUDIO_WORKER_TOKEN")==WORKER_SECRET,
                   "worker token secret reference unexpected")
    job=cloud(["run","jobs","describe",JOB,"--region="+R],json_result=True)
    s=((job.get("spec") or {}).get("template") or {}).get("spec") or {}
    inner=(s.get("template") or {}).get("spec") or {}
    e=spec_env(inner)
    ensure(env_val(e,"EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED")=="false",
           "dispatcher approval must be explicitly false")
    ensure(s.get("taskCount")==1 and inner.get("maxRetries")==0,
           "dispatcher task or retry settings unexpected")
    ensure(not inner.get("serviceAccountName") or
           inner.get("serviceAccountName") in (DISPATCH_SA,f"{N}-compute@developer.gserviceaccount.com"),
           "dispatcher bound to an unexpected runtime principal")
    ensure(not env_val(e,"DATABASE_URL"),"dispatcher contains plaintext DATABASE_URL")
    ensure(not secret_ref(e,"DATABASE_URL") or secret_ref(e,"DATABASE_URL")==DB_SECRET,
           "dispatcher has unexpected database secret reference")
    for key in ("EXAMTREE_QS_PRODUCTION_DATABASE_BINDING_VERIFIED",
                "EXAMTREE_QS_PRODUCTION_RECEIVER_OIDC_VERIFIED",
                "EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED",
                "EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED",
                "EXAMTREE_QUESTION_STUDIO_TASK_DISPATCH_ENABLED",
                "EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED"):
        ensure(env_val(e,key)!="true","dispatcher has forbidden active setting "+key)
    sched=cloud(["scheduler","jobs","list","--location="+R],json_result=True)
    for item in sched:
        name=(item.get("name") or "").split("/")[-1]
        if name.startswith("examtree-qs-"):
            ensure(item.get("state")!="ENABLED","an Examtree QS scheduler is active: "+name)
    db_meta=cloud(["secrets","describe",DB_SECRET],json_result=True)
    ensure(db_meta.get("name","").endswith("/secrets/"+DB_SECRET),"production DB secret missing")
    token_meta=cloud(["secrets","describe",WORKER_SECRET],json_result=True)
    ensure(token_meta.get("name","").endswith("/secrets/"+WORKER_SECRET),"production worker token secret missing")
    # Identity check reads the existing production secret INTO PROCESS MEMORY ONLY.
    # NEVER prints, saves or logs the URL/password. This prevents staging DB binding.
    value=cloud(["secrets","versions","access","latest","--secret="+DB_SECRET],sensitive=True)
    u=urlsplit(value.strip())
    ensure(u.scheme in ("postgres","postgresql") and
           u.hostname in ("ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech",
                          "ep-polished-king-atj47i5y-pooler.c-9.us-east-1.aws.neon.tech")
           and u.path=="/neondb" and u.username and u.password,
           "database secret does not point to canonical production Neon main")
    del value
    print("PASS: target project, private Cloud Run services and valid production regional URLs")
    print("PASS: production Neon main binding verified privately; no credentials printed")
    print("PASS: generation approvals OFF; Cloud Tasks PAUSED; Scheduler inactive; worker isolated")
    return job

def grant(arguments,label):
    cloud(arguments)
    print("CONFIGURED:",label)

def apply():
    # Only explicit preflight-approved, narrowly scoped operations below.
    # NEVER enable approval=true, resume queues, execute jobs, or deploy images.
    grant(["secrets","add-iam-policy-binding",DB_SECRET,
           "--member=serviceAccount:"+RECEIVER_SA,
           "--role=roles/secretmanager.secretAccessor","--quiet"],
          "production DB read to receiver SA (secret scope)")
    grant(["secrets","add-iam-policy-binding",DB_SECRET,
           "--member=serviceAccount:"+DISPATCH_SA,
           "--role=roles/secretmanager.secretAccessor","--quiet"],
          "production DB read to dispatcher SA (secret scope)")
    for sa in (RECEIVER_SA,WORKER_SA):
        grant(["secrets","add-iam-policy-binding",WORKER_SECRET,
               "--member=serviceAccount:"+sa,
               "--role=roles/secretmanager.secretAccessor","--quiet"],
              "production worker shared token access (secret scope)")
    grant(["tasks","queues","add-iam-policy-binding",QUEUE,"--location="+R,
           "--member=serviceAccount:"+DISPATCH_SA,
           "--role=roles/cloudtasks.enqueuer","--quiet"],
          "dispatcher enqueue access (only production queue)")
    grant(["iam","service-accounts","add-iam-policy-binding",TASK_SA,
           "--member=serviceAccount:"+DISPATCH_SA,
           "--role=roles/iam.serviceAccountUser","--quiet"],
          "dispatcher may act as task OIDC identity (only production SA)")
    grant(["iam","service-accounts","add-iam-policy-binding",TASK_SA,
           "--member=serviceAccount:"+AGENT_SA,
           "--role=roles/iam.serviceAccountUser","--quiet"],
          "Cloud Tasks service agent may sign using task OIDC identity (only production SA)")
    grant(["run","services","update",RECEIVER,"--region="+R,
           "--update-secrets=DATABASE_URL="+DB_SECRET+":latest",
           "--update-env-vars=EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED=false",
           "--quiet"],"receiver has production DB secret binding (still DISABLED)")
    grant(["run","jobs","update",JOB,"--region="+R,
           "--service-account="+DISPATCH_SA,
           "--tasks=1","--parallelism=1","--max-retries=0",
           "--update-secrets=DATABASE_URL="+DB_SECRET+":latest",
           "--update-env-vars="+",".join((
               "EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED=false",
               "EXAMTREE_QUESTION_STUDIO_TASK_PROJECT="+P,
               "EXAMTREE_QUESTION_STUDIO_TASK_REGION="+R,
               "EXAMTREE_QUESTION_STUDIO_TASK_QUEUE="+QUEUE,
               "EXAMTREE_QUESTION_STUDIO_TASK_SERVICE_ACCOUNT="+TASK_SA,
               "EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE="+RECEIVER_URL,
               "EXAMTREE_QUESTION_STUDIO_TASK_HANDLER_URL="+TASK_URL)),
           "--quiet"],"dispatcher dedicated SA, production queue/OIDC and DB secret (still DISABLED)")
    q=cloud(["tasks","queues","describe",QUEUE,"--location="+R],json_result=True)
    receiver=service(RECEIVER)
    job=cloud(["run","jobs","describe",JOB,"--region="+R],json_result=True)
    re=spec_env(((receiver.get("spec") or {}).get("template") or {}).get("spec") or {})
    je=spec_env(((((job.get("spec") or {}).get("template") or {}).get("spec") or {}).get("template") or {}).get("spec") or {})
    jsa=(((((job.get("spec") or {}).get("template") or {}).get("spec") or {}).get("template") or {}).get("spec") or {}).get("serviceAccountName")
    ensure(q.get("state")=="PAUSED" and
           env_val(re,"EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED")=="false" and
           env_val(je,"EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED")=="false" and
           secret_ref(re,"DATABASE_URL")==DB_SECRET and
           secret_ref(je,"DATABASE_URL")==DB_SECRET and jsa==DISPATCH_SA,
           "post-change invariants failed; DO NOT activate")
    print("PASS: production receiver and dispatcher bindings verified; queue PAUSED, approvals OFF.")

def diagnose():
    """Independent read-only probes; reports EVERY failed permission/resource check."""
    print("=== READ-ONLY ACCESS DIAGNOSTICS; SECRET VALUES HIDDEN ===",flush=True)
    probes=[
        ("project metadata",["projects","describe",P]),
        ("paused production queue",["tasks","queues","describe",QUEUE,"--location="+R]),
        ("task OIDC identity",["iam","service-accounts","describe",TASK_SA]),
        ("receiver runtime identity",["iam","service-accounts","describe",RECEIVER_SA]),
        ("worker runtime identity",["iam","service-accounts","describe",WORKER_SA]),
        ("dispatcher runtime identity",["iam","service-accounts","describe",DISPATCH_SA]),
        ("Cloud Tasks service agent project IAM role",["projects","get-iam-policy",P]),
        ("receiver Cloud Run service",["run","services","describe",RECEIVER,"--region="+R]),
        ("worker Cloud Run service",["run","services","describe",WORKER,"--region="+R]),
        ("receiver service-level IAM",["run","services","get-iam-policy",RECEIVER,"--region="+R]),
        ("worker service-level IAM",["run","services","get-iam-policy",WORKER,"--region="+R]),
        ("dispatcher Cloud Run job",["run","jobs","describe",JOB,"--region="+R]),
        ("QS Scheduler listing",["scheduler","jobs","list","--location="+R]),
        ("Neon production Secret Manager metadata",["secrets","describe",DB_SECRET]),
        ("worker token Secret Manager metadata",["secrets","describe",WORKER_SECRET]),
    ]
    failed=0
    for label,args in probes:
        try:
            data=cloud(args,json_result=True)
            if label=="Cloud Tasks service agent project IAM role":
                ensure(any(b.get("role")=="roles/cloudtasks.serviceAgent" and
                           "serviceAccount:"+AGENT_SA in b.get("members",[]) and
                           not b.get("condition")
                           for b in data.get("bindings",[])),
                       "Cloud Tasks service agent missing project-level "
                       "roles/cloudtasks.serviceAgent")
            print("PASS:",label,flush=True)
        except (RuntimeError,ValueError,subprocess.TimeoutExpired) as err:
            failed+=1
            print("FAIL:",label,"("+str(err)+")",flush=True)
    try:
        text=cloud(["secrets","versions","access","latest","--secret="+DB_SECRET],
                   sensitive=True)
        u=urlsplit(text.strip())
        ensure(u.scheme in ("postgres","postgresql") and
               u.hostname in ("ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech",
                              "ep-polished-king-atj47i5y-pooler.c-9.us-east-1.aws.neon.tech") and
               u.path=="/neondb" and u.username and u.password,
               "DB secret is not the canonical production Neon main")
        del text
        print("PASS: production Neon secret access and destination (value hidden)",flush=True)
    except (RuntimeError,ValueError,subprocess.TimeoutExpired) as err:
        failed+=1
        print("FAIL: production Neon secret access/destination ("+str(err)+")",flush=True)
    print("RESULT:",failed,"read-only diagnostic failures; no configuration changed",flush=True)
    if failed:raise SystemExit(2)

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    mode=parser.add_mutually_exclusive_group()
    mode.add_argument("--apply",action="store_true",
                        help="apply approved disabled-only bindings after fail-closed preflight")
    mode.add_argument("--diagnose",action="store_true",
                        help="probe all read-only GCP dependencies; no configuration changes")
    args=parser.parse_args()
    print("EXAMTREE QS PRODUCTION DISABLED-ONLY CONFIGURATION",flush=True)
    if args.diagnose:
        diagnose()
        return
    check_preflight()
    if args.apply:
        apply()
        print("RESULT: DISABLED-ONLY CONFIGURATION COMPLETE; PRODUCTION GENERATION NOT ACTIVATED")
    else:
        print("RESULT: PREFLIGHT PASSED; NO CHANGES (use --apply only with release approval)")
if __name__=="__main__":
    try: main()
    except (RuntimeError,ValueError,KeyError,subprocess.TimeoutExpired) as e:
        print(str(e),file=sys.stderr)
        print("STOP: No production generation was enabled. Partial IAM/config changes may need inspection.",
              file=sys.stderr)
        raise SystemExit(2)
