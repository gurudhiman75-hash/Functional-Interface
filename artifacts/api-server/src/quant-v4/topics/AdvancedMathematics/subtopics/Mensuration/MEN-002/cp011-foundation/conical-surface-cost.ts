import {
  exactEquals,
  exactKey,
  formatExactPlain,
  formatWithUnit,
  pi,
  rational,
} from "../foundation/exact";
import type { ExactValue, Men002Difficulty, Men002Unit } from "../foundation/types";

export const MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY =
  "MEN-CP011-CONICAL-SURFACE-COST-WAVE-01-V1" as const;

export type MenCp011ConicalSurfaceCostPrototypeId =
  | "MEN-CP011-PROT-HOLLOW-CONE-CURVED-AREA-BOTH-SIDES"
  | "MEN-CP011-PROT-INNER-CONICAL-LINING-COST-FROM-SHELL";

export type MenCp011ConicalSurfaceCostSolveMode =
  | "findBothCurvedSurfacesOfHollowCone"
  | "findInnerConicalLiningCostFromDeclaredShell";

export type MenCp011ConicalSurfaceCostRelation =
  | "EXPLICIT_SHARED_BASE_INNER_CONE"
  | "DECLARED_SIMILAR_SHARED_BASE_WALL";

export type MenCp011ConicalSurfaceCostPiPolicy =
  | "EXACT_PI"
  | "PI_22_OVER_7"
  | "PI_3_14";

export type MenCp011ConicalSurfaceCostLinearUnit = "cm" | "m";
export type MenCp011ConicalSurfaceCostAreaUnit = "cm²" | "m²";
type Label = "A" | "B" | "C" | "D";
type DiagramRole = "PROMPT" | "SOLUTION";

export interface MenCp011ConicalSurfaceCostDefinition {
  prototypeId: MenCp011ConicalSurfaceCostPrototypeId;
  solveMode: MenCp011ConicalSurfaceCostSolveMode;
  relation: MenCp011ConicalSurfaceCostRelation;
  target: "AREA" | "COST";
  difficulty: Men002Difficulty;
}

export const MEN_CP011_CONICAL_SURFACE_COST_PROTOTYPES: readonly MenCp011ConicalSurfaceCostDefinition[] = [
  {
    prototypeId: "MEN-CP011-PROT-HOLLOW-CONE-CURVED-AREA-BOTH-SIDES",
    solveMode: "findBothCurvedSurfacesOfHollowCone",
    relation: "EXPLICIT_SHARED_BASE_INNER_CONE",
    target: "AREA",
    difficulty: "Hard",
  },
  {
    prototypeId: "MEN-CP011-PROT-INNER-CONICAL-LINING-COST-FROM-SHELL",
    solveMode: "findInnerConicalLiningCostFromDeclaredShell",
    relation: "DECLARED_SIMILAR_SHARED_BASE_WALL",
    target: "COST",
    difficulty: "Hard",
  },
] as const;

const DEFINITION_BY_ID = new Map(
  MEN_CP011_CONICAL_SURFACE_COST_PROTOTYPES.map((definition) => [
    definition.prototypeId,
    definition,
  ]),
);

export function getMenCp011ConicalSurfaceCostPrototypeIds() {
  return MEN_CP011_CONICAL_SURFACE_COST_PROTOTYPES.map(
    (definition) => definition.prototypeId,
  );
}

export function getMenCp011ConicalSurfaceCostDefinition(
  prototypeId: MenCp011ConicalSurfaceCostPrototypeId,
) {
  const definition = DEFINITION_BY_ID.get(prototypeId);
  if (!definition) {
    throw new Error(
      `Unknown MEN-CP-011 conical surface/cost prototype ${prototypeId}.`,
    );
  }
  return definition;
}

interface ExplicitSurfaceFixture {
  id: string;
  outerRadius: bigint;
  outerHeight: bigint;
  outerSlantHeight: bigint;
  innerRadius: bigint;
  innerHeight: bigint;
  innerSlantHeight: bigint;
}

interface SimilarLiningFixture extends ExplicitSurfaceFixture {
  scaleNumerator: bigint;
  scaleDenominator: bigint;
}

const SURFACE_FIXTURES: readonly ExplicitSurfaceFixture[] = [
  { id: "CA-01", outerRadius: 10n, outerHeight: 24n, outerSlantHeight: 26n, innerRadius: 6n, innerHeight: 8n, innerSlantHeight: 10n },
  { id: "CA-02", outerRadius: 13n, outerHeight: 84n, outerSlantHeight: 85n, innerRadius: 5n, innerHeight: 12n, innerSlantHeight: 13n },
  { id: "CA-03", outerRadius: 15n, outerHeight: 36n, outerSlantHeight: 39n, innerRadius: 9n, innerHeight: 12n, innerSlantHeight: 15n },
  { id: "CA-04", outerRadius: 17n, outerHeight: 144n, outerSlantHeight: 145n, innerRadius: 8n, innerHeight: 15n, innerSlantHeight: 17n },
  { id: "CA-05", outerRadius: 20n, outerHeight: 21n, outerSlantHeight: 29n, innerRadius: 12n, innerHeight: 16n, innerSlantHeight: 20n },
  { id: "CA-06", outerRadius: 24n, outerHeight: 32n, outerSlantHeight: 40n, innerRadius: 9n, innerHeight: 12n, innerSlantHeight: 15n },
  { id: "CA-07", outerRadius: 25n, outerHeight: 60n, outerSlantHeight: 65n, innerRadius: 15n, innerHeight: 20n, innerSlantHeight: 25n },
  { id: "CA-08", outerRadius: 21n, outerHeight: 72n, outerSlantHeight: 75n, innerRadius: 7n, innerHeight: 24n, innerSlantHeight: 25n },
] as const;

