#!/usr/bin/env python3
"""Offline tests: no provider calls, no database access, no financial writes."""
import importlib.util
import io
import json
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
PATH = ROOT / "scripts/audit-cashfree-sandbox-readonly.py"
spec = importlib.util.spec_from_file_location("sandbox_readonly_audit", PATH)
aud = importlib.util.module_from_spec(spec)
spec.loader.exec_module(aud)

LOCAL = {
    "order": "d07a8ae6-dd1a-4df7-872c-4637992776fd",
    "order_status": "paid",
    "provider_order": "et_order_128",
    "payment_status": "captured",
    "provider_payment": "1382529476889230123",
    "payment_amount_minor": 10000,
    "signed_payment_ids": ["1382529476889230123"],
    "unresolved_refunds": [],
}
ORDER = {"order_id": "et_order_128", "order_status": "PAID"}
PAYMENTS = [{"cf_payment_id": 1382529476889230123, "payment_status": "SUCCESS"}]


class StubResponse(io.BytesIO):
    status = 200


class ReadOnlyAuditTests(unittest.TestCase):
    def test_consistent_gateway_evidence(self):
        problems, n = aud.evaluate(LOCAL, ORDER, PAYMENTS, {})
        self.assertEqual(problems, [])
        self.assertEqual(n, 1)

    def test_historical_signed_conflicting_payment_evidence_never_silently_accepted(self):
        local = dict(LOCAL, signed_payment_ids=["1382529476889230000"])
        problems, _ = aud.evaluate(local, ORDER, PAYMENTS, {})
        self.assertIn("signed_webhook_id_not_in_provider_successes", problems)
        self.assertIn("signed_webhook_differs_from_stored_payment", problems)

    def test_legacy_rounded_payment_id_not_autorepaired(self):
        local = dict(LOCAL, provider_payment="1382529476889230000")
        problems, _ = aud.evaluate(local, ORDER, PAYMENTS, {})
        self.assertIn("stored_payment_id_not_in_provider_successes", problems)

    def test_gateway_paid_but_local_pending(self):
        local = dict(LOCAL, order_status="payment_pending", payment_status="failed")
        problems, _ = aud.evaluate(local, ORDER, PAYMENTS, {})
        self.assertIn("paid_at_provider_but_local_pending", problems)
        self.assertIn("provider_success_for_local_failed_or_cancelled", problems)

    def test_gateway_order_not_found(self):
        problems, _ = aud.evaluate(LOCAL, None, None, {})
        self.assertIn("provider_order_not_verified", problems)
        self.assertIn("provider_payments_not_verified", problems)

    def test_unresolved_refund_requires_followup_no_post(self):
        refund_id = "47e6b778-a44a-4c74-bdc0-57efbfa71d13"
        local = dict(LOCAL, unresolved_refunds=[{
            "id": refund_id, "status": "created", "amount_minor": 500,
        }])
        problems, _ = aud.evaluate(local, ORDER, PAYMENTS, {refund_id: (404, None)})
        self.assertIn("unresolved_refund_not_found_at_provider", problems)

        refund_ok = {
            "refund_id": "et" + refund_id.replace("-", ""),
            "order_id": "et_order_128", "refund_amount": 5.0,
            "refund_status": "SUCCESS",
        }
        problems, _ = aud.evaluate(local, ORDER, PAYMENTS, {refund_id: (200, refund_ok)})
        self.assertIn("provider_refund_success_needs_local_reconciliation", problems)

    def test_hardcoded_https_sandbox_get_only(self):
        def fake_open(request, timeout, context):
            self.assertTrue(request.full_url.startswith("https://sandbox.cashfree.com/pg/"))
            self.assertEqual(request.get_method(), "GET")
            self.assertEqual(timeout, 20)
            self.assertIsNotNone(context)
            return StubResponse(json.dumps({"order_status": "PAID"}).encode())
        with patch.object(aud, "urlopen", side_effect=fake_open):
            code, response = aud.request_sandbox("/orders/test", "fake-client", "fake-secret")
        self.assertEqual(code, 200)
        self.assertEqual(response["order_status"], "PAID")

    def test_order_tag_no_plaintext_id(self):
        hashed = aud.tag(LOCAL["order"])
        self.assertEqual(len(hashed), 12)
        self.assertNotEqual(hashed, LOCAL["order"])

    def test_source_connection_host_whitelist_is_fixed(self):
        self.assertNotIn("examtree-new.onrender.com", aud.SOURCE_HOSTS)
        self.assertIn("ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech", aud.SOURCE_HOSTS)


if __name__ == "__main__":
    unittest.main()
