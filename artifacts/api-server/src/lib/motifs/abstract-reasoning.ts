import { QuantMotif } from "./types";

export const abstractReasoningMotifs: QuantMotif[] = [
  {
    id: "abs-series",
    topicCluster: "abstract-reasoning",
    reasoningCategories: [
      "figure-series",
      "matrix-transposition",
      "rotation-symmetry",
    ],
    preferredOperations: [
      "transform",
      "compare",
      "infer",
    ],
    commonDistractors: [
      "RotationDirectionTrap",
      "SingleElementTracking",
      "MirrorInsteadOfRotate",
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [2, 5],
    compatibleTopics: [
      "abstract-reasoning",
      "engine-abstract",
      "figure-series",
      "non-verbal-series",
    ],
    compatiblePatternTypes: ["logic"],
    supportedReasoningTypes: [
      "visual",
      "inferential",
      "multi-step",
    ],
    examWeights: {
      ssc: 1.1,
      ibps: 1.2,
      sbi: 1.2,
    },
  },
  {
    id: "abs-paper-cutting",
    topicCluster: "abstract-reasoning",
    reasoningCategories: [
      "paper-cutting",
      "successive-symmetry",
      "unfolding",
    ],
    preferredOperations: [
      "transform",
      "infer",
    ],
    commonDistractors: [
      "FoldCountTrap",
      "MirrorAxisSwap",
      "PunchMultiplicityError",
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    compatibleTopics: [
      "abstract-reasoning",
      "engine-abstract",
      "paper-cutting",
      "paper-folding-cutting",
    ],
    compatiblePatternTypes: ["logic"],
    supportedReasoningTypes: [
      "visual",
      "inferential",
      "multi-step",
    ],
    examWeights: {
      ssc: 1,
      ibps: 1.1,
      sbi: 1.2,
    },
  },
  {
    id: "abs-embedded",
    topicCluster: "abstract-reasoning",
    reasoningCategories: [
      "embedded-figure",
      "visual-filtering",
      "shape-matching",
    ],
    preferredOperations: [
      "filter",
      "compare",
      "infer",
    ],
    commonDistractors: [
      "DistractorLineTrap",
      "OrientationMismatch",
      "PartialShapeTrap",
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [2, 5],
    compatibleTopics: [
      "abstract-reasoning",
      "engine-abstract",
      "embedded-figure",
      "embedded-figures",
      "hidden-figure",
    ],
    compatiblePatternTypes: ["logic"],
    supportedReasoningTypes: [
      "visual",
      "inferential",
      "multi-step",
    ],
    examWeights: {
      ssc: 1,
      ibps: 1.1,
      sbi: 1.1,
    },
  },
];
