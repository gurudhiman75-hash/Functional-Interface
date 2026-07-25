import { matchingAlphabetRules, type AlphabetPair } from "./independent-solver";
import type { AlphabetRuleContext } from "./rule-definitions";

export interface AlphabetAmbiguityResult {
  accepted: boolean;
  intendedPriority: number;
  competingRules: readonly { ruleId: string; context: AlphabetRuleContext; priority: number }[];
}

function sameContext(left: AlphabetRuleContext, right: AlphabetRuleContext): boolean {
  return left.shift === right.shift;
}

export function checkAlphabetAmbiguity(
  intendedRuleId: string,
  intendedContext: AlphabetRuleContext,
  evidence: readonly AlphabetPair[],
): AlphabetAmbiguityResult {
  const matches = matchingAlphabetRules(evidence);
  const intended = matches.find(
    (match) => match.ruleId === intendedRuleId && sameContext(match.context, intendedContext),
  );
  if (!intended) {
    return { accepted: false, intendedPriority: Number.POSITIVE_INFINITY, competingRules: matches };
  }
  const competingRules = matches.filter(
    (match) =>
      !(match.ruleId === intendedRuleId && sameContext(match.context, intendedContext)) &&
      match.priority <= intended.priority,
  );
  return {
    accepted: competingRules.length === 0,
    intendedPriority: intended.priority,
    competingRules,
  };
}
