import {
  MIS_CP002_RULES,
  misCp002ContextKey,
  misCp002ContextUsesAllInputs,
  type MisCp002RuleContext,
  type MisCp002RuleId,
} from './rule-definitions';

export interface MisCp002Group {
  readonly first: number;
  readonly second: number;
  readonly third: number;
  readonly result: number;
}

export interface MisCp002RuleMatch {
  readonly ruleId: MisCp002RuleId;
  readonly context: MisCp002RuleContext;
  readonly semanticKey: string;
  readonly baselineDifficulty: 'Easy' | 'Medium';
  readonly operationDepth: 2;
}

export interface MisCp002AmbiguityAudit {
  readonly accepted: boolean;
  readonly intendedSemanticKey: string;
  readonly matches: readonly MisCp002RuleMatch[];
  readonly reason: string;
}

function bounded(value: number | null): number | null {
  return value != null && Number.isInteger(value) && value > 0 && value <= 999 ? value : null;
}

function valuesOf(group: Pick<MisCp002Group, 'first' | 'second' | 'third'>): readonly number[] {
  return [group.first, group.second, group.third];
}

export function independentlyEvaluateMisCp002Rule(
  ruleId: MisCp002RuleId,
  inputs: readonly [number, number, number],
  context: MisCp002RuleContext,
): number | null {
  if (!misCp002ContextUsesAllInputs(context)) return null;
  const [leftRole, rightRole, thirdRole] = context.roles;
  const left = inputs[leftRole];
  const right = inputs[rightRole];
  const third = inputs[thirdRole];

  switch (ruleId) {
    case 'THREE_INPUT_SUM':
      return bounded(inputs[0] + inputs[1] + inputs[2]);
    case 'TWO_ADD_ONE_SUBTRACT':
      return bounded(left + right - third);
    case 'PAIR_PRODUCT_ADJUST_THIRD':
      return bounded((left * right) + (context.sign ?? 1) * third);
    case 'PAIR_SUM_TIMES_THIRD':
      return bounded((left + right) * third);
    case 'PAIR_DIFFERENCE_TIMES_THIRD':
      return bounded((left - right) * third);
    case 'PAIR_PRODUCT_DIVIDE_THIRD': {
      const numerator = left * right;
      return third !== 0 && numerator % third === 0 ? bounded(numerator / third) : null;
    }
    case 'PAIR_SUM_DIVIDE_THIRD': {
      const numerator = left + right;
      return third !== 0 && numerator % third === 0 ? bounded(numerator / third) : null;
    }
  }
}

export function misCp002SemanticKey(ruleId: MisCp002RuleId, context: MisCp002RuleContext): string {
  return `${ruleId}:${misCp002ContextKey(context)}`;
}

export function independentlyVerifyMisCp002Group(
  ruleId: MisCp002RuleId,
  context: MisCp002RuleContext,
  group: MisCp002Group,
): boolean {
  const inputs = valuesOf(group) as [number, number, number];
  return independentlyEvaluateMisCp002Rule(ruleId, inputs, context) === group.result;
}

export function matchingMisCp002Rules(
  evidence: readonly MisCp002Group[],
): readonly MisCp002RuleMatch[] {
  const matches: MisCp002RuleMatch[] = [];
  for (const rule of MIS_CP002_RULES) {
    for (const context of rule.contexts) {
      if (!misCp002ContextUsesAllInputs(context)) continue;
      if (evidence.every((group) => independentlyVerifyMisCp002Group(rule.ruleId, context, group))) {
        matches.push({
          ruleId: rule.ruleId,
          context,
          semanticKey: misCp002SemanticKey(rule.ruleId, context),
          baselineDifficulty: rule.baselineDifficulty,
          operationDepth: rule.operationDepth,
        });
      }
    }
  }
  return matches;
}

export function auditMisCp002Ambiguity(
  intendedRuleId: MisCp002RuleId,
  intendedContext: MisCp002RuleContext,
  evidence: readonly MisCp002Group[],
): MisCp002AmbiguityAudit {
  const intendedSemanticKey = misCp002SemanticKey(intendedRuleId, intendedContext);
  const matches = matchingMisCp002Rules(evidence);
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
      reason: `Competing CP002 rules survive: ${semanticKeys.join(', ')}`,
    };
  }
  return {
    accepted: true,
    intendedSemanticKey,
    matches,
    reason: 'Exactly one normalized three-input semantic rule survives all evidence groups.',
  };
}
