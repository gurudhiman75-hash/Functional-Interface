import { shiftLetter } from "../foundation/alphabet";
import type { AnaCp007RuleId } from "./question-language.en";
import { equalityPattern } from "./foundation/word-pattern";
import {
  ANA_CP007_VOWELS,
  alphabetPositionSum,
  deriveWordStructure,
  extractWordPositions,
  normalizeWordStructureToken,
  removeConsonants,
  removeVowels,
} from "./foundation/word-structure";

export type WordRuleResult = string | number;

export type WordRuleContext =
  | { kind: "FIXED" }
  | { kind: "POSITION_EXTRACTION"; parity: "ODD" | "EVEN" }
  | { kind: "CLASS_SHIFT"; vowelShift: number; consonantShift: number };

export interface WordRuleDefinition {
  id: AnaCp007RuleId;
  label: string;
  priority: number;
  outputKind: "STRING" | "NUMBER" | "PATTERN";
  contexts: readonly WordRuleContext[];
  acceptsWord(word: string, context: WordRuleContext): boolean;
  apply(word: string, context: WordRuleContext): WordRuleResult | null;
}

const FIXED: readonly WordRuleContext[] = [{ kind: "FIXED" }];
const POSITION_CONTEXTS: readonly WordRuleContext[] = [
  { kind: "POSITION_EXTRACTION", parity: "ODD" },
  { kind: "POSITION_EXTRACTION", parity: "EVEN" },
];
const CLASS_SHIFT_CONTEXTS: readonly WordRuleContext[] = [-2, -1, 1, 2].flatMap((vowelShift) =>
  [-2, -1, 1, 2]
    .filter((consonantShift) => consonantShift !== vowelShift)
    .map((consonantShift) => ({
      kind: "CLASS_SHIFT" as const,
      vowelShift,
      consonantShift,
    })),
);

function isFixed(context: WordRuleContext): context is Extract<WordRuleContext, { kind: "FIXED" }> {
  return context.kind === "FIXED";
}

function nonEmptyChanged(input: string, output: string): string | null {
  return output.length > 0 && output !== input ? output : null;
}

function differentialShift(
  word: string,
  context: Extract<WordRuleContext, { kind: "CLASS_SHIFT" }>,
): string | null {
  const normalized = normalizeWordStructureToken(word);
  const output = [...normalized]
    .map((letter) => shiftLetter(
      letter,
      ANA_CP007_VOWELS.has(letter as "A" | "E" | "I" | "O" | "U")
        ? context.vowelShift
        : context.consonantShift,
    ))
    .join("");
  return nonEmptyChanged(normalized, output);
}

