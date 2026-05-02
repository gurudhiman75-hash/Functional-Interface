export type MotifInferenceStyle =
  | "direct"
  | "hidden"
  | "conditional";

export type QuantMotif = {
  id: string;

  topicCluster:
    | "percentage"
    | "ratio-proportion"
    | "profit-loss"
    | "averages"
    | "si-ci";

  reasoningCategories: string[];

  preferredOperations: string[];

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