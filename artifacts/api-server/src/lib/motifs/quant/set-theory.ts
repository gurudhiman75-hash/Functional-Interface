import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type SetTheoryCategory =
  | "definitions"
  | "operations"
  | "venn_2"
  | "venn_3"
  | "algebraic_cardinality"
  | "relations";

type SetTheoryMotifDraft = {
  id: string;
  category: SetTheoryCategory;
  operations: string[];
  hiddenStructures: string[];
  distractors: string[];
  difficulty: 1 | 2 | 3 | 4;
};

export const setTheoryScopeMap = {
  chapter: "Set Theory",
  coreDomains: [
    "Set definitions and types",
    "Subsets and power sets",
    "Membership and inclusion",
    "Union, intersection, difference, complement",
    "Symmetric difference",
    "Two-set Venn cardinality",
    "Three-set Venn cardinality",
    "De Morgan and distributive laws",
    "Cartesian products",
    "Relations and properties",
  ],
} as const;

export const setTheoryDistractorRegistry = [
  "Union_Sum_Trap",
  "Subset_Proper_Confusion",
  "Intersection_Inversion",
  "Only_vs_Total",
  "Complement_Universal_Neglect",
  "Symmetric_Diff_Intersection",
  "Three_Set_Double_Subtraction",
  "None_Region_Omission",
  "Max_Min_Boundary_Flip",
  "De_Morgan_Sign_Swap",
  "Empty_Set_Cardinality",
  "Power_Set_Element_Trap",
  "Difference_Order_Error",
  "Exactly_k_Intersection_Mixup",
  "Cartesian_Sum_Linear",
  "At_Least_Exactly_Swap",
  "Cardinality_Overflow",
  "Membership_vs_Inclusion",
  "Disjoint_Assumption",
  "Percentage_Base_Error",
] as const;

