import {
  exactEquals,
  exactKey,
  formatExactPlain,
  formatWithUnit,
  pi,
  rational,
} from "../foundation/exact";
import type { ExactValue, Men002Difficulty } from "../foundation/types";
import {
  getMenCp011MeasurementProfile,
  getMenCp011MeasurementProfiles,
  menCp011CalculationValues,
  selectMenCp011MeasurementProfile,
  type MenCp011LinearUnit,
  type MenCp011MeasurementProfile,
  type MenCp011MeasurementProfileId,
  type MenCp011VolumeUnit,
} from "./measurement-profiles";
import {
  getMenCp011PhysicalStateCatalog,
  MEN_CP011_STATE_POOL_AUTHORITY,
  type MenCp011PhysicalStateFixture,
} from "./state-pool";
import type { MenCp011PiPolicy } from "./types";

export const MEN_CP011_INVERSE_THICKNESS_LENGTH_AUTHORITY =
  "MEN-CP011-INVERSE-THICKNESS-LENGTH-WAVE-01-V1" as const;

export type MenCp011InversePrototypeId =
  | "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME"
  | "MEN-CP011-PROT-PIPE-LENGTH-FROM-MATERIAL-VOLUME";

export type MenCp011InverseSolveMode =
  | "findPipeThicknessFromMaterialVolume"
  | "findPipeLengthFromMaterialVolume";

type Label = "A" | "B" | "C" | "D";
type DiagramRole = "PROMPT" | "SOLUTION";

export interface MenCp011InverseDefinition {
  prototypeId: MenCp011InversePrototypeId;
  solveMode: MenCp011InverseSolveMode;
  difficulty: Men002Difficulty;
  targetLabel: "t" | "h";
}

export const MEN_CP011_INVERSE_PROTOTYPES: readonly MenCp011InverseDefinition[] = [
  {
    prototypeId: "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME",
    solveMode: "findPipeThicknessFromMaterialVolume",
    difficulty: "Hard",
    targetLabel: "t",
  },
  {
    prototypeId: "MEN-CP011-PROT-PIPE-LENGTH-FROM-MATERIAL-VOLUME",
    solveMode: "findPipeLengthFromMaterialVolume",
    difficulty: "Medium",
    targetLabel: "h",
  },
] as const;

const DEFINITION_BY_ID = new Map(
  MEN_CP011_INVERSE_PROTOTYPES.map((definition) => [
    definition.prototypeId,
    definition,
  ]),
);

export function getMenCp011InversePrototypeIds() {
  return MEN_CP011_INVERSE_PROTOTYPES.map((definition) =>
    definition.prototypeId,
  );
}

export function getMenCp011InverseDefinition(
  prototypeId: MenCp011InversePrototypeId,
) {
  const definition = DEFINITION_BY_ID.get(prototypeId);
  if (!definition) {
    throw new Error(`Unknown MEN-CP-011 inverse prototype ${prototypeId}.`);
  }
  return definition;
}

export interface MenCp011InverseState {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-INVERSE-WAVE-01";
  prototypeId: MenCp011InversePrototypeId;
  solveMode: MenCp011InverseSolveMode;
  target: "LENGTH";
  seed: string;
  stateSelectionAttempt: number;
  difficulty: Men002Difficulty;
  piPolicy: MenCp011PiPolicy;
  measurementProfileId: MenCp011MeasurementProfileId;
  measurementProfile: MenCp011MeasurementProfile;
  radialUnit: MenCp011LinearUnit;
  heightUnit: MenCp011LinearUnit;
  calculationUnit: MenCp011LinearUnit;
  volumeUnit: MenCp011VolumeUnit;
  answerUnit: MenCp011LinearUnit;
  fixtureId: string;
  outerRadius: bigint;
  innerRadius: bigint;
  thickness: bigint;
  height: bigint;
  calculationOuterRadius: bigint;
  calculationInnerRadius: bigint;
  calculationThickness: bigint;
  calculationHeight: bigint;
  ringCoefficient: bigint;
  volumeCoefficient: bigint;
  materialVolume: ExactValue;
  sourceMaturity: "BLUEPRINT_AND_EXISTING_RUNTIME_DERIVED_DIRECT_SOURCE_PENDING";
}

