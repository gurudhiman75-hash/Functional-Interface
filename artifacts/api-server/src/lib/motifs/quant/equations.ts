import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type EquationCategory =
  | "linear"
  | "quadratic"
  | "higher_special"
  | "modulus"
  | "word_problem";

type EquationMotifDraft = {
  id: string;
  category: EquationCategory;
  operations: string[];
  hiddenStructures: string[];
  distractors: string[];
  difficulty: 1 | 2 | 3 | 4;
};

export const equationsScopeMap = {
  chapter: "Equations",
  coreDomains: [
    "Linear equations",
    "Simultaneous equations",
    "Consistency of linear systems",
    "Quadratic equations",
    "Discriminant and root nature",
    "Vieta relations",
    "Higher order special forms",
    "Modulus equations",
    "Equation-based word problems",
  ],
} as const;

export const equationsDistractorRegistry = [
  "Sign_Flip_Vieta",
  "Inconsistent_Infinite_Swap",
  "Modulus_Case_Omission",
  "Discriminant_Sign_Error",
  "Extraneous_Root_Trap",
  "Reciprocal_Sum_Linear",
  "Leading_Zero_Neglect",
  "Root_Coefficient_Inversion",
  "Square_Root_Principle_Error",
  "Integer_Constraint_Violation",
  "Substitution_Direction_Flip",
  "Perfect_Square_Assumption",
  "Common_Root_Partial",
  "Digit_Interchange_Sum",
  "Cubic_Vieta_Mixup",
  "Denominator_Zero_Trap",
  "Symmetric_Power_Error",
  "Age_Timeline_Shift",
  "Modulus_Distance_Error",
  "Surd_Rationalization_Slip",
] as const;

