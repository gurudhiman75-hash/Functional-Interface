from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
WORKER = (ROOT / 'scripts/deploy-examtree-cloudrun-production-question-workers.sh').read_text()
ADMIN = (ROOT / 'scripts/deploy-examtree-cloudrun-admin-zero-traffic.sh').read_text()
SECRET = (ROOT / 'scripts/configure-examtree-cloudrun-admin-provider-secret.sh').read_text()

class AdminRolloutSafetyTest(unittest.TestCase):
    def test_prod_worker_independent(self):
        for literal in ('examtree-trg002-prod', 'examtree-generation-prod',
                        'examtree-question-studio-prod-worker-token',
                        'EXAMTREE_PRODUCTION_WORKERS_APPROVED',
                        'EXAMTREE_BUDGET_READY',
                        'QUESTION_STUDIO_WORKER_TOKEN',
                        '--concurrency=1',
                        '--max-instances=1',
                        'UNAUTH', '401',
                        '"TRG-002"', '"NUM-001"'):
            self.assertIn(literal, WORKER)
        self.assertNotIn('DATABASE_URL=',WORKER)
        self.assertNotIn('EXAMTREE_ADMIN_UPSTREAM=',WORKER)
        self.assertNotIn('gcloud run services update-traffic',WORKER)
        self.assertNotIn('CASHFREE_CLIENT_SECRET=',WORKER)

    def test_admin_is_zero_traffic_and_finance_stays_render(self):
        for literal in (
            'EXAMTREE_PRODUCTION_ADMIN_CANARY_APPROVED',
            'EXAMTREE_BUDGET_READY',
            '--no-traffic --tag=admin-candidate',
            'EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER=false',
            'EXAMTREE_SALES_DISABLED',
            'EXAMTREE_PAYMENT_PROVIDER',
            'GENERATION_JOB_WORKER_ENABLED',
            'OUTBOX_PUBLISHER_ENABLED',
            'FINANCE_HANDLED_BY_RENDER_DURING_CUTOVER',
            "if t.get('revisionName')==old",
            "if t.get('revisionName')==latest",
            'examtree-api-database-url',
            'examtree-question-studio-prod-worker-token',
            'examtree-openai-api-key',
            'QUESTION_STUDIO_TRG002_WORKER_URL',
            'QUESTION_STUDIO_SHARED_WORKER_URL',
        ):
            self.assertIn(literal, ADMIN)
        self.assertNotIn('gcloud run services update-traffic',ADMIN)
        self.assertNotIn('gcloud scheduler jobs',ADMIN)
        self.assertNotIn('CASHFREE_CLIENT_ID=\u0024',ADMIN)
        self.assertNotIn('--set-env-vars',ADMIN)
        self.assertNotIn('--set-secrets',ADMIN)

    def test_provider_secret_has_no_user_visible_key(self):
        for literal in ('read -r -s', 'printf', '--data-file=-',
                        'unset KEY', 'set +x', '[[ -t 0 ]]',
                        'examtree-openai-api-key'):
            self.assertIn(literal, SECRET)
        self.assertNotIn('echo "$KEY"',SECRET)
        self.assertNotIn('gcloud run deploy',SECRET)
        self.assertNotIn('git push',SECRET)

if __name__ == '__main__':
    unittest.main()
