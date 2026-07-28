import {
  exactEquals,
  exactFromSquaredLength,
  exactKey,
  formatWithUnit,
  integerCubeRoot,
  integerSquareRoot,
  isPositive,
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
import { getMenCp007Wave03Prototype } from "./registry";
import type {
  MenCp007Wave03Option,
  MenCp007Wave03Package,
  MenCp007Wave03PrototypeId,
  MenCp007Wave03State,
} from "./types";

interface WrongAnswer {
  value: ExactValue;
  misconceptionId: string;
  explanation: string;
}

interface Draft {
  state: MenCp007Wave03State;
  stem: string;
  answer: ExactValue;
  wrongAnswers: [WrongAnswer, WrongAnswer, WrongAnswer];
  keyRule: string;
  steps: MenCp007Wave03Package["explanation"]["steps"];
  shortcut: string;
}

const HEIGHT_DIAGONAL_STATES = [
  { length: 3n, breadth: 4n, height: 12n, diagonal: 13n },
  { length: 6n, breadth: 8n, height: 24n, diagonal: 26n },
  { length: 9n, breadth: 12n, height: 20n, diagonal: 25n },
  { length: 12n, breadth: 16n, height: 15n, diagonal: 25n },
  { length: 9n, breadth: 12n, height: 36n, diagonal: 39n },
] as const;

const BASE_AREA_PERIMETER_STATES = [
  { longer: 12n, shorter: 8n },
  { longer: 15n, shorter: 9n },
  { longer: 18n, shorter: 10n },
  { longer: 20n, shorter: 12n },
  { longer: 24n, shorter: 14n },
] as const;

const VOLUME_RATIO_STATES = [
  { ratioL: 3n, ratioB: 2n, scale: 4n, height: 5n },
  { ratioL: 4n, ratioB: 3n, scale: 5n, height: 6n },
  { ratioL: 5n, ratioB: 3n, scale: 4n, height: 7n },
  { ratioL: 5n, ratioB: 4n, scale: 6n, height: 8n },
  { ratioL: 7n, ratioB: 5n, scale: 4n, height: 9n },
] as const;

const CUBE_SIDES = [4n, 5n, 7n, 8n, 9n, 11n] as const;

const EQUAL_VOLUME_STATES = [
  { side: 6n, length: 3n, breadth: 6n, height: 12n },
  { side: 8n, length: 4n, breadth: 8n, height: 16n },
  { side: 10n, length: 5n, breadth: 10n, height: 20n },
  { side: 12n, length: 6n, breadth: 12n, height: 24n },
  { side: 14n, length: 7n, breadth: 14n, height: 28n },
] as const;

const VOLUME_COMPARISON_STATES = [
  { cubeSide: 10n, length: 8n, breadth: 7n, height: 6n },
  { cubeSide: 12n, length: 10n, breadth: 8n, height: 7n },
  { cubeSide: 14n, length: 12n, breadth: 9n, height: 8n },
  { cubeSide: 16n, length: 14n, breadth: 10n, height: 9n },
  { cubeSide: 18n, length: 15n, breadth: 12n, height: 10n },
] as const;

const ROTATION_STATES = [
  { box: [12n, 11n, 11n], block: [5n, 3n, 2n] },
  { box: [15n, 13n, 11n], block: [4n, 3n, 2n] },
  { box: [18n, 15n, 13n], block: [4n, 3n, 2n] },
  { box: [20n, 17n, 14n], block: [6n, 5n, 4n] },
  { box: [24n, 19n, 16n], block: [5n, 4n, 2n] },
] as const;

const WASTE_STATES = [
  { length: 13n, breadth: 10n, height: 8n, cubeSide: 3n },
  { length: 17n, breadth: 11n, height: 9n, cubeSide: 4n },
  { length: 22n, breadth: 15n, height: 11n, cubeSide: 4n },
  { length: 19n, breadth: 14n, height: 10n, cubeSide: 3n },
  { length: 27n, breadth: 16n, height: 13n, cubeSide: 5n },
] as const;

const GRID_CUT_STATES = [
  { alongLength: 4n, alongBreadth: 3n, alongHeight: 2n, side: 3n },
  { alongLength: 5n, alongBreadth: 4n, alongHeight: 3n, side: 2n },
  { alongLength: 6n, alongBreadth: 5n, alongHeight: 4n, side: 2n },
  { alongLength: 7n, alongBreadth: 4n, alongHeight: 3n, side: 3n },
  { alongLength: 8n, alongBreadth: 5n, alongHeight: 3n, side: 2n },
] as const;

const WIRE_COST_STATES = [
  { length: 6n, breadth: 4n, height: 3n, rate: 5n },
  { length: 8n, breadth: 5n, height: 4n, rate: 7n },
  { length: 10n, breadth: 6n, height: 5n, rate: 9n },
  { length: 12n, breadth: 7n, height: 6n, rate: 11n },
  { length: 14n, breadth: 8n, height: 7n, rate: 13n },
] as const;

const WIRE_RATE_STATES = [
  { side: 4n, rate: 3n },
  { side: 6n, rate: 5n },
  { side: 8n, rate: 7n },
  { side: 10n, rate: 9n },
  { side: 12n, rate: 11n },
] as const;

const PAINT_STATES = [
  { length: 12n, breadth: 8n, height: 5n },
  { length: 14n, breadth: 9n, height: 6n },
  { length: 16n, breadth: 10n, height: 7n },
  { length: 18n, breadth: 12n, height: 8n },
  { length: 20n, breadth: 11n, height: 9n },
] as const;

const PRISM_STATES = [
  { baseArea: 24n, basePerimeter: 20n, height: 7n },
  { baseArea: 30n, basePerimeter: 22n, height: 9n },
  { baseArea: 42n, basePerimeter: 26n, height: 11n },
  { baseArea: 54n, basePerimeter: 30n, height: 13n },
  { baseArea: 70n, basePerimeter: 34n, height: 15n },
] as const;

const L_SHAPE_STATES = [
  { outerLength: 12n, outerBreadth: 10n, cutLength: 4n, cutBreadth: 3n, prismHeight: 6n },
  { outerLength: 15n, outerBreadth: 12n, cutLength: 5n, cutBreadth: 4n, prismHeight: 8n },
  { outerLength: 18n, outerBreadth: 14n, cutLength: 6n, cutBreadth: 5n, prismHeight: 10n },
  { outerLength: 20n, outerBreadth: 16n, cutLength: 7n, cutBreadth: 6n, prismHeight: 12n },
  { outerLength: 24n, outerBreadth: 18n, cutLength: 8n, cutBreadth: 7n, prismHeight: 15n },
] as const;

const MIXED_BRICK_STATES = [
  { wallLMetres: 3n, wallBMetres: 2n, wallHMetres: 1n, brickL: 25n, brickB: 10n, brickH: 10n },
  { wallLMetres: 4n, wallBMetres: 3n, wallHMetres: 1n, brickL: 20n, brickB: 15n, brickH: 10n },
  { wallLMetres: 5n, wallBMetres: 2n, wallHMetres: 1n, brickL: 25n, brickB: 10n, brickH: 5n },
  { wallLMetres: 6n, wallBMetres: 4n, wallHMetres: 2n, brickL: 25n, brickB: 20n, brickH: 10n },
  { wallLMetres: 8n, wallBMetres: 3n, wallHMetres: 2n, brickL: 20n, brickB: 15n, brickH: 10n },
] as const;

const ORIENTATIONS = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
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

function makeState(
  prototypeId: MenCp007Wave03PrototypeId,
  seed: string,
  unit: Men002Unit,
  dimensions: Record<string, bigint>,
  derived: Record<string, ExactValue>,
): MenCp007Wave03State {
  const definition = getMenCp007Wave03Prototype(prototypeId);
  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-007",
    permanentQlId: null,
    waveId: "MEN-CP-007-GAP-WAVE-03",
    prototypeId,
    solveMode: definition.solveMode,
    target: definition.target,
    shape: definition.shape,
    seed,
    difficulty: "Easy",
    dimensions,
    derived,
    unit,
    displayMode: "UNIT",
  };
}

function heightFromSpaceDiagonalDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(HEIGHT_DIAGONAL_STATES);
  const answer = q(state.height);
  const faceDiagonal = exactFromSquaredLength(state.length ** 2n + state.breadth ** 2n);
  return {
    state: makeState(prototypeId, seed, "cm", { ...state }, { faceDiagonal, answer }),
    stem: `A cuboid has length ${dimension(state.length)}, breadth ${dimension(state.breadth)} and space diagonal ${dimension(state.diagonal)}. Find its height.`,
    answer,
    wrongAnswers: [
      { value: q(state.diagonal - state.length), misconceptionId: "SUBTRACTED_LENGTH", explanation: "subtracting the length directly from the diagonal instead of subtracting squared components" },
      { value: q(state.diagonal - state.breadth), misconceptionId: "SUBTRACTED_BREADTH", explanation: "subtracting the breadth directly from the diagonal instead of using the three-dimensional Pythagorean relation" },
      { value: faceDiagonal, misconceptionId: "FOUND_FACE_DIAGONAL", explanation: "combining only length and breadth and reporting the base-face diagonal" },
    ],
    keyRule: "For a cuboid, $d^2=l^2+b^2+h^2$. Isolate the missing height with $h=\\sqrt{d^2-l^2-b^2}$.",
    steps: [
      { title: "Remove the Two Known Squared Components", body: "Subtract the squared length and squared breadth from the squared space diagonal.", equation: `$$h^2=${state.diagonal}^2-${state.length}^2-${state.breadth}^2=${state.height ** 2n}$$` },
      { title: "Take the Positive Square Root", body: "Height is a positive length.", equation: `$$h=\\sqrt{${state.height ** 2n}}=${state.height}\\text{ cm}$$` },
    ],
    shortcut: `Check the three-dimensional Pythagorean identity before taking the root.`,
  };
}

function longerBaseSideDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const { longer, shorter } = rng.pick(BASE_AREA_PERIMETER_STATES);
  const area = longer * shorter;
  const perimeter = 2n * (longer + shorter);
  const semiperimeter = perimeter / 2n;
  const answer = q(longer);
  return {
    state: makeState(prototypeId, seed, "cm", { longer, shorter, area, perimeter }, { answer }),
    stem: `The rectangular base of a cuboid has area $${area}\\text{ cm}^{2}$ and perimeter $${perimeter}\\text{ cm}$. Find the longer side of the base.`,
    answer,
    wrongAnswers: [
      { value: q(shorter), misconceptionId: "REPORTED_SHORTER_SIDE", explanation: "selecting the smaller factor even though the longer side is requested" },
      { value: q(semiperimeter), misconceptionId: "REPORTED_SIDE_SUM", explanation: "reporting $l+b$ as one side rather than finding two factors with that sum" },
      { value: q(area, semiperimeter), misconceptionId: "DIVIDED_AREA_BY_SUM", explanation: "dividing area by $l+b$ instead of finding the two numbers whose product is the area and whose sum is the semiperimeter" },
    ],
    keyRule: "If a rectangle has area $lb$ and perimeter $2(l+b)$, its sides are the two positive numbers with product equal to the area and sum equal to half the perimeter.",
    steps: [
      { title: "Find the Sum of the Two Sides", body: "Half the perimeter equals $l+b$.", equation: `$$l+b=\\frac{${perimeter}}{2}=${semiperimeter}$$` },
      { title: "Use the Area as the Product", body: `Find two factors of $${area}$ whose sum is $${semiperimeter}$.`, equation: `$$${longer}\\times${shorter}=${area},\\quad${longer}+${shorter}=${semiperimeter}$$` },
      { title: "Choose the Longer Factor", body: "The question asks for the larger of the two recovered sides.", equation: `$$Longer\\ side=${longer}\\text{ cm}$$` },
    ],
    shortcut: `List factor pairs of the area and choose the pair whose sum is half the perimeter.`,
  };
}

function lengthFromVolumeRatioDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(VOLUME_RATIO_STATES);
  const length = state.ratioL * state.scale;
  const breadth = state.ratioB * state.scale;
  const baseArea = length * breadth;
  const volume = baseArea * state.height;
  const answer = q(length);
  return {
    state: makeState(prototypeId, seed, "cm", { ...state, length, breadth, baseArea, volume }, { answer }),
    stem: `A cuboid has volume $${volume}\\text{ cm}^{3}$ and height ${dimension(state.height)}. Its length and breadth are in the ratio $${state.ratioL}:${state.ratioB}$. Find its length.`,
    answer,
    wrongAnswers: [
      { value: q(breadth), misconceptionId: "REPORTED_BREADTH", explanation: "using the smaller ratio term and reporting the breadth instead of the length" },
      { value: q(state.scale), misconceptionId: "STOPPED_AT_SCALE", explanation: "finding the common ratio scale but not multiplying it by the length-ratio term" },
      { value: q(state.ratioL * state.scale ** 2n), misconceptionId: "OMITTED_SQUARE_ROOT", explanation: "treating the base-area scale as $k$ instead of $k^2$" },
    ],
    keyRule: "Let length $=pk$ and breadth $=qk$. Then $V=pqk^2h$, so recover $k$ from the base area before finding the requested dimension.",
    steps: [
      { title: "Find the Base Area", body: "Divide volume by height.", equation: `$$lb=\\frac{${volume}}{${state.height}}=${baseArea}\\text{ cm}^{2}$$` },
      { title: "Recover the Common Ratio Scale", body: `Since $l:b=${state.ratioL}:${state.ratioB}$, write $l=${state.ratioL}k$ and $b=${state.ratioB}k$.`, equation: `$$${state.ratioL * state.ratioB}k^2=${baseArea}\\Rightarrow k=${state.scale}$$` },
      { title: "Find the Length", body: "Multiply the common scale by the length-ratio term.", equation: `$$l=${state.ratioL}\\times${state.scale}=${length}\\text{ cm}$$` },
    ],
    shortcut: `After finding base area, divide by the ratio product and take the square root to get the common scale.`,
  };
}

function cubeSideFromSurfaceDifferenceDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const side = rng.pick(CUBE_SIDES);
  const difference = 2n * side ** 2n;
  const answer = q(side);
  return {
    state: makeState(prototypeId, seed, "cm", { side, difference }, { answer }),
    stem: `For a cube, the total surface area exceeds the lateral surface area by $${difference}\\text{ cm}^{2}$. Find the side of the cube.`,
    answer,
    wrongAnswers: [
      { value: q(side ** 2n), misconceptionId: "STOPPED_AT_FACE_AREA", explanation: "dividing the difference by $2$ but reporting $a^2$ instead of taking its square root" },
      { value: surd(side, 2n), misconceptionId: "TOOK_ROOT_BEFORE_HALVING", explanation: "taking the square root of the full difference before removing the two horizontal faces" },
      { value: surd(side, 2n, 2n), misconceptionId: "DIVIDED_DIFFERENCE_BY_FOUR", explanation: "treating the difference as four face areas instead of the top and bottom only" },
    ],
    keyRule: "For a cube, $TSA-LSA=6a^2-4a^2=2a^2$. Divide the difference by $2$, then take the square root.",
    steps: [
      { title: "Isolate One Squared Side", body: "The difference represents exactly two square faces.", equation: `$$a^2=\\frac{${difference}}{2}=${side ** 2n}$$` },
      { title: "Recover the Side", body: "Take the positive square root.", equation: `$$a=\\sqrt{${side ** 2n}}=${side}\\text{ cm}$$` },
    ],
    shortcut: `The TSA–LSA difference is the area of the top and bottom together.`,
  };
}

function equalVolumeCubeSideDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(EQUAL_VOLUME_STATES);
  const volume = state.length * state.breadth * state.height;
  const answer = q(state.side);
  return {
    state: makeState(prototypeId, seed, "cm", { ...state, volume }, { answer }),
    stem: `A cuboid measures ${dimension(state.length)} × ${dimension(state.breadth)} × ${dimension(state.height)}. Find the side of a cube having the same volume.`,
    answer,
    wrongAnswers: [
      { value: exactFromSquaredLength(volume), misconceptionId: "TOOK_SQUARE_ROOT", explanation: "taking a square root even though cube side is recovered from a cubic volume" },
      { value: q(volume, 3n), misconceptionId: "DIVIDED_VOLUME_BY_THREE", explanation: "dividing the volume by $3$ instead of taking its cube root" },
      { value: q(state.side + 2n), misconceptionId: "NEARBY_CUBE_ROOT", explanation: `choosing a nearby integer although only $${state.side}^3=${volume}$ preserves the volume` },
    ],
    keyRule: "Equal volume means $a^3=lbh$. Find the cuboid volume, then take its exact cube root.",
    steps: [
      { title: "Find the Cuboid Volume", body: "Multiply its three dimensions.", equation: `$$V=${state.length}\\times${state.breadth}\\times${state.height}=${volume}\\text{ cm}^{3}$$` },
      { title: "Take the Cube Root", body: "The cube side is the number whose cube equals the shared volume.", equation: `$$a=\\sqrt[3]{${volume}}=${state.side}\\text{ cm}$$` },
    ],
    shortcut: `Recognise the perfect cube after multiplying the cuboid dimensions.`,
  };
}

function volumeDifferenceDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(VOLUME_COMPARISON_STATES);
  const cubeVolume = state.cubeSide ** 3n;
  const cuboidVolume = state.length * state.breadth * state.height;
  const difference = cubeVolume - cuboidVolume;
  const answer = q(difference);
  return {
    state: makeState(prototypeId, seed, "cm³", { ...state, cubeVolume, cuboidVolume }, { answer }),
    stem: `A cube has side ${dimension(state.cubeSide)}. A cuboid measures ${dimension(state.length)} × ${dimension(state.breadth)} × ${dimension(state.height)}. By how much does the cube's volume exceed the cuboid's volume?`,
    answer,
    wrongAnswers: [
      { value: q(cubeVolume), misconceptionId: "REPORTED_CUBE_VOLUME", explanation: "finding the cube's volume but not subtracting the cuboid's volume" },
      { value: q(cuboidVolume), misconceptionId: "REPORTED_CUBOID_VOLUME", explanation: "reporting the smaller solid's volume rather than the difference" },
      { value: q(cubeVolume + cuboidVolume), misconceptionId: "ADDED_VOLUMES", explanation: "adding the two volumes although the question asks how much one exceeds the other" },
    ],
    keyRule: "Find each solid's volume in the same cubic unit, then subtract the smaller volume from the larger one.",
    steps: [
      { title: "Find the Cube Volume", body: "Cube the side length.", equation: `$$V_c=${state.cubeSide}^3=${cubeVolume}\\text{ cm}^{3}$$` },
      { title: "Find the Cuboid Volume", body: "Multiply length, breadth and height.", equation: `$$V_b=${state.length}\\times${state.breadth}\\times${state.height}=${cuboidVolume}\\text{ cm}^{3}$$` },
      { title: "Find the Excess", body: "Subtract the cuboid volume from the cube volume.", equation: `$$${cubeVolume}-${cuboidVolume}=${difference}\\text{ cm}^{3}$$` },
    ],
    shortcut: `Keep both volumes separate until the final subtraction.`,
  };
}

