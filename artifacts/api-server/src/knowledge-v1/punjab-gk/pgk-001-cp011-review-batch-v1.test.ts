import { describe, expect, it } from "vitest";
import { PGK_001_CP011_REVIEW_BATCH_V1, PGK_001_CP011_QL_NAMES, auditPgk001Cp011ReviewBatchV1 } from "./pgk-001-cp011-review-batch-v1";

describe("PGK-001 CP011 medieval Punjab review batch V1", () => {
  it("contains 42 review-only questions across seven QLs", () => {
    expect(PGK_001_CP011_REVIEW_BATCH_V1).toHaveLength(42);
    expect(Object.keys(PGK_001_CP011_QL_NAMES)).toHaveLength(7);
    const counts = new Map<string, number>();
    for (const q of PGK_001_CP011_REVIEW_BATCH_V1) counts.set(q.qlId, (counts.get(q.qlId) ?? 0) + 1);
    for (const qlId of Object.keys(PGK_001_CP011_QL_NAMES)) expect(counts.get(qlId)).toBe(6);
    expect(PGK_001_CP011_REVIEW_BATCH_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("passes the deterministic batch audit", () => {
    const audit = auditPgk001Cp011ReviewBatchV1();
    expect(audit.valid, audit.issues.join("\n")).toBe(true);
    expect(audit.questionCount).toBe(42);
  });

  it("keeps medieval geography and chronology explicit", () => {
    const corpus = PGK_001_CP011_REVIEW_BATCH_V1.map((q) => `${q.stem} ${q.explanation}`).join(" ");
    expect(corpus).toContain("1186");
    expect(corpus).toContain("1241");
    expect(corpus).toContain("1526");
    expect(corpus).toContain("1584");
    expect(corpus).toContain("present-day Pakistan");
  });

  it("covers all major CP011 relation families", () => {
    const corpus = PGK_001_CP011_REVIEW_BATCH_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join(" ");
    for (const required of ["Muhammad Ghori", "Qutb-ud-din Aibak", "Mongol", "Daulat Khan Lodi", "Babur", "Akbar", "Badshahi Mosque", "Ibn Battuta", "Ain-i-Akbari"]) {
      expect(corpus).toContain(required);
    }
  });

  it("does not leak weak generator wording or source labels", () => {
    const corpus = PGK_001_CP011_REVIEW_BATCH_V1.map((q) => `${q.stem}\n${q.explanation}`).join("\n").toLowerCase();
    for (const banned of ["associated with", "linked with", "known for", "government of punjab", "pseb", "ignca", "the correct answer is", "this question tests", "generator"]) {
      expect(corpus).not.toContain(banned);
    }
  });
});
