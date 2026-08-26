import { strict as assert } from "node:assert";
import { auditCom002CandidateCorpus, COM002_CANDIDATE_FACTS } from "./com002-candidate-corpus";

const audit = auditCom002CandidateCorpus();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.factCount, 56);
assert.equal(audit.reviewStatus, "REVIEW_REQUIRED");
assert.equal(audit.productionEligible, false);
assert.equal(audit.cpCounts["COM-002-CP-001"] >= 20, true);
assert.equal(audit.cpCounts["COM-002-CP-002"] >= 25, true);
assert.equal(COM002_CANDIDATE_FACTS.every((fact) => fact.review.status === "REVIEW_REQUIRED"), true);
assert.equal(COM002_CANDIDATE_FACTS.every((fact) => !fact.review.reviewedAt && !fact.review.reviewedBy), true);

console.log(`[com002-candidate-corpus] PASS facts=${audit.factCount} cp001=${audit.cpCounts["COM-002-CP-001"]} cp002=${audit.cpCounts["COM-002-CP-002"]}`);
