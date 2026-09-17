import { describe, expect, it } from "vitest";
import { ECO_CP001_REVIEW_V2 } from "../basic-economic-concepts/eco-cp001-review-generator-v2";
import { ECO_CP002_REVIEW_V2 } from "../economic-systems-sectors/eco-cp002-review-generator-v2";
import { ECO_CP003_REVIEW_V2 } from "../national-income-aggregates/eco-cp003-review-generator-v2";
import { ECO_CP004_REVIEW_V2 } from "../national-income-measurement-india/eco-cp004-review-generator-v2";
import {
  generateEcoCp001LocalizedReviewV1,
  generateEcoCp002LocalizedReviewV1,
  generateEcoCp003LocalizedReviewV1,
  generateEcoCp004LocalizedReviewV1,
  generateEcoCp001Cp002LocalizedReviewV1,
  generateEcoCp003Cp004LocalizedReviewV1,
  generateEcoCp001Cp004LocalizedReviewV1,
} from "./eco-localization-generator-v1";
import type { EcoLocaleV1, EcoLocalizedQuestionV1 } from "./eco-localization-types-v1";

const locales: EcoLocaleV1[] = ["en", "hi", "pa"];

function learnerText(question: EcoLocalizedQuestionV1): string {
  return [question.stem, ...question.options, question.explanation].join("\n");
}

function assertNativeScript(locale: "hi" | "pa", question: EcoLocalizedQuestionV1) {
  const text = learnerText(question);
  const allowedRoman = /\b(?:I|II|GDP|GNP|NDP|NNP|NFIA|GVA|MoSPI)\b/gu;
  const withoutAllowedRoman = text.replace(allowedRoman, "");
  expect(withoutAllowedRoman, `${question.questionId}: Latin-script leakage`).not.toMatch(/[A-Za-z]{2,}/u);
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
    expect(question.localizationV1.cpInvariant).toBe(true);
    expect(question.localizationV1.qlInvariant).toBe(true);
    expect(question.localizationV1.difficultyInvariant).toBe(true);
    expect(question.localizationV1.sourceInvariant).toBe(true);
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

function assertEnglishNoDrift(
  source: readonly { stem: string; options: string[]; explanation: string; canonicalAnswer: string }[],
  localized: readonly EcoLocalizedQuestionV1[],
) {
  localized.forEach((question, index) => {
    expect(question.stem).toBe(source[index].stem);
    expect(question.options).toEqual(source[index].options);
    expect(question.explanation).toBe(source[index].explanation);
    expect(question.canonicalAnswer).toBe(source[index].canonicalAnswer);
  });
}

describe("Economy multilingual V1 CP001-CP002", () => {
  it("preserves the frozen 42-question CP001 surface in all locales", () => {
    expect(ECO_CP001_REVIEW_V2).toHaveLength(42);
    for (const locale of locales) assertParity(ECO_CP001_REVIEW_V2, generateEcoCp001LocalizedReviewV1(locale), locale);
  });

  it("preserves the frozen 42-question CP002 surface in all locales", () => {
    expect(ECO_CP002_REVIEW_V2).toHaveLength(42);
    for (const locale of locales) assertParity(ECO_CP002_REVIEW_V2, generateEcoCp002LocalizedReviewV1(locale), locale);
  });

  it("exposes 84 questions per locale and 252 review surfaces total", () => {
    for (const locale of locales) expect(generateEcoCp001Cp002LocalizedReviewV1(locale)).toHaveLength(84);
    expect(locales.flatMap((locale) => generateEcoCp001Cp002LocalizedReviewV1(locale))).toHaveLength(252);
  });

  it("does not mutate frozen English learner text", () => {
    assertEnglishNoDrift(
      [...ECO_CP001_REVIEW_V2, ...ECO_CP002_REVIEW_V2],
      generateEcoCp001Cp002LocalizedReviewV1("en"),
    );
  });
});

describe("Economy multilingual V1 CP003-CP004", () => {
  it("preserves the frozen 44-question CP003 surface in all locales", () => {
    expect(ECO_CP003_REVIEW_V2).toHaveLength(44);
    for (const locale of locales) assertParity(ECO_CP003_REVIEW_V2, generateEcoCp003LocalizedReviewV1(locale), locale);
  });

  it("preserves the frozen 44-question CP004 surface in all locales", () => {
    expect(ECO_CP004_REVIEW_V2).toHaveLength(44);
    for (const locale of locales) assertParity(ECO_CP004_REVIEW_V2, generateEcoCp004LocalizedReviewV1(locale), locale);
  });

  it("exposes 88 questions per locale and 264 review surfaces for this checkpoint", () => {
    for (const locale of locales) expect(generateEcoCp003Cp004LocalizedReviewV1(locale)).toHaveLength(88);
    expect(locales.flatMap((locale) => generateEcoCp003Cp004LocalizedReviewV1(locale))).toHaveLength(264);
  });

  it("keeps the cumulative CP001-CP004 surface at 172 questions per locale", () => {
    for (const locale of locales) expect(generateEcoCp001Cp004LocalizedReviewV1(locale)).toHaveLength(172);
  });

  it("does not mutate frozen CP003-CP004 English learner text", () => {
    assertEnglishNoDrift(
      [...ECO_CP003_REVIEW_V2, ...ECO_CP004_REVIEW_V2],
      generateEcoCp003Cp004LocalizedReviewV1("en"),
    );
  });
});
