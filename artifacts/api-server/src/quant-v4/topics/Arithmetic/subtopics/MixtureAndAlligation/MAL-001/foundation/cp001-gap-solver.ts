import {
  absoluteRational,
  addRational,
  compareRational,
  divideRational,
  isPositiveRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import { buildAlligationCross, buildBlendState } from "./state-model";
import type { BlendComponent, Rational, VerificationResult } from "./types";
import type {
  MalCp001GapRequest,
  MalCp001GapResult,
} from "./cp001-gap-types";

function requirePositive(value: Rational, label: string): Rational {
  if (!isPositiveRational(value)) {
    throw new Error(`${label} must be positive.`);
  }
  return value;
}

function stageOneMean(
  components: readonly [BlendComponent, BlendComponent],
): Rational {
  return buildBlendState(components).meanValue;
}

export function solveMalCp001Gap(
  request: MalCp001GapRequest,
): MalCp001GapResult {
  switch (request.mode) {
    case "SOURCE_VALUE_FROM_RATIO": {
      const totalParts = addRational(
        request.lowerRatioPart,
        request.higherRatioPart,
      );
      const targetWeighted = multiplyRational(
        request.targetValue,
        totalParts,
      );
      if (request.knownSide === "LOWER") {
        return {
          kind: "SOURCE_VALUE",
          value: divideRational(
            subtractRational(
              targetWeighted,
              multiplyRational(
                request.lowerRatioPart,
                request.knownValue,
              ),
            ),
            request.higherRatioPart,
          ),
        };
      }
      return {
        kind: "SOURCE_VALUE",
        value: divideRational(
          subtractRational(
            targetWeighted,
            multiplyRational(
              request.higherRatioPart,
              request.knownValue,
            ),
          ),
          request.lowerRatioPart,
        ),
      };
    }

    case "COMPONENT_SHARE_FROM_TARGET": {
      const cross = buildAlligationCross(
        request.lowerValue,
        request.higherValue,
        request.targetValue,
      );
      const totalParts = addRational(
        cross.lowerQuantityPart,
        cross.higherQuantityPart,
      );
      const requestedPart = request.requestedSide === "LOWER"
        ? cross.lowerQuantityPart
        : cross.higherQuantityPart;
      return {
        kind: "COMPONENT_QUANTITY",
        quantity: requirePositive(
          divideRational(
            multiplyRational(request.totalQuantity, requestedPart),
            totalParts,
          ),
          "Requested component share",
        ),
      };
    }

    case "DIFFERENCE_BASED_QUANTITIES": {
      const cross = buildAlligationCross(
        request.lowerValue,
        request.higherValue,
        request.targetValue,
      );
      const partDifference = absoluteRational(
        subtractRational(
          cross.lowerQuantityPart,
          cross.higherQuantityPart,
        ),
      );
      if (compareRational(partDifference, rational(0)) === 0) {
        throw new Error(
          "Difference-based reconstruction is not unique for equal ratio parts.",
        );
      }
      const scale = divideRational(
        request.quantityDifference,
        partDifference,
      );
      return {
        kind: "COMPONENT_QUANTITY_PAIR",
        firstQuantity: requirePositive(
          multiplyRational(cross.lowerQuantityPart, scale),
          "Lower-value quantity",
        ),
        secondQuantity: requirePositive(
          multiplyRational(cross.higherQuantityPart, scale),
          "Higher-value quantity",
        ),
      };
    }

    case "TWO_STAGE_BLEND_MEAN": {
      const firstMean = stageOneMean(request.stageOneComponents);
      const finalState = buildBlendState([
        {
          id: "stage-one-sample",
          label: "first-stage blend",
          quantity: request.stageOneQuantityUsed,
          value: firstMean,
        },
        request.finalComponent,
      ]);
      return {
        kind: "MEAN_VALUE",
        value: finalState.meanValue,
      };
    }

    case "TWO_STAGE_UNKNOWN_QUANTITY": {
      const firstMean = stageOneMean(request.stageOneComponents);
      const numerator = multiplyRational(
        request.stageOneQuantityUsed,
        subtractRational(
          request.targetValue,
          firstMean,
        ),
      );
      const denominator = subtractRational(
        request.finalComponentValue,
        request.targetValue,
      );
      return {
        kind: "COMPONENT_QUANTITY",
        quantity: requirePositive(
          divideRational(numerator, denominator),
          "Second-stage component quantity",
        ),
      };
    }

    case "THREE_WAY_TARGET_WITH_RELATION": {
      const k = request.middleToLowerMultiplier;
      const onePlusK = addRational(rational(1), k);
      const coefficient = subtractRational(
        addRational(
          request.lowerValue,
          multiplyRational(k, request.middleValue),
        ),
        multiplyRational(onePlusK, request.higherValue),
      );
      const constant = multiplyRational(
        request.totalQuantity,
        subtractRational(
          request.targetValue,
          request.higherValue,
        ),
      );
      const lowerQuantity = requirePositive(
        divideRational(constant, coefficient),
        "Lower-value component quantity",
      );
      const middleQuantity = multiplyRational(k, lowerQuantity);
      const higherQuantity = requirePositive(
        subtractRational(
          request.totalQuantity,
          addRational(lowerQuantity, middleQuantity),
        ),
        "Higher-value component quantity",
      );
      return {
        kind: "COMPONENT_QUANTITY",
        quantity: higherQuantity,
      };
    }
  }
}

function independentTotals(
  components: readonly BlendComponent[],
): { quantity: Rational; weighted: Rational } {
  let quantity = rational(0);
  let weighted = rational(0);
  for (const component of components) {
    quantity = addRational(quantity, component.quantity);
    weighted = addRational(
      weighted,
      multiplyRational(component.quantity, component.value),
    );
  }
  return { quantity, weighted };
}

function balanceMatches(
  components: readonly BlendComponent[],
  target: Rational,
): boolean {
  const totals = independentTotals(components);
  return (
    totals.weighted.numerator * target.denominator * totals.quantity.denominator ===
    target.numerator * totals.quantity.numerator * totals.weighted.denominator
  );
}

function equal(a: Rational, b: Rational): boolean {
  return (
    a.numerator * b.denominator ===
    b.numerator * a.denominator
  );
}

function kindError(
  errors: string[],
  expected: MalCp001GapResult["kind"],
  actual: MalCp001GapResult,
): boolean {
  if (actual.kind !== expected) {
    errors.push(
      `Result kind mismatch: expected ${expected}, received ${actual.kind}.`,
    );
    return true;
  }
  return false;
}

export function verifyMalCp001GapIndependently(
  request: MalCp001GapRequest,
  actual: MalCp001GapResult,
): VerificationResult {
  const errors: string[] = [];

  switch (request.mode) {
    case "SOURCE_VALUE_FROM_RATIO": {
      if (kindError(errors, "SOURCE_VALUE", actual)) break;
      if (actual.kind !== "SOURCE_VALUE") break;
      const lowerValue = request.knownSide === "LOWER"
        ? request.knownValue
        : actual.value;
      const higherValue = request.knownSide === "HIGHER"
        ? request.knownValue
        : actual.value;
      const components: BlendComponent[] = [
        {
          id: "lower",
          label: request.lowerComponentLabel,
          quantity: request.lowerRatioPart,
          value: lowerValue,
        },
        {
          id: "higher",
          label: request.higherComponentLabel,
          quantity: request.higherRatioPart,
          value: higherValue,
        },
      ];
      if (!balanceMatches(components, request.targetValue)) {
        errors.push(
          "Recovered source value does not reproduce the target mean at the stated ratio.",
        );
      }
      if (compareRational(lowerValue, request.targetValue) >= 0) {
        errors.push("Recovered lower source is not below the target.");
      }
      if (compareRational(request.targetValue, higherValue) >= 0) {
        errors.push("Recovered higher source is not above the target.");
      }
      break;
    }

    case "COMPONENT_SHARE_FROM_TARGET": {
      if (kindError(errors, "COMPONENT_QUANTITY", actual)) break;
      if (actual.kind !== "COMPONENT_QUANTITY") break;
      const otherQuantity = subtractRational(
        request.totalQuantity,
        actual.quantity,
      );
      if (
        !isPositiveRational(actual.quantity) ||
        !isPositiveRational(otherQuantity)
      ) {
        errors.push("Both component shares must be positive.");
        break;
      }
      const lowerQuantity = request.requestedSide === "LOWER"
        ? actual.quantity
        : otherQuantity;
      const higherQuantity = request.requestedSide === "HIGHER"
        ? actual.quantity
        : otherQuantity;
      if (!balanceMatches(
        [
          {
            id: "lower",
            label: request.lowerComponentLabel,
            quantity: lowerQuantity,
            value: request.lowerValue,
          },
          {
            id: "higher",
            label: request.higherComponentLabel,
            quantity: higherQuantity,
            value: request.higherValue,
          },
        ],
        request.targetValue,
      )) {
        errors.push(
          "Reported component share does not reconstruct the target mean and stated total.",
        );
      }
      break;
    }

    case "DIFFERENCE_BASED_QUANTITIES": {
      if (kindError(errors, "COMPONENT_QUANTITY_PAIR", actual)) break;
      if (actual.kind !== "COMPONENT_QUANTITY_PAIR") break;
      if (
        !isPositiveRational(actual.firstQuantity) ||
        !isPositiveRational(actual.secondQuantity)
      ) {
        errors.push("Both reconstructed quantities must be positive.");
        break;
      }
      if (!equal(
        absoluteRational(
          subtractRational(
            actual.firstQuantity,
            actual.secondQuantity,
          ),
        ),
        request.quantityDifference,
      )) {
        errors.push(
          "Reconstructed quantities do not have the stated absolute difference.",
        );
      }
      if (!balanceMatches(
        [
          {
            id: "lower",
            label: request.lowerComponentLabel,
            quantity: actual.firstQuantity,
            value: request.lowerValue,
          },
          {
            id: "higher",
            label: request.higherComponentLabel,
            quantity: actual.secondQuantity,
            value: request.higherValue,
          },
        ],
        request.targetValue,
      )) {
        errors.push(
          "Difference-based quantity pair does not reproduce the target mean.",
        );
      }
      break;
    }

    case "TWO_STAGE_BLEND_MEAN": {
      if (kindError(errors, "MEAN_VALUE", actual)) break;
      if (actual.kind !== "MEAN_VALUE") break;
      const stageOne = independentTotals(request.stageOneComponents);
      const firstMean = divideRational(
        stageOne.weighted,
        stageOne.quantity,
      );
      const finalComponents: BlendComponent[] = [
        {
          id: "stage-one-sample",
          label: "first-stage blend",
          quantity: request.stageOneQuantityUsed,
          value: firstMean,
        },
        request.finalComponent,
      ];
      if (!balanceMatches(finalComponents, actual.value)) {
        errors.push(
          "Reported two-stage mean does not balance the transferred first-stage blend and final source.",
        );
      }
      break;
    }

    case "TWO_STAGE_UNKNOWN_QUANTITY": {
      if (kindError(errors, "COMPONENT_QUANTITY", actual)) break;
      if (actual.kind !== "COMPONENT_QUANTITY") break;
      if (!isPositiveRational(actual.quantity)) {
        errors.push("Recovered second-stage quantity must be positive.");
        break;
      }
      const stageOne = independentTotals(request.stageOneComponents);
      const firstMean = divideRational(
        stageOne.weighted,
        stageOne.quantity,
      );
      const reconstructed: BlendComponent[] = [
        {
          id: "stage-one-sample",
          label: "first-stage blend",
          quantity: request.stageOneQuantityUsed,
          value: firstMean,
        },
        {
          id: request.finalComponentId,
          label: request.finalComponentLabel,
          quantity: actual.quantity,
          value: request.finalComponentValue,
        },
      ];
      if (!balanceMatches(reconstructed, request.targetValue)) {
        errors.push(
          "Recovered second-stage quantity does not reproduce the final target.",
        );
      }
      break;
    }

    case "THREE_WAY_TARGET_WITH_RELATION": {
      if (kindError(errors, "COMPONENT_QUANTITY", actual)) break;
      if (actual.kind !== "COMPONENT_QUANTITY") break;
      if (!isPositiveRational(actual.quantity)) {
        errors.push("Recovered higher-source quantity must be positive.");
        break;
      }
      const remaining = subtractRational(
        request.totalQuantity,
        actual.quantity,
      );
      const lowerQuantity = divideRational(
        remaining,
        addRational(
          rational(1),
          request.middleToLowerMultiplier,
        ),
      );
      const middleQuantity = multiplyRational(
        request.middleToLowerMultiplier,
        lowerQuantity,
      );
      if (
        !isPositiveRational(lowerQuantity) ||
        !isPositiveRational(middleQuantity)
      ) {
        errors.push("The relation produces non-positive source quantities.");
        break;
      }
      if (!balanceMatches(
        [
          {
            id: "lower",
            label: request.lowerComponentLabel,
            quantity: lowerQuantity,
            value: request.lowerValue,
          },
          {
            id: "middle",
            label: request.middleComponentLabel,
            quantity: middleQuantity,
            value: request.middleValue,
          },
          {
            id: "higher",
            label: request.higherComponentLabel,
            quantity: actual.quantity,
            value: request.higherValue,
          },
        ],
        request.targetValue,
      )) {
        errors.push(
          "Recovered three-way quantity does not satisfy total, relation and target mean together.",
        );
      }
      break;
    }
  }

  return { ok: errors.length === 0, errors };
}
