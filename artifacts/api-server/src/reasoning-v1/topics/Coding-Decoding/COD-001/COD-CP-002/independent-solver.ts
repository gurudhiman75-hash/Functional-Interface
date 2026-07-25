import { COD_CP002_RULES, getCodCp002Rule } from "./rule-definitions";
import { evaluateNumericCode, parseNumericSequence, serializeNumericCode } from "./math";
import type { CodCp002RuleContext, CodCp002RuleId, NumericCodeEvidence, NumericCodingPrompt } from "./types";

export interface NumericRuleMatch {
  ruleId: CodCp002RuleId;
  context: CodCp002RuleContext;
  priority: number;
}

function contextKey(context: CodCp002RuleContext): string {
  return JSON.stringify({ constant: context.constant ?? null });
}

export function sameNumericContext(left: CodCp002RuleContext, right: CodCp002RuleContext): boolean {
  return contextKey(left) === contextKey(right);
}

export function matchingNumericRules(evidence: readonly NumericCodeEvidence[]): NumericRuleMatch[] {
  const matches: NumericRuleMatch[] = [];
  for (const rule of COD_CP002_RULES) {
    for (const context of rule.contextDomain) {
      let accepted = true;
      for (const pair of evidence) {
        try {
          if (serializeNumericCode(evaluateNumericCode(rule.ruleId, context, pair.word)) !== pair.code) {
            accepted = false;
            break;
          }
        } catch {
          accepted = false;
          break;
        }
      }
      if (accepted) matches.push({ ruleId: rule.ruleId, context, priority: rule.priority });
    }
  }
  return matches;
}

export function inferPreferredNumericRule(evidence: readonly NumericCodeEvidence[]): NumericRuleMatch {
  const matches = matchingNumericRules(evidence);
  if (matches.length === 0) throw new Error("Displayed evidence does not support any registered COD-CP-002 rule");
  const minimumPriority = Math.min(...matches.map((match) => match.priority));
  const preferred = matches.filter((match) => match.priority === minimumPriority);
  if (preferred.length !== 1) throw new Error(`Displayed evidence has ${preferred.length} equal-priority interpretations`);
  return preferred[0]!;
}

function decodeSequence(ruleId: CodCp002RuleId, context: CodCp002RuleContext, code: string): string {
  const values = parseNumericSequence(code);
  return values.map((value) => {
    let rank: number;
    switch (ruleId) {
      case "A1Z26_SEQUENCE_CODE": rank = value; break;
      case "Z1A26_SEQUENCE_CODE": rank = 27 - value; break;
      case "RANK_PLUS_CONSTANT_SEQUENCE": rank = value - (context.constant ?? 0); break;
      case "RANK_MINUS_CONSTANT_SEQUENCE": rank = value + (context.constant ?? 0); break;
      default: throw new Error(`${ruleId} is not independently decodable`);
    }
    if (!Number.isInteger(rank) || rank < 1 || rank > 26) throw new Error("Decoded rank is outside the alphabet");
    return String.fromCharCode(64 + rank);
  }).join("");
}

export function solveCodCp002(prompt: NumericCodingPrompt): string {
  const inferred = inferPreferredNumericRule(prompt.evidence);
  const rule = getCodCp002Rule(inferred.ruleId);
  if (prompt.taskKind === "DECODE_TARGET") {
    if (rule.outputShape !== "SEQUENCE" || !prompt.encodedTarget) throw new Error("Decode task requires a sequence code");
    return decodeSequence(inferred.ruleId, inferred.context, prompt.encodedTarget);
  }
  const fullCode = serializeNumericCode(evaluateNumericCode(inferred.ruleId, inferred.context, prompt.targetWord));
  if (prompt.taskKind === "RECOVER_MISSING_VALUE") {
    if (rule.outputShape === "SEQUENCE") {
      if (prompt.missingIndex === undefined) throw new Error("Sequence missing-value task lacks an index");
      return fullCode.split("-")[prompt.missingIndex]!;
    }
    return fullCode;
  }
  return fullCode;
}
