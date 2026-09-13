import assert from "node:assert/strict";
import { reasoningV1Ops001RemediatedAdapter } from "./reasoning-v1-ops001-remediated-adapter";

const [pkg] = reasoningV1Ops001RemediatedAdapter.listPackages();
assert.ok(pkg, "OPS-001 package missing");
assert.equal(pkg.packageId, "OPS-001");
assert.equal(pkg.difficultyFilterSupported, true);
assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.productionReleaseAuthorized, false);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = await reasoningV1Ops001RemediatedAdapter.generate({
    packageId: "OPS-001",
    difficulty,
    language: "en",
    count: 8,
    seed: `ops-audit-${difficulty.toLowerCase()}`,
  });
  assert.equal(result.questions.length, 8);
  for (const question of result.questions) {
    assert.equal(question.difficulty, difficulty);
    assert.equal(question.difficultyLabel, difficulty);
    assert.equal(question.difficultyCalibrationStatus, "INSTANCE_DERIVED_V1");
    assert.equal(question.requestedDifficultyApplied, true);
    assert.ok(Array.isArray(question.difficultyFactors));
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.productionReleaseAuthorized, false);
  }
}

const unfiltered = await reasoningV1Ops001RemediatedAdapter.generate({
  packageId: "OPS-001",
  language: "en",
  count: 31,
  seed: "ops-audit-unfiltered",
});
const reached = new Set(unfiltered.questions.map((question) => question.difficulty));
assert.ok(reached.has("Easy"), "Unfiltered chapter batch never reaches Easy");
assert.ok(reached.has("Medium"), "Unfiltered chapter batch never reaches Medium");
assert.ok(reached.has("Hard"), "Unfiltered chapter batch never reaches Hard");

console.log("OPS-001 remediated Question Studio difficulty proof passed", {
  reached: [...reached],
});
