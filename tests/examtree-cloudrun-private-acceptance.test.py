from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
SOURCE=(ROOT/"scripts/verify-examtree-cloudrun-production-private.sh").read_text()

class PrivateProductionAcceptTests(unittest.TestCase):
    def test_readonly_only_target_private_production(self):
        self.assertIn("SERVICE=examtree-api\n",SOURCE)
        self.assertIn("JOB=examtree-api-background\n",SOURCE)
        self.assertIn('gcloud run services proxy "$SERVICE"',SOURCE)
        self.assertIn('gcloud run services get-iam-policy "$SERVICE"',SOURCE)
        self.assertIn("examtree-api-database-url",SOURCE)
        self.assertNotIn("examtree-api-staging-database-url",SOURCE)
        self.assertIn("EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER",SOURCE)
        self.assertIn("EXAMTREE_SALES_DISABLED",SOURCE)
        self.assertIn("SALES_TEMPORARILY_UNAVAILABLE",SOURCE)
        self.assertIn("ADMIN_HANDLED_BY_RENDER_DURING_CUTOVER",SOURCE)
        self.assertIn('assert jobc.get("command")==["/usr/bin/false"]',SOURCE)

    def test_no_credentials_or_side_effects(self):
        for bad in ("gcloud run deploy","gcloud run services update",
                    "gcloud run jobs execute","gcloud scheduler jobs create",
                    "gcloud scheduler jobs run","gcloud secrets versions access",
                    "gcloud run services add-iam-policy-binding",
                    "gcloud run services update-traffic","EXAMTREE_API_UPSTREAM_ORIGIN=",
                    "cashfree.com","DATABASE_URL="):
            self.assertNotIn(bad,SOURCE,bad)
        self.assertIn("gcloud run services proxy",SOURCE)
        self.assertIn("'Content-Type: application/json' -X POST -d '{}'",SOURCE)
        self.assertIn("trap cleanup EXIT",SOURCE)
        self.assertIn("set -euo pipefail",SOURCE)

if __name__=="__main__":
    unittest.main()
