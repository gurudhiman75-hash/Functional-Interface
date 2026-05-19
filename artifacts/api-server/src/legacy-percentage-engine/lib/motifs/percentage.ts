import type {
  MotifInferenceStyle,
  QuantMotif,
} from "./types";

type PercentageMotifSeed = {
  id: string;
  categories: string[];
  operations: string[];
  distractors: string[];
  inferenceStyle: MotifInferenceStyle;
  depth: [number, number];
  difficulty: "Easy" | "Medium" | "Hard";
  weights?: QuantMotif["examWeights"];
};

const seeds: PercentageMotifSeed[] = [
  { id: "perc_basic_of", categories: ["fundamental-operation"], operations: ["percentage"], distractors: ["arithmeticSlip"], inferenceStyle: "direct", depth: [1, 2], difficulty: "Easy", weights: { ssc: 1.5, rrb: 1.3 } },
  { id: "perc_reverse_find", categories: ["reverse-percentage"], operations: ["reverse", "percentage"], distractors: ["wrongDenominator"], inferenceStyle: "hidden", depth: [2, 3], difficulty: "Easy", weights: { ssc: 1.2, ibps: 1.1 } },
  { id: "perc_fraction_to_perc", categories: ["conversion"], operations: ["percentage", "ratio"], distractors: ["ratioInversion"], inferenceStyle: "direct", depth: [1, 2], difficulty: "Easy" },
  { id: "perc_decimal_to_perc", categories: ["conversion"], operations: ["percentage", "transform"], distractors: ["decimalPlaceError"], inferenceStyle: "direct", depth: [1, 2], difficulty: "Easy" },
  { id: "perc_basic_sum", categories: ["fundamental-operation", "aggregate"], operations: ["percentage", "aggregate"], distractors: ["partialAggregation"], inferenceStyle: "direct", depth: [2, 3], difficulty: "Easy" },
  { id: "perc_marks_calc", categories: ["marks-percentage"], operations: ["percentage", "ratio"], distractors: ["wrongDenominator"], inferenceStyle: "direct", depth: [1, 2], difficulty: "Easy", weights: { ssc: 1.2 } },
  { id: "perc_a_more_than_b", categories: ["relative-comparison"], operations: ["compare", "reverse"], distractors: ["baseConfusion"], inferenceStyle: "hidden", depth: [2, 3], difficulty: "Medium", weights: { ibps: 1.2 } },
  { id: "perc_price_increase", categories: ["change"], operations: ["percentage", "transform"], distractors: ["percentageTrap"], inferenceStyle: "direct", depth: [2, 3], difficulty: "Medium" },
  { id: "perc_price_decrease", categories: ["change"], operations: ["percentage", "transform"], distractors: ["percentageTrap"], inferenceStyle: "direct", depth: [2, 3], difficulty: "Medium" },
  { id: "perc_salary_hike", categories: ["change"], operations: ["compare", "percentage"], distractors: ["wrongDenominator"], inferenceStyle: "direct", depth: [2, 3], difficulty: "Medium" },
  { id: "perc_population_growth", categories: ["compound-change"], operations: ["transform", "aggregate"], distractors: ["cumulativeMistake"], inferenceStyle: "conditional", depth: [3, 4], difficulty: "Medium", weights: { ssc: 1.1, ibps: 1.2 } },
  { id: "perc_machine_depreciation", categories: ["compound-change"], operations: ["transform", "aggregate"], distractors: ["cumulativeMistake"], inferenceStyle: "conditional", depth: [3, 4], difficulty: "Medium" },
  { id: "perc_sequential_spend", categories: ["remaining-logic"], operations: ["percentage", "aggregate", "infer"], distractors: ["remainingBaseTrap"], inferenceStyle: "conditional", depth: [3, 4], difficulty: "Medium" },
  { id: "perc_successive_hike", categories: ["successive-change"], operations: ["transform", "aggregate"], distractors: ["cumulativeMistake"], inferenceStyle: "conditional", depth: [3, 4], difficulty: "Medium" },
  { id: "perc_restore_value", categories: ["restoration"], operations: ["reverse", "percentage"], distractors: ["baseConfusion"], inferenceStyle: "hidden", depth: [3, 4], difficulty: "Medium" },
  { id: "perc_compound_error", categories: ["successive-change"], operations: ["transform", "compare"], distractors: ["zeroNetTrap"], inferenceStyle: "hidden", depth: [3, 4], difficulty: "Medium" },
  { id: "perc_vote_election", categories: ["election"], operations: ["compare", "reverse"], distractors: ["percentagePointTrap"], inferenceStyle: "hidden", depth: [3, 4], difficulty: "Medium" },
  { id: "perc_exam_pass_fail", categories: ["exam-cutoff"], operations: ["compare", "reverse"], distractors: ["wrongDifference"], inferenceStyle: "hidden", depth: [3, 4], difficulty: "Medium" },
  { id: "perc_rect_length_increase", categories: ["geometry-change"], operations: ["transform", "aggregate"], distractors: ["linearAreaTrap"], inferenceStyle: "conditional", depth: [3, 5], difficulty: "Hard" },
  { id: "perc_circle_radius_change", categories: ["geometry-change"], operations: ["transform", "aggregate"], distractors: ["linearAreaTrap"], inferenceStyle: "conditional", depth: [3, 5], difficulty: "Hard" },
  { id: "perc_cube_volume_change", categories: ["geometry-change"], operations: ["transform", "aggregate"], distractors: ["linearVolumeTrap"], inferenceStyle: "conditional", depth: [3, 5], difficulty: "Hard" },
  { id: "perc_square_perimeter", categories: ["geometry-change"], operations: ["compare", "infer"], distractors: ["areaPerimeterMix"], inferenceStyle: "direct", depth: [2, 3], difficulty: "Hard" },
  { id: "perc_mixture_replacement", categories: ["mixture", "ratio-replacement"], operations: ["ratio", "percentage", "transform"], distractors: ["sameRatioAfterReplacement", "pureAdditionTrap"], inferenceStyle: "hidden", depth: [4, 5], difficulty: "Hard", weights: { cat: 1.3, ibps: 1.2 } },
  { id: "perc_mixture_water_add", categories: ["mixture"], operations: ["percentage", "reverse", "infer"], distractors: ["oldBaseTrap"], inferenceStyle: "hidden", depth: [4, 5], difficulty: "Hard", weights: { cat: 1.2, ibps: 1.1 } },
  { id: "perc_fruit_dry_weight", categories: ["composition"], operations: ["percentage", "reverse"], distractors: ["waterSolidTrap"], inferenceStyle: "hidden", depth: [4, 5], difficulty: "Hard" },
  { id: "perc_tax_income", categories: ["tax"], operations: ["compare", "reverse"], distractors: ["rateBaseTrap"], inferenceStyle: "hidden", depth: [4, 5], difficulty: "Hard" },
  { id: "perc_election_invalid", categories: ["election"], operations: ["filter", "percentage", "compare"], distractors: ["validVoteBaseTrap"], inferenceStyle: "conditional", depth: [4, 5], difficulty: "Hard" },
  { id: "perc_sales_commission", categories: ["commission"], operations: ["filter", "percentage", "aggregate"], distractors: ["thresholdTrap"], inferenceStyle: "conditional", depth: [4, 5], difficulty: "Hard" },
  { id: "perc_price_consumption", categories: ["budget"], operations: ["reverse", "percentage"], distractors: ["samePercentTrap"], inferenceStyle: "hidden", depth: [3, 4], difficulty: "Hard" },
  { id: "perc_population_gender", categories: ["weighted-change"], operations: ["compare", "reverse", "aggregate"], distractors: ["simpleAverageTrap"], inferenceStyle: "hidden", depth: [4, 5], difficulty: "Hard" },
  { id: "perc_alloy_composition", categories: ["alligation"], operations: ["ratio", "percentage", "compare"], distractors: ["ratioInversion"], inferenceStyle: "hidden", depth: [4, 5], difficulty: "Hard" },
];

