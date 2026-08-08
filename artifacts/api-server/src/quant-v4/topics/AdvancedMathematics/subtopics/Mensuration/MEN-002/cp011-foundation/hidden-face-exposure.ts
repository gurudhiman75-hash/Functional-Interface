import {
  exactEquals,
  exactKey,
  formatExactPlain,
  formatWithUnit,
  rational,
} from "../foundation/exact";
import type { ExactValue, Men002Difficulty } from "../foundation/types";

export const MEN_CP011_HIDDEN_FACE_EXPOSURE_AUTHORITY =
  "MEN-CP011-HIDDEN-FACE-EXPOSURE-WAVE-01-V1" as const;

export type MenCp011HiddenFacePrototypeId =
  | "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA"
  | "MEN-CP011-PROT-CUBOID-ON-FLOOR-PAINTED-AREA";

export type MenCp011HiddenFaceSolveMode =
  | "findJoinedCubesExposedArea"
  | "findCuboidPaintedAreaExcludingFloorBase";

export type MenCp011HiddenFaceLinearUnit = "cm" | "m";
export type MenCp011HiddenFaceAreaUnit = "cm²" | "m²";
type Label = "A" | "B" | "C" | "D";
type DiagramRole = "PROMPT" | "SOLUTION";

interface JoinedCubeFixture {
  id: string;
  xCount: bigint;
  yCount: bigint;
  zCount: bigint;
  side: bigint;
}

interface FloorCuboidFixture {
  id: string;
  length: bigint;
  breadth: bigint;
  height: bigint;
}

const JOINED_CUBE_FIXTURES: readonly JoinedCubeFixture[] = [
  { id: "JC-01", xCount: 2n, yCount: 1n, zCount: 1n, side: 3n },
  { id: "JC-02", xCount: 3n, yCount: 1n, zCount: 1n, side: 4n },
  { id: "JC-03", xCount: 4n, yCount: 1n, zCount: 1n, side: 5n },
  { id: "JC-04", xCount: 2n, yCount: 2n, zCount: 1n, side: 3n },
  { id: "JC-05", xCount: 3n, yCount: 2n, zCount: 1n, side: 2n },
  { id: "JC-06", xCount: 2n, yCount: 2n, zCount: 2n, side: 2n },
  { id: "JC-07", xCount: 3n, yCount: 2n, zCount: 2n, side: 2n },
  { id: "JC-08", xCount: 4n, yCount: 3n, zCount: 2n, side: 1n },
] as const;

const FLOOR_CUBOID_FIXTURES: readonly FloorCuboidFixture[] = [
  { id: "FC-01", length: 10n, breadth: 6n, height: 4n },
  { id: "FC-02", length: 12n, breadth: 8n, height: 5n },
  { id: "FC-03", length: 15n, breadth: 10n, height: 6n },
  { id: "FC-04", length: 18n, breadth: 12n, height: 8n },
  { id: "FC-05", length: 22n, breadth: 14n, height: 9n },
  { id: "FC-06", length: 24n, breadth: 16n, height: 11n },
  { id: "FC-07", length: 30n, breadth: 20n, height: 14n },
  { id: "FC-08", length: 16n, breadth: 11n, height: 7n },
] as const;

export interface MenCp011HiddenFaceDefinition {
  prototypeId: MenCp011HiddenFacePrototypeId;
  solveMode: MenCp011HiddenFaceSolveMode;
  difficulty: Men002Difficulty;
  topology: "JOINED" | "PLACED";
}

export const MEN_CP011_HIDDEN_FACE_PROTOTYPES: readonly MenCp011HiddenFaceDefinition[] = [
  {
    prototypeId: "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA",
    solveMode: "findJoinedCubesExposedArea",
    difficulty: "Hard",
    topology: "JOINED",
  },
  {
    prototypeId: "MEN-CP011-PROT-CUBOID-ON-FLOOR-PAINTED-AREA",
    solveMode: "findCuboidPaintedAreaExcludingFloorBase",
    difficulty: "Medium",
    topology: "PLACED",
  },
] as const;

const DEFINITION_BY_ID = new Map(
  MEN_CP011_HIDDEN_FACE_PROTOTYPES.map((definition) => [
    definition.prototypeId,
    definition,
  ]),
);

export function getMenCp011HiddenFacePrototypeIds() {
  return MEN_CP011_HIDDEN_FACE_PROTOTYPES.map(
    (definition) => definition.prototypeId,
  );
}

export function getMenCp011HiddenFaceDefinition(
  prototypeId: MenCp011HiddenFacePrototypeId,
) {
  const definition = DEFINITION_BY_ID.get(prototypeId);
  if (!definition) {
    throw new Error(`Unknown MEN-CP-011 hidden-face prototype ${prototypeId}.`);
  }
  return definition;
}

