import { describe, expect, it } from "vitest";
import { PGK_001_CP017_FACT_IDS } from "./pgk-001-cp017-facts";
import { PGK_001_CP017_REVIEW_BATCH_V1, auditPgk001Cp017ReviewBatchV1 } from "./pgk-001-cp017-review-batch-v1";

describe("PGK-001 CP017 review candidate v1", () => {
  it("passes deterministic review guards", () => {
    const audit = auditPgk001Cp017ReviewBatchV1();
    expect(audit.valid).toBe(true);
    expect(audit.issues).toEqual([]);
  });

  it("contains 42 questions across seven QLs", () => {
    expect(PGK_001_CP017_REVIEW_BATCH_V1).toHaveLength(42);
    expect(new Set(PGK_001_CP017_REVIEW_BATCH_V1.map((question) => question.qlId)).size).toBe(7);
  });

  it("keeps direct exam-grade learner wording", () => {
    const learner = PGK_001_CP017_REVIEW_BATCH_V1.map((question) => `${question.stem}\n${question.explanation}`).join("\n").toLowerCase();
    for (const banned of [
      "associated with", "closely associated", "linked with", "closely linked", "known for",
      "formed the framework", "school history", "punjab-board", "according to",
    ]) expect(learner).not.toContain(banned);
  });

  it("keeps explanations slightly fuller", () => {
    for (const question of PGK_001_CP017_REVIEW_BATCH_V1) {
      const sentences = question.explanation.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
      expect(sentences.length).toBeGreaterThanOrEqual(2);
      expect(sentences.length).toBeLessThanOrEqual(3);
    }
  });

  it("uses registered facts and remains review-only", () => {
    const facts = new Set(PGK_001_CP017_FACT_IDS);
    for (const question of PGK_001_CP017_REVIEW_BATCH_V1) {
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      for (const factId of question.factIds) expect(facts.has(factId)).toBe(true);
    }
  });
});
