import { matchingClusterRules, type ClusterRuleMatch } from "../ANA-CP-006/independent-solver";
import {
  matchingWordRules,
  type WordEvidence,
  type WordRuleMatch,
} from "./independent-solver";
import type { AnaCp007RuleId } from "./question-language.en";
import {
  sameWordRuleContext,
  wordRuleById,
  type WordRuleContext,
} from "./rule-definitions";

export interface WordAmbiguityResult {
  accepted: boolean;
  intendedFound: boolean;
  equalOrSimplerNativeMatches: readonly WordRuleMatch[];
  cp006Matches: readonly ClusterRuleMatch[];
  reasons: readonly string[];
}

function clusterEligibleEvidence(evidence: readonly WordEvidence[]): boolean {
  return evidence.every(({ input, output }) =>
    typeof output === "string" && /^[A-Z]+$/.test(input) && /^[A-Z]+$/.test(output),
  );
}

export function checkWordAmbiguity(
  intendedRuleId: AnaCp007RuleId,
  intendedContext: WordRuleContext,
  evidence: readonly WordEvidence[],
): WordAmbiguityResult {
  const intendedRule = wordRuleById(intendedRuleId);
  const allNativeMatches = matchingWordRules(evidence);
  const equalOrSimplerNativeMatches = allNativeMatches.filter(
    (match) => match.priority <= intendedRule.priority,
  );
  const intendedFound = equalOrSimplerNativeMatches.some(
    (match) => match.ruleId === intendedRuleId && sameWordRuleContext(match.context, intendedContext),
  );

  const cp006Matches = clusterEligibleEvidence(evidence)
    ? matchingClusterRules(evidence.map(({ input, output }) => ({
      left: input,
      right: output as string,
    })))
    : [];

  const reasons: string[] = [];
  if (!intendedFound) reasons.push("The intended rule and context do not solve all displayed evidence.");
  if (equalOrSimplerNativeMatches.length !== 1) {
    reasons.push(`The evidence has ${equalOrSimplerNativeMatches.length} equal-or-simpler CP-007 matches.`);
  }
  if (cp006Matches.length > 0) {
    reasons.push(`The evidence is also explained by ${cp006Matches.length} ANA-CP-006 cluster rule match(es).`);
  }

  return {
    accepted: intendedFound && equalOrSimplerNativeMatches.length === 1 && cp006Matches.length === 0,
    intendedFound,
    equalOrSimplerNativeMatches,
    cp006Matches,
    reasons,
  };
}
