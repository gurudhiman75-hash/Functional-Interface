import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type ProbabilityCategory =
  | "classical_sample_space"
  | "event_interaction"
  | "sampling_strategy"
  | "conditional_elite"
  | "set_venn";

type ProbabilityMotifDraft = {
  id: string;
  category: ProbabilityCategory;
  operations: string[];
  hiddenStructures: string[];
  distractors: string[];
  difficulty: 1 | 2 | 3 | 4;
};

export const probabilityScopeMap = {
  chapter: "Probability",
  coreDomains: [
    "Classical sample spaces",
    "Coins",
    "Dice",
    "Cards",
    "Bags and colored objects",
    "Independent events",
    "Complement events",
    "Mutually exclusive events",
    "Overlapping events",
    "With and without replacement",
    "Conditional probability",
    "Bayes theorem",
    "Binomial distribution",
    "Venn probability",
    "Odds conversion",
  ],
} as const;

export const probabilityDistractorRegistry = [
  "Sample_Space_Miscount",
  "Complement_Neglect",
  "Independence_Addition_Trap",
  "Replacement_Ignorance",
  "Dice_Linear_Assumption",
  "Denominator_Inversion",
  "Bayes_Denominator_Partial",
  "Overlap_Double_Count",
  "Binomial_Coefficient_Omission",
  "At_Most_At_Least_Swap",
  "Decimal_to_Percent_Error",
  "Venn_None_Omission",
  "Replacement_Mismatch",
  "Sequential_Order_Neglect",
  "Card_Face_Suit_Confusion",
  "Sum_Exceedance",
] as const;

export const probabilityProceduralMotifs: ProbabilityMotifDraft[] = [
  { id: "prob-sample-coins", category: "classical_sample_space", operations: ["coin sample space", "binomial count"], hiddenStructures: ["2^n outcomes"], distractors: ["Sample_Space_Miscount"], difficulty: 1 },
  { id: "prob-sample-dice-sum", category: "classical_sample_space", operations: ["dice sum count"], hiddenStructures: ["non-uniform sums"], distractors: ["Dice_Linear_Assumption"], difficulty: 2 },
  { id: "prob-sample-cards", category: "classical_sample_space", operations: ["card classification"], hiddenStructures: ["deck subset count"], distractors: ["Card_Face_Suit_Confusion"], difficulty: 1 },
  { id: "prob-sample-balls-bag", category: "classical_sample_space", operations: ["single draw"], hiddenStructures: ["favorable over total"], distractors: ["Denominator_Inversion"], difficulty: 1 },
  { id: "prob-sample-number-grid", category: "classical_sample_space", operations: ["integer sample space"], hiddenStructures: ["divisibility subset"], distractors: ["Sample_Space_Miscount"], difficulty: 2 },
  { id: "prob-event-independent", category: "event_interaction", operations: ["multiply independent probabilities"], hiddenStructures: ["joint success"], distractors: ["Independence_Addition_Trap"], difficulty: 2 },
  { id: "prob-event-complement", category: "event_interaction", operations: ["complement"], hiddenStructures: ["at least one"], distractors: ["Complement_Neglect"], difficulty: 2 },
  { id: "prob-event-mutually-exclusive", category: "event_interaction", operations: ["add disjoint events"], hiddenStructures: ["empty intersection"], distractors: ["Overlap_Double_Count"], difficulty: 2 },
  { id: "prob-event-overlap", category: "event_interaction", operations: ["inclusion-exclusion"], hiddenStructures: ["subtract overlap"], distractors: ["Overlap_Double_Count"], difficulty: 3 },
  { id: "prob-event-atmost", category: "event_interaction", operations: ["cumulative event"], hiddenStructures: ["at most vs at least"], distractors: ["At_Most_At_Least_Swap"], difficulty: 2 },
  { id: "prob-draw-sequential-with", category: "sampling_strategy", operations: ["with replacement"], hiddenStructures: ["constant denominator"], distractors: ["Replacement_Mismatch"], difficulty: 2 },
  { id: "prob-draw-sequential-without", category: "sampling_strategy", operations: ["without replacement"], hiddenStructures: ["state-changing denominator"], distractors: ["Replacement_Ignorance"], difficulty: 3 },
  { id: "prob-draw-simultaneous", category: "sampling_strategy", operations: ["nCr simultaneous selection"], hiddenStructures: ["order ignored"], distractors: ["Sequential_Order_Neglect"], difficulty: 3 },
  { id: "prob-draw-atleast-one", category: "sampling_strategy", operations: ["selection complement"], hiddenStructures: ["none selected complement"], distractors: ["Complement_Neglect"], difficulty: 3 },
  { id: "prob-conditional-basic", category: "conditional_elite", operations: ["conditional probability"], hiddenStructures: ["restricted sample space"], distractors: ["Denominator_Inversion"], difficulty: 3 },
  { id: "prob-bayes-theorem", category: "conditional_elite", operations: ["Bayes theorem"], hiddenStructures: ["posterior cause"], distractors: ["Bayes_Denominator_Partial"], difficulty: 4 },
  { id: "prob-binomial-distribution", category: "conditional_elite", operations: ["binomial probability"], hiddenStructures: ["nCr multiplier"], distractors: ["Binomial_Coefficient_Omission"], difficulty: 4 },
  { id: "prob-geometric-chance", category: "conditional_elite", operations: ["geometric interval"], hiddenStructures: ["area or time ratio"], distractors: ["Denominator_Inversion"], difficulty: 4 },
  { id: "prob-conditional-card", category: "conditional_elite", operations: ["conditional card subset"], hiddenStructures: ["given event restricts deck"], distractors: ["Card_Face_Suit_Confusion"], difficulty: 3 },
  { id: "prob-venn-2-set", category: "set_venn", operations: ["2-set inclusion-exclusion"], hiddenStructures: ["union and outside"], distractors: ["Overlap_Double_Count"], difficulty: 3 },
  { id: "prob-venn-3-set", category: "set_venn", operations: ["3-set inclusion-exclusion"], hiddenStructures: ["triple intersection"], distractors: ["Venn_None_Omission"], difficulty: 4 },
  { id: "prob-odds-conversion", category: "set_venn", operations: ["odds to probability"], hiddenStructures: ["favorable over total odds"], distractors: ["Denominator_Inversion"], difficulty: 2 },
  { id: "prob-venn-none", category: "set_venn", operations: ["outside probability"], hiddenStructures: ["complement of union"], distractors: ["Venn_None_Omission"], difficulty: 3 },
  { id: "prob-reliability-parallel", category: "event_interaction", operations: ["system works if at least one works"], hiddenStructures: ["complement of all fail"], distractors: ["Complement_Neglect"], difficulty: 3 },
  { id: "prob-quality-defective", category: "sampling_strategy", operations: ["defective batch probability"], hiddenStructures: ["quality-control sampling"], distractors: ["Replacement_Mismatch"], difficulty: 2 },
];

