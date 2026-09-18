import { describe, expect, it } from "vitest";
import { ENV_CP002_REMEDIATION_FACT_BY_ID_V2 } from "./env-cp002-remediation-facts-v2";
import { ENV_CP002_REMEDIATION_REVIEW_V2 } from "./env-cp002-remediation-review-v2";

describe("ENV-CP-002 exhaustive remediation V2", () => {
  it("adds 12 succession questions across 3 QLs", () => {
    expect(ENV_CP002_REMEDIATION_REVIEW_V2).toHaveLength(12);
    expect(new Set(ENV_CP002_REMEDIATION_REVIEW_V2.map((q) => q.qlId)).size).toBe(3);
  });

  it("uses all four answer positions inside every remediation QL", () => {
    for (const qlId of new Set(ENV_CP002_REMEDIATION_REVIEW_V2.map((q) => q.qlId))) {
      const group = ENV_CP002_REMEDIATION_REVIEW_V2.filter((q) => q.qlId === qlId);
      expect(group).toHaveLength(4);
      expect(new Set(group.map((q) => q.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    }
  });

  it("keeps options, answers and provenance valid", () => {
    for (const q of ENV_CP002_REMEDIATION_REVIEW_V2) {
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      expect(q.sourceIds.length).toBeGreaterThan(0);
      for (const id of q.sourceFactIds) expect(ENV_CP002_REMEDIATION_FACT_BY_ID_V2.get(id)).toBeTruthy();
    }
  });
});
