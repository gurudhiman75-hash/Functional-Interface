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
  solveCp001Canonical,
  type RnkDisplayedEvidence,
  type RnkNormalizedState,
  type RnkCp001PrototypeId,
} from "../../../Ranking-and-Order/RNK-001/RNK-CP-001/cp001-foundation.ts";

export const DSF_CP012_RANKING_RUNTIME_VERSION = "DSF_CP012_RANKING_RUNTIME_V1" as const;

export const DSF_CP012_RANKING_SOLVE_MODES = [
  "DSF-SM-RNK-OPPOSITE-END-RANK",
  "DSF-SM-RNK-TOTAL-FROM-END-RANKS",
  "DSF-SM-RNK-COUNT-AFTER",
  "DSF-SM-RNK-RANK-FROM-COUNT-BEFORE",
] as const;

export type DsfCp012RankingSolveMode = (typeof DSF_CP012_RANKING_SOLVE_MODES)[number];
type Difficulty = "Easy" | "Medium" | "Hard";
type ContextId = "MERIT_LIST" | "QUEUE" | "ROW" | "RACE_ORDER" | "INTERVIEW_ORDER" | "SCORE_ORDER";
type StatementFamily =
  | "TARGET_EXACT"
  | "TOTAL_EXACT"
  | "START_RANK_EXACT"
  | "END_RANK_EXACT"
  | "BEFORE_COUNT_EXACT"
  | "AFTER_COUNT_EXACT"
  | "TOTAL_START_PAIR"
  | "START_END_PAIR"
  | "TOTAL_AFTER_PAIR"
  | "TOTAL_BOUND"
  | "START_RANK_BOUND"
  | "END_RANK_BOUND"
  | "START_RANK_PARITY"
  | "TOTAL_PARITY";

type RankingWorld = Readonly<RnkNormalizedState>;

type RankingProblem = Readonly<{
  solveMode: DsfCp012RankingSolveMode;
  anchor: RankingWorld;
  contextId: ContextId;
  intro: string;
}>;

type RankingStatement = Readonly<{
  id: string;
  family: StatementFamily;
  complexity: 1 | 2 | 3;
  text: string;
  test: (world: RankingWorld) => boolean;
}>;

type SynthesizedPair = Readonly<{
  statementI: RankingStatement;
  statementII: RankingStatement;
  evaluation: TwoStatementSufficiencyEvaluation<number>;
  quality: number;
}>;

const CONTEXTS = [
  { id: "MERIT_LIST" as const, intros: ["A candidate's position in a merit list is being analysed.", "Consider one candidate in an ordered merit list.", "A merit-list ranking record is under review.", "The position of a candidate in a merit list must be determined."] },
  { id: "QUEUE" as const, intros: ["A person's position in a queue is being analysed.", "Consider one person standing in an ordered queue.", "A queue-position record is under review.", "The position of a person in a queue must be determined."] },
  { id: "ROW" as const, intros: ["A person's position in a straight row is being analysed.", "Consider one person in an ordered row.", "A left-to-right row position is under review.", "The position of a person in a straight row must be determined."] },
  { id: "RACE_ORDER" as const, intros: ["A runner's finishing position is being analysed.", "Consider the final order of runners in a race.", "A race-finishing rank is under review.", "The finishing position of one runner must be determined."] },
  { id: "INTERVIEW_ORDER" as const, intros: ["A candidate's position in an interview order is being analysed.", "Consider an ordered interview list.", "An interview-order position is under review.", "The place of one candidate in an interview order must be determined."] },
  { id: "SCORE_ORDER" as const, intros: ["A student's position in a score-based ranking is being analysed.", "Consider students arranged by score rank.", "A score-order ranking record is under review.", "The rank of one student in a score list must be determined."] },
] as const;

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  for (const character of `${DSF_CP012_RANKING_RUNTIME_VERSION}:${seed}:${salt}`) {
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
  if (!values.length) throw new Error("CP012 Ranking cannot pick from an empty set");
  return values[Math.floor(random() * values.length)]!;
}

function modeForSeed(seed: number): DsfCp012RankingSolveMode {
  return DSF_CP012_RANKING_SOLVE_MODES[Math.abs(seed) % DSF_CP012_RANKING_SOLVE_MODES.length]!;
}

function classForSeed(seed: number): SufficiencyClass {
  const block = Math.floor(Math.abs(seed) / DSF_CP012_RANKING_SOLVE_MODES.length);
  return SUFFICIENCY_CLASSES[block % SUFFICIENCY_CLASSES.length]!;
}

