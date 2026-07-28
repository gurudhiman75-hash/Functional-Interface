import type {
  BlendComponent,
  MalAnswerSemantic,
  MalCp001Context,
  MalCp001Explanation,
  MalDifficulty,
  MalReasoningGraph,
  Rational,
  VerificationResult,
} from "./types";

export const MAL_CP001_GAP_PROTOTYPE_IDS = [
  "MAL-CP001-PROT-SOURCE-VALUE-FROM-RATIO",
  "MAL-CP001-PROT-COMPONENT-SHARE-FROM-TARGET",
  "MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES",
  "MAL-CP001-PROT-TWO-STAGE-BLEND-MEAN",
  "MAL-CP001-PROT-TWO-STAGE-UNKNOWN",
  "MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION",
] as const;

export type MalCp001GapPrototypeId = (typeof MAL_CP001_GAP_PROTOTYPE_IDS)[number];

export type MalCp001GapRequest =
  | {
      mode: "SOURCE_VALUE_FROM_RATIO";
      knownSide: "LOWER" | "HIGHER";
      knownValue: Rational;
      targetValue: Rational;
      lowerRatioPart: Rational;
      higherRatioPart: Rational;
      lowerComponentLabel: string;
      higherComponentLabel: string;
    }
  | {
      mode: "COMPONENT_SHARE_FROM_TARGET";
      requestedSide: "LOWER" | "HIGHER";
      lowerValue: Rational;
      higherValue: Rational;
      targetValue: Rational;
      totalQuantity: Rational;
      lowerComponentLabel: string;
      higherComponentLabel: string;
    }
  | {
      mode: "DIFFERENCE_BASED_QUANTITIES";
      lowerValue: Rational;
      higherValue: Rational;
      targetValue: Rational;
      quantityDifference: Rational;
      lowerComponentLabel: string;
      higherComponentLabel: string;
    }
  | {
      mode: "TWO_STAGE_BLEND_MEAN";
      stageOneComponents: [BlendComponent, BlendComponent];
      stageOneQuantityUsed: Rational;
      finalComponent: BlendComponent;
    }
  | {
      mode: "TWO_STAGE_UNKNOWN_QUANTITY";
      stageOneComponents: [BlendComponent, BlendComponent];
      stageOneQuantityUsed: Rational;
      finalComponentId: string;
      finalComponentLabel: string;
      finalComponentValue: Rational;
      targetValue: Rational;
    }
  | {
      mode: "THREE_WAY_TARGET_WITH_RELATION";
      lowerValue: Rational;
      middleValue: Rational;
      higherValue: Rational;
      middleToLowerMultiplier: Rational;
      totalQuantity: Rational;
      targetValue: Rational;
      lowerComponentLabel: string;
      middleComponentLabel: string;
      higherComponentLabel: string;
    };

export type MalCp001GapResult =
  | { kind: "SOURCE_VALUE"; value: Rational }
  | { kind: "COMPONENT_QUANTITY"; quantity: Rational }
  | {
      kind: "COMPONENT_QUANTITY_PAIR";
      firstQuantity: Rational;
      secondQuantity: Rational;
    }
  | { kind: "MEAN_VALUE"; value: Rational };

export type MalCp001GapMisconceptionId =
  | "CORRECT"
  | "TARGET_REPORTED"
  | "KNOWN_SOURCE_REPORTED"
  | "RATIO_REVERSED"
  | "EQUAL_SPLIT_ASSUMED"
  | "OTHER_COMPONENT_REPORTED"
  | "RATIO_PART_USED_AS_QUANTITY"
  | "QUANTITIES_SWAPPED"
  | "DIFFERENCE_USED_AS_SCALE"
  | "STAGE_ONE_MEAN_REPORTED"
  | "SIMPLE_STAGE_AVERAGE"
  | "ONE_COMPONENT_OMITTED"
  | "KNOWN_STAGE_QUANTITY_REPORTED"
  | "RELATION_COMPONENT_REPORTED"
  | "TOTAL_MINUS_ANSWER"
  | "PLAUSIBLE_SCALE_ERROR";

export interface MalCp001GapOptionAudit {
  text: string;
  result: MalCp001GapResult;
  misconceptionId: MalCp001GapMisconceptionId;
}

export interface MalCp001GapParameters {
  prototypeId: MalCp001GapPrototypeId;
  seed: string;
  context: MalCp001Context;
  request: MalCp001GapRequest;
  hiddenComponents: BlendComponent[];
  difficulty: MalDifficulty;
  generationFingerprint: string;
}

export interface MalCp001GapGeneratedPrototype {
  archetypeId: "MAL-001";
  canonicalProblemId: "MAL-CP-001";
  prototypeId: MalCp001GapPrototypeId;
  permanentQlId: null;
  language: "en";
  seed: string;
  difficulty: MalDifficulty;
  answerSemantic: MalAnswerSemantic;
  stem: string;
  parameters: MalCp001GapParameters;
  solution: MalCp001GapResult;
  options: string[];
  optionAudit: MalCp001GapOptionAudit[];
  correctIndex: number;
  explanation: MalCp001Explanation;
  reasoningGraph: MalReasoningGraph;
  mathematicalFingerprint: string;
  validation: VerificationResult;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
