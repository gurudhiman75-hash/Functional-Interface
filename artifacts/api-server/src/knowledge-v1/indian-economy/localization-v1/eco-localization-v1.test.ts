import { describe, expect, it } from "vitest";
import { ECO_CP001_REVIEW_V2 } from "../basic-economic-concepts/eco-cp001-review-generator-v2";
import { ECO_CP002_REVIEW_V2 } from "../economic-systems-sectors/eco-cp002-review-generator-v2";
import {
  generateEcoCp001LocalizedReviewV1,
  generateEcoCp002LocalizedReviewV1,
  generateEcoCp001Cp002LocalizedReviewV1,
} from "./eco-localization-generator-v1";
import type { EcoLocaleV1, EcoLocalizedQuestionV1 } from "./eco-localization-types-v1";

const locales: EcoLocaleV1[] = ["en", "hi", "pa"];

function learnerText(question: EcoLocalizedQuestionV1): string {
  return [question.stem, ...question.options, question.explanation].join("\n");
}

function assertNativeScript(locale: "hi" | "pa", question: EcoLocalizedQuestionV1) {
  const text = learnerText(question);
  const withoutRomanStatementLabels = text.replace(/\bI{1,2}\b/gu, "");
  expect(withoutRomanStatementLabels, `${question.questionId}: Latin-script leakage`).not.toMatch(/[A-Za-z]{2,}/u);
  if (locale === "hi") expect(text, `${question.questionId}: missing Devanagari`).toMatch(/[\u0900-\u097F]/u);
  if (locale === "pa") expect(text, `${question.questionId}: missing Gurmukhi`).toMatch(/[\u0A00-\u0A7F]/u);
}

function assertParity(
  english: readonly { questionId: string; cpId: string; qlId: string; difficulty: string; correctIndex: number; sourceIds: string[]; sourceFactIds: string[] }[],
  localized: readonly EcoLocalizedQuestionV1[],
  locale: EcoLocaleV1,
) {
  expect(localized).toHaveLength(english.length);
  localized.forEach((question, index) => {
    const source = english[index];
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
    expect(question.localizationV1.semanticInvariant).toBe(true);
    expect(question.localizationV1.optionOrderInvariant).toBe(true);
    expect(question.localizationV1.correctIndexInvariant).toBe(true);
    if (locale === "en") {
      expect(question.questionId).toBe(source.questionId);
    } else {
      expect(question.questionId).toBe(`${source.questionId}-${locale.toUpperCase()}`);
      assertNativeScript(locale, question);
    }
  });
}

describe("Economy multilingual V1 CP001-CP002", () => {
  it("preserves the frozen 42-question CP001 surface in all locales", () => {
    expect(ECO_CP001_REVIEW_V2).toHaveLength(42);
    for (const locale of locales) {
      assertParity(ECO_CP001_REVIEW_V2, generateEcoCp001LocalizedReviewV1(locale), locale);
    }
  });

  it("preserves the frozen 42-question CP002 surface in all locales", () => {
    expect(ECO_CP002_REVIEW_V2).toHaveLength(42);
    for (const locale of locales) {
      assertParity(ECO_CP002_REVIEW_V2, generateEcoCp002LocalizedReviewV1(locale), locale);
    }
  });

  it("exposes 84 questions per locale and 252 review surfaces total", () => {
    for (const locale of locales) {
      expect(generateEcoCp001Cp002LocalizedReviewV1(locale)).toHaveLength(84);
    }
    expect(locales.flatMap((locale) => generateEcoCp001Cp002LocalizedReviewV1(locale))).toHaveLength(252);
  });

  it("does not mutate frozen English learner text", () => {
    const english = generateEcoCp001Cp002LocalizedReviewV1("en");
    const source = [...ECO_CP001_REVIEW_V2, ...ECO_CP002_REVIEW_V2];
    english.forEach((question, index) => {
      expect(question.stem).toBe(source[index].stem);
      expect(question.options).toEqual(source[index].options);
      expect(question.explanation).toBe(source[index].explanation);
      expect(question.canonicalAnswer).toBe(source[index].canonicalAnswer);
    });
  });
});
