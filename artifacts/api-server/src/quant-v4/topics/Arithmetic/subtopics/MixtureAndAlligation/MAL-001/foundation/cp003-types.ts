import type {
  MalDifficulty,
  MalReasoningGraph,
  MalTaskDirection,
  Rational,
} from "./types";

export const MAL_CP_003_ID = "MAL-CP-003" as const;

/**
 * Current executable-discovery frontier only. These identities are not
 * permanent QLs and may be merged, split, renamed or retired after the final
 * source, ownership and gap audits.
 */
export const MAL_CP003_DISCOVERY_PROTOTYPE_IDS = [
  "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
  "MAL-CP003-PROT-FINAL-ORIGINAL-FRACTION-EQUAL-REPLACEMENTS",
  "MAL-CP003-PROT-FINAL-REFILL-QUANTITY-EQUAL-REPLACEMENTS",
  "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL",
  "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL",
  "MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL",
  "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS",
  "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION",
  "MAL-CP003-PROT-SUCCESSIVE-DILUTION-CONCENTRATION-BOUNDARY",
] as const;

export type MalCp003DiscoveryPrototypeId =
  (typeof MAL_CP003_DISCOVERY_PROTOTYPE_IDS)[number];

export type MalCp003ExecutablePrototypeId = Exclude<
  MalCp003DiscoveryPrototypeId,
  "MAL-CP003-PROT-SUCCESSIVE-DILUTION-CONCENTRATION-BOUNDARY"
>;

export type MalCp003ComponentId = "A" | "B" | "C";

export interface MalCp003ThreeComponentState {
  componentA: Rational;
  componentB: Rational;
  componentC: Rational;
}

export interface MalCp003ReplacementStage {
  removedQuantity: Rational;
  refillComponent: MalCp003ComponentId;
}

export type MalCp003SolveRequest =
  | {
      mode: "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES";
      vesselVolume: Rational;
      initialOriginalQuantity: Rational;
      removedQuantity: Rational;
      operations: number;
    }
  | {
      mode: "FINAL_ORIGINAL_FRACTION_EQUAL_STAGES";
      removedFraction: Rational;
      operations: number;
    }
  | {
      mode: "FINAL_REFILL_QUANTITY_EQUAL_STAGES";
      vesselVolume: Rational;
      removedQuantity: Rational;
      operations: number;
    }
  | {
      mode: "INITIAL_ORIGINAL_QUANTITY_FROM_FINAL";
      vesselVolume: Rational;
      finalOriginalQuantity: Rational;
      removedQuantity: Rational;
      operations: number;
    }
  | {
      mode: "REMOVAL_QUANTITY_FROM_FINAL";
      vesselVolume: Rational;
      initialOriginalQuantity: Rational;
      finalOriginalQuantity: Rational;
      operations: number;
    }
  | {
      mode: "OPERATION_COUNT_FROM_FINAL";
      vesselVolume: Rational;
      initialOriginalQuantity: Rational;
      finalOriginalQuantity: Rational;
      removedQuantity: Rational;
      maximumOperations: number;
    }
  | {
      mode: "FINAL_ORIGINAL_QUANTITY_UNEQUAL_STAGES";
      vesselVolume: Rational;
      initialOriginalQuantity: Rational;
      removedQuantities: readonly Rational[];
    }
  | {
      mode: "FINAL_THREE_COMPONENT_STATE";
      vesselVolume: Rational;
      initialState: MalCp003ThreeComponentState;
      stages: readonly MalCp003ReplacementStage[];
    };

export type MalCp003SolveResult =
  | {
      kind: "FINAL_ORIGINAL_QUANTITY";
      quantity: Rational;
      retainedFraction: Rational;
    }
  | {
      kind: "FINAL_ORIGINAL_FRACTION";
      fraction: Rational;
    }
  | {
      kind: "FINAL_REFILL_QUANTITY";
      quantity: Rational;
      originalQuantityRemaining: Rational;
    }
  | {
      kind: "INITIAL_ORIGINAL_QUANTITY";
      quantity: Rational;
      retainedFraction: Rational;
    }
  | {
      kind: "REMOVAL_QUANTITY_PER_STAGE";
      quantity: Rational;
      retainedFractionPerStage: Rational;
    }
  | {
      kind: "OPERATION_COUNT";
      operations: number;
    }
  | {
      kind: "FINAL_THREE_COMPONENT_STATE";
      state: MalCp003ThreeComponentState;
    };

