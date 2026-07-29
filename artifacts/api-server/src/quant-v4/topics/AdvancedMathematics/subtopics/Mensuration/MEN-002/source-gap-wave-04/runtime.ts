import {
  exactEquals,
  exactFromSquaredLength,
  exactKey,
  formatWithUnit,
  integerCubeRoot,
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
import { getMenCp007Wave04Prototype } from "./registry";
import type {
  MenCp007Wave04Option,
  MenCp007Wave04Package,
  MenCp007Wave04PrototypeId,
  MenCp007Wave04State,
} from "./types";

interface WrongAnswer {
  value: ExactValue;
  misconceptionId: string;
  explanation: string;
}

interface Draft {
  state: MenCp007Wave04State;
  stem: string;
  answer: ExactValue;
  wrongAnswers: [WrongAnswer, WrongAnswer, WrongAnswer];
  keyRule: string;
  steps: MenCp007Wave04Package["explanation"]["steps"];
  shortcut: string;
}

const ADJACENT_FACE_STATES = [
  { length: 30n, breadth: 24n, height: 18n },
  { length: 27n, breadth: 21n, height: 15n },
  { length: 26n, breadth: 20n, height: 14n },
  { length: 35n, breadth: 25n, height: 15n },
  { length: 32n, breadth: 18n, height: 12n },
  { length: 28n, breadth: 22n, height: 16n },
] as const;

const FACE_RATIO_STATES = [
  { length: 30n, breadth: 20n, height: 15n },
  { length: 24n, breadth: 18n, height: 12n },
  { length: 35n, breadth: 21n, height: 15n },
  { length: 28n, breadth: 20n, height: 14n },
  { length: 32n, breadth: 24n, height: 18n },
  { length: 27n, breadth: 18n, height: 12n },
] as const;

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

function gcd3(a: bigint, b: bigint, c: bigint) {
  return gcd(gcd(a, b), c);
}

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

function dimension(value: bigint) {
  return `$${value}\\text{ cm}$`;
}

function makeState(
  prototypeId: MenCp007Wave04PrototypeId,
  seed: string,
  unit: Men002Unit,
  dimensions: Record<string, bigint>,
  derived: Record<string, ExactValue>,
): MenCp007Wave04State {
  const definition = getMenCp007Wave04Prototype(prototypeId);
  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-007",
    permanentQlId: null,
    waveId: "MEN-CP-007-SOURCE-GAP-WAVE-04",
    prototypeId,
    solveMode: definition.solveMode,
    target: definition.target,
    shape: definition.shape,
    seed,
    difficulty: "Medium",
    dimensions,
    derived,
    unit,
    displayMode: "UNIT",
  };
}

function adjacentMeasures(length: bigint, breadth: bigint, height: bigint) {
  const lengthBreadthArea = length * breadth;
  const breadthHeightArea = breadth * height;
  const heightLengthArea = height * length;
  const volume = length * breadth * height;
  return { lengthBreadthArea, breadthHeightArea, heightLengthArea, volume };
}

function volumeFromAdjacentFacesDraft(
  prototypeId: MenCp007Wave04PrototypeId,
  seed: string,
  rng: SeededRandom,
): Draft {
  const selected = rng.pick(ADJACENT_FACE_STATES);
  const measures = adjacentMeasures(selected.length, selected.breadth, selected.height);
  const { lengthBreadthArea, breadthHeightArea, heightLengthArea, volume } = measures;
  const faceAreaSum = lengthBreadthArea + breadthHeightArea + heightLengthArea;
  const facePairRoot = exactFromSquaredLength(lengthBreadthArea * breadthHeightArea);
  const faceAreaProduct = lengthBreadthArea * breadthHeightArea * heightLengthArea;
  const answer = q(volume);

  return {
    state: makeState(
      prototypeId,
      seed,
      "cm³",
      { ...selected, ...measures, faceAreaSum, faceAreaProduct },
      { answer, facePairRoot },
    ),
    stem: `The areas of three adjacent faces of a cuboidal box are $${lengthBreadthArea}\\text{ cm}^{2}$, $${breadthHeightArea}\\text{ cm}^{2}$ and $${heightLengthArea}\\text{ cm}^{2}$. Find the volume of the box.`,
    answer,
    wrongAnswers: [
      {
        value: q(faceAreaSum),
        misconceptionId: "ADDED_FACE_AREAS",
        explanation: "adding the three face areas instead of using their product to form the square of the volume",
      },
      {
        value: facePairRoot,
        misconceptionId: "USED_ONLY_TWO_FACES",
        explanation: "using only two adjacent face areas and leaving out the third face",
      },
      {
        value: q(faceAreaProduct),
        misconceptionId: "OMITTED_SQUARE_ROOT",
        explanation: "multiplying the three face areas but reporting $V^2$ without taking its square root",
      },
    ],
    keyRule: "If the adjacent face areas are $lb$, $bh$ and $hl$, then $(lb)(bh)(hl)=l^2b^2h^2=V^2$.",
    steps: [
      {
        title: "Multiply the Three Adjacent Face Areas",
        body: "Their product equals the square of the cuboid's volume.",
        equation: `$$V^2=${lengthBreadthArea}\\times${breadthHeightArea}\\times${heightLengthArea}=${volume ** 2n}$$`,
      },
      {
        title: "Take the Positive Square Root",
        body: "Volume is positive, so take the positive square root.",
        equation: `$$V=\\sqrt{${volume ** 2n}}=${volume}\\text{ cm}^{3}$$`,
      },
    ],
    shortcut: "Multiply the three adjacent face areas and take one square root.",
  };
}

