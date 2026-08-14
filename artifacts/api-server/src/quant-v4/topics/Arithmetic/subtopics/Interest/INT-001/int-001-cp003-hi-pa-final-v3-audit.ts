import { INT_CP003_QL_IDS, type Rational } from "./cp003-exam-model";
import { generateIntCp003EnglishFrozenQuestion } from "./cp003-english-frozen-runtime";
import { generateIntCp003FinalLocalizedQuestionV3 } from "./cp003-localized-final-runtime-v3";
import type { IntCp003LocalizedLocale } from "./cp003-localization-types";

const LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const satisfies readonly IntCp003LocalizedLocale[]);
const QUESTIONS_PER_QL = 100;

function sameRational(left: Rational, right: Rational): boolean {
  return left.numerator === right.numerator && left.denominator === right.denominator;
}
function outsideMath(text: string): string {
  return text.replace(/\\\([^]*?\\\)/gu, "").replace(/\\\[[^]*?\\\]/gu, "");
}
function collectLearnerStrings(question: ReturnType<typeof generateIntCp003FinalLocalizedQuestionV3>): string[] {
  return [
    question.presentation.markdown,
    ...question.options.flatMap((option) => [option.text, option.calculation, option.studentFeedback]),
    question.explanation.keyIdea,
    ...question.explanation.steps,
    question.explanation.finalAnswer,
    ...(question.explanation.shortcut?.steps ?? []),
    ...(question.explanation.commonMistake ? [question.explanation.commonMistake] : []),
    ...(question.explanation.verification?.steps ?? []),
  ];
}
function assertSurface(locale: IntCp003LocalizedLocale, strings: readonly string[], label: string): void {
  const joined = strings.join("\n");
  if (/\$/u.test(joined)) throw new Error(`${label}: legacy dollar MathJax delimiter.`);
  if (/\d[\d,]*\.\d{3,}/u.test(joined)) throw new Error(`${label}: decimal exceeds two places.`);
  if (/₹\s*\d[\d,]*\.00\b/u.test(joined)) throw new Error(`${label}: whole-rupee .00.`);
  if (/ज्ञात कीजिए|ਪਤਾ ਕਰੋ/gu.test(joined)) throw new Error(`${label}: command-style prompt survived.`);
  if (/\\frac\{\d+\\frac\{/u.test(joined)) throw new Error(`${label}: visually ugly nested mixed fraction reached learner math.`);
  if (/\b1\s+वार्षिक वृद्धि-चरण हैं\b/u.test(joined)) throw new Error(`${label}: Hindi singular/plural defect.`);
  if (/\b1\s+ਸਾਲਾਨਾ ਵਾਧੇ ਦੇ ਕਦਮ ਹਨ\b/u.test(joined)) throw new Error(`${label}: Punjabi singular/plural defect.`);
  if (/\d+ ਸਾਲ ਬਾਅਦ ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ/u.test(joined)) throw new Error(`${label}: duplicated Punjabi duration phrase.`);
  if (/दोनों चक्रवृद्धि राशियां|ਦੋਵੇਂ ਮਿਸ਼ਰਤ ਰਕਮਾਂ/gu.test(joined)) throw new Error(`${label}: mechanical QL065 amount wording.`);
  if (locale === "pa-IN" && /ਚੱਕਰਵੱਧੀ ਵਿਆਜ/gu.test(joined)) throw new Error(`${label}: rejected Punjabi terminology.`);
  if (locale === "hi-IN" && !/[\u0900-\u097F]/u.test(joined)) throw new Error(`${label}: missing Devanagari learner prose.`);
  if (locale === "pa-IN" && !/[\u0A00-\u0A7F]/u.test(joined)) throw new Error(`${label}: missing Gurmukhi learner prose.`);
  for (const text of strings) {
    if (/[=×÷^]|\\(?:frac|times|div|left|right|%)/u.test(outsideMath(text))) throw new Error(`${label}: raw math outside wrappers: ${text}`);
  }
}

let questions = 0;
let parityChecks = 0;
let optionChecks = 0;
let sourceStepChecks = 0;
let formulaFirstChecks = 0;
let lifecycleChecks = 0;
let learnerStringChecks = 0;
let mishritChecks = 0;
const answerPositions = [0, 0, 0, 0];
const representations = new Set<string>();

for (const qlId of INT_CP003_QL_IDS) {
  for (let index = 0; index < QUESTIONS_PER_QL; index += 1) {
    const seed = `int-cp003-hi-pa-final-v3:${qlId}:${index}`;
    const english = generateIntCp003EnglishFrozenQuestion(qlId, seed);
    for (const locale of LOCALES) {
      const question = generateIntCp003FinalLocalizedQuestionV3(qlId, seed, locale);
      const label = `${qlId}/${seed}/${locale}`;
      questions += 1;
      representations.add(question.presentation.representation);
      if (question.mathematicalFingerprint !== english.mathematicalFingerprint) throw new Error(`${label}: mathematical fingerprint drift.`);
      if (!sameRational(question.solution, english.solution)) throw new Error(`${label}: solution drift.`);
      if (question.correctIndex !== english.correctIndex) throw new Error(`${label}: correct-index drift.`);
      parityChecks += 3;
      question.options.forEach((option, optionIndex) => {
        const source = english.options[optionIndex]!;
        if (!sameRational(option.value, source.value)) throw new Error(`${label}: option value drift.`);
        if (option.misconceptionId !== source.misconceptionId) throw new Error(`${label}: misconception ownership drift.`);
        if (option.isCorrect !== source.isCorrect) throw new Error(`${label}: option correctness drift.`);
        optionChecks += 3;
      });
      if (new Set(question.options.map((option) => option.text)).size !== 4) throw new Error(`${label}: duplicate visible options.`);
      if (question.correctAnswer !== question.options[question.correctIndex]!.text) throw new Error(`${label}: displayed answer mismatch.`);
      answerPositions[question.correctIndex] += 1;

      const mainIds = JSON.stringify(question.explanation.sourceStepIds);
      if (mainIds !== JSON.stringify(english.explanation.sourceStepIds)) throw new Error(`${label}: main source-step IDs drift.`);
      for (const depth of ["exam", "student", "foundation"] as const) {
        if (JSON.stringify(question.explanation.depths[depth].sourceStepIds) !== JSON.stringify(english.explanation.depths[depth].sourceStepIds)) throw new Error(`${label}: ${depth} source-step IDs drift.`);
      }
      sourceStepChecks += 4;

      const first = question.explanation.steps[0] ?? "";
      const labelPrefix = locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
      if (!first.startsWith(labelPrefix) || !/\\\(.+\\\)/u.test(first)) throw new Error(`${label}: formula-first explanation missing.`);
      formulaFirstChecks += 1;

      if (qlId === "INT-QL-056" && question.presentation.representation !== "STANDARD_PROSE") {
        const lead = question.presentation.leadText ?? "";
        if (locale === "hi-IN" && !/चक्रवृद्धि ब्याज/u.test(lead)) throw new Error(`${label}: QL056 structured lead does not name the given compound interest.`);
        if (locale === "pa-IN" && !/ਮਿਸ਼ਰਤ ਵਿਆਜ/u.test(lead)) throw new Error(`${label}: QL056 structured lead does not name the given mishrit vyaz.`);
      }

      const strings = collectLearnerStrings(question);
      assertSurface(locale, strings, label);
      learnerStringChecks += strings.length;
      if (locale === "pa-IN" && strings.some((text) => /ਮਿਸ਼ਰਤ ਵਿਆਜ/gu.test(text))) mishritChecks += 1;

      if (question.enabled || question.stagingStatus !== "NOT_STAGED" || question.registrationStatus !== "NOT_REGISTERED" || question.questionStudioDiscoverable || question.questionBankStatus !== "NOT_STORED" || question.testEligibility !== "INELIGIBLE" || question.publiclyPublishable) throw new Error(`${label}: source lifecycle opened.`);
      if (question.lifecycle.enabled || question.lifecycle.registrationStatus !== "NOT_REGISTERED" || question.lifecycle.questionStudioDiscoverable || question.lifecycle.questionBankStatus !== "NOT_STORED" || question.lifecycle.testEligibility !== "INELIGIBLE" || question.lifecycle.publiclyPublishable) throw new Error(`${label}: localized lifecycle opened.`);
      lifecycleChecks += 13;
    }
  }
}

if (questions !== 2800) throw new Error(`Expected 2,800 questions, got ${questions}.`);
if (representations.size !== 6) throw new Error(`Expected 6 representations, got ${representations.size}.`);
if (mishritChecks === 0) throw new Error("Required Punjabi mishrit-vyaz terminology was not exercised.");

console.log(JSON.stringify({
  status: "PASS_INT_CP003_HI_PA_FINAL_V3",
  questions,
  hindi: 1400,
  punjabi: 1400,
  parityChecks,
  optionChecks,
  sourceStepChecks,
  formulaFirstChecks,
  learnerStringChecks,
  lifecycleChecks,
  mishritChecks,
  answerPositions,
  representations: [...representations].sort(),
  manualFindingRegressions: {
    duplicatedPunjabiDuration: 0,
    singularPluralGap: 0,
    misleadingQl056Lead: 0,
    nestedMixedFraction: 0,
    mechanicalQl065Wording: 0,
  },
}, null, 2));
