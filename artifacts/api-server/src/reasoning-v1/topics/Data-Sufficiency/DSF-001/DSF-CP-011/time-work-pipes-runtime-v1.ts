import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import { solveTmwCp001 } from "../../../../../quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/cp001-solver.ts";
import { solveTmwCp009 } from "../../../../../quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/cp009-solver.ts";
import { equals, rational, reciprocal, rationalKey } from "../../../../../quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/rational.ts";
import type { Rational, TmwCp001Parameters, TmwCp001RegistryEntry } from "../../../../../quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/types.ts";
import type { TmwCp009Parameters, TmwCp009RegistryEntry } from "../../../../../quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/cp009-types.ts";

export const DSF_CP011_TMW_RUNTIME_VERSION = "DSF_CP011_TMW_RUNTIME_V1" as const;
export const DSF_CP011_TMW_SOLVE_MODES = [
  "DSF-SM-TMW-COMPLETION-TIME",
  "DSF-SM-TMW-WORK-RATE",
  "DSF-SM-TMW-FRACTION-COMPLETED",
  "DSF-SM-PIPE-POSITIVE-FILL-TIME",
  "DSF-SM-PIPE-MIXED-FILL-TIME",
] as const;

export type DsfCp011TmwSolveMode = (typeof DSF_CP011_TMW_SOLVE_MODES)[number];
export type DsfCp011TmwDifficulty = "Easy" | "Medium" | "Hard";
export type DsfCp011TmwTargetKind = "COMPLETION_TIME" | "WORK_RATE" | "FRACTION_COMPLETED" | "PIPE_FILL_TIME";

type WorkContextId = "DOCUMENTS" | "PACKAGING" | "PAINTING" | "INSPECTION" | "LOADING" | "ASSEMBLY";
type PipeContextId = "WATER_TANK" | "RESERVOIR" | "STORAGE_TANK" | "PROCESS_TANK" | "SERVICE_TANK" | "COLLECTION_TANK";
type TmwContextId = WorkContextId | PipeContextId;

type StatementFamily =
  | "COMPLETION_TIME_EXACT"
  | "RATE_EXACT"
  | "OBSERVATION_TIME_EXACT"
  | "FRACTION_EXACT"
  | "TIME_OBSERVATION_PAIR"
  | "RATE_OBSERVATION_PAIR"
  | "WORK_PARAMETER_TRIPLE"
  | "COMPLETION_TIME_BOUND"
  | "OBSERVATION_TIME_BOUND"
  | "PIPE_A_TIME_EXACT"
  | "PIPE_B_TIME_EXACT"
  | "PIPE_FILL_TIME_EXACT"
  | "PIPE_PAIR"
  | "PIPE_A_BOUND"
  | "PIPE_B_BOUND";

interface WorkContext {
  readonly id: WorkContextId;
  readonly intro: readonly string[];
}

interface PipeContext {
  readonly id: PipeContextId;
  readonly tankLabel: string;
  readonly intro: readonly string[];
}

interface WorkWorld {
  readonly kind: "WORK";
  readonly completionTime: number;
  readonly observationTime: number;
  readonly rate: Rational;
  readonly fractionCompleted: Rational;
}

interface PipeWorld {
  readonly kind: "PIPE_POSITIVE" | "PIPE_MIXED";
  readonly pipeATime: number;
  readonly pipeBTime: number;
  readonly fillTime: Rational;
}

type TmwWorld = WorkWorld | PipeWorld;

interface TmwProblem {
  readonly anchor: TmwWorld;
  readonly solveMode: DsfCp011TmwSolveMode;
  readonly targetKind: DsfCp011TmwTargetKind;
  readonly contextId: TmwContextId;
  readonly intro: string;
}

interface TmwStatement {
  readonly id: string;
  readonly family: StatementFamily;
  readonly complexity: 1 | 2 | 3;
  readonly text: string;
  readonly test: (world: TmwWorld) => boolean;
}

interface SynthesizedTmwPair {
  readonly statementI: TmwStatement;
  readonly statementII: TmwStatement;
  readonly evaluation: TwoStatementSufficiencyEvaluation<string>;
  readonly qualityScore: number;
}

