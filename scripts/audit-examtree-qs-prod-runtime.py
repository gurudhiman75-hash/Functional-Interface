#!/usr/bin/env python3
"""Examtree production Question Studio: read-only Cloud Run/Tasks readiness audit.

Reads metadata/IAM only. Never reads secret values, invokes services, dispatches
jobs, edits database schemas, resumes tasks or changes project configuration.
Requires Cloud Shell with gcloud, Python 3, and read access to project sarbedutech.
"""
import json
import subprocess
from urllib.parse import urlsplit
from qs_prod_serving_revision import serving_revision_name, verify_serving_revision

PROJECT = "sarbedutech"
REGION = "asia-south1"
PROJECT_NUMBER = "1083299267005"
QUEUE = "examtree-qs-prod"
RECEIVER = "examtree-qs-receiver-prod"
WORKER = "examtree-universal-prod"
DISPATCHER = "examtree-qs-dispatch-prod"
TASK_SA = "examtree-qs-task-prod@sarbedutech.iam.gserviceaccount.com"
RECEIVER_SA = "examtree-qs-receiver-prod@sarbedutech.iam.gserviceaccount.com"
WORKER_SA = "examtree-qs-worker-prod@sarbedutech.iam.gserviceaccount.com"
DISPATCH_SA = "examtree-qs-dispatch-prod@sarbedutech.iam.gserviceaccount.com"

counts = {"PASS": 0, "BLOCK": 0, "REVIEW": 0}
def result(status, label, detail=""):
    counts[status] += 1
    print(f"{status}: {label}" + (f" — {detail}" if detail else ""))

def gcloud(*args):
    try:
        proc = subprocess.run(["gcloud", *args], capture_output=True, text=True, timeout=60, check=False)
        return proc.stdout if proc.returncode == 0 else None
    except (OSError, subprocess.TimeoutExpired):
        return None

def cloud_json(*args):
    output = gcloud(*args, "--project=" + PROJECT, "--format=json")
    try:
        return json.loads(output) if output is not None else None
    except (ValueError, TypeError):
        return None

def container_env(spec):
    # Cloud Run v1 service and job JSON shapes.
    containers = spec.get("containers") or []
    return {item.get("name"): item for item in containers[0].get("env", [])} if containers else {}

def env_value(env, key):
    return (env.get(key) or {}).get("value")

def env_secret(env, key):
    return ((env.get(key) or {}).get("valueFrom") or {}).get("secretKeyRef", {}).get("name")

def status_env(env, key, want, label):
    actual = env_value(env, key)
    if actual == want:
        result("PASS", label)
    elif actual is None:
        result("REVIEW", label, "not explicitly configured in Cloud Run metadata (may be in container image)")
    else:
        result("BLOCK", label, "unexpected runtime value")

def safe_origin(value, expected_prefix):
    try:
        v = urlsplit(value or "")
        if (v.scheme == "https" and v.hostname and
            v.hostname.startswith(expected_prefix) and
            v.hostname.endswith(".run.app") and
            not v.username and not v.password and not v.query and not v.fragment and
            v.path in ("", "/") and not v.port):
            return f"https://{v.hostname}"
    except ValueError:
        pass
    return None

def service_json(name):
    return cloud_json("run", "services", "describe", name, "--region=" + REGION)

def run_iam(name):
    return cloud_json("run", "services", "get-iam-policy", name, "--region=" + REGION)

def check_private_iam(name, expected_invoker):
    doc = run_iam(name)
    if not isinstance(doc, dict):
        result("REVIEW", name + " IAM", "cannot read service IAM")
        return
    bindings = doc.get("bindings") or []
    all_members = {m for bind in bindings for m in bind.get("members", [])}
    if {"allUsers", "allAuthenticatedUsers"} & all_members:
        result("BLOCK", name + " IAM", "public principal grants present")
    else:
        result("PASS", name + " has no public service-level IAM members")
    invokers = {m for bind in bindings if bind.get("role") == "roles/run.invoker"
                for m in bind.get("members", [])}
    desired = "serviceAccount:" + expected_invoker
    if invokers == {desired}:
        result("PASS", name + " exact service-level invoker", desired)
    else:
        result("BLOCK", name + " service-level invoker", "missing expected principal or extra invokers")

print("===== EXAMTREE QS PRODUCTION READ-ONLY READINESS =====")
active = gcloud("config", "get-value", "project")
if active is None or active.strip() != PROJECT:
    result("BLOCK", "active project", "select sarbedutech first")
    raise SystemExit(2)
result("PASS", "active project", PROJECT)

queue = cloud_json("tasks", "queues", "describe", QUEUE, "--location=" + REGION)
if isinstance(queue, dict) and queue.get("state") == "PAUSED":
    result("PASS", "production Cloud Tasks queue is PAUSED")
else:
    result("BLOCK", "production Cloud Tasks queue", "not visible or not PAUSED")
if isinstance(queue, dict):
    limits = queue.get("rateLimits") or {}
    retries = queue.get("retryConfig") or {}
    if limits.get("maxConcurrentDispatches") == 1 and retries.get("maxAttempts") == 3:
        result("PASS", "queue dispatch bound", "concurrency 1; max attempts 3")
    else:
        result("BLOCK", "queue limits", "unexpected dispatch/retry settings")

