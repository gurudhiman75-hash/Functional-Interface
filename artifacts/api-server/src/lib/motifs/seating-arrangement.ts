import { QuantMotif } from "./types";

export const seatingArrangementMotifs: QuantMotif[] =
  [
    {
      id: "con-floor-fixed",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "vertical-constraints",
        "floor-puzzle",
      ],
      preferredOperations: [
        "compare",
        "filter",
        "infer",
      ],
      commonDistractors: [
        "SlotNumberInversion",
        "ParityTrap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 5],
      compatibleTopics: [
        "puzzles",
        "floor-puzzle",
        "engine-constraint",
      ],
      compatiblePatternTypes: ["logic"],
      supportedReasoningTypes: [
        "inferential",
        "multi-step",
      ],
      examWeights: {
        ibps: 1.25,
        sbi: 1.2,
      },
    },
    {
      id: "con-floor-gap",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "vertical-constraints",
        "floor-gap",
      ],
      preferredOperations: [
        "filter",
        "infer",
      ],
      commonDistractors: [
        "GapInclusiveTrap",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      compatibleTopics: [
        "puzzles",
        "floor-puzzle",
        "engine-constraint",
      ],
      compatiblePatternTypes: ["logic"],
      supportedReasoningTypes: [
        "inferential",
        "multi-step",
      ],
      examWeights: {
        ibps: 1.25,
        sbi: 1.2,
      },
    },
    {
      id: "con-floor-parity",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "vertical-constraints",
        "floor-parity",
      ],
      preferredOperations: [
        "filter",
        "infer",
      ],
      commonDistractors: [
        "EvenOddFlip",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 5],
      compatibleTopics: [
        "puzzles",
        "floor-puzzle",
        "engine-constraint",
      ],
      compatiblePatternTypes: ["logic"],
      supportedReasoningTypes: [
        "inferential",
        "multi-step",
      ],
    },
    {
      id: "con-box-stack",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "vertical-constraints",
        "box-stack",
      ],
      preferredOperations: [
        "compare",
        "infer",
      ],
      commonDistractors: [
        "AboveBelowFlip",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 5],
      compatibleTopics: [
        "puzzles",
        "box-stack",
        "engine-constraint",
      ],
      compatiblePatternTypes: ["logic"],
      supportedReasoningTypes: [
        "inferential",
        "multi-step",
      ],
    },
    {
      id: "con-sched-sequence",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "scheduling-constraints",
      ],
      preferredOperations: [
        "compare",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "WeekendSlotTrap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 5],
      compatibleTopics: [
        "puzzles",
        "scheduling",
        "engine-constraint",
      ],
      compatiblePatternTypes: ["logic"],
      supportedReasoningTypes: [
        "inferential",
        "multi-step",
      ],
    },
    {
      id: "con-sched-relative",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "scheduling-constraints",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "RelativeDayFlip",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      compatibleTopics: [
        "puzzles",
        "scheduling",
        "engine-constraint",
      ],
      compatiblePatternTypes: ["logic"],
      supportedReasoningTypes: [
        "inferential",
        "multi-step",
      ],
    },
    {
      id: "con-sched-weekend",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "scheduling-constraints",
      ],
      preferredOperations: [
        "filter",
        "infer",
      ],
      commonDistractors: [
        "WeekendSlotTrap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 5],
      compatibleTopics: [
        "puzzles",
        "scheduling",
        "engine-constraint",
      ],
      compatiblePatternTypes: ["logic"],
      supportedReasoningTypes: [
        "inferential",
        "multi-step",
      ],
    },
    {
      id: "con-mapping-triad",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "multi-variable-mapping",
      ],
      preferredOperations: [
        "compare",
        "filter",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "AttributeSwap",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [4, 7],
      compatibleTopics: [
        "puzzles",
        "mapping",
        "engine-constraint",
      ],
      compatiblePatternTypes: ["logic"],
      supportedReasoningTypes: [
        "inferential",
        "multi-step",
      ],
    },
    {
      id: "con-mapping-negative",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "multi-variable-mapping",
      ],
      preferredOperations: [
        "filter",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "NegativeConstraintOmission",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [4, 7],
      compatibleTopics: [
        "puzzles",
        "mapping",
        "engine-constraint",
      ],
      compatiblePatternTypes: ["logic"],
      supportedReasoningTypes: [
        "inferential",
        "multi-step",
      ],
    },
    {
      id: "ssc_simple_row",
      displayName: "SSC Simple Row",
      topicCluster:
        "seating-arrangement",
      facingPattern:
        "UNIDIRECTIONAL_NORTH",
      participantCount: 6,
      reasoningCategories: [
        "direct-placement",
        "relative-position",
        "ssc-row",
      ],
      preferredOperations: [
        "compare",
        "infer",
        "filter",
      ],
      commonDistractors: [
        "BoundaryDirectionTrap",
        "LeftRightFlip",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 5],
      compatibleTopics: [
        "seating",
        "linear-row",
        "engine-constraint",
      ],
      compatiblePatternTypes: ["logic"],
      supportedReasoningTypes: [
        "inferential",
        "multi-step",
      ],
      wordingBias: {
        concise: 0.85,
        balanced: 0.7,
      },
      examWeights: {
        ssc: 1.35,
        rrb: 1.15,
      },
    },
    {
      id: "ssc_circular_basic",
      displayName: "SSC Circular Basic",
      topicCluster:
        "seating-arrangement",
      facingPattern:
        "CIRCULAR_INWARD",
      participantCount: 6,
      reasoningCategories: [
        "circular-arrangement",
        "immediate-neighbours",
        "ssc-circular",
      ],
      preferredOperations: [
        "infer",
        "compare",
        "filter",
      ],
      commonDistractors: [
        "ClockwiseAntiClockwiseTrap",
        "NeighbourSwap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 5],
      compatibleTopics: [
        "seating",
        "circular",
        "engine-constraint",
      ],
      compatiblePatternTypes: ["logic"],
      supportedReasoningTypes: [
        "inferential",
        "multi-step",
      ],
      wordingBias: {
        concise: 0.75,
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.25,
        ibps: 1.05,
      },
    },
    {
      id: "banking_alternate_row",
      displayName:
        "Banking Alternate Row",
      topicCluster:
        "seating-arrangement",
      facingPattern:
        "ALTERNATE_NS",
      participantCount: 8,
      reasoningCategories: [
        "alternate-facing",
        "directional-complexity",
        "banking-row",
      ],
      preferredOperations: [
        "transform",
        "infer",
        "filter",
      ],
      commonDistractors: [
        "SouthFacingLeftRightTrap",
        "AlternateFacingOmission",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [5, 7],
      compatibleTopics: [
        "seating",
        "alternate-row",
        "engine-constraint",
      ],
      compatiblePatternTypes: ["logic"],
      supportedReasoningTypes: [
        "inferential",
        "multi-step",
      ],
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.9,
      },
      examWeights: {
        ibps: 1.35,
        sbi: 1.35,
      },
    },
    {
      id: "banking_parallel_row",
      displayName:
        "Banking Parallel Row",
      topicCluster:
        "seating-arrangement",
      facingPattern:
        "PARALLEL_OPPOSITE",
      participantCount: 8,
      reasoningCategories: [
        "parallel-row",
        "facing-each-other",
        "banking-row",
      ],
      preferredOperations: [
        "compare",
        "infer",
        "filter",
      ],
      commonDistractors: [
        "OppositeRowTrap",
        "RowDirectionFlip",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [5, 7],
      compatibleTopics: [
        "seating",
        "parallel-row",
        "engine-constraint",
      ],
      compatiblePatternTypes: ["logic"],
      supportedReasoningTypes: [
        "inferential",
        "multi-step",
      ],
      wordingBias: {
        balanced: 0.72,
        inferenceHeavy: 0.86,
      },
      examWeights: {
        ibps: 1.35,
        sbi: 1.35,
        cat: 1.1,
      },
    },
    {
      id: "direct_clue_linear",
      topicCluster:
        "seating-arrangement",
      facingPattern:
        "UNIDIRECTIONAL_NORTH",
      participantCount: 6,
      reasoningCategories: [
        "direct-placement",
      ],
      preferredOperations: [
        "compare",
        "transform",
      ],
      commonDistractors: [
        "wrongIntermediateValue",
        "comparisonTrap",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [2, 3],
      wordingBias: {
        concise: 0.9,
        balanced: 0.6,
      },
      examWeights: {
        ssc: 1.25,
        rrb: 1.2,
        ibps: 0.9,
      },
    },
    {
      id: "neighbor_clue_linear",
      topicCluster:
        "seating-arrangement",
      facingPattern:
        "UNIDIRECTIONAL_NORTH",
      participantCount: 6,
      reasoningCategories: [
        "neighbor-inference",
        "chained-deduction",
      ],
      preferredOperations: [
        "compare",
        "infer",
      ],
      commonDistractors: [
        "wrongIntermediateValue",
        "comparisonTrap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 4],
      wordingBias: {
        concise: 0.7,
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.2,
        sbi: 1.1,
      },
    },
    {
      id: "relative_position_clue",
      topicCluster:
        "seating-arrangement",
      facingPattern:
        "UNIDIRECTIONAL_NORTH",
      participantCount: 6,
      reasoningCategories: [
        "chained-deduction",
        "neighbor-inference",
      ],
      preferredOperations: [
        "compare",
        "infer",
        "transform",
      ],
      commonDistractors: [
        "comparisonTrap",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 5],
      wordingBias: {
        balanced: 0.8,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ibps: 1.2,
        sbi: 1.2,
        cat: 1.1,
      },
    },
    {
      id: "circular_opposite_chain",
      topicCluster:
        "seating-arrangement",
      facingPattern:
        "CIRCULAR_INWARD",
      participantCount: 6,
      reasoningCategories: [
        "chained-deduction",
      ],
      preferredOperations: [
        "infer",
        "compare",
        "transform",
      ],
      commonDistractors: [
        "comparisonTrap",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [4, 6],
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.8,
      },
      examWeights: {
        ibps: 1.2,
        sbi: 1.25,
        cat: 1.15,
      },
    },
    {
      id: "row_facing_inference",
      topicCluster:
        "seating-arrangement",
      facingPattern:
        "PARALLEL_OPPOSITE",
      participantCount: 8,
      reasoningCategories: [
        "neighbor-inference",
        "chained-deduction",
      ],
      preferredOperations: [
        "compare",
        "infer",
        "filter",
      ],
      commonDistractors: [
        "comparisonTrap",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [4, 6],
      wordingBias: {
        balanced: 0.75,
        inferenceHeavy: 0.8,
      },
      examWeights: {
        ibps: 1.25,
        sbi: 1.25,
        cat: 1.1,
      },
    },
    {
      id: "alternate_facing_deduction",
      topicCluster:
        "seating-arrangement",
      facingPattern:
        "ALTERNATE_NS",
      participantCount: 8,
      reasoningCategories: [
        "chained-deduction",
      ],
      preferredOperations: [
        "filter",
        "infer",
        "transform",
      ],
      commonDistractors: [
        "comparisonTrap",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [5, 7],
      wordingBias: {
        balanced: 0.65,
        inferenceHeavy: 0.9,
      },
      examWeights: {
        ibps: 1.3,
        sbi: 1.3,
        cat: 1.2,
      },
    },
    {
      id: "double_row_elimination",
      topicCluster:
        "seating-arrangement",
      facingPattern:
        "PARALLEL_OPPOSITE",
      participantCount: 8,
      reasoningCategories: [
        "chained-deduction",
      ],
      preferredOperations: [
        "filter",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "comparisonTrap",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [5, 7],
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.85,
      },
      examWeights: {
        ibps: 1.3,
        sbi: 1.3,
        cat: 1.15,
      },
    },
  ];
