import {
  addRational,
  formatRational,
  rational,
} from "./rational";
import { buildBlendState } from "./state-model";
import type {
  BlendComponent,
  MalCp001Context,
  Rational,
} from "./types";
import type {
  MalCp001GapParameters,
  MalCp001GapPrototypeId,
  MalCp001GapRequest,
} from "./cp001-gap-types";

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

const LOW_VALUES = [20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 60] as const;
const GAPS = [8, 10, 12, 14, 16, 18, 20, 24, 30, 36] as const;
const QUANTITIES = [4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24, 25, 30] as const;
const RATIO_PARTS = [
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
] as const;

function component(
  id: string,
  label: string,
  quantity: number,
  value: number,
): BlendComponent {
  return {
    id,
    label,
    quantity: rational(quantity),
    value: rational(value),
  };
}

function chooseValues(picker: SeededPicker): {
  low: number;
  middle: number;
  high: number;
} {
  const low = picker.pick(LOW_VALUES);
  const firstGap = picker.pick(GAPS);
  const secondGap = picker.pick(GAPS.filter((gap) => gap !== firstGap));
  return {
    low,
    middle: low + firstGap,
    high: low + firstGap + secondGap,
  };
}

function chooseDistinctQuantity(
  picker: SeededPicker,
  excluded: readonly number[] = [],
): number {
  return picker.pick(QUANTITIES.filter((value) => !excluded.includes(value)));
}

function rationalText(value: Rational): string {
  return `${value.numerator}/${value.denominator}`;
}

function requestFingerprint(request: MalCp001GapRequest): string {
  return JSON.stringify(request, (_key, value) => {
    if (typeof value === "bigint") return value.toString();
    return value;
  });
}

function buildTwoComponentState(
  picker: SeededPicker,
  context: MalCp001Context,
): {
  components: [BlendComponent, BlendComponent];
  ratio: readonly [number, number];
  low: number;
  high: number;
} {
  const { low, high } = chooseValues(picker);
  const ratio = picker.pick(RATIO_PARTS);
  const scale = picker.pick([2, 3, 4, 5, 6, 8] as const);
  return {
    ratio,
    low,
    high,
    components: [
      component("lower", context.lowerLabel, ratio[0] * scale, low),
      component("higher", context.higherLabel, ratio[1] * scale, high),
    ],
  };
}

