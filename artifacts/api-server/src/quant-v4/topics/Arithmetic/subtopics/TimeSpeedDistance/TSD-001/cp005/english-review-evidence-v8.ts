import { TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD, TSD_CP004_ENGLISH_FREEZE_ID, TSD_CP004_ENGLISH_FREEZE_STATUS } from "../cp004/english-approved-freeze";
import { TSD_CP005_AUTHORITY_APPROVAL, TSD_CP005_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";
import { isCp005ExamFriendlySelectedState, generateCp005EnglishAuditPoolV8, generateCp005ReviewSetV8 } from "./english-review-runtime-v8";
import { TSD_CP005_HELD_CROSS_CHECKPOINT_MODES, TSD_CP005_INTERNAL_QA_MODES } from "./final-ownership-candidate";
import { TSD_CP005_NEXT_PERMANENT_QL_ID, TSD_CP005_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const RAW_FRACTION = /\b\d+\/\d+\b/;
function hasAwkwardFraction(text: string): boolean {
  for (const match of text.matchAll(/\b(\d+)\/(\d+)\b/g)) {
    if (Number(match[1]) > 10 || Number(match[2]) > 10) return true;
  }
  return false;
}

const audit = generateCp005EnglishAuditPoolV8(30);
const selected = generateCp005ReviewSetV8(6);

assert(TSD_CP005_AUTHORITY_APPROVAL.status === "PRODUCT_OWNER_APPROVED_AUTHORITY_BOUNDARY", "CP005 authority approval status changed");
assert(TSD_CP005_AUTHORITY_APPROVAL.approvedSourceHead === "62f73932b763f8535ce9bc162a03798ae74b8be3", "CP005 approved source head changed");
assert(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.length === 13, "expected thirteen approved CP005 learner authorities");
assert(TSD_CP005_HELD_CROSS_CHECKPOINT_MODES.length === 6, "expected six CP005 cross-checkpoint holds");
assert(TSD_CP005_INTERNAL_QA_MODES.length === 4, "expected four CP005 internal-QA modes");
assert(TSD_CP005_PERMANENT_QL_IDS.length === 13 && TSD_CP005_PERMANENT_QL_IDS[0] === "TSD-QL-058" && TSD_CP005_PERMANENT_QL_IDS[12] === "TSD-QL-070", "CP005 permanent QL range changed");
assert(TSD_CP005_NEXT_PERMANENT_QL_ID === "TSD-QL-071", "next TSD QL must be TSD-QL-071");

assert(audit.length === 390, `expected 390 CP005 V8 audit questions, received ${audit.length}`);
assert(selected.length === 78, `expected 78 CP005 V8 selected questions, received ${selected.length}`);
assert(audit.every((row) => row.validation.valid), "CP005 V8 audit contains invalid questions");
assert(selected.every((row) => row.validation.valid), "CP005 V8 selected review contains invalid questions");
assert(new Set(audit.map((row) => row.mathematicalFingerprint)).size === 390, "CP005 V8 audit fingerprints are not globally unique");
assert(new Set(selected.map((row) => row.mathematicalFingerprint)).size === 78, "CP005 V8 selected fingerprints are not globally unique");
assert(new Set(selected.map((row) => row.stem)).size === 78, "CP005 V8 selected stems are not globally unique");
assert(new Set(selected.map((row) => row.permanentQlId)).size === 13, "CP005 V8 selected review does not cover all permanent QLs");
assert(new Set(selected.map((row) => row.solveMode)).size === 20, "CP005 V8 selected review does not cover all 20 learner solve modes");
assert(selected.every(isCp005ExamFriendlySelectedState), "CP005 V8 selected review contains an exam-unfriendly value/prose state");
assert(selected.every((row) => !RAW_FRACTION.test(row.stem)), "CP005 V8 selected stem contains raw fraction");
assert(selected.every((row) => !RAW_FRACTION.test(row.answerText)), "CP005 V8 selected correct answer contains raw fraction");
assert(selected.every((row) => !hasAwkwardFraction([row.explanation.method, ...row.explanation.steps, row.explanation.shortcut, row.explanation.finalAnswer].join(" "))), "CP005 V8 selected explanation contains an awkward large raw fraction");
assert(selected.every((row) => !row.seed.includes("semantic-retry")) && audit.every((row) => !row.seed.includes("semantic-retry")), "CP005 V8 relies on semantic retry rows");

for (const ql of TSD_CP005_PERMANENT_QL_IDS) {
  const rows = selected.filter((row) => row.permanentQlId === ql);
  assert(rows.length === 6, `${ql}: expected six V8 selected questions`);
  assert(new Set(rows.map((row) => row.representation)).size >= 4, `${ql}: expected at least four V8 representations`);
}
for (const authority of TSD_CP005_APPROVED_LEARNER_AUTHORITIES) {
  const rows = audit.filter((row) => row.authorityKey === authority.authorityKey);
  assert(rows.length === 30, `${authority.authorityKey}: expected thirty V8 audit questions`);
  assert(new Set(rows.map((row) => row.mathematicalFingerprint)).size === 30, `${authority.authorityKey}: expected thirty unique V8 audit states`);
}

const heldModes = new Set(TSD_CP005_HELD_CROSS_CHECKPOINT_MODES.map((entry) => entry.solveMode));
const qaModes = new Set(TSD_CP005_INTERNAL_QA_MODES.map((entry) => entry.solveMode));
assert(selected.every((row) => !heldModes.has(row.solveMode) && !qaModes.has(row.solveMode)), "held/QA mode leaked into V8 learner review");
assert(audit.every((row) => row.options.length === 4 && new Set(row.options).size === 4), "CP005 V8 audit option uniqueness failed");
assert(audit.every((row) => row.internalOptionAudit.filter((entry) => !entry.isCorrect && entry.wrongWorking).length === 3), "CP005 V8 audit question missing misconception-owned wrong workings");
assert(selected.every((row) => row.explanation.steps.length >= 3 && /\d/.test(row.explanation.steps.join(" "))), "CP005 V8 selected explanation lacks connected numeric working");
assert(selected.every((row) => row.explanation.finalAnswer.includes(row.answerText)), "CP005 V8 final answer does not repeat solved answer");
assert(selected.every((row) => (row.explanation as unknown as Record<string, unknown>).optionAnalysis === undefined), "public option analysis leaked into V8");

const difficulty = {
  EASY: selected.filter((row) => row.difficulty === "EASY").length,
  MEDIUM: selected.filter((row) => row.difficulty === "MEDIUM").length,
  HARD: selected.filter((row) => row.difficulty === "HARD").length,
};
assert(difficulty.EASY === 24 && difficulty.MEDIUM === 36 && difficulty.HARD === 18, `unexpected CP005 V8 difficulty mix ${JSON.stringify(difficulty)}`);
const exactWrongWorkings = audit.reduce((total, row) => total + row.internalOptionAudit.filter((entry) => !entry.isCorrect && entry.wrongWorking).length, 0);
assert(exactWrongWorkings === 1170, `expected 1170 CP005 V8 wrong workings, received ${exactWrongWorkings}`);
const correctOptionPositions = [0, 1, 2, 3].map((position) => audit.filter((row) => row.correctIndex === position).length);
assert(correctOptionPositions.every((count) => count >= 75), `CP005 V8 answer-position balance too weak: ${correctOptionPositions.join(",")}`);

const rawFractionDistractorRows = selected.filter((row) => row.options.some((option) => option !== row.answerText && RAW_FRACTION.test(option))).length;
assert(audit.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN" && !row.lifecycle.questionStudioEnabled && row.lifecycle.questionBankStatus === "NOT_STORED" && row.lifecycle.testEligibility === "INELIGIBLE" && !row.lifecycle.publiclyPublishable), "CP005 V8 downstream lifecycle lock violated");
assert(TSD_CP004_ENGLISH_FREEZE_STATUS === "APPROVED_ENGLISH_FROZEN", "CP004 English freeze status changed");
assert(TSD_CP004_ENGLISH_FREEZE_ID === "TSD-CP-004-EN-v1-frozen", "CP004 English freeze ID changed");
assert(TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD === "99b65d54c87bfe456182bbcbad5963d30579952c", "CP004 approved source head changed");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_ENGLISH_REVIEW_CANDIDATE_V8",
  permanentQlRange: "TSD-QL-058..TSD-QL-070",
  nextPermanentQl: TSD_CP005_NEXT_PERMANENT_QL_ID,
  learnerAuthorities: 13,
  learnerSolveModesCovered: 20,
  auditQuestions: 390,
  selectedQuestions: 78,
  auditUniqueFingerprints: 390,
  selectedUniqueFingerprints: 78,
  selectedRawFractionStems: 0,
  selectedRawFractionCorrectAnswers: 0,
  selectedAwkwardFractionExplanations: 0,
  rawFractionDistractorRows,
  semanticRetryRows: 0,
  exactWrongWorkings,
  correctOptionPositions,
  difficulty,
  explanationContract: "GIVEN_REASON_ACTUAL_NUMBERS_SIMPLE_RATIO_ARITHMETIC_SHORTCUT_FINAL_ANSWER",
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
