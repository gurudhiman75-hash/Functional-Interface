import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type FunctionCategory =
  | "mapping"
  | "types"
  | "operations"
  | "special"
  | "functional_equation"
  | "graphs";

type FunctionMotifDraft = {
  id: string;
  category: FunctionCategory;
  operations: string[];
  hiddenStructures: string[];
  distractors: string[];
  difficulty: 1 | 2 | 3 | 4;
};

export const functionsScopeMap = {
  chapter: "Functions",
  coreDomains: [
    "Mappings",
    "Domain and range",
    "Function evaluation",
    "Function types",
    "Operations and composition",
    "Inverse functions",
    "Modulus and GIF functions",
    "Functional equations",
    "Graph transformations",
  ],
} as const;

export const functionsDistractorRegistry = [
  "Composition_Order_Swap",
  "Domain_Boundary_Omission",
  "Range_Codomain_Confusion",
  "Inverse_Algebraic_Error",
  "Even_Odd_Sign_Flip",
  "GIF_Negative_Value",
  "Periodicity_Linear_Assumption",
  "Square_Root_Domain_Trap",
  "Log_Argument_Violation",
  "Transformation_Direction_Flip",
  "Onto_Check_Neglect",
  "Iterative_Pattern_Mismatch",
  "Modulus_Case_Omission",
  "Composite_Domain_Restriction",
  "Fractional_Part_Range",
  "Reflect_Axis_Swap",
  "Inverse_Existence_Check",
  "Symmetry_Origin_Confusion",
  "Linear_Equation_Inversion",
  "Vertical_Line_Failure",
] as const;

