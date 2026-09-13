import { intBetween, shuffle } from "../foundation/prng";
import type { AlpQuestionLogic } from "../types";
import { A, D, S, key } from "./shared";

function categoryBag(
  base: readonly string[],
  count: number,
  ql: AlpQuestionLogic,
  seed: number,
  salt: string,
): string[] {
  const maxRepeats = Math.min(2, Math.max(0, count - 3));
  const repeatCount = intBetween(0, maxRepeats, key(ql, seed, `${salt}-repeat-count`));
  const uniqueCount = count - repeatCount;
  const unique = shuffle(base, key(ql, seed, `${salt}-unique`)).slice(0, uniqueCount);
  const repeated = shuffle(unique, key(ql, seed, `${salt}-repeat-picks`)).slice(0, repeatCount);
  return shuffle([...unique, ...repeated], key(ql, seed, `${salt}-bag`));
}

/**
 * Source-shaped mixed token rows for CP009/CP010.
 *
 * The old builder always emitted exactly 8 distinct letters, 8 distinct digits
 * and 8 distinct symbols. Real exam rows vary in length/category balance and
 * may repeat visible tokens, so this builder varies all three independently.
 * Repetition is bounded: a row can have zero, one or two repeated occurrences
 * per category while still retaining a large set of unique tokens.
 */
export function mixedRow(ql: AlpQuestionLogic, seed: number): string[] {
  const letterCount = intBetween(7, 10, key(ql, seed, "mixed-letter-count"));
  const digitCount = intBetween(5, 8, key(ql, seed, "mixed-digit-count"));
  const symbolCount = intBetween(4, 7, key(ql, seed, "mixed-symbol-count"));

  return shuffle([
    ...categoryBag(A, letterCount, ql, seed, "letters"),
    ...categoryBag(D, digitCount, ql, seed, "digits"),
    ...categoryBag(S, symbolCount, ql, seed, "symbols"),
  ], key(ql, seed, "mixed-variable-row"));
}

export function repeatedOccurrenceCount(items: readonly string[]): number {
  return items.length - new Set(items).size;
}

export function categorySignature(items: readonly string[]): string {
  const letters = items.filter((token) => /^[A-Z]$/.test(token)).length;
  const digits = items.filter((token) => /^\d$/.test(token)).length;
  return `${letters}:${digits}:${items.length - letters - digits}`;
}
