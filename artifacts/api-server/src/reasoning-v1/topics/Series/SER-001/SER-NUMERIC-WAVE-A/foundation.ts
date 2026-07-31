export const SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS = [
  "ZERO_STEP_CONSTANT",
  "DESCENDING_SIGNED_ADDITIVE",
  "DESCENDING_SIGNED_AFFINE",
  "FRACTIONAL_ADDITIVE_STEP",
  "UNIT_FRACTION_MULTIPLICATIVE",
  "TERMINATING_DECIMAL_AFFINE",
] as const;

export type SerNumericWaveASourceFamilyId =
  (typeof SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS)[number];

export const SER_NUMERIC_WAVE_A_CANONICAL_AUTHORITY_IDS = [
  "UNIFORM_ADDITIVE_STEP",
  "UNIFORM_MULTIPLICATIVE_RATIO",
  "AFFINE_MULTIPLY_THEN_ADD",
] as const;

export type SerNumericWaveACanonicalAuthorityId =
  (typeof SER_NUMERIC_WAVE_A_CANONICAL_AUTHORITY_IDS)[number];

export type SerNumericWaveATemporaryTemplateId = `SER-NUMERIC-WAVE-A-TMP-${string}`;

export const SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS = Array.from(
  { length: SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS.length * 4 },
  (_, index) =>
    `SER-NUMERIC-WAVE-A-TMP-${String(index + 1).padStart(3, "0")}`,
) as readonly SerNumericWaveATemporaryTemplateId[];

export type SerNumericWaveATaskKind =
  | "NEXT_TERM"
  | "MISSING_TERM"
  | "PREVIOUS_TERM"
  | "WRONG_TERM";

export type SerNumericWaveADifficulty = "EASY" | "MEDIUM" | "HARD";

export type SerNumericWaveAOwnershipDisposition =
  | "PROVISIONAL_DOMAIN_EXTENSION_CP001"
  | "PROVISIONAL_DOMAIN_EXTENSION_CP002";

export interface Rational {
  readonly numerator: number;
  readonly denominator: number;
}

export interface SerNumericWaveATemplate {
  readonly temporaryTemplateId: SerNumericWaveATemporaryTemplateId;
  readonly sourceFamilyId: SerNumericWaveASourceFamilyId;
  readonly canonicalAuthorityId: SerNumericWaveACanonicalAuthorityId;
  readonly provisionalOwnerCheckpoint: "SER-CP-001" | "SER-CP-002";
  readonly ownershipDisposition: SerNumericWaveAOwnershipDisposition;
  readonly taskKind: SerNumericWaveATaskKind;
  readonly answerSemantic: "TERM_VALUE" | "WRONG_DISPLAYED_TERM";
}

const TASKS = [
  "NEXT_TERM",
  "MISSING_TERM",
  "PREVIOUS_TERM",
  "WRONG_TERM",
] as const;

function authorityFor(sourceFamilyId: SerNumericWaveASourceFamilyId): Pick<
  SerNumericWaveATemplate,
  | "canonicalAuthorityId"
  | "provisionalOwnerCheckpoint"
  | "ownershipDisposition"
> {
  switch (sourceFamilyId) {
    case "ZERO_STEP_CONSTANT":
    case "DESCENDING_SIGNED_ADDITIVE":
    case "FRACTIONAL_ADDITIVE_STEP":
      return {
        canonicalAuthorityId: "UNIFORM_ADDITIVE_STEP",
        provisionalOwnerCheckpoint: "SER-CP-001",
        ownershipDisposition: "PROVISIONAL_DOMAIN_EXTENSION_CP001",
      };
    case "UNIT_FRACTION_MULTIPLICATIVE":
      return {
        canonicalAuthorityId: "UNIFORM_MULTIPLICATIVE_RATIO",
        provisionalOwnerCheckpoint: "SER-CP-002",
        ownershipDisposition: "PROVISIONAL_DOMAIN_EXTENSION_CP002",
      };
    case "DESCENDING_SIGNED_AFFINE":
    case "TERMINATING_DECIMAL_AFFINE":
      return {
        canonicalAuthorityId: "AFFINE_MULTIPLY_THEN_ADD",
        provisionalOwnerCheckpoint: "SER-CP-002",
        ownershipDisposition: "PROVISIONAL_DOMAIN_EXTENSION_CP002",
      };
  }
}

