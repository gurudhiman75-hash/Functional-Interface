import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter";
import {
  INE_001_CONTENT_CLOSURE,
  INE_001_PERMANENT_QL_IDS,
} from "./ine-001-authority";
import {
  INE_001_QUESTION_STUDIO_PACKAGE,
  generateIne001QuestionStudioBatch,
} from "./question-studio-integration";
import { generateIne001Question } from "./ine-001-runtime";

assert.equal(INE_001_CONTENT_CLOSURE.permanentQlCount, 4);
assert.deepEqual([...INE_001_PERMANENT_QL_IDS], [
  "INE-QL-001",
  "INE-QL-002",
  "INE-QL-003",
  "INE-QL-004",
]);
assert.equal(INE_001_CONTENT_CLOSURE.nextAvailablePermanentQl, "INE-QL-005");
assert.equal(INE_001_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(INE_001_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(INE_001_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(INE_001_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(INE_001_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);

const registered = reasoningV1QuestionStudioAdapter
  .listPackages()
  .find((entry) => entry.packageId === "INE-001");
assert.ok(registered, "INE-001 must be registered in reasoning-v1 Question Studio.");
assert.deepEqual(registered?.supportedLanguages, ["en", "hi", "pa"]);

const languages = ["en", "hi", "pa"] as const;
const seeds = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel"];
const seenDifficulty = new Map<string, Set<string>>();

for (const qlId of INE_001_PERMANENT_QL_IDS) {
  const difficulties = new Set<string>();
  seenDifficulty.set(qlId, difficulties);
  for (const language of languages) {
    for (const seed of seeds) {
      const first = generateIne001Question(qlId, seed, language);
      const second = generateIne001Question(qlId, seed, language);
      assert.deepEqual(first, second, qlId + ": generation must be deterministic.");
      assert.equal(first.qlId, qlId);
      assert.ok(first.proof.worldCount > 0);
      assert.equal(first.metadata.solverVerified, true);
      assert.equal(first.metadata.reviewOnly, true);
      assert.ok(first.stem.length > 20);
      assert.ok(first.explanation.length > 30);
      assert.equal(new Set(first.options).size, first.options.length);
      assert.ok(first.correctIndex >= 0 && first.correctIndex < first.options.length);
      assert.doesNotMatch(first.stem, /Directions:\s*(Study|Consider|Carefully)/i);
      difficulties.add(first.difficulty);
      if (qlId === "INE-QL-003") {
        assert.equal(first.proof.exhaustiveEitherOr, true);
        assert.equal(first.correctIndex, 3);
      }
    }
  }
}

assert.ok(seenDifficulty.get("INE-QL-001")?.has("Easy"));
assert.ok(seenDifficulty.get("INE-QL-001")?.has("Medium"));
for (const qlId of ["INE-QL-002", "INE-QL-003", "INE-QL-004"]) {
  assert.ok(seenDifficulty.get(qlId)?.has("Medium"), qlId + " needs Medium coverage.");
  assert.ok(seenDifficulty.get(qlId)?.has("Hard"), qlId + " needs Hard coverage.");
}

const mixed = await generateIne001QuestionStudioBatch({
  packageId: "INE-001",
  language: "en",
  count: 12,
  seed: "ine-001-integration-proof",
});
assert.equal(mixed.questions.length, 12);
assert.ok(mixed.questions.every((q) => q.packageId === "INE-001"));
assert.ok(mixed.questions.every((q) => q.questionBankWritable === false));
assert.ok(mixed.questions.every((q) => q.testEligible === false));
assert.ok(mixed.questions.every((q) => q.publiclyPublishable === false));

const coded = await generateIne001QuestionStudioBatch({
  packageId: "INE-001",
  patternId: "INE-CP-004",
  language: "pa",
  difficulty: "Hard",
  count: 3,
  seed: "ine-coded-hard-proof",
});
assert.equal(coded.questions.length, 3);
assert.ok(coded.questions.every((q) => q.qlId === "INE-QL-004"));
assert.ok(coded.questions.every((q) => q.difficulty === "Hard"));

const easy = await reasoningV1QuestionStudioAdapter.generate({
  packageId: "INE-001",
  language: "hi",
  difficulty: "Easy",
  count: 3,
  seed: "ine-easy-adapter-proof",
});
assert.equal(easy.questions.length, 3);
assert.ok(easy.questions.every((q) => q.qlId === "INE-QL-001"));
assert.ok(easy.questions.every((q) => q.difficulty === "Easy"));

console.log(JSON.stringify({
  status: "PASS_INE_001_STANDALONE_CONTENT_CLOSURE",
  permanentQlCount: INE_001_PERMANENT_QL_IDS.length,
  languages,
  difficultyCoverage: Object.fromEntries(
    [...seenDifficulty.entries()].map(([qlId, values]) => [qlId, [...values].sort()]),
  ),
  nextAvailablePermanentQl: INE_001_CONTENT_CLOSURE.nextAvailablePermanentQl,
}, null, 2));
