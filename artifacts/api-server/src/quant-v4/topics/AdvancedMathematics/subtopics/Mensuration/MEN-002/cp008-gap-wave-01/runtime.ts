import {
  exactEquals,
  exactKey,
  formatWithUnit,
  integerSquareRoot,
  isPositive,
  pi,
  rational,
} from "../foundation/exact";
import { createSeededRandom, type SeededRandom } from "../foundation/seed";
import type { ExactRational, ExactValue, Men002Difficulty, Men002Unit } from "../foundation/types";
import { getMenCp008Wave01Definition } from "./registry";
import type {
  MenCp008Wave01Option,
  MenCp008Wave01Package,
  MenCp008Wave01PrototypeId,
  MenCp008Wave01State,
} from "./types";

interface WrongAnswer {
  value: ExactValue;
  misconceptionId: string;
  explanation: string;
}

interface Draft {
  state: MenCp008Wave01State;
  stem: string;
  answer: ExactValue;
  wrongAnswers: WrongAnswer[];
  keyRule: string;
  steps: MenCp008Wave01Package["explanation"]["steps"];
  shortcut: string;
}

const CYLINDER_STATES = [
  { radius: 3n, height: 8n },
  { radius: 4n, height: 10n },
  { radius: 5n, height: 12n },
  { radius: 6n, height: 14n },
  { radius: 7n, height: 16n },
  { radius: 8n, height: 18n },
] as const;

const CONE_STATES = [
  { radius: 3n, height: 4n, slantHeight: 5n },
  { radius: 5n, height: 12n, slantHeight: 13n },
  { radius: 7n, height: 24n, slantHeight: 25n },
  { radius: 8n, height: 15n, slantHeight: 17n },
  { radius: 9n, height: 40n, slantHeight: 41n },
  { radius: 12n, height: 35n, slantHeight: 37n },
] as const;

const ROLLER_STATES = [
  { radius: 7n, length: 5n, revolutions: 4n },
  { radius: 14n, length: 6n, revolutions: 3n },
  { radius: 21n, length: 8n, revolutions: 5n },
  { radius: 28n, length: 9n, revolutions: 2n },
  { radius: 35n, length: 10n, revolutions: 4n },
  { radius: 42n, length: 12n, revolutions: 3n },
] as const;

const EQUAL_VOLUME_STATES = [
  { cylinderRadius: 3n, cylinderHeight: 4n, coneRadius: 6n, coneHeight: 3n },
  { cylinderRadius: 4n, cylinderHeight: 8n, coneRadius: 8n, coneHeight: 6n },
  { cylinderRadius: 5n, cylinderHeight: 12n, coneRadius: 10n, coneHeight: 9n },
  { cylinderRadius: 6n, cylinderHeight: 16n, coneRadius: 12n, coneHeight: 12n },
  { cylinderRadius: 7n, cylinderHeight: 20n, coneRadius: 14n, coneHeight: 15n },
  { cylinderRadius: 8n, cylinderHeight: 24n, coneRadius: 16n, coneHeight: 18n },
] as const;

const SCALE_STATES = [
  { radiusNumerator: 2n, radiusDenominator: 1n, heightNumerator: 1n, heightDenominator: 2n, percent: 100n, direction: 1n },
  { radiusNumerator: 3n, radiusDenominator: 2n, heightNumerator: 4n, heightDenominator: 3n, percent: 200n, direction: 1n },
  { radiusNumerator: 2n, radiusDenominator: 1n, heightNumerator: 1n, heightDenominator: 1n, percent: 300n, direction: 1n },
  { radiusNumerator: 1n, radiusDenominator: 2n, heightNumerator: 2n, heightDenominator: 1n, percent: 50n, direction: -1n },
  { radiusNumerator: 1n, radiusDenominator: 2n, heightNumerator: 3n, heightDenominator: 1n, percent: 25n, direction: -1n },
  { radiusNumerator: 2n, radiusDenominator: 3n, heightNumerator: 9n, heightDenominator: 5n, percent: 20n, direction: -1n },
] as const;

function q(numerator: bigint | number, denominator: bigint | number = 1) {
  return rational(numerator, denominator);
}

function abs(value: bigint) {
  return value < 0n ? -value : value;
}

function gcd(a: bigint, b: bigint) {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }
  return x === 0n ? 1n : x;
}

function requireRational(value: ExactValue): ExactRational {
  if (value.kind !== "RATIONAL") throw new Error("Expected a rational exact value.");
  return value;
}

