export type MotifInferenceStyle =
  | "direct"
  | "hidden"
  | "conditional";

export type MotifDifficultyBand =
  | "Easy"
  | "Medium"
  | "Hard";

export type MotifReasoningType =
  | "direct"
  | "comparative"
  | "conditional"
  | "multi-step"
  | "inferential"
  | "symbolic"
  | "visual";

export type CompatiblePatternType =
  | "formula"
  | "logic"
  | "di";

export type QuantMotif = {
  id: string;

  topicCluster:
    | "percentage"
    | "ratio-proportion"
    | "profit-loss"
    | "averages"
    | "si-ci"
  | "coding-decoding"
  | "blood-relations"
  | "inequality"
  | "direction-sense"
  | "seating-arrangement";

  reasoningCategories: string[];

  preferredOperations: string[];

  compatibleTopics?: string[];

  compatiblePatternTypes?: CompatiblePatternType[];

  requiredVariables?: string[];

  supportedReasoningTypes?: MotifReasoningType[];

  requiredReasoningCapabilities?: MotifReasoningType[];

  supportedDifficultyBands?: MotifDifficultyBand[];

  commonDistractors: string[];
  

  inferenceStyle: MotifInferenceStyle;

  reasoningDepthRange: [number, number];

  wordingBias?: {
    concise?: number;
    balanced?: number;
    inferenceHeavy?: number;
  };

  examWeights?: {
    ssc?: number;
    ibps?: number;
    sbi?: number;
    cat?: number;
    rrb?: number;
  };
};
