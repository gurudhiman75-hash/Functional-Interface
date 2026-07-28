import {
  exactEquals,
  exactFromSquaredLength,
  exactKey,
  formatExactMath,
  formatWithUnit,
  integerSquareRoot,
  isPositive,
  pi,
  piSurd,
  rational,
  surd,
} from "../foundation/exact";
import { createSeededRandom, type SeededRandom } from "../foundation/seed";
import type { ExactRational, ExactValue, Men002Difficulty, Men002Unit } from "../foundation/types";
import { getMenCp008Definition } from "./registry";
import type {
  MenCp008Option,
  MenCp008Package,
  MenCp008PiPolicy,
  MenCp008PrototypeId,
  MenCp008State,
} from "./types";

interface WrongAnswer {
  value: ExactValue;
  misconceptionId: string;
  explanation: string;
}

interface Draft {
  state: MenCp008State;
  stem: string;
  answer: ExactValue;
  wrongAnswers: [WrongAnswer, WrongAnswer, WrongAnswer];
  keyRule: string;
  steps: MenCp008Package["explanation"]["steps"];
  shortcut: string;
}

const CYLINDER_STATES = [
  { radius: 8n, height: 11n },
  { radius: 4n, height: 9n },
  { radius: 5n, height: 12n },
  { radius: 6n, height: 10n },
  { radius: 7n, height: 15n },
] as const;

const CYLINDER_TSA_STATES = [
  { radius: 3n, height: 7n },
  { radius: 4n, height: 8n },
  { radius: 5n, height: 10n },
  { radius: 6n, height: 11n },
  { radius: 7n, height: 14n },
] as const;

const CAPACITY_STATES = [
  { radius: 7n, height: 10n },
  { radius: 7n, height: 20n },
  { radius: 14n, height: 10n },
  { radius: 14n, height: 25n },
  { radius: 21n, height: 20n },
] as const;

const ROLLER_STATES = [
  { radius: 7n, length: 4n, revolutions: 15n },
  { radius: 7n, length: 5n, revolutions: 20n },
  { radius: 14n, length: 3n, revolutions: 25n },
  { radius: 14n, length: 6n, revolutions: 12n },
  { radius: 21n, length: 4n, revolutions: 18n },
] as const;

const CONE_VOLUME_STATES = [
  { radius: 3n, height: 12n },
  { radius: 4n, height: 15n },
  { radius: 5n, height: 18n },
  { radius: 6n, height: 21n },
  { radius: 7n, height: 24n },
] as const;

const CONE_SURD_STATES = [
  { radius: 3n, height: 5n },
  { radius: 4n, height: 7n },
  { radius: 5n, height: 8n },
  { radius: 6n, height: 11n },
  { radius: 7n, height: 12n },
] as const;

const CONE_TRIPLE_STATES = [
  { radius: 3n, height: 4n, slant: 5n },
  { radius: 5n, height: 12n, slant: 13n },
  { radius: 8n, height: 15n, slant: 17n },
  { radius: 7n, height: 24n, slant: 25n },
  { radius: 20n, height: 21n, slant: 29n },
] as const;

const CANVAS_STATES = [
  { radius: 3n, height: 4n, slant: 5n, rate: 50n },
  { radius: 5n, height: 12n, slant: 13n, rate: 50n },
  { radius: 8n, height: 15n, slant: 17n, rate: 50n },
  { radius: 7n, height: 24n, slant: 25n, rate: 50n },
  { radius: 20n, height: 21n, slant: 29n, rate: 50n },
] as const;

const RATIO_STATES = [
  { cylinderRadius: 3n, cylinderHeight: 8n, coneRadius: 3n, coneHeight: 12n },
  { cylinderRadius: 4n, cylinderHeight: 9n, coneRadius: 3n, coneHeight: 16n },
  { cylinderRadius: 5n, cylinderHeight: 12n, coneRadius: 5n, coneHeight: 18n },
  { cylinderRadius: 6n, cylinderHeight: 10n, coneRadius: 4n, coneHeight: 15n },
  { cylinderRadius: 7n, cylinderHeight: 15n, coneRadius: 5n, coneHeight: 21n },
] as const;

function q(numerator: bigint | number, denominator: bigint | number = 1) {
  return rational(numerator, denominator);
}

function requireRational(value: ExactValue): ExactRational {
  if (value.kind !== "RATIONAL") throw new Error("Expected a rational value.");
  return value;
}

function asInteger(value: ExactValue) {
  const exact = requireRational(value);
  if (exact.denominator !== 1n) throw new Error("Expected an integer value.");
  return exact.numerator;
}

function multiplyRational(a: ExactRational, b: ExactRational) {
  return q(a.numerator * b.numerator, a.denominator * b.denominator);
}

function piPolicyValue(policy: MenCp008PiPolicy) {
  switch (policy) {
    case "EXACT_PI": return null;
    case "PI_22_OVER_7": return q(22n, 7n);
    case "PI_3_14": return q(157n, 50n);
  }
}

function applyPiPolicy(coefficient: ExactRational, policy: MenCp008PiPolicy): ExactValue {
  const substitute = piPolicyValue(policy);
  return substitute === null
    ? pi(coefficient.numerator, coefficient.denominator)
    : multiplyRational(coefficient, substitute);
}

function applyPiSurdPolicy(coefficient: ExactRational, radicand: bigint, policy: MenCp008PiPolicy): ExactValue {
  const substitute = piPolicyValue(policy);
  if (substitute === null) return piSurd(coefficient.numerator, radicand, coefficient.denominator);
  const scaled = multiplyRational(coefficient, substitute);
  return surd(scaled.numerator, radicand, scaled.denominator);
}

function policyInstruction(policy: MenCp008PiPolicy) {
  switch (policy) {
    case "EXACT_PI": return "Leave the answer in exact terms of $\\pi$.";
    case "PI_22_OVER_7": return "Use $\\pi=\\frac{22}{7}$.";
    case "PI_3_14": return "Use $\\pi=3.14$.";
  }
}

function dimension(value: bigint, unit: "cm" | "m" = "cm") {
  return `$${value}\\text{ ${unit}}$`;
}

function formatRatio(value: ExactValue) {
  const ratio = requireRational(value);
  return `$${ratio.numerator}:${ratio.denominator}$`;
}

function makeState(
  prototypeId: MenCp008PrototypeId,
  seed: string,
  policy: MenCp008PiPolicy,
  unit: Men002Unit,
  displayMode: "UNIT" | "RATIO",
  dimensions: Record<string, bigint>,
  derived: Record<string, ExactValue>,
): MenCp008State {
  const definition = getMenCp008Definition(prototypeId);
  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-008",
    permanentQlId: null,
    prototypeId,
    solveMode: definition.solveMode,
    target: definition.target,
    shape: definition.shape,
    seed,
    difficulty: "Easy",
    piPolicy: policy,
    dimensions,
    derived,
    unit,
    displayMode,
  };
}

function cylinderVolumeDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CYLINDER_STATES);
  const coefficient = q(radius ** 2n * height);
  const answer = applyPiPolicy(coefficient, "EXACT_PI");
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm³", "UNIT", { radius, height }, { coefficient, answer }),
    stem: `A solid cylinder has radius ${dimension(radius)} and height ${dimension(height)}. Find its volume. Leave the answer in terms of $\\pi$.`,
    answer,
    wrongAnswers: [
      { value: applyPiPolicy(q(2n * radius ** 2n), "EXACT_PI"), misconceptionId: "COUNTED_TWO_BASES", explanation: "counting the two circular bases instead of measuring the cylinder volume" },
      { value: applyPiPolicy(q(radius * height), "EXACT_PI"), misconceptionId: "DID_NOT_SQUARE_RADIUS", explanation: "multiplying radius by height without squaring the circular radius" },
      { value: applyPiPolicy(q(radius ** 2n * height, 3n), "EXACT_PI"), misconceptionId: "USED_CONE_FACTOR", explanation: "introducing the cone factor $\\frac13$ into a cylinder" },
    ],
    keyRule: "A cylinder is a circular base extended through a constant height, so $V=\\pi r^2h$.",
    steps: [
      { title: "Find the Circular Base Factor", body: "Square the radius before multiplying by the height.", equation: `$$r^2h=${radius}^2\\times${height}=${coefficient.numerator}$$` },
      { title: "Attach the Exact Pi Factor", body: "The circular base contributes $\\pi$.", equation: `$$V=${coefficient.numerator}\\pi\\text{ cm}^{3}$$` },
    ],
    shortcut: `Use $r^2h$ as the coefficient of $\\pi$.`,
  };
}

function cylinderCsaDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CYLINDER_STATES);
  const coefficient = q(2n * radius * height);
  const answer = applyPiPolicy(coefficient, "EXACT_PI");
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm²", "UNIT", { radius, height }, { coefficient, answer }),
    stem: `A cylinder has radius ${dimension(radius)} and height ${dimension(height)}. Find its curved surface area in exact terms of $\\pi$.`,
    answer,
    wrongAnswers: [
      { value: applyPiPolicy(q(radius ** 2n * height), "EXACT_PI"), misconceptionId: "USED_VOLUME", explanation: "using $\\pi r^2h$, which measures volume" },
      { value: applyPiPolicy(q(radius * height), "EXACT_PI"), misconceptionId: "OMITTED_CIRCUMFERENCE_TWO", explanation: "using $\\pi rh$ and omitting the factor $2$ from the base circumference" },
      { value: applyPiPolicy(q(2n * radius * (height + radius)), "EXACT_PI"), misconceptionId: "USED_TSA", explanation: "adding both circular bases although only the curved surface is requested" },
    ],
    keyRule: "Unroll the curved surface into a rectangle: width $2\\pi r$ and height $h$. Therefore $CSA=2\\pi rh$.",
    steps: [
      { title: "Use the Base Circumference", body: "The curved rectangle wraps once around the circular base.", equation: `$$2rh=2\\times${radius}\\times${height}=${coefficient.numerator}$$` },
      { title: "Keep Pi Exact", body: "Attach $\\pi$ to the coefficient.", equation: `$$CSA=${coefficient.numerator}\\pi\\text{ cm}^{2}$$` },
    ],
    shortcut: `Curved area equals circumference × height.`,
  };
}

function cylinderTsaDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CYLINDER_TSA_STATES);
  const coefficient = q(2n * radius * (height + radius));
  const answer = applyPiPolicy(coefficient, "EXACT_PI");
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm²", "UNIT", { radius, height }, { coefficient, answer }),
    stem: `A closed cylinder has radius ${dimension(radius)} and height ${dimension(height)}. Find its total surface area in exact terms of $\\pi$.`,
    answer,
    wrongAnswers: [
      { value: applyPiPolicy(q(2n * radius * height), "EXACT_PI"), misconceptionId: "OMITTED_BOTH_BASES", explanation: "finding only the curved surface and omitting both circular ends" },
      { value: applyPiPolicy(q(2n * radius * height + radius ** 2n), "EXACT_PI"), misconceptionId: "ADDED_ONE_BASE", explanation: "adding only one circular base to the curved surface" },
      { value: applyPiPolicy(q(radius ** 2n * height), "EXACT_PI"), misconceptionId: "USED_VOLUME", explanation: "using the volume formula instead of adding surface regions" },
    ],
    keyRule: "A closed cylinder has curved area $2\\pi rh$ plus two circular bases $2\\pi r^2$, so $TSA=2\\pi r(h+r)$.",
    steps: [
      { title: "Combine Curved and Circular Factors", body: "Factor out $2\\pi r$ from the curved surface and two bases.", equation: `$$2r(h+r)=2\\times${radius}(${height}+${radius})=${coefficient.numerator}$$` },
      { title: "Write the Exact Total Area", body: "Keep the common $\\pi$ factor.", equation: `$$TSA=${coefficient.numerator}\\pi\\text{ cm}^{2}$$` },
    ],
    shortcut: `For a closed cylinder, use $2\\pi r(h+r)$ directly.`,
  };
}

function cylinderRadiusFromVolumeDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CYLINDER_STATES);
  const volumeCoefficient = radius ** 2n * height;
  const evidence = pi(volumeCoefficient);
  const answer = q(radius);
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm", "UNIT", { radius, height, volumeCoefficient }, { evidence, answer }),
    stem: `A cylinder has volume $${volumeCoefficient}\\pi\\text{ cm}^{3}$ and height ${dimension(height)}. Find its radius.`,
    answer,
    wrongAnswers: [
      { value: q(radius ** 2n), misconceptionId: "STOPPED_AT_RADIUS_SQUARED", explanation: "dividing by height but reporting $r^2$ instead of taking its square root" },
      { value: q(volumeCoefficient, height ** 2n), misconceptionId: "SQUARED_HEIGHT", explanation: "dividing by $h^2$ even though the volume contains only one height factor" },
      { value: q(volumeCoefficient, 2n * height), misconceptionId: "USED_CURVED_AREA_DIVISOR", explanation: "dividing by $2h$ as though the evidence came from curved surface area" },
    ],
    keyRule: "From $V=\\pi r^2h$, cancel $\\pi$, divide by $h$, then take the positive square root.",
    steps: [
      { title: "Cancel Pi and Divide by Height", body: "The exact $\\pi$ factor appears on both sides.", equation: `$$r^2=\\frac{${volumeCoefficient}}{${height}}=${radius ** 2n}$$` },
      { title: "Recover the Radius", body: "Take the positive square root.", equation: `$$r=\\sqrt{${radius ** 2n}}=${radius}\\text{ cm}$$` },
    ],
    shortcut: `Read the coefficient of $\\pi$, divide by height, then square-root it.`,
  };
}

function cylinderHeightFromVolumeDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CYLINDER_STATES);
  const volumeCoefficient = radius ** 2n * height;
  const answer = q(height);
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm", "UNIT", { radius, height, volumeCoefficient }, { evidence: pi(volumeCoefficient), answer }),
    stem: `A cylinder has volume $${volumeCoefficient}\\pi\\text{ cm}^{3}$ and radius ${dimension(radius)}. Find its height.`,
    answer,
    wrongAnswers: [
      { value: q(volumeCoefficient, radius), misconceptionId: "DIVIDED_BY_RADIUS", explanation: "dividing by $r$ instead of the base factor $r^2$" },
      { value: q(volumeCoefficient, 2n * radius ** 2n), misconceptionId: "EXTRA_FACTOR_TWO", explanation: "introducing the curved-area factor $2$ into the volume inverse" },
      { value: q(radius ** 2n), misconceptionId: "REPORTED_BASE_FACTOR", explanation: "reporting the squared radius rather than dividing the volume coefficient by it" },
    ],
    keyRule: "From $V=\\pi r^2h$, cancel $\\pi$ and divide the remaining coefficient by $r^2$.",
    steps: [
      { title: "Cancel the Common Pi Factor", body: "Work with the exact coefficient of $\\pi$.", equation: `$$${volumeCoefficient}=r^2h$$` },
      { title: "Divide by the Squared Radius", body: "The base area coefficient is $r^2$.", equation: `$$h=\\frac{${volumeCoefficient}}{${radius}^2}=${height}\\text{ cm}$$` },
    ],
    shortcut: `Height equals the $\\pi$ coefficient divided by $r^2$.`,
  };
}

function cylinderRadiusFromCsaDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CYLINDER_STATES);
  const csaCoefficient = 2n * radius * height;
  const answer = q(radius);
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm", "UNIT", { radius, height, csaCoefficient }, { evidence: pi(csaCoefficient), answer }),
    stem: `A cylinder has curved surface area $${csaCoefficient}\\pi\\text{ cm}^{2}$ and height ${dimension(height)}. Find its radius.`,
    answer,
    wrongAnswers: [
      { value: q(2n * radius), misconceptionId: "OMITTED_FACTOR_TWO_IN_DIVISOR", explanation: "dividing by height but forgetting the factor $2$ in $2\\pi rh$" },
      { value: q(csaCoefficient, 2n), misconceptionId: "DIVIDED_BY_TWO_ONLY", explanation: "halving the coefficient but not dividing by the height" },
      { value: q(csaCoefficient, 4n * height), misconceptionId: "DIVIDED_BY_FOUR_HEIGHTS", explanation: "dividing by $4h$ instead of the required $2h$" },
    ],
    keyRule: "From $CSA=2\\pi rh$, cancel $\\pi$ and divide by $2h$.",
    steps: [
      { title: "Remove Pi from Both Sides", body: "The remaining coefficient equals $2rh$.", equation: `$$${csaCoefficient}=2r\\times${height}$$` },
      { title: "Divide by Twice the Height", body: "This isolates one radius.", equation: `$$r=\\frac{${csaCoefficient}}{2\\times${height}}=${radius}\\text{ cm}$$` },
    ],
    shortcut: `Radius equals the CSA coefficient divided by $2h$.`,
  };
}

function cylinderHeightFromCsaDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CYLINDER_STATES);
  const csaCoefficient = 2n * radius * height;
  const answer = q(height);
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm", "UNIT", { radius, height, csaCoefficient }, { evidence: pi(csaCoefficient), answer }),
    stem: `A cylinder has curved surface area $${csaCoefficient}\\pi\\text{ cm}^{2}$ and radius ${dimension(radius)}. Find its height.`,
    answer,
    wrongAnswers: [
      { value: q(2n * height), misconceptionId: "OMITTED_FACTOR_TWO_IN_DIVISOR", explanation: "dividing by the radius but forgetting the factor $2$" },
      { value: q(csaCoefficient, 2n), misconceptionId: "DIVIDED_BY_TWO_ONLY", explanation: "halving the coefficient but not dividing by the radius" },
      { value: q(csaCoefficient, 4n * radius), misconceptionId: "DIVIDED_BY_FOUR_RADII", explanation: "dividing by $4r$ instead of the required $2r$" },
    ],
    keyRule: "From $CSA=2\\pi rh$, cancel $\\pi$ and divide by $2r$.",
    steps: [
      { title: "Use the Curved-Area Coefficient", body: "After cancelling $\\pi$, the coefficient is $2rh$.", equation: `$$${csaCoefficient}=2\\times${radius}\\times h$$` },
      { title: "Divide by Twice the Radius", body: "This leaves the cylinder height.", equation: `$$h=\\frac{${csaCoefficient}}{2\\times${radius}}=${height}\\text{ cm}$$` },
    ],
    shortcut: `Height equals the CSA coefficient divided by $2r$.`,
  };
}

function cylinderRadiusFromTsaDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CYLINDER_TSA_STATES);
  const tsaCoefficient = 2n * radius * (height + radius);
  const answer = q(radius);
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm", "UNIT", { radius, height, tsaCoefficient }, { evidence: pi(tsaCoefficient), answer }),
    stem: `A closed cylinder has total surface area $${tsaCoefficient}\\pi\\text{ cm}^{2}$ and height ${dimension(height)}. Find its radius.`,
    answer,
    wrongAnswers: [
      { value: q(tsaCoefficient, 2n * height), misconceptionId: "USED_CSA_INVERSE", explanation: "treating the total area as curved area and dividing by $2h$" },
      { value: q(2n * radius), misconceptionId: "REPORTED_DIAMETER", explanation: "selecting twice the radius after solving the surface relation" },
      { value: q(radius + height), misconceptionId: "REPORTED_RADIUS_PLUS_HEIGHT", explanation: "reporting the bracket $r+h$ instead of the radius" },
    ],
    keyRule: "Use $TSA=2\\pi r(h+r)$. After cancelling $\\pi$, test the positive radius that reconstructs the full coefficient.",
    steps: [
      { title: "Write the Exact Coefficient Equation", body: "The radius appears both outside and inside the bracket.", equation: `$$2r(${height}+r)=${tsaCoefficient}$$` },
      { title: "Verify the Positive Radius", body: "Substitute the generated positive candidate.", equation: `$$2\\times${radius}(${height}+${radius})=${tsaCoefficient}$$` },
    ],
    shortcut: `Factor $2r$ and test positive factors of the TSA coefficient.`,
  };
}

function cylinderCapacityDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CAPACITY_STATES);
  const cubicCentimetres = multiplyRational(q(radius ** 2n * height), q(22n, 7n));
  const answer = q(cubicCentimetres.numerator, cubicCentimetres.denominator * 1000n);
  return {
    state: makeState(prototypeId, seed, "PI_22_OVER_7", "litres", "UNIT", { radius, height }, { cubicCentimetres, answer }),
    stem: `A cylindrical vessel has internal radius ${dimension(radius)} and height ${dimension(height)}. Find its capacity in litres. Use $\\pi=\\frac{22}{7}$.`,
    answer,
    wrongAnswers: [
      { value: cubicCentimetres, misconceptionId: "DID_NOT_CONVERT_TO_LITRES", explanation: "reporting the cubic-centimetre volume without dividing by $1000$" },
      { value: q(cubicCentimetres.numerator, cubicCentimetres.denominator * 100n), misconceptionId: "DIVIDED_BY_ONE_HUNDRED", explanation: "using a linear conversion factor instead of $1000\\text{ cm}^{3}=1$ litre" },
      { value: q(2n * radius * height * 22n, 7n * 1000n), misconceptionId: "USED_CURVED_AREA", explanation: "using $2\\pi rh$ instead of the cylindrical volume" },
    ],
    keyRule: "Find the internal volume with $V=\\pi r^2h$, using the declared $\\frac{22}{7}$ value, then divide cubic centimetres by $1000$ to obtain litres.",
    steps: [
      { title: "Find the Exact Cubic-Centimetre Volume", body: "Apply the declared rational value of $\\pi$.", equation: `$$V=\\frac{22}{7}\\times${radius}^2\\times${height}=${formatExactMath(cubicCentimetres)}\\text{ cm}^{3}$$` },
      { title: "Convert to Litres", body: "$1000\\text{ cm}^{3}=1$ litre.", equation: `$$Capacity=\\frac{${formatExactMath(cubicCentimetres)}}{1000}=${formatExactMath(answer)}\\text{ litres}$$` },
    ],
    shortcut: `Cancel factors before multiplying, then divide the final cubic-centimetre value by $1000$.`,
  };
}

function rollerRevolutionsDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, length, revolutions } = rng.pick(ROLLER_STATES);
  const oneRevolutionArea = multiplyRational(q(2n * radius * length), q(22n, 7n));
  const sweptArea = q(oneRevolutionArea.numerator * revolutions, oneRevolutionArea.denominator);
  const answer = q(revolutions);
  return {
    state: makeState(prototypeId, seed, "PI_22_OVER_7", "revolutions", "UNIT", { radius, length, revolutions }, { oneRevolutionArea, sweptArea, answer }),
    stem: `A cylindrical road roller has radius ${dimension(radius, "m")} and length ${dimension(length, "m")}. It covers ${formatWithUnit(sweptArea, "m²")} without overlap. How many revolutions does it make? Use $\\pi=\\frac{22}{7}$.`,
    answer,
    wrongAnswers: [
      { value: q(revolutions * 2n), misconceptionId: "USED_HALF_CIRCUMFERENCE", explanation: "using half the roller circumference for one revolution" },
      { value: q(revolutions * length), misconceptionId: "OMITTED_ROLLER_LENGTH", explanation: "dividing only by circumference and not by the roller length" },
      { value: q(revolutions * radius), misconceptionId: "OMITTED_RADIUS_IN_AREA", explanation: "using an incomplete one-revolution swept-area factor" },
    ],
    keyRule: "One revolution covers a rectangle whose length is the roller circumference $2\\pi r$ and whose width is the roller length. Revolutions equal total swept area divided by one-revolution area.",
    steps: [
      { title: "Find the Area Covered in One Revolution", body: "Multiply circumference by roller length.", equation: `$$A_1=2\\times\\frac{22}{7}\\times${radius}\\times${length}=${formatExactMath(oneRevolutionArea)}\\text{ m}^{2}$$` },
      { title: "Divide the Total Swept Area", body: "No overlap means each revolution contributes the same area once.", equation: `$$N=\\frac{${formatExactMath(sweptArea)}}{${formatExactMath(oneRevolutionArea)}}=${revolutions}$$` },
    ],
    shortcut: `Revolutions equal swept area divided by circumference × roller length.`,
  };
}

function coneVolumeDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CONE_VOLUME_STATES);
  const coefficient = q(radius ** 2n * height, 3n);
  const answer = applyPiPolicy(coefficient, "EXACT_PI");
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm³", "UNIT", { radius, height }, { coefficient, answer }),
    stem: `A cone has radius ${dimension(radius)} and perpendicular height ${dimension(height)}. Find its volume in exact terms of $\\pi$.`,
    answer,
    wrongAnswers: [
      { value: applyPiPolicy(q(radius ** 2n * height), "EXACT_PI"), misconceptionId: "OMITTED_ONE_THIRD", explanation: "using the cylinder volume with the same base and height" },
      { value: applyPiPolicy(q(radius * height, 3n), "EXACT_PI"), misconceptionId: "DID_NOT_SQUARE_RADIUS", explanation: "using the radius only once in the circular base" },
      { value: applyPiPolicy(q(2n * radius ** 2n), "EXACT_PI"), misconceptionId: "COUNTED_TWO_BASES", explanation: "using the area of two circular bases instead of cone volume" },
    ],
    keyRule: "A cone occupies one third of the cylinder with the same circular base and height, so $V=\\frac13\\pi r^2h$.",
    steps: [
      { title: "Build the Cone Volume Coefficient", body: "Square the radius, multiply by height and divide by three.", equation: `$$\\frac{r^2h}{3}=\\frac{${radius}^2\\times${height}}{3}=${formatExactMath(coefficient)}$$` },
      { title: "Attach Pi", body: "Keep the circular factor exact.", equation: `$$V=${formatExactMath(answer)}\\text{ cm}^{3}$$` },
    ],
    shortcut: `Find the matching cylinder volume coefficient and divide it by $3$.`,
  };
}

function coneCsaDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CONE_SURD_STATES);
  const slantSquared = radius ** 2n + height ** 2n;
  const slant = exactFromSquaredLength(slantSquared);
  const answer = slant.kind === "RATIONAL"
    ? applyPiPolicy(q(radius * slant.numerator, slant.denominator), "EXACT_PI")
    : applyPiSurdPolicy(q(radius * slant.coefficient.numerator, slant.coefficient.denominator), slant.radicand, "EXACT_PI");
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm²", "UNIT", { radius, height, slantSquared }, { slant, answer }),
    stem: `A right cone has radius ${dimension(radius)} and perpendicular height ${dimension(height)}. Find its curved surface area in exact form.`,
    answer,
    wrongAnswers: [
      { value: applyPiPolicy(q(radius * height), "EXACT_PI"), misconceptionId: "USED_HEIGHT_INSTEAD_OF_SLANT", explanation: "using the perpendicular height in $\\pi rl$ without first finding the slant height" },
      { value: applyPiPolicy(q(radius ** 2n), "EXACT_PI"), misconceptionId: "USED_BASE_AREA", explanation: "reporting the circular base area instead of the curved canvas area" },
      { value: applyPiPolicy(q(radius ** 2n * height, 3n), "EXACT_PI"), misconceptionId: "USED_VOLUME", explanation: "using cone volume rather than curved surface area" },
    ],
    keyRule: "A cone's curved area is $CSA=\\pi rl$. When slant height is not supplied, first use $l=\\sqrt{r^2+h^2}$.",
    steps: [
      { title: "Find the Slant Height", body: "Radius and perpendicular height form a right triangle with the slant height.", equation: `$$l=\\sqrt{${radius}^2+${height}^2}=${formatExactMath(slant)}\\text{ cm}$$` },
      { title: "Use the Curved-Area Formula", body: "Multiply $\\pi$, radius and exact slant height.", equation: `$$CSA=${formatExactMath(answer)}\\text{ cm}^{2}$$` },
    ],
    shortcut: `Keep the slant-height surd exact before multiplying by $\\pi r$.`,
  };
}

function coneTsaDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height, slant } = rng.pick(CONE_TRIPLE_STATES);
  const coefficient = q(radius * (slant + radius));
  const answer = applyPiPolicy(coefficient, "EXACT_PI");
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm²", "UNIT", { radius, height, slant }, { coefficient, answer }),
    stem: `A closed cone has radius ${dimension(radius)} and slant height ${dimension(slant)}. Find its total surface area in exact terms of $\\pi$.`,
    answer,
    wrongAnswers: [
      { value: applyPiPolicy(q(radius * slant), "EXACT_PI"), misconceptionId: "OMITTED_BASE", explanation: "finding only the curved surface and omitting the circular base" },
      { value: applyPiPolicy(q(radius ** 2n), "EXACT_PI"), misconceptionId: "BASE_ONLY", explanation: "reporting only the circular base area" },
      { value: applyPiPolicy(q(radius * (height + radius)), "EXACT_PI"), misconceptionId: "USED_HEIGHT_INSTEAD_OF_SLANT", explanation: "using the perpendicular height in the curved-area term" },
    ],
    keyRule: "A closed cone has curved area $\\pi rl$ plus base area $\\pi r^2$, so $TSA=\\pi r(l+r)$.",
    steps: [
      { title: "Combine Curved Surface and Base", body: "Factor out the common $\\pi r$.", equation: `$$r(l+r)=${radius}(${slant}+${radius})=${coefficient.numerator}$$` },
      { title: "Write the Exact Total Area", body: "Attach the $\\pi$ factor.", equation: `$$TSA=${coefficient.numerator}\\pi\\text{ cm}^{2}$$` },
    ],
    shortcut: `For a closed cone, use $\\pi r(l+r)$.`,
  };
}

function coneSlantDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CONE_SURD_STATES);
  const slantSquared = radius ** 2n + height ** 2n;
  const answer = exactFromSquaredLength(slantSquared);
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm", "UNIT", { radius, height, slantSquared }, { answer }),
    stem: `A right cone has radius ${dimension(radius)} and perpendicular height ${dimension(height)}. Find its slant height.`,
    answer,
    wrongAnswers: [
      { value: q(radius + height), misconceptionId: "ADDED_LENGTHS", explanation: "adding the two perpendicular legs instead of combining their squares" },
      { value: q(height - radius > 0n ? height - radius : radius - height), misconceptionId: "SUBTRACTED_LENGTHS", explanation: "subtracting the radius from the height rather than applying Pythagoras" },
      { value: q(slantSquared), misconceptionId: "STOPPED_AT_SLANT_SQUARED", explanation: "finding $l^2$ but not taking its square root" },
    ],
    keyRule: "Radius, height and slant height form a right triangle, so $l=\\sqrt{r^2+h^2}$.",
    steps: [
      { title: "Add the Squared Legs", body: "The radius and perpendicular height meet at a right angle.", equation: `$$l^2=${radius}^2+${height}^2=${slantSquared}$$` },
      { title: "Take the Exact Square Root", body: "Keep a non-perfect square as a simplified surd.", equation: `$$l=${formatExactMath(answer)}\\text{ cm}$$` },
    ],
    shortcut: `Use the cone's axial right triangle.`,
  };
}

function coneHeightFromSlantDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height, slant } = rng.pick(CONE_TRIPLE_STATES);
  const answer = q(height);
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm", "UNIT", { radius, height, slant }, { answer }),
    stem: `A right cone has radius ${dimension(radius)} and slant height ${dimension(slant)}. Find its perpendicular height.`,
    answer,
    wrongAnswers: [
      { value: q(slant - radius), misconceptionId: "SUBTRACTED_LENGTHS", explanation: "subtracting the radius directly from the slant height instead of subtracting squares" },
      { value: q(slant + radius), misconceptionId: "ADDED_LENGTHS", explanation: "adding the two lengths although the slant height is the hypotenuse" },
      { value: exactFromSquaredLength(slant ** 2n + radius ** 2n), misconceptionId: "ADDED_SQUARES_IN_INVERSE", explanation: "adding $l^2+r^2$ instead of using $h^2=l^2-r^2$" },
    ],
    keyRule: "From $l^2=r^2+h^2$, isolate the height: $h=\\sqrt{l^2-r^2}$.",
    steps: [
      { title: "Subtract the Squared Radius", body: "The slant height is the hypotenuse.", equation: `$$h^2=${slant}^2-${radius}^2=${height ** 2n}$$` },
      { title: "Take the Positive Root", body: "Perpendicular height is positive.", equation: `$$h=${height}\\text{ cm}$$` },
    ],
    shortcut: `Recognise the Pythagorean triplet when present.`,
  };
}

function coneRadiusFromSlantDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height, slant } = rng.pick(CONE_TRIPLE_STATES);
  const answer = q(radius);
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm", "UNIT", { radius, height, slant }, { answer }),
    stem: `A right cone has perpendicular height ${dimension(height)} and slant height ${dimension(slant)}. Find its radius.`,
    answer,
    wrongAnswers: [
      { value: q(slant - height), misconceptionId: "SUBTRACTED_LENGTHS", explanation: "subtracting the height directly from the slant height instead of subtracting squares" },
      { value: q(slant + height), misconceptionId: "ADDED_LENGTHS", explanation: "adding the height and slant height rather than using the right triangle" },
      { value: exactFromSquaredLength(slant ** 2n + height ** 2n), misconceptionId: "ADDED_SQUARES_IN_INVERSE", explanation: "adding $l^2+h^2$ instead of using $r^2=l^2-h^2$" },
    ],
    keyRule: "From $l^2=r^2+h^2$, isolate the radius: $r=\\sqrt{l^2-h^2}$.",
    steps: [
      { title: "Subtract the Squared Height", body: "The slant height is the hypotenuse.", equation: `$$r^2=${slant}^2-${height}^2=${radius ** 2n}$$` },
      { title: "Take the Positive Root", body: "Radius is a positive length.", equation: `$$r=${radius}\\text{ cm}$$` },
    ],
    shortcut: `Use the missing leg of the cone's axial right triangle.`,
  };
}

function coneHeightFromVolumeDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CONE_VOLUME_STATES);
  const volumeCoefficient = q(radius ** 2n * height, 3n);
  const answer = q(height);
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm", "UNIT", { radius, height }, { evidence: pi(volumeCoefficient.numerator, volumeCoefficient.denominator), answer }),
    stem: `A cone has volume $${formatExactMath(pi(volumeCoefficient.numerator, volumeCoefficient.denominator))}\\text{ cm}^{3}$ and radius ${dimension(radius)}. Find its perpendicular height.`,
    answer,
    wrongAnswers: [
      { value: q(height, 3n), misconceptionId: "DIVIDED_BY_THREE_AGAIN", explanation: "keeping the cone's $\\frac13$ factor in the denominator instead of multiplying the volume coefficient by $3$" },
      { value: q(3n * height), misconceptionId: "MULTIPLIED_BY_THREE_TWICE", explanation: "applying the factor $3$ twice while isolating the height" },
      { value: q(volumeCoefficient.numerator, 2n * radius ** 2n * volumeCoefficient.denominator), misconceptionId: "ADDED_EXTRA_FACTOR_TWO", explanation: "dividing by an extra factor $2$ after already accounting for the cone coefficient" },
    ],
    keyRule: "From $V=\\frac13\\pi r^2h$, cancel $\\pi$ and use $h=\\frac{3V_{coefficient}}{r^2}$.",
    steps: [
      { title: "Restore the Full Base-Height Product", body: "Multiply the coefficient of $\\pi$ by $3$.", equation: `$$r^2h=3\\times${formatExactMath(volumeCoefficient)}=${radius ** 2n * height}$$` },
      { title: "Divide by the Squared Radius", body: "This isolates the perpendicular height.", equation: `$$h=\\frac{${radius ** 2n * height}}{${radius}^2}=${height}\\text{ cm}$$` },
    ],
    shortcut: `Multiply the $\\pi$ coefficient by $3$, then divide by $r^2$.`,
  };
}

function coneRadiusFromVolumeDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CONE_VOLUME_STATES);
  const volumeCoefficient = q(radius ** 2n * height, 3n);
  const answer = q(radius);
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "cm", "UNIT", { radius, height }, { evidence: pi(volumeCoefficient.numerator, volumeCoefficient.denominator), answer }),
    stem: `A cone has volume $${formatExactMath(pi(volumeCoefficient.numerator, volumeCoefficient.denominator))}\\text{ cm}^{3}$ and perpendicular height ${dimension(height)}. Find its radius.`,
    answer,
    wrongAnswers: [
      { value: q(radius ** 2n), misconceptionId: "STOPPED_AT_RADIUS_SQUARED", explanation: "isolating $r^2$ but not taking the square root" },
      { value: q(radius, 3n), misconceptionId: "DIVIDED_RADIUS_BY_THREE", explanation: "dividing the recovered radius by $3$ rather than applying the cone factor to the volume coefficient" },
      { value: q(3n * radius), misconceptionId: "MULTIPLIED_RADIUS_BY_THREE", explanation: "multiplying the final radius by the cone factor instead of applying it before the square root" },
    ],
    keyRule: "From $V=\\frac13\\pi r^2h$, use $r=\\sqrt{\\frac{3V_{coefficient}}{h}}$.",
    steps: [
      { title: "Recover the Squared Radius", body: "Multiply the $\\pi$ coefficient by $3$ and divide by height.", equation: `$$r^2=\\frac{3\\times${formatExactMath(volumeCoefficient)}}{${height}}=${radius ** 2n}$$` },
      { title: "Take the Positive Square Root", body: "This gives the cone radius.", equation: `$$r=${radius}\\text{ cm}$$` },
    ],
    shortcut: `Apply the factor $3$ before taking the square root.`,
  };
}

function coneCanvasCostDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height, slant, rate } = rng.pick(CANVAS_STATES);
  const area = applyPiPolicy(q(radius * slant), "PI_3_14");
  const areaRational = requireRational(area);
  const cost = q(areaRational.numerator * rate, areaRational.denominator);
  const baseCostValue = requireRational(applyPiPolicy(q(radius ** 2n), "PI_3_14"));
  const totalAreaValue = requireRational(applyPiPolicy(q(radius * (slant + radius)), "PI_3_14"));
  const volumeValue = requireRational(applyPiPolicy(q(radius ** 2n * height, 3n), "PI_3_14"));
  const answer = cost;
  return {
    state: makeState(prototypeId, seed, "PI_3_14", "£", "UNIT", { radius, height, slant, rate }, { area, answer }),
    stem: `A conical tent has radius ${dimension(radius, "m")} and slant height ${dimension(slant, "m")}. Canvas costs $\\text{£}${rate}$ per square metre. Find the cost of the curved canvas only. Use $\\pi=3.14$.`,
    answer,
    wrongAnswers: [
      { value: q(baseCostValue.numerator * rate, baseCostValue.denominator), misconceptionId: "PRICED_BASE_ONLY", explanation: "pricing the circular base even though the tent canvas is the curved surface" },
      { value: q(totalAreaValue.numerator * rate, totalAreaValue.denominator), misconceptionId: "INCLUDED_BASE", explanation: "including the circular base in a tent that asks for curved canvas only" },
      { value: q(volumeValue.numerator * rate, volumeValue.denominator), misconceptionId: "PRICED_VOLUME", explanation: "multiplying a cubic volume by a square-metre canvas rate" },
    ],
    keyRule: "Curved canvas area of a cone is $\\pi rl$. Apply the declared $3.14$ value exactly as $\\frac{157}{50}$, then multiply by the price per square metre.",
    steps: [
      { title: "Find the Curved Canvas Area", body: "Use radius × slant height × the declared value of $\\pi$.", equation: `$$A=3.14\\times${radius}\\times${slant}=${formatExactMath(area)}\\text{ m}^{2}$$` },
      { title: "Apply the Canvas Rate", body: `Multiply by $\\text{£}${rate}$ per square metre.`, equation: `$$Cost=${formatExactMath(area)}\\times\\text{£}${rate}=\\text{£}${formatExactMath(cost)}$$` },
    ],
    shortcut: `For curved canvas, price $\\pi rl$—not the base and not the volume.`,
  };
}

function cylinderConeRatioDraft(prototypeId: MenCp008PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(RATIO_STATES);
  const cylinderCoefficient = state.cylinderRadius ** 2n * state.cylinderHeight;
  const coneCoefficient = state.coneRadius ** 2n * state.coneHeight;
  const answer = q(3n * cylinderCoefficient, coneCoefficient);
  return {
    state: makeState(prototypeId, seed, "EXACT_PI", "times", "RATIO", { ...state, cylinderCoefficient, coneCoefficient }, { answer }),
    stem: `A cylinder has radius ${dimension(state.cylinderRadius)} and height ${dimension(state.cylinderHeight)}. A cone has radius ${dimension(state.coneRadius)} and height ${dimension(state.coneHeight)}. Find the ratio of the cylinder's volume to the cone's volume.`,
    answer,
    wrongAnswers: [
      { value: q(cylinderCoefficient, coneCoefficient), misconceptionId: "OMITTED_CONE_ONE_THIRD", explanation: "comparing $r^2h$ coefficients without accounting for the cone's factor $\\frac13$" },
      { value: q(coneCoefficient, 3n * cylinderCoefficient), misconceptionId: "REVERSED_RATIO", explanation: "reversing cylinder-to-cone order" },
      { value: q(state.cylinderRadius, state.coneRadius), misconceptionId: "COMPARED_RADII_ONLY", explanation: "comparing only the radii and ignoring both heights and the cone factor" },
    ],
    keyRule: "Cylinder volume is $\\pi R^2H$ and cone volume is $\\frac13\\pi r^2h$. The common $\\pi$ cancels, but the cone's factor $\\frac13$ must remain.",
    steps: [
      { title: "Write the Two Volume Coefficients", body: "Keep the cone's one-third factor visible.", equation: `$$V_{cyl}:V_{cone}=${cylinderCoefficient}:\\frac{${coneCoefficient}}{3}$$` },
      { title: "Clear the Fraction and Reduce", body: "Multiply both ratio terms by $3$ and simplify.", equation: `$$V_{cyl}:V_{cone}=${requireRational(answer).numerator}:${requireRational(answer).denominator}$$` },
    ],
    shortcut: `Cancel $\\pi$, then multiply the cylinder coefficient by $3$ before reducing.`,
  };
}