export interface MenCp011InverseOption {
  label: Label;
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp011InverseDiagram {
  kind: "HOLLOW_PIPE_INVERSE";
  svg: string;
  accessibleText: string;
  visibleLabels: readonly string[];
  notToScale: true;
}

export interface MenCp011InverseLearnerSolution {
  formula: string;
  steps: string[];
  finalAnswer: string;
  shortcut: string;
  wrongOptionAnalysis: string[];
}

export interface MenCp011InversePackage {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-INVERSE-WAVE-01";
  prototypeId: MenCp011InversePrototypeId;
  solveMode: MenCp011InverseSolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: "LENGTH";
  piPolicy: MenCp011PiPolicy;
  unit: MenCp011LinearUnit;
  measurementAuthority: "MEN-CP011-PHASE2B-UNIT-REPRESENTATION-V1";
  statePoolAuthority: typeof MEN_CP011_STATE_POOL_AUTHORITY;
  inverseAuthority: typeof MEN_CP011_INVERSE_THICKNESS_LENGTH_AUTHORITY;
  sourceMaturity: "BLUEPRINT_AND_EXISTING_RUNTIME_DERIVED_DIRECT_SOURCE_PENDING";
  stem: string;
  options: MenCp011InverseOption[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  optionPermutationSeed: string;
  state: MenCp011InverseState;
  diagram: MenCp011InverseDiagram;
  solutionDiagram: MenCp011InverseDiagram;
  learnerSolution: MenCp011InverseLearnerSolution;
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
      diagram: MenCp011InverseDiagram;
      diagramPolicy: "OPTIONAL_PROMPT_SAFE_INVERSE_DIAGRAM";
      exposesInternalCodes: false;
    };
    solution: {
      diagram: MenCp011InverseDiagram;
      explanation: MenCp011InverseLearnerSolution;
      exposesInternalCodes: false;
    };
    admin: {
      diagram: MenCp011InverseDiagram;
      trapCodes: string[];
      verification: MenCp011InversePackage["verification"];
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

export interface MenCp011InverseGenerationConstraints {
  measurementProfileId?: MenCp011MeasurementProfileId;
  piPolicy?: MenCp011PiPolicy;
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

function piPolicyFor(seed: string): MenCp011PiPolicy {
  return hashText(`inverse:pi:${seed}`) % 2 === 0
    ? "EXACT_PI"
    : "PI_22_OVER_7";
}

function volumeFromCoefficient(
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

function dimension(value: bigint, unit: MenCp011LinearUnit) {
  return `$${value}\\text{ ${unit}}$`;
}

function stateFixtureFor(
  prototypeId: MenCp011InversePrototypeId,
  seed: string,
  attempt: number,
): MenCp011PhysicalStateFixture {
  return choose(
    getMenCp011PhysicalStateCatalog(),
    `${MEN_CP011_INVERSE_THICKNESS_LENGTH_AUTHORITY}|fixture|${prototypeId}|${seed}|${attempt}`,
  );
}

function createState(
  prototypeId: MenCp011InversePrototypeId,
  seed: string,
  constraints: MenCp011InverseGenerationConstraints,
  attempt: number,
): MenCp011InverseState {
  const definition = getMenCp011InverseDefinition(prototypeId);
  const measurementProfile = constraints.measurementProfileId
    ? getMenCp011MeasurementProfile(constraints.measurementProfileId)
    : selectMenCp011MeasurementProfile(`${prototypeId}:${seed}:${attempt}`);
  const piPolicy = constraints.piPolicy ??
    piPolicyFor(`${prototypeId}:${seed}:${attempt}`);
  const fixture = stateFixtureFor(prototypeId, seed, attempt);
  const calculation = menCp011CalculationValues(measurementProfile, fixture);
  const answerUnit =
    prototypeId === "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME"
      ? measurementProfile.radialUnit
      : measurementProfile.heightUnit;
  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-011",
    permanentQlId: null,
    waveId: "MEN-CP-011-INVERSE-WAVE-01",
    prototypeId,
    solveMode: definition.solveMode,
    target: "LENGTH",
    seed,
    stateSelectionAttempt: attempt,
    difficulty: definition.difficulty,
    piPolicy,
    measurementProfileId: measurementProfile.id,
    measurementProfile,
    radialUnit: measurementProfile.radialUnit,
    heightUnit: measurementProfile.heightUnit,
    calculationUnit: measurementProfile.calculationUnit,
    volumeUnit: measurementProfile.volumeUnit,
    answerUnit,
    fixtureId: fixture.id,
    outerRadius: fixture.outerRadius,
    innerRadius: fixture.innerRadius,
    thickness: fixture.thickness,
    height: fixture.height,
    calculationOuterRadius: calculation.outerRadius,
    calculationInnerRadius: calculation.innerRadius,
    calculationThickness: calculation.thickness,
    calculationHeight: calculation.height,
    ringCoefficient: calculation.ringCoefficient,
    volumeCoefficient: calculation.volumeCoefficient,
    materialVolume: volumeFromCoefficient(piPolicy, calculation.volumeCoefficient),
    sourceMaturity: "BLUEPRINT_AND_EXISTING_RUNTIME_DERIVED_DIRECT_SOURCE_PENDING",
  };
}

function createStem(state: MenCp011InverseState) {
  const R = dimension(state.outerRadius, state.radialUnit);
  const r = dimension(state.innerRadius, state.radialUnit);
  const h = dimension(state.height, state.heightUnit);
  const V = formatWithUnit(state.materialVolume, state.volumeUnit);
  const policy = policySentence(state.piPolicy);
  const variants: Record<MenCp011InversePrototypeId, readonly string[]> = {
    "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME": [
      `A hollow pipe has outer radius ${R}, length ${h}, and material volume ${V}. Find its uniform wall thickness. ${policy}`,
      `The outside radius of a cylindrical tube is ${R} and its length is ${h}. If the metal used is ${V}, determine the wall thickness. ${policy}`,
      `A pipe of length ${h} has outer radius ${R}. Its material occupies ${V}. What is the radial thickness of the pipe wall? ${policy}`,
      `A cylindrical shell has outer radius ${R}, height ${h}, and material volume ${V}. Calculate its uniform thickness. ${policy}`,
      `The metal in a hollow cylinder has volume ${V}. If its outer radius is ${R} and length is ${h}, find the thickness of the wall. ${policy}`,
      `A tube with outer radius ${R} and length ${h} contains ${V} of material. Determine the difference between its outer and inner radii. ${policy}`,
      `The external radius and length of a pipe are ${R} and ${h}. Given that its metal volume is ${V}, find its wall thickness. ${policy}`,
      `A hollow cylindrical pipe uses ${V} of metal and is ${h} long. Its outer radius is ${R}. Find the uniform radial thickness. ${policy}`,
    ],
    "MEN-CP011-PROT-PIPE-LENGTH-FROM-MATERIAL-VOLUME": [
      `A hollow pipe has outer radius ${R}, inner radius ${r}, and material volume ${V}. Find its length. ${policy}`,
      `The outer and inner radii of a cylindrical tube are ${R} and ${r}. If the metal used is ${V}, determine the tube length. ${policy}`,
      `A pipe has outside radius ${R}, inside radius ${r}, and material volume ${V}. Calculate its length. ${policy}`,
      `The annular cross-section of a hollow cylinder has radii ${R} and ${r}. Its material volume is ${V}. Find the cylinder height. ${policy}`,
      `A cylindrical shell uses ${V} of material. If its outer radius is ${R} and inner radius is ${r}, determine its axial length. ${policy}`,
      `The metal volume of a pipe is ${V}; its external and internal radii are ${R} and ${r}. What is the pipe length? ${policy}`,
      `A hollow tube has radii ${R} and ${r} for its outer and inner surfaces. Given material volume ${V}, find its height. ${policy}`,
      `A pipe contains ${V} of metal between radii ${R} and ${r}. Determine the length of the pipe. ${policy}`,
    ],
  };
  return choose(
    variants[state.prototypeId],
    `inverse:stem:${state.prototypeId}:${state.seed}:${state.fixtureId}`,
  );
}

function candidatesFor(state: MenCp011InverseState): Candidate[] {
  if (state.prototypeId ===
    "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME") {
    return [
      {
        value: rational(state.thickness),
        misconceptionId: null,
        explanation: "",
      },
      {
        value: rational(state.innerRadius),
        misconceptionId: "RETURNED_INNER_RADIUS_INSTEAD_OF_THICKNESS",
        explanation:
          "stopping after finding the inner radius instead of subtracting it from the outer radius",
      },
      {
        value: rational(state.outerRadius),
        misconceptionId: "COPIED_OUTER_RADIUS_AS_THICKNESS",
        explanation:
          "copying the given outer radius without using the material-volume condition",
      },
      {
        value: rational(state.outerRadius + state.innerRadius),
        misconceptionId: "ADDED_RADII_FOR_WALL_THICKNESS",
        explanation:
          "adding the outer and inner radii instead of using the radial difference $R-r$",
      },
    ];
  }

  const heightFactor = state.measurementProfile.heightFactorToCalculationUnit;
  return [
    {
      value: rational(state.height),
      misconceptionId: null,
      explanation: "",
    },
    {
      value: rational(
        state.volumeCoefficient,
        state.calculationOuterRadius ** 2n * heightFactor,
      ),
      misconceptionId: "USED_OUTER_SOLID_CROSS_SECTION",
      explanation:
        "dividing by the complete outer circular area and ignoring the central void",
    },
    {
      value: rational(
        state.volumeCoefficient,
        state.calculationInnerRadius ** 2n * heightFactor,
      ),
      misconceptionId: "USED_INNER_VOID_CROSS_SECTION",
      explanation:
        "dividing by the inner circular void area instead of the annular material area",
    },
    {
      value: rational(
        state.volumeCoefficient,
        state.calculationThickness ** 2n * heightFactor,
      ),
      misconceptionId: "USED_THICKNESS_SQUARED_AS_ANNULAR_AREA",
      explanation:
        "using $(R-r)^2$ in place of the required difference of squares $R^2-r^2$",
    },
  ];
}

function createOptions(
  state: MenCp011InverseState,
  constraints: MenCp011InverseGenerationConstraints,
) {
  const candidates = candidatesFor(state);
  const keys = candidates.map((candidate) => exactKey(candidate.value));
  if (new Set(keys).size !== 4) return null;
  const correct = candidates[0]!;
  const wrong = candidates.slice(1);
  const correctIndex = constraints.correctIndex ??
    (hashText(`inverse:option:${state.prototypeId}:${state.seed}`) % 4);
  const ordered = [...wrong];
  ordered.splice(correctIndex, 0, correct);
  const explanationByKey = new Map(
    candidates.map((candidate) => [exactKey(candidate.value), candidate.explanation]),
  );
  const options: MenCp011InverseOption[] = ordered.map((candidate, index) => ({
    label: LABELS[index]!,
    value: candidate.value,
    display: formatWithUnit(candidate.value, state.answerUnit),
    isCorrect: candidate.misconceptionId === null,
    misconceptionId: candidate.misconceptionId,
  }));
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

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function labelBox(
  x: number,
  y: number,
  width: number,
  text: string,
  fill = "#173c7a",
) {
  return `<g data-label-placement="detached"><rect x="${x}" y="${y}" width="${width}" height="26" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="1.2"/><text x="${x + width / 2}" y="${y + 18}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="${fill}">${escapeXml(text)}</text></g>`;
}

function plainVolume(state: MenCp011InverseState) {
  return `V = ${formatExactPlain(state.materialVolume)} ${state.volumeUnit}`;
}

function createDiagram(
  state: MenCp011InverseState,
  role: DiagramRole,
): MenCp011InverseDiagram {
  const thicknessQuestion = state.prototypeId ===
    "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME";
  const targetHidden = role === "PROMPT";
  const outerLabel = `R = ${state.outerRadius} ${state.radialUnit}`;
  const innerLabel = thicknessQuestion
    ? targetHidden
      ? "r = ?"
      : `r = ${state.innerRadius} ${state.radialUnit}`
    : `r = ${state.innerRadius} ${state.radialUnit}`;
  const thicknessLabel = thicknessQuestion
    ? targetHidden
      ? "t = ?"
      : `t = ${state.thickness} ${state.radialUnit}`
    : `t = ${state.thickness} ${state.radialUnit}`;
  const heightLabel = thicknessQuestion
    ? `h = ${state.height} ${state.heightUnit}`
    : targetHidden
      ? "h = ?"
      : `h = ${state.height} ${state.heightUnit}`;
  const volumeLabel = plainVolume(state);
  const markerId = `inverse-arrow-${hashText(`${state.prototypeId}:${state.seed}:${role}`)}`;
  const svg = `<svg viewBox="0 0 720 430" role="img" aria-label="Prompt-safe hollow pipe inverse diagram" style="width:100%;height:auto" data-diagram-version="TUBE_EXAMTREE_INVERSE_V1" data-diagram-role="${role}" data-responsive="true" data-background="white" data-scope="centre-connected" data-target="${thicknessQuestion ? "THICKNESS" : "LENGTH"}" data-target-hidden="${targetHidden}">
  <defs><marker id="${markerId}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 Z" fill="#1d4ed8"/></marker></defs>
  <rect x="0" y="0" width="720" height="430" fill="#ffffff"/>
  <text x="360" y="22" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">concept sketch · not to scale</text>
  <g data-view="single-closed-tube" data-object="hollow-cylinder" data-closure="uncut-wall">
    <ellipse data-region="top-outer-ellipse" cx="300" cy="120" rx="135" ry="42" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    <ellipse data-region="top-inner-ellipse" cx="300" cy="120" rx="80" ry="25" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    <line data-region="outer-left-wall" x1="165" y1="120" x2="165" y2="300" stroke="#111827" stroke-width="3"/>
    <line data-region="outer-right-wall" x1="435" y1="120" x2="435" y2="300" stroke="#111827" stroke-width="3"/>
    <line data-region="hidden-inner-left-wall" x1="220" y1="124" x2="220" y2="300" stroke="#4b5563" stroke-width="2.2" stroke-dasharray="9 7"/>
    <line data-region="hidden-inner-right-wall" x1="380" y1="124" x2="380" y2="300" stroke="#4b5563" stroke-width="2.2" stroke-dasharray="9 7"/>
    <ellipse data-region="bottom-outer-ellipse" cx="300" cy="300" rx="135" ry="42" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    <ellipse data-region="bottom-inner-hidden-ellipse" cx="300" cy="300" rx="80" ry="25" fill="none" stroke="#4b5563" stroke-width="2.2" stroke-dasharray="9 7"/>
    <circle data-role="top-centre" cx="300" cy="120" r="4" fill="#1d4ed8"/>
    <text x="286" y="111" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#173c7a">O</text>
  </g>
  <g data-region="dimensions" stroke="#1d4ed8" stroke-width="2.4" fill="none">
    <line data-dimension="outer-radius" data-orientation="centre-connected" x1="300" y1="120" x2="427" y2="106" marker-end="url(#${markerId})"/>
    <line data-dimension="inner-radius" data-orientation="centre-connected" x1="300" y1="120" x2="366" y2="106" marker-end="url(#${markerId})"/>
    <line data-dimension="wall-thickness" data-orientation="radial" data-alignment="top-rim" x1="235" y1="106" x2="189" y2="96" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
    <line data-dimension="pipe-length" data-orientation="vertical" x1="520" y1="120" x2="520" y2="300" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
    <line x1="435" y1="120" x2="520" y2="120" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="4 4"/>
    <line x1="435" y1="300" x2="520" y2="300" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="4 4"/>
  </g>
  ${labelBox(356, 56, 150, outerLabel)}
  ${labelBox(305, 142, 130, innerLabel)}
  ${labelBox(88, 52, 125, thicknessLabel)}
  ${labelBox(545, 196, 135, heightLabel)}
  ${labelBox(58, 350, 260, volumeLabel, "#0f766e")}
  <g data-region="variable-legend"><rect x="350" y="350" width="305" height="38" rx="8" fill="#ffffff" stroke="#1d4ed8" stroke-width="1.6"/><text x="502" y="374" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" fill="#111827">R outer radius · r inner radius · t wall thickness · h length</text></g>
</svg>`;
  const accessibleText = thicknessQuestion
    ? targetHidden
      ? `A hollow pipe with outer radius ${state.outerRadius} ${state.radialUnit}, length ${state.height} ${state.heightUnit}, and given material volume. The inner radius and wall thickness are unknown in the prompt.`
      : `A hollow pipe with outer radius ${state.outerRadius} ${state.radialUnit}, inner radius ${state.innerRadius} ${state.radialUnit}, wall thickness ${state.thickness} ${state.radialUnit}, and length ${state.height} ${state.heightUnit}.`
    : targetHidden
      ? `A hollow pipe with outer radius ${state.outerRadius} ${state.radialUnit}, inner radius ${state.innerRadius} ${state.radialUnit}, and given material volume. Its length is unknown in the prompt.`
      : `A hollow pipe with outer radius ${state.outerRadius} ${state.radialUnit}, inner radius ${state.innerRadius} ${state.radialUnit}, and length ${state.height} ${state.heightUnit}.`;
  return {
    kind: "HOLLOW_PIPE_INVERSE",
    svg,
    accessibleText,
    visibleLabels: [
      outerLabel,
      innerLabel,
      thicknessLabel,
      heightLabel,
      volumeLabel,
    ],
    notToScale: true,
  };
}

function coefficientStep(state: MenCp011InverseState) {
  return state.piPolicy === "EXACT_PI"
    ? `Since the material volume is ${formatWithUnit(state.materialVolume, state.volumeUnit)}, remove the common $\\pi$ factor to get $h(R^2-r^2)=${state.volumeCoefficient}$.`
    : `Divide the given material volume by $\\frac{22}{7}$ to get $h(R^2-r^2)=${state.volumeCoefficient}$.`;
}

function conversionSteps(state: MenCp011InverseState) {
  if (!state.measurementProfile.mixedUnits) return [];
  if (state.measurementProfile.conversionFocus ===
    "CONVERT_HEIGHT_M_TO_CM") {
    return state.prototypeId ===
      "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME"
      ? [`Convert the given length: $${state.height}\\text{ m}=${state.calculationHeight}\\text{ cm}$, because the volume is in cubic centimetres.`]
      : ["Use centimetres in the volume equation. The recovered length is first obtained in centimetres and then converted to metres."];
  }
  return [
    `Convert both radii from metres to centimetres before squaring: $R=${state.calculationOuterRadius}\\text{ cm}$ and $r=${state.calculationInnerRadius}\\text{ cm}$.`,
  ];
}

function buildLearnerSolution(
  state: MenCp011InverseState,
  exactAnswer: ExactValue,
  traps: string[],
): MenCp011InverseLearnerSolution {
  const calculations = menCp011CalculationValues(state.measurementProfile, {
    outerRadius: state.outerRadius,
    innerRadius: state.innerRadius,
    height: state.height,
    thickness: state.thickness,
    outerDiameter: 2n * state.outerRadius,
    innerDiameter: 2n * state.innerRadius,
  });
  if (state.prototypeId ===
    "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME") {
    const ringPerUnitLength = state.volumeCoefficient / state.calculationHeight;
    const radialFactor = state.measurementProfile.radialFactorToCalculationUnit;
    const radiusRecovery = radialFactor === 1n
      ? `Thus $r^2=${state.calculationOuterRadius}^2-${ringPerUnitLength}=${state.calculationInnerRadius ** 2n}$, so $r=${state.innerRadius}\\text{ ${state.radialUnit}}$.`
      : `Thus $r^2=${state.calculationOuterRadius}^2-${ringPerUnitLength}=${state.calculationInnerRadius ** 2n}$, so $r=${state.calculationInnerRadius}\\text{ cm}=${state.innerRadius}\\text{ m}$.`;
    return {
      formula:
        "Use $V=\\pi h(R^2-r^2)$ to recover the inner radius, then use $t=R-r$.",
      steps: [
        ...conversionSteps(state),
        coefficientStep(state),
        `Divide by the calculation length: $R^2-r^2=${state.volumeCoefficient}\\div${state.calculationHeight}=${ringPerUnitLength}$.`,
        radiusRecovery,
        `Therefore $t=R-r=${state.outerRadius}-${state.innerRadius}=${state.thickness}\\text{ ${state.radialUnit}}$.`,
      ],
      finalAnswer: formatWithUnit(exactAnswer, state.answerUnit),
      shortcut:
        "After removing $\\pi$, first find the annular area coefficient per unit length. Recover $r$ from the difference of squares, then subtract from $R$.",
      wrongOptionAnalysis: traps,
    };
  }

  const recoveredCalculationHeight =
    state.volumeCoefficient / state.ringCoefficient;
  const heightRecovery = state.measurementProfile.heightFactorToCalculationUnit === 1n
    ? `Hence $h=${recoveredCalculationHeight}\\text{ ${state.heightUnit}}$.`
    : `Hence $h=${recoveredCalculationHeight}\\text{ cm}=${state.height}\\text{ m}$.`;
  return {
    formula:
      "Use $V=\\pi h(R^2-r^2)$, so $h=\\dfrac{V}{\\pi(R^2-r^2)}$.",
    steps: [
      ...conversionSteps(state),
      `The annular cross-section coefficient is $R^2-r^2=${calculations.outerRadius}^2-${calculations.innerRadius}^2=${state.ringCoefficient}$.`,
      coefficientStep(state),
      `Therefore the calculation-unit length is $h=${state.volumeCoefficient}\\div${state.ringCoefficient}=${recoveredCalculationHeight}$.`,
      heightRecovery,
    ],
    finalAnswer: formatWithUnit(exactAnswer, state.answerUnit),
    shortcut:
      "Remove the declared $\\pi$ factor from the volume, then divide by the annular area coefficient $R^2-r^2$.",
    wrongOptionAnalysis: traps,
  };
}

function verifyState(
  state: MenCp011InverseState,
  answer: ExactValue,
) {
  if (answer.kind !== "RATIONAL" || answer.denominator !== 1n) {
    return {
      valid: false,
      method: "integer candidate substitution",
      reconstructed: "NON_INTEGRAL_CANDIDATE",
    };
  }
  let reconstructedCoefficient: bigint;
  let method: string;
  if (state.prototypeId ===
    "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME") {
    const candidateThickness =
      answer.numerator * state.measurementProfile.radialFactorToCalculationUnit;
    const candidateInnerRadius =
      state.calculationOuterRadius - candidateThickness;
    reconstructedCoefficient =
      state.calculationHeight *
      (state.calculationOuterRadius ** 2n - candidateInnerRadius ** 2n);
    method =
      "substituted the candidate thickness into r=R-t and reconstructed the material volume";
  } else {
    const candidateHeight =
      answer.numerator * state.measurementProfile.heightFactorToCalculationUnit;
    reconstructedCoefficient = state.ringCoefficient * candidateHeight;
    method =
      "substituted the candidate length into the annular-prism volume formula";
  }
  const reconstructed = volumeFromCoefficient(
    state.piPolicy,
    reconstructedCoefficient,
  );
  return {
    valid: exactEquals(reconstructed, state.materialVolume),
    method,
    reconstructed: exactKey(reconstructed),
  };
}

function learnerText(
  stem: string,
  options: readonly MenCp011InverseOption[],
  solution: MenCp011InverseLearnerSolution,
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
  question: Omit<MenCp011InversePackage, "validation">,
) {
  const text = learnerText(
    question.stem,
    question.options,
    question.learnerSolution,
  );
  const thicknessQuestion = question.prototypeId ===
    "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME";
  const targetHidden = thicknessQuestion
    ? question.diagram.svg.includes("t = ?") &&
      !question.diagram.svg.includes(
        `t = ${question.state.thickness} ${question.state.radialUnit}`,
      )
    : question.diagram.svg.includes("h = ?") &&
      !question.diagram.svg.includes(
        `h = ${question.state.height} ${question.state.heightUnit}`,
      );
  const targetRevealed = thicknessQuestion
    ? question.solutionDiagram.svg.includes(
        `t = ${question.state.thickness} ${question.state.radialUnit}`,
      )
    : question.solutionDiagram.svg.includes(
        `h = ${question.state.height} ${question.state.heightUnit}`,
      );
  const checks = [
    {
      name: "independent verifier",
      passed: question.verification.valid,
      message: "Substituting the recovered dimension must reproduce the given material volume.",
    },
    {
      name: "four unique options",
      passed:
        question.options.length === 4 &&
        new Set(question.options.map((option) => exactKey(option.value))).size === 4,
      message: "Exactly four exact-value-distinct length options are required.",
    },
    {
      name: "one correct option",
      passed:
        question.options.filter((option) => option.isCorrect).length === 1 &&
        question.options[question.correctIndex]?.isCorrect === true,
      message: "Exactly one option must be correct and the stored index must identify it.",
    },
    {
      name: "prompt-safe target",
      passed: targetHidden && targetRevealed,
      message: "The prompt diagram must hide the requested value and the solution diagram must reveal it.",
    },
    {
      name: "centre-connected geometry",
      passed:
        question.diagram.svg.includes('data-role="top-centre"') &&
        question.diagram.svg.includes('data-orientation="centre-connected"') &&
        question.diagram.svg.includes('data-label-placement="detached"') &&
        !question.diagram.svg.includes("radius-vertical-guide"),
      message: "Radius guides must start at centre O and labels must remain detached from measurement lines.",
    },
    {
      name: "text-complete attempt",
      passed:
        question.renderSurfaces.attempt.diagram === null &&
        question.stem.includes(question.state.outerRadius.toString()) &&
        question.stem.includes(formatWithUnit(
          question.state.materialVolume,
          question.state.volumeUnit,
        )),
      message: "Attempt mode must remain fully solvable without a diagram.",
    },
    {
      name: "mixed-unit reasoning",
      passed:
        !question.state.measurementProfile.mixedUnits ||
        question.learnerSolution.steps.some((step) => /Convert|converted/i.test(step)),
      message: "Mixed-unit questions must state the required conversion before or after inverse recovery.",
    },
    {
      name: "learner text safety",
      passed:
        !/MEN-CP011-PROT|misconceptionId|FALLBACK_|UNCLASSIFIED/.test(text) &&
        !/\[[A-Z0-9_]+\]/.test(text) &&
        !text.includes("\\pih") &&
        !/=\$[^$]+\$\$$/.test(text) &&
        (text.match(/\$/g) ?? []).length % 2 === 0,
      message: "Learner text must hide internal codes and use balanced, non-nested MathJax delimiters.",
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
      message: "Inverse discovery packages must remain outside every production surface.",
    },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp011InverseQuestion(
  prototypeId: MenCp011InversePrototypeId,
  seed: string,
  constraints: MenCp011InverseGenerationConstraints = {},
): MenCp011InversePackage {
  for (let attempt = 0; attempt < 256; attempt += 1) {
    const state = createState(prototypeId, seed, constraints, attempt);
    const optionPackage = createOptions(state, constraints);
    if (!optionPackage) continue;
    const stem = createStem(state);
    const exactAnswer =
      prototypeId === "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME"
        ? rational(state.thickness)
        : rational(state.height);
    const diagram = createDiagram(state, "PROMPT");
    const solutionDiagram = createDiagram(state, "SOLUTION");
    const learnerSolution = buildLearnerSolution(
      state,
      exactAnswer,
      optionPackage.traps,
    );
    const verification = verifyState(state, exactAnswer);
    const partial = {
      packageId: "MEN-002" as const,
      canonicalProblemId: "MEN-CP-011" as const,
      permanentQlId: null,
      waveId: "MEN-CP-011-INVERSE-WAVE-01" as const,
      prototypeId,
      solveMode: state.solveMode,
      language: "en" as const,
      seed,
      difficulty: state.difficulty,
      target: "LENGTH" as const,
      piPolicy: state.piPolicy,
      unit: state.answerUnit,
      measurementAuthority: "MEN-CP011-PHASE2B-UNIT-REPRESENTATION-V1" as const,
      statePoolAuthority: MEN_CP011_STATE_POOL_AUTHORITY,
      inverseAuthority: MEN_CP011_INVERSE_THICKNESS_LENGTH_AUTHORITY,
      sourceMaturity: state.sourceMaturity,
      stem,
      options: optionPackage.options,
      correctIndex: optionPackage.correctIndex,
      answer: optionPackage.options[optionPackage.correctIndex]!.display,
      exactAnswer,
      optionPermutationSeed: `MEN-CP011-INVERSE-OPTION-V1|${prototypeId}|${seed}`,
      state,
      diagram,
      solutionDiagram,
      learnerSolution,
      explanation: {
        keyRule: learnerSolution.formula,
        steps: learnerSolution.steps.map((body, index) => ({
          title:
            index === 0
              ? "Prepare the Units and Formula"
              : index === learnerSolution.steps.length - 1
                ? "State the Required Dimension"
                : "Recover the Unknown Dimension",
          body,
        })),
        shortcut: learnerSolution.shortcut,
        traps: optionPackage.traps,
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
          diagramPolicy: "OPTIONAL_PROMPT_SAFE_INVERSE_DIAGRAM" as const,
          exposesInternalCodes: false as const,
        },
        solution: {
          diagram: solutionDiagram,
          explanation: learnerSolution,
          exposesInternalCodes: false as const,
        },
        admin: {
          diagram: solutionDiagram,
          trapCodes: optionPackage.trapCodes,
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
    const validation = validatePackage(partial);
    if (!validation.valid) {
      const failed = validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join(" | ");
      throw new Error(`${prototypeId} failed validation for ${seed}: ${failed}`);
    }
    return { ...partial, validation };
  }
  throw new Error(
    `${prototypeId} could not find a deterministic state with four distinct exact options for ${seed}.`,
  );
}

function normalizedStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\s+/g, " ")
    .trim();
}

function physicalStateKey(question: MenCp011InversePackage) {
  return question.state.fixtureId;
}

function questionOptionKey(question: MenCp011InversePackage) {
  return [question.stem, ...question.options.map((option) => option.display)].join("\n");
}

export interface MenCp011InverseBatchAudit {
  authority: typeof MEN_CP011_INVERSE_THICKNESS_LENGTH_AUTHORITY;
  recordCount: number;
  prototypeCount: number;
  exactStemCount: number;
  exactQuestionOptionCount: number;
  normalizedStemGroupCount: number;
  maximumNormalizedStemRepetition: number;
  uniquePhysicalStateCount: number;
  answerPositionCounts: Record<Label, number>;
  measurementProfileCounts: Record<string, number>;
  piPolicyCounts: Record<MenCp011PiPolicy, number>;
  prototypeProfilePiCounts: Record<string, number>;
  resolvedDiscoveryCandidates: readonly MenCp011InversePrototypeId[];
  blockers: readonly string[];
  publicationEligible: false;
}

export function auditMenCp011InverseBatch(
  records: readonly MenCp011InversePackage[],
): MenCp011InverseBatchAudit {
  const answerPositionCounts = { A: 0, B: 0, C: 0, D: 0 };
  const measurementProfileCounts: Record<string, number> = {};
  const piPolicyCounts: Record<MenCp011PiPolicy, number> = {
    EXACT_PI: 0,
    PI_22_OVER_7: 0,
  };
  const prototypeProfilePiCounts: Record<string, number> = {};
  const normalizedCounts = new Map<string, number>();
  for (const question of records) {
    const label = question.options[question.correctIndex]!.label;
    answerPositionCounts[label] += 1;
    measurementProfileCounts[question.state.measurementProfileId] =
      (measurementProfileCounts[question.state.measurementProfileId] ?? 0) + 1;
    piPolicyCounts[question.piPolicy] += 1;
    const cell = [
      question.prototypeId,
      question.state.measurementProfileId,
      question.piPolicy,
    ].join("|");
    prototypeProfilePiCounts[cell] =
      (prototypeProfilePiCounts[cell] ?? 0) + 1;
    const normalized = normalizedStem(question.stem);
    normalizedCounts.set(normalized, (normalizedCounts.get(normalized) ?? 0) + 1);
  }
  return {
    authority: MEN_CP011_INVERSE_THICKNESS_LENGTH_AUTHORITY,
    recordCount: records.length,
    prototypeCount: getMenCp011InversePrototypeIds().length,
    exactStemCount: new Set(records.map((question) => question.stem)).size,
    exactQuestionOptionCount: new Set(records.map(questionOptionKey)).size,
    normalizedStemGroupCount: normalizedCounts.size,
    maximumNormalizedStemRepetition: Math.max(...normalizedCounts.values()),
    uniquePhysicalStateCount: new Set(records.map(physicalStateKey)).size,
    answerPositionCounts,
    measurementProfileCounts,
    piPolicyCounts,
    prototypeProfilePiCounts,
    resolvedDiscoveryCandidates: getMenCp011InversePrototypeIds(),
    blockers: [
      "DIRECT_SOURCE_NORMALISATION_PENDING",
      "MANUAL_ENGLISH_REVIEW_PENDING",
      "CHAPTER_COVERAGE_INCOMPLETE",
      "PERMANENT_QLS_UNALLOCATED",
    ],
    publicationEligible: false,
  };
}

export function generateMenCp011InverseReviewBatch(
  seedNamespace = "men-cp011-inverse-thickness-length-wave01-review-v1",
  recordsPerPrototype = 16,
) {
  if (recordsPerPrototype !== 16) {
    throw new Error("Inverse Wave 01 requires exactly 16 review records per prototype.");
  }
  const profiles = getMenCp011MeasurementProfiles().flatMap(
    (measurementProfile) => ([
      { measurementProfileId: measurementProfile.id, piPolicy: "EXACT_PI" as const },
      { measurementProfileId: measurementProfile.id, piPolicy: "PI_22_OVER_7" as const },
    ]),
  );
  const positionSequences = [
    [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3],
    [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0],
  ] as const;
  const records: MenCp011InversePackage[] = [];
  const usedStates = new Set<string>();
  const usedStems = new Set<string>();
  const usedQuestionOptions = new Set<string>();
  const normalizedCounts = new Map<string, number>();

  getMenCp011InversePrototypeIds().forEach((prototypeId, prototypeIndex) => {
    for (let sampleIndex = 0; sampleIndex < recordsPerPrototype; sampleIndex += 1) {
      const profile = profiles[sampleIndex % profiles.length]!;
      const correctIndex = positionSequences[prototypeIndex]![sampleIndex]! as
        0 | 1 | 2 | 3;
      let accepted: MenCp011InversePackage | null = null;
      for (let attempt = 0; attempt < 4096; attempt += 1) {
        const candidate = generateMenCp011InverseQuestion(
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
  });

  const audit = auditMenCp011InverseBatch(records);
  if (audit.recordCount !== 32 || audit.uniquePhysicalStateCount !== 32) {
    throw new Error("Inverse Wave 01 requires 32 records using 32 distinct physical states.");
  }
  if (audit.exactStemCount !== 32 || audit.exactQuestionOptionCount !== 32) {
    throw new Error("Inverse Wave 01 review records must be exact-package unique.");
  }
  if (audit.maximumNormalizedStemRepetition > 4) {
    throw new Error("An inverse normalized stem may not appear more than four times.");
  }
  if (!Object.values(audit.answerPositionCounts).every((count) => count === 8)) {
    throw new Error("The 32-record inverse batch must balance A, B, C and D at eight each.");
  }
  if (!Object.values(audit.measurementProfileCounts).every((count) => count === 8)) {
    throw new Error("Each measurement profile must appear eight times across the inverse batch.");
  }
  if (!Object.values(audit.piPolicyCounts).every((count) => count === 16)) {
    throw new Error("Exact pi and declared 22/7 must each appear sixteen times.");
  }
  if (!Object.values(audit.prototypeProfilePiCounts).every((count) => count === 2)) {
    throw new Error("Each prototype/profile/pi cell must contain exactly two records.");
  }
  return { records, audit };
}
