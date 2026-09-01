import { strict as assert } from "node:assert";

import { auditCom003QuestionBankReadinessCandidateV1 } from "./com003-question-bank-readiness-candidate-v1.ts";

const audit = auditCom003QuestionBankReadinessCandidateV1();

assert.equal(audit.status, "REVIEW_RUN_PERSISTENCE_READY_BANK_ONLY_BLOCKED_DIFFICULTY");
assert.equal(audit.auditedQuestionCount, 684);
assert.equal(audit.expectedQuestionCount, 684);
assert.equal(audit.qlCount, 19);
assert.deepEqual(audit.languages, ["en", "hi", "pa"]);
assert.equal(audit.uniqueArtifactIds, true);
assert.equal(audit.frozenCorpusIntegrityProven, true);
assert.equal(audit.currentBankGateClosed, true);
assert.equal(audit.downstreamLifecycleLocked, true);
assert.equal(audit.candidateProvenanceComplete, true);
assert.equal(audit.semanticNormalizationProven, true);
assert.equal(audit.standardBankOnlyOverlayEligible, true);
assert.equal(audit.explicitDifficultyPresent, false);
assert.equal(audit.auditedDifficultyAuthorityPresent, false);
assert.equal(audit.reviewRunPersistenceReady, true);
assert.equal(audit.bankOnlyActivationReady, false);
assert.equal(audit.questionBankWritable, false);
assert.equal(audit.testEligible, false);
assert.equal(audit.productionReleaseAuthorized, false);
assert(audit.missingBankPrerequisites.includes("explicitQuestionDifficulty"));
assert(audit.missingBankPrerequisites.includes("auditedDifficultyClassifierAuthority"));
assert(audit.missingBankPrerequisites.includes("standardLifecycleRegistrationAuthority"));
assert(audit.missingBankPrerequisites.includes("reviewRunPersistenceActivationAuthority"));

console.log("[COM003-QUESTION-BANK-READINESS-CANDIDATE-V1]", audit);
