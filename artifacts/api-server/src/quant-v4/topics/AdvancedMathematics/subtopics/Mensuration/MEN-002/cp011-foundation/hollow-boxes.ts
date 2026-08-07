import {
  exactEquals,
  exactKey,
  formatExactPlain,
  formatWithUnit,
  rational,
} from "../foundation/exact";
import type { ExactValue, Men002Difficulty, Men002Unit } from "../foundation/types";

export const MEN_CP011_HOLLOW_BOXES_AUTHORITY =
  "MEN-CP011-HOLLOW-BOXES-WAVE-01-V1" as const;

export type MenCp011HollowBoxPrototypeId =
  | "MEN-CP011-PROT-HOLLOW-CUBE-MATERIAL-VOLUME"
  | "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME";

export type MenCp011HollowBoxSolveMode =
  | "findHollowCubeMaterialVolume"
  | "findHollowCuboidMaterialVolume";

export type MenCp011HollowBoxLinearUnit = "cm" | "m";
export type MenCp011HollowBoxVolumeUnit = "cm³" | "m³";
type Label = "A" | "B" | "C" | "D";
type DiagramRole = "PROMPT" | "SOLUTION";

export interface MenCp011HollowBoxDefinition {
  prototypeId: MenCp011HollowBoxPrototypeId;
  solveMode: MenCp011HollowBoxSolveMode;
  difficulty: Men002Difficulty;
  shape: "CUBE" | "CUBOID";
}

export const MEN_CP011_HOLLOW_BOX_PROTOTYPES: readonly MenCp011HollowBoxDefinition[] = [
  {
    prototypeId: "MEN-CP011-PROT-HOLLOW-CUBE-MATERIAL-VOLUME",
    solveMode: "findHollowCubeMaterialVolume",
    difficulty: "Medium",
    shape: "CUBE",
  },
  {
    prototypeId: "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME",
    solveMode: "findHollowCuboidMaterialVolume",
    difficulty: "Hard",
    shape: "CUBOID",
  },
] as const;

const DEFINITION_BY_ID = new Map(
  MEN_CP011_HOLLOW_BOX_PROTOTYPES.map((definition) => [
    definition.prototypeId,
    definition,
  ]),
);

export function getMenCp011HollowBoxPrototypeIds() {
  return MEN_CP011_HOLLOW_BOX_PROTOTYPES.map((definition) => definition.prototypeId);
}

export function getMenCp011HollowBoxDefinition(
  prototypeId: MenCp011HollowBoxPrototypeId,
) {
  const definition = DEFINITION_BY_ID.get(prototypeId);
  if (!definition) {
    throw new Error(`Unknown MEN-CP-011 hollow-box prototype ${prototypeId}.`);
  }
  return definition;
}

interface HollowBoxFixture {
  id: string;
  outerLength: bigint;
  outerBreadth: bigint;
  outerHeight: bigint;
  thickness: bigint;
}

const CUBE_FIXTURES: readonly HollowBoxFixture[] = [
  { id: "HC-01", outerLength: 8n, outerBreadth: 8n, outerHeight: 8n, thickness: 1n },
  { id: "HC-02", outerLength: 10n, outerBreadth: 10n, outerHeight: 10n, thickness: 1n },
  { id: "HC-03", outerLength: 12n, outerBreadth: 12n, outerHeight: 12n, thickness: 2n },
  { id: "HC-04", outerLength: 14n, outerBreadth: 14n, outerHeight: 14n, thickness: 2n },
  { id: "HC-05", outerLength: 15n, outerBreadth: 15n, outerHeight: 15n, thickness: 2n },
  { id: "HC-06", outerLength: 16n, outerBreadth: 16n, outerHeight: 16n, thickness: 3n },
  { id: "HC-07", outerLength: 18n, outerBreadth: 18n, outerHeight: 18n, thickness: 3n },
  { id: "HC-08", outerLength: 20n, outerBreadth: 20n, outerHeight: 20n, thickness: 4n },
] as const;

const CUBOID_FIXTURES: readonly HollowBoxFixture[] = [
  { id: "HB-01", outerLength: 13n, outerBreadth: 10n, outerHeight: 8n, thickness: 1n },
  { id: "HB-02", outerLength: 15n, outerBreadth: 12n, outerHeight: 9n, thickness: 1n },
  { id: "HB-03", outerLength: 18n, outerBreadth: 14n, outerHeight: 10n, thickness: 2n },
  { id: "HB-04", outerLength: 20n, outerBreadth: 16n, outerHeight: 12n, thickness: 2n },
  { id: "HB-05", outerLength: 24n, outerBreadth: 18n, outerHeight: 14n, thickness: 2n },
  { id: "HB-06", outerLength: 22n, outerBreadth: 17n, outerHeight: 13n, thickness: 3n },
  { id: "HB-07", outerLength: 26n, outerBreadth: 20n, outerHeight: 16n, thickness: 3n },
  { id: "HB-08", outerLength: 30n, outerBreadth: 24n, outerHeight: 18n, thickness: 4n },
] as const;

