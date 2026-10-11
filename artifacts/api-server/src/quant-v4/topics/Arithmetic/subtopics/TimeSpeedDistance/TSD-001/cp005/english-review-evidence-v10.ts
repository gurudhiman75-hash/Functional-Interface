import "./english-review-evidence-v9";
import { generateCp005ReviewSetV10 } from "./english-review-runtime-v10";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rows = generateCp005ReviewSetV10(6);
assert(rows.length === 78, `CP005 V10 expected 78 selected questions, received ${rows.length}`);
assert(new Set(rows.map((row) => row.stem)).size === 78, "CP005 V10 selected stems lost uniqueness");
assert(new Set(rows.map((row) => row.mathematicalFingerprint)).size === 78, "CP005 V10 selected fingerprints lost uniqueness");
assert(rows.every((row) => row.options.length === 4 && new Set(row.options).size === 4), "CP005 V10 selected option uniqueness failed");

const oneTurnModes = new Set(["findMeetingAfterOneTravellerTurnsBack", "findShuttleMeetingTime", "findPassThenCatchAfterTurnaround"]);
const oneTurnRows = rows.filter((row) => oneTurnModes.has(row.solveMode));
assert(oneTurnRows.length === 6, `CP005 V10 expected six selected one-turn timing questions, received ${oneTurnRows.length}`);
for (const row of oneTurnRows) {
  assert(row.internalOptionAudit.some((entry) => entry.misconceptionId === "USE_SLOWER_FULL_ROUTE_TIME" && !entry.isCorrect && entry.wrongWorking), `${row.solveMode}: V10 slower-full-route misconception missing`);
  assert(!row.internalOptionAudit.some((entry) => entry.misconceptionId === "USE_PURSUIT_DIFFERENCE_AFTER_TURN"), `${row.solveMode}: implausible pursuit-difference distractor survived V10`);
  assert(row.options[row.correctIndex] === row.answerText, `${row.solveMode}: V10 correct option mapping changed`);
}

const rawFractionDistractorRows = rows.filter((row) => row.options.some((option) => option !== row.answerText && /\b\d+\/\d+\b/.test(option))).length;
console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_ENGLISH_REVIEW_CANDIDATE_V10",
  selectedQuestions: rows.length,
  oneTurnTimingQuestionsHardened: oneTurnRows.length,
  removedMisconception: "USE_PURSUIT_DIFFERENCE_AFTER_TURN",
  replacementMisconception: "USE_SLOWER_FULL_ROUTE_TIME",
  rawFractionDistractorRows,
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
