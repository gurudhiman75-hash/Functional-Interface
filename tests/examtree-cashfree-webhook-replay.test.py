#!/usr/bin/env python3
"""Pure/credential-free safety regressions for the fixed-order staging replay."""
import copy
import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
TARGET = ROOT / "scripts/verify-examtree-cashfree-cloudrun-webhook-replay.py"
spec = importlib.util.spec_from_file_location("replay", TARGET)
replay = importlib.util.module_from_spec(spec)
spec.loader.exec_module(replay)


def evidence():
    pid = "1462287015601527808"
    return {
        "order_status": "paid", "payment_status": "captured",
        "amount_minor": "1000", "currency": "INR",
        "provider_order_id": replay.ORDER, "provider_payment_id": pid,
        "provider_event_id": "PAYMENT_SUCCESS_WEBHOOK:" + pid,
        "event_type": "PAYMENT_SUCCESS_WEBHOOK", "signature_verified": True,
        "processed": True, "processing_error": None, "item_count": 1,
        "entitlement_count": 1, "event_count": 1,
        "payload": {
            "type": "PAYMENT_SUCCESS_WEBHOOK",
            "data": {
                "order": {"order_id": replay.ORDER},
                "payment": {
                    "cf_payment_id": pid, "payment_status": "SUCCESS",
                    "payment_currency": "INR", "payment_amount": 10,
                },
            },
        },
    }


class ReplayGuardTests(unittest.TestCase):
    def test_verified_exactly_one_capture_and_entitlement(self):
        source = evidence()
        self.assertEqual(replay.check_evidence(source), source["payload"])

    def rejects(self, field, value):
        source = evidence()
        source[field] = value
        with self.assertRaises(SystemExit):
            replay.check_evidence(source)

    def test_no_pending_payment(self):
        self.rejects("payment_status", "created")

    def test_no_duplicate_entitlements_already(self):
        self.rejects("entitlement_count", 2)

    def test_no_prior_duplicate_events(self):
        self.rejects("event_count", 2)

    def test_no_unverified_event(self):
        self.rejects("signature_verified", False)

    def test_no_unprocessed_event(self):
        self.rejects("processed", False)

    def test_no_mismatched_provider_payment(self):
        self.rejects("provider_payment_id", "other")

    def test_no_mismatched_order(self):
        source = evidence()
        source["payload"]["data"]["order"]["order_id"] = "another"
        with self.assertRaises(SystemExit):
            replay.check_evidence(source)

    def test_no_amount_or_currency_mismatch(self):
        for kind in ("payment_amount", "payment_currency"):
            with self.subTest(kind=kind):
                source = evidence()
                source["payload"]["data"]["payment"][kind] = "11" if kind == "payment_amount" else "USD"
                with self.assertRaises(SystemExit):
                    replay.check_evidence(source)

    def test_no_unexpected_signed_event_key(self):
        self.rejects("provider_event_id", "PAYMENT_SUCCESS_WEBHOOK:unmatched")

    def test_non_success_event_not_replayed(self):
        source = evidence()
        source["payload"]["data"]["payment"]["payment_status"] = "FAILED"
        with self.assertRaises(SystemExit):
            replay.check_evidence(source)

    def test_noncanonical_db_host_rejected(self):
        with self.assertRaises(SystemExit):
            replay.pg_environment("postgresql://someone:password@localhost/neondb")


if __name__ == "__main__":
    unittest.main()