const LINING_FIXTURES: readonly SimilarLiningFixture[] = [
  { id: "CL-01", outerRadius: 10n, outerHeight: 24n, outerSlantHeight: 26n, innerRadius: 5n, innerHeight: 12n, innerSlantHeight: 13n, scaleNumerator: 1n, scaleDenominator: 2n },
  { id: "CL-02", outerRadius: 12n, outerHeight: 16n, outerSlantHeight: 20n, innerRadius: 6n, innerHeight: 8n, innerSlantHeight: 10n, scaleNumerator: 1n, scaleDenominator: 2n },
  { id: "CL-03", outerRadius: 15n, outerHeight: 36n, outerSlantHeight: 39n, innerRadius: 10n, innerHeight: 24n, innerSlantHeight: 26n, scaleNumerator: 2n, scaleDenominator: 3n },
  { id: "CL-04", outerRadius: 18n, outerHeight: 24n, outerSlantHeight: 30n, innerRadius: 12n, innerHeight: 16n, innerSlantHeight: 20n, scaleNumerator: 2n, scaleDenominator: 3n },
  { id: "CL-05", outerRadius: 20n, outerHeight: 48n, outerSlantHeight: 52n, innerRadius: 15n, innerHeight: 36n, innerSlantHeight: 39n, scaleNumerator: 3n, scaleDenominator: 4n },
  { id: "CL-06", outerRadius: 24n, outerHeight: 32n, outerSlantHeight: 40n, innerRadius: 18n, innerHeight: 24n, innerSlantHeight: 30n, scaleNumerator: 3n, scaleDenominator: 4n },
  { id: "CL-07", outerRadius: 21n, outerHeight: 72n, outerSlantHeight: 75n, innerRadius: 7n, innerHeight: 24n, innerSlantHeight: 25n, scaleNumerator: 1n, scaleDenominator: 3n },
  { id: "CL-08", outerRadius: 24n, outerHeight: 70n, outerSlantHeight: 74n, innerRadius: 12n, innerHeight: 35n, innerSlantHeight: 37n, scaleNumerator: 1n, scaleDenominator: 2n },
] as const;

export interface MenCp011ConicalSurfaceCostState {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-CONICAL-SURFACE-COST-WAVE-01";
  prototypeId: MenCp011ConicalSurfaceCostPrototypeId;
  solveMode: MenCp011ConicalSurfaceCostSolveMode;
  target: "AREA" | "COST";
  shape: "CONE";
  topology: "HOLLOW_SHARED_BASE_CAVITY";
  relation: MenCp011ConicalSurfaceCostRelation;
  seed: string;
  stateSelectionAttempt: number;
  difficulty: Men002Difficulty;
  unit: MenCp011ConicalSurfaceCostLinearUnit;
  areaUnit: MenCp011ConicalSurfaceCostAreaUnit;
  piPolicy: MenCp011ConicalSurfaceCostPiPolicy;
  fixtureId: string;
  outerRadius: bigint;
  outerHeight: bigint;
  outerSlantHeight: bigint;
  innerRadius: bigint;
  innerHeight: bigint;
  innerSlantHeight: bigint;
  scaleNumerator: bigint | null;
  scaleDenominator: bigint | null;
  ratePerSquareMetre: bigint | null;
  outerCurvedCoefficient: bigint;
  innerCurvedCoefficient: bigint;
  bothCurvedCoefficient: bigint;
  answerCoefficientBeforePi: bigint;
  sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING";
}

