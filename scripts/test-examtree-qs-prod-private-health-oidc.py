#!/usr/bin/env python3
"""Offline, no-network tests of Examtree production private health probe."""
import importlib.util
import json
import pathlib
import types
import unittest
from unittest.mock import patch

SCRIPT = pathlib.Path(__file__).with_name("verify-examtree-qs-prod-private-health-oidc.py")
spec = importlib.util.spec_from_file_location("qs_private_health", SCRIPT)
assert spec and spec.loader
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ProbeTests(unittest.TestCase):
    def test_expected_receiver_origin(self):
        self.assertEqual(module.validate_origin(
            "https://examtree-qs-receiver-prod-abcdef-uc.a.run.app",
            "examtree-qs-receiver-prod"),
            "https://examtree-qs-receiver-prod-abcdef-uc.a.run.app")

    def test_wrong_service_rejected(self):
        self.assertIsNone(module.validate_origin(
            "https://examtree-qs-receiver-staging-abcdef-uc.a.run.app",
            "examtree-qs-receiver-prod"))

    def test_redirect_destination_query_rejected(self):
        self.assertIsNone(module.validate_origin(
            "https://examtree-universal-prod-abcdef-uc.a.run.app/?debug=1",
            "examtree-universal-prod"))

    def test_http_rejected(self):
        self.assertIsNone(module.validate_origin(
            "http://examtree-universal-prod-abcdef-uc.a.run.app",
            "examtree-universal-prod"))

    def test_incorrect_token_rejected(self):
        result = types.SimpleNamespace(returncode=0, stdout="not-a-token")
        with patch.object(module, "cli", return_value=result):
            self.assertIsNone(module.mint_id_token("sa", "https://example.run.app"))

    def test_impersonation_failure_is_review(self):
        module.counts.update(PASS=0, REVIEW=0, BLOCK=0)
        with patch.object(module, "service_origin", return_value="https://examtree-universal-prod-abc.a.run.app"), \
             patch.object(module, "mint_id_token", return_value=None), \
             patch.object(module, "health_get") as req:
            module.check_service("examtree-universal-prod", "receiver-sa",
                                 "qs-universal-prod", True)
            self.assertEqual(module.counts["REVIEW"], 1)
            req.assert_not_called()

    def test_health_contract_mismatch_blocks(self):
        module.counts.update(PASS=0, REVIEW=0, BLOCK=0)
        with patch.object(module, "service_origin", return_value="https://examtree-universal-prod-abc.a.run.app"), \
             patch.object(module, "mint_id_token", return_value="a" * 80), \
             patch.object(module, "health_get", return_value=(200, {
                 "status": "ok", "service": "qs-universal-prod", "ready": True
             })):
            module.check_service("examtree-universal-prod", "receiver-sa",
                                 "qs-universal-prod", True)
            self.assertEqual(module.counts["BLOCK"], 1)

    def test_health_success_requires_not_ready(self):
        module.counts.update(PASS=0, REVIEW=0, BLOCK=0)
        with patch.object(module, "service_origin", return_value="https://examtree-universal-prod-abc.a.run.app"), \
             patch.object(module, "mint_id_token", return_value="a" * 80), \
             patch.object(module, "health_get", return_value=(200, {
                 "status": "ok", "service": "qs-universal-prod", "ready": False
             })):
            module.check_service("examtree-universal-prod", "receiver-sa",
                                 "qs-universal-prod", True)
            self.assertEqual(module.counts["PASS"], 2)
            self.assertEqual(module.counts["BLOCK"], 0)

    def test_check_only_never_mints_token(self):
        module.counts.update(PASS=0, REVIEW=0, BLOCK=0)
        with patch.object(module, "service_origin", return_value="https://examtree-universal-prod-abc.a.run.app"), \
             patch.object(module, "mint_id_token") as mint:
            module.check_service("examtree-universal-prod", "receiver-sa",
                                 "qs-universal-prod", False)
            mint.assert_not_called()


if __name__ == "__main__":
    unittest.main()
