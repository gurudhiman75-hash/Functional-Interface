import {
  exactEquals,
  exactKey,
  formatWithUnit,
  pi,
  rational,
} from "../foundation/exact";
import type { ExactValue, Men002Difficulty } from "../foundation/types";
import { generateMenCp007Prototype } from "../foundation/runtime";
import type { MenCp011PiPolicy } from "./types";

export const MEN_CP011_OPEN_CONTAINER_AUTHORITY =
  "MEN-CP011-OPEN-CONTAINER-EXPOSURE-WAVE-01-V1" as const;

export const MEN_CP011_OPEN_CUBOID_DISPOSITION = {
  candidatePrototypeId: "MEN-CP011-PROT-OPEN-CUBOID-SHEET-AREA",
  disposition: "REASSIGNED_TO_EXISTING_AUTHORITY",
  ownerCanonicalProblemId: "MEN-CP-007",
  ownerPrototypeId: "MEN-CP007-PROT-OPEN-TOP-BOX-AREA",
  reason:
    "The existing MEN-CP-007 authority already solves the direct open-top cuboid sheet-area contract by explicit included-face enumeration. MEN-CP-011 must not duplicate it unless a later source or topology audit proves a distinct exposure transformation.",
} as const;

export type MenCp011OpenContainerPrototypeId =
  | "MEN-CP011-PROT-OPEN-CYLINDER-ONE-END-AREA"
  | "MEN-CP011-PROT-OPEN-CYLINDER-BOTH-ENDS-AREA";

export type MenCp011OpenContainerSolveMode =
  | "findOpenCylinderOneEndArea"
  | "findOpenCylinderBothEndsArea";

export type MenCp011OpenContainerLinearUnit = "cm" | "m";
export type MenCp011OpenContainerAreaUnit = "cm²" | "m²";
export type MenCp011OpenContainerSurfaceId =
  | "CURVED_WALL"
  | "TOP_BASE"
  | "BOTTOM_BASE";

type Label = "A" | "B" | "C" | "D";
type SurfaceStatus = "EXPOSED" | "ABSENT";

export interface MenCp011OpenContainerSurfaceLedgerEntry {
  surfaceId: MenCp011OpenContainerSurfaceId;
  kind: "CURVED" | "PLANE";
  status: SurfaceStatus;
  contributionSign: 1 | 0;
  coefficientExpression: string;
  coefficientValue: bigint;
  reason: string;
}

export interface MenCp011OpenContainerDefinition {
  prototypeId: MenCp011OpenContainerPrototypeId;
  solveMode: MenCp011OpenContainerSolveMode;
  difficulty: Men002Difficulty;
  openEndCount: 1 | 2;
  includedSurfaceIds: readonly MenCp011OpenContainerSurfaceId[];
}

export const MEN_CP011_OPEN_CONTAINER_PROTOTYPES: readonly MenCp011OpenContainerDefinition[] = [
  {
    prototypeId: "MEN-CP011-PROT-OPEN-CYLINDER-ONE-END-AREA",
    solveMode: "findOpenCylinderOneEndArea",
    difficulty: "Medium",
    openEndCount: 1,
    includedSurfaceIds: ["CURVED_WALL", "BOTTOM_BASE"],
  },
  {
    prototypeId: "MEN-CP011-PROT-OPEN-CYLINDER-BOTH-ENDS-AREA",
    solveMode: "findOpenCylinderBothEndsArea",
    difficulty: "Easy",
    openEndCount: 2,
    includedSurfaceIds: ["CURVED_WALL"],
  },
] as const;

const DEFINITION_BY_ID = new Map(
  MEN_CP011_OPEN_CONTAINER_PROTOTYPES.map((definition) => [
    definition.prototypeId,
    definition,
  ]),
);

export function getMenCp011OpenContainerPrototypeIds() {
  return MEN_CP011_OPEN_CONTAINER_PROTOTYPES.map(
    (definition) => definition.prototypeId,
  );
}

export function getMenCp011OpenContainerDefinition(
  prototypeId: MenCp011OpenContainerPrototypeId,
) {
  const definition = DEFINITION_BY_ID.get(prototypeId);
  if (!definition) {
    throw new Error(`Unknown MEN-CP-011 open-container prototype ${prototypeId}.`);
  }
  return definition;
}

export interface MenCp011OpenContainerState {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-OPEN-CONTAINER-WAVE-01";
  prototypeId: MenCp011OpenContainerPrototypeId;
  solveMode: MenCp011OpenContainerSolveMode;
  target: "SURFACE_AREA";
  seed: string;
  difficulty: Men002Difficulty;
  piPolicy: MenCp011PiPolicy;
  linearUnit: MenCp011OpenContainerLinearUnit;
  areaUnit: MenCp011OpenContainerAreaUnit;
  radius: bigint;
  height: bigint;
  openEndCount: 1 | 2;
  curvedAreaCoefficient: bigint;
  oneBaseCoefficient: bigint;
  answerCoefficient: bigint;
  surfaceLedger: readonly MenCp011OpenContainerSurfaceLedgerEntry[];
  sourceMaturity: "BLUEPRINT_AND_EXISTING_RUNTIME_DERIVED_DIRECT_SOURCE_PENDING";
}

