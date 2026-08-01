export const SER_WAVE_B3_SOURCE_FAMILIES = [
  "CONSTANT_NONZERO_SIXTH_DIFFERENCE",
  "CONSTANT_NONZERO_SEVENTH_DIFFERENCE",
  "ADD_CONSECUTIVE_PRIMES",
  "ADD_CONSECUTIVE_SQUARES",
  "ADD_CONSECUTIVE_CUBES",
  "SQUARES_OF_CONSECUTIVE_ODDS",
  "SQUARES_OF_CONSECUTIVE_PRIMES",
  "PROGRESSIVE_INTEGER_MULTIPLIERS",
  "PROGRESSIVE_HALF_STEP_MULTIPLIERS",
  "PROGRESSIVE_MULTIPLY_PLUS_INDEX",
  "ALTERNATING_HALF_PERCENT_RATES",
  "PROGRESSIVE_HALF_PERCENT_RATES",
  "DIGIT_PRODUCT_PLUS_ONE",
  "DIGIT_SUM_SQUARED",
  "CYCLIC_DIGIT_ROTATION",
  "LINEAR_STATEFUL_RECURRENCE_REPROBE",
] as const;

export type SerWaveB3SourceFamily = (typeof SER_WAVE_B3_SOURCE_FAMILIES)[number];
export type SerWaveB3TaskKind = "NEXT_TERM" | "MISSING_TERM" | "PREVIOUS_TERM" | "WRONG_TERM";
export type SerWaveB3Authority =
  | "CONSTANT_HIGHER_ORDER_FINITE_DIFFERENCE"
  | "SPECIAL_INCREMENT_SCHEDULE"
  | "CONSTANT_NONZERO_THIRD_DIFFERENCE"
  | "CONSTANT_NONZERO_SECOND_DIFFERENCE"
  | "INDEXED_POWER_SCHEDULE"
  | "PROGRESSIVE_MULTIPLY_PLUS_ADD"
  | "ALTERNATING_FIXED_AFFINE_PHASE"
  | "DIGIT_TRANSFORMATION_RECURRENCE"
  | "LINEAR_STATEFUL_RECURRENCE";

export type SerWaveB3Disposition =
  | "EXTEND_EXISTING_AUTHORITY"
  | "COLLAPSE_TO_EXISTING_AUTHORITY"
  | "RETAIN_NEW_PROVISIONAL_AUTHORITY";

export interface SerWaveB3Template {
  readonly temporaryTemplateId: string;
  readonly sourceFamilyId: SerWaveB3SourceFamily;
  readonly canonicalAuthorityId: SerWaveB3Authority;
  readonly ownershipDisposition: SerWaveB3Disposition;
  readonly taskKind: SerWaveB3TaskKind;
}

const TASKS: readonly SerWaveB3TaskKind[] = [
  "NEXT_TERM",
  "MISSING_TERM",
  "PREVIOUS_TERM",
  "WRONG_TERM",
];

function authorityFor(source: SerWaveB3SourceFamily): Pick<
  SerWaveB3Template,
  "canonicalAuthorityId" | "ownershipDisposition"
