import {
  exactEquals,
  exactFromSquaredLength,
  exactKey,
  formatExactMath,
  formatWithUnit,
  integerSquareRoot,
  rational,
  surd,
} from "../foundation/exact";
import { createSeededRandom, type SeededRandom } from "../foundation/seed";
import type {
  ExactRational,
  ExactValue,
  Men002Difficulty,
  Men002Unit,
} from "../foundation/types";
import { getMenCp007Wave01Prototype } from "./registry";
import type {
  MenCp007Wave01Option,
  MenCp007Wave01Package,
  MenCp007Wave01PrototypeId,
  MenCp007Wave01State,
} from "./types";

interface WrongAnswer {
  value: ExactValue;
  misconceptionId: string;
  explanation: string;
}

interface Draft {
  state: MenCp007Wave01State;
  stem: string;
  answer: ExactValue;
  wrongAnswers: [WrongAnswer, WrongAnswer, WrongAnswer];
  keyRule: string;
  steps: MenCp007Wave01Package["explanation"]["steps"];
  shortcut: string;
}

const CUBE_SIDES = [3n, 5n, 7n, 8n, 9n, 10n, 11n, 12n, 13n, 14n] as const;
const SAFE_CUBOIDS = [
  [12n, 8n, 5n],
  [14n, 9n, 6n],
  [16n, 10n, 7n],
  [18n, 12n, 8n],
  [20n, 11n, 9n],
] as const;
const PRISM_STATES = [
  { baseArea: 24n, basePerimeter: 20n, height: 7n },
  { baseArea: 30n, basePerimeter: 22n, height: 9n },
  { baseArea: 42n, basePerimeter: 26n, height: 11n },
  { baseArea: 54n, basePerimeter: 30n, height: 13n },
  { baseArea: 70n, basePerimeter: 34n, height: 15n },
] as const;
const CAPACITY_STATES = [
  { length: 24n, breadth: 14n, height: 12n, thickness: 2n },
  { length: 34n, breadth: 24n, height: 12n, thickness: 2n },
  { length: 44n, breadth: 24n, height: 14n, thickness: 2n },
  { length: 36n, breadth: 26n, height: 14n, thickness: 3n },
  { length: 54n, breadth: 34n, height: 18n, thickness: 2n },
] as const;
const REMAINDER_STATES = [
  { length: 13n, breadth: 10n, height: 8n, smallSide: 3n },
  { length: 17n, breadth: 11n, height: 9n, smallSide: 4n },
  { length: 22n, breadth: 15n, height: 11n, smallSide: 4n },
  { length: 19n, breadth: 14n, height: 10n, smallSide: 3n },
  { length: 27n, breadth: 16n, height: 13n, smallSide: 5n },
] as const;
const STACK_STATES = [
  { side: 2n, rows: 3n, columns: 4n, layers: 5n },
  { side: 3n, rows: 4n, columns: 5n, layers: 3n },
  { side: 4n, rows: 3n, columns: 5n, layers: 6n },
  { side: 5n, rows: 4n, columns: 6n, layers: 3n },
  { side: 6n, rows: 3n, columns: 7n, layers: 4n },
] as const;
const RATIO_PAIRS = [
  [2n, 3n],
  [3n, 4n],
  [4n, 5n],
  [2n, 5n],
  [3n, 5n],
] as const;

function q(numerator: bigint | number, denominator: bigint | number = 1) {
  return rational(numerator, denominator);
}

function requireRational(value: ExactValue): ExactRational {
  if (value.kind !== "RATIONAL") throw new Error("Expected a rational value.");
  return value;
}

function asInteger(value: ExactValue) {
  const rationalValue = requireRational(value);
  if (rationalValue.denominator !== 1n) throw new Error("Expected an integer value.");
  return rationalValue.numerator;
}

function dimension(value: bigint, unit: "cm" | "m" = "cm") {
  return `$${value}\\text{ ${unit}}$`;
}

function formatRatio(value: ExactValue) {
  const ratio = requireRational(value);
  return `$${ratio.numerator}:${ratio.denominator}$`;
}

function makeState(
  prototypeId: MenCp007Wave01PrototypeId,
  seed: string,
  unit: Men002Unit,
  displayMode: "UNIT" | "RATIO",
  dimensions: Record<string, bigint>,
  derived: Record<string, ExactValue>,
): MenCp007Wave01State {
  const definition = getMenCp007Wave01Prototype(prototypeId);
  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-007",
    permanentQlId: null,
    waveId: "MEN-CP-007-GAP-WAVE-01",
    prototypeId,
    solveMode: definition.solveMode,
    target: definition.target,
    shape: definition.shape,
    seed,
    difficulty: "Easy",
    dimensions,
    derived,
    unit,
    displayMode,
  };
}

function cubeLsaDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const side = rng.pick(CUBE_SIDES);
  const faceArea = side ** 2n;
  const answer = q(4n * faceArea);
  return {
    state: makeState(prototypeId, seed, "cm²", "UNIT", { side }, { faceArea: q(faceArea), answer }),
    stem: `A cubical pillar has side ${dimension(side)}. Find the area of its four vertical faces.`,
    answer,
    wrongAnswers: [
      { value: q(6n * faceArea), misconceptionId: "USED_TSA", explanation: "including the top and bottom even though only the four vertical faces are required" },
      { value: q(faceArea), misconceptionId: "ONE_FACE_ONLY", explanation: `reporting one square face, $${side}^2=${faceArea}$, instead of four faces` },
      { value: q(side ** 3n), misconceptionId: "USED_VOLUME", explanation: "cubing the side, which measures the solid's volume rather than its lateral area" },
    ],
    keyRule: "A cube has four vertical square faces. Its lateral surface area is $LSA=4a^2$; the top and bottom are excluded.",
    steps: [
      { title: "Find One Vertical Face", body: "Each vertical face is a square.", equation: `$$a^2=${side}^2=${faceArea}\\text{ cm}^{2}$$` },
      { title: "Count the Four Vertical Faces", body: "Multiply one face area by four and do not add the horizontal faces.", equation: `$$LSA=4\\times${faceArea}=${4n * faceArea}\\text{ cm}^{2}$$` },
    ],
    shortcut: `Use $4a^2$ directly: $4\\times${side}^2=${4n * faceArea}\\text{ cm}^{2}$.`,
  };
}

function cubeSideFromTsaDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const side = rng.pick(CUBE_SIDES);
  const tsa = 6n * side ** 2n;
  const answer = q(side);
  return {
    state: makeState(prototypeId, seed, "cm", "UNIT", { side, tsa }, { answer }),
    stem: `The total surface area of a closed cube is $${tsa}\\text{ cm}^{2}$. Find its side length.`,
    answer,
    wrongAnswers: [
      { value: exactFromSquaredLength(tsa), misconceptionId: "TOOK_ROOT_BEFORE_DIVIDING", explanation: `taking $\\sqrt{${tsa}}$ before removing the six equal faces` },
      { value: q(side ** 2n), misconceptionId: "STOPPED_AT_FACE_AREA", explanation: `dividing by $6$ to get $${side ** 2n}$ but reporting the face area instead of taking its square root` },
      { value: q(side ** 2n, 2n), misconceptionId: "DIVIDED_BY_TWELVE", explanation: `dividing $${tsa}$ by $12$ and stopping, instead of using $a=\\sqrt{TSA/6}$` },
    ],
    keyRule: "For a closed cube, $TSA=6a^2$. First find one face area by dividing by $6$, then take its square root.",
    steps: [
      { title: "Find One Face Area", body: "The total area is shared equally by six square faces.", equation: `$$a^2=\\frac{${tsa}}{6}=${side ** 2n}\\text{ cm}^{2}$$` },
      { title: "Recover the Side", body: "The side is the positive square root of one face area.", equation: `$$a=\\sqrt{${side ** 2n}}=${side}\\text{ cm}$$` },
    ],
    shortcut: `Divide the TSA by $6$ and recognise the perfect square $${side ** 2n}=${side}^2$.`,
  };
}

function cubeFaceDiagonalDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const side = rng.pick(CUBE_SIDES);
  const answer = surd(side, 2n);
  return {
    state: makeState(prototypeId, seed, "cm", "UNIT", { side }, { answer }),
    stem: `A square face of a cube has side ${dimension(side)}. Find the diagonal across that face.`,
    answer,
    wrongAnswers: [
      { value: surd(side, 3n), misconceptionId: "USED_SPACE_DIAGONAL", explanation: "using $a\\sqrt3$, which crosses the interior of the cube rather than one square face" },
      { value: q(2n * side), misconceptionId: "ADDED_TWO_EDGES", explanation: "adding two side lengths instead of applying Pythagoras to the square face" },
      { value: q(side), misconceptionId: "USED_SIDE_ONLY", explanation: "reporting one edge even though the diagonal joins opposite corners of the face" },
    ],
    keyRule: "A face diagonal lies in one square face, so $d_f^2=a^2+a^2=2a^2$ and $d_f=a\\sqrt2$.",
    steps: [
      { title: "Apply Pythagoras on the Square Face", body: "The two perpendicular sides of the face are both equal to $a$.", equation: `$$d_f^2=${side}^2+${side}^2=2\\times${side ** 2n}$$` },
      { title: "Keep the Exact Surd", body: "No decimal approximation is requested.", equation: `$$d_f=${side}\\sqrt2\\text{ cm}$$` },
    ],
    shortcut: `For every square, diagonal $=a\\sqrt2$; use the same relation on a cube face.`,
  };
}

function cubeSideFromFaceDiagonalDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const side = rng.pick(CUBE_SIDES);
  const diagonal = surd(side, 2n);
  const answer = q(side);
  return {
    state: makeState(prototypeId, seed, "cm", "UNIT", { side }, { diagonal, answer }),
    stem: `The diagonal across one face of a cube is $${formatExactMath(diagonal)}\\text{ cm}$. Find the cube's side.`,
    answer,
    wrongAnswers: [
      { value: q(2n * side), misconceptionId: "MULTIPLIED_BY_ROOT_TWO", explanation: "multiplying by $\\sqrt2$ instead of dividing the face diagonal by $\\sqrt2$" },
      { value: surd(side, 2n, 2n), misconceptionId: "HALVED_DIAGONAL", explanation: "halving the diagonal as though it were made from two collinear side lengths" },
      { value: q(side, 2n), misconceptionId: "HALVED_COEFFICIENT", explanation: "dividing the coefficient by $2$ instead of cancelling the common factor $\\sqrt2$" },
    ],
    keyRule: "A cube face diagonal satisfies $d_f=a\\sqrt2$. Divide by $\\sqrt2$ to recover the side.",
    steps: [
      { title: "Write the Face-Diagonal Relation", body: "Use the square-face relation, not the cube space diagonal.", equation: `$$a\\sqrt2=${formatExactMath(diagonal)}$$` },
      { title: "Cancel the Common Surd", body: "Both sides contain $\\sqrt2$.", equation: `$$a=${side}\\text{ cm}$$` },
    ],
    shortcut: `Read the coefficient of $\\sqrt2$: it is the cube's side.`,
  };
}

function cuboidLsaDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const [length, breadth, height] = rng.pick(SAFE_CUBOIDS);
  const halfLsa = height * (length + breadth);
  const answer = q(2n * halfLsa);
  const tsa = 2n * (length * breadth + breadth * height + height * length);
  return {
    state: makeState(prototypeId, seed, "cm²", "UNIT", { length, breadth, height }, { answer }),
    stem: `A cuboidal column is ${dimension(length)} long, ${dimension(breadth)} broad and ${dimension(height)} high. Find the area of its four vertical faces.`,
    answer,
    wrongAnswers: [
      { value: q(tsa), misconceptionId: "USED_TSA", explanation: "including the top and bottom rectangles although only the vertical faces are required" },
      { value: q(halfLsa), misconceptionId: "COUNTED_ONE_OF_EACH_SIDE", explanation: "counting one $lh$ face and one $bh$ face but forgetting their opposite matching faces" },
      { value: q(length * breadth), misconceptionId: "USED_BASE_AREA", explanation: "reporting the horizontal base area instead of the four vertical faces" },
    ],
    keyRule: "The four vertical faces form two $l\\times h$ rectangles and two $b\\times h$ rectangles, so $LSA=2h(l+b)$.",
    steps: [
      { title: "Add One Face of Each Vertical Type", body: "One length-side wall and one breadth-side wall have total area $lh+bh=h(l+b)$.", equation: `$$h(l+b)=${height}(${length}+${breadth})=${halfLsa}\\text{ cm}^{2}$$` },
      { title: "Double for Opposite Walls", body: "Each vertical face type occurs twice.", equation: `$$LSA=2\\times${halfLsa}=${2n * halfLsa}\\text{ cm}^{2}$$` },
    ],
    shortcut: `Use perimeter of base × height: $2(l+b)h$.`,
  };
}

function cuboidHeightFromLsaDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const [length, breadth, height] = rng.pick(SAFE_CUBOIDS);
  const lsa = 2n * height * (length + breadth);
  const answer = q(height);
  return {
    state: makeState(prototypeId, seed, "cm", "UNIT", { length, breadth, height, lsa }, { answer }),
    stem: `A cuboid has lateral surface area $${lsa}\\text{ cm}^{2}$, length ${dimension(length)} and breadth ${dimension(breadth)}. Find its height.`,
    answer,
    wrongAnswers: [
      { value: q(2n * height), misconceptionId: "OMITTED_FACTOR_TWO", explanation: "dividing by $l+b$ but forgetting the factor $2$ in $LSA=2h(l+b)$" },
      { value: q(lsa, 2n), misconceptionId: "DIVIDED_BY_TWO_ONLY", explanation: "halving the lateral area but not dividing by the base semiperimeter $l+b$" },
      { value: q(lsa, 2n * length * breadth), misconceptionId: "USED_BASE_AREA", explanation: "dividing by the rectangular base area instead of the base perimeter" },
    ],
    keyRule: "Since $LSA=2h(l+b)$, divide the lateral area by the base perimeter $2(l+b)$ to recover the height.",
    steps: [
      { title: "Find the Base Perimeter", body: "The four vertical walls follow the full rectangular boundary.", equation: `$$2(l+b)=2(${length}+${breadth})=${2n * (length + breadth)}\\text{ cm}$$` },
      { title: "Divide Lateral Area by Base Perimeter", body: "Area divided by boundary length leaves the vertical height.", equation: `$$h=\\frac{${lsa}}{${2n * (length + breadth)}}=${height}\\text{ cm}$$` },
    ],
    shortcut: `Use $h=LSA/[2(l+b)]$ and calculate the base perimeter first.`,
  };
}

function cuboidHeightFromTsaDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const [length, breadth, height] = rng.pick(SAFE_CUBOIDS);
  const tsa = 2n * (length * breadth + height * (length + breadth));
  const answer = q(height);
  return {
    state: makeState(prototypeId, seed, "cm", "UNIT", { length, breadth, height, tsa }, { answer }),
    stem: `A closed cuboid has total surface area $${tsa}\\text{ cm}^{2}$, length ${dimension(length)} and breadth ${dimension(breadth)}. Find its height.`,
    answer,
    wrongAnswers: [
      { value: q(tsa, 2n * (length + breadth)), misconceptionId: "DID_NOT_REMOVE_BASE_PAIR", explanation: "dividing the full TSA by $2(l+b)$ without first removing the top and bottom areas" },
      { value: q(height, 2n), misconceptionId: "EXTRA_FACTOR_TWO", explanation: "dividing the recovered wall contribution by an extra factor of $2$" },
      { value: q(tsa, 2n * length * breadth), misconceptionId: "DIVIDED_BY_BASE_PAIR", explanation: "dividing by twice the base area rather than isolating the vertical-face term" },
    ],
    keyRule: "From $TSA=2[lb+h(l+b)]$, halve the TSA, subtract $lb$, then divide by $l+b$.",
    steps: [
      { title: "Remove the Outer Factor Two", body: "Halving TSA leaves one $lb$, one $lh$ and one $bh$ contribution.", equation: `$$\\frac{TSA}{2}=\\frac{${tsa}}{2}=${tsa / 2n}$$` },
      { title: "Remove the Base Contribution", body: "Subtract $lb$ to isolate $h(l+b)$.", equation: `$$h(l+b)=${tsa / 2n}-${length * breadth}=${height * (length + breadth)}$$` },
      { title: "Divide by the Sum of Base Dimensions", body: "The remaining factor is the height.", equation: `$$h=\\frac{${height * (length + breadth)}}{${length + breadth}}=${height}\\text{ cm}$$` },
    ],
    shortcut: `Use $h=(TSA/2-lb)/(l+b)$ directly.`,
  };
}

function prismLsaDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { baseArea, basePerimeter, height } = rng.pick(PRISM_STATES);
  const answer = q(basePerimeter * height);
  return {
    state: makeState(prototypeId, seed, "cm²", "UNIT", { baseArea, basePerimeter, height }, { answer }),
    stem: `A right prism has base perimeter $${basePerimeter}\\text{ cm}$ and height ${dimension(height)}. Find its lateral surface area.`,
    answer,
    wrongAnswers: [
      { value: q(basePerimeter * height + 2n * baseArea), misconceptionId: "USED_TSA", explanation: "adding the two base areas even though only the side faces are requested" },
      { value: q(basePerimeter * height, 2n), misconceptionId: "HALVED_LATERAL_AREA", explanation: "halving perimeter × height without any triangular-area factor being present" },
      { value: q(baseArea * height), misconceptionId: "USED_VOLUME", explanation: "multiplying base area by height, which gives volume rather than lateral area" },
    ],
    keyRule: "When a right prism is unfolded, its side faces form a rectangle whose width is the base perimeter and whose height is the prism height. Thus $LSA=Ph$.",
    steps: [
      { title: "Use the Base Perimeter", body: "The widths of all side faces add to the complete boundary of the base." },
      { title: "Multiply by the Prism Height", body: "Each side face extends through the same perpendicular height.", equation: `$$LSA=${basePerimeter}\\times${height}=${basePerimeter * height}\\text{ cm}^{2}$$` },
    ],
    shortcut: `Think of the opened side surface as one rectangle: perimeter × height.`,
  };
}

function prismTsaDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { baseArea, basePerimeter, height } = rng.pick(PRISM_STATES);
  const lsa = basePerimeter * height;
  const answer = q(lsa + 2n * baseArea);
  return {
    state: makeState(prototypeId, seed, "cm²", "UNIT", { baseArea, basePerimeter, height }, { lateralArea: q(lsa), answer }),
    stem: `A closed right prism has base area $${baseArea}\\text{ cm}^{2}$, base perimeter $${basePerimeter}\\text{ cm}$ and height ${dimension(height)}. Find its total surface area.`,
    answer,
    wrongAnswers: [
      { value: q(lsa), misconceptionId: "OMITTED_BOTH_BASES", explanation: "calculating perimeter × height but omitting both congruent bases" },
      { value: q(lsa + baseArea), misconceptionId: "ADDED_ONE_BASE", explanation: "adding only one base area although a closed prism has two congruent bases" },
      { value: q(2n * baseArea), misconceptionId: "BASES_ONLY", explanation: "counting the two bases but omitting every lateral face" },
    ],
    keyRule: "A closed right prism has lateral area $Ph$ plus two congruent bases, so $TSA=Ph+2A_{base}$.",
    steps: [
      { title: "Find the Lateral Area", body: "Multiply base perimeter by prism height.", equation: `$$LSA=${basePerimeter}\\times${height}=${lsa}\\text{ cm}^{2}$$` },
      { title: "Add Both Bases", body: "A closed prism includes two copies of the base region.", equation: `$$TSA=${lsa}+2\\times${baseArea}=${lsa + 2n * baseArea}\\text{ cm}^{2}$$` },
    ],
    shortcut: `Use $Ph+2A$ and keep perimeter and area roles separate.`,
  };
}

function prismHeightFromLsaDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { baseArea, basePerimeter, height } = rng.pick(PRISM_STATES);
  const lsa = basePerimeter * height;
  const answer = q(height);
  return {
    state: makeState(prototypeId, seed, "cm", "UNIT", { baseArea, basePerimeter, height, lsa }, { answer }),
    stem: `A right prism has lateral surface area $${lsa}\\text{ cm}^{2}$ and base perimeter $${basePerimeter}\\text{ cm}$. Find its height.`,
    answer,
    wrongAnswers: [
      { value: q(height, 2n), misconceptionId: "EXTRA_HALF_FACTOR", explanation: "dividing by twice the perimeter even though $LSA=Ph$ has no factor $2$" },
      { value: q(lsa, 2n), misconceptionId: "DIVIDED_BY_TWO_ONLY", explanation: "halving the lateral area but not dividing by the complete base perimeter" },
      { value: q(lsa, baseArea), misconceptionId: "USED_BASE_AREA", explanation: "dividing by base area, which belongs to the volume formula rather than the lateral-area formula" },
    ],
    keyRule: "For a right prism, $LSA=Ph$. Divide the lateral area by the base perimeter to recover the height.",
    steps: [
      { title: "Write the Lateral-Area Relation", body: "The side surface unfolds to perimeter × height.", equation: `$$${lsa}=${basePerimeter}\\times h$$` },
      { title: "Divide by the Base Perimeter", body: "Square units divided by length units leave a length.", equation: `$$h=\\frac{${lsa}}{${basePerimeter}}=${height}\\text{ cm}$$` },
    ],
    shortcut: `Use the unit check $\\text{cm}^{2}\\div\\text{cm}=\\text{cm}$.`,
  };
}

function hexagonalPrismDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const side = rng.pick([2n, 4n, 6n, 8n, 10n] as const);
  const height = rng.pick([5n, 7n, 9n, 11n, 13n] as const);
  const coefficient = (3n * side ** 2n * height) / 2n;
  const answer = surd(coefficient, 3n);
  return {
    state: makeState(prototypeId, seed, "cm³", "UNIT", { side, height }, { answer }),
    stem: `A right prism has a regular hexagonal base of side ${dimension(side)} and height ${dimension(height)}. Find its volume.`,
    answer,
    wrongAnswers: [
      { value: surd(side ** 2n * height, 3n, 2n), misconceptionId: "OMITTED_THREE_TRIANGLES", explanation: "using the area of one equilateral-triangle pair instead of all six triangles in the regular hexagon" },
      { value: surd(3n * side ** 2n * height, 3n), misconceptionId: "OMITTED_HALF_FACTOR", explanation: "doubling the regular-hexagon base area by omitting the factor $\\frac12$" },
      { value: q(6n * side * height), misconceptionId: "USED_PERIMETER_TIMES_HEIGHT", explanation: "calculating the prism's lateral area from base perimeter × height instead of its volume" },
    ],
    keyRule: "A regular hexagon is six equilateral triangles, so $A_{base}=\\frac{3\\sqrt3}{2}a^2$. A prism's volume is base area × height.",
    steps: [
      { title: "Find the Regular-Hexagon Base Area", body: "Use the six-triangle area relation.", equation: `$$A_{base}=\\frac{3\\sqrt3}{2}\\times${side}^2=${(3n * side ** 2n) / 2n}\\sqrt3\\text{ cm}^{2}$$` },
      { title: "Extend the Base Through the Prism Height", body: "Multiply the exact base area by the prism height.", equation: `$$V=${(3n * side ** 2n) / 2n}\\sqrt3\\times${height}=${coefficient}\\sqrt3\\text{ cm}^{3}$$` },
    ],
    shortcut: `Combine the rational factors first and keep $\\sqrt3$ exact to the end.`,
  };
}

function internalCapacityDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { length, breadth, height, thickness } = rng.pick(CAPACITY_STATES);
  const innerLength = length - 2n * thickness;
  const innerBreadth = breadth - 2n * thickness;
  const innerHeight = height - thickness;
  const innerVolume = innerLength * innerBreadth * innerHeight;
  const externalVolume = length * breadth * height;
  const oneThicknessVolume = (length - thickness) * (breadth - thickness) * (height - thickness);
  const answer = q(innerVolume, 1000n);
  return {
    state: makeState(prototypeId, seed, "litres", "UNIT", { length, breadth, height, thickness, innerLength, innerBreadth, innerHeight }, { innerVolume: q(innerVolume), answer }),
    stem: `An open-top rectangular container has external dimensions ${dimension(length)} × ${dimension(breadth)} × ${dimension(height)}. Its walls and base are ${dimension(thickness)} thick. Find its internal capacity in litres.`,
    answer,
    wrongAnswers: [
      { value: q(externalVolume, 1000n), misconceptionId: "USED_EXTERNAL_VOLUME", explanation: "using the external dimensions and ignoring the space occupied by the walls and base" },
      { value: q(oneThicknessVolume, 1000n), misconceptionId: "SUBTRACTED_ONE_WALL", explanation: "subtracting one thickness from length and breadth even though each has two opposite walls" },
      { value: q(innerVolume), misconceptionId: "DID_NOT_CONVERT_TO_LITRES", explanation: "reporting the internal cubic-centimetre value without dividing by $1000$ to obtain litres" },
    ],
    keyRule: "Capacity uses internal dimensions. Subtract two wall thicknesses from length and breadth, one base thickness from height for an open-top container, then convert $1000\\text{ cm}^{3}=1$ litre.",
    steps: [
      { title: "Find the Internal Dimensions", body: "Two side walls reduce length and breadth; only the base reduces the internal height.", equation: `$$L_i=${innerLength},\\quad B_i=${innerBreadth},\\quad H_i=${innerHeight}\\text{ cm}$$` },
      { title: "Find the Internal Volume", body: "Multiply the usable dimensions inside the container.", equation: `$$V_i=${innerLength}\\times${innerBreadth}\\times${innerHeight}=${innerVolume}\\text{ cm}^{3}$$` },
      { title: "Convert to Litres", body: "Divide cubic centimetres by $1000$.", equation: `$$Capacity=\\frac{${innerVolume}}{1000}=${formatExactMath(answer)}\\text{ litres}$$` },
    ],
    shortcut: `For an open-top box, use $(L-2t)(B-2t)(H-t)$ before converting to litres.`,
  };
}

function cutRemainderDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { length, breadth, height, smallSide } = rng.pick(REMAINDER_STATES);
  const alongLength = length / smallSide;
  const alongBreadth = breadth / smallSide;
  const alongHeight = height / smallSide;
  const count = alongLength * alongBreadth * alongHeight;
  const largeVolume = length * breadth * height;
  const cubeVolume = smallSide ** 3n;
  const usedVolume = count * cubeVolume;
  const remainder = largeVolume - usedVolume;
  const arithmeticRemainder = largeVolume % cubeVolume;
  const answer = q(remainder);
  return {
    state: makeState(prototypeId, seed, "cm³", "UNIT", { length, breadth, height, smallSide, alongLength, alongBreadth, alongHeight, count }, { usedVolume: q(usedVolume), answer }),
    stem: `A cuboidal block measuring ${dimension(length)} × ${dimension(breadth)} × ${dimension(height)} is cut into the maximum possible number of complete cubes of side ${dimension(smallSide)}, with all cubes aligned to the block's edges. Find the unused volume.`,
    answer,
    wrongAnswers: [
      { value: q(usedVolume), misconceptionId: "REPORTED_USED_VOLUME", explanation: "reporting the volume occupied by the complete cubes instead of the material left unused" },
      { value: q(cubeVolume), misconceptionId: "REPORTED_ONE_CUBE", explanation: "reporting the volume of one small cube rather than the leftover material" },
      { value: q(arithmeticRemainder), misconceptionId: "USED_SIMPLE_VOLUME_MODULUS", explanation: "using large volume modulo one cube's volume, which ignores the edge-aligned arrangement limits in three directions" },
    ],
    keyRule: "For edge-aligned cutting, count complete cubes along each dimension. The unused volume is large-block volume minus the volume of all complete cubes—not merely a one-dimensional remainder.",
    steps: [
      { title: "Count Complete Cubes Along Each Dimension", body: "Use integer division because partial cubes are not allowed.", equation: `$$${length}\\div${smallSide}=${alongLength},\\quad${breadth}\\div${smallSide}=${alongBreadth},\\quad${height}\\div${smallSide}=${alongHeight}$$` },
      { title: "Find the Volume Used by Complete Cubes", body: "Multiply the arrangement count by one cube's volume.", equation: `$$V_{used}=(${alongLength}\\times${alongBreadth}\\times${alongHeight})\\times${smallSide}^3=${usedVolume}\\text{ cm}^{3}$$` },
      { title: "Subtract from the Original Block", body: "The difference is the unusable remainder.", equation: `$$V_{unused}=${largeVolume}-${usedVolume}=${remainder}\\text{ cm}^{3}$$` },
    ],
    shortcut: `Use $LBH-\\lfloor L/a\\rfloor\\lfloor B/a\\rfloor\\lfloor H/a\\rfloor a^3$.`,
  };
}

function stackedCuboidDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { side, rows, columns, layers } = rng.pick(STACK_STATES);
  const totalCubes = rows * columns * layers;
  const height = layers * side;
  const answer = q(height);
  return {
    state: makeState(prototypeId, seed, "cm", "UNIT", { side, rows, columns, layers, totalCubes }, { answer }),
    stem: `$${totalCubes}$ identical cubes of side ${dimension(side)} are stacked to form a cuboid. Each horizontal layer contains $${rows}\\times${columns}$ cubes. Find the height of the cuboid.`,
    answer,
    wrongAnswers: [
      { value: q(totalCubes * side), misconceptionId: "MULTIPLIED_ALL_CUBES_BY_SIDE", explanation: "placing every cube in one vertical column instead of using the stated cubes per layer" },
      { value: q(rows * columns * side), misconceptionId: "USED_ONE_LAYER_COUNT", explanation: "multiplying the cubes in one horizontal layer by the side instead of finding the number of layers" },
      { value: q(layers), misconceptionId: "REPORTED_LAYER_COUNT", explanation: "reporting the number of layers without converting layers into a physical height" },
    ],
    keyRule: "Find the number of layers by dividing total cubes by cubes per layer, then multiply the layer count by one cube's side.",
    steps: [
      { title: "Find Cubes per Layer", body: "Each layer has the stated rectangular arrangement.", equation: `$$N_{layer}=${rows}\\times${columns}=${rows * columns}$$` },
      { title: "Find the Number of Layers", body: "Divide the total cube count by the count in one layer.", equation: `$$Layers=\\frac{${totalCubes}}{${rows * columns}}=${layers}$$` },
      { title: "Convert Layers into Height", body: "Each layer contributes one cube side vertically.", equation: `$$H=${layers}\\times${side}=${height}\\text{ cm}$$` },
    ],
    shortcut: `Height $=(Total\\ cubes/Cubes\\ per\\ layer)\\times side$.`,
  };
}

function cubeRatioDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string, rng: SeededRandom, surface: boolean): Draft {
  const [first, second] = rng.pick(RATIO_PAIRS);
  const power = surface ? 2n : 3n;
  const evidenceFirst = first ** power;
  const evidenceSecond = second ** power;
  const answer = q(first, second);
  const otherPowerFirst = first ** (surface ? 3n : 2n);
  const otherPowerSecond = second ** (surface ? 3n : 2n);
  const evidenceName = surface ? "total surface areas" : "volumes";
  const rootName = surface ? "square root" : "cube root";
  return {
    state: makeState(prototypeId, seed, "times", "RATIO", { first, second, evidenceFirst, evidenceSecond }, { evidenceRatio: q(evidenceFirst, evidenceSecond), answer }),
    stem: `The ${evidenceName} of two cubes are in the ratio $${evidenceFirst}:${evidenceSecond}$. Find the ratio of their side lengths.`,
    answer,
    wrongAnswers: [
      { value: q(evidenceFirst, evidenceSecond), misconceptionId: "COPIED_EVIDENCE_RATIO", explanation: `copying the ${evidenceName.slice(0, -1)} ratio without taking its ${rootName}` },
      { value: q(otherPowerFirst, otherPowerSecond), misconceptionId: "USED_WRONG_POWER", explanation: surface ? "cubing the side ratio even though surface area follows the square law" : "squaring the side ratio even though volume follows the cube law" },
      { value: q(second, first), misconceptionId: "REVERSED_RATIO", explanation: "reversing the order of the two cubes while extracting the side ratio" },
    ],
    keyRule: surface
      ? "For cubes, surface area scales as the square of side. Take the positive square root of each ratio term."
      : "For cubes, volume scales as the cube of side. Take the positive cube root of each ratio term.",
    steps: [
      { title: `Apply the ${surface ? "Square" : "Cube"} Scaling Law`, body: surface ? "$S_1:S_2=a_1^2:a_2^2$." : "$V_1:V_2=a_1^3:a_2^3$." },
      { title: `Take the ${surface ? "Square" : "Cube"} Root of Both Terms`, body: "Preserve the order of the two cubes.", equation: surface ? `$$a_1:a_2=\\sqrt{${evidenceFirst}}:\\sqrt{${evidenceSecond}}=${first}:${second}$$` : `$$a_1:a_2=\\sqrt[3]{${evidenceFirst}}:\\sqrt[3]{${evidenceSecond}}=${first}:${second}$$` },
    ],
    shortcut: `Recognise $${evidenceFirst}=${first}^{${power}}$ and $${evidenceSecond}=${second}^{${power}}$.`,
  };
}