function lengthFromAdjacentFacesDraft(
  prototypeId: MenCp007Wave04PrototypeId,
  seed: string,
  rng: SeededRandom,
): Draft {
  const selected = rng.pick(ADJACENT_FACE_STATES);
  const measures = adjacentMeasures(selected.length, selected.breadth, selected.height);
  const { lengthBreadthArea, breadthHeightArea, heightLengthArea } = measures;
  const lengthSquared = (lengthBreadthArea * heightLengthArea) / breadthHeightArea;
  const answer = q(selected.length);

  return {
    state: makeState(
      prototypeId,
      seed,
      "cm",
      { ...selected, ...measures, lengthSquared },
      { answer },
    ),
    stem: `For a cuboid, the length–breadth face has area $${lengthBreadthArea}\\text{ cm}^{2}$, the breadth–height face has area $${breadthHeightArea}\\text{ cm}^{2}$ and the height–length face has area $${heightLengthArea}\\text{ cm}^{2}$. Find its length.`,
    answer,
    wrongAnswers: [
      {
        value: q(selected.breadth),
        misconceptionId: "REPORTED_BREADTH",
        explanation: "combining the face areas in the order that gives the breadth instead of the requested length",
      },
      {
        value: q(selected.height),
        misconceptionId: "REPORTED_HEIGHT",
        explanation: "combining the face areas in the order that gives the height instead of the requested length",
      },
      {
        value: q(lengthBreadthArea, heightLengthArea),
        misconceptionId: "DIVIDED_FACE_AREAS_DIRECTLY",
        explanation: "dividing two face areas directly and reporting a ratio without forming $l^2$",
      },
    ],
    keyRule: "Use $l^2=\\frac{(lb)(lh)}{bh}$. The unwanted breadth and height factors cancel, leaving the square of the length.",
    steps: [
      {
        title: "Form the Square of the Length",
        body: "Multiply the two face areas that contain the length, then divide by the face area that does not contain it.",
        equation: `$$l^2=\\frac{${lengthBreadthArea}\\times${heightLengthArea}}{${breadthHeightArea}}=${lengthSquared}$$`,
      },
      {
        title: "Take the Positive Square Root",
        body: "A dimension is positive.",
        equation: `$$l=\\sqrt{${lengthSquared}}=${selected.length}\\text{ cm}$$`,
      },
    ],
    shortcut: "For the requested side, multiply the two face areas containing that side and divide by the remaining face area before taking the square root.",
  };
}

