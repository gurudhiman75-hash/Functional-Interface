import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import { solveRap003 } from "../../../../../quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-003/solver.ts";
import { simplifyRatio } from "../../../../../quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-003/math.ts";
import type { Rap003Parameters } from "../../../../../quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-003/types.ts";

export const DSF_CP011_AGES_RUNTIME_VERSION = "DSF_CP011_AGES_RUNTIME_V1" as const;
export const DSF_CP011_AGES_SOLVE_MODES = [
  "DSF-SM-AGE-PRESENT-AGE-A",
  "DSF-SM-AGE-PRESENT-AGE-B",
] as const;

export type DsfCp011AgesSolveMode = (typeof DSF_CP011_AGES_SOLVE_MODES)[number];
export type DsfCp011AgesDifficulty = "Easy" | "Medium" | "Hard";
export type DsfCp011AgesTargetKind = "PERSON_A_AGE" | "PERSON_B_AGE";

type AgesContextId = "COUSINS" | "COLLEAGUES" | "NEIGHBOURS" | "PLAYERS" | "FRIENDS" | "SIBLINGS";
type AgesStatementFamily =
  | "PRESENT_RATIO"
  | "PRESENT_SUM"
  | "AGE_DIFFERENCE"
  | "EXACT_AGE"
  | "FUTURE_RATIO"
  | "PAST_RATIO"
  | "BOUND"
  | "PARITY"
  | "COMPARISON"
  | "RATIO_SUM_PAIR"
  | "RATIO_DIFFERENCE_PAIR";

interface AgesContext {
  readonly id: AgesContextId;
  readonly personA: string;
  readonly personB: string;
  readonly intro: readonly string[];
}

interface AgesWorld { readonly ageA: number; readonly ageB: number }
interface AgesProblem {
  readonly anchor: AgesWorld;
  readonly targetKind: DsfCp011AgesTargetKind;
  readonly solveMode: DsfCp011AgesSolveMode;
  readonly context: AgesContext;
  readonly surfaceVariant: number;
}
interface AgesStatement {
  readonly id: string;
  readonly family: AgesStatementFamily;
  readonly complexity: 1 | 2 | 3;
  readonly text: string;
  readonly test: (world: AgesWorld) => boolean;
}
interface SynthesizedAgesPair {
  readonly statementI: AgesStatement;
  readonly statementII: AgesStatement;
  readonly evaluation: TwoStatementSufficiencyEvaluation<string>;
  readonly qualityScore: number;
}

const CONTEXTS: readonly AgesContext[] = [
  { id: "COUSINS", personA: "Aman", personB: "Karan", intro: ["Aman and Karan are cousins.", "Consider the present ages of cousins Aman and Karan.", "The ages of two cousins, Aman and Karan, are being compared.", "Aman and Karan are two cousins whose present ages are under consideration."] },
  { id: "COLLEAGUES", personA: "Neha", personB: "Riya", intro: ["Neha and Riya are colleagues.", "Consider the present ages of colleagues Neha and Riya.", "The present ages of Neha and Riya, who work together, are being considered.", "Neha and Riya are two colleagues whose ages are being compared."] },
  { id: "NEIGHBOURS", personA: "Harpreet", personB: "Manpreet", intro: ["Harpreet and Manpreet are neighbours.", "Consider the present ages of neighbours Harpreet and Manpreet.", "The present ages of Harpreet and Manpreet are being compared.", "Harpreet and Manpreet are two neighbours whose ages are under consideration."] },
  { id: "PLAYERS", personA: "Kabir", personB: "Dev", intro: ["Kabir and Dev are players in the same club.", "Consider the present ages of club players Kabir and Dev.", "The ages of two players, Kabir and Dev, are being compared.", "Kabir and Dev play for the same club; consider their present ages."] },
  { id: "FRIENDS", personA: "Simran", personB: "Mehak", intro: ["Simran and Mehak are friends.", "Consider the present ages of friends Simran and Mehak.", "The present ages of Simran and Mehak are under consideration.", "Simran and Mehak are two friends whose ages are being compared."] },
  { id: "SIBLINGS", personA: "Arjun", personB: "Ishaan", intro: ["Arjun and Ishaan are siblings.", "Consider the present ages of siblings Arjun and Ishaan.", "The present ages of Arjun and Ishaan are being compared.", "Arjun and Ishaan are siblings whose current ages are under consideration."] },
] as const;

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  const text = `${DSF_CP011_AGES_RUNTIME_VERSION}:${seed}:${salt}`;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
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
  return values[Math.floor(random() * values.length)]!;
}
function desiredClass(seed: number): SufficiencyClass {
  return SUFFICIENCY_CLASSES[hashSeed(seed, "semantic-class") % SUFFICIENCY_CLASSES.length]!;
}

