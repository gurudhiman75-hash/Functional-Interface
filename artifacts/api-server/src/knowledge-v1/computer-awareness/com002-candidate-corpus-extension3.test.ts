import { strict as assert } from "node:assert";
import { auditCom002CandidateCorpusExtension3, COM002_CANDIDATE_FACT_EXTENSION3 } from "./com002-candidate-corpus-extension3";

const audit = auditCom002CandidateCorpusExtension3();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.factCount, 11);
assert.equal(audit.productionEligible, false);
for (const factId of [
  "com002-linux-classification",
  "com002-macos-classification",
  "com002-multi-user-os-property",
  "com002-multitasking-os-property",
  "com002-single-tasking-os-property",
  "com002-time-sharing-os-property",
]) {
  assert.equal(COM002_CANDIDATE_FACT_EXTENSION3.some((fact) => fact.factId === factId), true, `Missing ${factId}`);
}
console.log(`[com002-candidate-corpus-extension3] PASS facts=${audit.factCount}`);
