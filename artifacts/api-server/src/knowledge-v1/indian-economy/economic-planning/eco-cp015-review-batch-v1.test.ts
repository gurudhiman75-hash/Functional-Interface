import { describe, expect, it } from "vitest";
import { ECO_CP015_FACTS_V1 } from "./eco-cp015-facts";
import { ECO_CP015_REVIEW_V1 } from "./eco-cp015-review-generator-v1";
import { ECO_CP015_SOURCE_IDS_V1 } from "./eco-cp015-sources";

describe("ECO-CP-015 review batch V1", () => {
  it("contains exactly 44 review-only questions across 12 QLs", () => {
    expect(ECO_CP015_REVIEW_V1).toHaveLength(44);
    expect(new Set(ECO_CP015_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP015_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses four unique options and one canonical answer", () => {
    for (const q of ECO_CP015_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("resolves every source reference", () => {
    const sourceIds = new Set(ECO_CP015_SOURCE_IDS_V1);
    const factIds = new Set(ECO_CP015_FACTS_V1.map((fact) => fact.id));
    for (const q of ECO_CP015_REVIEW_V1) {
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      q.sourceIds.forEach((id) => expect(sourceIds.has(id as never)).toBe(true));
    }
    expect(factIds.size).toBe(ECO_CP015_FACTS_V1.length);
  });

  it("enforces complete exam-question stems", () => {
    for (const q of ECO_CP015_REVIEW_V1) {
      expect(q.stem.trim().endsWith("?")).toBe(true);
      expect(q.stem.trim().endsWith(":" )).toBe(false);
      expect(q.stem.trim().length).toBeGreaterThan(18);
    }
  });

  it("has no duplicate stems and uses all difficulty bands", () => {
    const stems = ECO_CP015_REVIEW_V1.map((q) => q.stem.trim().toLowerCase());
    expect(new Set(stems).size).toBe(stems.length);
    const difficulties = new Set(ECO_CP015_REVIEW_V1.map((q) => q.difficulty));
    expect(difficulties.has("Easy")).toBe(true);
    expect(difficulties.has("Medium")).toBe(true);
    expect(difficulties.has("Hard")).toBe(true);
  });

  it("keeps explanations useful", () => {
    for (const q of ECO_CP015_REVIEW_V1) {
      expect(q.explanation.trim().length).toBeGreaterThan(65);
      expect(q.explanation.trim().toLowerCase()).not.toBe(q.canonicalAnswer.trim().toLowerCase());
    }
  });

  it("preserves core planning chronology and strategy distinctions", () => {
    const all = ECO_CP015_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(all).toContain("15 March 1950");
    expect(all).toContain("1951-56");
    expect(all).toContain("P. C. Mahalanobis");
    expect(all).toContain("1966-69");
    expect(all).toContain("1978-80");
    expect(all).toContain("1990-91");
    expect(all).toContain("faster and more inclusive growth");
    expect(all).toContain("sustainable");
    expect(all).toContain("1 January 2015");
    expect(all).toContain("cooperative federalism");
  });

  it("keeps Hard questions based on distinctions or chronology rather than only single-date recall", () => {
    const hard = ECO_CP015_REVIEW_V1.filter((q) => q.difficulty === "Hard");
    expect(hard.length).toBeGreaterThanOrEqual(12);
    const simpleDateOnly = hard.filter((q) => /^on which date|^during which period/i.test(q.stem.trim()));
    expect(simpleDateOnly).toHaveLength(0);
  });

  it("blocks volatile current NITI and live planning data", () => {
    const banned = [
      /current (vice[- ]chairperson|ceo|member|special invitee)/i,
      /current niti.*(chairperson|composition)/i,
      /latest governing council/i,
      /current niti (scheme|index|ranking)/i,
      /current plan outlay/i,
      /target growth\s*[:=]?\s*\d/i,
      /actual growth\s*[:=]?\s*\d/i,
      /current growth target/i,
    ];
    for (const q of ECO_CP015_REVIEW_V1) {
      const text = `${q.stem} ${q.options.join(" ")} ${q.explanation}`;
      banned.forEach((pattern) => expect(pattern.test(text)).toBe(false));
    }
  });
});
