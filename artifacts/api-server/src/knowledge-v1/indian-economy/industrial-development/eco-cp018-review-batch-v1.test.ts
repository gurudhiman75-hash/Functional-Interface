import { describe, expect, it } from "vitest";
import { ECO_CP018_FACTS_V1 } from "./eco-cp018-facts";
import { ECO_CP018_REVIEW_V1 } from "./eco-cp018-review-generator-v1";
import { ECO_CP018_SOURCE_IDS_V1 } from "./eco-cp018-sources";

describe("ECO-CP-018 review batch V1", () => {
  it("contains exactly 44 review-only questions across 12 QLs", () => {
    expect(ECO_CP018_REVIEW_V1).toHaveLength(44);
    expect(new Set(ECO_CP018_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP018_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses four unique options and one canonical answer", () => {
    for (const q of ECO_CP018_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("resolves all sources", () => {
    const sourceIds = new Set<string>(ECO_CP018_SOURCE_IDS_V1);
    expect(new Set(ECO_CP018_FACTS_V1.map((fact) => fact.id)).size).toBe(ECO_CP018_FACTS_V1.length);
    for (const q of ECO_CP018_REVIEW_V1) {
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      q.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
    }
  });

  it("uses exam-grade stems", () => {
    for (const q of ECO_CP018_REVIEW_V1) {
      const stem = q.stem.trim();
      expect(stem.endsWith("?")).toBe(true);
      expect(stem.endsWith(":" )).toBe(false);
      expect(stem.length).toBeLessThanOrEqual(210);
      expect(stem).not.toMatch(/A question contrasts|review focus|which of the following statement is most appropriate in the context/i);
    }
  });

  it("keeps explanations simple", () => {
    for (const q of ECO_CP018_REVIEW_V1) {
      const sentences = q.explanation.split(/[.!?]+/).map((x) => x.trim()).filter(Boolean);
      expect(sentences.length).toBeLessThanOrEqual(2);
      expect(q.explanation.length).toBeLessThanOrEqual(280);
      expect(q.explanation.trim().toLowerCase()).not.toBe(q.canonicalAnswer.trim().toLowerCase());
    }
  });

  it("uses all difficulty bands and meaningful Hard items", () => {
    const difficulties = new Set(ECO_CP018_REVIEW_V1.map((q) => q.difficulty));
    expect(difficulties.has("Easy")).toBe(true);
    expect(difficulties.has("Medium")).toBe(true);
    expect(difficulties.has("Hard")).toBe(true);
    const hard = ECO_CP018_REVIEW_V1.filter((q) => q.difficulty === "Hard");
    expect(hard.length).toBeGreaterThanOrEqual(10);
    const hardText = hard.map((q) => `${q.stem} ${q.canonicalAnswer}`).join("\n");
    expect(hardText).toMatch(/1956.*1991|1991.*1956/i);
    expect(hardText).toMatch(/SEZ.*corridor|corridor.*SEZ/i);
    expect(hardText).toMatch(/capital goods.*intermediate|intermediate.*capital goods/i);
  });

  it("preserves core industry distinctions", () => {
    const all = ECO_CP018_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(all).toContain("Industrial Policy Resolution, 1956");
    expect(all).toContain("Industrial licensing was abolished for most industries");
    expect(all).toContain("MSMED Act, 2006");
    expect(all).toContain("Mining, Manufacturing and Electricity");
    expect(all).toContain("Eight Core Industries");
    expect(all).toContain("Special Economic Zones Act, 2005");
    expect(all).toContain("Make in India");
  });

  it("blocks volatile current industry data", () => {
    const banned = [
      /current IIP (growth|rate|value)/i,
      /current core industr(?:y|ies) (growth|rate|index)/i,
      /current MSME (investment|turnover) threshold/i,
      /current manufacturing (share|growth rate)/i,
      /current FDI cap/i,
      /current SEZ (exports|units|investment)/i,
      /current industrial corridor investment/i,
      /latest Make in India statistics/i,
      /current scheme allocation/i,
    ];
    for (const q of ECO_CP018_REVIEW_V1) {
      const text = `${q.stem} ${q.options.join(" ")} ${q.explanation}`;
      banned.forEach((pattern) => expect(pattern.test(text)).toBe(false));
    }
  });
});
