import {
  addRational,
  compareRational,
  divideRational,
  isPositiveRational,
  multiplyRational,
  rational,
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import type { AlligationCross, BlendComponent, BlendState, Rational } from "./types";

export function validateBlendComponents(components: readonly BlendComponent[]): void {
  if (components.length < 1) throw new Error("A blend must contain at least one component.");
  const ids = new Set<string>();
  for (const component of components) {
    if (!component.id.trim()) throw new Error("Every component requires an ID.");
    if (ids.has(component.id)) throw new Error(`Duplicate component ID: ${component.id}.`);
    ids.add(component.id);
    if (!component.label.trim()) throw new Error(`Component ${component.id} requires a label.`);
    if (!isPositiveRational(component.quantity)) {
      throw new Error(`Component ${component.id} must have a positive quantity.`);
    }
  }
}

export function buildBlendState(components: readonly BlendComponent[]): BlendState {
  validateBlendComponents(components);
  let totalQuantity = rational(0);
  let weightedTotal = rational(0);
  for (const component of components) {
    totalQuantity = addRational(totalQuantity, component.quantity);
    weightedTotal = addRational(
      weightedTotal,
      multiplyRational(component.quantity, component.value),
    );
  }
  return {
    components: [...components],
    totalQuantity,
    weightedTotal,
    meanValue: divideRational(weightedTotal, totalQuantity),
  };
}

export function weightedBalanceResidual(
  components: readonly BlendComponent[],
  targetValue: Rational,
): Rational {
  const state = buildBlendState(components);
  return subtractRational(
    state.weightedTotal,
    multiplyRational(state.totalQuantity, targetValue),
  );
}

export function buildAlligationCross(
  lowerValue: Rational,
  higherValue: Rational,
  targetValue: Rational,
): AlligationCross {
  if (compareRational(lowerValue, targetValue) >= 0) {
    throw new Error("The lower source value must be below the target value.");
  }
  if (compareRational(targetValue, higherValue) >= 0) {
    throw new Error("The higher source value must be above the target value.");
  }
  const lowerDifference = subtractRational(higherValue, targetValue);
  const higherDifference = subtractRational(targetValue, lowerValue);
  const [lowerQuantityPart, higherQuantityPart] = reduceRationalRatio(
    lowerDifference,
    higherDifference,
  );
  return {
    lowerValue,
    targetValue,
    higherValue,
    lowerQuantityPart,
    higherQuantityPart,
  };
}

export function assertTargetWithinSources(
  lowerValue: Rational,
  higherValue: Rational,
  targetValue: Rational,
): void {
  buildAlligationCross(lowerValue, higherValue, targetValue);
}
