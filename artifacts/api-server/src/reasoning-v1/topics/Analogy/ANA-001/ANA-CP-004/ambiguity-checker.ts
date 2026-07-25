import { matchingSetRules, type NumberTriple } from "./independent-solver";
import type { SetRuleContext } from "./rule-definitions";

function sameContext(left: SetRuleContext, right: SetRuleContext): boolean {
  return left.k === right.k && left.ratio === right.ratio;
}

export interface SetAmbiguityResult {
  accepted: boolean;
  matches: readonly { ruleId: string; context: SetRuleContext; priority: number }[];
  reason?: string;
}

export function checkSetAmbiguity(
  intendedRuleId: string,
  intendedContext: SetRuleContext,
  triples: readonly NumberTriple[],
): SetAmbiguityResult {
  const matches = matchingSetRules(triples);
  const intended = matches.find((match) => match.ruleId === intendedRuleId && sameContext(match.context, intendedContext));
  if (!intended) return { accepted: false, matches, reason: "The intended rule does not solve every triple." };
  const competitors = matches.filter((match) => !(match.ruleId === intendedRuleId && sameContext(match.context, intendedContext)));
  if (competitors.some((match) => match.priority <= intended.priority)) {
    return { accepted: false, matches, reason: "An equal-or-simpler competing rule also fits the examples." };
  }
  return { accepted: true, matches };
}
