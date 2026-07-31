import {
  addRational,
  rational,
  rationalKey,
  reduceRationalRatio,
} from "./rational";
import type {
  MalCp002ComponentId,
  MalCp002ExecutablePrototypeId,
  MalCp002Ratio,
  MalCp002SolveRequest,
  MalCp002State,
} from "./cp002-types";

const RATIO_PAIRS = [
  [1, 1],
  [1, 2],
  [2, 1],
  [2, 3],
  [3, 2],
  [3, 4],
  [4, 3],
  [3, 5],
  [5, 3],
  [4, 5],
  [5, 4],
  [5, 7],
  [7, 5],
] as const;

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

  int(min: number, max: number): number {
    if (max < min) throw new Error(`Invalid deterministic range ${min}..${max}.`);
    return min + (this.next() % (max - min + 1));
  }

  pick<T>(values: readonly T[]): T {
    if (values.length === 0) throw new Error("Cannot pick from an empty list.");
    return values[this.next() % values.length]!;
  }

  bool(): boolean {
    return (this.next() & 1) === 1;
  }
}

function ratio(componentAPart: number, componentBPart: number): MalCp002Ratio {
  return {
    componentAPart: rational(componentAPart),
    componentBPart: rational(componentBPart),
  };
}

function state(componentA: number, componentB: number): MalCp002State {
  return {
    componentA: rational(componentA),
    componentB: rational(componentB),
  };
}

function chooseRatio(random: DeterministicRandom): readonly [number, number] {
  return random.pick(RATIO_PAIRS);
}

function chooseComponent(random: DeterministicRandom): MalCp002ComponentId {
  return random.bool() ? "A" : "B";
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? `${item}n` : item,
  );
}

function buildTargetAdjustmentRequest(
  random: DeterministicRandom,
  adjustmentKind: "ADD" | "REMOVE",
): MalCp002SolveRequest {
  const [ratioA, ratioB] = chooseRatio(random);
  const scale = random.int(8, 80);
  const finalA = ratioA * scale;
  const finalB = ratioB * scale;
  const changedComponent = chooseComponent(random);
  const finalChanged = changedComponent === "A" ? finalA : finalB;
  const maxDelta = Math.max(1, Math.min(finalChanged - 1, random.int(2, 25)));
  const delta = random.int(1, maxDelta);

  const initialState =
    adjustmentKind === "ADD"
      ? state(
          changedComponent === "A" ? finalA - delta : finalA,
          changedComponent === "B" ? finalB - delta : finalB,
        )
      : state(
          changedComponent === "A" ? finalA + delta : finalA,
          changedComponent === "B" ? finalB + delta : finalB,
        );

  return {
    mode: "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET",
    initialState,
    changedComponent,
    adjustmentKind,
    targetRatio: ratio(ratioA, ratioB),
  };
}

function buildForwardRatioRequest(
  random: DeterministicRandom,
  adjustmentKind: "ADD" | "REMOVE",
): MalCp002SolveRequest {
  const changedComponent = chooseComponent(random);
  const componentA = random.int(12, 180);
  const componentB = random.int(12, 180);
  const changedInitial = changedComponent === "A" ? componentA : componentB;
  const maxDelta =
    adjustmentKind === "REMOVE"
      ? Math.max(1, Math.min(changedInitial - 1, 40))
      : 40;
  const adjustmentQuantity = random.int(1, maxDelta);

  return {
    mode: "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT",
    initialState: state(componentA, componentB),
    changedComponent,
    adjustmentKind,
    adjustmentQuantity: rational(adjustmentQuantity),
  };
}

function buildOriginalRatioRequest(
  random: DeterministicRandom,
  adjustmentKind: "ADD" | "REMOVE",
): MalCp002SolveRequest {
  const changedComponent = chooseComponent(random);
  const originalA = random.int(15, 180);
  const originalB = random.int(15, 180);
  const originalChanged = changedComponent === "A" ? originalA : originalB;
  const maxDelta =
    adjustmentKind === "REMOVE"
      ? Math.max(1, Math.min(originalChanged - 1, 35))
      : 35;
  const delta = random.int(1, maxDelta);
  const finalState =
    adjustmentKind === "ADD"
      ? state(
          changedComponent === "A" ? originalA + delta : originalA,
          changedComponent === "B" ? originalB + delta : originalB,
        )
      : state(
          changedComponent === "A" ? originalA - delta : originalA,
          changedComponent === "B" ? originalB - delta : originalB,
        );

  return {
    mode: "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT",
    finalState,
    changedComponent,
    adjustmentKind,
    adjustmentQuantity: rational(delta),
  };
}

function buildTotalAndRatioRequest(
  random: DeterministicRandom,
): MalCp002SolveRequest {
  const [ratioA, ratioB] = chooseRatio(random);
  const scale = random.int(4, 120);
  return {
    mode: "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO",
    totalQuantity: rational((ratioA + ratioB) * scale),
    ratio: ratio(ratioA, ratioB),
  };
}

