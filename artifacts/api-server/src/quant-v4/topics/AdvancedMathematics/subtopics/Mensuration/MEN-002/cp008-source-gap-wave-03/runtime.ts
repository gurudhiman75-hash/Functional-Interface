import {
  exactEquals,
  exactKey,
  formatExactMath,
  formatWithUnit,
  integerCubeRoot,
  isPositive,
  pi,
  rational,
} from "../foundation/exact";
import { createSeededRandom, type SeededRandom } from "../foundation/seed";
import type { ExactRational, ExactValue, Men002Difficulty, Men002Unit } from "../foundation/types";
import { getMenCp008Wave03Definition } from "./registry";
import type {
  MenCp008Wave03Option,
  MenCp008Wave03Package,
  MenCp008Wave03PrototypeId,
  MenCp008Wave03State,
} from "./types";

interface WrongAnswer {
  value: ExactValue;
  misconceptionId: string;
  explanation: string;
}

interface Draft {
  state: MenCp008Wave03State;
  stem: string;
  answer: ExactValue;
  keyRule: string;
  steps: MenCp008Wave03Package["explanation"]["steps"];
  shortcut: string;
}

const CYLINDER_AREA_RATIO_STATES = [
  { radius: 3n, height: 8n, complexityBand: 0n },
  { radius: 4n, height: 10n, complexityBand: 0n },
  { radius: 5n, height: 12n, complexityBand: 0n },
  { radius: 6n, height: 14n, complexityBand: 1n },
  { radius: 7n, height: 16n, complexityBand: 1n },
  { radius: 8n, height: 18n, complexityBand: 1n },
] as const;

const CYLINDER_DIMENSION_RATIO_STATES = [
  { radiusPart: 1n, heightPart: 2n, scale: 3n, complexityBand: 0n },
  { radiusPart: 2n, heightPart: 3n, scale: 2n, complexityBand: 0n },
  { radiusPart: 3n, heightPart: 4n, scale: 2n, complexityBand: 0n },
  { radiusPart: 2n, heightPart: 5n, scale: 4n, complexityBand: 1n },
  { radiusPart: 3n, heightPart: 5n, scale: 3n, complexityBand: 1n },
  { radiusPart: 4n, heightPart: 7n, scale: 3n, complexityBand: 1n },
] as const;

const CYLINDER_COST_STATES = [
  { radius: 7n, height: 10n, rate: 3n, closed: 0n, complexityBand: 0n },
  { radius: 7n, height: 14n, rate: 4n, closed: 1n, complexityBand: 0n },
  { radius: 14n, height: 10n, rate: 5n, closed: 0n, complexityBand: 0n },
  { radius: 14n, height: 21n, rate: 6n, closed: 1n, complexityBand: 1n },
  { radius: 21n, height: 14n, rate: 7n, closed: 0n, complexityBand: 1n },
  { radius: 21n, height: 28n, rate: 8n, closed: 1n, complexityBand: 1n },
] as const;

const CONE_CHAIN_STATES = [
  { radius: 3n, height: 4n, slantHeight: 5n, complexityBand: 0n },
  { radius: 5n, height: 12n, slantHeight: 13n, complexityBand: 0n },
  { radius: 6n, height: 8n, slantHeight: 10n, complexityBand: 0n },
  { radius: 7n, height: 24n, slantHeight: 25n, complexityBand: 1n },
  { radius: 8n, height: 15n, slantHeight: 17n, complexityBand: 1n },
  { radius: 9n, height: 12n, slantHeight: 15n, complexityBand: 1n },
] as const;

const CONE_HEIGHT_RATIO_STATES = [
  { radiusNumerator: 1n, radiusDenominator: 2n, heightNumerator: 8n, heightDenominator: 3n, complexityBand: 0n },
  { radiusNumerator: 2n, radiusDenominator: 3n, heightNumerator: 9n, heightDenominator: 4n, complexityBand: 0n },
  { radiusNumerator: 3n, radiusDenominator: 2n, heightNumerator: 4n, heightDenominator: 9n, complexityBand: 0n },
  { radiusNumerator: 2n, radiusDenominator: 1n, heightNumerator: 3n, heightDenominator: 8n, complexityBand: 1n },
  { radiusNumerator: 4n, radiusDenominator: 3n, heightNumerator: 9n, heightDenominator: 8n, complexityBand: 1n },
  { radiusNumerator: 3n, radiusDenominator: 4n, heightNumerator: 16n, heightDenominator: 9n, complexityBand: 1n },
] as const;

const CONE_CSA_RATIO_STATES = [
  { radiusNumerator: 1n, radiusDenominator: 1n, slantNumerator: 5n, slantDenominator: 7n, complexityBand: 0n },
  { radiusNumerator: 2n, radiusDenominator: 3n, slantNumerator: 3n, slantDenominator: 4n, complexityBand: 0n },
  { radiusNumerator: 3n, radiusDenominator: 2n, slantNumerator: 4n, slantDenominator: 5n, complexityBand: 0n },
  { radiusNumerator: 4n, radiusDenominator: 3n, slantNumerator: 5n, slantDenominator: 2n, complexityBand: 1n },
  { radiusNumerator: 2n, radiusDenominator: 5n, slantNumerator: 7n, slantDenominator: 3n, complexityBand: 1n },
  { radiusNumerator: 5n, radiusDenominator: 4n, slantNumerator: 3n, slantDenominator: 2n, complexityBand: 1n },
] as const;