function addRational(a: ExactRational, b: ExactRational) {
  return q(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
}

function subtractRational(a: ExactRational, b: ExactRational) {
  return q(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator);
}

function multiplyRational(a: ExactRational, b: ExactRational) {
  return q(a.numerator * b.numerator, a.denominator * b.denominator);
}

function dimension(value: bigint) {
  return `$${value}\\text{ cm}$`;
}

function areaCoefficient(value: bigint) {
  return `$${value}\\pi\\text{ cm}^{2}$`;
}

function volumeCoefficient(value: ExactRational) {
  const coefficient = value.denominator === 1n
    ? `${value.numerator}`
    : `\\frac{${value.numerator}}{${value.denominator}}`;
  return `$${coefficient}\\pi\\text{ cm}^{3}$`;
}

function formatRatio(value: ExactValue) {
  const ratio = requireRational(value);
  return `$${ratio.numerator}:${ratio.denominator}$`;
}

function makeState(
  prototypeId: MenCp008Wave01PrototypeId,
  seed: string,
  dimensions: Record<string, bigint>,
  derived: Record<string, ExactValue>,
  unit: Men002Unit,
  piPolicy: MenCp008Wave01State["piPolicy"] = "EXACT_PI",
  displayMode: MenCp008Wave01State["displayMode"] = "UNIT",
): MenCp008Wave01State {
  const definition = getMenCp008Wave01Definition(prototypeId);
  const state: MenCp008Wave01State = {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-008",
    permanentQlId: null,
    waveId: "MEN-CP-008-GAP-WAVE-01",
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
  state.difficulty = classifyMenCp008Wave01Difficulty(state);
  return state;
}

function stemVariant(rng: SeededRandom, variants: readonly string[]) {
  return rng.pick(variants);
}

function cylinderHeightFromTsaDraft(prototypeId: MenCp008Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CYLINDER_STATES);
  const tsaCoefficient = 2n * radius * (radius + height);
  const answer = q(height);
  return {
    state: makeState(prototypeId, seed, { radius, height, tsaCoefficient }, { answer }, "cm"),
    stem: stemVariant(rng, [
      `A closed cylindrical vessel has radius ${dimension(radius)} and total surface area ${areaCoefficient(tsaCoefficient)}. Find its height.`,
      `The total surface area of a solid cylinder is ${areaCoefficient(tsaCoefficient)} and its radius is ${dimension(radius)}. What is the cylinder's height?`,
      `A cylindrical drum has radius ${dimension(radius)}. If its total surface area is ${areaCoefficient(tsaCoefficient)}, determine its height.`,
      `Find the height of a closed cylinder whose radius is ${dimension(radius)} and TSA is ${areaCoefficient(tsaCoefficient)}.`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(height + radius), misconceptionId: "OMITTED_RADIUS_SUBTRACTION", explanation: "dividing the TSA coefficient by $2r$ but forgetting to subtract the radius" },
      { value: q(radius), misconceptionId: "REPORTED_GIVEN_RADIUS", explanation: "reporting the given radius instead of solving for height" },
      { value: q(2n * height), misconceptionId: "DOUBLED_HEIGHT", explanation: "doubling the recovered height because the TSA formula begins with $2\\pi$" },
      { value: q(tsaCoefficient, 2n * radius * radius), misconceptionId: "DIVIDED_BY_RADIUS_SQUARED", explanation: "dividing by $2r^2$ as if the whole TSA were only the two circular ends" },
    ],
    keyRule: "For a closed cylinder, $TSA=2\\pi r(r+h)$. After cancelling $\\pi$, divide by $2r$ and subtract $r$.",
    steps: [
      { title: "Use the TSA Coefficient", body: "Cancel the common $\\pi$ and substitute the known radius.", equation: `$$${tsaCoefficient}=2\\times${radius}(${radius}+h)$$` },
      { title: "Isolate the Height", body: "Divide by $2r$ and subtract the radius.", equation: `$$h=\\frac{${tsaCoefficient}}{2\\times${radius}}-${radius}=${height}\\text{ cm}$$` },
    ],
    shortcut: "For TSA written as $K\\pi$, use $h=K/(2r)-r$.",
  };
}

function cylinderRatioDraft(prototypeId: MenCp008Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CYLINDER_STATES);
  const divisor = gcd(height, height + radius);
  const ratioNumerator = height / divisor;
  const ratioDenominator = (height + radius) / divisor;
  const answer = q(ratioNumerator, ratioDenominator);
  return {
    state: makeState(prototypeId, seed, { radius, height, ratioNumerator, ratioDenominator }, { answer }, "times", "EXACT_PI", "RATIO"),
    stem: stemVariant(rng, [
      `A cylinder has radius ${dimension(radius)} and height ${dimension(height)}. Find the ratio of its curved surface area to its total surface area.`,
      `For a closed cylinder of radius ${dimension(radius)} and height ${dimension(height)}, determine $CSA:TSA$.`,
      `A cylindrical drum measures ${dimension(radius)} in radius and ${dimension(height)} in height. What is its curved-area to total-area ratio?`,
      `Find the simplified ratio between the curved and total surface areas of a cylinder with radius ${dimension(radius)} and height ${dimension(height)}.`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(height + radius, height), misconceptionId: "REVERSED_RATIO", explanation: "reversing the requested curved-to-total order" },
      { value: q(height, radius), misconceptionId: "USED_HEIGHT_RADIUS", explanation: "comparing height directly with radius instead of using the two surface formulas" },
      { value: q(radius, height + radius), misconceptionId: "USED_RADIUS_NUMERATOR", explanation: "using the radius in the numerator instead of the height" },
      { value: q(height, height + 2n * radius), misconceptionId: "COUNTED_RADIUS_TWICE", explanation: "adding two radii inside the TSA factor instead of using $h+r$" },
    ],
    keyRule: "$CSA:TSA=2\\pi rh:2\\pi r(r+h)=h:(r+h)$.",
    steps: [
      { title: "Cancel the Common Factors", body: "Both areas contain $2\\pi r$.", equation: `$$CSA:TSA=${height}:(${radius}+${height})$$` },
      { title: "Reduce the Ratio", body: "Divide both terms by their greatest common factor.", equation: `$$CSA:TSA=${ratioNumerator}:${ratioDenominator}$$` },
    ],
    shortcut: "For a cylinder, curved-to-total area is always $h:(h+r)$.",
  };
}

function cylinderRadiusFromRatioDraft(prototypeId: MenCp008Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CYLINDER_STATES);
  const divisor = gcd(height, height + radius);
  const a = height / divisor;
  const b = (height + radius) / divisor;
  const answer = q(radius);
  return {
    state: makeState(prototypeId, seed, { radius, height, ratioNumerator: a, ratioDenominator: b }, { answer }, "cm", "EXACT_PI", "UNIT"),
    stem: stemVariant(rng, [
      `The curved surface area and total surface area of a cylinder are in the ratio $${a}:${b}$. If its height is ${dimension(height)}, find its radius.`,
      `For a closed cylinder, $CSA:TSA=${a}:${b}$ and the height is ${dimension(height)}. Determine the radius.`,
      `A cylinder of height ${dimension(height)} has curved-to-total surface-area ratio $${a}:${b}$. What is its radius?`,
      `Find the radius of a cylinder whose height is ${dimension(height)} and whose $CSA:TSA$ ratio is $${a}:${b}$.`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(height), misconceptionId: "REPORTED_HEIGHT", explanation: "reporting the given height instead of using the ratio equation" },
      { value: q(height * (b - a), b), misconceptionId: "DIVIDED_BY_TOTAL_TERM", explanation: "dividing by the total ratio term $b$ instead of the curved-area term $a$" },
      { value: q(height * b, a), misconceptionId: "OMITTED_SUBTRACTION", explanation: "finding $h+r$ but reporting it as the radius" },
      { value: q(height * a, b - a), misconceptionId: "INVERTED_ISOLATION", explanation: "inverting the factor used to isolate the radius" },
    ],
    keyRule: "Since $CSA:TSA=h:(h+r)=a:b$, the radius is $r=h(b-a)/a$.",
    steps: [
      { title: "Write the Ratio Equation", body: "Match $h:(h+r)$ with the given ratio.", equation: `$$\\frac{${height}}{${height}+r}=\\frac{${a}}{${b}}$$` },
      { title: "Solve for the Radius", body: "Cross-multiply and isolate $r$.", equation: `$$r=\\frac{${height}(${b}-${a})}{${a}}=${radius}\\text{ cm}$$` },
    ],
    shortcut: "For ratio $a:b$ and height $h$, use $r=h(b-a)/a$.",
  };
}

