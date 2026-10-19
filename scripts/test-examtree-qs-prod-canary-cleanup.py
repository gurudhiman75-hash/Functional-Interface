#!/usr/bin/env python3
"""No-GCP tests for the independent production canary recovery job."""
import importlib.util
import datetime as dt
import pathlib
import unittest
from unittest.mock import patch

path=pathlib.Path(__file__).with_name("cleanup-examtree-qs-prod-canary.py")
spec=importlib.util.spec_from_file_location("qs_canary_cleanup",path)
assert spec and spec.loader
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
now=dt.datetime(2026,10,19,9,5,tzinfo=dt.timezone.utc)
base={"CLOUD_RUN_JOB":m.JOB,"CLOUD_RUN_TASK_COUNT":"1",
      "CLOUD_RUN_TASK_INDEX":"0","GOOGLE_CLOUD_PROJECT":m.PROJECT,
      "EXAMTREE_QS_PRODUCTION_CANARY_CLEANUP_APPROVED":"true",
      "EXAMTREE_QS_PRODUCTION_CANARY_ONLY":"true",
      "EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT":"2026-10-19T09:00:00Z"}

class CleanupSafety(unittest.TestCase):
    def test_not_allowed_before_deadline(self):
        with self.assertRaises(RuntimeError):
            m.assert_job_context(base,dt.datetime(2026,10,19,8,59,tzinfo=dt.timezone.utc))
        m.assert_job_context(base,now)

    def test_wrong_job_never_applies(self):
        for delta in ({"CLOUD_RUN_JOB":"examtree-qs-dispatch-prod"},
                      {"CLOUD_RUN_TASK_COUNT":"2"},
                      {"EXAMTREE_QS_PRODUCTION_CANARY_CLEANUP_APPROVED":"false"},
                      {"GOOGLE_CLOUD_PROJECT":"another"}):
            with self.assertRaises(RuntimeError):
                m.assert_job_context({**base,**delta},now)

    def test_no_project_or_out_of_year_expiration(self):
        with self.assertRaises(RuntimeError):
            m.release_deadline({**base,
              "EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT":"2030-10-19T09:00:00Z"},now)
        with self.assertRaises(RuntimeError):
            m.release_deadline({**base,
              "EXAMTREE_QS_PRODUCTION_CANARY_ONLY":"false"},now)

    def test_flags_verify_runtime_identity(self):
        service={"spec":{"template":{"spec":{
          "serviceAccountName":m.EXPECTED_IDENTITIES[m.RECEIVER],
          "containers":[{"env":[{"name":m.SVC_FLAGS[m.RECEIVER],"value":"false"}]}]
        }}}}
        with patch.object(m,"describe",return_value=service):
            self.assertEqual(m.flags(m.RECEIVER)[m.SVC_FLAGS[m.RECEIVER]],"false")
        service["spec"]["template"]["spec"]["serviceAccountName"]="incorrect@other"
        with patch.object(m,"describe",return_value=service):
            with self.assertRaises(RuntimeError):
                m.flags(m.RECEIVER)

    def test_image_install_and_help_only_smoke_are_required(self):
        root=pathlib.Path(__file__).resolve().parent.parent
        docker=(root/"Dockerfile.examtree-qs-prod-canary-cleanup").read_text()
        build=(root/"cloudbuild.examtree-qs-prod-canary-cleanup.yaml").read_text()
        self.assertIn("apt-get install -y --no-install-recommends python3",docker)
        self.assertIn("RUN python3 /opt/examtree/cleanup.py --help",docker)
        self.assertIn('ENTRYPOINT ["python3", "/opt/examtree/cleanup.py"]',docker)
        self.assertIn("args: ['run', '--rm', '\${_IMAGE}', '--help']",build)
        self.assertNotIn("gcloud run jobs execute",build)

    def test_default_operation_is_read_only(self):
        with patch("sys.argv",["cleanup-examtree-qs-prod-canary.py"]),\
             patch.object(m,"call",return_value="sarbedutech\n") as call,\
             patch.object(m,"snapshot",return_value=(
               {m.WORKER:{m.SVC_FLAGS[m.WORKER]:"false"},
                m.RECEIVER:{m.SVC_FLAGS[m.RECEIVER]:"false"}},"PAUSED")):
            self.assertEqual(m.main(),0)
            self.assertEqual(call.call_count,1)
            self.assertEqual(call.call_args.args[0],["config","get-value","project"])

if __name__=="__main__":
    unittest.main()
