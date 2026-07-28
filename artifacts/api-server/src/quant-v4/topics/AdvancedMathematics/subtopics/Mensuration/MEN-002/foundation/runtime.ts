import {
  exactEquals,
  exactFromSquaredLength,
  exactKey,
  formatExactMath,
  formatWithUnit,
  integerCubeRoot,
  rational,
  surd,
} from "./exact";
import { getMenCp007Prototype } from "./prototype-registry";
import { createSeededRandom, type SeededRandom } from "./seed";
import {
  MEN_002_PACKAGE_ID,
  MEN_CP_007_ID,
  type ExactRational,
  type ExactValue,
  type Men002Difficulty,
  type Men002Unit,
  type MenCp007CanonicalState,
  type MenCp007Explanation,
  type MenCp007Option,
  type MenCp007PrototypeId,
  type MenCp007QuestionPackage,
} from "./types";

interface WrongAnswer {
  value: ExactValue;
  misconceptionId: string;
  explanation: string;
}

interface Draft {
  state: MenCp007CanonicalState;
  stem: string;
  answer: ExactValue;
  wrongAnswers: [WrongAnswer, WrongAnswer, WrongAnswer];
  keyRule: string;
  steps: MenCp007Explanation["steps"];
  shortcut: string;
}

const CUBE_CONTEXTS = ["solid wooden cube", "cubical storage block", "metal cube", "cubical packing box"] as const;
const CUBOID_CONTEXTS = ["rectangular carton", "wooden block", "storage box", "rectangular solid"] as const;
const PRISM_CONTEXTS = ["glass prism", "solid prism", "prismatic block", "concrete prism"] as const;
const DIFFICULTIES: readonly Men002Difficulty[] = ["Easy", "Medium", "Hard"];

function q(value: bigint | number, denominator: bigint | number = 1) {
  return rational(value, denominator);
}

function requireRational(value: ExactValue): ExactRational {
  if (value.kind !== "RATIONAL") throw new Error("Expected a rational prototype answer.");
  return value;
}

function asBigInt(value: ExactValue) {
  const rationalValue = requireRational(value);
  if (rationalValue.denominator !== 1n) throw new Error("Expected an integer prototype answer.");
  return rationalValue.numerator;
}

function dimensionText(value: bigint, unit: "cm" | "m") {
  return `$${value}\\text{ ${unit}}$`;
}

function makeState(
  prototypeId: MenCp007PrototypeId,
  seed: string,
  difficulty: Men002Difficulty,
  unit: Men002Unit,
  contextId: string,
  dimensions: Record<string, bigint>,
  derived: Record<string, ExactValue>,
): MenCp007CanonicalState {
  const prototype = getMenCp007Prototype(prototypeId);
  return {
    packageId: MEN_002_PACKAGE_ID,
    canonicalProblemId: MEN_CP_007_ID,
    permanentQlId: null,
    prototypeId,
    solveMode: prototype.solveMode,
    target: prototype.target,
    shape: prototype.shape,
    seed,
    difficulty,
    dimensions,
    derived,
    unit,
    contextId,
  };
}

function cubeVolumeDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const side = BigInt(rng.int(3, 14));
  const answer = q(side ** 3n);
  const context = rng.pick(CUBE_CONTEXTS);
  return {
    state: makeState(prototypeId, seed, difficulty, "cm³", context, { side }, { answer }),
    stem: `A ${context} has side ${dimensionText(side, "cm")}. Find its volume.`,
    answer,
    wrongAnswers: [
      { value: q(side ** 2n), misconceptionId: "USED_FACE_AREA", explanation: `using $a^2=${side ** 2n}$, which is the area of one face, not the volume` },
      { value: q(6n * side ** 2n), misconceptionId: "USED_TSA", explanation: "calculating the total surface area $6a^2$ instead of the space occupied" },
      { value: q(3n * side), misconceptionId: "ADDED_DIRECTIONS", explanation: "adding three equal edge lengths instead of multiplying three perpendicular dimensions" },
    ],
    keyRule: "A cube extends by the same side length in three perpendicular directions, so its volume is $V=a^3$.",
    steps: [
      { title: "Identify the Edge Length", body: `The cube has one repeated dimension: $a=${side}\\text{ cm}$.` },
      { title: "Multiply Three Equal Dimensions", body: "Use length × breadth × height; all three are equal for a cube.", equation: `$$V=${side}\\times${side}\\times${side}=${side ** 3n}\\text{ cm}^3$$` },
    ],
    shortcut: `Cube the side directly: $${side}^3=${side ** 3n}\\text{ cm}^3$.`,
  };
}

function cubeTsaDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const side = BigInt(rng.int(3, 15));
  const faceArea = side ** 2n;
  const answer = q(6n * faceArea);
  const context = rng.pick(CUBE_CONTEXTS);
  return {
    state: makeState(prototypeId, seed, difficulty, "cm²", context, { side }, { faceArea: q(faceArea), answer }),
    stem: `A closed ${context} has side ${dimensionText(side, "cm")}. Find its total surface area.`,
    answer,
    wrongAnswers: [
      { value: q(4n * faceArea), misconceptionId: "USED_LSA", explanation: "counting only the four side faces and omitting the top and bottom" },
      { value: q(faceArea), misconceptionId: "ONE_FACE_ONLY", explanation: `reporting one face area, $${side}^2=${faceArea}$, instead of all six faces` },
      { value: q(side ** 3n), misconceptionId: "USED_VOLUME", explanation: "cubing the side, which gives volume rather than surface area" },
    ],
    keyRule: "A closed cube has six congruent square faces. Find one face area $a^2$ and multiply by $6$.",
    steps: [
      { title: "Find One Face Area", body: "Each face is a square.", equation: `$$a^2=${side}^2=${faceArea}\\text{ cm}^2$$` },
      { title: "Count All Six Faces", body: "A closed cube includes four side faces, the top and the bottom.", equation: `$$TSA=6\\times${faceArea}=${6n * faceArea}\\text{ cm}^2$$` },
    ],
    shortcut: `Use $6a^2$ immediately: $6\\times${side}^2=${6n * faceArea}\\text{ cm}^2$.`,
  };
}

function cubeSideFromVolumeDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const side = BigInt(rng.int(3, 16));
  const volume = side ** 3n;
  const answer = q(integerCubeRoot(volume));
  const context = rng.pick(CUBE_CONTEXTS);
  return {
    state: makeState(prototypeId, seed, difficulty, "cm", context, { side, volume }, { answer }),
    stem: `A ${context} has volume $${volume}\\text{ cm}^3$. Find its side length.`,
    answer,
    wrongAnswers: [
      { value: q(side ** 2n), misconceptionId: "TOOK_SQUARE_ROOT_INCORRECTLY", explanation: "treating the volume as an area and stopping at a squared side value" },
      { value: q(3n * side), misconceptionId: "DIVIDED_BY_THREE", explanation: "dividing the volume idea into three parts instead of taking the cube root" },
      { value: q(side + 1n), misconceptionId: "CUBE_ROOT_SLIP", explanation: `choosing a nearby integer even though only $${side}^3=${volume}$ reconstructs the given volume` },
    ],
    keyRule: "For a cube, $V=a^3$. Recover the side by taking the exact cube root: $a=\\sqrt[3]{V}$.",
    steps: [
      { title: "Write the Volume Relation", body: "The same side is used for length, breadth and height.", equation: `$$a^3=${volume}$$` },
      { title: "Take the Cube Root", body: `Find the integer whose cube is $${volume}$.`, equation: `$$a=\\sqrt[3]{${volume}}=${side}\\text{ cm}$$` },
    ],
    shortcut: `Recognise the perfect cube: $${volume}=${side}^3$, so the side is $${side}\\text{ cm}$.`,
  };
}

function cubeSpaceDiagonalDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const side = BigInt(rng.int(3, 15));
  const answer = surd(side, 3n);
  const context = rng.pick(["cube", "cubical room", "cubical crate"] as const);
  return {
    state: makeState(prototypeId, seed, difficulty, "cm", context, { side }, { answer }),
    stem: `Find the space diagonal of a ${context} whose side is ${dimensionText(side, "cm")}.`,
    answer,
    wrongAnswers: [
      { value: surd(side, 2n), misconceptionId: "USED_FACE_DIAGONAL", explanation: "using $a\\sqrt2$, which crosses only one square face" },
      { value: q(3n * side), misconceptionId: "ADDED_EDGES", explanation: "adding three edges instead of combining perpendicular directions by Pythagoras" },
      { value: q(side), misconceptionId: "USED_SIDE_ONLY", explanation: "reporting one edge although the diagonal runs across the interior" },
    ],
    keyRule: "The space diagonal combines three mutually perpendicular edges, so $d^2=a^2+a^2+a^2=3a^2$ and $d=a\\sqrt3$.",
    steps: [
      { title: "Combine the Three Perpendicular Directions", body: "The interior diagonal changes along length, breadth and height.", equation: `$$d^2=${side}^2+${side}^2+${side}^2=3\\times${side ** 2n}$$` },
      { title: "Take the Exact Square Root", body: "Keep the surd exact because no approximation is requested.", equation: `$$d=${side}\\sqrt3\\text{ cm}$$` },
    ],
    shortcut: `For any cube, space diagonal $=a\\sqrt3$; substitute $a=${side}$ directly.`,
  };
}

function cubeSideFromDiagonalDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const side = BigInt(rng.int(3, 15));
  const diagonal = surd(side, 3n);
  const answer = q(side);
  return {
    state: makeState(prototypeId, seed, difficulty, "cm", "cube-from-diagonal", { side }, { diagonal, answer }),
    stem: `The space diagonal of a cube is $${formatExactMath(diagonal)}\\text{ cm}$. Find its side length.`,
    answer,
    wrongAnswers: [
      { value: q(3n * side), misconceptionId: "MULTIPLIED_BY_ROOT_FACTOR", explanation: "multiplying by the diagonal factor instead of dividing out $\\sqrt3$" },
      { value: q(2n * side), misconceptionId: "TREATED_AS_DIAMETER", explanation: "treating the space diagonal like a diameter and doubling the side" },
      { value: q(side, 3n), misconceptionId: "DIVIDED_BY_THREE", explanation: "dividing the coefficient by $3$ rather than cancelling the common factor $\\sqrt3$" },
    ],
    keyRule: "A cube's space diagonal is $d=a\\sqrt3$. Divide the given diagonal by $\\sqrt3$ to recover the side.",
    steps: [
      { title: "Use the Cube Diagonal Relation", body: "Match the given exact diagonal with $a\\sqrt3$.", equation: `$$a\\sqrt3=${formatExactMath(diagonal)}$$` },
      { title: "Cancel the Common Surd", body: "Both sides contain $\\sqrt3$.", equation: `$$a=${side}\\text{ cm}$$` },
    ],
    shortcut: `Read the coefficient of $\\sqrt3$: the side is $${side}\\text{ cm}$.`,
  };
}

function cuboidVolumeDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const length = BigInt(rng.int(8, 20));
  const breadth = BigInt(rng.int(4, 12));
  const height = BigInt(rng.int(3, 10));
  const answer = q(length * breadth * height);
  const context = rng.pick(CUBOID_CONTEXTS);
  return {
    state: makeState(prototypeId, seed, difficulty, "cm³", context, { length, breadth, height }, { answer }),
    stem: `A ${context} measures ${dimensionText(length, "cm")} by ${dimensionText(breadth, "cm")} by ${dimensionText(height, "cm")}. Find its volume.`,
    answer,
    wrongAnswers: [
      { value: q(length * breadth), misconceptionId: "USED_BASE_AREA", explanation: "stopping after the rectangular base area and omitting the height" },
      { value: q(length + breadth + height), misconceptionId: "ADDED_DIMENSIONS", explanation: "adding three lengths instead of multiplying them to measure space" },
      { value: q(2n * (length * breadth + breadth * height + height * length)), misconceptionId: "USED_TSA", explanation: "calculating the area of all faces instead of the volume inside" },
    ],
    keyRule: "A cuboid's volume is the area of its rectangular base repeated through the height: $V=lbh$.",
    steps: [
      { title: "Find the Base Area", body: "Multiply length by breadth.", equation: `$$lb=${length}\\times${breadth}=${length * breadth}\\text{ cm}^2$$` },
      { title: "Extend Through the Height", body: "Multiply the base area by the third perpendicular dimension.", equation: `$$V=${length * breadth}\\times${height}=${length * breadth * height}\\text{ cm}^3$$` },
    ],
    shortcut: `Cancel or group convenient factors, then multiply $${length}\\times${breadth}\\times${height}$.`,
  };
}

function cuboidTsaDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const length = BigInt(rng.int(8, 20));
  const breadth = BigInt(rng.int(4, 12));
  const height = BigInt(rng.int(3, 10));
  const pairSum = length * breadth + breadth * height + height * length;
  const answer = q(2n * pairSum);
  const context = rng.pick(CUBOID_CONTEXTS);
  return {
    state: makeState(prototypeId, seed, difficulty, "cm²", context, { length, breadth, height }, { pairSum: q(pairSum), answer }),
    stem: `A closed ${context} measures ${dimensionText(length, "cm")} by ${dimensionText(breadth, "cm")} by ${dimensionText(height, "cm")}. Find its total surface area.`,
    answer,
    wrongAnswers: [
      { value: q(pairSum), misconceptionId: "COUNTED_ONE_OF_EACH_FACE", explanation: "adding one $lb$, one $bh$ and one $hl$ face but forgetting the opposite matching faces" },
      { value: q(2n * height * (length + breadth)), misconceptionId: "USED_LSA", explanation: "counting only the four side faces and omitting top and bottom" },
      { value: q(length * breadth * height), misconceptionId: "USED_VOLUME", explanation: "multiplying all three dimensions, which measures volume rather than face area" },
    ],
    keyRule: "A closed cuboid has three pairs of equal rectangular faces, so $TSA=2(lb+bh+hl)$.",
    steps: [
      { title: "Find the Three Different Face Areas", body: "Use one area from each opposite pair.", equation: `$$lb=${length * breadth},\\quad bh=${breadth * height},\\quad hl=${height * length}$$` },
      { title: "Double for Opposite Faces", body: "Each rectangle occurs twice.", equation: `$$TSA=2(${length * breadth}+${breadth * height}+${height * length})=${2n * pairSum}\\text{ cm}^2$$` },
    ],
    shortcut: `Add the three pair-products first, then double: $2(lb+bh+hl)$.`,
  };
}

function cuboidHeightFromVolumeDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const length = BigInt(rng.int(8, 20));
  const breadth = BigInt(rng.int(4, 12));
  const height = BigInt(rng.int(3, 10));
  const volume = length * breadth * height;
  const answer = q(height);
  return {
    state: makeState(prototypeId, seed, difficulty, "cm", "cuboid-inverse", { length, breadth, height, volume }, { answer }),
    stem: `A cuboid has volume $${volume}\\text{ cm}^3$, length ${dimensionText(length, "cm")} and breadth ${dimensionText(breadth, "cm")}. Find its height.`,
    answer,
    wrongAnswers: [
      { value: q(volume / length), misconceptionId: "DIVIDED_BY_ONE_DIMENSION", explanation: "dividing by the length only and leaving the breadth unaccounted for" },
      { value: q(volume, length + breadth), misconceptionId: "DIVIDED_BY_SUM", explanation: "dividing by $l+b$ instead of the rectangular base area $lb$" },
      { value: q(2n * height), misconceptionId: "EXTRA_FACTOR_TWO", explanation: "introducing a surface-area factor of $2$ into a volume inverse" },
    ],
    keyRule: "Since $V=lbh$, the missing height equals volume divided by the base area: $h=V/(lb)$.",
    steps: [
      { title: "Find the Base Area", body: "The base is the length-by-breadth rectangle.", equation: `$$lb=${length}\\times${breadth}=${length * breadth}\\text{ cm}^2$$` },
      { title: "Divide Volume by Base Area", body: "This removes the two known dimensions and leaves the height.", equation: `$$h=\\frac{${volume}}{${length * breadth}}=${height}\\text{ cm}$$` },
    ],
    shortcut: `Divide by the product $${length}\\times${breadth}$ in one step.`,
  };
}

