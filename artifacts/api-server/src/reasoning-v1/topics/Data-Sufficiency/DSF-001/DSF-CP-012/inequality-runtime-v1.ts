import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import {
  resolveInequalityRelation,
  type InequalityFact,
  type InequalityRelation,
} from "../../../../lib/reasoning/inequality-foundation.ts";

export const DSF_CP012_INEQUALITY_RUNTIME_VERSION = "DSF_CP012_INEQUALITY_RUNTIME_V1" as const;
export const DSF_CP012_INEQUALITY_SOLVE_MODES = [
  "DSF-SM-INEQ-A-VS-D",
  "DSF-SM-INEQ-A-VS-C",
  "DSF-SM-INEQ-B-VS-D",
] as const;

export type DsfCp012InequalitySolveMode = (typeof DSF_CP012_INEQUALITY_SOLVE_MODES)[number];
type Difficulty = "Easy" | "Medium" | "Hard";
type SymbolId = "A" | "B" | "C" | "D";
type ContextId = "SYMBOLIC_VALUES" | "SCORE_COMPARISON" | "WEIGHT_COMPARISON" | "HEIGHT_COMPARISON" | "PRICE_COMPARISON" | "RANK_VALUE_COMPARISON";
type StatementFamily =
  | "TARGET_EXACT"
  | "AB_EXACT"
  | "BC_EXACT"
  | "CD_EXACT"
  | "AC_EXACT"
  | "BD_EXACT"
  | "AD_EXACT"
  | "AB_BD_CHAIN"
  | "AC_CD_CHAIN"
  | "AB_BC_CHAIN"
  | "BC_CD_CHAIN"
  | "AB_NONLESS"
  | "BC_NONLESS"
  | "CD_NONLESS"
  | "A_D_EQUALITY_STATUS";

type InequalityWorld = Readonly<{
  A: number;
  B: number;
  C: number;
  D: number;
  facts: readonly InequalityFact[];
}>;

type InequalityProblem = Readonly<{
  solveMode: DsfCp012InequalitySolveMode;
  anchor: InequalityWorld;
  contextId: ContextId;
  intro: string;
}>;

type InequalityStatement = Readonly<{
  id: string;
  family: StatementFamily;
  complexity: 1 | 2 | 3;
  text: string;
  test: (world: InequalityWorld) => boolean;
}>;

type Pair = Readonly<{
  statementI: InequalityStatement;
  statementII: InequalityStatement;
  evaluation: TwoStatementSufficiencyEvaluation<string>;
  quality: number;
}>;

const SYMBOLS: readonly SymbolId[] = ["A", "B", "C", "D"];
const CONTEXTS = [
  { id: "SYMBOLIC_VALUES" as const, intros: ["Four symbolic quantities A, B, C and D have fixed but unknown relative values.", "Consider four quantities A, B, C and D whose mutual ordering is not fully known.", "A symbolic comparison among A, B, C and D is being analysed.", "The relative order of four symbolic quantities must be inferred."] },
  { id: "SCORE_COMPARISON" as const, intros: ["A, B, C and D denote four candidates' scores.", "Consider the scores represented by A, B, C and D.", "Four score values A, B, C and D are being compared.", "The relative score order among A, B, C and D must be inferred."] },
  { id: "WEIGHT_COMPARISON" as const, intros: ["A, B, C and D denote four object weights.", "Consider four weights labelled A, B, C and D.", "Four weight values A, B, C and D are being compared.", "The relative weight order among A, B, C and D must be inferred."] },
  { id: "HEIGHT_COMPARISON" as const, intros: ["A, B, C and D denote four heights.", "Consider four height values A, B, C and D.", "Four heights represented by A, B, C and D are being compared.", "The relative height order among A, B, C and D must be inferred."] },
  { id: "PRICE_COMPARISON" as const, intros: ["A, B, C and D denote four prices.", "Consider four price values A, B, C and D.", "Four prices represented by A, B, C and D are being compared.", "The relative price order among A, B, C and D must be inferred."] },
  { id: "RANK_VALUE_COMPARISON" as const, intros: ["A, B, C and D denote four comparable performance values.", "Consider four ordered performance values A, B, C and D.", "Four performance values are being compared symbolically.", "The relative order of four performance values must be inferred."] },
] as const;

function directRelation(world: InequalityWorld, left: SymbolId, right: SymbolId): InequalityRelation {
  const leftValue = world[left];
  const rightValue = world[right];
  return leftValue === rightValue ? "=" : leftValue > rightValue ? ">" : "<";
}

function factForValues(left: SymbolId, right: SymbolId, leftValue: number, rightValue: number): InequalityFact {
  if (leftValue === rightValue) return { left, relation: "=", right };
  return leftValue > rightValue
    ? { left, relation: ">", right }
    : { left: right, relation: ">", right: left };
}

