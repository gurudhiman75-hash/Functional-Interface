import assert from "node:assert/strict";
import { ENG002_CP012_HUMAN_EDITORIAL_APPROVAL_V1 } from "../chapters/sentence-improvement/ENG-002/CP012/eng-002-cp012-human-approval-v1";
import { languageV1QuestionStudioAdapter } from "../../question-studio/engines/language-v1-adapter";
import { ENG002_CP012_STANDARD_REVIEW_ONLY_PACKAGE_V1 } from "../../question-studio/engines/language-v1-eng002-cp012-adapter-v1";

assert.ok(ENG002_CP012_STANDARD_REVIEW_ONLY_PACKAGE_V1.cpIds?.includes("ENG-002-CP012"));
const metadata = (ENG002_CP012_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata ?? {}) as Record<string, unknown>;
assert.equal(metadata.humanReviewApproved, true);
assert.equal(metadata.reviewOnly, true);
assert.equal(metadata.questionStudioGenerationEnabled, true);
assert.equal(metadata.productionDifficultyClaimsAuthorized, false);

const result = await languageV1QuestionStudioAdapter.generate({
  packageId: "language-v1-eng002",
  patternId: "GR-VNR-010",
  difficulty: "medium",
  language: "en",
  count: 3,
  seed: "eng002-cp012-post-approval-gate",
  runtimeMode: "review-only",
});

assert.equal(result.questions.length, 3);
assert.equal(result.generationContext.cpId, "ENG-002-CP012");
assert.equal(result.generationContext.reviewOnly, true);
assert.equal(result.generationContext.registrationStatus, "REGISTERED_REVIEW_ONLY");
assert.equal(result.generationContext.registrationAuthorityId, ENG002_CP012_HUMAN_EDITORIAL_APPROVAL_V1.authorityId);
assert.equal(result.generationContext.approvedReviewBlobSha, ENG002_CP012_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha);
assert.equal(result.generationContext.approvedGeneratorHeadSha, "df464a97cc3d73949a216f4df3682d476737cf28");

for (const question of result.questions as Record<string, unknown>[]) {
  assert.equal(question.cpId, "ENG-002-CP012");
  assert.equal(question.reviewOnly, true);
  assert.equal(question.readOnly, true);
  assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(question.registrationAuthorityId, ENG002_CP012_HUMAN_EDITORIAL_APPROVAL_V1.authorityId);
  assert.equal(question.questionStudioDiscoverable, true);
  assert.equal(question.questionStudioGenerationEnabled, true);
  assert.equal(question.productionReleased, false);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.automaticStudentPublication, false);
  assert.equal(question.productionReleaseAuthorized, false);
}

await assert.rejects(
  () => languageV1QuestionStudioAdapter.generate({
    packageId: "language-v1-eng002",
    patternId: "ENG-002-CP012",
    difficulty: "medium",
    language: "en",
    count: 1,
    seed: "eng002-cp012-production-denial",
    runtimeMode: "production",
  }),
  /only supports review-only runtime/,
);

console.log("ENG-002 CP012 Question Studio post-approval lifecycle gate passed.");
