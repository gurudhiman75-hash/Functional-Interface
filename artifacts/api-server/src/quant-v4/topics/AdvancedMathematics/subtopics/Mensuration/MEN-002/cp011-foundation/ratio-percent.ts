import {
  exactEquals,
  exactKey,
  formatExactPlain,
  formatWithUnit,
  rational,
} from "../foundation/exact";
import type { ExactRational, ExactValue, Men002Difficulty } from "../foundation/types";

export const MEN_CP011_RATIO_PERCENT_AUTHORITY =
  "MEN-CP011-RATIO-PERCENT-WAVE-01-V1" as const;

export type MenCp011RatioPercentPrototypeId =
  | "MEN-CP011-PROT-MATERIAL-VOLUME-RATIO"
  | "MEN-CP011-PROT-MATERIAL-VOLUME-PERCENT-CHANGE";

export type MenCp011RatioPercentSolveMode =
  | "findHollowPipeMaterialVolumeRatio"
  | "findHollowPipeMaterialVolumePercentageDecrease";

export type MenCp011RatioPercentLinearUnit = "cm" | "m";
type Label = "A" | "B" | "C" | "D";
type DiagramRole = "PROMPT" | "SOLUTION";

interface RatioFixture {
  id: string;
  outerRadiusA: bigint;
  innerRadiusA: bigint;
  lengthA: bigint;
  outerRadiusB: bigint;
  innerRadiusB: bigint;
  lengthB: bigint;
}

interface PercentFixture {
  id: string;
  outerRadius: bigint;
  oldInnerRadius: bigint;
  newInnerRadius: bigint;
  length: bigint;
}

const RATIO_FIXTURES: readonly RatioFixture[] = [
  { id: "RP-R-01", outerRadiusA: 5n, innerRadiusA: 3n, lengthA: 10n, outerRadiusB: 6n, innerRadiusB: 4n, lengthB: 8n },
  { id: "RP-R-02", outerRadiusA: 7n, innerRadiusA: 5n, lengthA: 12n, outerRadiusB: 8n, innerRadiusB: 6n, lengthB: 10n },
  { id: "RP-R-03", outerRadiusA: 8n, innerRadiusA: 5n, lengthA: 9n, outerRadiusB: 7n, innerRadiusB: 4n, lengthB: 12n },
  { id: "RP-R-04", outerRadiusA: 10n, innerRadiusA: 6n, lengthA: 8n, outerRadiusB: 9n, innerRadiusB: 5n, lengthB: 10n },
  { id: "RP-R-05", outerRadiusA: 12n, innerRadiusA: 8n, lengthA: 7n, outerRadiusB: 10n, innerRadiusB: 6n, lengthB: 9n },
  { id: "RP-R-06", outerRadiusA: 9n, innerRadiusA: 6n, lengthA: 14n, outerRadiusB: 8n, innerRadiusB: 4n, lengthB: 10n },
  { id: "RP-R-07", outerRadiusA: 14n, innerRadiusA: 10n, lengthA: 6n, outerRadiusB: 12n, innerRadiusB: 8n, lengthB: 8n },
  { id: "RP-R-08", outerRadiusA: 11n, innerRadiusA: 7n, lengthA: 10n, outerRadiusB: 13n, innerRadiusB: 9n, lengthB: 6n },
] as const;

const PERCENT_FIXTURES: readonly PercentFixture[] = [
  { id: "RP-P-01", outerRadius: 5n, oldInnerRadius: 3n, newInnerRadius: 4n, length: 10n },
  { id: "RP-P-02", outerRadius: 7n, oldInnerRadius: 3n, newInnerRadius: 5n, length: 12n },
  { id: "RP-P-03", outerRadius: 8n, oldInnerRadius: 4n, newInnerRadius: 6n, length: 9n },
  { id: "RP-P-04", outerRadius: 10n, oldInnerRadius: 6n, newInnerRadius: 8n, length: 8n },
  { id: "RP-P-05", outerRadius: 12n, oldInnerRadius: 7n, newInnerRadius: 10n, length: 7n },
  { id: "RP-P-06", outerRadius: 9n, oldInnerRadius: 4n, newInnerRadius: 7n, length: 14n },
  { id: "RP-P-07", outerRadius: 14n, oldInnerRadius: 10n, newInnerRadius: 12n, length: 6n },
  { id: "RP-P-08", outerRadius: 11n, oldInnerRadius: 7n, newInnerRadius: 9n, length: 10n },
] as const;

export interface MenCp011RatioPercentDefinition {
  prototypeId: MenCp011RatioPercentPrototypeId;
  solveMode: MenCp011RatioPercentSolveMode;
  target: "RATIO" | "PERCENT_CHANGE";
  difficulty: Men002Difficulty;
}

export const MEN_CP011_RATIO_PERCENT_PROTOTYPES: readonly MenCp011RatioPercentDefinition[] = [
  {
    prototypeId: "MEN-CP011-PROT-MATERIAL-VOLUME-RATIO",
    solveMode: "findHollowPipeMaterialVolumeRatio",
    target: "RATIO",
    difficulty: "Hard",
  },
  {
    prototypeId: "MEN-CP011-PROT-MATERIAL-VOLUME-PERCENT-CHANGE",
    solveMode: "findHollowPipeMaterialVolumePercentageDecrease",
    target: "PERCENT_CHANGE",
    difficulty: "Hard",
  },
] as const;

