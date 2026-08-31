import { strict as assert } from "node:assert";
import {
  auditCom002CandidateCorpusExtension,
  COM002_CANDIDATE_FACT_EXTENSION,
} from "./com002-candidate-corpus-extension";

const audit = auditCom002CandidateCorpusExtension();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.factCount, 13);
assert.equal(audit.productionEligible, false);
assert.equal(COM002_CANDIDATE_FACT_EXTENSION.every((fact) => fact.review.status === "REVIEW_REQUIRED"), true);
assert.equal(COM002_CANDIDATE_FACT_EXTENSION.filter((fact) => fact.relation === "os_type_property").length, 4);
assert.equal(COM002_CANDIDATE_FACT_EXTENSION.some((fact) => fact.factId === "com002-recycle-bin-restore"), true);
assert.equal(COM002_CANDIDATE_FACT_EXTENSION.some((fact) => fact.factId === "com002-restart-reboot"), true);
assert.equal(COM002_CANDIDATE_FACT_EXTENSION.some((fact) => fact.factId === "com002-shutdown-turn-off"), true);

console.log(`[com002-candidate-corpus-extension] PASS facts=${audit.factCount}`);