const WORK_CONTEXTS: readonly WorkContext[] = [
  { id: "DOCUMENTS", intro: ["A worker is processing a fixed batch of documents.", "Consider a fixed document-processing job assigned to one worker.", "One worker is completing a fixed documentation task.", "The progress of a fixed document job is being reviewed."] },
  { id: "PACKAGING", intro: ["A worker is packaging a fixed consignment.", "Consider one worker completing a fixed packaging job.", "A fixed packaging task is assigned to one worker.", "The progress of a packaging job is being checked."] },
  { id: "PAINTING", intro: ["A worker is painting a fixed area.", "Consider one worker completing a fixed painting job.", "A fixed painting task is assigned to one worker.", "The progress of a painting job is under review."] },
  { id: "INSPECTION", intro: ["An inspector is checking a fixed batch of items.", "Consider one inspector completing a fixed inspection job.", "A fixed inspection task is assigned to one worker.", "The progress of an inspection job is being reviewed."] },
  { id: "LOADING", intro: ["A worker is completing a fixed loading job.", "Consider one worker handling a fixed loading task.", "A fixed loading assignment is being completed by one worker.", "The progress of a loading job is being checked."] },
  { id: "ASSEMBLY", intro: ["A worker is assembling a fixed batch of units.", "Consider one worker completing a fixed assembly task.", "A fixed assembly job is assigned to one worker.", "The progress of an assembly job is being reviewed."] },
] as const;

const PIPE_CONTEXTS: readonly PipeContext[] = [
  { id: "WATER_TANK", tankLabel: "water tank", intro: ["Two pipes are connected to a water tank.", "Consider a water tank operated by two pipes.", "The filling arrangement of a water tank uses two pipes.", "Two pipes control the level of a water tank."] },
  { id: "RESERVOIR", tankLabel: "reservoir", intro: ["Two pipes are connected to a reservoir.", "Consider a reservoir operated by two pipes.", "The flow arrangement of a reservoir uses two pipes.", "Two pipes control the level of a reservoir."] },
  { id: "STORAGE_TANK", tankLabel: "storage tank", intro: ["Two pipes are connected to a storage tank.", "Consider a storage tank operated by two pipes.", "The filling arrangement of a storage tank uses two pipes.", "Two pipes control the level of a storage tank."] },
  { id: "PROCESS_TANK", tankLabel: "process tank", intro: ["Two pipes are connected to a process tank.", "Consider a process tank operated by two pipes.", "The flow arrangement of a process tank uses two pipes.", "Two pipes control the level of a process tank."] },
  { id: "SERVICE_TANK", tankLabel: "service tank", intro: ["Two pipes are connected to a service tank.", "Consider a service tank operated by two pipes.", "The filling arrangement of a service tank uses two pipes.", "Two pipes control the level of a service tank."] },
  { id: "COLLECTION_TANK", tankLabel: "collection tank", intro: ["Two pipes are connected to a collection tank.", "Consider a collection tank operated by two pipes.", "The flow arrangement of a collection tank uses two pipes.", "Two pipes control the level of a collection tank."] },
] as const;

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  const text = `${DSF_CP011_TMW_RUNTIME_VERSION}:${seed}:${salt}`;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
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

function workEntry(mode: "findCompletionTimeFromOneUnitWork" | "findRateFromWorkAndTime" | "findFractionCompletedInGivenTime"): TmwCp001RegistryEntry {
  return {
    qlId: `DSF-CP011-${mode}`,
    cpId: "TMW-CP-001",
    solveMode: mode,
    answerType: mode === "findCompletionTimeFromOneUnitWork" ? "TIME" : mode === "findRateFromWorkAndTime" ? "RATE" : "FRACTION",
    ruleId: "TMW_RATE_DIRECT",
    formulaStrategyId: "FORMULA_WORK_RATE_TIME",
    explanationStrategyId: "EXP_RATE_DIRECT",
    scenarioFamily: "production",
    difficulty: "Medium",
    publiclyPublishable: false,
  };
}

function workParameters(world: WorkWorld): TmwCp001Parameters {
  return {
    totalWork: rational(1),
    rate: world.rate,
    time: rational(world.observationTime),
    timeUnit: "day",
    context: { actor: "worker", peerActor: "worker", action: "completes", object: "job", jobPhrase: "fixed job", outputUnit: "items" },
  };
}

