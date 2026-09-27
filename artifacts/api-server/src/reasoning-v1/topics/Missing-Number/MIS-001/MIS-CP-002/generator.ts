import {
  MIS_CP002_RULES,
  misCp002ContextKey,
  misCp002ContextUsesAllInputs,
  misCp002RuleByCandidateId,
  type MisCp002CandidateId,
  type MisCp002RuleContext,
  type MisCp002RuleDefinition,
  type MisCp002RuleId,
} from './rule-definitions';
import {
  auditMisCp002Ambiguity,
  independentlyEvaluateMisCp002Rule,
  independentlyVerifyMisCp002Group,
  type MisCp002AmbiguityAudit,
  type MisCp002Group,
} from './independent-solver';

export interface MisCp002Option {
  readonly value: number;
  readonly errorLabel: string | null;
}

export interface GeneratedMisCp002Question {
  readonly packageId: 'MIS-001';
  readonly checkpointId: 'MIS-CP-002';
  readonly candidateId: MisCp002CandidateId;
  readonly provisionalQl: true;
  readonly ruleId: MisCp002RuleId;
  readonly ruleFamily: string;
  readonly context: MisCp002RuleContext;
  readonly difficulty: 'Easy' | 'Medium';
  readonly renderer: 'TABLE_OR_GROUP';
  readonly stem: string;
  readonly evidenceGroups: readonly MisCp002Group[];
  readonly target: MisCp002Group;
  readonly options: readonly MisCp002Option[];
  readonly correctIndex: number;
  readonly answer: number;
  readonly explanation: string;
  readonly solverTrace: readonly string[];
  readonly ambiguityAudit: MisCp002AmbiguityAudit;
  readonly structuralFingerprint: string;
  readonly numericFingerprint: string;
  readonly operationDepth: 2;
  readonly operandCount: 3;
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
  ruleId: MisCp002RuleId,
  inputs: readonly [number, number, number],
  context: MisCp002RuleContext,
): number | null {
  if (!misCp002ContextUsesAllInputs(context)) return null;
  const [leftRole, rightRole, thirdRole] = context.roles;
  const left = inputs[leftRole];
  const right = inputs[rightRole];
  const third = inputs[thirdRole];

  if (ruleId === 'THREE_INPUT_SUM') return bounded(inputs[0] + inputs[1] + inputs[2]);
  if (ruleId === 'TWO_ADD_ONE_SUBTRACT') return bounded(left + right - third);
  if (ruleId === 'PAIR_PRODUCT_ADJUST_THIRD') {
    return bounded((left * right) + (context.sign ?? 1) * third);
  }
  if (ruleId === 'PAIR_SUM_TIMES_THIRD') return bounded((left + right) * third);
  if (ruleId === 'PAIR_DIFFERENCE_TIMES_THIRD') return bounded((left - right) * third);
  if (ruleId === 'PAIR_PRODUCT_DIVIDE_THIRD') {
    const numerator = left * right;
    return third !== 0 && numerator % third === 0 ? bounded(numerator / third) : null;
  }
  const numerator = left + right;
  return third !== 0 && numerator % third === 0 ? bounded(numerator / third) : null;
}

const validGroupCache = new Map<string, readonly MisCp002Group[]>();

function validGroups(rule: MisCp002RuleDefinition, context: MisCp002RuleContext): readonly MisCp002Group[] {
  const key = rule.ruleId + ':' + misCp002ContextKey(context);
  const cached = validGroupCache.get(key);
  if (cached) return cached;

  const groups: MisCp002Group[] = [];
  for (let first = rule.minInput; first <= rule.maxInput; first += 1) {
    for (let second = rule.minInput; second <= rule.maxInput; second += 1) {
      for (let third = rule.minInput; third <= rule.maxInput; third += 1) {
        if (new Set([first, second, third]).size !== 3) continue;
        const inputs = [first, second, third] as const;
        const result = generatedEvaluate(rule.ruleId, inputs, context);
        if (result == null || inputs.includes(result)) continue;
        if (
          (rule.ruleId === 'PAIR_PRODUCT_DIVIDE_THIRD' || rule.ruleId === 'PAIR_SUM_DIVIDE_THIRD')
          && result === 1
        ) continue;
        const group = { first, second, third, result };
        if (!independentlyVerifyMisCp002Group(rule.ruleId, context, group)) {
          throw new Error('Generator/independent-solver disagreement while constructing a CP002 group.');
        }
        groups.push(group);
      }
    }
  }
  validGroupCache.set(key, groups);
  return groups;
}

function values(group: MisCp002Group): readonly [number, number, number] {
  return [group.first, group.second, group.third];
}

