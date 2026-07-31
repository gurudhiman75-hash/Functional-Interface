import {
  exactEquals,
  exactKey,
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
import { getMenCp008Wave02Definition } from "./registry";
import type {
  MenCp008Wave02Option,
  MenCp008Wave02Package,
  MenCp008Wave02PrototypeId,
  MenCp008Wave02State,
} from "./types";

interface WrongAnswer {
  value: ExactValue;
  misconceptionId: string;
  explanation: string;
}

interface Draft {
  state: MenCp008Wave02State;
  stem: string;
  answer: ExactValue;
  wrongAnswers: WrongAnswer[];
  keyRule: string;
  steps: MenCp008Wave02Package["explanation"]["steps"];
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

const CAPACITY_STATES = [
  { radius: 10n, height: 50n },
  { radius: 20n, height: 25n },
  { radius: 25n, height: 20n },
  { radius: 40n, height: 10n },
  { radius: 50n, height: 8n },
  { radius: 100n, height: 5n },
] as const;

const SURD_RADIUS_STATES = [
  { radicand: 2n, height: 6n },
  { radicand: 3n, height: 8n },
  { radicand: 5n, height: 10n },
  { radicand: 6n, height: 12n },
  { radicand: 7n, height: 14n },
  { radicand: 10n, height: 16n },
] as const;

const CONE_SURD_RADIUS_STATES = [
  { radicand: 2n, height: 3n },
  { radicand: 3n, height: 6n },
  { radicand: 5n, height: 9n },
  { radicand: 6n, height: 12n },
  { radicand: 7n, height: 15n },
  { radicand: 10n, height: 18n },
] as const;

const NON_PYTHAGOREAN_CONES = [
  { radius: 3n, height: 5n },
  { radius: 4n, height: 7n },
  { radius: 5n, height: 8n },
  { radius: 6n, height: 7n },
  { radius: 7n, height: 9n },
  { radius: 8n, height: 11n },
] as const;

const RATIO_STATES = [
  { radiusNumerator: 2n, radiusDenominator: 1n, heightNumerator: 3n, heightDenominator: 2n },
  { radiusNumerator: 3n, radiusDenominator: 2n, heightNumerator: 4n, heightDenominator: 3n },
  { radiusNumerator: 1n, radiusDenominator: 2n, heightNumerator: 2n, heightDenominator: 1n },
  { radiusNumerator: 2n, radiusDenominator: 3n, heightNumerator: 3n, heightDenominator: 2n },
  { radiusNumerator: 4n, radiusDenominator: 3n, heightNumerator: 2n, heightDenominator: 3n },
  { radiusNumerator: 3n, radiusDenominator: 1n, heightNumerator: 1n, heightDenominator: 2n },
] as const;

const ROLLER_STATES = [
  { radius: 7n, length: 5n, revolutions: 3n },
  { radius: 14n, length: 6n, revolutions: 4n },
  { radius: 21n, length: 8n, revolutions: 5n },
  { radius: 28n, length: 9n, revolutions: 6n },
  { radius: 35n, length: 10n, revolutions: 7n },
  { radius: 42n, length: 12n, revolutions: 8n },
] as const;

const EQUAL_VOLUME_STATES = [
  { coneRadius: 6n, coneHeight: 3n, cylinderRadius: 3n, cylinderHeight: 4n },
  { coneRadius: 8n, coneHeight: 6n, cylinderRadius: 4n, cylinderHeight: 8n },
  { coneRadius: 10n, coneHeight: 9n, cylinderRadius: 5n, cylinderHeight: 12n },
  { coneRadius: 12n, coneHeight: 12n, cylinderRadius: 6n, cylinderHeight: 16n },
  { coneRadius: 14n, coneHeight: 15n, cylinderRadius: 7n, cylinderHeight: 20n },
  { coneRadius: 16n, coneHeight: 18n, cylinderRadius: 8n, cylinderHeight: 24n },
] as const;

function q(numerator: bigint | number, denominator: bigint | number = 1) {
  return rational(numerator, denominator);
}

function requireRational(value: ExactValue): ExactRational {
  if (value.kind !== "RATIONAL") throw new Error("Expected a rational exact value.");
  return value;
}

function formatRatio(value: ExactValue) {
  const ratio = requireRational(value);
  return `$${ratio.numerator}:${ratio.denominator}$`;
}

function dimension(value: bigint) {
  return `$${value}\\text{ cm}$`;
}

function areaCoefficient(value: bigint) {
  return `$${value}\\pi\\text{ cm}^{2}$`;
}

function volumeCoefficient(value: bigint) {
  return `$${value}\\pi\\text{ cm}^{3}$`;
}

function exactMath(value: ExactValue) {
  switch (value.kind) {
    case "RATIONAL": return value.denominator === 1n ? `${value.numerator}` : `\\frac{${value.numerator}}{${value.denominator}}`;
    case "SURD": {
      const coefficient = value.coefficient.denominator === 1n
        ? `${value.coefficient.numerator}`
        : `\\frac{${value.coefficient.numerator}}{${value.coefficient.denominator}}`;
      return coefficient === "1" ? `\\sqrt{${value.radicand}}` : `${coefficient}\\sqrt{${value.radicand}}`;
    }
    case "PI": {
      const coefficient = value.coefficient.denominator === 1n
        ? `${value.coefficient.numerator}`
        : `\\frac{${value.coefficient.numerator}}{${value.coefficient.denominator}}`;
      return coefficient === "1" ? "\\pi" : `${coefficient}\\pi`;
    }
    case "PI_SURD": {
      const coefficient = value.coefficient.denominator === 1n
        ? `${value.coefficient.numerator}`
        : `\\frac{${value.coefficient.numerator}}{${value.coefficient.denominator}}`;
      return coefficient === "1"
        ? `\\pi\\sqrt{${value.radicand}}`
        : `${coefficient}\\pi\\sqrt{${value.radicand}}`;
    }
  }
}

function scaleExact(value: ExactValue, numerator: bigint, denominator: bigint = 1n): ExactValue {
  switch (value.kind) {
    case "RATIONAL": return q(value.numerator * numerator, value.denominator * denominator);
    case "SURD": return surd(value.coefficient.numerator * numerator, value.radicand, value.coefficient.denominator * denominator);
    case "PI": return pi(value.coefficient.numerator * numerator, value.coefficient.denominator * denominator);
    case "PI_SURD": return piSurd(value.coefficient.numerator * numerator, value.radicand, value.coefficient.denominator * denominator);
  }
}

function makeState(
  prototypeId: MenCp008Wave02PrototypeId,
  seed: string,
  dimensions: Record<string, bigint>,
  derived: Record<string, ExactValue>,
  unit: Men002Unit,
  piPolicy: MenCp008Wave02State["piPolicy"] = "EXACT_PI",
  displayMode: MenCp008Wave02State["displayMode"] = "UNIT",
): MenCp008Wave02State {
  const definition = getMenCp008Wave02Definition(prototypeId);
  const state: MenCp008Wave02State = {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-008",
    permanentQlId: null,
    waveId: "MEN-CP-008-GAP-WAVE-02",
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
  state.difficulty = classifyMenCp008Wave02Difficulty(state);
  return state;
}

function stemVariant(rng: SeededRandom, variants: readonly string[]) {
  return rng.pick(variants);
}

function naturalScaledWrongAnswers(answer: ExactValue, context: string): WrongAnswer[] {
  return [
    { value: scaleExact(answer, 2n), misconceptionId: "DOUBLED_RESULT", explanation: `doubling the ${context} after it has already been calculated` },
    { value: scaleExact(answer, 1n, 2n), misconceptionId: "HALVED_RESULT", explanation: `taking only half of the ${context}` },
    { value: scaleExact(answer, 3n), misconceptionId: "TRIPLED_RESULT", explanation: `multiplying the ${context} by three without a matching formula step` },
  ];
}

function cylinderCapacityDraft(prototypeId: MenCp008Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CAPACITY_STATES);
  const cubicCentimetres = q(157n * radius ** 2n * height, 50n);
  const answer = q(157n * radius ** 2n * height, 50_000n);
  const noPi = q(radius ** 2n * height, 1000n);
  const twentyTwoOverSeven = q(22n * radius ** 2n * height, 7000n);
  return {
    state: makeState(prototypeId, seed, { radius, height }, { answer, cubicCentimetres }, "litres", "PI_3_14"),
    stem: stemVariant(rng, [
      `A cylindrical tank has radius ${dimension(radius)} and height ${dimension(height)}. Using $\\pi=3.14$, find its capacity in litres.`,
      `Find the capacity of a cylinder of radius ${dimension(radius)} and height ${dimension(height)}. Take $\\pi=3.14$ and give the answer in litres.`,
      `A cylindrical vessel is ${dimension(height)} high and has radius ${dimension(radius)}. How many litres can it hold when $\\pi=3.14$?`,
      `Using $\\pi=3.14$, calculate the capacity in litres of a cylinder whose radius is ${dimension(radius)} and height is ${dimension(height)}.`,
    ]),
    answer,
    wrongAnswers: [
      { value: cubicCentimetres, misconceptionId: "DID_NOT_CONVERT_TO_LITRES", explanation: "leaving the volume in cubic centimetres instead of dividing by $1000$" },
      { value: noPi, misconceptionId: "OMITTED_PI", explanation: "using $r^2h$ but leaving out the stated value of $\\pi$" },
      { value: twentyTwoOverSeven, misconceptionId: "USED_WRONG_PI_POLICY", explanation: "using $22/7$ even though the question specifically gives $3.14$" },
    ],
    keyRule: "Cylinder volume is $V=\\pi r^2h$. With $\\pi=3.14=157/50$, calculate the volume exactly in cubic centimetres, then divide by $1000$ because $1000\\text{ cm}^3=1$ litre.",
    steps: [
      { title: "Put the dimensions into the volume formula", body: "Use the radius twice because the formula contains $r^2$.", equation: `$$V=3.14\\times${radius}^2\\times${height}\\text{ cm}^{3}$$` },
      { title: "Calculate the cubic-centimetre volume", body: "Treat $3.14$ as the exact fraction $157/50$ rather than a floating-point approximation.", equation: `$$V=\\frac{157}{50}\\times${radius ** 2n}\\times${height}=${exactMath(cubicCentimetres)}\\text{ cm}^{3}$$` },
      { title: "Convert cubic centimetres to litres", body: "Divide by $1000$ to reach the requested capacity unit.", equation: `$$Capacity=\\frac{${exactMath(cubicCentimetres)}}{1000}=${exactMath(answer)}\\text{ litres}$$` },
    ],
    shortcut: "Use $Capacity=3.14r^2h/1000$ litres and cancel factors before multiplying.",
  };
}

function cylinderSurdRadiusDraft(prototypeId: MenCp008Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radicand, height } = rng.pick(SURD_RADIUS_STATES);
  const coefficient = radicand * height;
  const answer = surd(1n, radicand);
  return {
    state: makeState(prototypeId, seed, { radicand, height, volumeCoefficient: coefficient }, { answer }, "cm"),
    stem: stemVariant(rng, [
      `A cylinder has volume ${volumeCoefficient(coefficient)} and height ${dimension(height)}. Find its radius in exact form.`,
      `The volume of a cylinder is ${volumeCoefficient(coefficient)}. If its height is ${dimension(height)}, what is the exact radius?`,
      `Find the radius of a cylinder whose height is ${dimension(height)} and volume is ${volumeCoefficient(coefficient)}. Keep the square root exact.`,
      `A cylindrical solid is ${dimension(height)} high and has volume ${volumeCoefficient(coefficient)}. Determine its radius without using decimals.`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(radicand), misconceptionId: "DID_NOT_TAKE_SQUARE_ROOT", explanation: "reporting $r^2$ as though it were the radius" },
      { value: surd(2n, radicand), misconceptionId: "DOUBLED_RADIUS", explanation: "doubling the square-root result without a formula reason" },
      { value: q(radicand, 2n), misconceptionId: "HALVED_RADICAND", explanation: "dividing the value of $r^2$ by two before taking the radius" },
    ],
    keyRule: "From $V=\\pi r^2h$, cancel $\\pi$ and divide by the height to find $r^2$. The radius is the positive square root because a length cannot be negative.",
    steps: [
      { title: "Write the volume equation", body: `Use height ${height} cm and the coefficient ${coefficient} of $\\pi$.`, equation: `$$${coefficient}\\pi=\\pi r^2\\times${height}$$` },
      { title: "Find the square of the radius", body: "Cancel $\\pi$ and divide by the height.", equation: `$$r^2=\\frac{${coefficient}}{${height}}=${radicand}$$` },
      { title: "Take the positive square root", body: "Keep the non-square value in exact surd form.", equation: `$$r=\\sqrt{${radicand}}=${exactMath(answer)}\\text{ cm}$$` },
    ],
    shortcut: "For $V=K\\pi$ and height $h$, calculate $K/h$ first; the radius is $\\sqrt{K/h}$.",
  };
}

function cylinderVolumeFromAreaDraft(
  prototypeId: MenCp008Wave02PrototypeId,
  seed: string,
  rng: SeededRandom,
  surface: "curved" | "total",
): Draft {
  const { radius, height } = rng.pick(CYLINDER_STATES);
  const csaCoefficient = 2n * radius * height;
  const tsaCoefficient = 2n * radius * (radius + height);
  const suppliedCoefficient = surface === "curved" ? csaCoefficient : tsaCoefficient;
  const answer = pi(radius ** 2n * height);
  const surfaceName = surface === "curved" ? "curved surface area" : "total surface area";
  const heightEquation = surface === "curved"
    ? `$$h=\\frac{${csaCoefficient}}{2\\times${radius}}=${height}\\text{ cm}$$`
    : `$$h=\\frac{${tsaCoefficient}}{2\\times${radius}}-${radius}=${height}\\text{ cm}$$`;
  return {
    state: makeState(prototypeId, seed, { radius, height, csaCoefficient, tsaCoefficient, suppliedCoefficient }, { answer }, "cm³"),
    stem: stemVariant(rng, [
      `A cylinder has radius ${dimension(radius)} and ${surfaceName} ${areaCoefficient(suppliedCoefficient)}. Find its volume in exact form.`,
      `The ${surfaceName} of a cylinder is ${areaCoefficient(suppliedCoefficient)} and its radius is ${dimension(radius)}. Calculate the exact volume.`,
      `Find the volume of a cylinder whose radius is ${dimension(radius)} and ${surfaceName} is ${areaCoefficient(suppliedCoefficient)}. Keep $\\pi$ exact.`,
      `A cylindrical solid has ${surfaceName} ${areaCoefficient(suppliedCoefficient)} and radius ${dimension(radius)}. What is its volume?`,
    ]),
    answer,
    wrongAnswers: [
      { value: pi(radius * height), misconceptionId: "DID_NOT_SQUARE_RADIUS", explanation: "using $\\pi rh$ instead of $\\pi r^2h$ for volume" },
      { value: pi(suppliedCoefficient), misconceptionId: "USED_AREA_COEFFICIENT_AS_VOLUME", explanation: "copying the surface-area coefficient into the volume answer" },
      { value: pi(2n * radius ** 2n * height), misconceptionId: "DOUBLED_VOLUME", explanation: "bringing the factor $2$ from the surface-area formula into the volume formula" },
    ],
    keyRule: surface === "curved"
      ? "Use $CSA=2\\pi rh$ to find the missing height. Then use $V=\\pi r^2h$. The two formulas have different powers of the radius."
      : "Use $TSA=2\\pi r(r+h)$ to recover the height. Once the height is known, use $V=\\pi r^2h$.",
    steps: [
      { title: `Use the ${surfaceName} formula`, body: "Cancel the common $\\pi$ and place the known radius in the formula.", equation: surface === "curved" ? `$$${csaCoefficient}=2\\times${radius}\\times h$$` : `$$${tsaCoefficient}=2\\times${radius}(${radius}+h)$$` },
      { title: "Find the height", body: "Solve the surface-area equation before moving to volume.", equation: heightEquation },
      { title: "Calculate the volume", body: "Square the radius, multiply by the recovered height, and keep $\\pi$ exact.", equation: `$$V=\\pi\\times${radius}^2\\times${height}=${exactMath(answer)}\\text{ cm}^{3}$$` },
    ],
    shortcut: surface === "curved"
      ? "From $CSA=K\\pi$, first use $h=K/(2r)$ and then $V=\\pi r^2h$."
      : "From $TSA=K\\pi$, first use $h=K/(2r)-r$ and then $V=\\pi r^2h$.",
  };
}

function cylinderRadiusFromAreaDifferenceDraft(prototypeId: MenCp008Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CYLINDER_STATES);
  const csaCoefficient = 2n * radius * height;
  const tsaCoefficient = 2n * radius * (radius + height);
  const differenceCoefficient = tsaCoefficient - csaCoefficient;
  const answer = q(radius);
  return {
    state: makeState(prototypeId, seed, { radius, height, csaCoefficient, tsaCoefficient, differenceCoefficient }, { answer }, "cm"),
    stem: stemVariant(rng, [
      `For a closed cylinder, the total surface area is greater than the curved surface area by ${areaCoefficient(differenceCoefficient)}. Find the radius.`,
      `The difference between the TSA and CSA of a cylinder is ${areaCoefficient(differenceCoefficient)}. What is its radius?`,
      `A cylinder has $TSA-CSA=${areaCoefficient(differenceCoefficient)}$. Determine the radius.`,
      `Find the radius of a closed cylinder when its total surface area minus its curved surface area is ${areaCoefficient(differenceCoefficient)}.`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(2n * radius), misconceptionId: "REPORTED_DIAMETER", explanation: "doubling the recovered radius and reporting the diameter" },
      { value: q(radius ** 2n), misconceptionId: "REPORTED_RADIUS_SQUARED", explanation: "stopping at $r^2$ instead of taking the square root" },
      { value: q(radius, 2n), misconceptionId: "HALVED_RADIUS", explanation: "dividing the radius by two after the two circular ends have already been counted" },
    ],
    keyRule: "For a closed cylinder, $TSA-CSA=2\\pi r^2$ because the curved part cancels and only the two circular ends remain.",
    steps: [
      { title: "Use the area difference", body: "Subtracting CSA from TSA leaves the area of the two circular ends.", equation: `$$${differenceCoefficient}\\pi=2\\pi r^2$$` },
      { title: "Find $r^2$", body: "Cancel $\\pi$ and divide by $2$.", equation: `$$r^2=\\frac{${differenceCoefficient}}{2}=${radius ** 2n}$$` },
      { title: "Take the positive square root", body: "A physical radius is positive.", equation: `$$r=\\sqrt{${radius ** 2n}}=${radius}\\text{ cm}$$` },
    ],
    shortcut: "Use $r=\\sqrt{(TSA-CSA)/(2\\pi)}$. When both areas are written as multiples of $\\pi$, work only with their coefficients.",
  };
}

