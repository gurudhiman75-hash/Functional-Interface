#!/usr/bin/env python3
"""Offline regression tests; no gcloud, network or secret access."""
import copy
import unittest
from qs_prod_serving_revision import serving_revision_name, verify_serving_revision

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

    def test_unsafe_serving_revision_rejected(self):
        cases = []
        for change in ("split", "wrong_service", "not_ready", "missing_revision",
                       "image", "identity", "approval", "secret", "command", "duplicate"):
            service, revision = fixture()
            if change == "split":
                service["status"]["traffic"].append({"revisionName": CREATED_RETIRED, "percent": 0})
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

if __name__ == "__main__":
    unittest.main()
