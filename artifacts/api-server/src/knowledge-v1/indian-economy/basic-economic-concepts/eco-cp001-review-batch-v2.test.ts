import { describe, expect, it } from "vitest";
import { ECO_CP001_REVIEW_V2 } from "./eco-cp001-review-generator-v2";

describe("ECO-CP-001 review batch V2", () => {
  it("preserves the 42-question / 12-QL review surface", () => {
    expect(ECO_CP001_REVIEW_V2).toHaveLength(42);
    expect(new Set(ECO_CP001_REVIEW_V2.map((q) => q.qlId)).size).toBe(12);
    expect(ECO_CP001_REVIEW_V2.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("uses complete exam-grade stems", () => {
    for (const q of ECO_CP001_REVIEW_V2) {
      const stem = q.stem.trim();
      expect(stem.endsWith("?")).toBe(true);
      expect(stem.endsWith(":" )).toBe(false);
      expect(stem.length).toBeLessThanOrEqual(180);
      expect(stem).not.toMatch(/This is an example of:|This is studied under:|reward for:|means:/i);
    }
  });

  it("keeps explanations simple", () => {
    for (const q of ECO_CP001_REVIEW_V2) {
      const sentences = q.explanation.split(/[.!?]+/).map((x) => x.trim()).filter(Boolean);
      expect(sentences.length).toBeLessThanOrEqual(2);
      expect(q.explanation.length).toBeLessThanOrEqual(260);
    }
  });

  it("preserves answer integrity and all difficulty bands", () => {
    expect(new Set(ECO_CP001_REVIEW_V2.map((q) => q.difficulty)))
      .toEqual(new Set(["Easy", "Medium", "Hard"]));
    for (const q of ECO_CP001_REVIEW_V2) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("keeps static-GK volatile data out", () => {
    const text = ECO_CP001_REVIEW_V2
      .map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`)
      .join("\n");
    expect(text).not.toMatch(/current repo rate|current inflation|gdp growth rate|tax slab|budget allocation|forex reserves|latest ranking/i);
  });
});
