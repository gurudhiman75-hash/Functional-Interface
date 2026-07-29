import {
  exactEquals,
  exactFromSquaredLength,
  exactKey,
  formatIndianInteger,
  formatWithUnit,
  integerCubeRoot,
  integerSquareRoot,
  isPositive,
  rational,
} from "../foundation/exact";
import { polishMenCp007English } from "../foundation/editorial";
import { createSeededRandom, type SeededRandom } from "../foundation/seed";
import type {
  ExactRational,
  ExactValue,
  Men002Difficulty,
  Men002Unit,
} from "../foundation/types";
import { getMenCp007Wave02Prototype } from "./registry";
import type {
  MenCp007Wave02Option,
  MenCp007Wave02Package,
  MenCp007Wave02PrototypeId,
  MenCp007Wave02State,
} from "./types";

interface WrongAnswer {
  value: ExactValue;
  misconceptionId: string;
  explanation: string;
}

interface Draft {
  state: MenCp007Wave02State;
  stem: string;
  answer: ExactValue;
  wrongAnswers: [WrongAnswer, WrongAnswer, WrongAnswer];
  keyRule: string;
  steps: MenCp007Wave02Package["explanation"]["steps"];
  shortcut: string;
}

const FACE_DIAGONAL_STATES = [
  { length: 3n, breadth: 4n, diagonal: 5n },
  { length: 5n, breadth: 12n, diagonal: 13n },
  { length: 8n, breadth: 15n, diagonal: 17n },
  { length: 7n, breadth: 24n, diagonal: 25n },
  { length: 20n, breadth: 21n, diagonal: 29n },
] as const;
const PRISM_STATES = [
  { baseArea: 24n, basePerimeter: 20n, height: 7n },
  { baseArea: 30n, basePerimeter: 22n, height: 9n },
  { baseArea: 42n, basePerimeter: 26n, height: 11n },
  { baseArea: 54n, basePerimeter: 30n, height: 13n },
  { baseArea: 70n, basePerimeter: 34n, height: 15n },
] as const;
const TRAPEZOID_PRISM_STATES = [
  { parallelA: 8n, parallelB: 14n, trapezoidHeight: 6n, prismLength: 10n },
  { parallelA: 10n, parallelB: 18n, trapezoidHeight: 8n, prismLength: 12n },
  { parallelA: 12n, parallelB: 20n, trapezoidHeight: 9n, prismLength: 15n },
  { parallelA: 15n, parallelB: 25n, trapezoidHeight: 10n, prismLength: 18n },
  { parallelA: 18n, parallelB: 30n, trapezoidHeight: 12n, prismLength: 20n },
] as const;
const MIXED_UNIT_STATES = [
  { lengthMetres: 2n, breadthCm: 200n, heightCm: 100n },
  { lengthMetres: 3n, breadthCm: 150n, heightCm: 100n },
  { lengthMetres: 4n, breadthCm: 250n, heightCm: 60n },
  { lengthMetres: 5n, breadthCm: 180n, heightCm: 40n },
  { lengthMetres: 6n, breadthCm: 125n, heightCm: 90n },
] as const;
const BRICK_STATES = [
  { wallL: 240n, wallB: 120n, wallH: 60n, brickL: 20n, brickB: 10n, brickH: 6n },
  { wallL: 300n, wallB: 180n, wallH: 90n, brickL: 25n, brickB: 15n, brickH: 10n },
  { wallL: 280n, wallB: 140n, wallH: 80n, brickL: 20n, brickB: 10n, brickH: 8n },
  { wallL: 320n, wallB: 200n, wallH: 120n, brickL: 20n, brickB: 10n, brickH: 10n },
  { wallL: 270n, wallB: 150n, wallH: 90n, brickL: 15n, brickB: 10n, brickH: 5n },
] as const;
const CUBOID_STATES = [
  { length: 12n, breadth: 8n, height: 5n },
  { length: 14n, breadth: 9n, height: 6n },
  { length: 16n, breadth: 10n, height: 7n },
  { length: 18n, breadth: 12n, height: 8n },
  { length: 20n, breadth: 11n, height: 9n },
] as const;
const CUBE_SIDES = [3n, 5n, 7n, 8n, 9n, 10n, 11n, 12n, 13n, 14n] as const;
const RATE_STATES = [
  { length: 6n, breadth: 4n, height: 3n, rate: 5n },
  { length: 8n, breadth: 5n, height: 4n, rate: 7n },
  { length: 10n, breadth: 6n, height: 5n, rate: 9n },
  { length: 12n, breadth: 7n, height: 6n, rate: 11n },
  { length: 14n, breadth: 8n, height: 7n, rate: 13n },
] as const;
const EQUAL_VOLUME_STATES = [
  { oldL: 12n, oldB: 8n, oldH: 10n, newL: 15n, newB: 8n, newH: 8n },
  { oldL: 14n, oldB: 9n, oldH: 12n, newL: 21n, newB: 8n, newH: 9n },
  { oldL: 16n, oldB: 10n, oldH: 9n, newL: 24n, newB: 10n, newH: 6n },
  { oldL: 18n, oldB: 12n, oldH: 10n, newL: 20n, newB: 18n, newH: 6n },
  { oldL: 20n, oldB: 15n, oldH: 12n, newL: 30n, newB: 24n, newH: 5n },
] as const;
const RATIO_PAIRS = [
  [2n, 3n],
  [3n, 4n],
  [4n, 5n],
  [2n, 5n],
  [3n, 5n],
] as const;
const MATERIAL_COST_STATES = [
  { length: 4n, breadth: 3n, height: 2n, rate: 6n },
  { length: 5n, breadth: 4n, height: 3n, rate: 8n },
  { length: 6n, breadth: 5n, height: 4n, rate: 9n },
  { length: 8n, breadth: 6n, height: 5n, rate: 11n },
  { length: 10n, breadth: 7n, height: 6n, rate: 13n },
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
  prototypeId: MenCp007Wave02PrototypeId,
  seed: string,
  unit: Men002Unit,
  displayMode: "UNIT" | "RATIO",
  dimensions: Record<string, bigint>,
  derived: Record<string, ExactValue>,
): MenCp007Wave02State {
  const definition = getMenCp007Wave02Prototype(prototypeId);
  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-007",
    permanentQlId: null,
    waveId: "MEN-CP-007-GAP-WAVE-02",
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

function cuboidFaceDiagonalDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { length, breadth, diagonal } = rng.pick(FACE_DIAGONAL_STATES);
  const answer = q(diagonal);
  return {
    state: makeState(prototypeId, seed, "cm", "UNIT", { length, breadth, diagonal }, { answer }),
    stem: `A rectangular face of a cuboid is ${dimension(length)} long and ${dimension(breadth)} broad. Find the diagonal across that face.`,
    answer,
    wrongAnswers: [
      { value: q(length + breadth), misconceptionId: "ADDED_SIDES", explanation: "adding the two perpendicular side lengths instead of combining their squares" },
      { value: q(length > breadth ? length : breadth), misconceptionId: "USED_LONGER_SIDE", explanation: "reporting the longer edge although the diagonal joins opposite corners" },
      { value: q(length - breadth < 0n ? breadth - length : length - breadth), misconceptionId: "SUBTRACTED_SIDES", explanation: "subtracting the side lengths instead of using Pythagoras" },
    ],
    keyRule: "A face diagonal lies in one rectangle, so $d_f^2=l^2+b^2$. The cuboid's third dimension is not used.",
    steps: [
      { title: "Square the Two Face Dimensions", body: "Only the length and breadth of the chosen face are perpendicular components.", equation: `$$d_f^2=${length}^2+${breadth}^2=${diagonal ** 2n}$$` },
      { title: "Take the Positive Square Root", body: "A length is positive.", equation: `$$d_f=\\sqrt{${diagonal ** 2n}}=${diagonal}\\text{ cm}$$` },
    ],
    shortcut: `Recognise the Pythagorean triplet $${length},${breadth},${diagonal}$.`,
  };
}

function cuboidBreadthFromFaceDiagonalDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { length, breadth, diagonal } = rng.pick(FACE_DIAGONAL_STATES);
  const answer = q(breadth);
  return {
    state: makeState(prototypeId, seed, "cm", "UNIT", { length, breadth, diagonal }, { answer }),
    stem: `A rectangular face of a cuboid has length ${dimension(length)} and diagonal ${dimension(diagonal)}. Find the breadth of that face.`,
    answer,
    wrongAnswers: [
      { value: q(diagonal - length), misconceptionId: "SUBTRACTED_LENGTHS", explanation: "subtracting the length directly from the diagonal instead of subtracting their squares" },
      { value: q(diagonal + length), misconceptionId: "ADDED_LENGTHS", explanation: "adding the diagonal and length even though they form a right-triangle relation" },
      { value: exactFromSquaredLength(diagonal ** 2n + length ** 2n), misconceptionId: "ADDED_SQUARES_IN_INVERSE", explanation: "adding $d^2+l^2$ instead of using $b^2=d^2-l^2$" },
    ],
    keyRule: "From $d_f^2=l^2+b^2$, isolate the missing breadth: $b=\\sqrt{d_f^2-l^2}$.",
    steps: [
      { title: "Subtract the Known Squared Length", body: "Move $l^2$ to the other side of the Pythagorean identity.", equation: `$$b^2=${diagonal}^2-${length}^2=${breadth ** 2n}$$` },
      { title: "Take the Positive Square Root", body: "The breadth is the positive length that reconstructs the diagonal.", equation: `$$b=\\sqrt{${breadth ** 2n}}=${breadth}\\text{ cm}$$` },
    ],
    shortcut: `Use the known Pythagorean triple and recover the missing leg.`,
  };
}

function prismBaseAreaFromVolumeDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { baseArea, basePerimeter, height } = rng.pick(PRISM_STATES);
  const volume = baseArea * height;
  const answer = q(baseArea);
  return {
    state: makeState(prototypeId, seed, "cm²", "UNIT", { baseArea, basePerimeter, height, volume }, { answer }),
    stem: `A right prism has volume $${volume}\\text{ cm}^{3}$ and height ${dimension(height)}. Find its base area.`,
    answer,
    wrongAnswers: [
      { value: q(volume * height), misconceptionId: "MULTIPLIED_BY_HEIGHT", explanation: "multiplying the volume by the height instead of dividing out the repeated height" },
      { value: q(volume, 2n * height), misconceptionId: "EXTRA_HALF_FACTOR", explanation: "introducing an unnecessary factor $2$ into $V=A_{base}h$" },
      { value: q(volume), misconceptionId: "REPORTED_VOLUME_NUMBER", explanation: "changing the unit label without dividing the cubic measure by the prism height" },
    ],
    keyRule: "A right prism has $V=A_{base}h$. Divide volume by height to recover the constant cross-sectional area.",
    steps: [
      { title: "Write the Prism Volume Relation", body: "The same base area continues through the full height.", equation: `$$${volume}=A_{base}\\times${height}$$` },
      { title: "Divide by the Height", body: "Cubic units divided by length units leave square units.", equation: `$$A_{base}=\\frac{${volume}}{${height}}=${baseArea}\\text{ cm}^{2}$$` },
    ],
    shortcut: `Use the unit check $\\text{cm}^{3}\\div\\text{cm}=\\text{cm}^{2}$.`,
  };
}

function prismBasePerimeterFromLsaDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { baseArea, basePerimeter, height } = rng.pick(PRISM_STATES);
  const lsa = basePerimeter * height;
  const answer = q(basePerimeter);
  return {
    state: makeState(prototypeId, seed, "cm", "UNIT", { baseArea, basePerimeter, height, lsa }, { answer }),
    stem: `A right prism has lateral surface area $${lsa}\\text{ cm}^{2}$ and height ${dimension(height)}. Find the perimeter of its base.`,
    answer,
    wrongAnswers: [
      { value: q(lsa * height), misconceptionId: "MULTIPLIED_BY_HEIGHT", explanation: "multiplying the lateral area by height instead of dividing by height" },
      { value: q(lsa, 2n * height), misconceptionId: "EXTRA_HALF_FACTOR", explanation: "dividing by twice the height although $LSA=Ph$ has no factor $2$" },
      { value: q(lsa), misconceptionId: "REPORTED_AREA_NUMBER", explanation: "reporting the square-unit lateral area as though it were a boundary length" },
    ],
    keyRule: "For a right prism, $LSA=Ph$. Divide the lateral area by the prism height to recover the base perimeter.",
    steps: [
      { title: "Use the Unfolded-Side Relation", body: "The side surface is base perimeter × height.", equation: `$$${lsa}=P\\times${height}$$` },
      { title: "Divide by the Height", body: "Square units divided by height leave a boundary length.", equation: `$$P=\\frac{${lsa}}{${height}}=${basePerimeter}\\text{ cm}$$` },
    ],
    shortcut: `Here $P=\\frac{${lsa}}{${height}}=${basePerimeter}\\text{ cm}$; divide the lateral area by the prism height once.`,
  };
}

function prismBaseAreaFromTsaDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { baseArea, basePerimeter, height } = rng.pick(PRISM_STATES);
  const lateralArea = basePerimeter * height;
  const tsa = lateralArea + 2n * baseArea;
  const answer = q(baseArea);
  return {
    state: makeState(prototypeId, seed, "cm²", "UNIT", { baseArea, basePerimeter, height, lateralArea, tsa }, { answer }),
    stem: `A closed right prism has total surface area $${tsa}\\text{ cm}^{2}$, base perimeter $${basePerimeter}\\text{ cm}$ and height ${dimension(height)}. Find the area of one base.`,
    answer,
    wrongAnswers: [
      { value: q(tsa, 2n), misconceptionId: "HALVED_TSA_DIRECTLY", explanation: "halving the complete TSA before removing the lateral surface" },
      { value: q(2n * baseArea), misconceptionId: "FORGOT_TWO_BASES_DIVISION", explanation: "subtracting the lateral area but reporting the combined area of both bases" },
      { value: q(lateralArea), misconceptionId: "REPORTED_LATERAL_AREA", explanation: "reporting $Ph$, which is the side surface rather than one base" },
    ],
    keyRule: "For a closed prism, $TSA=Ph+2A_{base}$. Remove the lateral area, then divide the remaining two-base area by $2$.",
    steps: [
      { title: "Find the Lateral Surface", body: "Multiply base perimeter by prism height.", equation: `$$Ph=${basePerimeter}\\times${height}=${lateralArea}\\text{ cm}^{2}$$` },
      { title: "Remove the Lateral Area", body: "The remainder belongs to the two congruent bases.", equation: `$$2A_{base}=${tsa}-${lateralArea}=${2n * baseArea}$$` },
      { title: "Find One Base Area", body: "Divide the combined base area equally between two bases.", equation: `$$A_{base}=\\frac{${2n * baseArea}}{2}=${baseArea}\\text{ cm}^{2}$$` },
    ],
    shortcut: `Use $A_{base}=(TSA-Ph)/2$.`,
  };
}

function trapezoidalPrismDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { parallelA, parallelB, trapezoidHeight, prismLength } = rng.pick(TRAPEZOID_PRISM_STATES);
  const baseArea = ((parallelA + parallelB) * trapezoidHeight) / 2n;
  const volume = baseArea * prismLength;
  const answer = q(volume);
  return {
    state: makeState(prototypeId, seed, "cm³", "UNIT", { parallelA, parallelB, trapezoidHeight, prismLength }, { baseArea: q(baseArea), answer }),
    stem: `A right prism has a trapezoidal base whose parallel sides are ${dimension(parallelA)} and ${dimension(parallelB)}, with perpendicular distance ${dimension(trapezoidHeight)}. The prism length is ${dimension(prismLength)}. Find its volume.`,
    answer,
    wrongAnswers: [
      { value: q((parallelA + parallelB) * trapezoidHeight * prismLength), misconceptionId: "OMITTED_TRAPEZOID_HALF", explanation: "omitting the factor $\\frac12$ in the trapezoid base area and doubling the volume" },
      { value: q(baseArea), misconceptionId: "STOPPED_AT_BASE_AREA", explanation: "finding the trapezoidal cross-section but not extending it through the prism length" },
      { value: q((parallelA + parallelB + trapezoidHeight) * prismLength), misconceptionId: "USED_LENGTH_SUM", explanation: "using a sum of base lengths instead of the trapezoid area" },
    ],
    keyRule: "A prism's volume is base area × prism length. Here the base is a trapezoid: $A=\\frac12(a+b)h$.",
    steps: [
      { title: "Find the Trapezoidal Base Area", body: "Add the parallel sides, multiply by their perpendicular distance and halve.", equation: `$$A_{base}=\\frac12(${parallelA}+${parallelB})${trapezoidHeight}=${baseArea}\\text{ cm}^{2}$$` },
      { title: "Extend Through the Prism Length", body: "Multiply the constant cross-section by the prism length.", equation: `$$V=${baseArea}\\times${prismLength}=${volume}\\text{ cm}^{3}$$` },
    ],
    shortcut: `Halve one even factor before multiplying by the prism length.`,
  };
}

function mixedUnitCuboidDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { lengthMetres, breadthCm, heightCm } = rng.pick(MIXED_UNIT_STATES);
  const answer = q(lengthMetres * breadthCm * heightCm, 10_000n);
  const oneConversionOnly = q(lengthMetres * breadthCm * heightCm, 100n);
  const noConversion = q(lengthMetres * breadthCm * heightCm);
  const cubicCentimetreNumber = q(lengthMetres * breadthCm * heightCm * 100n);
  return {
    state: makeState(prototypeId, seed, "m³", "UNIT", { lengthMetres, breadthCm, heightCm }, { answer }),
    stem: `A cuboid is ${dimension(lengthMetres, "m")} long, ${dimension(breadthCm)} broad and ${dimension(heightCm)} high. Find its volume in cubic metres.`,
    answer,
    wrongAnswers: [
      { value: noConversion, misconceptionId: "MIXED_UNITS_DIRECTLY", explanation: "multiplying metre and centimetre values without first using one common linear unit" },
      { value: oneConversionOnly, misconceptionId: "CONVERTED_ONE_DIMENSION", explanation: "converting only one of the two centimetre dimensions into metres" },
      { value: cubicCentimetreNumber, misconceptionId: "USED_CM_CUBED_NUMBER_AS_M_CUBED", explanation: "computing a cubic-centimetre number and relabelling it as cubic metres" },
    ],
    keyRule: "All three linear dimensions must use the same unit before multiplication. Convert each centimetre dimension to metres, then apply $V=lbh$.",
    steps: [
      { title: "Convert Both Centimetre Dimensions", body: "$100\\text{ cm}=1\\text{ m}$, so divide each centimetre length by $100$.", equation: `$$b=\\frac{${breadthCm}}{100}\\text{ m},\\quad h=\\frac{${heightCm}}{100}\\text{ m}$$` },
      { title: "Multiply the Three Metre Dimensions", body: "The result is automatically in cubic metres.", equation: `$$V=${lengthMetres}\\times\\frac{${breadthCm}}{100}\\times\\frac{${heightCm}}{100}=${answer.kind === "RATIONAL" && answer.denominator === 1n ? answer.numerator : `\\frac{${requireRational(answer).numerator}}{${requireRational(answer).denominator}}`}\\text{ m}^{3}$$` },
    ],
    shortcut: `Two centimetre dimensions contribute a combined denominator $100^2=10,000$.`,
  };
}

function brickCountDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(BRICK_STATES);
  const alongL = state.wallL / state.brickL;
  const alongB = state.wallB / state.brickB;
  const alongH = state.wallH / state.brickH;
  const count = alongL * alongB * alongH;
  const answer = q(count);
  return {
    state: makeState(prototypeId, seed, "bricks", "UNIT", { ...state, alongL, alongB, alongH }, { answer }),
    stem: `Ignoring mortar, how many bricks of dimensions ${dimension(state.brickL)} × ${dimension(state.brickB)} × ${dimension(state.brickH)} are required to build a rectangular wall of dimensions ${dimension(state.wallL)} × ${dimension(state.wallB)} × ${dimension(state.wallH)}?`,
    answer,
    wrongAnswers: [
      { value: q((state.wallL * state.wallB * state.wallH) / state.brickL), misconceptionId: "DIVIDED_BY_ONE_BRICK_DIMENSION", explanation: "dividing wall volume by only one brick length instead of one brick's complete volume" },
      { value: q(alongL + alongB + alongH), misconceptionId: "ADDED_DIRECTION_COUNTS", explanation: "adding the brick counts along three directions instead of multiplying them" },
      { value: q(alongL * alongB), misconceptionId: "COUNTED_ONE_LAYER", explanation: "counting one wall layer but omitting the number of layers through the third dimension" },
    ],
    keyRule: "With no mortar and exact divisibility, count bricks along each dimension and multiply the three direction counts.",
    steps: [
      { title: "Count Bricks Along Each Dimension", body: "Divide each wall dimension by the matching brick dimension.", equation: `$$${state.wallL}\\div${state.brickL}=${alongL},\\quad${state.wallB}\\div${state.brickB}=${alongB},\\quad${state.wallH}\\div${state.brickH}=${alongH}$$` },
      { title: "Multiply Rows, Columns and Layers", body: "Each position in one direction combines with all positions in the other two.", equation: `$$N=${alongL}\\times${alongB}\\times${alongH}=${count}\\text{ bricks}$$` },
    ],
    shortcut: `Use wall volume ÷ brick volume only after confirming exact fit and no mortar.`,
  };
}

function cuboidEdgeLengthDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { length, breadth, height } = rng.pick(CUBOID_STATES);
  const answer = q(4n * (length + breadth + height));
  return {
    state: makeState(prototypeId, seed, "cm", "UNIT", { length, breadth, height }, { answer }),
    stem: `A wire frame is made along all edges of a cuboid measuring ${dimension(length)} × ${dimension(breadth)} × ${dimension(height)}. Find the total wire length.`,
    answer,
    wrongAnswers: [
      { value: q(2n * (length + breadth)), misconceptionId: "USED_BASE_PERIMETER", explanation: "counting only the four edges around one rectangular base" },
      { value: q(length + breadth + height), misconceptionId: "COUNTED_ONE_OF_EACH_EDGE", explanation: "adding one length, one breadth and one height instead of all four of each" },
      { value: q(2n * (length + breadth + height)), misconceptionId: "COUNTED_TWO_OF_EACH_EDGE", explanation: "counting two of each edge length although a cuboid has four parallel edges of each type" },
    ],
    keyRule: "A cuboid has four edges of length $l$, four of breadth $b$ and four of height $h$. Total edge length is $4(l+b+h)$.",
    steps: [
      { title: "Group Parallel Edges", body: "There are four edges in each of the three dimension directions." },
      { title: "Add One of Each Type and Multiply by Four", body: "This counts all twelve edges exactly once.", equation: `$$E=4(${length}+${breadth}+${height})=${4n * (length + breadth + height)}\\text{ cm}$$` },
    ],
    shortcut: `A cuboid always has $12$ edges: four copies of each dimension.`,
  };
}

function cubeSideFromEdgesDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const side = rng.pick(CUBE_SIDES);
  const totalEdgeLength = 12n * side;
  const answer = q(side);
  return {
    state: makeState(prototypeId, seed, "cm", "UNIT", { side, totalEdgeLength }, { answer }),
    stem: `The total length of all twelve edges of a cube is ${dimension(totalEdgeLength)}. Find the side of the cube.`,
    answer,
    wrongAnswers: [
      { value: q(3n * side), misconceptionId: "DIVIDED_BY_FOUR", explanation: "dividing by four as though the cube had only four edges" },
      { value: q(2n * side), misconceptionId: "DIVIDED_BY_SIX", explanation: "dividing by six instead of the cube's twelve equal edges" },
      { value: q(totalEdgeLength), misconceptionId: "REPORTED_TOTAL_EDGE_LENGTH", explanation: "reporting the combined wire length rather than one edge" },
    ],
    keyRule: "A cube has twelve equal edges, so total edge length $E=12a$ and $a=E/12$.",
    steps: [
      { title: "Use the Twelve Equal Edges", body: "Every edge has the same side length $a$.", equation: `$$${totalEdgeLength}=12a$$` },
      { title: "Divide by Twelve", body: "This isolates one edge.", equation: `$$a=\\frac{${totalEdgeLength}}{12}=${side}\\text{ cm}$$` },
    ],
    shortcut: `Divide total cube-frame wire by $12$.`,
  };
}

function paintingRateDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { length, breadth, height, rate } = rng.pick(RATE_STATES);
  const tsa = 2n * (length * breadth + breadth * height + height * length);
  const lsa = 2n * height * (length + breadth);
  const cost = tsa * rate;
  const answer = q(rate);
  return {
    state: makeState(prototypeId, seed, "₹/m²", "UNIT", { length, breadth, height, rate, tsa, lsa, cost }, { answer }),
    stem: `Painting all six faces of a closed cuboidal display box costs $\\text{₹}${formatIndianInteger(cost)}$. The box measures ${dimension(length, "m")} × ${dimension(breadth, "m")} × ${dimension(height, "m")}. Find the painting rate per square metre.`,
    answer,
    wrongAnswers: [
      { value: q(cost, lsa), misconceptionId: "USED_LATERAL_AREA", explanation: "dividing by the four-wall area and omitting the top and bottom from the painted area" },
      { value: q(2n * rate), misconceptionId: "USED_HALF_TSA", explanation: "dividing the cost by $lb+bh+hl$ instead of the full $2(lb+bh+hl)$" },
      { value: q(cost), misconceptionId: "REPORTED_TOTAL_COST", explanation: "reporting the total bill as though it were the rate for one square metre" },
    ],
    keyRule: "Rate equals total cost divided by the actual painted area. For all six faces of a closed cuboid, use $TSA=2(lb+bh+hl)$.",
    steps: [
      { title: "Find the Painted Area", body: "All six faces are included.", equation: `$$TSA=2(${length * breadth}+${breadth * height}+${height * length})=${tsa}\\text{ m}^{2}$$` },
      { title: "Divide Cost by Area", body: "Rupees divided by square metres gives rupees per square metre.", equation: `$$Rate=\\frac{\\text{₹}${formatIndianInteger(cost)}}{${tsa}\\text{ m}^{2}}=\\frac{\\text{₹}${formatIndianInteger(rate)}}{\\text{m}^{2}}$$` },
    ],
    shortcut: `For this box, $Rate=\\frac{\\text{₹}${formatIndianInteger(cost)}}{${tsa}\\text{ m}^{2}}=\\frac{\\text{₹}${formatIndianInteger(rate)}}{\\text{m}^{2}}$.`,
  };
}

function equalVolumeHeightDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(EQUAL_VOLUME_STATES);
  const volume = state.oldL * state.oldB * state.oldH;
  const answer = q(state.newH);
  const oppositeScaling = q(state.oldH * state.newL * state.newB, state.oldL * state.oldB);
  return {
    state: makeState(prototypeId, seed, "cm", "UNIT", { ...state, volume }, { answer }),
    stem: `A cuboid measuring ${dimension(state.oldL)} × ${dimension(state.oldB)} × ${dimension(state.oldH)} is reshaped without changing its volume. The new length and breadth are ${dimension(state.newL)} and ${dimension(state.newB)}. Find the new height.`,
    answer,
    wrongAnswers: [
      { value: q(state.oldH), misconceptionId: "KEPT_OLD_HEIGHT", explanation: "keeping the old height even though the new base area has changed" },
      { value: oppositeScaling, misconceptionId: "APPLIED_SCALE_FACTOR_IN_WRONG_DIRECTION", explanation: "multiplying the old height by the new-to-old base-area ratio instead of the old-to-new ratio" },
      { value: q(volume, state.newL), misconceptionId: "DIVIDED_BY_ONE_NEW_DIMENSION", explanation: "dividing the conserved volume by the new length but not by the new breadth" },
    ],
    keyRule: "Equal volume means $lbh=L'B'H'$. The new height equals conserved volume divided by the new base area.",
    steps: [
      { title: "Find the Conserved Volume", body: "Multiply the original three dimensions.", equation: `$$V=${state.oldL}\\times${state.oldB}\\times${state.oldH}=${volume}\\text{ cm}^{3}$$` },
      { title: "Find the New Base Area", body: "Multiply the new length and breadth.", equation: `$$A'=${state.newL}\\times${state.newB}=${state.newL * state.newB}\\text{ cm}^{2}$$` },
      { title: "Divide Volume by New Base Area", body: "This gives the height required to preserve volume.", equation: `$$H'=\\frac{${volume}}{${state.newL * state.newB}}=${state.newH}\\text{ cm}$$` },
    ],
    shortcut: `Divide the conserved old volume by the new base area.`,
  };
}

function cubeRatioConversionDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string, rng: SeededRandom, volumeToSurface: boolean): Draft {
  const [first, second] = rng.pick(RATIO_PAIRS);
  const evidencePower = volumeToSurface ? 3n : 2n;
  const answerPower = volumeToSurface ? 2n : 3n;
  const evidenceFirst = first ** evidencePower;
  const evidenceSecond = second ** evidencePower;
  const answerFirst = first ** answerPower;
  const answerSecond = second ** answerPower;
  const answer = q(answerFirst, answerSecond);
  const sourceMeasure = volumeToSurface ? "volumes" : "total surface areas";
  const targetMeasure = volumeToSurface ? "total surface areas" : "volumes";
  return {
    state: makeState(prototypeId, seed, "times", "RATIO", { first, second, evidenceFirst, evidenceSecond, answerFirst, answerSecond }, { answer }),
    stem: `The ${sourceMeasure} of two cubes are in the ratio $${evidenceFirst}:${evidenceSecond}$. Find the ratio of their ${targetMeasure}.`,
    answer,
    wrongAnswers: [
      { value: q(evidenceFirst, evidenceSecond), misconceptionId: "COPIED_SOURCE_RATIO", explanation: `copying the ${sourceMeasure.slice(0, -1)} ratio without first recovering the side ratio` },
      { value: q(first, second), misconceptionId: "STOPPED_AT_SIDE_RATIO", explanation: "taking the required root correctly but stopping at the side ratio instead of converting to the target measure" },
      { value: q(answerSecond, answerFirst), misconceptionId: "REVERSED_TARGET_RATIO", explanation: "reversing the order of the two cubes while forming the target ratio" },
    ],
    keyRule: volumeToSurface
      ? "Volume follows the cube of side and surface area follows the square. Recover the side ratio with cube roots, then square it."
      : "Surface area follows the square of side and volume follows the cube. Recover the side ratio with square roots, then cube it.",
    steps: [
      { title: "Recover the Side Ratio", body: volumeToSurface ? "Take cube roots of the volume-ratio terms." : "Take square roots of the surface-area-ratio terms.", equation: volumeToSurface ? `$$a_1:a_2=\\sqrt[3]{${evidenceFirst}}:\\sqrt[3]{${evidenceSecond}}=${first}:${second}$$` : `$$a_1:a_2=\\sqrt{${evidenceFirst}}:\\sqrt{${evidenceSecond}}=${first}:${second}$$` },
      { title: `Apply the ${volumeToSurface ? "Square" : "Cube"} Law`, body: `Convert the side ratio into the ${targetMeasure.slice(0, -1)} ratio.`, equation: `$$${first}^{${answerPower}}:${second}^{${answerPower}}=${answerFirst}:${answerSecond}$$` },
    ],
    shortcut: `Move from power ${evidencePower} to side power $1$, then to target power ${answerPower}.`,
  };
}

function materialCostDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { length, breadth, height, rate } = rng.pick(MATERIAL_COST_STATES);
  const volume = length * breadth * height;
  const tsa = 2n * (length * breadth + breadth * height + height * length);
  const baseArea = length * breadth;
  const cost = volume * rate;
  const answer = q(cost);
  return {
    state: makeState(prototypeId, seed, "₹", "UNIT", { length, breadth, height, rate, volume }, { answer }),
    stem: `A solid cuboidal block measures ${dimension(length, "m")} × ${dimension(breadth, "m")} × ${dimension(height, "m")}. Material costs $\\text{₹}${formatIndianInteger(rate)}$ per cubic metre. Find the total material cost.`,
    answer,
    wrongAnswers: [
      { value: q(volume), misconceptionId: "REPORTED_VOLUME", explanation: "stopping at the block's volume and not applying the price per cubic metre" },
      { value: q(tsa * rate), misconceptionId: "USED_SURFACE_AREA_RATE", explanation: "multiplying total surface area by the cubic-metre rate" },
      { value: q(baseArea * rate), misconceptionId: "OMITTED_HEIGHT", explanation: "pricing only the rectangular base area and omitting the block's height" },
    ],
    keyRule: "Material cost at a cubic-metre rate equals volume × rate. Keep the rate dimension aligned with the measured quantity.",
    steps: [
      { title: "Find the Solid Volume", body: "Multiply the three metre dimensions.", equation: `$$V=${length}\\times${breadth}\\times${height}=${volume}\\text{ m}^{3}$$` },
      { title: "Apply the Cubic-Metre Rate", body: `Multiply by $\\text{₹}${formatIndianInteger(rate)}$ for each cubic metre.`, equation: `$$Cost=${volume}\\times\\text{₹}${formatIndianInteger(rate)}=\\text{₹}${formatIndianInteger(cost)}$$` },
    ],
    shortcut: `Here $V=${volume}\\text{ m}^{3}$, so $Cost=${volume}\\times\\text{₹}${formatIndianInteger(rate)}=\\text{₹}${formatIndianInteger(cost)}$.`,
  };
}

