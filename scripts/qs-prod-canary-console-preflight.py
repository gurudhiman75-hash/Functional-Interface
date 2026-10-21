#!/usr/bin/env python3
"""Read-only Examtree production canary preflight for manual Cloud Build.

NEVER updates production, starts a job, accesses secrets, dispatches tasks,
resumes a queue or reads the database. Any incomplete/ambiguous metadata fails
closed. The old cancelled canary is audited separately via the Neon connector.
"""
import argparse
import json
import re
import subprocess
import sys

PROJECT = "sarbedutech"
REGION = "asia-south1"
QUEUE = "examtree-qs-prod"
SCHEDULER = "examtree-qs-prod-canary-cleanup-trigger"
RUN_ID = "c71b5ccb-8aa6-44e0-b0a5-01a3607a9c98"
RECEIVER = "examtree-qs-receiver-prod"
WORKER = "examtree-universal-prod"
ENQUEUE = "examtree-qs-prod-one-run-enqueue"
CLEANUP = "examtree-qs-prod-canary-cleanup"
DISPATCH = "examtree-qs-dispatch-prod"
PIN = "EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID"
ONLY = "EXAMTREE_QS_PRODUCTION_CANARY_ONLY"
FLAGS = {
    RECEIVER: "EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED",
    WORKER: "EXAMTREE_QS_PRODUCTION_WORKER_APPROVED",
}
EXPECTED_SA = {
    RECEIVER: "examtree-qs-receiver-prod@sarbedutech.iam.gserviceaccount.com",
    WORKER: "examtree-qs-worker-prod@sarbedutech.iam.gserviceaccount.com",
    ENQUEUE: "examtree-qs-canary-enqueue@sarbedutech.iam.gserviceaccount.com",
    CLEANUP: "examtree-qs-canary-cleanup@sarbedutech.iam.gserviceaccount.com",
}

class Stop(Exception):
    pass

def require(condition, message):
    if not condition:
        raise Stop(message)

def fetch(*args):
    p = subprocess.run(
        ["gcloud", *args, "--project=" + PROJECT, "--format=json"],
        text=True, capture_output=True, timeout=90, check=False)
    require(p.returncode == 0, "GCP metadata access unavailable")
    try:
        return json.loads(p.stdout)
    except (TypeError, ValueError):
        raise Stop("Unexpected GCP metadata") from None

def container(record):
    node = record.get("spec", {}).get("template", {})
    for _ in range(6):
        if not isinstance(node, dict):
            break
        if "containers" in node:
            c = node["containers"]
            require(isinstance(c, list) and len(c) == 1, "Unexpected containers")
            raw = c[0].get("env", [])
            require(isinstance(raw, list), "Invalid environment")
            keys = [e.get("name") for e in raw]
            require(len(keys) == len(set(keys)), "Duplicated environment keys")
            return c[0], node, {e["name"]: e.get("value") for e in raw}
        node = node.get("spec", node.get("template", {}))
    raise Stop("Missing container metadata")

def verify_service(name):
    service = fetch("run", "services", "describe", name, "--region=" + REGION)
    conf, template, values = container(service)
    require(template.get("serviceAccountName") == EXPECTED_SA[name],
            "Unexpected runtime service identity")
    require(values.get(PIN) == RUN_ID, "Canary run ID mismatch")
    require(values.get(ONLY) == "false" and values.get(FLAGS[name]) == "false",
            "Production approval not disabled")
    require(values.get("EXAMTREE_API_RUNTIME") == "cloud-run" and
            values.get("EXAMTREE_API_STAGING") == "false", "Runtime isolation mismatch")
    revision = (service.get("status") or {}).get("latestReadyRevisionName")
    require(revision and revision == service["status"].get("latestCreatedRevisionName"),
            "Latest revision not Ready")
    desired = (service.get("spec") or {}).get("traffic") or []
    actual = (service.get("status") or {}).get("traffic") or []
    require(len(desired) == len(actual) == 1 and
            desired[0].get("revisionName") == actual[0].get("revisionName") == revision and
            desired[0].get("percent") == actual[0].get("percent") == 100 and
            desired[0].get("latestRevision") is not True,
            "Traffic not pinned to latest Ready revision")
    immutable = fetch("run", "revisions", "describe", revision, "--region=" + REGION)
    state = (immutable.get("status") or {}).get("conditions") or []
    require(any(x.get("type") == "Ready" and x.get("status") == "True" for x in state),
            "Serving revision not Ready")
    revision_container = (immutable.get("spec") or {}).get("containers") or []
    require(len(revision_container) == 1, "Unexpected serving revision containers")
    revision_env = revision_container[0].get("env") or []
    require(len(revision_env) == len({e.get("name") for e in revision_env}),
            "Duplicate revision variables")
    live = {e["name"]: e.get("value") for e in revision_env}
    require(live.get(PIN) == RUN_ID and live.get(ONLY) == "false"
            and live.get(FLAGS[name]) == "false", "Serving revision is not guarded OFF")
    require(revision_container[0].get("image") == conf.get("image"),
            "Revision image differs from template")
    require(immutable.get("spec", {}).get("serviceAccountName") == EXPECTED_SA[name],
            "Serving revision identity mismatch")
    print("PASS: disabled, pinned, Ready serving revision:", name, flush=True)

