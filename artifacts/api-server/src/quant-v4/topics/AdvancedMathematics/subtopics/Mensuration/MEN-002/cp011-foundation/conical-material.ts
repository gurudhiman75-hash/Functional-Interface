import {
  exactEquals,
  exactKey,
  formatExactPlain,
  formatWithUnit,
  pi,
  rational,
} from "../foundation/exact";
import type { ExactValue, Men002Difficulty, Men002Unit } from "../foundation/types";

export const MEN_CP011_CONICAL_MATERIAL_AUTHORITY =
  "MEN-CP011-CONICAL-MATERIAL-WAVE-01-V1" as const;

export type MenCp011ConicalMaterialPrototypeId =
  | "MEN-CP011-PROT-HOLLOW-CONE-MATERIAL-VOLUME-EXPLICIT-INNER"
  | "MEN-CP011-PROT-HOLLOW-CONE-MATERIAL-VOLUME-SIMILAR-WALL";

export type MenCp011ConicalMaterialSolveMode =
  | "findHollowConeMaterialVolumeFromExplicitInnerCone"
  | "findHollowConeMaterialVolumeFromDeclaredSimilarWall";

export type MenCp011ConicalMaterialRelation =
  | "EXPLICIT_SHARED_BASE_INNER_CONE"
  | "DECLARED_SIMILAR_SHARED_BASE_WALL";

export type MenCp011ConicalMaterialPiPolicy =
  | "EXACT_PI"
  | "PI_22_OVER_7"
  | "PI_3_14";

export type MenCp011ConicalMaterialLinearUnit = "cm" | "m";
export type MenCp011ConicalMaterialVolumeUnit = "cm³" | "m³";
type Label = "A" | "B" | "C" | "D";
type DiagramRole = "PROMPT" | "SOLUTION";

export interface MenCp011ConicalMaterialDefinition {
  prototypeId: MenCp011ConicalMaterialPrototypeId;
  solveMode: MenCp011ConicalMaterialSolveMode;
  relation: MenCp011ConicalMaterialRelation;
  difficulty: Men002Difficulty;
}

export const MEN_CP011_CONICAL_MATERIAL_PROTOTYPES: readonly MenCp011ConicalMaterialDefinition[] = [
  {
    prototypeId:
      "MEN-CP011-PROT-HOLLOW-CONE-MATERIAL-VOLUME-EXPLICIT-INNER",
    solveMode: "findHollowConeMaterialVolumeFromExplicitInnerCone",
    relation: "EXPLICIT_SHARED_BASE_INNER_CONE",
    difficulty: "Hard",
  },
  {
    prototypeId:
      "MEN-CP011-PROT-HOLLOW-CONE-MATERIAL-VOLUME-SIMILAR-WALL",
    solveMode: "findHollowConeMaterialVolumeFromDeclaredSimilarWall",
    relation: "DECLARED_SIMILAR_SHARED_BASE_WALL",
    difficulty: "Hard",
  },
] as const;

const DEFINITION_BY_ID = new Map(
  MEN_CP011_CONICAL_MATERIAL_PROTOTYPES.map((definition) => [
    definition.prototypeId,
    definition,
  ]),
);

export function getMenCp011ConicalMaterialPrototypeIds() {
  return MEN_CP011_CONICAL_MATERIAL_PROTOTYPES.map(
    (definition) => definition.prototypeId,
  );
}

export function getMenCp011ConicalMaterialDefinition(
  prototypeId: MenCp011ConicalMaterialPrototypeId,
) {
  const definition = DEFINITION_BY_ID.get(prototypeId);
  if (!definition) {
    throw new Error(
      `Unknown MEN-CP-011 conical-material prototype ${prototypeId}.`,
    );
  }
  return definition;
}

interface ExplicitConeFixture {
  id: string;
  outerRadius: bigint;
  outerHeight: bigint;
  innerRadius: bigint;
  innerHeight: bigint;
}

interface SimilarConeFixture extends ExplicitConeFixture {
  scaleNumerator: bigint;
  scaleDenominator: bigint;
}

const EXPLICIT_FIXTURES: readonly ExplicitConeFixture[] = [
  { id: "CE-01", outerRadius: 10n, outerHeight: 24n, innerRadius: 6n, innerHeight: 8n },
  { id: "CE-02", outerRadius: 13n, outerHeight: 84n, innerRadius: 5n, innerHeight: 12n },
  { id: "CE-03", outerRadius: 12n, outerHeight: 35n, innerRadius: 4n, innerHeight: 9n },
  { id: "CE-04", outerRadius: 15n, outerHeight: 36n, innerRadius: 9n, innerHeight: 12n },
  { id: "CE-05", outerRadius: 17n, outerHeight: 40n, innerRadius: 8n, innerHeight: 15n },
  { id: "CE-06", outerRadius: 20n, outerHeight: 48n, innerRadius: 12n, innerHeight: 16n },
  { id: "CE-07", outerRadius: 21n, outerHeight: 28n, innerRadius: 7n, innerHeight: 12n },
  { id: "CE-08", outerRadius: 25n, outerHeight: 60n, innerRadius: 15n, innerHeight: 20n },
] as const;

