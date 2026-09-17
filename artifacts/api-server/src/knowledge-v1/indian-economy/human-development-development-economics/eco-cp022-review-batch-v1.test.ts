import { describe, expect, it } from "vitest";
import { ECO_CP022_FACT_IDS_V1 } from "./eco-cp022-facts";
import { ECO_CP022_REVIEW_V1 } from "./eco-cp022-review-generator-v1";
import { ECO_CP022_SOURCE_IDS_V1 } from "./eco-cp022-sources";

describe("ECO-CP-022 review batch V1", () => {
  it("contains exactly 44 review-only questions across 12 QLs", () => {
    expect(ECO_CP022_REVIEW_V1).toHaveLength(44);
    expect(new Set(ECO_CP022_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP022_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses four unique options and valid source/fact mappings", () => {
    const sourceIds = new Set<string>(ECO_CP022_SOURCE_IDS_V1);
    const factIds = new Set<string>(ECO_CP022_FACT_IDS_V1);
    for (const q of ECO_CP022_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      q.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
      q.sourceFactIds.forEach((id) => expect(factIds.has(id)).toBe(true));
    }
  });

  it("enforces exam-grade stems and simple explanations", () => {
    for (const q of ECO_CP022_REVIEW_V1) {
      const stem = q.stem.trim();
      expect(stem.endsWith("?")).toBe(true);
      expect(stem.endsWith(":" )).toBe(false);
      expect(stem.length).toBeLessThanOrEqual(205);
      expect(stem).not.toMatch(/A question contrasts|review focus|most appropriate in the context/i);
      const sentences = q.explanation.split(/[.!?]+/).map((x) => x.trim()).filter(Boolean);
      expect(sentences.length).toBeLessThanOrEqual(2);
      expect(q.explanation.length).toBeLessThanOrEqual(280);
    }
  });

  it("uses all difficulty bands and meaningful Hard distinctions", () => {
    const difficulties = new Set(ECO_CP022_REVIEW_V1.map((q) => q.difficulty));
    expect(difficulties.has("Easy")).toBe(true);
    expect(difficulties.has("Medium")).toBe(true);
    expect(difficulties.has("Hard")).toBe(true);
    const hard = ECO_CP022_REVIEW_V1.filter((q) => q.difficulty === "Hard").map((q) => `${q.stem} ${q.canonicalAnswer}`).join("\n");
    expect(hard).toMatch(/growth|income/i);
    expect(hard).toMatch(/Gini|Lorenz/i);
    expect(hard).toMatch(/MPI|multidimensional/i);
    expect(hard).toMatch(/HDI/i);
  });

  it("preserves core development-economics distinctions", () => {
    const all = ECO_CP022_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(all).toContain("Life expectancy at birth");
    expect(all).toContain("GNI per capita");
    expect(all).toContain("geometric mean");
    expect(all).toContain("Gini index");
    expect(all).toContain("Absolute poverty");
    expect(all).toContain("Relative poverty");
    expect(all).toContain("Multidimensional Poverty Index");
  });

  it("blocks volatile current development data", () => {
    const banned = [
      /current HDI (rank|ranking|score|value)/i,
      /current MPI (rank|ranking|score|value)/i,
      /current Gini (value|score)/i,
      /current poverty (rate|headcount|line)/i,
      /current GNI per capita/i,
      /current life expectancy/i,
      /current schooling (value|years)/i,
      /latest HDI ranking/i,
    ];
    for (const q of ECO_CP022_REVIEW_V1) {
      const text = `${q.stem} ${q.options.join(" ")} ${q.explanation}`;
      banned.forEach((pattern) => expect(pattern.test(text)).toBe(false));
    }
  });
});