function cylinderVolumeFromBothAreasDraft(prototypeId: MenCp008Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height } = rng.pick(CYLINDER_STATES);
  const csaCoefficient = 2n * radius * height;
  const tsaCoefficient = 2n * radius * (radius + height);
  const answer = pi(radius ** 2n * height);
  return {
    state: makeState(prototypeId, seed, { radius, height, csaCoefficient, tsaCoefficient }, { answer }, "cm³"),
    stem: stemVariant(rng, [
      `A cylinder has curved surface area ${areaCoefficient(csaCoefficient)} and total surface area ${areaCoefficient(tsaCoefficient)}. Find its volume.`,
      `The CSA and TSA of a closed cylinder are ${areaCoefficient(csaCoefficient)} and ${areaCoefficient(tsaCoefficient)} respectively. Calculate the exact volume.`,
      `Find the volume of a cylinder whose curved and total surface areas are ${areaCoefficient(csaCoefficient)} and ${areaCoefficient(tsaCoefficient)}.`,
      `A closed cylindrical solid has $CSA=${areaCoefficient(csaCoefficient)}$ and $TSA=${areaCoefficient(tsaCoefficient)}$. What is its volume?`,
    ]),
    answer,
    wrongAnswers: [
      { value: pi(radius * height), misconceptionId: "DID_NOT_SQUARE_RADIUS", explanation: "using $\\pi rh$ after finding the dimensions" },
      { value: pi(csaCoefficient), misconceptionId: "USED_CSA_AS_VOLUME", explanation: "treating the curved-area coefficient as the volume coefficient" },
      { value: pi(tsaCoefficient), misconceptionId: "USED_TSA_AS_VOLUME", explanation: "treating the total-area coefficient as the volume coefficient" },
    ],
    keyRule: "First use $TSA-CSA=2\\pi r^2$ to find the radius. Then use $CSA=2\\pi rh$ to find the height. Finally apply $V=\\pi r^2h$.",
    steps: [
      { title: "Find the radius from the area difference", body: "The difference represents the two circular ends.", equation: `$$r^2=\\frac{${tsaCoefficient}-${csaCoefficient}}{2}=${radius ** 2n},\\qquad r=${radius}\\text{ cm}$$` },
      { title: "Find the height from CSA", body: "Use the recovered radius in $CSA=2\\pi rh$.", equation: `$$h=\\frac{${csaCoefficient}}{2\\times${radius}}=${height}\\text{ cm}$$` },
      { title: "Calculate the volume", body: "Substitute both recovered dimensions into $V=\\pi r^2h$.", equation: `$$V=\\pi\\times${radius}^2\\times${height}=${exactMath(answer)}\\text{ cm}^{3}$$` },
    ],
    shortcut: "Subtract the area coefficients, halve, and square-root to get $r$; then use $h=CSA/(2\\pi r)$.",
  };
}

