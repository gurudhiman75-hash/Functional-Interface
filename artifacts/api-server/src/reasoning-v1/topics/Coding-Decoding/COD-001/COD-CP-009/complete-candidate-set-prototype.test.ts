import assert from "node:assert/strict";
import { canonicalSetKey } from "./canonical-set";
import { COMPLETE_CANDIDATE_SET_PROTOTYPE_CONTRACTS } from "./complete-candidate-set-contracts";
import { generateCompleteCandidateSetPrototypeQuestion } from "./complete-candidate-set-generator";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import type { AbstractSentenceCodePuzzle } from "./types";

const answerPositions = [0, 0, 0, 0];
const difficultyCounts = { MEDIUM: 0, HARD: 0 };
const scenarioCoverage = new Map<string, Set<string>>();
const visibleVariants = new Map<string, Set<string>>();
let generated = 0;
let witnessedCandidates = 0;
let zeroWitnessOutsideValues = 0;
let omittedTraps = 0;
let extraTraps = 0;
let replacedTraps = 0;

function displayedPuzzle(question: ReturnType<typeof generateCompleteCandidateSetPrototypeQuestion>): AbstractSentenceCodePuzzle {
  return {
    rows: question.structuredPrompt.rows.map((row) => ({
      rowId: row.statementId,
      wordIds: row.words,
      codeTokens: row.displayedCodeTokens,
    })),
  };
}