export interface MenCp011OpenContainerOption {
  label: Label;
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp011OpenContainerDiagram {
  kind: "OPEN_CYLINDER";
  svg: string;
  accessibleText: string;
  visibleLabels: readonly string[];
  notToScale: true;
}

export interface MenCp011OpenContainerLearnerSolution {
  formula: string;
  steps: string[];
  finalAnswer: string;
  shortcut: string;
  wrongOptionAnalysis: string[];
}

export interface MenCp011OpenContainerPackage {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-OPEN-CONTAINER-WAVE-01";
  prototypeId: MenCp011OpenContainerPrototypeId;
  solveMode: MenCp011OpenContainerSolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: "SURFACE_AREA";
  piPolicy: MenCp011PiPolicy;
  unit: MenCp011OpenContainerAreaUnit;
  openContainerAuthority: typeof MEN_CP011_OPEN_CONTAINER_AUTHORITY;
  sourceMaturity: "BLUEPRINT_AND_EXISTING_RUNTIME_DERIVED_DIRECT_SOURCE_PENDING";
  stem: string;
  options: MenCp011OpenContainerOption[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  optionPermutationSeed: string;
  state: MenCp011OpenContainerState;
  diagram: MenCp011OpenContainerDiagram;
  solutionDiagram: MenCp011OpenContainerDiagram;
  learnerSolution: MenCp011OpenContainerLearnerSolution;
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
      diagram: MenCp011OpenContainerDiagram;
      diagramPolicy: "OPTIONAL_OPEN_FACE_LEDGER_DIAGRAM";
      exposesInternalCodes: false;
    };
    solution: {
      diagram: MenCp011OpenContainerDiagram;
      explanation: MenCp011OpenContainerLearnerSolution;
      exposesInternalCodes: false;
    };
    admin: {
      diagram: MenCp011OpenContainerDiagram;
      trapCodes: string[];
      surfaceLedger: readonly MenCp011OpenContainerSurfaceLedgerEntry[];
      verification: MenCp011OpenContainerPackage["verification"];
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

export interface MenCp011OpenContainerGenerationConstraints {
  piPolicy?: MenCp011PiPolicy;
  linearUnit?: MenCp011OpenContainerLinearUnit;
  correctIndex?: 0 | 1 | 2 | 3;
}

interface Candidate {
  value: ExactValue;
  misconceptionId: string | null;
  explanation: string;
}

const LABELS: readonly Label[] = ["A", "B", "C", "D"];
const GENERAL_RADII = [3n, 4n, 5n, 6n, 8n, 9n, 10n, 12n, 15n, 18n] as const;
const INTEGRAL_22_OVER_7_RADII = [7n, 14n, 21n, 28n] as const;
const HEIGHTS = [7n, 9n, 10n, 12n, 14n, 15n, 18n, 20n, 21n, 24n, 28n] as const;

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

function piPolicyFor(seed: string): MenCp011PiPolicy {
  return hashText(`open-container:pi:${seed}`) % 2 === 0
    ? "EXACT_PI"
    : "PI_22_OVER_7";
}

function linearUnitFor(seed: string): MenCp011OpenContainerLinearUnit {
  return hashText(`open-container:unit:${seed}`) % 2 === 0 ? "cm" : "m";
}

function areaUnitFor(unit: MenCp011OpenContainerLinearUnit): MenCp011OpenContainerAreaUnit {
  return unit === "cm" ? "cm²" : "m²";
}

function areaFromCoefficient(
  policy: MenCp011PiPolicy,
  coefficient: bigint,
): ExactValue {
  return policy === "EXACT_PI"
    ? pi(coefficient)
    : rational(22n * coefficient, 7n);
}

function policySentence(policy: MenCp011PiPolicy) {
  return policy === "EXACT_PI"
    ? "Leave $\\pi$ in exact form."
    : "Use $\\pi=\\frac{22}{7}$.";
}

function dimension(value: bigint, unit: MenCp011OpenContainerLinearUnit) {
  return `$${value}\\text{ ${unit}}$`;
}

function surfaceLedger(
  radius: bigint,
  height: bigint,
  openEndCount: 1 | 2,
): readonly MenCp011OpenContainerSurfaceLedgerEntry[] {
  const curved = 2n * radius * height;
  const base = radius ** 2n;
  return [
    {
      surfaceId: "CURVED_WALL",
      kind: "CURVED",
      status: "EXPOSED",
      contributionSign: 1,
      coefficientExpression: "2rh",
      coefficientValue: curved,
      reason: "The curved wall exists and is exposed.",
    },
    {
      surfaceId: "TOP_BASE",
      kind: "PLANE",
      status: "ABSENT",
      contributionSign: 0,
      coefficientExpression: "r²",
      coefficientValue: base,
      reason: "The top is open, so there is no circular material face to count.",
    },
    {
      surfaceId: "BOTTOM_BASE",
      kind: "PLANE",
      status: openEndCount === 1 ? "EXPOSED" : "ABSENT",
      contributionSign: openEndCount === 1 ? 1 : 0,
      coefficientExpression: "r²",
      coefficientValue: base,
      reason:
        openEndCount === 1
          ? "The bottom circular base exists and is exposed."
          : "The second end is also open, so no circular base exists.",
    },
  ] as const;
}

function createState(
  prototypeId: MenCp011OpenContainerPrototypeId,
  seed: string,
  constraints: MenCp011OpenContainerGenerationConstraints = {},
): MenCp011OpenContainerState {
  const definition = getMenCp011OpenContainerDefinition(prototypeId);
  const piPolicy = constraints.piPolicy ?? piPolicyFor(`${prototypeId}:${seed}`);
  const linearUnit = constraints.linearUnit ?? linearUnitFor(`${prototypeId}:${seed}`);
  const radii =
    piPolicy === "PI_22_OVER_7"
      ? INTEGRAL_22_OVER_7_RADII
      : GENERAL_RADII;
  const radius = choose(radii, `radius:${prototypeId}:${seed}`);
  const height = choose(HEIGHTS, `height:${prototypeId}:${seed}`);
  const curvedAreaCoefficient = 2n * radius * height;
  const oneBaseCoefficient = radius ** 2n;
  const answerCoefficient =
    curvedAreaCoefficient +
    (definition.openEndCount === 1 ? oneBaseCoefficient : 0n);
  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-011",
    permanentQlId: null,
    waveId: "MEN-CP-011-OPEN-CONTAINER-WAVE-01",
    prototypeId,
    solveMode: definition.solveMode,
    target: "SURFACE_AREA",
    seed,
    difficulty: definition.difficulty,
    piPolicy,
    linearUnit,
    areaUnit: areaUnitFor(linearUnit),
    radius,
    height,
    openEndCount: definition.openEndCount,
    curvedAreaCoefficient,
    oneBaseCoefficient,
    answerCoefficient,
    surfaceLedger: surfaceLedger(radius, height, definition.openEndCount),
    sourceMaturity: "BLUEPRINT_AND_EXISTING_RUNTIME_DERIVED_DIRECT_SOURCE_PENDING",
  };
}

function createStem(state: MenCp011OpenContainerState) {
  const r = dimension(state.radius, state.linearUnit);
  const h = dimension(state.height, state.linearUnit);
  const policy = policySentence(state.piPolicy);
  const variants: Record<MenCp011OpenContainerPrototypeId, readonly string[]> = {
    "MEN-CP011-PROT-OPEN-CYLINDER-ONE-END-AREA": [
      `A cylindrical container of radius ${r} and height ${h} is open at the top and closed at the bottom. Find the area of sheet required for its curved wall and base. ${policy}`,
      `A lidless cylindrical can has radius ${r} and height ${h}. Its circular bottom is present. What total sheet area forms the can? ${policy}`,
      `A cylindrical vessel is closed at one end and open at the other. If its radius is ${r} and height is ${h}, find its total material surface area. ${policy}`,
      `A thin cylindrical drum has no top cover but retains its circular base. Its radius is ${r} and height is ${h}. Determine the sheet area used. ${policy}`,
      `Find the exposed material area of a cylindrical container with radius ${r} and height ${h}, when the curved wall and one circular base are present. ${policy}`,
      `A cylindrical bin of radius ${r} and height ${h} is open above. Calculate the area of metal needed for the side wall and bottom only. ${policy}`,
    ],
    "MEN-CP011-PROT-OPEN-CYLINDER-BOTH-ENDS-AREA": [
      `A thin cylindrical sleeve has radius ${r} and height ${h}. It is open at both ends, so only the curved wall is present. Find its material area. ${policy}`,
      `A cylindrical shell with no circular end faces has radius ${r} and length ${h}. Determine the area of sheet used for its curved wall. ${policy}`,
      `A cylinder of radius ${r} and height ${h} is open at both ends. What surface area is formed by the curved side alone? ${policy}`,
      `A hollow-ended cylindrical cover has no top or bottom discs. If its radius is ${r} and height is ${h}, find the sheet area required. ${policy}`,
      `Only the curved wall of a cylindrical sleeve remains; both circular ends are absent. The radius is ${r} and height is ${h}. Find the area. ${policy}`,
      `A cylindrical tube made from a thin rectangular sheet is open at both ends. Its radius is ${r} and length is ${h}. Calculate the sheet area. ${policy}`,
    ],
  };
  return choose(variants[state.prototypeId], `stem:${state.prototypeId}:${state.seed}`);
}

function candidatesFor(state: MenCp011OpenContainerState): Candidate[] {
  const curved = areaFromCoefficient(
    state.piPolicy,
    state.curvedAreaCoefficient,
  );
  const oneBase = areaFromCoefficient(
    state.piPolicy,
    state.oneBaseCoefficient,
  );
  const oneEnd = areaFromCoefficient(
    state.piPolicy,
    state.curvedAreaCoefficient + state.oneBaseCoefficient,
  );
  const closed = areaFromCoefficient(
    state.piPolicy,
    state.curvedAreaCoefficient + 2n * state.oneBaseCoefficient,
  );
  const halfCurved = areaFromCoefficient(
    state.piPolicy,
    state.radius * state.height,
  );

  if (state.openEndCount === 1) {
    return [
      { value: oneEnd, misconceptionId: null, explanation: "" },
      {
        value: closed,
        misconceptionId: "ADDED_MISSING_TOP_BASE",
        explanation:
          "counting two circular bases as though the cylinder were closed at both ends",
      },
      {
        value: curved,
        misconceptionId: "OMITTED_EXISTING_BOTTOM_BASE",
        explanation:
          "using only the curved surface area and forgetting the circular bottom that still exists",
      },
      {
        value: oneBase,
        misconceptionId: "COUNTED_BASE_ONLY",
        explanation:
          "calculating the circular bottom but omitting the complete curved wall",
      },
    ];
  }

  return [
    { value: curved, misconceptionId: null, explanation: "" },
    {
      value: oneEnd,
      misconceptionId: "ADDED_ONE_MISSING_BASE",
      explanation:
        "adding one circular end even though both ends are physically open",
    },
    {
      value: closed,
      misconceptionId: "TREATED_OPEN_SLEEVE_AS_CLOSED",
      explanation:
        "using the total surface area of a closed cylinder and adding two absent circular faces",
    },
    {
      value: halfCurved,
      misconceptionId: "OMITTED_FACTOR_TWO_IN_CIRCUMFERENCE",
      explanation:
        "using $\\pi rh$ instead of $2\\pi rh$ for the curved wall",
    },
  ];
}

function createOptions(
  state: MenCp011OpenContainerState,
  constraints: MenCp011OpenContainerGenerationConstraints,
) {
  const candidates = candidatesFor(state);
  const keys = candidates.map((candidate) => exactKey(candidate.value));
  if (new Set(keys).size !== 4) {
    throw new Error(`${state.prototypeId} produced duplicate option values for ${state.seed}.`);
  }
  const correct = candidates[0]!;
  const wrong = candidates.slice(1);
  const correctIndex =
    constraints.correctIndex ??
    (hashText(`open-container:option:${state.prototypeId}:${state.seed}`) % 4);
  const ordered = [...wrong];
  ordered.splice(correctIndex, 0, correct);
  const explanationByKey = new Map(
    candidates.map((candidate) => [exactKey(candidate.value), candidate.explanation]),
  );
  const options: MenCp011OpenContainerOption[] = ordered.map(
    (candidate, index) => ({
      label: LABELS[index]!,
      value: candidate.value,
      display: formatWithUnit(candidate.value, state.areaUnit),
      isCorrect: candidate.misconceptionId === null,
      misconceptionId: candidate.misconceptionId,
    }),
  );
  const traps = options
    .filter((option) => !option.isCorrect)
    .map(
      (option) =>
        `Option ${option.label} (${option.display}) comes from ${explanationByKey.get(exactKey(option.value))}.`,
    );
  return {
    options,
    correctIndex,
    traps,
    trapCodes: options
      .filter((option) => !option.isCorrect)
      .map((option) => option.misconceptionId!),
  };
}

function createDiagram(
  state: MenCp011OpenContainerState,
  role: "PROMPT" | "SOLUTION",
): MenCp011OpenContainerDiagram {
  const bottomStatus = state.openEndCount === 1 ? "EXPOSED" : "ABSENT";
  const bottomFill = state.openEndCount === 1 ? "#e7e5e4" : "none";
  const bottomDash = state.openEndCount === 1 ? "" : ' stroke-dasharray="7 6"';
  const radiusLabel = `r = ${state.radius} ${state.linearUnit}`;
  const heightLabel = `h = ${state.height} ${state.linearUnit}`;
  const svg = `<svg viewBox="0 0 440 300" role="img" aria-label="${state.openEndCount === 1 ? "Cylinder open at the top with one circular base" : "Cylindrical sleeve open at both ends"}" style="width:100%;height:auto" data-diagram-version="EXAMTREE_OPEN_CONTAINER_V1" data-diagram-role="${role}" data-responsive="true" data-open-ends="${state.openEndCount}" data-background="white">
  <rect x="0" y="0" width="440" height="300" fill="#ffffff"/>
  <g data-region="container-body" stroke="#334155" stroke-width="3" fill="none">
    <ellipse data-surface="TOP_BASE" data-status="ABSENT" cx="205" cy="70" rx="92" ry="34" fill="#f8fafc"/>
    <line x1="113" y1="70" x2="113" y2="224"/>
    <line x1="297" y1="70" x2="297" y2="224"/>
    <path data-surface="CURVED_WALL" data-status="EXPOSED" d="M113 70 C113 43 297 43 297 70 L297 224 C297 251 113 251 113 224 Z" fill="#e0e7ff" fill-opacity="0.72"/>
    <ellipse data-surface="BOTTOM_BASE" data-status="${bottomStatus}" cx="205" cy="224" rx="92" ry="34" fill="${bottomFill}"${bottomDash}/>
    <ellipse data-region="top-opening" cx="205" cy="70" rx="68" ry="23" fill="#ffffff" stroke="#64748b" stroke-width="2"/>
  </g>
  <g data-region="dimensions" stroke="#d97706" stroke-width="2" fill="none">
    <line data-dimension="radius" x1="205" y1="70" x2="273" y2="70"/>
    <line data-dimension="height" x1="332" y1="70" x2="332" y2="224"/>
    <line x1="326" y1="70" x2="338" y2="70"/>
    <line x1="326" y1="224" x2="338" y2="224"/>
  </g>
  <g data-region="labels" fill="#1e293b" font-family="system-ui, sans-serif" font-size="16">
    <text x="213" y="60">${radiusLabel}</text>
    <text x="344" y="152">${heightLabel}</text>
    <text x="20" y="282" font-size="13">not to scale</text>
    <text x="126" y="119" font-size="14" fill="#4338ca">curved wall</text>
    <text x="134" y="28" font-size="14" fill="#64748b">open end — no disc</text>
    <text x="132" y="272" font-size="14" fill="#64748b">${state.openEndCount === 1 ? "circular base present" : "second end open — no disc"}</text>
  </g>
</svg>`;
  return {
    kind: "OPEN_CYLINDER",
    svg,
    accessibleText:
      state.openEndCount === 1
        ? `A cylinder of radius ${state.radius} ${state.linearUnit} and height ${state.height} ${state.linearUnit}, open at the top with its curved wall and bottom circular base present.`
        : `A cylindrical sleeve of radius ${state.radius} ${state.linearUnit} and height ${state.height} ${state.linearUnit}, with both circular ends absent and only the curved wall present.`,
    visibleLabels: [radiusLabel, heightLabel],
    notToScale: true,
  };
}

function buildLearnerSolution(
  state: MenCp011OpenContainerState,
  answer: ExactValue,
  options: MenCp011OpenContainerOption[],
  traps: string[],
): MenCp011OpenContainerLearnerSolution {
  const piText = state.piPolicy === "EXACT_PI" ? "\\pi" : "\\frac{22}{7}";
  const formula =
    state.openEndCount === 1
      ? "Area = curved wall + one circular base = $2\\pi rh+\\pi r^2$."
      : "Both circular ends are absent, so area = curved wall only = $2\\pi rh$.";
  const steps = [
    state.openEndCount === 1
      ? "Surface ledger: count the curved wall and the bottom base; do not count the open top."
      : "Surface ledger: count the curved wall; both circular ends are open and contribute zero.",
    `Curved wall $=2\\times${piText}\\times${state.radius}\\times${state.height}$.`,
    ...(state.openEndCount === 1
      ? [`Bottom base $=${piText}\\times${state.radius}^{2}$.`]
      : []),
    `Therefore the required area is ${formatWithUnit(answer, state.areaUnit)}.`,
  ];
  return {
    formula,
    steps,
    finalAnswer: `Required material area $=${formatWithUnit(answer, state.areaUnit).slice(1, -1)}$.`,
    shortcut:
      state.openEndCount === 1
        ? "Start from the curved wall and add exactly one base. The open mouth contributes nothing."
        : "For a cylinder open at both ends, stop at the curved surface area; no base term is allowed.",
    wrongOptionAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option, index) => traps[index]!),
  };
}