const EQUAL_BASE_HEIGHT_STATES = [
  { radius: 3n, height: 4n, slantHeight: 5n, complexityBand: 0n },
  { radius: 5n, height: 12n, slantHeight: 13n, complexityBand: 0n },
  { radius: 8n, height: 15n, slantHeight: 17n, complexityBand: 0n },
  { radius: 7n, height: 24n, slantHeight: 25n, complexityBand: 1n },
  { radius: 9n, height: 40n, slantHeight: 41n, complexityBand: 1n },
  { radius: 12n, height: 35n, slantHeight: 37n, complexityBand: 1n },
] as const;

const TENT_CLOTH_STATES = [
  { radius: 7n, height: 24n, slantHeight: 25n, width: 5n, complexityBand: 0n },
  { radius: 14n, height: 48n, slantHeight: 50n, width: 10n, complexityBand: 0n },
  { radius: 21n, height: 72n, slantHeight: 75n, width: 15n, complexityBand: 0n },
  { radius: 28n, height: 96n, slantHeight: 100n, width: 20n, complexityBand: 1n },
  { radius: 35n, height: 120n, slantHeight: 125n, width: 25n, complexityBand: 1n },
  { radius: 42n, height: 144n, slantHeight: 150n, width: 30n, complexityBand: 1n },
] as const;

const TENT_AIR_STATES = [
  { persons: 5n, floorPerPerson: 16n, airPerPerson: 100n, complexityBand: 0n },
  { persons: 4n, floorPerPerson: 18n, airPerPerson: 90n, complexityBand: 0n },
  { persons: 6n, floorPerPerson: 15n, airPerPerson: 100n, complexityBand: 0n },
  { persons: 8n, floorPerPerson: 12n, airPerPerson: 72n, complexityBand: 1n },
  { persons: 10n, floorPerPerson: 14n, airPerPerson: 98n, complexityBand: 1n },
  { persons: 7n, floorPerPerson: 20n, airPerPerson: 160n, complexityBand: 1n },
] as const;

function q(numerator: bigint | number, denominator: bigint | number = 1) {
  return rational(numerator, denominator);
}

function requireRational(value: ExactValue): ExactRational {
  if (value.kind !== "RATIONAL") throw new Error("Expected a rational exact value.");
  return value;
}

function ratioDisplay(value: ExactValue) {
  const ratio = requireRational(value);
  return `$${ratio.numerator}:${ratio.denominator}$`;
}

function ratioInline(value: ExactValue) {
  const ratio = requireRational(value);
  return `${ratio.numerator}:${ratio.denominator}`;
}

function cm(value: bigint) {
  return `$${value}\\text{ cm}$`;
}

function metre(value: bigint) {
  return `$${value}\\text{ m}$`;
}

function scaleExact(value: ExactValue, numerator: bigint, denominator: bigint = 1n): ExactValue {
  switch (value.kind) {
    case "RATIONAL":
      return q(value.numerator * numerator, value.denominator * denominator);
    case "SURD":
      return {
        ...value,
        coefficient: q(
          value.coefficient.numerator * numerator,
          value.coefficient.denominator * denominator,
        ),
      };
    case "PI":
      return pi(
        value.coefficient.numerator * numerator,
        value.coefficient.denominator * denominator,
      );
    case "PI_SURD":
      return {
        ...value,
        coefficient: q(
          value.coefficient.numerator * numerator,
          value.coefficient.denominator * denominator,
        ),
      };
  }
}

function collisionProofWrongAnswers(answer: ExactValue, context: string): WrongAnswer[] {
  return [
    {
      value: scaleExact(answer, 2n),
      misconceptionId: "DOUBLED_RESULT",
      explanation: `counting the ${context} twice`,
    },
    {
      value: scaleExact(answer, 3n, 2n),
      misconceptionId: "ADDED_HALF_RESULT",
      explanation: `adding an extra half of the ${context}`,
    },
    {
      value: scaleExact(answer, 1n, 2n),
      misconceptionId: "HALVED_RESULT",
      explanation: `taking only half of the ${context}`,
    },
  ];
}

function makeState(
  prototypeId: MenCp008Wave03PrototypeId,
  seed: string,
  dimensions: Record<string, bigint>,
  derived: Record<string, ExactValue>,
  unit: Men002Unit,
  piPolicy: MenCp008Wave03State["piPolicy"] = "EXACT_PI",
  displayMode: MenCp008Wave03State["displayMode"] = "UNIT",
): MenCp008Wave03State {
  const definition = getMenCp008Wave03Definition(prototypeId);
  const state: MenCp008Wave03State = {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-008",
    permanentQlId: null,
    waveId: "MEN-CP-008-SOURCE-GAP-WAVE-03",
    prototypeId,
    solveMode: definition.solveMode,
    target: definition.target,
    shape: definition.shape,
    seed,
    difficulty: "Medium",
    piPolicy,
    dimensions,
    derived,
    unit,
    displayMode,
  };
  state.difficulty = classifyMenCp008Wave03Difficulty(state);
  return state;
}

function stemVariant(rng: SeededRandom, variants: readonly string[]) {
  return rng.pick(variants);
}

