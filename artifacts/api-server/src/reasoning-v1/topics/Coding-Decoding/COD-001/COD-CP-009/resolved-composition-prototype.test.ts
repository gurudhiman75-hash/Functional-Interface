import assert from "node:assert/strict";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { getEnglishSentenceCodeLexeme } from "./datasets/lexemes.en";
import { verifySentenceCodeConstraintsBruteForce } from "./independent-verifier";
import { analyzeSentenceCodeRowMinimality } from "./row-minimality";
import { RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS } from "./resolved-composition-contracts";
import { generateResolvedCompositionPrototypeQuestion } from "./resolved-composition-generator";
import {
  classifyTokenSetToWordsRelation,
  classifyWordsToTokenSetRelation,
} from "./solution-space";
import type { AbstractSentenceCodePuzzle, AbstractSentenceCodeQuery } from "./types";

const answerPositions = [0, 0, 0, 0];
const scenarioCoverage = new Map<string, Set<string>>();
const visibleVariants = new Map<string, Set<string>>();
let generated = 0;
let dualSolverMappings = 0;
let minimalityChecks = 0;
let impossibleDistractors = 0;
let naturalInverseOptions = 0;

function displayedPuzzle(question: ReturnType<typeof generateResolvedCompositionPrototypeQuestion>): AbstractSentenceCodePuzzle {
  return {
    rows: question.structuredPrompt.rows.map((row) => ({
      rowId: row.statementId,
      wordIds: row.words,
      codeTokens: row.displayedCodeTokens,
    })),
  };
}

