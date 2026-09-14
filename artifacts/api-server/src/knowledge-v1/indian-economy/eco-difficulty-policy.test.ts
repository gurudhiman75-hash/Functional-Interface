import { describe, expect, it } from "vitest";
import { generateEcoCp001ReviewBatchV1 } from "./basic-economic-concepts/eco-cp001-review-generator-v1";
import { generateEcoCp002ReviewBatchV1 } from "./economic-systems-sectors/eco-cp002-review-generator-v1";
import { generateEcoCp003ReviewBatchV1 } from "./national-income-aggregates/eco-cp003-review-generator-v1";

function difficultySet(
  questions: readonly { qlId: string; difficulty: string }[],
  qlId: string,
) {
  return new Set(
    questions
      .filter((question) => question.qlId === qlId)
      .map((question) => question.difficulty),
  );
}

describe("Indian Economy per-variant difficulty policy", () => {
  const cp001 = generateEcoCp001ReviewBatchV1();
  const cp002 = generateEcoCp002ReviewBatchV1();
  const cp003 = generateEcoCp003ReviewBatchV1();

  it("keeps all three difficulty bands in every implemented CP", () => {
    for (const questions of [cp001, cp002, cp003]) {
      expect(new Set(questions.map((question) => question.difficulty)))
        .toEqual(new Set(["Easy", "Medium", "Hard"]));
    }
  });

  it("allows ECO-CP-001 concept application QLs to span difficulty bands", () => {
    expect(difficultySet(cp001, "ECO-001-QL-006"))
      .toEqual(new Set(["Medium", "Hard"]));
    expect(difficultySet(cp001, "ECO-001-QL-007"))
      .toEqual(new Set(["Easy", "Medium"]));
    expect(difficultySet(cp001, "ECO-001-QL-011"))
      .toEqual(new Set(["Medium", "Hard"]));
  });

  it("allows ECO-CP-002 classification QLs to span difficulty bands", () => {
    expect(difficultySet(cp002, "ECO-002-QL-003"))
      .toEqual(new Set(["Easy", "Medium"]));
    expect(difficultySet(cp002, "ECO-002-QL-006"))
      .toEqual(new Set(["Medium", "Hard"]));
    expect(difficultySet(cp002, "ECO-002-QL-009"))
      .toEqual(new Set(["Medium", "Hard"]));
  });

  it("allows ECO-CP-003 aggregate QLs to span difficulty bands", () => {
    expect(difficultySet(cp003, "ECO-003-QL-001"))
      .toEqual(new Set(["Easy", "Medium"]));
    expect(difficultySet(cp003, "ECO-003-QL-003"))
      .toEqual(new Set(["Easy", "Medium"]));
    expect(difficultySet(cp003, "ECO-003-QL-004"))
      .toEqual(new Set(["Medium", "Hard"]));
    expect(difficultySet(cp003, "ECO-003-QL-010"))
      .toEqual(new Set(["Medium", "Hard"]));
  });

  it("does not mark simple arithmetic as Hard by itself", () => {
    expect(difficultySet(cp003, "ECO-003-QL-006")).toEqual(new Set(["Medium"]));
    expect(difficultySet(cp003, "ECO-003-QL-007")).toEqual(new Set(["Medium"]));
    expect(difficultySet(cp003, "ECO-003-QL-008")).toEqual(new Set(["Medium"]));
  });
});
