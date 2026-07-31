export const SER_CP004_TEMPORARY_TEMPLATE_IDS = Array.from(
  { length: 28 },
  (_, index) => `SER-CP-004-TMP-${String(index + 1).padStart(3, "0")}`,
) as readonly SerCp004TemporaryTemplateId[];

export type SerCp004TemporaryTemplateId = `SER-CP-004-TMP-${string}`;

export const SER_CP004_RULE_IDS = [
  "CONSECUTIVE_SQUARES",
  "CONSECUTIVE_CUBES",
  "FIXED_BASE_CONSECUTIVE_POWERS",
  "CONSECUTIVE_PRIMES",
  "TRIANGULAR_NUMBERS",
  "FACTORIAL_SEQUENCE",
  "ADD_PREVIOUS_TWO_RECURRENCE",
] as const;

export type SerCp004RuleId = (typeof SER_CP004_RULE_IDS)[number];

export type SerCp004TaskKind =
  | "NEXT_TERM"
  | "MISSING_TERM"
  | "PREVIOUS_TERM"
  | "WRONG_TERM";

export type SerCp004Difficulty = "EASY" | "MEDIUM" | "HARD";

export type SerCp004OwnershipDisposition =
  | "PROVISIONAL_RETAIN_CP004"
  | "PROVISIONAL_REASSIGN_CP003"
  | "PROVISIONAL_REASSIGN_CP002";

export interface SerCp004Template {
  readonly temporaryTemplateId: SerCp004TemporaryTemplateId;
  readonly candidateRuleId: SerCp004RuleId;
  readonly taskKind: SerCp004TaskKind;
  readonly answerSemantic: "TERM_VALUE" | "WRONG_DISPLAYED_TERM";
  readonly ownershipDisposition: SerCp004OwnershipDisposition;
  readonly provisionalOwnerCheckpoint: "SER-CP-002" | "SER-CP-003" | "SER-CP-004";
}

const TASKS = [
  "NEXT_TERM",
  "MISSING_TERM",
  "PREVIOUS_TERM",
  "WRONG_TERM",
] as const;

function ownershipFor(ruleId: SerCp004RuleId): Pick<
  SerCp004Template,
  "ownershipDisposition" | "provisionalOwnerCheckpoint"
> {
  if (ruleId === "FIXED_BASE_CONSECUTIVE_POWERS") {
    return {
      ownershipDisposition: "PROVISIONAL_REASSIGN_CP002",
      provisionalOwnerCheckpoint: "SER-CP-002",
    };
  }
  if (
    ruleId === "CONSECUTIVE_SQUARES"
    || ruleId === "CONSECUTIVE_CUBES"
    || ruleId === "TRIANGULAR_NUMBERS"
  ) {
    return {
      ownershipDisposition: "PROVISIONAL_REASSIGN_CP003",
      provisionalOwnerCheckpoint: "SER-CP-003",
    };
  }
  return {
    ownershipDisposition: "PROVISIONAL_RETAIN_CP004",
    provisionalOwnerCheckpoint: "SER-CP-004",
  };
}

export const SER_CP004_TEMPORARY_TEMPLATES: readonly SerCp004Template[] =
  SER_CP004_TEMPORARY_TEMPLATE_IDS.map((temporaryTemplateId, index) => {
    const candidateRuleId = SER_CP004_RULE_IDS[Math.floor(index / 4)]!;
    const taskKind = TASKS[index % 4]!;
    return {
      temporaryTemplateId,
      candidateRuleId,
      taskKind,
      answerSemantic:
        taskKind === "WRONG_TERM" ? "WRONG_DISPLAYED_TERM" : "TERM_VALUE",
      ...ownershipFor(candidateRuleId),
    };
  });

export interface SerCp004HiddenState {
  readonly parameterKey: string;
  readonly canonicalSequence: readonly number[];
  readonly targetIndex: number;
  readonly corruptedValue: number | null;
  readonly correctReplacement: number;
}

export interface SerCp004Explanation {
  readonly ruleStatement: string;
  readonly working: readonly string[];
  readonly conclusion: string;
  readonly trapAnalyses: readonly string[];
}

