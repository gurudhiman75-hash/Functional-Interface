import { alphabetRankZero, inverseTransformWord, oppositeLetter, shiftLetter, transformWord } from "../COD-CP-003/alphabet";
import type { CodCp003RuleContext, CodCp003RuleId } from "../COD-CP-003/types";
import { inversePositionWord, isVowel, shiftAtPosition, transformPositionWord, wordUsesPositionWrap } from "../COD-CP-004/transform";
import type { CodCp004RuleContext, CodCp004RuleId } from "../COD-CP-004/types";
import { inverseRearrangementWord, rearrangementOrder, transformRearrangementWord } from "../COD-CP-005/transform";
import type { CodCp005RuleContext, CodCp005RuleId } from "../COD-CP-005/types";
import type { CodCp006RuleContext, CodCp006RuleId, CompositeStageResult } from "./types";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function pairSwap(word: string): string {
  if (word.length % 2 !== 0) throw new Error("PAIR_SWAP requires an even number of letters");
  const output: string[] = [];
  for (let index = 0; index < word.length; index += 2) output.push(word[index + 1]!, word[index]!);
  return output.join("");
}

export function halfSwap(word: string): string {
  if (word.length % 2 !== 0) throw new Error("HALF_SWAP requires an even number of letters");
  const half = word.length / 2;
  return `${word.slice(half)}${word.slice(0, half)}`;
}

function rotationContext(context: CodCp006RuleContext): CodCp005RuleContext {
  return {
    direction: context.rotationDirection ?? "LEFT",
    amount: context.rotationAmount ?? 1,
  };
}

function applyEarlierTransform(context: CodCp006RuleContext, word: string): string {
  if (context.transformCheckpoint === "COD-CP-003") {
    return transformWord(
      context.transformRuleId as CodCp003RuleId,
      context.transformContext as CodCp003RuleContext,
      word,
    );
  }
  if (context.transformCheckpoint === "COD-CP-004") {
    return transformPositionWord(
      context.transformRuleId as CodCp004RuleId,
      context.transformContext as CodCp004RuleContext,
      word,
    );
  }
  throw new Error("Rank-sequence context is missing its first-stage transform");
}

function invertEarlierTransform(context: CodCp006RuleContext, word: string): string {
  if (context.transformCheckpoint === "COD-CP-003") {
    return inverseTransformWord(
      context.transformRuleId as CodCp003RuleId,
      context.transformContext as CodCp003RuleContext,
      word,
    );
  }
  if (context.transformCheckpoint === "COD-CP-004") {
    return inversePositionWord(
      context.transformRuleId as CodCp004RuleId,
      context.transformContext as CodCp004RuleContext,
      word,
    );
  }
  throw new Error("Rank-sequence context is missing its first-stage transform");
}

export function rankSequence(word: string, separator = "-"): string {
  return [...word].map((letter) => String(alphabetRankZero(letter) + 1)).join(separator);
}

export function parseRankSequence(code: string, separator = "-"): string {
  const tokens = code.split(separator);
  if (tokens.length === 0 || tokens.some((token) => !/^\d+$/.test(token))) {
    throw new Error(`Invalid rank sequence '${code}'`);
  }
  return tokens.map((token) => {
    const rank = Number(token);
    if (!Number.isInteger(rank) || rank < 1 || rank > 26) throw new Error(`Invalid alphabet rank '${token}'`);
    return ALPHABET[rank - 1]!;
  }).join("");
}

export function compositeStageResult(
  ruleId: CodCp006RuleId,
  context: CodCp006RuleContext,
  word: string,
): CompositeStageResult {
  switch (ruleId) {
    case "REVERSE_THEN_INDEXED_SHIFT": {
      const stage1 = [...word].reverse().join("");
      const direction = context.direction ?? 1;
      const baseShift = context.baseShift ?? 1;
      const finalCode = [...stage1]
        .map((letter, index) => shiftLetter(letter, direction * (baseShift + index)))
        .join("");
      return { stage1, finalCode };
    }
    case "PAIR_SWAP_THEN_ALTERNATING_SHIFT": {
      const stage1 = pairSwap(word);
      const magnitude = context.magnitude ?? 1;
      const firstDirection = context.firstDirection ?? 1;
      const finalCode = [...stage1]
        .map((letter, index) => shiftLetter(letter, firstDirection * (index % 2 === 0 ? 1 : -1) * magnitude))
        .join("");
      return { stage1, finalCode };
    }
    case "HALF_SWAP_THEN_ODD_EVEN_SHIFT": {
      const stage1 = halfSwap(word);
      const finalCode = [...stage1]
        .map((letter, index) => shiftLetter(letter, index % 2 === 0 ? (context.oddShift ?? 1) : (context.evenShift ?? 2)))
        .join("");
      return { stage1, finalCode };
    }
    case "ROTATE_THEN_CLASS_SHIFT": {
      const stage1 = transformRearrangementWord("CYCLIC_POSITION_ROTATION", rotationContext(context), word);
      const finalCode = [...stage1]
        .map((letter) => shiftLetter(letter, isVowel(letter) ? (context.vowelShift ?? 1) : (context.consonantShift ?? -1)))
        .join("");
      return { stage1, finalCode };
    }
    case "OPPOSITE_MAP_WITH_POSITION_PERMUTATION": {
      const stage1 = [...word].map(oppositeLetter).join("");
      const finalCode = transformRearrangementWord(
        context.permutationRuleId as CodCp005RuleId,
        context.permutationContext ?? {},
        stage1,
      );
      return { stage1, finalCode };
    }
    case "TRANSFORM_THEN_RANK_SEQUENCE": {
      const stage1 = applyEarlierTransform(context, word);
      return { stage1, finalCode: rankSequence(stage1, context.separator ?? "-") };
    }
  }
}

