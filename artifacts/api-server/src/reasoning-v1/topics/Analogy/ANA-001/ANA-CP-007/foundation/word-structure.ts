import { letterPosition } from "../../foundation/alphabet";
import { equalityPattern } from "./word-pattern";

export const ANA_CP007_VOWELS = new Set(["A", "E", "I", "O", "U"] as const);

export interface DerivedWordStructure {
  normalized: string;
  length: number;
  vowels: readonly string[];
  consonants: readonly string[];
  vowelPositions: readonly number[];
  consonantPositions: readonly number[];
  oddPositionLetters: string;
  evenPositionLetters: string;
  alphabetPositions: readonly number[];
  alphabetPositionSum: number;
  equalityPattern: readonly number[];
  equalityPatternKey: string;
  distinctLetterCount: number;
  repeatedPositionCount: number;
}

export function normalizeWordStructureToken(word: string): string {
  const normalized = word.trim().toUpperCase();
  if (!/^[A-Z]+$/.test(normalized)) {
    throw new Error(`ANA-CP-007 requires an A-Z word token: ${word}`);
  }
  return normalized;
}

export function isVowel(letter: string): boolean {
  const normalized = normalizeWordStructureToken(letter);
  if (normalized.length !== 1) throw new Error(`Expected one letter, received ${letter}`);
  return ANA_CP007_VOWELS.has(normalized as "A" | "E" | "I" | "O" | "U");
}

export function removeVowels(word: string): string {
  const normalized = normalizeWordStructureToken(word);
  return [...normalized].filter((letter) => !ANA_CP007_VOWELS.has(letter as "A" | "E" | "I" | "O" | "U")).join("");
}

export function removeConsonants(word: string): string {
  const normalized = normalizeWordStructureToken(word);
  return [...normalized].filter((letter) => ANA_CP007_VOWELS.has(letter as "A" | "E" | "I" | "O" | "U")).join("");
}

export function extractWordPositions(
  word: string,
  parity: "ODD" | "EVEN",
  order: "FORWARD" | "REVERSE" = "FORWARD",
): string {
  const normalized = normalizeWordStructureToken(word);
  const selected = [...normalized].filter((_, index) => {
    const oneBasedPosition = index + 1;
    return parity === "ODD"
      ? oneBasedPosition % 2 === 1
      : oneBasedPosition % 2 === 0;
  });
  return (order === "REVERSE" ? selected.reverse() : selected).join("");
}

export function alphabetPositionSequence(word: string): readonly number[] {
  return [...normalizeWordStructureToken(word)].map(letterPosition);
}

export function alphabetPositionSum(word: string): number {
  return alphabetPositionSequence(word).reduce((sum, value) => sum + value, 0);
}

export function deriveWordStructure(word: string): DerivedWordStructure {
  const normalized = normalizeWordStructureToken(word);
  const vowels: string[] = [];
  const consonants: string[] = [];
  const vowelPositions: number[] = [];
  const consonantPositions: number[] = [];

  [...normalized].forEach((letter, index) => {
    const oneBasedPosition = index + 1;
    if (ANA_CP007_VOWELS.has(letter as "A" | "E" | "I" | "O" | "U")) {
      vowels.push(letter);
      vowelPositions.push(oneBasedPosition);
    } else {
      consonants.push(letter);
      consonantPositions.push(oneBasedPosition);
    }
  });

  const positions = alphabetPositionSequence(normalized);
  const pattern = equalityPattern(normalized);

  return {
    normalized,
    length: normalized.length,
    vowels,
    consonants,
    vowelPositions,
    consonantPositions,
    oddPositionLetters: extractWordPositions(normalized, "ODD"),
    evenPositionLetters: extractWordPositions(normalized, "EVEN"),
    alphabetPositions: positions,
    alphabetPositionSum: positions.reduce((sum, value) => sum + value, 0),
    equalityPattern: pattern.pattern,
    equalityPatternKey: pattern.key,
    distinctLetterCount: pattern.distinctLetterCount,
    repeatedPositionCount: pattern.repeatedPositionCount,
  };
}
