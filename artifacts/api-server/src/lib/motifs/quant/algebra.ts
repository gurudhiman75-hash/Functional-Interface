import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type AlgebraCategory =
  | "identities"
  | "linear"
  | "quadratic"
  | "inequalities_modulus"
  | "functions"
  | "logarithms"
  | "maxima_minima";

type AlgebraMotifDraft = {
  id: string;
  category: AlgebraCategory;
  operations: string[];
  hiddenStructures: string[];
  distractors: string[];
  difficulty: 1 | 2 | 3 | 4;
};

export const algebraScopeMap = {
  chapter: "Algebra",
  coreDomains: [
    "Polynomials and identities",
    "Linear equations and consistency",
    "Quadratic equations",
    "Inequalities and modulus",
    "Functions and graphs",
    "Logarithms",
    "Maxima and minima",
  ],
} as const;

export const algebraDistractorRegistry = [
  "Sign_Flip_Roots",
  "Identity_Mixed_Terms",
  "Inequality_Direction_Error",
  "Modulus_Case_Omission",
  "Log_Base_Confusion",
  "Domain_Boundary_Trap",
  "Newton_Sum_Power_Error",
  "Discriminant_Sign_Swap",
  "Consistent_Ratio_Inversion",
  "Rational_Root_Assumption",
  "AM_GM_Condition_Neglect",
  "Composite_Order_Swap",
  "Square_Root_Principle",
  "Log_Argument_Constraint",
  "Reciprocal_Identity_Flip",
  "Infinite_Sol_Condition",
  "Cubic_Factor_Omission",
  "Exponent_vs_Coefficient",
  "Base_Change_Inversion",
  "Quadratic_Max_Inversion",
  "Leading_Zero_Coefficient",
  "Remainder_Theorem_Sign",
] as const;

