import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const backend = read('artifacts/api-server/src/routes/admin-business-analytics.ts');
const routes = read('artifacts/api-server/src/routes/index.ts');
const ui = read('artifacts/admin-app/src/pages/analytics/BusinessAnalyticsPage.tsx');
const app = read('artifacts/admin-app/src/App.tsx');
const nav = read('artifacts/admin-app/src/app/nav/navigation.ts');

const required = [
  [backend, 'requireAdminPermission("commerce.orders.read")'],
  [backend, 'router.get("/business"'],
  [backend, 'router.get("/business.csv"'],
  [backend, "o.status IN ('paid','partially_refunded','refunded')"],
  [backend, "r.status = 'processed'"],
  [backend, 'conversionBasisPoints'],
  [backend, 'paidWithoutCapturedPayment'],
  [backend, 'paidWithoutEntitlement'],
  [backend, 'safeCsvCell'],
  [routes, 'router.use("/admin/analytics", adminBusinessAnalyticsRouter)'],
  [ui, "new Intl.NumberFormat('en-US'"],
  [ui, '/admin/analytics/business.csv'],
  [ui, 'No student ranking or personally identifiable data'],
  [app, "path: '/analytics/business'"],
  [nav, "label: 'Business Analytics'"],
  [nav, "permission: 'commerce.orders.read'"],
];

for (const [text, token] of required) {
  if (!text.includes(token)) throw new Error(`Missing Business Analytics contract: ${token}`);
}

for (const forbidden of ['REVENUE_TREND', 'TOP_PACKAGES', '@/data/analytics', 'demonstration data', 'prototype evaluation']) {
  if (ui.includes(forbidden)) throw new Error(`Prototype Business Analytics dependency remains: ${forbidden}`);
}

if (/\b(INSERT INTO|UPDATE\s+commerce|DELETE FROM)\b/i.test(backend)) throw new Error('Business Analytics API must remain read-only.');
console.log('Business Analytics freeze contracts passed.');
