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

type MensurationScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

type SpatialState = {
  shape: string;
  measureType:
    | "area"
    | "perimeter"
    | "volume"
    | "surface";
  invariant?: "perimeter" | "volume";
  value: number;
};

type MensurationDefinition = {
  motifId: string;
  branch: string;
  text: string;
  values: Record<string, number>;
  answer: number;
  unit?: string;
  formula: string;
  steps: Array<[Parameters<typeof createReasoningStep>[0], string]>;
  distractors: number[];
  distractorLabels: string[];
  tokens?: string[];
  context?: QuantScenarioContext;
};

const PI = 22 / 7;

const MENSURATION_CONTEXT: QuantScenarioContext = {
  entity: "shape",
  metric: "spatial measure",
  context: "mensuration",
};

function round(value: number) {
  return (
    Math.round((value + Number.EPSILON) * 100) /
    100
  );
}

function formatNumber(value: number) {
  const rounded = round(value);
  return Number.isInteger(rounded)
    ? `${rounded}`
    : rounded.toFixed(2);
}

function formatLatexUnit(unit = "") {
  if (!unit) return "";
  if (unit === "% increase") {
    return "\\%\\text{ increase}";
  }
  if (unit === "% decrease") {
    return "\\%\\text{ decrease}";
  }
  const [base, power] = unit.split("^");
  if (!power) {
    return `\\text{ ${base}}`;
  }
  return `\\text{ ${base}}^${power}`;
}

function formatMathJaxAnswer(
  value: number,
  unit = "",
) {
  const numeric = formatNumber(value);
  const latexUnit = formatLatexUnit(unit);
  return latexUnit
    ? `$${numeric} ${latexUnit}$`
    : `$${numeric}$`;
}

function normalizeMathJaxUnits(
  content: string,
) {
  return content
    .replace(
      /\$([^$]*?\d[^$]*?)\$ (cm|m)\$\^([23])\$/g,
      (_match, expression, unit, power) =>
        `$${expression} \\text{ ${unit}}^${power}$`,
    )
    .replace(
      /\$([^$]*?\d[^$]*?)\$ (cm|m)\b/g,
      (_match, expression, unit) =>
        `$${expression} \\text{ ${unit}}$`,
    )
    .replace(
      /(\d+(?:\.\d+)?) (cm|m)\$\^([23])\$/g,
      (_match, value, unit, power) =>
        `$${value} \\text{ ${unit}}^${power}$`,
    )
    .replace(
      /(\d+(?:\.\d+)?) (cm|m)\b/g,
      (_match, value, unit) =>
        `$${value} \\text{ ${unit}}$`,
    );
}

function stripGenericPrefix(
  content: string,
) {
  return content.replace(
    /^(Answer quickly:|Solve this:|Read carefully:)\s*/i,
    "",
  );
}

function withOptionLabel(
  value: string,
  index: number,
) {
  const label = String.fromCharCode(
    65 + index,
  );
  return `${label}. ${value}`;
}

function structuralSignature(
  motifId: string,
  branch: string,
  keys: Array<string | number> = [],
) {
  return `${motifId}::${branch}::${keys.join("|")}`;
}

function makeSpatialState(
  shape: string,
  measureType: SpatialState["measureType"],
  value: number,
  invariant?: SpatialState["invariant"],
): SpatialState {
  return {
    shape,
    measureType,
    value,
    invariant,
  };
}

function buildOptions(
  correctAnswer: number,
  unit: string | undefined,
  distractorValues: number[],
  distractorLabels: string[],
) {
  const candidates = [
    correctAnswer,
    ...distractorValues,
    correctAnswer +
      Math.max(
        1,
        Math.round(Math.abs(correctAnswer) * 0.1),
      ),
  ];
  const unique = Array.from(
    new Set(
      candidates
        .map(round)
        .filter(
          (value) =>
            Number.isFinite(value) &&
            value >= 0,
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
                Math.abs(correctAnswer) * 0.08,
              ),
            ),
      ),
    );
  }
  const values = unique.slice(0, 4);
  const optionMetadata: OptionMetadata[] =
    values.map((value, index) => {
      const displayValue =
        withOptionLabel(
          formatMathJaxAnswer(value, unit),
          index,
        );
      return index === 0
        ? {
            value: displayValue,
            isCorrect: true,
          }
        : {
            value: displayValue,
            isCorrect: false,
            distractorType:
              "wrongIntermediateValue",
            likelyMistake:
              distractorLabels[index - 1] ??
              "plausible spatial-formula slip",
            reasoningTrap:
              distractorLabels[index - 1] ??
              "wrong mensuration invariant",
          };
    });
  return {
    options: values.map((value, index) =>
      withOptionLabel(
        formatMathJaxAnswer(value, unit),
        index,
      ),
    ),
    correct: 0,
    optionMetadata,
  };
}