export const algebraProceduralMotifs: AlgebraMotifDraft[] = [
  { id: "alg-id-basic", category: "identities", operations: ["square identity", "difference of squares"], hiddenStructures: ["expand without direct expansion"], distractors: ["Identity_Mixed_Terms"], difficulty: 1 },
  { id: "alg-id-cubic", category: "identities", operations: ["cubic identity", "sum of cubes"], hiddenStructures: ["sum-product transformation"], distractors: ["Cubic_Factor_Omission"], difficulty: 2 },
  { id: "alg-id-triple", category: "identities", operations: ["conditional cubic identity"], hiddenStructures: ["zero-sum cubic compression"], distractors: ["Cubic_Factor_Omission"], difficulty: 3 },
  { id: "alg-id-cond-sum", category: "identities", operations: ["reciprocal square identity"], hiddenStructures: ["subtract two from square"], distractors: ["Reciprocal_Identity_Flip"], difficulty: 2 },
  { id: "alg-id-cond-diff", category: "identities", operations: ["reciprocal cubic difference"], hiddenStructures: ["cube of reciprocal expression"], distractors: ["Reciprocal_Identity_Flip"], difficulty: 3 },
  { id: "alg-simplify-cyclic", category: "identities", operations: ["cyclic simplification"], hiddenStructures: ["symmetric cancellation"], distractors: ["Identity_Mixed_Terms"], difficulty: 4 },
  { id: "alg-factor-remainder", category: "identities", operations: ["remainder theorem"], hiddenStructures: ["substitute sign opposite to factor"], distractors: ["Remainder_Theorem_Sign"], difficulty: 2 },
  { id: "alg-poly-factor", category: "identities", operations: ["factor theorem"], hiddenStructures: ["linear factor root"], distractors: ["Remainder_Theorem_Sign"], difficulty: 2 },
  { id: "alg-lin-simult", category: "linear", operations: ["simultaneous equations"], hiddenStructures: ["elimination"], distractors: ["Consistent_Ratio_Inversion"], difficulty: 2 },
  { id: "alg-lin-consistency", category: "linear", operations: ["linear consistency"], hiddenStructures: ["coefficient ratio comparison"], distractors: ["Infinite_Sol_Condition"], difficulty: 3 },
  { id: "alg-lin-word-problem", category: "linear", operations: ["word equation framing"], hiddenStructures: ["fixed plus variable cost"], distractors: ["Sign_Flip_Roots"], difficulty: 2 },
  { id: "alg-lin-parameter", category: "linear", operations: ["parameter solve"], hiddenStructures: ["substitution into equation"], distractors: ["Sign_Flip_Roots"], difficulty: 3 },
  { id: "alg-quad-roots", category: "quadratic", operations: ["quadratic roots"], hiddenStructures: ["factorization"], distractors: ["Rational_Root_Assumption"], difficulty: 2 },
  { id: "alg-quad-nature", category: "quadratic", operations: ["discriminant"], hiddenStructures: ["root nature classification"], distractors: ["Discriminant_Sign_Swap"], difficulty: 3 },
  { id: "alg-quad-coeff-rel", category: "quadratic", operations: ["sum and product of roots"], hiddenStructures: ["coefficient-root relation"], distractors: ["Sign_Flip_Roots"], difficulty: 2 },
  { id: "alg-quad-construct", category: "quadratic", operations: ["construct equation from roots"], hiddenStructures: ["root sum and product"], distractors: ["Sign_Flip_Roots"], difficulty: 3 },
  { id: "alg-quad-common-root", category: "quadratic", operations: ["common root condition"], hiddenStructures: ["shared root elimination"], distractors: ["Leading_Zero_Coefficient"], difficulty: 4 },
  { id: "alg-newton-sums", category: "quadratic", operations: ["Newton sums"], hiddenStructures: ["power sum recurrence"], distractors: ["Newton_Sum_Power_Error"], difficulty: 4 },
  { id: "alg-quad-complete-square", category: "quadratic", operations: ["complete the square"], hiddenStructures: ["vertex form"], distractors: ["Quadratic_Max_Inversion"], difficulty: 3 },
  { id: "alg-quad-param-root", category: "quadratic", operations: ["parameterized root"], hiddenStructures: ["root substitution"], distractors: ["Leading_Zero_Coefficient"], difficulty: 3 },
  { id: "alg-ineq-linear", category: "inequalities_modulus", operations: ["linear inequality"], hiddenStructures: ["sign flip on negative division"], distractors: ["Inequality_Direction_Error"], difficulty: 2 },
  { id: "alg-ineq-quad", category: "inequalities_modulus", operations: ["quadratic inequality"], hiddenStructures: ["wavy curve sign interval"], distractors: ["Inequality_Direction_Error"], difficulty: 3 },
  { id: "alg-mod-eqn", category: "inequalities_modulus", operations: ["modulus equation"], hiddenStructures: ["two-case split"], distractors: ["Modulus_Case_Omission"], difficulty: 2 },
  { id: "alg-mod-ineq", category: "inequalities_modulus", operations: ["modulus inequality"], hiddenStructures: ["bounded interval"], distractors: ["Modulus_Case_Omission"], difficulty: 3 },
  { id: "alg-ineq-rational", category: "inequalities_modulus", operations: ["rational inequality"], hiddenStructures: ["critical points"], distractors: ["Domain_Boundary_Trap"], difficulty: 4 },
  { id: "alg-mod-nested", category: "inequalities_modulus", operations: ["nested modulus"], hiddenStructures: ["piecewise cases"], distractors: ["Modulus_Case_Omission"], difficulty: 4 },
  { id: "alg-func-domain", category: "functions", operations: ["function domain"], hiddenStructures: ["denominator and radical restrictions"], distractors: ["Domain_Boundary_Trap"], difficulty: 3 },
  { id: "alg-func-range", category: "functions", operations: ["function range"], hiddenStructures: ["output bounds"], distractors: ["Domain_Boundary_Trap"], difficulty: 3 },
  { id: "alg-func-composite", category: "functions", operations: ["function composition"], hiddenStructures: ["inside-out evaluation"], distractors: ["Composite_Order_Swap"], difficulty: 3 },
  { id: "alg-func-even-odd", category: "functions", operations: ["even odd function"], hiddenStructures: ["substitute negative input"], distractors: ["Composite_Order_Swap"], difficulty: 2 },
  { id: "alg-func-inverse", category: "functions", operations: ["inverse function"], hiddenStructures: ["swap x and y"], distractors: ["Composite_Order_Swap"], difficulty: 3 },
  { id: "alg-func-value-param", category: "functions", operations: ["parameterized function value"], hiddenStructures: ["substitution chain"], distractors: ["Composite_Order_Swap"], difficulty: 2 },
  { id: "alg-log-basic", category: "logarithms", operations: ["log product quotient power rules"], hiddenStructures: ["log compression"], distractors: ["Log_Base_Confusion"], difficulty: 3 },
  { id: "alg-log-base-change", category: "logarithms", operations: ["base change formula"], hiddenStructures: ["ratio of logs"], distractors: ["Base_Change_Inversion"], difficulty: 3 },
  { id: "alg-log-eqn", category: "logarithms", operations: ["log equation"], hiddenStructures: ["argument constraints"], distractors: ["Log_Argument_Constraint"], difficulty: 4 },
  { id: "alg-log-domain", category: "logarithms", operations: ["log domain"], hiddenStructures: ["positive argument and base restrictions"], distractors: ["Log_Argument_Constraint"], difficulty: 3 },
  { id: "alg-log-exponent", category: "logarithms", operations: ["exponential log conversion"], hiddenStructures: ["base power relation"], distractors: ["Exponent_vs_Coefficient"], difficulty: 3 },
  { id: "alg-exp-eqn", category: "logarithms", operations: ["exponential equation"], hiddenStructures: ["same-base comparison"], distractors: ["Exponent_vs_Coefficient"], difficulty: 3 },
  { id: "alg-max-min-quad", category: "maxima_minima", operations: ["quadratic vertex"], hiddenStructures: ["vertex value"], distractors: ["Quadratic_Max_Inversion"], difficulty: 4 },
  { id: "alg-am-gm-opt", category: "maxima_minima", operations: ["AM-GM optimization"], hiddenStructures: ["positive variable condition"], distractors: ["AM_GM_Condition_Neglect"], difficulty: 4 },
  { id: "alg-max-product-fixed-sum", category: "maxima_minima", operations: ["fixed sum maximum product"], hiddenStructures: ["AM-GM equality"], distractors: ["AM_GM_Condition_Neglect"], difficulty: 3 },
  { id: "alg-min-sum-recip", category: "maxima_minima", operations: ["minimum reciprocal sum"], hiddenStructures: ["AM-GM equality"], distractors: ["AM_GM_Condition_Neglect"], difficulty: 4 },
  { id: "alg-sequence-ap", category: "identities", operations: ["AP nth term"], hiddenStructures: ["linear sequence relation"], distractors: ["Sign_Flip_Roots"], difficulty: 2 },
  { id: "alg-sequence-gp", category: "identities", operations: ["GP nth term"], hiddenStructures: ["exponential sequence relation"], distractors: ["Exponent_vs_Coefficient"], difficulty: 2 },
  { id: "alg-binomial-middle", category: "identities", operations: ["binomial middle term"], hiddenStructures: ["coefficient and power balance"], distractors: ["Exponent_vs_Coefficient"], difficulty: 4 },
];

