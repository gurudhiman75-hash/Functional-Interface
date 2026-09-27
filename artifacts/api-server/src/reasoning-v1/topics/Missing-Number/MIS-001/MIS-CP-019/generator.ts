
import {
  MIS_CP019_RULES,
  misCp019RuleByCandidateId,
  type MisCp019CandidateId,
  type MisCp019RuleContext,
  type MisCp019RuleId,
} from './rule-definitions';
import {
  independentlyEvaluateMisCp019Rule,
  type MisCp019Group,
} from './independent-solver';

export interface MisCp019Option {
  readonly value: number;
  readonly errorLabel: string | null;
}

export interface GeneratedMisCp019Question {
  readonly packageId: 'MIS-001';
  readonly checkpointId: 'MIS-CP-019';
  readonly candidateId: MisCp019CandidateId;
  readonly provisionalQl: true;
  readonly ruleId: MisCp019RuleId;
  readonly ruleFamily: string;
  readonly context: MisCp019RuleContext;
  readonly difficulty: 'Medium' | 'Hard';
  readonly renderer: 'TABLE_GROUP';
  readonly stem: string;
  readonly evidenceGroups: readonly MisCp019Group[];
  readonly target: MisCp019Group;
  readonly options: readonly MisCp019Option[];
  readonly correctIndex: number;
  readonly answer: number;
  readonly explanation: string;
  readonly solverTrace: readonly string[];
  readonly ambiguityAudit: {
    readonly accepted: boolean;
    readonly survivingRules: readonly string[];
    readonly reason: string;
  };
  readonly structuralFingerprint: string;
  readonly numericFingerprint: string;
  readonly operationDepth: 2 | 3;
  readonly operandCount: 2 | 4;
  readonly groupCount: 3;
  readonly missingPosition: 'RESULT';
  readonly forwardOrInverse: 'FORWARD';
  readonly sourceBacked: true;
  readonly sourceNote: string;
  readonly semanticAuthorityCandidateId: string;
  readonly createsNewSemanticAuthority: boolean;
  readonly wholeNumberOrDigitMode: 'WHOLE_NUMBER';
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function rng(seed: string) {
  let state = hash(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(values: readonly T[], seed: string): T[] {
  const out = [...values];
  const random = rng(seed);
  for (let index = out.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [out[index], out[swap]] = [out[swap]!, out[index]!];
  }
  return out;
}

type NearbyRule =
  | MisCp019RuleId
  | 'SUM_TWO'
  | 'PRODUCT_TWO'
  | 'ABS_DIFFERENCE'
  | 'PRODUCT_PLUS_FIRST'
  | 'PRODUCT_PLUS_SECOND'
  | 'SUM_FOUR'
  | 'PAIR_PRODUCT_DIFFERENCE';

const NEARBY_RULES: readonly NearbyRule[] = [
  'INCREMENT_FIRST_TIMES_HALF_INCREMENTED_SECOND',
  'FIRST_MINUS_CONSTANT_TIMES_SECOND',
  'FIRST_CUBE_MINUS_SECOND_SQUARE',
  'PAIR_SUM_TIMES_CONSTANT_PLUS_SECOND',
  'FOUR_INPUT_SUM_TIMES_CONSTANT',
  'SUM_TWO',
  'PRODUCT_TWO',
  'ABS_DIFFERENCE',
  'PRODUCT_PLUS_FIRST',
  'PRODUCT_PLUS_SECOND',
  'SUM_FOUR',
  'PAIR_PRODUCT_DIFFERENCE',
];

function evaluateNearby(
  rule: NearbyRule,
  inputs: readonly number[],
  context: MisCp019RuleContext,
): number | null {
  if (NEARBY_RULES.slice(0, 5).includes(rule)) {
    return independentlyEvaluateMisCp019Rule(rule as MisCp019RuleId, inputs, context);
  }
  if (inputs.length === 2) {
    const [a, b] = inputs;
    if (rule === 'SUM_TWO') return a! + b!;
    if (rule === 'PRODUCT_TWO') return a! * b!;
    if (rule === 'ABS_DIFFERENCE') return Math.abs(a! - b!);
    if (rule === 'PRODUCT_PLUS_FIRST') return a! * b! + a!;
    if (rule === 'PRODUCT_PLUS_SECOND') return a! * b! + b!;
    return null;
  }
  if (inputs.length === 4) {
    const [a, b, c, d] = inputs;
    if (rule === 'SUM_FOUR') return a! + b! + c! + d!;
    if (rule === 'PAIR_PRODUCT_DIFFERENCE') return Math.abs(a! * b! - c! * d!);
  }
  return null;
}

function ambiguityAudit(
  ruleId: MisCp019RuleId,
  evidence: readonly MisCp019Group[],
  context: MisCp019RuleContext,
) {
  const survivors = NEARBY_RULES.filter((rule) =>
    evidence.every((group) => evaluateNearby(rule, group.inputs, context) === group.result),
  );
  return survivors.length === 1 && survivors[0] === ruleId
    ? {
        accepted: true,
        survivingRules: survivors,
        reason: 'Exactly one nearby semantic rule survives all evidence groups.',
      }
    : {
        accepted: false,
        survivingRules: survivors,
        reason: 'Competing nearby rules survive: ' + survivors.join(', '),
      };
}

function generateGroups(
  ruleId: MisCp019RuleId,
  context: MisCp019RuleContext,
): MisCp019Group[] {
  const out: MisCp019Group[] = [];

  if (ruleId === 'FOUR_INPUT_SUM_TIMES_CONSTANT') {
    for (let a = 2; a <= 12; a += 1) {
      for (let b = 2; b <= 12; b += 1) {
        for (let c = 2; c <= 12; c += 1) {
          for (let d = 2; d <= 14; d += 1) {
            const inputs = [a, b, c, d] as const;
            const result = independentlyEvaluateMisCp019Rule(ruleId, inputs, context);
            if (result != null && !inputs.includes(result)) out.push({ inputs, result });
          }
        }
      }
    }
    return out;
  }

  if (ruleId === 'INCREMENT_FIRST_TIMES_HALF_INCREMENTED_SECOND') {
    for (let a = 5; a <= 30; a += 1) {
      for (let b = 5; b <= 31; b += 2) {
        const inputs = [a, b] as const;
        const result = independentlyEvaluateMisCp019Rule(ruleId, inputs, context);
        if (result != null && result <= 999 && result !== a && result !== b) {
          out.push({ inputs, result });
        }
      }
    }
    return out;
  }

  if (ruleId === 'FIRST_CUBE_MINUS_SECOND_SQUARE') {
    for (let a = 4; a <= 12; a += 1) {
      for (let b = 3; b <= 30; b += 1) {
        const inputs = [a, b] as const;
        const result = independentlyEvaluateMisCp019Rule(ruleId, inputs, context);
        if (result != null && result !== a && result !== b) out.push({ inputs, result });
      }
    }
    return out;
  }

  for (let a = 5; a <= 35; a += 1) {
    for (let b = 3; b <= 18; b += 1) {
      const inputs = [a, b] as const;
      const result = independentlyEvaluateMisCp019Rule(ruleId, inputs, context);
      if (result != null && result !== a && result !== b) out.push({ inputs, result });
    }
  }
  return out;
}

function distractors(
  ruleId: MisCp019RuleId,
  group: MisCp019Group,
  context: MisCp019RuleContext,
): MisCp019Option[] {
  const out: MisCp019Option[] = [];
  const add = (value: number | null, label: string) => {
    if (
      value != null &&
      Number.isInteger(value) &&
      value > 0 &&
      value <= 999 &&
      value !== group.result &&
      !out.some((option) => option.value === value)
    ) {
      out.push({ value, errorLabel: label });
    }
  };

  if (group.inputs.length === 4) {
    const [a, b, c, d] = group.inputs;
    const sum = a! + b! + c! + d!;
    add(sum, 'FINAL_MULTIPLIER_OMITTED');
    add(sum * ((context.k ?? 2) + 1), 'WRONG_FINAL_MULTIPLIER');
    add(a! * b! + c! * d!, 'USED_PAIR_PRODUCTS_SUM');
    add(Math.abs(a! * b! - c! * d!), 'USED_PAIR_PRODUCTS_DIFFERENCE');
    add(a! + b! + c!, 'FOURTH_INPUT_OMITTED');
    return out;
  }

  const [a, b] = group.inputs;
  add(a! + b!, 'ADDED_VISIBLE_INPUTS');
  add(a! * b!, 'MULTIPLIED_VISIBLE_INPUTS');
  add(Math.abs(a! - b!), 'USED_DIFFERENCE_ONLY');
  add(a! * b! + a!, 'USED_PRODUCT_PLUS_FIRST');
  add(a! * b! + b!, 'USED_PRODUCT_PLUS_SECOND');

  if (ruleId === 'INCREMENT_FIRST_TIMES_HALF_INCREMENTED_SECOND') {
    add((a! + 1) * (b! + 1), 'HALVING_STEP_OMITTED');
    add(a! * ((b! + 1) / 2), 'FIRST_INCREMENT_OMITTED');
    add((a! + 1) * ((b! - 1) / 2), 'SECOND_ADJUSTMENT_REVERSED');
  }
  if (ruleId === 'FIRST_MINUS_CONSTANT_TIMES_SECOND') {
    const k = context.k ?? 2;
    add((a! + k) * b!, 'CONSTANT_SIGN_REVERSED');
    add(a! * b! - k, 'CONSTANT_SUBTRACTED_AFTER_PRODUCT');
    add((a! - 1) * b!, 'WRONG_PREMULTIPLICATION_CONSTANT');
  }
  if (ruleId === 'FIRST_CUBE_MINUS_SECOND_SQUARE') {
    add(a! ** 2 - b! ** 2, 'SQUARED_FIRST_INSTEAD_OF_CUBED');
    add(a! ** 3 - b!, 'SECOND_NOT_SQUARED');
    add(a! ** 3 + b! ** 2, 'WRONG_FINAL_SIGN');
  }
  if (ruleId === 'PAIR_SUM_TIMES_CONSTANT_PLUS_SECOND') {
    const k = context.k ?? 5;
    add((a! + b!) * k, 'FINAL_SECOND_ADDEND_OMITTED');
    add((a! + b!) * (k - 1) + b!, 'WRONG_MULTIPLIER');
    add((a! + b!) * k + a!, 'ADDED_FIRST_INSTEAD_OF_SECOND');
  }
  return out;
}

function selectScenario(
  ruleId: MisCp019RuleId,
  context: MisCp019RuleContext,
  seed: string,
) {
  const groups = shuffle(generateGroups(ruleId, context), seed + ':groups');
  for (let first = 0; first < Math.min(groups.length, 100); first += 1) {
    for (let second = first + 1; second < Math.min(groups.length, 260); second += 1) {
      const evidence = [groups[first]!, groups[second]!];
      if (evidence[0]!.result === evidence[1]!.result) continue;
      const audit = ambiguityAudit(ruleId, evidence, context);
      if (!audit.accepted) continue;
      const target = groups.find(
        (group, index) =>
          index !== first &&
          index !== second &&
          group.result !== evidence[0]!.result &&
          group.result !== evidence[1]!.result &&
          distractors(ruleId, group, context).length >= 3,
      );
      if (target) return { evidence, target, audit };
    }
  }
  throw new Error('Unable to construct MIS-CP-019 scenario for ' + ruleId);
}

function ruleText(ruleId: MisCp019RuleId, context: MisCp019RuleContext): string {
  if (ruleId === 'INCREMENT_FIRST_TIMES_HALF_INCREMENTED_SECOND') {
    return 'Add 1 to both numbers. Divide the adjusted second number by 2, then multiply.';
  }
  if (ruleId === 'FIRST_MINUS_CONSTANT_TIMES_SECOND') {
    return 'Subtract ' + String(context.k) + ' from the first number, then multiply by the second number.';
  }
  if (ruleId === 'FIRST_CUBE_MINUS_SECOND_SQUARE') {
    return 'Cube the first number and subtract the square of the second number.';
  }
  if (ruleId === 'PAIR_SUM_TIMES_CONSTANT_PLUS_SECOND') {
    return 'Add the two numbers, multiply the sum by ' + String(context.k) + ', then add the second number.';
  }
  return 'Add all four numbers, then multiply the sum by ' + String(context.k) + '.';
}

function calculation(
  ruleId: MisCp019RuleId,
  group: MisCp019Group,
  context: MisCp019RuleContext,
): string {
  const values = group.inputs;
  if (ruleId === 'INCREMENT_FIRST_TIMES_HALF_INCREMENTED_SECOND') {
    const [a, b] = values;
    return (
      '(' + a + ' + 1) = ' + (a! + 1) + '; (' + b + ' + 1) ÷ 2 = ' +
      ((b! + 1) / 2) + '; ' + (a! + 1) + ' × ' + ((b! + 1) / 2) +
      ' = ' + group.result
    );
  }
  if (ruleId === 'FIRST_MINUS_CONSTANT_TIMES_SECOND') {
    const [a, b] = values;
    return (
      a + ' − ' + context.k + ' = ' + (a! - (context.k ?? 0)) +
      '; ' + (a! - (context.k ?? 0)) + ' × ' + b + ' = ' + group.result
    );
  }
  if (ruleId === 'FIRST_CUBE_MINUS_SECOND_SQUARE') {
    const [a, b] = values;
    return (
      a + '³ = ' + a! ** 3 + '; ' + b + '² = ' + b! ** 2 +
      '; ' + a! ** 3 + ' − ' + b! ** 2 + ' = ' + group.result
    );
  }
  if (ruleId === 'PAIR_SUM_TIMES_CONSTANT_PLUS_SECOND') {
    const [a, b] = values;
    const sum = a! + b!;
    return (
      a + ' + ' + b + ' = ' + sum + '; ' + sum + ' × ' + context.k +
      ' = ' + sum * (context.k ?? 0) + '; ' +
      sum * (context.k ?? 0) + ' + ' + b + ' = ' + group.result
    );
  }
  const sum = values.reduce((total, value) => total + value, 0);
  return (
    values.join(' + ') + ' = ' + sum + '; ' + sum + ' × ' +
    context.k + ' = ' + group.result
  );
}

function row(group: MisCp019Group, hideResult = false): string {
  return [...group.inputs.map(String), hideResult ? '?' : String(group.result)].join('   ');
}

export function generateMisCp019Question(
  candidateId: MisCp019CandidateId,
  seed: string | number = 'mis-cp019-v1',
): GeneratedMisCp019Question {
  const rule = misCp019RuleByCandidateId(candidateId);
  const context = rule.contexts[0]!;
  const baseSeed = String(seed);
  const selected = selectScenario(rule.ruleId, context, baseSeed);
  const wrong = shuffle(
    distractors(rule.ruleId, selected.target, context),
    baseSeed + ':options',
  ).slice(0, 3);
  if (wrong.length !== 3) throw new Error('MIS-CP-019 distractor shortage.');

  const correctIndex = hash(baseSeed + ':' + candidateId) % 4;
  const options = [...wrong];
  options.splice(correctIndex, 0, { value: selected.target.result, errorLabel: null });

  const stem = [
    'Study the pattern and find the number that will replace the question mark (?).',
    '',
    ...selected.evidence.map((group) => row(group)),
    row(selected.target, true),
  ].join('\n');

  const explanation = [
    'The same rule is used in every row.',
    ruleText(rule.ruleId, context),
    '',
    'Row 1:',
    calculation(rule.ruleId, selected.evidence[0]!, context),
    '',
    'Row 2:',
    calculation(rule.ruleId, selected.evidence[1]!, context),
    '',
    'Now apply the same rule:',
    calculation(rule.ruleId, selected.target, context),
    '',
    'So, ? = ' + String(selected.target.result) + '.',
  ].join('\n');

  return {
    packageId: 'MIS-001',
    checkpointId: 'MIS-CP-019',
    candidateId,
    provisionalQl: true,
    ruleId: rule.ruleId,
    ruleFamily: rule.label,
    context,
    difficulty: rule.difficulty,
    renderer: 'TABLE_GROUP',
    stem,
    evidenceGroups: selected.evidence,
    target: selected.target,
    options,
    correctIndex,
    answer: selected.target.result,
    explanation,
    solverTrace: [
      ...selected.evidence.map((group) => calculation(rule.ruleId, group, context)),
      calculation(rule.ruleId, selected.target, context),
    ],
    ambiguityAudit: selected.audit,
    structuralFingerprint: [
      'MIS-CP-019',
      rule.ruleId,
      context.k != null ? 'K=' + context.k : '',
      'SOURCE_BACKED',
    ].filter(Boolean).join('|'),
    numericFingerprint: [...selected.evidence, selected.target]
      .map((group) => group.inputs.join(',') + ':' + group.result)
      .join('|'),
    operationDepth: rule.operationDepth,
    operandCount: rule.operandCount,
    groupCount: 3,
    missingPosition: 'RESULT',
    forwardOrInverse: 'FORWARD',
    sourceBacked: true,
    sourceNote: rule.sourceNote,
    semanticAuthorityCandidateId: candidateId === 'MIS-CAND-097' ? 'MIS-CAND-059' : candidateId,
    createsNewSemanticAuthority: candidateId !== 'MIS-CAND-097',
    wholeNumberOrDigitMode: 'WHOLE_NUMBER',
  };
}

export const MIS_CP019_CANDIDATE_IDS = Object.freeze(
  MIS_CP019_RULES.map((rule) => rule.candidateId),
);
