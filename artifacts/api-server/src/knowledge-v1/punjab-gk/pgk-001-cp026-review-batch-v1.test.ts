import { describe, expect, it } from "vitest";
import { PGK_001_CP026_REVIEW_BATCH_V1, auditPgk001Cp026ReviewBatchV1 } from "./pgk-001-cp026-review-batch-v1";
import { PGK_001_CP026_FACTS } from "./pgk-001-cp026-facts";

describe("PGK-001 CP026 review batch V1", () => {
  it("contains exactly 48 review-only questions across 8 QLs", () => {
    expect(PGK_001_CP026_REVIEW_BATCH_V1).toHaveLength(48);
    expect(new Set(PGK_001_CP026_REVIEW_BATCH_V1.map((q) => q.qlId)).size).toBe(8);
    expect(PGK_001_CP026_REVIEW_BATCH_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });
  it("passes learner-language and structural audit", () => {
    const audit = auditPgk001Cp026ReviewBatchV1();
    expect(audit.errors).toEqual([]);
    expect(audit.ok).toBe(true);
  });
  it("keeps a non-empty canonical fact layer", () => {
    expect(PGK_001_CP026_FACTS.length).toBeGreaterThanOrEqual(23);
    expect(new Set(PGK_001_CP026_FACTS.map((f) => f.id)).size).toBe(PGK_001_CP026_FACTS.length);
  });
});
