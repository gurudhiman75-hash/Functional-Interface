import { describe, expect, it } from "vitest";
import { SCI_CP017_REVIEW_V1, validateSciCp017ReviewV1 } from "./sci-cp017-review-v1";

describe("SCI-CP-017 review candidate V1", () => {
  it("satisfies the review contract", () => {
    const result = validateSciCp017ReviewV1();
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
    expect(result.totalQuestions).toBe(60);
    expect(result.difficultyCounts).toEqual({ Easy: 18, Medium: 30, Hard: 12 });
    expect(result.answerPositionCounts).toEqual({ A: 15, B: 15, C: 15, D: 15 });
    expect(new Set(SCI_CP017_REVIEW_V1.map((q) => q.stem)).size).toBe(60);
    expect(SCI_CP017_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });
});
