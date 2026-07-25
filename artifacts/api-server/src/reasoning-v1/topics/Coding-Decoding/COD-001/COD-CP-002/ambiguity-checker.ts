import { matchingNumericRules, sameNumericContext } from "./independent-solver";
import type { CodCp002RuleContext, CodCp002RuleId, NumericCodeEvidence } from "./types";

export interface NumericAmbiguityAudit {
  accepted: boolean;
  matches: ReturnType<typeof matchingNumericRules>;
  reason?: string;
}

export function auditNumericCodingRule(
  intendedRuleId: CodCp002RuleId,
  intendedContext: CodCp002RuleContext,
  evidence: readonly NumericCodeEvidence[],
): NumericAmbiguityAudit {
  const matches = matchingNumericRules(evidence);
  const intended = matches.find((match) => match.ruleId === intendedRuleId && sameNumericContext(match.context, intendedContext));
  if (!intended) return { accepted: false, matches, reason: "The intended rule does not explain every example." };
  const competitors = matches.filter((match) => !(match.ruleId === intendedRuleId && sameNumericContext(match.context, intendedContext)));
  if (competitors.some((match) => match.priority <= intended.priority)) {
    return { accepted: false, matches, reason: "An equal-or-simpler registered rule also explains the evidence." };
  }
  return { accepted: true, matches };
}
