import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const route = readFileSync(resolve(root, "src/routes/admin-question-studio-data-sufficiency.ts"), "utf8");
const client = readFileSync(resolve(root, "../admin-app/src/features/question-studio/data-sufficiency-review-api.ts"), "utf8");
const panel = readFileSync(resolve(root, "../admin-app/src/pages/content/QuestionStudioDataSufficiencyReviewPanel.tsx"), "utf8");

const routes = [...route.matchAll(/router\.(?:get|post)\("\/reasoning\/data-sufficiency\//g)];
assert.equal(routes.length, 4, "CP-008 must reuse the four canonical DSF Question Studio endpoints");
assert.ok(route.includes('activationMode: "MOCK_TEST_RELEASE_ENABLED"'), "CP-006 English release marker must remain visible");
assert.ok(route.includes('localizationReviewMode: "HI_PA_EXECUTABLE_REVIEW"'));
assert.ok(route.includes("DSF_CP008_LOCALIZATION_REVIEW_PACKAGE"));
assert.ok(route.includes("DSF_CP008_SUPPORTED_LANGUAGES"));
assert.ok(route.includes("generateDsfLocalizedExamProfileBatch"));
assert.ok(route.includes("export function dsfCp008LocalizedReviewPayload"));
assert.ok(route.includes('questionStudioStagingStatus: "LOCALIZATION_REVIEW_QUEUE" as const'));
assert.ok(route.includes('questionBankStatus: "NOT_STORED" as const'));
assert.ok(route.includes('questionBankWritable: false as const'));
assert.ok(route.includes('testEligibility: "INELIGIBLE" as const'));
assert.ok(route.includes('testEligible: false as const'));
assert.ok(route.includes('mockTestEligible: false as const'));
assert.ok(route.includes('publiclyPublishable: false as const'));
assert.ok(route.includes('automaticStudentPublication: false as const'));
assert.ok(route.includes("hindiReviewItemCount"));
assert.ok(route.includes("punjabiReviewItemCount"));
assert.ok(!route.includes('/reasoning/data-sufficiency/localize'));
assert.ok(!route.includes('/reasoning/data-sufficiency/publish'));
assert.ok(!route.includes('/reasoning/data-sufficiency/mock'));

const cp006Start = route.indexOf('export function dsfCp006ReviewPayload');
const cp008Start = route.indexOf('export function dsfCp008LocalizedReviewPayload');
assert.ok(cp006Start >= 0 && cp008Start > cp006Start);
const englishReleaseBlock = route.slice(cp006Start, cp008Start);
assert.ok(englishReleaseBlock.includes('mockTestEligible: true as const'));
assert.ok(englishReleaseBlock.includes('automaticStudentPublication: false as const'));

assert.ok(client.includes("export type DsfReviewLanguage = 'en' | 'hi' | 'pa'"));
assert.ok(client.includes("localizationCheckpointId: 'DSF-CP-008'"));
assert.ok(client.includes("localizationReviewMode: 'HI_PA_EXECUTABLE_REVIEW'"));
assert.ok(client.includes("activationMode: 'MOCK_TEST_RELEASE_ENABLED'"));
assert.ok(client.includes("mockTestReleaseCheckpointId: 'DSF-CP-006'"));
assert.ok(client.includes('mockTestEligible: true'));
assert.ok(client.includes('automaticStudentPublication: false'));

assert.ok(panel.includes('CP-008 Hindi/Punjabi localization review'));
assert.ok(panel.includes('<Field label="Language">'));
assert.ok(panel.includes("Hindi + Punjabi review"));
assert.ok(panel.includes('CP-006 mock-test release'));
assert.ok(panel.includes('canonical published-test and test-series QA/release path'));
assert.ok(panel.includes('Automatic student publication remains OFF'));
assert.ok(panel.includes('Older CP-004 BANK_ONLY and CP-005 mock-ineligible payloads are not upgraded'));
assert.ok(panel.includes('Question Bank, tests, mocks and public publication remain blocked'));

console.log(JSON.stringify({
  status: "PASS_DSF_CP008_ROUTE_UI_LOCALIZATION_CONTRACT",
  dsfStudioRoutes: 4,
  supportedLanguages: ["en", "hi", "pa"],
  englishCp006ReleasePreserved: true,
  localizedReviewPersistenceEnabled: true,
  localizedQuestionBankLocked: true,
  localizedTestsLocked: true,
  localizedMocksLocked: true,
  localizedPublicPublicationLocked: true,
  automaticStudentPublication: false,
}, null, 2));
