import { describe, expect, it } from "vitest";
import {
  PGK_001_CP018_REVIEW_BATCH_V1,
  auditPgk001Cp018ReviewBatchV1,
} from "./pgk-001-cp018-review-batch-v1";

describe("PGK-001 CP018 review batch V1", () => {
  it("contains 42 review-only questions", () => {
    expect(PGK_001_CP018_REVIEW_BATCH_V1).toHaveLength(42);
    expect(PGK_001_CP018_REVIEW_BATCH_V1.every((q) => q.reviewOnly)).toBe(true);
    expect(PGK_001_CP018_REVIEW_BATCH_V1.every((q) => !q.runtimeRegistered)).toBe(true);
  });

  it("contains six questions in each permanent QL", () => {
    for (let ql = 119; ql <= 125; ql += 1) {
      expect(PGK_001_CP018_REVIEW_BATCH_V1.filter((q) => q.qlId === `PGK-001-QL-${ql}`)).toHaveLength(6);
    }
  });

  it("keeps the main administrative chronology distinct", () => {
    const text = PGK_001_CP018_REVIEW_BATCH_V1.map((q) => `${q.question} ${q.explanation}`).join(" ");
    expect(text).toContain("1947");
    expect(text).toContain("1948");
    expect(text).toContain("1956");
    expect(text).toContain("1966");
    expect(text).toContain("PEPSU");
    expect(text).toContain("Haryana");
    expect(text).toContain("Chandigarh");
  });

  it("keeps options and correct indices valid", () => {
    for (const item of PGK_001_CP018_REVIEW_BATCH_V1) {
      expect(item.options).toHaveLength(4);
      expect(new Set(item.options).size).toBe(4);
      expect(item.correctIndex).toBeGreaterThanOrEqual(0);
      expect(item.correctIndex).toBeLessThan(4);
    }
  });

  it("passes the deterministic learner-text audit", () => {
    const audit = auditPgk001Cp018ReviewBatchV1();
    expect(audit.errors).toEqual([]);
    expect(audit.valid).toBe(true);
  });
});