function cylinderAreaRatioDraft(
  prototypeId: MenCp008Wave03PrototypeId,
  seed: string,
  rng: SeededRandom,
): Draft {
  const { radius, height, complexityBand } = rng.pick(CYLINDER_AREA_RATIO_STATES);
  const volumeCoefficient = radius ** 2n * height;
  const csaCoefficient = 2n * radius * height;
  const ratio = q(volumeCoefficient, csaCoefficient);
  const answer = q(radius);
  return {
    state: makeState(
      prototypeId,
      seed,
      { radius, height, complexityBand, volumeCoefficient, csaCoefficient },
      { ratio, answer },
      "cm",
    ),
    stem: stemVariant(rng, [
      `For a right circular cylinder, the numerical ratio of volume to curved surface area is ${ratioDisplay(ratio)}. Find its radius.`,
      `The volume and curved surface area of a cylinder are numerically in the ratio ${ratioDisplay(ratio)}. What is the radius?`,
      `A cylinder has $V:CSA=${ratioInline(ratio)}$. Determine the radius of its circular base.`,
      `Find the radius of a cylinder when its numerical volume-to-curved-area ratio is ${ratioDisplay(ratio)}.`,
    ]),
    answer,
    keyRule: "For a cylinder, $V=\\pi r^2h$ and $CSA=2\\pi rh$, so $V/CSA=r/2$. The height and $\\pi$ cancel.",
    steps: [
      {
        title: "Write the two cylinder formulas",
        body: "Use volume and curved surface area for the same radius and height.",
        equation: "$$V=\\pi r^2h,\\qquad CSA=2\\pi rh$$",
      },
      {
        title: "Cancel the common factors",
        body: "Divide the formulas and cancel $\\pi rh$.",
        equation: "$$\\frac{V}{CSA}=\\frac{\\pi r^2h}{2\\pi rh}=\\frac{r}{2}$$",
      },
      {
        title: "Use the given numerical ratio",
        body: "Multiply the stated ratio by two to obtain the radius.",
        equation: `$$r=2\\times\\frac{${ratio.numerator}}{${ratio.denominator}}=${formatExactMath(answer)}\\text{ cm}$$`,
      },
    ],
    shortcut: "The direct exam rule is $r=2(V/CSA)$; neither $\\pi$ nor height is needed.",
  };
}

function cylinderDimensionRatioDraft(
  prototypeId: MenCp008Wave03PrototypeId,
  seed: string,
  rng: SeededRandom,
): Draft {
  const { radiusPart, heightPart, scale, complexityBand } = rng.pick(CYLINDER_DIMENSION_RATIO_STATES);
  const radius = radiusPart * scale;
  const height = heightPart * scale;
  const volumeCoefficient = radius ** 2n * height;
  const answer = q(radius);
  return {
    state: makeState(
      prototypeId,
      seed,
      { radiusPart, heightPart, scale, radius, height, volumeCoefficient, complexityBand },
      { answer },
      "cm",
    ),
    stem: stemVariant(rng, [
      `The radius and height of a cylinder are in the ratio ${radiusPart}:${heightPart}, and its volume is $${volumeCoefficient}\\pi\\text{ cm}^{3}$. Find the radius.`,
      `A cylinder has $r:h=${radiusPart}:${heightPart}$ and volume $${volumeCoefficient}\\pi\\text{ cm}^{3}$. What is its radius?`,
      `The volume of a right circular cylinder is $${volumeCoefficient}\\pi\\text{ cm}^{3}$. If radius : height is ${radiusPart}:${heightPart}, determine the radius.`,
      `Find the radius of a cylinder whose volume is $${volumeCoefficient}\\pi\\text{ cm}^{3}$ and whose radius-to-height ratio is ${radiusPart}:${heightPart}.`,
    ]),
    answer,
    keyRule: "Put $r=ax$ and $h=bx$ from the stated ratio. Then $V=\\pi a^2bx^3$, so the common scale is recovered by a cube root.",
    steps: [
      {
        title: "Represent both dimensions with one scale",
        body: "Use the two ratio parts as multipliers of the same positive value.",
        equation: `$$r=${radiusPart}x,\\qquad h=${heightPart}x$$`,
      },
      {
        title: "Substitute into the cylinder volume",
        body: "Cancel $\\pi$ and isolate the cube of the common scale.",
        equation: `$$${volumeCoefficient}=${radiusPart}^2\\times${heightPart}\\times x^3\\Rightarrow x^3=${scale ** 3n}$$`,
      },
      {
        title: "Recover the required radius",
        body: "Take the exact cube root and multiply by the radius part.",
        equation: `$$x=${scale},\\qquad r=${radiusPart}\\times${scale}=${formatExactMath(answer)}\\text{ cm}$$`,
      },
    ],
    shortcut: "Divide the volume coefficient by $a^2b$, take the cube root, then multiply by $a$.",
  };
}

