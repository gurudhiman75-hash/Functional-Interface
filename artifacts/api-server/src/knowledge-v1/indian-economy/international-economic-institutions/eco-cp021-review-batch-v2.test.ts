import { describe, expect, it } from "vitest";
import { ECO_CP021_REVIEW_V1 } from "./eco-cp021-review-generator-v1";
import { ECO_CP021_REVIEW_V2 } from "./eco-cp021-review-generator-v2";

describe("ECO-CP-021 review batch V2", () => {
  it("preserves the 44-question structure", () => {
    expect(ECO_CP021_REVIEW_V2).toHaveLength(44);
    expect(new Set(ECO_CP021_REVIEW_V2.map((q) => q.qlId)).size).toBe(12);
  });

  it("changes only stems from V1", () => {
    for (let i = 0; i < ECO_CP021_REVIEW_V2.length; i += 1) {
      const v1 = ECO_CP021_REVIEW_V1[i];
      const v2 = ECO_CP021_REVIEW_V2[i];
      expect(v2.questionId).toBe(v1.questionId);
      expect(v2.options).toEqual(v1.options);
      expect(v2.correctIndex).toBe(v1.correctIndex);
      expect(v2.canonicalAnswer).toBe(v1.canonicalAnswer);
      expect(v2.explanation).toBe(v1.explanation);
      expect(v2.sourceIds).toEqual(v1.sourceIds);
      expect(v2.sourceFactIds).toEqual(v1.sourceFactIds);
      expect(v2.difficulty).toBe(v1.difficulty);
    }
  });

  it("uses concise exam-grade stems", () => {
    for (const q of ECO_CP021_REVIEW_V2) {
      const stem = q.stem.trim();
      expect(stem.endsWith("?")).toBe(true);
      expect(stem.endsWith(":" )).toBe(false);
      expect(stem.length).toBeLessThanOrEqual(170);
      expect(stem).not.toMatch(/A question contrasts|review focus|most appropriate in the context|rather than short-term|lacks creditworthiness for normal/i);
    }
  });

  it("limits long comparison framing", () => {
    const stems = ECO_CP021_REVIEW_V2.map((q) => q.stem);
    expect(stems.filter((s) => /Which statement correctly distinguishes/i.test(s)).length).toBeLessThanOrEqual(2);
    expect(stems.filter((s) => /Which statement correctly compares/i.test(s)).length).toBeLessThanOrEqual(2);
  });

  it("keeps clean statement-question format", () => {
    const statementQs = ECO_CP021_REVIEW_V2.filter((q) => q.qlId === "ECO-QL-11");
    expect(statementQs).toHaveLength(3);
    statementQs.forEach((q) => expect(q.stem).toMatch(/^Consider the statements\./));
  });
});
