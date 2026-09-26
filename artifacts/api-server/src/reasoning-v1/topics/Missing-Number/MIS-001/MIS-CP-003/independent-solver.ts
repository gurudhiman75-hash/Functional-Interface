import {
  MIS_CP003_RULES,
  misCp003ContextKey,
  type MisCp003RuleContext,
  type MisCp003RuleId,
} from './rule-definitions';

export interface MisCp003Group {
  readonly first: number;
  readonly second: number;
  readonly result: number;
}

export interface MisCp003RuleMatch {
  readonly ruleId: MisCp003RuleId;
  readonly context: MisCp003RuleContext;
  readonly semanticKey: string;
}

export interface MisCp003AmbiguityAudit {
  readonly accepted: boolean;
  readonly intendedSemanticKey: string;
  readonly matches: readonly MisCp003RuleMatch[];
  readonly reason: string;
}

function bounded(value: number | null): number | null {
  return value != null && Number.isInteger(value) && value > 0 && value <= 999 ? value : null;
}

export function independentlyEvaluateMisCp003Rule(
  ruleId: MisCp003RuleId,
  first: number,
  second: number,
  context: MisCp003RuleContext,
): number | null {
  const squareFirst = first * first;
  const squareSecond = second * second;

  switch (ruleId) {
    case 'SQUARE_FIRST': return bounded(squareFirst);
    case 'SQUARE_SECOND': return bounded(squareSecond);
    case 'SQUARE_FIRST_PLUS_SECOND': return bounded(squareFirst + second);
    case 'SQUARE_FIRST_MINUS_SECOND': return bounded(squareFirst - second);
    case 'SUM_OF_SQUARES': return bounded(squareFirst + squareSecond);
    case 'DIFFERENCE_OF_SQUARES': return bounded(squareFirst - squareSecond);
    case 'PRODUCT_PLUS_FIRST_SQUARE': return bounded(first * second + squareFirst);
    case 'PRODUCT_PLUS_SECOND_SQUARE': return bounded(first * second + squareSecond);
    case 'CUBE_FIRST': return bounded(first * first * first);
    case 'PAIR_SUM_OR_DIFFERENCE_SQUARE': {
      const base = context.sign === -1 ? first - second : first + second;
      return bounded(base > 1 ? base * base : null);
    }
    case 'PAIR_SUM_OR_DIFFERENCE_CUBE': {
      const base = context.sign === -1 ? first - second : first + second;
      return bounded(base > 1 ? base * base * base : null);
    }
  }
}

export function misCp003SemanticKey(ruleId: MisCp003RuleId, context: MisCp003RuleContext): string {
  return `${ruleId}:${misCp003ContextKey(context)}`;
}

export function independentlyVerifyMisCp003Group(
  ruleId: MisCp003RuleId,
  context: MisCp003RuleContext,
  group: MisCp003Group,
): boolean {
  return independentlyEvaluateMisCp003Rule(ruleId, group.first, group.second, context) === group.result;
}

export function matchingMisCp003Rules(evidence: readonly MisCp003Group[]): readonly MisCp003RuleMatch[] {
  const matches: MisCp003RuleMatch[] = [];
  for (const rule of MIS_CP003_RULES) {
    for (const context of rule.contexts) {
      if (evidence.every((group) => independentlyVerifyMisCp003Group(rule.ruleId, context, group))) {
        matches.push({
          ruleId: rule.ruleId,
          context,
          semanticKey: misCp003SemanticKey(rule.ruleId, context),
        });
      }
    }
  }
  return matches;
}

export function auditMisCp003Ambiguity(
  intendedRuleId: MisCp003RuleId,
  intendedContext: MisCp003RuleContext,
  evidence: readonly MisCp003Group[],
): MisCp003AmbiguityAudit {
  const intendedSemanticKey = misCp003SemanticKey(intendedRuleId, intendedContext);
  const matches = matchingMisCp003Rules(evidence);
  const semanticKeys = [...new Set(matches.map((match) => match.semanticKey))];
  if (!semanticKeys.includes(intendedSemanticKey)) {
    return { accepted: false, intendedSemanticKey, matches, reason: 'The intended power rule does not fit every evidence group.' };
  }
  if (semanticKeys.length !== 1) {
    return { accepted: false, intendedSemanticKey, matches, reason: `Competing CP003 rules survive: ${semanticKeys.join(', ')}` };
  }
  return { accepted: true, intendedSemanticKey, matches, reason: 'Exactly one normalized square/cube semantic rule survives.' };
}