for (const contract of COMPLETE_CANDIDATE_SET_PROTOTYPE_CONTRACTS) {
  for (const topologyKind of contract.supportedTopologies) {
    const key = `${contract.prototypeId}:${topologyKind}`;
    scenarioCoverage.set(key, new Set<string>());
    visibleVariants.set(key, new Set<string>());

    for (let seed = 1; seed <= 120; seed += 1) {
      const first = generateCompleteCandidateSetPrototypeQuestion(contract.prototypeId, seed, topologyKind);
      const second = generateCompleteCandidateSetPrototypeQuestion(contract.prototypeId, seed, topologyKind);
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
      assert.equal(first.stem.toLowerCase().includes("complete set"), true);
      assert.equal(JSON.stringify(first).includes("COD-QL-"), false);
      assert.equal(JSON.stringify(first.structuredPrompt).includes("reviewerWordIds"), false);
      assert.equal(JSON.stringify(first.structuredPrompt).includes('"rowId"'), false);

      const space = solveSentenceCodeConstraints(displayedPuzzle(first));
      assert.equal(space.solutionCount, first.metadata.solutionCount);
      const expectedCandidates = contract.queryDirection === "WORD_TO_ALL_TOKENS"
        ? space.candidateTokensByWord[first.structuredPrompt.targetWord]!
        : space.candidateWordsByToken[first.structuredPrompt.targetToken]!;
      assert.equal(
        canonicalSetKey(first.structuredPrompt.completeCandidateSet),
        canonicalSetKey(expectedCandidates),
      );
      assert.equal(first.metadata.candidateCount, expectedCandidates.length);
      assert.equal(expectedCandidates.length, topologyKind === "CONTROLLED_PARTIAL_INFORMATION" ? 2 : 3);

      const activeValues = contract.queryDirection === "WORD_TO_ALL_TOKENS" ? space.activeTokens : space.activeWords;
      for (const candidate of expectedCandidates) {
        const witnesses = first.metadata.candidateWitnessCounts[candidate]!;
        assert.ok(witnesses > 0 && witnesses < space.solutionCount);
        witnessedCandidates += 1;
      }
      for (const outside of activeValues.filter((value) => !expectedCandidates.includes(value))) {
        const witnesses = contract.queryDirection === "WORD_TO_ALL_TOKENS"
          ? space.solutions.filter((solution) => solution.wordToToken[first.structuredPrompt.targetWord] === outside).length
          : space.solutions.filter((solution) => solution.wordToToken[outside] === first.structuredPrompt.targetToken).length;
        assert.equal(witnesses, 0);
        zeroWitnessOutsideValues += 1;
      }

      const correct = first.options[first.correctIndex]!;
      assert.equal(correct.canonicalValue, canonicalSetKey(expectedCandidates));
      for (const option of first.options.filter((candidate) => !candidate.isCorrect)) {
        const missing = expectedCandidates.filter((candidate) => !option.members.includes(candidate));
        const added = option.members.filter((candidate) => !expectedCandidates.includes(candidate));
        if (option.errorLabel === "CANDIDATE_OMITTED") {
          assert.equal(missing.length, 1);
          assert.equal(added.length, 0);
          assert.equal(option.members.length, expectedCandidates.length - 1);
          omittedTraps += 1;
        } else if (option.errorLabel === "IMPOSSIBLE_MEMBER_ADDED") {
          assert.equal(missing.length, 0);
          assert.equal(added.length, 1);
          assert.equal(option.members.length, expectedCandidates.length + 1);
          extraTraps += 1;
        } else {
          assert.equal(option.errorLabel, "CANDIDATE_REPLACED");
          assert.equal(missing.length, 1);
          assert.equal(added.length, 1);
          assert.equal(option.members.length, expectedCandidates.length);
          replacedTraps += 1;
        }
      }

      assert.equal(first.explanation.referenceAid.length, 2);
      assert.ok(first.explanation.quickMethod.length >= 40);
      assert.ok(first.explanation.evidenceComparison.length >= 2);
      assert.equal(/\br[1-4]\b/i.test(first.explanation.evidenceComparison.join(" ")), false);
      assert.equal(first.explanation.completenessProof.toLowerCase().includes("complete candidate set"), true);
      assert.equal(first.explanation.conclusion.includes(correct.value), true);
      assert.equal(first.explanation.commonTrapAlert.includes(first.options.find((option) => option.errorLabel === "CANDIDATE_OMITTED")!.value), true);
      assert.equal(first.explanation.commonTrapAlert.includes(first.options.find((option) => option.errorLabel === "IMPOSSIBLE_MEMBER_ADDED")!.value), true);

      if (topologyKind === "CONTROLLED_PARTIAL_INFORMATION") {
        assert.equal(first.difficulty, "MEDIUM");
        assert.equal(first.metadata.solutionCount, 2);
      } else {
        assert.equal(first.difficulty, "HARD");
        assert.equal(first.metadata.solutionCount, 6);
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
assert.deepEqual(answerPositions, [120, 120, 120, 120]);
assert.equal(difficultyCounts.MEDIUM, 2 * 120);
assert.equal(difficultyCounts.HARD, 2 * 120);
assert.equal(omittedTraps, generated);
assert.equal(extraTraps, generated);
assert.equal(replacedTraps, generated);
assert.equal(witnessedCandidates, 2 * 2 * 120 + 3 * 2 * 120);

console.log(JSON.stringify({
  checkpoint: "COD-CP-009",
  maturity: "COMPLETE_CANDIDATE_SET_QUESTION_PROTOTYPE",
  permanentQlsCreated: 0,
  prototypeContracts: COMPLETE_CANDIDATE_SET_PROTOTYPE_CONTRACTS.map((contract) => contract.prototypeId),
  generated,
  seedsPerContractTopology: 120,
  answerPositions,
  difficultyCounts,
  witnessedCandidates,
  zeroWitnessOutsideValues,
  omittedTraps,
  extraTraps,
  replacedTraps,
  scenarioCoverage: Object.fromEntries([...scenarioCoverage].map(([key, values]) => [key, values.size])),
  visibleVariantCounts: Object.fromEntries([...visibleVariants].map(([key, values]) => [key, values.size])),
  verdict: "PASS — COMPLETE CANDIDATE-SET QUESTION PROTOTYPES",
}, null, 2));
