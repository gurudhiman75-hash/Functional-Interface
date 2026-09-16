import { describe, expect, it } from "vitest";
import { SCI_CP019_REVIEW_V1, validateSciCp019ReviewV1 } from "./sci-cp019-review-v1";

describe("SCI-CP-019 review candidate V1", () => {
  it("satisfies the review contract", () => {
    const result = validateSciCp019ReviewV1();
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
    expect(result.totalQuestions).toBe(60);
    expect(result.difficultyCounts).toEqual({ Easy: 18, Medium: 30, Hard: 12 });
    expect(result.answerPositionCounts).toEqual({ A: 15, B: 15, C: 15, D: 15 });
    expect(SCI_CP019_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });
});