export function transformCompositeWord(ruleId: CodCp006RuleId, context: CodCp006RuleContext, word: string): string {
  return compositeStageResult(ruleId, context, word).finalCode;
}

function inverseClassShift(code: string, context: CodCp006RuleContext): string {
  return [...code].map((coded) => {
    const candidates = [...ALPHABET].filter((source) => {
      const shift = isVowel(source) ? (context.vowelShift ?? 1) : (context.consonantShift ?? -1);
      return shiftLetter(source, shift) === coded;
    });
    if (candidates.length !== 1) throw new Error(`Class-shift inverse has ${candidates.length} candidates for '${coded}'`);
    return candidates[0]!;
  }).join("");
}

export function inverseCompositeWord(ruleId: CodCp006RuleId, context: CodCp006RuleContext, code: string): string {
  switch (ruleId) {
    case "REVERSE_THEN_INDEXED_SHIFT": {
      const direction = context.direction ?? 1;
      const baseShift = context.baseShift ?? 1;
      const stage1 = [...code]
        .map((letter, index) => shiftLetter(letter, -direction * (baseShift + index)))
        .join("");
      return [...stage1].reverse().join("");
    }
    case "PAIR_SWAP_THEN_ALTERNATING_SHIFT": {
      const magnitude = context.magnitude ?? 1;
      const firstDirection = context.firstDirection ?? 1;
      const stage1 = [...code]
        .map((letter, index) => shiftLetter(letter, -firstDirection * (index % 2 === 0 ? 1 : -1) * magnitude))
        .join("");
      return pairSwap(stage1);
    }
    case "HALF_SWAP_THEN_ODD_EVEN_SHIFT": {
      const stage1 = [...code]
        .map((letter, index) => shiftLetter(letter, -(index % 2 === 0 ? (context.oddShift ?? 1) : (context.evenShift ?? 2))))
        .join("");
      return halfSwap(stage1);
    }
    case "ROTATE_THEN_CLASS_SHIFT": {
      const stage1 = inverseClassShift(code, context);
      return inverseRearrangementWord("CYCLIC_POSITION_ROTATION", rotationContext(context), stage1);
    }
    case "OPPOSITE_MAP_WITH_POSITION_PERMUTATION": {
      const stage1 = inverseRearrangementWord(
        context.permutationRuleId as CodCp005RuleId,
        context.permutationContext ?? {},
        code,
      );
      return [...stage1].map(oppositeLetter).join("");
    }
    case "TRANSFORM_THEN_RANK_SEQUENCE": {
      const stage1 = parseRankSequence(code, context.separator ?? "-");
      return invertEarlierTransform(context, stage1);
    }
  }
}

export function compositeStagesActive(ruleId: CodCp006RuleId, context: CodCp006RuleContext, word: string): boolean {
  try {
    const result = compositeStageResult(ruleId, context, word);
    return result.stage1 !== word && result.finalCode !== result.stage1;
  } catch {
    return false;
  }
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, stableValue(nested)]),
    );
  }
  return value;
}

export function sameCompositeContext(left: CodCp006RuleContext, right: CodCp006RuleContext): boolean {
  return JSON.stringify(stableValue(left)) === JSON.stringify(stableValue(right));
}

export function maskCompositeCode(code: string, index: number, separator: string): string {
  const tokens = separator ? code.split(separator) : [...code];
  if (!Number.isInteger(index) || index < 0 || index >= tokens.length) throw new Error(`Cannot mask position ${index} in '${code}'`);
  tokens[index] = "?";
  return separator ? tokens.join(separator) : tokens.join("");
}

export function codeTokenAt(code: string, index: number, separator: string): string {
  const tokens = separator ? code.split(separator) : [...code];
  const token = tokens[index];
  if (token === undefined) throw new Error(`Missing token ${index} in '${code}'`);
  return token;
}

