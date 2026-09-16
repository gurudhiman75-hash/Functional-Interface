import { describe, expect, it } from "vitest";
import { ECO_CP023_FACTS_V1 } from "./eco-cp023-facts";
import { ECO_CP023_REVIEW_V1 } from "./eco-cp023-review-generator-v1";
import { ECO_CP023_SOURCE_IDS_V1 } from "./eco-cp023-sources";

describe("ECO-CP-023 review batch V1", () => {
  it("contains exactly 44 review-only questions across 12 QLs", () => {
    expect(ECO_CP023_REVIEW_V1).toHaveLength(44);
    expect(new Set(ECO_CP023_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP023_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses valid options and source references", () => {
    const sourceIds = new Set<string>(ECO_CP023_SOURCE_IDS_V1);
    const factIds = new Set(ECO_CP023_FACTS_V1.map((f) => f.id));
    for (const q of ECO_CP023_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      q.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
      q.sourceFactIds.forEach((id) => expect(factIds.has(id)).toBe(true));
    }
  });

  it("enforces exam-grade stems and simple explanations", () => {
    const stems = new Set<string>();
    for (const q of ECO_CP023_REVIEW_V1) {
      const stem = q.stem.trim();
      expect(stem.endsWith("?")).toBe(true);
      expect(stem.endsWith(":" )).toBe(false);
      expect(stem.length).toBeLessThanOrEqual(190);
      expect(stem).not.toMatch(/A question contrasts|review focus|background to this question|in the context of the passage/i);
      expect(stems.has(stem)).toBe(false);
      stems.add(stem);
      const sentences = q.explanation.split(/[.!?]+/).map((x) => x.trim()).filter(Boolean);
      expect(sentences.length).toBeLessThanOrEqual(2);
      expect(q.explanation.length).toBeLessThanOrEqual(280);
    }
  });

  it("uses all difficulty bands and meaningful hard distinctions", () => {
    const bands = new Set(ECO_CP023_REVIEW_V1.map((q) => q.difficulty));
    expect(bands.has("Easy")).toBe(true);
    expect(bands.has("Medium")).toBe(true);
    expect(bands.has("Hard")).toBe(true);
    const hard = ECO_CP023_REVIEW_V1.filter((q) => q.difficulty === "Hard").map((q) => `${q.stem} ${q.canonicalAnswer}`).join("\n");
    expect(hard).toMatch(/sequence|pair|statement/i);
    expect(hard).toMatch(/1988|1992|SEBI/i);
    expect(hard).toMatch(/2003|2004|FRBM/i);
    expect(hard).toMatch(/2016|2017|GST/i);
  });

  it("preserves key milestone chronology", () => {
    const text = ECO_CP023_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(text).toMatch(/1 January 1949/);
    expect(text).toMatch(/1950/);
    expect(text).toMatch(/14.*1969|1969.*14/);
    expect(text).toMatch(/6.*1980|1980.*6/);
    expect(text).toMatch(/1991/);
    expect(text).toMatch(/LERMS.*1992|1992.*LERMS/);
    expect(text).toMatch(/1995/);
    expect(text).toMatch(/FRBM.*2003|2003.*FRBM/);
    expect(text).toMatch(/NITI.*2015|2015.*NITI/);
    expect(text).toMatch(/GST.*2017|2017.*GST/);
  });

  it("blocks volatile current economic data", () => {
    const banned = [
      /current repo rate/i,
      /current GDP growth/i,
      /current inflation/i,
      /current GST rate/i,
      /current GST collection/i,
      /current WTO dispute/i,
      /current FRBM target/i,
      /current NITI (vice[- ]?chair|CEO|member)/i,
      /current bank market share/i,
      /latest economic growth/i,
    ];
    for (const q of ECO_CP023_REVIEW_V1) {
      const text = `${q.stem} ${q.options.join(" ")} ${q.explanation}`;
      banned.forEach((pattern) => expect(pattern.test(text)).toBe(false));
    }
  });
});