function enumerateWorlds(): readonly RankingWorld[] {
  const worlds: RankingWorld[] = [];
  for (let total = 8; total <= 30; total += 1) {
    for (let rankFromStart = 1; rankFromStart <= total; rankFromStart += 1) {
      worlds.push(Object.freeze({
        total,
        rankFromStart,
        rankFromEnd: total - rankFromStart + 1,
        beforeCount: rankFromStart - 1,
        afterCount: total - rankFromStart,
      }));
    }
  }
  return Object.freeze(worlds);
}

const RANKING_WORLDS = enumerateWorlds();
const TARGET_CACHE = new Map<string, number>();

function sourceProjection(mode: DsfCp012RankingSolveMode, world: RankingWorld): number {
  const key = `${mode}|${world.total}|${world.rankFromStart}`;
  const cached = TARGET_CACHE.get(key);
  if (cached !== undefined) return cached;

  let prototypeId: RnkCp001PrototypeId;
  let evidence: RnkDisplayedEvidence;

  switch (mode) {
    case "DSF-SM-RNK-OPPOSITE-END-RANK":
      prototypeId = "RNK-CP001-PROT-OPPOSITE-END-RANK";
      evidence = {
        kind: "OPPOSITE_END_RANK",
        total: world.total,
        knownSide: "START",
        knownRank: world.rankFromStart,
      };
      break;
    case "DSF-SM-RNK-TOTAL-FROM-END-RANKS":
      prototypeId = "RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS";
      evidence = {
        kind: "TOTAL_FROM_TWO_END_RANKS",
        rankFromStart: world.rankFromStart,
        rankFromEnd: world.rankFromEnd,
      };
      break;
    case "DSF-SM-RNK-COUNT-AFTER":
      prototypeId = "RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK";
      evidence = {
        kind: "COUNT_AFTER_FROM_TOTAL_AND_RANK",
        total: world.total,
        rankFromStart: world.rankFromStart,
      };
      break;
    case "DSF-SM-RNK-RANK-FROM-COUNT-BEFORE":
      prototypeId = "RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE";
      evidence = {
        kind: "RANK_FROM_COUNT_BEFORE",
        beforeCount: world.beforeCount,
      };
      break;
  }

  const answer = solveCp001Canonical(prototypeId, world, evidence);
  TARGET_CACHE.set(key, answer);
  return answer;
}

const adapter = {
  adapterId: "DSF-CP012-RNK-001-SOURCE-BOUND-V1",
  domainFamily: "REASONING" as const,
  sourceChapterId: "RNK-001",
  enumerateBaseWorlds: (_problem: RankingProblem) => RANKING_WORLDS,
  statementHolds: (_problem: RankingProblem, world: RankingWorld, statement: RankingStatement) => statement.test(world),
  evaluateTarget: (problem: RankingProblem, world: RankingWorld) => sourceProjection(problem.solveMode, world),
  normalizeAnswer: (answer: number) => String(answer),
};

function statement(id: string, family: StatementFamily, complexity: 1 | 2 | 3, text: string, test: (world: RankingWorld) => boolean): RankingStatement {
  return { id, family, complexity, text, test };
}

function targetLabel(mode: DsfCp012RankingSolveMode): string {
  switch (mode) {
    case "DSF-SM-RNK-OPPOSITE-END-RANK": return "rank from the opposite end";
    case "DSF-SM-RNK-TOTAL-FROM-END-RANKS": return "total number of people";
    case "DSF-SM-RNK-COUNT-AFTER": return "number of people after the target person";
    case "DSF-SM-RNK-RANK-FROM-COUNT-BEFORE": return "rank from the starting end";
  }
}

function promptFor(mode: DsfCp012RankingSolveMode): string {
  switch (mode) {
    case "DSF-SM-RNK-OPPOSITE-END-RANK": return "What is the target person's rank from the opposite end?";
    case "DSF-SM-RNK-TOTAL-FROM-END-RANKS": return "How many people are there in the complete order?";
    case "DSF-SM-RNK-COUNT-AFTER": return "How many people are after the target person?";
    case "DSF-SM-RNK-RANK-FROM-COUNT-BEFORE": return "What is the target person's rank from the starting end?";
  }
}

