import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  INT_CP004_LOCALIZED_LOCALES,
  assertCp004LocalizedText,
} from "./cp004-localization-language-pack";
import {
  INT_CP004_LOCALIZED_EXPLANATION_VERSION,
  localizeCp004Explanation,
} from "./cp004-localized-explanations";
import { localizedCp004AnswerText } from "./cp004-localized-options";

function fail(message: string): never {
  throw new Error(message);
}

let questionCases = 0;
let deterministicChecks = 0;
let fieldChecks = 0;
let stepChecks = 0;
let scriptChecks = 0;
let finalAnswerChecks = 0;
let numericalEvidenceChecks = 0;
let formulaChecks = 0;
let englishFallbackChecks = 0;
let sourceCopyGuards = 0;
const qlCounts: Record<string, number> = {};
const minimumStepsByQl: Record<string, number> = {};
const maximumStepsByQl: Record<string, number> = {};

for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  for (const qlId of INT_CP004_QL_IDS) {
    for (let index = 0; index < 100; index += 1) {
      const seed = `int-cp004-localized-explanations:${qlId}:${index}`;
      const source = generateIntCp004EnglishFrozenQuestion(qlId, seed);
      const localized = localizeCp004Explanation(source, locale);
      const replay = localizeCp004Explanation(source, locale);
      questionCases += 1;
      qlCounts[`${locale}/${qlId}`] = (qlCounts[`${locale}/${qlId}`] ?? 0) + 1;

      deterministicChecks += 1;
      if (JSON.stringify(localized) !== JSON.stringify(replay)) {
        fail(`${qlId}/${seed}/${locale}: explanation localisation is not deterministic.`);
      }

      fieldChecks += 4;
      if (!localized.whatAsked.trim() || !localized.finalAnswer.trim() || !localized.commonMistake.trim()) {
        fail(`${qlId}/${seed}/${locale}: a required explanation field is empty.`);
      }
      if (!Array.isArray(localized.steps) || localized.steps.length < 2) {
        fail(`${qlId}/${seed}/${locale}: explanation has insufficient worked steps.`);
      }
      minimumStepsByQl[`${locale}/${qlId}`] = Math.min(
        minimumStepsByQl[`${locale}/${qlId}`] ?? Number.POSITIVE_INFINITY,
        localized.steps.length,
      );
      maximumStepsByQl[`${locale}/${qlId}`] = Math.max(
        maximumStepsByQl[`${locale}/${qlId}`] ?? 0,
        localized.steps.length,
      );

      scriptChecks += 3 + localized.steps.length;
      assertCp004LocalizedText(locale, localized.whatAsked, `${qlId}/${seed}/${locale}/what-asked`);
      assertCp004LocalizedText(locale, localized.finalAnswer, `${qlId}/${seed}/${locale}/final-answer`);
      assertCp004LocalizedText(locale, localized.commonMistake, `${qlId}/${seed}/${locale}/common-mistake`);
      for (const [stepIndex, step] of localized.steps.entries()) {
        stepChecks += 1;
        assertCp004LocalizedText(locale, step, `${qlId}/${seed}/${locale}/step-${stepIndex + 1}`);
        if (!/[₹%0-9×÷=+−/]/u.test(step)) {
          fail(`${qlId}/${seed}/${locale}/step-${stepIndex + 1}: worked step lacks numerical or formula evidence.`);
        }
      }

      const correctAnswer = localizedCp004AnswerText(
        locale,
        source.answerSemantic,
        source.mathematicalState,
        source.solution,
      );
      finalAnswerChecks += 1;
      if (!localized.finalAnswer.includes(correctAnswer)) {
        fail(`${qlId}/${seed}/${locale}: final answer does not contain the localized canonical answer.`);
      }

      numericalEvidenceChecks += 1;
      const combinedSteps = localized.steps.join("\n");
      const optionEvidence = source.options.some((option) => combinedSteps.includes(option.text));
      if (!optionEvidence && !/[₹%]/u.test(combinedSteps)) {
        fail(`${qlId}/${seed}/${locale}: explanation lacks question-specific numerical evidence.`);
      }

      formulaChecks += 1;
      if (!/[=×÷+−]/u.test(combinedSteps)) {
        fail(`${qlId}/${seed}/${locale}: explanation lacks an explicit calculation relation.`);
      }

      englishFallbackChecks += 3 + localized.steps.length;
      const learnerText = [
        localized.whatAsked,
        ...localized.steps,
        localized.finalAnswer,
        localized.commonMistake,
      ].join("\n");
      if (/\b(?:we need|therefore|the answer|common mistake|final amount|principal|annual rate|compound interest|simple interest|after|before|find|periods?)\b/iu.test(learnerText)) {
        fail(`${qlId}/${seed}/${locale}: English prose fallback reached localized explanation.`);
      }

      sourceCopyGuards += 4;
      if (
        localized.whatAsked === source.explanation.whatAsked
        || localized.finalAnswer === source.explanation.finalAnswer
        || localized.commonMistake === source.explanation.commonMistake
        || localized.steps.some((step) => source.explanation.steps.includes(step))
      ) {
        fail(`${qlId}/${seed}/${locale}: completed English explanation text was copied into localization.`);
      }
    }
  }
}

if (questionCases !== 3800) fail(`Expected 3,800 bilingual explanation cases, received ${questionCases}.`);
for (const [key, count] of Object.entries(qlCounts)) {
  if (count !== 100) fail(`${key}: expected 100 explanation cases, received ${count}.`);
}

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-localized-explanations");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "CP004_LOCALIZED_EXPLANATIONS_READY",
  explanationVersion: INT_CP004_LOCALIZED_EXPLANATION_VERSION,
  qlRange: "INT-QL-067..INT-QL-085",
  qlCount: INT_CP004_QL_IDS.length,
  locales: INT_CP004_LOCALIZED_LOCALES,
  questionCases,
  deterministicChecks,
  fieldChecks,
  stepChecks,
  scriptChecks,
  finalAnswerChecks,
  numericalEvidenceChecks,
  formulaChecks,
  englishFallbackChecks,
  sourceCopyGuards,
  minimumStepsByQl,
  maximumStepsByQl,
  explanationStructure: {
    whatAsked: true,
    workedSteps: true,
    finalAnswer: true,
    commonMistake: true,
  },
  lifecycle: {
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};
writeFileSync(
  join(outputDirectory, "int-cp004-localized-explanations-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_LOCALIZED_EXPLANATIONS");