export function classifyMenCp008Difficulty(state: MenCp008State): Men002Difficulty {
  const d = state.dimensions;
  switch (state.solveMode) {
    case "findCylinderVolume":
    case "findCylinderCurvedSurfaceArea": return d.radius! >= 6n ? "Medium" : "Easy";
    case "findCylinderTotalSurfaceArea": return d.radius! >= 6n ? "Hard" : "Medium";
    case "findCylinderRadiusFromVolume":
    case "findCylinderHeightFromVolume":
    case "findCylinderRadiusFromCurvedSurfaceArea":
    case "findCylinderHeightFromCurvedSurfaceArea": return d.radius! >= 6n ? "Hard" : "Medium";
    case "findCylinderRadiusFromTotalSurfaceArea": return d.radius! >= 6n ? "Hard" : "Medium";
    case "findCylinderCapacityWithTwentyTwoOverSeven": return d.radius! >= 14n ? "Hard" : "Medium";
    case "findRollerRevolutionsFromSweptArea": return d.revolutions! >= 20n ? "Hard" : "Medium";
    case "findConeVolume": return d.radius! >= 6n ? "Medium" : "Easy";
    case "findConeCurvedSurfaceArea": return d.radius! >= 6n ? "Hard" : "Medium";
    case "findConeTotalSurfaceArea": return d.slant! >= 17n ? "Hard" : "Medium";
    case "findConeSlantHeight": return d.slantSquared! >= 100n ? "Hard" : "Medium";
    case "findConeHeightFromSlantHeight":
    case "findConeRadiusFromSlantHeight": return d.slant! >= 17n ? "Hard" : "Medium";
    case "findConeHeightFromVolume":
    case "findConeRadiusFromVolume": return d.radius! >= 6n ? "Hard" : "Medium";
    case "findConeCanvasCost": return d.slant! >= 17n ? "Hard" : "Medium";
    case "findCylinderConeVolumeRatio": return d.coneRadius! >= 5n ? "Hard" : "Medium";
  }
}

function generateDraft(prototypeId: MenCp008PrototypeId, seed: string): Draft {
  const rng = createSeededRandom(`${prototypeId}:${seed}`);
  switch (prototypeId) {
    case "MEN-CP008-PROT-CYLINDER-VOLUME": return cylinderVolumeDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CYLINDER-CSA": return cylinderCsaDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CYLINDER-TSA": return cylinderTsaDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-VOLUME": return cylinderRadiusFromVolumeDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CYLINDER-HEIGHT-FROM-VOLUME": return cylinderHeightFromVolumeDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-CSA": return cylinderRadiusFromCsaDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CYLINDER-HEIGHT-FROM-CSA": return cylinderHeightFromCsaDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-TSA": return cylinderRadiusFromTsaDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CYLINDER-CAPACITY-22-OVER-7": return cylinderCapacityDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-ROLLER-REVOLUTIONS": return rollerRevolutionsDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CONE-VOLUME": return coneVolumeDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CONE-CSA": return coneCsaDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CONE-TSA": return coneTsaDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CONE-SLANT-HEIGHT": return coneSlantDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CONE-HEIGHT-FROM-SLANT": return coneHeightFromSlantDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CONE-RADIUS-FROM-SLANT": return coneRadiusFromSlantDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CONE-HEIGHT-FROM-VOLUME": return coneHeightFromVolumeDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CONE-RADIUS-FROM-VOLUME": return coneRadiusFromVolumeDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CONE-CANVAS-COST": return coneCanvasCostDraft(prototypeId, seed, rng);
    case "MEN-CP008-PROT-CYLINDER-CONE-VOLUME-RATIO": return cylinderConeRatioDraft(prototypeId, seed, rng);
  }
}

function verifyDraft(draft: Draft) {
  const d = draft.state.dimensions;
  let reconstructed: ExactValue;
  let method: string;
  switch (draft.state.solveMode) {
    case "findCylinderVolume": reconstructed = applyPiPolicy(q(d.radius! ** 2n * d.height!), draft.state.piPolicy); method = "reconstructed circular base area times cylinder height"; break;
    case "findCylinderCurvedSurfaceArea": reconstructed = applyPiPolicy(q(2n * d.radius! * d.height!), draft.state.piPolicy); method = "reconstructed circumference times height"; break;
    case "findCylinderTotalSurfaceArea": reconstructed = applyPiPolicy(q(2n * d.radius! * (d.height! + d.radius!)), draft.state.piPolicy); method = "reconstructed curved area plus two bases"; break;
    case "findCylinderRadiusFromVolume": {
      const candidate = asInteger(draft.answer);
      reconstructed = pi(candidate ** 2n * d.height!);
      method = "substituted candidate radius into exact cylinder volume";
      return { valid: exactEquals(reconstructed, draft.state.derived.evidence!), method, reconstructed: exactKey(reconstructed) };
    }
    case "findCylinderHeightFromVolume": {
      const candidate = asInteger(draft.answer);
      reconstructed = pi(d.radius! ** 2n * candidate);
      method = "substituted candidate height into exact cylinder volume";
      return { valid: exactEquals(reconstructed, draft.state.derived.evidence!), method, reconstructed: exactKey(reconstructed) };
    }
    case "findCylinderRadiusFromCurvedSurfaceArea": {
      const candidate = asInteger(draft.answer);
      reconstructed = pi(2n * candidate * d.height!);
      method = "substituted candidate radius into cylinder curved area";
      return { valid: exactEquals(reconstructed, draft.state.derived.evidence!), method, reconstructed: exactKey(reconstructed) };
    }
    case "findCylinderHeightFromCurvedSurfaceArea": {
      const candidate = asInteger(draft.answer);
      reconstructed = pi(2n * d.radius! * candidate);
      method = "substituted candidate height into cylinder curved area";
      return { valid: exactEquals(reconstructed, draft.state.derived.evidence!), method, reconstructed: exactKey(reconstructed) };
    }
    case "findCylinderRadiusFromTotalSurfaceArea": {
      const candidate = asInteger(draft.answer);
      reconstructed = pi(2n * candidate * (d.height! + candidate));
      method = "substituted candidate radius into full cylinder surface coefficient";
      return { valid: exactEquals(reconstructed, draft.state.derived.evidence!), method, reconstructed: exactKey(reconstructed) };
    }
    case "findCylinderCapacityWithTwentyTwoOverSeven": {
      const cubic = multiplyRational(q(d.radius! ** 2n * d.height!), q(22n, 7n));
      reconstructed = q(cubic.numerator, cubic.denominator * 1000n);
      method = "used declared 22/7 policy and converted cubic centimetres to litres";
      break;
    }
    case "findRollerRevolutionsFromSweptArea": {
      const candidate = asInteger(draft.answer);
      const one = multiplyRational(q(2n * d.radius! * d.length!), q(22n, 7n));
      reconstructed = q(one.numerator * candidate, one.denominator);
      method = "substituted revolution count into circumference-length swept area";
      return { valid: exactEquals(reconstructed, draft.state.derived.sweptArea!), method, reconstructed: exactKey(reconstructed) };
    }
    case "findConeVolume": reconstructed = applyPiPolicy(q(d.radius! ** 2n * d.height!, 3n), draft.state.piPolicy); method = "reconstructed one-third circular-base extrusion"; break;
    case "findConeCurvedSurfaceArea": {
      const slant = draft.state.derived.slant!;
      reconstructed = slant.kind === "RATIONAL"
        ? applyPiPolicy(q(d.radius! * slant.numerator, slant.denominator), draft.state.piPolicy)
        : applyPiSurdPolicy(q(d.radius! * slant.coefficient.numerator, slant.coefficient.denominator), slant.radicand, draft.state.piPolicy);
      method = "reconstructed slant height then applied pi-r-l";
      break;
    }
    case "findConeTotalSurfaceArea": reconstructed = applyPiPolicy(q(d.radius! * (d.slant! + d.radius!)), draft.state.piPolicy); method = "reconstructed cone curved area plus base"; break;
    case "findConeSlantHeight": reconstructed = exactFromSquaredLength(d.radius! ** 2n + d.height! ** 2n); method = "reconstructed hypotenuse of cone axial right triangle"; break;
    case "findConeHeightFromSlantHeight": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(d.radius! ** 2n + candidate ** 2n);
      method = "substituted candidate height into slant-height identity";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.slant! ** 2n, method, reconstructed: exactKey(reconstructed) };
    }
    case "findConeRadiusFromSlantHeight": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(candidate ** 2n + d.height! ** 2n);
      method = "substituted candidate radius into slant-height identity";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.slant! ** 2n, method, reconstructed: exactKey(reconstructed) };
    }
    case "findConeHeightFromVolume": {
      const candidate = asInteger(draft.answer);
      reconstructed = pi(d.radius! ** 2n * candidate, 3n);
      method = "substituted candidate height into exact cone volume";
      return { valid: exactEquals(reconstructed, draft.state.derived.evidence!), method, reconstructed: exactKey(reconstructed) };
    }
    case "findConeRadiusFromVolume": {
      const candidate = asInteger(draft.answer);
      reconstructed = pi(candidate ** 2n * d.height!, 3n);
      method = "substituted candidate radius into exact cone volume";
      return { valid: exactEquals(reconstructed, draft.state.derived.evidence!), method, reconstructed: exactKey(reconstructed) };
    }
    case "findConeCanvasCost": {
      const area = requireRational(applyPiPolicy(q(d.radius! * d.slant!), draft.state.piPolicy));
      reconstructed = q(area.numerator * d.rate!, area.denominator);
      method = "used declared 3.14 policy for cone curved area then applied canvas rate";
      break;
    }
    case "findCylinderConeVolumeRatio": reconstructed = q(3n * d.cylinderCoefficient!, d.coneCoefficient!); method = "cancelled pi and retained cone one-third factor"; break;
  }
  return { valid: exactEquals(reconstructed, draft.answer), method, reconstructed: exactKey(reconstructed) };
}