function buildStatementPool(problem: RankingProblem): readonly RankingStatement[] {
  const a = problem.anchor;
  const target = sourceProjection(problem.solveMode, a);
  const targetText = targetLabel(problem.solveMode);

  return [
    statement(`TARGET_${target}`, "TARGET_EXACT", 1, `The ${targetText} is exactly ${target}.`, (w) => sourceProjection(problem.solveMode, w) === target),
    statement(`TOTAL_${a.total}`, "TOTAL_EXACT", 1, `There are exactly ${a.total} people in the complete order.`, (w) => w.total === a.total),
    statement(`START_${a.rankFromStart}`, "START_RANK_EXACT", 1, `The target person is ${a.rankFromStart}th from the starting end.`, (w) => w.rankFromStart === a.rankFromStart),
    statement(`END_${a.rankFromEnd}`, "END_RANK_EXACT", 1, `The target person is ${a.rankFromEnd}th from the opposite end.`, (w) => w.rankFromEnd === a.rankFromEnd),
    statement(`BEFORE_${a.beforeCount}`, "BEFORE_COUNT_EXACT", 1, `Exactly ${a.beforeCount} people are before the target person.`, (w) => w.beforeCount === a.beforeCount),
    statement(`AFTER_${a.afterCount}`, "AFTER_COUNT_EXACT", 1, `Exactly ${a.afterCount} people are after the target person.`, (w) => w.afterCount === a.afterCount),
    statement(`TOTAL_START_${a.total}_${a.rankFromStart}`, "TOTAL_START_PAIR", 2, `There are ${a.total} people, and the target person is ${a.rankFromStart}th from the starting end.`, (w) => w.total === a.total && w.rankFromStart === a.rankFromStart),
    statement(`START_END_${a.rankFromStart}_${a.rankFromEnd}`, "START_END_PAIR", 2, `The target person is ${a.rankFromStart}th from one end and ${a.rankFromEnd}th from the other end.`, (w) => w.rankFromStart === a.rankFromStart && w.rankFromEnd === a.rankFromEnd),
    statement(`TOTAL_AFTER_${a.total}_${a.afterCount}`, "TOTAL_AFTER_PAIR", 2, `There are ${a.total} people in all and ${a.afterCount} people are after the target person.`, (w) => w.total === a.total && w.afterCount === a.afterCount),
    statement(`TOTAL_LE_${a.total}`, "TOTAL_BOUND", 2, `The total number of people does not exceed ${a.total}.`, (w) => w.total <= a.total),
    statement(`TOTAL_GE_${a.total}`, "TOTAL_BOUND", 2, `The total number of people is at least ${a.total}.`, (w) => w.total >= a.total),
    statement(`START_LE_${a.rankFromStart}`, "START_RANK_BOUND", 2, `The target person's rank from the starting end is at most ${a.rankFromStart}.`, (w) => w.rankFromStart <= a.rankFromStart),
    statement(`START_GE_${a.rankFromStart}`, "START_RANK_BOUND", 2, `The target person's rank from the starting end is at least ${a.rankFromStart}.`, (w) => w.rankFromStart >= a.rankFromStart),
    statement(`END_LE_${a.rankFromEnd}`, "END_RANK_BOUND", 2, `The target person's rank from the opposite end is at most ${a.rankFromEnd}.`, (w) => w.rankFromEnd <= a.rankFromEnd),
    statement(`END_GE_${a.rankFromEnd}`, "END_RANK_BOUND", 2, `The target person's rank from the opposite end is at least ${a.rankFromEnd}.`, (w) => w.rankFromEnd >= a.rankFromEnd),
    statement(`START_PAR_${a.rankFromStart % 2}`, "START_RANK_PARITY", 2, `The rank from the starting end is ${a.rankFromStart % 2 === 0 ? "even" : "odd"}.`, (w) => w.rankFromStart % 2 === a.rankFromStart % 2),
    statement(`TOTAL_PAR_${a.total % 2}`, "TOTAL_PARITY", 2, `The total number of people is ${a.total % 2 === 0 ? "even" : "odd"}.`, (w) => w.total % 2 === a.total % 2),
  ];
}

