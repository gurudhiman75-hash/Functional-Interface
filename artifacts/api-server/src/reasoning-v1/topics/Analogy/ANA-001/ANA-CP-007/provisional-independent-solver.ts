import { letterPosition, shiftLetter } from "../foundation/alphabet";
import { equalityPattern } from "./foundation/word-pattern";
import { ANA_CP007_VOWELS, normalizeWordStructureToken } from "./foundation/word-structure";
import {
  ANA_CP007_PROVISIONAL_RULES,
  provisionalWordContextKey,
  provisionalWordResultKey,
  type ProvisionalWordResult,
  type ProvisionalWordRuleContext,
  type ProvisionalWordRuleId,
} from "./provisional-rule-definitions";

export interface ProvisionalWordEvidence {
  input: string;
  output: ProvisionalWordResult;
}

export interface ProvisionalWordRuleMatch {
  ruleId: ProvisionalWordRuleId;
  context: ProvisionalWordRuleContext;
  contextKey: string;
  priority: number;
}

function independentPositionExtraction(
  word: string,
  parity: "ODD" | "EVEN",
): string | null {
  const normalized = normalizeWordStructureToken(word);
  const output = [...normalized]
    .filter((_, index) => parity === "ODD" ? index % 2 === 0 : index % 2 === 1)
    .join("");
  return output && output !== normalized ? output : null;
}

function independentLengthResult(
  word: string,
  context: Extract<ProvisionalWordRuleContext, { kind: "LENGTH_RULE" }>,
): number | null {
  const length = normalizeWordStructureToken(word).length;
  switch (context.profile) {
    case "DIRECT_LENGTH":
      return length;
    case "DOUBLE_LENGTH":
      return 2 * length;
    case "SQUARE_LENGTH":
      return length ** 2;
    case "LENGTH_PLUS_CONSTANT":
      return context.constant && context.constant >= 1 && context.constant <= 3
        ? length + context.constant
        : null;
    case "LENGTH_MINUS_CONSTANT": {
      if (!context.constant || context.constant < 1 || context.constant > 3) return null;
      return length > context.constant ? length - context.constant : null;
    }
  }
}

function independentClassShift(
  word: string,
  context: Extract<ProvisionalWordRuleContext, { kind: "CLASS_SHIFT" }>,
): string | null {
  const normalized = normalizeWordStructureToken(word);
  const output = [...normalized]
    .map((letter) => {
      const vowel = ANA_CP007_VOWELS.has(letter as "A" | "E" | "I" | "O" | "U");
      return shiftLetter(letter, vowel ? context.vowelShift : context.consonantShift);
    })
    .join("");
  return output !== normalized ? output : null;
}

export function independentlyApplyProvisionalWordRule(
  ruleId: ProvisionalWordRuleId,
  context: ProvisionalWordRuleContext,
  word: string,
): ProvisionalWordResult | null {
  const normalized = normalizeWordStructureToken(word);
  switch (ruleId) {
    case "WORD_REMOVE_VOWELS":
      if (context.kind !== "FIXED") return null;
      return [...normalized].filter((letter) =>
        !ANA_CP007_VOWELS.has(letter as "A" | "E" | "I" | "O" | "U"),
      ).join("") || null;
    case "WORD_REMOVE_CONSONANTS":
      if (context.kind !== "FIXED") return null;
      return [...normalized].filter((letter) =>
        ANA_CP007_VOWELS.has(letter as "A" | "E" | "I" | "O" | "U"),
      ).join("") || null;
    case "WORD_POSITION_EXTRACTION":
      if (context.kind !== "POSITION_EXTRACTION" || context.order !== "FORWARD") return null;
      return independentPositionExtraction(normalized, context.parity);
    case "WORD_ALPHABET_POSITION_SEQUENCE":
      if (context.kind !== "FIXED") return null;
      return [...normalized].map(letterPosition);
    case "WORD_ALPHABET_POSITION_SUM":
      if (context.kind !== "FIXED") return null;
      return [...normalized].reduce((sum, letter) => sum + letterPosition(letter), 0);
    case "WORD_LENGTH_RULE":
      return context.kind === "LENGTH_RULE" ? independentLengthResult(normalized, context) : null;
    case "WORD_EQUALITY_PATTERN":
      return context.kind === "FIXED" ? equalityPattern(normalized).pattern : null;
    case "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT":
      return context.kind === "CLASS_SHIFT" ? independentClassShift(normalized, context) : null;
  }
}

export function provisionalWordResultsEqual(
  left: ProvisionalWordResult | null,
  right: ProvisionalWordResult | null,
): boolean {
  return left !== null && right !== null && provisionalWordResultKey(left) === provisionalWordResultKey(right);
}

export function matchingProvisionalWordRules(
  evidence: readonly ProvisionalWordEvidence[],
): readonly ProvisionalWordRuleMatch[] {
  const matches: ProvisionalWordRuleMatch[] = [];
  for (const rule of ANA_CP007_PROVISIONAL_RULES) {
    for (const context of rule.contexts) {
      const completeMatch = evidence.every(({ input, output }) =>
        provisionalWordResultsEqual(
          independentlyApplyProvisionalWordRule(rule.id, context, input),
          output,
        ),
      );
      if (completeMatch) {
        matches.push({
          ruleId: rule.id,
          context,
          contextKey: provisionalWordContextKey(context),
          priority: rule.priority,
        });
      }
    }
  }
  return matches;
}

export function verifyProvisionalWordTransfer(
  ruleId: ProvisionalWordRuleId,
  context: ProvisionalWordRuleContext,
  evidence: readonly ProvisionalWordEvidence[],
): boolean {
  return evidence.every(({ input, output }) =>
    provisionalWordResultsEqual(
      independentlyApplyProvisionalWordRule(ruleId, context, input),
      output,
    ),
  );
}