function pipeEntry(mode: "findFillTimeFromPositiveInlets" | "findFillTimeFromMixedPipes"): TmwCp009RegistryEntry {
  return {
    qlId: `DSF-CP011-${mode}`,
    cpId: "TMW-CP-009",
    solveMode: mode,
    answerType: "TIME",
    ruleId: mode === "findFillTimeFromPositiveInlets" ? "TMW_POSITIVE_FLOW" : "TMW_SIGNED_FLOW",
    difficulty: "Medium",
    publiclyPublishable: false,
  };
}

function pipeParameters(kind: PipeWorld["kind"], pipeATime: number, pipeBTime: number): TmwCp009Parameters {
  return {
    context: { setting: "tank", tankLabel: "tank", liquid: "water", timeUnit: "hour", capacityUnit: "litres" },
    pipes: [
      { label: "A", kind: "INLET", soloTime: rational(pipeATime) },
      { label: "B", kind: kind === "PIPE_POSITIVE" ? "INLET" : "OUTLET", soloTime: rational(pipeBTime) },
    ],
  };
}

function enumerateWorkWorlds(): readonly WorkWorld[] {
  const worlds: WorkWorld[] = [];
  const completionTimes = [4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24] as const;
  for (const completionTime of completionTimes) {
    for (let observationTime = 1; observationTime <= 6; observationTime += 1) {
      if (observationTime >= completionTime) continue;
      const rate = reciprocal(rational(completionTime));
      const probe: WorkWorld = { kind: "WORK", completionTime, observationTime, rate, fractionCompleted: rational(0) };
      const solution = solveTmwCp001(workEntry("findFractionCompletedInGivenTime"), workParameters(probe));
      worlds.push({ ...probe, fractionCompleted: solution.answer });
    }
  }
  return worlds;
}

function enumeratePositivePipeWorlds(): readonly PipeWorld[] {
  const worlds: PipeWorld[] = [];
  const aTimes = [4, 6, 8, 10, 12, 15] as const;
  const bTimes = [5, 6, 8, 10, 12, 15, 20] as const;
  for (const pipeATime of aTimes) {
    for (const pipeBTime of bTimes) {
      const parameters = pipeParameters("PIPE_POSITIVE", pipeATime, pipeBTime);
      const solution = solveTmwCp009(pipeEntry("findFillTimeFromPositiveInlets"), parameters);
      worlds.push({ kind: "PIPE_POSITIVE", pipeATime, pipeBTime, fillTime: solution.answerValues[0]! });
    }
  }
  return worlds;
}

function enumerateMixedPipeWorlds(): readonly PipeWorld[] {
  const worlds: PipeWorld[] = [];
  const inletTimes = [4, 5, 6, 8, 10, 12] as const;
  const outletTimes = [8, 10, 12, 15, 20, 24] as const;
  for (const pipeATime of inletTimes) {
    for (const pipeBTime of outletTimes) {
      if (pipeATime >= pipeBTime) continue;
      const parameters = pipeParameters("PIPE_MIXED", pipeATime, pipeBTime);
      const solution = solveTmwCp009(pipeEntry("findFillTimeFromMixedPipes"), parameters);
      worlds.push({ kind: "PIPE_MIXED", pipeATime, pipeBTime, fillTime: solution.answerValues[0]! });
    }
  }
  return worlds;
}

const WORK_WORLDS = enumerateWorkWorlds();
const POSITIVE_PIPE_WORLDS = enumeratePositivePipeWorlds();
const MIXED_PIPE_WORLDS = enumerateMixedPipeWorlds();
const SOURCE_ANSWER_CACHE = new Map<string, string>();

function rationalAnswer(value: Rational, unit: string): string {
  return `${rationalKey(value)} ${unit}`;
}