export const equationsProceduralMotifs: EquationMotifDraft[] = [
  { id: "eqn-lin-single", category: "linear", operations: ["balance linear terms"], hiddenStructures: ["same variable on both sides"], distractors: ["Substitution_Direction_Flip"], difficulty: 1 },
  { id: "eqn-lin-simultaneous", category: "linear", operations: ["elimination", "substitution"], hiddenStructures: ["two-variable state"], distractors: ["Substitution_Direction_Flip"], difficulty: 2 },
  { id: "eqn-lin-consistency", category: "linear", operations: ["ratio comparison"], hiddenStructures: ["coefficient proportionality"], distractors: ["Inconsistent_Infinite_Swap"], difficulty: 3 },
  { id: "eqn-lin-integer-only", category: "linear", operations: ["Diophantine search"], hiddenStructures: ["positive integer constraint"], distractors: ["Integer_Constraint_Violation"], difficulty: 4 },
  { id: "eqn-lin-parameter", category: "linear", operations: ["parameter solve"], hiddenStructures: ["unique-solution determinant"], distractors: ["Inconsistent_Infinite_Swap"], difficulty: 3 },
  { id: "eqn-lin-fractional", category: "linear", operations: ["clear denominators"], hiddenStructures: ["fraction normalization"], distractors: ["Denominator_Zero_Trap"], difficulty: 2 },
  { id: "eqn-quad-factor", category: "quadratic", operations: ["factorization"], hiddenStructures: ["integer root pair"], distractors: ["Square_Root_Principle_Error"], difficulty: 2 },
  { id: "eqn-quad-formula", category: "quadratic", operations: ["quadratic formula"], hiddenStructures: ["surd roots"], distractors: ["Surd_Rationalization_Slip"], difficulty: 3 },
  { id: "eqn-quad-nature", category: "quadratic", operations: ["discriminant"], hiddenStructures: ["root nature classification"], distractors: ["Discriminant_Sign_Error"], difficulty: 2 },
  { id: "eqn-quad-vieta", category: "quadratic", operations: ["root sum", "root product"], hiddenStructures: ["coefficient-root mapping"], distractors: ["Sign_Flip_Vieta"], difficulty: 2 },
  { id: "eqn-quad-construct", category: "quadratic", operations: ["construct equation"], hiddenStructures: ["sum-product equation form"], distractors: ["Root_Coefficient_Inversion"], difficulty: 3 },
  { id: "eqn-quad-symmetric", category: "quadratic", operations: ["symmetric powers"], hiddenStructures: ["Vieta plus identity"], distractors: ["Symmetric_Power_Error"], difficulty: 3 },
  { id: "eqn-quad-common-root", category: "quadratic", operations: ["shared root verification"], hiddenStructures: ["one-root overlap"], distractors: ["Common_Root_Partial"], difficulty: 4 },
  { id: "eqn-quad-equal-roots-param", category: "quadratic", operations: ["discriminant zero"], hiddenStructures: ["parameter from repeated root"], distractors: ["Discriminant_Sign_Error"], difficulty: 3 },
  { id: "eqn-quad-sign-roots", category: "quadratic", operations: ["root sign analysis"], hiddenStructures: ["sum-product sign"], distractors: ["Root_Coefficient_Inversion"], difficulty: 3 },
  { id: "eqn-poly-cubic", category: "higher_special", operations: ["factor theorem"], hiddenStructures: ["known integer root"], distractors: ["Cubic_Vieta_Mixup"], difficulty: 4 },
  { id: "eqn-special-reciprocal", category: "higher_special", operations: ["reciprocal substitution"], hiddenStructures: ["multiply by x"], distractors: ["Reciprocal_Sum_Linear"], difficulty: 3 },
  { id: "eqn-special-reducible", category: "higher_special", operations: ["quadratic substitution"], hiddenStructures: ["let y=x^2"], distractors: ["Square_Root_Principle_Error"], difficulty: 3 },
  { id: "eqn-special-radical", category: "higher_special", operations: ["square both sides"], hiddenStructures: ["extraneous-root validation"], distractors: ["Extraneous_Root_Trap"], difficulty: 3 },
  { id: "eqn-special-fractional", category: "higher_special", operations: ["rational equation"], hiddenStructures: ["denominator exclusion"], distractors: ["Denominator_Zero_Trap"], difficulty: 3 },
  { id: "eqn-mod-single", category: "modulus", operations: ["split absolute value"], hiddenStructures: ["two-case equation"], distractors: ["Modulus_Case_Omission"], difficulty: 2 },
  { id: "eqn-mod-double", category: "modulus", operations: ["critical point analysis"], hiddenStructures: ["distance on number line"], distractors: ["Modulus_Distance_Error"], difficulty: 4 },
  { id: "eqn-mod-nested", category: "modulus", operations: ["nested case split"], hiddenStructures: ["outer and inner distance"], distractors: ["Modulus_Case_Omission"], difficulty: 4 },
  { id: "eqn-mod-interval-count", category: "modulus", operations: ["solution counting"], hiddenStructures: ["distance interval length"], distractors: ["Modulus_Distance_Error"], difficulty: 3 },
  { id: "eqn-word-age", category: "word_problem", operations: ["timeline equation"], hiddenStructures: ["age shift applies to both"], distractors: ["Age_Timeline_Shift"], difficulty: 2 },
  { id: "eqn-word-digits", category: "word_problem", operations: ["place-value equation"], hiddenStructures: ["digit reversal"], distractors: ["Digit_Interchange_Sum"], difficulty: 3 },
  { id: "eqn-word-fixed-variable", category: "word_problem", operations: ["fixed plus variable cost"], hiddenStructures: ["linear model framing"], distractors: ["Substitution_Direction_Flip"], difficulty: 2 },
  { id: "eqn-word-geometry", category: "word_problem", operations: ["area equation"], hiddenStructures: ["quadratic from dimensions"], distractors: ["Integer_Constraint_Violation"], difficulty: 3 },
  { id: "eqn-word-mixture-count", category: "word_problem", operations: ["two-item price system"], hiddenStructures: ["integer count constraint"], distractors: ["Integer_Constraint_Violation"], difficulty: 3 },
  { id: "eqn-word-motion-linear", category: "word_problem", operations: ["distance equality"], hiddenStructures: ["same distance equation"], distractors: ["Substitution_Direction_Flip"], difficulty: 3 },
  { id: "eqn-word-work-rate", category: "word_problem", operations: ["reciprocal equation"], hiddenStructures: ["rate equation"], distractors: ["Reciprocal_Sum_Linear"], difficulty: 3 },
  { id: "eqn-word-break-even", category: "word_problem", operations: ["revenue equals cost"], hiddenStructures: ["break-even equation"], distractors: ["Substitution_Direction_Flip"], difficulty: 2 },
  { id: "eqn-root-ap", category: "higher_special", operations: ["roots in AP"], hiddenStructures: ["root structure constraint"], distractors: ["Cubic_Vieta_Mixup"], difficulty: 4 },
  { id: "eqn-root-gp", category: "higher_special", operations: ["roots in GP"], hiddenStructures: ["multiplicative root structure"], distractors: ["Cubic_Vieta_Mixup"], difficulty: 4 },
  { id: "eqn-param-common-solution", category: "linear", operations: ["shared solution parameter"], hiddenStructures: ["substitute common solution"], distractors: ["Common_Root_Partial"], difficulty: 4 },
];

const categoryReasoning: Record<EquationCategory, string[]> = {
  linear: ["linear-equation", "coefficient-balance"],
  quadratic: ["quadratic-equation", "root-analysis"],
  higher_special: ["special-form-equation", "substitution"],
  modulus: ["absolute-value", "case-split"],
  word_problem: ["equation-framing", "real-world-constraint"],
};

export const equationsMotifs: QuantMotif[] =
  equationsProceduralMotifs.map((motif) =>
    defineQuantMotif({
      id: motif.id,
      topicCluster: "equations",
      reasoningCategories:
        categoryReasoning[motif.category],
      preferredOperations: motif.operations,
      compatibleTopics: [
        "equations",
        "algebra",
        "quadratic-equations",
        "linear-equations",
      ],
      compatiblePatternTypes: ["formula"],
      supportedReasoningTypes: [
        "symbolic",
        "conditional",
        "multi-step",
      ],
      requiredReasoningCapabilities: [
        "symbolic",
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
        concise: motif.difficulty <= 2 ? 0.5 : 0.25,
        balanced: 0.5,
        inferenceHeavy:
          motif.difficulty >= 3 ? 0.5 : 0.2,
      },
      examWeights: {
        ssc: motif.difficulty <= 3 ? 0.8 : 0.35,
        ibps: 0.45,
        cat: motif.difficulty >= 3 ? 0.8 : 0.4,
      },
      isActive: true,
      version: 1,
      source: "examtree-equations-knowledge-layer",
    }),
  );