function cylinderSurfaceCostDraft(
  prototypeId: MenCp008Wave03PrototypeId,
  seed: string,
  rng: SeededRandom,
): Draft {
  const { radius, height, rate, closed, complexityBand } = rng.pick(CYLINDER_COST_STATES);
  const area = closed === 1n
    ? q(44n * radius * (radius + height), 7n)
    : q(44n * radius * height, 7n);
  const answer = q(area.numerator * rate, area.denominator);
  const surfaceName = closed === 1n ? "the complete closed surface" : "the curved surface";
  return {
    state: makeState(
      prototypeId,
      seed,
      { radius, height, rate, closed, complexityBand },
      { area, answer },
      "₹",
      "PI_22_OVER_7",
    ),
    stem: stemVariant(rng, [
      `A cylinder has radius ${cm(radius)} and height ${cm(height)}. Find the cost of covering ${surfaceName} at $\\text{₹}${rate}$ per $\\text{cm}^{2}$. Use $\\pi=22/7$.`,
      `Using $\\pi=22/7$, calculate the cost of coating ${surfaceName} of a cylinder of radius ${cm(radius)} and height ${cm(height)} at $\\text{₹}${rate}$ per $\\text{cm}^{2}$.`,
      `The material rate is $\\text{₹}${rate}$ per $\\text{cm}^{2}$. What will ${surfaceName} of a cylinder of radius ${cm(radius)} and height ${cm(height)} cost? Take $\\pi=22/7$.`,
      `Find the material cost for ${surfaceName} of a cylinder with radius ${cm(radius)} and height ${cm(height)} when the rate is $\\text{₹}${rate}$ per $\\text{cm}^{2}$ and $\\pi=22/7$.`,
    ]),
    answer,
    keyRule: closed === 1n
      ? "A closed cylinder uses $TSA=2\\pi r(r+h)$. Multiply the complete area by the rate per square centimetre."
      : "The curved part of a cylinder uses $CSA=2\\pi rh$. Multiply that area by the rate per square centimetre.",
    steps: [
      {
        title: "Choose the required surface formula",
        body: closed === 1n
          ? "Both circular ends and the curved surface are included."
          : "Only the side wrapping is included.",
        equation: closed === 1n ? "$$TSA=2\\pi r(r+h)$$" : "$$CSA=2\\pi rh$$",
      },
      {
        title: "Calculate the required area",
        body: "Insert the stated dimensions and use $\\pi=22/7$.",
        equation: closed === 1n
          ? `$$Area=2\\times\\frac{22}{7}\\times${radius}\\times(${radius}+${height})=${formatExactMath(area)}\\text{ cm}^{2}$$`
          : `$$Area=2\\times\\frac{22}{7}\\times${radius}\\times${height}=${formatExactMath(area)}\\text{ cm}^{2}$$`,
      },
      {
        title: "Apply the material rate",
        body: "Multiply the area by the charge for one square centimetre.",
        equation: `$$Cost=${formatExactMath(area)}\\times${rate}=\\text{₹}${formatExactMath(answer)}$$`,
      },
    ],
    shortcut: "Cancel the factor of $7$ before multiplying, and apply the rate only after selecting the correct surface.",
  };
}

function coneChainDraft(
  prototypeId: MenCp008Wave03PrototypeId,
  seed: string,
  rng: SeededRandom,
  target: "area" | "slant",
): Draft {
  const { radius, height, slantHeight, complexityBand } = rng.pick(CONE_CHAIN_STATES);
  const volumeCoefficient = radius ** 2n * height / 3n;
  const radiusSquared = 3n * volumeCoefficient / height;
  const answer = target === "area" ? pi(radius * slantHeight) : q(slantHeight);
  const unit: Men002Unit = target === "area" ? "cm²" : "cm";
  const requested = target === "area" ? "curved surface area" : "slant height";
  return {
    state: makeState(
      prototypeId,
      seed,
      { radius, height, slantHeight, volumeCoefficient, radiusSquared, complexityBand },
      { answer },
      unit,
    ),
    stem: stemVariant(rng, [
      `A right circular cone has volume $${volumeCoefficient}\\pi\\text{ cm}^{3}$ and height ${cm(height)}. Find its ${requested}.`,
      `The volume of a cone is $${volumeCoefficient}\\pi\\text{ cm}^{3}$ and its vertical height is ${cm(height)}. Determine the ${requested}.`,
      `Find the ${requested} of a cone whose height is ${cm(height)} and volume is $${volumeCoefficient}\\pi\\text{ cm}^{3}$.`,
      `A cone is ${cm(height)} high and has volume $${volumeCoefficient}\\pi\\text{ cm}^{3}$. What is its ${requested}?`,
    ]),
    answer,
    keyRule: target === "area"
      ? "Use the volume to recover $r^2$, then find $l=\\sqrt{r^2+h^2}$ and finish with $CSA=\\pi rl$."
      : "Use $V=(1/3)\\pi r^2h$ to recover the radius, then apply $l=\\sqrt{r^2+h^2}$.",
    steps: [
      {
        title: "Recover the radius from the volume",
        body: "Cancel $\\pi$ and rearrange the cone-volume formula.",
        equation: `$$r^2=\\frac{3V}{\\pi h}=\\frac{3\\times${volumeCoefficient}}{${height}}=${radiusSquared}\\Rightarrow r=${radius}\\text{ cm}$$`,
      },
      {
        title: "Find the slant height",
        body: "The radius, vertical height and slant height form a right triangle.",
        equation: `$$l=\\sqrt{${radius}^2+${height}^2}=\\sqrt{${radius ** 2n + height ** 2n}}=${slantHeight}\\text{ cm}$$`,
      },
      target === "area"
        ? {
            title: "Calculate the curved surface area",
            body: "Multiply $\\pi$, the recovered radius and the slant height.",
            equation: `$$CSA=\\pi\\times${radius}\\times${slantHeight}=${formatExactMath(answer)}\\text{ cm}^{2}$$`,
          }
        : {
            title: "State the required length",
            body: "The Pythagorean result is the generator length of the cone.",
            equation: `$$l=${formatExactMath(answer)}\\text{ cm}$$`,
          },
    ],
    shortcut: target === "area"
      ? "For $V=K\\pi$, calculate $r^2=3K/h$, spot the Pythagorean triple, then use $CSA=\\pi rl$."
      : "For $V=K\\pi$, calculate $r^2=3K/h$ first and finish with one Pythagorean step.",
  };
}

