import { hasTsdCalculationEvidence } from "./cp001/exact-option-feedback";
import {
  generateCp001Candidate,
  TSD_CP001_LEARNER_AUTHORITIES,
} from "./cp001/runtime";
import { TSD_CP002_LEARNER_AUTHORITIES } from "./cp002/discovery-registry";
import { generateCp002Candidate } from "./cp002/public-runtime";
import { examDifficultyLabel } from "./difficulty-calibration";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_CONTEXT_OBJECT_POOL } from "./learner-context";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const FORBIDDEN_JARGON = /\b(?:reconstruct|provisional|defining equation|harmonic(?:-average)? relation|simultaneous time-and-distance system|compatible units|collecting terms gives)\b/i;
const FORBIDDEN_DIRECT_IDS = new Set([
  "ADD_GIVENS_BEFORE_DIVIDING",
  "SUBTRACT_GIVENS_BEFORE_DIVIDING",
  "MISREAD_SPEED",
  "MISREAD_TIME",
  "MISREAD_DISTANCE",
  "ARITHMETIC_OFFSET",
]);
const MALFORMED_OPERATION = /(?:×|÷|\\times|\\div)\s*-?\d+(?:\.\d+)?(?:\/\d+)?\s+-?\d+(?:\.\d+)?(?:\/\d+)?/;

function words(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function withoutDisplayedOption(reason: string, optionText: string): string {
  return reason.replace(optionText, "").replace(/^[✅⚠️\s:.-]+/, "").trim();
}

function learnerText(question: ReturnType<typeof generateCp001Candidate> | ReturnType<typeof generateCp002Candidate>): string {
  return [
    question.stem,
    question.explanation.keyRule,
    ...question.explanation.stepByStepSolution,
    question.explanation.examSpeedShortcut,
    ...question.explanation.optionAnalysis.map((entry) => entry.reason),
  ].join(" ");
}

function assertQuestionQuality(question: ReturnType<typeof generateCp001Candidate> | ReturnType<typeof generateCp002Candidate>): { wrongReasons: number; maxReasonWords: number } {
  assert(question.validation.valid, `${question.questionLanguageId}: ${question.validation.errors.join("; ")}`);
  assert(question.options.length === 4 && new Set(question.options).size === 4, `${question.questionLanguageId}: options are not four unique choices`);
  assert(question.options[question.correctIndex] === question.answerText, `${question.questionLanguageId}: answer key differs`);
  assert(question.difficulty.status === "EDITORIALLY_CALIBRATED", `${question.questionLanguageId}: difficulty remains provisional`);
  assert(question.difficulty.label === examDifficultyLabel(question.solveMode, question.input), `${question.questionLanguageId}: difficulty does not match exam-family rubric`);
  assert(question.lifecycle.englishFreezeStatus === "UNFROZEN", `${question.questionLanguageId}: English freeze changed`);
  assert(question.lifecycle.questionBankStatus === "NOT_STORED", `${question.questionLanguageId}: Question Bank delivery changed`);
  assert(question.lifecycle.testEligibility === "INELIGIBLE", `${question.questionLanguageId}: test delivery changed`);
  assert(question.publiclyPublishable === false, `${question.questionLanguageId}: publication was enabled`);

  const text = learnerText(question);
  assert(!FORBIDDEN_JARGON.test(text), `${question.questionLanguageId}: avoidable jargon remains`);
  assert(!MALFORMED_OPERATION.test(text), `${question.questionLanguageId}: malformed arithmetic expression remains`);
  assert(words(question.explanation.keyRule) <= 28, `${question.questionLanguageId}: main rule is too long`);
  assert(words(question.explanation.examSpeedShortcut) <= 30, `${question.questionLanguageId}: shortcut is too long`);
  for (const step of question.explanation.stepByStepSolution) {
    assert(words(step) <= 30, `${question.questionLanguageId}: explanation step is too long: ${step}`);
  }
  assert(question.explanation.stepByStepSolution.length <= 7, `${question.questionLanguageId}: explanation has too many steps`);

  let wrongReasons = 0;
  let maxReasonWords = 0;
  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === analysis.text && audit.misconceptionId === analysis.misconceptionId && audit.isCorrect === analysis.isCorrect, `${question.questionLanguageId}: option feedback is misaligned`);
    assert(analysis.reason.includes(audit.text), `${question.questionLanguageId}: option reason omits ${audit.text}`);
    const remainder = withoutDisplayedOption(analysis.reason, audit.text);
    assert(hasTsdCalculationEvidence(remainder), `${question.questionLanguageId}: option reason has no calculation/check`);
    if (/(?:×|÷|\\times|\\div)/.test(remainder)) {
      assert(/=/.test(remainder), `${question.questionLanguageId}: operation has no equals sign in ${audit.text} feedback`);
    }
    const reasonWords = words(analysis.reason);
    maxReasonWords = Math.max(maxReasonWords, reasonWords);
    assert(reasonWords <= 70, `${question.questionLanguageId}: option reason is too long (${reasonWords} words)`);
    if (!audit.isCorrect) wrongReasons += 1;
    assert(!/^FAILS_.*_EQUATION$/.test(audit.misconceptionId), `${question.questionLanguageId}: generic FAILS_* misconception remains`);
  });

  if (
    question.solveMode === "distanceFromSpeedAndTime"
    || question.solveMode === "speedFromDistanceAndTime"
    || question.solveMode === "timeFromDistanceAndSpeed"
  ) {
    for (const audit of question.optionAudit.filter((entry) => !entry.isCorrect)) {
      assert(!FORBIDDEN_DIRECT_IDS.has(audit.misconceptionId), `${question.questionLanguageId}: artificial direct distractor remains: ${audit.misconceptionId}`);
    }
  }

  return { wrongReasons, maxReasonWords };
}

