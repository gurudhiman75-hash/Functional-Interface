#!/usr/bin/env python3
"""Explicitly authorized, fixed-order Cashfree SANDBOX signed-webhook replay.

This constructs a new HMAC around the *already verified* stored success event.
It checks our handler's duplicate key; it is not proof of a Cashfree-originated
redelivery. Never creates a new order, capture, entitlement or refund.
"""
import base64
import hashlib
import hmac
import json
import os
import shutil
import subprocess
import sys
import time
from decimal import Decimal, InvalidOperation
from urllib.parse import unquote, urlsplit
from urllib.request import Request, urlopen
from urllib.error import HTTPError

PROJECT = "sarbedutech"
REGION = "asia-south1"
SERVICE = "examtree-api-staging"
ORDER = "d411a67d-6373-4526-954d-5ed70141e2a7"
DATABASE_SECRET = "examtree-api-database-url"
CASHFREE_SECRET = "examtree-cashfree-sandbox-client-secret"
HOSTS = {
    "ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech",
    "ep-polished-king-atj47i5y-pooler.c-9.us-east-1.aws.neon.tech",
}
SQL = """
SELECT row_to_json(t)::text FROM (
  SELECT o.status AS order_status, pa.status AS payment_status,
    pa.amount_minor::text AS amount_minor, pa.currency,
    pa.provider_order_id, pa.provider_payment_id,
    pe.provider_event_id, pe.event_type, pe.signature_verified,
    pe.processed_at IS NOT NULL AS processed, pe.processing_error, pe.payload,
    (SELECT count(*)::int FROM commerce.order_items oi WHERE oi.order_id=o.id) AS item_count,
    (SELECT count(*)::int FROM commerce.entitlements e JOIN commerce.order_items oi
      ON oi.id=e.order_item_id WHERE oi.order_id=o.id) AS entitlement_count,
    (SELECT count(*)::int FROM commerce.payment_events ev
      WHERE ev.payment_attempt_id=pa.id) AS event_count
  FROM commerce.orders o
  JOIN commerce.payment_attempts pa ON pa.order_id=o.id AND pa.provider='cashfree'
  JOIN commerce.payment_events pe ON pe.payment_attempt_id=pa.id
  WHERE o.id='d411a67d-6373-4526-954d-5ed70141e2a7'::uuid
    AND pe.event_type='PAYMENT_SUCCESS_WEBHOOK'
  ORDER BY pe.received_at DESC LIMIT 1
) t;
"""


def fail(reason):
    sys.exit("FAIL: " + reason)


def command(*args):
    try:
        return subprocess.check_output(args, text=True, stderr=subprocess.DEVNULL, timeout=30).strip()
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, FileNotFoundError):
        fail("required staging verification command failed; no credentials shown")


def secret(name):
    value = command("gcloud", "secrets", "versions", "access", "latest",
                    "--project=" + PROJECT, "--secret=" + name)
    if not value:
        fail("missing sandbox secret " + name)
    return value


def pg_environment(url):
    u = urlsplit(url)
    if u.scheme not in ("postgres", "postgresql") or u.hostname not in HOSTS or u.path != "/neondb":
        fail("refusing noncanonical Neon test database")
    if not u.username or not u.password or u.port not in (None, 5432):
        fail("invalid Neon credentials")
    env = os.environ.copy()
    env.pop("PGOPTIONS", None)
    env.pop("PGSERVICE", None)
    env.update(PGHOST=u.hostname, PGPORT="5432", PGDATABASE="neondb",
               PGUSER=unquote(u.username), PGPASSWORD=unquote(u.password),
               PGSSLMODE="verify-full",
               PGSSLROOTCERT="/etc/ssl/certs/ca-certificates.crt",
               PGCONNECT_TIMEOUT="15", PGAPPNAME="examtree-cashfree-webhook-replay")
    return env


def inspect(psql, env):
    try:
        p = subprocess.run([psql, "-X", "-At", "-q", "-v", "ON_ERROR_STOP=1",
                            "-c", "BEGIN TRANSACTION READ ONLY; " + SQL + " COMMIT;"],
                           env=env, capture_output=True, text=True, timeout=40, check=True)
        rows = [line for line in p.stdout.splitlines() if line.strip()]
        if len(rows) != 1:
            fail("expected exactly one existing signed success event")
        return json.loads(rows[0])
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, ValueError):
        fail("read-only verification failed; no database details shown")


