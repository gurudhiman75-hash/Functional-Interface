import { traceWorComparison } from "./lexical-comparator";
import type { WorOption } from "./types";

interface CandidateOption { readonly value: string; readonly misconceptionId: string; }

function assembleOptions(correct: string, candidates: readonly CandidateOption[], seed: number): WorOption[] {
  const unique: CandidateOption[] = [];
  const seen = new Set([correct]);
  for (const candidate of candidates) {
    if (!candidate.value.trim() || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    unique.push(candidate);
  }
  if (unique.length < 3) throw new Error(`WOR-001 could not construct three distinct distractors for ${correct}.`);
  const correctIndex = ((seed % 4) + 4) % 4;
  const options: WorOption[] = unique.slice(0, 3).map((candidate) => ({ value: candidate.value, misconceptionId: candidate.misconceptionId }));
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

export function buildSequenceOptions(order: readonly string[], seed: number): WorOption[] {
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
  const first = hardest[0] ?? { index: 0, misconceptionId: "FIRST_LETTER_ORDER_ERROR" };
  const second = hardest.find((entry) => entry.index !== first.index)
    ?? { index: Math.max(0, order.length - 2), misconceptionId: "FIRST_LETTER_ORDER_ERROR" };
  const rotated = [...order.slice(1), order[0]!];
  return assembleOptions(renderWordSequence(order), [
    { value: renderWordSequence(swapped(order, first.index)), misconceptionId: first.misconceptionId },
    { value: renderWordSequence(swapped(order, second.index)), misconceptionId: second.misconceptionId },
    { value: renderWordSequence([...order].reverse()), misconceptionId: "REVERSE_ALPHABET_ERROR" },
    { value: renderWordSequence(rotated), misconceptionId: "FIRST_WORD_DISPLACED" },
  ], seed);
}

function wordMisconception(answer: string, candidate: string): string {
  const trace = traceWorComparison(answer, candidate);
  if (trace.decision !== "FIRST_DIFFERING_CHARACTER") return "PREFIX_TERMINATION_ERROR";
  if (trace.commonPrefixLength >= 3) return "LATE_CHARACTER_COMPARISON_ERROR";
  if (trace.commonPrefixLength > 0) return "COMMON_PREFIX_COMPARISON_ERROR";
  return "POSITIONAL_WORD_CONFUSION";
}

export function buildWordOptions(answer: string, candidates: readonly string[], seed: number): WorOption[] {
  return assembleOptions(answer, candidates.filter((word) => word !== answer).map((word) => ({
    value: word,
    misconceptionId: wordMisconception(answer, word),
  })), seed);
}

function rankMisconception(answerRank: number, rank: number): string {
  const difference = rank - answerRank;
  if (difference === -1) return "RANK_ONE_PLACE_EARLY";
  if (difference === 1) return "RANK_ONE_PLACE_LATE";
  if (difference === -2) return "RANK_TWO_PLACES_EARLY";
  if (difference === 2) return "RANK_TWO_PLACES_LATE";
  return difference < 0 ? "RANK_MULTIPLE_PLACES_EARLY" : "RANK_MULTIPLE_PLACES_LATE";
}

export function buildRankOptions(answerRank: number, maximumRank: number, seed: number): WorOption[] {
  const ranks = Array.from({ length: maximumRank }, (_, index) => index + 1)
    .filter((rank) => rank !== answerRank)
    .sort((a, b) => Math.abs(a - answerRank) - Math.abs(b - answerRank) || a - b);
  return assembleOptions(String(answerRank), ranks.map((rank) => ({
    value: String(rank),
    misconceptionId: rankMisconception(answerRank, rank),
  })), seed);
}

export function buildPairOptions(answer: string, pairs: readonly string[], seed: number): WorOption[] {
  return assembleOptions(answer, pairs.filter((pair) => pair !== answer).map((pair) => ({
    value: pair,
    misconceptionId: "CHOSE_CORRECTLY_ORDERED_ADJACENT_PAIR",
  })), seed);
}

export function correctOptionIndex(options: readonly WorOption[]): number {
  const index = options.findIndex((option) => option.misconceptionId === null);
  if (index < 0) throw new Error("WOR-001 options do not contain a marked correct answer.");
  return index;
}
