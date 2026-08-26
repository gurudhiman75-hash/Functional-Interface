import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import { solveMen001 } from "../../../../../quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/MEN-001/solver.ts";
import type { Men001Parameters, Men001SolveMode } from "../../../../../quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/MEN-001/types.ts";
import { buildMenCp010State, solveMenCp010 } from "../../../../../quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/MEN-002/cp010-foundation/engine.ts";
import type { MenCp010State } from "../../../../../quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/MEN-002/cp010-foundation/types.ts";
import { exactKey, formatWithUnit } from "../../../../../quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/MEN-002/foundation/exact.ts";

export const DSF_CP011_MENSURATION_RUNTIME_VERSION = "DSF_CP011_MENSURATION_RUNTIME_V1" as const;
export const DSF_CP011_MENSURATION_SOLVE_MODES = [
  "DSF-SM-MEN-TRIANGLE-AREA",
  "DSF-SM-MEN-RECTANGLE-AREA",
  "DSF-SM-MEN-RECTANGLE-PERIMETER",
  "DSF-SM-MEN-CIRCLE-AREA",
  "DSF-SM-MEN-CIRCLE-CIRCUMFERENCE",
  "DSF-SM-MEN-SQUARE-PYRAMID-VOLUME",
  "DSF-SM-MEN-CONICAL-FRUSTUM-VOLUME",
] as const;

export type DsfCp011MensurationSolveMode = (typeof DSF_CP011_MENSURATION_SOLVE_MODES)[number];
export type DsfCp011MensurationDifficulty = "Easy" | "Medium" | "Hard";
export type DsfCp011MensurationTargetKind = "AREA" | "PERIMETER" | "CIRCUMFERENCE" | "VOLUME";

type ContextId =
  | "TRIANGULAR_PLOT"
  | "TRIANGULAR_BOARD"
  | "RECTANGULAR_FIELD"
  | "RECTANGULAR_FLOOR"
  | "CIRCULAR_GARDEN"
  | "CIRCULAR_TRACK"
  | "PYRAMID_MODEL"
  | "PYRAMID_STRUCTURE"
  | "FRUSTUM_CONTAINER"
  | "FRUSTUM_MODEL";

type StatementFamily =
  | "BASE_EXACT"
  | "HEIGHT_EXACT"
  | "AREA_EXACT"
  | "BASE_HEIGHT_PAIR"
  | "DIMENSION_BOUND"
  | "LENGTH_EXACT"
  | "BREADTH_EXACT"
  | "PERIMETER_EXACT"
  | "LENGTH_BREADTH_PAIR"
  | "RADIUS_EXACT"
  | "DIAMETER_EXACT"
  | "CIRCUMFERENCE_EXACT"
  | "RADIUS_WINDOW_LOWER"
  | "RADIUS_WINDOW_UPPER"
  | "PYRAMID_SIDE_EXACT"
  | "PYRAMID_HEIGHT_EXACT"
  | "PYRAMID_VOLUME_EXACT"
  | "PYRAMID_SIDE_HEIGHT_PAIR"
  | "FRUSTUM_RADII_PAIR"
  | "FRUSTUM_HEIGHT_EXACT"
  | "FRUSTUM_VOLUME_EXACT"
  | "FRUSTUM_FULL_DATA"
  | "SOLID_BOUND";

interface TwoDWorld {
  readonly kind: "TRIANGLE" | "RECTANGLE" | "CIRCLE";
  readonly a: number;
  readonly b?: number;
  readonly area?: string;
  readonly perimeter?: string;
  readonly circumference?: string;
}

interface SolidWorld {
  readonly kind: "SQUARE_PYRAMID" | "CONICAL_FRUSTUM";
  readonly state: MenCp010State;
  readonly answerKey: string;
  readonly answerDisplay: string;
}

type MensurationWorld = TwoDWorld | SolidWorld;

interface MensurationProblem {
  readonly solveMode: DsfCp011MensurationSolveMode;
  readonly targetKind: DsfCp011MensurationTargetKind;
  readonly anchor: MensurationWorld;
  readonly contextId: ContextId;
  readonly intro: string;
}

interface MensurationStatement {
  readonly id: string;
  readonly family: StatementFamily;
  readonly complexity: 1 | 2 | 3;
  readonly text: string;
  readonly test: (world: MensurationWorld) => boolean;
}

