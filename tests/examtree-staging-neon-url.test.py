import importlib.util
import io
from pathlib import Path
import unittest
from contextlib import redirect_stderr

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "scripts/validate-examtree-staging-neon-url.py"
spec = importlib.util.spec_from_file_location("neon_staging_validator", PATH)
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)

DIRECT = validator.STAGING_HOST
URL = f"postgresql://staging_role:example_encoded_password@{DIRECT}/neondb?sslmode=require&channel_binding=require"

class NeonUrlSafetyTests(unittest.TestCase):
    def assertDenied(self, url, error_prefix):
        ok, reason = validator.check_connection_string(url)
        self.assertFalse(ok)
        self.assertTrue(reason.startswith(error_prefix), reason)
        self.assertNotIn("example_encoded_password", reason)

    def test_valid_direct_stage_url(self):
        self.assertTrue(validator.check_connection_string(URL)[0])
        self.assertTrue(validator.check_connection_string(
            URL.replace("sslmode=require", "sslmode=verify-full"))[0])
        self.assertTrue(validator.check_connection_string(
            URL.replace("/neondb?", ":5432/neondb?"))[0] is False)  # malformed host/port
        self.assertTrue(validator.check_connection_string(
            URL.replace(f"@{DIRECT}/", f"@{DIRECT}:5432/"))[0])

    def test_refuse_production_and_poolers(self):
        self.assertDenied(URL.replace(DIRECT, validator.PRODUCTION_HOST), "PRODUCTION_BLOCKED")
        self.assertDenied(URL.replace(DIRECT, validator.PRODUCTION_POOLER_HOST), "PRODUCTION_BLOCKED")
        self.assertDenied(URL.replace(DIRECT, validator.STAGING_POOLER_HOST), "POOLER_HOST")
        self.assertDenied(URL.replace(DIRECT, "not-the-staging-branch.neon.tech"), "WRONG_ENDPOINT")

    def test_diagnostic_covers_neon_ui_copy_modes(self):
        self.assertDenied("psql '" + URL + "'", "FULL_COMMAND_OR_QUOTES")
        self.assertDenied("'" + URL + "'", "FULL_COMMAND_OR_QUOTES")
        self.assertDenied(URL.replace("/neondb?", "/postgres?"), "DATABASE_NAME")
        self.assertDenied(URL.replace("?sslmode=require", "?sslmode=disable"), "TLS")
        self.assertDenied(URL.replace("?sslmode=require", "?foo=bar"), "TLS")
        self.assertDenied(URL.replace("staging_role:example_encoded_password@", "staging_role@"), "MISSING_CREDENTIALS")
        self.assertDenied("  ", "EMPTY_INPUT")

    def test_gate_is_shared_and_runs_before_mutations(self):
        isolate = (ROOT / "scripts/isolate-examtree-cloudrun-staging-neon.sh").read_text()
        deploy = (ROOT / "scripts/deploy-examtree-api-cloudrun-staging.sh").read_text()
        self.assertIn("validate-examtree-staging-neon-url.py", isolate)
        self.assertIn("validate-examtree-staging-neon-url.py", deploy)
        self.assertLess(isolate.index("validate-examtree-staging-neon-url.py"),
                        isolate.index("gcloud secrets versions add"))
        self.assertLess(deploy.index("validate-examtree-staging-neon-url.py"),
                        deploy.index("gcloud builds submit"))

if __name__ == "__main__":
    unittest.main()
