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
  formatRational,
  rational,
  solveLinearEquation,
  solveLinearSystem2V,
  type Rational,
} from "../../../../../quant-v4/shared/algebra/index.ts";
import { ALG_ENGLISH_V3_FREEZE_APPROVAL } from "../../../../../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/permanent/english-freeze-v3.ts";

export const DSF_CP011_ALGEBRA_ENRICHMENT_RUNTIME_VERSION = "DSF_CP011_ALGEBRA_ENRICHMENT_RUNTIME_V1" as const;
export const DSF_CP011_ALGEBRA_ENRICHMENT_SOLVE_MODES = [
  "DSF-SM-ALG-LINEAR-EQUATION-X",
  "DSF-SM-ALG-2X2-SYSTEM-X",
] as const;
export type AlgebraEnrichmentSolveMode = (typeof DSF_CP011_ALGEBRA_ENRICHMENT_SOLVE_MODES)[number];
type Difficulty = "Easy" | "Medium" | "Hard";
type StatementFamily = "TARGET_EXACT" | "COEFFICIENT_EXACT" | "LEFT_CONSTANT_EXACT" | "RIGHT_CONSTANT_EXACT" | "COEFF_LEFT_PAIR" | "FULL_EQUATION" | "FIRST_EQUATION" | "SECOND_EQUATION" | "Y_EXACT" | "FULL_SYSTEM" | "BOUND" | "PARITY";

type LinearWorld = Readonly<{ kind: "LINEAR"; coefficient: number; leftConstant: number; solutionX: number; rightConstant: number }>;
type SystemWorld = Readonly<{ kind: "SYSTEM"; x: number; y: number; sum: number; transformed: number }>;
type World = LinearWorld | SystemWorld;
type Problem = Readonly<{ solveMode: AlgebraEnrichmentSolveMode; anchor: World; contextId: "LINEAR_EQUATION" | "SIMULTANEOUS_EQUATIONS"; intro: string }>;
type Statement = Readonly<{ id: string; family: StatementFamily; complexity: 1|2|3; text: string; test: (world: World) => boolean }>;
type Pair = Readonly<{ statementI: Statement; statementII: Statement; evaluation: TwoStatementSufficiencyEvaluation<string> }>;

if (!ALG_ENGLISH_V3_FREEZE_APPROVAL.solverAuthorityFrozen || !ALG_ENGLISH_V3_FREEZE_APPROVAL.semanticContractFrozen) {
  throw new Error("CP011 Algebra enrichment requires the frozen Algebra V3 solver/semantic authority.");
}

const LINEAR_INTROS = [
  "A one-variable linear equation has a unique solution.",
  "Consider a linear equation in one unknown.",
  "A first-degree equation in x is being examined.",
  "The value of x in a linear equation is to be determined.",
] as const;
const SYSTEM_INTROS = [
  "Two linear equations in x and y have a unique common solution.",
  "Consider a pair of simultaneous linear equations.",
  "A two-variable linear system has one ordered-pair solution.",
  "The x-coordinate of a unique 2×2 linear system solution is required.",
] as const;

