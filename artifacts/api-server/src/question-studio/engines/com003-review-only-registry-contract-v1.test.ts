import { strict as assert } from "node:assert";

import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
} from "../engine-registry";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 as lifecycle } from "../standard-lifecycle";
import { COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1 } from "./com003-review-only-activation-authority-v1";

const packages = listQuestionStudioPackages();
const matches = packages.filter((pkg) => pkg.packageId === "COM-003");
assert.equal(matches.length, 1, "COM-003 must appear exactly once in the global Question Studio registry");
const pkg = matches[0]!;
assert.equal(pkg.engineId, "knowledge-v1");
assert.equal(pkg.enabled, true);
assert.equal(pkg.lifecycleId, lifecycle.lifecycleId);
assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
assert.equal(pkg.runtimeMode, "review-only");
assert.equal(pkg.difficultyFilterSupported, false);
assert.deepEqual(pkg.supportedDifficulties, []);
assert.equal(pkg.questionBankStatus, "NOT_STORED");
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.equal(pkg.metadata?.registrationAuthorityId, COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1.authorityId);

const first = await generateQuestionStudioQuestions({
  engineId: "knowledge-v1",
  packageId: "COM-003",
  exam: "SSC CGL",
  subject: "Computer Awareness",
  topic: "Computer Awareness",
  subtopic: "Office & Productivity Software",
  language: "en",
  count: 10,
  seed: "com003-registry-contract-v1",
  runtimeMode: "review-only",
});
const replay = await generateQuestionStudioQuestions({
  engineId: "knowledge-v1",
  packageId: "COM-003",
  exam: "SSC CGL",
  subject: "Computer Awareness",
  topic: "Computer Awareness",
  subtopic: "Office & Productivity Software",
  language: "en",
  count: 10,
  seed: "com003-registry-contract-v1",
  runtimeMode: "review-only",
});
assert.deepEqual(first, replay);
assert.equal(first.engineId, "knowledge-v1");
assert.equal(first.questions.length, 10);
assert.equal(first.generationContext?.lifecycleId, lifecycle.lifecycleId);
assert.equal(first.generationContext?.reviewRunPersistenceAllowed, true);
assert.equal(first.generationContext?.canonicalQuestionPersistenceAllowed, false);
assert.equal(first.generationContext?.questionBankWritable, false);
assert.equal(first.generationContext?.testEligible, false);
assert.equal(first.generationContext?.publiclyPublishable, false);
assert.equal(first.generationContext?.productionReleaseAuthorized, false);
assert.equal(first.generationContext?.difficultyFilterApplied, false);
assert.equal(first.generationContext?.difficultyClassifierVersion, null);

for (const question of first.questions) {
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.productionReleaseAuthorized, false);
  assert.equal(question.difficulty, undefined);
  assert.equal(question.difficultyLabel, undefined);
}

console.log("[COM003-REVIEW-ONLY-REGISTRY-CONTRACT-V1]", {
  valid: true,
  packageCount: matches.length,
  engineId: pkg.engineId,
  lifecycleId: pkg.lifecycleId,
  generated: first.questions.length,
  reviewPersistence: first.generationContext?.reviewRunPersistenceAllowed,
  bankWritable: first.generationContext?.questionBankWritable,
});
