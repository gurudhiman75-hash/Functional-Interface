import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const checks = [];
const requireText = (path, text, label) => {
  const content = read(path);
  checks.push([label, content.includes(text)]);
};
const requirePattern = (path, pattern, label) => {
  const content = read(path);
  checks.push([label, pattern.test(content)]);
};
const rejectText = (path, text, label) => {
  const content = read(path);
  checks.push([label, !content.includes(text)]);
};

const apiIndex = 'artifacts/api-server/src/routes/index.ts';
const orders = 'artifacts/api-server/src/routes/admin-commerce-orders.ts';
const checkout = 'artifacts/api-server/src/routes/canonical-commerce-checkout.ts';
const webhook = 'artifacts/api-server/src/routes/billing-webhook.ts';
const access = 'artifacts/api-server/src/lib/canonical-commerce-entitlements.ts';
const analytics = 'artifacts/api-server/src/routes/admin-business-analytics.ts';
const app = 'artifacts/admin-app/src/App.tsx';
const nav = 'artifacts/admin-app/src/app/nav/navigation.ts';

requireText(apiIndex, 'router.use("/admin/commerce/products", adminCommerceProductsRouter)', 'products API mounted');
requireText(apiIndex, 'router.use("/admin/commerce/orders", adminCommerceOrdersRouter)', 'orders API mounted');
requireText(apiIndex, 'router.use("/admin/commerce/coupons", adminCommerceCouponsRouter)', 'coupons API mounted');
requireText(apiIndex, 'router.use("/admin/commerce/entitlements", adminCommerceEntitlementsRouter)', 'entitlements API mounted');
requireText(apiIndex, 'router.use("/admin/analytics", adminBusinessAnalyticsRouter)', 'business analytics mounted');
requireText(checkout, 'pricingSnapshot', 'server-side frozen pricing snapshot');
requireText(webhook, 'validateWebhookSignature', 'provider webhook signature validation');
requireText(webhook, 'ON CONFLICT (provider, provider_event_id) DO NOTHING', 'provider event idempotency');
requireText(access, 'paidAccessRequired', 'paid-test access evaluation');
requireText(orders, 'commerce.refund.requested', 'refund audit event');
requireText(orders, 'LEFT JOIN LATERAL', 'order ledger aggregation isolation');
rejectText(orders, 'SUM(DISTINCT r.amount_minor)', 'no equal-value refund undercount');
requireText(analytics, 'WITH paid_items AS', 'product revenue preaggregation');
requireText(analytics, 'currencyConversion: false', 'no implicit currency conversion');
requireText(analytics, 'safeCsvCell', 'CSV injection protection');
rejectText(analytics, 'identity.users', 'business analytics excludes PII joins');
requirePattern(app, /path:\s*['"]\/analytics\/business['"]/, 'business analytics route');
requireText(nav, "permission: 'commerce.orders.read'", 'business analytics permission-bound navigation');

const failed = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`);
if (failed.length) {
  console.error(`Commerce freeze validation failed: ${failed.length} check(s).`);
  process.exit(1);
}
console.log(`Commerce freeze validation passed: ${checks.length} checks.`);
