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

type EquationOption = {
  label: string;
  value: number;
};

type EquationDefinition = {
  motifId: string;
  branch: string;
  text: string;
  values: Record<string, number>;
  answer: EquationOption;
  formula: string;
  steps: Array<[Parameters<typeof createReasoningStep>[0], string]>;
  distractors: EquationOption[];
  distractorLabels: string[];
  tokens?: string[];
};

type EquationScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

const EQUATION_CONTEXT: QuantScenarioContext = {
  entity: "equation",
  metric: "required solution",
  context: "equations",
};

const opt = (
  label: string,
  value: number,
): EquationOption => ({
  label,
  value,
});

function optionValue(option: EquationOption) {
  return `$${option.label}$`;
}

function structuralSignature(
  motifId: string,
  branch: string,
  values: Record<string, number>,
) {
  return `${motifId}::${branch}::${Object.values(values).join("|")}`;
}

function buildOptions(
  correctAnswer: EquationOption,
  distractors: EquationOption[],
  labels: string[],
) {
  const candidates = [
    correctAnswer,
    ...distractors,
  ];
  const unique: EquationOption[] = [];
  for (const candidate of candidates) {
    if (
      !unique.some(
        (item) => item.label === candidate.label,
      )
    ) {
      unique.push(candidate);
    }
  }

  while (unique.length < 4) {
    unique.push(
      opt(`${correctAnswer.value + unique.length}`, correctAnswer.value + unique.length),
    );
  }

  const values = unique.slice(0, 4);
  const optionMetadata: OptionMetadata[] =
    values.map((value, index) =>
      index === 0
        ? {
            value: optionValue(value),
            isCorrect: true,
            distractorType: "correct",
            likelyMistake: "Correct equation path",
            reasoningTrap: "None",
          }
        : {
            value: optionValue(value),
            isCorrect: false,
            distractorType:
              "wrongIntermediateValue",
            likelyMistake:
              labels[index - 1] ??
              "plausible equation slip",
            reasoningTrap:
              labels[index - 1] ??
              "wrong sign, case, or root relation",
          },
    );

  return {
    options: values.map(optionValue),
    correct: 0,
    optionMetadata,
  };
}

function finalizeEquationScenario(
  definition: EquationDefinition,
): QuantProceduralScenario {
  const explanation = [
    ...definition.steps.map(([, text]) => text),
    `Final answer = $${definition.answer.label}$.`,
  ].join("\n");

  return {
    scenarioType: definition.motifId,
    topicCluster: "equations",
    values: definition.values,
    formula: definition.formula,
    text: definition.text,
    correctAnswer: definition.answer.value,
    reasoningSteps: definition.steps.map(
      ([type, text]) =>
        createReasoningStep(type, text),
    ),
    explanation,
    context: EQUATION_CONTEXT,
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
    validationTokens: undefined,
  };
}

