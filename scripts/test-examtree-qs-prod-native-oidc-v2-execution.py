#!/usr/bin/env python3
"""Offline fail-closed unit tests for Examtree QS Cloud Run V2 execution."""
import importlib.util
import pathlib
import sys
import types
import unittest
from unittest.mock import patch

path=pathlib.Path(__file__).with_name("run-examtree-qs-prod-native-oidc-v2.py")
spec=importlib.util.spec_from_file_location("examtree_prod_run_v2",path)
assert spec and spec.loader
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

class JobRunTests(unittest.TestCase):
    def setUp(self):
        self.job,svc,account,marker=m.native.PROBES[0]
        self.body=m.validator.v2_job(
            self.job,"asia-south1-docker.pkg.dev/sarbedutech/x/y@sha256:"+"b"*64,
            account,svc,marker,"https://examtree-qs-receiver-prod-example.a.run.app")

    def test_only_fixed_identity_jobs(self):
        self.assertEqual(len(m.JOBS),2)
        self.assertTrue(all(j.startswith("examtree-qs-prod-oidc-check-") for j in m.JOBS))

    def test_request_cannot_retarget_http_host(self):
        with self.assertRaises(m.GateError):
            m.safe_api("GET","other-project/locations/us/jobs/name","fake")
        with self.assertRaises(m.GateError):
            m.safe_api("POST",m.ROOT+"/../other","fake",{})

    def test_no_delete_or_patch(self):
        for method in ("DELETE","PATCH","PUT"):
            with self.assertRaises(m.GateError):
                m.safe_api(method,m.ROOT+"/jobs/x","fake",{})

    def test_existing_job_fails_closed(self):
        with patch.object(m,"get_job",return_value={"name":m.ROOT+"/jobs/"+self.job}),\
             patch.object(m,"job_executions",return_value=[]):
            found=m.check_names("fake")
        self.assertEqual(found,[x[0] for x in m.native.PROBES])

    def test_created_contract_rejects_worker_approval(self):
        returned={"name":m.ROOT+"/jobs/"+self.job,
                  "template":{"taskCount":1,"parallelism":1,
                    "template":{"serviceAccount":self.body["template"]["template"]["serviceAccount"],
                      "maxRetries":0,"timeout":"75s",
                      "containers":[dict(self.body["template"]["template"]["containers"][0])]}}}
        with patch.object(m,"get_job",return_value=returned):
            m.verify_created_job(self.job,self.body,"fake")
        returned["template"]["template"]["containers"][0]["args"]=["-e","console.log('oops')"]
        with patch.object(m,"get_job",return_value=returned):
            with self.assertRaises(m.GateError):
                m.verify_created_job(self.job,self.body,"fake")

    def test_run_operation_refuses_unexpected_id(self):
        with self.assertRaises(m.GateError):
            m.operation_done("projects/other/locations/asia-south1/operations/x","fake")

    def test_failed_execution_never_counts_as_pass(self):
        ex_name=m.ROOT+"/jobs/"+self.job+"/executions/exec-1"
        data={"name":ex_name,"completionTime":"2026-10-19T12:00:00Z",
              "taskCount":1,"succeededCount":0,"failedCount":1}
        with patch.object(m,"safe_api",return_value=data):
            with self.assertRaises(m.GateError):
                m.wait_execution(ex_name,"fake")

    def test_success_requires_single_completed_task(self):
        ex_name=m.ROOT+"/jobs/"+self.job+"/executions/exec-1"
        data={"name":ex_name,"completionTime":"2026-10-19T12:00:00Z",
              "taskCount":1,"succeededCount":1,"failedCount":0,
              "retriedCount":0,"cancelledCount":0}
        with patch.object(m,"safe_api",return_value=data):
            self.assertIsNone(m.wait_execution(ex_name,"fake"))

    def test_http_error_never_prints_provider_message(self):
        import io,json,urllib.error
        err={"error":{"status":"INVALID_ARGUMENT","message":"private token secret"}}
        exc=urllib.error.HTTPError(
            "https://run.googleapis.com",400,"Bad Request",None,
            io.BytesIO(json.dumps(err).encode("utf-8")))
        with patch.object(m.validator,"open_validation",side_effect=exc):
            with self.assertRaises(m.GateError) as got:
                m.safe_api("POST",m.ROOT+"/jobs","notarealtoken",{})
        self.assertIn("INVALID_ARGUMENT",str(got.exception))
        self.assertNotIn("secret",str(got.exception))

if __name__=="__main__":
    unittest.main()
