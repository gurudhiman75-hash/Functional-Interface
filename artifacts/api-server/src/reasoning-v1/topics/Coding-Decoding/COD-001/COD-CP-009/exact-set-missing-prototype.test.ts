import assert from "node:assert/strict";
import { canonicalSetKey } from "./canonical-set";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { EXACT_SET_MISSING_PROTOTYPE_CONTRACTS } from "./exact-set-missing-contracts";
import { generateExactSetMissingPrototypeQuestion } from "./exact-set-missing-generator";
import {
  classifyTokenSetToWordsRelation,
  classifyWordsToTokenSetRelation,
  classifyWordTokenRelation,
  possibleMissingTokens,
  possibleMissingWords,
} from "./solution-space";
import type { AbstractSentenceCodePuzzle } from "./types";

const answerPositions = [0, 0, 0, 0];
const scenarioCoverage = new Map<string, Set<string>>();
const visibleVariants = new Map<string, Set<string>>();
let generated = 0;
let activeDistractorsChecked = 0;
let phraseQuestions = 0;
let missingQuestions = 0;
let ambiguityTrapQuestions = 0;

function reconstructedPuzzle(question: ReturnType<typeof generateExactSetMissingPrototypeQuestion>): AbstractSentenceCodePuzzle {
  return {
    rows: question.structuredPrompt.rows.map((row) => {
      if (question.structuredPrompt.kind === "MISSING_TOKEN" && row.statementId === question.structuredPrompt.incompleteStatementId) {
        return {
          rowId: row.statementId,
          wordIds: row.words,
          codeTokens: row.displayedCodeTokens.map((token) => token === "?" ? question.structuredPrompt.correctToken : token),
        };
      }
      if (question.structuredPrompt.kind === "MISSING_WORD" && row.statementId === question.structuredPrompt.incompleteStatementId) {
        return {
          rowId: row.statementId,
          wordIds: row.words.map((word) => word === "_____" ? question.structuredPrompt.correctWord : word),
          codeTokens: row.displayedCodeTokens,
        };
      }
      return {
        rowId: row.statementId,
        wordIds: row.words,
        codeTokens: row.displayedCodeTokens,
      };
    }),
  };
}