function sourceAnswer(problem: TmwProblem, world: TmwWorld): string {
  const cacheKey = world.kind === "WORK"
    ? `${problem.solveMode}|W|${world.completionTime}|${world.observationTime}`
    : `${problem.solveMode}|${world.kind}|${world.pipeATime}|${world.pipeBTime}`;
  const cached = SOURCE_ANSWER_CACHE.get(cacheKey);
  if (cached) return cached;
  let answer: string;
  switch (problem.solveMode) {
    case "DSF-SM-TMW-COMPLETION-TIME": {
      if (world.kind !== "WORK") throw new Error("Work mode received pipe world.");
      const solution = solveTmwCp001(workEntry("findCompletionTimeFromOneUnitWork"), workParameters(world));
      answer = rationalAnswer(solution.answer, "days");
      break;
    }
    case "DSF-SM-TMW-WORK-RATE": {
      if (world.kind !== "WORK") throw new Error("Work mode received pipe world.");
      const parameters = { ...workParameters(world), time: rational(world.completionTime) };
      const solution = solveTmwCp001(workEntry("findRateFromWorkAndTime"), parameters);
      answer = rationalAnswer(solution.answer, "job/day");
      break;
    }
    case "DSF-SM-TMW-FRACTION-COMPLETED": {
      if (world.kind !== "WORK") throw new Error("Work mode received pipe world.");
      const solution = solveTmwCp001(workEntry("findFractionCompletedInGivenTime"), workParameters(world));
      answer = rationalAnswer(solution.answer, "of-job");
      break;
    }
    case "DSF-SM-PIPE-POSITIVE-FILL-TIME": {
      if (world.kind !== "PIPE_POSITIVE") throw new Error("Positive pipe mode received incompatible world.");
      const solution = solveTmwCp009(pipeEntry("findFillTimeFromPositiveInlets"), pipeParameters(world.kind, world.pipeATime, world.pipeBTime));
      answer = rationalAnswer(solution.answerValues[0]!, "hours");
      break;
    }
    case "DSF-SM-PIPE-MIXED-FILL-TIME": {
      if (world.kind !== "PIPE_MIXED") throw new Error("Mixed pipe mode received incompatible world.");
      const solution = solveTmwCp009(pipeEntry("findFillTimeFromMixedPipes"), pipeParameters(world.kind, world.pipeATime, world.pipeBTime));
      answer = rationalAnswer(solution.answerValues[0]!, "hours");
      break;
    }
  }
  SOURCE_ANSWER_CACHE.set(cacheKey, answer);
  return answer;
}

function worldsFor(problem: TmwProblem): readonly TmwWorld[] {
  switch (problem.solveMode) {
    case "DSF-SM-TMW-COMPLETION-TIME":
    case "DSF-SM-TMW-WORK-RATE":
    case "DSF-SM-TMW-FRACTION-COMPLETED": return WORK_WORLDS;
    case "DSF-SM-PIPE-POSITIVE-FILL-TIME": return POSITIVE_PIPE_WORLDS;
    case "DSF-SM-PIPE-MIXED-FILL-TIME": return MIXED_PIPE_WORLDS;
  }
}

const adapter = {
  adapterId: "DSF-ADAPTER-TMW-001-CP011-V1",
  domainFamily: "QUANT" as const,
  sourceChapterId: "TMW-001",
  enumerateBaseWorlds(problem: TmwProblem): readonly TmwWorld[] { return worldsFor(problem); },
  statementHolds(_problem: TmwProblem, world: TmwWorld, statement: TmwStatement): boolean { return statement.test(world); },
  evaluateTarget(problem: TmwProblem, world: TmwWorld): string { return sourceAnswer(problem, world); },
  normalizeAnswer(answer: string): string { return answer; },
};