function volumeRatioDraft(
  prototypeId: MenCp008Wave02PrototypeId,
  seed: string,
  rng: SeededRandom,
  shape: "cylinder" | "cone",
): Draft {
  const values = rng.pick(RATIO_STATES);
  const answer = q(
    values.radiusNumerator ** 2n * values.heightNumerator,
    values.radiusDenominator ** 2n * values.heightDenominator,
  );
  const linearRadius = q(
    values.radiusNumerator * values.heightNumerator,
    values.radiusDenominator * values.heightDenominator,
  );
  const radiusOnly = q(values.radiusNumerator ** 2n, values.radiusDenominator ** 2n);
  const reversed = q(answer.denominator, answer.numerator);
  return {
    state: makeState(prototypeId, seed, { ...values }, { answer }, "times", "EXACT_PI", "RATIO"),
    stem: stemVariant(rng, [
      `The radii of two ${shape}s are in the ratio $${values.radiusNumerator}:${values.radiusDenominator}$ and their heights are in the ratio $${values.heightNumerator}:${values.heightDenominator}$. Find the ratio of their volumes.`,
      `Two ${shape}s have radius ratio $${values.radiusNumerator}:${values.radiusDenominator}$ and height ratio $${values.heightNumerator}:${values.heightDenominator}$. What is $V_1:V_2$?`,
      `For two ${shape}s, $r_1:r_2=${values.radiusNumerator}:${values.radiusDenominator}$ and $h_1:h_2=${values.heightNumerator}:${values.heightDenominator}$. Calculate the volume ratio.`,
      `Find the volume ratio of two ${shape}s whose radii and heights are in the ratios $${values.radiusNumerator}:${values.radiusDenominator}$ and $${values.heightNumerator}:${values.heightDenominator}$ respectively.`,
    ]),
    answer,
    wrongAnswers: [
      { value: reversed, misconceptionId: "REVERSED_RATIO", explanation: "writing the second solid first even though the question asks for $V_1:V_2$" },
      { value: linearRadius, misconceptionId: "DID_NOT_SQUARE_RADIUS_RATIO", explanation: "using the radius ratio only once instead of squaring it" },
      { value: radiusOnly, misconceptionId: "IGNORED_HEIGHT_RATIO", explanation: "using the squared radius ratio but leaving out the height ratio" },
    ],
    keyRule: `The volume of a ${shape} is proportional to $r^2h$. Constants such as $\\pi$ and $\\frac13$ cancel when two solids of the same shape are compared.`,
    steps: [
      { title: "Square the radius ratio", body: "The radius appears as $r^2$ in the volume formula.", equation: `$$r_1^2:r_2^2=${values.radiusNumerator ** 2n}:${values.radiusDenominator ** 2n}$$` },
      { title: "Multiply by the height ratio", body: "Combine the squared-radius factor with the height factor.", equation: `$$V_1:V_2=(${values.radiusNumerator}^2\\times${values.heightNumerator}):(${values.radiusDenominator}^2\\times${values.heightDenominator})$$` },
      { title: "Reduce the final ratio", body: "Divide both terms by their common factor.", equation: `$$V_1:V_2=${answer.numerator}:${answer.denominator}$$` },
    ],
    shortcut: "For either cylinders or cones, volume ratio is $(radius\\ ratio)^2\\times(height\\ ratio)$.",
  };
}

