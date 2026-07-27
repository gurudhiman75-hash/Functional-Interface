import assert from "node:assert/strict";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { POSSIBLE_SET_PROTOTYPE_CONTRACTS } from "./possible-set-contracts";
import { generatePossibleSetPrototypeQuestion } from "./possible-set-generator";
import { possibleSetWitnessCount } from "./possible-set-options";
import {
  classifyTokenSetToWordsRelation,
  classifyWordsToTokenSetRelation,
} from "./solution-space";
import type { AbstractSentenceCodePuzzle } from "./types";

const answerPositions = [0, 0, 0, 0];
const scenarioCoverage = new Map<string, Set<string>>();
const visibleVariants = new Map<string, Set<string>>();
const difficultyCounts = { MEDIUM: 0, HARD: 0 };
let generated = 0;
let witnessedOptions = 0;
let zeroWitnessOptions = 0;
let twoWayQuestions = 0;
let threeWayQuestions = 0;

function displayedPuzzle(question: ReturnType<typeof generatePossibleSetPrototypeQuestion>): AbstractSentenceCodePuzzle {
  return {
    rows: question.structuredPrompt.rows.map((row) => ({
      rowId: row.statementId,
      wordIds: row.words,
      codeTokens: row.displayedCodeTokens,
    })),
  };
}

for (const contract of POSSIBLE_SET_PROTOTYPE_CONTRACTS) {
  for (const topologyKind of contract.supportedTopologies) {
    const key = `${contract.prototypeId}:${topologyKind}`;
    scenarioCoverage.set(key, new Set<string>());
    visibleVariants.set(key, new Set<string>());

    for (let seed = 1; seed <= 120; seed += 1) {
      const first = generatePossibleSetPrototypeQuestion(contract.prototypeId, seed, topologyKind);
      const second = generatePossibleSetPrototypeQuestion(contract.prototypeId, seed, topologyKind);
      assert.deepEqual(first, second, `${key}/${seed} must be deterministic`);
      assert.equal(first.permanentQlId, null);
      assert.equal(first.prototypeOnly, true);
      assert.equal(first.publiclyPublishable, false);
      assert.equal(first.options.length, 4);
      assert.equal(new Set(first.options.map((option) => option.canonicalValue)).size, 4);
      assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(first.options[first.correctIndex]!.isCorrect, true);
      assert.equal(first.stem.startsWith("In a certain code language, "), true);
      assert.equal(first.stem.includes("The order of the code words is not necessarily the same"), true);
      assert.equal(first.stem.includes("prototype"), false);
      assert.equal(first.stem.includes("topology"), false);
      assert.equal(JSON.stringify(first).includes("COD-QL-"), false);
      assert.equal(JSON.stringify(first.structuredPrompt).includes("reviewerWordIds"), false);
      assert.equal(JSON.stringify(first.structuredPrompt).includes('"rowId"'), false);
      assert.deepEqual(
        first.structuredPrompt.rows.map((row) => row.statementId),
        first.structuredPrompt.rows.map((_, index) => `statement-${index + 1}`),
      );

      const space = solveSentenceCodeConstraints(displayedPuzzle(first));
      assert.equal(space.solutionCount, first.metadata.solutionCount);
      const correct = first.options[first.correctIndex]!;

      for (const option of first.options) {
        const relation = contract.queryDirection === "WORDS_TO_TOKENS"
          ? classifyWordsToTokenSetRelation(
            space,
            first.structuredPrompt.targetWords,
            option.members,
          )
          : classifyTokenSetToWordsRelation(
            space,
            first.structuredPrompt.targetTokens,
            option.members,
          );
        const witnessCount = possibleSetWitnessCount(
          space,
          contract.queryDirection,
          first.structuredPrompt.targetWords,
          first.structuredPrompt.targetTokens,
          option.members,
        );
        assert.equal(witnessCount, option.witnessCount);
        assert.equal(first.metadata.optionWitnessCounts[option.canonicalValue], witnessCount);

        if (option.isCorrect) {
          assert.equal(relation, "POSSIBLE");
          assert.ok(witnessCount > 0 && witnessCount < space.solutionCount);
          witnessedOptions += 1;
        } else {
          assert.equal(relation, "IMPOSSIBLE");
          assert.equal(witnessCount, 0);
          assert.equal(option.errorLabel, "ZERO_WITNESS_SET");
          zeroWitnessOptions += 1;
        }
      }

      assert.ok(first.metadata.correctWitnessCount > 0);
      assert.ok(first.metadata.correctWitnessCount < first.metadata.solutionCount);
      assert.equal(first.explanation.referenceAid.length, 2);
      assert.ok(first.explanation.quickMethod.length >= 40);
      assert.ok(first.explanation.evidenceComparison.length >= 2);
      assert.equal(/\br[1-4]\b/i.test(first.explanation.evidenceComparison.join(" ")), false);
      assert.equal(first.explanation.witness.includes(correct.value), true);
      assert.equal(first.explanation.conclusion.includes(correct.value), true);
      assert.equal(
        first.options.filter((option) => !option.isCorrect).some((option) => first.explanation.commonTrapAlert.includes(option.value)),
        true,
      );

      if (topologyKind === "CONTROLLED_PARTIAL_INFORMATION") {
        assert.equal(first.difficulty, "MEDIUM");
        assert.equal(first.metadata.solutionCount, 2);
        assert.equal(first.metadata.possibleSetCount, 2);
        twoWayQuestions += 1;
      } else {
        assert.equal(first.difficulty, "HARD");
        assert.equal(first.metadata.solutionCount, 6);
        assert.equal(first.metadata.possibleSetCount, 3);
        threeWayQuestions += 1;
      }

      answerPositions[first.correctIndex] += 1;
      difficultyCounts[first.difficulty] += 1;
      scenarioCoverage.get(key)!.add(first.metadata.scenarioId);
      visibleVariants.get(key)!.add(JSON.stringify({
        stem: first.stem,
        rows: first.structuredPrompt.rows.map((row) => ({ sentence: row.sentence, code: row.displayedCode })),
        options: first.options.map((option) => option.value),
      }));
      generated += 1;
    }

    assert.equal(scenarioCoverage.get(key)!.size, 5, `${key} must reach all five scenarios`);
    assert.ok(visibleVariants.get(key)!.size >= 115, `${key} lacks visible variation`);
  }
}