interface SynthesizedPair {
  readonly statementI: MensurationStatement;
  readonly statementII: MensurationStatement;
  readonly evaluation: TwoStatementSufficiencyEvaluation<string>;
  readonly qualityScore: number;
}

const TRIANGLE_CONTEXTS = [
  { id: "TRIANGULAR_PLOT" as const, intros: ["A triangular plot has a known base and perpendicular height.", "Consider a triangular plot measured by its base and perpendicular height.", "The dimensions of a triangular plot are being examined.", "A triangular piece of land is measured using a base and its perpendicular height."] },
  { id: "TRIANGULAR_BOARD" as const, intros: ["A triangular board has a known base and perpendicular height.", "Consider a triangular board measured by its base and perpendicular height.", "The dimensions of a triangular board are being examined.", "A triangular panel is measured using a base and its perpendicular height."] },
] as const;

const RECTANGLE_CONTEXTS = [
  { id: "RECTANGULAR_FIELD" as const, intros: ["A rectangular field has fixed length and breadth.", "Consider a rectangular field with perpendicular length and breadth.", "The dimensions of a rectangular field are being examined.", "A rectangular field is measured by its length and breadth."] },
  { id: "RECTANGULAR_FLOOR" as const, intros: ["A rectangular floor has fixed length and breadth.", "Consider a rectangular floor with perpendicular length and breadth.", "The dimensions of a rectangular floor are being examined.", "A rectangular floor is measured by its length and breadth."] },
] as const;

const CIRCLE_CONTEXTS = [
  { id: "CIRCULAR_GARDEN" as const, intros: ["A circular garden has a fixed radius.", "Consider a circular garden whose radius is being measured.", "The dimensions of a circular garden are under consideration.", "A circular garden is described by its radius."] },
  { id: "CIRCULAR_TRACK" as const, intros: ["A circular track has a fixed radius.", "Consider a circular track whose radius is being measured.", "The dimensions of a circular track are under consideration.", "A circular track is described by its radius."] },
] as const;

const PYRAMID_CONTEXTS = [
  { id: "PYRAMID_MODEL" as const, intros: ["A square-pyramid model has a square base and vertical height.", "Consider a square pyramid with a known base side and vertical height.", "The dimensions of a square-pyramid model are being examined.", "A square pyramid is described by its base side and perpendicular height."] },
  { id: "PYRAMID_STRUCTURE" as const, intros: ["A square-pyramid structure has a square base and vertical height.", "Consider a square-pyramid structure with a known base side and vertical height.", "The dimensions of a square-pyramid structure are being examined.", "A square-pyramid structure is described by its base side and perpendicular height."] },
] as const;

