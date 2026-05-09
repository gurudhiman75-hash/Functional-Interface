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

type AlgebraDefinition = {
  motifId: string;
  branch: string;
  text: string;
  values: Record<string, number>;
  answer: number;
  formula: string;
  steps: Array<[Parameters<typeof createReasoningStep>[0], string]>;
  distractors: number[];
  distractorLabels: string[];
  tokens?: string[];
};

type AlgebraScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

const ALGEBRA_CONTEXT: QuantScenarioContext = {
  entity: "algebraic expression",
  metric: "required value",
  context: "algebra",
};

function round(value: number) {
  return (
    Math.round((value + Number.EPSILON) * 100) /
    100
  );
}

function formatNumber(value: number) {
  const rounded = round(value);
  if (Number.isInteger(rounded)) {
    return `${rounded}`;
  }

  const sign = rounded < 0 ? "-" : "";
  const absolute = Math.abs(rounded);
  const allowedDenominators = [
    2, 3, 4, 5, 6, 8, 10, 12, 15, 20,
  ];
  for (const denominator of allowedDenominators) {
    const numerator = Math.round(
      absolute * denominator,
    );
    if (
      numerator > 0 &&
      Math.abs(
        absolute -
          numerator / denominator,
      ) < 0.011
    ) {
      return `${sign}\\frac{${numerator}}{${denominator}}`;
    }
  }

  return rounded.toFixed(2);
}

function optionValue(value: number) {
  return `$${formatNumber(value)}$`;
}

function structuralSignature(
  motifId: string,
  branch: string,
  values: Record<string, number>,
) {
  return `${motifId}::${branch}::${Object.values(values).join("|")}`;
}

function buildOptions(
  correctAnswer: number,
  distractors: number[],
  labels: string[],
) {
  const candidates = [
    correctAnswer,
    ...distractors,
    correctAnswer +
      Math.max(
        1,
        Math.round(Math.abs(correctAnswer) * 0.12),
      ),
  ];
  const unique = Array.from(
    new Set(
      candidates
        .map(round)
        .filter((value) =>
          Number.isFinite(value),
        ),
    ),
  );
  while (unique.length < 4) {
    unique.push(
      round(
        correctAnswer +
          unique.length *
            Math.max(
              2,
              Math.round(
                Math.abs(correctAnswer) * 0.1,
              ),
            ),
      ),
    );
  }
  const values = unique.slice(0, 4);
  const optionMetadata: OptionMetadata[] =
    values.map((value, index) =>
      index === 0
        ? {
            value: optionValue(value),
            isCorrect: true,
          }
        : {
            value: optionValue(value),
            isCorrect: false,
            distractorType:
              "wrongIntermediateValue",
            likelyMistake:
              labels[index - 1] ??
              "plausible symbolic slip",
            reasoningTrap:
              labels[index - 1] ??
              "wrong algebraic relation",
          },
    );
  return {
    options: values.map(optionValue),
    correct: 0,
    optionMetadata,
  };
}

function finalizeAlgebraScenario(
  definition: AlgebraDefinition,
): QuantProceduralScenario {
  return {
    scenarioType: definition.motifId,
    topicCluster: "algebra",
    values: definition.values,
    formula: definition.formula,
    text: definition.text,
    correctAnswer: definition.answer,
    reasoningSteps: definition.steps.map(
      ([type, text]) =>
        createReasoningStep(type, text),
    ),
    context: ALGEBRA_CONTEXT,
    motifId: definition.motifId,
    scenarioLogicBranch:
      definition.branch,
    structuralSignature:
      structuralSignature(
        definition.motifId,
        definition.branch,
        definition.values,
      ),
    customOptionBundle: buildOptions(
      definition.answer,
      definition.distractors,
      definition.distractorLabels,
    ),
    distractorHints:
      definition.distractorLabels,
    validationTokens:
      definition.tokens,
  };
}

