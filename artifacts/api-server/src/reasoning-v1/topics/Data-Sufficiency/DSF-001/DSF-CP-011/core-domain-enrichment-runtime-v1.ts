import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import { solveRap001 } from "../../../../../quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/solver.ts";
import type { Rap001Parameters, Rap001TaskKind } from "../../../../../quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/types.ts";
import { solvePct001 } from "../../../../../quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/solver.ts";
import type { Pct001Parameters, Pct001TaskKind } from "../../../../../quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/types.ts";
import { leastMultipleAtOrAbove, positiveMod } from "../../../../../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/foundation/divisibility.ts";

export const DSF_CP011_CORE_ENRICHMENT_RUNTIME_VERSION = "DSF_CP011_CORE_ENRICHMENT_RUNTIME_V1" as const;
export const DSF_CP011_CORE_ENRICHMENT_SOLVE_MODES = [
  "DSF-SM-RAP-SCALING-BY-COMPONENT",
  "DSF-SM-RAP-DIRECT-VARIATION",
  "DSF-SM-RAP-INVERSE-VARIATION",
  "DSF-SM-RAP-FOURTH-PROPORTIONAL",
  "DSF-SM-PCT-PERCENT-OF",
  "DSF-SM-PCT-REVERSE-PERCENT",
  "DSF-SM-PCT-VALUE-AS-PERCENT",
  "DSF-SM-PCT-SUCCESSIVE-CHANGE",
  "DSF-SM-NUM-LEAST-MULTIPLE-AT-BOUND",
  "DSF-SM-NUM-REMAINDER",
] as const;

export type CoreEnrichmentSolveMode = (typeof DSF_CP011_CORE_ENRICHMENT_SOLVE_MODES)[number];
type Domain = "RATIO" | "PERCENTAGE" | "NUMBER_SYSTEM";
type Difficulty = "Easy" | "Medium" | "Hard";
type StatementFamily = "TARGET_EXACT" | "A_EXACT" | "B_EXACT" | "C_EXACT" | "AB_PAIR" | "BC_PAIR" | "FULL_DATA" | "A_BOUND" | "B_BOUND" | "A_PARITY" | "B_PARITY";

type World = Readonly<{
  a: number;
  b: number;
  c?: number;
}>;

type Problem = Readonly<{
  solveMode: CoreEnrichmentSolveMode;
  domain: Domain;
  anchor: World;
  contextId: string;
  intro: string;
}>;

type Statement = Readonly<{
  id: string;
  family: StatementFamily;
  complexity: 1 | 2 | 3;
  text: string;
  test: (world: World) => boolean;
}>;

type Pair = Readonly<{
  statementI: Statement;
  statementII: Statement;
  evaluation: TwoStatementSufficiencyEvaluation<string>;
}>;

