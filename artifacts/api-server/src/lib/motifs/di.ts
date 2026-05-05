import {
  defineDIMotif,
  type DIMotif,
} from "./types";

export const diMotifs: DIMotif[] = [
  defineDIMotif({
    id: "cross_series_comparison",
    domain: "di",
    visualSubtype: "bar",
    archetype: "visual-comparison",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      reasoningDepthRange: [2, 5],
      inferenceStyle: "direct",
      examWeights: {
        ibps: 1.2,
        sbi: 1.25,
      },
    },
    realizationHints: {
      wordingBias: {
        concise: 0.6,
        balanced: 0.8,
      },
      visualHints: [
        "multi-series comparison",
      ],
      distractorHints: [
        "wrong series read",
        "adjacent bar confusion",
      ],
    },
    generationRules: {
      compatiblePatternTypes: [
        "di",
      ],
      supportedReasoningTypes: [
        "comparative",
        "visual",
      ],
      ruleTags: [
        "cross-series",
        "trend-reading",
      ],
    },
    interpretationModes: [
      "compare categories",
      "identify highest delta",
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue",
    ],
    generationStrategy: [
      "use two or more comparable series with one clean contrast target",
    ],
    distractorStrategies: [
      "adjacent-series confusion",
      "read wrong category row",
    ],
    difficultyTuning: {
      easy: [
        "single direct comparison",
      ],
      medium: [
        "comparison plus percentage or ratio",
      ],
      hard: [
        "multi-series trend comparison",
      ],
    },
    validationRules: [
      "stable legend mapping",
      "no visually identical distractor bars",
    ],
    diversityTags: [
      "bar-compare",
    ],
    rotationGroup: "di-bar-core",
  }),
  defineDIMotif({
    id: "ratio_proportion_table_trap",
    domain: "di",
    visualSubtype: "table",
    archetype: "data-interpretation",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      reasoningDepthRange: [3, 6],
      inferenceStyle: "conditional",
      examWeights: {
        ibps: 1.2,
        sbi: 1.2,
        cat: 1.1,
      },
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.8,
        inferenceHeavy: 0.7,
      },
      visualHints: [
        "ratio extraction from table",
      ],
      distractorHints: [
        "wrong denominator",
        "partial aggregation",
      ],
    },
    generationRules: {
      compatiblePatternTypes: [
        "di",
      ],
      supportedReasoningTypes: [
        "comparative",
        "multi-step",
      ],
      ruleTags: [
        "ratio-proportion",
        "tabular inference",
      ],
    },
    interpretationModes: [
      "derive ratio",
      "normalize totals",
      "compare proportional change",
    ],
    commonDistractors: [
      "wrongDenominator",
      "cumulativeMistake",
    ],
    generationStrategy: [
      "make totals derivable but not explicitly highlighted",
      "reward proportional reading over raw-value reading",
    ],
    distractorStrategies: [
      "wrong denominator",
      "normalize against subset instead of grand total",
    ],
    difficultyTuning: {
      medium: [
        "single ratio derivation",
      ],
      hard: [
        "ratio plus comparative change",
      ],
    },
    validationRules: [
      "preserve coherent units across all columns",
    ],
    diversityTags: [
      "table-ratio",
    ],
    rotationGroup: "di-table-core",
  }),
  defineDIMotif({
    id: "percentage-heavy-calculations",
    domain: "di",
    visualSubtype: "mixed",
    archetype: "data-interpretation",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      reasoningDepthRange: [3, 6],
      inferenceStyle: "conditional",
      examWeights: {
        ibps: 1.25,
        sbi: 1.25,
      },
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.8,
      },
      visualHints: [
        "dataset favors percentages, shares, and comparative change",
      ],
      distractorHints: [
        "percentage-point vs percent confusion",
        "wrong-base ratio trap",
      ],
    },
    generationRules: {
      compatiblePatternTypes: [
        "di",
      ],
      supportedReasoningTypes: [
        "comparative",
        "multi-step",
        "visual",
      ],
      ruleTags: [
        "percentage heavy",
        "mixed-di",
      ],
    },
    interpretationModes: [
      "percentage change",
      "share of total",
      "cross-year comparison",
    ],
    commonDistractors: [
      "percentagePointTrap",
      "wrongDenominator",
    ],
    generationStrategy: [
      "build realistic business or exam-style tables/charts where percentage work dominates",
    ],
    parameterRanges: {
      rowCount: {
        min: 4,
        max: 7,
      },
      valueSpread: "moderate",
    },
    distractorStrategies: [
      "percent-vs-percentage-point confusion",
      "take row share instead of grand-total share",
    ],
    difficultyTuning: {
      medium: [
        "one percentage transformation",
      ],
      hard: [
        "multiple related percentage calculations",
      ],
    },
    validationRules: [
      "use calculation-friendly round numbers",
      "avoid noisy datasets with no interpretation value",
    ],
    diversityTags: [
      "di-percent-heavy",
    ],
    rotationGroup: "di-mixed-core",
  }),
  defineDIMotif({
    id: "approximation-friendly-datasets",
    domain: "di",
    visualSubtype: "table",
    archetype: "data-interpretation",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      reasoningDepthRange: [2, 5],
      inferenceStyle: "direct",
      examWeights: {
        ssc: 1.0,
        ibps: 1.2,
        sbi: 1.2,
      },
    },
    realizationHints: {
      wordingBias: {
        concise: 0.6,
        balanced: 0.8,
      },
      visualHints: [
        "dataset built for fast approximation and elimination",
      ],
      distractorHints: [
        "close numeric options",
        "rounding-direction trap",
      ],
    },
    generationRules: {
      compatiblePatternTypes: [
        "di",
      ],
      supportedReasoningTypes: [
        "comparative",
        "visual",
      ],
      ruleTags: [
        "approximation",
        "table",
      ],
    },
    interpretationModes: [
      "estimate ratio",
      "quick ranking",
      "close-option elimination",
    ],
    commonDistractors: [
      "overPreciseCalculation",
      "roundingDirectionError",
    ],
    generationStrategy: [
      "choose values that support rapid approximation without becoming trivial",
    ],
    parameterRanges: {
      rowCount: {
        min: 4,
        max: 6,
      },
    },
    distractorStrategies: [
      "cluster options around approximate answer",
      "flip rounding direction on one option",
    ],
    difficultyTuning: {
      easy: [
        "single approximation",
      ],
      medium: [
        "approximation plus ranking",
      ],
      hard: [
        "multi-step approximation with close distractors",
      ],
    },
    validationRules: [
      "keep one clearly best option after approximation",
    ],
    diversityTags: [
      "di-approximation",
    ],
    rotationGroup: "di-table-core",
  }),
  defineDIMotif({
    id: "pie-share-normalization",
    domain: "di",
    visualSubtype: "pie",
    archetype: "visual-comparison",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      reasoningDepthRange: [3, 5],
      inferenceStyle: "conditional",
      examWeights: {
        ibps: 1.1,
        sbi: 1.1,
      },
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.8,
      },
      visualHints: [
        "pie chart with linked totals or nested totals",
      ],
      distractorHints: [
        "angle-share confusion",
        "share-of-share trap",
      ],
    },
    generationRules: {
      compatiblePatternTypes: [
        "di",
      ],
      supportedReasoningTypes: [
        "comparative",
        "visual",
        "multi-step",
      ],
      ruleTags: [
        "pie",
        "share normalization",
      ],
    },
    interpretationModes: [
      "convert share to value",
      "compare shares across totals",
    ],
    commonDistractors: [
      "wrongTotalSelection",
      "angleValueSwap",
    ],
    generationStrategy: [
      "force normalization across different total pie values or linked sub-shares",
    ],
    distractorStrategies: [
      "use raw angle instead of converted value",
      "normalize to wrong parent total",
    ],
    difficultyTuning: {
      medium: [
        "single-total pie comparison",
      ],
      hard: [
        "cross-pie normalization",
      ],
    },
    validationRules: [
      "angles must sum cleanly and support at least one meaningful comparison",
    ],
    diversityTags: [
      "di-pie-core",
    ],
    rotationGroup: "di-pie-core",
  }),
  defineDIMotif({
    id: "line-trend-comparison",
    domain: "di",
    visualSubtype: "line",
    archetype: "visual-comparison",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      reasoningDepthRange: [2, 5],
      inferenceStyle: "direct",
      examWeights: {
        ibps: 1.0,
        sbi: 1.15,
      },
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.75,
      },
      visualHints: [
        "trend-focused line graph with one or two series",
      ],
      distractorHints: [
        "adjacent-point confusion",
        "trend vs value trap",
      ],
    },
    generationRules: {
      compatiblePatternTypes: [
        "di",
      ],
      supportedReasoningTypes: [
        "comparative",
        "visual",
      ],
      ruleTags: [
        "line graph",
        "trend reading",
      ],
    },
    interpretationModes: [
      "identify trend",
      "compare rise and fall",
      "find maximum change",
    ],
    commonDistractors: [
      "valueTrendSwap",
      "adjacentPointTrap",
    ],
    generationStrategy: [
      "make line graphs test interpretation of change, not just lookup",
    ],
    distractorStrategies: [
      "confuse highest value with highest increase",
      "swap consecutive intervals",
    ],
    difficultyTuning: {
      easy: [
        "single trend lookup",
      ],
      medium: [
        "trend plus ratio",
      ],
      hard: [
        "multi-series trend comparison",
      ],
    },
    validationRules: [
      "avoid flat lines across all series",
    ],
    diversityTags: [
      "di-line-core",
    ],
    rotationGroup: "di-line-core",
  }),
];
