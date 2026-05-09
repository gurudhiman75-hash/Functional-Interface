import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type SimplificationCategory =
  | "vbodmas"
  | "roots"
  | "fractions_decimals"
  | "algebraic"
  | "indices";

type SimplificationMotifDraft = {
  id: string;
  category: SimplificationCategory;
  operations: string[];
  hiddenStructures: string[];
  distractors: string[];
  difficulty: 1 | 2 | 3 | 4;
};

export const simplificationDistractorRegistry = [
  "BODMAS_Order_Error",
  "Sign_Flip_Bracket",
  "Decimal_Place_Mismatch",
  "Recurring_Denom_Error",
  "Nested_Frac_Bottom_Up",
  "Surd_Power_Inversion",
  "Identical_Base_Assumption",
  "Approx_Rounding_Error",
  "Numerator_Denominator_Flip",
  "Vinculum_Neglect",
  "Zero_Power_One",
  "Negative_Base_Even_Power",
  "Fraction_Comparison_Inversion",
  "Root_Sum_Linear",
  "Percentage_of_Number",
  "Mixed_Fraction_Multiplication",
  "Unit_Mismatch_Simplification",
  "Cancelation_Illegal",
  "Base_Conversion_Slip",
  "Rationalization_Sign_Error",
] as const;

export const simplificationMotifDrafts: SimplificationMotifDraft[] = [
  { id: "sim-vbodmas-basic", category: "vbodmas", operations: ["operator hierarchy"], hiddenStructures: ["left-to-right multiplication division"], distractors: ["BODMAS_Order_Error"], difficulty: 1 },
  { id: "sim-vbodmas-bracket", category: "vbodmas", operations: ["nested bracket simplification"], hiddenStructures: ["sign distribution"], distractors: ["Sign_Flip_Bracket"], difficulty: 2 },
  { id: "sim-vbodmas-of", category: "vbodmas", operations: ["of operator priority"], hiddenStructures: ["percentage of number before division"], distractors: ["Percentage_of_Number"], difficulty: 2 },
  { id: "sim-vbodmas-vinculum", category: "vbodmas", operations: ["vinculum grouping"], hiddenStructures: ["bar expression first"], distractors: ["Vinculum_Neglect"], difficulty: 3 },
  { id: "sim-vbodmas-mixed-fraction", category: "vbodmas", operations: ["mixed fraction conversion"], hiddenStructures: ["improper fraction first"], distractors: ["Mixed_Fraction_Multiplication"], difficulty: 3 },
  { id: "sim-root-square", category: "roots", operations: ["square root shortcut"], hiddenStructures: ["perfect square recognition"], distractors: ["Decimal_Place_Mismatch"], difficulty: 1 },
  { id: "sim-root-cube", category: "roots", operations: ["cube root shortcut"], hiddenStructures: ["perfect cube recognition"], distractors: ["Surd_Power_Inversion"], difficulty: 2 },
  { id: "sim-root-approx", category: "roots", operations: ["approximate root"], hiddenStructures: ["nearby perfect square"], distractors: ["Approx_Rounding_Error"], difficulty: 3 },
  { id: "sim-root-decimal", category: "roots", operations: ["decimal root"], hiddenStructures: ["place value under root"], distractors: ["Decimal_Place_Mismatch"], difficulty: 2 },
  { id: "sim-root-surd-add", category: "roots", operations: ["surd addition"], hiddenStructures: ["like surd extraction"], distractors: ["Root_Sum_Linear"], difficulty: 3 },
  { id: "sim-root-rationalize", category: "roots", operations: ["rationalize denominator"], hiddenStructures: ["conjugate multiplication"], distractors: ["Rationalization_Sign_Error"], difficulty: 4 },
  { id: "sim-frac-nested", category: "fractions_decimals", operations: ["continued fraction"], hiddenStructures: ["bottom-up recursion"], distractors: ["Nested_Frac_Bottom_Up"], difficulty: 3 },
  { id: "sim-frac-compare", category: "fractions_decimals", operations: ["fraction comparison"], hiddenStructures: ["cross multiplication"], distractors: ["Fraction_Comparison_Inversion"], difficulty: 2 },
  { id: "sim-dec-recurring", category: "fractions_decimals", operations: ["recurring decimal conversion"], hiddenStructures: ["nines denominator"], distractors: ["Recurring_Denom_Error"], difficulty: 3 },
  { id: "sim-dec-mixed-recurring", category: "fractions_decimals", operations: ["mixed recurring decimal"], hiddenStructures: ["shift subtract"], distractors: ["Recurring_Denom_Error"], difficulty: 4 },
  { id: "sim-frac-complex", category: "fractions_decimals", operations: ["complex fraction simplification"], hiddenStructures: ["invert divisor"], distractors: ["Numerator_Denominator_Flip"], difficulty: 3 },
  { id: "sim-frac-illegal-cancel", category: "fractions_decimals", operations: ["cancellation validation"], hiddenStructures: ["factor before cancelling"], distractors: ["Cancelation_Illegal"], difficulty: 3 },
  { id: "sim-alg-ident", category: "algebraic", operations: ["difference of squares"], hiddenStructures: ["identity compression"], distractors: ["Cancelation_Illegal"], difficulty: 2 },
  { id: "sim-alg-cube-id", category: "algebraic", operations: ["sum difference of cubes"], hiddenStructures: ["factor cancellation"], distractors: ["Cancelation_Illegal"], difficulty: 4 },
  { id: "sim-alg-square-near", category: "algebraic", operations: ["near base square"], hiddenStructures: ["(a-b)^2 expansion"], distractors: ["BODMAS_Order_Error"], difficulty: 2 },
  { id: "sim-alg-product-near", category: "algebraic", operations: ["near base product"], hiddenStructures: ["(a-b)(a+b)"], distractors: ["Sign_Flip_Bracket"], difficulty: 2 },
  { id: "sim-alg-ratio-cancel", category: "algebraic", operations: ["factor and cancel"], hiddenStructures: ["common factor extraction"], distractors: ["Cancelation_Illegal"], difficulty: 3 },
  { id: "sim-index-basic", category: "indices", operations: ["index law compression"], hiddenStructures: ["same-base exponent arithmetic"], distractors: ["Identical_Base_Assumption"], difficulty: 2 },
  { id: "sim-index-comparison", category: "indices", operations: ["power comparison"], hiddenStructures: ["convert to common base"], distractors: ["Base_Conversion_Slip"], difficulty: 4 },
  { id: "sim-index-zero", category: "indices", operations: ["zero power"], hiddenStructures: ["nonzero base power zero"], distractors: ["Zero_Power_One"], difficulty: 1 },
  { id: "sim-index-negative-base", category: "indices", operations: ["negative base parity"], hiddenStructures: ["even power sign"], distractors: ["Negative_Base_Even_Power"], difficulty: 2 },
  { id: "sim-index-fractional", category: "indices", operations: ["fractional exponent"], hiddenStructures: ["root as power"], distractors: ["Surd_Power_Inversion"], difficulty: 3 },
  { id: "sim-index-illegal-merge", category: "indices", operations: ["base compatibility check"], hiddenStructures: ["different bases cannot merge"], distractors: ["Identical_Base_Assumption"], difficulty: 3 },
  { id: "sim-unit-conversion", category: "vbodmas", operations: ["unit conversion before simplification"], hiddenStructures: ["common unit first"], distractors: ["Unit_Mismatch_Simplification"], difficulty: 3 },
  { id: "sim-percent-of-chain", category: "vbodmas", operations: ["percentage of expression"], hiddenStructures: ["of priority"], distractors: ["Percentage_of_Number"], difficulty: 2 },
  { id: "sim-root-cube-decimal", category: "roots", operations: ["decimal cube root"], hiddenStructures: ["decimal place groups of three"], distractors: ["Decimal_Place_Mismatch"], difficulty: 3 },
  { id: "sim-frac-ascending", category: "fractions_decimals", operations: ["arrange fractions"], hiddenStructures: ["LCM comparison"], distractors: ["Fraction_Comparison_Inversion"], difficulty: 2 },
  { id: "sim-dec-fraction-blend", category: "fractions_decimals", operations: ["decimal fraction blend"], hiddenStructures: ["convert to fractions"], distractors: ["Decimal_Place_Mismatch"], difficulty: 3 },
  { id: "sim-alg-surd-conjugate", category: "algebraic", operations: ["conjugate product"], hiddenStructures: ["difference of squares with surds"], distractors: ["Rationalization_Sign_Error"], difficulty: 4 },
  { id: "sim-index-power-tower-small", category: "indices", operations: ["power of power"], hiddenStructures: ["right exponent grouping"], distractors: ["Identical_Base_Assumption"], difficulty: 4 },
];

