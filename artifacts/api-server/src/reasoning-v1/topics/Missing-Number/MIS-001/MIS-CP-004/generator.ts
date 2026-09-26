import {
  MIS_CP004_RULES,
  misCp004RuleByCandidateId,
  type MisCp004CandidateId,
  type MisCp004RuleDefinition,
  type MisCp004RuleId,
} from './rule-definitions';
import {
  auditMisCp004Ambiguity,
  independentlyEvaluateMisCp004Rule,
  independentlyVerifyMisCp004Group,
  type MisCp004AmbiguityAudit,
  type MisCp004Group,
} from './independent-solver';

export interface MisCp004Option {
  readonly value: number;
  readonly errorLabel: string | null;
}

export interface GeneratedMisCp004Question {
  readonly packageId: 'MIS-001';
  readonly checkpointId: 'MIS-CP-004';
  readonly candidateId: MisCp004CandidateId;
  readonly provisionalQl: true;
  readonly ruleId: MisCp004RuleId;
  readonly ruleFamily: string;
  readonly difficulty: 'Easy' | 'Medium';
  readonly renderer: 'TABLE_OR_GROUP';
  readonly stem: string;
  readonly evidenceGroups: readonly MisCp004Group[];
  readonly target: MisCp004Group;
  readonly options: readonly MisCp004Option[];
  readonly correctIndex: number;
  readonly answer: number;
  readonly explanation: string;
  readonly solverTrace: readonly string[];
  readonly ambiguityAudit: MisCp004AmbiguityAudit;
  readonly structuralFingerprint: string;
  readonly numericFingerprint: string;
  readonly operationDepth: 1 | 2;
  readonly operandCount: 1 | 2;
  readonly groupCount: number;
  readonly missingPosition: 'RESULT_MISSING';
  readonly sourceThin: boolean;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function rng(seed: string): () => number {
  let state = hash(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: string): T[] {
  const result = [...items];
  const random = rng(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap]!, result[index]!];
  }
  return result;
}

function bounded(value: number | null): number | null {
  return value != null && Number.isInteger(value) && value > 0 && value <= 999 ? value : null;
}

function factorial(value: number): number | null {
  if (!Number.isInteger(value) || value < 0 || value > 6) return null;
  let result = 1;
  for (let n = 2; n <= value; n += 1) result *= n;
  return result;
}

function generatedEvaluate(
  ruleId: MisCp004RuleId,
  first: number,
  second: number | null,
): number | null {
  if (ruleId === 'N_TIMES_NEXT') return bounded(first * (first + 1));
  if (ruleId === 'N_TIMES_PREVIOUS') return bounded(first * (first - 1));
  if (ruleId === 'THREE_CONSECUTIVE_PRODUCT') return bounded(first * (first + 1) * (first + 2));
  if (ruleId === 'THREE_CONSECUTIVE_SUM') return bounded(first + (first + 1) + (first + 2));
  if (ruleId === 'TRIANGULAR_NUMBER') return bounded((first * (first + 1)) / 2);
  if (ruleId === 'SMALL_FACTORIAL') return bounded(factorial(first));
  if (second == null) return null;
  if (ruleId === 'A_TIMES_SUM') return bounded(first * (first + second));
  if (ruleId === 'B_TIMES_SUM') return bounded(second * (first + second));
  return first > second ? bounded(first * (first - second)) : null;
}

const validGroupCache = new Map<string, readonly MisCp004Group[]>();

function validGroups(rule: MisCp004RuleDefinition): readonly MisCp004Group[] {
  const cached = validGroupCache.get(rule.ruleId);
  if (cached) return cached;

  const groups: MisCp004Group[] = [];
  if (rule.operandCount === 1) {
    for (let first = rule.minInput; first <= rule.maxInput; first += 1) {
      const result = generatedEvaluate(rule.ruleId, first, null);
      if (result == null || result === first) continue;
      const group = { first, second: null, result };
      if (!independentlyVerifyMisCp004Group(rule.ruleId, group)) {
        throw new Error('Generator/independent-solver disagreement while constructing a unary CP004 group.');
      }
      groups.push(group);
    }
  } else {
    for (let first = rule.minInput; first <= rule.maxInput; first += 1) {
      for (let second = rule.minInput; second <= rule.maxInput; second += 1) {
        if (first === second) continue;
        const result = generatedEvaluate(rule.ruleId, first, second);
        if (result == null || result === first || result === second) continue;
        const group = { first, second, result };
        if (!independentlyVerifyMisCp004Group(rule.ruleId, group)) {
          throw new Error('Generator/independent-solver disagreement while constructing a binary CP004 group.');
        }
        groups.push(group);
      }
    }
  }
  validGroupCache.set(rule.ruleId, groups);
  return groups;
}