function coneHeightRatioDraft(
  prototypeId: MenCp008Wave03PrototypeId,
  seed: string,
  rng: SeededRandom,
): Draft {
  const {
    radiusNumerator,
    radiusDenominator,
    heightNumerator,
    heightDenominator,
    complexityBand,
  } = rng.pick(CONE_HEIGHT_RATIO_STATES);
  const volumeRatio = q(
    radiusNumerator ** 2n * heightNumerator,
    radiusDenominator ** 2n * heightDenominator,
  );
  const answer = q(heightNumerator, heightDenominator);
  return {
    state: makeState(
      prototypeId,
      seed,
      {
        radiusNumerator,
        radiusDenominator,
        heightNumerator,
        heightDenominator,
        complexityBand,
      },
      { volumeRatio, answer },
      "times",
      "EXACT_PI",
      "RATIO",
    ),
    stem: stemVariant(rng, [
      `The volumes of two right circular cones are in the ratio ${ratioDisplay(volumeRatio)}, and their radii are in the ratio ${radiusNumerator}:${radiusDenominator}. Find the ratio of their heights.`,
      `For two cones, $V_1:V_2=${ratioInline(volumeRatio)}$ and $r_1:r_2=${radiusNumerator}:${radiusDenominator}$. Determine $h_1:h_2$.`,
      `Two cones have volume ratio ${ratioDisplay(volumeRatio)} and radius ratio ${radiusNumerator}:${radiusDenominator}. What is their height ratio?`,
      `Find the height ratio of two cones whose volumes are in the ratio ${ratioDisplay(volumeRatio)} and base radii are in the ratio ${radiusNumerator}:${radiusDenominator}.`,
    ]),
    answer,
    keyRule: "For two cones, volume is proportional to $r^2h$. The height ratio therefore equals the volume ratio divided by the square of the radius ratio.",
    steps: [
      {
        title: "Write the cone volume-ratio law",
        body: "The common factor $\\pi/3$ cancels between the two cones.",
        equation: "$$\\frac{V_1}{V_2}=\\frac{r_1^2h_1}{r_2^2h_2}$$",
      },
      {
        title: "Move the radius ratio to the other side",
        body: "Square the radius ratio because radius appears as $r^2$ in volume.",
        equation: `$$\\frac{h_1}{h_2}=\\frac{${volumeRatio.numerator}}{${volumeRatio.denominator}}\\times\\frac{${radiusDenominator}^2}{${radiusNumerator}^2}$$`,
      },
      {
        title: "Simplify the height ratio",
        body: "Cancel common factors while preserving the order of the two cones.",
        equation: `$$h_1:h_2=${answer.numerator}:${answer.denominator}$$`,
      },
    ],
    shortcut: "Use height ratio = volume ratio divided by radius-ratio squared.",
  };
}

function coneCsaRatioDraft(
  prototypeId: MenCp008Wave03PrototypeId,
  seed: string,
  rng: SeededRandom,
): Draft {
  const {
    radiusNumerator,
    radiusDenominator,
    slantNumerator,
    slantDenominator,
    complexityBand,
  } = rng.pick(CONE_CSA_RATIO_STATES);
  const answer = q(
    radiusNumerator * slantNumerator,
    radiusDenominator * slantDenominator,
  );
  return {
    state: makeState(
      prototypeId,
      seed,
      {
        radiusNumerator,
        radiusDenominator,
        slantNumerator,
        slantDenominator,
        complexityBand,
      },
      { answer },
      "times",
      "EXACT_PI",
      "RATIO",
    ),
    stem: stemVariant(rng, [
      `The radii of two cones are in the ratio ${radiusNumerator}:${radiusDenominator}, and their slant heights are in the ratio ${slantNumerator}:${slantDenominator}. Find the ratio of their curved surface areas.`,
      `For two right circular cones, $r_1:r_2=${radiusNumerator}:${radiusDenominator}$ and $l_1:l_2=${slantNumerator}:${slantDenominator}$. Determine $CSA_1:CSA_2$.`,
      `Two cones have radius ratio ${radiusNumerator}:${radiusDenominator} and slant-height ratio ${slantNumerator}:${slantDenominator}. What is their curved-area ratio?`,
      `Find the curved-surface-area ratio when the cone radii are ${radiusNumerator}:${radiusDenominator} and their slant heights are ${slantNumerator}:${slantDenominator}.`,
    ]),
    answer,
    keyRule: "Cone curved surface area is $CSA=\\pi rl$. In a ratio, $\\pi$ cancels, so multiply the radius ratio by the slant-height ratio.",
    steps: [
      {
        title: "Write the curved-area formula",
        body: "Use the same formula for both cones.",
        equation: "$$CSA=\\pi rl$$",
      },
      {
        title: "Form the ratio and cancel pi",
        body: "Only radius and slant-height factors remain.",
        equation: `$$CSA_1:CSA_2=(${radiusNumerator}\\times${slantNumerator}):(${radiusDenominator}\\times${slantDenominator})$$`,
      },
      {
        title: "Reduce the ratio",
        body: "Divide both terms by their common factor.",
        equation: `$$CSA_1:CSA_2=${answer.numerator}:${answer.denominator}$$`,
      },
    ],
    shortcut: "Multiply corresponding ratio terms: radius ratio times slant-height ratio.",
  };
}