function sharedVisibleInputCount(left: MisCp002Group, right: MisCp002Group): number {
  const leftInputs = new Set([left.first, left.second, left.third]);
  return [right.first, right.second, right.third].filter((value) => leftInputs.has(value)).length;
}

function governedDistractors(
  ruleId: MisCp002RuleId,
  context: MisCp002RuleContext,
  target: MisCp002Group,
): MisCp002Option[] {
  const inputs = values(target);
  const [leftRole, rightRole, thirdRole] = context.roles;
  const left = inputs[leftRole];
  const right = inputs[rightRole];
  const third = inputs[thirdRole];
  const pairSum = left + right;
  const pairProduct = left * right;
  const pairDifference = left - right;
  const totalSum = inputs[0] + inputs[1] + inputs[2];
  const correct = target.result;
  const candidates: MisCp002Option[] = [];

  const add = (value: number | null, errorLabel: string) => {
    if (value == null || !Number.isInteger(value) || value <= 0 || value > 999 || value === correct) return;
    if (candidates.some((entry) => entry.value === value)) return;
    candidates.push({ value, errorLabel });
  };
  const exact = (numerator: number, denominator: number): number | null =>
    denominator !== 0 && numerator % denominator === 0 ? numerator / denominator : null;

  if (ruleId === 'THREE_INPUT_SUM') {
    add(inputs[0] + inputs[1], 'ONE_TERM_OMITTED');
    add(inputs[0] + inputs[1] - inputs[2], 'THIRD_TERM_SUBTRACTED');
    add((inputs[0] + inputs[1]) * inputs[2], 'FINAL_ADD_CHANGED_TO_MULTIPLY');
  } else if (ruleId === 'TWO_ADD_ONE_SUBTRACT') {
    add(left + right + third, 'SUBTRACTION_CHANGED_TO_ADD');
    add(left + right, 'ONE_TERM_OMITTED');
    add(left - right + third, 'WRONG_TERM_SUBTRACTED');
    add(Math.abs(left - third) + right, 'WRONG_PAIR_COMBINED');
  } else if (ruleId === 'PAIR_PRODUCT_ADJUST_THIRD') {
    const sign = context.sign ?? 1;
    add(pairProduct, 'SECOND_STAGE_OMITTED');
    add(pairProduct - sign * third, 'ADJUSTMENT_SIGN_REVERSED');
    add(pairSum + sign * third, 'ADD_USED_INSTEAD_OF_MULTIPLY');
    add((left + third) * right, 'WRONG_PAIR_COMBINED');
  } else if (ruleId === 'PAIR_SUM_TIMES_THIRD') {
    add(pairSum, 'SECOND_STAGE_OMITTED');
    add(pairProduct * third, 'MULTIPLY_USED_IN_FIRST_STAGE');
    add(pairSum + third, 'SECOND_STAGE_ADD_INSTEAD_OF_MULTIPLY');
    add((left + third) * right, 'WRONG_PAIR_COMBINED');
  } else if (ruleId === 'PAIR_DIFFERENCE_TIMES_THIRD') {
    add(pairDifference, 'SECOND_STAGE_OMITTED');
    add((left + right) * third, 'ADD_USED_INSTEAD_OF_SUBTRACT');
    add(pairDifference + third, 'SECOND_STAGE_ADD_INSTEAD_OF_MULTIPLY');
    add((left - third) * right, 'WRONG_PAIR_COMBINED');
  } else if (ruleId === 'PAIR_PRODUCT_DIVIDE_THIRD') {
    add(pairProduct, 'DIVISION_STAGE_OMITTED');
    add(pairProduct * third, 'DIVISION_CHANGED_TO_MULTIPLY');
    add(exact(pairSum, third), 'ADD_USED_INSTEAD_OF_MULTIPLY');
    add(exact(left * third, right), 'WRONG_DIVISOR_ROLE');
  } else if (ruleId === 'PAIR_SUM_DIVIDE_THIRD') {
    add(pairSum, 'DIVISION_STAGE_OMITTED');
    add(pairSum * third, 'DIVISION_CHANGED_TO_MULTIPLY');
    add(exact(pairProduct, third), 'MULTIPLY_USED_INSTEAD_OF_ADD');
    add(exact(left + third, right), 'WRONG_DIVISOR_ROLE');
  }

  add(totalSum, 'ALL_TERMS_ADDED');
  add(inputs[0] * inputs[1], 'THIRD_INPUT_OMITTED_AFTER_PRODUCT');
  add(Math.abs(inputs[0] - inputs[1]) * inputs[2], 'FIRST_PAIR_DIFFERENCE_USED');
  add(inputs[0] + inputs[2], 'SECOND_INPUT_OMITTED');
  return candidates;
}

