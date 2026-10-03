import assert from "node:assert/strict";

import {
  SEA002_CP008_PERMANENT_QL_IDS,
  SEA002_CP008_PERMANENT_QL_REGISTRY,
} from "./permanent/registry.ts";
import { generateSea002Cp008QuestionStudioPreviewV2 } from "./question-studio-preintegration-v2.ts";
import {
  SEA002_CP008_QUESTION_STUDIO_INTEGRATION_V1,
  generateSea002Cp008QuestionStudioQuestionsV1,
} from "./question-studio-integration-v1.ts";
import { SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2 } from "./review/certified-evidence-v2.ts";

assert.equal(SEA002_CP008_QUESTION_STUDIO_INTEGRATION_V1.sourceAuthorityStatus, "FROZEN");
assert.equal(SEA002_CP008_QUESTION_STUDIO_INTEGRATION_V1.enabledForQuestionStudio, true);
assert.equal(SEA002_CP008_QUESTION_STUDIO_INTEGRATION_V1.questionStudioActive, true);
assert.equal(SEA002_CP008_QUESTION_STUDIO_INTEGRATION_V1.questionStudioRegistered, true);
assert.equal(SEA002_CP008_QUESTION_STUDIO_INTEGRATION_V1.canonicalSourceRegistryRemainsInactive, true);
assert.equal(SEA002_CP008_QUESTION_STUDIO_INTEGRATION_V1.questionBankWritable, false);
assert.equal(SEA002_CP008_QUESTION_STUDIO_INTEGRATION_V1.testEligible, false);
assert.equal(SEA002_CP008_QUESTION_STUDIO_INTEGRATION_V1.mockTestEligible, false);
assert.equal(SEA002_CP008_QUESTION_STUDIO_INTEGRATION_V1.productionStaging, false);
assert.equal(SEA002_CP008_QUESTION_STUDIO_INTEGRATION_V1.publiclyPublishable, false);
assert.equal(SEA002_CP008_QUESTION_STUDIO_INTEGRATION_V1.automaticStudentDelivery, false);
assert.equal(SEA002_CP008_PERMANENT_QL_REGISTRY.every((entry) =>
  !entry.active
  && !entry.questionStudioDiscoverable
  && !entry.questionBankWritable
  && !entry.testEligible
  && !entry.mockTestEligible
  && !entry.productionStaging
  && !entry.publiclyPublishable
  && !entry.automaticStudentPublication), true);

let liveSurfaces = 0;
for (const qlId of SEA002_CP008_PERMANENT_QL_IDS) {
  for (const language of ["en", "hi", "pa"] as const) {
    for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
      const request = { questionLanguageId: qlId, language, difficulty, seed: `approved-studio-proof:${qlId}:${language}:${difficulty}`, count: 1 } as const;
      const source = generateSea002Cp008QuestionStudioPreviewV2(request)[0]!;
      const live = generateSea002Cp008QuestionStudioQuestionsV1(request)[0]!;
      assert.equal(live.qlId, qlId);
      assert.equal(live.language, language);
      assert.equal(live.difficulty, difficulty);
      assert.equal(live.setupText, source.setupText);
      assert.equal(live.childStem, source.childStem);
      assert.deepEqual(live.options, source.options);
      assert.equal(live.answer, source.answer);
      assert.equal(live.explanation, source.explanation);
      assert.equal(live.correctIndex, source.correctIndex);
      assert.equal(live.sourceEnglishFingerprint, source.sourceEnglishFingerprint);
      assert.equal(live.localizedFingerprint, source.localizedFingerprint);
      assert.equal(live.runtimeMode, "QUESTION_STUDIO_ACTIVE_APPROVED_FROZEN");
      assert.equal(live.reviewStatus, "APPROVED_FROZEN_V1");
      assert.equal(live.questionStudioDiscoverable, true);
      assert.equal(live.sourceQuestionStudioRegistered, false);
      assert.equal(live.questionStudioRegistered, true);
      assert.equal(live.questionBankWritable, false);
      assert.equal(live.testEligible, false);
      assert.equal(live.mockTestEligible, false);
      assert.equal(live.productionStaging, false);
      assert.equal(live.publiclyPublishable, false);
      assert.equal(live.automaticStudentPublication, false);
      assert.equal(live.traceability.productOwnerApprovalStatus, "APPROVED");
      assert.equal(live.traceability.freezeStatus, "FROZEN");
      assert.equal(live.traceability.certifiedReviewArtifactId, SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.artifactId);
      assert.equal(live.traceability.certifiedReviewArtifactDigest, SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.artifactDigest);
      liveSurfaces += 1;
    }
  }
}

for (const language of ["en", "hi", "pa"] as const) {
  const hardRoleScale = generateSea002Cp008QuestionStudioQuestionsV1({
    questionLanguageId: "SEA-QL-029",
    language,
    difficulty: "Hard",
    seed: `approved-ql029-alt12-role:${language}`,
    count: 2,
  });
  assert.equal(hardRoleScale.length, 2);
  assert.ok(hardRoleScale.every((question) => question.signatureId === "SEA-CP008-SIG-A"));
  assert.ok(hardRoleScale.every((question) => question.authorityId === "CP008-AUTH-01"));
  assert.ok(hardRoleScale.every((question) => [4, 5].includes(question.variantIndex)));
  assert.ok(hardRoleScale.every((question) => !/60\s*(?:m|मीटर|ਮੀਟਰ)|5\s*(?:m|मीटर|ਮੀਟਰ)/u.test(question.setupText)));
  if (language === "en") assert.ok(hardRoleScale.every((question) => /Twelve|twelve/u.test(question.setupText)));
  if (language === "hi") assert.ok(hardRoleScale.every((question) => /बारह व्यक्ति/u.test(question.setupText)));
  if (language === "pa") assert.ok(hardRoleScale.every((question) => /ਬਾਰਾਂ ਵਿਅਕਤੀ/u.test(question.setupText)));
}

const rotated = generateSea002Cp008QuestionStudioQuestionsV1({
  canonicalProblemId: "SEA-CP-008",
  language: "en",
  difficulty: "Medium",
  seed: "approved-all-ql-rotation",
  count: 14,
});
assert.equal(rotated.length, 14);
assert.equal(new Set(rotated.map((question) => question.qlId)).size, 7);

assert.throws(
  () => generateSea002Cp008QuestionStudioQuestionsV1({ topic: "Seating Arrangement", seed: "broad-selector" }),
  /does not explicitly target approved SEA-CP-008/iu,
);

console.log("PASS_SEA002_CP008_QUESTION_STUDIO_INTEGRATION_V1");
console.log("live proof surfaces", liveSurfaces);
console.log("QL coverage", SEA002_CP008_PERMANENT_QL_IDS.length);
console.log("languages", "en,hi,pa");
console.log("difficulties", "Easy,Medium,Hard");
console.log("QL029 ALT12 role-derived live languages", "en,hi,pa");
console.log("broad Seating Arrangement selector intercepted", false);
console.log("source registry active", false);
console.log("Question Studio active/registered", true, true);
console.log("Bank/test/mock/staging/public", false, false, false, false, false);
