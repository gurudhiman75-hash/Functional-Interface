import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP004_QL_IDS,
  eq,
} from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  INT_CP004_LOCALIZED_LOCALES,
  assertCp004LocalizedText,
} from "./cp004-localization-language-pack";
import {
  INT_CP004_LOCALIZED_OPTION_VERSION,
  localizeCp004Options,
  localizedCp004AnswerText,
} from "./cp004-localized-options";

function fail(message: string): never {
  throw new Error(message);
}

const EXPECTED_MISCONCEPTIONS = Object.freeze([
  "CORRECT",
  "USED_SIMPLE_INTEREST",
  "MISSED_ONE_PERIOD",
  "RETURNED_PRINCIPAL",
  "RETURNED_AMOUNT",
  "RETURNED_FINAL_AMOUNT",
  "REMOVED_ONLY_ONE_PERIOD",
  "REVERSED_SIMPLE_INTEREST",
  "RETURNED_GIVEN_INTEREST",
  "USED_SIMPLE_INTEREST_INVERSE",
  "TREATED_INTEREST_AS_AMOUNT",
  "RETURNED_PERIOD_RATE",
  "DIVIDED_BY_TOTAL_PERIODS",
  "USED_SIMPLE_RATE",
  "ONE_PERIOD_SHORT",
  "ONE_PERIOD_EXTRA",
  "MULTIPLIED_PERIODS_BY_FREQUENCY",
  "ASSUMED_NO_FREQUENCY_EFFECT",
  "RETURNED_ONE_AMOUNT",
  "RETURNED_NOMINAL_RATE",
  "ADDED_ONE_CREDITING_PERIOD",
  "RETURNED_EFFECTIVE_RATE",
  "MULTIPLIED_EFFECTIVE_RATE",
  "ASSUMED_1_PER_YEAR",
  "ASSUMED_2_PER_YEAR",
  "ASSUMED_4_PER_YEAR",
  "ASSUMED_12_PER_YEAR",
  "IGNORED_TAIL",
  "COMPOUNDED_TAIL_MONTHLY",
  "TAIL_INTEREST_ON_ORIGINAL_PRINCIPAL",
  "SUBTRACTED_TAIL_FROM_FINAL_AMOUNT",
  "RETURNED_MONTHLY_RATE",
  "RETURNED_TAIL_PERIOD_RATE",
  "IGNORED_COMPLETE_YEARS",
  "ONE_YEAR_EXTRA",
  "COUNTED_TAIL_AS_EXTRA_YEARS",
  "USED_FIRST_FREQUENCY_THROUGHOUT",
  "USED_SECOND_FREQUENCY_THROUGHOUT",
  "USED_SIMPLE_INTEREST_THROUGHOUT",
] as const);

let questionCases = 0;
let optionChecks = 0;
let valueParityChecks = 0;
let orderParityChecks = 0;
let correctIndexChecks = 0;
let textChecks = 0;
let feedbackChecks = 0;
let deterministicChecks = 0;
let fallbackGuardChecks = 0;
const misconceptionIds = new Set<string>();
const answerPositions = [0, 0, 0, 0];

for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  for (const qlId of INT_CP004_QL_IDS) {
    for (let index = 0; index < 100; index += 1) {
      const seed = `int-cp004-localized-options:${qlId}:${index}`;
      const source = generateIntCp004EnglishFrozenQuestion(qlId, seed);
      const localized = localizeCp004Options(source, locale);
      const replay = localizeCp004Options(source, locale);
      questionCases += 1;

      deterministicChecks += 1;
      if (JSON.stringify(localized) !== JSON.stringify(replay)) {
        fail(`${qlId}/${seed}/${locale}: option localisation is not deterministic.`);
      }
      if (localized.length !== 4) fail(`${qlId}/${seed}/${locale}: expected four options.`);

      correctIndexChecks += 1;
      const localizedCorrectIndex = localized.findIndex((option) => option.isCorrect);
      if (localizedCorrectIndex !== source.correctIndex) {
        fail(`${qlId}/${seed}/${locale}: correct option index changed.`);
      }
      answerPositions[localizedCorrectIndex] = (answerPositions[localizedCorrectIndex] ?? 0) + 1;

      for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
        const canonical = source.options[optionIndex]!;
        const option = localized[optionIndex]!;
        optionChecks += 1;

        valueParityChecks += 1;
        if (!eq(option.value, canonical.value)) {
          fail(`${qlId}/${seed}/${locale}/${option.id}: option value changed.`);
        }

        orderParityChecks += 1;
        if (
          option.id !== canonical.id
          || option.isCorrect !== canonical.isCorrect
          || option.misconceptionId !== canonical.misconceptionId
        ) {
          fail(`${qlId}/${seed}/${locale}/${option.id}: option ownership or order changed.`);
        }

        textChecks += 1;
        const expectedText = localizedCp004AnswerText(
          locale,
          source.answerSemantic,
          source.mathematicalState,
          canonical.value,
        );
        if (option.text !== expectedText || !option.text.trim()) {
          fail(`${qlId}/${seed}/${locale}/${option.id}: localized option text is incorrect.`);
        }

        feedbackChecks += 1;
        assertCp004LocalizedText(locale, option.feedback, `${qlId}/${seed}/${locale}/${option.id}/feedback`);
        if (/\b(?:this|the|answer|amount|principal|rate|interest|period|year|month|compounding|question)\b/iu.test(option.feedback)) {
          fail(`${qlId}/${seed}/${locale}/${option.id}: English feedback fallback reached learner content.`);
        }

        fallbackGuardChecks += 1;
        if (option.misconceptionId === "ARITHMETIC_SLIP_FALLBACK") {
          fail(`${qlId}/${seed}/${locale}/${option.id}: prohibited arithmetic fallback reached generated corpus.`);
        }
        misconceptionIds.add(option.misconceptionId);
      }

      const expectedCorrectAnswer = localized[source.correctIndex]!.text;
      if (!expectedCorrectAnswer) fail(`${qlId}/${seed}/${locale}: localized correct answer is empty.`);
    }
  }
}

if (questionCases !== 3800) fail(`Expected 3,800 bilingual question cases, received ${questionCases}.`);
if (optionChecks !== 15200) fail(`Expected 15,200 option checks, received ${optionChecks}.`);
for (const misconceptionId of EXPECTED_MISCONCEPTIONS) {
  if (!misconceptionIds.has(misconceptionId)) {
    fail(`Expected misconception '${misconceptionId}' was not exercised.`);
  }
}
for (const misconceptionId of misconceptionIds) {
  if (!(EXPECTED_MISCONCEPTIONS as readonly string[]).includes(misconceptionId)) {
    fail(`Unexpected misconception '${misconceptionId}' reached localized options.`);
  }
}

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-localized-options");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "CP004_LOCALIZED_OPTIONS_READY",
  optionVersion: INT_CP004_LOCALIZED_OPTION_VERSION,
  qlRange: "INT-QL-067..INT-QL-085",
  qlCount: INT_CP004_QL_IDS.length,
  locales: INT_CP004_LOCALIZED_LOCALES,
  questionCases,
  optionChecks,
  valueParityChecks,
  orderParityChecks,
  correctIndexChecks,
  textChecks,
  feedbackChecks,
  deterministicChecks,
  fallbackGuardChecks,
  misconceptionCount: misconceptionIds.size,
  misconceptionIds: [...misconceptionIds].sort(),
  answerPositions,
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
  join(outputDirectory, "int-cp004-localized-options-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_LOCALIZED_OPTIONS");
