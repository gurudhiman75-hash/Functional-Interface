import { describe, expect, it } from "vitest";
import { PGK_001_CP014_FACT_IDS } from "./pgk-001-cp014-facts";
import {
  PGK_001_CP014_REVIEW_BATCH_V3,
  auditPgk001Cp014ReviewBatchV3,
} from "./pgk-001-cp014-review-batch-v3";

describe("PGK-001 CP014 review candidate v3", () => {
  it("passes deterministic review guards", () => {
    const audit = auditPgk001Cp014ReviewBatchV3();
    expect(audit.valid).toBe(true);
    expect(audit.issues).toEqual([]);
  });

  it("contains 42 questions across seven QLs", () => {
    expect(PGK_001_CP014_REVIEW_BATCH_V3).toHaveLength(42);
    expect(new Set(PGK_001_CP014_REVIEW_BATCH_V3.map((question) => question.qlId)).size).toBe(7);
  });

  it("uses direct exam-grade learner wording", () => {
    const learner = PGK_001_CP014_REVIEW_BATCH_V3
      .map((question) => `${question.stem}\n${question.explanation}`)
      .join("\n")
      .toLowerCase();
    for (const banned of [
      "associated with", "linked with", "known for", "closely related to",
      "formed the standard confederacy framework", "standard confederacy framework",
      "school history", "according to", "this question tests", "generator",
    ]) {
      expect(learner).not.toContain(banned);
    }
  });

  it("keeps explanations slightly fuller", () => {
    for (const question of PGK_001_CP014_REVIEW_BATCH_V3) {
      const sentences = question.explanation
        .split(/[.!?]+/)
        .map((part) => part.trim())
        .filter(Boolean);
      expect(sentences.length).toBeGreaterThanOrEqual(2);
      expect(sentences.length).toBeLessThanOrEqual(3);
    }
  });

  it("keeps the disputed twelve-misl reorganisation date out of learner text", () => {
    const learner = PGK_001_CP014_REVIEW_BATCH_V3
      .map((question) => `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`)
      .join("\n")
      .toLowerCase();
    expect(learner).not.toContain("twelve misls were formed in 1748");
    expect(learner).not.toContain("twelve misls were formed in 1758");
  });

  it("uses registered facts and remains review-only", () => {
    const facts = new Set(PGK_001_CP014_FACT_IDS);
    for (const question of PGK_001_CP014_REVIEW_BATCH_V3) {
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      for (const factId of question.factIds) expect(facts.has(factId)).toBe(true);
    }
  });
});
