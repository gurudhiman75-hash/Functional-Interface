import { alphabetRankZero, shiftLetter } from "../COD-CP-003/alphabet";
import type { CodCp004RuleContext, CodCp004RuleId } from "./types";

export function isVowel(letter: string): boolean {
  return "AEIOU".includes(letter);
}

export function shiftAtPosition(
  ruleId: CodCp004RuleId,
  context: CodCp004RuleContext,
  letter: string,
  index: number,
  length: number,
): number {
  switch (ruleId) {
    case "INCREMENTAL_FORWARD_SHIFT":
      return (context.baseShift ?? 1) + index;
    case "INCREMENTAL_BACKWARD_SHIFT":
      return -((context.baseShift ?? 1) + index);
    case "ALTERNATING_SIGNED_SHIFT":
      return (context.firstDirection ?? 1) * (index % 2 === 0 ? 1 : -1) * (context.magnitude ?? 1);
    case "ODD_EVEN_POSITION_SHIFT":
      return index % 2 === 0 ? (context.oddShift ?? 1) : (context.evenShift ?? 2);
    case "VOWEL_CONSONANT_CLASS_SHIFT":
      return isVowel(letter) ? (context.vowelShift ?? 1) : (context.consonantShift ?? -1);
    case "ENDPOINT_INTERIOR_SHIFT":
      return index === 0 || index === length - 1 ? (context.endpointShift ?? 1) : (context.interiorShift ?? 2);
  }
}

export function transformPositionWord(ruleId: CodCp004RuleId, context: CodCp004RuleContext, word: string): string {
  return [...word].map((letter, index) => shiftLetter(letter, shiftAtPosition(ruleId, context, letter, index, word.length))).join("");
}

export function inversePositionWord(ruleId: CodCp004RuleId, context: CodCp004RuleContext, code: string): string {
  return [...code].map((codedLetter, index) => {
    const candidates = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((sourceLetter) => {
      const shift = shiftAtPosition(ruleId, context, sourceLetter, index, code.length);
      return shiftLetter(sourceLetter, shift) === codedLetter;
    });
    if (candidates.length !== 1) {
      throw new Error(`Position ${index + 1} has ${candidates.length} inverse candidates under ${ruleId}`);
    }
    return candidates[0]!;
  }).join("");
}

export function positionUsesWrap(ruleId: CodCp004RuleId, context: CodCp004RuleContext, word: string, index: number): boolean {
  const letter = word[index]!;
  const raw = alphabetRankZero(letter) + shiftAtPosition(ruleId, context, letter, index, word.length);
  return raw < 0 || raw > 25;
}

export function wordUsesPositionWrap(ruleId: CodCp004RuleId, context: CodCp004RuleContext, word: string): boolean {
  return [...word].some((_, index) => positionUsesWrap(ruleId, context, word, index));
}

export function activatesEveryBranch(ruleId: CodCp004RuleId, word: string): boolean {
  if (word.length < 4) return false;
  if (ruleId === "VOWEL_CONSONANT_CLASS_SHIFT") {
    return [...word].some(isVowel) && [...word].some((letter) => !isVowel(letter));
  }
  if (ruleId === "ENDPOINT_INTERIOR_SHIFT") return word.length >= 4;
  return true;
}
