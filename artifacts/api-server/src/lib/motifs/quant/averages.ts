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
  "overlap reconstruction",
  "correction adjustment",
  "average speed harmonic mean",
  "incremental join and leave",
  "cricket performance average",
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
  "cricket-performance average",
];

export const averagesProceduralMotifs: AverageMotifDraft[] =
  [
    {
      id: "basic-mean-construction",
      subtype: "direct_average",
      concepts: [
        "sum-state representation",
        "single average equation",
      ],
      hiddenStructures: [
        "sum = average x count",
      ],
      distractorFamilies: [
        "averageOnlyManipulation",
      ],
      arithmeticProfile: [
        "single missing variable",
      ],
      difficulty: 1,
      examples: [
        "Find the sum when average and count are given.",
      ],
    },
    {
      id: "incremental-join-leave",
      subtype: "group_combination",
      concepts: [
        "count transition",
        "updated average state",
      ],
      hiddenStructures: [
        "sum and count both change after join/leave",
      ],
      distractorFamilies: [
        "countOmission",
        "averageOnlyManipulation",
      ],
      arithmeticProfile: [
        "state transition",
      ],
      difficulty: 2,
      examples: [
        "A new teacher joins a class and the average changes.",
      ],
    },
    {
      id: "replacement-shift-net",
      subtype: "replacement",
      concepts: [
        "delta propagation",
        "count-invariant replacement",
      ],
      hiddenStructures: [
        "average shift multiplied by count gives total replacement gap",
      ],
      distractorFamilies: [
        "deltaSignError",
        "wrongCountUsage",
      ],
      arithmeticProfile: [
        "replacement delta",
      ],
      difficulty: 2,
      examples: [
        "One man is replaced and the average weight changes.",
      ],
    },
    {
      id: "overlap-boundary-logic",
      subtype: "missing_value",
      concepts: [
        "boundary overlap",
        "shared segment recovery",
      ],
      hiddenStructures: [
        "sum of windows double-counts the overlap",
      ],
      distractorFamilies: [
        "doubleCountFailure",
      ],
      arithmeticProfile: [
        "overlap subtraction",
      ],
      difficulty: 4,
      examples: [
        "Average of first X and last Y observations gives the overlap.",
      ],
    },
    {
      id: "correction-misread-data",
      subtype: "missing_value",
      concepts: [
        "misread value correction",
        "reported-average adjustment",
      ],
      hiddenStructures: [
        "wrong entry distorts the total by a fixed amount",
      ],
      distractorFamilies: [
        "wrongEntryDeltaIgnored",
      ],
      arithmeticProfile: [
        "correction delta",
      ],
      difficulty: 3,
      examples: [
        "Incorrect marks entry changes the reported average.",
      ],
    },
    {
      id: "symmetry-consecutive",
      subtype: "consecutive_numbers",
      concepts: [
        "ap symmetry",
        "middle-term compression",
      ],
      hiddenStructures: [
        "the average of a symmetric AP is the middle value",
      ],
      distractorFamilies: [
        "consecutiveMisalignment",
      ],
      arithmeticProfile: [
        "symmetric sequence",
      ],
      difficulty: 2,
      examples: [
        "Average of consecutive even numbers leads to the middle pair.",
      ],
    },
    {
      id: "weighted-composite-avg",
      subtype: "weighted_average",
      concepts: [
        "weighted group merge",
        "composite contribution",
      ],
      hiddenStructures: [
        "group sizes weight the average",
      ],
      distractorFamilies: [
        "arithmeticMeanTrap",
      ],
      arithmeticProfile: [
        "weighted merge",
      ],
      difficulty: 3,
      examples: [
        "Sections A and B are merged to form a combined average.",
      ],
    },
    {
      id: "cricket-performance",
      subtype: "score_reconstruction",
      concepts: [
        "innings average",
        "performance update",
      ],
      hiddenStructures: [
        "average shift through one innings or one target score",
      ],
      distractorFamilies: [
        "wrongCountUsage",
        "averageOnlyManipulation",
      ],
      arithmeticProfile: [
        "performance reconstruction",
      ],
      difficulty: 4,
      examples: [
        "A batsman raises the average in the nth innings.",
      ],
    },
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
      id: "overlap-average-reconstruction",
      subtype: "missing_value",
      concepts: [
        "overlapping windows",
        "middle-value recovery",
      ],
      hiddenStructures: [
        "shared middle term counted twice across overlapping averages",
      ],
      distractorFamilies: [
        "doubleCountFailure",
        "wrongCountUsage",
      ],
      arithmeticProfile: [
        "overlap subtraction",
      ],
      difficulty: 3,
      examples: [
        "Average of first six and last six numbers is known, along with the average of all eleven numbers.",
      ],
    },
    {
      id: "correction-delta-adjustment",
      subtype: "missing_value",
      concepts: [
        "entry correction",
        "average adjustment",
      ],
      hiddenStructures: [
        "wrong entry changes total by a fixed delta",
      ],
      distractorFamilies: [
        "wrongEntryDeltaIgnored",
        "averageOnlyManipulation",
      ],
      arithmeticProfile: [
        "correction propagation",
      ],
      difficulty: 2,
      examples: [
        "One number is read incorrectly and the correct average must be recovered.",
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
    {
      id: "average-speed-harmonic",
      subtype: "weighted_average",
      concepts: [
        "equal-distance average speed",
        "harmonic mean structure",
      ],
      hiddenStructures: [
        "distance weighting replaces direct arithmetic averaging of speeds",
      ],
      distractorFamilies: [
        "arithmeticMeanTrap",
        "weightedContributionIgnorance",
      ],
      arithmeticProfile: [
        "distance-weighted speed average",
      ],
      difficulty: 2,
      examples: [
        "A vehicle travels equal distances at two different speeds and the average speed is required.",
      ],
    },
  ];

export const averagesQuestionArchetypes =
  [
    "basic mean construction",
    "join and leave",
    "direct mean",
    "missing number",
    "overlapping averages",
    "wrong-entry correction",
    "replacement problem",
    "combined groups",
    "consecutive numbers",
    "age progression",
    "marks-score reconstruction",
    "average speed",
    "cricket performance",
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
  "forget to remove the duplicate overlap while combining two overlapping group sums",
  "use the arithmetic mean of two speeds when equal-distance average speed is required",
  "treat the wrong value as if it does not change the total sum",
];

export const averagesHiddenInferenceStructures =
  [
    "sum-state representation",
    "delta propagation",
    "weighted balance logic",
    "symmetry compression",
    "uniform shift invariance",
    "overlap subtraction",
    "harmonic speed averaging",
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
  {
    label:
      "Equal-Distance Average Speed",
    latex:
      "\\text{Average Speed} = \\frac{2S_1S_2}{S_1 + S_2}",
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
      id: "basic-mean-construction",
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
        "averageOnlyManipulation",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [1, 2],
      supportedDifficultyBands: [
        "Easy",
      ],
      generationStrategy: [
        "use sum = average x count and solve for one missing variable",
      ],
      distractorStrategies: [
        "swap sum and average roles",
      ],
      difficultyTuning: {
        easy: [
          "one-step direct average relation",
        ],
      },
      validationRules: [
        "keep values mentally solvable",
      ],
      diversityTags: [
        "average-basic",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        concise: 0.85,
      },
      examWeights: {
        ssc: 1.1,
      },
    }),
    defineQuantMotif({
      id: "incremental-join-leave",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "average-transformation",
        "conditional-selection",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "countOmission",
        "averageOnlyManipulation",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "update count and sum after one join or leave event before solving the hidden value",
      ],
      distractorStrategies: [
        "forget the denominator change",
      ],
      difficultyTuning: {
        easy: ["single entrant or exit"],
        medium: ["join/leave with hidden entrant value"],
        hard: ["join/leave chained with another update"],
      },
      validationRules: [
        "make count transitions explicit in the state model",
      ],
      diversityTags: [
        "average-join-leave",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.15,
      },
    }),
    defineQuantMotif({
      id: "replacement-shift-net",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "average-transformation",
        "hidden-base-inference",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "deltaSignError",
        "wrongCountUsage",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "treat replacement as count-invariant and propagate the average shift across the full count",
      ],
      distractorStrategies: [
        "apply the shift to a single person instead of the full group",
      ],
      difficultyTuning: {
        medium: ["single replacement"],
        hard: ["replacement plus narrative concealment or mixed units"],
      },
      validationRules: [
        "replacement questions must preserve the original count",
      ],
      diversityTags: [
        "average-replacement-net",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.8,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ssc: 1.2,
      },
    }),
    defineQuantMotif({
      id: "overlap-boundary-logic",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "comparison-chain",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "aggregate",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "doubleCountFailure",
        "wrongCountUsage",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "use first-window and last-window averages to recover an overlap or boundary term",
      ],
      distractorStrategies: [
        "forget the overlap subtraction",
      ],
      difficultyTuning: {
        medium: ["single shared middle value"],
        hard: ["larger overlap or concealed boundary term"],
      },
      validationRules: [
        "preserve a real overlap between the windows",
      ],
      diversityTags: [
        "average-overlap-boundary",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.75,
        inferenceHeavy: 0.8,
      },
      examWeights: {
        ssc: 1.1,
      },
    }),
    defineQuantMotif({
      id: "correction-misread-data",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "hidden-base-inference",
        "average-transformation",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "wrongEntryDeltaIgnored",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "repair a reported average by correcting one or more misread entries",
      ],
      distractorStrategies: [
        "correct the average directly without adjusting the total",
      ],
      difficultyTuning: {
        medium: ["single wrong entry"],
        hard: ["multiple-unit or concealed correction context"],
      },
      validationRules: [
        "prefer clean corrected averages",
      ],
      diversityTags: [
        "average-correction-misread",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.15,
      },
    }),
    defineQuantMotif({
      id: "symmetry-consecutive",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "simple-ratio",
        "hidden-base-inference",
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
        "compress symmetric AP or consecutive sets through the middle-term property",
      ],
      distractorStrategies: [
        "take the average as an endpoint",
      ],
      difficultyTuning: {
        easy: ["odd consecutive set"],
        medium: ["even consecutive or mixed parity set"],
      },
      validationRules: [
        "keep consecutive gaps explicit or recoverable",
      ],
      diversityTags: [
        "average-symmetry",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        concise: 0.85,
      },
      examWeights: {
        ssc: 1.1,
      },
    }),
    defineQuantMotif({
      id: "weighted-composite-avg",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "comparison-chain",
        "average-transformation",
      ],
      preferredOperations: [
        "aggregate",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "arithmeticMeanTrap",
        "weightedContributionIgnorance",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "merge groups through weighted contribution rather than simple averaging",
      ],
      distractorStrategies: [
        "use the mean of subgroup averages directly",
      ],
      difficultyTuning: {
        medium: ["two-group weighted merge"],
        hard: ["hidden ratio or weighted target reconstruction"],
      },
      validationRules: [
        "avoid equal group sizes when weighted logic is intended",
      ],
      diversityTags: [
        "average-weighted-composite",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.15,
      },
    }),
    defineQuantMotif({
      id: "cricket-performance",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
        "conditional-selection",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "wrongCountUsage",
        "averageOnlyManipulation",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Hard",
      ],
      generationStrategy: [
        "use innings or target-performance context to conceal an average reconstruction problem",
      ],
      distractorStrategies: [
        "forget that one more innings changes the denominator",
      ],
      difficultyTuning: {
        hard: ["batting-average or score-target reconstruction"],
      },
      validationRules: [
        "keep performance values realistic and integral",
      ],
      diversityTags: [
        "average-cricket",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        inferenceHeavy: 0.8,
      },
      examWeights: {
        ssc: 1.0,
      },
    }),
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
      id: "overlap-average-reconstruction",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "comparison-chain",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "aggregate",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "doubleCountFailure",
        "wrongCountUsage",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "use overlapping averages to recover the shared middle value or overlapping contribution",
      ],
      distractorStrategies: [
        "add both partial sums without removing the overlapped term",
      ],
      difficultyTuning: {
        medium: [
          "recover one middle value from two overlapping windows",
        ],
        hard: [
          "recover a hidden overlapping quantity from multiple averages",
        ],
      },
      validationRules: [
        "keep overlap counts small enough for mental tracking",
      ],
      diversityTags: [
        "average-overlap",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.05,
        ibps: 1.15,
      },
    }),
    defineQuantMotif({
      id: "correction-delta-adjustment",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "hidden-base-inference",
        "average-transformation",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "wrongEntryDeltaIgnored",
        "averageOnlyManipulation",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "adjust the reported total by the wrong-entry delta and then recover the corrected average",
      ],
      distractorStrategies: [
        "change the average directly without scaling the correction over the full count",
      ],
      difficultyTuning: {
        easy: [
          "single wrong entry correction",
        ],
        medium: [
          "correction with decimal average output",
        ],
        hard: [
          "multiple values or misleading reported average context",
        ],
      },
      validationRules: [
        "prefer corrections that produce clean final averages",
      ],
      diversityTags: [
        "average-correction",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        concise: 0.8,
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.2,
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
      id: "average-speed-harmonic",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "comparison-chain",
        "conditional-ratio-logic",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "simpleMeanTrap",
        "weightedContributionIgnorance",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "use equal-distance weighting to recover average speed rather than taking a direct mean of speeds",
      ],
      distractorStrategies: [
        "apply arithmetic mean to the two speeds",
      ],
      difficultyTuning: {
        medium: [
          "out-and-back journey with two speeds",
        ],
        hard: [
          "nested equal-distance or multi-leg average speed connection",
        ],
      },
      validationRules: [
        "prefer speed pairs that yield clean harmonic means",
      ],
      diversityTags: [
        "average-speed",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.7,
      },
      examWeights: {
        ssc: 1.0,
        ibps: 1.15,
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
