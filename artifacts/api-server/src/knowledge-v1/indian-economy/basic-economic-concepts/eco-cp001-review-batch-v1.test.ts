import { describe, expect, it } from "vitest";
import {
  ECO_CP001_CONCEPT_ROWS_V1,
  ECO_CP001_FACTOR_ROWS_V1,
} from "./eco-cp001-facts";
import { generateEcoCp001ReviewBatchV1 } from "./eco-cp001-review-generator-v1";
import { ECO_CP001_SOURCE_IDS_V1 } from "./eco-cp001-sources";

describe("ECO-CP-001 basic-economic-concepts review batch", () => {
  const questions = generateEcoCp001ReviewBatchV1();

  it("has a broad review batch with every QL represented", () => {
    expect(questions).toHaveLength(42);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(12);
  });

  it("has sufficient canonical concept depth", () => {
    expect(ECO_CP001_CONCEPT_ROWS_V1.length).toBeGreaterThanOrEqual(13);
    expect(ECO_CP001_FACTOR_ROWS_V1).toHaveLength(4);
    expect(new Set(ECO_CP001_CONCEPT_ROWS_V1.map((row) => row.term)).size)
      .toBe(ECO_CP001_CONCEPT_ROWS_V1.length);
  });

  it("preserves the standard factor-reward relationships", () => {
    expect(Object.fromEntries(ECO_CP001_FACTOR_ROWS_V1.map((row) => [row.factor, row.reward])))
      .toEqual({
        Land: "Rent",
        Labour: "Wages",
        Capital: "Interest",
        Entrepreneurship: "Profit",
      });
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

  it("resolves every canonical source ID", () => {
    const sourceIds = new Set(ECO_CP001_SOURCE_IDS_V1);
    for (const row of [...ECO_CP001_CONCEPT_ROWS_V1, ...ECO_CP001_FACTOR_ROWS_V1]) {
      for (const sourceId of row.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("uses every correct-option position", () => {
    expect(new Set(questions.map((question) => question.correctIndex)))
      .toEqual(new Set([0, 1, 2, 3]));
  });

  it("does not produce duplicate semantic review items", () => {
    const signatures = questions.map((question) =>
      [question.qlId, question.stem, question.canonicalAnswer].join("::"),
    );
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("contains Easy, Medium and Hard questions", () => {
    expect(new Set(questions.map((question) => question.difficulty)))
      .toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("keeps volatile current-economy values out of the static CP", () => {
    const text = questions
      .map((question) => `${question.stem} ${question.options.join(" ")} ${question.explanation}`)
      .join("\n");
    expect(text).not.toMatch(/current repo rate|current inflation|gdp growth rate|tax slab|budget allocation|forex reserves|latest ranking/i);
  });

  it("avoids the generic associated-with stem pattern", () => {
    const stems = questions.map((question) => question.stem).join("\n");
    expect(stems).not.toMatch(/which .* associated with/i);
  });
});
