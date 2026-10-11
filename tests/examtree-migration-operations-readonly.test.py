import importlib.util
from pathlib import Path
import unittest

PATH = Path(__file__).resolve().parents[1] / "scripts/inspect-examtree-migration-operations.py"
spec = importlib.util.spec_from_file_location("ops", PATH)
ops = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ops)


class OpsPreflightTests(unittest.TestCase):
    def test_backup_pairs(self):
        p = ops.BACKUP_PREFIX
        self.assertEqual(ops.daily_pairs([
            p+"a.dump.gpg", p+"a.dump.gpg.sha256",
            p+"b.dump.gpg", p+"c.dump.gpg.sha256", "gs://other/x.dump.gpg",
        ]), ["a.dump.gpg"])

    def test_retention_scope(self):
        okay = {"lifecycle": {"rule": [{"action": {"type": "Delete"}, "condition": {
            "age": 30, "matchesPrefix": ["neon-backups/daily/"]}}]}}
        self.assertTrue(ops.has_lifecycle_rule(okay))
        self.assertFalse(ops.has_lifecycle_rule({"lifecycle": {"rule": []}}))
        self.assertFalse(ops.has_lifecycle_rule({"lifecycle": {"rule": [{
            "action": {"type": "Delete"}, "condition": {"age": 30, "matchesPrefix": ["neon-backups/"]}}]}}))

    def test_bucket_security_reads_iam_configuration(self):
        protected = {"iamConfiguration": {
            "uniformBucketLevelAccess": {"enabled": True},
            "publicAccessPrevention": "enforced",
        }}
        self.assertTrue(ops.bucket_access_protected(protected))
        self.assertFalse(ops.bucket_access_protected({
            "iamConfiguration": {"uniformBucketLevelAccess": {"enabled": True}},
        }))
        self.assertFalse(ops.bucket_access_protected({
            "iamConfiguration": {
                "uniformBucketLevelAccess": {"enabled": False},
                "publicAccessPrevention": "enforced",
            },
        }))
        self.assertFalse(ops.bucket_access_protected({
            "iamConfiguration": {
                "uniformBucketLevelAccess": {"enabled": True},
                "publicAccessPrevention": "inherited",
            },
        }))
        self.assertFalse(ops.bucket_access_protected(None))

    def test_daily_backup_schedule(self):
        self.assertTrue(ops.schedule_matches({"state": "ENABLED",
            "schedule": "30 3 * * *", "timeZone": "Asia/Kolkata"}, "30 3 * * *", "Asia/Kolkata"))
        self.assertFalse(ops.schedule_matches({"state": "PAUSED",
            "schedule": "30 3 * * *", "timeZone": "Asia/Kolkata"}, "30 3 * * *", "Asia/Kolkata"))
        self.assertFalse(ops.schedule_matches(None, "30 3 * * *", "Asia/Kolkata"))

    def test_staging_mode_rejects_running_timers(self):
        env = [
            {"name": "EXAMTREE_API_RUNTIME", "value": "cloud-run"},
            {"name": "EXAMTREE_API_STAGING", "value": "true"},
            {"name": "EXAMTREE_PAYMENT_PROVIDER", "value": "cashfree"},
            {"name": "CASHFREE_ENV", "value": "sandbox"},
            {"name": "OUTBOX_PUBLISHER_ENABLED", "value": "false"},
            {"name": "GENERATION_JOB_WORKER_ENABLED", "value": "false"},
        ]
        def service(items):
            return {"spec": {"template": {"spec": {"containers": [{"env": items}]}}}}
        self.assertTrue(ops.staging_safe(service(env)))
        modified = [dict(x) for x in env]
        modified[4]["value"] = "true"
        self.assertFalse(ops.staging_safe(service(modified)))
        self.assertFalse(ops.staging_safe({}))


if __name__ == "__main__":
    unittest.main()
