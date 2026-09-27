export type MisCp001CandidateId =
  | 'MIS-CAND-001'
  | 'MIS-CAND-002'
  | 'MIS-CAND-003'
  | 'MIS-CAND-004'
  | 'MIS-CAND-005'
  | 'MIS-CAND-006'
  | 'MIS-CAND-007'
  | 'MIS-CAND-008';

export type MisCp001RuleId =
  | 'SUM'
  | 'ABS_DIFFERENCE'
  | 'PRODUCT'
  | 'EXACT_DIVISION'
  | 'SUM_PLUS_CONSTANT'
  | 'PRODUCT_PLUS_CONSTANT'
  | 'PRODUCT_MINUS_CONSTANT'
  | 'DIFFERENCE_PLUS_CONSTANT';

export interface MisCp001RuleContext {
  readonly k?: number;
}

export interface MisCp001RuleDefinition {
  readonly candidateId: MisCp001CandidateId;
  readonly ruleId: MisCp001RuleId;
  readonly label: string;
  readonly difficulty: 'Easy' | 'Medium';
  readonly operationDepth: 1 | 2;
  readonly minInput: number;
  readonly maxInput: number;
  readonly contexts: readonly MisCp001RuleContext[];
  readonly errorLabels: readonly string[];
}

const NO_CONTEXT = Object.freeze([Object.freeze({})]);
const CONSTANT_CONTEXTS = Object.freeze(
  [2, 3, 4, 5, 6, 7, 8, 9].map((k) => Object.freeze({ k })),
);

export const MIS_CP001_RULES: readonly MisCp001RuleDefinition[] = Object.freeze([
  {
    candidateId: 'MIS-CAND-001',
    ruleId: 'SUM',
    label: 'add the two numbers',
    difficulty: 'Easy',
    operationDepth: 1,
    minInput: 2,
    maxInput: 25,
    contexts: NO_CONTEXT,
    errorLabels: ['MULTIPLY_INSTEAD_OF_ADD', 'SUBTRACTION_INSTEAD_OF_ADD', 'FIRST_INPUT_DOUBLED'],
  },
  {
    candidateId: 'MIS-CAND-002',
    ruleId: 'ABS_DIFFERENCE',
    label: 'take the positive difference of the two numbers',
    difficulty: 'Easy',
    operationDepth: 1,
    minInput: 2,
    maxInput: 30,
    contexts: NO_CONTEXT,
    errorLabels: ['ADD_INSTEAD_OF_DIFFERENCE', 'MULTIPLY_INSTEAD_OF_DIFFERENCE', 'SMALLER_INPUT_USED_DIRECTLY'],
  },
  {
    candidateId: 'MIS-CAND-003',
    ruleId: 'PRODUCT',
    label: 'multiply the two numbers',
    difficulty: 'Easy',
    operationDepth: 1,
    minInput: 2,
    maxInput: 18,
    contexts: NO_CONTEXT,
    errorLabels: ['ADD_INSTEAD_OF_MULTIPLY', 'SUBTRACTION_INSTEAD_OF_MULTIPLY', 'FIRST_INPUT_SQUARED'],
  },
  {
    candidateId: 'MIS-CAND-004',
    ruleId: 'EXACT_DIVISION',
    label: 'divide the first number by the second number',
    difficulty: 'Easy',
    operationDepth: 1,
    minInput: 2,
    maxInput: 30,
    contexts: NO_CONTEXT,
    errorLabels: ['MULTIPLY_INSTEAD_OF_DIVIDE', 'SUBTRACTION_INSTEAD_OF_DIVIDE', 'ADD_INSTEAD_OF_DIVIDE'],
  },
  {
    candidateId: 'MIS-CAND-005',
    ruleId: 'SUM_PLUS_CONSTANT',
    label: 'add the two numbers and then add the same constant',
    difficulty: 'Medium',
    operationDepth: 2,
    minInput: 2,
    maxInput: 25,
    contexts: CONSTANT_CONTEXTS,
    errorLabels: ['CONSTANT_OMITTED', 'CONSTANT_SIGN_REVERSED', 'MULTIPLY_INSTEAD_OF_ADD'],
  },
  {
    candidateId: 'MIS-CAND-006',
    ruleId: 'PRODUCT_PLUS_CONSTANT',
    label: 'multiply the two numbers and then add the same constant',
    difficulty: 'Medium',
    operationDepth: 2,
    minInput: 2,
    maxInput: 16,
    contexts: CONSTANT_CONTEXTS,
    errorLabels: ['CONSTANT_OMITTED', 'CONSTANT_SIGN_REVERSED', 'ADD_INSTEAD_OF_MULTIPLY'],
  },
  {
    candidateId: 'MIS-CAND-007',
    ruleId: 'PRODUCT_MINUS_CONSTANT',
    label: 'multiply the two numbers and then subtract the same constant',
    difficulty: 'Medium',
    operationDepth: 2,
    minInput: 3,
    maxInput: 18,
    contexts: CONSTANT_CONTEXTS,
    errorLabels: ['CONSTANT_OMITTED', 'CONSTANT_SIGN_REVERSED', 'ADD_INSTEAD_OF_MULTIPLY'],
  },
  {
    candidateId: 'MIS-CAND-008',
    ruleId: 'DIFFERENCE_PLUS_CONSTANT',
    label: 'take the positive difference and then add the same constant',
    difficulty: 'Medium',
    operationDepth: 2,
    minInput: 2,
    maxInput: 30,
    contexts: CONSTANT_CONTEXTS,
    errorLabels: ['CONSTANT_OMITTED', 'CONSTANT_SIGN_REVERSED', 'ADD_INSTEAD_OF_DIFFERENCE'],
  },
]);

export function misCp001RuleByCandidateId(candidateId: string): MisCp001RuleDefinition {
  const rule = MIS_CP001_RULES.find((entry) => entry.candidateId === candidateId);
  if (!rule) throw new Error(`Unknown MIS-CP-001 candidate: ${candidateId}`);
  return rule;
}

export function contextKey(context: MisCp001RuleContext): string {
  return context.k == null ? 'NONE' : `K=${context.k}`;
}
