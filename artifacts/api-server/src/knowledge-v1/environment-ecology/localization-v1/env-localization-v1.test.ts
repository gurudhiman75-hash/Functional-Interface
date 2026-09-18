import { describe, expect, it } from "vitest";
import { generateEnvCp001ReviewBatchV4 } from "../ecology-fundamentals/env-cp001-review-generator-v4";
import { generateEnvCp001LocalizedReviewV1 } from "./env-cp001-localization-v1";
import type { EnvLocaleV1, EnvLocalizedQuestionV1 } from "./env-localization-types-v1";

const ENGLISH = generateEnvCp001ReviewBatchV4();
const locales: EnvLocaleV1[] = ["en", "hi", "pa"];

function learnerText(question: EnvLocalizedQuestionV1): string {
  return [question.stem, ...question.options, question.explanation].join("\n");
}

function assertNativeScript(locale: "hi" | "pa", question: EnvLocalizedQuestionV1) {
  const text = learnerText(question);
  const withoutAllowedRoman = text.replace(/\b(?:I|II)\b/gu, "");
  expect(withoutAllowedRoman, `${question.questionId}: Latin-script leakage`).not.toMatch(/[A-Za-z]{2,}/u);
  if (locale === "hi") expect(text, `${question.questionId}: missing Devanagari`).toMatch(/[\u0900-\u097F]/u);
  if (locale === "pa") expect(text, `${question.questionId}: missing Gurmukhi`).toMatch(/[\u0A00-\u0A7F]/u);
}

describe("Environment multilingual V1 CP001", () => {
  it("preserves the frozen 48-question surface in all locales", () => {
    expect(ENGLISH).toHaveLength(48);
    for (const locale of locales) {
      const localized = generateEnvCp001LocalizedReviewV1(locale);
      expect(localized).toHaveLength(48);
      localized.forEach((question, index) => {
        const source = ENGLISH[index];
        expect(question.localizationV1.englishQuestionId).toBe(source.questionId);
        expect(question.cpId).toBe(source.cpId);
        expect(question.qlId).toBe(source.qlId);
        expect(question.difficulty).toBe(source.difficulty);
        expect(question.correctIndex).toBe(source.correctIndex);
        expect(question.sourceIds).toEqual(source.sourceIds);
        expect(question.sourceFactIds).toEqual(source.sourceFactIds);
        expect(question.options).toHaveLength(4);
        expect(new Set(question.options).size).toBe(4);
        expect(question.canonicalAnswer).toBe(question.options[question.correctIndex]);
        expect(question.reviewOnly).toBe(true);
        expect(question.runtimeRegistered).toBe(false);
        if (locale === "en") {
          expect(question.questionId).toBe(source.questionId);
        } else {
          expect(question.questionId).toBe(`${source.questionId}-${locale.toUpperCase()}`);
          assertNativeScript(locale, question);
        }
      });
    }
  });

  it("does not drift from frozen English V4", () => {
    const localized = generateEnvCp001LocalizedReviewV1("en");
    localized.forEach((question, index) => {
      expect(question.stem).toBe(ENGLISH[index].stem);
      expect(question.options).toEqual(ENGLISH[index].options);
      expect(question.explanation).toBe(ENGLISH[index].explanation);
      expect(question.canonicalAnswer).toBe(ENGLISH[index].canonicalAnswer);
    });
  });

  it("exposes 144 EN-HI-PA review surfaces", () => {
    expect(locales.flatMap((locale) => generateEnvCp001LocalizedReviewV1(locale))).toHaveLength(144);
  });

  it("keeps all localization invariants enabled", () => {
    for (const locale of locales) {
      for (const q of generateEnvCp001LocalizedReviewV1(locale)) {
        expect(q.localizationV1.semanticInvariant).toBe(true);
        expect(q.localizationV1.cpInvariant).toBe(true);
        expect(q.localizationV1.qlInvariant).toBe(true);
        expect(q.localizationV1.difficultyInvariant).toBe(true);
        expect(q.localizationV1.sourceInvariant).toBe(true);
        expect(q.localizationV1.optionOrderInvariant).toBe(true);
        expect(q.localizationV1.correctIndexInvariant).toBe(true);
      }
    }
  });
});
