import {
  MIS_CP001_RULES,
  contextKey,
  type MisCp001RuleContext,
  type MisCp001RuleId,
} from './rule-definitions';

export interface MisNumberGroup {
  readonly first: number;
  readonly second: number;
  readonly result: number;
}

export interface MisCp001RuleMatch {
  readonly ruleId: MisCp001RuleId;
  readonly context: MisCp001RuleContext;
  readonly semanticKey: string;
  readonly difficulty: 'Easy' | 'Medium';
  readonly operationDepth: 1 | 2;
}

export interface MisCp001AmbiguityAudit {
  readonly accepted: boolean;
  readonly intendedSemanticKey: string;
  readonly matches: readonly MisCp001RuleMatch[];
  readonly reason: string;
}

function bounded(value: number | null): number | null {
  return value != null && Number.isInteger(value) && value > 0 && value <= 999 ? value : null;
}

export function independentlyEvaluateMisCp001Rule(
  ruleId: MisCp001RuleId,
  first: number,
  second: number,
  context: MisCp001RuleContext,
): number | null {
  const k = context.k ?? 0;
  switch (ruleId) {
    case 'SUM':
      return bounded(first + second);
    case 'ABS_DIFFERENCE':
      return bounded(Math.abs(first - second));
    case 'PRODUCT':
      return bounded(first * second);
    case 'EXACT_DIVISION':
      return second !== 0 && first % second === 0 ? bounded(first / second) : null;
    case 'SUM_PLUS_CONSTANT':
      return bounded(first + second + k);
    case 'PRODUCT_PLUS_CONSTANT':
      return bounded(first * second + k);
    case 'PRODUCT_MINUS_CONSTANT':
      return bounded(first * second - k);
    case 'DIFFERENCE_PLUS_CONSTANT':
      return bounded(Math.abs(first - second) + k);
  }
}

export function misCp001SemanticKey(ruleId: MisCp001RuleId, context: MisCp001RuleContext): string {
  return `${ruleId}:${contextKey(context)}`;
}

export function independentlyVerifyMisCp001Group(
  ruleId: MisCp001RuleId,
  context: MisCp001RuleContext,
  group: MisNumberGroup,
): boolean {
  return independentlyEvaluateMisCp001Rule(ruleId, group.first, group.second, context) === group.result;
}

export function matchingMisCp001Rules(
  evidence: readonly MisNumberGroup[],
): readonly MisCp001RuleMatch[] {
  const matches: MisCp001RuleMatch[] = [];
  for (const rule of MIS_CP001_RULES) {
    for (const context of rule.contexts) {
      if (evidence.every((group) => independentlyVerifyMisCp001Group(rule.ruleId, context, group))) {
        matches.push({
          ruleId: rule.ruleId,
          context,
          semanticKey: misCp001SemanticKey(rule.ruleId, context),
          difficulty: rule.difficulty,
          operationDepth: rule.operationDepth,
        });
      }
    }
  }
  return matches;
}

export function auditMisCp001Ambiguity(
  intendedRuleId: MisCp001RuleId,
  intendedContext: MisCp001RuleContext,
  evidence: readonly MisNumberGroup[],
): MisCp001AmbiguityAudit {
  const intendedSemanticKey = misCp001SemanticKey(intendedRuleId, intendedContext);
  const matches = matchingMisCp001Rules(evidence);
  const semanticKeys = [...new Set(matches.map((match) => match.semanticKey))];
  if (!semanticKeys.includes(intendedSemanticKey)) {
    return {
      accepted: false,
      intendedSemanticKey,
      matches,
      reason: 'The intended rule does not independently reproduce every evidence group.',
    };
  }
  if (semanticKeys.length !== 1) {
    return {
      accepted: false,
      intendedSemanticKey,
      matches,
      reason: `Competing CP001 rules survive: ${semanticKeys.join(', ')}`,
    };
  }
  return {
    accepted: true,
    intendedSemanticKey,
    matches,
    reason: 'Exactly one CP001 semantic rule survives all evidence groups.',
  };
}