export interface SerCp004Question {
  readonly questionId: string;
  readonly packageId: "SER-001";
  readonly checkpointId: "SER-CP-004";
  readonly temporaryTemplateId: SerCp004TemporaryTemplateId;
  readonly permanentQlId: null;
  readonly candidateRuleId: SerCp004RuleId;
  readonly taskKind: SerCp004TaskKind;
  readonly solveMode: "INFER_SPECIAL_NUMBER_OR_RECURRENCE_SEQUENCE";
  readonly answerSemantic: "TERM_VALUE" | "WRONG_DISPLAYED_TERM";
  readonly ownershipDisposition: SerCp004OwnershipDisposition;
  readonly provisionalOwnerCheckpoint: "SER-CP-002" | "SER-CP-003" | "SER-CP-004";
  readonly language: "en-IN";
  readonly difficulty: SerCp004Difficulty;
  readonly seed: number;
  readonly stem: string;
  readonly sequence: readonly (number | null)[];
  readonly options: readonly number[];
  readonly correctAnswer: number;
  readonly correctIndex: number;
  readonly mathematicalFingerprint: string;
  readonly explanation: SerCp004Explanation;
  readonly hiddenState: SerCp004HiddenState;
  readonly lifecycle: {
    readonly maturity: "OPEN_EXECUTABLE_DISCOVERY";
    readonly sourceSaturation: "OPEN";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export interface SerCp004IndependentSolution {
  readonly answer: number;
  readonly candidateRuleId: SerCp004RuleId;
  readonly parameterKey: string;
  readonly targetIndex: number;
  readonly correctReplacement: number;
  readonly candidateCount: number;
}

interface Candidate {
  readonly candidateRuleId: SerCp004RuleId;
  readonly parameterKey: string;
  readonly projected: readonly number[];
  readonly mismatches: readonly number[];
}

interface GeneratedCanonical {
  readonly parameterKey: string;
  readonly sequence: readonly number[];
}

function assertPositiveSeed(seed: number): void {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`SER-CP-004 seed must be a positive integer; received ${seed}`);
  }
}

function templateFor(
  temporaryTemplateId: SerCp004TemporaryTemplateId,
): SerCp004Template {
  const template = SER_CP004_TEMPORARY_TEMPLATES.find(
    (entry) => entry.temporaryTemplateId === temporaryTemplateId,
  );
  if (!template) {
    throw new Error(`Unknown SER-CP-004 temporary template: ${temporaryTemplateId}`);
  }
  return template;
}

function createPrng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function integer(next: () => number, minimum: number, maximum: number): number {
  return minimum + Math.floor(next() * (maximum - minimum + 1));
}

function difficultyFor(seed: number, templateIndex: number): SerCp004Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[
    (seed + templateIndex) % 3
  ]!;
}

function factorial(value: number): number {
  let result = 1;
  for (let factor = 2; factor <= value; factor += 1) result *= factor;
  return result;
}

function triangular(value: number): number {
  return (value * (value + 1)) / 2;
}

function firstPrimes(count: number): number[] {
  const primes: number[] = [];
  for (let candidate = 2; primes.length < count; candidate += 1) {
    let prime = true;
    for (let divisor = 2; divisor * divisor <= candidate; divisor += 1) {
      if (candidate % divisor === 0) {
        prime = false;
        break;
      }
    }
    if (prime) primes.push(candidate);
  }
  return primes;
}

const PRIME_POOL = firstPrimes(180);

function projectRecurrence(first: number, second: number, length: number): number[] {
  const result = [first, second];
  while (result.length < length) {
    result.push(result[result.length - 1]! + result[result.length - 2]!);
  }
  return result.slice(0, length);
}

