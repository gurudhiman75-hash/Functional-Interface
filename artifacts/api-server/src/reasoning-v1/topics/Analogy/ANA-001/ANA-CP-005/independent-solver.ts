import { letterFromPosition, letterPosition } from "../foundation/alphabet";
import {
  ANA_CP005_RULES,
  sameAlphabetRuleContext,
  type AlphabetRuleContext,
} from "./rule-definitions";

export interface AlphabetPair {
  left: string;
  right: string;
}

export interface AlphabetRuleMatch {
  ruleId: string;
  context: AlphabetRuleContext;
  priority: number;
}

export function matchingAlphabetRules(pairs: readonly AlphabetPair[]): AlphabetRuleMatch[] {
  return ANA_CP005_RULES.flatMap((rule) =>
    rule.contexts
      .filter((context) => pairs.every((pair) => {
        const inputPosition = letterPosition(pair.left);
        return rule.eligibleInputPositions.includes(inputPosition) && rule.apply(pair.left, context) === pair.right;
      }))
      .map((context) => ({ ruleId: rule.id, context, priority: rule.priority })),
  );
}

export function solveAlphabetRule(ruleId: string, context: AlphabetRuleContext, input: string): string {
  const rule = ANA_CP005_RULES.find((entry) => entry.id === ruleId);
  if (!rule) throw new Error(`Unknown alphabet rule: ${ruleId}`);
  const inputPosition = letterPosition(input);
  if (!rule.eligibleInputPositions.includes(inputPosition)) {
    throw new Error(`${ruleId} is not eligible for input ${input}`);
  }
  const result = rule.apply(input, context);
  if (!result) throw new Error(`${ruleId} is not valid for input ${input}`);
  return result;
}

export function verifyAlphabetTransfer(
  ruleId: string,
  context: AlphabetRuleContext,
  source: AlphabetPair,
  target: AlphabetPair,
): boolean {
  const matches = matchingAlphabetRules([source, target]);
  return matches.some(
    (match) => match.ruleId === ruleId && sameAlphabetRuleContext(match.context, context),
  );
}

export function allEligibleLetters(ruleId: string): string[] {
  const rule = ANA_CP005_RULES.find((entry) => entry.id === ruleId);
  if (!rule) throw new Error(`Unknown alphabet rule: ${ruleId}`);
  return rule.eligibleInputPositions.map(letterFromPosition);
}
