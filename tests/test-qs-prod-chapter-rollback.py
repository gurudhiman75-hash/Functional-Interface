#!/usr/bin/env python3
"""Offline tests; never calls Google Cloud or changes production."""
import datetime as dt
import importlib.util
import pathlib
import unittest
from unittest.mock import patch

SCRIPT = pathlib.Path(__file__).resolve().parents[1] / "scripts/rollback-examtree-qs-prod-chapter.py"
spec = importlib.util.spec_from_file_location("qs_chapter_rollback", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
NOW = dt.datetime(2026, 10, 24, 10, 0, tzinfo=dt.timezone.utc)
RUN = "fe1ce74c-f4af-423e-840a-50dcae00837b"

class ReleaseWindowTests(unittest.TestCase):
    def env(self, **kwargs):
        obj = {
            "EXAMTREE_QS_CHAPTER_ROLLBACK_ARMED": "true",
            "EXAMTREE_QS_CHAPTER_ROLLBACK_APPLY_APPROVED": "true",
            "EXAMTREE_QS_CHAPTER_ROLLBACK_RELEASE_ID": RUN,
            "EXAMTREE_QS_CHAPTER_ROLLBACK_STARTED_AT": "2026-10-24T09:00:00Z",
            "EXAMTREE_QS_CHAPTER_ROLLBACK_EXPIRES_AT": "2026-10-24T11:00:00Z",
        }
        obj.update(kwargs)
        return obj

    def test_window_success(self):
        start, deadline = mod.release_window(self.env(), NOW)
        self.assertEqual(deadline - start, dt.timedelta(hours=2))

    def test_refuses_missing_approvals(self):
        for key in ("EXAMTREE_QS_CHAPTER_ROLLBACK_ARMED",
                    "EXAMTREE_QS_CHAPTER_ROLLBACK_APPLY_APPROVED"):
            with self.subTest(key=key), self.assertRaises(mod.Stop):
                mod.release_window(self.env(**{key: "false"}), NOW)

    def test_refuses_old_or_invalid_release_id(self):
        for value in ("c71b5ccb-8aa6-44e0-b0a5-01a3607a9c98",
                      "not-a-uuid", RUN.upper(), ""):
            with self.subTest(value=value):
                with self.assertRaises(mod.Stop):
                    mod.release_window(self.env(EXAMTREE_QS_CHAPTER_ROLLBACK_RELEASE_ID=value), NOW)

    def test_refuses_too_long_or_past_window(self):
        with self.assertRaises(mod.Stop):
            mod.release_window(self.env(EXAMTREE_QS_CHAPTER_ROLLBACK_EXPIRES_AT="2026-10-25T10:00:01Z"), NOW)
        with self.assertRaises(mod.Stop):
            mod.release_window(self.env(EXAMTREE_QS_CHAPTER_ROLLBACK_EXPIRES_AT="2026-10-24T09:00:00Z"), NOW)

    def test_exact_job_context(self):
        correct = {"CLOUD_RUN_JOB": mod.JOB, "CLOUD_RUN_TASK_COUNT": "1",
                   "CLOUD_RUN_TASK_INDEX": "0", "GOOGLE_CLOUD_PROJECT": mod.PROJECT}
        mod.assert_job(correct)
        for key in correct:
            with self.subTest(key=key), self.assertRaises(mod.Stop):
                mod.assert_job({k: v for k, v in correct.items() if k != key})

class ServiceGuardTests(unittest.TestCase):
    @staticmethod
    def baseline(service, cfg):
        vals = [{"name": k, "value": "false"} for k in cfg["off"]]
        return {"metadata": {"name": cfg["baseline"]},
                "spec": {"serviceAccountName": cfg["sa"],
                         "containers": [{"env": vals}]},
                "status": {"conditions": [{"type": "Ready", "status": "True"}]}}

    def test_all_three_release_digests_are_unique(self):
        self.assertEqual(len(mod.SERVICES), 3)
        self.assertEqual(len({v["digest"] for v in mod.SERVICES.values()}), 3)
        self.assertIn("examtree-api", mod.SERVICES)

    def test_rejects_unrecognized_serving_image(self):
        service = "examtree-universal-prod"
        cfg = mod.SERVICES[service]
        foreign = service + "-00099-zzz"
        doc = {"status": {"traffic": [{"revisionName": foreign, "percent": 100}]}}
        rev = self.baseline(service, cfg)
        alien = self.baseline(service, cfg)
        alien["metadata"]["name"] = foreign
        alien["status"]["imageDigest"] = "repository@sha256:" + "a" * 64
        def fake_revision(_service, name):
            return rev if name == cfg["baseline"] else alien
        with patch.object(mod, "fetch", return_value=doc), \
             patch.object(mod, "target_revision", side_effect=fake_revision):
            with self.assertRaisesRegex(mod.Stop, "Unrecognized live release image"):
                mod.validate_service(service, cfg)

    def test_rejects_partial_release_approvals(self):
        service = "examtree-api"
        cfg = mod.SERVICES[service]
        live = service + "-00005-abc"
        doc = {"status": {"traffic": [{"revisionName": live, "percent": 100}]}}
        original = self.baseline(service, cfg)
        active = self.baseline(service, cfg)
        active["metadata"]["name"] = live
        active["status"]["imageDigest"] = "repository@" + cfg["digest"]
        active["spec"]["containers"][0]["env"] = [
            {"name": cfg["off"][0], "value": "true"},
            {"name": cfg["off"][1], "value": "false"},
        ]
        with patch.object(mod, "fetch", return_value=doc), \
             patch.object(mod, "target_revision",
                          side_effect=lambda s, n: original if n == cfg["baseline"] else active):
            with self.assertRaisesRegex(mod.Stop, "Partial release approvals"):
                mod.validate_service(service, cfg)

    def test_rejects_unpinned_or_split_rollback_traffic(self):
        service = "examtree-api"
        cfg = mod.SERVICES[service]
        doc = {"spec": {"template": {"spec": {"containers": [{"env": [
            {"name": k, "value": "false"} for k in cfg["off"]
        ]}]}}, "traffic": [{"revisionName": "LATEST", "percent": 100,
                              "latestRevision": True}]},
               "status": {"traffic": [{"revisionName": cfg["baseline"], "percent": 100}]}}
        with patch.object(mod, "fetch", return_value=doc):
            with self.assertRaisesRegex(mod.Stop, "not pinned"):
                mod.verify_disabled(service, cfg)

class NoCloudMutationTests(unittest.TestCase):
    def test_unapproved_apply_makes_no_cloud_calls(self):
        with patch.object(mod, "command", side_effect=["sarbedutech"]) as called, \
             patch.object(mod, "assert_job", side_effect=mod.Stop("no job context")):
            with patch("sys.argv", [str(SCRIPT), "--apply"]):
                with self.assertRaises(mod.Stop):
                    mod.main()
            self.assertEqual(called.call_count, 1)

    def test_not_due_does_not_mutate_any_cloud_resource(self):
        env = ReleaseWindowTests().env()
        env.update({"CLOUD_RUN_JOB": mod.JOB, "CLOUD_RUN_TASK_COUNT": "1",
                    "CLOUD_RUN_TASK_INDEX": "0", "GOOGLE_CLOUD_PROJECT": mod.PROJECT})
        with patch.object(mod, "command", return_value="sarbedutech"), \
             patch.object(mod, "verify_scheduler", return_value="ENABLED"), \
             patch.object(mod, "perform_rollback") as rollback, \
             patch.object(mod.dt, "datetime", wraps=dt.datetime) as clock, \
             patch.dict(mod.os.environ, env, clear=True), \
             patch("sys.argv", [str(SCRIPT), "--apply"]):
            clock.now.return_value = NOW
            self.assertEqual(mod.main(), 0)
            rollback.assert_not_called()


class RollbackOrderTests(unittest.TestCase):
    def test_failure_after_queue_pause_never_pauses_scheduler(self):
        reads = 0
        def fake_fetch(*args):
            nonlocal reads
            if args[:3] == ("tasks", "queues", "describe"):
                reads += 1
                return {"state": "RUNNING" if reads == 1 else "PAUSED"}
            raise AssertionError("Unexpected Cloud metadata call")
        with patch.object(mod, "fetch", side_effect=fake_fetch), \
             patch.object(mod, "command") as writes, \
             patch.object(mod, "dispatcher_approved", return_value="false"), \
             patch.object(mod, "validate_service", side_effect=mod.Stop("wrong release")):
            with self.assertRaisesRegex(mod.Stop, "Rollback incomplete"):
                mod.perform_rollback()
            self.assertEqual(reads, 2)
            self.assertEqual(writes.call_count, 1)
            self.assertEqual(writes.call_args.args[:3],
                             ("tasks", "queues", "pause"))

    def test_success_routes_only_to_explicit_baseline_and_pauses_scheduler_last(self):
        scheduler = ["ENABLED"]
        actions = []
        def fake_fetch(*args):
            if args[:3] == ("tasks", "queues", "describe"):
                return {"state": "PAUSED"}
            if args[:3] == ("run", "services", "describe"):
                service = args[3]
                cfg = mod.SERVICES[service]
                return {"spec": {"template": {"spec": {"containers": [
                    {"env": [{"name": key, "value": "false"}
                             for key in cfg["off"]]}
                ]}}}}
            raise AssertionError("Unexpected Cloud metadata call")
        def fake_cmd(*parts):
            actions.append(parts)
            if parts[:3] == ("scheduler", "jobs", "pause"):
                scheduler[0] = "PAUSED"
        with patch.object(mod, "fetch", side_effect=fake_fetch), \
             patch.object(mod, "command", side_effect=fake_cmd), \
             patch.object(mod, "dispatcher_approved", return_value="false"), \
             patch.object(mod, "validate_service"), \
             patch.object(mod, "verify_disabled"), \
             patch.object(mod, "verify_scheduler", side_effect=lambda: scheduler[0]):
            mod.perform_rollback()
        self.assertEqual(len(actions), 4)
        for i, (service, cfg) in enumerate(mod.SERVICES.items()):
            self.assertEqual(actions[i][:3],
                             ("run", "services", "update-traffic"))
            self.assertIn("--to-revisions=" + cfg["baseline"] + "=100",
                          actions[i])
            self.assertNotIn("--to-latest", actions[i])
        self.assertEqual(actions[-1][:3], ("scheduler", "jobs", "pause"))

if __name__ == "__main__":
    unittest.main()
