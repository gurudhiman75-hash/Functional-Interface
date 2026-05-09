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

type GeometryDefinition = {
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

type GeometryScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

const GEOMETRY_CONTEXT: QuantScenarioContext = {
  entity: "geometric figure",
  metric: "required measure",
  context: "geometry",
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
              "plausible theorem slip",
            reasoningTrap:
              labels[index - 1] ??
              "wrong geometry relation",
          },
    );
  return {
    options: values.map(optionValue),
    correct: 0,
    optionMetadata,
  };
}

function finalizeGeometryScenario(
  definition: GeometryDefinition,
): QuantProceduralScenario {
  return {
    scenarioType: definition.motifId,
    topicCluster: "geometry",
    values: definition.values,
    formula: definition.formula,
    text: definition.text,
    correctAnswer: definition.answer,
    reasoningSteps: definition.steps.map(
      ([type, text]) =>
        createReasoningStep(type, text),
    ),
    context: GEOMETRY_CONTEXT,
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

function createGeometryDefinition(
  motifId: string,
  difficulty: DifficultyLabel,
): GeometryDefinition {
  switch (motifId) {
    case "geo-ang-parallel": {
      const angle =
        difficulty === "Easy" ? 65 : 72;
      const answer = 180 - angle;
      return {
        motifId,
        branch:
          "co-interior-supplement",
        values: { angle },
        answer,
        formula: "180 - angle",
        text: `In a bridge drawing, $AB \\parallel CD$ and a transversal cuts them. If one interior angle is $${angle}^{\\circ}$, find the consecutive interior angle on the same side.`,
        steps: [
          [
            "transform",
            `For $AB \\parallel CD$, consecutive interior angles are supplementary.`,
          ],
          [
            "infer",
            `Required angle $= 180^{\\circ} - ${angle}^{\\circ} = ${answer}^{\\circ}$.`,
          ],
        ],
        distractors: [
          angle,
          90 - angle,
          180,
        ],
        distractorLabels: [
          "Parallel_Transversal_Corresponding",
          "Complementary angle used instead of supplementary",
          "Used full straight angle as the answer",
        ],
        tokens: ["parallel", "transversal"],
      };
    }
    case "geo-ang-bisector": {
      const ab = 6;
      const ac = 9;
      const bd = 4;
      const answer = (ac * bd) / ab;
      return {
        motifId,
        branch:
          "internal-bisector-segment",
        values: { ab, ac, bd },
        answer,
        formula: "DC = AC * BD / AB",
        text: `In $\\triangle ABC$, $AD$ bisects $\\angle A$ and meets $BC$ at $D$. If $AB=${ab}$, $AC=${ac}$, and $BD=${bd}$, find $DC$.`,
        steps: [
          [
            "transform",
            `By the angle bisector theorem, $\\frac{BD}{DC}=\\frac{AB}{AC}$.`,
          ],
          [
            "infer",
            `$DC = \\frac{AC \\times BD}{AB}=\\frac{${ac}\\times${bd}}{${ab}}=${answer}$.`,
          ],
        ],
        distractors: [
          (ab * bd) / ac,
          bd + ac - ab,
          bd,
        ],
        distractorLabels: [
          "Internal_Bisector_Ratio_Flip",
          "Used additive side relation",
          "Ignored the side ratio",
        ],
        tokens: ["angle bisector", "triangle"],
      };
    }
    case "geo-ang-complement": {
      const angle = 38;
      const answer = 90 - angle;
      return {
        motifId,
        branch: "complementary-angle",
        values: { angle },
        answer,
        formula: "90 - angle",
        text: `Two angles are complementary. If one angle is $${angle}^{\\circ}$, find the other angle.`,
        steps: [
          [
            "transform",
            `Complementary angles add up to $90^{\\circ}$.`,
          ],
          [
            "infer",
            `Other angle $=90^{\\circ}-${angle}^{\\circ}=${answer}^{\\circ}$.`,
          ],
        ],
        distractors: [
          180 - angle,
          angle,
          90 + angle,
        ],
        distractorLabels: [
          "Used supplementary relation",
          "Repeated the given angle",
          "Added instead of subtracting",
        ],
      };
    }
    case "geo-ang-polygon":
    case "geo-poly-interior": {
      const interior = 140;
      const exterior = 180 - interior;
      const answer = 360 / exterior;
      return {
        motifId,
        branch: "regular-polygon-sides",
        values: { interior, exterior },
        answer,
        formula: "360 / (180 - interior)",
        text: `Each interior angle of a regular polygon is $${interior}^{\\circ}$. Find the number of sides.`,
        steps: [
          [
            "transform",
            `Each exterior angle $=180^{\\circ}-${interior}^{\\circ}=${exterior}^{\\circ}$.`,
          ],
          [
            "infer",
            `Number of sides $=\\frac{360^{\\circ}}{${exterior}^{\\circ}}=${answer}$.`,
          ],
        ],
        distractors: [
          180 / exterior,
          interior / exterior,
          answer + 1,
        ],
        distractorLabels: [
          "Exterior_Angle_Total",
          "Used interior-to-exterior ratio as side count",
          "Arithmetic offset",
        ],
      };
    }
    case "geo-tri-inequality": {
      const a = 8;
      const b = 11;
      const answer = a + b - 1;
      return {
        motifId,
        branch:
          "greatest-third-side",
        values: { a, b },
        answer,
        formula: "a + b - 1",
        text: `Two sides of $\\triangle ABC$ are $${a}$ and $${b}$. If the third side is an integer, find its greatest possible value.`,
        steps: [
          [
            "transform",
            `By triangle inequality, the third side must be less than $${a}+${b}$.`,
          ],
          [
            "infer",
            `Greatest integer third side $=${a}+${b}-1=${answer}$.`,
          ],
        ],
        distractors: [
          a + b,
          b - a,
          a + b + 1,
        ],
        distractorLabels: [
          "Pythagorean_Triple_Slip",
          "Used only side difference",
          "Allowed invalid side length",
        ],
      };
    }
    case "geo-tri-incenter": {
      const a = 70;
      const answer = 90 + a / 2;
      return {
        motifId,
        branch: "incenter-angle",
        values: { a },
        answer,
        formula: "90 + A / 2",
        text: `In $\\triangle ABC$, $I$ is the incenter. If $\\angle A=${a}^{\\circ}$, find $\\angle BIC$.`,
        steps: [
          [
            "transform",
            `For the incenter, $\\angle BIC = 90^{\\circ}+\\frac{1}{2}\\angle A$.`,
          ],
          [
            "infer",
            `$\\angle BIC=90^{\\circ}+\\frac{${a}^{\\circ}}{2}=${answer}^{\\circ}$.`,
          ],
        ],
        distractors: [
          90 - a / 2,
          a / 2,
          180 - a,
        ],
        distractorLabels: [
          "Circumcenter_Incenter_Confusion",
          "Used only half angle",
          "Used supplementary angle",
        ],
      };
    }
    case "geo-tri-centroid": {
      const median = 18;
      const answer = (2 * median) / 3;
      return {
        motifId,
        branch: "centroid-median-split",
        values: { median },
        answer,
        formula: "2 * median / 3",
        text: `In $\\triangle ABC$, median $AD$ is $${median}$. If $G$ is the centroid, find $AG$.`,
        steps: [
          [
            "transform",
            `The centroid divides each median in the ratio $2:1$ from the vertex.`,
          ],
          [
            "infer",
            `$AG=\\frac{2}{3}\\times ${median}=${answer}$.`,
          ],
        ],
        distractors: [
          median / 3,
          median / 2,
          median,
        ],
        distractorLabels: [
          "Median_Altitude_Swap",
          "Used midpoint instead of centroid",
          "Ignored centroid split",
        ],
      };
    }
    case "geo-tri-area-ratio": {
      const smallerArea = 45;
      const smallBase = 5;
      const largeBase = 8;
      const answer =
        (smallerArea * largeBase) /
        smallBase;
      return {
        motifId,
        branch: "same-height-area-ratio",
        values: {
          smallerArea,
          smallBase,
          largeBase,
        },
        answer,
        formula:
          "smallerArea * largeBase / smallBase",
        text: `Two triangles stand on bases in the ratio $${smallBase}:${largeBase}$ and have the same height. If the smaller triangle has area $${smallerArea}$, find the larger area.`,
        steps: [
          [
            "transform",
            `For the same height, areas are proportional to bases.`,
          ],
          [
            "infer",
            `Larger area $=${smallerArea}\\times\\frac{${largeBase}}{${smallBase}}=${answer}$.`,
          ],
        ],
        distractors: [
          smallerArea,
          smallerArea +
            largeBase -
            smallBase,
          (smallerArea *
            largeBase *
            largeBase) /
            (smallBase * smallBase),
        ],
        distractorLabels: [
          "Ignored base ratio",
          "Added ratio difference",
          "Similarity_Ratio_Linear",
        ],
      };
    }
    case "geo-sim-basic": {
      const ab = 6;
      const de = 9;
      const ac = 8;
      const answer = 12;
      return {
        motifId,
        branch: "similar-side-scale",
        values: { ab, de, ac },
        answer,
        formula: "AC * DE / AB",
        text: `$\\triangle ABC \\sim \\triangle DEF$. If $AB=${ab}$, $DE=${de}$, and $AC=${ac}$, find $DF$.`,
        steps: [
          [
            "transform",
            `For similar triangles, corresponding sides are proportional: $\\frac{AB}{DE}=\\frac{AC}{DF}$.`,
          ],
          [
            "infer",
            `$DF=\\frac{${ac}\\times${de}}{${ab}}=${answer}$.`,
          ],
        ],
        distractors: [
          9,
          (ab * ac) / de,
          ac + de - ab,
        ],
        distractorLabels: [
          "Used matching side directly",
          "Similarity ratio inverted",
          "Used additive relation",
        ],
      };
    }
    case "geo-sim-area": {
      const sideA = 3;
      const sideB = 5;
      const areaA = 81;
      const answer =
        (areaA * sideB * sideB) /
        (sideA * sideA);
      return {
        motifId,
        branch: "similar-area-square",
        values: { sideA, sideB, areaA },
        answer,
        formula:
          "areaA * sideB^2 / sideA^2",
        text: `Two similar triangles have corresponding sides in the ratio $${sideA}:${sideB}$. If the area of the smaller triangle is $${areaA}$, find the area of the larger triangle.`,
        steps: [
          [
            "transform",
            `Areas of similar triangles are in the square of the side ratio.`,
          ],
          [
            "infer",
            `Larger area $=${areaA}\\times\\left(\\frac{${sideB}}{${sideA}}\\right)^2=${answer}$.`,
          ],
        ],
        distractors: [
          (areaA * sideB) / sideA,
          areaA,
          answer - areaA,
        ],
        distractorLabels: [
          "Similarity_Ratio_Linear",
          "Ignored similarity scale",
          "Reported increase instead of final area",
        ],
      };
    }
    case "geo-tri-thales": {
      const ac = 18;
      const ratioA = 2;
      const ratioB = 3;
      const answer =
        (ac * ratioA) /
        (ratioA + ratioB);
      return {
        motifId,
        branch: "bpt-side-split",
        values: { ac, ratioA, ratioB },
        answer,
        formula: "AC * ratioA / (ratioA + ratioB)",
        text: `In $\\triangle ABC$, $DE \\parallel BC$ with $D$ on $AB$ and $E$ on $AC$. If $AD:DB=${ratioA}:${ratioB}$ and $AC=${ac}$, find $AE$.`,
        steps: [
          [
            "transform",
            `By BPT, $\\frac{AD}{DB}=\\frac{AE}{EC}$.`,
          ],
          [
            "infer",
            `$AE=\\frac{${ratioA}}{${ratioA}+${ratioB}}\\times${ac}=${answer}$.`,
          ],
        ],
        distractors: [
          (ac * ratioB) /
            (ratioA + ratioB),
          ac / ratioA,
          ac / ratioB,
        ],
        distractorLabels: [
          "Internal_Bisector_Ratio_Flip",
          "Divided by first ratio part",
          "Divided by second ratio part",
        ],
      };
    }
    case "geo-right-pythagoras": {
      const a = 8;
      const b = 15;
      const answer = 17;
      return {
        motifId,
        branch: "pythagorean-triple",
        values: { a, b },
        answer,
        formula: "sqrt(a^2 + b^2)",
        text: `In right $\\triangle ABC$, the perpendicular sides are $${a}$ and $${b}$. Find the hypotenuse.`,
        steps: [
          [
            "transform",
            `By Pythagoras, $h^2=${a}^2+${b}^2$.`,
          ],
          [
            "infer",
            `$h=\\sqrt{${a * a}+${b * b}}=${answer}$.`,
          ],
        ],
        distractors: [
          a + b,
          b - a,
          Math.sqrt(a * b),
        ],
        distractorLabels: [
          "Pythagorean_Triple_Slip",
          "Subtracted legs",
          "Used product under root",
        ],
      };
    }
    case "geo-right-altitude": {
      const x = 9;
      const y = 16;
      const answer = 12;
      return {
        motifId,
        branch: "altitude-geometric-mean",
        values: { x, y },
        answer,
        formula: "sqrt(x * y)",
        text: `In a right triangle, the altitude to the hypotenuse divides it into segments $${x}$ and $${y}$. Find the altitude.`,
        steps: [
          [
            "transform",
            `For altitude to hypotenuse, $h^2=xy$.`,
          ],
          [
            "infer",
            `$h=\\sqrt{${x}\\times${y}}=${answer}$.`,
          ],
        ],
        distractors: [
          x + y,
          (x + y) / 2,
          y - x,
        ],
        distractorLabels: [
          "Median_Altitude_Swap",
          "Used arithmetic mean",
          "Used segment difference",
        ],
      };
    }
    case "geo-right-30-60-90": {
      const short = 7;
      const answer = 14;
      return {
        motifId,
        branch: "special-triangle-30-60-90",
        values: { short },
        answer,
        formula: "2 * short",
        text: `In a $30^{\\circ}-60^{\\circ}-90^{\\circ}$ triangle, the side opposite $30^{\\circ}$ is $${short}$. Find the hypotenuse.`,
        steps: [
          [
            "transform",
            `The side ratio is $1:\\sqrt{3}:2$.`,
          ],
          [
            "infer",
            `Hypotenuse $=2\\times${short}=${answer}$.`,
          ],
        ],
        distractors: [
          short,
          short * 3,
          short + 2,
        ],
        distractorLabels: [
          "Ignored special ratio",
          "Used 3 as multiplier",
          "Added instead of multiplied",
        ],
      };
    }
    case "geo-right-45-45-90": {
      const leg = 9;
      const answer = round(leg * Math.SQRT2);
      return {
        motifId,
        branch: "special-triangle-45-45-90",
        values: { leg },
        answer,
        formula: "leg * sqrt(2)",
        text: `In a $45^{\\circ}-45^{\\circ}-90^{\\circ}$ triangle, each equal side is $${leg}$. Find the hypotenuse.`,
        steps: [
          [
            "transform",
            `The side ratio is $1:1:\\sqrt{2}$.`,
          ],
          [
            "infer",
            `Hypotenuse $=${leg}\\sqrt{2}\\approx ${answer}$.`,
          ],
        ],
        distractors: [
          leg * 2,
          leg,
          leg + Math.SQRT2,
        ],
        distractorLabels: [
          "Pythagorean_Triple_Slip",
          "Ignored hypotenuse scale",
          "Added root instead of multiplying",
        ],
      };
    }
    case "geo-circ-chord-dist": {
      const r = 13;
      const d = 5;
      const answer = 24;
      return {
        motifId,
        branch: "chord-distance-from-center",
        values: { r, d },
        answer,
        formula: "2 * sqrt(r^2 - d^2)",
        text: `A chord $AB$ of a circle is at a distance $${d}$ from the center $O$. If the radius is $${r}$, find the length of $AB$.`,
        steps: [
          [
            "transform",
            `The perpendicular from center to chord bisects the chord.`,
          ],
          [
            "infer",
            `$\\frac{AB}{2}=\\sqrt{${r}^2-${d}^2}=12$, so $AB=${answer}$.`,
          ],
        ],
        distractors: [
          12,
          r + d,
          2 * r,
        ],
        distractorLabels: [
          "Gave half chord",
          "Added radius and distance",
          "Used diameter",
        ],
      };
    }
    case "geo-circ-intersect-chord": {
      const pa = 6;
      const pb = 8;
      const pc = 4;
      const answer = 12;
      return {
        motifId,
        branch: "intersecting-chords",
        values: { pa, pb, pc },
        answer,
        formula: "PA * PB / PC",
        text: `Chords $AB$ and $CD$ intersect at $P$ inside a circle. If $PA=${pa}$, $PB=${pb}$, and $PC=${pc}$, find $PD$.`,
        steps: [
          [
            "transform",
            `By intersecting chords theorem, $PA\\cdot PB=PC\\cdot PD$.`,
          ],
          [
            "infer",
            `$PD=\\frac{${pa}\\times${pb}}{${pc}}=${answer}$.`,
          ],
        ],
        distractors: [
          pa + pb - pc,
          (pa * pc) / pb,
          pa + pb + pc,
        ],
        distractorLabels: [
          "Tangent_Secant_Addition",
          "Product ratio inverted",
          "Added all segments",
        ],
      };
    }
    case "geo-circ-tangent-secant": {
      const pa = 9;
      const pb = 16;
      const answer = 12;
      return {
        motifId,
        branch: "tangent-secant",
        values: { pa, pb },
        answer,
        formula: "sqrt(PA * PB)",
        text: `From external point $P$, tangent $PT$ and secant $PAB$ are drawn to a circle. If $PA=${pa}$ and whole secant $PB=${pb}$, find $PT$.`,
        steps: [
          [
            "transform",
            `By tangent-secant theorem, $PT^2=PA\\cdot PB$.`,
          ],
          [
            "infer",
            `$PT=\\sqrt{${pa}\\times${pb}}=${answer}$.`,
          ],
        ],
        distractors: [
          pa + pb,
          Math.sqrt(pa * (pb - pa)),
          pb - pa,
        ],
        distractorLabels: [
          "Tangent_Secant_Addition",
          "Used inner secant instead of whole secant",
          "Subtracted segments",
        ],
      };
    }
    case "geo-circ-cyclic-quad": {
      const angle = 110;
      const answer = 70;
      return {
        motifId,
        branch: "opposite-angle-sum",
        values: { angle },
        answer,
        formula: "180 - angle",
        text: `$ABCD$ is a cyclic quadrilateral. If $\\angle A=${angle}^{\\circ}$, find $\\angle C$.`,
        steps: [
          [
            "transform",
            `Opposite angles of a cyclic quadrilateral are supplementary.`,
          ],
          [
            "infer",
            `$\\angle C=180^{\\circ}-${angle}^{\\circ}=${answer}^{\\circ}$.`,
          ],
        ],
        distractors: [
          angle,
          90,
          360 - angle,
        ],
        distractorLabels: [
          "Cyclic_Adjacent_Trap",
          "Assumed right angle",
          "Used full angle sum",
        ],
      };
    }
    case "geo-circ-direct-common": {
      const d = 25;
      const r1 = 8;
      const r2 = 1;
      const answer = 24;
      return {
        motifId,
        branch: "direct-common-tangent",
        values: { d, r1, r2 },
        answer,
        formula: "sqrt(d^2 - (r1-r2)^2)",
        text: `Two circles have radii $${r1}$ and $${r2}$, and their centers are $${d}$ apart. Find the length of their direct common tangent.`,
        steps: [
          [
            "transform",
            `For DCT, length $=\\sqrt{d^2-(r_1-r_2)^2}$.`,
          ],
          [
            "infer",
            `DCT $=\\sqrt{${d}^2-(${r1}-${r2})^2}=${answer}$.`,
          ],
        ],
        distractors: [
          20,
          d - r1 - r2,
          d,
        ],
        distractorLabels: [
          "Common_Tangent_Sign_Swap",
          "Subtracted radii linearly",
          "Ignored radii",
        ],
      };
    }
    case "geo-circ-trans-common": {
      const d = 25;
      const r1 = 8;
      const r2 = 7;
      const answer = 20;
      return {
        motifId,
        branch: "transverse-common-tangent",
        values: { d, r1, r2 },
        answer,
        formula: "sqrt(d^2 - (r1+r2)^2)",
        text: `Two circles have radii $${r1}$ and $${r2}$, and their centers are $${d}$ apart. Find the length of their transverse common tangent.`,
        steps: [
          [
            "transform",
            `For TCT, length $=\\sqrt{d^2-(r_1+r_2)^2}$.`,
          ],
          [
            "infer",
            `TCT $=\\sqrt{${d}^2-(${r1}+${r2})^2}=${answer}$.`,
          ],
        ],
        distractors: [
          24,
          d - r1 - r2,
          d,
        ],
        distractorLabels: [
          "Common_Tangent_Sign_Swap",
          "Subtracted radii linearly",
          "Ignored radii",
        ],
      };
    }
    case "geo-quad-parallelogram": {
      const angle = 68;
      const answer = 112;
      return {
        motifId,
        branch:
          "adjacent-parallelogram-angle",
        values: { angle },
        answer,
        formula: "180 - angle",
        text: `In parallelogram $ABCD$, $\\angle A=${angle}^{\\circ}$. Find adjacent angle $\\angle B$.`,
        steps: [
          [
            "transform",
            `Adjacent angles of a parallelogram are supplementary.`,
          ],
          [
            "infer",
            `$\\angle B=180^{\\circ}-${angle}^{\\circ}=${answer}^{\\circ}$.`,
          ],
        ],
        distractors: [
          angle,
          90,
          360 - angle,
        ],
        distractorLabels: [
          "Used opposite angle relation",
          "Assumed right angle",
          "Used full angle sum",
        ],
      };
    }
    case "geo-quad-rhombus-diag": {
      const d1 = 10;
      const d2 = 24;
      const answer = 13;
      return {
        motifId,
        branch: "rhombus-side-from-diagonals",
        values: { d1, d2 },
        answer,
        formula: "sqrt((d1/2)^2 + (d2/2)^2)",
        text: `The diagonals of a rhombus are $${d1}$ and $${d2}$. Find its side.`,
        steps: [
          [
            "transform",
            `Diagonals of a rhombus bisect each other at $90^{\\circ}$.`,
          ],
          [
            "infer",
            `Side $=\\sqrt{(${d1}/2)^2+(${d2}/2)^2}=${answer}$.`,
          ],
        ],
        distractors: [
          (d1 * d2) / 2,
          d1 + d2,
          d2 - d1,
        ],
        distractorLabels: [
          "Rhombus_Area_Side",
          "Added diagonals",
          "Subtracted diagonals",
        ],
      };
    }
    case "geo-quad-trapezium-mid": {
      const a = 12;
      const b = 20;
      const answer = 16;
      return {
        motifId,
        branch: "trapezium-midsegment",
        values: { a, b },
        answer,
        formula: "(a + b) / 2",
        text: `In trapezium $ABCD$, $AB \\parallel CD$, $AB=${a}$ and $CD=${b}$. Find the segment joining the midpoints of the non-parallel sides.`,
        steps: [
          [
            "transform",
            `The mid-segment of a trapezium equals half the sum of the parallel sides.`,
          ],
          [
            "infer",
            `Required length $=\\frac{${a}+${b}}{2}=${answer}$.`,
          ],
        ],
        distractors: [
          a + b,
          b - a,
          (a * b) / 2,
        ],
        distractorLabels: [
          "Forgot half factor",
          "Used side difference",
          "Multiplied sides",
        ],
      };
    }
    case "geo-coord-dist": {
      const x1 = 1;
      const y1 = 2;
      const x2 = 7;
      const y2 = 10;
      const answer = 10;
      return {
        motifId,
        branch: "coordinate-distance",
        values: { x1, y1, x2, y2 },
        answer,
        formula:
          "sqrt((x2-x1)^2 + (y2-y1)^2)",
        text: `Find the distance between $A(${x1},${y1})$ and $B(${x2},${y2})$.`,
        steps: [
          [
            "transform",
            `Distance $=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$.`,
          ],
          [
            "infer",
            `$AB=\\sqrt{(${x2}-${x1})^2+(${y2}-${y1})^2}=${answer}$.`,
          ],
        ],
        distractors: [
          Math.abs(x2 - x1) +
            Math.abs(y2 - y1),
          Math.abs(x2 - x1),
          Math.abs(y2 - y1),
        ],
        distractorLabels: [
          "Distance_Sign_Error",
          "Used only x displacement",
          "Used only y displacement",
        ],
      };
    }
    case "geo-coord-section": {
      const x1 = 2;
      const y1 = 4;
      const x2 = 8;
      const y2 = 10;
      const m = 1;
      const n = 2;
      const answer =
        (m * x2 + n * x1) / (m + n);
      return {
        motifId,
        branch: "internal-section-x",
        values: { x1, y1, x2, y2, m, n },
        answer,
        formula: "(m*x2+n*x1)/(m+n)",
        text: `Point $P$ divides $A(${x1},${y1})B(${x2},${y2})$ internally in the ratio $${m}:${n}$. Find the $x$-coordinate of $P$.`,
        steps: [
          [
            "transform",
            `By section formula, $x=\\frac{mx_2+nx_1}{m+n}$.`,
          ],
          [
            "infer",
            `$x=\\frac{${m}\\times${x2}+${n}\\times${x1}}{${m}+${n}}=${answer}$.`,
          ],
        ],
        distractors: [
          (n * x2 + m * x1) / (m + n),
          (x1 + x2) / 2,
          x2 - x1,
        ],
        distractorLabels: [
          "Internal_Bisector_Ratio_Flip",
          "Used midpoint formula",
          "Used coordinate difference",
        ],
      };
    }
    case "geo-coord-slope": {
      const x1 = 2;
      const y1 = 3;
      const x2 = 6;
      const y2 = 11;
      const answer = 2;
      return {
        motifId,
        branch: "slope-between-points",
        values: { x1, y1, x2, y2 },
        answer,
        formula: "(y2-y1)/(x2-x1)",
        text: `Find the slope of line $AB$ passing through $A(${x1},${y1})$ and $B(${x2},${y2})$.`,
        steps: [
          [
            "transform",
            `Slope $m=\\frac{y_2-y_1}{x_2-x_1}$.`,
          ],
          [
            "infer",
            `$m=\\frac{${y2}-${y1}}{${x2}-${x1}}=${answer}$.`,
          ],
        ],
        distractors: [
          1 / answer,
          y2 - y1,
          x2 - x1,
        ],
        distractorLabels: [
          "Slope_Inversion",
          "Used rise only",
          "Used run only",
        ],
      };
    }
    case "geo-coord-area": {
      const x1 = 0;
      const y1 = 0;
      const x2 = 8;
      const y2 = 0;
      const x3 = 0;
      const y3 = 6;
      const answer = 24;
      return {
        motifId,
        branch: "coordinate-triangle-area",
        values: {
          x1,
          y1,
          x2,
          y2,
          x3,
          y3,
        },
        answer,
        formula:
          "abs(x1(y2-y3)+x2(y3-y1)+x3(y1-y2))/2",
        text: `Find the area of $\\triangle ABC$ with $A(${x1},${y1})$, $B(${x2},${y2})$, and $C(${x3},${y3})$.`,
        steps: [
          [
            "transform",
            `Use coordinate area formula for a triangle.`,
          ],
          [
            "infer",
            `Area $=\\frac{1}{2}\\times${x2}\\times${y3}=${answer}$.`,
          ],
        ],
        distractors: [
          x2 * y3,
          x2 + y3,
          0,
        ],
        distractorLabels: [
          "Forgot half factor",
          "Added base and height",
          "Coordinate_Collinear_Check",
        ],
      };
    }
    case "geo-coord-circle": {
      const h = 3;
      const k = -4;
      const answer = 5;
      return {
        motifId,
        branch: "circle-radius-standard-form",
        values: { h, k, answer },
        answer,
        formula: "sqrt(r^2)",
        text: `A circle has equation $(x-3)^2+(y+4)^2=25$. Find its radius.`,
        steps: [
          [
            "transform",
            `Compare with $(x-h)^2+(y-k)^2=r^2$.`,
          ],
          [
            "infer",
            `$r^2=25$, so $r=${answer}$.`,
          ],
        ],
        distractors: [
          25,
          Math.abs(h),
          Math.abs(k),
        ],
        distractorLabels: [
          "Used r squared as radius",
          "Used x-coordinate of center",
          "Used y-coordinate of center",
        ],
      };
    }
    case "geo-poly-diagonal": {
      const n = 10;
      const answer = 35;
      return {
        motifId,
        branch: "polygon-diagonal-count",
        values: { n },
        answer,
        formula: "n(n-3)/2",
        text: `Find the number of diagonals in a polygon of $${n}$ sides.`,
        steps: [
          [
            "transform",
            `Number of diagonals in an $n$-gon is $\\frac{n(n-3)}{2}$.`,
          ],
          [
            "infer",
            `Diagonals $=\\frac{${n}(${n}-3)}{2}=${answer}$.`,
          ],
        ],
        distractors: [
          n * (n - 3),
          n * (n - 1) / 2,
          n + (n - 3),
        ],
        distractorLabels: [
          "Polygon_Diagonal_n",
          "Counted all vertex pairs",
          "Added terms",
        ],
      };
    }
    case "geo-circ-angle-center": {
      const circumferenceAngle = 48;
      const answer = 96;
      return {
        motifId,
        branch:
          "center-angle-double",
        values: { circumferenceAngle },
        answer,
        formula: "2 * circumferenceAngle",
        text: `In a circle, $\\angle APB=${circumferenceAngle}^{\\circ}$ is subtended by arc $AB$ at the circumference. Find $\\angle AOB$ at the center.`,
        steps: [
          [
            "transform",
            `The angle at the center is twice the angle at the circumference on the same arc.`,
          ],
          [
            "infer",
            `$\\angle AOB=2\\times${circumferenceAngle}^{\\circ}=${answer}^{\\circ}$.`,
          ],
        ],
        distractors: [
          circumferenceAngle / 2,
          circumferenceAngle,
          180 - circumferenceAngle,
        ],
        distractorLabels: [
          "Angle_at_Center_Half",
          "Used same angle",
          "Used supplementary angle",
        ],
      };
    }
    case "geo-circ-semicircle": {
      const answer = 90;
      return {
        motifId,
        branch: "angle-in-semicircle",
        values: { answer },
        answer,
        formula: "90",
        text: `In a circle, $AB$ is a diameter and $C$ lies on the circumference. Find $\\angle ACB$.`,
        steps: [
          [
            "transform",
            `The angle in a semicircle is a right angle.`,
          ],
          [
            "infer",
            `$\\angle ACB=90^{\\circ}$.`,
          ],
        ],
        distractors: [180, 45, 60],
        distractorLabels: [
          "Semi-circle_Angle_Error",
          "Used half of right angle",
          "Assumed equilateral triangle",
        ],
      };
    }
    default:
      return createGeometryDefinition(
        pickRandomItem([
          "geo-ang-parallel",
          "geo-sim-basic",
          "geo-right-pythagoras",
          "geo-circ-tangent-secant",
          "geo-coord-dist",
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
      "geo-ang-parallel",
      "geo-ang-bisector",
      "geo-ang-polygon",
      "geo-tri-incenter",
      "geo-tri-centroid",
      "geo-sim-basic",
      "geo-sim-area",
      "geo-right-pythagoras",
      "geo-right-altitude",
      "geo-circ-chord-dist",
      "geo-circ-tangent-secant",
      "geo-circ-cyclic-quad",
      "geo-quad-rhombus-diag",
      "geo-coord-dist",
      "geo-coord-slope",
      "geo-coord-area",
    ]);

  return finalizeGeometryScenario(
    createGeometryDefinition(
      motifId,
      difficulty,
    ),
  );
}

const PATTERN_FACTORIES: Record<
  string,
  GeometryScenarioFactory[]
> = {
  geometry: [createScenarioFromMotif],
  "geometry-lines-angles": [
    (difficulty) =>
      finalizeGeometryScenario(
        createGeometryDefinition(
          pickRandomItem([
            "geo-ang-parallel",
            "geo-ang-bisector",
            "geo-ang-complement",
            "geo-ang-polygon",
          ]),
          difficulty,
        ),
      ),
  ],
  "geometry-triangles": [
    (difficulty) =>
      finalizeGeometryScenario(
        createGeometryDefinition(
          pickRandomItem([
            "geo-tri-inequality",
            "geo-tri-incenter",
            "geo-tri-centroid",
            "geo-tri-area-ratio",
          ]),
          difficulty,
        ),
      ),
  ],
  "geometry-similarity": [
    (difficulty) =>
      finalizeGeometryScenario(
        createGeometryDefinition(
          pickRandomItem([
            "geo-sim-basic",
            "geo-sim-area",
            "geo-tri-thales",
          ]),
          difficulty,
        ),
      ),
  ],
  "geometry-right-triangles": [
    (difficulty) =>
      finalizeGeometryScenario(
        createGeometryDefinition(
          pickRandomItem([
            "geo-right-pythagoras",
            "geo-right-altitude",
            "geo-right-30-60-90",
            "geo-right-45-45-90",
          ]),
          difficulty,
        ),
      ),
  ],
  "geometry-circles": [
    (difficulty) =>
      finalizeGeometryScenario(
        createGeometryDefinition(
          pickRandomItem([
            "geo-circ-chord-dist",
            "geo-circ-intersect-chord",
            "geo-circ-tangent-secant",
            "geo-circ-cyclic-quad",
            "geo-circ-direct-common",
            "geo-circ-trans-common",
            "geo-circ-angle-center",
            "geo-circ-semicircle",
          ]),
          difficulty,
        ),
      ),
  ],
  "geometry-coordinate": [
    (difficulty) =>
      finalizeGeometryScenario(
        createGeometryDefinition(
          pickRandomItem([
            "geo-coord-dist",
            "geo-coord-section",
            "geo-coord-slope",
            "geo-coord-area",
            "geo-coord-circle",
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
  "geometry-lines-angles": [
    "geo-ang-parallel",
    "geo-ang-bisector",
    "geo-ang-complement",
    "geo-ang-polygon",
  ],
  "geometry-triangles": [
    "geo-tri-inequality",
    "geo-tri-orthocenter",
    "geo-tri-circumcenter",
    "geo-tri-incenter",
    "geo-tri-centroid",
    "geo-tri-med-length",
    "geo-tri-area-ratio",
    "geo-tri-exterior-angle",
    "geo-tri-isosceles-base",
    "geo-right-pythagoras",
    "geo-right-altitude",
    "geo-right-30-60-90",
    "geo-right-45-45-90",
  ],
  "geometry-similarity": [
    "geo-sim-basic",
    "geo-sim-area",
    "geo-cong-proof",
    "geo-tri-thales",
  ],
  "geometry-right-triangles": [
    "geo-right-pythagoras",
    "geo-right-altitude",
    "geo-right-30-60-90",
    "geo-right-45-45-90",
  ],
  "geometry-circles": [
    "geo-circ-chord-dist",
    "geo-circ-intersect-chord",
    "geo-circ-tangent-secant",
    "geo-circ-cyclic-quad",
    "geo-circ-alternate-segment",
    "geo-circ-direct-common",
    "geo-circ-trans-common",
    "geo-circ-angle-center",
    "geo-circ-semicircle",
  ],
  "geometry-coordinate": [
    "geo-coord-dist",
    "geo-coord-section",
    "geo-coord-slope",
    "geo-coord-area",
    "geo-coord-circle",
    "geo-coord-midpoint",
  ],
};

function resolveGeometryPatternKey(
  pattern: Pattern,
) {
  const registryMatch =
    pattern.id.match(
      /^registry-(geometry(?:-[a-z]+)*)-(easy|medium|hard)$/i,
    );
  if (registryMatch?.[1]) {
    return registryMatch[1];
  }

  return pattern.id;
}

export function createGeometryScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const patternKey =
    resolveGeometryPatternKey(pattern);
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
    PATTERN_FACTORIES.geometry;

  return pickRandomItem(factories)(
    difficulty,
    motif,
  );
}
