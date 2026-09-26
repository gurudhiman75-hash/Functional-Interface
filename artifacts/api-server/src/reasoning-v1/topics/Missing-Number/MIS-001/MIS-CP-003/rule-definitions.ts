export type MisCp003CandidateId =
  | 'MIS-CAND-016'
  | 'MIS-CAND-017'
  | 'MIS-CAND-018'
  | 'MIS-CAND-019'
  | 'MIS-CAND-020'
  | 'MIS-CAND-021'
  | 'MIS-CAND-022'
  | 'MIS-CAND-023'
  | 'MIS-CAND-024'
  | 'MIS-CAND-025';

export type MisCp003RuleId =
  | 'SQUARE_INPUT'
  | 'SQUARE_FIRST_PLUS_SECOND'
  | 'SQUARE_FIRST_MINUS_SECOND'
  | 'SUM_OF_SQUARES'
  | 'DIFFERENCE_OF_SQUARES'
  | 'PRODUCT_PLUS_FIRST_SQUARE'
  | 'PRODUCT_PLUS_SECOND_SQUARE'
  | 'CUBE_INPUT'
  | 'PAIR_SUM_OR_DIFFERENCE_SQUARE'
  | 'PAIR_SUM_OR_DIFFERENCE_CUBE';

export interface MisCp003RuleContext {
  readonly sign?: 1 | -1;
}

export interface MisCp003RuleDefinition {
  readonly candidateId: MisCp003CandidateId;
  readonly ruleId: MisCp003RuleId;
  readonly label: string;
  readonly baselineDifficulty: 'Easy' | 'Medium';
  readonly operationDepth: 1 | 2;
  readonly operandCount: 1 | 2;
  readonly minInput: number;
  readonly maxInput: number;
  readonly contexts: readonly MisCp003RuleContext[];
}

const NONE = Object.freeze([Object.freeze({})]);
const PLUS_MINUS = Object.freeze([
  Object.freeze({ sign: 1 as const }),
  Object.freeze({ sign: -1 as const }),
]);

export const MIS_CP003_RULES: readonly MisCp003RuleDefinition[] = Object.freeze([
  { candidateId: 'MIS-CAND-016', ruleId: 'SQUARE_INPUT', label: 'square a number', baselineDifficulty: 'Easy', operationDepth: 1, operandCount: 1, minInput: 2, maxInput: 25, contexts: NONE },
  { candidateId: 'MIS-CAND-017', ruleId: 'SQUARE_FIRST_PLUS_SECOND', label: 'square the first number, then add the second', baselineDifficulty: 'Medium', operationDepth: 2, operandCount: 2, minInput: 2, maxInput: 18, contexts: NONE },
  { candidateId: 'MIS-CAND-018', ruleId: 'SQUARE_FIRST_MINUS_SECOND', label: 'square the first number, then subtract the second', baselineDifficulty: 'Medium', operationDepth: 2, operandCount: 2, minInput: 2, maxInput: 18, contexts: NONE },
  { candidateId: 'MIS-CAND-019', ruleId: 'SUM_OF_SQUARES', label: 'add the squares of both numbers', baselineDifficulty: 'Medium', operationDepth: 2, operandCount: 2, minInput: 2, maxInput: 18, contexts: NONE },
  { candidateId: 'MIS-CAND-020', ruleId: 'DIFFERENCE_OF_SQUARES', label: 'subtract the second square from the first square', baselineDifficulty: 'Medium', operationDepth: 2, operandCount: 2, minInput: 3, maxInput: 20, contexts: NONE },
  { candidateId: 'MIS-CAND-021', ruleId: 'PRODUCT_PLUS_FIRST_SQUARE', label: 'multiply the numbers, then add the square of the first', baselineDifficulty: 'Medium', operationDepth: 2, operandCount: 2, minInput: 2, maxInput: 15, contexts: NONE },
  { candidateId: 'MIS-CAND-022', ruleId: 'PRODUCT_PLUS_SECOND_SQUARE', label: 'multiply the numbers, then add the square of the second', baselineDifficulty: 'Medium', operationDepth: 2, operandCount: 2, minInput: 2, maxInput: 15, contexts: NONE },
  { candidateId: 'MIS-CAND-023', ruleId: 'CUBE_INPUT', label: 'cube a number', baselineDifficulty: 'Easy', operationDepth: 1, operandCount: 1, minInput: 2, maxInput: 9, contexts: NONE },
  { candidateId: 'MIS-CAND-024', ruleId: 'PAIR_SUM_OR_DIFFERENCE_SQUARE', label: 'square a small sum or positive difference', baselineDifficulty: 'Medium', operationDepth: 2, operandCount: 2, minInput: 2, maxInput: 12, contexts: PLUS_MINUS },
  { candidateId: 'MIS-CAND-025', ruleId: 'PAIR_SUM_OR_DIFFERENCE_CUBE', label: 'cube a small sum or positive difference', baselineDifficulty: 'Medium', operationDepth: 2, operandCount: 2, minInput: 2, maxInput: 14, contexts: PLUS_MINUS },
]);

export function misCp003RuleByCandidateId(candidateId: string): MisCp003RuleDefinition {
  const rule = MIS_CP003_RULES.find((entry) => entry.candidateId === candidateId);
  if (!rule) throw new Error(`Unknown MIS-CP-003 candidate: ${candidateId}`);
  return rule;
}

export function misCp003ContextKey(context: MisCp003RuleContext): string {
  return context.sign == null ? 'NONE' : `S=${context.sign}`;
}
