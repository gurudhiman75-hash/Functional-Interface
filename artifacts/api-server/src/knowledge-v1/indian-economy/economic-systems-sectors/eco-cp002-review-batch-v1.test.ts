import { describe, expect, it } from "vitest";
import {
  ECO_CP002_ACTIVITY_ROWS_V1,
  ECO_CP002_OWNERSHIP_ROWS_V1,
  ECO_CP002_SYSTEM_ROWS_V1,
  ECO_CP002_WORK_ROWS_V1,
} from "./eco-cp002-facts";
import { generateEcoCp002ReviewBatchV1 } from "./eco-cp002-review-generator-v1";
import { ECO_CP002_SOURCE_IDS_V1 } from "./eco-cp002-sources";

describe("ECO-CP-002 economic systems and sectors review batch", () => {
  const questions = generateEcoCp002ReviewBatchV1();

  it("covers every QL in a 42-question review batch", () => {
    expect(questions).toHaveLength(42);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(10);
  });

  it("keeps the three basic economic systems distinct", () => {
    expect(ECO_CP002_SYSTEM_ROWS_V1.map((row) => row.system)).toEqual([
      "Capitalist economy",
      "Socialist economy",
      "Mixed economy",
    ]);
  });

  it("contains all three activity sectors", () => {
    expect(new Set(ECO_CP002_ACTIVITY_ROWS_V1.map((row) => row.sector))).toEqual(
      new Set(["Primary sector", "Secondary sector", "Tertiary sector"]),
    );
  });

  it("keeps ownership separate from activity classification", () => {
    expect(new Set(ECO_CP002_OWNERSHIP_ROWS_V1.map((row) => row.ownership))).toEqual(
      new Set(["Public sector", "Private sector"]),
    );
    expect(new Set(ECO_CP002_WORK_ROWS_V1.map((row) => row.classification))).toEqual(
      new Set(["Organised sector", "Unorganised sector"]),
    );
  });

  it("keeps every review item structurally valid", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.stem.trim().length).toBeGreaterThan(10);
      expect(question.explanation.trim().length).toBeGreaterThan(10);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.sourceFactIds.length).toBeGreaterThan(0);
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
    }
  });

  it("resolves source IDs", () => {
    const sourceIds = new Set(ECO_CP002_SOURCE_IDS_V1);
    for (const row of [
      ...ECO_CP002_SYSTEM_ROWS_V1,
      ...ECO_CP002_ACTIVITY_ROWS_V1,
      ...ECO_CP002_OWNERSHIP_ROWS_V1,
      ...ECO_CP002_WORK_ROWS_V1,
    ]) {
      for (const sourceId of row.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("uses all four answer positions and all difficulty bands", () => {
    expect(new Set(questions.map((question) => question.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    expect(new Set(questions.map((question) => question.difficulty))).toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("does not duplicate generated review items", () => {
    const signatures = questions.map((question) =>
      [question.qlId, question.stem, question.canonicalAnswer].join("::"),
    );
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("keeps dynamic sector shares out of Static GK", () => {
    const text = questions.map((q) => `${q.stem} ${q.explanation}`).join("\n");
    expect(text).not.toMatch(/current share|latest share|current employment|current gdp contribution|latest gdp contribution/i);
  });
});
