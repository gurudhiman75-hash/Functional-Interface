import { describe, expect, it } from "vitest";
import { SCI_CP016_REVIEW_V1, validateSciCp016ReviewV1 } from "./sci-cp016-review-v1";

describe("SCI-CP-016 exhaustive V2 review",()=>{
  const result=validateSciCp016ReviewV1();
  it("meets structural contract",()=>{
    expect(result.valid).toBe(true);
    expect(result.totalQuestions).toBe(60);
    expect(result.difficultyCounts).toEqual({Easy:18,Medium:30,Hard:12});
    expect(result.answerPositionCounts).toEqual({A:15,B:15,C:15,D:15});
    for(let ql=1;ql<=10;ql++)expect(result.qlCounts[`SCI-016-QL-${String(ql).padStart(3,"0")}`]).toBe(6);
  });
  it("covers metallurgy gaps and precision fixes",()=>{
    const text=SCI_CP016_REVIEW_V1.map(q=>`${q.stem} ${q.explanation}`).join(" ");
    expect(text).toContain("bauxite");
    expect(text).toContain("haematite");
    expect(text).toContain("magnetite");
    expect(text).toContain("zinc blende");
    expect(text).toContain("calamine");
    expect(text).toContain("galena");
    expect(text).toContain("cinnabar");
    expect(text).toContain("gangue");
    expect(text).toContain("flux");
    expect(text).toContain("slag");
    expect(text).toContain("thermite");
    expect(text).toContain("basic copper carbonate");
    expect(text).toContain("Many ionic compounds");
    expect(SCI_CP016_REVIEW_V1.every(q=>q.reviewOnly&&!q.runtimeRegistered)).toBe(true);
  });
});
