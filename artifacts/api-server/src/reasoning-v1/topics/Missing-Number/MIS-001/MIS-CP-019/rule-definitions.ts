
export type MisCp019CandidateId =
  | 'MIS-CAND-096'
  | 'MIS-CAND-097'
  | 'MIS-CAND-098'
  | 'MIS-CAND-099'
  | 'MIS-CAND-100';

export type MisCp019RuleId =
  | 'INCREMENT_FIRST_TIMES_HALF_INCREMENTED_SECOND'
  | 'FIRST_MINUS_CONSTANT_TIMES_SECOND'
  | 'FIRST_CUBE_MINUS_SECOND_SQUARE'
  | 'PAIR_SUM_TIMES_CONSTANT_PLUS_SECOND'
  | 'FOUR_INPUT_SUM_TIMES_CONSTANT';

export interface MisCp019RuleContext {
  readonly k?: number;
}

export interface MisCp019RuleDefinition {
  readonly candidateId: MisCp019CandidateId;
  readonly ruleId: MisCp019RuleId;
  readonly label: string;
  readonly difficulty: 'Medium' | 'Hard';
  readonly operationDepth: 2 | 3;
  readonly operandCount: 2 | 4;
  readonly contexts: readonly MisCp019RuleContext[];
  readonly sourceBacked: true;
  readonly sourceNote: string;
}

export const MIS_CP019_RULES: readonly MisCp019RuleDefinition[] = Object.freeze([
  {
    candidateId: 'MIS-CAND-096',
    ruleId: 'INCREMENT_FIRST_TIMES_HALF_INCREMENTED_SECOND',
    label: 'increase both inputs by 1, halve the second adjusted input, then multiply',
    difficulty: 'Hard',
    operationDepth: 3,
    operandCount: 2,
    contexts: Object.freeze([Object.freeze({})]),
    sourceBacked: true,
    sourceNote:
      'SSC CGL 2021 Tier-I, 19 Apr 2022 Shift 3: 14,21→165; 10,17→99; 13,19→140 follows (a+1)×((b+1)÷2).',
  },
  {
    candidateId: 'MIS-CAND-097',
    ruleId: 'FIRST_MINUS_CONSTANT_TIMES_SECOND',
    label: 'subtract the evidenced constant from the first input, then multiply by the second',
    difficulty: 'Medium',
    operationDepth: 2,
    operandCount: 2,
    contexts: Object.freeze([Object.freeze({ k: 2 })]),
    sourceBacked: true,
    sourceNote:
      'SSC CGL 2021 Tier-I, 20 Apr 2022 Shift 3: 12,7→70; 15,6→78; 11,9→81 follows (a−2)×b.',
  },
  {
    candidateId: 'MIS-CAND-098',
    ruleId: 'FIRST_CUBE_MINUS_SECOND_SQUARE',
    label: 'cube the first input and subtract the square of the second',
    difficulty: 'Hard',
    operationDepth: 3,
    operandCount: 2,
    contexts: Object.freeze([Object.freeze({})]),
    sourceBacked: true,
    sourceNote:
      'SSC CGL 2021 Tier-I, 11 Apr 2022 Shift 2: 7,13→174; 9,25→104; 11,30→431 follows a³−b².',
  },
  {
    candidateId: 'MIS-CAND-099',
    ruleId: 'PAIR_SUM_TIMES_CONSTANT_PLUS_SECOND',
    label: 'add the pair, multiply the sum by the evidenced constant, then add the second input',
    difficulty: 'Hard',
    operationDepth: 3,
    operandCount: 2,
    contexts: Object.freeze([Object.freeze({ k: 5 })]),
    sourceBacked: true,
    sourceNote:
      'SSC CGL 2021 Tier-I, 20 Apr 2022 Shift 2: 8,6→76; 7,13→113; 12,10→120 follows (a+b)×5+b.',
  },
  {
    candidateId: 'MIS-CAND-100',
    ruleId: 'FOUR_INPUT_SUM_TIMES_CONSTANT',
    label: 'add all four inputs, then multiply the sum by the evidenced constant',
    difficulty: 'Medium',
    operationDepth: 2,
    operandCount: 4,
    contexts: Object.freeze([Object.freeze({ k: 2 })]),
    sourceBacked: true,
    sourceNote:
      'SSC CGL 2025 Tier-II Paper 1, 19 Jan 2026: rows 5,2,3,10→40; 4,3,5,8→40; 6,4,2,12→48 follow 2×(a+b+c+d).',
  },
]);

export function misCp019RuleByCandidateId(id: string): MisCp019RuleDefinition {
  const rule = MIS_CP019_RULES.find((entry) => entry.candidateId === id);
  if (!rule) throw new Error('Unknown MIS-CP-019 candidate: ' + id);
  return rule;
}
