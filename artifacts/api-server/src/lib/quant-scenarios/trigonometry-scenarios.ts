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

type TrigOption = {
  label: string;
  value: number;
};

type TrigDefinition = {
  motifId: string;
  branch: string;
  text: string;
  values: Record<string, number>;
  answer: TrigOption;
  formula: string;
  steps: Array<[Parameters<typeof createReasoningStep>[0], string]>;
  distractors: TrigOption[];
  distractorLabels: string[];
  tokens?: string[];
};

type TrigFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

const TRIG_CONTEXT: QuantScenarioContext = {
  entity: "trigonometric expression",
  metric: "required value",
  context: "trigonometry",
};

const opt = (
  label: string,
  value: number,
): TrigOption => ({
  label,
  value,
});

function optionValue(option: TrigOption) {
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
  correctAnswer: TrigOption,
  distractors: TrigOption[],
  labels: string[],
) {
  const candidates = [
    correctAnswer,
    ...distractors,
  ];
  const unique: TrigOption[] = [];
  for (const candidate of candidates) {
    if (
      !unique.some(
        (item) =>
          item.label === candidate.label,
      )
    ) {
      unique.push(candidate);
    }
  }
  while (unique.length < 4) {
    unique.push(
      opt(`${unique.length + 2}`, unique.length + 2),
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
              "plausible trigonometric slip",
            reasoningTrap:
              labels[index - 1] ??
              "wrong identity or angle value",
          },
    );
  return {
    options: values.map(optionValue),
    correct: 0,
    optionMetadata,
  };
}

