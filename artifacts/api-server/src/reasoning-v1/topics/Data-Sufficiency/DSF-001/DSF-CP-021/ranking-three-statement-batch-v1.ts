import { createHash } from "node:crypto";
import {
  solveCp001Canonical,
  type RnkDisplayedEvidence,
  type RnkNormalizedState,
  type RnkCp001PrototypeId,
} from "../../../Ranking-and-Order/RNK-001/RNK-CP-001/cp001-foundation.ts";
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
import { renderThreeStatementEditorialExplanation } from "../shared/three-statement-editorial-explanation.ts";

export const DSF_CP021_RANKING_QL002_RUNTIME_VERSION = "DSF_CP021_RANKING_QL002_RUNTIME_V1" as const;
export const DSF_CP021_CHECKPOINT_ID = "DSF-CP-021" as const;

export const DSF_CP021_RANKING_SOLVE_MODES = [
  "DSF-SM-RNK-OPPOSITE-END-RANK",
  "DSF-SM-RNK-TOTAL-FROM-END-RANKS",
  "DSF-SM-RNK-COUNT-AFTER",
  "DSF-SM-RNK-RANK-FROM-COUNT-BEFORE",
] as const;

type SolveMode = (typeof DSF_CP021_RANKING_SOLVE_MODES)[number];
type RankingWorld = Readonly<RnkNormalizedState>;
type Problem = Readonly<{ solveMode: SolveMode; anchor: RankingWorld; contextId: ContextId }>;
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

type RankingStatement = Readonly<{
  id: string;
  family: StatementFamily;
  complexity: 1 | 2 | 3;
  text: string;
  test: (world: RankingWorld) => boolean;
}>;

type CandidateTriple = Readonly<{
  statementI: RankingStatement;
  statementII: RankingStatement;
  statementIII: RankingStatement;
  evaluation: ThreeStatementSufficiencyEvaluation<number>;
  semanticKey: DsfCp015ThreeStatementSemanticKey;
  quality: number;
}>;

const CONTEXTS: readonly ContextId[] = [
  "MERIT_LIST","QUEUE","ROW","RACE_ORDER","INTERVIEW_ORDER","SCORE_ORDER",
];