def check_evidence(row):
    if row["order_status"] != "paid" or row["payment_status"] != "captured":
        fail("order/capture not settled; replay refused")
    if row["event_type"] != "PAYMENT_SUCCESS_WEBHOOK" or row["signature_verified"] is not True:
        fail("missing verified success evidence")
    if row["processed"] is not True or row["processing_error"]:
        fail("success webhook not processed")
    if row["item_count"] != 1 or row["entitlement_count"] != 1 or row["event_count"] != 1:
        fail("baseline order/item/entitlement/event counts not exactly one")
    payload = row["payload"]
    if not isinstance(payload, dict):
        fail("invalid recorded event")
    data = payload.get("data") or {}
    payment = data.get("payment") or {}
    order = data.get("order") or {}
    pid = str(payment.get("cf_payment_id", ""))
    if not pid or payload.get("type") != "PAYMENT_SUCCESS_WEBHOOK" or payment.get("payment_status") != "SUCCESS":
        fail("recorded event is not a success")
    if row["provider_order_id"] != ORDER or order.get("order_id") != ORDER:
        fail("provider order does not match fixed sandbox order")
    if str(row["provider_payment_id"]) != pid or row["provider_event_id"] != "PAYMENT_SUCCESS_WEBHOOK:" + pid:
        fail("replay idempotency key mismatch")
    if str(payment.get("payment_currency", "")).upper() != str(row["currency"]).strip():
        fail("payment currency mismatch")
    try:
        if Decimal(str(payment.get("payment_amount"))) * 100 != Decimal(row["amount_minor"]):
            fail("payment amount mismatch")
    except (InvalidOperation, TypeError, ValueError):
        fail("invalid payment amount")
    return payload


def post(url, raw, headers):
    request = Request(url, data=raw, headers=headers, method="POST")
    try:
        with urlopen(request, timeout=45) as response:
            return response.status, response.read(4096)
    except HTTPError as e:
        return e.code, e.read(4096)
    except Exception:
        fail("staging webhook request failed; no writes reported")


def main():
    if os.environ.get("EXAMTREE_CASHFREE_REPLAY_APPROVED") != "yes":
        fail("set EXAMTREE_CASHFREE_REPLAY_APPROVED=yes explicitly")
    if command("gcloud", "config", "get-value", "project") != PROJECT:
        fail("wrong Google Cloud project")
    service = json.loads(command("gcloud", "run", "services", "describe", SERVICE,
                                 "--project=" + PROJECT, "--region=" + REGION, "--format=json"))
    url = str(service.get("status", {}).get("url", "")).rstrip("/")
    if not url.startswith("https://examtree-api-staging-") or not url.endswith(".a.run.app"):
        fail("unexpected Cloud Run staging host")
    env_items = service["spec"]["template"]["spec"]["containers"][0]["env"]
    settings = {x["name"]: x for x in env_items}
    if settings.get("EXAMTREE_PAYMENT_PROVIDER", {}).get("value") != "cashfree" or settings.get("CASHFREE_ENV", {}).get("value") != "sandbox":
        fail("service is not Cashfree sandbox")
    if settings.get("EXAMTREE_API_ORIGIN", {}).get("value", "").rstrip("/") != url:
        fail("staging callback origin mismatch")
    def references(name, secret_name):
        return settings.get(name, {}).get("valueFrom", {}).get("secretKeyRef", {}).get("name") == secret_name
    if not references("DATABASE_URL", DATABASE_SECRET) or not references("CASHFREE_CLIENT_SECRET", CASHFREE_SECRET):
        fail("unexpected deployed staging secret references")
    print("Validated staging-only service and secret mapping.")
    print("Will replay ONLY an already-processed signed success event for fixed order:", ORDER)
    confirmation = input("Type REPLAY-SANDBOX-WEBHOOK to authorize one duplicate delivery: ").strip()
    if confirmation != "REPLAY-SANDBOX-WEBHOOK":
        fail("confirmation not granted")
    psql = shutil.which("psql") or "/usr/lib/postgresql/17/bin/psql"
    if not os.path.isfile(psql):
        fail("psql not installed; install PostgreSQL client")
    pg_env = pg_environment(secret(DATABASE_SECRET))
    before = inspect(psql, pg_env)
    payload = check_evidence(before)
    raw = json.dumps(payload, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    endpoint = url + "/api/billing/cashfree/webhook"
    unsigned_status, _ = post(endpoint, raw, {"Content-Type": "application/json"})
    if unsigned_status != 400:
        fail("unsigned webhook not rejected (expected HTTP 400)")
    print("PASS: unsigned webhook rejected (HTTP 400)")
    timestamp = str(int(time.time()))
    signing_key = secret(CASHFREE_SECRET).encode()
    signature = base64.b64encode(hmac.new(signing_key, timestamp.encode() + raw, hashlib.sha256).digest()).decode()
    status, response = post(endpoint, raw, {
        "Content-Type": "application/json",
        "x-webhook-timestamp": timestamp,
        "x-webhook-signature": signature,
    })
    try:
        body = json.loads(response)
    except ValueError:
        fail("signed duplicate response was not JSON")
    if status != 200 or body.get("ok") is not True or body.get("duplicate") is not True:
        fail("signed replay was not acknowledged as duplicate")
    print("PASS: signed replay returned duplicate=true")
    after = inspect(psql, pg_env)
    check_evidence(after)
    for key in ("order_status", "payment_status", "item_count", "entitlement_count",
                "event_count", "provider_payment_id", "provider_event_id"):
        if after[key] != before[key]:
            fail("replay altered baseline: " + key)
    print("PASS: paid order, captured payment, one item, one event and one entitlement unchanged")
    print("PASS: fixed-order synthetic sandbox signed-webhook replay acceptance")
    print("NOTE: provider-initiated Cashfree redelivery remains a distinct test.")


if __name__ == "__main__":
    main()