function rollerSweptAreaDraft(prototypeId: MenCp008Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, length, revolutions } = rng.pick(ROLLER_STATES);
  const answer = q(44n * radius * length * revolutions, 7n);
  return {
    state: makeState(prototypeId, seed, { radius, length, revolutions }, { answer }, "cm²", "PI_22_OVER_7"),
    stem: stemVariant(rng, [
      `A cylindrical roller has radius ${dimension(radius)} and length ${dimension(length)}. Find the area covered in ${revolutions} revolutions using $\\pi=22/7$.`,
      `A road roller of radius ${dimension(radius)} and length ${dimension(length)} makes ${revolutions} complete turns. How much area does it cover? Take $\\pi=22/7$.`,
      `Using $\\pi=22/7$, calculate the area swept by a roller ${dimension(length)} long with radius ${dimension(radius)} after ${revolutions} revolutions.`,
      `Find the total swept area of a cylindrical roller with radius ${dimension(radius)}, length ${dimension(length)} and ${revolutions} revolutions. Use $\\pi=22/7$.`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(44n * radius * length, 7n), misconceptionId: "OMITTED_REVOLUTIONS", explanation: "calculating the area for only one revolution" },
      { value: q(22n * radius * length * revolutions, 7n), misconceptionId: "USED_HALF_CIRCUMFERENCE", explanation: "using $\\pi r$ instead of the full circumference $2\\pi r$" },
      { value: q(88n * radius * length * revolutions, 7n), misconceptionId: "DOUBLED_CIRCUMFERENCE", explanation: "doubling the circumference factor a second time" },
    ],
    keyRule: "One revolution covers a rectangle with width equal to the roller's circumference and length equal to the roller's own length. Therefore $A=2\\pi rLn$.",
    steps: [
      { title: "Find the area covered in one revolution", body: "Multiply the circumference by the roller length.", equation: `$$A_1=2\\times\\frac{22}{7}\\times${radius}\\times${length}$$` },
      { title: "Include all revolutions", body: `The roller makes ${revolutions} complete turns.`, equation: `$$A=2\\times\\frac{22}{7}\\times${radius}\\times${length}\\times${revolutions}$$` },
      { title: "Complete the arithmetic", body: "Cancel the factor $7$ before multiplying.", equation: `$$A=${exactMath(answer)}\\text{ cm}^{2}$$` },
    ],
    shortcut: "Use $2\\pi rLn$ and cancel $7$ against the radius first.",
  };
}