function createAlgebraDefinition(
  motifId: string,
  difficulty: DifficultyLabel,
): AlgebraDefinition {
  switch (motifId) {
    case "alg-id-basic": {
      const sum = 13;
      const product = 36;
      const answer =
        sum * sum - 2 * product;
      return {
        motifId,
        branch:
          "square-sum-from-sum-product",
        values: { sum, product },
        answer,
        formula: "(a+b)^2 - 2ab",
        text: `If $a+b=${sum}$ and $ab=${product}$, find $a^2+b^2$.`,
        steps: [
          [
            "transform",
            `Use $(a+b)^2=a^2+b^2+2ab$.`,
          ],
          [
            "infer",
            `$a^2+b^2=${sum}^2-2\\times${product}=${answer}$.`,
          ],
        ],
        distractors: [
          sum * sum,
          sum * sum + 2 * product,
          product,
        ],
        distractorLabels: [
          "Identity_Mixed_Terms",
          "Added 2ab instead of subtracting",
          "Used product directly",
        ],
      };
    }
    case "alg-id-cubic": {
      const sum = 7;
      const product = 10;
      const answer =
        sum * (sum * sum - 3 * product);
      return {
        motifId,
        branch: "cube-sum",
        values: { sum, product },
        answer,
        formula: "(a+b)((a+b)^2-3ab)",
        text: `If $a+b=${sum}$ and $ab=${product}$, find $a^3+b^3$.`,
        steps: [
          [
            "transform",
            `Use $a^3+b^3=(a+b)((a+b)^2-3ab)$.`,
          ],
          [
            "infer",
            `$a^3+b^3=${sum}(${sum}^2-3\\times${product})=${answer}$.`,
          ],
        ],
        distractors: [
          sum * (sum * sum + product),
          sum * sum * sum,
          sum * (sum * sum - product),
        ],
        distractorLabels: [
          "Cubic_Factor_Omission",
          "Cubed the sum directly",
          "Forgot factor 3ab",
        ],
      };
    }
    case "alg-id-triple": {
      const a = 2;
      const b = 3;
      const c = -5;
      const answer = 3 * a * b * c;
      return {
        motifId,
        branch: "zero-sum-cubic",
        values: { a, b, c },
        answer,
        formula: "3abc",
        text: `If $a+b+c=0$, $a=${a}$, $b=${b}$, and $c=${c}$, find $a^3+b^3+c^3$.`,
        steps: [
          [
            "transform",
            `When $a+b+c=0$, $a^3+b^3+c^3=3abc$.`,
          ],
          [
            "infer",
            `$3abc=3\\times${a}\\times${b}\\times(${c})=${answer}$.`,
          ],
        ],
        distractors: [
          a ** 3 + b ** 3,
          Math.abs(answer),
          a + b + c,
        ],
        distractorLabels: [
          "Cubic_Factor_Omission",
          "Lost the negative sign",
          "Used the zero-sum condition as answer",
        ],
      };
    }
    case "alg-id-cond-sum": {
      const k = 5;
      const answer = k * k - 2;
      return {
        motifId,
        branch: "reciprocal-square-sum",
        values: { k },
        answer,
        formula: "k^2 - 2",
        text: `If $x+\\frac{1}{x}=${k}$, find $x^2+\\frac{1}{x^2}$.`,
        steps: [
          [
            "transform",
            `Square both sides: $(x+\\frac{1}{x})^2=x^2+\\frac{1}{x^2}+2$.`,
          ],
          [
            "infer",
            `$x^2+\\frac{1}{x^2}=${k}^2-2=${answer}$.`,
          ],
        ],
        distractors: [
          k * k + 2,
          k * k,
          k - 2,
        ],
        distractorLabels: [
          "Reciprocal_Identity_Flip",
          "Forgot the 2 term",
          "Subtracted before squaring",
        ],
      };
    }
    case "alg-id-cond-diff": {
      const k = 3;
      const answer = k ** 3 + 3 * k;
      return {
        motifId,
        branch: "reciprocal-cubic-difference",
        values: { k },
        answer,
        formula: "k^3 + 3k",
        text: `If $x-\\frac{1}{x}=${k}$, find $x^3-\\frac{1}{x^3}$.`,
        steps: [
          [
            "transform",
            `Use $(x-\\frac{1}{x})^3=x^3-\\frac{1}{x^3}-3(x-\\frac{1}{x})$.`,
          ],
          [
            "infer",
            `$x^3-\\frac{1}{x^3}=${k}^3+3\\times${k}=${answer}$.`,
          ],
        ],
        distractors: [
          k ** 3 - 3 * k,
          k ** 3,
          k ** 2 + 3,
        ],
        distractorLabels: [
          "Reciprocal_Identity_Flip",
          "Ignored linear correction",
          "Squared instead of cubed",
        ],
      };
    }
    case "alg-lin-simult": {
      const x = 4;
      const y = 3;
      return {
        motifId,
        branch: "two-equation-elimination",
        values: { x, y },
        answer: x,
        formula: "solve system",
        text: `Solve the system $2x+y=11$ and $x-y=1$. Find $x$.`,
        steps: [
          [
            "transform",
            `Add the equations after aligning coefficients.`,
          ],
          [
            "infer",
            `$2x+y+x-y=12$, so $3x=12$ and $x=${x}$.`,
          ],
        ],
        distractors: [
          y,
          x + y,
          x - y,
        ],
        distractorLabels: [
          "Substitution slip",
          "Reported x+y",
          "Reported x-y",
        ],
      };
    }
    case "alg-lin-consistency": {
      const answer = 0;
      return {
        motifId,
        branch: "no-solution-ratio",
        values: { answer },
        answer,
        formula: "a1/a2 = b1/b2 != c1/c2",
        text: `For the pair $2x+3y=5$ and $4x+6y=13$, how many solutions are possible?`,
        steps: [
          [
            "transform",
            `Here $\\frac{a_1}{a_2}=\\frac{2}{4}$ and $\\frac{b_1}{b_2}=\\frac{3}{6}$, but $\\frac{c_1}{c_2}=\\frac{5}{13}$.`,
          ],
          [
            "infer",
            `Since coefficient ratios are equal but constant ratio is different, there is no solution.`,
          ],
        ],
        distractors: [1, 2, 999],
        distractorLabels: [
          "Infinite_Sol_Condition",
          "Assumed two intersections",
          "Treated no solution as infinite",
        ],
      };
    }
    case "alg-lin-word-problem": {
      const fixed = 50;
      const rate = 8;
      const total = 130;
      const answer = (total - fixed) / rate;
      return {
        motifId,
        branch: "fixed-plus-variable-cost",
        values: { fixed, rate, total },
        answer,
        formula: "(total-fixed)/rate",
        text: `A taxi charges a fixed amount of $${fixed}$ and $${rate}$ per km. If the total fare is $${total}$, find the distance $x$ in km.`,
        steps: [
          [
            "transform",
            `Form the equation $${fixed}+${rate}x=${total}$.`,
          ],
          [
            "infer",
            `$x=\\frac{${total}-${fixed}}{${rate}}=${answer}$.`,
          ],
        ],
        distractors: [
          total / rate,
          total - fixed,
          answer + fixed,
        ],
        distractorLabels: [
          "Ignored fixed cost",
          "Forgot division by rate",
          "Added fixed cost to distance",
        ],
      };
    }
    case "alg-quad-roots": {
      const sum = 7;
      const product = 12;
      const answer = 3;
      return {
        motifId,
        branch: "factorized-roots",
        values: { sum, product },
        answer,
        formula: "factor quadratic",
        text: `Find the smaller root of $x^2-7x+12=0$.`,
        steps: [
          [
            "transform",
            `Factorize $x^2-7x+12=(x-3)(x-4)$.`,
          ],
          [
            "infer",
            `The roots are $3$ and $4$, so the smaller root is $3$.`,
          ],
        ],
        distractors: [4, -3, -4],
        distractorLabels: [
          "Chose larger root",
          "Sign_Flip_Roots",
          "Sign_Flip_Roots",
        ],
      };
    }
    case "alg-quad-nature": {
      const a = 1;
      const b = 6;
      const c = 9;
      const answer = 0;
      return {
        motifId,
        branch: "equal-real-roots",
        values: { a, b, c },
        answer,
        formula: "D = b^2 - 4ac",
        text: `For $x^2+6x+9=0$, find the discriminant $D$.`,
        steps: [
          [
            "transform",
            `Use $D=b^2-4ac$.`,
          ],
          [
            "infer",
            `$D=6^2-4\\times1\\times9=0$.`,
          ],
        ],
        distractors: [72, 36, -36],
        distractorLabels: [
          "Discriminant_Sign_Swap",
          "Ignored 4ac",
          "Changed sign incorrectly",
        ],
      };
    }
    case "alg-quad-coeff-rel": {
      const a = 2;
      const b = -7;
      const answer = 7 / 2;
      return {
        motifId,
        branch: "sum-of-roots",
        values: { a, b },
        answer,
        formula: "-b/a",
        text: `If $\\alpha$ and $\\beta$ are roots of $2x^2-7x+3=0$, find $\\alpha+\\beta$.`,
        steps: [
          [
            "transform",
            `For $ax^2+bx+c=0$, $\\alpha+\\beta=-\\frac{b}{a}$.`,
          ],
          [
            "infer",
            `$\\alpha+\\beta=-\\frac{-7}{2}=\\frac{7}{2}$.`,
          ],
        ],
        distractors: [
          -7 / 2,
          3 / 2,
          -3 / 2,
        ],
        distractorLabels: [
          "Sign_Flip_Roots",
          "Used product formula",
          "Mixed sum and product signs",
        ],
      };
    }
    case "alg-quad-construct": {
      const r1 = 2;
      const r2 = 5;
      const answer = -(r1 + r2);
      return {
        motifId,
        branch: "construct-coefficient",
        values: { r1, r2 },
        answer,
        formula: "x^2 - (sum)x + product",
        text: `A monic quadratic has roots $2$ and $5$. If it is written as $x^2+Bx+C=0$, find $B$.`,
        steps: [
          [
            "transform",
            `Equation from roots is $x^2-(r_1+r_2)x+r_1r_2=0$.`,
          ],
          [
            "infer",
            `$B=-(2+5)=-7$.`,
          ],
        ],
        distractors: [7, 10, -10],
        distractorLabels: [
          "Sign_Flip_Roots",
          "Used product as coefficient",
          "Negative product",
        ],
      };
    }
    case "alg-newton-sums": {
      const sum = 5;
      const product = 6;
      const answer = sum * sum - 2 * product;
      return {
        motifId,
        branch: "second-power-sum",
        values: { sum, product },
        answer,
        formula: "S2 = S1^2 - 2P",
        text: `If $\\alpha+\\beta=5$ and $\\alpha\\beta=6$, find $\\alpha^2+\\beta^2$.`,
        steps: [
          [
            "transform",
            `Use $\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta$.`,
          ],
          [
            "infer",
            `$\\alpha^2+\\beta^2=5^2-2\\times6=${answer}$.`,
          ],
        ],
        distractors: [25, 31, 6],
        distractorLabels: [
          "Newton_Sum_Power_Error",
          "Added 2ab",
          "Used product directly",
        ],
      };
    }
    case "alg-ineq-linear": {
      const answer = 3;
      return {
        motifId,
        branch: "negative-division-boundary",
        values: { answer },
        answer,
        formula: "flip inequality",
        text: `If $-3x+5< -1$, find the least integer value of $x$.`,
        steps: [
          [
            "transform",
            `$-3x<-6$. Dividing by $-3$ reverses the inequality.`,
          ],
          [
            "infer",
            `$x>2$, so the least integer greater than $2$ is $3$.`,
          ],
        ],
        distractors: [2, -2, -3],
        distractorLabels: [
          "Inequality_Direction_Error",
          "Sign error",
          "Wrong boundary side",
        ],
      };
    }
    case "alg-mod-eqn": {
      const a = 4;
      const b = 7;
      const answer = a + b;
      return {
        motifId,
        branch: "positive-modulus-root",
        values: { a, b },
        answer,
        formula: "x = a \\pm b",
        text: `For $|x-${a}|=${b}$, find the greater value of $x$.`,
        steps: [
          [
            "transform",
            `$|x-${a}|=${b}$ gives $x-${a}=\\pm${b}$.`,
          ],
          [
            "infer",
            `The greater value is $x=${a}+${b}=${answer}$.`,
          ],
        ],
        distractors: [
          a - b,
          b - a,
          a,
        ],
        distractorLabels: [
          "Modulus_Case_Omission",
          "Reversed subtraction",
          "Ignored modulus distance",
        ],
      };
    }
    case "alg-mod-ineq": {
      const a = 5;
      const b = 3;
      const answer = a + b;
      return {
        motifId,
        branch: "modulus-upper-bound",
        values: { a, b },
        answer,
        formula: "a-b <= x <= a+b",
        text: `If $|x-${a}|\\le ${b}$, find the greatest possible integer value of $x$.`,
        steps: [
          [
            "transform",
            `$|x-${a}|\\le ${b}$ means $${a - b}\\le x\\le ${a + b}$.`,
          ],
          [
            "infer",
            `Greatest integer value is $${answer}$.`,
          ],
        ],
        distractors: [
          a - b,
          b,
          a,
        ],
        distractorLabels: [
          "Modulus_Case_Omission",
          "Used radius only",
          "Used center only",
        ],
      };
    }
    case "alg-func-domain": {
      const answer = 2;
      return {
        motifId,
        branch: "rational-domain-exclusion",
        values: { answer },
        answer,
        formula: "denominator != 0",
        text: `For $f(x)=\\frac{1}{x-2}$, which value of $x$ must be excluded from the domain?`,
        steps: [
          [
            "transform",
            `The denominator cannot be zero.`,
          ],
          [
            "infer",
            `$x-2=0$, so $x=2$ is excluded.`,
          ],
        ],
        distractors: [-2, 0, 1],
        distractorLabels: [
          "Domain_Boundary_Trap",
          "Ignored denominator condition",
          "Arithmetic offset",
        ],
      };
    }
    case "alg-func-composite": {
      const x = 4;
      const answer = 2 * (x + 3) + 1;
      return {
        motifId,
        branch: "composition-f-after-g",
        values: { x },
        answer,
        formula: "f(g(x))",
        text: `If $f(x)=2x+1$ and $g(x)=x+3$, find $f(g(${x}))$.`,
        steps: [
          [
            "transform",
            `First compute $g(${x})=${x}+3=7$.`,
          ],
          [
            "infer",
            `$f(g(${x}))=f(7)=2\\times7+1=${answer}$.`,
          ],
        ],
        distractors: [
          (2 * x + 1) + 3,
          2 * x + 1,
          x + 3,
        ],
        distractorLabels: [
          "Composite_Order_Swap",
          "Computed f(x) only",
          "Computed g(x) only",
        ],
      };
    }
    case "alg-func-even-odd": {
      const answer = 1;
      return {
        motifId,
        branch: "even-function-marker",
        values: { answer },
        answer,
        formula: "f(-x)=f(x)",
        text: `For $f(x)=x^2+4$, choose $1$ if the function is even and $0$ otherwise.`,
        steps: [
          [
            "transform",
            `Compute $f(-x)=(-x)^2+4=x^2+4$.`,
          ],
          [
            "infer",
            `Since $f(-x)=f(x)$, the function is even.`,
          ],
        ],
        distractors: [0, 2, -1],
        distractorLabels: [
          "Composite_Order_Swap",
          "Confused even with odd",
          "Sign error",
        ],
      };
    }
    case "alg-log-basic": {
      const answer = 5;
      return {
        motifId,
        branch: "log-product-power",
        values: { answer },
        answer,
        formula: "log_a(mn)",
        text: `If $\\log_2 x=3$ and $\\log_2 y=2$, find $\\log_2(xy)$.`,
        steps: [
          [
            "transform",
            `Use $\\log_a(xy)=\\log_a x+\\log_a y$.`,
          ],
          [
            "infer",
            `$\\log_2(xy)=3+2=${answer}$.`,
          ],
        ],
        distractors: [6, 1, 8],
        distractorLabels: [
          "Log_Base_Confusion",
          "Used quotient rule",
          "Exponent_vs_Coefficient",
        ],
      };
    }
    case "alg-log-base-change": {
      const answer = 3;
      return {
        motifId,
        branch: "base-change-clean",
        values: { answer },
        answer,
        formula: "log_c b / log_c a",
        text: `If $\\log_{10}8=0.903$ and $\\log_{10}2=0.301$, find $\\log_2 8$.`,
        steps: [
          [
            "transform",
            `Use $\\log_a b=\\frac{\\log_c b}{\\log_c a}$.`,
          ],
          [
            "infer",
            `$\\log_2 8=\\frac{0.903}{0.301}=3$.`,
          ],
        ],
        distractors: [
          1 / 3,
          0.602,
          1.204,
        ],
        distractorLabels: [
          "Base_Change_Inversion",
          "Subtracted logs",
          "Added logs",
        ],
      };
    }
    case "alg-log-eqn": {
      const answer = 5;
      return {
        motifId,
        branch: "log-equation",
        values: { answer },
        answer,
        formula: "log_b x = n",
        text: `Solve $\\log_2(x-1)=2$. Find $x$.`,
        steps: [
          [
            "transform",
            `$\\log_2(x-1)=2$ means $x-1=2^2$.`,
          ],
          [
            "infer",
            `$x=4+1=5$.`,
          ],
        ],
        distractors: [4, 3, -3],
        distractorLabels: [
          "Log_Argument_Constraint",
          "Forgot the +1",
          "Invalid log argument",
        ],
      };
    }
    case "alg-max-min-quad": {
      const answer = 4;
      return {
        motifId,
        branch: "quadratic-minimum",
        values: { answer },
        answer,
        formula: "vertex value",
        text: `Find the minimum value of $x^2-6x+13$.`,
        steps: [
          [
            "transform",
            `Complete the square: $x^2-6x+13=(x-3)^2+4$.`,
          ],
          [
            "infer",
            `The minimum value is $4$.`,
          ],
        ],
        distractors: [3, 13, -4],
        distractorLabels: [
          "Reported x-coordinate",
          "Used constant term",
          "Quadratic_Max_Inversion",
        ],
      };
    }
    case "alg-am-gm-opt": {
      const sum = 20;
      const answer = 100;
      return {
        motifId,
        branch: "fixed-sum-max-product",
        values: { sum },
        answer,
        formula: "(sum/2)^2",
        text: `For positive $x$ and $y$, if $x+y=${sum}$, find the maximum value of $xy$.`,
        steps: [
          [
            "transform",
            `By AM-GM, product is maximum when $x=y=\\frac{${sum}}{2}$.`,
          ],
          [
            "infer",
            `Maximum $xy=10\\times10=${answer}$.`,
          ],
        ],
        distractors: [20, 40, 80],
        distractorLabels: [
          "AM_GM_Condition_Neglect",
          "Used twice the sum",
          "Arithmetic slip",
        ],
      };
    }
    case "alg-sequence-ap": {
      const a = 5;
      const d = 3;
      const n = 10;
      const answer = a + (n - 1) * d;
      return {
        motifId,
        branch: "ap-nth-term",
        values: { a, d, n },
        answer,
        formula: "a+(n-1)d",
        text: `In an AP, $a=5$ and $d=3$. Find $T_{10}$.`,
        steps: [
          [
            "transform",
            `Use $T_n=a+(n-1)d$.`,
          ],
          [
            "infer",
            `$T_{10}=5+9\\times3=${answer}$.`,
          ],
        ],
        distractors: [a + n * d, n * d, a * d],
        distractorLabels: [
          "Used n instead of n-1",
          "Ignored first term",
          "Multiplied a and d",
        ],
      };
    }
    case "alg-sequence-gp": {
      const a = 3;
      const r = 2;
      const n = 5;
      const answer = a * r ** (n - 1);
      return {
        motifId,
        branch: "gp-nth-term",
        values: { a, r, n },
        answer,
        formula: "ar^{n-1}",
        text: `In a GP, first term $a=3$ and common ratio $r=2$. Find $T_5$.`,
        steps: [
          [
            "transform",
            `Use $T_n=ar^{n-1}$.`,
          ],
          [
            "infer",
            `$T_5=3\\times2^4=${answer}$.`,
          ],
        ],
        distractors: [
          a * r * n,
          a * r ** n,
          a + r * n,
        ],
        distractorLabels: [
          "Exponent_vs_Coefficient",
          "Used n instead of n-1",
          "Used AP logic",
        ],
      };
    }
    default:
      return createAlgebraDefinition(
        pickRandomItem([
          "alg-id-basic",
          "alg-id-cond-sum",
          "alg-lin-simult",
          "alg-quad-roots",
          "alg-quad-coeff-rel",
          "alg-mod-eqn",
          "alg-func-domain",
          "alg-log-basic",
          "alg-max-min-quad",
        ]),
        difficulty,
      );
  }
}

