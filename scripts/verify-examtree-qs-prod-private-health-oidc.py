#!/usr/bin/env python3
"""Examtree QS production private Cloud Run health-only OIDC probe.

Check-only by default. --probe optionally impersonates the *existing* task and
receiver service accounts to GET ONLY /health from two fixed private services.
No IAM grants, production approvals, queue resume, job execution, POST, Neon
access, task enqueue, alert modification or generation. ID tokens and URLs are
never printed, saved, forwarded elsewhere or passed as subprocess arguments.
A successful probe checks Cloud Run invocation, NOT signed Cloud Tasks task
handling or receiver-to-worker application flow.
"""
import argparse
import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
from urllib.parse import urlsplit

PROJECT = "sarbedutech"
REGION = "asia-south1"
TASK_SA = "examtree-qs-task-prod@sarbedutech.iam.gserviceaccount.com"
RECEIVER_SA = "examtree-qs-receiver-prod@sarbedutech.iam.gserviceaccount.com"
PAIRS = (
    ("examtree-qs-receiver-prod", TASK_SA, "qs-receiver-prod"),
    ("examtree-universal-prod", RECEIVER_SA, "qs-universal-prod"),
)
JWT = re.compile(r"^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$")
counts = {"PASS": 0, "REVIEW": 0, "BLOCK": 0}


def report(status, label, explanation=""):
    counts[status] += 1
    print(f"{status}: {label}" + (f" — {explanation}" if explanation else ""), flush=True)


def cli(args, timeout=120):
    try:
        return subprocess.run(args, capture_output=True, text=True,
                              timeout=timeout, check=False)
    except (OSError, subprocess.TimeoutExpired):
        return None


def validate_origin(value, service):
    try:
        parsed = urlsplit(value)
        if (parsed.scheme == "https"
                and parsed.hostname
                and parsed.hostname.startswith(service + "-")
                and parsed.hostname.endswith(".run.app")
                and parsed.port is None and parsed.username is None
                and parsed.password is None and parsed.path in ("", "/")
                and not parsed.query and not parsed.fragment):
            return "https://" + parsed.hostname
    except (ValueError, TypeError):
        pass
    return None


def check_unchanged_safety():
    project = cli(["gcloud", "config", "get-value", "project"], 20)
    if project is None or project.returncode != 0 or project.stdout.strip() != PROJECT:
        report("BLOCK", "active GCP project", "select sarbedutech")
        return False
    result = cli([sys.executable, "scripts/prepare-qs-prod-disabled-only.py"], 300)
    if (result is None or result.returncode != 0
            or "RESULT: PREFLIGHT PASSED; NO CHANGES" not in result.stdout):
        report("BLOCK", "disabled-only safety preflight",
               "inspect existing preflight; do not probe or activate")
        return False
    report("PASS", "production queue paused, generation approvals off, private IAM and Neon safety")
    return True


def service_origin(name):
    result = cli(["gcloud", "run", "services", "describe", name,
                  "--region=" + REGION, "--project=" + PROJECT,
                  "--format=json"])
    if result is None or result.returncode:
        return None
    try:
        data = json.loads(result.stdout)
    except ValueError:
        return None
    return validate_origin((data.get("status") or {}).get("url"), name)


def classify_token_failure(result):
    """Never echo gcloud stderr: it may contain identity or credential details."""
    if result is None:
        return "gcloud unavailable or timed out"
    msg = (result.stderr or "").lower()
    if ("iamcredentials.googleapis.com" in msg and
            any(x in msg for x in ("not enabled", "disabled", "not been used"))):
        return "IAM Credentials API is disabled or not enabled"
    if any(x in msg for x in ("getopenidtoken", "permission_denied",
                              "permission denied", "does not have permission",
                              "403 forbidden")):
        return "identity-token impersonation permission denied"
    if any(x in msg for x in ("invalid choice", "unrecognized arguments",
                              "unrecognized flag", "unrecognized option")):
        return "unsupported gcloud CLI option"
    if any(x in msg for x in ("unauthenticated", "login required",
                              "no active account", "no credentialed accounts")):
        return "Cloud Shell account authentication unavailable"
    return "other gcloud token-generation failure; inspect CLI error locally"


def mint_id_token(account, audience):
    result = cli(["gcloud", "auth", "print-identity-token",
                  "--impersonate-service-account=" + account,
                  "--audiences=" + audience, "--include-email",
                  "--project=" + PROJECT], 90)
    if result is None or result.returncode != 0:
        return None, classify_token_failure(result)
    token = result.stdout.strip()
    if 64 <= len(token) <= 12000 and JWT.fullmatch(token):
        return token, None
    return None, "gcloud returned an invalid or empty identity-token format"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def health_get(origin, token):
    # In-process HTTPS only; no shell, no token in argv, no following redirects.
    request = urllib.request.Request(origin + "/health", method="GET",
                                     headers={"Authorization": "Bearer " + token,
                                              "Accept": "application/json"})
    opener = urllib.request.build_opener(NoRedirect())
    try:
        with opener.open(request, timeout=12) as response:
            status = response.status
            body = response.read(4097)
    except urllib.error.HTTPError as exc:
        return exc.code, None
    except (urllib.error.URLError, OSError, TimeoutError, ValueError):
        return None, None
    if status != 200 or len(body) > 4096:
        return status, None
    try:
        return status, json.loads(body.decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        return status, None


def check_service(name, account, expected_service, do_probe):
    origin = service_origin(name)
    if not origin:
        report("BLOCK", name, "private Cloud Run origin unavailable or unexpected")
        return
    report("PASS", name + " private service origin", "matches the pinned production hostname")
    if not do_probe:
        report("REVIEW", name + " signed GET /health", "use --probe to test without writes")
        return
    token, problem = mint_id_token(account, origin)
    if not token:
        report("REVIEW", name + " signed GET /health",
               "could not mint ID token (" + str(problem) + "); no IAM grant made")
        return
    status, body = health_get(origin, token)
    del token
    if status != 200:
        report("REVIEW", name + " signed GET /health",
               "HTTP " + str(status) + "; inspect IAM/invoker, audience, and logs")
    elif (isinstance(body, dict) and body.get("status") == "ok"
          and body.get("service") == expected_service and body.get("ready") is False):
        report("PASS", name + " signed GET /health",
               "authorized private endpoint returned health-only ready=false")
    else:
        report("BLOCK", name + " disabled health contract",
               "unexpected health response; do not activate")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--probe", action="store_true",
                        help="mint scoped impersonated ID tokens and GET /health only")
    args = parser.parse_args()
    print("EXAMTREE QS PRIVATE OIDC HEALTH CHECK — "
          + ("SIGNED GET ONLY" if args.probe else "METADATA ONLY"))
    if not check_unchanged_safety():
        return 2
    for name, account, expected_service in PAIRS:
        check_service(name, account, expected_service, args.probe)
    print("SUMMARY: " + " ".join(f"{k}={v}" for k, v in counts.items()))
    print("NO PRODUCTION APPROVAL, DB WRITES, TASKS, JOB RUNS OR QUEUE RESUME.")
    print("NOTE: This cannot prove Cloud Tasks task OIDC, POST receiver, "
          "worker computation, alert email delivery or spending limits.")
    if counts["BLOCK"]:
        print("RESULT: BLOCKED; production activation prohibited")
        return 2
    if counts["REVIEW"]:
        print("RESULT: REVIEW; no production activation permitted")
    else:
        print("RESULT: PRIVATE HEALTH-ONLY OIDC PROBES PASSED; "
              "end-to-end task flow NOT validated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