function coneSurdDraft(
  prototypeId: MenCp008Wave02PrototypeId,
  seed: string,
  rng: SeededRandom,
  target: "slant" | "csa",
): Draft {
  const { radius, height } = rng.pick(NON_PYTHAGOREAN_CONES);
  const radicand = radius ** 2n + height ** 2n;
  const slant = surd(1n, radicand);
  const answer = target === "slant" ? slant : piSurd(radius, radicand);
  return {
    state: makeState(prototypeId, seed, { radius, height, radicand }, { answer, slant }, target === "slant" ? "cm" : "cm²"),
    stem: stemVariant(rng, target === "slant" ? [
      `A cone has radius ${dimension(radius)} and perpendicular height ${dimension(height)}. Find its slant height in exact form.`,
      `The radius and vertical height of a cone are ${dimension(radius)} and ${dimension(height)}. What is the exact slant height?`,
      `Find the slant height of a cone with radius ${dimension(radius)} and height ${dimension(height)}. Do not use a decimal approximation.`,
      `A right cone is ${dimension(height)} high and has base radius ${dimension(radius)}. Determine its slant height as a surd.`,
    ] : [
      `A cone has radius ${dimension(radius)} and perpendicular height ${dimension(height)}. Find its curved surface area in exact form.`,
      `The radius and vertical height of a cone are ${dimension(radius)} and ${dimension(height)}. Calculate the exact curved surface area.`,
      `Find the curved surface area of a cone with radius ${dimension(radius)} and height ${dimension(height)}. Keep both $\\pi$ and the square root exact.`,
      `A right cone is ${dimension(height)} high and has radius ${dimension(radius)}. What is its exact curved surface area?`,
    ]),
    answer,
    wrongAnswers: target === "slant" ? [
      { value: q(radius + height), misconceptionId: "ADDED_RADIUS_AND_HEIGHT", explanation: "adding the two perpendicular sides instead of using Pythagoras" },
      { value: q(radicand), misconceptionId: "DID_NOT_TAKE_SQUARE_ROOT", explanation: "reporting $l^2$ as the slant height" },
      { value: surd(2n, radicand), misconceptionId: "DOUBLED_SLANT", explanation: "doubling the correct square-root length" },
    ] : [
      { value: piSurd(1n, radicand), misconceptionId: "OMITTED_RADIUS_FACTOR", explanation: "using $\\pi l$ instead of $\\pi rl$" },
      { value: piSurd(2n * radius, radicand), misconceptionId: "DOUBLED_CURVED_AREA", explanation: "adding an unnecessary factor of two to $\\pi rl$" },
      { value: surd(radius, radicand), misconceptionId: "OMITTED_PI", explanation: "multiplying $r$ and $l$ but leaving out $\\pi$" },
    ],
    keyRule: target === "slant"
      ? "In the axial right triangle of a cone, $l^2=r^2+h^2$. Add the two squares and take the positive square root."
      : "First find the slant height from $l^2=r^2+h^2$. Then use $CSA=\\pi rl$. A non-square value gives an exact $\\pi\\sqrt{n}$ answer.",
    steps: target === "slant" ? [
      { title: "Use the cone's right triangle", body: "The radius and vertical height are perpendicular.", equation: `$$l^2=${radius}^2+${height}^2$$` },
      { title: "Add the squares", body: "Keep the exact value under the square root.", equation: `$$l^2=${radius ** 2n}+${height ** 2n}=${radicand}$$` },
      { title: "Take the positive square root", body: "The slant height is a length, so use the positive root.", equation: `$$l=\\sqrt{${radicand}}=${exactMath(answer)}\\text{ cm}$$` },
    ] : [
      { title: "Find the slant height", body: "Use the right triangle through the cone's axis.", equation: `$$l=\\sqrt{${radius}^2+${height}^2}=\\sqrt{${radicand}}$$` },
      { title: "Use the curved-area formula", body: "Multiply $\\pi$, the radius and the exact slant height.", equation: `$$CSA=\\pi\\times${radius}\\times\\sqrt{${radicand}}$$` },
      { title: "Write the exact result", body: "No decimal approximation is needed.", equation: `$$CSA=${exactMath(answer)}\\text{ cm}^{2}$$` },
    ],
    shortcut: target === "slant"
      ? "Use $l=\\sqrt{r^2+h^2}$ and simplify square factors only when they exist."
      : "Find $l$ first, then attach the factor $\\pi r$ to the exact surd.",
  };
}

function coneSurdRadiusFromVolumeDraft(prototypeId: MenCp008Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radicand, height } = rng.pick(CONE_SURD_RADIUS_STATES);
  const coefficient = radicand * height / 3n;
  const answer = surd(1n, radicand);
  return {
    state: makeState(prototypeId, seed, { radicand, height, volumeCoefficient: coefficient }, { answer }, "cm"),
    stem: stemVariant(rng, [
      `A cone has volume ${volumeCoefficient(coefficient)} and height ${dimension(height)}. Find its radius in exact form.`,
      `The volume of a cone is ${volumeCoefficient(coefficient)}. If its perpendicular height is ${dimension(height)}, what is the exact radius?`,
      `Find the radius of a cone whose height is ${dimension(height)} and volume is ${volumeCoefficient(coefficient)}. Keep the square root exact.`,
      `A conical solid is ${dimension(height)} high and has volume ${volumeCoefficient(coefficient)}. Determine its exact radius.`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(radicand), misconceptionId: "DID_NOT_TAKE_SQUARE_ROOT", explanation: "reporting $r^2$ as the radius" },
      { value: surd(2n, radicand), misconceptionId: "DOUBLED_RADIUS", explanation: "doubling the recovered square-root radius" },
      { value: q(radicand, 3n), misconceptionId: "DIVIDED_RADICAND_BY_THREE", explanation: "applying the cone's one-third factor to $r^2$ a second time" },
    ],
    keyRule: "Use $V=\\frac13\\pi r^2h$. Cancel $\\pi$, multiply the volume coefficient by $3$, divide by the height, and then take the positive square root.",
    steps: [
      { title: "Write the cone-volume equation", body: `Use height ${height} cm and volume coefficient ${coefficient}.`, equation: `$$${coefficient}\\pi=\\frac13\\pi r^2\\times${height}$$` },
      { title: "Find $r^2$", body: "Cancel $\\pi$, multiply by $3$, and divide by the height.", equation: `$$r^2=\\frac{3\\times${coefficient}}{${height}}=${radicand}$$` },
      { title: "Take the positive square root", body: "Leave the non-square radius in exact surd form.", equation: `$$r=\\sqrt{${radicand}}=${exactMath(answer)}\\text{ cm}$$` },
    ],
    shortcut: "For $V=K\\pi$, use $r=\\sqrt{3K/h}$.",
  };
}

