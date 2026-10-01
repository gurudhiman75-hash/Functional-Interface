import { createHash } from "node:crypto";

import { solveTmwCp001 } from "../../../../../quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/cp001-solver.ts";
import {
  equals,
  rational,
  rationalKey,
  reciprocal,
} from "../../../../../quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/rational.ts";
import type {
  Rational,
  TmwCp001Parameters,
  TmwCp001RegistryEntry,
} from "../../../../../quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/types.ts";
import {
  evaluateFiniteDomainTriple,
  type ThreeStatementSufficiencyEvaluation,
} from "../DSF-CP-015/three-statement-foundation.ts";
import {
  buildThreeStatementAnswerOptions,
  isKnownThreeStatementSemanticKey,
  renderThreeStatementSemanticLabel,
  type DsfCp015ThreeStatementSemanticKey,
} from "../DSF-CP-015/three-statement-answer-profile.ts";

export const DSF_CP020_TMW_QL002_RUNTIME_VERSION = "DSF_CP020_TMW_QL002_RUNTIME_V1" as const;

const COMPLETION_TIMES = [4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24] as const;
const CONTEXTS = [
  { id: "DOCUMENTS", actor: "worker", job: "a fixed batch of documents" },
  { id: "PACKAGING", actor: "worker", job: "a fixed packaging job" },
  { id: "PAINTING", actor: "worker", job: "a fixed painting job" },
  { id: "INSPECTION", actor: "inspector", job: "a fixed inspection job" },
  { id: "LOADING", actor: "worker", job: "a fixed loading job" },
  { id: "ASSEMBLY", actor: "worker", job: "a fixed assembly job" },
] as const;

type SolveMode =
  | "DSF-SM-TMW-COMPLETION-TIME"
  | "DSF-SM-TMW-WORK-RATE"
  | "DSF-SM-TMW-FRACTION-COMPLETED";

type WorkWorld = Readonly<{
  completionTime: number;
  observationTime: number;
  rate: Rational;
  fractionCompleted: Rational;
}>;

type Problem = Readonly<{
  solveMode: SolveMode;
  anchor: WorkWorld;
  context: (typeof CONTEXTS)[number];
}>;

type StatementFamily =
  | "COMPLETION_TIME_EXACT"
  | "RATE_EXACT"
  | "OBSERVATION_TIME_EXACT"
  | "FRACTION_EXACT"
  | "TIME_OBSERVATION_PAIR"
  | "RATE_OBSERVATION_PAIR"
  | "COMPLETION_TIME_BOUND"
  | "OBSERVATION_TIME_BOUND"
  | "COMPLETION_TIME_PARITY";

type Statement = Readonly<{
  id: string;
  family: StatementFamily;
  complexity: 1 | 2;
  text: string;
  test: (world: WorkWorld) => boolean;
}>;

type Triple = Readonly<{
  statementI: Statement;
  statementII: Statement;
  statementIII: Statement;
  evaluation: ThreeStatementSufficiencyEvaluation<string>;
  semanticKey: DsfCp015ThreeStatementSemanticKey;
  quality: number;
}>;

