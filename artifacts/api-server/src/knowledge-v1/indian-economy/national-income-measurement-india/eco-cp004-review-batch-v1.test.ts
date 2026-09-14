import { describe, expect, it } from "vitest";
import {
  ECO_CP004_EXPENDITURE_ROWS_V1,
  ECO_CP004_INCOME_ROWS_V1,
  ECO_CP004_METHOD_ROWS_V1,
  ECO_CP004_USE_ROWS_V1,
} from "./eco-cp004-facts";
import { generateEcoCp004ReviewBatchV1 } from "./eco-cp004-review-generator-v1";
import { ECO_CP004_SOURCE_IDS_V1 } from "./eco-cp004-sources";

describe("ECO-CP-004 national-income measurement in India review batch", () => {
  const questions = generateEcoCp004ReviewBatchV1();

  it("covers all 12 QLs in a 44-question review batch", () => {
    expect(questions).toHaveLength(44);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(12);
  });

  it("contains the three standard measurement methods", () => {
    expect(new Set(ECO_CP004_METHOD_ROWS_V1.map((row) => row.method))).toEqual(
      new Set(["Value added method", "Income method", "Expenditure method"]),
    );
  });

  it("keeps final and intermediate use distinct", () => {
    expect(new Set(ECO_CP004_USE_ROWS_V1.map((row) => row.classification))).toEqual(
      new Set(["Final", "Intermediate"]),
    );
  });

  it("contains core expenditure and income components", () => {
    expect(ECO_CP004_EXPENDITURE_ROWS_V1.length).toBeGreaterThanOrEqual(4);
    expect(ECO_CP004_INCOME_ROWS_V1.length).toBeGreaterThanOrEqual(3);
  });

  it("keeps every generated item structurally valid", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.stem.trim().length).toBeGreaterThan(10);
      expect(question.explanation.trim().length).toBeGreaterThan(5);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.sourceFactIds.length).toBeGreaterThan(0);
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
    }
  });

  it("resolves every source ID", () => {
    const sourceIds = new Set(ECO_CP004_SOURCE_IDS_V1);
    for (const question of questions) {
      for (const sourceId of question.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("uses all four answer positions and all difficulty bands", () => {
    expect(new Set(questions.map((question) => question.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    expect(new Set(questions.map((question) => question.difficulty))).toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("assigns difficulty per variant inside major QLs", () => {
    const difficultiesFor = (qlId: string) =>
      new Set(questions.filter((question) => question.qlId === qlId).map((question) => question.difficulty));

    expect(difficultiesFor("ECO-004-QL-002").size).toBeGreaterThan(1);
    expect(difficultiesFor("ECO-004-QL-003").size).toBeGreaterThan(1);
    expect(difficultiesFor("ECO-004-QL-004")).toEqual(new Set(["Medium", "Hard"]));
    expect(difficultiesFor("ECO-004-QL-008")).toEqual(new Set(["Medium", "Hard"]));
    expect(difficultiesFor("ECO-004-QL-011")).toEqual(new Set(["Medium", "Hard"]));
  });

  it("does not duplicate semantic review items", () => {
    const signatures = questions.map((question) =>
      [question.qlId, question.stem, question.canonicalAnswer].join("::"),
    );
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("keeps volatile national-income values out of Static GK", () => {
    const text = questions.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join("\n");
    expect(text).not.toMatch(/current gdp|latest gdp|current growth|latest growth|current base year|latest base year|2022-23|2011-12/i);
  });

  it("avoids generic associated-with stems", () => {
    const stems = questions.map((question) => question.stem).join("\n");
    expect(stems).not.toMatch(/which .* associated with/i);
  });
});
