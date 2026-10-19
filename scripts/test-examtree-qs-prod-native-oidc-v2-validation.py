#!/usr/bin/env python3
"""Offline tests for Cloud Run V2 validation-only native OIDC probe."""
import importlib.util
import json
import pathlib
import unittest
import urllib.error
import io
from unittest.mock import patch

path=pathlib.Path(__file__).with_name("validate-examtree-qs-prod-native-oidc-v2.py")
spec=importlib.util.spec_from_file_location("qs_v2_validation_only",path)
assert spec and spec.loader
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ValidationOnlyTests(unittest.TestCase):
    def test_mandatory_validate_only(self):
        for job, *_ in module.native.PROBES:
            url=module.validation_url(job)
            self.assertIn("validateOnly=true",url)
            self.assertIn("https://run.googleapis.com/v2/projects/sarbedutech/locations/asia-south1/jobs?",url)

    def test_v2_field_names_and_no_generation(self):
        job,service,account,marker=module.native.PROBES[0]
        body=module.v2_job(job,"asia-south1-docker.pkg.dev/sarbedutech/qs/x@sha256:"+"b"*64,
                           account,service,marker,"https://examtree-qs-receiver-prod-123.a.run.app")
        task=body["template"]["template"]
        self.assertEqual(task["serviceAccount"],module.native.TASK_SA)
        self.assertEqual(task["timeout"],"75s")
        self.assertEqual(task["maxRetries"],0)
        self.assertEqual(body["template"]["taskCount"],1)
        self.assertEqual(body["template"]["parallelism"],1)
        container=task["containers"][0]
        self.assertEqual(container["command"],["node","-e"])
        self.assertNotIn("DATABASE_URL",json.dumps(body))
        self.assertIn('method:"GET"',container["args"][0])
        self.assertNotIn('method:"POST"',container["args"][0])

    def test_redacted_bad_request_field_only(self):
        payload=json.dumps({"error":{"status":"INVALID_ARGUMENT","message":"secret user@example.com",
               "details":[{"fieldViolations":[{"field":"template.template.containers[0].image",
                    "description":"leaked secret value"}]}]}}).encode()
        req_error=urllib.error.HTTPError(
            url=module.validation_url(module.native.PROBES[0][0]),
            code=400,msg="Invalid argument",hdrs=None,fp=io.BytesIO(payload))
        with patch.object(module,"open_validation",side_effect=req_error):
            status,detail=module.validate_request(module.native.PROBES[0][0],{},"pretend-token")
        self.assertEqual(status,"BLOCK")
        self.assertIn("template.template.containers[0].image",detail)
        self.assertNotIn("secret",detail)
        self.assertNotIn("example.com",detail)

    def test_auth_denied_is_review(self):
        payload=b'{"error":{"status":"PERMISSION_DENIED","message":"actor email protected"}}'
        error=urllib.error.HTTPError(url="https://run.googleapis.com",code=403,
                                      msg="Forbidden",hdrs=None,fp=io.BytesIO(payload))
        with patch.object(module,"open_validation",side_effect=error):
            status,detail=module.validate_request(module.native.PROBES[0][0],{},"pretend-token")
        self.assertEqual(status,"REVIEW")
        self.assertIn("PERMISSION_DENIED",detail)
        self.assertNotIn("email",detail)

    def test_token_mint_error_does_not_print_raw_stderr(self):
        from types import SimpleNamespace
        fail=SimpleNamespace(returncode=1,stdout="",stderr="secret user@example.com")
        with patch.object(module.subprocess,"run",return_value=fail):
            self.assertIsNone(module.token_for_current_user())


if __name__=="__main__":
    unittest.main()