function buildProblem(seed: number, attempt = 0): TmwProblem {
  const solveMode = DSF_CP011_TMW_SOLVE_MODES[Math.abs(seed + attempt * 11) % DSF_CP011_TMW_SOLVE_MODES.length]!;
  const random = createRng(seed + attempt * 7919, `problem:${solveMode}`);
  if (solveMode === "DSF-SM-TMW-COMPLETION-TIME" || solveMode === "DSF-SM-TMW-WORK-RATE" || solveMode === "DSF-SM-TMW-FRACTION-COMPLETED") {
    const anchor = pick(random, WORK_WORLDS);
    const context = WORK_CONTEXTS[Math.abs(Math.floor(seed / DSF_CP011_TMW_SOLVE_MODES.length) + attempt) % WORK_CONTEXTS.length]!;
    const surface = Math.abs(Math.floor(seed / (DSF_CP011_TMW_SOLVE_MODES.length * WORK_CONTEXTS.length)) + attempt) % context.intro.length;
    const targetKind: DsfCp011TmwTargetKind = solveMode === "DSF-SM-TMW-COMPLETION-TIME" ? "COMPLETION_TIME" : solveMode === "DSF-SM-TMW-WORK-RATE" ? "WORK_RATE" : "FRACTION_COMPLETED";
    return { anchor, solveMode, targetKind, contextId: context.id, intro: context.intro[surface]! };
  }
  const worlds = solveMode === "DSF-SM-PIPE-POSITIVE-FILL-TIME" ? POSITIVE_PIPE_WORLDS : MIXED_PIPE_WORLDS;
  const anchor = pick(random, worlds);
  const context = PIPE_CONTEXTS[Math.abs(Math.floor(seed / DSF_CP011_TMW_SOLVE_MODES.length) + attempt) % PIPE_CONTEXTS.length]!;
  const surface = Math.abs(Math.floor(seed / (DSF_CP011_TMW_SOLVE_MODES.length * PIPE_CONTEXTS.length)) + attempt) % context.intro.length;
  return { anchor, solveMode, targetKind: "PIPE_FILL_TIME", contextId: context.id, intro: context.intro[surface]! };
}

function buildWorkStatementPool(anchor: WorkWorld): readonly TmwStatement[] {
  const lowCompletion = Math.max(2, anchor.completionTime - 4);
  const highCompletion = anchor.completionTime + 4;
  const lowObservation = Math.max(0, anchor.observationTime - 2);
  const highObservation = anchor.observationTime + 2;
  return [
    { id: `T_EQ_${anchor.completionTime}`, family: "COMPLETION_TIME_EXACT", complexity: 1, text: `Working alone at the same rate, the whole job takes ${anchor.completionTime} days.`, test: (w) => w.kind === "WORK" && w.completionTime === anchor.completionTime },
    { id: `R_EQ_${rationalKey(anchor.rate)}`, family: "RATE_EXACT", complexity: 1, text: `The worker completes ${rationalKey(anchor.rate)} of the job per day.`, test: (w) => w.kind === "WORK" && equals(w.rate, anchor.rate) },
    { id: `O_EQ_${anchor.observationTime}`, family: "OBSERVATION_TIME_EXACT", complexity: 1, text: `The observed work period is ${anchor.observationTime} ${anchor.observationTime === 1 ? "day" : "days"}.`, test: (w) => w.kind === "WORK" && w.observationTime === anchor.observationTime },
    { id: `F_EQ_${rationalKey(anchor.fractionCompleted)}`, family: "FRACTION_EXACT", complexity: 1, text: `During the observed period, ${rationalKey(anchor.fractionCompleted)} of the job is completed.`, test: (w) => w.kind === "WORK" && equals(w.fractionCompleted, anchor.fractionCompleted) },
    { id: `T_O_${anchor.completionTime}_${anchor.observationTime}`, family: "TIME_OBSERVATION_PAIR", complexity: 2, text: `The whole job takes ${anchor.completionTime} days at this rate, and the observed period is ${anchor.observationTime} ${anchor.observationTime === 1 ? "day" : "days"}.`, test: (w) => w.kind === "WORK" && w.completionTime === anchor.completionTime && w.observationTime === anchor.observationTime },
    { id: `R_O_${rationalKey(anchor.rate)}_${anchor.observationTime}`, family: "RATE_OBSERVATION_PAIR", complexity: 2, text: `The daily work rate is ${rationalKey(anchor.rate)} of the job, and the observed period is ${anchor.observationTime} ${anchor.observationTime === 1 ? "day" : "days"}.`, test: (w) => w.kind === "WORK" && equals(w.rate, anchor.rate) && w.observationTime === anchor.observationTime },
    { id: `FULL_${anchor.completionTime}_${anchor.observationTime}`, family: "WORK_PARAMETER_TRIPLE", complexity: 3, text: `The whole job takes ${anchor.completionTime} days, the daily rate is ${rationalKey(anchor.rate)} of the job, and the observed period is ${anchor.observationTime} ${anchor.observationTime === 1 ? "day" : "days"}.`, test: (w) => w.kind === "WORK" && w.completionTime === anchor.completionTime && equals(w.rate, anchor.rate) && w.observationTime === anchor.observationTime },
    { id: `T_GT_${lowCompletion}`, family: "COMPLETION_TIME_BOUND", complexity: 2, text: `The whole job takes more than ${lowCompletion} days.`, test: (w) => w.kind === "WORK" && w.completionTime > lowCompletion },
    { id: `T_LT_${highCompletion}`, family: "COMPLETION_TIME_BOUND", complexity: 2, text: `The whole job takes less than ${highCompletion} days.`, test: (w) => w.kind === "WORK" && w.completionTime < highCompletion },
    { id: `O_GT_${lowObservation}`, family: "OBSERVATION_TIME_BOUND", complexity: 2, text: `The observed period is more than ${lowObservation} days.`, test: (w) => w.kind === "WORK" && w.observationTime > lowObservation },
    { id: `O_LT_${highObservation}`, family: "OBSERVATION_TIME_BOUND", complexity: 2, text: `The observed period is less than ${highObservation} days.`, test: (w) => w.kind === "WORK" && w.observationTime < highObservation },
  ];
}

