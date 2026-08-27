import assert from "node:assert/strict";

import { COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1 } from "./com002-question-studio-activation-gate-v1";
import {
  COM002_REVIEW_CANDIDATE_PACKAGE_V1,
  generateCom002CandidateBatchForAuditV1,
  generateCom002CandidateQuestionForAuditV1,
  knowledgeV1Com002CandidateAdapter,
} from "./knowledge-v1-com002-candidate-adapter";

assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V1.enabled, false);
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V1.questionBankWritable, false);
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V1.testEligible, false);
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V1.mockTestEligible, false);
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V1.publiclyPublishable, false);
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V1.productionReleaseAuthorized, false);
assert.deepEqual(knowledgeV1Com002CandidateAdapter.listPackages(), []);
await assert.rejects(
  () => knowledgeV1Com002CandidateAdapter.generate({ packageId: "COM-002" }),
  new RegExp(COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1.authorityId),
);

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);
const languages = ["en", "hi", "pa"] as const;
let audited = 0;

for (const qlId of qlIds) {
  for (const language of languages) {
    const question = generateCom002CandidateQuestionForAuditV1({
      qlId,
      language,
      seed: `candidate-adapter-audit:${qlId}:${language}`,
    });
    assert.equal(question.packageId, "COM-002");
    assert.equal(question.patternId, qlId);
    assert.equal(question.questionStudioCandidate.candidateOnly, true);
    assert.equal(question.questionStudioCandidate.registrationStatus, "BLOCKED_NOT_REGISTERED");
    assert.equal(question.questionStudioCandidate.reviewRunPersistenceAllowed, false);
    assert.equal(question.questionStudioCandidate.canonicalQuestionPersistenceAllowed, false);
    assert.equal(question.questionStudioCandidate.questionBankWritable, false);
    assert.equal(question.questionStudioCandidate.testEligible, false);
    assert.equal(question.questionStudioCandidate.mockTestEligible, false);
    assert.equal(question.questionStudioCandidate.publiclyPublishable, false);
    assert.equal(question.questionStudioCandidate.productionReleaseAuthorized, false);
    assert.equal(question.questionStudioCandidate.productionDifficultyClaimAuthorized, false);
    assert.equal(question.options.length, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.ok(["Easy", "Medium", "Hard"].includes(question.difficulty));
    if (language === "hi") assert.match(question.stem, /[\u0900-\u097F]/u);
    if (language === "pa") assert.match(question.stem, /[\u0A00-\u0A7F]/u);
    audited += 1;
  }
}
assert.equal(audited, 39);

const batch = await generateCom002CandidateBatchForAuditV1({
  packageId: "COM-002",
  language: "en",
  difficulty: "Mixed",
  count: 25,
  seed: "candidate-adapter-batch-audit",
  runtimeMode: "review-only-candidate",
});
assert.equal(batch.questions.length, 25);
assert.equal(batch.generationContext?.candidateOnly, true);
assert.equal(batch.generationContext?.discoverable, false);
assert.equal(batch.generationContext?.registrationAllowed, false);
assert.equal(batch.generationContext?.questionBankWritable, false);
assert.equal(batch.generationContext?.testEligible, false);
assert.equal(batch.generationContext?.mockTestEligible, false);
assert.equal(batch.generationContext?.publiclyPublishable, false);
assert.equal(batch.generationContext?.productionReleaseAuthorized, false);

console.log(`[COM002-QUESTION-STUDIO-CANDIDATE] PASS questions=${audited + batch.questions.length} discoverable=false`);
