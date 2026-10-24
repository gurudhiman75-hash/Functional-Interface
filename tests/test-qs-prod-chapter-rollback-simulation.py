#!/usr/bin/env python3
"""Purely offline, stateful rehearsal of the EXACT production rollback controller.

The fake Cloud API lives in memory. No gcloud binary, credentials, Cloud Run,
Scheduler, IAM, database or network calls are used. Passing this suite is NOT a
live end-to-end production rollback proof.
"""
import copy
import datetime as dt
import importlib.util
import pathlib
import sys
import unittest
from unittest.mock import patch

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/rollback-examtree-qs-prod-chapter.py"
spec = importlib.util.spec_from_file_location("qs_chapter_release_simulation", SCRIPT)
controller = importlib.util.module_from_spec(spec)
spec.loader.exec_module(controller)
UTC = dt.timezone.utc
EXPIRES = "2026-10-24T11:00:00Z"
STARTED = "2026-10-24T09:00:00Z"
RUN_ID = "fe1ce74c-f4af-423e-840a-50dcae00837b"

def env_rows(obj):
    return [{"name": key, "value": value} for key, value in obj.items()]

class InMemoryCloud:
    """Models metadata and mutations at Cloud Run's existing v1 JSON shapes."""
    def __init__(self):
        self.queue = "RUNNING"
        self.dispatch = "true"
        self.scheduler = "ENABLED"
        self.scheduler_target_valid = True
        self.actions = []
        self.fail_action = None
        self.services = {}
        self.revisions = {}
        for service, config in controller.SERVICES.items():
            baseline_env = {key: "false" for key in config["off"]}
            baseline_env.update(EXAMTREE_API_RUNTIME="cloud-run",
                                EXAMTREE_API_STAGING="false")
            self.revisions[config["baseline"]] = {
                "metadata": {"name": config["baseline"]},
                "spec": {
                    "serviceAccountName": config["sa"],
                    "containers": [{"env": env_rows(baseline_env)}],
                },
                "status": {"conditions": [{"type": "Ready", "status": "True"}],
                           "imageDigest": "repo@sha256:" + "f" * 64},
            }
            candidate = service + "-99999-sim"
            live_env = {key: "true" for key in config["off"]}
            live_env.update(EXAMTREE_API_RUNTIME="cloud-run",
                            EXAMTREE_API_STAGING="false",
                            EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_EXPIRES_AT=EXPIRES,
                            EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_SCOPE_JSON=
                                '[{"engineId":"reasoning-v1","packageId":"OPS-001","reviewOnly":true,"chapterWide":true}]')
            self.revisions[candidate] = {
                "metadata": {"name": candidate},
                "spec": {
                    "serviceAccountName": config["sa"],
                    "containers": [{"env": env_rows(live_env)}],
                },
                "status": {
                    "conditions": [{"type": "Ready", "status": "True"}],
                    "imageDigest": "asia-south1-docker.pkg.dev/test@" + config["digest"],
                },
            }
            self.services[service] = {
                "spec": {
                    "template": {"spec": {
                        "serviceAccountName": config["sa"],
                        "containers": [{"env": env_rows(live_env)}],
                    }},
                    "traffic": [{"percent": 100, "revisionName": candidate}],
                },
                "status": {
                    "traffic": [{"percent": 100, "revisionName": candidate}]
                },
            }

    def fetch(self, *args):
        if args[:3] == ("tasks", "queues", "describe"):
            return {"state": self.queue}
        if args[:3] == ("scheduler", "jobs", "describe"):
            identity = controller.SCHEDULER_ID
            if not self.scheduler_target_valid:
                identity = "wrong@sarbedutech.iam.gserviceaccount.com"
            return {
                "state": self.scheduler,
                "httpTarget": {
                    "uri": "https://run.googleapis.com/v2/projects/"
                           + controller.PROJECT + "/locations/" + controller.REGION
                           + "/jobs/" + controller.JOB + ":run",
                    "httpMethod": "POST",
                    "oauthToken": {"serviceAccountEmail": identity},
                },
            }
        if args[:3] == ("run", "services", "describe"):
            return copy.deepcopy(self.services[args[3]])
        if args[:3] == ("run", "revisions", "describe"):
            return copy.deepcopy(self.revisions[args[3]])
        if args[:3] == ("run", "jobs", "describe"):
            assert args[3] == controller.DISPATCHER
            return {
                "spec": {"template": {"spec": {"template": {"spec": {
                    "containers": [{"env": env_rows({
                        "EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED": self.dispatch
                    })}],
                }}}}},
            }
        raise AssertionError("Unexpected fake Cloud API GET: " + repr(args))

    def command(self, *args):
        if args[:3] == ("config", "get-value", "project"):
            return controller.PROJECT + "\n"
        action = args[:3]
        self.actions.append(args)
        if self.fail_action is not None and args[:len(self.fail_action)] == self.fail_action:
            raise controller.Stop("SIMULATED_GCP_PERMISSION_DENIED")
        if action == ("tasks", "queues", "pause"):
            self.queue = "PAUSED"
            return ""
        if action == ("run", "jobs", "update"):
            if args[3] != controller.DISPATCHER:
                raise AssertionError("Unexpected job update")
            self.dispatch = "false"
            return ""
        if action == ("run", "services", "update"):
            name = args[3]
            if "--no-traffic" not in args:
                raise AssertionError("Service template update must be no-traffic")
            updated = next(x.split("=", 1)[1]
                           for x in args if x.startswith("--update-env-vars="))
            new_flags = dict(item.split("=", 1) for item in updated.split(","))
            container = self.services[name]["spec"]["template"]["spec"]["containers"][0]
            current = {row["name"]: row["value"] for row in container["env"]}
            current.update(new_flags)
            container["env"] = env_rows(current)
            return ""
        if action == ("run", "services", "update-traffic"):
            name = args[3]
            cfg = controller.SERVICES[name]
            pinned = "--to-revisions=" + cfg["baseline"] + "=100"
            if pinned not in args or "--to-latest" in args:
                raise AssertionError("Rollback must pin exact known-good revision")
            desired = [{"percent": 100, "revisionName": cfg["baseline"]}]
            self.services[name]["spec"]["traffic"] = copy.deepcopy(desired)
            self.services[name]["status"]["traffic"] = copy.deepcopy(desired)
            return ""
        if action == ("scheduler", "jobs", "pause"):
            if args[3] != controller.SCHEDULER:
                raise AssertionError("Attempted to pause unrelated Scheduler")
            self.scheduler = "PAUSED"
            return ""
        raise AssertionError("Unexpected fake Cloud API mutation: " + repr(args))

    def execute(self, now, *, armed=True):
        job_env = {
            "CLOUD_RUN_JOB": controller.JOB,
            "CLOUD_RUN_TASK_COUNT": "1",
            "CLOUD_RUN_TASK_INDEX": "0",
            "GOOGLE_CLOUD_PROJECT": controller.PROJECT,
            "EXAMTREE_QS_CHAPTER_ROLLBACK_ARMED": "true" if armed else "false",
            "EXAMTREE_QS_CHAPTER_ROLLBACK_APPLY_APPROVED": "true",
            "EXAMTREE_QS_CHAPTER_ROLLBACK_RELEASE_ID": RUN_ID,
            "EXAMTREE_QS_CHAPTER_ROLLBACK_STARTED_AT": STARTED,
            "EXAMTREE_QS_CHAPTER_ROLLBACK_EXPIRES_AT": EXPIRES,
        }
        with patch.object(controller, "fetch", side_effect=self.fetch), \
             patch.object(controller, "command", side_effect=self.command), \
             patch.dict(controller.os.environ, job_env, clear=True), \
             patch("sys.argv", [str(SCRIPT), "--apply"]), \
             patch.object(controller.dt, "datetime", wraps=dt.datetime) as clock:
            clock.now.return_value = now
            return controller.main()