function applySingleReplacementForGeneration(
  initialState: MalCp002State,
  replacementComponent: MalCp002ComponentId,
  removedQuantity: number,
): MalCp002State {
  const total = Number(
    initialState.componentA.numerator + initialState.componentB.numerator,
  );
  const retainedNumerator = total - removedQuantity;
  const retainedDenominator = total;
  const retainedA = rational(
    Number(initialState.componentA.numerator) * retainedNumerator,
    retainedDenominator,
  );
  const retainedB = rational(
    Number(initialState.componentB.numerator) * retainedNumerator,
    retainedDenominator,
  );
  return replacementComponent === "A"
    ? {
        componentA: addRational(retainedA, rational(removedQuantity)),
        componentB: retainedB,
      }
    : {
        componentA: retainedA,
        componentB: addRational(retainedB, rational(removedQuantity)),
      };
}

function buildSingleReplacementRequest(
  random: DeterministicRandom,
): MalCp002SolveRequest {
  const [ratioA, ratioB] = chooseRatio(random);
  const scale = random.int(10, 90);
  const initialState = state(ratioA * scale, ratioB * scale);
  const total = (ratioA + ratioB) * scale;
  const divisor = random.pick([4, 5, 6, 8, 10] as const);
  const removedQuantity = Math.max(1, Math.floor(total / divisor));
  const replacementComponent = chooseComponent(random);
  const finalState = applySingleReplacementForGeneration(
    initialState,
    replacementComponent,
    removedQuantity,
  );
  const [componentAPart, componentBPart] = reduceRationalRatio(
    finalState.componentA,
    finalState.componentB,
  );

  return {
    mode: "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET",
    initialState,
    replacementComponent,
    targetRatio: { componentAPart, componentBPart },
  };
}

export interface MalCp002GeneratedParameters {
  prototypeId: MalCp002ExecutablePrototypeId;
  seed: string;
  request: MalCp002SolveRequest;
  generationFingerprint: string;
  construction: "VALID_STATE_FIRST";
}

export function generateMalCp002Parameters(
  prototypeId: MalCp002ExecutablePrototypeId,
  seed: string,
): MalCp002GeneratedParameters {
  const random = new DeterministicRandom(`${prototypeId}:${seed}`);
  let request: MalCp002SolveRequest;

  switch (prototypeId) {
    case "MAL-CP002-PROT-ADD-COMPONENT-FOR-TARGET-RATIO":
      request = buildTargetAdjustmentRequest(random, "ADD");
      break;
    case "MAL-CP002-PROT-REMOVE-COMPONENT-FOR-TARGET-RATIO":
      request = buildTargetAdjustmentRequest(random, "REMOVE");
      break;
    case "MAL-CP002-PROT-RATIO-AFTER-COMPONENT-ADDITION":
      request = buildForwardRatioRequest(random, "ADD");
      break;
    case "MAL-CP002-PROT-RATIO-AFTER-COMPONENT-REMOVAL":
      request = buildForwardRatioRequest(random, "REMOVE");
      break;
    case "MAL-CP002-PROT-ORIGINAL-RATIO-BEFORE-ADDITION":
      request = buildOriginalRatioRequest(random, "ADD");
      break;
    case "MAL-CP002-PROT-ORIGINAL-RATIO-BEFORE-REMOVAL":
      request = buildOriginalRatioRequest(random, "REMOVE");
      break;
    case "MAL-CP002-PROT-COMPONENTS-FROM-TOTAL-AND-RATIO":
      request = buildTotalAndRatioRequest(random);
      break;
    case "MAL-CP002-PROT-SINGLE-REMOVE-REFILL-FOR-TARGET-RATIO":
      request = buildSingleReplacementRequest(random);
      break;
  }

  return {
    prototypeId,
    seed,
    request,
    generationFingerprint: `${prototypeId}:${hashSeed(stable(request))
      .toString(16)
      .padStart(8, "0")}`,
    construction: "VALID_STATE_FIRST",
  };
}

export function malCp002RequestFingerprint(request: MalCp002SolveRequest): string {
  switch (request.mode) {
    case "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET":
      return [
        request.mode,
        request.changedComponent,
        request.adjustmentKind,
        rationalKey(request.initialState.componentA),
        rationalKey(request.initialState.componentB),
        rationalKey(request.targetRatio.componentAPart),
        rationalKey(request.targetRatio.componentBPart),
      ].join(":");
    case "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT":
      return [
        request.mode,
        request.changedComponent,
        request.adjustmentKind,
        rationalKey(request.initialState.componentA),
        rationalKey(request.initialState.componentB),
        rationalKey(request.adjustmentQuantity),
      ].join(":");
    case "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT":
      return [
        request.mode,
        request.changedComponent,
        request.adjustmentKind,
        rationalKey(request.finalState.componentA),
        rationalKey(request.finalState.componentB),
        rationalKey(request.adjustmentQuantity),
      ].join(":");
    case "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO":
      return [
        request.mode,
        rationalKey(request.totalQuantity),
        rationalKey(request.ratio.componentAPart),
        rationalKey(request.ratio.componentBPart),
      ].join(":");
    case "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET":
      return [
        request.mode,
        request.replacementComponent,
        rationalKey(request.initialState.componentA),
        rationalKey(request.initialState.componentB),
        rationalKey(request.targetRatio.componentAPart),
        rationalKey(request.targetRatio.componentBPart),
      ].join(":");
  }
}
