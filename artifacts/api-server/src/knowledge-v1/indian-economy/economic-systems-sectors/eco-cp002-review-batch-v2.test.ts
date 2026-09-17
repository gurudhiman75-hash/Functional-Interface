import { describe, expect, it } from "vitest";
import {
  ECO_CP002_ACTIVITY_ROWS_V1,
  ECO_CP002_OWNERSHIP_ROWS_V1,
  ECO_CP002_SYSTEM_ROWS_V1,
  ECO_CP002_WORK_ROWS_V1,
} from "./eco-cp002-facts";
import { generateEcoCp002ReviewBatchV2 } from "./eco-cp002-review-generator-v2";
import { ECO_CP002_SOURCE_IDS_V1 } from "./eco-cp002-sources";

describe("ECO-CP-002 economic systems and sectors review batch V2", () => {
  const questions = generateEcoCp002ReviewBatchV2();

  it("keeps 42 questions across all 10 QLs", () => {
    expect(questions).toHaveLength(42);
    expect(new Set(questions.map((q) => q.qlId)).size).toBe(10);
  });

  it("keeps all questions structurally valid and review-only", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      expect(q.stem.trim().endsWith("?")).toBe(true);
      expect(q.stem.trim()).not.toMatch(/:$/);
      expect(q.stem.length).toBeLessThanOrEqual(190);
      expect(q.explanation.trim().length).toBeGreaterThan(15);
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
    }
  });

  it("uses only same-axis distractors for ownership and work-condition questions", () => {
    const ownershipQuestions = questions.filter((q) => q.qlId === "ECO-002-QL-004");
    const ownershipAllowed = new Set(["Public sector", "Private sector", "Both public and private sectors", "Cannot be determined from ownership information"]);
    for (const q of ownershipQuestions) expect(q.options.every((option) => ownershipAllowed.has(option))).toBe(true);

    const workQuestions = questions.filter((q) => q.qlId === "ECO-002-QL-005");
    const workAllowed = new Set(["Organised sector", "Unorganised sector", "Both organised and unorganised sectors", "Cannot be determined from the employment conditions given"]);
    for (const q of workQuestions) expect(q.options.every((option) => workAllowed.has(option))).toBe(true);
  });

  it("keeps activity and ownership dimensions separate in combined questions", () => {
    const combined = questions.filter((q) => q.qlId === "ECO-002-QL-006");
    for (const q of combined) {
      expect(q.options.every((option) => /^(Primary|Secondary|Tertiary) sector; (Public|Private) sector$/.test(option))).toBe(true);
    }
  });

  it("keeps sector pair questions internally coherent", () => {
    const correctMap = new Map(ECO_CP002_ACTIVITY_ROWS_V1.map((row) => [row.activity, row.sector]));
    const incorrectQuestions = questions.filter((q) => q.qlId === "ECO-002-QL-008");
    for (const q of incorrectQuestions) {
      const mismatches = q.options.filter((option) => {
        const [sector, activity] = option.split(" — ");
        return correctMap.get(activity) !== sector;
      });
      expect(mismatches).toHaveLength(1);
      expect(mismatches[0]).toBe(q.canonicalAnswer);
    }
  });

  it("resolves every canonical source ID", () => {
    const sourceIds = new Set<string>(ECO_CP002_SOURCE_IDS_V1);
    for (const row of [...ECO_CP002_SYSTEM_ROWS_V1, ...ECO_CP002_ACTIVITY_ROWS_V1, ...ECO_CP002_OWNERSHIP_ROWS_V1, ...ECO_CP002_WORK_ROWS_V1]) {
      for (const sourceId of row.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("uses every answer position and all difficulty bands", () => {
    expect(new Set(questions.map((q) => q.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    expect(new Set(questions.map((q) => q.difficulty))).toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("blocks volatile sector-share data", () => {
    const text = questions.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join("\n");
    expect(text).not.toMatch(/current share|latest share|current employment|current gdp contribution|latest gdp contribution/i);
  });
});