def verify_job(name):
    job = fetch("run", "jobs", "describe", name, "--region=" + REGION)
    c, spec, env = container(job)
    require(spec.get("serviceAccountName") == EXPECTED_SA[name],
            "Unexpected job service account")
    require(spec.get("taskCount", 1) == 1, "Unexpected task count")
    require("@sha256:" in (c.get("image") or ""), "Job image is not pinned by digest")
    return job, c, spec, env

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--run-id", required=True)
    a = parser.parse_args()
    require(a.run_id == RUN_ID, "Only the designated replacement UUID is allowed")
    q = fetch("tasks", "queues", "describe", QUEUE, "--location=" + REGION)
    require(q.get("state") == "PAUSED", "Production queue is not PAUSED")
    tasks = fetch("tasks", "list", "--queue=" + QUEUE, "--location=" + REGION, "--limit=1")
    require(tasks == [], "Production queue has pending tasks")
    s = fetch("scheduler", "jobs", "describe", SCHEDULER, "--location=" + REGION)
    require(s.get("state") == "PAUSED", "Cleanup Scheduler not paused at preflight")
    target = s.get("httpTarget") or {}
    require(target.get("uri") ==
            "https://run.googleapis.com/v2/projects/" + PROJECT +
            "/locations/" + REGION + "/jobs/" + CLEANUP + ":run" and
            (target.get("oauthToken") or {}).get("serviceAccountEmail") ==
            "examtree-qs-canary-trigger@sarbedutech.iam.gserviceaccount.com",
            "Cleanup Scheduler target / identity mismatch")
    print("PASS: queue empty/paused, rollback Scheduler paused and targeted", flush=True)
    verify_service(RECEIVER)
    verify_service(WORKER)
    job, image, spec, env = verify_job(ENQUEUE)
    require(env.get(PIN) == RUN_ID and env.get(ONLY) == "false" and
            env.get("EXAMTREE_QS_PRODUCTION_CANARY_ENQUEUE_APPROVED") == "false",
            "Enqueue Job is not correctly disabled/pinned")
    require((image.get("command") or []) == ["node"] and
            (image.get("args") or []) ==
            ["artifacts/api-server/dist/prod-one-run-enqueue.mjs"],
            "Wrong enqueue entrypoint")
    require(job.get("spec", {}).get("template", {}).get("spec", {}).get("maxRetries", 0) == 0,
            "Enqueue retries must be zero")
    print("PASS: enqueue Job disabled, correct entrypoint, digest-pinned", flush=True)
    _, cleanup, _, cleanup_env = verify_job(CLEANUP)
    require(cleanup_env.get(ONLY) == "true" and
            cleanup_env.get("EXAMTREE_QS_PRODUCTION_CANARY_CLEANUP_APPROVED") == "true",
            "Cleanup not authorized for next timeboxed run")
    require((cleanup.get("args") or []) == ["--apply"], "Wrong cleanup entrypoint")
    print("PASS: scoped cleanup Job ready", flush=True)
    dispatcher = fetch("run", "jobs", "describe", DISPATCH, "--region=" + REGION)
    _, _, d_env = container(dispatcher)
    require(d_env.get("EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED") == "false",
            "Broad production dispatcher is enabled")
    print("PASS: broad dispatcher remains OFF", flush=True)
    print("READY_FOR_MANUAL_RELEASE_REVIEW; READ_ONLY; NO GENERATION", flush=True)

if __name__ == "__main__":
    try:
        main()
    except (Stop, subprocess.TimeoutExpired, OSError) as exc:
        print("STOP:", str(exc) if isinstance(exc, Stop)
              else "GCP metadata check unavailable", file=sys.stderr)
        print("NO CONFIGURATION CHANGED; NEVER RETRY CANARY BLINDLY", file=sys.stderr)
        sys.exit(2)