export function classifyMenCp007Wave01Difficulty(state: MenCp007Wave01State): Men002Difficulty {
  const d = state.dimensions;
  switch (state.solveMode) {
    case "findCubeLateralSurfaceArea":
    case "findCubeSideFromTotalSurfaceArea":
      return d.side! >= 10n ? "Medium" : "Easy";
    case "findCubeFaceDiagonal":
    case "findCubeSideFromFaceDiagonal":
      return d.side! >= 10n ? "Hard" : "Medium";
    case "findCuboidLateralSurfaceArea":
      return d.length! >= 18n ? "Medium" : "Easy";
    case "findCuboidHeightFromLateralSurfaceArea":
    case "findCuboidHeightFromTotalSurfaceArea":
      return d.length! >= 18n ? "Hard" : "Medium";
    case "findPrismLateralSurfaceArea":
    case "findPrismTotalSurfaceArea":
      return d.height! >= 11n ? "Hard" : "Medium";
    case "findPrismHeightFromLateralSurfaceArea":
      return d.height! >= 11n ? "Hard" : "Medium";
    case "findRegularHexagonalPrismVolume":
      return d.side! >= 8n ? "Hard" : "Medium";
    case "findInternalCapacityFromExternalDimensionsAndThickness":
      return d.thickness! >= 3n || d.innerHeight! % 10n !== 0n ? "Hard" : "Medium";
    case "findUnusedVolumeAfterCuttingCubes":
      return d.smallSide! >= 4n ? "Hard" : "Medium";
    case "findStackedCuboidHeightFromCubeArrangement":
      return d.totalCubes! >= 80n ? "Hard" : "Medium";
    case "findCubeSideRatioFromVolumeRatio":
    case "findCubeSideRatioFromSurfaceAreaRatio":
      return d.second! >= 5n ? "Medium" : "Easy";
  }
}

function generateDraft(prototypeId: MenCp007Wave01PrototypeId, seed: string): Draft {
  const rng = createSeededRandom(`${prototypeId}:${seed}`);
  switch (prototypeId) {
    case "MEN-CP007-W1-PROT-CUBE-LSA": return cubeLsaDraft(prototypeId, seed, rng);
    case "MEN-CP007-W1-PROT-CUBE-SIDE-FROM-TSA": return cubeSideFromTsaDraft(prototypeId, seed, rng);
    case "MEN-CP007-W1-PROT-CUBE-FACE-DIAGONAL": return cubeFaceDiagonalDraft(prototypeId, seed, rng);
    case "MEN-CP007-W1-PROT-CUBE-SIDE-FROM-FACE-DIAGONAL": return cubeSideFromFaceDiagonalDraft(prototypeId, seed, rng);
    case "MEN-CP007-W1-PROT-CUBOID-LSA": return cuboidLsaDraft(prototypeId, seed, rng);
    case "MEN-CP007-W1-PROT-CUBOID-HEIGHT-FROM-LSA": return cuboidHeightFromLsaDraft(prototypeId, seed, rng);
    case "MEN-CP007-W1-PROT-CUBOID-HEIGHT-FROM-TSA": return cuboidHeightFromTsaDraft(prototypeId, seed, rng);
    case "MEN-CP007-W1-PROT-PRISM-LSA": return prismLsaDraft(prototypeId, seed, rng);
    case "MEN-CP007-W1-PROT-PRISM-TSA": return prismTsaDraft(prototypeId, seed, rng);
    case "MEN-CP007-W1-PROT-PRISM-HEIGHT-FROM-LSA": return prismHeightFromLsaDraft(prototypeId, seed, rng);
    case "MEN-CP007-W1-PROT-HEXAGONAL-PRISM-VOLUME": return hexagonalPrismDraft(prototypeId, seed, rng);
    case "MEN-CP007-W1-PROT-INTERNAL-CAPACITY-WITH-THICKNESS": return internalCapacityDraft(prototypeId, seed, rng);
    case "MEN-CP007-W1-PROT-CUT-CUBES-WITH-REMAINDER": return cutRemainderDraft(prototypeId, seed, rng);
    case "MEN-CP007-W1-PROT-CUBOID-FROM-STACKED-CUBES": return stackedCuboidDraft(prototypeId, seed, rng);
    case "MEN-CP007-W1-PROT-CUBE-SIDE-RATIO-FROM-VOLUME-RATIO": return cubeRatioDraft(prototypeId, seed, rng, false);
    case "MEN-CP007-W1-PROT-CUBE-SIDE-RATIO-FROM-SURFACE-RATIO": return cubeRatioDraft(prototypeId, seed, rng, true);
  }
}