const FRUSTUM_CONTEXTS = [
  { id: "FRUSTUM_CONTAINER" as const, intros: ["A conical-frustum container has two circular ends and a vertical height.", "Consider a conical frustum described by its two radii and height.", "The dimensions of a conical-frustum container are being examined.", "A frustum-shaped container is measured by its outer radius, inner radius and vertical height."] },
  { id: "FRUSTUM_MODEL" as const, intros: ["A conical-frustum model has two circular ends and a vertical height.", "Consider a conical-frustum model described by its two radii and height.", "The dimensions of a conical-frustum model are being examined.", "A frustum-shaped model is measured by its outer radius, inner radius and vertical height."] },
] as const;

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  for (const ch of `${DSF_CP011_MENSURATION_RUNTIME_VERSION}:${seed}:${salt}`) {
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: number, salt: string): () => number {
  let state = hashSeed(seed, salt) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function pick<T>(random: () => number, values: readonly T[]): T {
  return values[Math.floor(random() * values.length)]!;
}

function desiredClass(seed: number): SufficiencyClass {
  return SUFFICIENCY_CLASSES[Math.abs(seed) % SUFFICIENCY_CLASSES.length]!;
}

function men001Params(
  solveMode: Men001SolveMode,
  values: Men001Parameters["values"],
  cp: "MEN-CP-001" | "MEN-CP-002" | "MEN-CP-003",
  taskKind: Men001Parameters["taskKind"],
  answerDimension: Men001Parameters["answerDimension"],
  unitPolicy: Men001Parameters["unitPolicy"],
): Men001Parameters {
  return {
    packageId: "MEN-001",
    canonicalProblemId: cp,
    questionId: `DSF-CP011-${solveMode}`,
    questionLanguageId: `DSF-CP011-${solveMode}`,
    language: "en",
    difficulty: "Medium",
    taskKind,
    solveMode,
    answerDimension,
    unitPolicy,
    seed: "DSF-CP011",
    values,
    renderVariables: {},
  };
}

function solve2d(mode: DsfCp011MensurationSolveMode, world: TwoDWorld): string {
  switch (mode) {
    case "DSF-SM-MEN-TRIANGLE-AREA":
      return solveMen001(men001Params("findTriangleAreaBaseHeight", { base: world.a, height: world.b }, "MEN-CP-001", "triangleMeasurementApplication", "AREA", "SQUARE_METRES")).answer;
    case "DSF-SM-MEN-RECTANGLE-AREA":
      return solveMen001(men001Params("findRectangleArea", { length: world.a, breadth: world.b }, "MEN-CP-002", "quadrilateralMeasurementApplication", "AREA", "SQUARE_METRES")).answer;
    case "DSF-SM-MEN-RECTANGLE-PERIMETER":
      return solveMen001(men001Params("findRectanglePerimeter", { length: world.a, breadth: world.b }, "MEN-CP-002", "quadrilateralMeasurementApplication", "LENGTH", "METRES")).answer;
    case "DSF-SM-MEN-CIRCLE-AREA":
      return solveMen001(men001Params("findCircleAreaFromRadius", { radius: world.a }, "MEN-CP-003", "circleMeasurementApplication", "AREA", "SQUARE_METRES")).answer;
    case "DSF-SM-MEN-CIRCLE-CIRCUMFERENCE":
      return solveMen001(men001Params("findCircleCircumferenceFromRadius", { radius: world.a }, "MEN-CP-003", "circleMeasurementApplication", "LENGTH", "METRES")).answer;
    default:
      throw new Error(`Mode ${mode} is not a MEN-001 2D mode.`);
  }
}

function buildTriangleWorlds(): readonly TwoDWorld[] {
  const worlds: TwoDWorld[] = [];
  for (const base of [8, 10, 12, 14, 16, 18, 20, 24] as const) {
    for (const height of [6, 8, 10, 12, 14, 16, 18, 20] as const) {
      const world: TwoDWorld = { kind: "TRIANGLE", a: base, b: height };
      worlds.push({ ...world, area: solve2d("DSF-SM-MEN-TRIANGLE-AREA", world) });
    }
  }
  return worlds;
}

function buildRectangleWorlds(): readonly TwoDWorld[] {
  const worlds: TwoDWorld[] = [];
  for (const length of [12, 15, 18, 20, 24, 28, 30, 32] as const) {
    for (const breadth of [6, 8, 9, 10, 12, 14, 16, 18] as const) {
      if (length <= breadth) continue;
      const world: TwoDWorld = { kind: "RECTANGLE", a: length, b: breadth };
      worlds.push({
        ...world,
        area: solve2d("DSF-SM-MEN-RECTANGLE-AREA", world),
        perimeter: solve2d("DSF-SM-MEN-RECTANGLE-PERIMETER", world),
      });
    }
  }
  return worlds;
}

function buildCircleWorlds(): readonly TwoDWorld[] {
  return ([7, 14, 21, 28, 35, 42, 49, 56] as const).map((radius) => {
    const world: TwoDWorld = { kind: "CIRCLE", a: radius };
    return {
      ...world,
      area: solve2d("DSF-SM-MEN-CIRCLE-AREA", world),
      circumference: solve2d("DSF-SM-MEN-CIRCLE-CIRCUMFERENCE", world),
    };
  });
}

function solidSignature(state: MenCp010State): string {
  const dimensions = Object.entries(state.dimensions).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join("|");
  return `${state.prototypeId}|${state.piPolicy ?? "NO_PI"}|${state.unit}|${dimensions}`;
}

function buildSolidWorlds(kind: SolidWorld["kind"]): readonly SolidWorld[] {
  const prototype = kind === "SQUARE_PYRAMID"
    ? "MEN-CP010-PROT-SQUARE-PYRAMID-VOLUME"
    : "MEN-CP010-PROT-CONICAL-FRUSTUM-VOLUME";
  const unique = new Map<string, SolidWorld>();
  for (let seed = 0; seed < 500; seed += 1) {
    const state = buildMenCp010State(prototype, `DSF-CP011-${kind}-${seed}`);
    if (kind === "CONICAL_FRUSTUM" && state.piPolicy !== "EXACT_PI") continue;
    const answer = solveMenCp010(state);
    const signature = solidSignature(state);
    if (!unique.has(signature)) {
      unique.set(signature, {
        kind,
        state,
        answerKey: exactKey(answer),
        answerDisplay: formatWithUnit(answer, state.unit),
      });
    }
  }
  const worlds = [...unique.values()];
  if (worlds.length < 12) throw new Error(`MEN-002 ${kind} finite world set is unexpectedly thin (${worlds.length}).`);
  return worlds;
}

const TRIANGLE_WORLDS = buildTriangleWorlds();
const RECTANGLE_WORLDS = buildRectangleWorlds();
const CIRCLE_WORLDS = buildCircleWorlds();
const PYRAMID_WORLDS = buildSolidWorlds("SQUARE_PYRAMID");
const FRUSTUM_WORLDS = buildSolidWorlds("CONICAL_FRUSTUM");

function sourceAnswer(problem: MensurationProblem, world: MensurationWorld): string {
  if (world.kind === "SQUARE_PYRAMID" || world.kind === "CONICAL_FRUSTUM") {
    return exactKey(solveMenCp010(world.state));
  }
  return solve2d(problem.solveMode, world);
}

function baseWorlds(problem: MensurationProblem): readonly MensurationWorld[] {
  switch (problem.solveMode) {
    case "DSF-SM-MEN-TRIANGLE-AREA": return TRIANGLE_WORLDS;
    case "DSF-SM-MEN-RECTANGLE-AREA":
    case "DSF-SM-MEN-RECTANGLE-PERIMETER": return RECTANGLE_WORLDS;
    case "DSF-SM-MEN-CIRCLE-AREA":
    case "DSF-SM-MEN-CIRCLE-CIRCUMFERENCE": return CIRCLE_WORLDS;
    case "DSF-SM-MEN-SQUARE-PYRAMID-VOLUME": return PYRAMID_WORLDS;
    case "DSF-SM-MEN-CONICAL-FRUSTUM-VOLUME": return FRUSTUM_WORLDS;
  }
}

const adapter = {
  adapterId: "DSF-CP011-MENSURATION-SOURCE-BOUND",
  domainFamily: "QUANT" as const,
  enumerateBaseWorlds: baseWorlds,
  statementHolds: (_problem: MensurationProblem, world: MensurationWorld, statement: MensurationStatement) => statement.test(world),
  evaluateTarget: (problem: MensurationProblem, world: MensurationWorld) => sourceAnswer(problem, world),
  normalizeAnswer: (answer: string) => answer,
};

function st(id: string, family: StatementFamily, complexity: 1 | 2 | 3, text: string, test: (world: MensurationWorld) => boolean): MensurationStatement {
  return { id, family, complexity, text, test };
}

function twoDStatements(problem: MensurationProblem, anchor: TwoDWorld): readonly MensurationStatement[] {
  if (anchor.kind === "TRIANGLE") {
    const base = anchor.a, height = anchor.b!, area = anchor.area!;
    return [
      st(`B_${base}`, "BASE_EXACT", 1, `The base is ${base} metres.`, w => w.kind === "TRIANGLE" && w.a === base),
      st(`H_${height}`, "HEIGHT_EXACT", 1, `The perpendicular height is ${height} metres.`, w => w.kind === "TRIANGLE" && w.b === height),
      st(`A_${area}`, "AREA_EXACT", 1, `The area is ${area}.`, w => w.kind === "TRIANGLE" && w.area === area),
      st(`BH_${base}_${height}`, "BASE_HEIGHT_PAIR", 2, `The base is ${base} m and the perpendicular height is ${height} m.`, w => w.kind === "TRIANGLE" && w.a === base && w.b === height),
      st(`B_LE_${base}`, "DIMENSION_BOUND", 2, `The base is at most ${base} metres.`, w => w.kind === "TRIANGLE" && w.a <= base),
      st(`H_GE_${height}`, "DIMENSION_BOUND", 2, `The height is at least ${height} metres.`, w => w.kind === "TRIANGLE" && (w.b ?? 0) >= height),
    ];
  }
  if (anchor.kind === "RECTANGLE") {
    const length = anchor.a, breadth = anchor.b!, area = anchor.area!, perimeter = anchor.perimeter!;
    const targetText = problem.solveMode === "DSF-SM-MEN-RECTANGLE-AREA" ? area : perimeter;
    const targetFamily: StatementFamily = problem.solveMode === "DSF-SM-MEN-RECTANGLE-AREA" ? "AREA_EXACT" : "PERIMETER_EXACT";
    return [
      st(`L_${length}`, "LENGTH_EXACT", 1, `The length is ${length} metres.`, w => w.kind === "RECTANGLE" && w.a === length),
      st(`BR_${breadth}`, "BREADTH_EXACT", 1, `The breadth is ${breadth} metres.`, w => w.kind === "RECTANGLE" && w.b === breadth),
      st(`TARGET_${targetText}`, targetFamily, 1, `The ${problem.solveMode === "DSF-SM-MEN-RECTANGLE-AREA" ? "area" : "perimeter"} is ${targetText}.`, w => w.kind === "RECTANGLE" && (problem.solveMode === "DSF-SM-MEN-RECTANGLE-AREA" ? w.area : w.perimeter) === targetText),
      st(`LB_${length}_${breadth}`, "LENGTH_BREADTH_PAIR", 2, `The length is ${length} m and the breadth is ${breadth} m.`, w => w.kind === "RECTANGLE" && w.a === length && w.b === breadth),
      st(`L_LE_${length}`, "DIMENSION_BOUND", 2, `The length is at most ${length} metres.`, w => w.kind === "RECTANGLE" && w.a <= length),
      st(`BR_GE_${breadth}`, "DIMENSION_BOUND", 2, `The breadth is at least ${breadth} metres.`, w => w.kind === "RECTANGLE" && (w.b ?? 0) >= breadth),
    ];
  }

  const radius = anchor.a;
  const sorted = CIRCLE_WORLDS.map(w => w.a).sort((a, b) => a - b);
  const index = sorted.indexOf(radius);
  const lower = index > 0 ? sorted[index - 1]! : 0;
  const upper = index < sorted.length - 1 ? sorted[index + 1]! : radius + 14;
  const target = problem.solveMode === "DSF-SM-MEN-CIRCLE-AREA" ? anchor.area! : anchor.circumference!;
  const targetFamily: StatementFamily = problem.solveMode === "DSF-SM-MEN-CIRCLE-AREA" ? "AREA_EXACT" : "CIRCUMFERENCE_EXACT";
  return [
    st(`R_${radius}`, "RADIUS_EXACT", 1, `The radius is ${radius} metres.`, w => w.kind === "CIRCLE" && w.a === radius),
    st(`D_${radius * 2}`, "DIAMETER_EXACT", 1, `The diameter is ${radius * 2} metres.`, w => w.kind === "CIRCLE" && w.a * 2 === radius * 2),
    st(`TARGET_${target}`, targetFamily, 1, `The ${problem.solveMode === "DSF-SM-MEN-CIRCLE-AREA" ? "area" : "circumference"} is ${target}.`, w => w.kind === "CIRCLE" && (problem.solveMode === "DSF-SM-MEN-CIRCLE-AREA" ? w.area : w.circumference) === target),
    st(`RL_${lower}`, "RADIUS_WINDOW_LOWER", 2, `The radius is greater than ${lower} metres.`, w => w.kind === "CIRCLE" && w.a > lower),
    st(`RU_${upper}`, "RADIUS_WINDOW_UPPER", 2, `The radius is less than ${upper} metres.`, w => w.kind === "CIRCLE" && w.a < upper),
  ];
}

function solidStatements(anchor: SolidWorld): readonly MensurationStatement[] {
  const d = anchor.state.dimensions;
  if (anchor.kind === "SQUARE_PYRAMID") {
    const side = Number(d.side), height = Number(d.height);
    return [
      st(`PS_${side}`, "PYRAMID_SIDE_EXACT", 1, `The square base has side ${side} ${anchor.state.unit.startsWith("cm") ? "cm" : "m"}.`, w => w.kind === "SQUARE_PYRAMID" && w.state.dimensions.side === d.side),
      st(`PH_${height}`, "PYRAMID_HEIGHT_EXACT", 1, `The perpendicular height is ${height} ${anchor.state.unit.startsWith("cm") ? "cm" : "m"}.`, w => w.kind === "SQUARE_PYRAMID" && w.state.dimensions.height === d.height),
      st(`PV_${anchor.answerKey}`, "PYRAMID_VOLUME_EXACT", 1, `The volume is ${anchor.answerDisplay}.`, w => w.kind === "SQUARE_PYRAMID" && w.answerKey === anchor.answerKey),
      st(`PSH_${side}_${height}`, "PYRAMID_SIDE_HEIGHT_PAIR", 2, `The base side is ${side} and the perpendicular height is ${height} in the stated length unit.`, w => w.kind === "SQUARE_PYRAMID" && w.state.dimensions.side === d.side && w.state.dimensions.height === d.height),
      st(`PS_LE_${side}`, "SOLID_BOUND", 2, `The base side is at most ${side} in the stated length unit.`, w => w.kind === "SQUARE_PYRAMID" && Number(w.state.dimensions.side) <= side),
      st(`PH_GE_${height}`, "SOLID_BOUND", 2, `The height is at least ${height} in the stated length unit.`, w => w.kind === "SQUARE_PYRAMID" && Number(w.state.dimensions.height) >= height),
    ];
  }

  const outer = Number(d.outerRadius), inner = Number(d.innerRadius), height = Number(d.height);
  return [
    st(`FR_${outer}_${inner}`, "FRUSTUM_RADII_PAIR", 2, `The outer and inner radii are ${outer} and ${inner} in the stated length unit.`, w => w.kind === "CONICAL_FRUSTUM" && w.state.dimensions.outerRadius === d.outerRadius && w.state.dimensions.innerRadius === d.innerRadius),
    st(`FH_${height}`, "FRUSTUM_HEIGHT_EXACT", 1, `The perpendicular height is ${height} in the stated length unit.`, w => w.kind === "CONICAL_FRUSTUM" && w.state.dimensions.height === d.height),
    st(`FV_${anchor.answerKey}`, "FRUSTUM_VOLUME_EXACT", 1, `The volume is ${anchor.answerDisplay}.`, w => w.kind === "CONICAL_FRUSTUM" && w.answerKey === anchor.answerKey),
    st(`FF_${outer}_${inner}_${height}`, "FRUSTUM_FULL_DATA", 3, `The outer radius is ${outer}, inner radius is ${inner}, and perpendicular height is ${height} in the stated length unit.`, w => w.kind === "CONICAL_FRUSTUM" && w.state.dimensions.outerRadius === d.outerRadius && w.state.dimensions.innerRadius === d.innerRadius && w.state.dimensions.height === d.height),
    st(`FO_LE_${outer}`, "SOLID_BOUND", 2, `The outer radius is at most ${outer} in the stated length unit.`, w => w.kind === "CONICAL_FRUSTUM" && Number(w.state.dimensions.outerRadius) <= outer),
    st(`FH_GE_${height}`, "SOLID_BOUND", 2, `The height is at least ${height} in the stated length unit.`, w => w.kind === "CONICAL_FRUSTUM" && Number(w.state.dimensions.height) >= height),
  ];
}

function statementPool(problem: MensurationProblem): readonly MensurationStatement[] {
  return problem.anchor.kind === "SQUARE_PYRAMID" || problem.anchor.kind === "CONICAL_FRUSTUM"
    ? solidStatements(problem.anchor)
    : twoDStatements(problem, problem.anchor);
}

function pairQuality(first: MensurationStatement, second: MensurationStatement, evaluation: TwoStatementSufficiencyEvaluation<string>): number {
  return (first.family === second.family ? -5 : 5)
    + (evaluation.classification === "BOTH_TOGETHER_ONLY" ? 8 : evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER" ? 3 : 0)
    + Math.floor((Math.min(evaluation.statementI.worldCount, 50) + Math.min(evaluation.statementII.worldCount, 50)) / 20)
    - first.complexity - second.complexity;
}

function synthesizePair(problem: MensurationProblem, seed: number, targetClass: SufficiencyClass): SynthesizedPair {
  const candidates: SynthesizedPair[] = [];
  const statements = statementPool(problem);
  for (const statementI of statements) {
    for (const statementII of statements) {
      if (statementI.id === statementII.id) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
        if (evaluation.classification === targetClass) candidates.push({ statementI, statementII, evaluation, qualityScore: pairQuality(statementI, statementII, evaluation) });
      } catch {
        // Empty conjunctions are generation rejects.
      }
    }
  }
  if (!candidates.length) throw new Error(`No Mensuration pair for ${problem.solveMode}/${targetClass}`);
  const best = Math.max(...candidates.map(c => c.qualityScore));
  return pick(createRng(seed, `pair:${problem.solveMode}:${targetClass}`), candidates.filter(c => c.qualityScore >= best - 2));
}

function buildProblem(seed: number, attempt: number): MensurationProblem {
  const solveMode = DSF_CP011_MENSURATION_SOLVE_MODES[Math.abs(seed) % DSF_CP011_MENSURATION_SOLVE_MODES.length]!;
  const random = createRng(seed + attempt * 65537, `problem:${solveMode}`);
  if (solveMode === "DSF-SM-MEN-TRIANGLE-AREA") {
    const context = pick(random, TRIANGLE_CONTEXTS);
    return { solveMode, targetKind: "AREA", anchor: pick(random, TRIANGLE_WORLDS), contextId: context.id, intro: pick(random, context.intros) };
  }
  if (solveMode === "DSF-SM-MEN-RECTANGLE-AREA" || solveMode === "DSF-SM-MEN-RECTANGLE-PERIMETER") {
    const context = pick(random, RECTANGLE_CONTEXTS);
    return { solveMode, targetKind: solveMode.endsWith("AREA") ? "AREA" : "PERIMETER", anchor: pick(random, RECTANGLE_WORLDS), contextId: context.id, intro: pick(random, context.intros) };
  }
  if (solveMode === "DSF-SM-MEN-CIRCLE-AREA" || solveMode === "DSF-SM-MEN-CIRCLE-CIRCUMFERENCE") {
    const context = pick(random, CIRCLE_CONTEXTS);
    return { solveMode, targetKind: solveMode.endsWith("AREA") ? "AREA" : "CIRCUMFERENCE", anchor: pick(random, CIRCLE_WORLDS), contextId: context.id, intro: pick(random, context.intros) };
  }
  if (solveMode === "DSF-SM-MEN-SQUARE-PYRAMID-VOLUME") {
    const context = pick(random, PYRAMID_CONTEXTS);
    return { solveMode, targetKind: "VOLUME", anchor: pick(random, PYRAMID_WORLDS), contextId: context.id, intro: pick(random, context.intros) };
  }
  const context = pick(random, FRUSTUM_CONTEXTS);
  return { solveMode, targetKind: "VOLUME", anchor: pick(random, FRUSTUM_WORLDS), contextId: context.id, intro: pick(random, context.intros) };
}

function targetPrompt(problem: MensurationProblem): string {
  switch (problem.solveMode) {
    case "DSF-SM-MEN-TRIANGLE-AREA": return "What is the area of the triangle?";
    case "DSF-SM-MEN-RECTANGLE-AREA": return "What is the area of the rectangle?";
    case "DSF-SM-MEN-RECTANGLE-PERIMETER": return "What is the perimeter of the rectangle?";
    case "DSF-SM-MEN-CIRCLE-AREA": return "What is the area of the circle?";
    case "DSF-SM-MEN-CIRCLE-CIRCUMFERENCE": return "What is the circumference of the circle?";
    case "DSF-SM-MEN-SQUARE-PYRAMID-VOLUME": return "What is the volume of the square pyramid?";
    case "DSF-SM-MEN-CONICAL-FRUSTUM-VOLUME": return "What is the volume of the conical frustum?";
  }
}

function explanation(label: string, answers: readonly string[], sufficient: boolean): string {
  if (sufficient) return `${label} fixes the asked value at ${answers[0]}. Therefore, ${label} alone is sufficient.`;
  const examples = answers.slice(0, 2);
  return examples.length >= 2
    ? `${label} permits at least two different answers, ${examples[0]} and ${examples[1]}. Therefore, ${label} alone is not sufficient.`
    : `${label} does not fix a unique answer. Therefore, ${label} alone is not sufficient.`;
}

function difficultyFor(pair: SynthesizedPair): DsfCp011MensurationDifficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  return pair.statementI.complexity === 1 && pair.statementII.complexity === 1 ? "Easy" : "Medium";
}