function verifyState(state: MenCp011OpenContainerState, answer: ExactValue) {
  const coefficient = state.surfaceLedger.reduce(
    (sum, surface) =>
      sum + BigInt(surface.contributionSign) * surface.coefficientValue,
    0n,
  );
  const reconstructed = areaFromCoefficient(state.piPolicy, coefficient);
  return {
    valid: exactEquals(reconstructed, answer),
    method: "independent exposed-surface ledger reconstruction",
    reconstructed: exactKey(reconstructed),
  };
}

function learnerText(
  stem: string,
  options: MenCp011OpenContainerOption[],
  solution: MenCp011OpenContainerLearnerSolution,
) {
  return [
    stem,
    ...options.map((option) => option.display),
    solution.formula,
    ...solution.steps,
    solution.finalAnswer,
    solution.shortcut,
    ...solution.wrongOptionAnalysis,
  ].join("\n");
}

function validatePackage(
  question: Omit<MenCp011OpenContainerPackage, "validation">,
) {
  const text = learnerText(
    question.stem,
    question.options,
    question.learnerSolution,
  );
  const expectedExposed =
    question.state.openEndCount === 1
      ? ["CURVED_WALL", "BOTTOM_BASE"]
      : ["CURVED_WALL"];
  const actualExposed = question.state.surfaceLedger
    .filter((surface) => surface.status === "EXPOSED")
    .map((surface) => surface.surfaceId);
  const checks = [
    {
      name: "independent verifier",
      passed: question.verification.valid,
      message: "The exposed-surface ledger must reconstruct the canonical answer.",
    },
    {
      name: "four unique options",
      passed:
        question.options.length === 4 &&
        new Set(question.options.map((option) => exactKey(option.value))).size === 4,
      message: "Exactly four exact-value-distinct options are required.",
    },
    {
      name: "one correct option",
      passed:
        question.options.filter((option) => option.isCorrect).length === 1 &&
        question.options[question.correctIndex]?.isCorrect === true,
      message: "Exactly one option must be correct and the stored index must identify it.",
    },
    {
      name: "surface topology",
      passed:
        JSON.stringify(actualExposed) === JSON.stringify(expectedExposed) &&
        question.state.surfaceLedger.filter((surface) => surface.status === "ABSENT").length ===
          question.state.openEndCount,
      message: "Only physically present surfaces may contribute to the area.",
    },
    {
      name: "text-complete attempt",
      passed:
        question.renderSurfaces.attempt.diagram === null &&
        question.stem.includes(question.state.radius.toString()) &&
        question.stem.includes(question.state.height.toString()),
      message: "Attempt mode must remain solvable without a diagram.",
    },
    {
      name: "diagram-state parity",
      passed:
        question.diagram.svg.includes(`data-open-ends=\"${question.state.openEndCount}\"`) &&
        question.diagram.svg.includes(`r = ${question.state.radius} ${question.state.linearUnit}`) &&
        question.diagram.svg.includes(`h = ${question.state.height} ${question.state.linearUnit}`),
      message: "Diagram topology and labels must match the canonical state.",
    },
    {
      name: "learner text safety",
      passed:
        !/MEN-CP011-PROT|misconceptionId|FALLBACK_|UNCLASSIFIED/.test(text) &&
        !/\[[A-Z0-9_]+\]/.test(text) &&
        !text.includes("\\pih") &&
        (text.match(/\$/g) ?? []).length % 2 === 0,
      message: "Learner text must hide internal codes and use balanced MathJax delimiters.",
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
      message: "Open discovery packages must remain outside every production surface.",
    },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp011OpenContainerQuestion(
  prototypeId: MenCp011OpenContainerPrototypeId,
  seed: string,
  constraints: MenCp011OpenContainerGenerationConstraints = {},
): MenCp011OpenContainerPackage {
  const state = createState(prototypeId, seed, constraints);
  const stem = createStem(state);
  const candidates = candidatesFor(state);
  const exactAnswer = candidates[0]!.value;
  const { options, correctIndex, traps, trapCodes } = createOptions(
    state,
    constraints,
  );
  const diagram = createDiagram(state, "PROMPT");
  const solutionDiagram = createDiagram(state, "SOLUTION");
  const learnerSolution = buildLearnerSolution(
    state,
    exactAnswer,
    options,
    traps,
  );
  const verification = verifyState(state, exactAnswer);
  const partial = {
    packageId: "MEN-002" as const,
    canonicalProblemId: "MEN-CP-011" as const,
    permanentQlId: null,
    waveId: "MEN-CP-011-OPEN-CONTAINER-WAVE-01" as const,
    prototypeId,
    solveMode: state.solveMode,
    language: "en" as const,
    seed,
    difficulty: state.difficulty,
    target: "SURFACE_AREA" as const,
    piPolicy: state.piPolicy,
    unit: state.areaUnit,
    openContainerAuthority: MEN_CP011_OPEN_CONTAINER_AUTHORITY,
    sourceMaturity: state.sourceMaturity,
    stem,
    options,
    correctIndex,
    answer: options[correctIndex]!.display,
    exactAnswer,
    optionPermutationSeed: `MEN-CP011-OPEN-CONTAINER-OPTION-V1|${prototypeId}|${seed}`,
    state,
    diagram,
    solutionDiagram,
    learnerSolution,
    explanation: {
      keyRule: learnerSolution.formula,
      steps: learnerSolution.steps.map((body, index) => ({
        title:
          index === 0
            ? "Identify Existing Surfaces"
            : index === learnerSolution.steps.length - 1
              ? "State the Required Area"
              : "Calculate the Included Surface",
        body,
      })),
      shortcut: learnerSolution.shortcut,
      traps,
    },
    verification,
    renderSurfaces: {
      attempt: {
        diagram: null,
        diagramPolicy: "HIDDEN_FOR_TEXT_COMPLETE_ITEM" as const,
        exposesInternalCodes: false as const,
      },
      practice: {
        diagram,
        diagramPolicy: "OPTIONAL_OPEN_FACE_LEDGER_DIAGRAM" as const,
        exposesInternalCodes: false as const,
      },
      solution: {
        diagram: solutionDiagram,
        explanation: learnerSolution,
        exposesInternalCodes: false as const,
      },
      admin: {
        diagram: solutionDiagram,
        trapCodes,
        surfaceLedger: state.surfaceLedger,
        verification,
        exposesInternalCodes: true as const,
      },
      responsiveDiagramPolicy: {
        width: "100%" as const,
        minWidthPx: 0 as const,
        height: "auto" as const,
        compactLegendOnMobile: true as const,
      },
    },
    reviewStatus: "UNREVIEWED" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
  };
  return { ...partial, validation: validatePackage(partial) };
}

export function proveMenCp011OpenCuboidOwnership(seed: string) {
  const ownerQuestion = generateMenCp007Prototype(
    MEN_CP011_OPEN_CUBOID_DISPOSITION.ownerPrototypeId,
    seed,
  );
  return {
    valid:
      ownerQuestion.canonicalProblemId ===
        MEN_CP011_OPEN_CUBOID_DISPOSITION.ownerCanonicalProblemId &&
      ownerQuestion.prototypeId ===
        MEN_CP011_OPEN_CUBOID_DISPOSITION.ownerPrototypeId &&
      ownerQuestion.solveMode === "findOpenTopCuboidSheetArea" &&
      ownerQuestion.target === "SURFACE_AREA" &&
      ownerQuestion.validation.valid &&
      ownerQuestion.verification.valid,
    disposition: MEN_CP011_OPEN_CUBOID_DISPOSITION,
    ownerQuestion,
  };
}

function normalizedStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\s+/g, " ")
    .trim();
}

