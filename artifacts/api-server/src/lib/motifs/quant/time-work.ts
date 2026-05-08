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
  "state machine work tracking",
  "negative-rate balancing",
  "cycle remainder logic",
  "man-hour equivalence",
];

export const timeWorkScopeMap = {
  chapter: "Time, Work & Pipes",
  coreDomains: [
    "Simple Combined Work",
    "Efficiency Comparison",
    "Delayed Join and Leaving",
    "Alternating Work",
    "Men Days Hours",
    "Men Women Children Equivalence",
    "Wages and Contribution",
    "Pipes and Cisterns",
    "Leak and Drain",
    "Variable Rate Work",
    "Partial Work Targets",
    "Negative Work",
  ],
} as const;

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

export const timeWorkAdvancedConceptModules =
  [
    "lcm-work-unitization",
    "negative-rate balancing",
    "man-hour equivalence",
    "cycle remainder logic",
    "state transition algebra",
  ];

export const timeWorkProceduralMotifs = [
  "tw-basic-2-sum",
  "tw-basic-3-sum",
  "tw-component-extract",
  "tw-eff-integer",
  "tw-eff-pct-boost",
  "tw-eff-pct-reduce",
  "tw-comparison-hidden",
  "tw-stage-join-start",
  "tw-stage-leave-start",
  "tw-stage-deadline-exit",
  "tw-stage-asymmetric-3",
  "tw-stage-handoff",
  "tw-stage-staggered-join",
  "tw-cycle-alternate-2",
  "tw-cycle-alternate-3",
  "tw-cycle-assist-single",
  "tw-cycle-assist-group",
  "tw-cycle-helper-toggle",
  "tw-group-mdh-standard",
  "tw-group-equivalence-or",
  "tw-group-system-and",
  "tw-contractor-pressure",
  "tw-wage-efficiency",
  "tw-wage-work-done",
  "tw-pipe-fill-leak",
  "tw-pipe-clock-sync",
  "tw-pipe-threshold",
  "tw-regressive-climb",
];

export const timeWorkDifficultyDrivers = [
  "arithmetic friction through fractional days or minutes",
  "context concealment through comparative wording instead of explicit efficiency wording",
  "multi-stage transitions with join, leave, and rate changes",
  "identity variables like men, women, boys, and machines in one system",
];

export const timeWorkFormulaBank = [
  {
    label: "Combined Rate",
    latex:
      "\\text{Combined Rate} = \\sum \\frac{1}{T_i}",
  },
  {
    label: "Net Pipe Rate",
    latex:
      "\\text{Net Rate} = R_{in} - R_{out}",
  },
  {
    label: "Men Days Hours",
    latex:
      "\\frac{M_1 D_1 H_1}{W_1} = \\frac{M_2 D_2 H_2}{W_2}",
  },
  {
    label: "Wage Share",
    latex:
      "\\text{Wage Share} \\propto \\text{Rate} \\times \\text{Days Worked}",
  },
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

function defineCanonicalTimeWorkMotif(
  id: string,
  rotationGroup: string,
  reasoningDepthRange: [number, number],
  generationStrategy: string[],
  commonDistractors: string[],
  supportedDifficultyBands: Array<
    "Easy" | "Medium" | "Hard"
  > = ["Easy", "Medium", "Hard"],
): QuantMotif {
  return defineQuantMotif({
    id,
    topicCluster: "time-work",
    archetype: "general",
    reasoningCategories: [
      "multi-step-arithmetic",
      "conditional-ratio-logic",
    ],
    preferredOperations: [
      "transform",
      "aggregate",
      "infer",
    ],
    commonDistractors,
    inferenceStyle: "conditional",
    reasoningDepthRange,
    supportedDifficultyBands,
    generationStrategy,
    distractorStrategies: commonDistractors,
    difficultyTuning: {
      easy: [
        "low arithmetic friction and direct topology exposure",
      ],
      medium: [
        "one hidden relation or one state transition",
      ],
      hard: [
        "multi-stage or cyclic inference with concealed intermediate state",
      ],
    },
    validationRules: [
      "prefer LCM-friendly or mentally computable families",
    ],
    diversityTags: [id],
    rotationGroup,
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.72,
    },
    examWeights: {
      ssc: 1.15,
      ibps: 1.05,
    },
  });
}

