#!/usr/bin/env python3
"""Read-only auth check: Cloud Run staging + live Pages/Render Question Studio review.

Fetch only two known disposable NUM-001 generation runs. Validate the shape the
admin cockpit expects, without fetching tokens/secrets from disk or printing
question contents. No generation requests, review actions or deployments.
Firebase authentication middleware may update last-login metadata.
"""
import getpass
import json
import re
import subprocess
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import HTTPRedirectHandler, Request, build_opener

PROJECT = "sarbedutech"
REGION = "asia-south1"
SERVICE = "examtree-api-staging"
FRONTEND_ORIGIN = "https://examtree.in"
RUNS = {
    "GEN-20261011-7535FFC2": ("802f5472-41f5-4c61-904e-2187fedd01a3", 1),
    "GEN-20261011-635BA10F": ("5682e459-7b2d-46ba-b57b-778a3b2ce0b4", 3),
}
MAX_RESPONSE_BYTES = 3 * 1024 * 1024


def fail(message):
    raise SystemExit("FAIL: " + message)


class RejectRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ValueError("Unexpected redirect; do not forward the Firebase token")


def validate_review_page(data, run_id, code, expected_count):
    """Check API->React shape; do not claim editorial approval or DB locks."""
    if not isinstance(data, dict) or not isinstance(data.get("runs"), list):
        return False, "missing runs list"
    matches = [run for run in data["runs"] if isinstance(run, dict)
               and run.get("id") == run_id and run.get("publicCode") == code]
    if len(matches) != 1:
        return False, "expected saved run absent or duplicated"
    run = matches[0]
    if run.get("status") != "review" or not isinstance(run.get("requestSnapshot"), dict):
        return False, "run not in review or missing snapshot"
    if run["requestSnapshot"].get("packageId") != "NUM-001":
        return False, "wrong package ID"
    summary, items = run.get("reviewSummary"), run.get("items")
    if not isinstance(summary, dict) or not isinstance(items, list):
        return False, "missing review summary/items"
    if summary.get("total") != expected_count or summary.get("unreviewed") != expected_count:
        return False, "incorrect saved counts"
    if len(items) != expected_count:
        return False, "wrong item count"
    item_numbers = set()
    for item in items:
        if not isinstance(item, dict):
            return False, "invalid item"
        num = item.get("itemNumber")
        if not isinstance(num, int) or num in item_numbers or num < 1 or num > expected_count:
            return False, "invalid item numbering"
        item_numbers.add(num)
        if item.get("status") != "unreviewed" or item.get("currentVersionNumber") != 1:
            return False, "unexpected editorial state/version"
        if not isinstance(item.get("versionId"), str) or not item.get("versionId"):
            return False, "missing persisted version ID"
        payload = item.get("payload")
        if not isinstance(payload, dict):
            return False, "missing saved payload"
        stem = payload.get("text") or payload.get("stem")
        explanation = payload.get("explanation")
        options = payload.get("options")
        if not isinstance(stem, str) or not stem.strip():
            return False, "question stem unavailable"
        if not isinstance(explanation, str) or len(explanation.strip()) < 20:
            return False, "question explanation unavailable"
        if (not isinstance(options, list) or len(options) != 4
                or not all(isinstance(x, str) and x.strip() for x in options)):
            return False, "question answer options unavailable"
        try:
            index = int(payload.get("correctIndex", payload.get("correct")))
        except (ValueError, TypeError):
            return False, "correct-answer index absent"
        if index not in range(4):
            return False, "correct-answer index invalid"
    if item_numbers != set(range(1, expected_count + 1)):
        return False, "missing numbered items"
    return True, "review run, item versions, stems, four options, answer indices and explanations returned"


def resolve_staging_url():
    try:
        selected = subprocess.check_output(
            ["gcloud", "config", "get-value", "project"],
            stderr=subprocess.DEVNULL, text=True, timeout=20).strip()
        if selected != PROJECT:
            fail("gcloud project must be sarbedutech")
        url = subprocess.check_output([
            "gcloud", "run", "services", "describe", SERVICE,
            "--region=" + REGION, "--project=" + PROJECT, "--format=value(status.url)"],
            stderr=subprocess.DEVNULL, text=True, timeout=35).strip()
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, OSError):
        fail("could not resolve the deployed Cloud Run staging service")
    if not re.fullmatch(r"https://examtree-api-staging-[a-zA-Z0-9.-]+\\.run\\.app", url):
        fail("untrusted Cloud Run staging URL")
    return url


def fetch(opener, origin, code, token):
    url = origin + "/api/admin/question-studio/review-page?" + urlencode({
        "search": code, "packageId": "NUM-001", "page": 1, "pageSize": 10,
    })
    req = Request(url, method="GET", headers={
        "Authorization": "Bearer " + token,
        "Accept": "application/json",
        "Cache-Control": "no-store",
    })
    try:
        with opener.open(req, timeout=100) as response:
            if response.status != 200:
                return None, "HTTP " + str(response.status)
            content = response.read(MAX_RESPONSE_BYTES + 1)
            if len(content) > MAX_RESPONSE_BYTES:
                return None, "response exceeds 3 MiB limit"
            return json.loads(content), None
    except HTTPError as exc:
        return None, "HTTP " + str(exc.code)
    except (URLError, ValueError, TimeoutError, json.JSONDecodeError):
        return None, "network, redirect or JSON error"


def main():
    if len(sys.argv) != 1:
        fail("usage: python3 scripts/verify-examtree-question-studio-review-reads.py")
    staging = resolve_staging_url()
    print("Question Studio review GET validation: Cloud Run staging and Cloudflare/Render.")
    print("READ ONLY: no generation, review approvals, publication or worker actions.")
    print("Firebase auth may update last-login metadata in the shared TEST database.")
    token = getpass.getpass("Existing superadmin Firebase ID token (hidden): ").strip()
    if not re.fullmatch(r"[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+", token):
        fail("invalid Firebase ID token format; don't paste credentials into chat")
    opener = build_opener(RejectRedirect())
    results = []
    for label, origin in (("Cloud Run staging", staging), ("Cloudflare/Render", FRONTEND_ORIGIN)):
        for code, (run_id, count) in RUNS.items():
            data, error = fetch(opener, origin, code, token)
            if error:
                print(f"CHECK: {label}: {code}: {error}")
                results.append(False)
                continue
            valid, reason = validate_review_page(data, run_id, code, count)
            print(f"{'PASS' if valid else 'CHECK'}: {label}: {code}: {reason}")
            results.append(valid)
    token = ""
    print(f"RESULT: {sum(results)}/{len(results)} exact authenticated read contracts passed")
    if not all(results):
        fail("review-page read contract incomplete. No writes requested. Report the output.")


if __name__ == "__main__":
    main()