function chooseEvidenceAndTarget(
  rule: MisCp002RuleDefinition,
  context: MisCp002RuleContext,
  seed: string,
): {
  readonly evidence: readonly MisCp002Group[];
  readonly target: MisCp002Group;
  readonly ambiguity: MisCp002AmbiguityAudit;
} {
  const groups = shuffle(validGroups(rule, context), seed + ':groups');
  if (groups.length < 4) throw new Error('MIS-CP-002 rule domain is too small for repeated-group inference.');

  for (let start = 0; start < Math.min(groups.length, 30); start += 1) {
    const evidence: MisCp002Group[] = [groups[start]!];
    const used = new Set<number>([start]);

    while (evidence.length < 3) {
      let bestIndex = -1;
      let bestSurvivorCount = Number.POSITIVE_INFINITY;
      for (let index = 0; index < Math.min(groups.length, 180); index += 1) {
        if (used.has(index)) continue;
        const candidate = groups[index]!;
        if (evidence.some((shown) => shown.result === candidate.result)) continue;
        if (evidence.some((shown) => sharedVisibleInputCount(shown, candidate) > 1)) continue;
        const audit = auditMisCp002Ambiguity(rule.ruleId, context, [...evidence, candidate]);
        const survivorCount = new Set(audit.matches.map((match) => match.semanticKey)).size;
        if (survivorCount < bestSurvivorCount) {
          bestIndex = index;
          bestSurvivorCount = survivorCount;
        }
        if (survivorCount === 1) break;
      }
      if (bestIndex < 0) break;
      evidence.push(groups[bestIndex]!);
      used.add(bestIndex);

      if (evidence.length >= 2) {
        const ambiguity = auditMisCp002Ambiguity(rule.ruleId, context, evidence);
        if (!ambiguity.accepted) continue;
        const target = groups.find((group, index) =>
          !used.has(index)
          && governedDistractors(rule.ruleId, context, group).length >= 3
          && !evidence.some((shown) => shown.result === group.result)
          && !evidence.some((shown) => sharedVisibleInputCount(shown, group) > 1),
        );
        if (target) return { evidence, target, ambiguity };
      }
    }
  }
  throw new Error(`Unable to construct an unambiguous MIS-CP-002 instance for ${rule.candidateId}.`);
}

function positionName(index: number): string {
  return index === 0 ? 'first' : index === 1 ? 'second' : 'third';
}

function ruleStatement(ruleId: MisCp002RuleId, context: MisCp002RuleContext): string {
  const [leftRole, rightRole, thirdRole] = context.roles;
  const left = positionName(leftRole);
  const right = positionName(rightRole);
  const third = positionName(thirdRole);
  if (ruleId === 'THREE_INPUT_SUM') return 'Add all three numbers.';
  if (ruleId === 'TWO_ADD_ONE_SUBTRACT') return `Add the ${left} and ${right} numbers, then subtract the ${third} number.`;
  if (ruleId === 'PAIR_PRODUCT_ADJUST_THIRD') {
    return context.sign === -1
      ? `Multiply the ${left} and ${right} numbers, then subtract the ${third} number.`
      : `Multiply the ${left} and ${right} numbers, then add the ${third} number.`;
  }
  if (ruleId === 'PAIR_SUM_TIMES_THIRD') return `Add the ${left} and ${right} numbers, then multiply by the ${third} number.`;
  if (ruleId === 'PAIR_DIFFERENCE_TIMES_THIRD') return `Subtract the ${right} number from the ${left} number, then multiply by the ${third} number.`;
  if (ruleId === 'PAIR_PRODUCT_DIVIDE_THIRD') return `Multiply the ${left} and ${right} numbers, then divide by the ${third} number.`;
  return `Add the ${left} and ${right} numbers, then divide by the ${third} number.`;
}

function explainGroup(
  ruleId: MisCp002RuleId,
  context: MisCp002RuleContext,
  group: MisCp002Group,
): string {
  const inputs = values(group);
  const [leftRole, rightRole, thirdRole] = context.roles;
  const left = inputs[leftRole];
  const right = inputs[rightRole];
  const third = inputs[thirdRole];
  const result = group.result;

  if (ruleId === 'THREE_INPUT_SUM') return `${inputs[0]} + ${inputs[1]} + ${inputs[2]} = ${result}`;
  if (ruleId === 'TWO_ADD_ONE_SUBTRACT') {
    const firstStep = left + right;
    return `${left} + ${right} = ${firstStep}\n${firstStep} − ${third} = ${result}`;
  }
  if (ruleId === 'PAIR_PRODUCT_ADJUST_THIRD') {
    const firstStep = left * right;
    return context.sign === -1
      ? `${left} × ${right} = ${firstStep}\n${firstStep} − ${third} = ${result}`
      : `${left} × ${right} = ${firstStep}\n${firstStep} + ${third} = ${result}`;
  }
  if (ruleId === 'PAIR_SUM_TIMES_THIRD') {
    const firstStep = left + right;
    return `${left} + ${right} = ${firstStep}\n${firstStep} × ${third} = ${result}`;
  }
  if (ruleId === 'PAIR_DIFFERENCE_TIMES_THIRD') {
    const firstStep = left - right;
    return `${left} − ${right} = ${firstStep}\n${firstStep} × ${third} = ${result}`;
  }
  if (ruleId === 'PAIR_PRODUCT_DIVIDE_THIRD') {
    const firstStep = left * right;
    return `${left} × ${right} = ${firstStep}\n${firstStep} ÷ ${third} = ${result}`;
  }
  const firstStep = left + right;
  return `${left} + ${right} = ${firstStep}\n${firstStep} ÷ ${third} = ${result}`;
}

