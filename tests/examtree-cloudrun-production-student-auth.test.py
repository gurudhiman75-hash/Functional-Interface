from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=(ROOT/"scripts/verify-examtree-cloudrun-production-student-auth.sh").read_text()

class PrivateProductionStudentAuth(unittest.TestCase):
    def test_exact_production_target_and_two_token_separation(self):
        for good in (
            'SERVICE=examtree-api\n','REGION=asia-south1',
            'read -r -s -p', 'gcloud auth print-identity-token',
            'X-Serverless-Authorization: Bearer %s',
            'Authorization: Bearer %s',
            'curl --config -', '--request GET',
            '/api/users/me/profile', '/api/commerce/purchases',
            'ADMIN_HANDLED_BY_RENDER_DURING_CUTOVER',
            'trap cleanup EXIT', 'p.get("aud")=="sarbedutech"',
            'p["exp"]>now+120', 'signature checked by server',
            'diagnose_status()', 'IAM_TOKEN=\'\''):
            self.assertIn(good,SCRIPT,good)
        for bad in (
            'SERVICE=examtree-api-staging', 'echo "$TOKEN"',
            'curl --header "Authorization:', 'set -x',
            'EXAMTREE_API_UPSTREAM_ORIGIN=',
            'gcloud run services proxy'):
            self.assertNotIn(bad,SCRIPT,bad)

    def test_only_read_requests_no_mutations_or_token_leaks(self):
        for bad in (
            '--request POST','--request PUT','--request PATCH',
            '--request DELETE','gcloud run deploy',
            'gcloud run services update','gcloud run jobs execute',
            'gcloud scheduler jobs create','gcloud secrets versions access',
            'createCashfreeRefund','gcloud run services add-iam-policy-binding',
            '"$TOKEN" "$URL"', '--dump-header',
            'cat "$TMP/response"'):
            self.assertNotIn(bad,SCRIPT,bad)
        self.assertIn('existing disposable STUDENT Firebase ID token',SCRIPT)
        self.assertIn('Firebase auth GET can update disposable-student identity mapping',SCRIPT)
        self.assertIn('TOKEN=\'\'',SCRIPT)
        self.assertIn('Never dump response body or user data',SCRIPT)

if __name__=="__main__":
    unittest.main()