function completeFacts(values: Readonly<Record<SymbolId, number>>): readonly InequalityFact[] {
  const facts: InequalityFact[] = [];
  for (let first = 0; first < SYMBOLS.length; first += 1) {
    for (let second = first + 1; second < SYMBOLS.length; second += 1) {
      const left = SYMBOLS[first]!;
      const right = SYMBOLS[second]!;
      facts.push(factForValues(left, right, values[left], values[right]));
    }
  }
  return facts;
}

function enumerateWorlds(): readonly InequalityWorld[] {
  const worlds: InequalityWorld[] = [];
  for (let A = 0; A <= 3; A += 1) {
    for (let B = 0; B <= 3; B += 1) {
      for (let C = 0; C <= 3; C += 1) {
        for (let D = 0; D <= 3; D += 1) {
          const values = { A, B, C, D } as const;
          worlds.push(Object.freeze({ ...values, facts: Object.freeze(completeFacts(values)) }));
        }
      }
    }
  }
  return Object.freeze(worlds);
}

const INEQUALITY_WORLDS = enumerateWorlds();

function queryPair(mode: DsfCp012InequalitySolveMode): readonly [SymbolId, SymbolId] {
  switch (mode) {
    case "DSF-SM-INEQ-A-VS-D": return ["A", "D"];
    case "DSF-SM-INEQ-A-VS-C": return ["A", "C"];
    case "DSF-SM-INEQ-B-VS-D": return ["B", "D"];
  }
}

function targetAnswer(mode: DsfCp012InequalitySolveMode, world: InequalityWorld): string {
  const [left, right] = queryPair(mode);
  return resolveInequalityRelation(SYMBOLS, world.facts, left, right);
}

const adapter = {
  adapterId: "DSF-CP012-INEQUALITY-SOURCE-BOUND-V1",
  domainFamily: "REASONING" as const,
  sourceChapterId: "REAS-INEQ",
  enumerateBaseWorlds: (_problem: InequalityProblem) => INEQUALITY_WORLDS,
  statementHolds: (_problem: InequalityProblem, world: InequalityWorld, statement: InequalityStatement) => statement.test(world),
  evaluateTarget: (problem: InequalityProblem, world: InequalityWorld) => targetAnswer(problem.solveMode, world),
  normalizeAnswer: (answer: string) => answer,
};

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  for (const character of `${DSF_CP012_INEQUALITY_RUNTIME_VERSION}:${seed}:${salt}`) {
    hash ^= character.charCodeAt(0);
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
  if (!values.length) throw new Error("CP012 Inequality cannot pick from an empty set");
  return values[Math.floor(random() * values.length)]!;
}

function modeForSeed(seed: number): DsfCp012InequalitySolveMode {
  return DSF_CP012_INEQUALITY_SOLVE_MODES[Math.abs(seed) % DSF_CP012_INEQUALITY_SOLVE_MODES.length]!;
}

function classForSeed(seed: number): SufficiencyClass {
  const block = Math.floor(Math.abs(seed) / DSF_CP012_INEQUALITY_SOLVE_MODES.length);
  return SUFFICIENCY_CLASSES[block % SUFFICIENCY_CLASSES.length]!;
}

function statement(id: string, family: StatementFamily, complexity: 1 | 2 | 3, text: string, test: (world: InequalityWorld) => boolean): InequalityStatement {
  return { id, family, complexity, text, test };
}

function relationText(left: SymbolId, relation: InequalityRelation, right: SymbolId): string {
  return `${left} ${relation} ${right}`;
}

function relationPredicate(left: SymbolId, relation: InequalityRelation, right: SymbolId) {
  return (world: InequalityWorld) => directRelation(world, left, right) === relation;
}

function nonLessPredicate(left: SymbolId, right: SymbolId) {
  return (world: InequalityWorld) => directRelation(world, left, right) !== "<";
}

function targetLabel(mode: DsfCp012InequalitySolveMode): string {
  const [left, right] = queryPair(mode);
  return `definite relation between ${left} and ${right}`;
}

function promptFor(mode: DsfCp012InequalitySolveMode): string {
  const [left, right] = queryPair(mode);
  return `What is the definite relation between ${left} and ${right}?`;
}