export function classifyMenCp007Wave02Difficulty(state: MenCp007Wave02State): Men002Difficulty {
  const d = state.dimensions;
  switch (state.solveMode) {
    case "findCuboidFaceDiagonal":
    case "findCuboidBreadthFromFaceDiagonal":
      return d.diagonal! >= 17n ? "Hard" : "Medium";
    case "findPrismBaseAreaFromVolume":
    case "findPrismBasePerimeterFromLateralSurfaceArea":
    case "findPrismBaseAreaFromTotalSurfaceArea":
      return d.height! >= 11n ? "Hard" : "Medium";
    case "findTrapezoidalPrismVolume":
      return d.prismLength! >= 15n ? "Hard" : "Medium";
    case "findCuboidVolumeFromMixedLinearUnits":
      return d.breadthCm! % 100n === 0n || d.heightCm! % 100n === 0n ? "Medium" : "Hard";
    case "findBrickCountInWall":
      return d.wallL! / d.brickL! >= 16n ? "Hard" : "Medium";
    case "findCuboidTotalEdgeLength":
      return d.length! >= 18n ? "Medium" : "Easy";
    case "findCubeSideFromTotalEdgeLength":
      return d.side! >= 10n ? "Medium" : "Easy";
    case "findPaintingRateFromCost":
      return d.rate! >= 9n ? "Hard" : "Medium";
    case "findNewHeightForEqualCuboidVolume":
      return d.newL! * d.newB! >= 200n ? "Hard" : "Medium";
    case "findCubeSurfaceAreaRatioFromVolumeRatio":
    case "findCubeVolumeRatioFromSurfaceAreaRatio":
      return d.second! >= 5n ? "Medium" : "Easy";
    case "findMaterialCostFromCuboidVolume":
      return d.volume! >= 200n || d.rate! >= 11n ? "Hard" : "Medium";
  }
}

function generateDraft(prototypeId: MenCp007Wave02PrototypeId, seed: string): Draft {
  const rng = createSeededRandom(`${prototypeId}:${seed}`);
  switch (prototypeId) {
    case "MEN-CP007-W2-PROT-CUBOID-FACE-DIAGONAL": return cuboidFaceDiagonalDraft(prototypeId, seed, rng);
    case "MEN-CP007-W2-PROT-CUBOID-BREADTH-FROM-FACE-DIAGONAL": return cuboidBreadthFromFaceDiagonalDraft(prototypeId, seed, rng);
    case "MEN-CP007-W2-PROT-PRISM-BASE-AREA-FROM-VOLUME": return prismBaseAreaFromVolumeDraft(prototypeId, seed, rng);
    case "MEN-CP007-W2-PROT-PRISM-BASE-PERIMETER-FROM-LSA": return prismBasePerimeterFromLsaDraft(prototypeId, seed, rng);
    case "MEN-CP007-W2-PROT-PRISM-BASE-AREA-FROM-TSA": return prismBaseAreaFromTsaDraft(prototypeId, seed, rng);
    case "MEN-CP007-W2-PROT-TRAPEZOIDAL-PRISM-VOLUME": return trapezoidalPrismDraft(prototypeId, seed, rng);
    case "MEN-CP007-W2-PROT-MIXED-UNIT-CUBOID-VOLUME": return mixedUnitCuboidDraft(prototypeId, seed, rng);
    case "MEN-CP007-W2-PROT-BRICK-COUNT-IN-WALL": return brickCountDraft(prototypeId, seed, rng);
    case "MEN-CP007-W2-PROT-CUBOID-TOTAL-EDGE-LENGTH": return cuboidEdgeLengthDraft(prototypeId, seed, rng);
    case "MEN-CP007-W2-PROT-CUBE-SIDE-FROM-TOTAL-EDGE-LENGTH": return cubeSideFromEdgesDraft(prototypeId, seed, rng);
    case "MEN-CP007-W2-PROT-PAINTING-RATE-FROM-COST": return paintingRateDraft(prototypeId, seed, rng);
    case "MEN-CP007-W2-PROT-EQUAL-VOLUME-NEW-HEIGHT": return equalVolumeHeightDraft(prototypeId, seed, rng);
    case "MEN-CP007-W2-PROT-CUBE-SURFACE-RATIO-FROM-VOLUME-RATIO": return cubeRatioConversionDraft(prototypeId, seed, rng, true);
    case "MEN-CP007-W2-PROT-CUBE-VOLUME-RATIO-FROM-SURFACE-RATIO": return cubeRatioConversionDraft(prototypeId, seed, rng, false);
    case "MEN-CP007-W2-PROT-MATERIAL-COST-FROM-VOLUME": return materialCostDraft(prototypeId, seed, rng);
  }
}

