import { letterPosition, shiftLetter } from "../foundation/alphabet";
import { equalityPattern } from "./foundation/word-pattern";
import {
  ANA_CP007_VOWELS,
  normalizeWordStructureToken,
} from "./foundation/word-structure";
import type { AnaCp007RuleId } from "./question-language.en";
import {
  ANA_CP007_RULES,
  sameWordRuleContext,
  sameWordRuleResult,
  wordRuleContextKey,
  type WordRuleContext,
  type WordRuleResult,
} from "./rule-definitions";

export interface WordEvidence {
  input: string;
  output: WordRuleResult;
}

export interface WordRuleMatch {
  ruleId: AnaCp007RuleId;
  context: WordRuleContext;
  contextKey: string;
  priority: number;
}

function independentRemoveVowels(word: string): string | null {
  const normalized = normalizeWordStructureToken(word);
  const output = [...normalized]
    .filter((letter) => !ANA_CP007_VOWELS.has(letter as "A" | "E" | "I" | "O" | "U"))
    .join("");
  return output.length > 0 && output !== normalized ? output : null;
}

function independentRemoveConsonants(word: string): string | null {
  const normalized = normalizeWordStructureToken(word);
  const output = [...normalized]
    .filter((letter) => ANA_CP007_VOWELS.has(letter as "A" | "E" | "I" | "O" | "U"))
    .join("");
  return output.length > 0 && output !== normalized ? output : null;
}

function independentPositionExtraction(word: string, parity: "ODD" | "EVEN"): string | null {
  const normalized = normalizeWordStructureToken(word);
  const output = [...normalized]
    .filter((_, index) => parity === "ODD" ? index % 2 === 0 : index % 2 === 1)
    .join("");
  return output.length > 0 && output !== normalized ? output : null;
}

function independentAlphabetSum(word: string): number {
  return [...normalizeWordStructureToken(word)]
    .reduce((sum, letter) => sum + letterPosition(letter), 0);
}

function independentDifferentialShift(
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
  return output !== normalized ? output : null;
}

export function independentlyApplyWordRule(
  ruleId: AnaCp007RuleId,
  context: WordRuleContext,
  word: string,
): WordRuleResult | null {
  switch (ruleId) {
    case "WORD_REMOVE_VOWELS":
      return context.kind === "FIXED" ? independentRemoveVowels(word) : null;
    case "WORD_REMOVE_CONSONANTS":
      return context.kind === "FIXED" ? independentRemoveConsonants(word) : null;
    case "WORD_POSITION_EXTRACTION":
      return context.kind === "POSITION_EXTRACTION"
        ? independentPositionExtraction(word, context.parity)
        : null;
    case "WORD_ALPHABET_POSITION_SUM":
      return context.kind === "FIXED" ? independentAlphabetSum(word) : null;
    case "WORD_LENGTH_MINUS_ONE":
      return context.kind === "FIXED" ? normalizeWordStructureToken(word).length - 1 : null;
    case "WORD_EQUALITY_PATTERN":
      return context.kind === "FIXED" ? equalityPattern(word).key : null;
    case "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT":
      return context.kind === "CLASS_SHIFT"
        ? independentDifferentialShift(word, context)
        : null;
  }
}

export function matchingWordRules(evidence: readonly WordEvidence[]): readonly WordRuleMatch[] {
  if (evidence.length === 0) return [];
  const matches: WordRuleMatch[] = [];
  for (const rule of ANA_CP007_RULES) {
    for (const context of rule.contexts) {
      if (!evidence.every(({ input }) => rule.acceptsWord(input, context))) continue;
      const completeMatch = evidence.every(({ input, output }) =>
        sameWordRuleResult(independentlyApplyWordRule(rule.id, context, input), output),
      );
      if (completeMatch) {
        matches.push({
          ruleId: rule.id,
          context,
          contextKey: wordRuleContextKey(context),
          priority: rule.priority,
        });
      }
    }
  }
  return matches;
}

export function solveWordRule(
  ruleId: AnaCp007RuleId,
  context: WordRuleContext,
  word: string,
): WordRuleResult {
  const rule = ANA_CP007_RULES.find((entry) => entry.id === ruleId);
  if (!rule) throw new Error(`Unknown ANA-CP-007 rule: ${ruleId}`);
  if (!rule.acceptsWord(word, context)) {
    throw new Error(`${ruleId} is not eligible for word ${word}.`);
  }
  const output = independentlyApplyWordRule(ruleId, context, word);
  if (output === null) throw new Error(`${ruleId} is invalid for word ${word}.`);
  return output;
}

export function verifyWordTransfer(
  ruleId: AnaCp007RuleId,
  context: WordRuleContext,
  evidence: readonly WordEvidence[],
): boolean {
  return matchingWordRules(evidence).some(
    (match) => match.ruleId === ruleId && sameWordRuleContext(match.context, context),
  );
}