export interface MenCp011ConicalSurfaceCostOption {
  label: Label;
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp011ConicalSurfaceCostDiagram {
  kind: "CONICAL_SHELL_SURFACE";
  svg: string;
  accessibleText: string;
  visibleLabels: readonly string[];
  notToScale: true;
}

export interface MenCp011ConicalSurfaceCostLearnerSolution {
  formula: string;
  steps: string[];
  finalAnswer: string;
  shortcut: string;
  wrongOptionAnalysis: string[];
}

export interface MenCp011ConicalSurfaceCostPackage {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-CONICAL-SURFACE-COST-WAVE-01";
  prototypeId: MenCp011ConicalSurfaceCostPrototypeId;
  solveMode: MenCp011ConicalSurfaceCostSolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: "AREA" | "COST";
  unit: MenCp011ConicalSurfaceCostAreaUnit | "₹";
  conicalSurfaceCostAuthority: typeof MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY;
  sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING";
  stem: string;
  options: MenCp011ConicalSurfaceCostOption[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  optionPermutationSeed: string;
  state: MenCp011ConicalSurfaceCostState;
  diagram: MenCp011ConicalSurfaceCostDiagram;
  solutionDiagram: MenCp011ConicalSurfaceCostDiagram;
  learnerSolution: MenCp011ConicalSurfaceCostLearnerSolution;
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
      diagram: MenCp011ConicalSurfaceCostDiagram;
      diagramPolicy: "OPTIONAL_PROMPT_SAFE_CONICAL_SURFACE_DIAGRAM";
      exposesInternalCodes: false;
    };
    solution: {
      diagram: MenCp011ConicalSurfaceCostDiagram;
      explanation: MenCp011ConicalSurfaceCostLearnerSolution;
      exposesInternalCodes: false;
    };
    admin: {
      diagram: MenCp011ConicalSurfaceCostDiagram;
      trapCodes: string[];
      verification: MenCp011ConicalSurfaceCostPackage["verification"];
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

export interface MenCp011ConicalSurfaceCostGenerationConstraints {
  unit?: MenCp011ConicalSurfaceCostLinearUnit;
  piPolicy?: MenCp011ConicalSurfaceCostPiPolicy;
  fixtureIndex?: number;
  correctIndex?: 0 | 1 | 2 | 3;
}

interface Candidate {
  value: ExactValue;
  misconceptionId: string | null;
  explanation: string;
}

const LABELS: readonly Label[] = ["A", "B", "C", "D"];
const AREA_PI_POLICIES: readonly MenCp011ConicalSurfaceCostPiPolicy[] = [
  "EXACT_PI",
  "PI_22_OVER_7",
  "PI_3_14",
];
const COST_PI_POLICIES: readonly MenCp011ConicalSurfaceCostPiPolicy[] = [
  "PI_22_OVER_7",
  "PI_3_14",
];
const RATES_22_OVER_7 = [7n, 14n, 21n, 28n, 35n, 42n, 49n, 56n] as const;
const RATES_3_14 = [50n, 100n, 150n, 200n, 250n, 300n, 350n, 400n] as const;

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

function areaUnitFor(
  unit: MenCp011ConicalSurfaceCostLinearUnit,
): MenCp011ConicalSurfaceCostAreaUnit {
  return unit === "cm" ? "cm²" : "m²";
}

function dimension(value: bigint, unit: MenCp011ConicalSurfaceCostLinearUnit) {
  return `$${value}\\text{ ${unit}}$`;
}

function ratioText(numerator: bigint, denominator: bigint) {
  return `$\\frac{${numerator}}{${denominator}}$`;
}

function piInstruction(policy: MenCp011ConicalSurfaceCostPiPolicy) {
  switch (policy) {
    case "EXACT_PI":
      return "Leave the answer in terms of π.";
    case "PI_22_OVER_7":
      return "Use π = 22/7.";
    case "PI_3_14":
      return "Use π = 3.14.";
  }
}

function applyPiPolicy(
  coefficient: bigint,
  policy: MenCp011ConicalSurfaceCostPiPolicy,
): ExactValue {
  switch (policy) {
    case "EXACT_PI":
      return pi(coefficient, 1n);
    case "PI_22_OVER_7":
      return rational(22n * coefficient, 7n);
    case "PI_3_14":
      return rational(157n * coefficient, 50n);
  }
}

function formatCurrency(value: ExactValue) {
  return `₹${formatExactPlain(value)}`;
}

function allowedPiPolicies(
  prototypeId: MenCp011ConicalSurfaceCostPrototypeId,
) {
  return prototypeId ===
    "MEN-CP011-PROT-HOLLOW-CONE-CURVED-AREA-BOTH-SIDES"
    ? AREA_PI_POLICIES
    : COST_PI_POLICIES;
}

function createState(
  prototypeId: MenCp011ConicalSurfaceCostPrototypeId,
  seed: string,
  constraints: MenCp011ConicalSurfaceCostGenerationConstraints,
  attempt: number,
): MenCp011ConicalSurfaceCostState {
  const definition = getMenCp011ConicalSurfaceCostDefinition(prototypeId);
  const surfaceFamily = definition.target === "AREA";
  const fixtures = surfaceFamily ? SURFACE_FIXTURES : LINING_FIXTURES;
  const fixtureIndex =
    constraints.fixtureIndex === undefined
      ? hashText(
          `${MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY}|fixture|${prototypeId}|${seed}|${attempt}`,
        ) % fixtures.length
      : ((constraints.fixtureIndex % fixtures.length) + fixtures.length) %
        fixtures.length;
  const fixture = fixtures[fixtureIndex]!;
  const unit = surfaceFamily
    ? constraints.unit ??
      (hashText(
        `${MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY}|unit|${prototypeId}|${seed}|${attempt}`,
      ) % 2 === 0
        ? "cm"
        : "m")
    : "m";
  if (!surfaceFamily && constraints.unit && constraints.unit !== "m") {
    throw new Error("Inner conical lining cost is expressed using metres and ₹/m².");
  }
  const policies = allowedPiPolicies(prototypeId);
  if (
    constraints.piPolicy &&
    !policies.includes(constraints.piPolicy)
  ) {
    throw new Error(
      `${constraints.piPolicy} is not valid for ${prototypeId}. Cost items require a numeric π policy.`,
    );
  }
  const piPolicy =
    constraints.piPolicy ??
    policies[
      hashText(
        `${MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY}|pi|${prototypeId}|${seed}|${attempt}`,
      ) % policies.length
    ]!;
  const similar = fixture as Partial<SimilarLiningFixture>;
  const ratePerSquareMetre = surfaceFamily
    ? null
    : piPolicy === "PI_22_OVER_7"
      ? RATES_22_OVER_7[fixtureIndex]!
      : RATES_3_14[fixtureIndex]!;
  const outerCurvedCoefficient =
    fixture.outerRadius * fixture.outerSlantHeight;
  const innerCurvedCoefficient =
    fixture.innerRadius * fixture.innerSlantHeight;
  const bothCurvedCoefficient =
    outerCurvedCoefficient + innerCurvedCoefficient;
  const answerCoefficientBeforePi = surfaceFamily
    ? bothCurvedCoefficient
    : innerCurvedCoefficient * ratePerSquareMetre!;

  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-011",
    permanentQlId: null,
    waveId: "MEN-CP-011-CONICAL-SURFACE-COST-WAVE-01",
    prototypeId,
    solveMode: definition.solveMode,
    target: definition.target,
    shape: "CONE",
    topology: "HOLLOW_SHARED_BASE_CAVITY",
    relation: definition.relation,
    seed,
    stateSelectionAttempt: attempt,
    difficulty: definition.difficulty,
    unit,
    areaUnit: areaUnitFor(unit),
    piPolicy,
    fixtureId: fixture.id,
    outerRadius: fixture.outerRadius,
    outerHeight: fixture.outerHeight,
    outerSlantHeight: fixture.outerSlantHeight,
    innerRadius: fixture.innerRadius,
    innerHeight: fixture.innerHeight,
    innerSlantHeight: fixture.innerSlantHeight,
    scaleNumerator: surfaceFamily ? null : similar.scaleNumerator ?? null,
    scaleDenominator: surfaceFamily ? null : similar.scaleDenominator ?? null,
    ratePerSquareMetre,
    outerCurvedCoefficient,
    innerCurvedCoefficient,
    bothCurvedCoefficient,
    answerCoefficientBeforePi,
    sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING",
  };
}

function createStem(state: MenCp011ConicalSurfaceCostState) {
  const R = dimension(state.outerRadius, state.unit);
  const L = dimension(state.outerSlantHeight, state.unit);
  const r = dimension(state.innerRadius, state.unit);
  const l = dimension(state.innerSlantHeight, state.unit);
  const instruction = piInstruction(state.piPolicy);

  if (state.target === "AREA") {
    const variants = [
      `A hollow conical shell has outer radius ${R} and outer slant height ${L}. Its inner conical surface has radius ${r} and slant height ${l}. Find the total area of the outer and inner curved surfaces only. ${instruction}`,
      `The outside of a conical casing has radius ${R} and slant height ${L}; the inside has radius ${r} and slant height ${l}. Calculate the combined curved surface area, excluding circular rims. ${instruction}`,
      `A conical shell exposes both its outer curved wall and inner curved wall. Their radius–slant-height pairs are ${R}, ${L} and ${r}, ${l}. Find the sum of the two curved areas. ${instruction}`,
      `For a hollow cone, the outer curved boundary is defined by radius ${R} and slant height ${L}, while the inner boundary uses radius ${r} and slant height ${l}. Determine both curved surfaces together. ${instruction}`,
      `A metal conical sleeve has an outer curved surface with radius ${R}, slant height ${L}, and an inner curved surface with radius ${r}, slant height ${l}. Find their combined area. ${instruction}`,
      `The circular edges of a hollow conical shell are not included. If the outer radius and slant height are ${R} and ${L}, and the inner values are ${r} and ${l}, calculate the area of both curved walls. ${instruction}`,
      `A hollow conical body is to be coated on both curved sides. The outer side measures ${R} in radius and ${L} in slant height; the inner side measures ${r} and ${l}. Find the coating area. ${instruction}`,
      `Only the two sloping surfaces of a conical shell are counted. The outer pair is ${R}, ${L}; the inner pair is ${r}, ${l}. What is the required curved area? ${instruction}`,
    ] as const;
    return choose(
      variants,
      `conical-surface-cost:stem:${state.prototypeId}:${state.seed}:${state.fixtureId}:${state.piPolicy}`,
    );
  }

  const p = state.scaleNumerator!;
  const q = state.scaleDenominator!;
  const ratio = ratioText(p, q);
  const rate = state.ratePerSquareMetre!;
  const variants = [
    `A conical shell has outer radius ${R} and outer slant height ${L}. Its inner wall is declared similar at linear scale ${ratio}. Find the cost of lining only the inner curved surface at ₹${rate} per m². ${instruction}`,
    `The outer cone of a casing has radius ${R} and slant height ${L}. The coaxial inner surface is similar with inner-to-outer scale ${ratio}. Calculate the inner curved lining cost at ₹${rate}/m². ${instruction}`,
    `A hollow conical vessel has outer measurements ${R} and ${L}. Its inner conical boundary is explicitly similar at scale ${ratio}. What is the cost of lining the inner sloping wall at ₹${rate} per square metre? ${instruction}`,
    `For a conical shell, the inner and outer walls are declared parallel in axial section, giving linear ratio ${ratio}. The outer radius is ${R} and outer slant height is ${L}. Find the inner curved-surface lining cost at ₹${rate}/m². ${instruction}`,
      `A conical casing has outer radius ${R} and outer slant height ${L}. Every inner linear dimension is ${ratio} of the matching outer dimension. Determine the cost of lining only the inner curved wall at ₹${rate} per m². ${instruction}`,
      `The inner boundary of a hollow cone is similar to the outer boundary at scale ${ratio}. Given outer radius ${R}, outer slant height ${L}, and lining rate ₹${rate}/m², calculate the inner lining cost. ${instruction}`,
      `An outer cone measures ${R} in radius and ${L} in slant height. Its declared similar inner wall has scale factor ${ratio}. Find the amount charged for lining the inner curved surface at ₹${rate} per square metre. ${instruction}`,
      `A conical shell is lined on its inside only. The outer radius and slant height are ${R} and ${L}; the similar inner wall uses scale ${ratio}. Calculate the lining cost at ₹${rate}/m². ${instruction}`,
  ] as const;
  return choose(
    variants,
    `conical-surface-cost:stem:${state.prototypeId}:${state.seed}:${state.fixtureId}:${state.piPolicy}`,
  );
}

function candidatesFor(state: MenCp011ConicalSurfaceCostState): Candidate[] {
  if (state.target === "AREA") {
    return [
      {
        value: applyPiPolicy(state.bothCurvedCoefficient, state.piPolicy),
        misconceptionId: null,
        explanation: "",
      },
      {
        value: applyPiPolicy(state.outerCurvedCoefficient, state.piPolicy),
        misconceptionId: "USED_OUTER_CURVED_SURFACE_ONLY",
        explanation: "counting only the outer curved wall and ignoring the inner wall",
      },
      {
        value: applyPiPolicy(state.innerCurvedCoefficient, state.piPolicy),
        misconceptionId: "USED_INNER_CURVED_SURFACE_ONLY",
        explanation: "counting only the inner curved wall instead of both sides",
      },
      {
        value: applyPiPolicy(
          state.outerCurvedCoefficient - state.innerCurvedCoefficient,
          state.piPolicy,
        ),
        misconceptionId: "SUBTRACTED_INNER_CURVED_SURFACE",
        explanation: "subtracting the inner exposed wall even though both curved surfaces are included",
      },
    ];
  }

  const rate = state.ratePerSquareMetre!;
  return [
    {
      value: applyPiPolicy(
        state.innerCurvedCoefficient * rate,
        state.piPolicy,
      ),
      misconceptionId: null,
      explanation: "",
    },
    {
      value: applyPiPolicy(
        state.outerCurvedCoefficient * rate,
        state.piPolicy,
      ),
      misconceptionId: "USED_OUTER_SURFACE_FOR_INNER_LINING",
      explanation: "charging for the outer curved surface instead of the inner lining surface",
    },
    {
      value: applyPiPolicy(
        state.bothCurvedCoefficient * rate,
        state.piPolicy,
      ),
      misconceptionId: "CHARGED_BOTH_CURVED_SURFACES",
      explanation: "charging for both curved walls even though only the inner wall is lined",
    },
    {
      value: applyPiPolicy(state.innerCurvedCoefficient, state.piPolicy),
      misconceptionId: "OMITTED_LINING_RATE",
      explanation: "stopping at the inner area and failing to multiply by the rate per square metre",
    },
  ];
}

function arrangeCandidates(
  candidates: readonly Candidate[],
  seed: string,
  forcedCorrectIndex?: 0 | 1 | 2 | 3,
) {
  const correct = candidates.find(
    (candidate) => candidate.misconceptionId === null,
  )!;
  const wrong = candidates.filter(
    (candidate) => candidate.misconceptionId !== null,
  );
  const correctIndex =
    forcedCorrectIndex ??
    (hashText(`conical-surface-cost:correct-index:${seed}`) % 4 as
      | 0
      | 1
      | 2
      | 3);
  const wrongOffset =
    hashText(`conical-surface-cost:wrong-order:${seed}`) % wrong.length;
  const orderedWrong = wrong.map(
    (_, index) => wrong[(index + wrongOffset) % wrong.length]!,
  );
  const arranged: Candidate[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    arranged.push(
      index === correctIndex ? correct : orderedWrong[wrongIndex++]!,
    );
  }
  return { arranged, correctIndex };
}

function buildDiagram(
  state: MenCp011ConicalSurfaceCostState,
  role: DiagramRole,
): MenCp011ConicalSurfaceCostDiagram {
  const relationLabel =
    state.target === "AREA"
      ? "include outer + inner curved walls"
      : `inner wall scale ${state.scaleNumerator}/${state.scaleDenominator}; rate ₹${state.ratePerSquareMetre}/m²`;
  const innerLabel =
    state.target === "AREA" || role === "SOLUTION"
      ? `r = ${state.innerRadius} ${state.unit}; l = ${state.innerSlantHeight} ${state.unit}`
      : `r = ${state.scaleNumerator}/${state.scaleDenominator} R; l = ${state.scaleNumerator}/${state.scaleDenominator} L`;
  const outerLabel =
    `R = ${state.outerRadius} ${state.unit}; L = ${state.outerSlantHeight} ${state.unit}`;
  const includedLabel =
    state.target === "AREA"
      ? "shaded intent: both curved walls"
      : "shaded intent: inner curved lining only";
  const svg = `<svg viewBox="0 0 570 340" role="img" aria-label="Conical shell surface diagram; ${outerLabel}; ${innerLabel}; ${relationLabel}; not to scale" data-diagram-version="CONICAL_SURFACE_COST_EXAMTREE_V1" data-diagram-role="${role}" data-shape="CONE" data-target="${state.target}" data-relation="${state.relation}" data-responsive="true" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="568" height="338" rx="10" fill="white" stroke="black"/>
  <g fill="none" stroke="black" stroke-width="2">
    <path data-region="outer-curved-wall" d="M285 42 L80 252 M285 42 L490 252"/>
    <ellipse data-region="outer-rim" cx="285" cy="252" rx="205" ry="34"/>
    <path data-region="inner-curved-wall" data-boundary="dashed" stroke-dasharray="7 5" d="M285 132 L170 252 M285 132 L400 252"/>
    <ellipse data-region="inner-rim" data-boundary="dashed" stroke-dasharray="7 5" cx="285" cy="252" rx="115" ry="19"/>
    <path data-dimension="outer-slant-height" d="M285 42 L490 252"/>
    <path data-dimension="inner-slant-height" stroke-dasharray="4 4" d="M285 132 L400 252"/>
    <path data-dimension="outer-radius" d="M285 252 L490 252"/>
    <path data-dimension="inner-radius" stroke-dasharray="4 4" d="M285 252 L400 252"/>
  </g>
  <g font-family="Arial, sans-serif" font-size="14" fill="black">
    <text x="24" y="28">ExamTree conical shell surfaces</text>
    <text x="24" y="50">${outerLabel}</text>
    <text data-role="inner-dimension-label" x="24" y="72">${innerLabel}</text>
    <text x="24" y="94">${relationLabel}</text>
    <text x="24" y="116">${includedLabel}</text>
    <text x="450" y="150">L</text>
    <text x="385" y="190">l</text>
    <text x="408" y="244">r</text>
    <text x="500" y="244">R</text>
    <text x="192" y="290">dashed wall = inner conical boundary</text>
    <text x="454" y="322">not to scale</text>
  </g>
</svg>`;
  return {
    kind: "CONICAL_SHELL_SURFACE",
    svg,
    accessibleText:
      `Axial view of a conical shell. ${outerLabel}. ${innerLabel}. ${relationLabel}. ${includedLabel}.`,
    visibleLabels: [outerLabel, innerLabel, relationLabel, includedLabel],
    notToScale: true,
  };
}

function displayValue(
  value: ExactValue,
  state: MenCp011ConicalSurfaceCostState,
) {
  return state.target === "AREA"
    ? formatWithUnit(value, state.areaUnit as Men002Unit)
    : formatCurrency(value);
}

function buildExplanation(
  state: MenCp011ConicalSurfaceCostState,
  options: MenCp011ConicalSurfaceCostOption[],
) {
  const finalValue = applyPiPolicy(
    state.answerCoefficientBeforePi,
    state.piPolicy,
  );
  const finalAnswer = displayValue(finalValue, state);
  const piSubstitution =
    state.piPolicy === "EXACT_PI"
      ? "\\pi"
      : state.piPolicy === "PI_22_OVER_7"
        ? "\\frac{22}{7}"
        : "\\frac{157}{50}";
  const catalog = candidatesFor(state);
  const wrongOptionAnalysis = options
    .filter((option) => !option.isCorrect)
    .map((option) => {
      const candidate = catalog.find(
        (item) => item.misconceptionId === option.misconceptionId,
      );
      return `${option.display} comes from ${candidate?.explanation}.`;
    });

  if (state.target === "AREA") {
    const formula = "$A_{both}=\\pi RL+\\pi rl=\\pi(RL+rl)$";
    const steps = [
      {
        title: "Identify the included surfaces",
        body:
          "Both sloping walls are exposed. Circular rims or bases are not part of this curved-surface request.",
        equation: "$A_{both}=A_{outer\ curved}+A_{inner\ curved}$",
      },
      {
        title: "Build the curved-area coefficient",
        body:
          `Use outer radius and outer slant height, then inner radius and inner slant height.`,
        equation:
          `$RL+rl=${state.outerRadius}(${state.outerSlantHeight})+${state.innerRadius}(${state.innerSlantHeight})=${state.outerCurvedCoefficient}+${state.innerCurvedCoefficient}=${state.bothCurvedCoefficient}$`,
      },
      {
        title: "Apply the declared pi policy",
        body: `Multiply the combined coefficient by pi. The required area is ${finalAnswer}.`,
        equation: `$A=(${piSubstitution})(${state.bothCurvedCoefficient})$`,
      },
    ];
    const shortcut =
      "Factor out the common π immediately: calculate $RL+rl$ first, then apply the declared π value once.";
    const keyRule =
      "When both inner and outer curved walls are included, add their curved surface areas. Do not subtract the inner wall merely because it bounds a void.";
    return {
      learnerSolution: {
        formula,
        steps: steps.map(
          (step) =>
            `${step.title}: ${step.body}${step.equation ? ` ${step.equation}` : ""}`,
        ),
        finalAnswer,
        shortcut,
        wrongOptionAnalysis,
      },
      explanation: { keyRule, steps, shortcut, traps: wrongOptionAnalysis },
    };
  }

  const p = state.scaleNumerator!;
  const q = state.scaleDenominator!;
  const rate = state.ratePerSquareMetre!;
  const formula = "$\\text{Cost}=\\pi rl\\times\\text{rate}$";
  const steps = [
    {
      title: "Recover the inner shell dimensions",
      body:
        `The inner wall is part of a declared similar shell, so the same linear scale applies to radius and slant height.`,
      equation:
        `$r=\\frac{${p}}{${q}}(${state.outerRadius})=${state.innerRadius}\\text{ m},\\quad l=\\frac{${p}}{${q}}(${state.outerSlantHeight})=${state.innerSlantHeight}\\text{ m}$`,
    },
    {
      title: "Find the inner curved area",
      body:
        "Only the inside sloping wall is lined; the outer wall and circular opening are excluded.",
      equation:
        `$A_{inner}=(${piSubstitution})(${state.innerRadius})(${state.innerSlantHeight})$`,
    },
    {
      title: "Apply the lining rate",
      body:
        `Multiply the inner area by ₹${rate} per square metre. The required cost is ${finalAnswer}.`,
      equation:
        `$\\text{Cost}=(${piSubstitution})(${state.innerCurvedCoefficient})(${rate})$`,
    },
  ];
  const shortcut =
    `Similar curved areas scale as the square of the linear factor. With $k=\\frac{${p}}{${q}}$, use $A_{inner}=k^2A_{outer}$, then multiply by the rate.`;
  const keyRule =
    "This belongs to shell reasoning because the inner lining dimensions are recovered from the declared inner–outer relation. After that, cost equals inner curved area times the rate per square metre.";
  return {
    learnerSolution: {
      formula,
      steps: steps.map(
        (step) =>
          `${step.title}: ${step.body}${step.equation ? ` ${step.equation}` : ""}`,
      ),
      finalAnswer,
      shortcut,
      wrongOptionAnalysis,
    },
    explanation: { keyRule, steps, shortcut, traps: wrongOptionAnalysis },
  };
}

function verify(
  state: MenCp011ConicalSurfaceCostState,
  exactAnswer: ExactValue,
) {
  let reconstructed: ExactValue;
  let method: string;
  if (state.target === "AREA") {
    reconstructed = applyPiPolicy(
      state.outerRadius * state.outerSlantHeight +
        state.innerRadius * state.innerSlantHeight,
      state.piPolicy,
    );
    method =
      "Independent surface ledger: reconstruct outer πRL and inner πrl separately, then add because both curved walls are included.";
  } else {
    const p = state.scaleNumerator!;
    const q = state.scaleDenominator!;
    reconstructed = applyPiPolicy(
      state.outerCurvedCoefficient * p * p * state.ratePerSquareMetre!,
      state.piPolicy,
    );
    const denominator = q * q;
    if (state.piPolicy === "PI_22_OVER_7") {
      reconstructed = rational(
        22n * state.outerCurvedCoefficient * p * p * state.ratePerSquareMetre!,
        7n * denominator,
      );
    } else {
      reconstructed = rational(
        157n * state.outerCurvedCoefficient * p * p * state.ratePerSquareMetre!,
        50n * denominator,
      );
    }
    method =
      "Independent similar-area verifier: inner curved area is k² times outer curved area, followed by the declared rate.";
  }
  return {
    valid: exactEquals(exactAnswer, reconstructed),
    method,
    reconstructed:
      state.target === "AREA"
        ? `${formatExactPlain(reconstructed)} ${state.areaUnit}`
        : formatCurrency(reconstructed),
  };
}

function countDollars(text: string) {
  return (text.match(/\$/g) ?? []).length;
}

function learnerText(
  question: Omit<MenCp011ConicalSurfaceCostPackage, "validation">,
) {
  return [
    question.stem,
    ...question.options.map((option) => option.display),
    question.answer,
    question.learnerSolution.formula,
    ...question.learnerSolution.steps,
    question.learnerSolution.finalAnswer,
    question.learnerSolution.shortcut,
    ...question.learnerSolution.wrongOptionAnalysis,
    question.explanation.keyRule,
    ...question.explanation.steps.flatMap((step) => [
      step.title,
      step.body,
      step.equation ?? "",
    ]),
    question.explanation.shortcut,
    ...question.explanation.traps,
  ].join("\n");
}

function validate(
  question: Omit<MenCp011ConicalSurfaceCostPackage, "validation">,
) {
  const checks: Array<{ name: string; passed: boolean; message: string }> = [];
  const add = (name: string, passed: boolean, message: string) =>
    checks.push({ name, passed, message });
  const state = question.state;
  const learner = learnerText(question);

  add(
    "authority",
    question.conicalSurfaceCostAuthority ===
      MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY,
    "The conical surface/cost authority must match the wave authority.",
  );
  add(
    "Pythagorean dimensions",
    state.outerSlantHeight * state.outerSlantHeight ===
        state.outerRadius * state.outerRadius +
          state.outerHeight * state.outerHeight &&
      state.innerSlantHeight * state.innerSlantHeight ===
        state.innerRadius * state.innerRadius +
          state.innerHeight * state.innerHeight,
    "Outer and inner slant heights must satisfy the cone Pythagorean relation.",
  );
  add(
    "physical containment",
    state.innerRadius < state.outerRadius &&
      state.innerHeight <= state.outerHeight &&
      state.innerSlantHeight < state.outerSlantHeight,
    "The inner conical wall must fit inside the outer boundary.",
  );
  const similarityValid =
    state.target !== "COST" ||
    (state.scaleNumerator !== null &&
      state.scaleDenominator !== null &&
      state.innerRadius * state.scaleDenominator ===
        state.outerRadius * state.scaleNumerator &&
      state.innerHeight * state.scaleDenominator ===
        state.outerHeight * state.scaleNumerator &&
      state.innerSlantHeight * state.scaleDenominator ===
        state.outerSlantHeight * state.scaleNumerator);
  add(
    "declared shell relation",
    similarityValid,
    "A lining-cost state must satisfy the declared similarity scale for radius, height and slant height.",
  );
  add(
    "numeric cost policy",
    state.target !== "COST" ||
      (state.unit === "m" &&
        state.ratePerSquareMetre !== null &&
        state.ratePerSquareMetre > 0n &&
        state.piPolicy !== "EXACT_PI"),
    "Cost questions require metres, a positive ₹/m² rate and a numeric π policy.",
  );
  add(
    "exact answer verification",
    question.verification.valid,
    "An independent method must reconstruct the exact answer.",
  );
  add(
    "four unique options",
    question.options.length === 4 &&
      new Set(question.options.map((option) => exactKey(option.value))).size === 4,
    "The item must contain four structurally unique exact options.",
  );
  add(
    "one correct option",
    question.options.filter((option) => option.isCorrect).length === 1 &&
      question.options[question.correctIndex]?.isCorrect === true &&
      exactEquals(
        question.exactAnswer,
        question.options[question.correctIndex]!.value,
      ),
    "Exactly one option at the recorded position must equal the exact answer.",
  );
  add(
    "diagram contract",
    question.diagram.svg.includes(
      'data-diagram-version="CONICAL_SURFACE_COST_EXAMTREE_V1"',
    ) &&
      question.diagram.svg.includes('data-diagram-role="PROMPT"') &&
      question.solutionDiagram.svg.includes(
        'data-diagram-role="SOLUTION"',
      ) &&
      question.diagram.svg.includes(`data-target="${state.target}"`) &&
      !/<svg[^>]+\bwidth="\d+/.test(question.diagram.svg) &&
      !/<svg[^>]+\bwidth="\d+/.test(question.solutionDiagram.svg),
    "Prompt and solution diagrams must represent the included conical surfaces responsively.",
  );
  add(
    "stem completeness",
    question.stem.includes(`${state.outerRadius}`) &&
      question.stem.includes(`${state.outerSlantHeight}`) &&
      (state.target === "AREA"
        ? question.stem.includes(`${state.innerRadius}`) &&
          question.stem.includes(`${state.innerSlantHeight}`)
        : question.stem.includes(`${state.scaleNumerator}`) &&
          question.stem.includes(`${state.scaleDenominator}`) &&
          question.stem.includes(`${state.ratePerSquareMetre}`)),
    "The text-only stem must provide the complete surface or shell-derived cost relation.",
  );
  add(
    "balanced MathJax",
    countDollars(learner) % 2 === 0 && !/\$\$/.test(learner),
    "Learner-visible MathJax delimiters must be balanced and non-empty.",
  );
  add(
    "learner-admin separation",
    !/\[(?:USED_|CHARGED_|OMITTED_|SUBTRACTED_|MEN-CP011-PROT-)/.test(learner) &&
      question.renderSurfaces.attempt.diagram === null &&
      question.renderSurfaces.admin.exposesInternalCodes,
    "Prototype and misconception codes must remain admin-only.",
  );
  add(
    "wrong-option teaching",
    question.learnerSolution.wrongOptionAnalysis.length === 3 &&
      question.learnerSolution.wrongOptionAnalysis.every(
        (line) => line.length >= 45,
      ),
    "All three displayed wrong options must have natural calculation-based explanations.",
  );
  add(
    "lifecycle locks",
    question.permanentQlId === null &&
      question.questionBankStatus === "NOT_STORED" &&
      question.testEligibility === "INELIGIBLE" &&
      !question.publiclyPublishable &&
      !question.questionStudioDiscoverable,
    "All discovery lifecycle locks must remain active.",
  );

  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp011ConicalSurfaceCostQuestion(
  prototypeId: MenCp011ConicalSurfaceCostPrototypeId,
  seed: string,
  constraints: MenCp011ConicalSurfaceCostGenerationConstraints = {},
): MenCp011ConicalSurfaceCostPackage {
  for (let attempt = 0; attempt < 48; attempt += 1) {
    const state = createState(prototypeId, seed, constraints, attempt);
    const candidates = candidatesFor(state);
    if (
      new Set(candidates.map((candidate) => exactKey(candidate.value))).size !== 4
    ) {
      continue;
    }
    const permutationSeed =
      `${MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY}|options|${prototypeId}|${seed}|${attempt}`;
    const { arranged, correctIndex } = arrangeCandidates(
      candidates,
      permutationSeed,
      constraints.correctIndex,
    );
    const options: MenCp011ConicalSurfaceCostOption[] = arranged.map(
      (candidate, index) => ({
        label: LABELS[index]!,
        value: candidate.value,
        display: displayValue(candidate.value, state),
        isCorrect: candidate.misconceptionId === null,
        misconceptionId: candidate.misconceptionId,
      }),
    );
    const exactAnswer = applyPiPolicy(
      state.answerCoefficientBeforePi,
      state.piPolicy,
    );
    const verification = verify(state, exactAnswer);
    const diagram = buildDiagram(state, "PROMPT");
    const solutionDiagram = buildDiagram(state, "SOLUTION");
    const explanationParts = buildExplanation(state, options);
    const withoutValidation: Omit<
      MenCp011ConicalSurfaceCostPackage,
      "validation"
    > = {
      packageId: "MEN-002",
      canonicalProblemId: "MEN-CP-011",
      permanentQlId: null,
      waveId: "MEN-CP-011-CONICAL-SURFACE-COST-WAVE-01",
      prototypeId,
      solveMode: state.solveMode,
      language: "en",
      seed,
      difficulty: state.difficulty,
      target: state.target,
      unit: state.target === "AREA" ? state.areaUnit : "₹",
      conicalSurfaceCostAuthority:
        MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY,
      sourceMaturity: state.sourceMaturity,
      stem: createStem(state),
      options,
      correctIndex,
      answer: displayValue(exactAnswer, state),
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
          diagramPolicy: "OPTIONAL_PROMPT_SAFE_CONICAL_SURFACE_DIAGRAM",
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
    `Unable to generate a valid MEN-CP-011 conical surface/cost package for ${prototypeId} and seed ${seed}.`,
  );
}

export interface MenCp011ConicalSurfaceCostReviewBatch {
  authority: typeof MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY;
  records: MenCp011ConicalSurfaceCostPackage[];
}

export function generateMenCp011ConicalSurfaceCostReviewBatch(): MenCp011ConicalSurfaceCostReviewBatch {
  const records: MenCp011ConicalSurfaceCostPackage[] = [];
  const surfaceId =
    "MEN-CP011-PROT-HOLLOW-CONE-CURVED-AREA-BOTH-SIDES" as const;
  const liningId =
    "MEN-CP011-PROT-INNER-CONICAL-LINING-COST-FROM-SHELL" as const;
  const units: readonly MenCp011ConicalSurfaceCostLinearUnit[] = ["cm", "m"];

  for (let unitIndex = 0; unitIndex < units.length; unitIndex += 1) {
    for (let piIndex = 0; piIndex < AREA_PI_POLICIES.length; piIndex += 1) {
      for (let fixtureOffset = 0; fixtureOffset < 4; fixtureOffset += 1) {
        const fixtureIndex =
          (fixtureOffset + piIndex * 2 + unitIndex) % 8;
        records.push(
          generateMenCp011ConicalSurfaceCostQuestion(
            surfaceId,
            `conical-surface-review:${units[unitIndex]}:${AREA_PI_POLICIES[piIndex]}:${fixtureIndex}`,
            {
              unit: units[unitIndex],
              piPolicy: AREA_PI_POLICIES[piIndex],
              fixtureIndex,
              correctIndex: fixtureOffset as 0 | 1 | 2 | 3,
            },
          ),
        );
      }
    }
  }

  for (let piIndex = 0; piIndex < COST_PI_POLICIES.length; piIndex += 1) {
    for (let fixtureIndex = 0; fixtureIndex < 8; fixtureIndex += 1) {
      records.push(
        generateMenCp011ConicalSurfaceCostQuestion(
          liningId,
          `conical-lining-review:${COST_PI_POLICIES[piIndex]}:${fixtureIndex}`,
          {
            unit: "m",
            piPolicy: COST_PI_POLICIES[piIndex],
            fixtureIndex,
            correctIndex: ((fixtureIndex + piIndex) % 4) as 0 | 1 | 2 | 3,
          },
        ),
      );
    }
  }

  return {
    authority: MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY,
    records,
  };
}

function normalizeStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/₹\d+/g, "₹<rate>")
    .replace(/\d+/g, "<n>")
    .replace(/\s+/g, " ")
    .trim();
}

export interface MenCp011ConicalSurfaceCostAudit {
  authority: typeof MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY;
  prototypeCount: number;
  recordCount: number;
  exactStemCount: number;
  exactQuestionOptionCount: number;
  maximumNormalizedStemRepetition: number;
  uniquePhysicalStateCount: number;
  targetCounts: Record<"AREA" | "COST", number>;
  answerPositionCounts: Record<Label, number>;
  unitCounts: Record<string, number>;
  piPolicyCounts: Record<MenCp011ConicalSurfaceCostPiPolicy, number>;
  publicationEligible: false;
}

export function auditMenCp011ConicalSurfaceCostBatch(
  records: readonly MenCp011ConicalSurfaceCostPackage[],
): MenCp011ConicalSurfaceCostAudit {
  const normalizedCounts = new Map<string, number>();
  const exactStems = new Set<string>();
  const exactPackages = new Set<string>();
  const physicalStates = new Set<string>();
  const targetCounts = { AREA: 0, COST: 0 };
  const answerPositionCounts: Record<Label, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };
  const unitCounts: Record<string, number> = {};
  const piPolicyCounts: Record<MenCp011ConicalSurfaceCostPiPolicy, number> = {
    EXACT_PI: 0,
    PI_22_OVER_7: 0,
    PI_3_14: 0,
  };

  for (const question of records) {
    const normalized = normalizeStem(question.stem);
    normalizedCounts.set(
      normalized,
      (normalizedCounts.get(normalized) ?? 0) + 1,
    );
    exactStems.add(question.stem);
    exactPackages.add(
      `${question.stem}|${question.options
        .map((option) => exactKey(option.value))
        .join("|")}`,
    );
    physicalStates.add(
      [
        question.prototypeId,
        question.state.fixtureId,
        question.state.unit,
        question.state.piPolicy,
        question.state.ratePerSquareMetre ?? "NO_RATE",
      ].join("|"),
    );
    targetCounts[question.target] += 1;
    answerPositionCounts[LABELS[question.correctIndex]!] += 1;
    unitCounts[question.state.unit] =
      (unitCounts[question.state.unit] ?? 0) + 1;
    piPolicyCounts[question.state.piPolicy] += 1;
  }

  return {
    authority: MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY,
    prototypeCount: new Set(records.map((record) => record.prototypeId)).size,
    recordCount: records.length,
    exactStemCount: exactStems.size,
    exactQuestionOptionCount: exactPackages.size,
    maximumNormalizedStemRepetition: Math.max(
      0,
      ...normalizedCounts.values(),
    ),
    uniquePhysicalStateCount: physicalStates.size,
    targetCounts,
    answerPositionCounts,
    unitCounts,
    piPolicyCounts,
    publicationEligible: false,
  };
}
