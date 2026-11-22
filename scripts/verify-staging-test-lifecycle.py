#!/usr/bin/env python3
"""Staging-only checks for PR #3619 (direct publish, live edits, active-attempt guard).

Runs against examtree-api-staging (isolated Neon branch) ONLY. It refuses any
other service. Firebase ID tokens are read with hidden input and sent only as
an Authorization header; they are never printed or written to disk.

What it does on STAGING data:
  1. Picks a live test (or --test-id) and starts a student attempt on it.
  2. Saves a no-op edit of the live test as a new draft version.
  3. Checks the test is still visible to students and the attempt still loads.
  4. Tries to publish the edit: expects 409 TEST_HAS_ACTIVE_ATTEMPTS.
  5. Checks /actions/approve-schedule exists and validates input (400, not 404).
It leaves the new draft version and the in-progress attempt on staging.

  python3 scripts/verify-staging-test-lifecycle.py [--test-id <uuid>]
"""
import argparse
import getpass
import json
import re
import subprocess
import sys
import urllib.error
import urllib.request

PROJECT = "sarbedutech"
REGION = "asia-south1"
SERVICE = "examtree-api-staging"
JWT = re.compile(r"^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$")
results = []


def gcloud(*args):
    out = subprocess.run(["gcloud", *args], capture_output=True, text=True, timeout=60)
    if out.returncode != 0:
        sys.exit(f"FAIL: gcloud {' '.join(args[:3])}: {out.stderr.strip()[:200]}")
    return out.stdout.strip()


