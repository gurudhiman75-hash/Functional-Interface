#!/usr/bin/env python3
"""Read-only Examtree Cashfree SANDBOX evidence audit.

Google Cloud Shell only; reads existing Neon main and sandbox credentials from
Secret Manager, issues HTTPS GET requests only to Cashfree SANDBOX.
Never issues refunds, captures payments, closes orders, edits DB or prints IDs.
"""
import hashlib
import json
import os
import re
import ssl
import subprocess
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import quote, unquote, urlsplit
from urllib.request import Request, urlopen

PROJECT = "sarbedutech"
API = "https://sandbox.cashfree.com/pg"
VERSION = "2025-01-01"
SOURCE_HOSTS = frozenset({
    "ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech",
    "ep-polished-king-atj47i5y-pooler.c-9.us-east-1.aws.neon.tech",
})
CA_FILE = "/etc/ssl/certs/ca-certificates.crt"
# Postgres query is hard-coded, read-only and uses no externally provided SQL.
INVENTORY_SQL = r"""
SELECT json_build_object(
  'order', o.id::text,
  'order_status', o.status,
  'expires_at', o.expires_at,
  'provider_order', pa.provider_order_id,
  'provider_payment', pa.provider_payment_id,
  'payment_status', pa.status,
  'payment_amount_minor', pa.amount_minor,
  'currency', pa.currency,
  'signed_payment_ids', (
    SELECT COALESCE(json_agg(DISTINCT pe.payload#>>'{data,payment,cf_payment_id}'), '[]'::json)
    FROM commerce.payment_events pe
    WHERE pe.payment_attempt_id = pa.id
      AND pe.provider = 'cashfree'
      AND pe.event_type = 'PAYMENT_SUCCESS_WEBHOOK'
      AND pe.signature_verified = true
      AND pe.processed_at IS NOT NULL
  ),
  'unresolved_refunds', (
    SELECT COALESCE(json_agg(json_build_object(
      'id', r.id::text, 'status', r.status, 'amount_minor', r.amount_minor,
      'provider_refund_id', r.provider_refund_id
    )), '[]'::json)
    FROM commerce.refunds r
    WHERE r.payment_attempt_id = pa.id
      AND r.status NOT IN ('processed', 'failed', 'cancelled')
  )
)::text
FROM commerce.orders o
JOIN commerce.payment_attempts pa ON pa.order_id = o.id
WHERE pa.provider = 'cashfree'
ORDER BY pa.created_at ASC
LIMIT 100;
"""


def read_secret(name):
    try:
        value = subprocess.check_output([
            "gcloud", "secrets", "versions", "access", "latest",
            "--project=" + PROJECT, "--secret=" + name,
        ], stderr=subprocess.DEVNULL, timeout=25)
    except (FileNotFoundError, subprocess.CalledProcessError, subprocess.TimeoutExpired):
        raise RuntimeError("Required sandbox audit secret unavailable: " + name) from None
    if not value:
        raise RuntimeError("Required sandbox audit secret is empty: " + name)
    return value.decode("utf-8").strip()


