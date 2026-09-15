import { describe, expect, it } from "vitest";
import { ECO_CP007_AGGREGATE_ROWS_V1 } from "./eco-cp007-facts";
import { generateEcoCp007ReviewBatchV1 } from "./eco-cp007-review-generator-v1";
import { ECO_CP007_SOURCE_IDS_V1 } from "./eco-cp007-sources";

describe("ECO-CP-007 money and monetary system review batch", () => {
  const questions = generateEcoCp007ReviewBatchV1();

  it("covers all 12 QLs in a 44-question batch", () => {
    expect(questions).toHaveLength(44);
    expect(new Set(questions.map((q) => q.qlId)).size).toBe(12);
  });

  it("keeps every question structurally valid", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.stem.trim().length).toBeGreaterThan(10);
      expect(question.explanation.trim().length).toBeGreaterThan(35);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.sourceFactIds.length).toBeGreaterThan(0);
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
    }
  });

  it("uses all answer positions and all difficulty bands", () => {
    expect(new Set(questions.map((q) => q.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    expect(new Set(questions.map((q) => q.difficulty))).toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("assigns difficulty per variant inside major QLs", () => {
    for (const qlId of ["ECO-007-QL-004", "ECO-007-QL-007", "ECO-007-QL-009", "ECO-007-QL-010", "ECO-007-QL-011", "ECO-007-QL-012"]) {
      const bands = new Set(questions.filter((q) => q.qlId === qlId).map((q) => q.difficulty));
      expect(bands.size).toBeGreaterThan(1);
    }
  });

  it("keeps official aggregate relationships stable", () => {
    const byId = Object.fromEntries(ECO_CP007_AGGREGATE_ROWS_V1.map((row) => [row.id, row]));
    expect(byId.m1.classification).toBe("Narrow money");
    expect(byId.m2.classification).toBe("Narrow money");
    expect(byId.m3.classification).toBe("Broad money");
    expect(byId.m4.classification).toBe("Broad money");
    expect(byId.m2.formula).toMatch(/M1 \+ savings deposits/i);
    expect(byId.m3.formula).toMatch(/M1 \+ time deposits/i);
    expect(byId.m4.formula).toMatch(/M3 \+ all deposits/i);
  });

  it("keeps M1 as most liquid and M4 as least liquid", () => {
    const sorted = [...ECO_CP007_AGGREGATE_ROWS_V1].sort((a, b) => a.liquidityRank - b.liquidityRank);
    expect(sorted.map((row) => row.aggregate)).toEqual(["M1", "M2", "M3", "M4"]);
  });

  it("resolves every source ID", () => {
    const sourceIds = new Set(ECO_CP007_SOURCE_IDS_V1);
    for (const question of questions) {
      for (const sourceId of question.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("does not duplicate semantic review items", () => {
    const signatures = questions.map((q) => [q.qlId, q.stem, q.canonicalAnswer].join("::"));
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("keeps current monetary data and policy rates out of Static GK", () => {
    const text = questions.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join("\n");
    expect(text).not.toMatch(/current repo|latest repo|current crr|current slr|latest money supply|current M1 value|current M3 value|currency in circulation today/i);
  });

  it("keeps detailed monetary-policy instruments outside this CP", () => {
    const stems = questions.map((q) => q.stem).join("\n");
    expect(stems).not.toMatch(/repo rate|reverse repo|cash reserve ratio|statutory liquidity ratio|open market operation/i);
  });

  it("blocks generic answer-only explanation patterns", () => {
    for (const question of questions) {
      expect(question.explanation).not.toMatch(/^Both statements are correct\.?$/i);
      expect(question.explanation).not.toBe(`${question.canonicalAnswer}.`);
    }
  });
});