function buildStepExplanation(
  definition: MensurationDefinition,
) {
  return definition.steps
    .map(
      ([, detail], index) =>
        `Step ${index + 1}: ${definition.formula}\n${normalizeMathJaxUnits(detail)}`,
    )
    .join("\n");
}

function finalizeMensurationScenario(
  definition: MensurationDefinition,
): QuantProceduralScenario {
  const state = makeSpatialState(
    definition.motifId,
    definition.unit?.includes("unit^3") ||
      definition.unit?.includes("cm^3")
      ? "volume"
      : definition.unit?.includes("cm^2") ||
          definition.unit?.includes("sq")
        ? "area"
        : "perimeter",
    definition.answer,
  );
  return {
    scenarioType: "spatial-state-mensuration",
    topicCluster: "mensuration",
    values: {
      ...definition.values,
      spatialValue: state.value,
    },
    text: normalizeMathJaxUnits(
      stripGenericPrefix(
        definition.text,
      ),
    ),
    correctAnswer: round(definition.answer),
    formula: definition.formula,
    reasoningSteps: definition.steps.map(
      ([operation, detail]) =>
        createReasoningStep(operation, detail),
    ),
    explanation:
      buildStepExplanation(definition),
    distractorHints:
      definition.distractorLabels,
    context:
      definition.context ??
      MENSURATION_CONTEXT,
    motifId: definition.motifId,
    scenarioLogicBranch:
      definition.branch,
    structuralSignature:
      structuralSignature(
        definition.motifId,
        definition.branch,
        Object.values(definition.values),
      ),
    customOptionBundle: buildOptions(
      definition.answer,
      definition.unit,
      definition.distractors,
      definition.distractorLabels,
    ),
    validationTokens: undefined,
  };
}

function def(
  definition: MensurationDefinition,
) {
  return definition;
}

const scenarioDefinitionsByMotif: Record<
  string,
  MensurationDefinition[]
