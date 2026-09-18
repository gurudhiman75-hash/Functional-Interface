import { describe, expect, it } from "vitest";
import { PGK_001_CP024_REVIEW_BATCH_V1, auditPgk001Cp024ReviewBatchV1 } from "./pgk-001-cp024-review-batch-v1";
import { PGK_001_CP024_FACTS } from "./pgk-001-cp024-facts";

describe("PGK-001 CP024 review batch V1", () => {
  it("contains exactly 42 review-only questions across seven QLs", () => {
    expect(PGK_001_CP024_REVIEW_BATCH_V1).toHaveLength(42);
    expect(new Set(PGK_001_CP024_REVIEW_BATCH_V1.map((q) => q.qlId)).size).toBe(7);
    expect(PGK_001_CP024_REVIEW_BATCH_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("passes learner-language and structural audit", () => {
    const audit = auditPgk001Cp024ReviewBatchV1();
    expect(audit.errors).toEqual([]);
    expect(audit.ok).toBe(true);
  });

  it("keeps the three core fair-place relations visible", () => {
    const all = JSON.stringify(PGK_001_CP024_REVIEW_BATCH_V1);
    expect(all).toContain("Hola Mohalla");
    expect(all).toContain("Sri Muktsar Sahib");
    expect(all).toContain("Shaheedi Jor Mela");
    expect(all).toContain("Fatehgarh Sahib");
  });

  it("keeps major heritage centres explicit", () => {
    const all = JSON.stringify(PGK_001_CP024_REVIEW_BATCH_V1);
    for (const item of ["Harmandir Sahib", "Gobindgarh Fort", "Qila Mubarak", "Sheesh Mahal", "Virasat-e-Khalsa", "Keshgarh Sahib"]) {
      expect(all).toContain(item);
    }
  });

  it("keeps all registered facts in the source graph", () => {
    expect(PGK_001_CP024_FACTS.length).toBeGreaterThanOrEqual(20);
    const ids = new Set(PGK_001_CP024_FACTS.map((f) => f.id));
    expect(ids.size).toBe(PGK_001_CP024_FACTS.length);
  });
});
