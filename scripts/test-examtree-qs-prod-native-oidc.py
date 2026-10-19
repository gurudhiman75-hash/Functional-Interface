#!/usr/bin/env python3
"""Offline, no-GCP regression checks for the Examtree native OIDC job plan."""
import importlib.util
import json
from pathlib import Path
import unittest
from unittest.mock import patch

SCRIPT=Path(__file__).with_name("prepare-examtree-qs-prod-native-oidc.py")
spec=importlib.util.spec_from_file_location("examtree_qs_native_probe",SCRIPT)
assert spec and spec.loader
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class NativeOidcTests(unittest.TestCase):
    def test_strict_private_origin(self):
        good="https://examtree-qs-receiver-prod-abcdef.a.run.app"
        self.assertEqual(module.origin(good,"examtree-qs-receiver-prod"),good)
        for bad in (
            "http://examtree-qs-receiver-prod-abcdef.a.run.app",
            "https://examtree-qs-receiver-prod-abcdef.a.run.app/other",
            "https://examtree-qs-receiver-prod-abcdef.a.run.app/?x=1",
            "https://examtree-qs-receiver-prod-abcdef.a.run.app.evil.com",
            "https://examtree-qs-receiver-staging-abcdef.a.run.app",
        ):
            self.assertIsNone(module.origin(bad,"examtree-qs-receiver-prod"))

    def test_exact_runtime_service_identities(self):
        self.assertEqual(module.PROBES[0][2],module.TASK_SA)
        self.assertEqual(module.PROBES[1][2],module.RECEIVER_SA)

    def test_manifest_project_number_region_label(self):
        job,target,account,marker=module.PROBES[0]
        image="asia-south1-docker.pkg.dev/sarbedutech/qs/a@sha256:"+"b"*64
        manifest=module.manifest(job,image,account,target,marker,
            "https://examtree-qs-receiver-prod-test.a.run.app")
        self.assertEqual(manifest["metadata"]["namespace"], "1083299267005")
        self.assertEqual(manifest["metadata"]["labels"]["cloud.googleapis.com/location"],
                         "asia-south1")

    def test_validation_error_redacted(self):
        from types import SimpleNamespace
        result=SimpleNamespace(returncode=1,stderr="INVALID_ARGUMENT: invalid resource from acct secret123")
        category=module.classify_job_failure(result)
        self.assertEqual(category,"Cloud Run job manifest rejected by validation")
        self.assertNotIn("secret123",category)

    def test_act_as_error_redacted(self):
        from types import SimpleNamespace
        result=SimpleNamespace(returncode=1,stderr="Permission iam.serviceAccounts.actAs denied to user@example.com")
        self.assertEqual(module.classify_job_failure(result),
                         "missing permission to attach the runtime service account")

    def test_job_spec_never_imports_app_or_db(self):
        job,target,account,marker=module.PROBES[0]
        digest="asia-south1-docker.pkg.dev/sarbedutech/examtree-workers/x@sha256:"+"a"*64
        spec=module.manifest(job,digest,account,target,marker,
                             "https://examtree-qs-receiver-prod-abc.a.run.app")
        outer=spec["spec"]["template"]["spec"]
        inner=outer["template"]["spec"]
        self.assertEqual(outer["taskCount"],1)
        self.assertEqual(outer["parallelism"],1)
        self.assertEqual(inner["maxRetries"],0)
        self.assertEqual(inner["serviceAccountName"],module.TASK_SA)
        self.assertEqual(inner["containers"][0]["command"],["node","-e"])
        self.assertNotIn("DATABASE_URL",json.dumps(spec))
        self.assertNotIn("PRODUCTION_RECEIVER_APPROVED",json.dumps(spec))

    def test_signed_get_only(self):
        self.assertIn('method:"GET"',module.NODE_SOURCE)
        self.assertIn('"/health"',module.NODE_SOURCE)
        self.assertIn("ready!==false",module.NODE_SOURCE)
        self.assertIn("Metadata-Flavor",module.NODE_SOURCE)
        self.assertNotIn('method:"POST"',module.NODE_SOURCE)

    def test_refuses_mutable_container_tag_without_revision_digest(self):
        service={"status":{"url":"https://examtree-universal-prod-abc.a.run.app",
                           "latestReadyRevisionName":"r1","latestCreatedRevisionName":"r1"},
                 "spec":{"template":{"spec":{"containers":[{
                   "image":"asia-south1-docker.pkg.dev/sarbedutech/qs/worker:mutable"}]}}}}
        with patch.object(module,"run_json",side_effect=[service,{"status":{}}]):
            with self.assertRaises(RuntimeError):
                module.inspect_service("examtree-universal-prod")

    def test_revision_digest_pins_exact_artifact(self):
        service={"status":{"url":"https://examtree-universal-prod-abc.a.run.app",
                           "latestReadyRevisionName":"r1","latestCreatedRevisionName":"r1"},
                 "spec":{"template":{"spec":{"containers":[{
                   "image":"asia-south1-docker.pkg.dev/sarbedutech/qs/worker:known"}]}}}}
        with patch.object(module,"run_json",side_effect=[
            service,{"status":{"containerStatuses":[{"imageDigest":"sha256:"+"b"*64}]}}]):
            endpoint,image=module.inspect_service("examtree-universal-prod")
        self.assertTrue(endpoint.endswith(".run.app"))
        self.assertEqual(image,"asia-south1-docker.pkg.dev/sarbedutech/qs/worker@sha256:"+"b"*64)


if __name__=="__main__":
    unittest.main()
