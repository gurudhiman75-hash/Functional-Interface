
import { MIS_CP017_RULES, misCp017RuleByCandidateId, type MisCp017CandidateId } from './rule-definitions';
import { independentlyEvaluateMisCp017Rule, type MisCp017Group } from './independent-solver';

export interface MisCp017Option {
  readonly value: number;
  readonly errorLabel: string | null;
}

export interface GeneratedMisCp017Question {
  readonly packageId: 'MIS-001';
  readonly checkpointId: 'MIS-CP-017';
  readonly candidateId: MisCp017CandidateId;
  readonly provisionalQl: true;
  readonly ruleId: 'SECOND_MINUS_HALF_FIRST_PLUS_FIRST_DIGIT_PRODUCT';
  readonly ruleFamily: string;
  readonly context: null;
  readonly difficulty: 'Hard';
  readonly renderer: 'TABLE_GROUP';
  readonly stem: string;
  readonly evidenceGroups: readonly MisCp017Group[];
  readonly target: MisCp017Group;
  readonly options: readonly MisCp017Option[];
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
  readonly operationDepth: 3;
  readonly operandCount: 2;
  readonly groupCount: 3;
  readonly missingPosition: 'RESULT';
  readonly forwardOrInverse: 'FORWARD';
  readonly sourceBacked: true;
  readonly sourceNote: string;
  readonly semanticAuthorityCandidateId: 'MIS-CAND-091';
  readonly createsNewSemanticAuthority: true;
  readonly wholeNumberOrDigitMode: 'MIXED_WHOLE_AND_DIGIT';
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

function digitProduct(number: number): number {
  return Math.floor(number / 10) * (number % 10);
}

function digitSum(number: number): number {
  return Math.floor(number / 10) + (number % 10);
}

type Nearby =
  | 'SECOND_MINUS_HALF_FIRST'
  | 'SECOND_PLUS_DIGIT_PRODUCT'
  | 'SECOND_MINUS_HALF_FIRST_PLUS_DIGIT_SUM'
  | 'SECOND_MINUS_HALF_FIRST_PLUS_DIGIT_PRODUCT'
  | 'SECOND_MINUS_DIGIT_PRODUCT'
  | 'SUM'
  | 'ABS_DIFFERENCE';

const NEARBY: readonly Nearby[] = [
  'SECOND_MINUS_HALF_FIRST',
  'SECOND_PLUS_DIGIT_PRODUCT',
  'SECOND_MINUS_HALF_FIRST_PLUS_DIGIT_SUM',
  'SECOND_MINUS_HALF_FIRST_PLUS_DIGIT_PRODUCT',
  'SECOND_MINUS_DIGIT_PRODUCT',
  'SUM',
  'ABS_DIFFERENCE',
];

function evaluateNearby(rule: Nearby, first: number, second: number): number {
  if (rule === 'SECOND_MINUS_HALF_FIRST') return second - first / 2;
  if (rule === 'SECOND_PLUS_DIGIT_PRODUCT') return second + digitProduct(first);
  if (rule === 'SECOND_MINUS_HALF_FIRST_PLUS_DIGIT_SUM') {
    return second - first / 2 + digitSum(first);
  }
  if (rule === 'SECOND_MINUS_HALF_FIRST_PLUS_DIGIT_PRODUCT') {
    return second - first / 2 + digitProduct(first);
  }
  if (rule === 'SECOND_MINUS_DIGIT_PRODUCT') return second - digitProduct(first);
  if (rule === 'SUM') return first + second;
  return Math.abs(first - second);
}

function groups(): MisCp017Group[] {
  const out: MisCp017Group[] = [];
  for (let first = 12; first <= 98; first += 2) {
    if (first % 10 === 0) continue;
    for (let second = 6; second <= 40; second += 1) {
      const result = independentlyEvaluateMisCp017Rule(first, second);
      if (result != null && result !== first && result !== second) {
        out.push({ first, second, result });
      }
    }
  }
  return out;
}

function ambiguityAudit(evidence: readonly MisCp017Group[]) {
  const survivors = NEARBY.filter((rule) =>
    evidence.every((group) => evaluateNearby(rule, group.first, group.second) === group.result),
  );
  return survivors.length === 1 && survivors[0] === 'SECOND_MINUS_HALF_FIRST_PLUS_DIGIT_PRODUCT'
    ? {
        accepted: true,
        survivingRules: survivors,
        reason: 'Exactly one nearby whole-number/digit-property rule survives all evidence rows.',
      }
    : {
        accepted: false,
        survivingRules: survivors,
        reason: 'Competing nearby rules survive: ' + survivors.join(', '),
      };
}

function distractors(group: MisCp017Group): MisCp017Option[] {
  const out: MisCp017Option[] = [];
  const add = (value: number, errorLabel: string) => {
    if (
      Number.isInteger(value) &&
      value > 0 &&
      value <= 999 &&
      value !== group.result &&
      !out.some((entry) => entry.value === value)
    ) out.push({ value, errorLabel });
  };

  add(group.second - group.first / 2, 'DIGIT_PRODUCT_OMITTED');
  add(group.second + digitProduct(group.first), 'HALF_FIRST_NOT_SUBTRACTED');
  add(
    group.second - group.first / 2 + digitSum(group.first),
    'DIGIT_SUM_USED_INSTEAD_OF_PRODUCT',
  );
  add(group.second - digitProduct(group.first), 'WHOLE_NUMBER_HALF_STEP_OMITTED');
  add(group.first + group.second, 'ADDED_VISIBLE_NUMBERS');
  return out;
}

function select(seed: string) {
  const candidates = shuffle(groups(), seed + ':groups');
  for (let firstIndex = 0; firstIndex < Math.min(candidates.length, 100); firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < Math.min(candidates.length, 260);
      secondIndex += 1
    ) {
      const evidence = [candidates[firstIndex]!, candidates[secondIndex]!];
      if (evidence[0]!.result === evidence[1]!.result) continue;
      const audit = ambiguityAudit(evidence);
      if (!audit.accepted) continue;
      const target = candidates.find(
        (group, index) =>
          index !== firstIndex &&
          index !== secondIndex &&
          group.result !== evidence[0]!.result &&
          group.result !== evidence[1]!.result &&
          distractors(group).length >= 3,
      );
      if (target) return { evidence, target, audit };
    }
  }
  throw new Error('Unable to construct MIS-CP-017 source-backed scenario.');
}

