#!/usr/bin/env python3
"""Read-only Cloud Shell audit. Never invokes jobs or changes cloud resources.

Run with Python 3 and an already authenticated gcloud CLI. Output contains
selected metadata only; raw environment, logs and CLI errors are never printed.
"""
import json
import re
import subprocess

PROJECT = "sarbedutech"
REGION = "asia-south1"
IDENTITY = "examtree-qs-chapter-rollback@sarbedutech.iam.gserviceaccount.com"
JOB = "examtree-qs-prod-chapter-rollback"
SCHEDULER = JOB + "-trigger"
SERVICES = ("examtree-api", "examtree-qs-receiver-prod", "examtree-universal-prod")
DISPATCHERS = ("examtree-qs-dispatch-prod", "examtree-qs-chapter-dispatch-prod")


def read(*args):
    try:
        result = subprocess.run(
            ["gcloud", *args, "--project=" + PROJECT, "--format=json", "--quiet"],
            capture_output=True, text=True, timeout=120, check=False)
        if result.returncode:
            return {"audit_error": "READ_FAILED", "exit": result.returncode}
        return json.loads(result.stdout)
    except (OSError, subprocess.TimeoutExpired, ValueError):
        return {"audit_error": "READ_UNAVAILABLE"}


def bindings(doc):
    if "audit_error" in doc:
        return doc
    # Direct bindings only: groups, inherited grants and deny policies require
    # separate effective-access review. Do not present this as IAM proof.
    return [{"role": b.get("role"), "condition": b.get("condition")}
            for b in doc.get("bindings", [])
            if "serviceAccount:" + IDENTITY in b.get("members", [])]


def env_summary(value):
    rows = []
    if isinstance(value, dict):
        for key, item in value.items():
            if key == "env" and isinstance(item, list):
                rows.extend(item)
            elif isinstance(item, (dict, list)):
                rows.extend(env_summary(item))
    elif isinstance(value, list):
        for item in value:
            rows.extend(env_summary(item))
    return rows


def job_summary(doc):
    if "audit_error" in doc:
        return doc
    allowed = {"EXAMTREE_QS_CHAPTER_ROLLBACK_ARMED",
               "EXAMTREE_QS_CHAPTER_ROLLBACK_APPLY_APPROVED",
               "EXAMTREE_QS_CHAPTER_ROLLBACK_EXPIRES_AT",
               "EXAMTREE_QS_CHAPTER_ROLLBACK_STARTED_AT",
               "EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED",
               "EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_APPROVED"}
    task = doc.get("spec", {}).get("template", {}).get("spec", {}).get("template", {}).get("spec", {})
    return {"serviceAccountName": task.get("serviceAccountName"),
            "containers": [{"image": c.get("image"), "args": c.get("args")}
                           for c in task.get("containers", [])],
            "gates": {r["name"]: r.get("value") for r in env_summary(doc)
                      if r.get("name") in allowed}}


def main():
    report = {"mode": "READ_ONLY", "project": PROJECT, "identity": IDENTITY,
              "reported_expiry": "2026-10-25T10:30:24Z"}
    scheduler = read("scheduler", "jobs", "describe", SCHEDULER, "--location=" + REGION)
    report["scheduler"] = scheduler if "audit_error" in scheduler else {
        "state": scheduler.get("state"), "schedule": scheduler.get("schedule"),
        "httpTarget": {k: scheduler.get("httpTarget", {}).get(k)
                       for k in ("uri", "httpMethod", "oauthToken")}}
    report["queues"] = {}
    for queue in ("examtree-qs-prod", "examtree-qs-chapter-prod"):
        doc = read("tasks", "queues", "describe", queue, "--location=" + REGION)
        report["queues"][queue] = doc if "audit_error" in doc else {"state": doc.get("state")}
    report["jobs"] = {name: job_summary(read("run", "jobs", "describe", name, "--region=" + REGION))
                      for name in (JOB, *DISPATCHERS)}
    policy = read("projects", "get-iam-policy", PROJECT)
    report["direct_project_bindings"] = bindings(policy)
    report["project_custom_roles"] = {}
    for binding in report["direct_project_bindings"] if isinstance(report["direct_project_bindings"], list) else []:
        role = binding.get("role", "")
        if role.startswith("projects/" + PROJECT + "/roles/"):
            doc = read("iam", "roles", "describe", role.rsplit("/", 1)[1])
            report["project_custom_roles"][role] = doc if "audit_error" in doc else {
                "includedPermissions": doc.get("includedPermissions"), "deleted": doc.get("deleted")}
    report["services"] = {}
    for name in SERVICES:
        doc = read("run", "services", "describe", name, "--region=" + REGION)
        report["services"][name] = doc if "audit_error" in doc else {
            "desiredTraffic": doc.get("spec", {}).get("traffic"),
            "observedTraffic": doc.get("status", {}).get("traffic")}
        report["services"][name]["direct_bindings"] = bindings(
            read("run", "services", "get-iam-policy", name, "--region=" + REGION))
    logs = read("logging", "read",
                'resource.type="cloud_run_job" AND resource.labels.job_name="' + JOB + '"',
                "--freshness=24h", "--limit=100")
    report["recent_rollback_events"] = logs if isinstance(logs, dict) else [{
        "timestamp": row.get("timestamp"), "severity": row.get("severity"),
        "execution": row.get("labels", {}).get("run.googleapis.com/execution_name"),
        "permissions": sorted(set(re.findall(
            r"\b(?:run|iam|cloudtasks|cloudscheduler|artifactregistry)\.[A-Za-z]+\.[A-Za-z]+\b",
            str(row.get("textPayload", "")) + json.dumps(row.get("jsonPayload", {}))))),
        "incomplete": "Rollback incomplete" in str(row.get("textPayload", ""))}
        for row in logs]
    report["limitations"] = "Direct bindings and logs are evidence, not effective permission proof. No mutations attempted."
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
