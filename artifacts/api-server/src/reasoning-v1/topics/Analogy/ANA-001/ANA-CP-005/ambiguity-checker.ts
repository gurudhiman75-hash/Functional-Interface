import { matchingAlphabetRules, type AlphabetPair } from "./independent-solver";
import {
  sameAlphabetRuleContext,
  type AlphabetRuleContext,
} from "./rule-definitions";

export interface AlphabetAmbiguityResult {
  accepted: boolean;
  intendedPriority: number;
  competingRules: readonly { ruleId: string; context: AlphabetRuleContext; priority: number }[];
}

export function checkAlphabetAmbiguity(
  intendedRuleId: string,
  intendedContext: AlphabetRuleContext,
  evidence: readonly AlphabetPair[],
): AlphabetAmbiguityResult {
  const matches = matchingAlphabetRules(evidence);
  const intended = matches.find(
    (match) => match.ruleId === intendedRuleId && sameAlphabetRuleContext(match.context, intendedContext),
  );
  if (!intended) {
    return { accepted: false, intendedPriority: Number.POSITIVE_INFINITY, competingRules: matches };
  }
  const competingRules = matches.filter(
    (match) =>
      !(match.ruleId === intendedRuleId && sameAlphabetRuleContext(match.context, intendedContext)) &&
      match.priority <= intended.priority,
  );
  return {
    accepted: competingRules.length === 0,
    intendedPriority: intended.priority,
    competingRules,
  };
}