function createEquationDefinition(
  motifId: string,
  difficulty: DifficultyLabel,
): EquationDefinition {
  switch (motifId) {
    case "eqn-lin-single":
    case "eqn-lin-fractional": {
      return {
        motifId,
        branch: "linear-balance",
        text: `Solve the equation $5x-7=2x+11$.`,
        values: { leftX: 5, rightX: 2, constantGap: 18 },
        answer: opt("x=6", 6),
        formula: "(d-b)/(a-c)",
        steps: [
          ["direct", `Move variable terms to one side: $5x-2x=11+7$.`],
          ["direct", `$3x=18$, so $x=6$.`],
        ],
        distractors: [
          opt("x=-6", -6),
          opt("x=3", 3),
          opt("x=18", 18),
        ],
        distractorLabels: [
          "Sign_Flip_Vieta",
          "Substitution_Direction_Flip",
          "Integer_Constraint_Violation",
        ],
        tokens: ["5x", "2x", "x"],
      };
    }

    case "eqn-lin-simultaneous": {
      return {
        motifId,
        branch: "elimination-two-variable",
        text: `Solve the system $\\begin{cases}2x+y=11\\\\x-y=1\\end{cases}$. Find $x+y$.`,
        values: { x: 4, y: 3 },
        answer: opt("7", 7),
        formula: "elimination",
        steps: [
          ["multi-step", `Add the equations: $(2x+y)+(x-y)=11+1$.`],
          ["direct", `$3x=12$, so $x=4$. Then $4-y=1$, so $y=3$.`],
          ["direct", `Therefore $x+y=4+3=7$.`],
        ],
        distractors: [
          opt("4", 4),
          opt("3", 3),
          opt("8", 8),
        ],
        distractorLabels: [
          "Substitution_Direction_Flip",
          "Integer_Constraint_Violation",
          "Sign_Flip_Vieta",
        ],
        tokens: ["\\begin{cases}", "x", "y"],
      };
    }

    case "eqn-lin-consistency":
    case "eqn-lin-parameter": {
      return {
        motifId,
        branch: "ratio-consistency",
        text: `For the system $\\begin{cases}2x+3y=5\\\\4x+6y=11\\end{cases}$, determine the nature of solution. Use $1$ for unique solution, $0$ for no solution, and $-1$ for infinite solutions.`,
        values: { r1: 2, r2: 2, r3: 5 / 11 },
        answer: opt("0", 0),
        formula: "a1/a2 = b1/b2 != c1/c2",
        steps: [
          ["conditional", `Compare ratios: $\\frac{2}{4}=\\frac{3}{6}=\\frac{1}{2}$.`],
          ["conditional", `But $\\frac{5}{11}\\ne\\frac{1}{2}$. Hence the lines are parallel and inconsistent.`],
          ["direct", `So the system has no solution, coded as $0$.`],
        ],
        distractors: [
          opt("-1", -1),
          opt("1", 1),
          opt("2", 2),
        ],
        distractorLabels: [
          "Inconsistent_Infinite_Swap",
          "Consistent_Ratio_Inversion",
          "Substitution_Direction_Flip",
        ],
        tokens: ["\\frac", "no solution", "infinite"],
      };
    }

    case "eqn-lin-integer-only": {
      return {
        motifId,
        branch: "positive-diophantine",
        text: `Find the number of positive integer solutions of $3x+5y=31$.`,
        values: { a: 3, b: 5, c: 31 },
        answer: opt("2", 2),
        formula: "3x + 5y = 31",
        steps: [
          ["conditional", `Since $3x=31-5y$, try positive $y$ values that make $31-5y$ divisible by $3$.`],
          ["conditional", `$y=2$ gives $x=7$, and $y=5$ gives $x=2$.`],
          ["direct", `Thus there are $2$ positive integer solutions.`],
        ],
        distractors: [
          opt("1", 1),
          opt("3", 3),
          opt("0", 0),
        ],
        distractorLabels: [
          "Integer_Constraint_Violation",
          "Denominator_Zero_Trap",
          "Substitution_Direction_Flip",
        ],
        tokens: ["positive integer", "3x", "5y"],
      };
    }

    case "eqn-quad-factor": {
      return {
        motifId,
        branch: "factor-integer-roots",
        text: `Solve $x^2-7x+12=0$. Find the larger root.`,
        values: { sum: 7, product: 12 },
        answer: opt("4", 4),
        formula: "factorization",
        steps: [
          ["direct", `Factorize: $x^2-7x+12=(x-3)(x-4)$.`],
          ["direct", `So $x=3$ or $x=4$. The larger root is $4$.`],
        ],
        distractors: [
          opt("3", 3),
          opt("-4", -4),
          opt("7", 7),
        ],
        distractorLabels: [
          "Square_Root_Principle_Error",
          "Sign_Flip_Vieta",
          "Root_Coefficient_Inversion",
        ],
        tokens: ["x^2", "larger root"],
      };
    }

    case "eqn-quad-formula": {
      return {
        motifId,
        branch: "surd-quadratic-formula",
        text: `Solve $x^2-4x+1=0$. Choose the larger root.`,
        values: { a: 1, b: -4, c: 1, d: 12 },
        answer: opt("2+\\sqrt{3}", 2 + Math.sqrt(3)),
        formula: "(-b + sqrt(D))/(2a)",
        steps: [
          ["multi-step", `Here $D=b^2-4ac=(-4)^2-4(1)(1)=12$.`],
          ["multi-step", `$x=\\frac{4\\pm\\sqrt{12}}{2}=2\\pm\\sqrt{3}$.`],
          ["direct", `The larger root is $2+\\sqrt{3}$.`],
        ],
        distractors: [
          opt("2-\\sqrt{3}", 2 - Math.sqrt(3)),
          opt("4+\\sqrt{3}", 4 + Math.sqrt(3)),
          opt("2+\\sqrt{5}", 2 + Math.sqrt(5)),
        ],
        distractorLabels: [
          "Surd_Rationalization_Slip",
          "Discriminant_Sign_Error",
          "Perfect_Square_Assumption",
        ],
        tokens: ["\\sqrt", "D", "larger root"],
      };
    }

    case "eqn-quad-nature":
    case "eqn-quad-equal-roots-param": {
      return {
        motifId,
        branch: "discriminant-nature",
        text: `For $3x^2-6x+3=0$, determine the nature of roots. Use $1$ for real and equal, $2$ for real and distinct, and $0$ for imaginary.`,
        values: { a: 3, b: -6, c: 3, d: 0 },
        answer: opt("1", 1),
        formula: "D=b^2-4ac",
        steps: [
          ["conditional", `Compute $D=b^2-4ac=(-6)^2-4(3)(3)=36-36=0$.`],
          ["direct", `Since $D=0$, the roots are real and equal.`],
        ],
        distractors: [
          opt("2", 2),
          opt("0", 0),
          opt("-1", -1),
        ],
        distractorLabels: [
          "Discriminant_Sign_Error",
          "Inconsistent_Infinite_Swap",
          "Leading_Zero_Neglect",
        ],
        tokens: ["D", "real", "equal"],
      };
    }

    case "eqn-quad-vieta": {
      return {
        motifId,
        branch: "vieta-sum-product",
        text: `If $\\alpha$ and $\\beta$ are roots of $2x^2-5x+3=0$, find $\\alpha+\\beta$.`,
        values: { a: 2, b: -5, c: 3 },
        answer: opt("\\frac{5}{2}", 2.5),
        formula: "-b/a",
        steps: [
          ["direct", `For $ax^2+bx+c=0$, $\\alpha+\\beta=-\\frac{b}{a}$.`],
          ["direct", `Here $a=2$ and $b=-5$, so $\\alpha+\\beta=-\\frac{-5}{2}=\\frac{5}{2}$.`],
        ],
        distractors: [
          opt("-\\frac{5}{2}", -2.5),
          opt("\\frac{3}{2}", 1.5),
          opt("\\frac{2}{3}", 2 / 3),
        ],
        distractorLabels: [
          "Sign_Flip_Vieta",
          "Root_Coefficient_Inversion",
          "Reciprocal_Sum_Linear",
        ],
        tokens: ["\\alpha", "\\beta", "\\frac"],
      };
    }

    case "eqn-quad-construct": {
      return {
        motifId,
        branch: "construct-from-roots",
        text: `Form the quadratic equation whose roots are $3$ and $5$. Choose the value of the constant term.`,
        values: { sum: 8, product: 15 },
        answer: opt("15", 15),
        formula: "x^2 - Sx + P = 0",
        steps: [
          ["direct", `If roots are $3$ and $5$, then sum $S=8$ and product $P=15$.`],
          ["direct", `Equation is $x^2-8x+15=0$, so the constant term is $15$.`],
        ],
        distractors: [
          opt("8", 8),
          opt("-15", -15),
          opt("-8", -8),
        ],
        distractorLabels: [
          "Root_Coefficient_Inversion",
          "Sign_Flip_Vieta",
          "Square_Root_Principle_Error",
        ],
        tokens: ["roots", "quadratic"],
      };
    }

    case "eqn-quad-symmetric": {
      return {
        motifId,
        branch: "symmetric-power-vieta",
        text: `If $\\alpha$ and $\\beta$ are roots of $x^2-6x+5=0$, find $\\alpha^2+\\beta^2$.`,
        values: { sum: 6, product: 5 },
        answer: opt("26", 26),
        formula: "(sum)^2 - 2product",
        steps: [
          ["multi-step", `By Vieta, $\\alpha+\\beta=6$ and $\\alpha\\beta=5$.`],
          ["multi-step", `$\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta=6^2-2(5)=26$.`],
        ],
        distractors: [
          opt("36", 36),
          opt("31", 31),
          opt("11", 11),
        ],
        distractorLabels: [
          "Symmetric_Power_Error",
          "Sign_Flip_Vieta",
          "Reciprocal_Sum_Linear",
        ],
        tokens: ["\\alpha^2", "\\beta^2"],
      };
    }

    case "eqn-quad-common-root": {
      return {
        motifId,
        branch: "common-root-identify",
        text: `The equations $x^2-5x+6=0$ and $x^2-7x+12=0$ have one common root. Find it.`,
        values: { common: 3 },
        answer: opt("3", 3),
        formula: "common factor",
        steps: [
          ["multi-step", `$x^2-5x+6=(x-2)(x-3)$.`],
          ["multi-step", `$x^2-7x+12=(x-3)(x-4)$.`],
          ["direct", `The common root is $3$.`],
        ],
        distractors: [
          opt("2", 2),
          opt("4", 4),
          opt("6", 6),
        ],
        distractorLabels: [
          "Common_Root_Partial",
          "Perfect_Square_Assumption",
          "Root_Coefficient_Inversion",
        ],
        tokens: ["common root", "x^2"],
      };
    }

    case "eqn-special-reciprocal": {
      return {
        motifId,
        branch: "reciprocal-to-quadratic",
        text: `If $x+\\frac{1}{x}=5$, find $x^2+\\frac{1}{x^2}$.`,
        values: { k: 5 },
        answer: opt("23", 23),
        formula: "k^2 - 2",
        steps: [
          ["multi-step", `Square both sides: $\\left(x+\\frac{1}{x}\\right)^2=25$.`],
          ["multi-step", `So $x^2+2+\\frac{1}{x^2}=25$.`],
          ["direct", `Therefore $x^2+\\frac{1}{x^2}=23$.`],
        ],
        distractors: [
          opt("25", 25),
          opt("5", 5),
          opt("\\frac{1}{5}", 0.2),
        ],
        distractorLabels: [
          "Symmetric_Power_Error",
          "Reciprocal_Sum_Linear",
          "Denominator_Zero_Trap",
        ],
        tokens: ["\\frac{1}{x}", "x^2"],
      };
    }

    case "eqn-special-reducible": {
      return {
        motifId,
        branch: "biquadratic-substitution",
        text: `Solve $x^4-5x^2+4=0$. Find the number of real roots.`,
        values: { roots: 4 },
        answer: opt("4", 4),
        formula: "let y=x^2",
        steps: [
          ["multi-step", `Let $y=x^2$. Then $y^2-5y+4=0$.`],
          ["multi-step", `$(y-1)(y-4)=0$, so $y=1$ or $y=4$.`],
          ["direct", `Thus $x=\\pm1,\\pm2$, giving $4$ real roots.`],
        ],
        distractors: [
          opt("2", 2),
          opt("1", 1),
          opt("0", 0),
        ],
        distractorLabels: [
          "Square_Root_Principle_Error",
          "Leading_Zero_Neglect",
          "Perfect_Square_Assumption",
        ],
        tokens: ["x^4", "real roots"],
      };
    }

    case "eqn-special-radical": {
      return {
        motifId,
        branch: "radical-validate-root",
        text: `Solve $\\sqrt{x+5}=x-1$. Choose the valid root.`,
        values: { root: 4 },
        answer: opt("4", 4),
        formula: "square and validate",
        steps: [
          ["multi-step", `Since $\\sqrt{x+5}=x-1$, we need $x\\ge1$.`],
          ["multi-step", `Squaring gives $x+5=(x-1)^2=x^2-2x+1$.`],
          ["multi-step", `So $x^2-3x-4=0$, giving $x=4$ or $x=-1$.`],
          ["conditional", `$x=-1$ is extraneous because $x\\ge1$ is required. Hence $x=4$.`],
        ],
        distractors: [
          opt("-1", -1),
          opt("1", 1),
          opt("5", 5),
        ],
        distractorLabels: [
          "Extraneous_Root_Trap",
          "Square_Root_Principle_Error",
          "Surd_Rationalization_Slip",
        ],
        tokens: ["\\sqrt", "valid root"],
      };
    }

    case "eqn-mod-single": {
      return {
        motifId,
        branch: "absolute-value-two-cases",
        text: `Solve $|2x-3|=7$. Find the sum of all solutions.`,
        values: { sum: 3 },
        answer: opt("3", 3),
        formula: "|A|=c => A=±c",
        steps: [
          ["conditional", `Split into two cases: $2x-3=7$ or $2x-3=-7$.`],
          ["multi-step", `The solutions are $x=5$ and $x=-2$.`],
          ["direct", `Their sum is $5+(-2)=3$.`],
        ],
        distractors: [
          opt("5", 5),
          opt("-2", -2),
          opt("7", 7),
        ],
        distractorLabels: [
          "Modulus_Case_Omission",
          "Modulus_Distance_Error",
          "Square_Root_Principle_Error",
        ],
        tokens: ["|2x-3|", "solutions"],
      };
    }

    case "eqn-mod-double":
    case "eqn-mod-nested":
    case "eqn-mod-interval-count": {
      return {
        motifId,
        branch: "distance-critical-points",
        text: `Find the number of real solutions of $|x-2|+|x-8|=6$.`,
        values: { count: 999 },
        answer: opt("\\text{Infinitely many}", 999),
        formula: "distance between 2 and 8",
        steps: [
          ["conditional", `$|x-2|+|x-8|$ is the sum of distances from $2$ and $8$.`],
          ["conditional", `For every $x$ between $2$ and $8$, the sum of distances is exactly $6$.`],
          ["direct", `Hence there are infinitely many real solutions.`],
        ],
        distractors: [
          opt("2", 2),
          opt("1", 1),
          opt("0", 0),
        ],
        distractorLabels: [
          "Modulus_Case_Omission",
          "Modulus_Distance_Error",
          "Integer_Constraint_Violation",
        ],
        tokens: ["|x-2|", "real solutions"],
      };
    }

    case "eqn-word-age": {
      return {
        motifId,
        branch: "age-timeline",
        text: `A father is $3$ times as old as his son. After $12$ years, he will be twice as old as his son. Find the son's present age.`,
        values: { son: 12 },
        answer: opt("12", 12),
        formula: "3s + 12 = 2(s + 12)",
        steps: [
          ["multi-step", `Let the son's present age be $s$. Then father's age is $3s$.`],
          ["multi-step", `After $12$ years: $3s+12=2(s+12)$.`],
          ["direct", `So $3s+12=2s+24$, hence $s=12$.`],
        ],
        distractors: [
          opt("6", 6),
          opt("24", 24),
          opt("18", 18),
        ],
        distractorLabels: [
          "Age_Timeline_Shift",
          "Substitution_Direction_Flip",
          "Integer_Constraint_Violation",
        ],
        tokens: ["father", "son", "years"],
      };
    }

    case "eqn-word-digits": {
      return {
        motifId,
        branch: "two-digit-reversal",
        text: `The sum of digits of a two-digit number is $9$. When the digits are reversed, the number decreases by $27$. Find the original number.`,
        values: { number: 63 },
        answer: opt("63", 63),
        formula: "10a+b",
        steps: [
          ["multi-step", `Let the number be $10a+b$. Then $a+b=9$.`],
          ["multi-step", `Reversed number is $10b+a$, and $(10a+b)-(10b+a)=27$.`],
          ["multi-step", `So $9(a-b)=27$, giving $a-b=3$.`],
          ["direct", `Solving $a+b=9$ and $a-b=3$ gives $a=6$, $b=3$. Original number is $63$.`],
        ],
        distractors: [
          opt("36", 36),
          opt("54", 54),
          opt("72", 72),
        ],
        distractorLabels: [
          "Digit_Interchange_Sum",
          "Substitution_Direction_Flip",
          "Integer_Constraint_Violation",
        ],
        tokens: ["digits", "reversed"],
      };
    }

    case "eqn-word-fixed-variable":
    case "eqn-word-break-even": {
      return {
        motifId,
        branch: "fixed-variable-cost",
        text: `A taxi charges $₹50$ fixed fare and $₹12$ per km after that. If the total fare is $₹194$, find the distance travelled in km.`,
        values: { distance: 12 },
        answer: opt("12", 12),
        formula: "50 + 12x = 194",
        steps: [
          ["multi-step", `Let the distance be $x$ km. The equation is $50+12x=194$.`],
          ["direct", `$12x=144$, so $x=12$.`],
        ],
        distractors: [
          opt("16", 16),
          opt("10", 10),
          opt("14", 14),
        ],
        distractorLabels: [
          "Substitution_Direction_Flip",
          "Integer_Constraint_Violation",
          "Age_Timeline_Shift",
        ],
        tokens: ["₹", "12x"],
      };
    }

    case "eqn-word-geometry": {
      return {
        motifId,
        branch: "rectangle-quadratic",
        text: `The length of a rectangle is $5$ cm more than its breadth. Its area is $84\\text{ cm}^2$. Find the breadth.`,
        values: { breadth: 7 },
        answer: opt("7\\text{ cm}", 7),
        formula: "b(b+5)=84",
        steps: [
          ["multi-step", `Let the breadth be $b$ cm. Then length is $(b+5)$ cm.`],
          ["multi-step", `Area equation: $b(b+5)=84$, so $b^2+5b-84=0$.`],
          ["multi-step", `$(b+12)(b-7)=0$. Since breadth is positive, $b=7\\text{ cm}$.`],
        ],
        distractors: [
          opt("12\\text{ cm}", 12),
          opt("5\\text{ cm}", 5),
          opt("17\\text{ cm}", 17),
        ],
        distractorLabels: [
          "Integer_Constraint_Violation",
          "Substitution_Direction_Flip",
          "Square_Root_Principle_Error",
        ],
        tokens: ["rectangle", "area"],
      };
    }

    default: {
      if (difficulty === "Hard") {
        return createEquationDefinition(
          "eqn-special-radical",
          difficulty,
        );
      }
      return createEquationDefinition(
        "eqn-lin-single",
        difficulty,
      );
    }
  }
}

