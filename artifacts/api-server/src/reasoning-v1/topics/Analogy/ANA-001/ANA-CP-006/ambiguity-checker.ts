import {
  matchingClusterRules,
  type ClusterPair,
  type ClusterRuleMatch,
} from "./independent-solver";
import type { AnaCp006RuleId } from "./question-language.en";
import {
  sameClusterContext,
  type ClusterRuleContext,
} from "./rule-definitions";

export interface ClusterAmbiguityResult {
  accepted: boolean;
  intendedPriority: number;
  intendedMatch: ClusterRuleMatch | null;
  competingRules: readonly ClusterRuleMatch[];
  allMatches: readonly ClusterRuleMatch[];
}

export function checkClusterAmbiguity(
  intendedRuleId: AnaCp006RuleId,
  intendedContext: ClusterRuleContext,
  evidence: readonly ClusterPair[],
): ClusterAmbiguityResult {
  const allMatches = matchingClusterRules(evidence);
  const intendedMatch = allMatches.find(
    (match) => match.ruleId === intendedRuleId && sameClusterContext(match.context, intendedContext),
  ) ?? null;

  if (!intendedMatch) {
    return {
      accepted: false,
      intendedPriority: Number.POSITIVE_INFINITY,
      intendedMatch: null,
      competingRules: allMatches,
      allMatches,
    };
  }

  const competingRules = allMatches.filter(
    (match) =>
      !(match.ruleId === intendedRuleId && sameClusterContext(match.context, intendedContext)) &&
      match.priority <= intendedMatch.priority,
  );

  return {
    accepted: competingRules.length === 0,
    intendedPriority: intendedMatch.priority,
    intendedMatch,
    competingRules,
    allMatches,
  };
}