function sharedInputCount(left: MisCp004Group, right: MisCp004Group): number {
  const leftInputs = [left.first, left.second].filter((value): value is number => value != null);
  const rightInputs = [right.first, right.second].filter((value): value is number => value != null);
  const leftSet = new Set(leftInputs);
  return rightInputs.filter((value) => leftSet.has(value)).length;
}

function governedDistractors(ruleId: MisCp004RuleId, target: MisCp004Group): MisCp004Option[] {
  const first = target.first;
  const second = target.second;
  const correct = target.result;
  const candidates: MisCp004Option[] = [];
  const add = (value: number | null, errorLabel: string) => {
    if (value == null || !Number.isInteger(value) || value <= 0 || value > 999 || value === correct) return;
    if (candidates.some((entry) => entry.value === value)) return;
    candidates.push({ value, errorLabel });
  };

  if (ruleId === 'N_TIMES_NEXT') {
    add(first * first, 'SQUARED_INSTEAD');
    add(first * (first - 1), 'USED_PREVIOUS_NUMBER');
    add(first + (first + 1), 'ADDED_CONSECUTIVE_NUMBERS');
    add(first * (first + 2), 'SKIPPED_ONE_NUMBER');
  } else if (ruleId === 'N_TIMES_PREVIOUS') {
    add(first * first, 'SQUARED_INSTEAD');
    add(first * (first + 1), 'USED_NEXT_NUMBER');
    add(first + (first - 1), 'ADDED_CONSECUTIVE_NUMBERS');
    add((first - 1) * (first - 1), 'SQUARED_PREVIOUS_NUMBER');
  } else if (ruleId === 'THREE_CONSECUTIVE_PRODUCT') {
    add(first * (first + 1), 'USED_ONLY_TWO_CONSECUTIVE_NUMBERS');
    add(first + (first + 1) + (first + 2), 'ADDED_INSTEAD_OF_MULTIPLIED');
    add(first * first * first, 'CUBED_STARTING_NUMBER');
    add(first * (first + 2), 'OMITTED_MIDDLE_NUMBER');
  } else if (ruleId === 'THREE_CONSECUTIVE_SUM') {
    add(first + (first + 1), 'USED_ONLY_TWO_CONSECUTIVE_NUMBERS');
    add(first * (first + 1) * (first + 2), 'MULTIPLIED_INSTEAD_OF_ADDED');
    add(3 * first, 'REPEATED_STARTING_NUMBER');
    add(first + (first + 2), 'OMITTED_MIDDLE_NUMBER');
  } else if (ruleId === 'TRIANGULAR_NUMBER') {
    add(first * (first + 1), 'FORGOT_TO_DIVIDE_BY_TWO');
    add((first * (first - 1)) / 2, 'USED_PREVIOUS_CONSECUTIVE_PAIR');
    add(first + (first + 1), 'ADDED_INSTEAD_OF_TRIANGULAR_RULE');
    add((first * (first + 2)) / 2, 'USED_WRONG_NEXT_TERM');
  } else if (ruleId === 'SMALL_FACTORIAL') {
    const fact = factorial(first);
    add(fact == null ? null : fact + first, 'ADDED_NUMBER_AFTER_FACTORIAL');
    add(fact == null ? null : fact - first, 'SUBTRACTED_NUMBER_AFTER_FACTORIAL');
    add(first * (first - 1), 'STOPPED_FACTORIAL_TOO_EARLY');
    add(first * first, 'SQUARED_INSTEAD_OF_FACTORIAL');
    add(first * (first + 1), 'USED_CONSECUTIVE_PRODUCT');
  } else if (second != null) {
    const sum = first + second;
    const difference = first - second;
    const product = first * second;
    if (ruleId === 'A_TIMES_SUM') {
      add(product, 'SUM_STAGE_OMITTED');
      add(second * sum, 'MULTIPLIED_BY_WRONG_INPUT');
      add(first * difference, 'USED_DIFFERENCE_INSTEAD_OF_SUM');
      add(first * first + second, 'ADDED_SECOND_AFTER_SQUARING');
    } else if (ruleId === 'B_TIMES_SUM') {
      add(product, 'SUM_STAGE_OMITTED');
      add(first * sum, 'MULTIPLIED_BY_WRONG_INPUT');
      add(second * Math.abs(difference), 'USED_DIFFERENCE_INSTEAD_OF_SUM');
      add(second * second + first, 'ADDED_FIRST_AFTER_SQUARING');
    } else {
      add(first * (first + second), 'USED_SUM_INSTEAD_OF_DIFFERENCE');
      add(product, 'DIFFERENCE_STAGE_OMITTED');
      add(first * first - second, 'SUBTRACTED_AFTER_SQUARING');
      add(second * Math.abs(difference), 'MULTIPLIED_BY_WRONG_INPUT');
    }
  }

  return candidates;
}