function coneVolumeFromAreaDraft(
  prototypeId: MenCp008Wave02PrototypeId,
  seed: string,
  rng: SeededRandom,
  surface: "curved" | "total",
): Draft {
  const { radius, height, slantHeight } = rng.pick(CONE_STATES);
  const csaCoefficient = radius * slantHeight;
  const tsaCoefficient = radius * (radius + slantHeight);
  const suppliedCoefficient = surface === "curved" ? csaCoefficient : tsaCoefficient;
  const answer = pi(radius ** 2n * height, 3n);
  const surfaceName = surface === "curved" ? "curved surface area" : "total surface area";
  const slantEquation = surface === "curved"
    ? `$$l=\\frac{${csaCoefficient}}{${radius}}=${slantHeight}\\text{ cm}$$`
    : `$$l=\\frac{${tsaCoefficient}}{${radius}}-${radius}=${slantHeight}\\text{ cm}$$`;
  return {
    state: makeState(prototypeId, seed, { radius, height, slantHeight, csaCoefficient, tsaCoefficient, suppliedCoefficient }, { answer }, "cm³"),
    stem: stemVariant(rng, [
      `A cone has radius ${dimension(radius)} and ${surfaceName} ${areaCoefficient(suppliedCoefficient)}. Find its exact volume.`,
      `The ${surfaceName} of a cone is ${areaCoefficient(suppliedCoefficient)} and its radius is ${dimension(radius)}. Calculate the volume.`,
      `Find the volume of a cone whose radius is ${dimension(radius)} and ${surfaceName} is ${areaCoefficient(suppliedCoefficient)}. Keep $\\pi$ exact.`,
      `A conical solid has ${surfaceName} ${areaCoefficient(suppliedCoefficient)} and radius ${dimension(radius)}. What is its exact volume?`,
    ]),
    answer,
    wrongAnswers: [
      { value: pi(radius ** 2n * height), misconceptionId: "OMITTED_ONE_THIRD", explanation: "using the cylinder formula and leaving out the cone's factor $1/3$" },
      { value: pi(radius ** 2n * slantHeight, 3n), misconceptionId: "USED_SLANT_AS_HEIGHT", explanation: "using slant height directly in place of perpendicular height" },
      { value: pi(radius * height, 3n), misconceptionId: "DID_NOT_SQUARE_RADIUS", explanation: "using $rh$ instead of $r^2h$ in the cone-volume formula" },
    ],
    keyRule: surface === "curved"
      ? "Use $CSA=\\pi rl$ to find the slant height. Then use $h=\\sqrt{l^2-r^2}$ and finally $V=\\frac13\\pi r^2h$."
      : "Use $TSA=\\pi r(r+l)$ to find the slant height. Recover the perpendicular height with Pythagoras, then apply the cone-volume formula.",
    steps: [
      { title: "Find the slant height", body: `Start with the given ${surfaceName}.`, equation: slantEquation },
      { title: "Find the perpendicular height", body: "Use the axial right triangle; volume needs the perpendicular height, not the slant height.", equation: `$$h=\\sqrt{${slantHeight}^2-${radius}^2}=\\sqrt{${slantHeight ** 2n}-${radius ** 2n}}=${height}\\text{ cm}$$` },
      { title: "Calculate the cone volume", body: "Square the radius, multiply by the perpendicular height, and divide by $3$.", equation: `$$V=\\frac13\\pi\\times${radius}^2\\times${height}=${exactMath(answer)}\\text{ cm}^{3}$$` },
    ],
    shortcut: surface === "curved"
      ? "Use $l=CSA/(\\pi r)$, recognise the Pythagorean triple, then take one-third of $\\pi r^2h$."
      : "Use $l=TSA/(\\pi r)-r$, recognise the Pythagorean triple, then apply $V=\\frac13\\pi r^2h$.",
  };
}

function coneHeightFromBothAreasDraft(prototypeId: MenCp008Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { radius, height, slantHeight } = rng.pick(CONE_STATES);
  const csaCoefficient = radius * slantHeight;
  const tsaCoefficient = radius * (radius + slantHeight);
  const answer = q(height);
  return {
    state: makeState(prototypeId, seed, { radius, height, slantHeight, csaCoefficient, tsaCoefficient }, { answer }, "cm"),
    stem: stemVariant(rng, [
      `A cone has curved surface area ${areaCoefficient(csaCoefficient)} and total surface area ${areaCoefficient(tsaCoefficient)}. Find its perpendicular height.`,
      `The CSA and TSA of a cone are ${areaCoefficient(csaCoefficient)} and ${areaCoefficient(tsaCoefficient)}. Calculate its height.`,
      `Find the vertical height of a cone whose curved and total surface areas are ${areaCoefficient(csaCoefficient)} and ${areaCoefficient(tsaCoefficient)}.`,
      `A right cone has $CSA=${areaCoefficient(csaCoefficient)}$ and $TSA=${areaCoefficient(tsaCoefficient)}$. What is its perpendicular height?`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(radius), misconceptionId: "REPORTED_RADIUS", explanation: "stopping after finding the base radius" },
      { value: q(slantHeight), misconceptionId: "REPORTED_SLANT_HEIGHT", explanation: "reporting the slant height instead of the perpendicular height" },
      { value: q(radius + slantHeight), misconceptionId: "REPORTED_RADIUS_PLUS_SLANT", explanation: "reporting the bracket $r+l$ from the TSA formula" },
    ],
    keyRule: "For a cone, $TSA-CSA=\\pi r^2$, so the area difference gives the radius. Then $CSA=\\pi rl$ gives the slant height. Finally use $h=\\sqrt{l^2-r^2}$.",
    steps: [
      { title: "Find the radius", body: "Subtracting curved area from total area leaves the circular base.", equation: `$$r^2=${tsaCoefficient}-${csaCoefficient}=${radius ** 2n},\\qquad r=${radius}\\text{ cm}$$` },
      { title: "Find the slant height", body: "Use the CSA coefficient and the recovered radius.", equation: `$$l=\\frac{${csaCoefficient}}{${radius}}=${slantHeight}\\text{ cm}$$` },
      { title: "Find the perpendicular height", body: "Apply Pythagoras to the cone's axial right triangle.", equation: `$$h=\\sqrt{${slantHeight}^2-${radius}^2}=${height}\\text{ cm}$$` },
    ],
    shortcut: "Area difference gives $r^2$ directly; then use $l=CSA/(\\pi r)$ and the Pythagorean triple.",
  };
}

function equalVolumeCylinderHeightDraft(prototypeId: MenCp008Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const values = rng.pick(EQUAL_VOLUME_STATES);
  const answer = q(values.cylinderHeight);
  return {
    state: makeState(prototypeId, seed, { ...values }, { answer }, "cm"),
    stem: stemVariant(rng, [
      `A cone of radius ${dimension(values.coneRadius)} and height ${dimension(values.coneHeight)} has the same volume as a cylinder of radius ${dimension(values.cylinderRadius)}. Find the cylinder's height.`,
      `The volume of a cone with radius ${dimension(values.coneRadius)} and height ${dimension(values.coneHeight)} equals that of a cylinder whose radius is ${dimension(values.cylinderRadius)}. Determine the cylinder height.`,
      `A cylinder of radius ${dimension(values.cylinderRadius)} is equal in volume to a cone of radius ${dimension(values.coneRadius)} and height ${dimension(values.coneHeight)}. What is the cylinder's height?`,
      `Find the height of a cylinder with radius ${dimension(values.cylinderRadius)} if it has the same volume as a cone of radius ${dimension(values.coneRadius)} and height ${dimension(values.coneHeight)}.`,
    ]),
    answer,
    wrongAnswers: [
      { value: q(values.coneHeight), misconceptionId: "EQUATED_HEIGHTS", explanation: "assuming equal volume means the two heights must be equal" },
      { value: q(values.cylinderHeight, 3n), misconceptionId: "DIVIDED_BY_THREE_TWICE", explanation: "applying the cone's one-third factor a second time" },
      { value: q(3n * values.cylinderHeight), misconceptionId: "MULTIPLIED_BY_THREE", explanation: "moving the cone's factor of three in the wrong direction" },
    ],
    keyRule: "For equal volumes, $\\pi R^2H=\\frac13\\pi r^2h$. Here the cylinder height is unknown, so $H=r^2h/(3R^2)$.",
    steps: [
      { title: "Set the two volumes equal", body: "Use the cylinder formula on one side and the cone formula on the other.", equation: `$$\\pi\\times${values.cylinderRadius}^2\\times H=\\frac13\\pi\\times${values.coneRadius}^2\\times${values.coneHeight}$$` },
      { title: "Cancel $\\pi$ and square the radii", body: "Keep the cone's one-third factor in place.", equation: `$$${values.cylinderRadius ** 2n}H=\\frac13\\times${values.coneRadius ** 2n}\\times${values.coneHeight}$$` },
      { title: "Calculate the cylinder height", body: "Divide the cone side by the squared cylinder radius.", equation: `$$H=\\frac{${values.coneRadius ** 2n}\\times${values.coneHeight}}{3\\times${values.cylinderRadius ** 2n}}=${values.cylinderHeight}\\text{ cm}$$` },
    ],
    shortcut: "For equal cone and cylinder volumes, cylinder height $=r_{cone}^2h_{cone}/(3r_{cylinder}^2)$.",
  };
}

