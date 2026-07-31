import type {
  MalDifficulty,
  MalTaskDirection,
  Rational,
} from "./types";

export const MAL_CP_002_ID = "MAL-CP-002" as const;

/**
 * This list is the current executable-discovery frontier only. It is not a
 * permanent QL allocation and it must expand or contract when source,
 * ownership and gap audits justify a different contract boundary.
 */
export const MAL_CP002_DISCOVERY_PROTOTYPE_IDS = [
  "MAL-CP002-PROT-ADD-COMPONENT-FOR-TARGET-RATIO",
  "MAL-CP002-PROT-REMOVE-COMPONENT-FOR-TARGET-RATIO",
  "MAL-CP002-PROT-RATIO-AFTER-COMPONENT-ADDITION",
  "MAL-CP002-PROT-RATIO-AFTER-COMPONENT-REMOVAL",
  "MAL-CP002-PROT-ORIGINAL-RATIO-BEFORE-ADDITION",
  "MAL-CP002-PROT-ORIGINAL-RATIO-BEFORE-REMOVAL",
  "MAL-CP002-PROT-COMPONENTS-FROM-TOTAL-AND-RATIO",
  "MAL-CP002-PROT-SINGLE-REMOVE-REFILL-FOR-TARGET-RATIO",
  "MAL-CP002-PROT-THREE-COMPONENT-ADDITION-RATIO-ADJUSTMENT",
] as const;

export type MalCp002DiscoveryPrototypeId =
  (typeof MAL_CP002_DISCOVERY_PROTOTYPE_IDS)[number];

export type MalCp002ExecutablePrototypeId = Exclude<
  MalCp002DiscoveryPrototypeId,
  "MAL-CP002-PROT-THREE-COMPONENT-ADDITION-RATIO-ADJUSTMENT"
>;

export type MalCp002ComponentId = "A" | "B";
export type MalCp002PureAdjustmentKind = "ADD" | "REMOVE";

export interface MalCp002State {
  componentA: Rational;
  componentB: Rational;
}

export interface MalCp002Ratio {
  componentAPart: Rational;
  componentBPart: Rational;
}

export type MalCp002SolveRequest =
  | {
      mode: "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET";
      initialState: MalCp002State;
      changedComponent: MalCp002ComponentId;
      adjustmentKind: MalCp002PureAdjustmentKind;
      targetRatio: MalCp002Ratio;
    }
  | {
      mode: "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT";
      initialState: MalCp002State;
      changedComponent: MalCp002ComponentId;
      adjustmentKind: MalCp002PureAdjustmentKind;
      adjustmentQuantity: Rational;
    }
  | {
      mode: "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT";
      finalState: MalCp002State;
      changedComponent: MalCp002ComponentId;
      adjustmentKind: MalCp002PureAdjustmentKind;
      adjustmentQuantity: Rational;
    }
  | {
      mode: "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO";
      totalQuantity: Rational;
      ratio: MalCp002Ratio;
    }
  | {
      mode: "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET";
      initialState: MalCp002State;
      replacementComponent: MalCp002ComponentId;
      targetRatio: MalCp002Ratio;
    };

export type MalCp002SolveResult =
  | {
      kind: "ADJUSTMENT_QUANTITY";
      quantity: Rational;
      finalState: MalCp002State;
      finalRatio: MalCp002Ratio;
    }
  | {
      kind: "COMPONENT_RATIO";
      ratio: MalCp002Ratio;
      finalState: MalCp002State;
    }
  | {
      kind: "ORIGINAL_RATIO";
      ratio: MalCp002Ratio;
      originalState: MalCp002State;
    }
  | {
      kind: "COMPONENT_QUANTITY_PAIR";
      componentAQuantity: Rational;
      componentBQuantity: Rational;
    }
  | {
      kind: "SINGLE_REPLACEMENT_QUANTITY";
      quantity: Rational;
      finalState: MalCp002State;
      finalRatio: MalCp002Ratio;
    };

export type MalCp002AnswerSemantic =
  | "ADJUSTMENT_QUANTITY"
  | "COMPONENT_RATIO"
  | "COMPONENT_QUANTITY_PAIR"
  | "SINGLE_REPLACEMENT_QUANTITY"
  | "THREE_COMPONENT_QUANTITY";

export type MalCp002DiscoveryStatus =
  | "EXECUTABLE_DISCOVERY"
  | "SOURCE_RECOVERED_BOUNDARY_PENDING_EXECUTION";

export interface MalCp002DiscoveryRegistryEntry {
  prototypeId: MalCp002DiscoveryPrototypeId;
  cpId: typeof MAL_CP_002_ID;
  taskDirection: MalTaskDirection;
  answerSemantic: MalCp002AnswerSemantic;
  topology:
    | "ONE_COMPONENT_ADDITION_TO_TARGET_RATIO"
    | "ONE_COMPONENT_REMOVAL_TO_TARGET_RATIO"
    | "ONE_COMPONENT_ADDITION_FORWARD_RATIO"
    | "ONE_COMPONENT_REMOVAL_FORWARD_RATIO"
    | "REVERSE_ADDITION_RATIO_RECONSTRUCTION"
    | "REVERSE_REMOVAL_RATIO_RECONSTRUCTION"
    | "TOTAL_AND_RATIO_COMPONENT_RECONSTRUCTION"
    | "SINGLE_HOMOGENEOUS_REMOVE_REFILL"
    | "THREE_COMPONENT_COUPLED_ADDITION";
  decisiveInvariant:
    | "UNCHANGED_COUNTERPART_COMPONENT"
    | "TOTAL_AND_RATIO_PARTITION"
    | "SINGLE_STAGE_PROPORTIONAL_RETENTION"
    | "COUPLED_RATIO_RELATIONS";
  baseDifficulty: MalDifficulty;
  discoveryStatus: MalCp002DiscoveryStatus;
  currentOwnerVerdict: "MAL-CP-002" | "MAL-CP-002_CP003_BOUNDARY";
  permanentQlId: null;
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}

export interface MalCp002DiscoveryFixture {
  fixtureId: string;
  prototypeId: MalCp002ExecutablePrototypeId;
  sourceClass:
    | "LEGACY_V2_RECOVERY"
    | "BOUNDARY_CONSTRUCTION"
    | "INVERSE_CLOSURE";
  request: MalCp002SolveRequest;
  expectedFingerprint: string;
}

export interface MalCp002VerificationResult {
  ok: boolean;
  errors: string[];
}
