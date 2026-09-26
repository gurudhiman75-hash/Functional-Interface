export type MisCp004CandidateId =
  | 'MIS-CAND-026'
  | 'MIS-CAND-027'
  | 'MIS-CAND-028'
  | 'MIS-CAND-029'
  | 'MIS-CAND-030'
  | 'MIS-CAND-031'
  | 'MIS-CAND-032'
  | 'MIS-CAND-033'
  | 'MIS-CAND-034';

export type MisCp004RuleId =
  | 'N_TIMES_NEXT'
  | 'N_TIMES_PREVIOUS'
  | 'A_TIMES_SUM'
  | 'B_TIMES_SUM'
  | 'A_TIMES_DIFFERENCE'
  | 'THREE_CONSECUTIVE_PRODUCT'
  | 'THREE_CONSECUTIVE_SUM'
  | 'TRIANGULAR_NUMBER'
  | 'SMALL_FACTORIAL';

export interface MisCp004RuleDefinition {
  readonly candidateId: MisCp004CandidateId;
  readonly ruleId: MisCp004RuleId;
  readonly label: string;
  readonly baselineDifficulty: 'Easy' | 'Medium';
  readonly operationDepth: 1 | 2;
  readonly operandCount: 1 | 2;
  readonly minInput: number;
  readonly maxInput: number;
  readonly sourceThin?: boolean;
}

export const MIS_CP004_RULES: readonly MisCp004RuleDefinition[] = Object.freeze([
  {
    candidateId: 'MIS-CAND-026',
    ruleId: 'N_TIMES_NEXT',
    label: 'multiply a number by the next consecutive number',
    baselineDifficulty: 'Easy',
    operationDepth: 1,
    operandCount: 1,
    minInput: 3,
    maxInput: 30,
  },
  {
    candidateId: 'MIS-CAND-027',
    ruleId: 'N_TIMES_PREVIOUS',
    label: 'multiply a number by the previous consecutive number',
    baselineDifficulty: 'Easy',
    operationDepth: 1,
    operandCount: 1,
    minInput: 3,
    maxInput: 31,
  },
  {
    candidateId: 'MIS-CAND-028',
    ruleId: 'A_TIMES_SUM',
    label: 'multiply the first number by the sum of both numbers',
    baselineDifficulty: 'Medium',
    operationDepth: 2,
    operandCount: 2,
    minInput: 2,
    maxInput: 18,
  },
  {
    candidateId: 'MIS-CAND-029',
    ruleId: 'B_TIMES_SUM',
    label: 'multiply the second number by the sum of both numbers',
    baselineDifficulty: 'Medium',
    operationDepth: 2,
    operandCount: 2,
    minInput: 2,
    maxInput: 18,
  },
  {
    candidateId: 'MIS-CAND-030',
    ruleId: 'A_TIMES_DIFFERENCE',
    label: 'multiply the first number by the positive difference',
    baselineDifficulty: 'Medium',
    operationDepth: 2,
    operandCount: 2,
    minInput: 3,
    maxInput: 22,
  },
  {
    candidateId: 'MIS-CAND-031',
    ruleId: 'THREE_CONSECUTIVE_PRODUCT',
    label: 'multiply three consecutive numbers',
    baselineDifficulty: 'Medium',
    operationDepth: 2,
    operandCount: 1,
    minInput: 2,
    maxInput: 9,
  },
  {
    candidateId: 'MIS-CAND-032',
    ruleId: 'THREE_CONSECUTIVE_SUM',
    label: 'add three consecutive numbers',
    baselineDifficulty: 'Easy',
    operationDepth: 1,
    operandCount: 1,
    minInput: 2,
    maxInput: 40,
  },
  {
    candidateId: 'MIS-CAND-033',
    ruleId: 'TRIANGULAR_NUMBER',
    label: 'form the triangular number n(n+1)/2',
    baselineDifficulty: 'Medium',
    operationDepth: 2,
    operandCount: 1,
    minInput: 3,
    maxInput: 40,
  },
  {
    candidateId: 'MIS-CAND-034',
    ruleId: 'SMALL_FACTORIAL',
    label: 'take the factorial of a small number',
    baselineDifficulty: 'Medium',
    operationDepth: 2,
    operandCount: 1,
    minInput: 3,
    maxInput: 6,
    sourceThin: true,
  },
]);

export function misCp004RuleByCandidateId(candidateId: string): MisCp004RuleDefinition {
  const rule = MIS_CP004_RULES.find((entry) => entry.candidateId === candidateId);
  if (!rule) throw new Error(`Unknown MIS-CP-004 candidate: ${candidateId}`);
  return rule;
}