const DEFINITION_BY_ID = new Map(
  MEN_CP011_RATIO_PERCENT_PROTOTYPES.map((definition) => [
    definition.prototypeId,
    definition,
  ]),
);

export function getMenCp011RatioPercentPrototypeIds() {
  return MEN_CP011_RATIO_PERCENT_PROTOTYPES.map(
    (definition) => definition.prototypeId,
  );
}

export function getMenCp011RatioPercentDefinition(
  prototypeId: MenCp011RatioPercentPrototypeId,
) {
  const definition = DEFINITION_BY_ID.get(prototypeId);
  if (!definition) {
    throw new Error(`Unknown MEN-CP-011 ratio/percent prototype ${prototypeId}.`);
  }
  return definition;
}

export interface MenCp011RatioPercentState {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-RATIO-PERCENT-WAVE-01";
  prototypeId: MenCp011RatioPercentPrototypeId;
  solveMode: MenCp011RatioPercentSolveMode;
  target: "RATIO" | "PERCENT_CHANGE";
  seed: string;
  stateSelectionAttempt: number;
  difficulty: Men002Difficulty;
  unit: MenCp011RatioPercentLinearUnit;
  fixtureId: string;
  outerRadiusA: bigint | null;
  innerRadiusA: bigint | null;
  lengthA: bigint | null;
  outerRadiusB: bigint | null;
  innerRadiusB: bigint | null;
  lengthB: bigint | null;
  materialCoefficientA: bigint | null;
  materialCoefficientB: bigint | null;
  outerRadius: bigint | null;
  oldInnerRadius: bigint | null;
  newInnerRadius: bigint | null;
  fixedLength: bigint | null;
  oldMaterialCoefficient: bigint | null;
  newMaterialCoefficient: bigint | null;
  decreaseCoefficient: bigint | null;
  exactAnswer: ExactRational;
  sourceMaturity: "BLUEPRINT_AND_EXISTING_PIPE_AUTHORITY_DERIVED_DIRECT_SOURCE_PENDING";
}

