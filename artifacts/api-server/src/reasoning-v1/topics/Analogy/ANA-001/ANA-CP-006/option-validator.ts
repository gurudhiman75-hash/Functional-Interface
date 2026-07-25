import {
  independentlyApplyClusterRule,
  matchingClusterRules,
  type ClusterPair,
} from "./independent-solver";
import type { AnaCp006RuleId, ClusterPresentationMode } from "./question-language.en";
import {
  sameClusterContext,
  type ClusterRuleContext,
} from "./rule-definitions";

export type ClusterOptionValue = string | readonly [string, string];

export interface ClusterOption {
  value: ClusterOptionValue;
  errorLabel: string | null;
}

function optionKey(value: ClusterOptionValue): string {
  return Array.isArray(value) ? `${value[0]}:${value[1]}` : value;
}

function matchesIntendedRule(
  ruleId: AnaCp006RuleId,
  context: ClusterRuleContext,
  pair: ClusterPair,
): boolean {
  return matchingClusterRules([pair]).some(
    (match) => match.ruleId === ruleId && sameClusterContext(match.context, context),
  );
}

export function validateClusterOptions(
  ruleId: AnaCp006RuleId,
  context: ClusterRuleContext,
  presentationMode: ClusterPresentationMode,
  source: ClusterPair,
  target: ClusterPair,
  options: readonly ClusterOption[],
): number {
  if (options.length !== 4) throw new Error("ANA-CP-006 requires exactly four options.");
  const keys = options.map((option) => optionKey(option.value));
  if (new Set(keys).size !== 4) throw new Error("ANA-CP-006 options must be unique.");

  const correctFlags = options.map((option) => {
    if (presentationMode === "DIRECT_COMPLETION") {
      if (typeof option.value !== "string") return false;
      return option.value === target.right;
    }
    if (!Array.isArray(option.value)) return false;
    const pair = { left: option.value[0], right: option.value[1] };
    return independentlyApplyClusterRule(ruleId, context, pair.left) === pair.right &&
      matchesIntendedRule(ruleId, context, pair);
  });

  const correctIndexes = correctFlags
    .map((correct, index) => correct ? index : -1)
    .filter((index) => index >= 0);

  if (correctIndexes.length !== 1) {
    throw new Error(`ANA-CP-006 expected exactly one intended answer, found ${correctIndexes.length}.`);
  }

  const correctIndex = correctIndexes[0];
  if (options[correctIndex].errorLabel !== null) {
    throw new Error("The correct ANA-CP-006 option must have a null error label.");
  }

  for (const [index, option] of options.entries()) {
    if (index === correctIndex) continue;
    if (!option.errorLabel) throw new Error("Every ANA-CP-006 distractor must carry an error label.");

    if (presentationMode === "DIRECT_COMPLETION") {
      if (typeof option.value !== "string") throw new Error("Direct-completion options must be strings.");
      const candidateEvidence = [source, { left: target.left, right: option.value }] as const;
      if (matchingClusterRules(candidateEvidence).length > 0) {
        throw new Error(`Direct distractor ${option.value} creates a registered alternative relation.`);
      }
    } else {
      if (!Array.isArray(option.value)) throw new Error("Pair-selection options must be cluster pairs.");
      const pair = { left: option.value[0], right: option.value[1] };
      if (matchingClusterRules([source, pair]).length > 0) {
        throw new Error(`Pair distractor ${pair.left}:${pair.right} creates a registered alternative relation.`);
      }
    }
  }

  return correctIndex;
}
