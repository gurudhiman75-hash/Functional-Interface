import { describe, expect, it } from "vitest";
import { ECO_CP010_FACTS_V1 } from "./eco-cp010-facts";
import { ECO_CP010_REVIEW_V1 } from "./eco-cp010-review-generator-v1";
import { ECO_CP010_SOURCE_IDS_V1 } from "./eco-cp010-sources";

describe("ECO-CP-010 review candidate V1", () => {
  it("generates the planned 44 questions across 12 QLs", () => {
    expect(ECO_CP010_REVIEW_V1).toHaveLength(44);
    expect(new Set(ECO_CP010_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
  });

  it("keeps every item review-only and outside runtime", () => {
    for (const q of ECO_CP010_REVIEW_V1) {
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
    }
  });

  it("has valid options and exactly one canonical answer", () => {
    for (const q of ECO_CP010_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      expect(q.options.filter((option) => option === q.canonicalAnswer)).toHaveLength(1);
    }
  });

  it("resolves source ids to the CP source registry", () => {
    const sourceIds = new Set(ECO_CP010_SOURCE_IDS_V1);
    for (const q of ECO_CP010_REVIEW_V1) {
      expect(q.sourceIds.length).toBeGreaterThan(0);
      for (const id of q.sourceIds) expect(sourceIds.has(id as never)).toBe(true);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
    }
  });

  it("contains all difficulty bands with Hard reserved for actual distinctions", () => {
    const difficulties = new Set(ECO_CP010_REVIEW_V1.map((q) => q.difficulty));
    expect(difficulties).toEqual(new Set(["Easy", "Medium", "Hard"]));

    const hard = ECO_CP010_REVIEW_V1.filter((q) => q.difficulty === "Hard");
    expect(hard.length).toBeGreaterThanOrEqual(5);
    expect(hard.some((q) => q.stem.includes("Small Finance Banks") || q.stem.includes("deposit expansion") || q.stem.includes("collateral") || q.stem.includes("cooperative"))).toBe(true);
  });

  it("preserves critical banking distinctions", () => {
    const all = ECO_CP010_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(all).toContain("Second Schedule");
    expect(all).toContain("Payments Banks");
    expect(all).toContain("cannot undertake lending");
    expect(all).toContain("Primary Agricultural Credit Society");
    expect(all).toContain("State Cooperative Bank");
    expect(all).toContain("more than 90 days");
    expect(all).toContain("DICGC");
  });

  it("keeps DICGC coverage conceptual instead of freezing the current rupee limit", () => {
    const dicgcText = ECO_CP010_REVIEW_V1
      .filter((q) => q.qlId === "ECO-CP-010-QL-11")
      .map((q) => `${q.stem} ${q.explanation} ${q.options.join(" ")}`)
      .join(" ");
    expect(dicgcText).not.toMatch(/₹\s*5|5,00,000|five lakh/i);
    expect(dicgcText).toContain("same right and same capacity");
  });

  it("blocks volatile/current banking data and CP011 leakage", () => {
    const text = ECO_CP010_REVIEW_V1.map((q) => `${q.stem} ${q.explanation} ${q.options.join(" ")}`).join("\n");
    expect(text).not.toMatch(/current number of banks|latest merger|current interest rate|current NPA ratio|current PSL target|current insurance limit/i);
    expect(text).not.toMatch(/SIDBI|EXIM Bank|NHB|NaBFID/);
  });

  it("keeps explanations useful rather than answer-only", () => {
    for (const q of ECO_CP010_REVIEW_V1) {
      expect(q.explanation.length).toBeGreaterThan(45);
      expect(q.explanation.trim()).not.toBe(q.canonicalAnswer.trim());
      expect(q.explanation).not.toMatch(/^The correct answer is/i);
    }
  });

  it("keeps canonical facts source-backed", () => {
    for (const fact of ECO_CP010_FACTS_V1) {
      expect(fact.sourceIds.length).toBeGreaterThan(0);
      expect(fact.sourceFactIds.length).toBeGreaterThan(0);
      expect(fact.explanation.length).toBeGreaterThan(30);
    }
  });
});