function shortestSideFromFaceRatioDraft(
  prototypeId: MenCp007Wave04PrototypeId,
  seed: string,
  rng: SeededRandom,
): Draft {
  const selected = rng.pick(FACE_RATIO_STATES);
  const measures = adjacentMeasures(selected.length, selected.breadth, selected.height);
  const { lengthBreadthArea, breadthHeightArea, heightLengthArea, volume } = measures;
  const commonAreaFactor = gcd3(lengthBreadthArea, breadthHeightArea, heightLengthArea);
  const ratioLb = lengthBreadthArea / commonAreaFactor;
  const ratioBh = breadthHeightArea / commonAreaFactor;
  const ratioHl = heightLengthArea / commonAreaFactor;
  const ratioProduct = ratioLb * ratioBh * ratioHl;
  const recoveredAreaFactor = integerCubeRoot((volume ** 2n) / ratioProduct);
  const faceAreas = [lengthBreadthArea, breadthHeightArea, heightLengthArea].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  const minimumFaceArea = faceAreas[0]!;
  const middleFaceArea = faceAreas[1]!;
  const maximumFaceArea = faceAreas[2]!;
  const shortestSide = volume / maximumFaceArea;
  const middleSide = volume / middleFaceArea;
  const longestSide = volume / minimumFaceArea;
  const answer = q(shortestSide);

  return {
    state: makeState(
      prototypeId,
      seed,
      "cm",
      {
        ...selected,
        ...measures,
        commonAreaFactor,
        ratioLb,
        ratioBh,
        ratioHl,
        ratioProduct,
        recoveredAreaFactor,
        minimumFaceArea,
        middleFaceArea,
        maximumFaceArea,
        shortestSide,
        middleSide,
        longestSide,
      },
      { answer },
    ),
    stem: `The areas of the three adjacent faces of a cuboid are in the ratio $${ratioLb}:${ratioBh}:${ratioHl}$, and its volume is $${volume}\\text{ cm}^{3}$. Find the length of its shortest side.`,
    answer,
    wrongAnswers: [
      {
        value: q(longestSide),
        misconceptionId: "USED_SMALLEST_FACE_AREA",
        explanation: "dividing the volume by the smallest face area, which gives the longest side",
      },
      {
        value: q(middleSide),
        misconceptionId: "USED_MIDDLE_FACE_AREA",
        explanation: "dividing the volume by the middle face area instead of the largest face area",
      },
      {
        value: q(volume, lengthBreadthArea + breadthHeightArea + heightLengthArea),
        misconceptionId: "DIVIDED_BY_FACE_AREA_SUM",
        explanation: "dividing the volume by the sum of all three face areas rather than by the face opposite the required side",
      },
    ],
    keyRule: "Write the face areas as $px$, $qx$ and $rx$. Since their product equals $V^2$, $pqr x^3=V^2$. The shortest side equals volume divided by the largest face area.",
    steps: [
      {
        title: "Find the Common Face-Area Factor",
        body: "Use the volume identity to find the common multiplier in the three face areas.",
        equation: `$$x=\\sqrt[3]{\\frac{${volume}^2}{${ratioLb}\\times${ratioBh}\\times${ratioHl}}}=${recoveredAreaFactor}\\text{ cm}^{2}$$`,
      },
      {
        title: "Find the Three Face Areas",
        body: "Multiply each ratio term by the common factor.",
        equation: `$$${ratioLb}x=${lengthBreadthArea},\\quad${ratioBh}x=${breadthHeightArea},\\quad${ratioHl}x=${heightLengthArea}\\text{ cm}^{2}$$`,
      },
      {
        title: "Use the Largest Face to Find the Shortest Side",
        body: "For a cuboid, volume divided by a face area gives the side perpendicular to that face. The largest face is opposite the shortest side.",
        equation: `$$Shortest\\ side=\\frac{${volume}}{${maximumFaceArea}}=${shortestSide}\\text{ cm}$$`,
      },
    ],
    shortcut: "After recovering the three face areas, divide the volume by the largest face area to get the shortest side.",
  };
}

export function classifyMenCp007Wave04Difficulty(state: MenCp007Wave04State): Men002Difficulty {
  const d = state.dimensions;
  switch (state.solveMode) {
    case "findCuboidVolumeFromAdjacentFaceAreas":
      return d.volume! >= 9000n ? "Hard" : "Medium";
    case "findCuboidLengthFromAdjacentFaceAreas":
      return d.length! >= 30n ? "Hard" : "Medium";
    case "findShortestCuboidSideFromFaceAreaRatioAndVolume":
      return d.volume! >= 9000n ? "Hard" : "Medium";
  }
}

function generateDraft(prototypeId: MenCp007Wave04PrototypeId, seed: string): Draft {
  const rng = createSeededRandom(`${prototypeId}:${seed}`);
  switch (prototypeId) {
    case "MEN-CP007-W4-PROT-CUBOID-VOLUME-FROM-ADJACENT-FACE-AREAS":
      return volumeFromAdjacentFacesDraft(prototypeId, seed, rng);
    case "MEN-CP007-W4-PROT-CUBOID-LENGTH-FROM-ADJACENT-FACE-AREAS":
      return lengthFromAdjacentFacesDraft(prototypeId, seed, rng);
    case "MEN-CP007-W4-PROT-SHORTEST-SIDE-FROM-FACE-AREA-RATIO-VOLUME":
      return shortestSideFromFaceRatioDraft(prototypeId, seed, rng);
  }
}

