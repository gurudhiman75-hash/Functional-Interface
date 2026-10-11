import importlib.util
from datetime import datetime, timezone, timedelta
from pathlib import Path
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts/close-examtree-cashfree-staging-expired-orders.py"
spec = importlib.util.spec_from_file_location("cashfree_expire", SCRIPT)
target = importlib.util.module_from_spec(spec)
spec.loader.exec_module(target)


class GateTest(unittest.TestCase):
    def setUp(self):
        self.now = datetime(2026, 10, 11, 12, tzinfo=timezone.utc)
        self.row = {
            "order": "f392e2ef-eb30-47f9-8674-77627421a385",
            "provider_order": "f392e2ef-eb30-47f9-8674-77627421a385",
            "order_status": "payment_pending", "payment_status": "failed",
            "provider_payment": None, "signed_payment_ids": [],
            "payment_amount_minor": "1000",
            "expires_at": (self.now - timedelta(days=2)).isoformat(),
        }
        self.gateway = {
            "order_id": self.row["order"], "order_status": "EXPIRED",
            "order_amount": 10, "order_currency": "INR",
        }
        self.payments = [{"payment_status": "FAILED"}]

    def test_only_expired_provider_unpaid(self):
        self.assertTrue(target.provider_safe_to_close(
            self.row, self.gateway, self.payments, now=self.now))

    def test_not_provider_active(self):
        self.gateway["order_status"] = "ACTIVE"
        with self.assertRaises(RuntimeError):
            target.provider_safe_to_close(self.row, self.gateway, self.payments, now=self.now)

    def test_not_provider_success(self):
        self.payments.append({"payment_status": "SUCCESS"})
        with self.assertRaises(RuntimeError):
            target.provider_safe_to_close(self.row, self.gateway, self.payments, now=self.now)

    def test_not_provider_pending(self):
        self.payments.append({"payment_status": "PENDING"})
        with self.assertRaises(RuntimeError):
            target.provider_safe_to_close(self.row, self.gateway, self.payments, now=self.now)

    def test_not_local_signed_success(self):
        self.row["signed_payment_ids"] = ["gateway-id"]
        with self.assertRaises(RuntimeError):
            target.provider_safe_to_close(self.row, self.gateway, self.payments, now=self.now)

    def test_not_too_recent(self):
        self.row["expires_at"] = (self.now - timedelta(hours=23)).isoformat()
        with self.assertRaises(RuntimeError):
            target.provider_safe_to_close(self.row, self.gateway, self.payments, now=self.now)

    def test_not_different_payment_id(self):
        self.row["provider_payment"] = "captured"
        with self.assertRaises(RuntimeError):
            target.provider_safe_to_close(self.row, self.gateway, self.payments, now=self.now)

    def test_only_two_hardcoded_orders(self):
        self.assertEqual(set(target.ORDERS), {
            "d279217e-1360-4c85-b439-121e8b54f6cb",
            "f392e2ef-eb30-47f9-8674-77627421a385",
        })

    def test_atomic_sql_requires_no_entitlements_no_success(self):
        sql = target.update_sql()
        self.assertIn("BEGIN TRANSACTION", sql)
        self.assertIn("IF changed <> 2 OR logged <> 2", sql)
        self.assertIn("NOT EXISTS (", sql)
        self.assertIn("commerce.entitlements", sql)
        self.assertIn("commerce.payment_events", sql)
        self.assertIn("platform.audit_events", sql)
        self.assertIn("o.paid_at IS NULL", sql)


if __name__ == "__main__":
    unittest.main()
