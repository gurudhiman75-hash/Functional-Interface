// src/lib/motifs/seating-arrangement.ts
var seatingArrangementMotifs = [
  {
    id: "direct_clue_linear",
    topicCluster: "seating-arrangement",
    reasoningCategories: [
      "direct-placement"
    ],
    preferredOperations: [
      "compare",
      "transform"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [2, 3],
    wordingBias: {
      concise: 0.9,
      balanced: 0.6
    },
    examWeights: {
      ssc: 1.3,
      rrb: 1.2,
      ibps: 1
    }
  },
  {
    id: "neighbor_clue_linear",
    topicCluster: "seating-arrangement",
    reasoningCategories: [
      "neighbor-inference",
      "chained-deduction"
    ],
    preferredOperations: [
      "compare",
      "infer"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 4],
    wordingBias: {
      concise: 0.7,
      balanced: 0.8
    },
    examWeights: {
      ssc: 1.1,
      ibps: 1.2,
      sbi: 1.1
    }
  },
  {
    id: "relative_position_clue",
    topicCluster: "seating-arrangement",
    reasoningCategories: [
      "chained-deduction",
      "neighbor-inference"
    ],
    preferredOperations: [
      "compare",
      "infer",
      "transform"
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 5],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.7
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      cat: 1.1
    }
  }
];

// src/lib/shared/randomness.ts
function randomInt(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}
function pickRandomItem(items) {
  if (!items.length) {
    throw new Error(
      "Expected at least one item"
    );
  }
  return items[randomInt(0, items.length - 1)];
}
function shuffle(arr) {
  return [...arr].sort(
    () => Math.random() - 0.5
  );
}

// src/lib/motifs/percentage.ts
var percentageMotifs = [
  {
    id: "reverse_percentage_inference",
    topicCluster: "percentage",
    reasoningCategories: [
      "reverse-percentage",
      "hidden-base-inference"
    ],
    preferredOperations: [
      "reverse",
      "transform",
      "compare"
    ],
    commonDistractors: [
      "wrongDenominator",
      "percentageTrap"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [2, 4],
    wordingBias: {
      concise: 0.8,
      balanced: 0.4
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1,
      cat: 0.7
    }
  },
  {
    id: "successive_percentage_change",
    topicCluster: "percentage",
    reasoningCategories: [
      "successive-change",
      "compound-change"
    ],
    preferredOperations: [
      "transform",
      "aggregate"
    ],
    commonDistractors: [
      "cumulativeMistake",
      "percentageTrap"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.7
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.3
    }
  },
  {
    id: "contribution_based_growth",
    topicCluster: "percentage",
    reasoningCategories: [
      "contribution-analysis",
      "cross-comparison"
    ],
    preferredOperations: [
      "aggregate",
      "compare",
      "transform"
    ],
    commonDistractors: [
      "partialAggregation",
      "wrongSeries"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.8
    },
    examWeights: {
      cat: 1.4,
      ibps: 1.1
    }
  }
];

// src/lib/motifs/ratio.ts
var ratioMotifs = [
  {
    id: "ratio_redistribution",
    topicCluster: "ratio-proportion",
    reasoningCategories: [
      "redistribution",
      "ratio-adjustment"
    ],
    preferredOperations: [
      "transform",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "unchangedTotalAssumption",
      "ratioInversion"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.8,
      concise: 0.5
    },
    examWeights: {
      ssc: 1.3,
      ibps: 1.1,
      rrb: 1
    }
  },
  {
    id: "common_base_comparison",
    topicCluster: "ratio-proportion",
    reasoningCategories: [
      "normalization",
      "cross-comparison"
    ],
    preferredOperations: [
      "transform",
      "compare",
      "aggregate"
    ],
    commonDistractors: [
      "directComparison",
      "wrongNormalization"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [2, 4],
    wordingBias: {
      concise: 0.7
    },
    examWeights: {
      ssc: 1.2,
      rrb: 1.1,
      ibps: 0.9
    }
  },
  {
    id: "conditional_ratio_filtering",
    topicCluster: "ratio-proportion",
    reasoningCategories: [
      "conditional-selection",
      "filtered-comparison"
    ],
    preferredOperations: [
      "filter",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "skippedCondition",
      "wrongSubsetSelection"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.8
    },
    examWeights: {
      ibps: 1.3,
      sbi: 1.2,
      cat: 1
    }
  }
];

// src/lib/motifs/coding-decoding.ts
var codingDecodingMotifs = [
  {
    id: "direct_alphabet_shift",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "direct-alphabet-shift",
      "simple-substitution"
    ],
    preferredOperations: [
      "transform"
    ],
    commonDistractors: [
      "arithmeticSlip",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 2],
    wordingBias: {
      concise: 0.8,
      balanced: 0.5
    },
    examWeights: {
      ssc: 1.3,
      rrb: 1.2,
      ibps: 0.9
    }
  },
  {
    id: "reverse_alphabet_mapping",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "reverse-alphabet",
      "positional-coding"
    ],
    preferredOperations: [
      "reverse",
      "transform"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 3],
    wordingBias: {
      concise: 0.7,
      balanced: 0.6
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1,
      rrb: 1.1
    }
  },
  {
    id: "symbolic_position_encoding",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "mixed-symbol-letter-coding",
      "positional-coding"
    ],
    preferredOperations: [
      "transform",
      "compare"
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 4],
    wordingBias: {
      balanced: 0.8
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      ssc: 0.9
    }
  },
  {
    id: "conditional_letter_mapping",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "conditional-letter-mapping",
      "filtered-comparison"
    ],
    preferredOperations: [
      "filter",
      "transform",
      "compare"
    ],
    commonDistractors: [
      "skippedCondition",
      "wrongSubsetSelection"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.4
    },
    examWeights: {
      ibps: 1.3,
      sbi: 1.2,
      cat: 0.8
    }
  },
  {
    id: "multi_stage_word_transform",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "multi-stage-coding",
      "word-transformation-chains"
    ],
    preferredOperations: [
      "transform",
      "reverse",
      "aggregate"
    ],
    commonDistractors: [
      "cumulativeMistake",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      balanced: 0.5,
      inferenceHeavy: 0.8
    },
    examWeights: {
      cat: 1.4,
      ibps: 1.1,
      sbi: 1
    }
  },
  {
    id: "inference_based_decoding",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "inference-based-decoding",
      "conditional-letter-mapping"
    ],
    preferredOperations: [
      "infer",
      "compare",
      "transform"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap",
      "skippedCondition"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.9
    },
    examWeights: {
      cat: 1.5,
      ibps: 1.1,
      sbi: 1
    }
  }
];

