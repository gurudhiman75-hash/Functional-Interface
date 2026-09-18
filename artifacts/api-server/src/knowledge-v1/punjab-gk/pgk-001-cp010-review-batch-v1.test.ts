import { describe, expect, it } from "vitest";
import { PGK_001_CP010_REVIEW_BATCH_V1, PGK_001_CP010_QL_NAMES, auditPgk001Cp010ReviewBatchV1 } from "./pgk-001-cp010-review-batch-v1";

describe("PGK-001 CP010 review batch V1", () => {
  it("passes deterministic audit", () => {
    const audit = auditPgk001Cp010ReviewBatchV1();
    expect(audit.valid, audit.issues.join("\n")).toBe(true);
    expect(audit.questionCount).toBe(42);
  });

  it("contains seven QLs with six questions each", () => {
    expect(Object.keys(PGK_001_CP010_QL_NAMES)).toHaveLength(7);
    for (const qlId of Object.keys(PGK_001_CP010_QL_NAMES)) {
      expect(PGK_001_CP010_REVIEW_BATCH_V1.filter((q) => q.qlId === qlId)).toHaveLength(6);
    }
  });

  it("keeps the batch review-only", () => {
    for (const q of PGK_001_CP010_REVIEW_BATCH_V1) {
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
    }
  });

  it("keeps learner wording exam-grade and source-free", () => {
    const text = PGK_001_CP010_REVIEW_BATCH_V1.map((q) => `${q.stem}\n${q.explanation}`).join("\n").toLowerCase();
    for (const banned of ["government of punjab", "pseb", "archaeological survey of india", "britannica", "associated with", "linked with", "known for", "the correct answer is", "this question tests", "generator"]) {
      expect(text).not.toContain(banned);
    }
  });

  it("contains the required ancient-Punjab anchors", () => {
    const text = PGK_001_CP010_REVIEW_BATCH_V1.map((q) => `${q.stem} ${q.canonicalAnswer}`).join(" ");
    for (const anchor of ["Rupnagar", "Sanghol", "Sapta Sindhu", "Pentapotamia", "Taxila", "326 BCE", "Hydaspes", "Beas", "Chandragupta Maurya", "Kautilya", "Kanishka", "Mathura school"]) {
      expect(text).toContain(anchor);
    }
  });
});
