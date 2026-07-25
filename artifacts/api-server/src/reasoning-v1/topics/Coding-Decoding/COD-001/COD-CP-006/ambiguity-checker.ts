import { intendedCompositeMatch, matchingCompositeRules } from "./independent-solver";
import { compositeStagesActive } from "./transform";
import type { CodCp006RuleContext, CodCp006RuleId, CompositeEvidence } from "./types";

export interface CompositeAmbiguityAudit {
  accepted: boolean;
  matches: ReturnType<typeof matchingCompositeRules>;
  reason?: string;
}

export function auditCompositeRule(
  intendedRuleId: CodCp006RuleId,
  intendedContext: CodCp006RuleContext,
  evidence: readonly CompositeEvidence[],
): CompositeAmbiguityAudit {
  if (evidence.length < 2) return { accepted: false, matches: [], reason: "At least two examples are required." };
  if (!evidence.every((pair) => compositeStagesActive(intendedRuleId, intendedContext, pair.source))) {
    return { accepted: false, matches: [], reason: "Every example must activate both stages." };
  }
  const matches = matchingCompositeRules(evidence);
  const intended = matches.find((match) => intendedCompositeMatch(match, intendedRuleId, intendedContext));
  if (!intended) return { accepted: false, matches, reason: "The intended pipeline does not explain all displayed evidence." };
  const competitors = matches.filter((match) => !intendedCompositeMatch(match, intendedRuleId, intendedContext));
  if (competitors.some((match) => match.priority <= intended.priority)) {
    return { accepted: false, matches, reason: "An earlier, equal-complexity or competing pipeline also explains the evidence." };
  }
  return { accepted: true, matches };
}
