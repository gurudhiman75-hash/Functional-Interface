import { describe, expect, it } from "vitest";
import { PGK_001_CP022_REVIEW_BATCH_V1, auditPgk001Cp022ReviewBatchV1 } from "./pgk-001-cp022-review-batch-v1";

describe("PGK-001 CP022 Punjabi Literature review batch V1", () => {
  it("contains exactly 42 review-only questions", () => {
    expect(PGK_001_CP022_REVIEW_BATCH_V1).toHaveLength(42);
    expect(PGK_001_CP022_REVIEW_BATCH_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("contains six questions per QL", () => {
    for (let ql = 147; ql <= 153; ql += 1) {
      const id = `PGK-001-QL-${ql}`;
      expect(PGK_001_CP022_REVIEW_BATCH_V1.filter((q) => q.qlId === id)).toHaveLength(6);
    }
  });

  it("passes deterministic learner-language guards", () => {
    const audit = auditPgk001Cp022ReviewBatchV1();
    expect(audit.errors).toEqual([]);
    expect(audit.ok).toBe(true);
  });

  it("covers the major classical and modern relations", () => {
    const text = JSON.stringify(PGK_001_CP022_REVIEW_BATCH_V1);
    for (const token of [
      "Baba Farid",
      "Bulleh Shah",
      "Waris Shah",
      "Heer",
      "Bhai Vir Singh",
      "Nanak Singh",
      "Amrita Pritam",
      "Pinjar",
      "Shiv Kumar Batalvi",
      "Loona",
      "Gurdial Singh",
      "Marhi Da Deeva",
    ]) expect(text).toContain(token);
  });

  it("keeps explanations at the approved slightly-fuller length", () => {
    for (const q of PGK_001_CP022_REVIEW_BATCH_V1) {
      const count = q.explanation.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).length;
      expect(count).toBeGreaterThanOrEqual(2);
      expect(count).toBeLessThanOrEqual(3);
    }
  });
});
