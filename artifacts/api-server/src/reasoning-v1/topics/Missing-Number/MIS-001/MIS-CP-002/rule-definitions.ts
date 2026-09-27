export type MisCp002CandidateId =
  | 'MIS-CAND-009'
  | 'MIS-CAND-010'
  | 'MIS-CAND-011'
  | 'MIS-CAND-012'
  | 'MIS-CAND-013'
  | 'MIS-CAND-014'
  | 'MIS-CAND-015';

export type MisCp002RuleId =
  | 'THREE_INPUT_SUM'
  | 'TWO_ADD_ONE_SUBTRACT'
  | 'PAIR_PRODUCT_ADJUST_THIRD'
  | 'PAIR_SUM_TIMES_THIRD'
  | 'PAIR_DIFFERENCE_TIMES_THIRD'
  | 'PAIR_PRODUCT_DIVIDE_THIRD'
  | 'PAIR_SUM_DIVIDE_THIRD';

export type MisCp002InputIndex = 0 | 1 | 2;
export type MisCp002Roles = readonly [
  MisCp002InputIndex,
  MisCp002InputIndex,
  MisCp002InputIndex,
];

export interface MisCp002RuleContext {
  readonly roles: MisCp002Roles;
  readonly sign?: 1 | -1;
}

export interface MisCp002RuleDefinition {
  readonly candidateId: MisCp002CandidateId;
  readonly ruleId: MisCp002RuleId;
  readonly label: string;
  readonly baselineDifficulty: 'Easy' | 'Medium';
  readonly operationDepth: 2;
  readonly minInput: number;
  readonly maxInput: number;
  readonly contexts: readonly MisCp002RuleContext[];
}

const ALL: readonly MisCp002InputIndex[] = [0, 1, 2];

function pairThenThirdContexts(): readonly MisCp002RuleContext[] {
  return ALL.map((third) => {
    const pair = ALL.filter((index) => index !== third);
    return Object.freeze({ roles: Object.freeze([pair[0]!, pair[1]!, third]) as MisCp002Roles });
  });
}

function differenceThenThirdContexts(): readonly MisCp002RuleContext[] {
  return ALL.flatMap((third) => {
    const pair = ALL.filter((index) => index !== third);
    return [
      Object.freeze({ roles: Object.freeze([pair[0]!, pair[1]!, third]) as MisCp002Roles }),
      Object.freeze({ roles: Object.freeze([pair[1]!, pair[0]!, third]) as MisCp002Roles }),
    ];
  });
}

const SUM_CONTEXT = Object.freeze([
  Object.freeze({ roles: Object.freeze([0, 1, 2]) as MisCp002Roles }),
]);

const ADD_SUB_CONTEXTS = Object.freeze(pairThenThirdContexts());
const PAIR_THIRD_CONTEXTS = Object.freeze(pairThenThirdContexts());
const DIFFERENCE_THIRD_CONTEXTS = Object.freeze(differenceThenThirdContexts());
const PRODUCT_ADJUST_CONTEXTS = Object.freeze(
  PAIR_THIRD_CONTEXTS.flatMap((context) => [
    Object.freeze({ roles: context.roles, sign: 1 as const }),
    Object.freeze({ roles: context.roles, sign: -1 as const }),
  ]),
);

export const MIS_CP002_RULES: readonly MisCp002RuleDefinition[] = Object.freeze([
  {
    candidateId: 'MIS-CAND-009',
    ruleId: 'THREE_INPUT_SUM',
    label: 'add all three numbers',
    baselineDifficulty: 'Easy',
    operationDepth: 2,
    minInput: 2,
    maxInput: 22,
    contexts: SUM_CONTEXT,
  },
  {
    candidateId: 'MIS-CAND-010',
    ruleId: 'TWO_ADD_ONE_SUBTRACT',
    label: 'add two positions and subtract the third',
    baselineDifficulty: 'Easy',
    operationDepth: 2,
    minInput: 2,
    maxInput: 26,
    contexts: ADD_SUB_CONTEXTS,
  },
  {
    candidateId: 'MIS-CAND-011',
    ruleId: 'PAIR_PRODUCT_ADJUST_THIRD',
    label: 'multiply a pair, then add or subtract the remaining number',
    baselineDifficulty: 'Medium',
    operationDepth: 2,
    minInput: 2,
    maxInput: 16,
    contexts: PRODUCT_ADJUST_CONTEXTS,
  },
  {
    candidateId: 'MIS-CAND-012',
    ruleId: 'PAIR_SUM_TIMES_THIRD',
    label: 'add a pair, then multiply by the remaining number',
    baselineDifficulty: 'Medium',
    operationDepth: 2,
    minInput: 2,
    maxInput: 13,
    contexts: PAIR_THIRD_CONTEXTS,
  },
  {
    candidateId: 'MIS-CAND-013',
    ruleId: 'PAIR_DIFFERENCE_TIMES_THIRD',
    label: 'subtract one position from another, then multiply by the remaining number',
    baselineDifficulty: 'Medium',
    operationDepth: 2,
    minInput: 2,
    maxInput: 18,
    contexts: DIFFERENCE_THIRD_CONTEXTS,
  },
  {
    candidateId: 'MIS-CAND-014',
    ruleId: 'PAIR_PRODUCT_DIVIDE_THIRD',
    label: 'multiply a pair, then divide by the remaining number',
    baselineDifficulty: 'Medium',
    operationDepth: 2,
    minInput: 2,
    maxInput: 20,
    contexts: PAIR_THIRD_CONTEXTS,
  },
  {
    candidateId: 'MIS-CAND-015',
    ruleId: 'PAIR_SUM_DIVIDE_THIRD',
    label: 'add a pair, then divide by the remaining number',
    baselineDifficulty: 'Medium',
    operationDepth: 2,
    minInput: 2,
    maxInput: 24,
    contexts: PAIR_THIRD_CONTEXTS,
  },
]);

export function misCp002RuleByCandidateId(candidateId: string): MisCp002RuleDefinition {
  const rule = MIS_CP002_RULES.find((entry) => entry.candidateId === candidateId);
  if (!rule) throw new Error(`Unknown MIS-CP-002 candidate: ${candidateId}`);
  return rule;
}

export function misCp002ContextKey(context: MisCp002RuleContext): string {
  const roleKey = context.roles.join('');
  return context.sign == null ? `R=${roleKey}` : `R=${roleKey};S=${context.sign}`;
}

export function misCp002ContextUsesAllInputs(context: MisCp002RuleContext): boolean {
  return new Set(context.roles).size === 3
    && context.roles.every((index) => index === 0 || index === 1 || index === 2);
}