function buildStatementPool(problem: InequalityProblem): readonly InequalityStatement[] {
  const a = problem.anchor;
  const [queryLeft, queryRight] = queryPair(problem.solveMode);
  const target = targetAnswer(problem.solveMode, a) as InequalityRelation;
  const ab = directRelation(a, "A", "B");
  const bc = directRelation(a, "B", "C");
  const cd = directRelation(a, "C", "D");
  const ac = directRelation(a, "A", "C");
  const bd = directRelation(a, "B", "D");
  const ad = directRelation(a, "A", "D");

  return [
    statement(`TARGET_${target}`, "TARGET_EXACT", 1, `${relationText(queryLeft, target, queryRight)}.`, (w) => targetAnswer(problem.solveMode, w) === target),
    statement(`AB_${ab}`, "AB_EXACT", 1, `${relationText("A", ab, "B")}.`, relationPredicate("A", ab, "B")),
    statement(`BC_${bc}`, "BC_EXACT", 1, `${relationText("B", bc, "C")}.`, relationPredicate("B", bc, "C")),
    statement(`CD_${cd}`, "CD_EXACT", 1, `${relationText("C", cd, "D")}.`, relationPredicate("C", cd, "D")),
    statement(`AC_${ac}`, "AC_EXACT", 1, `${relationText("A", ac, "C")}.`, relationPredicate("A", ac, "C")),
    statement(`BD_${bd}`, "BD_EXACT", 1, `${relationText("B", bd, "D")}.`, relationPredicate("B", bd, "D")),
    statement(`AD_${ad}`, "AD_EXACT", 1, `${relationText("A", ad, "D")}.`, relationPredicate("A", ad, "D")),
    statement(`ABBD_${ab}_${bd}`, "AB_BD_CHAIN", 2, `${relationText("A", ab, "B")} and ${relationText("B", bd, "D")}.`, (w) => directRelation(w, "A", "B") === ab && directRelation(w, "B", "D") === bd),
    statement(`ACCD_${ac}_${cd}`, "AC_CD_CHAIN", 2, `${relationText("A", ac, "C")} and ${relationText("C", cd, "D")}.`, (w) => directRelation(w, "A", "C") === ac && directRelation(w, "C", "D") === cd),
    statement(`ABBC_${ab}_${bc}`, "AB_BC_CHAIN", 2, `${relationText("A", ab, "B")} and ${relationText("B", bc, "C")}.`, (w) => directRelation(w, "A", "B") === ab && directRelation(w, "B", "C") === bc),
    statement(`BCCD_${bc}_${cd}`, "BC_CD_CHAIN", 2, `${relationText("B", bc, "C")} and ${relationText("C", cd, "D")}.`, (w) => directRelation(w, "B", "C") === bc && directRelation(w, "C", "D") === cd),
    statement(`AB_NONLESS_${ab !== "<"}`, "AB_NONLESS", 2, `A is ${ab !== "<" ? "not less than" : "less than"} B.`, ab !== "<" ? nonLessPredicate("A", "B") : (w) => directRelation(w, "A", "B") === "<"),
    statement(`BC_NONLESS_${bc !== "<"}`, "BC_NONLESS", 2, `B is ${bc !== "<" ? "not less than" : "less than"} C.`, bc !== "<" ? nonLessPredicate("B", "C") : (w) => directRelation(w, "B", "C") === "<"),
    statement(`CD_NONLESS_${cd !== "<"}`, "CD_NONLESS", 2, `C is ${cd !== "<" ? "not less than" : "less than"} D.`, cd !== "<" ? nonLessPredicate("C", "D") : (w) => directRelation(w, "C", "D") === "<"),
    statement(`AD_EQ_${ad === "="}`, "A_D_EQUALITY_STATUS", 2, `A and D are ${ad === "=" ? "equal" : "not equal"}.`, (w) => (directRelation(w, "A", "D") === "=") === (ad === "=")),
  ];
}

function pairQuality(first: InequalityStatement, second: InequalityStatement, evaluation: TwoStatementSufficiencyEvaluation<string>): number {
  let score = first.family === second.family ? -8 : 6;
  if (evaluation.classification === "BOTH_TOGETHER_ONLY") score += 12;
  if (evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") score += 4;
  score += Math.min(8, Math.floor((evaluation.statementI.worldCount + evaluation.statementII.worldCount) / 64));
  score -= first.complexity + second.complexity;
  return score;
}

function synthesizePair(problem: InequalityProblem, seed: number, desiredClass: SufficiencyClass): Pair {
  const statements = buildStatementPool(problem);
  const candidates: Pair[] = [];
  for (const statementI of statements) {
    for (const statementII of statements) {
      if (statementI.id === statementII.id) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
        if (evaluation.classification !== desiredClass) continue;
        candidates.push({ statementI, statementII, evaluation, quality: pairQuality(statementI, statementII, evaluation) });
      } catch {
        // Reject inconsistent generated conjunctions.
      }
    }
  }
  if (!candidates.length) throw new Error(`No Inequality pair for ${problem.solveMode}/${desiredClass}`);
  const best = Math.max(...candidates.map((candidate) => candidate.quality));
  const shortlist = candidates.filter((candidate) => candidate.quality >= best - 2);
  return pick(createRng(seed, `pair:${problem.solveMode}:${desiredClass}`), shortlist);
}

