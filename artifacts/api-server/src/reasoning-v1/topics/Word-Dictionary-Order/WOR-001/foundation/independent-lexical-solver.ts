import type { WorSortDirection } from "./types";

function verifierToken(word: string): number[] {
  if (!/^[A-Za-z]+$/.test(word)) throw new Error(`Independent solver rejected non A-Z token: ${word}`);
  return [...word].map((character) => character.toUpperCase().charCodeAt(0) - 64);
}

function independentComesBefore(leftWord: string, rightWord: string): boolean {
  const left = verifierToken(leftWord);
  const right = verifierToken(rightWord);
  let index = 0;
  while (index < left.length && index < right.length) {
    if (left[index] !== right[index]) return left[index]! < right[index]!;
    index += 1;
  }
  return left.length < right.length;
}

export function independentlySortWorWords(words: readonly string[], direction: WorSortDirection = "ASCENDING"): string[] {
  const remaining = [...words];
  const result: string[] = [];
  while (remaining.length) {
    let earliestIndex = 0;
    for (let index = 1; index < remaining.length; index += 1) {
      if (independentComesBefore(remaining[index]!, remaining[earliestIndex]!)) earliestIndex = index;
    }
    result.push(remaining.splice(earliestIndex, 1)[0]!);
  }
  return direction === "ASCENDING" ? result : result.reverse();
}

export function independentlyFindRank(words: readonly string[], target: string): number {
  const order = independentlySortWorWords(words);
  const index = order.findIndex((word) => word.toUpperCase() === target.toUpperCase());
  if (index < 0) throw new Error(`Target word is absent: ${target}`);
  return index + 1;
}
