import { describe, expect, it } from "vitest";
import { ENV_CP002_REMEDIATION_REVIEW_V2 } from "./ecosystem-structure/env-cp002-remediation-review-v2";
import { ENV_CP008_REMEDIATION_REVIEW_V2 } from "./species-conservation/env-cp008-remediation-review-v2";
import { ENV_CP014_REMEDIATION_REVIEW_V2 } from "./climate-change/env-cp014-remediation-review-v2";
import { ENV_CP015_REMEDIATION_REVIEW_V2 } from "./environmental-laws/env-cp015-remediation-review-v2";
import { ENV_CP016_REMEDIATION_REVIEW_V2 } from "./indian-environmental-institutions/env-cp016-remediation-review-v2";
import { ENV_CP020_REVIEW_V2 } from "./integrated-environment-gk/env-cp020-review-generator-v2";

const extensions = [
  ENV_CP002_REMEDIATION_REVIEW_V2,
  ENV_CP008_REMEDIATION_REVIEW_V2,
  ENV_CP014_REMEDIATION_REVIEW_V2,
  ENV_CP015_REMEDIATION_REVIEW_V2,
  ENV_CP016_REMEDIATION_REVIEW_V2,
];

describe("ENV-001 exhaustive V2 remediation", () => {
  it("adds exactly 60 owner-level remediation questions", () => {
    expect(extensions.flat()).toHaveLength(60);
    for (const group of extensions) expect(group).toHaveLength(12);
  });

  it("has no duplicate stem-answer signature inside the remediation surface", () => {
    const signatures=extensions.flat().map((q)=>`${q.stem.toLowerCase()}::${q.canonicalAnswer.toLowerCase()}`);
    expect(new Set(signatures).size).toBe(signatures.length);
  });

  it("keeps the full remediation learner surface free of banned filler", () => {
    const text=[
      ...extensions.flat().map((q)=>`${q.stem} ${q.explanation}`),
      ...ENV_CP020_REVIEW_V2.map((q)=>`${q.stem} ${q.explanation}`),
    ].join(" ").toLowerCase();
    expect(text).not.toContain("associated with");
    expect(text).not.toMatch(/option\s+[abcd]/);
  });

  it("retains the 48-question CP020 capstone", () => {
    expect(ENV_CP020_REVIEW_V2).toHaveLength(48);
  });

  it("contains all five audit-remediation domains", () => {
    const text=extensions.flat().map((q)=>`${q.qlName} ${q.stem} ${q.options.join(" ")}`).join(" ").toLowerCase();
    for (const required of ["succession","project elephant","napcc","environmental impact assessment","chipko","appiko","silent valley","khejarli"]) {
      expect(text).toContain(required);
    }
  });
});
