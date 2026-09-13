import { describe, expect, it } from "vitest";
import { POL_CP002_SOURCES_V1 } from "./pol-cp002-sources";
import { generatePolCp002ReviewBatchV1 } from "./pol-cp002-review-generator-v1";

describe("POL-CP-002 Constituent Assembly review batch", () => {
  const questions = generatePolCp002ReviewBatchV1();

  it("contains the complete 50-question review batch and all QLs", () => {
    expect(questions).toHaveLength(50);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(16);
  });

  it("uses the intended difficulty distribution", () => {
    const counts = questions.reduce<Record<string, number>>((acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts).toEqual({ Easy: 18, Medium: 24, Hard: 8 });
  });

  it("keeps every question structurally valid", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.stem.trim().length).toBeGreaterThan(15);
      expect(question.explanation.trim().length).toBeGreaterThan(20);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.sourceFactIds.length).toBeGreaterThan(0);
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
    }
  });

  it("uses all four correct-option positions", () => {
    expect(new Set(questions.map((question) => question.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
  });

  it("has no semantic duplicates", () => {
    expect(new Set(questions.map((question) => question.semanticSignature)).size).toBe(questions.length);
  });

  it("resolves every source ID in the source registry", () => {
    const sourceIds = new Set(POL_CP002_SOURCES_V1.map((source) => source.sourceId));
    for (const question of questions) {
      for (const sourceId of question.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("does not leak current political office-holder content into Static GK", () => {
    const text = questions.map((question) => `${question.stem} ${question.explanation}`).join("\n");
    expect(text).not.toMatch(/current president|current prime minister|current governor|incumbent/i);
  });

  it("keeps adoption, signing and commencement as distinct milestones", () => {
    const distinction = questions.find((question) => question.qlId === "POL-002-QL-015");
    expect(distinction?.canonicalAnswer).toContain("26 November 1949");
    expect(distinction?.canonicalAnswer).toContain("24 January 1950");
    expect(distinction?.canonicalAnswer).toContain("26 January 1950");
  });
});
