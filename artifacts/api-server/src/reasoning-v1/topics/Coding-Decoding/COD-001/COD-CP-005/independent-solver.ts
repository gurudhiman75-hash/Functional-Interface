import { matchingPositionRules } from "../COD-CP-004/independent-solver";
import type { PositionTransformEvidence } from "../COD-CP-004/types";
import { COD_CP005_RULES } from "./rule-definitions";
import { inverseRearrangementWord, sameRearrangementContext, transformRearrangementWord } from "./transform";
import type { CodCp005RuleContext, CodCp005RuleId, RearrangementEvidence, RearrangementPrompt } from "./types";

export interface RearrangementRuleMatch {
  ruleId: string;
  context: object;
  priority: number;
  checkpointId: "COD-CP-003" | "COD-CP-004" | "COD-CP-005";
}

export function matchingRearrangementRules(evidence: readonly RearrangementEvidence[]): RearrangementRuleMatch[] {
  const earlier = matchingPositionRules(evidence as readonly PositionTransformEvidence[]).map((match) => ({
    ruleId: match.ruleId,
    context: match.context as object,
    priority: match.priority,
    checkpointId: match.checkpointId,
  }));
  const current: RearrangementRuleMatch[] = [];
  for (const rule of COD_CP005_RULES) {
    for (const context of rule.contextDomain) {
      const accepted = evidence.every((pair) => {
        try {
          return pair.source.length === pair.code.length && transformRearrangementWord(rule.ruleId, context, pair.source) === pair.code;
        } catch {
          return false;
        }
      });
      if (accepted) current.push({ ruleId: rule.ruleId, context, priority: rule.priority, checkpointId: "COD-CP-005" });
    }
  }
  return [...earlier, ...current];
}

export function inferPreferredRearrangementRule(evidence: readonly RearrangementEvidence[]): RearrangementRuleMatch {
  const matches = matchingRearrangementRules(evidence);
  if (matches.length === 0) throw new Error("Displayed evidence supports no registered coding rule");
  const minimumPriority = Math.min(...matches.map((match) => match.priority));
  const preferred = matches.filter((match) => match.priority === minimumPriority);
  if (preferred.length !== 1) throw new Error(`Displayed evidence has ${preferred.length} equal-priority interpretations`);
  return preferred[0]!;
}

export function intendedRearrangementMatch(
  match: RearrangementRuleMatch,
  ruleId: CodCp005RuleId,
  context: CodCp005RuleContext,
): boolean {
  return match.checkpointId === "COD-CP-005" && match.ruleId === ruleId && sameRearrangementContext(match.context as CodCp005RuleContext, context);
}

function encodeWithMatch(match: RearrangementRuleMatch, word: string): string {
  if (match.checkpointId !== "COD-CP-005") throw new Error("CP-005 solver inferred an earlier transformation");
  return transformRearrangementWord(match.ruleId as CodCp005RuleId, match.context as CodCp005RuleContext, word);
}

function decodeWithMatch(match: RearrangementRuleMatch, code: string): string {
  if (match.checkpointId !== "COD-CP-005") throw new Error("CP-005 solver inferred an earlier transformation");
  return inverseRearrangementWord(match.ruleId as CodCp005RuleId, match.context as CodCp005RuleContext, code);
}

export function solveCodCp005(prompt: RearrangementPrompt): string {
  const inferred = inferPreferredRearrangementRule(prompt.evidence);
  if (prompt.taskKind === "DECODE_TARGET") {
    if (!prompt.encodedTarget) throw new Error("Decode task is missing its encoded target");
    return decodeWithMatch(inferred, prompt.encodedTarget);
  }
  const fullCode = encodeWithMatch(inferred, prompt.targetWord);
  if (prompt.taskKind === "RECOVER_MISSING_LETTER") {
    if (prompt.missingIndex === undefined) throw new Error("Missing-letter task is missing its position");
    return fullCode[prompt.missingIndex]!;
  }
  return fullCode;
}