function buildPipeStatementPool(anchor: PipeWorld): readonly TmwStatement[] {
  const bRole = anchor.kind === "PIPE_POSITIVE" ? "inlet" : "outlet";
  const aLow = Math.max(2, anchor.pipeATime - 3);
  const aHigh = anchor.pipeATime + 3;
  const bLow = Math.max(3, anchor.pipeBTime - 4);
  const bHigh = anchor.pipeBTime + 4;
  return [
    { id: `A_EQ_${anchor.pipeATime}`, family: "PIPE_A_TIME_EXACT", complexity: 1, text: `Inlet A alone can fill the tank in ${anchor.pipeATime} hours.`, test: (w) => w.kind === anchor.kind && w.pipeATime === anchor.pipeATime },
    { id: `B_EQ_${anchor.pipeBTime}`, family: "PIPE_B_TIME_EXACT", complexity: 1, text: `Pipe B is an ${bRole} and alone would ${bRole === "inlet" ? "fill" : "empty"} the tank in ${anchor.pipeBTime} hours.`, test: (w) => w.kind === anchor.kind && w.pipeBTime === anchor.pipeBTime },
    { id: `FILL_EQ_${rationalKey(anchor.fillTime)}`, family: "PIPE_FILL_TIME_EXACT", complexity: 1, text: `With both pipes open, the tank fills in ${rationalKey(anchor.fillTime)} hours.`, test: (w) => w.kind === anchor.kind && equals(w.fillTime, anchor.fillTime) },
    { id: `PAIR_${anchor.pipeATime}_${anchor.pipeBTime}`, family: "PIPE_PAIR", complexity: 2, text: `Inlet A alone fills the tank in ${anchor.pipeATime} hours, while pipe B alone would ${bRole === "inlet" ? "fill" : "empty"} it in ${anchor.pipeBTime} hours.`, test: (w) => w.kind === anchor.kind && w.pipeATime === anchor.pipeATime && w.pipeBTime === anchor.pipeBTime },
    { id: `A_GT_${aLow}`, family: "PIPE_A_BOUND", complexity: 2, text: `Inlet A alone takes more than ${aLow} hours to fill the tank.`, test: (w) => w.kind === anchor.kind && w.pipeATime > aLow },
    { id: `A_LT_${aHigh}`, family: "PIPE_A_BOUND", complexity: 2, text: `Inlet A alone takes less than ${aHigh} hours to fill the tank.`, test: (w) => w.kind === anchor.kind && w.pipeATime < aHigh },
    { id: `B_GT_${bLow}`, family: "PIPE_B_BOUND", complexity: 2, text: `Pipe B alone takes more than ${bLow} hours to ${bRole === "inlet" ? "fill" : "empty"} the tank.`, test: (w) => w.kind === anchor.kind && w.pipeBTime > bLow },
    { id: `B_LT_${bHigh}`, family: "PIPE_B_BOUND", complexity: 2, text: `Pipe B alone takes less than ${bHigh} hours to ${bRole === "inlet" ? "fill" : "empty"} the tank.`, test: (w) => w.kind === anchor.kind && w.pipeBTime < bHigh },
  ];
}

