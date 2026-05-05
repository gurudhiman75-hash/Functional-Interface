import {
  defineQuantMotif,
  type QuantMotif,
} from "./types";

export const practicalReasoningMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "seating-sparse-anchor",
      topicCluster:
        "seating-arrangement",
      archetype: "elimination-chain",
      reasoningCategories: [
        "sparse-anchor",
        "indirect-elimination",
      ],
      preferredOperations: [
        "infer",
        "filter",
        "compare",
      ],
      commonDistractors: [
        "premature-end-fix",
        "adjacencyChainTrap",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [4, 6],
      generationStrategy: [
        "minimize direct seat locks",
        "force progress through relative clues and elimination",
      ],
      parameterRanges: {
        participantCount: {
          min: 5,
          max: 8,
        },
      },
      distractorStrategies: [
        "symmetric mirror case",
        "incorrect extreme assumption",
      ],
      difficultyTuning: {
        easy: [
          "one anchor plus one relative chain",
        ],
        medium: [
          "single weak anchor with elimination",
        ],
        hard: [
          "no direct anchor beyond orientation",
        ],
      },
      validationRules: [
        "reject direct serialization chains",
        "require unique solution after clue minimization",
      ],
      diversityTags: [
        "sparse-anchor",
        "non-serial-seating",
      ],
      rotationGroup:
        "reasoning-seating-core",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.85,
      },
      examWeights: {
        ssc: 1.0,
        ibps: 1.2,
        sbi: 1.2,
      },
    }),
    defineQuantMotif({
      id: "seating-indirect-elimination",
      topicCluster:
        "seating-arrangement",
      archetype: "elimination-chain",
      reasoningCategories: [
        "indirect-elimination",
        "case-analysis",
      ],
      preferredOperations: [
        "filter",
        "infer",
        "compare",
      ],
      commonDistractors: [
        "wrongCaseRetention",
        "prematureNeighborLock",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [5, 7],
      generationStrategy: [
        "build one or two case splits that collapse through contradiction",
      ],
      parameterRanges: {
        clueCount: {
          min: 5,
          max: 8,
        },
      },
      distractorStrategies: [
        "retain eliminated mirror case",
        "forget exclusion clue",
      ],
      difficultyTuning: {
        medium: [
          "single contradiction case",
        ],
        hard: [
          "two linked eliminations",
        ],
      },
      validationRules: [
        "at least 40 percent interactive clues",
        "keep clue set minimal",
      ],
      diversityTags: [
        "case-elimination",
      ],
      rotationGroup:
        "reasoning-seating-core",
      wordingBias: {
        balanced: 0.65,
        inferenceHeavy: 0.9,
      },
      examWeights: {
        ibps: 1.25,
        sbi: 1.25,
        cat: 1.1,
      },
    }),
    defineQuantMotif({
      id: "seating-orientation-inversion",
      topicCluster:
        "seating-arrangement",
      archetype: "relative-placement",
      reasoningCategories: [
        "orientation-flip",
        "facing-inversion",
      ],
      preferredOperations: [
        "transform",
        "infer",
        "filter",
      ],
      commonDistractors: [
        "observerLeftRightSwap",
        "oppositeSeatConfusion",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [5, 8],
      generationStrategy: [
        "use alternate-facing or double-row geometry where left-right flips matter",
      ],
      parameterRanges: {
        participantCount: {
          min: 6,
          max: 10,
        },
      },
      distractorStrategies: [
        "keep global left-right interpretation",
        "ignore facing state",
      ],
      difficultyTuning: {
        medium: [
          "single facing flip",
        ],
        hard: [
          "multiple flips across rows",
        ],
      },
      validationRules: [
        "must include at least one facing-sensitive clue",
      ],
      diversityTags: [
        "orientation-flip",
      ],
      rotationGroup:
        "reasoning-seating-core",
      wordingBias: {
        balanced: 0.6,
        inferenceHeavy: 0.9,
      },
      examWeights: {
        ibps: 1.3,
        sbi: 1.3,
        cat: 1.15,
      },
    }),
    defineQuantMotif({
      id: "ordering-dual-rank-offset",
      topicCluster:
        "ordering-ranking",
      archetype: "relative-placement",
      reasoningCategories: [
        "rank-offset",
        "dual-reference",
      ],
      preferredOperations: [
        "compare",
        "infer",
        "transform",
      ],
      commonDistractors: [
        "topBottomSwap",
        "middleCountOffByOne",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 5],
      generationStrategy: [
        "combine rank from top and rank from bottom with one positional offset",
      ],
      parameterRanges: {
        participantCount: {
          min: 6,
          max: 14,
        },
      },
      distractorStrategies: [
        "count inclusive instead of exclusive",
        "use same reference direction twice",
      ],
      difficultyTuning: {
        easy: [
          "single combined rank",
        ],
        medium: [
          "rank plus neighbor relation",
        ],
        hard: [
          "multiple offset references",
        ],
      },
      validationRules: [
        "avoid direct final-position clue",
      ],
      diversityTags: [
        "ranking-offset",
      ],
      rotationGroup:
        "reasoning-ranking-core",
      wordingBias: {
        concise: 0.6,
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        rrb: 1.1,
      },
    }),
    defineQuantMotif({
      id: "ordering-middle-elimination",
      topicCluster:
        "ordering-ranking",
      archetype: "elimination-chain",
      reasoningCategories: [
        "middle-position",
        "indirect-elimination",
      ],
      preferredOperations: [
        "filter",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "centerPairConfusion",
        "endBias",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "use middle-band restrictions and relative rank clues",
      ],
      parameterRanges: {
        participantCount: {
          min: 7,
          max: 12,
        },
      },
      distractorStrategies: [
        "lock the exact middle too early",
        "forget odd-even seat effect",
      ],
      difficultyTuning: {
        medium: [
          "single middle restriction",
        ],
        hard: [
          "middle restriction plus directional ordering",
        ],
      },
      validationRules: [
        "require at least one non-direct interaction clue",
      ],
      diversityTags: [
        "ranking-middle-band",
      ],
      rotationGroup:
        "reasoning-ranking-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.0,
      },
    }),
    defineQuantMotif({
      id: "multi-variable-grid",
      topicCluster: "puzzles",
      archetype: "elimination-chain",
      reasoningCategories: [
        "multi-variable-grid",
        "cross-attribute-elimination",
      ],
      preferredOperations: [
        "filter",
        "infer",
        "compare",
      ],
      commonDistractors: [
        "single-dimension-lock",
        "attributeCarryoverMistake",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [5, 8],
      generationStrategy: [
        "link two or three attributes through sparse cross-constraints",
      ],
      parameterRanges: {
        entityCount: {
          min: 4,
          max: 6,
        },
      },
      distractorStrategies: [
        "assign attribute independently",
        "ignore one grid axis",
      ],
      difficultyTuning: {
        medium: [
          "two attributes",
        ],
        hard: [
          "three attributes with one case split",
        ],
      },
      validationRules: [
        "require unique full mapping",
        "avoid direct one-to-one clue dump",
      ],
      diversityTags: [
        "grid-puzzle",
      ],
      rotationGroup:
        "reasoning-puzzle-core",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.85,
      },
      examWeights: {
        ibps: 1.2,
        sbi: 1.25,
        cat: 1.1,
      },
    }),
    defineQuantMotif({
      id: "case-split-puzzle",
      topicCluster: "puzzles",
      archetype: "elimination-chain",
      reasoningCategories: [
        "case-analysis",
        "indirect-elimination",
      ],
      preferredOperations: [
        "filter",
        "infer",
        "transform",
      ],
      commonDistractors: [
        "unresolvedCaseCarry",
        "duplicateAssignment",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [5, 8],
      generationStrategy: [
        "start with an ambiguity that branches into two viable mini-cases",
      ],
      parameterRanges: {
        entityCount: {
          min: 4,
          max: 7,
        },
      },
      distractorStrategies: [
        "forget eliminated branch",
        "collapse both branches into one hybrid answer",
      ],
      difficultyTuning: {
        medium: [
          "single binary branch",
        ],
        hard: [
          "branch plus attribute dependency",
        ],
      },
      validationRules: [
        "only one surviving branch at the end",
      ],
      diversityTags: [
        "branching-puzzle",
      ],
      rotationGroup:
        "reasoning-puzzle-core",
      wordingBias: {
        balanced: 0.65,
        inferenceHeavy: 0.9,
      },
      examWeights: {
        ibps: 1.2,
        sbi: 1.2,
        cat: 1.15,
      },
    }),
    defineQuantMotif({
      id: "possibility-conclusion-trap",
      topicCluster: "syllogism",
      archetype: "general",
      reasoningCategories: [
        "possibility-check",
        "conclusion-filtering",
      ],
      preferredOperations: [
        "filter",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "definiteVsPossibleMixup",
        "reverseContainment",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 5],
      generationStrategy: [
        "mix definite and possibility conclusions against tight statements",
      ],
      parameterRanges: {
        statementCount: {
          min: 2,
          max: 4,
        },
      },
      distractorStrategies: [
        "promote possibility to certainty",
        "infer converse relation",
      ],
      difficultyTuning: {
        easy: [
          "basic possibility vs certainty",
        ],
        medium: [
          "mixed positive and negative conclusions",
        ],
        hard: [
          "linked possibility across three sets",
        ],
      },
      validationRules: [
        "keep one unambiguous answer option",
      ],
      diversityTags: [
        "syllogism-possibility",
      ],
      rotationGroup:
        "reasoning-syllogism-core",
      wordingBias: {
        concise: 0.7,
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "venn-overlap-filter",
      topicCluster: "syllogism",
      archetype: "general",
      reasoningCategories: [
        "overlap-inference",
        "statement-combo-check",
      ],
      preferredOperations: [
        "compare",
        "infer",
        "filter",
      ],
      commonDistractors: [
        "allSomeSwap",
        "nonOverlapAssumption",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 5],
      generationStrategy: [
        "compose statements that require careful overlap reasoning, not rote Venn drawing",
      ],
      parameterRanges: {
        statementCount: {
          min: 3,
          max: 4,
        },
      },
      distractorStrategies: [
        "assume disjointness without support",
        "convert partial overlap into subset",
      ],
      difficultyTuning: {
        medium: [
          "three-set overlap",
        ],
        hard: [
          "overlap plus negative conclusion",
        ],
      },
      validationRules: [
        "avoid duplicate logical conclusions",
      ],
      diversityTags: [
        "syllogism-overlap",
      ],
      rotationGroup:
        "reasoning-syllogism-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.15,
      },
    }),
  ];