function cylinderHeightFromRatioDraft(prototypeId: MenCp008Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CYLINDER_STATES);
  const divisor = gcd(height, height + radius);
  const a = height / divisor;
  const b = (height + radius) / divisor;
  const answer = q(height);
  return {
    state: makeState(prototypeId, seed, { radius, height, ratioNumerator: a, ratioDenominator: b }, { answer }, "cm"),
    stem: stemVariant(rng, [
      `A cylinder has $CSA:TSA=${a}:${b}$ and radius ${dimension(radius)}. Find its height.`,
      `The curved and total surface areas of a closed cylinder are in the ratio $${a}:${b}$. If the radius is ${dimension(radius)}, determine the height.`,
      `For a cylinder of radius ${dimension(radius)}, the ratio of curved area to total area is $${a}:${b}$. What is its height?`,
      `Find the height when a cylinder's radius is ${dimension(radius)} and $CSA:TSA=${a}:${b}$.`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(radius), misconceptionId: "REPORTED_RADIUS", explanation: "reporting the given radius instead of recovering the height" },
      { value: q(radius * (b - a), a), misconceptionId: "USED_RADIUS_FORMULA", explanation: "using the radius-from-ratio formula in the reverse task" },
      { value: q(radius * b, b - a), misconceptionId: "USED_TOTAL_TERM", explanation: "using the total ratio term $b$ instead of the curved term $a$" },
      { value: q(radius * (b - a), b), misconceptionId: "INVERTED_HEIGHT_FACTOR", explanation: "inverting the required ratio factor" },
    ],
    keyRule: "From $h:(h+r)=a:b$, the height is $h=ar/(b-a)$.",
    steps: [
      { title: "Match the Surface Ratio", body: "Use $h:(h+r)$ for cylinder CSA:TSA.", equation: `$$\\frac{h}{h+${radius}}=\\frac{${a}}{${b}}$$` },
      { title: "Recover the Height", body: "Cross-multiply and collect the height terms.", equation: `$$h=\\frac{${a}\\times${radius}}{${b}-${a}}=${height}\\text{ cm}$$` },
    ],
    shortcut: "For ratio $a:b$ and radius $r$, use $h=ar/(b-a)$.",
  };
}

function percentageDraft(
  prototypeId: MenCp008Wave01PrototypeId,
  seed: string,
  rng: SeededRandom,
  shape: "cylinder" | "cone",
): Draft {
  const scale = rng.pick(SCALE_STATES);
  const multiplierNumerator = scale.radiusNumerator ** 2n * scale.heightNumerator;
  const multiplierDenominator = scale.radiusDenominator ** 2n * scale.heightDenominator;
  const magnitude = q(scale.percent);
  const radiusText = scale.radiusDenominator === 1n
    ? `${scale.radiusNumerator} times`
    : `$\\frac{${scale.radiusNumerator}}{${scale.radiusDenominator}}$ times`;
  const heightText = scale.heightDenominator === 1n
    ? `${scale.heightNumerator} times`
    : `$\\frac{${scale.heightNumerator}}{${scale.heightDenominator}}$ times`;
  const direction = scale.direction > 0n ? "increase" : "decrease";
  const signedChange = scale.direction * scale.percent;
  return {
    state: makeState(
      prototypeId,
      seed,
      { ...scale, multiplierNumerator, multiplierDenominator, signedChange },
      { answer: magnitude, multiplier: q(multiplierNumerator, multiplierDenominator) },
      "%",
    ),
    stem: stemVariant(rng, [
      `The radius of a ${shape} becomes ${radiusText} its original value and its height becomes ${heightText} its original value. By what percentage does its volume ${direction}?`,
      `A ${shape}'s radius is scaled to ${radiusText} the original and its height to ${heightText} the original. Find the percentage ${direction} in volume.`,
      `When the radius of a ${shape} is changed by a factor of ${radiusText} and the height by a factor of ${heightText}, determine the percentage ${direction} in volume.`,
      `A ${shape} is resized so that radius and height become ${radiusText} and ${heightText} their original values respectively. What is the volume ${direction} percentage?`,
    ]),
    answer: magnitude,
    wrongAnswers: [
      { value: q(scale.percent + 20n), misconceptionId: "ADDED_EXTRA_PERCENT", explanation: "adding an unrelated twenty percentage points after finding the volume factor" },
      { value: q(abs(scale.percent - 10n) || 10n), misconceptionId: "LINEAR_PERCENT_ERROR", explanation: "treating the radius effect as linear instead of squaring it" },
      { value: q(abs((scale.radiusNumerator * 100n / scale.radiusDenominator) - 100n) || 100n), misconceptionId: "USED_RADIUS_ONLY", explanation: "using only the radius change and ignoring height" },
      { value: q(abs((scale.heightNumerator * 100n / scale.heightDenominator) - 100n) || 100n), misconceptionId: "USED_HEIGHT_ONLY", explanation: "using only the height change and ignoring the squared radius factor" },
      { value: q(multiplierNumerator * 100n, multiplierDenominator), misconceptionId: "REPORTED_FINAL_PERCENT", explanation: "reporting the final volume as a percentage of the original instead of the percentage change" },
    ],
    keyRule: `The volume of a ${shape} is proportional to $r^2h$, so the volume multiplier is $(r_2/r_1)^2(h_2/h_1)$.`,
    steps: [
      { title: "Build the Volume Multiplier", body: "Square the radius factor and multiply by the height factor.", equation: `$$M=\\left(\\frac{${scale.radiusNumerator}}{${scale.radiusDenominator}}\\right)^2\\left(\\frac{${scale.heightNumerator}}{${scale.heightDenominator}}\\right)=\\frac{${multiplierNumerator}}{${multiplierDenominator}}$$` },
      { title: `Find the Percentage ${direction[0]!.toUpperCase()}${direction.slice(1)}`, body: "Compare the multiplier with $1$ and multiply the difference by $100$.", equation: `$$Percentage\\ ${direction}=${scale.percent}\\%$$` },
    ],
    shortcut: "For both cylinders and cones, use the multiplier $r^2h$; the constant $\\pi$ or $\\frac13\\pi$ cancels.",
  };
}

function sweptArea(radius: bigint, length: bigint, revolutions: bigint) {
  return (44n * radius * length * revolutions) / 7n;
}

