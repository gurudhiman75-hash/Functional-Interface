import { describe, expect, it } from "vitest";
import { ECO_CP015_FACTS_V1 } from "./eco-cp015-facts";
import { ECO_CP015_REVIEW_V2 } from "./eco-cp015-review-generator-v2";
import { ECO_CP015_SOURCE_IDS_V1 } from "./eco-cp015-sources";

describe("ECO-CP-015 review batch V2", () => {
  it("contains exactly 44 review-only questions across 12 QLs", () => {
    expect(ECO_CP015_REVIEW_V2).toHaveLength(44);
    expect(new Set(ECO_CP015_REVIEW_V2.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP015_REVIEW_V2.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses four unique options and one canonical answer", () => {
    for (const q of ECO_CP015_REVIEW_V2) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("resolves source references", () => {
    const sourceIds = new Set(ECO_CP015_SOURCE_IDS_V1);
    const factIds = new Set(ECO_CP015_FACTS_V1.map((fact) => fact.id));
    expect(factIds.size).toBe(ECO_CP015_FACTS_V1.length);
    for (const q of ECO_CP015_REVIEW_V2) {
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      q.sourceIds.forEach((id) => expect(sourceIds.has(id as never)).toBe(true));
    }
  });

  it("uses short complete exam-style stems", () => {
    const reviewLike = [/^A question /i, /what broad objective/i, /main institutional purpose/i, /best reflects/i];
    for (const q of ECO_CP015_REVIEW_V2) {
      const stem = q.stem.trim();
      expect(stem.endsWith("?")).toBe(true);
      expect(stem.endsWith(":" )).toBe(false);
      expect(stem.length).toBeGreaterThan(18);
      expect(stem.length).toBeLessThanOrEqual(125);
      reviewLike.forEach((pattern) => expect(pattern.test(stem)).toBe(false));
    }
  });

  it("keeps explanations simple and useful", () => {
    for (const q of ECO_CP015_REVIEW_V2) {
      const explanation = q.explanation.trim();
      expect(explanation.length).toBeGreaterThan(35);
      expect(explanation.length).toBeLessThanOrEqual(220);
      expect(explanation.toLowerCase()).not.toBe(q.canonicalAnswer.trim().toLowerCase());
      const sentenceCount = explanation.split(/[.!?]+/).filter((part) => part.trim().length > 0).length;
      expect(sentenceCount).toBeLessThanOrEqual(2);
    }
  });

  it("has no duplicate stems and uses all difficulty bands", () => {
    const stems = ECO_CP015_REVIEW_V2.map((q) => q.stem.trim().toLowerCase());
    expect(new Set(stems).size).toBe(stems.length);
    const difficulties = new Set(ECO_CP015_REVIEW_V2.map((q) => q.difficulty));
    expect(difficulties.has("Easy")).toBe(true);
    expect(difficulties.has("Medium")).toBe(true);
    expect(difficulties.has("Hard")).toBe(true);
  });

  it("preserves key planning distinctions", () => {
    const all = ECO_CP015_REVIEW_V2.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(all).toContain("First Plan");
    expect(all).toContain("Second Plan");
    expect(all).toContain("Plan Holiday");
    expect(all).toContain("Rolling Plan");
    expect(all).toContain("1990-92");
    expect(all).toContain("NITI Aayog");
    expect(all).toContain("indicative planning");
  });

  it("blocks volatile planning data", () => {
    const banned = [
      /current (vice chairperson|ceo|member) of niti/i,
      /latest niti (ranking|index|scheme)/i,
      /current governing council/i,
      /target growth rate/i,
      /actual growth rate/i,
      /plan outlay.*crore/i,
    ];
    for (const q of ECO_CP015_REVIEW_V2) {
      const text = `${q.stem} ${q.options.join(" ")} ${q.explanation}`;
      banned.forEach((pattern) => expect(pattern.test(text)).toBe(false));
    }
  });
});
