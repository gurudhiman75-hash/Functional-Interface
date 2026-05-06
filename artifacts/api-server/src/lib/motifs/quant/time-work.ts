import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

export const timeWorkConcepts = [
  "rate-based work model",
  "unit work abstraction",
  "reciprocal efficiency representation",
  "additive/subtractive rate composition",
  "efficiency-time inversion",
  "partial work progression",
  "multi-agent linear systems",
  "positive-negative work",
  "resource consumption",
];

export const timeWorkGeneratorFields = [
  "entity_count",
  "individual_rates",
  "total_work_model",
  "rate_sign",
];

export const timeWorkStructuralForms = [
  "direct ratio",
  "percentage efficiency",
  "multiplicative efficiency",
  "comparative efficiency chains",
];

export const timeWorkStateTransitionTypes = [
  "join",
  "leave",
  "pause",
  "alternate",
  "leak activation",
];

export const timeWorkEntityTypes = [
  "workers",
  "men/women/boys",
  "machines",
  "pumps",
  "companies",
];

export const timeWorkDistractorStrategies =
  [
    "reciprocal inversion",
    "partial-work omission",
    "wrong LCM aggregation",
    "sign error",
    "cycle boundary error",
    "percentage misinterpretation",
    "weighted-entity confusion",
    "incorrect residual allocation",
    "pairwise-system misresolution",
    "premature completion assumption",
  ];

export const timeWorkParameterRules = [
  "prefer LCM-friendly families such as 6,8,12 or 10,15,20",
  "control fraction density through denominator size and residual complexity",
  "avoid exact completion before a transition point",
  "prefer clean efficiency ratios such as 2:1, 3:2, 5:4, 25%, 50%",
  "ensure multi-agent systems reduce cleanly",
  "calibrate alternation questions around near-boundary completion",
  "keep distractors close to realistic student mistakes",
  "scale difficulty through inference count and concealment instead of larger values",
  "preserve narrative independence across workers, pipes, machines, and resources",
];

export const timeWorkDifficultyTuning = [
  "easy: single-phase, direct aggregation, low arithmetic friction",
  "medium: partial-work tracking, one state transition, one hidden variable",
  "hard: multi-phase accumulation, cyclic reasoning, reverse deduction, or heterogeneous entity mapping",
  "raise difficulty through phase count, sign complexity, and concealment rather than bigger numbers",
];

export const timeWorkCommonInferenceChains =
  [
    "individual time -> reciprocal rate -> combined rate -> inverse to completion time",
    "initial phase work -> subtract from total -> solve residual phase",
    "efficiency ratio -> inverse time ratio -> operational rate",
    "pairwise rates -> isolate individual rates -> recombine",
    "positive rate - negative rate -> net rate -> completion or emptying time",
    "heterogeneous entities -> equivalent worker units -> unified-rate model",
    "full-cycle contribution -> repeated cycles -> terminal partial cycle",
    "resource stock -> consumption rate -> population change -> remaining duration",
  ];

export const timeWorkGenerationStrategyMetadata =
  [
    "prefer phase-based rate-state transitions over direct together-work templates",
    "use additive reciprocal systems as the default computational backbone",
    "promote residual-state reasoning for medium and hard questions",
    "reuse weighted equivalence models across workers, machines, pipes, and resource contexts",
    "support cyclic accumulation for alternating-operation questions",
    "the strongest reusable abstraction is phase-based rate-state transitions under constrained arithmetic",
  ];

