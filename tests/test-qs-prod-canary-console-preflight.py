#!/usr/bin/env python3
"""Offline checks: production preflight must never write or activate anything."""
import importlib.util
import pathlib
import sys
import unittest
from unittest.mock import patch

ROOT = pathlib.Path(__file__).resolve().parents[1]
PATH = ROOT / "scripts/qs-prod-canary-console-preflight.py"
spec = importlib.util.spec_from_file_location("canary_preflight", PATH)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

class CanaryPreflightTests(unittest.TestCase):
    def test_wrong_run_id_stops_without_gcp(self):
        with patch.object(sys, "argv", ["preflight", "--run-id",
                                       "48aaff58-d0cb-4345-be5f-491089b72f10"]), \
             patch.object(m, "fetch") as fetch:
            with self.assertRaises(m.Stop):
                m.main()
            fetch.assert_not_called()

    def test_one_readonly_invocation_implementation(self):
        source = PATH.read_text()
        for forbidden in (
            "update-traffic", '"execute"', '"resume"', '"pause"',
            "tasks_api(", "print-access-token", '"secrets", "versions", "access"',
            "run_sql(", "psql", "UPDATE content.", "INSERT INTO",
        ):
            self.assertNotIn(forbidden, source, forbidden)
        self.assertIn('q.get("state") == "PAUSED"', source)
        self.assertIn('s.get("state") == "PAUSED"', source)
        self.assertIn('RUN_ID = "c71b5ccb-8aa6-44e0-b0a5-01a3607a9c98"', source)
        self.assertIn('READY_FOR_MANUAL_RELEASE_REVIEW; READ_ONLY; NO GENERATION', source)

    def test_missing_iam_fails_closed(self):
        with patch.object(sys, "argv", ["preflight", "--run-id", m.RUN_ID]), \
             patch.object(m, "fetch", side_effect=m.Stop("GCP metadata access unavailable")):
            with self.assertRaises(m.Stop):
                m.main()

if __name__ == "__main__":
    unittest.main()