function rollerLengthDraft(prototypeId: MenCp008Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, length, revolutions } = rng.pick(ROLLER_STATES);
  const area = sweptArea(radius, length, revolutions);
  const answer = q(length);
  return {
    state: makeState(prototypeId, seed, { radius, length, revolutions, sweptArea: area }, { answer }, "cm", "PI_22_OVER_7"),
    stem: stemVariant(rng, [
      `A cylindrical road roller of radius ${dimension(radius)} covers $${area}\\text{ cm}^{2}$ in ${revolutions} revolutions. Using $\\pi=\\frac{22}{7}$, find the roller's length.`,
      `A roller makes ${revolutions} complete revolutions and sweeps $${area}\\text{ cm}^{2}$. Its radius is ${dimension(radius)}. Find its length using $\\pi=\\frac{22}{7}$.`,
      `The swept area of a cylindrical roller is $${area}\\text{ cm}^{2}$ after ${revolutions} revolutions. If the radius is ${dimension(radius)}, determine its length. Take $\\pi=\\frac{22}{7}$.`,
      `Find the length of a roller with radius ${dimension(radius)} that covers $${area}\\text{ cm}^{2}$ in ${revolutions} revolutions, using $\\pi=\\frac{22}{7}$.`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(length * revolutions), misconceptionId: "OMITTED_REVOLUTION_DIVISION", explanation: "finding the total axial sweep and forgetting to divide by the number of revolutions" },
      { value: q(2n * length), misconceptionId: "DOUBLED_LENGTH", explanation: "introducing an extra factor of two after already using the circumference" },
      { value: q(radius), misconceptionId: "REPORTED_RADIUS", explanation: "reporting the given radius instead of solving for roller length" },
      { value: q(length * 7n, 22n), misconceptionId: "OMITTED_CIRCUMFERENCE_FACTOR", explanation: "using only the declared pi fraction instead of the full circumference $2\\pi r$" },
    ],
    keyRule: "Swept area equals circumference × roller length × revolutions: $A=2\\pi rLn$.",
    steps: [
      { title: "Substitute the Roller Data", body: "Use the declared exact value $\\pi=22/7$.", equation: `$$${area}=2\\times\\frac{22}{7}\\times${radius}\\times L\\times${revolutions}$$` },
      { title: "Solve for the Length", body: "Divide the swept area by circumference and revolutions.", equation: `$$L=${length}\\text{ cm}$$` },
    ],
    shortcut: "Use $L=A/(2\\pi rn)$ and cancel factors before multiplying.",
  };
}

function rollerRadiusDraft(prototypeId: MenCp008Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, length, revolutions } = rng.pick(ROLLER_STATES);
  const area = sweptArea(radius, length, revolutions);
  const answer = q(radius);
  return {
    state: makeState(prototypeId, seed, { radius, length, revolutions, sweptArea: area }, { answer }, "cm", "PI_22_OVER_7"),
    stem: stemVariant(rng, [
      `A cylindrical roller of length ${dimension(length)} covers $${area}\\text{ cm}^{2}$ in ${revolutions} revolutions. Find its radius using $\\pi=\\frac{22}{7}$.`,
      `A road roller is ${dimension(length)} long and sweeps $${area}\\text{ cm}^{2}$ in ${revolutions} turns. Determine its radius. Take $\\pi=\\frac{22}{7}$.`,
      `The swept area after ${revolutions} revolutions is $${area}\\text{ cm}^{2}$. If the roller length is ${dimension(length)}, what is its radius? Use $\\pi=\\frac{22}{7}$.`,
      `Find the radius of a roller ${dimension(length)} long that covers $${area}\\text{ cm}^{2}$ in ${revolutions} revolutions, taking $\\pi=\\frac{22}{7}$.`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(2n * radius), misconceptionId: "REPORTED_DIAMETER", explanation: "reporting the diameter after solving for $2r$" },
      { value: q(radius * revolutions), misconceptionId: "OMITTED_REVOLUTION_DIVISION", explanation: "forgetting to divide by the number of revolutions" },
      { value: q(length), misconceptionId: "REPORTED_LENGTH", explanation: "reporting the given roller length instead of the radius" },
      { value: q(radius, 2n), misconceptionId: "DIVIDED_RADIUS_TWICE", explanation: "dividing by two again after the circumference formula has already isolated the radius" },
    ],
    keyRule: "From $A=2\\pi rLn$, the radius is $r=A/(2\\pi Ln)$.",
    steps: [
      { title: "Use the Swept-Area Formula", body: "Substitute length, revolutions and the declared pi value.", equation: `$$${area}=2\\times\\frac{22}{7}\\times r\\times${length}\\times${revolutions}$$` },
      { title: "Isolate the Radius", body: "Divide by the remaining factors.", equation: `$$r=${radius}\\text{ cm}$$` },
    ],
    shortcut: "Use $r=A/(2\\pi Ln)$; do not report $2r$ as the radius.",
  };
}

function coneRadiusFromCsaDraft(prototypeId: MenCp008Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, slantHeight } = rng.pick(CONE_STATES);
  const csaCoefficient = radius * slantHeight;
  const answer = q(radius);
  return coneSurfaceInverseDraft(prototypeId, seed, rng, {
    radius, slantHeight, coefficient: csaCoefficient, answer,
    stemTarget: "radius", surface: "curved",
    formula: `r=\\frac{${csaCoefficient}}{${slantHeight}}=${radius}`,
    keyRule: "Cone curved surface area is $\\pi rl$, so the radius is the coefficient of $\\pi$ divided by slant height.",
  });
}

function coneSlantFromCsaDraft(prototypeId: MenCp008Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, slantHeight } = rng.pick(CONE_STATES);
  const csaCoefficient = radius * slantHeight;
  const answer = q(slantHeight);
  return coneSurfaceInverseDraft(prototypeId, seed, rng, {
    radius, slantHeight, coefficient: csaCoefficient, answer,
    stemTarget: "slant height", surface: "curved",
    formula: `l=\\frac{${csaCoefficient}}{${radius}}=${slantHeight}`,
    keyRule: "Cone curved surface area is $\\pi rl$, so slant height is the coefficient of $\\pi$ divided by radius.",
  });
}

function coneSlantFromTsaDraft(prototypeId: MenCp008Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, slantHeight } = rng.pick(CONE_STATES);
  const tsaCoefficient = radius * (radius + slantHeight);
  const answer = q(slantHeight);
  return coneSurfaceInverseDraft(prototypeId, seed, rng, {
    radius, slantHeight, coefficient: tsaCoefficient, answer,
    stemTarget: "slant height", surface: "total",
    formula: `l=\\frac{${tsaCoefficient}}{${radius}}-${radius}=${slantHeight}`,
    keyRule: "Cone total surface area is $\\pi r(r+l)$, so divide the coefficient by $r$ and subtract $r$.",
  });
}

