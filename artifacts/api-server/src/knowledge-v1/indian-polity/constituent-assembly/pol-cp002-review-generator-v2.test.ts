import { describe, expect, it } from "vitest";
import { generatePolCp002ReviewBatchV2 } from "./pol-cp002-review-generator-v2";

describe("POL-CP-002 review generator V2 stem policy", () => {
  const questions = generatePolCp002ReviewBatchV2();

  it("removes the generic On which date wrapper", () => {
    for (const question of questions) {
      expect(question.stem).not.toMatch(/^On which date did the following occur:/i);
    }
  });

  it("uses direct event-specific stems for QL-001", () => {
    const ql001 = questions.filter((question) => question.qlId === "POL-002-QL-001");
    expect(ql001.map((question) => question.stem)).toEqual([
      "When was Rajendra Prasad elected President of the Constituent Assembly?",
      "When did Jawaharlal Nehru move the Objectives Resolution in the Constituent Assembly?",
      "When did the Constituent Assembly adopt the Objectives Resolution?",
    ]);
  });
});
