#!/usr/bin/env python3
"""Read-only Examtree QS production final-gates review.

One command runs the existing disabled-only safety checks and inspects the
remaining Cloud Monitoring / Billing metadata. NO service invocation, token
minting, secret-value printing, DB write, cloud resource mutation, alert
delivery, queue resume, scheduler execution or generation occurs.
"""
import json
import re
import subprocess
import sys

PROJECT = "sarbedutech"
PROJECT_NUMBER = "1083299267005"
REGION = "asia-south1"
COUNTS = {"PASS": 0, "REVIEW": 0, "BLOCK": 0}


def note(kind, label, detail=""):
    COUNTS[kind] += 1
    print(f"{kind}: {label}" + (f" — {detail}" if detail else ""), flush=True)


def run(args, timeout=120):
    try:
        return subprocess.run(args, capture_output=True, text=True,
                              check=False, timeout=timeout)
    except (OSError, subprocess.TimeoutExpired):
        return None


def get_json(*args):
    result = run(["gcloud", *args, "--project=" + PROJECT, "--format=json"])
    if result is None or result.returncode:
        return None
    try:
        return json.loads(result.stdout)
    except ValueError:
        return None


def prior_check(script, flags, success_marker):
    result = run([sys.executable, script, *flags], timeout=300)
    if result is None or result.returncode or success_marker not in result.stdout:
        note("BLOCK", script + " " + " ".join(flags),
             "existing safety check did not pass; inspect it separately")
        return False
    note("PASS", script + " " + " ".join(flags))
    return True


def monitoring_review():
    policies = get_json("monitoring", "policies", "list")
    if not isinstance(policies, list):
        note("REVIEW", "production monitoring", "cannot read alert policies")
        return
    production = [p for p in policies
                  if "examtree" in (p.get("displayName") or "").lower()
                  and any(x in (p.get("displayName") or "").lower()
                          for x in ("qs", "question studio"))
                  and any(x in (p.get("displayName") or "").lower()
                          for x in ("prod", "production"))
                  and p.get("enabled") is True
                  and p.get("conditions")]
    if not production:
        note("REVIEW", "production-specific alert policies",
             "no enabled, condition-bearing Examtree QS production policies found")
        return
    note("PASS", "production alert-policy metadata",
         f"{len(production)} enabled named policies with conditions")
    channels = get_json("beta", "monitoring", "channels", "list")
    if not isinstance(channels, list):
        note("REVIEW", "alert notification channels", "channel listing unavailable")
        return
    ids = {ch for p in production for ch in p.get("notificationChannels", [])}
    usable = [c for c in channels if c.get("name") in ids
              and c.get("enabled") is True
              and c.get("verificationStatus") != "UNVERIFIED"]
    if usable:
        note("PASS", "production policy notification-channel metadata",
             f"{len(usable)} enabled linked channels (delivery still unproven)")
    else:
        note("REVIEW", "production alert notifications",
             "no enabled, verified-or-exempt linked notification channel")


def billing_review():
    info = get_json("billing", "projects", "describe", PROJECT)
    if not isinstance(info, dict):
        note("REVIEW", "project billing", "billing association not readable")
        return
    if info.get("billingEnabled") is not True:
        note("BLOCK", "project billing", "billing is not reported enabled")
        return
    account = info.get("billingAccountName")
    if not isinstance(account, str) or not account.startswith("billingAccounts/"):
        note("REVIEW", "billing budget", "billing account identifier unavailable")
        return
    note("PASS", "project billing", "enabled")
    budgets = get_json("billing", "budgets", "list", "--billing-account=" + account)
    if not isinstance(budgets, list):
        note("REVIEW", "billing budget", "budget listing unavailable to this identity")
        return
    applicable = []
    for budget in budgets:
        scope = budget.get("budgetFilter") or {}
        projects = scope.get("projects") or []
        ancestors = scope.get("resourceAncestors") or []
        if ancestors:
            continue  # Cannot establish ancestry from this read-only check.
        if projects and not any(p in ("projects/" + PROJECT, "projects/" + PROJECT_NUMBER)
                                for p in projects):
            continue
        if budget.get("thresholdRules") and (budget.get("amount") or {}).get("specifiedAmount"):
            applicable.append(budget)
    if applicable:
        note("PASS", "billing-budget metadata",
             f"{len(applicable)} project-covering amount+threshold budget(s); alerts not tested")
    else:
        note("REVIEW", "billing cost safeguards",
             "no verifiable project-covering budget with amount and thresholds")


def main():
    print("EXAMTREE QS PRODUCTION FINAL GATES — READ ONLY", flush=True)
    active = run(["gcloud", "config", "get-value", "project"], timeout=30)
    if active is None or active.returncode or active.stdout.strip() != PROJECT:
        note("BLOCK", "active GCP project", "set project to sarbedutech")
    else:
        note("PASS", "active GCP project", PROJECT)
    if COUNTS["BLOCK"]:
        return 2

    if not prior_check("scripts/prepare-qs-prod-disabled-only.py",
                       ["--diagnose"], "RESULT: 0 read-only diagnostic failures"):
        return 2
    if not prior_check("scripts/prepare-qs-prod-disabled-only.py",
                       [], "RESULT: PREFLIGHT PASSED; NO CHANGES"):
        return 2
    audit = run([sys.executable, "scripts/audit-examtree-qs-prod-runtime.py"], timeout=300)
    if audit is None or audit.returncode or not re.search(r"\bBLOCK=0\b", audit.stdout):
        note("BLOCK", "runtime readiness audit", "re-run the existing audit for detail")
        return 2
    match = re.search(r"\bPASS=(\d+) BLOCK=(\d+) REVIEW=(\d+)\b", audit.stdout)
    note("PASS", "runtime static checks", match.group(0) if match else "no blocking failures")

    # Image Dockerfile ENV defaults are in GitHub source, but this cannot
    # attest the exact running image digest or the deployed image provenance.
    note("REVIEW", "4 runtime-mode metadata observations",
         "Dockerfile ENV is not proof of the deployed image's effective defaults")
    # Secret endpoint was independently validated by the existing preflight.
    note("PASS", "production Neon secret endpoint",
         "verified in-memory by existing preflight, without printing its value")
    # IAM and config cannot establish actual signed task-to-receiver-to-worker
    # request success. Deliberately never call production endpoints.
    note("REVIEW", "live signed OIDC and private worker request path",
         "requires a separately authorized non-writing canary")
    monitoring_review()
    billing_review()
    note("REVIEW", "notification email delivery and production cost limit",
         "verify actual delivery and budget thresholds; budgets do not cap spend")

    print("=== FINAL SUMMARY ===")
    print(" ".join(f"{k}={v}" for k, v in COUNTS.items()))
    print("PRODUCTION GENERATION: NOT ACTIVATED; QUEUE: PAUSED BY VERIFIED PREFLIGHT")
    print("NO IAM/CONFIG CHANGES, TASKS, JOB EXECUTION, DB WRITES OR ENDPOINT CALLS.")
    if COUNTS["BLOCK"]:
        print("RESULT: BLOCKED — do not proceed to canary")
        return 2
    if COUNTS["REVIEW"]:
        print("RESULT: STATIC GATES CLEAR — manual/live reviews still required")
    else:
        print("RESULT: STATIC GATES CLEAR — live canary still needs separate approval")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
