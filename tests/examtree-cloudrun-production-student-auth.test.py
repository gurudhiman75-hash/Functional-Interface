from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=(ROOT/"scripts/verify-examtree-cloudrun-production-student-auth.sh").read_text()

class PrivateProductionStudentAuth(unittest.TestCase):
    def test_exact_production_target_and_hidden_input(self):
        for good in ('SERVICE=examtree-api\n', 'REGION=asia-south1',
                     'read -r -s -p', 'gcloud run services proxy "$SERVICE"',
                     "printf 'header = \"Authorization: Bearer %s\"",
                     'curl --config -', '--request GET',
                     '/api/users/me/profile', '/api/commerce/purchases',
                     'ADMIN_HANDLED_BY_RENDER_DURING_CUTOVER', 'trap cleanup EXIT'):
            self.assertIn(good,SCRIPT,good)
        for bad in ('SERVICE=examtree-api-staging', 'echo "$TOKEN"',
                    'curl --header "Authorization:', 'set -x',
                    'EXAMTREE_API_UPSTREAM_ORIGIN='):
            self.assertNotIn(bad,SCRIPT,bad)

    def test_only_read_requests_and_no_mutations(self):
        for bad in ('--request POST','--request PUT','--request PATCH',
                    '--request DELETE','gcloud run deploy',
                    'gcloud run services update','gcloud run jobs execute',
                    'gcloud scheduler jobs create','gcloud secrets versions access',
                    'createCashfreeRefund','gcloud run services add-iam-policy-binding'):
            self.assertNotIn(bad,SCRIPT,bad)
        self.assertIn('existing disposable STUDENT Firebase ID token',SCRIPT)
        self.assertIn('Firebase authentication GET can update identity mapping',SCRIPT)
        self.assertIn('TOKEN=\'\'',SCRIPT)

if __name__=="__main__":
    unittest.main()