function createScenarioFromMotif(
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) {
  return finalizeEquationScenario(
    createEquationDefinition(
      motif?.id ?? "eqn-lin-single",
      difficulty,
    ),
  );
}

const PATTERN_FACTORIES: Record<
  string,
  EquationScenarioFactory[]
> = {
  equations: [
    () => createScenarioFromMotif("Medium", { id: "eqn-lin-single" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "eqn-quad-factor" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "eqn-quad-vieta" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "eqn-mod-single" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "eqn-word-age" } as QuantMotif),
  ],
  "equations-linear": [
    () => createScenarioFromMotif("Medium", { id: "eqn-lin-single" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "eqn-lin-simultaneous" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "eqn-lin-consistency" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "eqn-lin-integer-only" } as QuantMotif),
  ],
  "equations-quadratic": [
    () => createScenarioFromMotif("Medium", { id: "eqn-quad-factor" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "eqn-quad-nature" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "eqn-quad-vieta" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "eqn-quad-formula" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "eqn-quad-symmetric" } as QuantMotif),
  ],
  "equations-special": [
    () => createScenarioFromMotif("Medium", { id: "eqn-special-reciprocal" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "eqn-special-reducible" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "eqn-special-radical" } as QuantMotif),
  ],
  "equations-modulus": [
    () => createScenarioFromMotif("Medium", { id: "eqn-mod-single" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "eqn-mod-double" } as QuantMotif),
  ],
  "equations-word-problems": [
    () => createScenarioFromMotif("Medium", { id: "eqn-word-age" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "eqn-word-digits" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "eqn-word-fixed-variable" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "eqn-word-geometry" } as QuantMotif),
  ],
};

