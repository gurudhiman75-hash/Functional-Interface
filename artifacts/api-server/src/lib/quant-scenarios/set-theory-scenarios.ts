import type {
  DifficultyLabel,
  OptionMetadata,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import type {
  QuantScenarioContext,
} from "../quant/realization";
import {
  createReasoningStep,
  pickRandomItem,
} from "../shared";
import type { QuantProceduralScenario } from "./time-work-scenarios";

type SetTheoryDefinition = {
  motifId: string;
  branch: string;
  text: string;
  values: Record<string, number>;
  answer: number;
  answerLabel: string;
  formula: string;
  steps: Array<[Parameters<typeof createReasoningStep>[0], string]>;
  distractors: Array<{
    value: number;
    label: string;
    trap: string;
  }>;
};

type SetTheoryScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

const SET_CONTEXT: QuantScenarioContext = {
  entity: "set system",
  metric: "cardinality or membership result",
  context: "set-theory",
};

function optionValue(label: string) {
  return `$${label}$`;
}

function structuralSignature(
  motifId: string,
  branch: string,
  values: Record<string, number>,
) {
  return `${motifId}::${branch}::${Object.values(values).join("|")}`;
}

function buildOptions(
  definition: SetTheoryDefinition,
) {
  const seen = new Set<string>();
  const entries = [
    {
      value: definition.answer,
      label: definition.answerLabel,
      trap: "correct",
      isCorrect: true,
    },
    ...definition.distractors.map(
      (entry) => ({
        ...entry,
        isCorrect: false,
      }),
    ),
  ].filter((entry) => {
    if (seen.has(entry.label)) {
      return false;
    }
    seen.add(entry.label);
    return true;
  });

  for (const label of [
    "0",
    "1",
    "2",
    "\\emptyset",
    "A\\cup B",
  ]) {
    if (entries.length >= 4) {
      break;
    }
    if (!seen.has(label)) {
      seen.add(label);
      entries.push({
        value: Number.NaN,
        label,
        trap: "High_Plausibility",
        isCorrect: false,
      });
    }
  }

  const values = entries.slice(0, 4);
  const optionMetadata: OptionMetadata[] =
    values.map((entry, index) => ({
      value: optionValue(entry.label),
      isCorrect: index === 0,
      distractorType:
        index === 0
          ? "correct"
          : "wrongIntermediateValue",
      likelyMistake:
        index === 0
          ? "Correct set membership path"
          : entry.trap,
      reasoningTrap:
        index === 0 ? "None" : entry.trap,
    }));

  return {
    options: values.map((entry) =>
      optionValue(entry.label),
    ),
    correct: 0,
    optionMetadata,
  };
}

function finalizeSetTheoryScenario(
  definition: SetTheoryDefinition,
): QuantProceduralScenario {
  const explanation = [
    ...definition.steps.map(([, text]) => text),
    `Final answer = $${definition.answerLabel}$.`,
  ].join("\n");

  return {
    scenarioType: definition.motifId,
    topicCluster: "set-theory",
    values: definition.values,
    formula: definition.formula,
    text: definition.text,
    correctAnswer: definition.answer,
    reasoningSteps: definition.steps.map(
      ([type, text]) =>
        createReasoningStep(type, text),
    ),
    explanation,
    context: SET_CONTEXT,
    motifId: definition.motifId,
    scenarioLogicBranch:
      definition.branch,
    structuralSignature:
      structuralSignature(
        definition.motifId,
        definition.branch,
        definition.values,
      ),
    customOptionBundle:
      buildOptions(definition),
    distractorHints:
      definition.distractors.map(
        (entry) => entry.trap,
      ),
    validationTokens: undefined,
  };
}

function createSetTheoryDefinition(
  motifId: string,
): SetTheoryDefinition {
  switch (motifId) {
    case "set-def-id":
      return {
        motifId,
        branch: "null-set-code",
        text: `Let $A=\\{x:x\\in\\mathbb{N},\\ x<1\\}$. Use $0$ if $A$ is a null set and $1$ otherwise.`,
        values: { answer: 0 },
        answer: 0,
        answerLabel: "0",
        formula: "A=empty",
        steps: [
          ["conditional", `No natural number is less than $1$ in this convention.`],
          ["direct", `So $A=\\emptyset$, hence the null-set code is $0$.`],
        ],
        distractors: [
          { value: 1, label: "1", trap: "Empty_Set_Cardinality" },
          { value: 2, label: "2", trap: "Membership_vs_Inclusion" },
          { value: -1, label: "-1", trap: "Universal_Set_Trap" },
        ],
      };

    case "set-subsets-count":
      return {
        motifId,
        branch: "proper-subset-count",
        text: `If $A$ has $5$ elements, find the number of proper subsets of $A$.`,
        values: { n: 5 },
        answer: 31,
        answerLabel: "31",
        formula: "2^n-1",
        steps: [
          ["conditional", `A set with $n$ elements has $2^n$ subsets.`],
          ["direct", `Proper subsets $=2^5-1=32-1=31$.`],
        ],
        distractors: [
          { value: 32, label: "32", trap: "Subset_Proper_Confusion" },
          { value: 10, label: "10", trap: "Cartesian_Sum_Linear" },
          { value: 5, label: "5", trap: "Element_Count_As_Subset_Count" },
        ],
      };

    case "set-power-set":
      return {
        motifId,
        branch: "power-set-cardinality",
        text: `If $A=\\{a,b,c\\}$, find $n(P(A))$.`,
        values: { n: 3 },
        answer: 8,
        answerLabel: "8",
        formula: "n(P(A))=2^n",
        steps: [
          ["conditional", `The power set $P(A)$ contains all subsets of $A$.`],
          ["direct", `Since $n(A)=3$, $n(P(A))=2^3=8$.`],
        ],
        distractors: [
          { value: 7, label: "7", trap: "Power_Set_Element_Trap" },
          { value: 3, label: "3", trap: "Element_Count_As_Subset_Count" },
          { value: 6, label: "6", trap: "Cartesian_Sum_Linear" },
        ],
      };

    case "set-membership":
      return {
        motifId,
        branch: "membership-through-subset",
        text: `If $3\\in A$ and $A\\subset B$, use $1$ if $3\\in B$ must be true and $0$ otherwise.`,
        values: { answer: 1 },
        answer: 1,
        answerLabel: "1",
        formula: "x in A and A subset B implies x in B",
        steps: [
          ["conditional", `$A\\subset B$ means every element of $A$ is also an element of $B$.`],
          ["direct", `Since $3\\in A$, it follows that $3\\in B$.`],
        ],
        distractors: [
          { value: 0, label: "0", trap: "Membership_vs_Inclusion" },
          { value: 3, label: "3", trap: "Element_As_Code" },
          { value: 2, label: "2", trap: "Subset_Proper_Confusion" },
        ],
      };

    case "set-empty-cardinality":
      return {
        motifId,
        branch: "empty-cardinality",
        text: `Find $n(\\emptyset)$.`,
        values: { answer: 0 },
        answer: 0,
        answerLabel: "0",
        formula: "n(empty)=0",
        steps: [
          ["direct", `The empty set $\\emptyset$ contains no elements.`],
          ["direct", `Therefore $n(\\emptyset)=0$.`],
        ],
        distractors: [
          { value: 1, label: "1", trap: "Empty_Set_Cardinality" },
          { value: -1, label: "-1", trap: "Null_Set_Misread" },
          { value: 2, label: "2", trap: "Power_Set_Element_Trap" },
        ],
      };

    case "set-op-union":
      return {
        motifId,
        branch: "finite-union",
        text: `If $A=\\{1,2,3\\}$ and $B=\\{3,4,5\\}$, find $A\\cup B$.`,
        values: { answer: 5 },
        answer: 5,
        answerLabel: "\\{1,2,3,4,5\\}",
        formula: "union unique elements",
        steps: [
          ["direct", `$A\\cup B$ contains elements that are in $A$ or in $B$.`],
          ["direct", `Combining unique elements gives $\\{1,2,3,4,5\\}$.`],
        ],
        distractors: [
          { value: 1, label: "\\{3\\}", trap: "Intersection_Inversion" },
          { value: 6, label: "\\{1,2,3,3,4,5\\}", trap: "Union_Sum_Trap" },
          { value: 4, label: "\\{1,2,4,5\\}", trap: "Symmetric_Diff_Intersection" },
        ],
      };

    case "set-op-intersection":
      return {
        motifId,
        branch: "finite-intersection",
        text: `If $A=\\{2,4,6,8\\}$ and $B=\\{1,2,3,4\\}$, find $A\\cap B$.`,
        values: { answer: 2 },
        answer: 2,
        answerLabel: "\\{2,4\\}",
        formula: "common elements",
        steps: [
          ["direct", `$A\\cap B$ contains only common elements.`],
          ["direct", `The common elements are $2$ and $4$, so $A\\cap B=\\{2,4\\}$.`],
        ],
        distractors: [
          { value: 6, label: "\\{1,2,3,4,6,8\\}", trap: "Intersection_Inversion" },
          { value: 4, label: "\\{6,8\\}", trap: "Difference_Order_Error" },
          { value: 0, label: "\\emptyset", trap: "Disjoint_Assumption" },
        ],
      };

    case "set-op-difference":
      return {
        motifId,
        branch: "ordered-difference",
        text: `If $A=\\{1,2,3,4\\}$ and $B=\\{3,4,5\\}$, find $A-B$.`,
        values: { answer: 2 },
        answer: 2,
        answerLabel: "\\{1,2\\}",
        formula: "A minus B",
        steps: [
          ["conditional", `$A-B$ means elements in $A$ but not in $B$.`],
          ["direct", `Removing $3$ and $4$ from $A$ leaves $\\{1,2\\}$.`],
        ],
        distractors: [
          { value: 1, label: "\\{5\\}", trap: "Difference_Order_Error" },
          { value: 2, label: "\\{3,4\\}", trap: "Intersection_Inversion" },
          { value: 5, label: "\\{1,2,3,4,5\\}", trap: "Union_Sum_Trap" },
        ],
      };

    case "set-op-complement":
      return {
        motifId,
        branch: "universal-complement",
        text: `Let $U=\\{1,2,3,4,5,6\\}$ and $A=\\{2,4,6\\}$. Find $A^c$.`,
        values: { answer: 3 },
        answer: 3,
        answerLabel: "\\{1,3,5\\}",
        formula: "U-A",
        steps: [
          ["conditional", `$A^c$ means elements of $U$ that are not in $A$.`],
          ["direct", `So $A^c=\\{1,3,5\\}$.`],
        ],
        distractors: [
          { value: 3, label: "\\{2,4,6\\}", trap: "Complement_Universal_Neglect" },
          { value: 6, label: "U", trap: "Universal_Set_Trap" },
          { value: 0, label: "\\emptyset", trap: "Disjoint_Assumption" },
        ],
      };

    case "set-op-sym-diff":
    case "set-sym-diff-cardinality":
      return {
        motifId,
        branch: "symmetric-difference",
        text: `If $A=\\{1,2,3\\}$ and $B=\\{3,4,5\\}$, find $n(A\\Delta B)$.`,
        values: { nA: 3, nB: 3, nInter: 1 },
        answer: 4,
        answerLabel: "4",
        formula: "n(A Delta B)=n(A)+n(B)-2n(A cap B)",
        steps: [
          ["conditional", `$A\\Delta B=(A-B)\\cup(B-A)$, so common elements are excluded.`],
          ["direct", `Here $A\\Delta B=\\{1,2,4,5\\}$, hence $n(A\\Delta B)=4$.`],
        ],
        distractors: [
          { value: 5, label: "5", trap: "Symmetric_Diff_Intersection" },
          { value: 1, label: "1", trap: "Intersection_Inversion" },
          { value: 6, label: "6", trap: "Union_Sum_Trap" },
        ],
      };

    case "set-op-disjoint-union":
      return {
        motifId,
        branch: "disjoint-union-count",
        text: `If $A\\cap B=\\emptyset$, $n(A)=7$, and $n(B)=5$, find $n(A\\cup B)$.`,
        values: { a: 7, b: 5 },
        answer: 12,
        answerLabel: "12",
        formula: "n(A)+n(B)",
        steps: [
          ["conditional", `For disjoint sets, $n(A\\cap B)=0$.`],
          ["direct", `So $n(A\\cup B)=7+5=12$.`],
        ],
        distractors: [
          { value: 7, label: "7", trap: "Only_vs_Total" },
          { value: 5, label: "5", trap: "Intersection_Inversion" },
          { value: 2, label: "2", trap: "Difference_Order_Error" },
        ],
      };

    case "set-venn-2-basic":
      return {
        motifId,
        branch: "two-set-union-cardinality",
        text: `In a survey, $n(A)=45$, $n(B)=35$, and $n(A\\cap B)=15$. Find $n(A\\cup B)$.`,
        values: { a: 45, b: 35, inter: 15 },
        answer: 65,
        answerLabel: "65",
        formula: "n(A union B)=n(A)+n(B)-n(A cap B)",
        steps: [
          ["conditional", `Use $n(A\\cup B)=n(A)+n(B)-n(A\\cap B)$.`],
          ["direct", `So $n(A\\cup B)=45+35-15=65$.`],
        ],
        distractors: [
          { value: 80, label: "80", trap: "Union_Sum_Trap" },
          { value: 15, label: "15", trap: "Intersection_Inversion" },
          { value: 20, label: "20", trap: "Only_vs_Total" },
        ],
      };

    case "set-venn-2-only":
      return {
        motifId,
        branch: "only-a",
        text: `In a class, $n(A)=45$ students like Math and $n(A\\cap B)=15$ like both Math and Physics. Find the number who like only Math.`,
        values: { a: 45, inter: 15 },
        answer: 30,
        answerLabel: "30",
        formula: "only A = n(A)-n(A cap B)",
        steps: [
          ["conditional", `Only $A$ means members in $A$ after removing the overlap.`],
          ["direct", `Only Math $=45-15=30$.`],
        ],
        distractors: [
          { value: 45, label: "45", trap: "Only_vs_Total" },
          { value: 15, label: "15", trap: "Intersection_Inversion" },
          { value: 60, label: "60", trap: "Union_Sum_Trap" },
        ],
      };

    case "set-venn-2-max-min":
      return {
        motifId,
        branch: "intersection-minimum",
        text: `In a group of $100$, $n(A)=70$ and $n(B)=50$. What is the minimum possible value of $n(A\\cap B)$?`,
        values: { total: 100, a: 70, b: 50 },
        answer: 20,
        answerLabel: "20",
        formula: "max(0,a+b-total)",
        steps: [
          ["conditional", `Minimum overlap is $\\max(0,n(A)+n(B)-n(U))$.`],
          ["direct", `So minimum $n(A\\cap B)=70+50-100=20$.`],
        ],
        distractors: [
          { value: 50, label: "50", trap: "Max_Min_Boundary_Flip" },
          { value: 0, label: "0", trap: "Disjoint_Assumption" },
          { value: 120, label: "120", trap: "Cardinality_Overflow" },
        ],
      };

    case "set-venn-2-neither":
      return {
        motifId,
        branch: "neither-two-set",
        text: `Out of $100$ people, $45$ like tea, $35$ like coffee, and $15$ like both. Find the number who like neither.`,
        values: { total: 100, a: 45, b: 35, inter: 15 },
        answer: 35,
        answerLabel: "35",
        formula: "total - union",
        steps: [
          ["direct", `$n(T\\cup C)=45+35-15=65$.`],
          ["direct", `Neither $=100-65=35$.`],
        ],
        distractors: [
          { value: 65, label: "65", trap: "None_Region_Omission" },
          { value: 20, label: "20", trap: "Only_vs_Total" },
          { value: 15, label: "15", trap: "Intersection_Inversion" },
        ],
      };

    case "set-venn-2-percent":
      return {
        motifId,
        branch: "percent-same-base",
        text: `In a survey of $200$ people, $60\\%$ read newspaper $A$, $45\\%$ read newspaper $B$, and $25\\%$ read both. Find $n(A\\cup B)$.`,
        values: { total: 200 },
        answer: 160,
        answerLabel: "160",
        formula: "(60+45-25)% of total",
        steps: [
          ["conditional", `All percentages use the same base $200$.`],
          ["direct", `$n(A\\cup B)=(60+45-25)\\%$ of $200=80\\%$ of $200=160$.`],
        ],
        distractors: [
          { value: 210, label: "210", trap: "Percentage_Base_Error" },
          { value: 120, label: "120", trap: "Intersection_Inversion" },
          { value: 80, label: "80", trap: "Percent_As_Count" },
        ],
      };

    case "set-venn-3-basic":
      return {
        motifId,
        branch: "three-set-union",
        text: `If $n(A)=40$, $n(B)=35$, $n(C)=30$, $n(A\\cap B)=15$, $n(B\\cap C)=10$, $n(C\\cap A)=12$, and $n(A\\cap B\\cap C)=5$, find $n(A\\cup B\\cup C)$.`,
        values: { a: 40, b: 35, c: 30, ab: 15, bc: 10, ca: 12, abc: 5 },
        answer: 73,
        answerLabel: "73",
        formula: "A+B+C-pairs+triple",
        steps: [
          ["conditional", `Use $n(A\\cup B\\cup C)=n(A)+n(B)+n(C)-n(A\\cap B)-n(B\\cap C)-n(C\\cap A)+n(A\\cap B\\cap C)$.`],
          ["direct", `Union $=40+35+30-15-10-12+5=73$.`],
        ],
        distractors: [
          { value: 68, label: "68", trap: "Three_Set_Double_Subtraction" },
          { value: 105, label: "105", trap: "Union_Sum_Trap" },
          { value: 37, label: "37", trap: "Intersection_Inversion" },
        ],
      };

    case "set-venn-3-exactly-k":
      return {
        motifId,
        branch: "exactly-two",
        text: `If $n(A\\cap B)=15$, $n(B\\cap C)=10$, $n(C\\cap A)=12$, and $n(A\\cap B\\cap C)=5$, find the number belonging to exactly two sets.`,
        values: { ab: 15, bc: 10, ca: 12, abc: 5 },
        answer: 22,
        answerLabel: "22",
        formula: "ab+bc+ca-3abc",
        steps: [
          ["conditional", `Each pairwise intersection includes the triple region.`],
          ["direct", `Exactly two $=(15+10+12)-3(5)=37-15=22$.`],
        ],
        distractors: [
          { value: 37, label: "37", trap: "Exactly_k_Intersection_Mixup" },
          { value: 27, label: "27", trap: "At_Least_Exactly_Swap" },
          { value: 15, label: "15", trap: "Intersection_Inversion" },
        ],
      };

    case "set-venn-3-at-least":
      return {
        motifId,
        branch: "at-least-two",
        text: `If $n(A\\cap B)=15$, $n(B\\cap C)=10$, $n(C\\cap A)=12$, and $n(A\\cap B\\cap C)=5$, find the number belonging to at least two sets.`,
        values: { ab: 15, bc: 10, ca: 12, abc: 5 },
        answer: 27,
        answerLabel: "27",
        formula: "ab+bc+ca-2abc",
        steps: [
          ["conditional", `At least two $=$ exactly two plus all three.`],
          ["direct", `At least two $=(15+10+12)-2(5)=37-10=27$.`],
        ],
        distractors: [
          { value: 22, label: "22", trap: "At_Least_Exactly_Swap" },
          { value: 37, label: "37", trap: "Exactly_k_Intersection_Mixup" },
          { value: 5, label: "5", trap: "Intersection_Inversion" },
        ],
      };

    case "set-venn-3-none":
      return {
        motifId,
        branch: "none-three-set",
        text: `In a group of $100$, $n(A\\cup B\\cup C)=73$. Find the number outside all three sets.`,
        values: { total: 100, union: 73 },
        answer: 27,
        answerLabel: "27",
        formula: "total-union",
        steps: [
          ["direct", `Outside all three $=n(U)-n(A\\cup B\\cup C)$.`],
          ["direct", `So outside count $=100-73=27$.`],
        ],
        distractors: [
          { value: 73, label: "73", trap: "None_Region_Omission" },
          { value: 100, label: "100", trap: "Complement_Universal_Neglect" },
          { value: 37, label: "37", trap: "Three_Set_Double_Subtraction" },
        ],
      };

    case "set-venn-3-only-one":
    case "set-venn-3-region-fill":
      return {
        motifId,
        branch: "exactly-one",
        text: `Suppose $n(A)=40$, $n(B)=35$, $n(C)=30$, pairwise intersections are $15,10,12$, and $n(A\\cap B\\cap C)=5$. Find the number belonging to exactly one set.`,
        values: { a: 40, b: 35, c: 30 },
        answer: 46,
        answerLabel: "46",
        formula: "union - atLeast2",
        steps: [
          ["direct", `Union $=40+35+30-15-10-12+5=73$.`],
          ["direct", `At least two $=15+10+12-2(5)=27$.`],
          ["direct", `Exactly one $=73-27=46$. Equivalently, exclusive singles are $(40-15-12+5)+(35-15-10+5)+(30-10-12+5)=18+15+13=46$.`],
        ],
        distractors: [
          { value: 73, label: "73", trap: "Only_vs_Total" },
          { value: 27, label: "27", trap: "At_Least_Exactly_Swap" },
          { value: 37, label: "37", trap: "Exactly_k_Intersection_Mixup" },
        ],
      };

    case "set-alg-de-morgan":
      return {
        motifId,
        branch: "de-morgan-union",
        text: `Which expression is equal to $(A\\cup B)'$? Use $1$ for $A'\\cap B'$ and $2$ for $A'\\cup B'$.`,
        values: { answer: 1 },
        answer: 1,
        answerLabel: "1",
        formula: "(A union B)' = A' cap B'",
        steps: [
          ["conditional", `By De Morgan's law, complement changes union into intersection.`],
          ["direct", `So $(A\\cup B)'=A'\\cap B'$, represented by $1$.`],
        ],
        distractors: [
          { value: 2, label: "2", trap: "De_Morgan_Sign_Swap" },
          { value: 0, label: "0", trap: "Complement_Universal_Neglect" },
          { value: 3, label: "3", trap: "Intersection_Inversion" },
        ],
      };

    case "set-alg-distributive":
      return {
        motifId,
        branch: "distributive-code",
        text: `Use $1$ if $A\\cap(B\\cup C)=(A\\cap B)\\cup(A\\cap C)$ is true for all sets, otherwise use $0$.`,
        values: { answer: 1 },
        answer: 1,
        answerLabel: "1",
        formula: "intersection distributes over union",
        steps: [
          ["conditional", `Intersection distributes over union in set algebra.`],
          ["direct", `Therefore the identity is true for all sets.`],
        ],
        distractors: [
          { value: 0, label: "0", trap: "Intersection_Inversion" },
          { value: 2, label: "2", trap: "De_Morgan_Sign_Swap" },
          { value: -1, label: "-1", trap: "Difference_Order_Error" },
        ],
      };

    case "set-cartesian-prod":
      return {
        motifId,
        branch: "cartesian-cardinality",
        text: `If $n(A)=4$ and $n(B)=5$, find $n(A\\times B)$.`,
        values: { a: 4, b: 5 },
        answer: 20,
        answerLabel: "20",
        formula: "n(AxB)=n(A)n(B)",
        steps: [
          ["conditional", `A Cartesian product contains ordered pairs.`],
          ["direct", `So $n(A\\times B)=n(A)\\cdot n(B)=4\\cdot5=20$.`],
        ],
        distractors: [
          { value: 9, label: "9", trap: "Cartesian_Sum_Linear" },
          { value: 16, label: "16", trap: "Power_Set_Element_Trap" },
          { value: 1, label: "1", trap: "Intersection_Inversion" },
        ],
      };

    case "set-cartesian-list":
      return {
        motifId,
        branch: "cartesian-list-count",
        text: `If $A=\\{1,2\\}$ and $B=\\{a,b,c\\}$, find $n(A\\times B)$.`,
        values: { a: 2, b: 3 },
        answer: 6,
        answerLabel: "6",
        formula: "2*3",
        steps: [
          ["direct", `Each of $2$ elements of $A$ pairs with each of $3$ elements of $B$.`],
          ["direct", `Hence $n(A\\times B)=2\\cdot3=6$.`],
        ],
        distractors: [
          { value: 5, label: "5", trap: "Cartesian_Sum_Linear" },
          { value: 3, label: "3", trap: "Only_vs_Total" },
          { value: 2, label: "2", trap: "Only_vs_Total" },
        ],
      };

    case "set-cardinality-identity":
      return {
        motifId,
        branch: "find-intersection",
        text: `If $n(A)=30$, $n(B)=25$, and $n(A\\cup B)=40$, find $n(A\\cap B)$.`,
        values: { a: 30, b: 25, union: 40 },
        answer: 15,
        answerLabel: "15",
        formula: "intersection=A+B-union",
        steps: [
          ["conditional", `$n(A\\cup B)=n(A)+n(B)-n(A\\cap B)$.`],
          ["direct", `So $n(A\\cap B)=30+25-40=15$.`],
        ],
        distractors: [
          { value: 55, label: "55", trap: "Union_Sum_Trap" },
          { value: 40, label: "40", trap: "Intersection_Inversion" },
          { value: 10, label: "10", trap: "Only_vs_Total" },
        ],
      };

    case "set-relation-reflexive":
      return {
        motifId,
        branch: "reflexive-missing-pair",
        text: `On $A=\\{1,2\\}$, relation $R=\\{(1,1),(1,2),(2,2)\\}$. Use $1$ if $R$ is reflexive and $0$ otherwise.`,
        values: { answer: 1 },
        answer: 1,
        answerLabel: "1",
        formula: "(a,a) for every a",
        steps: [
          ["conditional", `A relation is reflexive if $(a,a)\\in R$ for every $a\\in A$.`],
          ["direct", `Both $(1,1)$ and $(2,2)$ are present, so $R$ is reflexive.`],
        ],
        distractors: [
          { value: 0, label: "0", trap: "Membership_vs_Inclusion" },
          { value: 2, label: "2", trap: "Pair_Count_Trap" },
          { value: 3, label: "3", trap: "Cardinality_Overflow" },
        ],
      };

    case "set-relation-symmetric":
      return {
        motifId,
        branch: "symmetric-pair-check",
        text: `On $A=\\{1,2\\}$, relation $R=\\{(1,2),(2,1)\\}$. Use $1$ if $R$ is symmetric and $0$ otherwise.`,
        values: { answer: 1 },
        answer: 1,
        answerLabel: "1",
        formula: "(a,b) implies (b,a)",
        steps: [
          ["conditional", `A relation is symmetric if $(a,b)\\in R$ implies $(b,a)\\in R$.`],
          ["direct", `Since $(1,2)$ and $(2,1)$ are both present, $R$ is symmetric.`],
        ],
        distractors: [
          { value: 0, label: "0", trap: "Membership_vs_Inclusion" },
          { value: 2, label: "2", trap: "Pair_Count_Trap" },
          { value: -1, label: "-1", trap: "Transitive_Trap" },
        ],
      };

    case "set-relation-transitive":
    case "set-relation-equivalence":
      return {
        motifId,
        branch: "transitive-chain-check",
        text: `On $A=\\{1,2,3\\}$, relation $R=\\{(1,2),(2,3),(1,3)\\}$. Use $1$ if the shown chain satisfies transitivity and $0$ otherwise.`,
        values: { answer: 1 },
        answer: 1,
        answerLabel: "1",
        formula: "(a,b),(b,c) imply (a,c)",
        steps: [
          ["conditional", `Transitivity requires $(1,2)$ and $(2,3)$ to imply $(1,3)$.`],
          ["direct", `The pair $(1,3)$ is present, so the shown chain satisfies transitivity.`],
        ],
        distractors: [
          { value: 0, label: "0", trap: "Membership_vs_Inclusion" },
          { value: 3, label: "3", trap: "Pair_Count_Trap" },
          { value: 2, label: "2", trap: "Symmetric_Trap" },
        ],
      };

    case "set-partition-count":
      return {
        motifId,
        branch: "partition-check",
        text: `Let $U=\\{1,2,3,4\\}$, $A=\\{1,2\\}$, and $B=\\{3,4\\}$. Use $1$ if $\\{A,B\\}$ is a partition of $U$, otherwise use $0$.`,
        values: { answer: 1 },
        answer: 1,
        answerLabel: "1",
        formula: "disjoint and exhaustive",
        steps: [
          ["conditional", `A partition must be nonempty, disjoint, and exhaustive.`],
          ["direct", `$A\\cap B=\\emptyset$ and $A\\cup B=U$, so it is a partition.`],
        ],
        distractors: [
          { value: 0, label: "0", trap: "Disjoint_Assumption" },
          { value: 2, label: "2", trap: "Subset_Proper_Confusion" },
          { value: 4, label: "4", trap: "Element_Count_As_Answer" },
        ],
      };

    case "set-interval-union":
      return {
        motifId,
        branch: "interval-union",
        text: `If $A=[1,5]$ and $B=[3,8]$, find $A\\cup B$.`,
        values: { answer: 0 },
        answer: 0,
        answerLabel: "[1,8]",
        formula: "number line union",
        steps: [
          ["conditional", `The intervals overlap from $3$ to $5$.`],
          ["direct", `Their union covers continuously from $1$ to $8$, so $A\\cup B=[1,8]$.`],
        ],
        distractors: [
          { value: 0, label: "[3,5]", trap: "Intersection_Inversion" },
          { value: 0, label: "[1,3]\\cup[5,8]", trap: "Symmetric_Diff_Intersection" },
          { value: 0, label: "[5,8]", trap: "Difference_Order_Error" },
        ],
      };

    case "set-interval-intersection":
      return {
        motifId,
        branch: "interval-intersection",
        text: `If $A=[1,5]$ and $B=[3,8]$, find $A\\cap B$.`,
        values: { answer: 0 },
        answer: 0,
        answerLabel: "[3,5]",
        formula: "common interval",
        steps: [
          ["conditional", `The intersection is the part common to both intervals.`],
          ["direct", `The common region is from $3$ to $5$, so $A\\cap B=[3,5]$.`],
        ],
        distractors: [
          { value: 0, label: "[1,8]", trap: "Intersection_Inversion" },
          { value: 0, label: "[1,3]", trap: "Difference_Order_Error" },
          { value: 0, label: "\\emptyset", trap: "Disjoint_Assumption" },
        ],
      };

    default:
      return createSetTheoryDefinition(
        "set-venn-2-basic",
      );
  }
}

function createScenarioFromMotif(
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) {
  const motifId =
    motif?.id ??
    (difficulty === "Hard"
      ? "set-venn-3-exactly-k"
      : "set-venn-2-basic");
  return finalizeSetTheoryScenario(
    createSetTheoryDefinition(motifId),
  );
}

const PATTERN_FACTORIES: Record<
  string,
  SetTheoryScenarioFactory[]
> = {
  "set-theory": [
    () => createScenarioFromMotif("Medium", { id: "set-subsets-count" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "set-op-union" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "set-venn-2-basic" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "set-venn-3-basic" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "set-cartesian-prod" } as QuantMotif),
  ],
  "set-theory-definitions": [
    () => createScenarioFromMotif("Easy", { id: "set-def-id" } as QuantMotif),
    () => createScenarioFromMotif("Easy", { id: "set-subsets-count" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "set-power-set" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "set-membership" } as QuantMotif),
  ],
  "set-theory-operations": [
    () => createScenarioFromMotif("Easy", { id: "set-op-union" } as QuantMotif),
    () => createScenarioFromMotif("Easy", { id: "set-op-intersection" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "set-op-difference" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "set-op-sym-diff" } as QuantMotif),
  ],
  "set-theory-venn-2": [
    () => createScenarioFromMotif("Medium", { id: "set-venn-2-basic" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "set-venn-2-only" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "set-venn-2-neither" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "set-venn-2-max-min" } as QuantMotif),
  ],
  "set-theory-venn-3": [
    () => createScenarioFromMotif("Hard", { id: "set-venn-3-basic" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "set-venn-3-exactly-k" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "set-venn-3-at-least" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "set-venn-3-none" } as QuantMotif),
  ],
  "set-theory-algebra-cartesian": [
    () => createScenarioFromMotif("Hard", { id: "set-alg-de-morgan" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "set-alg-distributive" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "set-cartesian-prod" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "set-cardinality-identity" } as QuantMotif),
  ],
  "set-theory-relations": [
    () => createScenarioFromMotif("Hard", { id: "set-relation-reflexive" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "set-relation-symmetric" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "set-relation-transitive" } as QuantMotif),
  ],
};

function resolveSetTheoryPatternKey(
  pattern: Pattern,
) {
  if (pattern.id.startsWith("registry-")) {
    return pattern.id
      .replace(/^registry-/i, "")
      .replace(
        /-(easy|medium|hard)$/i,
        "",
      );
  }

  return pattern.id;
}

export function createSetTheoryScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const patternKey =
    resolveSetTheoryPatternKey(pattern);

  if (motif?.id) {
    return createScenarioFromMotif(
      difficulty,
      motif,
    );
  }

  const factories =
    PATTERN_FACTORIES[patternKey] ??
    PATTERN_FACTORIES[pattern.id] ??
    PATTERN_FACTORIES[pattern.subtopic] ??
    PATTERN_FACTORIES[pattern.topic] ??
    PATTERN_FACTORIES["set-theory"];

  return pickRandomItem(factories)(
    difficulty,
    motif,
  );
}
