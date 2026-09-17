import { describe, expect, it } from "vitest";
import { generateEcoCp004ReviewBatchV2 } from "./eco-cp004-review-generator-v2";
import { ECO_CP004_SOURCE_IDS_V1 } from "./eco-cp004-sources";

describe("ECO-CP-004 national-income measurement review batch V2", () => {
  const questions = generateEcoCp004ReviewBatchV2();

  it("preserves the 44-question / 12-QL review model", () => {
    expect(questions).toHaveLength(44);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(12);
  });

  it("keeps every item structurally valid and review-only", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.sourceFactIds.length).toBeGreaterThan(0);
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
    }
  });

  it("uses complete exam-grade question stems", () => {
    for (const question of questions) {
      expect(question.stem.trim().endsWith("?")).toBe(true);
      expect(question.stem.trim().endsWith(":")).toBe(false);
      expect(question.stem.length).toBeLessThanOrEqual(220);
    }
    const stems = questions.map((question) => question.stem).join("\n");
    expect(stems).not.toMatch(/ is treated as:$| is recorded as:$|GDP is:$|Value added is:$|Intermediate consumption is:$|Output is:$/im);
    expect(stems).not.toMatch(/which .* associated with/i);
  });

  it("keeps final/intermediate classification on one axis", () => {
    const items = questions.filter((question) => question.qlId === "ECO-004-QL-003");
    for (const item of items) {
      expect(item.options).toContain("Final");
      expect(item.options).toContain("Intermediate");
      expect(item.options).not.toContain("Transfer payment");
      expect(item.options).not.toContain("Net export");
    }
  });

  it("keeps income-method distractors inside national-account concepts", () => {
    const items = questions.filter((question) => question.qlId === "ECO-004-QL-007");
    for (const item of items) {
      expect(item.options).not.toContain("Net exports");
      expect(item.options).toContain("Compensation of employees");
      expect(item.options).toContain("Operating surplus");
      expect(item.options).toContain("Mixed income");
    }
  });

  it("removes unrelated macro distractors from double-counting questions", () => {
    const text = questions
      .filter((question) => question.qlId === "ECO-004-QL-004")
      .flatMap((question) => question.options)
      .join(" ");
    expect(text).not.toMatch(/deflation|inflation|fiscal deficit|net exports/i);
  });

  it("resolves source IDs and avoids duplicates", () => {
    const sourceIds = new Set(ECO_CP004_SOURCE_IDS_V1);
    const signatures = questions.map((question) => [question.qlId, question.stem, question.canonicalAnswer].join("::"));
    expect(new Set(signatures).size).toBe(questions.length);
    for (const question of questions) {
      for (const sourceId of question.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("retains all difficulty bands and blocks volatile values", () => {
    expect(new Set(questions.map((question) => question.difficulty))).toEqual(new Set(["Easy", "Medium", "Hard"]));
    const text = questions.map((question) => `${question.stem} ${question.options.join(" ")} ${question.explanation}`).join("\n");
    expect(text).not.toMatch(/current gdp|latest gdp|current growth|latest growth|current base year|latest base year|2011-12|2022-23/i);
  });
});
