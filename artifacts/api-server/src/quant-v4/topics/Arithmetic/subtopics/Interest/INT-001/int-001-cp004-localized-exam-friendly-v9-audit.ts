import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import {
  INT_CP004_LOCALIZED_LOCALES,
  assertCp004LocalizedText,
} from "./cp004-localization-language-pack";
import {
  INT_CP004_LOCALIZED_EXAM_FRIENDLY_RUNTIME_V9_VERSION,
  generateIntCp004ExamFriendlyLocalizedQuestionV9,
} from "./cp004-localized-exam-friendly-runtime-v9";

function fail(message: string): never {
  throw new Error(message);
}

function stringify(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function assertFrozen(value: unknown, label: string, seen = new WeakSet<object>()): number {
  if (typeof value !== "object" || value === null) return 0;
  const objectValue = value as object;
  if (seen.has(objectValue)) return 0;
  seen.add(objectValue);
  if (!Object.isFrozen(value)) fail(`${label}: object is not frozen.`);
  let checks = 1;
  for (const key of Reflect.ownKeys(objectValue)) {
    checks += assertFrozen((objectValue as Record<PropertyKey, unknown>)[key], `${label}.${String(key)}`, seen);
  }
  return checks;
}

const DECIMAL_TOKEN = /\d+\.\d+/u;
const DEVANAGARI_CONTENT = /[\u0900-\u0963\u0966-\u097F]/u;
let questionCases = 0;
let deterministicChecks = 0;
let decimalFreeChecks = 0;
let formulaFirstChecks = 0;
let calculationChecks = 0;
let optionChecks = 0;
let suppressedFeedbackChecks = 0;
let correctAnswerChecks = 0;
let scriptChecks = 0;
let lifecycleChecks = 0;
let frozenObjectChecks = 0;
let punjabiTerminologyChecks = 0;
const localeCounts: Record<string, number> = {};
const qlCounts: Record<string, number> = {};

for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  for (const qlId of INT_CP004_QL_IDS) {
    for (let index = 0; index < 100; index += 1) {
      const seed = `int-cp004-v9-runtime-audit:${qlId}:${index}`;
      const input = { qlId, seed, locale } as const;
      const question = generateIntCp004ExamFriendlyLocalizedQuestionV9(input);
      const replay = generateIntCp004ExamFriendlyLocalizedQuestionV9(input);
      questionCases += 1;
      localeCounts[locale] = (localeCounts[locale] ?? 0) + 1;
      qlCounts[`${locale}/${qlId}`] = (qlCounts[`${locale}/${qlId}`] ?? 0) + 1;

      deterministicChecks += 1;
      if (stringify(question) !== stringify(replay)) {
        fail(`${locale}/${qlId}/${seed}: v9 runtime is not deterministic.`);
      }

      correctAnswerChecks += 2;
      if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
        fail(`${locale}/${qlId}/${seed}: invalid correct index.`);
      }
      if (!question.options[question.correctIndex]?.isCorrect || question.correctAnswer !== question.options[question.correctIndex]?.text) {
        fail(`${locale}/${qlId}/${seed}: displayed correct-answer ownership changed.`);
      }

      for (const option of question.options) {
        optionChecks += 1;
        suppressedFeedbackChecks += 1;
        if (!option.text.trim()) fail(`${locale}/${qlId}/${seed}/${option.id}: empty option text.`);
        if (option.feedback !== "") fail(`${locale}/${qlId}/${seed}/${option.id}: learner option feedback is not suppressed.`);
      }

      const firstStep = question.explanation.steps[0] ?? "";
      formulaFirstChecks += 1;
      if (locale === "hi-IN" ? !firstStep.startsWith("सूत्र:") : !firstStep.startsWith("ਸੂਤਰ:")) {
        fail(`${locale}/${qlId}/${seed}: first explanation step is not the formula.`);
      }
      if (question.explanation.steps.length < 3 || question.explanation.steps.length > 18) {
        fail(`${locale}/${qlId}/${seed}: expected 3-18 complete explanation steps.`);
      }
      calculationChecks += 1;
      if (!question.explanation.steps.slice(1).some((step) => /[=×÷+−^/]/u.test(step))) {
        fail(`${locale}/${qlId}/${seed}: no substitution/calculation follows the formula.`);
      }

      const learnerText = [
        question.stem,
        ...question.options.map((option) => option.text),
        question.correctAnswer,
        question.explanation.whatAsked,
        ...question.explanation.steps,
        question.explanation.finalAnswer,
        question.explanation.commonMistake,
      ].join("\n");
      decimalFreeChecks += 1;
      if (DECIMAL_TOKEN.test(learnerText)) {
        fail(`${locale}/${qlId}/${seed}: decimal token remains in v9 learner content.`);
      }

      assertCp004LocalizedText(locale, question.stem, `${locale}/${qlId}/${seed}/stem`);
      assertCp004LocalizedText(locale, question.explanation.whatAsked, `${locale}/${qlId}/${seed}/what-asked`);
      assertCp004LocalizedText(locale, question.explanation.finalAnswer, `${locale}/${qlId}/${seed}/final-answer`);
      assertCp004LocalizedText(locale, question.explanation.commonMistake, `${locale}/${qlId}/${seed}/common-mistake`);
      scriptChecks += 4;
      for (const [stepIndex, step] of question.explanation.steps.entries()) {
        assertCp004LocalizedText(locale, step, `${locale}/${qlId}/${seed}/step-${stepIndex + 1}`);
        scriptChecks += 1;
      }

      if (locale === "hi-IN") {
        if (!question.explanation.whatAsked.startsWith("हमें ")) fail(`${locale}/${qlId}/${seed}: Hindi task opening regressed.`);
      } else {
        punjabiTerminologyChecks += 1;
        if (!question.explanation.whatAsked.startsWith("ਆਓ ")) fail(`${locale}/${qlId}/${seed}: Punjabi task opening regressed.`);
        if (learnerText.includes("ਸਾਨੂੰ") || learnerText.includes("ਚੱਕਰਵੱਧੀ")) fail(`${locale}/${qlId}/${seed}: rejected Punjabi wording remains.`);
        if (DEVANAGARI_CONTENT.test(learnerText)) fail(`${locale}/${qlId}/${seed}: Hindi-script text leaked into Punjabi learner content.`);
      }

      lifecycleChecks += 7;
      if (
        question.enabled
        || question.stagingStatus !== "NOT_STAGED"
        || question.registrationStatus !== "NOT_REGISTERED"
        || question.questionStudioDiscoverable
        || question.questionBankStatus !== "NOT_STORED"
        || question.testEligibility !== "INELIGIBLE"
        || question.publiclyPublishable
      ) {
        fail(`${locale}/${qlId}/${seed}: inactive lifecycle boundary changed.`);
      }

      frozenObjectChecks += assertFrozen(question, `${locale}/${qlId}/${seed}`);
    }
  }
}