function verifyDraft(draft: Draft) {
  const d = draft.state.dimensions;
  let reconstructed: ExactValue;
  let method: string;

  switch (draft.state.solveMode) {
    case "findCuboidVolumeFromAdjacentFaceAreas": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(candidate ** 2n);
      method = "squared the candidate volume and compared it with the product of the three adjacent face areas";
      return {
        valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.faceAreaProduct!,
        method,
        reconstructed: exactKey(reconstructed),
      };
    }
    case "findCuboidLengthFromAdjacentFaceAreas": {
      const candidate = asInteger(draft.answer);
      reconstructed = q(candidate ** 2n * d.breadthHeightArea!);
      method = "multiplied the squared candidate length by the opposite face area and checked the product of the two faces containing length";
      return {
        valid: reconstructed.kind === "RATIONAL" && reconstructed.numerator === d.lengthBreadthArea! * d.heightLengthArea!,
        method,
        reconstructed: exactKey(reconstructed),
      };
    }
    case "findShortestCuboidSideFromFaceAreaRatioAndVolume": {
      const factor = integerCubeRoot((d.volume! ** 2n) / d.ratioProduct!);
      const maximumFaceArea = [d.ratioLb!, d.ratioBh!, d.ratioHl!]
        .map((ratio) => ratio * factor)
        .reduce((maximum, area) => area > maximum ? area : maximum, 0n);
      reconstructed = q(d.volume!, maximumFaceArea);
      method = "independently recovered the common face-area factor, selected the largest face and divided volume by it";
      break;
    }
  }

  return { valid: exactEquals(reconstructed, draft.answer), method, reconstructed: exactKey(reconstructed) };
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
  const options: MenCp007Wave04Option[] = rng.shuffle(candidates).map((candidate, index) => ({
    label: labels[index]!,
    value: candidate.value,
    display: formatWithUnit(candidate.value, draft.state.unit),
    isCorrect: candidate.misconceptionId === null,
    misconceptionId: candidate.misconceptionId,
  }));
  const explanationByKey = new Map(draft.wrongAnswers.map((wrong) => [exactKey(wrong.value), wrong.explanation]));
  const traps = options
    .filter((option) => !option.isCorrect)
    .map((option) => `Option ${option.label} (${option.display}): Common mistake: ${explanationByKey.get(exactKey(option.value))}.`);
  return { options, traps };
}

function validatePackage(question: Omit<MenCp007Wave04Package, "validation">) {
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
    { name: "state-derived difficulty", passed: question.difficulty === classifyMenCp007Wave04Difficulty(question.state), message: "Difficulty must derive from canonical state." },
    { name: "four-tier teaching", passed: Boolean(question.explanation.keyRule) && question.explanation.steps.length >= 2 && Boolean(question.explanation.shortcut) && question.explanation.traps.length === 3, message: "Rule, steps, shortcut and three traps are required." },
    { name: "MathJax cleanliness", passed: !/[½¼²³]/.test(learnerText) && !/(^|[^\\])sqrt\{/.test(explanationText) && !/\$\$[^$]*\/[^$]*\$\$/.test(explanationText), message: "Use MathJax fractions, powers, roots and division." },
    { name: "control characters", passed: !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(learnerText), message: "Learner text must not contain hidden control characters." },
    { name: "currency locale", passed: !/[£€¥]/.test(learnerText), message: "Indian exam content must not use foreign currency symbols." },
    { name: "lifecycle lock", passed: question.permanentQlId === null && !question.publiclyPublishable && !question.questionStudioDiscoverable, message: "Wave prototypes must remain unallocated and unpublished." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp007Wave04Prototype(
  prototypeId: MenCp007Wave04PrototypeId,
  seed: string,
): MenCp007Wave04Package {
  const draft = generateDraft(prototypeId, seed);
  draft.state.difficulty = classifyMenCp007Wave04Difficulty(draft.state);
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
    waveId: "MEN-CP-007-SOURCE-GAP-WAVE-04" as const,
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
