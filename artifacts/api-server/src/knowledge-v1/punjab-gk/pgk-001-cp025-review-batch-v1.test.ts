import { describe, expect, it } from "vitest";
import { PGK_001_CP025_REVIEW_BATCH_V1, auditPgk001Cp025ReviewBatchV1 } from "./pgk-001-cp025-review-batch-v1";
import { PGK_001_CP025_FACTS } from "./pgk-001-cp025-facts";

describe("PGK-001 CP025 review batch V1", () => {
  it("contains exactly 42 review-only questions across 7 QLs", () => {
    expect(PGK_001_CP025_REVIEW_BATCH_V1).toHaveLength(42);
    expect(new Set(PGK_001_CP025_REVIEW_BATCH_V1.map((q) => q.qlId)).size).toBe(7);
    expect(PGK_001_CP025_REVIEW_BATCH_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });
  it("passes learner-language and structural audit", () => {
    const audit = auditPgk001Cp025ReviewBatchV1();
    expect(audit.errors).toEqual([]);
    expect(audit.ok).toBe(true);
  });
  it("keeps a non-empty canonical fact layer", () => {
    expect(PGK_001_CP025_FACTS.length).toBeGreaterThanOrEqual(10);
    expect(new Set(PGK_001_CP025_FACTS.map((f) => f.id)).size).toBe(PGK_001_CP025_FACTS.length);
  });
});