function orientationCounts(box: readonly bigint[], block: readonly bigint[]) {
  return ORIENTATIONS.map((orientation) => {
    const oriented = orientation.map((index) => block[index]!);
    const count = box.reduce((product, dimension, index) => product * (dimension / oriented[index]!), 1n);
    return { orientation, oriented, count };
  });
}

function maximumBlocksDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(ROTATION_STATES);
  const counts = orientationCounts(state.box, state.block);
  const distinctCounts = [...new Set(counts.map((entry) => entry.count.toString()))]
    .map(BigInt)
    .sort((a, b) => a > b ? -1 : a < b ? 1 : 0);
  const maximum = distinctCounts[0]!;
  const secondBest = distinctCounts[1]!;
  const original = counts[0]!.count;
  const volumeBound = (state.box[0] * state.box[1] * state.box[2]) / (state.block[0] * state.block[1] * state.block[2]);
  const best = counts.find((entry) => entry.count === maximum)!;
  const answer = q(maximum);
  return {
    state: makeState(prototypeId, seed, "blocks", {
      boxLength: state.box[0], boxBreadth: state.box[1], boxHeight: state.box[2],
      blockLength: state.block[0], blockBreadth: state.block[1], blockHeight: state.block[2],
      bestLength: best.oriented[0]!, bestBreadth: best.oriented[1]!, bestHeight: best.oriented[2]!,
      original, secondBest, volumeBound,
    }, { answer }),
    stem: `A box measures ${dimension(state.box[0])} × ${dimension(state.box[1])} × ${dimension(state.box[2])}. Identical blocks measure ${dimension(state.block[0])} × ${dimension(state.block[1])} × ${dimension(state.block[2])}. Blocks must remain axis-aligned but may be rotated. What is the maximum number that fit?`,
    answer,
    wrongAnswers: [
      { value: q(original), misconceptionId: "USED_GIVEN_ORIENTATION_ONLY", explanation: "using only the dimensions in the order stated and not testing allowed rotations" },
      { value: q(volumeBound), misconceptionId: "USED_VOLUME_BOUND", explanation: "using the whole-volume quotient as though it guaranteed a dimension-wise fit" },
      { value: q(secondBest), misconceptionId: "CHOSE_SECOND_BEST_ORIENTATION", explanation: "testing rotations but selecting a non-maximum arrangement" },
    ],
    keyRule: "For axis-aligned packing with rotation, test every distinct orientation. For each orientation multiply the whole-number fits along the three box dimensions, then choose the largest count.",
    steps: [
      { title: "Test the Allowed Orientations", body: "Match each block dimension with each box direction and use whole-number division." },
      { title: "Evaluate the Best Orientation", body: "The best orientation uses the displayed block dimensions along the box length, breadth and height.", equation: `$$\\left\\lfloor\\frac{${state.box[0]}}{${best.oriented[0]}}\\right\\rfloor\\times\\left\\lfloor\\frac{${state.box[1]}}{${best.oriented[1]}}\\right\\rfloor\\times\\left\\lfloor\\frac{${state.box[2]}}{${best.oriented[2]}}\\right\\rfloor=${maximum}$$` },
      { title: "Choose the Maximum", body: "No other orientation gives a larger complete-block count.", equation: `$$Maximum=${maximum}\\text{ blocks}$$` },
    ],
    shortcut: `Never trust the volume quotient alone; packing must work along all three dimensions.`,
  };
}

function wastePercentageDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(WASTE_STATES);
  const alongLength = state.length / state.cubeSide;
  const alongBreadth = state.breadth / state.cubeSide;
  const alongHeight = state.height / state.cubeSide;
  const count = alongLength * alongBreadth * alongHeight;
  const totalVolume = state.length * state.breadth * state.height;
  const cubeVolume = state.cubeSide ** 3n;
  const usedVolume = count * cubeVolume;
  const wasteVolume = totalVolume - usedVolume;
  const answer = q(wasteVolume * 100n, totalVolume);
  const usedPercent = q(usedVolume * 100n, totalVolume);
  const modulusPercent = q((totalVolume % cubeVolume) * 100n, totalVolume);
  const linearRemainderPercent = q(
    ((state.length % state.cubeSide) + (state.breadth % state.cubeSide) + (state.height % state.cubeSide)) * 100n,
    state.length + state.breadth + state.height,
  );
  return {
    state: makeState(prototypeId, seed, "%", { ...state, alongLength, alongBreadth, alongHeight, count, totalVolume, usedVolume, wasteVolume }, { answer }),
    stem: `A cuboidal block measuring ${dimension(state.length)} × ${dimension(state.breadth)} × ${dimension(state.height)} is cut into the maximum number of complete edge-aligned cubes of side ${dimension(state.cubeSide)}. What percentage of the original volume is wasted?`,
    answer,
    wrongAnswers: [
      { value: usedPercent, misconceptionId: "REPORTED_USED_PERCENTAGE", explanation: "reporting the percentage occupied by complete cubes instead of the wasted percentage" },
      { value: modulusPercent, misconceptionId: "USED_VOLUME_MODULUS", explanation: "using total volume modulo one cube's volume and ignoring the three direction-wise packing limits" },
      { value: linearRemainderPercent, misconceptionId: "AVERAGED_LINEAR_REMAINDERS", explanation: "averaging leftover lengths even though wastage must be calculated from volume" },
    ],
    keyRule: "Count complete cubes along each dimension, subtract their total volume from the original cuboid volume, then divide the waste volume by the original volume and multiply by $100$.",
    steps: [
      { title: "Count Complete Cubes", body: "Use whole-number fits along length, breadth and height.", equation: `$$N=${alongLength}\\times${alongBreadth}\\times${alongHeight}=${count}$$` },
      { title: "Find the Wasted Volume", body: "Subtract the volume of all complete cubes from the original block.", equation: `$$V_w=${totalVolume}-${usedVolume}=${wasteVolume}\\text{ cm}^{3}$$` },
      { title: "Convert Waste to a Percentage", body: "Compare the waste with the original volume.", equation: `$$Waste\\%=\\frac{${wasteVolume}}{${totalVolume}}\\times100=${answer.kind === "RATIONAL" && answer.denominator === 1n ? answer.numerator : `\\frac{${requireRational(answer).numerator}}{${requireRational(answer).denominator}}`}\\%$$` },
    ],
    shortcut: `Waste percentage is based on volume, not on leftover edge lengths.`,
  };
}

function gridPlaneCutsDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(GRID_CUT_STATES);
  const length = state.alongLength * state.side;
  const breadth = state.alongBreadth * state.side;
  const height = state.alongHeight * state.side;
  const answerValue = (state.alongLength - 1n) + (state.alongBreadth - 1n) + (state.alongHeight - 1n);
  const answer = q(answerValue);
  return {
    state: makeState(prototypeId, seed, "cuts", { ...state, length, breadth, height }, { answer }),
    stem: `A cuboidal block measuring ${dimension(length)} × ${dimension(breadth)} × ${dimension(height)} is divided into cubes of side ${dimension(state.side)} by cutting every required internal grid plane once across the full block. How many distinct grid-plane cuts are required?`,
    answer,
    wrongAnswers: [
      { value: q(state.alongLength + state.alongBreadth + state.alongHeight), misconceptionId: "COUNTED_BOUNDARY_PLANES", explanation: "counting the two outer boundaries as though they also required cuts" },
      { value: q(state.alongLength * state.alongBreadth * state.alongHeight), misconceptionId: "REPORTED_CUBE_COUNT", explanation: "reporting the number of small cubes rather than the internal cutting planes" },
      { value: q((state.alongLength > state.alongBreadth ? state.alongLength : state.alongBreadth) - 1n), misconceptionId: "CUT_ONE_DIRECTION_ONLY", explanation: "counting cuts in only the longest direction and ignoring the other two" },
    ],
    keyRule: "If the block contains $n_l,n_b,n_h$ cubes along its dimensions, the internal grid planes are $(n_l-1)+(n_b-1)+(n_h-1)$.",
    steps: [
      { title: "Find Cubes Along Each Dimension", body: "Divide each block dimension by the cube side.", equation: `$$n_l=${state.alongLength},\\quad n_b=${state.alongBreadth},\\quad n_h=${state.alongHeight}$$` },
      { title: "Count Only Internal Planes", body: "A row of $n$ cubes has $n-1$ internal boundaries.", equation: `$$Cuts=(${state.alongLength}-1)+(${state.alongBreadth}-1)+(${state.alongHeight}-1)=${answerValue}$$` },
    ],
    shortcut: `Subtract one in each direction, then add; do not multiply the direction counts.`,
  };
}

function wireFrameCostDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(WIRE_COST_STATES);
  const edgeLength = 4n * (state.length + state.breadth + state.height);
  const cost = edgeLength * state.rate;
  const tsa = 2n * (state.length * state.breadth + state.breadth * state.height + state.height * state.length);
  const answer = q(cost);
  return {
    state: makeState(prototypeId, seed, "£", { ...state, edgeLength, cost }, { answer }),
    stem: `A wire frame is made along all edges of a cuboid measuring ${dimension(state.length, "m")} × ${dimension(state.breadth, "m")} × ${dimension(state.height, "m")}. Wire costs $\\text{£}${state.rate}$ per metre. Find the total cost.`,
    answer,
    wrongAnswers: [
      { value: q(2n * (state.length + state.breadth) * state.rate), misconceptionId: "USED_BASE_PERIMETER", explanation: "pricing only the four edges around one base" },
      { value: q((state.length + state.breadth + state.height) * state.rate), misconceptionId: "COUNTED_ONE_OF_EACH_EDGE", explanation: "pricing one length, one breadth and one height instead of four of each" },
      { value: q(tsa * state.rate), misconceptionId: "USED_SURFACE_AREA", explanation: "multiplying a square-metre surface area by a per-metre wire rate" },
    ],
    keyRule: "A cuboid has four edges of each dimension, so total wire length is $4(l+b+h)$. Multiply that length by the price per metre.",
    steps: [
      { title: "Find the Total Edge Length", body: "Count four lengths, four breadths and four heights.", equation: `$$E=4(${state.length}+${state.breadth}+${state.height})=${edgeLength}\\text{ m}$$` },
      { title: "Apply the Wire Rate", body: `Multiply by $\\text{£}${state.rate}$ for each metre.`, equation: `$$Cost=${edgeLength}\\times\\text{£}${state.rate}=\\text{£}${cost}$$` },
    ],
    shortcut: `Find $4(l+b+h)$ first; surface area is irrelevant to a wire frame.`,
  };
}

function cubeWireRateDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(WIRE_RATE_STATES);
  const edgeLength = 12n * state.side;
  const cost = edgeLength * state.rate;
  const answer = q(state.rate);
  return {
    state: makeState(prototypeId, seed, "£/m", { ...state, edgeLength, cost }, { answer }),
    stem: `Wire along all twelve edges of a cube of side ${dimension(state.side, "m")} costs $\\text{£}${cost}$. Find the wire rate per metre.`,
    answer,
    wrongAnswers: [
      { value: q(3n * state.rate), misconceptionId: "USED_FOUR_EDGES", explanation: "dividing the cost by only four side lengths instead of all twelve edges" },
      { value: q(2n * state.rate), misconceptionId: "USED_SIX_EDGES", explanation: "dividing the cost by six side lengths as though faces and edges were the same count" },
      { value: q(cost), misconceptionId: "REPORTED_TOTAL_COST", explanation: "reporting the complete bill rather than the rate for one metre" },
    ],
    keyRule: "A cube has twelve equal edges. Find total wire length $12a$, then divide the total cost by that length.",
    steps: [
      { title: "Find the Wire Length", body: "Multiply one edge by twelve.", equation: `$$E=12\\times${state.side}=${edgeLength}\\text{ m}$$` },
      { title: "Divide Cost by Length", body: "Pounds divided by metres gives pounds per metre.", equation: `$$Rate=\\frac{\\text{£}${cost}}{${edgeLength}\\text{ m}}=\\frac{\\text{£}${state.rate}}{\\text{m}}$$` },
    ],
    shortcut: `Rate equals total cost divided by the twelve-edge wire length.`,
  };
}

function paintedAreaExcludingBaseDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(PAINT_STATES);
  const baseArea = state.length * state.breadth;
  const lsa = 2n * state.height * (state.length + state.breadth);
  const tsa = lsa + 2n * baseArea;
  const paintedArea = lsa + baseArea;
  const answer = q(paintedArea);
  return {
    state: makeState(prototypeId, seed, "cm²", { ...state, baseArea, lsa, tsa }, { answer }),
    stem: `A closed cuboidal box measures ${dimension(state.length)} × ${dimension(state.breadth)} × ${dimension(state.height)}. Its four side faces and top are painted, but the bottom base is not. Find the painted area.`,
    answer,
    wrongAnswers: [
      { value: q(tsa), misconceptionId: "PAINTED_BOTTOM_TOO", explanation: "including the bottom base even though it is explicitly unpainted" },
      { value: q(lsa), misconceptionId: "OMITTED_TOP", explanation: "counting only the four side faces and forgetting the painted top" },
      { value: q(baseArea), misconceptionId: "TOP_ONLY", explanation: "reporting only the top rectangle and omitting all four painted side faces" },
    ],
    keyRule: "Start with the four side faces, then add the top once. The unpainted bottom must not be included.",
    steps: [
      { title: "Find the Four Side Faces", body: "Use the cuboid lateral surface area.", equation: `$$LSA=2${state.height}(${state.length}+${state.breadth})=${lsa}\\text{ cm}^{2}$$` },
      { title: "Add the Painted Top", body: "The top has area $lb$; the matching bottom is excluded.", equation: `$$Painted\\ area=${lsa}+${baseArea}=${paintedArea}\\text{ cm}^{2}$$` },
    ],
    shortcut: `Use $TSA-lb$ when exactly one rectangular base is unpainted.`,
  };
}

function prismPerimeterInverseDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(PRISM_STATES);
  const tsa = state.basePerimeter * state.height + 2n * state.baseArea;
  const answer = q(state.basePerimeter);
  return {
    state: makeState(prototypeId, seed, "cm", { ...state, tsa }, { answer }),
    stem: `A closed right prism has total surface area $${tsa}\\text{ cm}^{2}$, base area $${state.baseArea}\\text{ cm}^{2}$ and height ${dimension(state.height)}. Find the perimeter of its base.`,
    answer,
    wrongAnswers: [
      { value: q(tsa, state.height), misconceptionId: "DID_NOT_REMOVE_BASES", explanation: "dividing the complete TSA by height without first removing both base areas" },
      { value: q(tsa - state.baseArea, state.height), misconceptionId: "REMOVED_ONE_BASE", explanation: "subtracting only one base area even though a closed prism has two congruent bases" },
      { value: q(state.basePerimeter, 2n), misconceptionId: "EXTRA_FACTOR_TWO", explanation: "dividing the recovered lateral term by twice the prism height" },
    ],
    keyRule: "For a closed right prism, $TSA=Ph+2A_{base}$. Remove both bases, then divide the lateral area by the height.",
    steps: [
      { title: "Remove the Two Bases", body: "Subtract twice the base area from the total surface area.", equation: `$$Ph=${tsa}-2\\times${state.baseArea}=${state.basePerimeter * state.height}\\text{ cm}^{2}$$` },
      { title: "Divide by the Prism Height", body: "This recovers the boundary length of the base.", equation: `$$P=\\frac{${state.basePerimeter * state.height}}{${state.height}}=${state.basePerimeter}\\text{ cm}$$` },
    ],
    shortcut: `Use $P=\frac{TSA-2A_{base}}{h}$.`,
  };
}

function lShapedPrismDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(L_SHAPE_STATES);
  const outerArea = state.outerLength * state.outerBreadth;
  const cutArea = state.cutLength * state.cutBreadth;
  const baseArea = outerArea - cutArea;
  const volume = baseArea * state.prismHeight;
  const answer = q(volume);
  return {
    state: makeState(prototypeId, seed, "cm³", { ...state, outerArea, cutArea, baseArea }, { answer }),
    stem: `An L-shaped prism is formed from a rectangular prism with base ${dimension(state.outerLength)} × ${dimension(state.outerBreadth)} by removing a rectangular corner ${dimension(state.cutLength)} × ${dimension(state.cutBreadth)} through the full prism height ${dimension(state.prismHeight)}. Find the remaining volume.`,
    answer,
    wrongAnswers: [
      { value: q(outerArea * state.prismHeight), misconceptionId: "USED_OUTER_PRISM", explanation: "using the full outer rectangular prism and not removing the corner" },
      { value: q(cutArea * state.prismHeight), misconceptionId: "REPORTED_REMOVED_VOLUME", explanation: "reporting the volume of the removed corner instead of the remaining solid" },
      { value: q((state.outerLength - state.cutLength) * (state.outerBreadth - state.cutBreadth) * state.prismHeight), misconceptionId: "MULTIPLIED_REMAINING_ARMS", explanation: "multiplying the two reduced side lengths, which keeps only one corner rectangle rather than the full L-shaped base" },
    ],
    keyRule: "Treat the L-shaped base as an outer rectangle minus the removed corner. Multiply the remaining base area by the prism height.",
    steps: [
      { title: "Find the L-Shaped Base Area", body: "Subtract the removed corner area from the outer rectangle.", equation: `$$A_L=${outerArea}-${cutArea}=${baseArea}\\text{ cm}^{2}$$` },
      { title: "Extend Through the Prism Height", body: "Multiply the constant L-shaped cross-section by the height.", equation: `$$V=${baseArea}\\times${state.prismHeight}=${volume}\\text{ cm}^{3}$$` },
    ],
    shortcut: `Outer prism volume minus removed corner volume gives the same result.`,
  };
}

function mixedUnitBrickCountDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string, rng: SeededRandom): Draft {
  const state = rng.pick(MIXED_BRICK_STATES);
  const wallLCm = state.wallLMetres * 100n;
  const wallBCm = state.wallBMetres * 100n;
  const wallHCm = state.wallHMetres * 100n;
  const alongLength = wallLCm / state.brickL;
  const alongBreadth = wallBCm / state.brickB;
  const alongHeight = wallHCm / state.brickH;
  const count = alongLength * alongBreadth * alongHeight;
  const brickVolume = state.brickL * state.brickB * state.brickH;
  const answer = q(count);
  return {
    state: makeState(prototypeId, seed, "bricks", { ...state, wallLCm, wallBCm, wallHCm, alongLength, alongBreadth, alongHeight }, { answer }),
    stem: `Ignoring mortar, how many bricks measuring ${dimension(state.brickL)} × ${dimension(state.brickB)} × ${dimension(state.brickH)} are needed for a rectangular wall measuring ${dimension(state.wallLMetres, "m")} × ${dimension(state.wallBMetres, "m")} × ${dimension(state.wallHMetres, "m")}?`,
    answer,
    wrongAnswers: [
      { value: q(count, 100n), misconceptionId: "LEFT_ONE_METRE_DIMENSION_UNCONVERTED", explanation: "leaving one wall dimension in metres, which makes the count one hundred times too small" },
      { value: q(alongLength + alongBreadth + alongHeight), misconceptionId: "ADDED_DIRECTION_COUNTS", explanation: "adding the brick counts along the three directions instead of multiplying rows, columns and layers" },
      { value: q(alongLength * alongBreadth), misconceptionId: "COUNTED_ONE_LAYER", explanation: "counting one rectangular layer of bricks and omitting the layers through the wall height" },
    ],
    keyRule: "Convert all wall dimensions to centimetres, then count exact brick fits along length, breadth and height and multiply the three counts.",
    steps: [
      { title: "Convert the Wall Dimensions", body: "$1\\text{ m}=100\\text{ cm}$.", equation: `$$${state.wallLMetres}\\text{ m}=${wallLCm}\\text{ cm},\\quad${state.wallBMetres}\\text{ m}=${wallBCm}\\text{ cm},\\quad${state.wallHMetres}\\text{ m}=${wallHCm}\\text{ cm}$$` },
      { title: "Count Bricks Along Each Dimension", body: "Divide matching dimensions in the common unit.", equation: `$$${wallLCm}\\div${state.brickL}=${alongLength},\\quad${wallBCm}\\div${state.brickB}=${alongBreadth},\\quad${wallHCm}\\div${state.brickH}=${alongHeight}$$` },
      { title: "Multiply the Three Direction Counts", body: "Rows, columns and layers combine multiplicatively.", equation: `$$N=${alongLength}\\times${alongBreadth}\\times${alongHeight}=${count}\\text{ bricks}$$` },
    ],
    shortcut: `Convert every metre dimension before any division; one missed conversion changes the count by a factor of $100$.`,
  };
}

