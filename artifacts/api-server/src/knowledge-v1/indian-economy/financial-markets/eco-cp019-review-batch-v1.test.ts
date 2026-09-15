import { describe, expect, it } from "vitest";
import { ECO_CP019_FACTS_V1 } from "./eco-cp019-facts";
import { ECO_CP019_REVIEW_V1 } from "./eco-cp019-review-generator-v1";
import { ECO_CP019_SOURCE_IDS_V1 } from "./eco-cp019-sources";

describe("ECO-CP-019 review batch V1", () => {
  it("contains exactly 44 review-only questions across 12 QLs", () => {
    expect(ECO_CP019_REVIEW_V1).toHaveLength(44);
    expect(new Set(ECO_CP019_REVIEW_V1.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP019_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses four unique options and one canonical answer", () => {
    for (const q of ECO_CP019_REVIEW_V1) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("resolves every source reference", () => {
    const sourceIds = new Set<string>(ECO_CP019_SOURCE_IDS_V1);
    const factIds = new Set(ECO_CP019_FACTS_V1.map((fact) => fact.id));
    expect(factIds.size).toBe(ECO_CP019_FACTS_V1.length);
    for (const q of ECO_CP019_REVIEW_V1) {
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      q.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
    }
  });

  it("enforces exam-grade stems", () => {
    for (const q of ECO_CP019_REVIEW_V1) {
      const stem = q.stem.trim();
      expect(stem.endsWith("?")).toBe(true);
      expect(stem.endsWith(":" )).toBe(false);
      expect(stem.length).toBeLessThanOrEqual(210);
      expect(stem).not.toMatch(/A question contrasts|review focus|which of the following statement is most appropriate in the context/i);
    }
  });

  it("keeps explanations simple", () => {
    for (const q of ECO_CP019_REVIEW_V1) {
      const sentences = q.explanation.split(/[.!?]+/).map((x) => x.trim()).filter(Boolean);
      expect(sentences.length).toBeLessThanOrEqual(2);
      expect(q.explanation.length).toBeLessThanOrEqual(280);
      expect(q.explanation.trim().toLowerCase()).not.toBe(q.canonicalAnswer.trim().toLowerCase());
    }
  });

  it("uses all difficulty bands and meaningful Hard distinctions", () => {
    const difficulties = new Set(ECO_CP019_REVIEW_V1.map((q) => q.difficulty));
    expect(difficulties.has("Easy")).toBe(true);
    expect(difficulties.has("Medium")).toBe(true);
    expect(difficulties.has("Hard")).toBe(true);
    const hard = ECO_CP019_REVIEW_V1.filter((q) => q.difficulty === "Hard");
    expect(hard.length).toBeGreaterThanOrEqual(10);
    const hardText = hard.map((q) => `${q.stem} ${q.canonicalAnswer}`).join("\n");
    expect(hardText).toMatch(/primary.*secondary|secondary.*primary/i);
    expect(hardText).toMatch(/repo.*call|call.*repo/i);
    expect(hardText).toMatch(/Commercial Paper.*Certificate of Deposit|Certificate of Deposit.*Commercial Paper/i);
  });

  it("preserves core financial-market distinctions", () => {
    const all = ECO_CP019_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(all).toContain("SEBI");
    expect(all).toContain("Primary market");
    expect(all).toContain("Secondary market");
    expect(all).toContain("Treasury Bill");
    expect(all).toMatch(/Treasury Bill.*dated Government security|dated Government security.*Treasury Bill/i);
    expect(all).toContain("Commercial Paper");
    expect(all).toContain("Certificate of Deposit");
    expect(all).toContain("mutual fund");
    expect(all).toContain("demat");
    expect(all).toContain("repo");
  });

  it("blocks volatile live market values", () => {
    const banned = [
      /current (Sensex|Nifty|index) (level|value)/i,
      /current (bond|g-sec|treasury bill) yield/i,
      /current repo rate/i,
      /current mutual[- ]fund NAV/i,
      /current mutual[- ]fund return/i,
      /current market cap/i,
      /latest IPO proceeds/i,
      /current CP outstanding/i,
      /current CD outstanding/i,
      /current auction cut[- ]off/i,
      /current issue[- ]size threshold/i,
    ];
    for (const q of ECO_CP019_REVIEW_V1) {
      const text = `${q.stem} ${q.options.join(" ")} ${q.explanation}`;
      banned.forEach((pattern) => expect(pattern.test(text)).toBe(false));
    }
  });
});
