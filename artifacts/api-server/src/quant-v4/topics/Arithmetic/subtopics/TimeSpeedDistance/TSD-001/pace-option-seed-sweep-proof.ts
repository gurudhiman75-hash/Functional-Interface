import {
  divide,
  multiply,
  rational,
  type Rational,
} from "./foundation/rational";
import { convertDistance, convertTime } from "./foundation/units";
import { hasTsdCalculationEvidence } from "./cp001/exact-option-feedback";
import type { TsdCp001GeneratedQuestion, TsdCp001MisconceptionId } from "./cp001/runtime-types";
import {
  cp001AuthorityByMode,
  generateCp001Candidate,
  stableStringify,
} from "./cp001/runtime";
import { formatExamNumber } from "./cp001/runtime-support";
import { calibratedDifficultyLabel } from "./difficulty-calibration";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type PaceMode = "speedFromPace" | "paceFromSpeed" | "distanceFromPaceAndTime";
type ExpectedWrong = readonly [string, TsdCp001MisconceptionId];

const MODES: readonly PaceMode[] = [
  "speedFromPace",
  "paceFromSpeed",
  "distanceFromPaceAndTime",
];

function withoutDisplayedOption(reason: string, optionText: string): string {
  return reason.replace(optionText, "").replace(/^[✅⚠️\s:.-]+/, "").trim();
}

function formatLikeCorrect(question: TsdCp001GeneratedQuestion, value: Rational): string {
  const correctText = question.optionAudit.find((option) => option.isCorrect)?.text;
  assert(correctText, `${question.questionLanguageId}: correct option missing`);
  const match = correctText.match(/^[-+]?(?:\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)(.*)$/);
  assert(match, `${question.questionLanguageId}: cannot identify answer-unit suffix`);
  return `${formatExamNumber(value)}${match[1]}`;
}

function expectedWrongOptions(question: TsdCp001GeneratedQuestion): readonly ExpectedWrong[] {
  const input = question.input;
  if (input.solveMode === "speedFromPace") {
    if (input.outputUnit === "KMPH" && input.paceUnit === "MINUTE_PER_KM") {
      return [
        [formatLikeCorrect(question, input.pace), "FAIL_TO_INVERT_PACE"],
        [formatLikeCorrect(question, multiply(rational(60), input.pace)), "MULTIPLY_INSTEAD_OF_DIVIDE"],
        [formatLikeCorrect(question, divide(rational(1), input.pace)), "OMIT_UNIT_CONVERSION"],
      ];
    }
    assert(input.outputUnit === "MPS" && input.paceUnit === "SECOND_PER_KM", `${question.questionLanguageId}: unexpected speed-from-pace profile`);
    return [
      [formatLikeCorrect(question, input.pace), "FAIL_TO_INVERT_PACE"],
      [formatLikeCorrect(question, divide(input.pace, rational(1000))), "REVERSE_DIVISION"],
      [formatLikeCorrect(question, divide(rational(1000), multiply(input.pace, rational(60)))), "TREAT_SECONDS_AS_MINUTES"],
    ];
  }

  if (input.solveMode === "paceFromSpeed") {
    if (input.outputUnit === "MINUTE_PER_KM" && input.speedUnit === "KMPH") {
      return [
        [formatLikeCorrect(question, input.speed), "FAIL_TO_INVERT_PACE"],
        [formatLikeCorrect(question, multiply(rational(60), input.speed)), "MULTIPLY_INSTEAD_OF_DIVIDE"],
        [formatLikeCorrect(question, divide(rational(1), input.speed)), "OMIT_UNIT_CONVERSION"],
      ];
    }
    assert(input.outputUnit === "SECOND_PER_KM" && input.speedUnit === "MPS", `${question.questionLanguageId}: unexpected pace-from-speed profile`);
    return [
      [formatLikeCorrect(question, input.speed), "FAIL_TO_INVERT_PACE"],
      [formatLikeCorrect(question, divide(rational(100), input.speed)), "USE_WRONG_CONVERSION_FACTOR"],
      [formatLikeCorrect(question, divide(rational(1000), multiply(input.speed, rational(60)))), "TREAT_SECONDS_AS_MINUTES"],
    ];
  }

  assert(input.solveMode === "distanceFromPaceAndTime", `${question.questionLanguageId}: expected pace family`);
  const paceTimeUnit = input.paceUnit === "SECOND_PER_KM" ? "SECOND" : "MINUTE";
  const matchingDuration = convertTime(input.duration, input.timeUnit, paceTimeUnit);
  const reversedKm = divide(input.pace, matchingDuration);
  if (input.outputUnit === "M") {
    const distanceKm = divide(matchingDuration, input.pace);
    return [
      [formatLikeCorrect(question, distanceKm), "OMIT_UNIT_CONVERSION"],
      [formatLikeCorrect(question, convertDistance(reversedKm, "KM", "M")), "REVERSE_DIVISION"],
      [formatLikeCorrect(question, input.duration), "USE_SECOND_QUANTITY_ONLY"],
    ];
  }
  assert(input.outputUnit === "KM", `${question.questionLanguageId}: unexpected distance-from-pace profile`);
  return [
    [formatLikeCorrect(question, input.pace), "USE_FIRST_QUANTITY_ONLY"],
    [formatLikeCorrect(question, input.duration), "USE_SECOND_QUANTITY_ONLY"],
    [formatLikeCorrect(question, reversedKm), "REVERSE_DIVISION"],
  ];
}

