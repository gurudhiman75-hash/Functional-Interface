import { describe, expect, it } from "vitest";
import { ENV_CP002_REMEDIATION_FACT_BY_ID_V2 } from "../ecosystem-structure/env-cp002-remediation-facts-v2";
import { ENV_CP008_REMEDIATION_FACT_BY_ID_V2 } from "../species-conservation/env-cp008-remediation-facts-v2";
import { ENV_CP014_REMEDIATION_FACT_BY_ID_V2 } from "../climate-change/env-cp014-remediation-facts-v2";
import { ENV_CP015_REMEDIATION_FACT_BY_ID_V2 } from "../environmental-laws/env-cp015-remediation-facts-v2";
import { ENV_CP016_REMEDIATION_FACT_BY_ID_V2 } from "../indian-environmental-institutions/env-cp016-remediation-facts-v2";
import { ENV_CP020_FACT_BY_ID_V1 } from "./env-cp020-facts";
import { ENV_CP020_REVIEW_V2 } from "./env-cp020-review-generator-v2";

const remediationFacts = new Map([
  ...ENV_CP002_REMEDIATION_FACT_BY_ID_V2,
  ...ENV_CP008_REMEDIATION_FACT_BY_ID_V2,
  ...ENV_CP014_REMEDIATION_FACT_BY_ID_V2,
  ...ENV_CP015_REMEDIATION_FACT_BY_ID_V2,
  ...ENV_CP016_REMEDIATION_FACT_BY_ID_V2,
]);

describe("ENV-CP-020 integrated review V2", () => {
  it("preserves 48 questions across 12 QLs", () => {
    expect(ENV_CP020_REVIEW_V2).toHaveLength(48);
    expect(new Set(ENV_CP020_REVIEW_V2.map((q) => q.qlId)).size).toBe(12);
  });

  it("preserves four questions and all answer positions per QL", () => {
    for (const qlId of new Set(ENV_CP020_REVIEW_V2.map((q) => q.qlId))) {
      const group=ENV_CP020_REVIEW_V2.filter((q)=>q.qlId===qlId);
      expect(group).toHaveLength(4);
      expect(new Set(group.map((q)=>q.correctIndex))).toEqual(new Set([0,1,2,3]));
    }
  });

  it("keeps learner-facing wording clean", () => {
    for (const q of ENV_CP020_REVIEW_V2) {
      const text=`${q.stem} ${q.explanation}`.toLowerCase();
      expect(text).not.toContain("associated with");
      expect(text).not.toMatch(/option\s+[abcd]/);
      expect(q.stem.length).toBeLessThanOrEqual(155);
      expect(q.explanation.length).toBeLessThanOrEqual(240);
    }
  });

  it("keeps provenance valid across frozen and remediation facts", () => {
    for (const q of ENV_CP020_REVIEW_V2) {
      expect(new Set(q.options).size).toBe(4);
      for (const id of q.sourceFactIds) {
        expect(ENV_CP020_FACT_BY_ID_V1[id] || remediationFacts.get(id)).toBeTruthy();
      }
    }
  });

  it("integrates every remediation owner in the final capstone block", () => {
    const ql12=ENV_CP020_REVIEW_V2.filter((q)=>q.qlId==="ENV-020-QL-012");
    const represented=new Set(ql12.flatMap((q)=>q.sourceCpIds));
    for (const cp of ["ENV-CP-002","ENV-CP-008","ENV-CP-014","ENV-CP-015","ENV-CP-016"]) {
      expect(represented.has(cp)).toBe(true);
    }
  });
});
