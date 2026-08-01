export const SER_WAVE_B2_SOURCE_FAMILIES = [
  "CONSECUTIVE_COMPOSITES",
  "CONSECUTIVE_ODD_NUMBERS_REPROBE",
  "CONSECUTIVE_EVEN_NUMBERS_REPROBE",
  "PRIME_GAP_SEQUENCE",
  "INDEXED_CHANGING_POWERS",
  "ALTERNATING_SIGN_PROGRESSIVE_MAGNITUDE",
  "ALTERNATING_ADD_SUBTRACT_STEPS",
] as const;

export type SerWaveB2SourceFamily = (typeof SER_WAVE_B2_SOURCE_FAMILIES)[number];
export type SerWaveB2TaskKind = "NEXT_TERM" | "MISSING_TERM" | "PREVIOUS_TERM" | "WRONG_TERM";
export type SerWaveB2Authority =
  | "COMPOSITE_SUCCESSOR_SEQUENCE"
  | "UNIFORM_ADDITIVE_STEP"
  | "PRIME_GAP_DERIVED_SEQUENCE"
  | "INDEXED_POWER_SCHEDULE"
  | "ALTERNATING_SIGN_MAGNITUDE_SEQUENCE"
  | "TWO_INTERLEAVED_ARITHMETIC";

export interface SerWaveB2Template {
  readonly temporaryTemplateId: string;
  readonly sourceFamilyId: SerWaveB2SourceFamily;
  readonly canonicalAuthorityId: SerWaveB2Authority;
  readonly taskKind: SerWaveB2TaskKind;
}

const TASKS: readonly SerWaveB2TaskKind[] = ["NEXT_TERM", "MISSING_TERM", "PREVIOUS_TERM", "WRONG_TERM"];

function authorityFor(source: SerWaveB2SourceFamily): SerWaveB2Authority {
  switch (source) {
    case "CONSECUTIVE_COMPOSITES": return "COMPOSITE_SUCCESSOR_SEQUENCE";
    case "CONSECUTIVE_ODD_NUMBERS_REPROBE":
    case "CONSECUTIVE_EVEN_NUMBERS_REPROBE": return "UNIFORM_ADDITIVE_STEP";
    case "PRIME_GAP_SEQUENCE": return "PRIME_GAP_DERIVED_SEQUENCE";
    case "INDEXED_CHANGING_POWERS": return "INDEXED_POWER_SCHEDULE";
    case "ALTERNATING_SIGN_PROGRESSIVE_MAGNITUDE": return "ALTERNATING_SIGN_MAGNITUDE_SEQUENCE";
    case "ALTERNATING_ADD_SUBTRACT_STEPS": return "TWO_INTERLEAVED_ARITHMETIC";
  }
}

export const SER_WAVE_B2_TEMPLATES: readonly SerWaveB2Template[] = SER_WAVE_B2_SOURCE_FAMILIES.flatMap(
  (sourceFamilyId, familyIndex) => TASKS.map((taskKind, taskIndex) => ({
    temporaryTemplateId: `SER-WAVE-B2-TMP-${String(familyIndex * 4 + taskIndex + 1).padStart(3, "0")}`,
    sourceFamilyId,
    canonicalAuthorityId: authorityFor(sourceFamilyId),
    taskKind,
  })),
);

function isPrime(value: number): boolean {
  if (value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function composites(start: number, length: number): number[] {
  const result: number[] = [];
  for (let value = Math.max(4, start); result.length < length; value += 1) {
    if (!isPrime(value)) result.push(value);
  }
  return result;
}

function primes(start: number, length: number): number[] {
  const result: number[] = [];
  for (let value = Math.max(2, start); result.length < length; value += 1) {
    if (isPrime(value)) result.push(value);
  }
  return result;
}

function sequenceFor(source: SerWaveB2SourceFamily, seed: number): number[] {
  const length = 8;
  switch (source) {
    case "CONSECUTIVE_COMPOSITES":
      return composites(4 + (seed % 12), length);
    case "CONSECUTIVE_ODD_NUMBERS_REPROBE": {
      const start = 1 + 2 * (seed % 8);
      return Array.from({ length }, (_, index) => start + 2 * index);
    }
    case "CONSECUTIVE_EVEN_NUMBERS_REPROBE": {
      const start = 2 + 2 * (seed % 8);
      return Array.from({ length }, (_, index) => start + 2 * index);
    }
    case "PRIME_GAP_SEQUENCE": {
      const primeList = primes(2 + (seed % 10), length + 1);
      return primeList.slice(1).map((value, index) => value - primeList[index]!);
    }
    case "INDEXED_CHANGING_POWERS": {
      const offset = seed % 3;
      const exponent = 2 + (seed % 2);
      return Array.from({ length }, (_, index) => Math.pow(index + 1 + offset, exponent));
    }
    case "ALTERNATING_SIGN_PROGRESSIVE_MAGNITUDE": {
      const start = 1 + (seed % 7);
      const step = 1 + (seed % 4);
      return Array.from({ length }, (_, index) => (index % 2 === 0 ? 1 : -1) * (start + step * index));
    }
    case "ALTERNATING_ADD_SUBTRACT_STEPS": {
      const start = 10 + (seed % 15);
      const add = 2 + (seed % 4);
      const subtract = 1 + (seed % 3);
      const values = [start];
      for (let index = 1; index < length; index += 1) {
        values.push(values[index - 1]! + (index % 2 === 1 ? add : -subtract));
      }
      return values;
    }
  }
}

export interface SerWaveB2Question {
  readonly questionId: string;
  readonly temporaryTemplateId: string;
  readonly permanentQlId: null;
  readonly sourceFamilyId: SerWaveB2SourceFamily;
  readonly canonicalAuthorityId: SerWaveB2Authority;
  readonly taskKind: SerWaveB2TaskKind;
  readonly sequence: readonly (number | null)[];
  readonly canonicalSequence: readonly number[];
  readonly correctAnswer: number;
  readonly correctIndex: number;
  readonly lifecycle: {
    readonly maturity: "OPEN_EXECUTABLE_DISCOVERY";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export function generateSerWaveB2Question(template: SerWaveB2Template, seed: number): SerWaveB2Question {
  const canonicalSequence = sequenceFor(template.sourceFamilyId, seed);
  const displayed: (number | null)[] = [...canonicalSequence];
  let targetIndex = canonicalSequence.length - 1;
  if (template.taskKind === "NEXT_TERM") {
    displayed.pop();
  } else if (template.taskKind === "PREVIOUS_TERM") {
    targetIndex = 0;
    displayed.shift();
  } else if (template.taskKind === "MISSING_TERM") {
    targetIndex = 2 + (seed % 3);
    displayed[targetIndex] = null;
  } else {
    targetIndex = 2 + (seed % 3);
    displayed[targetIndex] = canonicalSequence[targetIndex]! + 1 + (seed % 5);
  }
  return {
    questionId: `${template.temporaryTemplateId}-${seed}`,
    temporaryTemplateId: template.temporaryTemplateId,
    permanentQlId: null,
    sourceFamilyId: template.sourceFamilyId,
    canonicalAuthorityId: template.canonicalAuthorityId,
    taskKind: template.taskKind,
    sequence: displayed,
    canonicalSequence,
    correctAnswer: canonicalSequence[targetIndex]!,
    correctIndex: seed % 4,
    lifecycle: {
      maturity: "OPEN_EXECUTABLE_DISCOVERY",
      active: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}

export function independentlyProject(source: SerWaveB2SourceFamily, seed: number): readonly number[] {
  return sequenceFor(source, seed);
}