function buildStatementPool(problem: TmwProblem): readonly TmwStatement[] {
  return problem.anchor.kind === "WORK" ? buildWorkStatementPool(problem.anchor) : buildPipeStatementPool(problem.anchor);
}

function survivors(problem: TmwProblem, statement: TmwStatement): readonly TmwWorld[] { return worldsFor(problem).filter(statement.test); }

function pairQuality(problem: TmwProblem, first: TmwStatement, second: TmwStatement, evaluation: TwoStatementSufficiencyEvaluation<string>): number {
  const familyBonus = first.family === second.family ? -5 : 6;
  const conjunctionBonus = evaluation.classification === "BOTH_TOGETHER_ONLY" ? 9 : 0;
  const insufficientBonus = evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER" ? 4 : 0;
  const breadth = Math.min(survivors(problem, first).length, 40) + Math.min(survivors(problem, second).length, 40);
  return familyBonus + conjunctionBonus + insufficientBonus + Math.floor(breadth / 16) - first.complexity - second.complexity;
}

function synthesizePair(problem: TmwProblem, seed: number, targetClass: SufficiencyClass): SynthesizedTmwPair {
  const statements = buildStatementPool(problem);
  const candidates: SynthesizedTmwPair[] = [];
  for (const statementI of statements) {
    for (const statementII of statements) {
      if (statementI.id === statementII.id) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
        if (evaluation.classification !== targetClass) continue;
        candidates.push({ statementI, statementII, evaluation, qualityScore: pairQuality(problem, statementI, statementII, evaluation) });
      } catch {
        // Empty conjunctions and invariant failures are generation rejects.
      }
    }
  }
  if (candidates.length === 0) throw new Error(`No TMW-001 pair for ${targetClass}/${problem.solveMode}`);
  const best = Math.max(...candidates.map((candidate) => candidate.qualityScore));
  const shortlist = candidates.filter((candidate) => candidate.qualityScore >= best - 3);
  return pick(createRng(seed, `pair:${targetClass}:${problem.solveMode}`), shortlist);
}

function targetPrompt(problem: TmwProblem): string {
  switch (problem.targetKind) {
    case "COMPLETION_TIME": return "How many days will the worker take to complete the whole job at the same rate?";
    case "WORK_RATE": return "What fraction of the whole job is completed per day?";
    case "FRACTION_COMPLETED": return "What fraction of the whole job is completed during the observed period?";
    case "PIPE_FILL_TIME": return "If both pipes are opened together, how long will the tank take to fill?";
  }
}

function explanationForStatement(label: string, targetAnswers: readonly string[], sufficient: boolean): string {
  if (sufficient) return `${label} fixes the asked value at ${targetAnswers[0]}. Therefore, ${label} alone is sufficient.`;
  const examples = targetAnswers.slice(0, 2);
  if (examples.length >= 2) return `${label} permits at least two different answers, ${examples[0]} and ${examples[1]}. Therefore, ${label} alone is not sufficient.`;
  return `${label} does not fix a unique answer. Therefore, ${label} alone is not sufficient.`;
}

function difficultyFor(pair: SynthesizedTmwPair): DsfCp011TmwDifficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  if (pair.evaluation.classification === "STATEMENT_I_ONLY" || pair.evaluation.classification === "STATEMENT_II_ONLY") return "Easy";
  return "Medium";
}

function generationIdentity(seed: number, problem: TmwProblem, pair: SynthesizedTmwPair): string {
  return createHash("sha256").update(`${DSF_CP011_TMW_RUNTIME_VERSION}|${seed}|${problem.solveMode}|${problem.contextId}|${pair.statementI.id}|${pair.statementII.id}`).digest("hex").slice(0, 24);
}

