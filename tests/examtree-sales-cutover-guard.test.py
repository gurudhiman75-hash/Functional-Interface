import pathlib
import unittest

ROOT=pathlib.Path(__file__).resolve().parents[1]

class SalesPausedCutoverTests(unittest.TestCase):
    def test_sales_write_entrypoints_fail_before_webhooks_router(self):
        app=(ROOT/"artifacts/api-server/src/app.ts").read_text()
        self.assertIn('process.env.EXAMTREE_SALES_DISABLED === "true"',app)
        for path in (
            "/api/commerce/orders", "/api/packages/create-order",
            "/api/billing/razorpay/create-order", "/api/billing/mock-unlock"
        ):
            self.assertIn('"'+path+'"',app)
        self.assertIn('"SALES_TEMPORARILY_UNAVAILABLE"',app)
        self.assertLess(app.index("salesCreationPaths"),app.index('app.post("/api/billing/cashfree/webhook"'))
        self.assertIn('req.method === "POST"',app)

    def test_no_ai_student_bridge_delegates_all_admin_routes(self):
        app=(ROOT/"artifacts/api-server/src/app.ts").read_text()
        ai=(ROOT/"artifacts/api-server/src/lib/ai-providers/index.ts").read_text()
        proxy=(ROOT/"functions/api/[[path]].js").read_text()
        self.assertIn("EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER",app)
        self.assertIn("ADMIN_HANDLED_BY_RENDER_DURING_CUTOVER",app)
        self.assertIn('req.path.startsWith("/api/admin/")',app)
        self.assertIn("temporaryAdminRenderBridge",ai)
        self.assertIn("EXAMTREE_SALES_DISABLED",ai)
        self.assertIn("!temporaryAdminRenderBridge",ai)
        self.assertIn('incoming.pathname.startsWith("/api/admin/")',proxy)
        self.assertIn('url.hostname.startsWith("examtree-api-staging-")',proxy)
        self.assertIn('financialHandoverPath && !financeCloudRunEnabled',proxy)
        self.assertIn('env.EXAMTREE_FINANCE_UPSTREAM === "cloud-run"',proxy)
        self.assertIn('adminCloudRunEnabled &&',proxy)

    def test_catalog_and_frontend_agree_on_sales_paused(self):
        checkout=(ROOT/"artifacts/api-server/src/routes/canonical-commerce-checkout.ts").read_text()
        self.assertIn('salesEnabled: process.env.EXAMTREE_SALES_DISABLED !== "true"', checkout)
        self.assertIn('checkoutProvider: process.env.EXAMTREE_SALES_DISABLED === "true" ? "disabled"', checkout)
        self.assertIn('code: "SALES_TEMPORARILY_UNAVAILABLE"', checkout)
        ui=(ROOT/"artifacts/examtree/src/pages/store-product.tsx").read_text()
        self.assertIn('salesEnabled={productsQuery.data?.salesEnabled !== false}',ui)
        self.assertIn("Purchases temporarily paused",ui)
        types=(ROOT/"artifacts/examtree/src/lib/commerce.ts").read_text()
        self.assertIn('salesEnabled?: boolean',types)
        self.assertIn('"disabled"',types)

    def test_disabled_flag_is_only_opt_in_and_returns_without_writes(self):
        src=(ROOT/"artifacts/api-server/src/routes/canonical-commerce-checkout.ts").read_text()
        start=src.index('router.post("/commerce/orders"')
        stop=src.index("const productId =",start)
        self.assertIn('process.env.EXAMTREE_SALES_DISABLED === "true"',src[start:stop])
        self.assertIn('return;',src[start:stop])
        self.assertIn("commerce-sales-paused.test.mjs",(ROOT/"build-api.sh").read_text())


if __name__=="__main__":
    unittest.main()
