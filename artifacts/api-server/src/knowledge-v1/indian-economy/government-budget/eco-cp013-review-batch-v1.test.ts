import { describe, expect, it } from "vitest";
import { ECO_CP013_FACTS_V1 } from "./eco-cp013-facts";
import { ECO_CP013_REVIEW_V1 } from "./eco-cp013-review-generator-v1";
import { ECO_CP013_SOURCE_IDS_V1 } from "./eco-cp013-sources";

describe("ECO-CP-013 review batch V1", () => {
  it("contains exactly 44 review-only questions across 12 QLs", () => {
    expect(ECO_CP013_REVIEW_V1).toHaveLength(44);
    expect(new Set(ECO_CP013_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP013_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses valid four-option MCQs with one canonical answer", () => {
    for (const q of ECO_CP013_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("uses complete exam-style question stems", () => {
    for (const q of ECO_CP013_REVIEW_V1) {
      expect(q.stem.trim().endsWith("?")).toBe(true);
      expect(q.stem.trim().endsWith(":")).toBe(false);
      expect(q.stem.trim().length).toBeGreaterThan(12);
    }
  });

  it("resolves every source and fact reference", () => {
    const sourceIds = new Set(ECO_CP013_SOURCE_IDS_V1);
    const factIds = new Set(ECO_CP013_FACTS_V1.map((fact) => fact.id));
    for (const q of ECO_CP013_REVIEW_V1) {
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      q.sourceIds.forEach((id) => expect(sourceIds.has(id as never)).toBe(true));
    }
    expect(factIds.size).toBe(ECO_CP013_FACTS_V1.length);
  });

  it("has no duplicate stems and represents all difficulty bands", () => {
    const stems = ECO_CP013_REVIEW_V1.map((q) => q.stem.trim().toLowerCase());
    expect(new Set(stems).size).toBe(stems.length);
    const difficulties = new Set(ECO_CP013_REVIEW_V1.map((q) => q.difficulty));
    expect(difficulties.has("Easy")).toBe(true);
    expect(difficulties.has("Medium")).toBe(true);
    expect(difficulties.has("Hard")).toBe(true);
  });

  it("keeps explanations useful rather than answer repetition", () => {
    for (const q of ECO_CP013_REVIEW_V1) {
      expect(q.explanation.trim().length).toBeGreaterThan(35);
      expect(q.explanation.trim().toLowerCase()).not.toBe(q.canonicalAnswer.trim().toLowerCase());
    }
  });

  it("preserves core constitutional distinctions", () => {
    const all = ECO_CP013_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(all).toContain("Article 112");
    expect(all).toContain("Article 113");
    expect(all).toContain("Article 114");
    expect(all).toContain("Article 115");
    expect(all).toContain("Article 116");
    expect(all).toContain("Consolidated Fund of India");
    expect(all).toContain("Public Account of India");
  });

  it("blocks volatile current-Budget leakage", () => {
    const banned = [
      /budget 2026-27 allocation/i,
      /current (allocation|outlay|tax rate|tax slab|deficit ratio|debt ratio)/i,
      /current number of demands/i,
      /contingency fund.*30,?000 crore/i,
      /latest budget estimate/i,
      /current finance bill proposal/i,
    ];
    for (const q of ECO_CP013_REVIEW_V1) {
      const text = `${q.stem} ${q.options.join(" ")} ${q.explanation}`;
      banned.forEach((pattern) => expect(pattern.test(text)).toBe(false));
    }
  });
});
