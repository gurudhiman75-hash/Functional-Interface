import assert from "node:assert/strict";

import {
  WFM_REARRANGEMENT_FIXTURES,
  WFM_SELECTED_LETTER_FIXTURES,
  rearrangementFixtureDifficulty,
  selectedFixtureDifficulty,
  selectedFixtureLetters,
} from "./authorities";
import {
  WFM_BANKING_ORDERED_EXTRACTION_FIXTURES,
  extractOrderedBankingLetters,
} from "./banking-authorities";
import { WFM_CANDIDATE_WORDS, WFM_SOURCE_WORDS } from "./lexicon";
import { WFM_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";
import { buildWfm001ReviewPack, renderWfm001ReviewMarkdown } from "./review-pack";
import { generateWfm001Question, WFM_001_QL_IDS } from "./runtime";
import { applyNumberSequence, independentAnagram, solveDirectWfm } from "./solver";
import type { WfmDifficulty, WfmGeneratedQuestion, WfmQlId } from "./types";

const DIFFICULTIES: readonly WfmDifficulty[] = ["EASY", "MEDIUM", "HARD"];
const LEGACY_QLS: readonly WfmQlId[] = ["WFM-QL-001", "WFM-QL-002", "WFM-QL-003", "WFM-QL-004"];
const BANKING_QLS: readonly WfmQlId[] = ["WFM-QL-003", "WFM-QL-005", "WFM-QL-006"];

assert(WFM_CANDIDATE_WORDS.length >= 500, "WFM candidate corpus must remain broad.");
assert(WFM_SOURCE_WORDS.length >= 18, "WFM direct source pool must remain broad.");
assert.equal(new Set(WFM_SOURCE_WORDS).size, WFM_SOURCE_WORDS.length);
assert.deepEqual(WFM_001_QL_IDS, [
  "WFM-QL-001",
  "WFM-QL-002",
  "WFM-QL-003",
  "WFM-QL-004",
  "WFM-QL-005",
  "WFM-QL-006",
]);
assert.equal(WFM_SELECTED_LETTER_FIXTURES.length >= 12, true);
assert.equal(WFM_REARRANGEMENT_FIXTURES.length >= 15, true);
assert.equal(WFM_BANKING_ORDERED_EXTRACTION_FIXTURES.length >= 12, true);

for (const difficulty of DIFFICULTIES) {
  assert(WFM_SELECTED_LETTER_FIXTURES.some((fixture) => selectedFixtureDifficulty(fixture) === difficulty), `Selected-letter authority misses ${difficulty}.`);
  assert(WFM_REARRANGEMENT_FIXTURES.some((fixture) => rearrangementFixtureDifficulty(fixture) === difficulty), `Rearrangement authority misses ${difficulty}.`);
  assert(WFM_BANKING_ORDERED_EXTRACTION_FIXTURES.some((fixture) => fixture.difficulty === difficulty), `Banking ordered-extraction authority misses ${difficulty}.`);
}
assert(WFM_REARRANGEMENT_FIXTURES.filter((fixture) => rearrangementFixtureDifficulty(fixture) === "EASY").length >= 4);
assert(WFM_REARRANGEMENT_FIXTURES.some((fixture) => fixture.mode === "JUMBLED_WORD"));
assert(WFM_REARRANGEMENT_FIXTURES.some((fixture) => fixture.mode === "NUMBERED_SEQUENCE"));
assert(WFM_BANKING_ORDERED_EXTRACTION_FIXTURES.some((fixture) => fixture.mode === "SINGLE_WORD_POSITIONS"));
assert(WFM_BANKING_ORDERED_EXTRACTION_FIXTURES.some((fixture) => fixture.mode === "MULTI_WORD_POSITIONS"));

for (const fixture of WFM_BANKING_ORDERED_EXTRACTION_FIXTURES) {
  assert.equal(fixture.options.filter((option) => option.meaningful).length, 1, `${fixture.id} must have one meaningful extraction`);
  for (const option of fixture.options) {
    assert.equal(extractOrderedBankingLetters(option), option.expectedExtraction, `${fixture.id} extraction drift`);
  }
}

function optionIndex(question: WfmGeneratedQuestion): number {
  const index = question.options.findIndex((option) => option.id === question.correctOptionId);
  assert(index >= 0, `${question.qlId}/${question.seed} correct option id missing.`);
  return index;
}

function solveQuestion(question: WfmGeneratedQuestion): number {
  if (question.qlId === "WFM-QL-001" || question.qlId === "WFM-QL-002") {
    return solveDirectWfm(
      question.sourceWord!,
      question.options.map((option) => option.text),
      question.qlId === "WFM-QL-001" ? "CAN_FORM" : "CANNOT_FORM",
    );
  }

  if (question.qlId === "WFM-QL-003") {
    const prompt = question.structuredPrompt as { acceptedCommonWords: readonly string[] };
    const correctCount = String(prompt.acceptedCommonWords.length);
    const matches = question.options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => option.text === correctCount);
    assert.equal(matches.length, 1, `${question.qlId}/${question.seed} selected count is ambiguous.`);
    return matches[0]!.index;
  }

  if (question.qlId === "WFM-QL-004") {
    const prompt = question.structuredPrompt as { mode: string; scrambled: string; targetWord: string };
    if (prompt.mode === "JUMBLED_WORD") {
      const matches = question.options
        .map((option, index) => ({ option, index }))
        .filter(({ option }) => independentAnagram(prompt.scrambled, option.text));
      assert.equal(matches.length, 1, `${question.qlId}/${question.seed} jumbled item is ambiguous.`);
      return matches[0]!.index;
    }
    const matches = question.options
      .map((option, index) => ({ option, index, word: applyNumberSequence(prompt.scrambled, option.text) }))
      .filter(({ word }) => word === prompt.targetWord);
    assert.equal(matches.length, 1, `${question.qlId}/${question.seed} numbered item is ambiguous.`);
    return matches[0]!.index;
  }

  if (question.qlId === "WFM-QL-005") {
    const matches = question.options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => option.provenance === "MEANINGFUL_ORDERED_EXTRACTION");
    assert.equal(matches.length, 1, `${question.qlId}/${question.seed} ordered extraction is ambiguous.`);
    return matches[0]!.index;
  }

  const prompt = question.structuredPrompt as {
    acceptedCommonWords: readonly string[];
    requestedPosition: number;
    sentinelConvention: "NONE_X_MULTI_Y" | "MULTI_X_NONE_Y";
  };
  let answer: string;
  if (prompt.acceptedCommonWords.length === 0) {
    answer = prompt.sentinelConvention === "NONE_X_MULTI_Y" ? "X" : "Y";
  } else if (prompt.acceptedCommonWords.length > 1) {
    answer = prompt.sentinelConvention === "NONE_X_MULTI_Y" ? "Y" : "X";
  } else {
    answer = prompt.acceptedCommonWords[0]!.toUpperCase()[prompt.requestedPosition - 1]!;
  }
  const matches = question.options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => option.text === answer);
  assert.equal(matches.length, 1, `${question.qlId}/${question.seed} unique-word output is ambiguous.`);
  return matches[0]!.index;
}