> {
  switch (source) {
    case "CONSTANT_NONZERO_SIXTH_DIFFERENCE":
    case "CONSTANT_NONZERO_SEVENTH_DIFFERENCE":
    case "ADD_CONSECUTIVE_CUBES":
      return {
        canonicalAuthorityId: "CONSTANT_HIGHER_ORDER_FINITE_DIFFERENCE",
        ownershipDisposition: "EXTEND_EXISTING_AUTHORITY",
      };
    case "ADD_CONSECUTIVE_PRIMES":
      return {
        canonicalAuthorityId: "SPECIAL_INCREMENT_SCHEDULE",
        ownershipDisposition: "RETAIN_NEW_PROVISIONAL_AUTHORITY",
      };
    case "ADD_CONSECUTIVE_SQUARES":
      return {
        canonicalAuthorityId: "CONSTANT_NONZERO_THIRD_DIFFERENCE",
        ownershipDisposition: "COLLAPSE_TO_EXISTING_AUTHORITY",
      };
    case "SQUARES_OF_CONSECUTIVE_ODDS":
      return {
        canonicalAuthorityId: "CONSTANT_NONZERO_SECOND_DIFFERENCE",
        ownershipDisposition: "COLLAPSE_TO_EXISTING_AUTHORITY",
      };
    case "SQUARES_OF_CONSECUTIVE_PRIMES":
      return {
        canonicalAuthorityId: "INDEXED_POWER_SCHEDULE",
        ownershipDisposition: "EXTEND_EXISTING_AUTHORITY",
      };
    case "PROGRESSIVE_INTEGER_MULTIPLIERS":
    case "PROGRESSIVE_HALF_STEP_MULTIPLIERS":
    case "PROGRESSIVE_MULTIPLY_PLUS_INDEX":
    case "PROGRESSIVE_HALF_PERCENT_RATES":
      return {
        canonicalAuthorityId: "PROGRESSIVE_MULTIPLY_PLUS_ADD",
        ownershipDisposition: "COLLAPSE_TO_EXISTING_AUTHORITY",
      };
    case "ALTERNATING_HALF_PERCENT_RATES":
      return {
        canonicalAuthorityId: "ALTERNATING_FIXED_AFFINE_PHASE",
        ownershipDisposition: "COLLAPSE_TO_EXISTING_AUTHORITY",
      };
    case "DIGIT_PRODUCT_PLUS_ONE":
    case "DIGIT_SUM_SQUARED":
    case "CYCLIC_DIGIT_ROTATION":
      return {
        canonicalAuthorityId: "DIGIT_TRANSFORMATION_RECURRENCE",
        ownershipDisposition: "RETAIN_NEW_PROVISIONAL_AUTHORITY",
      };
    case "LINEAR_STATEFUL_RECURRENCE_REPROBE":
      return {
        canonicalAuthorityId: "LINEAR_STATEFUL_RECURRENCE",
        ownershipDisposition: "EXTEND_EXISTING_AUTHORITY",
      };
  }
}

export const SER_WAVE_B3_TEMPLATES: readonly SerWaveB3Template[] =
  SER_WAVE_B3_SOURCE_FAMILIES.flatMap((sourceFamilyId, familyIndex) => {
    const ownership = authorityFor(sourceFamilyId);
    return TASKS.map((taskKind, taskIndex) => ({
      temporaryTemplateId: `SER-WAVE-B3-TMP-${String(
        familyIndex * TASKS.length + taskIndex + 1,
      ).padStart(3, "0")}`,
      sourceFamilyId,
      taskKind,
      ...ownership,
    }));
  });

export const SER_WAVE_B3_SOURCE_CATALOG = [
  ["CONSTANT_ADD_SUBTRACT", "SER-CP-001", "reasoning book.pdf; reasoning_aggarwal.pdf"],
  ["CONSTANT_MULTIPLY_DIVIDE", "SER-CP-002", "reasoning book.pdf; reasoning_aggarwal.pdf"],
  ["INCREASING_DIFFERENCE", "SER-CP-003", "reasoning book.pdf"],
  ["CONSECUTIVE_SQUARE_CUBE_INCREMENT", "SER-WAVE-B3", "reasoning book.pdf"],
  ["PROGRESSIVE_MULTIPLIER", "SER-WAVE-B3", "reasoning book.pdf; reasoning_aggarwal.pdf"],
  ["PROGRESSIVE_MULTIPLY_PLUS_INDEX", "SER-CP-005", "reasoning book.pdf"],
  ["PRIME_INCREMENT", "SER-WAVE-B3", "reasoning_aggarwal.pdf"],
  ["COMPOSITE_SUCCESSOR", "SER-WAVE-B2", "reasoning_aggarwal.pdf"],
  ["PRIME_GAP", "SER-WAVE-B2", "reasoning book.pdf"],
  ["CHANGING_POWER", "SER-WAVE-B2", "reasoning book.pdf"],
  ["FIBONACCI_LINEAR_RECURRENCE", "SER-WAVE-B1", "reasoning_aggarwal.pdf"],
  ["ALTERNATING_OPERATOR", "SER-CP-005", "reasoning book.pdf"],
  ["PERCENT_RATE", "SER-WAVE-B3", "reasoning book.pdf"],
  ["DIGIT_PRODUCT_TRANSFORM", "SER-WAVE-B3", "reasoning book.pdf"],
  ["DIGIT_SUM_POWER_TRANSFORM", "SER-WAVE-B3", "reasoning_aggarwal.pdf"],
  ["DIGIT_ROTATION", "SER-WAVE-B3", "reasoning_aggarwal.pdf"],
  ["ODD_EVEN_POWER", "SER-CP-003", "reasoning book.pdf"],
  ["WRONG_TERM", "TASK_SURFACE", "reasoning book.pdf; reasoning_aggarwal.pdf"],
] as const;