export const SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATES: readonly SerNumericWaveATemplate[] =
  SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS.map((temporaryTemplateId, index) => {
    const sourceFamilyId =
      SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS[Math.floor(index / 4)]!;
    const taskKind = TASKS[index % 4]!;
    return {
      temporaryTemplateId,
      sourceFamilyId,
      taskKind,
      answerSemantic:
        taskKind === "WRONG_TERM" ? "WRONG_DISPLAYED_TERM" : "TERM_VALUE",
      ...authorityFor(sourceFamilyId),
    };
  });

export interface SerNumericWaveAHiddenState {
  readonly parameterKey: string;
  readonly canonicalSequence: readonly string[];
  readonly targetIndex: number;
  readonly corruptedValue: string | null;
  readonly correctReplacement: string;
}

export interface SerNumericWaveAExplanation {
  readonly ruleStatement: string;
  readonly working: readonly string[];
  readonly conclusion: string;
  readonly trapAnalyses: readonly string[];
}

export interface SerNumericWaveAQuestion {
  readonly questionId: string;
  readonly packageId: "SER-001";
  readonly checkpointId: "SER-NUMERIC-WAVE-A";
  readonly temporaryTemplateId: SerNumericWaveATemporaryTemplateId;
  readonly permanentQlId: null;
  readonly sourceFamilyId: SerNumericWaveASourceFamilyId;
  readonly canonicalAuthorityId: SerNumericWaveACanonicalAuthorityId;
  readonly provisionalOwnerCheckpoint: "SER-CP-001" | "SER-CP-002";
  readonly ownershipDisposition: SerNumericWaveAOwnershipDisposition;
  readonly taskKind: SerNumericWaveATaskKind;
  readonly solveMode: "INFER_EXACT_RATIONAL_LINEAR_SEQUENCE";
  readonly answerSemantic: "TERM_VALUE" | "WRONG_DISPLAYED_TERM";
  readonly language: "en-IN";
  readonly difficulty: SerNumericWaveADifficulty;
  readonly seed: number;
  readonly stem: string;
  readonly sequence: readonly (string | null)[];
  readonly options: readonly string[];
  readonly correctAnswer: string;
  readonly correctIndex: number;
  readonly mathematicalFingerprint: string;
  readonly explanation: SerNumericWaveAExplanation;
  readonly hiddenState: SerNumericWaveAHiddenState;
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

export interface SerNumericWaveAIndependentSolution {
  readonly answer: string;
  readonly canonicalAuthorityId: SerNumericWaveACanonicalAuthorityId;
  readonly parameterKey: string;
  readonly targetIndex: number;
  readonly correctReplacement: string;
  readonly candidateCount: number;
}

interface Candidate {
  readonly canonicalAuthorityId: SerNumericWaveACanonicalAuthorityId;
  readonly parameterKey: string;
  readonly projected: readonly Rational[];
  readonly mismatches: readonly number[];
}

interface GeneratedCanonical {
  readonly parameterKey: string;
  readonly sequence: readonly Rational[];
}

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a || 1;
}

export function rational(numerator: number, denominator = 1): Rational {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator)) {
    throw new Error("Wave A rational components must be safe integers");
  }
  if (denominator === 0) throw new Error("Wave A rational denominator cannot be zero");
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return {
    numerator: (sign * numerator) / divisor,
    denominator: Math.abs(denominator) / divisor,
  };
}

function add(left: Rational, right: Rational): Rational {
  return rational(
    left.numerator * right.denominator + right.numerator * left.denominator,
    left.denominator * right.denominator,
  );
}

function subtract(left: Rational, right: Rational): Rational {
  return add(left, rational(-right.numerator, right.denominator));
}

function multiply(left: Rational, right: Rational): Rational {
  return rational(
    left.numerator * right.numerator,
    left.denominator * right.denominator,
  );
}

function divide(left: Rational, right: Rational): Rational {
  if (right.numerator === 0) throw new Error("Wave A division by zero");
  return rational(
    left.numerator * right.denominator,
    left.denominator * right.numerator,
  );
}

function equal(left: Rational, right: Rational): boolean {
  return (
    left.numerator === right.numerator && left.denominator === right.denominator
  );
}

function compare(left: Rational, right: Rational): number {
  return left.numerator * right.denominator - right.numerator * left.denominator;
}

