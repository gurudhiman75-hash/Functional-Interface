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

type FunctionDefinition = {
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

type FunctionsScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

const FUNCTIONS_CONTEXT: QuantScenarioContext = {
  entity: "function",
  metric: "value",
  context: "functions",
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
  definition: FunctionDefinition,
) {
  const seen = new Set<string>();
  const candidates = [
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

  const fallbackLabels = [
    "0",
    "1",
    "-1",
    "2",
    "\\mathbb{R}",
  ];
  for (const label of fallbackLabels) {
    if (candidates.length >= 4) {
      break;
    }
    if (!seen.has(label)) {
      seen.add(label);
      candidates.push({
        value: Number.NaN,
        label,
        trap: "High_Plausibility",
        isCorrect: false,
      });
    }
  }

  const values = candidates.slice(0, 4);
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
          ? "Correct function mapping path"
          : entry.trap,
      reasoningTrap:
        index === 0
          ? "None"
          : entry.trap,
    }));

  return {
    options: values.map((entry) =>
      optionValue(entry.label),
    ),
    correct: 0,
    optionMetadata,
  };
}

function finalizeFunctionsScenario(
  definition: FunctionDefinition,
): QuantProceduralScenario {
  const explanation = [
    ...definition.steps.map(([, text]) => text),
    `Final answer = $${definition.answerLabel}$.`,
  ].join("\n");

  return {
    scenarioType: definition.motifId,
    topicCluster: "functions",
    values: definition.values,
    formula: definition.formula,
    text: definition.text,
    correctAnswer: definition.answer,
    reasoningSteps: definition.steps.map(
      ([type, text]) =>
        createReasoningStep(type, text),
    ),
    explanation,
    context: FUNCTIONS_CONTEXT,
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

function createFunctionsDefinition(
  motifId: string,
): FunctionDefinition {
  switch (motifId) {
    case "func-def-id":
    case "func-map-many-one":
      return {
        motifId,
        branch: "one-output-per-input",
        text: `A relation maps $1\\to4$, $2\\to4$, $3\\to9$, and $4\\to16$. Use $1$ if this relation is a function and $0$ if it is not.`,
        values: { answer: 1 },
        answer: 1,
        answerLabel: "1",
        formula: "one output per input",
        steps: [
          ["direct", `A relation is a function if every input has exactly one output.`],
          ["conditional", `Here each of $1,2,3,4$ has one image, even though $1$ and $2$ share the output $4$.`],
          ["direct", `So the relation is a function, represented by $1$.`],
        ],
        distractors: [
          { value: 0, label: "0", trap: "Vertical_Line_Failure" },
          { value: 2, label: "2", trap: "Range_Codomain_Confusion" },
          { value: -1, label: "-1", trap: "Many_To_One_Rejection" },
        ],
      };

    case "func-domain-basic":
      return {
        motifId,
        branch: "rational-domain-exclusion",
        text: `Find the value excluded from the domain of $f(x)=\\frac{2x+1}{x-3}$, where $x\\in\\mathbb{R}$.`,
        values: { excluded: 3 },
        answer: 3,
        answerLabel: "3",
        formula: "x-3 != 0",
        steps: [
          ["conditional", `For $f(x)=\\frac{2x+1}{x-3}$, the denominator cannot be $0$.`],
          ["direct", `Set $x-3=0$, so $x=3$.`],
          ["direct", `Thus the domain is $\\mathbb{R}\\setminus\\{3\\}$, and the excluded value is $3$.`],
        ],
        distractors: [
          { value: -3, label: "-3", trap: "Domain_Boundary_Omission" },
          { value: -0.5, label: "-\\frac{1}{2}", trap: "Numerator_Zero_Trap" },
          { value: 0, label: "0", trap: "Range_Codomain_Confusion" },
        ],
      };

    case "func-domain-root":
      return {
        motifId,
        branch: "square-root-domain",
        text: `For $f(x)=\\sqrt{x-5}$, find the least integer value of $x$ in the domain.`,
        values: { lowerBound: 5 },
        answer: 5,
        answerLabel: "5",
        formula: "x-5 >= 0",
        steps: [
          ["conditional", `A square root function requires the radicand to be nonnegative.`],
          ["direct", `So $x-5\\ge0\\Rightarrow x\\ge5$.`],
          ["direct", `The least integer in the domain is $5$.`],
        ],
        distractors: [
          { value: -5, label: "-5", trap: "Square_Root_Domain_Trap" },
          { value: 0, label: "0", trap: "Domain_Boundary_Omission" },
          { value: 6, label: "6", trap: "Boundary_Exclusion_Error" },
        ],
      };

    case "func-domain-log":
    case "func-spec-exp-log":
      return {
        motifId,
        branch: "log-domain-positive",
        text: `For $f(x)=\\log_{2}(x-4)$, find the least integer value of $x$ in the domain.`,
        values: { lowerOpen: 4 },
        answer: 5,
        answerLabel: "5",
        formula: "x-4 > 0",
        steps: [
          ["conditional", `The argument of a logarithm must be positive.`],
          ["direct", `So $x-4>0\\Rightarrow x>4$.`],
          ["direct", `The least integer satisfying $x>4$ is $5$.`],
        ],
        distractors: [
          { value: 4, label: "4", trap: "Log_Argument_Violation" },
          { value: 0, label: "0", trap: "Domain_Boundary_Omission" },
          { value: -4, label: "-4", trap: "Transformation_Direction_Flip" },
        ],
      };

    case "func-range-basic":
    case "func-range-quadratic":
    case "func-type-bounded":
      return {
        motifId,
        branch: "quadratic-vertex-range",
        text: `For $f(x)=(x-2)^2+3$, where $x\\in\\mathbb{R}$, find the minimum value of $f(x)$.`,
        values: { h: 2, k: 3 },
        answer: 3,
        answerLabel: "3",
        formula: "(x-2)^2+3",
        steps: [
          ["conditional", `Since $(x-2)^2\\ge0$ for all $x\\in\\mathbb{R}$, the least possible value occurs when $x=2$.`],
          ["direct", `At $x=2$, $f(2)=(2-2)^2+3=3$.`],
          ["direct", `Thus the minimum value is $3$.`],
        ],
        distractors: [
          { value: 2, label: "2", trap: "Range_Codomain_Confusion" },
          { value: 0, label: "0", trap: "Vertex_Shift_Omission" },
          { value: -3, label: "-3", trap: "Sign_Flip" },
        ],
      };

    case "func-eval-piecewise":
    case "func-piecewise-continuity":
      return {
        motifId,
        branch: "piecewise-boundary-evaluation",
        text: `Let $f(x)=\\begin{cases}x^2,&x<2\\\\3x+1,&x\\ge2\\end{cases}$. Find $f(2)$.`,
        values: { x: 2 },
        answer: 7,
        answerLabel: "7",
        formula: "3x+1",
        steps: [
          ["conditional", `At $x=2$, use the branch $x\\ge2$.`],
          ["direct", `So $f(2)=3(2)+1=7$.`],
          ["direct", `The boundary value comes from the second rule, not $x^2$.`],
        ],
        distractors: [
          { value: 4, label: "4", trap: "Composite_Domain_Restriction" },
          { value: 6, label: "6", trap: "Constant_Omission" },
          { value: 5, label: "5", trap: "Wrong_Branch" },
        ],
      };

    case "func-type-parity":
      return {
        motifId,
        branch: "even-function-test",
        text: `Classify $f(x)=x^4+3x^2$. Use $1$ for even, $-1$ for odd, and $0$ for neither.`,
        values: { answer: 1 },
        answer: 1,
        answerLabel: "1",
        formula: "f(-x)=f(x)",
        steps: [
          ["conditional", `Compute $f(-x)=(-x)^4+3(-x)^2=x^4+3x^2$.`],
          ["direct", `Thus $f(-x)=f(x)$, so the function is even.`],
          ["direct", `The code for even is $1$.`],
        ],
        distractors: [
          { value: -1, label: "-1", trap: "Even_Odd_Sign_Flip" },
          { value: 0, label: "0", trap: "Symmetry_Origin_Confusion" },
          { value: 2, label: "2", trap: "Classification_Code_Error" },
        ],
      };

    case "func-type-injectivity":
    case "func-inverse-existence":
      return {
        motifId,
        branch: "linear-injective-check",
        text: `For $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x+5$. Use $1$ if $f$ is one-to-one and $0$ otherwise.`,
        values: { slope: 2 },
        answer: 1,
        answerLabel: "1",
        formula: "nonzero slope",
        steps: [
          ["conditional", `A nonconstant linear function $f(x)=mx+c$ with $m\\ne0$ is one-to-one.`],
          ["direct", `Here $m=2\\ne0$, so distinct inputs give distinct outputs.`],
          ["direct", `Therefore the function is one-to-one, represented by $1$.`],
        ],
        distractors: [
          { value: 0, label: "0", trap: "Inverse_Existence_Check" },
          { value: 2, label: "2", trap: "Slope_As_Answer" },
          { value: 5, label: "5", trap: "Intercept_As_Answer" },
        ],
      };

    case "func-type-surjectivity":
      return {
        motifId,
        branch: "quadratic-onto-check",
        text: `For $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x^2$. Use $1$ if $f$ is onto and $0$ otherwise.`,
        values: { answer: 0 },
        answer: 0,
        answerLabel: "0",
        formula: "range not equal codomain",
        steps: [
          ["conditional", `The range of $f(x)=x^2$ is $[0,\\infty)$.`],
          ["conditional", `The codomain is $\\mathbb{R}$, which includes negative values.`],
          ["direct", `Since range $\\ne$ codomain, $f$ is not onto, represented by $0$.`],
        ],
        distractors: [
          { value: 1, label: "1", trap: "Onto_Check_Neglect" },
          { value: 2, label: "2", trap: "Range_Codomain_Confusion" },
          { value: -1, label: "-1", trap: "Parity_Confusion" },
        ],
      };

    case "func-type-periodic":
      return {
        motifId,
        branch: "scaled-sine-period",
        text: `If $f(x)=\\sin(3x)$ and the base period of $\\sin x$ is $2\\pi$, find the period of $f(x)$.`,
        values: { multiplier: 3 },
        answer: 2 / 3,
        answerLabel: "\\frac{2\\pi}{3}",
        formula: "2pi/3",
        steps: [
          ["conditional", `For $\\sin(kx)$, the period is $\\frac{2\\pi}{|k|}$.`],
          ["direct", `Here $k=3$, so period $=\\frac{2\\pi}{3}$.`],
        ],
        distractors: [
          { value: 6, label: "6\\pi", trap: "Periodicity_Linear_Assumption" },
          { value: 3, label: "3\\pi", trap: "Multiplier_As_Period" },
          { value: 2, label: "2\\pi", trap: "Scale_Omission" },
        ],
      };

    case "func-op-algebra":
      return {
        motifId,
        branch: "sum-of-functions",
        text: `If $f(x)=x^2+1$ and $g(x)=2x-3$, find $(f+g)(2)$.`,
        values: { x: 2 },
        answer: 6,
        answerLabel: "6",
        formula: "f(2)+g(2)",
        steps: [
          ["direct", `$f(2)=2^2+1=5$.`],
          ["direct", `$g(2)=2(2)-3=1$.`],
          ["direct", `Therefore $(f+g)(2)=5+1=6$.`],
        ],
        distractors: [
          { value: 5, label: "5", trap: "Use_Only_First_Function" },
          { value: 1, label: "1", trap: "Use_Only_Second_Function" },
          { value: 3, label: "3", trap: "Composition_Order_Swap" },
        ],
      };

    case "func-comp-basic":
    case "func-comp-domain":
      return {
        motifId,
        branch: "basic-composition",
        text: `If $f(x)=2x+1$ and $g(x)=x^2-3$, find $(f\\circ g)(2)$.`,
        values: { x: 2 },
        answer: 3,
        answerLabel: "3",
        formula: "f(g(2))",
        steps: [
          ["conditional", `Composition means $(f\\circ g)(2)=f(g(2))$, so evaluate the inside function first.`],
          ["direct", `$g(2)=2^2-3=1$.`],
          ["direct", `Then $f(1)=2(1)+1=3$.`],
        ],
        distractors: [
          { value: 13, label: "13", trap: "Composition_Order_Swap" },
          { value: 1, label: "1", trap: "Stop_At_Inner_Function" },
          { value: 5, label: "5", trap: "Wrong_Substitution" },
        ],
      };

    case "func-comp-iterative":
      return {
        motifId,
        branch: "two-cycle-iteration",
        text: `Let $f(x)=1-x$. Find $f^{5}(3)$, where $f^{5}$ means applying $f$ five times.`,
        values: { x: 3, n: 5 },
        answer: -2,
        answerLabel: "-2",
        formula: "f^5(3)",
        steps: [
          ["conditional", `$f(3)=1-3=-2$.`],
          ["conditional", `$f(-2)=1-(-2)=3$, so the values cycle between $3$ and $-2$.`],
          ["direct", `Odd iterations give $-2$, so $f^{5}(3)=-2$.`],
        ],
        distractors: [
          { value: 3, label: "3", trap: "Iterative_Pattern_Mismatch" },
          { value: -1, label: "-1", trap: "One_Step_Short" },
          { value: 2, label: "2", trap: "Sign_Flip" },
        ],
      };

    case "func-inverse-find":
    case "func-inverse-property":
      return {
        motifId,
        branch: "linear-inverse-value",
        text: `If $f(x)=3x-4$, find $f^{-1}(8)$.`,
        values: { y: 8 },
        answer: 4,
        answerLabel: "4",
        formula: "y=3x-4",
        steps: [
          ["conditional", `Set $f(x)=8$, so $3x-4=8$.`],
          ["direct", `Then $3x=12$, hence $x=4$.`],
          ["direct", `Therefore $f^{-1}(8)=4$.`],
        ],
        distractors: [
          { value: 20, label: "20", trap: "Inverse_Algebraic_Error" },
          { value: 12, label: "12", trap: "Stop_Before_Division" },
          { value: 8, label: "8", trap: "Inverse_Property_Misread" },
        ],
      };

    case "func-spec-modulus":
      return {
        motifId,
        branch: "modulus-minimum",
        text: `Find the minimum value of $f(x)=|x-5|+2$, where $x\\in\\mathbb{R}$.`,
        values: { shift: 5, min: 2 },
        answer: 2,
        answerLabel: "2",
        formula: "|x-5|+2",
        steps: [
          ["conditional", `Since $|x-5|\\ge0$, the least value occurs when $x=5$.`],
          ["direct", `Minimum value $=0+2=2$.`],
        ],
        distractors: [
          { value: 5, label: "5", trap: "Modulus_Case_Omission" },
          { value: 7, label: "7", trap: "Substitution_Trap" },
          { value: -2, label: "-2", trap: "Range_Codomain_Confusion" },
        ],
      };

    case "func-spec-gif":
      return {
        motifId,
        branch: "negative-floor",
        text: `Evaluate $\\lfloor -2.3\\rfloor$.`,
        values: { input: -2.3 },
        answer: -3,
        answerLabel: "-3",
        formula: "floor(-2.3)",
        steps: [
          ["conditional", `$\\lfloor x\\rfloor$ is the greatest integer less than or equal to $x$.`],
          ["direct", `The greatest integer $\\le -2.3$ is $-3$.`],
        ],
        distractors: [
          { value: -2, label: "-2", trap: "GIF_Negative_Value" },
          { value: 2, label: "2", trap: "Sign_Omission" },
          { value: 3, label: "3", trap: "Absolute_Value_Trap" },
        ],
      };

    case "func-spec-fractional":
      return {
        motifId,
        branch: "fractional-part",
        text: `Evaluate $\\{7.4\\}$, where $\\{x\\}=x-\\lfloor x\\rfloor$.`,
        values: { inputTimes10: 74 },
        answer: 0.4,
        answerLabel: "\\frac{2}{5}",
        formula: "x-floor(x)",
        steps: [
          ["direct", `$\\lfloor 7.4\\rfloor=7$.`],
          ["direct", `So $\\{7.4\\}=7.4-7=0.4=\\frac{2}{5}$.`],
        ],
        distractors: [
          { value: 7, label: "7", trap: "Fractional_Part_Range" },
          { value: 0.6, label: "\\frac{3}{5}", trap: "Complement_Trap" },
          { value: 1.4, label: "\\frac{7}{5}", trap: "Range_Violation" },
        ],
      };

    case "func-spec-signum":
      return {
        motifId,
        branch: "signum-evaluation",
        text: `For the signum function $\\operatorname{sgn}(x)$, evaluate $\\operatorname{sgn}(-8)$.`,
        values: { x: -8 },
        answer: -1,
        answerLabel: "-1",
        formula: "sgn(-8)",
        steps: [
          ["conditional", `$\\operatorname{sgn}(x)=-1$ when $x<0$.`],
          ["direct", `Since $-8<0$, $\\operatorname{sgn}(-8)=-1$.`],
        ],
        distractors: [
          { value: 1, label: "1", trap: "Modulus_Case_Omission" },
          { value: 0, label: "0", trap: "Boundary_Trap" },
          { value: 8, label: "8", trap: "Absolute_Value_Trap" },
        ],
      };

    case "func-eqn-additive":
      return {
        motifId,
        branch: "additive-functional-equation",
        text: `If $f(x+y)=f(x)+f(y)$ for positive integers and $f(1)=4$, find $f(7)$.`,
        values: { seed: 4, n: 7 },
        answer: 28,
        answerLabel: "28",
        formula: "f(n)=nf(1)",
        steps: [
          ["conditional", `For an additive function on positive integers, $f(n)=n\\cdot f(1)$.`],
          ["direct", `So $f(7)=7\\cdot4=28$.`],
        ],
        distractors: [
          { value: 11, label: "11", trap: "Linear_Equation_Inversion" },
          { value: 16, label: "16", trap: "Add_Seed_Twice" },
          { value: 7, label: "7", trap: "Seed_Omission" },
        ],
      };

    case "func-eqn-multiplicative":
      return {
        motifId,
        branch: "multiplicative-to-additive",
        text: `If $f(xy)=f(x)+f(y)$ and $f(2)=3$, find $f(8)$.`,
        values: { base: 2, power: 3 },
        answer: 9,
        answerLabel: "9",
        formula: "f(2^3)=3f(2)",
        steps: [
          ["conditional", `Since $8=2^3$, use $f(2\\cdot2\\cdot2)=f(2)+f(2)+f(2)$.`],
          ["direct", `Thus $f(8)=3\\cdot3=9$.`],
        ],
        distractors: [
          { value: 24, label: "24", trap: "Linear_Equation_Inversion" },
          { value: 6, label: "6", trap: "One_Factor_Omission" },
          { value: 11, label: "11", trap: "Additive_Input_Trap" },
        ],
      };

    case "func-eqn-power":
    case "func-eqn-recursive":
      return {
        motifId,
        branch: "multiplicative-power-function",
        text: `If $f(xy)=f(x)f(y)$ and $f(2)=4$, find $f(8)$.`,
        values: { base: 2, power: 3 },
        answer: 64,
        answerLabel: "64",
        formula: "f(2^3)=f(2)^3",
        steps: [
          ["conditional", `Since $8=2^3$, $f(8)=f(2\\cdot2\\cdot2)$.`],
          ["direct", `Using $f(xy)=f(x)f(y)$, $f(8)=4\\cdot4\\cdot4=64$.`],
        ],
        distractors: [
          { value: 12, label: "12", trap: "Linear_Equation_Inversion" },
          { value: 32, label: "32", trap: "Exponent_vs_Coefficient" },
          { value: 16, label: "16", trap: "Iterative_Pattern_Mismatch" },
        ],
      };

    case "func-graph-shift":
    case "func-graph-scale":
      return {
        motifId,
        branch: "horizontal-shift",
        text: `The graph of $y=f(x+3)$ is obtained from $y=f(x)$ by shifting how many units to the left?`,
        values: { shift: 3 },
        answer: 3,
        answerLabel: "3",
        formula: "f(x+3)",
        steps: [
          ["conditional", `An inside change $f(x+a)$ shifts the graph left by $a$ units.`],
          ["direct", `Here $a=3$, so the shift is $3$ units left.`],
        ],
        distractors: [
          { value: -3, label: "-3", trap: "Transformation_Direction_Flip" },
          { value: 0, label: "0", trap: "Shift_Omission" },
          { value: 6, label: "6", trap: "Scale_Trap" },
        ],
      };

    case "func-graph-reflect":
      return {
        motifId,
        branch: "axis-reflection",
        text: `Use $1$ for reflection in the $x$-axis and $2$ for reflection in the $y$-axis. Which reflection is represented by $y=-f(x)$?`,
        values: { answer: 1 },
        answer: 1,
        answerLabel: "1",
        formula: "y=-f(x)",
        steps: [
          ["conditional", `Multiplying the output by $-1$ changes $y$ to $-y$.`],
          ["direct", `That reflects the graph in the $x$-axis, represented by $1$.`],
        ],
        distractors: [
          { value: 2, label: "2", trap: "Reflect_Axis_Swap" },
          { value: 0, label: "0", trap: "Transformation_Direction_Flip" },
          { value: -1, label: "-1", trap: "Sign_As_Code" },
        ],
      };

    case "func-graph-intersect":
      return {
        motifId,
        branch: "intersection-count",
        text: `Find the number of intersection points of the graphs $y=x^2$ and $y=4$.`,
        values: { level: 4 },
        answer: 2,
        answerLabel: "2",
        formula: "x^2=4",
        steps: [
          ["conditional", `Intersection points satisfy $x^2=4$.`],
          ["direct", `So $x=2$ or $x=-2$.`],
          ["direct", `There are $2$ intersection points.`],
        ],
        distractors: [
          { value: 1, label: "1", trap: "Square_Root_Principle" },
          { value: 4, label: "4", trap: "Range_Codomain_Confusion" },
          { value: 0, label: "0", trap: "No_Intersection_Trap" },
        ],
      };

    case "func-eval-direct":
    default:
      return {
        motifId,
        branch: "direct-polynomial-evaluation",
        text: `If $f(x)=2x^2-3x+1$, find $f(4)$.`,
        values: { x: 4 },
        answer: 21,
        answerLabel: "21",
        formula: "2x^2-3x+1",
        steps: [
          ["direct", `Substitute $x=4$ in $f(x)=2x^2-3x+1$.`],
          ["direct", `$f(4)=2(4)^2-3(4)+1=32-12+1=21$.`],
        ],
        distractors: [
          { value: 17, label: "17", trap: "Exponent_vs_Coefficient" },
          { value: 45, label: "45", trap: "Sign_Flip" },
          { value: 20, label: "20", trap: "Constant_Omission" },
        ],
      };
  }
}

function createScenarioFromMotif(
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) {
  const motifId =
    motif?.id ??
    (difficulty === "Hard"
      ? "func-comp-iterative"
      : "func-eval-direct");
  return finalizeFunctionsScenario(
    createFunctionsDefinition(motifId),
  );
}

const PATTERN_FACTORIES: Record<
  string,
  FunctionsScenarioFactory[]
> = {
  functions: [
    () => createScenarioFromMotif("Medium", { id: "func-eval-direct" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "func-domain-basic" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "func-type-parity" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "func-comp-basic" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "func-spec-gif" } as QuantMotif),
  ],
  "functions-domain-range": [
    () => createScenarioFromMotif("Medium", { id: "func-domain-basic" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "func-domain-root" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "func-domain-log" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "func-range-quadratic" } as QuantMotif),
  ],
  "functions-types": [
    () => createScenarioFromMotif("Medium", { id: "func-type-injectivity" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "func-type-surjectivity" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "func-type-parity" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "func-type-periodic" } as QuantMotif),
  ],
  "functions-composition-inverse": [
    () => createScenarioFromMotif("Medium", { id: "func-op-algebra" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "func-comp-basic" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "func-comp-iterative" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "func-inverse-find" } as QuantMotif),
  ],
  "functions-special": [
    () => createScenarioFromMotif("Hard", { id: "func-spec-modulus" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "func-spec-gif" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "func-spec-fractional" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "func-spec-exp-log" } as QuantMotif),
  ],
  "functions-functional-equations": [
    () => createScenarioFromMotif("Hard", { id: "func-eqn-additive" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "func-eqn-multiplicative" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "func-eqn-power" } as QuantMotif),
  ],
  "functions-graphs": [
    () => createScenarioFromMotif("Medium", { id: "func-graph-shift" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "func-graph-reflect" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "func-graph-intersect" } as QuantMotif),
  ],
};

function resolveFunctionsPatternKey(
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

export function createFunctionsScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const patternKey =
    resolveFunctionsPatternKey(pattern);

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
    PATTERN_FACTORIES.functions;

  return pickRandomItem(factories)(
    difficulty,
    motif,
  );
}