function isPrime(value: number): boolean {
  if (value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function primes(start: number, length: number): number[] {
  const result: number[] = [];
  for (let value = Math.max(2, start); result.length < length; value += 1) {
    if (isPrime(value)) result.push(value);
  }
  return result;
}

function cumulativeIncrements(start: number, increments: readonly number[]): number[] {
  const values = [start];
  for (const increment of increments) {
    values.push(values[values.length - 1]! + increment);
  }
  return values;
}

function rotateLeft(value: number): number {
  const text = String(Math.abs(value));
  const rotated = `${text.slice(1)}${text[0]}`;
  return Number(rotated);
}

function digitProduct(value: number): number {
  return String(Math.abs(value))
    .split("")
    .reduce((product, digit) => product * Number(digit), 1);
}

function digitSum(value: number): number {
  return String(Math.abs(value))
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

function sequenceFor(source: SerWaveB3SourceFamily, seed: number): number[] {
  const length = 10;
  switch (source) {
    case "CONSTANT_NONZERO_SIXTH_DIFFERENCE": {
      const scale = 1 + (seed % 2);
      const offset = seed % 4;
      return Array.from({ length }, (_, index) => scale * Math.pow(index + 1, 6) + offset);
    }
    case "CONSTANT_NONZERO_SEVENTH_DIFFERENCE": {
      const offset = seed % 5;
      return Array.from({ length }, (_, index) => Math.pow(index + 1, 7) + offset);
    }
    case "ADD_CONSECUTIVE_PRIMES": {
      const primeList = primes(2 + (seed % 8), length - 1);
      return cumulativeIncrements(3 + (seed % 7), primeList);
    }
    case "ADD_CONSECUTIVE_SQUARES": {
      const startIndex = 1 + (seed % 3);
      const increments = Array.from(
        { length: length - 1 },
        (_, index) => Math.pow(startIndex + index, 2),
      );
      return cumulativeIncrements(2 + (seed % 5), increments);
    }
    case "ADD_CONSECUTIVE_CUBES": {
      const startIndex = 1 + (seed % 2);
      const increments = Array.from(
        { length: length - 1 },
        (_, index) => Math.pow(startIndex + index, 3),
      );
      return cumulativeIncrements(1 + (seed % 4), increments);
    }
    case "SQUARES_OF_CONSECUTIVE_ODDS": {
      const startOdd = 1 + 2 * (seed % 4);
      return Array.from({ length }, (_, index) => Math.pow(startOdd + 2 * index, 2));
    }
    case "SQUARES_OF_CONSECUTIVE_PRIMES": {
      return primes(2 + (seed % 8), length).map((value) => value * value);
    }
    case "PROGRESSIVE_INTEGER_MULTIPLIERS": {
      const values = [1 + (seed % 3)];
      const firstMultiplier = 2 + (seed % 2);
      for (let index = 1; index < 9; index += 1) {
        values.push(values[index - 1]! * (firstMultiplier + index - 1));
      }
      return values;
    }
    case "PROGRESSIVE_HALF_STEP_MULTIPLIERS":
    case "PROGRESSIVE_HALF_PERCENT_RATES": {
      const values = [4096 * (1 + (seed % 2))];
      for (let index = 1; index < 9; index += 1) {
        const numerator = index + 2;
        values.push((values[index - 1]! * numerator) / 2);
      }
      return values;
    }
    case "PROGRESSIVE_MULTIPLY_PLUS_INDEX": {
      const values = [2 + (seed % 4)];
      for (let index = 1; index < 8; index += 1) {
        const factor = index + 1;
        values.push(values[index - 1]! * factor + factor);
      }
      return values;
    }
    case "ALTERNATING_HALF_PERCENT_RATES": {
      const values = [4096 * (1 + (seed % 2))];
      for (let index = 1; index < length; index += 1) {
        values.push(
          index % 2 === 1
            ? (values[index - 1]! * 3) / 2
            : values[index - 1]! / 2,
        );
      }
      return values;
    }
    case "DIGIT_PRODUCT_PLUS_ONE": {
      const values = [59 + 10 * (seed % 4)];
      for (let index = 1; index < length; index += 1) {
        values.push(digitProduct(values[index - 1]!) + 1);
      }
      return values;
    }
    case "DIGIT_SUM_SQUARED": {
      const values = [25 + 11 * (seed % 3)];
      for (let index = 1; index < length; index += 1) {
        values.push(Math.pow(digitSum(values[index - 1]!), 2));
      }
      return values;
    }
    case "CYCLIC_DIGIT_ROTATION": {
      const values = [2478 + 1111 * (seed % 3)];
      for (let index = 1; index < length; index += 1) {
        values.push(rotateLeft(values[index - 1]!));
      }
      return values;
    }
    case "LINEAR_STATEFUL_RECURRENCE_REPROBE": {
      const values = [1 + (seed % 3), 2 + (seed % 4)];
      const constant = seed % 2;
      for (let index = 2; index < length; index += 1) {
        values.push(2 * values[index - 1]! + values[index - 2]! + constant);
      }
      return values;
    }
  }
}

export interface SerWaveB3Question {
  readonly questionId: string;
  readonly temporaryTemplateId: string;
  readonly permanentQlId: null;
  readonly sourceFamilyId: SerWaveB3SourceFamily;
  readonly canonicalAuthorityId: SerWaveB3Authority;
  readonly ownershipDisposition: SerWaveB3Disposition;
  readonly taskKind: SerWaveB3TaskKind;
  readonly sequence: readonly (number | null)[];
  readonly canonicalSequence: readonly number[];
  readonly correctAnswer: number;
  readonly correctIndex: number;
  readonly lifecycle: {
    readonly maturity: "OPEN_EXECUTABLE_DISCOVERY";
    readonly sourceSaturation: "TARGET_REFERENCE_CATALOG_AUDITED";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export function generateSerWaveB3Question(
  template: SerWaveB3Template,
  seed: number,
): SerWaveB3Question {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Wave B3 seed must be a positive integer; received ${seed}`);
  }
  const canonicalSequence = sequenceFor(template.sourceFamilyId, seed);
  const displayed: (number | null)[] = [...canonicalSequence];
  let targetIndex = canonicalSequence.length - 1;

  if (template.taskKind === "NEXT_TERM") {
    displayed.pop();
  } else if (template.taskKind === "PREVIOUS_TERM") {
    targetIndex = 0;
    displayed.shift();
  } else if (template.taskKind === "MISSING_TERM") {
    targetIndex = 2 + (seed % Math.max(1, canonicalSequence.length - 4));
    displayed[targetIndex] = null;
  } else {
    targetIndex = 2 + (seed % Math.max(1, canonicalSequence.length - 4));
    const delta = 1 + (seed % 7);
    displayed[targetIndex] = canonicalSequence[targetIndex]! + delta;
  }

  return {
    questionId: `${template.temporaryTemplateId}-${seed}`,
    temporaryTemplateId: template.temporaryTemplateId,
    permanentQlId: null,
    sourceFamilyId: template.sourceFamilyId,
    canonicalAuthorityId: template.canonicalAuthorityId,
    ownershipDisposition: template.ownershipDisposition,
    taskKind: template.taskKind,
    sequence: displayed,
    canonicalSequence,
    correctAnswer: canonicalSequence[targetIndex]!,
    correctIndex: seed % 4,
    lifecycle: {
      maturity: "OPEN_EXECUTABLE_DISCOVERY",
      sourceSaturation: "TARGET_REFERENCE_CATALOG_AUDITED",
      active: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}

export function independentlyProject(
  source: SerWaveB3SourceFamily,
  seed: number,
): readonly number[] {
  return sequenceFor(source, seed);
}

export function finiteDifferenceOrder(values: readonly number[]): number | null {
  let current = [...values];
  for (let order = 1; order < values.length; order += 1) {
    const next = current.slice(1).map((value, index) => value - current[index]!);
    if (next.every((value) => value === next[0])) return order;
    current = next;
  }
  return null;
}
