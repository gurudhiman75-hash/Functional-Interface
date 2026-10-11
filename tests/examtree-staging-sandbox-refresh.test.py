import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/refresh-examtree-cloudrun-staging-sandbox.sh"

class StagingSandboxRefreshSafetyTests(unittest.TestCase):
    def test_only_staging_resource_names_and_no_live_credentials(self):
        s = SCRIPT.read_text()
        self.assertIn("SERVICE=examtree-api-staging", s)
        self.assertIn("JOB=examtree-api-background-staging", s)
        self.assertIn("examtree-api-staging-database-url", s)
        self.assertIn("examtree-cashfree-sandbox-client-id", s)
        self.assertIn("examtree-cashfree-sandbox-client-secret", s)
        self.assertIn('values.get("CASHFREE_ENV")=="sandbox"', s)
        self.assertIn('values.get("EXAMTREE_API_STAGING")=="true"', s)
        self.assertIn('values.get("OUTBOX_PUBLISHER_ENABLED")=="false"', s)
        self.assertIn('values.get("GENERATION_JOB_WORKER_ENABLED")=="false"', s)
        self.assertNotIn("examtree-cashfree-production-client", s)
        self.assertNotIn("examtree-openai-api-key", s)
        self.assertNotIn("CASHFREE_ENV=production", s)
        self.assertNotIn('SERVICE=examtree-api\n', s)

    def test_requires_cost_and_staging_approval(self):
        s = SCRIPT.read_text()
        self.assertIn("EXAMTREE_STAGING_SANDBOX_REFRESH_APPROVED", s)
        self.assertIn("EXAMTREE_BUDGET_READY", s)
        self.assertIn("git rev-parse origin/New-main", s)
        self.assertLess(s.index("check_staging\ncheck_inert_job"),
                        s.index("gcloud builds submit"))
        self.assertLess(s.index("check_inert_job\n\nREVISION"),
                        s.index("gcloud builds submit"))

    def test_update_image_only_without_touching_job_or_production(self):
        s = SCRIPT.read_text()
        self.assertIn('--image="$IMAGE" --quiet', s)
        self.assertIn('assert cmd==["/usr/bin/false"]', s)
        self.assertIn("check_staging\ncheck_inert_job\nURL=", s)
        for forbidden in (
            "gcloud run jobs deploy ", "gcloud run jobs update ",
            "gcloud run jobs execute ", "gcloud scheduler jobs create",
            "gcloud run services update-traffic", "--set-env-vars",
            "--set-secrets", "--update-env-vars", "--update-secrets",
            "gcloud secrets versions access", "gcloud secrets versions add",
            "EXAMTREE_API_UPSTREAM_ORIGIN=", "gcloud run services delete",
        ):
            self.assertNotIn(forbidden, s, forbidden)

    def test_nonmutating_get_health_and_catalogue_only(self):
        s=SCRIPT.read_text()
        self.assertIn('"$URL/health"', s)
        self.assertIn('"$URL/api/commerce/products"', s)
        self.assertNotIn("curl --data", s)
        self.assertNotIn("curl --request POST", s)
        self.assertNotIn("api/billing/cashfree/webhook", s)


if __name__ == "__main__":
    unittest.main()
