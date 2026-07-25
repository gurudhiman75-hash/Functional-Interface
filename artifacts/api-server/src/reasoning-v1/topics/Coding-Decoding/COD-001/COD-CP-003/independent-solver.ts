import { inverseTransformWord, normalizeShift, transformWord } from "./alphabet";
import { COD_CP003_RULES } from "./rule-definitions";
import type { AlphabetTransformEvidence, AlphabetTransformPrompt, CodCp003RuleContext, CodCp003RuleId } from "./types";

export interface AlphabetRuleMatch {
  ruleId: CodCp003RuleId;
  context: CodCp003RuleContext;
  priority: number;
}

export function sameAlphabetContext(left: CodCp003RuleContext, right: CodCp003RuleContext): boolean {
  return normalizeShift(left.shift ?? 0) === normalizeShift(right.shift ?? 0);
}

export function matchingAlphabetRules(evidence: readonly AlphabetTransformEvidence[]): AlphabetRuleMatch[] {
  const matches: AlphabetRuleMatch[] = [];
  for (const rule of COD_CP003_RULES) {
    for (const context of rule.contextDomain) {
      const accepted = evidence.every((pair) => {
        if (pair.source.length !== pair.code.length) return false;
        try {
          return transformWord(rule.ruleId, context, pair.source) === pair.code;
        } catch {
          return false;
        }
      });
      if (accepted) matches.push({ ruleId: rule.ruleId, context, priority: rule.priority });
    }
  }
  return matches;
}

export function inferPreferredAlphabetRule(evidence: readonly AlphabetTransformEvidence[]): AlphabetRuleMatch {
  const matches = matchingAlphabetRules(evidence);
  if (matches.length === 0) throw new Error("Displayed evidence supports no registered COD-CP-003 rule");
  const minimumPriority = Math.min(...matches.map((match) => match.priority));
  const preferred = matches.filter((match) => match.priority === minimumPriority);
  if (preferred.length !== 1) throw new Error(`Displayed evidence has ${preferred.length} equal-priority interpretations`);
  return preferred[0]!;
}

export function solveCodCp003(prompt: AlphabetTransformPrompt): string {
  const inferred = inferPreferredAlphabetRule(prompt.evidence);
  if (prompt.taskKind === "DECODE_TARGET") {
    if (!prompt.encodedTarget) throw new Error("Decode task is missing its encoded target");
    return inverseTransformWord(inferred.ruleId, inferred.context, prompt.encodedTarget);
  }
  const fullCode = transformWord(inferred.ruleId, inferred.context, prompt.targetWord);
  if (prompt.taskKind === "RECOVER_MISSING_LETTER") {
    if (prompt.missingIndex === undefined) throw new Error("Missing-letter task is missing its index");
    return fullCode[prompt.missingIndex]!;
  }
  return fullCode;
}