if (questionCases !== 3800) fail(`Expected 3,800 v9 localized cases, received ${questionCases}.`);
if (optionChecks !== 15200) fail(`Expected 15,200 v9 option checks, received ${optionChecks}.`);
for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  if (localeCounts[locale] !== 1900) fail(`${locale}: expected 1,900 v9 cases.`);
}
for (const [key, count] of Object.entries(qlCounts)) {
  if (count !== 100) fail(`${key}: expected 100 v9 cases, received ${count}.`);
}

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-localized-exam-friendly-v9");
mkdirSync(outputDirectory, { recursive: true });
const summary = Object.freeze({
  status: "CP004_LOCALIZED_EXAM_FRIENDLY_V9_VALIDATED",
  runtimeVersion: INT_CP004_LOCALIZED_EXAM_FRIENDLY_RUNTIME_V9_VERSION,
  qlRange: "INT-QL-067..INT-QL-085",
  qlCount: INT_CP004_QL_IDS.length,
  locales: INT_CP004_LOCALIZED_LOCALES,
  questionCases,
  localeCounts,
  qlCounts,
  deterministicChecks,
  decimalFreeChecks,
  formulaFirstChecks,
  calculationChecks,
  optionChecks,
  suppressedFeedbackChecks,
  correctAnswerChecks,
  scriptChecks,
  lifecycleChecks,
  frozenObjectChecks,
  punjabiTerminologyChecks,
  lifecycle: {
    maturity: "MULTILINGUAL_LOCALISATION_REVIEW",
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
});
writeFileSync(
  join(outputDirectory, "int-cp004-localized-exam-friendly-v9-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_LOCALIZED_EXAM_FRIENDLY_V9");