function generateCanonical(
  ruleId: SerCp004RuleId,
  difficulty: SerCp004Difficulty,
  next: () => number,
): GeneratedCanonical {
  const length = difficulty === "EASY" ? 7 : difficulty === "MEDIUM" ? 8 : 9;
  switch (ruleId) {
    case "CONSECUTIVE_SQUARES": {
      const start = integer(next, difficulty === "EASY" ? 1 : 3, difficulty === "HARD" ? 16 : 12);
      return {
        parameterKey: `start=${start}`,
        sequence: Array.from({ length }, (_, index) => (start + index) ** 2),
      };
    }
    case "CONSECUTIVE_CUBES": {
      const start = integer(next, 1, difficulty === "HARD" ? 8 : 6);
      return {
        parameterKey: `start=${start}`,
        sequence: Array.from({ length }, (_, index) => (start + index) ** 3),
      };
    }
    case "FIXED_BASE_CONSECUTIVE_POWERS": {
      const base = integer(next, 2, difficulty === "HARD" ? 6 : 5);
      const exponentStart = integer(next, 0, difficulty === "EASY" ? 2 : 4);
      return {
        parameterKey: `base=${base};exponentStart=${exponentStart}`,
        sequence: Array.from(
          { length },
          (_, index) => base ** (exponentStart + index),
        ),
      };
    }
    case "CONSECUTIVE_PRIMES": {
      const startIndex = integer(
        next,
        difficulty === "EASY" ? 0 : 8,
        difficulty === "HARD" ? 90 : 55,
      );
      return {
        parameterKey: `primeIndex=${startIndex}`,
        sequence: PRIME_POOL.slice(startIndex, startIndex + length),
      };
    }
    case "TRIANGULAR_NUMBERS": {
      const start = integer(next, 1, difficulty === "HARD" ? 24 : 16);
      return {
        parameterKey: `start=${start}`,
        sequence: Array.from({ length }, (_, index) => triangular(start + index)),
      };
    }
    case "FACTORIAL_SEQUENCE": {
      const start = integer(next, 1, difficulty === "HARD" ? 3 : 2);
      const boundedLength = Math.min(length, 10 - start);
      return {
        parameterKey: `start=${start}`,
        sequence: Array.from(
          { length: boundedLength },
          (_, index) => factorial(start + index),
        ),
      };
    }
    case "ADD_PREVIOUS_TWO_RECURRENCE": {
      const first = integer(next, 1, difficulty === "EASY" ? 8 : 24);
      const second = first + integer(next, 1, difficulty === "HARD" ? 18 : 10);
      return {
        parameterKey: `first=${first};second=${second}`,
        sequence: projectRecurrence(first, second, length),
      };
    }
  }
}

function mismatchIndexes(
  sequence: readonly (number | null)[],
  projected: readonly number[],
): number[] {
  const mismatches: number[] = [];
  for (let index = 0; index < sequence.length; index += 1) {
    const displayed = sequence[index];
    if (displayed != null && displayed !== projected[index]) mismatches.push(index);
  }
  return mismatches;
}

function addCandidate(
  map: Map<string, Candidate>,
  sequence: readonly (number | null)[],
  allowedMismatchCount: 0 | 1,
  candidateRuleId: SerCp004RuleId,
  parameterKey: string,
  projected: readonly number[],
): void {
  if (
    projected.length !== sequence.length
    || projected.some(
      (value) => !Number.isSafeInteger(value) || Math.abs(value) > 2_000_000,
    )
  ) {
    return;
  }
  const mismatches = mismatchIndexes(sequence, projected);
  if (mismatches.length !== allowedMismatchCount) return;
  map.set(`${candidateRuleId}|${parameterKey}`, {
    candidateRuleId,
    parameterKey,
    projected,
    mismatches,
  });
}

function recurrenceCoefficients(length: number): readonly [number, number][] {
  const fromFirst = projectRecurrence(1, 0, length);
  const fromSecond = projectRecurrence(0, 1, length);
  return fromFirst.map((value, index) => [value, fromSecond[index]!] as const);
}