export type MalCp003AnswerSemantic =
  | "FINAL_ORIGINAL_COMPONENT_QUANTITY"
  | "FINAL_ORIGINAL_COMPONENT_FRACTION"
  | "FINAL_REFILL_COMPONENT_QUANTITY"
  | "INITIAL_ORIGINAL_COMPONENT_QUANTITY"
  | "REMOVAL_QUANTITY_PER_OPERATION"
  | "NUMBER_OF_OPERATIONS"
  | "FINAL_THREE_COMPONENT_COMPOSITION";

export type MalCp003DiscoveryStatus =
  | "EXECUTABLE_DISCOVERY"
  | "SOURCE_RECOVERED_BOUNDARY_PENDING_EXECUTION";

export type MalCp003SourceClass =
  | "LEGACY_V2_DIRECT_EXECUTABLE_RECOVERY"
  | "LEGACY_FAMILY_LABEL_ONLY"
  | "INVERSE_CLOSURE"
  | "REPRESENTATION_CLOSURE"
  | "BOUNDARY_CONSTRUCTION";

export interface MalCp003DiscoveryRegistryEntry {
  prototypeId: MalCp003DiscoveryPrototypeId;
  cpId: typeof MAL_CP_003_ID;
  taskDirection: MalTaskDirection;
  answerSemantic: MalCp003AnswerSemantic;
  topology:
    | "EQUAL_REPEATED_REMOVE_REFILL"
    | "INVERSE_EQUAL_REPEATED_REMOVE_REFILL"
    | "UNEQUAL_REPEATED_REMOVE_REFILL"
    | "THREE_COMPONENT_SEQUENTIAL_REFILL"
    | "CONCENTRATION_SEMANTIC_BOUNDARY";
  decisiveInvariant:
    | "GEOMETRIC_RETENTION"
    | "PRODUCT_OF_STAGE_RETENTIONS"
    | "FULL_COMPONENT_STAGE_LEDGER"
    | "CONSERVATION_WITH_CONCENTRATION_SEMANTICS";
  baseDifficulty: MalDifficulty;
  discoveryStatus: MalCp003DiscoveryStatus;
  sourceClasses: readonly MalCp003SourceClass[];
  currentOwnerVerdict: "MAL-CP-003" | "MAL-CP-003_CP004_BOUNDARY";
  permanentQlId: null;
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}

export interface MalCp003StageDiagram {
  type: "REPLACEMENT_STAGE_STRIP";
  title: string;
  quantityUnit: "litres";
  stages: readonly {
    stage: number;
    removedQuantity: string;
    retainedFraction: string;
    refillComponent: string;
    originalQuantityAfterStage: string;
  }[];
  note: string;
}

export interface MalCp003GeneratedPrototype {
  archetypeId: "MAL-001";
  canonicalProblemId: typeof MAL_CP_003_ID;
  prototypeId: MalCp003ExecutablePrototypeId;
  permanentQlId: null;
  questionLanguageId: string;
  language: "en";
  seed: string;
  difficulty: MalDifficulty;
  taskDirection: MalTaskDirection;
  answerSemantic: MalCp003AnswerSemantic;
  stem: string;
  request: MalCp003SolveRequest;
  solution: MalCp003SolveResult;
  answer: string;
  options: string[];
  optionAudit: readonly {
    text: string;
    misconceptionId: string;
    isCorrect: boolean;
  }[];
  correctIndex: number;
  explanation: {
    layoutId: "MAL-CP003-EN-RETENTION-STAGES-DISCOVERY-V1";
    coreConcept: string;
    formula: string;
    steps: string[];
    verification: string;
    conclusion: string;
    examShortcut: string;
    commonTrap: string;
  };
  reasoningGraph: MalReasoningGraph;
  diagram: MalCp003StageDiagram;
  mathematicalFingerprint: string;
  validation: {
    ok: boolean;
    errors: string[];
  };
  maturity: "DISCOVERY_PROTOTYPE";
  allocationStatus: "UNALLOCATED_OPEN_DISCOVERY";
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}
