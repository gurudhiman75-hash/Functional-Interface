import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const runtimeSource = readFileSync(resolve(process.cwd(), "src/reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-003/exam-answer-profiles-v1.ts"), "utf8");
const routeSource = readFileSync(resolve(process.cwd(), "src/routes/admin-question-studio-data-sufficiency.ts"), "utf8");
const adminApiSource = readFileSync(resolve(process.cwd(), "../admin-app/src/features/question-studio/data-sufficiency-review-api.ts"), "utf8");
const adminPanelSource = readFileSync(resolve(process.cwd(), "../admin-app/src/pages/content/QuestionStudioDataSufficiencyReviewPanel.tsx"), "utf8");
const sourceRegistry = readFileSync(resolve(process.cwd(), "src/reasoning-v1/topics/Data-Sufficiency/DSF-001/discovery/source-pattern-registry.ts"), "utf8");
const cp001Freeze = readFileSync(resolve(process.cwd(), "src/reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-001/cp001-freeze-authority.ts"), "utf8");
const cp002Runtime = readFileSync(resolve(process.cwd(), "src/reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-002/question-studio-integration-v1.ts"), "utf8");

for (const profileId of [
  "GENERIC_DS_STANDARD_5_EN", "BANKING_STANDARD_5_EN", "BANKING_BOB_2015_5_EN",
  "SSC_CGL_TIER2_2023_4_EN", "SSC_CGL_TIER2_2024_4_EN",
] as const) {
  assert(runtimeSource.includes(`\"${profileId}\"`), `CP003 runtime missing ${profileId}`);
  assert(adminApiSource.includes(`'${profileId}'`), `Admin API type missing ${profileId}`);
}
for (const sourceConstant of [
  "DSF_BANK_STANDARD_ORDER", "DSF_BANK_BOB_2015_ORDER", "DSF_SSC_CGL_2023_FOUR_ORDER", "DSF_SSC_CGL_2024_FOUR_ORDER",
] as const) {
  assert(runtimeSource.includes(sourceConstant), `CP003 runtime is not pinned to ${sourceConstant}`);
  assert(sourceRegistry.includes(`export const ${sourceConstant}`), `Source registry lost ${sourceConstant}`);
}
assert(runtimeSource.includes('examFamily: "PUNJAB_STATE"'), "Punjab disabled-family gate is missing");
assert(runtimeSource.includes("Official Punjab Data Sufficiency answer-contract evidence is not strong enough"), "Punjab evidence boundary is missing");
assert(!runtimeSource.includes("PUNJAB_STANDARD"), "Unverified Punjab answer profile leaked into CP003");
assert(runtimeSource.includes('omittedSemanticClasses: omittedClasses(DSF_SSC_CGL_2023_FOUR_ORDER)'), "SSC 2023 omission contract missing");
assert(runtimeSource.includes('omittedSemanticClasses: omittedClasses(DSF_SSC_CGL_2024_FOUR_ORDER)'), "SSC 2024 omission contract missing");
assert(runtimeSource.includes("cannot render ${input.semanticClass}"), "Explicit SSC eligibility rejection is missing");
assert(runtimeSource.includes("semanticTruthPreserved: true"), "Semantic-preservation flag missing");
assert(runtimeSource.includes("optionOrderMatchesProfile: true"), "Option-order flag missing");

for (const fragment of [
  "generateDsfExamProfileBatch", "DSF_CP003_EXAM_PROFILE_AUTHORITY", "deliveryProfileAuthority", "profileSourcePatternIds",
  "DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY", "DSF_CP005_TEST_RELEASE_AUTHORITY", "DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY",
  "dsfCp004ReviewPayload", "dsfCp005ReviewPayload", "dsfCp006ReviewPayload",
] as const) assert(routeSource.includes(fragment), `DSF route lost CP003/later contract: ${fragment}`);

for (const panelFragment of [
  "Answer profile", "Banking + SSC", "All representable classes", "Punjab-specific rendering remains disabled", "No option-position remapping is allowed",
] as const) assert(adminPanelSource.includes(panelFragment), `Admin panel missing CP003 contract: ${panelFragment}`);

for (const sourceLock of ["questionBankWritable: false", "testEligible: false", "mockTestEligible: false", "publiclyPublishable: false"] as const) {
  assert(runtimeSource.includes(sourceLock), `CP003 runtime lost downstream lock ${sourceLock}`);
}
assert(routeSource.includes('questionBankAcceptanceMode: "BANK_ONLY"'), "CP004 BANK_ONLY overlay lost");
assert(routeSource.includes('questionBankAcceptanceMode: "FULL_RELEASE"'), "CP005/006 FULL_RELEASE overlay missing");
assert(routeSource.includes('testEligible: true'), "Later scored-test overlay missing");
assert(routeSource.includes('publiclyPublishable: true'), "Later manual publication overlay missing");
assert(routeSource.includes('mockTestEligible: true'), "CP006 mock-test overlay missing");
assert(routeSource.includes('automaticStudentPublication: false'), "Automatic student publication must remain disabled");

assert(cp001Freeze.includes('status: "FROZEN"'), "CP001 semantic authority is no longer frozen");
assert(cp001Freeze.includes('questionStudioDiscoverable: false'), "CP001 delivery lock was reopened");
assert(cp002Runtime.includes('DSF_CP002_QUESTION_STUDIO_INTEGRATION_V1'), "CP002 integration authority missing");
assert(cp002Runtime.includes('examSpecificAnswerProfilesImplemented: false'), "CP002 itself was mutated to own exam profiles");
assert(runtimeSource.includes('nextAvailableQlId: "DSF-QL-002"') || runtimeSource.includes("...DSF_CP002_QUESTION_STUDIO_PACKAGE"), "CP003 permanent QL continuity missing");

console.log(JSON.stringify({
  status: "PASS_DSF_CP_003_ROUTE_UI_CONTRACT",
  profileCheckpoint: "DSF-CP-003",
  bankingProfiles: 2,
  sscProfiles: 2,
  genericProfileRetained: true,
  sscEligibilityRestrictionEnforced: true,
  punjabSpecificProfileEnabled: false,
  cp001Frozen: true,
  cp002Preserved: true,
  cp003SourceQuestionBankLocked: true,
  laterQuestionBankCheckpoint: "DSF-CP-004",
  laterTestReleaseCheckpoint: "DSF-CP-005",
  laterMockReleaseCheckpoint: "DSF-CP-006",
  legacyCp004BankOnlyPayloadPreserved: true,
  legacyCp005MockIneligiblePayloadPreserved: true,
  automaticStudentDeliveryLocked: true,
}, null, 2));
