import {
  exactEquals,
  exactKey,
  formatWithUnit,
  integerCubeRoot,
  isPositive,
  rational,
  surd,
} from "../foundation/exact";
import { createSeededRandom, type SeededRandom } from "../foundation/seed";
import type { ExactRational, ExactValue, Men002Unit } from "../foundation/types";
import { getMenCp008Wave04Definition } from "./registry";
import type {
  MenCp008Wave04Option,
  MenCp008Wave04Package,
  MenCp008Wave04PrototypeId,
  MenCp008Wave04State,
} from "./types";

interface WrongAnswer {
  value: ExactValue;
  misconceptionId: string;
  explanation: string;
}

interface Draft {
  state: MenCp008Wave04State;
  stem: string;
  answer: ExactValue;
  wrongAnswers: WrongAnswer[];
  keyRule: string;
  steps: MenCp008Wave04Package["explanation"]["steps"];
  shortcut: string;
}

const SIMILAR_CONE_STATES = [
  { numerator: 1n, denominator: 2n },
  { numerator: 1n, denominator: 3n },
  { numerator: 2n, denominator: 3n },
  { numerator: 3n, denominator: 4n },
  { numerator: 2n, denominator: 5n },
  { numerator: 4n, denominator: 5n },
] as const;

const SEMICIRCLE_STATES = [10n, 14n, 18n, 22n, 26n, 30n] as const;

const RECTANGLE_STATES = [
  { length: 30n, breadth: 18n },
  { length: 28n, breadth: 16n },
  { length: 35n, breadth: 21n },
  { length: 32n, breadth: 24n },
  { length: 40n, breadth: 16n },
  { length: 48n, breadth: 30n },
] as const;

const MINIMUM_SURFACE_STATES = [3n, 4n, 5n, 6n, 7n, 8n] as const;

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

function dimension(value: bigint, unit = "cm") {
  return `$${value}\\text{ ${unit}}$`;
}

function volumeCoefficient(value: bigint) {
  return `$${value}\\pi\\text{ cm}^{3}$`;
}

function makeState(
  prototypeId: MenCp008Wave04PrototypeId,
  seed: string,
  dimensions: Record<string, bigint>,
  derived: Record<string, ExactValue>,
  unit: Men002Unit,
  displayMode: MenCp008Wave04State["displayMode"],
  difficultyFlag: bigint,
): MenCp008Wave04State {
  const definition = getMenCp008Wave04Definition(prototypeId);
  const state: MenCp008Wave04State = {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-008",
    permanentQlId: null,
    waveId: "MEN-CP-008-SOURCE-GAP-WAVE-04",
    prototypeId,
    solveMode: definition.solveMode,
    target: definition.target,
    shape: definition.shape,
    seed,
    difficulty: "Medium",
    piPolicy: "EXACT_PI",
    dimensions: { ...dimensions, difficultyFlag },
    derived,
    unit,
    displayMode,
  };
  state.difficulty = classifyMenCp008Wave04Difficulty(state);
  return state;
}

function stemVariant(rng: SeededRandom, variants: readonly string[]) {
  return rng.pick(variants);
}

