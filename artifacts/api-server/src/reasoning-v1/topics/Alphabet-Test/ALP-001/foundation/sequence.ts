import { ALPHABET, VOWELS, leftRank, normalizeLetter } from "./alphabet";
import type { AlpTransformId } from "../types";

export function reverse<T>(items: readonly T[]): T[] {
  return [...items].reverse();
}

export function oddThenEven<T>(items: readonly T[]): T[] {
  return [
    ...items.filter((_, index) => index % 2 === 0),
    ...items.filter((_, index) => index % 2 === 1),
  ];
}

export function evenThenOdd<T>(items: readonly T[]): T[] {
  return [
    ...items.filter((_, index) => index % 2 === 1),
    ...items.filter((_, index) => index % 2 === 0),
  ];
}

export function alternateFromEnds<T>(items: readonly T[], start: "LEFT" | "RIGHT"): T[] {
  const result: T[] = [];
  let left = 0;
  let right = items.length - 1;
  let takeLeft = start === "LEFT";
  while (left <= right) {
    if (takeLeft) result.push(items[left++]!);
    else result.push(items[right--]!);
    takeLeft = !takeLeft;
  }
  return result;
}

export function swapAdjacent<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let index = 0; index + 1 < result.length; index += 2) {
    [result[index], result[index + 1]] = [result[index + 1]!, result[index]!];
  }
  return result;
}

export function reverseBlocks<T>(items: readonly T[], size: number): T[] {
  if (!Number.isInteger(size) || size < 1) throw new Error(`Invalid block size ${size}.`);
  const result: T[] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(...items.slice(index, index + size).reverse());
  }
  return result;
}

export function rotateToStart(items: readonly string[], startLetter: string): string[] {
  const normalized = normalizeLetter(startLetter);
  const index = items.indexOf(normalized);
  if (index < 0) throw new Error(`${normalized} is not present in the sequence.`);
  return [...items.slice(index), ...items.slice(0, index)];
}

export function applyAlphabetTransform(transformId: AlpTransformId, rotationStart = "M"): string[] {
  const source = [...ALPHABET];
  const first = source.slice(0, 13);
  const second = source.slice(13);
  switch (transformId) {
    case "REVERSE_ALL": return reverse(source);
    case "REVERSE_FIRST_HALF": return [...reverse(first), ...second];
    case "REVERSE_SECOND_HALF": return [...first, ...reverse(second)];
    case "REVERSE_BOTH_HALVES": return [...reverse(first), ...reverse(second)];
    case "SWAP_HALVES": return [...second, ...first];
    case "ROTATE_TO_START": return rotateToStart(source, rotationStart);
    case "ODD_THEN_EVEN": return oddThenEven(source);
    case "EVEN_THEN_ODD": return evenThenOdd(source);
    case "ALTERNATE_LEFT_RIGHT": return alternateFromEnds(source, "LEFT");
    case "ALTERNATE_RIGHT_LEFT": return alternateFromEnds(source, "RIGHT");
    case "REMOVE_VOWELS": return source.filter((letter) => !VOWELS.has(letter));
    case "REMOVE_CONSONANTS": return source.filter((letter) => VOWELS.has(letter));
    case "SWAP_ADJACENT_PAIRS": return swapAdjacent(source);
    case "REVERSE_BLOCKS_OF_THREE": return reverseBlocks(source, 3);
  }
}

export function transformedPosition(sequence: readonly string[], letter: string): number {
  const normalized = normalizeLetter(letter);
  const index = sequence.indexOf(normalized);
  if (index < 0) throw new Error(`${normalized} is absent after the transformation.`);
  return index + 1;
}

export function describeTransformCore(transformId: AlpTransformId, rotationStart = "M"): string {
  switch (transformId) {
    case "REVERSE_ALL": return "write the complete alphabet in reverse order";
    case "REVERSE_FIRST_HALF": return "reverse A–M and keep N–Z unchanged";
    case "REVERSE_SECOND_HALF": return "keep A–M unchanged and reverse N–Z";
    case "REVERSE_BOTH_HALVES": return "reverse A–M and N–Z separately";
    case "SWAP_HALVES": return "place N–Z before A–M";
    case "ROTATE_TO_START": return `start the alphabet from ${rotationStart} and continue cyclically`;
    case "ODD_THEN_EVEN": return "write the letters at odd original positions first, followed by the even-position letters";
    case "EVEN_THEN_ODD": return "write the letters at even original positions first, followed by the odd-position letters";
    case "ALTERNATE_LEFT_RIGHT": return "take letters alternately from the left end and the right end, starting from the left";
    case "ALTERNATE_RIGHT_LEFT": return "take letters alternately from the right end and the left end, starting from the right";
    case "REMOVE_VOWELS": return "remove A, E, I, O and U";
    case "REMOVE_CONSONANTS": return "retain only A, E, I, O and U";
    case "SWAP_ADJACENT_PAIRS": return "interchange each adjacent pair of letters";
    case "REVERSE_BLOCKS_OF_THREE": return "reverse each consecutive block of three letters";
  }
}
