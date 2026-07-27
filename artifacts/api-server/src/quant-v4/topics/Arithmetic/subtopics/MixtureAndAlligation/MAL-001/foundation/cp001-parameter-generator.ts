import {
  addRational,
  formatRational,
  rational,
  rationalKey,
} from "./rational";
import { buildBlendState } from "./state-model";
import type {
  BlendComponent,
  MalCp001Context,
  MalCp001PrototypeId,
  MalCp001PrototypeParameters,
  MalCp001SolveRequest,
  MalDifficulty,
  Rational,
} from "./types";

class SeededPicker {
  private state: number;

  constructor(seed: string) {
    let hash = 2166136261;
    for (const character of seed) {
      hash ^= character.codePointAt(0) ?? 0;
      hash = Math.imul(hash, 16777619);
    }
    this.state = hash >>> 0 || 0x9e3779b9;
  }

  nextUint32(): number {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state;
  }

  index(length: number): number {
    if (length <= 0) throw new Error("Cannot pick from an empty collection.");
    return this.nextUint32() % length;
  }

  pick<T>(values: readonly T[]): T {
    return values[this.index(values.length)];
  }
}

const CONTEXTS: readonly MalCp001Context[] = [
  {
    scenarioId: "rice-grades",
    actor: "A grain merchant",
    material: "rice",
    lowerLabel: "standard-grade rice",
    higherLabel: "premium-grade rice",
    thirdLabel: "special-grade rice",
    quantityUnit: "kg",
    valueUnit: "₹/kg",
  },
  {
    scenarioId: "tea-blend",
    actor: "A tea seller",
    material: "tea leaves",
    lowerLabel: "regular tea leaves",
    higherLabel: "premium tea leaves",
    thirdLabel: "reserve tea leaves",
    quantityUnit: "kg",
    valueUnit: "₹/kg",
  },
  {
    scenarioId: "coffee-blend",
    actor: "A coffee roaster",
    material: "coffee beans",
    lowerLabel: "house-blend beans",
    higherLabel: "estate beans",
    thirdLabel: "reserve beans",
    quantityUnit: "kg",
    valueUnit: "₹/kg",
  },
  {
    scenarioId: "oil-blend",
    actor: "An oil distributor",
    material: "edible oil",
    lowerLabel: "regular oil",
    higherLabel: "premium oil",
    thirdLabel: "cold-pressed oil",
    quantityUnit: "litres",
    valueUnit: "₹/litre",
  },
  {
    scenarioId: "wheat-grades",
    actor: "A wholesaler",
    material: "wheat",
    lowerLabel: "standard wheat",
    higherLabel: "high-grade wheat",
    thirdLabel: "select wheat",
    quantityUnit: "kg",
    valueUnit: "₹/kg",
  },
];

const QUANTITIES = [4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24, 25, 30] as const;
const LOW_VALUES = [24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 60] as const;
const GAPS = [8, 10, 12, 15, 18, 20, 24, 30, 36] as const;
const RATIO_PARTS = [
  [1, 2],
  [2, 1],
  [2, 3],
  [3, 2],
  [3, 4],
  [4, 3],
  [3, 5],
  [5, 3],
] as const;

function component(id: string, label: string, quantity: number, value: number): BlendComponent {
  return { id, label, quantity: rational(quantity), value: rational(value) };
}

function fingerprintComponents(components: readonly BlendComponent[]): string {
  return components
    .map((item) => `${item.id}:${rationalKey(item.quantity)}@${rationalKey(item.value)}`)
    .join("|");
}

function chooseDistinctQuantity(picker: SeededPicker, excluded: number[] = []): number {
  const candidates = QUANTITIES.filter((value) => !excluded.includes(value));
  return picker.pick(candidates);
}

function chooseValues(picker: SeededPicker): { low: number; middle: number; high: number } {
  const low = picker.pick(LOW_VALUES);
  const gap1 = picker.pick(GAPS);
  const gap2 = picker.pick(GAPS.filter((gap) => gap !== gap1));
  const middle = low + gap1;
  const high = middle + gap2;
  return { low, middle, high };
}

function deriveDifficulty(
  prototypeId: MalCp001PrototypeId,
  target: Rational,
  componentCount: number,
): MalDifficulty {
  if (prototypeId === "MAL-CP001-PROT-THIRD-COMPONENT-QUANTITY") return "Hard";
  if (componentCount >= 3 || target.denominator !== 1n) return "Medium";
  if (
    prototypeId === "MAL-CP001-PROT-UNKNOWN-SOURCE-VALUE" ||
    prototypeId === "MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY" ||
    prototypeId === "MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET" ||
    prototypeId === "MAL-CP001-PROT-TWO-QUANTITIES-FROM-TOTAL"
  ) {
    return "Medium";
  }
  return "Easy";
}

