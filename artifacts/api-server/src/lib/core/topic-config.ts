import type {
  DifficultyDistribution,
  GeneratorOptions,
  Pattern,
} from "./generator-engine";

export type TopicConfig = {
  domain: string;
  topic: string;
  enabledMotifs: string[];
  difficultyDistribution: DifficultyDistribution;
  parameterRanges?: Record<
    string,
    unknown
  >;
  distractorStrategies?: string[];
  validationRules?: string[];
  generationLimits?: {
    maxSteps?: number;
    maxClues?: number;
    maxCalculationLength?: number;
  };
};

const TOPIC_CONFIGS: TopicConfig[] = [
  {
    domain: "quant",
    topic: "Ratio, Proportion & Variation",
    enabledMotifs: [
      "ratio-simplification-core",
      "ratio-normalization-switch",
      "proportion-cross-balance",
      "weighted-ratio-distribution",
      "variation-dependency-switch",
      "partnership-ratio-switch",
      "age-ratio-state-shift",
      "multi-stage-ratio-state-change",
    ],
    difficultyDistribution: {
      easy: 25,
      medium: 50,
      hard: 25,
    },
    parameterRanges: {
      ratioPart: {
        min: 2,
        max: 13,
      },
      totalValue: {
        min: 120,
        max: 2400,
      },
      multiplier: {
        min: 2,
        max: 6,
      },
      changeAmount: {
        min: 2,
        max: 60,
      },
    },
    distractorStrategies: [
      "ratioInversion",
      "wrongNormalization",
      "directInverseSwap",
      "timeIgnored",
      "stateLoss",
    ],
    validationRules: [
      "preserve-ratio-consistency",
      "preserve-dependency-type",
      "prefer-clean-scale-factors",
      "avoid-cosmetic-context-duplicates",
    ],
    generationLimits: {
      maxSteps: 6,
      maxCalculationLength: 4,
    },
  },
  {
    domain: "quant",
    topic: "Time & Work",
    enabledMotifs: [
      "simple-combined-work",
      "delayed-join",
      "alternating-operation",
      "positive-negative-competition",
      "worker-equivalence",
      "resource-consumption",
      "efficiency-substitution",
      "inverse-work-trap",
    ],
    difficultyDistribution: {
      easy: 25,
      medium: 50,
      hard: 25,
    },
    parameterRanges: {
      workerCount: {
        min: 2,
        max: 5,
      },
      totalWork: {
        min: 24,
        max: 180,
      },
    },
    distractorStrategies: [
      "numeric-offsets",
    ],
    validationRules: [
      "integral-work-rates",
      "avoid-trivial-single-step",
    ],
    generationLimits: {
      maxSteps: 5,
      maxCalculationLength: 4,
    },
  },
  {
    domain: "seating-arrangement",
    topic: "Seating Arrangement",
    enabledMotifs: [
      "seating-sparse-anchor",
      "seating-indirect-elimination",
      "seating-orientation-inversion",
    ],
    difficultyDistribution: {
      easy: 20,
      medium: 50,
      hard: 30,
    },
    parameterRanges: {
      participantCount: {
        min: 5,
        max: 8,
      },
    },
    validationRules: [
      "reject-adjacency-chains",
      "require-unique-solution",
    ],
    generationLimits: {
      maxSteps: 8,
      maxClues: 8,
    },
  },
  {
    domain: "english",
    topic: "Error Spotting",
    enabledMotifs: [
      "subject_verb_ambiguity",
      "tense-confusion",
    ],
    difficultyDistribution: {
      easy: 30,
      medium: 45,
      hard: 25,
    },
    distractorStrategies: [
      "grammar-trap-mix",
    ],
    validationRules: [
      "single-dominant-error",
      "grammar-consistency",
    ],
    generationLimits: {
      maxSteps: 4,
    },
  },
  {
    domain: "di",
    topic: "Data Interpretation",
    enabledMotifs: [
      "percentage-heavy-calculations",
      "approximation-friendly-datasets",
    ],
    difficultyDistribution: {
      easy: 20,
      medium: 55,
      hard: 25,
    },
    parameterRanges: {
      rowCount: {
        min: 4,
        max: 7,
      },
      valueSpread: "moderate",
    },
    distractorStrategies: [
      "numeric-offsets",
    ],
    validationRules: [
      "stable-series-labels",
      "consistent-units",
    ],
    generationLimits: {
      maxCalculationLength: 4,
    },
  },
];

function normalize(
  value?: string,
) {
  return value
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function pickOffsets(
  strategies?: string[],
) {
  if (
    !strategies?.some(
      (strategy) =>
        strategy === "numeric-offsets" ||
        strategy ===
          "approximation-friendly-datasets",
    )
  ) {
    return undefined;
  }

  return {
    type: "numeric_offsets" as const,
    offsets: [-2, -1, 1, 2],
  };
}

export function listTopicConfigs() {
  return TOPIC_CONFIGS;
}

export function resolveTopicConfig(
  domain: string,
  topic: string,
) {
  const normalizedDomain =
    normalize(domain);
  const normalizedTopic =
    normalize(topic);

  return TOPIC_CONFIGS.find(
    (config) =>
      normalize(config.domain) ===
        normalizedDomain &&
      normalize(config.topic) ===
        normalizedTopic,
  );
}

export function applyTopicConfigToPattern(
  pattern: Pattern,
  topicConfig?: TopicConfig,
): Pattern {
  if (!topicConfig) {
    return pattern;
  }

  const participantRange =
    topicConfig.parameterRanges?.[
      "participantCount"
    ];
  const participantCount =
    typeof participantRange === "number"
      ? participantRange
      : typeof participantRange ===
            "object" &&
          participantRange !== null &&
          "max" in participantRange &&
          typeof (
            participantRange as {
              max?: unknown;
            }
          ).max === "number"
        ? Number(
          (
            participantRange as {
              max: number;
            }
          ).max,
        )
        : pattern.participantCount;
  const maxClues =
    topicConfig.generationLimits
      ?.maxClues;
  const maxSteps =
    topicConfig.generationLimits
      ?.maxSteps;

  return {
    ...pattern,
    supportedMotifs:
      topicConfig.enabledMotifs.length
        ? topicConfig.enabledMotifs
        : pattern.supportedMotifs,
    participantCount,
    clueTypes:
      maxClues &&
      pattern.clueTypes?.length
        ? pattern.clueTypes.slice(
          0,
          maxClues,
        )
        : pattern.clueTypes,
    inferenceDepth:
      maxSteps &&
      typeof pattern.inferenceDepth ===
        "number"
        ? Math.min(
          pattern.inferenceDepth,
          maxSteps,
        )
        : pattern.inferenceDepth,
    distractorStrategy:
      pattern.distractorStrategy ??
      pickOffsets(
        topicConfig.distractorStrategies,
      ),
    variables:
      Object.keys(
        topicConfig.parameterRanges ?? {},
      ).length > 0
        ? {
          ...pattern.variables,
          ...Object.fromEntries(
            Object.entries(
              topicConfig.parameterRanges ??
                {},
            ).filter(
              ([, value]) =>
                typeof value ===
                  "object" &&
                value !== null &&
                "min" in value &&
                "max" in value,
            ),
          ),
        }
        : pattern.variables,
  };
}

export function applyTopicConfigToOptions(
  options: GeneratorOptions | undefined,
  topicConfig?: TopicConfig,
): GeneratorOptions | undefined {
  if (!topicConfig) {
    return options;
  }

  return {
    ...options,
    difficultyDistribution:
      options?.difficultyDistribution ??
      topicConfig.difficultyDistribution,
  };
}