function inferCandidates(
  sequence: readonly (number | null)[],
  allowedMismatchCount: 0 | 1,
): Candidate[] {
  const candidates = new Map<string, Candidate>();
  const length = sequence.length;

  for (let start = 1; start <= 120; start += 1) {
    addCandidate(
      candidates,
      sequence,
      allowedMismatchCount,
      "CONSECUTIVE_SQUARES",
      `start=${start}`,
      Array.from({ length }, (_, index) => (start + index) ** 2),
    );
  }
  for (let start = 1; start <= 50; start += 1) {
    addCandidate(
      candidates,
      sequence,
      allowedMismatchCount,
      "CONSECUTIVE_CUBES",
      `start=${start}`,
      Array.from({ length }, (_, index) => (start + index) ** 3),
    );
  }
  for (let base = 2; base <= 9; base += 1) {
    for (let exponentStart = 0; exponentStart <= 10; exponentStart += 1) {
      addCandidate(
        candidates,
        sequence,
        allowedMismatchCount,
        "FIXED_BASE_CONSECUTIVE_POWERS",
        `base=${base};exponentStart=${exponentStart}`,
        Array.from({ length }, (_, index) => base ** (exponentStart + index)),
      );
    }
  }
  for (let startIndex = 0; startIndex <= PRIME_POOL.length - length; startIndex += 1) {
    addCandidate(
      candidates,
      sequence,
      allowedMismatchCount,
      "CONSECUTIVE_PRIMES",
      `primeIndex=${startIndex}`,
      PRIME_POOL.slice(startIndex, startIndex + length),
    );
  }
  for (let start = 1; start <= 150; start += 1) {
    addCandidate(
      candidates,
      sequence,
      allowedMismatchCount,
      "TRIANGULAR_NUMBERS",
      `start=${start}`,
      Array.from({ length }, (_, index) => triangular(start + index)),
    );
  }
  for (let start = 1; start <= 12; start += 1) {
    addCandidate(
      candidates,
      sequence,
      allowedMismatchCount,
      "FACTORIAL_SEQUENCE",
      `start=${start}`,
      Array.from({ length }, (_, index) => factorial(start + index)),
    );
  }

  const visibleIndexes = sequence
    .map((value, index) => (value == null ? -1 : index))
    .filter((index) => index >= 0);
  const coefficients = recurrenceCoefficients(length);
  const pairKeys = new Set<string>();
  for (let left = 0; left < visibleIndexes.length; left += 1) {
    for (let right = left + 1; right < visibleIndexes.length; right += 1) {
      const leftIndex = visibleIndexes[left]!;
      const rightIndex = visibleIndexes[right]!;
      const [a1, b1] = coefficients[leftIndex]!;
      const [a2, b2] = coefficients[rightIndex]!;
      const determinant = a1 * b2 - a2 * b1;
      if (determinant === 0) continue;
      const leftValue = sequence[leftIndex]! as number;
      const rightValue = sequence[rightIndex]! as number;
      const firstNumerator = leftValue * b2 - rightValue * b1;
      const secondNumerator = a1 * rightValue - a2 * leftValue;
      if (firstNumerator % determinant !== 0 || secondNumerator % determinant !== 0) {
        continue;
      }
      const first = firstNumerator / determinant;
      const second = secondNumerator / determinant;
      if (
        !Number.isSafeInteger(first)
        || !Number.isSafeInteger(second)
        || Math.abs(first) > 10_000
        || Math.abs(second) > 10_000
        || (first === 0 && second === 0)
      ) {
        continue;
      }
      pairKeys.add(`${first}:${second}`);
    }
  }
  for (const key of pairKeys) {
    const [first, second] = key.split(":").map(Number) as [number, number];
    addCandidate(
      candidates,
      sequence,
      allowedMismatchCount,
      "ADD_PREVIOUS_TWO_RECURRENCE",
      `first=${first};second=${second}`,
      projectRecurrence(first, second, length),
    );
  }

  return [...candidates.values()];
}

export function solveSerCp004Sequence(
  taskKind: SerCp004TaskKind,
  sequence: readonly (number | null)[],
): SerCp004IndependentSolution {
  if (sequence.length < 6) {
    throw new Error("SER-CP-004 requires at least six displayed positions");
  }
  const missingIndexes = sequence
    .map((value, index) => (value == null ? index : -1))
    .filter((index) => index >= 0);
  if (taskKind === "WRONG_TERM" && missingIndexes.length !== 0) {
    throw new Error("Wrong-term SER-CP-004 sequences cannot contain a blank");
  }
  if (taskKind !== "WRONG_TERM" && missingIndexes.length !== 1) {
    throw new Error("Completion SER-CP-004 sequences require exactly one blank");
  }

  const candidates = inferCandidates(sequence, taskKind === "WRONG_TERM" ? 1 : 0);
  if (candidates.length !== 1) {
    throw new Error(
      `SER-CP-004 ambiguity rejection: expected one authority, found ${candidates.length}`,
    );
  }
  const candidate = candidates[0]!;
  const targetIndex =
    taskKind === "WRONG_TERM" ? candidate.mismatches[0]! : missingIndexes[0]!;
  const correctReplacement = candidate.projected[targetIndex]!;
  const displayed = sequence[targetIndex];
  const answer = taskKind === "WRONG_TERM" ? displayed : correctReplacement;
  if (answer == null) throw new Error("SER-CP-004 independent solver found no answer");
  return {
    answer,
    candidateRuleId: candidate.candidateRuleId,
    parameterKey: candidate.parameterKey,
    targetIndex,
    correctReplacement,
    candidateCount: candidates.length,
  };
}

