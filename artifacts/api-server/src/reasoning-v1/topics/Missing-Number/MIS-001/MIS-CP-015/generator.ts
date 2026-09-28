
import {
  MIS_CP015_RULES,
  misCp015RuleByCandidateId,
  type MisCp015CandidateId,
  type MisCp015MissingPosition,
  type MisCp015RuleId,
} from './rule-definitions';
import {
  independentlyEvaluateMisCp015Rule,
  independentlySolveMisCp015Missing,
  type MisCp015Group,
} from './independent-solver';

export interface MisCp015Option {
  readonly value: number;
  readonly errorLabel: string | null;
}

export interface MisCp015AmbiguityAudit {
  readonly accepted: boolean;
  readonly survivingRules: readonly string[];
  readonly reason: string;
}

export interface GeneratedMisCp015Question {
  readonly packageId: 'MIS-001';
  readonly checkpointId: 'MIS-CP-015';
  readonly candidateId: MisCp015CandidateId;
  readonly provisionalQl: true;
  readonly ruleId: MisCp015RuleId;
  readonly ruleFamily: string;
  readonly context: null;
  readonly difficulty: 'Medium';
  readonly renderer: 'TABLE_GROUP';
  readonly stem: string;
  readonly evidenceGroups: readonly MisCp015Group[];
  readonly target: MisCp015Group;
  readonly options: readonly MisCp015Option[];
  readonly correctIndex: number;
  readonly answer: number;
  readonly explanation: string;
  readonly solverTrace: readonly string[];
  readonly ambiguityAudit: MisCp015AmbiguityAudit;
  readonly structuralFingerprint: string;
  readonly numericFingerprint: string;
  readonly operationDepth: 2;
  readonly operandCount: 2 | 3;
  readonly groupCount: 3;
  readonly missingPosition: MisCp015MissingPosition;
  readonly forwardOrInverse: 'FORWARD' | 'INVERSE';
  readonly sourceBacked: true;
  readonly sourceNote: string;
  readonly semanticAuthorityCandidateId: MisCp015CandidateId;
  readonly createsNewSemanticAuthority: true;
}

