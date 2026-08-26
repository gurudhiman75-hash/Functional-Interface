import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import { VectorPathState } from "../../../../../lib/reasoning/spatial-reasoning.ts";

export const DSF_CP012_DIRECTION_RUNTIME_VERSION = "DSF_CP012_DIRECTION_RUNTIME_V1" as const;
export const DSF_CP012_DIRECTION_SOLVE_MODES = [
  "DSF-SM-DIR-FINAL-FACING",
  "DSF-SM-DIR-FINAL-COORDINATES",
  "DSF-SM-DIR-SHORTEST-DISTANCE",
] as const;

export type DsfCp012DirectionSolveMode = (typeof DSF_CP012_DIRECTION_SOLVE_MODES)[number];
type Difficulty = "Easy" | "Medium" | "Hard";
type Facing = "North" | "East" | "South" | "West";
type Turn = "left" | "right";
type ContextId = "WALKING_ROUTE" | "DELIVERY_ROUTE" | "CAMPUS_PATH" | "PATROL_ROUTE" | "WAREHOUSE_ROUTE" | "FIELD_ROUTE";
type StatementFamily =
  | "TARGET_EXACT" | "START_FACING_EXACT" | "FIRST_TURN_EXACT" | "SECOND_TURN_EXACT" | "TURN_PAIR"
  | "FIRST_DISTANCE_EXACT" | "SECOND_DISTANCE_EXACT" | "THIRD_DISTANCE_EXACT" | "DISTANCE_PAIR"
  | "FINAL_X_EXACT" | "FINAL_Y_EXACT" | "FINAL_COMPONENT_PAIR" | "FINAL_FACING_EXACT"
  | "TOTAL_PATH_EXACT" | "FINAL_X_SIGN" | "FINAL_Y_SIGN";

type DirectionWorld = Readonly<{
  startFacing: Facing;
  firstDistance: number;
  firstTurn: Turn;
  secondDistance: number;
  secondTurn: Turn;
  thirdDistance: number;
  finalFacing: Facing;
  finalX: number;
  finalY: number;
  shortestDistance: number;
  totalPath: number;
}>;

type DirectionProblem = Readonly<{ solveMode: DsfCp012DirectionSolveMode; anchor: DirectionWorld; contextId: ContextId; intro: string }>;
type DirectionStatement = Readonly<{ id: string; family: StatementFamily; complexity: 1 | 2 | 3; text: string; test: (world: DirectionWorld) => boolean }>;
type Pair = Readonly<{ statementI: DirectionStatement; statementII: DirectionStatement; evaluation: TwoStatementSufficiencyEvaluation<string>; quality: number }>;

const CONTEXTS = [
  { id: "WALKING_ROUTE" as const, intros: ["A person follows a three-leg walking route.", "Consider a person moving along a three-part route.", "A three-leg walking path is being analysed.", "The final position after a sequence of three movements must be determined."] },
  { id: "DELIVERY_ROUTE" as const, intros: ["A delivery worker follows a three-leg route.", "Consider a delivery route with three successive movements.", "A delivery worker's three-part path is being analysed.", "The final state of a three-leg delivery route must be determined."] },
  { id: "CAMPUS_PATH" as const, intros: ["A student follows a three-leg path across a campus.", "Consider three successive movements along a campus path.", "A student's campus route is being analysed.", "The final position after a three-part campus walk must be determined."] },
  { id: "PATROL_ROUTE" as const, intros: ["A guard follows a three-leg patrol route.", "Consider a patrol path made of three successive movements.", "A three-part patrol route is being analysed.", "The final state of a guard's three-leg patrol must be determined."] },
  { id: "WAREHOUSE_ROUTE" as const, intros: ["A worker follows a three-leg route inside a warehouse.", "Consider three successive movements through a warehouse.", "A warehouse route with two turns is being analysed.", "The final position after a three-part warehouse route must be determined."] },
  { id: "FIELD_ROUTE" as const, intros: ["A surveyor follows a three-leg route across a field.", "Consider a survey path consisting of three movements.", "A surveyor's three-part field route is being analysed.", "The final state after a three-leg field route must be determined."] },
] as const;

