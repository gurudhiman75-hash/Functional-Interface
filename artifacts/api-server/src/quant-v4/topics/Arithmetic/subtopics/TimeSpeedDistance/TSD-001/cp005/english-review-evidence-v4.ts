import { TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD, TSD_CP004_ENGLISH_FREEZE_ID, TSD_CP004_ENGLISH_FREEZE_STATUS } from "../cp004/english-approved-freeze";
import { TSD_CP005_AUTHORITY_APPROVAL, TSD_CP005_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";
import { TSD_CP005_HELD_CROSS_CHECKPOINT_MODES, TSD_CP005_INTERNAL_QA_MODES } from "./final-ownership-candidate";
import { generateCp005EnglishAuditPoolV4, generateCp005ReviewSetV4 } from "./english-review-runtime-v4";
import { TSD_CP005_NEXT_PERMANENT_QL_ID, TSD_CP005_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const audit = generateCp005EnglishAuditPoolV4(30);
const selected = generateCp005ReviewSetV4(6);

assert(TSD_CP005_AUTHORITY_APPROVAL.status === "PRODUCT_OWNER_APPROVED_AUTHORITY_BOUNDARY", "CP005 authority approval status changed");
assert(TSD_CP005_AUTHORITY_APPROVAL.approvedSourceHead === "62f73932b763f8535ce9bc162a03798ae74b8be3", "CP005 approved source head changed");
assert(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.length === 13, "expected thirteen approved CP005 learner authorities");
assert(TSD_CP005_HELD_CROSS_CHECKPOINT_MODES.length === 6, "expected six CP005 cross-checkpoint holds");
assert(TSD_CP005_INTERNAL_QA_MODES.length === 4, "expected four CP005 internal-QA modes");
assert(TSD_CP005_PERMANENT_QL_IDS.length === 13, "expected thirteen CP005 permanent QLs");
assert(TSD_CP005_PERMANENT_QL_IDS[0] === "TSD-QL-058", "CP005 permanent QLs must begin at TSD-QL-058");
assert(TSD_CP005_PERMANENT_QL_IDS[12] === "TSD-QL-070", "CP005 permanent QLs must end at TSD-QL-070");
assert(TSD_CP005_NEXT_PERMANENT_QL_ID === "TSD-QL-071", "next TSD QL must be TSD-QL-071");

assert(audit.length === 390, `expected 390 CP005 audit questions, received ${audit.length}`);
assert(selected.length === 78, `expected 78 CP005 review questions, received ${selected.length}`);
assert(audit.every((row) => row.validation.valid), "CP005 English V4 audit contains invalid questions");
assert(selected.every((row) => row.validation.valid), "CP005 English V4 review set contains invalid questions");
assert(new Set(selected.map((row) => row.stem)).size === selected.length, "CP005 V4 selected stems are not globally unique");
assert(new Set(selected.map((row) => row.mathematicalFingerprint)).size === selected.length, "CP005 V4 selected mathematical fingerprints are not globally unique");
assert(new Set(audit.map((row) => row.mathematicalFingerprint)).size === audit.length, "CP005 V4 audit mathematical fingerprints are not globally unique");
assert(new Set(selected.map((row) => row.permanentQlId)).size === 13, "CP005 V4 review does not cover all permanent QLs");
assert(new Set(selected.map((row) => row.solveMode)).size === 20, `CP005 V4 must cover 20 retained/merged learner solve modes, covered ${new Set(selected.map((row) => row.solveMode)).size}`);

for (const ql of TSD_CP005_PERMANENT_QL_IDS) {
  const rows = selected.filter((row) => row.permanentQlId === ql);
  assert(rows.length === 6, `${ql}: expected six V4 English review questions`);
  assert(new Set(rows.map((row) => row.representation)).size >= 4, `${ql}: expected at least four learner representations`);
}

for (const authority of TSD_CP005_APPROVED_LEARNER_AUTHORITIES) {
  const rows = audit.filter((row) => row.authorityKey === authority.authorityKey);
  assert(rows.length === 30, `${authority.authorityKey}: expected thirty V4 audit questions`);
  assert(new Set(rows.map((row) => row.mathematicalFingerprint)).size === 30, `${authority.authorityKey}: V4 mathematical diversity too weak`);
}

const heldModes = new Set(TSD_CP005_HELD_CROSS_CHECKPOINT_MODES.map((entry) => entry.solveMode));
const qaModes = new Set(TSD_CP005_INTERNAL_QA_MODES.map((entry) => entry.solveMode));
assert(selected.every((row) => !heldModes.has(row.solveMode)), "cross-checkpoint held mode leaked into V4 learner review");
assert(selected.every((row) => !qaModes.has(row.solveMode)), "internal-QA mode leaked into V4 learner review");
assert(audit.every((row) => row.options.length === 4 && new Set(row.options).size === 4), "CP005 V4 option uniqueness failed");
assert(audit.every((row) => row.internalOptionAudit.filter((entry) => !entry.isCorrect && entry.wrongWorking).length === 3), "CP005 V4 question missing three misconception-owned wrong workings");
assert(audit.every((row) => row.explanation.steps.length >= 2 && row.explanation.finalAnswer.includes(row.answerText)), "CP005 V4 learner explanation contract failed");
assert(audit.every((row) => (row.explanation as unknown as Record<string, unknown>).optionAnalysis === undefined), "CP005 V4 public option analysis leaked");
assert(audit.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN" && !row.lifecycle.questionStudioEnabled && row.lifecycle.questionBankStatus === "NOT_STORED" && row.lifecycle.testEligibility === "INELIGIBLE" && !row.lifecycle.publiclyPublishable), "CP005 V4 downstream lifecycle lock violated");

const correctOptionPositions = [0, 1, 2, 3].map((position) => audit.filter((row) => row.correctIndex === position).length);
assert(correctOptionPositions.every((count) => count >= 75), `CP005 V4 answer-position balance too weak: ${correctOptionPositions.join(",")}`);

const difficulty = {
  EASY: selected.filter((row) => row.difficulty === "EASY").length,
  MEDIUM: selected.filter((row) => row.difficulty === "MEDIUM").length,
  HARD: selected.filter((row) => row.difficulty === "HARD").length,
};
assert(difficulty.EASY === 24 && difficulty.MEDIUM === 36 && difficulty.HARD === 18, `unexpected CP005 V4 difficulty mix ${JSON.stringify(difficulty)}`);

const exactWrongWorkings = audit.reduce((total, row) => total + row.internalOptionAudit.filter((entry) => !entry.isCorrect && entry.wrongWorking).length, 0);
assert(exactWrongWorkings === 1170, `expected 1170 CP005 V4 exact wrong workings, received ${exactWrongWorkings}`);

const inverseRows = audit.filter((row) => row.solveMode === "findDistanceBetweenEndpointsFromRepeatedMeetings");
assert(inverseRows.length === 30, `expected 30 V4 inverse repeated-meeting audit rows, received ${inverseRows.length}`);
assert(inverseRows.every((row) => new Set(row.options).size === 4), "V4 inverse repeated-meeting distractor collision survived remediation");
assert(inverseRows.every((row) => row.internalOptionAudit.filter((entry) => !entry.isCorrect).every((entry) => entry.text !== row.answerText)), "V4 inverse repeated-meeting wrong option equals correct answer");

assert(TSD_CP004_ENGLISH_FREEZE_STATUS === "APPROVED_ENGLISH_FROZEN", "CP004 approved English freeze status changed");
assert(TSD_CP004_ENGLISH_FREEZE_ID === "TSD-CP-004-EN-v1-frozen", "CP004 English freeze ID changed");
assert(TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD === "99b65d54c87bfe456182bbcbad5963d30579952c", "CP004 approved source head changed");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_ENGLISH_REVIEW_CANDIDATE_V4",
  productOwnerAuthorityApproval: true,
  permanentQlRange: "TSD-QL-058..TSD-QL-070",
  nextPermanentQl: TSD_CP005_NEXT_PERMANENT_QL_ID,
  learnerAuthorities: TSD_CP005_APPROVED_LEARNER_AUTHORITIES.length,
  learnerSolveModesCovered: new Set(selected.map((row) => row.solveMode)).size,
  heldCrossCheckpointModes: TSD_CP005_HELD_CROSS_CHECKPOINT_MODES.length,
  internalQaModes: TSD_CP005_INTERNAL_QA_MODES.length,
  auditQuestions: audit.length,
  selectedQuestions: selected.length,
  questionsPerQl: 6,
  inverseRepeatedMeetingAuditRows: inverseRows.length,
  minimumRepresentationsPerQl: Math.min(...TSD_CP005_PERMANENT_QL_IDS.map((ql) => new Set(selected.filter((row) => row.permanentQlId === ql).map((row) => row.representation)).size)),
  exactWrongWorkings,
  correctOptionPositions,
  difficulty,
  distractorContract: "THREE_DISTINCT_SEMANTIC_PATHS_WITH_V4_INVERSE_COLLISION_PROOF",
  publicExplanationContract: "METHOD_CONTEXT_NUMERIC_DERIVATION_SHORTCUT_ANSWER",
  optionAnalysisPublic: false,
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  cp004FreezeId: TSD_CP004_ENGLISH_FREEZE_ID,
  cp004ApprovedSourceHead: TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD,
}, null, 2));
