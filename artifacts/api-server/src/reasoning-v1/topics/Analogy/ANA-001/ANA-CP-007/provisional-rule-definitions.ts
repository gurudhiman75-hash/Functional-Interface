import { shiftLetter } from "../foundation/alphabet";
import { equalityPattern } from "./foundation/word-pattern";
import {
  ANA_CP007_VOWELS,
  alphabetPositionSum,
  extractWordPositions,
  normalizeWordStructureToken,
  removeConsonants,
  removeVowels,
} from "./foundation/word-structure";

export type ProvisionalWordRuleId =
  | "WORD_REMOVE_VOWELS"
  | "WORD_REMOVE_CONSONANTS"
  | "WORD_POSITION_EXTRACTION"
  | "WORD_ALPHABET_POSITION_SUM"
  | "WORD_LENGTH_RULE"
  | "WORD_EQUALITY_PATTERN"
  | "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT";

export type WordLengthProfile =
  | "DIRECT_LENGTH"
  | "DOUBLE_LENGTH"
  | "SQUARE_LENGTH"
  | "LENGTH_PLUS_CONSTANT"
  | "LENGTH_MINUS_CONSTANT";

export type ProvisionalWordRuleContext =
  | { kind: "FIXED" }
  | { kind: "POSITION_EXTRACTION"; parity: "ODD" | "EVEN"; order: "FORWARD" }
  | { kind: "LENGTH_RULE"; profile: WordLengthProfile; constant?: number }
  | { kind: "CLASS_SHIFT"; vowelShift: number; consonantShift: number };

export type ProvisionalWordResult = string | number | readonly number[];

export interface ProvisionalWordRuleDefinition {
  id: ProvisionalWordRuleId;
  priority: number;
  contexts: readonly ProvisionalWordRuleContext[];
  apply(word: string, context: ProvisionalWordRuleContext): ProvisionalWordResult | null;
}

const FIXED_CONTEXT: readonly ProvisionalWordRuleContext[] = [{ kind: "FIXED" }];

const POSITION_CONTEXTS: readonly ProvisionalWordRuleContext[] = [
  { kind: "POSITION_EXTRACTION", parity: "ODD", order: "FORWARD" },
  { kind: "POSITION_EXTRACTION", parity: "EVEN", order: "FORWARD" },
];

const LENGTH_CONTEXTS: readonly ProvisionalWordRuleContext[] = [
  { kind: "LENGTH_RULE", profile: "DIRECT_LENGTH" },
  { kind: "LENGTH_RULE", profile: "DOUBLE_LENGTH" },
  { kind: "LENGTH_RULE", profile: "SQUARE_LENGTH" },
  ...[1, 2, 3].flatMap((constant) => [
    { kind: "LENGTH_RULE", profile: "LENGTH_PLUS_CONSTANT", constant } as const,
    { kind: "LENGTH_RULE", profile: "LENGTH_MINUS_CONSTANT", constant } as const,
  ]),
];

const CLASS_SHIFT_CONTEXTS: readonly ProvisionalWordRuleContext[] = [
  ...[-4, -3, -2, -1, 0, 1, 2, 3, 4].flatMap((vowelShift) =>
    [-4, -3, -2, -1, 0, 1, 2, 3, 4]
      .filter((consonantShift) =>
        (vowelShift !== 0 || consonantShift !== 0) && vowelShift !== consonantShift,
      )
      .map((consonantShift) => ({
        kind: "CLASS_SHIFT" as const,
        vowelShift,
        consonantShift,
      })),
  ),
];

function nonIdentityString(input: string, output: string): string | null {
  return output !== input && output.length > 0 ? output : null;
}

function applyLengthRule(
  length: number,
  context: Extract<ProvisionalWordRuleContext, { kind: "LENGTH_RULE" }>,
): number | null {
  switch (context.profile) {
    case "DIRECT_LENGTH":
      return length;
    case "DOUBLE_LENGTH":
      return length * 2;
    case "SQUARE_LENGTH":
      return length * length;
    case "LENGTH_PLUS_CONSTANT":
      return context.constant && context.constant >= 1 && context.constant <= 3
        ? length + context.constant
        : null;
    case "LENGTH_MINUS_CONSTANT": {
      if (!context.constant || context.constant < 1 || context.constant > 3) return null;
      const result = length - context.constant;
      return result > 0 ? result : null;
    }
  }
}

function applyClassShift(
  word: string,
  context: Extract<ProvisionalWordRuleContext, { kind: "CLASS_SHIFT" }>,
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
  return nonIdentityString(normalized, output);
}

export const ANA_CP007_PROVISIONAL_RULES: readonly ProvisionalWordRuleDefinition[] = [
  {
    id: "WORD_REMOVE_VOWELS",
    priority: 1,
    contexts: FIXED_CONTEXT,
    apply: (word, context) => context.kind === "FIXED"
      ? nonIdentityString(normalizeWordStructureToken(word), removeVowels(word))
      : null,
  },
  {
    id: "WORD_REMOVE_CONSONANTS",
    priority: 1,
    contexts: FIXED_CONTEXT,
    apply: (word, context) => context.kind === "FIXED"
      ? nonIdentityString(normalizeWordStructureToken(word), removeConsonants(word))
      : null,
  },
  {
    id: "WORD_POSITION_EXTRACTION",
    priority: 1,
    contexts: POSITION_CONTEXTS,
    apply: (word, context) => context.kind === "POSITION_EXTRACTION"
      ? nonIdentityString(
        normalizeWordStructureToken(word),
        extractWordPositions(word, context.parity, context.order),
      )
      : null,
  },
  {
    id: "WORD_ALPHABET_POSITION_SUM",
    priority: 2,
    contexts: FIXED_CONTEXT,
    apply: (word, context) => context.kind === "FIXED"
      ? alphabetPositionSum(word)
      : null,
  },
  {
    id: "WORD_LENGTH_RULE",
    priority: 2,
    contexts: LENGTH_CONTEXTS,
    apply: (word, context) => context.kind === "LENGTH_RULE"
      ? applyLengthRule(normalizeWordStructureToken(word).length, context)
      : null,
  },
  {
    id: "WORD_EQUALITY_PATTERN",
    priority: 2,
    contexts: FIXED_CONTEXT,
    apply: (word, context) => context.kind === "FIXED"
      ? equalityPattern(word).pattern
      : null,
  },
  {
    id: "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT",
    priority: 3,
    contexts: CLASS_SHIFT_CONTEXTS,
    apply: (word, context) => context.kind === "CLASS_SHIFT"
      ? applyClassShift(word, context)
      : null,
  },
];

export function provisionalRuleById(ruleId: ProvisionalWordRuleId): ProvisionalWordRuleDefinition {
  const rule = ANA_CP007_PROVISIONAL_RULES.find((entry) => entry.id === ruleId);
  if (!rule) throw new Error(`Unknown provisional ANA-CP-007 rule: ${ruleId}`);
  return rule;
}

export function provisionalWordResultKey(result: ProvisionalWordResult): string {
  return Array.isArray(result) ? `ARRAY:${result.join(",")}` : `${typeof result}:${result}`;
}

export function provisionalWordContextKey(context: ProvisionalWordRuleContext): string {
  switch (context.kind) {
    case "FIXED":
      return "FIXED";
    case "POSITION_EXTRACTION":
      return `POSITION_EXTRACTION:${context.parity}:${context.order}`;
    case "LENGTH_RULE":
      return `LENGTH_RULE:${context.profile}:${context.constant ?? ""}`;
    case "CLASS_SHIFT":
      return `CLASS_SHIFT:${context.vowelShift}:${context.consonantShift}`;
  }
}
