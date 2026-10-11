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
