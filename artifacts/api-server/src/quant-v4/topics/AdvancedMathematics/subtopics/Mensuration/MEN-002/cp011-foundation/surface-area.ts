import {
  exactEquals,
  exactKey,
  formatExactMath,
  formatWithUnit,
  pi,
  rational,
} from "../foundation/exact";
import type { ExactValue, Men002Difficulty } from "../foundation/types";
import {
  getMenCp011MeasurementProfiles,
  menCp011CalculationValues,
  MEN_CP011_MEASUREMENT_AUTHORITY,
  type MenCp011LinearUnit,
  type MenCp011MeasurementProfile,
  type MenCp011MeasurementProfileId,
} from "./measurement-profiles";
import { generateMenCp011FoundationPrototype } from "./runtime";
import { menCp011PhysicalStateKey } from "./state-pool";
import type {
  MenCp011Diagram,
  MenCp011Explanation,
  MenCp011PiPolicy,
  MenCp011SurfaceLedgerEntry,
} from "./types";

export const MEN_CP011_SURFACE_AREA_AUTHORITY =
  "MEN-CP011-PHASE2C-SURFACE-AREA-V1" as const;

export type MenCp011SurfacePrototypeId =
  | "MEN-CP011-PROT-OUTER-CURVED-SURFACE-AREA"
  | "MEN-CP011-PROT-INNER-CURVED-SURFACE-AREA"
  | "MEN-CP011-PROT-BOTH-CURVED-SURFACES-AREA"
  | "MEN-CP011-PROT-ONE-ANNULAR-END-AREA"
  | "MEN-CP011-PROT-BOTH-ANNULAR-ENDS-AREA"
  | "MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA";

export type MenCp011SurfaceSolveMode =
  | "findOuterCurvedSurfaceArea"
  | "findInnerCurvedSurfaceArea"
  | "findBothCurvedSurfacesArea"
  | "findOneAnnularEndArea"
  | "findBothAnnularEndsArea"
  | "findCompleteTubeSurfaceArea";

export type MenCp011SurfaceId = MenCp011SurfaceLedgerEntry["surfaceId"];
export type MenCp011SurfaceAreaUnit = "cm²" | "m²";

type Label = "A" | "B" | "C" | "D";
type DiagramRole = "SURFACE_PROMPT" | "SURFACE_SOLUTION";

export interface MenCp011SurfaceDefinition {
  prototypeId: MenCp011SurfacePrototypeId;
  solveMode: MenCp011SurfaceSolveMode;
  difficulty: Men002Difficulty;
  focusSurfaceIds: readonly MenCp011SurfaceId[];
  focusLabel: string;
}

export const MEN_CP011_SURFACE_PROTOTYPES: readonly MenCp011SurfaceDefinition[] = [
  {
    prototypeId: "MEN-CP011-PROT-OUTER-CURVED-SURFACE-AREA",
    solveMode: "findOuterCurvedSurfaceArea",
    difficulty: "Easy",
    focusSurfaceIds: ["OUTER_CURVED"],
    focusLabel: "outer curved wall only",
  },
  {
    prototypeId: "MEN-CP011-PROT-INNER-CURVED-SURFACE-AREA",
    solveMode: "findInnerCurvedSurfaceArea",
    difficulty: "Easy",
    focusSurfaceIds: ["INNER_CURVED"],
    focusLabel: "inner curved wall only",
  },
  {
    prototypeId: "MEN-CP011-PROT-BOTH-CURVED-SURFACES-AREA",
    solveMode: "findBothCurvedSurfacesArea",
    difficulty: "Medium",
    focusSurfaceIds: ["OUTER_CURVED", "INNER_CURVED"],
    focusLabel: "outer and inner curved walls",
  },
  {
    prototypeId: "MEN-CP011-PROT-ONE-ANNULAR-END-AREA",
    solveMode: "findOneAnnularEndArea",
    difficulty: "Medium",
    focusSurfaceIds: ["NEAR_ANNULAR_END"],
    focusLabel: "one annular end only",
  },
  {
    prototypeId: "MEN-CP011-PROT-BOTH-ANNULAR-ENDS-AREA",
    solveMode: "findBothAnnularEndsArea",
    difficulty: "Medium",
    focusSurfaceIds: ["NEAR_ANNULAR_END", "FAR_ANNULAR_END"],
    focusLabel: "both annular ends",
  },
  {
    prototypeId: "MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA",
    solveMode: "findCompleteTubeSurfaceArea",
    difficulty: "Hard",
    focusSurfaceIds: [
      "OUTER_CURVED",
      "INNER_CURVED",
      "NEAR_ANNULAR_END",
      "FAR_ANNULAR_END",
    ],
    focusLabel: "all four exposed surfaces",
  },
] as const;

const DEFINITION_BY_ID = new Map(
  MEN_CP011_SURFACE_PROTOTYPES.map((definition) => [
    definition.prototypeId,
    definition,
  ]),
);

