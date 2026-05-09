import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type NumCategory =
  | "classification"
  | "divisibility"
  | "remainders"
  | "factors"
  | "unit_digits"
  | "surds_indices";

type NumMotifDraft = {
  id: string;
  category: NumCategory;
  operations: string[];
  hiddenStructures: string[];
  distractors: string[];
  difficulty: 1 | 2 | 3 | 4;
};

export const numericalPropertyDistractorRegistry = [
  "Div_by_Zero_Undefined",
  "Prime_One_Confusion",
  "Div_Rule_9_vs_3",
  "Cyclicity_Error",
  "Trailing_Zero_2_vs_5",
  "Remainder_Negative_Neglect",
  "Co-prime_Factor_Error",
  "Proper_Factor_Omission",
  "VBODMAS_Order_Flip",
  "Recurring_Dec_9_Omission",
  "Surd_Power_Inversion",
  "Div_11_Alt_Sum_Flip",
  "Successive_Rem_Linear_Add",
  "Rational_Pi_Trap",
  "Integer_Sign_Error",
  "Power_of_Zero",
  "Composite_Smallest_Trap",
  "Unit_Digit_Five_Even",
  "Fermat_Condition_Neglect",
  "Fraction_Surd_Comparison",
] as const;

export const numericalPropertyMotifDrafts: NumMotifDraft[] = [
  { id: "num-class-id", category: "classification", operations: ["classify number"], hiddenStructures: ["number hierarchy"], distractors: ["Rational_Pi_Trap"], difficulty: 1 },
  { id: "num-class-prime-check", category: "classification", operations: ["prime test"], hiddenStructures: ["check divisors up to square root"], distractors: ["Prime_One_Confusion"], difficulty: 2 },
  { id: "num-class-integers", category: "classification", operations: ["integer sum formula"], hiddenStructures: ["sequence compression"], distractors: ["Integer_Sign_Error"], difficulty: 1 },
  { id: "num-class-rational-irrational", category: "classification", operations: ["rationality test"], hiddenStructures: ["decimal behavior"], distractors: ["Rational_Pi_Trap"], difficulty: 2 },
  { id: "num-class-smallest", category: "classification", operations: ["smallest prime composite"], hiddenStructures: ["one is neither prime nor composite"], distractors: ["Composite_Smallest_Trap"], difficulty: 1 },
  { id: "num-div-basic", category: "divisibility", operations: ["basic divisibility rules"], hiddenStructures: ["digit tests"], distractors: ["Div_Rule_9_vs_3"], difficulty: 1 },
  { id: "num-div-combined", category: "divisibility", operations: ["combined divisibility"], hiddenStructures: ["coprime factor rule"], distractors: ["Co-prime_Factor_Error"], difficulty: 3 },
  { id: "num-div-unknown", category: "divisibility", operations: ["unknown digit divisibility"], hiddenStructures: ["digit sum constraint"], distractors: ["Div_Rule_9_vs_3"], difficulty: 2 },
  { id: "num-div-11-unknown", category: "divisibility", operations: ["divisibility by 11"], hiddenStructures: ["alternating digit sum"], distractors: ["Div_11_Alt_Sum_Flip"], difficulty: 3 },
  { id: "num-div-missing-number", category: "divisibility", operations: ["missing digit test"], hiddenStructures: ["modular digit constraint"], distractors: ["Div_Rule_9_vs_3"], difficulty: 2 },
  { id: "num-rem-basic", category: "remainders", operations: ["product remainder"], hiddenStructures: ["modular reduction"], distractors: ["Remainder_Negative_Neglect"], difficulty: 2 },
  { id: "num-rem-power", category: "remainders", operations: ["power remainder"], hiddenStructures: ["cyclic residues"], distractors: ["Cyclicity_Error"], difficulty: 3 },
  { id: "num-rem-successive", category: "remainders", operations: ["successive division remainder"], hiddenStructures: ["back calculation"], distractors: ["Successive_Rem_Linear_Add"], difficulty: 4 },
  { id: "num-rem-negative", category: "remainders", operations: ["negative residue normalization"], hiddenStructures: ["least nonnegative remainder"], distractors: ["Remainder_Negative_Neglect"], difficulty: 2 },
  { id: "num-rem-fermat", category: "remainders", operations: ["Fermat residue"], hiddenStructures: ["prime modulus condition"], distractors: ["Fermat_Condition_Neglect"], difficulty: 4 },
  { id: "num-fact-count", category: "factors", operations: ["factor count"], hiddenStructures: ["prime exponent vector"], distractors: ["Proper_Factor_Omission"], difficulty: 2 },
  { id: "num-fact-sum", category: "factors", operations: ["sum of factors"], hiddenStructures: ["geometric factor product"], distractors: ["Proper_Factor_Omission"], difficulty: 3 },
  { id: "num-fact-trailing-zeros", category: "factors", operations: ["factorial trailing zeros"], hiddenStructures: ["count factors of five"], distractors: ["Trailing_Zero_2_vs_5"], difficulty: 3 },
  { id: "num-fact-highest-power", category: "factors", operations: ["highest power in factorial"], hiddenStructures: ["floor-sum exponents"], distractors: ["Trailing_Zero_2_vs_5"], difficulty: 4 },
  { id: "num-fact-proper", category: "factors", operations: ["proper factor count"], hiddenStructures: ["exclude the number itself"], distractors: ["Proper_Factor_Omission"], difficulty: 2 },
  { id: "num-unit-digit", category: "unit_digits", operations: ["unit digit cycle"], hiddenStructures: ["cyclicity mod 4"], distractors: ["Cyclicity_Error"], difficulty: 2 },
  { id: "num-unit-series", category: "unit_digits", operations: ["unit digit of series"], hiddenStructures: ["factorial tails stabilize"], distractors: ["Unit_Digit_Five_Even"], difficulty: 3 },
  { id: "num-last-two-digits", category: "unit_digits", operations: ["last two digits"], hiddenStructures: ["mod 100 cycle"], distractors: ["Cyclicity_Error"], difficulty: 4 },
  { id: "num-unit-product", category: "unit_digits", operations: ["unit digit product"], hiddenStructures: ["terminal digit multiplication"], distractors: ["Unit_Digit_Five_Even"], difficulty: 2 },
  { id: "num-unit-zero-power", category: "unit_digits", operations: ["zero power edge case"], hiddenStructures: ["undefined 0^0"], distractors: ["Power_of_Zero"], difficulty: 3 },
  { id: "num-surd-compare", category: "surds_indices", operations: ["surd comparison"], hiddenStructures: ["common power comparison"], distractors: ["Fraction_Surd_Comparison"], difficulty: 4 },
  { id: "num-simpl-vbodmas", category: "surds_indices", operations: ["VBODMAS simplification"], hiddenStructures: ["operation order"], distractors: ["VBODMAS_Order_Flip"], difficulty: 2 },
  { id: "num-simpl-recurring", category: "surds_indices", operations: ["recurring decimal conversion"], hiddenStructures: ["shift and subtract"], distractors: ["Recurring_Dec_9_Omission"], difficulty: 3 },
  { id: "num-index-laws", category: "surds_indices", operations: ["index laws"], hiddenStructures: ["power compression"], distractors: ["Surd_Power_Inversion"], difficulty: 2 },
  { id: "num-surd-simplify", category: "surds_indices", operations: ["surd simplification"], hiddenStructures: ["extract perfect square"], distractors: ["Surd_Power_Inversion"], difficulty: 2 },
  { id: "num-perfect-square-check", category: "factors", operations: ["perfect square check"], hiddenStructures: ["even prime exponents"], distractors: ["Proper_Factor_Omission"], difficulty: 2 },
  { id: "num-perfect-cube-check", category: "factors", operations: ["perfect cube check"], hiddenStructures: ["exponents multiples of three"], distractors: ["Proper_Factor_Omission"], difficulty: 3 },
  { id: "num-hcf-lcm-relation", category: "factors", operations: ["HCF LCM identity"], hiddenStructures: ["product invariant"], distractors: ["Proper_Factor_Omission"], difficulty: 2 },
  { id: "num-lcm-multiples", category: "factors", operations: ["least common multiple"], hiddenStructures: ["highest prime powers"], distractors: ["Co-prime_Factor_Error"], difficulty: 2 },
  { id: "num-base-conversion", category: "classification", operations: ["base expansion"], hiddenStructures: ["positional weights"], distractors: ["Integer_Sign_Error"], difficulty: 3 },
  { id: "num-digit-count", category: "classification", operations: ["digit count"], hiddenStructures: ["place value bounds"], distractors: ["Integer_Sign_Error"], difficulty: 2 },
  { id: "num-divisibility-range-count", category: "divisibility", operations: ["count multiples in interval"], hiddenStructures: ["AP boundary count"], distractors: ["Co-prime_Factor_Error"], difficulty: 3 },
  { id: "num-rem-chinese-basic", category: "remainders", operations: ["same remainder system"], hiddenStructures: ["LCM plus remainder"], distractors: ["Successive_Rem_Linear_Add"], difficulty: 4 },
  { id: "num-factorial-divisibility", category: "factors", operations: ["factorial divisibility"], hiddenStructures: ["factor exponent count"], distractors: ["Trailing_Zero_2_vs_5"], difficulty: 4 },
  { id: "num-recurring-pure", category: "surds_indices", operations: ["pure recurring decimal"], hiddenStructures: ["denominator of nines"], distractors: ["Recurring_Dec_9_Omission"], difficulty: 2 },
];

