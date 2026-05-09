import { QuantMotif } from "./types";

export const criticalInferenceMotifs: QuantMotif[] = [
  {
    id: "cri-inf-assumption",
    topicCluster: "critical-inference",
    reasoningCategories: [
      "statement-assumption",
      "semantic-necessity",
    ],
    preferredOperations: [
      "infer",
      "filter",
    ],
    commonDistractors: [
      "OutsideKnowledge",
      "ExtremeMeasure",
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    compatibleTopics: [
      "critical-inference",
      "engine-critical",
      "statement-assumption",
    ],
    compatiblePatternTypes: [
      "logic",
    ],
    supportedReasoningTypes: [
      "inferential",
      "conditional",
      "multi-step",
    ],
    examWeights: {
      ibps: 1.2,
      sbi: 1.1,
      cat: 1.2,
    },
  },
  {
    id: "cri-inf-conclusion",
    topicCluster: "critical-inference",
    reasoningCategories: [
      "statement-conclusion",
      "scope-validation",
    ],
    preferredOperations: [
      "compare",
      "filter",
      "infer",
    ],
    commonDistractors: [
      "OutsideKnowledge",
      "RestatementTrap",
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    compatibleTopics: [
      "critical-inference",
      "engine-critical",
      "statement-conclusion",
    ],
    compatiblePatternTypes: [
      "logic",
    ],
    supportedReasoningTypes: [
      "inferential",
      "conditional",
      "multi-step",
    ],
    examWeights: {
      ibps: 1.2,
      sbi: 1.1,
      cat: 1.2,
    },
  },
  {
    id: "cri-inf-action",
    topicCluster: "critical-inference",
    reasoningCategories: [
      "course-of-action",
      "pragmatic-logic",
    ],
    preferredOperations: [
      "filter",
      "compare",
    ],
    commonDistractors: [
      "ExtremeMeasure",
      "OutsideKnowledge",
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    compatibleTopics: [
      "critical-inference",
      "engine-critical",
      "course-of-action",
    ],
    compatiblePatternTypes: [
      "logic",
    ],
    supportedReasoningTypes: [
      "inferential",
      "conditional",
      "multi-step",
    ],
    examWeights: {
      ibps: 1.3,
      sbi: 1.2,
      cat: 1.1,
    },
  },
  {
    id: "cri-inf-cause",
    topicCluster: "critical-inference",
    reasoningCategories: [
      "cause-effect",
      "directional-logic",
    ],
    preferredOperations: [
      "compare",
      "infer",
    ],
    commonDistractors: [
      "Correlation_Cause",
      "OutsideKnowledge",
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    compatibleTopics: [
      "critical-inference",
      "engine-critical",
      "cause-effect",
    ],
    compatiblePatternTypes: [
      "logic",
    ],
    supportedReasoningTypes: [
      "inferential",
      "conditional",
      "multi-step",
    ],
    examWeights: {
      ibps: 1.2,
      sbi: 1.1,
      cat: 1.1,
    },
  },
  {
    id: "cri-inf-argument",
    topicCluster: "critical-inference",
    reasoningCategories: [
      "strong-weak-argument",
      "tone-scope-constraint",
    ],
    preferredOperations: [
      "filter",
      "compare",
    ],
    commonDistractors: [
      "ExtremeMeasure",
      "OutsideKnowledge",
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    compatibleTopics: [
      "critical-inference",
      "engine-critical",
      "strong-weak-arguments",
    ],
    compatiblePatternTypes: [
      "logic",
    ],
    supportedReasoningTypes: [
      "inferential",
      "conditional",
      "multi-step",
    ],
    examWeights: {
      ibps: 1.1,
      sbi: 1.1,
      cat: 1.3,
    },
  },
];
