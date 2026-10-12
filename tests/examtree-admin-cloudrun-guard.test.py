import pathlib
import unittest

ROOT=pathlib.Path(__file__).resolve().parents[1]

class AdminCloudRunGuardTest(unittest.TestCase):
    def test_finance_is_independently_protected(self):
        source=(ROOT/'artifacts/api-server/src/app.ts').read_text()
        self.assertIn('FINANCE_HANDLED_BY_RENDER_DURING_CUTOVER',source)
        self.assertIn('req.path.startsWith("/api/admin/commerce/")',source)
        self.assertIn('process.env.EXAMTREE_SALES_DISABLED === "true"',source)
        self.assertLess(source.index('FINANCE_HANDLED_BY_RENDER_DURING_CUTOVER'),source.index('app.use("/api/admin/session"'))

    def test_pages_admin_remains_opt_in(self):
        source=(ROOT/'functions/api/[[path]].js').read_text()
        self.assertIn('env.EXAMTREE_ADMIN_UPSTREAM === "cloud-run"',source)
        self.assertIn('adminFinanceRenderBridge',source)
        self.assertIn('(adminRenderBridge && (!adminCloudRunEnabled || adminFinanceRenderBridge))',source)
        self.assertIn('LEGACY_API_ORIGIN',source)

    def test_admin_preflight_never_displays_secret_value(self):
        source=(ROOT/'scripts/preflight-examtree-cloudrun-admin-cutover.sh').read_text()
        self.assertIn('gcloud secrets describe',source)
        self.assertIn('gcloud secrets versions list',source)
        self.assertNotIn('gcloud secrets versions access',source)
        self.assertIn('EXAMTREE_SALES_DISABLED',source)

if __name__=='__main__':
    unittest.main()
