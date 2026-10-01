import assert from "node:assert/strict";

import { generateWor001Question } from "./runtime";
import {
  WOR_001_PERMANENT_QL_IDS,
  WOR_001_PERMANENT_QL_REGISTRY,
  WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS,
} from "./permanent-ql-registry";
import {
  WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES,
} from "./question-studio-production-authority";
import { WOR_001_QUESTION_STUDIO_CATALOG } from "./question-studio-review";
import type { WorDifficulty } from "./foundation/types";

const runtimeDifficulty: Record<string, WorDifficulty> = {
  Easy: "EASY",
  Medium: "MEDIUM",
  Hard: "HARD",
};

const answerPositionCoverage = new Map<string, Set<number>>();
const misconceptionCoverage = new Map<string, Set<string>>();

for (const prototype of WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES) {
  const catalog = WOR_001_QUESTION_STUDIO_CATALOG.find((entry) => entry.prototypeId === prototype.prototypeId)!;
  const positions = new Set<number>();
  const misconceptions = new Set<string>();

  for (const studioDifficulty of catalog.supportedDifficulties) {
    const difficulty = runtimeDifficulty[studioDifficulty]!;
    for (let index = 0; index < 160; index += 1) {
      const question = generateWor001Question(prototype.prototypeId, 990000 + index, "en-IN", difficulty);
      assert.equal(question.difficulty, difficulty);
      assert.equal(question.options[question.correctIndex]?.value, question.answer);
      assert.equal(question.options.filter((option) => option.misconceptionId === null).length, 1);
      assert.equal(new Set(question.options.map((option) => option.value)).size, question.options.length);

      positions.add(question.correctIndex);
      question.options
        .filter((option) => option.misconceptionId !== null)
        .forEach((option) => misconceptions.add(option.misconceptionId!));

      if (question.taskKind === "SELECT_COMPLETE_ORDER" || question.taskKind === "SELECT_DESCENDING_ORDER") {
        assert.ok(
          question.options.filter((option) => option.misconceptionId !== null).every((option) =>
            /ERROR|DISPLACED/.test(option.misconceptionId!),
          ),
          `${prototype.prototypeId} sequence distractor lacks a misconception label`,
        );
      }

      if (["FIND_RANK", "INSERT_WORD", "RANK_AFTER_INSERTION"].includes(question.taskKind)) {
        const correctRank = Number(question.answer);
        for (const option of question.options.filter((entry) => entry.misconceptionId !== null)) {
          const distractorRank = Number(option.value);
          assert.ok(Number.isInteger(distractorRank));
          assert.notEqual(distractorRank, correctRank);
          assert.ok(Math.abs(distractorRank - correctRank) >= 1);
          assert.match(option.misconceptionId!, /^RANK_/);
        }
      }

      if (question.metadata.objectMode === "LETTER_CLUSTER" && question.metadata.bankingTrace && question.options[0]) {
        if (/LETTER$/.test(catalog.answerType)) {
          assert.ok(question.options.every((option) => /^[A-Z]$/.test(option.value)));
        }
      }
    }
  }

  const expectedPositions = prototype.checkpointId === "WOR-CP-005" ? 5 : 4;
  assert.equal(positions.size, expectedPositions, `${prototype.prototypeId} does not cover all answer positions`);
  assert.ok(misconceptions.size >= 1, `${prototype.prototypeId} has no observed distractor misconception coverage`);
  answerPositionCoverage.set(prototype.prototypeId, positions);
  misconceptionCoverage.set(prototype.prototypeId, misconceptions);
}

assert.deepEqual(WOR_001_PERMANENT_QL_IDS, [
  "WOR-QL-001",
  "WOR-QL-002",
  "WOR-QL-003",
  "WOR-QL-004",
  "WOR-QL-005",
  "WOR-QL-006",
  "WOR-QL-007",
  "WOR-QL-008",
]);
assert.equal(WOR_001_PERMANENT_QL_REGISTRY.length, 8);
assert.equal(new Set(WOR_001_PERMANENT_QL_REGISTRY.map((entry) => entry.permanentQlId)).size, 8);
assert.equal(WOR_001_PERMANENT_QL_REGISTRY.flatMap((entry) => entry.mappedPrototypeIds).length, 15);
assert.equal(new Set(WOR_001_PERMANENT_QL_REGISTRY.flatMap((entry) => entry.mappedPrototypeIds)).size, 15);
assert.equal(WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS.length, 9);

const semantics = new Map<string, string[]>();
for (const entry of WOR_001_PERMANENT_QL_REGISTRY) {
  const key = `${entry.solveContract}::${entry.answerSemantic}`;
  semantics.set(key, [...(semantics.get(key) ?? []), entry.permanentQlId]);
}
for (const [key, ids] of semantics) {
  assert.equal(ids.length, 1, `Duplicate permanent QL solve authority detected: ${key} -> ${ids.join(", ")}`);
}

console.log("WOR-001 final content closure gate passed.", {
  permanentQlCount: WOR_001_PERMANENT_QL_REGISTRY.length,
  frozenPrototypeCount: WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES.length,
  sourceDeferredPrototypeCount: WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS.length,
  answerPositionCoverage: Object.fromEntries([...answerPositionCoverage].map(([id, set]) => [id, [...set].sort()])),
  misconceptionCoverage: Object.fromEntries([...misconceptionCoverage].map(([id, set]) => [id, [...set].sort()])),
});
