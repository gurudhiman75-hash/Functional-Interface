import {
  addRational,
  compareRational,
  divideRational,
  isPositiveRational,
  multiplyRational,
  rational,
  rationalKey,
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
} from "./cp002-types";
import type { Rational } from "./types";

function requirePositive(name: string, value: Rational): void {
  if (!isPositiveRational(value)) {
    throw new Error(`${name} must be positive; received ${rationalKey(value)}.`);
  }
}

function validateState(state: MalCp002State): void {
  requirePositive("component A quantity", state.componentA);
  requirePositive("component B quantity", state.componentB);
}

function validateRatio(ratio: MalCp002Ratio): void {
  requirePositive("component A ratio part", ratio.componentAPart);
  requirePositive("component B ratio part", ratio.componentBPart);
}

function changedQuantity(
  state: MalCp002State,
  component: MalCp002ComponentId,
): Rational {
  return component === "A" ? state.componentA : state.componentB;
}

function withChangedQuantity(
  state: MalCp002State,
  component: MalCp002ComponentId,
  quantity: Rational,
): MalCp002State {
  return component === "A"
    ? { ...state, componentA: quantity }
    : { ...state, componentB: quantity };
}

export function reduceMalCp002StateRatio(
  state: MalCp002State,
): MalCp002Ratio {
  validateState(state);
  const [componentAPart, componentBPart] = reduceRationalRatio(
    state.componentA,
    state.componentB,
  );
  return { componentAPart, componentBPart };
}

export function applyMalCp002PureAdjustment(
  state: MalCp002State,
  component: MalCp002ComponentId,
  adjustmentKind: MalCp002PureAdjustmentKind,
  quantity: Rational,
): MalCp002State {
  validateState(state);
  requirePositive("adjustment quantity", quantity);

  const current = changedQuantity(state, component);
  if (adjustmentKind === "REMOVE" && compareRational(quantity, current) >= 0) {
    throw new Error(
      `Removal ${rationalKey(quantity)} must leave a positive ${component} quantity.`,
    );
  }

  const next =
    adjustmentKind === "ADD"
      ? addRational(current, quantity)
      : subtractRational(current, quantity);
  const finalState = withChangedQuantity(state, component, next);
  validateState(finalState);
  return finalState;
}

function requiredChangedComponentQuantity(
  initialState: MalCp002State,
  changedComponent: MalCp002ComponentId,
  targetRatio: MalCp002Ratio,
): Rational {
  validateState(initialState);
  validateRatio(targetRatio);

  if (changedComponent === "A") {
    return multiplyRational(
      initialState.componentB,
      divideRational(targetRatio.componentAPart, targetRatio.componentBPart),
    );
  }

  return multiplyRational(
    initialState.componentA,
    divideRational(targetRatio.componentBPart, targetRatio.componentAPart),
  );
}

function solveUnknownPureAdjustment(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET" }
  >,
): MalCp002SolveResult {
  const required = requiredChangedComponentQuantity(
    request.initialState,
    request.changedComponent,
    request.targetRatio,
  );
  const current = changedQuantity(request.initialState, request.changedComponent);
  const quantity =
    request.adjustmentKind === "ADD"
      ? subtractRational(required, current)
      : subtractRational(current, required);

  requirePositive("required adjustment", quantity);
  const finalState = applyMalCp002PureAdjustment(
    request.initialState,
    request.changedComponent,
    request.adjustmentKind,
    quantity,
  );

  return {
    kind: "ADJUSTMENT_QUANTITY",
    quantity,
    finalState,
    finalRatio: reduceMalCp002StateRatio(finalState),
  };
}

function solveResultingRatio(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT" }
  >,
): MalCp002SolveResult {
  const finalState = applyMalCp002PureAdjustment(
    request.initialState,
    request.changedComponent,
    request.adjustmentKind,
    request.adjustmentQuantity,
  );
  return {
    kind: "COMPONENT_RATIO",
    ratio: reduceMalCp002StateRatio(finalState),
    finalState,
  };
}

function solveOriginalRatio(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT" }
  >,
): MalCp002SolveResult {
  validateState(request.finalState);
  requirePositive("known adjustment quantity", request.adjustmentQuantity);

  const finalChanged = changedQuantity(
    request.finalState,
    request.changedComponent,
  );
  const originalChanged =
    request.adjustmentKind === "ADD"
      ? subtractRational(finalChanged, request.adjustmentQuantity)
      : addRational(finalChanged, request.adjustmentQuantity);
  requirePositive("reconstructed original component quantity", originalChanged);

  const originalState = withChangedQuantity(
    request.finalState,
    request.changedComponent,
    originalChanged,
  );
  return {
    kind: "ORIGINAL_RATIO",
    ratio: reduceMalCp002StateRatio(originalState),
    originalState,
  };
}

