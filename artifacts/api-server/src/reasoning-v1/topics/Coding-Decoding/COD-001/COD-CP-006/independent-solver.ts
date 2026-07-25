import { inverseTransformWord, transformWord } from "../COD-CP-003/alphabet";
import { COD_CP003_RULES } from "../COD-CP-003/rule-definitions";
import type { CodCp003RuleContext, CodCp003RuleId } from "../COD-CP-003/types";
import { inversePositionWord, transformPositionWord } from "../COD-CP-004/transform";
import { COD_CP004_RULES } from "../COD-CP-004/rule-definitions";
import type { CodCp004RuleContext, CodCp004RuleId } from "../COD-CP-004/types";
import { inverseRearrangementWord, transformRearrangementWord } from "../COD-CP-005/transform";
import { COD_CP005_RULES } from "../COD-CP-005/rule-definitions";
import type { CodCp005RuleContext, CodCp005RuleId } from "../COD-CP-005/types";
import { COD_CP006_RULES } from "./rule-definitions";
import { codeTokenAt, inverseCompositeWord, sameCompositeContext, transformCompositeWord } from "./transform";
import type { CodCp006RuleContext, CodCp006RuleId, CompositeEvidence, CompositePrompt } from "./types";

export interface CompositeRuleMatch {
  ruleId: string;
  context: object;
  priority: number;
  checkpointId: "COD-CP-003" | "COD-CP-004" | "COD-CP-005" | "COD-CP-006";
}

function isLetterCode(code: string, sourceLength: number): boolean {
  return code.length === sourceLength && /^[A-Z]+$/.test(code);
}

export function matchingCompositeRules(evidence: readonly CompositeEvidence[]): CompositeRuleMatch[] {
  const matches: CompositeRuleMatch[] = [];

  for (const rule of COD_CP003_RULES) {
    for (const context of rule.contextDomain) {
      const accepted = evidence.every((pair) => {
        try {
          return isLetterCode(pair.code, pair.source.length)
            && transformWord(rule.ruleId, context, pair.source) === pair.code;
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
          return isLetterCode(pair.code, pair.source.length)
            && transformPositionWord(rule.ruleId, context, pair.source) === pair.code;
        } catch {
          return false;
        }
      });
      if (accepted) matches.push({ ruleId: rule.ruleId, context, priority: rule.priority, checkpointId: "COD-CP-004" });
    }
  }

  for (const rule of COD_CP005_RULES) {
    for (const context of rule.contextDomain) {
      const accepted = evidence.every((pair) => {
        try {
          return isLetterCode(pair.code, pair.source.length)
            && transformRearrangementWord(rule.ruleId, context, pair.source) === pair.code;
        } catch {
          return false;
        }
      });
      if (accepted) matches.push({ ruleId: rule.ruleId, context, priority: rule.priority, checkpointId: "COD-CP-005" });
    }
  }

  for (const rule of COD_CP006_RULES) {
    for (const context of rule.contextDomain) {
      const accepted = evidence.every((pair) => {
        try {
          return transformCompositeWord(rule.ruleId, context, pair.source) === pair.code;
        } catch {
          return false;
        }
      });
      if (accepted) matches.push({ ruleId: rule.ruleId, context, priority: rule.priority, checkpointId: "COD-CP-006" });
    }
  }

  return matches;
}

export function inferPreferredCompositeRule(evidence: readonly CompositeEvidence[]): CompositeRuleMatch {
  const matches = matchingCompositeRules(evidence);
  if (matches.length === 0) throw new Error("Displayed evidence supports no registered coding rule");
  const minimumPriority = Math.min(...matches.map((match) => match.priority));
  const preferred = matches.filter((match) => match.priority === minimumPriority);
  if (preferred.length !== 1) throw new Error(`Displayed evidence has ${preferred.length} equal-priority interpretations`);
  return preferred[0]!;
}

export function intendedCompositeMatch(
  match: CompositeRuleMatch,
  ruleId: CodCp006RuleId,
  context: CodCp006RuleContext,
): boolean {
  return match.checkpointId === "COD-CP-006"
    && match.ruleId === ruleId
    && sameCompositeContext(match.context as CodCp006RuleContext, context);
}

function encodeWithMatch(match: CompositeRuleMatch, word: string): string {
  if (match.checkpointId !== "COD-CP-006") throw new Error("CP-006 solver inferred an earlier single-stage rule");
  return transformCompositeWord(match.ruleId as CodCp006RuleId, match.context as CodCp006RuleContext, word);
}

function decodeWithMatch(match: CompositeRuleMatch, code: string): string {
  if (match.checkpointId !== "COD-CP-006") throw new Error("CP-006 solver inferred an earlier single-stage rule");
  return inverseCompositeWord(match.ruleId as CodCp006RuleId, match.context as CodCp006RuleContext, code);
}

export function solveCodCp006(prompt: CompositePrompt): string {
  const inferred = inferPreferredCompositeRule(prompt.evidence);
  if (prompt.taskKind === "DECODE_TARGET") {
    if (!prompt.encodedTarget) throw new Error("Decode task is missing its encoded target");
    return decodeWithMatch(inferred, prompt.encodedTarget);
  }
  const fullCode = encodeWithMatch(inferred, prompt.targetWord);
  if (prompt.taskKind === "RECOVER_MISSING_TOKEN") {
    if (prompt.missingIndex === undefined) throw new Error("Missing-token task is missing its position");
    return codeTokenAt(fullCode, prompt.missingIndex, prompt.separator);
  }
  return fullCode;
}

export function encodeEarlierForAudit(match: CompositeRuleMatch, word: string): string {
  switch (match.checkpointId) {
    case "COD-CP-003": return transformWord(match.ruleId as CodCp003RuleId, match.context as CodCp003RuleContext, word);
    case "COD-CP-004": return transformPositionWord(match.ruleId as CodCp004RuleId, match.context as CodCp004RuleContext, word);
    case "COD-CP-005": return transformRearrangementWord(match.ruleId as CodCp005RuleId, match.context as CodCp005RuleContext, word);
    case "COD-CP-006": return transformCompositeWord(match.ruleId as CodCp006RuleId, match.context as CodCp006RuleContext, word);
  }
}

export function decodeEarlierForAudit(match: CompositeRuleMatch, code: string): string {
  switch (match.checkpointId) {
    case "COD-CP-003": return inverseTransformWord(match.ruleId as CodCp003RuleId, match.context as CodCp003RuleContext, code);
    case "COD-CP-004": return inversePositionWord(match.ruleId as CodCp004RuleId, match.context as CodCp004RuleContext, code);
    case "COD-CP-005": return inverseRearrangementWord(match.ruleId as CodCp005RuleId, match.context as CodCp005RuleContext, code);
    case "COD-CP-006": return inverseCompositeWord(match.ruleId as CodCp006RuleId, match.context as CodCp006RuleContext, code);
  }
}