> = {
  "men-tri-ratio": [
    def({
      motifId: "men-tri-ratio",
      branch: "345-perimeter-area",
      text:
        "The sides of a triangular field are in the ratio $3:4:5$ and its perimeter is $120$ m. Find its area.",
      values: { perimeter: 120, ratioA: 3, ratioB: 4, ratioC: 5 },
      answer: 600,
      unit: "m^2",
      formula: "$A = \\frac{1}{2} \\times base \\times height$",
      steps: [
        [
          "ratio",
          "The ratio sum is $3+4+5=12$, so one part is $120/12=10$ m.",
        ],
        [
          "infer",
          "The sides are $30,40,50$ m, a right triangle; $A=\\frac{1}{2}\\times30\\times40=600$ m$^2$.",
        ],
      ],
      distractors: [1200, 500, 300],
      distractorLabels: [
        "Pythagorean_Triple_Slip",
        "Using hypotenuse as height",
        "Missing the half factor",
      ],
      tokens: ["$3:4:5$", "$120$"],
    }),
  ],
  "men-rect-path-in": [
    def({
      motifId: "men-rect-path-in",
      branch: "inner-rectangle-subtraction",
      text:
        "A rectangular garden is $50$ m long and $30$ m broad. A path of width $2$ m is made inside along the boundary. Find the area of the path.",
      values: { length: 50, breadth: 30, width: 2 },
      answer: 304,
      unit: "m^2",
      formula:
        "$A=(L\\times B)-(L-2w)(B-2w)$",
      steps: [
        [
          "transform",
          "The inner rectangle has dimensions $(50-4)$ m and $(30-4)$ m, i.e. $46$ m by $26$ m.",
        ],
        [
          "infer",
          "Path area $=50\\times30-46\\times26=1500-1196=304$ m$^2$.",
        ],
      ],
      distractors: [320, 160, 296],
      distractorLabels: [
        "Path_Overlap_Error",
        "Using only perimeter x width",
        "Corner adjustment slip",
      ],
      tokens: ["inside", "$2$"],
    }),
  ],
  "men-rect-path-out": [
    def({
      motifId: "men-rect-path-out",
      branch: "outer-rectangle-expansion",
      text:
        "A rectangular lawn is $40$ m by $25$ m. A path of width $3$ m is made outside it. Find the area of the path.",
      values: { length: 40, breadth: 25, width: 3 },
      answer: 526,
      unit: "m^2",
      formula:
        "$A=(L+2w)(B+2w)-(L\\times B)$",
      steps: [
        [
          "transform",
          "The outer rectangle is $(40+6)$ m by $(25+6)$ m, so $46$ m by $31$ m.",
        ],
        [
          "infer",
          "Path area $=46\\times31-40\\times25=1426-1000=526$ m$^2$.",
        ],
      ],
      distractors: [390, 508, 195],
      distractorLabels: [
        "Path_Overlap_Error",
        "Missing outside corners",
        "Using perimeter x width only",
      ],
      tokens: ["outside", "$3$"],
    }),
  ],
  "men-rhom-diag": [
    def({
      motifId: "men-rhom-diag",
      branch: "perimeter-one-diagonal",
      text:
        "The perimeter of a rhombus is $52$ cm and one diagonal is $10$ cm. Find its area.",
      values: { perimeter: 52, diagonal1: 10 },
      answer: 120,
      unit: "cm^2",
      formula:
        "$A=\\frac{1}{2}d_1d_2$",
      steps: [
        [
          "transform",
          "Each side is $52/4=13$ cm and half of the given diagonal is $5$ cm.",
        ],
        [
          "infer",
          "Using $13^2=5^2+(d_2/2)^2$, we get $d_2/2=12$, so $d_2=24$ cm.",
        ],
        [
          "infer",
          "Area $=\\frac{1}{2}\\times10\\times24=120$ cm$^2$.",
        ],
      ],
      distractors: [240, 65, 260],
      distractorLabels: [
        "Diagonal_vs_Side",
        "Using side as height",
        "Not halving diagonals",
      ],
      tokens: ["rhombus", "$52$", "$10$"],
    }),
  ],
  "men-trap-parallel": [
    def({
      motifId: "men-trap-parallel",
      branch: "area-height-ratio",
      text:
        "The area of a trapezium is $360$ cm$^2$ and the distance between its parallel sides is $12$ cm. If the parallel sides are in the ratio $2:3$, find the longer side.",
      values: { area: 360, height: 12, ratioA: 2, ratioB: 3 },
      answer: 36,
      unit: "cm",
      formula:
        "$A=\\frac{1}{2}(a+b)h$",
      steps: [
        [
          "infer",
          "$360=\\frac{1}{2}(a+b)\\times12$, so $a+b=60$ cm.",
        ],
        [
          "ratio",
          "The sides are in ratio $2:3$, so the longer side is $\\frac{3}{5}\\times60=36$ cm.",
        ],
      ],
      distractors: [24, 30, 72],
      distractorLabels: [
        "Wrong ratio part",
        "Averaging the parallel sides",
        "Forgetting the half factor",
      ],
      tokens: ["trapezium", "$2:3$"],
    }),
  ],
  "men-circ-revolution": [
    def({
      motifId: "men-circ-revolution",
      branch: "wheel-circumference-distance",
      text:
        "A wheel of radius $7$ cm makes $100$ revolutions. Find the distance covered by the wheel. Use $\\pi=\\frac{22}{7}$.",
      values: { radius: 7, revolutions: 100 },
      answer: 4400,
      unit: "cm",
      formula:
        "$Distance=2\\pi rN$",
      steps: [
        [
          "transform",
          "One revolution covers circumference $2\\pi r=2\\times\\frac{22}{7}\\times7=44$ cm.",
        ],
        [
          "infer",
          "For $100$ revolutions, distance $=44\\times100=4400$ cm.",
        ],
      ],
      distractors: [2200, 15400, 700],
      distractorLabels: [
        "Diameter_Radius_Swap",
        "Using area instead of circumference",
        "Ignoring circumference",
      ],
      tokens: ["$2\\pi rN$", "$100$"],
    }),
  ],
  "men-circ-sector": [
    def({
      motifId: "men-circ-sector",
      branch: "degree-sector-area",
      text:
        "Find the area of a sector of a circle with radius $14$ cm and angle $90^\\circ$. Use $\\pi=\\frac{22}{7}$.",
      values: { radius: 14, angle: 90 },
      answer: 154,
      unit: "cm^2",
      formula:
        "$A=\\frac{\\theta}{360}\\times\\pi r^2$",
      steps: [
        [
          "transform",
          "The sector is $90/360=1/4$ of the circle.",
        ],
        [
          "infer",
          "Area $=\\frac{1}{4}\\times\\frac{22}{7}\\times14^2=154$ cm$^2$.",
        ],
      ],
      distractors: [616, 44, 308],
      distractorLabels: [
        "Sector_Angle_Radians",
        "Using arc length",
        "Diameter_Radius_Swap",
      ],
      tokens: ["$90^\\circ$", "$\\frac{\\theta}{360}$"],
    }),
  ],
  "men-poly-diag": [
    def({
      motifId: "men-poly-diag",
      branch: "polygon-diagonal-count",
      text:
        "How many diagonals does a polygon of $10$ sides have?",
      values: { sides: 10 },
      answer: 35,
      formula: "$D=\\frac{n(n-3)}{2}$",
      steps: [
        [
          "infer",
          "For $n=10$, diagonals $D=\\frac{10(10-3)}{2}=35$.",
        ],
      ],
      distractors: [70, 45, 30],
      distractorLabels: [
        "Forgetting division by 2",
        "Using $n(n-1)/2$",
        "Subtracting adjacent sides only",
      ],
      tokens: ["polygon", "$10$"],
    }),
  ],
  "men-poly-angle": [
    def({
      motifId: "men-poly-angle",
      branch: "interior-exterior-ratio",
      text:
        "In a regular polygon, the ratio of each interior angle to each exterior angle is $3:1$. Find the number of sides.",
      values: { interiorRatio: 3, exteriorRatio: 1 },
      answer: 8,
      formula: "$Interior+Exterior=180^\\circ$",
      steps: [
        [
          "ratio",
          "Let the angles be $3x$ and $x$. Since they are supplementary, $4x=180^\\circ$.",
        ],
        [
          "infer",
          "Exterior angle $=45^\\circ$, so number of sides $=360/45=8$.",
        ],
      ],
      distractors: [6, 4, 12],
      distractorLabels: [
        "Using interior angle directly",
        "Ratio sum as sides",
        "Exterior-angle inversion",
      ],
      tokens: ["regular polygon", "$3:1$"],
    }),
  ],
  "men-boundary-bend": [
    def({
      motifId: "men-boundary-bend",
      branch: "circle-wire-to-square",
      text:
        "A wire is bent into a circle of radius $14$ cm. It is then reshaped into a square. Find the side of the square. Use $\\pi=\\frac{22}{7}$.",
      values: { radius: 14 },
      answer: 22,
      unit: "cm",
      formula: "$2\\pi r=4a$",
      steps: [
        [
          "transform",
          "The wire length is conserved, so $2\\pi r=2\\times\\frac{22}{7}\\times14=88$ cm.",
        ],
        [
          "infer",
          "For a square, $4a=88$, hence $a=22$ cm.",
        ],
      ],
      distractors: [44, 88, 11],
      distractorLabels: [
        "Diameter_Radius_Swap",
        "Using perimeter as side",
        "Halving twice",
      ],
      tokens: ["wire", "$2\\pi r=4a$"],
    }),
  ],
  "men-cube-diagonal": [
    def({
      motifId: "men-cube-diagonal",
      branch: "space-diagonal",
      text:
        "What is the length of the longest rod that can be placed inside a cube of side $10$ cm?",
      values: { side: 10 },
      answer: 17.32,
      unit: "cm",
      formula: "$d=a\\sqrt{3}$",
      steps: [
        [
          "infer",
          "The longest rod is the cube's space diagonal, $d=10\\sqrt{3}\\approx17.32$ cm.",
        ],
      ],
      distractors: [14.14, 30, 10],
      distractorLabels: [
        "Diagonal_vs_Side",
        "Using $3a$",
        "Using side only",
      ],
      tokens: ["cube", "$a\\sqrt{3}$"],
    }),
  ],
  "men-cuboid-surface-shift": [
    def({
      motifId: "men-cuboid-surface-shift",
      branch: "volume-percent-shift",
      text:
        "The length of a cuboid is increased by $20\\%$ and its breadth is decreased by $10\\%$, while height remains unchanged. Find the percentage change in volume.",
      values: { lengthMultiplier: 1.2, breadthMultiplier: 0.9 },
      answer: 8,
      unit: "% increase",
      formula: "$V' = V\\times1.2\\times0.9$",
      steps: [
        [
          "transform",
          "The new volume multiplier is $1.2\\times0.9\\times1=1.08$.",
        ],
        [
          "infer",
          "So the volume increases by $8\\%$.",
        ],
      ],
      distractors: [10, 30, 2],
      distractorLabels: [
        "Adding percentage changes directly",
        "Scaling_Linear_Assumption",
        "Subtracting percentages directly",
      ],
      tokens: ["$20\\%$", "$10\\%$"],
    }),
  ],
  "men-prism-base": [
    def({
      motifId: "men-prism-base",
      branch: "triangular-prism-volume",
      text:
        "A prism has a triangular base of base $12$ cm and height $8$ cm. If the length of the prism is $20$ cm, find its volume.",
      values: { triangleBase: 12, triangleHeight: 8, prismLength: 20 },
      answer: 960,
      unit: "cm^3",
      formula: "$V=A_{base}\\times h$",
      steps: [
        [
          "infer",
          "Base area $=\\frac{1}{2}\\times12\\times8=48$ cm$^2$.",
        ],
        [
          "infer",
          "Volume $=48\\times20=960$ cm$^3$.",
        ],
      ],
      distractors: [1920, 240, 480],
      distractorLabels: [
        "Missing half in triangular base",
        "Using perimeter-like product",
        "Forgetting prism length",
      ],
      tokens: ["triangular base", "$V=A_{base}\\times h$"],
    }),
  ],
  "men-cyl-csa-ratio": [
    def({
      motifId: "men-cyl-csa-ratio",
      branch: "csa-to-tsa-ratio",
      text:
        "A cylinder has radius $7$ cm and height $14$ cm. Find the ratio of $CSA$ to $TSA$.",
      values: { radius: 7, height: 14 },
      answer: 2 / 3,
      formula: "$CSA:TSA=2\\pi rh:2\\pi r(r+h)$",
      steps: [
        [
          "ratio",
          "$CSA:TSA = h:(r+h)$ after cancelling $2\\pi r$.",
        ],
        [
          "infer",
          "So the ratio is $14:(7+14)=14:21=2:3$.",
        ],
      ],
      distractors: [3 / 2, 1 / 3, 1],
      distractorLabels: [
        "TS_CSA_Confusion",
        "Missing curved surface",
        "Assuming CSA equals TSA",
      ],
      tokens: ["$CSA$", "$TSA$"],
    }),
  ],
  "men-cone-canvas": [
    def({
      motifId: "men-cone-canvas",
      branch: "conical-tent-csa",
      text:
        "A conical tent has radius $7$ m and slant height $15$ m. Find the canvas area required. Use $\\pi=\\frac{22}{7}$.",
      values: { radius: 7, slantHeight: 15 },
      answer: 330,
      unit: "m^2",
      formula: "$CSA=\\pi rl$",
      steps: [
        [
          "infer",
          "Canvas covers curved surface only, so $CSA=\\pi rl=\\frac{22}{7}\\times7\\times15=330$ m$^2$.",
        ],
      ],
      distractors: [154, 484, 220],
      distractorLabels: [
        "Slant_Height_Neglect",
        "Adding base area",
        "Using height instead of slant height",
      ],
      tokens: ["slant height", "$\\pi rl$"],
    }),
  ],
  "men-sph-hem-tsa": [
    def({
      motifId: "men-sph-hem-tsa",
      branch: "hemisphere-total-surface",
      text:
        "Find the total surface area of a hemisphere of radius $7$ cm. Use $\\pi=\\frac{22}{7}$.",
      values: { radius: 7 },
      answer: 462,
      unit: "cm^2",
      formula: "$TSA=3\\pi r^2$",
      steps: [
        [
          "infer",
          "For a hemisphere, $TSA=3\\pi r^2=3\\times\\frac{22}{7}\\times7^2=462$ cm$^2$.",
        ],
      ],
      distractors: [308, 154, 616],
      distractorLabels: [
        "Sphere_Hemisphere_TSA",
        "Flat base only",
        "Full sphere surface area",
      ],
      tokens: ["hemisphere", "$3\\pi r^2$"],
    }),
  ],
  "men-cone-sphere-recast": [
    def({
      motifId: "men-cone-sphere-recast",
      branch: "cone-to-sphere-volume",
      text:
        "A cone of radius $6$ cm and height $12$ cm is melted and recast into a sphere. Find the radius of the sphere.",
      values: { coneRadius: 6, coneHeight: 12 },
      answer: 6,
      unit: "cm",
      formula:
        "$\\frac{1}{3}\\pi r^2h=\\frac{4}{3}\\pi R^3$",
      steps: [
        [
          "transform",
          "Volume is conserved during recasting.",
        ],
        [
          "infer",
          "$\\frac{1}{3}\\pi\\times6^2\\times12=\\frac{4}{3}\\pi R^3$, so $144=\\frac{4}{3}R^3$ and $R^3=216$.",
        ],
        [
          "infer",
          "Hence $R=6$ cm.",
        ],
      ],
      distractors: [12, 4, 8],
      distractorLabels: [
        "Recasting_TSA_Invariant",
        "Using height as diameter",
        "Cube-root slip",
      ],
      tokens: ["melted", "$Volume_{initial}=Volume_{final}$"],
    }),
  ],
  "men-cyl-wire": [
    def({
      motifId: "men-cyl-wire",
      branch: "cylinder-to-wire-volume",
      text:
        "A cylindrical metal rod of radius $7$ cm and height $10$ cm is drawn into a wire of radius $1$ cm. Find the length of the wire.",
      values: { rodRadius: 7, rodHeight: 10, wireRadius: 1 },
      answer: 490,
      unit: "cm",
      formula: "$\\pi R^2H=\\pi r^2L$",
      steps: [
        [
          "transform",
          "Metal volume remains constant, so $\\pi\\times7^2\\times10=\\pi\\times1^2\\times L$.",
        ],
        [
          "infer",
          "Thus $L=490$ cm.",
        ],
      ],
      distractors: [70, 49, 980],
      distractorLabels: [
        "Wire_Length_Units",
        "Ignoring height",
        "Diameter-radius swap",
      ],
      tokens: ["drawn into a wire", "$\\pi R^2H$"],
    }),
  ],
  "men-frustum-vol": [
    def({
      motifId: "men-frustum-vol",
      branch: "bucket-frustum-volume",
      text:
        "Find the volume of a frustum with radii $R=7$ cm, $r=3$ cm and height $6$ cm. Use $\\pi=\\frac{22}{7}$.",
      values: { bigRadius: 7, smallRadius: 3, height: 6 },
      answer: round((PI * 6 * (49 + 9 + 21)) / 3),
      unit: "cm^3",
      formula:
        "$V=\\frac{\\pi h}{3}(R^2+r^2+Rr)$",
      steps: [
        [
          "infer",
          "$V=\\frac{\\pi\\times6}{3}(7^2+3^2+7\\times3)=2\\pi\\times79$.",
        ],
        [
          "infer",
          "Using $\\pi=\\frac{22}{7}$, volume $=496.57$ cm$^3$.",
        ],
      ],
      distractors: [364.57, 365, 616],
      distractorLabels: [
        "Frustum_Formula_Mixup",
        "Omitting $Rr$",
        "Using only large radius",
      ],
      tokens: ["frustum", "$R^2+r^2+Rr$"],
    }),
  ],
  "men-hollow-cyl": [
    def({
      motifId: "men-hollow-cyl",
      branch: "annular-cylinder-volume",
      text:
        "A hollow pipe has outer radius $7$ cm, inner radius $3$ cm and length $20$ cm. Find the volume of material in it. Use $\\pi=\\frac{22}{7}$.",
      values: { outerRadius: 7, innerRadius: 3, height: 20 },
      answer: round(PI * 20 * (49 - 9)),
      unit: "cm^3",
      formula: "$V=\\pi h(R^2-r^2)$",
      steps: [
        [
          "transform",
          "The cross-section of material is annular, so use $R^2-r^2=49-9=40$.",
        ],
        [
          "infer",
          "Volume $=\\frac{22}{7}\\times20\\times40=2514.29$ cm$^3$.",
        ],
      ],
      distractors: [3080, 565.71, 3520],
      distractorLabels: [
        "Internal_vs_External",
        "Using only inner volume",
        "Adding radii squares",
      ],
      tokens: ["hollow pipe", "$R^2-r^2$"],
    }),
  ],
  "men-inscribed-max": [
    def({
      motifId: "men-inscribed-max",
      branch: "cube-in-sphere",
      text:
        "The largest cube is carved out of a sphere of radius $\\sqrt{3}$ cm. Find the side of the cube.",
      values: { sphereRadiusRoot3: 1 },
      answer: 2,
      unit: "cm",
      formula: "$a\\sqrt{3}=2R$",
      steps: [
        [
          "transform",
          "For the largest inscribed cube, cube diagonal equals sphere diameter: $a\\sqrt{3}=2R$.",
        ],
        [
          "infer",
          "Here $R=\\sqrt{3}$, so $a\\sqrt{3}=2\\sqrt{3}$ and $a=2$ cm.",
        ],
      ],
      distractors: [3.46, 1, 4],
      distractorLabels: [
        "Diagonal_vs_Side",
        "Using radius as side",
        "Using diameter as side",
      ],
      tokens: ["largest cube", "$a\\sqrt{3}=2R$"],
    }),
  ],
  "men-ice-cream": [
    def({
      motifId: "men-ice-cream",
      branch: "cone-plus-hemisphere-volume",
      text:
        "An ice-cream consists of a cone of radius $7$ cm and height $6$ cm topped with a hemisphere of the same radius. Find the total volume. Use $\\pi=\\frac{22}{7}$.",
      values: { radius: 7, height: 6 },
      answer: round((PI * 49 * 6) / 3 + (2 * PI * 343) / 3),
      unit: "cm^3",
      formula:
        "$V=\\frac{1}{3}\\pi r^2h+\\frac{2}{3}\\pi r^3$",
      steps: [
        [
          "aggregate",
          "Total volume is cone volume plus hemisphere volume.",
        ],
        [
          "infer",
          "$V=\\frac{1}{3}\\pi\\times7^2\\times6+\\frac{2}{3}\\pi\\times7^3=1026.67$ cm$^3$.",
        ],
      ],
      distractors: [308, 718.67, 1437.33],
      distractorLabels: [
        "Missing hemisphere",
        "Missing cone",
        "Using full sphere",
      ],
      tokens: ["cone", "hemisphere"],
    }),
  ],
  "men-pyramid-slant": [
    def({
      motifId: "men-pyramid-slant",
      branch: "square-pyramid-tsa",
      text:
        "A square-based pyramid has base side $10$ cm and slant height $13$ cm. Find its total surface area.",
      values: { side: 10, slantHeight: 13 },
      answer: 360,
      unit: "cm^2",
      formula:
        "$TSA=a^2+4\\times\\frac{1}{2}al$",
      steps: [
        [
          "infer",
          "Base area $=10^2=100$ cm$^2$.",
        ],
        [
          "infer",
          "Four triangular faces have area $4\\times\\frac{1}{2}\\times10\\times13=260$ cm$^2$.",
        ],
        [
          "infer",
          "Total surface area $=100+260=360$ cm$^2$.",
        ],
      ],
      distractors: [260, 230, 460],
      distractorLabels: [
        "Missing base area",
        "Slant_Height_Neglect",
        "Double-counting base",
      ],
      tokens: ["pyramid", "slant height"],
    }),
  ],
  "men-scale-area": [
    def({
      motifId: "men-scale-area",
      branch: "linear-to-area-square",
      text:
        "Every side of a square is doubled. By what factor does its area increase?",
      values: { scale: 2 },
      answer: 4,
      formula: "$Area\\ scale=k^2$",
      steps: [
        [
          "transform",
          "Area depends on two linear dimensions, so it scales by $k^2$.",
        ],
        [
          "infer",
          "For $k=2$, area factor $=2^2=4$.",
        ],
      ],
      distractors: [2, 8, 6],
      distractorLabels: [
        "Scaling_Linear_Assumption",
        "Using volume cube law",
        "Adding powers",
      ],
      tokens: ["doubled", "$k^2$"],
    }),
  ],
  "men-scale-vol": [
    def({
      motifId: "men-scale-vol",
      branch: "industrial-cube-tripled",
      text:
        "A factory produces lead cubes for weights. To create a heavy-duty version, the side length of each cube is tripled. By what factor will the volume of the new cube increase?",
      values: { scale: 3 },
      answer: 27,
      formula: "$Volume\\ scale=k^3$",
      steps: [
        [
          "transform",
          "Volume depends on three linear dimensions, so it scales by $k^3$.",
        ],
        [
          "infer",
          "For $k=3$, volume factor $=3^3=27$.",
        ],
      ],
      distractors: [3, 9, 18],
      distractorLabels: [
        "Scaling_Linear_Assumption",
        "Using area square law",
        "Adding dimension effects",
      ],
      tokens: ["tripled", "industrial-skin", "$k^3$"],
    }),
    def({
      motifId: "men-scale-vol",
      branch: "sculptor-fullscale-three-times",
      text:
        "A sculptor is making a miniature clay model of a monument. He then decides to create a full-scale version in which every linear dimension is $3$ times that of the model. How many times as much clay will be needed?",
      values: { scale: 3 },
      answer: 27,
      formula: "$Volume\\ scale=k^3$",
      steps: [
        [
          "transform",
          "Volume depends on three linear dimensions, so the volume changes by the cube of the linear scale factor.",
        ],
        [
          "infer",
          "Since every linear dimension becomes $3$ times, the volume factor is $3^3=27$.",
        ],
      ],
      distractors: [3, 9, 18],
      distractorLabels: [
        "Scaling_Linear_Assumption",
        "Using area square law",
        "Adding dimension effects",
      ],
      tokens: ["three times", "sculptor-skin", "$k^3$"],
    }),
    def({
      motifId: "men-scale-vol",
      branch: "industrial-edge-increase-200-percent",
      text:
        "A storage company is redesigning a cubic container. Every edge is increased by $200\\%$ to create a larger version. By what factor will its volume increase?",
      values: { scale: 3, percentIncrease: 200 },
      answer: 27,
      formula: "$Volume\\ scale=k^3$",
      steps: [
        [
          "transform",
          "An increase of $200\\%$ means each edge becomes $100\\%+200\\%=300\\%$ of the original, so the new edge is $3$ times the old one.",
        ],
        [
          "infer",
          "Volume scales as the cube of the linear factor, so the new volume factor is $3^3=27$.",
        ],
      ],
      distractors: [3, 9, 8],
      distractorLabels: [
        "Scaling_Linear_Assumption",
        "Using area square law",
        "Treating $200\\%$ as doubling only",
      ],
      tokens: ["$200\\%$", "concealed-scale", "$k^3$"],
    }),
  ],
  "men-max-perimeter": [
    def({
      motifId: "men-max-perimeter",
      branch: "fixed-boundary-max-area",
      text:
        "Among all plane figures with the same perimeter $P$, the figure with maximum area is coded as: circle $=1$, square $=2$, rectangle $=3$, triangle $=4$. Find the correct code.",
      values: { fixedPerimeter: 1 },
      answer: 1,
      formula:
        "$For\\ fixed\\ perimeter,\\ circle\\ gives\\ maximum\\ area$",
      steps: [
        [
          "infer",
          "For a fixed boundary length $P$, the circle encloses the maximum area among plane figures, so the correct code is $1$.",
        ],
      ],
      distractors: [2, 3, 4],
      distractorLabels: [
        "Choosing square by symmetry",
        "Choosing rectangle by familiarity",
        "Choosing triangle by formula shortcut",
      ],
      tokens: ["same perimeter", "maximum area"],
    }),
  ],
};

