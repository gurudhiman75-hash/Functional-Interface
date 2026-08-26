import assert from "node:assert/strict";

import { SEA002_CP008_PERMANENT_QL_IDS } from "./permanent/registry.ts";
import {
  activateSea002Cp008QuestionStudioV2,
  generateSea002Cp008QuestionStudioPreviewV2,
} from "./question-studio-preintegration-v2.ts";

let previewSurfaces = 0;
for (const qlId of SEA002_CP008_PERMANENT_QL_IDS) {
  for (const language of ["en", "hi", "pa"] as const) {
    for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
      const request = { questionLanguageId: qlId, language, difficulty, seed: `v2-studio-proof:${qlId}:${language}:${difficulty}`, count: 1 } as const;
      const first = generateSea002Cp008QuestionStudioPreviewV2(request);
      const second = generateSea002Cp008QuestionStudioPreviewV2(request);
      assert.deepEqual(second, first);
      assert.equal(first.length, 1);
      const question = first[0]!;
      assert.equal(question.qlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.difficulty, difficulty);
      assert.equal(question.runtimeMode, "QUESTION_STUDIO_BLOCKED_PENDING_APPROVAL");
      assert.equal(question.reviewStatus, "PREFREEZE_V2_REVIEW_AUTHORITY");
      assert.equal(question.questionStudioDiscoverable, false);
      assert.equal(question.sourceQuestionStudioRegistered, false);
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.productionStaging, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.automaticStudentPublication, false);
      assert.equal(question.options.length, 4);
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.equal(question.validation.ok, true);
      assert.equal(question.traceability.productOwnerApprovalStatus, "PENDING");
      assert.equal(question.traceability.freezeStatus, "NOT_FROZEN");
      assert.equal(question.traceability.englishReviewFingerprint.length, 64);
      assert.equal(question.traceability.localizationReviewFingerprint.length, 64);
      previewSurfaces += 1;
    }
  }
}

const rotated = generateSea002Cp008QuestionStudioPreviewV2({
  canonicalProblemId: "SEA-CP-008",
  language: "en",
  difficulty: "Medium",
  seed: "v2-all-ql-rotation",
  count: 14,
});
assert.equal(rotated.length, 14);
assert.equal(new Set(rotated.map((question) => question.qlId)).size, 7);
assert.equal(new Set(rotated.map((question) => `${question.setupText}\n${question.childStem}\n${question.options.join("|")}`)).size, 14);

assert.throws(
  () => generateSea002Cp008QuestionStudioPreviewV2({ topic: "Seating Arrangement", seed: "broad-selector" }),
  /does not explicitly target SEA-CP-008 V2/iu,
);
assert.throws(() => activateSea002Cp008QuestionStudioV2(), /blocked until explicit human approval and freeze/iu);

console.log("PASS_SEA002_CP008_QUESTION_STUDIO_PREINTEGRATION_V2");
console.log("preview surfaces", previewSurfaces);
console.log("QL coverage", SEA002_CP008_PERMANENT_QL_IDS.length);
console.log("languages", "en,hi,pa");
console.log("difficulties", "Easy,Medium,Hard");
console.log("broad Seating Arrangement selector intercepted", false);
console.log("Studio discoverable/registered", false, false);
console.log("Bank/test/mock/staging/public", false, false, false, false, false);
console.log("activation blocked", true);