for (const contract of EXACT_SET_MISSING_PROTOTYPE_CONTRACTS) {
  scenarioCoverage.set(contract.prototypeId, new Set<string>());
  visibleVariants.set(contract.prototypeId, new Set<string>());

  for (let seed = 1; seed <= 120; seed += 1) {
    const first = generateExactSetMissingPrototypeQuestion(contract.prototypeId, seed);
    const second = generateExactSetMissingPrototypeQuestion(contract.prototypeId, seed);
    assert.deepEqual(first, second, `${contract.prototypeId}/${seed} must be deterministic`);
    assert.equal(first.permanentQlId, null);
    assert.equal(first.prototypeOnly, true);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(JSON.stringify(first).includes("COD-QL-"), false);
    assert.equal(JSON.stringify(first.structuredPrompt).includes("reviewerWordIds"), false);
    assert.equal(JSON.stringify(first.structuredPrompt).includes('"rowId"'), false);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => option.canonicalValue)).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(first.options[first.correctIndex]!.isCorrect, true);
    assert.equal(first.stem.startsWith("In a certain code language, "), true);
    assert.equal(first.stem.includes("The order of the code words is not necessarily the same"), true);
    assert.equal(first.stem.includes("prototype"), false);
    assert.equal(first.stem.includes("topology"), false);
    assert.deepEqual(
      first.structuredPrompt.rows.map((row) => row.statementId),
      first.structuredPrompt.rows.map((_, index) => `statement-${index + 1}`),
    );

    const puzzle = reconstructedPuzzle(first);
    const space = solveSentenceCodeConstraints(puzzle);
    assert.equal(space.solutionCount, first.metadata.solutionCount);
    const correct = first.options[first.correctIndex]!;

    if (first.structuredPrompt.kind === "EXACT_PHRASE_TO_TOKENS") {
      assert.equal(first.answerType, "CODE_TOKEN_SET");
      assert.equal(space.solutionCount, 2);
      assert.equal(first.metadata.individualPairAmbiguity, true);
      assert.equal(
        classifyWordsToTokenSetRelation(space, first.structuredPrompt.phraseWords, first.structuredPrompt.phraseTokens),
        "DEFINITE",
      );
      assert.equal(
        classifyWordTokenRelation(space, first.structuredPrompt.phraseWords[0]!, first.structuredPrompt.phraseTokens[0]!),
        "POSSIBLE",
      );
      assert.equal(correct.canonicalValue, canonicalSetKey(first.structuredPrompt.phraseTokens));
      for (const option of first.options.filter((candidate) => !candidate.isCorrect && candidate.value !== "Cannot be determined")) {
        assert.equal(
          classifyWordsToTokenSetRelation(space, first.structuredPrompt.phraseWords, option.canonicalValue.split("\u001f")),
          "IMPOSSIBLE",
        );
        activeDistractorsChecked += 1;
      }
      phraseQuestions += 1;
    } else if (first.structuredPrompt.kind === "EXACT_TOKENS_TO_PHRASE") {
      assert.equal(first.answerType, "WORD_SET");
      assert.equal(space.solutionCount, 2);
      assert.equal(first.metadata.individualPairAmbiguity, true);
      assert.equal(
        classifyTokenSetToWordsRelation(space, first.structuredPrompt.phraseTokens, first.structuredPrompt.phraseWords),
        "DEFINITE",
      );
      assert.equal(correct.canonicalValue, canonicalSetKey(first.structuredPrompt.phraseWords));
      for (const option of first.options.filter((candidate) => !candidate.isCorrect && candidate.value !== "Cannot be determined")) {
        assert.equal(
          classifyTokenSetToWordsRelation(space, first.structuredPrompt.phraseTokens, option.canonicalValue.split("\u001f")),
          "IMPOSSIBLE",
        );
        activeDistractorsChecked += 1;
      }
      phraseQuestions += 1;
    } else if (first.structuredPrompt.kind === "MISSING_TOKEN") {
      assert.equal(first.answerType, "CODE_TOKEN");
      assert.equal(first.metadata.individualPairAmbiguity, false);
      assert.equal((first.structuredPrompt.displayedCodeWithBlank.match(/\?/g) ?? []).length, 1);
      assert.equal(first.structuredPrompt.incompleteStatementId, "statement-1");
      assert.deepEqual(
        possibleMissingTokens(
          space,
          first.structuredPrompt.incompleteSentence.split(/\s+/),
          first.structuredPrompt.knownTokens,
        ),
        [first.structuredPrompt.correctToken],
      );
      assert.equal(correct.value, first.structuredPrompt.correctToken);
      for (const option of first.options.filter((candidate) => !candidate.isCorrect && candidate.value !== "Cannot be determined")) {
        assert.notEqual(option.value, first.structuredPrompt.correctToken);
        activeDistractorsChecked += 1;
      }
      missingQuestions += 1;
    } else {
      assert.equal(first.answerType, "WORD");
      assert.equal(first.metadata.individualPairAmbiguity, false);
      assert.equal((first.structuredPrompt.displayedSentenceWithBlank.match(/_____/g) ?? []).length, 1);
      assert.equal(first.structuredPrompt.incompleteStatementId, "statement-1");
      const incompleteRow = first.structuredPrompt.rows.find((row) => row.statementId === "statement-1")!;
      assert.deepEqual(
        possibleMissingWords(
          space,
          first.structuredPrompt.fullCodeTokens,
          incompleteRow.words.filter((word) => word !== "_____"),
        ),
        [first.structuredPrompt.correctWord],
      );
      assert.equal(correct.value, first.structuredPrompt.correctWord);
      for (const option of first.options.filter((candidate) => !candidate.isCorrect && candidate.value !== "Cannot be determined")) {
        assert.notEqual(option.value, first.structuredPrompt.correctWord);
        activeDistractorsChecked += 1;
      }
      missingQuestions += 1;
    }

    const cannotOption = first.options.find((option) => option.value === "Cannot be determined");
    assert.ok(cannotOption);
    assert.equal(cannotOption!.isCorrect, false);
    if (contract.topologyKind === "PHRASE_SET_COMPOSITION") {
      assert.equal(cannotOption!.errorLabel, "INDIVIDUAL_AMBIGUITY_CONFUSED_WITH_SET_AMBIGUITY");
      ambiguityTrapQuestions += 1;
    } else {
      assert.equal(cannotOption!.errorLabel, "UNRESOLVED_ASSUMED");
    }

    assert.equal(first.explanation.referenceAid.length, 2);
    assert.ok(first.explanation.quickMethod.length >= 40);
    assert.ok(first.explanation.evidenceComparison.length >= 2);
    assert.equal(/\br[1-4]\b/i.test(first.explanation.evidenceComparison.join(" ")), false);
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
  assert.ok(visibleVariants.get(contract.prototypeId)!.size >= 115, `${contract.prototypeId} lacks visible variation`);
}

assert.equal(generated, 4 * 120);
assert.equal(phraseQuestions, 2 * 120);
assert.equal(missingQuestions, 2 * 120);
assert.equal(ambiguityTrapQuestions, 2 * 120);
assert.equal(activeDistractorsChecked, generated * 2);
assert.ok(Math.max(...answerPositions) / Math.min(...answerPositions) < 1.25, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);

console.log(JSON.stringify({
  checkpoint: "COD-CP-009",
  maturity: "EXACT_SET_MISSING_QUESTION_PROTOTYPE",
  permanentQlsCreated: 0,
  prototypeContracts: EXACT_SET_MISSING_PROTOTYPE_CONTRACTS.map((contract) => contract.prototypeId),
  generated,
  seedsPerContract: 120,
  answerPositions,
  phraseQuestions,
  missingQuestions,
  ambiguityTrapQuestions,
  activeDistractorsChecked,
  scenarioCoverage: Object.fromEntries([...scenarioCoverage].map(([key, values]) => [key, values.size])),
  visibleVariantCounts: Object.fromEntries([...visibleVariants].map(([key, values]) => [key, values.size])),
  verdict: "PASS — EXACT SET AND MISSING-MEMBER QUESTION PROTOTYPES",
}, null, 2));
