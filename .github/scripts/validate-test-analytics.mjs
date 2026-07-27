import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const analytics = read('artifacts/api-server/src/routes/admin-test-analytics.ts');
const quality = read('artifacts/api-server/src/routes/admin-test-analytics-quality.ts');
const index = read('artifacts/api-server/src/routes/index.ts');
const app = read('artifacts/admin-app/src/App.tsx');
const page = read('artifacts/admin-app/src/pages/analytics/TestAnalyticsPage.tsx');
const qualityPage = read('artifacts/admin-app/src/pages/analytics/TestAnalyticsQualityPage.tsx');
const nav = read('artifacts/admin-app/src/app/nav/navigation.ts');

const requireText = (source, value, label) => {
  if (!source.includes(value)) throw new Error(`Missing ${label}: ${value}`);
};
const forbid = (source, pattern, label) => {
  if (pattern.test(source)) throw new Error(`Forbidden ${label}`);
};

requireText(index, 'router.use("/admin/analytics", adminTestAnalyticsQualityRouter)', 'quality router mount');
requireText(index, 'router.use("/admin/analytics", adminTestAnalyticsRouter)', 'analytics router mount');
if (index.indexOf('adminTestAnalyticsQualityRouter)') > index.indexOf('adminTestAnalyticsRouter)')) throw new Error('Quality router must precede analytics router');

for (const contract of [
  "router.get('/tests'",
  "router.get('/tests/export.csv'",
  "router.get('/tests/:publicationId'",
  "requireAdminPermission('users.students.read')",
  'FROM learning.attempts',
  'JOIN assessment.test_publications',
  "status::text IN ('evaluated', 'practice_evaluated')",
  'percentile_cont(0.50)',
  'ntile(10) OVER',
  'hasNumber',
  'previousHasAttempts',
  "const csvSafe",
  "/^[=+\\-@]/",
  "res.setHeader('Cache-Control', 'no-store')",
  'studentRank: false',
  'sectionAnalytics: false',
  'questionAnalytics: false',
]) requireText(analytics, contract, 'analytics contract');

if (analytics.indexOf("router.get('/tests/export.csv'") > analytics.indexOf("router.get('/tests/:publicationId'")) throw new Error('CSV route must precede publication route');
forbid(analytics, /\b(?:INSERT INTO|UPDATE\s+learning\.attempts|DELETE FROM)\b/i, 'analytics mutation');
forbid(quality, /\b(?:INSERT INTO|UPDATE\s+learning\.attempts|DELETE FROM)\b/i, 'quality mutation');

for (const contract of [
  "router.get('/tests/quality'",
  'missingFinalScore',
  'missingEvaluatedAt',
  'missingResultSnapshot',
  'missingResponseCounts',
  'responseCountMismatch',
  'negativeTimeSpent',
  "rows.slice(0, MAX_VISIBLE_PUBLICATIONS)",
  'truncated: rows.length > MAX_VISIBLE_PUBLICATIONS',
  'readOnly: true',
]) requireText(quality, contract, 'quality contract');

requireText(app, "path: '/analytics/tests/quality'", 'quality UI route');
requireText(app, "path: '/analytics/tests/:publicationId'", 'detail UI route');
requireText(app, "path: '/analytics/tests'", 'analytics UI route');
if (app.indexOf("path: '/analytics/tests/quality'") > app.indexOf("path: '/analytics/tests/:publicationId'")) throw new Error('Quality UI route must precede dynamic publication route');
requireText(nav, "label: 'Test Analytics'", 'analytics navigation');
requireText(nav, "label: 'Analytics Data Quality'", 'quality navigation');
requireText(page, 'No prior baseline', 'null baseline UI');
requireText(page, 'aggregate cohort benchmarks, not student ranks', 'rank scope disclosure');
requireText(qualityPage, 'do not correct analytics by editing aggregate outputs', 'quality remediation boundary');
requireText(qualityPage, 'Global totals include all matched publications', 'quality result-limit disclosure');
forbid(page, /@\/data\/analytics|demonstration data/i, 'prototype analytics data');

console.log('Test Analytics freeze contracts validated.');
