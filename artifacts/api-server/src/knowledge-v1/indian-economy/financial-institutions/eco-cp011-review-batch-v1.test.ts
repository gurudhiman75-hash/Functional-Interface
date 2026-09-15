import { describe, expect, it } from "vitest";
import { ECO_CP011_FACTS_V1 } from "./eco-cp011-facts";
import { ECO_CP011_REVIEW_V1 } from "./eco-cp011-review-generator-v1";
import { ECO_CP011_SOURCE_IDS_V1 } from "./eco-cp011-sources";

describe("ECO-CP-011 review batch V1", () => {
  it("contains exactly 44 review-only questions across 12 QLs", () => {
    expect(ECO_CP011_REVIEW_V1).toHaveLength(44);
    expect(new Set(ECO_CP011_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP011_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses valid four-option MCQs with exactly one canonical answer", () => {
    for (const q of ECO_CP011_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("resolves every source and keeps a unique canonical fact registry", () => {
    const sourceIds = new Set<string>(ECO_CP011_SOURCE_IDS_V1);
    const factIds = new Set(ECO_CP011_FACTS_V1.map((fact) => fact.id));
    for (const q of ECO_CP011_REVIEW_V1) {
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      q.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
    }
    expect(factIds.size).toBe(ECO_CP011_FACTS_V1.length);
  });

  it("has no duplicate stems and includes all difficulty bands", () => {
    const stems = ECO_CP011_REVIEW_V1.map((q) => q.stem.trim().toLowerCase());
    expect(new Set(stems).size).toBe(stems.length);
    const difficulties = new Set(ECO_CP011_REVIEW_V1.map((q) => q.difficulty));
    expect(difficulties.has("Easy")).toBe(true);
    expect(difficulties.has("Medium")).toBe(true);
    expect(difficulties.has("Hard")).toBe(true);
  });

  it("keeps explanations useful rather than answer repetition", () => {
    for (const q of ECO_CP011_REVIEW_V1) {
      expect(q.explanation.trim().length).toBeGreaterThan(35);
      expect(q.explanation.trim().toLowerCase()).not.toBe(q.canonicalAnswer.trim().toLowerCase());
    }
  });

  it("enforces stable institutional distinctions", () => {
    const all = ECO_CP011_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(all).toContain("HFC regulatory powers were transferred from NHB to RBI");
    expect(all).toContain("IFCI was established on 1 July 1948 as India's first DFI");
    expect(all).toContain("NaBFID");
    expect(all).toContain("MSME");
    expect(all).toContain("international trade");
  });

  it("blocks volatile current-data leakage", () => {
    const banned = [
      /current (chairman|chairperson|managing director|md|head)/i,
      /latest (sanction|disbursement|profit|market share|ranking)/i,
      /authorised capital.*₹/i,
      /paid-up capital.*₹/i,
      /current asset-size threshold/i,
      /current scheme allocation/i,
      /current beneficiary/i,
    ];
    for (const q of ECO_CP011_REVIEW_V1) {
      const text = `${q.stem} ${q.options.join(" ")} ${q.explanation}`;
      banned.forEach((pattern) => expect(pattern.test(text)).toBe(false));
    }
  });
});