export const timeWorkMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "simple-combined-work",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "direct-rate-aggregation",
        "reciprocal-rate-system",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "reverse",
      ],
      commonDistractors: [
        "reciprocalInversion",
        "wrongLCMAggregation",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [1, 3],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "start from two individual completion times",
        "convert them into rates and combine directly",
      ],
      parameterRanges: {
        workerA: { min: 6, max: 24 },
        workerB: { min: 8, max: 30 },
      },
      distractorStrategies: [
        "confuse time with rate",
        "add times instead of rates",
      ],
      difficultyTuning: {
        easy: [
          "two-worker direct aggregation",
        ],
        medium: [
          "clean but non-trivial reciprocals",
        ],
      },
      validationRules: [
        "prefer clean combined times",
      ],
      diversityTags: [
        "combined-work",
        "reciprocal-system",
      ],
      rotationGroup:
        "quant-time-work-core",
      wordingBias: {
        concise: 0.8,
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.05,
      },
    }),
    defineQuantMotif({
      id: "delayed-join",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "partial-progress-tracking",
        "phase-transition",
      ],
      preferredOperations: [
        "transform",
        "filter",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "partialWorkOmission",
        "incorrectResidualAllocation",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "one worker starts alone before another joins",
        "use remaining work rather than the original total directly",
      ],
      parameterRanges: {
        joinDelay: { min: 1, max: 8 },
        totalWork: { min: 24, max: 240 },
      },
      distractorStrategies: [
        "ignore completed work before the join point",
        "solve from total work instead of remaining work",
      ],
      difficultyTuning: {
        medium: [
          "single join event",
        ],
        hard: [
          "join after partial completion with a hidden residual state",
        ],
      },
      validationRules: [
        "avoid exact completion before transition",
        "ensure residual work remains meaningful",
      ],
      diversityTags: [
        "phase-transition",
        "residual-state",
      ],
      rotationGroup:
        "quant-time-work-phases",
      wordingBias: {
        balanced: 0.8,
        inferenceHeavy: 0.75,
      },
      examWeights: {
        ssc: 1.05,
        ibps: 1.2,
      },
    }),
    defineQuantMotif({
      id: "alternating-operation",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "cycle-reasoning",
        "cyclic-accumulation",
      ],
      preferredOperations: [
        "aggregate",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "cycleBoundaryError",
        "prematureCompletionAssumption",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [4, 8],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "workers operate on alternating days or shifts",
        "build progress by full cycles before resolving the terminal partial cycle",
      ],
      parameterRanges: {
        cycleLength: { min: 2, max: 4 },
      },
      distractorStrategies: [
        "stop at the last full cycle instead of the terminal step",
        "ignore residual work after a cycle",
      ],
      difficultyTuning: {
        medium: [
          "two-worker alternation",
        ],
        hard: [
          "alternation with unequal efficiencies and near-boundary completion",
        ],
      },
      validationRules: [
        "ensure meaningful terminal overshoot or near-overshoot",
      ],
      diversityTags: [
        "alternating-work",
        "cycle-boundary",
      ],
      rotationGroup:
        "quant-time-work-cycles",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.8,
      },
      examWeights: {
        ibps: 1.2,
        sbi: 1.15,
      },
    }),
    defineQuantMotif({
      id: "positive-negative-competition",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "net-rate-system",
        "positive-negative-interaction",
      ],
      preferredOperations: [
        "filter",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "signError",
        "reciprocalInversion",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "combine constructive and destructive agents into one net-rate model",
      ],
      distractorStrategies: [
        "add the leak or destructive rate instead of subtracting it",
      ],
      difficultyTuning: {
        easy: [
          "single leak or drain",
        ],
        medium: [
          "delayed activation of the destructive rate",
        ],
        hard: [
          "multiple destructive contributors with a phase transition",
        ],
      },
      validationRules: [
        "keep the net rate positive unless the question explicitly asks for emptying time",
      ],
      diversityTags: [
        "signed-rates",
        "fill-empty",
      ],
      rotationGroup:
        "quant-time-work-net-rate",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.15,
      },
    }),
    defineQuantMotif({
      id: "worker-equivalence",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "weighted-equivalence",
        "linear-substitution",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "weightedEntityConfusion",
        "wrongEfficiencyBase",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "map heterogeneous contributors into equivalent worker units",
        "resolve the question through weighted substitution instead of direct aggregation",
      ],
      parameterRanges: {
        entityCount: { min: 2, max: 4 },
        equivalenceRatio: { min: 2, max: 6 },
      },
      distractorStrategies: [
        "treat heterogeneous contributors as identical",
      ],
      difficultyTuning: {
        medium: [
          "single equivalence relation",
        ],
        hard: [
          "multiple weighted entity mappings",
        ],
      },
      validationRules: [
        "ensure equivalence reduces cleanly",
      ],
      diversityTags: [
        "weighted-workers",
        "equivalent-units",
      ],
      rotationGroup:
        "quant-time-work-equivalence",
      wordingBias: {
        balanced: 0.75,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ibps: 1.2,
        rrb: 1.05,
      },
    }),
    defineQuantMotif({
      id: "resource-consumption",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "consumption-conservation",
        "population-time-equivalence",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "weightedEntityConfusion",
        "incorrectResidualAllocation",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "treat consumption as a conserved resource system",
        "translate population changes into revised consumption duration",
      ],
      parameterRanges: {
        population: { min: 10, max: 200 },
        duration: { min: 5, max: 60 },
      },
      distractorStrategies: [
        "ignore the conservation step and scale duration directly",
      ],
      difficultyTuning: {
        medium: [
          "single population change",
        ],
        hard: [
          "multiple resource-consumption phases",
        ],
      },
      validationRules: [
        "preserve clean man-day style arithmetic",
      ],
      diversityTags: [
        "resource-conservation",
        "population-shift",
      ],
      rotationGroup:
        "quant-time-work-resource",
    }),
    defineQuantMotif({
      id: "efficiency-substitution",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "conditional-ratio-logic",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "directTimeAdd",
        "wrongEfficiencyBase",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "substitute workers or machines with equivalent efficiency ratios",
        "convert individual capacities into a common work-rate frame",
      ],
      parameterRanges: {
        workerCount: {
          min: 2,
          max: 6,
        },
        totalWork: {
          min: 24,
          max: 240,
        },
      },
      distractorStrategies: [
        "add times instead of rates",
        "ignore efficiency equivalence",
      ],
      difficultyTuning: {
        easy: [
          "two-worker equivalence",
          "direct combined work after conversion",
        ],
        medium: [
          "team replacement",
          "partial-day contribution after substitution",
        ],
        hard: [
          "partial work before substitution",
          "multi-team equivalence chain",
        ],
      },
      validationRules: [
        "prefer integral unit rates",
        "avoid trivial LCMs",
      ],
      diversityTags: [
        "efficiency-map",
      ],
      rotationGroup:
        "quant-time-work-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.15,
        ibps: 1.2,
      },
    }),
    defineQuantMotif({
      id: "inverse-work-trap",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "conditional-ratio-logic",
      ],
      preferredOperations: [
        "reverse",
        "compare",
        "filter",
      ],
      commonDistractors: [
        "inverseRelationMiss",
        "rateTimeSwap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "hide the inverse time-rate relationship behind productivity comparisons",
        "require one elimination step before the rate relation becomes usable",
      ],
      parameterRanges: {
        dayCount: {
          min: 4,
          max: 24,
        },
        workShare: {
          min: 1,
          max: 8,
        },
      },
      distractorStrategies: [
        "use direct proportion instead of inverse proportion",
        "swap completed-work share with remaining-work share",
      ],
      difficultyTuning: {
        medium: [
          "one inverse relation",
          "single join or leave adjustment",
        ],
        hard: [
          "inverse relation plus join or leave event",
          "inverse relation with partial-completion backsolve",
        ],
      },
      validationRules: [
        "ensure final work fraction is clean",
        "avoid ambiguous multi-rate interpretations",
      ],
      diversityTags: [
        "inverse-work",
      ],
      rotationGroup:
        "quant-time-work-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.1,
        rrb: 1.1,
        ibps: 1.1,
      },
    }),
  ];