export const algebraMotifs: QuantMotif[] =
  algebraProceduralMotifs.map((motif) => {
    const difficultyMap = {
      1: ["Easy", "Medium"],
      2: ["Easy", "Medium", "Hard"],
      3: ["Medium", "Hard"],
      4: ["Hard"],
    } as const;

    return defineQuantMotif({
      id: motif.id,
      topicCluster: "algebra",
      reasoningCategories: [
        motif.category,
        ...motif.hiddenStructures,
      ],
      preferredOperations:
        motif.operations,
      compatibleTopics: [
        "algebra",
        "algebra-basics",
      ],
      compatiblePatternTypes: [
        "formula",
        "logic",
      ],
      requiredVariables:
        motif.operations,
      supportedReasoningTypes: [
        "direct",
        "comparative",
        "conditional",
        "multi-step",
        "inferential",
        "symbolic",
      ],
      requiredReasoningCapabilities: [
        "arithmetic",
        "comparative",
        "conditional",
        "multi-step",
      ],
      supportedDifficultyBands:
        difficultyMap[motif.difficulty],
      commonDistractors:
        motif.distractors,
      inferenceStyle:
        motif.difficulty >= 3
          ? "hidden"
          : "conditional",
      reasoningDepthRange:
        motif.difficulty === 1
          ? [1, 2]
          : motif.difficulty === 2
            ? [2, 4]
            : motif.difficulty === 3
              ? [3, 5]
              : [5, 7],
      generationStrategy: [
        "symbolic solver procedural generation with strict MathJax algebra notation",
      ],
      parameterRanges: {
        coefficients:
          "Prefer small integers and clean discriminants.",
        roots:
          "Prefer integer roots unless the motif tests surds.",
        logs:
          "Use clean bases such as 2, 3, 4, 5, 10.",
      },
      distractorStrategies:
        motif.distractors,
      difficultyTuning: {
        easy: [
          "Use one identity or one linear equation.",
        ],
        medium: [
          "Use quadratic roots, reciprocal identities, modulus, or direct functions.",
        ],
        hard: [
          "Use discriminants, consistency, logarithms, optimization, or power sums.",
        ],
      },
      validationRules: [
        "Render every variable, equation, identity, operator, root, and logarithm in MathJax.",
        "If integer roots are required, ensure the discriminant is a perfect square.",
        "For logarithms, reject invalid argument or base values.",
        "For inequalities, preserve open and closed endpoint logic.",
      ],
      diversityTags: [
        motif.category,
        motif.id,
      ],
      wordingBias: {
        balanced: 0.55,
        inferenceHeavy: 0.45,
      },
      examWeights: {
        ssc: 0.35,
        ibps: 0.15,
        cat: 0.4,
        rrb: 0.1,
      },
    });
  });