const PATTERN_ALLOWED_MOTIFS: Record<
  string,
  string[]
> = {
  "equations-linear": [
    "eqn-lin-single",
    "eqn-lin-simultaneous",
  ],
  "equations-quadratic": [
    "eqn-quad-factor",
    "eqn-quad-formula",
    "eqn-quad-vieta",
    "eqn-quad-symmetric",
  ],
  "equations-special": [
    "eqn-poly-cubic",
    "eqn-special-reciprocal",
    "eqn-special-reducible",
    "eqn-special-radical",
    "eqn-special-fractional",
    "eqn-root-ap",
    "eqn-root-gp",
  ],
  "equations-modulus": [
    "eqn-mod-single",
    "eqn-mod-double",
    "eqn-mod-nested",
    "eqn-mod-interval-count",
  ],
  "equations-word-problems": [
    "eqn-word-age",
    "eqn-word-digits",
    "eqn-word-fixed-variable",
    "eqn-word-geometry",
    "eqn-word-mixture-count",
    "eqn-word-motion-linear",
    "eqn-word-work-rate",
    "eqn-word-break-even",
  ],
};

function resolveEquationPatternKey(
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

export function createEquationsScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const patternKey =
    resolveEquationPatternKey(pattern);
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
    PATTERN_FACTORIES.equations;

  return pickRandomItem(factories)(
    difficulty,
    motif,
  );
}
