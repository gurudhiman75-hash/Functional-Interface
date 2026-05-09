import { QuantMotif } from "./types";

export const temporalReasoningMotifs: QuantMotif[] = [
  {
    id: "tem-cal-day-find",
    topicCluster: "temporal-reasoning",
    reasoningCategories: [
      "calendar-odd-days",
      "absolute-date-weekday",
    ],
    preferredOperations: [
      "aggregate",
      "infer",
    ],
    commonDistractors: [
      "LeapCenturyOmission",
      "BoundaryDayError",
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    compatibleTopics: [
      "temporal-reasoning",
      "engine-temporal",
      "calendars",
    ],
    compatiblePatternTypes: [
      "logic",
    ],
    supportedReasoningTypes: [
      "symbolic",
      "inferential",
      "multi-step",
    ],
    examWeights: {
      ssc: 1.2,
      rrb: 1.1,
      ibps: 1,
    },
  },
  {
    id: "tem-cal-ref-shift",
    topicCluster: "temporal-reasoning",
    reasoningCategories: [
      "calendar-modulo-shift",
      "cyclic-accumulator",
    ],
    preferredOperations: [
      "transform",
      "infer",
    ],
    commonDistractors: [
      "BoundaryDayError",
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 3],
    compatibleTopics: [
      "temporal-reasoning",
      "engine-temporal",
      "calendars",
    ],
    compatiblePatternTypes: [
      "logic",
    ],
    supportedReasoningTypes: [
      "symbolic",
      "inferential",
    ],
    examWeights: {
      ssc: 1.2,
      rrb: 1.2,
    },
  },
  {
    id: "tem-cal-repetition",
    topicCluster: "temporal-reasoning",
    reasoningCategories: [
      "calendar-repetition",
      "leap-cycle",
    ],
    preferredOperations: [
      "aggregate",
      "compare",
      "infer",
    ],
    commonDistractors: [
      "LeapCenturyOmission",
      "BoundaryDayError",
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    compatibleTopics: [
      "temporal-reasoning",
      "engine-temporal",
      "calendars",
    ],
    compatiblePatternTypes: [
      "logic",
    ],
    supportedReasoningTypes: [
      "symbolic",
      "inferential",
      "multi-step",
    ],
    examWeights: {
      ibps: 1.1,
      sbi: 1.1,
      cat: 1,
    },
  },
  {
    id: "tem-clk-angle",
    topicCluster: "temporal-reasoning",
    reasoningCategories: [
      "clock-angle",
      "relative-angular-motion",
    ],
    preferredOperations: [
      "transform",
      "infer",
    ],
    commonDistractors: [
      "ReflexAngleTrap",
      "StaticHourHand",
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 4],
    compatibleTopics: [
      "temporal-reasoning",
      "engine-temporal",
      "clocks",
    ],
    compatiblePatternTypes: [
      "logic",
    ],
    supportedReasoningTypes: [
      "symbolic",
      "inferential",
      "multi-step",
    ],
    examWeights: {
      ssc: 1.1,
      ibps: 1.2,
      sbi: 1.1,
    },
  },
  {
    id: "tem-clk-overlap",
    topicCluster: "temporal-reasoning",
    reasoningCategories: [
      "clock-overlap",
      "relative-velocity",
    ],
    preferredOperations: [
      "compare",
      "infer",
      "ratio",
    ],
    commonDistractors: [
      "StaticHourHand",
      "FractionDecimalTrap",
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    compatibleTopics: [
      "temporal-reasoning",
      "engine-temporal",
      "clocks",
    ],
    compatiblePatternTypes: [
      "logic",
    ],
    supportedReasoningTypes: [
      "symbolic",
      "inferential",
      "multi-step",
    ],
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      cat: 1.1,
    },
  },
  {
    id: "tem-clk-faulty",
    topicCluster: "temporal-reasoning",
    reasoningCategories: [
      "faulty-clock",
      "time-rate-conversion",
    ],
    preferredOperations: [
      "ratio",
      "infer",
    ],
    commonDistractors: [
      "FaultyRateInversion",
      "BoundaryDayError",
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    compatibleTopics: [
      "temporal-reasoning",
      "engine-temporal",
      "clocks",
    ],
    compatiblePatternTypes: [
      "logic",
    ],
    supportedReasoningTypes: [
      "symbolic",
      "inferential",
      "multi-step",
    ],
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      cat: 1.2,
    },
  },
];