const categoryReasoning: Record<NumCategory, string[]> = {
  classification: ["number-classification", "number-hierarchy"],
  divisibility: ["divisibility-rules", "digit-tests"],
  remainders: ["modular-arithmetic", "cyclic-residues"],
  factors: ["prime-factorization", "factor-exponents"],
  unit_digits: ["cyclicity", "terminal-digit-reasoning"],
  surds_indices: ["indices-surds", "symbolic-simplification"],
};

export const numericalPropertyMotifs: QuantMotif[] =
  numericalPropertyMotifDrafts.map((motif) =>
    defineQuantMotif({
      id: motif.id,
      topicCluster: "number-system",
      reasoningCategories: [
        ...categoryReasoning[motif.category],
        ...motif.hiddenStructures,
      ],
      preferredOperations: motif.operations,
      compatibleTopics: [
        "number-system",
        "fundamentals",
        "arithmetic",
      ],
      compatiblePatternTypes: ["formula"],
      supportedReasoningTypes: [
        "direct",
        "conditional",
        "multi-step",
        "inferential",
        "symbolic",
      ],
      requiredReasoningCapabilities: [
        motif.difficulty >= 3 ? "multi-step" : "direct",
        "arithmetic",
      ],
      supportedDifficultyBands:
        motif.difficulty <= 1
          ? ["Easy", "Medium"]
          : motif.difficulty === 2
            ? ["Easy", "Medium", "Hard"]
            : motif.difficulty === 3
              ? ["Medium", "Hard"]
              : ["Hard"],
      commonDistractors: motif.distractors,
      inferenceStyle:
        motif.difficulty >= 3 ? "conditional" : "direct",
      reasoningDepthRange:
        motif.difficulty <= 2
          ? [1, 3]
          : motif.difficulty === 3
            ? [2, 4]
            : [3, 5],
      generationStrategy: [
        "numerical property engine with divisibility, modular cycles, factor exponents, and symbolic arithmetic",
      ],
      validationRules: [
        "Render classifications, divisibility, powers, factorials, surds, and recurring decimals in MathJax.",
        "Prefer mentally computable SSC values unless the motif is explicitly elite.",
      ],
      diversityTags: [motif.category, motif.id],
      wordingBias: {
        balanced: 0.55,
        inferenceHeavy: motif.difficulty >= 3 ? 0.55 : 0.25,
      },
      examWeights: {
        ssc: motif.difficulty <= 3 ? 0.85 : 0.35,
        ibps: 0.35,
        cat: motif.difficulty >= 3 ? 0.65 : 0.25,
      },
      isActive: true,
      version: 1,
      source: "examtree-number-system-numerical-property-engine",
    }),
  );