export function compositeUsesWrap(ruleId: CodCp006RuleId, context: CodCp006RuleContext, word: string): boolean {
  const stage1 = compositeStageResult(ruleId, context, word).stage1;
  switch (ruleId) {
    case "REVERSE_THEN_INDEXED_SHIFT": {
      const direction = context.direction ?? 1;
      const baseShift = context.baseShift ?? 1;
      return [...stage1].some((letter, index) => {
        const raw = alphabetRankZero(letter) + direction * (baseShift + index);
        return raw < 0 || raw > 25;
      });
    }
    case "PAIR_SWAP_THEN_ALTERNATING_SHIFT": {
      const magnitude = context.magnitude ?? 1;
      const firstDirection = context.firstDirection ?? 1;
      return [...stage1].some((letter, index) => {
        const raw = alphabetRankZero(letter) + firstDirection * (index % 2 === 0 ? 1 : -1) * magnitude;
        return raw < 0 || raw > 25;
      });
    }
    case "HALF_SWAP_THEN_ODD_EVEN_SHIFT":
      return [...stage1].some((letter, index) => {
        const raw = alphabetRankZero(letter) + (index % 2 === 0 ? (context.oddShift ?? 1) : (context.evenShift ?? 2));
        return raw < 0 || raw > 25;
      });
    case "ROTATE_THEN_CLASS_SHIFT":
      return [...stage1].some((letter) => {
        const raw = alphabetRankZero(letter) + (isVowel(letter) ? (context.vowelShift ?? 1) : (context.consonantShift ?? -1));
        return raw < 0 || raw > 25;
      });
    case "OPPOSITE_MAP_WITH_POSITION_PERMUTATION":
      return false;
    case "TRANSFORM_THEN_RANK_SEQUENCE":
      if (context.transformCheckpoint === "COD-CP-003") {
        const ruleId3 = context.transformRuleId as CodCp003RuleId;
        if (ruleId3 === "OPPOSITE_ALPHABET_MAP") return false;
        const shift = (context.transformContext as CodCp003RuleContext).shift ?? 0;
        return [...word].some((letter) => {
          const raw = alphabetRankZero(letter) + shift;
          return raw < 0 || raw > 25;
        });
      }
      return wordUsesPositionWrap(
        context.transformRuleId as CodCp004RuleId,
        context.transformContext as CodCp004RuleContext,
        word,
      );
  }
}

export function pipelinePositionOrder(ruleId: CodCp006RuleId, context: CodCp006RuleContext, length: number): number[] | undefined {
  switch (ruleId) {
    case "REVERSE_THEN_INDEXED_SHIFT":
      return Array.from({ length }, (_, index) => length - 1 - index);
    case "PAIR_SWAP_THEN_ALTERNATING_SHIFT":
      return Array.from({ length }, (_, index) => index % 2 === 0 ? index + 1 : index - 1);
    case "HALF_SWAP_THEN_ODD_EVEN_SHIFT":
      return rearrangementOrder("HALF_SWAP", {}, length);
    case "ROTATE_THEN_CLASS_SHIFT":
      return rearrangementOrder("CYCLIC_POSITION_ROTATION", rotationContext(context), length);
    case "OPPOSITE_MAP_WITH_POSITION_PERMUTATION":
      return rearrangementOrder(context.permutationRuleId as CodCp005RuleId, context.permutationContext ?? {}, length);
    case "TRANSFORM_THEN_RANK_SEQUENCE":
      return undefined;
  }
}

export function earlierTransformDescription(context: CodCp006RuleContext): string {
  const id = context.transformRuleId;
  const c = context.transformContext as Record<string, number | undefined>;
  switch (id) {
    case "UNIFORM_CYCLIC_SHIFT": return `shift every letter by ${c.shift! > 0 ? "+" : ""}${c.shift}`;
    case "OPPOSITE_ALPHABET_MAP": return "replace every letter by its opposite alphabet partner";
    case "INCREMENTAL_FORWARD_SHIFT": return `move successive positions forward by +${c.baseShift}, +${(c.baseShift ?? 0) + 1}, +${(c.baseShift ?? 0) + 2}, ...`;
    case "INCREMENTAL_BACKWARD_SHIFT": return `move successive positions backward by −${c.baseShift}, −${(c.baseShift ?? 0) + 1}, −${(c.baseShift ?? 0) + 2}, ...`;
    case "ALTERNATING_SIGNED_SHIFT": return `alternate ${(c.firstDirection ?? 1) > 0 ? `+${c.magnitude}, −${c.magnitude}` : `−${c.magnitude}, +${c.magnitude}`}`;
    case "ODD_EVEN_POSITION_SHIFT": return `use ${c.oddShift! > 0 ? "+" : ""}${c.oddShift} at odd positions and ${c.evenShift! > 0 ? "+" : ""}${c.evenShift} at even positions`;
    case "VOWEL_CONSONANT_CLASS_SHIFT": return `shift vowels by ${c.vowelShift! > 0 ? "+" : ""}${c.vowelShift} and consonants by ${c.consonantShift! > 0 ? "+" : ""}${c.consonantShift}`;
    case "ENDPOINT_INTERIOR_SHIFT": return `shift end letters by ${c.endpointShift! > 0 ? "+" : ""}${c.endpointShift} and middle letters by ${c.interiorShift! > 0 ? "+" : ""}${c.interiorShift}`;
    default: return "apply the registered first-stage letter transformation";
  }
}