function createScenarioFromMotif(
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) {
  const motifId =
    motif?.id ??
    pickRandomItem([
      "alg-id-basic",
      "alg-id-cubic",
      "alg-id-cond-sum",
      "alg-lin-simult",
      "alg-lin-word-problem",
      "alg-quad-roots",
      "alg-quad-coeff-rel",
      "alg-mod-eqn",
      "alg-func-composite",
      "alg-log-basic",
      "alg-max-min-quad",
      "alg-sequence-ap",
    ]);

  return finalizeAlgebraScenario(
    createAlgebraDefinition(
      motifId,
      difficulty,
    ),
  );
}

const PATTERN_FACTORIES: Record<
  string,
  AlgebraScenarioFactory[]
> = {
  algebra: [createScenarioFromMotif],
  "algebra-basics": [createScenarioFromMotif],
  "algebra-identities": [
    (difficulty) =>
      finalizeAlgebraScenario(
        createAlgebraDefinition(
          pickRandomItem([
            "alg-id-basic",
            "alg-id-cubic",
            "alg-id-triple",
            "alg-id-cond-sum",
            "alg-id-cond-diff",
          ]),
          difficulty,
        ),
      ),
  ],
  "algebra-linear": [
    (difficulty) =>
      finalizeAlgebraScenario(
        createAlgebraDefinition(
          pickRandomItem([
            "alg-lin-simult",
            "alg-lin-consistency",
            "alg-lin-word-problem",
          ]),
          difficulty,
        ),
      ),
  ],
  "algebra-quadratic": [
    (difficulty) =>
      finalizeAlgebraScenario(
        createAlgebraDefinition(
          pickRandomItem([
            "alg-quad-roots",
            "alg-quad-nature",
            "alg-quad-coeff-rel",
            "alg-quad-construct",
            "alg-newton-sums",
          ]),
          difficulty,
        ),
      ),
  ],
  "algebra-inequalities-modulus": [
    (difficulty) =>
      finalizeAlgebraScenario(
        createAlgebraDefinition(
          pickRandomItem([
            "alg-ineq-linear",
            "alg-mod-eqn",
            "alg-mod-ineq",
          ]),
          difficulty,
        ),
      ),
  ],
  "algebra-functions": [
    (difficulty) =>
      finalizeAlgebraScenario(
        createAlgebraDefinition(
          pickRandomItem([
            "alg-func-domain",
            "alg-func-composite",
            "alg-func-even-odd",
          ]),
          difficulty,
        ),
      ),
  ],
  "algebra-logs": [
    (difficulty) =>
      finalizeAlgebraScenario(
        createAlgebraDefinition(
          pickRandomItem([
            "alg-log-basic",
            "alg-log-base-change",
            "alg-log-eqn",
          ]),
          difficulty,
        ),
      ),
  ],
  "algebra-optimization": [
    (difficulty) =>
      finalizeAlgebraScenario(
        createAlgebraDefinition(
          pickRandomItem([
            "alg-max-min-quad",
            "alg-am-gm-opt",
          ]),
          difficulty,
        ),
      ),
  ],
};

