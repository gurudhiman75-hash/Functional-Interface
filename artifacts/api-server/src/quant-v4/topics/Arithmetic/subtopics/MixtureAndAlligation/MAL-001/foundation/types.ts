export const MAL_001_ARCHETYPE_ID = "MAL-001" as const;
export const MAL_CP_001_ID = "MAL-CP-001" as const;

export const MAL_CP001_PROTOTYPE_IDS = [
  "MAL-CP001-PROT-RATIO-FROM-TARGET",
  "MAL-CP001-PROT-MEAN-FROM-QUANTITIES",
  "MAL-CP001-PROT-MEAN-FROM-RATIO",
  "MAL-CP001-PROT-UNKNOWN-SOURCE-VALUE",
  "MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY",
  "MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET",
  "MAL-CP001-PROT-THREE-COMPONENT-MEAN",
  "MAL-CP001-PROT-THIRD-COMPONENT-QUANTITY",
  "MAL-CP001-PROT-TWO-QUANTITIES-FROM-TOTAL",
] as const;

export type MalCp001PrototypeId = (typeof MAL_CP001_PROTOTYPE_IDS)[number];
export type MalDifficulty = "Easy" | "Medium" | "Hard";
export type MalTaskDirection = "FORWARD" | "INVERSE" | "RECONSTRUCTION";
export type MalAnswerSemantic =
  | "COMPONENT_RATIO"
  | "FINAL_MEAN_VALUE"
  | "SOURCE_VALUE"
  | "COMPONENT_QUANTITY"
  | "COMPONENT_QUANTITY_PAIR";
export type MalQuantityUnit = "kg" | "litres";
export type MalValueUnit = "₹/kg" | "₹/litre";

export interface Rational {
  numerator: bigint;
  denominator: bigint;
}

export interface BlendComponent {
  id: string;
  label: string;
  quantity: Rational;
  value: Rational;
}

export interface BlendState {
  components: BlendComponent[];
  totalQuantity: Rational;
  weightedTotal: Rational;
  meanValue: Rational;
}

export interface AlligationCross {
  lowerValue: Rational;
  targetValue: Rational;
  higherValue: Rational;
  lowerQuantityPart: Rational;
  higherQuantityPart: Rational;
}

export type MalCp001SolveRequest =
  | {
      mode: "MEAN_FROM_COMPONENTS";
      components: BlendComponent[];
    }
  | {
      mode: "TWO_COMPONENT_RATIO_FROM_TARGET";
      lowerValue: Rational;
      higherValue: Rational;
      targetValue: Rational;
    }
  | {
      mode: "UNKNOWN_COMPONENT_VALUE";
      knownComponents: BlendComponent[];
      unknownComponentId: string;
      unknownComponentLabel: string;
      unknownQuantity: Rational;
      targetValue: Rational;
    }
  | {
      mode: "UNKNOWN_COMPONENT_QUANTITY";
      knownComponents: BlendComponent[];
      unknownComponentId: string;
      unknownComponentLabel: string;
      unknownValue: Rational;
      targetValue: Rational;
    }
  | {
      mode: "ADD_SOURCE_TO_REACH_TARGET";
      initialComponents: BlendComponent[];
      addedComponentId: string;
      addedComponentLabel: string;
      addedValue: Rational;
      targetValue: Rational;
    }
  | {
      mode: "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET";
      lowerComponentId: string;
      lowerComponentLabel: string;
      lowerValue: Rational;
      higherComponentId: string;
      higherComponentLabel: string;
      higherValue: Rational;
      totalQuantity: Rational;
      targetValue: Rational;
    };

export type MalCp001SolveResult =
  | {
      kind: "MEAN_VALUE";
      value: Rational;
      state: BlendState;
    }
  | {
      kind: "COMPONENT_RATIO";
      firstPart: Rational;
      secondPart: Rational;
      cross: AlligationCross;
    }
  | {
      kind: "SOURCE_VALUE";
      value: Rational;
    }
  | {
      kind: "COMPONENT_QUANTITY";
      quantity: Rational;
    }
  | {
      kind: "COMPONENT_QUANTITY_PAIR";
      firstQuantity: Rational;
      secondQuantity: Rational;
    };

