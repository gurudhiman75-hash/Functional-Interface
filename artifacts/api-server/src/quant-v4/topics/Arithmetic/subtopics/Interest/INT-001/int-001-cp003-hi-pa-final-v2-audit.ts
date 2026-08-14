import { INT_CP003_QL_IDS, type Rational } from "./cp003-exam-model";
import { generateIntCp003EnglishFrozenQuestion } from "./cp003-english-frozen-runtime";
import { generateIntCp003FinalLocalizedQuestionV2 } from "./cp003-localized-final-runtime-v2";
import type { IntCp003LocalizedLocale } from "./cp003-localization-types";

const LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const satisfies readonly IntCp003LocalizedLocale[]);
const QUESTIONS_PER_QL = 100;

function sameRational(left: Rational, right: Rational): boolean {
  return left.numerator === right.numerator && left.denominator === right.denominator;
}

function collectStrings(value: unknown, output: string[] = []): string[] {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output));
  else if (value && typeof value === "object") Object.values(value as Record<string, unknown>).forEach((item) => collectStrings(item, output));
  return output;
}

function outsideMath(text: string): string {
  return text
    .replace(/\\\([^]*?\\\)/gu, "")
    .replace(/\\\[[^]*?\\\]/gu, "");
}

function assertLearnerSurface(locale: IntCp003LocalizedLocale, strings: readonly string[], label: string): void {
  const joined = strings.join("\n");
  if (/\$/u.test(joined)) throw new Error(`${label}: legacy dollar MathJax delimiter reached learner content.`);
  if (/\d[\d,]*\.\d{3,}/u.test(joined)) throw new Error(`${label}: visible decimal exceeds two places.`);
  if (/₹\s*\d[\d,]*\.00\b/u.test(joined)) throw new Error(`${label}: whole-rupee .00 formatting reached learner content.`);
  if (/\b(?:NaN|Infinity|undefined|null)\b/u.test(joined)) throw new Error(`${label}: machine value reached learner content.`);
  if (/\b(?:TODO|TBD|placeholder|traceVersion|misconceptionId|sourceStepIds)\b/iu.test(joined)) throw new Error(`${label}: internal/editorial token reached learner content.`);
  if (locale === "pa-IN" && /ਚੱਕਰਵੱਧੀ ਵਿਆਜ/gu.test(joined)) throw new Error(`${label}: rejected Punjabi compound-interest term reached learner content.`);
  if (/ज्ञात कीजिए|ਪਤਾ ਕਰੋ/gu.test(joined)) throw new Error(`${label}: command-style learner prompt survived final editorial pass.`);

  for (const text of strings) {
    const prose = outsideMath(text);
    if (/[=×÷^]|\\(?:frac|times|div|left|right|%)/u.test(prose)) {
      throw new Error(`${label}: raw mathematical syntax exists outside Examtree MathJax wrappers: ${text}`);
    }
  }
}

let questions = 0;
let parityChecks = 0;
let wrapperChecks = 0;
let decimalChecks = 0;
let formulaFirstChecks = 0;
let optionChecks = 0;
let sourceStepChecks = 0;
let lifecycleChecks = 0;
let punjabiMishritOccurrences = 0;
const answerPositions = [0, 0, 0, 0];
const representations = new Set<string>();

