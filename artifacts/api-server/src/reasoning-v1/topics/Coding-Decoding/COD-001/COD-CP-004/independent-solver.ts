import { inverseTransformWord, transformWord } from "../COD-CP-003/alphabet";
import { COD_CP003_RULES } from "../COD-CP-003/rule-definitions";
import type { CodCp003RuleContext, CodCp003RuleId } from "../COD-CP-003/types";
import { COD_CP004_RULES } from "./rule-definitions";
import { inversePositionWord, transformPositionWord } from "./transform";
import type { CodCp004RuleContext, CodCp004RuleId, PositionTransformEvidence, PositionTransformPrompt } from "./types";

export type EligibleTransformRuleId = CodCp003RuleId | CodCp004RuleId;
export type EligibleTransformContext = CodCp003RuleContext | CodCp004RuleContext;

export interface PositionRuleMatch {
  ruleId: EligibleTransformRuleId;
  context: EligibleTransformContext;
  priority: number;
  checkpointId: "COD-CP-003" | "COD-CP-004";
}

function contextKey(context: EligibleTransformContext): string {
  return JSON.stringify(Object.entries(context).sort(([left], [right]) => left.localeCompare(right)));
}

export function samePositionContext(left: EligibleTransformContext, right: EligibleTransformContext): boolean {
  return contextKey(left) === contextKey(right);
}

export function matchingPositionRules(evidence: readonly PositionTransformEvidence[]): PositionRuleMatch[] {
  const matches: PositionRuleMatch[] = [];
  for (const rule of COD_CP003_RULES) {
    for (const context of rule.contextDomain) {
      const accepted = evidence.every((pair) => {
        try {
          return pair.source.length === pair.code.length && transformWord(rule.ruleId, context, pair.source) === pair.code;
        } catch {
          return false;
        }
      });
      if (accepted) matches.push({ ruleId: rule.ruleId, context, priority: rule.priority, checkpointId: "COD-CP-003" });
    }
  }
  for (const rule of COD_CP004_RULES) {
    for (const context of rule.contextDomain) {
      const accepted = evidence.every((pair) => {
        try {
          return pair.source.length === pair.code.length && transformPositionWord(rule.ruleId, context, pair.source) === pair.code;
        } catch {
          return false;
        }
      });
      if (accepted) matches.push({ ruleId: rule.ruleId, context, priority: rule.priority, checkpointId: "COD-CP-004" });
    }
  }
  return matches;
}

export function inferPreferredPositionRule(evidence: readonly PositionTransformEvidence[]): PositionRuleMatch {
  const matches = matchingPositionRules(evidence);
  if (matches.length === 0) throw new Error("Displayed evidence supports no registered CP-003/CP-004 transformation");
  const minimumPriority = Math.min(...matches.map((match) => match.priority));
  const preferred = matches.filter((match) => match.priority === minimumPriority);
  if (preferred.length !== 1) throw new Error(`Displayed evidence has ${preferred.length} equal-priority interpretations`);
  return preferred[0]!;
}

function encodeWithMatch(match: PositionRuleMatch, word: string): string {
  return match.checkpointId === "COD-CP-003"
    ? transformWord(match.ruleId as CodCp003RuleId, match.context as CodCp003RuleContext, word)
    : transformPositionWord(match.ruleId as CodCp004RuleId, match.context as CodCp004RuleContext, word);
}

function decodeWithMatch(match: PositionRuleMatch, code: string): string {
  return match.checkpointId === "COD-CP-003"
    ? inverseTransformWord(match.ruleId as CodCp003RuleId, match.context as CodCp003RuleContext, code)
    : inversePositionWord(match.ruleId as CodCp004RuleId, match.context as CodCp004RuleContext, code);
}

export function solveCodCp004(prompt: PositionTransformPrompt): string {
  const inferred = inferPreferredPositionRule(prompt.evidence);
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
