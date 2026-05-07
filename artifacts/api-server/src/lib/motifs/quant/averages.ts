import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type AverageSubtype =
  | "direct_average"
  | "replacement"
  | "weighted_average"
  | "consecutive_numbers"
  | "age_average"
  | "score_reconstruction"
  | "missing_value"
  | "group_combination";

type AverageMotifDraft = {
  id: string;
  subtype: AverageSubtype;
  concepts: string[];
  hiddenStructures: string[];
  distractorFamilies: string[];
  arithmeticProfile: string[];
  difficulty: 1 | 2 | 3 | 4;
  examples: string[];
};

export const averagesScopeMap = {
  chapter: "Averages",
  coreDomains: [
    "Arithmetic Mean",
    "Weighted Average",
    "Replacement Problems",
    "Age Averages",
    "Consecutive Numbers",
    "Group Combination",
    "Increment/Decrease in Average",
    "Missing Value Reconstruction",
    "Mixture-Type Average Logic",
    "Scorecard Problems",
    "Average Speed Connections",
  ],
} as const;

export const averagesConcepts = [
  "arithmetic mean",
  "weighted average",
  "replacement delta propagation",
  "group combination",
  "consecutive number symmetry",
  "uniform age shift",
  "score reconstruction",
  "sum-state manipulation",
];

export const averagesCoreFrameworks = [
  {
    id: "CF1",
    title: "Arithmetic Mean Engine",
    canonicalRelation:
      "sum = average x count",
    coreVariables: [
      "average",
      "sum",
      "count",
    ],
  },
  {
    id: "CF2",
    title:
      "Weighted Average Framework",
    canonicalRelation:
      "weighted_average = sum(value x weight) / sum(weights)",
    coreVariables: [
      "value",
      "weight",
      "contribution",
    ],
  },
  {
    id: "CF3",
    title:
      "Incremental Average Transformation",
    canonicalRelation:
      "new_sum = old_sum +/- change",
    coreVariables: [
      "old_sum",
      "new_sum",
      "new_count",
    ],
  },
  {
    id: "CF4",
    title:
      "Consecutive Number Compression",
    canonicalRelation:
      "average = middle_term for symmetric consecutive sets",
    coreVariables: [
      "middle term",
      "step",
      "count",
    ],
  },
  {
    id: "CF5",
    title:
      "Combined Group Framework",
    canonicalRelation:
      "combined_average = (total_sum1 + total_sum2) / (total_count1 + total_count2)",
    coreVariables: [
      "group sum",
      "group count",
      "combined average",
    ],
  },
  {
    id: "CF6",
    title:
      "Deficit/Excess Interpretation",
    canonicalRelation:
      "average acts as a balancing point for deviations",
    coreVariables: [
      "deviation",
      "balancing point",
      "distribution",
    ],
  },
];

export const averagesConceptModules = [
  "direct average computation",
  "missing observation reconstruction",
  "replacement problems",
  "joining and leaving systems",
  "weighted population systems",
  "consecutive integer systems",
  "age average systems",
  "scorecard reconstruction",
  "mixture-type average logic",
  "average speed integration",
];

