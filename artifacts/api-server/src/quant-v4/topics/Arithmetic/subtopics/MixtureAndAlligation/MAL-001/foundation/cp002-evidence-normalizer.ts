import {
  addRational,
  divideRational,
  isPositiveRational,
  multiplyRational,
  rationalKey,
} from "./rational";
import type {
  MalCp002ComponentId,
  MalCp002PureAdjustmentKind,
  MalCp002Ratio,
  MalCp002SolveRequest,
  MalCp002State,
} from "./cp002-types";
import type { Rational } from "./types";

export type MalCp002StateEvidence =
  | {
      kind: "EXPLICIT_COMPONENT_QUANTITIES";
      state: MalCp002State;
    }
  | {
      kind: "TOTAL_AND_RATIO";
      totalQuantity: Rational;
      ratio: MalCp002Ratio;
    }
  | {
      kind: "ONE_COMPONENT_AND_RATIO";
      knownComponent: MalCp002ComponentId;
      knownQuantity: Rational;
      ratio: MalCp002Ratio;
    };

export interface MalCp002NormalizedStateEvidence {
  sourceKind: MalCp002StateEvidence["kind"];
  state: MalCp002State;
  totalQuantity: Rational;
  ratio: MalCp002Ratio;
  derivation:
    | "DIRECT_COMPONENT_STATE"
    | "PARTITION_TOTAL_BY_RATIO"
    | "SCALE_RATIO_FROM_KNOWN_COMPONENT";
}

export interface MalCp002TargetAdjustmentEvidenceRequest {
  mode: "UNKNOWN_PURE_ADJUSTMENT_FROM_STATE_EVIDENCE";
  initialEvidence: MalCp002StateEvidence;
  changedComponent: MalCp002ComponentId;
  adjustmentKind: MalCp002PureAdjustmentKind;
  targetRatio: MalCp002Ratio;
}

function requirePositive(name: string, value: Rational): void {
  if (!isPositiveRational(value)) {
    throw new Error(`${name} must be positive; received ${rationalKey(value)}.`);
  }
}

function validateRatio(ratio: MalCp002Ratio): void {
  requirePositive("component A ratio part", ratio.componentAPart);
  requirePositive("component B ratio part", ratio.componentBPart);
}

function validateState(state: MalCp002State): void {
  requirePositive("component A quantity", state.componentA);
  requirePositive("component B quantity", state.componentB);
}

function totalOf(state: MalCp002State): Rational {
  return addRational(state.componentA, state.componentB);
}

export function normalizeMalCp002StateEvidence(
  evidence: MalCp002StateEvidence,
): MalCp002NormalizedStateEvidence {
  switch (evidence.kind) {
    case "EXPLICIT_COMPONENT_QUANTITIES": {
      validateState(evidence.state);
      return {
        sourceKind: evidence.kind,
        state: evidence.state,
        totalQuantity: totalOf(evidence.state),
        ratio: {
          componentAPart: evidence.state.componentA,
          componentBPart: evidence.state.componentB,
        },
        derivation: "DIRECT_COMPONENT_STATE",
      };
    }

    case "TOTAL_AND_RATIO": {
      requirePositive("total quantity", evidence.totalQuantity);
      validateRatio(evidence.ratio);
      const totalParts = addRational(
        evidence.ratio.componentAPart,
        evidence.ratio.componentBPart,
      );
      const componentA = multiplyRational(
        evidence.totalQuantity,
        divideRational(evidence.ratio.componentAPart, totalParts),
      );
      const componentB = multiplyRational(
        evidence.totalQuantity,
        divideRational(evidence.ratio.componentBPart, totalParts),
      );
      const state = { componentA, componentB };
      validateState(state);
      return {
        sourceKind: evidence.kind,
        state,
        totalQuantity: evidence.totalQuantity,
        ratio: evidence.ratio,
        derivation: "PARTITION_TOTAL_BY_RATIO",
      };
    }

    case "ONE_COMPONENT_AND_RATIO": {
      requirePositive("known component quantity", evidence.knownQuantity);
      validateRatio(evidence.ratio);
      const knownPart =
        evidence.knownComponent === "A"
          ? evidence.ratio.componentAPart
          : evidence.ratio.componentBPart;
      const otherPart =
        evidence.knownComponent === "A"
          ? evidence.ratio.componentBPart
          : evidence.ratio.componentAPart;
      const onePart = divideRational(evidence.knownQuantity, knownPart);
      const otherQuantity = multiplyRational(onePart, otherPart);
      const state =
        evidence.knownComponent === "A"
          ? {
              componentA: evidence.knownQuantity,
              componentB: otherQuantity,
            }
          : {
              componentA: otherQuantity,
              componentB: evidence.knownQuantity,
            };
      validateState(state);
      return {
        sourceKind: evidence.kind,
        state,
        totalQuantity: totalOf(state),
        ratio: evidence.ratio,
        derivation: "SCALE_RATIO_FROM_KNOWN_COMPONENT",
      };
    }
  }
}

export function normalizeMalCp002TargetAdjustmentEvidence(
  request: MalCp002TargetAdjustmentEvidenceRequest,
): {
  normalizedEvidence: MalCp002NormalizedStateEvidence;
  canonicalRequest: Extract<
    MalCp002SolveRequest,
    { mode: "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET" }
  >;
} {
  validateRatio(request.targetRatio);
  const normalizedEvidence = normalizeMalCp002StateEvidence(
    request.initialEvidence,
  );
  return {
    normalizedEvidence,
    canonicalRequest: {
      mode: "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET",
      initialState: normalizedEvidence.state,
      changedComponent: request.changedComponent,
      adjustmentKind: request.adjustmentKind,
      targetRatio: request.targetRatio,
    },
  };
}

export function malCp002StateEvidenceFingerprint(
  evidence: MalCp002StateEvidence,
): string {
  switch (evidence.kind) {
    case "EXPLICIT_COMPONENT_QUANTITIES":
      return [
        evidence.kind,
        rationalKey(evidence.state.componentA),
        rationalKey(evidence.state.componentB),
      ].join(":");
    case "TOTAL_AND_RATIO":
      return [
        evidence.kind,
        rationalKey(evidence.totalQuantity),
        rationalKey(evidence.ratio.componentAPart),
        rationalKey(evidence.ratio.componentBPart),
      ].join(":");
    case "ONE_COMPONENT_AND_RATIO":
      return [
        evidence.kind,
        evidence.knownComponent,
        rationalKey(evidence.knownQuantity),
        rationalKey(evidence.ratio.componentAPart),
        rationalKey(evidence.ratio.componentBPart),
      ].join(":");
  }
}