export function getMenCp011SurfacePrototypeIds() {
  return MEN_CP011_SURFACE_PROTOTYPES.map((definition) =>
    definition.prototypeId,
  );
}

export function getMenCp011SurfaceDefinition(
  prototypeId: MenCp011SurfacePrototypeId,
) {
  const definition = DEFINITION_BY_ID.get(prototypeId);
  if (!definition) {
    throw new Error(`Unknown MEN-CP-011 surface prototype ${prototypeId}.`);
  }
  return definition;
}

export interface MenCp011SurfaceOption {
  label: Label;
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp011SurfaceState {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-SURFACE-WAVE-01";
  prototypeId: MenCp011SurfacePrototypeId;
  solveMode: MenCp011SurfaceSolveMode;
  target: "SURFACE_AREA";
  seed: string;
  difficulty: Men002Difficulty;
  piPolicy: MenCp011PiPolicy;
  unit: MenCp011SurfaceAreaUnit;
  measurementProfileId: MenCp011MeasurementProfileId;
  radialUnit: MenCp011LinearUnit;
  heightUnit: MenCp011LinearUnit;
  calculationUnit: MenCp011LinearUnit;
  outerRadius: bigint;
  innerRadius: bigint;
  height: bigint;
  calculationOuterRadius: bigint;
  calculationInnerRadius: bigint;
  calculationHeight: bigint;
  ringCoefficient: bigint;
  surfaceLedger: readonly MenCp011SurfaceLedgerEntry[];
  focusSurfaceIds: readonly MenCp011SurfaceId[];
}

export interface MenCp011SurfaceLearnerSolution {
  formula: string;
  steps: string[];
  finalAnswer: string;
  shortcut: string;
  wrongOptionAnalysis: string[];
}

export interface MenCp011SurfacePackage {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-SURFACE-WAVE-01";
  prototypeId: MenCp011SurfacePrototypeId;
  solveMode: MenCp011SurfaceSolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: "SURFACE_AREA";
  piPolicy: MenCp011PiPolicy;
  unit: MenCp011SurfaceAreaUnit;
  measurementAuthority: typeof MEN_CP011_MEASUREMENT_AUTHORITY;
  measurementProfile: MenCp011MeasurementProfile;
  surfaceAreaAuthority: typeof MEN_CP011_SURFACE_AREA_AUTHORITY;
  stem: string;
  options: MenCp011SurfaceOption[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  optionPermutationSeed: string;
  diagram: MenCp011Diagram;
  solutionDiagram: MenCp011Diagram;
  state: MenCp011SurfaceState;
  explanation: MenCp011Explanation;
  learnerSolution: MenCp011SurfaceLearnerSolution;
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
      diagram: MenCp011Diagram;
      diagramPolicy: "OPTIONAL_SURFACE_FOCUS_DIAGRAM";
      exposesInternalCodes: false;
    };
    solution: {
      diagram: MenCp011Diagram;
      explanation: MenCp011SurfaceLearnerSolution;
      exposesInternalCodes: false;
    };
    admin: {
      diagram: MenCp011Diagram;
      explanation: MenCp011Explanation;
      trapCodes: string[];
      surfaceLedger: readonly MenCp011SurfaceLedgerEntry[];
      verification: MenCp011SurfacePackage["verification"];
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

interface FormulaCandidate {
  formulaId: string;
  value: ExactValue;
  misconceptionId: string;
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

function randomFromSeed(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: string) {
  const output = [...items];
  const random = randomFromSeed(hashText(seed));
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex]!, output[index]!];
  }
  return output;
}

function choose<T>(items: readonly T[], seed: string) {
  return items[hashText(seed) % items.length]!;
}

function areaUnit(profile: MenCp011MeasurementProfile): MenCp011SurfaceAreaUnit {
  return profile.calculationUnit === "m" ? "m²" : "cm²";
}

function areaFromCoefficient(policy: MenCp011PiPolicy, coefficient: bigint) {
  return policy === "EXACT_PI"
    ? pi(coefficient)
    : rational(22n * coefficient, 7n);
}

function piMath(policy: MenCp011PiPolicy) {
  return policy === "EXACT_PI" ? "\\pi" : "\\frac{22}{7}";
}

function unitMath(unit: MenCp011LinearUnit, power = 1) {
  return power === 1
    ? `\\text{ ${unit}}`
    : `\\text{ ${unit}}^{${power}}`;
}

function dimension(value: bigint, unit: MenCp011LinearUnit) {
  return `$${value}\\text{ ${unit}}$`;
}

function formulaCoefficients(state: MenCp011SurfaceState) {
  const R = state.calculationOuterRadius;
  const r = state.calculationInnerRadius;
  const h = state.calculationHeight;
  const ring = R ** 2n - r ** 2n;
  return {
    OUTER_CURVED: 2n * R * h,
    INNER_CURVED: 2n * r * h,
    BOTH_CURVED: 2n * h * (R + r),
    ONE_END: ring,
    BOTH_ENDS: 2n * ring,
    COMPLETE: 2n * h * (R + r) + 2n * ring,
    CURVED_DIFFERENCE: 2n * h * (R - r),
    OUTER_DISC: R ** 2n,
    INNER_DISC: r ** 2n,
    SUM_OF_DISCS: R ** 2n + r ** 2n,
    THICKNESS_DISC: (R - r) ** 2n,
  } as const;
}

function correctFormulaId(prototypeId: MenCp011SurfacePrototypeId) {
  switch (prototypeId) {
    case "MEN-CP011-PROT-OUTER-CURVED-SURFACE-AREA": return "OUTER_CURVED" as const;
    case "MEN-CP011-PROT-INNER-CURVED-SURFACE-AREA": return "INNER_CURVED" as const;
    case "MEN-CP011-PROT-BOTH-CURVED-SURFACES-AREA": return "BOTH_CURVED" as const;
    case "MEN-CP011-PROT-ONE-ANNULAR-END-AREA": return "ONE_END" as const;
    case "MEN-CP011-PROT-BOTH-ANNULAR-ENDS-AREA": return "BOTH_ENDS" as const;
    case "MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA": return "COMPLETE" as const;
  }
}

function formulaMath(
  prototypeId: MenCp011SurfacePrototypeId,
  policy: MenCp011PiPolicy,
) {
  const p = piMath(policy);
  switch (prototypeId) {
    case "MEN-CP011-PROT-OUTER-CURVED-SURFACE-AREA":
      return `2\\times${p}\\times R\\times h`;
    case "MEN-CP011-PROT-INNER-CURVED-SURFACE-AREA":
      return `2\\times${p}\\times r\\times h`;
    case "MEN-CP011-PROT-BOTH-CURVED-SURFACES-AREA":
      return `2\\times${p}\\times h(R+r)`;
    case "MEN-CP011-PROT-ONE-ANNULAR-END-AREA":
      return `${p}(R^2-r^2)`;
    case "MEN-CP011-PROT-BOTH-ANNULAR-ENDS-AREA":
      return `2\\times${p}(R^2-r^2)`;
    case "MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA":
      return `2\\times${p}h(R+r)+2\\times${p}(R^2-r^2)`;
  }
}

function focusRequest(definition: MenCp011SurfaceDefinition) {
  switch (definition.prototypeId) {
    case "MEN-CP011-PROT-OUTER-CURVED-SURFACE-AREA":
      return "the area of the outside curved wall, excluding both ends";
    case "MEN-CP011-PROT-INNER-CURVED-SURFACE-AREA":
      return "the area of the inside curved wall, excluding both ends";
    case "MEN-CP011-PROT-BOTH-CURVED-SURFACES-AREA":
      return "the combined area of the outer and inner curved walls, excluding the ends";
    case "MEN-CP011-PROT-ONE-ANNULAR-END-AREA":
      return "the area of one annular end face only";
    case "MEN-CP011-PROT-BOTH-ANNULAR-ENDS-AREA":
      return "the combined area of the two annular end faces only";
    case "MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA":
      return "the complete exposed surface area, including both curved walls and both annular ends";
  }
}

function policySentence(policy: MenCp011PiPolicy) {
  return policy === "EXACT_PI"
    ? "Leave $\\pi$ in exact form."
    : "Use $\\pi=\\frac{22}{7}$.";
}

function createStem(
  definition: MenCp011SurfaceDefinition,
  state: MenCp011SurfaceState,
) {
  const contexts = [
    "hollow metallic pipe",
    "cylindrical tube",
    "machine sleeve",
    "hollow metal bush",
  ] as const;
  const context = choose(
    contexts,
    `${MEN_CP011_SURFACE_AREA_AUTHORITY}|CONTEXT|${definition.prototypeId}|${state.seed}`,
  );
  const R = dimension(state.outerRadius, state.radialUnit);
  const r = dimension(state.innerRadius, state.radialUnit);
  const h = dimension(state.height, state.heightUnit);
  const request = focusRequest(definition);
  const policy = policySentence(state.piPolicy);
  const shapes = [
    `A ${context} has outer radius ${R}, inner radius ${r}, and length ${h}. Find ${request}. ${policy}`,
    `The outer and inner radii of a ${context} are ${R} and ${r}; its length is ${h}. Determine ${request}. ${policy}`,
    `A ${context} is ${h} long with external radius ${R} and bore radius ${r}. Calculate ${request}. ${policy}`,
  ] as const;
  return choose(
    shapes,
    `${MEN_CP011_SURFACE_AREA_AUTHORITY}|SHAPE|${definition.prototypeId}|${state.seed}`,
  );
}

function candidateExplanation(formulaId: string) {
  const explanations: Record<string, { code: string; body: string }> = {
    OUTER_CURVED: {
      code: "USED_OUTER_CURVED_AREA_ONLY",
      body: "using only the outside curved wall $2\\pi Rh$",
    },
    INNER_CURVED: {
      code: "USED_INNER_CURVED_AREA_ONLY",
      body: "using only the inside curved wall $2\\pi rh$",
    },
    BOTH_CURVED: {
      code: "USED_BOTH_CURVED_AREAS_ONLY",
      body: "adding the two curved walls but omitting the annular ends",
    },
    ONE_END: {
      code: "USED_ONE_ANNULAR_END_ONLY",
      body: "using one annular end $\\pi(R^2-r^2)$ only",
    },
    BOTH_ENDS: {
      code: "USED_BOTH_ANNULAR_ENDS_ONLY",
      body: "using the two annular ends while omitting the curved walls",
    },
    COMPLETE: {
      code: "USED_COMPLETE_SURFACE_AREA",
      body: "including all four exposed surfaces when the question asks for a smaller subset",
    },
    CURVED_DIFFERENCE: {
      code: "SUBTRACTED_CURVED_RADII",
      body: "using $2\\pi h(R-r)$ instead of adding the exposed outer and inner curved walls",
    },
    OUTER_DISC: {
      code: "USED_OUTER_DISC_AREA",
      body: "treating an annular end as a full outer circular disc $\\pi R^2$",
    },
    INNER_DISC: {
      code: "USED_INNER_DISC_AREA",
      body: "using the area of the empty circular opening $\\pi r^2$",
    },
    SUM_OF_DISCS: {
      code: "ADDED_END_DISCS",
      body: "adding $\\pi R^2$ and $\\pi r^2$ instead of subtracting the bore from the outer disc",
    },
    THICKNESS_DISC: {
      code: "SQUARED_WALL_THICKNESS",
      body: "using $\\pi(R-r)^2$, which is not the area of an annulus",
    },
  };
  return explanations[formulaId]!;
}

function buildOptions(
  definition: MenCp011SurfaceDefinition,
  state: MenCp011SurfaceState,
) {
  const coefficients = formulaCoefficients(state);
  const correctId = correctFormulaId(definition.prototypeId);
  const correctValue = areaFromCoefficient(state.piPolicy, coefficients[correctId]);
  const candidates: FormulaCandidate[] = Object.entries(coefficients)
    .filter(([formulaId]) => formulaId !== correctId)
    .map(([formulaId, coefficient]) => {
      const detail = candidateExplanation(formulaId);
      return {
        formulaId,
        value: areaFromCoefficient(state.piPolicy, coefficient),
        misconceptionId: detail.code,
        explanation: detail.body,
      };
    })
    .filter((candidate) => !exactEquals(candidate.value, correctValue));

  const unique = new Map<string, FormulaCandidate>();
  for (const candidate of shuffle(
    candidates,
    `${MEN_CP011_SURFACE_AREA_AUTHORITY}|DISTRACTORS|${definition.prototypeId}|${state.seed}`,
  )) {
    if (!unique.has(exactKey(candidate.value))) {
      unique.set(exactKey(candidate.value), candidate);
    }
  }
  const wrong = [...unique.values()].slice(0, 3);
  if (wrong.length !== 3) {
    throw new Error(`Unable to construct three unique surface distractors for ${definition.prototypeId}.`);
  }

  const permutationSeed =
    `${MEN_CP011_SURFACE_AREA_AUTHORITY}|OPTION-PERMUTATION|${definition.prototypeId}|${state.seed}`;
  const ordered = shuffle(
    [
      { value: correctValue, misconceptionId: null, explanation: "", isCorrect: true },
      ...wrong.map((candidate) => ({
        value: candidate.value,
        misconceptionId: candidate.misconceptionId,
        explanation: candidate.explanation,
        isCorrect: false,
      })),
    ],
    permutationSeed,
  );
  const options: MenCp011SurfaceOption[] = ordered.map((candidate, index) => ({
    label: LABELS[index]!,
    value: candidate.value,
    display: formatWithUnit(candidate.value, state.unit),
    isCorrect: candidate.isCorrect,
    misconceptionId: candidate.misconceptionId,
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const trapBodies = new Map(
    ordered
      .filter((candidate) => !candidate.isCorrect)
      .map((candidate) => [candidate.misconceptionId!, candidate.explanation]),
  );
  const traps = options
    .filter((option) => !option.isCorrect)
    .map((option) => {
      const code = option.misconceptionId!;
      return `Option ${option.label} (${option.display}): ${trapBodies.get(code)} [${code}]`;
    });
  return {
    options,
    correctIndex,
    correctValue,
    answer: options[correctIndex]!.display,
    permutationSeed,
    traps,
  };
}

function conversionStep(
  profile: MenCp011MeasurementProfile,
  state: MenCp011SurfaceState,
) {
  if (!profile.mixedUnits) return null;
  if (profile.conversionFocus === "CONVERT_HEIGHT_M_TO_CM") {
    return {
      title: "Convert the length",
      body: `Use centimetres throughout: $h=${state.height}\\times100=${state.calculationHeight}\\text{ cm}$. Unit check: every length is now in cm.`,
      equation: `$h=${state.calculationHeight}\\text{ cm}$`,
    };
  }
  return {
    title: "Convert both radii",
    body: `Use centimetres throughout: $R=${state.outerRadius}\\times100=${state.calculationOuterRadius}\\text{ cm}$ and $r=${state.innerRadius}\\times100=${state.calculationInnerRadius}\\text{ cm}$. Unit check: area factors will therefore use cm².`,
    equation: `$R=${state.calculationOuterRadius}\\text{ cm},\\quad r=${state.calculationInnerRadius}\\text{ cm}$`,
  };
}

function createExplanation(
  definition: MenCp011SurfaceDefinition,
  state: MenCp011SurfaceState,
  exactAnswer: ExactValue,
  traps: string[],
) {
  const conversion = conversionStep(
    getMenCp011MeasurementProfiles().find(
      (profile) => profile.id === state.measurementProfileId,
    )!,
    state,
  );
  const formula = formulaMath(definition.prototypeId, state.piPolicy);
  const answerMath = `${formatExactMath(exactAnswer)}${unitMath(state.calculationUnit, 2)}`;
  const steps: MenCp011Explanation["steps"] = [];
  if (conversion) steps.push(conversion);
  steps.push({
    title: "Select only the requested surfaces",
    body: `Use ${definition.focusLabel}. Unit check: every selected contribution is an area.`,
  });
  steps.push({
    title: "Substitute in the surface formula",
    body: `Apply $${formula}$. Unit check: each product has square ${state.calculationUnit} units.`,
    equation: `$${formula}=${answerMath}$`,
  });
  return {
    keyRule: `Picture the pipe as four exposed surfaces: outer curved wall, inner curved wall, and two annular ends. Here, $R$ is the outer radius, $r$ is the inner radius, and $h$ is the length. Count only ${definition.focusLabel}.`,
    steps,
    shortcut: `⚡ Exam speed: mark the required surfaces first, then use $${formula}$; do not automatically include every visible face.`,
    traps,
  };
}

function createLearnerSolution(
  definition: MenCp011SurfaceDefinition,
  state: MenCp011SurfaceState,
  exactAnswer: ExactValue,
  options: MenCp011SurfaceOption[],
  explanation: MenCp011Explanation,
): MenCp011SurfaceLearnerSolution {
  const formula = formulaMath(definition.prototypeId, state.piPolicy);
  const conversion = conversionStep(
    getMenCp011MeasurementProfiles().find(
      (profile) => profile.id === state.measurementProfileId,
    )!,
    state,
  );
  const steps = [
    ...(conversion ? [conversion.body.replace(" Unit check: every length is now in cm.", "").replace(" Unit check: area factors will therefore use cm².", "")] : []),
    `Use $${formula}$.`,
    `Therefore, the required area is ${formatWithUnit(exactAnswer, state.unit)}.`,
  ];
  const trapByCode = new Map(
    explanation.traps.map((trap) => {
      const match = trap.match(/^Option [A-D] \(.+\): (.+) \[([A-Z0-9_]+)\]$/);
      return [match?.[2] ?? "", match?.[1] ?? ""];
    }),
  );
  return {
    formula: `$${formula}$`,
    steps,
    finalAnswer: formatWithUnit(exactAnswer, state.unit),
    shortcut: `Identify ${definition.focusLabel} before calculating.`,
    wrongOptionAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option) => trapByCode.get(option.misconceptionId ?? "") ?? "This option uses the wrong set of exposed surfaces."),
  };
}

function decorateDiagram(
  diagram: MenCp011Diagram,
  role: DiagramRole,
  definition: MenCp011SurfaceDefinition,
): MenCp011Diagram {
  const focus = definition.focusSurfaceIds.join(",");
  const svg = diagram.svg
    .replace(
      /data-diagram-role="[^"]+"/,
      `data-diagram-role="${role}"`,
    )
    .replace(
      "<svg ",
      `<svg data-surface-area-authority="${MEN_CP011_SURFACE_AREA_AUTHORITY}" data-surface-focus="${focus}" data-surface-focus-label="${definition.focusLabel}" `,
    );
  return {
    ...diagram,
    svg,
    accessibleText: `${diagram.accessibleText} Required surface: ${definition.focusLabel}.`,
    visibleLabels: [...diagram.visibleLabels, `Focus: ${definition.focusLabel}`],
  };
}

function validateSurfacePackage(question: Omit<MenCp011SurfacePackage, "validation">) {
  const learnerText = [
    question.stem,
    ...question.options.map((option) => option.display),
    question.learnerSolution.formula,
    ...question.learnerSolution.steps,
    question.learnerSolution.finalAnswer,
    question.learnerSolution.shortcut,
    ...question.learnerSolution.wrongOptionAnalysis,
  ].join("\n");
  const expectedIds = [...question.state.focusSurfaceIds].sort().join("|");
  const ledgerIds = question.state.surfaceLedger
    .filter((entry) => question.state.focusSurfaceIds.includes(entry.surfaceId))
    .map((entry) => entry.surfaceId)
    .sort()
    .join("|");
  const checks = [
    {
      name: "four unique options",
      passed: question.options.length === 4 &&
        new Set(question.options.map((option) => exactKey(option.value))).size === 4,
      message: "The surface question must have four mathematically distinct options.",
    },
    {
      name: "single keyed answer",
      passed: question.options.filter((option) => option.isCorrect).length === 1 &&
        question.options[question.correctIndex]?.isCorrect === true &&
        exactEquals(question.exactAnswer, question.options[question.correctIndex]!.value),
      message: "Exactly one option must match the independently calculated surface area.",
    },
    {
      name: "surface-ledger selection",
      passed: expectedIds === ledgerIds,
      message: "The requested surface IDs must exist in the canonical exposed-surface ledger.",
    },
    {
      name: "diagram focus metadata",
      passed: question.diagram.svg.includes(`data-surface-focus="${question.state.focusSurfaceIds.join(",")}"`) &&
        question.diagram.svg.includes('data-diagram-role="SURFACE_PROMPT"') &&
        question.solutionDiagram.svg.includes('data-diagram-role="SURFACE_SOLUTION"') &&
        question.diagram.svg.includes('data-responsive="true"'),
      message: "Practice and solution diagrams must carry responsive surface-focus metadata.",
    },
    {
      name: "learner-admin separation",
      passed: !/\[[A-Z0-9_]+\]/.test(learnerText) &&
        !/misconceptionId|surfaceLedger|verification/.test(learnerText),
      message: "Learner surfaces must not expose trap codes, the surface ledger or verifier tokens.",
    },
    {
      name: "visible TeX lint",
      passed: !learnerText.includes("\\pih") &&
        (learnerText.match(/\$/g) ?? []).length % 2 === 0,
      message: "Learner TeX must use balanced delimiters and may not contain the malformed command \\pih.",
    },
    {
      name: "lifecycle locks",
      passed: question.permanentQlId === null &&
        question.questionBankStatus === "NOT_STORED" &&
        question.testEligibility === "INELIGIBLE" &&
        question.publiclyPublishable === false &&
        question.questionStudioDiscoverable === false,
      message: "Phase 2C remains review-only with every delivery surface locked.",
    },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp011SurfaceQuestion(
  prototypeId: MenCp011SurfacePrototypeId,
  seed: string,
): MenCp011SurfacePackage {
  const definition = getMenCp011SurfaceDefinition(prototypeId);
  const base = generateMenCp011FoundationPrototype(
    "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME",
    `${MEN_CP011_SURFACE_AREA_AUTHORITY}|STATE|${prototypeId}|${seed}`,
  );
  const calculation = menCp011CalculationValues(
    base.measurementProfile,
    base.state,
  );
  const unit = areaUnit(base.measurementProfile);
  const state: MenCp011SurfaceState = {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-011",
    permanentQlId: null,
    waveId: "MEN-CP-011-SURFACE-WAVE-01",
    prototypeId,
    solveMode: definition.solveMode,
    target: "SURFACE_AREA",
    seed,
    difficulty: definition.difficulty,
    piPolicy: base.piPolicy,
    unit,
    measurementProfileId: base.measurementProfile.id,
    radialUnit: base.measurementProfile.radialUnit,
    heightUnit: base.measurementProfile.heightUnit,
    calculationUnit: base.measurementProfile.calculationUnit,
    outerRadius: base.state.outerRadius,
    innerRadius: base.state.innerRadius,
    height: base.state.height,
    calculationOuterRadius: calculation.outerRadius,
    calculationInnerRadius: calculation.innerRadius,
    calculationHeight: calculation.height,
    ringCoefficient: calculation.ringCoefficient,
    surfaceLedger: base.state.surfaceLedger,
    focusSurfaceIds: definition.focusSurfaceIds,
  };
  const optionBuild = buildOptions(definition, state);
  const explanation = createExplanation(
    definition,
    state,
    optionBuild.correctValue,
    optionBuild.traps,
  );
  const learnerSolution = createLearnerSolution(
    definition,
    state,
    optionBuild.correctValue,
    optionBuild.options,
    explanation,
  );
  const diagram = decorateDiagram(base.diagram, "SURFACE_PROMPT", definition);
  const solutionDiagram = decorateDiagram(
    base.solutionDiagram,
    "SURFACE_SOLUTION",
    definition,
  );
  const independentCoefficient = formulaCoefficients(state)[
    correctFormulaId(prototypeId)
  ];
  const reconstructed = areaFromCoefficient(
    state.piPolicy,
    independentCoefficient,
  );
  const verification = {
    valid: exactEquals(reconstructed, optionBuild.correctValue),
    method: "Independent exposed-surface coefficient reconstruction",
    reconstructed: formatWithUnit(reconstructed, unit),
  };
  const withoutValidation: Omit<MenCp011SurfacePackage, "validation"> = {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-011",
    permanentQlId: null,
    waveId: "MEN-CP-011-SURFACE-WAVE-01",
    prototypeId,
    solveMode: definition.solveMode,
    language: "en",
    seed,
    difficulty: definition.difficulty,
    target: "SURFACE_AREA",
    piPolicy: base.piPolicy,
    unit,
    measurementAuthority: MEN_CP011_MEASUREMENT_AUTHORITY,
    measurementProfile: base.measurementProfile,
    surfaceAreaAuthority: MEN_CP011_SURFACE_AREA_AUTHORITY,
    stem: createStem(definition, state),
    options: optionBuild.options,
    correctIndex: optionBuild.correctIndex,
    answer: optionBuild.answer,
    exactAnswer: optionBuild.correctValue,
    optionPermutationSeed: optionBuild.permutationSeed,
    diagram,
    solutionDiagram,
    state,
    explanation,
    learnerSolution,
    verification,
    renderSurfaces: {
      attempt: {
        diagram: null,
        diagramPolicy: "HIDDEN_FOR_TEXT_COMPLETE_ITEM",
        exposesInternalCodes: false,
      },
      practice: {
        diagram,
        diagramPolicy: "OPTIONAL_SURFACE_FOCUS_DIAGRAM",
        exposesInternalCodes: false,
      },
      solution: {
        diagram: solutionDiagram,
        explanation: learnerSolution,
        exposesInternalCodes: false,
      },
      admin: {
        diagram: solutionDiagram,
        explanation,
        trapCodes: optionBuild.options
          .filter((option) => !option.isCorrect)
          .map((option) => option.misconceptionId!),
        surfaceLedger: state.surfaceLedger,
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
  return {
    ...withoutValidation,
    validation: validateSurfacePackage(withoutValidation),
  };
}

function normalizedStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\s+/g, " ")
    .trim();
}

function questionOptionKey(question: MenCp011SurfacePackage) {
  return [
    question.stem,
    ...question.options.map((option) => option.display),
  ].join("\n");
}

export interface MenCp011SurfaceBatchAudit {
  surfaceAreaAuthority: typeof MEN_CP011_SURFACE_AREA_AUTHORITY;
  recordCount: number;
  prototypeCount: number;
  exactStemCount: number;
  exactQuestionOptionCount: number;
  normalizedStemGroupCount: number;
  maximumNormalizedStemRepetition: number;
  uniquePhysicalStateCount: number;
  mixedUnitRecordCount: number;
  measurementProfileCounts: Record<MenCp011MeasurementProfileId, number>;
  prototypeProfileCounts: Record<string, number>;
  answerPositionCounts: Record<Label, number>;
  answerPositionSequences: Record<MenCp011SurfacePrototypeId, string>;
  blockers: string[];
  publicationEligible: false;
}

export function auditMenCp011SurfaceBatch(
  records: readonly MenCp011SurfacePackage[],
): MenCp011SurfaceBatchAudit {
  const normalizedCounts = new Map<string, number>();
  for (const record of records) {
    const key = normalizedStem(record.stem);
    normalizedCounts.set(key, (normalizedCounts.get(key) ?? 0) + 1);
  }
  const measurementProfileCounts = Object.fromEntries(
    getMenCp011MeasurementProfiles().map((profile) => [profile.id, 0]),
  ) as Record<MenCp011MeasurementProfileId, number>;
  const prototypeProfileCounts: Record<string, number> = {};
  const answerPositionCounts: Record<Label, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const record of records) {
    measurementProfileCounts[record.measurementProfile.id] += 1;
    const cell = `${record.prototypeId}|${record.measurementProfile.id}`;
    prototypeProfileCounts[cell] = (prototypeProfileCounts[cell] ?? 0) + 1;
    answerPositionCounts[record.options[record.correctIndex]!.label] += 1;
  }
  const answerPositionSequences = Object.fromEntries(
    getMenCp011SurfacePrototypeIds().map((prototypeId) => [
      prototypeId,
      records
        .filter((record) => record.prototypeId === prototypeId)
        .map((record) => record.options[record.correctIndex]!.label)
        .join(""),
    ]),
  ) as Record<MenCp011SurfacePrototypeId, string>;
  return {
    surfaceAreaAuthority: MEN_CP011_SURFACE_AREA_AUTHORITY,
    recordCount: records.length,
    prototypeCount: getMenCp011SurfacePrototypeIds().length,
    exactStemCount: new Set(records.map((record) => record.stem)).size,
    exactQuestionOptionCount: new Set(records.map(questionOptionKey)).size,
    normalizedStemGroupCount: normalizedCounts.size,
    maximumNormalizedStemRepetition: Math.max(...normalizedCounts.values()),
    uniquePhysicalStateCount: new Set(
      records.map((record) => menCp011PhysicalStateKey({
        outerRadius: record.state.outerRadius,
        innerRadius: record.state.innerRadius,
        height: record.state.height,
        thickness: record.state.outerRadius - record.state.innerRadius,
      })),
    ).size,
    mixedUnitRecordCount: records.filter(
      (record) => record.measurementProfile.mixedUnits,
    ).length,
    measurementProfileCounts,
    prototypeProfileCounts,
    answerPositionCounts,
    answerPositionSequences,
    blockers: [
      "CHAPTER_COVERAGE_INCOMPLETE",
      "PERMANENT_QLS_UNALLOCATED",
      "MANUAL_ENGLISH_REVIEW_PENDING",
    ],
    publicationEligible: false,
  };
}

export function generateMenCp011SurfaceReviewBatch(
  seedNamespace = "men-cp011-phase2c-surface-review",
  recordsPerPrototype = 12,
) {
  if (recordsPerPrototype !== 12) {
    throw new Error("The Phase 2C review authority requires exactly 12 records per surface prototype.");
  }
  const profiles = getMenCp011MeasurementProfiles();
  const records: MenCp011SurfacePackage[] = [];
  const usedStates = new Set<string>();
  const usedStems = new Set<string>();
  const usedQuestionOptions = new Set<string>();
  const normalizedCounts = new Map<string, number>();

  getMenCp011SurfacePrototypeIds().forEach((prototypeId, prototypeIndex) => {
    const positionCounts = [0, 0, 0, 0];
    const profileCounts = new Map(
      profiles.map((profile) => [profile.id, 0]),
    );

    for (let sampleIndex = 0; sampleIndex < recordsPerPrototype; sampleIndex += 1) {
      const desiredProfile = profiles[sampleIndex % profiles.length]!;
      const desiredPosition = (prototypeIndex + sampleIndex) % LABELS.length;
      let accepted: MenCp011SurfacePackage | null = null;

      for (let attempt = 0; attempt < 65536; attempt += 1) {
        const candidate = generateMenCp011SurfaceQuestion(
          prototypeId,
          `${seedNamespace}:${prototypeId}:${sampleIndex + 1}:profile-${desiredProfile.id}:position-${desiredPosition}:candidate-${attempt}`,
        );
        const stateKey = menCp011PhysicalStateKey({
          outerRadius: candidate.state.outerRadius,
          innerRadius: candidate.state.innerRadius,
          height: candidate.state.height,
          thickness: candidate.state.outerRadius - candidate.state.innerRadius,
        });
        const stemKey = candidate.stem;
        const optionKey = questionOptionKey(candidate);
        const normalizedKey = normalizedStem(candidate.stem);

        if (!candidate.validation.valid || !candidate.verification.valid) continue;
        if (candidate.measurementProfile.id !== desiredProfile.id) continue;
        if (candidate.correctIndex !== desiredPosition) continue;
        if (positionCounts[desiredPosition]! >= 3) continue;
        if ((profileCounts.get(desiredProfile.id) ?? 0) >= 3) continue;
        if (usedStates.has(stateKey)) continue;
        if (usedStems.has(stemKey)) continue;
        if (usedQuestionOptions.has(optionKey)) continue;
        if ((normalizedCounts.get(normalizedKey) ?? 0) >= 3) continue;

        accepted = candidate;
        usedStates.add(stateKey);
        usedStems.add(stemKey);
        usedQuestionOptions.add(optionKey);
        normalizedCounts.set(
          normalizedKey,
          (normalizedCounts.get(normalizedKey) ?? 0) + 1,
        );
        positionCounts[desiredPosition] += 1;
        profileCounts.set(
          desiredProfile.id,
          (profileCounts.get(desiredProfile.id) ?? 0) + 1,
        );
        break;
      }

      if (!accepted) {
        throw new Error(
          `Unable to construct Phase 2C record ${sampleIndex + 1} for ${prototypeId}.`,
        );
      }
      records.push(accepted);
    }

    if (!positionCounts.every((count) => count === 3)) {
      throw new Error(`${prototypeId} must contribute three answers in every option position.`);
    }
    if (![...profileCounts.values()].every((count) => count === 3)) {
      throw new Error(`${prototypeId} must contribute three records for every measurement profile.`);
    }
  });

  const audit = auditMenCp011SurfaceBatch(records);
  if (audit.recordCount !== 72 || audit.uniquePhysicalStateCount !== 72) {
    throw new Error("Phase 2C requires 72 records using all 72 physical states exactly once.");
  }
  if (audit.exactStemCount !== 72 || audit.exactQuestionOptionCount !== 72) {
    throw new Error("Phase 2C review records may not contain exact question duplicates.");
  }
  if (audit.maximumNormalizedStemRepetition > 3) {
    throw new Error("A normalized Phase 2C stem skeleton appears more than three times.");
  }
  if (!Object.values(audit.measurementProfileCounts).every((count) => count === 18)) {
    throw new Error("Every measurement profile must appear 18 times across Phase 2C.");
  }
  if (!Object.values(audit.prototypeProfileCounts).every((count) => count === 3)) {
    throw new Error("Every surface-prototype/profile cell must contain exactly three records.");
  }
  if (!Object.values(audit.answerPositionCounts).every((count) => count === 18)) {
    throw new Error("The 72-record Phase 2C batch must balance A, B, C and D exactly.");
  }
  if (new Set(Object.values(audit.answerPositionSequences)).size !== 6) {
    throw new Error("Surface prototypes may not share the same answer-position sequence.");
  }
  return { records, audit };
}
