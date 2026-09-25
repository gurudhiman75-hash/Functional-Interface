import { PGK_001_CP001_REVIEW_BATCH_V1 } from "../pgk-001-cp001-review-batch-v1";
import { PGK_CP001_HI_V1 } from "./pgk-cp001-hi-v1";
import { PGK_CP001_PA_V1 } from "./pgk-cp001-pa-v1";
import { generatePgkCp001LocalizedReviewV1 } from "./pgk-cp001-localization-v1";
import type { PgkLocaleV1, PgkLocalizedQuestionV1 } from "./pgk-localization-types-v1";

const locales: PgkLocaleV1[] = ["en", "hi", "pa"];

function fail(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function learnerText(q: { stem: string; options: readonly string[]; explanation: string }) {
  return [q.stem, ...q.options, q.explanation].join("\n");
}

function numbers(text: string) {
  return (text.match(/\d+(?:\.\d+)?/g) ?? []).sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

function assertNative(q: PgkLocalizedQuestionV1, locale: "hi" | "pa", english: (typeof PGK_001_CP001_REVIEW_BATCH_V1)[number]) {
  const text = learnerText(q);
  const scriptText = text.replace(/[।॥]/g, "");
  const latin = text.match(/[A-Za-z]{2,}/u)?.[0];
  fail(!latin, `${q.questionId}: Latin-script leakage: ${latin ?? "unknown"}`);
  fail(q.stem.length <= 360, `${q.questionId}: localized stem too long`);
  fail(q.explanation.length >= 45, `${q.questionId}: localized explanation too short`);
  fail(q.explanation.length <= 430, `${q.questionId}: localized explanation too long`);

  if (locale === "hi") {
    fail(/[\u0900-\u097F]/u.test(scriptText), `${q.questionId}: missing Devanagari`);
    fail(!/[\u0A00-\u0A7F]/u.test(scriptText), `${q.questionId}: Gurmukhi leakage in Hindi`);
  } else {
    fail(/[\u0A00-\u0A7F]/u.test(scriptText), `${q.questionId}: missing Gurmukhi`);
    fail(!/[\u0900-\u097F]/u.test(scriptText), `${q.questionId}: Devanagari leakage in Punjabi`);
  }

  const englishNumbers = numbers(learnerText(english));
  const localizedNumbers = numbers(text);
  fail(
    JSON.stringify(englishNumbers) === JSON.stringify(localizedNumbers),
    `${q.questionId}: numeric/date/coordinate parity mismatch :: ${JSON.stringify(englishNumbers)} vs ${JSON.stringify(localizedNumbers)}`,
  );
}

function assertParity(locale: PgkLocaleV1) {
  const localized = generatePgkCp001LocalizedReviewV1(locale);
  fail(localized.length === 36, `${locale}: expected 36 questions`);

  localized.forEach((q, index) => {
    const english = PGK_001_CP001_REVIEW_BATCH_V1[index]!;
    fail(q.localizationV1.englishQuestionId === english.questionId, `${q.questionId}: English id mismatch`);
    fail(q.localizationV1.englishCertification === "PGK-001-FINAL-FACTUAL-CERTIFICATION-V1", `${q.questionId}: certification mismatch`);
    fail(q.qlId === english.qlId, `${q.questionId}: QL mismatch`);
    fail(q.difficulty === english.difficulty, `${q.questionId}: difficulty mismatch`);
    fail(q.correctIndex === english.correctIndex, `${q.questionId}: correct-index mismatch`);
    fail(JSON.stringify(q.factIds) === JSON.stringify(english.factIds), `${q.questionId}: factIds mismatch`);
    fail(JSON.stringify(q.sourceIds) === JSON.stringify(english.sourceIds), `${q.questionId}: sourceIds mismatch`);
    fail(JSON.stringify(q.sourceFactIds) === JSON.stringify(english.sourceFactIds), `${q.questionId}: sourceFactIds mismatch`);
    fail(q.options.length === 4 && new Set(q.options).size === 4, `${q.questionId}: options must remain four unique values`);
    fail(q.canonicalAnswer === q.options[q.correctIndex], `${q.questionId}: localized answer/index mismatch`);
    fail(q.reviewOnly && !q.runtimeRegistered && q.localizationV1.reviewOnly, `${q.questionId}: review-only boundary changed`);

    if (locale === "en") {
      fail(q.questionId === english.questionId, `${q.questionId}: English id drift`);
      fail(q.stem === english.stem, `${q.questionId}: English stem drift`);
      fail(JSON.stringify(q.options) === JSON.stringify(english.options), `${q.questionId}: English options drift`);
      fail(q.explanation === english.explanation, `${q.questionId}: English explanation drift`);
      fail(q.canonicalAnswer === english.canonicalAnswer, `${q.questionId}: English answer drift`);
    } else {
      fail(q.questionId === `${english.questionId}-${locale.toUpperCase()}`, `${q.questionId}: localized id mismatch`);
      assertNative(q, locale, english);
    }
  });
}

fail(PGK_001_CP001_REVIEW_BATCH_V1.length === 36, "CP001 English corpus must contain 36 questions");
fail(Object.keys(PGK_CP001_HI_V1).length === 36, "CP001 Hindi must contain 36 overlays");
fail(Object.keys(PGK_CP001_PA_V1).length === 36, "CP001 Punjabi must contain 36 overlays");

for (const locale of locales) assertParity(locale);

const all = locales.flatMap(generatePgkCp001LocalizedReviewV1);
fail(all.length === 108, `Expected 108 EN-HI-PA surfaces, found ${all.length}`);
fail(new Set(all.map((q) => q.questionId)).size === 108, "Localized question IDs are not unique");

console.log("PGK-001 CP001 multilingual audit passed: 36 questions per locale / 108 EN-HI-PA surfaces.");