for (const qlId of INT_CP003_QL_IDS) {
  for (let index = 0; index < QUESTIONS_PER_QL; index += 1) {
    const seed = `int-cp003-hi-pa-final-v2:${qlId}:${index}`;
    const english = generateIntCp003EnglishFrozenQuestion(qlId, seed);
    for (const locale of LOCALES) {
      const localized = generateIntCp003FinalLocalizedQuestionV2(qlId, seed, locale);
      const label = `${qlId}/${seed}/${locale}`;
      questions += 1;
      representations.add(localized.presentation.representation);

      if (localized.mathematicalFingerprint !== english.mathematicalFingerprint) throw new Error(`${label}: mathematical fingerprint drift.`);
      if (!sameRational(localized.solution, english.solution)) throw new Error(`${label}: canonical solution drift.`);
      if (localized.correctIndex !== english.correctIndex) throw new Error(`${label}: correct-index drift.`);
      if (localized.options.length !== english.options.length) throw new Error(`${label}: option-count drift.`);
      parityChecks += 3;

      localized.options.forEach((option, optionIndex) => {
        const source = english.options[optionIndex]!;
        if (!sameRational(option.value, source.value)) throw new Error(`${label}: option ${optionIndex} value drift.`);
        if (option.misconceptionId !== source.misconceptionId) throw new Error(`${label}: option ${optionIndex} misconception ownership drift.`);
        if (option.isCorrect !== source.isCorrect) throw new Error(`${label}: option ${optionIndex} correctness drift.`);
        optionChecks += 3;
      });
      if (new Set(localized.options.map((option) => option.text)).size !== 4) throw new Error(`${label}: duplicate visible options.`);
      if (localized.options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${label}: correct-option cardinality failure.`);
      if (localized.correctAnswer !== localized.options[localized.correctIndex]!.text) throw new Error(`${label}: correct-answer display mismatch.`);
      answerPositions[localized.correctIndex] += 1;

      if (JSON.stringify(localized.explanation.sourceStepIds) !== JSON.stringify(english.explanation.sourceStepIds)) throw new Error(`${label}: main explanation source-step identity drift.`);
      if (JSON.stringify(localized.explanation.depths.exam.sourceStepIds) !== JSON.stringify(english.explanation.depths.exam.sourceStepIds)) throw new Error(`${label}: exam-depth source-step identity drift.`);
      if (JSON.stringify(localized.explanation.depths.student.sourceStepIds) !== JSON.stringify(english.explanation.depths.student.sourceStepIds)) throw new Error(`${label}: student-depth source-step identity drift.`);
      if (JSON.stringify(localized.explanation.depths.foundation.sourceStepIds) !== JSON.stringify(english.explanation.depths.foundation.sourceStepIds)) throw new Error(`${label}: foundation-depth source-step identity drift.`);
      sourceStepChecks += 4;

      const firstStep = localized.explanation.steps[0] ?? "";
      const expectedLabel = locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
      if (!firstStep.startsWith(expectedLabel) || !/\\\(.+\\\)/u.test(firstStep)) throw new Error(`${label}: explanation is not formula-first with Examtree wrappers.`);
      formulaFirstChecks += 1;

      const learnerStrings = [
        localized.presentation.markdown,
        ...localized.options.flatMap((option) => [option.text, option.calculation, option.studentFeedback]),
        localized.explanation.keyIdea,
        ...localized.explanation.steps,
        localized.explanation.finalAnswer,
        ...(localized.explanation.shortcut?.steps ?? []),
        ...(localized.explanation.commonMistake ? [localized.explanation.commonMistake] : []),
        ...(localized.explanation.verification?.steps ?? []),
      ];
      assertLearnerSurface(locale, learnerStrings, label);
      wrapperChecks += learnerStrings.length;
      decimalChecks += collectStrings(learnerStrings).length;
      if (locale === "pa-IN") punjabiMishritOccurrences += learnerStrings.filter((text) => /ਮਿਸ਼ਰਤ ਵਿਆਜ/gu.test(text)).length;

      if (
        localized.enabled
        || localized.stagingStatus !== "NOT_STAGED"
        || localized.registrationStatus !== "NOT_REGISTERED"
        || localized.questionStudioDiscoverable
        || localized.questionBankStatus !== "NOT_STORED"
        || localized.testEligibility !== "INELIGIBLE"
        || localized.publiclyPublishable
        || localized.lifecycle.enabled
        || localized.lifecycle.registrationStatus !== "NOT_REGISTERED"
        || localized.lifecycle.questionStudioDiscoverable
      ) throw new Error(`${label}: delivery lifecycle opened.`);
      lifecycleChecks += 10;
    }
  }
}

if (questions !== 2800) throw new Error(`Expected 2,800 localized questions, received ${questions}.`);
if (punjabiMishritOccurrences === 0) throw new Error("Punjabi final corpus never exercised the required ਮਿਸ਼ਰਤ ਵਿਆਜ terminology.");
if (representations.size !== 6) throw new Error(`Expected all 6 CP003 representations, received ${representations.size}.`);

console.log(JSON.stringify({
  status: "PASS_INT_CP003_HI_PA_FINAL_V2",
  questions,
  hindi: questions / 2,
  punjabi: questions / 2,
  parityChecks,
  optionChecks,
  sourceStepChecks,
  formulaFirstChecks,
  wrapperChecks,
  decimalChecks,
  lifecycleChecks,
  punjabiMishritOccurrences,
  answerPositions,
  representations: [...representations].sort(),
}, null, 2));