const profiles = new Map<PaceMode, Set<string>>(MODES.map((mode) => [mode, new Set<string>()]));
let questions = 0;
let wrongOptions = 0;
let maximumReasonWords = 0;

for (const mode of MODES) {
  const authority = cp001AuthorityByMode(mode);
  for (let index = 0; index < 120; index += 1) {
    const question = generateCp001Candidate(authority.provisionalId, `pace-option-sweep:${mode}:${index}`);
    questions += 1;
    assert(question.solveMode === mode, `${question.questionLanguageId}: generated mode differs`);
    assert(question.validation.valid, `${question.questionLanguageId}: invalid candidate: ${question.validation.errors.join("; ")}`);
    assert(question.options.length === 4, `${question.questionLanguageId}: expected four options`);
    assert(new Set(question.options).size === 4, `${question.questionLanguageId}: duplicate options`);
    assert(question.optionAudit.length === 4, `${question.questionLanguageId}: option audit length changed`);
    assert(question.explanation.optionAnalysis.length === 4, `${question.questionLanguageId}: option analysis length changed`);
    assert(question.optionAudit[question.correctIndex]?.isCorrect, `${question.questionLanguageId}: keyed audit is not correct`);
    assert(question.options[question.correctIndex] === question.answerText, `${question.questionLanguageId}: keyed text differs from answer`);
    assert(question.representation === "STANDARD", `${question.questionLanguageId}: unexpected pace representation ${question.representation}`);
    assert(question.difficulty.status === "EDITORIALLY_CALIBRATED", `${question.questionLanguageId}: difficulty remains uncalibrated`);
    assert(question.difficulty.label === calibratedDifficultyLabel(question.difficulty.featureScore), `${question.questionLanguageId}: difficulty conflicts with rubric`);

    profiles.get(mode)?.add(stableStringify(question.input));

    const expected = expectedWrongOptions(question);
    for (const [text, misconceptionId] of expected) {
      const audit = question.optionAudit.find((option) =>
        !option.isCorrect && option.text === text && option.misconceptionId === misconceptionId
      );
      assert(audit, `${question.questionLanguageId}: missing ${misconceptionId} option ${text}`);
      const analysis = question.explanation.optionAnalysis.find((option) => option.text === text);
      assert(analysis, `${question.questionLanguageId}: missing analysis for ${text}`);
      assert(analysis.misconceptionId === misconceptionId, `${question.questionLanguageId}: analysis ID differs for ${text}`);
      assert(analysis.reason.includes(text), `${question.questionLanguageId}: reason does not name ${text}`);
      assert(hasTsdCalculationEvidence(withoutDisplayedOption(analysis.reason, text)), `${question.questionLanguageId}: pace reason lacks exact calculation evidence`);
      const words = analysis.reason.trim().split(/\s+/).length;
      maximumReasonWords = Math.max(maximumReasonWords, words);
      const maximumWords = analysis.reason.includes("Check:") ? 65 : 32;
      assert(words <= maximumWords, `${question.questionLanguageId}: pace reason exceeds ${maximumWords} words`);
      assert(!/different result|rules it out|does not survive|appears after|can be reached only|careful check|reworking/i.test(analysis.reason), `${question.questionLanguageId}: generic pace rejection remains`);
      wrongOptions += 1;
    }

    question.optionAudit.forEach((audit, optionIndex) => {
      const analysis = question.explanation.optionAnalysis[optionIndex];
      assert(audit.text === analysis.text, `${question.questionLanguageId}: audit-analysis text mismatch`);
      assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: audit-analysis ID mismatch`);
      assert(audit.isCorrect === analysis.isCorrect, `${question.questionLanguageId}: audit-analysis correctness mismatch`);
    });
  }
}

assert(questions === 360, `Expected 360 pace questions, received ${questions}`);
assert(wrongOptions === 1080, `Expected 1080 pace wrong options, received ${wrongOptions}`);
assert(profiles.get("speedFromPace")?.size === 5, `Expected five speed-from-pace profiles, received ${profiles.get("speedFromPace")?.size}`);
assert(profiles.get("paceFromSpeed")?.size === 5, `Expected five pace-from-speed profiles, received ${profiles.get("paceFromSpeed")?.size}`);
assert(profiles.get("distanceFromPaceAndTime")?.size === 5, `Expected five distance-from-pace profiles, received ${profiles.get("distanceFromPaceAndTime")?.size}`);

console.log(JSON.stringify({
  status: "PASS",
  questions,
  wrongOptions,
  speedFromPaceProfiles: profiles.get("speedFromPace")?.size,
  paceFromSpeedProfiles: profiles.get("paceFromSpeed")?.size,
  distanceFromPaceProfiles: profiles.get("distanceFromPaceAndTime")?.size,
  totalInputProfiles: [...profiles.values()].reduce((sum, values) => sum + values.size, 0),
  maximumReasonWords,
  difficultyStatus: "EDITORIALLY_CALIBRATED",
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
