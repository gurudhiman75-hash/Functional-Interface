import { describe, expect, it } from "vitest";
import { SCI_CP016_REVIEW_V1, validateSciCp016ReviewV1 } from "./sci-cp016-review-v1";

describe("SCI-CP-016 review candidate V2", () => {
  it("satisfies the structural review contract", () => {
    const result = validateSciCp016ReviewV1();
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
    expect(result.totalQuestions).toBe(60);
    expect(result.difficultyCounts).toEqual({ Easy: 18, Medium: 30, Hard: 12 });
    expect(result.answerPositionCounts).toEqual({ A: 15, B: 15, C: 15, D: 15 });
    expect(new Set(SCI_CP016_REVIEW_V1.map((q) => q.stem)).size).toBe(60);
    for(let ql=1;ql<=10;ql++)expect(result.qlCounts[`SCI-016-QL-${String(ql).padStart(3,"0")}`]).toBe(6);
    expect(SCI_CP016_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered)).toBe(true);
  });

  it("covers the V2 ore and metallurgy gaps explicitly", () => {
    const answers = new Set(SCI_CP016_REVIEW_V1.map((q) => q.canonicalAnswer.toLowerCase()));
    for (const required of ["aluminium","iron","lead","mercury","zinc sulphide","zinc carbonate","gangue","roasting","calcination","flux","slag","anode","cathode"]) {
      expect(answers.has(required)).toBe(true);
    }
    expect(SCI_CP016_REVIEW_V1.some((q) => q.stem.toLowerCase().includes("thermite"))).toBe(true);
    expect(SCI_CP016_REVIEW_V1.some((q) => q.stem.toLowerCase().includes("bauxite"))).toBe(true);
    expect(SCI_CP016_REVIEW_V1.some((q) => q.stem.toLowerCase().includes("haematite"))).toBe(true);
    expect(SCI_CP016_REVIEW_V1.some((q) => q.stem.toLowerCase().includes("galena"))).toBe(true);
    expect(SCI_CP016_REVIEW_V1.some((q) => q.stem.toLowerCase().includes("cinnabar"))).toBe(true);
    expect(SCI_CP016_REVIEW_V1.some((q) => q.stem.toLowerCase().includes("zinc blende"))).toBe(true);
    expect(SCI_CP016_REVIEW_V1.some((q) => q.stem.toLowerCase().includes("calamine"))).toBe(true);
  });

  it("keeps ionic-solubility wording qualified", () => {
    const learnerText = SCI_CP016_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n").toLowerCase();
    expect(learnerText).not.toContain("every ionic compound is completely soluble");
    expect(learnerText).not.toContain("all ionic compounds are soluble");
    expect(learnerText).toContain("solubility is not universal");
  });

  it("uses integrated hard questions instead of a forced statement block", () => {
    const hard = SCI_CP016_REVIEW_V1.filter((q) => q.difficulty === "Hard");
    expect(hard).toHaveLength(12);
    expect(hard.every((q) => !q.stem.startsWith("Consider the statements"))).toBe(true);
    expect(hard.some((q) => q.stem.toLowerCase().includes("extraction"))).toBe(true);
    expect(hard.some((q) => q.stem.toLowerCase().includes("reactivity"))).toBe(true);
  });
});
