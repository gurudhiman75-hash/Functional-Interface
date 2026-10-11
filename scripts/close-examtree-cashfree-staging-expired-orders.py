#!/usr/bin/env python3
"""Close ONLY two fixed expired Cashfree SANDBOX test orders, after provider GET proof.

This is an explicit one-time staging ledger action. No payment/refund POST,
no payment ID rewrites, no entitlement updates, no webhook registration,
and no production infrastructure changes. Refuses action until Cloud Run
has the terminal-capture safety patch deployed.
"""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation

ROOT = Path(__file__).resolve().parents[1]
AUDIT_PATH = ROOT / "scripts/audit-cashfree-sandbox-readonly.py"
REPLAY_PATH = ROOT / "scripts/verify-examtree-cashfree-cloudrun-webhook-replay.py"


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


audit = load("cashfree_sandbox_audit", AUDIT_PATH)
gate = load("cashfree_staging_replay", REPLAY_PATH)
PROJECT = "sarbedutech"
SERVICE = "examtree-api-staging"
REGION = "asia-south1"
ORDERS = {
    "d279217e-1360-4c85-b439-121e8b54f6cb": "cancelled",
    "f392e2ef-eb30-47f9-8674-77627421a385": "failed",
}
ALLOWED_GATEWAY_ATTEMPTS = {"FAILED", "USER_DROPPED", "CANCELLED", "NOT_ATTEMPTED"}


def fail(message):
    raise RuntimeError(message)


def provider_safe_to_close(row, gateway_order, payments, now=None):
    """Pure check. A non-success order is NOT necessarily safe if still active."""
    now = now or datetime.now(timezone.utc)
    order_id = str(row.get("order", ""))
    if order_id not in ORDERS:
        fail("unexpected sandbox order")
    if (row.get("order_status") != "payment_pending"
        or row.get("payment_status") != ORDERS[order_id]
        or row.get("provider_order") != order_id
        or row.get("provider_payment") is not None
        or row.get("signed_payment_ids")):
        fail("canonical order/payment evidence not eligible")
    try:
        expiry = datetime.fromisoformat(str(row.get("expires_at")).replace("Z", "+00:00"))
        if expiry.tzinfo is None or (now - expiry).total_seconds() < 86400:
            fail("local order has not been expired at least 24 hours")
    except (ValueError, TypeError):
        fail("missing canonical expiry timestamp")
    if not isinstance(gateway_order, dict) or not isinstance(payments, list):
        fail("sandbox provider GET evidence missing")
    if str(gateway_order.get("order_id", "")) != order_id:
        fail("provider order ID mismatch")
    if str(gateway_order.get("order_currency", "")).upper() != "INR":
        fail("provider currency mismatch")
    try:
        if Decimal(str(gateway_order.get("order_amount"))) * 100 != Decimal(str(row.get("payment_amount_minor"))):
            fail("provider amount mismatch")
    except (InvalidOperation, ValueError, TypeError):
        fail("provider amount unreadable")
    # An ACTIVE Cashfree order could still accept payment. Never close it.
    if str(gateway_order.get("order_status", "")).upper() not in ("EXPIRED", "TERMINATED"):
        fail("provider order is not conclusively expired/terminated")
    if any(
        not isinstance(payment, dict)
        or str(payment.get("payment_status", "")).upper() not in ALLOWED_GATEWAY_ATTEMPTS
        for payment in payments
    ):
        fail("provider payments include pending, success or unknown outcome")
    return True


def require_patched_staging():
    if gate.command("gcloud", "config", "get-value", "project") != PROJECT:
        fail("wrong GCP project")
    raw = gate.command("gcloud", "run", "services", "describe", SERVICE,
                       "--project=" + PROJECT, "--region=" + REGION, "--format=json")
    spec = json.loads(raw)
    url = str(spec.get("status", {}).get("url", ""))
    if not url.startswith("https://examtree-api-staging-") or not url.endswith(".a.run.app"):
        fail("unexpected staging host")
    container = spec["spec"]["template"]["spec"]["containers"][0]
    env = {x["name"]: x for x in container["env"]}
    if env.get("EXAMTREE_PAYMENT_PROVIDER", {}).get("value") != "cashfree":
        fail("wrong payment provider")
    if env.get("CASHFREE_ENV", {}).get("value") != "sandbox":
        fail("refusing non-sandbox payment environment")
    if env.get("EXAMTREE_API_ORIGIN", {}).get("value") != url:
        fail("callback origin mismatch")
    image = container.get("image", "")
    prefix = f"{REGION}-docker.pkg.dev/{PROJECT}/examtree-workers/examtree-api:"
    if not image.startswith(prefix):
        fail("noncanonical image provenance")
    rev = image.removeprefix(prefix)
    if len(rev) != 40 or any(ch not in "0123456789abcdef" for ch in rev):
        fail("unpinned staging image")
    for path in ("artifacts/api-server/src/lib/commerce-capture-state.ts",
                 "artifacts/api-server/src/lib/canonical-commerce-payments.ts"):
        commit = gate.command("git", "-C", str(ROOT), "log", "-1", "--format=%H", "--", path)
        if not commit:
            fail("missing settlement guard source commit")
        try:
            subprocess.run(["git", "-C", str(ROOT), "merge-base", "--is-ancestor", commit, rev],
                           capture_output=True, timeout=15, check=True)
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired):
            fail("staging API does not yet contain terminal-payment guard; deploy it first")
    print("PASS: patched Cloud Run staging revision verified (" + rev[:12] + ")")