// src/lib/motifs/blood-relations.ts
var bloodRelationMotifs = [
  {
    id: "direct_family_relation",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "direct-family-relation",
      "single-chain-relation"
    ],
    preferredOperations: [
      "compare"
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 2],
    wordingBias: {
      concise: 0.8,
      balanced: 0.5
    },
    examWeights: {
      ssc: 1.3,
      rrb: 1.2,
      ibps: 1
    }
  },
  {
    id: "generation_gap_reasoning",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "generation-gap-reasoning",
      "multi-person-chain-relations"
    ],
    preferredOperations: [
      "compare",
      "infer"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [2, 4],
    wordingBias: {
      balanced: 0.8
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      ssc: 1
    }
  },
  {
    id: "gender_based_inference",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "gender-based-inference",
      "multi-person-chain-relations"
    ],
    preferredOperations: [
      "infer",
      "compare"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "skippedCondition"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.4
    },
    examWeights: {
      ibps: 1.3,
      sbi: 1.2,
      cat: 0.9
    }
  },
  {
    id: "conditional_family_inference",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "conditional-family-inference",
      "nested-relationship-logic"
    ],
    preferredOperations: [
      "filter",
      "infer",
      "compare"
    ],
    commonDistractors: [
      "skippedCondition",
      "wrongSubsetSelection",
      "comparisonTrap"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      balanced: 0.6,
      inferenceHeavy: 0.8
    },
    examWeights: {
      ibps: 1.1,
      sbi: 1.2,
      cat: 1.1
    }
  },
  {
    id: "circular_relation_chain",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "circular-relation-chains",
      "nested-relationship-logic"
    ],
    preferredOperations: [
      "compare",
      "transform",
      "infer"
    ],
    commonDistractors: [
      "cumulativeMistake",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.8
    },
    examWeights: {
      cat: 1.4,
      ibps: 1,
      sbi: 1
    }
  },
  {
    id: "indirect_relation_deduction",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "indirect-relation-deduction",
      "nested-relationship-logic"
    ],
    preferredOperations: [
      "infer",
      "compare",
      "aggregate"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap",
      "skippedCondition"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.9
    },
    examWeights: {
      cat: 1.5,
      ibps: 1.1,
      sbi: 1.1
    }
  }
];

// src/lib/motifs/direction-sense.ts
var directionSenseMotifs = [
  {
    id: "straight_path_distance",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "straight-movement",
      "direct-distance"
    ],
    preferredOperations: [
      "transform",
      "compare"
    ],
    commonDistractors: [
      "arithmeticSlip",
      "comparisonTrap"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 2],
    wordingBias: {
      concise: 0.8,
      balanced: 0.5
    },
    examWeights: {
      ssc: 1.3,
      rrb: 1.2,
      ibps: 1
    }
  },
  {
    id: "simple_turn_tracking",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "simple-left-right-turns",
      "orientation-changes"
    ],
    preferredOperations: [
      "transform",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 3],
    wordingBias: {
      concise: 0.7,
      balanced: 0.6
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1.1,
      sbi: 1
    }
  },
  {
    id: "shortest_distance_inference",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "shortest-distance-inference",
      "multiple-turns"
    ],
    preferredOperations: [
      "transform",
      "aggregate",
      "infer"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "cumulativeMistake"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 4],
    wordingBias: {
      balanced: 0.8
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      ssc: 1
    }
  },
  {
    id: "orientation_shift_chain",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "orientation-changes",
      "coordinate-inference-chains"
    ],
    preferredOperations: [
      "transform",
      "infer",
      "compare"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "skippedCondition"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.4
    },
    examWeights: {
      ibps: 1.3,
      sbi: 1.2,
      cat: 0.9
    }
  },
  {
    id: "conditional_movement_reasoning",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "conditional-movement-reasoning",
      "hidden-orientation-shifts"
    ],
    preferredOperations: [
      "filter",
      "transform",
      "infer"
    ],
    commonDistractors: [
      "skippedCondition",
      "wrongSubsetSelection",
      "comparisonTrap"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      balanced: 0.6,
      inferenceHeavy: 0.8
    },
    examWeights: {
      ibps: 1.1,
      sbi: 1.2,
      cat: 1.1
    }
  },
  {
    id: "coordinate_inference_chain",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "complex-directional-chains",
      "coordinate-inference-chains"
    ],
    preferredOperations: [
      "transform",
      "aggregate",
      "infer",
      "compare"
    ],
    commonDistractors: [
      "cumulativeMistake",
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.9
    },
    examWeights: {
      cat: 1.5,
      ibps: 1.1,
      sbi: 1.1
    }
  }
];

