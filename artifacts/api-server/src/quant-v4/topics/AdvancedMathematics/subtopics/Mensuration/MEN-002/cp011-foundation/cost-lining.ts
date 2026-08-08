import {
  exactEquals,
  exactKey,
  formatExactPlain,
  formatWithUnit,
  rational,
} from "../foundation/exact";
import type { ExactValue, Men002Difficulty } from "../foundation/types";

export const MEN_CP011_COST_LINING_AUTHORITY =
  "MEN-CP011-COST-LINING-WAVE-01-V1" as const;

export type MenCp011CostPrototypeId =
  | "MEN-CP011-PROT-OPEN-CONTAINER-SHEET-COST"
  | "MEN-CP011-PROT-INNER-LINING-COST";

export type MenCp011CostSolveMode =
  | "findOpenCylinderSheetCost"
  | "findInnerCylinderLiningCost";

export type MenCp011CostPiPolicy = "PI_22_OVER_7" | "PI_3_14";
type Label = "A" | "B" | "C" | "D";
type DiagramRole = "PROMPT" | "SOLUTION";

interface CostFixture {
  id: string;
  radius: bigint;
  height: bigint;
  rate: bigint;
}

const COST_FIXTURES: readonly CostFixture[] = [
  { id: "CL-01", radius: 2n, height: 3n, rate: 350n },
  { id: "CL-02", radius: 3n, height: 4n, rate: 700n },
  { id: "CL-03", radius: 4n, height: 5n, rate: 350n },
  { id: "CL-04", radius: 5n, height: 6n, rate: 700n },
  { id: "CL-05", radius: 6n, height: 8n, rate: 1050n },
  { id: "CL-06", radius: 3n, height: 7n, rate: 350n },
  { id: "CL-07", radius: 4n, height: 9n, rate: 700n },
  { id: "CL-08", radius: 5n, height: 10n, rate: 1050n },
] as const;

export interface MenCp011CostDefinition {
  prototypeId: MenCp011CostPrototypeId;
  solveMode: MenCp011CostSolveMode;
  context: "OPEN_SHEET" | "INNER_LINING";
  difficulty: Men002Difficulty;
}

export const MEN_CP011_COST_PROTOTYPES: readonly MenCp011CostDefinition[] = [
  {
    prototypeId: "MEN-CP011-PROT-OPEN-CONTAINER-SHEET-COST",
    solveMode: "findOpenCylinderSheetCost",
    context: "OPEN_SHEET",
    difficulty: "Medium",
  },
  {
    prototypeId: "MEN-CP011-PROT-INNER-LINING-COST",
    solveMode: "findInnerCylinderLiningCost",
    context: "INNER_LINING",
    difficulty: "Medium",
  },
] as const;

const DEFINITION_BY_ID = new Map(
  MEN_CP011_COST_PROTOTYPES.map((definition) => [
    definition.prototypeId,
    definition,
  ]),
);

export function getMenCp011CostPrototypeIds() {
  return MEN_CP011_COST_PROTOTYPES.map((definition) => definition.prototypeId);
}

export function getMenCp011CostDefinition(
  prototypeId: MenCp011CostPrototypeId,
) {
  const definition = DEFINITION_BY_ID.get(prototypeId);
  if (!definition) {
    throw new Error(`Unknown MEN-CP-011 cost prototype ${prototypeId}.`);
  }
  return definition;
}

export interface MenCp011CostState {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-COST-LINING-WAVE-01";
  prototypeId: MenCp011CostPrototypeId;
  solveMode: MenCp011CostSolveMode;
  target: "COST";
  context: "OPEN_SHEET" | "INNER_LINING";
  seed: string;
  stateSelectionAttempt: number;
  difficulty: Men002Difficulty;
  piPolicy: MenCp011CostPiPolicy;
  fixtureId: string;
  radius: bigint;
  height: bigint;
  ratePerSquareMetre: bigint;
  curvedAreaCoefficient: bigint;
  baseAreaCoefficient: bigint;
  includedAreaCoefficient: bigint;
  closedAreaCoefficient: bigint;
  surfaceArea: ExactValue;
  cost: ExactValue;
  sourceMaturity: "BLUEPRINT_AND_EXISTING_EXPOSURE_AUTHORITY_DERIVED_DIRECT_SOURCE_PENDING";
}

