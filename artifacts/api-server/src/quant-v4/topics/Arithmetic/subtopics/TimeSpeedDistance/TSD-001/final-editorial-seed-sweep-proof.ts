import {
  cp001AuthorityByMode,
  generateCp001Candidate,
} from "./cp001/runtime";
import { hasTsdCalculationEvidence } from "./cp001/exact-option-feedback";
import type { TsdCp001DiscoverySolveMode } from "./cp001/discovery-registry";
import { examDifficultyLabel } from "./difficulty-calibration";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function withoutDisplayedOption(reason: string, optionText: string): string {
  return reason.replace(optionText, "").replace(/^[✅⚠️\s:.-]+/, "").trim();
}

const MODES = [
  "distanceByProportion",
  "timeByProportion",
  "speedByProportion",
  "arrivalClockTime",
  "departureClockTime",
] as const satisfies readonly TsdCp001DiscoverySolveMode[];

const GENERIC = /different result|does not survive|rules it out|not the result|appears after|careful check|can be reached only|does not give|recomputing[^.]*rules/i;
const modeCounts = new Map<string, number>();
const profileKeys = new Set<string>();
let questions = 0;
let wrongOptions = 0;
let maximumReasonWords = 0;

for (const mode of MODES) {
  const authority = cp001AuthorityByMode(mode);
  for (let index = 0; index < 100; index += 1) {
    const question = generateCp001Candidate(
      authority.provisionalId,
      `final-editorial-sweep:${mode}:${index}`,
    );
    assert(question.solveMode === mode, `${mode}:${index}: generated the wrong solve mode`);
    assert(question.validation.valid, `${question.questionLanguageId}: ${question.validation.errors.join("; ")}`);
    assert(question.options.length === 4 && new Set(question.options).size === 4, `${question.questionLanguageId}: options are not unique`);
    assert(question.options[question.correctIndex] === question.answerText, `${question.questionLanguageId}: answer key differs`);
    assert(question.optionAudit[question.correctIndex]?.isCorrect, `${question.questionLanguageId}: correct audit is missing`);
    assert(question.explanation.optionAnalysis.length === 4, `${question.questionLanguageId}: option analysis is incomplete`);
    assert(question.difficulty.status === "EDITORIALLY_CALIBRATED", `${question.questionLanguageId}: difficulty remains uncalibrated`);
    assert(question.difficulty.label === examDifficultyLabel(question.solveMode, question.input), `${question.questionLanguageId}: difficulty conflicts with exam-family rubric`);

    question.optionAudit.forEach((audit, optionIndex) => {
      const analysis = question.explanation.optionAnalysis[optionIndex];
      assert(audit.text === question.options[optionIndex], `${question.questionLanguageId}: option-audit mismatch`);
      assert(audit.text === analysis.text, `${question.questionLanguageId}: audit-analysis text mismatch`);
      assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: audit-analysis ID mismatch`);
      assert(audit.isCorrect === analysis.isCorrect, `${question.questionLanguageId}: audit-analysis correctness mismatch`);
      if (audit.isCorrect) return;
      assert(analysis.reason.includes(audit.text), `${question.questionLanguageId}: reason does not name ${audit.text}`);
      assert(hasTsdCalculationEvidence(withoutDisplayedOption(analysis.reason, audit.text)), `${question.questionLanguageId}: reason lacks exact numerical evidence`);
      assert(!GENERIC.test(analysis.reason), `${question.questionLanguageId}: generic wording remains`);
      const words = analysis.reason.trim().split(/\s+/).length;
      maximumReasonWords = Math.max(maximumReasonWords, words);
      const maximumWords = analysis.reason.includes("Check:") ? 65 : 55;
      assert(words <= maximumWords, `${question.questionLanguageId}: reason exceeds ${maximumWords} words`);
      wrongOptions += 1;
    });

    if (
      mode === "distanceByProportion"
      || mode === "timeByProportion"
      || mode === "speedByProportion"
    ) {
      const weakLabels = question.optionAudit.filter((option) => !option.isCorrect).filter((option) => (
        option.misconceptionId === "DIVISION_ERROR"
        || option.misconceptionId === "MISREAD_TIME"
        || option.misconceptionId === "ARITHMETIC_OFFSET"
      ));
      assert(weakLabels.length === 0, `${question.questionLanguageId}: weak proportion labels remain`);
    } else {
      assert(
        question.optionAudit.every((option) => option.misconceptionId !== "USE_GIVEN_DURATION_AS_ANSWER"),
        `${question.questionLanguageId}: copied clock label was not corrected`,
      );
    }

    profileKeys.add(`${mode}|${JSON.stringify(question.input, (_key, value) => typeof value === "bigint" ? value.toString() : value)}`);
    modeCounts.set(mode, (modeCounts.get(mode) ?? 0) + 1);
    questions += 1;
  }
}

assert(questions === 500, `Expected 500 generated questions, received ${questions}`);
assert(wrongOptions === 1500, `Expected 1500 wrong options, received ${wrongOptions}`);
for (const mode of MODES) {
  assert(modeCounts.get(mode) === 100, `${mode}: expected 100 questions`);
}
assert(profileKeys.size >= 25, `Expected at least 25 mathematical profiles, received ${profileKeys.size}`);

console.log(JSON.stringify({
  status: "PASS",
  questions,
  wrongOptions,
  modeCounts: Object.fromEntries(modeCounts),
  mathematicalProfiles: profileKeys.size,
  maximumReasonWords,
  difficultyStatus: "EDITORIALLY_CALIBRATED",
  permanentQls: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
