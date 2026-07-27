import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  isPositiveRational,
  multiplyRational,
  rational,
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import type {
  BlendComponent,
  MalCp001SolveRequest,
  MalCp001SolveResult,
  Rational,
  VerificationResult,
} from "./types";

function independentTotals(components: readonly BlendComponent[]): {
  quantity: Rational;
  weighted: Rational;
} {
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

function balanceMatches(components: readonly BlendComponent[], target: Rational): boolean {
  const totals = independentTotals(components);
  return equalsRational(
    totals.weighted,
    multiplyRational(totals.quantity, target),
  );
}

function pushKindError(
  errors: string[],
  expected: MalCp001SolveResult["kind"],
  actual: MalCp001SolveResult,
): void {
  if (actual.kind !== expected) {
    errors.push(`Result kind mismatch: expected ${expected}, received ${actual.kind}.`);
  }
}

export function verifyMalCp001ResultIndependently(
  request: MalCp001SolveRequest,
  actual: MalCp001SolveResult,
): VerificationResult {
  const errors: string[] = [];

  switch (request.mode) {
    case "MEAN_FROM_COMPONENTS": {
      pushKindError(errors, "MEAN_VALUE", actual);
      if (actual.kind !== "MEAN_VALUE") break;
      const totals = independentTotals(request.components);
      if (!equalsRational(
        multiplyRational(actual.value, totals.quantity),
        totals.weighted,
      )) {
        errors.push("Mean value does not satisfy the direct weighted-total equation.");
      }
      if (!balanceMatches(request.components, actual.value)) {
        errors.push("Component reconstruction does not balance at the reported mean.");
      }
      break;
    }
    case "TWO_COMPONENT_RATIO_FROM_TARGET": {
      pushKindError(errors, "COMPONENT_RATIO", actual);
      if (actual.kind !== "COMPONENT_RATIO") break;
      if (!isPositiveRational(actual.firstPart) || !isPositiveRational(actual.secondPart)) {
        errors.push("Alligation ratio parts must be positive.");
        break;
      }
      const reconstructed: BlendComponent[] = [
        { id: "lower", label: "lower", quantity: actual.firstPart, value: request.lowerValue },
        { id: "higher", label: "higher", quantity: actual.secondPart, value: request.higherValue },
      ];
      if (!balanceMatches(reconstructed, request.targetValue)) {
        errors.push("Reported ratio does not reconstruct the target weighted mean.");
      }
      const [expectedFirst, expectedSecond] = reduceRationalRatio(
        subtractRational(request.higherValue, request.targetValue),
        subtractRational(request.targetValue, request.lowerValue),
      );
      if (!equalsRational(actual.firstPart, expectedFirst) || !equalsRational(actual.secondPart, expectedSecond)) {
        errors.push("Reported ratio is not the unique reduced positive ratio for the target.");
      }
      break;
    }
    case "UNKNOWN_COMPONENT_VALUE": {
      pushKindError(errors, "SOURCE_VALUE", actual);
      if (actual.kind !== "SOURCE_VALUE") break;
      const reconstructed: BlendComponent[] = [
        ...request.knownComponents,
        {
          id: request.unknownComponentId,
          label: request.unknownComponentLabel,
          quantity: request.unknownQuantity,
          value: actual.value,
        },
      ];
      if (!balanceMatches(reconstructed, request.targetValue)) {
        errors.push("Recovered source value does not balance the target mixture.");
      }
      const known = independentTotals(request.knownComponents);
      const expected = divideRational(
        subtractRational(
          multiplyRational(
            addRational(known.quantity, request.unknownQuantity),
            request.targetValue,
          ),
          known.weighted,
        ),
        request.unknownQuantity,
      );
      if (!equalsRational(actual.value, expected)) {
        errors.push("Recovered source value does not match the independently rearranged equation.");
      }
      break;
    }
    case "UNKNOWN_COMPONENT_QUANTITY": {
      pushKindError(errors, "COMPONENT_QUANTITY", actual);
      if (actual.kind !== "COMPONENT_QUANTITY") break;
      if (!isPositiveRational(actual.quantity)) {
        errors.push("Recovered component quantity must be positive.");
        break;
      }
      const reconstructed: BlendComponent[] = [
        ...request.knownComponents,
        {
          id: request.unknownComponentId,
          label: request.unknownComponentLabel,
          quantity: actual.quantity,
          value: request.unknownValue,
        },
      ];
      if (!balanceMatches(reconstructed, request.targetValue)) {
        errors.push("Recovered component quantity does not balance the target mixture.");
      }
      const known = independentTotals(request.knownComponents);
      const coefficient = subtractRational(request.unknownValue, request.targetValue);
      const constant = subtractRational(
        multiplyRational(request.targetValue, known.quantity),
        known.weighted,
      );
      if (compareRational(coefficient, rational(0)) === 0) {
        errors.push("Unknown quantity equation is not uniquely solvable.");
      } else if (!equalsRational(multiplyRational(actual.quantity, coefficient), constant)) {
        errors.push("Recovered quantity fails the independently formed linear equation.");
      }
      break;
    }
    case "ADD_SOURCE_TO_REACH_TARGET": {
      pushKindError(errors, "COMPONENT_QUANTITY", actual);
      if (actual.kind !== "COMPONENT_QUANTITY") break;
      if (!isPositiveRational(actual.quantity)) {
        errors.push("Added quantity must be positive.");
        break;
      }
      const reconstructed: BlendComponent[] = [
        ...request.initialComponents,
        {
          id: request.addedComponentId,
          label: request.addedComponentLabel,
          quantity: actual.quantity,
          value: request.addedValue,
        },
      ];
      if (!balanceMatches(reconstructed, request.targetValue)) {
        errors.push("Added quantity does not produce the stated target value.");
      }
      const initial = independentTotals(request.initialComponents);
      const coefficient = subtractRational(request.addedValue, request.targetValue);
      const constant = subtractRational(
        multiplyRational(request.targetValue, initial.quantity),
        initial.weighted,
      );
      if (compareRational(coefficient, rational(0)) === 0) {
        errors.push("Added-quantity equation is not uniquely solvable.");
      } else if (!equalsRational(multiplyRational(actual.quantity, coefficient), constant)) {
        errors.push("Added quantity fails the independently formed target-balance equation.");
      }
      break;
    }
    case "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET": {
      pushKindError(errors, "COMPONENT_QUANTITY_PAIR", actual);
      if (actual.kind !== "COMPONENT_QUANTITY_PAIR") break;
      if (!isPositiveRational(actual.firstQuantity) || !isPositiveRational(actual.secondQuantity)) {
        errors.push("Both reconstructed quantities must be positive.");
        break;
      }
      if (!equalsRational(
        addRational(actual.firstQuantity, actual.secondQuantity),
        request.totalQuantity,
      )) {
        errors.push("Reconstructed quantities do not add to the stated total.");
      }
      const reconstructed: BlendComponent[] = [
        {
          id: request.lowerComponentId,
          label: request.lowerComponentLabel,
          quantity: actual.firstQuantity,
          value: request.lowerValue,
        },
        {
          id: request.higherComponentId,
          label: request.higherComponentLabel,
          quantity: actual.secondQuantity,
          value: request.higherValue,
        },
      ];
      if (!balanceMatches(reconstructed, request.targetValue)) {
        errors.push("Reconstructed quantities do not produce the target mean.");
      }
      break;
    }
  }

  return { ok: errors.length === 0, errors };
}