def update_sql():
    """Hard-coded scope plus atomic conditional update and audited evidence."""
    ids = ", ".join("'" + x + "'::uuid" for x in ORDERS)
    return f"""
BEGIN TRANSACTION;
SET LOCAL statement_timeout = '20s';
DO $$
DECLARE
  changed integer;
  logged integer;
BEGIN
  WITH locked AS MATERIALIZED (
    SELECT o.id, o.status, pa.status AS payment_status
    FROM commerce.orders o
    JOIN commerce.payment_attempts pa ON pa.order_id=o.id
    WHERE o.id IN ({ids})
      AND o.status='payment_pending'
      AND o.expires_at < now() - interval '24 hours'
      AND o.paid_at IS NULL
      AND pa.provider='cashfree'
      AND pa.provider_order_id=o.id::text
      AND pa.status IN ('failed','cancelled')
      AND pa.provider_payment_id IS NULL AND pa.captured_at IS NULL
      AND o.total_minor=1000 AND pa.amount_minor=1000
      AND o.currency='INR' AND pa.currency='INR'
      AND NOT EXISTS (
        SELECT 1 FROM commerce.entitlements e
        JOIN commerce.order_items oi ON oi.id=e.order_item_id
        WHERE oi.order_id=o.id
      )
      AND NOT EXISTS (
        SELECT 1 FROM commerce.payment_events pe
        WHERE pe.payment_attempt_id=pa.id AND pe.event_type='PAYMENT_SUCCESS_WEBHOOK'
      )
      AND NOT EXISTS (
        SELECT 1 FROM commerce.refunds r WHERE r.payment_attempt_id=pa.id
      )
    FOR UPDATE OF o, pa
  ),
  eligible AS (
    SELECT id FROM locked l WHERE
      (l.id='d279217e-1360-4c85-b439-121e8b54f6cb'::uuid AND l.payment_status='cancelled')
      OR (l.id='f392e2ef-eb30-47f9-8674-77627421a385'::uuid AND l.payment_status='failed')
  ),
  updated AS (
    UPDATE commerce.orders o
    SET status='expired', updated_at=now()
    FROM eligible e WHERE o.id=e.id
    RETURNING o.id
  ),
  audited AS (
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, action_key, entity_type, entity_id,
      summary, metadata
    )
    SELECT gen_random_uuid(), 'system'::audit_actor_type, NULL,
      'commerce.sandbox.expired_order_closed', 'commerce_order', u.id,
      'Expired historical sandbox Cashfree order after provider GET verification',
      jsonb_build_object(
        'provider', 'cashfree', 'environment', 'sandbox',
        'providerProof', 'EXPIRED_OR_TERMINATED_NO_SUCCESS',
        'scope', 'two_fixed_2026_10_09_test_orders'
      )
    FROM updated u
    RETURNING id
  )
  SELECT (SELECT count(*) FROM updated), (SELECT count(*) FROM audited)
  INTO changed, logged;
  IF changed <> 2 OR logged <> 2 THEN
    RAISE EXCEPTION 'Not exactly two eligible orders; all closure changes rolled back';
  END IF;
END $$;
COMMIT;
"""


def main():
    if os.environ.get("EXAMTREE_CASHFREE_EXPIRY_APPROVED") != "yes":
        fail("set EXAMTREE_CASHFREE_EXPIRY_APPROVED=yes")
    require_patched_staging()
    database_url = audit.read_secret("examtree-api-database-url")
    client_id = audit.read_secret("examtree-cashfree-sandbox-client-id")
    client_secret = audit.read_secret("examtree-cashfree-sandbox-client-secret")
    records = audit.inventory(database_url)
    targets = [r for r in records if str(r.get("order")) in ORDERS]
    if len(targets) != 2:
        fail("did not find both fixed target orders")
    for row in targets:
        provider_order_id = str(row["provider_order"])
        # UUID contains no query metacharacters; require exact fixed order.
        if provider_order_id not in ORDERS:
            fail("unrecognized provider order")
        code, provider_order = audit.request_sandbox("/orders/" + provider_order_id,
                                                     client_id, client_secret)
        pcode, payments = audit.request_sandbox("/orders/" + provider_order_id + "/payments",
                                               client_id, client_secret)
        if code != 200 or pcode != 200:
            fail("Cashfree sandbox GET verification unavailable; no state changed")
        provider_safe_to_close(row, provider_order, payments)
        print("PASS: authoritative expired/unpaid sandbox provider evidence (" + ORDERS[provider_order_id] + ")")
    print("Only two fixed October 9 sandbox orders will change from payment_pending to expired.")
    print("Signed payment history, refunds, and entitlements will remain untouched.")
    approval = input("Type CLOSE-TWO-SANDBOX-ORDERS to execute the audited transaction: ").strip()
    if approval != "CLOSE-TWO-SANDBOX-ORDERS":
        fail("confirmation not granted")
    psql = "/usr/lib/postgresql/17/bin/psql"
    if not os.path.isfile(psql):
        fail("postgresql-client-17 is required")
    pg_env = gate.pg_environment(database_url)
    result = subprocess.run([psql, "-X", "-q", "-v", "ON_ERROR_STOP=1",
                             "-c", update_sql()], env=pg_env, capture_output=True,
                            text=True, timeout=45)
    if result.returncode != 0:
        fail("database transaction rolled back or failed (see controlled Cloud SQL logs)")
    remaining = audit.inventory(database_url)
    updated = [r for r in remaining if str(r.get("order")) in ORDERS]
    if len(updated) != 2 or any(r.get("order_status") != "expired" for r in updated):
        fail("database post-check not confirmed")
    print("PASS: two provider-verified unpaid orders closed as expired")
    print("PASS: fixed-order safe expiry gate completed. No captures/refunds/entitlements changed.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("FAIL: " + str(exc), file=sys.stderr)
        sys.exit(1)