const FACING_TO_DEGREES: Record<Facing, number> = { East: 0, North: 90, West: 180, South: 270 };
const DEGREES_TO_FACING: Record<number, Facing> = { 0: "East", 90: "North", 180: "West", 270: "South" };
const TURN_DEGREES: Record<Turn, number> = { left: 90, right: -90 };

function enumerateWorlds(): readonly DirectionWorld[] {
  const worlds: DirectionWorld[] = [];
  const facings = Object.keys(FACING_TO_DEGREES) as Facing[];
  const turns: Turn[] = ["left", "right"];
  const distances = [2, 3, 4] as const;
  for (const startFacing of facings) for (const firstDistance of distances) for (const firstTurn of turns)
    for (const secondDistance of distances) for (const secondTurn of turns) for (const thirdDistance of distances) {
      const path = new VectorPathState({ x: 0, y: 0 }, FACING_TO_DEGREES[startFacing]);
      path.move(firstDistance);
      path.turn(TURN_DEGREES[firstTurn]);
      path.move(secondDistance);
      path.turn(TURN_DEGREES[secondTurn]);
      path.move(thirdDistance);
      const finalDegrees = ((path.thetaDegrees % 360) + 360) % 360;
      const finalFacing = DEGREES_TO_FACING[finalDegrees];
      if (!finalFacing) throw new Error(`Direction source produced non-cardinal final angle ${finalDegrees}`);
      worlds.push(Object.freeze({
        startFacing, firstDistance, firstTurn, secondDistance, secondTurn, thirdDistance,
        finalFacing, finalX: path.position.x, finalY: path.position.y,
        shortestDistance: path.shortestDistance(), totalPath: firstDistance + secondDistance + thirdDistance,
      }));
    }
  return Object.freeze(worlds);
}

const DIRECTION_WORLDS = enumerateWorlds();

function targetAnswer(mode: DsfCp012DirectionSolveMode, world: DirectionWorld): string {
  switch (mode) {
    case "DSF-SM-DIR-FINAL-FACING": return world.finalFacing;
    case "DSF-SM-DIR-FINAL-COORDINATES": return `(${world.finalX},${world.finalY})`;
    case "DSF-SM-DIR-SHORTEST-DISTANCE": return `${world.shortestDistance} m`;
  }
}

