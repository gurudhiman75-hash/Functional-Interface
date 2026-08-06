import {
  divideRational,
  multiplyRational,
  rational,
  rationalKey,
} from "./rational";
import { powerRational } from "./cp003-solver";
import type {
  MalCp003ExecutablePrototypeId,
  MalCp003SolveRequest,
} from "./cp003-types";

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

class DeterministicRandom {
  private state: number;

  constructor(seed: string) {
    this.state = hashSeed(seed) || 0x9e3779b9;
  }

  next(): number {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state;
  }

  int(minimum: number, maximum: number): number {
    if (maximum < minimum) {
      throw new Error(`Invalid deterministic range ${minimum}..${maximum}.`);
    }
    return minimum + (this.next() % (maximum - minimum + 1));
  }

  pick<T>(values: readonly T[]): T {
    if (values.length === 0) throw new Error("Cannot pick from an empty list.");
    return values[this.next() % values.length]!;
  }
}

/**
 * One exam-friendly case per retained-fraction family. The V2 editorial
 * selector deliberately rotates these families instead of allowing 3/4 to
 * dominate the generated corpus.
 */
const EQUAL_STAGE_CASES = [
  { volume: 60, removed: 30 },  // 1/2
  { volume: 50, removed: 20 },  // 3/5
  { volume: 80, removed: 30 },  // 5/8
  { volume: 81, removed: 27 },  // 2/3
  { volume: 100, removed: 30 }, // 7/10
  { volume: 64, removed: 16 },  // 3/4
  { volume: 100, removed: 20 }, // 4/5
  { volume: 90, removed: 15 },  // 5/6
  { volume: 80, removed: 10 },  // 7/8
  { volume: 100, removed: 10 }, // 9/10
  { volume: 120, removed: 10 }, // 11/12
] as const;

const INITIAL_SHARES = [
  rational(1),
  rational(3, 4),
  rational(2, 3),
  rational(3, 5),
  rational(1, 2),
  rational(4, 5),
] as const;

const UNEQUAL_DIVISOR_SEQUENCES = [
  [2, 4],
  [3, 5, 6],
  [4, 5],
  [5, 4, 8],
  [6, 3, 4],
  [8, 5, 4],
  [10, 5, 8],
  [12, 6, 4],
] as const;

const STAGE_DIVISORS = [2, 3, 4, 5, 6, 8, 10, 12] as const;
const MULTI_STAGE_VOLUMES = [120, 240, 360, 480] as const;

function retainedFraction(volume: number, removed: number) {
  return rational(volume - removed, volume);
}

function initialOriginalQuantity(volume: number, random: DeterministicRandom) {
  return multiplyRational(rational(volume), random.pick(INITIAL_SHARES));
}

function equalFinal(
  volume: number,
  removed: number,
  operations: number,
  initialQuantity: ReturnType<typeof rational>,
) {
  return multiplyRational(
    initialQuantity,
    powerRational(retainedFraction(volume, removed), operations),
  );
}

export interface MalCp003GeneratedParameters {
  prototypeId: MalCp003ExecutablePrototypeId;
  seed: string;
  request: MalCp003SolveRequest;
  generationFingerprint: string;
  construction: "VALID_STATE_FIRST";
}

