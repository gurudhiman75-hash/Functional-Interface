import { matchingNumericRules, type NumericPair } from "./independent-solver";
import type { NumericRuleContext } from "./rule-definitions";

function sameContext(left: NumericRuleContext, right: NumericRuleContext): boolean {
  return left.k === right.k && left.m === right.m;
}

export interface AmbiguityResult {
  accepted: boolean;
  matches: readonly { ruleId: string; context: NumericRuleContext; priority: number }[];
  reason?: string;
}

export function checkNumericAmbiguity(
  intendedRuleId: string,
  intendedContext: NumericRuleContext,
  pairs: readonly NumericPair[],
): AmbiguityResult {
  const matches = matchingNumericRules(pairs);
  const intended = matches.find((match) => match.ruleId === intendedRuleId && sameContext(match.context, intendedContext));
  if (!intended) return { accepted: false, matches, reason: "The intended rule does not solve all source pairs." };
  const competing = matches.filter((match) => !(match.ruleId === intendedRuleId && sameContext(match.context, intendedContext)));
  if (competing.some((match) => match.priority <= intended.priority)) {
    return { accepted: false, matches, reason: "A competing rule of equal or lower complexity also fits the examples." };
  }
  return { accepted: true, matches };
}
