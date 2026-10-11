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

    def test_gcloud_normalized_bucket_security(self):
        normalized = {
            "uniform_bucket_level_access": True,
            "public_access_prevention": "enforced",
        }
        self.assertTrue(ops.bucket_access_protected(normalized))
        self.assertFalse(ops.bucket_access_protected({
            **normalized, "public_access_prevention": "inherited",
        }))
        self.assertFalse(ops.bucket_access_protected({
            **normalized, "uniform_bucket_level_access": False,
        }))
        nested_normalized = {"iam_configuration": {
            "uniform_bucket_level_access": {"enabled": True},
            "public_access_prevention": "enforced",
        }}
        self.assertTrue(ops.bucket_access_protected(nested_normalized))

    def test_gcloud_normalized_lifecycle(self):
        policy = {"lifecycle_config": {"rule": [{
            "action": {"type": "Delete"},
            "condition": {"age": 30, "matchesPrefix": ["neon-backups/daily/"]},
        }]}}
        self.assertTrue(ops.has_lifecycle_rule(policy))
        self.assertFalse(ops.has_lifecycle_rule({"lifecycle_config": {"rule": [{
            "action": {"type": "Delete"}, "condition": {"age": 7,
                "matchesPrefix": ["neon-backups/daily/"]},
        }]}}))
        self.assertFalse(ops.has_lifecycle_rule({"lifecycle_config": {"rule": [{
            "action": {"type": "Delete"}, "condition": {"age": 30,
                "matchesPrefix": ["neon-backups/"]},
        }]}}))

    def test_retention_guard_checks_both_metadata_formats(self):
        shell = (Path(__file__).resolve().parents[1] /
                 "ops/neon-daily-backup/retention-30-days.sh").read_text()
        self.assertIn("('lifecycle', 'lifecycle_config')", shell)
        self.assertIn("Existing lifecycle policy found", shell)
        self.assertIn("matchesPrefix", shell)

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
            {"name": "DATABASE_URL", "valueFrom": {"secretKeyRef": {"name": "examtree-api-staging-database-url"}}},
        ]
        def service(items):
            return {"spec": {"template": {"spec": {"containers": [{"env": items}]}}}}
        self.assertTrue(ops.staging_safe(service(env)))
        modified = [dict(x) for x in env]
        modified[4]["value"] = "true"
        self.assertFalse(ops.staging_safe(service(modified)))
        self.assertFalse(ops.staging_safe({}))
        main_secret = [dict(x) for x in env]
        main_secret[-1] = {"name": "DATABASE_URL", "valueFrom":
                           {"secretKeyRef": {"name": "examtree-api-database-url"}}}
        self.assertFalse(ops.staging_safe(service(main_secret)))


if __name__ == "__main__":
    unittest.main()