const BASE_WORLDS: readonly AgesWorld[] = Object.freeze(
  Array.from({ length: 20 }, (_, ai) => 18 + ai).flatMap((ageA) =>
    Array.from({ length: 20 }, (_, bi) => 12 + bi)
      .filter((ageB) => ageA !== ageB)
      .map((ageB) => Object.freeze({ ageA, ageB })),
  ),
);

function sourceParameters(world: AgesWorld, targetKind: DsfCp011AgesTargetKind): Rap003Parameters {
  const [ratioA, ratioB] = simplifyRatio([world.ageA, world.ageB]);
  const personA = "A";
  const personB = "B";
  return {
    archetypeId: "RAP-003",
    canonicalProblemId: "RAP-CP-014",
    questionId: `DSF-CP011-AGE-${world.ageA}-${world.ageB}-${targetKind}`,
    questionLanguageId: "RAP-003-DSF-CP011-AGE-SOURCE",
    explanationId: "RAP-003-DSF-CP011-AGE-SOURCE",
    language: "en",
    difficultyBand: "Medium",
    taskKind: "ageFromSumAndRatio",
    answerType: "AGE",
    requiredVariables: ["personA", "personB", "targetPerson", "ratioA", "ratioB", "ageSum"],
    variables: {
      personA,
      personB,
      targetPerson: targetKind === "PERSON_A_AGE" ? personA : personB,
      ratioA,
      ratioB,
      ageSum: world.ageA + world.ageB,
    },
    sourceTrace: {
      questionLanguageSource: "DSF-CP011 source projection only",
      explanationSource: "RAP-003/solver::solveRap003",
      variableRangeSource: "DSF-CP011 finite-world adapter",
    },
  };
}

const SOURCE_ANSWER_CACHE = new Map<string, string>();
function sourceAnswer(world: AgesWorld, targetKind: DsfCp011AgesTargetKind): string {
  const key = `${targetKind}:${world.ageA}:${world.ageB}`;
  const cached = SOURCE_ANSWER_CACHE.get(key);
  if (cached !== undefined) return cached;
  const answer = String(solveRap003(sourceParameters(world, targetKind)).answerValue);
  SOURCE_ANSWER_CACHE.set(key, answer);
  return answer;
}

const adapter = {
  adapterId: "DSF-ADAPTER-RAP-003-AGES-CP011-V1",
  domainFamily: "QUANT" as const,
  sourceChapterId: "RAP-003",
  enumerateBaseWorlds(_problem: AgesProblem): readonly AgesWorld[] { return BASE_WORLDS; },
  statementHolds(_problem: AgesProblem, world: AgesWorld, statement: AgesStatement): boolean { return statement.test(world); },
  evaluateTarget(problem: AgesProblem, world: AgesWorld): string { return sourceAnswer(world, problem.targetKind); },
  normalizeAnswer(answer: string): string { return answer; },
};

function buildProblem(seed: number, attempt = 0): AgesProblem {
  const random = createRng(seed + attempt * 7919, "problem");
  let ageA = 20 + Math.floor(random() * 16);
  let ageB = 14 + Math.floor(random() * 16);
  if (ageA === ageB) ageA = Math.min(37, ageA + 1);
  const targetKind: DsfCp011AgesTargetKind = random() < 0.5 ? "PERSON_A_AGE" : "PERSON_B_AGE";
  const context = pick(random, CONTEXTS);
  return {
    anchor: { ageA, ageB },
    targetKind,
    solveMode: targetKind === "PERSON_A_AGE" ? "DSF-SM-AGE-PRESENT-AGE-A" : "DSF-SM-AGE-PRESENT-AGE-B",
    context,
    surfaceVariant: Math.floor(random() * context.intro.length),
  };
}

