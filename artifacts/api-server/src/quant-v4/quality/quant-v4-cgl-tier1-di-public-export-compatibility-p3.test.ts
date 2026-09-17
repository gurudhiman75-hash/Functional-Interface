import assert from "node:assert/strict";

import {
  generateDi001TableSet,
  verifyDi001QuestionSet,
} from "../topics/DataInterpretation/DI-001";
import {
  generateDi002AdvancedTableSet,
  independentlyVerifyDi002QuestionSet,
} from "../topics/DataInterpretation/DI-002";
import {
  generateDi003GroupedBarSet,
  independentlyVerifyDi003QuestionSet,
} from "../topics/DataInterpretation/DI-003";
import {
  generateDi004LineSet,
  independentlyVerifyDi004QuestionSet,
} from "../topics/DataInterpretation/DI-004";
import {
  generateDi005PieSet,
  independentlyVerifyDi005QuestionSet,
} from "../topics/DataInterpretation/DI-005";

const probes = [
  ["DI-001", () => generateDi001TableSet({ seed: "DI-PUBLIC-EXPORT-COMPAT:P3:001", examProfile: "SSC_CGL_TIER_I" }), verifyDi001QuestionSet],
  ["DI-002", () => generateDi002AdvancedTableSet({ seed: "DI-PUBLIC-EXPORT-COMPAT:P3:002", examProfile: "SSC_CGL_TIER_I" }), independentlyVerifyDi002QuestionSet],
  ["DI-003", () => generateDi003GroupedBarSet({ seed: "DI-PUBLIC-EXPORT-COMPAT:P3:003", examProfile: "SSC_CGL_TIER_I" }), independentlyVerifyDi003QuestionSet],
  ["DI-004", () => generateDi004LineSet({ seed: "DI-PUBLIC-EXPORT-COMPAT:P3:004", examProfile: "SSC_CGL_TIER_I" }), independentlyVerifyDi004QuestionSet],
  ["DI-005", () => generateDi005PieSet({ seed: "DI-PUBLIC-EXPORT-COMPAT:P3:005", examProfile: "SSC_CGL_TIER_I" }), independentlyVerifyDi005QuestionSet],
] as const;

for (const [packageId, generate, verify] of probes) {
  const first = generate() as any;
  const second = generate() as any;

  assert.equal(first.packageId, packageId, `${packageId}: public generator must retain package identity.`);
  assert.equal(first.validation?.valid, true, `${packageId}: public generator must retain internal validation.`);
  assert.equal(first.questions?.length, 5, `${packageId}: linked set must still contain five questions.`);
  assert.deepEqual(first, second, `${packageId}: public generator must remain deterministic for a fixed seed.`);
  assert.equal(verify(first as never), true, `${packageId}: legacy independent verifier must remain exported and accept the diversified public set.`);
  assert.equal(first.traceability?.publiclyPublishable, false, `${packageId}: presentation variety must not unlock public publication.`);
  assert.equal(first.traceability?.testEligibility, "INELIGIBLE", `${packageId}: presentation variety must not unlock test eligibility.`);
}

console.log("PASS_QUANT_V4_CGL_TIER1_DI_PUBLIC_EXPORT_COMPATIBILITY_P3");
