import assert from "node:assert/strict";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { generateExactAtomicPrototypeQuestion } from "./exact-atomic-generator";
import {
  EXACT_ATOMIC_PROTOTYPE_CONTRACTS,
  EXACT_ATOMIC_TOPOLOGIES,
  exactAtomicDifficulty,
} from "./prototype-contracts";
import {
  classifyTokenWordRelation,
  classifyWordTokenRelation,
} from "./solution-space";
import type { AbstractSentenceCodePuzzle } from "./types";

const answerPositions = [0, 0, 0, 0];
const topologyCounts = new Map<string, number>();
const scenarioCoverage = new Map<string, Set<string>>();
const visibleVariants = new Map<string, Set<string>>();
const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
let generated = 0;
let activeDistractorsChecked = 0;
let positionalDistractors = 0;
let cannotDetermineDistractors = 0;

for (const contract of EXACT_ATOMIC_PROTOTYPE_CONTRACTS) {
  for (const topologyKind of EXACT_ATOMIC_TOPOLOGIES) {
    const coverageKey = `${contract.prototypeId}:${topologyKind}`;
    scenarioCoverage.set(coverageKey, new Set<string>());
    visibleVariants.set(coverageKey, new Set<string>());

    for (let seed = 1; seed <= 80; seed += 1) {
      const first = generateExactAtomicPrototypeQuestion(contract.prototypeId, seed, topologyKind);
      const second = generateExactAtomicPrototypeQuestion(contract.prototypeId, seed, topologyKind);
      assert.deepEqual(first, second, `${coverageKey}/${seed} must be deterministic`);
      assert.equal(first.permanentQlId, null);
      assert.equal(first.prototypeOnly, true);
      assert.equal(first.publiclyPublishable, false);
      assert.equal(JSON.stringify(first).includes("COD-QL-"), false);
      assert.equal(first.topologyKind, topologyKind);
      assert.equal(first.difficulty, exactAtomicDifficulty(topologyKind));
      assert.equal(first.options.length, 4);
      assert.equal(new Set(first.options.map((option) => option.value)).size, 4);
      assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(first.options[first.correctIndex]!.isCorrect, true);
      assert.equal(first.stem.startsWith("In a certain code language, "), true);
      assert.equal(first.stem.includes("The order of the code words is not necessarily the same"), true);
      assert.equal(first.stem.includes("{{"), false);
      assert.equal(first.stem.includes("prototype"), false);
      assert.equal(first.stem.includes("topology"), false);
      assert.equal(first.structuredPrompt.rows.length >= 2, true);

      const displayedPuzzle: AbstractSentenceCodePuzzle = {
        rows: first.structuredPrompt.rows.map((row) => ({
          rowId: row.rowId,
          wordIds: row.words,
          codeTokens: row.displayedCodeTokens,
        })),
      };
      const space = solveSentenceCodeConstraints(displayedPuzzle);
      assert.equal(space.solutionCount, first.metadata.solutionCount);

      const correct = first.options[first.correctIndex]!.value;
      if (contract.queryDirection === "WORD_TO_TOKEN") {
        assert.equal(first.answerType, "CODE_TOKEN");
        assert.equal(correct, first.structuredPrompt.targetToken);
        assert.equal(
          classifyWordTokenRelation(space, first.structuredPrompt.targetWord, first.structuredPrompt.targetToken),
          "DEFINITE",
        );
        for (const option of first.options.filter((candidate) => !candidate.isCorrect && candidate.value !== "Cannot be determined")) {
          assert.equal(classifyWordTokenRelation(space, first.structuredPrompt.targetWord, option.value), "IMPOSSIBLE");
          activeDistractorsChecked += 1;
        }
      } else {
        assert.equal(first.answerType, "WORD");
        assert.equal(correct, first.structuredPrompt.targetWord);
        assert.equal(
          classifyTokenWordRelation(space, first.structuredPrompt.targetToken, first.structuredPrompt.targetWord),
          "DEFINITE",
        );
        for (const option of first.options.filter((candidate) => !candidate.isCorrect && candidate.value !== "Cannot be determined")) {
          assert.equal(classifyTokenWordRelation(space, first.structuredPrompt.targetToken, option.value), "IMPOSSIBLE");
          activeDistractorsChecked += 1;
        }
      }

      const cannotOption = first.options.find((option) => option.value === "Cannot be determined");
      assert.ok(cannotOption);
      assert.equal(cannotOption!.isCorrect, false);
      assert.equal(cannotOption!.errorLabel, "UNRESOLVED_ASSUMED");
      cannotDetermineDistractors += 1;
      positionalDistractors += first.options.filter((option) => option.errorLabel === "STATEMENT_ORDER_ASSUMED").length;

      assert.equal(first.explanation.referenceAid.length, 2);
      assert.ok(first.explanation.quickMethod.length >= 40);
      assert.ok(first.explanation.evidenceComparison.length >= 1);
      assert.equal(first.explanation.evidenceComparison.join(" ").includes(first.structuredPrompt.targetWord), true);
      assert.equal(first.explanation.evidenceComparison.join(" ").includes(first.structuredPrompt.targetToken), true);
      assert.equal(/\br[1-4]\b/i.test(first.explanation.evidenceComparison.join(" ")), false);
      assert.equal(first.explanation.targetResult.includes(first.structuredPrompt.targetWord), true);
      assert.equal(first.explanation.targetResult.includes(first.structuredPrompt.targetToken), true);
      assert.equal(first.explanation.conclusion.includes(correct), true);
      assert.equal(
        first.options.filter((option) => !option.isCorrect).some((option) => first.explanation.commonTrapAlert.includes(option.value)),
        true,
      );

      answerPositions[first.correctIndex] += 1;
      topologyCounts.set(topologyKind, (topologyCounts.get(topologyKind) ?? 0) + 1);
      scenarioCoverage.get(coverageKey)!.add(first.metadata.scenarioId);
      visibleVariants.get(coverageKey)!.add(JSON.stringify({
        stem: first.stem,
        rows: first.structuredPrompt.rows.map((row) => ({ sentence: row.sentence, code: row.displayedCode })),
        options: first.options.map((option) => option.value),
      }));
      difficultyCounts[first.difficulty] += 1;
      generated += 1;
    }

    assert.equal(scenarioCoverage.get(coverageKey)!.size, 5, `${coverageKey} must reach all English scenarios`);
    assert.ok(visibleVariants.get(coverageKey)!.size >= 78, `${coverageKey} lacks visible question variation`);
  }
}

