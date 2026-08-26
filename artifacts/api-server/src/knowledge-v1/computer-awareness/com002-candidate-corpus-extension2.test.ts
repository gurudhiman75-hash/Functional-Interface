import { strict as assert } from "node:assert";
import {
  auditCom002CandidateCorpusExtension2,
  COM002_CANDIDATE_FACT_EXTENSION2,
} from "./com002-candidate-corpus-extension2";

const audit = auditCom002CandidateCorpusExtension2();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.factCount, 5);
assert.equal(audit.productionEligible, false);
assert.equal(COM002_CANDIDATE_FACT_EXTENSION2.filter((fact) => fact.relation === "component_role").length, 3);
assert.equal(COM002_CANDIDATE_FACT_EXTENSION2.filter((fact) => fact.relation === "system_start_stop_meaning").length, 2);

console.log(`[com002-candidate-corpus-extension2] PASS facts=${audit.factCount}`);
