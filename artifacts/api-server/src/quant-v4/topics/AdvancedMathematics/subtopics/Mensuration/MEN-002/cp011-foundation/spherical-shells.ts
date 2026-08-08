import {
  exactEquals,
  exactKey,
  formatExactPlain,
  formatWithUnit,
  pi,
  rational,
} from "../foundation/exact";
import type { ExactValue, Men002Difficulty } from "../foundation/types";

export const MEN_CP011_SPHERICAL_SHELLS_AUTHORITY =
  "MEN-CP011-SPHERICAL-SHELLS-WAVE-01-V1" as const;

export type MenCp011ShellPrototypeId =
  | "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME"
  | "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME";

export type MenCp011ShellSolveMode =
  | "findSphericalShellMaterialVolume"
  | "findHemisphericalShellMaterialVolume";

export type MenCp011ShellPiPolicy =
  | "EXACT_PI"
  | "PI_22_OVER_7"
  | "PI_3_14";

export type MenCp011ShellLinearUnit = "cm" | "m";
export type MenCp011ShellVolumeUnit = "cm³" | "m³";
type Label = "A" | "B" | "C" | "D";
type DiagramRole = "PROMPT" | "SOLUTION";

interface ShellFixture {
  id: string;
  outerRadius: bigint;
  innerRadius: bigint;
}

const SHELL_FIXTURES: readonly ShellFixture[] = [
  { id: "SH-01", outerRadius: 5n, innerRadius: 3n },
  { id: "SH-02", outerRadius: 6n, innerRadius: 4n },
  { id: "SH-03", outerRadius: 7n, innerRadius: 5n },
  { id: "SH-04", outerRadius: 8n, innerRadius: 6n },
  { id: "SH-05", outerRadius: 9n, innerRadius: 6n },
  { id: "SH-06", outerRadius: 10n, innerRadius: 7n },
  { id: "SH-07", outerRadius: 12n, innerRadius: 8n },
  { id: "SH-08", outerRadius: 14n, innerRadius: 10n },
] as const;

export interface MenCp011ShellDefinition {
  prototypeId: MenCp011ShellPrototypeId;
  solveMode: MenCp011ShellSolveMode;
  shape: "SPHERE" | "HEMISPHERE";
  difficulty: Men002Difficulty;
  formulaFactorNumerator: 4n | 2n;
}

export const MEN_CP011_SHELL_PROTOTYPES: readonly MenCp011ShellDefinition[] = [
  {
    prototypeId: "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME",
    solveMode: "findSphericalShellMaterialVolume",
    shape: "SPHERE",
    difficulty: "Hard",
    formulaFactorNumerator: 4n,
  },
  {
    prototypeId: "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME",
    solveMode: "findHemisphericalShellMaterialVolume",
    shape: "HEMISPHERE",
    difficulty: "Hard",
    formulaFactorNumerator: 2n,
  },
] as const;

const DEFINITION_BY_ID = new Map(
  MEN_CP011_SHELL_PROTOTYPES.map((definition) => [
    definition.prototypeId,
    definition,
  ]),
);

export function getMenCp011ShellPrototypeIds() {
  return MEN_CP011_SHELL_PROTOTYPES.map((definition) => definition.prototypeId);
}

export function getMenCp011ShellDefinition(
  prototypeId: MenCp011ShellPrototypeId,
) {
  const definition = DEFINITION_BY_ID.get(prototypeId);
  if (!definition) {
    throw new Error(`Unknown MEN-CP-011 shell prototype ${prototypeId}.`);
  }
  return definition;
}

export interface MenCp011ShellState {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-SPHERICAL-SHELLS-WAVE-01";
  prototypeId: MenCp011ShellPrototypeId;
  solveMode: MenCp011ShellSolveMode;
  target: "VOLUME";
  shape: "SPHERE" | "HEMISPHERE";
  seed: string;
  stateSelectionAttempt: number;
  difficulty: Men002Difficulty;
  piPolicy: MenCp011ShellPiPolicy;
  unit: MenCp011ShellLinearUnit;
  volumeUnit: MenCp011ShellVolumeUnit;
  fixtureId: string;
  outerRadius: bigint;
  innerRadius: bigint;
  thickness: bigint;
  outerCube: bigint;
  innerCube: bigint;
  cubeDifference: bigint;
  formulaFactorNumerator: 4n | 2n;
  materialVolume: ExactValue;
  sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING";
}

