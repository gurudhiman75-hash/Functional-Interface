import { describe, expect, it } from "vitest";
import { ECO_CP021_FACTS_V1 } from "./eco-cp021-facts";
import { ECO_CP021_REVIEW_V1 } from "./eco-cp021-review-generator-v1";
import { ECO_CP021_SOURCE_IDS_V1 } from "./eco-cp021-sources";

describe("ECO-CP-021 review batch V1", () => {
  it("contains exactly 44 review-only questions across 12 QLs", () => {
    expect(ECO_CP021_REVIEW_V1).toHaveLength(44);
    expect(new Set(ECO_CP021_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP021_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses valid options and source references", () => {
    const sourceIds = new Set<string>(ECO_CP021_SOURCE_IDS_V1);
    const factIds = new Set(ECO_CP021_FACTS_V1.map((f) => f.id));
    for (const q of ECO_CP021_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      q.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
      q.sourceFactIds.forEach((id) => expect(factIds.has(id)).toBe(true));
    }
  });

  it("enforces exam-grade stems and simple explanations", () => {
    for (const q of ECO_CP021_REVIEW_V1) {
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

  it("uses all difficulty bands and real institutional distinctions", () => {
    const d = new Set(ECO_CP021_REVIEW_V1.map((q) => q.difficulty));
    expect(d.has("Easy")).toBe(true);
    expect(d.has("Medium")).toBe(true);
    expect(d.has("Hard")).toBe(true);
    const hard = ECO_CP021_REVIEW_V1.filter((q) => q.difficulty === "Hard").map((q) => `${q.stem} ${q.canonicalAnswer}`).join("\n");
    expect(hard).toMatch(/IMF.*IBRD|IBRD.*IMF/i);
    expect(hard).toMatch(/IBRD.*IDA|IDA.*IBRD/i);
    expect(hard).toMatch(/WTO.*IMF|IMF.*WTO/i);
    expect(hard).toMatch(/AIIB.*ADB|ADB.*AIIB/i);
  });

  it("blocks volatile current institutional data", () => {
    const banned = [
      /current (IMF|World Bank|WTO|ADB|AIIB|NDB) (head|president|director)/i,
      /current membership count/i,
      /current quota/i,
      /current voting share/i,
      /current lending volume/i,
      /current SDR value/i,
      /current project value/i,
      /latest annual lending/i,
    ];
    for (const q of ECO_CP021_REVIEW_V1) {
      const text = `${q.stem} ${q.options.join(" ")} ${q.explanation}`;
      banned.forEach((pattern) => expect(pattern.test(text)).toBe(false));
    }
  });
});