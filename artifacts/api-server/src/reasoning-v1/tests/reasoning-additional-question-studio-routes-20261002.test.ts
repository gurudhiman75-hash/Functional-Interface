import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../question-studio/engines/reasoning-v1-adapter";

const packages = reasoningV1QuestionStudioAdapter.listPackages();
for (const packageId of ["ALP-001", "CAL-001", "CAE-001", "BLR-001"]) {
  const pkg = packages.find((entry) => entry.packageId === packageId);
  assert.ok(pkg, packageId + ": shared Reasoning package is not discoverable");
  assert.equal(pkg?.engineId, "reasoning-v1");
  assert.equal(pkg?.enabled, true);
  assert.equal(pkg?.lifecycleStage, "REVIEW_ONLY");
  assert.equal(pkg?.questionBankWritable, false);
  assert.equal(pkg?.testEligible, false);
  assert.equal(pkg?.mockTestEligible, false);
  assert.equal(pkg?.publiclyPublishable, false);
  assert.equal(pkg?.automaticStudentPublication, false);
  assert.equal(pkg?.productionReleaseAuthorized, false);
}

assert.equal(packages.some((entry) => entry.packageId === "RNK-001"), false);

const cases = [
  { packageId: "ALP-001", seed: "route-proof-alp" },
  { packageId: "CAL-001", seed: "route-proof-cal" },
  { packageId: "CAE-001", seed: "route-proof-cae" },
  { packageId: "BLR-001", seed: "route-proof-blr" },
] as const;

for (const item of cases) {
  const result = await reasoningV1QuestionStudioAdapter.generate({
    engineId: "reasoning-v1",
    packageId: item.packageId,
    language: "en",
    count: 4,
    seed: item.seed,
  });

  assert.equal(result.questions.length, 4, item.packageId);
  assert.equal(result.generationContext?.packageId, item.packageId);
  for (const question of result.questions) {
    assert.equal(question.packageId, item.packageId);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.productionReleaseAuthorized, false);
    assert.equal((question.options as unknown[]).length, 4);
    assert.equal(new Set(question.options as string[]).size, 4);
    assert.ok(String(question.stem ?? question.text ?? "").length > 10);
    assert.ok(String(question.explanation ?? "").length > 20);
  }
}

const scopedAlp = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: "ALP-001",
  canonicalProblemId: "ALP-QL-031",
  language: "en",
  count: 2,
  seed: "route-proof-alp-scoped",
});
assert.ok(scopedAlp.questions.every((question) => question.qlId === "ALP-QL-031"));

const scopedCal = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: "CAL-001",
  canonicalProblemId: "CAL-QL-035",
  language: "en",
  count: 2,
  seed: "route-proof-cal-scoped",
});
assert.ok(scopedCal.questions.every((question) => question.canonicalProblemId === "CAL-QL-035"));

const scopedCae = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: "CAE-001",
  canonicalProblemId: "CAE-QL-008",
  language: "en",
  count: 2,
  seed: "route-proof-cae-scoped",
});
assert.ok(scopedCae.questions.every((question) => question.qlId === "CAE-QL-008"));

const scopedBlr = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: "BLR-001",
  canonicalProblemId: "BLR-QL-013",
  language: "en",
  count: 2,
  seed: "route-proof-blr-scoped",
});
assert.ok(scopedBlr.questions.every((question) => question.qlId === "BLR-QL-013"));

console.log(JSON.stringify({
  status: "PASS_REASONING_ADDITIONAL_QUESTION_STUDIO_ROUTES_20261002",
  registeredPackages: cases.map((item) => item.packageId),
  rnkActivationStillLocked: true,
}, null, 2));