for account in (TASK_SA, RECEIVER_SA, WORKER_SA, DISPATCH_SA):
    data = cloud_json("iam", "service-accounts", "describe", account)
    result("PASS" if isinstance(data, dict) else "BLOCK",
           "service identity " + account.split("@")[0])

services = {}
for name, runtime_sa in ((RECEIVER, RECEIVER_SA), (WORKER, WORKER_SA)):
    data = service_json(name)
    if not isinstance(data, dict):
        result("BLOCK", name, "Cloud Run service not readable")
        continue
    services[name] = data
    spec = ((data.get("spec") or {}).get("template") or {}).get("spec") or {}
    account = spec.get("serviceAccountName")
    result("PASS" if account == runtime_sa else "BLOCK", name + " runtime identity")
    try:
        live_name = serving_revision_name(data, name)
        live = cloud_json("run", "revisions", "describe", live_name, "--region=" + REGION)
        verify_serving_revision(data, live, name)
        result("PASS", name + " 100%-serving revision ready and config matches template")
    except ValueError as exc:
        result("BLOCK", name + " serving revision", str(exc))
    check_private_iam(name, TASK_SA if name == RECEIVER else RECEIVER_SA)
    status_env(container_env(spec), "EXAMTREE_API_RUNTIME", "cloud-run", name + " Cloud Run mode")
    status_env(container_env(spec), "EXAMTREE_API_STAGING", "false", name + " production mode")

rdata, wdata = services.get(RECEIVER), services.get(WORKER)
re = container_env(((rdata or {}).get("spec") or {}).get("template", {}).get("spec", {}))
we = container_env(((wdata or {}).get("spec") or {}).get("template", {}).get("spec", {}))
r_origin = safe_origin(((rdata or {}).get("status") or {}).get("url"),
                       "examtree-qs-receiver-prod-")
w_origin = safe_origin(((wdata or {}).get("status") or {}).get("url"),
                       "examtree-universal-prod-")
project_info = cloud_json("projects", "describe", PROJECT)
project_number_ok = isinstance(project_info, dict) and str(project_info.get("projectNumber")) == PROJECT_NUMBER
r_origins = {r_origin} if r_origin else set()
w_origins = {w_origin} if w_origin else set()
if project_number_ok:
    # Cloud Run also supports the documented deterministic regional URL,
    # which differs from the shorter status.url (*.a.run.app).
    r_origins.add(f"https://{RECEIVER}-{PROJECT_NUMBER}.{REGION}.run.app")
    w_origins.add(f"https://{WORKER}-{PROJECT_NUMBER}.{REGION}.run.app")
result("PASS" if project_number_ok else "BLOCK", "Cloud Run project number verified")
result("PASS" if r_origin else "BLOCK", "receiver service origin")
result("PASS" if w_origin else "BLOCK", "worker service origin")

for env, key, label in ((re, "EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED", "receiver activation OFF"),
                        (we, "EXAMTREE_QS_PRODUCTION_WORKER_APPROVED", "worker activation OFF")):
    result("PASS" if env_value(env, key) == "false" else "BLOCK", label)

if re:
    result("PASS" if env_value(re, "EXAMTREE_QUESTION_STUDIO_TASK_SERVICE_ACCOUNT") == TASK_SA else "BLOCK",
           "receiver task OIDC identity")
    result("PASS" if env_value(re, "EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE") in r_origins else "BLOCK",
           "receiver task OIDC audience", "matches a verified Cloud Run regional service origin" if project_number_ok else "")
    result("PASS" if env_value(re, "QUESTION_STUDIO_UNIVERSAL_WORKER_URL") in
           (w_origins | {u + "/" for u in w_origins}) else "BLOCK",
           "receiver worker origin pinned to private production worker")

if we:
    forbidden = ("DATABASE_URL", "CASHFREE_CLIENT_ID", "CASHFREE_CLIENT_SECRET",
                 "OPENAI_API_KEY", "FIREBASE_PRIVATE_KEY")
    present = [key for key in forbidden if key in we]
    result("BLOCK" if present else "PASS", "compute worker without DB/payment/AI credentials",
           "prohibited env entry" if present else "")
    if env_value(we, "EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED") == "true":
        result("BLOCK", "worker staging-approval contamination")

r_token, w_token = env_secret(re, "QUESTION_STUDIO_WORKER_TOKEN"), env_secret(we, "QUESTION_STUDIO_WORKER_TOKEN")
if env_value(re, "QUESTION_STUDIO_WORKER_TOKEN") or env_value(we, "QUESTION_STUDIO_WORKER_TOKEN"):
    result("BLOCK", "worker shared secret must not be stored as plaintext Cloud Run env")
elif r_token and w_token and r_token == w_token:
    result("PASS", "receiver and worker reference same Secret Manager token", r_token)
else:
    result("REVIEW", "production worker token binding", "missing or different Secret Manager references")