export const averagesProceduralMotifs: AverageMotifDraft[] =
  [
    {
      id: "sum-recovery",
      subtype: "missing_value",
      concepts: [
        "sum-state representation",
        "total reconstruction",
      ],
      hiddenStructures: [
        "average x count gives total sum",
      ],
      distractorFamilies: [
        "averageOnlyManipulation",
        "countOmission",
      ],
      arithmeticProfile: [
        "single reconstruction",
      ],
      difficulty: 1,
      examples: [
        "Average of 8 numbers is x. Seven numbers are known. Find the missing number.",
      ],
    },
    {
      id: "replacement-average-shift",
      subtype: "replacement",
      concepts: [
        "delta propagation",
        "replacement shift",
      ],
      hiddenStructures: [
        "average change -> total change",
      ],
      distractorFamilies: [
        "deltaSignError",
        "wrongCountUsage",
      ],
      arithmeticProfile: [
        "count x delta shortcut",
      ],
      difficulty: 2,
      examples: [
        "One student is replaced and the average rises by 2.",
      ],
    },
    {
      id: "group-weighted-average",
      subtype: "weighted_average",
      concepts: [
        "weighted contribution",
        "group combination",
      ],
      hiddenStructures: [
        "unequal counts control contribution",
      ],
      distractorFamilies: [
        "arithmeticMeanTrap",
        "weightedContributionIgnorance",
      ],
      arithmeticProfile: [
        "two-group weighting",
      ],
      difficulty: 2,
      examples: [
        "Average of boys and girls is given separately. Find the combined average.",
      ],
    },
    {
      id: "consecutive-middle-term",
      subtype: "consecutive_numbers",
      concepts: [
        "sequence symmetry",
        "middle-term compression",
      ],
      hiddenStructures: [
        "average equals center of symmetric consecutive set",
      ],
      distractorFamilies: [
        "consecutiveMisalignment",
      ],
      arithmeticProfile: [
        "symmetric sequence",
      ],
      difficulty: 1,
      examples: [
        "Average of five consecutive integers is 25. Find the largest.",
      ],
    },
    {
      id: "age-average-shift",
      subtype: "age_average",
      concepts: [
        "uniform time shift",
        "age progression",
      ],
      hiddenStructures: [
        "adding same value to each member shifts average equally",
      ],
      distractorFamilies: [
        "uniformTimeShiftFailure",
        "countOmission",
      ],
      arithmeticProfile: [
        "uniform increment",
      ],
      difficulty: 2,
      examples: [
        "Average age of a family after 3 years becomes 28.",
      ],
    },
    {
      id: "score-target-reconstruction",
      subtype: "score_reconstruction",
      concepts: [
        "target average",
        "required score",
      ],
      hiddenStructures: [
        "target sum minus achieved sum",
      ],
      distractorFamilies: [
        "averageOnlyManipulation",
      ],
      arithmeticProfile: [
        "target reconstruction",
      ],
      difficulty: 2,
      examples: [
        "Required marks in the last paper to achieve a target average.",
      ],
    },
    {
      id: "multi-stage-average-update",
      subtype: "group_combination",
      concepts: [
        "multi-stage state transitions",
        "sequential group updates",
      ],
      hiddenStructures: [
        "sum and count both mutate across stages",
      ],
      distractorFamilies: [
        "multiStageStateLoss",
        "countOmission",
      ],
      arithmeticProfile: [
        "multi-stage chaining",
      ],
      difficulty: 4,
      examples: [
        "A member leaves, another joins, and then the average changes again.",
      ],
    },
  ];

export const averagesQuestionArchetypes =
  [
    "direct mean",
    "missing number",
    "replacement problem",
    "combined groups",
    "consecutive numbers",
    "age progression",
    "marks-score reconstruction",
    "multi-stage average update",
  ];

export const averagesDistractorEngineering = [
  "use simple mean where weighted mean is required",
  "forget that a replaced person still belongs to the same count",
  "change averages directly without rebuilding sums",
  "treat average as smallest or largest consecutive term instead of middle term",
  "handle age changes individually instead of uniformly",
  "ignore subgroup sizes in combined average questions",
  "reverse increase-decrease direction",
  "forget the effect of earlier transformations in multi-stage updates",
];

export const averagesHiddenInferenceStructures =
  [
    "sum-state representation",
    "delta propagation",
    "weighted balance logic",
    "symmetry compression",
    "uniform shift invariance",
  ];

export const averagesDifficultyScaling = {
  L1: [
    "direct average computation",
    "single missing value recovery",
    "clean consecutive compression",
  ],
  L2: [
    "single replacement delta propagation",
    "two-group weighted average",
    "score reconstruction",
  ],
  L3: [
    "age average with join/leave twist",
    "hidden weighted contribution",
    "chained sum reconstruction",
  ],
  L4: [
    "multi-stage group transformation",
    "nested weighted and replacement interactions",
  ],
} as const;

