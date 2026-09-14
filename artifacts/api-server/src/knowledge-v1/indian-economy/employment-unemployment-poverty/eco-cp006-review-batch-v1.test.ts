import { describe, expect, it } from "vitest";
import {
  ECO_CP006_COMMITTEE_ROWS_V1,
  ECO_CP006_CONCEPT_ROWS_V1,
  ECO_CP006_EMPLOYMENT_SCENARIOS_V1,
} from "./eco-cp006-facts";
import { generateEcoCp006ReviewBatchV1 } from "./eco-cp006-review-generator-v1";
import { ECO_CP006_SOURCE_IDS_V1 } from "./eco-cp006-sources";

describe("ECO-CP-006 employment, unemployment and poverty review batch", () => {
  const questions = generateEcoCp006ReviewBatchV1();

  it("covers all 12 QLs in a 44-question batch", () => {
    expect(questions).toHaveLength(44);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(12);
  });

  it("keeps the official labour-force indicators distinct", () => {
    const meanings = Object.fromEntries(ECO_CP006_CONCEPT_ROWS_V1.map((row) => [row.id, row.compactMeaning]));
    expect(meanings.lfpr).toContain("labour force as a percentage of the population");
    expect(meanings.wpr).toContain("employed persons as a percentage of the population");
    expect(meanings.ur).toContain("unemployed persons as a percentage of the labour force");
  });

  it("contains the main unemployment and poverty concepts", () => {
    const terms = new Set(ECO_CP006_CONCEPT_ROWS_V1.map((row) => row.term));
    for (const term of [
      "Seasonal unemployment",
      "Disguised unemployment",
      "Frictional unemployment",
      "Structural unemployment",
      "Cyclical unemployment",
      "Absolute poverty",
      "Relative poverty",
      "Multidimensional poverty",
      "Poverty line",
      "Poverty headcount ratio",
    ]) expect(terms.has(term)).toBe(true);
  });

  it("preserves the poverty-estimation committee sequence", () => {
    expect(ECO_CP006_COMMITTEE_ROWS_V1.map((row) => [row.committee, row.year])).toEqual([
      ["Y. K. Alagh Task Force", 1979],
      ["Lakdawala Expert Group", 1993],
      ["Tendulkar Expert Group", 2009],
      ["Rangarajan Expert Group", 2014],
    ]);
  });

  it("keeps every generated item structurally valid", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.stem.trim().length).toBeGreaterThan(10);
      expect(question.explanation.trim().length).toBeGreaterThan(55);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.sourceFactIds.length).toBeGreaterThan(0);
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
    }
  });

  it("resolves source IDs for canonical pools", () => {
    const sourceIds = new Set(ECO_CP006_SOURCE_IDS_V1);
    for (const row of [
      ...ECO_CP006_CONCEPT_ROWS_V1,
      ...ECO_CP006_EMPLOYMENT_SCENARIOS_V1,
      ...ECO_CP006_COMMITTEE_ROWS_V1,
    ]) {
      for (const sourceId of row.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("uses every answer position and all difficulty bands", () => {
    expect(new Set(questions.map((question) => question.correctIndex)))
      .toEqual(new Set([0, 1, 2, 3]));
    expect(new Set(questions.map((question) => question.difficulty)))
      .toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("assigns difficulty per variant inside major QLs", () => {
    for (const qlId of [
      "ECO-006-QL-001",
      "ECO-006-QL-003",
      "ECO-006-QL-005",
      "ECO-006-QL-006",
      "ECO-006-QL-008",
      "ECO-006-QL-009",
      "ECO-006-QL-011",
      "ECO-006-QL-012",
    ]) {
      const bands = new Set(questions.filter((q) => q.qlId === qlId).map((q) => q.difficulty));
      expect(bands.size).toBeGreaterThan(1);
    }
  });

  it("does not duplicate semantic review items", () => {
    const signatures = questions.map((question) =>
      [question.qlId, question.stem, question.canonicalAnswer].join("::"),
    );
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("keeps changing labour and poverty statistics out of Static GK", () => {
    const text = questions
      .map((question) => `${question.stem} ${question.options.join(" ")} ${question.explanation}`)
      .join("\n");
    expect(text).not.toMatch(/current unemployment|latest unemployment|current lfpr|current wpr|current poverty ratio|latest poverty ratio|current mpi|latest mpi|current poverty line|current mgnrega wage|budget allocation/i);
  });

  it("keeps explanations instructional rather than answer-only", () => {
    const generic = /^(both statements are correct|this is the correct answer|the answer is .+)\.?$/i;
    for (const question of questions) expect(question.explanation.trim()).not.toMatch(generic);
  });
});
