import {
  addRational,
  divideRational,
  equalsRational,
  multiplyRational,
  rational,
  subtractRational,
  sumRationals,
} from "./rational";
import type {
  MalCp003ComponentId,
  MalCp003SolveRequest,
  MalCp003SolveResult,
  MalCp003ThreeComponentState,
} from "./cp003-types";
import type { Rational } from "./types";

function sameState(
  first: MalCp003ThreeComponentState,
  second: MalCp003ThreeComponentState,
): boolean {
  return (
    equalsRational(first.componentA, second.componentA) &&
    equalsRational(first.componentB, second.componentB) &&
    equalsRational(first.componentC, second.componentC)
  );
}

function oneStageOriginal(
  current: Rational,
  vesselVolume: Rational,
  removedQuantity: Rational,
): Rational {
  const retainedVolume = subtractRational(vesselVolume, removedQuantity);
  return divideRational(
    multiplyRational(current, retainedVolume),
    vesselVolume,
  );
}

function simulateOriginal(
  initial: Rational,
  vesselVolume: Rational,
  removedQuantities: readonly Rational[],
): Rational {
  return removedQuantities.reduce(
    (current, removed) => oneStageOriginal(current, vesselVolume, removed),
    initial,
  );
}

function addComponent(
  state: MalCp003ThreeComponentState,
  component: MalCp003ComponentId,
  quantity: Rational,
): MalCp003ThreeComponentState {
  if (component === "A") {
    return { ...state, componentA: addRational(state.componentA, quantity) };
  }
  if (component === "B") {
    return { ...state, componentB: addRational(state.componentB, quantity) };
  }
  return { ...state, componentC: addRational(state.componentC, quantity) };
}

function simulateThreeComponent(
  request: Extract<
    MalCp003SolveRequest,
    { mode: "FINAL_THREE_COMPONENT_STATE" }
  >,
): MalCp003ThreeComponentState {
  let state = request.initialState;
  for (const stage of request.stages) {
    const retainedVolume = subtractRational(
      request.vesselVolume,
      stage.removedQuantity,
    );
    const retained = {
      componentA: divideRational(
        multiplyRational(state.componentA, retainedVolume),
        request.vesselVolume,
      ),
      componentB: divideRational(
        multiplyRational(state.componentB, retainedVolume),
        request.vesselVolume,
      ),
      componentC: divideRational(
        multiplyRational(state.componentC, retainedVolume),
        request.vesselVolume,
      ),
    };
    state = addComponent(retained, stage.refillComponent, stage.removedQuantity);
  }
  return state;
}

