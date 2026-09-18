import { describe, expect, it } from "vitest";
import { PGK_001_CP009_REVIEW_BATCH_V1, auditPgk001Cp009ReviewBatchV1 } from "./pgk-001-cp009-review-batch-v1";

describe("PGK-001 CP009 review batch V1", () => {
  it("passes deterministic audit", () => {
    const audit = auditPgk001Cp009ReviewBatchV1();
    expect(audit.valid, audit.issues.join("\n")).toBe(true);
    expect(audit.questionCount).toBe(42);
  });

  it("keeps exactly six questions in each of seven QLs", () => {
    const counts = new Map<string, number>();
    for (const question of PGK_001_CP009_REVIEW_BATCH_V1) counts.set(question.qlId, (counts.get(question.qlId) ?? 0) + 1);
    expect(counts.size).toBe(7);
    for (const count of counts.values()) expect(count).toBe(6);
  });

  it("keeps review lifecycle closed", () => {
    for (const question of PGK_001_CP009_REVIEW_BATCH_V1) {
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
    }
  });

  it("uses four unique options with a valid canonical answer", () => {
    for (const question of PGK_001_CP009_REVIEW_BATCH_V1) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
    }
  });

  it("blocks weak relation-filler and source-note language", () => {
    const learner = PGK_001_CP009_REVIEW_BATCH_V1.map((q) => `${q.stem}\n${q.explanation}`).join("\n").toLowerCase();
    for (const term of ["associated with", "linked with", "known for", "closely related to", "official report", "the correct answer is", "the other options", "this question tests"]) {
      expect(learner).not.toContain(term);
    }
  });
});
