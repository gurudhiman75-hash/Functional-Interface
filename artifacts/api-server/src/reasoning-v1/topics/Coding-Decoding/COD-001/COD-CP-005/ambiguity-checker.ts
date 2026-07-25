import { intendedRearrangementMatch, matchingRearrangementRules } from "./independent-solver";
import { rearrangementIsActive } from "./transform";
import type { CodCp005RuleContext, CodCp005RuleId, RearrangementEvidence } from "./types";

export interface RearrangementAmbiguityAudit {
  accepted: boolean;
  matches: ReturnType<typeof matchingRearrangementRules>;
  reason?: string;
}

export function auditRearrangementRule(
  intendedRuleId: CodCp005RuleId,
  intendedContext: CodCp005RuleContext,
  evidence: readonly RearrangementEvidence[],
): RearrangementAmbiguityAudit {
  if (evidence.length < 2) return { accepted: false, matches: [], reason: "At least two examples are required." };
  if (!evidence.every((pair) => pair.source.length === pair.code.length)) {
    return { accepted: false, matches: [], reason: "Every rearrangement must preserve word length." };
  }
  if (!evidence.every((pair) => rearrangementIsActive(intendedRuleId, intendedContext, pair.source))) {
    return { accepted: false, matches: [], reason: "Every example must visibly activate the intended rearrangement." };
  }
  const matches = matchingRearrangementRules(evidence);
  const intended = matches.find((match) => intendedRearrangementMatch(match, intendedRuleId, intendedContext));
  if (!intended) return { accepted: false, matches, reason: "The intended rule does not explain all displayed evidence." };
  const competitors = matches.filter((match) => !intendedRearrangementMatch(match, intendedRuleId, intendedContext));
  if (competitors.some((match) => match.priority <= intended.priority)) {
    return { accepted: false, matches, reason: "An earlier or equal-priority rule also explains the evidence." };
  }
  return { accepted: true, matches };
}
