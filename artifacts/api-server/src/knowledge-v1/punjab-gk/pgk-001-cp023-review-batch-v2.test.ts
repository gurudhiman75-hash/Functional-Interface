import { describe, expect, it } from "vitest";
import { PGK_001_CP023_REVIEW_BATCH_V2, auditPgk001Cp023ReviewBatchV2 } from "./pgk-001-cp023-review-batch-v2";

describe("PGK-001 CP023 review batch V2", () => {
  it("contains 42 review-only questions across seven QLs", () => {
    expect(PGK_001_CP023_REVIEW_BATCH_V2).toHaveLength(42);
    expect(new Set(PGK_001_CP023_REVIEW_BATCH_V2.map((q) => q.qlId)).size).toBe(7);
    expect(PGK_001_CP023_REVIEW_BATCH_V2.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("passes the learner-language audit", () => {
    const audit = auditPgk001Cp023ReviewBatchV2();
    expect(audit.errors).toEqual([]);
    expect(audit.ok).toBe(true);
  });

  it("contains no mechanical learner qualifiers", () => {
    const learner = JSON.stringify(PGK_001_CP023_REVIEW_BATCH_V2).toLowerCase();
    for (const term of ["traditionally", "mainly", "generally", "commonly", "widely", "usually", "best described"]) {
      expect(learner).not.toContain(term);
    }
  });
});