function equalBaseHeightTsaRatioDraft(
  prototypeId: MenCp008Wave03PrototypeId,
  seed: string,
  rng: SeededRandom,
): Draft {
  const { radius, height, slantHeight, complexityBand } = rng.pick(EQUAL_BASE_HEIGHT_STATES);
  const answer = q(2n * (radius + height), radius + slantHeight);
  return {
    state: makeState(
      prototypeId,
      seed,
      { radius, height, slantHeight, complexityBand },
      { answer },
      "times",
      "EXACT_PI",
      "RATIO",
    ),
    stem: stemVariant(rng, [
      `A right circular cylinder and a right circular cone have the same base radius ${cm(radius)} and the same height ${cm(height)}. Find the ratio of their total surface areas.`,
      `A cylinder and a cone stand on equal circular bases and both are ${cm(height)} high. Their common radius is ${cm(radius)}. Determine $TSA_{cylinder}:TSA_{cone}$.`,
      `The base radius and height of both a cylinder and a cone are ${cm(radius)} and ${cm(height)} respectively. What is the ratio of their total surface areas?`,
      `Find the cylinder-to-cone total-surface-area ratio when both solids have radius ${cm(radius)} and height ${cm(height)}.`,
    ]),
    answer,
    keyRule: "Use $TSA_{cylinder}=2\\pi r(r+h)$ and $TSA_{cone}=\\pi r(r+l)$. Find the cone slant height first, then cancel the common factor $\\pi r$.",
    steps: [
      {
        title: "Find the cone slant height",
        body: "Use the common radius and height as perpendicular sides.",
        equation: `$$l=\\sqrt{${radius}^2+${height}^2}=${slantHeight}\\text{ cm}$$`,
      },
      {
        title: "Write the two total surface areas",
        body: "Keep the common factors visible so they can be cancelled.",
        equation: "$$TSA_{cyl}=2\\pi r(r+h),\\qquad TSA_{cone}=\\pi r(r+l)$$",
      },
      {
        title: "Cancel and simplify the ratio",
        body: "Cancel $\\pi r$ and substitute the three lengths.",
        equation: `$$2(${radius}+${height}):(${radius}+${slantHeight})=${answer.numerator}:${answer.denominator}$$`,
      },
    ],
    shortcut: "After finding $l$, compare only $2(r+h)$ with $(r+l)$ because $\\pi r$ cancels.",
  };
}

function tentClothDraft(
  prototypeId: MenCp008Wave03PrototypeId,
  seed: string,
  rng: SeededRandom,
): Draft {
  const { radius, height, slantHeight, width, complexityBand } = rng.pick(TENT_CLOTH_STATES);
  const canvasArea = q(22n * radius * slantHeight, 7n);
  const answer = q(canvasArea.numerator, canvasArea.denominator * width);
  return {
    state: makeState(
      prototypeId,
      seed,
      { radius, height, slantHeight, width, complexityBand },
      { canvasArea, answer },
      "m",
      "PI_22_OVER_7",
    ),
    stem: stemVariant(rng, [
      `A conical tent has radius ${metre(radius)} and vertical height ${metre(height)}. How many metres of cloth ${metre(width)} wide are needed for its curved surface? Use $\\pi=22/7$.`,
      `Find the required length of ${metre(width)} wide canvas for a conical tent of radius ${metre(radius)} and height ${metre(height)}. Take $\\pi=22/7$.`,
      `Canvas is supplied in a roll ${metre(width)} wide. What length is needed for a conical tent with base radius ${metre(radius)} and height ${metre(height)}? Use $\\pi=22/7$.`,
      `Using $\\pi=22/7$, calculate the length of cloth of width ${metre(width)} required to cover the curved part of a cone of radius ${metre(radius)} and height ${metre(height)}.`,
    ]),
    answer,
    keyRule: "Find the cone slant height, calculate curved area $\\pi rl$, then divide that area by the fixed width of the cloth roll.",
    steps: [
      {
        title: "Find the slant height",
        body: "Radius and vertical height form a right triangle inside the cone.",
        equation: `$$l=\\sqrt{${radius}^2+${height}^2}=${slantHeight}\\text{ m}$$`,
      },
      {
        title: "Calculate the canvas area",
        body: "The question covers only the curved part, so the circular base is excluded.",
        equation: `$$Area=\\frac{22}{7}\\times${radius}\\times${slantHeight}=${formatExactMath(canvasArea)}\\text{ m}^{2}$$`,
      },
      {
        title: "Convert area into roll length",
        body: "For a roll of fixed width, length equals area divided by width.",
        equation: `$$Length=\\frac{${formatExactMath(canvasArea)}}{${width}}=${formatExactMath(answer)}\\text{ m}$$`,
      },
    ],
    shortcut: "Use $Length=\\pi rl/w$ and cancel the roll width before multiplying large values.",
  };
}

function tentAirDraft(
  prototypeId: MenCp008Wave03PrototypeId,
  seed: string,
  rng: SeededRandom,
): Draft {
  const { persons, floorPerPerson, airPerPerson, complexityBand } = rng.pick(TENT_AIR_STATES);
  const floorArea = persons * floorPerPerson;
  const airVolume = persons * airPerPerson;
  const answer = q(3n * airVolume, floorArea);
  return {
    state: makeState(
      prototypeId,
      seed,
      { persons, floorPerPerson, airPerPerson, floorArea, airVolume, complexityBand },
      { answer },
      "m",
    ),
    stem: stemVariant(rng, [
      `A conical tent must accommodate ${persons} people. Each person needs $${floorPerPerson}\\text{ m}^{2}$ of floor space and $${airPerPerson}\\text{ m}^{3}$ of air. Find the vertical height of the tent.`,
      `For a conical tent, ${persons} occupants require $${floorPerPerson}\\text{ m}^{2}$ of ground area and $${airPerPerson}\\text{ m}^{3}$ of air each. What height is required?`,
      `A cone-shaped tent is planned for ${persons} people. If each needs $${floorPerPerson}\\text{ m}^{2}$ on the ground and $${airPerPerson}\\text{ m}^{3}$ of air, determine the tent height.`,
      `Find the height of a conical tent for ${persons} persons when the floor allowance is $${floorPerPerson}\\text{ m}^{2}$ per person and the air allowance is $${airPerPerson}\\text{ m}^{3}$ per person.`,
    ]),
    answer,
    keyRule: "The circular base area is the total floor allowance. Since cone volume is one third of base area times height, $h=3V/A$.",
    steps: [
      {
        title: "Find the total floor area",
        body: "Multiply the number of people by the floor allowance for one person.",
        equation: `$$A=${persons}\\times${floorPerPerson}=${floorArea}\\text{ m}^{2}$$`,
      },
      {
        title: "Find the total air volume",
        body: "Multiply the number of people by the air allowance for one person.",
        equation: `$$V=${persons}\\times${airPerPerson}=${airVolume}\\text{ m}^{3}$$`,
      },
      {
        title: "Use the cone-volume relation",
        body: "Substitute the base area in $V=Ah/3$ and solve for height.",
        equation: `$$h=\\frac{3V}{A}=\\frac{3\\times${airVolume}}{${floorArea}}=${formatExactMath(answer)}\\text{ m}$$`,
      },
    ],
    shortcut: "Cancel the common number of people first: $h=3(air per person)/(floor per person)$.",
  };
}