function targetIndexFor(
  taskKind: SerCp004TaskKind,
  length: number,
  next: () => number,
): number {
  if (taskKind === "NEXT_TERM") return length - 1;
  if (taskKind === "PREVIOUS_TERM") return 0;
  return integer(next, 2, length - 3);
}

function makeCorruptedValue(
  canonical: readonly number[],
  targetIndex: number,
  next: () => number,
): number {
  const current = canonical[targetIndex]!;
  const leftGap = Math.abs(current - canonical[Math.max(0, targetIndex - 1)]!);
  const rightGap = Math.abs(canonical[Math.min(canonical.length - 1, targetIndex + 1)]! - current);
  const scale = Math.max(1, Math.min(50, leftGap || rightGap || 1));
  let corrupted = current;
  for (let attempt = 0; attempt < 20 && canonical.includes(corrupted); attempt += 1) {
    const magnitude = scale * integer(next, 1, 3) + integer(next, 1, 5);
    corrupted = current + (next() < 0.5 ? -magnitude : magnitude);
  }
  if (canonical.includes(corrupted)) corrupted = current + scale + 7;
  return corrupted;
}

function stemFor(taskKind: SerCp004TaskKind): string {
  switch (taskKind) {
    case "NEXT_TERM":
      return "What number should come next in the series?";
    case "MISSING_TERM":
      return "Which number should replace the blank in the series?";
    case "PREVIOUS_TERM":
      return "Which number should be placed before the first shown term to complete the series?";
    case "WRONG_TERM":
      return "One term in the series is incorrect. Which displayed term is wrong?";
  }
}

function ruleStatementFor(ruleId: SerCp004RuleId, parameterKey: string): string {
  switch (ruleId) {
    case "CONSECUTIVE_SQUARES":
      return "The terms are squares of consecutive whole numbers.";
    case "CONSECUTIVE_CUBES":
      return "The terms are cubes of consecutive whole numbers.";
    case "FIXED_BASE_CONSECUTIVE_POWERS": {
      const base = parameterKey.match(/base=(-?\d+)/)?.[1] ?? "the same base";
      return `Each term is the next power of base ${base}, so the sequence also has a constant multiplication ratio.`;
    }
    case "CONSECUTIVE_PRIMES":
      return "The terms are consecutive prime numbers.";
    case "TRIANGULAR_NUMBERS":
      return "The terms are consecutive triangular numbers; the added amounts increase by 1 each time.";
    case "FACTORIAL_SEQUENCE":
      return "The terms are consecutive factorials, so each term is multiplied by the next counting number.";
    case "ADD_PREVIOUS_TWO_RECURRENCE":
      return "From the third term onward, each term is the sum of the previous two terms.";
  }
}

function workingFor(
  question: Pick<
    SerCp004Question,
    "candidateRuleId" | "taskKind" | "sequence" | "hiddenState"
  >,
): string[] {
  const { canonicalSequence, targetIndex, correctReplacement } = question.hiddenState;
  const working: string[] = [];
  switch (question.candidateRuleId) {
    case "CONSECUTIVE_SQUARES":
      working.push(`Nearby values are ${canonicalSequence.slice(Math.max(0, targetIndex - 2), targetIndex + 2).join(", ")}, which follow consecutive squares.`);
      break;
    case "CONSECUTIVE_CUBES":
      working.push(`Nearby values are ${canonicalSequence.slice(Math.max(0, targetIndex - 2), targetIndex + 2).join(", ")}, which follow consecutive cubes.`);
      break;
    case "FIXED_BASE_CONSECUTIVE_POWERS": {
      const visible = canonicalSequence.slice(0, Math.min(4, canonicalSequence.length));
      const ratio = visible[1]! / visible[0]!;
      working.push(`${visible[1]} ÷ ${visible[0]} = ${ratio}, and the same ratio continues.`);
      break;
    }
    case "CONSECUTIVE_PRIMES":
      working.push("Check the next prime each time; composite numbers are skipped.");
      break;
    case "TRIANGULAR_NUMBERS": {
      const differences = canonicalSequence.slice(1, 5).map((value, index) => value - canonicalSequence[index]!);
      working.push(`The successive additions begin ${differences.join(", ")}, increasing by 1 each time.`);
      break;
    }
    case "FACTORIAL_SEQUENCE": {
      const ratios = canonicalSequence.slice(1, 5).map((value, index) => value / canonicalSequence[index]!);
      working.push(`The successive multipliers begin ×${ratios.join(", ×")}.`);
      break;
    }
    case "ADD_PREVIOUS_TWO_RECURRENCE": {
      const sampleIndex = Math.min(Math.max(2, targetIndex), canonicalSequence.length - 1);
      working.push(`${canonicalSequence[sampleIndex - 2]} + ${canonicalSequence[sampleIndex - 1]} = ${canonicalSequence[sampleIndex]}.`);
      break;
    }
  }
  if (question.taskKind === "WRONG_TERM") {
    working.push(
      `At position ${targetIndex + 1}, the rule gives ${correctReplacement}, not ${question.sequence[targetIndex]}.`,
    );
  } else {
    working.push(`Therefore the blank at position ${targetIndex + 1} is ${correctReplacement}.`);
  }
  return working;
}