function coneRadiusFromTsaDraft(prototypeId: MenCp008Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, slantHeight } = rng.pick(CONE_STATES);
  const tsaCoefficient = radius * (radius + slantHeight);
  const answer = q(radius);
  const state = makeState(prototypeId, seed, { radius, slantHeight, tsaCoefficient }, { answer }, "cm");
  return {
    state,
    stem: stemVariant(rng, [
      `A cone has slant height ${dimension(slantHeight)} and total surface area ${areaCoefficient(tsaCoefficient)}. Find its radius.`,
      `The TSA of a cone is ${areaCoefficient(tsaCoefficient)} and its slant height is ${dimension(slantHeight)}. Determine the radius.`,
      `A conical tent has slant height ${dimension(slantHeight)}. If its total surface area is ${areaCoefficient(tsaCoefficient)}, what is its radius?`,
      `Find the radius of a cone whose slant height is ${dimension(slantHeight)} and TSA is ${areaCoefficient(tsaCoefficient)}.`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(slantHeight), misconceptionId: "REPORTED_SLANT", explanation: "reporting the given slant height instead of solving the quadratic relation" },
      { value: q(radius + slantHeight), misconceptionId: "REPORTED_RADIUS_PLUS_SLANT", explanation: "reporting $r+l$ after dividing by the radius" },
      { value: q(2n * radius), misconceptionId: "REPORTED_DIAMETER", explanation: "reporting diameter instead of radius" },
      { value: q(tsaCoefficient, slantHeight), misconceptionId: "USED_CSA_INVERSE", explanation: "dividing by slant height as though the supplied area were curved surface area" },
    ],
    keyRule: "For $TSA=K\\pi$ and known slant height $l$, solve $r(r+l)=K$ for the positive radius.",
    steps: [
      { title: "Form the Radius Equation", body: "Cancel $\\pi$ from $TSA=\\pi r(r+l)$.", equation: `$$r(r+${slantHeight})=${tsaCoefficient}$$` },
      { title: "Choose the Positive Root", body: "Factor or test positive divisors of the coefficient.", equation: `$$r=${radius}\\text{ cm}$$` },
    ],
    shortcut: "Find a positive factor $r$ of $K$ whose paired factor differs from it by the slant height.",
  };
}

function coneSurfaceInverseDraft(
  prototypeId: MenCp008Wave01PrototypeId,
  seed: string,
  rng: SeededRandom,
  data: {
    radius: bigint;
    slantHeight: bigint;
    coefficient: bigint;
    answer: ExactValue;
    stemTarget: "radius" | "slant height";
    surface: "curved" | "total";
    formula: string;
    keyRule: string;
  },
): Draft {
  const supplied = data.stemTarget === "radius" ? data.slantHeight : data.radius;
  const suppliedName = data.stemTarget === "radius" ? "slant height" : "radius";
  const surfaceLabel = data.surface === "curved" ? "curved surface area" : "total surface area";
  const answerInteger = requireRational(data.answer).numerator;
  return {
    state: makeState(prototypeId, seed, { radius: data.radius, slantHeight: data.slantHeight, areaCoefficient: data.coefficient }, { answer: data.answer }, "cm"),
    stem: stemVariant(rng, [
      `A cone has ${suppliedName} ${dimension(supplied)} and ${surfaceLabel} ${areaCoefficient(data.coefficient)}. Find its ${data.stemTarget}.`,
      `The ${surfaceLabel} of a cone is ${areaCoefficient(data.coefficient)}. If its ${suppliedName} is ${dimension(supplied)}, determine the ${data.stemTarget}.`,
      `For a cone with ${suppliedName} ${dimension(supplied)}, the ${surfaceLabel} is ${areaCoefficient(data.coefficient)}. What is the ${data.stemTarget}?`,
      `Find the ${data.stemTarget} of a cone whose ${suppliedName} is ${dimension(supplied)} and whose ${surfaceLabel} equals ${areaCoefficient(data.coefficient)}.`,
    ]),
    answer: data.answer,
    wrongAnswers: [
      { value: q(supplied), misconceptionId: "REPORTED_GIVEN_DIMENSION", explanation: `reporting the given ${suppliedName} instead of the requested ${data.stemTarget}` },
      { value: q(answerInteger + data.radius), misconceptionId: "ADDED_RADIUS", explanation: "adding the radius after applying the surface formula" },
      { value: q(2n * answerInteger), misconceptionId: "DOUBLED_RESULT", explanation: "introducing an extra factor of two that is not present in the cone surface formula" },
      { value: q(data.coefficient, supplied + data.radius), misconceptionId: "USED_WRONG_DIVISOR", explanation: "dividing the area coefficient by the wrong dimension combination" },
      { value: q(abs(answerInteger - data.radius) || 1n), misconceptionId: "SUBTRACTED_RADIUS", explanation: "subtracting the radius in a curved-area inverse where only division is needed" },
    ],
    keyRule: data.keyRule,
    steps: [
      { title: "Cancel the Common Pi Factor", body: "Use the coefficient of $\\pi$ as the exact area value for the inverse calculation.", equation: `$$${data.coefficient}=${data.surface === "curved" ? `${data.radius}\\times${data.slantHeight}` : `${data.radius}(${data.radius}+${data.slantHeight})`}$$` },
      { title: `Recover the ${data.stemTarget === "radius" ? "Radius" : "Slant Height"}`, body: "Apply the matching inverse relation.", equation: `$$${data.formula}\\text{ cm}$$` },
    ],
    shortcut: data.surface === "curved"
      ? "For $CSA=K\\pi$, divide $K$ by the known dimension in $rl$."
      : "For $TSA=K\\pi$, divide $K$ by $r$ and then subtract $r$.",
  };
}

function coneVolumeFromSlantDraft(
  prototypeId: MenCp008Wave01PrototypeId,
  seed: string,
  rng: SeededRandom,
  given: "radius" | "height",
): Draft {
  const { radius, height, slantHeight } = rng.pick(CONE_STATES);
  const volume = pi(radius ** 2n * height, 3n);
  const missing = given === "radius" ? height : radius;
  const known = given === "radius" ? radius : height;
  const knownName = given;
  const missingName = given === "radius" ? "height" : "radius";
  const otherWrong = pi(radius ** 2n * slantHeight, 3n);
  return {
    state: makeState(prototypeId, seed, { radius, height, slantHeight }, { answer: volume, recoveredDimension: q(missing) }, "cm³"),
    stem: stemVariant(rng, [
      `A cone has ${knownName} ${dimension(known)} and slant height ${dimension(slantHeight)}. Find its volume in exact form.`,
      `The ${knownName} of a cone is ${dimension(known)} and its slant height is ${dimension(slantHeight)}. Determine the exact volume.`,
      `A conical solid has ${knownName} ${dimension(known)} with slant height ${dimension(slantHeight)}. What is its exact volume?`,
      `Find the volume of a cone whose ${knownName} is ${dimension(known)} and slant height is ${dimension(slantHeight)}. Keep $\\pi$ exact.`,
    ]),
    answer: volume,
    wrongAnswers: [
      { value: pi(radius ** 2n * height), misconceptionId: "OMITTED_ONE_THIRD", explanation: "using the cylinder formula and omitting the cone's factor $\\frac13$" },
      { value: otherWrong, misconceptionId: "USED_SLANT_AS_HEIGHT", explanation: "using slant height directly as the perpendicular height in the volume formula" },
      { value: pi(radius * height, 3n), misconceptionId: "DID_NOT_SQUARE_RADIUS", explanation: "using $rh$ instead of $r^2h$" },
      { value: pi(slantHeight ** 2n * height, 3n), misconceptionId: "SQUARED_SLANT", explanation: "squaring the slant height instead of the base radius" },
    ],
    keyRule: `First recover the ${missingName} from $l^2=r^2+h^2$, then use $V=\\frac13\\pi r^2h$.`,
    steps: [
      { title: `Recover the ${missingName === "height" ? "Perpendicular Height" : "Radius"}`, body: "Use the right triangle through the cone's axis.", equation: `$$${missingName[0]}=\\sqrt{${slantHeight}^2-${known}^2}=${missing}\\text{ cm}$$` },
      { title: "Calculate the Cone Volume", body: "Substitute the recovered dimension into the cone formula.", equation: `$$V=${volumeCoefficient(volume.coefficient)}$$` },
    ],
    shortcut: "Recognise the Pythagorean triple first, then use one-third of the corresponding cylinder volume.",
  };
}