function hashSeed(seed: number, salt: string) {
  let h = 2166136261;
  for (const ch of `${DSF_CP011_ALGEBRA_ENRICHMENT_RUNTIME_VERSION}:${seed}:${salt}`) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed: number, salt: string): () => number {
  let state = hashSeed(seed, salt) || 0x9e3779b9;
  return () => {
    state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}
function pick<T>(random: () => number, values: readonly T[]): T {
  if (!values.length) throw new Error("Algebra enrichment cannot pick from an empty world set.");
  return values[Math.floor(random() * values.length)]!;
}
function eqRational(a: Rational, b: Rational) { return a.numerator === b.numerator && a.denominator === b.denominator; }
function answer(value: Rational) { return formatRational(value); }

function linearWorlds(): readonly LinearWorld[] {
  const worlds: LinearWorld[] = [];
  for (const coefficient of [2,3,4,5,6] as const) {
    for (const leftConstant of [1,4,7,10] as const) {
      for (const solutionX of [2,3,5,7,9] as const) {
        worlds.push({ kind: "LINEAR", coefficient, leftConstant, solutionX, rightConstant: coefficient * solutionX + leftConstant });
      }
    }
  }
  return worlds;
}
function systemWorlds(): readonly SystemWorld[] {
  const worlds: SystemWorld[] = [];
  for (const x of [2,4,6,8,10] as const) {
    for (const y of [1,3,5,7,9] as const) worlds.push({ kind: "SYSTEM", x, y, sum: x + y, transformed: 2 * x - y });
  }
  return worlds;
}
const LINEAR_WORLDS = linearWorlds();
const SYSTEM_WORLDS = systemWorlds();

function sourceAnswer(problem: Problem, world: World): string {
  if (problem.solveMode === "DSF-SM-ALG-LINEAR-EQUATION-X") {
    if (world.kind !== "LINEAR") throw new Error("Linear Algebra mode received incompatible world.");
    const solved = solveLinearEquation({
      leftCoefficient: rational(world.coefficient),
      leftConstant: rational(world.leftConstant),
      rightCoefficient: rational(0),
      rightConstant: rational(world.rightConstant),
    });
    if (solved.kind !== "UNIQUE") throw new Error("Constructed Algebra linear equation lost uniqueness.");
    return answer(solved.value);
  }
  if (world.kind !== "SYSTEM") throw new Error("2x2 Algebra mode received incompatible world.");
  const solved = solveLinearSystem2V({
    a1: rational(1), b1: rational(1), c1: rational(world.sum),
    a2: rational(2), b2: rational(-1), c2: rational(world.transformed),
  });
  if (solved.kind !== "UNIQUE") throw new Error("Constructed Algebra 2x2 system lost uniqueness.");
  if (!eqRational(solved.x, rational(world.x))) throw new Error("Frozen Algebra source solver disagrees with constructed system state.");
  return answer(solved.x);
}
function baseWorlds(problem: Problem): readonly World[] {
  return problem.solveMode === "DSF-SM-ALG-LINEAR-EQUATION-X" ? LINEAR_WORLDS : SYSTEM_WORLDS;
}
const adapter = {
  adapterId: "DSF-CP011-ALGEBRA-FROZEN-SOURCE-BOUND-V1",
  domainFamily: "QUANT" as const,
  enumerateBaseWorlds: baseWorlds,
  statementHolds: (_problem: Problem, world: World, statement: Statement) => statement.test(world),
  evaluateTarget: sourceAnswer,
  normalizeAnswer: (value: string) => value,
};
function st(id: string, family: StatementFamily, complexity: 1|2|3, text: string, test: (world: World) => boolean): Statement {
  return { id, family, complexity, text, test };
}
function statementPool(problem: Problem): readonly Statement[] {
  const target = sourceAnswer(problem, problem.anchor);
  if (problem.anchor.kind === "LINEAR") {
    const w = problem.anchor;
    return [
      st(`X_${target}`, "TARGET_EXACT", 1, `The solution is x = ${target}.`, x => x.kind === "LINEAR" && sourceAnswer(problem, x) === target),
      st(`A_${w.coefficient}`, "COEFFICIENT_EXACT", 1, `The coefficient of x on the left is ${w.coefficient}.`, x => x.kind === "LINEAR" && x.coefficient === w.coefficient),
      st(`B_${w.leftConstant}`, "LEFT_CONSTANT_EXACT", 1, `The constant on the left is ${w.leftConstant}.`, x => x.kind === "LINEAR" && x.leftConstant === w.leftConstant),
      st(`C_${w.rightConstant}`, "RIGHT_CONSTANT_EXACT", 1, `The right-hand side is ${w.rightConstant}.`, x => x.kind === "LINEAR" && x.rightConstant === w.rightConstant),
      st(`AB_${w.coefficient}_${w.leftConstant}`, "COEFF_LEFT_PAIR", 2, `The left side is ${w.coefficient}x + ${w.leftConstant}.`, x => x.kind === "LINEAR" && x.coefficient === w.coefficient && x.leftConstant === w.leftConstant),
      st(`FULL_${w.coefficient}_${w.leftConstant}_${w.rightConstant}`, "FULL_EQUATION", 2, `The equation is ${w.coefficient}x + ${w.leftConstant} = ${w.rightConstant}.`, x => x.kind === "LINEAR" && x.coefficient === w.coefficient && x.leftConstant === w.leftConstant && x.rightConstant === w.rightConstant),
      st(`ALE_${w.coefficient}`, "BOUND", 2, `The coefficient of x is at most ${w.coefficient}.`, x => x.kind === "LINEAR" && x.coefficient <= w.coefficient),
      st(`CLE_${w.rightConstant}`, "BOUND", 2, `The right-hand side is at most ${w.rightConstant}.`, x => x.kind === "LINEAR" && x.rightConstant <= w.rightConstant),
      st(`AP_${w.coefficient%2}`, "PARITY", 2, `The coefficient of x is ${w.coefficient%2===0?"even":"odd"}.`, x => x.kind === "LINEAR" && x.coefficient%2 === w.coefficient%2),
    ];
  }
  const w = problem.anchor;
  return [
    st(`X_${target}`, "TARGET_EXACT", 1, `The x-coordinate of the solution is ${target}.`, x => x.kind === "SYSTEM" && sourceAnswer(problem, x) === target),
    st(`E1_${w.sum}`, "FIRST_EQUATION", 1, `The first equation is x + y = ${w.sum}.`, x => x.kind === "SYSTEM" && x.sum === w.sum),
    st(`E2_${w.transformed}`, "SECOND_EQUATION", 1, `The second equation is 2x − y = ${w.transformed}.`, x => x.kind === "SYSTEM" && x.transformed === w.transformed),
    st(`Y_${w.y}`, "Y_EXACT", 1, `The y-coordinate of the solution is ${w.y}.`, x => x.kind === "SYSTEM" && x.y === w.y),
    st(`FULL_${w.sum}_${w.transformed}`, "FULL_SYSTEM", 2, `The equations are x + y = ${w.sum} and 2x − y = ${w.transformed}.`, x => x.kind === "SYSTEM" && x.sum === w.sum && x.transformed === w.transformed),
    st(`SLE_${w.sum}`, "BOUND", 2, `The value of x + y is at most ${w.sum}.`, x => x.kind === "SYSTEM" && x.sum <= w.sum),
    st(`TGE_${w.transformed}`, "BOUND", 2, `The value of 2x − y is at least ${w.transformed}.`, x => x.kind === "SYSTEM" && x.transformed >= w.transformed),
    st(`YP_${w.y%2}`, "PARITY", 2, `The y-coordinate is ${w.y%2===0?"even":"odd"}.`, x => x.kind === "SYSTEM" && x.y%2 === w.y%2),
  ];
}
function desiredClass(seed: number): SufficiencyClass {
  return SUFFICIENCY_CLASSES[Math.floor(Math.abs(seed) / DSF_CP011_ALGEBRA_ENRICHMENT_SOLVE_MODES.length) % SUFFICIENCY_CLASSES.length]!;
}
function buildProblem(seed: number, attempt: number): Problem {
  const mode = DSF_CP011_ALGEBRA_ENRICHMENT_SOLVE_MODES[Math.abs(seed) % 2]!;
  const random = rng(seed + attempt * 65537, `problem:${mode}`);
  const block = Math.floor(Math.abs(seed) / 2);
  if (mode === "DSF-SM-ALG-LINEAR-EQUATION-X") return { solveMode: mode, anchor: pick(random, LINEAR_WORLDS), contextId: "LINEAR_EQUATION", intro: LINEAR_INTROS[block % LINEAR_INTROS.length]! };
  return { solveMode: mode, anchor: pick(random, SYSTEM_WORLDS), contextId: "SIMULTANEOUS_EQUATIONS", intro: SYSTEM_INTROS[block % SYSTEM_INTROS.length]! };
}
function synthesize(problem: Problem, seed: number, desired: SufficiencyClass): Pair {
  const pool = statementPool(problem);
  const candidates: Pair[] = [];
  for (const statementI of pool) for (const statementII of pool) {
    if (statementI.id === statementII.id) continue;
    try {
      const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
      if (evaluation.classification === desired) candidates.push({ statementI, statementII, evaluation });
    } catch { /* reject inconsistent conjunction */ }
  }
  if (!candidates.length) throw new Error(`No frozen Algebra DS pair for ${problem.solveMode}/${desired}`);
  return pick(rng(seed, `pair:${problem.solveMode}:${desired}`), candidates);
}
function difficulty(pair: Pair): Difficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  if (pair.statementI.complexity === 1 && pair.statementII.complexity === 1) return "Easy";
  return "Medium";
}
function explain(label: string, values: readonly string[], sufficient: boolean) {
  if (sufficient) return `${label} fixes x at ${values[0]}, so it is sufficient.`;
  return values.length >= 2 ? `${label} allows different x-values such as ${values[0]} and ${values[1]}, so it is insufficient.` : `${label} does not fix x uniquely, so it is insufficient.`;
}
export function normalizeDsfCp011AlgebraSurface(text: string) {
  return text.toLowerCase().replace(/-?\d+(?:\/\d+)?/g, "#").replace(/[^a-z#×−+]+/g, " ").trim().replace(/\s+/g, " ");
}
export function generateDsfCp011AlgebraEnrichmentQuestion(seed: number) {
  const desired = desiredClass(seed);
  let problem: Problem | undefined;
  let pair: Pair | undefined;
  let lastError: unknown;
  for (let attempt = 0; attempt < 64; attempt += 1) {
    const candidate = buildProblem(seed, attempt);
    try { problem = candidate; pair = synthesize(candidate, seed + attempt * 104729, desired); break; }
    catch (error) { lastError = error; }
  }
  if (!problem || !pair) throw lastError instanceof Error ? lastError : new Error(`Unable to synthesize Algebra DS seed ${seed}`);
  const questionPrompt = "Can the value of x be determined?";
  const stem = `${problem.intro} ${questionPrompt}`;
  const evaluation = pair.evaluation;
  const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
  const capability = problem.solveMode === "DSF-SM-ALG-LINEAR-EQUATION-X" ? "quant-v4/shared/algebra::solveLinearEquation" : "quant-v4/shared/algebra::solveLinearSystem2V";
  const generationIdentity = createHash("sha256").update(`${DSF_CP011_ALGEBRA_ENRICHMENT_RUNTIME_VERSION}|${seed}|${problem.solveMode}|${pair.statementI.id}|${pair.statementII.id}`).digest("hex").slice(0,24);
  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-011" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP011_ALGEBRA_ENRICHMENT_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficulty(pair),
    domainFamily: "QUANT" as const,
    sourceDomain: "ALGEBRA" as const,
    sourceChapterId: "ALG-001/ALG-002" as const,
    sourceFreezeAuthority: ALG_ENGLISH_V3_FREEZE_APPROVAL.approvedReviewAuthority,
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
    options: DS_STANDARD_5_EN.options.map(o => ({ key:o.key, value:o.text, semanticClass:o.semanticClass, isCorrect:o.semanticClass===evaluation.classification })),
    correctIndex: DS_STANDARD_5_EN.options.findIndex(o => o.semanticClass===evaluation.classification),
    canonicalAnswer: evaluation.classification,
    explanation: {
      askedTarget: "We need to determine x.",
      statementI: explain("Statement I", evaluation.statementI.normalizedTargetAnswers, evaluation.statementI.sufficient),
      statementII: explain("Statement II", evaluation.statementII.normalizedTargetAnswers, evaluation.statementII.sufficient),
      together: !evaluation.statementI.sufficient && !evaluation.statementII.sufficient ? (evaluation.together.sufficient ? `Together the statements fix x at ${evaluation.together.normalizedTargetAnswers[0]}.` : `Even together they allow different x-values such as ${evaluation.together.normalizedTargetAnswers.slice(0,2).join(" and ")}.`) : undefined,
      conclusion: correct.text,
    },
    proof: { baseWorldCount: baseWorlds(problem).length, statementIWorldCount:evaluation.statementI.worldCount, statementIIWorldCount:evaluation.statementII.worldCount, togetherWorldCount:evaluation.together.worldCount, statementITargetAnswers:evaluation.statementI.normalizedTargetAnswers, statementIITargetAnswers:evaluation.statementII.normalizedTargetAnswers, togetherTargetAnswers:evaluation.together.normalizedTargetAnswers, minimalSufficientSets:evaluation.minimalSufficientSets },
    sourceAncestry: ["ALG-EN-v3-frozen", capability] as const,
    generationIdentity,
    studentSurfaceFingerprint: `${normalizeDsfCp011AlgebraSurface(stem)}|${problem.solveMode}|${pair.statementI.family}|${pair.statementII.family}`,
    lifecycle: { contentStatus:"CP011_EXPANSION_REVIEW_CANDIDATE" as const, questionStudioDiscoverable:false as const, questionBankWritable:false as const, testEligible:false as const, publiclyPublishable:false as const },
  });
}
export function generateDsfCp011AlgebraEnrichmentBatch(seeds: readonly number[]) { return seeds.map(generateDsfCp011AlgebraEnrichmentQuestion); }
