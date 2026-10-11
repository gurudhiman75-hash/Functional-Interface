import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "scripts/inspect-examtree-cloudrun-production-handover.py"
spec = importlib.util.spec_from_file_location("handover", PATH)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def entry(name, value):
    return {"name": name, "value": value}


def secret(name, reference):
    return {"name": name, "valueFrom": {"secretKeyRef": {"name": reference}}}


def service(staging=False):
    env = [
        entry("EXAMTREE_API_RUNTIME", "cloud-run"),
        entry("EXAMTREE_API_STAGING", "true" if staging else "false"),
        entry("GENERATION_JOB_WORKER_ENABLED", "false"),
        entry("OUTBOX_PUBLISHER_ENABLED", "false"),
        entry("FIREBASE_PROJECT_ID", "sarbedutech"),
        secret("DATABASE_URL", m.STAGING_SECRET if staging else m.MAIN_SECRET),
    ]
    return {"spec": {"template": {"spec": {"containers": [{"env": env}]}}}}


def job(staging=False):
    env = [entry("EXAMTREE_API_RUNTIME", "cloud-run"),
           entry("EXAMTREE_API_STAGING", "true" if staging else "false"),
           secret("DATABASE_URL", m.STAGING_SECRET if staging else m.MAIN_SECRET)]
    return {"spec": {"template": {"spec": {"template": {"spec": {
        "containers": [{"env": env}]}}}}}}}


class ProductionHandoverTests(unittest.TestCase):
    def test_stage_and_prod_have_opposite_secret_guards(self):
        self.assertTrue(m.check_service(service(True), staging=True))
        self.assertTrue(m.check_service(service(False), staging=False))
        self.assertFalse(m.check_service(service(True), staging=False))
        self.assertFalse(m.check_service(service(False), staging=True))

    def test_reject_enabled_api_workers(self):
        s = service(False)
        s["spec"]["template"]["spec"]["containers"][0]["env"][3]["value"] = "true"
        self.assertFalse(m.check_service(s, staging=False))

    def test_never_schedule_staging_job(self):
        self.assertTrue(m.check_job(job(False)))
        self.assertFalse(m.check_job(job(True)))
        self.assertFalse(m.check_job({}))

    def test_scheduler_gates_render_and_production_job(self):
        source = (ROOT / "scripts/enable-examtree-api-background-scheduler.sh").read_text()
        self.assertIn("EXAMTREE_RENDER_STOPPED", source)
        self.assertIn("EXAMTREE_BACKGROUND_JOB_VERIFIED", source)
        self.assertIn("examtree-api-database-url", source)
        self.assertIn("EXAMTREE_API_STAGING", source)
        self.assertIn("jobs describe", source)
        self.assertIn("set -euo pipefail", source)

    def test_no_mutating_probes(self):
        source = PATH.read_text()
        self.assertNotIn("run jobs execute", source)
        self.assertNotIn("run deploy", source)
        self.assertNotIn("secrets versions access", source)
        self.assertNotIn("update_environment_variables", source)


if __name__ == "__main__":
    unittest.main()
