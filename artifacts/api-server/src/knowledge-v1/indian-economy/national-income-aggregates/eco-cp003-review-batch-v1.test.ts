import { describe, expect, it } from "vitest";
import {
  ECO_CP003_AGGREGATE_ROWS_V1,
  ECO_CP003_CONCEPT_ROWS_V1,
} from "./eco-cp003-facts";
import { generateEcoCp003ReviewBatchV1 } from "./eco-cp003-review-generator-v1";
import { ECO_CP003_SOURCE_IDS_V1 } from "./eco-cp003-sources";

describe("ECO-CP-003 national income and aggregates review batch", () => {
  const questions = generateEcoCp003ReviewBatchV1();

  it("covers all 12 QLs in a 44-question review batch", () => {
    expect(questions).toHaveLength(44);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(12);
  });

  it("keeps the four core aggregate relationships correct", () => {
    const formulas = Object.fromEntries(ECO_CP003_AGGREGATE_ROWS_V1.map((row) => [row.term, row.formula]));
    expect(formulas).toEqual({
      GDP: "GDP = NDP + Depreciation",
      GNP: "GNP = GDP + NFIA",
      NDP: "NDP = GDP - Depreciation",
      NNP: "NNP = GNP - Depreciation",
    });
  });

  it("keeps nominal and real GDP distinct", () => {
    const nominal = ECO_CP003_CONCEPT_ROWS_V1.find((row) => row.id === "nominal-gdp")!;
    const real = ECO_CP003_CONCEPT_ROWS_V1.find((row) => row.id === "real-gdp")!;
    expect(nominal.compactMeaning).toContain("current prices");
    expect(real.compactMeaning).toContain("constant prices");
  });

  it("keeps every review item structurally valid", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.stem.trim().length).toBeGreaterThan(10);
      expect(question.explanation.trim().length).toBeGreaterThan(5);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.sourceFactIds.length).toBeGreaterThan(0);
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
    }
  });

  it("resolves all canonical source IDs", () => {
    const sourceIds = new Set(ECO_CP003_SOURCE_IDS_V1);
    for (const row of [...ECO_CP003_AGGREGATE_ROWS_V1, ...ECO_CP003_CONCEPT_ROWS_V1]) {
      for (const sourceId of row.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("uses every answer position and all difficulty bands", () => {
    expect(new Set(questions.map((question) => question.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    expect(new Set(questions.map((question) => question.difficulty))).toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("has no duplicate generated review signatures", () => {
    const signatures = questions.map((question) =>
      [question.qlId, question.stem, question.canonicalAnswer].join("::"),
    );
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("keeps current national-income values out of Static GK", () => {
    const text = questions.map((q) => `${q.stem} ${q.explanation}`).join("\n");
    expect(text).not.toMatch(/current gdp|latest gdp|current growth|latest growth|current base year|latest per capita/i);
  });
});