function buildTwoComponentHiddenState(
  picker: SeededPicker,
  context: MalCp001Context,
  forceRatio?: readonly [number, number],
): { components: BlendComponent[]; low: number; high: number; qLow: number; qHigh: number } {
  const { low, high } = chooseValues(picker);
  const ratio = forceRatio ?? picker.pick(RATIO_PARTS);
  const scale = picker.pick([2, 3, 4, 5, 6] as const);
  const qLow = ratio[0] * scale;
  const qHigh = ratio[1] * scale;
  return {
    components: [
      component("lower", context.lowerLabel, qLow, low),
      component("higher", context.higherLabel, qHigh, high),
    ],
    low,
    high,
    qLow,
    qHigh,
  };
}

function requestFingerprint(request: MalCp001SolveRequest): string {
  switch (request.mode) {
    case "MEAN_FROM_COMPONENTS":
      return `${request.mode}:${fingerprintComponents(request.components)}`;
    case "TWO_COMPONENT_RATIO_FROM_TARGET":
      return `${request.mode}:${rationalKey(request.lowerValue)}:${rationalKey(request.targetValue)}:${rationalKey(request.higherValue)}`;
    case "UNKNOWN_COMPONENT_VALUE":
      return `${request.mode}:${fingerprintComponents(request.knownComponents)}:${rationalKey(request.unknownQuantity)}:${rationalKey(request.targetValue)}`;
    case "UNKNOWN_COMPONENT_QUANTITY":
      return `${request.mode}:${fingerprintComponents(request.knownComponents)}:${rationalKey(request.unknownValue)}:${rationalKey(request.targetValue)}`;
    case "ADD_SOURCE_TO_REACH_TARGET":
      return `${request.mode}:${fingerprintComponents(request.initialComponents)}:${rationalKey(request.addedValue)}:${rationalKey(request.targetValue)}`;
    case "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET":
      return `${request.mode}:${rationalKey(request.lowerValue)}:${rationalKey(request.targetValue)}:${rationalKey(request.higherValue)}:${rationalKey(request.totalQuantity)}`;
  }
}