export const averagesDifficultyTuning = [
  "easy: direct mean, missing sum, or simple consecutive compression",
  "medium: replacement delta, weighted merge, score reconstruction, age shift",
  "hard: multi-stage transformations, nested weighted contribution, hidden sum-state chaining",
];

export const averagesNumericDesignPatterns =
  [
    "use common SSC-friendly counts like 5, 7, 8, 10, 12, 15, 20",
    "prefer clean consecutive centers like 15, 20, 25, 30, 35",
    "prefer subgroup ratios such as 2:3, 3:5, 4:7, 5:8 for weighted merges",
    "keep average deltas small, typically 1, 2, 3, or 5",
  ];

export const averagesGeneratorConstraints =
  [
    "preserve sum consistency across every transformation",
    "reward observation and shortcuts over long arithmetic",
    "keep weighted and simple mean topologies clearly separated",
    "keep group sizes human-realistic and exam-feasible",
    "treat middle-term symmetry variants as one topology family",
  ];

export const averagesGenerationStrategyMetadata =
  [
    "Averages is a sum-state topic first, not a raw division topic",
    "Replacement, age, marks, and salary variants should collapse by topology rather than wording",
    "High-quality average generation should rotate beyond replacement into weighted and multi-stage structures",
    "Avoid fake diversity from merely swapping nouns while preserving identical delta-propagation topology",
  ];

export const averagesFormulaBank = [
  {
    label: "Average",
    latex:
      "\\text{Average} = \\frac{\\text{Sum}}{\\text{Count}}",
  },
  {
    label: "Weighted Average",
    latex:
      "\\text{Weighted Average} = \\frac{\\sum (x_i w_i)}{\\sum w_i}",
  },
  {
    label: "Total Change",
    latex:
      "\\text{Total Change} = \\text{Average Change} \\times \\text{Number of Observations}",
  },
];

export const averagesMetadataSchema = {
  subtype: [
    "direct_average",
    "replacement",
    "weighted_average",
    "consecutive_numbers",
    "age_average",
    "score_reconstruction",
    "missing_value",
    "group_combination",
  ],
  fields: [
    "primitives",
    "hiddenStructures",
    "distractorFamilies",
    "arithmeticProfile",
    "difficulty",
  ],
} as const;

export const averagesEvaluationRisks = [
  "formula leakage from phrases like average increases by or combined average",
  "topology repetition where many contexts collapse into sum reconstruction",
  "artificial context switching without structural diversity",
];

export const averagesRealismWeaknesses = [
  "overusing replacement problems",
  "overusing age contexts",
  "producing arithmetic-only average questions",
  "avoiding weighted reasoning depth",
];

export const averagesAntiRepetitionNotes = [
  "Treat age replacement, marks replacement, and salary replacement as the same delta-propagation topology.",
  "Treat class, population, income, and marks-group merge as the same weighted-contribution topology.",
];

