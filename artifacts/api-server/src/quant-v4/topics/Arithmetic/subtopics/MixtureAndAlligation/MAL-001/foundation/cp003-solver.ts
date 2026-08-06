import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  isPositiveRational,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
  sumRationals,
} from "./rational";
import type {
  MalCp003ComponentId,
  MalCp003ReplacementStage,
  MalCp003SolveRequest,
  MalCp003SolveResult,
  MalCp003ThreeComponentState,
} from "./cp003-types";
import type { Rational } from "./types";

function requirePositive(name: string, value: Rational): void {
  if (!isPositiveRational(value)) {
    throw new Error(`${name} must be positive; received ${rationalKey(value)}.`);
  }
}

function requireWholePositive(name: string, value: number): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer; received ${value}.`);
  }
}

function requireNotGreater(
  name: string,
  value: Rational,
  maximumName: string,
  maximum: Rational,
): void {
  if (compareRational(value, maximum) > 0) {
    throw new Error(
      `${name} ${rationalKey(value)} cannot exceed ${maximumName} ${rationalKey(maximum)}.`,
    );
  }
}

export function powerRational(base: Rational, exponent: number): Rational {
  if (!Number.isInteger(exponent) || exponent < 0) {
    throw new Error(`Rational exponent must be a non-negative integer; received ${exponent}.`);
  }
  let result = rational(1);
  let factor = base;
  let remaining = exponent;
  while (remaining > 0) {
    if (remaining % 2 === 1) result = multiplyRational(result, factor);
    remaining = Math.floor(remaining / 2);
    if (remaining > 0) factor = multiplyRational(factor, factor);
  }
  return result;
}

function bigintPower(base: bigint, exponent: number): bigint {
  let result = 1n;
  let factor = base;
  let remaining = exponent;
  while (remaining > 0) {
    if (remaining % 2 === 1) result *= factor;
    remaining = Math.floor(remaining / 2);
    if (remaining > 0) factor *= factor;
  }
  return result;
}

function exactIntegerNthRoot(value: bigint, exponent: number): bigint | null {
  if (value < 0n) return null;
  if (value === 0n || value === 1n) return value;
  requireWholePositive("root exponent", exponent);

  let low = 0n;
  let high = 1n;
  while (bigintPower(high, exponent) < value) high *= 2n;

  while (low <= high) {
    const middle = (low + high) / 2n;
    const powered = bigintPower(middle, exponent);
    if (powered === value) return middle;
    if (powered < value) low = middle + 1n;
    else high = middle - 1n;
  }
  return null;
}

function exactRationalNthRoot(
  value: Rational,
  exponent: number,
): Rational | null {
  if (value.numerator < 0n) return null;
  const numerator = exactIntegerNthRoot(value.numerator, exponent);
  const denominator = exactIntegerNthRoot(value.denominator, exponent);
  return numerator === null || denominator === null
    ? null
    : rational(numerator, denominator);
}

export function malCp003RetainedFraction(
  vesselVolume: Rational,
  removedQuantity: Rational,
): Rational {
  requirePositive("vessel volume", vesselVolume);
  requirePositive("removed quantity", removedQuantity);
  if (compareRational(removedQuantity, vesselVolume) >= 0) {
    throw new Error("Each replacement must remove less than the vessel volume.");
  }
  return divideRational(
    subtractRational(vesselVolume, removedQuantity),
    vesselVolume,
  );
}

function equalStageRetention(
  vesselVolume: Rational,
  removedQuantity: Rational,
  operations: number,
): Rational {
  requireWholePositive("number of operations", operations);
  return powerRational(
    malCp003RetainedFraction(vesselVolume, removedQuantity),
    operations,
  );
}

function validateOriginalQuantity(
  vesselVolume: Rational,
  originalQuantity: Rational,
  name: string,
): void {
  requirePositive(name, originalQuantity);
  requireNotGreater(name, originalQuantity, "vessel volume", vesselVolume);
}

function validateThreeComponentState(
  vesselVolume: Rational,
  state: MalCp003ThreeComponentState,
): void {
  const values = [state.componentA, state.componentB, state.componentC];
  for (const [index, value] of values.entries()) {
    if (value.numerator < 0n) {
      throw new Error(`Component ${index + 1} quantity cannot be negative.`);
    }
  }
  const total = sumRationals(values);
  if (!equalsRational(total, vesselVolume)) {
    throw new Error(
      `Three-component state total ${rationalKey(total)} does not match vessel volume ${rationalKey(vesselVolume)}.`,
    );
  }
}

function addToComponent(
  state: MalCp003ThreeComponentState,
  component: MalCp003ComponentId,
  quantity: Rational,
): MalCp003ThreeComponentState {
  switch (component) {
    case "A":
      return { ...state, componentA: addRational(state.componentA, quantity) };
    case "B":
      return { ...state, componentB: addRational(state.componentB, quantity) };
    case "C":
      return { ...state, componentC: addRational(state.componentC, quantity) };
  }
}

function applyThreeComponentStage(
  vesselVolume: Rational,
  state: MalCp003ThreeComponentState,
  stage: MalCp003ReplacementStage,
): MalCp003ThreeComponentState {
  validateThreeComponentState(vesselVolume, state);
  const retainedFraction = malCp003RetainedFraction(
    vesselVolume,
    stage.removedQuantity,
  );
  const retained = {
    componentA: multiplyRational(state.componentA, retainedFraction),
    componentB: multiplyRational(state.componentB, retainedFraction),
    componentC: multiplyRational(state.componentC, retainedFraction),
  };
  const finalState = addToComponent(
    retained,
    stage.refillComponent,
    stage.removedQuantity,
  );
  validateThreeComponentState(vesselVolume, finalState);
  return finalState;
}

export function solveMalCp003Request(
  request: MalCp003SolveRequest,
): MalCp003SolveResult {
  switch (request.mode) {
    case "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES": {
      validateOriginalQuantity(
        request.vesselVolume,
        request.initialOriginalQuantity,
        "initial original-component quantity",
      );
      const retainedFraction = equalStageRetention(
        request.vesselVolume,
        request.removedQuantity,
        request.operations,
      );
      return {
        kind: "FINAL_ORIGINAL_QUANTITY",
        quantity: multiplyRational(
          request.initialOriginalQuantity,
          retainedFraction,
        ),
        retainedFraction,
      };
    }

    case "FINAL_ORIGINAL_FRACTION_EQUAL_STAGES": {
      requirePositive("removed fraction", request.removedFraction);
      if (compareRational(request.removedFraction, rational(1)) >= 0) {
        throw new Error("Removed fraction must be less than one.");
      }
      requireWholePositive("number of operations", request.operations);
      return {
        kind: "FINAL_ORIGINAL_FRACTION",
        fraction: powerRational(
          subtractRational(rational(1), request.removedFraction),
          request.operations,
        ),
      };
    }

    case "FINAL_REFILL_QUANTITY_EQUAL_STAGES": {
      const retainedFraction = equalStageRetention(
        request.vesselVolume,
        request.removedQuantity,
        request.operations,
      );
      const originalQuantityRemaining = multiplyRational(
        request.vesselVolume,
        retainedFraction,
      );
      return {
        kind: "FINAL_REFILL_QUANTITY",
        quantity: subtractRational(
          request.vesselVolume,
          originalQuantityRemaining,
        ),
        originalQuantityRemaining,
      };
    }

    case "INITIAL_ORIGINAL_QUANTITY_FROM_FINAL": {
      requirePositive("final original-component quantity", request.finalOriginalQuantity);
      requireNotGreater(
        "final original-component quantity",
        request.finalOriginalQuantity,
        "vessel volume",
        request.vesselVolume,
      );
      const retainedFraction = equalStageRetention(
        request.vesselVolume,
        request.removedQuantity,
        request.operations,
      );
      const quantity = divideRational(
        request.finalOriginalQuantity,
        retainedFraction,
      );
      validateOriginalQuantity(
        request.vesselVolume,
        quantity,
        "reconstructed initial original-component quantity",
      );
      return {
        kind: "INITIAL_ORIGINAL_QUANTITY",
        quantity,
        retainedFraction,
      };
    }

    case "REMOVAL_QUANTITY_FROM_FINAL": {
      validateOriginalQuantity(
        request.vesselVolume,
        request.initialOriginalQuantity,
        "initial original-component quantity",
      );
      requirePositive("final original-component quantity", request.finalOriginalQuantity);
      if (
        compareRational(
          request.finalOriginalQuantity,
          request.initialOriginalQuantity,
        ) >= 0
      ) {
        throw new Error("Final original quantity must be below the initial quantity.");
      }
      requireWholePositive("number of operations", request.operations);
      const totalRetainedFraction = divideRational(
        request.finalOriginalQuantity,
        request.initialOriginalQuantity,
      );
      const retainedFractionPerStage = exactRationalNthRoot(
        totalRetainedFraction,
        request.operations,
      );
      if (
        retainedFractionPerStage === null ||
        compareRational(retainedFractionPerStage, rational(1)) >= 0
      ) {
        throw new Error(
          "The evidence does not produce an exact repeated-replacement quantity.",
        );
      }
      const quantity = multiplyRational(
        request.vesselVolume,
        subtractRational(rational(1), retainedFractionPerStage),
      );
      requirePositive("reconstructed removal quantity", quantity);
      if (compareRational(quantity, request.vesselVolume) >= 0) {
        throw new Error("Reconstructed removal must be below the vessel volume.");
      }
      return {
        kind: "REMOVAL_QUANTITY_PER_STAGE",
        quantity,
        retainedFractionPerStage,
      };
    }

    case "OPERATION_COUNT_FROM_FINAL": {
      validateOriginalQuantity(
        request.vesselVolume,
        request.initialOriginalQuantity,
        "initial original-component quantity",
      );
      requirePositive("final original-component quantity", request.finalOriginalQuantity);
      requireWholePositive("maximum operation count", request.maximumOperations);
      const stageFraction = malCp003RetainedFraction(
        request.vesselVolume,
        request.removedQuantity,
      );
      const matches: number[] = [];
      for (
        let operations = 1;
        operations <= request.maximumOperations;
        operations += 1
      ) {
        const candidate = multiplyRational(
          request.initialOriginalQuantity,
          powerRational(stageFraction, operations),
        );
        if (equalsRational(candidate, request.finalOriginalQuantity)) {
          matches.push(operations);
        }
      }
      if (matches.length !== 1) {
        throw new Error(
          `Operation-count evidence produced ${matches.length} exact solutions.`,
        );
      }
      return { kind: "OPERATION_COUNT", operations: matches[0]! };
    }

    case "FINAL_ORIGINAL_QUANTITY_UNEQUAL_STAGES": {
      validateOriginalQuantity(
        request.vesselVolume,
        request.initialOriginalQuantity,
        "initial original-component quantity",
      );
      if (request.removedQuantities.length < 2) {
        throw new Error("Unequal replacement requires at least two stages.");
      }
      let retainedFraction = rational(1);
      for (const removedQuantity of request.removedQuantities) {
        retainedFraction = multiplyRational(
          retainedFraction,
          malCp003RetainedFraction(request.vesselVolume, removedQuantity),
        );
      }
      return {
        kind: "FINAL_ORIGINAL_QUANTITY",
        quantity: multiplyRational(
          request.initialOriginalQuantity,
          retainedFraction,
        ),
        retainedFraction,
      };
    }

    case "FINAL_THREE_COMPONENT_STATE": {
      requirePositive("vessel volume", request.vesselVolume);
      validateThreeComponentState(request.vesselVolume, request.initialState);
      if (request.stages.length < 2) {
        throw new Error("Three-component sequence requires at least two stages.");
      }
      const state = request.stages.reduce(
        (current, stage) =>
          applyThreeComponentStage(request.vesselVolume, current, stage),
        request.initialState,
      );
      return { kind: "FINAL_THREE_COMPONENT_STATE", state };
    }
  }
}

export function malCp003ResultFingerprint(
  result: MalCp003SolveResult,
): string {
  switch (result.kind) {
    case "FINAL_ORIGINAL_QUANTITY":
      return `${result.kind}:${rationalKey(result.quantity)}:${rationalKey(
        result.retainedFraction,
      )}`;
    case "FINAL_ORIGINAL_FRACTION":
      return `${result.kind}:${rationalKey(result.fraction)}`;
    case "FINAL_REFILL_QUANTITY":
      return `${result.kind}:${rationalKey(result.quantity)}:${rationalKey(
        result.originalQuantityRemaining,
      )}`;
    case "INITIAL_ORIGINAL_QUANTITY":
      return `${result.kind}:${rationalKey(result.quantity)}:${rationalKey(
        result.retainedFraction,
      )}`;
    case "REMOVAL_QUANTITY_PER_STAGE":
      return `${result.kind}:${rationalKey(result.quantity)}:${rationalKey(
        result.retainedFractionPerStage,
      )}`;
    case "OPERATION_COUNT":
      return `${result.kind}:${result.operations}`;
    case "FINAL_THREE_COMPONENT_STATE":
      return `${result.kind}:${rationalKey(result.state.componentA)}:${rationalKey(
        result.state.componentB,
      )}:${rationalKey(result.state.componentC)}`;
  }
}
