import assert from "node:assert/strict";

import { COM002_QUESTION_STUDIO_ACTIVATION_GATE_V2 } from "./com002-question-studio-activation-gate-v2";
import {
  COM002_REVIEW_CANDIDATE_CONTENT_VERSION_V2,
  COM002_REVIEW_CANDIDATE_PACKAGE_V2,
  generateCom002CandidateBatchForAuditV2,
  generateCom002CandidateQuestionForAuditV2,
  knowledgeV1Com002CandidateAdapterV2,
} from "./knowledge-v1-com002-candidate-adapter-v2";

assert.equal(COM002_REVIEW_CANDIDATE_CONTENT_VERSION_V2, "ENGLISH_V4_LOCALIZATION_V3");
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V2.enabled, false);
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V2.questionBankWritable, false);
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V2.testEligible, false);
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V2.mockTestEligible, false);
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V2.publiclyPublishable, false);
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V2.productionReleaseAuthorized, false);
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V2.metadata?.contentCandidateVersion, "ENGLISH_V4_LOCALIZATION_V3");
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V2.metadata?.englishGeneratorVersion, "COM-002-ENGLISH-GENERATOR-V4-CANDIDATE-1");
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V2.metadata?.localizationVersion, "COM-002-LOCALIZATION-V3-CANDIDATE-1");
assert.equal(COM002_REVIEW_CANDIDATE_PACKAGE_V2.metadata?.activationGateAuthorityId, COM002_QUESTION_STUDIO_ACTIVATION_GATE_V2.authorityId);
assert.deepEqual(knowledgeV1Com002CandidateAdapterV2.listPackages(), []);
await assert.rejects(
  () => knowledgeV1Com002CandidateAdapterV2.generate({ packageId: "COM-002" }),
  new RegExp(COM002_QUESTION_STUDIO_ACTIVATION_GATE_V2.authorityId),
);

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);
const languages = ["en", "hi", "pa"] as const;
let audited = 0;

for (const qlId of qlIds) {
  for (const language of languages) {
    const question = generateCom002CandidateQuestionForAuditV2({
      qlId,
      language,
      seed: `candidate-adapter-v4-v3-audit:${qlId}:${language}`,
    });
    assert.equal(question.packageId, "COM-002");
    assert.equal(question.patternId, qlId);
    assert.equal(question.questionStudioCandidate.candidateOnly, true);
    assert.equal(question.questionStudioCandidate.contentCandidateVersion, "ENGLISH_V4_LOCALIZATION_V3");
    assert.equal(question.questionStudioCandidate.englishGeneratorVersion, "COM-002-ENGLISH-GENERATOR-V4-CANDIDATE-1");
    assert.equal(question.questionStudioCandidate.localizationVersion, "COM-002-LOCALIZATION-V3-CANDIDATE-1");
    assert.equal(question.questionStudioCandidate.activationGateAuthorityId, COM002_QUESTION_STUDIO_ACTIVATION_GATE_V2.authorityId);
    assert.equal(question.questionStudioCandidate.registrationStatus, "BLOCKED_NOT_REGISTERED");
    assert.equal(question.questionStudioCandidate.humanReviewApproved, false);
    assert.equal(question.questionStudioCandidate.reviewRunPersistenceAllowed, false);
    assert.equal(question.questionStudioCandidate.canonicalQuestionPersistenceAllowed, false);
    assert.equal(question.questionStudioCandidate.questionBankWritable, false);
    assert.equal(question.questionStudioCandidate.testEligible, false);
    assert.equal(question.questionStudioCandidate.mockTestEligible, false);
    assert.equal(question.questionStudioCandidate.publiclyPublishable, false);
    assert.equal(question.questionStudioCandidate.automaticStudentPublication, false);
    assert.equal(question.questionStudioCandidate.productionReleaseAuthorized, false);
    assert.equal(question.questionStudioCandidate.productionDifficultyClaimAuthorized, false);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.ok(["Easy", "Medium", "Hard"].includes(question.difficulty));

    if (language === "en") {
      assert.ok(String(question.questionId).endsWith("-V4"));
    } else if (language === "hi") {
      assert.ok(String(question.questionId).includes("-V4-HI"));
      assert.match(question.stem, /[\u0900-\u097F]/u);
      assert.doesNotMatch(`${question.stem}\n${question.explanation}`, /ना के लिए/u);
    } else {
      assert.ok(String(question.questionId).includes("-V4-PA"));
      assert.match(question.stem, /[\u0A00-\u0A7F]/u);
      assert.doesNotMatch(`${question.stem}\n${question.explanation}`, /(?:ਣਾ|ਨਾ) ਲਈ/u);
    }
    audited += 1;
  }
}
assert.equal(audited, 39);

const batch = await generateCom002CandidateBatchForAuditV2({
  packageId: "COM-002",
  language: "en",
  difficulty: "Mixed",
  count: 25,
  seed: "candidate-adapter-v4-v3-batch-audit",
  runtimeMode: "review-only-candidate",
});
assert.equal(batch.questions.length, 25);
assert.equal(batch.generationContext?.candidateOnly, true);
assert.equal(batch.generationContext?.contentCandidateVersion, "ENGLISH_V4_LOCALIZATION_V3");
assert.equal(batch.generationContext?.englishGeneratorVersion, "COM-002-ENGLISH-GENERATOR-V4-CANDIDATE-1");
assert.equal(batch.generationContext?.localizationVersion, "COM-002-LOCALIZATION-V3-CANDIDATE-1");
assert.equal(batch.generationContext?.discoverable, false);
assert.equal(batch.generationContext?.registrationAllowed, false);
assert.equal(batch.generationContext?.questionBankWritable, false);
assert.equal(batch.generationContext?.testEligible, false);
assert.equal(batch.generationContext?.mockTestEligible, false);
assert.equal(batch.generationContext?.publiclyPublishable, false);
assert.equal(batch.generationContext?.productionReleaseAuthorized, false);

console.log(`[COM002-QUESTION-STUDIO-CANDIDATE-V2] PASS questions=${audited + batch.questions.length} content=V4/V3 discoverable=false`);