const MODE_META: Record<CoreEnrichmentSolveMode, { domain: Domain; contextId: string; intros: readonly string[] }> = {
  "DSF-SM-RAP-SCALING-BY-COMPONENT": { domain: "RATIO", contextId: "RATIO_COMPONENT_SCALE", intros: ["Two comparable quantities are in a fixed ratio.", "A proportional pair of quantities is being examined.", "Consider two quantities related by a constant ratio.", "A ratio-based scaling situation is under review."] },
  "DSF-SM-RAP-DIRECT-VARIATION": { domain: "RATIO", contextId: "DIRECT_VARIATION", intros: ["Two quantities vary directly.", "Consider a direct-variation relationship between two quantities.", "A proportional output changes directly with an input.", "The values in a direct-variation model are being examined."] },
  "DSF-SM-RAP-INVERSE-VARIATION": { domain: "RATIO", contextId: "INVERSE_VARIATION", intros: ["Two quantities vary inversely.", "Consider an inverse-variation relationship between two quantities.", "One quantity changes inversely with another.", "The values in an inverse-variation model are being examined."] },
  "DSF-SM-RAP-FOURTH-PROPORTIONAL": { domain: "RATIO", contextId: "FOURTH_PROPORTIONAL", intros: ["Three quantities define a proportion with one missing fourth term.", "Consider a four-term proportion whose final term is unknown.", "A proportional equality is formed from three known quantities and one target.", "The fourth term of a proportion is being determined."] },
  "DSF-SM-PCT-PERCENT-OF": { domain: "PERCENTAGE", contextId: "PERCENT_OF_TOTAL", intros: ["A specified percentage of a total quantity is required.", "Consider a percentage applied to a known base quantity.", "A part of a total is defined by a percentage rate.", "A percentage-of-total calculation is being examined."] },
  "DSF-SM-PCT-REVERSE-PERCENT": { domain: "PERCENTAGE", contextId: "REVERSE_PERCENT", intros: ["A known part represents a stated percentage of an unknown total.", "Consider a reverse-percentage situation with an unknown base.", "A percentage amount is known but the original total is not.", "The original quantity behind a percentage amount is being determined."] },
  "DSF-SM-PCT-VALUE-AS-PERCENT": { domain: "PERCENTAGE", contextId: "VALUE_AS_PERCENT", intros: ["One value is to be expressed as a percentage of another.", "Consider the percentage comparison of a part with a base.", "A value is compared with a reference total in percentage terms.", "The percentage represented by one quantity relative to another is required."] },
  "DSF-SM-PCT-SUCCESSIVE-CHANGE": { domain: "PERCENTAGE", contextId: "SUCCESSIVE_CHANGE", intros: ["A quantity undergoes one percentage increase followed by one percentage decrease.", "Consider two successive percentage changes in opposite directions.", "An initial value is changed by an increase and then a decrease.", "The net effect of two successive percentage changes is being examined."] },
  "DSF-SM-NUM-LEAST-MULTIPLE-AT-BOUND": { domain: "NUMBER_SYSTEM", contextId: "LEAST_MULTIPLE_BOUND", intros: ["A lower bound and a divisor are specified for an integer.", "Consider the first multiple of a divisor at or above a stated bound.", "An integer must be the earliest divisible value beyond a lower limit.", "The least valid multiple in a bounded number-system condition is required."] },
  "DSF-SM-NUM-REMAINDER": { domain: "NUMBER_SYSTEM", contextId: "REMAINDER", intros: ["An integer is divided by a positive divisor.", "Consider the least non-negative remainder from an integer division.", "A number is reduced modulo a positive divisor.", "The remainder produced by a stated integer division is required."] },
};

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  for (const ch of `${DSF_CP011_CORE_ENRICHMENT_RUNTIME_VERSION}:${seed}:${salt}`) {
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function rng(seed: number, salt: string): () => number {
  let state = hashSeed(seed, salt) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}
function pick<T>(random: () => number, values: readonly T[]): T {
  if (!values.length) throw new Error("CP011 core enrichment cannot pick from an empty set.");
  return values[Math.floor(random() * values.length)]!;
}
function targetClass(seed: number): SufficiencyClass {
  const block = Math.floor(Math.abs(seed) / DSF_CP011_CORE_ENRICHMENT_SOLVE_MODES.length);
  return SUFFICIENCY_CLASSES[block % SUFFICIENCY_CLASSES.length]!;
}
function modeFor(seed: number): CoreEnrichmentSolveMode {
  return DSF_CP011_CORE_ENRICHMENT_SOLVE_MODES[Math.abs(seed) % DSF_CP011_CORE_ENRICHMENT_SOLVE_MODES.length]!;
}
function answerNumber(value: number): string {
  if (!Number.isFinite(value)) throw new Error(`Non-finite source answer ${value}`);
  const rounded = Math.round(value * 1e8) / 1e8;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function rapParameters(taskKind: Rap001TaskKind, variables: Record<string, string | number>): Rap001Parameters {
  return {
    archetypeId: "RAP-001",
    canonicalProblemId: "RAP-CP-001",
    questionId: "DSF-CP011-RAP-SOURCE-PROJECTION",
    questionLanguageId: "DSF-CP011",
    explanationId: "DSF-CP011",
    language: "en",
    difficultyBand: "Medium",
    taskKind,
    answerType: "ABSOLUTE",
    requiredVariables: Object.keys(variables),
    variables,
    sourceTrace: { questionLanguageSource: "DSF-CP011", explanationSource: "DSF-CP011", variableRangeSource: "DSF-CP011" },
  };
}
function pctParameters(taskKind: Pct001TaskKind, variables: Record<string, string | number>, answerType: Pct001Parameters["answerType"]): Pct001Parameters {
  return {
    archetypeId: "PCT-001",
    canonicalProblemId: "PCT-CP-001",
    questionId: "DSF-CP011-PCT-SOURCE-PROJECTION",
    questionLanguageId: "DSF-CP011",
    explanationId: "DSF-CP011",
    language: "en",
    difficultyBand: "Medium",
    taskKind,
    answerType,
    requiredVariables: Object.keys(variables),
    variables,
    sourceTrace: { questionLanguageSource: "DSF-CP011", explanationSource: "DSF-CP011", variableRangeSource: "DSF-CP011" },
  };
}

function sourceAnswer(mode: CoreEnrichmentSolveMode, world: World): string {
  switch (mode) {
    case "DSF-SM-RAP-SCALING-BY-COMPONENT": {
      const solved = solveRap001(rapParameters("scalingByComponent", { ratioA: world.a, ratioB: world.b, valueA: world.c! }));
      return answerNumber(Number(solved.answerValue));
    }
    case "DSF-SM-RAP-DIRECT-VARIATION": {
      const solved = solveRap001(rapParameters("directVariation", { varX1: world.a, varY1: world.b, varX2: world.c! }));
      return answerNumber(Number(solved.answerValue));
    }
    case "DSF-SM-RAP-INVERSE-VARIATION": {
      const solved = solveRap001(rapParameters("inverseVariation", { varX1: world.a, varY1: world.b, varX2: world.c! }));
      return answerNumber(Number(solved.answerValue));
    }
    case "DSF-SM-RAP-FOURTH-PROPORTIONAL": {
      const solved = solveRap001(rapParameters("fourthProportional", { numA: world.a, numB: world.b, numC: world.c! }));
      return answerNumber(Number(solved.answerValue));
    }
    case "DSF-SM-PCT-PERCENT-OF": {
      const solved = solvePct001(pctParameters("percentOf", { percentageRate: world.a, baseValue: world.b }, "ABSOLUTE"));
      return answerNumber(solved.numericAnswer!);
    }
    case "DSF-SM-PCT-REVERSE-PERCENT": {
      const solved = solvePct001(pctParameters("reversePercent", { percentageRate: world.a, value: world.b }, "ABSOLUTE"));
      return answerNumber(solved.numericAnswer!);
    }
    case "DSF-SM-PCT-VALUE-AS-PERCENT": {
      const solved = solvePct001(pctParameters("valueAsPercent", { value: world.a, baseValue: world.b }, "PERCENT"));
      return `${answerNumber(solved.numericAnswer!)}%`;
    }
    case "DSF-SM-PCT-SUCCESSIVE-CHANGE": {
      const solved = solvePct001(pctParameters("successiveChange", { rate1: world.a, rate2: world.b }, "PERCENT"));
      return `${answerNumber(solved.numericAnswer!)}%`;
    }
    case "DSF-SM-NUM-LEAST-MULTIPLE-AT-BOUND": return String(leastMultipleAtOrAbove(BigInt(world.a), BigInt(world.b)));
    case "DSF-SM-NUM-REMAINDER": return String(positiveMod(BigInt(world.a), BigInt(world.b)));
  }
}

function worldsFor(mode: CoreEnrichmentSolveMode): readonly World[] {
  const worlds: World[] = [];
  const push3 = (as: readonly number[], bs: readonly number[], cs: readonly number[]) => {
    for (const a of as) for (const b of bs) for (const c of cs) worlds.push({ a, b, c });
  };
  const push2 = (as: readonly number[], bs: readonly number[]) => {
    for (const a of as) for (const b of bs) worlds.push({ a, b });
  };
  switch (mode) {
    case "DSF-SM-RAP-SCALING-BY-COMPONENT": push3([2,3,4,5], [3,5,6,8], [20,30,40,60]); break;
    case "DSF-SM-RAP-DIRECT-VARIATION": push3([2,4,5,8], [6,10,12,15], [3,6,9,12]); break;
    case "DSF-SM-RAP-INVERSE-VARIATION": push3([2,4,5,8], [12,20,30,40], [3,5,6,10]); break;
    case "DSF-SM-RAP-FOURTH-PROPORTIONAL": push3([2,3,4,5], [6,8,10,12], [3,5,7,9]); break;
    case "DSF-SM-PCT-PERCENT-OF": push2([10,20,25,40,50], [80,100,120,160,200]); break;
    case "DSF-SM-PCT-REVERSE-PERCENT": push2([10,20,25,40,50], [20,25,40,50,80]); break;
    case "DSF-SM-PCT-VALUE-AS-PERCENT": push2([20,30,40,50,60], [80,100,120,150,200]); break;
    case "DSF-SM-PCT-SUCCESSIVE-CHANGE": push2([10,20,25,30,40], [10,20,25,30,40]); break;
    case "DSF-SM-NUM-LEAST-MULTIPLE-AT-BOUND": push2([100,120,150,200,250,300], [7,8,9,11,12,15]); break;
    case "DSF-SM-NUM-REMAINDER": push2([101,125,143,167,199,221], [5,7,8,9,11,12]); break;
  }
  return worlds;
}

const WORLD_CACHE = new Map<CoreEnrichmentSolveMode, readonly World[]>();
function baseWorlds(problem: Problem): readonly World[] {
  let worlds = WORLD_CACHE.get(problem.solveMode);
  if (!worlds) {
    worlds = worldsFor(problem.solveMode);
    WORLD_CACHE.set(problem.solveMode, worlds);
  }
  return worlds;
}
const adapter = {
  adapterId: "DSF-CP011-CORE-DOMAIN-ENRICHMENT-V1",
  domainFamily: "QUANT" as const,
  enumerateBaseWorlds: baseWorlds,
  statementHolds: (_problem: Problem, world: World, statement: Statement) => statement.test(world),
  evaluateTarget: (problem: Problem, world: World) => sourceAnswer(problem.solveMode, world),
  normalizeAnswer: (answer: string) => answer,
};

function statement(id: string, family: StatementFamily, complexity: 1|2|3, text: string, test: (world: World) => boolean): Statement {
  return { id, family, complexity, text, test };
}
function labels(mode: CoreEnrichmentSolveMode): { a: string; b: string; c?: string; target: string } {
  switch (mode) {
    case "DSF-SM-RAP-SCALING-BY-COMPONENT": return { a: "first ratio part", b: "second ratio part", c: "known first quantity", target: "corresponding second quantity" };
    case "DSF-SM-RAP-DIRECT-VARIATION": return { a: "first input", b: "first output", c: "second input", target: "second output" };
    case "DSF-SM-RAP-INVERSE-VARIATION": return { a: "first input", b: "first output", c: "second input", target: "second output" };
    case "DSF-SM-RAP-FOURTH-PROPORTIONAL": return { a: "first term", b: "second term", c: "third term", target: "fourth proportional" };
    case "DSF-SM-PCT-PERCENT-OF": return { a: "percentage rate", b: "base quantity", target: "percentage amount" };
    case "DSF-SM-PCT-REVERSE-PERCENT": return { a: "percentage rate", b: "known percentage amount", target: "original base quantity" };
    case "DSF-SM-PCT-VALUE-AS-PERCENT": return { a: "part value", b: "base value", target: "percentage represented" };
    case "DSF-SM-PCT-SUCCESSIVE-CHANGE": return { a: "increase rate", b: "decrease rate", target: "net percentage change" };
    case "DSF-SM-NUM-LEAST-MULTIPLE-AT-BOUND": return { a: "lower bound", b: "divisor", target: "least multiple at or above the bound" };
    case "DSF-SM-NUM-REMAINDER": return { a: "integer", b: "divisor", target: "least non-negative remainder" };
  }
}
function statementPool(problem: Problem): readonly Statement[] {
  const { a, b, c } = problem.anchor;
  const l = labels(problem.solveMode);
  const target = sourceAnswer(problem.solveMode, problem.anchor);
  const pool: Statement[] = [
    statement(`TARGET_${target}`, "TARGET_EXACT", 1, `The ${l.target} is ${target}.`, w => sourceAnswer(problem.solveMode, w) === target),
    statement(`A_${a}`, "A_EXACT", 1, `The ${l.a} is ${a}.`, w => w.a === a),
    statement(`B_${b}`, "B_EXACT", 1, `The ${l.b} is ${b}.`, w => w.b === b),
    statement(`AB_${a}_${b}`, "AB_PAIR", 2, `The ${l.a} is ${a} and the ${l.b} is ${b}.`, w => w.a === a && w.b === b),
    statement(`ALE_${a}`, "A_BOUND", 2, `The ${l.a} is at most ${a}.`, w => w.a <= a),
    statement(`AGE_${a}`, "A_BOUND", 2, `The ${l.a} is at least ${a}.`, w => w.a >= a),
    statement(`BLE_${b}`, "B_BOUND", 2, `The ${l.b} is at most ${b}.`, w => w.b <= b),
    statement(`BGE_${b}`, "B_BOUND", 2, `The ${l.b} is at least ${b}.`, w => w.b >= b),
    statement(`AP_${Math.abs(a)%2}`, "A_PARITY", 2, `The ${l.a} is ${Math.abs(a)%2===0?"even":"odd"}.`, w => Math.abs(w.a)%2 === Math.abs(a)%2),
    statement(`BP_${Math.abs(b)%2}`, "B_PARITY", 2, `The ${l.b} is ${Math.abs(b)%2===0?"even":"odd"}.`, w => Math.abs(w.b)%2 === Math.abs(b)%2),
  ];
  if (c !== undefined && l.c) {
    pool.push(
      statement(`C_${c}`, "C_EXACT", 1, `The ${l.c} is ${c}.`, w => w.c === c),
      statement(`BC_${b}_${c}`, "BC_PAIR", 2, `The ${l.b} is ${b} and the ${l.c} is ${c}.`, w => w.b === b && w.c === c),
      statement(`FULL_${a}_${b}_${c}`, "FULL_DATA", 3, `The ${l.a}, ${l.b} and ${l.c} are ${a}, ${b} and ${c} respectively.`, w => w.a === a && w.b === b && w.c === c),
    );
  } else {
    pool.push(statement(`FULL_${a}_${b}`, "FULL_DATA", 2, `The ${l.a} and ${l.b} are ${a} and ${b} respectively.`, w => w.a === a && w.b === b));
  }
  return pool;
}
function synthesize(problem: Problem, seed: number, desired: SufficiencyClass): Pair {
  const pool = statementPool(problem);
  const candidates: Pair[] = [];
  for (const statementI of pool) {
    for (const statementII of pool) {
      if (statementI.id === statementII.id) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
        if (evaluation.classification === desired) candidates.push({ statementI, statementII, evaluation });
      } catch {
        // Reject inconsistent conjunctions.
      }
    }
  }
  if (!candidates.length) throw new Error(`No core-enrichment pair for ${problem.solveMode}/${desired}`);
  const preferred = candidates.filter(p => p.statementI.family !== p.statementII.family);
  return pick(rng(seed, `pair:${problem.solveMode}:${desired}`), preferred.length ? preferred : candidates);
}
function buildProblem(seed: number, attempt: number): Problem {
  const solveMode = modeFor(seed);
  const meta = MODE_META[solveMode];
  const worlds = worldsFor(solveMode);
  const random = rng(seed + attempt * 65537, `problem:${solveMode}`);
  const index = Math.floor(Math.abs(seed) / DSF_CP011_CORE_ENRICHMENT_SOLVE_MODES.length);
  return { solveMode, domain: meta.domain, anchor: pick(random, worlds), contextId: meta.contextId, intro: meta.intros[index % meta.intros.length]! };
}
function prompt(problem: Problem): string {
  return `Can the ${labels(problem.solveMode).target} be determined?`;
}
function difficulty(pair: Pair): Difficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  if (pair.statementI.complexity === 1 && pair.statementII.complexity === 1) return "Easy";
  return "Medium";
}
function explain(label: string, answers: readonly string[], sufficient: boolean): string {
  if (sufficient) return `${label} fixes the required value at ${answers[0]}, so it is sufficient.`;
  return answers.length >= 2
    ? `${label} permits different values such as ${answers[0]} and ${answers[1]}, so it is not sufficient.`
    : `${label} does not fix a unique value, so it is not sufficient.`;
}
function sourceChapter(problem: Problem): "RAP-001"|"PCT-001"|"NUM-001" {
  return problem.domain === "RATIO" ? "RAP-001" : problem.domain === "PERCENTAGE" ? "PCT-001" : "NUM-001";
}
function sourceCapability(problem: Problem): string {
  return problem.domain === "RATIO"
    ? "RAP-001/solver::solveRap001"
    : problem.domain === "PERCENTAGE"
      ? "PCT-001/solver::solvePct001"
      : problem.solveMode === "DSF-SM-NUM-LEAST-MULTIPLE-AT-BOUND"
        ? "NUM-001/foundation/divisibility::leastMultipleAtOrAbove"
        : "NUM-001/foundation/divisibility::positiveMod";
}
export function normalizeDsfCp011CoreEnrichmentSurface(text: string): string {
  return text.toLowerCase().replace(/-?\d+(?:\.\d+)?%?/g, "#").replace(/[^a-z#]+/g, " ").trim().replace(/\s+/g, " ");
}

export function generateDsfCp011CoreEnrichmentQuestion(seed: number) {
  const desired = targetClass(seed);
  let problem: Problem | undefined;
  let pair: Pair | undefined;
  let lastError: unknown;
  for (let attempt = 0; attempt < 64; attempt += 1) {
    const candidate = buildProblem(seed, attempt);
    try {
      const result = synthesize(candidate, seed + attempt * 104729, desired);
      problem = candidate;
      pair = result;
      break;
    } catch (error) { lastError = error; }
  }
  if (!problem || !pair) throw lastError instanceof Error ? lastError : new Error(`Unable to synthesize core enrichment seed ${seed}`);
  const questionPrompt = prompt(problem);
  const stem = `${problem.intro} ${questionPrompt}`;
  const evaluation = pair.evaluation;
  const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
  const capability = sourceCapability(problem);
  const generationIdentity = createHash("sha256")
    .update(`${DSF_CP011_CORE_ENRICHMENT_RUNTIME_VERSION}|${seed}|${problem.solveMode}|${pair.statementI.id}|${pair.statementII.id}`)
    .digest("hex").slice(0, 24);
  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-011" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP011_CORE_ENRICHMENT_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficulty(pair),
    domainFamily: "QUANT" as const,
    sourceDomain: problem.domain,
    sourceChapterId: sourceChapter(problem),
    sourceCapability: capability,
    solveModeId: problem.solveMode,
    contextId: problem.contextId,
    answerContractId: "DS_STANDARD_5" as const,
    taskDirection: "DATA_SUFFICIENCY" as const,
    answerSemantic: "SUFFICIENCY_CLASS" as const,
    stem,
    questionPrompt,
    statements: [
      { id: "I" as const, statementRuleId: pair.statementI.id, statementFamily: pair.statementI.family, text: pair.statementI.text },
      { id: "II" as const, statementRuleId: pair.statementII.id, statementFamily: pair.statementII.family, text: pair.statementII.text },
    ] as const,
    options: DS_STANDARD_5_EN.options.map(option => ({ key: option.key, value: option.text, semanticClass: option.semanticClass, isCorrect: option.semanticClass === evaluation.classification })),
    correctIndex: DS_STANDARD_5_EN.options.findIndex(option => option.semanticClass === evaluation.classification),
    canonicalAnswer: evaluation.classification,
    explanation: {
      askedTarget: `We need to decide whether the ${labels(problem.solveMode).target} is fixed.`,
      statementI: explain("Statement I", evaluation.statementI.normalizedTargetAnswers, evaluation.statementI.sufficient),
      statementII: explain("Statement II", evaluation.statementII.normalizedTargetAnswers, evaluation.statementII.sufficient),
      together: !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
        ? (evaluation.together.sufficient
          ? `Together the statements fix the value at ${evaluation.together.normalizedTargetAnswers[0]}.`
          : `Even together they allow different values such as ${evaluation.together.normalizedTargetAnswers.slice(0,2).join(" and ")}.`)
        : undefined,
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
    },
    sourceAncestry: [sourceChapter(problem), capability] as const,
    generationIdentity,
    studentSurfaceFingerprint: `${normalizeDsfCp011CoreEnrichmentSurface(stem)}|${problem.solveMode}|${pair.statementI.family}|${pair.statementII.family}`,
    lifecycle: {
      contentStatus: "CP011_EXPANSION_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}
export function generateDsfCp011CoreEnrichmentBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp011CoreEnrichmentQuestion);
}
