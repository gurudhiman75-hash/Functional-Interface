import assert from "node:assert/strict";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS } from "./possible-impossible-contracts";
import { generatePossibleImpossiblePrototypeQuestion } from "./possible-impossible-generator";
import {
  classifyTokenWordRelation,
  classifyWordTokenRelation,
} from "./solution-space";
import type { AbstractSentenceCodePuzzle } from "./types";

const answerPositions = [0, 0, 0, 0];
const scenarioCoverage = new Map<string, Set<string>>();
const visibleVariants = new Map<string, Set<string>>();
const solutionCounts = new Map<string, Set<number>>();
const candidateCounts = new Map<string, Set<number>>();
let generated = 0;
let possibleQuestions = 0;
let impossibleQuestions = 0;
let possibleWitnessOptions = 0;
let zeroWitnessOptions = 0;

function displayedPuzzle(question: ReturnType<typeof generatePossibleImpossiblePrototypeQuestion>): AbstractSentenceCodePuzzle {
  return {
    rows: question.structuredPrompt.rows.map((row) => ({
      rowId: row.statementId,
      wordIds: row.words,
      codeTokens: row.displayedCodeTokens,
    })),
  };
}

for (const contract of POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS) {
  for (const topologyKind of contract.supportedTopologies) {
    const key = `${contract.prototypeId}:${topologyKind}`;
    scenarioCoverage.set(key, new Set<string>());
    visibleVariants.set(key, new Set<string>());
    solutionCounts.set(key, new Set<number>());
    candidateCounts.set(key, new Set<number>());

    for (let seed = 1; seed <= 120; seed += 1) {
      const first = generatePossibleImpossiblePrototypeQuestion(contract.prototypeId, seed, topologyKind);
      const second = generatePossibleImpossiblePrototypeQuestion(contract.prototypeId, seed, topologyKind);
      assert.deepEqual(first, second, `${key}/${seed} must be deterministic`);
      assert.equal(first.permanentQlId, null);
      assert.equal(first.prototypeOnly, true);
      assert.equal(first.publiclyPublishable, false);
      assert.equal(first.difficulty, "MEDIUM");
      assert.equal(first.topologyKind, topologyKind);
      assert.equal(first.options.length, 4);
      assert.equal(new Set(first.options.map((option) => option.value)).size, 4);
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
        const classification = contract.queryDirection === "WORD_TO_TOKEN"
          ? classifyWordTokenRelation(
            space,
            first.structuredPrompt.targetWord,
            option.value,
          )
          : classifyTokenWordRelation(
            space,
            first.structuredPrompt.targetToken,
            option.value,
          );
        const witnessCount = first.metadata.optionWitnessCounts[option.value]!;
        assert.equal(witnessCount, option.witnessCount);

        if (contract.predicate === "POSSIBLE") {
          if (option.isCorrect) {
            assert.equal(classification, "POSSIBLE");
            assert.ok(witnessCount > 0 && witnessCount < space.solutionCount);
            possibleWitnessOptions += 1;
          } else {
            assert.equal(classification, "IMPOSSIBLE");
            assert.equal(witnessCount, 0);
            assert.equal(option.errorLabel, "ZERO_WITNESS");
            zeroWitnessOptions += 1;
          }
        } else if (option.isCorrect) {
          assert.equal(classification, "IMPOSSIBLE");
          assert.equal(witnessCount, 0);
          zeroWitnessOptions += 1;
        } else {
          assert.equal(classification, "POSSIBLE");
          assert.ok(witnessCount > 0 && witnessCount < space.solutionCount);
          assert.equal(option.errorLabel, "POSSIBLE_WITNESS");
          possibleWitnessOptions += 1;
        }
      }

      if (contract.predicate === "POSSIBLE") {
        assert.ok(first.metadata.correctWitnessCount > 0);
        assert.ok(first.metadata.correctWitnessCount < first.metadata.solutionCount);
        possibleQuestions += 1;
      } else {
        assert.equal(first.metadata.correctWitnessCount, 0);
        assert.equal(first.metadata.targetCandidateCount, 3);
        assert.equal(first.metadata.solutionCount, 6);
        impossibleQuestions += 1;
      }

      assert.equal(first.explanation.referenceAid.length, 2);
      assert.ok(first.explanation.quickMethod.length >= 40);
      assert.ok(first.explanation.evidenceComparison.length >= 2);
      assert.equal(/\br[1-4]\b/i.test(first.explanation.evidenceComparison.join(" ")), false);
      assert.equal(first.explanation.witnessOrExclusion.includes(correct.value), true);
      assert.equal(first.explanation.conclusion.includes(correct.value), true);
      assert.equal(
        first.options.filter((option) => !option.isCorrect).some((option) => first.explanation.commonTrapAlert.includes(option.value)),
        true,
      );

      answerPositions[first.correctIndex] += 1;
      scenarioCoverage.get(key)!.add(first.metadata.scenarioId);
      visibleVariants.get(key)!.add(JSON.stringify({
        stem: first.stem,
        rows: first.structuredPrompt.rows.map((row) => ({ sentence: row.sentence, code: row.displayedCode })),
        options: first.options.map((option) => option.value),
      }));
      solutionCounts.get(key)!.add(first.metadata.solutionCount);
      candidateCounts.get(key)!.add(first.metadata.targetCandidateCount);
      generated += 1;
    }

    assert.equal(scenarioCoverage.get(key)!.size, 5, `${key} must reach all five scenarios`);
    assert.ok(visibleVariants.get(key)!.size >= 115, `${key} lacks visible variation`);
    assert.equal(solutionCounts.get(key)!.size, 1, `${key} solution count drifted`);
    assert.equal(candidateCounts.get(key)!.size, 1, `${key} candidate count drifted`);
  }
}

assert.equal(generated, 6 * 120);
assert.equal(possibleQuestions, 4 * 120);
assert.equal(impossibleQuestions, 2 * 120);
assert.equal(possibleWitnessOptions, possibleQuestions + impossibleQuestions * 3);
assert.equal(zeroWitnessOptions, possibleQuestions * 3 + impossibleQuestions);
assert.ok(Math.max(...answerPositions) / Math.min(...answerPositions) < 1.25, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);

console.log(JSON.stringify({
  checkpoint: "COD-CP-009",
  maturity: "POSSIBLE_IMPOSSIBLE_QUESTION_PROTOTYPE",
  permanentQlsCreated: 0,
  prototypeContracts: POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS.map((contract) => contract.prototypeId),
  generated,
  seedsPerContractTopology: 120,
  answerPositions,
  possibleQuestions,
  impossibleQuestions,
  possibleWitnessOptions,
  zeroWitnessOptions,
  scenarioCoverage: Object.fromEntries([...scenarioCoverage].map(([key, values]) => [key, values.size])),
  visibleVariantCounts: Object.fromEntries([...visibleVariants].map(([key, values]) => [key, values.size])),
  solutionCounts: Object.fromEntries([...solutionCounts].map(([key, values]) => [key, [...values]])),
  candidateCounts: Object.fromEntries([...candidateCounts].map(([key, values]) => [key, [...values]])),
  verdict: "PASS — POSSIBLE AND IMPOSSIBLE SENTENCE-CODE QUESTION PROTOTYPES",
}, null, 2));