const SIMILAR_FIXTURES: readonly SimilarConeFixture[] = [
  { id: "CS-01", outerRadius: 10n, outerHeight: 24n, innerRadius: 5n, innerHeight: 12n, scaleNumerator: 1n, scaleDenominator: 2n },
  { id: "CS-02", outerRadius: 12n, outerHeight: 16n, innerRadius: 6n, innerHeight: 8n, scaleNumerator: 1n, scaleDenominator: 2n },
  { id: "CS-03", outerRadius: 15n, outerHeight: 21n, innerRadius: 10n, innerHeight: 14n, scaleNumerator: 2n, scaleDenominator: 3n },
  { id: "CS-04", outerRadius: 18n, outerHeight: 24n, innerRadius: 12n, innerHeight: 16n, scaleNumerator: 2n, scaleDenominator: 3n },
  { id: "CS-05", outerRadius: 20n, outerHeight: 28n, innerRadius: 15n, innerHeight: 21n, scaleNumerator: 3n, scaleDenominator: 4n },
  { id: "CS-06", outerRadius: 24n, outerHeight: 32n, innerRadius: 18n, innerHeight: 24n, scaleNumerator: 3n, scaleDenominator: 4n },
  { id: "CS-07", outerRadius: 18n, outerHeight: 30n, innerRadius: 6n, innerHeight: 10n, scaleNumerator: 1n, scaleDenominator: 3n },
  { id: "CS-08", outerRadius: 24n, outerHeight: 36n, innerRadius: 8n, innerHeight: 12n, scaleNumerator: 1n, scaleDenominator: 3n },
] as const;

export interface MenCp011ConicalMaterialState {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-CONICAL-MATERIAL-WAVE-01";
  prototypeId: MenCp011ConicalMaterialPrototypeId;
  solveMode: MenCp011ConicalMaterialSolveMode;
  target: "VOLUME";
  shape: "CONE";
  topology: "HOLLOW_SHARED_BASE_CAVITY";
  relation: MenCp011ConicalMaterialRelation;
  seed: string;
  stateSelectionAttempt: number;
  difficulty: Men002Difficulty;
  unit: MenCp011ConicalMaterialLinearUnit;
  volumeUnit: MenCp011ConicalMaterialVolumeUnit;
  piPolicy: MenCp011ConicalMaterialPiPolicy;
  fixtureId: string;
  outerRadius: bigint;
  outerHeight: bigint;
  innerRadius: bigint;
  innerHeight: bigint;
  scaleNumerator: bigint | null;
  scaleDenominator: bigint | null;
  outerVolumeCoefficient: bigint;
  innerVolumeCoefficient: bigint;
  materialVolumeCoefficient: bigint;
  sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING";
}