function pow(value: Rational, exponent: number): Rational {
  let result = rational(1);
  for (let index = 0; index < exponent; index += 1) {
    result = multiply(result, value);
  }
  return result;
}

function parseRational(value: string): Rational {
  const trimmed = value.trim();
  if (trimmed.includes("/")) {
    const [numerator, denominator] = trimmed.split("/").map(Number);
    if (numerator == null || denominator == null) {
      throw new Error(`Invalid Wave A rational: ${value}`);
    }
    return rational(numerator, denominator);
  }
  if (trimmed.includes(".")) {
    const negative = trimmed.startsWith("-");
    const unsigned = negative ? trimmed.slice(1) : trimmed;
    const [whole, decimal = ""] = unsigned.split(".");
    const scale = 10 ** decimal.length;
    const numerator = Number(whole || "0") * scale + Number(decimal || "0");
    return rational(negative ? -numerator : numerator, scale);
  }
  return rational(Number(trimmed));
}

function hasTerminatingDecimal(value: Rational): boolean {
  let denominator = value.denominator;
  while (denominator % 2 === 0) denominator /= 2;
  while (denominator % 5 === 0) denominator /= 5;
  return denominator === 1;
}

function decimalPlaces(value: Rational): number {
  let denominator = value.denominator;
  let twos = 0;
  let fives = 0;
  while (denominator % 2 === 0) {
    denominator /= 2;
    twos += 1;
  }
  while (denominator % 5 === 0) {
    denominator /= 5;
    fives += 1;
  }
  return Math.max(twos, fives);
}

export function formatRational(
  value: Rational,
  preferred: "FRACTION" | "DECIMAL" | "AUTO" = "AUTO",
): string {
  if (value.denominator === 1) return String(value.numerator);
  if (
    (preferred === "DECIMAL" || preferred === "AUTO")
    && hasTerminatingDecimal(value)
  ) {
    const places = decimalPlaces(value);
    const numeric = value.numerator / value.denominator;
    return numeric.toFixed(places).replace(/\.0+$/, "");
  }
  return `${value.numerator}/${value.denominator}`;
}

function key(value: Rational): string {
  return `${value.numerator}/${value.denominator}`;
}

function assertPositiveSeed(seed: number): void {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`SER numeric Wave A seed must be a positive integer; received ${seed}`);
  }
}