function optionDisplay(value: ExactValue, state: MenCp008State) {
  return state.displayMode === "RATIO" ? formatRatio(value) : formatWithUnit(value, state.unit);
}

function buildOptions(draft: Draft, rng: SeededRandom) {
  const candidates = [{ value: draft.answer, misconceptionId: null, explanation: "" }, ...draft.wrongAnswers];
  if (new Set(candidates.map((candidate) => exactKey(candidate.value))).size !== 4) {
    throw new Error(`${draft.state.prototypeId} generated duplicate exact option values.`);
  }
  if (!candidates.every((candidate) => isPositive(candidate.value))) {
    throw new Error(`${draft.state.prototypeId} generated a non-positive option.`);
  }
  const labels = ["A", "B", "C", "D"] as const;
  const options: MenCp008Option[] = rng.shuffle(candidates).map((candidate, index) => ({
    label: labels[index]!,
    value: candidate.value,
    display: optionDisplay(candidate.value, draft.state),
    isCorrect: candidate.misconceptionId === null,
    misconceptionId: candidate.misconceptionId,
  }));
  const explanationByKey = new Map(draft.wrongAnswers.map((wrong) => [exactKey(wrong.value), wrong.explanation]));
  const traps = options
    .filter((option) => !option.isCorrect)
    .map((option) => `Option ${option.label} (${option.display}): Common mistake: ${explanationByKey.get(exactKey(option.value))}.`);
  return { options, traps };
}

function validatePackage(question: Omit<MenCp008Package, "validation">) {
  const explanationText = [
    question.explanation.keyRule,
    ...question.explanation.steps.flatMap((step) => [step.body, step.equation ?? ""]),
    question.explanation.shortcut,
    ...question.explanation.traps,
  ].join("\n");
  const learnerText = [question.stem, ...question.options.map((option) => option.display), question.answer, explanationText].join("\n");
  const policyConsistent = question.piPolicy === "EXACT_PI"
    ? !/3\.14|22\/7/.test(learnerText)
    : question.piPolicy === "PI_22_OVER_7"
      ? learnerText.includes("22") && learnerText.includes("7")
      : learnerText.includes("3.14");
  const checks = [
    { name: "independent verifier", passed: question.verification.valid, message: "Independent verification must agree with the answer." },
    { name: "four exact options", passed: question.options.length === 4 && new Set(question.options.map((option) => exactKey(option.value))).size === 4, message: "Exactly four unique exact options are required." },
    { name: "one correct option", passed: question.options.filter((option) => option.isCorrect).length === 1, message: "Exactly one option must be correct." },
    { name: "state-derived difficulty", passed: question.difficulty === classifyMenCp008Difficulty(question.state), message: "Difficulty must derive from canonical state." },
    { name: "declared pi policy", passed: policyConsistent, message: "Learner text must match the generated pi policy." },
    { name: "four-tier teaching", passed: Boolean(question.explanation.keyRule) && question.explanation.steps.length >= 2 && Boolean(question.explanation.shortcut) && question.explanation.traps.length === 3, message: "Rule, steps, shortcut and three traps are required." },
    { name: "MathJax cleanliness", passed: !/[½¼²³]/.test(learnerText) && !/(^|[^\\])sqrt\{/.test(explanationText) && !/\$\$[^$]*\/[^$]*\$\$/.test(explanationText), message: "Use MathJax fractions, powers, roots and division." },
    { name: "control characters", passed: !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(learnerText), message: "Learner text must not contain hidden control characters." },
    { name: "currency locale", passed: !/₹/.test(learnerText), message: "Generic money must use en-GB pounds sterling." },
    { name: "lifecycle lock", passed: question.permanentQlId === null && !question.publiclyPublishable && !question.questionStudioDiscoverable, message: "Prototype packages must remain unallocated and unpublished." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp008Prototype(prototypeId: MenCp008PrototypeId, seed: string): MenCp008Package {
  const draft = generateDraft(prototypeId, seed);
  draft.state.difficulty = classifyMenCp008Difficulty(draft.state);
  const verification = verifyDraft(draft);
  const { options, traps } = buildOptions(draft, createSeededRandom(`${prototypeId}:${seed}:options`));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const partial = {
    packageId: "MEN-002" as const,
    canonicalProblemId: "MEN-CP-008" as const,
    permanentQlId: null,
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
    explanation: { keyRule: draft.keyRule, steps: draft.steps, shortcut: draft.shortcut, traps },
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
