import { describe, expect, it } from "vitest";
import { generatePolCp026ReviewBatchV1 } from "./pol-cp026-review-candidate-v1";
import { generatePolCp026ReviewBatchV3 } from "./pol-cp026-review-candidate-v3";

describe("POL-CP-026 final-audit ownership V3", () => {
  const before=generatePolCp026ReviewBatchV1();
  const after=generatePolCp026ReviewBatchV3();

  it("preserves the frozen batch shape and correct positions",()=>{
    expect(after).toHaveLength(80);
    after.forEach((q,i)=>{
      expect(q.correctIndex).toBe(before[i].correctIndex);
      expect(q.qlId).toBe(before[i].qlId);
      expect(q.difficulty).toBe(before[i].difficulty);
      expect(q.sourceIds).toEqual(before[i].sourceIds);
    });
  });

  it("changes only QL013",()=>{
    after.forEach((q,i)=>{
      if(i>=48 && i<=51) return;
      expect(q.stem).toBe(before[i].stem);
      expect(q.options).toEqual(before[i].options);
      expect(q.explanation).toBe(before[i].explanation);
    });
  });

  it("removes direct Public Service Commission testing from QL013",()=>{
    const ql=after.slice(48,52);
    const answers=ql.map(q=>q.options[q.correctIndex]).join("\n");
    expect(answers).not.toMatch(/Public Service Commission|Article 315/i);
    expect(ql.every(q=>q.qlId==="POL-026-QL-013")).toBe(true);
  });
});