export const percentageMotifs: QuantMotif[] =
  seeds.map((seed) => ({
    id: seed.id,
    topicCluster: "percentage",
    reasoningCategories: seed.categories,
    preferredOperations: seed.operations,
    commonDistractors: seed.distractors,
    inferenceStyle: seed.inferenceStyle,
    reasoningDepthRange: seed.depth,
    supportedDifficultyBands:
      seed.difficulty === "Easy"
        ? ["Easy"]
        : seed.difficulty === "Medium"
          ? ["Easy", "Medium"]
          : ["Medium", "Hard"],
    wordingBias: {
      concise:
        seed.difficulty === "Easy" ? 1.1 : 0.6,
      balanced: 0.9,
      inferenceHeavy:
        seed.difficulty === "Hard" ? 1.1 : 0.4,
    },
    examWeights: {
      ssc: 1,
      ibps: seed.difficulty === "Hard" ? 1.1 : 1,
      sbi: seed.difficulty === "Hard" ? 1.1 : 1,
      cat: seed.difficulty === "Hard" ? 1.2 : 0.8,
      rrb: seed.difficulty === "Easy" ? 1.2 : 0.8,
      ...seed.weights,
    },
    generationRules: {
      compatiblePatternTypes: ["formula"],
      compatibleTopics: ["percentage"],
      ruleTags: [seed.id, ...seed.categories],
      preferredOperations: seed.operations,
    },
    realizationHints: {
      explanationStyle: [
        "Show the base quantity explicitly.",
        "Mention whether the percentage is applied to the original value or remaining value.",
      ],
      distractorHints: seed.distractors,
    },
  }));

export const percentageMotifIds =
  percentageMotifs.map((motif) => motif.id);