function calculation(group: MisCp017Group): string {
  const half = group.first / 2;
  const product = digitProduct(group.first);
  return (
    String(group.second) + ' − (' + String(group.first) + ' ÷ 2) = ' +
    String(group.second - half) + '\n' +
    'Product of digits of ' + String(group.first) + ' = ' + String(product) + '\n' +
    String(group.second - half) + ' + ' + String(product) + ' = ' +
    String(group.result)
  );
}

function row(group: MisCp017Group, hideResult = false): string {
  return String(group.first) + '   ' + String(group.second) + '   ' +
    (hideResult ? '?' : String(group.result));
}

export function generateMisCp017Question(
  candidateId: MisCp017CandidateId,
  seed: string | number = 'mis-cp017-v1',
): GeneratedMisCp017Question {
  const rule = misCp017RuleByCandidateId(candidateId);
  const baseSeed = String(seed);
  const selected = select(baseSeed);
  const wrong = shuffle(distractors(selected.target), baseSeed + ':options').slice(0, 3);
  if (wrong.length !== 3) throw new Error('MIS-CP-017 distractor shortage.');

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
    'Subtract half of the first number from the second number. Then add the product of the two digits of the first number.',
    '',
    'Row 1:',
    calculation(selected.evidence[0]!),
    '',
    'Row 2:',
    calculation(selected.evidence[1]!),
    '',
    'Now apply the same rule:',
    calculation(selected.target),
    '',
    'So, ? = ' + String(selected.target.result) + '.',
  ].join('\n');

  return {
    packageId: 'MIS-001',
    checkpointId: 'MIS-CP-017',
    candidateId,
    provisionalQl: true,
    ruleId: 'SECOND_MINUS_HALF_FIRST_PLUS_FIRST_DIGIT_PRODUCT',
    ruleFamily: rule.label,
    context: null,
    difficulty: 'Hard',
    renderer: 'TABLE_GROUP',
    stem,
    evidenceGroups: selected.evidence,
    target: selected.target,
    options,
    correctIndex,
    answer: selected.target.result,
    explanation,
    solverTrace: [
      ...selected.evidence.map(calculation),
      calculation(selected.target),
    ],
    ambiguityAudit: selected.audit,
    structuralFingerprint:
      'MIS-CP-017|SECOND_MINUS_HALF_FIRST_PLUS_FIRST_DIGIT_PRODUCT|SOURCE_BACKED',
    numericFingerprint: [...selected.evidence, selected.target]
      .map((group) =>
        String(group.first) + ',' + String(group.second) + ':' + String(group.result),
      )
      .join('|'),
    operationDepth: 3,
    operandCount: 2,
    groupCount: 3,
    missingPosition: 'RESULT',
    forwardOrInverse: 'FORWARD',
    sourceBacked: true,
    sourceNote: rule.sourceNote,
    semanticAuthorityCandidateId: 'MIS-CAND-091',
    createsNewSemanticAuthority: true,
    wholeNumberOrDigitMode: 'MIXED_WHOLE_AND_DIGIT',
  };
}

export const MIS_CP017_CANDIDATE_IDS = Object.freeze(
  MIS_CP017_RULES.map((rule) => rule.candidateId),
);