function similarConeDraft(
  prototypeId: MenCp008Wave04PrototypeId,
  seed: string,
  rng: SeededRandom,
  difficultyFlag: bigint,
): Draft {
  const { numerator, denominator } = rng.pick(SIMILAR_CONE_STATES);
  const answer = q(numerator ** 3n, denominator ** 3n);
  return {
    state: makeState(
      prototypeId,
      seed,
      { heightNumerator: numerator, heightDenominator: denominator },
      { answer },
      "times",
      "RATIO",
      difficultyFlag,
    ),
    stem: stemVariant(rng, [
      `A cone is filled to $\\frac{${numerator}}{${denominator}}$ of its height. The liquid forms a smaller cone similar to the whole cone. Find the ratio of the liquid volume to the cone's full volume.`,
      `Water occupies the top-similar portion of a cone up to $\\frac{${numerator}}{${denominator}}$ of its full height. What fraction of the complete cone's volume is filled?`,
      `The linear scale of a smaller cone inside a right circular cone is $${numerator}:${denominator}$. Find the smaller cone's volume as a ratio of the original volume.`,
      `A plane parallel to the base cuts off a smaller similar cone whose height is $\\frac{${numerator}}{${denominator}}$ of the original height. Find $V_{small}:V_{original}$.`,
    ]),
    answer,
    wrongAnswers: [
      {
        value: q(numerator, denominator),
        misconceptionId: "USED_LINEAR_RATIO",
        explanation: "using the height ratio directly instead of cubing the common linear scale",
      },
      {
        value: q(numerator ** 2n, denominator ** 2n),
        misconceptionId: "USED_AREA_RATIO",
        explanation: "squaring the scale as for area rather than cubing it for volume",
      },
      {
        value: q(denominator ** 3n, numerator ** 3n),
        misconceptionId: "REVERSED_VOLUME_RATIO",
        explanation: "cubing correctly but reversing smaller cone and original cone",
      },
    ],
    keyRule: "Similar solids scale in volume as the cube of their common linear scale. For similar cones, a height ratio of $a:b$ gives a volume ratio of $a^3:b^3$.",
    steps: [
      {
        title: "Identify the Linear Scale",
        body: "The smaller cone and the whole cone are similar, so their radii and heights have the same scale.",
        equation: `$$k=\\frac{${numerator}}{${denominator}}$$`,
      },
      {
        title: "Cube the Scale for Volume",
        body: "Volume is a three-dimensional measure, so use the cube of the linear factor.",
        equation: `$$\\frac{V_{small}}{V_{original}}=k^3=\\left(\\frac{${numerator}}{${denominator}}\\right)^3$$`,
      },
      {
        title: "Write the Simplified Ratio",
        body: "Cube the numerator and denominator separately.",
        equation: `$$V_{small}:V_{original}=${numerator ** 3n}:${denominator ** 3n}$$`,
      },
    ],
    shortcut: `For this question, cube the height fraction immediately: $(${numerator}/${denominator})^3=${numerator ** 3n}/${denominator ** 3n}$.`,
  };
}

function semicircleSectorDraft(
  prototypeId: MenCp008Wave04PrototypeId,
  seed: string,
  rng: SeededRandom,
  difficultyFlag: bigint,
): Draft {
  const slantHeight = rng.pick(SEMICIRCLE_STATES);
  const radius = slantHeight / 2n;
  const answer = surd(radius, 3n);
  return {
    state: makeState(
      prototypeId,
      seed,
      { sectorRadius: slantHeight, slantHeight, baseRadius: radius },
      { answer },
      "cm",
      "UNIT",
      difficultyFlag,
    ),
    stem: stemVariant(rng, [
      `A semicircular sheet of radius ${dimension(slantHeight)} is rolled so that its curved edge forms the circular rim of an open cone. Find the vertical height of the cone.`,
      `A paper semicircle has radius ${dimension(slantHeight)}. It is bent into the curved surface of a cone without overlap. What is the cone's height?`,
      `The curved edge of a semicircular sector of radius ${dimension(slantHeight)} becomes the base circumference of a cone. Determine the cone's vertical height.`,
      `An open conical cup is made from a semicircle whose radius is ${dimension(slantHeight)}. Find the depth of the cup in exact form.`,
    ]),
    answer,
    wrongAnswers: [
      {
        value: q(radius),
        misconceptionId: "REPORTED_BASE_RADIUS",
        explanation: "stopping after finding the base radius and reporting it as the vertical height",
      },
      {
        value: q(slantHeight),
        misconceptionId: "REPORTED_SLANT_HEIGHT",
        explanation: "using the sector radius, which becomes the slant height, as though it were the vertical height",
      },
      {
        value: surd(slantHeight, 3n),
        misconceptionId: "MISSED_HALF_RADIUS",
        explanation: "using the full slant height in the final coefficient after failing to halve the base circumference relation",
      },
    ],
    keyRule: "When a sector forms a cone, the sector radius becomes the slant height and the sector arc becomes the base circumference. A semicircle therefore gives $r=l/2$.",
    steps: [
      {
        title: "Match Arc Length to Circumference",
        body: "The semicircle's curved edge has length $\\pi l$, and this becomes $2\\pi r$.",
        equation: `$$\\pi(${slantHeight})=2\\pi r\\quad\\Rightarrow\\quad r=${radius}\\text{ cm}$$`,
      },
      {
        title: "Use the Cone Right Triangle",
        body: "The radius, vertical height and slant height form a right triangle.",
        equation: `$$h^2=l^2-r^2=${slantHeight}^2-${radius}^2$$`,
      },
      {
        title: "Simplify the Exact Height",
        body: "Take the positive square root because height is positive.",
        equation: `$$h=\\sqrt{${slantHeight ** 2n - radius ** 2n}}=${radius}\\sqrt{3}\\text{ cm}$$`,
      },
    ],
    shortcut: `A semicircle always gives $r=l/2$, so $h=(\\sqrt{3}/2)l=${radius}\\sqrt{3}\\text{ cm}$ here.`,
  };
}

