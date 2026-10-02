import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../question-studio/engines/reasoning-v1-adapter";

const packages = reasoningV1QuestionStudioAdapter.listPackages();
for (const packageId of ["CAE-001", "BLR-001"]) {
  assert.ok(
    packages.some((entry) => entry.packageId === packageId),
    packageId + " must be registered in the shared reasoning-v1 adapter",
  );
}

for (const item of [
  { packageId: "CAE-001", qlId: "CAE-QL-006" },
  { packageId: "BLR-001", qlId: "BLR-QL-013" },
] as const) {
  const batch = await reasoningV1QuestionStudioAdapter.generate({
    engineId: "reasoning-v1",
    packageId: item.packageId,
    language: "en",
    difficulty: "Medium",
    count: 10,
    seed: "route-proof-" + item.packageId,
  });

  assert.equal(batch.questions.length, 10, item.packageId);
  for (const question of batch.questions) {
    assert.equal(question.packageId, item.packageId);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.productionReleased, false);
    assert.equal(question.difficulty, "Medium");
    assert.equal(Array.isArray(question.options), true);
    assert.ok((question.options as unknown[]).length >= 4);
    assert.ok(String(question.stem ?? question.text ?? "").trim().length >= 20);
    assert.ok(String(question.explanation ?? "").trim().length >= 20);
  }

  const scoped = await reasoningV1QuestionStudioAdapter.generate({
    engineId: "reasoning-v1",
    packageId: item.packageId,
    canonicalProblemId: item.qlId,
    language: "en",
    difficulty: "Medium",
    count: 4,
    seed: "route-proof-scoped-" + item.packageId,
  });

  assert.equal(scoped.questions.length, 4);
  assert.ok(scoped.questions.every((question) => question.qlId === item.qlId));
}

const caeLocalized = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: "CAE-001",
  language: "pa",
  difficulty: "Medium",
  count: 4,
  seed: "cae-pa-route-proof",
});
assert.equal(caeLocalized.questions.length, 4);
assert.ok(caeLocalized.questions.every((question) => question.language === "pa"));

const blrLocalized = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: "BLR-001",
  language: "hi",
  difficulty: "Medium",
  count: 4,
  seed: "blr-hi-route-proof",
});
assert.equal(blrLocalized.questions.length, 4);
assert.ok(blrLocalized.questions.every((question) => question.language === "hi"));

console.log(JSON.stringify({
  status: "PASS_REASONING_CAE_BLR_QUESTION_STUDIO_ROUTES_20261002",
  packages: ["CAE-001", "BLR-001"],
  reviewOnly: true,
  multilingualSourceRoutes: true,
}, null, 2));
