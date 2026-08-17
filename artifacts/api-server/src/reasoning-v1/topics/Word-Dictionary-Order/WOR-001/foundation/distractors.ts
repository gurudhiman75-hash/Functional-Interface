import { traceWorComparison } from "./lexical-comparator";
import type { WorOption, WorOptionCount } from "./types";

interface CandidateOption { readonly value: string; readonly misconceptionId: string; }

function assembleOptions(correct: string, candidates: readonly CandidateOption[], seed: number, optionCount: WorOptionCount = 4): WorOption[] {
  const unique: CandidateOption[] = [];
  const seen = new Set([correct]);
  for (const candidate of candidates) {
    if (!candidate.value.trim() || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    unique.push(candidate);
  }
  const requiredDistractors = optionCount - 1;
  if (unique.length < requiredDistractors) throw new Error(`WOR-001 could not construct ${requiredDistractors} distinct distractors for ${correct}.`);
  const correctIndex = ((seed % optionCount) + optionCount) % optionCount;
  const options: WorOption[] = unique.slice(0, requiredDistractors).map((candidate) => ({ value: candidate.value, misconceptionId: candidate.misconceptionId }));
  options.splice(correctIndex, 0, { value: correct, misconceptionId: null });
  return options;
}

export function renderWordSequence(words: readonly string[]): string {
  return words.join(" → ");
}

function swapped(words: readonly string[], index: number): string[] {
  const result = [...words];
  [result[index], result[index + 1]] = [result[index + 1]!, result[index]!];
  return result;
}

function comparisonMisconception(left: string, right: string): string {
  const trace = traceWorComparison(left, right);
  if (trace.decision !== "FIRST_DIFFERING_CHARACTER") return "PREFIX_TERMINATION_ERROR";
  if (trace.commonPrefixLength >= 3) return "LATE_CHARACTER_COMPARISON_ERROR";
  if (trace.commonPrefixLength > 0) return "COMMON_PREFIX_COMPARISON_ERROR";
  return "FIRST_LETTER_ORDER_ERROR";
}

export function buildSequenceOptions(order: readonly string[], seed: number, optionCount: WorOptionCount = 4): WorOption[] {
  const adjacent = order.slice(0, -1).map((word, index) => {
    const next = order[index + 1]!;
    const trace = traceWorComparison(word, next);
    return {
      index,
      depth: trace.commonPrefixLength,
      prefix: trace.decision !== "FIRST_DIFFERING_CHARACTER",
      misconceptionId: comparisonMisconception(word, next),
    };
  });
  const hardest = [...adjacent].sort((a, b) => Number(b.prefix) - Number(a.prefix) || b.depth - a.depth || a.index - b.index);
  const sequenceCandidates = hardest.map((entry) => ({ value: renderWordSequence(swapped(order, entry.index)), misconceptionId: entry.misconceptionId }));
  sequenceCandidates.push(
    { value: renderWordSequence([...order].reverse()), misconceptionId: "REVERSE_ALPHABET_ERROR" },
    { value: renderWordSequence([...order.slice(1), order[0]!]), misconceptionId: "FIRST_WORD_DISPLACED" },
  );
  return assembleOptions(renderWordSequence(order), sequenceCandidates, seed, optionCount);
}

function wordMisconception(answer: string, candidate: string): string {
  const trace = traceWorComparison(answer, candidate);
  if (trace.decision !== "FIRST_DIFFERING_CHARACTER") return "PREFIX_TERMINATION_ERROR";
  if (trace.commonPrefixLength >= 3) return "LATE_CHARACTER_COMPARISON_ERROR";
  if (trace.commonPrefixLength > 0) return "COMMON_PREFIX_COMPARISON_ERROR";
  return "POSITIONAL_WORD_CONFUSION";
}

export function buildWordOptions(answer: string, candidates: readonly string[], seed: number, optionCount: WorOptionCount = 4): WorOption[] {
  return assembleOptions(answer, candidates.filter((word) => word !== answer).map((word) => ({
    value: word,
    misconceptionId: wordMisconception(answer, word),
  })), seed, optionCount);
}

function rankMisconception(answerRank: number, rank: number): string {
  const difference = rank - answerRank;
  if (difference === -1) return "RANK_ONE_PLACE_EARLY";
  if (difference === 1) return "RANK_ONE_PLACE_LATE";
  if (difference === -2) return "RANK_TWO_PLACES_EARLY";
  if (difference === 2) return "RANK_TWO_PLACES_LATE";
  return difference < 0 ? "RANK_MULTIPLE_PLACES_EARLY" : "RANK_MULTIPLE_PLACES_LATE";
}

export function buildRankOptions(answerRank: number, maximumRank: number, seed: number, optionCount: WorOptionCount = 4): WorOption[] {
  const ranks = Array.from({ length: maximumRank }, (_, index) => index + 1)
    .filter((rank) => rank !== answerRank)
    .sort((a, b) => Math.abs(a - answerRank) - Math.abs(b - answerRank) || a - b);
  return assembleOptions(String(answerRank), ranks.map((rank) => ({
    value: String(rank),
    misconceptionId: rankMisconception(answerRank, rank),
  })), seed, optionCount);
}

export function buildPairOptions(answer: string, pairs: readonly string[], seed: number, optionCount: WorOptionCount = 4): WorOption[] {
  return assembleOptions(answer, pairs.filter((pair) => pair !== answer).map((pair) => ({
    value: pair,
    misconceptionId: "CHOSE_CORRECTLY_ORDERED_ADJACENT_PAIR",
  })), seed, optionCount);
}

export function buildLetterOptions(answer: string, seed: number, optionCount: WorOptionCount = 4): WorOption[] {
  if (!/^[A-Z]$/.test(answer)) throw new Error(`Invalid Banking letter answer: ${answer}`);
  const answerCode = answer.charCodeAt(0);
  const letters = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index))
    .filter((letter) => letter !== answer)
    .sort((left, right) => Math.abs(left.charCodeAt(0) - answerCode) - Math.abs(right.charCodeAt(0) - answerCode) || left.charCodeAt(0) - right.charCodeAt(0));
  return assembleOptions(answer, letters.map((letter) => {
    const delta = letter.charCodeAt(0) - answerCode;
    const misconceptionId = delta === -1 ? "LETTER_ONE_PLACE_EARLY"
      : delta === 1 ? "LETTER_ONE_PLACE_LATE"
        : delta < 0 ? "LETTER_MULTIPLE_PLACES_EARLY"
          : "LETTER_MULTIPLE_PLACES_LATE";
    return { value: letter, misconceptionId };
  }), seed, optionCount);
}

export function correctOptionIndex(options: readonly WorOption[]): number {
  const index = options.findIndex((option) => option.misconceptionId === null);
  if (index < 0) throw new Error("WOR-001 options do not contain a marked correct answer.");
  return index;
}