export const ANA_CP007_RULES: readonly WordRuleDefinition[] = [
  {
    id: "WORD_REMOVE_VOWELS",
    label: "remove every vowel and keep the consonants in their original order",
    priority: 1,
    outputKind: "STRING",
    contexts: FIXED,
    acceptsWord(word, context) {
      if (!isFixed(context)) return false;
      const structure = deriveWordStructure(word);
      const output = removeVowels(word);
      return structure.vowels.length >= 2 && output.length >= 2 &&
        output !== structure.oddPositionLetters && output !== structure.evenPositionLetters;
    },
    apply(word, context) {
      if (!isFixed(context)) return null;
      const normalized = normalizeWordStructureToken(word);
      return nonEmptyChanged(normalized, removeVowels(normalized));
    },
  },
  {
    id: "WORD_REMOVE_CONSONANTS",
    label: "remove every consonant and keep the vowels in their original order",
    priority: 1,
    outputKind: "STRING",
    contexts: FIXED,
    acceptsWord(word, context) {
      if (!isFixed(context)) return false;
      const structure = deriveWordStructure(word);
      const output = removeConsonants(word);
      return structure.consonants.length >= 2 && output.length >= 2 &&
        output !== structure.oddPositionLetters && output !== structure.evenPositionLetters;
    },
    apply(word, context) {
      if (!isFixed(context)) return null;
      const normalized = normalizeWordStructureToken(word);
      return nonEmptyChanged(normalized, removeConsonants(normalized));
    },
  },
  {
    id: "WORD_POSITION_EXTRACTION",
    label: "take every alternate letter from the same starting position",
    priority: 1,
    outputKind: "STRING",
    contexts: POSITION_CONTEXTS,
    acceptsWord(word, context) {
      if (context.kind !== "POSITION_EXTRACTION") return false;
      const structure = deriveWordStructure(word);
      const output = extractWordPositions(word, context.parity);
      return structure.length >= 5 && output.length >= 2 &&
        output !== removeVowels(word) && output !== removeConsonants(word);
    },
    apply(word, context) {
      if (context.kind !== "POSITION_EXTRACTION") return null;
      const normalized = normalizeWordStructureToken(word);
      return nonEmptyChanged(normalized, extractWordPositions(normalized, context.parity));
    },
  },
  {
    id: "WORD_ALPHABET_POSITION_SUM",
    label: "add the ordinary alphabet positions of all letters",
    priority: 2,
    outputKind: "NUMBER",
    contexts: FIXED,
    acceptsWord(word, context) {
      return isFixed(context) && normalizeWordStructureToken(word).length >= 4;
    },
    apply(word, context) {
      return isFixed(context) ? alphabetPositionSum(word) : null;
    },
  },
  {
    id: "WORD_LENGTH_MINUS_ONE",
    label: "count the letters and subtract one",
    priority: 1,
    outputKind: "NUMBER",
    contexts: FIXED,
    acceptsWord(word, context) {
      return isFixed(context) && normalizeWordStructureToken(word).length >= 4;
    },
    apply(word, context) {
      return isFixed(context) ? normalizeWordStructureToken(word).length - 1 : null;
    },
  },
  {
    id: "WORD_EQUALITY_PATTERN",
    label: "number letters by their first occurrence and repeat a number when a letter repeats",
    priority: 2,
    outputKind: "PATTERN",
    contexts: FIXED,
    acceptsWord(word, context) {
      return isFixed(context) && deriveWordStructure(word).repeatedPositionCount >= 1;
    },
    apply(word, context) {
      return isFixed(context) ? equalityPattern(word).key : null;
    },
  },
  {
    id: "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT",
    label: "move every vowel by one fixed amount and every consonant by another fixed amount",
    priority: 3,
    outputKind: "STRING",
    contexts: CLASS_SHIFT_CONTEXTS,
    acceptsWord(word, context) {
      if (context.kind !== "CLASS_SHIFT") return false;
      const structure = deriveWordStructure(word);
      if (structure.vowels.length < 2 || structure.consonants.length < 2) return false;
      const vowelsOnlyOdd = structure.vowelPositions.every((position) => position % 2 === 1);
      const vowelsOnlyEven = structure.vowelPositions.every((position) => position % 2 === 0);
      const consonantsOnlyOdd = structure.consonantPositions.every((position) => position % 2 === 1);
      const consonantsOnlyEven = structure.consonantPositions.every((position) => position % 2 === 0);
      return !((vowelsOnlyOdd && consonantsOnlyEven) || (vowelsOnlyEven && consonantsOnlyOdd));
    },
    apply(word, context) {
      return context.kind === "CLASS_SHIFT" ? differentialShift(word, context) : null;
    },
  },
];

export function wordRuleById(ruleId: AnaCp007RuleId): WordRuleDefinition {
  const rule = ANA_CP007_RULES.find((entry) => entry.id === ruleId);
  if (!rule) throw new Error(`Unknown ANA-CP-007 rule: ${ruleId}`);
  return rule;
}

export function wordRuleResultKey(result: WordRuleResult): string {
  return `${typeof result}:${result}`;
}

export function sameWordRuleResult(left: WordRuleResult | null, right: WordRuleResult | null): boolean {
  return left !== null && right !== null && wordRuleResultKey(left) === wordRuleResultKey(right);
}

export function wordRuleContextKey(context: WordRuleContext): string {
  switch (context.kind) {
    case "FIXED":
      return "FIXED";
    case "POSITION_EXTRACTION":
      return `POSITION_EXTRACTION:${context.parity}`;
    case "CLASS_SHIFT":
      return `CLASS_SHIFT:${context.vowelShift}:${context.consonantShift}`;
  }
}

export function sameWordRuleContext(left: WordRuleContext, right: WordRuleContext): boolean {
  return wordRuleContextKey(left) === wordRuleContextKey(right);
}
