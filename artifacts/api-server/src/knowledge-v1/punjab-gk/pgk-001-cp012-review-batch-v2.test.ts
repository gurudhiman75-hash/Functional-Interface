import { describe, expect, it } from "vitest";
import { PGK_001_CP012_FACT_IDS } from "./pgk-001-cp012-facts";
import {
  PGK_001_CP012_REVIEW_BATCH_V2,
  auditPgk001Cp012ReviewBatchV2,
} from "./pgk-001-cp012-review-batch-v2";

describe("PGK-001 CP012 review candidate v2", () => {
  it("passes deterministic review guards", () => {
    const audit = auditPgk001Cp012ReviewBatchV2();
    expect(audit.valid).toBe(true);
    expect(audit.issues).toEqual([]);
  });

  it("contains 42 questions across seven QLs", () => {
    expect(PGK_001_CP012_REVIEW_BATCH_V2).toHaveLength(42);
    expect(new Set(PGK_001_CP012_REVIEW_BATCH_V2.map((question) => question.qlId)).size).toBe(7);
  });

  it("keeps the full ten-Guru sequence visible in learner content", () => {
    const learner = PGK_001_CP012_REVIEW_BATCH_V2
      .map((question) => `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`)
      .join("\n");
    for (const guru of [
      "Guru Nanak Dev", "Guru Angad Dev", "Guru Amar Das", "Guru Ram Das", "Guru Arjan Dev",
      "Guru Hargobind", "Guru Har Rai", "Guru Har Krishan", "Guru Tegh Bahadur", "Guru Gobind Singh",
    ]) {
      expect(learner).toContain(guru);
    }
  });

  it("removes relational filler from learner text", () => {
    const learner = PGK_001_CP012_REVIEW_BATCH_V2
      .map((question) => `${question.stem}\n${question.explanation}`)
      .join("\n")
      .toLowerCase();
    for (const banned of [
      "associated with", "linked with", "linked historically with", "closely linked",
      "closely associated", "known for", "closely related to",
    ]) {
      expect(learner).not.toContain(banned);
    }
  });

  it("keeps learner-facing source names out", () => {
    const learner = PGK_001_CP012_REVIEW_BATCH_V2
      .map((question) => `${question.stem}\n${question.explanation}`)
      .join("\n")
      .toLowerCase();
    expect(learner).not.toContain("sgpc");
    expect(learner).not.toContain("pseb");
    expect(learner).not.toContain("source:");
  });

  it("uses only registered fact ids and remains review-only", () => {
    const facts = new Set(PGK_001_CP012_FACT_IDS);
    for (const question of PGK_001_CP012_REVIEW_BATCH_V2) {
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      for (const factId of question.factIds) expect(facts.has(factId)).toBe(true);
    }
  });
});
