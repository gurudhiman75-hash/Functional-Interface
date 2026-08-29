import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const route = readFileSync(resolve(root, "src/routes/admin-question-studio-data-sufficiency.ts"), "utf8");
const client = readFileSync(resolve(root, "../admin-app/src/features/question-studio/data-sufficiency-review-api.ts"), "utf8");
const panel = readFileSync(resolve(root, "../admin-app/src/pages/content/QuestionStudioDataSufficiencyReviewPanel.tsx"), "utf8");

const routes = [...route.matchAll(/router\.(?:get|post)\("\/reasoning\/data-sufficiency\//g)];
assert.equal(routes.length, 4, "CP-008 must reuse the four canonical DSF Question Studio endpoints");
assert.ok(route.includes('activationMode: "MULTILINGUAL_MOCK_TEST_RELEASE_ENABLED"'));
assert.ok(route.includes('localizationReviewMode: "HI_PA_PRODUCT_OWNER_APPROVED"'));
assert.ok(route.includes("DSF_CP008_SUPPORTED_LANGUAGES"));
assert.ok(route.includes("DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY"));
assert.ok(route.includes("generateDsfApprovedLocalizedExamProfileBatch"));
assert.ok(route.includes("export function dsfCp008LocalizedReviewPayload"));
assert.ok(route.includes("export function dsfCp009LocalizedReleasePayload"));
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
const cp009Start = route.indexOf('export function dsfCp009LocalizedReleasePayload');
assert.ok(cp006Start >= 0 && cp008Start > cp006Start && cp009Start > cp008Start);
const englishReleaseBlock = route.slice(cp006Start, cp008Start);
assert.ok(englishReleaseBlock.includes('mockTestEligible: true as const'));
assert.ok(englishReleaseBlock.includes('automaticStudentPublication: false as const'));
const cp008HistoricalBlock = route.slice(cp008Start, cp009Start);
assert.ok(cp008HistoricalBlock.includes('questionBankStatus: "NOT_STORED" as const'));
assert.ok(cp008HistoricalBlock.includes('questionBankWritable: false as const'));
assert.ok(cp008HistoricalBlock.includes('testEligible: false as const'));
assert.ok(cp008HistoricalBlock.includes('mockTestEligible: false as const'));
assert.ok(cp008HistoricalBlock.includes('publiclyPublishable: false as const'));
assert.ok(cp008HistoricalBlock.includes('automaticStudentPublication: false as const'));

assert.ok(client.includes("export type DsfReviewLanguage = 'en' | 'hi' | 'pa'"));
assert.ok(client.includes("localizationCheckpointId: 'DSF-CP-008'"));
assert.ok(client.includes("localizationApprovalCheckpointId: 'DSF-CP-009'"));
assert.ok(client.includes("localizationReviewMode: 'HI_PA_PRODUCT_OWNER_APPROVED'"));
assert.ok(client.includes("activationMode: 'MULTILINGUAL_MOCK_TEST_RELEASE_ENABLED'"));
assert.ok(client.includes("mockTestReleaseCheckpointId: 'DSF-CP-006'"));
assert.ok(client.includes('mockTestEligible: true'));
assert.ok(client.includes('automaticStudentPublication: false'));

assert.ok(panel.includes('CP-009 multilingual production release'));
assert.ok(panel.includes('<Field label="Language">'));
assert.ok(panel.includes("English + Hindi + Punjabi production"));
assert.ok(panel.includes('CP-006 enables mock-test eligibility'));
assert.ok(panel.includes('test-series QA/release before mock delivery'));
assert.ok(panel.includes('Automatic student publication remains OFF'));
assert.ok(panel.includes('Historical CP-004/CP-005/CP-008 payloads are not retroactively upgraded'));
assert.ok(panel.includes('localization is product-owner approved'));

console.log(JSON.stringify({
  status: "PASS_DSF_CP008_ROUTE_UI_LOCALIZATION_CONTRACT",
  dsfStudioRoutes: 4,
  supportedLanguages: ["en", "hi", "pa"],
  englishCp006ReleasePreserved: true,
  historicalCp008ReviewPersistencePreserved: true,
  historicalCp008QuestionBankLocked: true,
  historicalCp008TestsLocked: true,
  historicalCp008MocksLocked: true,
  historicalCp008PublicPublicationLocked: true,
  laterCp009ApprovalReleaseAllowed: true,
  automaticStudentPublication: false,
}, null, 2));
