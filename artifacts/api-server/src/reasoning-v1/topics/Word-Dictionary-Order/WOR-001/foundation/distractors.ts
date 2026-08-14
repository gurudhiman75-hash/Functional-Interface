import type { LexicalComparisonTrace, WorOption } from "./types";

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

export function buildSequenceOptions(order: readonly string[], traces: readonly LexicalComparisonTrace[], seed: number): WorOption[] {
  const hardest = traces
    .map((trace, index) => ({ index, depth: trace.commonPrefixLength, prefix: trace.decision !== "FIRST_DIFFERING_CHARACTER" }))
    .sort((a, b) => Number(b.prefix) - Number(a.prefix) || b.depth - a.depth);
  const firstSwap = hardest[0]?.index ?? 0;
  const secondSwap = hardest.find((entry) => entry.index !== firstSwap)?.index ?? Math.max(0, order.length - 2);
  const rotated = [...order.slice(1), order[0]!];
  return assembleOptions(renderWordSequence(order), [
    { value: renderWordSequence(swapped(order, firstSwap)), misconceptionId: "ADJACENT_LATE_COMPARISON_SWAP" },
    { value: renderWordSequence(swapped(order, secondSwap)), misconceptionId: "STOPPED_COMPARISON_TOO_EARLY" },
    { value: renderWordSequence([...order].reverse()), misconceptionId: "REVERSE_ALPHABET_ERROR" },
    { value: renderWordSequence(rotated), misconceptionId: "FIRST_WORD_DISPLACED" },
  ], seed);
}

export function buildWordOptions(answer: string, candidates: readonly string[], seed: number): WorOption[] {
  return assembleOptions(answer, candidates.filter((word) => word !== answer).map((word, index) => ({
    value: word,
    misconceptionId: index === 0 ? "NEIGHBOUR_WORD_CONFUSION" : index === 1 ? "SHORTEST_LONGEST_HEURISTIC" : "POSITION_OFF_BY_ONE",
  })), seed);
}

export function buildRankOptions(answerRank: number, maximumRank: number, seed: number): WorOption[] {
  const ranks = Array.from({ length: maximumRank }, (_, index) => index + 1)
    .filter((rank) => rank !== answerRank)
    .sort((a, b) => Math.abs(a - answerRank) - Math.abs(b - answerRank) || a - b);
  return assembleOptions(String(answerRank), ranks.map((rank) => ({
    value: String(rank),
    misconceptionId: rank < answerRank ? "RANK_ONE_PLACE_EARLY" : "RANK_ONE_PLACE_LATE",
  })), seed);
}

export function buildPairOptions(answer: string, pairs: readonly string[], seed: number): WorOption[] {
  return assembleOptions(answer, pairs.filter((pair) => pair !== answer).map((pair) => ({
    value: pair,
    misconceptionId: "WRONG_ADJACENT_PAIR",
  })), seed);
}

export function correctOptionIndex(options: readonly WorOption[]): number {
  const index = options.findIndex((option) => option.misconceptionId === null);
  if (index < 0) throw new Error("WOR-001 options do not contain a marked correct answer.");
  return index;
}