function ratioOf(ageA: number, ageB: number): readonly [number, number] {
  const values = simplifyRatio([ageA, ageB]);
  return [values[0]!, values[1]!] as const;
}
function ratioMatches(world: AgesWorld, left: number, right: number): boolean {
  const ratio = ratioOf(world.ageA, world.ageB);
  return ratio[0] === left && ratio[1] === right;
}

function buildStatementPool(problem: AgesProblem): readonly AgesStatement[] {
  const { ageA, ageB } = problem.anchor;
  const { personA, personB } = problem.context;
  const [ratioA, ratioB] = ratioOf(ageA, ageB);
  const sum = ageA + ageB;
  const difference = Math.abs(ageA - ageB);
  const futureShift = 5;
  const pastShift = 3;
  const [futureRatioA, futureRatioB] = ratioOf(ageA + futureShift, ageB + futureShift);
  const [pastRatioA, pastRatioB] = ratioOf(ageA - pastShift, ageB - pastShift);
  const targetName = problem.targetKind === "PERSON_A_AGE" ? personA : personB;
  const targetAge = problem.targetKind === "PERSON_A_AGE" ? ageA : ageB;
  const otherName = problem.targetKind === "PERSON_A_AGE" ? personB : personA;
  const otherAge = problem.targetKind === "PERSON_A_AGE" ? ageB : ageA;

  return [
    { id: `RATIO_${ratioA}_${ratioB}`, family: "PRESENT_RATIO", complexity: 1, text: `The ratio of ${personA}'s present age to ${personB}'s present age is ${ratioA}:${ratioB}.`, test: (world) => ratioMatches(world, ratioA, ratioB) },
    { id: `SUM_${sum}`, family: "PRESENT_SUM", complexity: 1, text: `The sum of their present ages is ${sum} years.`, test: (world) => world.ageA + world.ageB === sum },
    { id: `DIFFERENCE_${difference}`, family: "AGE_DIFFERENCE", complexity: 1, text: `The difference between their present ages is ${difference} years.`, test: (world) => Math.abs(world.ageA - world.ageB) === difference },
    { id: `TARGET_EXACT_${targetAge}`, family: "EXACT_AGE", complexity: 2, text: `${targetName} is ${targetAge} years old at present.`, test: (world) => (problem.targetKind === "PERSON_A_AGE" ? world.ageA : world.ageB) === targetAge },
    { id: `OTHER_EXACT_${otherAge}`, family: "EXACT_AGE", complexity: 2, text: `${otherName} is ${otherAge} years old at present.`, test: (world) => (problem.targetKind === "PERSON_A_AGE" ? world.ageB : world.ageA) === otherAge },
    { id: `FUTURE_RATIO_${futureRatioA}_${futureRatioB}`, family: "FUTURE_RATIO", complexity: 2, text: `After ${futureShift} years, the ratio of ${personA}'s age to ${personB}'s age will be ${futureRatioA}:${futureRatioB}.`, test: (world) => ratioMatches(world.ageA + futureShift === 0 ? world : { ageA: world.ageA + futureShift, ageB: world.ageB + futureShift }, futureRatioA, futureRatioB) },
    { id: `PAST_RATIO_${pastRatioA}_${pastRatioB}`, family: "PAST_RATIO", complexity: 2, text: `${pastShift} years ago, the ratio of ${personA}'s age to ${personB}'s age was ${pastRatioA}:${pastRatioB}.`, test: (world) => world.ageA > pastShift && world.ageB > pastShift && ratioMatches({ ageA: world.ageA - pastShift, ageB: world.ageB - pastShift }, pastRatioA, pastRatioB) },
    { id: `TARGET_GT_${Math.max(10, targetAge - 3)}`, family: "BOUND", complexity: 2, text: `${targetName}'s present age is greater than ${Math.max(10, targetAge - 3)} years.`, test: (world) => (problem.targetKind === "PERSON_A_AGE" ? world.ageA : world.ageB) > Math.max(10, targetAge - 3) },
    { id: `TARGET_LT_${targetAge + 3}`, family: "BOUND", complexity: 2, text: `${targetName}'s present age is less than ${targetAge + 3} years.`, test: (world) => (problem.targetKind === "PERSON_A_AGE" ? world.ageA : world.ageB) < targetAge + 3 },
    { id: `TARGET_${targetAge % 2 === 0 ? "EVEN" : "ODD"}`, family: "PARITY", complexity: 2, text: `${targetName}'s present age is ${targetAge % 2 === 0 ? "even" : "odd"}.`, test: (world) => (problem.targetKind === "PERSON_A_AGE" ? world.ageA : world.ageB) % 2 === targetAge % 2 },
    { id: ageA > ageB ? "A_OLDER_B" : "B_OLDER_A", family: "COMPARISON", complexity: 1, text: ageA > ageB ? `${personA} is older than ${personB}.` : `${personB} is older than ${personA}.`, test: (world) => ageA > ageB ? world.ageA > world.ageB : world.ageB > world.ageA },
    { id: `RATIO_SUM_${ratioA}_${ratioB}_${sum}`, family: "RATIO_SUM_PAIR", complexity: 3, text: `Their present ages are in the ratio ${ratioA}:${ratioB}, and their sum is ${sum} years.`, test: (world) => ratioMatches(world, ratioA, ratioB) && world.ageA + world.ageB === sum },
    { id: `RATIO_DIFF_${ratioA}_${ratioB}_${difference}`, family: "RATIO_DIFFERENCE_PAIR", complexity: 3, text: `Their present ages are in the ratio ${ratioA}:${ratioB}, and the difference between their ages is ${difference} years.`, test: (world) => ratioMatches(world, ratioA, ratioB) && Math.abs(world.ageA - world.ageB) === difference },
  ];
}

