#!/usr/bin/env python3
"""Offline regression tests; no gcloud, network or secret access."""
import copy
import unittest
from qs_prod_serving_revision import (serving_revision_name, verify_serving_revision,
                                     verify_pinned_disabled_revision)

SERVICE = "examtree-universal-prod"
IMAGE = "asia-south1-docker.pkg.dev/sarbedutech/qs/test@sha256:" + "1" * 64
SA = "examtree-qs-worker-prod@sarbedutech.iam.gserviceaccount.com"
LIVE = SERVICE + "-00005-ab1"
CREATED_RETIRED = SERVICE + "-00006-cd2"

def fixture():
    spec = {"serviceAccountName": SA, "containers": [{
        "image": IMAGE,
        "env": [
            {"name": "EXAMTREE_QS_PRODUCTION_WORKER_APPROVED", "value": "false"},
            {"name": "QUESTION_STUDIO_WORKER_TOKEN",
             "valueFrom": {"secretKeyRef": {"name": "worker-token", "key": "latest"}}}
        ]
    }]}
    service = {
        "spec": {"template": {"spec": copy.deepcopy(spec)}},
        "status": {"latestCreatedRevisionName": CREATED_RETIRED,
                   "latestReadyRevisionName": LIVE,
                   "traffic": [{"revisionName": LIVE, "percent": 100}]}
    }
    revision = {"metadata": {"name": LIVE}, "spec": copy.deepcopy(spec),
                "status": {"conditions": [{"type": "Ready", "status": "True"}]}}
    return service, revision

class ServingRevisionTests(unittest.TestCase):
    def test_retired_zero_traffic_latest_created_does_not_block(self):
        service, revision = fixture()
        self.assertEqual(verify_serving_revision(service, revision, SERVICE), LIVE)

    def test_equal_ready_and_created_also_passes(self):
        service, revision = fixture()
        service["status"]["latestCreatedRevisionName"] = LIVE
        self.assertEqual(verify_serving_revision(service, revision, SERVICE), LIVE)

    def test_zero_traffic_tagged_candidate_does_not_block_serving_revision(self):
        service, revision = fixture()
        service["status"]["traffic"].append({
            "revisionName": CREATED_RETIRED,
            "percent": 0,
            "tag": "qs-chapter-candidate",
            "url": "https://candidate.example.run.app",
        })
        self.assertEqual(verify_serving_revision(service, revision, SERVICE), LIVE)

    def test_unsafe_serving_revision_rejected(self):
        cases = []
        for change in ("split", "wrong_service", "not_ready", "missing_revision",
                       "image", "identity", "approval", "secret", "command", "duplicate"):
            service, revision = fixture()
            if change == "split":
                service["status"]["traffic"].append({"revisionName": CREATED_RETIRED, "percent": 1})
            elif change == "wrong_service":
                service["status"]["traffic"][0]["revisionName"] = "unrelated-00001"
            elif change == "not_ready":
                revision["status"]["conditions"][0]["status"] = "False"
            elif change == "missing_revision":
                revision["metadata"]["name"] = "other"
            elif change == "image":
                revision["spec"]["containers"][0]["image"] = "other"
            elif change == "identity":
                revision["spec"]["serviceAccountName"] = "other"
            elif change == "approval":
                revision["spec"]["containers"][0]["env"][0]["value"] = "true"
            elif change == "secret":
                revision["spec"]["containers"][0]["env"][1]["valueFrom"]["secretKeyRef"]["name"] = "other"
            elif change == "command":
                revision["spec"]["containers"][0]["command"] = ["sh"]
            elif change == "duplicate":
                revision["spec"]["containers"][0]["env"].append(
                    copy.deepcopy(revision["spec"]["containers"][0]["env"][0]))
            cases.append((change, service, revision))
        for change, service, revision in cases:
            with self.subTest(change=change), self.assertRaises(ValueError):
                verify_serving_revision(service, revision, SERVICE)

    def test_empty_or_unnamed_traffic_rejected(self):
        service, _ = fixture()
        service["status"]["traffic"] = []
        with self.assertRaises(ValueError):
            serving_revision_name(service, SERVICE)