function createScenarioFromMotif(
  motifId: string,
): MensurationScenarioFactory {
  return (difficulty) => {
    const definitions =
      scenarioDefinitionsByMotif[motifId];

    if (motifId === "men-scale-vol") {
      const definitionsByDifficulty: Record<
        DifficultyLabel,
        MensurationDefinition[]
      > = {
        Easy: definitions.filter(
          (definition) =>
            definition.branch ===
            "industrial-cube-tripled",
        ),
        Medium: definitions.filter(
          (definition) =>
            definition.branch ===
              "sculptor-fullscale-three-times" ||
            definition.branch ===
              "industrial-cube-tripled",
        ),
        Hard: definitions.filter(
          (definition) =>
            definition.branch ===
              "industrial-edge-increase-200-percent" ||
            definition.branch ===
              "sculptor-fullscale-three-times",
        ),
      };

      return finalizeMensurationScenario(
        pickRandomItem(
          definitionsByDifficulty[
            difficulty
          ]?.length
            ? definitionsByDifficulty[
                difficulty
              ]
            : definitions,
        ),
      );
    }

    return finalizeMensurationScenario(
      pickRandomItem(definitions),
    );
  };
}

const scenarioFactoriesByMotif = new Map<
  string,
  MensurationScenarioFactory
>(
  Object.keys(scenarioDefinitionsByMotif).map(
    (motifId) => [
      motifId,
      createScenarioFromMotif(motifId),
    ],
  ),
);