const categoryReasoning: Record<ProbabilityCategory, string[]> = {
  classical_sample_space: ["sample-space", "favorable-event"],
  event_interaction: ["event-logic", "probability-composition"],
  sampling_strategy: ["sampling-state", "replacement"],
  conditional_elite: ["conditional-probability", "posterior-reasoning"],
  set_venn: ["set-probability", "venn-logic"],
};

export const probabilityMotifs: QuantMotif[] =
  probabilityProceduralMotifs.map((motif) =>
    defineQuantMotif({
      id: motif.id,
      topicCluster: "probability",
      reasoningCategories:
        categoryReasoning[motif.category],
      preferredOperations: motif.operations,
      compatibleTopics: [
        "probability",
        "sample-space",
        "events",
        "permutation-combination",
      ],
      compatiblePatternTypes: ["formula"],
      supportedReasoningTypes: [
        "conditional",
        "multi-step",
        "inferential",
      ],
      requiredReasoningCapabilities: [
        motif.difficulty >= 3
          ? "multi-step"
          : "direct",
      ],
      supportedDifficultyBands:
        motif.difficulty <= 1
          ? ["Easy"]
          : motif.difficulty === 2
            ? ["Easy", "Medium"]
            : motif.difficulty === 3
              ? ["Medium", "Hard"]
              : ["Hard"],
      commonDistractors: motif.distractors,
      inferenceStyle:
        motif.difficulty >= 3
          ? "conditional"
          : "direct",
      reasoningDepthRange:
        motif.difficulty <= 2
          ? [1, 2]
          : motif.difficulty === 3
            ? [2, 3]
            : [3, 4],
      wordingBias: {
        concise: motif.difficulty <= 2 ? 0.45 : 0.2,
        balanced: 0.55,
        inferenceHeavy:
          motif.difficulty >= 3 ? 0.55 : 0.25,
      },
      examWeights: {
        ssc: motif.difficulty <= 3 ? 0.65 : 0.25,
        ibps: 0.65,
        cat: motif.difficulty >= 3 ? 0.85 : 0.45,
      },
      isActive: true,
      version: 1,
      source: "examtree-probability-knowledge-layer",
    }),
  );