const adapter = {
  adapterId: "DSF-CP012-DIRECTION-SOURCE-BOUND-V1",
  domainFamily: "REASONING" as const,
  sourceChapterId: "REAS-DIR",
  enumerateBaseWorlds: (_problem: DirectionProblem) => DIRECTION_WORLDS,
  statementHolds: (_problem: DirectionProblem, world: DirectionWorld, statement: DirectionStatement) => statement.test(world),
  evaluateTarget: (problem: DirectionProblem, world: DirectionWorld) => targetAnswer(problem.solveMode, world),
  normalizeAnswer: (answer: string) => answer,
};

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  for (const character of `${DSF_CP012_DIRECTION_RUNTIME_VERSION}:${seed}:${salt}`) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function createRng(seed: number, salt: string): () => number {
  let state = hashSeed(seed, salt) || 0x9e3779b9;
  return () => {
    state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}
function pick<T>(random: () => number, values: readonly T[]): T {
  if (!values.length) throw new Error("CP012 Direction cannot pick from an empty set");
  return values[Math.floor(random() * values.length)]!;
}
function modeForSeed(seed: number): DsfCp012DirectionSolveMode {
  return DSF_CP012_DIRECTION_SOLVE_MODES[Math.abs(seed) % DSF_CP012_DIRECTION_SOLVE_MODES.length]!;
}
function classForSeed(seed: number): SufficiencyClass {
  const block = Math.floor(Math.abs(seed) / DSF_CP012_DIRECTION_SOLVE_MODES.length);
  return SUFFICIENCY_CLASSES[block % SUFFICIENCY_CLASSES.length]!;
}
function statement(id: string, family: StatementFamily, complexity: 1 | 2 | 3, text: string, test: (world: DirectionWorld) => boolean): DirectionStatement {
  return { id, family, complexity, text, test };
}
function signLabel(value: number): "positive" | "negative" | "zero" { return value === 0 ? "zero" : value > 0 ? "positive" : "negative"; }
function targetLabel(mode: DsfCp012DirectionSolveMode): string {
  switch (mode) {
    case "DSF-SM-DIR-FINAL-FACING": return "final facing direction";
    case "DSF-SM-DIR-FINAL-COORDINATES": return "final coordinates from the starting point";
    case "DSF-SM-DIR-SHORTEST-DISTANCE": return "shortest distance from the starting point";
  }
}
function promptFor(mode: DsfCp012DirectionSolveMode): string {
  switch (mode) {
    case "DSF-SM-DIR-FINAL-FACING": return "Which direction is the person facing after the third movement?";
    case "DSF-SM-DIR-FINAL-COORDINATES": return "Taking the starting point as (0, 0), what are the final coordinates?";
    case "DSF-SM-DIR-SHORTEST-DISTANCE": return "What is the shortest distance from the final point to the starting point?";
  }
}

function buildStatementPool(problem: DirectionProblem): readonly DirectionStatement[] {
  const a = problem.anchor;
  const target = targetAnswer(problem.solveMode, a);
  return [
    statement(`TARGET_${target}`, "TARGET_EXACT", 1, `The ${targetLabel(problem.solveMode)} is ${target}.`, (w) => targetAnswer(problem.solveMode, w) === target),
    statement(`START_${a.startFacing}`, "START_FACING_EXACT", 1, `The person starts facing ${a.startFacing}.`, (w) => w.startFacing === a.startFacing),
    statement(`TURN1_${a.firstTurn}`, "FIRST_TURN_EXACT", 1, `After the first movement, the person turns ${a.firstTurn}.`, (w) => w.firstTurn === a.firstTurn),
    statement(`TURN2_${a.secondTurn}`, "SECOND_TURN_EXACT", 1, `After the second movement, the person turns ${a.secondTurn}.`, (w) => w.secondTurn === a.secondTurn),
    statement(`TURNS_${a.firstTurn}_${a.secondTurn}`, "TURN_PAIR", 2, `The two turns, in order, are ${a.firstTurn} and then ${a.secondTurn}.`, (w) => w.firstTurn === a.firstTurn && w.secondTurn === a.secondTurn),
    statement(`D1_${a.firstDistance}`, "FIRST_DISTANCE_EXACT", 1, `The first movement is ${a.firstDistance} m.`, (w) => w.firstDistance === a.firstDistance),
    statement(`D2_${a.secondDistance}`, "SECOND_DISTANCE_EXACT", 1, `The second movement is ${a.secondDistance} m.`, (w) => w.secondDistance === a.secondDistance),
    statement(`D3_${a.thirdDistance}`, "THIRD_DISTANCE_EXACT", 1, `The third movement is ${a.thirdDistance} m.`, (w) => w.thirdDistance === a.thirdDistance),
    statement(`D12_${a.firstDistance}_${a.secondDistance}`, "DISTANCE_PAIR", 2, `The first two movement lengths are ${a.firstDistance} m and ${a.secondDistance} m respectively.`, (w) => w.firstDistance === a.firstDistance && w.secondDistance === a.secondDistance),
    statement(`X_${a.finalX}`, "FINAL_X_EXACT", 2, `The net east-west displacement is ${Math.abs(a.finalX)} m ${a.finalX === 0 ? "with no east-west shift" : a.finalX > 0 ? "to the east" : "to the west"}.`, (w) => w.finalX === a.finalX),
    statement(`Y_${a.finalY}`, "FINAL_Y_EXACT", 2, `The net north-south displacement is ${Math.abs(a.finalY)} m ${a.finalY === 0 ? "with no north-south shift" : a.finalY > 0 ? "to the north" : "to the south"}.`, (w) => w.finalY === a.finalY),
    statement(`XY_${a.finalX}_${a.finalY}`, "FINAL_COMPONENT_PAIR", 3, `The net displacement components are ${a.finalX} m on the east-west axis and ${a.finalY} m on the north-south axis.`, (w) => w.finalX === a.finalX && w.finalY === a.finalY),
    statement(`FACING_${a.finalFacing}`, "FINAL_FACING_EXACT", 1, `After all movements, the person is facing ${a.finalFacing}.`, (w) => w.finalFacing === a.finalFacing),
    statement(`PATH_${a.totalPath}`, "TOTAL_PATH_EXACT", 2, `The total path length travelled is ${a.totalPath} m.`, (w) => w.totalPath === a.totalPath),
    statement(`XSIGN_${signLabel(a.finalX)}`, "FINAL_X_SIGN", 2, `The final east-west coordinate is ${signLabel(a.finalX)}.`, (w) => signLabel(w.finalX) === signLabel(a.finalX)),
    statement(`YSIGN_${signLabel(a.finalY)}`, "FINAL_Y_SIGN", 2, `The final north-south coordinate is ${signLabel(a.finalY)}.`, (w) => signLabel(w.finalY) === signLabel(a.finalY)),
  ];
}

function pairQuality(first: DirectionStatement, second: DirectionStatement, evaluation: TwoStatementSufficiencyEvaluation<string>): number {
  let score = first.family === second.family ? -8 : 6;
  if (evaluation.classification === "BOTH_TOGETHER_ONLY") score += 10;
  if (evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") score += 4;
  score += Math.min(8, Math.floor((evaluation.statementI.worldCount + evaluation.statementII.worldCount) / 100));
  return score - first.complexity - second.complexity;
}
function synthesizePair(problem: DirectionProblem, seed: number, desiredClass: SufficiencyClass): Pair {
  const candidates: Pair[] = [];
  for (const statementI of buildStatementPool(problem)) for (const statementII of buildStatementPool(problem)) {
    if (statementI.id === statementII.id) continue;
    try {
      const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
      if (evaluation.classification === desiredClass) candidates.push({ statementI, statementII, evaluation, quality: pairQuality(statementI, statementII, evaluation) });
    } catch { /* reject inconsistent conjunction */ }
  }
  if (!candidates.length) throw new Error(`No Direction statement pair for ${problem.solveMode}/${desiredClass}`);
  const best = Math.max(...candidates.map((candidate) => candidate.quality));
  return pick(createRng(seed, `pair:${problem.solveMode}:${desiredClass}`), candidates.filter((candidate) => candidate.quality >= best - 2));
}
function buildProblem(seed: number, attempt: number): DirectionProblem {
  const solveMode = modeForSeed(seed);
  const random = createRng(seed + attempt * 65537, `problem:${solveMode}`);
  const context = pick(random, CONTEXTS);
  return { solveMode, anchor: pick(random, DIRECTION_WORLDS), contextId: context.id, intro: pick(random, context.intros) };
}
function difficultyFor(pair: Pair): Difficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  return pair.statementI.complexity === 1 && pair.statementII.complexity === 1 ? "Easy" : "Medium";
}
function explanationFor(label: string, answers: readonly string[], sufficient: boolean): string {
  if (sufficient) return `${label} fixes the requested direction result at ${answers[0]}. Therefore it is sufficient alone.`;
  if (answers.length >= 2) return `${label} permits different requested results, for example ${answers[0]} and ${answers[1]}. Therefore it is not sufficient alone.`;
  return `${label} does not fix one unique requested direction result. Therefore it is not sufficient alone.`;
}
function normalizeSurface(text: string): string {
  return text.toLowerCase().replace(/-?\d+(?:\.\d+)?/g, "#").replace(/[^a-z#]+/g, " ").trim().replace(/\s+/g, " ");
}
export function normalizeDsfCp012DirectionSurface(text: string): string { return normalizeSurface(text); }

export function generateDsfCp012DirectionQuestion(seed: number) {
  const desiredClass = classForSeed(seed);
  let problem: DirectionProblem | undefined;
  let pair: Pair | undefined;
  let lastError: unknown;
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const candidate = buildProblem(seed, attempt);
    try {
      pair = synthesizePair(candidate, seed + attempt * 104729, desiredClass);
      problem = candidate;
      break;
    } catch (error) { lastError = error; }
  }
  if (!problem || !pair) throw lastError instanceof Error ? lastError : new Error(`Unable to synthesize CP012 Direction DS seed ${seed}`);
  const prompt = promptFor(problem.solveMode);
  const stem = `${problem.intro} The route contains three movements, with one turn after the first movement and one turn after the second. ${prompt}`;
  const evaluation = pair.evaluation;
  const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
  const together = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? evaluation.together.sufficient
      ? `Together, the two statements fix the requested result at ${evaluation.together.normalizedTargetAnswers[0]}. Therefore the combination is sufficient.`
      : `Even together, the statements permit different requested results such as ${evaluation.together.normalizedTargetAnswers.slice(0, 2).join(" and ")}. Therefore the combination is insufficient.`
    : undefined;
  const generationIdentity = createHash("sha256")
    .update(`${DSF_CP012_DIRECTION_RUNTIME_VERSION}|${seed}|${problem.solveMode}|${problem.contextId}|${pair.statementI.id}|${pair.statementII.id}`)
    .digest("hex").slice(0, 24);
  return Object.freeze({
    packageId: "DSF-001" as const, checkpointId: "DSF-CP-012" as const, qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP012_DIRECTION_RUNTIME_VERSION, seed, locale: "en-IN" as const, difficulty: difficultyFor(pair),
    domainFamily: "REASONING" as const, sourceChapterId: "REAS-DIR" as const,
    sourceCapabilities: ["lib/reasoning/spatial-reasoning::VectorPathState"] as const,
    solveModeId: problem.solveMode, targetKind: targetLabel(problem.solveMode), contextId: problem.contextId,
    answerContractId: "DS_STANDARD_5" as const, taskDirection: "DATA_SUFFICIENCY" as const, answerSemantic: "SUFFICIENCY_CLASS" as const,
    stem, questionPrompt: prompt,
    statements: [
      { id: "I" as const, statementRuleId: pair.statementI.id, statementFamily: pair.statementI.family, text: pair.statementI.text },
      { id: "II" as const, statementRuleId: pair.statementII.id, statementFamily: pair.statementII.family, text: pair.statementII.text },
    ] as const,
    options: DS_STANDARD_5_EN.options.map((option) => ({ key: option.key, value: option.text, semanticClass: option.semanticClass, isCorrect: option.semanticClass === evaluation.classification })),
    correctIndex: DS_STANDARD_5_EN.options.findIndex((option) => option.semanticClass === evaluation.classification), canonicalAnswer: evaluation.classification,
    explanation: {
      askedTarget: `We need to determine the ${targetLabel(problem.solveMode)}.`,
      statementI: explanationFor("Statement I", evaluation.statementI.normalizedTargetAnswers, evaluation.statementI.sufficient),
      statementII: explanationFor("Statement II", evaluation.statementII.normalizedTargetAnswers, evaluation.statementII.sufficient),
      ...(together ? { together } : {}), conclusion: correct.text,
    },
    proof: {
      baseWorldCount: DIRECTION_WORLDS.length, statementIWorldCount: evaluation.statementI.worldCount,
      statementIIWorldCount: evaluation.statementII.worldCount, togetherWorldCount: evaluation.together.worldCount,
      statementITargetAnswers: evaluation.statementI.normalizedTargetAnswers, statementIITargetAnswers: evaluation.statementII.normalizedTargetAnswers,
      togetherTargetAnswers: evaluation.together.normalizedTargetAnswers, minimalSufficientSets: evaluation.minimalSufficientSets,
    },
    sourceAncestry: ["REAS-DIR", "lib/reasoning/direction-sense", "VectorPathState"] as const,
    generationIdentity, studentSurfaceFingerprint: `${normalizeSurface(stem)}|${problem.solveMode}|${pair.statementI.family}|${pair.statementII.family}`,
    lifecycle: { contentStatus: "CP012_REASONING_WAVE1_REVIEW_CANDIDATE" as const, questionStudioDiscoverable: false as const, questionBankWritable: false as const, testEligible: false as const, publiclyPublishable: false as const },
  });
}

export function generateDsfCp012DirectionBatch(seeds: readonly number[]) { return seeds.map(generateDsfCp012DirectionQuestion); }