function solveComponentQuantities(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO" }
  >,
): MalCp002SolveResult {
  requirePositive("total quantity", request.totalQuantity);
  validateRatio(request.ratio);

  const totalParts = addRational(
    request.ratio.componentAPart,
    request.ratio.componentBPart,
  );
  const componentAQuantity = multiplyRational(
    request.totalQuantity,
    divideRational(request.ratio.componentAPart, totalParts),
  );
  const componentBQuantity = subtractRational(
    request.totalQuantity,
    componentAQuantity,
  );

  requirePositive("component A reconstructed quantity", componentAQuantity);
  requirePositive("component B reconstructed quantity", componentBQuantity);
  return {
    kind: "COMPONENT_QUANTITY_PAIR",
    componentAQuantity,
    componentBQuantity,
  };
}

export function applyMalCp002SingleReplacement(
  state: MalCp002State,
  replacementComponent: MalCp002ComponentId,
  removedQuantity: Rational,
): MalCp002State {
  validateState(state);
  requirePositive("removed mixture quantity", removedQuantity);

  const total = addRational(state.componentA, state.componentB);
  if (compareRational(removedQuantity, total) >= 0) {
    throw new Error("A single replacement must remove less than the vessel total.");
  }

  const retainedFraction = divideRational(
    subtractRational(total, removedQuantity),
    total,
  );
  let componentA = multiplyRational(state.componentA, retainedFraction);
  let componentB = multiplyRational(state.componentB, retainedFraction);

  if (replacementComponent === "A") {
    componentA = addRational(componentA, removedQuantity);
  } else {
    componentB = addRational(componentB, removedQuantity);
  }

  const finalState = { componentA, componentB };
  validateState(finalState);
  return finalState;
}

function solveUnknownSingleReplacement(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET" }
  >,
): MalCp002SolveResult {
  validateState(request.initialState);
  validateRatio(request.targetRatio);

  const { componentA, componentB } = request.initialState;
  const { componentAPart, componentBPart } = request.targetRatio;
  const total = addRational(componentA, componentB);
  const ratioPartTotal = addRational(componentAPart, componentBPart);

  const quantity =
    request.replacementComponent === "A"
      ? divideRational(
          multiplyRational(
            total,
            subtractRational(
              multiplyRational(componentAPart, componentB),
              multiplyRational(componentBPart, componentA),
            ),
          ),
          multiplyRational(componentB, ratioPartTotal),
        )
      : divideRational(
          multiplyRational(
            total,
            subtractRational(
              multiplyRational(componentBPart, componentA),
              multiplyRational(componentAPart, componentB),
            ),
          ),
          multiplyRational(componentA, ratioPartTotal),
        );

  requirePositive("single replacement quantity", quantity);
  const finalState = applyMalCp002SingleReplacement(
    request.initialState,
    request.replacementComponent,
    quantity,
  );

  return {
    kind: "SINGLE_REPLACEMENT_QUANTITY",
    quantity,
    finalState,
    finalRatio: reduceMalCp002StateRatio(finalState),
  };
}

export function solveMalCp002Request(
  request: MalCp002SolveRequest,
): MalCp002SolveResult {
  switch (request.mode) {
    case "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET":
      return solveUnknownPureAdjustment(request);
    case "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT":
      return solveResultingRatio(request);
    case "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT":
      return solveOriginalRatio(request);
    case "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO":
      return solveComponentQuantities(request);
    case "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET":
      return solveUnknownSingleReplacement(request);
  }
}

function ratioFingerprint(ratio: MalCp002Ratio): string {
  return `${rationalKey(ratio.componentAPart)}:${rationalKey(
    ratio.componentBPart,
  )}`;
}

export function malCp002ResultFingerprint(
  result: MalCp002SolveResult,
): string {
  switch (result.kind) {
    case "ADJUSTMENT_QUANTITY":
      return `${result.kind}:${rationalKey(result.quantity)}:${ratioFingerprint(
        result.finalRatio,
      )}`;
    case "COMPONENT_RATIO":
      return `${result.kind}:${ratioFingerprint(result.ratio)}`;
    case "ORIGINAL_RATIO":
      return `${result.kind}:${ratioFingerprint(result.ratio)}`;
    case "COMPONENT_QUANTITY_PAIR":
      return `${result.kind}:${rationalKey(
        result.componentAQuantity,
      )}:${rationalKey(result.componentBQuantity)}`;
    case "SINGLE_REPLACEMENT_QUANTITY":
      return `${result.kind}:${rationalKey(result.quantity)}:${ratioFingerprint(
        result.finalRatio,
      )}`;
  }
}

export const MAL_CP002_ZERO = rational(0);
