import { describe, expect, it } from "vitest";
import { POL_CP001_ACT_ROWS_V1 } from "./pol-cp001-facts";
import { POL_CP001_SOURCE_IDS_V1 } from "./pol-cp001-sources";
import { generatePolCp001ReviewBatchV1 } from "./pol-cp001-review-generator-v1";

describe("POL-CP-001 constitutional-history review batch", () => {
  const questions = generatePolCp001ReviewBatchV1();

  it("has a broad human-review batch with every QL represented", () => {
    expect(questions.length).toBe(42);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(12);
  });

  it("uses a complete canonical Act timeline", () => {
    expect(POL_CP001_ACT_ROWS_V1.length).toBe(13);
    expect(POL_CP001_ACT_ROWS_V1[0].year).toBe(1773);
    expect(POL_CP001_ACT_ROWS_V1.at(-1)?.year).toBe(1947);
    expect(new Set(POL_CP001_ACT_ROWS_V1.map((row) => row.title)).size).toBe(13);
    expect(new Set(POL_CP001_ACT_ROWS_V1.map((row) => row.year)).size).toBe(13);
  });

  it("keeps every review question structurally valid", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.stem.trim().length).toBeGreaterThan(15);
      expect(question.explanation.trim().length).toBeGreaterThan(20);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.sourceFactIds.length).toBeGreaterThan(0);
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
    }
  });

  it("resolves every fact source ID in the CP source registry", () => {
    const sourceIds = new Set(POL_CP001_SOURCE_IDS_V1);
    for (const row of POL_CP001_ACT_ROWS_V1) {
      for (const sourceId of row.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("uses all four correct-option positions", () => {
    expect(new Set(questions.map((question) => question.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
  });

  it("has no duplicate semantic questions while allowing standard instruction stems", () => {
    const signatures = questions.map((question) =>
      [question.qlId, question.canonicalAnswer, [...question.options].sort().join("||")].join("::"),
    );
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("contains all three intended difficulty bands", () => {
    const difficulties = new Set(questions.map((question) => question.difficulty));
    expect(difficulties).toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("does not leak current-office-holder facts into Static GK", () => {
    const text = questions.map((question) => `${question.stem} ${question.explanation}`).join("\n");
    expect(text).not.toMatch(/current president|current prime minister|current governor|incumbent/i);
  });

  it("preserves the crucial 1919 versus 1935 dyarchy distinction", () => {
    const act1919 = POL_CP001_ACT_ROWS_V1.find((row) => row.id === "government-of-india-act-1919")!;
    const act1935 = POL_CP001_ACT_ROWS_V1.find((row) => row.id === "government-of-india-act-1935")!;
    expect(act1919.definingFeature).toContain("dyarchy in the provinces");
    expect(act1935.definingFeature).toContain("abolished provincial dyarchy");
    expect(act1935.definingFeature).toContain("did not come into operation");
  });
});
