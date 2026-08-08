import {
  RNK_CP005_AUTHORITY_IDS,
  RNK_CP005_CONTEXT_FAMILIES,
  RNK_CP005_PRESENTATION_MODES,
  solveRnkCp005Question,
} from "./cp005-foundation";
import {
  RNK_CP005_ENGLISH_DISCOVERY_FREEZE_VERSION,
  RNK_CP005_EXPECTED_PROJECTION_SHA256,
  RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS,
  RNK_CP005_PERMANENT_RUNTIME_VERSION,
  buildRnkCp005PermanentRuntime,
  rnkCp005PermanentProjectionSha256,
} from "./cp005-permanent-runtime-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const questions = buildRnkCp005PermanentRuntime();
assert(questions.length === 1536, `Expected 1536 questions, found ${questions.length}`);
assert(RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS.length === 8, "Expected eight CP-005 authorities");
assert(new Set(RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS.map((item) => item.qlId)).size === 8, "Duplicate CP-005 QL ID");
assert(new Set(RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS.map((item) => item.authorityId)).size === RNK_CP005_AUTHORITY_IDS.length, "Authority assignment mismatch");

const qlCounts = new Map<string, number>();
const answerPositions = new Map<string, number[]>();
const contextCounts = new Map<string, number>();
const presentationCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const semanticFingerprints = new Set<string>();

for (const question of questions) {
  qlCounts.set(question.permanentQlId, (qlCounts.get(question.permanentQlId) ?? 0) + 1);
  const positions = answerPositions.get(question.permanentQlId) ?? [0, 0, 0, 0];
  positions[question.correctIndex] += 1;
  answerPositions.set(question.permanentQlId, positions);
  contextCounts.set(question.sharedPassage.contextFamily, (contextCounts.get(question.sharedPassage.contextFamily) ?? 0) + 1);
  presentationCounts.set(question.sharedPassage.presentationMode, (presentationCounts.get(question.sharedPassage.presentationMode) ?? 0) + 1);
  difficultyCounts.set(question.difficulty, (difficultyCounts.get(question.difficulty) ?? 0) + 1);

  assert(question.options.length === 4, `${question.permanentQlId}:${question.seed}: expected four options`);
  assert(new Set(question.options.map((option) => option.answerKey)).size === 4, `${question.permanentQlId}:${question.seed}: duplicate options`);
  assert(question.options[question.correctIndex].answerKey === question.answerKey, `${question.permanentQlId}:${question.seed}: answer index mismatch`);
  assert(solveRnkCp005Question(question.sharedPassage, question.query) === question.answerKey, `${question.permanentQlId}:${question.seed}: independent solve mismatch`);
  assert(question.visibleExplanation.optionAnalysis.length === 4, `${question.permanentQlId}:${question.seed}: incomplete option analysis`);
  assert(question.reviewMetadata.sourceOwnership === "PRESENTATION_LED_SHARED_SET", `${question.permanentQlId}:${question.seed}: ownership drift`);
  assert(question.reviewMetadata.lifecycle.questionStudio === "DISABLED", `${question.permanentQlId}:${question.seed}: Question Studio enabled`);
  assert(question.reviewMetadata.lifecycle.questionBank === "NOT_STORED", `${question.permanentQlId}:${question.seed}: Question Bank enabled`);
  assert(question.reviewMetadata.lifecycle.testEligibility === "INELIGIBLE", `${question.permanentQlId}:${question.seed}: test eligibility enabled`);
  assert(question.reviewMetadata.lifecycle.publicPublication === false, `${question.permanentQlId}:${question.seed}: public publication enabled`);
  assert(question.reviewMetadata.lifecycle.hindiPunjabi === "NOT_STARTED", `${question.permanentQlId}:${question.seed}: localization status drift`);
  assert(!semanticFingerprints.has(question.mathematicalFingerprint), `${question.permanentQlId}:${question.seed}: semantic duplicate`);
  semanticFingerprints.add(question.mathematicalFingerprint);
}

for (const assignment of RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS) {
  assert(qlCounts.get(assignment.qlId) === 192, `${assignment.qlId}: expected 192 questions`);
  assert(JSON.stringify(answerPositions.get(assignment.qlId)) === JSON.stringify([48, 48, 48, 48]), `${assignment.qlId}: answer-position imbalance`);
}

for (const context of RNK_CP005_CONTEXT_FAMILIES) {
  assert((contextCounts.get(context) ?? 0) === 256, `${context}: expected 256 questions`);
}
for (const mode of RNK_CP005_PRESENTATION_MODES) {
  assert((presentationCounts.get(mode) ?? 0) >= 480, `${mode}: insufficient coverage`);
}
assert((difficultyCounts.get("EASY") ?? 0) > 0, "Easy difficulty not reached");
assert((difficultyCounts.get("MEDIUM") ?? 0) > 0, "Medium difficulty not reached");
assert((difficultyCounts.get("HARD") ?? 0) > 0, "Hard difficulty not reached");

for (let seed = 0; seed < 192; seed += 1) {
  const linked = questions.filter((question) => question.seed === seed);
  assert(linked.length === 8, `set seed ${seed}: expected eight linked authority questions`);
  assert(new Set(linked.map((question) => question.sharedPassage.sharedSetId)).size === 1, `set seed ${seed}: shared set ID drift`);
  assert(new Set(linked.map((question) => question.sharedPassage.sharedPassageFingerprint)).size === 1, `set seed ${seed}: shared passage drift`);
}

const projectionSha256 = rnkCp005PermanentProjectionSha256(questions);
assert(projectionSha256 === RNK_CP005_EXPECTED_PROJECTION_SHA256, `Projection digest mismatch: ${projectionSha256}`);

console.log(JSON.stringify({
  checkpointId: "RNK-CP-005",
  status: "ENGLISH_DISCOVERY_FREEZE_READY",
  runtimeVersion: RNK_CP005_PERMANENT_RUNTIME_VERSION,
  freezeVersion: RNK_CP005_ENGLISH_DISCOVERY_FREEZE_VERSION,
  projectionSha256,
  expectedProjectionSha256: RNK_CP005_EXPECTED_PROJECTION_SHA256,
  projectionDigestPinned: true,
  permanentAuthorityCount: RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS.length,
  permanentRuntimeQuestionCount: questions.length,
  permanentRange: "RNK-QL-036..043",
  questionsPerAuthority: 192,
  qlCounts: Object.fromEntries(qlCounts),
  answerPositionsPerQl: Object.fromEntries(answerPositions),
  contextCounts: Object.fromEntries(contextCounts),
  presentationCounts: Object.fromEntries(presentationCounts),
  difficultyCounts: Object.fromEntries(difficultyCounts),
  sharedSetCount: 192,
  linkedAuthoritiesPerSharedSet: 8,
  normalizedSemanticDuplicates: questions.length - semanticFingerprints.size,
  lifecycle: {
    discoveryFrozen: true,
    questionStudio: "DISABLED",
    questionBank: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publicPublication: false,
    hindiPunjabi: "NOT_STARTED",
  },
}, null, 2));