function hash(value: string): number {
  let h = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
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

function generateGroups(ruleId: MisCp015RuleId): MisCp015Group[] {
  const groups: MisCp015Group[] = [];
  if (ruleId === 'PAIR_PRODUCT_PLUS_FIRST') {
    for (let a = 3; a <= 25; a += 1) {
      for (let b = 2; b <= 12; b += 1) {
        if (a === b) continue;
        const result = independentlyEvaluateMisCp015Rule(ruleId, [a, b]);
        if (result != null && result <= 999) groups.push({ inputs: [a, b], result });
      }
    }
    return groups;
  }

  for (let a = 2; a <= 9; a += 1) {
    for (let b = 2; b <= 9; b += 1) {
      for (let c = 2; c <= 9; c += 1) {
        const result = independentlyEvaluateMisCp015Rule(ruleId, [a, b, c]);
        if (result != null && result > 0 && result <= 999) {
          groups.push({ inputs: [a, b, c], result });
        }
      }
    }
  }
  return groups;
}

type NearbyRule =
  | 'SUM_TWO'
  | 'PRODUCT_TWO'
  | 'PRODUCT_PLUS_FIRST'
  | 'PRODUCT_PLUS_SECOND'
  | 'SUM_THREE'
  | 'PAIR_PRODUCT_PLUS_THIRD'
  | 'THREE_PRODUCT'
  | 'THREE_PRODUCT_PLUS_ONE'
  | 'THREE_PRODUCT_MINUS_ONE';

const NEARBY_RULES: readonly NearbyRule[] = [
  'SUM_TWO',
  'PRODUCT_TWO',
  'PRODUCT_PLUS_FIRST',
  'PRODUCT_PLUS_SECOND',
  'SUM_THREE',
  'PAIR_PRODUCT_PLUS_THIRD',
  'THREE_PRODUCT',
  'THREE_PRODUCT_PLUS_ONE',
  'THREE_PRODUCT_MINUS_ONE',
];

function evaluateNearby(rule: NearbyRule, inputs: readonly number[]): number | null {
  if (inputs.length === 2) {
    const [a, b] = inputs;
    if (rule === 'SUM_TWO') return a! + b!;
    if (rule === 'PRODUCT_TWO') return a! * b!;
    if (rule === 'PRODUCT_PLUS_FIRST') return a! * b! + a!;
    if (rule === 'PRODUCT_PLUS_SECOND') return a! * b! + b!;
    return null;
  }

  if (inputs.length === 3) {
    const [a, b, c] = inputs;
    if (rule === 'SUM_THREE') return a! + b! + c!;
    if (rule === 'PAIR_PRODUCT_PLUS_THIRD') return a! * b! + c!;
    if (rule === 'THREE_PRODUCT') return a! * b! * c!;
    if (rule === 'THREE_PRODUCT_PLUS_ONE') return a! * b! * c! + 1;
    if (rule === 'THREE_PRODUCT_MINUS_ONE') return a! * b! * c! - 1;
  }
  return null;
}

function intendedNearby(ruleId: MisCp015RuleId): NearbyRule {
  if (ruleId === 'PAIR_PRODUCT_PLUS_FIRST') return 'PRODUCT_PLUS_FIRST';
  if (ruleId === 'THREE_INPUT_PRODUCT_PLUS_ONE') return 'THREE_PRODUCT_PLUS_ONE';
  return 'THREE_PRODUCT_MINUS_ONE';
}

function ambiguityAudit(
  ruleId: MisCp015RuleId,
  evidence: readonly MisCp015Group[],
): MisCp015AmbiguityAudit {
  const survivors = NEARBY_RULES.filter((rule) =>
    evidence.every((group) => evaluateNearby(rule, group.inputs) === group.result),
  );
  const intended = intendedNearby(ruleId);
  return survivors.length === 1 && survivors[0] === intended
    ? {
        accepted: true,
        survivingRules: survivors,
        reason: 'Exactly one nearby arithmetic rule survives all evidence groups.',
      }
    : {
        accepted: false,
        survivingRules: survivors,
        reason: 'Competing nearby rules survive: ' + survivors.join(', '),
      };
}

function distractors(
  group: MisCp015Group,
  ruleId: MisCp015RuleId,
  answer: number,
  missingPosition: MisCp015MissingPosition,
): MisCp015Option[] {
  const out: MisCp015Option[] = [];
  const add = (value: number | null, errorLabel: string) => {
    if (
      value != null &&
      Number.isInteger(value) &&
      value > 0 &&
      value <= 999 &&
      value !== answer &&
      !out.some((item) => item.value === value)
    ) {
      out.push({ value, errorLabel });
    }
  };

  if (missingPosition !== 'RESULT') {
    add(answer - 1, 'OFF_BY_ONE_LOW');
    add(answer + 1, 'OFF_BY_ONE_HIGH');
    add(answer + 2, 'INVERSE_ARITHMETIC_ERROR');
    for (const visible of group.inputs) add(visible, 'COPIED_VISIBLE_INPUT');
    return out;
  }

  if (group.inputs.length === 2) {
    const [a, b] = group.inputs;
    add(a! + b!, 'ADDED_INSTEAD');
    add(a! * b!, 'FIRST_ADDEND_OMITTED');
    add(a! * b! + b!, 'ADDED_SECOND_INPUT_INSTEAD');
    add(a! * b! - a!, 'FIRST_ADDEND_SIGN_REVERSED');
    return out;
  }

  const [a, b, c] = group.inputs;
  const product = a! * b! * c!;
  add(a! + b! + c!, 'ADDED_INSTEAD');
  add(product, 'CONSTANT_OMITTED');
  add(
    ruleId === 'THREE_INPUT_PRODUCT_PLUS_ONE' ? product - 1 : product + 1,
    'CONSTANT_SIGN_REVERSED',
  );
  add(a! * b! + c!, 'ONLY_FIRST_PAIR_MULTIPLIED');
  return out;
}

function selectScenario(ruleId: MisCp015RuleId, seed: string) {
  const groups = shuffle(generateGroups(ruleId), seed + ':groups');
  for (let first = 0; first < Math.min(groups.length, 100); first += 1) {
    for (let second = first + 1; second < Math.min(groups.length, 220); second += 1) {
      const evidence = [groups[first]!, groups[second]!];
      if (evidence[0]!.result === evidence[1]!.result) continue;
      const audit = ambiguityAudit(ruleId, evidence);
      if (!audit.accepted) continue;
      const target = groups.find(
        (group, index) =>
          index !== first &&
          index !== second &&
          group.result !== evidence[0]!.result &&
          group.result !== evidence[1]!.result,
      );
      if (target) return { evidence, target, audit };
    }
  }
  throw new Error('Unable to construct MIS-CP-015 scenario for ' + ruleId);
}

function ruleText(ruleId: MisCp015RuleId): string {
  if (ruleId === 'PAIR_PRODUCT_PLUS_FIRST') {
    return 'Multiply the first two numbers, then add the first number once more.';
  }
  if (ruleId === 'THREE_INPUT_PRODUCT_PLUS_ONE') {
    return 'Multiply all three numbers, then add 1.';
  }
  return 'Multiply all three numbers, then subtract 1.';
}

function calculation(ruleId: MisCp015RuleId, group: MisCp015Group): string {
  if (ruleId === 'PAIR_PRODUCT_PLUS_FIRST') {
    const [a, b] = group.inputs;
    return (
      String(a) + ' × ' + String(b) + ' = ' + String(a! * b!) +
      '; ' + String(a! * b!) + ' + ' + String(a) + ' = ' + String(group.result)
    );
  }
  const [a, b, c] = group.inputs;
  const product = a! * b! * c!;
  const sign = ruleId === 'THREE_INPUT_PRODUCT_PLUS_ONE' ? '+' : '−';
  return (
    String(a) + ' × ' + String(b) + ' × ' + String(c) + ' = ' + String(product) +
    '; ' + String(product) + ' ' + sign + ' 1 = ' + String(group.result)
  );
}

function renderGroup(group: MisCp015Group, missing: MisCp015MissingPosition | null): string {
  const inputs = group.inputs.map(String);
  if (missing === 'FIRST_INPUT') inputs[0] = '?';
  if (missing === 'SECOND_INPUT') inputs[1] = '?';
  if (missing === 'THIRD_INPUT') inputs[2] = '?';
  const result = missing === 'RESULT' ? '?' : String(group.result);
  return [...inputs, result].join('   ');
}

export function generateMisCp015Question(
  candidateId: MisCp015CandidateId,
  seed: string | number = 'mis-cp015-v1',
): GeneratedMisCp015Question {
  const rule = misCp015RuleByCandidateId(candidateId);
  const baseSeed = String(seed);
  const scenario = selectScenario(rule.ruleId, baseSeed);

  let missingPosition: MisCp015MissingPosition = 'RESULT';
  if (
    rule.ruleId === 'THREE_INPUT_PRODUCT_MINUS_ONE' &&
    hash(baseSeed + ':inverse') % 2 === 1
  ) {
    const positions = ['FIRST_INPUT', 'SECOND_INPUT', 'THIRD_INPUT'] as const;
    missingPosition = positions[hash(baseSeed + ':position') % positions.length]!;
  }

  const missingIndex =
    missingPosition === 'FIRST_INPUT' ? 0 :
    missingPosition === 'SECOND_INPUT' ? 1 :
    missingPosition === 'THIRD_INPUT' ? 2 : -1;

  const visibleInputs = scenario.target.inputs.map((value, index) =>
    index === missingIndex ? null : value,
  );
  const solved = independentlySolveMisCp015Missing(
    rule.ruleId,
    visibleInputs,
    missingPosition === 'RESULT' ? null : scenario.target.result,
    missingPosition,
    2,
    25,
  );
  const answer =
    missingPosition === 'RESULT'
      ? scenario.target.result
      : scenario.target.inputs[missingIndex]!;

  if (solved.length !== 1 || solved[0] !== answer) {
    throw new Error('MIS-CP-015 target is not uniquely solvable.');
  }

  const wrong = shuffle(
    distractors(scenario.target, rule.ruleId, answer, missingPosition),
    baseSeed + ':options',
  ).slice(0, 3);
  if (wrong.length !== 3) throw new Error('MIS-CP-015 distractor shortage.');

  const correctIndex = hash(baseSeed + ':' + candidateId + ':' + missingPosition) % 4;
  const options = [...wrong];
  options.splice(correctIndex, 0, { value: answer, errorLabel: null });

  const stem = [
    'Find the number that will replace the question mark (?).',
    '',
    ...scenario.evidence.map((group) => renderGroup(group, null)),
    renderGroup(scenario.target, missingPosition),
  ].join('\n');

  const targetCalculation =
    missingPosition === 'RESULT'
      ? calculation(rule.ruleId, scenario.target)
      : 'Testing the missing value ' + String(answer) + ': ' +
        calculation(rule.ruleId, scenario.target);

  const explanation = [
    'The same rule is used in every group.',
    ruleText(rule.ruleId),
    '',
    'Group 1:',
    calculation(rule.ruleId, scenario.evidence[0]!),
    '',
    'Group 2:',
    calculation(rule.ruleId, scenario.evidence[1]!),
    '',
    'Now apply the same rule:',
    targetCalculation,
    '',
    'So, ? = ' + String(answer) + '.',
  ].join('\n');

  return {
    packageId: 'MIS-001',
    checkpointId: 'MIS-CP-015',
    candidateId,
    provisionalQl: true,
    ruleId: rule.ruleId,
    ruleFamily: rule.label,
    context: null,
    difficulty: 'Medium',
    renderer: 'TABLE_GROUP',
    stem,
    evidenceGroups: scenario.evidence,
    target: scenario.target,
    options,
    correctIndex,
    answer,
    explanation,
    solverTrace: [
      ...scenario.evidence.map((group) => calculation(rule.ruleId, group)),
      targetCalculation,
    ],
    ambiguityAudit: scenario.audit,
    structuralFingerprint: [
      'MIS-CP-015',
      rule.ruleId,
      missingPosition,
      'SOURCE_BACKED',
    ].join('|'),
    numericFingerprint: [...scenario.evidence, scenario.target]
      .map((group) => group.inputs.join(',') + ':' + String(group.result))
      .join('|'),
    operationDepth: 2,
    operandCount: rule.operandCount,
    groupCount: 3,
    missingPosition,
    forwardOrInverse: missingPosition === 'RESULT' ? 'FORWARD' : 'INVERSE',
    sourceBacked: true,
    sourceNote: rule.sourceNote,
    semanticAuthorityCandidateId: candidateId,
    createsNewSemanticAuthority: true,
  };
}

export const MIS_CP015_CANDIDATE_IDS = Object.freeze(
  MIS_CP015_RULES.map((rule) => rule.candidateId),
);
