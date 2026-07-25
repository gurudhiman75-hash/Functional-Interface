import { matchingPositionRules, samePositionContext } from "./independent-solver";
import { activatesEveryBranch } from "./transform";
import type { CodCp004RuleContext, CodCp004RuleId, PositionTransformEvidence } from "./types";

export interface PositionAmbiguityAudit {
  accepted: boolean;
  matches: ReturnType<typeof matchingPositionRules>;
  reason?: string;
}

export function auditPositionTransformRule(
  intendedRuleId: CodCp004RuleId,
  intendedContext: CodCp004RuleContext,
  evidence: readonly PositionTransformEvidence[],
): PositionAmbiguityAudit {
  if (evidence.length < 2) return { accepted: false, matches: [], reason: "At least two examples are required." };
  if (!evidence.every((pair) => activatesEveryBranch(intendedRuleId, pair.source))) {
    return { accepted: false, matches: [], reason: "Every example must activate all branches of the intended rule." };
  }
  const matches = matchingPositionRules(evidence);
  const intended = matches.find((match) =>
    match.checkpointId === "COD-CP-004" &&
    match.ruleId === intendedRuleId &&
    samePositionContext(match.context, intendedContext),
  );
  if (!intended) return { accepted: false, matches, reason: "The intended rule does not explain all displayed evidence." };
  const competitors = matches.filter((match) => !(
    match.checkpointId === "COD-CP-004" &&
    match.ruleId === intendedRuleId &&
    samePositionContext(match.context, intendedContext)
  ));
  if (competitors.some((match) => match.priority <= intended.priority)) {
    return { accepted: false, matches, reason: "A simpler or equal-priority CP-003/CP-004 rule also explains the evidence." };
  }
  return { accepted: true, matches };
}