export function classifyMenCp007Wave03Difficulty(state: MenCp007Wave03State): Men002Difficulty {
  const d = state.dimensions;
  switch (state.solveMode) {
    case "findCuboidHeightFromSpaceDiagonal": return d.diagonal! >= 25n ? "Hard" : "Medium";
    case "findLongerBaseSideFromAreaAndPerimeter": return d.longer! >= 20n ? "Hard" : "Medium";
    case "findCuboidLengthFromVolumeAndBaseRatio": return d.length! >= 28n ? "Hard" : "Medium";
    case "findCubeSideFromTsaLsaDifference": return d.side! >= 8n ? "Medium" : "Easy";
    case "findCubeSideEqualToCuboidVolume": return d.side! >= 10n ? "Medium" : "Easy";
    case "findVolumeDifferenceBetweenCubeAndCuboid": return d.cubeSide! >= 16n ? "Hard" : "Medium";
    case "findMaximumBlocksWithRotation": return d.volumeBound! >= 100n ? "Hard" : "Medium";
    case "findWastePercentageAfterCubeCutting": return d.cubeSide! >= 4n ? "Hard" : "Medium";
    case "findGridPlaneCutCount": return d.alongLength! >= 7n ? "Hard" : "Medium";
    case "findCuboidWireFrameCost": return d.rate! >= 9n ? "Hard" : "Medium";
    case "findCubeWireRateFromCost": return d.side! >= 10n ? "Hard" : "Medium";
    case "findPaintedAreaExcludingBase": return d.length! >= 18n ? "Hard" : "Medium";
    case "findPrismBasePerimeterFromTsaAndBaseArea": return d.basePerimeter! >= 30n ? "Hard" : "Medium";
    case "findLShapedPrismVolume": return d.outerLength! >= 18n ? "Hard" : "Medium";
    case "findBrickCountFromMixedUnits": return d.wallLMetres! >= 6n ? "Hard" : "Medium";
  }
}

function generateDraft(prototypeId: MenCp007Wave03PrototypeId, seed: string): Draft {
  const rng = createSeededRandom(`${prototypeId}:${seed}`);
  switch (prototypeId) {
    case "MEN-CP007-W3-PROT-CUBOID-HEIGHT-FROM-SPACE-DIAGONAL": return heightFromSpaceDiagonalDraft(prototypeId, seed, rng);
    case "MEN-CP007-W3-PROT-BASE-LONGER-SIDE-FROM-AREA-PERIMETER": return longerBaseSideDraft(prototypeId, seed, rng);
    case "MEN-CP007-W3-PROT-CUBOID-LENGTH-FROM-VOLUME-RATIO": return lengthFromVolumeRatioDraft(prototypeId, seed, rng);
    case "MEN-CP007-W3-PROT-CUBE-SIDE-FROM-TSA-LSA-DIFFERENCE": return cubeSideFromSurfaceDifferenceDraft(prototypeId, seed, rng);
    case "MEN-CP007-W3-PROT-CUBE-SIDE-EQUAL-CUBOID-VOLUME": return equalVolumeCubeSideDraft(prototypeId, seed, rng);
    case "MEN-CP007-W3-PROT-CUBE-CUBOID-VOLUME-DIFFERENCE": return volumeDifferenceDraft(prototypeId, seed, rng);
    case "MEN-CP007-W3-PROT-MAX-BLOCKS-WITH-ROTATION": return maximumBlocksDraft(prototypeId, seed, rng);
    case "MEN-CP007-W3-PROT-WASTE-PERCENT-AFTER-CUBE-CUTTING": return wastePercentageDraft(prototypeId, seed, rng);
    case "MEN-CP007-W3-PROT-GRID-PLANE-CUT-COUNT": return gridPlaneCutsDraft(prototypeId, seed, rng);
    case "MEN-CP007-W3-PROT-CUBOID-WIRE-FRAME-COST": return wireFrameCostDraft(prototypeId, seed, rng);
    case "MEN-CP007-W3-PROT-CUBE-WIRE-RATE-FROM-COST": return cubeWireRateDraft(prototypeId, seed, rng);
    case "MEN-CP007-W3-PROT-PAINTED-AREA-EXCLUDING-BASE": return paintedAreaExcludingBaseDraft(prototypeId, seed, rng);
    case "MEN-CP007-W3-PROT-PRISM-PERIMETER-FROM-TSA-BASE-AREA": return prismPerimeterInverseDraft(prototypeId, seed, rng);
    case "MEN-CP007-W3-PROT-L-SHAPED-PRISM-VOLUME": return lShapedPrismDraft(prototypeId, seed, rng);
    case "MEN-CP007-W3-PROT-MIXED-UNIT-BRICK-COUNT": return mixedUnitBrickCountDraft(prototypeId, seed, rng);
  }
}

