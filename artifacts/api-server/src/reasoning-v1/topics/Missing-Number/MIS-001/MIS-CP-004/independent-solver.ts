import {
  MIS_CP004_RULES,
  type MisCp004RuleId,
} from './rule-definitions';

export interface MisCp004Group {
  readonly first: number;
  readonly second: number | null;
  readonly result: number;
}

export interface MisCp004RuleMatch {
  readonly ruleId: MisCp004RuleId;
  readonly semanticKey: string;
}

export interface MisCp004AmbiguityAudit {
  readonly accepted: boolean;
  readonly intendedSemanticKey: string;
  readonly matches: readonly MisCp004RuleMatch[];
  readonly reason: string;
}

function bounded(value: number | null): number | null {
  return value != null && Number.isInteger(value) && value > 0 && value <= 999 ? value : null;
}

function factorial(value: number): number | null {
  if (!Number.isInteger(value) || value < 0 || value > 6) return null;
  let result = 1;
  for (let n = 2; n <= value; n += 1) result *= n;
  return result;
}

export function independentlyEvaluateMisCp004Rule(
  ruleId: MisCp004RuleId,
  first: number,
  second: number | null,
): number | null {
  switch (ruleId) {
    case 'N_TIMES_NEXT':
      return bounded(first * (first + 1));
    case 'N_TIMES_PREVIOUS':
      return bounded(first * (first - 1));
    case 'THREE_CONSECUTIVE_PRODUCT':
      return bounded(first * (first + 1) * (first + 2));
    case 'THREE_CONSECUTIVE_SUM':
      return bounded(first + (first + 1) + (first + 2));
    case 'TRIANGULAR_NUMBER': {
      const numerator = first * (first + 1);
      return numerator % 2 === 0 ? bounded(numerator / 2) : null;
    }
    case 'SMALL_FACTORIAL':
      return bounded(factorial(first));
    case 'A_TIMES_SUM':
      return second == null ? null : bounded(first * (first + second));
    case 'B_TIMES_SUM':
      return second == null ? null : bounded(second * (first + second));
    case 'A_TIMES_DIFFERENCE':
      return second == null || first <= second ? null : bounded(first * (first - second));
  }
}

export function misCp004SemanticKey(ruleId: MisCp004RuleId): string {
  return ruleId;
}

export function independentlyVerifyMisCp004Group(
  ruleId: MisCp004RuleId,
  group: MisCp004Group,
): boolean {
  return independentlyEvaluateMisCp004Rule(ruleId, group.first, group.second) === group.result;
}

export function matchingMisCp004Rules(
  evidence: readonly MisCp004Group[],
): readonly MisCp004RuleMatch[] {
  const unary = evidence.every((group) => group.second == null);
  const matches: MisCp004RuleMatch[] = [];
  for (const rule of MIS_CP004_RULES) {
    if ((rule.operandCount === 1) !== unary) continue;
    if (evidence.every((group) => independentlyVerifyMisCp004Group(rule.ruleId, group))) {
      matches.push({ ruleId: rule.ruleId, semanticKey: misCp004SemanticKey(rule.ruleId) });
    }
  }
  return matches;
}

export function auditMisCp004Ambiguity(
  intendedRuleId: MisCp004RuleId,
  evidence: readonly MisCp004Group[],
): MisCp004AmbiguityAudit {
  const intendedSemanticKey = misCp004SemanticKey(intendedRuleId);
  const matches = matchingMisCp004Rules(evidence);
  const semanticKeys = [...new Set(matches.map((match) => match.semanticKey))];

  if (!semanticKeys.includes(intendedSemanticKey)) {
    return {
      accepted: false,
      intendedSemanticKey,
      matches,
      reason: 'The intended structured-number rule does not fit every evidence group.',
    };
  }
  if (semanticKeys.length !== 1) {
    return {
      accepted: false,
      intendedSemanticKey,
      matches,
      reason: `Competing CP004 rules survive: ${semanticKeys.join(', ')}`,
    };
  }
  return {
    accepted: true,
    intendedSemanticKey,
    matches,
    reason: 'Exactly one normalized consecutive/structured-number rule survives.',
  };
}