export function verifyMalCp003Result(
  request: MalCp003SolveRequest,
  result: MalCp003SolveResult,
): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  switch (request.mode) {
    case "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES": {
      if (result.kind !== "FINAL_ORIGINAL_QUANTITY") {
        errors.push(`Expected FINAL_ORIGINAL_QUANTITY, received ${result.kind}.`);
        break;
      }
      const simulated = simulateOriginal(
        request.initialOriginalQuantity,
        request.vesselVolume,
        Array.from({ length: request.operations }, () => request.removedQuantity),
      );
      if (!equalsRational(simulated, result.quantity)) {
        errors.push("Equal-stage final original quantity failed stage simulation.");
      }
      const expectedFraction = divideRational(
        simulated,
        request.initialOriginalQuantity,
      );
      if (!equalsRational(expectedFraction, result.retainedFraction)) {
        errors.push("Reported retained fraction does not match simulated quantity.");
      }
      break;
    }

    case "FINAL_ORIGINAL_FRACTION_EQUAL_STAGES": {
      if (result.kind !== "FINAL_ORIGINAL_FRACTION") {
        errors.push(`Expected FINAL_ORIGINAL_FRACTION, received ${result.kind}.`);
        break;
      }
      let simulated = rational(1);
      const retainedPerStage = subtractRational(
        rational(1),
        request.removedFraction,
      );
      for (let index = 0; index < request.operations; index += 1) {
        simulated = multiplyRational(simulated, retainedPerStage);
      }
      if (!equalsRational(simulated, result.fraction)) {
        errors.push("Final original fraction failed stage simulation.");
      }
      break;
    }

    case "FINAL_REFILL_QUANTITY_EQUAL_STAGES": {
      if (result.kind !== "FINAL_REFILL_QUANTITY") {
        errors.push(`Expected FINAL_REFILL_QUANTITY, received ${result.kind}.`);
        break;
      }
      const original = simulateOriginal(
        request.vesselVolume,
        request.vesselVolume,
        Array.from({ length: request.operations }, () => request.removedQuantity),
      );
      const refill = subtractRational(request.vesselVolume, original);
      if (!equalsRational(original, result.originalQuantityRemaining)) {
        errors.push("Original quantity remaining failed refill-stage simulation.");
      }
      if (!equalsRational(refill, result.quantity)) {
        errors.push("Final refill quantity does not complement original quantity.");
      }
      break;
    }

    case "INITIAL_ORIGINAL_QUANTITY_FROM_FINAL": {
      if (result.kind !== "INITIAL_ORIGINAL_QUANTITY") {
        errors.push(`Expected INITIAL_ORIGINAL_QUANTITY, received ${result.kind}.`);
        break;
      }
      const simulated = simulateOriginal(
        result.quantity,
        request.vesselVolume,
        Array.from({ length: request.operations }, () => request.removedQuantity),
      );
      if (!equalsRational(simulated, request.finalOriginalQuantity)) {
        errors.push("Reconstructed initial quantity does not reproduce the final quantity.");
      }
      break;
    }

    case "REMOVAL_QUANTITY_FROM_FINAL": {
      if (result.kind !== "REMOVAL_QUANTITY_PER_STAGE") {
        errors.push(`Expected REMOVAL_QUANTITY_PER_STAGE, received ${result.kind}.`);
        break;
      }
      const simulated = simulateOriginal(
        request.initialOriginalQuantity,
        request.vesselVolume,
        Array.from({ length: request.operations }, () => result.quantity),
      );
      if (!equalsRational(simulated, request.finalOriginalQuantity)) {
        errors.push("Reconstructed removal quantity does not reproduce the final quantity.");
      }
      break;
    }

    case "OPERATION_COUNT_FROM_FINAL": {
      if (result.kind !== "OPERATION_COUNT") {
        errors.push(`Expected OPERATION_COUNT, received ${result.kind}.`);
        break;
      }
      const simulated = simulateOriginal(
        request.initialOriginalQuantity,
        request.vesselVolume,
        Array.from({ length: result.operations }, () => request.removedQuantity),
      );
      if (!equalsRational(simulated, request.finalOriginalQuantity)) {
        errors.push("Reported operation count does not reproduce the final quantity.");
      }
      break;
    }

    case "FINAL_ORIGINAL_QUANTITY_UNEQUAL_STAGES": {
      if (result.kind !== "FINAL_ORIGINAL_QUANTITY") {
        errors.push(`Expected FINAL_ORIGINAL_QUANTITY, received ${result.kind}.`);
        break;
      }
      const simulated = simulateOriginal(
        request.initialOriginalQuantity,
        request.vesselVolume,
        request.removedQuantities,
      );
      if (!equalsRational(simulated, result.quantity)) {
        errors.push("Unequal-stage final original quantity failed stage simulation.");
      }
      break;
    }

    case "FINAL_THREE_COMPONENT_STATE": {
      if (result.kind !== "FINAL_THREE_COMPONENT_STATE") {
        errors.push(`Expected FINAL_THREE_COMPONENT_STATE, received ${result.kind}.`);
        break;
      }
      const simulated = simulateThreeComponent(request);
      if (!sameState(simulated, result.state)) {
        errors.push("Three-component final state failed independent stage simulation.");
      }
      const total = sumRationals([
        result.state.componentA,
        result.state.componentB,
        result.state.componentC,
      ]);
      if (!equalsRational(total, request.vesselVolume)) {
        errors.push("Three-component final state does not conserve vessel volume.");
      }
      break;
    }
  }

  return { ok: errors.length === 0, errors };
}