def call(base, token, method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(base + path, data=data, method=method)
    req.add_header("Authorization", "Bearer " + token)
    if data is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            raw = resp.read()
            status = resp.status
    except urllib.error.HTTPError as err:
        raw, status = err.read(), err.code
    try:
        payload = json.loads(raw or b"{}")
    except ValueError:
        payload = {"_raw": raw[:200].decode(errors="replace")}
    return status, payload


def check(name, ok, detail=""):
    results.append(ok)
    print(("PASS" if ok else "FAIL") + f": {name}" + (f"  [{detail}]" if detail else ""))
    return ok


def token(label):
    if not sys.stdin.isatty():
        sys.exit("FAIL: interactive terminal required; never pipe tokens in.")
    value = getpass.getpass(f"Paste STAGING {label} Firebase ID token (hidden): ").strip()
    if not JWT.match(value):
        sys.exit("FAIL: expected a Firebase ID token (three dot-separated parts).")
    return value


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--test-id", help="live test UUID to use (default: first live test without pending edits)")
    args = parser.parse_args()

    if gcloud("config", "get-value", "project") != PROJECT:
        sys.exit(f"FAIL: gcloud project must be {PROJECT}")
    base = gcloud("run", "services", "describe", SERVICE, f"--project={PROJECT}", f"--region={REGION}",
                  "--format=value(status.url)")
    if not re.fullmatch(r"https://examtree-api-staging-[a-z0-9-]+\.a\.run\.app", base):
        sys.exit(f"FAIL: refusing non-staging URL {base!r}")
    image = gcloud("run", "services", "describe", SERVICE, f"--project={PROJECT}", f"--region={REGION}",
                   "--format=value(spec.template.spec.containers[0].image)")
    head = subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True, text=True).stdout.strip()
    print(f"staging: {base}\nimage commit: {image.rsplit(':', 1)[-1][:12]}   local HEAD: {head[:12]}")
    check("staging runs the checked-out commit", image.endswith(":" + head))

    admin = token("ADMIN")
    student = token("STUDENT")

    # 1. choose a live test with no pending edits
    test_id = args.test_id
    if not test_id:
        status, body = call(base, admin, "GET", "/api/admin/tests")
        if not check("admin can list tests", status == 200, f"HTTP {status}"):
            return finish()
        tests = body.get("tests", []) if isinstance(body, dict) else []
        for t in tests:
            if t.get("status") == "live" and t.get("currentDraftVersionId") \
                    and t.get("currentDraftVersionId") == t.get("publishedVersionId", t.get("currentDraftVersionId")):
                test_id = t.get("id")
                break
        if not test_id:
            check("found a live test on staging", False, "none live; pass --test-id or publish one first")
            return finish()
    status, detail = call(base, admin, "GET", f"/api/admin/tests/{test_id}")
    if not check("admin can load test detail", status == 200, f"HTTP {status}"):
        return finish()
    test = detail["test"]
    print(f"using test {test.get('publicCode')} ({test_id}) status={test.get('status')}")
    if not check("test is live with no pending edits", test.get("status") == "live"
                 and test.get("currentDraftVersionId") == test.get("publishedVersionId")):
        return finish()

    # 2. student starts (or resumes) an attempt
    status, session = call(base, student, "POST", "/api/attempt-sessions", {"testId": test_id})
    if not check("student can start an attempt", status in (200, 201), f"HTTP {status} {session.get('code', '')}"):
        return finish()
    attempt_id = session.get("id")

    # 3. no-op edit of the live test, saved as a new draft version
    version = detail.get("currentVersion") or {}
    draft = {
        "expectedCurrentDraftVersionId": test["currentDraftVersionId"],
        "examVersionId": test["examVersionId"],
        "title": version.get("title"),
        "description": version.get("description") or "",
        "durationMinutes": (version.get("durationSeconds") or 0) / 60,
        "totalMarks": version.get("totalMarks") or 0,
        "instructions": version.get("instructions") or {},
        "settings": version.get("settings") or {},
        "changeReason": "staging check PR #3619: no-op edit of a live test",
        "sections": [{
            "clientKey": s.get("sectionKey"),
            "name": s.get("name"),
            "durationMinutes": None if s.get("durationSeconds") is None else s["durationSeconds"] / 60,
            "settings": s.get("settings") or {},
            "questions": [{
                "questionVersionId": q.get("questionVersionId"),
                "marks": q.get("marks"),
                "negativeMarks": q.get("negativeMarks") or 0,
                "settings": q.get("settings") or {},
            } for q in s.get("questions", [])],
        } for s in detail.get("sections", [])],
    }
    status, saved = call(base, admin, "PUT", f"/api/admin/tests/{test_id}/draft", draft)
    if not check("admin can save an edit of the live test", status == 200,
                 f"HTTP {status} {saved.get('code', '')} {saved.get('error', '')}"[:200]):
        return finish()
    saved_test = saved.get("test", {})
    new_draft = saved_test.get("currentDraftVersionId")
    check("test stays LIVE after the edit is saved", saved_test.get("status") == "live",
          f"status={saved_test.get('status')}")
    check("published version unchanged, new draft created",
          saved_test.get("publishedVersionId") == test.get("publishedVersionId") and new_draft != test.get("publishedVersionId"))

    # 4. students are unaffected
    status, _ = call(base, student, "GET", f"/api/tests/{test_id}")
    check("students can still open the test", status == 200, f"HTTP {status}")
    if attempt_id:
        status, resumed = call(base, student, "GET", f"/api/attempt-sessions/{attempt_id}")
        check("student's attempt still loads", status == 200, f"HTTP {status}")

    # 5. republish is blocked while the attempt is in progress
    status, blocked = call(base, admin, "POST", f"/api/admin/tests/{test_id}/actions/approve-publish",
                           {"expectedCurrentDraftVersionId": new_draft})
    check("republish blocked by active attempt", status == 409 and blocked.get("code") == "TEST_HAS_ACTIVE_ATTEMPTS",
          f"HTTP {status} {blocked.get('code', '')}")

    # 6. approve-schedule route exists and validates input
    status, sched = call(base, admin, "POST", f"/api/admin/tests/{test_id}/actions/approve-schedule", {})
    check("approve-schedule route exists and rejects bad input", status == 400, f"HTTP {status} {sched.get('code', '')}")

    finish()


def finish():
    passed = sum(results)
    print(f"\n== {passed}/{len(results)} checks passed. Staging now has a new draft version of the test and an in-progress attempt.")
    sys.exit(0 if results and all(results) else 1)


if __name__ == "__main__":
    main()