const PATTERN_ALLOWED_MOTIFS: Record<
  string,
  string[]
> = {
  "algebra-identities": [
    "alg-id-basic",
    "alg-id-cubic",
    "alg-id-triple",
    "alg-id-cond-sum",
    "alg-id-cond-diff",
    "alg-simplify-cyclic",
    "alg-factor-remainder",
    "alg-poly-factor",
  ],
  "algebra-linear": [
    "alg-lin-simult",
    "alg-lin-consistency",
    "alg-lin-word-problem",
    "alg-lin-parameter",
  ],
  "algebra-quadratic": [
    "alg-quad-roots",
    "alg-quad-nature",
    "alg-quad-coeff-rel",
    "alg-quad-construct",
    "alg-quad-common-root",
    "alg-newton-sums",
    "alg-quad-complete-square",
    "alg-quad-param-root",
  ],
  "algebra-inequalities-modulus": [
    "alg-ineq-linear",
    "alg-ineq-quad",
    "alg-mod-eqn",
    "alg-mod-ineq",
    "alg-ineq-rational",
    "alg-mod-nested",
  ],
  "algebra-functions": [
    "alg-func-domain",
    "alg-func-range",
    "alg-func-composite",
    "alg-func-even-odd",
    "alg-func-inverse",
    "alg-func-value-param",
  ],
  "algebra-logs": [
    "alg-log-basic",
    "alg-log-base-change",
    "alg-log-eqn",
    "alg-log-domain",
    "alg-log-exponent",
    "alg-exp-eqn",
  ],
  "algebra-optimization": [
    "alg-max-min-quad",
    "alg-am-gm-opt",
    "alg-max-product-fixed-sum",
    "alg-min-sum-recip",
  ],
};

function resolveAlgebraPatternKey(
  pattern: Pattern,
) {
  const registryMatch =
    pattern.id.match(
      /^registry-(algebra(?:-[a-z]+)*|algebra-basics)-(easy|medium|hard)$/i,
    );
  if (registryMatch?.[1]) {
    return registryMatch[1];
  }

  return pattern.id;
}

export function createAlgebraScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const patternKey =
    resolveAlgebraPatternKey(pattern);
  const focusedAllowedMotifs =
    PATTERN_ALLOWED_MOTIFS[patternKey];

  if (
    motif?.id &&
    (!focusedAllowedMotifs ||
      focusedAllowedMotifs.includes(motif.id))
  ) {
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
    PATTERN_FACTORIES.algebra;

  return pickRandomItem(factories)(
    difficulty,
    motif,
  );
}