export interface MenCp011ShellOption {
  label: Label;
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp011ShellDiagram {
  kind: "SPHERICAL_SHELL" | "HEMISPHERICAL_SHELL";
  svg: string;
  accessibleText: string;
  visibleLabels: readonly string[];
  notToScale: true;
}

export interface MenCp011ShellLearnerSolution {
  formula: string;
  steps: string[];
  finalAnswer: string;
  shortcut: string;
  wrongOptionAnalysis: string[];
}

export interface MenCp011ShellPackage {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-SPHERICAL-SHELLS-WAVE-01";
  prototypeId: MenCp011ShellPrototypeId;
  solveMode: MenCp011ShellSolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: "VOLUME";
  piPolicy: MenCp011ShellPiPolicy;
  unit: MenCp011ShellVolumeUnit;
  shellAuthority: typeof MEN_CP011_SPHERICAL_SHELLS_AUTHORITY;
  sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING";
  stem: string;
  options: MenCp011ShellOption[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  optionPermutationSeed: string;
  state: MenCp011ShellState;
  diagram: MenCp011ShellDiagram;
  solutionDiagram: MenCp011ShellDiagram;
  learnerSolution: MenCp011ShellLearnerSolution;
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
      diagram: MenCp011ShellDiagram;
      diagramPolicy: "OPTIONAL_PROMPT_SAFE_SHELL_DIAGRAM";
      exposesInternalCodes: false;
    };
    solution: {
      diagram: MenCp011ShellDiagram;
      explanation: MenCp011ShellLearnerSolution;
      exposesInternalCodes: false;
    };
    admin: {
      diagram: MenCp011ShellDiagram;
      trapCodes: string[];
      verification: MenCp011ShellPackage["verification"];
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

export interface MenCp011ShellGenerationConstraints {
  unit?: MenCp011ShellLinearUnit;
  piPolicy?: MenCp011ShellPiPolicy;
  fixtureIndex?: number;
  correctIndex?: 0 | 1 | 2 | 3;
}

interface Candidate {
  value: ExactValue;
  misconceptionId: string | null;
  explanation: string;
}

const LABELS: readonly Label[] = ["A", "B", "C", "D"];
const PI_POLICIES: readonly MenCp011ShellPiPolicy[] = [
  "EXACT_PI",
  "PI_22_OVER_7",
  "PI_3_14",
];

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

function volumeUnitFor(unit: MenCp011ShellLinearUnit): MenCp011ShellVolumeUnit {
  return unit === "cm" ? "cm³" : "m³";
}

function dimension(value: bigint, unit: MenCp011ShellLinearUnit) {
  return `$${value}\\text{ ${unit}}$`;
}

function policyVolume(
  policy: MenCp011ShellPiPolicy,
  coefficientNumerator: bigint,
  coefficientDenominator: bigint,
): ExactValue {
  if (policy === "EXACT_PI") {
    return pi(coefficientNumerator, coefficientDenominator);
  }
  if (policy === "PI_22_OVER_7") {
    return rational(
      coefficientNumerator * 22n,
      coefficientDenominator * 7n,
    );
  }
  return rational(
    coefficientNumerator * 157n,
    coefficientDenominator * 50n,
  );
}

function policySentence(policy: MenCp011ShellPiPolicy) {
  if (policy === "EXACT_PI") return "Leave $\\pi$ in exact form.";
  if (policy === "PI_22_OVER_7") return "Use $\\pi=\\frac{22}{7}$.";
  return "Use $\\pi=3.14$ exactly as stated.";
}

function createState(
  prototypeId: MenCp011ShellPrototypeId,
  seed: string,
  constraints: MenCp011ShellGenerationConstraints,
  attempt: number,
): MenCp011ShellState {
  const definition = getMenCp011ShellDefinition(prototypeId);
  const fixtureIndex = constraints.fixtureIndex === undefined
    ? hashText(`${MEN_CP011_SPHERICAL_SHELLS_AUTHORITY}|fixture|${prototypeId}|${seed}|${attempt}`) % SHELL_FIXTURES.length
    : ((constraints.fixtureIndex % SHELL_FIXTURES.length) + SHELL_FIXTURES.length) % SHELL_FIXTURES.length;
  const fixture = SHELL_FIXTURES[fixtureIndex]!;
  const unit = constraints.unit ??
    (hashText(`${MEN_CP011_SPHERICAL_SHELLS_AUTHORITY}|unit|${prototypeId}|${seed}|${attempt}`) % 2 === 0
      ? "cm"
      : "m");
  const piPolicy = constraints.piPolicy ??
    PI_POLICIES[
      hashText(`${MEN_CP011_SPHERICAL_SHELLS_AUTHORITY}|pi|${prototypeId}|${seed}|${attempt}`) % PI_POLICIES.length
    ]!;
  const outerCube = fixture.outerRadius ** 3n;
  const innerCube = fixture.innerRadius ** 3n;
  const cubeDifference = outerCube - innerCube;
  const materialVolume = policyVolume(
    piPolicy,
    definition.formulaFactorNumerator * cubeDifference,
    3n,
  );

  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-011",
    permanentQlId: null,
    waveId: "MEN-CP-011-SPHERICAL-SHELLS-WAVE-01",
    prototypeId,
    solveMode: definition.solveMode,
    target: "VOLUME",
    shape: definition.shape,
    seed,
    stateSelectionAttempt: attempt,
    difficulty: definition.difficulty,
    piPolicy,
    unit,
    volumeUnit: volumeUnitFor(unit),
    fixtureId: fixture.id,
    outerRadius: fixture.outerRadius,
    innerRadius: fixture.innerRadius,
    thickness: fixture.outerRadius - fixture.innerRadius,
    outerCube,
    innerCube,
    cubeDifference,
    formulaFactorNumerator: definition.formulaFactorNumerator,
    materialVolume,
    sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING",
  };
}

function createStem(state: MenCp011ShellState) {
  const R = dimension(state.outerRadius, state.unit);
  const r = dimension(state.innerRadius, state.unit);
  const policy = policySentence(state.piPolicy);
  const variants: Record<MenCp011ShellPrototypeId, readonly string[]> = {
    "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME": [
      `A hollow spherical shell has outer radius ${R} and inner radius ${r}. Find the volume of material used. ${policy}`,
      `The external and internal radii of a hollow sphere are ${R} and ${r}. Calculate the volume of its material. ${policy}`,
      `A metal spherical shell has radii ${R} and ${r} at its outer and inner surfaces. Determine the metal volume. ${policy}`,
      `A hollow ball has outside radius ${R} and inside radius ${r}. What volume of material forms the shell? ${policy}`,
      `The outer radius of a spherical casing is ${R}, while its inner radius is ${r}. Find outer volume minus inner void volume. ${policy}`,
      `A closed hollow sphere has outer radius ${R} and inner radius ${r}. Calculate the volume occupied by the shell material. ${policy}`,
      `A spherical metal shell surrounds an empty spherical space of radius ${r}; its outer radius is ${R}. Find the material volume. ${policy}`,
      `A hollow spherical vessel has external radius ${R} and internal radius ${r}. Determine the volume of its wall material. ${policy}`,
    ],
    "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME": [
      `A hollow hemispherical shell has outer radius ${R} and inner radius ${r}. Find the volume of material used. ${policy}`,
      `The external and internal radii of a hemispherical bowl are ${R} and ${r}. Calculate the volume of its material. ${policy}`,
      `A thick hemispherical shell has outer radius ${R} and inner radius ${r}. Determine the material volume. ${policy}`,
      `A hollow half-sphere has outside radius ${R} and inside radius ${r}. What volume of material forms it? ${policy}`,
      `The outer radius of a hemispherical casing is ${R}, while the inner radius is ${r}. Find its shell volume. ${policy}`,
      `A solid hemispherical layer surrounds an empty hemispherical space of radius ${r}; its outer radius is ${R}. Calculate the material volume. ${policy}`,
      `A hemispherical metal bowl has external radius ${R} and internal radius ${r}. Determine the volume of metal in the bowl. ${policy}`,
      `A hollow hemispherical vessel has radii ${R} and ${r} at its outer and inner surfaces. Find the wall-material volume. ${policy}`,
    ],
  };
  return choose(
    variants[state.prototypeId],
    `shell:stem:${state.prototypeId}:${state.seed}:${state.fixtureId}:${state.piPolicy}`,
  );
}

function candidatesFor(state: MenCp011ShellState): Candidate[] {
  const factor = state.formulaFactorNumerator;
  return [
    {
      value: state.materialVolume,
      misconceptionId: null,
      explanation: "",
    },
    {
      value: policyVolume(state.piPolicy, factor * state.outerCube, 3n),
      misconceptionId: "USED_OUTER_SOLID_VOLUME_ONLY",
      explanation: "using the complete outer solid volume without subtracting the hollow interior",
    },
    {
      value: policyVolume(state.piPolicy, factor * state.innerCube, 3n),
      misconceptionId: "CALCULATED_INNER_VOID_ONLY",
      explanation: "calculating only the empty inner sphere or hemisphere",
    },
    {
      value: policyVolume(
        state.piPolicy,
        factor * (state.outerCube + state.innerCube),
        3n,
      ),
      misconceptionId: "ADDED_INNER_AND_OUTER_VOLUMES",
      explanation: "adding the outer and inner volumes instead of subtracting the inner void",
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
    (hashText(`shell:correct:${seed}`) % 4 as 0 | 1 | 2 | 3);
  const offset = hashText(`shell:wrong:${seed}`) % wrong.length;
  const orderedWrong = wrong.map((_, index) => wrong[(index + offset) % wrong.length]!);
  const arranged: Candidate[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    arranged.push(index === correctIndex ? correct : orderedWrong[wrongIndex++]!);
  }
  return { arranged, correctIndex };
}

function buildDiagram(
  state: MenCp011ShellState,
  role: DiagramRole,
): MenCp011ShellDiagram {
  const hemisphere = state.shape === "HEMISPHERE";
  const shapeName = hemisphere ? "hemispherical shell" : "spherical shell";
  const outerPath = hemisphere
    ? "M110 210 A150 150 0 0 1 410 210 L110 210"
    : "M260 45 A135 135 0 1 1 259.9 45";
  const innerPath = hemisphere
    ? "M165 210 A95 95 0 0 1 355 210"
    : "M260 100 A80 80 0 1 1 259.9 100";
  const centreY = hemisphere ? 210 : 180;
  const outerEndX = hemisphere ? 410 : 395;
  const innerEndX = hemisphere ? 355 : 340;
  const svg = `<svg viewBox="0 0 520 300" role="img" aria-label="${shapeName} with outer radius ${state.outerRadius} ${state.unit} and inner radius ${state.innerRadius} ${state.unit}; not to scale" data-diagram-version="SPHERICAL_SHELL_EXAMTREE_V1" data-diagram-role="${role}" data-shape="${state.shape}" data-topology="HOLLOW" data-responsive="true" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="518" height="298" rx="10" fill="white" stroke="black"/>
  <g fill="none" stroke="black" stroke-width="2">
    <path data-region="outer-boundary" d="${outerPath}"/>
    <path data-region="inner-void" data-boundary="dashed" stroke-dasharray="7 5" d="${innerPath}"/>
    <circle data-role="centre" cx="260" cy="${centreY}" r="3" fill="black"/>
    <path data-dimension="outer-radius" data-orientation="centre-connected" d="M260 ${centreY} L${outerEndX} ${centreY}"/>
    <path data-dimension="inner-radius" data-orientation="centre-connected" stroke-dasharray="4 3" d="M260 ${centreY} L${innerEndX} ${centreY}"/>
  </g>
  <g font-family="Arial, sans-serif" font-size="15" fill="black">
    <text x="24" y="30">ExamTree ${shapeName}</text>
    <text x="24" y="55">outer radius R = ${state.outerRadius} ${state.unit}</text>
    <text x="24" y="78">inner radius r = ${state.innerRadius} ${state.unit}</text>
    <text x="24" y="101">wall thickness = ${state.thickness} ${state.unit}</text>
    <text data-role="outer-radius-label" x="330" y="${centreY - 9}">R</text>
    <text data-role="inner-radius-label" x="295" y="${centreY + 18}">r</text>
    <text x="398" y="283">not to scale</text>
  </g>
</svg>`;
  return {
    kind: hemisphere ? "HEMISPHERICAL_SHELL" : "SPHERICAL_SHELL",
    svg,
    accessibleText: `${shapeName} with outer radius ${state.outerRadius} ${state.unit}, inner radius ${state.innerRadius} ${state.unit}, and an empty inner region.`,
    visibleLabels: [
      `R = ${state.outerRadius} ${state.unit}`,
      `r = ${state.innerRadius} ${state.unit}`,
      `t = ${state.thickness} ${state.unit}`,
    ],
    notToScale: true,
  };
}

function buildExplanation(
  state: MenCp011ShellState,
  options: MenCp011ShellOption[],
) {
  const hemisphere = state.shape === "HEMISPHERE";
  const factor = hemisphere ? "\\frac{2}{3}" : "\\frac{4}{3}";
  const formula = `$V_{material}=${factor}\\pi(R^3-r^3)$`;
  const piText = state.piPolicy === "EXACT_PI"
    ? "keep $\\pi$ exact"
    : state.piPolicy === "PI_22_OVER_7"
      ? "substitute $\\pi=\\frac{22}{7}$"
      : "substitute the declared value $\\pi=3.14=\\frac{157}{50}$";
  const finalAnswer = formatWithUnit(state.materialVolume, state.volumeUnit);
  const firstEquation = `$R^3-r^3=${state.outerRadius}^3-${state.innerRadius}^3=${state.outerCube}-${state.innerCube}=${state.cubeDifference}\\text{ ${state.volumeUnit}}$`;
  const secondEquation = `$V_{material}=${factor}\\pi(${state.cubeDifference})=${finalAnswer.replace(/^\$|\$$/g, "")}$`;
  const shortcut = `Use $R^3-r^3=(R-r)(R^2+Rr+r^2)$. Here $R-r=${state.thickness}\\text{ ${state.unit}}$, so factor the cube difference before multiplying by ${factor}$ and $\\pi$.`;
  const candidateMap = new Map(
    candidatesFor(state).map((candidate) => [candidate.misconceptionId, candidate]),
  );
  const wrongOptionAnalysis = options
    .filter((option) => !option.isCorrect)
    .map((option) => `${option.display} comes from ${candidateMap.get(option.misconceptionId)?.explanation}.`);
  const keyRule = `Picture a complete outer ${hemisphere ? "hemisphere" : "sphere"} with a smaller concentric ${hemisphere ? "hemisphere" : "sphere"} removed from inside. The material is the outer volume minus the inner void, not the sum of the two volumes.`;
  const steps = [
    {
      title: "Find the cubic radius difference",
      body: `Cube the two radii and subtract. Cubing a length produces a volume quantity in ${state.volumeUnit}.`,
      equation: firstEquation,
    },
    {
      title: "Apply the shell-volume factor",
      body: `Use the ${hemisphere ? "hemisphere" : "sphere"} factor and ${piText}.`,
      equation: secondEquation,
    },
    {
      title: "State the material volume",
      body: `The required volume of material is ${finalAnswer}.`,
    },
  ];
  return {
    learnerSolution: {
      formula,
      steps: steps.map((step) => `${step.title}: ${step.body}${step.equation ? ` ${step.equation}` : ""}`),
      finalAnswer,
      shortcut,
      wrongOptionAnalysis,
    } satisfies MenCp011ShellLearnerSolution,
    explanation: {
      keyRule,
      steps,
      shortcut,
      traps: wrongOptionAnalysis,
    },
  };
}

function verify(state: MenCp011ShellState, exactAnswer: ExactValue) {
  const reconstructed = policyVolume(
    state.piPolicy,
    state.formulaFactorNumerator *
      (state.outerRadius ** 3n - state.innerRadius ** 3n),
    3n,
  );
  return {
    valid: exactEquals(exactAnswer, reconstructed),
    method: "Independent outer-solid minus inner-void reconstruction",
    reconstructed: `${state.formulaFactorNumerator}/3 × pi × (${state.outerRadius}³-${state.innerRadius}³) = ${formatExactPlain(reconstructed)} ${state.volumeUnit}`,
  };
}

function learnerText(question: Pick<
  MenCp011ShellPackage,
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

function validate(question: Omit<MenCp011ShellPackage, "validation">) {
  const checks: Array<{ name: string; passed: boolean; message: string }> = [];
  const add = (name: string, passed: boolean, message: string) =>
    checks.push({ name, passed, message });

  add(
    "physical-radii",
    question.state.outerRadius > question.state.innerRadius &&
      question.state.innerRadius > 0n,
    "The inner radius must be positive and smaller than the outer radius.",
  );
  add(
    "positive-material-volume",
    question.state.cubeDifference > 0n,
    "The outer cubic radius must exceed the inner cubic radius.",
  );
  add(
    "three-pi-policies",
    PI_POLICIES.includes(question.piPolicy),
    "The package must use exact pi, declared 22/7, or declared 3.14.",
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
    "diagram-state-synchronisation",
    question.diagram.svg.includes(`R = ${question.state.outerRadius} ${question.state.unit}`) &&
      question.diagram.svg.includes(`r = ${question.state.innerRadius} ${question.state.unit}`) &&
      question.diagram.svg.includes('data-region="inner-void"'),
    "Diagram labels and topology must match the generated shell state.",
  );
  add(
    "responsive-diagram",
    !/<svg[^>]+\bwidth="\d+/.test(question.diagram.svg) &&
      question.renderSurfaces.responsiveDiagramPolicy.minWidthPx === 0,
    "The SVG must be viewBox-driven and mobile-safe.",
  );
  add(
    "learner-admin-separation",
    !/\[(?:USED_|CALCULATED_|ADDED_|MEN-CP011-PROT-)/.test(learnerText(question)) &&
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

  return {
    valid: checks.every((check) => check.passed),
    checks,
  };
}

export function generateMenCp011ShellQuestion(
  prototypeId: MenCp011ShellPrototypeId,
  seed: string,
  constraints: MenCp011ShellGenerationConstraints = {},
): MenCp011ShellPackage {
  for (let attempt = 0; attempt < 48; attempt += 1) {
    const state = createState(prototypeId, seed, constraints, attempt);
    const candidates = candidatesFor(state);
    if (new Set(candidates.map((candidate) => exactKey(candidate.value))).size !== 4) {
      continue;
    }
    const permutationSeed =
      `${MEN_CP011_SPHERICAL_SHELLS_AUTHORITY}|options|${prototypeId}|${seed}|${attempt}`;
    const { arranged, correctIndex } = arrangeCandidates(
      candidates,
      permutationSeed,
      constraints.correctIndex,
    );
    const options: MenCp011ShellOption[] = arranged.map((candidate, index) => ({
      label: LABELS[index]!,
      value: candidate.value,
      display: formatWithUnit(candidate.value, state.volumeUnit),
      isCorrect: candidate.misconceptionId === null,
      misconceptionId: candidate.misconceptionId,
    }));
    const exactAnswer = state.materialVolume;
    const verification = verify(state, exactAnswer);
    const diagram = buildDiagram(state, "PROMPT");
    const solutionDiagram = buildDiagram(state, "SOLUTION");
    const explanationParts = buildExplanation(state, options);
    const withoutValidation: Omit<MenCp011ShellPackage, "validation"> = {
      packageId: "MEN-002",
      canonicalProblemId: "MEN-CP-011",
      permanentQlId: null,
      waveId: "MEN-CP-011-SPHERICAL-SHELLS-WAVE-01",
      prototypeId,
      solveMode: state.solveMode,
      language: "en",
      seed,
      difficulty: state.difficulty,
      target: "VOLUME",
      piPolicy: state.piPolicy,
      unit: state.volumeUnit,
      shellAuthority: MEN_CP011_SPHERICAL_SHELLS_AUTHORITY,
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
          diagramPolicy: "OPTIONAL_PROMPT_SAFE_SHELL_DIAGRAM",
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
    `Unable to generate a valid MEN-CP-011 shell package for ${prototypeId} and seed ${seed}.`,
  );
}

export function generateMenCp011ShellReviewBatch() {
  const records: MenCp011ShellPackage[] = [];
  const units: readonly MenCp011ShellLinearUnit[] = ["cm", "m"];
  for (const prototypeId of getMenCp011ShellPrototypeIds()) {
    for (let policyIndex = 0; policyIndex < PI_POLICIES.length; policyIndex += 1) {
      for (let unitIndex = 0; unitIndex < units.length; unitIndex += 1) {
        for (let fixtureIndex = 0; fixtureIndex < 4; fixtureIndex += 1) {
          records.push(
            generateMenCp011ShellQuestion(
              prototypeId,
              `shell-review:${prototypeId}:${PI_POLICIES[policyIndex]}:${units[unitIndex]}:${fixtureIndex}`,
              {
                piPolicy: PI_POLICIES[policyIndex],
                unit: units[unitIndex],
                fixtureIndex: fixtureIndex + policyIndex * 2,
                correctIndex: ((fixtureIndex + policyIndex + unitIndex) % 4) as 0 | 1 | 2 | 3,
              },
            ),
          );
        }
      }
    }
  }
  return {
    authority: MEN_CP011_SPHERICAL_SHELLS_AUTHORITY,
    records,
  };
}

function normalizeStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\d+(?:\.\d+)?/g, "<n>")
    .replace(/\s+/g, " ")
    .trim();
}

export function auditMenCp011ShellBatch(
  records: readonly MenCp011ShellPackage[],
) {
  const normalizedCounts = new Map<string, number>();
  const exactStems = new Set<string>();
  const exactQuestionOptions = new Set<string>();
  const physicalStates = new Set<string>();
  const unitCounts: Record<MenCp011ShellLinearUnit, number> = { cm: 0, m: 0 };
  const piPolicyCounts: Record<MenCp011ShellPiPolicy, number> = {
    EXACT_PI: 0,
    PI_22_OVER_7: 0,
    PI_3_14: 0,
  };
  const answerPositionCounts: Record<Label, number> = { A: 0, B: 0, C: 0, D: 0 };
  const prototypeUnitPiCounts: Record<string, number> = {};

  for (const question of records) {
    const normalized = normalizeStem(question.stem);
    normalizedCounts.set(normalized, (normalizedCounts.get(normalized) ?? 0) + 1);
    exactStems.add(question.stem);
    exactQuestionOptions.add(
      `${question.stem}|${question.options.map((option) => exactKey(option.value)).join("|")}`,
    );
    physicalStates.add(
      [
        question.prototypeId,
        question.state.fixtureId,
        question.state.unit,
        question.state.piPolicy,
        question.state.outerRadius,
        question.state.innerRadius,
      ].join("|"),
    );
    unitCounts[question.state.unit] += 1;
    piPolicyCounts[question.piPolicy] += 1;
    answerPositionCounts[LABELS[question.correctIndex]!] += 1;
    const cell = `${question.prototypeId}|${question.state.unit}|${question.piPolicy}`;
    prototypeUnitPiCounts[cell] = (prototypeUnitPiCounts[cell] ?? 0) + 1;
  }

  return {
    authority: MEN_CP011_SPHERICAL_SHELLS_AUTHORITY,
    prototypeCount: new Set(records.map((record) => record.prototypeId)).size,
    recordCount: records.length,
    exactStemCount: exactStems.size,
    exactQuestionOptionCount: exactQuestionOptions.size,
    maximumNormalizedStemRepetition: Math.max(0, ...normalizedCounts.values()),
    uniquePhysicalStateCount: physicalStates.size,
    unitCounts,
    piPolicyCounts,
    answerPositionCounts,
    prototypeUnitPiCounts,
    publicationEligible: false as const,
    resolvedDiscoveryCandidates: getMenCp011ShellPrototypeIds(),
  };
}
