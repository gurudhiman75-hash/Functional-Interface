import { describe, expect, it } from "vitest";
import { generatePolCp004ReviewBatchV3 } from "./pol-cp004-review-generator-v3";
import { POL_CP004_SOURCES_V1 } from "./pol-cp004-sources";

describe("POL-CP-004 Fundamental Rights review batch V3", () => {
  const questions = generatePolCp004ReviewBatchV3();

  it("covers the complete review design", () => {
    expect(questions).toHaveLength(75);
    expect(new Set(questions.map((q) => q.qlId)).size).toBe(21);
    const counts = questions.reduce<Record<string, number>>((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts).toEqual({ Easy: 21, Medium: 46, Hard: 8 });
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

  it("covers Articles 31A, 31B and 31C explicitly", () => {
    const saving = questions.filter((q) => q.qlId === "POL-004-QL-021");
    expect(saving).toHaveLength(3);
    expect(saving.map((q) => q.stem)).toEqual([
      "Article 31A deals with:",
      "Article 31B deals with:",
      "Article 31C deals with:",
    ]);
  });

  it("uses all four answer positions and unique semantic signatures", () => {
    expect(new Set(questions.map((q) => q.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    const signatures = questions.map((q) => [q.qlId, q.stem, q.canonicalAnswer].join("|"));
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("resolves every source and blocks rejected stem patterns", () => {
    const sourceIds = new Set(POL_CP004_SOURCES_V1.map((s) => s.sourceId));
    const stems = questions.map((q) => q.stem).join("\n");
    for (const q of questions) for (const id of q.sourceIds) expect(sourceIds.has(id)).toBe(true);
    expect(stems).not.toMatch(/On which date did the following occur|most directly governs|principal subject/i);
  });
});
