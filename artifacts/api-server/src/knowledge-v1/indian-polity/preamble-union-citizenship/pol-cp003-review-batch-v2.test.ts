import { describe, expect, it } from "vitest";
import {
  POL_CP003_CITIZENSHIP_ARTICLES_V1,
  POL_CP003_UNION_ARTICLES_V1,
} from "./pol-cp003-facts";
import { generatePolCp003ReviewBatchV2 } from "./pol-cp003-review-generator-v2";
import { POL_CP003_SOURCES_V1 } from "./pol-cp003-sources";

describe("POL-CP-003 Preamble, Union and Citizenship review batch V2", () => {
  const questions = generatePolCp003ReviewBatchV2();

  it("provides a broad review batch across all genuine QLs", () => {
    expect(questions).toHaveLength(58);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(18);
  });

  it("keeps the intended difficulty distribution", () => {
    const counts = questions.reduce<Record<string, number>>((acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts).toEqual({ Easy: 14, Medium: 35, Hard: 9 });
  });

  it("keeps every question structurally valid", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.stem.trim().length).toBeGreaterThan(12);
      expect(question.explanation.trim().length).toBeGreaterThan(15);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.sourceFactIds.length).toBeGreaterThan(0);
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
    }
  });

  it("uses all four correct-option positions", () => {
    expect(new Set(questions.map((question) => question.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
  });

  it("has no exact duplicate question semantics", () => {
    const signatures = questions.map((question) =>
      [question.qlId, question.stem, question.canonicalAnswer].join("|"),
    );
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("resolves every source ID in the CP source registry", () => {
    const sourceIds = new Set(POL_CP003_SOURCES_V1.map((source) => source.sourceId));
    for (const question of questions) {
      for (const sourceId of question.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("keeps the constitutional Article map complete", () => {
    expect(POL_CP003_UNION_ARTICLES_V1.map((row) => row.article)).toEqual([1, 2, 3, 4]);
    expect(POL_CP003_CITIZENSHIP_ARTICLES_V1.map((row) => row.article)).toEqual([5, 6, 7, 8, 9, 10, 11]);
  });

  it("blocks rejected generic or unnecessarily legalistic stem wording", () => {
    const text = questions.map((question) => question.stem).join("\n");
    expect(text).not.toMatch(/On which date did the following occur/i);
    expect(text).not.toMatch(/principal subject/i);
    expect(text).not.toMatch(/most directly governs/i);
    expect(text).not.toMatch(/For the purposes of Article 368/i);
    expect(text).not.toMatch(/supplemental, incidental and consequential provisions/i);
  });

  it("keeps ordinary direct stems short", () => {
    for (const question of questions) {
      if (question.stem.startsWith("Consider the following statements")) continue;
      expect(question.stem.split(/\s+/).length).toBeLessThanOrEqual(30);
    }
  });

  it("does not leak current citizenship-policy questions into Static GK", () => {
    const text = questions.map((question) => `${question.stem} ${question.explanation}`).join("\n");
    expect(text).not.toMatch(/current citizenship policy|current citizenship rules|current office-holder/i);
  });
});