function rectangleRollingDraft(
  prototypeId: MenCp008Wave04PrototypeId,
  seed: string,
  rng: SeededRandom,
  difficultyFlag: bigint,
): Draft {
  const { length, breadth } = rng.pick(RECTANGLE_STATES);
  const answer = q(length, breadth);
  return {
    state: makeState(
      prototypeId,
      seed,
      { length, breadth },
      { answer },
      "times",
      "RATIO",
      difficultyFlag,
    ),
    stem: stemVariant(rng, [
      `A rectangular sheet measures ${dimension(length)} by ${dimension(breadth)}. One cylinder is formed with the length as circumference, and another with the breadth as circumference. Find the ratio of their volumes in that order.`,
      `Two cylinders are made from a ${dimension(length)} by ${dimension(breadth)} sheet. In the first, ${dimension(length)} becomes the base circumference; in the second, ${dimension(breadth)} becomes the base circumference. Find $V_1:V_2$.`,
      `The same rectangular paper is rolled in its two possible orientations. Its sides are ${dimension(length)} and ${dimension(breadth)}. What is the ratio of the volume when the longer side forms the circumference to the volume when the shorter side forms it?`,
      `A ${length} cm by ${breadth} cm sheet is rolled first along its breadth and then along its length to make two cylinders. Compare the resulting cylinder volumes, taking the first volume to the second.`,
    ]),
    answer,
    wrongAnswers: [
      {
        value: q(breadth, length),
        misconceptionId: "REVERSED_ORIENTATION_ORDER",
        explanation: "calculating the two cylinders but placing their volumes in the reverse requested order",
      },
      {
        value: q(length ** 2n, breadth ** 2n),
        misconceptionId: "IGNORED_HEIGHT_SWAP",
        explanation: "squaring the circumference ratio while forgetting that the cylinder heights also exchange",
      },
      {
        value: q(1n),
        misconceptionId: "ASSUMED_EQUAL_SHEET_EQUAL_VOLUME",
        explanation: "assuming the same sheet area must produce equal volumes in both rolling orientations",
      },
    ],
    keyRule: "For a rectangle $L\\times B$, rolling with circumference $L$ gives volume proportional to $L^2B$, while rolling with circumference $B$ gives volume proportional to $B^2L$. Their ratio simplifies to $L:B$.",
    steps: [
      {
        title: "Write the First Cylinder Volume",
        body: "With circumference $L$, radius is $L/(2\\pi)$ and height is $B$.",
        equation: `$$V_1=\\pi\\left(\\frac{${length}}{2\\pi}\\right)^2(${breadth})$$`,
      },
      {
        title: "Write the Second Cylinder Volume",
        body: "The dimensions exchange roles in the second orientation.",
        equation: `$$V_2=\\pi\\left(\\frac{${breadth}}{2\\pi}\\right)^2(${length})$$`,
      },
      {
        title: "Cancel Common Factors",
        body: "Cancel $4\\pi$ and one factor from each side of the ratio.",
        equation: `$$V_1:V_2=${length}^2(${breadth}):${breadth}^2(${length})=${requireRational(answer).numerator}:${requireRational(answer).denominator}$$`,
      },
    ],
    shortcut: `When the same $L\\times B$ sheet is rolled both ways, the volume ratio is simply $L:B=${requireRational(answer).numerator}:${requireRational(answer).denominator}$.`,
  };
}