def inventory(database_url):
    u = urlsplit(database_url)
    if u.scheme not in ("postgres", "postgresql") or u.hostname not in SOURCE_HOSTS or u.path != "/neondb":
        raise RuntimeError("Refusing noncanonical Neon main database")
    if not u.username or not u.password or u.port not in (None, 5432):
        raise RuntimeError("Invalid production Neon URL")
    psql = "/usr/lib/postgresql/17/bin/psql"
    if not os.path.isfile(psql):
        raise RuntimeError("Install postgresql-client-17 in Cloud Shell")
    env = os.environ.copy()
    env.update({
        "PGHOST": u.hostname, "PGPORT": "5432", "PGUSER": unquote(u.username),
        "PGPASSWORD": unquote(u.password), "PGDATABASE": "neondb",
        "PGSSLMODE": "verify-full", "PGSSLROOTCERT": CA_FILE,
        "PGCONNECT_TIMEOUT": "15", "PGAPPNAME": "examtree-cashfree-sandbox-readonly-audit",
        "PGOPTIONS": "-c default_transaction_read_only=on -c statement_timeout=20000",
    })
    command = [psql, "-X", "-A", "-t", "-q", "-v", "ON_ERROR_STOP=1", "-c", INVENTORY_SQL]
    try:
        result = subprocess.run(command, env=env, stdout=subprocess.PIPE,
                                stderr=subprocess.DEVNULL, timeout=40, check=True, text=True)
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired):
        raise RuntimeError("Read-only Neon inventory query failed") from None
    try:
        return [json.loads(line) for line in result.stdout.splitlines() if line.strip()]
    except json.JSONDecodeError:
        raise RuntimeError("Neon inventory did not return valid JSON") from None


def request_sandbox(path, client_id, client_secret):
    # Hard-coded sandbox HTTPS host, GET-only, with CA verification.
    url = API + path
    req = Request(url, method="GET", headers={
        "x-client-id": client_id, "x-client-secret": client_secret,
        "x-api-version": VERSION, "Accept": "application/json",
    })
    try:
        with urlopen(req, timeout=20, context=ssl.create_default_context()) as response:
            return response.status, json.load(response)
    except HTTPError as e:
        # No provider response body: it could include customer/provider details.
        return e.code, None
    except (URLError, TimeoutError, json.JSONDecodeError):
        return 0, None


def tag(value):
    return hashlib.sha256(str(value).encode("utf-8")).hexdigest()[:12]


def evaluate(local, gateway_order, payments, refund_results):
    """Pure, conservative classifier. Never changes provider or local state."""
    alerts = []
    order_state = str(local.get("order_status", ""))
    status = str(local.get("payment_status", ""))
    if gateway_order is None:
        alerts.append("provider_order_not_verified")
    else:
        if str(gateway_order.get("order_id", "")) != str(local.get("provider_order", "")):
            alerts.append("provider_order_id_conflict")
        provider_order_status = str(gateway_order.get("order_status", ""))
        if order_state in ("paid", "partially_refunded", "refunded") and provider_order_status != "PAID":
            alerts.append("paid_order_provider_status_not_PAID")
        if order_state == "payment_pending" and provider_order_status == "PAID":
            alerts.append("paid_at_provider_but_local_pending")

    success_ids = set()
    if not isinstance(payments, list):
        alerts.append("provider_payments_not_verified")
    else:
        success_ids = {
            str(x.get("cf_payment_id"))
            for x in payments
            if isinstance(x, dict) and x.get("payment_status") == "SUCCESS"
            and x.get("cf_payment_id") is not None
        }
        stored = str(local.get("provider_payment") or "")
        if status in ("captured", "refunded", "partially_refunded") and stored not in success_ids:
            alerts.append("stored_payment_id_not_in_provider_successes")
        if status in ("failed", "cancelled") and success_ids:
            alerts.append("provider_success_for_local_failed_or_cancelled")

        # Record historical signed webhook IDs as evidence requiring
        # independent provider resolution, never trust them automatically.
        signed = {
            str(x) for x in local.get("signed_payment_ids", [])
            if x is not None and str(x)
        }
        if signed and any(ref not in success_ids for ref in signed):
            alerts.append("signed_webhook_id_not_in_provider_successes")
        if stored and signed and any(ref != stored for ref in signed):
            alerts.append("signed_webhook_differs_from_stored_payment")

    for refund in local.get("unresolved_refunds", []):
        status_code, response = refund_results.get(str(refund.get("id")), (0, None))
        if status_code == 404:
            alerts.append("unresolved_refund_not_found_at_provider")
        elif status_code != 200 or not isinstance(response, dict):
            alerts.append("unresolved_refund_cannot_be_verified")
        else:
            expected_ref = "et" + str(refund.get("id", "")).replace("-", "").lower()
            if str(response.get("refund_id", "")) != expected_ref:
                alerts.append("refund_reference_conflict")
            if str(response.get("order_id", "")) != str(local.get("provider_order", "")):
                alerts.append("refund_order_conflict")
            raw_amount = response.get("refund_amount")
            try:
                refund_minor = round(float(raw_amount) * 100)
            except (TypeError, ValueError):
                refund_minor = -1
            if refund_minor != int(refund.get("amount_minor", -999)):
                alerts.append("refund_amount_conflict")
            if response.get("refund_status") != "SUCCESS":
                alerts.append("unresolved_refund_provider_state_" + str(response.get("refund_status", "unknown"))[:32])
            else:
                alerts.append("provider_refund_success_needs_local_reconciliation")

    # Order expiration alone is not permission to cancel. Payment retries
    # and delayed provider confirmation must be considered first.
    if order_state == "payment_pending":
        alerts.append("pending_order_requires_expiration_review")

    return sorted(set(alerts)), len(success_ids)