assert.equal(generated, 2 * 5 * 80);
assert.equal(activeDistractorsChecked, generated * 2);
assert.equal(cannotDetermineDistractors, generated);
assert.ok(positionalDistractors > 0);
assert.ok(Math.max(...answerPositions) / Math.min(...answerPositions) < 1.25, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);
assert.equal(difficultyCounts.EASY, 2 * 80);
assert.equal(difficultyCounts.HARD, 2 * 80);
assert.equal(difficultyCounts.MEDIUM, 3 * 2 * 80);

console.log(JSON.stringify({
  checkpoint: "COD-CP-009",
  maturity: "EXACT_ATOMIC_QUESTION_PROTOTYPE",
  permanentQlsCreated: 0,
  prototypeContracts: EXACT_ATOMIC_PROTOTYPE_CONTRACTS.map((contract) => contract.prototypeId),
  topologies: EXACT_ATOMIC_TOPOLOGIES,
  generated,
  seedsPerContractTopology: 80,
  answerPositions,
  difficultyCounts,
  activeDistractorsChecked,
  positionalDistractors,
  cannotDetermineDistractors,
  scenarioCoverage: Object.fromEntries([...scenarioCoverage].map(([key, values]) => [key, values.size])),
  visibleVariantCounts: Object.fromEntries([...visibleVariants].map(([key, values]) => [key, values.size])),
  verdict: "PASS — EXACT ATOMIC SENTENCE-CODE QUESTION PROTOTYPES",
}, null, 2));