// src/lib/motifs/inequality.ts
var inequalityMotifs = [
  {
    id: "direct_inequality_reading",
    topicCluster: "inequality",
    reasoningCategories: [
      "direct-inequalities",
      "basic-symbol-interpretation"
    ],
    preferredOperations: [
      "compare"
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 2],
    wordingBias: {
      concise: 0.8,
      balanced: 0.5
    },
    examWeights: {
      ssc: 1.3,
      rrb: 1.2,
      ibps: 1
    }
  },
  {
    id: "single_chain_deduction",
    topicCluster: "inequality",
    reasoningCategories: [
      "single-inference-chains",
      "basic-symbol-interpretation"
    ],
    preferredOperations: [
      "compare",
      "infer"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 3],
    wordingBias: {
      concise: 0.7,
      balanced: 0.7
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1.1,
      sbi: 1
    }
  },
  {
    id: "compound_inequality_linking",
    topicCluster: "inequality",
    reasoningCategories: [
      "compound-inequalities",
      "multi-statement-comparison"
    ],
    preferredOperations: [
      "compare",
      "aggregate",
      "infer"
    ],
    commonDistractors: [
      "comparisonTrap",
      "cumulativeMistake"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 4],
    wordingBias: {
      balanced: 0.8
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      ssc: 0.9
    }
  },
  {
    id: "indirect_conclusion_validation",
    topicCluster: "inequality",
    reasoningCategories: [
      "indirect-conclusions",
      "multi-statement-comparison"
    ],
    preferredOperations: [
      "infer",
      "compare",
      "transform"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap",
      "skippedCondition"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.4
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.1,
      cat: 0.9
    }
  },
  {
    id: "uncertain_branch_comparison",
    topicCluster: "inequality",
    reasoningCategories: [
      "uncertain-conclusions",
      "conditional-inequality-logic"
    ],
    preferredOperations: [
      "filter",
      "infer",
      "compare"
    ],
    commonDistractors: [
      "wrongSubsetSelection",
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      balanced: 0.5,
      inferenceHeavy: 0.8
    },
    examWeights: {
      cat: 1.4,
      ibps: 1.1,
      sbi: 1
    }
  },
  {
    id: "nested_symbolic_reasoning",
    topicCluster: "inequality",
    reasoningCategories: [
      "nested-inference-chains",
      "mixed-symbolic-reasoning"
    ],
    preferredOperations: [
      "aggregate",
      "infer",
      "compare"
    ],
    commonDistractors: [
      "cumulativeMistake",
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.9
    },
    examWeights: {
      cat: 1.5,
      ibps: 1.1,
      sbi: 1.1
    }
  }
];

// src/lib/motifs/index.ts
var ALL_MOTIFS = [
  ...percentageMotifs,
  ...ratioMotifs,
  ...codingDecodingMotifs,
  ...bloodRelationMotifs,
  ...directionSenseMotifs,
  ...inequalityMotifs,
  ...seatingArrangementMotifs
];