function stableHash(text: string): number {
  let hash = 2166136261;
  for (const character of text) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickIndex(seed: string, length: number): number {
  if (length <= 0) throw new Error("CP020 TMW cannot pick from an empty set.");
  return stableHash(seed) % length;
}

function workEntry(
  solveMode: "findCompletionTimeFromOneUnitWork" | "findRateFromWorkAndTime" | "findFractionCompletedInGivenTime",
): TmwCp001RegistryEntry {
  return {
    qlId: `DSF-CP020-${solveMode}`,
    cpId: "TMW-CP-001",
    solveMode,
    answerType: solveMode === "findCompletionTimeFromOneUnitWork"
      ? "TIME"
      : solveMode === "findRateFromWorkAndTime"
        ? "RATE"
        : "FRACTION",
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
    context: {
      actor: "worker",
      peerActor: "worker",
      action: "completes",
      object: "job",
      jobPhrase: "fixed job",
      outputUnit: "items",
    },
  };
}

function enumerateWorlds(): readonly WorkWorld[] {
  const worlds: WorkWorld[] = [];
  for (const completionTime of COMPLETION_TIMES) {
    for (let observationTime = 1; observationTime <= 6; observationTime += 1) {
      if (observationTime >= completionTime) continue;
      const rate = reciprocal(rational(completionTime));
      const probe: WorkWorld = {
        completionTime,
        observationTime,
        rate,
        fractionCompleted: rational(0),
      };
      const fraction = solveTmwCp001(
        workEntry("findFractionCompletedInGivenTime"),
        workParameters(probe),
      ).answer;
      worlds.push(Object.freeze({ ...probe, fractionCompleted: fraction }));
    }
  }
  return Object.freeze(worlds);
}

const WORLDS = enumerateWorlds();
const ANSWER_CACHE = new Map<string, string>();

function sourceAnswer(problem: Problem, world: WorkWorld): string {
  const key = `${problem.solveMode}|${world.completionTime}|${world.observationTime}`;
  const cached = ANSWER_CACHE.get(key);
  if (cached) return cached;

  let answer: Rational;
  let unit: string;
  if (problem.solveMode === "DSF-SM-TMW-COMPLETION-TIME") {
    answer = solveTmwCp001(
      workEntry("findCompletionTimeFromOneUnitWork"),
      workParameters(world),
    ).answer;
    unit = "days";
  } else if (problem.solveMode === "DSF-SM-TMW-WORK-RATE") {
    answer = solveTmwCp001(
      workEntry("findRateFromWorkAndTime"),
      { ...workParameters(world), time: rational(world.completionTime) },
    ).answer;
    unit = "job/day";
  } else {
    answer = solveTmwCp001(
      workEntry("findFractionCompletedInGivenTime"),
      workParameters(world),
    ).answer;
    unit = "of-job";
  }

  const normalized = `${rationalKey(answer)} ${unit}`;
  ANSWER_CACHE.set(key, normalized);
  return normalized;
}

const adapter = {
  adapterId: "DSF-CP020-TMW-001-THREE-STATEMENT-BATCH-V1",
  domainFamily: "QUANT" as const,
  sourceChapterId: "TMW-001",
  enumerateBaseWorlds: (_problem: Problem) => WORLDS,
  statementHolds: (_problem: Problem, world: WorkWorld, statement: Statement) => statement.test(world),
  evaluateTarget: (problem: Problem, world: WorkWorld) => sourceAnswer(problem, world),
  normalizeAnswer: (answer: string) => answer,
};

function st(
  id: string,
  family: StatementFamily,
  complexity: 1 | 2,
  text: string,
  test: (world: WorkWorld) => boolean,
): Statement {
  return Object.freeze({ id, family, complexity, text, test });
}

function statementPool(anchor: WorkWorld): readonly Statement[] {
  const lowCompletion = Math.max(2, anchor.completionTime - 4);
  const highCompletion = anchor.completionTime + 4;
  const lowObservation = Math.max(0, anchor.observationTime - 2);
  const highObservation = anchor.observationTime + 2;

  return Object.freeze([
    st(
      `T_EQ_${anchor.completionTime}`,
      "COMPLETION_TIME_EXACT",
      1,
      `Working alone at the same rate, the whole job takes ${anchor.completionTime} days.`,
      (world) => world.completionTime === anchor.completionTime,
    ),
    st(
      `R_EQ_${rationalKey(anchor.rate)}`,
      "RATE_EXACT",
      1,
      `The worker completes ${rationalKey(anchor.rate)} of the job per day.`,
      (world) => equals(world.rate, anchor.rate),
    ),
    st(
      `O_EQ_${anchor.observationTime}`,
      "OBSERVATION_TIME_EXACT",
      1,
      `The observed work period is ${anchor.observationTime} ${anchor.observationTime === 1 ? "day" : "days"}.`,
      (world) => world.observationTime === anchor.observationTime,
    ),
    st(
      `F_EQ_${rationalKey(anchor.fractionCompleted)}`,
      "FRACTION_EXACT",
      1,
      `During the observed period, ${rationalKey(anchor.fractionCompleted)} of the job is completed.`,
      (world) => equals(world.fractionCompleted, anchor.fractionCompleted),
    ),
    st(
      `T_O_${anchor.completionTime}_${anchor.observationTime}`,
      "TIME_OBSERVATION_PAIR",
      2,
      `The whole job takes ${anchor.completionTime} days and the observed period is ${anchor.observationTime} ${anchor.observationTime === 1 ? "day" : "days"}.`,
      (world) => world.completionTime === anchor.completionTime && world.observationTime === anchor.observationTime,
    ),
    st(
      `R_O_${rationalKey(anchor.rate)}_${anchor.observationTime}`,
      "RATE_OBSERVATION_PAIR",
      2,
      `The daily work rate is ${rationalKey(anchor.rate)} of the job and the observed period is ${anchor.observationTime} ${anchor.observationTime === 1 ? "day" : "days"}.`,
      (world) => equals(world.rate, anchor.rate) && world.observationTime === anchor.observationTime,
    ),
    st(
      `T_GT_${lowCompletion}`,
      "COMPLETION_TIME_BOUND",
      2,
      `The whole job takes more than ${lowCompletion} days.`,
      (world) => world.completionTime > lowCompletion,
    ),
    st(
      `T_LT_${highCompletion}`,
      "COMPLETION_TIME_BOUND",
      2,
      `The whole job takes less than ${highCompletion} days.`,
      (world) => world.completionTime < highCompletion,
    ),
    st(
      `O_GT_${lowObservation}`,
      "OBSERVATION_TIME_BOUND",
      2,
      `The observed period is more than ${lowObservation} days.`,
      (world) => world.observationTime > lowObservation,
    ),
    st(
      `O_LT_${highObservation}`,
      "OBSERVATION_TIME_BOUND",
      2,
      `The observed period is less than ${highObservation} days.`,
      (world) => world.observationTime < highObservation,
    ),
    st(
      `T_PARITY_${anchor.completionTime % 2}`,
      "COMPLETION_TIME_PARITY",
      2,
      `The number of days required for the whole job is ${anchor.completionTime % 2 === 0 ? "even" : "odd"}.`,
      (world) => world.completionTime % 2 === anchor.completionTime % 2,
    ),
  ]);
}

function problemFor(seed: string, attempt: number): Problem {
  const modes: readonly SolveMode[] = [
    "DSF-SM-TMW-COMPLETION-TIME",
    "DSF-SM-TMW-WORK-RATE",
    "DSF-SM-TMW-FRACTION-COMPLETED",
  ];
  const solveMode = modes[pickIndex(`${seed}:mode:${attempt}`, modes.length)]!;
  const anchor = WORLDS[pickIndex(`${seed}:world:${attempt}`, WORLDS.length)]!;
  const context = CONTEXTS[pickIndex(`${seed}:context:${attempt}`, CONTEXTS.length)]!;
  return Object.freeze({ solveMode, anchor, context });
}

const TRIPLE_CACHE = new Map<string, readonly Triple[]>();

function triplesFor(problem: Problem): readonly Triple[] {
  const key = `${problem.solveMode}|${problem.anchor.completionTime}|${problem.anchor.observationTime}`;
  const cached = TRIPLE_CACHE.get(key);
  if (cached) return cached;

  const pool = statementPool(problem.anchor);
  const triples: Triple[] = [];
  for (let i = 0; i < pool.length; i += 1) {
    for (let j = 0; j < pool.length; j += 1) {
      if (j === i) continue;
      for (let k = 0; k < pool.length; k += 1) {
        if (k === i || k === j) continue;
        const statementI = pool[i]!;
        const statementII = pool[j]!;
        const statementIII = pool[k]!;
        if (new Set([statementI.family, statementII.family, statementIII.family]).size < 2) continue;
        try {
          const evaluation = evaluateFiniteDomainTriple(
            adapter,
            problem,
            statementI,
            statementII,
            statementIII,
          );
          if (!isKnownThreeStatementSemanticKey(evaluation.semanticKey)) continue;
          const familyCount = new Set([statementI.family, statementII.family, statementIII.family]).size;
          const quality = familyCount * 10
            + evaluation.minimalSufficientSets.reduce((sum, set) => sum + set.length, 0)
            - statementI.complexity
            - statementII.complexity
            - statementIII.complexity;
          triples.push(Object.freeze({
            statementI,
            statementII,
            statementIII,
            evaluation,
            semanticKey: evaluation.semanticKey,
            quality,
          }));
        } catch {
          // Reject inconsistent or otherwise invalid triples.
        }
      }
    }
  }

  const result = Object.freeze(triples);
  if (!result.length) throw new Error(`CP020 TMW produced no valid triples for ${key}.`);
  TRIPLE_CACHE.set(key, result);
  return result;
}

function choose(seed: string): Readonly<{ problem: Problem; triple: Triple }> {
  let fallback: { problem: Problem; triples: readonly Triple[]; breadth: number } | undefined;

  for (let attempt = 0; attempt < 80; attempt += 1) {
    const problem = problemFor(seed, attempt);
    const triples = triplesFor(problem);
    const keys = [...new Set(triples.map((triple) => triple.semanticKey))].sort();
    if (!fallback || keys.length > fallback.breadth) fallback = { problem, triples, breadth: keys.length };
    if (keys.length < 4) continue;

    const desired = keys[pickIndex(`${seed}:semantic:${attempt}`, keys.length)]!;
    const matching = triples.filter((triple) => triple.semanticKey === desired);
    const best = Math.max(...matching.map((triple) => triple.quality));
    const shortlist = matching.filter((triple) => triple.quality >= best - 2);
    return Object.freeze({
      problem,
      triple: shortlist[pickIndex(`${seed}:triple:${attempt}`, shortlist.length)]!,
    });
  }

  if (!fallback) throw new Error("CP020 TMW could not synthesize a three-statement item.");
  const best = Math.max(...fallback.triples.map((triple) => triple.quality));
  const shortlist = fallback.triples.filter((triple) => triple.quality >= best - 2);
  return Object.freeze({
    problem: fallback.problem,
    triple: shortlist[pickIndex(`${seed}:fallback`, shortlist.length)]!,
  });
}

function prompt(problem: Problem): string {
  if (problem.solveMode === "DSF-SM-TMW-COMPLETION-TIME") {
    return "How many days will the worker take to complete the whole job at the same rate?";
  }
  if (problem.solveMode === "DSF-SM-TMW-WORK-RATE") {
    return "What fraction of the whole job is completed per day?";
  }
  return "What fraction of the whole job is completed during the observed period?";
}

function generationIdentity(seed: string, problem: Problem, triple: Triple): string {
  return createHash("sha256")
    .update(`${DSF_CP020_TMW_QL002_RUNTIME_VERSION}|${seed}|${problem.solveMode}|${problem.anchor.completionTime}|${problem.anchor.observationTime}|${triple.statementI.id}|${triple.statementII.id}|${triple.statementIII.id}`)
    .digest("hex")
    .slice(0, 24);
}

export function generateDsfCp020TimeWorkQuestion(seed: string | number) {
  const seedText = String(seed);
  const { problem, triple } = choose(seedText);
  const answerOptions = buildThreeStatementAnswerOptions(
    triple.semanticKey,
    stableHash(seedText),
  );
  const correctIndex = answerOptions.findIndex((option) => option.isCorrect);
  const questionPrompt = prompt(problem);

  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-020" as const,
    qlId: "DSF-QL-002" as const,
    runtimeVersion: DSF_CP020_TMW_QL002_RUNTIME_VERSION,
    language: "en" as const,
    locale: "en-IN" as const,
    sourceChapterId: "TMW-001" as const,
    sourceCapability: "TMW-001/foundation/cp001-solver" as const,
    solveModeId: problem.solveMode,
    contextId: problem.context.id,
    taskContract: "THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS" as const,
    answerSemantic: "MINIMAL_SUFFICIENT_STATEMENT_SUBSET" as const,
    statementCount: 3 as const,
    stem: `A ${problem.context.actor} is completing ${problem.context.job}. ${questionPrompt}`,
    questionPrompt,
    statements: Object.freeze([
      Object.freeze({ id: "I" as const, statementRuleId: triple.statementI.id, statementFamily: triple.statementI.family, text: triple.statementI.text }),
      Object.freeze({ id: "II" as const, statementRuleId: triple.statementII.id, statementFamily: triple.statementII.family, text: triple.statementII.text }),
      Object.freeze({ id: "III" as const, statementRuleId: triple.statementIII.id, statementFamily: triple.statementIII.family, text: triple.statementIII.text }),
    ] as const),
    options: answerOptions,
    correctIndex,
    canonicalAnswer: triple.semanticKey,
    semanticKey: triple.semanticKey,
    explanation: [
      `We need to determine: ${questionPrompt}`,
      `The seven non-empty statement subsets are evaluated against the same TMW-001 source-world set.`,
      `The minimal sufficient subset pattern is: ${renderThreeStatementSemanticLabel(triple.semanticKey)}`,
    ].join(" "),
    proof: Object.freeze({
      baseWorldCount: triple.evaluation.base.worldCount,
      subsetEvaluations: triple.evaluation.subsetEvaluations.map((entry) => Object.freeze({
        statementIds: entry.statementIds,
        worldCount: entry.result.worldCount,
        sufficient: entry.result.sufficient,
        normalizedTargetAnswers: entry.result.normalizedTargetAnswers,
      })),
      minimalSufficientSets: triple.evaluation.minimalSufficientSets,
      allThreeWorldCount: triple.evaluation.allThree.worldCount,
      allThreeSufficient: triple.evaluation.allThree.sufficient,
      semanticKey: triple.semanticKey,
    }),
    generationIdentity: generationIdentity(seedText, problem, triple),
    lifecycle: Object.freeze({
      contentStatus: "CP020_QL002_TIME_WORK_BATCH_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}

export function generateDsfCp020TimeWorkBatch(seed: string, count = 10) {
  const safeCount = Math.min(50, Math.max(1, Math.floor(count)));
  return Object.freeze(Array.from({ length: safeCount }, (_, index) =>
    generateDsfCp020TimeWorkQuestion(`${seed}:${index}`)
  ));
}
