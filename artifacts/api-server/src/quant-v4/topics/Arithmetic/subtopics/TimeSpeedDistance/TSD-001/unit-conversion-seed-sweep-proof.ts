import {
  cp001AuthorityByMode,
  generateCp001Candidate,
} from "./cp001/runtime";
import { hasTsdCalculationEvidence } from "./cp001/exact-option-feedback";
import type { TsdCp001DiscoverySolveMode } from "./cp001/discovery-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function withoutDisplayedOption(reason: string, optionText: string): string {
  return reason.replace(optionText, "").replace(/^[✅⚠️\s:.-]+/, "").trim();
}

const MODES = [
  "convertSpeedUnit",
  "convertDistanceUnit",
  "convertTimeUnit",
] as const satisfies readonly TsdCp001DiscoverySolveMode[];

const pairs = new Map<string, number>();
let questions = 0;
let wrongOptions = 0;
let equivalentSpeedSets = 0;
let maximumReasonWords = 0;

for (const mode of MODES) {
  const authority = cp001AuthorityByMode(mode);
  for (let index = 0; index < 120; index += 1) {
    const question = generateCp001Candidate(
      authority.provisionalId,
      `unit-conversion-sweep:${mode}:${index}`,
    );
    questions += 1;
    assert(question.validation.valid, `${question.questionLanguageId}: generated candidate is invalid`);
    assert(question.options.length === 4, `${question.questionLanguageId}: option count changed`);
    assert(new Set(question.options).size === 4, `${question.questionLanguageId}: duplicate option text`);
    assert(question.optionAudit.length === 4, `${question.questionLanguageId}: audit count changed`);
    assert(question.explanation.optionAnalysis.length === 4, `${question.questionLanguageId}: analysis count changed`);
    assert(question.optionAudit[question.correctIndex]?.isCorrect, `${question.questionLanguageId}: correct index is invalid`);
    assert(question.answerText === question.options[question.correctIndex], `${question.questionLanguageId}: answer and keyed option differ`);

    const input = question.input;
    assert(
      input.solveMode === "convertSpeedUnit"
        || input.solveMode === "convertDistanceUnit"
        || input.solveMode === "convertTimeUnit",
      `${question.questionLanguageId}: non-conversion input reached sweep`,
    );
    const pair = `${input.solveMode}:${input.from}->${input.to}:${question.representation}`;
    pairs.set(pair, (pairs.get(pair) ?? 0) + 1);
    if (question.representation === "EQUIVALENT_SPEED_SET") equivalentSpeedSets += 1;

    question.optionAudit.forEach((audit, optionIndex) => {
      const analysis = question.explanation.optionAnalysis[optionIndex];
      assert(audit.text === analysis.text, `${question.questionLanguageId}: option-analysis text mismatch`);
      assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: option-analysis ID mismatch`);
      assert(audit.isCorrect === analysis.isCorrect, `${question.questionLanguageId}: option-analysis correctness mismatch`);
      if (audit.isCorrect) return;
      wrongOptions += 1;
      assert(analysis.reason.includes(audit.text), `${question.questionLanguageId}: wrong-option reason omits its option`);
      const remainder = withoutDisplayedOption(analysis.reason, audit.text);
      assert(hasTsdCalculationEvidence(remainder), `${question.questionLanguageId}: wrong-option reason lacks exact conversion evidence`);
      const words = analysis.reason.trim().split(/\s+/).length;
      maximumReasonWords = Math.max(maximumReasonWords, words);
      const maximumWords = analysis.reason.includes("Check:") ? 65 : 34;
      assert(words <= maximumWords, `${question.questionLanguageId}: wrong-option reason exceeds ${maximumWords} words`);
      assert(
        !/different result|rules it out|does not survive|appears after|can be reached only|careful check/i.test(analysis.reason),
        `${question.questionLanguageId}: generic conversion feedback remains for ${audit.text}`,
      );
    });
  }
}

assert(questions === 360, `Expected 360 sweep questions, received ${questions}`);
assert(wrongOptions === 1080, `Expected 1080 swept wrong options, received ${wrongOptions}`);
assert(pairs.size >= 9, `Expected at least nine conversion representation profiles, received ${pairs.size}`);
assert(equivalentSpeedSets > 0, "Equivalent-speed-set representation was not exercised");

console.log(JSON.stringify({
  status: "PASS",
  questions,
  wrongOptions,
  equivalentSpeedSets,
  maximumReasonWords,
  conversionProfiles: Object.fromEntries([...pairs.entries()].sort(([left], [right]) => left.localeCompare(right))),
}, null, 2));