function verifyDraft(draft: Draft) {
  const d = draft.state.dimensions;
  let reconstructed: ExactValue;
  let method: string;
  switch (draft.state.solveMode) {
    case "findCuboidHeightFromSpaceDiagonal": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(d.length! ** 2n + d.breadth! ** 2n + candidate ** 2n);
      method = "substituted candidate height into the three-axis squared diagonal identity";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.diagonal! ** 2n, method, reconstructed: exactKey(reconstructed) };
    }
    case "findLongerBaseSideFromAreaAndPerimeter": {
      const candidate = asInteger(draft.answer);
      const other = d.perimeter! / 2n - candidate;
      reconstructed = q(candidate * other);
      method = "reconstructed the companion side from the semiperimeter and checked the area product";
      return { valid: other > 0n && candidate >= other && reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.area!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findCuboidLengthFromVolumeAndBaseRatio": {
      const candidate = asInteger(draft.answer);
      if (candidate % d.ratioL! !== 0n) return { valid: false, method: "candidate length did not preserve the stated ratio", reconstructed: exactKey(q(candidate)) };
      const scale = candidate / d.ratioL!;
      reconstructed = q(candidate * d.ratioB! * scale * d.height!);
      method = "reconstructed breadth from the stated ratio and substituted both dimensions into volume";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.volume!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findCubeSideFromTsaLsaDifference": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(2n * candidate ** 2n);
      method = "substituted candidate side into TSA minus LSA equals two face areas";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.difference!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findCubeSideEqualToCuboidVolume": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(candidate ** 3n);
      method = "cubed candidate side to reconstruct the cuboid volume";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.volume!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findVolumeDifferenceBetweenCubeAndCuboid":
      reconstructed = q(d.cubeSide! ** 3n - d.length! * d.breadth! * d.height!);
      method = "independently computed both volumes and subtracted smaller from larger";
      break;
    case "findMaximumBlocksWithRotation": {
      const box = [d.boxLength!, d.boxBreadth!, d.boxHeight!];
      const block = [d.blockLength!, d.blockBreadth!, d.blockHeight!];
      const maximum = orientationCounts(box, block).reduce((best, entry) => entry.count > best ? entry.count : best, 0n);
      reconstructed = q(maximum);
      method = "exhaustively enumerated all six axis-aligned block orientations";
      break;
    }
    case "findWastePercentageAfterCubeCutting": {
      const count = (d.length! / d.cubeSide!) * (d.breadth! / d.cubeSide!) * (d.height! / d.cubeSide!);
      const total = d.length! * d.breadth! * d.height!;
      const waste = total - count * d.cubeSide! ** 3n;
      reconstructed = q(waste * 100n, total);
      method = "reconstructed complete-cube volume, waste volume and exact percentage";
      break;
    }
    case "findGridPlaneCutCount":
      reconstructed = q((d.alongLength! - 1n) + (d.alongBreadth! - 1n) + (d.alongHeight! - 1n));
      method = "counted internal grid boundaries independently in all three directions";
      break;
    case "findCuboidWireFrameCost":
      reconstructed = q(4n * (d.length! + d.breadth! + d.height!) * d.rate!);
      method = "reconstructed all twelve edge lengths and applied the per-metre rate";
      break;
    case "findCubeWireRateFromCost": {
      const candidate = requireRational(draft.answer);
      reconstructed = q(12n * d.side! * candidate.numerator, candidate.denominator);
      method = "applied candidate rate to the twelve-edge wire length";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.denominator === 1n && reconstructed.numerator === d.cost!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findPaintedAreaExcludingBase":
      reconstructed = q(2n * d.height! * (d.length! + d.breadth!) + d.length! * d.breadth!);
      method = "summed four side faces and one top while excluding the bottom";
      break;
    case "findPrismBasePerimeterFromTsaAndBaseArea": {
      const candidate = requireRational(draft.answer);
      reconstructed = q(candidate.numerator * d.height!, candidate.denominator);
      reconstructed = q(requireRational(reconstructed).numerator + 2n * d.baseArea! * requireRational(reconstructed).denominator, requireRational(reconstructed).denominator);
      method = "substituted candidate perimeter into TSA equals perimeter-height product plus two bases";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.denominator === 1n && reconstructed.numerator === d.tsa!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findLShapedPrismVolume":
      reconstructed = q((d.outerLength! * d.outerBreadth! - d.cutLength! * d.cutBreadth!) * d.prismHeight!);
      method = "reconstructed outer volume and removed corner volume";
      break;
    case "findBrickCountFromMixedUnits":
      reconstructed = q(
        ((d.wallLMetres! * 100n) / d.brickL!) *
        ((d.wallBMetres! * 100n) / d.brickB!) *
        ((d.wallHMetres! * 100n) / d.brickH!),
      );
      method = "converted all wall dimensions to centimetres and multiplied exact direction counts";
      break;
  }
  return { valid: exactEquals(reconstructed, draft.answer), method, reconstructed: exactKey(reconstructed) };
}

function optionDisplay(value: ExactValue, state: MenCp007Wave03State) {
  return formatWithUnit(value, state.unit);
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
  const options: MenCp007Wave03Option[] = rng.shuffle(candidates).map((candidate, index) => ({
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

function validatePackage(question: Omit<MenCp007Wave03Package, "validation">) {
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
    { name: "state-derived difficulty", passed: question.difficulty === classifyMenCp007Wave03Difficulty(question.state), message: "Difficulty must derive from canonical state." },
    { name: "four-tier teaching", passed: Boolean(question.explanation.keyRule) && question.explanation.steps.length >= 2 && Boolean(question.explanation.shortcut) && question.explanation.traps.length === 3, message: "Rule, steps, shortcut and three traps are required." },
    { name: "MathJax cleanliness", passed: !/[½¼²³]/.test(learnerText) && !/(^|[^\\])sqrt\{/.test(explanationText) && !/\$\$[^$]*\/[^$]*\$\$/.test(explanationText), message: "Use MathJax fractions, powers, roots and division." },
    { name: "currency locale", passed: !/₹/.test(learnerText), message: "Generic money must use en-GB pounds sterling." },
    { name: "lifecycle lock", passed: question.permanentQlId === null && !question.publiclyPublishable && !question.questionStudioDiscoverable, message: "Wave prototypes must remain unallocated and unpublished." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp007Wave03Prototype(
  prototypeId: MenCp007Wave03PrototypeId,
  seed: string,
): MenCp007Wave03Package {
  const draft = generateDraft(prototypeId, seed);
  draft.state.difficulty = classifyMenCp007Wave03Difficulty(draft.state);
  const verification = verifyDraft(draft);
  const { options, traps } = buildOptions(draft, createSeededRandom(`${prototypeId}:${seed}:options`));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const partial = {
    packageId: "MEN-002" as const,
    canonicalProblemId: "MEN-CP-007" as const,
    permanentQlId: null,
    waveId: "MEN-CP-007-GAP-WAVE-03" as const,
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
