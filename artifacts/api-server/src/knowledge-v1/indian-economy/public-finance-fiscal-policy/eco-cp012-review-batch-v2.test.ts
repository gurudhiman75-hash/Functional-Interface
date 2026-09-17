import { describe, expect, it } from "vitest";
import { ECO_CP012_REVIEW_V2 } from "./eco-cp012-review-generator-v2";

describe("ECO-CP-012 review batch V2 stem quality", () => {
  it("preserves the approved 44-question / 12-QL structure", () => {
    expect(ECO_CP012_REVIEW_V2).toHaveLength(44);
    expect(new Set(ECO_CP012_REVIEW_V2.map((q) => q.qlId)).size).toBe(12);
  });

  it("does not use label-like stems that end with a colon", () => {
    for (const q of ECO_CP012_REVIEW_V2) {
      expect(q.stem.trim().endsWith(":"), `${q.questionId}: ${q.stem}`).toBe(false);
    }
  });

  it("uses complete exam-style question endings", () => {
    for (const q of ECO_CP012_REVIEW_V2) {
      expect(q.stem.trim().endsWith("?"), `${q.questionId}: ${q.stem}`).toBe(true);
    }
  });

  it("removes common prompt-fragment patterns", () => {
    const weakEndings = [/classified as:\s*$/i, /calculated as:\s*$/i, /is generally:\s*$/i, /means:\s*$/i, /stands for:\s*$/i, /works:\s*$/i, /is:\s*$/i];
    for (const q of ECO_CP012_REVIEW_V2) {
      weakEndings.forEach((pattern) => expect(pattern.test(q.stem), `${q.questionId}: ${q.stem}`).toBe(false));
    }
  });

  it("keeps the answer, options, explanation, sources and difficulty unchanged from V1", async () => {
    const { ECO_CP012_REVIEW_V1 } = await import("./eco-cp012-review-generator-v1");
    for (let i = 0; i < ECO_CP012_REVIEW_V2.length; i += 1) {
      const before = ECO_CP012_REVIEW_V1[i];
      const after = ECO_CP012_REVIEW_V2[i];
      expect(after.questionId).toBe(before.questionId);
      expect(after.options).toEqual(before.options);
      expect(after.correctIndex).toBe(before.correctIndex);
      expect(after.canonicalAnswer).toBe(before.canonicalAnswer);
      expect(after.explanation).toBe(before.explanation);
      expect(after.sourceIds).toEqual(before.sourceIds);
      expect(after.sourceFactIds).toEqual(before.sourceFactIds);
      expect(after.difficulty).toBe(before.difficulty);
    }
  });
});
