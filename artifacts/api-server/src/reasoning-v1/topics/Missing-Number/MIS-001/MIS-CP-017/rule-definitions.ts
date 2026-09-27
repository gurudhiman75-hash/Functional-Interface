
export type MisCp017CandidateId = 'MIS-CAND-091';

export interface MisCp017RuleDefinition {
  readonly candidateId: MisCp017CandidateId;
  readonly ruleId: 'SECOND_MINUS_HALF_FIRST_PLUS_FIRST_DIGIT_PRODUCT';
  readonly label: string;
  readonly difficulty: 'Hard';
  readonly operationDepth: 3;
  readonly operandCount: 2;
  readonly sourceBacked: true;
  readonly sourceNote: string;
}

export const MIS_CP017_RULES: readonly MisCp017RuleDefinition[] = Object.freeze([{
  candidateId: 'MIS-CAND-091',
  ruleId: 'SECOND_MINUS_HALF_FIRST_PLUS_FIRST_DIGIT_PRODUCT',
  label: 'subtract half the first number from the second, then add the product of the first number’s digits',
  difficulty: 'Hard',
  operationDepth: 3,
  operandCount: 2,
  sourceBacked: true,
  sourceNote:
    'SSC CGL 2020 Tier-I Official Paper 4, held 16 Aug 2021 Shift 1: each repeated row follows b − (a÷2) + digitProduct(a).',
}]);

export function misCp017RuleByCandidateId(id: string): MisCp017RuleDefinition {
  const rule = MIS_CP017_RULES.find((entry) => entry.candidateId === id);
  if (!rule) throw new Error('Unknown MIS-CP-017 candidate: ' + id);
  return rule;
}
