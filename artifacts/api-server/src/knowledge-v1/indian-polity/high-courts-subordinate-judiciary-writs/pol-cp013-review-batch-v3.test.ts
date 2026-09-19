import { describe, expect, it } from "vitest";
import { generatePolCp013ReviewBatchV2 } from "./pol-cp013-review-generator-v2";
import { generatePolCp013ReviewBatchV3 } from "./pol-cp013-review-generator-v3";

describe("POL-CP-013 final-audit writ ownership V3",()=>{
  const before=generatePolCp013ReviewBatchV2();
  const after=generatePolCp013ReviewBatchV3();
  const changed=new Set([32,33,34,35,36,37,38,39,73,74]);

  it("preserves all answer semantics",()=>{
    expect(after).toHaveLength(before.length);
    after.forEach((q,i)=>{
      expect(q.options).toEqual(before[i].options);
      expect(q.correctIndex).toBe(before[i].correctIndex);
      expect(q.canonicalAnswer).toBe(before[i].canonicalAnswer);
      expect(q.qlId).toBe(before[i].qlId);
      expect(q.difficulty).toBe(before[i].difficulty);
      expect(q.sourceIds).toEqual(before[i].sourceIds);
      expect(q.sourceFactIds).toEqual(before[i].sourceFactIds);
    });
  });

  it("changes only writ items that previously read as generic CP004-style questions",()=>{
    after.forEach((q,i)=>{
      if(changed.has(i)) return;
      expect(q.stem).toBe(before[i].stem);
      expect(q.explanation).toBe(before[i].explanation);
    });
  });

  it("anchors every remediated writ question to High Court Article 226 context",()=>{
    for(const i of changed){
      const q=after[i];
      expect(q.stem).toMatch(/Article 226|High Court|High Court writ jurisdiction/i);
    }
  });
});