export const setTheoryProceduralMotifs: SetTheoryMotifDraft[] = [
  { id: "set-def-id", category: "definitions", operations: ["set type classification"], hiddenStructures: ["cardinality category"], distractors: ["Empty_Set_Cardinality"], difficulty: 1 },
  { id: "set-subsets-count", category: "definitions", operations: ["subset counting"], hiddenStructures: ["binary include exclude choice"], distractors: ["Subset_Proper_Confusion"], difficulty: 1 },
  { id: "set-power-set", category: "definitions", operations: ["power set cardinality"], hiddenStructures: ["set of all subsets"], distractors: ["Power_Set_Element_Trap"], difficulty: 2 },
  { id: "set-membership", category: "definitions", operations: ["membership implication"], hiddenStructures: ["element versus subset"], distractors: ["Membership_vs_Inclusion"], difficulty: 2 },
  { id: "set-empty-cardinality", category: "definitions", operations: ["empty set cardinality"], hiddenStructures: ["empty set has zero elements"], distractors: ["Empty_Set_Cardinality"], difficulty: 1 },
  { id: "set-op-union", category: "operations", operations: ["union"], hiddenStructures: ["unique combined membership"], distractors: ["Union_Sum_Trap"], difficulty: 1 },
  { id: "set-op-intersection", category: "operations", operations: ["intersection"], hiddenStructures: ["common membership"], distractors: ["Intersection_Inversion"], difficulty: 1 },
  { id: "set-op-difference", category: "operations", operations: ["set difference"], hiddenStructures: ["order-sensitive exclusion"], distractors: ["Difference_Order_Error"], difficulty: 2 },
  { id: "set-op-complement", category: "operations", operations: ["complement"], hiddenStructures: ["universal boundary"], distractors: ["Complement_Universal_Neglect"], difficulty: 2 },
  { id: "set-op-sym-diff", category: "operations", operations: ["symmetric difference"], hiddenStructures: ["union excluding intersection"], distractors: ["Symmetric_Diff_Intersection"], difficulty: 3 },
  { id: "set-op-disjoint-union", category: "operations", operations: ["disjoint union cardinality"], hiddenStructures: ["zero intersection condition"], distractors: ["Disjoint_Assumption"], difficulty: 2 },
  { id: "set-venn-2-basic", category: "venn_2", operations: ["two-set inclusion exclusion"], hiddenStructures: ["overlap subtract once"], distractors: ["Union_Sum_Trap"], difficulty: 1 },
  { id: "set-venn-2-only", category: "venn_2", operations: ["only A only B neither"], hiddenStructures: ["exclusive region"], distractors: ["Only_vs_Total"], difficulty: 2 },
  { id: "set-venn-2-max-min", category: "venn_2", operations: ["intersection bounds"], hiddenStructures: ["max min overlap constraints"], distractors: ["Max_Min_Boundary_Flip"], difficulty: 4 },
  { id: "set-venn-2-neither", category: "venn_2", operations: ["outside union"], hiddenStructures: ["total minus union"], distractors: ["None_Region_Omission"], difficulty: 2 },
  { id: "set-venn-2-percent", category: "venn_2", operations: ["percent-based set counts"], hiddenStructures: ["common base total"], distractors: ["Percentage_Base_Error"], difficulty: 3 },
  { id: "set-venn-3-basic", category: "venn_3", operations: ["three-set inclusion exclusion"], hiddenStructures: ["triple add-back"], distractors: ["Three_Set_Double_Subtraction"], difficulty: 3 },
  { id: "set-venn-3-exactly-k", category: "venn_3", operations: ["exactly two exactly one"], hiddenStructures: ["intersection contains triple"], distractors: ["Exactly_k_Intersection_Mixup"], difficulty: 4 },
  { id: "set-venn-3-at-least", category: "venn_3", operations: ["at least two categories"], hiddenStructures: ["exactly two plus triple"], distractors: ["At_Least_Exactly_Swap"], difficulty: 4 },
  { id: "set-venn-3-none", category: "venn_3", operations: ["outside all three"], hiddenStructures: ["total minus union"], distractors: ["None_Region_Omission"], difficulty: 3 },
  { id: "set-venn-3-only-one", category: "venn_3", operations: ["exactly one category"], hiddenStructures: ["subtract pair overlaps with triple correction"], distractors: ["Exactly_k_Intersection_Mixup"], difficulty: 4 },
  { id: "set-venn-3-region-fill", category: "venn_3", operations: ["region-state fill"], hiddenStructures: ["exclusive Venn state"], distractors: ["Cardinality_Overflow"], difficulty: 4 },
  { id: "set-alg-de-morgan", category: "algebraic_cardinality", operations: ["De Morgan law"], hiddenStructures: ["complement swaps operation"], distractors: ["De_Morgan_Sign_Swap"], difficulty: 3 },
  { id: "set-alg-distributive", category: "algebraic_cardinality", operations: ["set distributive law"], hiddenStructures: ["intersection distributes over union"], distractors: ["Intersection_Inversion"], difficulty: 3 },
  { id: "set-cartesian-prod", category: "algebraic_cardinality", operations: ["Cartesian product cardinality"], hiddenStructures: ["ordered pair multiplication"], distractors: ["Cartesian_Sum_Linear"], difficulty: 2 },
  { id: "set-cartesian-list", category: "algebraic_cardinality", operations: ["Cartesian product listing"], hiddenStructures: ["ordered pair enumeration"], distractors: ["Cartesian_Sum_Linear"], difficulty: 2 },
  { id: "set-cardinality-identity", category: "algebraic_cardinality", operations: ["cardinality identity"], hiddenStructures: ["inclusion exclusion rearrangement"], distractors: ["Intersection_Inversion"], difficulty: 3 },
  { id: "set-sym-diff-cardinality", category: "algebraic_cardinality", operations: ["symmetric difference cardinality"], hiddenStructures: ["union minus intersection"], distractors: ["Symmetric_Diff_Intersection"], difficulty: 3 },
  { id: "set-relation-reflexive", category: "relations", operations: ["reflexive relation check"], hiddenStructures: ["all self pairs required"], distractors: ["Membership_vs_Inclusion"], difficulty: 3 },
  { id: "set-relation-symmetric", category: "relations", operations: ["symmetric relation check"], hiddenStructures: ["reverse pair closure"], distractors: ["Membership_vs_Inclusion"], difficulty: 3 },
  { id: "set-relation-transitive", category: "relations", operations: ["transitive relation check"], hiddenStructures: ["chain pair implication"], distractors: ["Membership_vs_Inclusion"], difficulty: 4 },
  { id: "set-relation-equivalence", category: "relations", operations: ["equivalence relation"], hiddenStructures: ["reflexive symmetric transitive"], distractors: ["Membership_vs_Inclusion"], difficulty: 4 },
  { id: "set-partition-count", category: "algebraic_cardinality", operations: ["partition validation"], hiddenStructures: ["disjoint nonempty exhaustive subsets"], distractors: ["Disjoint_Assumption"], difficulty: 3 },
  { id: "set-interval-union", category: "operations", operations: ["interval union"], hiddenStructures: ["number line overlap"], distractors: ["Union_Sum_Trap"], difficulty: 3 },
  { id: "set-interval-intersection", category: "operations", operations: ["interval intersection"], hiddenStructures: ["common number-line region"], distractors: ["Intersection_Inversion"], difficulty: 3 },
];