function minimumSurfaceDraft(
  prototypeId: MenCp008Wave04PrototypeId,
  seed: string,
  rng: SeededRandom,
  difficultyFlag: bigint,
): Draft {
  const radius = rng.pick(MINIMUM_SURFACE_STATES);
  const height = 2n * radius;
  const coefficient = radius ** 2n * height;
  const answer = q(height);
  return {
    state: makeState(
      prototypeId,
      seed,
      { radius, height, volumeCoefficient: coefficient },
      { answer },
      "cm",
      "UNIT",
      difficultyFlag,
    ),
    stem: stemVariant(rng, [
      `A closed right circular cylinder of volume ${volumeCoefficient(coefficient)} is designed to have the minimum possible total surface area. Find its height.`,
      `Among all closed cylinders with volume ${volumeCoefficient(coefficient)}, one uses the least material. What is the height of that cylinder?`,
      `A closed cylindrical container must hold ${volumeCoefficient(coefficient)}. If its total surface area is minimised, determine its height.`,
      `The volume of a closed cylinder is fixed at ${volumeCoefficient(coefficient)}. Find the height when the cylinder has minimum total surface area.`,
    ]),
    answer,
    wrongAnswers: [
      {
        value: q(radius),
        misconceptionId: "USED_HEIGHT_EQUAL_RADIUS",
        explanation: "using $h=r$ instead of the minimum-surface condition $h=2r$",
      },
      {
        value: q(3n * radius),
        misconceptionId: "USED_CONE_FACTOR_THREE",
        explanation: "bringing in the cone's factor of three even though the solid is a cylinder",
      },
      {
        value: q(4n * radius),
        misconceptionId: "DOUBLED_DIAMETER",
        explanation: "doubling the diameter after the optimum height has already been identified as one diameter",
      },
    ],
    keyRule: "For a closed cylinder with fixed volume, total surface area is minimum when the height equals the diameter, so $h=2r$.",
    steps: [
      {
        title: "Use the Minimum-Surface Condition",
        body: "A material-efficient closed cylinder has height equal to its diameter.",
        equation: "$$h=2r$$",
      },
      {
        title: "Substitute into the Volume",
        body: "Use $V=\\pi r^2h$ with the stated exact volume coefficient.",
        equation: `$$${coefficient}\\pi=\\pi r^2(2r)\\quad\\Rightarrow\\quad r^3=${coefficient / 2n}$$`,
      },
      {
        title: "Recover the Height",
        body: "Take the positive cube root and then double the radius.",
        equation: `$$r=${radius}\\text{ cm},\\qquad h=2(${radius})=${height}\\text{ cm}$$`,
      },
    ],
    shortcut: `At minimum TSA, height equals diameter. Here $r=\\sqrt[3]{${coefficient / 2n}}=${radius}$, so $h=${height}\\text{ cm}$.`,
  };
}

function generateDraft(prototypeId: MenCp008Wave04PrototypeId, seed: string): Draft {
  const rng = createSeededRandom(seed);
  const difficultyFlag = BigInt(rng.int(0, 1));
  switch (prototypeId) {
    case "MEN-CP008-W4-PROT-CONE-SIMILAR-HEIGHT-VOLUME-FRACTION":
      return similarConeDraft(prototypeId, seed, rng, difficultyFlag);
    case "MEN-CP008-W4-PROT-CONE-SEMICIRCLE-SECTOR-HEIGHT":
      return semicircleSectorDraft(prototypeId, seed, rng, difficultyFlag);
    case "MEN-CP008-W4-PROT-CYLINDER-RECTANGLE-ROLLING-VOLUME-RATIO":
      return rectangleRollingDraft(prototypeId, seed, rng, difficultyFlag);
    case "MEN-CP008-W4-PROT-CYLINDER-MINIMUM-TSA-HEIGHT":
      return minimumSurfaceDraft(prototypeId, seed, rng, difficultyFlag);
  }
}

function reconstructAnswer(state: MenCp008Wave04State): ExactValue {
  switch (state.prototypeId) {
    case "MEN-CP008-W4-PROT-CONE-SIMILAR-HEIGHT-VOLUME-FRACTION": {
      const numerator = state.dimensions.heightNumerator!;
      const denominator = state.dimensions.heightDenominator!;
      return q(numerator ** 3n, denominator ** 3n);
    }
    case "MEN-CP008-W4-PROT-CONE-SEMICIRCLE-SECTOR-HEIGHT": {
      const slantHeight = state.dimensions.slantHeight!;
      return surd(slantHeight / 2n, 3n);
    }
    case "MEN-CP008-W4-PROT-CYLINDER-RECTANGLE-ROLLING-VOLUME-RATIO":
      return q(state.dimensions.length!, state.dimensions.breadth!);
    case "MEN-CP008-W4-PROT-CYLINDER-MINIMUM-TSA-HEIGHT": {
      const radius = integerCubeRoot(state.dimensions.volumeCoefficient! / 2n);
      return q(2n * radius);
    }
  }
}

