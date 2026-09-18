import { describe, expect, it } from "vitest";
import { PGK_001_CP019_REVIEW_BATCH_V1, auditPgk001Cp019ReviewBatchV1 } from "./pgk-001-cp019-review-batch-v1";

describe("PGK-001 CP019 review batch V1", () => {
  it("contains exactly 42 review-only questions", () => {
    expect(PGK_001_CP019_REVIEW_BATCH_V1).toHaveLength(42);
    expect(PGK_001_CP019_REVIEW_BATCH_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("contains six questions for each permanent QL", () => {
    for (let ql = 126; ql <= 132; ql += 1) {
      const qlId = `PGK-001-QL-${ql}`;
      expect(PGK_001_CP019_REVIEW_BATCH_V1.filter((q) => q.qlId === qlId)).toHaveLength(6);
    }
  });

  it("has valid options, answers and learner wording", () => {
    expect(auditPgk001Cp019ReviewBatchV1()).toEqual({ ok: true, errors: [] });
  });
});
