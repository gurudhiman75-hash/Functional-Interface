import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
PATH = ROOT / "scripts/validate-examtree-production-neon-url.py"
spec = importlib.util.spec_from_file_location("neon_prod", PATH)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
PRODUCTION = ("postgresql://prod:example_secret@" + m.PRODUCTION_HOST
              + "/neondb?sslmode=require&channel_binding=require")


class ProductionCandidateSafetyTests(unittest.TestCase):
    def test_main_neon_connection_only(self):
        self.assertTrue(m.validate(PRODUCTION)[0])
        self.assertFalse(m.validate(PRODUCTION.replace(m.PRODUCTION_HOST, m.STAGING_HOST))[0])
        self.assertFalse(m.validate(PRODUCTION.replace(m.PRODUCTION_HOST,
                                "ep-polished-king-atj47i5y-pooler.c-9.us-east-1.aws.neon.tech"))[0])
        self.assertFalse(m.validate(PRODUCTION.replace("/neondb", "/postgres"))[0])
        self.assertFalse(m.validate(PRODUCTION.replace("sslmode=require", "sslmode=disable"))[0])
        self.assertFalse(m.validate("psql '" + PRODUCTION + "'")[0])

    def test_safe_reason_does_not_expose_connection_string(self):
        for candidate in (PRODUCTION, "postgresql://prod:example_secret@evil.example/neondb?sslmode=require"):
            ok, reason = m.validate(candidate)
            self.assertNotIn("example_secret", reason)

    def test_explicit_cost_and_deployment_consent(self):
        s = (ROOT / "scripts/deploy-examtree-api-cloudrun-production-candidate.sh").read_text()
        self.assertIn("EXAMTREE_PRODUCTION_CANDIDATE_APPROVED", s)
        self.assertIn("EXAMTREE_BUDGET_READY", s)
        self.assertIn("validate-examtree-production-neon-url.py", s)
        self.assertLess(s.index("validate-examtree-production-neon-url.py"),
                        s.index("gcloud builds submit"))
        self.assertIn('SERVICE=examtree-api', s)
        self.assertIn('JOB=examtree-api-background', s)
        self.assertIn("--no-allow-unauthenticated", s)
        self.assertIn("allUsers", s)
        self.assertIn("allAuthenticatedUsers", s)
        self.assertIn("--command=/usr/bin/false", s)
        self.assertIn("EXAMTREE_API_STAGING=false", s)
        self.assertIn("CASHFREE_ENV=production", s)
        self.assertIn("OUTBOX_PUBLISHER_ENABLED=false", s)
        self.assertIn("GENERATION_JOB_WORKER_ENABLED=false", s)
        self.assertIn("examtree-cashfree-production-client-secret", s)
        self.assertIn("examtree-cashfree-production-client-id", s)
        self.assertIn("examtree-openai-api-key", s)
        for forbidden in (
            "gcloud run jobs execute", "gcloud scheduler jobs create",
            "gcloud run services update-traffic",
            "EXAMTREE_API_UPSTREAM_ORIGIN=", "gcloud run services delete",
            "gcloud secrets versions add", "gcloud scheduler jobs run",
        ):
            self.assertNotIn(forbidden, s)


if __name__ == "__main__":
    unittest.main()