def main():
    if len(sys.argv) != 1:
        raise RuntimeError("Usage: python3 scripts/audit-cashfree-sandbox-readonly.py")
    client_id = read_secret("examtree-cashfree-sandbox-client-id")
    client_secret = read_secret("examtree-cashfree-sandbox-client-secret")
    database_url = read_secret("examtree-api-database-url")
    records = inventory(database_url)
    if not records:
        raise RuntimeError("No Cashfree payment attempts found; cannot verify expected sandbox history")
    print("EXAMTREE CASHFREE SANDBOX AUDIT — READ ONLY (GET); no raw financial IDs or customer data.")
    count_alert = 0
    for row in records:
        order = str(row.get("provider_order") or "")
        label = tag(row.get("order", ""))
        if not order or not re.fullmatch(r"[a-zA-Z0-9_-]{1,100}", order):
            print("ORDER " + label + ": provider_order_reference_missing_or_invalid")
            count_alert += 1
            continue
        quoted = quote(order, safe="")
        order_code, provider_order = request_sandbox("/orders/" + quoted, client_id, client_secret)
        pay_code, payments = request_sandbox("/orders/" + quoted + "/payments", client_id, client_secret)
        refund_results = {}
        for r in row.get("unresolved_refunds", []):
            refund_id = str(r.get("id", ""))
            if not re.fullmatch(r"[0-9a-f-]{36}", refund_id):
                refund_results[refund_id] = (0, None)
                continue
            ref = "et" + refund_id.replace("-", "").lower()
            refund_results[refund_id] = request_sandbox(
                "/orders/" + quoted + "/refunds/" + quote(ref, safe=""),
                client_id, client_secret
            )
        alerts, success_count = evaluate(
            row,
            provider_order if order_code == 200 else None,
            payments if pay_code == 200 else None,
            refund_results,
        )
        if order_code != 200:
            alerts.append("provider_order_GET_HTTP_" + str(order_code))
        if pay_code != 200:
            alerts.append("provider_payments_GET_HTTP_" + str(pay_code))
        if alerts:
            count_alert += 1
        print("ORDER " + label + ": local_order=" + str(row.get("order_status")) +
              " local_payment=" + str(row.get("payment_status")) +
              " provider_success_count=" + str(success_count) +
              " findings=" + ",".join(sorted(set(alerts)) or ["none"]))
    print("SUMMARY: checked=" + str(len(records)) +
          ", orders_needing_manual_review=" + str(count_alert) +
          ", credentials=SANDBOX, provider_methods=GET_ONLY")
    if len(records) == 100:
        print("WARNING: inventory truncated at 100 payment attempts.")
        sys.exit(2)
    if count_alert:
        sys.exit(2)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        # Errors deliberately omit raw secret/URL/response text.
        print("SANDBOX_AUDIT_STOPPED: " + str(exc), file=sys.stderr)
        sys.exit(1)