export function normalizeDsfCp011TmwSurface(text: string): string {
  return text.toLowerCase().replace(/\d+(?:\.\d+)?/g, "#").replace(/[^a-z#]+/g, " ").trim().replace(/\s+/g, " ");
}

function sourceSolver(problem: TmwProblem): "solveTmwCp001" | "solveTmwCp009" {
  return problem.anchor.kind === "WORK" ? "solveTmwCp001" : "solveTmwCp009";
}

export function generateDsfCp011TmwQuestion(seed: number) {
  const targetClass = desiredClass(seed);
  let problem: TmwProblem | undefined;
  let pair: SynthesizedTmwPair | undefined;
  let lastError: unknown;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const candidateProblem = buildProblem(seed, attempt);
    try {
      const candidatePair = synthesizePair(candidateProblem, seed + attempt * 104729, targetClass);
      problem = candidateProblem;
      pair = candidatePair;
      break;
    } catch (error) { lastError = error; }
  }
  if (!problem || !pair) throw lastError instanceof Error ? lastError : new Error(`Unable to synthesize TMW-001 DS question for seed ${seed}`);
  const evaluation = pair.evaluation;
  const prompt = targetPrompt(problem);
  const stem = `${problem.intro} ${prompt}`;
  const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
  const togetherExplanation = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? (evaluation.together.sufficient
      ? `Using both statements together fixes the asked value at ${evaluation.together.normalizedTargetAnswers[0]}. So the two statements together are sufficient.`
      : `Even together, the statements allow different answers such as ${evaluation.together.normalizedTargetAnswers.slice(0, 2).join(" and ")}. So they are still insufficient.`)
    : undefined;
  const solver = sourceSolver(problem);
  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-011" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP011_TMW_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficultyFor(pair),
    domainFamily: "QUANT" as const,
    sourceChapterId: "TMW-001" as const,
    sourceDomain: problem.anchor.kind === "WORK" ? "TIME_AND_WORK" as const : "PIPES_AND_CISTERNS" as const,
    sourceCapability: problem.anchor.kind === "WORK" ? "TMW-001/foundation/cp001-solver::solveTmwCp001" as const : "TMW-001/foundation/cp009-solver::solveTmwCp009" as const,
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
    options: DS_STANDARD_5_EN.options.map((option) => ({ key: option.key, value: option.text, semanticClass: option.semanticClass, isCorrect: option.semanticClass === evaluation.classification })),
    correctIndex: DS_STANDARD_5_EN.options.findIndex((option) => option.semanticClass === evaluation.classification),
    canonicalAnswer: evaluation.classification,
    explanation: {
      askedTarget: `We need to determine ${prompt.charAt(0).toLowerCase()}${prompt.slice(1)}`,
      statementI: explanationForStatement("Statement I", evaluation.statementI.normalizedTargetAnswers, evaluation.statementI.sufficient),
      statementII: explanationForStatement("Statement II", evaluation.statementII.normalizedTargetAnswers, evaluation.statementII.sufficient),
      ...(togetherExplanation ? { together: togetherExplanation } : {}),
      conclusion: correct.text,
    },
    proof: {
      baseWorldCount: worldsFor(problem).length,
      statementIWorldCount: evaluation.statementI.worldCount,
      statementIIWorldCount: evaluation.statementII.worldCount,
      togetherWorldCount: evaluation.together.worldCount,
      statementITargetAnswers: evaluation.statementI.normalizedTargetAnswers,
      statementIITargetAnswers: evaluation.statementII.normalizedTargetAnswers,
      togetherTargetAnswers: evaluation.together.normalizedTargetAnswers,
      minimalSufficientSets: evaluation.minimalSufficientSets,
      sourceSolver: solver,
      canonicalArithmeticOwnedByDsf: false as const,
    },
    sourceAncestry: problem.anchor.kind === "WORK"
      ? ["TMW-001", "TMW-001/foundation/cp001-solver::solveTmwCp001"] as const
      : ["TMW-001", "TMW-001/foundation/cp009-solver::solveTmwCp009"] as const,
    generationIdentity: generationIdentity(seed, problem, pair),
    studentSurfaceFingerprint: `${normalizeDsfCp011TmwSurface(stem)}|${problem.solveMode}|${pair.statementI.family}|${pair.statementII.family}`,
    lifecycle: {
      contentStatus: "CP011_EXPANSION_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}

export function generateDsfCp011TmwBatch(seeds: readonly number[]) { return seeds.map(generateDsfCp011TmwQuestion); }
