import assert from "node:assert/strict";

import { auditCom002QuestionBankReadinessCandidateV2 } from "./com002-question-bank-readiness-candidate-v2";

const audit = await auditCom002QuestionBankReadinessCandidateV2();

assert.equal(audit.status, "PREBANK_PROVENANCE_READY_BUT_V4_V3_ACTIVATION_BLOCKED");
assert.equal(audit.auditedQuestionCount, 390);
assert.equal(audit.qlCount, 13);
assert.deepEqual(audit.languages, ["en", "hi", "pa"]);
assert.equal(audit.allCandidatesRejectedByBankGate, true);
assert.equal(audit.downstreamLifecycleLocked, true);
assert.equal(audit.candidateProvenanceComplete, true);
assert.deepEqual(audit.missingCandidateProvenanceFields, []);
assert.equal(audit.contentCandidateVersion, "ENGLISH_V4_LOCALIZATION_V3");
assert.equal(audit.questionBankWritable, false);
assert.equal(audit.productionReleaseAuthorized, false);

console.log("[COM002-PREBANK-READINESS-CANDIDATE-V2] PASS", audit);
