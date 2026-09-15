import { describe, expect, it } from "vitest";
import { ECO_CP014_FACTS_V1 } from "./eco-cp014-facts";
import { ECO_CP014_REVIEW_V1 } from "./eco-cp014-review-generator-v1";
import { ECO_CP014_SOURCE_IDS_V1 } from "./eco-cp014-sources";

describe("ECO-CP-014 review batch V1", () => {
  it("contains exactly 44 review-only questions across 12 QLs", () => {
    expect(ECO_CP014_REVIEW_V1).toHaveLength(44);
    expect(new Set(ECO_CP014_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP014_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses four unique options and one canonical answer", () => {
    for (const q of ECO_CP014_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("resolves every source reference and fact id", () => {
    const sourceIds = new Set(ECO_CP014_SOURCE_IDS_V1);
    const factIds = new Set(ECO_CP014_FACTS_V1.map((fact) => fact.id));
    for (const q of ECO_CP014_REVIEW_V1) {
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      q.sourceIds.forEach((id) => expect(sourceIds.has(id as never)).toBe(true));
    }
    expect(factIds.size).toBe(ECO_CP014_FACTS_V1.length);
  });

  it("enforces complete question-style stems", () => {
    for (const q of ECO_CP014_REVIEW_V1) {
      expect(q.stem.trim().endsWith("?")).toBe(true);
      expect(q.stem.trim().endsWith(":" )).toBe(false);
      expect(q.stem.trim().length).toBeGreaterThan(18);
    }
  });

  it("has no duplicate stems and uses all difficulty bands", () => {
    const stems = ECO_CP014_REVIEW_V1.map((q) => q.stem.trim().toLowerCase());
    expect(new Set(stems).size).toBe(stems.length);
    const difficulties = new Set(ECO_CP014_REVIEW_V1.map((q) => q.difficulty));
    expect(difficulties.has("Easy")).toBe(true);
    expect(difficulties.has("Medium")).toBe(true);
    expect(difficulties.has("Hard")).toBe(true);
  });

  it("keeps explanations useful", () => {
    for (const q of ECO_CP014_REVIEW_V1) {
      expect(q.explanation.trim().length).toBeGreaterThan(65);
      expect(q.explanation.trim().toLowerCase()).not.toBe(q.canonicalAnswer.trim().toLowerCase());
    }
  });

  it("preserves the major static taxation distinctions", () => {
    const all = ECO_CP014_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(all).toContain("destination-based");
    expect(all).toContain("Input Tax Credit");
    expect(all).toContain("Article 246A");
    expect(all).toContain("Article 269A");
    expect(all).toContain("Article 279A");
    expect(all).toContain("CGST");
    expect(all).toContain("SGST");
    expect(all).toContain("IGST");
    expect(all).toContain("Customs duty");
  });

  it("blocks volatile current tax data", () => {
    const banned = [
      /current (income[- ]tax|corporate[- ]tax|gst|customs) rate/i,
      /current tax slab/i,
      /current gst slab/i,
      /current exemption/i,
      /current threshold/i,
      /composition.*limit/i,
      /current cess rate/i,
      /latest gst council (decision|recommendation)/i,
      /current filing date/i,
    ];
    for (const q of ECO_CP014_REVIEW_V1) {
      const text = `${q.stem} ${q.options.join(" ")} ${q.explanation}`;
      banned.forEach((pattern) => expect(pattern.test(text)).toBe(false));
    }
  });
});
