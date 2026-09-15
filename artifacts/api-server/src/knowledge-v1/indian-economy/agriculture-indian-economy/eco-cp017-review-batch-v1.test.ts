import { describe, expect, it } from "vitest";
import { ECO_CP017_FACTS_V1 } from "./eco-cp017-facts";
import { ECO_CP017_REVIEW_V1 } from "./eco-cp017-review-generator-v1";
import { ECO_CP017_SOURCE_IDS_V1 } from "./eco-cp017-sources";

describe("ECO-CP-017 review batch V1", () => {
  it("contains exactly 44 review-only questions across 12 QLs", () => {
    expect(ECO_CP017_REVIEW_V1).toHaveLength(44);
    expect(new Set(ECO_CP017_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP017_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses four unique options and one canonical answer", () => {
    for (const q of ECO_CP017_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("resolves every source reference", () => {
    const sourceIds = new Set<string>(ECO_CP017_SOURCE_IDS_V1);
    const factIds = new Set(ECO_CP017_FACTS_V1.map((fact) => fact.id));
    expect(factIds.size).toBe(ECO_CP017_FACTS_V1.length);
    for (const q of ECO_CP017_REVIEW_V1) {
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      q.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
    }
  });

  it("enforces exam-grade stems", () => {
    for (const q of ECO_CP017_REVIEW_V1) {
      const stem = q.stem.trim();
      expect(stem.endsWith("?")).toBe(true);
      expect(stem.endsWith(":" )).toBe(false);
      expect(stem.length).toBeLessThanOrEqual(190);
      expect(stem).not.toMatch(/A question contrasts|review focus|which of the following statement is most appropriate in the context/i);
    }
  });

  it("keeps explanations simple", () => {
    for (const q of ECO_CP017_REVIEW_V1) {
      const sentences = q.explanation.split(/[.!?]+/).map((x) => x.trim()).filter(Boolean);
      expect(sentences.length).toBeLessThanOrEqual(2);
      expect(q.explanation.length).toBeLessThanOrEqual(260);
      expect(q.explanation.trim().toLowerCase()).not.toBe(q.canonicalAnswer.trim().toLowerCase());
    }
  });

  it("uses all difficulty bands and meaningful Hard items", () => {
    const difficulties = new Set(ECO_CP017_REVIEW_V1.map((q) => q.difficulty));
    expect(difficulties.has("Easy")).toBe(true);
    expect(difficulties.has("Medium")).toBe(true);
    expect(difficulties.has("Hard")).toBe(true);
    const hard = ECO_CP017_REVIEW_V1.filter((q) => q.difficulty === "Hard");
    expect(hard.length).toBeGreaterThanOrEqual(8);
    expect(hard.some((q) => /MSP.*procurement|procurement.*MSP/i.test(q.stem + q.canonicalAnswer))).toBe(true);
    expect(hard.some((q) => /NABARD.*retail|refinance/i.test(q.stem + q.canonicalAnswer))).toBe(true);
  });

  it("preserves core agriculture-economy distinctions", () => {
    const all = ECO_CP017_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(all).toContain("Green Revolution");
    expect(all).toContain("Commission for Agricultural Costs and Prices");
    expect(all).toContain("Food Corporation of India");
    expect(all).toContain("Public Distribution System");
    expect(all).toContain("NABARD");
    expect(all).toContain("crop insurance");
    expect(all).toContain("e-NAM");
  });

  it("blocks volatile current agriculture values", () => {
    const banned = [
      /current MSP (amount|rate|price)/i,
      /current agricultural (growth|GVA|employment) (rate|share)/i,
      /current (foodgrain|milk|fish|horticulture) production/i,
      /current PMFBY premium/i,
      /current e-NAM (mandi|trade|turnover)/i,
      /current NABARD (refinance|credit) amount/i,
      /current buffer[- ]stock quantity/i,
      /latest procurement quantity/i,
    ];
    for (const q of ECO_CP017_REVIEW_V1) {
      const text = `${q.stem} ${q.options.join(" ")} ${q.explanation}`;
      banned.forEach((pattern) => expect(pattern.test(text)).toBe(false));
    }
  });
});
