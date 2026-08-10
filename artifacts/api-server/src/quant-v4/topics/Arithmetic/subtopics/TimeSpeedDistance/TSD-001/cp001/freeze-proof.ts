import {
  TSD_CP001_DISCOVERY_AUTHORITIES,
  TSD_CP001_SOURCE_CANDIDATES,
} from "./discovery-registry";
import {
  TSD_CP001_LEARNER_AUTHORITIES,
  TSD_CP001_NON_LEARNER_MODES,
  stableStringify,
} from "./runtime";
import {
  TSD_CP001_FROZEN_AUTHORITIES,
  TSD_CP001_NEXT_PERMANENT_QL_ID,
  generateCp001FrozenEnglishReview,
} from "./freeze-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const frozen = TSD_CP001_FROZEN_AUTHORITIES;
const review = generateCp001FrozenEnglishReview();

assert(TSD_CP001_SOURCE_CANDIDATES.length === 32, "CP-001 source-candidate count changed during freeze");
assert(TSD_CP001_DISCOVERY_AUTHORITIES.length === 25, "CP-001 discovery-authority count changed during freeze");
assert(TSD_CP001_LEARNER_AUTHORITIES.length === 23, "CP-001 learner-authority count changed during freeze");
assert(TSD_CP001_NON_LEARNER_MODES.size === 2, "CP-001 internal-QA boundary changed during freeze");
assert(frozen.length === 23, "CP-001 must freeze exactly 23 learner authorities");
assert(review.length === 69, "CP-001 English freeze must contain 69 reviewed questions");

const expectedIds = Array.from({ length: 23 }, (_, index) => `TSD-QL-${String(index + 1).padStart(3, "0")}`);
assert(stableStringify(frozen.map((entry) => entry.permanentQlId)) === stableStringify(expectedIds), "CP-001 permanent IDs are not contiguous TSD-QL-001..023");
assert(TSD_CP001_NEXT_PERMANENT_QL_ID === "TSD-QL-024", "Unexpected next TSD permanent ID after CP-001");
assert(new Set(frozen.map((entry) => entry.permanentQlId)).size === frozen.length, "Duplicate CP-001 permanent ID");
assert(new Set(frozen.map((entry) => entry.provisionalAuthorityId)).size === frozen.length, "A CP-001 provisional authority was frozen more than once");
assert(new Set(frozen.map((entry) => entry.solveMode)).size === frozen.length, "A CP-001 solve mode was frozen more than once");
assert(frozen.every((entry) => !TSD_CP001_NON_LEARNER_MODES.has(entry.solveMode)), "Internal QA authority received a learner QL");
assert(frozen.every((entry) => entry.englishFreezeStatus === "FROZEN" && !entry.publiclyPublishable), "CP-001 freeze/publication status is invalid");

for (const authority of frozen) {
  const rows = review.filter((row) => row.permanentQlId === authority.permanentQlId);
  assert(rows.length === 3, `${authority.permanentQlId}: expected three approved English states`);
  assert(rows.every((row) => row.englishDecision === "APPROVED"), `${authority.permanentQlId}: an English state is not approved`);
  assert(rows.every((row) => row.sourceQuestion.validation.valid), `${authority.permanentQlId}: invalid source question entered freeze`);
  assert(new Set(rows.map((row) => row.mathematicalFingerprint)).size === 3, `${authority.permanentQlId}: frozen fingerprints are not distinct`);
  assert(new Set(rows.map((row) => row.stem)).size === 3, `${authority.permanentQlId}: frozen stems are not distinct`);
  assert(new Set(rows.map((row) => row.sourceQuestion.explanation.stepByStepSolution[0])).size === 3, `${authority.permanentQlId}: teaching openings are not distinct`);
  assert(rows.every((row) => row.sourceQuestion.explanation.stepByStepSolution.length >= 6), `${authority.permanentQlId}: compressed explanation entered freeze`);
  assert(rows.every((row) => row.sourceQuestion.explanation.optionAnalysis.length === 4), `${authority.permanentQlId}: incomplete option analysis entered freeze`);
  assert(rows.every((row) => row.questionBankStatus === "NOT_STORED" && row.testEligibility === "INELIGIBLE" && !row.publiclyPublishable), `${authority.permanentQlId}: delivery lock failed`);
}

assert(review.every((row) => row.sourceQuestion.options.length === 4 && new Set(row.sourceQuestion.options).size === 4), "Frozen CP-001 review contains duplicate options");
assert(review.every((row) => row.sourceQuestion.answerText === row.sourceQuestion.options[row.sourceQuestion.correctIndex]), "Frozen CP-001 answer key mismatch");
assert(review.every((row) => row.sourceQuestion.explanation.optionAnalysis.every((option) => option.reason.includes(option.text))), "Frozen CP-001 option reason does not name its displayed value");
assert(!/TODO|PLACEHOLDER|TSD-CP001-DISC-(024|025)/.test(review.map((row) => `${row.stem} ${row.answerText}`).join(" ")), "Internal or unresolved content leaked into frozen learner text");

console.log(JSON.stringify({
  status: "PASS",
  canonicalProblemId: "TSD-CP-001",
  sourceCandidates: TSD_CP001_SOURCE_CANDIDATES.length,
  discoveryAuthorities: TSD_CP001_DISCOVERY_AUTHORITIES.length,
  frozenLearnerAuthorities: frozen.length,
  internalQaAuthorities: TSD_CP001_NON_LEARNER_MODES.size,
  approvedEnglishQuestions: review.length,
  permanentQlRange: "TSD-QL-001..TSD-QL-023",
  nextPermanentQlId: TSD_CP001_NEXT_PERMANENT_QL_ID,
  questionBankStored: 0,
  testEligible: 0,
  publiclyPublishable: 0,
}, null, 2));
