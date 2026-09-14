import { describe, expect, it } from "vitest";
import {
  ECO_CP005_CONCEPT_ROWS_V1,
  ECO_CP005_INDEX_ROWS_V1,
} from "./eco-cp005-facts";
import { generateEcoCp005ReviewBatchV1 } from "./eco-cp005-review-generator-v1";
import { ECO_CP005_SOURCE_IDS_V1 } from "./eco-cp005-sources";

describe("ECO-CP-005 inflation and price concepts review batch", () => {
  const questions = generateEcoCp005ReviewBatchV1();

  it("covers all 12 QLs in a 44-question batch", () => {
    expect(questions).toHaveLength(44);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(12);
  });

  it("contains the core static concept inventory", () => {
    const terms = new Set(ECO_CP005_CONCEPT_ROWS_V1.map((row) => row.term));
    for (const term of [
      "Inflation",
      "Deflation",
      "Disinflation",
      "Demand-pull inflation",
      "Cost-push inflation",
      "Headline inflation",
      "Core inflation",
    ]) {
      expect(terms.has(term)).toBe(true);
    }
  });

  it("keeps CPI, WPI and GDP deflator distinct", () => {
    expect(new Set(ECO_CP005_INDEX_ROWS_V1.map((row) => row.index)))
      .toEqual(new Set(["CPI", "WPI", "GDP deflator"]));
  });

  it("keeps every generated item structurally valid", () => {
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

  it("keeps explanations useful instead of answer-only", () => {
    for (const question of questions) {
      expect(question.explanation.trim()).not.toBe(question.canonicalAnswer.trim());
      expect(question.explanation).not.toMatch(/^both statements are correct\.?$/i);
      expect(question.explanation).not.toMatch(/^.+ is correctly matched\.?$/i);
    }

    for (const question of questions.filter((q) => q.qlId === "ECO-005-QL-011")) {
      expect(question.explanation).toMatch(/statement i|statement ii|because|means|describes/i);
    }

    for (const question of questions.filter((q) => q.qlId === "ECO-005-QL-009")) {
      expect(question.explanation).toMatch(/=|increase|adding|base/i);
    }
  });

  it("resolves every source ID", () => {
    const sourceIds = new Set(ECO_CP005_SOURCE_IDS_V1);
    for (const row of [...ECO_CP005_CONCEPT_ROWS_V1, ...ECO_CP005_INDEX_ROWS_V1]) {
      for (const sourceId of row.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("uses all answer positions and all difficulty bands", () => {
    expect(new Set(questions.map((question) => question.correctIndex)))
      .toEqual(new Set([0, 1, 2, 3]));
    expect(new Set(questions.map((question) => question.difficulty)))
      .toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("assigns difficulty per variant inside major QLs", () => {
    for (const qlId of ["ECO-005-QL-006", "ECO-005-QL-007", "ECO-005-QL-009", "ECO-005-QL-011", "ECO-005-QL-012"]) {
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

  it("keeps changing inflation data out of Static GK", () => {
    const text = questions
      .map((question) => `${question.stem} ${question.options.join(" ")} ${question.explanation}`)
      .join("\n");
    expect(text).not.toMatch(/current inflation|latest inflation|current cpi|latest cpi|current wpi|latest wpi|inflation target|tolerance band/i);
  });

  it("does not use arbitrary rate-band labels", () => {
    const text = questions.map((question) => `${question.stem} ${question.explanation}`).join("\n");
    expect(text).not.toMatch(/creeping inflation|walking inflation|running inflation/i);
  });
});
