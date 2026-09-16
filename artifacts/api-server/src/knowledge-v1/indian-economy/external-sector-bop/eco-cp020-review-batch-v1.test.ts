import { describe, expect, it } from "vitest";
import { ECO_CP020_FACTS_V1 } from "./eco-cp020-facts";
import { ECO_CP020_REVIEW_V1 } from "./eco-cp020-review-generator-v1";
import { ECO_CP020_SOURCE_IDS_V1 } from "./eco-cp020-sources";

describe("ECO-CP-020 review batch V1", () => {
  it("contains exactly 44 review-only questions across 12 QLs", () => {
    expect(ECO_CP020_REVIEW_V1).toHaveLength(44);
    expect(new Set(ECO_CP020_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP020_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses four unique options and valid answers", () => {
    for (const q of ECO_CP020_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("resolves source references", () => {
    const sourceIds = new Set<string>(ECO_CP020_SOURCE_IDS_V1);
    expect(new Set(ECO_CP020_FACTS_V1.map((f) => f.id)).size).toBe(ECO_CP020_FACTS_V1.length);
    for (const q of ECO_CP020_REVIEW_V1) q.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
  });

  it("enforces exam-grade stems and simple explanations", () => {
    for (const q of ECO_CP020_REVIEW_V1) {
      const stem = q.stem.trim();
      expect(stem.endsWith("?")).toBe(true);
      expect(stem.endsWith(":" )).toBe(false);
      expect(stem.length).toBeLessThanOrEqual(220);
      expect(stem).not.toMatch(/A question contrasts|review focus|most appropriate in the context/i);
      const sentences = q.explanation.split(/[.!?]+/).map((x) => x.trim()).filter(Boolean);
      expect(sentences.length).toBeLessThanOrEqual(2);
      expect(q.explanation.length).toBeLessThanOrEqual(280);
    }
  });

  it("uses all difficulty bands and meaningful Hard distinctions", () => {
    const levels = new Set(ECO_CP020_REVIEW_V1.map((q) => q.difficulty));
    expect(levels.has("Easy")).toBe(true);
    expect(levels.has("Medium")).toBe(true);
    expect(levels.has("Hard")).toBe(true);
    const hard = ECO_CP020_REVIEW_V1.filter((q) => q.difficulty === "Hard");
    expect(hard.length).toBeGreaterThanOrEqual(10);
    const text = hard.map((q) => `${q.stem} ${q.canonicalAnswer}`).join("\n");
    expect(text).toMatch(/trade deficit|trade balance/i);
    expect(text).toMatch(/FDI.*FPI|FPI.*FDI/i);
    expect(text).toMatch(/depreciation.*devaluation|devaluation.*depreciation/i);
    expect(text).toMatch(/current-account convertibility|capital-account/i);
  });

  it("blocks volatile external-sector data", () => {
    const banned = [
      /current rupee (rate|exchange rate|value)/i,
      /current forex reserve/i,
      /current (account deficit|trade deficit) (amount|percent|percentage)/i,
      /latest FDI (inflow|amount)/i,
      /latest FPI (inflow|outflow)/i,
      /current export (value|growth)/i,
      /current import (value|growth)/i,
      /forecast.*exchange rate/i,
    ];
    for (const q of ECO_CP020_REVIEW_V1) {
      const text = `${q.stem} ${q.options.join(" ")} ${q.explanation}`;
      banned.forEach((pattern) => expect(pattern.test(text)).toBe(false));
    }
  });
});
