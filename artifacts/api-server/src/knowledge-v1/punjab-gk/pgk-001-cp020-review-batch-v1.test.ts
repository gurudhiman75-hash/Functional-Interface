import { describe, expect, it } from "vitest";
import {
  PGK_001_CP020_REVIEW_BATCH_V1,
  auditPgk001Cp020ReviewBatchV1,
} from "./pgk-001-cp020-review-batch-v1";

describe("PGK-001 CP020 review batch V1", () => {
  it("contains exactly 42 review-only questions", () => {
    expect(PGK_001_CP020_REVIEW_BATCH_V1).toHaveLength(42);
    expect(PGK_001_CP020_REVIEW_BATCH_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("contains six questions for each permanent QL", () => {
    for (let ql = 133; ql <= 139; ql += 1) {
      const id = `PGK-001-QL-${ql}`;
      expect(PGK_001_CP020_REVIEW_BATCH_V1.filter((q) => q.qlId === id)).toHaveLength(6);
    }
  });

  it("keeps four unique options and the answer inside the option set", () => {
    for (const q of PGK_001_CP020_REVIEW_BATCH_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options).toContain(q.answer);
    }
  });

  it("passes deterministic learner-language and Census-snapshot audit", () => {
    const audit = auditPgk001Cp020ReviewBatchV1();
    expect(audit.errors).toEqual([]);
    expect(audit.ok).toBe(true);
  });
});
