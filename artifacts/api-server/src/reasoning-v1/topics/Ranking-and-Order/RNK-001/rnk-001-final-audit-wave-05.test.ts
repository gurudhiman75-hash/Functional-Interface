import assert from "node:assert/strict";

import { buildRnkCp007PermanentRuntime } from "./RNK-CP-007/cp007-permanent-runtime-v1";
import { deriveRnkQuestionStudioDifficulty } from "./rnk-001-question-studio-difficulty-v2";
import { generateRnk001QuestionStudioBatch } from "./rnk-001-question-studio-integration-v2";

const cp007 = buildRnkCp007PermanentRuntime();
assert.equal(cp007.length, 192);

const cp007Derived = cp007.map((question) => ({
  source: question.difficulty,
  derived: deriveRnkQuestionStudioDifficulty(question),
}));

assert.ok(cp007Derived.every((entry) => entry.derived.instanceDerived));
assert.ok(cp007Derived.every((entry) => entry.derived.score != null));
assert.deepEqual(
  [...new Set(cp007Derived.map((entry) => entry.derived.label))].sort(),
  ["Hard", "Medium"],
  "QL042 must expose both Medium and Hard generated-instance difficulty",
);
assert.ok(
  cp007Derived.filter((entry) => entry.derived.label === "Hard").length >= 40,
  "QL042 needs a substantial Hard lane rather than a token edge case",
);
assert.ok(
  cp007Derived.filter((entry) => entry.derived.label === "Medium").length >= 40,
  "QL042 needs a substantial Medium lane",
);
assert.ok(
  cp007Derived
    .filter((entry) => entry.source === "HARD")
    .every((entry) => entry.derived.label === "Hard"),
  "the historically hard QL042 lane must not be downgraded",
);

for (const requestedDifficulty of ["Medium", "Hard"] as const) {
  const generated = await generateRnk001QuestionStudioBatch({
    packageId: "RNK-001",
    canonicalProblemId: "RNK-QL-042",
    language: "en",
    difficulty: requestedDifficulty,
    count: 8,
    seed: `rnk-wave05-ql042-${requestedDifficulty}`,
  });

  assert.equal(generated.questions.length, 8);
  for (const raw of generated.questions as Array<Record<string, any>>) {
    assert.equal(raw.difficulty, requestedDifficulty);
    assert.equal(raw.difficultyLabel, requestedDifficulty);
    assert.equal(raw.difficultyCalibrationStatus, "GENERATED_INSTANCE_DERIVED_V2");
    assert.equal(typeof raw.difficultyScore, "number");
    assert.ok(Array.isArray(raw.difficultyFactors));
    assert.ok(raw.difficultyFactors.length >= 1);
  }
}

await assert.rejects(
  () => generateRnk001QuestionStudioBatch({
    packageId: "RNK-001",
    canonicalProblemId: "RNK-QL-042",
    language: "en",
    difficulty: "Easy",
    count: 1,
    seed: "rnk-wave05-ql042-easy-reject",
  }),
  /could not produce Easy/u,
  "QL042 is a composite category-ranking form and must not be relabelled Easy",
);

for (const language of ["en", "hi", "pa"] as const) {
  for (const requestedDifficulty of ["Easy", "Medium", "Hard"] as const) {
    const generated = await generateRnk001QuestionStudioBatch({
      packageId: "RNK-001",
      language,
      difficulty: requestedDifficulty,
      exam: "SSC CGL Tier 1",
      count: 12,
      seed: `rnk-wave05-profile-${language}-${requestedDifficulty}`,
    });

    assert.equal(generated.questions.length, 12);
    for (const raw of generated.questions as Array<Record<string, any>>) {
      assert.equal(raw.difficulty, requestedDifficulty);
      assert.equal(raw.difficultyLabel, requestedDifficulty);
      assert.equal(raw.difficultyCalibrationStatus, "GENERATED_INSTANCE_DERIVED_V2");
      assert.equal(raw.requestedDifficultyApplied ?? true, true);
      assert.equal(raw.questionBankWritable, false);
      assert.equal(raw.testEligible, false);
      assert.equal(raw.mockTestEligible, false);
      assert.equal(raw.publiclyPublishable, false);
      assert.equal(raw.productionReleaseAuthorized, false);
    }
  }
}

console.log(JSON.stringify({
  verdict: "PASS_RNK_001_FINAL_AUDIT_WAVE_05_GENERATED_INSTANCE_DIFFICULTY",
  ql042CandidateCount: cp007.length,
  ql042DifficultyBands: [...new Set(cp007Derived.map((entry) => entry.derived.label))].sort(),
  ql042HardCount: cp007Derived.filter((entry) => entry.derived.label === "Hard").length,
  ql042MediumCount: cp007Derived.filter((entry) => entry.derived.label === "Medium").length,
  ql042EasyAuthorized: false,
  profileDifficultyFiltersProved: ["Easy", "Medium", "Hard"],
  languagesProved: ["en", "hi", "pa"],
  lifecycle: "REVIEW_ONLY",
}, null, 2));