export const averagesMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "sum-recovery",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "direct-substitution",
        "one-step-arithmetic",
      ],
      preferredOperations: [
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "countOmission",
        "averageOnlyManipulation",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [1, 3],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "recover the total sum from average and count before solving for a missing value",
      ],
      distractorStrategies: [
        "manipulate the average directly instead of reconstructing the sum",
      ],
      difficultyTuning: {
        easy: [
          "single missing value",
        ],
        medium: [
          "missing value after one extra condition",
        ],
      },
      validationRules: [
        "keep totals mentally solvable",
      ],
      diversityTags: [
        "average-sum-recovery",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        concise: 0.85,
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.0,
      },
    }),
    defineQuantMotif({
      id: "replacement-average-shift",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "average-transformation",
        "hidden-base-inference",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "differenceSignError",
        "wrongCountUsage",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "use average change to infer total change, then back out the replaced or joined value",
      ],
      distractorStrategies: [
        "apply the change to one value instead of the full count",
        "reverse the increase or decrease sign",
      ],
      difficultyTuning: {
        medium: [
          "single replacement",
        ],
        hard: [
          "replacement plus one extra hidden state",
        ],
      },
      validationRules: [
        "prefer clean integer delta shifts",
      ],
      diversityTags: [
        "average-replacement",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.3,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "group-weighted-average",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "comparison-chain",
        "average-transformation",
      ],
      preferredOperations: [
        "aggregate",
        "transform",
        "compare",
      ],
      commonDistractors: [
        "simpleMeanTrap",
        "wrongGroupSize",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "combine groups through weighted contribution rather than direct averaging of subgroup means",
      ],
      distractorStrategies: [
        "take simple mean of group averages",
        "ignore group-size asymmetry",
      ],
      difficultyTuning: {
        easy: [
          "two groups with direct merge",
        ],
        medium: [
          "one hidden weighted component",
        ],
        hard: [
          "sequential weighted merge",
        ],
      },
      validationRules: [
        "avoid equal group sizes when weighted reasoning is intended",
      ],
      diversityTags: [
        "average-weighted",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.25,
      },
    }),
    defineQuantMotif({
      id: "consecutive-middle-term",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "hidden-base-inference",
        "simple-ratio",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "consecutiveMisalignment",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [1, 3],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "compress symmetric consecutive sets into middle-term inference",
      ],
      distractorStrategies: [
        "treat the average as an endpoint instead of the center",
      ],
      difficultyTuning: {
        easy: [
          "odd number of consecutive integers",
        ],
        medium: [
          "largest or smallest term recovery from the middle term",
        ],
      },
      validationRules: [
        "prefer clean symmetric ranges",
      ],
      diversityTags: [
        "average-consecutive",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        concise: 0.8,
      },
      examWeights: {
        ssc: 1.1,
      },
    }),
    defineQuantMotif({
      id: "age-average-shift",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "conditional-ratio-logic",
        "average-transformation",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "uniformTimeShiftFailure",
        "countOmission",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "treat time progression as a uniform shift across the full group before resolving the hidden age",
      ],
      distractorStrategies: [
        "change individual ages inconsistently",
        "forget that every member ages equally with time",
      ],
      difficultyTuning: {
        medium: [
          "uniform age shift only",
        ],
        hard: [
          "age shift plus join or leave event",
        ],
      },
      validationRules: [
        "keep counts small and realistic",
      ],
      diversityTags: [
        "average-age",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.15,
      },
    }),
    defineQuantMotif({
      id: "score-target-reconstruction",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
        "direct-substitution",
      ],
      preferredOperations: [
        "aggregate",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "averageOnlyManipulation",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "convert target average into target total, then recover the required missing score or value",
      ],
      distractorStrategies: [
        "subtract from the average instead of the total",
      ],
      difficultyTuning: {
        easy: [
          "single required score",
        ],
        medium: [
          "one hidden achieved total",
        ],
        hard: [
          "target score after an earlier state change",
        ],
      },
      validationRules: [
        "prefer clean target totals",
      ],
      diversityTags: [
        "average-score-target",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.05,
      },
    }),
    defineQuantMotif({
      id: "multi-stage-average-update",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
        "nested-operations",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "multiStageStateLoss",
        "countOmission",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Hard",
      ],
      generationStrategy: [
        "apply two or more state transitions where sum and count both change before the final hidden-value inference",
      ],
      distractorStrategies: [
        "forget the impact of the first transformation",
        "reuse the wrong count in later stages",
      ],
      difficultyTuning: {
        hard: [
          "join or leave followed by replacement or target-average recovery",
        ],
      },
      validationRules: [
        "limit transformations to mentally trackable stages",
      ],
      diversityTags: [
        "average-multi-stage",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        inferenceHeavy: 0.75,
        balanced: 0.65,
      },
      examWeights: {
        ssc: 1.0,
      },
    }),
  ];