function generateDraft(prototypeId: MenCp008Wave02PrototypeId, seed: string): Draft {
  const rng = createSeededRandom(`${prototypeId}:${seed}`);
  switch (prototypeId) {
    case "MEN-CP008-W2-PROT-CYLINDER-CAPACITY-PI-3-14": return cylinderCapacityDraft(prototypeId, seed, rng);
    case "MEN-CP008-W2-PROT-CYLINDER-RADIUS-SURD-FROM-VOLUME": return cylinderSurdRadiusDraft(prototypeId, seed, rng);
    case "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-CSA-RADIUS": return cylinderVolumeFromAreaDraft(prototypeId, seed, rng, "curved");
    case "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-TSA-RADIUS": return cylinderVolumeFromAreaDraft(prototypeId, seed, rng, "total");
    case "MEN-CP008-W2-PROT-CYLINDER-RADIUS-FROM-TSA-CSA-DIFFERENCE": return cylinderRadiusFromAreaDifferenceDraft(prototypeId, seed, rng);
    case "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-CSA-TSA": return cylinderVolumeFromBothAreasDraft(prototypeId, seed, rng);
    case "MEN-CP008-W2-PROT-CYLINDER-VOLUME-RATIO-DIMENSION-RATIOS": return volumeRatioDraft(prototypeId, seed, rng, "cylinder");
    case "MEN-CP008-W2-PROT-ROLLER-SWEPT-AREA": return rollerSweptAreaDraft(prototypeId, seed, rng);
    case "MEN-CP008-W2-PROT-CONE-SLANT-HEIGHT-SURD": return coneSurdDraft(prototypeId, seed, rng, "slant");
    case "MEN-CP008-W2-PROT-CONE-CSA-PI-SURD": return coneSurdDraft(prototypeId, seed, rng, "csa");
    case "MEN-CP008-W2-PROT-CONE-RADIUS-SURD-FROM-VOLUME": return coneSurdRadiusFromVolumeDraft(prototypeId, seed, rng);
    case "MEN-CP008-W2-PROT-CONE-VOLUME-FROM-CSA-RADIUS": return coneVolumeFromAreaDraft(prototypeId, seed, rng, "curved");
    case "MEN-CP008-W2-PROT-CONE-VOLUME-FROM-TSA-RADIUS": return coneVolumeFromAreaDraft(prototypeId, seed, rng, "total");
    case "MEN-CP008-W2-PROT-CONE-HEIGHT-FROM-CSA-TSA": return coneHeightFromBothAreasDraft(prototypeId, seed, rng);
    case "MEN-CP008-W2-PROT-CONE-VOLUME-RATIO-DIMENSION-RATIOS": return volumeRatioDraft(prototypeId, seed, rng, "cone");
    case "MEN-CP008-W2-PROT-EQUAL-VOLUME-CYLINDER-HEIGHT": return equalVolumeCylinderHeightDraft(prototypeId, seed, rng);
  }
}

export function classifyMenCp008Wave02Difficulty(state: MenCp008Wave02State): Men002Difficulty {
  const d = state.dimensions;
  switch (state.solveMode) {
    case "findCylinderCapacityWithThreePointFourteen": return d.radius! >= 40n ? "Hard" : "Medium";
    case "findCylinderSurdRadiusFromVolume":
    case "findConeSurdRadiusFromVolume": return d.radicand! >= 7n ? "Hard" : "Medium";
    case "findCylinderVolumeFromCurvedSurfaceAreaAndRadius":
    case "findCylinderVolumeFromTotalSurfaceAreaAndRadius":
    case "findCylinderVolumeFromCurvedAndTotalSurfaceAreas": return d.height! >= 14n ? "Hard" : "Medium";
    case "findCylinderRadiusFromTotalMinusCurvedSurfaceArea": return d.radius! >= 7n ? "Hard" : "Medium";
    case "findCylinderVolumeRatioFromDimensionRatios":
    case "findConeVolumeRatioFromDimensionRatios": return d.radiusNumerator! + d.radiusDenominator! + d.heightNumerator! + d.heightDenominator! >= 8n ? "Hard" : "Medium";
    case "findRollerSweptArea": return d.radius! >= 28n ? "Hard" : "Medium";
    case "findConeSurdSlantHeight":
    case "findConePiSurdCurvedSurfaceArea": return d.radicand! >= 100n ? "Hard" : "Medium";
    case "findConeVolumeFromCurvedSurfaceAreaAndRadius":
    case "findConeVolumeFromTotalSurfaceAreaAndRadius": return d.slantHeight! >= 25n ? "Hard" : "Medium";
    case "findConeHeightFromCurvedAndTotalSurfaceAreas": return d.height! >= 24n ? "Hard" : "Medium";
    case "findCylinderHeightForEqualConeVolume": return d.cylinderHeight! >= 16n ? "Hard" : "Medium";
  }
}