export interface MenCp011HollowBoxState {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-HOLLOW-BOXES-WAVE-01";
  prototypeId: MenCp011HollowBoxPrototypeId;
  solveMode: MenCp011HollowBoxSolveMode;
  target: "VOLUME";
  shape: "CUBE" | "CUBOID";
  seed: string;
  stateSelectionAttempt: number;
  difficulty: Men002Difficulty;
  unit: MenCp011HollowBoxLinearUnit;
  volumeUnit: MenCp011HollowBoxVolumeUnit;
  fixtureId: string;
  outerLength: bigint;
  outerBreadth: bigint;
  outerHeight: bigint;
  thickness: bigint;
  innerLength: bigint;
  innerBreadth: bigint;
  innerHeight: bigint;
  outerVolume: bigint;
  innerVolume: bigint;
  materialVolume: bigint;
  sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING";
}

export interface MenCp011HollowBoxOption {
  label: Label;
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp011HollowBoxDiagram {
  kind: "HOLLOW_BOX";
  svg: string;
  accessibleText: string;
  visibleLabels: readonly string[];
  notToScale: true;
}

export interface MenCp011HollowBoxLearnerSolution {
  formula: string;
  steps: string[];
  finalAnswer: string;
  shortcut: string;
  wrongOptionAnalysis: string[];
}

export interface MenCp011HollowBoxPackage {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-HOLLOW-BOXES-WAVE-01";
  prototypeId: MenCp011HollowBoxPrototypeId;
  solveMode: MenCp011HollowBoxSolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: "VOLUME";
  unit: MenCp011HollowBoxVolumeUnit;
  hollowBoxAuthority: typeof MEN_CP011_HOLLOW_BOXES_AUTHORITY;
  sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING";
  stem: string;
  options: MenCp011HollowBoxOption[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  optionPermutationSeed: string;
  state: MenCp011HollowBoxState;
  diagram: MenCp011HollowBoxDiagram;
  solutionDiagram: MenCp011HollowBoxDiagram;
  learnerSolution: MenCp011HollowBoxLearnerSolution;
  explanation: {
    keyRule: string;
    steps: Array<{ title: string; body: string; equation?: string }>;
    shortcut: string;
    traps: string[];
  };
  verification: {
    valid: boolean;
    method: string;
    reconstructed: string;
  };
  validation: {
    valid: boolean;
    checks: Array<{ name: string; passed: boolean; message: string }>;
  };
  renderSurfaces: {
    attempt: {
      diagram: null;
      diagramPolicy: "HIDDEN_FOR_TEXT_COMPLETE_ITEM";
      exposesInternalCodes: false;
    };
    practice: {
      diagram: MenCp011HollowBoxDiagram;
      diagramPolicy: "OPTIONAL_PROMPT_SAFE_HOLLOW_BOX_DIAGRAM";
      exposesInternalCodes: false;
    };
    solution: {
      diagram: MenCp011HollowBoxDiagram;
      explanation: MenCp011HollowBoxLearnerSolution;
      exposesInternalCodes: false;
    };
    admin: {
      diagram: MenCp011HollowBoxDiagram;
      trapCodes: string[];
      verification: MenCp011HollowBoxPackage["verification"];
      exposesInternalCodes: true;
    };
    responsiveDiagramPolicy: {
      width: "100%";
      minWidthPx: 0;
      height: "auto";
      compactLegendOnMobile: true;
    };
  };
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

export interface MenCp011HollowBoxGenerationConstraints {
  unit?: MenCp011HollowBoxLinearUnit;
  fixtureIndex?: number;
  correctIndex?: 0 | 1 | 2 | 3;
}

interface Candidate {
  value: ExactValue;
  misconceptionId: string | null;
  explanation: string;
}

const LABELS: readonly Label[] = ["A", "B", "C", "D"];

function hashText(text: string) {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

function choose<T>(items: readonly T[], key: string) {
  return items[hashText(key) % items.length]!;
}

function volumeUnitFor(unit: MenCp011HollowBoxLinearUnit): MenCp011HollowBoxVolumeUnit {
  return unit === "cm" ? "cm³" : "m³";
}

function dimension(value: bigint, unit: MenCp011HollowBoxLinearUnit) {
  return `$${value}\\text{ ${unit}}$`;
}

function fixtureCatalog(prototypeId: MenCp011HollowBoxPrototypeId) {
  return prototypeId === "MEN-CP011-PROT-HOLLOW-CUBE-MATERIAL-VOLUME"
    ? CUBE_FIXTURES
    : CUBOID_FIXTURES;
}

function createState(
  prototypeId: MenCp011HollowBoxPrototypeId,
  seed: string,
  constraints: MenCp011HollowBoxGenerationConstraints,
  attempt: number,
): MenCp011HollowBoxState {
  const definition = getMenCp011HollowBoxDefinition(prototypeId);
  const catalog = fixtureCatalog(prototypeId);
  const fixtureIndex = constraints.fixtureIndex === undefined
    ? hashText(`${MEN_CP011_HOLLOW_BOXES_AUTHORITY}|fixture|${prototypeId}|${seed}|${attempt}`) % catalog.length
    : ((constraints.fixtureIndex % catalog.length) + catalog.length) % catalog.length;
  const fixture = catalog[fixtureIndex]!;
  const unit = constraints.unit ??
    (hashText(`${MEN_CP011_HOLLOW_BOXES_AUTHORITY}|unit|${prototypeId}|${seed}|${attempt}`) % 2 === 0
      ? "cm"
      : "m");
  const twiceThickness = 2n * fixture.thickness;
  const innerLength = fixture.outerLength - twiceThickness;
  const innerBreadth = fixture.outerBreadth - twiceThickness;
  const innerHeight = fixture.outerHeight - twiceThickness;
  const outerVolume =
    fixture.outerLength * fixture.outerBreadth * fixture.outerHeight;
  const innerVolume = innerLength * innerBreadth * innerHeight;
  const materialVolume = outerVolume - innerVolume;

  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-011",
    permanentQlId: null,
    waveId: "MEN-CP-011-HOLLOW-BOXES-WAVE-01",
    prototypeId,
    solveMode: definition.solveMode,
    target: "VOLUME",
    shape: definition.shape,
    seed,
    stateSelectionAttempt: attempt,
    difficulty: definition.difficulty,
    unit,
    volumeUnit: volumeUnitFor(unit),
    fixtureId: fixture.id,
    outerLength: fixture.outerLength,
    outerBreadth: fixture.outerBreadth,
    outerHeight: fixture.outerHeight,
    thickness: fixture.thickness,
    innerLength,
    innerBreadth,
    innerHeight,
    outerVolume,
    innerVolume,
    materialVolume,
    sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING",
  };
}

function createStem(state: MenCp011HollowBoxState) {
  const unit = state.unit;
  const t = dimension(state.thickness, unit);
  if (state.shape === "CUBE") {
    const a = dimension(state.outerLength, unit);
    const variants = [
      `A hollow metal cube has outer side ${a} and uniform wall thickness ${t}. Find the volume of metal used.`,
      `The outside edge of a hollow cube is ${a}. Its walls are ${t} thick throughout. Calculate the material volume.`,
      `A cubical shell has external side ${a} and uniform thickness ${t}. What volume of material forms the shell?`,
      `A closed hollow cube measures ${a} along each outside edge. If the wall thickness is ${t}, determine the volume of metal in it.`,
      `The outer side of a hollow cubical block is ${a}, and each wall is ${t} thick. Find the volume occupied by the material.`,
      `A hollow cube is made with an outside edge of ${a} and uniform thickness ${t}. Calculate the difference between its outer and inner volumes.`,
      `A cubical casing has external side ${a}. The material is ${t} thick on every face. Find the casing's material volume.`,
      `A hollow cubical container has outer edge ${a} and wall thickness ${t}. Determine the volume of its solid walls.`,
    ] as const;
    return choose(
      variants,
      `hollow-box:stem:${state.prototypeId}:${state.seed}:${state.fixtureId}`,
    );
  }

  const L = dimension(state.outerLength, unit);
  const B = dimension(state.outerBreadth, unit);
  const H = dimension(state.outerHeight, unit);
  const variants = [
    `A closed hollow cuboid has outer dimensions ${L} by ${B} by ${H} and uniform wall thickness ${t}. Find the volume of material used.`,
    `The external length, breadth and height of a hollow rectangular block are ${L}, ${B} and ${H}. If every wall is ${t} thick, calculate its material volume.`,
    `A hollow cuboidal casing measures ${L} × ${B} × ${H} externally. Its uniform thickness is ${t}. Determine the volume occupied by the casing material.`,
    `A rectangular shell has outside dimensions ${L}, ${B} and ${H}, with thickness ${t} on all six faces. Find the volume of the shell material.`,
    `A closed hollow box has external dimensions ${L} by ${B} by ${H}. The walls are ${t} thick. What volume of material forms the box?`,
    `The outside measurements of a hollow cuboid are ${L}, ${B} and ${H}. Given a uniform wall thickness of ${t}, find outer volume minus inner void volume.`,
    `A hollow rectangular solid is ${L} long, ${B} broad and ${H} high externally. If its walls are ${t} thick, calculate the material volume.`,
    `A cuboidal metal casing has outer dimensions ${L} × ${B} × ${H} and uniform thickness ${t}. Determine the volume of metal used.`,
  ] as const;
  return choose(
    variants,
    `hollow-box:stem:${state.prototypeId}:${state.seed}:${state.fixtureId}`,
  );
}

function candidatesFor(state: MenCp011HollowBoxState): Candidate[] {
  const wrongInnerLength = state.outerLength - state.thickness;
  const wrongInnerBreadth = state.outerBreadth - state.thickness;
  const wrongInnerHeight = state.outerHeight - state.thickness;
  const singleThicknessMaterial =
    state.outerVolume -
    wrongInnerLength * wrongInnerBreadth * wrongInnerHeight;

  return [
    {
      value: rational(state.materialVolume),
      misconceptionId: null,
      explanation: "",
    },
    {
      value: rational(state.outerVolume),
      misconceptionId: "USED_OUTER_SOLID_VOLUME_ONLY",
      explanation: "using the complete outer solid volume without removing the hollow interior",
    },
    {
      value: rational(state.innerVolume),
      misconceptionId: "CALCULATED_INNER_VOID_ONLY",
      explanation: "calculating only the empty inner space instead of the surrounding material",
    },
    {
      value: rational(singleThicknessMaterial),
      misconceptionId: "USED_SINGLE_THICKNESS_IN_TWO_SIDED_DIMENSION",
      explanation: "subtracting the wall thickness once from each dimension instead of once from both opposite sides",
    },
  ];
}

function arrangeCandidates(
  candidates: readonly Candidate[],
  seed: string,
  forcedCorrectIndex?: 0 | 1 | 2 | 3,
) {
  const correct = candidates.find((candidate) => candidate.misconceptionId === null)!;
  const wrong = candidates.filter((candidate) => candidate.misconceptionId !== null);
  const correctIndex = forcedCorrectIndex ??
    (hashText(`hollow-box:correct-index:${seed}`) % 4 as 0 | 1 | 2 | 3);
  const wrongOffset = hashText(`hollow-box:wrong-order:${seed}`) % wrong.length;
  const orderedWrong = wrong.map(
    (_, index) => wrong[(index + wrongOffset) % wrong.length]!,
  );
  const arranged: Candidate[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    arranged.push(index === correctIndex ? correct : orderedWrong[wrongIndex++]!);
  }
  return { arranged, correctIndex };
}

function buildDiagram(
  state: MenCp011HollowBoxState,
  role: DiagramRole,
): MenCp011HollowBoxDiagram {
  const isCube = state.shape === "CUBE";
  const innerLabel = role === "PROMPT"
    ? isCube
      ? "inner side = a - 2t"
      : "inner dimensions = outer dimensions - 2t"
    : isCube
      ? `inner side = ${state.innerLength} ${state.unit}`
      : `inner = ${state.innerLength} × ${state.innerBreadth} × ${state.innerHeight} ${state.unit}`;
  const outerLabel = isCube
    ? `outer side = ${state.outerLength} ${state.unit}`
    : `outer = ${state.outerLength} × ${state.outerBreadth} × ${state.outerHeight} ${state.unit}`;
  const shapeLabel = isCube ? "hollow cube" : "hollow cuboid";
  const svg = `<svg viewBox="0 0 520 300" role="img" aria-label="${shapeLabel}; ${outerLabel}; thickness ${state.thickness} ${state.unit}; ${innerLabel}; not to scale" data-diagram-version="HOLLOW_BOX_EXAMTREE_V1" data-diagram-role="${role}" data-shape="${state.shape}" data-topology="HOLLOW" data-responsive="true" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="518" height="298" rx="10" fill="white" stroke="black"/>
  <g fill="none" stroke="black" stroke-width="2">
    <path data-region="outer-front" d="M120 90 L330 90 L330 235 L120 235 Z"/>
    <path data-region="outer-depth" d="M120 90 L185 50 L395 50 L330 90 M330 235 L395 195 L395 50"/>
    <path data-region="inner-void" data-boundary="dashed" stroke-dasharray="7 5" d="M165 120 L300 120 L300 210 L165 210 Z"/>
    <path data-region="inner-depth" data-boundary="dashed" stroke-dasharray="7 5" d="M165 120 L205 95 L340 95 L300 120 M300 210 L340 185 L340 95"/>
    <path data-dimension="wall-thickness" data-alignment="two-sided" d="M122 255 L165 255"/>
    <path d="M122 249 L122 261 M165 249 L165 261"/>
  </g>
  <g font-family="Arial, sans-serif" font-size="15" fill="black">
    <text x="28" y="30">ExamTree ${shapeLabel}</text>
    <text x="28" y="55">${outerLabel}</text>
    <text x="28" y="78">uniform thickness t = ${state.thickness} ${state.unit}</text>
    <text data-role="inner-dimension-label" x="28" y="276">${innerLabel}</text>
    <text x="128" y="248">t</text>
    <text x="400" y="285">not to scale</text>
  </g>
</svg>`;
  return {
    kind: "HOLLOW_BOX",
    svg,
    accessibleText: `${shapeLabel} with ${outerLabel}, uniform wall thickness ${state.thickness} ${state.unit}, and ${innerLabel}. The dashed inner solid is empty.`,
    visibleLabels: [outerLabel, `t = ${state.thickness} ${state.unit}`, innerLabel],
    notToScale: true,
  };
}

function buildExplanation(
  state: MenCp011HollowBoxState,
  options: MenCp011HollowBoxOption[],
): {
  learnerSolution: MenCp011HollowBoxLearnerSolution;
  explanation: MenCp011HollowBoxPackage["explanation"];
} {
  const unit = state.unit;
  const volumeUnit = state.volumeUnit;
  const isCube = state.shape === "CUBE";
  const innerDimensionEquation = isCube
    ? `b=${state.outerLength}-2(${state.thickness})=${state.innerLength}\\text{ ${unit}}`
    : `l=${state.outerLength}-2(${state.thickness})=${state.innerLength},\\ b=${state.outerBreadth}-2(${state.thickness})=${state.innerBreadth},\\ h=${state.outerHeight}-2(${state.thickness})=${state.innerHeight}\\text{ ${unit}}`;
  const outerEquation = isCube
    ? `V_{outer}=${state.outerLength}^{3}=${state.outerVolume}\\text{ ${volumeUnit}}`
    : `V_{outer}=${state.outerLength}\\times${state.outerBreadth}\\times${state.outerHeight}=${state.outerVolume}\\text{ ${volumeUnit}}`;
  const innerEquation = isCube
    ? `V_{inner}=${state.innerLength}^{3}=${state.innerVolume}\\text{ ${volumeUnit}}`
    : `V_{inner}=${state.innerLength}\\times${state.innerBreadth}\\times${state.innerHeight}=${state.innerVolume}\\text{ ${volumeUnit}}`;
  const materialEquation =
    `V_{material}=${state.outerVolume}-${state.innerVolume}=${state.materialVolume}\\text{ ${volumeUnit}}`;
  const finalAnswer = formatWithUnit(rational(state.materialVolume), volumeUnit);
  const shortcut = isCube
    ? `For a hollow cube, use the difference of cubes after finding the inner side: $a^3-b^3=(a-b)(a^2+ab+b^2)$. Here $a-b=${2n * state.thickness}\\text{ ${unit}}$, so the calculation is faster without expanding both cubes separately.`
    : `Write the inner dimensions immediately as $(L-2t),(B-2t),(H-2t)$, then subtract the two products. The factor $2t$ is essential because each dimension loses thickness from two opposite sides.`;
  const wrongOptionAnalysis = options
    .filter((option) => !option.isCorrect)
    .map((option) => `${option.display} comes from ${candidatesFor(state).find((candidate) => candidate.misconceptionId === option.misconceptionId)?.explanation}.`);

  const formula = isCube
    ? "$V_{material}=a^3-(a-2t)^3$"
    : "$V_{material}=LBH-(L-2t)(B-2t)(H-2t)$";
  const keyRule = `Picture the ${isCube ? "cube" : "cuboid"} as a complete outer solid with a smaller empty ${isCube ? "cube" : "cuboid"} removed from its centre. Uniform thickness acts on both opposite sides of every linear dimension, so each inner dimension is the matching outer dimension minus $2t$.`;

  const steps = [
    {
      title: "Find the inner dimensions",
      body: `Subtract twice the wall thickness from every affected outside dimension. The result remains a length in ${unit}.`,
      equation: `$${innerDimensionEquation}$`,
    },
    {
      title: "Calculate outer and inner volumes",
      body: `Use the appropriate solid-volume formula. Both results are measured in ${volumeUnit}.`,
      equation: `$${outerEquation};\\quad ${innerEquation}$`,
    },
    {
      title: "Subtract the empty space",
      body: `Material volume equals outer volume minus inner void volume, so the required answer is ${finalAnswer}.`,
      equation: `$${materialEquation}$`,
    },
  ];

  return {
    learnerSolution: {
      formula,
      steps: steps.map((step) => `${step.title}: ${step.body} ${step.equation ?? ""}`),
      finalAnswer,
      shortcut,
      wrongOptionAnalysis,
    },
    explanation: {
      keyRule,
      steps,
      shortcut,
      traps: wrongOptionAnalysis,
    },
  };
}

function verify(state: MenCp011HollowBoxState, exactAnswer: ExactValue) {
  const twiceThickness = 2n * state.thickness;
  const innerLength = state.outerLength - twiceThickness;
  const innerBreadth = state.outerBreadth - twiceThickness;
  const innerHeight = state.outerHeight - twiceThickness;
  const outer =
    state.outerLength * state.outerBreadth * state.outerHeight;
  const inner = innerLength * innerBreadth * innerHeight;
  const reconstructed = outer - inner;
  return {
    valid: exactEquals(exactAnswer, rational(reconstructed)),
    method: "Independent outer-solid minus inner-void reconstruction",
    reconstructed: `${outer}-${inner}=${reconstructed} ${state.volumeUnit}`,
  };
}

function learnerText(question: Pick<
  MenCp011HollowBoxPackage,
  "stem" | "answer" | "learnerSolution"
>) {
  return [
    question.stem,
    question.answer,
    question.learnerSolution.formula,
    ...question.learnerSolution.steps,
    question.learnerSolution.finalAnswer,
    question.learnerSolution.shortcut,
    ...question.learnerSolution.wrongOptionAnalysis,
  ].join("\n");
}

function validate(question: Omit<MenCp011HollowBoxPackage, "validation">) {
  const checks: Array<{ name: string; passed: boolean; message: string }> = [];
  const add = (name: string, passed: boolean, message: string) =>
    checks.push({ name, passed, message });

  add(
    "positive-inner-dimensions",
    question.state.innerLength > 0n &&
      question.state.innerBreadth > 0n &&
      question.state.innerHeight > 0n,
    "Every inner dimension must remain positive.",
  );
  add(
    "uniform-thickness-two-sided",
    question.state.innerLength === question.state.outerLength - 2n * question.state.thickness &&
      question.state.innerBreadth === question.state.outerBreadth - 2n * question.state.thickness &&
      question.state.innerHeight === question.state.outerHeight - 2n * question.state.thickness,
    "Inner dimensions must subtract thickness from both opposite sides.",
  );
  add(
    "positive-material-volume",
    question.state.materialVolume > 0n,
    "Material volume must be positive.",
  );
  add(
    "four-unique-options",
    question.options.length === 4 &&
      new Set(question.options.map((option) => exactKey(option.value))).size === 4,
    "Exactly four structurally unique options are required.",
  );
  add(
    "single-correct-option",
    question.options.filter((option) => option.isCorrect).length === 1 &&
      question.options[question.correctIndex]?.isCorrect === true,
    "Exactly one option must be correct and match correctIndex.",
  );
  add(
    "independent-verification",
    question.verification.valid,
    "The independent reconstruction must match the canonical answer.",
  );
  add(
    "prompt-solution-diagram-role",
    question.diagram.svg.includes('data-diagram-role="PROMPT"') &&
      question.solutionDiagram.svg.includes('data-diagram-role="SOLUTION"'),
    "Prompt and solution diagrams must be separately identified.",
  );
  add(
    "diagram-state-synchronisation",
    question.diagram.svg.includes(`t = ${question.state.thickness} ${question.state.unit}`) &&
      question.solutionDiagram.svg.includes(
        question.state.shape === "CUBE"
          ? `inner side = ${question.state.innerLength} ${question.state.unit}`
          : `inner = ${question.state.innerLength} × ${question.state.innerBreadth} × ${question.state.innerHeight} ${question.state.unit}`,
      ),
    "Diagram labels must match the generated state.",
  );
  add(
    "responsive-diagram",
    !/<svg[^>]+\bwidth="\d+/.test(question.diagram.svg) &&
      question.renderSurfaces.responsiveDiagramPolicy.minWidthPx === 0,
    "The SVG must remain viewBox-driven and mobile-safe.",
  );
  add(
    "learner-admin-separation",
    !/\[(?:USED_|CALCULATED_|MEN-CP011-PROT-)/.test(learnerText(question)) &&
      question.renderSurfaces.attempt.diagram === null &&
      question.renderSurfaces.admin.exposesInternalCodes,
    "Internal prototype and misconception codes must remain admin-only.",
  );
  add(
    "lifecycle-locks",
    question.permanentQlId === null &&
      question.questionBankStatus === "NOT_STORED" &&
      question.testEligibility === "INELIGIBLE" &&
      !question.publiclyPublishable &&
      !question.questionStudioDiscoverable,
    "All discovery lifecycle locks must remain active.",
  );

  return {
    valid: checks.every((check) => check.passed),
    checks,
  };
}

export function generateMenCp011HollowBoxQuestion(
  prototypeId: MenCp011HollowBoxPrototypeId,
  seed: string,
  constraints: MenCp011HollowBoxGenerationConstraints = {},
): MenCp011HollowBoxPackage {
  for (let attempt = 0; attempt < 48; attempt += 1) {
    const state = createState(prototypeId, seed, constraints, attempt);
    const candidates = candidatesFor(state);
    if (new Set(candidates.map((candidate) => exactKey(candidate.value))).size !== 4) {
      continue;
    }
    const permutationSeed =
      `${MEN_CP011_HOLLOW_BOXES_AUTHORITY}|options|${prototypeId}|${seed}|${attempt}`;
    const { arranged, correctIndex } = arrangeCandidates(
      candidates,
      permutationSeed,
      constraints.correctIndex,
    );
    const options: MenCp011HollowBoxOption[] = arranged.map((candidate, index) => ({
      label: LABELS[index]!,
      value: candidate.value,
      display: formatWithUnit(candidate.value, state.volumeUnit as Men002Unit),
      isCorrect: candidate.misconceptionId === null,
      misconceptionId: candidate.misconceptionId,
    }));
    const exactAnswer = rational(state.materialVolume);
    const verification = verify(state, exactAnswer);
    const diagram = buildDiagram(state, "PROMPT");
    const solutionDiagram = buildDiagram(state, "SOLUTION");
    const explanationParts = buildExplanation(state, options);
    const withoutValidation: Omit<MenCp011HollowBoxPackage, "validation"> = {
      packageId: "MEN-002",
      canonicalProblemId: "MEN-CP-011",
      permanentQlId: null,
      waveId: "MEN-CP-011-HOLLOW-BOXES-WAVE-01",
      prototypeId,
      solveMode: state.solveMode,
      language: "en",
      seed,
      difficulty: state.difficulty,
      target: "VOLUME",
      unit: state.volumeUnit,
      hollowBoxAuthority: MEN_CP011_HOLLOW_BOXES_AUTHORITY,
      sourceMaturity: state.sourceMaturity,
      stem: createStem(state),
      options,
      correctIndex,
      answer: formatWithUnit(exactAnswer, state.volumeUnit),
      exactAnswer,
      optionPermutationSeed: permutationSeed,
      state,
      diagram,
      solutionDiagram,
      learnerSolution: explanationParts.learnerSolution,
      explanation: explanationParts.explanation,
      verification,
      renderSurfaces: {
        attempt: {
          diagram: null,
          diagramPolicy: "HIDDEN_FOR_TEXT_COMPLETE_ITEM",
          exposesInternalCodes: false,
        },
        practice: {
          diagram,
          diagramPolicy: "OPTIONAL_PROMPT_SAFE_HOLLOW_BOX_DIAGRAM",
          exposesInternalCodes: false,
        },
        solution: {
          diagram: solutionDiagram,
          explanation: explanationParts.learnerSolution,
          exposesInternalCodes: false,
        },
        admin: {
          diagram: solutionDiagram,
          trapCodes: options
            .map((option) => option.misconceptionId)
            .filter((code): code is string => code !== null),
          verification,
          exposesInternalCodes: true,
        },
        responsiveDiagramPolicy: {
          width: "100%",
          minWidthPx: 0,
          height: "auto",
          compactLegendOnMobile: true,
        },
      },
      reviewStatus: "UNREVIEWED",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    };
    const validation = validate(withoutValidation);
    const question = { ...withoutValidation, validation };
    if (validation.valid) return question;
  }
  throw new Error(
    `Unable to generate a valid MEN-CP-011 hollow-box package for ${prototypeId} and seed ${seed}.`,
  );
}

export interface MenCp011HollowBoxReviewBatch {
  authority: typeof MEN_CP011_HOLLOW_BOXES_AUTHORITY;
  records: MenCp011HollowBoxPackage[];
}

export function generateMenCp011HollowBoxReviewBatch(): MenCp011HollowBoxReviewBatch {
  const records: MenCp011HollowBoxPackage[] = [];
  const units: readonly MenCp011HollowBoxLinearUnit[] = ["cm", "m"];
  for (const prototypeId of getMenCp011HollowBoxPrototypeIds()) {
    for (let unitIndex = 0; unitIndex < units.length; unitIndex += 1) {
      for (let fixtureIndex = 0; fixtureIndex < 8; fixtureIndex += 1) {
        records.push(
          generateMenCp011HollowBoxQuestion(
            prototypeId,
            `hollow-box-review:${prototypeId}:${units[unitIndex]}:${fixtureIndex}`,
            {
              unit: units[unitIndex],
              fixtureIndex,
              correctIndex: ((fixtureIndex + unitIndex * 2) % 4) as 0 | 1 | 2 | 3,
            },
          ),
        );
      }
    }
  }
  return { authority: MEN_CP011_HOLLOW_BOXES_AUTHORITY, records };
}

function normalizeStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\d+/g, "<n>")
    .replace(/\s+/g, " ")
    .trim();
}

export interface MenCp011HollowBoxAudit {
  authority: typeof MEN_CP011_HOLLOW_BOXES_AUTHORITY;
  prototypeCount: number;
  recordCount: number;
  exactStemCount: number;
  exactQuestionOptionCount: number;
  maximumNormalizedStemRepetition: number;
  uniquePhysicalStateCount: number;
  unitCounts: Record<MenCp011HollowBoxLinearUnit, number>;
  answerPositionCounts: Record<Label, number>;
  prototypeUnitCounts: Record<string, number>;
  publicationEligible: false;
  resolvedDiscoveryCandidates: MenCp011HollowBoxPrototypeId[];
}

export function auditMenCp011HollowBoxBatch(
  records: readonly MenCp011HollowBoxPackage[],
): MenCp011HollowBoxAudit {
  const stemCounts = new Map<string, number>();
  const exactStems = new Set<string>();
  const exactQuestionOptions = new Set<string>();
  const physicalStates = new Set<string>();
  const unitCounts: Record<MenCp011HollowBoxLinearUnit, number> = { cm: 0, m: 0 };
  const answerPositionCounts: Record<Label, number> = { A: 0, B: 0, C: 0, D: 0 };
  const prototypeUnitCounts: Record<string, number> = {};

  for (const question of records) {
    const normalized = normalizeStem(question.stem);
    stemCounts.set(normalized, (stemCounts.get(normalized) ?? 0) + 1);
    exactStems.add(question.stem);
    exactQuestionOptions.add(
      `${question.stem}|${question.options.map((option) => exactKey(option.value)).join("|")}`,
    );
    physicalStates.add(
      [
        question.prototypeId,
        question.state.fixtureId,
        question.state.unit,
        question.state.outerLength,
        question.state.outerBreadth,
        question.state.outerHeight,
        question.state.thickness,
      ].join("|"),
    );
    unitCounts[question.state.unit] += 1;
    answerPositionCounts[LABELS[question.correctIndex]!] += 1;
    const cell = `${question.prototypeId}|${question.state.unit}`;
    prototypeUnitCounts[cell] = (prototypeUnitCounts[cell] ?? 0) + 1;
  }

  return {
    authority: MEN_CP011_HOLLOW_BOXES_AUTHORITY,
    prototypeCount: new Set(records.map((record) => record.prototypeId)).size,
    recordCount: records.length,
    exactStemCount: exactStems.size,
    exactQuestionOptionCount: exactQuestionOptions.size,
    maximumNormalizedStemRepetition: Math.max(0, ...stemCounts.values()),
    uniquePhysicalStateCount: physicalStates.size,
    unitCounts,
    answerPositionCounts,
    prototypeUnitCounts,
    publicationEligible: false,
    resolvedDiscoveryCandidates: getMenCp011HollowBoxPrototypeIds(),
  };
}

export function describeMenCp011HollowBoxAnswer(
  question: MenCp011HollowBoxPackage,
) {
  return `${question.prototypeId}: ${formatExactPlain(question.exactAnswer)} ${question.unit}`;
}
