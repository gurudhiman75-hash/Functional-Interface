#!/usr/bin/env python3
"""Offline safety tests; never calls GCP or creates resources."""
import importlib.util
import pathlib
import datetime as dt
import sys
import unittest
from unittest.mock import patch
PATH=pathlib.Path(__file__).with_name("fasttrack-examtree-qs-cleanup-iam.py")
spec=importlib.util.spec_from_file_location("fasttrack_qs_cleanup_iam",PATH)
assert spec and spec.loader
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

class SafeFasttrack(unittest.TestCase):
    def test_permissions_exclude_destructive_roles(self):
        perms=set(x for group in m.ROLES.values() for x in group)
        self.assertIn("run.services.update",perms)
        self.assertIn("run.revisions.get",perms)
        self.assertEqual(set(m.ROLES["examtreeQsCanarySvcControl"]),
                         {"run.services.get","run.services.update","run.revisions.get"})
        self.assertIn("cloudtasks.queues.pause",perms)
        self.assertIn("cloudscheduler.jobs.pause",perms)
        self.assertFalse(any(x in perms for x in [
            "cloudtasks.queues.resume","cloudtasks.queues.purge",
            "cloudtasks.tasks.create","cloudtasks.tasks.delete",
            "run.services.delete","run.jobs.run","run.jobs.delete",
            "cloudscheduler.jobs.run","cloudscheduler.jobs.resume",
            "iam.serviceAccounts.getOpenIdToken"]))

    def test_apply_without_explicit_approval_does_not_touch_gcp(self):
        with patch.dict("os.environ",{"EXAMTREE_QS_CLEANUP_IAM_APPROVED":"no"}),\
             patch.object(m,"call") as call:
            with self.assertRaises(m.Stop):
                m.apply()
            call.assert_not_called()

    def test_default_only_calls_safety_metadata(self):
        with patch.object(m,"safety") as safety,\
             patch.object(m,"apply") as apply,\
             patch.object(sys,"argv",["script.py"]):
            self.assertEqual(m.main(),0)
            safety.assert_called_once()
            apply.assert_not_called()

    def test_identity_rejects_missing_or_multiple(self):
        with self.assertRaises(m.Stop):m.identity({})
        with self.assertRaises(m.Stop):m.identity({
            "serviceAccountName":"a@sarbedutech.iam.gserviceaccount.com",
            "template":{"serviceAccountName":"b@sarbedutech.iam.gserviceaccount.com"}
        })
        self.assertEqual(
            m.identity({"serviceAccountName":"only@sarbedutech.iam.gserviceaccount.com"}),
            "only@sarbedutech.iam.gserviceaccount.com")

    def test_existing_broader_role_rejected(self):
        obj={"includedPermissions":["run.services.get","run.services.update","run.services.delete"]}
        with patch.object(m,"try_json",return_value=obj):
            with self.assertRaises(m.Stop):
                m.ensure_role("examtreeQsCanarySvcControl",
                              m.ROLES["examtreeQsCanarySvcControl"])

    def test_no_secrets_or_generation_path(self):
        source=PATH.read_text(encoding="utf-8")
        self.assertNotIn("DATABASE_URL",source)
        self.assertNotIn("secretmanager.versions.access",source)
        self.assertNotIn("queues resume",source)
        self.assertNotIn("tasks create",source)
        self.assertNotIn("roles/run.admin",source)
        self.assertNotIn("roles/editor",source)

if __name__=="__main__":
    unittest.main()