function physicalStateKey(question: MenCp011OpenContainerPackage) {
  return [
    question.state.linearUnit,
    question.state.radius,
    question.state.height,
  ].join("|");
}

function questionOptionKey(question: MenCp011OpenContainerPackage) {
  return [question.stem, ...question.options.map((option) => option.display)].join("\n");
}

export interface MenCp011OpenContainerBatchAudit {
  authority: typeof MEN_CP011_OPEN_CONTAINER_AUTHORITY;
  recordCount: number;
  prototypeCount: number;
  exactStemCount: number;
  exactQuestionOptionCount: number;
  normalizedStemGroupCount: number;
  maximumNormalizedStemRepetition: number;
  uniquePhysicalStateCount: number;
  answerPositionCounts: Record<Label, number>;
  profileCounts: Record<string, number>;
  prototypeProfileCounts: Record<string, number>;
  blockers: readonly string[];
  publicationEligible: false;
}

export function auditMenCp011OpenContainerBatch(
  records: readonly MenCp011OpenContainerPackage[],
): MenCp011OpenContainerBatchAudit {
  const answerPositionCounts = { A: 0, B: 0, C: 0, D: 0 };
  const profileCounts: Record<string, number> = {};
  const prototypeProfileCounts: Record<string, number> = {};
  const normalizedCounts = new Map<string, number>();
  for (const question of records) {
    const label = question.options[question.correctIndex]!.label;
    answerPositionCounts[label] += 1;
    const profile = `${question.state.linearUnit}|${question.piPolicy}`;
    profileCounts[profile] = (profileCounts[profile] ?? 0) + 1;
    const prototypeProfile = `${question.prototypeId}|${profile}`;
    prototypeProfileCounts[prototypeProfile] =
      (prototypeProfileCounts[prototypeProfile] ?? 0) + 1;
    const normalized = normalizedStem(question.stem);
    normalizedCounts.set(normalized, (normalizedCounts.get(normalized) ?? 0) + 1);
  }
  return {
    authority: MEN_CP011_OPEN_CONTAINER_AUTHORITY,
    recordCount: records.length,
    prototypeCount: getMenCp011OpenContainerPrototypeIds().length,
    exactStemCount: new Set(records.map((question) => question.stem)).size,
    exactQuestionOptionCount: new Set(records.map(questionOptionKey)).size,
    normalizedStemGroupCount: normalizedCounts.size,
    maximumNormalizedStemRepetition: Math.max(...normalizedCounts.values()),
    uniquePhysicalStateCount: new Set(records.map(physicalStateKey)).size,
    answerPositionCounts,
    profileCounts,
    prototypeProfileCounts,
    blockers: [
      "DIRECT_SOURCE_NORMALISATION_PENDING",
      "MANUAL_ENGLISH_REVIEW_PENDING",
      "CHAPTER_COVERAGE_INCOMPLETE",
      "PERMANENT_QLS_UNALLOCATED",
    ],
    publicationEligible: false,
  };
}

