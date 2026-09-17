import { describe, expect, it } from "vitest";
import {
  ECO_CP003_AGGREGATE_ROWS_V1,
  ECO_CP003_CONCEPT_ROWS_V1,
} from "./eco-cp003-facts";
import { generateEcoCp003ReviewBatchV2 } from "./eco-cp003-review-generator-v2";
import { ECO_CP003_SOURCE_IDS_V1 } from "./eco-cp003-sources";

describe("ECO-CP-003 national-income closure-audit V2", () => {
  const questions = generateEcoCp003ReviewBatchV2();

  it("preserves 44 questions across all 12 QLs", () => {
    expect(questions).toHaveLength(44);
    expect(new Set(questions.map((q) => q.qlId)).size).toBe(12);
  });

  it("preserves the core aggregate relationships", () => {
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

  it("uses complete exam-grade stems instead of answer-label fragments", () => {
    for (const question of questions) {
      expect(question.stem.trim()).not.toMatch(/:$/);
      expect(question.stem.trim()).toMatch(/\?$/);
      expect(question.stem.trim().length).toBeLessThanOrEqual(190);
    }
  });

  it("keeps every item structurally valid and review-only", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.explanation.trim().length).toBeGreaterThan(8);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.sourceFactIds.length).toBeGreaterThan(0);
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
    }
  });

  it("resolves all source IDs", () => {
    const sourceIds = new Set<string>(ECO_CP003_SOURCE_IDS_V1);
    for (const row of [...ECO_CP003_AGGREGATE_ROWS_V1, ...ECO_CP003_CONCEPT_ROWS_V1]) {
      for (const sourceId of row.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("uses all answer positions and difficulty bands", () => {
    expect(new Set(questions.map((q) => q.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    expect(new Set(questions.map((q) => q.difficulty))).toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("has no duplicate generated signatures", () => {
    const signatures = questions.map((q) => [q.qlId, q.stem, q.canonicalAnswer].join("::"));
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("uses relevant adjustment distractors for GDP-to-GNP questions", () => {
    for (const q of questions.filter((item) => ["ECO-CP003-V2-014", "ECO-CP003-V2-016"].includes(item.questionId))) {
      expect(q.options).toEqual(expect.arrayContaining([
        "Net factor income from abroad",
        "Depreciation",
        "Net indirect taxes",
        "Intermediate consumption",
      ]));
    }
  });

  it("keeps the traditional market-price relationship explicitly bounded", () => {
    const marketQuestion = questions.find((q) => q.questionId === "ECO-CP003-V2-042")!;
    expect(marketQuestion.stem).toMatch(/traditional exam relationship/i);
    expect(marketQuestion.canonicalAnswer).toBe("Factor cost + Net indirect taxes");
  });

  it("keeps volatile national-income values out of Static GK", () => {
    const text = questions.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join("\n");
    expect(text).not.toMatch(/current gdp|latest gdp|current growth|latest growth|current base year|latest per capita|current gni/i);
  });
});
