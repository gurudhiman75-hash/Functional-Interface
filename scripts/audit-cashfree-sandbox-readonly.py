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
from decimal import Decimal, InvalidOperation
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
    })
    # Cloud Shell may inherit libpq startup settings which Neon pooling can
    # reject. Enforce READ ONLY within the server-side transaction instead;
    # NEVER allow SQL writes or run provider POST requests from this audit.
    env.pop("PGOPTIONS", None)
    env.pop("PGSERVICE", None)
    transaction_sql = (
        "BEGIN TRANSACTION READ ONLY;\n"
        "SET LOCAL statement_timeout = '20s';\n"
        + INVENTORY_SQL + "\nCOMMIT;"
    )
    command = [
        psql, "-X", "-A", "-t", "-q",
        "-v", "ON_ERROR_STOP=1",
        "-v", "VERBOSITY=sqlstate",
        "-c", transaction_sql,
    ]
    try:
        result = subprocess.run(command, env=env, stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE, timeout=40, check=True, text=True)
    except subprocess.TimeoutExpired:
        raise RuntimeError("Read-only Neon inventory timed out") from None
    except subprocess.CalledProcessError as exc:
        # Never echo raw Postgres errors: they may contain host, username,
        # database connection details, or snippets from returned data.
        message = (exc.stderr or "").lower()
        if "password authentication failed" in message:
            category = "authentication"
        elif "certificate verify failed" in message or "ssl" in message and "error" in message:
            category = "TLS verification"
        elif "could not translate host name" in message or "connection to server" in message:
            category = "network/connection"
        elif "permission denied" in message:
            category = "database permissions"
        else:
            sqlstate = re.search(r"(?m)(?:ERROR|FATAL):\\s*([0-9A-Z]{5})\\b", exc.stderr or "")
            category = "PostgreSQL SQLSTATE " + sqlstate.group(1) if sqlstate else "query/startup"
        raise RuntimeError("Read-only Neon inventory failed (" + category + ")") from None
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


def money_minor(value):
    """Validate provider decimal rupees without floating-point rounding."""
    try:
        amount = Decimal(str(value))
        minor = amount * 100
        if not minor.is_finite() or minor != minor.to_integral_value():
            return None
        result = int(minor)
        return result if result >= 0 else None
    except (ValueError, TypeError, InvalidOperation):
        return None


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
        expected_minor = int(local.get("payment_amount_minor", -1))
        if money_minor(gateway_order.get("order_amount")) != expected_minor:
            alerts.append("provider_order_amount_missing_or_mismatch")
        if str(gateway_order.get("order_currency", "")).upper() != str(local.get("currency", "")).upper():
            alerts.append("provider_order_currency_missing_or_mismatch")
        if order_state in ("paid", "partially_refunded", "refunded") and provider_order_status != "PAID":
            alerts.append("paid_order_provider_status_not_PAID")
        if order_state == "payment_pending" and provider_order_status == "PAID":
            alerts.append("paid_at_provider_but_local_pending")

    success_ids = set()
    if not isinstance(payments, list):
        alerts.append("provider_payments_not_verified")
    else:
        successes = [
            x for x in payments
            if isinstance(x, dict) and x.get("payment_status") == "SUCCESS"
            and x.get("cf_payment_id") is not None
        ]
        success_ids = {str(x["cf_payment_id"]) for x in successes}
        for x in successes:
            if money_minor(x.get("payment_amount")) != int(local.get("payment_amount_minor", -1)):
                alerts.append("provider_success_amount_missing_or_mismatch")
            if str(x.get("payment_currency", "")).upper() != str(local.get("currency", "")).upper():
                alerts.append("provider_success_currency_missing_or_mismatch")
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
            refund_minor = money_minor(response.get("refund_amount"))
            if refund_minor != int(refund.get("amount_minor", -999)):
                alerts.append("refund_amount_conflict")
            if response.get("cf_payment_id") is not None and str(response["cf_payment_id"]) != str(local.get("provider_payment")):
                alerts.append("refund_payment_reference_conflict")
            if response.get("refund_currency") is not None and str(response["refund_currency"]).upper() != str(local.get("currency", "")).upper():
                alerts.append("refund_currency_conflict")
            if response.get("refund_status") != "SUCCESS":
                alerts.append("unresolved_refund_provider_state_" + str(response.get("refund_status", "unknown"))[:32])
            else:
                alerts.append("provider_refund_success_needs_local_reconciliation")

    # Order expiration alone is not permission to cancel. Payment retries
    # and delayed provider confirmation must be considered first.
    if order_state == "payment_pending":
        alerts.append("pending_order_requires_expiration_review")

    return sorted(set(alerts)), len(success_ids)


def refund_readiness(local, payments, refund_results):
    """Assess proof links without ever authorizing a financial mutation.

    Provider success + signed and processed webhook evidence may still be
    insufficient for repair: the production API independently checks that
    the old 19-digit value matches precisely the legacy Number() rounding.
    """
    reports = []
    successes = [
        p for p in payments if isinstance(p, dict)
        and p.get("payment_status") == "SUCCESS" and p.get("cf_payment_id") is not None
    ] if isinstance(payments, list) else []
    verified_success_ids = {
        str(p["cf_payment_id"]) for p in successes
        if money_minor(p.get("payment_amount")) == int(local.get("payment_amount_minor") or -1)
        and str(p.get("payment_currency") or "").upper() == str(local.get("currency") or "").upper()
    }
    signed_ids = {str(x) for x in local.get("signed_payment_ids") or [] if x is not None}
    for refund in local.get("unresolved_refunds") or []:
        code, receipt = refund_results.get(str(refund.get("id")), (0, None))
        if code != 200 or not isinstance(receipt, dict):
            reports.append({
                "ref": "provider_unverified", "gateway_payment": "unverified",
                "signed_payment": "unverified", "required_fields": "unverified",
            })
            continue
        raw_id = receipt.get("cf_payment_id")
        exact = str(raw_id) if raw_id is not None else ""
        required = (
            "refund_id", "order_id", "cf_payment_id", "cf_refund_id",
            "refund_amount", "refund_currency", "refund_status",
        )
        missing = sorted(field for field in required if receipt.get(field) in (None, ""))
        reference_ok = (
            receipt.get("refund_id") == "et" + str(refund.get("id") or "").replace("-", "").lower()
            and receipt.get("order_id") == local.get("provider_order")
            and money_minor(receipt.get("refund_amount")) == int(refund.get("amount_minor") or -1)
            and str(receipt.get("refund_currency") or "").upper() == str(local.get("currency") or "").upper()
            and str(receipt.get("refund_status") or "").upper() == "SUCCESS"
        )
        reports.append({
            "ref": "consistent" if reference_ok else "not_verified",
            "gateway_payment": "yes" if exact in verified_success_ids else "no",
            "signed_payment": "yes" if exact in signed_ids else "no",
            "required_fields": "complete" if not missing else "missing:" + ",".join(missing),
        })
    return reports


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
        for diagnostic in refund_readiness(row, payments if pay_code == 200 else None, refund_results):
            print("REFUND_REVIEW " + label
                  + ": provider_refund=" + diagnostic["ref"]
                  + " exact_gateway_success=" + diagnostic["gateway_payment"]
                  + " signed_success_event=" + diagnostic["signed_payment"]
                  + " required_evidence=" + diagnostic["required_fields"]
                  + " action=manual_review_only")
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
