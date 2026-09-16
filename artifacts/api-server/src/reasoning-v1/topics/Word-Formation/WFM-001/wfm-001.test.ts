import assert from "node:assert/strict";

import {
  WFM_REARRANGEMENT_FIXTURES,
  WFM_SELECTED_LETTER_FIXTURES,
  rearrangementFixtureDifficulty,
  selectedFixtureDifficulty,
  selectedFixtureLetters,
} from "./authorities";
import { WFM_CANDIDATE_WORDS, WFM_SOURCE_WORDS } from "./lexicon";
import { WFM_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";
import { buildWfm001ReviewPack, renderWfm001ReviewMarkdown } from "./review-pack";
import { generateWfm001Question, WFM_001_QL_IDS } from "./runtime";
import { applyNumberSequence, independentAnagram, solveDirectWfm } from "./solver";
import type { WfmDifficulty, WfmGeneratedQuestion, WfmQlId } from "./types";

const DIFFICULTIES: readonly WfmDifficulty[] = ["EASY", "MEDIUM", "HARD"];

assert(WFM_CANDIDATE_WORDS.length >= 500, "WFM candidate corpus must remain broad.");
assert(WFM_SOURCE_WORDS.length >= 18, "WFM direct source pool must remain broad.");
assert.equal(new Set(WFM_SOURCE_WORDS).size, WFM_SOURCE_WORDS.length);
assert.equal(WFM_001_QL_IDS.length, 4);
assert.equal(WFM_SELECTED_LETTER_FIXTURES.length >= 12, true);
assert.equal(WFM_REARRANGEMENT_FIXTURES.length >= 15, true);

for (const difficulty of DIFFICULTIES) {
  assert(WFM_SELECTED_LETTER_FIXTURES.some((fixture) => selectedFixtureDifficulty(fixture) === difficulty), `Selected-letter authority misses ${difficulty}.`);
  assert(WFM_REARRANGEMENT_FIXTURES.some((fixture) => rearrangementFixtureDifficulty(fixture) === difficulty), `Rearrangement authority misses ${difficulty}.`);
}
assert(WFM_REARRANGEMENT_FIXTURES.filter((fixture) => rearrangementFixtureDifficulty(fixture) === "EASY").length >= 4, "Easy rearrangement authority is too narrow.");
assert(WFM_REARRANGEMENT_FIXTURES.some((fixture) => fixture.mode === "JUMBLED_WORD"));
assert(WFM_REARRANGEMENT_FIXTURES.some((fixture) => fixture.mode === "NUMBERED_SEQUENCE"));

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
    const matches = question.options.map((option, index) => ({ option, index })).filter(({ option }) => option.text === correctCount);
    assert.equal(matches.length, 1, `${question.qlId}/${question.seed} selected count is ambiguous.`);
    return matches[0].index;
  }

  const prompt = question.structuredPrompt as { mode: string; scrambled: string; targetWord: string };
  if (prompt.mode === "JUMBLED_WORD") {
    const matches = question.options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => independentAnagram(prompt.scrambled, option.text));
    assert.equal(matches.length, 1, `${question.qlId}/${question.seed} jumbled item is ambiguous.`);
    return matches[0].index;
  }
  const matches = question.options
    .map((option, index) => ({ option, index, word: applyNumberSequence(prompt.scrambled, option.text) }))
    .filter(({ word }) => word === prompt.targetWord);
  assert.equal(matches.length, 1, `${question.qlId}/${question.seed} numbered item is ambiguous.`);
  return matches[0].index;
}

const summary: Record<string, unknown> = {};

