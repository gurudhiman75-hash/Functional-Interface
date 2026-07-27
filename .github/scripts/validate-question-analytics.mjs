import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const runner = read('artifacts/api-server/src/routes/published-test-runner.ts');
const collection = read('artifacts/api-server/src/routes/admin-question-analytics.ts');
const detail = read('artifacts/api-server/src/routes/admin-question-analytics-detail.ts');
const quality = read('artifacts/api-server/src/routes/admin-question-analytics-quality.ts');
const index = read('artifacts/api-server/src/routes/index.ts');
const app = read('artifacts/admin-app/src/App.tsx');
const page = read('artifacts/admin-app/src/pages/analytics/QuestionAnalyticsPage.tsx');
const qualityPage = read('artifacts/admin-app/src/pages/analytics/QuestionAnalyticsQualityPage.tsx');
const nav = read('artifacts/admin-app/src/app/nav/navigation.ts');

const requireText = (source, value, label) => {
  if (!source.includes(value)) throw new Error(`Missing ${label}: ${value}`);
};
const forbid = (source, pattern, label) => {
  if (pattern.test(source)) throw new Error(`Forbidden ${label}`);
};

for (const contract of [
  'snapshotVersion: 2',
  'linkageContract: "direct_question_version_v2"',
  'questionVersionId: String(row.questionVersionId)',
  'testQuestionId: String(row.testQuestionId)',
  'testSectionId: String(row.testSectionId)',
  'selectedOptionKey:',
  'correctOptionKey:',
  'timeTakenSeconds:',
  'testPublicationId: String(attempt.publicationId)',
  'testVersionId: String(attempt.testVersionId)',
]) requireText(runner, contract, 'runner snapshot contract');

for (const mount of [
  'router.use("/admin/analytics", adminQuestionAnalyticsQualityRouter)',
  'router.use("/admin/analytics", adminQuestionAnalyticsDetailRouter)',
  'router.use("/admin/analytics", adminQuestionAnalyticsRouter)',
]) requireText(index, mount, 'Question Analytics router mount');
const qualityMount = index.indexOf('adminQuestionAnalyticsQualityRouter)');
const detailMount = index.indexOf('adminQuestionAnalyticsDetailRouter)');
const collectionMount = index.indexOf('adminQuestionAnalyticsRouter)');
if (!(qualityMount < detailMount && detailMount < collectionMount)) throw new Error('Question Analytics routers are ordered incorrectly');

for (const contract of [
  "router.get('/questions'",
  "requireAdminPermission('users.students.read')",
  'FROM learning.attempts',
  'JOIN assessment.test_publications',
  'JOIN content.question_versions',
  'placementsByTestQuestion',
  'placementsByQuestionVersion',
  'placementsByStableId',
  'directLinkages',
  'legacyLinkages',
  'invalidResponseItems',
  'metric.options.findIndex((option) => Boolean(option.isCorrect))',
  'questionTiming: timedResponses > 0',
  'discrimination: false',
  'scanTruncated',
  'readOnly: true',
]) requireText(collection, contract, 'collection contract');

for (const contract of [
  "router.get('/questions/:questionVersionId'",
  'testQuestionIds.has(entry.testQuestionId)',
  'entry.questionVersionId === questionVersionId',
  'legacyMatches',
  'answerKeyMismatchItems',
  'invalidSelectedOptionItems',
  "code: 'DUPLICATE_PUBLICATION_PLACEMENT'",
  "code: 'ANSWER_KEY_MISMATCH'",
  "code: 'INVALID_OPTION_SELECTION'",
  'questionTiming: timedResponses > 0',
  'discrimination: false',
  'readOnly: true',
]) requireText(detail, contract, 'detail contract');

for (const contract of [
  "router.get('/questions/quality'",
  'stableIdCollisions',
  'duplicateQuestionPlacements',
  'malformedReviewAttempts',
  'missingQuestionItems',
  'invalidOptionSelections',
  'answerKeyMismatches',
  'identifierMismatchItems',
  'duplicateSnapshotItems',
  'directCoverageRate',
  'scanTruncated',
  'readOnly: true',
]) requireText(quality, contract, 'quality contract');

forbid(collection, /\b(?:INSERT INTO|UPDATE\s+learning\.attempts|DELETE FROM)\b/i, 'collection mutation');
forbid(detail, /\b(?:INSERT INTO|UPDATE\s+learning\.attempts|DELETE FROM)\b/i, 'detail mutation');
forbid(quality, /\b(?:INSERT INTO|UPDATE\s+learning\.attempts|DELETE FROM)\b/i, 'quality mutation');

for (const route of [
  "path: '/analytics/questions/quality'",
  "path: '/analytics/questions/:questionVersionId'",
  "path: '/analytics/questions'",
]) requireText(app, route, 'admin route');
const qualityRoute = app.indexOf("path: '/analytics/questions/quality'");
const detailRoute = app.indexOf("path: '/analytics/questions/:questionVersionId'");
const collectionRoute = app.indexOf("path: '/analytics/questions'");
if (!(qualityRoute < detailRoute && detailRoute < collectionRoute)) throw new Error('Question Analytics UI routes are ordered incorrectly');

requireText(nav, "label: 'Question Analytics'", 'Question Analytics navigation');
requireText(nav, "label: 'Question Analytics Quality'", 'quality navigation');
requireText(page, 'Direct linkage', 'direct-linkage UI');
requireText(page, 'Average question time', 'timing UI');
requireText(page, 'Excluded evidence is never guessed.', 'evidence exclusion disclosure');
requireText(qualityPage, 'Never repair analytics by editing aggregate outputs', 'remediation boundary');
requireText(qualityPage, 'Legacy stable-ID linkage remains supported only when collision-free.', 'legacy collision boundary');
forbid(page, /@\/data\/questions|@\/data\/analytics|demonstration data/i, 'prototype Question Analytics data');
forbid(qualityPage, /@\/data\/questions|@\/data\/analytics|demonstration data/i, 'prototype quality data');

console.log('Question Analytics freeze contracts validated.');