function survivorCount(statement: AgesStatement): number { return BASE_WORLDS.filter(statement.test).length; }
function pairQuality(first: AgesStatement, second: AgesStatement, evaluation: TwoStatementSufficiencyEvaluation<string>): number {
  const familyBonus = first.family === second.family ? -5 : 5;
  const conjunctionBonus = evaluation.classification === "BOTH_TOGETHER_ONLY" ? 9 : 0;
  const weakProofBonus = evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER" ? 3 : 0;
  const exactPenalty = [first, second].filter((statement) => statement.family === "EXACT_AGE").length * 2;
  const compoundPenalty = [first, second].filter((statement) => statement.family === "RATIO_SUM_PAIR" || statement.family === "RATIO_DIFFERENCE_PAIR").length * 2;
  const breadth = Math.min(survivorCount(first), 50) + Math.min(survivorCount(second), 50);
  return familyBonus + conjunctionBonus + weakProofBonus + Math.floor(breadth / 25) - first.complexity - second.complexity - exactPenalty - compoundPenalty;
}

function synthesizePair(problem: AgesProblem, seed: number, targetClass: SufficiencyClass): SynthesizedAgesPair {
  const statements = buildStatementPool(problem);
  const candidates: SynthesizedAgesPair[] = [];
  for (const statementI of statements) {
    for (const statementII of statements) {
      if (statementI.id === statementII.id) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
        if (evaluation.classification !== targetClass) continue;
        candidates.push({ statementI, statementII, evaluation, qualityScore: pairQuality(statementI, statementII, evaluation) });
      } catch {
        // Empty or inconsistent statement intersections are generation rejects.
      }
    }
  }
  if (candidates.length === 0) throw new Error(`No Ages pair for ${targetClass}/${problem.targetKind}`);
  const best = Math.max(...candidates.map((candidate) => candidate.qualityScore));
  const shortlist = candidates.filter((candidate) => candidate.qualityScore >= best - 2);
  return pick(createRng(seed, `pair:${targetClass}:${problem.targetKind}`), shortlist);
}