function finalizeTrigScenario(
  definition: TrigDefinition,
): QuantProceduralScenario {
  const explanation = [
    ...definition.steps.map(
      ([, text]) => text,
    ),
    `Final answer = $${definition.answer.label}$.`,
  ].join("\n");

  return {
    scenarioType: definition.motifId,
    topicCluster: "trigonometry",
    values: definition.values,
    formula: definition.formula,
    text: definition.text,
    correctAnswer:
      definition.answer.value,
    reasoningSteps: definition.steps.map(
      ([type, text]) =>
        createReasoningStep(type, text),
    ),
    explanation,
    context: TRIG_CONTEXT,
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

function createTrigDefinition(
  motifId: string,
  difficulty: DifficultyLabel,
): TrigDefinition {
  switch (motifId) {
    case "trig-ratio-sides": {
      return {
        motifId,
        branch: "right-triangle-sine",
        text: `In right $\\Delta ABC$, $\\angle B=90^\\circ$, $AB=5$, $BC=12$, and $AC=13$. Find $\\sin A$.`,
        values: { opposite: 12, hypotenuse: 13 },
        answer: opt("\\frac{12}{13}", 12 / 13),
        formula: "opposite / hypotenuse",
        steps: [
          [
            "direct",
            `For $\\angle A$, opposite side is $BC=12$ and hypotenuse is $AC=13$.`,
          ],
          [
            "direct",
            `$\\sin A=\\frac{\\text{opposite}}{\\text{hypotenuse}}=\\frac{12}{13}$.`,
          ],
        ],
        distractors: [
          opt("\\frac{5}{13}", 5 / 13),
          opt("\\frac{12}{5}", 12 / 5),
          opt("\\frac{5}{12}", 5 / 12),
        ],
        distractorLabels: [
          "Ratio_Definition_Flip",
          "Identity_Cross_Product",
          "Ratio_Definition_Flip",
        ],
        tokens: ["\\sin", "90"],
      };
    }

    case "trig-ratio-solve": {
      return {
        motifId,
        branch: "sin-given-sec-plus-tan",
        text: `If $\\sin\\theta=\\frac{5}{13}$ and $\\theta$ is acute, find $\\sec\\theta+\\tan\\theta$.`,
        values: { sinNumerator: 5, hypotenuse: 13 },
        answer: opt("\\frac{3}{2}", 1.5),
        formula: "sec + tan",
        steps: [
          [
            "inferential",
            `From $\\sin\\theta=\\frac{5}{13}$, the adjacent side is $\\sqrt{13^2-5^2}=12$.`,
          ],
          [
            "multi-step",
            `$\\sec\\theta=\\frac{13}{12}$ and $\\tan\\theta=\\frac{5}{12}$, so $\\sec\\theta+\\tan\\theta=\\frac{18}{12}=\\frac{3}{2}$.`,
          ],
        ],
        distractors: [
          opt("\\frac{18}{13}", 18 / 13),
          opt("\\frac{12}{13}", 12 / 13),
          opt("\\frac{13}{5}", 13 / 5),
        ],
        distractorLabels: [
          "Ratio_Definition_Flip",
          "Reciprocal_Mixup",
          "Reciprocal_Mixup",
        ],
        tokens: ["\\sin", "\\sec", "\\tan"],
      };
    }

    case "trig-reciprocal-id": {
      return {
        motifId,
        branch: "reciprocal-product",
        text: `Evaluate $\\sin\\theta\\cdot\\csc\\theta+\\cos\\theta\\cdot\\sec\\theta$.`,
        values: {},
        answer: opt("2", 2),
        formula: "1 + 1",
        steps: [
          [
            "direct",
            `$\\sin\\theta\\cdot\\csc\\theta=1$ and $\\cos\\theta\\cdot\\sec\\theta=1$.`,
          ],
          [
            "direct",
            `Therefore the value is $1+1=2$.`,
          ],
        ],
        distractors: [
          opt("1", 1),
          opt("0", 0),
          opt("\\sin\\theta+\\cos\\theta", 1.4),
        ],
        distractorLabels: [
          "Reciprocal_Mixup",
          "Pythagorean_Sign_Error",
          "Identity_Cross_Product",
        ],
      };
    }

    case "trig-pythagorean-sum": {
      return {
        motifId,
        branch: "tan-sec-identity",
        text: `If $\\tan\\theta=\\frac{3}{4}$, find $\\sec^2\\theta$.`,
        values: { tanNumerator: 3, tanDenominator: 4 },
        answer: opt("\\frac{25}{16}", 25 / 16),
        formula: "1 + tan^2",
        steps: [
          [
            "conditional",
            `Use $1+\\tan^2\\theta=\\sec^2\\theta$.`,
          ],
          [
            "direct",
            `$\\sec^2\\theta=1+\\left(\\frac{3}{4}\\right)^2=1+\\frac{9}{16}=\\frac{25}{16}$.`,
          ],
        ],
        distractors: [
          opt("\\frac{7}{16}", 7 / 16),
          opt("\\frac{9}{16}", 9 / 16),
          opt("\\frac{16}{25}", 16 / 25),
        ],
        distractorLabels: [
          "Pythagorean_Sign_Error",
          "Identity_Cross_Product",
          "Reciprocal_Mixup",
        ],
        tokens: ["\\tan", "\\sec"],
      };
    }

    case "trig-val-eval": {
      return {
        motifId,
        branch: "standard-angle-fraction",
        text: `Evaluate $\\frac{\\tan45^\\circ}{\\sin30^\\circ+\\cos60^\\circ}$.`,
        values: { angle: 45 },
        answer: opt("1", 1),
        formula: "tan45 / (sin30 + cos60)",
        steps: [
          [
            "direct",
            `$\\tan45^\\circ=1$, $\\sin30^\\circ=\\frac{1}{2}$, and $\\cos60^\\circ=\\frac{1}{2}$.`,
          ],
          [
            "direct",
            `Value $=\\frac{1}{\\frac{1}{2}+\\frac{1}{2}}=1$.`,
          ],
        ],
        distractors: [
          opt("2", 2),
          opt("\\frac{1}{2}", 0.5),
          opt("\\sqrt{3}", Math.sqrt(3)),
        ],
        distractorLabels: [
          "Angle_Value_Inversion",
          "Evaluation_Order_Error",
          "Angle_Value_Inversion",
        ],
        tokens: ["\\tan", "45"],
      };
    }

    case "trig-val-power": {
      return {
        motifId,
        branch: "standard-angle-powers",
        text: `Evaluate $\\sin^2 45^\\circ+\\cos^2 45^\\circ$.`,
        values: { angle: 45 },
        answer: opt("1", 1),
        formula: "sin^2 45 + cos^2 45",
        steps: [
          [
            "direct",
            `Use $\\sin^2\\theta+\\cos^2\\theta=1$.`,
          ],
          [
            "direct",
            `So $\\sin^2 45^\\circ+\\cos^2 45^\\circ=1$.`,
          ],
        ],
        distractors: [
          opt("\\frac{1}{2}", 0.5),
          opt("2", 2),
          opt("\\frac{3}{4}", 0.75),
        ],
        distractorLabels: [
          "Evaluation_Order_Error",
          "Angle_Value_Inversion",
          "Pythagorean_Sign_Error",
        ],
      };
    }

    case "trig-val-eqn":
    case "trig-equation-standard": {
      return {
        motifId,
        branch: "standard-angle-equation",
        text: `If $\\sqrt{3}\\tan\\theta-1=0$ and $0^\\circ<\\theta<90^\\circ$, find $\\theta$.`,
        values: { angle: 30 },
        answer: opt("30^\\circ", 30),
        formula: "tan theta = 1/sqrt(3)",
        steps: [
          [
            "conditional",
            `$\\sqrt{3}\\tan\\theta-1=0$ gives $\\tan\\theta=\\frac{1}{\\sqrt{3}}$.`,
          ],
          [
            "direct",
            `Since $\\tan30^\\circ=\\frac{1}{\\sqrt{3}}$, $\\theta=30^\\circ$.`,
          ],
        ],
        distractors: [
          opt("60^\\circ", 60),
          opt("45^\\circ", 45),
          opt("90^\\circ", 90),
        ],
        distractorLabels: [
          "Angle_Value_Inversion",
          "Rationalization_Slip",
          "Tangent_90_Zero",
        ],
      };
    }

    case "trig-comp-shift": {
      return {
        motifId,
        branch: "complementary-cos",
        text: `Simplify $\\sin(90^\\circ-\\theta)-\\cos\\theta$.`,
        values: {},
        answer: opt("0", 0),
        formula: "sin(90-theta)-cos(theta)",
        steps: [
          [
            "conditional",
            `Use $\\sin(90^\\circ-\\theta)=\\cos\\theta$.`,
          ],
          [
            "direct",
            `Thus $\\sin(90^\\circ-\\theta)-\\cos\\theta=0$.`,
          ],
        ],
        distractors: [
          opt("1", 1),
          opt("\\sec\\theta-\\cos\\theta", 0.8),
          opt("2\\cos\\theta", 2),
        ],
        distractorLabels: [
          "Complementary_Function_Swap",
          "Complementary_Function_Swap",
          "Evaluation_Order_Error",
        ],
      };
    }

    case "trig-comp-series-prod": {
      return {
        motifId,
        branch: "tan-product-complement",
        text: `Find the value of $\\tan1^\\circ\\cdot\\tan2^\\circ\\cdots\\tan89^\\circ$.`,
        values: {},
        answer: opt("1", 1),
        formula: "tan a * tan(90-a)",
        steps: [
          [
            "inferential",
            `Pair $\\tan\\theta$ with $\\tan(90^\\circ-\\theta)=\\cot\\theta$.`,
          ],
          [
            "multi-step",
            `Each pair has product $1$, and $\\tan45^\\circ=1$, so the total product is $1$.`,
          ],
        ],
        distractors: [
          opt("0", 0),
          opt("89", 89),
          opt("\\text{Undefined}", 999),
        ],
        distractorLabels: [
          "Series_Boundary_Error",
          "Additive_Counting_Trap",
          "Tangent_90_Zero",
        ],
      };
    }

    case "trig-comp-series-sum": {
      return {
        motifId,
        branch: "sine-square-series",
        text: `Find $\\sin^2 1^\\circ+\\sin^2 2^\\circ+\\cdots+\\sin^2 89^\\circ$.`,
        values: {},
        answer: opt("\\frac{89}{2}", 44.5),
        formula: "paired sine squares",
        steps: [
          [
            "inferential",
            `Pair $\\sin^2\\theta$ with $\\sin^2(90^\\circ-\\theta)=\\cos^2\\theta$.`,
          ],
          [
            "multi-step",
            `There are $44$ such pairs, each summing to $1$, plus $\\sin^245^\\circ=\\frac{1}{2}$. Total $=44+\\frac{1}{2}=\\frac{89}{2}$.`,
          ],
        ],
        distractors: [
          opt("45", 45),
          opt("44", 44),
          opt("\\frac{90}{2}", 45),
        ],
        distractorLabels: [
          "Series_Boundary_Error",
          "Series_Boundary_Error",
          "Pythagorean_Sign_Error",
        ],
      };
    }

    case "trig-hd-elevation":
    case "trig-hd-shadow":
    case "trig-hd-ladder": {
      return {
        motifId,
        branch: "tower-elevation-60",
        text: `From a point $10$ m away from the foot of a tower, the angle of elevation of the top is $60^\\circ$. Find the height of the tower.`,
        values: { distance: 10, angle: 60 },
        answer: opt("10\\sqrt{3}\\text{ m}", 10 * Math.sqrt(3)),
        formula: "h = d tan theta",
        steps: [
          [
            "conditional",
            `Use $\\tan\\theta=\\frac{\\text{height}}{\\text{distance}}$.`,
          ],
          [
            "direct",
            `$h=10\\tan60^\\circ=10\\sqrt{3}\\text{ m}$.`,
          ],
        ],
        distractors: [
          opt("\\frac{10}{\\sqrt{3}}\\text{ m}", 10 / Math.sqrt(3)),
          opt("10\\text{ m}", 10),
          opt("20\\text{ m}", 20),
        ],
        distractorLabels: [
          "HD_Shadow_Ratio_Error",
          "Angle_Value_Inversion",
          "Ratio_Definition_Flip",
        ],
        tokens: ["elevation", "tower"],
      };
    }

    case "trig-hd-two-point": {
      return {
        motifId,
        branch: "two-point-tower",
        text: `The angle of elevation of the top of a tower is $30^\\circ$ from a point on the ground. After moving $20$ m towards the tower, it becomes $60^\\circ$. Find the height of the tower.`,
        values: { shift: 20 },
        answer: opt("10\\sqrt{3}\\text{ m}", 10 * Math.sqrt(3)),
        formula: "h/tan30 - h/tan60 = 20",
        steps: [
          [
            "multi-step",
            `Let height be $h$. Distances are $\\frac{h}{\\tan30^\\circ}$ and $\\frac{h}{\\tan60^\\circ}$.`,
          ],
          [
            "inferential",
            `$\\sqrt{3}h-\\frac{h}{\\sqrt{3}}=20$, so $h=10\\sqrt{3}\\text{ m}$.`,
          ],
        ],
        distractors: [
          opt("20\\sqrt{3}\\text{ m}", 20 * Math.sqrt(3)),
          opt("10\\text{ m}", 10),
          opt("30\\text{ m}", 30),
        ],
        distractorLabels: [
          "HD_Distance_Sum_Error",
          "HD_Shadow_Ratio_Error",
          "Angle_Value_Inversion",
        ],
      };
    }

    case "trig-hd-depression": {
      return {
        motifId,
        branch: "cliff-depression",
        text: `From the top of a $30$ m cliff, the angle of depression of a boat is $30^\\circ$. Find the horizontal distance of the boat from the foot of the cliff.`,
        values: { height: 30, angle: 30 },
        answer: opt("30\\sqrt{3}\\text{ m}", 30 * Math.sqrt(3)),
        formula: "distance = height / tan theta",
        steps: [
          [
            "conditional",
            `Angle of depression equals the angle of elevation from the boat.`,
          ],
          [
            "direct",
            `$\\tan30^\\circ=\\frac{30}{d}$, so $d=30\\sqrt{3}\\text{ m}$.`,
          ],
        ],
        distractors: [
          opt("10\\sqrt{3}\\text{ m}", 10 * Math.sqrt(3)),
          opt("30\\text{ m}", 30),
          opt("\\frac{30}{\\sqrt{3}}\\text{ m}", 30 / Math.sqrt(3)),
        ],
        distractorLabels: [
          "HD_Shadow_Ratio_Error",
          "Angle_Value_Inversion",
          "Ratio_Definition_Flip",
        ],
      };
    }

    case "trig-hd-broken-tree": {
      return {
        motifId,
        branch: "broken-tree-30",
        text: `A tree is broken by wind and its top touches the ground $10$ m from its foot, making an angle of $30^\\circ$ with the ground. Find the length of the broken part.`,
        values: { distance: 10, angle: 30 },
        answer: opt("\\frac{20}{\\sqrt{3}}\\text{ m}", 20 / Math.sqrt(3)),
        formula: "cos theta = base / hypotenuse",
        steps: [
          [
            "conditional",
            `The broken part is the hypotenuse of the right triangle.`,
          ],
          [
            "direct",
            `$\\cos30^\\circ=\\frac{10}{L}$, so $L=\\frac{20}{\\sqrt{3}}\\text{ m}$.`,
          ],
        ],
        distractors: [
          opt("10\\sqrt{3}\\text{ m}", 10 * Math.sqrt(3)),
          opt("20\\text{ m}", 20),
          opt("5\\sqrt{3}\\text{ m}", 5 * Math.sqrt(3)),
        ],
        distractorLabels: [
          "Ratio_Definition_Flip",
          "Angle_Value_Inversion",
          "HD_Shadow_Ratio_Error",
        ],
      };
    }

    case "trig-alg-sec-tan-link": {
      return {
        motifId,
        branch: "sec-tan-reciprocal-link",
        text: `If $\\sec\\theta+\\tan\\theta=4$, find $\\sec\\theta-\\tan\\theta$.`,
        values: { x: 4 },
        answer: opt("\\frac{1}{4}", 0.25),
        formula: "(sec+tan)(sec-tan)=1",
        steps: [
          [
            "conditional",
            `Use $(\\sec\\theta+\\tan\\theta)(\\sec\\theta-\\tan\\theta)=\\sec^2\\theta-\\tan^2\\theta=1$.`,
          ],
          [
            "direct",
            `So $\\sec\\theta-\\tan\\theta=\\frac{1}{4}$.`,
          ],
        ],
        distractors: [
          opt("4", 4),
          opt("\\frac{3}{4}", 0.75),
          opt("\\frac{15}{4}", 3.75),
        ],
        distractorLabels: [
          "Sec_Tan_Linear_Assumption",
          "Pythagorean_Sign_Error",
          "Evaluation_Order_Error",
        ],
      };
    }

    case "trig-alg-csc-cot-link": {
      return {
        motifId,
        branch: "csc-cot-reciprocal-link",
        text: `If $\\csc\\theta+\\cot\\theta=5$, find $\\csc\\theta-\\cot\\theta$.`,
        values: { x: 5 },
        answer: opt("\\frac{1}{5}", 0.2),
        formula: "(csc+cot)(csc-cot)=1",
        steps: [
          [
            "conditional",
            `Use $\\csc^2\\theta-\\cot^2\\theta=1$.`,
          ],
          [
            "direct",
            `Thus $\\csc\\theta-\\cot\\theta=\\frac{1}{5}$.`,
          ],
        ],
        distractors: [
          opt("5", 5),
          opt("\\frac{4}{5}", 0.8),
          opt("\\frac{24}{5}", 4.8),
        ],
        distractorLabels: [
          "Sec_Tan_Linear_Assumption",
          "Cosecant_Cot_Sign",
          "Evaluation_Order_Error",
        ],
      };
    }

    case "trig-id-double-angle": {
      return {
        motifId,
        branch: "double-angle-sine",
        text: `If $\\sin\\theta=\\frac{3}{5}$ and $\\cos\\theta=\\frac{4}{5}$, find $\\sin2\\theta$.`,
        values: { sin: 3, cos: 4 },
        answer: opt("\\frac{24}{25}", 24 / 25),
        formula: "2 sin theta cos theta",
        steps: [
          [
            "conditional",
            `Use $\\sin2\\theta=2\\sin\\theta\\cos\\theta$.`,
          ],
          [
            "direct",
            `$\\sin2\\theta=2\\times\\frac{3}{5}\\times\\frac{4}{5}=\\frac{24}{25}$.`,
          ],
        ],
        distractors: [
          opt("\\frac{6}{5}", 1.2),
          opt("\\frac{7}{5}", 1.4),
          opt("\\frac{12}{25}", 12 / 25),
        ],
        distractorLabels: [
          "Double_Angle_Linear",
          "Evaluation_Order_Error",
          "Factor_2_Omission",
        ],
      };
    }

    case "trig-max-min": {
      return {
        motifId,
        branch: "a-sin-plus-b-cos",
        text: `Find the maximum value of $3\\sin\\theta+4\\cos\\theta$.`,
        values: { a: 3, b: 4 },
        answer: opt("5", 5),
        formula: "sqrt(a^2 + b^2)",
        steps: [
          [
            "inferential",
            `The maximum of $a\\sin\\theta+b\\cos\\theta$ is $\\sqrt{a^2+b^2}$.`,
          ],
          [
            "direct",
            `Maximum $=\\sqrt{3^2+4^2}=5$.`,
          ],
        ],
        distractors: [
          opt("7", 7),
          opt("25", 25),
          opt("1", 1),
        ],
        distractorLabels: [
          "Max_Min_Arithmetic_Sum",
          "Sqrt_Omission_Max",
          "Evaluation_Order_Error",
        ],
      };
    }

    case "trig-quad-sign": {
      return {
        motifId,
        branch: "second-quadrant-cos",
        text: `Determine the sign of $\\cos120^\\circ$. Use $1$ for positive and $-1$ for negative.`,
        values: { angle: 120 },
        answer: opt("-1", -1),
        formula: "ASTC sign",
        steps: [
          [
            "conditional",
            `$120^\\circ$ lies in the second quadrant.`,
          ],
          [
            "direct",
            `In the second quadrant, $\\cos\\theta$ is negative, so the sign is $-1$.`,
          ],
        ],
        distractors: [
          opt("1", 1),
          opt("0", 0),
          opt("\\frac{1}{2}", 0.5),
        ],
        distractorLabels: [
          "Quadrant_Sign_Neglect",
          "Tangent_90_Zero",
          "Angle_Value_Inversion",
        ],
      };
    }

    case "trig-reduction-large": {
      return {
        motifId,
        branch: "large-angle-sine",
        text: `Find the exact value of $\\sin750^\\circ$.`,
        values: { angle: 750 },
        answer: opt("\\frac{1}{2}", 0.5),
        formula: "sin(750 mod 360)",
        steps: [
          [
            "conditional",
            `Reduce the angle: $750^\\circ=720^\\circ+30^\\circ$.`,
          ],
          [
            "direct",
            `$\\sin750^\\circ=\\sin30^\\circ=\\frac{1}{2}$.`,
          ],
        ],
        distractors: [
          opt("-\\frac{1}{2}", -0.5),
          opt("\\frac{\\sqrt{3}}{2}", Math.sqrt(3) / 2),
          opt("1", 1),
        ],
        distractorLabels: [
          "Quadrant_Sign_Neglect",
          "Angle_Value_Inversion",
          "Degree_Radian_Confusion",
        ],
      };
    }

    default:
      return createTrigDefinition(
        pickRandomItem([
          "trig-ratio-sides",
          "trig-ratio-solve",
          "trig-val-eval",
          "trig-pythagorean-sum",
          "trig-hd-elevation",
          "trig-alg-sec-tan-link",
          "trig-reduction-large",
        ]),
        difficulty,
      );
  }
}

function createScenarioFromMotif(
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) {
  return finalizeTrigScenario(
    createTrigDefinition(
      motif?.id ?? "trig-val-eval",
      difficulty,
    ),
  );
}

const PATTERN_FACTORIES: Record<
  string,
  TrigFactory[]
> = {
  trigonometry: [
    (difficulty) =>
      finalizeTrigScenario(
        createTrigDefinition(
          pickRandomItem([
            "trig-ratio-sides",
            "trig-ratio-solve",
            "trig-val-eval",
            "trig-pythagorean-sum",
            "trig-comp-shift",
            "trig-hd-elevation",
            "trig-alg-sec-tan-link",
            "trig-reduction-large",
          ]),
          difficulty,
        ),
      ),
  ],
  "trig-ratios": [
    (difficulty) =>
      finalizeTrigScenario(
        createTrigDefinition(
          pickRandomItem([
            "trig-ratio-sides",
            "trig-ratio-solve",
            "trig-reciprocal-id",
            "trig-pythagorean-sum",
          ]),
          difficulty,
        ),
      ),
  ],
  "trig-standard-values": [
    (difficulty) =>
      finalizeTrigScenario(
        createTrigDefinition(
          pickRandomItem([
            "trig-val-eval",
            "trig-val-power",
            "trig-val-eqn",
          ]),
          difficulty,
        ),
      ),
  ],
  "trig-complementary": [
    (difficulty) =>
      finalizeTrigScenario(
        createTrigDefinition(
          pickRandomItem([
            "trig-comp-shift",
            "trig-comp-series-prod",
            "trig-comp-series-sum",
          ]),
          difficulty,
        ),
      ),
  ],
  "trig-heights-distances": [
    (difficulty) =>
      finalizeTrigScenario(
        createTrigDefinition(
          pickRandomItem([
            "trig-hd-elevation",
            "trig-hd-two-point",
            "trig-hd-depression",
            "trig-hd-shadow",
            "trig-hd-broken-tree",
          ]),
          difficulty,
        ),
      ),
  ],
  "trig-identities": [
    (difficulty) =>
      finalizeTrigScenario(
        createTrigDefinition(
          pickRandomItem([
            "trig-alg-sec-tan-link",
            "trig-alg-csc-cot-link",
            "trig-id-double-angle",
            "trig-max-min",
          ]),
          difficulty,
        ),
      ),
  ],
  "trig-quadrants-reduction": [
    (difficulty) =>
      finalizeTrigScenario(
        createTrigDefinition(
          pickRandomItem([
            "trig-quad-sign",
            "trig-reduction-large",
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
  "trig-ratios": [
    "trig-ratio-sides",
    "trig-ratio-solve",
    "trig-reciprocal-id",
    "trig-pythagorean-sum",
  ],
  "trig-standard-values": [
    "trig-val-eval",
    "trig-val-power",
    "trig-val-eqn",
    "trig-equation-standard",
  ],
  "trig-complementary": [
    "trig-comp-shift",
    "trig-comp-series-prod",
    "trig-comp-series-sum",
  ],
  "trig-heights-distances": [
    "trig-hd-elevation",
    "trig-hd-two-point",
    "trig-hd-depression",
    "trig-hd-shadow",
    "trig-hd-broken-tree",
    "trig-hd-ladder",
    "trig-hd-opposite-points",
  ],
  "trig-identities": [
    "trig-alg-sec-tan-link",
    "trig-alg-csc-cot-link",
    "trig-id-double-angle",
    "trig-max-min",
    "trig-expression-simplify",
  ],
  "trig-quadrants-reduction": [
    "trig-quad-sign",
    "trig-reduction-large",
  ],
};

function resolveTrigPatternKey(
  pattern: Pattern,
) {
  const registryMatch =
    pattern.id.match(
      /^registry-((?:trig-[a-z-]+)|trigonometry)-(easy|medium|hard)$/i,
    );
  if (registryMatch?.[1]) {
    return registryMatch[1];
  }

  return pattern.id;
}

export function createTrigonometryScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const patternKey =
    resolveTrigPatternKey(pattern);
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
    PATTERN_FACTORIES.trigonometry;

  return pickRandomItem(factories)(
    difficulty,
    motif,
  );
}