function coneRatioDraft(prototypeId: MenCp008Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, slantHeight } = rng.pick(CONE_STATES);
  const divisor = gcd(slantHeight, slantHeight + radius);
  const a = slantHeight / divisor;
  const b = (slantHeight + radius) / divisor;
  const answer = q(a, b);
  return {
    state: makeState(prototypeId, seed, { radius, slantHeight, ratioNumerator: a, ratioDenominator: b }, { answer }, "times", "EXACT_PI", "RATIO"),
    stem: stemVariant(rng, [
      `A cone has radius ${dimension(radius)} and slant height ${dimension(slantHeight)}. Find $CSA:TSA$.`,
      `Determine the curved-to-total surface-area ratio of a cone with radius ${dimension(radius)} and slant height ${dimension(slantHeight)}.`,
      `A conical tent has radius ${dimension(radius)} and slant height ${dimension(slantHeight)}. What is the ratio of curved area to total area?`,
      `Find the simplified $CSA:TSA$ ratio for a cone whose radius is ${dimension(radius)} and slant height is ${dimension(slantHeight)}.`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(b, a), misconceptionId: "REVERSED_RATIO", explanation: "reversing the requested curved-to-total order" },
      { value: q(slantHeight, radius), misconceptionId: "USED_SLANT_RADIUS", explanation: "comparing slant height directly with radius instead of using the surface formulas" },
      { value: q(radius, slantHeight + radius), misconceptionId: "USED_RADIUS_NUMERATOR", explanation: "using radius rather than slant height in the curved-area term" },
      { value: q(slantHeight, slantHeight + 2n * radius), misconceptionId: "COUNTED_BASE_TWICE", explanation: "adding the base radius twice in total surface area" },
    ],
    keyRule: "$CSA:TSA=\\pi rl:\\pi r(l+r)=l:(l+r)$.",
    steps: [
      { title: "Cancel the Common Factors", body: "Both surface areas contain $\\pi r$.", equation: `$$CSA:TSA=${slantHeight}:(${slantHeight}+${radius})$$` },
      { title: "Reduce the Ratio", body: "Divide both terms by their common factor.", equation: `$$CSA:TSA=${a}:${b}$$` },
    ],
    shortcut: "For a cone, curved-to-total area is always $l:(l+r)$.",
  };
}

function equalVolumeDraft(prototypeId: MenCp008Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const values = rng.pick(EQUAL_VOLUME_STATES);
  const answer = q(values.coneHeight);
  return {
    state: makeState(prototypeId, seed, { ...values }, { answer }, "cm"),
    stem: stemVariant(rng, [
      `A cylinder of radius ${dimension(values.cylinderRadius)} and height ${dimension(values.cylinderHeight)} has the same volume as a cone of radius ${dimension(values.coneRadius)}. Find the cone's height.`,
      `The volume of a cylinder with radius ${dimension(values.cylinderRadius)} and height ${dimension(values.cylinderHeight)} equals that of a cone whose radius is ${dimension(values.coneRadius)}. Determine the cone height.`,
      `A cone of radius ${dimension(values.coneRadius)} is equal in volume to a cylinder of radius ${dimension(values.cylinderRadius)} and height ${dimension(values.cylinderHeight)}. What is the cone's height?`,
      `Find the height of a cone with radius ${dimension(values.coneRadius)} if it has the same volume as a cylinder of radius ${dimension(values.cylinderRadius)} and height ${dimension(values.cylinderHeight)}.`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(values.coneHeight, 3n), misconceptionId: "DIVIDED_BY_THREE", explanation: "dividing by three instead of multiplying by three to compensate for the cone formula" },
      { value: q(3n * values.coneHeight), misconceptionId: "MULTIPLIED_TWICE", explanation: "applying the cone factor of three twice" },
      { value: q(values.cylinderHeight), misconceptionId: "EQUATED_HEIGHTS", explanation: "assuming equal volume means equal height" },
      { value: q(values.cylinderRadius ** 2n * values.cylinderHeight, values.coneRadius ** 2n), misconceptionId: "OMITTED_CONE_FACTOR", explanation: "cancelling $\\pi$ but omitting the cone's one-third factor" },
    ],
    keyRule: "For equal volume, $\\pi R^2H=\\frac13\\pi r^2h$, so $h=3R^2H/r^2$.",
    steps: [
      { title: "Equate the Two Volumes", body: "Cancel the common $\\pi$ factor.", equation: `$$${values.cylinderRadius}^2\\times${values.cylinderHeight}=\\frac13\\times${values.coneRadius}^2\\times h$$` },
      { title: "Solve for Cone Height", body: "Multiply by three and divide by the squared cone radius.", equation: `$$h=${values.coneHeight}\\text{ cm}$$` },
    ],
    shortcut: "Equal cylinder and cone volumes give $h_{cone}=3R^2H/r^2$.",
  };
}

