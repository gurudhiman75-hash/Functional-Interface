import { describe, expect, it } from "vitest";
import { PGK_001_CP021_REVIEW_BATCH_V1, auditPgk001Cp021ReviewBatchV1 } from "./pgk-001-cp021-review-batch-v1";

describe("PGK-001 CP021 review batch V1", () => {
  it("contains 42 review-only questions", () => {
    expect(PGK_001_CP021_REVIEW_BATCH_V1).toHaveLength(42);
    expect(PGK_001_CP021_REVIEW_BATCH_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("contains six questions for each permanent QL", () => {
    for (let n = 140; n <= 146; n += 1) {
      expect(PGK_001_CP021_REVIEW_BATCH_V1.filter((q) => q.qlId === `PGK-001-QL-${n}`).length).toBe(6);
    }
  });

  it("passes deterministic learner-language audit", () => {
    const audit = auditPgk001Cp021ReviewBatchV1();
    expect(audit.errors).toEqual([]);
    expect(audit.ok).toBe(true);
  });

  it("keeps the official-language relation explicit", () => {
    const corpus = PGK_001_CP021_REVIEW_BATCH_V1.map((q) => `${q.stem} ${q.answer} ${q.explanation}`).join("\n");
    expect(corpus).toContain("Punjab Official Language Act");
    expect(corpus).toContain("1967");
    expect(corpus).toContain("Gurmukhi");
  });

  it("uses careful Guru Angad wording rather than invention claims", () => {
    const corpus = PGK_001_CP021_REVIEW_BATCH_V1.map((q) => `${q.stem} ${q.explanation}`).join("\n").toLowerCase();
    expect(corpus).toContain("guru angad dev");
    expect(corpus).toContain("standardis");
    expect(corpus).not.toContain("invented the gurmukhi");
  });

  it("covers Painti, vowel signs and orthographic signs", () => {
    const corpus = PGK_001_CP021_REVIEW_BATCH_V1.map((q) => `${q.stem} ${q.answer} ${q.explanation}`).join("\n");
    expect(corpus).toContain("35");
    expect(corpus).toContain("ੳ, ਅ, ੲ");
    expect(corpus).toContain("sihari");
    expect(corpus).toContain("addak");
    expect(corpus).toContain("pairin bindi");
  });

  it("covers tone, direction and Gurmukhi numerals", () => {
    const corpus = PGK_001_CP021_REVIEW_BATCH_V1.map((q) => `${q.stem} ${q.answer} ${q.explanation}`).join("\n").toLowerCase();
    expect(corpus).toContain("tonal");
    expect(corpus).toContain("left to right");
    expect(corpus).toContain("੦");
  });
});
