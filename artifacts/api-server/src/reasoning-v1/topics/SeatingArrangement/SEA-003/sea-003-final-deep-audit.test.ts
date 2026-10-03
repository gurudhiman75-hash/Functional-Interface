import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";
import {
  SEA003_CHECKPOINTS,
  SEA003_NEXT_AVAILABLE_PERMANENT_QL_ID,
  SEA003_PERMANENT_QL_IDS,
  SEA003_QL_AUTHORITIES,
  type Sea003QlId,
} from "./authority.ts";
import { generateSea003Question } from "./runtime.ts";
import {
  SEA_003_QUESTION_STUDIO_PACKAGE,
  SEA003_QL_DIFFICULTY,
  generateSea003QuestionStudioBatch,
} from "./question-studio-integration.ts";

const expectedQls = [
  "SEA-QL-043", "SEA-QL-044",
  "SEA-QL-045", "SEA-QL-046",
  "SEA-QL-047", "SEA-QL-048",
  "SEA-QL-049", "SEA-QL-050",
  "SEA-QL-051",
] as const;

assert.deepEqual([...SEA003_PERMANENT_QL_IDS], expectedQls);
assert.equal(SEA003_QL_AUTHORITIES.length, 9);
assert.equal(SEA003_CHECKPOINTS.length, 5);
assert.equal(SEA003_NEXT_AVAILABLE_PERMANENT_QL_ID, "SEA-QL-052");

assert.equal(SEA_003_QUESTION_STUDIO_PACKAGE.lifecycleStage, "REVIEW_ONLY");
assert.equal(SEA_003_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(SEA_003_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(SEA_003_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(SEA_003_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(SEA_003_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);

const registered = reasoningV1QuestionStudioAdapter.listPackages().find((pkg) => pkg.packageId === "SEA-003");
assert.ok(registered, "SEA-003 must be registered in the current reasoning-v1 adapter.");
assert.deepEqual(registered?.cpIds, ["SEA-CP-011", "SEA-CP-012", "SEA-CP-013", "SEA-CP-014", "SEA-CP-015"]);
assert.deepEqual(registered?.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(registered?.supportedDifficulties, ["Easy", "Medium", "Hard"]);

const expectedWorldCounts: Readonly<Record<Sea003QlId, number>> = {
  "SEA-QL-043": 14400,
  "SEA-QL-044": 2880,
  "SEA-QL-045": 40320,
  "SEA-QL-046": 2520,
  "SEA-QL-047": 120,
  "SEA-QL-048": 120,
  "SEA-QL-049": 29544,
  "SEA-QL-050": 29544,
  "SEA-QL-051": 120,
};

for (const qlId of expectedQls) {
  for (const language of ["en", "hi", "pa"] as const) {
    const seed = "sea003-final:" + qlId + ":" + language;
    const first = generateSea003Question(qlId, seed, language);
    const replay = generateSea003Question(qlId, seed, language);

    assert.deepEqual(first, replay, qlId + ": deterministic replay failed.");
    assert.equal(first.proof.worldCountBefore, expectedWorldCounts[qlId]);
    assert.equal(first.proof.worldCountAfter, 1);
    assert.equal(first.proof.uniqueSolution, true);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.equal(first.options[first.correctIndex], first.answer);
    assert.ok(first.stem.length > 80);
    assert.ok(first.explanation.length > 40);
    assert.doesNotMatch(first.stem, /solver|oracle|fingerprint|blueprint|Directions\s*:/iu);
    assert.doesNotMatch(first.stem, /बैठता\/बैठती|ਬੈਠਦਾ\/ਬੈਠਦੀ|होगा\/होगी|ਹੋਵੇਗਾ\/ਹੋਵੇਗੀ/u);

    if (language === "hi") {
      assert.match(first.stem, /[\u0900-\u097F]/u);
      assert.match(first.explanation, /[\u0900-\u097F]/u);
    }
    if (language === "pa") {
      assert.match(first.stem, /[\u0A00-\u0A7F]/u);
      assert.match(first.explanation, /[\u0A00-\u0A7F]/u);
    }

    if (qlId === "SEA-QL-047" || qlId === "SEA-QL-048") {
      assert.equal(first.proof.conditionEssential, true);
      assert.equal(first.proof.baseWorldCountWithoutConditional, 2);
    }
  }
}

for (const qlId of expectedQls) {
  const result = await generateSea003QuestionStudioBatch({
    packageId: "SEA-003",
    patternId: qlId,
    language: "en",
    difficulty: SEA003_QL_DIFFICULTY[qlId],
    count: 1,
    seed: "sea003-route:" + qlId,
  });
  assert.equal(result.questions.length, 1);
  const question = result.questions[0]!;
  assert.equal(question.qlId, qlId);
  assert.equal(question.packageId, "SEA-003");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.automaticStudentPublication, false);
}

for (const language of ["en", "hi", "pa"] as const) {
  const mixed = await generateSea003QuestionStudioBatch({
    packageId: "SEA-003",
    language,
    count: 5,
    seed: "sea003-checkpoint-breadth:" + language,
  });
  assert.equal(mixed.questions.length, 5);
  assert.deepEqual(
    [...new Set(mixed.questions.map((q) => String(q.checkpointId)))].sort(),
    ["SEA-CP-011", "SEA-CP-012", "SEA-CP-013", "SEA-CP-014", "SEA-CP-015"],
    language + ": first mixed review cycle must expose all five SEA-003 checkpoints.",
  );
}

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const batch = await generateSea003QuestionStudioBatch({
    packageId: "SEA-003",
    language: "en",
    difficulty,
    count: 2,
    seed: "sea003-difficulty:" + difficulty,
  });
  assert.ok(batch.questions.every((question) => question.difficulty === difficulty));
}

console.log(JSON.stringify({
  status: "PASS_SEA_003_FINAL_DEEP_AUDIT",
  permanentQlCount: SEA003_PERMANENT_QL_IDS.length,
  permanentQlRange: "SEA-QL-043..SEA-QL-051",
  checkpointCount: SEA003_CHECKPOINTS.length,
  worldCounts: expectedWorldCounts,
  languages: ["en", "hi", "pa"],
  difficulties: ["Easy", "Medium", "Hard"],
  nextAvailablePermanentQl: SEA003_NEXT_AVAILABLE_PERMANENT_QL_ID,
  lifecycle: "review-only",
}, null, 2));
