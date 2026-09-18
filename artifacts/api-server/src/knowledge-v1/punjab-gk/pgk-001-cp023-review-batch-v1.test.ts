import { describe, expect, it } from "vitest";
import { PGK_001_CP023_REVIEW_BATCH_V1, auditPgk001Cp023ReviewBatchV1 } from "./pgk-001-cp023-review-batch-v1";
import { PGK_001_CP023_FACTS } from "./pgk-001-cp023-facts";

describe("PGK-001 CP023 review batch V1", () => {
  it("contains exactly 42 review-only questions across seven QLs", () => {
    expect(PGK_001_CP023_REVIEW_BATCH_V1).toHaveLength(42);
    expect(new Set(PGK_001_CP023_REVIEW_BATCH_V1.map((q) => q.qlId)).size).toBe(7);
    expect(PGK_001_CP023_REVIEW_BATCH_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("passes learner-language and structural audit", () => {
    const audit = auditPgk001Cp023ReviewBatchV1();
    expect(audit.errors).toEqual([]);
    expect(audit.ok).toBe(true);
  });

  it("keeps the core dance relations visible", () => {
    const all = JSON.stringify(PGK_001_CP023_REVIEW_BATCH_V1);
    expect(all).toContain("Bhangra");
    expect(all).toContain("Giddha");
    expect(all).toContain("Jhumar");
    expect(all).toContain("Sammi");
    expect(all).toContain("Luddi");
    expect(all).toContain("Kikli");
    expect(all).toContain("Boliyan");
  });

  it("keeps major folk instruments explicit in the fact graph", () => {
    const facts = JSON.stringify(PGK_001_CP023_FACTS);
    for (const item of ["Dhol", "Algoza", "Tumbi", "Chimta", "Sarangi", "Ghara"]) {
      expect(facts).toContain(item);
    }
  });

  it("keeps craft and dress facts distinct from dance and music", () => {
    const facts = JSON.stringify(PGK_001_CP023_FACTS);
    expect(facts).toContain("Phulkari");
    expect(facts).toContain("Punjabi jutti");
    expect(facts).toContain("Punjabi kurta and tehmat");
    expect(facts).toContain("Punjabi salwar suit");
  });
});