const CUBOID_DIAGONAL_TRIPLES = [
  [3n, 4n, 12n, 13n],
  [6n, 8n, 24n, 26n],
  [2n, 3n, 6n, 7n],
  [9n, 12n, 20n, 25n],
] as const;

function cuboidDiagonalDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty, longestRod: boolean): Draft {
  const [length, breadth, height, diagonal] = rng.pick(CUBOID_DIAGONAL_TRIPLES);
  const answer = q(diagonal);
  const context = longestRod ? rng.pick(["storage crate", "rectangular room", "shipping box"] as const) : "cuboid";
  const stem = longestRod
    ? `A ${context} is ${dimensionText(length, "m")} long, ${dimensionText(breadth, "m")} broad and ${dimensionText(height, "m")} high. What is the longest straight rod that can fit completely inside it?`
    : `Find the space diagonal of a cuboid measuring ${dimensionText(length, "cm")}, ${dimensionText(breadth, "cm")} and ${dimensionText(height, "cm")}.`;
  const unit: Men002Unit = longestRod ? "m" : "cm";
  return {
    state: makeState(prototypeId, seed, difficulty, unit, context, { length, breadth, height }, { answer }),
    stem,
    answer,
    wrongAnswers: [
      { value: exactFromSquaredLength(length ** 2n + breadth ** 2n), misconceptionId: "USED_FACE_DIAGONAL", explanation: "using only length and breadth, which gives a diagonal on the base face" },
      { value: q(length + breadth + height), misconceptionId: "ADDED_DIMENSIONS", explanation: "adding the dimensions instead of combining perpendicular lengths through their squares" },
      { value: q(height), misconceptionId: "USED_LARGEST_EDGE", explanation: "choosing a single edge although the required segment crosses the interior" },
    ],
    keyRule: longestRod
      ? "The longest straight rod joins opposite vertices of the cuboid, so it is the space diagonal $d=\\sqrt{l^2+b^2+h^2}$."
      : "A cuboid's space diagonal combines all three perpendicular dimensions: $d^2=l^2+b^2+h^2$.",
    steps: [
      { title: "Square the Three Perpendicular Dimensions", body: "A space diagonal changes along length, breadth and height.", equation: `$$d^2=${length}^2+${breadth}^2+${height}^2=${diagonal ** 2n}$$` },
      { title: "Take the Square Root", body: "The generated dimensions form an exact three-dimensional Pythagorean state.", equation: `$$d=\\sqrt{${diagonal ** 2n}}=${diagonal}\\text{ ${unit}}$$` },
    ],
    shortcut: `Recognise the exact squared sum: $${length ** 2n}+${breadth ** 2n}+${height ** 2n}=${diagonal ** 2n}$.`,
  };
}

function triangularPrismDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const base = BigInt(2 * rng.int(3, 8));
  const triangleHeight = BigInt(rng.int(4, 12));
  const prismLength = BigInt(rng.int(8, 20));
  const baseArea = (base * triangleHeight) / 2n;
  const answer = q(baseArea * prismLength);
  const context = rng.pick(PRISM_CONTEXTS);
  return {
    state: makeState(prototypeId, seed, difficulty, "cm³", context, { base, triangleHeight, prismLength }, { baseArea: q(baseArea), answer }),
    stem: `A ${context} has a triangular base with base ${dimensionText(base, "cm")} and perpendicular height ${dimensionText(triangleHeight, "cm")}. Its length is ${dimensionText(prismLength, "cm")}. Find its volume.`,
    answer,
    wrongAnswers: [
      { value: q(base * triangleHeight * prismLength), misconceptionId: "OMITTED_TRIANGLE_HALF", explanation: "using $bh$ for the triangular base instead of $\\frac12 bh$" },
      { value: q(baseArea), misconceptionId: "STOPPED_AT_BASE_AREA", explanation: "finding the triangular base area but not extending it through the prism length" },
      { value: q((base + triangleHeight) * prismLength), misconceptionId: "USED_LENGTH_SUM", explanation: "using a sum of base measurements instead of the base area" },
    ],
    keyRule: "A right prism repeats the same base area throughout its length, so $V=A_{base}\\times L$.",
    steps: [
      { title: "Find the Triangular Base Area", body: "Use the perpendicular base and height of the triangle.", equation: `$$A_{base}=\\frac12\\times${base}\\times${triangleHeight}=${baseArea}\\text{ cm}^2$$` },
      { title: "Extend the Base Through the Prism", body: "Multiply that constant cross-sectional area by the prism length.", equation: `$$V=${baseArea}\\times${prismLength}=${baseArea * prismLength}\\text{ cm}^3$$` },
    ],
    shortcut: `Halve the even triangular dimension first, then multiply by the other height and prism length.`,
  };
}

function prismHeightInverseDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const baseArea = BigInt(rng.int(18, 80));
  const height = BigInt(rng.int(5, 18));
  const volume = baseArea * height;
  const answer = q(height);
  return {
    state: makeState(prototypeId, seed, difficulty, "cm", "prism-inverse", { baseArea, height, volume }, { answer }),
    stem: `A right prism has volume $${volume}\\text{ cm}^3$ and constant base area $${baseArea}\\text{ cm}^2$. Find its height.`,
    answer,
    wrongAnswers: [
      { value: q(volume + baseArea), misconceptionId: "ADDED_MEASURES", explanation: "adding unlike measurements instead of dividing volume by cross-sectional area" },
      { value: q(volume, 2n * baseArea), misconceptionId: "EXTRA_HALF_FACTOR", explanation: "introducing an unnecessary factor of $2$ into the prism formula" },
      { value: q(baseArea), misconceptionId: "REPORTED_BASE_AREA", explanation: "reporting the given cross-sectional area rather than the required length" },
    ],
    keyRule: "For any right prism, $V=A_{base}h$. Divide the volume by the constant base area to recover the height.",
    steps: [
      { title: "Write the Prism Relation", body: "The same cross-section continues through the full height.", equation: `$$${volume}=${baseArea}\\times h$$` },
      { title: "Divide by the Base Area", body: "Cubic units divided by square units leave a length.", equation: `$$h=\\frac{${volume}}{${baseArea}}=${height}\\text{ cm}$$` },
    ],
    shortcut: `Use the unit check: $\\text{cm}^3\\div\\text{cm}^2=\\text{cm}$.`,
  };
}

function cubeCountDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const smallSide = BigInt(rng.int(2, 5));
  const alongLength = BigInt(rng.int(3, 7));
  const alongBreadth = BigInt(rng.int(2, 6));
  const alongHeight = BigInt(rng.int(2, 5));
  const length = smallSide * alongLength;
  const breadth = smallSide * alongBreadth;
  const height = smallSide * alongHeight;
  const answer = q(alongLength * alongBreadth * alongHeight);
  return {
    state: makeState(prototypeId, seed, difficulty, "cubes", "cutting-cuboid", { smallSide, alongLength, alongBreadth, alongHeight, length, breadth, height }, { answer }),
    stem: `A cuboidal block of dimensions ${dimensionText(length, "cm")} × ${dimensionText(breadth, "cm")} × ${dimensionText(height, "cm")} is cut completely into cubes of side ${dimensionText(smallSide, "cm")}. How many cubes are formed?`,
    answer,
    wrongAnswers: [
      { value: q((length * breadth * height) / smallSide), misconceptionId: "DIVIDED_BY_SIDE_NOT_VOLUME", explanation: "dividing the large volume by one small edge instead of by the small cube's volume" },
      { value: q(alongLength + alongBreadth + alongHeight), misconceptionId: "ADDED_LAYER_COUNTS", explanation: "adding the counts along three directions instead of multiplying rows, columns and layers" },
      { value: q(alongLength * alongBreadth), misconceptionId: "COUNTED_ONE_LAYER", explanation: "counting one horizontal layer but omitting the number of layers in height" },
    ],
    keyRule: "Count how many small-cube edges fit along each dimension, then multiply the three direction counts.",
    steps: [
      { title: "Count Cubes Along Each Direction", body: "Divide every large dimension by the small cube's side.", equation: `$$\\frac{${length}}{${smallSide}}=${alongLength},\\quad\\frac{${breadth}}{${smallSide}}=${alongBreadth},\\quad\\frac{${height}}{${smallSide}}=${alongHeight}$$` },
      { title: "Multiply Rows, Columns and Layers", body: "Every position in one direction combines with every position in the other two.", equation: `$$N=${alongLength}\\times${alongBreadth}\\times${alongHeight}=${alongLength * alongBreadth * alongHeight}\\text{ cubes}$$` },
    ],
    shortcut: `Use $N=\\frac{L}{a}\\times\\frac{B}{a}\\times\\frac{H}{a}$; divisibility is exact in this state.`,
  };
}

function openTopBoxDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const length = BigInt(rng.int(8, 20));
  const breadth = BigInt(rng.int(5, 12));
  const height = BigInt(rng.int(3, 10));
  const baseArea = length * breadth;
  const lateralArea = 2n * height * (length + breadth);
  const answer = q(baseArea + lateralArea);
  return {
    state: makeState(prototypeId, seed, difficulty, "cm²", "open-top-box", { length, breadth, height }, { baseArea: q(baseArea), lateralArea: q(lateralArea), answer }),
    stem: `An open-top rectangular box is ${dimensionText(length, "cm")} long, ${dimensionText(breadth, "cm")} broad and ${dimensionText(height, "cm")} high. Find the sheet area required to make it, ignoring overlaps.`,
    answer,
    wrongAnswers: [
      { value: q(2n * (baseArea + breadth * height + height * length)), misconceptionId: "ADDED_MISSING_TOP", explanation: "using closed-cuboid TSA and adding a top face that the box does not have" },
      { value: q(lateralArea), misconceptionId: "OMITTED_BASE", explanation: "counting the four side faces but forgetting the bottom" },
      { value: q(length * breadth * height), misconceptionId: "USED_VOLUME", explanation: "calculating the capacity-like volume instead of the sheet area" },
    ],
    keyRule: "An open-top box has one base and four side faces. Add $lb+2lh+2bh$; do not include a lid.",
    steps: [
      { title: "Identify the Included Faces", body: "The bottom is present, the four walls are present and the top is missing." },
      { title: "Add the Base and Four Walls", body: "Use one $lb$ face and two faces of each side type.", equation: `$$A=${baseArea}+2(${length}\\times${height})+2(${breadth}\\times${height})=${baseArea + lateralArea}\\text{ cm}^2$$` },
    ],
    shortcut: `Start with closed TSA and subtract one top area: $2(lb+bh+hl)-lb$.`,
  };
}

function cubeScalingDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const factor = BigInt(rng.int(2, 5));
  const answer = q(factor ** 3n);
  return {
    state: makeState(prototypeId, seed, difficulty, "times", "cube-scaling", { factor }, { answer }),
    stem: `Every edge of a cube is multiplied by $${factor}$. How many times does its volume become?`,
    answer,
    wrongAnswers: [
      { value: q(factor), misconceptionId: "USED_LINEAR_SCALE", explanation: "applying the edge multiplier only once even though volume has three dimensions" },
      { value: q(factor ** 2n), misconceptionId: "USED_AREA_SCALE", explanation: "using the square law for surface area instead of the cube law for volume" },
      { value: q(factor + 3n), misconceptionId: "ADDED_POWER_TO_FACTOR", explanation: "adding the exponent $3$ to the scale factor instead of cubing the factor" },
    ],
    keyRule: "When every linear dimension is multiplied by $k$, volume is multiplied by $k^3$.",
    steps: [
      { title: "Apply the Factor to Three Dimensions", body: "Length, breadth and height each receive the same multiplier.", equation: `$$V'=(${factor}a)^3=${factor}^3a^3$$` },
      { title: "Evaluate the Volume Multiplier", body: "Cube the linear factor.", equation: `$$${factor}^3=${factor ** 3n}\\text{ times}$$` },
    ],
    shortcut: `Remember the power rule: length $k$, area $k^2$, volume $k^3$.`,
  };
}

const PERCENT_SCENARIOS = [
  { length: 20n, breadth: -10n, correct: 8n, wrong: [10n, 30n, 108n] as const },
  { length: 10n, breadth: 20n, correct: 32n, wrong: [30n, 12n, 132n] as const },
  { length: 50n, breadth: -20n, correct: 20n, wrong: [30n, 70n, 120n] as const },
  { length: 25n, breadth: 20n, correct: 50n, wrong: [45n, 30n, 150n] as const },
] as const;

function percentPhrase(value: bigint) {
  return value >= 0n ? `increased by $${value}\\%$` : `decreased by $${-value}\\%$`;
}

function cuboidPercentDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const scenario = rng.pick(PERCENT_SCENARIOS);
  const answer = q(scenario.correct);
  return {
    state: makeState(prototypeId, seed, difficulty, "%", "cuboid-percentage", { lengthChange: scenario.length, breadthChange: scenario.breadth, heightChange: 0n }, { answer }),
    stem: `The length of a cuboid is ${percentPhrase(scenario.length)} and its breadth is ${percentPhrase(scenario.breadth)}, while its height remains unchanged. Find the percentage increase in volume.`,
    answer,
    wrongAnswers: [
      { value: q(scenario.wrong[0]), misconceptionId: "ADDED_SIGNED_PERCENTAGES", explanation: "adding or subtracting the stated percentages directly instead of multiplying dimension factors" },
      { value: q(scenario.wrong[1]), misconceptionId: "IGNORED_DIRECTION", explanation: "combining the percentage magnitudes without respecting increase versus decrease" },
      { value: q(scenario.wrong[2]), misconceptionId: "REPORTED_NEW_PERCENT", explanation: "reporting the new volume index rather than the percentage increase over the original" },
    ],
    keyRule: "For independent dimension changes, multiply the new dimension factors. The volume percentage change comes from the final multiplier, not from simply adding percentages.",
    steps: [
      { title: "Convert Changes into Multipliers", body: `Length factor $=\\frac{${100n + scenario.length}}{100}$ and breadth factor $=\\frac{${100n + scenario.breadth}}{100}$.` },
      { title: "Multiply the Dimension Factors", body: "Height is unchanged, so its factor is $1$.", equation: `$$\\frac{${100n + scenario.length}}{100}\\times\\frac{${100n + scenario.breadth}}{100}=\\frac{${100n + scenario.correct}}{100}$$` },
      { title: "Compare with the Original Volume", body: `The final multiplier is $1+\\frac{${scenario.correct}}{100}$, so volume increases by $${scenario.correct}\\%$.` },
    ],
    shortcut: `Use successive change: $a+b+\\frac{ab}{100}$ with the decrease entered as a negative percentage.`,
  };
}

function cubicCmToLitresDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const litres = BigInt(rng.int(2, 60));
  const cubicCentimetres = litres * 1000n;
  const answer = q(litres);
  return {
    state: makeState(prototypeId, seed, difficulty, "litres", "capacity-conversion", { cubicCentimetres }, { answer }),
    stem: `A rectangular container has a capacity of $${cubicCentimetres}\\text{ cm}^3$. Express this capacity in litres.`,
    answer,
    wrongAnswers: [
      { value: q(cubicCentimetres, 100n), misconceptionId: "USED_LINEAR_FACTOR", explanation: "dividing by $100$ as though converting centimetres to metres instead of cubic centimetres to litres" },
      { value: q(cubicCentimetres, 10_000n), misconceptionId: "USED_AREA_FACTOR", explanation: "using an area conversion factor rather than $1000\\text{ cm}^3=1$ litre" },
      { value: q(cubicCentimetres), misconceptionId: "KEPT_NUMERIC_VALUE", explanation: "changing the unit label without changing the numerical value" },
    ],
    keyRule: "$1000\\text{ cm}^3=1$ litre. Divide cubic centimetres by $1000$ to convert capacity to litres.",
    steps: [
      { title: "Use the Capacity Equivalence", body: "One litre occupies exactly one thousand cubic centimetres." },
      { title: "Divide by One Thousand", body: "This converts the cubic-centimetre count into litres.", equation: `$$${cubicCentimetres}\\div1000=${litres}\\text{ litres}$$` },
    ],
    shortcut: `Remove three trailing zeros when the cubic-centimetre value is a whole multiple of $1000$.`,
  };
}