export interface MenCp011ConicalMaterialOption {
  label: Label;
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp011ConicalMaterialDiagram {
  kind: "CONICAL_SHELL";
  svg: string;
  accessibleText: string;
  visibleLabels: readonly string[];
  notToScale: true;
}

export interface MenCp011ConicalMaterialLearnerSolution {
  formula: string;
  steps: string[];
  finalAnswer: string;
  shortcut: string;
  wrongOptionAnalysis: string[];
}

export interface MenCp011ConicalMaterialPackage {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-CONICAL-MATERIAL-WAVE-01";
  prototypeId: MenCp011ConicalMaterialPrototypeId;
  solveMode: MenCp011ConicalMaterialSolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: "VOLUME";
  unit: MenCp011ConicalMaterialVolumeUnit;
  conicalMaterialAuthority: typeof MEN_CP011_CONICAL_MATERIAL_AUTHORITY;
  sourceMaturity: "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING";
  stem: string;
  options: MenCp011ConicalMaterialOption[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  optionPermutationSeed: string;
  state: MenCp011ConicalMaterialState;
  diagram: MenCp011ConicalMaterialDiagram;
  solutionDiagram: MenCp011ConicalMaterialDiagram;
  learnerSolution: MenCp011ConicalMaterialLearnerSolution;
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
      diagram: MenCp011ConicalMaterialDiagram;
      diagramPolicy: "OPTIONAL_PROMPT_SAFE_CONICAL_SHELL_DIAGRAM";
      exposesInternalCodes: false;
    };
    solution: {
      diagram: MenCp011ConicalMaterialDiagram;
      explanation: MenCp011ConicalMaterialLearnerSolution;
      exposesInternalCodes: false;
    };
    admin: {
      diagram: MenCp011ConicalMaterialDiagram;
      trapCodes: string[];
      verification: MenCp011ConicalMaterialPackage["verification"];
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

export interface MenCp011ConicalMaterialGenerationConstraints {
  unit?: MenCp011ConicalMaterialLinearUnit;
  piPolicy?: MenCp011ConicalMaterialPiPolicy;
  fixtureIndex?: number;
  correctIndex?: 0 | 1 | 2 | 3;
}

interface Candidate {
  value: ExactValue;
  misconceptionId: string | null;
  explanation: string;
}

const LABELS: readonly Label[] = ["A", "B", "C", "D"];
const PI_POLICIES: readonly MenCp011ConicalMaterialPiPolicy[] = [
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

function volumeUnitFor(
  unit: MenCp011ConicalMaterialLinearUnit,
): MenCp011ConicalMaterialVolumeUnit {
  return unit === "cm" ? "cm³" : "m³";
}

function dimension(
  value: bigint,
  unit: MenCp011ConicalMaterialLinearUnit,
) {
  return `$${value}\\text{ ${unit}}$`;
}

function ratioText(numerator: bigint, denominator: bigint) {
  return `$\\frac{${numerator}}{${denominator}}$`;
}

function piInstruction(policy: MenCp011ConicalMaterialPiPolicy) {
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
  coefficientNumerator: bigint,
  coefficientDenominator: bigint,
  policy: MenCp011ConicalMaterialPiPolicy,
): ExactValue {
  switch (policy) {
    case "EXACT_PI":
      return pi(coefficientNumerator, coefficientDenominator);
    case "PI_22_OVER_7":
      return rational(
        22n * coefficientNumerator,
        7n * coefficientDenominator,
      );
    case "PI_3_14":
      return rational(
        157n * coefficientNumerator,
        50n * coefficientDenominator,
      );
  }
}

function fixtureCatalog(
  prototypeId: MenCp011ConicalMaterialPrototypeId,
): readonly (ExplicitConeFixture | SimilarConeFixture)[] {
  return prototypeId ===
    "MEN-CP011-PROT-HOLLOW-CONE-MATERIAL-VOLUME-EXPLICIT-INNER"
    ? EXPLICIT_FIXTURES
    : SIMILAR_FIXTURES;
}

function createState(
  prototypeId: MenCp011ConicalMaterialPrototypeId,
  seed: string,
  constraints: MenCp011ConicalMaterialGenerationConstraints,
  attempt: number,
): MenCp011ConicalMaterialState {
  const definition = getMenCp011ConicalMaterialDefinition(prototypeId);
  const catalog = fixtureCatalog(prototypeId);
  const fixtureIndex =
    constraints.fixtureIndex === undefined
      ? hashText(
          `${MEN_CP011_CONICAL_MATERIAL_AUTHORITY}|fixture|${prototypeId}|${seed}|${attempt}`,
        ) % catalog.length
      : ((constraints.fixtureIndex % catalog.length) + catalog.length) %
        catalog.length;
  const fixture = catalog[fixtureIndex]!;
  const unit =
    constraints.unit ??
    (hashText(
      `${MEN_CP011_CONICAL_MATERIAL_AUTHORITY}|unit|${prototypeId}|${seed}|${attempt}`,
    ) % 2 === 0
      ? "cm"
      : "m");
  const piPolicy =
    constraints.piPolicy ??
    PI_POLICIES[
      hashText(
        `${MEN_CP011_CONICAL_MATERIAL_AUTHORITY}|pi|${prototypeId}|${seed}|${attempt}`,
      ) % PI_POLICIES.length
    ]!;
  const outerVolumeCoefficient =
    fixture.outerRadius * fixture.outerRadius * fixture.outerHeight;
  const innerVolumeCoefficient =
    fixture.innerRadius * fixture.innerRadius * fixture.innerHeight;
  const materialVolumeCoefficient =
    outerVolumeCoefficient - innerVolumeCoefficient;
  const similar = fixture as Partial<SimilarConeFixture>;

  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-011",
    permanentQlId: null,
    waveId: "MEN-CP-011-CONICAL-MATERIAL-WAVE-01",
    prototypeId,
    solveMode: definition.solveMode,
    target: "VOLUME",
    shape: "CONE",
    topology: "HOLLOW_SHARED_BASE_CAVITY",
    relation: definition.relation,
    seed,
    stateSelectionAttempt: attempt,
    difficulty: definition.difficulty,
    unit,
    volumeUnit: volumeUnitFor(unit),
    piPolicy,
    fixtureId: fixture.id,
    outerRadius: fixture.outerRadius,
    outerHeight: fixture.outerHeight,
    innerRadius: fixture.innerRadius,
    innerHeight: fixture.innerHeight,
    scaleNumerator:
      definition.relation === "DECLARED_SIMILAR_SHARED_BASE_WALL"
        ? similar.scaleNumerator ?? null
        : null,
    scaleDenominator:
      definition.relation === "DECLARED_SIMILAR_SHARED_BASE_WALL"
        ? similar.scaleDenominator ?? null
        : null,
    outerVolumeCoefficient,
    innerVolumeCoefficient,
    materialVolumeCoefficient,
    sourceMaturity:
      "BLUEPRINT_DERIVED_DIRECT_SOURCE_NORMALISATION_PENDING",
  };
}

function createStem(state: MenCp011ConicalMaterialState) {
  const R = dimension(state.outerRadius, state.unit);
  const H = dimension(state.outerHeight, state.unit);
  const r = dimension(state.innerRadius, state.unit);
  const h = dimension(state.innerHeight, state.unit);
  const instruction = piInstruction(state.piPolicy);

  if (state.relation === "EXPLICIT_SHARED_BASE_INNER_CONE") {
    const variants = [
      `A hollow metal cone has outer radius ${R} and outer height ${H}. A conical cavity of radius ${r} and height ${h} is formed from the same base plane along the same axis. Find the volume of metal remaining. ${instruction}`,
      `The outside of a conical shell has radius ${R} and height ${H}. Its inner conical void has radius ${r} and height ${h}, with both circular openings in the same base plane. Calculate the shell's material volume. ${instruction}`,
      `A solid cone of base radius ${R} and height ${H} contains an axial conical cavity whose base radius is ${r} and height is ${h}. The cavity opens through the common base plane. Determine outer volume minus inner void volume. ${instruction}`,
      `A conical metal casing is described by an outer cone of radius ${R}, height ${H}, and an explicitly measured inner cone of radius ${r}, height ${h}. Find the volume occupied by the casing material. ${instruction}`,
      `The outer boundary of a hollow cone has radius ${R} and height ${H}; the inner boundary has radius ${r} and height ${h}. The two cones are coaxial and share their base plane. What is the material volume? ${instruction}`,
      `A conical shell is made by removing a smaller coaxial cone of radius ${r} and height ${h} from an outer cone of radius ${R} and height ${H}. Both bases lie in the same plane. Find the remaining volume. ${instruction}`,
      `An outer cone measures ${R} in radius and ${H} in height. Its base opens into a conical hollow of radius ${r} and height ${h}. Calculate the metal volume in the shell. ${instruction}`,
      `A conical body has a conical cavity measured independently. The outer radius and height are ${R} and ${H}; the cavity radius and height are ${r} and ${h}. Find the material volume. ${instruction}`,
    ] as const;
    return choose(
      variants,
      `conical-material:stem:${state.prototypeId}:${state.seed}:${state.fixtureId}:${state.piPolicy}`,
    );
  }

  const p = state.scaleNumerator!;
  const q = state.scaleDenominator!;
  const ratio = ratioText(p, q);
  const variants = [
    `A hollow conical shell has outer radius ${R} and height ${H}. Its inner conical boundary is declared similar and parallel-sided, with both inner radius and inner height equal to ${ratio} of the corresponding outer dimensions. Find the volume of material. ${instruction}`,
    `The outer cone of a shell has radius ${R} and height ${H}. The coaxial inner void shares the base plane and is similar to the outer cone at scale ${ratio}. Calculate the material volume. ${instruction}`,
    `A conical casing has outer radius ${R} and outer height ${H}. Its inner cone is explicitly declared similar, with linear scale factor ${ratio}, and opens in the same base plane. Find outer volume minus inner volume. ${instruction}`,
    `An outer cone of radius ${R} and height ${H} surrounds a similar coaxial conical cavity. Every inner linear dimension is ${ratio} of the matching outer dimension. Determine the shell's volume. ${instruction}`,
    `For a conical shell, the outer radius is ${R} and the outer height is ${H}. The inner and outer walls are declared parallel in axial section, giving inner-to-outer linear ratio ${ratio}. Find the material volume. ${instruction}`,
    `A hollow cone has outer measurements ${R} and ${H}. Its inner cavity is a similar cone at scale ${ratio}, with the circular openings in one base plane. Calculate the remaining volume. ${instruction}`,
    `The dimensions of an outer cone are radius ${R} and height ${H}. A declared similar inner cone uses linear factor ${ratio}. What volume of material lies between the two conical boundaries? ${instruction}`,
    `A conical metal shell has a similar inner void. The outer radius and height are ${R} and ${H}, while the inner-to-outer scale is ${ratio}. Determine the metal volume. ${instruction}`,
  ] as const;
  return choose(
    variants,
    `conical-material:stem:${state.prototypeId}:${state.seed}:${state.fixtureId}:${state.piPolicy}`,
  );
}

function candidatesFor(state: MenCp011ConicalMaterialState): Candidate[] {
  return [
    {
      value: applyPiPolicy(
        state.materialVolumeCoefficient,
        3n,
        state.piPolicy,
      ),
      misconceptionId: null,
      explanation: "",
    },
    {
      value: applyPiPolicy(
        state.outerVolumeCoefficient,
        3n,
        state.piPolicy,
      ),
      misconceptionId: "USED_OUTER_SOLID_VOLUME_ONLY",
      explanation:
        "using the whole outer cone without subtracting the conical cavity",
    },
    {
      value: applyPiPolicy(
        state.innerVolumeCoefficient,
        3n,
        state.piPolicy,
      ),
      misconceptionId: "CALCULATED_INNER_VOID_ONLY",
      explanation:
        "calculating the empty inner cone instead of the material surrounding it",
    },
    {
      value: applyPiPolicy(
        state.outerVolumeCoefficient + state.innerVolumeCoefficient,
        3n,
        state.piPolicy,
      ),
      misconceptionId: "ADDED_INNER_AND_OUTER_VOLUMES",
      explanation:
        "adding the outer solid and inner void even though the void must be removed",
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
    (hashText(`conical-material:correct-index:${seed}`) % 4 as
      | 0
      | 1
      | 2
      | 3);
  const wrongOffset =
    hashText(`conical-material:wrong-order:${seed}`) % wrong.length;
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
  state: MenCp011ConicalMaterialState,
  role: DiagramRole,
): MenCp011ConicalMaterialDiagram {
  const relationLabel =
    state.relation === "EXPLICIT_SHARED_BASE_INNER_CONE"
      ? "explicit inner cone"
      : `declared similar scale ${state.scaleNumerator}/${state.scaleDenominator}`;
  const innerDimensionLabel =
    role === "PROMPT" &&
    state.relation === "DECLARED_SIMILAR_SHARED_BASE_WALL"
      ? `r = ${state.scaleNumerator}/${state.scaleDenominator} R; h = ${state.scaleNumerator}/${state.scaleDenominator} H`
      : `r = ${state.innerRadius} ${state.unit}; h = ${state.innerHeight} ${state.unit}`;
  const outerDimensionLabel =
    `R = ${state.outerRadius} ${state.unit}; H = ${state.outerHeight} ${state.unit}`;
  const svg = `<svg viewBox="0 0 560 330" role="img" aria-label="Hollow conical shell; ${outerDimensionLabel}; ${innerDimensionLabel}; ${relationLabel}; not to scale" data-diagram-version="CONICAL_SHELL_EXAMTREE_V1" data-diagram-role="${role}" data-shape="CONE" data-topology="HOLLOW_SHARED_BASE_CAVITY" data-relation="${state.relation}" data-responsive="true" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="558" height="328" rx="10" fill="white" stroke="black"/>
  <g fill="none" stroke="black" stroke-width="2">
    <path data-region="outer-cone" d="M280 42 L75 250 L485 250 Z"/>
    <ellipse data-region="outer-base" cx="280" cy="250" rx="205" ry="34"/>
    <path data-region="inner-void" data-boundary="dashed" stroke-dasharray="7 5" d="M280 132 L165 250 L395 250 Z"/>
    <ellipse data-region="inner-base" data-boundary="dashed" stroke-dasharray="7 5" cx="280" cy="250" rx="115" ry="19"/>
    <path data-dimension="outer-height" data-scope="axis" d="M280 42 L280 250"/>
    <path data-dimension="inner-height" data-scope="axis" stroke-dasharray="4 4" d="M280 132 L280 250"/>
    <path data-dimension="outer-radius" data-scope="base-centre" d="M280 250 L485 250"/>
    <path data-dimension="inner-radius" data-scope="base-centre" stroke-dasharray="4 4" d="M280 250 L395 250"/>
  </g>
  <g font-family="Arial, sans-serif" font-size="14" fill="black">
    <text x="24" y="28">ExamTree conical shell</text>
    <text x="24" y="50">${outerDimensionLabel}</text>
    <text data-role="inner-dimension-label" x="24" y="72">${innerDimensionLabel}</text>
    <text x="24" y="94">${relationLabel}</text>
    <text x="292" y="95">H</text>
    <text x="292" y="190">h</text>
    <text x="405" y="242">r</text>
    <text x="495" y="242">R</text>
    <text x="190" y="286">dashed region = empty conical void</text>
    <text x="444" y="314">not to scale</text>
  </g>
</svg>`;
  return {
    kind: "CONICAL_SHELL",
    svg,
    accessibleText:
      `Axial view of a hollow conical shell. The outer cone has ${outerDimensionLabel}. ` +
      `The dashed inner cone is empty and has ${innerDimensionLabel}. ` +
      `The relation is ${relationLabel}.`,
    visibleLabels: [
      outerDimensionLabel,
      innerDimensionLabel,
      relationLabel,
    ],
    notToScale: true,
  };
}

function buildExplanation(
  state: MenCp011ConicalMaterialState,
  options: MenCp011ConicalMaterialOption[],
): {
  learnerSolution: MenCp011ConicalMaterialLearnerSolution;
  explanation: MenCp011ConicalMaterialPackage["explanation"];
} {
  const R = state.outerRadius;
  const H = state.outerHeight;
  const r = state.innerRadius;
  const h = state.innerHeight;
  const finalAnswer = formatWithUnit(
    applyPiPolicy(state.materialVolumeCoefficient, 3n, state.piPolicy),
    state.volumeUnit,
  );
  const piSubstitution =
    state.piPolicy === "EXACT_PI"
      ? "\\pi"
      : state.piPolicy === "PI_22_OVER_7"
        ? "\\frac{22}{7}"
        : "\\frac{157}{50}";
  const relationStep =
    state.relation === "DECLARED_SIMILAR_SHARED_BASE_WALL"
      ? {
          title: "Recover the inner dimensions",
          body:
            `The declared linear scale is ${state.scaleNumerator}/${state.scaleDenominator}. Apply it to both radius and height before using any volume formula.`,
          equation:
            `$r=\\frac{${state.scaleNumerator}}{${state.scaleDenominator}}(${R})=${r}\\text{ ${state.unit}},\\quad h=\\frac{${state.scaleNumerator}}{${state.scaleDenominator}}(${H})=${h}\\text{ ${state.unit}}$`,
        }
      : {
          title: "Read the two cones separately",
          body:
            "The inner radius and height are explicitly supplied. Do not invent a wall-thickness rule; use the stated inner cone.",
          equation:
            `$R=${R},\\ H=${H},\\ r=${r},\\ h=${h}\\text{ ${state.unit}}$`,
        };
  const coefficientEquation =
    `R^{2}H-r^{2}h=${R}^{2}(${H})-${r}^{2}(${h})=${state.outerVolumeCoefficient}-${state.innerVolumeCoefficient}=${state.materialVolumeCoefficient}`;
  const finalEquation =
    `V=\\frac{1}{3}(${piSubstitution})(${state.materialVolumeCoefficient})`;
  const shortcut =
    state.relation === "DECLARED_SIMILAR_SHARED_BASE_WALL"
      ? `Because the inner cone is similar at linear scale $k=\\frac{${state.scaleNumerator}}{${state.scaleDenominator}}$, its volume is $k^3$ of the outer cone. Therefore $V_{material}=V_{outer}(1-k^3)$; this is a fast independent check.`
      : "Group the arithmetic as $R^2H-r^2h$ before multiplying by $\\frac{\\pi}{3}$. This avoids carrying the common factor through two separate large calculations.";
  const candidateCatalog = candidatesFor(state);
  const wrongOptionAnalysis = options
    .filter((option) => !option.isCorrect)
    .map((option) => {
      const candidate = candidateCatalog.find(
        (item) => item.misconceptionId === option.misconceptionId,
      );
      return `${option.display} comes from ${candidate?.explanation}.`;
    });
  const keyRule =
    "Picture a complete outer cone with an explicitly defined inner conical cavity removed. Material volume is outer cone volume minus inner cone volume. A conical shell relation must be stated; no single-thickness shortcut is assumed.";
  const steps = [
    relationStep,
    {
      title: "Form the outer-minus-inner coefficient",
      body:
        `Both cone volumes contain the common factor one-third pi. First subtract the dimension coefficients. The coefficient has cubic ${state.unit} units.`,
      equation: `$${coefficientEquation}$`,
    },
    {
      title: "Apply the declared pi policy",
      body:
        `Multiply the remaining coefficient by one-third pi. The required material volume is ${finalAnswer}.`,
      equation: `$${finalEquation}$`,
    },
  ];
  const formula =
    "$V_{material}=\\frac{1}{3}\\pi\\left(R^2H-r^2h\\right)$";

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
    explanation: {
      keyRule,
      steps,
      shortcut,
      traps: wrongOptionAnalysis,
    },
  };
}

function verify(
  state: MenCp011ConicalMaterialState,
  exactAnswer: ExactValue,
) {
  let reconstructed: ExactValue;
  let method: string;

  if (
    state.relation === "DECLARED_SIMILAR_SHARED_BASE_WALL" &&
    state.scaleNumerator !== null &&
    state.scaleDenominator !== null
  ) {
    const p = state.scaleNumerator;
    const q = state.scaleDenominator;
    reconstructed = applyPiPolicy(
      state.outerVolumeCoefficient * (q * q * q - p * p * p),
      3n * q * q * q,
      state.piPolicy,
    );
    method =
      "Independent similar-solids verifier: outer cone volume multiplied by one minus the cube of the declared linear scale.";
  } else {
    reconstructed = applyPiPolicy(
      state.outerRadius * state.outerRadius * state.outerHeight -
        state.innerRadius * state.innerRadius * state.innerHeight,
      3n,
      state.piPolicy,
    );
    method =
      "Independent coefficient verifier: reconstruct R²H and r²h directly, subtract, then apply the declared pi policy.";
  }

  return {
    valid: exactEquals(exactAnswer, reconstructed),
    method,
    reconstructed: `${formatExactPlain(reconstructed)} ${state.volumeUnit}`,
  };
}

function countDollars(text: string) {
  return (text.match(/\$/g) ?? []).length;
}

function learnerText(
  question: Omit<MenCp011ConicalMaterialPackage, "validation">,
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
  question: Omit<MenCp011ConicalMaterialPackage, "validation">,
) {
  const checks: Array<{ name: string; passed: boolean; message: string }> = [];
  const add = (name: string, passed: boolean, message: string) =>
    checks.push({ name, passed, message });
  const state = question.state;
  const learner = learnerText(question);

  add(
    "authority",
    question.conicalMaterialAuthority ===
      MEN_CP011_CONICAL_MATERIAL_AUTHORITY,
    "The conical-material authority must match the wave authority.",
  );
  add(
    "positive dimensions",
    state.outerRadius > 0n &&
      state.outerHeight > 0n &&
      state.innerRadius > 0n &&
      state.innerHeight > 0n,
    "All outer and inner cone dimensions must be positive.",
  );
  add(
    "physical containment",
    state.innerRadius < state.outerRadius &&
      state.innerHeight <= state.outerHeight,
    "The conical cavity must fit inside the outer cone.",
  );
  add(
    "positive material coefficient",
    state.materialVolumeCoefficient > 0n &&
      state.materialVolumeCoefficient ===
        state.outerVolumeCoefficient - state.innerVolumeCoefficient,
    "Outer coefficient minus inner coefficient must be positive and exact.",
  );
  const similarityValid =
    state.relation !== "DECLARED_SIMILAR_SHARED_BASE_WALL" ||
    (state.scaleNumerator !== null &&
      state.scaleDenominator !== null &&
      state.scaleNumerator > 0n &&
      state.scaleNumerator < state.scaleDenominator &&
      state.innerRadius * state.scaleDenominator ===
        state.outerRadius * state.scaleNumerator &&
      state.innerHeight * state.scaleDenominator ===
        state.outerHeight * state.scaleNumerator);
  add(
    "declared relation",
    similarityValid,
    "A similar-wall state must satisfy the declared linear ratio for both radius and height.",
  );
  add(
    "exact answer verification",
    question.verification.valid,
    "An independent method must reconstruct the exact answer.",
  );
  add(
    "four unique options",
    question.options.length === 4 &&
      new Set(question.options.map((option) => exactKey(option.value))).size ===
        4,
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
      'data-diagram-version="CONICAL_SHELL_EXAMTREE_V1"',
    ) &&
      question.diagram.svg.includes('data-diagram-role="PROMPT"') &&
      question.solutionDiagram.svg.includes(
        'data-diagram-role="SOLUTION"',
      ) &&
      question.diagram.svg.includes(
        `data-relation="${state.relation}"`,
      ) &&
      !/<svg[^>]+\bwidth="\d+/.test(question.diagram.svg) &&
      !/<svg[^>]+\bwidth="\d+/.test(question.solutionDiagram.svg),
    "Prompt and solution diagrams must represent the canonical conical-shell state responsively.",
  );
  add(
    "stem completeness",
    question.stem.includes(`${state.outerRadius}`) &&
      question.stem.includes(`${state.outerHeight}`) &&
      (state.relation === "EXPLICIT_SHARED_BASE_INNER_CONE"
        ? question.stem.includes(`${state.innerRadius}`) &&
          question.stem.includes(`${state.innerHeight}`)
        : question.stem.includes(`${state.scaleNumerator}`) &&
          question.stem.includes(`${state.scaleDenominator}`)),
    "The text-only stem must provide the complete outer/inner relation.",
  );
  add(
    "balanced MathJax",
    countDollars(learner) % 2 === 0 && !/\$\$/.test(learner),
    "Learner-visible MathJax delimiters must be balanced and non-empty.",
  );
  add(
    "learner-admin separation",
    !/\[(?:USED_|CALCULATED_|MEN-CP011-PROT-)/.test(learner) &&
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

  return {
    valid: checks.every((check) => check.passed),
    checks,
  };
}

export function generateMenCp011ConicalMaterialQuestion(
  prototypeId: MenCp011ConicalMaterialPrototypeId,
  seed: string,
  constraints: MenCp011ConicalMaterialGenerationConstraints = {},
): MenCp011ConicalMaterialPackage {
  for (let attempt = 0; attempt < 48; attempt += 1) {
    const state = createState(prototypeId, seed, constraints, attempt);
    const candidates = candidatesFor(state);
    if (
      new Set(candidates.map((candidate) => exactKey(candidate.value))).size !==
      4
    ) {
      continue;
    }
    const permutationSeed =
      `${MEN_CP011_CONICAL_MATERIAL_AUTHORITY}|options|${prototypeId}|${seed}|${attempt}`;
    const { arranged, correctIndex } = arrangeCandidates(
      candidates,
      permutationSeed,
      constraints.correctIndex,
    );
    const options: MenCp011ConicalMaterialOption[] = arranged.map(
      (candidate, index) => ({
        label: LABELS[index]!,
        value: candidate.value,
        display: formatWithUnit(
          candidate.value,
          state.volumeUnit as Men002Unit,
        ),
        isCorrect: candidate.misconceptionId === null,
        misconceptionId: candidate.misconceptionId,
      }),
    );
    const exactAnswer = applyPiPolicy(
      state.materialVolumeCoefficient,
      3n,
      state.piPolicy,
    );
    const verification = verify(state, exactAnswer);
    const diagram = buildDiagram(state, "PROMPT");
    const solutionDiagram = buildDiagram(state, "SOLUTION");
    const explanationParts = buildExplanation(state, options);
    const withoutValidation: Omit<
      MenCp011ConicalMaterialPackage,
      "validation"
    > = {
      packageId: "MEN-002",
      canonicalProblemId: "MEN-CP-011",
      permanentQlId: null,
      waveId: "MEN-CP-011-CONICAL-MATERIAL-WAVE-01",
      prototypeId,
      solveMode: state.solveMode,
      language: "en",
      seed,
      difficulty: state.difficulty,
      target: "VOLUME",
      unit: state.volumeUnit,
      conicalMaterialAuthority: MEN_CP011_CONICAL_MATERIAL_AUTHORITY,
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
          diagramPolicy: "OPTIONAL_PROMPT_SAFE_CONICAL_SHELL_DIAGRAM",
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
    `Unable to generate a valid MEN-CP-011 conical-material package for ${prototypeId} and seed ${seed}.`,
  );
}

export interface MenCp011ConicalMaterialReviewBatch {
  authority: typeof MEN_CP011_CONICAL_MATERIAL_AUTHORITY;
  records: MenCp011ConicalMaterialPackage[];
}

export function generateMenCp011ConicalMaterialReviewBatch(): MenCp011ConicalMaterialReviewBatch {
  const records: MenCp011ConicalMaterialPackage[] = [];
  const units: readonly MenCp011ConicalMaterialLinearUnit[] = ["cm", "m"];
  for (const prototypeId of getMenCp011ConicalMaterialPrototypeIds()) {
    for (let unitIndex = 0; unitIndex < units.length; unitIndex += 1) {
      for (let piIndex = 0; piIndex < PI_POLICIES.length; piIndex += 1) {
        for (let fixtureOffset = 0; fixtureOffset < 4; fixtureOffset += 1) {
          const fixtureIndex =
            (fixtureOffset + piIndex * 2 + unitIndex) % 8;
          records.push(
            generateMenCp011ConicalMaterialQuestion(
              prototypeId,
              `conical-material-review:${prototypeId}:${units[unitIndex]}:${PI_POLICIES[piIndex]}:${fixtureIndex}`,
              {
                unit: units[unitIndex],
                piPolicy: PI_POLICIES[piIndex],
                fixtureIndex,
                correctIndex: (
                  (fixtureOffset + piIndex + unitIndex * 2) %
                  4
                ) as 0 | 1 | 2 | 3,
              },
            ),
          );
        }
      }
    }
  }
  return {
    authority: MEN_CP011_CONICAL_MATERIAL_AUTHORITY,
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

export interface MenCp011ConicalMaterialAudit {
  authority: typeof MEN_CP011_CONICAL_MATERIAL_AUTHORITY;
  prototypeCount: number;
  recordCount: number;
  exactStemCount: number;
  exactQuestionOptionCount: number;
  maximumNormalizedStemRepetition: number;
  uniquePhysicalStateCount: number;
  unitCounts: Record<MenCp011ConicalMaterialLinearUnit, number>;
  piPolicyCounts: Record<MenCp011ConicalMaterialPiPolicy, number>;
  answerPositionCounts: Record<Label, number>;
  prototypeUnitPiCounts: Record<string, number>;
  publicationEligible: false;
  resolvedDiscoveryCandidates: MenCp011ConicalMaterialPrototypeId[];
}

export function auditMenCp011ConicalMaterialBatch(
  records: readonly MenCp011ConicalMaterialPackage[],
): MenCp011ConicalMaterialAudit {
  const normalizedStemCounts = new Map<string, number>();
  const exactStems = new Set<string>();
  const exactQuestionOptions = new Set<string>();
  const physicalStates = new Set<string>();
  const unitCounts: Record<MenCp011ConicalMaterialLinearUnit, number> = {
    cm: 0,
    m: 0,
  };
  const piPolicyCounts: Record<MenCp011ConicalMaterialPiPolicy, number> = {
    EXACT_PI: 0,
    PI_22_OVER_7: 0,
    PI_3_14: 0,
  };
  const answerPositionCounts: Record<Label, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };
  const prototypeUnitPiCounts: Record<string, number> = {};

  for (const question of records) {
    const normalized = normalizeStem(question.stem);
    normalizedStemCounts.set(
      normalized,
      (normalizedStemCounts.get(normalized) ?? 0) + 1,
    );
    exactStems.add(question.stem);
    exactQuestionOptions.add(
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
        question.state.outerRadius,
        question.state.outerHeight,
        question.state.innerRadius,
        question.state.innerHeight,
      ].join("|"),
    );
    unitCounts[question.state.unit] += 1;
    piPolicyCounts[question.state.piPolicy] += 1;
    answerPositionCounts[LABELS[question.correctIndex]!] += 1;
    const cell =
      `${question.prototypeId}|${question.state.unit}|${question.state.piPolicy}`;
    prototypeUnitPiCounts[cell] =
      (prototypeUnitPiCounts[cell] ?? 0) + 1;
  }

  return {
    authority: MEN_CP011_CONICAL_MATERIAL_AUTHORITY,
    prototypeCount: new Set(records.map((record) => record.prototypeId)).size,
    recordCount: records.length,
    exactStemCount: exactStems.size,
    exactQuestionOptionCount: exactQuestionOptions.size,
    maximumNormalizedStemRepetition: Math.max(
      0,
      ...normalizedStemCounts.values(),
    ),
    uniquePhysicalStateCount: physicalStates.size,
    unitCounts,
    piPolicyCounts,
    answerPositionCounts,
    prototypeUnitPiCounts,
    publicationEligible: false,
    resolvedDiscoveryCandidates:
      getMenCp011ConicalMaterialPrototypeIds(),
  };
}

export function describeMenCp011ConicalMaterialAnswer(
  question: MenCp011ConicalMaterialPackage,
) {
  return `${question.prototypeId}: ${formatExactPlain(
    question.exactAnswer,
  )} ${question.unit}`;
}