function templateFor(
  temporaryTemplateId: SerNumericWaveATemporaryTemplateId,
): SerNumericWaveATemplate {
  const template = SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATES.find(
    (entry) => entry.temporaryTemplateId === temporaryTemplateId,
  );
  if (!template) {
    throw new Error(`Unknown SER numeric Wave A template: ${temporaryTemplateId}`);
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

function difficultyFor(
  seed: number,
  templateIndex: number,
): SerNumericWaveADifficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[
    (seed + templateIndex) % 3
  ]!;
}

const ADDITIVE_STEPS: readonly Rational[] = [
  rational(-8),
  rational(-6),
  rational(-5),
  rational(-4),
  rational(-3),
  rational(-2),
  rational(-1),
  rational(0),
  rational(1),
  rational(2),
  rational(3),
  rational(4),
  rational(5),
  rational(6),
  rational(8),
  rational(-5, 2),
  rational(-3, 2),
  rational(-3, 4),
  rational(-1, 2),
  rational(-1, 4),
  rational(1, 4),
  rational(1, 2),
  rational(3, 4),
  rational(3, 2),
  rational(5, 2),
];

const MULTIPLICATIVE_RATIOS: readonly Rational[] = [
  rational(2),
  rational(3),
  rational(4),
  rational(1, 2),
  rational(1, 3),
  rational(1, 4),
];

const AFFINE_MULTIPLIERS: readonly Rational[] = [
  rational(2),
  rational(3),
  rational(1, 2),
];

const AFFINE_ADDITIONS: readonly Rational[] = [
  rational(-4),
  rational(-3),
  rational(-2),
  rational(-1),
  rational(-3, 2),
  rational(-1, 2),
  rational(-1, 4),
  rational(1, 4),
  rational(1, 2),
  rational(3, 2),
  rational(1),
  rational(2),
  rational(3),
  rational(4),
];

function projectAdditive(
  start: Rational,
  step: Rational,
  length: number,
): Rational[] {
  return Array.from({ length }, (_, index) =>
    add(start, multiply(step, rational(index))),
  );
}

function projectMultiplicative(
  start: Rational,
  ratio: Rational,
  length: number,
): Rational[] {
  return Array.from({ length }, (_, index) => multiply(start, pow(ratio, index)));
}

function projectAffine(
  start: Rational,
  multiplier: Rational,
  addition: Rational,
  length: number,
): Rational[] {
  const result: Rational[] = [start];
  while (result.length < length) {
    result.push(add(multiply(result[result.length - 1]!, multiplier), addition));
  }
  return result;
}

function generateCanonical(
  sourceFamilyId: SerNumericWaveASourceFamilyId,
  difficulty: SerNumericWaveADifficulty,
  next: () => number,
): GeneratedCanonical {
  const length = difficulty === "EASY" ? 7 : difficulty === "MEDIUM" ? 8 : 9;
  switch (sourceFamilyId) {
    case "ZERO_STEP_CONSTANT": {
      const value = integer(next, -40, 40);
      return {
        parameterKey: `start=${value};step=0`,
        sequence: projectAdditive(rational(value), rational(0), length),
      };
    }
    case "DESCENDING_SIGNED_ADDITIVE": {
      const step = -integer(next, 2, difficulty === "HARD" ? 8 : 6);
      const start = integer(next, 2, Math.max(3, Math.abs(step) * 2));
      return {
        parameterKey: `start=${start};step=${step}`,
        sequence: projectAdditive(rational(start), rational(step), length),
      };
    }
    case "DESCENDING_SIGNED_AFFINE": {
      const multiplierValue = integer(next, 2, difficulty === "HARD" ? 3 : 2);
      const additionValue = integer(next, 1, 4);
      const multiplier = rational(multiplierValue);
      const addition = rational(additionValue);
      const minimumMagnitude = Math.floor(additionValue / (multiplierValue - 1)) + 2;
      const start = rational(-integer(next, minimumMagnitude, minimumMagnitude + 9));
      return {
        parameterKey: `start=${key(start)};multiplier=${key(multiplier)};addition=${key(addition)}`,
        sequence: projectAffine(start, multiplier, addition, length),
      };
    }
    case "FRACTIONAL_ADDITIVE_STEP": {
      const denominator = next() < 0.5 ? 2 : 4;
      const stepNumeratorPool = denominator === 2 ? [1, 3, 5] : [1, 3, 5, 7];
      const stepNumerator =
        stepNumeratorPool[integer(next, 0, stepNumeratorPool.length - 1)]!;
      const sign = next() < 0.35 ? -1 : 1;
      const step = rational(sign * stepNumerator, denominator);
      const start = rational(integer(next, -20, 20), denominator);
      return {
        parameterKey: `start=${key(start)};step=${key(step)}`,
        sequence: projectAdditive(start, step, length),
      };
    }
    case "UNIT_FRACTION_MULTIPLICATIVE": {
      const denominator = integer(next, 2, difficulty === "HARD" ? 4 : 3);
      const ratio = rational(1, denominator);
      const coefficientPool = [2, 3, 5, 7, 11].filter(
        (value) => value % denominator !== 0,
      );
      const coefficient =
        coefficientPool[integer(next, 0, coefficientPool.length - 1)]!;
      const start = rational(coefficient * denominator ** (length - 2));
      return {
        parameterKey: `start=${key(start)};ratio=${key(ratio)}`,
        sequence: projectMultiplicative(start, ratio, length),
      };
    }
    case "TERMINATING_DECIMAL_AFFINE": {
      const multiplier = rational(1, 2);
      const additionPool = [
        rational(-3, 2),
        rational(-1, 2),
        rational(-1, 4),
        rational(1, 4),
        rational(1, 2),
        rational(3, 2),
      ];
      const addition = additionPool[integer(next, 0, additionPool.length - 1)]!;
      const start = rational(integer(next, -40, 40), 4);
      return {
        parameterKey: `start=${key(start)};multiplier=${key(multiplier)};addition=${key(addition)}`,
        sequence: projectAffine(start, multiplier, addition, length),
      };
    }
  }
}

function mismatchIndexes(
  sequence: readonly (Rational | null)[],
  projected: readonly Rational[],
): number[] {
  const mismatches: number[] = [];
  for (let index = 0; index < sequence.length; index += 1) {
    const displayed = sequence[index];
    if (displayed != null && !equal(displayed, projected[index]!)) {
      mismatches.push(index);
    }
  }
  return mismatches;
}

function addCandidate(
  map: Map<string, Candidate>,
  sequence: readonly (Rational | null)[],
  allowedMismatchCount: 0 | 1,
  canonicalAuthorityId: SerNumericWaveACanonicalAuthorityId,
  parameterKey: string,
  projected: readonly Rational[],
): void {
  if (projected.length !== sequence.length) return;
  if (
    projected.some(
      (value) =>
        !Number.isSafeInteger(value.numerator)
        || !Number.isSafeInteger(value.denominator)
        || Math.abs(value.numerator) > 50_000_000
        || value.denominator > 1_000_000,
    )
  ) {
    return;
  }
  const mismatches = mismatchIndexes(sequence, projected);
  if (mismatches.length !== allowedMismatchCount) return;
  const projectionKey = projected.map(key).join(",");
  map.set(`${canonicalAuthorityId}|${projectionKey}`, {
    canonicalAuthorityId,
    parameterKey,
    projected,
    mismatches,
  });
}

function inferCandidates(
  sequence: readonly (Rational | null)[],
  allowedMismatchCount: 0 | 1,
): Candidate[] {
  const candidates = new Map<string, Candidate>();
  const length = sequence.length;
  const firstVisibleIndex = sequence.findIndex((value) => value != null);
  if (firstVisibleIndex < 0) return [];
  const firstVisible = sequence[firstVisibleIndex]! as Rational;

  for (const step of ADDITIVE_STEPS) {
    const start = subtract(
      firstVisible,
      multiply(step, rational(firstVisibleIndex)),
    );
    addCandidate(
      candidates,
      sequence,
      allowedMismatchCount,
      "UNIFORM_ADDITIVE_STEP",
      `start=${key(start)};step=${key(step)}`,
      projectAdditive(start, step, length),
    );
  }

  for (const ratio of MULTIPLICATIVE_RATIOS) {
    const start = divide(firstVisible, pow(ratio, firstVisibleIndex));
    addCandidate(
      candidates,
      sequence,
      allowedMismatchCount,
      "UNIFORM_MULTIPLICATIVE_RATIO",
      `start=${key(start)};ratio=${key(ratio)}`,
      projectMultiplicative(start, ratio, length),
    );
  }

  for (const multiplier of AFFINE_MULTIPLIERS) {
    for (const addition of AFFINE_ADDITIONS) {
      let start = firstVisible;
      for (let index = 0; index < firstVisibleIndex; index += 1) {
        start = divide(subtract(start, addition), multiplier);
      }
      addCandidate(
        candidates,
        sequence,
        allowedMismatchCount,
        "AFFINE_MULTIPLY_THEN_ADD",
        `start=${key(start)};multiplier=${key(multiplier)};addition=${key(addition)}`,
        projectAffine(start, multiplier, addition, length),
      );
    }
  }

  return [...candidates.values()];
}

export function solveSerNumericWaveASequence(
  taskKind: SerNumericWaveATaskKind,
  sequence: readonly (string | null)[],
): SerNumericWaveAIndependentSolution {
  if (sequence.length < 6) {
    throw new Error("SER numeric Wave A requires at least six displayed positions");
  }
  const parsed = sequence.map((value) => (value == null ? null : parseRational(value)));
  const missingIndexes = parsed
    .map((value, index) => (value == null ? index : -1))
    .filter((index) => index >= 0);
  if (taskKind === "WRONG_TERM" && missingIndexes.length !== 0) {
    throw new Error("Wave A wrong-term sequences cannot contain a blank");
  }
  if (taskKind !== "WRONG_TERM" && missingIndexes.length !== 1) {
    throw new Error("Wave A completion sequences require exactly one blank");
  }

  const candidates = inferCandidates(parsed, taskKind === "WRONG_TERM" ? 1 : 0);
  if (candidates.length !== 1) {
    throw new Error(
      `SER numeric Wave A ambiguity rejection: expected one canonical authority, found ${candidates.length}`,
    );
  }
  const candidate = candidates[0]!;
  const targetIndex =
    taskKind === "WRONG_TERM" ? candidate.mismatches[0]! : missingIndexes[0]!;
  const correctReplacement = candidate.projected[targetIndex]!;
  const displayed = parsed[targetIndex];
  const answer = taskKind === "WRONG_TERM" ? displayed : correctReplacement;
  if (answer == null) throw new Error("Wave A independent solver found no answer");
  return {
    answer: formatRational(answer),
    canonicalAuthorityId: candidate.canonicalAuthorityId,
    parameterKey: candidate.parameterKey,
    targetIndex,
    correctReplacement: formatRational(correctReplacement),
    candidateCount: candidates.length,
  };
}

function targetIndexFor(
  taskKind: SerNumericWaveATaskKind,
  length: number,
  next: () => number,
): number {
  if (taskKind === "NEXT_TERM") return length - 1;
  if (taskKind === "PREVIOUS_TERM") return 0;
  return integer(next, 2, length - 3);
}

function preferredFormatFor(
  sourceFamilyId: SerNumericWaveASourceFamilyId,
): "FRACTION" | "DECIMAL" | "AUTO" {
  if (sourceFamilyId === "FRACTIONAL_ADDITIVE_STEP") return "FRACTION";
  if (sourceFamilyId === "TERMINATING_DECIMAL_AFFINE") return "DECIMAL";
  return "AUTO";
}

function makeCorruptedValue(
  current: Rational,
  next: () => number,
): Rational {
  const deltas = [rational(1, 4), rational(1, 2), rational(1), rational(3, 2), rational(2)];
  const delta = deltas[integer(next, 0, deltas.length - 1)]!;
  return next() < 0.5 ? subtract(current, delta) : add(current, delta);
}

function stemFor(taskKind: SerNumericWaveATaskKind): string {
  switch (taskKind) {
    case "NEXT_TERM":
      return "What value should come next in the series?";
    case "MISSING_TERM":
      return "Which value should replace the blank in the series?";
    case "PREVIOUS_TERM":
      return "Which value should be placed before the first shown term?";
    case "WRONG_TERM":
      return "One displayed value is incorrect. Which value is wrong?";
  }
}

function ruleStatementFor(
  sourceFamilyId: SerNumericWaveASourceFamilyId,
  canonicalAuthorityId: SerNumericWaveACanonicalAuthorityId,
): string {
  switch (sourceFamilyId) {
    case "ZERO_STEP_CONSTANT":
      return "Every term is unchanged; this is an additive series with step zero.";
    case "DESCENDING_SIGNED_ADDITIVE":
      return "The same negative amount is added each time, so the series descends through signed values.";
    case "DESCENDING_SIGNED_AFFINE":
      return "Each term is multiplied by a fixed integer and then a fixed amount is added; the negative values descend in order.";
    case "FRACTIONAL_ADDITIVE_STEP":
      return "The same exact fractional amount is added at every step.";
    case "UNIT_FRACTION_MULTIPLICATIVE":
      return "Each term is multiplied by the same unit fraction, which is equivalent to dividing by a fixed integer.";
    case "TERMINATING_DECIMAL_AFFINE":
      return "Each term is multiplied by one-half and then the same terminating decimal adjustment is applied.";
    default:
      return `The sequence follows ${canonicalAuthorityId}.`;
  }
}

function workingFor(
  sourceFamilyId: SerNumericWaveASourceFamilyId,
  canonicalSequence: readonly string[],
  targetIndex: number,
  taskKind: SerNumericWaveATaskKind,
  correctReplacement: string,
  displayedValue: string | null,
): string[] {
  const nearbyStart = Math.max(0, targetIndex - 2);
  const nearby = canonicalSequence.slice(nearbyStart, Math.min(canonicalSequence.length, targetIndex + 3));
  const lines = [
    `The nearby exact values ${nearby.join(", ")} satisfy one rational linear rule.`,
  ];
  if (taskKind === "WRONG_TERM") {
    lines.push(
      `At position ${targetIndex + 1}, the rule gives ${correctReplacement}, not ${displayedValue}.`,
    );
  } else {
    lines.push(`The required value at position ${targetIndex + 1} is ${correctReplacement}.`);
  }
  if (
    sourceFamilyId === "FRACTIONAL_ADDITIVE_STEP"
    || sourceFamilyId === "TERMINATING_DECIMAL_AFFINE"
  ) {
    lines.push("The calculation is performed with exact fractions before rendering the final value.");
  }
  return lines;
}

function buildOptions(
  correctAnswer: Rational,
  correctReplacement: Rational,
  canonicalSequence: readonly Rational[],
  targetIndex: number,
  correctIndex: number,
  preferred: "FRACTION" | "DECIMAL" | "AUTO",
): string[] {
  const distractors: Rational[] = [];
  const addDistractor = (value: Rational): void => {
    const valueKey = key(value);
    if (
      !equal(value, correctAnswer)
      && !distractors.some((candidate) => key(candidate) === valueKey)
    ) {
      distractors.push(value);
    }
  };
  addDistractor(correctReplacement);
  addDistractor(canonicalSequence[Math.max(0, targetIndex - 1)]!);
  addDistractor(canonicalSequence[Math.min(canonicalSequence.length - 1, targetIndex + 1)]!);
  addDistractor(add(correctAnswer, rational(1)));
  addDistractor(subtract(correctAnswer, rational(1)));
  addDistractor(add(correctAnswer, rational(1, 2)));
  addDistractor(subtract(correctAnswer, rational(1, 2)));
  let offset = 2;
  while (distractors.length < 3) {
    addDistractor(add(correctAnswer, rational(offset)));
    addDistractor(subtract(correctAnswer, rational(offset)));
    offset += 1;
  }
  const options = distractors.slice(0, 3).map((value) => formatRational(value, preferred));
  options.splice(correctIndex, 0, formatRational(correctAnswer, preferred));
  return options;
}

function trapAnalyses(
  options: readonly string[],
  correctIndex: number,
  taskKind: SerNumericWaveATaskKind,
  correctReplacement: string,
  sequence: readonly (string | null)[],
): string[] {
  return options
    .map((value, index) => ({ value, index }))
    .filter(({ index }) => index !== correctIndex)
    .map(({ value, index }) => {
      const label = `Option ${String.fromCharCode(65 + index)} (${value})`;
      if (taskKind === "WRONG_TERM") {
        if (value === correctReplacement) {
          return `${label} is the correction, but the question asks for the incorrect displayed value.`;
        }
        if (sequence.includes(value)) {
          return `${label} is a displayed value that remains consistent with the exact rule.`;
        }
        return `${label} is not the displayed value that breaks the rule.`;
      }
      if (sequence.includes(value)) {
        return `${label} repeats a visible neighbour instead of filling the required position.`;
      }
      return `${label} does not satisfy the exact rational rule at the target position.`;
    });
}

export function generateSerNumericWaveAQuestion(
  temporaryTemplateId: SerNumericWaveATemporaryTemplateId,
  seed: number,
): SerNumericWaveAQuestion {
  assertPositiveSeed(seed);
  const template = templateFor(temporaryTemplateId);
  const templateIndex = SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS.indexOf(
    temporaryTemplateId,
  );
  const difficulty = difficultyFor(seed, templateIndex);
  const preferred = preferredFormatFor(template.sourceFamilyId);

  for (let attempt = 0; attempt < 300; attempt += 1) {
    const mixedSeed =
      (Math.imul(seed, 0x9e3779b1)
        ^ Math.imul(templateIndex + 1, 0x85ebca6b)
        ^ Math.imul(attempt + 1, 0xc2b2ae35)) >>> 0;
    const next = createPrng(mixedSeed || 1);
    const generated = generateCanonical(template.sourceFamilyId, difficulty, next);
    const canonicalSequence = [...generated.sequence];
    const targetIndex = targetIndexFor(template.taskKind, canonicalSequence.length, next);
    const displayed: (Rational | null)[] = [...canonicalSequence];
    let corruptedValue: Rational | null = null;
    if (template.taskKind === "WRONG_TERM") {
      corruptedValue = makeCorruptedValue(canonicalSequence[targetIndex]!, next);
      displayed[targetIndex] = corruptedValue;
    } else {
      displayed[targetIndex] = null;
    }
    const renderedSequence = displayed.map((value) =>
      value == null ? null : formatRational(value, preferred),
    );

    let independent: SerNumericWaveAIndependentSolution;
    try {
      independent = solveSerNumericWaveASequence(template.taskKind, renderedSequence);
    } catch {
      continue;
    }
    if (
      independent.canonicalAuthorityId !== template.canonicalAuthorityId
      || independent.targetIndex !== targetIndex
    ) {
      continue;
    }

    const correctAnswerRational =
      template.taskKind === "WRONG_TERM"
        ? corruptedValue!
        : canonicalSequence[targetIndex]!;
    const correctReplacementRational = canonicalSequence[targetIndex]!;
    const correctAnswer = formatRational(correctAnswerRational, preferred);
    const correctReplacement = formatRational(correctReplacementRational, preferred);
    if (
      independent.answer !== correctAnswer
      || independent.correctReplacement !== correctReplacement
    ) {
      continue;
    }

    const correctIndex = (seed + templateIndex) % 4;
    const options = buildOptions(
      correctAnswerRational,
      correctReplacementRational,
      canonicalSequence,
      targetIndex,
      correctIndex,
      preferred,
    );
    if (new Set(options).size !== 4 || options[correctIndex] !== correctAnswer) {
      continue;
    }

    const canonicalRendered = canonicalSequence.map((value) =>
      formatRational(value, preferred),
    );
    const hiddenState: SerNumericWaveAHiddenState = {
      parameterKey: generated.parameterKey,
      canonicalSequence: canonicalRendered,
      targetIndex,
      corruptedValue:
        corruptedValue == null ? null : formatRational(corruptedValue, preferred),
      correctReplacement,
    };
    const explanation: SerNumericWaveAExplanation = {
      ruleStatement: ruleStatementFor(
        template.sourceFamilyId,
        template.canonicalAuthorityId,
      ),
      working: workingFor(
        template.sourceFamilyId,
        canonicalRendered,
        targetIndex,
        template.taskKind,
        correctReplacement,
        renderedSequence[targetIndex],
      ),
      conclusion:
        template.taskKind === "WRONG_TERM"
          ? `${correctAnswer} is the incorrect displayed value; it should be ${correctReplacement}.`
          : `The required value is ${correctAnswer}.`,
      trapAnalyses: trapAnalyses(
        options,
        correctIndex,
        template.taskKind,
        correctReplacement,
        renderedSequence,
      ),
    };

    return {
      questionId: `${temporaryTemplateId}-SEED-${seed}`,
      packageId: "SER-001",
      checkpointId: "SER-NUMERIC-WAVE-A",
      temporaryTemplateId,
      permanentQlId: null,
      sourceFamilyId: template.sourceFamilyId,
      canonicalAuthorityId: template.canonicalAuthorityId,
      provisionalOwnerCheckpoint: template.provisionalOwnerCheckpoint,
      ownershipDisposition: template.ownershipDisposition,
      taskKind: template.taskKind,
      solveMode: "INFER_EXACT_RATIONAL_LINEAR_SEQUENCE",
      answerSemantic: template.answerSemantic,
      language: "en-IN",
      difficulty,
      seed,
      stem: stemFor(template.taskKind),
      sequence: renderedSequence,
      options,
      correctAnswer,
      correctIndex,
      mathematicalFingerprint: [
        template.sourceFamilyId,
        template.canonicalAuthorityId,
        generated.parameterKey,
        template.taskKind,
        canonicalSequence.map(key).join(","),
        `target=${targetIndex}`,
        `corrupted=${corruptedValue == null ? "none" : key(corruptedValue)}`,
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
    `SER numeric Wave A could not generate an unambiguous question for ${temporaryTemplateId} seed ${seed}`,
  );
}

function renderSequence(sequence: readonly (string | null)[]): string {
  return sequence.map((value) => (value == null ? "___" : value)).join(", ");
}

export function renderSerNumericWaveAReview(
  question: SerNumericWaveAQuestion,
): string {
  const lines = [
    `## ${question.temporaryTemplateId} / seed ${question.seed}`,
    "",
    `- Source family: ${question.sourceFamilyId}`,
    `- Canonical authority: ${question.canonicalAuthorityId}`,
    `- Provisional owner: ${question.provisionalOwnerCheckpoint}`,
    `- Task: ${question.taskKind}`,
    `- Difficulty: ${question.difficulty}`,
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

export function isStrictlyDescending(values: readonly string[]): boolean {
  const parsed = values.map(parseRational);
  return parsed.slice(1).every((value, index) => compare(parsed[index]!, value) > 0);
}

export function includesNegativeValue(values: readonly string[]): boolean {
  return values.map(parseRational).some((value) => value.numerator < 0);
}

export function includesNonIntegerValue(values: readonly string[]): boolean {
  return values.map(parseRational).some((value) => value.denominator !== 1);
}