class PinnedDisabledRevisionTests(unittest.TestCase):
    def pinned_fixture(self):
        service, revision = fixture()
        service["spec"]["traffic"] = [{"revisionName": LIVE, "percent": 100}]
        revision["status"]["imageDigest"] = IMAGE
        service["spec"]["template"]["spec"]["containers"][0]["image"] = IMAGE[:-64] + "2" * 64
        return service, revision

    def test_staged_candidate_can_differ_from_pinned_disabled_image(self):
        service, revision = self.pinned_fixture()
        self.assertEqual(verify_pinned_disabled_revision(service, revision, SERVICE, LIVE, SA), LIVE)

    def test_unsafe_pin_or_configuration_is_rejected(self):
        for change in ("wrong_pin", "latest", "desired_split", "unready", "digest",
                       "template_approval", "live_approval", "identity", "secret"):
            service, revision = self.pinned_fixture()
            if change == "wrong_pin":
                service["status"]["traffic"][0]["revisionName"] = CREATED_RETIRED
            elif change == "latest":
                service["spec"]["traffic"][0]["latestRevision"] = True
            elif change == "desired_split":
                service["spec"]["traffic"].append({"revisionName": CREATED_RETIRED, "percent": 1})
            elif change == "unready":
                revision["status"]["conditions"][0]["status"] = "False"
            elif change == "digest":
                revision["status"]["imageDigest"] = "latest"
            elif change in ("template_approval", "live_approval"):
                spec = service["spec"]["template"]["spec"] if change == "template_approval" else revision["spec"]
                spec["containers"][0]["env"][0]["value"] = "true"
            elif change == "identity":
                revision["spec"]["serviceAccountName"] = "other"
            elif change == "secret":
                revision["spec"]["containers"][0]["env"][1]["valueFrom"]["secretKeyRef"]["name"] = "other"
            with self.subTest(change=change), self.assertRaises(ValueError):
                verify_pinned_disabled_revision(service, revision, SERVICE, LIVE, SA)


