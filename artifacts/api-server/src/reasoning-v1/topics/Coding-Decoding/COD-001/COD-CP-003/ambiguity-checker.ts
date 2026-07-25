import { matchingAlphabetRules, sameAlphabetContext } from "./independent-solver";
import type { AlphabetTransformEvidence, CodCp003RuleContext, CodCp003RuleId } from "./types";

export interface AlphabetAmbiguityAudit {
  accepted: boolean;
  matches: ReturnType<typeof matchingAlphabetRules>;
  reason?: string;
}

function distinctCorrespondences(evidence: readonly AlphabetTransformEvidence[]): number {
  return new Set(evidence.flatMap((pair) => [...pair.source].map((letter, index) => `${letter}:${pair.code[index]}`))).size;
}

export function auditAlphabetTransformRule(
  intendedRuleId: CodCp003RuleId,
  intendedContext: CodCp003RuleContext,
  evidence: readonly AlphabetTransformEvidence[],
): AlphabetAmbiguityAudit {
  if (distinctCorrespondences(evidence) < 2) {
    return { accepted: false, matches: [], reason: "At least two non-identical character correspondences are required." };
  }
  const matches = matchingAlphabetRules(evidence);
  const intended = matches.find((match) => match.ruleId === intendedRuleId && sameAlphabetContext(match.context, intendedContext));
  if (!intended) return { accepted: false, matches, reason: "The intended transform does not explain all displayed evidence." };
  const competitors = matches.filter((match) => !(match.ruleId === intendedRuleId && sameAlphabetContext(match.context, intendedContext)));
  if (competitors.some((match) => match.priority <= intended.priority)) {
    return { accepted: false, matches, reason: "An equal-or-simpler transform also explains the displayed subset." };
  }
  return { accepted: true, matches };
}