for (const qlId of WFM_001_QL_IDS) {
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
      const question = generateWfm001Question({ qlId: qlId as WfmQlId, seed, language: "en-IN", examProfile: "SSC_CGL_4", difficulty });
      const replay = generateWfm001Question({ qlId: qlId as WfmQlId, seed, language: "en-IN", examProfile: "SSC_CGL_4", difficulty });
      assert.deepEqual(replay, question, `${qlId}/${difficulty}/${seed} must replay deterministically.`);
      assert.equal(question.difficulty, difficulty, `${qlId}/${seed} failed requested difficulty.`);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options.map((option) => option.text)).size, 4, `${qlId}/${seed} has duplicate options.`);
      assert.equal(question.metadata.lifecycle, "REVIEW_ONLY");
      assert.equal(question.metadata.questionStudioVisible, false);
      assert.equal(question.metadata.questionBankStored, false);
      assert.equal(question.metadata.testEligible, false);
      assert.equal(question.metadata.mockTestEligible, false);
      assert.equal(question.metadata.publiclyPublishable, false);
      assert.equal(question.metadata.difficultyBasis, "GENERATED_INSTANCE");

      const solved = solveQuestion(question);
      assert.equal(solved, optionIndex(question), `${qlId}/${seed} independent solve disagrees.`);

      if (qlId === "WFM-QL-001" || qlId === "WFM-QL-002") {
        assert(question.sourceWord);
        sources.add(question.sourceWord!);
        sourcesByDifficulty[difficulty].add(question.sourceWord!);
        const correctLength = question.options[solved].text.length;
        assert(
          question.options.every((option) => Math.abs(option.text.length - correctLength) <= 2),
          `${qlId}/${seed} exposes an option-length cue beyond the ±2 policy.`,
        );
      }
      if (qlId === "WFM-QL-003") {
        const prompt = question.structuredPrompt as { positions: readonly number[]; selectedLetters: string; acceptedCommonWords: readonly string[] };
        assert.equal(prompt.positions.length, prompt.selectedLetters.length);
        assert.equal(prompt.acceptedCommonWords.length, Number(question.options[solved].text));
        const sourceKey = `${question.sourceWord}:${prompt.positions.join("-")}`;
        sources.add(sourceKey);
        sourcesByDifficulty[difficulty].add(sourceKey);
        if (difficulty === "HARD") assert(prompt.selectedLetters.length >= 4, `${qlId}/${seed} hard selected-count item is too shallow.`);
      }
      if (qlId === "WFM-QL-004") {
        const prompt = question.structuredPrompt as { mode: string; targetWord: string };
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
    assert(sources.size >= 12, `${qlId} direct source diversity is too low.`);
    for (const difficulty of DIFFICULTIES) assert(sourcesByDifficulty[difficulty].size >= 12, `${qlId}/${difficulty} source diversity is too low.`);
  }
  if (qlId === "WFM-QL-003") {
    assert(sources.size >= 8, `${qlId} selected-position fixture diversity is too low.`);
    assert(sourcesByDifficulty.EASY.size >= 3, `${qlId}/EASY fixture diversity is too low.`);
    assert(sourcesByDifficulty.MEDIUM.size >= 3, `${qlId}/MEDIUM fixture diversity is too low.`);
    assert(sourcesByDifficulty.HARD.size >= 3, `${qlId}/HARD fixture diversity is too low.`);
  }
  if (qlId === "WFM-QL-004") {
    assert(sources.size >= 9, `${qlId} rearrangement target diversity is too low.`);
    assert(sourcesByDifficulty.EASY.size >= 4, `${qlId}/EASY target diversity is too low.`);
    assert(sourcesByDifficulty.MEDIUM.size >= 4, `${qlId}/MEDIUM target diversity is too low.`);
    assert(sourcesByDifficulty.HARD.size >= 3, `${qlId}/HARD target diversity is too low.`);
    assert(renderers.has("JUMBLED_WORD") && renderers.has("NUMBERED_SEQUENCE"), "WFM-QL-004 must exercise both source-backed renderers.");
  }

  summary[qlId] = {
    generated,
    answerPositions,
    visible: visible.size,
    sources: sources.size,
    sourcesByDifficulty: Object.fromEntries(DIFFICULTIES.map((difficulty) => [difficulty, sourcesByDifficulty[difficulty].size])),
    renderers: [...renderers].sort(),
  };
}

for (const fixture of WFM_SELECTED_LETTER_FIXTURES) {
  const letters = selectedFixtureLetters(fixture);
  for (const word of fixture.acceptedWords) assert(independentAnagram(letters, word), `${fixture.sourceWord}/${word} is not a true selected-letter anagram.`);
}

for (const qlId of WFM_001_QL_IDS) {
  for (const language of ["hi-IN", "pa-IN"] as const) {
    for (const difficulty of DIFFICULTIES) {
      const question = generateWfm001Question({ qlId, seed: 700 + Number(qlId.slice(-3)) * 13, language, examProfile: "PUNJAB_4", difficulty });
      const learnerText = `${question.stem} ${question.explanation}`;
      assert(learnerText.length > 80);
      assert(!/\b(?:which|using|meaningful|letters|needed|available|correct answer|common trap|rearrange|sequence)\b/iu.test(learnerText), `${qlId}/${language}/${difficulty} leaks English instructional prose.`);
      if (language === "hi-IN") {
        assert(/[\u0900-\u097F]/u.test(learnerText));
        if (qlId === "WFM-QL-003") assert(!/\d+वें/u.test(question.stem), `${qlId}/${language}/${difficulty} uses mechanical numeric ordinals.`);
      } else {
        assert(/[\u0A00-\u0A7F]/u.test(learnerText));
        if (qlId === "WFM-QL-003") assert(!/\d+ਵੇਂ/u.test(question.stem), `${qlId}/${language}/${difficulty} uses mechanical numeric ordinals.`);
      }
    }
  }
}

for (const qlId of WFM_001_QL_IDS) {
  for (const difficulty of DIFFICULTIES) {
    const question = WFM_001_QUESTION_STUDIO_ADAPTER.generate({ qlId, difficulty, seed: 500, language: "en-IN", examProfile: "SSC_CGL_4" });
    assert.equal(question.difficulty, difficulty);
  }
}
assert.equal(WFM_001_QUESTION_STUDIO_ADAPTER.questionStudioVisible, false);
assert.throws(
  () => WFM_001_QUESTION_STUDIO_ADAPTER.generate({ seed: 1, examProfile: "BANKING_5" as never }),
  /does not support exam profile/i,
);

const review = buildWfm001ReviewPack("en-IN", 2);
assert.equal(review.length, 24, "Review pack must contain 4 QLs × 3 difficulties × 2 samples.");
const markdown = renderWfm001ReviewMarkdown(review);
for (const qlId of WFM_001_QL_IDS) assert(markdown.includes(qlId));
assert(markdown.includes("SELECTED_POSITION_COUNT"));
assert(markdown.includes("JUMBLED_WORD") || markdown.includes("NUMBERED_SEQUENCE"));
assert(!markdown.includes("Option A is wrong"));

console.log(JSON.stringify({
  status: "WFM-001 V2 REVIEW GATE PASSED",
  qlIds: WFM_001_QL_IDS,
  candidateWords: WFM_CANDIDATE_WORDS.length,
  directSourceWords: WFM_SOURCE_WORDS.length,
  selectedFixtures: WFM_SELECTED_LETTER_FIXTURES.length,
  rearrangementFixtures: WFM_REARRANGEMENT_FIXTURES.length,
  summary,
}, null, 2));