class ProductionPreflightIntegrationTests(unittest.TestCase):
    """Exercise the real preflight with mocked gcloud, not just the helper."""

    def test_full_preflight_allows_retired_latest_created_and_stays_read_only(self):
        import importlib.util
        import pathlib
        from types import SimpleNamespace
        from unittest.mock import patch

        path = pathlib.Path(__file__).with_name("prepare-qs-prod-disabled-only.py")
        spec = importlib.util.spec_from_file_location("prod_disabled_preflight", path)
        self.assertIsNotNone(spec)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        calls = []

        def make_service(name, sa, env):
            image = "asia-south1-docker.pkg.dev/sarbedutech/qs/" + name + "@sha256:" + "1" * 64
            serving = module.DISABLED_BASELINES[name]
            template = {"serviceAccountName": sa,
                        "containers": [{"image": image, "env": env}]}
            service = {
                "spec": {"template": {"spec": copy.deepcopy(template)},
                         "traffic": [{"revisionName": serving, "percent": 100}]},
                "status": {
                    "url": "https://" + name + "-example-uc.a.run.app",
                    "latestCreatedRevisionName": name + "-00011-retired",
                    "latestReadyRevisionName": serving,
                    "traffic": [
                        {"revisionName": serving, "percent": 100},
                        {"revisionName": name + "-00011-retired", "percent": 0,
                         "tag": "qs-chapter-candidate",
                         "url": "https://candidate.example.run.app"},
                    ],
                },
            }
            revision = {
                "metadata": {"name": serving},
                "spec": copy.deepcopy(template),
                "status": {"conditions": [{"type": "Ready", "status": "True"}],
                           "imageDigest": image},
            }
            # A no-traffic candidate is allowed to stage a different image.
            service["spec"]["template"]["spec"]["containers"][0]["image"] = image[:-64] + "2" * 64
            return service, revision

        secret = lambda name: {"name": name, "valueFrom": {
            "secretKeyRef": {"name": name, "key": "latest"}}}
        receiver, receiver_revision = make_service(
            module.RECEIVER, module.RECEIVER_SA, [
                {"name": "EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED", "value": "false"},
                {"name": "EXAMTREE_QUESTION_STUDIO_TASK_SERVICE_ACCOUNT",
                 "value": module.TASK_SA},
                {"name": "EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE",
                 "value": "https://" + module.RECEIVER + "-example-uc.a.run.app"},
                {"name": "QUESTION_STUDIO_UNIVERSAL_WORKER_URL",
                 "value": "https://" + module.WORKER + "-example-uc.a.run.app"},
                secret("QUESTION_STUDIO_WORKER_TOKEN"),
            ])
        # The secret reference's ENV name differs from its Secret Manager name.
        receiver["spec"]["template"]["spec"]["containers"][0]["env"][-1]["valueFrom"]["secretKeyRef"]["name"] = module.WORKER_SECRET
        receiver_revision["spec"]["containers"][0]["env"][-1]["valueFrom"]["secretKeyRef"]["name"] = module.WORKER_SECRET

        worker, worker_revision = make_service(
            module.WORKER, module.WORKER_SA, [
                {"name": "EXAMTREE_QS_PRODUCTION_WORKER_APPROVED", "value": "false"},
                secret("QUESTION_STUDIO_WORKER_TOKEN"),
            ])
        worker["spec"]["template"]["spec"]["containers"][0]["env"][-1]["valueFrom"]["secretKeyRef"]["name"] = module.WORKER_SECRET
        worker_revision["spec"]["containers"][0]["env"][-1]["valueFrom"]["secretKeyRef"]["name"] = module.WORKER_SECRET
        docs = {
            module.RECEIVER: (receiver, receiver_revision, module.TASK_SA),
            module.WORKER: (worker, worker_revision, module.RECEIVER_SA),
        }

        def fake_cloud(args, *, json_result=False, sensitive=False):
            calls.append(args)
            if args[:2] == ["projects", "describe"]:
                return {"projectNumber": module.N}
            if args[:2] == ["projects", "get-iam-policy"]:
                return {"bindings": [{"role": "roles/cloudtasks.serviceAgent",
                                     "members": ["serviceAccount:" + module.AGENT_SA]}]}
            if args[:3] == ["tasks", "queues", "describe"]:
                return {"state": "PAUSED", "rateLimits": {"maxConcurrentDispatches": 1},
                        "retryConfig": {"maxAttempts": 3}}
            if args[:2] == ["iam", "service-accounts"]:
                return {"email": args[2]}
            if args[:3] == ["run", "services", "describe"]:
                return docs[args[3]][0]
            if args[:3] == ["run", "revisions", "describe"]:
                return next(revision for svc, revision, caller in docs.values()
                            if revision["metadata"]["name"] == args[3])
            if args[:3] == ["run", "services", "get-iam-policy"]:
                return {"bindings": [{"role": "roles/run.invoker",
                                     "members": ["serviceAccount:" + docs[args[3]][2]]}]}
            if args[:3] == ["run", "jobs", "describe"]:
                return {"spec": {"template": {"spec": {
                    "taskCount": 1, "template": {"spec": {
                        "maxRetries": 0,
                        "serviceAccountName": module.DISPATCH_SA,
                        "containers": [{"env": [
                            {"name": "EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED", "value": "false"}]}]}}}}}}
            if args[:3] == ["scheduler", "jobs", "list"]:
                return [{"name": "projects/sarbedutech/locations/asia-south1/jobs/examtree-qs-prod-canary-cleanup-trigger",
                         "state": "PAUSED"}]
            if args[:2] == ["secrets", "describe"]:
                return {"name": "projects/sarbedutech/secrets/" + args[2]}
            if args[:3] == ["secrets", "versions", "access"]:
                self.assertTrue(sensitive)
                return ("postgresql://test:never-print-password@"
                        "ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require")
            raise AssertionError("Unexpected GCP query: " + str(args))

        fake_config = SimpleNamespace(returncode=0, stdout="sarbedutech\n")
        with (patch.object(module, "cloud", side_effect=fake_cloud),
             patch.object(module.subprocess, "run", return_value=fake_config)):
            result = module.check_preflight()
        self.assertIsInstance(result, dict)
        self.assertTrue(any(x[:3] == ["run", "revisions", "describe"] for x in calls))
        self.assertFalse(any(x[1] in {"update", "execute", "resume", "deploy", "create",
                                      "delete", "set-iam-policy", "add-iam-policy-binding"}
                             for x in calls if len(x) > 1))

    def test_preflight_rejects_unknown_service_url_instead_of_crashing(self):
        import pathlib
        source = pathlib.Path(__file__).with_name(
            "prepare-qs-prod-disabled-only.py").read_text()
        self.assertIn('status=d.get("status") or {}', source)
        self.assertIn('ensure((status.get("url") or "").startswith', source)

if __name__ == "__main__":
    unittest.main()