const canonicalRows = generateFinalAuthorityReview();
assert(canonicalRows.length === 153, `Expected 153 canonical rows, received ${canonicalRows.length}`);
let canonicalWrongReasons = 0;
let maximumReasonWords = 0;
for (const row of canonicalRows) {
  const metrics = assertQuestionQuality(row.sourceQuestion);
  canonicalWrongReasons += metrics.wrongReasons;
  maximumReasonWords = Math.max(maximumReasonWords, metrics.maxReasonWords);
}
assert(canonicalWrongReasons === 459, `Expected 459 canonical wrong reasons, received ${canonicalWrongReasons}`);

const objectNames = [
  ...TSD_CONTEXT_OBJECT_POOL.motor,
  ...TSD_CONTEXT_OBJECT_POOL.running,
  ...TSD_CONTEXT_OBJECT_POOL.cycling,
].sort((first, second) => second.length - first.length);
const generatedObjects = new Map<string, number>();
let generatedQuestions = 0;
let generatedWrongReasons = 0;

function recordObject(stem: string): void {
  const object = objectNames.find((candidate) => new RegExp(`\\b${candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(stem));
  if (!object) return;
  generatedObjects.set(object, (generatedObjects.get(object) ?? 0) + 1);
}

for (const authority of TSD_CP001_LEARNER_AUTHORITIES) {
  for (let index = 0; index < 12; index += 1) {
    const question = generateCp001Candidate(authority.provisionalId, `learner-quality:cp001:${authority.provisionalId}:${index}`);
    const metrics = assertQuestionQuality(question);
    generatedWrongReasons += metrics.wrongReasons;
    maximumReasonWords = Math.max(maximumReasonWords, metrics.maxReasonWords);
    generatedQuestions += 1;
    recordObject(question.stem);
  }
}
for (const authority of TSD_CP002_LEARNER_AUTHORITIES) {
  for (let index = 0; index < 12; index += 1) {
    const question = generateCp002Candidate(authority.provisionalId, `learner-quality:cp002:${authority.provisionalId}:${index}`);
    const metrics = assertQuestionQuality(question);
    generatedWrongReasons += metrics.wrongReasons;
    maximumReasonWords = Math.max(maximumReasonWords, metrics.maxReasonWords);
    generatedQuestions += 1;
    recordObject(question.stem);
  }
}

assert(generatedQuestions === (TSD_CP001_LEARNER_AUTHORITIES.length + TSD_CP002_LEARNER_AUTHORITIES.length) * 12, `Unexpected generated question count: ${generatedQuestions}`);
assert(generatedWrongReasons === generatedQuestions * 3, `Unexpected generated wrong-reason count: ${generatedWrongReasons}`);
assert(generatedObjects.size >= 22, `Generated object diversity is too low: ${generatedObjects.size}`);
const generatedActorRows = [...generatedObjects.values()].reduce((sum, count) => sum + count, 0);
const carBus = (generatedObjects.get("car") ?? 0) + (generatedObjects.get("bus") ?? 0);
assert(generatedActorRows > 0, "No generated actor contexts were found");
assert(carBus / generatedActorRows <= 0.15, `Generated car/bus concentration is too high: ${(carBus / generatedActorRows * 100).toFixed(1)}%`);

console.log(JSON.stringify({
  status: "PASS",
  canonicalRecords: canonicalRows.length,
  canonicalWrongReasons,
  generatedQuestions,
  generatedWrongReasons,
  distinctGeneratedObjects: generatedObjects.size,
  generatedCarBusShare: carBus / generatedActorRows,
  maximumReasonWords,
  artificialDirectDistractors: 0,
  genericFailsIds: 0,
  malformedOperations: 0,
  difficultyStatus: "EDITORIALLY_CALIBRATED",
  permanentQls: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