// src/lib/reasoning/seating-validator.ts
function getRelativeIndex(index, direction, distance, seatCount, arrangementType, facing) {
  if (arrangementType === "linear") {
    return direction === "right" ? index + distance : index - distance;
  }
  const effectiveStep = facing === "center" ? direction === "right" ? -distance : distance : direction === "right" ? distance : -distance;
  return (index + effectiveStep + seatCount) % seatCount;
}
function getCircularDistance(firstIndex, secondIndex, seatCount) {
  const direct = Math.abs(
    firstIndex - secondIndex
  );
  return Math.min(
    direct,
    seatCount - direct
  );
}
function areAdjacent(firstIndex, secondIndex, seatCount, arrangementType) {
  if (arrangementType === "linear") {
    return Math.abs(
      firstIndex - secondIndex
    ) === 1;
  }
  return getCircularDistance(
    firstIndex,
    secondIndex,
    seatCount
  ) === 1;
}
function matchesClue(arrangement, clue, arrangementType, facing) {
  switch (clue.type) {
    case "absolute":
      return arrangementType === "linear" && arrangement[clue.index] === clue.person;
    case "end":
      if (arrangementType !== "linear") {
        return false;
      }
      return clue.side === "left" ? arrangement[0] === clue.person : arrangement[arrangement.length - 1] === clue.person;
    case "adjacent": {
      const leftIndex = arrangement.indexOf(clue.left);
      const rightIndex = arrangement.indexOf(clue.right);
      if (clue.ordered) {
        return getRelativeIndex(
          leftIndex,
          "right",
          1,
          arrangement.length,
          arrangementType,
          facing
        ) === rightIndex;
      }
      return areAdjacent(
        leftIndex,
        rightIndex,
        arrangement.length,
        arrangementType
      );
    }
    case "not-adjacent": {
      const leftIndex = arrangement.indexOf(clue.left);
      const rightIndex = arrangement.indexOf(clue.right);
      return !areAdjacent(
        leftIndex,
        rightIndex,
        arrangement.length,
        arrangementType
      );
    }
    case "offset": {
      const anchorIndex = arrangement.indexOf(
        clue.anchor
      );
      const personIndex = arrangement.indexOf(
        clue.person
      );
      return getRelativeIndex(
        anchorIndex,
        clue.direction,
        clue.distance,
        arrangement.length,
        arrangementType,
        facing
      ) === personIndex;
    }
    case "distance-gap": {
      const leftIndex = arrangement.indexOf(clue.left);
      const rightIndex = arrangement.indexOf(clue.right);
      const separation = arrangementType === "circular" ? getCircularDistance(
        leftIndex,
        rightIndex,
        arrangement.length
      ) : Math.abs(
        leftIndex - rightIndex
      );
      return separation === clue.gap + 1;
    }
    case "between":
    case "adjacent-both": {
      const middleIndex = arrangement.indexOf(
        clue.middle
      );
      const firstIndex = arrangement.indexOf(clue.first);
      const secondIndex = arrangement.indexOf(clue.second);
      return areAdjacent(
        middleIndex,
        firstIndex,
        arrangement.length,
        arrangementType
      ) && areAdjacent(
        middleIndex,
        secondIndex,
        arrangement.length,
        arrangementType
      ) && firstIndex !== secondIndex;
    }
    case "not-end": {
      if (arrangementType !== "linear") {
        return false;
      }
      const personIndex = arrangement.indexOf(clue.person);
      return personIndex > 0 && personIndex < arrangement.length - 1;
    }
    case "not-opposite": {
      if (arrangementType !== "circular" || arrangement.length % 2 !== 0) {
        return false;
      }
      const leftIndex = arrangement.indexOf(clue.left);
      const rightIndex = arrangement.indexOf(clue.right);
      return getCircularDistance(
        leftIndex,
        rightIndex,
        arrangement.length
      ) !== arrangement.length / 2;
    }
    default:
      return false;
  }
}
function isPromptDirectlyAnsweredByClue(prompt, clues, _arrangementType, _seatCount, _facing) {
  return clues.some((clue) => {
    if (prompt.type === "neighbor-left" || prompt.type === "neighbor-right") {
      return clue.type === "adjacent" && clue.ordered && (prompt.type === "neighbor-right" && clue.left === prompt.anchor && clue.right === prompt.correctAnswer || prompt.type === "neighbor-left" && clue.right === prompt.anchor && clue.left === prompt.correctAnswer);
    }
    if (prompt.type === "relative") {
      return clue.type === "offset" && clue.anchor === prompt.anchor && clue.distance === prompt.distance && clue.direction === prompt.direction && clue.person === prompt.correctAnswer;
    }
    return false;
  });
}
function permute(values) {
  const permutations = [];
  function visit(prefix, remaining) {
    if (!remaining.length) {
      permutations.push(prefix);
      return;
    }
    for (let index = 0; index < remaining.length; index++) {
      visit(
        [
          ...prefix,
          remaining[index]
        ],
        remaining.filter(
          (_value, candidateIndex) => candidateIndex !== index
        )
      );
    }
  }
  visit([], values);
  return permutations;
}
function solveSeating(participants, clues, arrangementType, facing) {
  const solutions = [];
  let evaluated = 0;
  const permutations = arrangementType === "circular" ? permute(
    participants.slice(1)
  ).map((tail) => [
    participants[0],
    ...tail
  ]) : permute(participants);
  for (const arrangement of permutations) {
    evaluated += 1;
    if (clues.every(
      (clue) => matchesClue(
        arrangement,
        clue,
        arrangementType,
        facing
      )
    )) {
      solutions.push(arrangement);
      if (solutions.length > 1) {
        break;
      }
    }
  }
  return {
    solutions,
    solutionCount: solutions.length,
    solverComplexity: evaluated
  };
}
function solveLinearSeating(participants, clues, facing = "north") {
  return solveSeating(
    participants,
    clues,
    "linear",
    facing
  );
}
function solveCircularSeating(participants, clues, facing = "center") {
  return solveSeating(
    participants,
    clues,
    "circular",
    facing
  );
}
function validateSeatingScenario(participants, arrangement, clues, prompt, arrangementType, facing) {
  const warnings = [];
  if (new Set(participants).size !== participants.length) {
    warnings.push(
      "Participant list contained duplicate names."
    );
  }
  if (!clues.every(
    (clue) => matchesClue(
      arrangement,
      clue,
      arrangementType,
      facing
    )
  )) {
    warnings.push(
      "One or more clues contradicted the target arrangement."
    );
  }
  const solveResult = solveSeating(
    participants,
    clues,
    arrangementType,
    facing
  );
  if (solveResult.solutionCount === 0) {
    warnings.push(
      "No valid seating arrangement satisfied the clue set."
    );
  } else if (solveResult.solutionCount > 1) {
    warnings.push(
      "Clue set produced multiple valid arrangements."
    );
  }
  if (prompt && isPromptDirectlyAnsweredByClue(
    prompt,
    clues,
    arrangementType,
    arrangement.length,
    facing
  )) {
    warnings.push(
      "Prompt answer was directly revealed by a clue."
    );
  }
  return {
    valid: warnings.length === 0,
    warnings,
    solutionCount: solveResult.solutionCount,
    solverComplexity: solveResult.solverComplexity
  };
}
function validateLinearSeatingScenario(participants, arrangement, clues, prompt, facing = "north") {
  return validateSeatingScenario(
    participants,
    arrangement,
    clues,
    prompt,
    "linear",
    facing
  );
}
function validateCircularSeatingScenario(participants, arrangement, clues, prompt, facing = "center") {
  return validateSeatingScenario(
    participants,
    arrangement,
    clues,
    prompt,
    "circular",
    facing
  );
}

