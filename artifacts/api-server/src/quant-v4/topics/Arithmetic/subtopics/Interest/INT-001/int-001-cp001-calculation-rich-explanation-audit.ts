import { listQuantV4Packages } from "../../../../../generation-engine";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import {
  generateIntCp001ExplanationSanitizationQuestion,
  validateIntCp001SanitizedExplanation,
} from "./cp001-explanation-sanitization-runtime";
import {
  generateIntCp001CalculationRichQuestion,
  INT_CP001_CALCULATION_RICH_PATCH_ID,
  INT_CP001_CALCULATION_RICH_REVIEW_STATUS,
  INT_CP001_CALCULATION_RICH_STATUS,
  type IntCp001CalculationRichLanguage,
} from "./cp001-calculation-rich-explanation-runtime";
import { stableBigIntJson } from "./cp001-localization-foundation";

const LANGUAGES: readonly IntCp001CalculationRichLanguage[] = ["en", "hi", "pa"];
const SEEDS_PER_QL = 80;
const EXPECTED_RELEASES: Record<IntCp001CalculationRichLanguage, string> = {
  en: "INT-CP-001-EN-v6",
  hi: "INT-CP-001-HI-v6",
  pa: "INT-CP-001-PA-v6",
};

function fail(message: string): never {
  throw new Error(message);
}

function stripAllowedChanges(value: Record<string, unknown>): Record<string, unknown> {
  const {
    releaseId: _releaseId,
    maturity: _maturity,
    reviewStatus: _reviewStatus,
    localeReviewStatus: _localeReviewStatus,
    explanation: _explanation,
    validation: _validation,
    calculationRichTrace: _calculationRichTrace,
    ...frozen
  } = value;
  return frozen;
}

let questions = 0;
let deterministicChecks = 0;
let frozenContentChecks = 0;
let lifecycleChecks = 0;
let workedStepChecks = 0;
let formulaChecks = 0;
let substitutionChecks = 0;
let arithmeticChecks = 0;
let mathSanitizationChecks = 0;
let crossLanguageParityChecks = 0;
let advancedAlgebraChecks = 0;
const qlCoverage: Record<string, Set<string>> = Object.fromEntries(
  LANGUAGES.map((language) => [language, new Set<string>()]),
);
const answerPositions: Record<string, number[]> = Object.fromEntries(
  LANGUAGES.map((language) => [language, [0, 0, 0, 0]]),
);

if (listQuantV4Packages().some((item) => String(item.packageId) === "INT-001")) {
  fail("INT-001 is present in the central Question Studio registry.");
}

