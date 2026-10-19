#!/usr/bin/env python3
"""Offline regression tests for the read-only Examtree canary admission."""
import importlib.util
import pathlib
import types
import unittest
from unittest.mock import patch

path=pathlib.Path(__file__).with_name("verify-examtree-qs-prod-one-question-canary-admission.py")
spec=importlib.util.spec_from_file_location("qs_canary_admission",path)
assert spec and spec.loader
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class AdmissionTests(unittest.TestCase):
    def setUp(self):
        m.COUNT.update(PASS=0,REVIEW=0,BLOCK=0)

    def test_empty_queue_only(self):
        m.assert_no_tasks([])
        self.assertEqual(m.COUNT["PASS"],1)
        m.assert_no_tasks([{"name":"projects/sarbedutech/.../tasks/existing"}])
        self.assertEqual(m.COUNT["BLOCK"],1)

    def test_queue_unknown_fails_closed(self):
        m.assert_no_tasks(None)
        self.assertEqual(m.COUNT["BLOCK"],1)

    def test_three_exact_alerts_required(self):
        examples=[{"displayName":name,"enabled":True,
                   "conditions":[{"name":"condition"}],
                   "notificationChannels":["channel"]} for name in m.ALERTS]
        m.assert_policies(examples)
        self.assertEqual(m.COUNT["PASS"],3)
        m.COUNT.update(PASS=0,REVIEW=0,BLOCK=0)
        examples[0]["enabled"]=False
        m.assert_policies(examples)
        self.assertEqual(m.COUNT["BLOCK"],1)

    def test_service_flag_rejects_duplicate_keys(self):
        mock={"spec":{"template":{"spec":{"containers":[{
            "env":[{"name":"EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED","value":"false"},
                   {"name":"EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED","value":"false"}]
        }]}}}}
        with patch.object(m,"fetch",return_value=mock):
            self.assertIsNone(m.service_flags("examtree-qs-receiver-prod"))

    def test_no_mutation_when_read_only(self):
        existing=types.SimpleNamespace(returncode=0,stdout="sarbedutech",stderr="")
        baseline=types.SimpleNamespace(returncode=0,
            stdout="RESULT: PREFLIGHT PASSED; NO CHANGES",stderr="")
        receiver={"spec":{"template":{"spec":{"containers":[{
            "env":[{"name":"EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED","value":"false"}]
        }]}}}}
        worker={"spec":{"template":{"spec":{"containers":[{
            "env":[{"name":"EXAMTREE_QS_PRODUCTION_WORKER_APPROVED","value":"false"}]
        }]}}}}
        alerts=[{"displayName":name,"enabled":True,
                 "conditions":[{"name":"condition"}],"notificationChannels":["channel"]}
                 for name in m.ALERTS]
        with patch.object(m,"cmd",side_effect=[existing,baseline]),\
             patch.object(m,"fetch",side_effect=[[],receiver,worker,alerts]):
            self.assertEqual(m.main(),0)
        self.assertEqual(m.COUNT["BLOCK"],0)
        self.assertEqual(m.COUNT["REVIEW"],4)

    def test_wrong_project_stops_immediately(self):
        wrong=types.SimpleNamespace(returncode=0,stdout="other-project",stderr="")
        with patch.object(m,"cmd",return_value=wrong),patch.object(m,"fetch") as fetch:
            self.assertEqual(m.main(),2)
            fetch.assert_not_called()


if __name__=="__main__":
    unittest.main()
