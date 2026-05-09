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

type CoordinateDefinition = {
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

type CoordinateScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

const COORDINATE_CONTEXT: QuantScenarioContext = {
  entity: "Cartesian figure",
  metric: "required coordinate measure",
  context: "coordinate-geometry",
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
  definition: CoordinateDefinition,
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

  for (const label of ["0", "1", "-1", "2", "5"]) {
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
          ? "Correct Cartesian formula path"
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

function finalizeCoordinateScenario(
  definition: CoordinateDefinition,
): QuantProceduralScenario {
  const explanation = [
    ...definition.steps.map(([, text]) => text),
    `Final answer = $${definition.answerLabel}$.`,
  ].join("\n");

  return {
    scenarioType: definition.motifId,
    topicCluster: "coordinate-geometry",
    values: definition.values,
    formula: definition.formula,
    text: definition.text,
    correctAnswer: definition.answer,
    reasoningSteps: definition.steps.map(
      ([type, text]) =>
        createReasoningStep(type, text),
    ),
    explanation,
    context: COORDINATE_CONTEXT,
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

function createCoordinateDefinition(
  motifId: string,
): CoordinateDefinition {
  switch (motifId) {
    case "coord-midpoint":
      return {
        motifId,
        branch: "midpoint-average",
        text: `A design grid has endpoints $A(2,4)$ and $B(8,10)$. Find the midpoint of $AB$.`,
        values: { x1: 2, y1: 4, x2: 8, y2: 10 },
        answer: 0,
        answerLabel: "(5,7)",
        formula: "((x1+x2)/2,(y1+y2)/2)",
        steps: [
          ["direct", `Midpoint formula is $M=\\left(\\frac{x_1+x_2}{2},\\frac{y_1+y_2}{2}\\right)$.`],
          ["direct", `So $M=\\left(\\frac{2+8}{2},\\frac{4+10}{2}\\right)=(5,7)$.`],
        ],
        distractors: [
          { value: 0, label: "(3,3)", trap: "Midpoint_Subtraction" },
          { value: 0, label: "(10,14)", trap: "Centroid_Denominator" },
          { value: 0, label: "(7,5)", trap: "Coordinate_Swap" },
        ],
      };

    case "coord-section-internal":
      return {
        motifId,
        branch: "internal-section",
        text: `Point $P$ divides $A(1,2)$ and $B(7,8)$ internally in the ratio $2:1$. Find $P$.`,
        values: { x1: 1, y1: 2, x2: 7, y2: 8, m: 2, n: 1 },
        answer: 0,
        answerLabel: "(5,6)",
        formula: "((mx2+nx1)/(m+n),(my2+ny1)/(m+n))",
        steps: [
          ["conditional", `Internal section formula is $P=\\left(\\frac{mx_2+nx_1}{m+n},\\frac{my_2+ny_1}{m+n}\\right)$.`],
          ["direct", `Thus $P=\\left(\\frac{2\\cdot7+1\\cdot1}{3},\\frac{2\\cdot8+1\\cdot2}{3}\\right)=(5,6)$.`],
        ],
        distractors: [
          { value: 0, label: "(3,4)", trap: "Section_Ratio_Flip" },
          { value: 0, label: "(4,5)", trap: "Midpoint_Subtraction" },
          { value: 0, label: "(6,5)", trap: "Coordinate_Swap" },
        ],
      };

    case "coord-section-external":
      return {
        motifId,
        branch: "external-section",
        text: `Point $P$ divides $A(1,2)$ and $B(7,8)$ externally in the ratio $2:1$. Find $P$.`,
        values: { x1: 1, y1: 2, x2: 7, y2: 8, m: 2, n: 1 },
        answer: 0,
        answerLabel: "(13,14)",
        formula: "((mx2-nx1)/(m-n),(my2-ny1)/(m-n))",
        steps: [
          ["conditional", `External section formula is $P=\\left(\\frac{mx_2-nx_1}{m-n},\\frac{my_2-ny_1}{m-n}\\right)$.`],
          ["direct", `So $P=\\left(\\frac{2\\cdot7-1\\cdot1}{1},\\frac{2\\cdot8-1\\cdot2}{1}\\right)=(13,14)$.`],
        ],
        distractors: [
          { value: 0, label: "(5,6)", trap: "External_Section_Plus" },
          { value: 0, label: "(3,4)", trap: "Section_Ratio_Flip" },
          { value: 0, label: "(14,13)", trap: "Coordinate_Swap" },
        ],
      };

    case "coord-centroid-tri":
      return {
        motifId,
        branch: "triangle-centroid",
        text: `A triangular plot has vertices $A(2,1)$, $B(8,4)$, and $C(5,10)$. Find its centroid.`,
        values: { x1: 2, y1: 1, x2: 8, y2: 4, x3: 5, y3: 10 },
        answer: 0,
        answerLabel: "(5,5)",
        formula: "((x1+x2+x3)/3,(y1+y2+y3)/3)",
        steps: [
          ["direct", `Centroid is $G=\\left(\\frac{x_1+x_2+x_3}{3},\\frac{y_1+y_2+y_3}{3}\\right)$.`],
          ["direct", `So $G=\\left(\\frac{2+8+5}{3},\\frac{1+4+10}{3}\\right)=(5,5)$.`],
        ],
        distractors: [
          { value: 0, label: "\\left(\\frac{15}{2},\\frac{15}{2}\\right)", trap: "Centroid_Denominator" },
          { value: 0, label: "(10,10)", trap: "Coordinate_Sum_Trap" },
          { value: 0, label: "(4,8)", trap: "Coordinate_Swap" },
        ],
      };

    case "coord-slope-find":
      return {
        motifId,
        branch: "slope-two-points",
        text: `Find the slope $m$ of the line through $A(1,2)$ and $B(5,10)$.`,
        values: { x1: 1, y1: 2, x2: 5, y2: 10 },
        answer: 2,
        answerLabel: "2",
        formula: "(y2-y1)/(x2-x1)",
        steps: [
          ["direct", `Slope formula is $m=\\frac{y_2-y_1}{x_2-x_1}$.`],
          ["direct", `So $m=\\frac{10-2}{5-1}=\\frac{8}{4}=2$.`],
        ],
        distractors: [
          { value: 0.5, label: "\\frac{1}{2}", trap: "Slope_Inversion" },
          { value: 3, label: "3", trap: "Distance_Formula_Plus" },
          { value: -2, label: "-2", trap: "Sign_Error" },
        ],
      };

    case "coord-line-eqn-point-slope":
      return {
        motifId,
        branch: "point-slope-y-intercept",
        text: `A road line passes through $(2,3)$ with slope $m=4$. Find its $y$-intercept.`,
        values: { x1: 2, y1: 3, m: 4 },
        answer: -5,
        answerLabel: "-5",
        formula: "y-y1=m(x-x1)",
        steps: [
          ["conditional", `Use $y-y_1=m(x-x_1)$.`],
          ["direct", `So $y-3=4(x-2)\\Rightarrow y=4x-5$.`],
          ["direct", `The $y$-intercept is $-5$.`],
        ],
        distractors: [
          { value: 5, label: "5", trap: "Equation_Normalization_Error" },
          { value: 4, label: "4", trap: "Slope_As_Answer" },
          { value: 3, label: "3", trap: "Point_Coordinate_As_Answer" },
        ],
      };

    case "coord-line-eqn-two-point":
      return {
        motifId,
        branch: "two-point-line-slope",
        text: `A line passes through $(1,3)$ and $(4,9)$. Find the coefficient of $x$ when the line is written as $y=mx+c$.`,
        values: { x1: 1, y1: 3, x2: 4, y2: 9 },
        answer: 2,
        answerLabel: "2",
        formula: "m=(y2-y1)/(x2-x1)",
        steps: [
          ["direct", `$m=\\frac{9-3}{4-1}=\\frac{6}{3}=2$.`],
          ["direct", `Thus the coefficient of $x$ in $y=mx+c$ is $2$.`],
        ],
        distractors: [
          { value: 0.5, label: "\\frac{1}{2}", trap: "Slope_Inversion" },
          { value: 3, label: "3", trap: "Coordinate_Difference_Trap" },
          { value: 6, label: "6", trap: "Run_Omission" },
        ],
      };

    case "coord-line-intercept-form":
    case "coord-line-axis-intercepts":
      return {
        motifId,
        branch: "axis-intercept-area",
        text: `A line cuts the axes at $A(6,0)$ and $B(0,8)$. Find the area of the triangle formed with the coordinate axes.`,
        values: { a: 6, b: 8 },
        answer: 24,
        answerLabel: "24",
        formula: "1/2 ab",
        steps: [
          ["conditional", `For intercepts $a$ and $b$, area with axes is $\\frac{1}{2}|ab|$.`],
          ["direct", `Area $=\\frac{1}{2}\\cdot6\\cdot8=24$.`],
        ],
        distractors: [
          { value: 48, label: "48", trap: "Intercept_Area_Factor" },
          { value: 14, label: "14", trap: "Origin_Distance_Linear" },
          { value: 28, label: "28", trap: "Perimeter_Trap" },
        ],
      };

    case "coord-rel-parallel":
      return {
        motifId,
        branch: "parallel-slope-check",
        text: `Use $1$ if the lines $2x-3y+5=0$ and $4x-6y-7=0$ are parallel, otherwise use $0$.`,
        values: { answer: 1 },
        answer: 1,
        answerLabel: "1",
        formula: "m=-a/b",
        steps: [
          ["conditional", `For $ax+by+c=0$, slope is $m=-\\frac{a}{b}$.`],
          ["direct", `First slope $=\\frac{2}{3}$ and second slope $=\\frac{4}{6}=\\frac{2}{3}$.`],
          ["direct", `Equal slopes imply parallel lines, so answer is $1$.`],
        ],
        distractors: [
          { value: 0, label: "0", trap: "Parallel_Slope_Reciprocal" },
          { value: 2, label: "2", trap: "Line_Consistency_Confusion" },
          { value: -1, label: "-1", trap: "Perpendicular_Slope_Neglect" },
        ],
      };

    case "coord-rel-perp":
      return {
        motifId,
        branch: "perpendicular-slope-check",
        text: `Use $1$ if the lines with slopes $m_1=2$ and $m_2=-\\frac{1}{2}$ are perpendicular, otherwise use $0$.`,
        values: { m1: 2, m2Num: -1, m2Den: 2 },
        answer: 1,
        answerLabel: "1",
        formula: "m1*m2=-1",
        steps: [
          ["conditional", `Two nonvertical lines are perpendicular if $m_1m_2=-1$.`],
          ["direct", `Here $2\\cdot\\left(-\\frac{1}{2}\\right)=-1$, so the lines are perpendicular.`],
        ],
        distractors: [
          { value: 0, label: "0", trap: "Perpendicular_Slope_Neglect" },
          { value: -1, label: "-1", trap: "Product_As_Answer" },
          { value: 2, label: "2", trap: "Slope_As_Answer" },
        ],
      };

    case "coord-line-intersection":
      return {
        motifId,
        branch: "line-intersection",
        text: `Find the point of intersection of $x+y=7$ and $x-y=1$.`,
        values: { sum: 7, diff: 1 },
        answer: 0,
        answerLabel: "(4,3)",
        formula: "solve system",
        steps: [
          ["conditional", `Add the equations: $(x+y)+(x-y)=7+1$.`],
          ["direct", `Thus $2x=8$, so $x=4$. Then $y=3$.`],
        ],
        distractors: [
          { value: 0, label: "(3,4)", trap: "Coordinate_Swap" },
          { value: 0, label: "(7,1)", trap: "Line_Consistency_Confusion" },
          { value: 0, label: "(8,6)", trap: "Denominator_Omission" },
        ],
      };

    case "coord-slope-angle":
      return {
        motifId,
        branch: "angle-inclination",
        text: `A line makes an angle of inclination $45^{\\circ}$ with the positive $x$-axis. Find its slope $m$.`,
        values: { angle: 45 },
        answer: 1,
        answerLabel: "1",
        formula: "m=tan(theta)",
        steps: [
          ["conditional", `Slope and inclination are related by $m=\\tan\\theta$.`],
          ["direct", `So $m=\\tan45^{\\circ}=1$.`],
        ],
        distractors: [
          { value: 45, label: "45", trap: "Slope_Tan_Theta_Confusion" },
          { value: 0, label: "0", trap: "Angle_Value_Trap" },
          { value: -1, label: "-1", trap: "Quadrant_Boundary_Neglect" },
        ],
      };

    case "coord-line-general-slope":
      return {
        motifId,
        branch: "general-line-slope",
        text: `Find the slope $m$ of the line $3x+4y-12=0$.`,
        values: { a: 3, b: 4, c: -12 },
        answer: -0.75,
        answerLabel: "-\\frac{3}{4}",
        formula: "m=-a/b",
        steps: [
          ["conditional", `For $ax+by+c=0$, slope is $m=-\\frac{a}{b}$.`],
          ["direct", `Here $a=3$ and $b=4$, so $m=-\\frac{3}{4}$.`],
        ],
        distractors: [
          { value: 0.75, label: "\\frac{3}{4}", trap: "General_Eqn_Sign_Flip" },
          { value: -1.33, label: "-\\frac{4}{3}", trap: "Slope_Inversion" },
          { value: 3, label: "3", trap: "Coefficient_As_Answer" },
        ],
      };

    case "coord-area-tri":
      return {
        motifId,
        branch: "triangle-shoelace",
        text: `Find the area of the triangle with vertices $(0,0)$, $(6,0)$, and $(0,8)$.`,
        values: { x2: 6, y3: 8 },
        answer: 24,
        answerLabel: "24",
        formula: "1/2 |shoelace|",
        steps: [
          ["conditional", `Coordinate area formula is $\\frac{1}{2}|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)|$.`],
          ["direct", `Area $=\\frac{1}{2}|0+6(8-0)+0|=24$.`],
        ],
        distractors: [
          { value: 48, label: "48", trap: "Intercept_Area_Factor" },
          { value: -24, label: "-24", trap: "Area_Sign_Error" },
          { value: 14, label: "14", trap: "Origin_Distance_Linear" },
        ],
      };

    case "coord-collinear-check":
      return {
        motifId,
        branch: "collinear-slope",
        text: `Use $1$ if the points $(1,2)$, $(3,6)$, and $(5,10)$ are collinear, otherwise use $0$.`,
        values: { answer: 1 },
        answer: 1,
        answerLabel: "1",
        formula: "equal slopes",
        steps: [
          ["conditional", `Check slopes: $m_{12}=\\frac{6-2}{3-1}=2$ and $m_{23}=\\frac{10-6}{5-3}=2$.`],
          ["direct", `Since the slopes are equal, the three points are collinear.`],
        ],
        distractors: [
          { value: 0, label: "0", trap: "Collinear_Slope_Mismatch" },
          { value: 2, label: "2", trap: "Slope_As_Answer" },
          { value: 3, label: "3", trap: "Point_Count_Trap" },
        ],
      };

    case "coord-quad-id":
      return {
        motifId,
        branch: "axis-square-code",
        text: `The points $(0,0)$, $(4,0)$, $(4,4)$, and $(0,4)$ form which quadrilateral? Use $1$ for square, $2$ for rectangle only, and $3$ for rhombus only.`,
        values: { side: 4 },
        answer: 1,
        answerLabel: "1",
        formula: "equal sides and perpendicular slopes",
        steps: [
          ["conditional", `All four sides have length $4$.`],
          ["conditional", `Adjacent sides are perpendicular because one is horizontal and the other vertical.`],
          ["direct", `Equal sides with right angles form a square, represented by $1$.`],
        ],
        distractors: [
          { value: 2, label: "2", trap: "Perpendicular_Slope_Neglect" },
          { value: 3, label: "3", trap: "Right_Angle_Omission" },
          { value: 0, label: "0", trap: "Distance_Formula_Plus" },
        ],
      };

    case "coord-area-quad":
      return {
        motifId,
        branch: "quadrilateral-shoelace",
        text: `Find the area of the quadrilateral with vertices $(0,0)$, $(5,0)$, $(5,3)$, and $(0,3)$.`,
        values: { l: 5, b: 3 },
        answer: 15,
        answerLabel: "15",
        formula: "shoelace",
        steps: [
          ["conditional", `Using the shoelace formula, this rectangle has base $5$ and height $3$.`],
          ["direct", `Area $=5\\cdot3=15$.`],
        ],
        distractors: [
          { value: 16, label: "16", trap: "Perimeter_Trap" },
          { value: 7.5, label: "\\frac{15}{2}", trap: "Triangle_Area_Trap" },
          { value: -15, label: "-15", trap: "Area_Sign_Error" },
        ],
      };

    case "coord-dist-point-line":
      return {
        motifId,
        branch: "point-line-distance",
        text: `Find the perpendicular distance of $(3,4)$ from the line $3x+4y-10=0$.`,
        values: { x: 3, y: 4, a: 3, b: 4, c: -10 },
        answer: 3,
        answerLabel: "3",
        formula: "|ax1+by1+c|/sqrt(a^2+b^2)",
        steps: [
          ["conditional", `Distance from $(x_1,y_1)$ to $ax+by+c=0$ is $\\frac{|ax_1+by_1+c|}{\\sqrt{a^2+b^2}}$.`],
          ["direct", `Distance $=\\frac{|3\\cdot3+4\\cdot4-10|}{\\sqrt{3^2+4^2}}=\\frac{15}{5}=3$.`],
        ],
        distractors: [
          { value: 15, label: "15", trap: "Distance_Line_Denominator" },
          { value: 5, label: "5", trap: "Equation_Normalization_Error" },
          { value: -3, label: "-3", trap: "Area_Sign_Error" },
        ],
      };

    case "coord-dist-parallel-lines":
      return {
        motifId,
        branch: "parallel-line-distance",
        text: `Find the distance between the parallel lines $3x+4y-10=0$ and $3x+4y+15=0$.`,
        values: { a: 3, b: 4, c1: -10, c2: 15 },
        answer: 5,
        answerLabel: "5",
        formula: "|c2-c1|/sqrt(a^2+b^2)",
        steps: [
          ["conditional", `For parallel lines $ax+by+c_1=0$ and $ax+by+c_2=0$, distance is $\\frac{|c_2-c_1|}{\\sqrt{a^2+b^2}}$.`],
          ["direct", `Distance $=\\frac{|15-(-10)|}{\\sqrt{3^2+4^2}}=\\frac{25}{5}=5$.`],
        ],
        distractors: [
          { value: 25, label: "25", trap: "Distance_Line_Denominator" },
          { value: 1, label: "1", trap: "Equation_Normalization_Error" },
          { value: 3, label: "3", trap: "Coefficient_As_Answer" },
        ],
      };

    case "coord-reflect-axis":
      return {
        motifId,
        branch: "reflect-y-axis",
        text: `Find the reflection of the point $(3,-5)$ in the $Y$-axis.`,
        values: { x: 3, y: -5 },
        answer: 0,
        answerLabel: "(-3,-5)",
        formula: "(x,y)->(-x,y)",
        steps: [
          ["conditional", `Reflection in the $Y$-axis changes $(x,y)$ to $(-x,y)$.`],
          ["direct", `Therefore $(3,-5)\\to(-3,-5)$.`],
        ],
        distractors: [
          { value: 0, label: "(3,5)", trap: "Reflection_Axis_Swap" },
          { value: 0, label: "(-3,5)", trap: "Origin_Reflection_Trap" },
          { value: 0, label: "(-5,3)", trap: "Coordinate_Swap" },
        ],
      };

    case "coord-reflect-line":
      return {
        motifId,
        branch: "reflect-y-equals-x",
        text: `Find the reflection of $(2,7)$ in the line $y=x$.`,
        values: { x: 2, y: 7 },
        answer: 0,
        answerLabel: "(7,2)",
        formula: "(x,y)->(y,x)",
        steps: [
          ["conditional", `Reflection in $y=x$ swaps the coordinates.`],
          ["direct", `So $(2,7)\\to(7,2)$.`],
        ],
        distractors: [
          { value: 0, label: "(-2,7)", trap: "Reflection_Axis_Swap" },
          { value: 0, label: "(2,-7)", trap: "Reflection_Axis_Swap" },
          { value: 0, label: "(-7,-2)", trap: "Origin_Reflection_Trap" },
        ],
      };

    case "coord-translation-point":
      return {
        motifId,
        branch: "vector-translation",
        text: `A robot at $(2,-1)$ is translated by the vector $(5,3)$. Find its new position.`,
        values: { x: 2, y: -1, dx: 5, dy: 3 },
        answer: 0,
        answerLabel: "(7,2)",
        formula: "(x,y)+(a,b)",
        steps: [
          ["direct", `Add coordinates component-wise: $(2,-1)+(5,3)=(7,2)$.`],
        ],
        distractors: [
          { value: 0, label: "(3,4)", trap: "Quadrant_Boundary_Neglect" },
          { value: 0, label: "(-3,-4)", trap: "Vector_Subtraction_Trap" },
          { value: 0, label: "(2,7)", trap: "Coordinate_Swap" },
        ],
      };

    case "coord-circ-eqn-center":
      return {
        motifId,
        branch: "circle-radius-square",
        text: `A circular storm has center $(2,-3)$ and radius $5$. Find the value of $r^2$ in its equation $(x-h)^2+(y-k)^2=r^2$.`,
        values: { h: 2, k: -3, r: 5 },
        answer: 25,
        answerLabel: "25",
        formula: "r^2",
        steps: [
          ["direct", `A circle with center $(h,k)$ and radius $r$ has equation $(x-h)^2+(y-k)^2=r^2$.`],
          ["direct", `Here $r=5$, so $r^2=25$.`],
        ],
        distractors: [
          { value: 5, label: "5", trap: "Circle_Radius_Squared" },
          { value: -3, label: "-3", trap: "General_Eqn_Sign_Flip" },
          { value: 10, label: "10", trap: "Diameter_Trap" },
        ],
      };

    case "coord-circ-general-to-center":
      return {
        motifId,
        branch: "general-circle-center",
        text: `For the circle $x^2+y^2-6x+4y-12=0$, find the $x$-coordinate of its center.`,
        values: { d: -6, e: 4, f: -12 },
        answer: 3,
        answerLabel: "3",
        formula: "center=(-D/2,-E/2)",
        steps: [
          ["conditional", `For $x^2+y^2+Dx+Ey+F=0$, center is $\\left(-\\frac{D}{2},-\\frac{E}{2}\\right)$.`],
          ["direct", `Here $D=-6$, so $x$-coordinate $=-\\frac{-6}{2}=3$.`],
        ],
        distractors: [
          { value: -3, label: "-3", trap: "General_Eqn_Sign_Flip" },
          { value: 2, label: "2", trap: "Y_Center_As_Answer" },
          { value: 6, label: "6", trap: "Denominator_Omission" },
        ],
      };

    case "coord-circ-tangent":
      return {
        motifId,
        branch: "tangent-at-point-slope",
        text: `For the circle $x^2+y^2=25$, find the slope of the tangent at $(3,4)$.`,
        values: { x: 3, y: 4, r2: 25 },
        answer: -0.75,
        answerLabel: "-\\frac{3}{4}",
        formula: "tangent slope = -1/radius slope",
        steps: [
          ["conditional", `The radius to $(3,4)$ has slope $\\frac{4}{3}$.`],
          ["conditional", `The tangent is perpendicular to the radius, so its slope is the negative reciprocal.`],
          ["direct", `Tangent slope $=-\\frac{3}{4}$.`],
        ],
        distractors: [
          { value: 0.75, label: "\\frac{3}{4}", trap: "Perpendicular_Slope_Neglect" },
          { value: 1.33, label: "\\frac{4}{3}", trap: "Radius_Slope_As_Tangent" },
          { value: -1.33, label: "-\\frac{4}{3}", trap: "Slope_Inversion" },
        ],
      };

    case "coord-circle-diameter":
      return {
        motifId,
        branch: "circle-diameter-radius",
        text: `A circle has diameter endpoints $A(1,2)$ and $B(7,10)$. Find its radius.`,
        values: { x1: 1, y1: 2, x2: 7, y2: 10 },
        answer: 5,
        answerLabel: "5",
        formula: "radius=distance/2",
        steps: [
          ["direct", `Diameter $AB=\\sqrt{(7-1)^2+(10-2)^2}=\\sqrt{36+64}=10$.`],
          ["direct", `Radius $=\\frac{10}{2}=5$.`],
        ],
        distractors: [
          { value: 10, label: "10", trap: "Circle_Radius_Squared" },
          { value: 25, label: "25", trap: "Circle_Radius_Squared" },
          { value: 14, label: "14", trap: "Origin_Distance_Linear" },
        ],
      };

    case "coord-circle-point-position":
      return {
        motifId,
        branch: "point-inside-circle-code",
        text: `For the circle $x^2+y^2=25$, use $1$ if $(3,4)$ lies on the circle, $0$ otherwise.`,
        values: { x: 3, y: 4, r2: 25 },
        answer: 1,
        answerLabel: "1",
        formula: "x^2+y^2=r^2",
        steps: [
          ["direct", `For $(3,4)$, $x^2+y^2=3^2+4^2=25$.`],
          ["direct", `This equals $r^2=25$, so the point lies on the circle.`],
        ],
        distractors: [
          { value: 0, label: "0", trap: "Origin_Distance_Linear" },
          { value: 7, label: "7", trap: "Linear_Distance_Trap" },
          { value: 25, label: "25", trap: "Squared_Value_As_Code" },
        ],
      };

    case "coord-circle-line-intersection-count":
      return {
        motifId,
        branch: "tangent-count",
        text: `For the circle $x^2+y^2=25$ and the line $x=5$, find the number of intersection points.`,
        values: { r: 5, x: 5 },
        answer: 1,
        answerLabel: "1",
        formula: "distance from center equals radius",
        steps: [
          ["conditional", `Distance from center $(0,0)$ to the line $x=5$ is $5$.`],
          ["direct", `Since this equals the radius $5$, the line is tangent and has $1$ intersection point.`],
        ],
        distractors: [
          { value: 2, label: "2", trap: "Secant_Trap" },
          { value: 0, label: "0", trap: "Distance_Line_Denominator" },
          { value: 5, label: "5", trap: "Radius_As_Count" },
        ],
      };

    case "coord-locus-distance-origin":
      return {
        motifId,
        branch: "circle-locus",
        text: `The locus of a point $P(x,y)$ satisfying $x^2+y^2=49$ is a circle. Find its radius.`,
        values: { r2: 49 },
        answer: 7,
        answerLabel: "7",
        formula: "x^2+y^2=r^2",
        steps: [
          ["conditional", `The equation $x^2+y^2=r^2$ represents a circle centered at the origin.`],
          ["direct", `Here $r^2=49$, so $r=7$.`],
        ],
        distractors: [
          { value: 49, label: "49", trap: "Circle_Radius_Squared" },
          { value: 14, label: "14", trap: "Diameter_Trap" },
          { value: 0, label: "0", trap: "Origin_Distance_Linear" },
        ],
      };

    case "coord-locus-equidistant-two-points":
      return {
        motifId,
        branch: "perpendicular-bisector",
        text: `A point $P(x,y)$ is equidistant from $A(0,0)$ and $B(6,0)$. Find the equation of the locus.`,
        values: { xMid: 3 },
        answer: 0,
        answerLabel: "x=3",
        formula: "PA=PB",
        steps: [
          ["conditional", `Points equidistant from two fixed points lie on the perpendicular bisector of the segment joining them.`],
          ["direct", `The midpoint of $(0,0)$ and $(6,0)$ is $(3,0)$, and the perpendicular bisector is $x=3$.`],
        ],
        distractors: [
          { value: 0, label: "y=3", trap: "Coordinate_Swap" },
          { value: 0, label: "x=6", trap: "Midpoint_Subtraction" },
          { value: 0, label: "y=0", trap: "Line_Consistency_Confusion" },
        ],
      };

    case "coord-concurrency-lines":
      return {
        motifId,
        branch: "three-line-concurrency",
        text: `The lines $x+y=6$ and $x-y=2$ meet at $(4,2)$. Use $1$ if the line $2x+y=10$ also passes through this point, otherwise use $0$.`,
        values: { x: 4, y: 2 },
        answer: 1,
        answerLabel: "1",
        formula: "substitute point in third line",
        steps: [
          ["conditional", `For concurrency, the common point must satisfy the third line too.`],
          ["direct", `At $(4,2)$, $2x+y=2(4)+2=10$.`],
          ["direct", `So the third line also passes through the point.`],
        ],
        distractors: [
          { value: 0, label: "0", trap: "Line_Consistency_Confusion" },
          { value: 10, label: "10", trap: "Equation_Value_As_Code" },
          { value: 2, label: "2", trap: "Coordinate_As_Answer" },
        ],
      };

    case "coord-orthocenter-right":
      return {
        motifId,
        branch: "right-triangle-orthocenter",
        text: `Triangle $ABC$ has vertices $A(0,0)$, $B(6,0)$, and $C(0,8)$. Find the orthocenter.`,
        values: { answer: 0 },
        answer: 0,
        answerLabel: "(0,0)",
        formula: "right-angle vertex",
        steps: [
          ["conditional", `$AB$ is horizontal and $AC$ is vertical, so $\\angle A=90^{\\circ}$.`],
          ["direct", `In a right triangle, the orthocenter is the right-angle vertex. Hence it is $(0,0)$.`],
        ],
        distractors: [
          { value: 0, label: "(3,4)", trap: "Centroid_Denominator" },
          { value: 0, label: "(6,8)", trap: "Coordinate_Sum_Trap" },
          { value: 0, label: "(0,8)", trap: "Wrong_Vertex_Trap" },
        ],
      };

    case "coord-median-length":
      return {
        motifId,
        branch: "median-from-coordinate",
        text: `In triangle $ABC$, $A(0,0)$, $B(6,0)$, and $C(0,8)$. Find the length of the median from $A$ to $BC$.`,
        values: { answer: 5 },
        answer: 5,
        answerLabel: "5",
        formula: "midpoint then distance",
        steps: [
          ["direct", `Midpoint of $BC$ is $\\left(\\frac{6+0}{2},\\frac{0+8}{2}\\right)=(3,4)$.`],
          ["direct", `Median length from $A(0,0)$ is $\\sqrt{3^2+4^2}=5$.`],
        ],
        distractors: [
          { value: 10, label: "10", trap: "Distance_Formula_Plus" },
          { value: 7, label: "7", trap: "Origin_Distance_Linear" },
          { value: 3.5, label: "\\frac{7}{2}", trap: "Midpoint_Subtraction" },
        ],
      };

    case "coord-dist-basic":
    default:
      return {
        motifId,
        branch: "pythagorean-distance",
        text: `A GIS map marks two towers at $A(1,2)$ and $B(7,10)$. Find the distance $AB$.`,
        values: { x1: 1, y1: 2, x2: 7, y2: 10 },
        answer: 10,
        answerLabel: "10",
        formula: "sqrt((x2-x1)^2+(y2-y1)^2)",
        steps: [
          ["direct", `Distance formula is $AB=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$.`],
          ["direct", `So $AB=\\sqrt{(7-1)^2+(10-2)^2}=\\sqrt{36+64}=10$.`],
        ],
        distractors: [
          { value: 18, label: "18", trap: "Origin_Distance_Linear" },
          { value: 100, label: "100", trap: "Circle_Radius_Squared" },
          { value: 12.17, label: "\\sqrt{148}", trap: "Distance_Formula_Plus" },
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
      ? "coord-dist-point-line"
      : "coord-dist-basic");
  return finalizeCoordinateScenario(
    createCoordinateDefinition(motifId),
  );
}

const PATTERN_FACTORIES: Record<
  string,
  CoordinateScenarioFactory[]
> = {
  "coordinate-geometry": [
    () => createScenarioFromMotif("Medium", { id: "coord-dist-basic" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "coord-midpoint" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "coord-slope-find" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "coord-area-tri" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "coord-dist-point-line" } as QuantMotif),
  ],
  "coordinate-points": [
    () => createScenarioFromMotif("Medium", { id: "coord-dist-basic" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "coord-midpoint" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "coord-section-internal" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "coord-section-external" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "coord-centroid-tri" } as QuantMotif),
  ],
  "coordinate-lines": [
    () => createScenarioFromMotif("Medium", { id: "coord-slope-find" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "coord-line-eqn-point-slope" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "coord-line-intercept-form" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "coord-rel-parallel" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "coord-rel-perp" } as QuantMotif),
  ],
  "coordinate-areas-properties": [
    () => createScenarioFromMotif("Medium", { id: "coord-area-tri" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "coord-collinear-check" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "coord-quad-id" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "coord-area-quad" } as QuantMotif),
  ],
  "coordinate-distance-reflection": [
    () => createScenarioFromMotif("Hard", { id: "coord-dist-point-line" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "coord-dist-parallel-lines" } as QuantMotif),
    () => createScenarioFromMotif("Medium", { id: "coord-reflect-axis" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "coord-reflect-line" } as QuantMotif),
  ],
  "coordinate-circles": [
    () => createScenarioFromMotif("Medium", { id: "coord-circ-eqn-center" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "coord-circ-general-to-center" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "coord-circ-tangent" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "coord-circle-diameter" } as QuantMotif),
  ],
  "coordinate-locus-advanced": [
    () => createScenarioFromMotif("Hard", { id: "coord-locus-distance-origin" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "coord-locus-equidistant-two-points" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "coord-concurrency-lines" } as QuantMotif),
    () => createScenarioFromMotif("Hard", { id: "coord-median-length" } as QuantMotif),
  ],
};

function resolveCoordinatePatternKey(
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

export function createCoordinateGeometryScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const patternKey =
    resolveCoordinatePatternKey(pattern);

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
    PATTERN_FACTORIES["coordinate-geometry"];

  return pickRandomItem(factories)(
    difficulty,
    motif,
  );
}
