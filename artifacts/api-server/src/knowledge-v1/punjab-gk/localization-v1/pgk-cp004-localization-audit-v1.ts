import { PGK_001_CP004_REVIEW_BATCH_V2 } from "../pgk-001-cp004-review-batch-v2";
import { PGK_CP004_HI_V1 } from "./pgk-cp004-hi-v1";
import { PGK_CP004_PA_V1 } from "./pgk-cp004-pa-v1";
import { generatePgkCp004LocalizedReviewV1 } from "./pgk-cp004-localization-v1";
import type { PgkLocaleV1 } from "./pgk-localization-types-v1";

const locales: PgkLocaleV1[] = ["en", "hi", "pa"];

function fail(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function learnerText(q: { stem: string; options: readonly string[]; explanation: string }) {
  return [q.stem, ...q.options, q.explanation].join("\n");
}

function numbers(text: string) {
  return (text.match(/\d+(?:[,.]\d+)?/g) ?? [])
    .map((value) => value.replace(/,/g, ""))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

function assertNative(
  q: ReturnType<typeof generatePgkCp004LocalizedReviewV1>[number],
  locale: "hi" | "pa",
  english: (typeof PGK_001_CP004_REVIEW_BATCH_V2)[number],
) {
  const text = learnerText(q);
  const scriptText = text.replace(/[।॥]/g, "");
  const latin = text.match(/[A-Za-z]{2,}/u)?.[0];
  fail(!latin, `${q.questionId}: Latin-script leakage: ${latin ?? "unknown"}`);
  fail(q.stem.length <= 520, `${q.questionId}: localized stem too long`);
  fail(q.explanation.length >= 25, `${q.questionId}: localized explanation too short`);
  fail(q.explanation.length <= 460, `${q.questionId}: localized explanation too long`);

  if (locale === "hi") {
    fail(/[\u0900-\u097F]/u.test(scriptText), `${q.questionId}: missing Devanagari`);
    fail(!/[\u0A00-\u0A7F]/u.test(scriptText), `${q.questionId}: Gurmukhi leakage in Hindi`);
  } else {
    fail(/[\u0A00-\u0A7F]/u.test(scriptText), `${q.questionId}: missing Gurmukhi`);
    fail(!/[\u0900-\u097F]/u.test(scriptText), `${q.questionId}: Devanagari leakage in Punjabi`);
  }

  fail(
    JSON.stringify(numbers(learnerText(english))) === JSON.stringify(numbers(text)),
    `${q.questionId}: numeric parity mismatch :: ${JSON.stringify(numbers(learnerText(english)))} vs ${JSON.stringify(numbers(text))}`,
  );
}

function assertParity(locale: PgkLocaleV1) {
  const localized = generatePgkCp004LocalizedReviewV1(locale);
  fail(localized.length === 42, `${locale}: expected 42 questions`);

  localized.forEach((q, index) => {
    const english = PGK_001_CP004_REVIEW_BATCH_V2[index]!;
    fail(q.localizationV1.englishQuestionId === english.questionId, `${q.questionId}: English id mismatch`);
    fail(q.localizationV1.englishCertification === "PGK-001-FINAL-FACTUAL-CERTIFICATION-V1", `${q.questionId}: certification mismatch`);
    fail(q.qlId === english.qlId, `${q.questionId}: QL mismatch`);
    fail(q.difficulty === english.difficulty, `${q.questionId}: difficulty mismatch`);
    fail(q.correctIndex === english.correctIndex, `${q.questionId}: correct-index mismatch`);
    fail(JSON.stringify(q.factIds) === JSON.stringify(english.factIds), `${q.questionId}: factIds mismatch`);
    fail(JSON.stringify(q.sourceIds) === JSON.stringify(english.sourceIds), `${q.questionId}: sourceIds mismatch`);
    fail(q.options.length === 4 && new Set(q.options).size === 4, `${q.questionId}: expected four unique localized options`);
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

fail(PGK_001_CP004_REVIEW_BATCH_V2.length === 42, "CP004 English V2 corpus must contain 42 questions");
fail(Object.keys(PGK_CP004_HI_V1).length === 42, "CP004 Hindi must contain 42 overlays");
fail(Object.keys(PGK_CP004_PA_V1).length === 42, "CP004 Punjabi must contain 42 overlays");

for (const locale of locales) assertParity(locale);

const all = locales.flatMap(generatePgkCp004LocalizedReviewV1);
fail(all.length === 126, `Expected 126 EN-HI-PA surfaces, found ${all.length}`);
fail(new Set(all.map((q) => q.questionId)).size === 126, "Localized question IDs are not unique");

console.log("PGK-001 CP004 multilingual audit passed: 42 questions per locale / 126 EN-HI-PA surfaces.");