function paintingCostDraft(prototypeId: MenCp007PrototypeId, seed: string, rng: SeededRandom, difficulty: Men002Difficulty): Draft {
  const length = BigInt(rng.int(4, 12));
  const breadth = BigInt(rng.int(3, 9));
  const height = BigInt(rng.int(2, 7));
  const rate = BigInt(rng.int(3, 12));
  const tsa = 2n * (length * breadth + breadth * height + height * length);
  const lsa = 2n * height * (length + breadth);
  const answer = q(tsa * rate);
  return {
    state: makeState(prototypeId, seed, difficulty, "£", "painting-cost", { length, breadth, height, rate }, { surfaceArea: q(tsa), answer }),
    stem: `A closed cuboidal display box measures ${dimensionText(length, "m")} by ${dimensionText(breadth, "m")} by ${dimensionText(height, "m")}. Painting costs $\\text{£}${rate}$ per square metre. Find the total painting cost.`,
    answer,
    wrongAnswers: [
      { value: q(tsa), misconceptionId: "REPORTED_AREA_NOT_COST", explanation: "stopping at the total surface area and not multiplying by the rate" },
      { value: q(lsa * rate), misconceptionId: "PAINTED_SIDE_WALLS_ONLY", explanation: "charging for the four walls but omitting the top and bottom of the closed box" },
      { value: q(length * breadth * height * rate), misconceptionId: "USED_VOLUME_RATE", explanation: "multiplying volume by an area-based painting rate" },
    ],
    keyRule: "Painting cost equals the actual painted area multiplied by the rate per square metre. A closed cuboid uses $2(lb+bh+hl)$.",
    steps: [
      { title: "Find the Painted Surface Area", body: "All six faces are painted because the box is closed.", equation: `$$TSA=2(${length * breadth}+${breadth * height}+${height * length})=${tsa}\\text{ m}^2$$` },
      { title: "Apply the Area Rate", body: `Multiply by $\\text{£}${rate}$ for each square metre.`, equation: `$$Cost=${tsa}\\times\\text{£}${rate}=\\text{£}${tsa * rate}$$` },
    ],
    shortcut: `Calculate $lb+bh+hl$, double once, then multiply by the painting rate.`,
  };
}

function generateDraft(prototypeId: MenCp007PrototypeId, seed: string): Draft {
  const rng = createSeededRandom(`${prototypeId}:${seed}`);
  const difficulty = rng.pick(DIFFICULTIES);
  switch (prototypeId) {
    case "MEN-CP007-PROT-CUBE-VOLUME": return cubeVolumeDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-CUBE-TSA": return cubeTsaDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-CUBE-SIDE-FROM-VOLUME": return cubeSideFromVolumeDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-CUBE-SPACE-DIAGONAL": return cubeSpaceDiagonalDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-CUBE-SIDE-FROM-SPACE-DIAGONAL": return cubeSideFromDiagonalDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-CUBOID-VOLUME": return cuboidVolumeDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-CUBOID-TSA": return cuboidTsaDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-CUBOID-HEIGHT-FROM-VOLUME": return cuboidHeightFromVolumeDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-CUBOID-SPACE-DIAGONAL": return cuboidDiagonalDraft(prototypeId, seed, rng, difficulty, false);
    case "MEN-CP007-PROT-LONGEST-ROD-CUBOID": return cuboidDiagonalDraft(prototypeId, seed, rng, difficulty, true);
    case "MEN-CP007-PROT-TRIANGULAR-PRISM-VOLUME": return triangularPrismDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-PRISM-HEIGHT-FROM-VOLUME": return prismHeightInverseDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-CUBES-CUT-FROM-CUBOID": return cubeCountDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-OPEN-TOP-BOX-AREA": return openTopBoxDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-CUBE-VOLUME-SCALING": return cubeScalingDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-CUBOID-VOLUME-PERCENT-CHANGE": return cuboidPercentDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-CUBIC-CM-TO-LITRES": return cubicCmToLitresDraft(prototypeId, seed, rng, difficulty);
    case "MEN-CP007-PROT-CUBOID-PAINTING-COST": return paintingCostDraft(prototypeId, seed, rng, difficulty);
  }
}