function pairQuality(first: RankingStatement, second: RankingStatement, evaluation: TwoStatementSufficiencyEvaluation<number>): number {
  let score = first.family === second.family ? -8 : 6;
  if (evaluation.classification === "BOTH_TOGETHER_ONLY") score += 10;
  if (evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") score += 4;
  score += Math.min(8, Math.floor((evaluation.statementI.worldCount + evaluation.statementII.worldCount) / 80));
  score -= first.complexity + second.complexity;
  return score;
}

function synthesizePair(problem: RankingProblem, seed: number, desiredClass: SufficiencyClass): SynthesizedPair {
  const statements = buildStatementPool(problem);
  const candidates: SynthesizedPair[] = [];

  for (const statementI of statements) {
    for (const statementII of statements) {
      if (statementI.id === statementII.id) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
        if (evaluation.classification !== desiredClass) continue;
        candidates.push({ statementI, statementII, evaluation, quality: pairQuality(statementI, statementII, evaluation) });
      } catch {
        // Generated inconsistent conjunctions are rejected candidates.
      }
    }
  }

  if (!candidates.length) throw new Error(`No RNK-001 statement pair for ${problem.solveMode}/${desiredClass}`);
  const best = Math.max(...candidates.map((candidate) => candidate.quality));
  const shortlist = candidates.filter((candidate) => candidate.quality >= best - 2);
  return pick(createRng(seed, `pair:${problem.solveMode}:${desiredClass}`), shortlist);
}

function buildProblem(seed: number, attempt: number): RankingProblem {
  const solveMode = modeForSeed(seed);
  const random = createRng(seed + attempt * 65537, `problem:${solveMode}`);
  const context = pick(random, CONTEXTS);
  const eligible = RANKING_WORLDS.filter((world) => world.total >= 10 && world.rankFromStart > 1 && world.rankFromStart < world.total);
  return {
    solveMode,
    anchor: pick(random, eligible),
    contextId: context.id,
    intro: pick(random, context.intros),
  };
}

function difficultyFor(pair: SynthesizedPair): Difficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  if (pair.statementI.complexity === 1 && pair.statementII.complexity === 1) return "Easy";
  return "Medium";
}

function explanationFor(label: string, answers: readonly string[], sufficient: boolean): string {
  if (sufficient) return `${label} fixes the requested ranking value at ${answers[0]}. Therefore it is sufficient alone.`;
  const examples = answers.slice(0, 2);
  if (examples.length >= 2) return `${label} still permits different requested values, for example ${examples[0]} and ${examples[1]}. Therefore it is not sufficient alone.`;
  return `${label} does not determine one unique requested ranking value. Therefore it is not sufficient alone.`;
}

function normalizeSurface(text: string): string {
  return text.toLowerCase().replace(/\d+(?:st|nd|rd|th)?/g, "#").replace(/[^a-z#]+/g, " ").trim().replace(/\s+/g, " ");
}

export function normalizeDsfCp012RankingSurface(text: string): string {
  return normalizeSurface(text);
}

export function generateDsfCp012RankingQuestion(seed: number) {
  const desiredClass = classForSeed(seed);
  let problem: RankingProblem | undefined;
  let pair: SynthesizedPair | undefined;
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

  if (!problem || !pair) throw lastError instanceof Error ? lastError : new Error(`Unable to synthesize CP012 Ranking DS seed ${seed}`);

  const prompt = promptFor(problem.solveMode);
  const stem = `${problem.intro} ${prompt}`;
  const evaluation = pair.evaluation;
  const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
  const together = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? evaluation.together.sufficient
      ? `Together, the two statements fix the requested value at ${evaluation.together.normalizedTargetAnswers[0]}. Therefore the combination is sufficient.`
      : `Even together, the statements permit different requested values such as ${evaluation.together.normalizedTargetAnswers.slice(0, 2).join(" and ")}. Therefore the combination is insufficient.`
    : undefined;

  const generationIdentity = createHash("sha256")
    .update(`${DSF_CP012_RANKING_RUNTIME_VERSION}|${seed}|${problem.solveMode}|${problem.contextId}|${pair.statementI.id}|${pair.statementII.id}`)
    .digest("hex")
    .slice(0, 24);

  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-012" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP012_RANKING_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficultyFor(pair),
    domainFamily: "REASONING" as const,
    sourceChapterId: "RNK-001" as const,
    sourceCapabilities: ["RNK-001/RNK-CP-001/cp001-foundation::solveCp001Canonical"] as const,
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
      baseWorldCount: RANKING_WORLDS.length,
      statementIWorldCount: evaluation.statementI.worldCount,
      statementIIWorldCount: evaluation.statementII.worldCount,
      togetherWorldCount: evaluation.together.worldCount,
      statementITargetAnswers: evaluation.statementI.normalizedTargetAnswers,
      statementIITargetAnswers: evaluation.statementII.normalizedTargetAnswers,
      togetherTargetAnswers: evaluation.together.normalizedTargetAnswers,
      minimalSufficientSets: evaluation.minimalSufficientSets,
    },
    sourceAncestry: ["RNK-001", "RNK-CP-001", "solveCp001Canonical"] as const,
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

export function generateDsfCp012RankingBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp012RankingQuestion);
}
