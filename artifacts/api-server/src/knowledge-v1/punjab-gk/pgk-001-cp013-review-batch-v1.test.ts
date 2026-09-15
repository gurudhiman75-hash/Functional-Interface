import { describe, expect, it } from "vitest";
import { PGK_001_CP013_FACT_IDS, PGK_001_CP013_FACTS } from "./pgk-001-cp013-facts";
import {
  PGK_001_CP013_REVIEW_BATCH_V1,
  auditPgk001Cp013ReviewBatchV1,
} from "./pgk-001-cp013-review-batch-v1";

describe("PGK-001 CP013 review candidate v1", () => {
  it("passes deterministic review guards", () => {
    const audit = auditPgk001Cp013ReviewBatchV1();
    expect(audit.valid).toBe(true);
    expect(audit.issues).toEqual([]);
  });

  it("contains 42 questions across seven QLs", () => {
    expect(PGK_001_CP013_REVIEW_BATCH_V1).toHaveLength(42);
    expect(new Set(PGK_001_CP013_REVIEW_BATCH_V1.map((question) => question.qlId)).size).toBe(7);
  });

  it("preserves the core Banda Singh Bahadur chronology", () => {
    const learner = PGK_001_CP013_REVIEW_BATCH_V1
      .map((question) => `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`)
      .join("\n");
    for (const token of ["Nanded", "1708", "Samana", "1709", "Chappar Chiri", "1710", "Gurdas Nangal", "1715", "1716"]) {
      expect(learner).toContain(token);
    }
  });

  it("keeps core administrative relations explicit in the fact graph", () => {
    expect(PGK_001_CP013_FACTS.lohgarhCapital.capital).toBe("Lohgarh");
    expect(PGK_001_CP013_FACTS.coinage.issuedInNamesOf).toEqual(["Guru Nanak Dev", "Guru Gobind Singh"]);
    expect(PGK_001_CP013_FACTS.agrarianReform.reform.toLowerCase()).toContain("zamindari");
    expect(PGK_001_CP013_FACTS.gurdasNangal1715.commanderWhoCaptured).toBe("Abdus Samad Khan");
    expect(PGK_001_CP013_FACTS.gurdasNangal1715.siegeWeakness.toLowerCase()).toContain("food");
  });

  it("removes relational filler and source labels from learner text", () => {
    const learner = PGK_001_CP013_REVIEW_BATCH_V1
      .map((question) => `${question.stem}\n${question.explanation}`)
      .join("\n")
      .toLowerCase();
    for (const banned of [
      "associated with", "linked with", "closely linked", "closely associated",
      "known for", "closely related to", "pseb", "sgpc", "pib", "source:",
    ]) {
      expect(learner).not.toContain(banned);
    }
  });

  it("uses only registered fact ids and remains review-only", () => {
    const facts = new Set(PGK_001_CP013_FACT_IDS);
    for (const question of PGK_001_CP013_REVIEW_BATCH_V1) {
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      for (const factId of question.factIds) expect(facts.has(factId)).toBe(true);
    }
  });
});
