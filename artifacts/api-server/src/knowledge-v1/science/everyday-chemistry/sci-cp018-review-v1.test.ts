import { describe, expect, it } from "vitest";
import { SCI_CP018_REVIEW_V1, validateSciCp018ReviewV1 } from "./sci-cp018-review-v1";

describe("SCI-CP-018 review candidate V2", () => {
  it("satisfies the structural review contract", () => {
    const result = validateSciCp018ReviewV1();
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
    expect(result.totalQuestions).toBe(60);
    expect(result.difficultyCounts).toEqual({ Easy: 18, Medium: 30, Hard: 12 });
    expect(result.answerPositionCounts).toEqual({ A: 15, B: 15, C: 15, D: 15 });
    expect(new Set(SCI_CP018_REVIEW_V1.map((q) => q.stem)).size).toBe(60);
    expect(SCI_CP018_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("covers the V2 everyday-chemistry surface", () => {
    const text = SCI_CP018_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n").toLowerCase();
    for (const token of ["quicklime","cng","lpg","biogas","urea","dap","polyvinyl chloride","teflon","bakelite","rayon","blue vitriol","glauber's salt","sodium benzoate","temporary hardness","activated charcoal","vulcanization","borosilicate","gypsum"]) {
      expect(text).toContain(token);
    }
    expect(SCI_CP018_REVIEW_V1.filter((q) => q.stem.includes("Consider the statements")).length).toBe(0);
  });
});
