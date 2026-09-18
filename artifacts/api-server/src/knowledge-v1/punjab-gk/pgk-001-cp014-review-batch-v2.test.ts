import { describe, expect, it } from "vitest";
import { PGK_001_CP014_FACT_IDS } from "./pgk-001-cp014-facts";
import {
  PGK_001_CP014_REVIEW_BATCH_V2,
  auditPgk001Cp014ReviewBatchV2,
} from "./pgk-001-cp014-review-batch-v2";

describe("PGK-001 CP014 review candidate v2", () => {
  it("passes deterministic review guards", () => {
    const audit = auditPgk001Cp014ReviewBatchV2();
    expect(audit.valid).toBe(true);
    expect(audit.issues).toEqual([]);
  });

  it("contains 42 questions across seven QLs", () => {
    expect(PGK_001_CP014_REVIEW_BATCH_V2).toHaveLength(42);
    expect(new Set(PGK_001_CP014_REVIEW_BATCH_V2.map((question) => question.qlId)).size).toBe(7);
  });

  it("keeps the main Dal Khalsa and Misl relations visible", () => {
    const learner = PGK_001_CP014_REVIEW_BATCH_V2
      .map((question) => `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`)
      .join("\n");
    for (const term of [
      "Dal Khalsa", "Nawab Kapur Singh", "Jassa Singh Ahluwalia", "Sarbat Khalsa", "Gurmata",
      "Rakhi", "Ahluwalia Misl", "Ramgarhia Misl", "Sukerchakia Misl", "Kanhaiya Misl", "Bhangi Misl",
    ]) {
      expect(learner).toContain(term);
    }
  });

  it("removes relational filler and provenance from learner text", () => {
    const learner = PGK_001_CP014_REVIEW_BATCH_V2
      .map((question) => `${question.stem}\n${question.explanation}`)
      .join("\n")
      .toLowerCase();
    for (const banned of [
      "associated with", "linked with", "known for", "closely related to", "closely associated",
      "school history", "pseb", "government of punjab", "district amritsar", "district kapurthala",
      "ministry of tourism", "source:", "website",
    ]) {
      expect(learner).not.toContain(banned);
    }
  });

  it("avoids forcing a disputed exact year for twelve-misl reorganisation", () => {
    const relevant = PGK_001_CP014_REVIEW_BATCH_V2.filter((question) =>
      `${question.stem} ${question.explanation}`.toLowerCase().includes("twelve") ||
      `${question.stem} ${question.explanation}`.includes("12"),
    );
    for (const question of relevant) {
      const text = `${question.stem} ${question.explanation}`;
      expect(text).not.toMatch(/twelve.*(1748|1758)|(1748|1758).*twelve/i);
    }
  });

  it("uses only registered fact ids and remains review-only", () => {
    const facts = new Set(PGK_001_CP014_FACT_IDS);
    for (const question of PGK_001_CP014_REVIEW_BATCH_V2) {
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      for (const factId of question.factIds) expect(facts.has(factId)).toBe(true);
    }
  });
});
