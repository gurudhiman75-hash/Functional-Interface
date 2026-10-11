#!/usr/bin/env python3
"""Read-only auth check: Cloud Run staging + live Pages/Render Question Studio review.

Fetch the historical NUM-001 generation runs on MAIN and verify the older staging
Neon snapshot does not contain them after isolation. Validate the shape the
admin cockpit expects, without fetching tokens/secrets from disk or printing
question contents. No generation requests, review actions or deployments.
Firebase authentication middleware may update last-login metadata.
"""
import base64
import binascii
import getpass
import json
import re
import subprocess
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import HTTPRedirectHandler, Request, build_opener

PROJECT = "sarbedutech"
REGION = "asia-south1"
SERVICE = "examtree-api-staging"
FRONTEND_ORIGIN = "https://examtree.in"
RENDER_ORIGIN = "https://examtree-new.onrender.com"
PAGES_ORIGIN = "https://functional-interface.pages.dev"
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


def jwt_freshness(token, now=None):
    """Read claims locally for diagnostics only; server still verifies signature."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return False, "not a three-part Firebase ID token"
        payload = json.loads(base64.urlsafe_b64decode(
            parts[1] + "=" * (-len(parts[1]) % 4)))
        if not isinstance(payload, dict):
            return False, "invalid JWT payload"
        if payload.get("aud") != PROJECT or payload.get("iss") != (
            "https://securetoken.google.com/" + PROJECT):
            return False, "Firebase project/issuer does not match sarbedutech"
        exp = payload.get("exp")
        if type(exp) is not int:
            return False, "missing JWT expiry timestamp"
        remaining = exp - (int(now) if now is not None else int(time.time()))
        if remaining <= 120:
            return False, "Firebase ID token expired or has under 2 minutes remaining; refresh from the signed-in admin session"
        return True, "Firebase ID token has valid project and unexpired local claims (signature not checked here)"
    except (ValueError, TypeError, KeyError, UnicodeDecodeError, binascii.Error):
        return False, "invalid JWT claims"


def safe_http_error(exc):
    """Never log the Authorization header, token, CF request dumps or HTML."""
    headers = exc.headers
    content_type = (headers.get("Content-Type") or "").split(";")[0].lower()
    server = (headers.get("Server") or "").lower()
    layer = "cloudflare-edge-or-proxy" if ("cloudflare" in server or headers.get("CF-Ray")) else "upstream-or-other"
    code = ""
    if content_type == "application/json":
        try:
            data = json.loads(exc.read(4096))
            if isinstance(data, dict):
                raw_code = data.get("code")
                if isinstance(raw_code, str) and re.fullmatch(r"[A-Z_0-9]{2,80}", raw_code):
                    code += " api_code=" + raw_code
                if data.get("permission") == "content.generation.read":
                    code += " api_permission=content.generation.read"
                # Exact allowlist only: never print arbitrary upstream error texts,
                # diagnostics, URLs, headers, user data or tokens.
                public_errors = {
                    "Administrator permission required": "admin-rbac-denied",
                    "No token provided": "token-not-forwarded",
                    "Invalid token": "firebase-token-rejected",
                    "Authentication required": "authentication-required",
                    "Access denied": "access-denied",
                    "Forbidden": "forbidden",
                    "Cross-origin API request not permitted": "origin-check-denied",
                }
                if isinstance(data.get("error"), str) and data["error"] in public_errors:
                    code += " reason=" + public_errors[data["error"]]
                code += " json_keys=" + ",".join(sorted(
                    key for key in data if isinstance(key, str)
                    and key in {"error", "message", "code", "permission", "success",
                                 "status", "errors", "result", "details"}))
        except (ValueError, UnicodeDecodeError):
            pass
    mitigated = " challenge=true" if (headers.get("cf-mitigated") or "").lower() == "challenge" else ""
    return f"HTTP {exc.code} ({layer}, content_type={content_type or 'unknown'}{code}{mitigated})"


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
    if not re.fullmatch(r"https://examtree-api-staging-[a-zA-Z0-9.-]+\.run\.app", url):
        fail("untrusted Cloud Run staging URL")
    return url


def fetch_curl(origin, code, token):
    """Use the same curl transport that passed Cloud Shell Cloudflare probes.

    urllib's default requests received a Cloudflare 403 on both Pages hosts,
    even without authentication, while the equivalent curl GET succeeded.
    Never place the Firebase token in argv, environment variables or logs:
    supply its Authorization header using curl's --config - via stdin.
    Redirects are disabled, the endpoint is fixed, and only GET is allowed.
    """
    if origin not in (FRONTEND_ORIGIN, PAGES_ORIGIN):
        return None, "unsupported curl origin"
    if token and (token.count(".") != 2 or any(
            not re.fullmatch("[A-Za-z0-9_-]+", part) for part in token.split("."))):
        return None, "invalid Firebase token format"
    url = origin + "/api/admin/question-studio/review-page?" + urlencode({
        "search": code, "packageId": "NUM-001", "page": 1, "pageSize": 10,
    })
    cmd = [
        "curl", "--disable", "--config", "-", "--silent", "--show-error",
        "--max-time", "90", "--max-filesize", str(MAX_RESPONSE_BYTES),
        "--proto", "=https", "--max-redirs", "0", "--request", "GET",
        "--header", "Accept: application/json",
        "--header", "Cache-Control: no-store",
        "--write-out", "\nEXAMTREE_CURL_STATUS:%{http_code}",
        "--url", url,
    ]
    config = ('header = "Authorization: Bearer ' + token + '"\n') if token else ""
    try:
        # --config - reads stdin, not a real .curlrc; stderr may contain
        # request diagnostics but is NEVER displayed or returned.
        completed = subprocess.run(
            cmd, input=config.encode("ascii"), stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL, timeout=100, check=False,
        )
    except (subprocess.TimeoutExpired, OSError):
        return None, "curl unavailable or timed out"
    if completed.returncode != 0:
        return None, "curl request failed (no credentials logged)"
    output = completed.stdout
    marker = b"\nEXAMTREE_CURL_STATUS:"
    marker_index = output.rfind(marker)
    status_bytes = output[marker_index + len(marker):] if marker_index >= 0 else b""
    if not (marker_index >= 0 and len(status_bytes) == 3 and status_bytes.isdigit()):
        return None, "missing curl HTTP status"
    status = int(status_bytes)
    data = output[:marker_index]
    if len(data) > MAX_RESPONSE_BYTES:
        return None, "response exceeds 3 MiB limit"
    if status != 200:
        return None, "HTTP " + str(status) + " (curl GET)"
    try:
        return json.loads(data), None
    except (ValueError, UnicodeDecodeError):
        return None, "invalid response JSON"


def fetch(opener, origin, code, token):
    if origin in (FRONTEND_ORIGIN, PAGES_ORIGIN):
        return fetch_curl(origin, code, token)
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
        return None, safe_http_error(exc)
    except (URLError, ValueError, TimeoutError, json.JSONDecodeError):
        return None, "network, redirect or JSON error"


def main():
    if len(sys.argv) != 1:
        fail("usage: python3 scripts/verify-examtree-question-studio-review-reads.py")
    staging = resolve_staging_url()
    print("Question Studio review GET validation: urllib for Render/staging; curl for Cloudflare Pages (same safe Cloud Shell transport as earlier 200).")
    print("READ ONLY: no generation, review approvals, publication or worker actions.")
    print("Firebase auth may update last-login metadata in the respective live MAIN or isolated STAGING database.")
    token = getpass.getpass("Existing superadmin Firebase ID token (hidden): ").strip()
    if not re.fullmatch(r"[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+", token):
        fail("invalid Firebase ID token format; don't paste credentials into chat")
    fresh, detail = jwt_freshness(token)
    print(("PASS" if fresh else "CHECK") + ": " + detail)
    if not fresh:
        fail("no authenticated requests sent; use a freshly refreshed Firebase ID token from the admin session")
    opener = build_opener(RejectRedirect())
    results = []
    for label, origin in (
        ("Render direct (diagnostic)", RENDER_ORIGIN),
        ("Pages default domain", PAGES_ORIGIN),
        ("Cloudflare custom domain", FRONTEND_ORIGIN),
    ):
        for code, (run_id, count) in RUNS.items():
            data, error = fetch(opener, origin, code, token)
            if error:
                print(f"CHECK: {label}: {code}: {error}")
                results.append(False)
                continue
            valid, reason = validate_review_page(data, run_id, code, count)
            print(f"{'PASS' if valid else 'CHECK'}: {label}: {code}: {reason}")
            results.append(valid)
    # The staging Neon branch was snapshotted Oct 10; these four Oct 11
    # main-branch smoke items must not appear there after isolation.
    for code, (run_id, _) in RUNS.items():
        data, error = fetch(opener, staging, code, token)
        isolated = not error and isinstance(data, dict) and isinstance(data.get("runs"), list)
        isolated = isolated and not any(
            isinstance(run, dict) and run.get("id") == run_id for run in data["runs"]
        )
        print(("PASS" if isolated else "CHECK") +
              ": Cloud Run isolated staging (historical main run absent): " + code +
              ("" if not error else " " + error))
        results.append(bool(isolated))
    token = ""
    print(f"RESULT: {sum(results)}/{len(results)} isolated-main + authenticated read contracts passed")
    # An unauthenticated GET is intentional: 401 demonstrates a functioning
    # auth boundary; 403 on both authenticated and anonymous probes points
    # toward an upstream/edge rule instead of a bad Firebase token.
    print("ANONYMOUS GATEWAY PROBE (expected 401 for review endpoint):")
    for label, origin in (
        ("Render direct", RENDER_ORIGIN),
        ("Pages default domain", PAGES_ORIGIN),
        ("Cloudflare custom domain", FRONTEND_ORIGIN),
    ):
        data, error = fetch(opener, origin, "GEN-20261011-635BA10F", "")
        print(f"PROBE: {label}: " + (error or
              "unexpected HTTP 200 review response; CHECK AUTHORIZATION BOUNDARY"))
    if not all(results):
        fail("review-page read contract incomplete. No writes requested. Report the output.")


if __name__ == "__main__":
    main()
