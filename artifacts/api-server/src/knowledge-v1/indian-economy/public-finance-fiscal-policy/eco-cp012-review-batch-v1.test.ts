import { describe, expect, it } from "vitest";
import { ECO_CP012_FACTS_V1 } from "./eco-cp012-facts";
import { ECO_CP012_REVIEW_V1 } from "./eco-cp012-review-generator-v1";
import { ECO_CP012_SOURCE_IDS_V1 } from "./eco-cp012-sources";

describe("ECO-CP-012 review batch V1", () => {
  it("contains exactly 44 review-only questions across 12 QLs", () => {
    expect(ECO_CP012_REVIEW_V1).toHaveLength(44);
    expect(new Set(ECO_CP012_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP012_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses valid four-option MCQs", () => {
    for (const q of ECO_CP012_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("resolves source references and avoids duplicate stems", () => {
    const sources = new Set(ECO_CP012_SOURCE_IDS_V1);
    const stems = ECO_CP012_REVIEW_V1.map((q) => q.stem.trim().toLowerCase());
    expect(new Set(stems).size).toBe(stems.length);
    for (const q of ECO_CP012_REVIEW_V1) {
      expect(q.sourceIds.length).toBeGreaterThan(0);
      q.sourceIds.forEach((id) => expect(sources.has(id as never)).toBe(true));
    }
    expect(new Set(ECO_CP012_FACTS_V1.map((f) => f.id)).size).toBe(ECO_CP012_FACTS_V1.length);
  });

  it("includes all difficulty bands with useful explanations", () => {
    const bands = new Set(ECO_CP012_REVIEW_V1.map((q) => q.difficulty));
    expect(bands.has("Easy")).toBe(true);
    expect(bands.has("Medium")).toBe(true);
    expect(bands.has("Hard")).toBe(true);
    for (const q of ECO_CP012_REVIEW_V1) {
      expect(q.explanation.trim().length).toBeGreaterThan(35);
      expect(q.explanation.trim().toLowerCase()).not.toBe(q.canonicalAnswer.trim().toLowerCase());
    }
  });

  it("preserves deficit formulas and classification logic", () => {
    const all = ECO_CP012_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(all).toContain("Fiscal deficit = total expenditure");
    expect(all).toContain("Revenue deficit = revenue expenditure");
    expect(all).toContain("Primary deficit = fiscal deficit");
    expect(all).toContain("borrowing requirement");
    expect(all).toContain("non-debt capital receipt");
  });

  it("blocks volatile current fiscal data", () => {
    const banned = [
      /current fiscal deficit.*%/i,
      /current revenue deficit.*%/i,
      /current primary deficit.*%/i,
      /current public debt.*%/i,
      /budget allocation.*₹/i,
      /current tax slab/i,
      /current FRBM target/i,
      /latest budget estimate/i,
    ];
    for (const q of ECO_CP012_REVIEW_V1) {
      const text = `${q.stem} ${q.options.join(" ")} ${q.explanation}`;
      banned.forEach((pattern) => expect(pattern.test(text)).toBe(false));
    }
  });
});