function deriveDifficulty(rule: MisCp002RuleDefinition, _evidenceCount: number): 'Easy' | 'Medium' {
  if (rule.ruleId === 'THREE_INPUT_SUM' || rule.ruleId === 'TWO_ADD_ONE_SUBTRACT') return 'Easy';
  return 'Medium';
}

function renderStem(evidence: readonly MisCp002Group[], target: MisCp002Group): string {
  const rows = [
    ...evidence.map((group) => `${group.first}   ${group.second}   ${group.third}   ${group.result}`),
    `${target.first}   ${target.second}   ${target.third}   ?`,
  ];
  return ['Find the number that will replace the question mark (?).', '', ...rows].join('\n');
}

function structuralFingerprint(
  rule: MisCp002RuleDefinition,
  context: MisCp002RuleContext,
  evidenceCount: number,
): string {
  return [
    'MIS-CP-002',
    rule.ruleId,
    misCp002ContextKey(context),
    'TABLE_OR_GROUP',
    'RESULT_MISSING',
    `EVIDENCE_${evidenceCount}`,
    'OPERANDS_3',
    'DEPTH_2',
  ].join('|');
}

export function generateMisCp002Question(
  candidateId: MisCp002CandidateId,
  seed: string | number = 'mis-cp002-v1',
): GeneratedMisCp002Question {
  const rule = misCp002RuleByCandidateId(candidateId);
  const baseSeed = String(seed);
  const contexts = shuffle(rule.contexts, baseSeed + ':contexts');
  let selected:
    | {
        readonly context: MisCp002RuleContext;
        readonly evidence: readonly MisCp002Group[];
        readonly target: MisCp002Group;
        readonly ambiguity: MisCp002AmbiguityAudit;
      }
    | undefined;

  for (const context of contexts) {
    try {
      const instance = chooseEvidenceAndTarget(rule, context, baseSeed + ':' + misCp002ContextKey(context));
      selected = { context, ...instance };
      break;
    } catch {
      continue;
    }
  }
  if (!selected) throw new Error(`Unable to generate ${candidateId} for seed ${baseSeed}.`);

  const targetInputs = values(selected.target);
  const solverAnswer = independentlyEvaluateMisCp002Rule(rule.ruleId, targetInputs, selected.context);
  if (solverAnswer !== selected.target.result) {
    throw new Error('Independent CP002 solver rejected the target answer.');
  }

  const wrong = shuffle(
    governedDistractors(rule.ruleId, selected.context, selected.target),
    baseSeed + ':distractors',
  ).slice(0, 3);
  if (wrong.length !== 3) throw new Error('MIS-CP-002 requires three misconception-grounded distractors.');

  const correctIndex = hash(baseSeed + ':' + candidateId + ':correct-index') % 4;
  const options: MisCp002Option[] = wrong.map((entry) => ({ ...entry }));
  options.splice(correctIndex, 0, { value: selected.target.result, errorLabel: null });
  if (new Set(options.map((option) => option.value)).size !== 4) {
    throw new Error('MIS-CP-002 options must be unique.');
  }

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
    .map((group) => `${group.first},${group.second},${group.third},${group.result}`)
    .join('|');

  return {
    packageId: 'MIS-001',
    checkpointId: 'MIS-CP-002',
    candidateId,
    provisionalQl: true,
    ruleId: rule.ruleId,
    ruleFamily: rule.label,
    context: selected.context,
    difficulty: deriveDifficulty(rule, selected.evidence.length),
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
    structuralFingerprint: structuralFingerprint(rule, selected.context, selected.evidence.length),
    numericFingerprint,
    operationDepth: 2,
    operandCount: 3,
    groupCount: selected.evidence.length + 1,
    missingPosition: 'RESULT_MISSING',
  };
}

export const MIS_CP002_CANDIDATE_IDS = Object.freeze(
  MIS_CP002_RULES.map((rule) => rule.candidateId),
);