function verifyDraft(draft: Draft) {
  const d = draft.state.dimensions;
  let reconstructed: ExactValue;
  let method: string;
  switch (draft.state.solveMode) {
    case "findCylinderCapacityWithThreePointFourteen":
      reconstructed = q(157n * d.radius! ** 2n * d.height!, 50_000n);
      method = "independently used exact 157/50 pi and converted cubic centimetres to litres";
      break;
    case "findCylinderSurdRadiusFromVolume":
      reconstructed = surd(1n, d.volumeCoefficient! / d.height!);
      method = "independently divided the volume coefficient by height and took the exact square root";
      break;
    case "findCylinderVolumeFromCurvedSurfaceAreaAndRadius": {
      const height = d.csaCoefficient! / (2n * d.radius!);
      reconstructed = pi(d.radius! ** 2n * height);
      method = "independently recovered height from CSA before applying cylinder volume";
      break;
    }
    case "findCylinderVolumeFromTotalSurfaceAreaAndRadius": {
      const height = d.tsaCoefficient! / (2n * d.radius!) - d.radius!;
      reconstructed = pi(d.radius! ** 2n * height);
      method = "independently recovered height from TSA before applying cylinder volume";
      break;
    }
    case "findCylinderRadiusFromTotalMinusCurvedSurfaceArea": {
      const radius = integerSquareRoot(d.differenceCoefficient! / 2n);
      if (radius === null) throw new Error("Expected an exact cylinder radius.");
      reconstructed = q(radius);
      method = "independently treated TSA minus CSA as the two circular ends";
      break;
    }
    case "findCylinderVolumeFromCurvedAndTotalSurfaceAreas": {
      const radius = integerSquareRoot((d.tsaCoefficient! - d.csaCoefficient!) / 2n);
      if (radius === null) throw new Error("Expected an exact cylinder radius.");
      const height = d.csaCoefficient! / (2n * radius);
      reconstructed = pi(radius ** 2n * height);
      method = "independently recovered radius from area difference and height from CSA";
      break;
    }
    case "findCylinderVolumeRatioFromDimensionRatios":
    case "findConeVolumeRatioFromDimensionRatios":
      reconstructed = q(d.radiusNumerator! ** 2n * d.heightNumerator!, d.radiusDenominator! ** 2n * d.heightDenominator!);
      method = "independently applied the exact r-squared-h ratio";
      break;
    case "findRollerSweptArea":
      reconstructed = q(44n * d.radius! * d.length! * d.revolutions!, 7n);
      method = "independently multiplied circumference, roller length and revolutions";
      break;
    case "findConeSurdSlantHeight":
      reconstructed = surd(1n, d.radius! ** 2n + d.height! ** 2n);
      method = "independently applied the cone axial Pythagorean relation";
      break;
    case "findConePiSurdCurvedSurfaceArea":
      reconstructed = piSurd(d.radius!, d.radius! ** 2n + d.height! ** 2n);
      method = "independently recovered exact slant height and multiplied by pi times radius";
      break;
    case "findConeSurdRadiusFromVolume":
      reconstructed = surd(1n, 3n * d.volumeCoefficient! / d.height!);
      method = "independently solved the cone volume coefficient for r squared";
      break;
    case "findConeVolumeFromCurvedSurfaceAreaAndRadius": {
      const slant = d.csaCoefficient! / d.radius!;
      const height = integerSquareRoot(slant ** 2n - d.radius! ** 2n);
      if (height === null) throw new Error("Expected an exact cone height.");
      reconstructed = pi(d.radius! ** 2n * height, 3n);
      method = "independently recovered slant and perpendicular height from cone CSA";
      break;
    }
    case "findConeVolumeFromTotalSurfaceAreaAndRadius": {
      const slant = d.tsaCoefficient! / d.radius! - d.radius!;
      const height = integerSquareRoot(slant ** 2n - d.radius! ** 2n);
      if (height === null) throw new Error("Expected an exact cone height.");
      reconstructed = pi(d.radius! ** 2n * height, 3n);
      method = "independently recovered slant and perpendicular height from cone TSA";
      break;
    }
    case "findConeHeightFromCurvedAndTotalSurfaceAreas": {
      const radius = integerSquareRoot(d.tsaCoefficient! - d.csaCoefficient!);
      if (radius === null) throw new Error("Expected an exact cone radius.");
      const slant = d.csaCoefficient! / radius;
      const height = integerSquareRoot(slant ** 2n - radius ** 2n);
      if (height === null) throw new Error("Expected an exact cone height.");
      reconstructed = q(height);
      method = "independently recovered radius, slant height and perpendicular height from the two areas";
      break;
    }
    case "findCylinderHeightForEqualConeVolume":
      reconstructed = q(d.coneRadius! ** 2n * d.coneHeight!, 3n * d.cylinderRadius! ** 2n);
      method = "independently equated exact cone and cylinder volume coefficients";
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
    throw new Error(`${draft.state.prototypeId} could not produce three unique misconception-backed wrong options.`);
  }
  const selectedWrong = rng.shuffle([...uniqueWrong.values()]).slice(0, 3);
  const candidates = [{ value: draft.answer, misconceptionId: null, explanation: "" }, ...selectedWrong];
  const shuffled = rng.shuffle(candidates);
  const labels = ["A", "B", "C", "D"] as const;
  const options: MenCp008Wave02Option[] = shuffled.map((candidate, index) => ({
    label: labels[index]!,
    value: candidate.value,
    display: draft.state.displayMode === "RATIO" ? formatRatio(candidate.value) : formatWithUnit(candidate.value, draft.state.unit),
    isCorrect: candidate.misconceptionId === null,
    misconceptionId: candidate.misconceptionId,
  }));
  const explanationByKey = new Map(selectedWrong.map((wrong) => [exactKey(wrong.value), wrong.explanation]));
  const traps = options
    .filter((option) => !option.isCorrect)
    .map((option) => `Option ${option.label} (${option.display}): This result comes from ${explanationByKey.get(exactKey(option.value))}.`);
  return { options, traps };
}

function validatePackage(question: Omit<MenCp008Wave02Package, "validation">) {
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
    { name: "state-derived difficulty", passed: question.difficulty === classifyMenCp008Wave02Difficulty(question.state), message: "Difficulty must derive from canonical state." },
    { name: "natural three-step teaching", passed: Boolean(question.explanation.keyRule) && question.explanation.steps.length === 3 && Boolean(question.explanation.shortcut) && question.explanation.traps.length === 3, message: "Rule, three calculation steps, shortcut and three traps are required." },
    { name: "natural distractor language", passed: question.explanation.traps.every((trap) => trap.includes("This result comes from") && !trap.includes("Common mistake:")), message: "Distractor notes must use the approved natural wording." },
    { name: "blocked robotic language", passed: !/Common mistake:|represents exactly two|turn the given|receive the same multiplier|follow the whole rectangle/i.test(learnerText), message: "Approved learner-facing language must remain natural." },
    { name: "MathJax cleanliness", passed: !/[½¼²³]/.test(learnerText) && !/(^|[^\\])sqrt\{/.test(explanationText) && !/\$\$[^$]*\/[^$]*\$\$/.test(explanationText), message: "Use MathJax fractions, powers, roots and division." },
    { name: "Indian editorial", passed: !/[£€¥]/.test(learnerText), message: "Indian exam content must not use foreign currency." },
    { name: "control characters", passed: !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(learnerText), message: "Learner text must not contain hidden control characters." },
    { name: "lifecycle lock", passed: question.permanentQlId === null && !question.publiclyPublishable && !question.questionStudioDiscoverable, message: "Wave prototypes must remain unallocated and unpublished." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp008Wave02Prototype(
  prototypeId: MenCp008Wave02PrototypeId,
  seed: string,
): MenCp008Wave02Package {
  const draft = generateDraft(prototypeId, seed);
  const verification = verifyDraft(draft);
  const { options, traps } = buildOptions(draft, createSeededRandom(`${prototypeId}:${seed}:options`));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const partial = {
    packageId: "MEN-002" as const,
    canonicalProblemId: "MEN-CP-008" as const,
    permanentQlId: null,
    waveId: "MEN-CP-008-GAP-WAVE-02" as const,
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