function displayValue(value: ExactValue, state: MenCp008Wave04State) {
  return state.displayMode === "RATIO" ? formatRatio(value) : formatWithUnit(value, state.unit);
}

function buildOptions(draft: Draft, rng: SeededRandom): MenCp008Wave04Option[] {
  const entries = [
    { value: draft.answer, misconceptionId: null, explanation: null },
    ...draft.wrongAnswers,
  ];
  if (new Set(entries.map((entry) => exactKey(entry.value))).size !== 4) {
    throw new Error(`${draft.state.prototypeId} produced colliding exact options.`);
  }
  return rng.shuffle(entries).map((entry, index) => ({
    label: (["A", "B", "C", "D"] as const)[index]!,
    value: entry.value,
    display: displayValue(entry.value, draft.state),
    isCorrect: entry.misconceptionId === null,
    misconceptionId: entry.misconceptionId,
  }));
}

function verifyDraft(draft: Draft) {
  const reconstructed = reconstructAnswer(draft.state);
  return {
    valid: exactEquals(draft.answer, reconstructed),
    method: "Independent reconstruction from the canonical source state and defining geometry relation.",
    reconstructed: exactKey(reconstructed),
  };
}

function validatePackage(question: Omit<MenCp008Wave04Package, "validation">) {
  const checks = [
    {
      name: "source definition",
      passed: getMenCp008Wave04Definition(question.prototypeId).solveMode === question.solveMode,
      message: "Prototype and solve mode must match the Wave-04 registry.",
    },
    {
      name: "independent verifier",
      passed: question.verification.valid,
      message: "The independent reconstruction must equal the exact answer.",
    },
    {
      name: "four unique positive options",
      passed:
        question.options.length === 4 &&
        new Set(question.options.map((option) => exactKey(option.value))).size === 4 &&
        question.options.every((option) => isPositive(option.value)),
      message: "Exactly four distinct positive exact options are required.",
    },
    {
      name: "single correct option",
      passed:
        question.options.filter((option) => option.isCorrect).length === 1 &&
        question.options[question.correctIndex]?.isCorrect === true,
      message: "Exactly one option must be correct at the declared index.",
    },
    {
      name: "answer display agreement",
      passed: question.answer === question.options[question.correctIndex]?.display,
      message: "The answer display must equal the correct option display.",
    },
    {
      name: "worked editorial structure",
      passed:
        question.explanation.steps.length === 3 &&
        question.explanation.steps.every((step) => Boolean(step.equation)) &&
        question.explanation.traps.length === 3,
      message: "Three worked equations and three option-linked diagnostics are required.",
    },
    {
      name: "lifecycle lock",
      passed:
        question.permanentQlId === null &&
        question.reviewStatus === "UNREVIEWED" &&
        question.questionBankStatus === "NOT_STORED" &&
        question.testEligibility === "INELIGIBLE" &&
        !question.publiclyPublishable &&
        !question.questionStudioDiscoverable,
      message: "Source-gap prototypes must remain unallocated and invisible.",
    },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function classifyMenCp008Wave04Difficulty(state: MenCp008Wave04State) {
  return state.dimensions.difficultyFlag === 0n ? "Medium" : "Hard";
}

export function generateMenCp008Wave04Prototype(
  prototypeId: MenCp008Wave04PrototypeId,
  seed: string,
): MenCp008Wave04Package {
  if (!seed.trim()) throw new Error("MEN-CP-008 Wave 04 requires a non-empty deterministic seed.");
  const draft = generateDraft(prototypeId, seed);
  const optionRng = createSeededRandom(`${seed}:options`);
  const options = buildOptions(draft, optionRng);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const traps = options
    .filter((option) => !option.isCorrect)
    .map((option) => {
      const wrong = draft.wrongAnswers.find((candidate) => candidate.misconceptionId === option.misconceptionId)!;
      return `Option ${option.label} (${option.display}): This result comes from ${wrong.explanation}.`;
    });
  const verification = verifyDraft(draft);
  const partial = {
    packageId: "MEN-002" as const,
    canonicalProblemId: "MEN-CP-008" as const,
    permanentQlId: null,
    waveId: "MEN-CP-008-SOURCE-GAP-WAVE-04" as const,
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