export function normalizeDsfCp011MensurationSurface(text: string): string {
  return text.toLowerCase().replace(/\d+(?:\.\d+)?(?:\/\d+)?/g, "#").replace(/[^a-z#]+/g, " ").trim().replace(/\s+/g, " ");
}

export function generateDsfCp011MensurationQuestion(seed: number) {
  const targetClass = desiredClass(seed);
  let problem: MensurationProblem | undefined;
  let pair: SynthesizedPair | undefined;
  let lastError: unknown;
  for (let attempt = 0; attempt < 48; attempt += 1) {
    const candidate = buildProblem(seed, attempt);
    try {
      pair = synthesizePair(candidate, seed + attempt * 104729, targetClass);
      problem = candidate;
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (!problem || !pair) throw lastError instanceof Error ? lastError : new Error(`Unable to synthesize Mensuration DS question for seed ${seed}`);

  const evaluation = pair.evaluation;
  const prompt = targetPrompt(problem);
  const stem = `${problem.intro} ${prompt}`;
  const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
  const sourceChapterId = problem.anchor.kind === "SQUARE_PYRAMID" || problem.anchor.kind === "CONICAL_FRUSTUM" ? "MEN-002" as const : "MEN-001" as const;
  const sourceCapability = sourceChapterId === "MEN-001" ? "MEN-001/solver::solveMen001" as const : "MEN-002/cp010-foundation/engine::{buildMenCp010State,solveMenCp010}" as const;
  const together = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? (evaluation.together.sufficient
      ? `Using both statements together fixes the asked value at ${evaluation.together.normalizedTargetAnswers[0]}. So the two statements together are sufficient.`
      : `Even together, the statements allow different answers such as ${evaluation.together.normalizedTargetAnswers.slice(0, 2).join(" and ")}. So they are still insufficient.`)
    : undefined;

  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-011" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP011_MENSURATION_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficultyFor(pair),
    domainFamily: "QUANT" as const,
    sourceChapterId,
    sourceCapability,
    solveModeId: problem.solveMode,
    targetKind: problem.targetKind,
    contextId: problem.contextId,
    answerContractId: "DS_STANDARD_5" as const,
    taskDirection: "DATA_SUFFICIENCY" as const,
    answerSemantic: "SUFFICIENCY_CLASS" as const,
    stem,
    questionPrompt: prompt,
    statements: [
      { id: "I" as const, statementRuleId: pair.statementI.id, statementFamily: pair.statementI.family, text: pair.statementI.text },
      { id: "II" as const, statementRuleId: pair.statementII.id, statementFamily: pair.statementII.family, text: pair.statementII.text },
    ] as const,
    options: DS_STANDARD_5_EN.options.map(option => ({ key: option.key, value: option.text, semanticClass: option.semanticClass, isCorrect: option.semanticClass === evaluation.classification })),
    correctIndex: DS_STANDARD_5_EN.options.findIndex(option => option.semanticClass === evaluation.classification),
    canonicalAnswer: evaluation.classification,
    explanation: {
      askedTarget: `We need to determine ${prompt.charAt(0).toLowerCase()}${prompt.slice(1)}`,
      statementI: explanation("Statement I", evaluation.statementI.normalizedTargetAnswers, evaluation.statementI.sufficient),
      statementII: explanation("Statement II", evaluation.statementII.normalizedTargetAnswers, evaluation.statementII.sufficient),
      ...(together ? { together } : {}),
      conclusion: correct.text,
    },
    proof: {
      baseWorldCount: baseWorlds(problem).length,
      statementIWorldCount: evaluation.statementI.worldCount,
      statementIIWorldCount: evaluation.statementII.worldCount,
      togetherWorldCount: evaluation.together.worldCount,
      statementITargetAnswers: evaluation.statementI.normalizedTargetAnswers,
      statementIITargetAnswers: evaluation.statementII.normalizedTargetAnswers,
      togetherTargetAnswers: evaluation.together.normalizedTargetAnswers,
      minimalSufficientSets: evaluation.minimalSufficientSets,
      canonicalArithmeticOwnedByDsf: false as const,
    },
    sourceAncestry: [sourceChapterId, sourceCapability] as const,
    generationIdentity: createHash("sha256").update(`${DSF_CP011_MENSURATION_RUNTIME_VERSION}|${seed}|${problem.solveMode}|${problem.contextId}|${pair.statementI.id}|${pair.statementII.id}`).digest("hex").slice(0, 24),
    studentSurfaceFingerprint: `${normalizeDsfCp011MensurationSurface(stem)}|${problem.solveMode}|${pair.statementI.family}|${pair.statementII.family}`,
    lifecycle: {
      contentStatus: "CP011_EXPANSION_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}

export function generateDsfCp011MensurationBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp011MensurationQuestion);
}