assert.equal(generated, 4 * 120);
assert.equal(witnessedOptions, generated);
assert.equal(zeroWitnessOptions, generated * 3);
assert.equal(twoWayQuestions, 2 * 120);
assert.equal(threeWayQuestions, 2 * 120);
assert.equal(difficultyCounts.MEDIUM, 2 * 120);
assert.equal(difficultyCounts.HARD, 2 * 120);
assert.ok(Math.max(...answerPositions) / Math.min(...answerPositions) < 1.25, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);

console.log(JSON.stringify({
  checkpoint: "COD-CP-009",
  maturity: "POSSIBLE_SET_QUESTION_PROTOTYPE",
  permanentQlsCreated: 0,
  prototypeContracts: POSSIBLE_SET_PROTOTYPE_CONTRACTS.map((contract) => contract.prototypeId),
  generated,
  seedsPerContractTopology: 120,
  answerPositions,
  difficultyCounts,
  twoWayQuestions,
  threeWayQuestions,
  witnessedOptions,
  zeroWitnessOptions,
  scenarioCoverage: Object.fromEntries([...scenarioCoverage].map(([key, values]) => [key, values.size])),
  visibleVariantCounts: Object.fromEntries([...visibleVariants].map(([key, values]) => [key, values.size])),
  verdict: "PASS — POSSIBLE WORD/CODE SET QUESTION PROTOTYPES",
}, null, 2));