function buildCandidate(
  prototypeId: MalCp001PrototypeId,
  picker: SeededPicker,
  context: MalCp001Context,
): { request: MalCp001SolveRequest; hiddenComponents: BlendComponent[] } {
  switch (prototypeId) {
    case "MAL-CP001-PROT-RATIO-FROM-TARGET": {
      const hidden = buildTwoComponentHiddenState(picker, context);
      const hiddenState = buildBlendState(hidden.components);
      return {
        request: {
          mode: "TWO_COMPONENT_RATIO_FROM_TARGET",
          lowerValue: rational(hidden.low),
          higherValue: rational(hidden.high),
          targetValue: hiddenState.meanValue,
        },
        hiddenComponents: hidden.components,
      };
    }
    case "MAL-CP001-PROT-MEAN-FROM-QUANTITIES": {
      const qLow = chooseDistinctQuantity(picker);
      const qHigh = chooseDistinctQuantity(picker, [qLow]);
      const { low, high } = chooseValues(picker);
      const hiddenComponents = [
        component("lower", context.lowerLabel, qLow, low),
        component("higher", context.higherLabel, qHigh, high),
      ];
      return {
        request: { mode: "MEAN_FROM_COMPONENTS", components: hiddenComponents },
        hiddenComponents,
      };
    }
    case "MAL-CP001-PROT-MEAN-FROM-RATIO": {
      const ratio = picker.pick(RATIO_PARTS);
      const { low, high } = chooseValues(picker);
      const hiddenComponents = [
        component("lower", context.lowerLabel, ratio[0], low),
        component("higher", context.higherLabel, ratio[1], high),
      ];
      return {
        request: { mode: "MEAN_FROM_COMPONENTS", components: hiddenComponents },
        hiddenComponents,
      };
    }
    case "MAL-CP001-PROT-UNKNOWN-SOURCE-VALUE": {
      const hidden = buildTwoComponentHiddenState(picker, context);
      const hiddenState = buildBlendState(hidden.components);
      const hideHigher = picker.index(2) === 0;
      const known = hideHigher ? hidden.components[0] : hidden.components[1];
      const unknown = hideHigher ? hidden.components[1] : hidden.components[0];
      return {
        request: {
          mode: "UNKNOWN_COMPONENT_VALUE",
          knownComponents: [known],
          unknownComponentId: unknown.id,
          unknownComponentLabel: unknown.label,
          unknownQuantity: unknown.quantity,
          targetValue: hiddenState.meanValue,
        },
        hiddenComponents: hidden.components,
      };
    }
    case "MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY": {
      const hidden = buildTwoComponentHiddenState(picker, context);
      const hiddenState = buildBlendState(hidden.components);
      const hideHigher = picker.index(2) === 0;
      const known = hideHigher ? hidden.components[0] : hidden.components[1];
      const unknown = hideHigher ? hidden.components[1] : hidden.components[0];
      return {
        request: {
          mode: "UNKNOWN_COMPONENT_QUANTITY",
          knownComponents: [known],
          unknownComponentId: unknown.id,
          unknownComponentLabel: unknown.label,
          unknownValue: unknown.value,
          targetValue: hiddenState.meanValue,
        },
        hiddenComponents: hidden.components,
      };
    }
    case "MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET": {
      const { low, high } = chooseValues(picker);
      const initialQuantity = chooseDistinctQuantity(picker);
      const addedQuantity = chooseDistinctQuantity(picker, [initialQuantity]);
      const addHigher = picker.index(2) === 0;
      const initialValue = addHigher ? low : high;
      const addedValue = addHigher ? high : low;
      const initial = component("initial", context.lowerLabel, initialQuantity, initialValue);
      const added = component("added", context.higherLabel, addedQuantity, addedValue);
      const hiddenComponents = [initial, added];
      const hiddenState = buildBlendState(hiddenComponents);
      return {
        request: {
          mode: "ADD_SOURCE_TO_REACH_TARGET",
          initialComponents: [initial],
          addedComponentId: added.id,
          addedComponentLabel: added.label,
          addedValue: added.value,
          targetValue: hiddenState.meanValue,
        },
        hiddenComponents,
      };
    }
    case "MAL-CP001-PROT-THREE-COMPONENT-MEAN": {
      const { low, middle, high } = chooseValues(picker);
      const q1 = chooseDistinctQuantity(picker);
      const q2 = chooseDistinctQuantity(picker, [q1]);
      const q3 = chooseDistinctQuantity(picker, [q1, q2]);
      const hiddenComponents = [
        component("lower", context.lowerLabel, q1, low),
        component("middle", context.thirdLabel, q2, middle),
        component("higher", context.higherLabel, q3, high),
      ];
      return {
        request: { mode: "MEAN_FROM_COMPONENTS", components: hiddenComponents },
        hiddenComponents,
      };
    }
    case "MAL-CP001-PROT-THIRD-COMPONENT-QUANTITY": {
      const { low, middle, high } = chooseValues(picker);
      const q1 = chooseDistinctQuantity(picker);
      const q2 = chooseDistinctQuantity(picker, [q1]);
      const q3 = chooseDistinctQuantity(picker, [q1, q2]);
      const hiddenComponents = [
        component("lower", context.lowerLabel, q1, low),
        component("middle", context.thirdLabel, q2, middle),
        component("higher", context.higherLabel, q3, high),
      ];
      const hiddenState = buildBlendState(hiddenComponents);
      return {
        request: {
          mode: "UNKNOWN_COMPONENT_QUANTITY",
          knownComponents: hiddenComponents.slice(0, 2),
          unknownComponentId: hiddenComponents[2].id,
          unknownComponentLabel: hiddenComponents[2].label,
          unknownValue: hiddenComponents[2].value,
          targetValue: hiddenState.meanValue,
        },
        hiddenComponents,
      };
    }
    case "MAL-CP001-PROT-TWO-QUANTITIES-FROM-TOTAL": {
      const hidden = buildTwoComponentHiddenState(picker, context);
      const hiddenState = buildBlendState(hidden.components);
      return {
        request: {
          mode: "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET",
          lowerComponentId: hidden.components[0].id,
          lowerComponentLabel: hidden.components[0].label,
          lowerValue: hidden.components[0].value,
          higherComponentId: hidden.components[1].id,
          higherComponentLabel: hidden.components[1].label,
          higherValue: hidden.components[1].value,
          totalQuantity: addRational(hidden.components[0].quantity, hidden.components[1].quantity),
          targetValue: hiddenState.meanValue,
        },
        hiddenComponents: hidden.components,
      };
    }
  }
}

export function generateMalCp001PrototypeParameters(
  prototypeId: MalCp001PrototypeId,
  seed: string,
): MalCp001PrototypeParameters {
  const picker = new SeededPicker(`${prototypeId}:${seed}`);
  const context = picker.pick(CONTEXTS);

  for (let attempt = 0; attempt < 240; attempt += 1) {
    const { request, hiddenComponents } = buildCandidate(prototypeId, picker, context);
    const hiddenState = buildBlendState(hiddenComponents);

    // Competitive-exam price/value questions should not be built around awkward
    // mixed-fraction currency. Construct another exact state instead of masking
    // or rounding the generated result at presentation time.
    if (hiddenState.meanValue.denominator !== 1n) continue;

    return {
      prototypeId,
      seed,
      context,
      request,
      hiddenState,
      difficulty: deriveDifficulty(prototypeId, hiddenState.meanValue, hiddenComponents.length),
      generationFingerprint: `${prototypeId}:${context.scenarioId}:${requestFingerprint(request)}:mean=${formatRational(hiddenState.meanValue)}`,
    };
  }

  throw new Error(`Could not construct an exam-realistic integral-value state for ${prototypeId}/${seed}.`);
}
