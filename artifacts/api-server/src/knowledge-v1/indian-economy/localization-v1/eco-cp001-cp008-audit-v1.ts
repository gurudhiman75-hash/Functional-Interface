import { ECO_CP001_REVIEW_V2 } from "../basic-economic-concepts/eco-cp001-review-generator-v2";
import { ECO_CP002_REVIEW_V2 } from "../economic-systems-sectors/eco-cp002-review-generator-v2";
import { ECO_CP003_REVIEW_V2 } from "../national-income-aggregates/eco-cp003-review-generator-v2";
import { ECO_CP004_REVIEW_V2 } from "../national-income-measurement-india/eco-cp004-review-generator-v2";
import { ECO_CP005_REVIEW_V1 } from "../inflation-price-concepts/eco-cp005-review-generator-v1";
import { ECO_CP006_REVIEW_V1 } from "../employment-unemployment-poverty/eco-cp006-review-generator-v1";
import { generateEcoCp007ReviewBatchV1 } from "../money-monetary-system/eco-cp007-review-generator-v1";
import { generateEcoCp008ReviewBatchV1 } from "../reserve-bank-of-india/eco-cp008-review-generator-v1";
import {
  generateEcoCp001LocalizedReviewV1,
  generateEcoCp002LocalizedReviewV1,
  generateEcoCp003LocalizedReviewV1,
  generateEcoCp004LocalizedReviewV1,
  generateEcoCp005LocalizedReviewV1,
  generateEcoCp006LocalizedReviewV1,
  generateEcoCp007LocalizedReviewV1,
  generateEcoCp008LocalizedReviewV1,
  generateEcoCp001Cp008LocalizedReviewV1,
} from "./eco-localization-generator-v1";
import type { EcoLocaleV1, EcoLocalizedQuestionV1 } from "./eco-localization-types-v1";
import {
  findEcoNativeTermsStillInEnglishV1,
  isEcoProtectedExamTermV1,
  stripEcoAllowedRomanV1,
} from "./eco-localization-term-policy-v1";

const locales: EcoLocaleV1[] = ["en", "hi", "pa"];
const ECO_CP007_REVIEW_V1 = generateEcoCp007ReviewBatchV1();
const ECO_CP008_REVIEW_V1 = generateEcoCp008ReviewBatchV1();
const fail = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

function learnerText(question: { stem: string; options: readonly string[]; explanation: string }): string {
  return [question.stem, ...question.options, question.explanation].join("\n");
}

function assertNative(question: EcoLocalizedQuestionV1, english: any, locale: "hi" | "pa") {
  const text = learnerText(question);
  const stripped = stripEcoAllowedRomanV1(text);
  fail(
    !/[A-Za-z]{2,}/u.test(stripped),
    `${question.questionId}: unauthorized Latin-script leakage: ${stripped.match(/[A-Za-z]{2,}/u)?.[0] ?? "unknown"}`,
  );

  const nativeTermsLeft = findEcoNativeTermsStillInEnglishV1(learnerText(english), text);
  fail(
    nativeTermsLeft.length === 0,
    `${question.questionId}: NATIVE term remained in English: ${nativeTermsLeft.join(", ")}`,
  );

  english.options.forEach((option: string, optionIndex: number) => {
    if (isEcoProtectedExamTermV1(option)) {
      fail(
        question.options[optionIndex] === option,
        `${question.questionId}: protected exam term drift at option ${optionIndex + 1}: ${option}`,
      );
    }
  });

  if (locale === "hi") fail(/[\u0900-\u097F]/u.test(text), `${question.questionId}: missing Devanagari`);
  if (locale === "pa") fail(/[\u0A00-\u0A7F]/u.test(text), `${question.questionId}: missing Gurmukhi`);
}

function assertParity(source: readonly any[], localized: readonly EcoLocalizedQuestionV1[], locale: EcoLocaleV1) {
  fail(localized.length === source.length, `${locale}: length mismatch`);
  localized.forEach((question, index) => {
    const english = source[index];
    fail(question.localizationV1.englishQuestionId === english.questionId, `${question.questionId}: English id mismatch`);
    fail(question.cpId === english.cpId, `${question.questionId}: CP mismatch`);
    fail(question.qlId === english.qlId, `${question.questionId}: QL mismatch`);
    fail(question.difficulty === english.difficulty, `${question.questionId}: difficulty mismatch`);
    fail(question.correctIndex === english.correctIndex, `${question.questionId}: correct-index mismatch`);
    fail(JSON.stringify(question.sourceIds) === JSON.stringify(english.sourceIds), `${question.questionId}: sourceIds mismatch`);
    fail(JSON.stringify(question.sourceFactIds) === JSON.stringify(english.sourceFactIds), `${question.questionId}: sourceFactIds mismatch`);
    fail(question.options.length === 4, `${question.questionId}: expected four options`);
    fail(new Set(question.options).size === 4, `${question.questionId}: duplicate localized options`);
    fail(question.canonicalAnswer === question.options[question.correctIndex], `${question.questionId}: canonical answer mismatch`);
    fail(question.reviewOnly === true && question.runtimeRegistered === false, `${question.questionId}: lifecycle boundary changed`);

    if (locale === "en") {
      fail(question.questionId === english.questionId, `${question.questionId}: English id drift`);
      fail(question.stem === english.stem, `${question.questionId}: English stem drift`);
      fail(JSON.stringify(question.options) === JSON.stringify(english.options), `${question.questionId}: English options drift`);
      fail(question.explanation === english.explanation, `${question.questionId}: English explanation drift`);
      fail(question.canonicalAnswer === english.canonicalAnswer, `${question.questionId}: English answer drift`);
    } else {
      fail(question.questionId === `${english.questionId}-${locale.toUpperCase()}`, `${question.questionId}: localized id mismatch`);
      assertNative(question, english, locale);
    }
  });
}

const batches = [
  ["CP001", ECO_CP001_REVIEW_V2, generateEcoCp001LocalizedReviewV1, 42],
  ["CP002", ECO_CP002_REVIEW_V2, generateEcoCp002LocalizedReviewV1, 42],
  ["CP003", ECO_CP003_REVIEW_V2, generateEcoCp003LocalizedReviewV1, 44],
  ["CP004", ECO_CP004_REVIEW_V2, generateEcoCp004LocalizedReviewV1, 44],
  ["CP005", ECO_CP005_REVIEW_V1, generateEcoCp005LocalizedReviewV1, 44],
  ["CP006", ECO_CP006_REVIEW_V1, generateEcoCp006LocalizedReviewV1, 44],
  ["CP007", ECO_CP007_REVIEW_V1, generateEcoCp007LocalizedReviewV1, 44],
  ["CP008", ECO_CP008_REVIEW_V1, generateEcoCp008LocalizedReviewV1, 44],
] as const;

for (const [label, source, generate, expected] of batches) {
  fail(source.length === expected, `${label}: expected ${expected}, found ${source.length}`);
  for (const locale of locales) assertParity(source, generate(locale), locale);
}

for (const locale of locales) {
  fail(generateEcoCp001Cp008LocalizedReviewV1(locale).length === 348, `${locale}: CP001-CP008 expected 348`);
}

fail(
  locales.flatMap((locale) => generateEcoCp001Cp008LocalizedReviewV1(locale)).length === 1044,
  "CP001-CP008 expected 1044 EN-HI-PA surfaces",
);

console.log("Economy CP001-CP008 multilingual audit passed: 348 questions per locale / 1044 surfaces.");