// src/lib/reasoning/seating-engine.ts
var PARTICIPANT_POOL = [
  "Aman",
  "Bhavna",
  "Charu",
  "Deepak",
  "Esha",
  "Farhan",
  "Gauri",
  "Harish",
  "Isha",
  "Jatin",
  "Kavya",
  "Lokesh",
  "Megha",
  "Nitin",
  "Pallavi",
  "Rohit",
  "Sneha",
  "Tanvi"
];
function selectParticipants(count) {
  return shuffle(PARTICIPANT_POOL).slice(
    0,
    count
  );
}
function getArrangementType(difficulty) {
  if (difficulty === "Hard") {
    return Math.random() < 0.6 ? "circular" : "linear";
  }
  if (difficulty === "Medium") {
    return Math.random() < 0.3 ? "circular" : "linear";
  }
  return "linear";
}
function getParticipantCount(difficulty, arrangementType) {
  if (arrangementType === "circular") {
    return difficulty === "Easy" ? 5 : 6;
  }
  if (difficulty === "Easy") {
    return 5 + Math.round(Math.random());
  }
  return 6;
}
function getFacing(arrangementType) {
  return arrangementType === "circular" ? "center" : "north";
}
function getRelativeIndex2(index, direction, distance, seatCount, arrangementType, facing) {
  if (arrangementType === "linear") {
    return direction === "right" ? index + distance : index - distance;
  }
  const effectiveStep = facing === "center" ? direction === "right" ? -distance : distance : direction === "right" ? distance : -distance;
  return (index + effectiveStep + seatCount) % seatCount;
}
function getCircularDistance2(firstIndex, secondIndex, seatCount) {
  const direct = Math.abs(
    firstIndex - secondIndex
  );
  return Math.min(
    direct,
    seatCount - direct
  );
}
function buildAbsoluteClues(arrangement) {
  return arrangement.map(
    (person, index) => ({
      type: "absolute",
      person,
      index
    })
  );
}
function buildEndClues(arrangement) {
  return [
    {
      type: "end",
      person: arrangement[0],
      side: "left"
    },
    {
      type: "end",
      person: arrangement[arrangement.length - 1],
      side: "right"
    }
  ];
}
function buildAdjacentClues(arrangement, arrangementType, facing) {
  const clues = [];
  const pairCount = arrangementType === "circular" ? arrangement.length : arrangement.length - 1;
  for (let index = 0; index < pairCount; index++) {
    const nextIndex = arrangementType === "circular" ? getRelativeIndex2(
      index,
      "right",
      1,
      arrangement.length,
      arrangementType,
      facing
    ) : index + 1;
    const left = arrangement[index];
    const right = arrangement[nextIndex];
    clues.push({
      type: "adjacent",
      left,
      right,
      ordered: true
    });
    clues.push({
      type: "adjacent",
      left,
      right,
      ordered: false
    });
  }
  return clues;
}
function buildNotAdjacentClues(arrangement, arrangementType) {
  const clues = [];
  for (let leftIndex = 0; leftIndex < arrangement.length; leftIndex++) {
    for (let rightIndex = leftIndex + 1; rightIndex < arrangement.length; rightIndex++) {
      const gap = arrangementType === "circular" ? getCircularDistance2(
        leftIndex,
        rightIndex,
        arrangement.length
      ) : Math.abs(
        rightIndex - leftIndex
      );
      if (gap > 1) {
        clues.push({
          type: "not-adjacent",
          left: arrangement[leftIndex],
          right: arrangement[rightIndex]
        });
      }
    }
  }
  return clues;
}
function buildOffsetClues(arrangement, arrangementType, facing) {
  const clues = [];
  const maxDistance = arrangementType === "circular" ? Math.min(
    3,
    Math.floor(
      arrangement.length / 2
    )
  ) : Math.min(
    3,
    arrangement.length - 1
  );
  for (let index = 0; index < arrangement.length; index++) {
    for (let distance = 2; distance <= maxDistance; distance++) {
      const directions = arrangementType === "circular" && distance * 2 === arrangement.length ? ["right"] : [
        "left",
        "right"
      ];
      for (const direction of directions) {
        const targetIndex = getRelativeIndex2(
          index,
          direction,
          distance,
          arrangement.length,
          arrangementType,
          facing
        );
        if (arrangementType === "linear" && (targetIndex < 0 || targetIndex >= arrangement.length)) {
          continue;
        }
        if (targetIndex === index) {
          continue;
        }
        clues.push({
          type: "offset",
          anchor: arrangement[index],
          person: arrangement[targetIndex],
          distance,
          direction
        });
      }
    }
  }
  return clues;
}
function buildDistanceGapClues(arrangement, arrangementType) {
  const clues = [];
  const supportedGaps = arrangementType === "circular" ? [1, 2] : [1, 2];
  for (let leftIndex = 0; leftIndex < arrangement.length; leftIndex++) {
    for (let rightIndex = leftIndex + 1; rightIndex < arrangement.length; rightIndex++) {
      const separation = arrangementType === "circular" ? getCircularDistance2(
        leftIndex,
        rightIndex,
        arrangement.length
      ) : Math.abs(
        rightIndex - leftIndex
      );
      const gap = separation - 1;
      if (supportedGaps.includes(
        gap
      )) {
        clues.push({
          type: "distance-gap",
          left: arrangement[leftIndex],
          right: arrangement[rightIndex],
          gap
        });
      }
    }
  }
  return clues;
}
function buildBetweenClues(arrangement, arrangementType) {
  const clues = [];
  for (let index = 0; index < arrangement.length; index++) {
    if (arrangementType === "linear" && (index === 0 || index === arrangement.length - 1)) {
      continue;
    }
    const leftIndex = arrangementType === "linear" ? index - 1 : (index - 1 + arrangement.length) % arrangement.length;
    const rightIndex = arrangementType === "linear" ? index + 1 : (index + 1) % arrangement.length;
    clues.push({
      type: "between",
      middle: arrangement[index],
      first: arrangement[leftIndex],
      second: arrangement[rightIndex]
    });
    clues.push({
      type: "adjacent-both",
      middle: arrangement[index],
      first: arrangement[leftIndex],
      second: arrangement[rightIndex]
    });
  }
  return clues;
}
function buildNotEndClues(arrangement) {
  return arrangement.slice(1, -1).map(
    (person) => ({
      type: "not-end",
      person
    })
  );
}
function buildNotOppositeClues(arrangement) {
  const clues = [];
  if (arrangement.length % 2 !== 0) {
    return clues;
  }
  for (let index = 0; index < arrangement.length; index++) {
    for (let candidateIndex = index + 1; candidateIndex < arrangement.length; candidateIndex++) {
      if (getCircularDistance2(
        index,
        candidateIndex,
        arrangement.length
      ) !== arrangement.length / 2) {
        clues.push({
          type: "not-opposite",
          left: arrangement[index],
          right: arrangement[candidateIndex]
        });
      }
    }
  }
  return clues;
}
function dedupeClues(clues) {
  const seen = /* @__PURE__ */ new Set();
  return clues.filter((clue) => {
    const key = JSON.stringify(clue);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
function isDirectClue(clue) {
  return clue.type === "absolute" || clue.type === "end";
}
function getEliminationContribution(clue) {
  switch (clue.type) {
    case "not-end":
    case "not-opposite":
    case "not-adjacent":
      return 1;
    case "distance-gap":
    case "between":
    case "adjacent-both":
      return 2;
    default:
      return 0;
  }
}
function getDirectClueLimit(difficulty) {
  if (difficulty === "Hard") {
    return 0;
  }
  if (difficulty === "Medium") {
    return 0;
  }
  return 1;
}
function getMinimumRelationalClues(difficulty, arrangementType) {
  if (difficulty === "Hard") {
    return 5;
  }
  if (arrangementType === "circular") {
    return 4;
  }
  if (difficulty === "Medium") {
    return 4;
  }
  return 3;
}
function getTargetClueRange(difficulty, arrangementType) {
  if (difficulty === "Easy") {
    return arrangementType === "circular" ? [4, 5] : [4, 5];
  }
  if (difficulty === "Hard") {
    return arrangementType === "circular" ? [6, 8] : [5, 7];
  }
  return arrangementType === "circular" ? [5, 7] : [5, 6];
}
function getDirectClueCount(clues) {
  return clues.filter(isDirectClue).length;
}
function getRelationalClueCount(clues) {
  return clues.length - getDirectClueCount(clues);
}
function getDeductionDepth(clues) {
  return clues.reduce(
    (sum, clue) => {
      switch (clue.type) {
        case "adjacent":
          return sum + (clue.ordered ? 1 : 2);
        case "offset":
          return sum + (clue.distance >= 3 ? 3 : 2);
        case "distance-gap":
        case "between":
        case "adjacent-both":
          return sum + 2;
        case "not-adjacent":
        case "not-opposite":
        case "not-end":
          return sum + 1;
        default:
          return sum;
      }
    },
    0
  );
}
function getEliminationDepth(clues) {
  return clues.reduce(
    (sum, clue) => sum + getEliminationContribution(
      clue
    ),
    0
  );
}
function hasEliminationClue(clues) {
  return clues.some(
    (clue) => clue.type === "not-adjacent" || clue.type === "not-opposite" || clue.type === "not-end"
  );
}
function hasDirectionalClue(clues) {
  return clues.some(
    (clue) => clue.type === "adjacent" && clue.ordered || clue.type === "offset"
  );
}
function meetsClueProfile(clues, difficulty, arrangementType) {
  return getDirectClueCount(clues) <= getDirectClueLimit(
    difficulty
  ) && getRelationalClueCount(clues) >= getMinimumRelationalClues(
    difficulty,
    arrangementType
  ) && (difficulty !== "Hard" || hasEliminationClue(clues)) && (arrangementType !== "circular" || hasDirectionalClue(clues));
}
function solveArrangement(arrangementType, participants, clues, facing) {
  return arrangementType === "circular" ? solveCircularSeating(
    participants,
    clues,
    facing
  ) : solveLinearSeating(
    participants,
    clues,
    facing
  );
}
function buildPromptCandidates(arrangement, arrangementType, facing) {
  const prompts = [];
  const distances = arrangementType === "circular" ? [1, 2, 3] : [1, 2];
  for (let index = 0; index < arrangement.length; index++) {
    const anchor = arrangement[index];
    for (const direction of [
      "left",
      "right"
    ]) {
      const neighborIndex = getRelativeIndex2(
        index,
        direction,
        1,
        arrangement.length,
        arrangementType,
        facing
      );
      if (arrangementType === "linear" && (neighborIndex < 0 || neighborIndex >= arrangement.length)) {
        continue;
      }
      prompts.push({
        type: direction === "left" ? "neighbor-left" : "neighbor-right",
        anchor,
        prompt: `Who sits immediately to the ${direction} of ${anchor}?`,
        correctAnswer: arrangement[neighborIndex]
      });
    }
    for (const distance of distances) {
      if (distance === 1) {
        continue;
      }
      for (const direction of [
        "left",
        "right"
      ]) {
        const targetIndex = getRelativeIndex2(
          index,
          direction,
          distance,
          arrangement.length,
          arrangementType,
          facing
        );
        if (arrangementType === "linear" && (targetIndex < 0 || targetIndex >= arrangement.length)) {
          continue;
        }
        const distanceWord = distance === 2 ? "second" : "third";
        prompts.push({
          type: "relative",
          anchor,
          distance,
          direction,
          prompt: `Who sits ${distanceWord} to the ${direction} of ${anchor}?`,
          correctAnswer: arrangement[targetIndex]
        });
      }
    }
  }
  return shuffle(prompts);
}
function getCluePool(arrangement, motif, arrangementType, facing) {
  const absolute = arrangementType === "linear" ? buildAbsoluteClues(
    arrangement
  ) : [];
  const ends = arrangementType === "linear" ? buildEndClues(arrangement) : [];
  const adjacent = buildAdjacentClues(
    arrangement,
    arrangementType,
    facing
  );
  const notAdjacent = buildNotAdjacentClues(
    arrangement,
    arrangementType
  );
  const offsets = buildOffsetClues(
    arrangement,
    arrangementType,
    facing
  );
  const gaps = buildDistanceGapClues(
    arrangement,
    arrangementType
  );
  const between = buildBetweenClues(
    arrangement,
    arrangementType
  );
  const notEnd = arrangementType === "linear" ? buildNotEndClues(arrangement) : [];
  const notOpposite = arrangementType === "circular" ? buildNotOppositeClues(
    arrangement
  ) : [];
  if (motif.id === "direct_clue_linear") {
    if (arrangementType === "circular") {
      return [
        ...shuffle(offsets),
        ...shuffle(
          adjacent.filter(
            (clue) => clue.type === "adjacent" && clue.ordered
          )
        ),
        ...shuffle(between),
        ...shuffle(gaps),
        ...shuffle(notAdjacent),
        ...shuffle(notOpposite)
      ];
    }
    return [
      ...shuffle(offsets),
      ...shuffle(
        adjacent.filter(
          (clue) => clue.type === "adjacent" && clue.ordered
        )
      ),
      ...shuffle(gaps),
      ...shuffle(notEnd),
      ...shuffle(notAdjacent),
      ...shuffle(between),
      ...shuffle(ends),
      ...shuffle(absolute),
      ...shuffle(notOpposite)
    ];
  }
  if (motif.id === "neighbor_clue_linear") {
    if (arrangementType === "circular") {
      return [
        ...shuffle(
          adjacent.filter(
            (clue) => clue.type === "adjacent" && clue.ordered
          )
        ),
        ...shuffle(between),
        ...shuffle(
          offsets.filter(
            (clue) => clue.type === "offset" && clue.distance <= 2
          )
        ),
        ...shuffle(gaps),
        ...shuffle(notAdjacent),
        ...shuffle(notOpposite)
      ];
    }
    return [
      ...shuffle(adjacent),
      ...shuffle(gaps),
      ...shuffle(notAdjacent),
      ...shuffle(between),
      ...shuffle(offsets),
      ...shuffle(notEnd),
      ...shuffle(notOpposite),
      ...shuffle(ends)
    ];
  }
  return [
    ...shuffle(offsets),
    ...shuffle(between),
    ...shuffle(gaps),
    ...shuffle(
      adjacent.filter(
        (clue) => clue.type === "adjacent" && clue.ordered
      )
    ),
    ...shuffle(
      adjacent.filter(
        (clue) => clue.type === "adjacent" && !clue.ordered
      )
    ),
    ...shuffle(notAdjacent),
    ...shuffle(notOpposite),
    ...shuffle(notEnd),
    ...shuffle(ends)
  ];
}
function isClueRedundant(participants, clues, prompt, difficulty, arrangementType, facing) {
  const solution = solveArrangement(
    arrangementType,
    participants,
    clues,
    facing
  );
  return solution.solutionCount === 1 && meetsClueProfile(
    clues,
    difficulty,
    arrangementType
  ) && !isPromptDirectlyAnsweredByClue(
    prompt,
    clues,
    arrangementType,
    participants.length,
    facing
  );
}
function minimizeClues(participants, clues, prompt, difficulty, arrangementType, facing) {
  const minimized = [...clues];
  for (let index = minimized.length - 1; index >= 0; index--) {
    const candidate = minimized.filter(
      (_clue, clueIndex) => clueIndex !== index
    );
    if (isClueRedundant(
      participants,
      candidate,
      prompt,
      difficulty,
      arrangementType,
      facing
    )) {
      minimized.splice(index, 1);
    }
  }
  return minimized;
}
function buildClueSet(participants, arrangement, motif, difficulty, arrangementType, facing, prompt) {
  const pool = dedupeClues(
    getCluePool(
      arrangement,
      motif,
      arrangementType,
      facing
    )
  );
  const [minClues, maxClues] = getTargetClueRange(
    difficulty,
    arrangementType
  );
  const selected = [];
  for (const clue of pool) {
    if (isDirectClue(clue) && getDirectClueCount(selected) >= getDirectClueLimit(
      difficulty
    )) {
      continue;
    }
    selected.push(clue);
    const solution = solveArrangement(
      arrangementType,
      participants,
      selected,
      facing
    );
    if (selected.length >= minClues && solution.solutionCount === 1 && meetsClueProfile(
      selected,
      difficulty,
      arrangementType
    ) && !isPromptDirectlyAnsweredByClue(
      prompt,
      selected,
      arrangementType,
      participants.length,
      facing
    )) {
      break;
    }
    if (selected.length >= maxClues) {
      break;
    }
  }
  return minimizeClues(
    participants,
    selected,
    prompt,
    difficulty,
    arrangementType,
    facing
  );
}
function createPrompt(arrangement, clues, arrangementType, facing) {
  const promptCandidates = buildPromptCandidates(
    arrangement,
    arrangementType,
    facing
  ).filter(
    (prompt) => !isPromptDirectlyAnsweredByClue(
      prompt,
      clues,
      arrangementType,
      arrangement.length,
      facing
    )
  );
  return promptCandidates[0] ?? buildPromptCandidates(
    arrangement,
    arrangementType,
    facing
  )[0];
}
function createSeatingScenario(motif, difficulty, arrangementType) {
  const maxAttempts = 600;
  const facing = getFacing(
    arrangementType
  );
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const participantCount = getParticipantCount(
      difficulty,
      arrangementType
    );
    const participants = selectParticipants(
      participantCount
    );
    const arrangement = shuffle(participants);
    const promptSeed = pickRandomItem(
      buildPromptCandidates(
        arrangement,
        arrangementType,
        facing
      )
    );
    const clues = buildClueSet(
      participants,
      arrangement,
      motif,
      difficulty,
      arrangementType,
      facing,
      promptSeed
    );
    const prompt = createPrompt(
      arrangement,
      clues,
      arrangementType,
      facing
    );
    const validation = arrangementType === "circular" ? validateCircularSeatingScenario(
      participants,
      arrangement,
      clues,
      prompt,
      facing
    ) : validateLinearSeatingScenario(
      participants,
      arrangement,
      clues,
      prompt,
      facing
    );
    if (validation.valid && meetsClueProfile(
      clues,
      difficulty,
      arrangementType
    )) {
      const directClueCount = getDirectClueCount(clues);
      const relationalClueCount = getRelationalClueCount(clues);
      const deductionDepth = Math.max(
        3,
        getDeductionDepth(clues)
      );
      const eliminationDepth = getEliminationDepth(clues);
      return {
        participants,
        arrangement,
        arrangementType,
        facing,
        clues,
        prompt,
        clueCount: clues.length,
        inferenceDepth: Math.max(
          3,
          Math.min(
            clues.length + relationalClueCount - directClueCount,
            8
          )
        ),
        solverComplexity: validation.solverComplexity,
        validationWarnings: validation.warnings,
        directClueCount,
        indirectClueCount: relationalClueCount,
        relationalClueCount,
        deductionDepth,
        eliminationDepth
      };
    }
  }
  throw new Error(
    `Unable to generate a valid ${arrangementType} seating arrangement.`
  );
}
function createLinearSeatingScenario(motif, difficulty) {
  return createSeatingScenario(
    motif,
    difficulty,
    "linear"
  );
}
function createAnySeatingScenario(motif, difficulty) {
  return createSeatingScenario(
    motif,
    difficulty,
    getArrangementType(difficulty)
  );
}

// temp-seating-failure-scan.ts
var results = [];
for (const difficulty of [
  "Easy",
  "Medium",
  "Hard"
]) {
  for (const motif of seatingArrangementMotifs) {
    let ok = 0;
    let fail = 0;
    for (let i = 0; i < 100; i++) {
      try {
        createAnySeatingScenario(
          motif,
          difficulty
        );
        ok += 1;
      } catch {
        fail += 1;
      }
    }
    results.push({
      mode: "any",
      motif: motif.id,
      difficulty,
      ok,
      fail
    });
  }
}
for (const difficulty of [
  "Easy",
  "Medium",
  "Hard"
]) {
  for (const motif of seatingArrangementMotifs) {
    let ok = 0;
    let fail = 0;
    for (let i = 0; i < 100; i++) {
      try {
        createLinearSeatingScenario(
          motif,
          difficulty
        );
        ok += 1;
      } catch {
        fail += 1;
      }
    }
    results.push({
      mode: "linear",
      motif: motif.id,
      difficulty,
      ok,
      fail
    });
  }
}
console.log(
  JSON.stringify(results, null, 2)
);
