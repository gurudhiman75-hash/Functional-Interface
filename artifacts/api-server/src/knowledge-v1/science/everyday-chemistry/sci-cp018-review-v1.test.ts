import { describe, expect, it } from "vitest";
import { SCI_CP018_REVIEW_V1, validateSciCp018ReviewV1 } from "./sci-cp018-review-v1";

describe("SCI-CP-018 review candidate V1", () => {
  it("satisfies the review contract", () => {
    const result = validateSciCp018ReviewV1();
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
    expect(result.totalQuestions).toBe(60);
    expect(result.difficultyCounts).toEqual({ Easy: 18, Medium: 30, Hard: 12 });
    expect(result.answerPositionCounts).toEqual({ A: 15, B: 15, C: 15, D: 15 });
    expect(SCI_CP018_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });
});