export interface MenCp011RatioPercentOption {
  label: Label;
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp011RatioPercentDiagram {
  kind: "PIPE_RATIO_COMPARISON" | "PIPE_BORE_CHANGE";
  svg: string;
  accessibleText: string;
  visibleLabels: readonly string[];
  notToScale: true;
}

export interface MenCp011RatioPercentLearnerSolution {
  formula: string;
  steps: string[];
  finalAnswer: string;
  shortcut: string;
  wrongOptionAnalysis: string[];
}

export interface MenCp011RatioPercentPackage {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-RATIO-PERCENT-WAVE-01";
  prototypeId: MenCp011RatioPercentPrototypeId;
  solveMode: MenCp011RatioPercentSolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: "RATIO" | "PERCENT_CHANGE";
  unit: "times" | "%";
  ratioPercentAuthority: typeof MEN_CP011_RATIO_PERCENT_AUTHORITY;
  sourceMaturity: "BLUEPRINT_AND_EXISTING_PIPE_AUTHORITY_DERIVED_DIRECT_SOURCE_PENDING";
  stem: string;
  options: MenCp011RatioPercentOption[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  optionPermutationSeed: string;
  state: MenCp011RatioPercentState;
  diagram: MenCp011RatioPercentDiagram;
  solutionDiagram: MenCp011RatioPercentDiagram;
  learnerSolution: MenCp011RatioPercentLearnerSolution;
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
      diagram: MenCp011RatioPercentDiagram;
      diagramPolicy: "OPTIONAL_PROMPT_SAFE_RATIO_PERCENT_DIAGRAM";
      exposesInternalCodes: false;
    };
    solution: {
      diagram: MenCp011RatioPercentDiagram;
      explanation: MenCp011RatioPercentLearnerSolution;
      exposesInternalCodes: false;
    };
    admin: {
      diagram: MenCp011RatioPercentDiagram;
      trapCodes: string[];
      verification: MenCp011RatioPercentPackage["verification"];
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

export interface MenCp011RatioPercentGenerationConstraints {
  unit?: MenCp011RatioPercentLinearUnit;
  fixtureIndex?: number;
  correctIndex?: 0 | 1 | 2 | 3;
}

interface Candidate {
  value: ExactRational;
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

function formatRatio(value: ExactRational) {
  return `$${value.numerator}:${value.denominator}$`;
}

function formatAnswer(
  target: "RATIO" | "PERCENT_CHANGE",
  value: ExactRational,
) {
  return target === "RATIO"
    ? formatRatio(value)
    : formatWithUnit(value, "%");
}

function createState(
  prototypeId: MenCp011RatioPercentPrototypeId,
  seed: string,
  constraints: MenCp011RatioPercentGenerationConstraints,
  attempt: number,
): MenCp011RatioPercentState {
  const definition = getMenCp011RatioPercentDefinition(prototypeId);
  const unit = constraints.unit ??
    (hashText(`${MEN_CP011_RATIO_PERCENT_AUTHORITY}|unit|${prototypeId}|${seed}|${attempt}`) % 2 === 0
      ? "cm"
      : "m");

  if (prototypeId === "MEN-CP011-PROT-MATERIAL-VOLUME-RATIO") {
    const fixtureIndex = constraints.fixtureIndex === undefined
      ? hashText(`${MEN_CP011_RATIO_PERCENT_AUTHORITY}|ratio|${seed}|${attempt}`) % RATIO_FIXTURES.length
      : ((constraints.fixtureIndex % RATIO_FIXTURES.length) + RATIO_FIXTURES.length) % RATIO_FIXTURES.length;
    const fixture = RATIO_FIXTURES[fixtureIndex]!;
    const materialCoefficientA =
      fixture.lengthA *
      (fixture.outerRadiusA * fixture.outerRadiusA -
        fixture.innerRadiusA * fixture.innerRadiusA);
    const materialCoefficientB =
      fixture.lengthB *
      (fixture.outerRadiusB * fixture.outerRadiusB -
        fixture.innerRadiusB * fixture.innerRadiusB);
    return {
      packageId: "MEN-002",
      canonicalProblemId: "MEN-CP-011",
      permanentQlId: null,
      waveId: "MEN-CP-011-RATIO-PERCENT-WAVE-01",
      prototypeId,
      solveMode: definition.solveMode,
      target: definition.target,
      seed,
      stateSelectionAttempt: attempt,
      difficulty: definition.difficulty,
      unit,
      fixtureId: fixture.id,
      outerRadiusA: fixture.outerRadiusA,
      innerRadiusA: fixture.innerRadiusA,
      lengthA: fixture.lengthA,
      outerRadiusB: fixture.outerRadiusB,
      innerRadiusB: fixture.innerRadiusB,
      lengthB: fixture.lengthB,
      materialCoefficientA,
      materialCoefficientB,
      outerRadius: null,
      oldInnerRadius: null,
      newInnerRadius: null,
      fixedLength: null,
      oldMaterialCoefficient: null,
      newMaterialCoefficient: null,
      decreaseCoefficient: null,
      exactAnswer: rational(materialCoefficientA, materialCoefficientB),
      sourceMaturity: "BLUEPRINT_AND_EXISTING_PIPE_AUTHORITY_DERIVED_DIRECT_SOURCE_PENDING",
    };
  }

  const fixtureIndex = constraints.fixtureIndex === undefined
    ? hashText(`${MEN_CP011_RATIO_PERCENT_AUTHORITY}|percent|${seed}|${attempt}`) % PERCENT_FIXTURES.length
    : ((constraints.fixtureIndex % PERCENT_FIXTURES.length) + PERCENT_FIXTURES.length) % PERCENT_FIXTURES.length;
  const fixture = PERCENT_FIXTURES[fixtureIndex]!;
  const oldMaterialCoefficient =
    fixture.outerRadius * fixture.outerRadius -
    fixture.oldInnerRadius * fixture.oldInnerRadius;
  const newMaterialCoefficient =
    fixture.outerRadius * fixture.outerRadius -
    fixture.newInnerRadius * fixture.newInnerRadius;
  const decreaseCoefficient =
    oldMaterialCoefficient - newMaterialCoefficient;
  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-011",
    permanentQlId: null,
    waveId: "MEN-CP-011-RATIO-PERCENT-WAVE-01",
    prototypeId,
    solveMode: definition.solveMode,
    target: definition.target,
    seed,
    stateSelectionAttempt: attempt,
    difficulty: definition.difficulty,
    unit,
    fixtureId: fixture.id,
    outerRadiusA: null,
    innerRadiusA: null,
    lengthA: null,
    outerRadiusB: null,
    innerRadiusB: null,
    lengthB: null,
    materialCoefficientA: null,
    materialCoefficientB: null,
    outerRadius: fixture.outerRadius,
    oldInnerRadius: fixture.oldInnerRadius,
    newInnerRadius: fixture.newInnerRadius,
    fixedLength: fixture.length,
    oldMaterialCoefficient,
    newMaterialCoefficient,
    decreaseCoefficient,
    exactAnswer: rational(decreaseCoefficient * 100n, oldMaterialCoefficient),
    sourceMaturity: "BLUEPRINT_AND_EXISTING_PIPE_AUTHORITY_DERIVED_DIRECT_SOURCE_PENDING",
  };
}

function dimension(value: bigint, unit: MenCp011RatioPercentLinearUnit) {
  return `$${value}\\text{ ${unit}}$`;
}

function createStem(state: MenCp011RatioPercentState) {
  if (state.target === "RATIO") {
    const R1 = dimension(state.outerRadiusA!, state.unit);
    const r1 = dimension(state.innerRadiusA!, state.unit);
    const h1 = dimension(state.lengthA!, state.unit);
    const R2 = dimension(state.outerRadiusB!, state.unit);
    const r2 = dimension(state.innerRadiusB!, state.unit);
    const h2 = dimension(state.lengthB!, state.unit);
    const variants = [
      `Pipe A has outer radius ${R1}, inner radius ${r1} and length ${h1}. Pipe B has corresponding dimensions ${R2}, ${r2} and ${h2}. Find the ratio of material volumes A:B.`,
      `Two hollow cylindrical pipes have dimensions $(R,r,h)=(${R1},${r1},${h1})$ and $(${R2},${r2},${h2})$. Determine the ratio of metal used in the first to the second.`,
      `The outer radius, inner radius and length of two pipes are respectively ${R1}, ${r1}, ${h1} and ${R2}, ${r2}, ${h2}. Find their material-volume ratio.`,
      `Compare the metal volumes of two hollow tubes. Tube A has radii ${R1}, ${r1} and length ${h1}; tube B has radii ${R2}, ${r2} and length ${h2}.`,
      `A pair of hollow cylinders have outer-inner-length measurements ${R1}-${r1}-${h1} and ${R2}-${r2}-${h2}. What is the ratio of material used?`,
      `Find the ratio of the volumes of metal in two pipes whose $(R,r,h)$ values are ${R1}, ${r1}, ${h1} and ${R2}, ${r2}, ${h2}.`,
      `Hollow pipe A is ${h1} long with radii ${R1} and ${r1}. Pipe B is ${h2} long with radii ${R2} and ${r2}. Determine $V_A:V_B$.`,
      `The material in two cylindrical shells is to be compared. Their outer radii, inner radii and lengths are ${R1}, ${r1}, ${h1} and ${R2}, ${r2}, ${h2}. Find the ratio.`,
    ] as const;
    return choose(
      variants,
      `ratio-percent:stem:${state.prototypeId}:${state.seed}:${state.fixtureId}:${state.unit}`,
    );
  }

  const R = dimension(state.outerRadius!, state.unit);
  const oldR = dimension(state.oldInnerRadius!, state.unit);
  const newR = dimension(state.newInnerRadius!, state.unit);
  const h = dimension(state.fixedLength!, state.unit);
  const variants = [
    `A hollow pipe has outer radius ${R}, inner radius ${oldR} and length ${h}. Its bore is widened so the inner radius becomes ${newR}, while the outer radius and length remain fixed. Find the percentage decrease in material volume.`,
    `The inner radius of a pipe increases from ${oldR} to ${newR}; its outer radius ${R} and length ${h} do not change. By what percentage does the metal volume decrease?`,
    `A cylindrical tube of outer radius ${R} and length ${h} is bored further, changing its inner radius from ${oldR} to ${newR}. Calculate the percentage reduction in material.`,
    `A pipe keeps the same outside radius ${R} and length ${h}, but its inside radius changes from ${oldR} to ${newR}. Find the percentage decrease in the volume of metal.`,
    `The bore of a hollow cylinder is enlarged from radius ${oldR} to ${newR}. If the outer radius is ${R} and the length is ${h}, determine the percentage of material removed.`,
    `A tube initially has radii ${R} and ${oldR}. After machining, the inner radius is ${newR}; length ${h} and outer radius stay unchanged. Find the percentage fall in material volume.`,
    `For a hollow pipe of outer radius ${R} and length ${h}, the inner radius is increased from ${oldR} to ${newR}. What percentage of the original metal volume is removed?`,
    `A cylindrical shell is made thinner internally by widening its bore from ${oldR} to ${newR}. The outer radius ${R} and length ${h} remain constant. Find the material-volume percentage decrease.`,
  ] as const;
  return choose(
    variants,
    `ratio-percent:stem:${state.prototypeId}:${state.seed}:${state.fixtureId}:${state.unit}`,
  );
}

function candidatesFor(state: MenCp011RatioPercentState): Candidate[] {
  if (state.target === "RATIO") {
    return [
      {
        value: state.exactAnswer,
        misconceptionId: null,
        explanation: "",
      },
      {
        value: rational(
          state.lengthA! * state.outerRadiusA! * state.outerRadiusA!,
          state.lengthB! * state.outerRadiusB! * state.outerRadiusB!,
        ),
        misconceptionId: "USED_OUTER_SOLID_VOLUME_RATIO",
        explanation: "comparing the complete outer cylinders without removing the inner voids",
      },
      {
        value: rational(
          state.lengthA! * state.innerRadiusA! * state.innerRadiusA!,
          state.lengthB! * state.innerRadiusB! * state.innerRadiusB!,
        ),
        misconceptionId: "USED_INNER_VOID_VOLUME_RATIO",
        explanation: "comparing only the empty bores instead of the remaining material",
      },
      {
        value: rational(
          state.lengthA! * (state.outerRadiusA! - state.innerRadiusA!),
          state.lengthB! * (state.outerRadiusB! - state.innerRadiusB!),
        ),
        misconceptionId: "USED_LINEAR_THICKNESS_RATIO",
        explanation: "using wall thickness linearly instead of the annular area difference $R^2-r^2$",
      },
    ];
  }

  const changedVoidCoefficient =
    state.newInnerRadius! * state.newInnerRadius! -
    state.oldInnerRadius! * state.oldInnerRadius!;
  return [
    {
      value: state.exactAnswer,
      misconceptionId: null,
      explanation: "",
    },
    {
      value: rational(
        (state.newInnerRadius! - state.oldInnerRadius!) * 100n,
        state.oldInnerRadius!,
      ),
      misconceptionId: "USED_LINEAR_INNER_RADIUS_PERCENT_CHANGE",
      explanation: "using the percentage increase in inner radius instead of the change in material volume",
    },
    {
      value: rational(
        changedVoidCoefficient * 100n,
        state.oldInnerRadius! * state.oldInnerRadius!,
      ),
      misconceptionId: "USED_VOID_PERCENT_CHANGE_DENOMINATOR",
      explanation: "measuring the enlarged bore against the old void instead of against the old material",
    },
    {
      value: rational(
        changedVoidCoefficient * 100n,
        state.outerRadius! * state.outerRadius!,
      ),
      misconceptionId: "USED_OUTER_SOLID_AS_PERCENT_BASE",
      explanation: "using the complete outer-cylinder coefficient as the percentage base",
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
    (hashText(`ratio-percent:correct:${seed}`) % 4 as 0 | 1 | 2 | 3);
  const offset = hashText(`ratio-percent:wrong:${seed}`) % wrong.length;
  const orderedWrong = wrong.map((_, index) => wrong[(index + offset) % wrong.length]!);
  const arranged: Candidate[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    arranged.push(index === correctIndex ? correct : orderedWrong[wrongIndex++]!);
  }
  return { arranged, correctIndex };
}

function annulus(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  prefix: string,
) {
  return `<circle data-region="${prefix}-outer-boundary" cx="${cx}" cy="${cy}" r="${outer}" fill="none" stroke="black" stroke-width="2"/>
  <circle data-region="${prefix}-inner-void" cx="${cx}" cy="${cy}" r="${inner}" fill="white" stroke="black" stroke-width="2" stroke-dasharray="7 5"/>
  <circle data-role="${prefix}-centre" cx="${cx}" cy="${cy}" r="3" fill="black"/>
  <path data-dimension="${prefix}-outer-radius" data-orientation="centre-connected" d="M${cx} ${cy} L${cx + outer} ${cy}" stroke="black"/>
  <path data-dimension="${prefix}-inner-radius" data-orientation="centre-connected" d="M${cx} ${cy} L${cx + inner} ${cy}" stroke="black" stroke-dasharray="4 3"/>`;
}

function buildDiagram(
  state: MenCp011RatioPercentState,
  role: DiagramRole,
): MenCp011RatioPercentDiagram {
  if (state.target === "RATIO") {
    const result = role === "PROMPT"
      ? "material ratio = ?"
      : `material ratio = ${state.exactAnswer.numerator}:${state.exactAnswer.denominator}`;
    const svg = `<svg viewBox="0 0 650 340" role="img" aria-label="Two hollow pipe cross-sections for material-volume ratio; ${result}; not to scale" data-diagram-version="PIPE_MATERIAL_RATIO_V1" data-diagram-role="${role}" data-responsive="true" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="648" height="338" rx="10" fill="white" stroke="black"/>
  <g fill="none" stroke="black" stroke-width="2">
    ${annulus(180, 155, 88, 48, "pipe-a")}
    ${annulus(470, 155, 88, 48, "pipe-b")}
  </g>
  <g font-family="Arial, sans-serif" font-size="15" fill="black">
    <text x="24" y="30">ExamTree hollow-pipe material comparison</text>
    <text x="95" y="275">A: R=${state.outerRadiusA} ${state.unit}, r=${state.innerRadiusA} ${state.unit}, h=${state.lengthA} ${state.unit}</text>
    <text x="385" y="275">B: R=${state.outerRadiusB} ${state.unit}, r=${state.innerRadiusB} ${state.unit}, h=${state.lengthB} ${state.unit}</text>
    <text data-role="cancellation-note" x="24" y="305">Both volumes contain π; compare h(R²-r²).</text>
    <text data-role="result-label" x="430" y="325">${result}</text>
    <text x="550" y="45">not to scale</text>
  </g>
</svg>`;
    return {
      kind: "PIPE_RATIO_COMPARISON",
      svg,
      accessibleText: `Pipe A has outer radius ${state.outerRadiusA}, inner radius ${state.innerRadiusA}, length ${state.lengthA} ${state.unit}; pipe B has ${state.outerRadiusB}, ${state.innerRadiusB}, ${state.lengthB} ${state.unit}. Compare h times the annular radius-square difference because pi cancels.`,
      visibleLabels: [
        `A: ${state.outerRadiusA}, ${state.innerRadiusA}, ${state.lengthA} ${state.unit}`,
        `B: ${state.outerRadiusB}, ${state.innerRadiusB}, ${state.lengthB} ${state.unit}`,
        result,
      ],
      notToScale: true,
    };
  }

  const result = role === "PROMPT"
    ? "percentage decrease = ?"
    : `percentage decrease = ${formatWithUnit(state.exactAnswer, "%").replace(/^\$|\$$/g, "")}`;
  const svg = `<svg viewBox="0 0 650 340" role="img" aria-label="Before and after hollow pipe cross-sections with fixed outer radius and widened bore; ${result}; not to scale" data-diagram-version="PIPE_BORE_CHANGE_PERCENT_V1" data-diagram-role="${role}" data-responsive="true" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="648" height="338" rx="10" fill="white" stroke="black"/>
  <g fill="none" stroke="black" stroke-width="2">
    ${annulus(180, 155, 90, 42, "before")}
    ${annulus(470, 155, 90, 62, "after")}
  </g>
  <g font-family="Arial, sans-serif" font-size="15" fill="black">
    <text x="24" y="30">ExamTree fixed-outer-radius bore change</text>
    <text x="95" y="275">Before: R=${state.outerRadius} ${state.unit}, r=${state.oldInnerRadius} ${state.unit}</text>
    <text x="385" y="275">After: R=${state.outerRadius} ${state.unit}, r=${state.newInnerRadius} ${state.unit}</text>
    <text data-role="fixed-state-note" x="24" y="305">Outer radius and length ${state.fixedLength} ${state.unit} stay fixed; πh cancels.</text>
    <text data-role="result-label" x="395" y="325">${result}</text>
    <text x="550" y="45">not to scale</text>
  </g>
</svg>`;
  return {
    kind: "PIPE_BORE_CHANGE",
    svg,
    accessibleText: `Before and after pipe cross-sections. Outer radius ${state.outerRadius} ${state.unit} and length ${state.fixedLength} ${state.unit} stay fixed; inner radius grows from ${state.oldInnerRadius} to ${state.newInnerRadius} ${state.unit}, reducing material volume.`,
    visibleLabels: [
      `R = ${state.outerRadius} ${state.unit}`,
      `r before = ${state.oldInnerRadius} ${state.unit}`,
      `r after = ${state.newInnerRadius} ${state.unit}`,
      result,
    ],
    notToScale: true,
  };
}

function buildExplanation(
  state: MenCp011RatioPercentState,
  options: MenCp011RatioPercentOption[],
) {
  const candidateMap = new Map(
    candidatesFor(state).map((candidate) => [candidate.misconceptionId, candidate]),
  );
  const wrongOptionAnalysis = options
    .filter((option) => !option.isCorrect)
    .map((option) => `${option.display} comes from ${candidateMap.get(option.misconceptionId)?.explanation}.`);

  if (state.target === "RATIO") {
    const answer = formatRatio(state.exactAnswer);
    const formula = "$V_A:V_B=h_A(R_A^2-r_A^2):h_B(R_B^2-r_B^2)$";
    const keyRule = "Material volume of a hollow pipe is $\\pi h(R^2-r^2)$. In a ratio, the common factor $\\pi$ cancels immediately, but each pipe's length and annular area coefficient must still be included.";
    const ringA = state.outerRadiusA! * state.outerRadiusA! - state.innerRadiusA! * state.innerRadiusA!;
    const ringB = state.outerRadiusB! * state.outerRadiusB! - state.innerRadiusB! * state.innerRadiusB!;
    const steps = [
      {
        title: "Find each annular coefficient",
        body: "Subtract the inner radius square from the outer radius square for each pipe.",
        equation: `$A:${state.outerRadiusA}^2-${state.innerRadiusA}^2=${ringA},\\quad B:${state.outerRadiusB}^2-${state.innerRadiusB}^2=${ringB}$`,
      },
      {
        title: "Include the pipe lengths",
        body: "Multiply each annular coefficient by its own length; the common $\\pi$ is cancelled.",
        equation: `$V_A:V_B=${state.lengthA}(${ringA}):${state.lengthB}(${ringB})=${state.materialCoefficientA}:${state.materialCoefficientB}$`,
      },
      {
        title: "Reduce the ratio",
        body: `Reduce both terms by their common factor to obtain ${answer}.`,
        equation: `$V_A:V_B=${state.exactAnswer.numerator}:${state.exactAnswer.denominator}$`,
      },
    ];
    const shortcut = `Use $R^2-r^2=(R-r)(R+r)$ before multiplying by length. Here the comparison is $${state.lengthA}(${state.outerRadiusA}-${state.innerRadiusA})(${state.outerRadiusA}+${state.innerRadiusA}):${state.lengthB}(${state.outerRadiusB}-${state.innerRadiusB})(${state.outerRadiusB}+${state.innerRadiusB})$, and $\\pi$ never needs to be evaluated.`;
    return {
      learnerSolution: {
        formula,
        steps: steps.map((step) => `${step.title}: ${step.body} ${step.equation ?? ""}`),
        finalAnswer: answer,
        shortcut,
        wrongOptionAnalysis,
      } satisfies MenCp011RatioPercentLearnerSolution,
      explanation: { keyRule, steps, shortcut, traps: wrongOptionAnalysis },
    };
  }

  const answer = formatWithUnit(state.exactAnswer, "%");
  const formula = "$\\%\\text{ decrease}=\\frac{V_{old}-V_{new}}{V_{old}}\\times100$";
  const keyRule = "With outer radius and length fixed, material volume is proportional to $R^2-r^2$. Widening the bore increases the inner void, so compare the lost material coefficient with the original material coefficient; the common $\\pi h$ cancels.";
  const steps = [
    {
      title: "Find the old material coefficient",
      body: "Use the original inner radius.",
      equation: `$M_{old}=${state.outerRadius}^2-${state.oldInnerRadius}^2=${state.oldMaterialCoefficient}$`,
    },
    {
      title: "Find the new coefficient and loss",
      body: "Use the widened bore, then subtract the new coefficient from the old one.",
      equation: `$M_{new}=${state.outerRadius}^2-${state.newInnerRadius}^2=${state.newMaterialCoefficient},\\quad \\Delta M=${state.decreaseCoefficient}$`,
    },
    {
      title: "Calculate the percentage decrease",
      body: `Divide the lost coefficient by the original coefficient. The answer is ${answer}.`,
      equation: `$\\frac{${state.decreaseCoefficient}}{${state.oldMaterialCoefficient}}\\times100=${answer.replace(/^\$|\$$/g, "")}$`,
    },
  ];
  const shortcut = `The loss is caused only by the larger void: $r_{new}^2-r_{old}^2=(${state.newInnerRadius}-${state.oldInnerRadius})(${state.newInnerRadius}+${state.oldInnerRadius})=${state.decreaseCoefficient}$. Divide this directly by $R^2-r_{old}^2=${state.oldMaterialCoefficient}$; $\\pi h$ cancels.`;
  return {
    learnerSolution: {
      formula,
      steps: steps.map((step) => `${step.title}: ${step.body} ${step.equation ?? ""}`),
      finalAnswer: answer,
      shortcut,
      wrongOptionAnalysis,
    } satisfies MenCp011RatioPercentLearnerSolution,
    explanation: { keyRule, steps, shortcut, traps: wrongOptionAnalysis },
  };
}

function verify(state: MenCp011RatioPercentState, exactAnswer: ExactValue) {
  if (state.target === "RATIO") {
    const reconstructed = rational(
      state.lengthA! *
        (state.outerRadiusA! * state.outerRadiusA! -
          state.innerRadiusA! * state.innerRadiusA!),
      state.lengthB! *
        (state.outerRadiusB! * state.outerRadiusB! -
          state.innerRadiusB! * state.innerRadiusB!),
    );
    return {
      valid: exactEquals(exactAnswer, reconstructed),
      method: "Independent hollow-pipe material coefficient ratio with pi cancellation",
      reconstructed: `${reconstructed.numerator}:${reconstructed.denominator}`,
    };
  }

  const oldCoefficient =
    state.outerRadius! * state.outerRadius! -
    state.oldInnerRadius! * state.oldInnerRadius!;
  const newCoefficient =
    state.outerRadius! * state.outerRadius! -
    state.newInnerRadius! * state.newInnerRadius!;
  const reconstructed = rational(
    (oldCoefficient - newCoefficient) * 100n,
    oldCoefficient,
  );
  return {
    valid: exactEquals(exactAnswer, reconstructed),
    method: "Independent old-versus-new material coefficient percentage comparison",
    reconstructed: `(${oldCoefficient}-${newCoefficient})/${oldCoefficient}×100=${formatExactPlain(reconstructed)}%`,
  };
}

function learnerText(question: Pick<
  MenCp011RatioPercentPackage,
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

function validate(question: Omit<MenCp011RatioPercentPackage, "validation">) {
  const checks: Array<{ name: string; passed: boolean; message: string }> = [];
  const add = (name: string, passed: boolean, message: string) =>
    checks.push({ name, passed, message });
  const text = learnerText(question);

  add(
    "physical-state",
    question.state.target === "RATIO"
      ? question.state.outerRadiusA! > question.state.innerRadiusA! &&
          question.state.outerRadiusB! > question.state.innerRadiusB! &&
          question.state.lengthA! > 0n && question.state.lengthB! > 0n
      : question.state.outerRadius! > question.state.newInnerRadius! &&
          question.state.newInnerRadius! > question.state.oldInnerRadius! &&
          question.state.oldInnerRadius! > 0n && question.state.fixedLength! > 0n,
    "All pipe dimensions and bore-change relationships must be physically valid.",
  );
  add(
    "positive-answer",
    question.exactAnswer.kind === "RATIONAL" &&
      question.exactAnswer.numerator > 0n &&
      question.exactAnswer.denominator > 0n,
    "The ratio or percentage answer must be positive.",
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
    "Independent ratio or percentage reconstruction must match the canonical answer.",
  );
  add(
    "diagram-contract",
    question.state.target === "RATIO"
      ? question.diagram.svg.includes('data-diagram-version="PIPE_MATERIAL_RATIO_V1"') &&
          question.diagram.svg.includes('data-role="cancellation-note"')
      : question.diagram.svg.includes('data-diagram-version="PIPE_BORE_CHANGE_PERCENT_V1"') &&
          question.diagram.svg.includes('data-role="fixed-state-note"'),
    "The diagram must show the correct comparison or fixed-state transformation.",
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
    !/\[(?:USED_|MEN-CP011-PROT-)/.test(text) &&
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

export function generateMenCp011RatioPercentQuestion(
  prototypeId: MenCp011RatioPercentPrototypeId,
  seed: string,
  constraints: MenCp011RatioPercentGenerationConstraints = {},
): MenCp011RatioPercentPackage {
  for (let attempt = 0; attempt < 48; attempt += 1) {
    const state = createState(prototypeId, seed, constraints, attempt);
    const candidates = candidatesFor(state);
    if (new Set(candidates.map((candidate) => exactKey(candidate.value))).size !== 4) {
      continue;
    }
    const optionPermutationSeed =
      `${MEN_CP011_RATIO_PERCENT_AUTHORITY}|options|${prototypeId}|${seed}|${attempt}`;
    const { arranged, correctIndex } = arrangeCandidates(
      candidates,
      optionPermutationSeed,
      constraints.correctIndex,
    );
    const options: MenCp011RatioPercentOption[] = arranged.map((candidate, index) => ({
      label: LABELS[index]!,
      value: candidate.value,
      display: formatAnswer(state.target, candidate.value),
      isCorrect: candidate.misconceptionId === null,
      misconceptionId: candidate.misconceptionId,
    }));
    const exactAnswer = state.exactAnswer;
    const verification = verify(state, exactAnswer);
    const diagram = buildDiagram(state, "PROMPT");
    const solutionDiagram = buildDiagram(state, "SOLUTION");
    const explanationParts = buildExplanation(state, options);
    const unit = state.target === "RATIO" ? "times" : "%";
    const withoutValidation: Omit<MenCp011RatioPercentPackage, "validation"> = {
      packageId: "MEN-002",
      canonicalProblemId: "MEN-CP-011",
      permanentQlId: null,
      waveId: "MEN-CP-011-RATIO-PERCENT-WAVE-01",
      prototypeId,
      solveMode: state.solveMode,
      language: "en",
      seed,
      difficulty: state.difficulty,
      target: state.target,
      unit,
      ratioPercentAuthority: MEN_CP011_RATIO_PERCENT_AUTHORITY,
      sourceMaturity: state.sourceMaturity,
      stem: createStem(state),
      options,
      correctIndex,
      answer: formatAnswer(state.target, exactAnswer),
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
          diagramPolicy: "OPTIONAL_PROMPT_SAFE_RATIO_PERCENT_DIAGRAM",
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
    `Unable to generate a valid MEN-CP-011 ratio/percent package for ${prototypeId} and seed ${seed}.`,
  );
}

export function generateMenCp011RatioPercentReviewBatch() {
  const records: MenCp011RatioPercentPackage[] = [];
  const units: readonly MenCp011RatioPercentLinearUnit[] = ["cm", "m"];
  for (const prototypeId of getMenCp011RatioPercentPrototypeIds()) {
    for (let unitIndex = 0; unitIndex < units.length; unitIndex += 1) {
      for (let fixtureIndex = 0; fixtureIndex < 8; fixtureIndex += 1) {
        records.push(
          generateMenCp011RatioPercentQuestion(
            prototypeId,
            `ratio-percent-review:${prototypeId}:${units[unitIndex]}:${fixtureIndex}`,
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
  return { authority: MEN_CP011_RATIO_PERCENT_AUTHORITY, records };
}

function normalizeStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\d+/g, "<n>")
    .replace(/\s+/g, " ")
    .trim();
}

export function auditMenCp011RatioPercentBatch(
  records: readonly MenCp011RatioPercentPackage[],
) {
  const normalizedCounts = new Map<string, number>();
  const exactStems = new Set<string>();
  const exactPackages = new Set<string>();
  const physicalStates = new Set<string>();
  const unitCounts: Record<MenCp011RatioPercentLinearUnit, number> = { cm: 0, m: 0 };
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
        question.state.outerRadiusA,
        question.state.innerRadiusA,
        question.state.lengthA,
        question.state.outerRadiusB,
        question.state.innerRadiusB,
        question.state.lengthB,
        question.state.outerRadius,
        question.state.oldInnerRadius,
        question.state.newInnerRadius,
        question.state.fixedLength,
      ].join("|"),
    );
    unitCounts[question.state.unit] += 1;
    answerPositionCounts[LABELS[question.correctIndex]!] += 1;
    const cell = `${question.prototypeId}|${question.state.unit}`;
    prototypeUnitCounts[cell] = (prototypeUnitCounts[cell] ?? 0) + 1;
  }

  return {
    authority: MEN_CP011_RATIO_PERCENT_AUTHORITY,
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
    resolvedDiscoveryCandidates: getMenCp011RatioPercentPrototypeIds(),
  };
}

export function describeMenCp011RatioPercentAnswer(
  question: MenCp011RatioPercentPackage,
) {
  return `${question.prototypeId}: ${question.answer}`;
}
