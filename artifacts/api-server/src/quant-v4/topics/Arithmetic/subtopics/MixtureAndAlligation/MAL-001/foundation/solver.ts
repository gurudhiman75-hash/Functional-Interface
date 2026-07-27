import {
  addRational,
  divideRational,
  isPositiveRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import { buildAlligationCross, buildBlendState } from "./state-model";
import type {
  BlendComponent,
  MalCp001SolveRequest,
  MalCp001SolveResult,
  Rational,
} from "./types";

function totals(components: readonly BlendComponent[]): {
  quantity: Rational;
  weighted: Rational;
} {
  const state = buildBlendState(components);
  return { quantity: state.totalQuantity, weighted: state.weightedTotal };
}

function requirePositive(value: Rational, label: string): Rational {
  if (!isPositiveRational(value)) throw new Error(`${label} must be positive.`);
  return value;
}

export function solveMalCp001(request: MalCp001SolveRequest): MalCp001SolveResult {
  switch (request.mode) {
    case "MEAN_FROM_COMPONENTS": {
      const state = buildBlendState(request.components);
      return { kind: "MEAN_VALUE", value: state.meanValue, state };
    }
    case "TWO_COMPONENT_RATIO_FROM_TARGET": {
      const cross = buildAlligationCross(
        request.lowerValue,
        request.higherValue,
        request.targetValue,
      );
      return {
        kind: "COMPONENT_RATIO",
        firstPart: cross.lowerQuantityPart,
        secondPart: cross.higherQuantityPart,
        cross,
      };
    }
    case "UNKNOWN_COMPONENT_VALUE": {
      const known = totals(request.knownComponents);
      const finalQuantity = addRational(known.quantity, request.unknownQuantity);
      const targetWeighted = multiplyRational(finalQuantity, request.targetValue);
      const unknownWeighted = subtractRational(targetWeighted, known.weighted);
      return {
        kind: "SOURCE_VALUE",
        value: divideRational(unknownWeighted, request.unknownQuantity),
      };
    }
    case "UNKNOWN_COMPONENT_QUANTITY": {
      const known = totals(request.knownComponents);
      const numerator = subtractRational(
        multiplyRational(request.targetValue, known.quantity),
        known.weighted,
      );
      const denominator = subtractRational(request.unknownValue, request.targetValue);
      return {
        kind: "COMPONENT_QUANTITY",
        quantity: requirePositive(
          divideRational(numerator, denominator),
          "Recovered component quantity",
        ),
      };
    }
    case "ADD_SOURCE_TO_REACH_TARGET": {
      const initial = totals(request.initialComponents);
      const numerator = subtractRational(
        multiplyRational(request.targetValue, initial.quantity),
        initial.weighted,
      );
      const denominator = subtractRational(request.addedValue, request.targetValue);
      return {
        kind: "COMPONENT_QUANTITY",
        quantity: requirePositive(
          divideRational(numerator, denominator),
          "Required added quantity",
        ),
      };
    }
    case "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET": {
      const lowerNumerator = multiplyRational(
        request.totalQuantity,
        subtractRational(request.higherValue, request.targetValue),
      );
      const valueGap = subtractRational(request.higherValue, request.lowerValue);
      const firstQuantity = requirePositive(
        divideRational(lowerNumerator, valueGap),
        "Lower-value quantity",
      );
      const secondQuantity = requirePositive(
        subtractRational(request.totalQuantity, firstQuantity),
        "Higher-value quantity",
      );
      return {
        kind: "COMPONENT_QUANTITY_PAIR",
        firstQuantity,
        secondQuantity,
      };
    }
  }
}

export function resultToScalar(result: MalCp001SolveResult): Rational | null {
  switch (result.kind) {
    case "MEAN_VALUE":
    case "SOURCE_VALUE":
      return result.value;
    case "COMPONENT_QUANTITY":
      return result.quantity;
    case "COMPONENT_RATIO":
    case "COMPONENT_QUANTITY_PAIR":
      return null;
  }
}

export function scaledScalarResult(
  source: MalCp001SolveResult,
  numerator: bigint | number,
  denominator: bigint | number = 1,
): MalCp001SolveResult | null {
  const factor = rational(numerator, denominator);
  switch (source.kind) {
    case "MEAN_VALUE":
      return { ...source, value: multiplyRational(source.value, factor) };
    case "SOURCE_VALUE":
      return { ...source, value: multiplyRational(source.value, factor) };
    case "COMPONENT_QUANTITY":
      return { ...source, quantity: multiplyRational(source.quantity, factor) };
    case "COMPONENT_RATIO":
    case "COMPONENT_QUANTITY_PAIR":
      return null;
  }
}
