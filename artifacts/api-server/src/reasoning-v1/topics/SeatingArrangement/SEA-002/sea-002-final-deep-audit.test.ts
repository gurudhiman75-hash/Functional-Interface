import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";
import { SEA002_CP006_PERMANENT_QL_IDS } from "./cp006/permanent/registry.ts";
import { SEA002_CP007_PERMANENT_QL_IDS } from "./cp007/permanent/registry.ts";
import { SEA002_CP008_PERMANENT_QL_IDS } from "./cp008/permanent/registry.ts";
import {
  SEA002_ADVANCED_QL_AUTHORITIES,
  SEA002_CP009_PERMANENT_QL_IDS,
  SEA002_CP010_PERMANENT_QL_IDS,
  SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID,
  type Sea002AdvancedQlId,
} from "./advanced-authority.ts";
import { generateSea002AdvancedQuestion } from "./advanced-runtime.ts";
import {
  SEA_002_QUESTION_STUDIO_PACKAGE,
  SEA002_ALL_PERMANENT_QL_IDS,
  generateSea002QuestionStudioBatch,
} from "./question-studio-integration.ts";

const expectedQls = Array.from({ length: 22 }, (_, index) =>
  "SEA-QL-" + String(index + 21).padStart(3, "0"),
);

assert.deepEqual([...SEA002_ALL_PERMANENT_QL_IDS], expectedQls);
assert.deepEqual([...SEA002_CP006_PERMANENT_QL_IDS], ["SEA-QL-021", "SEA-QL-022", "SEA-QL-023", "SEA-QL-024"]);
assert.deepEqual([...SEA002_CP007_PERMANENT_QL_IDS], ["SEA-QL-025", "SEA-QL-026", "SEA-QL-027", "SEA-QL-028"]);
assert.deepEqual([...SEA002_CP008_PERMANENT_QL_IDS], ["SEA-QL-029", "SEA-QL-030", "SEA-QL-031", "SEA-QL-032", "SEA-QL-033", "SEA-QL-034", "SEA-QL-035"]);
assert.deepEqual([...SEA002_CP009_PERMANENT_QL_IDS], ["SEA-QL-036", "SEA-QL-037", "SEA-QL-038", "SEA-QL-039"]);
assert.deepEqual([...SEA002_CP010_PERMANENT_QL_IDS], ["SEA-QL-040", "SEA-QL-041", "SEA-QL-042"]);
assert.equal(SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID, "SEA-QL-043");

assert.equal(SEA_002_QUESTION_STUDIO_PACKAGE.lifecycleStage, "REVIEW_ONLY");
assert.equal(SEA_002_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(SEA_002_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(SEA_002_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(SEA_002_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(SEA_002_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);
assert.deepEqual(SEA_002_QUESTION_STUDIO_PACKAGE.cpIds, [
  "SEA-CP-006", "SEA-CP-007", "SEA-CP-008", "SEA-CP-009", "SEA-CP-010",
]);

const registered = reasoningV1QuestionStudioAdapter.listPackages().find((pkg) => pkg.packageId === "SEA-002");
assert.ok(registered, "SEA-002 must be registered in the current reasoning-v1 adapter.");
assert.deepEqual(registered?.supportedLanguages, ["en", "hi", "pa"]);

const expectedWorldCounts: Readonly<Record<Sea002AdvancedQlId, number>> = {
  "SEA-QL-036": 5040,
  "SEA-QL-037": 5040,
  "SEA-QL-038": 120,
  "SEA-QL-039": 7680,
  "SEA-QL-040": 144,
  "SEA-QL-041": 10080,
  "SEA-QL-042": 768,
};

for (const authority of SEA002_ADVANCED_QL_AUTHORITIES) {
  for (const language of ["en", "hi", "pa"] as const) {
    const difficulty = (authority.supportedDifficulties.includes("Medium" as never) ? "Medium" : "Hard") as "Medium" | "Hard";
    const seed = "sea002-final:" + authority.qlId + ":" + language;
    const first = generateSea002AdvancedQuestion(authority.qlId, seed, language, difficulty);
    const replay = generateSea002AdvancedQuestion(authority.qlId, seed, language, difficulty);
    assert.deepEqual(first, replay, authority.qlId + ": deterministic replay failed.");
    assert.equal(first.proof.worldCountBefore, expectedWorldCounts[authority.qlId]);
    assert.equal(first.proof.worldCountAfter, 1);
    assert.equal(first.proof.uniqueSolution, true);
    assert.equal(first.proof.targetFingerprint, first.proof.solvedFingerprint);
    assert.ok(first.proof.clueCount >= 4, authority.qlId + ": clue set too thin.");
    assert.ok(first.proof.clueCount <= 18, authority.qlId + ": clue set too long.");
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.equal(first.options[first.correctIndex], first.canonicalAnswer);
    assert.doesNotMatch(first.stem, /solver|oracle|fingerprint|blueprint|Directions:/iu);
    assert.ok(first.explanation.length > 100);
    if (language === "hi") {
      assert.match(first.stem, /[\u0900-\u097F]/u);
      assert.match(first.explanation, /[\u0900-\u097F]/u);
    }
    if (language === "pa") {
      assert.match(first.stem, /[\u0A00-\u0A7F]/u);
      assert.match(first.explanation, /[\u0A00-\u0A7F]/u);
    }
  }
}

for (const qlId of expectedQls) {
  for (const language of ["en", "hi", "pa"] as const) {
    const result = await generateSea002QuestionStudioBatch({
      packageId: "SEA-002",
      patternId: qlId,
      language,
      difficulty: "Hard",
      count: 1,
      seed: "sea002-all-ql:" + qlId + ":" + language,
    });
    assert.equal(result.questions.length, 1);
    const question = result.questions[0]!;
    assert.equal(question.qlId, qlId);
    assert.equal(question.packageId, "SEA-002");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.ok(String(question.stem ?? question.text).length > 60);
    const options = question.options as readonly unknown[];
    assert.ok(Array.isArray(options) && options.length >= 4);
    assert.ok(Number(question.correctIndex) >= 0 && Number(question.correctIndex) < options.length);
  }
}

for (const language of ["en", "hi", "pa"] as const) {
  const mixed = await generateSea002QuestionStudioBatch({
    packageId: "SEA-002",
    language,
    count: 5,
    seed: "sea002-five-checkpoint-breadth:" + language,
  });
  assert.equal(mixed.questions.length, 5);
  assert.deepEqual(
    [...new Set(mixed.questions.map((question) => String(question.checkpointId)))].sort(),
    ["SEA-CP-006", "SEA-CP-007", "SEA-CP-008", "SEA-CP-009", "SEA-CP-010"],
    language + ": first mixed review cycle must expose all five SEA-002 checkpoints.",
  );
}

console.log(JSON.stringify({
  status: "PASS_SEA_002_FINAL_DEEP_AUDIT",
  permanentQlCount: SEA002_ALL_PERMANENT_QL_IDS.length,
  permanentQlRange: "SEA-QL-021..SEA-QL-042",
  checkpointCount: SEA_002_QUESTION_STUDIO_PACKAGE.cpIds.length,
  advancedWorldCounts: expectedWorldCounts,
  languages: ["en", "hi", "pa"],
  nextAvailablePermanentQl: SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID,
  lifecycle: "review-only",
}, null, 2));
