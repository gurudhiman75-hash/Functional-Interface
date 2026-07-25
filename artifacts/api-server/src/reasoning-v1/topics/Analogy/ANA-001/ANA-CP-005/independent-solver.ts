import { letterFromPosition } from "../foundation/alphabet";
import { ANA_CP005_RULES, type AlphabetRuleContext } from "./rule-definitions";

export interface AlphabetPair {
  left: string;
  right: string;
}

export interface AlphabetRuleMatch {
  ruleId: string;
  context: AlphabetRuleContext;
  priority: number;
}

function sameContext(left: AlphabetRuleContext, right: AlphabetRuleContext): boolean {
  return left.shift === right.shift;
}

export function matchingAlphabetRules(pairs: readonly AlphabetPair[]): AlphabetRuleMatch[] {
  return ANA_CP005_RULES.flatMap((rule) =>
    rule.contexts
      .filter((context) => pairs.every((pair) => rule.apply(pair.left, context) === pair.right))
      .map((context) => ({ ruleId: rule.id, context, priority: rule.priority })),
  );
}

export function solveAlphabetRule(ruleId: string, context: AlphabetRuleContext, input: string): string {
  const rule = ANA_CP005_RULES.find((entry) => entry.id === ruleId);
  if (!rule) throw new Error(`Unknown alphabet rule: ${ruleId}`);
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
  return matches.some((match) => match.ruleId === ruleId && sameContext(match.context, context));
}

export function allEligibleLetters(ruleId: string): string[] {
  const rule = ANA_CP005_RULES.find((entry) => entry.id === ruleId);
  if (!rule) throw new Error(`Unknown alphabet rule: ${ruleId}`);
  return rule.eligibleInputPositions.map(letterFromPosition);
}