export function generateMenCp011OpenContainerReviewBatch(
  seedNamespace = "men-cp011-open-container-wave01-review-v1",
  recordsPerPrototype = 16,
) {
  if (recordsPerPrototype !== 16) {
    throw new Error("Open-container Wave 01 requires exactly 16 review records per runtime prototype.");
  }
  const profiles = [
    { linearUnit: "cm", piPolicy: "EXACT_PI" },
    { linearUnit: "cm", piPolicy: "PI_22_OVER_7" },
    { linearUnit: "m", piPolicy: "EXACT_PI" },
    { linearUnit: "m", piPolicy: "PI_22_OVER_7" },
  ] as const;
  const positionSequences = [
    [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3],
    [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0],
  ] as const;
  const records: MenCp011OpenContainerPackage[] = [];
  const usedStates = new Set<string>();
  const usedStems = new Set<string>();
  const usedQuestionOptions = new Set<string>();
  const normalizedCounts = new Map<string, number>();

  getMenCp011OpenContainerPrototypeIds().forEach(
    (prototypeId, prototypeIndex) => {
      for (let sampleIndex = 0; sampleIndex < recordsPerPrototype; sampleIndex += 1) {
        const profile = profiles[sampleIndex % profiles.length]!;
        const correctIndex = positionSequences[prototypeIndex]![sampleIndex]! as 0 | 1 | 2 | 3;
        let accepted: MenCp011OpenContainerPackage | null = null;
        for (let attempt = 0; attempt < 4096; attempt += 1) {
          const candidate = generateMenCp011OpenContainerQuestion(
            prototypeId,
            `${seedNamespace}:${prototypeId}:${sampleIndex + 1}:candidate-${attempt}`,
            { ...profile, correctIndex },
          );
          const stateKey = physicalStateKey(candidate);
          const optionKey = questionOptionKey(candidate);
          const normalized = normalizedStem(candidate.stem);
          if (!candidate.validation.valid || !candidate.verification.valid) continue;
          if (usedStates.has(stateKey)) continue;
          if (usedStems.has(candidate.stem)) continue;
          if (usedQuestionOptions.has(optionKey)) continue;
          if ((normalizedCounts.get(normalized) ?? 0) >= 4) continue;
          accepted = candidate;
          usedStates.add(stateKey);
          usedStems.add(candidate.stem);
          usedQuestionOptions.add(optionKey);
          normalizedCounts.set(normalized, (normalizedCounts.get(normalized) ?? 0) + 1);
          break;
        }
        if (!accepted) {
          throw new Error(`Unable to construct ${prototypeId} review record ${sampleIndex + 1}.`);
        }
        records.push(accepted);
      }
    },
  );

  const audit = auditMenCp011OpenContainerBatch(records);
  if (audit.recordCount !== 32 || audit.uniquePhysicalStateCount !== 32) {
    throw new Error("Open-container Wave 01 requires 32 records using 32 distinct physical states.");
  }
  if (audit.exactStemCount !== 32 || audit.exactQuestionOptionCount !== 32) {
    throw new Error("Open-container Wave 01 review records must be exact-package unique.");
  }
  if (audit.maximumNormalizedStemRepetition > 4) {
    throw new Error("An open-container normalized stem may not appear more than four times.");
  }
  if (!Object.values(audit.answerPositionCounts).every((count) => count === 8)) {
    throw new Error("The 32-record batch must balance A, B, C and D at eight each.");
  }
  if (!Object.values(audit.profileCounts).every((count) => count === 8)) {
    throw new Error("Each unit/pi profile must appear eight times across the batch.");
  }
  if (!Object.values(audit.prototypeProfileCounts).every((count) => count === 4)) {
    throw new Error("Each prototype/profile cell must contain exactly four records.");
  }
  return { records, audit };
}