const canonicalTimeWorkMotifs: QuantMotif[] = [
  defineCanonicalTimeWorkMotif(
    "tw-basic-2-sum",
    "quant-time-work-core",
    [1, 3],
    [
      "two-worker reciprocal rate addition with LCM-backed total work",
    ],
    ["Linear_Sum", "Reciprocal_Error"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-basic-3-sum",
    "quant-time-work-core",
    [2, 4],
    [
      "three-worker reciprocal aggregation with clean LCM work units",
    ],
    ["Linear_Sum", "wrongLCMAggregation"],
    ["Medium", "Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-component-extract",
    "quant-time-work-core",
    [2, 4],
    [
      "subtract a known individual rate from a combined rate",
    ],
    ["Residual_Work_Trap", "Reciprocal_Error"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-eff-integer",
    "quant-time-work-efficiency",
    [2, 4],
    [
      "translate multiplicative efficiency into inverse time before combining rates",
    ],
    ["Efficiency_Flip", "rateTimeSwap"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-eff-pct-boost",
    "quant-time-work-efficiency",
    [2, 5],
    [
      "convert percentage efficiency increase into a rate multiplier",
    ],
    ["Efficiency_Flip", "wrongEfficiencyBase"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-eff-pct-reduce",
    "quant-time-work-efficiency",
    [2, 5],
    [
      "convert percentage efficiency reduction into a slower rate and longer time",
    ],
    ["Efficiency_Flip", "rateTimeSwap"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-comparison-hidden",
    "quant-time-work-efficiency",
    [3, 6],
    [
      "infer the hidden slower time from a verbal time-gap comparison",
    ],
    ["Efficiency_Flip", "Before_Completion_Gap"],
    ["Medium", "Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-stage-join-start",
    "quant-time-work-phases",
    [3, 6],
    [
      "state-transition from solo work to joint work with residual tracking",
    ],
    ["Joiner_Active_Omission", "Denominator_Lag"],
    ["Medium", "Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-stage-leave-start",
    "quant-time-work-phases",
    [3, 6],
    [
      "state-transition from joint work to a single finisher",
    ],
    ["Residual_Work_Trap", "Denominator_Lag"],
    ["Medium", "Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-stage-deadline-exit",
    "quant-time-work-phases",
    [4, 7],
    [
      "build an equation in total time using leave-before-completion logic",
    ],
    ["Before_Completion_Gap", "Residual_Work_Trap"],
    ["Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-stage-asymmetric-3",
    "quant-time-work-phases",
    [4, 8],
    [
      "track three agents through multiple exits against a fixed total work constant",
    ],
    ["Before_Completion_Gap", "Joiner_Active_Omission"],
    ["Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-stage-handoff",
    "quant-time-work-phases",
    [2, 5],
    [
      "solve a fractional handoff by separating completed and remaining work",
    ],
    ["Target_Scope_Error", "Residual_Work_Trap"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-stage-staggered-join",
    "quant-time-work-phases",
    [4, 7],
    [
      "track staggered entries through multiple WorkSnapshot phases",
    ],
    ["Joiner_Active_Omission", "Denominator_Lag"],
    ["Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-cycle-alternate-2",
    "quant-time-work-cycles",
    [3, 6],
    [
      "sum a repeated two-day cycle and resolve the final partial day",
    ],
    ["Cycle_Boundary_Floor", "Goal_Overshoot"],
    ["Medium", "Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-cycle-alternate-3",
    "quant-time-work-cycles",
    [4, 7],
    [
      "sum a repeated three-day cycle and resolve the first-touch completion point",
    ],
    ["Cycle_Boundary_Floor", "Goal_Overshoot"],
    ["Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-cycle-assist-single",
    "quant-time-work-cycles",
    [4, 7],
    [
      "model a daily worker with one assistant on every kth day",
    ],
    ["Cycle_Boundary_Floor", "Joiner_Active_Omission"],
    ["Medium", "Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-cycle-assist-group",
    "quant-time-work-cycles",
    [4, 8],
    [
      "model a daily worker with a grouped assistance event every kth day",
    ],
    ["Cycle_Boundary_Floor", "Joiner_Active_Omission"],
    ["Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-cycle-helper-toggle",
    "quant-time-work-cycles",
    [4, 8],
    [
      "alternate helper identities across odd-even cycle states",
    ],
    ["Asymmetric_Start_Swap", "Cycle_Boundary_Floor"],
    ["Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-group-mdh-standard",
    "quant-time-work-bridge",
    [2, 5],
    [
      "preserve the men-days-hours-per-work invariant across transformed scenarios",
    ],
    ["wrongDenominator", "wrongIntermediateValue"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-group-equivalence-or",
    "quant-time-work-equivalence",
    [3, 5],
    [
      "bridge heterogeneous groups through equal-work equal-time equivalence",
    ],
    ["Ratio_Bridge_Inversion", "weightedEntityConfusion"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-group-system-and",
    "quant-time-work-equivalence",
    [4, 7],
    [
      "solve mixed-group linear equations to recover individual contribution rates",
    ],
    ["Ratio_Bridge_Inversion", "pairwiseSystemMisresolution"],
    ["Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-contractor-pressure",
    "quant-time-work-bridge",
    [4, 7],
    [
      "recover extra manpower from elapsed time and partial completion against a deadline",
    ],
    ["Residual_Work_Trap", "Denominator_Lag"],
    ["Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-wage-efficiency",
    "quant-time-work-wages",
    [2, 5],
    [
      "share wages in proportion to contribution where time worked is equal",
    ],
    ["Wage_Time_Fallacy", "wrongEfficiencyBase"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-wage-work-done",
    "quant-time-work-wages",
    [3, 6],
    [
      "share wages in proportion to rate multiplied by days worked",
    ],
    ["Wage_Partial_Basis", "weightedEntityConfusion"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-pipe-fill-leak",
    "quant-time-work-pipes",
    [2, 5],
    [
      "compute net fill rate as inlet minus leak with sign-aware reasoning",
    ],
    ["Sign_Inversion", "Linear_Sum"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-pipe-clock-sync",
    "quant-time-work-pipes",
    [4, 7],
    [
      "track staggered pipe activation and return a clock time rather than a duration only",
    ],
    ["Clock_Duration_Slip", "Joiner_Active_Omission"],
    ["Medium", "Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-pipe-threshold",
    "quant-time-work-pipes",
    [4, 8],
    [
      "activate an outlet only after a threshold volume is reached",
    ],
    ["Midpoint_Neglect", "Sign_Inversion"],
    ["Hard"],
  ),
  defineCanonicalTimeWorkMotif(
    "tw-regressive-climb",
    "quant-time-work-pipes",
    [3, 6],
    [
      "solve first-touch completion under build-slip regression rather than flat net-rate division",
    ],
    ["Goal_Overshoot", "Regression_Net_Flat"],
  ),
];

const legacyTimeWorkMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "efficiency-percentage",
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
        "wrongEfficiencyBase",
        "rateTimeSwap",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "convert percentage efficiency differences into inverse time ratios before aggregating work",
      ],
      distractorStrategies: [
        "multiply time instead of dividing for higher efficiency",
      ],
      difficultyTuning: {
        easy: ["single efficiency percentage conversion"],
        medium: ["efficiency plus combined work"],
        hard: ["efficiency hidden behind comparative time gap"],
      },
      validationRules: [
        "prefer clean 25%, 50%, and 20% style efficiency shifts",
      ],
      diversityTags: [
        "efficiency-percentage",
      ],
      rotationGroup:
        "quant-time-work-efficiency",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.15,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "efficiency-numerical",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "conditional-ratio-logic",
        "simple-ratio",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "rateTimeSwap",
        "wrongEfficiencyBase",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "translate multiplicative efficiency into inverse time before solving",
      ],
      distractorStrategies: [
        "keep time in the same ratio as efficiency",
      ],
      difficultyTuning: {
        easy: ["2x or 3x efficiency relation"],
        medium: ["combined rate after conversion"],
      },
      validationRules: [
        "use clean integer efficiency multipliers",
      ],
      diversityTags: [
        "efficiency-multiple",
      ],
      rotationGroup:
        "quant-time-work-efficiency",
      wordingBias: {
        concise: 0.8,
      },
      examWeights: {
        ssc: 1.1,
      },
    }),
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
      id: "stage-leave-start",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "partial-progress-tracking",
        "phase-transition",
      ],
      preferredOperations: [
        "transform",
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
        "multiple workers start together and one leaves after a fixed initial phase",
      ],
      distractorStrategies: [
        "ignore first-phase work before leaving",
      ],
      difficultyTuning: {
        medium: ["single leave event after a known start"],
        hard: ["leave event plus hidden total time"],
      },
      validationRules: [
        "ensure leaving happens before completion",
      ],
      diversityTags: [
        "leave-after-start",
      ],
      rotationGroup:
        "quant-time-work-phases",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.15,
      },
    }),
    defineQuantMotif({
      id: "stage-leave-end",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "partial-progress-tracking",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "incorrectResidualAllocation",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [4, 7],
      supportedDifficultyBands: [
        "Hard",
      ],
      generationStrategy: [
        "one worker leaves a fixed number of days before completion, forcing an equation in total time",
      ],
      distractorStrategies: [
        "subtract the leave gap from the start instead of the end state",
      ],
      difficultyTuning: {
        hard: ["unknown total time with a leave-before-completion condition"],
      },
      validationRules: [
        "ensure the pre-leave work stays below total work",
      ],
      diversityTags: [
        "leave-before-end",
      ],
      rotationGroup:
        "quant-time-work-phases",
      wordingBias: {
        inferenceHeavy: 0.85,
      },
      examWeights: {
        ssc: 1.0,
        ibps: 1.2,
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
      id: "cyclic-assisted",
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
        "cumulativeMistake",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [4, 8],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "one worker works daily while others assist on periodic days only",
      ],
      distractorStrategies: [
        "assume uniform daily contribution instead of periodic contribution",
      ],
      difficultyTuning: {
        medium: ["3-day assistance cycle"],
        hard: ["longer cycle with partial terminal day"],
      },
      validationRules: [
        "keep cycle contribution and remainder mentally trackable",
      ],
      diversityTags: [
        "periodic-assistance",
      ],
      rotationGroup:
        "quant-time-work-cycles",
      wordingBias: {
        inferenceHeavy: 0.8,
      },
      examWeights: {
        ibps: 1.2,
      },
    }),
    defineQuantMotif({
      id: "chain-rule-mdh",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
        "conditional-ratio-logic",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "wrongIntermediateValue",
        "wrongDenominator",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "preserve constant man-day-hour-per-work relation across scenarios",
      ],
      distractorStrategies: [
        "scale only one variable and ignore the others",
      ],
      difficultyTuning: {
        medium: ["4-variable man-day-hour relation"],
        hard: ["hidden target variable with multiple changing dimensions"],
      },
      validationRules: [
        "prefer integral outputs after scaling",
      ],
      diversityTags: [
        "man-day-hour",
      ],
      rotationGroup:
        "quant-time-work-bridge",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.15,
      },
    }),
    defineQuantMotif({
      id: "group-bridge-or",
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
      reasoningDepthRange: [3, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "bridge men and women or workers and machines through an OR equivalence relation",
      ],
      distractorStrategies: [
        "treat the bridge counts as direct worker totals",
      ],
      difficultyTuning: {
        medium: ["single M:W bridge"],
        hard: ["bridge plus total-work target"],
      },
      validationRules: [
        "ensure bridge relation reduces cleanly",
      ],
      diversityTags: [
        "group-bridge-or",
      ],
      rotationGroup:
        "quant-time-work-equivalence",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "group-bridge-and",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "weighted-equivalence",
        "linear-substitution",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "weightedEntityConfusion",
        "pairwiseSystemMisresolution",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [4, 7],
      supportedDifficultyBands: [
        "Hard",
      ],
      generationStrategy: [
        "solve mixed-group equations like 2M + 3W through two linear constraints",
      ],
      distractorStrategies: [
        "equate unequal mixed-group contributions directly",
      ],
      difficultyTuning: {
        hard: ["two linear equations in heterogeneous rates"],
      },
      validationRules: [
        "ensure system has a clean non-ambiguous solution",
      ],
      diversityTags: [
        "group-bridge-and",
      ],
      rotationGroup:
        "quant-time-work-equivalence",
      wordingBias: {
        inferenceHeavy: 0.8,
      },
      examWeights: {
        ssc: 1.0,
        ibps: 1.15,
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
      id: "wage-efficiency",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "weighted-equivalence",
        "proportional-allocation",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "wrongEfficiencyBase",
        "comparisonTrap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "allocate wages in proportion to work-rate contribution",
      ],
      distractorStrategies: [
        "divide wages equally or in proportion to time alone",
      ],
      difficultyTuning: {
        medium: ["same working duration"],
        hard: ["different productivity plus hidden contribution share"],
      },
      validationRules: [
        "keep wage shares integral or clean fractions",
      ],
      diversityTags: [
        "wage-efficiency",
      ],
      rotationGroup:
        "quant-time-work-wages",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.1,
      },
    }),
    defineQuantMotif({
      id: "wage-days-worked",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "weighted-equivalence",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "weightedEntityConfusion",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "allocate wages in proportion to rate multiplied by days worked",
      ],
      distractorStrategies: [
        "ignore the difference in work durations",
      ],
      difficultyTuning: {
        medium: ["two workers with unequal days"],
        hard: ["three workers or hidden contribution share"],
      },
      validationRules: [
        "keep rate-day products clean",
      ],
      diversityTags: [
        "wage-days",
      ],
      rotationGroup:
        "quant-time-work-wages",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.05,
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
      id: "pipe-filling-leak",
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
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "pipes fill while a leak empties, so net rate must be computed by subtraction",
      ],
      distractorStrategies: [
        "add leak rate to filling rate",
      ],
      difficultyTuning: {
        easy: ["single inlet with one leak"],
        medium: ["two inlets and one leak"],
        hard: ["leak starts after delay or hidden leak rate"],
      },
      validationRules: [
        "avoid impossible net-negative fill cases unless explicitly intended",
      ],
      diversityTags: [
        "pipe-leak",
      ],
      rotationGroup:
        "quant-time-work-pipes",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.15,
      },
    }),
    defineQuantMotif({
      id: "pipe-sequential",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "phase-transition",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "partialWorkOmission",
        "cumulativeMistake",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [4, 7],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "open pipes at staggered intervals and track each phase separately",
      ],
      distractorStrategies: [
        "assume all pipes operate from the start",
      ],
      difficultyTuning: {
        medium: ["three pipes with 1-hour interval"],
        hard: ["staggered start plus leak or outlet"],
      },
      validationRules: [
        "ensure staggered phases produce meaningful partial states",
      ],
      diversityTags: [
        "pipe-sequential",
      ],
      rotationGroup:
        "quant-time-work-pipes",
      wordingBias: {
        inferenceHeavy: 0.8,
      },
      examWeights: {
        ssc: 1.0,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "pipe-capacity-volume",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "direct-rate-aggregation",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "wrongIntermediateValue",
        "rateTimeSwap",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "convert fill rate and time into actual tank capacity or volume",
      ],
      distractorStrategies: [
        "treat time as capacity directly without using rate",
      ],
      difficultyTuning: {
        easy: ["single pipe capacity"],
        medium: ["combined pipes with volume target"],
      },
      validationRules: [
        "prefer realistic liters and minutes",
      ],
      diversityTags: [
        "pipe-capacity",
      ],
      rotationGroup:
        "quant-time-work-pipes",
      wordingBias: {
        concise: 0.75,
      },
      examWeights: {
        ssc: 1.05,
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
      id: "work-variable-rate",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "phase-transition",
        "conditional-ratio-logic",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "wrongIntermediateValue",
        "cumulativeMistake",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "change a worker's rate mid-scenario and track state by phases",
      ],
      distractorStrategies: [
        "apply the new rate to the whole timeline",
      ],
      difficultyTuning: {
        medium: ["single rate change"],
        hard: ["multiple phases with rate multiplication"],
      },
      validationRules: [
        "keep changed-rate phases clearly separable",
      ],
      diversityTags: [
        "variable-rate",
      ],
      rotationGroup:
        "quant-time-work-phases",
      wordingBias: {
        balanced: 0.7,
      },
      examWeights: {
        ssc: 1.05,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "work-partial-target",
      topicCluster: "time-work",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
        "simple-ratio",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "wrongIntermediateValue",
        "incorrectResidualAllocation",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "solve for a target fraction of work such as 60% or 3/4 instead of full completion",
      ],
      distractorStrategies: [
        "solve for full work and forget the target fraction",
      ],
      difficultyTuning: {
        easy: ["single target fraction"],
        medium: ["target fraction after one phase transition"],
      },
      validationRules: [
        "prefer clean target fractions",
      ],
      diversityTags: [
        "partial-target",
      ],
      rotationGroup:
        "quant-time-work-core",
      wordingBias: {
        concise: 0.75,
      },
      examWeights: {
        ssc: 1.1,
      },
    }),
    defineQuantMotif({
      id: "negative-work-destroy",
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
        "wrongIntermediateValue",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "model building and breaking or filling and emptying as signed work rates",
      ],
      distractorStrategies: [
        "forget the destructive sign",
      ],
      difficultyTuning: {
        medium: ["one builder and one destroyer"],
        hard: ["multiple positive and negative contributors"],
      },
      validationRules: [
        "keep final net rate meaningful and non-ambiguous",
      ],
      diversityTags: [
        "negative-work",
      ],
      rotationGroup:
        "quant-time-work-net-rate",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.05,
      },
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

void legacyTimeWorkMotifs;

export const timeWorkMotifs: QuantMotif[] =
  canonicalTimeWorkMotifs;