function chooseEvidenceAndTarget(
  rule: MisCp004RuleDefinition,
  seed: string,
): {
  readonly evidence: readonly MisCp004Group[];
  readonly target: MisCp004Group;
  readonly ambiguity: MisCp004AmbiguityAudit;
} {
  const groups = shuffle(validGroups(rule), seed + ':groups');
  if (groups.length < 4) throw new Error('MIS-CP-004 rule domain is too small.');

  for (let start = 0; start < Math.min(groups.length, 32); start += 1) {
    const evidence: MisCp004Group[] = [groups[start]!];
    const used = new Set<number>([start]);

    while (evidence.length < 3) {
      let bestIndex = -1;
      let bestSurvivors = Number.POSITIVE_INFINITY;

      for (let index = 0; index < Math.min(groups.length, 200); index += 1) {
        if (used.has(index)) continue;
        const candidate = groups[index]!;
        if (evidence.some((shown) => shown.result === candidate.result)) continue;
        const maxSharedInputs = rule.operandCount === 1 ? 0 : 1;
        if (evidence.some((shown) => sharedInputCount(shown, candidate) > maxSharedInputs)) continue;

        const audit = auditMisCp004Ambiguity(rule.ruleId, [...evidence, candidate]);
        const survivors = new Set(audit.matches.map((match) => match.semanticKey)).size;
        if (survivors < bestSurvivors) {
          bestIndex = index;
          bestSurvivors = survivors;
        }
        if (survivors === 1) break;
      }

      if (bestIndex < 0) break;
      evidence.push(groups[bestIndex]!);
      used.add(bestIndex);

      if (evidence.length >= 2) {
        const ambiguity = auditMisCp004Ambiguity(rule.ruleId, evidence);
        if (!ambiguity.accepted) continue;
        const maxSharedInputs = rule.operandCount === 1 ? 0 : 1;
        const target = groups.find((group, index) =>
          !used.has(index)
          && governedDistractors(rule.ruleId, group).length >= 3
          && !evidence.some((shown) => shown.result === group.result)
          && !evidence.some((shown) => sharedInputCount(shown, group) > maxSharedInputs),
        );
        if (target) return { evidence, target, ambiguity };
      }
    }
  }

  throw new Error(`Unable to construct an unambiguous MIS-CP-004 instance for ${rule.candidateId}.`);
}

function ruleStatement(ruleId: MisCp004RuleId): string {
  if (ruleId === 'N_TIMES_NEXT') return 'Multiply the number by the next consecutive number.';
  if (ruleId === 'N_TIMES_PREVIOUS') return 'Multiply the number by the previous consecutive number.';
  if (ruleId === 'A_TIMES_SUM') return 'Add the two numbers, then multiply the sum by the first number.';
  if (ruleId === 'B_TIMES_SUM') return 'Add the two numbers, then multiply the sum by the second number.';
  if (ruleId === 'A_TIMES_DIFFERENCE') return 'Subtract the second number from the first, then multiply the difference by the first number.';
  if (ruleId === 'THREE_CONSECUTIVE_PRODUCT') return 'Multiply the number and the next two consecutive numbers.';
  if (ruleId === 'THREE_CONSECUTIVE_SUM') return 'Add the number and the next two consecutive numbers.';
  if (ruleId === 'TRIANGULAR_NUMBER') return 'Multiply the number by the next consecutive number, then divide by 2.';
  return 'Take the factorial of the number.';
}

function explainGroup(ruleId: MisCp004RuleId, group: MisCp004Group): string {
  const first = group.first;
  const second = group.second;
  const result = group.result;

  if (ruleId === 'N_TIMES_NEXT') {
    return `The next number after ${first} is ${first + 1}.\n${first} × ${first + 1} = ${result}`;
  }
  if (ruleId === 'N_TIMES_PREVIOUS') {
    return `The previous number before ${first} is ${first - 1}.\n${first} × ${first - 1} = ${result}`;
  }
  if (ruleId === 'THREE_CONSECUTIVE_PRODUCT') {
    return `The next two numbers are ${first + 1} and ${first + 2}.\n${first} × ${first + 1} × ${first + 2} = ${result}`;
  }
  if (ruleId === 'THREE_CONSECUTIVE_SUM') {
    return `The next two numbers are ${first + 1} and ${first + 2}.\n${first} + ${first + 1} + ${first + 2} = ${result}`;
  }
  if (ruleId === 'TRIANGULAR_NUMBER') {
    const product = first * (first + 1);
    return `${first} × ${first + 1} = ${product}\n${product} ÷ 2 = ${result}`;
  }
  if (ruleId === 'SMALL_FACTORIAL') {
    const factors = Array.from({ length: first }, (_, index) => first - index);
    return `${first}! = ${factors.join(' × ')} = ${result}`;
  }
  if (second == null) return '';

  const sum = first + second;
  const difference = first - second;
  if (ruleId === 'A_TIMES_SUM') {
    return `${first} + ${second} = ${sum}\n${first} × ${sum} = ${result}`;
  }
  if (ruleId === 'B_TIMES_SUM') {
    return `${first} + ${second} = ${sum}\n${second} × ${sum} = ${result}`;
  }
  return `${first} − ${second} = ${difference}\n${first} × ${difference} = ${result}`;
}

