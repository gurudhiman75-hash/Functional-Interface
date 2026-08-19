import { strict as assert } from "node:assert";

import {
  SEA_EXAM_REALNESS_EVIDENCE,
  summarizeSeaExamRealnessEvidence,
} from "./realness/exam-evidence.ts";

assert(SEA_EXAM_REALNESS_EVIDENCE.length >= 17);
assert.equal(new Set(SEA_EXAM_REALNESS_EVIDENCE.map((record) => record.id)).size, SEA_EXAM_REALNESS_EVIDENCE.length);
for (const record of SEA_EXAM_REALNESS_EVIDENCE) {
  assert(/^https:\/\//.test(record.sourceUrl), `${record.id}: missing public evidence URL`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(record.examDate), `${record.id}: invalid exam date`);
  assert(record.observedQueryFeatures.length > 0, `${record.id}: no observed query features`);
  if (record.exactQuestionsInSet !== null) assert(record.exactQuestionsInSet > 0, `${record.id}: invalid exact set size`);
  if (record.observedQuestionsRange !== null) {
    assert(record.observedQuestionsRange[0] > 0);
    assert(record.observedQuestionsRange[1] >= record.observedQuestionsRange[0]);
  }
}

const summary = summarizeSeaExamRealnessEvidence();
assert.equal(summary.weightingPolicy, "OBSERVED_COUNTS_ONLY_DO_NOT_CONVERT_TO_PRODUCT_PERCENTAGES_YET");

assert.equal(summary.BANKING.completenessStatus, "REQUIRES_SEA002_AND_SEA003");
assert(summary.BANKING.packagesObserved.includes("SEA-001"));
assert(summary.BANKING.packagesObserved.includes("SEA-002"));
assert(summary.BANKING.packagesObserved.includes("SEA-003"));
assert.equal(summary.BANKING.exactSetSizesObserved["5"], 9);
assert.equal(summary.BANKING.productWeightFreezeReady, false);

assert.equal(summary.SSC.completenessStatus, "REQUIRES_SEA002");
assert(summary.SSC.packagesObserved.includes("SEA-002"));
assert.equal(summary.SSC.productWeightFreezeReady, false);

assert.equal(summary.PUNJAB_STATE.completenessStatus, "SOURCE_BASE_TOO_NARROW");
assert.equal(summary.PUNJAB_STATE.packagesObserved.length, 1);
assert.equal(summary.PUNJAB_STATE.packagesObserved[0], "SEA-001");
assert.equal(summary.PUNJAB_STATE.productWeightFreezeReady, false);

console.log("PASS_SEA_001_EXAM_PROFILE_EVIDENCE");
console.log("records", SEA_EXAM_REALNESS_EVIDENCE.length);
console.log("SSC", JSON.stringify(summary.SSC));
console.log("BANKING", JSON.stringify(summary.BANKING));
console.log("PUNJAB_STATE", JSON.stringify(summary.PUNJAB_STATE));
console.log("weighting policy", summary.weightingPolicy);
