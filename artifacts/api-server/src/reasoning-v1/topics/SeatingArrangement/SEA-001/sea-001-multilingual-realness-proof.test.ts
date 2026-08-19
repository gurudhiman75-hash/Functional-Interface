import { strict as assert } from "node:assert";

import { auditSea001DynamicMultilingualTemplates } from "./realness/multilingual-template-audit.ts";

const audit = auditSea001DynamicMultilingualTemplates(4);

assert.equal(audit.methodology, "DYNAMIC_STUDIO_TEMPLATE_MASKING_V1");
assert.equal(audit.thresholdStatus, "UNSET_PENDING_MEASUREMENT_AND_HUMAN_SPOT_REVIEW");

for (const locale of [audit.Hindi, audit.Punjabi]) {
  assert.equal(locale.questionCount, 80);
  assert.equal(locale.qlCoverage, 20);
  assert.equal(locale.caseletCoverage, 80);
  assert.equal(locale.latinResidueCount, 0);
  assert(locale.setupTemplates.total > 0);
  assert(locale.questionTemplates.total > 0);
  assert(locale.clueTemplates.total > 0);
  assert(locale.explanationStepTemplates.total > 0);
  assert(locale.optionRationaleTemplates.total > 0);
  assert(locale.setupTemplates.unique <= locale.setupTemplates.total);
  assert(locale.questionTemplates.unique <= locale.questionTemplates.total);
}

console.log("PASS_SEA_001_MULTILINGUAL_REALNESS_MEASUREMENT");
console.log("methodology", audit.methodology);
console.log("thresholds", audit.thresholdStatus);
console.log("Hindi", JSON.stringify(audit.Hindi));
console.log("Punjabi", JSON.stringify(audit.Punjabi));
