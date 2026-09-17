import { ECO_CP005_REVIEW_V1 } from "../inflation-price-concepts/eco-cp005-review-generator-v1";
import { ECO_CP006_REVIEW_V1 } from "../employment-unemployment-poverty/eco-cp006-review-generator-v1";
import {
  generateEcoCp005LocalizedReviewV1,
  generateEcoCp006LocalizedReviewV1,
  generateEcoCp005Cp006LocalizedReviewV1,
} from "./eco-localization-generator-v1";
import type { EcoLocaleV1, EcoLocalizedQuestionV1 } from "./eco-localization-types-v1";

const locales: EcoLocaleV1[] = ["en", "hi", "pa"];
const fail = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

function learnerText(question: EcoLocalizedQuestionV1) {
  return [question.stem, ...question.options, question.explanation].join("\n");
}

function assertNative(question: EcoLocalizedQuestionV1, locale: "hi" | "pa") {
  const text = learnerText(question);
  const allowed = /\b(?:I|II|CPI|WPI|GDP|GNP|NDP|NNP|NFIA|GVA|MoSPI|LFPR|WPR|UR|MGNREGA|NCERT)\b/gu;
  const stripped = text.replace(allowed, "");
  fail(!/[A-Za-z]{2,}/u.test(stripped), `${question.questionId}: Latin-script leakage: ${stripped.match(/[A-Za-z]{2,}/u)?.[0] ?? "unknown"}`);
  if (locale === "hi") fail(/[\u0900-\u097F]/u.test(text), `${question.questionId}: missing Devanagari`);
  if (locale === "pa") fail(/[\u0A00-\u0A7F]/u.test(text), `${question.questionId}: missing Gurmukhi`);
}

function assertParity(
  source: readonly any[],
  localized: readonly EcoLocalizedQuestionV1[],
  locale: EcoLocaleV1,
) {
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
      assertNative(question, locale);
    }
  });
}

fail(ECO_CP005_REVIEW_V1.length === 44, `CP005 expected 44, found ${ECO_CP005_REVIEW_V1.length}`);
fail(ECO_CP006_REVIEW_V1.length === 44, `CP006 expected 44, found ${ECO_CP006_REVIEW_V1.length}`);

for (const locale of locales) {
  assertParity(ECO_CP005_REVIEW_V1, generateEcoCp005LocalizedReviewV1(locale), locale);
  assertParity(ECO_CP006_REVIEW_V1, generateEcoCp006LocalizedReviewV1(locale), locale);
  fail(generateEcoCp005Cp006LocalizedReviewV1(locale).length === 88, `${locale}: CP005-006 expected 88`);
}

fail(locales.flatMap((locale) => generateEcoCp005Cp006LocalizedReviewV1(locale)).length === 264, "CP005-006 expected 264 EN-HI-PA surfaces");
console.log("Economy CP005-CP006 multilingual audit passed: 88 questions per locale / 264 surfaces.");
