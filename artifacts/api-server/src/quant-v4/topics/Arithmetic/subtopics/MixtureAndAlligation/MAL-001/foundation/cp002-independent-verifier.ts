import {
  addRational,
  divideRational,
  equalsRational,
  isPositiveRational,
  multiplyRational,
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import type {
  MalCp002ComponentId,
  MalCp002PureAdjustmentKind,
  MalCp002Ratio,
  MalCp002SolveRequest,
  MalCp002SolveResult,
  MalCp002State,
  MalCp002VerificationResult,
} from "./cp002-types";
import type { Rational } from "./types";

function sameRational(first: Rational, second: Rational): boolean {
  return equalsRational(first, second);
}

function sameState(first: MalCp002State, second: MalCp002State): boolean {
  return (
    sameRational(first.componentA, second.componentA) &&
    sameRational(first.componentB, second.componentB)
  );
}

function sameRatio(first: MalCp002Ratio, second: MalCp002Ratio): boolean {
  return equalsRational(
    multiplyRational(first.componentAPart, second.componentBPart),
    multiplyRational(first.componentBPart, second.componentAPart),
  );
}

function stateMatchesRatio(
  state: MalCp002State,
  ratio: MalCp002Ratio,
): boolean {
  return equalsRational(
    multiplyRational(state.componentA, ratio.componentBPart),
    multiplyRational(state.componentB, ratio.componentAPart),
  );
}

function independentlyApplyPureAdjustment(
  state: MalCp002State,
  changedComponent: MalCp002ComponentId,
  adjustmentKind: MalCp002PureAdjustmentKind,
  quantity: Rational,
): MalCp002State {
  const delta = adjustmentKind === "ADD" ? quantity : {
    numerator: -quantity.numerator,
    denominator: quantity.denominator,
  };
  return changedComponent === "A"
    ? {
        componentA: addRational(state.componentA, delta),
        componentB: state.componentB,
      }
    : {
        componentA: state.componentA,
        componentB: addRational(state.componentB, delta),
      };
}

function independentlyReduceStateRatio(
  state: MalCp002State,
): MalCp002Ratio {
  const [componentAPart, componentBPart] = reduceRationalRatio(
    state.componentA,
    state.componentB,
  );
  return { componentAPart, componentBPart };
}

function independentlyApplySingleReplacement(
  state: MalCp002State,
  replacementComponent: MalCp002ComponentId,
  removedQuantity: Rational,
): MalCp002State {
  const total = addRational(state.componentA, state.componentB);
  const removedAFraction = divideRational(state.componentA, total);
  const removedBFraction = divideRational(state.componentB, total);
  const removedA = multiplyRational(removedQuantity, removedAFraction);
  const removedB = multiplyRational(removedQuantity, removedBFraction);

  let componentA = subtractRational(state.componentA, removedA);
  let componentB = subtractRational(state.componentB, removedB);
  if (replacementComponent === "A") {
    componentA = addRational(componentA, removedQuantity);
  } else {
    componentB = addRational(componentB, removedQuantity);
  }
  return { componentA, componentB };
}

function pushPositiveStateErrors(
  errors: string[],
  label: string,
  state: MalCp002State,
): void {
  if (!isPositiveRational(state.componentA)) {
    errors.push(`${label} component A is not positive.`);
  }
  if (!isPositiveRational(state.componentB)) {
    errors.push(`${label} component B is not positive.`);
  }
}

export function verifyMalCp002Result(
  request: MalCp002SolveRequest,
  result: MalCp002SolveResult,
): MalCp002VerificationResult {
  const errors: string[] = [];

  switch (request.mode) {
    case "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET": {
      if (result.kind !== "ADJUSTMENT_QUANTITY") {
        errors.push(`Expected ADJUSTMENT_QUANTITY, received ${result.kind}.`);
        break;
      }
      if (!isPositiveRational(result.quantity)) {
        errors.push("Solved adjustment quantity is not positive.");
      }
      const simulated = independentlyApplyPureAdjustment(
        request.initialState,
        request.changedComponent,
        request.adjustmentKind,
        result.quantity,
      );
      pushPositiveStateErrors(errors, "Final", simulated);
      if (!sameState(simulated, result.finalState)) {
        errors.push("Reported final state does not match independent adjustment simulation.");
      }
      if (!stateMatchesRatio(simulated, request.targetRatio)) {
        errors.push("Solved adjustment does not produce the requested target ratio.");
      }
      if (!sameRatio(result.finalRatio, request.targetRatio)) {
        errors.push("Reported final ratio does not match the target ratio.");
      }
      const conservedBefore =
        request.changedComponent === "A"
          ? request.initialState.componentB
          : request.initialState.componentA;
      const conservedAfter =
        request.changedComponent === "A"
          ? simulated.componentB
          : simulated.componentA;
      if (!sameRational(conservedBefore, conservedAfter)) {
        errors.push("The counterpart component was not conserved.");
      }
      break;
    }

    case "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT": {
      if (result.kind !== "COMPONENT_RATIO") {
        errors.push(`Expected COMPONENT_RATIO, received ${result.kind}.`);
        break;
      }
      const simulated = independentlyApplyPureAdjustment(
        request.initialState,
        request.changedComponent,
        request.adjustmentKind,
        request.adjustmentQuantity,
      );
      pushPositiveStateErrors(errors, "Final", simulated);
      if (!sameState(simulated, result.finalState)) {
        errors.push("Forward-ratio final state does not match independent simulation.");
      }
      const expectedRatio = independentlyReduceStateRatio(simulated);
      if (!sameRatio(expectedRatio, result.ratio)) {
        errors.push("Forward-ratio result is not the reduced ratio of the final state.");
      }
      break;
    }

    case "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT": {
      if (result.kind !== "ORIGINAL_RATIO") {
        errors.push(`Expected ORIGINAL_RATIO, received ${result.kind}.`);
        break;
      }
      pushPositiveStateErrors(errors, "Original", result.originalState);
      const replayedFinal = independentlyApplyPureAdjustment(
        result.originalState,
        request.changedComponent,
        request.adjustmentKind,
        request.adjustmentQuantity,
      );
      if (!sameState(replayedFinal, request.finalState)) {
        errors.push("Reconstructed original state does not replay to the given final state.");
      }
      const expectedRatio = independentlyReduceStateRatio(result.originalState);
      if (!sameRatio(expectedRatio, result.ratio)) {
        errors.push("Reported original ratio does not match the reconstructed original state.");
      }
      break;
    }

    case "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO": {
      if (result.kind !== "COMPONENT_QUANTITY_PAIR") {
        errors.push(`Expected COMPONENT_QUANTITY_PAIR, received ${result.kind}.`);
        break;
      }
      if (
        !sameRational(
          addRational(
            result.componentAQuantity,
            result.componentBQuantity,
          ),
          request.totalQuantity,
        )
      ) {
        errors.push("Reconstructed component quantities do not sum to the total.");
      }
      if (
        !stateMatchesRatio(
          {
            componentA: result.componentAQuantity,
            componentB: result.componentBQuantity,
          },
          request.ratio,
        )
      ) {
        errors.push("Reconstructed component quantities do not match the given ratio.");
      }
      break;
    }

    case "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET": {
      if (result.kind !== "SINGLE_REPLACEMENT_QUANTITY") {
        errors.push(
          `Expected SINGLE_REPLACEMENT_QUANTITY, received ${result.kind}.`,
        );
        break;
      }
      if (!isPositiveRational(result.quantity)) {
        errors.push("Single-replacement quantity is not positive.");
      }
      const simulated = independentlyApplySingleReplacement(
        request.initialState,
        request.replacementComponent,
        result.quantity,
      );
      pushPositiveStateErrors(errors, "Replacement final", simulated);
      if (!sameState(simulated, result.finalState)) {
        errors.push("Replacement final state does not match stage simulation.");
      }
      if (!stateMatchesRatio(simulated, request.targetRatio)) {
        errors.push("Single replacement does not reach the requested target ratio.");
      }
      if (!sameRatio(result.finalRatio, request.targetRatio)) {
        errors.push("Reported replacement ratio does not match the target ratio.");
      }
      break;
    }
  }

  return { ok: errors.length === 0, errors };
}