function generateDraft(prototypeId: MenCp008Wave01PrototypeId, seed: string): Draft {
  const rng = createSeededRandom(`${prototypeId}:${seed}`);
  switch (prototypeId) {
    case "MEN-CP008-W1-PROT-CYLINDER-HEIGHT-FROM-TSA": return cylinderHeightFromTsaDraft(prototypeId, seed, rng);
    case "MEN-CP008-W1-PROT-CYLINDER-CSA-TSA-RATIO": return cylinderRatioDraft(prototypeId, seed, rng);
    case "MEN-CP008-W1-PROT-CYLINDER-RADIUS-FROM-AREA-RATIO": return cylinderRadiusFromRatioDraft(prototypeId, seed, rng);
    case "MEN-CP008-W1-PROT-CYLINDER-HEIGHT-FROM-AREA-RATIO": return cylinderHeightFromRatioDraft(prototypeId, seed, rng);
    case "MEN-CP008-W1-PROT-CYLINDER-VOLUME-PERCENT-CHANGE": return percentageDraft(prototypeId, seed, rng, "cylinder");
    case "MEN-CP008-W1-PROT-ROLLER-LENGTH-FROM-SWEPT-AREA": return rollerLengthDraft(prototypeId, seed, rng);
    case "MEN-CP008-W1-PROT-ROLLER-RADIUS-FROM-SWEPT-AREA": return rollerRadiusDraft(prototypeId, seed, rng);
    case "MEN-CP008-W1-PROT-CONE-RADIUS-FROM-CSA": return coneRadiusFromCsaDraft(prototypeId, seed, rng);
    case "MEN-CP008-W1-PROT-CONE-SLANT-FROM-CSA": return coneSlantFromCsaDraft(prototypeId, seed, rng);
    case "MEN-CP008-W1-PROT-CONE-SLANT-FROM-TSA": return coneSlantFromTsaDraft(prototypeId, seed, rng);
    case "MEN-CP008-W1-PROT-CONE-RADIUS-FROM-TSA": return coneRadiusFromTsaDraft(prototypeId, seed, rng);
    case "MEN-CP008-W1-PROT-CONE-VOLUME-FROM-RADIUS-SLANT": return coneVolumeFromSlantDraft(prototypeId, seed, rng, "radius");
    case "MEN-CP008-W1-PROT-CONE-VOLUME-FROM-HEIGHT-SLANT": return coneVolumeFromSlantDraft(prototypeId, seed, rng, "height");
    case "MEN-CP008-W1-PROT-CONE-CSA-TSA-RATIO": return coneRatioDraft(prototypeId, seed, rng);
    case "MEN-CP008-W1-PROT-EQUAL-VOLUME-CONE-HEIGHT": return equalVolumeDraft(prototypeId, seed, rng);
    case "MEN-CP008-W1-PROT-CONE-VOLUME-PERCENT-CHANGE": return percentageDraft(prototypeId, seed, rng, "cone");
  }
}

export function classifyMenCp008Wave01Difficulty(state: MenCp008Wave01State): Men002Difficulty {
  const d = state.dimensions;
  switch (state.solveMode) {
    case "findCylinderCurvedToTotalSurfaceRatio":
    case "findConeCurvedToTotalSurfaceRatio":
      return d.ratioDenominator! >= 15n ? "Hard" : "Medium";
    case "findCylinderVolumePercentageChange":
    case "findConeVolumePercentageChange":
      return d.percent! >= 100n ? "Hard" : "Medium";
    case "findRollerLengthFromSweptArea":
    case "findRollerRadiusFromSweptArea":
      return d.sweptArea! >= 5000n ? "Hard" : "Medium";
    case "findConeVolumeFromRadiusAndSlantHeight":
    case "findConeVolumeFromHeightAndSlantHeight":
      return d.slantHeight! >= 25n ? "Hard" : "Medium";
    case "findConeHeightForEqualCylinderVolume":
      return d.coneHeight! >= 12n ? "Hard" : "Medium";
    default: {
      const largest = Object.values(d).reduce((max, value) => value > max ? value : max, 0n);
      return largest >= 100n || d.radius! >= 7n || d.height! >= 16n ? "Hard" : "Medium";
    }
  }
}

function verifyDraft(draft: Draft) {
  const d = draft.state.dimensions;
  let reconstructed: ExactValue;
  let method: string;
  switch (draft.state.solveMode) {
    case "findCylinderHeightFromTotalSurfaceArea":
      reconstructed = q(d.tsaCoefficient! - 2n * d.radius! ** 2n, 2n * d.radius!);
      method = "independently removed the circular-end coefficient and divided by the lateral coefficient";
      break;
    case "findCylinderCurvedToTotalSurfaceRatio":
      reconstructed = q(d.height!, d.height! + d.radius!);
      method = "independently divided exact CSA and TSA coefficients";
      break;
    case "findCylinderRadiusFromSurfaceRatioAndHeight":
      reconstructed = q(d.height! * (d.ratioDenominator! - d.ratioNumerator!), d.ratioNumerator!);
      method = "independently solved h/(h+r)=a/b for radius";
      break;
    case "findCylinderHeightFromSurfaceRatioAndRadius":
      reconstructed = q(d.ratioNumerator! * d.radius!, d.ratioDenominator! - d.ratioNumerator!);
      method = "independently solved h/(h+r)=a/b for height";
      break;
    case "findCylinderVolumePercentageChange":
    case "findConeVolumePercentageChange":
      reconstructed = q(abs(d.multiplierNumerator! - d.multiplierDenominator!) * 100n, d.multiplierDenominator!);
      method = "independently compared the exact r-squared-h multiplier with one";
      break;
    case "findRollerLengthFromSweptArea":
      reconstructed = q(d.sweptArea! * 7n, 44n * d.radius! * d.revolutions!);
      method = "independently divided swept area by exact circumference and revolutions";
      break;
    case "findRollerRadiusFromSweptArea":
      reconstructed = q(d.sweptArea! * 7n, 44n * d.length! * d.revolutions!);
      method = "independently divided swept area by exact length, revolutions and 2pi";
      break;
    case "findConeRadiusFromCurvedSurfaceArea":
      reconstructed = q(d.areaCoefficient!, d.slantHeight!);
      method = "independently divided the CSA coefficient by slant height";
      break;
    case "findConeSlantHeightFromCurvedSurfaceArea":
      reconstructed = q(d.areaCoefficient!, d.radius!);
      method = "independently divided the CSA coefficient by radius";
      break;
    case "findConeSlantHeightFromTotalSurfaceArea":
      reconstructed = q(d.areaCoefficient!, d.radius!);
      reconstructed = subtractRational(requireRational(reconstructed), q(d.radius!));
      method = "independently divided the TSA coefficient by radius and removed the base-radius term";
      break;
    case "findConeRadiusFromTotalSurfaceArea": {
      let found = 0n;
      for (let candidate = 1n; candidate <= 100n; candidate += 1n) {
        if (candidate * (candidate + d.slantHeight!) === d.tsaCoefficient!) {
          if (found !== 0n) throw new Error("Cone TSA inverse is not unique.");
          found = candidate;
        }
      }
      reconstructed = q(found);
      method = "independently enumerated positive integral radii satisfying r(r+l)=K";
      break;
    }
    case "findConeVolumeFromRadiusAndSlantHeight": {
      const height = integerSquareRoot(d.slantHeight! ** 2n - d.radius! ** 2n);
      if (height === null) throw new Error("Expected an exact cone height.");
      reconstructed = pi(d.radius! ** 2n * height, 3n);
      method = "independently recovered height from the axial right triangle before applying cone volume";
      break;
    }
    case "findConeVolumeFromHeightAndSlantHeight": {
      const radius = integerSquareRoot(d.slantHeight! ** 2n - d.height! ** 2n);
      if (radius === null) throw new Error("Expected an exact cone radius.");
      reconstructed = pi(radius ** 2n * d.height!, 3n);
      method = "independently recovered radius from the axial right triangle before applying cone volume";
      break;
    }
    case "findConeCurvedToTotalSurfaceRatio":
      reconstructed = q(d.slantHeight!, d.slantHeight! + d.radius!);
      method = "independently divided exact cone CSA and TSA coefficients";
      break;
    case "findConeHeightForEqualCylinderVolume":
      reconstructed = q(3n * d.cylinderRadius! ** 2n * d.cylinderHeight!, d.coneRadius! ** 2n);
      method = "independently equated cylinder and cone volume coefficients after cancelling pi";
      break;
  }
  return { valid: exactEquals(reconstructed, draft.answer), method, reconstructed: exactKey(reconstructed) };
}

