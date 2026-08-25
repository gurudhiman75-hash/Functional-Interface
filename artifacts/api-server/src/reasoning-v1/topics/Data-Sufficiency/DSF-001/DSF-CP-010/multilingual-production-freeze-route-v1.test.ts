import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const route = readFileSync(resolve(root, "src/routes/admin-question-studio-data-sufficiency.ts"), "utf8");
const client = readFileSync(resolve(root, "../admin-app/src/features/question-studio/data-sufficiency-review-api.ts"), "utf8");
const panel = readFileSync(resolve(root, "../admin-app/src/pages/content/QuestionStudioDataSufficiencyReviewPanel.tsx"), "utf8");
const cp008 = readFileSync(resolve(root, "src/reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-008/localization-review-v1.ts"), "utf8");

const routes = [...route.matchAll(/router\.(?:get|post)\("\/reasoning\/data-sufficiency\//g)];
assert.equal(routes.length, 4, "CP-010 must keep exactly the four canonical DSF Question Studio endpoints");
assert.ok(!route.includes('/reasoning/data-sufficiency/publish'));
assert.ok(!route.includes('/reasoning/data-sufficiency/mock'));
assert.ok(!route.includes('/reasoning/data-sufficiency/freeze'));

for (const marker of [
  "DSF_CP010_CHECKPOINT_ID",
  "DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE_AUTHORITY",
  "DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE",
  "dsfCp010ProductionPayload",
  'productionReadinessFreezeStatus: "PRODUCTION_READY_MULTILINGUAL_FROZEN"',
  'chapterStatus: "CLOSED_CURRENT_APPROVED_SCOPE"',
  "productionReadinessFreezeFingerprint",
] as const) assert.ok(route.includes(marker), `CP010 route marker missing: ${marker}`);

const cp008Start = route.indexOf('export function dsfCp008LocalizedReviewPayload');
const cp009Start = route.indexOf('export function dsfCp009LocalizedReleasePayload');
const cp010Start = route.indexOf('export function dsfCp010ProductionPayload');
assert.ok(cp008Start >= 0 && cp009Start > cp008Start && cp010Start > cp009Start);
const historicalCp008Block = route.slice(cp008Start, cp009Start);
assert.ok(historicalCp008Block.includes('questionBankWritable: false as const'));
assert.ok(historicalCp008Block.includes('testEligible: false as const'));
assert.ok(historicalCp008Block.includes('mockTestEligible: false as const'));
assert.ok(historicalCp008Block.includes('publiclyPublishable: false as const'));

assert.ok(route.includes('questionBankAcceptanceMode: "FULL_RELEASE" as const'));
assert.ok(route.includes('manualQuestionPublicationRequired: true as const'));
assert.ok(route.includes('testEligible: true as const'));
assert.ok(route.includes('mockTestEligible: true as const'));
assert.ok(route.includes('publiclyPublishable: true as const'));
assert.ok(route.includes('automaticStudentPublication: false as const'));

for (const marker of [
  "productionReadinessFreezeCheckpointId: 'DSF-CP-010'",
  "productionReadinessFreezeAuthority: string",
  "productionReadinessFreezeStatus: 'PRODUCTION_READY_MULTILINGUAL_FROZEN'",
  "productionReadinessFreezeFingerprint: string",
  "chapterStatus: 'CLOSED_CURRENT_APPROVED_SCOPE'",
] as const) assert.ok(client.includes(marker), `CP010 admin client marker missing: ${marker}`);

for (const marker of [
  "CP-010 multilingual production freeze",
  "English + Hindi + Punjabi frozen production",
  "CLOSED_CURRENT_APPROVED_SCOPE",
  "Automatic student publication remains OFF",
  "Punjab-specific answer-profile rendering remains disabled",
] as const) assert.ok(panel.includes(marker), `CP010 admin panel marker missing: ${marker}`);

// CP008 remains a historical review checkpoint in source code even though CP010 closes
// the currently approved multilingual production scope.
assert.ok(cp008.includes('localizationStatus: "EXECUTABLE_REVIEW_REQUIRED" as const'));
assert.ok(cp008.includes('localizedQuestionBankWritable: false as const'));
assert.ok(cp008.includes('localizationReviewLanguages: DSF_CP008_LOCALIZED_LANGUAGES'));

console.log(JSON.stringify({
  status: "PASS_DSF_CP010_ROUTE_UI_FINAL_FREEZE_CONTRACT",
  dsfStudioRoutes: 4,
  productionLanguages: ["en", "hi", "pa"],
  chapterStatus: "CLOSED_CURRENT_APPROVED_SCOPE",
  historicalCp008ReviewBoundaryPreserved: true,
  automaticStudentPublication: false,
  parallelDsfFreezeOrDeliveryEndpointAdded: false,
}, null, 2));