export const functionsProceduralMotifs: FunctionMotifDraft[] = [
  { id: "func-def-id", category: "mapping", operations: ["function identification"], hiddenStructures: ["one output per input"], distractors: ["Vertical_Line_Failure"], difficulty: 1 },
  { id: "func-domain-basic", category: "mapping", operations: ["domain exclusion"], hiddenStructures: ["avoid zero denominator"], distractors: ["Domain_Boundary_Omission"], difficulty: 1 },
  { id: "func-range-basic", category: "mapping", operations: ["range inference"], hiddenStructures: ["output set restriction"], distractors: ["Range_Codomain_Confusion"], difficulty: 2 },
  { id: "func-eval-direct", category: "mapping", operations: ["direct evaluation"], hiddenStructures: ["substitute input"], distractors: ["Domain_Boundary_Omission"], difficulty: 1 },
  { id: "func-eval-piecewise", category: "mapping", operations: ["piecewise evaluation"], hiddenStructures: ["choose interval branch"], distractors: ["Composite_Domain_Restriction"], difficulty: 2 },
  { id: "func-map-many-one", category: "mapping", operations: ["mapping classification"], hiddenStructures: ["many-to-one allowed"], distractors: ["Vertical_Line_Failure"], difficulty: 2 },
  { id: "func-type-injectivity", category: "types", operations: ["one-to-one check"], hiddenStructures: ["distinct inputs distinct outputs"], distractors: ["Inverse_Existence_Check"], difficulty: 2 },
  { id: "func-type-surjectivity", category: "types", operations: ["onto check"], hiddenStructures: ["range equals codomain"], distractors: ["Onto_Check_Neglect"], difficulty: 3 },
  { id: "func-type-parity", category: "types", operations: ["even odd check"], hiddenStructures: ["compare f(-x)"], distractors: ["Even_Odd_Sign_Flip"], difficulty: 2 },
  { id: "func-type-periodic", category: "types", operations: ["period detection"], hiddenStructures: ["least positive repeat"], distractors: ["Periodicity_Linear_Assumption"], difficulty: 3 },
  { id: "func-type-bounded", category: "types", operations: ["boundedness"], hiddenStructures: ["range bound"], distractors: ["Range_Codomain_Confusion"], difficulty: 3 },
  { id: "func-op-algebra", category: "operations", operations: ["function algebra"], hiddenStructures: ["combine outputs"], distractors: ["Domain_Boundary_Omission"], difficulty: 2 },
  { id: "func-comp-basic", category: "operations", operations: ["composition"], hiddenStructures: ["inside function first"], distractors: ["Composition_Order_Swap"], difficulty: 2 },
  { id: "func-comp-iterative", category: "operations", operations: ["iterated composition"], hiddenStructures: ["cycle pattern"], distractors: ["Iterative_Pattern_Mismatch"], difficulty: 4 },
  { id: "func-inverse-find", category: "operations", operations: ["inverse function"], hiddenStructures: ["swap and solve"], distractors: ["Inverse_Algebraic_Error"], difficulty: 2 },
  { id: "func-inverse-property", category: "operations", operations: ["inverse property"], hiddenStructures: ["composition identity"], distractors: ["Composition_Order_Swap"], difficulty: 2 },
  { id: "func-comp-domain", category: "operations", operations: ["composite domain"], hiddenStructures: ["both function domains"], distractors: ["Composite_Domain_Restriction"], difficulty: 4 },
  { id: "func-spec-modulus", category: "special", operations: ["modulus range"], hiddenStructures: ["absolute value nonnegative"], distractors: ["Modulus_Case_Omission"], difficulty: 3 },
  { id: "func-spec-gif", category: "special", operations: ["greatest integer"], hiddenStructures: ["floor behavior"], distractors: ["GIF_Negative_Value"], difficulty: 3 },
  { id: "func-spec-fractional", category: "special", operations: ["fractional part"], hiddenStructures: ["range [0,1)"], distractors: ["Fractional_Part_Range"], difficulty: 3 },
  { id: "func-spec-exp-log", category: "special", operations: ["exponential log inverse"], hiddenStructures: ["argument positivity"], distractors: ["Log_Argument_Violation"], difficulty: 3 },
  { id: "func-spec-signum", category: "special", operations: ["sign function"], hiddenStructures: ["piecewise sign"], distractors: ["Modulus_Case_Omission"], difficulty: 3 },
  { id: "func-eqn-additive", category: "functional_equation", operations: ["additive equation"], hiddenStructures: ["linear through origin"], distractors: ["Linear_Equation_Inversion"], difficulty: 4 },
  { id: "func-eqn-multiplicative", category: "functional_equation", operations: ["multiplicative to additive"], hiddenStructures: ["log structure"], distractors: ["Log_Argument_Violation"], difficulty: 4 },
  { id: "func-eqn-power", category: "functional_equation", operations: ["multiplicative function"], hiddenStructures: ["power structure"], distractors: ["Linear_Equation_Inversion"], difficulty: 4 },
  { id: "func-eqn-recursive", category: "functional_equation", operations: ["recursive values"], hiddenStructures: ["seed plus recurrence"], distractors: ["Iterative_Pattern_Mismatch"], difficulty: 4 },
  { id: "func-graph-shift", category: "graphs", operations: ["graph shift"], hiddenStructures: ["inside shift reverses direction"], distractors: ["Transformation_Direction_Flip"], difficulty: 2 },
  { id: "func-graph-reflect", category: "graphs", operations: ["graph reflection"], hiddenStructures: ["axis reflection"], distractors: ["Reflect_Axis_Swap"], difficulty: 2 },
  { id: "func-graph-intersect", category: "graphs", operations: ["intersection count"], hiddenStructures: ["solutions as intersections"], distractors: ["Range_Codomain_Confusion"], difficulty: 4 },
  { id: "func-graph-scale", category: "graphs", operations: ["graph scaling"], hiddenStructures: ["vertical versus horizontal scale"], distractors: ["Transformation_Direction_Flip"], difficulty: 3 },
  { id: "func-domain-root", category: "mapping", operations: ["square root domain"], hiddenStructures: ["radicand nonnegative"], distractors: ["Square_Root_Domain_Trap"], difficulty: 2 },
  { id: "func-domain-log", category: "mapping", operations: ["log domain"], hiddenStructures: ["argument positive"], distractors: ["Log_Argument_Violation"], difficulty: 2 },
  { id: "func-range-quadratic", category: "mapping", operations: ["quadratic range"], hiddenStructures: ["vertex minimum"], distractors: ["Range_Codomain_Confusion"], difficulty: 3 },
  { id: "func-inverse-existence", category: "operations", operations: ["inverse existence"], hiddenStructures: ["one-to-one requirement"], distractors: ["Inverse_Existence_Check"], difficulty: 3 },
  { id: "func-piecewise-continuity", category: "mapping", operations: ["piecewise parameter"], hiddenStructures: ["matching boundary values"], distractors: ["Domain_Boundary_Omission"], difficulty: 4 },
];

const categoryReasoning: Record<FunctionCategory, string[]> = {
  mapping: ["function-mapping", "domain-range"],
  types: ["function-type", "classification"],
  operations: ["function-operation", "composition"],
  special: ["special-function", "piecewise-behavior"],
  functional_equation: ["functional-equation", "pattern-inference"],
  graphs: ["graph-transformation", "visual-reasoning"],
};

export const functionsMotifs: QuantMotif[] =
  functionsProceduralMotifs.map((motif) =>
    defineQuantMotif({
      id: motif.id,
      topicCluster: "functions",
      reasoningCategories:
        categoryReasoning[motif.category],
      preferredOperations: motif.operations,
      compatibleTopics: [
        "functions",
        "mappings",
        "algebra",
      ],
      compatiblePatternTypes: ["formula"],
      supportedReasoningTypes: [
        "symbolic",
        "conditional",
        "multi-step",
      ],
      requiredReasoningCapabilities: [
        motif.difficulty >= 3
          ? "multi-step"
          : "direct",
        "symbolic",
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
        balanced: 0.5,
        inferenceHeavy:
          motif.difficulty >= 3 ? 0.55 : 0.2,
      },
      examWeights: {
        ssc: motif.difficulty <= 2 ? 0.45 : 0.2,
        ibps: 0.25,
        cat: motif.difficulty >= 3 ? 0.9 : 0.55,
      },
      isActive: true,
      version: 1,
      source: "examtree-functions-knowledge-layer",
    }),
  );