function buildRequest(
  prototypeId: MalCp001GapPrototypeId,
  picker: SeededPicker,
  context: MalCp001Context,
): { request: MalCp001GapRequest; hiddenComponents: BlendComponent[] } {
  switch (prototypeId) {
    case "MAL-CP001-PROT-SOURCE-VALUE-FROM-RATIO": {
      const hidden = buildTwoComponentState(picker, context);
      const target = buildBlendState(hidden.components).meanValue;
      const knownSide = picker.index(2) === 0 ? "LOWER" : "HIGHER";
      return {
        request: {
          mode: "SOURCE_VALUE_FROM_RATIO",
          knownSide,
          knownValue: knownSide === "LOWER"
            ? hidden.components[0].value
            : hidden.components[1].value,
          targetValue: target,
          lowerRatioPart: rational(hidden.ratio[0]),
          higherRatioPart: rational(hidden.ratio[1]),
          lowerComponentLabel: context.lowerLabel,
          higherComponentLabel: context.higherLabel,
        },
        hiddenComponents: hidden.components,
      };
    }

    case "MAL-CP001-PROT-COMPONENT-SHARE-FROM-TARGET": {
      const hidden = buildTwoComponentState(picker, context);
      const state = buildBlendState(hidden.components);
      return {
        request: {
          mode: "COMPONENT_SHARE_FROM_TARGET",
          requestedSide: picker.index(2) === 0 ? "LOWER" : "HIGHER",
          lowerValue: hidden.components[0].value,
          higherValue: hidden.components[1].value,
          targetValue: state.meanValue,
          totalQuantity: state.totalQuantity,
          lowerComponentLabel: context.lowerLabel,
          higherComponentLabel: context.higherLabel,
        },
        hiddenComponents: hidden.components,
      };
    }

    case "MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES": {
      const hidden = buildTwoComponentState(picker, context);
      const state = buildBlendState(hidden.components);
      const qLow = Number(hidden.components[0].quantity.numerator);
      const qHigh = Number(hidden.components[1].quantity.numerator);
      return {
        request: {
          mode: "DIFFERENCE_BASED_QUANTITIES",
          lowerValue: hidden.components[0].value,
          higherValue: hidden.components[1].value,
          targetValue: state.meanValue,
          quantityDifference: rational(Math.abs(qLow - qHigh)),
          lowerComponentLabel: context.lowerLabel,
          higherComponentLabel: context.higherLabel,
        },
        hiddenComponents: hidden.components,
      };
    }

    case "MAL-CP001-PROT-TWO-STAGE-BLEND-MEAN": {
      const values = chooseValues(picker);
      const ratio = picker.pick(RATIO_PARTS);
      const preparedScale = picker.pick([3, 4, 5, 6, 8] as const);
      const sampleScale = picker.pick(
        [1, 2, 3, 4].filter((value) => value <= preparedScale),
      );
      const stageOneComponents: [BlendComponent, BlendComponent] = [
        component("stage1-lower", context.lowerLabel, ratio[0] * preparedScale, values.low),
        component("stage1-middle", context.thirdLabel, ratio[1] * preparedScale, values.middle),
      ];
      const stageOneQuantityUsed = rational((ratio[0] + ratio[1]) * sampleScale);
      const finalComponent = component(
        "stage2-higher",
        context.higherLabel,
        chooseDistinctQuantity(picker),
        values.high,
      );
      const stageOneMean = buildBlendState(stageOneComponents).meanValue;
      const finalState = buildBlendState([
        {
          id: "stage1-sample",
          label: `${context.material} from the first blend`,
          quantity: stageOneQuantityUsed,
          value: stageOneMean,
        },
        finalComponent,
      ]);
      return {
        request: {
          mode: "TWO_STAGE_BLEND_MEAN",
          stageOneComponents,
          stageOneQuantityUsed,
          finalComponent,
        },
        hiddenComponents: [
          ...stageOneComponents,
          finalComponent,
          {
            id: "final-target",
            label: "final target",
            quantity: rational(1),
            value: finalState.meanValue,
          },
        ],
      };
    }

    case "MAL-CP001-PROT-TWO-STAGE-UNKNOWN": {
      const values = chooseValues(picker);
      const ratio = picker.pick(RATIO_PARTS);
      const preparedScale = picker.pick([3, 4, 5, 6, 8] as const);
      const sampleScale = picker.pick(
        [1, 2, 3, 4].filter((value) => value <= preparedScale),
      );
      const stageOneComponents: [BlendComponent, BlendComponent] = [
        component("stage1-lower", context.lowerLabel, ratio[0] * preparedScale, values.low),
        component("stage1-middle", context.thirdLabel, ratio[1] * preparedScale, values.middle),
      ];
      const stageOneQuantityUsed = rational((ratio[0] + ratio[1]) * sampleScale);
      const unknownQuantity = chooseDistinctQuantity(picker);
      const finalComponent = component(
        "stage2-higher",
        context.higherLabel,
        unknownQuantity,
        values.high,
      );
      const stageOneMean = buildBlendState(stageOneComponents).meanValue;
      const targetValue = buildBlendState([
        {
          id: "stage1-sample",
          label: `${context.material} from the first blend`,
          quantity: stageOneQuantityUsed,
          value: stageOneMean,
        },
        finalComponent,
      ]).meanValue;
      return {
        request: {
          mode: "TWO_STAGE_UNKNOWN_QUANTITY",
          stageOneComponents,
          stageOneQuantityUsed,
          finalComponentId: finalComponent.id,
          finalComponentLabel: finalComponent.label,
          finalComponentValue: finalComponent.value,
          targetValue,
        },
        hiddenComponents: [...stageOneComponents, finalComponent],
      };
    }

    case "MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION": {
      const values = chooseValues(picker);
      const lowerQuantity = picker.pick([3, 4, 5, 6, 8, 10] as const);
      const multiplier = picker.pick([2, 3] as const);
      const middleQuantity = lowerQuantity * multiplier;
      const higherQuantity = chooseDistinctQuantity(
        picker,
        [lowerQuantity, middleQuantity],
      );
      const hiddenComponents = [
        component("lower", context.lowerLabel, lowerQuantity, values.low),
        component("middle", context.thirdLabel, middleQuantity, values.middle),
        component("higher", context.higherLabel, higherQuantity, values.high),
      ];
      const state = buildBlendState(hiddenComponents);
      return {
        request: {
          mode: "THREE_WAY_TARGET_WITH_RELATION",
          lowerValue: rational(values.low),
          middleValue: rational(values.middle),
          higherValue: rational(values.high),
          middleToLowerMultiplier: rational(multiplier),
          totalQuantity: state.totalQuantity,
          targetValue: state.meanValue,
          lowerComponentLabel: context.lowerLabel,
          middleComponentLabel: context.thirdLabel,
          higherComponentLabel: context.higherLabel,
        },
        hiddenComponents,
      };
    }
  }
}

