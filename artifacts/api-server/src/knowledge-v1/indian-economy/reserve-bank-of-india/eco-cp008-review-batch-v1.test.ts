import { describe, expect, it } from "vitest";
import {
  ECO_CP008_CURRENCY_ROWS_V1,
  ECO_CP008_FUNCTION_ROWS_V1,
  ECO_CP008_HISTORY_ROWS_V1,
} from "./eco-cp008-facts";
import { generateEcoCp008ReviewBatchV1 } from "./eco-cp008-review-generator-v1";
import { ECO_CP008_SOURCE_IDS_V1 } from "./eco-cp008-sources";

describe("ECO-CP-008 Reserve Bank of India review batch", () => {
  const questions = generateEcoCp008ReviewBatchV1();

  it("generates exactly 44 questions across all 12 QLs", () => {
    expect(questions).toHaveLength(44);
    expect(new Set(questions.map((q) => q.qlId)).size).toBe(12);
  });

  it("contains the key RBI history milestones", () => {
    const labels = new Set(ECO_CP008_HISTORY_ROWS_V1.map((row) => row.label));
    expect(labels.has("Reserve Bank of India Act, 1934")).toBe(true);
    expect(labels.has("1 April 1935")).toBe(true);
    expect(labels.has("Calcutta to Mumbai in 1937")).toBe(true);
    expect(labels.has("1 January 1949")).toBe(true);
  });

  it("keeps currency responsibilities explicit", () => {
    const labels = new Set(ECO_CP008_CURRENCY_ROWS_V1.map((row) => row.label));
    expect(labels.has("RBI issues banknotes")).toBe(true);
    expect(labels.has("Government of India mints coins")).toBe(true);
    expect(labels.has("RBI distributes coins")).toBe(true);
    expect(labels.has("One-rupee note is a Government of India issue")).toBe(true);
  });

  it("contains the major institutional functions", () => {
    const ids = new Set(ECO_CP008_FUNCTION_ROWS_V1.map((row) => row.id));
    for (const id of [
      "monetary-authority",
      "banker-government",
      "debt-manager",
      "banker-banks",
      "lender-last-resort",
      "financial-regulator",
      "forex-manager",
      "payment-regulator",
      "developmental-role",
    ]) expect(ids.has(id)).toBe(true);
  });

  it("keeps every generated question structurally valid", () => {
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

  it("resolves every canonical source ID", () => {
    const allowed = new Set(ECO_CP008_SOURCE_IDS_V1);
    for (const row of [
      ...ECO_CP008_HISTORY_ROWS_V1,
      ...ECO_CP008_FUNCTION_ROWS_V1,
      ...ECO_CP008_CURRENCY_ROWS_V1,
    ]) {
      for (const sourceId of row.sourceIds) expect(allowed.has(sourceId)).toBe(true);
    }
  });

  it("uses all four answer positions and all difficulty bands", () => {
    expect(new Set(questions.map((q) => q.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    expect(new Set(questions.map((q) => q.difficulty))).toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("assigns mixed difficulty inside major application QLs", () => {
    for (const qlId of [
      "ECO-008-QL-003",
      "ECO-008-QL-004",
      "ECO-008-QL-005",
      "ECO-008-QL-006",
      "ECO-008-QL-007",
      "ECO-008-QL-008",
      "ECO-008-QL-010",
      "ECO-008-QL-011",
      "ECO-008-QL-012",
    ]) {
      const bands = new Set(questions.filter((q) => q.qlId === qlId).map((q) => q.difficulty));
      expect(bands.size).toBeGreaterThan(1);
    }
  });

  it("does not duplicate semantic question signatures", () => {
    const signatures = questions.map((q) => [q.qlId, q.stem, q.canonicalAnswer].join("::"));
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("keeps current-person and current-policy data out of Static GK", () => {
    const text = questions.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join("\n");
    expect(text).not.toMatch(/current governor|present governor|current deputy governor|present deputy governor/i);
    expect(text).not.toMatch(/current repo|current reverse repo|current sdf|current msf|current crr|current slr/i);
    expect(text).not.toMatch(/current forex reserve|latest forex reserve|current circulation|latest circulation/i);
  });

  it("does not leak detailed monetary-policy instrument questions", () => {
    const stems = questions.map((q) => q.stem).join("\n");
    expect(stems).not.toMatch(/repo rate|reverse repo|standing deposit facility|marginal standing facility|cash reserve ratio|statutory liquidity ratio/i);
  });

  it("keeps explanations instructional rather than answer-only", () => {
    for (const question of questions) {
      expect(question.explanation.trim()).not.toBe(question.canonicalAnswer.trim());
      expect(question.explanation.split(/(?<=[.!?])\s+/).length).toBeGreaterThanOrEqual(2);
    }
  });
});