const categoryReasoning: Record<SetTheoryCategory, string[]> = {
  definitions: ["set-definitions", "membership-logic"],
  operations: ["set-operations", "categorical-membership"],
  venn_2: ["two-set-venn", "exclusive-inclusive-regions"],
  venn_3: ["three-set-venn", "region-state-counting"],
  algebraic_cardinality: ["set-algebra", "cardinality-identities"],
  relations: ["relation-properties", "ordered-pair-logic"],
};

export const setTheoryMotifs: QuantMotif[] =
  setTheoryProceduralMotifs.map((motif) =>
    defineQuantMotif({
      id: motif.id,
      topicCluster: "set-theory",
      reasoningCategories: [
        ...categoryReasoning[motif.category],
        ...motif.hiddenStructures,
      ],
      preferredOperations: motif.operations,
      compatibleTopics: [
        "set-theory",
        "sets",
        "venn-diagrams",
        "relations",
      ],
      compatiblePatternTypes: ["formula", "logic"],
      supportedReasoningTypes: [
        "direct",
        "comparative",
        "conditional",
        "multi-step",
        "inferential",
        "symbolic",
      ],
      requiredReasoningCapabilities: [
        motif.difficulty >= 3
          ? "multi-step"
          : "direct",
        "symbolic",
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
        motif.difficulty >= 3
          ? "conditional"
          : "direct",
      reasoningDepthRange:
        motif.difficulty <= 2
          ? [1, 3]
          : motif.difficulty === 3
            ? [2, 4]
            : [3, 5],
      generationStrategy: [
        "categorical reasoning engine with inclusive and exclusive membership states",
      ],
      parameterRanges: {
        sets:
          "Prefer small finite sets with readable elements and clean cardinalities.",
        venn:
          "Ensure all exclusive Venn regions are nonnegative and totals are coherent.",
        relations:
          "Use small carrier sets so relation properties remain inspectable.",
      },
      validationRules: [
        "Render every set symbol, membership operator, subset sign, and cardinality notation using MathJax.",
        "For Venn problems, validate nonnegative exclusive regions and total >= union.",
        "Keep element membership distinct from subset inclusion.",
      ],
      diversityTags: [
        motif.category,
        motif.id,
      ],
      wordingBias: {
        concise: motif.difficulty <= 2 ? 0.35 : 0.15,
        balanced: 0.55,
        inferenceHeavy:
          motif.difficulty >= 3 ? 0.55 : 0.25,
      },
      examWeights: {
        ssc: motif.difficulty <= 2 ? 0.45 : 0.2,
        ibps: 0.2,
        cat: motif.difficulty >= 3 ? 0.75 : 0.45,
      },
      isActive: true,
      version: 1,
      source: "examtree-set-theory-knowledge-layer",
    }),
  );
