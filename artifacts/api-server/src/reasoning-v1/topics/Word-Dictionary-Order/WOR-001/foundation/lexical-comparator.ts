import type { LexicalComparisonTrace, WorSortDirection } from "./types";

export function normalizeWorWord(word: string): string {
  const normalized = word.toUpperCase();
  if (!/^[A-Z]+$/.test(normalized)) throw new Error(`WOR-001 accepts A-Z words only: ${word}`);
  return normalized;
}

export function compareWorWords(leftWord: string, rightWord: string): number {
  const left = normalizeWorWord(leftWord);
  const right = normalizeWorWord(rightWord);
  const limit = Math.min(left.length, right.length);
  for (let index = 0; index < limit; index += 1) {
    const difference = left.charCodeAt(index) - right.charCodeAt(index);
    if (difference !== 0) return difference;
  }
  return left.length - right.length;
}

export function traceWorComparison(leftWord: string, rightWord: string): LexicalComparisonTrace {
  const left = normalizeWorWord(leftWord);
  const right = normalizeWorWord(rightWord);
  if (left === right) throw new Error(`WOR-001 comparison traces require two distinct words: ${leftWord}`);
  const limit = Math.min(left.length, right.length);
  let commonPrefixLength = 0;
  while (commonPrefixLength < limit && left[commonPrefixLength] === right[commonPrefixLength]) commonPrefixLength += 1;
  const commonPrefix = left.slice(0, commonPrefixLength);
  if (commonPrefixLength === left.length) {
    return { left: leftWord, right: rightWord, commonPrefix, commonPrefixLength, decision: "LEFT_IS_PREFIX", winner: "LEFT_FIRST" };
  }
  if (commonPrefixLength === right.length) {
    return { left: leftWord, right: rightWord, commonPrefix, commonPrefixLength, decision: "RIGHT_IS_PREFIX", winner: "RIGHT_FIRST" };
  }
  const leftDecisionChar = left[commonPrefixLength]!;
  const rightDecisionChar = right[commonPrefixLength]!;
  return {
    left: leftWord,
    right: rightWord,
    commonPrefix,
    commonPrefixLength,
    decision: "FIRST_DIFFERING_CHARACTER",
    leftDecisionChar,
    rightDecisionChar,
    leftAlphabetPosition: leftDecisionChar.charCodeAt(0) - 64,
    rightAlphabetPosition: rightDecisionChar.charCodeAt(0) - 64,
    winner: leftDecisionChar < rightDecisionChar ? "LEFT_FIRST" : "RIGHT_FIRST",
  };
}

export function sortWorWords(words: readonly string[], direction: WorSortDirection = "ASCENDING"): string[] {
  const normalized = words.map(normalizeWorWord);
  if (new Set(normalized).size !== words.length) throw new Error("WOR-001 word sets must be unique after normalization.");
  const result = [...words].sort(compareWorWords);
  return direction === "ASCENDING" ? result : result.reverse();
}

export function adjacentComparisonTrace(ascendingWords: readonly string[]): LexicalComparisonTrace[] {
  return ascendingWords.slice(0, -1).map((word, index) => traceWorComparison(word, ascendingWords[index + 1]!));
}