const categoryReasoning: Record<SimplificationCategory, string[]> = {
  vbodmas: ["operation-order", "arithmetic-processing"],
  roots: ["root-recognition", "surd-processing"],
  fractions_decimals: ["fraction-decimal-conversion", "recursive-simplification"],
  algebraic: ["identity-compression", "structural-cancellation"],
  indices: ["index-laws", "power-comparison"],
};

export const simplificationMotifs: QuantMotif[] =
  simplificationMotifDrafts.map((motif) =>
    defineQuantMotif({
      id: motif.id,
      topicCluster: "simplification",
      reasoningCategories: [
        ...categoryReasoning[motif.category],
        ...motif.hiddenStructures,
      ],
      preferredOperations: motif.operations,
      compatibleTopics: [
        "simplification",
        "fundamentals",
        "number-system",
      ],
      compatiblePatternTypes: ["formula"],
      supportedReasoningTypes: [
        "direct",
        "conditional",
        "multi-step",
        "symbolic",
        "comparative",
      ],
      difficultyBias:
        motif.difficulty <= 1
          ? "Easy"
          : motif.difficulty === 2
            ? "Medium"
            : "Hard",
      generationHints: [
        "render nested fractions with MathJax \\cfrac",
        "prefer exact fractions over decimals unless decimal-place reasoning is the target",
        "include one cognitive trap from the simplification distractor registry",
      ],
      distractorHints: motif.distractors,
    }),
  );
