import importlib.util
from pathlib import Path
import unittest

PATH = Path(__file__).resolve().parents[1] / "scripts/verify-examtree-cloudrun-num001-review.py"
spec = importlib.util.spec_from_file_location("num001_smoke", PATH)
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


def service():
    def value(name, val):
        return {"name": name, "value": val}
    return {
        "status": {"url": "https://examtree-api-staging-test.a.run.app"},
        "spec": {"template": {"spec": {"containers": [{"env": [
            value("EXAMTREE_API_RUNTIME", "cloud-run"),
            value("EXAMTREE_API_STAGING", "true"),
            value("EXAMTREE_PAYMENT_PROVIDER", "cashfree"),
            value("CASHFREE_ENV", "sandbox"),
            value("GENERATION_JOB_WORKER_ENABLED", "false"),
            value("OUTBOX_PUBLISHER_ENABLED", "false"),
            value("EXAMTREE_API_ORIGIN", "https://examtree-api-staging-test.a.run.app"),
            value("QUESTION_STUDIO_SHARED_WORKER_URL", "https://examtree-generation-staging-test.a.run.app"),
            {"name": "QUESTION_STUDIO_WORKER_TOKEN",
             "valueFrom": {"secretKeyRef": {"name": "examtree-trg002-worker-token"}}},
        ]}]}}}
    }


class Tests(unittest.TestCase):
    def test_exact_safe_staging_configuration(self):
        self.assertEqual(gate.staging_configuration(service()), (True, service()["status"]["url"]))

    def test_staging_rejects_missing_shared_worker(self):
        data = service()
        data["spec"]["template"]["spec"]["containers"][0]["env"][7]["value"] = ""
        self.assertEqual(gate.staging_configuration(data), (False, None))

    def test_staging_rejects_background_publishers(self):
        data = service()
        data["spec"]["template"]["spec"]["containers"][0]["env"][5]["value"] = "true"
        self.assertEqual(gate.staging_configuration(data), (False, None))

    def test_staging_rejects_wrong_webhook_origin(self):
        data = service()
        data["spec"]["template"]["spec"]["containers"][0]["env"][6]["value"] = "https://production.example"
        self.assertEqual(gate.staging_configuration(data), (False, None))

    def test_staging_rejects_nonsecret_token(self):
        data = service()
        data["spec"]["template"]["spec"]["containers"][0]["env"][8] = {
            "name": "QUESTION_STUDIO_WORKER_TOKEN", "value": "plain-text"
        }
        self.assertEqual(gate.staging_configuration(data), (False, None))

    def test_only_one_or_three_review_items_counted(self):
        body = {
            "id": "e1149140-3400-4e5c-a094-15dd0011a011",
            "publicCode": "GEN-20261011-ABCD1234",
            "status": "review", "itemCount": 1,
            "generationSystem": "quant-v4"
        }
        self.assertTrue(gate.valid_result(body, 1))
        self.assertFalse(gate.valid_result(body, 3))
        body["status"] = "published"
        self.assertFalse(gate.valid_result(body, 1))


if __name__ == "__main__":
    unittest.main()
