import { QuantMotif } from "./types";

export const inequalityMotifs: QuantMotif[] = [
  {
    id: "direct_inequality_reading",
    topicCluster: "inequality",
    reasoningCategories: [
      "direct-inequalities",
      "basic-symbol-interpretation",
    ],
    preferredOperations: [
      "compare",
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue",
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 2],
    wordingBias: {
      concise: 0.8,
      balanced: 0.5,
    },
    examWeights: {
      ssc: 1.3,
      rrb: 1.2,
      ibps: 1,
    },
  },
  {
    id: "single_chain_deduction",
    topicCluster: "inequality",
    reasoningCategories: [
      "single-inference-chains",
      "basic-symbol-interpretation",
    ],
    preferredOperations: [
      "compare",
      "infer",
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 3],
    wordingBias: {
      concise: 0.7,
      balanced: 0.7,
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1.1,
      sbi: 1,
    },
  },
  {
    id: "compound_inequality_linking",
    topicCluster: "inequality",
    reasoningCategories: [
      "compound-inequalities",
      "multi-statement-comparison",
    ],
    preferredOperations: [
      "compare",
      "aggregate",
      "infer",
    ],
    commonDistractors: [
      "comparisonTrap",
      "cumulativeMistake",
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 4],
    wordingBias: {
      balanced: 0.8,
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      ssc: 0.9,
    },
  },
  {
    id: "indirect_conclusion_validation",
    topicCluster: "inequality",
    reasoningCategories: [
      "indirect-conclusions",
      "multi-statement-comparison",
    ],
    preferredOperations: [
      "infer",
      "compare",
      "transform",
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap",
      "skippedCondition",
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.4,
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.1,
      cat: 0.9,
    },
  },
  {
    id: "uncertain_branch_comparison",
    topicCluster: "inequality",
    reasoningCategories: [
      "uncertain-conclusions",
      "conditional-inequality-logic",
    ],
    preferredOperations: [
      "filter",
      "infer",
      "compare",
    ],
    commonDistractors: [
      "wrongSubsetSelection",
      "comparisonTrap",
      "wrongIntermediateValue",
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      balanced: 0.5,
      inferenceHeavy: 0.8,
    },
    examWeights: {
      cat: 1.4,
      ibps: 1.1,
      sbi: 1,
    },
  },
  {
    id: "nested_symbolic_reasoning",
    topicCluster: "inequality",
    reasoningCategories: [
      "nested-inference-chains",
      "mixed-symbolic-reasoning",
    ],
    preferredOperations: [
      "aggregate",
      "infer",
      "compare",
    ],
    commonDistractors: [
      "cumulativeMistake",
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.9,
    },
    examWeights: {
      cat: 1.5,
      ibps: 1.1,
      sbi: 1.1,
    },
  },
  ...[
    {
      id: "ded-ineq-chain",
      topicCluster: "inequality" as const,
      reasoningCategories: [
        "linear-inequality-chain",
        "transitive-boundary",
      ],
      preferredOperations: [
        "compare",
        "infer",
      ],
      commonDistractors: [
        "OppositeSignTrap",
        "EqualityBoundaryTrap",
      ],
      inferenceStyle: "direct" as const,
      reasoningDepthRange: [1, 4] as [
        number,
        number,
      ],
    },
    {
      id: "ded-ineq-coded",
      topicCluster: "inequality" as const,
      reasoningCategories: [
        "coded-inequality",
        "symbol-decoding",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "OppositeSignTrap",
        "SymbolDecodeError",
      ],
      inferenceStyle: "conditional" as const,
      reasoningDepthRange: [2, 5] as [
        number,
        number,
      ],
    },
    {
      id: "ded-ineq-either",
      topicCluster: "inequality" as const,
      reasoningCategories: [
        "either-or-logic",
        "equality-split",
      ],
      preferredOperations: [
        "compare",
        "infer",
      ],
      commonDistractors: [
        "EitherOrConditionMiss",
        "PossibilityVsDefinite",
      ],
      inferenceStyle: "hidden" as const,
      reasoningDepthRange: [3, 6] as [
        number,
        number,
      ],
    },
    {
      id: "ded-syl-definite",
      topicCluster: "syllogism" as const,
      reasoningCategories: [
        "definite-syllogism",
        "set-inclusion",
      ],
      preferredOperations: [
        "infer",
        "compare",
      ],
      commonDistractors: [
        "ConversionError",
        "PossibilityVsDefinite",
      ],
      inferenceStyle: "conditional" as const,
      reasoningDepthRange: [2, 5] as [
        number,
        number,
      ],
    },
    {
      id: "ded-syl-possibility",
      topicCluster: "syllogism" as const,
      reasoningCategories: [
        "possibility-syllogism",
        "multi-model-check",
      ],
      preferredOperations: [
        "infer",
        "compare",
      ],
      commonDistractors: [
        "PossibilityVsDefinite",
        "ConversionError",
      ],
      inferenceStyle: "hidden" as const,
      reasoningDepthRange: [3, 6] as [
        number,
        number,
      ],
    },
    {
      id: "ded-syl-negative",
      topicCluster: "syllogism" as const,
      reasoningCategories: [
        "negative-syllogism",
        "only-few-logic",
      ],
      preferredOperations: [
        "infer",
        "compare",
      ],
      commonDistractors: [
        "OnlyFewCollapse",
        "ConversionError",
      ],
      inferenceStyle: "hidden" as const,
      reasoningDepthRange: [3, 6] as [
        number,
        number,
      ],
    },
    {
      id: "ded-venn-ident",
      topicCluster: "syllogism" as const,
      reasoningCategories: [
        "logical-venn-identification",
        "set-boundaries",
      ],
      preferredOperations: [
        "compare",
        "infer",
      ],
      commonDistractors: [
        "ConversionError",
        "VennBoundarySwap",
      ],
      inferenceStyle: "direct" as const,
      reasoningDepthRange: [1, 4] as [
        number,
        number,
      ],
    },
    {
      id: "ded-venn-math",
      topicCluster: "syllogism" as const,
      reasoningCategories: [
        "venn-cardinality",
        "inclusion-exclusion",
      ],
      preferredOperations: [
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "VennOverlapOmission",
        "UnionIntersectionSwap",
      ],
      inferenceStyle: "conditional" as const,
      reasoningDepthRange: [2, 5] as [
        number,
        number,
      ],
    },
  ].map((motif) => ({
    compatibleTopics: [
      "inequality",
      "syllogism",
      "engine-boolean",
      "logical-venn",
      "boolean-deductions",
    ],
    compatiblePatternTypes: [
      "logic" as const,
    ],
    supportedReasoningTypes: [
      "symbolic" as const,
      "inferential" as const,
      "multi-step" as const,
      "conditional" as const,
    ],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.7,
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      ssc: 1,
      cat: 1,
    },
    ...motif,
  })),
];