function buildOptions(
  correctAnswer: number,
  correctReplacement: number,
  canonicalSequence: readonly number[],
  targetIndex: number,
  correctIndex: number,
): number[] {
  const distractors: number[] = [];
  const add = (value: number): void => {
    if (
      Number.isSafeInteger(value)
      && value !== correctAnswer
      && !distractors.includes(value)
    ) {
      distractors.push(value);
    }
  };
  add(correctReplacement);
  add(canonicalSequence[Math.max(0, targetIndex - 1)]!);
  add(canonicalSequence[Math.min(canonicalSequence.length - 1, targetIndex + 1)]!);
  add(correctAnswer - 1);
  add(correctAnswer + 1);
  add(correctAnswer - 2);
  add(correctAnswer + 2);
  let offset = 3;
  while (distractors.length < 3) {
    add(correctAnswer + offset);
    add(correctAnswer - offset);
    offset += 1;
  }
  const options = distractors.slice(0, 3);
  options.splice(correctIndex, 0, correctAnswer);
  return options;
}

function trapAnalyses(
  options: readonly number[],
  correctIndex: number,
  correctAnswer: number,
  taskKind: SerCp004TaskKind,
  correctReplacement: number,
  sequence: readonly (number | null)[],
): string[] {
  return options
    .map((value, index) => ({ value, index }))
    .filter(({ index }) => index !== correctIndex)
    .map(({ value, index }) => {
      const label = `Option ${String.fromCharCode(65 + index)} (${value})`;
      if (taskKind === "WRONG_TERM") {
        if (value === correctReplacement) {
          return `${label} is the correction that belongs at the faulty position, but the question asks for the incorrect displayed term.`;
        }
        if (sequence.includes(value)) {
          return `${label} is a genuine displayed term that fits the rule, so it is not the error.`;
        }
        return `${label} is not the displayed value that breaks the pattern.`;
      }
      if (sequence.includes(value)) {
        return `${label} repeats a visible neighbouring term instead of supplying the missing position.`;
      }
      if (value === correctAnswer - 1) {
        return `${label} is one less than the rule gives.`;
      }
      if (value === correctAnswer + 1) {
        return `${label} is one more than the rule gives.`;
      }
      return `${label} does not satisfy the complete rule at the required position.`;
    });
}