const legacyMotifAliases: Record<string, string> = {
  "mensuration-dimension-shift":
    "men-scale-area",
  "dimension-scale-effect":
    "men-scale-area",
  "composite-shape-breakdown":
    "men-ice-cream",
};

const patternSpecificMotifs: Record<
  string,
  string[]
> = {
  "registry-mensuration-easy": [
    "men-tri-ratio",
    "men-circ-revolution",
    "men-circ-sector",
    "men-poly-diag",
    "men-boundary-bend",
    "men-cube-diagonal",
    "men-scale-area",
  ],
  "registry-mensuration-medium": [
    "men-rect-path-in",
    "men-rect-path-out",
    "men-rhom-diag",
    "men-trap-parallel",
    "men-poly-angle",
    "men-cuboid-surface-shift",
    "men-prism-base",
    "men-cyl-csa-ratio",
    "men-cone-canvas",
    "men-sph-hem-tsa",
    "men-cone-sphere-recast",
    "men-cyl-wire",
    "men-scale-vol",
  ],
  "registry-mensuration-hard": [
    "men-frustum-vol",
    "men-hollow-cyl",
    "men-inscribed-max",
    "men-ice-cream",
    "men-pyramid-slant",
    "men-max-perimeter",
    "men-cone-sphere-recast",
    "men-cyl-wire",
    "men-cuboid-surface-shift",
    "men-rhom-diag",
  ],
  "registry-mensuration-2d-medium": [
    "men-tri-ratio",
    "men-rect-path-in",
    "men-rect-path-out",
    "men-rhom-diag",
    "men-trap-parallel",
    "men-circ-sector",
    "men-poly-angle",
  ],
  "registry-mensuration-2d-easy": [
    "men-tri-ratio",
    "men-circ-revolution",
    "men-circ-sector",
    "men-poly-diag",
    "men-boundary-bend",
  ],
  "registry-mensuration-2d-hard": [
    "men-rect-path-in",
    "men-rect-path-out",
    "men-rhom-diag",
    "men-trap-parallel",
    "men-poly-angle",
    "men-boundary-bend",
  ],
  "registry-mensuration-3d-medium": [
    "men-cube-diagonal",
    "men-prism-base",
    "men-cyl-csa-ratio",
    "men-cone-canvas",
    "men-sph-hem-tsa",
  ],
  "registry-mensuration-3d-hard": [
    "men-cone-sphere-recast",
    "men-cyl-wire",
    "men-frustum-vol",
    "men-hollow-cyl",
    "men-inscribed-max",
    "men-ice-cream",
    "men-pyramid-slant",
  ],
  "registry-mensuration-recasting-medium": [
    "men-boundary-bend",
    "men-cone-sphere-recast",
    "men-cyl-wire",
  ],
  "registry-mensuration-recasting-hard": [
    "men-cone-sphere-recast",
    "men-cyl-wire",
    "men-inscribed-max",
  ],
  "registry-mensuration-scaling-medium": [
    "men-cuboid-surface-shift",
    "men-scale-area",
    "men-scale-vol",
  ],
  "registry-mensuration-scaling-hard": [
    "men-scale-area",
    "men-scale-vol",
    "men-max-perimeter",
  ],
};

const fallbackMotifs = [
  "men-tri-ratio",
  "men-rect-path-in",
  "men-circ-sector",
  "men-cyl-csa-ratio",
  "men-cone-sphere-recast",
  "men-hollow-cyl",
  "men-scale-vol",
];

export function createMensurationScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const motifId =
    motif?.id &&
    (scenarioFactoriesByMotif.has(motif.id)
      ? motif.id
      : legacyMotifAliases[motif.id]);
  const patternMotifs =
    !motifId &&
    patternSpecificMotifs[pattern.id];
  const selectedMotif =
    motifId ??
    pickRandomItem(
      patternMotifs ?? fallbackMotifs,
    );
  const factory =
    scenarioFactoriesByMotif.get(
      selectedMotif,
    ) ??
    scenarioFactoriesByMotif.get(
      "men-tri-ratio",
    );
  if (!factory) {
    throw new Error(
      `No strict mensuration scenario mapping exists for motif ${selectedMotif}.`,
    );
  }
  return factory(difficulty, motif);
}
