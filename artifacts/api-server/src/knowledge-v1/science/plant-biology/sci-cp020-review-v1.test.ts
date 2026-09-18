import { describe, expect, it } from "vitest";
import { SCI_CP020_REVIEW_V1, validateSciCp020ReviewV1 } from "./sci-cp020-review-v1";

describe("SCI-CP-020 review candidate V1", () => {
  it("satisfies the structural review contract", () => {
    const result = validateSciCp020ReviewV1();
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
    expect(result.totalQuestions).toBe(60);
    expect(result.difficultyCounts).toEqual({ Easy:18, Medium:30, Hard:12 });
    expect(result.answerPositionCounts).toEqual({ A:15, B:15, C:15, D:15 });
    expect(Object.values(result.qlCounts)).toEqual(Array(10).fill(6));
  });

  it("keeps the whole candidate review-only", () => {
    expect(SCI_CP020_REVIEW_V1.every(q => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });
});
