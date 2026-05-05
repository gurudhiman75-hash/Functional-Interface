import {
  defineQuantMotif,
  type QuantMotif,
} from "./types";

export const practicalQuantMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "hidden-base-shift",
      topicCluster: "percentage",
      archetype: "reverse-percentage",
      reasoningCategories: [
        "hidden-base-inference",
        "reverse-percentage",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "wrongDenominator",
        "baseSwapTrap",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "hide the original base value behind a later comparison",
        "force reverse-percentage reconstruction before final arithmetic",
      ],
      parameterRanges: {
        percentageChange: {
          min: 8,
          max: 45,
        },
        baseValue: {
          min: 80,
          max: 480,
        },
      },
      distractorStrategies: [
        "use changed-base denominator",
        "ignore reverse step",
      ],
      difficultyTuning: {
        easy: [
          "single reverse step",
        ],
        medium: [
          "combine reverse step with comparison",
        ],
        hard: [
          "chain two hidden-base inferences",
        ],
      },
      validationRules: [
        "avoid symmetric percentage pairs",
        "require non-trivial reverse calculation",
      ],
      diversityTags: [
        "percent-base-shift",
        "reverse-reconstruction",
      ],
      rotationGroup:
        "quant-percentage-core",
      wordingBias: {
        balanced: 0.8,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.2,
        sbi: 1.1,
      },
    }),
    defineQuantMotif({
      id: "reverse-percentage-bridge",
      topicCluster: "percentage",
      archetype: "reverse-percentage",
      reasoningCategories: [
        "reverse-percentage",
        "chained-percentage-ratio",
      ],
      preferredOperations: [
        "reverse",
        "transform",
        "aggregate",
      ],
      commonDistractors: [
        "netChangeConfusion",
        "partialAggregation",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "bridge two related percentage statements through one unknown",
        "ask for the original value or missing component",
      ],
      parameterRanges: {
        percentA: {
          min: 10,
          max: 35,
        },
        percentB: {
          min: 5,
          max: 25,
        },
      },
      distractorStrategies: [
        "treat successive changes as additive",
        "drop one bridge condition",
      ],
      difficultyTuning: {
        medium: [
          "one linked bridge",
        ],
        hard: [
          "two-stage bridge with hidden total",
        ],
      },
      validationRules: [
        "ensure integral final answer",
      ],
      diversityTags: [
        "successive-change",
        "linked-percent",
      ],
      rotationGroup:
        "quant-percentage-core",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.75,
      },
      examWeights: {
        ibps: 1.15,
        sbi: 1.2,
      },
    }),
    defineQuantMotif({
      id: "ratio-normalization-switch",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "normalization",
        "cross-comparison",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "aggregate",
      ],
      commonDistractors: [
        "directComparison",
        "wrongNormalization",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      generationStrategy: [
        "present ratios on different totals",
        "force common-base normalization before comparison",
      ],
      parameterRanges: {
        ratioPart: {
          min: 2,
          max: 11,
        },
        totalValue: {
          min: 60,
          max: 360,
        },
      },
      distractorStrategies: [
        "compare raw ratio parts",
        "normalize only one side",
      ],
      difficultyTuning: {
        easy: [
          "single normalization",
        ],
        medium: [
          "normalization plus transfer",
        ],
        hard: [
          "hidden total after normalization",
        ],
      },
      validationRules: [
        "keep ratios reducible but non-trivial",
      ],
      diversityTags: [
        "ratio-normalization",
      ],
      rotationGroup:
        "quant-ratio-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        rrb: 1.1,
      },
    }),
    defineQuantMotif({
      id: "partnership-ratio-switch",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "ratio-adjustment",
        "conditional-selection",
      ],
      preferredOperations: [
        "transform",
        "infer",
        "filter",
      ],
      commonDistractors: [
        "timeIgnored",
        "ratioInversion",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "change one ratio driver mid-problem",
        "force part-time or weighted contribution reasoning",
      ],
      parameterRanges: {
        contributionMonths: {
          min: 3,
          max: 12,
        },
      },
      distractorStrategies: [
        "ignore timing switch",
        "apply final ratio throughout",
      ],
      difficultyTuning: {
        medium: [
          "one partner joins late",
        ],
        hard: [
          "join-and-leave contribution mix",
        ],
      },
      validationRules: [
        "ensure contribution shares remain integral",
      ],
      diversityTags: [
        "ratio-time-weight",
      ],
      rotationGroup:
        "quant-ratio-core",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ibps: 1.2,
        sbi: 1.15,
      },
    }),
    defineQuantMotif({
      id: "weighted-average-confusion",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "average-transformation",
        "comparison-chain",
      ],
      preferredOperations: [
        "aggregate",
        "compare",
        "transform",
      ],
      commonDistractors: [
        "simpleMeanTrap",
        "wrongGroupSize",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      generationStrategy: [
        "split data into unequal groups",
        "force weighted average instead of direct mean",
      ],
      parameterRanges: {
        groupA: {
          min: 3,
          max: 10,
        },
        groupB: {
          min: 2,
          max: 8,
        },
      },
      distractorStrategies: [
        "take simple mean of subgroup averages",
        "swap subgroup sizes",
      ],
      difficultyTuning: {
        easy: [
          "two groups only",
        ],
        medium: [
          "weighted merge with missing total",
        ],
        hard: [
          "replacement or removal after weighted merge",
        ],
      },
      validationRules: [
        "avoid equal group sizes for weighted motifs",
      ],
      diversityTags: [
        "weighted-average",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.2,
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
      generationStrategy: [
        "replace one or more observations",
        "solve through average delta and count",
      ],
      parameterRanges: {
        itemCount: {
          min: 4,
          max: 15,
        },
      },
      distractorStrategies: [
        "apply change to one value instead of total",
        "forget multiplication by count",
      ],
      difficultyTuning: {
        medium: [
          "single replacement",
        ],
        hard: [
          "multiple replacements with missing original",
        ],
      },
      validationRules: [
        "keep average shifts integer-friendly",
      ],
      diversityTags: [
        "average-replacement",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "discount-profit-link",
      topicCluster: "profit-loss",
      archetype: "general",
      reasoningCategories: [
        "comparative-conditional-inference",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "sameBaseAssumption",
        "marginDiscountMixup",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "link marked price, discount, and profit through one unknown cost price",
      ],
      parameterRanges: {
        discountPercent: {
          min: 5,
          max: 35,
        },
        profitPercent: {
          min: 8,
          max: 40,
        },
      },
      distractorStrategies: [
        "take profit percent on marked price",
        "subtract discount directly from profit",
      ],
      difficultyTuning: {
        easy: [
          "single discount-profit relation",
        ],
        medium: [
          "marked price backsolve",
        ],
        hard: [
          "successive discount before profit target",
        ],
      },
      validationRules: [
        "keep cost price positive and integral",
      ],
      diversityTags: [
        "marked-price-bridge",
      ],
      rotationGroup:
        "quant-profit-loss-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.15,
      },
    }),
    defineQuantMotif({
      id: "successive-discount-margin",
      topicCluster: "profit-loss",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "aggregate",
        "transform",
        "compare",
      ],
      commonDistractors: [
        "additiveDiscountError",
        "wrongFinalBase",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "use two discounts or discount-plus-rebate",
        "ask effective profit, loss, or marked price",
      ],
      parameterRanges: {
        discountOne: {
          min: 5,
          max: 25,
        },
        discountTwo: {
          min: 5,
          max: 20,
        },
      },
      distractorStrategies: [
        "add discounts directly",
        "take net change from cost price",
      ],
      difficultyTuning: {
        medium: [
          "two successive discounts",
        ],
        hard: [
          "discount chain with target margin",
        ],
      },
      validationRules: [
        "avoid identical discount percentages",
      ],
      diversityTags: [
        "successive-discount",
      ],
      rotationGroup:
        "quant-profit-loss-core",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.65,
      },
      examWeights: {
        ibps: 1.2,
        sbi: 1.15,
      },
    }),
    defineQuantMotif({
      id: "compounding-trap",
      topicCluster: "si-ci",
      archetype: "general",
      reasoningCategories: [
        "compound-change",
        "nested-operations",
      ],
      preferredOperations: [
        "aggregate",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "simpleInterestSubstitution",
        "wrongPeriodRate",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "compare SI and CI or compare different compounding schedules",
      ],
      parameterRanges: {
        rate: {
          min: 4,
          max: 18,
        },
        years: {
          min: 2,
          max: 4,
        },
      },
      distractorStrategies: [
        "apply simple interest formula to CI",
        "forget compounding frequency change",
      ],
      difficultyTuning: {
        medium: [
          "two-year SI-CI difference",
        ],
        hard: [
          "quarterly or half-yearly compounding",
        ],
      },
      validationRules: [
        "keep resulting interest values manageable",
      ],
      diversityTags: [
        "si-ci-contrast",
      ],
      rotationGroup:
        "quant-interest-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.0,
        ibps: 1.2,
        sbi: 1.25,
      },
    }),
    defineQuantMotif({
      id: "interest-difference-backsolve",
      topicCluster: "si-ci",
      archetype: "general",
      reasoningCategories: [
        "hidden-base-inference",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "reverse",
        "transform",
        "compare",
      ],
      commonDistractors: [
        "principalSlip",
        "rateTimeSwap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 5],
      generationStrategy: [
        "provide interest difference and one auxiliary condition",
        "backsolve principal or rate",
      ],
      parameterRanges: {
        principal: {
          min: 500,
          max: 5000,
        },
      },
      distractorStrategies: [
        "treat difference as annual interest",
        "swap rate and time variables",
      ],
      difficultyTuning: {
        medium: [
          "solve principal from one difference",
        ],
        hard: [
          "solve rate with compound frequency change",
        ],
      },
      validationRules: [
        "ensure unique principal-rate combination",
      ],
      diversityTags: [
        "interest-backsolve",
      ],
      rotationGroup:
        "quant-interest-core",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ibps: 1.15,
        sbi: 1.2,
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
      generationStrategy: [
        "substitute workers or machines with equivalent efficiency ratios",
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
        ],
        medium: [
          "team replacement",
        ],
        hard: [
          "partial work before substitution",
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
      generationStrategy: [
        "hide the inverse time-rate relationship behind productivity comparisons",
      ],
      parameterRanges: {
        dayCount: {
          min: 4,
          max: 24,
        },
      },
      distractorStrategies: [
        "use direct proportion instead of inverse proportion",
      ],
      difficultyTuning: {
        medium: [
          "one inverse relation",
        ],
        hard: [
          "inverse relation plus join/leave event",
        ],
      },
      validationRules: [
        "ensure final work fraction is clean",
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
    defineQuantMotif({
      id: "relative-speed-meet",
      topicCluster:
        "speed-time-distance",
      archetype: "general",
      reasoningCategories: [
        "comparison-chain",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "compare",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "sameDirectionTrap",
        "unitMismatch",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 5],
      generationStrategy: [
        "build meet-or-overtake scenarios around relative speed",
      ],
      parameterRanges: {
        speedA: {
          min: 18,
          max: 90,
        },
        speedB: {
          min: 12,
          max: 80,
        },
      },
      distractorStrategies: [
        "add speeds when subtraction is needed",
        "ignore unit conversion",
      ],
      difficultyTuning: {
        easy: [
          "same-direction catch-up",
        ],
        medium: [
          "opposite-direction meet",
        ],
        hard: [
          "delay plus relative speed",
        ],
      },
      validationRules: [
        "convert to one unit system internally",
      ],
      diversityTags: [
        "relative-speed",
      ],
      rotationGroup:
        "quant-std-core",
      wordingBias: {
        concise: 0.5,
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "train-platform-offset",
      topicCluster:
        "speed-time-distance",
      archetype: "general",
      reasoningCategories: [
        "hidden-base-inference",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "compare",
      ],
      commonDistractors: [
        "lengthIgnored",
        "secondsHoursConfusion",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      generationStrategy: [
        "link passing time with train and platform length",
      ],
      parameterRanges: {
        trainLength: {
          min: 90,
          max: 360,
        },
        platformLength: {
          min: 60,
          max: 300,
        },
      },
      distractorStrategies: [
        "use only platform length",
        "forget to add train length",
      ],
      difficultyTuning: {
        medium: [
          "single platform crossing",
        ],
        hard: [
          "two crossings with changed speed",
        ],
      },
      validationRules: [
        "keep speed-time conversion clean",
      ],
      diversityTags: [
        "train-passing",
      ],
      rotationGroup:
        "quant-std-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        rrb: 1.1,
      },
    }),
    defineQuantMotif({
      id: "weighted-mixture-shift",
      topicCluster:
        "mixture-alligation",
      archetype: "general",
      reasoningCategories: [
        "ratio-conversion",
        "comparative-conditional-inference",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "wrongBaseVolume",
        "straightAverageTrap",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "mix two concentrations and shift one component after blending",
      ],
      parameterRanges: {
        concentrationA: {
          min: 10,
          max: 60,
        },
        concentrationB: {
          min: 5,
          max: 45,
        },
      },
      distractorStrategies: [
        "take direct average of concentrations",
        "ignore replacement after mixing",
      ],
      difficultyTuning: {
        medium: [
          "single alligation step",
        ],
        hard: [
          "alligation plus replacement",
        ],
      },
      validationRules: [
        "ensure concentration remains bounded",
      ],
      diversityTags: [
        "alligation-core",
      ],
      rotationGroup:
        "quant-mixture-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ibps: 1.15,
        sbi: 1.15,
      },
    }),
    defineQuantMotif({
      id: "replacement-alligation",
      topicCluster:
        "mixture-alligation",
      archetype: "general",
      reasoningCategories: [
        "conditional-ratio-logic",
      ],
      preferredOperations: [
        "filter",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "netVolumeIgnored",
        "wrongReplacementRatio",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "remove-and-replace equal quantity to reach target concentration",
      ],
      parameterRanges: {
        containerVolume: {
          min: 20,
          max: 120,
        },
      },
      distractorStrategies: [
        "adjust concentration without removal",
        "use wrong repeated replacement formula",
      ],
      difficultyTuning: {
        medium: [
          "single replacement",
        ],
        hard: [
          "repeated replacement",
        ],
      },
      validationRules: [
        "avoid degenerate 0% or 100% concentrations",
      ],
      diversityTags: [
        "replacement-mixture",
      ],
      rotationGroup:
        "quant-mixture-core",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ssc: 1.0,
        ibps: 1.2,
      },
    }),
    defineQuantMotif({
      id: "equation-balance-shift",
      topicCluster:
        "algebra-basics",
      archetype: "general",
      reasoningCategories: [
        "one-step-arithmetic",
        "hidden-base-inference",
      ],
      preferredOperations: [
        "transform",
        "reverse",
        "compare",
      ],
      commonDistractors: [
        "signError",
        "wrongTransposition",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [2, 4],
      generationStrategy: [
        "embed one linear relation inside another comparison or condition",
      ],
      parameterRanges: {
        coefficient: {
          min: 2,
          max: 12,
        },
      },
      distractorStrategies: [
        "flip sign while transposing",
        "divide before simplification",
      ],
      difficultyTuning: {
        easy: [
          "one linear equation",
        ],
        medium: [
          "equation plus condition",
        ],
        hard: [
          "two variables with elimination hint",
        ],
      },
      validationRules: [
        "ensure unique solution",
      ],
      diversityTags: [
        "algebra-linear",
      ],
      rotationGroup:
        "quant-algebra-core",
      wordingBias: {
        concise: 0.6,
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.1,
        cat: 0.9,
      },
    }),
    defineQuantMotif({
      id: "variable-elimination",
      topicCluster:
        "algebra-basics",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
        "comparison-chain",
      ],
      preferredOperations: [
        "aggregate",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "coefficientMismatch",
        "substitutionSlip",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 5],
      generationStrategy: [
        "solve paired equations through elimination or substitution",
      ],
      parameterRanges: {
        constant: {
          min: 6,
          max: 80,
        },
      },
      distractorStrategies: [
        "equate wrong coefficients",
        "substitute partial expression only",
      ],
      difficultyTuning: {
        medium: [
          "two-variable elimination",
        ],
        hard: [
          "parameterized elimination with one hidden relation",
        ],
      },
      validationRules: [
        "avoid dependent systems",
      ],
      diversityTags: [
        "algebra-elimination",
      ],
      rotationGroup:
        "quant-algebra-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        cat: 1.1,
        ssc: 1.0,
      },
    }),
    defineQuantMotif({
      id: "dimension-scale-effect",
      topicCluster: "mensuration",
      archetype: "general",
      reasoningCategories: [
        "comparative-conditional-inference",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "linearAreaMixup",
        "areaVolumeMixup",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      generationStrategy: [
        "change one dimension and ask area or volume effect",
      ],
      parameterRanges: {
        scaleFactor: {
          min: 2,
          max: 5,
        },
      },
      distractorStrategies: [
        "apply linear factor to area or volume",
        "square when cube is needed",
      ],
      difficultyTuning: {
        easy: [
          "single-dimension area change",
        ],
        medium: [
          "multi-dimension scale change",
        ],
        hard: [
          "reverse scale inference from area or volume",
        ],
      },
      validationRules: [
        "keep geometry primitive recognizable",
      ],
      diversityTags: [
        "mensuration-scaling",
      ],
      rotationGroup:
        "quant-mensuration-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.15,
        rrb: 1.05,
      },
    }),
    defineQuantMotif({
      id: "composite-shape-breakdown",
      topicCluster: "mensuration",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "aggregate",
        "transform",
        "compare",
      ],
      commonDistractors: [
        "missedSubshape",
        "perimeterAreaSwap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "decompose a composite shape into standard pieces before solving",
      ],
      parameterRanges: {
        sideLength: {
          min: 4,
          max: 30,
        },
      },
      distractorStrategies: [
        "drop one component shape",
        "use area formula for perimeter target",
      ],
      difficultyTuning: {
        medium: [
          "two-piece breakdown",
        ],
        hard: [
          "surface or volume composite breakdown",
        ],
      },
      validationRules: [
        "avoid ambiguous composite geometry",
      ],
      diversityTags: [
        "mensuration-composite",
      ],
      rotationGroup:
        "quant-mensuration-core",
      wordingBias: {
        balanced: 0.75,
        inferenceHeavy: 0.65,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.0,
      },
    }),
  ];