class SimulatedDeadlineRollbackTests(unittest.TestCase):
    def test_expired_release_restores_exact_baselines_and_disables_all(self):
        cloud = InMemoryCloud()
        now = dt.datetime(2026, 10, 24, 11, 5, tzinfo=UTC)
        self.assertEqual(cloud.execute(now), 0)
        self.assertEqual(cloud.queue, "PAUSED")
        self.assertEqual(cloud.dispatch, "false")
        self.assertEqual(cloud.scheduler, "PAUSED")
        action_labels = [(x[0], x[1], x[2]) for x in cloud.actions]
        self.assertEqual(action_labels[0], ("tasks", "queues", "pause"))
        self.assertEqual(action_labels[1], ("run", "jobs", "update"))
        self.assertEqual(action_labels[-1], ("scheduler", "jobs", "pause"))
        self.assertEqual(action_labels.count(("run", "services", "update")), 3)
        self.assertEqual(action_labels.count(("run", "services", "update-traffic")), 3)
        for name, cfg in controller.SERVICES.items():
            doc = cloud.services[name]
            self.assertEqual(doc["status"]["traffic"],
                             [{"percent": 100, "revisionName": cfg["baseline"]}])
            self.assertEqual(doc["spec"]["traffic"],
                             [{"percent": 100, "revisionName": cfg["baseline"]}])
            values = controller.env_values(controller.template(doc))
            self.assertTrue(all(values[key] == "false" for key in cfg["off"]))

    def test_before_expiry_is_zero_write(self):
        cloud = InMemoryCloud()
        self.assertEqual(cloud.execute(dt.datetime(
            2026, 10, 24, 10, 0, tzinfo=UTC)), 0)
        self.assertEqual(cloud.actions, [])
        self.assertEqual(cloud.scheduler, "ENABLED")
        self.assertEqual(cloud.queue, "RUNNING")

    def test_missing_arm_is_zero_write(self):
        cloud = InMemoryCloud()
        with self.assertRaisesRegex(controller.Stop, "not explicitly armed"):
            cloud.execute(dt.datetime(2026, 10, 24, 11, 5, tzinfo=UTC), armed=False)
        self.assertEqual(cloud.actions, [])

    def test_wrong_scheduler_identity_is_zero_write(self):
        cloud = InMemoryCloud()
        cloud.scheduler_target_valid = False
        with self.assertRaisesRegex(controller.Stop, "target or OAuth identity mismatched"):
            cloud.execute(dt.datetime(2026, 10, 24, 11, 5, tzinfo=UTC))
        self.assertEqual(cloud.actions, [])

    def test_permission_failure_leaves_queue_paused_and_scheduler_enabled(self):
        cloud = InMemoryCloud()
        cloud.fail_action = ("run", "services", "update-traffic",
                             "examtree-qs-receiver-prod")
        with self.assertRaisesRegex(controller.Stop, "Rollback incomplete"):
            cloud.execute(dt.datetime(2026, 10, 24, 11, 5, tzinfo=UTC))
        self.assertEqual(cloud.queue, "PAUSED")
        self.assertEqual(cloud.scheduler, "ENABLED")
        self.assertNotIn(("scheduler", "jobs", "pause"),
                         [a[:3] for a in cloud.actions])

    def test_template_permission_denial_still_routes_ready_disabled_baseline(self):
        """A failed approval-toggle cannot strand the known release on live traffic."""
        cloud = InMemoryCloud()
        service = "examtree-qs-receiver-prod"
        cloud.fail_action = ("run", "services", "update", service)
        with self.assertRaisesRegex(controller.Stop, "Rollback incomplete"):
            cloud.execute(dt.datetime(2026, 10, 24, 11, 5, tzinfo=UTC))

        cfg = controller.SERVICES[service]
        self.assertEqual(cloud.queue, "PAUSED")
        self.assertEqual(cloud.dispatch, "false")
        self.assertEqual(cloud.scheduler, "ENABLED")
        self.assertEqual(
            cloud.services[service]["status"]["traffic"],
            [{"percent": 100, "revisionName": cfg["baseline"]}])
        self.assertEqual(
            cloud.services[service]["spec"]["traffic"],
            [{"percent": 100, "revisionName": cfg["baseline"]}])
        actions = [tuple(args[:4]) for args in cloud.actions]
        self.assertIn(("run", "services", "update", service), actions)
        self.assertIn(("run", "services", "update-traffic", service), actions)
        self.assertNotIn(("scheduler", "jobs", "pause", controller.SCHEDULER),
                         actions)
        # Denied template update is not silently treated as a full recovery.
        flags = controller.env_values(controller.template(cloud.services[service]))
        self.assertTrue(any(flags[k] == "true" for k in cfg["off"]))

    def test_image_digest_mismatch_never_routes_unknown_revision(self):
        cloud = InMemoryCloud()
        service = "examtree-universal-prod"
        active = cloud.services[service]["status"]["traffic"][0]["revisionName"]
        cloud.revisions[active]["status"]["imageDigest"] = "wrong@" + "0" * 64
        with self.assertRaisesRegex(controller.Stop, "Rollback incomplete"):
            cloud.execute(dt.datetime(2026, 10, 24, 11, 5, tzinfo=UTC))
        self.assertEqual(cloud.queue, "PAUSED")
        self.assertEqual(cloud.scheduler, "ENABLED")
        self.assertEqual(
            cloud.services[service]["status"]["traffic"][0]["revisionName"], active)

    def test_release_expiry_mismatch_leaves_scheduler_armed_for_response(self):
        cloud = InMemoryCloud()
        service = "examtree-api"
        active = cloud.services[service]["status"]["traffic"][0]["revisionName"]
        rows = cloud.revisions[active]["spec"]["containers"][0]["env"]
        for row in rows:
            if row["name"] == "EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_EXPIRES_AT":
                row["value"] = "2026-10-24T12:00:00Z"
        with self.assertRaisesRegex(controller.Stop, "Rollback incomplete"):
            cloud.execute(dt.datetime(2026, 10, 24, 11, 5, tzinfo=UTC))
        self.assertEqual(cloud.queue, "PAUSED")
        self.assertEqual(cloud.scheduler, "ENABLED")

if __name__ == "__main__":
    unittest.main()