export function generateSerCp004Question(
  temporaryTemplateId: SerCp004TemporaryTemplateId,
  seed: number,
): SerCp004Question {
  assertPositiveSeed(seed);
  const template = templateFor(temporaryTemplateId);
  const templateIndex = SER_CP004_TEMPORARY_TEMPLATE_IDS.indexOf(temporaryTemplateId);
  const difficulty = difficultyFor(seed, templateIndex);

  for (let attempt = 0; attempt < 240; attempt += 1) {
    const mixedSeed =
      (Math.imul(seed, 0x9e3779b1)
        ^ Math.imul(templateIndex + 1, 0x85ebca6b)
        ^ Math.imul(attempt + 1, 0xc2b2ae35)) >>> 0;
    const next = createPrng(mixedSeed || 1);
    const generated = generateCanonical(template.candidateRuleId, difficulty, next);
    const canonicalSequence = [...generated.sequence];
    const targetIndex = targetIndexFor(template.taskKind, canonicalSequence.length, next);
    const sequence: (number | null)[] = [...canonicalSequence];
    let corruptedValue: number | null = null;
    if (template.taskKind === "WRONG_TERM") {
      corruptedValue = makeCorruptedValue(canonicalSequence, targetIndex, next);
      sequence[targetIndex] = corruptedValue;
    } else {
      sequence[targetIndex] = null;
    }

    let independent: SerCp004IndependentSolution;
    try {
      independent = solveSerCp004Sequence(template.taskKind, sequence);
    } catch {
      continue;
    }
    if (
      independent.candidateRuleId !== template.candidateRuleId
      || independent.parameterKey !== generated.parameterKey
      || independent.targetIndex !== targetIndex
    ) {
      continue;
    }

    const correctAnswer = independent.answer;
    const correctIndex = (seed + templateIndex) % 4;
    const options = buildOptions(
      correctAnswer,
      independent.correctReplacement,
      canonicalSequence,
      targetIndex,
      correctIndex,
    );
    if (new Set(options).size !== 4 || options[correctIndex] !== correctAnswer) {
      continue;
    }

    const hiddenState: SerCp004HiddenState = {
      parameterKey: generated.parameterKey,
      canonicalSequence,
      targetIndex,
      corruptedValue,
      correctReplacement: independent.correctReplacement,
    };
    const partial = {
      candidateRuleId: template.candidateRuleId,
      taskKind: template.taskKind,
      sequence,
      hiddenState,
    } as const;
    const explanation: SerCp004Explanation = {
      ruleStatement: ruleStatementFor(template.candidateRuleId, generated.parameterKey),
      working: workingFor(partial),
      conclusion:
        template.taskKind === "WRONG_TERM"
          ? `${correctAnswer} is the incorrect displayed term; it should be ${independent.correctReplacement}.`
          : `The required term is ${correctAnswer}.`,
      trapAnalyses: trapAnalyses(
        options,
        correctIndex,
        correctAnswer,
        template.taskKind,
        independent.correctReplacement,
        sequence,
      ),
    };

    return {
      questionId: `${temporaryTemplateId}-SEED-${seed}`,
      packageId: "SER-001",
      checkpointId: "SER-CP-004",
      temporaryTemplateId,
      permanentQlId: null,
      candidateRuleId: template.candidateRuleId,
      taskKind: template.taskKind,
      solveMode: "INFER_SPECIAL_NUMBER_OR_RECURRENCE_SEQUENCE",
      answerSemantic: template.answerSemantic,
      ownershipDisposition: template.ownershipDisposition,
      provisionalOwnerCheckpoint: template.provisionalOwnerCheckpoint,
      language: "en-IN",
      difficulty,
      seed,
      stem: stemFor(template.taskKind),
      sequence,
      options,
      correctAnswer,
      correctIndex,
      mathematicalFingerprint: [
        template.candidateRuleId,
        generated.parameterKey,
        template.taskKind,
        canonicalSequence.join(","),
        `target=${targetIndex}`,
        `corrupted=${corruptedValue ?? "none"}`,
      ].join("|"),
      explanation,
      hiddenState,
      lifecycle: {
        maturity: "OPEN_EXECUTABLE_DISCOVERY",
        sourceSaturation: "OPEN",
        active: false,
        questionStudioDiscoverable: false,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
      },
    };
  }

  throw new Error(
    `SER-CP-004 could not generate an unambiguous question for ${temporaryTemplateId} seed ${seed}`,
  );
}

function renderSequence(sequence: readonly (number | null)[]): string {
  return sequence.map((value) => (value == null ? "___" : String(value))).join(", ");
}

export function renderSerCp004Review(question: SerCp004Question): string {
  const lines = [
    `## ${question.temporaryTemplateId} / seed ${question.seed}`,
    "",
    `- Rule candidate: ${question.candidateRuleId}`,
    `- Task: ${question.taskKind}`,
    `- Difficulty: ${question.difficulty}`,
    `- Ownership disposition: ${question.ownershipDisposition}`,
    `- Provisional owner: ${question.provisionalOwnerCheckpoint}`,
    "",
    question.stem,
    "",
    `**Series:** ${renderSequence(question.sequence)}`,
    "",
    ...question.options.map(
      (value, index) => `${String.fromCharCode(65 + index)}. ${value}`,
    ),
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.correctAnswer}`,
    "",
    `**Rule:** ${question.explanation.ruleStatement}`,
    "",
    ...question.explanation.working.map((line, index) => `${index + 1}. ${line}`),
    "",
    `**Conclusion:** ${question.explanation.conclusion}`,
    "",
    "**Option checks:**",
    ...question.explanation.trapAnalyses.map((line) => `- ${line}`),
  ];
  return lines.join("\n");
}