const summary: Record<string, unknown> = {};

for (const qlId of LEGACY_QLS) {
  const answerPositions = [0, 0, 0, 0];
  const visible = new Set<string>();
  const sources = new Set<string>();
  const sourcesByDifficulty: Record<WfmDifficulty, Set<string>> = {
    EASY: new Set(), MEDIUM: new Set(), HARD: new Set(),
  };
  const renderers = new Set<string>();
  const reachedDifficulties = new Set<WfmDifficulty>();
  let generated = 0;

  for (const difficulty of DIFFICULTIES) {
    for (let sample = 0; sample < 80; sample += 1) {
      const seed = sample * 31 + difficulty.charCodeAt(0) * 17 + Number(qlId.slice(-3));
      const question = generateWfm001Question({ qlId, seed, language: "en-IN", examProfile: "SSC_CGL_4", difficulty });
      const replay = generateWfm001Question({ qlId, seed, language: "en-IN", examProfile: "SSC_CGL_4", difficulty });
      assert.deepEqual(replay, question, `${qlId}/${difficulty}/${seed} must replay deterministically.`);
      assert.equal(question.difficulty, difficulty, `${qlId}/${seed} failed requested difficulty.`);
      assert.equal(question.options.length, 4);
      assert.equal(question.metadata.optionCount, 4);
      assert.equal(new Set(question.options.map((option) => option.text)).size, 4);
      assert.equal(question.metadata.lifecycle, "REVIEW_ONLY");
      assert.equal(question.metadata.questionStudioVisible, false);
      assert.equal(question.metadata.questionBankStored, false);
      assert.equal(question.metadata.testEligible, false);
      assert.equal(question.metadata.mockTestEligible, false);
      assert.equal(question.metadata.publiclyPublishable, false);
      assert.equal(question.metadata.difficultyBasis, "GENERATED_INSTANCE");
      assert.equal(question.metadata.ownershipDecision, "APPROVED_REAS_WFM");

      const solved = solveQuestion(question);
      assert.equal(solved, optionIndex(question), `${qlId}/${seed} independent solve disagrees.`);

      if (qlId === "WFM-QL-001" || qlId === "WFM-QL-002") {
        assert(question.sourceWord);
        sources.add(question.sourceWord!);
        sourcesByDifficulty[difficulty].add(question.sourceWord!);
        const correctLength = question.options[solved]!.text.length;
        assert(question.options.every((option) => Math.abs(option.text.length - correctLength) <= 2));
      }
      if (qlId === "WFM-QL-003") {
        const prompt = question.structuredPrompt as { positions: readonly number[]; selectedLetters: string; acceptedCommonWords: readonly string[] };
        assert.equal(prompt.positions.length, prompt.selectedLetters.length);
        assert.equal(prompt.acceptedCommonWords.length, Number(question.options[solved]!.text));
        const sourceKey = `${question.sourceWord}:${prompt.positions.join("-")}`;
        sources.add(sourceKey);
        sourcesByDifficulty[difficulty].add(sourceKey);
        if (difficulty === "HARD") assert(prompt.selectedLetters.length >= 4);
      }
      if (qlId === "WFM-QL-004") {
        const prompt = question.structuredPrompt as { targetWord: string };
        sources.add(prompt.targetWord);
        sourcesByDifficulty[difficulty].add(prompt.targetWord);
        renderers.add(question.renderer);
      }

      answerPositions[solved] += 1;
      reachedDifficulties.add(question.difficulty);
      renderers.add(question.renderer);
      visible.add(`${question.stem}|${question.options.map((option) => option.text).join("|")}`);
      generated += 1;
    }
  }

  assert.deepEqual([...reachedDifficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
  assert(answerPositions.every((count) => count >= 25), `${qlId} answer positions are too skewed: ${answerPositions.join("/")}.`);
  assert(visible.size >= generated * 0.65, `${qlId} visible diversity is too low: ${visible.size}/${generated}.`);

  if (qlId === "WFM-QL-001" || qlId === "WFM-QL-002") {
    assert(sources.size >= 12);
    for (const difficulty of DIFFICULTIES) assert(sourcesByDifficulty[difficulty].size >= 12);
  }
  if (qlId === "WFM-QL-003") {
    assert(sources.size >= 8);
    assert(sourcesByDifficulty.EASY.size >= 3);
    assert(sourcesByDifficulty.MEDIUM.size >= 3);
    assert(sourcesByDifficulty.HARD.size >= 3);
  }
  if (qlId === "WFM-QL-004") {
    assert(sources.size >= 9);
    assert(sourcesByDifficulty.EASY.size >= 4);
    assert(sourcesByDifficulty.MEDIUM.size >= 4);
    assert(sourcesByDifficulty.HARD.size >= 3);
    assert(renderers.has("JUMBLED_WORD") && renderers.has("NUMBERED_SEQUENCE"));
  }

  summary[`${qlId}:SSC`] = { generated, answerPositions, visible: visible.size, sources: sources.size, renderers: [...renderers].sort() };
}

for (const qlId of BANKING_QLS) {
  const answerPositions = [0, 0, 0, 0, 0];
  const visible = new Set<string>();
  const sourceKeys = new Set<string>();
  const renderers = new Set<string>();
  const sentinelConventions = new Set<string>();
  let generated = 0;

  for (const difficulty of DIFFICULTIES) {
    for (let sample = 0; sample < 80; sample += 1) {
      const seed = sample * 43 + difficulty.charCodeAt(0) * 19 + Number(qlId.slice(-3));
      const question = generateWfm001Question({ qlId, seed, language: "en-IN", examProfile: "BANKING_5", difficulty });
      const replay = generateWfm001Question({ qlId, seed, language: "en-IN", examProfile: "BANKING_5", difficulty });
      assert.deepEqual(replay, question, `${qlId}/BANKING/${difficulty}/${seed} must replay deterministically.`);
      assert.equal(question.difficulty, difficulty);
      assert.equal(question.examProfile, "BANKING_5");
      assert.equal(question.options.length, 5);
      assert.equal(question.metadata.optionCount, 5);
      assert.equal(new Set(question.options.map((option) => option.text)).size, 5);
      assert.equal(question.metadata.lifecycle, "REVIEW_ONLY");
      assert.equal(question.metadata.questionStudioVisible, false);
      assert.equal(question.metadata.questionBankStored, false);
      assert.equal(question.metadata.testEligible, false);
      assert.equal(question.metadata.mockTestEligible, false);
      assert.equal(question.metadata.publiclyPublishable, false);
      assert.equal(question.metadata.difficultyBasis, "GENERATED_INSTANCE");
      assert.equal(question.metadata.ownershipDecision, "APPROVED_REAS_WFM");

      const solved = solveQuestion(question);
      assert.equal(solved, optionIndex(question), `${qlId}/BANKING/${seed} independent solve disagrees.`);
      answerPositions[solved] += 1;
      visible.add(`${question.stem}|${question.options.map((option) => option.text).join("|")}`);
      renderers.add(question.renderer);

      if (qlId === "WFM-QL-003") {
        const prompt = question.structuredPrompt as { positions: readonly number[] };
        sourceKeys.add(`${question.sourceWord}:${prompt.positions.join("-")}`);
      } else if (qlId === "WFM-QL-005") {
        const prompt = question.structuredPrompt as { fixtureId: string };
        sourceKeys.add(prompt.fixtureId);
      } else {
        const prompt = question.structuredPrompt as { sourceWord: string; positions: readonly number[]; sentinelConvention: string };
        sourceKeys.add(`${prompt.sourceWord}:${prompt.positions.join("-")}`);
        sentinelConventions.add(prompt.sentinelConvention);
      }
      generated += 1;
    }
  }

  assert(answerPositions.every((count) => count >= 20), `${qlId} Banking answer positions are too skewed: ${answerPositions.join("/")}.`);
  assert(visible.size >= 40, `${qlId} Banking visible diversity is too low: ${visible.size}.`);
  if (qlId === "WFM-QL-005") {
    assert(sourceKeys.size >= 12);
    assert(renderers.has("BANKING_SINGLE_WORD_POSITION_OPTION"));
    assert(renderers.has("BANKING_MULTI_WORD_POSITION_OPTION"));
  }
  if (qlId === "WFM-QL-006") {
    assert(sourceKeys.size >= 8);
    assert.deepEqual([...sentinelConventions].sort(), ["MULTI_X_NONE_Y", "NONE_X_MULTI_Y"]);
  }

  summary[`${qlId}:BANKING`] = {
    generated,
    answerPositions,
    visible: visible.size,
    sources: sourceKeys.size,
    renderers: [...renderers].sort(),
    sentinelConventions: [...sentinelConventions].sort(),
  };
}

for (const fixture of WFM_SELECTED_LETTER_FIXTURES) {
  const letters = selectedFixtureLetters(fixture);
  for (const word of fixture.acceptedWords) {
    assert(independentAnagram(letters, word), `${fixture.sourceWord}/${word} is not a true selected-letter anagram.`);
  }
}

const recognize = WFM_SELECTED_LETTER_FIXTURES.find((fixture) => fixture.sourceWord === "RECOGNIZE");
assert(recognize);
assert.deepEqual(recognize.acceptedWords, ["CRIN"], "SSC RECOGNIZE source authority must retain CRIN");

for (const qlId of LEGACY_QLS) {
  for (const language of ["hi-IN", "pa-IN"] as const) {
    for (const difficulty of DIFFICULTIES) {
      const question = generateWfm001Question({ qlId, seed: 700 + Number(qlId.slice(-3)) * 13, language, examProfile: "PUNJAB_4", difficulty });
      const learnerText = `${question.stem} ${question.explanation}`;
      assert(learnerText.length > 80);
      assert(!/\b(?:which|using|meaningful|letters|needed|available|correct answer|common trap|rearrange|sequence)\b/iu.test(learnerText), `${qlId}/${language}/${difficulty} leaks English instructional prose.`);
      if (language === "hi-IN") assert(/[\u0900-\u097F]/u.test(learnerText));
      else assert(/[\u0A00-\u0A7F]/u.test(learnerText));
    }
  }
}

for (const qlId of BANKING_QLS) {
  for (const language of ["hi-IN", "pa-IN"] as const) {
    for (const difficulty of DIFFICULTIES) {
      const question = generateWfm001Question({ qlId, seed: 1700 + Number(qlId.slice(-3)) * 29 + difficulty.charCodeAt(0), language, examProfile: "BANKING_5", difficulty });
      const learnerText = `${question.stem} ${question.explanation}`;
      assert(learnerText.length > 80);
      assert.equal(question.options.length, 5);
      assert(!/\b(?:which option|using the|meaningful english word can|correct answer|common trap)\b/iu.test(learnerText), `${qlId}/${language}/${difficulty} leaks English instructional prose.`);
      if (language === "hi-IN") assert(/[\u0900-\u097F]/u.test(learnerText));
      else assert(/[\u0A00-\u0A7F]/u.test(learnerText));
    }
  }
}

for (const qlId of LEGACY_QLS) {
  for (const difficulty of DIFFICULTIES) {
    const question = WFM_001_QUESTION_STUDIO_ADAPTER.generate({ qlId, difficulty, seed: 500, language: "en-IN", examProfile: "SSC_CGL_4" });
    assert.equal(question.difficulty, difficulty);
  }
}
for (const qlId of ["WFM-QL-005", "WFM-QL-006"] as const) {
  for (const difficulty of DIFFICULTIES) {
    const question = WFM_001_QUESTION_STUDIO_ADAPTER.generate({ qlId, difficulty, seed: 1500, language: "en-IN", examProfile: "BANKING_5" });
    assert.equal(question.difficulty, difficulty);
    assert.equal(question.options.length, 5);
  }
}
assert.equal(WFM_001_QUESTION_STUDIO_ADAPTER.questionStudioVisible, false);

const review = buildWfm001ReviewPack("en-IN", 2);
assert.equal(review.length, 36, "Review pack must contain 6 QLs × 3 difficulties × 2 samples.");
const markdown = renderWfm001ReviewMarkdown(review);
for (const qlId of WFM_001_QL_IDS) assert(markdown.includes(qlId));
assert(markdown.includes("SELECTED_POSITION_COUNT"));
assert(markdown.includes("BANKING_SINGLE_WORD_POSITION_OPTION") || markdown.includes("BANKING_MULTI_WORD_POSITION_OPTION"));
assert(markdown.includes("BANKING_UNIQUE_WORD_OUTPUT"));
assert(!markdown.includes("Option A is wrong"));

console.log(JSON.stringify({
  status: "WFM-001 CURRENT-MAIN REVIEW GATE PASSED",
  qlIds: WFM_001_QL_IDS,
  candidateWords: WFM_CANDIDATE_WORDS.length,
  directSourceWords: WFM_SOURCE_WORDS.length,
  selectedFixtures: WFM_SELECTED_LETTER_FIXTURES.length,
  rearrangementFixtures: WFM_REARRANGEMENT_FIXTURES.length,
  bankingExtractionFixtures: WFM_BANKING_ORDERED_EXTRACTION_FIXTURES.length,
  summary,
}, null, 2));
