import { describe, expect, it } from "vitest";
import { ECO_CP009_FACTS_V1 } from "./eco-cp009-facts";
import { generateEcoCp009ReviewBatchV1 } from "./eco-cp009-review-generator-v1";
import { ECO_CP009_SOURCE_IDS_V1 } from "./eco-cp009-sources";

describe("ECO-CP-009 monetary policy review batch", () => {
  const questions = generateEcoCp009ReviewBatchV1();

  it("covers all 12 QLs in a 44-question batch", () => {
    expect(questions).toHaveLength(44);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(12);
  });

  it("contains the core monetary-policy inventory", () => {
    const terms = new Set(ECO_CP009_FACTS_V1.map((row) => row.term));
    for (const term of [
      "Monetary-policy objective",
      "MPC composition",
      "Policy repo rate",
      "Standing Deposit Facility",
      "Marginal Standing Facility",
      "Liquidity Adjustment Facility",
      "Cash Reserve Ratio",
      "Open Market Operations",
      "Bank Rate",
    ]) {
      expect(terms.has(term)).toBe(true);
    }
  });

  it("keeps every generated item structurally valid", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.stem.trim().length).toBeGreaterThan(10);
      expect(question.explanation.trim().length).toBeGreaterThan(30);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.sourceFactIds.length).toBeGreaterThan(0);
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
    }
  });

  it("resolves every source ID", () => {
    const sourceIds = new Set(ECO_CP009_SOURCE_IDS_V1);
    for (const row of ECO_CP009_FACTS_V1) {
      for (const sourceId of row.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("uses all answer positions and all difficulty bands", () => {
    expect(new Set(questions.map((question) => question.correctIndex)))
      .toEqual(new Set([0, 1, 2, 3]));
    expect(new Set(questions.map((question) => question.difficulty)))
      .toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("assigns difficulty per variant in major application QLs", () => {
    for (const qlId of ["ECO-009-QL-002", "ECO-009-QL-005", "ECO-009-QL-006", "ECO-009-QL-008"]) {
      const bands = new Set(questions.filter((q) => q.qlId === qlId).map((q) => q.difficulty));
      expect(bands.size).toBeGreaterThan(1);
    }
  });

  it("keeps the SDF-repo-MSF corridor relationship correct", () => {
    const text = questions.map((question) => `${question.stem} ${question.canonicalAnswer} ${question.explanation}`).join("\n");
    expect(text).toContain("SDF → Repo → MSF");
    expect(text).toMatch(/SDF.*floor|lower bound/i);
    expect(text).toMatch(/MSF.*ceiling|upper bound/i);
  });

  it("keeps liquidity-direction rules coherent", () => {
    const text = questions.map((question) => `${question.stem} ${question.canonicalAnswer} ${question.explanation}`).join("\n");
    expect(text).toMatch(/OMO purchase|buys government securities/i);
    expect(text).toMatch(/injects? durable liquidity|liquidity injection/i);
    expect(text).toMatch(/OMO sale|sells government securities/i);
    expect(text).toMatch(/absorb.*liquidity|liquidity absorption|drains? durable liquidity/i);
  });

  it("does not duplicate semantic review items", () => {
    const signatures = questions.map((question) =>
      [question.qlId, question.stem, question.canonicalAnswer].join("::"),
    );
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("keeps volatile current settings out of Static GK", () => {
    const text = questions
      .map((question) => `${question.stem} ${question.options.join(" ")} ${question.explanation}`)
      .join("\n");
    expect(text).not.toMatch(/current repo rate|latest repo rate|current sdf rate|current msf rate|current crr|current bank rate|current inflation target|current mpc member|latest policy stance/i);
    expect(text).not.toMatch(/\b[2-9]\.\d{1,2}%\b/);
  });
});