function renderStem(evidence: readonly MisCp004Group[], target: MisCp004Group): string {
  const unary = target.second == null;
  const rows = [...evidence, target].map((group, index, all) => {
    const isTarget = index === all.length - 1;
    const result = isTarget ? '?' : String(group.result);
    return unary
      ? `${group.first}   ${result}`
      : `${group.first}   ${group.second}   ${result}`;
  });
  return ['Find the number that will replace the question mark (?).', '', ...rows].join('\n');
}

export function generateMisCp004Question(
  candidateId: MisCp004CandidateId,
  seed: string | number = 'mis-cp004-v1',
): GeneratedMisCp004Question {
  const rule = misCp004RuleByCandidateId(candidateId);
  const baseSeed = String(seed);
  const selected = chooseEvidenceAndTarget(rule, baseSeed);

  const solverAnswer = independentlyEvaluateMisCp004Rule(
    rule.ruleId,
    selected.target.first,
    selected.target.second,
  );
  if (solverAnswer !== selected.target.result) {
    throw new Error('Independent CP004 solver rejected the target answer.');
  }

  const wrong = shuffle(governedDistractors(rule.ruleId, selected.target), baseSeed + ':distractors').slice(0, 3);
  if (wrong.length !== 3) throw new Error('MIS-CP-004 requires three misconception-grounded distractors.');

  const correctIndex = hash(baseSeed + ':' + candidateId + ':correct-index') % 4;
  const options: MisCp004Option[] = wrong.map((entry) => ({ ...entry }));
  options.splice(correctIndex, 0, { value: selected.target.result, errorLabel: null });
  if (new Set(options.map((option) => option.value)).size !== 4) {
    throw new Error('MIS-CP-004 options must be unique.');
  }

  const evidenceLines = selected.evidence.flatMap((group, index) => [
    index === 0 ? 'Look at Row 1:' : `Check Row ${index + 1} in the same way:`,
    explainGroup(rule.ruleId, group),
    '',
  ]);
  const explanation = [
    'The same rule is used in every row.',
    ruleStatement(rule.ruleId),
    '',
    ...evidenceLines,
    'Now apply the same rule to the row with the question mark:',
    explainGroup(rule.ruleId, selected.target),
    '',
    `So, ? = ${selected.target.result}.`,
  ].join('\n');

  const solverTrace = [
    ...selected.evidence.map((group) => explainGroup(rule.ruleId, group)),
    explainGroup(rule.ruleId, selected.target),
  ];
  const numericFingerprint = [...selected.evidence, selected.target]
    .map((group) => `${group.first},${group.second ?? '_'},${group.result}`)
    .join('|');
  const structuralFingerprint = [
    'MIS-CP-004',
    rule.ruleId,
    'TABLE_OR_GROUP',
    'RESULT_MISSING',
    `OPERANDS_${rule.operandCount}`,
    `DEPTH_${rule.operationDepth}`,
    `EVIDENCE_${selected.evidence.length}`,
  ].join('|');

  return {
    packageId: 'MIS-001',
    checkpointId: 'MIS-CP-004',
    candidateId,
    provisionalQl: true,
    ruleId: rule.ruleId,
    ruleFamily: rule.label,
    difficulty: rule.baselineDifficulty,
    renderer: 'TABLE_OR_GROUP',
    stem: renderStem(selected.evidence, selected.target),
    evidenceGroups: selected.evidence,
    target: selected.target,
    options,
    correctIndex,
    answer: selected.target.result,
    explanation,
    solverTrace,
    ambiguityAudit: selected.ambiguity,
    structuralFingerprint,
    numericFingerprint,
    operationDepth: rule.operationDepth,
    operandCount: rule.operandCount,
    groupCount: selected.evidence.length + 1,
    missingPosition: 'RESULT_MISSING',
    sourceThin: Boolean(rule.sourceThin),
  };
}

export const MIS_CP004_CANDIDATE_IDS = Object.freeze(
  MIS_CP004_RULES.map((rule) => rule.candidateId),
);
