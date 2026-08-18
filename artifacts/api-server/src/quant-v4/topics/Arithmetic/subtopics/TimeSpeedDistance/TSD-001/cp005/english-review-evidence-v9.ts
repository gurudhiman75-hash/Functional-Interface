import { TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD, TSD_CP004_ENGLISH_FREEZE_ID, TSD_CP004_ENGLISH_FREEZE_STATUS } from "../cp004/english-approved-freeze";
import { TSD_CP005_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";
import { isCp005ExamFriendlySelectedState } from "./english-review-runtime-v8";
import { generateCp005EnglishAuditPoolV9, generateCp005ReviewSetV9 } from "./english-review-runtime-v9";
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

const audit = generateCp005EnglishAuditPoolV9(30);
const selected = generateCp005ReviewSetV9(6);

assert(audit.length === 390 && selected.length === 78, "CP005 V9 audit/review cardinality changed");
assert(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.length === 13, "CP005 V9 authority count changed");
assert(TSD_CP005_PERMANENT_QL_IDS.length === 13 && TSD_CP005_PERMANENT_QL_IDS[0] === "TSD-QL-058" && TSD_CP005_PERMANENT_QL_IDS[12] === "TSD-QL-070", "CP005 V9 QL range changed");
assert(TSD_CP005_NEXT_PERMANENT_QL_ID === "TSD-QL-071", "CP005 V9 next QL changed");
assert(TSD_CP005_HELD_CROSS_CHECKPOINT_MODES.length === 6 && TSD_CP005_INTERNAL_QA_MODES.length === 4, "CP005 V9 hold/QA counts changed");

assert(audit.every((row) => row.validation.valid) && selected.every((row) => row.validation.valid), "CP005 V9 generated invalid question");
assert(new Set(audit.map((row) => row.mathematicalFingerprint)).size === 390, "CP005 V9 audit fingerprints are not unique");
assert(new Set(selected.map((row) => row.mathematicalFingerprint)).size === 78, "CP005 V9 selected fingerprints are not unique");
assert(new Set(selected.map((row) => row.stem)).size === 78, "CP005 V9 standardized stems are not unique");
assert(new Set(selected.map((row) => row.solveMode)).size === 20, "CP005 V9 does not cover all 20 learner modes");
assert(new Set(selected.map((row) => row.permanentQlId)).size === 13, "CP005 V9 does not cover all 13 learner QLs");
assert(selected.every(isCp005ExamFriendlySelectedState), "CP005 V9 selected state violated V8 exam-friendly gate");

for (const ql of TSD_CP005_PERMANENT_QL_IDS) {
  const rows = selected.filter((row) => row.permanentQlId === ql);
  assert(rows.length === 6, `${ql}: CP005 V9 expected six selected questions`);
  assert(new Set(rows.map((row) => row.representation)).size >= 4, `${ql}: CP005 V9 representation diversity below four`);
}
for (const authority of TSD_CP005_APPROVED_LEARNER_AUTHORITIES) {
  const rows = audit.filter((row) => row.authorityKey === authority.authorityKey);
  assert(rows.length === 30 && new Set(rows.map((row) => row.mathematicalFingerprint)).size === 30, `${authority.authorityKey}: CP005 V9 audit diversity failed`);
}

const forbiddenStemPhrases = ["towns A and B", "fixed endpoints A and B", "bounded route", "motion log", "road trial", "runner", "cyclist", "both-endpoint motion", "keep reflecting"];
for (const row of selected) {
  const lower = row.stem.toLowerCase();
  assert(forbiddenStemPhrases.every((phrase) => !lower.includes(phrase.toLowerCase())), `${row.permanentQlId}/${row.solveMode}: CP005 V9 non-standard stem wording survived`);
  assert(row.stem.includes("P") && row.stem.includes("Q"), `${row.permanentQlId}/${row.solveMode}: CP005 V9 stem does not use clear P/Q endpoint notation`);
  assert(!RAW_FRACTION.test(row.stem), `${row.permanentQlId}/${row.solveMode}: CP005 V9 stem contains raw fraction`);
  assert(!RAW_FRACTION.test(row.answerText), `${row.permanentQlId}/${row.solveMode}: CP005 V9 answer contains raw fraction`);
  const explanation = [row.explanation.method, ...row.explanation.steps, row.explanation.shortcut, row.explanation.finalAnswer].join(" ");
  assert(!hasAwkwardFraction(explanation), `${row.permanentQlId}/${row.solveMode}: CP005 V9 explanation contains awkward fraction`);
  assert(!explanation.includes("A's starting end") && !explanation.includes("A's end"), `${row.permanentQlId}/${row.solveMode}: CP005 V9 explanation endpoint notation is inconsistent with P/Q stem`);
  assert(row.explanation.steps.length >= 3 && /\d/.test(row.explanation.steps.join(" ")), `${row.permanentQlId}/${row.solveMode}: CP005 V9 explanation lacks connected numeric work`);
  assert(row.explanation.finalAnswer.includes(row.answerText), `${row.permanentQlId}/${row.solveMode}: CP005 V9 final answer mismatch`);
}

const selectedNthRows = selected.filter((row) => row.solveMode === "findNthMeetingTimeOnLine" || row.solveMode === "findNthMeetingPointOnLine");
assert(selectedNthRows.every((row) => (row.input.nthMeeting ?? 0) >= 3), "CP005 V9 selected nth representation duplicates the dedicated second-meeting form");
const oneTurnRows = selected.filter((row) => ["findMeetingAfterOneTravellerTurnsBack", "findShuttleMeetingTime", "findPassThenCatchAfterTurnaround"].includes(row.solveMode));
assert(new Set(oneTurnRows.map((row) => row.stem.replace(/\d+(?:\.\d+)?/g, "#"))).size >= 3, "CP005 V9 one-turn merged modes are not editorially distinct");

const heldModes = new Set(TSD_CP005_HELD_CROSS_CHECKPOINT_MODES.map((entry) => entry.solveMode));
const qaModes = new Set(TSD_CP005_INTERNAL_QA_MODES.map((entry) => entry.solveMode));
assert(selected.every((row) => !heldModes.has(row.solveMode) && !qaModes.has(row.solveMode)), "CP005 V9 held/QA mode leaked into learner surface");
assert(audit.every((row) => row.options.length === 4 && new Set(row.options).size === 4), "CP005 V9 audit option uniqueness failed");
const exactWrongWorkings = audit.reduce((total, row) => total + row.internalOptionAudit.filter((entry) => !entry.isCorrect && entry.wrongWorking).length, 0);
assert(exactWrongWorkings === 1170, "CP005 V9 wrong-working count changed");
const correctOptionPositions = [0, 1, 2, 3].map((position) => audit.filter((row) => row.correctIndex === position).length);
assert(correctOptionPositions.every((count) => count >= 75), `CP005 V9 answer-position balance too weak: ${correctOptionPositions.join(",")}`);
const difficulty = {
  EASY: selected.filter((row) => row.difficulty === "EASY").length,
  MEDIUM: selected.filter((row) => row.difficulty === "MEDIUM").length,
  HARD: selected.filter((row) => row.difficulty === "HARD").length,
};
assert(difficulty.EASY === 24 && difficulty.MEDIUM === 36 && difficulty.HARD === 18, `CP005 V9 difficulty mix changed: ${JSON.stringify(difficulty)}`);

assert(audit.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN" && !row.lifecycle.questionStudioEnabled && row.lifecycle.questionBankStatus === "NOT_STORED" && row.lifecycle.testEligibility === "INELIGIBLE" && !row.lifecycle.publiclyPublishable), "CP005 V9 lifecycle lock violated");
assert(TSD_CP004_ENGLISH_FREEZE_STATUS === "APPROVED_ENGLISH_FROZEN" && TSD_CP004_ENGLISH_FREEZE_ID === "TSD-CP-004-EN-v1-frozen" && TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD === "99b65d54c87bfe456182bbcbad5963d30579952c", "CP004 approved English freeze identity changed");

const rawFractionDistractorRows = selected.filter((row) => row.options.some((option) => option !== row.answerText && RAW_FRACTION.test(option))).length;
console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_ENGLISH_REVIEW_CANDIDATE_V9",
  permanentQlRange: "TSD-QL-058..TSD-QL-070",
  nextPermanentQl: TSD_CP005_NEXT_PERMANENT_QL_ID,
  learnerAuthorities: 13,
  learnerSolveModesCovered: 20,
  auditQuestions: 390,
  selectedQuestions: 78,
  auditUniqueFingerprints: 390,
  selectedUniqueFingerprints: 78,
  selectedUniqueStems: 78,
  selectedRawFractionStems: 0,
  selectedRawFractionCorrectAnswers: 0,
  selectedNthRowsMinimumN: Math.min(...selectedNthRows.map((row) => row.input.nthMeeting ?? 0)),
  rawFractionDistractorRows,
  exactWrongWorkings,
  correctOptionPositions,
  difficulty,
  endpointNotation: "TRAVELLERS_A_B_ENDPOINTS_P_Q",
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
