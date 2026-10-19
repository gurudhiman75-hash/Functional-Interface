#!/usr/bin/env python3
"""Isolated Examtree QS production service-native OIDC GET /health checks.

Default CHECK ONLY. --run creates and executes two tightly scoped Cloud Run
jobs after explicit approval, using PINNED existing Examtree production images
with a Node-only command override and the existing runtime identities.
Never grants IAM, resumes Cloud Tasks, enables production generation, calls
internal task POST, runs dispatcher, accesses database or changes service traffic.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from urllib.parse import urlsplit

PROJECT = "sarbedutech"
REGION = "asia-south1"
TASK_SA = "examtree-qs-task-prod@sarbedutech.iam.gserviceaccount.com"
RECEIVER_SA = "examtree-qs-receiver-prod@sarbedutech.iam.gserviceaccount.com"
PROBES = (
    ("examtree-qs-prod-oidc-check-receiver", "examtree-qs-receiver-prod", TASK_SA, "qs-receiver-prod"),
    ("examtree-qs-prod-oidc-check-worker", "examtree-universal-prod", RECEIVER_SA, "qs-universal-prod"),
)
NODE_SOURCE = r'''
"use strict";
(async () => {
  const job=process.env.CLOUD_RUN_JOB;
  const expectedJob=process.env.QS_PROBE_JOB;
  const service=process.env.QS_PROBE_TARGET_SERVICE;
  const expectedEmail=process.env.QS_PROBE_RUNTIME_EMAIL;
  const marker=process.env.QS_PROBE_HEALTH_MARKER;
  const origin=process.env.QS_PROBE_ORIGIN;
  const allowed={
    "examtree-qs-prod-oidc-check-receiver":["examtree-qs-receiver-prod","examtree-qs-task-prod@sarbedutech.iam.gserviceaccount.com","qs-receiver-prod"],
    "examtree-qs-prod-oidc-check-worker":["examtree-universal-prod","examtree-qs-receiver-prod@sarbedutech.iam.gserviceaccount.com","qs-universal-prod"]
  };
  if(job!==expectedJob || !Object.hasOwn(allowed,job)) throw Error("JOB_NOT_ALLOWLISTED");
  const cfg=allowed[job];
  if(service!==cfg[0] || expectedEmail!==cfg[1] || marker!==cfg[2]) throw Error("PROBE_TARGET_INVALID");
  const parsed=new URL(origin);
  if(parsed.protocol!=="https:" || parsed.hostname.startsWith(service+"-")!==true ||
     !parsed.hostname.endsWith(".run.app") || parsed.pathname!=="/" ||
     parsed.search || parsed.hash || parsed.username || parsed.password || parsed.port) {
    throw Error("PROBE_ORIGIN_INVALID");
  }
  const endpoint="http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/";
  const metaOpts={headers:{"Metadata-Flavor":"Google"},signal:AbortSignal.timeout(8000)};
  const emailRes=await fetch(endpoint+"email",metaOpts);
  if(!emailRes.ok || (await emailRes.text()).trim()!==expectedEmail) throw Error("JOB_RUNTIME_IDENTITY_MISMATCH");
  const identityRes=await fetch(endpoint+"identity?audience="+encodeURIComponent(origin),metaOpts);
  if(!identityRes.ok) throw Error("METADATA_IDENTITY_UNAVAILABLE");
  const token=(await identityRes.text()).trim();
  if(!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token) || token.length<64 || token.length>12000) throw Error("BAD_ID_TOKEN_FORMAT");
  const res=await fetch(origin+"/health",{method:"GET",redirect:"manual",
                    headers:{Authorization:"Bearer "+token},signal:AbortSignal.timeout(12000)});
  if(res.status!==200) throw Error("PRIVATE_HEALTH_HTTP_"+res.status);
  const text=await res.text();
  if(text.length>4096) throw Error("HEALTH_BODY_TOO_LARGE");
  const body=JSON.parse(text);
  if(body.status!=="ok" || body.service!==marker || body.ready!==false) throw Error("PROD_HEALTH_NOT_DISABLED");
  console.log("PASS: "+job+" signed private GET /health; ready=false");
})().catch(e => {
  const codes=["JOB_NOT_ALLOWLISTED","PROBE_TARGET_INVALID","PROBE_ORIGIN_INVALID","JOB_RUNTIME_IDENTITY_MISMATCH","METADATA_IDENTITY_UNAVAILABLE","BAD_ID_TOKEN_FORMAT","HEALTH_BODY_TOO_LARGE","PROD_HEALTH_NOT_DISABLED"];
  const code=String(e?.message||"");
  console.error("FAIL: signed health-only check: "+(codes.includes(code)||/^PRIVATE_HEALTH_HTTP_[0-9]{3}$/.test(code)?code:"NETWORK_OR_UNKNOWN"));
  process.exitCode=2;
});
'''.strip()


def command(args, timeout=120):
    try:
        return subprocess.run(args, capture_output=True, text=True, timeout=timeout, check=False)
    except (OSError, subprocess.TimeoutExpired):
        return None


def run_json(args):
    p=command(["gcloud", *args, "--project="+PROJECT, "--format=json"])
    if p is None or p.returncode:
        return None
    try:
        return json.loads(p.stdout)
    except ValueError:
        return None


def must(ok, reason):
    if not ok:
        raise RuntimeError(reason)


def preflight():
    p=command(["gcloud","config","get-value","project"],30)
    must(p is not None and p.returncode==0 and p.stdout.strip()==PROJECT,
         "active project must be sarbedutech")
    s=command([sys.executable,"scripts/prepare-qs-prod-disabled-only.py"],300)
    must(s is not None and s.returncode==0 and
         "RESULT: PREFLIGHT PASSED; NO CHANGES" in s.stdout,
         "production disabled-only preflight failed; no activation permitted")
    print("PASS: production queue PAUSED, generation approvals OFF, private IAM verified",flush=True)


def origin(url, name):
    try:
        p=urlsplit(url)
        if (p.scheme=="https" and p.hostname and p.hostname.startswith(name+"-") and
            p.hostname.endswith(".run.app") and not p.username and not p.password and
            p.port is None and p.path in ("","/") and not p.query and not p.fragment):
            return "https://"+p.hostname
    except (ValueError,TypeError):
        pass
    return None


def inspect_service(name):
    d=run_json(["run","services","describe",name,"--region="+REGION])
    must(isinstance(d,dict),"cannot read production service metadata: "+name)
    status=d.get("status") or {}
    revision=status.get("latestReadyRevisionName")
    must(revision and revision==status.get("latestCreatedRevisionName"),
         "production revision is not ready: "+name)
    endpoint=origin(status.get("url"),name)
    must(endpoint,"invalid production service origin: "+name)
    spec=((d.get("spec") or {}).get("template") or {}).get("spec") or {}
    containers=spec.get("containers") or []
    must(len(containers)==1,"unexpected service container topology: "+name)
    source=containers[0].get("image") or ""
    must(source.startswith("asia-south1-docker.pkg.dev/"+PROJECT+"/"),
         "not an approved Examtree Artifact Registry image")
    rev=run_json(["run","revisions","describe",revision,"--region="+REGION])
    must(isinstance(rev,dict),"cannot inspect production revision: "+name)
    rs=rev.get("status") or {}
    cs=rs.get("containerStatuses") or []
    digest=(cs[0].get("imageDigest") if len(cs)==1 else None) or rs.get("imageDigest")
    if isinstance(digest,str) and "@sha256:" in digest:
        digest=digest.split("@sha256:")[-1]
    if isinstance(digest,str) and digest.startswith("sha256:"):
        digest=digest[7:]
    if not isinstance(digest,str) or not re.fullmatch("[0-9a-f]{64}",digest):
        if "@sha256:" in source:
            digest=source.split("@sha256:")[-1]
        must(re.fullmatch("[0-9a-f]{64}",str(digest)) is not None,
             "immutable deployed image digest unavailable: "+name)
    image_base=source.split("@",1)[0].rsplit(":",1)[0]
    return endpoint,image_base+"@sha256:"+digest


def manifest(job, image, account, target, marker, endpoint):
    env={"QS_PROBE_JOB":job,"QS_PROBE_TARGET_SERVICE":target,
         "QS_PROBE_RUNTIME_EMAIL":account,"QS_PROBE_HEALTH_MARKER":marker,
         "QS_PROBE_ORIGIN":endpoint}
    return {
        "apiVersion":"run.googleapis.com/v1","kind":"Job",
        "metadata":{"name":job,"namespace":PROJECT},
        "spec":{"template":{"spec":{"taskCount":1,"parallelism":1,
           "template":{"spec":{"serviceAccountName":account,"maxRetries":0,
               "timeoutSeconds":"75s",
               "containers":[{"image":image,"command":["node","-e"],
                   "args":[NODE_SOURCE],
                   "env":[{"name":k,"value":v} for k,v in env.items()]}]
            }}}}}
    }


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--run",action="store_true",
                        help="create and run two isolated jobs with explicit approval")
    args=parser.parse_args()
    print("EXAMTREE QS PROD SERVICE-NATIVE OIDC: "+
          ("ONE-SHOT RUN" if args.run else "CHECK ONLY"),flush=True)
    preflight()
    existing=run_json(["run","jobs","list","--region="+REGION])
    must(isinstance(existing,list),
         "cannot list existing jobs or rule out accidental replacement")
    names={item.get("metadata",{}).get("name") or
           (item.get("name") or "").split("/")[-1] for item in existing}
    plans=[]
    for job,service,account,marker in PROBES:
        must(job not in names,"probe job already exists; inspect before retry: "+job)
        endpoint,image=inspect_service(service)
        plans.append((job,manifest(job,image,account,service,marker,endpoint)))
        print("PASS: pinned image, private origin and approved runtime contract: "+job,flush=True)
    if not args.run:
        print("RESULT: CHECK PASSED; NO JOBS CREATED OR EXECUTED",flush=True)
        return 0
    must(os.environ.get("EXAMTREE_QS_PROD_OIDC_HEALTH_PROBE_APPROVED")=="yes",
         "explicit EXAMTREE_QS_PROD_OIDC_HEALTH_PROBE_APPROVED=yes required")
    # Cloud Run will require iam.serviceAccounts.actAs to attach production SA.
    # This script NEVER grants permissions if the caller lacks them.
    with tempfile.TemporaryDirectory(prefix="examtree-qs-oidc-") as directory:
        for job,doc in plans:
            path=Path(directory)/(job+".yaml")
            path.write_text(json.dumps(doc,indent=2)+"\n",encoding="utf-8")
            result=command(["gcloud","run","jobs","replace",str(path),
                            "--region="+REGION,"--project="+PROJECT,"--quiet"],120)
            must(result is not None and result.returncode==0,
                 "probe job creation failed: "+job+"; inspect partial resources, do not rerun")
            print("CREATED: "+job,flush=True)
            preflight()
            result=command(["gcloud","run","jobs","execute",job,"--region="+REGION,
                            "--project="+PROJECT,"--wait","--quiet"],240)
            must(result is not None and result.returncode==0,
                 "health-only execution failed: "+job+"; inspect Cloud Run job logs")
            print("PASS: signed health-only execution succeeded: "+job,flush=True)
    preflight()
    print("RESULT: BOTH PRIVATE HEALTH-ONLY OIDC JOBS PASSED; GENERATION STILL OFF",flush=True)
    print("NOTE: Does not test Cloud Tasks dispatch, signed POST or worker computation.")
    return 0


if __name__=="__main__":
    try:
        raise SystemExit(main())
    except (RuntimeError,KeyError,TypeError,ValueError) as exc:
        print("STOP: "+str(exc),file=sys.stderr)
        print("Production configuration untouched; inspect any partially created probe jobs.",file=sys.stderr)
        raise SystemExit(2)