job = cloud_json("run", "jobs", "describe", DISPATCHER, "--region=" + REGION)
je = {}
if isinstance(job, dict):
    task = ((job.get("spec") or {}).get("template") or {}).get("spec") or {}
    payload = (task.get("template") or {}).get("spec") or {}
    je = container_env(payload)
    result("PASS" if payload.get("serviceAccountName") == DISPATCH_SA else "BLOCK",
           "dispatcher job runtime identity")
    if task.get("taskCount") == 1 and task.get("parallelism") == 1 and payload.get("maxRetries") == 0:
        result("PASS", "one-shot dispatcher bounds", "1 task, 1 parallelism, 0 retries")
    else:
        result("REVIEW", "one-shot dispatcher bounds", "verify Cloud Run job task/retry spec")
    result("PASS" if env_value(je, "EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED") != "true" else "BLOCK",
           "dispatcher activation OFF")
    for key, want in (
        ("EXAMTREE_QUESTION_STUDIO_TASK_PROJECT", PROJECT),
        ("EXAMTREE_QUESTION_STUDIO_TASK_REGION", REGION),
        ("EXAMTREE_QUESTION_STUDIO_TASK_QUEUE", QUEUE),
        ("EXAMTREE_QUESTION_STUDIO_TASK_SERVICE_ACCOUNT", TASK_SA),
        ("EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE", r_origins),
        ("EXAMTREE_QUESTION_STUDIO_TASK_HANDLER_URL",
         {u + "/internal/question-studio/async-task" for u in r_origins}),
    ):
        if want is None or want == set():
            result("REVIEW", "dispatcher " + key, "receiver endpoint unavailable")
        elif env_value(je, key) in (want if isinstance(want, set) else {want}):
            result("PASS", "dispatcher " + key)
        else:
            result("REVIEW", "dispatcher " + key, "not configured as production target")
else:
    result("BLOCK", "dispatcher Cloud Run job missing or inaccessible")

# Only inspect Secret Manager *metadata*. Never access versions or secret values.
refs = {env_secret(env, "DATABASE_URL") for env in (re, je) if env_secret(env, "DATABASE_URL")}
db_r, db_d = env_secret(re, "DATABASE_URL"), env_secret(je, "DATABASE_URL")
if db_r and db_d and db_r == db_d and "staging" not in db_r:
    result("PASS", "receiver/dispatcher use same production-looking DB secret name", db_r)
else:
    result("REVIEW", "production Neon binding", "missing/mismatched DB references; secret values never inspected")
if refs:
    for name in refs:
        desc = cloud_json("secrets", "describe", name)
        result("PASS" if isinstance(desc, dict) else "BLOCK", "Secret Manager metadata " + name)
result("REVIEW", "independent Neon main secret binding",
       "secret reference alone cannot prove endpoint is main; separately validate under secure access")

for name in set([r_token, w_token]) - {None}:
    desc = cloud_json("secrets", "describe", name)
    result("PASS" if isinstance(desc, dict) else "BLOCK", "Secret Manager metadata " + name)

scheduler = cloud_json("scheduler", "jobs", "list", "--location=" + REGION)
if isinstance(scheduler, list):
    for j in scheduler:
        name = (j.get("name") or "").split("/")[-1]
        if "examtree-qs" not in name:
            continue
        state = j.get("state", "UNKNOWN")
        is_prod = "prod" in name or "production" in name
        if state == "ENABLED" and (is_prod or "staging" in name):
            result("BLOCK", "unexpected active QS scheduler " + name)
        else:
            result("PASS" if state == "PAUSED" else "REVIEW",
                   "QS scheduler " + name, state)
else:
    result("REVIEW", "QS Scheduler state", "listing not accessible")

# This does not establish inherited IAM or operational correctness of ID tokens.
result("REVIEW", "effective project-level IAM / signed OIDC execution",
       "service-level IAM verified only; live signed task and worker auth require a non-writing canary")

# Monitoring and billing are not inferred from the presence of staging email alerts.
policies = cloud_json("monitoring", "policies", "list")
if isinstance(policies, list):
    relevant = [p for p in policies
                if "examtree" in (p.get("displayName") or "").lower()
                and ("qs" in (p.get("displayName") or "").lower()
                     or "question studio" in (p.get("displayName") or "").lower())
                and ("prod" in (p.get("displayName") or "").lower()
                     or "production" in (p.get("displayName") or "").lower())]
    result("PASS" if relevant else "REVIEW", "production-specific monitoring policies",
           f"{len(relevant)} named policies found; alert correctness still needs review")
else:
    result("REVIEW", "production Monitoring policies", "CLI access unavailable; verify in Cloud Monitoring")
result("REVIEW", "production cost budget and alert delivery",
       "verify budget thresholds and actual email delivery separately")

print("===== SUMMARY =====")
print(" ".join(f"{name}={n}" for name, n in counts.items()))
print("NO DATABASE WRITE, NO JOB EXECUTION, NO QUEUE RESUME, NO FLAG CHANGE.")
if counts["BLOCK"]:
    print("RESULT: NOT READY; resolve blocking issues before production canary.")
    raise SystemExit(2)
print("RESULT: STATIC CHECKS CLEAR; REVIEW items still require separate approval before production canary.")