function verifyDraft(draft: Draft) {
  const d = draft.state.dimensions;
  let reconstructed: ExactValue;
  let method: string;
  switch (draft.state.solveMode) {
    case "findCubeVolume":
      reconstructed = q(d.side! * d.side! * d.side!);
      method = "reconstructed from three perpendicular equal dimensions";
      break;
    case "findCubeTotalSurfaceArea":
      reconstructed = q(6n * d.side! * d.side!);
      method = "reconstructed by summing six congruent face areas";
      break;
    case "findCubeSideFromVolume":
      reconstructed = q(integerCubeRoot(d.volume!));
      method = "bounded exact perfect-cube recovery";
      break;
    case "findCubeSpaceDiagonal":
      reconstructed = exactFromSquaredLength(3n * d.side! * d.side!);
      method = "three-axis squared-length identity";
      break;
    case "findCubeSideFromSpaceDiagonal": {
      const candidate = asBigInt(draft.answer);
      reconstructed = surd(candidate, 3n);
      method = "substituted candidate side into d=a√3";
      return {
        valid: exactEquals(reconstructed, draft.state.derived.diagonal!),
        method,
        reconstructed: exactKey(reconstructed),
      };
    }
    case "findCuboidVolume":
      reconstructed = q(d.length! * d.breadth! * d.height!);
      method = "base-area times perpendicular height reconstruction";
      break;
    case "findCuboidTotalSurfaceArea":
      reconstructed = q(2n * (d.length! * d.breadth! + d.breadth! * d.height! + d.height! * d.length!));
      method = "summed three opposite face pairs";
      break;
    case "findCuboidHeightFromVolume": {
      const candidate = asBigInt(draft.answer);
      reconstructed = q(d.length! * d.breadth! * candidate);
      method = "substituted candidate height into original volume evidence";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.volume!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findCuboidSpaceDiagonal":
    case "findLongestRodInCuboid":
      reconstructed = exactFromSquaredLength(d.length! ** 2n + d.breadth! ** 2n + d.height! ** 2n);
      method = "independent three-dimensional squared-length reconstruction";
      break;
    case "findTriangularPrismVolume":
      reconstructed = q(d.base! * d.triangleHeight! * d.prismLength!, 2n);
      method = "triangular cross-section integrated through prism length";
      break;
    case "findPrismHeightFromVolumeAndBaseArea": {
      const candidate = asBigInt(draft.answer);
      reconstructed = q(d.baseArea! * candidate);
      method = "substituted candidate height into base-area extrusion";
      return { valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.volume!, method, reconstructed: exactKey(reconstructed) };
    }
    case "findSmallCubeCountFromCuboid":
      reconstructed = q((d.length! / d.smallSide!) * (d.breadth! / d.smallSide!) * (d.height! / d.smallSide!));
      method = "dimension-wise integer arrangement count";
      break;
    case "findOpenTopCuboidSheetArea":
      reconstructed = q(d.length! * d.breadth! + 2n * d.length! * d.height! + 2n * d.breadth! * d.height!);
      method = "explicit included-face enumeration";
      break;
    case "findCubeVolumeScaleRatio":
      reconstructed = q(d.factor! ** 3n);
      method = "recomputed scaled dimensions and volume power law";
      break;
    case "findCuboidVolumePercentageChange": {
      const numerator = (100n + d.lengthChange!) * (100n + d.breadth!) * (100n + d.heightChange!);
      reconstructed = q(numerator - 1_000_000n, 10_000n);
      method = "exact multiplier comparison with original volume index";
      break;
    }
    case "convertCubicCentimetresToLitres":
      reconstructed = q(d.cubicCentimetres!, 1000n);
      method = "exact inverse conversion using 1 litre = 1000 cm³";
      break;
    case "findCuboidPaintingCost": {
      const area = 2n * (d.length! * d.breadth! + d.breadth! * d.height! + d.height! * d.length!);
      reconstructed = q(area * d.rate!);
      method = "reconstructed six-face area then applied area rate";
      break;
    }
  }
  return { valid: exactEquals(reconstructed, draft.answer), method, reconstructed: exactKey(reconstructed) };
}

function buildOptions(draft: Draft, rng: SeededRandom) {
  const candidates = [
    { value: draft.answer, misconceptionId: null, explanation: "" },
    ...draft.wrongAnswers,
  ];
  const uniqueKeys = new Set(candidates.map((candidate) => exactKey(candidate.value)));
  if (uniqueKeys.size !== 4) throw new Error(`${draft.state.prototypeId} generated duplicate option values.`);
  const shuffled = rng.shuffle(candidates);
  const labels = ["A", "B", "C", "D"] as const;
  const options: MenCp007Option[] = shuffled.map((candidate, index) => ({
    label: labels[index]!,
    value: candidate.value,
    display: formatWithUnit(candidate.value, draft.state.unit),
    isCorrect: candidate.misconceptionId === null,
    misconceptionId: candidate.misconceptionId,
  }));
  const wrongExplanationByKey = new Map(draft.wrongAnswers.map((wrong) => [exactKey(wrong.value), wrong.explanation]));
  const traps = options
    .filter((option) => !option.isCorrect)
    .map((option) => `Option ${option.label} (${option.display}): Common mistake: ${wrongExplanationByKey.get(exactKey(option.value))}.`);
  return { options, traps };
}

function validatePackage(question: Omit<MenCp007QuestionPackage, "validation">) {
  const checks = [
    { name: "independent verifier", passed: question.verification.valid, message: "Independent verification must agree with the canonical answer." },
    { name: "four options", passed: question.options.length === 4, message: "Exactly four options are required." },
    { name: "unique options", passed: new Set(question.options.map((option) => exactKey(option.value))).size === 4, message: "Option values must be unique after exact normalisation." },
    { name: "one correct", passed: question.options.filter((option) => option.isCorrect).length === 1, message: "Exactly one option must be correct." },
    { name: "prototype lifecycle", passed: question.permanentQlId === null && !question.publiclyPublishable && !question.questionStudioDiscoverable, message: "Discovery prototypes must remain unpublished and unallocated." },
    { name: "four-tier explanation", passed: Boolean(question.explanation.keyRule) && question.explanation.steps.length >= 2 && Boolean(question.explanation.shortcut) && question.explanation.traps.length === 3, message: "Every package requires rule, steps, shortcut and three option-specific traps." },
    { name: "exact rendering", passed: !/[½¼]/.test(JSON.stringify(question, (_key, value) => typeof value === "bigint" ? value.toString() : value)), message: "Learner-facing content must not use raw Unicode fractions." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp007Prototype(prototypeId: MenCp007PrototypeId, seed: string): MenCp007QuestionPackage {
  const draft = generateDraft(prototypeId, seed);
  const verification = verifyDraft(draft);
  const optionRng = createSeededRandom(`${prototypeId}:${seed}:options`);
  const { options, traps } = buildOptions(draft, optionRng);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const partial = {
    packageId: MEN_002_PACKAGE_ID,
    canonicalProblemId: MEN_CP_007_ID,
    permanentQlId: null,
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