export interface MenCp011HiddenFaceState {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-HIDDEN-FACE-EXPOSURE-WAVE-01";
  prototypeId: MenCp011HiddenFacePrototypeId;
  solveMode: MenCp011HiddenFaceSolveMode;
  target: "AREA";
  topology: "JOINED" | "PLACED";
  seed: string;
  stateSelectionAttempt: number;
  difficulty: Men002Difficulty;
  unit: MenCp011HiddenFaceLinearUnit;
  areaUnit: MenCp011HiddenFaceAreaUnit;
  fixtureId: string;
  xCount: bigint | null;
  yCount: bigint | null;
  zCount: bigint | null;
  cubeCount: bigint | null;
  cubeSide: bigint | null;
  internalJoinCount: bigint | null;
  separateCubeFaceCount: bigint | null;
  exposedFaceCount: bigint | null;
  length: bigint | null;
  breadth: bigint | null;
  height: bigint | null;
  topArea: bigint | null;
  sideArea: bigint | null;
  hiddenBaseArea: bigint | null;
  exposedAreaCoefficient: bigint;
  sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING";
}

export interface MenCp011HiddenFaceOption {
  label: Label;
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp011HiddenFaceDiagram {
  kind: "JOINED_CUBES_ORTHOGRAPHIC" | "CUBOID_ON_FLOOR";
  svg: string;
  accessibleText: string;
  visibleLabels: readonly string[];
  notToScale: true;
}

export interface MenCp011HiddenFaceLearnerSolution {
  formula: string;
  steps: string[];
  finalAnswer: string;
  shortcut: string;
  wrongOptionAnalysis: string[];
}

export interface MenCp011HiddenFacePackage {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-HIDDEN-FACE-EXPOSURE-WAVE-01";
  prototypeId: MenCp011HiddenFacePrototypeId;
  solveMode: MenCp011HiddenFaceSolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: "AREA";
  unit: MenCp011HiddenFaceAreaUnit;
  hiddenFaceAuthority: typeof MEN_CP011_HIDDEN_FACE_EXPOSURE_AUTHORITY;
  sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING";
  stem: string;
  options: MenCp011HiddenFaceOption[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  optionPermutationSeed: string;
  state: MenCp011HiddenFaceState;
  diagram: MenCp011HiddenFaceDiagram;
  solutionDiagram: MenCp011HiddenFaceDiagram;
  learnerSolution: MenCp011HiddenFaceLearnerSolution;
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
      diagram: MenCp011HiddenFaceDiagram;
      diagramPolicy: "OPTIONAL_PROMPT_SAFE_HIDDEN_FACE_DIAGRAM";
      exposesInternalCodes: false;
    };
    solution: {
      diagram: MenCp011HiddenFaceDiagram;
      explanation: MenCp011HiddenFaceLearnerSolution;
      exposesInternalCodes: false;
    };
    admin: {
      diagram: MenCp011HiddenFaceDiagram;
      trapCodes: string[];
      verification: MenCp011HiddenFacePackage["verification"];
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

export interface MenCp011HiddenFaceGenerationConstraints {
  unit?: MenCp011HiddenFaceLinearUnit;
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

function areaUnitFor(unit: MenCp011HiddenFaceLinearUnit): MenCp011HiddenFaceAreaUnit {
  return unit === "cm" ? "cm²" : "m²";
}

function dimension(value: bigint, unit: MenCp011HiddenFaceLinearUnit) {
  return `$${value}\\text{ ${unit}}$`;
}

function createState(
  prototypeId: MenCp011HiddenFacePrototypeId,
  seed: string,
  constraints: MenCp011HiddenFaceGenerationConstraints,
  attempt: number,
): MenCp011HiddenFaceState {
  const definition = getMenCp011HiddenFaceDefinition(prototypeId);
  const unit = constraints.unit ??
    (hashText(`${MEN_CP011_HIDDEN_FACE_EXPOSURE_AUTHORITY}|unit|${prototypeId}|${seed}|${attempt}`) % 2 === 0
      ? "cm"
      : "m");

  if (prototypeId === "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA") {
    const fixtureIndex = constraints.fixtureIndex === undefined
      ? hashText(`${MEN_CP011_HIDDEN_FACE_EXPOSURE_AUTHORITY}|joined|${seed}|${attempt}`) % JOINED_CUBE_FIXTURES.length
      : ((constraints.fixtureIndex % JOINED_CUBE_FIXTURES.length) + JOINED_CUBE_FIXTURES.length) % JOINED_CUBE_FIXTURES.length;
    const fixture = JOINED_CUBE_FIXTURES[fixtureIndex]!;
    const cubeCount = fixture.xCount * fixture.yCount * fixture.zCount;
    const internalJoinCount =
      (fixture.xCount - 1n) * fixture.yCount * fixture.zCount +
      fixture.xCount * (fixture.yCount - 1n) * fixture.zCount +
      fixture.xCount * fixture.yCount * (fixture.zCount - 1n);
    const separateCubeFaceCount = 6n * cubeCount;
    const exposedFaceCount = separateCubeFaceCount - 2n * internalJoinCount;
    const exposedAreaCoefficient = exposedFaceCount * fixture.side * fixture.side;
    return {
      packageId: "MEN-002",
      canonicalProblemId: "MEN-CP-011",
      permanentQlId: null,
      waveId: "MEN-CP-011-HIDDEN-FACE-EXPOSURE-WAVE-01",
      prototypeId,
      solveMode: definition.solveMode,
      target: "AREA",
      topology: definition.topology,
      seed,
      stateSelectionAttempt: attempt,
      difficulty: definition.difficulty,
      unit,
      areaUnit: areaUnitFor(unit),
      fixtureId: fixture.id,
      xCount: fixture.xCount,
      yCount: fixture.yCount,
      zCount: fixture.zCount,
      cubeCount,
      cubeSide: fixture.side,
      internalJoinCount,
      separateCubeFaceCount,
      exposedFaceCount,
      length: null,
      breadth: null,
      height: null,
      topArea: null,
      sideArea: null,
      hiddenBaseArea: null,
      exposedAreaCoefficient,
      sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING",
    };
  }

  const fixtureIndex = constraints.fixtureIndex === undefined
    ? hashText(`${MEN_CP011_HIDDEN_FACE_EXPOSURE_AUTHORITY}|floor|${seed}|${attempt}`) % FLOOR_CUBOID_FIXTURES.length
    : ((constraints.fixtureIndex % FLOOR_CUBOID_FIXTURES.length) + FLOOR_CUBOID_FIXTURES.length) % FLOOR_CUBOID_FIXTURES.length;
  const fixture = FLOOR_CUBOID_FIXTURES[fixtureIndex]!;
  const topArea = fixture.length * fixture.breadth;
  const sideArea = 2n * fixture.height * (fixture.length + fixture.breadth);
  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-011",
    permanentQlId: null,
    waveId: "MEN-CP-011-HIDDEN-FACE-EXPOSURE-WAVE-01",
    prototypeId,
    solveMode: definition.solveMode,
    target: "AREA",
    topology: definition.topology,
    seed,
    stateSelectionAttempt: attempt,
    difficulty: definition.difficulty,
    unit,
    areaUnit: areaUnitFor(unit),
    fixtureId: fixture.id,
    xCount: null,
    yCount: null,
    zCount: null,
    cubeCount: null,
    cubeSide: null,
    internalJoinCount: null,
    separateCubeFaceCount: null,
    exposedFaceCount: null,
    length: fixture.length,
    breadth: fixture.breadth,
    height: fixture.height,
    topArea,
    sideArea,
    hiddenBaseArea: topArea,
    exposedAreaCoefficient: topArea + sideArea,
    sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING",
  };
}

function arrangementDescription(state: MenCp011HiddenFaceState) {
  if (state.xCount === null || state.yCount === null || state.zCount === null) {
    return "";
  }
  if (state.yCount === 1n && state.zCount === 1n) {
    return `a straight row of ${state.xCount} cubes`;
  }
  if (state.zCount === 1n) {
    return `a single-layer ${state.xCount} by ${state.yCount} rectangular arrangement`;
  }
  return `a ${state.xCount} by ${state.yCount} by ${state.zCount} rectangular block`;
}

function createStem(state: MenCp011HiddenFaceState) {
  if (state.prototypeId === "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA") {
    const side = dimension(state.cubeSide!, state.unit);
    const arrangement = arrangementDescription(state);
    const variants = [
      `${state.cubeCount} identical solid cubes, each of side ${side}, are joined face to face to form ${arrangement}. Find the total exposed surface area of the resulting solid.`,
      `Identical cubes of edge ${side} are assembled as ${arrangement}. What is the outside surface area after all touching faces become internal?`,
      `A solid is built from ${state.cubeCount} cubes of side ${side} in ${arrangement}. Calculate the area of all faces that remain exposed.`,
      `${state.cubeCount} equal cubes, each having side ${side}, are joined without gaps in ${arrangement}. Determine the external surface area of the block formed.`,
      `Cubes of edge ${side} are placed face to face as ${arrangement}. Find the area visible from outside, excluding every contact face.`,
      `A rectangular assembly consists of ${state.cubeCount} identical cubes of side ${side}, arranged as ${state.xCount} × ${state.yCount} × ${state.zCount}. Find its exposed surface area.`,
      `A block is formed by joining ${state.cubeCount} cubes of edge ${side} in ${state.xCount}, ${state.yCount} and ${state.zCount} cubes along its three directions. Calculate its external area.`,
      `Several identical cubes of side ${side} make ${arrangement}. What total area remains exposed after the joined faces are hidden?`,
    ] as const;
    return choose(
      variants,
      `hidden-face:stem:${state.prototypeId}:${state.seed}:${state.fixtureId}`,
    );
  }

  const L = dimension(state.length!, state.unit);
  const B = dimension(state.breadth!, state.unit);
  const H = dimension(state.height!, state.unit);
  const variants = [
    `A cuboid of length ${L}, breadth ${B} and height ${H} stands on a floor. Its exposed outer surfaces are painted, but the face touching the floor is not. Find the painted area.`,
    `A rectangular box measuring ${L} × ${B} × ${H} is placed on its ${L} by ${B} base. Calculate the area to be painted if the bottom face is excluded.`,
    `A solid cuboid has dimensions ${L}, ${B} and ${H}. It rests on the floor and all visible faces are polished. Find the polished surface area.`,
    `A cuboidal cabinet of length ${L}, breadth ${B} and height ${H} is painted on the top and four side faces only. Determine the painted area.`,
    `A cuboid measuring ${L} by ${B} by ${H} is kept on a horizontal floor. What area remains exposed for painting?`,
    `The lower ${L} by ${B} face of a cuboid is completely hidden by the floor. If its height is ${H}, find the area of the other five faces.`,
    `A rectangular solid with dimensions ${L} × ${B} × ${H} is painted everywhere except the base on which it stands. Calculate the painted area.`,
    `A cuboid is placed on its length-breadth face. Its dimensions are ${L}, ${B} and ${H}. Find the total area of the top and four vertical sides.`,
  ] as const;
  return choose(
    variants,
    `hidden-face:stem:${state.prototypeId}:${state.seed}:${state.fixtureId}`,
  );
}

function candidatesFor(state: MenCp011HiddenFaceState): Candidate[] {
  if (state.prototypeId === "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA") {
    const sideSquare = state.cubeSide! * state.cubeSide!;
    const sideFacesOnly = 2n * state.zCount! * (state.xCount! + state.yCount!);
    return [
      {
        value: rational(state.exposedAreaCoefficient),
        misconceptionId: null,
        explanation: "",
      },
      {
        value: rational(state.separateCubeFaceCount! * sideSquare),
        misconceptionId: "COUNTED_HIDDEN_JOIN_FACES",
        explanation: "adding the surface areas of all separate cubes without removing any touching faces",
      },
      {
        value: rational(
          (state.separateCubeFaceCount! - state.internalJoinCount!) * sideSquare,
        ),
        misconceptionId: "SUBTRACTED_ONLY_ONE_JOIN_FACE",
        explanation: "subtracting only one face for each join even though every contact hides two faces",
      },
      {
        value: rational(sideFacesOnly * sideSquare),
        misconceptionId: "OMITTED_TOP_AND_BOTTOM_EXPOSED_FACES",
        explanation: "counting only the vertical outside faces and leaving out the exposed top and bottom",
      },
    ];
  }

  const L = state.length!;
  const B = state.breadth!;
  const H = state.height!;
  const lateral = state.sideArea!;
  const top = state.topArea!;
  return [
    {
      value: rational(state.exposedAreaCoefficient),
      misconceptionId: null,
      explanation: "",
    },
    {
      value: rational(2n * (L * B + B * H + H * L)),
      misconceptionId: "COUNTED_HIDDEN_FLOOR_BASE",
      explanation: "using the full total surface area and painting the base that is hidden by the floor",
    },
    {
      value: rational(lateral),
      misconceptionId: "OMITTED_EXPOSED_TOP_FACE",
      explanation: "counting the four vertical sides but forgetting the exposed top face",
    },
    {
      value: rational(top + 2n * L * H),
      misconceptionId: "OMITTED_BREADTH_SIDE_PAIR",
      explanation: "including the top and the two length-height faces but omitting the other pair of side faces",
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
    (hashText(`hidden-face:correct:${seed}`) % 4 as 0 | 1 | 2 | 3);
  const offset = hashText(`hidden-face:wrong:${seed}`) % wrong.length;
  const orderedWrong = wrong.map((_, index) => wrong[(index + offset) % wrong.length]!);
  const arranged: Candidate[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    arranged.push(index === correctIndex ? correct : orderedWrong[wrongIndex++]!);
  }
  return { arranged, correctIndex };
}

function gridCells(
  columns: number,
  rows: number,
  x: number,
  y: number,
  size: number,
  region: string,
) {
  const cells: string[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      cells.push(
        `<rect data-region="${region}" data-cell="${column}-${row}" x="${x + column * size}" y="${y + row * size}" width="${size}" height="${size}" fill="white" stroke="black"/>`,
      );
    }
  }
  return cells.join("\n");
}

function buildJoinedDiagram(
  state: MenCp011HiddenFaceState,
  role: DiagramRole,
): MenCp011HiddenFaceDiagram {
  const xCount = Number(state.xCount!);
  const yCount = Number(state.yCount!);
  const zCount = Number(state.zCount!);
  const maxCount = Math.max(xCount, yCount, zCount);
  const cell = Math.max(12, Math.min(34, Math.floor(112 / maxCount)));
  const resultLabel = role === "PROMPT"
    ? "exposed area = ?"
    : `exposed faces = ${state.exposedFaceCount}; area = ${state.exposedAreaCoefficient} ${state.areaUnit}`;
  const svg = `<svg viewBox="0 0 620 340" role="img" aria-label="Orthographic views of ${state.xCount} by ${state.yCount} by ${state.zCount} joined cubes; touching grid faces are internal; ${resultLabel}; not to scale" data-diagram-version="JOINED_CUBES_ORTHOGRAPHIC_V1" data-diagram-role="${role}" data-topology="JOINED" data-responsive="true" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="618" height="338" rx="10" fill="white" stroke="black"/>
  <g stroke-width="1.5">
    ${gridCells(xCount, zCount, 35, 75, cell, "front-view-cell")}
    ${gridCells(xCount, yCount, 245, 75, cell, "top-view-cell")}
    ${gridCells(yCount, zCount, 455, 75, cell, "right-view-cell")}
  </g>
  <g font-family="Arial, sans-serif" font-size="15" fill="black">
    <text x="25" y="28">ExamTree joined-cubes exposure ledger</text>
    <text x="35" y="58">Front: ${state.xCount} × ${state.zCount}</text>
    <text x="245" y="58">Top: ${state.xCount} × ${state.yCount}</text>
    <text x="455" y="58">Right: ${state.yCount} × ${state.zCount}</text>
    <text x="25" y="245">cube side = ${state.cubeSide} ${state.unit}; cubes = ${state.cubeCount}</text>
    <text data-role="contact-face-note" x="25" y="272">Every shared square is internal; each join hides two cube faces.</text>
    <text data-role="result-label" x="25" y="302">${resultLabel}</text>
    <text x="500" y="325">not to scale</text>
  </g>
</svg>`;
  return {
    kind: "JOINED_CUBES_ORTHOGRAPHIC",
    svg,
    accessibleText: `${state.cubeCount} cubes of side ${state.cubeSide} ${state.unit} arranged ${state.xCount} by ${state.yCount} by ${state.zCount}. Orthographic grids show the outside block; every shared square face is hidden internally.`,
    visibleLabels: [
      `${state.xCount} × ${state.yCount} × ${state.zCount}`,
      `side = ${state.cubeSide} ${state.unit}`,
      resultLabel,
    ],
    notToScale: true,
  };
}

function buildFloorDiagram(
  state: MenCp011HiddenFaceState,
  role: DiagramRole,
): MenCp011HiddenFaceDiagram {
  const resultLabel = role === "PROMPT"
    ? "painted area = ?"
    : `painted area = ${state.exposedAreaCoefficient} ${state.areaUnit}`;
  const svg = `<svg viewBox="0 0 560 330" role="img" aria-label="Cuboid of dimensions ${state.length} by ${state.breadth} by ${state.height} ${state.unit} standing on a floor; bottom face hidden and not painted; ${resultLabel}; not to scale" data-diagram-version="CUBOID_ON_FLOOR_EXPOSURE_V1" data-diagram-role="${role}" data-topology="PLACED" data-responsive="true" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="558" height="328" rx="10" fill="white" stroke="black"/>
  <g fill="none" stroke="black" stroke-width="2">
    <path data-region="front-face" d="M125 105 L350 105 L350 250 L125 250 Z"/>
    <path data-region="top-face" d="M125 105 L195 65 L420 65 L350 105 Z"/>
    <path data-region="side-face" d="M350 105 L420 65 L420 210 L350 250 Z"/>
    <path data-region="hidden-floor-contact" data-status="HIDDEN" stroke-dasharray="7 5" d="M125 250 L350 250 L420 210 L195 210 Z"/>
    <path data-region="floor-line" d="M65 270 L485 270"/>
  </g>
  <g font-family="Arial, sans-serif" font-size="15" fill="black">
    <text x="25" y="30">ExamTree cuboid-on-floor exposure ledger</text>
    <text x="25" y="55">L = ${state.length} ${state.unit}, B = ${state.breadth} ${state.unit}, H = ${state.height} ${state.unit}</text>
    <text data-role="hidden-base-note" x="25" y="295">Bottom L × B face touches the floor: hidden and not painted.</text>
    <text data-role="result-label" x="300" y="318">${resultLabel}</text>
    <text x="450" y="45">not to scale</text>
  </g>
</svg>`;
  return {
    kind: "CUBOID_ON_FLOOR",
    svg,
    accessibleText: `Cuboid ${state.length} by ${state.breadth} by ${state.height} ${state.unit} placed on its length-breadth base. The bottom face is hidden by the floor; the top and four side faces remain exposed.`,
    visibleLabels: [
      `L = ${state.length} ${state.unit}`,
      `B = ${state.breadth} ${state.unit}`,
      `H = ${state.height} ${state.unit}`,
      resultLabel,
    ],
    notToScale: true,
  };
}

function buildDiagram(
  state: MenCp011HiddenFaceState,
  role: DiagramRole,
) {
  return state.topology === "JOINED"
    ? buildJoinedDiagram(state, role)
    : buildFloorDiagram(state, role);
}

function buildExplanation(
  state: MenCp011HiddenFaceState,
  options: MenCp011HiddenFaceOption[],
) {
  const candidateMap = new Map(
    candidatesFor(state).map((candidate) => [candidate.misconceptionId, candidate]),
  );
  const wrongOptionAnalysis = options
    .filter((option) => !option.isCorrect)
    .map((option) => `${option.display} comes from ${candidateMap.get(option.misconceptionId)?.explanation}.`);
  const finalAnswer = formatWithUnit(
    rational(state.exposedAreaCoefficient),
    state.areaUnit,
  );

  if (state.topology === "JOINED") {
    const sideSquare = state.cubeSide! * state.cubeSide!;
    const formula = "$A=(6N-2J)a^2$";
    const keyRule = "Picture all cubes separately first, then remove the faces that disappear at contacts. One face-to-face join hides two square faces, one from each cube. Only the remaining outside faces contribute to exposed area.";
    const steps = [
      {
        title: "Count faces before joining",
        body: `There are ${state.cubeCount} cubes and each cube has 6 faces.`,
        equation: `$6N=6\\times${state.cubeCount}=${state.separateCubeFaceCount}\\text{ faces}$`,
      },
      {
        title: "Remove both faces at every join",
        body: `The arrangement has ${state.internalJoinCount} face-to-face joins. Each join hides two faces.`,
        equation: `$F_{exposed}=${state.separateCubeFaceCount}-2(${state.internalJoinCount})=${state.exposedFaceCount}$`,
      },
      {
        title: "Convert exposed faces to area",
        body: `Each square face has area ${sideSquare} ${state.areaUnit}, so the required area is ${finalAnswer}.`,
        equation: `$A=${state.exposedFaceCount}\\times${state.cubeSide}^{2}=${state.exposedAreaCoefficient}\\text{ ${state.areaUnit}}$`,
      },
    ];
    const shortcut = `Treat the joined assembly as one cuboid with dimensions $${state.xCount}a$, $${state.yCount}a$ and $${state.zCount}a$. Then $A=2a^2(xy+yz+zx)=2(${state.cubeSide})^2(${state.xCount}\\times${state.yCount}+${state.yCount}\\times${state.zCount}+${state.zCount}\\times${state.xCount})=${state.exposedAreaCoefficient}\\text{ ${state.areaUnit}}$.`;
    return {
      learnerSolution: {
        formula,
        steps: steps.map((step) => `${step.title}: ${step.body} ${step.equation ?? ""}`),
        finalAnswer,
        shortcut,
        wrongOptionAnalysis,
      } satisfies MenCp011HiddenFaceLearnerSolution,
      explanation: { keyRule, steps, shortcut, traps: wrongOptionAnalysis },
    };
  }

  const formula = "$A_{painted}=LB+2LH+2BH$";
  const keyRule = "Use a physical surface ledger: the bottom length-breadth face is hidden by the floor and contributes zero painted area. The equal top face and all four vertical side faces remain exposed.";
  const steps = [
    {
      title: "Count the top face",
      body: `The exposed top has area ${state.length} × ${state.breadth}.`,
      equation: `$A_{top}=${state.length}\\times${state.breadth}=${state.topArea}\\text{ ${state.areaUnit}}$`,
    },
    {
      title: "Count the four side faces",
      body: `The two length-height faces and two breadth-height faces together give the lateral area.`,
      equation: `$A_{sides}=2(${state.length})(${state.height})+2(${state.breadth})(${state.height})=${state.sideArea}\\text{ ${state.areaUnit}}$`,
    },
    {
      title: "Exclude the floor-contact base",
      body: `The hidden bottom contributes zero, so the top plus sides give ${finalAnswer}.`,
      equation: `$A_{painted}=${state.topArea}+${state.sideArea}=${state.exposedAreaCoefficient}\\text{ ${state.areaUnit}}$`,
    },
  ];
  const fullTsa = 2n * (state.length! * state.breadth! + state.breadth! * state.height! + state.height! * state.length!);
  const shortcut = `Start with the total surface area and subtract one base: $A=2(LB+BH+HL)-LB=${fullTsa}-${state.hiddenBaseArea}=${state.exposedAreaCoefficient}\\text{ ${state.areaUnit}}$.`;
  return {
    learnerSolution: {
      formula,
      steps: steps.map((step) => `${step.title}: ${step.body} ${step.equation ?? ""}`),
      finalAnswer,
      shortcut,
      wrongOptionAnalysis,
    } satisfies MenCp011HiddenFaceLearnerSolution,
    explanation: { keyRule, steps, shortcut, traps: wrongOptionAnalysis },
  };
}

function verify(state: MenCp011HiddenFaceState, exactAnswer: ExactValue) {
  if (state.topology === "JOINED") {
    const x = state.xCount! * state.cubeSide!;
    const y = state.yCount! * state.cubeSide!;
    const z = state.zCount! * state.cubeSide!;
    const reconstructed = 2n * (x * y + y * z + z * x);
    return {
      valid: exactEquals(exactAnswer, rational(reconstructed)),
      method: "Independent bounding-cuboid external-area reconstruction",
      reconstructed: `2[(${x})(${y})+(${y})(${z})+(${z})(${x})]=${reconstructed} ${state.areaUnit}`,
    };
  }
  const reconstructed =
    state.length! * state.breadth! +
    2n * state.height! * (state.length! + state.breadth!);
  return {
    valid: exactEquals(exactAnswer, rational(reconstructed)),
    method: "Independent top-plus-four-sides exposure ledger",
    reconstructed: `${state.length}×${state.breadth}+2×${state.height}×(${state.length}+${state.breadth})=${reconstructed} ${state.areaUnit}`,
  };
}

function learnerText(question: Pick<
  MenCp011HiddenFacePackage,
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

function validate(question: Omit<MenCp011HiddenFacePackage, "validation">) {
  const checks: Array<{ name: string; passed: boolean; message: string }> = [];
  const add = (name: string, passed: boolean, message: string) =>
    checks.push({ name, passed, message });
  const text = learnerText(question);

  add(
    "positive-exposed-area",
    question.state.exposedAreaCoefficient > 0n,
    "The resulting exposed area must be positive.",
  );
  add(
    "hidden-face-ledger",
    question.state.topology === "JOINED"
      ? question.state.exposedFaceCount ===
          question.state.separateCubeFaceCount! - 2n * question.state.internalJoinCount!
      : question.state.exposedAreaCoefficient ===
          question.state.topArea! + question.state.sideArea!,
    "The canonical hidden-face ledger must reconstruct the target area.",
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
    "Exactly one option must be correct and agree with correctIndex.",
  );
  add(
    "independent-verification",
    question.verification.valid,
    "Independent reconstruction must match the canonical answer.",
  );
  add(
    "diagram-topology",
    question.state.topology === "JOINED"
      ? question.diagram.svg.includes('data-topology="JOINED"') &&
          question.diagram.svg.includes('data-role="contact-face-note"')
      : question.diagram.svg.includes('data-topology="PLACED"') &&
          question.diagram.svg.includes('data-region="hidden-floor-contact"'),
    "The diagram must expose the correct contact or floor-hidden topology.",
  );
  add(
    "responsive-diagram",
    !/<svg[^>]+\bwidth="\d+/.test(question.diagram.svg) &&
      question.renderSurfaces.responsiveDiagramPolicy.minWidthPx === 0,
    "The SVG must be viewBox-driven and mobile-safe.",
  );
  add(
    "balanced-learner-mathjax",
    (text.match(/\$/g) ?? []).length % 2 === 0 && !text.includes("\\pih"),
    "Learner MathJax delimiters must be balanced and pi commands separated.",
  );
  add(
    "learner-admin-separation",
    !/\[(?:COUNTED_|SUBTRACTED_|OMITTED_|MEN-CP011-PROT-)/.test(text) &&
      question.renderSurfaces.attempt.diagram === null &&
      question.renderSurfaces.admin.exposesInternalCodes,
    "Internal codes must remain admin-only.",
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

  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp011HiddenFaceQuestion(
  prototypeId: MenCp011HiddenFacePrototypeId,
  seed: string,
  constraints: MenCp011HiddenFaceGenerationConstraints = {},
): MenCp011HiddenFacePackage {
  for (let attempt = 0; attempt < 48; attempt += 1) {
    const state = createState(prototypeId, seed, constraints, attempt);
    const candidates = candidatesFor(state);
    if (new Set(candidates.map((candidate) => exactKey(candidate.value))).size !== 4) {
      continue;
    }
    const optionPermutationSeed =
      `${MEN_CP011_HIDDEN_FACE_EXPOSURE_AUTHORITY}|options|${prototypeId}|${seed}|${attempt}`;
    const { arranged, correctIndex } = arrangeCandidates(
      candidates,
      optionPermutationSeed,
      constraints.correctIndex,
    );
    const options: MenCp011HiddenFaceOption[] = arranged.map((candidate, index) => ({
      label: LABELS[index]!,
      value: candidate.value,
      display: formatWithUnit(candidate.value, state.areaUnit),
      isCorrect: candidate.misconceptionId === null,
      misconceptionId: candidate.misconceptionId,
    }));
    const exactAnswer = rational(state.exposedAreaCoefficient);
    const verification = verify(state, exactAnswer);
    const diagram = buildDiagram(state, "PROMPT");
    const solutionDiagram = buildDiagram(state, "SOLUTION");
    const explanationParts = buildExplanation(state, options);
    const withoutValidation: Omit<MenCp011HiddenFacePackage, "validation"> = {
      packageId: "MEN-002",
      canonicalProblemId: "MEN-CP-011",
      permanentQlId: null,
      waveId: "MEN-CP-011-HIDDEN-FACE-EXPOSURE-WAVE-01",
      prototypeId,
      solveMode: state.solveMode,
      language: "en",
      seed,
      difficulty: state.difficulty,
      target: "AREA",
      unit: state.areaUnit,
      hiddenFaceAuthority: MEN_CP011_HIDDEN_FACE_EXPOSURE_AUTHORITY,
      sourceMaturity: state.sourceMaturity,
      stem: createStem(state),
      options,
      correctIndex,
      answer: formatWithUnit(exactAnswer, state.areaUnit),
      exactAnswer,
      optionPermutationSeed,
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
          diagramPolicy: "OPTIONAL_PROMPT_SAFE_HIDDEN_FACE_DIAGRAM",
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
    `Unable to generate a valid MEN-CP-011 hidden-face package for ${prototypeId} and seed ${seed}.`,
  );
}

export function generateMenCp011HiddenFaceReviewBatch() {
  const records: MenCp011HiddenFacePackage[] = [];
  const units: readonly MenCp011HiddenFaceLinearUnit[] = ["cm", "m"];
  for (const prototypeId of getMenCp011HiddenFacePrototypeIds()) {
    for (let unitIndex = 0; unitIndex < units.length; unitIndex += 1) {
      for (let fixtureIndex = 0; fixtureIndex < 8; fixtureIndex += 1) {
        records.push(
          generateMenCp011HiddenFaceQuestion(
            prototypeId,
            `hidden-face-review:${prototypeId}:${units[unitIndex]}:${fixtureIndex}`,
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
  return {
    authority: MEN_CP011_HIDDEN_FACE_EXPOSURE_AUTHORITY,
    records,
  };
}

function normalizeStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\d+/g, "<n>")
    .replace(/\s+/g, " ")
    .trim();
}

export function auditMenCp011HiddenFaceBatch(
  records: readonly MenCp011HiddenFacePackage[],
) {
  const normalizedCounts = new Map<string, number>();
  const exactStems = new Set<string>();
  const exactPackages = new Set<string>();
  const physicalStates = new Set<string>();
  const unitCounts: Record<MenCp011HiddenFaceLinearUnit, number> = { cm: 0, m: 0 };
  const answerPositionCounts: Record<Label, number> = { A: 0, B: 0, C: 0, D: 0 };
  const prototypeUnitCounts: Record<string, number> = {};

  for (const question of records) {
    const normalized = normalizeStem(question.stem);
    normalizedCounts.set(normalized, (normalizedCounts.get(normalized) ?? 0) + 1);
    exactStems.add(question.stem);
    exactPackages.add(
      `${question.stem}|${question.options.map((option) => exactKey(option.value)).join("|")}`,
    );
    physicalStates.add(
      [
        question.prototypeId,
        question.state.fixtureId,
        question.state.unit,
        question.state.xCount,
        question.state.yCount,
        question.state.zCount,
        question.state.cubeSide,
        question.state.length,
        question.state.breadth,
        question.state.height,
      ].join("|"),
    );
    unitCounts[question.state.unit] += 1;
    answerPositionCounts[LABELS[question.correctIndex]!] += 1;
    const cell = `${question.prototypeId}|${question.state.unit}`;
    prototypeUnitCounts[cell] = (prototypeUnitCounts[cell] ?? 0) + 1;
  }

  return {
    authority: MEN_CP011_HIDDEN_FACE_EXPOSURE_AUTHORITY,
    prototypeCount: new Set(records.map((record) => record.prototypeId)).size,
    recordCount: records.length,
    exactStemCount: exactStems.size,
    exactQuestionOptionCount: exactPackages.size,
    maximumNormalizedStemRepetition: Math.max(0, ...normalizedCounts.values()),
    uniquePhysicalStateCount: physicalStates.size,
    unitCounts,
    answerPositionCounts,
    prototypeUnitCounts,
    publicationEligible: false as const,
    resolvedDiscoveryCandidates: getMenCp011HiddenFacePrototypeIds(),
  };
}

export function describeMenCp011HiddenFaceAnswer(
  question: MenCp011HiddenFacePackage,
) {
  return `${question.prototypeId}: ${formatExactPlain(question.exactAnswer)} ${question.unit}`;
}
