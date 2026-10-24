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

class ServiceAccountIdTests(unittest.TestCase):
    def test_scheduler_service_account_id_within_google_limits(self):
        account_id, domain = mod.SCHEDULER_ID.split("@", 1)
        self.assertTrue(6 <= len(account_id) <= 30)
        self.assertRegex(account_id, r"^[a-z][a-z0-9-]*[a-z0-9]$")
        self.assertEqual(domain, "sarbedutech.iam.gserviceaccount.com")

    def test_all_baseline_runtime_account_ids_within_google_limits(self):
        for service, config in mod.SERVICES.items():
            with self.subTest(service=service):
                account_id, domain = config["sa"].split("@", 1)
                self.assertTrue(6 <= len(account_id) <= 30)
                self.assertRegex(account_id, r"^[a-z][a-z0-9-]*[a-z0-9]$")
                self.assertEqual(domain, "sarbedutech.iam.gserviceaccount.com")


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

    def test_release_candidate_digests_match_verified_oct24_refreshed_images(self):
        # Verified by the operator from Artifact Registry after the exact
        # four-component Cloud Build at commit c9c121840b5a208b4e824de9e344bbf8ae41d41e.
        expected = {
            "examtree-api":
                "sha256:ce2c9e0f830328e1d1e2250deeab94025fcc03fa45ef56ce35555606509d321b",
            "examtree-qs-receiver-prod":
                "sha256:8883e47d2be1dd9b1fe5049c16fca6771851948fc88bbdb118932a0ebb62d827",
            "examtree-universal-prod":
                "sha256:6cb4ae006558142f644b63029bf7b3396e1a71ae73693ba282b352832bc3acb3",
        }
        self.assertEqual({name: cfg["digest"] for name, cfg
                          in mod.SERVICES.items()}, expected)

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
    def test_chapter_job_has_separate_exact_approval(self):
        self.assertEqual(mod.CHAPTER_DISPATCHER, "examtree-qs-chapter-dispatch-prod")
        expected = {
            "spec": {"template": {"spec": {"template": {"spec": {
                "containers": [{"env": [
                    {"name": "EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_APPROVED",
                     "value": "false"}]}]}}}}}}
        with patch.object(mod, "fetch", return_value=expected) as read:
            self.assertEqual(mod.chapter_dispatcher_approved(), "false")
            self.assertEqual(read.call_args.args[:4],
                             ("run", "jobs", "describe", mod.CHAPTER_DISPATCHER))

    def test_exactly_two_distinct_production_queues_pinned(self):
        self.assertEqual(mod.QUEUES,
                         ("examtree-qs-prod", "examtree-qs-chapter-prod"))
        self.assertEqual(len(set(mod.QUEUES)), 2)

    def test_dual_queue_pause_then_failure_never_pauses_scheduler(self):
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
             patch.object(mod, "chapter_dispatcher_approved", return_value="false"), \
             patch.object(mod, "validate_service", side_effect=mod.Stop("wrong release")):
            with self.assertRaisesRegex(mod.Stop, "Rollback incomplete"):
                mod.perform_rollback()
            self.assertEqual(reads, 4)
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
             patch.object(mod, "chapter_dispatcher_approved", return_value="false"), \
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


class SanitizedCloudErrorTests(unittest.TestCase):
    def test_known_failure_classes_have_no_sensitive_text(self):
        examples = {
            "Permission 'artifactregistry.repositories.downloadArtifacts' denied on resource projects/123/secrets/private": "ARTIFACT_REGISTRY_DOWNLOAD_DENIED",
            "Permission iam.serviceAccounts.actAs denied for service account secret@example.com": "SERVICE_ACCOUNT_ACTAS_DENIED",
            "Permission 'secretmanager.versions.access' denied": "SECRET_MANAGER_ACCESS_DENIED",
            "Permission 'run.services.update' denied on resource secret://name": "IAM_PERMISSION_DENIED",
            "Cannot update service while another operation is already in progress": "CONCURRENT_UPDATE",
            "ERROR: (gcloud.run.services.update) unrecognized arguments: --secret-token=abc": "CLI_ARGUMENT_REJECTED",
            "Revision examtree-test-00002 is not ready": "REVISION_NOT_READY",
            "ResourceExhausted: quota": "QUOTA_OR_CAPACITY",
            "Some unknown error involving password=private_value": "UNCLASSIFIED",
        }
        for raw, expected in examples.items():
            with self.subTest(expected=expected):
                category = mod.safe_cli_failure_class(raw)
                self.assertEqual(category, expected)
                self.assertNotIn("private", category)
                self.assertNotIn("abc", category)

    def test_failed_cli_never_exposes_raw_stderr_or_stdout(self):
        from subprocess import CompletedProcess
        sensitive = "Permission 'run.services.update' denied; bearer_token=DO_NOT_EXPOSE"
        process = CompletedProcess(
            ["gcloud"], 1, stdout="secret=DO_NOT_EXPOSE",
            stderr=sensitive)
        with patch.object(mod.subprocess, "run", return_value=process):
            with self.assertRaises(mod.Stop) as raised:
                mod.command("run", "services", "update", "examtree-qs-receiver-prod")
        msg = str(raised.exception)
        self.assertIn("category=IAM_PERMISSION_DENIED", msg)
        self.assertIn("exit=1", msg)
        self.assertNotIn("DO_NOT_EXPOSE", msg)
        self.assertNotIn("bearer_token", msg)


    def test_reports_only_allowlisted_permission_from_cli(self):
        cases = [
            ("Permission 'run.services.update' denied on resource //sensitive/123",
             "run.services.update"),
            ("PERMISSION_DENIED: Permission 'secretmanager.versions.access' denied",
             "secretmanager.versions.access"),
            ("Permission 'run.services.updateToken_SENSITIVE' denied",
             "NOT_SPECIFIED"),
            ("Permission 'secrets.private_password' denied",
             "NOT_SPECIFIED"),
            ("RPC says 403 Forbidden, unknown permission",
             "NOT_SPECIFIED"),
            ("Revision has an unrelated run.services.update message",
             "NOT_SPECIFIED"),
            ("Update failed, nothing else", "NOT_SPECIFIED"),
        ]
        for stderr, expected in cases:
            with self.subTest(expected=expected, stderr=stderr):
                self.assertEqual(mod.safe_denied_permission(stderr), expected)

    def test_command_reports_known_permission_without_resource_ids(self):
        from subprocess import CompletedProcess
        stdout = "password=DO_NOT_EXPOSE"
        stderr = ("Permission 'iam.serviceAccounts.actAs' denied on "
                  "//iam.googleapis.com/projects/private/secret/DO_NOT_EXPOSE")
        result = CompletedProcess(["gcloud"], 1, stdout=stdout, stderr=stderr)
        with patch.object(mod.subprocess, "run", return_value=result):
            with self.assertRaises(mod.Stop) as raised:
                mod.command("run", "services", "update", "examtree-qs-receiver-prod")
        msg = str(raised.exception)
        self.assertIn("permission=iam.serviceAccounts.actAs", msg)
        self.assertNotIn("DO_NOT_EXPOSE", msg)
        self.assertNotIn("//iam.googleapis.com/", msg)

if __name__ == "__main__":
    unittest.main()
