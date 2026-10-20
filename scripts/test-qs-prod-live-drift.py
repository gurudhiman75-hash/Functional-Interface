#!/usr/bin/env python3
"""Offline tests of read-only production serving drift diagnostic."""
import contextlib
import copy
import importlib.util
import io
import pathlib
import sys
import unittest
from unittest.mock import patch

ROOT = pathlib.Path(__file__).parent
sys.path.insert(0, str(ROOT))
spec = importlib.util.spec_from_file_location("qs_live_drift", ROOT / "diagnose-qs-prod-serving-drift.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

NAME, FLAG, SA = module.SERVICES[1]
LIVE = NAME + "-00010-abc"


def fixture():
    spec = {"serviceAccountName": SA, "containers": [
        {"image": "asia-south1-docker.pkg.dev/sarbedutech/qs/test@sha256:" + "1" * 64,
         "env": [{"name": FLAG, "value": "false"},
                 {"name": "QUESTION_STUDIO_WORKER_TOKEN",
                  "valueFrom": {"secretKeyRef": {"name": "sensitive-hidden-secret",
                                                 "key": "latest"}}},
                 {"name": "EXAMTREE_API_RUNTIME", "value": "cloud-run"}]}
    ]}
    service = {"spec": {"template": {"spec": copy.deepcopy(spec)}},
               "status": {"traffic": [{"revisionName": LIVE, "percent": 100}],
                          "latestReadyRevisionName": LIVE,
                          "latestCreatedRevisionName": NAME + "-00011-retired"}}
    revision = {"metadata": {"name": LIVE}, "spec": copy.deepcopy(spec),
                "status": {"conditions": [{"type": "Ready", "status": "True"}]}}
    return service, revision


class DiagnosticTests(unittest.TestCase):
    def inspect(self, service, revision):
        buff = io.StringIO()
        with contextlib.redirect_stdout(buff):
            result = module.analyse(NAME, FLAG, SA, service, revision)
        return result, buff.getvalue()

    def test_safe_live_revision_with_retired_latest_created(self):
        s, r = fixture()
        ok, output = self.inspect(s, r)
        self.assertTrue(ok)
        self.assertIn("APPROVAL_SERVING: false", output)
        self.assertIn("MATCHED_AND_DISABLED", output)

    def test_live_approval_true_blocks_without_leaking(self):
        s, r = fixture()
        r["spec"]["containers"][0]["env"][0]["value"] = "true"
        ok, output = self.inspect(s, r)
        self.assertFalse(ok)
        self.assertIn("APPROVAL_SERVING: true", output)
        self.assertIn("ENV_DIFF: " + FLAG + " VALUE_MISMATCH", output)
        self.assertNotIn("sensitive-hidden-secret", output)

    def test_secret_reference_mismatch_reports_key_only(self):
        s, r = fixture()
        r["spec"]["containers"][0]["env"][1]["valueFrom"]["secretKeyRef"]["name"] = "do-not-print-secret"
        ok, output = self.inspect(s, r)
        self.assertFalse(ok)
        self.assertIn("ENV_DIFF: QUESTION_STUDIO_WORKER_TOKEN SECRET_REF_MISMATCH", output)
        self.assertNotIn("do-not-print-secret", output)
        self.assertNotIn("sensitive-hidden-secret", output)

    def test_extra_or_missing_environment_blocks(self):
        s, r = fixture()
        r["spec"]["containers"][0]["env"].append(
            {"name": "OTHER_RUNTIME_FLAG", "value": "secret-value-not-to-print"})
        ok, output = self.inspect(s, r)
        self.assertFalse(ok)
        self.assertIn("ENV_DIFF: OTHER_RUNTIME_FLAG present only on serving revision", output)
        self.assertNotIn("secret-value-not-to-print", output)

    def test_paused_baseline_required_before_service_diagnostics(self):
        with patch.object(module, "get", side_effect=[
            {"state": "RUNNING"}, {"state": "PAUSED"}
        ]) as get, contextlib.redirect_stdout(io.StringIO()) as out:
            self.assertEqual(module.main(), 2)
        self.assertEqual(get.call_count, 2)
        self.assertIn("STOP: queue or cleanup Scheduler not PAUSED", out.getvalue())

    def test_no_mutating_operations(self):
        source = (ROOT / "diagnose-qs-prod-serving-drift.py").read_text()
        self.assertNotIn("gcloud auth print-access-token", source)
        self.assertNotIn("gcloud secrets versions access", source)
        self.assertNotIn("run jobs execute", source)
        self.assertNotIn("run services update", source)
        self.assertNotIn("tasks queues resume", source)


if __name__ == "__main__":
    unittest.main()