function buildDraft(
  prototypeId: MenCp008Wave03PrototypeId,
  seed: string,
  rng: SeededRandom,
): Draft {
  switch (prototypeId) {
    case "MEN-CP008-W3-PROT-CYLINDER-RADIUS-FROM-VOLUME-CSA-RATIO":
      return cylinderAreaRatioDraft(prototypeId, seed, rng);
    case "MEN-CP008-W3-PROT-CYLINDER-RADIUS-FROM-DIMENSION-RATIO-VOLUME":
      return cylinderDimensionRatioDraft(prototypeId, seed, rng);
    case "MEN-CP008-W3-PROT-CYLINDER-SURFACE-COST":
      return cylinderSurfaceCostDraft(prototypeId, seed, rng);
    case "MEN-CP008-W3-PROT-CONE-CSA-FROM-VOLUME-HEIGHT":
      return coneChainDraft(prototypeId, seed, rng, "area");
    case "MEN-CP008-W3-PROT-CONE-SLANT-FROM-VOLUME-HEIGHT":
      return coneChainDraft(prototypeId, seed, rng, "slant");
    case "MEN-CP008-W3-PROT-CONE-HEIGHT-RATIO-FROM-VOLUME-RADIUS-RATIOS":
      return coneHeightRatioDraft(prototypeId, seed, rng);
    case "MEN-CP008-W3-PROT-CONE-CSA-RATIO-FROM-RADIUS-SLANT-RATIOS":
      return coneCsaRatioDraft(prototypeId, seed, rng);
    case "MEN-CP008-W3-PROT-CYLINDER-CONE-TSA-RATIO-EQUAL-BASE-HEIGHT":
      return equalBaseHeightTsaRatioDraft(prototypeId, seed, rng);
    case "MEN-CP008-W3-PROT-CONE-TENT-CLOTH-LENGTH":
      return tentClothDraft(prototypeId, seed, rng);
    case "MEN-CP008-W3-PROT-CONE-TENT-HEIGHT-FROM-FLOOR-AIR":
      return tentAirDraft(prototypeId, seed, rng);
  }
}

function expectedAnswer(state: MenCp008Wave03State): ExactValue {
  const d = state.dimensions;
  switch (state.prototypeId) {
    case "MEN-CP008-W3-PROT-CYLINDER-RADIUS-FROM-VOLUME-CSA-RATIO":
      return q(2n * d.volumeCoefficient, d.csaCoefficient);
    case "MEN-CP008-W3-PROT-CYLINDER-RADIUS-FROM-DIMENSION-RATIO-VOLUME": {
      const scaleCube = d.volumeCoefficient / (d.radiusPart ** 2n * d.heightPart);
      return q(d.radiusPart * integerCubeRoot(scaleCube));
    }
    case "MEN-CP008-W3-PROT-CYLINDER-SURFACE-COST": {
      const area = d.closed === 1n
        ? q(44n * d.radius * (d.radius + d.height), 7n)
        : q(44n * d.radius * d.height, 7n);
      return q(area.numerator * d.rate, area.denominator);
    }
    case "MEN-CP008-W3-PROT-CONE-CSA-FROM-VOLUME-HEIGHT":
      return pi(d.radius * d.slantHeight);
    case "MEN-CP008-W3-PROT-CONE-SLANT-FROM-VOLUME-HEIGHT":
      return q(d.slantHeight);
    case "MEN-CP008-W3-PROT-CONE-HEIGHT-RATIO-FROM-VOLUME-RADIUS-RATIOS": {
      const volumeRatio = q(
        d.radiusNumerator ** 2n * d.heightNumerator,
        d.radiusDenominator ** 2n * d.heightDenominator,
      );
      return q(
        volumeRatio.numerator * d.radiusDenominator ** 2n,
        volumeRatio.denominator * d.radiusNumerator ** 2n,
      );
    }
    case "MEN-CP008-W3-PROT-CONE-CSA-RATIO-FROM-RADIUS-SLANT-RATIOS":
      return q(
        d.radiusNumerator * d.slantNumerator,
        d.radiusDenominator * d.slantDenominator,
      );
    case "MEN-CP008-W3-PROT-CYLINDER-CONE-TSA-RATIO-EQUAL-BASE-HEIGHT":
      return q(2n * (d.radius + d.height), d.radius + d.slantHeight);
    case "MEN-CP008-W3-PROT-CONE-TENT-CLOTH-LENGTH":
      return q(22n * d.radius * d.slantHeight, 7n * d.width);
    case "MEN-CP008-W3-PROT-CONE-TENT-HEIGHT-FROM-FLOOR-AIR":
      return q(3n * d.airPerPerson, d.floorPerPerson);
  }
}