function buildOptions(draft: Draft, rng: SeededRandom) {
  const uniqueWrong = new Map<string, WrongAnswer>();
  for (const wrong of draft.wrongAnswers) {
    if (!isPositive(wrong.value) || exactEquals(wrong.value, draft.answer)) continue;
    const key = exactKey(wrong.value);
    if (!uniqueWrong.has(key)) uniqueWrong.set(key, wrong);
  }
  if (uniqueWrong.size < 3) {
    const base = draft.answer.kind === "RATIONAL" ? draft.answer : draft.answer.coefficient;
    for (let offset = 1n; uniqueWrong.size < 3 && offset < 20n; offset += 1n) {
      const fallback = draft.answer.kind === "PI"
        ? pi(base.numerator + offset * base.denominator, base.denominator)
        : q(base.numerator + offset * base.denominator, base.denominator);
      if (!exactEquals(fallback, draft.answer) && !uniqueWrong.has(exactKey(fallback))) {
        uniqueWrong.set(exactKey(fallback), {
          value: fallback,
          misconceptionId: `FALLBACK_DERIVED_${offset}`,
          explanation: "using a nearby unsimplified coefficient instead of completing the exact inverse calculation",
        });
      }
    }
  }
  if (uniqueWrong.size < 3) throw new Error(`${draft.state.prototypeId} could not produce three unique wrong options.`);
  const selectedWrong = rng.shuffle([...uniqueWrong.values()]).slice(0, 3);
  const candidates = [{ value: draft.answer, misconceptionId: null, explanation: "" }, ...selectedWrong];
  const shuffled = rng.shuffle(candidates);
  const labels = ["A", "B", "C", "D"] as const;
  const options: MenCp008Wave01Option[] = shuffled.map((candidate, index) => ({
    label: labels[index]!,
    value: candidate.value,
    display: draft.state.displayMode === "RATIO" ? formatRatio(candidate.value) : formatWithUnit(candidate.value, draft.state.unit),
    isCorrect: candidate.misconceptionId === null,
    misconceptionId: candidate.misconceptionId,
  }));
  const explanationByKey = new Map(selectedWrong.map((wrong) => [exactKey(wrong.value), wrong.explanation]));
  const traps = options
    .filter((option) => !option.isCorrect)
    .map((option) => `Option ${option.label} (${option.display}): Common mistake: ${explanationByKey.get(exactKey(option.value))}.`);
  return { options, traps };
}

function validatePackage(question: Omit<MenCp008Wave01Package, "validation">) {
  const explanationText = [
    question.explanation.keyRule,
    ...question.explanation.steps.flatMap((step) => [step.title, step.body, step.equation ?? ""]),
    question.explanation.shortcut,
    ...question.explanation.traps,
  ].join("\n");
  const learnerText = [question.stem, ...question.options.map((option) => option.display), question.answer, explanationText].join("\n");
  const checks = [
    { name: "independent verifier", passed: question.verification.valid, message: "Independent verification must agree with the answer." },
    { name: "four exact options", passed: question.options.length === 4 && new Set(question.options.map((option) => exactKey(option.value))).size === 4, message: "Exactly four unique exact option values are required." },
    { name: "four displayed options", passed: new Set(question.options.map((option) => option.display)).size === 4, message: "Exactly four unique displayed options are required." },
    { name: "one correct option", passed: question.options.filter((option) => option.isCorrect).length === 1 && question.options[question.correctIndex]?.isCorrect === true, message: "Exactly one option must be correct." },
    { name: "answer agreement", passed: question.answer === question.options[question.correctIndex]?.display, message: "Answer display must match the correct option." },
    { name: "state-derived difficulty", passed: question.difficulty === classifyMenCp008Wave01Difficulty(question.state), message: "Difficulty must derive from canonical state." },
    { name: "four-tier teaching", passed: Boolean(question.explanation.keyRule) && question.explanation.steps.length >= 2 && Boolean(question.explanation.shortcut) && question.explanation.traps.length === 3, message: "Rule, steps, shortcut and three traps are required." },
    { name: "MathJax cleanliness", passed: !/[½¼²³]/.test(learnerText) && !/(^|[^\\])sqrt\{/.test(explanationText) && !/\$\$[^$]*\/[^$]*\$\$/.test(explanationText), message: "Use MathJax fractions, powers, roots and division." },
    { name: "Indian editorial", passed: !/[£€¥]/.test(learnerText), message: "Indian exam content must not use foreign currency." },
    { name: "control characters", passed: !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(learnerText), message: "Learner text must not contain hidden control characters." },
    { name: "lifecycle lock", passed: question.permanentQlId === null && !question.publiclyPublishable && !question.questionStudioDiscoverable, message: "Wave prototypes must remain unallocated and unpublished." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp008Wave01Prototype(
  prototypeId: MenCp008Wave01PrototypeId,
  seed: string,
): MenCp008Wave01Package {
  const draft = generateDraft(prototypeId, seed);
  const verification = verifyDraft(draft);
  const { options, traps } = buildOptions(draft, createSeededRandom(`${prototypeId}:${seed}:options`));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const partial = {
    packageId: "MEN-002" as const,
    canonicalProblemId: "MEN-CP-008" as const,
    permanentQlId: null,
    waveId: "MEN-CP-008-GAP-WAVE-01" as const,
    prototypeId,
    solveMode: draft.state.solveMode,
    language: "en" as const,
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
    verification,
    reviewStatus: "UNREVIEWED" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
  };
  return { ...partial, validation: validatePackage(partial) };
}