for (const qlId of INT_CP001_FINAL_QL_IDS) {
  for (let seedIndex = 0; seedIndex < SEEDS_PER_QL; seedIndex += 1) {
    const seed = `calculation-rich-v1:${qlId}:${seedIndex}`;
    const generated = Object.fromEntries(
      LANGUAGES.map((language) => [language, generateIntCp001CalculationRichQuestion(qlId, seed, language)]),
    ) as Record<IntCp001CalculationRichLanguage, ReturnType<typeof generateIntCp001CalculationRichQuestion>>;

    for (const language of LANGUAGES) {
      const source = generateIntCp001ExplanationSanitizationQuestion(qlId, seed, language);
      const question = generated[language];
      const replay = generateIntCp001CalculationRichQuestion(qlId, seed, language);
      questions += 1;
      qlCoverage[language]!.add(qlId);
      answerPositions[language]![question.correctIndex] += 1;

      if (stableBigIntJson(question) !== stableBigIntJson(replay)) {
        fail(`${qlId}/${seed}/${language}: calculation-rich generation is not deterministic.`);
      }
      deterministicChecks += 1;

      if (
        stableBigIntJson(stripAllowedChanges(question as unknown as Record<string, unknown>))
        !== stableBigIntJson(stripAllowedChanges(source as unknown as Record<string, unknown>))
      ) {
        fail(`${qlId}/${seed}/${language}: a frozen non-explanation field changed.`);
      }
      frozenContentChecks += 1;

      if (!question.validation.ok) {
        fail(`${qlId}/${seed}/${language}: ${question.validation.errors.join(" | ")}`);
      }
      if (question.releaseId !== EXPECTED_RELEASES[language]) {
        fail(`${qlId}/${seed}/${language}: wrong release ${question.releaseId}.`);
      }
      if (question.maturity !== INT_CP001_CALCULATION_RICH_STATUS) {
        fail(`${qlId}/${seed}/${language}: wrong maturity.`);
      }
      if (question.reviewStatus !== INT_CP001_CALCULATION_RICH_REVIEW_STATUS) {
        fail(`${qlId}/${seed}/${language}: wrong review status.`);
      }
      if (question.localeReviewStatus !== "PENDING_HUMAN_REVIEW") {
        fail(`${qlId}/${seed}/${language}: locale review status changed.`);
      }
      if (
        question.questionBankStatus !== "NOT_STORED"
        || question.testEligibility !== "INELIGIBLE"
        || question.publiclyPublishable
        || question.questionStudioDiscoverable
      ) {
        fail(`${qlId}/${seed}/${language}: downstream lifecycle lock changed.`);
      }
      if (question.calculationRichTrace.patchId !== INT_CP001_CALCULATION_RICH_PATCH_ID) {
        fail(`${qlId}/${seed}/${language}: wrong calculation-rich patch trace.`);
      }
      lifecycleChecks += 1;

      const steps = question.explanation.stepByStep.steps;
      const joined = steps.join("\n");
      if (steps.length < 4 || question.calculationRichTrace.workedStepCount !== steps.length) {
        fail(`${qlId}/${seed}/${language}: expected at least four worked steps.`);
      }
      if (!steps.every((step) => /\d/u.test(step))) {
        fail(`${qlId}/${seed}/${language}: every worked step must contain actual values.`);
      }
      workedStepChecks += 1;

      const displayEquationCount = (joined.match(/\$\$/gu) ?? []).length / 2;
      if (displayEquationCount < 3) {
        fail(`${qlId}/${seed}/${language}: fewer than three worked display equations.`);
      }
      formulaChecks += 1;

      if (!/\$\$[^$]*\d[^$]*\$\$/su.test(joined)) {
        fail(`${qlId}/${seed}/${language}: no numeric formula substitution was found.`);
      }
      substitutionChecks += 1;

      if (!/[=][^=\n]*[=]/su.test(joined) && !(joined.match(/=/gu) ?? []).length) {
        fail(`${qlId}/${seed}/${language}: arithmetic chain is missing.`);
      }
      arithmeticChecks += 1;

      const sanitationErrors = validateIntCp001SanitizedExplanation(question.explanation);
      if (sanitationErrors.length > 0) {
        fail(`${qlId}/${seed}/${language}: ${sanitationErrors.join(" | ")}`);
      }
      mathSanitizationChecks += 1;

      if (qlId === "INT-QL-017") {
        if (!joined.includes("100+RT_2") || !joined.includes("100+RT_1") || !joined.includes("R=")) {
          fail(`${qlId}/${seed}/${language}: rate-ratio algebra is incomplete.`);
        }
        advancedAlgebraChecks += 1;
      }
      if (qlId === "INT-QL-021") {
        if (!joined.includes("T_2") || !joined.includes("100+RT_2") || !joined.includes("T_2=\\frac")) {
          fail(`${qlId}/${seed}/${language}: later-time algebra is incomplete.`);
        }
        advancedAlgebraChecks += 1;
      }
    }

    for (const locale of ["hi", "pa"] as const) {
      if (stableBigIntJson(generated[locale].optionAudit.map((item) => item.result)) !== stableBigIntJson(generated.en.optionAudit.map((item) => item.result))) {
        fail(`${qlId}/${seed}/${locale}: option-value parity drifted.`);
      }
      if (generated[locale].correctIndex !== generated.en.correctIndex) {
        fail(`${qlId}/${seed}/${locale}: correct-index parity drifted.`);
      }
      crossLanguageParityChecks += 1;
    }
  }
}

for (const language of LANGUAGES) {
  if (qlCoverage[language]!.size !== INT_CP001_FINAL_QL_IDS.length) {
    fail(`${language}: incomplete QL coverage.`);
  }
  if (answerPositions[language]!.some((count) => count === 0)) {
    fail(`${language}: one or more answer positions are absent.`);
  }
}

const summary = {
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-001",
  patchId: INT_CP001_CALCULATION_RICH_PATCH_ID,
  questions,
  deterministicChecks,
  frozenContentChecks,
  lifecycleChecks,
  workedStepChecks,
  formulaChecks,
  substitutionChecks,
  arithmeticChecks,
  mathSanitizationChecks,
  crossLanguageParityChecks,
  advancedAlgebraChecks,
  qlCoverage: Object.fromEntries(LANGUAGES.map((language) => [language, qlCoverage[language]!.size])),
  answerPositions,
  releases: EXPECTED_RELEASES,
  enabled: false,
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
};

console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP001_CALCULATION_RICH_EXPLANATIONS_V1");
