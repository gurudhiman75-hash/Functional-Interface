import { describe, expect, it } from "vitest";
import { ECO_CP016_FACTS_V1 } from "./eco-cp016-facts";
import { ECO_CP016_REVIEW_V1 } from "./eco-cp016-review-generator-v1";
import { ECO_CP016_SOURCE_IDS_V1 } from "./eco-cp016-sources";

describe("ECO-CP-016 review batch V1", () => {
  it("contains exactly 44 review-only questions across 12 QLs", () => {
    expect(ECO_CP016_REVIEW_V1).toHaveLength(44);
    expect(new Set(ECO_CP016_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP016_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses four unique options and one canonical answer", () => {
    for (const q of ECO_CP016_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("resolves source references", () => {
    const sourceIds = new Set<string>(ECO_CP016_SOURCE_IDS_V1);
    for (const q of ECO_CP016_REVIEW_V1) {
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      q.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
    }
    expect(new Set(ECO_CP016_FACTS_V1.map((fact) => fact.id)).size).toBe(ECO_CP016_FACTS_V1.length);
  });

  it("enforces exam-grade stems", () => {
    for (const q of ECO_CP016_REVIEW_V1) {
      const stem = q.stem.trim();
      expect(stem.endsWith("?")).toBe(true);
      expect(stem.endsWith(":")).toBe(false);
      expect(stem.length).toBeLessThanOrEqual(175);
      expect(/A question (contrasts|asks|describes)/i.test(stem)).toBe(false);
      expect(/Which of the following statement best explains the following/i.test(stem)).toBe(false);
    }
  });

  it("keeps explanations simple and useful", () => {
    for (const q of ECO_CP016_REVIEW_V1) {
      expect(q.explanation.trim().length).toBeGreaterThan(35);
      expect(q.explanation.trim().length).toBeLessThanOrEqual(260);
      expect(q.explanation.trim().toLowerCase()).not.toBe(q.canonicalAnswer.trim().toLowerCase());
    }
  });

  it("has no duplicate stems and uses all difficulty bands", () => {
    const stems = ECO_CP016_REVIEW_V1.map((q) => q.stem.trim().toLowerCase());
    expect(new Set(stems).size).toBe(stems.length);
    const difficulty = new Set(ECO_CP016_REVIEW_V1.map((q) => q.difficulty));
    expect(difficulty.has("Easy")).toBe(true);
    expect(difficulty.has("Medium")).toBe(true);
    expect(difficulty.has("Hard")).toBe(true);
  });

  it("preserves core reform distinctions", () => {
    const all = ECO_CP016_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(all).toContain("Balance-of-payments crisis");
    expect(all).toContain("Liberalisation, Privatisation and Globalisation");
    expect(all).toContain("industrial licensing");
    expect(all).toContain("Disinvestment");
    expect(all).toContain("LERMS");
    expect(all).toContain("Narasimham Committee");
    expect(all).toContain("current-account convertibility");
  });

  it("blocks volatile current policy values", () => {
    const banned = [
      /current fdi (cap|limit)/i,
      /current customs rate/i,
      /current tariff rate/i,
      /current disinvestment (target|receipt)/i,
      /current exchange rate/i,
      /current forex reserves/i,
      /current privatisation pipeline/i,
      /current (crr|slr) rate/i,
      /latest fdi policy/i,
    ];
    for (const q of ECO_CP016_REVIEW_V1) {
      const text = `${q.stem} ${q.options.join(" ")} ${q.explanation}`;
      banned.forEach((pattern) => expect(pattern.test(text)).toBe(false));
    }
  });
});