export interface MenCp011CostOption {
  label: Label;
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp011CostDiagram {
  kind: "OPEN_CYLINDER_SHEET_COST" | "INNER_CYLINDER_LINING_COST";
  svg: string;
  accessibleText: string;
  visibleLabels: readonly string[];
  notToScale: true;
}

export interface MenCp011CostLearnerSolution {
  formula: string;
  steps: string[];
  finalAnswer: string;
  shortcut: string;
  wrongOptionAnalysis: string[];
}

export interface MenCp011CostPackage {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-COST-LINING-WAVE-01";
  prototypeId: MenCp011CostPrototypeId;
  solveMode: MenCp011CostSolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: "COST";
  piPolicy: MenCp011CostPiPolicy;
  unit: "₹";
  costAuthority: typeof MEN_CP011_COST_LINING_AUTHORITY;
  sourceMaturity: "BLUEPRINT_AND_EXISTING_EXPOSURE_AUTHORITY_DERIVED_DIRECT_SOURCE_PENDING";
  stem: string;
  options: MenCp011CostOption[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  optionPermutationSeed: string;
  state: MenCp011CostState;
  diagram: MenCp011CostDiagram;
  solutionDiagram: MenCp011CostDiagram;
  learnerSolution: MenCp011CostLearnerSolution;
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
      diagram: MenCp011CostDiagram;
      diagramPolicy: "OPTIONAL_PROMPT_SAFE_COST_DIAGRAM";
      exposesInternalCodes: false;
    };
    solution: {
      diagram: MenCp011CostDiagram;
      explanation: MenCp011CostLearnerSolution;
      exposesInternalCodes: false;
    };
    admin: {
      diagram: MenCp011CostDiagram;
      trapCodes: string[];
      verification: MenCp011CostPackage["verification"];
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

export interface MenCp011CostGenerationConstraints {
  piPolicy?: MenCp011CostPiPolicy;
  fixtureIndex?: number;
  correctIndex?: 0 | 1 | 2 | 3;
}

interface Candidate {
  value: ExactValue;
  misconceptionId: string | null;
  explanation: string;
}

const LABELS: readonly Label[] = ["A", "B", "C", "D"];
const PI_POLICIES: readonly MenCp011CostPiPolicy[] = [
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

function policyValue(
  policy: MenCp011CostPiPolicy,
  coefficient: bigint,
): ExactValue {
  return policy === "PI_22_OVER_7"
    ? rational(coefficient * 22n, 7n)
    : rational(coefficient * 157n, 50n);
}

function policySentence(policy: MenCp011CostPiPolicy) {
  return policy === "PI_22_OVER_7"
    ? "Use $\\pi=\\frac{22}{7}$."
    : "Use $\\pi=3.14$ exactly as stated.";
}

function createState(
  prototypeId: MenCp011CostPrototypeId,
  seed: string,
  constraints: MenCp011CostGenerationConstraints,
  attempt: number,
): MenCp011CostState {
  const definition = getMenCp011CostDefinition(prototypeId);
  const fixtureIndex = constraints.fixtureIndex === undefined
    ? hashText(`${MEN_CP011_COST_LINING_AUTHORITY}|fixture|${prototypeId}|${seed}|${attempt}`) % COST_FIXTURES.length
    : ((constraints.fixtureIndex % COST_FIXTURES.length) + COST_FIXTURES.length) % COST_FIXTURES.length;
  const fixture = COST_FIXTURES[fixtureIndex]!;
  const piPolicy = constraints.piPolicy ??
    PI_POLICIES[
      hashText(`${MEN_CP011_COST_LINING_AUTHORITY}|pi|${prototypeId}|${seed}|${attempt}`) % PI_POLICIES.length
    ]!;
  const curvedAreaCoefficient = 2n * fixture.radius * fixture.height;
  const baseAreaCoefficient = fixture.radius * fixture.radius;
  const includedAreaCoefficient = curvedAreaCoefficient + baseAreaCoefficient;
  const closedAreaCoefficient = curvedAreaCoefficient + 2n * baseAreaCoefficient;
  const surfaceArea = policyValue(piPolicy, includedAreaCoefficient);
  const cost = policyValue(
    piPolicy,
    includedAreaCoefficient * fixture.rate,
  );

  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-011",
    permanentQlId: null,
    waveId: "MEN-CP-011-COST-LINING-WAVE-01",
    prototypeId,
    solveMode: definition.solveMode,
    target: "COST",
    context: definition.context,
    seed,
    stateSelectionAttempt: attempt,
    difficulty: definition.difficulty,
    piPolicy,
    fixtureId: fixture.id,
    radius: fixture.radius,
    height: fixture.height,
    ratePerSquareMetre: fixture.rate,
    curvedAreaCoefficient,
    baseAreaCoefficient,
    includedAreaCoefficient,
    closedAreaCoefficient,
    surfaceArea,
    cost,
    sourceMaturity: "BLUEPRINT_AND_EXISTING_EXPOSURE_AUTHORITY_DERIVED_DIRECT_SOURCE_PENDING",
  };
}

function createStem(state: MenCp011CostState) {
  const r = `$${state.radius}\\text{ m}$`;
  const h = `$${state.height}\\text{ m}$`;
  const rate = formatWithUnit(rational(state.ratePerSquareMetre), "₹/m²");
  const policy = policySentence(state.piPolicy);
  if (state.context === "OPEN_SHEET") {
    const variants = [
      `A cylindrical vessel of radius ${r} and height ${h} is open at the top. Find the cost of the metal sheet required for its curved wall and base at ${rate}. ${policy}`,
      `An open-top cylindrical tank has radius ${r} and height ${h}. Sheet material costs ${rate}. Calculate the cost of the sheet forming the side and bottom. ${policy}`,
      `A cylindrical container without a lid has radius ${r} and height ${h}. If sheet metal is priced at ${rate}, find the material cost. ${policy}`,
      `A metal cylinder is open at one end and has radius ${r} and length ${h}. Determine the sheet cost at ${rate}, including the curved wall and the existing circular end. ${policy}`,
      `A lidless cylindrical drum has radius ${r} and height ${h}. What is the cost of its sheet surface at ${rate}? ${policy}`,
      `A cylindrical bin has no top, radius ${r}, and height ${h}. Find the cost of the required sheet at ${rate}. ${policy}`,
      `The curved wall and bottom of an open cylindrical vessel of radius ${r} and height ${h} are made from sheet costing ${rate}. Calculate the total sheet cost. ${policy}`,
      `A cylindrical tank is open above and closed below. Its radius is ${r} and height is ${h}. Find the sheet-material cost at ${rate}. ${policy}`,
    ] as const;
    return choose(
      variants,
      `cost:stem:${state.prototypeId}:${state.seed}:${state.fixtureId}:${state.piPolicy}`,
    );
  }

  const variants = [
    `The inside of an open cylindrical tank of radius ${r} and depth ${h} is to be lined on its curved wall and bottom. Find the lining cost at ${rate}. ${policy}`,
    `A cylindrical tank is open at the top. Its inner radius is ${r} and depth is ${h}. Calculate the cost of lining its inner wall and base at ${rate}. ${policy}`,
    `The interior of a cylindrical vessel has radius ${r} and height ${h}. If the inner curved surface and bottom are coated at ${rate}, find the total cost. ${policy}`,
    `An open cylindrical reservoir has internal radius ${r} and depth ${h}. Determine the cost of lining all its internal surfaces except the open mouth at ${rate}. ${policy}`,
    `A cylindrical container, open above, has inner radius ${r} and height ${h}. What is the cost of lining the inside wall and floor at ${rate}? ${policy}`,
    `The internal surface of an open-top cylindrical tank consists of its curved wall and one base. For radius ${r}, height ${h}, and rate ${rate}, find the lining cost. ${policy}`,
    `A cylindrical tank has inner radius ${r} and depth ${h}. Its inside is lined, excluding the open top. Calculate the cost at ${rate}. ${policy}`,
    `Find the cost of coating the inner curved wall and bottom of a cylindrical vessel of radius ${r} and height ${h} when the rate is ${rate}. ${policy}`,
  ] as const;
  return choose(
    variants,
    `cost:stem:${state.prototypeId}:${state.seed}:${state.fixtureId}:${state.piPolicy}`,
  );
}

function candidatesFor(state: MenCp011CostState): Candidate[] {
  const correct = state.cost;
  const curvedOnlyCost = policyValue(
    state.piPolicy,
    state.curvedAreaCoefficient * state.ratePerSquareMetre,
  );
  const closedCost = policyValue(
    state.piPolicy,
    state.closedAreaCoefficient * state.ratePerSquareMetre,
  );
  const omittedFactorTwoCost = policyValue(
    state.piPolicy,
    (state.radius * state.height + state.baseAreaCoefficient) *
      state.ratePerSquareMetre,
  );

  if (state.context === "OPEN_SHEET") {
    return [
      { value: correct, misconceptionId: null, explanation: "" },
      {
        value: state.surfaceArea,
        misconceptionId: "STOPPED_AT_SHEET_AREA_WITHOUT_RATE",
        explanation: "stopping after the sheet area and not multiplying by the price per square metre",
      },
      {
        value: closedCost,
        misconceptionId: "ADDED_MISSING_LID_TO_SHEET_COST",
        explanation: "charging for two circular ends even though the top is open",
      },
      {
        value: curvedOnlyCost,
        misconceptionId: "OMITTED_EXISTING_BASE_FROM_SHEET_COST",
        explanation: "charging only for the curved wall and leaving out the existing bottom sheet",
      },
    ];
  }

  return [
    { value: correct, misconceptionId: null, explanation: "" },
    {
      value: curvedOnlyCost,
      misconceptionId: "OMITTED_INNER_BASE_FROM_LINING",
      explanation: "lining only the inner curved wall and forgetting the bottom",
    },
    {
      value: closedCost,
      misconceptionId: "ADDED_OPEN_MOUTH_TO_LINING",
      explanation: "including a second circular face at the open mouth where no lining surface exists",
    },
    {
      value: omittedFactorTwoCost,
      misconceptionId: "OMITTED_FACTOR_TWO_IN_INNER_CURVED_AREA",
      explanation: "using $\\pi rh$ instead of $2\\pi rh$ for the inner curved wall",
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
    (hashText(`cost:correct:${seed}`) % 4 as 0 | 1 | 2 | 3);
  const offset = hashText(`cost:wrong:${seed}`) % wrong.length;
  const orderedWrong = wrong.map((_, index) => wrong[(index + offset) % wrong.length]!);
  const arranged: Candidate[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    arranged.push(index === correctIndex ? correct : orderedWrong[wrongIndex++]!);
  }
  return { arranged, correctIndex };
}

function buildDiagram(
  state: MenCp011CostState,
  role: DiagramRole,
): MenCp011CostDiagram {
  const lining = state.context === "INNER_LINING";
  const resultLabel = role === "PROMPT"
    ? "cost = ?"
    : `cost = ${formatWithUnit(state.cost, "₹").replace(/^\$|\$$/g, "")}`;
  const surfaceNote = lining
    ? "included: inner curved wall + inner bottom; open mouth absent"
    : "included: outer curved sheet + bottom sheet; lid absent";
  const svg = `<svg viewBox="0 0 560 330" role="img" aria-label="Open cylindrical ${lining ? "tank inner lining" : "sheet surface"}; radius ${state.radius} m; height ${state.height} m; ${surfaceNote}; ${resultLabel}; not to scale" data-diagram-version="OPEN_CYLINDER_COST_LEDGER_V1" data-diagram-role="${role}" data-context="${state.context}" data-responsive="true" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="558" height="328" rx="10" fill="white" stroke="black"/>
  <g fill="none" stroke="black" stroke-width="2">
    <ellipse data-region="open-mouth" data-status="ABSENT_FACE" cx="285" cy="85" rx="115" ry="32" stroke-dasharray="7 5"/>
    <path data-region="curved-wall" data-surface-location="${lining ? "INNER" : "OUTER"}" d="M170 85 L170 245 M400 85 L400 245"/>
    <ellipse data-region="existing-base" data-surface-location="${lining ? "INNER" : "OUTER"}" cx="285" cy="245" rx="115" ry="32"/>
    <circle data-role="centre" cx="285" cy="85" r="3" fill="black"/>
    <path data-dimension="radius" data-orientation="centre-connected" d="M285 85 L400 85"/>
    <path data-dimension="height" data-orientation="vertical" d="M430 85 L430 245"/>
  </g>
  <g font-family="Arial, sans-serif" font-size="15" fill="black">
    <text x="24" y="30">ExamTree ${lining ? "inner-lining" : "open-sheet"} surface ledger</text>
    <text x="24" y="55">r = ${state.radius} m, h = ${state.height} m</text>
    <text x="24" y="78">rate = ₹${state.ratePerSquareMetre}/m²</text>
    <text data-role="surface-ledger-note" x="24" y="295">${surfaceNote}</text>
    <text data-role="result-label" x="350" y="318">${resultLabel}</text>
    <text x="450" y="45">not to scale</text>
  </g>
</svg>`;
  return {
    kind: lining ? "INNER_CYLINDER_LINING_COST" : "OPEN_CYLINDER_SHEET_COST",
    svg,
    accessibleText: `Open cylinder of radius ${state.radius} m and height ${state.height} m. ${surfaceNote}. Rate is ₹${state.ratePerSquareMetre} per square metre.`,
    visibleLabels: [
      `r = ${state.radius} m`,
      `h = ${state.height} m`,
      `₹${state.ratePerSquareMetre}/m²`,
      resultLabel,
    ],
    notToScale: true,
  };
}

function buildExplanation(
  state: MenCp011CostState,
  options: MenCp011CostOption[],
) {
  const area = formatWithUnit(state.surfaceArea, "m²");
  const cost = formatWithUnit(state.cost, "₹");
  const policy = state.piPolicy === "PI_22_OVER_7"
    ? "$\\pi=\\frac{22}{7}$"
    : "$\\pi=3.14=\\frac{157}{50}$";
  const contextLabel = state.context === "OPEN_SHEET"
    ? "sheet surface"
    : "inner lining surface";
  const keyRule = state.context === "OPEN_SHEET"
    ? "Use a surface ledger before applying the rate. The cylindrical wall and one bottom disc are made from sheet; the open top is not a material face and contributes zero area."
    : "Line only the surfaces that physically exist inside the open tank: the inner curved wall and the inner bottom. The open mouth is absent, so it contributes zero lining area.";
  const formula = "$A=2\\pi rh+\\pi r^2=\\pi r(2h+r),\\quad C=A\\times q$";
  const steps = [
    {
      title: "Identify the included surfaces",
      body: `The ${contextLabel} is the curved wall plus one circular base; the open top contributes zero.`,
      equation: "$A=2\\pi rh+\\pi r^2$",
    },
    {
      title: "Calculate the required area",
      body: `Substitute $r=${state.radius}\\text{ m}$, $h=${state.height}\\text{ m}$ and use ${policy}.`,
      equation: `$A=\\pi(${state.includedAreaCoefficient})=${area.replace(/^\$|\$$/g, "")}$`,
    },
    {
      title: "Apply the rate",
      body: `Multiply the area by ${formatWithUnit(rational(state.ratePerSquareMetre), "₹/m²")}. The square-metre units cancel, leaving currency.`,
      equation: `$C=${area.replace(/^\$|\$$/g, "")}\\times${state.ratePerSquareMetre}=${cost.replace(/^\$|\$$/g, "")}$`,
    },
  ];
  const shortcut = `Factor the area first: $A=\\pi r(2h+r)=\\pi(${state.radius})(2\\times${state.height}+${state.radius})=\\pi(${state.includedAreaCoefficient})$. Then multiply once by the rate to get ${cost}.`;
  const candidateMap = new Map(
    candidatesFor(state).map((candidate) => [candidate.misconceptionId, candidate]),
  );
  const wrongOptionAnalysis = options
    .filter((option) => !option.isCorrect)
    .map((option) => `${option.display} comes from ${candidateMap.get(option.misconceptionId)?.explanation}.`);
  return {
    learnerSolution: {
      formula,
      steps: steps.map((step) => `${step.title}: ${step.body} ${step.equation ?? ""}`),
      finalAnswer: cost,
      shortcut,
      wrongOptionAnalysis,
    } satisfies MenCp011CostLearnerSolution,
    explanation: { keyRule, steps, shortcut, traps: wrongOptionAnalysis },
  };
}

function verify(state: MenCp011CostState, exactAnswer: ExactValue) {
  const reconstructed = policyValue(
    state.piPolicy,
    (2n * state.radius * state.height + state.radius * state.radius) *
      state.ratePerSquareMetre,
  );
  return {
    valid: exactEquals(exactAnswer, reconstructed),
    method: "Independent included-surface ledger multiplied by exact area rate",
    reconstructed: `pi × ${state.radius} × (2×${state.height}+${state.radius}) × ${state.ratePerSquareMetre} = ${formatExactPlain(reconstructed)} rupees`,
  };
}

function learnerText(question: Pick<
  MenCp011CostPackage,
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

function validate(question: Omit<MenCp011CostPackage, "validation">) {
  const checks: Array<{ name: string; passed: boolean; message: string }> = [];
  const add = (name: string, passed: boolean, message: string) =>
    checks.push({ name, passed, message });
  const text = learnerText(question);

  add(
    "positive-cost-state",
    question.state.radius > 0n &&
      question.state.height > 0n &&
      question.state.ratePerSquareMetre > 0n,
    "Radius, height and rate must all be positive.",
  );
  add(
    "surface-ledger",
    question.state.includedAreaCoefficient ===
      question.state.curvedAreaCoefficient + question.state.baseAreaCoefficient,
    "The included surface must equal curved wall plus one existing base.",
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
    "Independent cost reconstruction must match the canonical answer.",
  );
  add(
    "diagram-surface-ledger",
    question.diagram.svg.includes('data-region="open-mouth"') &&
      question.diagram.svg.includes('data-status="ABSENT_FACE"') &&
      question.diagram.svg.includes('data-region="existing-base"') &&
      question.diagram.svg.includes(`data-context="${question.state.context}"`),
    "The diagram must show the absent mouth and included existing base.",
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
    !/\[(?:STOPPED_|ADDED_|OMITTED_|MEN-CP011-PROT-)/.test(text) &&
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

export function generateMenCp011CostQuestion(
  prototypeId: MenCp011CostPrototypeId,
  seed: string,
  constraints: MenCp011CostGenerationConstraints = {},
): MenCp011CostPackage {
  for (let attempt = 0; attempt < 48; attempt += 1) {
    const state = createState(prototypeId, seed, constraints, attempt);
    const candidates = candidatesFor(state);
    if (new Set(candidates.map((candidate) => exactKey(candidate.value))).size !== 4) {
      continue;
    }
    const optionPermutationSeed =
      `${MEN_CP011_COST_LINING_AUTHORITY}|options|${prototypeId}|${seed}|${attempt}`;
    const { arranged, correctIndex } = arrangeCandidates(
      candidates,
      optionPermutationSeed,
      constraints.correctIndex,
    );
    const options: MenCp011CostOption[] = arranged.map((candidate, index) => ({
      label: LABELS[index]!,
      value: candidate.value,
      display: formatWithUnit(candidate.value, "₹"),
      isCorrect: candidate.misconceptionId === null,
      misconceptionId: candidate.misconceptionId,
    }));
    const exactAnswer = state.cost;
    const verification = verify(state, exactAnswer);
    const diagram = buildDiagram(state, "PROMPT");
    const solutionDiagram = buildDiagram(state, "SOLUTION");
    const explanationParts = buildExplanation(state, options);
    const withoutValidation: Omit<MenCp011CostPackage, "validation"> = {
      packageId: "MEN-002",
      canonicalProblemId: "MEN-CP-011",
      permanentQlId: null,
      waveId: "MEN-CP-011-COST-LINING-WAVE-01",
      prototypeId,
      solveMode: state.solveMode,
      language: "en",
      seed,
      difficulty: state.difficulty,
      target: "COST",
      piPolicy: state.piPolicy,
      unit: "₹",
      costAuthority: MEN_CP011_COST_LINING_AUTHORITY,
      sourceMaturity: state.sourceMaturity,
      stem: createStem(state),
      options,
      correctIndex,
      answer: formatWithUnit(exactAnswer, "₹"),
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
          diagramPolicy: "OPTIONAL_PROMPT_SAFE_COST_DIAGRAM",
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
    `Unable to generate a valid MEN-CP-011 cost package for ${prototypeId} and seed ${seed}.`,
  );
}

export function generateMenCp011CostReviewBatch() {
  const records: MenCp011CostPackage[] = [];
  for (const prototypeId of getMenCp011CostPrototypeIds()) {
    for (let policyIndex = 0; policyIndex < PI_POLICIES.length; policyIndex += 1) {
      for (let fixtureIndex = 0; fixtureIndex < COST_FIXTURES.length; fixtureIndex += 1) {
        records.push(
          generateMenCp011CostQuestion(
            prototypeId,
            `cost-review:${prototypeId}:${PI_POLICIES[policyIndex]}:${fixtureIndex}`,
            {
              piPolicy: PI_POLICIES[policyIndex],
              fixtureIndex,
              correctIndex: ((fixtureIndex + policyIndex * 2) % 4) as 0 | 1 | 2 | 3,
            },
          ),
        );
      }
    }
  }
  return { authority: MEN_CP011_COST_LINING_AUTHORITY, records };
}

function normalizeStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\d+(?:\.\d+)?/g, "<n>")
    .replace(/\s+/g, " ")
    .trim();
}

export function auditMenCp011CostBatch(
  records: readonly MenCp011CostPackage[],
) {
  const normalizedCounts = new Map<string, number>();
  const exactStems = new Set<string>();
  const exactPackages = new Set<string>();
  const physicalStates = new Set<string>();
  const piPolicyCounts: Record<MenCp011CostPiPolicy, number> = {
    PI_22_OVER_7: 0,
    PI_3_14: 0,
  };
  const answerPositionCounts: Record<Label, number> = { A: 0, B: 0, C: 0, D: 0 };
  const prototypePolicyCounts: Record<string, number> = {};

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
        question.piPolicy,
        question.state.radius,
        question.state.height,
        question.state.ratePerSquareMetre,
      ].join("|"),
    );
    piPolicyCounts[question.piPolicy] += 1;
    answerPositionCounts[LABELS[question.correctIndex]!] += 1;
    const cell = `${question.prototypeId}|${question.piPolicy}`;
    prototypePolicyCounts[cell] = (prototypePolicyCounts[cell] ?? 0) + 1;
  }

  return {
    authority: MEN_CP011_COST_LINING_AUTHORITY,
    prototypeCount: new Set(records.map((record) => record.prototypeId)).size,
    recordCount: records.length,
    exactStemCount: exactStems.size,
    exactQuestionOptionCount: exactPackages.size,
    maximumNormalizedStemRepetition: Math.max(0, ...normalizedCounts.values()),
    uniquePhysicalStateCount: physicalStates.size,
    piPolicyCounts,
    answerPositionCounts,
    prototypePolicyCounts,
    publicationEligible: false as const,
    resolvedDiscoveryCandidates: getMenCp011CostPrototypeIds(),
  };
}

export function describeMenCp011CostAnswer(question: MenCp011CostPackage) {
  return `${question.prototypeId}: ${formatExactPlain(question.exactAnswer)} rupees`;
}
