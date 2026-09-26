import {
  MIS_CP001_RULES,
  misCp001RuleByCandidateId,
  type MisCp001CandidateId,
  type MisCp001RuleContext,
  type MisCp001RuleDefinition,
  type MisCp001RuleId,
} from './rule-definitions';
import {
  auditMisCp001Ambiguity,
  independentlyEvaluateMisCp001Rule,
  independentlyVerifyMisCp001Group,
  type MisCp001AmbiguityAudit,
  type MisNumberGroup,
} from './independent-solver';

export interface MisCp001Option {
  readonly value: number;
  readonly errorLabel: string | null;
}

export interface GeneratedMisCp001Question {
  readonly packageId: 'MIS-001';
  readonly checkpointId: 'MIS-CP-001';
  readonly candidateId: MisCp001CandidateId;
  readonly provisionalQl: true;
  readonly ruleId: MisCp001RuleId;
  readonly ruleFamily: string;
  readonly context: MisCp001RuleContext;
  readonly difficulty: 'Easy' | 'Medium';
  readonly renderer: 'TABLE_OR_GROUP';
  readonly stem: string;
  readonly evidenceGroups: readonly MisNumberGroup[];
  readonly target: MisNumberGroup;
  readonly options: readonly MisCp001Option[];
  readonly correctIndex: number;
  readonly answer: number;
  readonly explanation: string;
  readonly solverTrace: readonly string[];
  readonly ambiguityAudit: MisCp001AmbiguityAudit;
  readonly structuralFingerprint: string;
  readonly numericFingerprint: string;
  readonly operationDepth: 1 | 2;
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

function generatedEvaluate(
  ruleId: MisCp001RuleId,
  first: number,
  second: number,
  context: MisCp001RuleContext,
): number | null {
  const k = context.k ?? 0;
  let value: number | null = null;
  if (ruleId === 'SUM') value = first + second;
  else if (ruleId === 'ABS_DIFFERENCE') value = Math.abs(first - second);
  else if (ruleId === 'PRODUCT') value = first * second;
  else if (ruleId === 'EXACT_DIVISION') value = second !== 0 && first % second === 0 ? first / second : null;
  else if (ruleId === 'SUM_PLUS_CONSTANT') value = first + second + k;
  else if (ruleId === 'PRODUCT_PLUS_CONSTANT') value = first * second + k;
  else if (ruleId === 'PRODUCT_MINUS_CONSTANT') value = first * second - k;
  else if (ruleId === 'DIFFERENCE_PLUS_CONSTANT') value = Math.abs(first - second) + k;
  return value != null && Number.isInteger(value) && value > 0 && value <= 999 ? value : null;
}

function validGroups(rule: MisCp001RuleDefinition, context: MisCp001RuleContext): MisNumberGroup[] {
  const groups: MisNumberGroup[] = [];
  for (let first = rule.minInput; first <= rule.maxInput; first += 1) {
    for (let second = rule.minInput; second <= rule.maxInput; second += 1) {
      if ((rule.ruleId === 'ABS_DIFFERENCE' || rule.ruleId === 'DIFFERENCE_PLUS_CONSTANT') && first === second) continue;
      if (rule.ruleId === 'EXACT_DIVISION' && (first <= second || first % second !== 0)) continue;
      const result = generatedEvaluate(rule.ruleId, first, second, context);
      if (result == null || result === first || result === second) continue;
      const candidate = { first, second, result };
      if (!independentlyVerifyMisCp001Group(rule.ruleId, context, candidate)) {
        throw new Error('Generator/independent-solver disagreement while constructing a complete group.');
      }
      groups.push(candidate);
    }
  }
  return groups;
}

function misconceptionCandidates(
  ruleId: MisCp001RuleId,
  context: MisCp001RuleContext,
  target: MisNumberGroup,
): MisCp001Option[] {
  const { first: a, second: b, result: correct } = target;
  const k = context.k ?? 0;
  const product = a * b;
  const sum = a + b;
  const difference = Math.abs(a - b);
  const candidates: MisCp001Option[] = [];

  const add = (value: number, errorLabel: string) => {
    if (!Number.isInteger(value) || value < 0 || value > 999 || value === correct) return;
    if (candidates.some((entry) => entry.value === value)) return;
    candidates.push({ value, errorLabel });
  };

  if (ruleId === 'SUM') {
    add(product, 'MULTIPLY_INSTEAD_OF_ADD');
    add(difference, 'SUBTRACTION_INSTEAD_OF_ADD');
    add(a * 2, 'FIRST_INPUT_DOUBLED');
  } else if (ruleId === 'ABS_DIFFERENCE') {
    add(sum, 'ADD_INSTEAD_OF_DIFFERENCE');
    add(product, 'MULTIPLY_INSTEAD_OF_DIFFERENCE');
    add(Math.min(a, b), 'SMALLER_INPUT_USED_DIRECTLY');
  } else if (ruleId === 'PRODUCT') {
    add(sum, 'ADD_INSTEAD_OF_MULTIPLY');
    add(difference, 'SUBTRACTION_INSTEAD_OF_MULTIPLY');
    add(a * a, 'FIRST_INPUT_SQUARED');
  } else if (ruleId === 'EXACT_DIVISION') {
    add(product, 'MULTIPLY_INSTEAD_OF_DIVIDE');
    add(a - b, 'SUBTRACTION_INSTEAD_OF_DIVIDE');
    add(sum, 'ADD_INSTEAD_OF_DIVIDE');
  } else if (ruleId === 'SUM_PLUS_CONSTANT') {
    add(sum, 'CONSTANT_OMITTED');
    add(sum - k, 'CONSTANT_SIGN_REVERSED');
    add(product + k, 'MULTIPLY_INSTEAD_OF_ADD');
  } else if (ruleId === 'PRODUCT_PLUS_CONSTANT') {
    add(product, 'CONSTANT_OMITTED');
    add(product - k, 'CONSTANT_SIGN_REVERSED');
    add(sum + k, 'ADD_INSTEAD_OF_MULTIPLY');
  } else if (ruleId === 'PRODUCT_MINUS_CONSTANT') {
    add(product, 'CONSTANT_OMITTED');
    add(product + k, 'CONSTANT_SIGN_REVERSED');
    add(sum - k, 'ADD_INSTEAD_OF_MULTIPLY');
  } else if (ruleId === 'DIFFERENCE_PLUS_CONSTANT') {
    add(difference, 'CONSTANT_OMITTED');
    add(difference - k, 'CONSTANT_SIGN_REVERSED');
    add(sum + k, 'ADD_INSTEAD_OF_DIFFERENCE');
  }

  const governedFallbacks: readonly [number, string][] = [
    [sum, 'ADD_INSTEAD_OF_INTENDED_RULE'],
    [product, 'MULTIPLY_INSTEAD_OF_INTENDED_RULE'],
    [difference, 'DIFFERENCE_INSTEAD_OF_INTENDED_RULE'],
    [a + k, 'SECOND_INPUT_OMITTED'],
    [b + k, 'FIRST_INPUT_OMITTED'],
    [Math.max(a, b), 'LARGER_INPUT_USED_DIRECTLY'],
  ];
  for (const [value, errorLabel] of governedFallbacks) add(value, errorLabel);
  return candidates;
}

function chooseEvidenceAndTarget(
  rule: MisCp001RuleDefinition,
  context: MisCp001RuleContext,
  seed: string,
): {
  evidence: readonly MisNumberGroup[];
  target: MisNumberGroup;
  ambiguity: MisCp001AmbiguityAudit;
} {
  const groups = shuffle(validGroups(rule, context), seed + ':groups');
  if (groups.length < 4) throw new Error('MIS-CP-001 rule domain is too small for repeated-group inference.');

  for (let start = 0; start < Math.min(groups.length, 24); start += 1) {
    const evidence: MisNumberGroup[] = [groups[start]!];
    const used = new Set([start]);

    while (evidence.length < 3) {
      let bestIndex = -1;
      let bestSurvivorCount = Number.POSITIVE_INFINITY;
      for (let index = 0; index < Math.min(groups.length, 120); index += 1) {
        if (used.has(index)) continue;
        const audit = auditMisCp001Ambiguity(rule.ruleId, context, [...evidence, groups[index]!]);
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
        const audit = auditMisCp001Ambiguity(rule.ruleId, context, evidence);
        if (audit.accepted) {
          const target = groups.find((group, index) =>
            !used.has(index)
            && misconceptionCandidates(rule.ruleId, context, group).length >= 3
            && !evidence.some((item) => item.result === group.result),
          );
          if (target) return { evidence, target, ambiguity: audit };
        }
      }
    }
  }
  throw new Error(`Unable to construct an unambiguous MIS-CP-001 instance for ${rule.candidateId}.`);
}

function explainGroup(ruleId: MisCp001RuleId, context: MisCp001RuleContext, group: MisNumberGroup): string {
  const { first: a, second: b, result: r } = group;
  const k = context.k ?? 0;
  if (ruleId === 'SUM') return `${a} + ${b} = ${r}`;
  if (ruleId === 'ABS_DIFFERENCE') return `|${a} − ${b}| = ${r}`;
  if (ruleId === 'PRODUCT') return `${a} × ${b} = ${r}`;
  if (ruleId === 'EXACT_DIVISION') return `${a} ÷ ${b} = ${r}`;
  if (ruleId === 'SUM_PLUS_CONSTANT') return `${a} + ${b} + ${k} = ${r}`;
  if (ruleId === 'PRODUCT_PLUS_CONSTANT') return `(${a} × ${b}) + ${k} = ${r}`;
  if (ruleId === 'PRODUCT_MINUS_CONSTANT') return `(${a} × ${b}) − ${k} = ${r}`;
  return `|${a} − ${b}| + ${k} = ${r}`;
}

function renderStem(evidence: readonly MisNumberGroup[], target: MisNumberGroup): string {
  const rows = [...evidence.map((group) => `${group.first}   ${group.second}   ${group.result}`), `${target.first}   ${target.second}   ?`];
  return ['Find the number that will replace the question mark (?).', '', ...rows].join('\n');
}

function structuralFingerprint(rule: MisCp001RuleDefinition, evidenceCount: number): string {
  return [
    'MIS-CP-001',
    rule.ruleId,
    'TABLE_OR_GROUP',
    'RESULT_MISSING',
    `EVIDENCE_${evidenceCount}`,
    `DEPTH_${rule.operationDepth}`,
  ].join('|');
}

export function generateMisCp001Question(
  candidateId: MisCp001CandidateId,
  seed: string | number = 'mis-cp001-v1',
): GeneratedMisCp001Question {
  const rule = misCp001RuleByCandidateId(candidateId);
  const baseSeed = String(seed);
  const contexts = shuffle(rule.contexts, baseSeed + ':contexts');
  let selected:
    | {
        context: MisCp001RuleContext;
        evidence: readonly MisNumberGroup[];
        target: MisNumberGroup;
        ambiguity: MisCp001AmbiguityAudit;
      }
    | undefined;

  for (const context of contexts) {
    try {
      const instance = chooseEvidenceAndTarget(rule, context, baseSeed + ':' + String(context.k ?? 'none'));
      selected = { context, ...instance };
      break;
    } catch {
      continue;
    }
  }
  if (!selected) throw new Error(`Unable to generate ${candidateId} for seed ${baseSeed}.`);

  const solverAnswer = independentlyEvaluateMisCp001Rule(
    rule.ruleId,
    selected.target.first,
    selected.target.second,
    selected.context,
  );
  if (solverAnswer !== selected.target.result) throw new Error('Independent solver rejected the target answer.');

  const wrong = shuffle(
    misconceptionCandidates(rule.ruleId, selected.context, selected.target),
    baseSeed + ':distractors',
  ).slice(0, 3);
  if (wrong.length !== 3) throw new Error('MIS-CP-001 requires three misconception-grounded distractors.');

  const correctIndex = hash(baseSeed + ':' + candidateId + ':correct-index') % 4;
  const options: MisCp001Option[] = wrong.map((entry) => ({ ...entry }));
  options.splice(correctIndex, 0, { value: selected.target.result, errorLabel: null });
  if (new Set(options.map((option) => option.value)).size !== 4) throw new Error('MIS-CP-001 options must be unique.');

  const ruleLine = selected.context.k == null
    ? `The same rule is used in each row: ${rule.label}.`
    : `The same rule is used in each row. The constant is ${selected.context.k}.`;
  const evidenceLines = selected.evidence.map((group, index) =>
    `Row ${index + 1}: ${explainGroup(rule.ruleId, selected.context, group)}`,
  );
  const targetLine = `Target row: ${explainGroup(rule.ruleId, selected.context, selected.target)}`;
  const explanation = [
    ruleLine,
    '',
    ...evidenceLines,
    '',
    targetLine,
    '',
    `Therefore, the missing number is ${selected.target.result}.`,
  ].join('\n');

  const solverTrace = [
    ...selected.evidence.map((group) => explainGroup(rule.ruleId, selected.context, group)),
    explainGroup(rule.ruleId, selected.context, selected.target),
  ];
  const numericFingerprint = [...selected.evidence, selected.target]
    .map((group) => `${group.first},${group.second},${group.result}`)
    .join('|');

  return {
    packageId: 'MIS-001',
    checkpointId: 'MIS-CP-001',
    candidateId,
    provisionalQl: true,
    ruleId: rule.ruleId,
    ruleFamily: rule.label,
    context: selected.context,
    difficulty: rule.difficulty,
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
    structuralFingerprint: structuralFingerprint(rule, selected.evidence.length),
    numericFingerprint,
    operationDepth: rule.operationDepth,
    groupCount: selected.evidence.length + 1,
    missingPosition: 'RESULT_MISSING',
  };
}

export const MIS_CP001_CANDIDATE_IDS = Object.freeze(
  MIS_CP001_RULES.map((rule) => rule.candidateId),
);
