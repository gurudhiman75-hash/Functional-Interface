import {
  TSD_001_ENGLISH_FREEZE_APPROVED_AT,
  TSD_001_ENGLISH_FREEZE_APPROVED_BY,
  TSD_001_ENGLISH_FREEZE_AUTHORITY,
  frozenLearnerCorpusIsUnchanged,
  generateTsdEnglishFrozenRecords,
} from "./english-frozen";
import { generateCanonicalReviewRecords } from "./canonical-review-schema";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const source = generateCanonicalReviewRecords();
const frozen = generateTsdEnglishFrozenRecords();

assert(source.length === 153, `Expected 153 source records, received ${source.length}`);
assert(frozen.length === source.length, `Frozen record count changed: ${frozen.length}`);
assert(new Set(frozen.map((row) => row.solveMode)).size === TSD_FINAL_LEARNER_AUTHORITIES.length, "Frozen learner authority coverage changed");
assert(frozenLearnerCorpusIsUnchanged(), "Learner-facing English corpus changed during freeze");
assert(new Set(frozen.map((row) => row.questionLanguageId)).size === frozen.length, "Frozen question-language IDs are not unique");

source.forEach((sourceRow, index) => {
  const frozenRow = frozen[index];
  assert(frozenRow.questionLanguageId === sourceRow.questionLanguageId, `${sourceRow.questionLanguageId}: identity changed during freeze`);
  assert(frozenRow.solveMode === sourceRow.solveMode, `${sourceRow.questionLanguageId}: authority changed during freeze`);
  assert(frozenRow.representation === sourceRow.representation, `${sourceRow.questionLanguageId}: representation changed during freeze`);
  assert(frozenRow.answerText === sourceRow.answerText, `${sourceRow.questionLanguageId}: answer changed during freeze`);
  assert(frozenRow.correctIndex === sourceRow.correctIndex, `${sourceRow.questionLanguageId}: answer position changed during freeze`);
  assert(frozenRow.permanentQlId === null, `${sourceRow.questionLanguageId}: permanent QL allocated during English freeze`);

  assert(sourceRow.lifecycle.reviewStatus === "EDITORIAL_REVIEW_REQUIRED", `${sourceRow.questionLanguageId}: source review status unexpectedly changed`);
  assert(sourceRow.lifecycle.englishDecision === "NEEDS_REVISION", `${sourceRow.questionLanguageId}: source English decision unexpectedly changed`);
  assert(sourceRow.lifecycle.englishFreezeStatus === "UNFROZEN", `${sourceRow.questionLanguageId}: source inventory was mutated instead of wrapped`);

  assert(frozenRow.lifecycle.reviewStatus === "EDITORIAL_APPROVED", `${sourceRow.questionLanguageId}: frozen review status is not approved`);
  assert(frozenRow.lifecycle.englishDecision === "APPROVED", `${sourceRow.questionLanguageId}: frozen English decision is not approved`);
  assert(frozenRow.lifecycle.englishFreezeStatus === "FROZEN", `${sourceRow.questionLanguageId}: English is not frozen`);
  assert(frozenRow.lifecycle.questionBankStatus === "NOT_STORED", `${sourceRow.questionLanguageId}: Question Bank was unlocked`);
  assert(frozenRow.lifecycle.testEligibility === "INELIGIBLE", `${sourceRow.questionLanguageId}: test delivery was unlocked`);
  assert(frozenRow.lifecycle.publiclyPublishable === false, `${sourceRow.questionLanguageId}: public delivery was unlocked`);

  assert(frozenRow.englishFreezeProof.authority === TSD_001_ENGLISH_FREEZE_AUTHORITY, `${sourceRow.questionLanguageId}: freeze authority mismatch`);
  assert(frozenRow.englishFreezeProof.approvedBy === TSD_001_ENGLISH_FREEZE_APPROVED_BY, `${sourceRow.questionLanguageId}: approver mismatch`);
  assert(frozenRow.englishFreezeProof.approvedAt === TSD_001_ENGLISH_FREEZE_APPROVED_AT, `${sourceRow.questionLanguageId}: approval date mismatch`);
  assert(frozenRow.englishFreezeProof.learnerCorpusChanged === false, `${sourceRow.questionLanguageId}: learner-corpus mutation flag changed`);
  assert(frozenRow.englishFreezeProof.localisationUnlocked === true, `${sourceRow.questionLanguageId}: localisation was not unlocked`);
  assert(frozenRow.englishFreezeProof.questionStudioUnlocked === false, `${sourceRow.questionLanguageId}: Question Studio was unlocked`);
  assert(frozenRow.englishFreezeProof.questionBankUnlocked === false, `${sourceRow.questionLanguageId}: Question Bank was unlocked`);
  assert(frozenRow.englishFreezeProof.testDeliveryUnlocked === false, `${sourceRow.questionLanguageId}: test delivery was unlocked`);
  assert(frozenRow.englishFreezeProof.publicDeliveryUnlocked === false, `${sourceRow.questionLanguageId}: public delivery was unlocked`);
});

const checkpointCounts = {
  cp001: frozen.filter((row) => row.checkpointId === "TSD-CP-001").length,
  cp002: frozen.filter((row) => row.checkpointId === "TSD-CP-002").length,
};
assert(checkpointCounts.cp001 === 80 && checkpointCounts.cp002 === 73, `Frozen checkpoint counts changed: ${checkpointCounts.cp001}/${checkpointCounts.cp002}`);

const correctPositions = [0, 1, 2, 3].map((position) => frozen.filter((row) => row.correctIndex === position).length);
assert(correctPositions.join(",") === "37,37,41,38", `Frozen correct-position distribution changed: ${correctPositions.join(",")}`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_001_ENGLISH_FREEZE_APPROVED",
  authority: TSD_001_ENGLISH_FREEZE_AUTHORITY,
  approvedBy: TSD_001_ENGLISH_FREEZE_APPROVED_BY,
  approvedAt: TSD_001_ENGLISH_FREEZE_APPROVED_AT,
  records: frozen.length,
  learnerAuthorities: new Set(frozen.map((row) => row.solveMode)).size,
  checkpointCounts,
  learnerCorpusChanged: false,
  correctPositions,
  permanentQls: 0,
  englishFreezeStatus: "FROZEN",
  localisationUnlocked: true,
  questionStudioUnlocked: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
