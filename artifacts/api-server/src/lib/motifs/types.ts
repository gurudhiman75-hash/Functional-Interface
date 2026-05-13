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

export type MotifDomain =
  | "reasoning"
  | "quant"
  | "english"
  | "di";

export type MotifArchetype =
  | "elimination-chain"
  | "relative-placement"
  | "symbolic-transform"
  | "ratio-trap"
  | "reverse-percentage"
  | "grammar-ambiguity"
  | "grammar-correction"
  | "data-interpretation"
  | "visual-comparison"
  | "general";

export type MotifDifficultyProfile = {
  supportedDifficultyBands?: MotifDifficultyBand[];
  reasoningDepthRange?: [number, number];
  inferenceStyle?: MotifInferenceStyle;
  examWeights?: {
    ssc?: number;
    ibps?: number;
    sbi?: number;
    cat?: number;
    rrb?: number;
  };
};

export type MotifRealizationHints = {
  wordingBias?: {
    concise?: number;
    balanced?: number;
    inferenceHeavy?: number;
  };
  explanationStyle?: string[];
  visualHints?: string[];
  distractorHints?: string[];
};

export type MotifGenerationRules = {
  compatiblePatternTypes?: CompatiblePatternType[];
  requiredVariables?: string[];
  preferredOperations?: string[];
  supportedReasoningTypes?: MotifReasoningType[];
  requiredReasoningCapabilities?: MotifReasoningType[];
  compatibleTopics?: string[];
  ruleTags?: string[];
};

export type MotifParameterRange =
  | {
      min: number;
      max: number;
      step?: number;
    }
  | string
  | string[]
  | number;

export type MotifDifficultyTuning = {
  easy?: string[];
  medium?: string[];
  hard?: string[];
};

export type SeatingFacingPattern =
  | "UNIDIRECTIONAL_NORTH"
  | "ALTERNATE_NS"
  | "CIRCULAR_INWARD"
  | "CIRCULAR_ALTERNATE"
  | "PARALLEL_OPPOSITE";

export type PracticalMotifControls = {
  generationStrategy?: string[];
  parameterRanges?: Record<
    string,
    MotifParameterRange
  >;
  distractorStrategies?: string[];
  difficultyTuning?: MotifDifficultyTuning;
  validationRules?: string[];
  diversityTags?: string[];
  rotationGroup?: string;
};

export type Motif = {
  id: string;
  domain: MotifDomain;
  archetype: MotifArchetype | string;
  difficultyProfile: MotifDifficultyProfile;
  realizationHints: MotifRealizationHints;
  generationRules: MotifGenerationRules;
};

export type QuantMotifTopicCluster =
  | "fundamentals"
  | "simplification"
  | "number-system"
  | "percentage"
  | "ratio-proportion"
  | "profit-loss"
  | "averages"
  | "si-ci"
  | "time-work"
  | "speed-time-distance"
  | "mixture-alligation"
  | "algebra-basics"
  | "algebra"
  | "equations"
  | "progressions"
  | "probability"
  | "functions"
  | "permutation-combination"
  | "trigonometry"
  | "geometry"
  | "coordinate-geometry"
  | "set-theory"
  | "mensuration"
  | "coding-decoding"
  | "blood-relations"
  | "inequality"
  | "direction-sense"
  | "abstract-reasoning"
  | "temporal-reasoning"
  | "critical-inference"
  | "seating-arrangement"
  | "ordering-ranking"
  | "puzzles"
  | "syllogism";

export type QuantMotif = Partial<
  Pick<
    Motif,
    | "domain"
    | "archetype"
    | "difficultyProfile"
    | "realizationHints"
    | "generationRules"
  >
> & {
  topicCluster: QuantMotifTopicCluster;
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
  displayName?: string;
  facingPattern?: SeatingFacingPattern;
  participantCount?: number;
} & PracticalMotifControls;

export type SeatingMotif = QuantMotif & {
  topicCluster: "seating-arrangement";
  facingPattern: SeatingFacingPattern;
};

export type EnglishMotif = Motif & {
  domain: "english";
  subdomain:
    | "grammar"
    | "vocabulary"
    | "reading-comprehension";
  triggerPatterns: string[];
  ambiguityTags: string[];
  commonDistractors: string[];
} & PracticalMotifControls;

export type DIMotif = Motif & {
  domain: "di";
  visualSubtype:
    | "table"
    | "bar"
    | "pie"
    | "line"
    | "mixed";
  interpretationModes: string[];
  commonDistractors: string[];
} & PracticalMotifControls;

export type UniversalMotif =
  | QuantMotif
  | EnglishMotif
  | DIMotif;

export function defineQuantMotif(
  motif: Omit<
    QuantMotif,
    | "domain"
    | "archetype"
    | "difficultyProfile"
    | "realizationHints"
    | "generationRules"
  > & {
    archetype?: MotifArchetype | string;
  },
): QuantMotif {
  return {
    domain:
      motif.topicCluster ===
        "coding-decoding" ||
      motif.topicCluster ===
        "blood-relations" ||
      motif.topicCluster ===
        "inequality" ||
      motif.topicCluster ===
        "direction-sense" ||
      motif.topicCluster ===
        "abstract-reasoning" ||
      motif.topicCluster ===
        "temporal-reasoning" ||
      motif.topicCluster ===
        "critical-inference" ||
      motif.topicCluster ===
        "ordering-ranking" ||
      motif.topicCluster ===
        "puzzles" ||
      motif.topicCluster ===
        "syllogism" ||
      motif.topicCluster ===
        "seating-arrangement"
        ? "reasoning"
        : "quant",
    archetype:
      motif.archetype ?? "general",
    difficultyProfile: {
      supportedDifficultyBands:
        motif.supportedDifficultyBands,
      reasoningDepthRange:
        motif.reasoningDepthRange,
      inferenceStyle:
        motif.inferenceStyle,
      examWeights:
        motif.examWeights,
    },
    realizationHints: {
      wordingBias:
        motif.wordingBias,
      distractorHints:
        motif.commonDistractors,
    },
    generationRules: {
      compatiblePatternTypes:
        motif.compatiblePatternTypes,
      requiredVariables:
        motif.requiredVariables,
      preferredOperations:
        motif.preferredOperations,
      supportedReasoningTypes:
        motif.supportedReasoningTypes,
      requiredReasoningCapabilities:
        motif.requiredReasoningCapabilities,
      compatibleTopics:
        motif.compatibleTopics,
      ruleTags:
        motif.reasoningCategories,
    },
    ...motif,
  };
}

export function defineEnglishMotif(
  motif: EnglishMotif,
) {
  return motif;
}

export function defineDIMotif(
  motif: DIMotif,
) {
  return motif;
}
