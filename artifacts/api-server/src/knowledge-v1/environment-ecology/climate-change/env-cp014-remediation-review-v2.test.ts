import { describe, expect, it } from "vitest";
import { ENV_CP014_REMEDIATION_FACT_BY_ID_V2 } from "./env-cp014-remediation-facts-v2";
import { ENV_CP014_REMEDIATION_REVIEW_V2 } from "./env-cp014-remediation-review-v2";

describe("ENV-CP-014 exhaustive remediation V2", () => {
  it("adds 12 NAPCC questions across 3 QLs", () => {
    expect(ENV_CP014_REMEDIATION_REVIEW_V2).toHaveLength(12);
    expect(new Set(ENV_CP014_REMEDIATION_REVIEW_V2.map((q) => q.qlId)).size).toBe(3);
  });

  it("uses all answer positions and valid provenance", () => {
    for (const qlId of new Set(ENV_CP014_REMEDIATION_REVIEW_V2.map((q) => q.qlId))) {
      const group=ENV_CP014_REMEDIATION_REVIEW_V2.filter((q)=>q.qlId===qlId);
      expect(new Set(group.map((q)=>q.correctIndex))).toEqual(new Set([0,1,2,3]));
    }
    for (const q of ENV_CP014_REMEDIATION_REVIEW_V2) {
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      for (const id of q.sourceFactIds) expect(ENV_CP014_REMEDIATION_FACT_BY_ID_V2.get(id)).toBeTruthy();
    }
  });
});