function formatAnswer(value: ExactValue, state: MenCp008Wave03State) {
  return state.displayMode === "RATIO"
    ? ratioDisplay(value)
    : formatWithUnit(value, state.unit);
}

function makeOptions(draft: Draft, rng: SeededRandom) {
  const wrongAnswers = collisionProofWrongAnswers(draft.answer, targetDescription(draft.state));
  const candidates = [
    { value: draft.answer, misconceptionId: null, explanation: "" },
    ...wrongAnswers,
  ];
  const unique = new Map<string, (typeof candidates)[number]>();
  for (const candidate of candidates) unique.set(exactKey(candidate.value), candidate);
  if (unique.size !== 4) {
    throw new Error(`${draft.state.prototypeId} did not produce four distinct exact options.`);
  }
  const shuffled = rng.shuffle([...unique.values()]);
  const labels = ["A", "B", "C", "D"] as const;
  const options: MenCp008Wave03Option[] = shuffled.map((candidate, index) => ({
    label: labels[index]!,
    value: candidate.value,
    display: formatAnswer(candidate.value, draft.state),
    isCorrect: candidate.misconceptionId === null,
    misconceptionId: candidate.misconceptionId,
  }));
  return { options, shuffled };
}

function targetDescription(state: MenCp008Wave03State) {
  switch (state.target) {
    case "COST": return "material cost";
    case "LATERAL_SURFACE_AREA": return "curved surface area";
    case "RATIO": return "required ratio";
    case "LENGTH": return state.prototypeId.includes("TENT") ? "required tent length" : "required length";
    default: return "required result";
  }
}

function validatePackage(pkg: MenCp008Wave03Package) {
  const expected = expectedAnswer(pkg.state);
  const checks = [
    {
      name: "canonical-answer",
      passed: exactEquals(expected, pkg.exactAnswer),
      message: "Answer must match an independent formula reconstruction.",
    },
    {
      name: "four-options",
      passed: pkg.options.length === 4,
      message: "Exactly four options are required.",
    },
    {
      name: "unique-values",
      passed: new Set(pkg.options.map((option) => exactKey(option.value))).size === 4,
      message: "Option values must be exact and unique.",
    },
    {
      name: "unique-display",
      passed: new Set(pkg.options.map((option) => option.display)).size === 4,
      message: "Displayed options must be unique.",
    },
    {
      name: "positive-options",
      passed: pkg.options.every((option) => isPositive(option.value)),
      message: "All generated options must be positive.",
    },
    {
      name: "one-correct",
      passed: pkg.options.filter((option) => option.isCorrect).length === 1,
      message: "Exactly one option must be correct.",
    },
    {
      name: "correct-index",
      passed: pkg.options[pkg.correctIndex]?.isCorrect === true,
      message: "Correct index must point to the correct option.",
    },
    {
      name: "three-steps",
      passed: pkg.explanation.steps.length === 3,
      message: "The approved learner surface requires exactly three demonstrated steps.",
    },
    {
      name: "three-traps",
      passed: pkg.explanation.traps.length === 3,
      message: "Every wrong option needs a natural diagnostic.",
    },
    {
      name: "lifecycle",
      passed: pkg.permanentQlId === null && !pkg.publiclyPublishable && !pkg.questionStudioDiscoverable,
      message: "Source discovery must remain outside product delivery.",
    },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function classifyMenCp008Wave03Difficulty(
  state: MenCp008Wave03State,
): Men002Difficulty {
  return state.dimensions.complexityBand === 1n ? "Hard" : "Medium";
}

export function generateMenCp008Wave03Prototype(
  prototypeId: MenCp008Wave03PrototypeId,
  seed: string,
): MenCp008Wave03Package {
  const rng = createSeededRandom(`${prototypeId}:${seed}`);
  const draft = buildDraft(prototypeId, seed, rng);
  const { options, shuffled } = makeOptions(draft, rng);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const traps = options
    .map((option, index) => ({ option, source: shuffled[index]! }))
    .filter(({ option }) => !option.isCorrect)
    .map(
      ({ option, source }) =>
        `Option ${option.label} (${option.display}): This result comes from ${source.explanation}.`,
    );

  const expected = expectedAnswer(draft.state);
  const pkg: MenCp008Wave03Package = {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-008",
    permanentQlId: null,
    waveId: "MEN-CP-008-SOURCE-GAP-WAVE-03",
    prototypeId,
    solveMode: draft.state.solveMode,
    language: "en",
    seed,
    difficulty: draft.state.difficulty,
    target: draft.state.target,
    piPolicy: draft.state.piPolicy,
    stem: draft.stem,
    options,
    correctIndex,
    answer: options[correctIndex]!.display,
    exactAnswer: draft.answer,
    unit: draft.state.unit,
    explanation: {
      keyRule: draft.keyRule,
      steps: draft.steps,
      shortcut: draft.shortcut,
      traps,
    },
    state: draft.state,
    verification: {
      valid: exactEquals(expected, draft.answer),
      method: "independent source-contract reconstruction",
      reconstructed: exactKey(expected),
    },
    validation: { valid: false, checks: [] },
    reviewStatus: "UNREVIEWED",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
  pkg.validation = validatePackage(pkg);
  return pkg;
}