function buildProblem(seed: number, attempt: number): InequalityProblem {
  const solveMode = modeForSeed(seed);
  const random = createRng(seed + attempt * 65537, `problem:${solveMode}`);
  const context = pick(random, CONTEXTS);
  return { solveMode, anchor: pick(random, INEQUALITY_WORLDS), contextId: context.id, intro: pick(random, context.intros) };
}

function difficultyFor(pair: Pair): Difficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  if (pair.statementI.complexity === 1 && pair.statementII.complexity === 1) return "Easy";
  return "Medium";
}

function explanationFor(label: string, answers: readonly string[], sufficient: boolean): string {
  if (sufficient) return `${label} fixes the requested relation at ${answers[0]}. Therefore it is sufficient alone.`;
  if (answers.length >= 2) return `${label} permits different relations, for example ${answers[0]} and ${answers[1]}. Therefore it is not sufficient alone.`;
  return `${label} does not fix one unique relation. Therefore it is not sufficient alone.`;
}

function normalizeSurface(text: string): string {
  return text.toLowerCase().replace(/[^a-z]+/g, " ").trim().replace(/\s+/g, " ");
}

export function normalizeDsfCp012InequalitySurface(text: string): string {
  return normalizeSurface(text);
}

export function generateDsfCp012InequalityQuestion(seed: number) {
  const desiredClass = classForSeed(seed);
  let problem: InequalityProblem | undefined;
  let pair: Pair | undefined;
  let lastError: unknown;

  for (let attempt = 0; attempt < 32; attempt += 1) {
    const candidate = buildProblem(seed, attempt);
    try {
      const candidatePair = synthesizePair(candidate, seed + attempt * 104729, desiredClass);
      problem = candidate;
      pair = candidatePair;
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (!problem || !pair) throw lastError instanceof Error ? lastError : new Error(`Unable to synthesize CP012 Inequality DS seed ${seed}`);

  const prompt = promptFor(problem.solveMode);
  const stem = `${problem.intro} Equal values are allowed. ${prompt}`;
  const evaluation = pair.evaluation;
  const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
  const together = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? evaluation.together.sufficient
      ? `Together, the statements fix the requested relation at ${evaluation.together.normalizedTargetAnswers[0]}. Therefore the combination is sufficient.`
      : `Even together, the statements permit different relations such as ${evaluation.together.normalizedTargetAnswers.slice(0, 2).join(" and ")}. Therefore the combination is insufficient.`
    : undefined;

  const generationIdentity = createHash("sha256")
    .update(`${DSF_CP012_INEQUALITY_RUNTIME_VERSION}|${seed}|${problem.solveMode}|${problem.contextId}|${pair.statementI.id}|${pair.statementII.id}`)
    .digest("hex")
    .slice(0, 24);

  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-012" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP012_INEQUALITY_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficultyFor(pair),
    domainFamily: "REASONING" as const,
    sourceChapterId: "REAS-INEQ" as const,
    sourceCapabilities: ["lib/reasoning/inequality-foundation::resolveInequalityRelation", "lib/reasoning/inequality::createInequalityScenario parity authority"] as const,
    solveModeId: problem.solveMode,
    targetKind: targetLabel(problem.solveMode),
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
      askedTarget: `We need to determine the ${targetLabel(problem.solveMode)}.`,
      statementI: explanationFor("Statement I", evaluation.statementI.normalizedTargetAnswers, evaluation.statementI.sufficient),
      statementII: explanationFor("Statement II", evaluation.statementII.normalizedTargetAnswers, evaluation.statementII.sufficient),
      ...(together ? { together } : {}),
      conclusion: correct.text,
    },
    proof: {
      baseWorldCount: INEQUALITY_WORLDS.length,
      statementIWorldCount: evaluation.statementI.worldCount,
      statementIIWorldCount: evaluation.statementII.worldCount,
      togetherWorldCount: evaluation.together.worldCount,
      statementITargetAnswers: evaluation.statementI.normalizedTargetAnswers,
      statementIITargetAnswers: evaluation.statementII.normalizedTargetAnswers,
      togetherTargetAnswers: evaluation.together.normalizedTargetAnswers,
      minimalSufficientSets: evaluation.minimalSufficientSets,
    },
    sourceAncestry: ["REAS-INEQ", "lib/reasoning/inequality", "inequality-foundation", "resolveInequalityRelation"] as const,
    generationIdentity,
    studentSurfaceFingerprint: `${normalizeSurface(stem)}|${problem.solveMode}|${pair.statementI.family}|${pair.statementII.family}`,
    lifecycle: {
      contentStatus: "CP012_REASONING_WAVE1_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}

export function generateDsfCp012InequalityBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp012InequalityQuestion);
}