function verifyDraft(draft: Draft) {
  const d = draft.state.dimensions;
  let reconstructed: ExactValue;
  let method: string;
  switch (draft.state.solveMode) {
    case "findCubeLateralSurfaceArea":
      reconstructed = q(4n * d.side! ** 2n);
      method = "enumerated four equal vertical square faces";
      break;
    case "findCubeSideFromTotalSurfaceArea": {
      const root = integerSquareRoot(d.tsa! / 6n);
      reconstructed = q(root ?? -1n);
      method = "divided TSA into six faces and recovered exact square side";
      break;
    }
    case "findCubeFaceDiagonal":
      reconstructed = exactFromSquaredLength(2n * d.side! ** 2n);
      method = "two-axis squared-length identity on one face";
      break;
    case "findCubeSideFromFaceDiagonal": {
      const candidate = asInteger(draft.answer);
      reconstructed = surd(candidate, 2n);
      method = "substituted candidate side into face diagonal a√2";
      return { valid: exactEquals(reconstructed, draft.state.derived.diagonal!), method, reconstructed: exactKey(reconstructed) };
    }
    case "findCuboidLateralSurfaceArea":
      reconstructed = q(2n * d.height! * (d.length! + d.breadth!));
      method = "summed four explicit vertical face areas";
      break;
    case "findCuboidHeightFromLateralSurfaceArea": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(2n * candidate * (d.length! + d.breadth!));
      method = "substituted candidate height into lateral-area evidence";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.lsa!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findCuboidHeightFromTotalSurfaceArea": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(2n * (d.length! * d.breadth! + candidate * (d.length! + d.breadth!)));
      method = "substituted candidate height into total surface evidence";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.tsa!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findPrismLateralSurfaceArea":
      reconstructed = q(d.basePerimeter! * d.height!);
      method = "unfolded lateral surface as perimeter by height rectangle";
      break;
    case "findPrismTotalSurfaceArea":
      reconstructed = q(d.basePerimeter! * d.height! + 2n * d.baseArea!);
      method = "reconstructed lateral area and added two bases";
      break;
    case "findPrismHeightFromLateralSurfaceArea": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(d.basePerimeter! * candidate);
      method = "substituted candidate height into prism lateral-area evidence";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.lsa!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findRegularHexagonalPrismVolume":
      reconstructed = surd(3n * d.side! ** 2n * d.height!, 3n, 2n);
      method = "six-equilateral-triangle base reconstruction times prism height";
      break;
    case "findInternalCapacityFromExternalDimensionsAndThickness": {
      const innerVolume = (d.length! - 2n * d.thickness!) * (d.breadth! - 2n * d.thickness!) * (d.height! - d.thickness!);
      reconstructed = q(innerVolume, 1000n);
      method = "reconstructed internal dimensions then converted cubic centimetres to litres";
      break;
    }
    case "findUnusedVolumeAfterCuttingCubes": {
      const count = (d.length! / d.smallSide!) * (d.breadth! / d.smallSide!) * (d.height! / d.smallSide!);
      reconstructed = q(d.length! * d.breadth! * d.height! - count * d.smallSide! ** 3n);
      method = "dimension-wise complete-cube count and volume subtraction";
      break;
    }
    case "findStackedCuboidHeightFromCubeArrangement":
      reconstructed = q((d.totalCubes! / (d.rows! * d.columns!)) * d.side!);
      method = "reconstructed layer count from total and per-layer arrangement";
      break;
    case "findCubeSideRatioFromVolumeRatio": {
      const candidate = requireRational(draft.answer);
      reconstructed = q(candidate.numerator ** 3n, candidate.denominator ** 3n);
      method = "cubed candidate side ratio to reconstruct volume ratio";
      return { valid: exactEquals(reconstructed, draft.state.derived.evidenceRatio!), method, reconstructed: exactKey(reconstructed) };
    }
    case "findCubeSideRatioFromSurfaceAreaRatio": {
      const candidate = requireRational(draft.answer);
      reconstructed = q(candidate.numerator ** 2n, candidate.denominator ** 2n);
      method = "squared candidate side ratio to reconstruct surface-area ratio";
      return { valid: exactEquals(reconstructed, draft.state.derived.evidenceRatio!), method, reconstructed: exactKey(reconstructed) };
    }
  }
  return { valid: exactEquals(reconstructed, draft.answer), method, reconstructed: exactKey(reconstructed) };
}

function optionDisplay(value: ExactValue, state: MenCp007Wave01State) {
  return state.displayMode === "RATIO" ? formatRatio(value) : formatWithUnit(value, state.unit);
}

function buildOptions(draft: Draft, rng: SeededRandom) {
  const candidates = [
    { value: draft.answer, misconceptionId: null, explanation: "" },
    ...draft.wrongAnswers,
  ];
  if (new Set(candidates.map((candidate) => exactKey(candidate.value))).size !== 4) {
    throw new Error(`${draft.state.prototypeId} generated duplicate exact option values.`);
  }
  const labels = ["A", "B", "C", "D"] as const;
  const shuffled = rng.shuffle(candidates);
  const options: MenCp007Wave01Option[] = shuffled.map((candidate, index) => ({
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

function validatePackage(question: Omit<MenCp007Wave01Package, "validation">) {
  const serialised = JSON.stringify(question, (_key, value) => typeof value === "bigint" ? value.toString() : value);
  const explanationText = [
    question.explanation.keyRule,
    ...question.explanation.steps.flatMap((step) => [step.body, step.equation ?? ""]),
    question.explanation.shortcut,
    ...question.explanation.traps,
  ].join("\n");
  const checks = [
    { name: "independent verifier", passed: question.verification.valid, message: "Independent verification must agree with the answer." },
    { name: "four exact options", passed: question.options.length === 4 && new Set(question.options.map((option) => exactKey(option.value))).size === 4, message: "Exactly four unique exact options are required." },
    { name: "one correct option", passed: question.options.filter((option) => option.isCorrect).length === 1, message: "Exactly one option must be correct." },
    { name: "state-derived difficulty", passed: question.difficulty === classifyMenCp007Wave01Difficulty(question.state), message: "Difficulty must derive from canonical state." },
    { name: "four-tier teaching", passed: Boolean(question.explanation.keyRule) && question.explanation.steps.length >= 2 && Boolean(question.explanation.shortcut) && question.explanation.traps.length === 3, message: "Rule, steps, shortcut and three traps are required." },
    { name: "MathJax cleanliness", passed: !/[½¼²³]/.test(serialised) && !/(^|[^\\])sqrt\{/.test(explanationText), message: "Use MathJax fractions, powers and square roots." },
    { name: "lifecycle lock", passed: question.permanentQlId === null && !question.publiclyPublishable && !question.questionStudioDiscoverable, message: "Wave prototypes must remain unallocated and unpublished." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp007Wave01Prototype(
  prototypeId: MenCp007Wave01PrototypeId,
  seed: string,
): MenCp007Wave01Package {
  const draft = generateDraft(prototypeId, seed);
  draft.state.difficulty = classifyMenCp007Wave01Difficulty(draft.state);
  const verification = verifyDraft(draft);
  const { options, traps } = buildOptions(draft, createSeededRandom(`${prototypeId}:${seed}:options`));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const partial = {
    packageId: "MEN-002" as const,
    canonicalProblemId: "MEN-CP-007" as const,
    permanentQlId: null,
    waveId: "MEN-CP-007-GAP-WAVE-01" as const,
    prototypeId,
    solveMode: draft.state.solveMode,
    language: "en" as const,
    seed,
    difficulty: draft.state.difficulty,
    target: draft.state.target,
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