export function generateMalCp003Parameters(
  prototypeId: MalCp003ExecutablePrototypeId,
  seed = `mal-cp003:${prototypeId}:default`,
): MalCp003GeneratedParameters {
  const random = new DeterministicRandom(`${prototypeId}:${seed}`);
  const selected = random.pick(EQUAL_STAGE_CASES);
  const vesselVolume = rational(selected.volume);
  const removedQuantity = rational(selected.removed);
  const operations = random.int(2, 5);
  let request: MalCp003SolveRequest;

  switch (prototypeId) {
    case "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS":
      request = {
        mode: "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES",
        vesselVolume,
        initialOriginalQuantity: initialOriginalQuantity(selected.volume, random),
        removedQuantity,
        operations,
      };
      break;

    case "MAL-CP003-PROT-FINAL-ORIGINAL-FRACTION-EQUAL-REPLACEMENTS":
      request = {
        mode: "FINAL_ORIGINAL_FRACTION_EQUAL_STAGES",
        removedFraction: divideRational(removedQuantity, vesselVolume),
        operations,
      };
      break;

    case "MAL-CP003-PROT-FINAL-REFILL-QUANTITY-EQUAL-REPLACEMENTS":
      request = {
        mode: "FINAL_REFILL_QUANTITY_EQUAL_STAGES",
        vesselVolume,
        removedQuantity,
        operations,
      };
      break;

    case "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL": {
      const initial = initialOriginalQuantity(selected.volume, random);
      request = {
        mode: "INITIAL_ORIGINAL_QUANTITY_FROM_FINAL",
        vesselVolume,
        finalOriginalQuantity: equalFinal(
          selected.volume,
          selected.removed,
          operations,
          initial,
        ),
        removedQuantity,
        operations,
      };
      break;
    }

    case "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL": {
      const initial = initialOriginalQuantity(selected.volume, random);
      request = {
        mode: "REMOVAL_QUANTITY_FROM_FINAL",
        vesselVolume,
        initialOriginalQuantity: initial,
        finalOriginalQuantity: equalFinal(
          selected.volume,
          selected.removed,
          operations,
          initial,
        ),
        operations,
      };
      break;
    }

    case "MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL": {
      const initial = initialOriginalQuantity(selected.volume, random);
      request = {
        mode: "OPERATION_COUNT_FROM_FINAL",
        vesselVolume,
        initialOriginalQuantity: initial,
        finalOriginalQuantity: equalFinal(
          selected.volume,
          selected.removed,
          operations,
          initial,
        ),
        removedQuantity,
        maximumOperations: 10,
      };
      break;
    }

    case "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS": {
      const divisors = random.pick(UNEQUAL_DIVISOR_SEQUENCES);
      const volume = random.pick(MULTI_STAGE_VOLUMES);
      request = {
        mode: "FINAL_ORIGINAL_QUANTITY_UNEQUAL_STAGES",
        vesselVolume: rational(volume),
        initialOriginalQuantity: initialOriginalQuantity(volume, random),
        removedQuantities: divisors.map((divisor) => rational(volume, divisor)),
      };
      break;
    }

    case "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION": {
      const volume = random.pick(MULTI_STAGE_VOLUMES);
      const firstRemoved = rational(volume, random.pick(STAGE_DIVISORS));
      const secondRemoved = rational(volume, random.pick(STAGE_DIVISORS));
      request = {
        mode: "FINAL_THREE_COMPONENT_STATE",
        vesselVolume: rational(volume),
        initialState: {
          componentA: rational(volume),
          componentB: rational(0),
          componentC: rational(0),
        },
        stages: [
          { removedQuantity: firstRemoved, refillComponent: "B" },
          { removedQuantity: secondRemoved, refillComponent: "C" },
        ],
      };
      break;
    }
  }

  return {
    prototypeId,
    seed,
    request,
    generationFingerprint: `${prototypeId}:${hashSeed(
      malCp003RequestFingerprint(request),
    )
      .toString(16)
      .padStart(8, "0")}`,
    construction: "VALID_STATE_FIRST",
  };
}

export function malCp003RequestFingerprint(request: MalCp003SolveRequest): string {
  switch (request.mode) {
    case "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES":
      return [
        request.mode,
        rationalKey(request.vesselVolume),
        rationalKey(request.initialOriginalQuantity),
        rationalKey(request.removedQuantity),
        request.operations,
      ].join(":");
    case "FINAL_ORIGINAL_FRACTION_EQUAL_STAGES":
      return [
        request.mode,
        rationalKey(request.removedFraction),
        request.operations,
      ].join(":");
    case "FINAL_REFILL_QUANTITY_EQUAL_STAGES":
      return [
        request.mode,
        rationalKey(request.vesselVolume),
        rationalKey(request.removedQuantity),
        request.operations,
      ].join(":");
    case "INITIAL_ORIGINAL_QUANTITY_FROM_FINAL":
      return [
        request.mode,
        rationalKey(request.vesselVolume),
        rationalKey(request.finalOriginalQuantity),
        rationalKey(request.removedQuantity),
        request.operations,
      ].join(":");
    case "REMOVAL_QUANTITY_FROM_FINAL":
      return [
        request.mode,
        rationalKey(request.vesselVolume),
        rationalKey(request.initialOriginalQuantity),
        rationalKey(request.finalOriginalQuantity),
        request.operations,
      ].join(":");
    case "OPERATION_COUNT_FROM_FINAL":
      return [
        request.mode,
        rationalKey(request.vesselVolume),
        rationalKey(request.initialOriginalQuantity),
        rationalKey(request.finalOriginalQuantity),
        rationalKey(request.removedQuantity),
        request.maximumOperations,
      ].join(":");
    case "FINAL_ORIGINAL_QUANTITY_UNEQUAL_STAGES":
      return [
        request.mode,
        rationalKey(request.vesselVolume),
        rationalKey(request.initialOriginalQuantity),
        ...request.removedQuantities.map(rationalKey),
      ].join(":");
    case "FINAL_THREE_COMPONENT_STATE":
      return [
        request.mode,
        rationalKey(request.vesselVolume),
        rationalKey(request.initialState.componentA),
        rationalKey(request.initialState.componentB),
        rationalKey(request.initialState.componentC),
        ...request.stages.flatMap((stage) => [
          rationalKey(stage.removedQuantity),
          stage.refillComponent,
        ]),
      ].join(":");
  }
}