function stableHash(text: string): number {
  let hash = 2166136261;
  for (const ch of text) {
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function pickIndex(seed: string, length: number): number {
  if (!length) throw new Error("CP021 cannot pick from empty candidates.");
  return stableHash(seed) % length;
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

function sourceProjection(mode: SolveMode, world: RankingWorld): number {
  let prototypeId: RnkCp001PrototypeId;
  let evidence: RnkDisplayedEvidence;
  switch (mode) {
    case "DSF-SM-RNK-OPPOSITE-END-RANK":
      prototypeId = "RNK-CP001-PROT-OPPOSITE-END-RANK";
      evidence = { kind: "OPPOSITE_END_RANK", total: world.total, knownSide: "START", knownRank: world.rankFromStart };
      break;
    case "DSF-SM-RNK-TOTAL-FROM-END-RANKS":
      prototypeId = "RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS";
      evidence = { kind: "TOTAL_FROM_TWO_END_RANKS", rankFromStart: world.rankFromStart, rankFromEnd: world.rankFromEnd };
      break;
    case "DSF-SM-RNK-COUNT-AFTER":
      prototypeId = "RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK";
      evidence = { kind: "COUNT_AFTER_FROM_TOTAL_AND_RANK", total: world.total, rankFromStart: world.rankFromStart };
      break;
    case "DSF-SM-RNK-RANK-FROM-COUNT-BEFORE":
      prototypeId = "RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE";
      evidence = { kind: "RANK_FROM_COUNT_BEFORE", beforeCount: world.beforeCount };
      break;
  }
  return solveCp001Canonical(prototypeId, world, evidence);
}

const adapter = {
  adapterId: "DSF-CP021-RNK-001-THREE-STATEMENT-V1",
  domainFamily: "REASONING" as const,
  sourceChapterId: "RNK-001",
  enumerateBaseWorlds: (_problem: Problem) => RANKING_WORLDS,
  statementHolds: (_problem: Problem, world: RankingWorld, statement: RankingStatement) => statement.test(world),
  evaluateTarget: (problem: Problem, world: RankingWorld) => sourceProjection(problem.solveMode, world),
  normalizeAnswer: (answer: number) => String(answer),
};

function statement(
  id: string,
  family: StatementFamily,
  complexity: 1 | 2 | 3,
  text: string,
  test: (world: RankingWorld) => boolean,
): RankingStatement {
  return Object.freeze({ id, family, complexity, text, test });
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  const suffix = value % 10 === 1 ? "st" : value % 10 === 2 ? "nd" : value % 10 === 3 ? "rd" : "th";
  return `${value}${suffix}`;
}

function subjectFor(contextId: ContextId): string {
  switch (contextId) {
    case "MERIT_LIST":
    case "INTERVIEW_ORDER": return "candidate";
    case "RACE_ORDER": return "runner";
    case "SCORE_ORDER": return "student";
    default: return "person";
  }
}

function targetLabel(mode: SolveMode): string {
  switch (mode) {
    case "DSF-SM-RNK-OPPOSITE-END-RANK": return "rank from the opposite end";
    case "DSF-SM-RNK-TOTAL-FROM-END-RANKS": return "total number of people";
    case "DSF-SM-RNK-COUNT-AFTER": return "number of people after the person";
    case "DSF-SM-RNK-RANK-FROM-COUNT-BEFORE": return "rank from the starting end";
  }
}

function promptFor(mode: SolveMode, contextId: ContextId): string {
  const subject = subjectFor(contextId);
  switch (mode) {
    case "DSF-SM-RNK-OPPOSITE-END-RANK": return `What is the ${subject}'s rank from the opposite end?`;
    case "DSF-SM-RNK-TOTAL-FROM-END-RANKS": return "How many people are there in the complete order?";
    case "DSF-SM-RNK-COUNT-AFTER": return `How many people are after the ${subject}?`;
    case "DSF-SM-RNK-RANK-FROM-COUNT-BEFORE": return `What is the ${subject}'s rank from the starting end?`;
  }
}

function contextLead(contextId: ContextId): string {
  switch (contextId) {
    case "MERIT_LIST": return "A candidate has a position in a merit list.";
    case "QUEUE": return "A person is standing in an ordered queue.";
    case "ROW": return "A person has a position in a straight row.";
    case "RACE_ORDER": return "A runner has a finishing position in a race.";
    case "INTERVIEW_ORDER": return "A candidate has a position in an interview order.";
    case "SCORE_ORDER": return "A student has a position in a score-based ranking.";
  }
}

function buildStatementPool(problem: Problem): readonly RankingStatement[] {
  const a = problem.anchor;
  const target = sourceProjection(problem.solveMode, a);
  const targetText = targetLabel(problem.solveMode);
  const subject = subjectFor(problem.contextId);
  return Object.freeze([
    statement(`TARGET_${target}`, "TARGET_EXACT", 1, `The ${targetText} is exactly ${target}.`, w => sourceProjection(problem.solveMode, w) === target),
    statement(`TOTAL_${a.total}`, "TOTAL_EXACT", 1, `There are exactly ${a.total} people in the complete order.`, w => w.total === a.total),
    statement(`START_${a.rankFromStart}`, "START_RANK_EXACT", 1, `The ${subject} is ${ordinal(a.rankFromStart)} from the starting end.`, w => w.rankFromStart === a.rankFromStart),
    statement(`END_${a.rankFromEnd}`, "END_RANK_EXACT", 1, `The ${subject} is ${ordinal(a.rankFromEnd)} from the opposite end.`, w => w.rankFromEnd === a.rankFromEnd),
    statement(`BEFORE_${a.beforeCount}`, "BEFORE_COUNT_EXACT", 1, `${a.beforeCount === 1 ? "Exactly 1 person is" : `Exactly ${a.beforeCount} people are`} before the ${subject}.`, w => w.beforeCount === a.beforeCount),
    statement(`AFTER_${a.afterCount}`, "AFTER_COUNT_EXACT", 1, `${a.afterCount === 1 ? "Exactly 1 person is" : `Exactly ${a.afterCount} people are`} after the ${subject}.`, w => w.afterCount === a.afterCount),
    statement(`TOTAL_START_${a.total}_${a.rankFromStart}`, "TOTAL_START_PAIR", 2, `There are ${a.total} people, and the ${subject} is ${ordinal(a.rankFromStart)} from the starting end.`, w => w.total === a.total && w.rankFromStart === a.rankFromStart),
    statement(`START_END_${a.rankFromStart}_${a.rankFromEnd}`, "START_END_PAIR", 2, `The ${subject} is ${ordinal(a.rankFromStart)} from one end and ${ordinal(a.rankFromEnd)} from the other end.`, w => w.rankFromStart === a.rankFromStart && w.rankFromEnd === a.rankFromEnd),
    statement(`TOTAL_AFTER_${a.total}_${a.afterCount}`, "TOTAL_AFTER_PAIR", 2, `${a.total} people are in the complete order, and ${a.afterCount === 1 ? "1 person is" : `${a.afterCount} people are`} after the ${subject}.`, w => w.total === a.total && w.afterCount === a.afterCount),
    statement(`TOTAL_LE_${a.total}`, "TOTAL_BOUND", 2, `The total number of people does not exceed ${a.total}.`, w => w.total <= a.total),
    statement(`TOTAL_GE_${a.total}`, "TOTAL_BOUND", 2, `The total number of people is at least ${a.total}.`, w => w.total >= a.total),
    statement(`START_LE_${a.rankFromStart}`, "START_RANK_BOUND", 2, `The ${subject}'s rank from the starting end is at most ${a.rankFromStart}.`, w => w.rankFromStart <= a.rankFromStart),
    statement(`START_GE_${a.rankFromStart}`, "START_RANK_BOUND", 2, `The ${subject}'s rank from the starting end is at least ${a.rankFromStart}.`, w => w.rankFromStart >= a.rankFromStart),
    statement(`END_LE_${a.rankFromEnd}`, "END_RANK_BOUND", 2, `The ${subject}'s rank from the opposite end is at most ${a.rankFromEnd}.`, w => w.rankFromEnd <= a.rankFromEnd),
    statement(`END_GE_${a.rankFromEnd}`, "END_RANK_BOUND", 2, `The ${subject}'s rank from the opposite end is at least ${a.rankFromEnd}.`, w => w.rankFromEnd >= a.rankFromEnd),
    statement(`START_PAR_${a.rankFromStart % 2}`, "START_RANK_PARITY", 2, `The rank from the starting end is ${a.rankFromStart % 2 === 0 ? "even" : "odd"}.`, w => w.rankFromStart % 2 === a.rankFromStart % 2),
    statement(`TOTAL_PAR_${a.total % 2}`, "TOTAL_PARITY", 2, `The total number of people is ${a.total % 2 === 0 ? "even" : "odd"}.`, w => w.total % 2 === a.total % 2),
  ]);
}

const CANDIDATE_CACHE = new Map<string, readonly CandidateTriple[]>();

function candidateQuality(
  a: RankingStatement,
  b: RankingStatement,
  c: RankingStatement,
  evaluation: ThreeStatementSufficiencyEvaluation<number>,
): number {
  const familyBreadth = new Set([a.family,b.family,c.family]).size * 8;
  const complexityPenalty = a.complexity + b.complexity + c.complexity;
  const minimalSetDepth = evaluation.minimalSufficientSets.reduce((sum,set)=>sum+set.length,0);
  const singleWorlds = evaluation.subsetEvaluations
    .filter(entry => entry.statementIds.length === 1)
    .reduce((sum,entry)=>sum+Math.min(entry.result.worldCount,40),0);
  return familyBreadth + minimalSetDepth + Math.floor(singleWorlds / 30) - complexityPenalty;
}

function candidateTriples(problem: Problem): readonly CandidateTriple[] {
  const key = `${problem.solveMode}|${problem.anchor.total}|${problem.anchor.rankFromStart}`;
  const cached = CANDIDATE_CACHE.get(key);
  if (cached) return cached;

  const statements = buildStatementPool(problem).filter(s => s.test(problem.anchor));
  const candidates: CandidateTriple[] = [];
  for (let i=0;i<statements.length;i++) {
    for (let j=i+1;j<statements.length;j++) {
      for (let k=j+1;k<statements.length;k++) {
        const tripleOrders = [
          [statements[i]!,statements[j]!,statements[k]!],
          [statements[i]!,statements[k]!,statements[j]!],
          [statements[j]!,statements[i]!,statements[k]!],
        ] as const;
        for (const [statementI,statementII,statementIII] of tripleOrders) {
          try {
            const evaluation = evaluateFiniteDomainTriple(adapter,problem,statementI,statementII,statementIII);
            if (!isKnownThreeStatementSemanticKey(evaluation.semanticKey)) continue;
            candidates.push(Object.freeze({
              statementI,statementII,statementIII,evaluation,
              semanticKey:evaluation.semanticKey,
              quality:candidateQuality(statementI,statementII,statementIII,evaluation),
            }));
          } catch {
            // Invalid/inconsistent triples are generation rejects.
          }
        }
      }
    }
  }
  const result=Object.freeze(candidates);
  if(!result.length) throw new Error(`CP021 no Ranking triples for ${key}`);
  CANDIDATE_CACHE.set(key,result);
  return result;
}

function buildProblem(seed:string,attempt:number): Problem {
  const mode=DSF_CP021_RANKING_SOLVE_MODES[pickIndex(`${seed}:mode:${attempt}`,DSF_CP021_RANKING_SOLVE_MODES.length)]!;
  const eligible=RANKING_WORLDS.filter(w=>w.total>=10&&w.rankFromStart>1&&w.rankFromStart<w.total);
  const anchor=eligible[pickIndex(`${seed}:anchor:${attempt}`,eligible.length)]!;
  const contextId=CONTEXTS[pickIndex(`${seed}:context:${attempt}`,CONTEXTS.length)]!;
  return Object.freeze({solveMode:mode,anchor,contextId});
}

function selectTriple(seed:string): Readonly<{problem:Problem;triple:CandidateTriple}> {
  let best: {problem:Problem;candidates:readonly CandidateTriple[];semanticCount:number}|undefined;
  for(let attempt=0;attempt<40;attempt++){
    const problem=buildProblem(seed,attempt);
    const candidates=candidateTriples(problem);
    const keys=[...new Set(candidates.map(x=>x.semanticKey))].sort();
    if(!best||keys.length>best.semanticCount) best={problem,candidates,semanticCount:keys.length};
    if(keys.length>=6){
      const semantic=keys[pickIndex(`${seed}:semantic:${attempt}`,keys.length)]!;
      const matching=candidates.filter(x=>x.semanticKey===semantic);
      const top=Math.max(...matching.map(x=>x.quality));
      const shortlist=matching.filter(x=>x.quality>=top-2);
      return Object.freeze({problem,triple:shortlist[pickIndex(`${seed}:triple:${attempt}`,shortlist.length)]!});
    }
  }
  if(!best) throw new Error("CP021 could not synthesize Ranking QL002 item.");
  const top=Math.max(...best.candidates.map(x=>x.quality));
  const shortlist=best.candidates.filter(x=>x.quality>=top-2);
  return Object.freeze({problem:best.problem,triple:shortlist[pickIndex(`${seed}:fallback`,shortlist.length)]!});
}

function subsetSummary(evaluation:ThreeStatementSufficiencyEvaluation<number>, ids:readonly ("I"|"II"|"III")[]) {
  return evaluation.subsetEvaluations.find(entry=>entry.statementIds.length===ids.length&&ids.every(id=>entry.statementIds.includes(id)))?.result;
}

function explanation(problem:Problem,triple:CandidateTriple):string {
  return renderThreeStatementEditorialExplanation(triple.evaluation, targetLabel(problem.solveMode), triple.semanticKey);
}
export function generateDsfCp021RankingQuestion(seed:string|number){
  const seedText=String(seed);
  const {problem,triple}=selectTriple(seedText);
  const options=buildThreeStatementAnswerOptions(triple.semanticKey,stableHash(seedText));
  const correctIndex=options.findIndex(x=>x.isCorrect);
  const generationIdentity=createHash("sha256")
    .update(`${DSF_CP021_RANKING_QL002_RUNTIME_VERSION}|${seedText}|${problem.solveMode}|${problem.contextId}|${triple.statementI.id}|${triple.statementII.id}|${triple.statementIII.id}`)
    .digest("hex").slice(0,24);
  return Object.freeze({
    packageId:"DSF-001" as const,
    checkpointId:DSF_CP021_CHECKPOINT_ID,
    qlId:"DSF-QL-002" as const,
    runtimeVersion:DSF_CP021_RANKING_QL002_RUNTIME_VERSION,
    language:"en" as const,
    locale:"en-IN" as const,
    domainFamily:"REASONING" as const,
    sourceChapterId:"RNK-001" as const,
    sourceCapabilities:["RNK-001/RNK-CP-001/cp001-foundation::solveCp001Canonical"] as const,
    solveModeId:problem.solveMode,
    contextId:problem.contextId,
    statementCount:3 as const,
    taskContract:"THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS" as const,
    answerSemantic:"MINIMAL_SUFFICIENT_STATEMENT_SUBSET" as const,
    stem:`${contextLead(problem.contextId)} ${promptFor(problem.solveMode, problem.contextId)}`,
    questionPrompt:promptFor(problem.solveMode, problem.contextId),
    statements:Object.freeze([
      Object.freeze({id:"I" as const,statementRuleId:triple.statementI.id,statementFamily:triple.statementI.family,text:triple.statementI.text}),
      Object.freeze({id:"II" as const,statementRuleId:triple.statementII.id,statementFamily:triple.statementII.family,text:triple.statementII.text}),
      Object.freeze({id:"III" as const,statementRuleId:triple.statementIII.id,statementFamily:triple.statementIII.family,text:triple.statementIII.text}),
    ] as const),
    options,
    correctIndex,
    canonicalAnswer:triple.semanticKey,
    semanticKey:triple.semanticKey,
    explanation:explanation(problem,triple),
    proof:Object.freeze({
      baseWorldCount:triple.evaluation.base.worldCount,
      subsetEvaluations:triple.evaluation.subsetEvaluations.map(entry=>Object.freeze({
        statementIds:entry.statementIds,
        worldCount:entry.result.worldCount,
        sufficient:entry.result.sufficient,
        normalizedTargetAnswers:entry.result.normalizedTargetAnswers,
      })),
      minimalSufficientSets:triple.evaluation.minimalSufficientSets,
      allThreeWorldCount:triple.evaluation.allThree.worldCount,
      allThreeSufficient:triple.evaluation.allThree.sufficient,
      semanticKey:triple.semanticKey,
    }),
    sourceAncestry:["RNK-001","RNK-CP-001","solveCp001Canonical"] as const,
    generationIdentity,
    lifecycle:Object.freeze({
      contentStatus:"CP021_QL002_RANKING_BATCH_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable:false as const,
      questionBankWritable:false as const,
      testEligible:false as const,
      mockTestEligible:false as const,
      publiclyPublishable:false as const,
      automaticStudentPublication:false as const,
    }),
  });
}

export function generateDsfCp021RankingBatch(seed:string,count=20){
  const safe=Math.min(40,Math.max(1,Math.floor(count)));
  return Object.freeze(Array.from({length:safe},(_,i)=>generateDsfCp021RankingQuestion(`${seed}:${i}`)));
}