function deriveDifficulty(prototypeId: MalCp001GapPrototypeId): "Easy" | "Medium" | "Hard" {
  switch (prototypeId) {
    case "MAL-CP001-PROT-SOURCE-VALUE-FROM-RATIO":
    case "MAL-CP001-PROT-COMPONENT-SHARE-FROM-TARGET":
      return "Medium";
    case "MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES":
    case "MAL-CP001-PROT-TWO-STAGE-BLEND-MEAN":
      return "Medium";
    case "MAL-CP001-PROT-TWO-STAGE-UNKNOWN":
    case "MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION":
      return "Hard";
  }
}

function allDisplayedValuesAreWhole(
  request: MalCp001GapRequest,
  hiddenComponents: readonly BlendComponent[],
): boolean {
  const rationals: Rational[] = [];
  for (const component of hiddenComponents) {
    rationals.push(component.quantity, component.value);
  }
  switch (request.mode) {
    case "SOURCE_VALUE_FROM_RATIO":
      rationals.push(
        request.knownValue,
        request.targetValue,
        request.lowerRatioPart,
        request.higherRatioPart,
      );
      break;
    case "COMPONENT_SHARE_FROM_TARGET":
    case "DIFFERENCE_BASED_QUANTITIES":
      rationals.push(
        request.lowerValue,
        request.higherValue,
        request.targetValue,
      );
      break;
    case "TWO_STAGE_BLEND_MEAN":
      rationals.push(request.stageOneQuantityUsed);
      break;
    case "TWO_STAGE_UNKNOWN_QUANTITY":
      rationals.push(
        request.stageOneQuantityUsed,
        request.finalComponentValue,
        request.targetValue,
      );
      break;
    case "THREE_WAY_TARGET_WITH_RELATION":
      rationals.push(
        request.lowerValue,
        request.middleValue,
        request.higherValue,
        request.middleToLowerMultiplier,
        request.totalQuantity,
        request.targetValue,
      );
      break;
  }
  return rationals.every((value) => value.denominator === 1n);
}

export function generateMalCp001GapParameters(
  prototypeId: MalCp001GapPrototypeId,
  seed: string,
): MalCp001GapParameters {
  const picker = new SeededPicker(`${prototypeId}:${seed}`);
  const context = picker.pick(CONTEXTS);

  for (let attempt = 0; attempt < 640; attempt += 1) {
    const { request, hiddenComponents } = buildRequest(prototypeId, picker, context);
    if (!allDisplayedValuesAreWhole(request, hiddenComponents)) continue;

    if (
      request.mode === "DIFFERENCE_BASED_QUANTITIES" &&
      request.quantityDifference.numerator === 0n
    ) {
      continue;
    }

    return {
      prototypeId,
      seed,
      context,
      request,
      hiddenComponents,
      difficulty: deriveDifficulty(prototypeId),
      generationFingerprint:
        `${prototypeId}:${context.scenarioId}:${requestFingerprint(request)}:` +
        hiddenComponents
          .map((item) =>
            `${item.id}:${rationalText(item.quantity)}@${rationalText(item.value)}`,
          )
          .join("|"),
    };
  }

  throw new Error(
    `Could not construct an exact integral gap-prototype state for ${prototypeId}/${seed}.`,
  );
}

export function totalHiddenQuantity(parameters: MalCp001GapParameters): Rational {
  return parameters.hiddenComponents.reduce(
    (sum, item) => addRational(sum, item.quantity),
    rational(0),
  );
}

export function describeGapParameterTarget(parameters: MalCp001GapParameters): string {
  switch (parameters.request.mode) {
    case "SOURCE_VALUE_FROM_RATIO":
    case "COMPONENT_SHARE_FROM_TARGET":
    case "DIFFERENCE_BASED_QUANTITIES":
    case "TWO_STAGE_UNKNOWN_QUANTITY":
    case "THREE_WAY_TARGET_WITH_RELATION":
      return formatRational(parameters.request.targetValue);
    case "TWO_STAGE_BLEND_MEAN":
      return "derived";
  }
}
