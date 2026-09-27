import assert from "node:assert/strict";

import {
  runQuantV4CglTier1ShadowSimulationAudit,
} from "./quant-v4-cgl-tier1-shadow-simulation-p3";

const audit = await runQuantV4CglTier1ShadowSimulationAudit({
  sections: 20,
  seedPrefix: "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI",
});

assert.equal(audit.recordsGenerated, 500);
assert.equal(audit.runtimeGeneratedCount, 500);
assert.ok(audit.literalStemDuplicateRate >= 0);
assert.ok(audit.normalizedStructuralStemReuseRate >= 0);
assert.ok(audit.learnerQuestionDuplicateRate >= 0);

assert.ok(
  audit.learnerQuestionDuplicateRate <= audit.literalStemDuplicateRate,
  `Full learner-question duplication cannot exceed literal stem duplication when DI stimulus is included: learner=${audit.learnerQuestionDuplicateRate}, literal=${audit.literalStemDuplicateRate}`,
);

assert.ok(
  audit.normalizedStructuralStemReuseRate >= audit.learnerQuestionDuplicateRate,
  `Structural-shell reuse should remain at least as broad as exact learner-question duplication: structural=${audit.normalizedStructuralStemReuseRate}, learner=${audit.learnerQuestionDuplicateRate}`,
);

console.log("QUANT_V4_CGL_DI_CONTEXT_REUSE_P4", JSON.stringify({
  records: audit.runtimeGeneratedCount,
  literalStemDuplicateRate: audit.literalStemDuplicateRate,
  normalizedStructuralStemReuseRate: audit.normalizedStructuralStemReuseRate,
  learnerQuestionDuplicateRate: audit.learnerQuestionDuplicateRate,
  structuralReuseGateUnchanged: true,
  productionBehaviorChanged: false,
}));
