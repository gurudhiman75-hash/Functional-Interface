#!/usr/bin/env python3
"""One explicit authenticated NUM-001 review-only generation via Cloud Run staging.

May create a content.generation_runs REVIEW record, item versions, an audit
event and an outbox event on the isolated Neon STAGING branch. It never
publishes to the Question Bank, launches a scheduled job, purchases anything,
or changes Render/Cloudflare traffic. Do NOT blindly repeat on timeout.
"""
import getpass
import json
import os
import re
import subprocess
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

PROJECT = "sarbedutech"
REGION = "asia-south1"
SERVICE = "examtree-api-staging"
ALLOWED = {1, 3}


def abort(message):
    raise SystemExit("FAIL: " + message)


def staging_configuration(data):
    if not isinstance(data, dict):
        return False, None
    spec = data.get("spec") or {}
    template = spec.get("template") or {}
    containers = (template.get("spec") or {}).get("containers") or []
    if len(containers) != 1:
        return False, None
    e = {item.get("name"): item for item in containers[0].get("env") or []}
    flag = lambda key: (e.get(key) or {}).get("value")
    origin = flag("EXAMTREE_API_ORIGIN")
    published = (data.get("status") or {}).get("url", "")
    ok = all([
        flag("EXAMTREE_API_RUNTIME") == "cloud-run",
        flag("EXAMTREE_API_STAGING") == "true",
        flag("EXAMTREE_PAYMENT_PROVIDER") == "cashfree",
        flag("CASHFREE_ENV") == "sandbox",
        flag("GENERATION_JOB_WORKER_ENABLED") == "false",
        flag("OUTBOX_PUBLISHER_ENABLED") == "false",
        bool(flag("QUESTION_STUDIO_SHARED_WORKER_URL")),
        (e.get("DATABASE_URL") or {}).get("valueFrom", {}).get("secretKeyRef", {}).get("name")
            == "examtree-api-staging-database-url",
        (e.get("QUESTION_STUDIO_WORKER_TOKEN") or {}).get("valueFrom", {}).get("secretKeyRef", {}).get("name")
            == "examtree-trg002-worker-token",
        origin == published,
        published.startswith("https://examtree-api-staging-"),
        published.endswith(".run.app"),
    ])
    return ok, published if ok else None


def valid_result(body, count):
    if not isinstance(body, dict):
        return False
    return (bool(re.fullmatch(r"[0-9a-f-]{36}", str(body.get("id", ""))))
            and str(body.get("publicCode", "")).startswith("GEN-")
            and body.get("status") == "review"
            and body.get("itemCount") == count
            and body.get("generationSystem") == "quant-v4")


def main():
    if len(sys.argv) != 2 or sys.argv[1] not in ("1", "3"):
        abort("usage: EXAMTREE_NUM001_REVIEW_WRITE_APPROVED=yes python3 scripts/verify-examtree-cloudrun-num001-review.py 1|3")
    count = int(sys.argv[1])
    if count not in ALLOWED or os.environ.get("EXAMTREE_NUM001_REVIEW_WRITE_APPROVED") != "yes":
        abort("only explicitly approved one- or three-question staging review writes allowed")
    try:
        project = subprocess.check_output(
            ["gcloud", "config", "get-value", "project"], text=True, stderr=subprocess.DEVNULL,
            timeout=20).strip()
        if project != PROJECT:
            abort("wrong Google Cloud project")
        raw = subprocess.check_output([
            "gcloud", "run", "services", "describe", SERVICE, "--project=" + PROJECT,
            "--region=" + REGION, "--format=json"], text=True, stderr=subprocess.DEVNULL,
            timeout=35)
        allowed, origin = staging_configuration(json.loads(raw))
    except (ValueError, subprocess.CalledProcessError, subprocess.TimeoutExpired, OSError):
        abort("could not verify Cloud Run staging service; nothing submitted")
    if not allowed:
        abort("staging remote-worker configuration or isolation flags not verified; no generation submitted")
    print("PASS: Cloud Run sandbox staging and remote shared worker configured; outbox publisher OFF")
    print("ONE request will write", count, "NUM-001 REVIEW_ONLY question(s) into the shared Neon TEST database.")
    print("Question Bank publication, test eligibility and student delivery remain disabled.")
    print("Difficulty uses Mixed because NUM-001 source authority does NOT support filtering; inspect actual saved tier labels.")
    print("If the request times out, DO NOT RETRY before checking generation runs.")
    typed = input("Type GENERATE-REVIEW-ONLY to authorize one generation request: ").strip()
    if typed != "GENERATE-REVIEW-ONLY":
        abort("confirmation not granted; no request sent")
    token = getpass.getpass("Existing superadmin Firebase ID token (hidden): ").strip()
    if not re.fullmatch(r"[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+", token):
        abort("expected Firebase JWT; do not paste tokens into chat")
    body = {
        "packageId": "NUM-001", "count": count, "cpIds": ["NUM-CP-001"],
        "language": "en", "difficulty": "Mixed", "engineId": "quant-v4",
        "runtimeMode": "QUESTION_STUDIO_ACTIVE", "exam": "SSC CGL Tier 1",
    }
    req = Request(origin + "/api/admin/question-studio/runs",
                  data=json.dumps(body, separators=(",", ":")).encode("utf-8"),
                  method="POST", headers={
                      "Authorization": "Bearer " + token,
                      "Content-Type": "application/json",
                  })
    token = ""
    try:
        with urlopen(req, timeout=225) as response:
            status = response.status
            data = json.loads(response.read(16384))
    except HTTPError as e:
        abort("admin generation HTTP " + str(e.code) + "; inspect staging logs; do NOT automatically retry")
    except (URLError, TimeoutError, ValueError):
        abort("unknown response after submission; inspect database before ANY retry")
    if status != 201 or not valid_result(data, count):
        abort("generation result did not meet 201 REVIEW_ONLY count contract; do NOT retry automatically")
    print("PASS: authenticated Cloud Run NUM-001 generation, count=", count, sep="")
    print("PASS: API returned REVIEW_ONLY run: " + data["id"])
    print("PASS: public code: " + data["publicCode"])
    print("NOTE: This test verifies batch persistence, not per-difficulty quota compliance.")
    print("NEXT: independently query the generation run and item payload lifecycle before closing gate")
    print("NOTE: API reply alone does not verify persisted item payloads")


if __name__ == "__main__":
    main()