function verifyDraft(draft: Draft) {
  const d = draft.state.dimensions;
  let reconstructed: ExactValue;
  let method: string;
  switch (draft.state.solveMode) {
    case "findCuboidFaceDiagonal":
      reconstructed = exactFromSquaredLength(d.length! ** 2n + d.breadth! ** 2n);
      method = "two-dimensional face Pythagorean reconstruction";
      break;
    case "findCuboidBreadthFromFaceDiagonal": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(d.length! ** 2n + candidate ** 2n);
      method = "substituted candidate breadth into face-diagonal squared identity";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.diagonal! ** 2n, method, reconstructed: exactKey(reconstructed) };
    }
    case "findPrismBaseAreaFromVolume": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(candidate * d.height!);
      method = "substituted candidate base area into prism volume";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.volume!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findPrismBasePerimeterFromLateralSurfaceArea": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(candidate * d.height!);
      method = "substituted candidate perimeter into lateral-area relation";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.lsa!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findPrismBaseAreaFromTotalSurfaceArea": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(d.basePerimeter! * d.height! + 2n * candidate);
      method = "substituted candidate base area into prism TSA";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.tsa!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findTrapezoidalPrismVolume":
      reconstructed = q((d.parallelA! + d.parallelB!) * d.trapezoidHeight! * d.prismLength!, 2n);
      method = "trapezoid base-area reconstruction times prism length";
      break;
    case "findCuboidVolumeFromMixedLinearUnits":
      reconstructed = q(d.lengthMetres! * d.breadthCm! * d.heightCm!, 10_000n);
      method = "converted both centimetre dimensions to metres before multiplication";
      break;
    case "findBrickCountInWall":
      reconstructed = q((d.wallL! / d.brickL!) * (d.wallB! / d.brickB!) * (d.wallH! / d.brickH!));
      method = "dimension-wise exact brick arrangement count";
      break;
    case "findCuboidTotalEdgeLength":
      reconstructed = q(4n * (d.length! + d.breadth! + d.height!));
      method = "enumerated four parallel edges of each dimension";
      break;
    case "findCubeSideFromTotalEdgeLength": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(12n * candidate);
      method = "substituted candidate side into twelve-edge total";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.totalEdgeLength!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findPaintingRateFromCost": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(d.tsa! * candidate);
      method = "substituted candidate rate into cost equals area times rate";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.cost!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findNewHeightForEqualCuboidVolume": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(d.newL! * d.newB! * candidate);
      method = "substituted candidate height into new equal-volume cuboid";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.volume!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findCubeSurfaceAreaRatioFromVolumeRatio": {
  const candidate = requireRational(draft.answer);
  const sideNumerator = integerSquareRoot(candidate.numerator);
  const sideDenominator = integerSquareRoot(candidate.denominator);
  if (sideNumerator === null || sideDenominator === null) {
    return { valid: false, method: "candidate surface ratio was not a perfect-square ratio", reconstructed: exactKey(candidate) };
  }
  reconstructed = q(sideNumerator ** 3n, sideDenominator ** 3n);
  method = "square-rooted candidate surface ratio to side ratio, then cubed it to reconstruct volume ratio";
  return { valid: exactEquals(reconstructed, q(d.evidenceFirst!, d.evidenceSecond!)), method, reconstructed: exactKey(reconstructed) };
}
case "findCubeVolumeRatioFromSurfaceAreaRatio": {
  const candidate = requireRational(draft.answer);
  const sideNumerator = integerCubeRoot(candidate.numerator);
  const sideDenominator = integerCubeRoot(candidate.denominator);
  reconstructed = q(sideNumerator ** 2n, sideDenominator ** 2n);
  method = "cube-rooted candidate volume ratio to side ratio, then squared it to reconstruct surface ratio";
  return { valid: exactEquals(reconstructed, q(d.evidenceFirst!, d.evidenceSecond!)), method, reconstructed: exactKey(reconstructed) };
}    case "findMaterialCostFromCuboidVolume":
      reconstructed = q(d.length! * d.breadth! * d.height! * d.rate!);
      method = "reconstructed cuboid volume then applied cubic-metre rate";
      break;
  }
  return { valid: exactEquals(reconstructed, draft.answer), method, reconstructed: exactKey(reconstructed) };
}

function optionDisplay(value: ExactValue, state: MenCp007Wave02State) {
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
  const options: MenCp007Wave02Option[] = rng.shuffle(candidates).map((candidate, index) => ({
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

function validatePackage(question: Omit<MenCp007Wave02Package, "validation">) {
  const explanationText = [
    question.explanation.keyRule,
    ...question.explanation.steps.flatMap((step) => [step.body, step.equation ?? ""]),
    question.explanation.shortcut,
    ...question.explanation.traps,
  ].join("\n");
  const learnerText = [question.stem, ...question.options.map((option) => option.display), question.answer, explanationText].join("\n");
  const checks = [
    { name: "independent verifier", passed: question.verification.valid, message: "Independent verification must agree with the answer." },
    { name: "four exact options", passed: question.options.length === 4 && new Set(question.options.map((option) => exactKey(option.value))).size === 4, message: "Exactly four unique exact options are required." },
    { name: "one correct option", passed: question.options.filter((option) => option.isCorrect).length === 1, message: "Exactly one option must be correct." },
    { name: "state-derived difficulty", passed: question.difficulty === classifyMenCp007Wave02Difficulty(question.state), message: "Difficulty must derive from canonical state." },
    { name: "four-tier teaching", passed: Boolean(question.explanation.keyRule) && question.explanation.steps.length >= 2 && Boolean(question.explanation.shortcut) && question.explanation.traps.length === 3, message: "Rule, steps, shortcut and three traps are required." },
    { name: "MathJax cleanliness", passed: !/[½¼²³]/.test(learnerText) && !/(^|[^\\])sqrt\{/.test(explanationText) && !/\$\$[^$]*\/[^$]*\$\$/.test(explanationText), message: "Use MathJax fractions, powers, roots and division." },
    { name: "lifecycle lock", passed: question.permanentQlId === null && !question.publiclyPublishable && !question.questionStudioDiscoverable, message: "Wave prototypes must remain unallocated and unpublished." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp007Wave02Prototype(
  prototypeId: MenCp007Wave02PrototypeId,
  seed: string,
): MenCp007Wave02Package {
  const draft = generateDraft(prototypeId, seed);
  draft.state.difficulty = classifyMenCp007Wave02Difficulty(draft.state);
  const verification = verifyDraft(draft);
  const { options, traps } = buildOptions(draft, createSeededRandom(`${prototypeId}:${seed}:options`));
  const polished = polishMenCp007English({
    stem: draft.stem,
    options,
    keyRule: draft.keyRule,
    steps: draft.steps,
    shortcut: draft.shortcut,
    traps,
  });
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const partial = {
    packageId: "MEN-002" as const,
    canonicalProblemId: "MEN-CP-007" as const,
    permanentQlId: null,
    waveId: "MEN-CP-007-GAP-WAVE-02" as const,
    prototypeId,
    solveMode: draft.state.solveMode,
    language: "en" as const,
    seed,
    difficulty: draft.state.difficulty,
    target: draft.state.target,
    stem: polished.stem,
    options: polished.options,
    correctIndex,
    answer: polished.options[correctIndex]!.display,
    exactAnswer: draft.answer,
    unit: draft.state.unit,
    explanation: polished.explanation,
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
