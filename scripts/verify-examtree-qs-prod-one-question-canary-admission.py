#!/usr/bin/env python3
"""Read-only admission check for a SINGLE Examtree QS production review canary.

This program NEVER executes a Cloud Run Job, generates a question, resumes a
queue, changes a flag, creates a task, reads secrets, or writes to Neon.

It verifies that the existing PAUSED/DISABLED production baseline is intact,
there is no active Cloud Tasks backlog, and all three named production alert
policies are enabled with notification channels. It is NOT permission to
activate production; follow the separate reviewed canary plan.
"""
import json
import subprocess
import sys

PROJECT = "sarbedutech"
REGION = "asia-south1"
QUEUE = "examtree-qs-prod"
ALERTS = (
    "Examtree QS PROD Receiver 5xx",
    "Examtree QS PROD Worker 5xx",
    "Examtree QS PROD Dispatcher failed executions",
)
APPROVALS = {
    "examtree-qs-receiver-prod": "EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED",
    "examtree-universal-prod": "EXAMTREE_QS_PRODUCTION_WORKER_APPROVED",
}
COUNT = {"PASS": 0, "REVIEW": 0, "BLOCK": 0}


def report(kind, label):
    COUNT[kind] += 1
    print(f"{kind}: {label}", flush=True)


def cmd(args, timeout=120):
    try:
        return subprocess.run(args, capture_output=True, text=True,
                              timeout=timeout, check=False)
    except (OSError, subprocess.TimeoutExpired):
        return None


def fetch(args):
    result = cmd(["gcloud", *args, "--project=" + PROJECT, "--format=json"])
    if result is None or result.returncode != 0:
        return None
    try:
        return json.loads(result.stdout)
    except ValueError:
        return None


def service_flags(service):
    data = fetch(["run", "services", "describe", service, "--region=" + REGION])
    if not isinstance(data, dict):
        return None
    spec = (((data.get("spec") or {}).get("template") or {}).get("spec") or {})
    containers = spec.get("containers") or []
    if len(containers) != 1:
        return None
    env = containers[0].get("env") or []
    if not isinstance(env, list) or any(not isinstance(x, dict) for x in env):
        return None
    # Duplicate environment keys must fail closed.
    keys = [e.get("name") for e in env]
    if len(keys) != len(set(keys)):
        return None
    return {e.get("name"): e.get("value") for e in env}


def assert_policies(policies):
    if not isinstance(policies, list):
        report("BLOCK", "production Monitoring policies could not be listed")
        return
    for label in ALERTS:
        matches = [p for p in policies if p.get("displayName") == label]
        if (len(matches) != 1 or matches[0].get("enabled") is not True
                or not matches[0].get("conditions")
                or not matches[0].get("notificationChannels")):
            report("BLOCK", "production alert not enabled/connected: " + label)
        else:
            report("PASS", "production alert configured: " + label)


def assert_no_tasks(tasks):
    if not isinstance(tasks, list):
        report("BLOCK", "cannot verify production Cloud Tasks queue inventory")
        return
    if len(tasks) != 0:
        report("BLOCK", "production queue contains " + str(len(tasks))
               + " existing task(s); no canary activation permitted")
    else:
        report("PASS", "production Cloud Tasks queue has zero tasks")


def main():
    print("EXAMTREE QS PROD — ONE-QUESTION CANARY ADMISSION (READ ONLY)")
    selected = cmd(["gcloud", "config", "get-value", "project"], 30)
    if selected is None or selected.returncode or selected.stdout.strip() != PROJECT:
        report("BLOCK", "active project must be sarbedutech")
        return 2
    report("PASS", "active Google Cloud project verified")
    gate = cmd([sys.executable, "scripts/prepare-qs-prod-disabled-only.py"], 300)
    if (gate is None or gate.returncode != 0 or
        "RESULT: PREFLIGHT PASSED; NO CHANGES" not in gate.stdout):
        report("BLOCK", "existing PAUSED/DISABLED production preflight did not pass")
        return 2
    report("PASS", "production queue PAUSED; private IAM and approvals OFF")
    assert_no_tasks(fetch(["tasks", "list", "--queue=" + QUEUE,
                           "--location=" + REGION]))
    for service, flag in APPROVALS.items():
        env = service_flags(service)
        if env is None or env.get(flag) != "false":
            report("BLOCK", "production service is not confirmed disabled: " + service)
        else:
            report("PASS", service + " approval flag explicitly false")
    assert_policies(fetch(["monitoring", "policies", "list"]))
    # The budget cap was established in the Cloud Billing UI, not by gcloud,
    # because this user lacks billing.budgets.list. Do not misreport the budget
    # as verified by an API call or let the command activate anything.
    report("REVIEW", "operator must confirm ₹300 Cloud Run cap and ₹500 total-project alert budget")
    report("REVIEW", "new production alert EMAIL DELIVERY not yet independently proven")
    report("REVIEW", "single-run enqueue/rollback implementation and disposable admin identity not verified")
    report("REVIEW", "actual Cloud Tasks signed POST, review commit and duplication not yet tested")
    print("=== CANARY ADMISSION SUMMARY ===")
    print(" ".join(f"{k}={v}" for k, v in COUNT.items()))
    print("NO CLOUD RESOURCE CHANGES, NO DATABASE WRITES, NO GENERATION.")
    if COUNT["BLOCK"]:
        print("RESULT: BLOCKED — DO NOT ACTIVATE")
        return 2
    print("RESULT: DISABLED BASELINE CLEAR; LIVE CANARY STILL NOT AUTHORIZED BY THIS CHECK.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