function targetPrompt(problem: AgesProblem): string {
  const target = problem.targetKind === "PERSON_A_AGE" ? problem.context.personA : problem.context.personB;
  return `What is ${target}'s present age?`;
}
function explanationForStatement(label: string, targetAnswers: readonly string[], sufficient: boolean): string {
  if (sufficient) return `${label} fixes the required present age at ${targetAnswers[0]} years. Therefore, ${label} alone is sufficient.`;
  const examples = targetAnswers.slice(0, 2);
  return examples.length >= 2
    ? `${label} permits different present ages, for example ${examples[0]} years and ${examples[1]} years. Therefore, ${label} alone is not sufficient.`
    : `${label} does not fix a unique present age. Therefore, ${label} alone is not sufficient.`;
}
function difficultyFor(pair: SynthesizedAgesPair): DsfCp011AgesDifficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.statementI.complexity === 3 || pair.statementII.complexity === 3) return "Hard";
  if (pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Medium";
  if (pair.statementI.complexity === 1 && pair.statementII.complexity === 1) return "Easy";
  return "Medium";
}
export function normalizeDsfCp011AgesSurface(text: string): string {
  return text.toLowerCase().replace(/\d+(?:\.\d+)?/g, "#").replace(/[^a-z#]+/g, " ").trim().replace(/\s+/g, " ");
}

export function generateDsfCp011AgesQuestion(seed: number) {
  const targetClass = desiredClass(seed);
  let problem: AgesProblem | undefined;
  let pair: SynthesizedAgesPair | undefined;
  let lastError: unknown;
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const candidateProblem = buildProblem(seed, attempt);
    try {
      const candidatePair = synthesizePair(candidateProblem, seed + attempt * 104729, targetClass);
      problem = candidateProblem; pair = candidatePair; break;
    } catch (error) { lastError = error; }
  }
  if (!problem || !pair) throw lastError instanceof Error ? lastError : new Error(`Unable to synthesize Ages DS question for seed ${seed}`);

  const evaluation = pair.evaluation;
  const prompt = targetPrompt(problem);
  const stem = `${problem.context.intro[problem.surfaceVariant]} ${prompt}`;
  const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
  const together = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? evaluation.together.sufficient
      ? `Using both statements together fixes the required present age at ${evaluation.together.normalizedTargetAnswers[0]} years. So the two statements together are sufficient.`
      : `Even together, the statements permit different present ages such as ${evaluation.together.normalizedTargetAnswers.slice(0, 2).join(" years and ")} years. So they remain insufficient.`
    : undefined;

  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-011" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP011_AGES_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficultyFor(pair),
    domainFamily: "QUANT" as const,
    sourceChapterId: "RAP-003" as const,
    sourceDomain: "AGES" as const,
    sourceCapability: "RAP-003/solver::solveRap003(ageFromSumAndRatio)" as const,
    solveModeId: problem.solveMode,
    targetKind: problem.targetKind,
    contextId: problem.context.id,
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
      ...(together ? { together } : {}),
      conclusion: correct.text,
    },
    proof: {
      baseWorldCount: BASE_WORLDS.length,
      statementIWorldCount: evaluation.statementI.worldCount,
      statementIIWorldCount: evaluation.statementII.worldCount,
      togetherWorldCount: evaluation.together.worldCount,
      statementITargetAnswers: evaluation.statementI.normalizedTargetAnswers,
      statementIITargetAnswers: evaluation.statementII.normalizedTargetAnswers,
      togetherTargetAnswers: evaluation.together.normalizedTargetAnswers,
      minimalSufficientSets: evaluation.minimalSufficientSets,
      sourceSolver: "solveRap003" as const,
      sourceTaskKind: "ageFromSumAndRatio" as const,
    },
    sourceAncestry: ["RAP-003", "RAP-003/solver::solveRap003", "ageFromSumAndRatio"] as const,
    generationIdentity: createHash("sha256").update(`${DSF_CP011_AGES_RUNTIME_VERSION}|${seed}|${problem.context.id}|${problem.targetKind}|${pair.statementI.id}|${pair.statementII.id}`).digest("hex").slice(0, 24),
    studentSurfaceFingerprint: `${normalizeDsfCp011AgesSurface(stem)}|${problem.targetKind}|${pair.statementI.family}|${pair.statementII.family}`,
    lifecycle: {
      contentStatus: "CP011_EXPANSION_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}

export function generateDsfCp011AgesBatch(seeds: readonly number[]) { return seeds.map(generateDsfCp011AgesQuestion); }
