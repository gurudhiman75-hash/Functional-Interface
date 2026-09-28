
export type MisCp015CandidateId = 'MIS-CAND-087' | 'MIS-CAND-088' | 'MIS-CAND-089';
export type MisCp015RuleId =
  | 'PAIR_PRODUCT_PLUS_FIRST'
  | 'THREE_INPUT_PRODUCT_PLUS_ONE'
  | 'THREE_INPUT_PRODUCT_MINUS_ONE';

export type MisCp015MissingPosition =
  | 'RESULT'
  | 'FIRST_INPUT'
  | 'SECOND_INPUT'
  | 'THIRD_INPUT';

export interface MisCp015RuleDefinition {
  readonly candidateId: MisCp015CandidateId;
  readonly ruleId: MisCp015RuleId;
  readonly label: string;
  readonly difficulty: 'Medium';
  readonly operationDepth: 2;
  readonly operandCount: 2 | 3;
  readonly supportedMissingPositions: readonly MisCp015MissingPosition[];
  readonly sourceBacked: true;
  readonly sourceNote: string;
}

export const MIS_CP015_RULES: readonly MisCp015RuleDefinition[] = Object.freeze([
  {
    candidateId: 'MIS-CAND-087',
    ruleId: 'PAIR_PRODUCT_PLUS_FIRST',
    label: 'multiply the two inputs, then add the first input once more',
    difficulty: 'Medium',
    operationDepth: 2,
    operandCount: 2,
    supportedMissingPositions: Object.freeze(['RESULT'] as const),
    sourceBacked: true,
    sourceNote:
      'SSC CHSL 2021 paper held 3 June 2022 Shift 3: 17,8,153; 19,6,133; 13,7,104 follows a×b+a.',
  },
  {
    candidateId: 'MIS-CAND-088',
    ruleId: 'THREE_INPUT_PRODUCT_PLUS_ONE',
    label: 'multiply all three inputs, then add 1',
    difficulty: 'Medium',
    operationDepth: 2,
    operandCount: 3,
    supportedMissingPositions: Object.freeze(['RESULT'] as const),
    sourceBacked: true,
    sourceNote:
      'SSC CHSL 2025 Tier-1, 22 Nov 2025 Shift 3: repeated rows use a×b×c+1.',
  },
  {
    candidateId: 'MIS-CAND-089',
    ruleId: 'THREE_INPUT_PRODUCT_MINUS_ONE',
    label: 'multiply all three inputs, then subtract 1',
    difficulty: 'Medium',
    operationDepth: 2,
    operandCount: 3,
    supportedMissingPositions: Object.freeze(
      ['RESULT', 'FIRST_INPUT', 'SECOND_INPUT', 'THIRD_INPUT'] as const,
    ),
    sourceBacked: true,
    sourceNote:
      'SSC CHSL 2025 Tier-1, 27 Nov 2025 Shift 3: column groups use a×b×c−1 with an input missing.',
  },
]);

export function misCp015RuleByCandidateId(id: string): MisCp015RuleDefinition {
  const rule = MIS_CP015_RULES.find((entry) => entry.candidateId === id);
  if (!rule) throw new Error('Unknown MIS-CP-015 candidate: ' + id);
  return rule;
}
