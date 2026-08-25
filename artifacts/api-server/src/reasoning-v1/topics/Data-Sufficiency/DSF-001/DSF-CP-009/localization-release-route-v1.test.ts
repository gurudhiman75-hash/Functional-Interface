import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const route = readFileSync(resolve(root, "src/routes/admin-question-studio-data-sufficiency.ts"), "utf8");
const client = readFileSync(resolve(root, "../admin-app/src/features/question-studio/data-sufficiency-review-api.ts"), "utf8");
const panel = readFileSync(resolve(root, "../admin-app/src/pages/content/QuestionStudioDataSufficiencyReviewPanel.tsx"), "utf8");

const routes = [...route.matchAll(/router\.(?:get|post)\("\/reasoning\/data-sufficiency\//g)];
assert.equal(routes.length, 4, "CP-009 must reuse exactly the four canonical DSF Question Studio routes");
assert.ok(route.includes("DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY"));
assert.ok(route.includes("DSF_CP009_LOCALIZATION_RELEASE_PACKAGE"));
assert.ok(route.includes("generateDsfApprovedLocalizedExamProfileBatch"));
assert.ok(route.includes("export function dsfCp009LocalizedReleasePayload"));
assert.ok(route.includes('activationMode: "MULTILINGUAL_MOCK_TEST_RELEASE_ENABLED"'));
assert.ok(route.includes('localizationReleaseMode: "HI_PA_PRODUCT_OWNER_APPROVED"'));
assert.ok(route.includes('questionBankAcceptanceMode: "FULL_RELEASE" as const'));
assert.ok(route.includes('questionBankWritable: true as const'));
assert.ok(route.includes('testEligibility: "ELIGIBLE" as const'));
assert.ok(route.includes('testEligible: true as const'));
assert.ok(route.includes('mockTestEligible: true as const'));
assert.ok(route.includes('publiclyPublishable: true as const'));
assert.ok(route.includes('manualQuestionPublicationRequired: true as const'));
assert.ok(route.includes('automaticStudentPublication: false as const'));
assert.ok(route.includes("cp009GenerationItemCount"));
assert.ok(route.includes("hindiReleaseItemCount"));
assert.ok(route.includes("punjabiReleaseItemCount"));
assert.ok(route.includes("reasoning-v1-dsf-cp009-hi-pa-localization-release-v1"));
assert.ok(!route.includes('/reasoning/data-sufficiency/localize'));
assert.ok(!route.includes('/reasoning/data-sufficiency/publish'));
assert.ok(!route.includes('/reasoning/data-sufficiency/mock'));
assert.ok(!route.includes('/reasoning/data-sufficiency/student'));

const cp008Start = route.indexOf("export function dsfCp008LocalizedReviewPayload");
const cp009Start = route.indexOf("export function dsfCp009LocalizedReleasePayload");
assert.ok(cp008Start >= 0 && cp009Start > cp008Start);
const cp008HistoricalBlock = route.slice(cp008Start, cp009Start);
assert.ok(cp008HistoricalBlock.includes('questionStudioStagingStatus: "LOCALIZATION_REVIEW_QUEUE" as const'));
assert.ok(cp008HistoricalBlock.includes('questionBankStatus: "NOT_STORED" as const'));
assert.ok(cp008HistoricalBlock.includes('questionBankWritable: false as const'));
assert.ok(cp008HistoricalBlock.includes('testEligible: false as const'));
assert.ok(cp008HistoricalBlock.includes('mockTestEligible: false as const'));
assert.ok(cp008HistoricalBlock.includes('publiclyPublishable: false as const'));
assert.ok(cp008HistoricalBlock.includes('automaticStudentPublication: false as const'));

assert.ok(client.includes("localizationApprovalCheckpointId?: 'DSF-CP-009'"));
assert.ok(client.includes("status: 'PRODUCT_OWNER_APPROVED'"));
assert.ok(client.includes("productionLanguages: ['en', 'hi', 'pa']"));
assert.ok(client.includes("localizationReviewLanguages: []"));
assert.ok(client.includes("status: 'PRODUCTION_READY_FROZEN' | 'LOCALIZED_PRODUCTION_READY'"));
assert.ok(client.includes("activationMode: 'MULTILINGUAL_MOCK_TEST_RELEASE_ENABLED'"));
assert.ok(client.includes("localizationReleaseMode: 'HI_PA_PRODUCT_OWNER_APPROVED'"));

assert.ok(panel.includes("CP-009 multilingual production release"));
assert.ok(panel.includes("English + Hindi + Punjabi production"));
assert.ok(panel.includes("Hindi localization is product-owner approved") || panel.includes("localization is product-owner approved"));
assert.ok(panel.includes("Automatic student publication remains OFF") || panel.includes("Automatic student publication remains off"));
assert.ok(panel.includes("CP-009 items"));
assert.ok(panel.includes("Hindi released"));
assert.ok(panel.includes("Punjabi released"));

console.log(JSON.stringify({
  status: "PASS_DSF_CP009_MULTILINGUAL_ROUTE_UI_RELEASE",
  dsfStudioRoutes: 4,
  productionLanguages: ["en", "hi", "pa"],
  localizedQuestionBankWritable: true,
  localizedTestEligible: true,
  localizedMockTestEligible: true,
  localizedPubliclyPublishable: true,
  manualQuestionPublicationRequired: true,
  automaticStudentPublication: false,
  historicalCp008ReviewPayloadsRemainLocked: true,
}, null, 2));
