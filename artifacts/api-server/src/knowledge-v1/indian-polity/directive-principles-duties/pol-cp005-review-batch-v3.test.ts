import { describe, expect, it } from "vitest";
import {
  POL_CP005_DPSP_ARTICLES_V1,
  POL_CP005_DUTIES_V1,
} from "./pol-cp005-facts";
import { generatePolCp005ReviewBatchV3 } from "./pol-cp005-review-generator-v3";
import { POL_CP005_SOURCES_V1 } from "./pol-cp005-sources";

describe("POL-CP-005 DPSP and Fundamental Duties review batch V3", () => {
  const questions = generatePolCp005ReviewBatchV3();

  it("provides complete review breadth", () => {
    expect(questions).toHaveLength(80);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(22);
  });

  it("keeps the intended difficulty distribution", () => {
    const counts = questions.reduce<Record<string, number>>((acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts).toEqual({ Easy: 22, Medium: 46, Hard: 12 });
  });

  it("keeps every question structurally valid", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.sourceFactIds.length).toBeGreaterThan(0);
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
    }
  });

  it("uses all four correct-option positions", () => {
    expect(new Set(questions.map((question) => question.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
  });

  it("has no exact semantic duplicates", () => {
    const signatures = questions.map((question) => [question.qlId, question.stem, question.canonicalAnswer].join("|"));
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("resolves every source ID", () => {
    const sourceIds = new Set(POL_CP005_SOURCES_V1.map((source) => source.sourceId));
    for (const question of questions) {
      for (const sourceId of question.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("keeps the constitutional coverage complete", () => {
    expect(POL_CP005_DPSP_ARTICLES_V1.map((row) => row.article)).toEqual([
      "36", "37", "38", "39", "39A", "40", "41", "42", "43", "43A", "43B", "44", "45", "46", "47", "48", "48A", "49", "50", "51",
    ]);
    expect(POL_CP005_DUTIES_V1).toHaveLength(11);
    expect(POL_CP005_DUTIES_V1.map((row) => row.clause)).toEqual([
      "51A(a)", "51A(b)", "51A(c)", "51A(d)", "51A(e)", "51A(f)", "51A(g)", "51A(h)", "51A(i)", "51A(j)", "51A(k)",
    ]);
  });

  it("keeps the approved exam-style language rules", () => {
    const text = questions.map((question) => question.stem).join("\n");
    expect(text).not.toMatch(/On which date did the following occur/i);
    expect(text).not.toMatch(/most directly governs/i);
    expect(text).not.toMatch(/principal subject/i);
    for (const question of questions) {
      if (!question.stem.startsWith("Consider the following statements")) {
        expect(question.stem.split(/\s+/).length).toBeLessThanOrEqual(32);
      }
    }
  });

  it("keeps key amendment distinctions explicit", () => {
    const text = questions.map((question) => `${question.stem} ${question.canonicalAnswer}`).join("\n");
    expect(text).toContain("Forty-second Amendment");
    expect(text).toContain("Eighty-sixth Amendment");
    expect(text).toContain("Ninety-seventh Amendment");
    expect(text).toContain("Article 51A(k)");
  });
});
