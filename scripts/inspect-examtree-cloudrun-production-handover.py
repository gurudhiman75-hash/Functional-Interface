#!/usr/bin/env python3
"""Read-only ExamTree Render -> Cloud Run production handover inspector.

Never fetches secret VALUES, calls billing endpoints, deploys revisions,
starts jobs, edits Render/Pages settings, or affects students. Exit 2 if any
cutover prerequisite is unverified. No automatic cutover is authorized.
"""
import json
import os
import subprocess
from pathlib import Path

PROJECT = "sarbedutech"
REGION = "asia-south1"
PROD_SERVICE = "examtree-api"
PROD_JOB = "examtree-api-background"
STAGING_SERVICE = "examtree-api-staging"
SCHEDULER = "examtree-api-background-every-5m"
MAIN_SECRET = "examtree-api-database-url"
STAGING_SECRET = "examtree-api-staging-database-url"


def command(*args):
    try:
        result = subprocess.run(args, check=False, capture_output=True, text=True, timeout=40)
        return result.stdout.strip() if result.returncode == 0 else None
    except (subprocess.TimeoutExpired, OSError):
        return None


def json_command(*args):
    raw = command(*args, "--format=json")
    if raw is None:
        return None
    try:
        return json.loads(raw)
    except ValueError:
        return None


def runtime_env(resource):
    """Only return nonsecret config and Secret Manager *names*."""
    if not isinstance(resource, dict):
        return {}, {}
    spec = resource.get("spec") or {}
    template = spec.get("template") or {}
    # Cloud Run service: spec.template.spec.containers
    # Cloud Run job: spec.template.spec.template.spec.containers
    spec = template.get("spec") or {}
    if "template" in spec:
        spec = (spec.get("template") or {}).get("spec") or {}
    containers = spec.get("containers") or []
    if len(containers) != 1:
        return {}, {}
    env = containers[0].get("env") or []
    values = {entry.get("name"): entry.get("value") for entry in env}
    secrets = {entry.get("name"): ((entry.get("valueFrom") or {}).get("secretKeyRef") or {}).get("name")
               for entry in env}
    return values, secrets


def check_service(resource, staging):
    values, secrets = runtime_env(resource)
    return bool(values) and all([
        values.get("EXAMTREE_API_RUNTIME") == "cloud-run",
        (values.get("EXAMTREE_API_STAGING") == "true") if staging
        else (values.get("EXAMTREE_API_STAGING") != "true"),
        secrets.get("DATABASE_URL") == (STAGING_SECRET if staging else MAIN_SECRET),
        values.get("GENERATION_JOB_WORKER_ENABLED") == "false",
        values.get("OUTBOX_PUBLISHER_ENABLED") == "false",
        values.get("FIREBASE_PROJECT_ID") == PROJECT,
    ])


def check_job(resource):
    values, secrets = runtime_env(resource)
    return bool(values) and (
        values.get("EXAMTREE_API_RUNTIME") == "cloud-run"
        and values.get("EXAMTREE_API_STAGING") != "true"
        and secrets.get("DATABASE_URL") == MAIN_SECRET
    )


def main():
    print("EXAMTREE PRODUCTION HANDOVER PREFLIGHT — READ ONLY")
    print("No secret values, API writes, job executions, routing changes or deployments.")
    if command("gcloud", "config", "get-value", "project") != PROJECT:
        raise SystemExit("FAIL: select Google Cloud project sarbedutech")
    failed = 0

    def gate(label, ok):
        nonlocal failed
        print(("PASS" if ok else "PENDING") + ": " + label)
        if not ok:
            failed += 1

    staging = json_command("gcloud", "run", "services", "describe", STAGING_SERVICE,
                           "--project=" + PROJECT, "--region=" + REGION)
    gate("Cloud Run staging remains isolated from Neon main", check_service(staging, staging=True))

    prod = json_command("gcloud", "run", "services", "describe", PROD_SERVICE,
                        "--project=" + PROJECT, "--region=" + REGION)
    gate("dedicated production Cloud Run API, live Neon secret, disabled API timers",
         check_service(prod, staging=False))
    if isinstance(prod, dict):
        env, secrets = runtime_env(prod)
        paused = (env.get("EXAMTREE_SALES_DISABLED") == "true"
                  and env.get("EXAMTREE_PAYMENT_PROVIDER") == "none"
                  and env.get("CASHFREE_ENV") is None
                  and not secrets.get("CASHFREE_CLIENT_ID")
                  and not secrets.get("CASHFREE_CLIENT_SECRET"))
        live = (env.get("EXAMTREE_SALES_DISABLED") == "false"
                and env.get("EXAMTREE_PAYMENT_PROVIDER") == "cashfree"
                and env.get("CASHFREE_ENV") == "production"
                and secrets.get("CASHFREE_CLIENT_ID") is not None
                and secrets.get("CASHFREE_CLIENT_SECRET") is not None)
        gate("production financial mode: sales explicitly paused OR real Cashfree configured", paused or live)
        gate("AI provider configured in production with secret-mapped key",
             any(secrets.get(key) for key in
                 ("OPENAI_API_KEY", "DEEPSEEK_API_KEY", "GEMINI_API_KEY", "ANTHROPIC_API_KEY")))

    job = json_command("gcloud", "run", "jobs", "describe", PROD_JOB,
                       "--project=" + PROJECT, "--region=" + REGION)
    gate("dedicated production worker job mapped to live Neon, not staging",
         check_job(job))

    scheduled_jobs = json_command("gcloud", "scheduler", "jobs", "list",
                                  "--project=" + PROJECT, "--location=" + REGION)
    scheduler_absent = isinstance(scheduled_jobs, list) and not any(
        (entry.get("name") or "").endswith("/" + SCHEDULER)
        for entry in scheduled_jobs if isinstance(entry, dict)
    )
    gate("scheduler remains absent until Render pollers verified off", scheduler_absent)

    # Inspect actual compiled .js/.html, not just Vite source env files.
    pages_dist = Path("artifacts/examtree/dist/public")
    pages_built = pages_dist.is_dir() and (pages_dist / "admin/index.html").is_file()
    if pages_built:
        environment = dict(os.environ)
        environment.update(VITE_API_BASE_URL="/api", VITE_API_URL="/api")
        try:
            result = subprocess.run(["node", "scripts/check-examtree-cloudflare-cutover.mjs"],
                                    capture_output=True, timeout=30, env=environment)
            pages_built = result.returncode == 0
        except (subprocess.TimeoutExpired, OSError):
            pages_built = False
    gate("compiled student+admin Pages assets contain no direct Render API URLs", pages_built)

    expected = 7 if isinstance(prod, dict) else 5
    print(f"SUMMARY: passed={expected-failed} pending={failed}")
    print("NOTE: This inspector does not verify merchant dashboard/webhook settings, Android APK rollout, Render worker stop, or rollback.")
    if failed:
        raise SystemExit(2)


if __name__ == "__main__":
    main()