for (const contract of RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS) {
  scenarioCoverage.set(contract.prototypeId, new Set<string>());
  visibleVariants.set(contract.prototypeId, new Set<string>());

  for (let seed = 1; seed <= 120; seed += 1) {
    const first = generateResolvedCompositionPrototypeQuestion(contract.prototypeId, seed);
    const second = generateResolvedCompositionPrototypeQuestion(contract.prototypeId, seed);
    assert.deepEqual(first, second, `${contract.prototypeId}/${seed} must be deterministic`);
    assert.equal(first.permanentQlId, null);
    assert.equal(first.prototypeOnly, true);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.difficulty, "MEDIUM");
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => option.canonicalValue)).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(first.options[first.correctIndex]!.isCorrect, true);
    assert.equal(first.stem.startsWith("In a certain code language, "), true);
    assert.equal(first.stem.includes("The order of the code words is not necessarily the same"), true);
    assert.equal(JSON.stringify(first).includes("COD-QL-"), false);
    assert.equal(JSON.stringify(first.structuredPrompt).includes("reviewerWordIds"), false);
    assert.equal(JSON.stringify(first.structuredPrompt).includes('"rowId"'), false);
    assert.equal(
      first.structuredPrompt.rows.some((row) =>
        first.structuredPrompt.targetWords.every((word) => row.words.includes(word))),
      false,
      "The queried word pair must not be displayed",
    );

    if (contract.queryDirection === "TOKENS_TO_WORDS") {
      for (const option of first.options) {
        const parts = option.members.map((member) => getEnglishSentenceCodeLexeme(member).partOfSpeech);
        assert.equal(parts.filter((part) => part === "NOUN").length, 1, `${option.value} must contain one noun`);
        assert.equal(parts.filter((part) => part === "VERB").length, 1, `${option.value} must contain one verb`);
        const displayed = option.value.split(/\s+/);
        assert.equal(getEnglishSentenceCodeLexeme(displayed[0]!).partOfSpeech, "NOUN");
        assert.equal(getEnglishSentenceCodeLexeme(displayed[1]!).partOfSpeech, "VERB");
        naturalInverseOptions += 1;
      }
    }

    const puzzle = displayedPuzzle(first);
    const production = solveSentenceCodeConstraints(puzzle);
    const verifier = verifySentenceCodeConstraintsBruteForce(puzzle, { maxAssignments: 10_000 });
    assert.equal(production.solutionCount, 1);
    assert.equal(verifier.solutionCount, 1);
    assert.deepEqual(production.candidateTokensByWord, verifier.candidateTokensByWord);
    assert.deepEqual(production.candidateWordsByToken, verifier.candidateWordsByToken);
    dualSolverMappings += production.solutionCount;

    const query: AbstractSentenceCodeQuery = contract.queryDirection === "WORDS_TO_TOKENS"
      ? { kind: "WORDS_TO_TOKEN_SET", wordIds: first.structuredPrompt.targetWords }
      : { kind: "TOKEN_SET_TO_WORDS", tokens: first.structuredPrompt.targetTokens };
    const minimality = analyzeSentenceCodeRowMinimality(puzzle, query);
    assert.equal(minimality.allRowsContribute, true, `${contract.prototypeId}/${seed} has a redundant row`);
    minimalityChecks += minimality.rows.length;

    for (const option of first.options) {
      const relation = contract.queryDirection === "WORDS_TO_TOKENS"
        ? classifyWordsToTokenSetRelation(production, first.structuredPrompt.targetWords, option.members)
        : classifyTokenSetToWordsRelation(production, first.structuredPrompt.targetTokens, option.members);
      assert.equal(relation, option.isCorrect ? "DEFINITE" : "IMPOSSIBLE");
      if (!option.isCorrect) impossibleDistractors += 1;
    }

    const correct = first.options[first.correctIndex]!;
    assert.equal(first.explanation.referenceAid.length, 2);
    assert.equal(first.explanation.branchProofs.length, 2);
    assert.equal(/\br[1-4]\b/i.test(first.explanation.branchProofs.join(" ")), false);
    assert.equal(first.explanation.composition.includes(correct.value), true);
    assert.equal(first.explanation.composition.includes("combination the words"), false);
    assert.equal(first.explanation.conclusion.includes(correct.value), true);
    assert.equal(
      first.options.filter((option) => !option.isCorrect).some((option) => first.explanation.commonTrapAlert.includes(option.value)),
      true,
    );

    answerPositions[first.correctIndex] += 1;
    scenarioCoverage.get(contract.prototypeId)!.add(first.metadata.scenarioId);
    visibleVariants.get(contract.prototypeId)!.add(JSON.stringify({
      stem: first.stem,
      rows: first.structuredPrompt.rows.map((row) => ({ sentence: row.sentence, code: row.displayedCode })),
      options: first.options.map((option) => option.value),
    }));
    generated += 1;
  }

  assert.equal(scenarioCoverage.get(contract.prototypeId)!.size, 5);
  assert.ok(visibleVariants.get(contract.prototypeId)!.size >= 115, `${contract.prototypeId} lacks variation`);
}

assert.equal(generated, 2 * 120);
assert.equal(dualSolverMappings, generated);
assert.equal(minimalityChecks, generated * 4);
assert.equal(impossibleDistractors, generated * 3);
assert.equal(naturalInverseOptions, 120 * 4);
assert.deepEqual(answerPositions, [60, 60, 60, 60]);

console.log(JSON.stringify({
  checkpoint: "COD-CP-009",
  maturity: "RESOLVED_COMPOSITION_QUESTION_PROTOTYPE",
  permanentQlsCreated: 0,
  prototypeContracts: RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS.map((contract) => contract.prototypeId),
  generated,
  seedsPerContract: 120,
  answerPositions,
  dualSolverMappings,
  minimalityChecks,
  impossibleDistractors,
  naturalInverseOptions,
  scenarioCoverage: Object.fromEntries([...scenarioCoverage].map(([key, values]) => [key, values.size])),
  visibleVariantCounts: Object.fromEntries([...visibleVariants].map(([key, values]) => [key, values.size])),
  verdict: "PASS — RESOLVED COMPONENT COMPOSITION PROTOTYPES",
}, null, 2));
