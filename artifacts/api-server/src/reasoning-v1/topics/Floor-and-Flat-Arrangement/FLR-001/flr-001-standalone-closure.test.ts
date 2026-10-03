import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter";
import {
  FLR_001_CONTENT_CLOSURE,
  FLR_001_PERMANENT_QL_IDS,
  FLR_001_QL_AUTHORITIES,
  type FlrQlId,
} from "./flr-001-authority";
import {
  FLR_001_QUESTION_STUDIO_PACKAGE,
  generateFlr001QuestionStudioBatch,
} from "./question-studio-integration";
import {
  generateFlr001Question,
  type FlrDifficulty,
} from "./flr-001-runtime";

assert.equal(FLR_001_CONTENT_CLOSURE.permanentQlCount, 4);
assert.deepEqual([...FLR_001_PERMANENT_QL_IDS], [
  "FLR-QL-001",
  "FLR-QL-002",
  "FLR-QL-003",
  "FLR-QL-004",
]);
assert.equal(FLR_001_CONTENT_CLOSURE.nextAvailablePermanentQl, "FLR-QL-005");

assert.equal(FLR_001_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(FLR_001_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(FLR_001_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(FLR_001_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(FLR_001_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);

const registered = reasoningV1QuestionStudioAdapter
  .listPackages()
  .find((entry) => entry.packageId === "FLR-001");
assert.ok(registered, "FLR-001 must be registered in reasoning-v1 Question Studio.");
assert.deepEqual(registered?.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(registered?.supportedDifficulties, ["Easy", "Medium", "Hard"]);

const expectedDifficulties: Readonly<Record<FlrQlId, readonly FlrDifficulty[]>> = {
  "FLR-QL-001": ["Easy", "Medium"],
  "FLR-QL-002": ["Medium", "Hard"],
  "FLR-QL-003": ["Medium", "Hard"],
  "FLR-QL-004": ["Hard"],
};

const languageScripts = {
  hi: /[ऀ-ॿ]/u,
  pa: /[਀-੿]/u,
} as const;

for (const authority of FLR_001_QL_AUTHORITIES) {
  assert.deepEqual(
    [...authority.supportedDifficulties],
    [...expectedDifficulties[authority.qlId]],
  );

  for (const difficulty of expectedDifficulties[authority.qlId]) {
    for (const language of ["en", "hi", "pa"] as const) {
      const seed = authority.qlId + ":" + difficulty + ":" + language + ":closure";
      const question = generateFlr001Question(
        authority.qlId,
        seed,
        language,
        difficulty,
      );
      assert.equal(question.qlId, authority.qlId);
      assert.equal(question.difficulty, difficulty);
      assert.equal(question.proof.uniqueSolution, true);
      assert.equal(question.proof.worldCountAfter, 1);
      assert.equal(question.proof.targetFingerprint, question.proof.solvedFingerprint);
      assert.equal(question.metadata.exactFiniteEnumeration, true);
      assert.equal(question.metadata.solverVerified, true);
      assert.equal(question.metadata.reviewOnly, true);
      assert.ok(question.proof.worldCountBefore > 1);
      assert.ok(question.proof.clueCount >= 3);
      assert.ok(question.proof.clueCount <= 20, authority.qlId + ": clue set is too long.");
      assert.equal(new Set(question.options).size, question.options.length);
      assert.equal(question.options.length, 4);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length);
      assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
      assert.ok(question.stem.length > 100);
      assert.ok(question.explanation.length > 100);
      assert.doesNotMatch(question.stem, /Directions:/i);
      if (language !== "en") {
        assert.match(question.stem, languageScripts[language]);
        assert.match(question.explanation, languageScripts[language]);
      }
    }
  }
}

const deterministicCases: readonly [FlrQlId, FlrDifficulty][] = [
  ["FLR-QL-001", "Medium"],
  ["FLR-QL-002", "Hard"],
  ["FLR-QL-003", "Hard"],
  ["FLR-QL-004", "Hard"],
];
for (const [qlId, difficulty] of deterministicCases) {
  const first = generateFlr001Question(qlId, "flr-deterministic-" + qlId, "en", difficulty);
  const second = generateFlr001Question(qlId, "flr-deterministic-" + qlId, "en", difficulty);
  assert.deepEqual(first, second, qlId + ": deterministic regeneration failed.");
}

const basic = generateFlr001Question("FLR-QL-001", "world-count-basic", "en", "Easy");
assert.equal(basic.proof.worldCountBefore, 120);

const attribute = generateFlr001Question("FLR-QL-002", "world-count-attribute", "en", "Medium");
assert.equal(attribute.proof.worldCountBefore, 14400);

const grid = generateFlr001Question("FLR-QL-003", "world-count-grid", "en", "Hard");
assert.equal(grid.proof.worldCountBefore, 40320);
assert.match(grid.stem, /Flat 1/i);
assert.match(grid.stem, /west/i);

const shared = generateFlr001Question("FLR-QL-004", "world-count-shared", "en", "Hard");
assert.equal(shared.proof.worldCountBefore, 15120);
assert.match(shared.stem, /Exactly one flat contains two persons/i);
assert.match(shared.stem, /Which two persons live in the same flat/i);

const easyBatch = await generateFlr001QuestionStudioBatch({
  packageId: "FLR-001",
  language: "hi",
  difficulty: "Easy",
  count: 3,
  seed: "flr-easy-batch",
});
assert.equal(easyBatch.questions.length, 3);
assert.ok(easyBatch.questions.every((q) => q.qlId === "FLR-QL-001"));
assert.ok(easyBatch.questions.every((q) => q.difficulty === "Easy"));

const hardFlatBatch = await reasoningV1QuestionStudioAdapter.generate({
  packageId: "FLR-001",
  patternId: "FLR-CP-003",
  language: "pa",
  difficulty: "Hard",
  count: 2,
  seed: "flr-hard-flat-adapter",
});
assert.equal(hardFlatBatch.questions.length, 2);
assert.ok(hardFlatBatch.questions.every((q) => q.qlId === "FLR-QL-003"));
assert.ok(hardFlatBatch.questions.every((q) => q.questionBankWritable === false));
assert.ok(hardFlatBatch.questions.every((q) => q.testEligible === false));

console.log(JSON.stringify({
  status: "PASS_FLR_001_STANDALONE_DEEP_AUDIT_CLOSURE",
  permanentQlCount: FLR_001_PERMANENT_QL_IDS.length,
  difficultyCoverage: expectedDifficulties,
  worldCounts: {
    simpleFloor: basic.proof.worldCountBefore,
    floorPlusAttribute: attribute.proof.worldCountBefore,
    floorFlatGrid: grid.proof.worldCountBefore,
    sharedFlat: shared.proof.worldCountBefore,
  },
  nextAvailablePermanentQl: FLR_001_CONTENT_CLOSURE.nextAvailablePermanentQl,
}, null, 2));
