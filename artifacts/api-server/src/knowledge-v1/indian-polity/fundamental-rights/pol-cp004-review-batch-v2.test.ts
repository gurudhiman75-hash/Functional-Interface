import { describe, expect, it } from "vitest";
import { generatePolCp004ReviewBatchV2 } from "./pol-cp004-review-generator-v2";
import { POL_CP004_SOURCES_V1 } from "./pol-cp004-sources";

describe("POL-CP-004 Fundamental Rights review batch V2", () => {
  const questions = generatePolCp004ReviewBatchV2();

  it("covers all QLs with the intended difficulty spread", () => {
    expect(questions).toHaveLength(72);
    expect(new Set(questions.map((q) => q.qlId)).size).toBe(20);
    const counts = questions.reduce<Record<string, number>>((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts).toEqual({ Easy: 21, Medium: 43, Hard: 8 });
  });

  it("keeps every question structurally valid", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
    }
  });

  it("uses every answer position", () => {
    expect(new Set(questions.map((q) => q.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
  });

  it("has no exact duplicate semantic signatures", () => {
    const signatures = questions.map((q) => [q.qlId, q.stem, q.canonicalAnswer].join("|"));
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("resolves all sources", () => {
    const ids = new Set(POL_CP004_SOURCES_V1.map((s) => s.sourceId));
    for (const q of questions) for (const sourceId of q.sourceIds) expect(ids.has(sourceId)).toBe(true);
  });

  it("keeps approved exam-style language rules", () => {
    const stems = questions.map((q) => q.stem).join("\n");
    expect(stems).not.toMatch(/On which date did the following occur/i);
    expect(stems).not.toMatch(/most directly governs|principal subject/i);
    for (const q of questions) {
      if (!q.stem.startsWith("Consider the following statements")) {
        expect(q.stem.split(/\s+/).length).toBeLessThanOrEqual(32);
      }
    }
  });
});
