import {
  MIS_CP003_RULES,
  misCp003ContextKey,
  misCp003RuleByCandidateId,
  type MisCp003CandidateId,
  type MisCp003RuleContext,
  type MisCp003RuleDefinition,
  type MisCp003RuleId,
} from './rule-definitions';
import {
  auditMisCp003Ambiguity,
  independentlyEvaluateMisCp003Rule,
  independentlyVerifyMisCp003Group,
  type MisCp003AmbiguityAudit,
  type MisCp003Group,
} from './independent-solver';

export interface MisCp003Option {
  readonly value: number;
  readonly errorLabel: string | null;
}

export interface GeneratedMisCp003Question {
  readonly packageId: 'MIS-001';
  readonly checkpointId: 'MIS-CP-003';
  readonly candidateId: MisCp003CandidateId;
  readonly provisionalQl: true;
  readonly ruleId: MisCp003RuleId;
  readonly ruleFamily: string;
  readonly context: MisCp003RuleContext;
  readonly difficulty: 'Easy' | 'Medium';
  readonly renderer: 'TABLE_OR_GROUP';
  readonly stem: string;
  readonly evidenceGroups: readonly MisCp003Group[];
  readonly target: MisCp003Group;
  readonly options: readonly MisCp003Option[];
  readonly correctIndex: number;
  readonly answer: number;
  readonly explanation: string;
  readonly solverTrace: readonly string[];
  readonly ambiguityAudit: MisCp003AmbiguityAudit;
  readonly structuralFingerprint: string;
  readonly numericFingerprint: string;
  readonly operationDepth: 1 | 2;
  readonly operandCount: 1 | 2;
  readonly groupCount: number;
  readonly missingPosition: 'RESULT_MISSING';
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

function generatedEvaluate(
  ruleId: MisCp003RuleId,
  first: number,
  second: number | null,
  context: MisCp003RuleContext,
): number | null {
  const squareFirst = first * first;
  if (ruleId === 'SQUARE_INPUT') return bounded(squareFirst);
  if (ruleId === 'CUBE_INPUT') return bounded(first * first * first);
  if (second == null) return null;

  const squareSecond = second * second;
  if (ruleId === 'SQUARE_FIRST_PLUS_SECOND') return bounded(squareFirst + second);
  if (ruleId === 'SQUARE_FIRST_MINUS_SECOND') return bounded(squareFirst - second);
  if (ruleId === 'SUM_OF_SQUARES') return bounded(squareFirst + squareSecond);
  if (ruleId === 'DIFFERENCE_OF_SQUARES') return bounded(squareFirst - squareSecond);
  if (ruleId === 'PRODUCT_PLUS_FIRST_SQUARE') return bounded(first * second + squareFirst);
  if (ruleId === 'PRODUCT_PLUS_SECOND_SQUARE') return bounded(first * second + squareSecond);
  if (ruleId === 'PAIR_SUM_OR_DIFFERENCE_SQUARE') {
    const base = context.sign === -1 ? first - second : first + second;
    return bounded(base > 1 ? base * base : null);
  }
  const base = context.sign === -1 ? first - second : first + second;
  return bounded(base > 1 ? base * base * base : null);
}

const validGroupCache = new Map<string, readonly MisCp003Group[]>();

function validGroups(rule: MisCp003RuleDefinition, context: MisCp003RuleContext): readonly MisCp003Group[] {
  const key = rule.ruleId + ':' + misCp003ContextKey(context);
  const cached = validGroupCache.get(key);
  if (cached) return cached;

  const groups: MisCp003Group[] = [];
  if (rule.operandCount === 1) {
    for (let first = rule.minInput; first <= rule.maxInput; first += 1) {
      const result = generatedEvaluate(rule.ruleId, first, null, context);
      if (result == null || result === first) continue;
      const group = { first, second: null, result };
      if (!independentlyVerifyMisCp003Group(rule.ruleId, context, group)) {
        throw new Error('Generator/independent-solver disagreement while constructing a unary CP003 group.');
      }
      groups.push(group);
    }
  } else {
    for (let first = rule.minInput; first <= rule.maxInput; first += 1) {
      for (let second = rule.minInput; second <= rule.maxInput; second += 1) {
        if (first === second) continue;
        const result = generatedEvaluate(rule.ruleId, first, second, context);
        if (result == null || result === first || result === second) continue;
        const group = { first, second, result };
        if (!independentlyVerifyMisCp003Group(rule.ruleId, context, group)) {
          throw new Error('Generator/independent-solver disagreement while constructing a binary CP003 group.');
        }
        groups.push(group);
      }
    }
  }
  validGroupCache.set(key, groups);
  return groups;
}

function sharedInputCount(left: MisCp003Group, right: MisCp003Group): number {
  const leftInputs = [left.first, left.second].filter((value): value is number => value != null);
  const rightInputs = [right.first, right.second].filter((value): value is number => value != null);
  const leftSet = new Set(leftInputs);
  return rightInputs.filter((value) => leftSet.has(value)).length;
}

function governedDistractors(
  ruleId: MisCp003RuleId,
  context: MisCp003RuleContext,
  target: MisCp003Group,
): MisCp003Option[] {
  const first = target.first;
  const second = target.second;
  const correct = target.result;
  const candidates: MisCp003Option[] = [];
  const add = (value: number | null, errorLabel: string) => {
    if (value == null || !Number.isInteger(value) || value <= 0 || value > 999 || value === correct) return;
    if (candidates.some((entry) => entry.value === value)) return;
    candidates.push({ value, errorLabel });
  };

  if (ruleId === 'SQUARE_INPUT') {
    add(first * first * first, 'CUBED_INSTEAD_OF_SQUARED');
    add(first * (first + 1), 'MULTIPLIED_BY_NEXT_NUMBER');
    add(first * first - first, 'NUMBER_SUBTRACTED_AFTER_SQUARING');
    add(first + first, 'DOUBLED_INSTEAD_OF_SQUARED');
  } else if (ruleId === 'CUBE_INPUT') {
    add(first * first, 'SQUARED_INSTEAD_OF_CUBED');
    add(first * first * first + first, 'NUMBER_ADDED_AFTER_CUBING');
    add(first * first * (first - 1), 'USED_PREVIOUS_FACTOR');
  } else if (second != null) {
    const squareFirst = first * first;
    const squareSecond = second * second;
    const product = first * second;

    if (ruleId === 'SQUARE_FIRST_PLUS_SECOND') {
      add(squareFirst - second, 'SUBTRACTED_SECOND_INSTEAD');
      add(first + squareSecond, 'SQUARED_WRONG_INPUT');
      add((first + second) * (first + second), 'SQUARED_THE_SUM');
      add(squareFirst, 'SECOND_INPUT_OMITTED');
    } else if (ruleId === 'SQUARE_FIRST_MINUS_SECOND') {
      add(squareFirst + second, 'ADDED_SECOND_INSTEAD');
      add(Math.abs(first - second) ** 2, 'SQUARED_THE_DIFFERENCE');
      add(squareFirst, 'SECOND_INPUT_OMITTED');
      add(Math.abs(first - squareSecond), 'SQUARED_WRONG_INPUT');
    } else if (ruleId === 'SUM_OF_SQUARES') {
      add((first + second) ** 2, 'SQUARED_THE_SUM');
      add(squareFirst + second, 'SQUARED_ONLY_FIRST');
      add(first + squareSecond, 'SQUARED_ONLY_SECOND');
      add(product, 'MULTIPLIED_INSTEAD');
    } else if (ruleId === 'DIFFERENCE_OF_SQUARES') {
      add(Math.abs(first - second) ** 2, 'SQUARED_THE_DIFFERENCE');
      add(squareFirst + squareSecond, 'ADDED_SQUARES_INSTEAD');
      add(Math.abs(squareFirst - second), 'SECOND_INPUT_NOT_SQUARED');
      add(Math.abs(first - squareSecond), 'FIRST_INPUT_NOT_SQUARED');
    } else if (ruleId === 'PRODUCT_PLUS_FIRST_SQUARE') {
      add(product + squareSecond, 'SQUARED_WRONG_INPUT');
      add(product + first, 'FIRST_INPUT_NOT_SQUARED');
      add(squareFirst + second, 'PRODUCT_STAGE_OMITTED');
      add(product, 'SQUARE_STAGE_OMITTED');
    } else if (ruleId === 'PRODUCT_PLUS_SECOND_SQUARE') {
      add(product + squareFirst, 'SQUARED_WRONG_INPUT');
      add(product + second, 'SECOND_INPUT_NOT_SQUARED');
      add(first + squareSecond, 'PRODUCT_STAGE_OMITTED');
      add(product, 'SQUARE_STAGE_OMITTED');
    } else if (ruleId === 'PAIR_SUM_OR_DIFFERENCE_SQUARE') {
      const sign = context.sign === -1 ? -1 : 1;
      const base = first + sign * second;
      add(squareFirst + sign * squareSecond, 'OPERATED_ON_SQUARES_SEPARATELY');
      add(Math.abs(first - sign * second) ** 2, 'USED_OPPOSITE_SIGN');
      add(Math.abs(base) * 2, 'DOUBLED_INSTEAD_OF_SQUARED');
      add(product, 'MULTIPLIED_INSTEAD');
    } else {
      const sign = context.sign === -1 ? -1 : 1;
      const base = first + sign * second;
      add(base * base, 'SQUARED_INSTEAD_OF_CUBED');
      add(Math.abs(first ** 3 + sign * second ** 3), 'OPERATED_ON_CUBES_SEPARATELY');
      add(Math.abs(first - sign * second) ** 3, 'USED_OPPOSITE_SIGN');
      add(Math.abs(base) * 3, 'TRIPLED_INSTEAD_OF_CUBED');
    }
  }
  return candidates;
}

function chooseEvidenceAndTarget(
  rule: MisCp003RuleDefinition,
  context: MisCp003RuleContext,
  seed: string,
): {
  readonly evidence: readonly MisCp003Group[];
  readonly target: MisCp003Group;
  readonly ambiguity: MisCp003AmbiguityAudit;
} {
  const groups = shuffle(validGroups(rule, context), seed + ':groups');
  if (groups.length < 4) throw new Error('MIS-CP-003 rule domain is too small.');

  for (let start = 0; start < Math.min(groups.length, 30); start += 1) {
    const evidence: MisCp003Group[] = [groups[start]!];
    const used = new Set<number>([start]);

    while (evidence.length < 3) {
      let bestIndex = -1;
      let bestSurvivors = Number.POSITIVE_INFINITY;
      for (let index = 0; index < Math.min(groups.length, 180); index += 1) {
        if (used.has(index)) continue;
        const candidate = groups[index]!;
        if (evidence.some((shown) => shown.result === candidate.result)) continue;
        if (evidence.some((shown) => sharedInputCount(shown, candidate) > 0)) continue;
        const audit = auditMisCp003Ambiguity(rule.ruleId, context, [...evidence, candidate]);
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
        const ambiguity = auditMisCp003Ambiguity(rule.ruleId, context, evidence);
        if (!ambiguity.accepted) continue;
        const target = groups.find((group, index) =>
          !used.has(index)
          && governedDistractors(rule.ruleId, context, group).length >= 3
          && !evidence.some((shown) => shown.result === group.result)
          && !evidence.some((shown) => sharedInputCount(shown, group) > 0),
        );
        if (target) return { evidence, target, ambiguity };
      }
    }
  }
  throw new Error(`Unable to construct an unambiguous MIS-CP-003 instance for ${rule.candidateId}.`);
}

function ruleStatement(ruleId: MisCp003RuleId, context: MisCp003RuleContext): string {
  if (ruleId === 'SQUARE_INPUT') return 'Square the number.';
  if (ruleId === 'CUBE_INPUT') return 'Cube the number.';
  if (ruleId === 'SQUARE_FIRST_PLUS_SECOND') return 'Square the first number, then add the second number.';
  if (ruleId === 'SQUARE_FIRST_MINUS_SECOND') return 'Square the first number, then subtract the second number.';
  if (ruleId === 'SUM_OF_SQUARES') return 'Square both numbers and add the two squares.';
  if (ruleId === 'DIFFERENCE_OF_SQUARES') return 'Square both numbers and subtract the second square from the first.';
  if (ruleId === 'PRODUCT_PLUS_FIRST_SQUARE') return 'Multiply the two numbers, then add the square of the first number.';
  if (ruleId === 'PRODUCT_PLUS_SECOND_SQUARE') return 'Multiply the two numbers, then add the square of the second number.';
  if (ruleId === 'PAIR_SUM_OR_DIFFERENCE_SQUARE') {
    return context.sign === -1 ? 'Subtract the second number from the first, then square the result.' : 'Add the two numbers, then square the result.';
  }
  return context.sign === -1 ? 'Subtract the second number from the first, then cube the result.' : 'Add the two numbers, then cube the result.';
}

function explainGroup(ruleId: MisCp003RuleId, context: MisCp003RuleContext, group: MisCp003Group): string {
  const first = group.first;
  const second = group.second;
  const result = group.result;
  if (ruleId === 'SQUARE_INPUT') return `${first} × ${first} = ${result}`;
  if (ruleId === 'CUBE_INPUT') return `${first} × ${first} × ${first} = ${result}`;
  if (second == null) return '';

  const squareFirst = first * first;
  const squareSecond = second * second;
  const product = first * second;

  if (ruleId === 'SQUARE_FIRST_PLUS_SECOND') return `${first} × ${first} = ${squareFirst}\n${squareFirst} + ${second} = ${result}`;
  if (ruleId === 'SQUARE_FIRST_MINUS_SECOND') return `${first} × ${first} = ${squareFirst}\n${squareFirst} − ${second} = ${result}`;
  if (ruleId === 'SUM_OF_SQUARES') return `${first} × ${first} = ${squareFirst}\n${second} × ${second} = ${squareSecond}\n${squareFirst} + ${squareSecond} = ${result}`;
  if (ruleId === 'DIFFERENCE_OF_SQUARES') return `${first} × ${first} = ${squareFirst}\n${second} × ${second} = ${squareSecond}\n${squareFirst} − ${squareSecond} = ${result}`;
  if (ruleId === 'PRODUCT_PLUS_FIRST_SQUARE') return `${first} × ${second} = ${product}\n${first} × ${first} = ${squareFirst}\n${product} + ${squareFirst} = ${result}`;
  if (ruleId === 'PRODUCT_PLUS_SECOND_SQUARE') return `${first} × ${second} = ${product}\n${second} × ${second} = ${squareSecond}\n${product} + ${squareSecond} = ${result}`;

  const base = context.sign === -1 ? first - second : first + second;
  const firstStep = context.sign === -1 ? `${first} − ${second} = ${base}` : `${first} + ${second} = ${base}`;
  if (ruleId === 'PAIR_SUM_OR_DIFFERENCE_SQUARE') return `${firstStep}\n${base} × ${base} = ${result}`;
  return `${firstStep}\n${base} × ${base} × ${base} = ${result}`;
}

function renderStem(evidence: readonly MisCp003Group[], target: MisCp003Group): string {
  const unary = target.second == null;
  const rows = [...evidence, target].map((group, index, all) => {
    const isTarget = index === all.length - 1;
    const result = isTarget ? '?' : String(group.result);
    return unary ? `${group.first}   ${result}` : `${group.first}   ${group.second}   ${result}`;
  });
  return ['Find the number that will replace the question mark (?).', '', ...rows].join('\n');
}

export function generateMisCp003Question(
  candidateId: MisCp003CandidateId,
  seed: string | number = 'mis-cp003-v1',
): GeneratedMisCp003Question {
  const rule = misCp003RuleByCandidateId(candidateId);
  const baseSeed = String(seed);
  const contexts = shuffle(rule.contexts, baseSeed + ':contexts');
  let selected:
    | { readonly context: MisCp003RuleContext; readonly evidence: readonly MisCp003Group[]; readonly target: MisCp003Group; readonly ambiguity: MisCp003AmbiguityAudit }
    | undefined;

  for (const context of contexts) {
    try {
      const instance = chooseEvidenceAndTarget(rule, context, baseSeed + ':' + misCp003ContextKey(context));
      selected = { context, ...instance };
      break;
    } catch {
      continue;
    }
  }
  if (!selected) throw new Error(`Unable to generate ${candidateId} for seed ${baseSeed}.`);

  const solverAnswer = independentlyEvaluateMisCp003Rule(rule.ruleId, selected.target.first, selected.target.second, selected.context);
  if (solverAnswer !== selected.target.result) throw new Error('Independent CP003 solver rejected the target answer.');

  const wrong = shuffle(governedDistractors(rule.ruleId, selected.context, selected.target), baseSeed + ':distractors').slice(0, 3);
  if (wrong.length !== 3) throw new Error('MIS-CP-003 requires three misconception-grounded distractors.');
  const correctIndex = hash(baseSeed + ':' + candidateId + ':correct-index') % 4;
  const options: MisCp003Option[] = wrong.map((entry) => ({ ...entry }));
  options.splice(correctIndex, 0, { value: selected.target.result, errorLabel: null });

  const evidenceLines = selected.evidence.flatMap((group, index) => [
    index === 0 ? 'Look at Row 1:' : `Check Row ${index + 1} in the same way:`,
    explainGroup(rule.ruleId, selected.context, group),
    '',
  ]);
  const explanation = [
    'The same rule is used in every row.',
    ruleStatement(rule.ruleId, selected.context),
    '',
    ...evidenceLines,
    'Now apply the same rule to the row with the question mark:',
    explainGroup(rule.ruleId, selected.context, selected.target),
    '',
    `So, ? = ${selected.target.result}.`,
  ].join('\n');

  const solverTrace = [
    ...selected.evidence.map((group) => explainGroup(rule.ruleId, selected.context, group)),
    explainGroup(rule.ruleId, selected.context, selected.target),
  ];
  const numericFingerprint = [...selected.evidence, selected.target]
    .map((group) => `${group.first},${group.second ?? '_'},${group.result}`)
    .join('|');
  const structuralFingerprint = [
    'MIS-CP-003',
    rule.ruleId,
    misCp003ContextKey(selected.context),
    'TABLE_OR_GROUP',
    'RESULT_MISSING',
    `OPERANDS_${rule.operandCount}`,
    `DEPTH_${rule.operationDepth}`,
    `EVIDENCE_${selected.evidence.length}`,
  ].join('|');

  return {
    packageId: 'MIS-001',
    checkpointId: 'MIS-CP-003',
    candidateId,
    provisionalQl: true,
    ruleId: rule.ruleId,
    ruleFamily: rule.label,
    context: selected.context,
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
  };
}

export const MIS_CP003_CANDIDATE_IDS = Object.freeze(MIS_CP003_RULES.map((rule) => rule.candidateId));