export interface MalCp001Context {
  scenarioId: string;
  actor: string;
  material: string;
  lowerLabel: string;
  higherLabel: string;
  thirdLabel: string;
  quantityUnit: MalQuantityUnit;
  valueUnit: MalValueUnit;
}

export interface MalCp001PrototypeRegistryEntry {
  prototypeId: MalCp001PrototypeId;
  cpId: typeof MAL_CP_001_ID;
  taskDirection: MalTaskDirection;
  answerSemantic: MalAnswerSemantic;
  topology:
    | "TWO_COMPONENT_TARGET"
    | "TWO_COMPONENT_WEIGHTED_MEAN"
    | "TWO_COMPONENT_RATIO_MEAN"
    | "TWO_COMPONENT_UNKNOWN_VALUE"
    | "TWO_COMPONENT_UNKNOWN_QUANTITY"
    | "ONE_SOURCE_ADDITION"
    | "THREE_COMPONENT_WEIGHTED_MEAN"
    | "THREE_COMPONENT_UNKNOWN_QUANTITY"
    | "TWO_COMPONENT_TOTAL_RECONSTRUCTION";
  preferredMethod: "ALLIGATION_CROSS" | "WEIGHTED_CONSERVATION";
  diagramStrategy: "ALLIGATION_CROSS" | "NONE";
  baseDifficulty: MalDifficulty;
  permanentQlId: null;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

export interface MalCp001PrototypeParameters {
  prototypeId: MalCp001PrototypeId;
  seed: string;
  context: MalCp001Context;
  request: MalCp001SolveRequest;
  hiddenState: BlendState;
  difficulty: MalDifficulty;
  generationFingerprint: string;
}

export type MalCp001MisconceptionId =
  | "CORRECT"
  | "RATIO_REVERSED"
  | "SAME_SIDE_DIFFERENCES"
  | "SOURCE_GAP_USED_AS_RATIO"
  | "SIMPLE_AVERAGE_USED"
  | "QUANTITIES_SWAPPED"
  | "TARGET_REPORTED"
  | "KNOWN_SOURCE_REPORTED"
  | "KNOWN_QUANTITY_REPORTED"
  | "TOTAL_QUANTITY_REPORTED"
  | "DIFFERENCE_INSTEAD_OF_UNKNOWN"
  | "TARGET_BALANCE_REVERSED"
  | "EQUAL_SPLIT_ASSUMED"
  | "ONE_COMPONENT_OMITTED"
  | "PLAUSIBLE_SCALE_ERROR";

export interface MalCp001OptionAudit {
  text: string;
  result: MalCp001SolveResult;
  misconceptionId: MalCp001MisconceptionId;
}

export interface MalReasoningNode {
  id: string;
  kind: "GIVEN" | "RELATION" | "DERIVATION" | "VERIFICATION" | "CONCLUSION";
  text: string;
  mathLatex?: string;
  dependsOn: string[];
}

export interface MalReasoningGraph {
  nodes: MalReasoningNode[];
}

export interface MalAlligationDiagram {
  type: "ALLIGATION_CROSS";
  lowerLabel: string;
  lowerValue: string;
  targetValue: string;
  higherLabel: string;
  higherValue: string;
  lowerDifference: string;
  higherDifference: string;
  ratioText: string;
}

export interface MalCp001Explanation {
  opening: string;
  formula: string;
  steps: string[];
  verification: string;
  conclusion: string;
  commonTrap: string;
}

export interface VerificationResult {
  ok: boolean;
  errors: string[];
}

export interface MalCp001GeneratedPrototype {
  archetypeId: typeof MAL_001_ARCHETYPE_ID;
  canonicalProblemId: typeof MAL_CP_001_ID;
  prototypeId: MalCp001PrototypeId;
  permanentQlId: null;
  questionLanguageId: string;
  language: "en";
  seed: string;
  difficulty: MalDifficulty;
  taskDirection: MalTaskDirection;
  answerSemantic: MalAnswerSemantic;
  stem: string;
  parameters: MalCp001PrototypeParameters;
  solution: MalCp001SolveResult;
  options: string[];
  optionAudit: MalCp001OptionAudit[];
  correctIndex: number;
  explanation: MalCp001Explanation;
  reasoningGraph: MalReasoningGraph;
  diagram?: MalAlligationDiagram;
  mathematicalFingerprint: string;
  validation: VerificationResult;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
