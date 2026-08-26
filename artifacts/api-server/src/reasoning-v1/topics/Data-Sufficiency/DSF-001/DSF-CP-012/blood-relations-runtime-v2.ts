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
  clueToNormalizedText,
  graphFromClues,
  solveRelationFromGraph,
} from "../../../Blood-Relations/BLR-001/foundation/graph-closure.ts";
import type {
  BlrGender,
  BlrRelationId,
  DirectRelationClue,
  DirectRelationId,
  FamilyGraph,
} from "../../../Blood-Relations/BLR-001/foundation/types.ts";

export const DSF_CP012_BLOOD_RUNTIME_VERSION = "DSF_CP012_BLOOD_RUNTIME_V2" as const;
export const DSF_CP012_BLOOD_SOLVE_MODES = [
  "DSF-SM-BLR-P-TO-Q-RELATION",
  "DSF-SM-BLR-Q-TO-P-RELATION",
] as const;

export type DsfCp012BloodSolveMode = (typeof DSF_CP012_BLOOD_SOLVE_MODES)[number];
type Difficulty = "Easy" | "Medium" | "Hard";
type ContextId = "FAMILY_TREE" | "FAMILY_GATHERING" | "HOUSEHOLD_RECORD" | "RELATION_CHAIN" | "PEDIGREE_NOTE" | "KINSHIP_RECORD";
type LinkOrientation = "P_TO_X" | "X_TO_P" | "X_TO_Q" | "Q_TO_X";
type DirectCategory = "PARENT" | "CHILD" | "SIBLING" | "SPOUSE";
type StatementFamily =
  | "TARGET_EXACT"
  | "REVERSE_TARGET_EXACT"
  | "FIRST_CLUE_EXACT"
  | "SECOND_CLUE_EXACT"
  | "CHAIN_EXACT"
  | "P_GENDER"
  | "X_GENDER"
  | "Q_GENDER"
  | "FIRST_CATEGORY"
  | "SECOND_CATEGORY"
  | "FIRST_ORIENTATION"
  | "SECOND_ORIENTATION"
  | "FIRST_IS_BLOOD"
  | "SECOND_IS_BLOOD";

type BloodWorld = Readonly<{
  firstOrientation: "P_TO_X" | "X_TO_P";
  secondOrientation: "X_TO_Q" | "Q_TO_X";
  firstRelation: DirectRelationId;
  secondRelation: DirectRelationId;
  firstClue: DirectRelationClue;
  secondClue: DirectRelationClue;
  firstKey: string;
  secondKey: string;
  graph: FamilyGraph;
  pToQ: BlrRelationId;
  qToP: BlrRelationId;
  pGender: BlrGender;
  xGender: BlrGender;
  qGender: BlrGender;
}>;

type BloodProblem = Readonly<{
  solveMode: DsfCp012BloodSolveMode;
  anchor: BloodWorld;
  contextId: ContextId;
  intro: string;
}>;

type BloodStatement = Readonly<{
  id: string;
  family: StatementFamily;
  complexity: 1 | 2 | 3;
  text: string;
  test: (world: BloodWorld) => boolean;
}>;

type Pair = Readonly<{
  statementI: BloodStatement;
  statementII: BloodStatement;
  evaluation: TwoStatementSufficiencyEvaluation<string>;
  quality: number;
}>;

const DIRECT_RELATIONS: readonly DirectRelationId[] = [
  "FATHER", "MOTHER", "SON", "DAUGHTER", "BROTHER", "SISTER", "HUSBAND", "WIFE",
];
const FIRST_ORIENTATIONS = ["P_TO_X", "X_TO_P"] as const;
const SECOND_ORIENTATIONS = ["X_TO_Q", "Q_TO_X"] as const;
const PERSON_NAMES = Object.freeze({ P: "P", X: "X", Q: "Q" });

const CONTEXTS = [
  { id: "FAMILY_TREE" as const, intros: ["Three members P, X and Q occur in a family tree.", "Consider three people P, X and Q in one family tree.", "A three-person kinship chain P-X-Q is being analysed.", "The exact relationship between two people in a three-member family chain must be determined."] },
  { id: "FAMILY_GATHERING" as const, intros: ["At a family gathering, P and Q are connected through X.", "Consider relatives P, X and Q at a family gathering.", "A kinship chain among P, X and Q is under review.", "The exact family relationship between P and Q must be identified from information about X."] },
  { id: "HOUSEHOLD_RECORD" as const, intros: ["A household relation record contains people P, X and Q.", "Consider a family record involving P, X and Q.", "A household kinship record P-X-Q is being analysed.", "The relation between P and Q must be recovered from a three-person household record."] },
  { id: "RELATION_CHAIN" as const, intros: ["P and Q are linked through X in a two-edge family relation chain.", "Consider the family chain P-X-Q.", "A two-link kinship chain involving P, X and Q is being analysed.", "The final relation in the family chain P-X-Q must be determined."] },
  { id: "PEDIGREE_NOTE" as const, intros: ["A pedigree note refers to P, X and Q.", "Consider a pedigree fragment containing P, X and Q.", "A three-person pedigree fragment is being analysed.", "The exact relationship between P and Q in a pedigree fragment must be determined."] },
  { id: "KINSHIP_RECORD" as const, intros: ["A kinship record contains a chain from P through X to Q.", "Consider a kinship record for P, X and Q.", "A three-member kinship record is under review.", "The relation between P and Q must be determined from a two-link kinship record."] },
] as const;

function category(relation: DirectRelationId): DirectCategory {
  if (relation === "FATHER" || relation === "MOTHER") return "PARENT";
  if (relation === "SON" || relation === "DAUGHTER") return "CHILD";
  if (relation === "BROTHER" || relation === "SISTER") return "SIBLING";
  return "SPOUSE";
}

function isBlood(relation: DirectRelationId): boolean {
  return category(relation) !== "SPOUSE";
}

function personGender(graph: FamilyGraph, id: "P" | "X" | "Q"): BlrGender {
  return graph.persons.find((person) => person.personId === id)?.gender ?? "UNKNOWN";
}

function clueForFirst(orientation: "P_TO_X" | "X_TO_P", relationId: DirectRelationId): DirectRelationClue {
  return orientation === "P_TO_X"
    ? { subjectId: "P", relationId, referenceId: "X" }
    : { subjectId: "X", relationId, referenceId: "P" };
}

function clueForSecond(orientation: "X_TO_Q" | "Q_TO_X", relationId: DirectRelationId): DirectRelationClue {
  return orientation === "X_TO_Q"
    ? { subjectId: "X", relationId, referenceId: "Q" }
    : { subjectId: "Q", relationId, referenceId: "X" };
}

function clueKey(clue: DirectRelationClue): string {
  return `${clue.subjectId}:${clue.relationId}:${clue.referenceId}`;
}

function enumerateWorlds(): readonly BloodWorld[] {
  const worlds: BloodWorld[] = [];
  const seen = new Set<string>();
  for (const firstOrientation of FIRST_ORIENTATIONS) {
    for (const secondOrientation of SECOND_ORIENTATIONS) {
      for (const firstRelation of DIRECT_RELATIONS) {
        for (const secondRelation of DIRECT_RELATIONS) {
          const firstClue = clueForFirst(firstOrientation, firstRelation);
          const secondClue = clueForSecond(secondOrientation, secondRelation);
          try {
            const graph = graphFromClues([firstClue, secondClue], PERSON_NAMES, ["P", "X", "Q"]);
            const pToQ = solveRelationFromGraph(graph, "P", "Q").relationId;
            const qToP = solveRelationFromGraph(graph, "Q", "P").relationId;
            const firstKey = clueKey(firstClue);
            const secondKey = clueKey(secondClue);
            const identity = `${firstKey}|${secondKey}|${pToQ}|${qToP}`;
            if (seen.has(identity)) continue;
            seen.add(identity);
            worlds.push(Object.freeze({
              firstOrientation,
              secondOrientation,
              firstRelation,
              secondRelation,
              firstClue,
              secondClue,
              firstKey,
              secondKey,
              graph,
              pToQ,
              qToP,
              pGender: personGender(graph, "P"),
              xGender: personGender(graph, "X"),
              qGender: personGender(graph, "Q"),
            }));
          } catch {
            // BLR source validity and ambiguity rules own membership in this finite domain.
          }
        }
      }
    }
  }
  if (worlds.length < 24) throw new Error(`BLR V2 source universe unexpectedly thin: ${worlds.length} valid worlds`);
  return Object.freeze(worlds);
}

const BLOOD_WORLDS = enumerateWorlds();
export const DSF_CP012_BLOOD_BASE_WORLD_COUNT = BLOOD_WORLDS.length;

function targetAnswer(mode: DsfCp012BloodSolveMode, world: BloodWorld): string {
  return mode === "DSF-SM-BLR-P-TO-Q-RELATION" ? world.pToQ : world.qToP;
}

function reverseTargetAnswer(mode: DsfCp012BloodSolveMode, world: BloodWorld): string {
  return mode === "DSF-SM-BLR-P-TO-Q-RELATION" ? world.qToP : world.pToQ;
}

const adapter = {
  adapterId: "DSF-CP012-BLR-001-SOURCE-BOUND-V2",
  domainFamily: "REASONING" as const,
  sourceChapterId: "BLR-001",
  enumerateBaseWorlds: (_problem: BloodProblem) => BLOOD_WORLDS,
  statementHolds: (_problem: BloodProblem, world: BloodWorld, statement: BloodStatement) => statement.test(world),
  evaluateTarget: (problem: BloodProblem, world: BloodWorld) => targetAnswer(problem.solveMode, world),
  normalizeAnswer: (answer: string) => answer,
};

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  for (const character of `${DSF_CP012_BLOOD_RUNTIME_VERSION}:${seed}:${salt}`) {
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
  if (!values.length) throw new Error("CP012 Blood Relations V2 cannot pick from an empty set");
  return values[Math.floor(random() * values.length)]!;
}

function modeForSeed(seed: number): DsfCp012BloodSolveMode {
  return DSF_CP012_BLOOD_SOLVE_MODES[Math.abs(seed) % DSF_CP012_BLOOD_SOLVE_MODES.length]!;
}

function classForSeed(seed: number): SufficiencyClass {
  const block = Math.floor(Math.abs(seed) / DSF_CP012_BLOOD_SOLVE_MODES.length);
  return SUFFICIENCY_CLASSES[block % SUFFICIENCY_CLASSES.length]!;
}

function statement(id: string, family: StatementFamily, complexity: 1 | 2 | 3, text: string, test: (world: BloodWorld) => boolean): BloodStatement {
  return { id, family, complexity, text, test };
}

function relationText(relation: string): string {
  return relation.toLowerCase().replaceAll("_", " ");
}

function targetLabel(mode: DsfCp012BloodSolveMode): string {
  return mode === "DSF-SM-BLR-P-TO-Q-RELATION" ? "P's exact relation to Q" : "Q's exact relation to P";
}

function promptFor(mode: DsfCp012BloodSolveMode): string {
  return mode === "DSF-SM-BLR-P-TO-Q-RELATION" ? "How is P related to Q?" : "How is Q related to P?";
}

function genderStatementText(person: string, gender: BlrGender): string {
  return gender === "UNKNOWN" ? `The gender of ${person} is not fixed by the available direct-relation wording.` : `${person} is ${gender === "MALE" ? "male" : "female"}.`;
}

function buildStatementPool(problem: BloodProblem): readonly BloodStatement[] {
  const a = problem.anchor;
  const target = targetAnswer(problem.solveMode, a);
  const reverseTarget = reverseTargetAnswer(problem.solveMode, a);
  const firstText = clueToNormalizedText(a.firstClue, PERSON_NAMES);
  const secondText = clueToNormalizedText(a.secondClue, PERSON_NAMES);
  const targetSubject = problem.solveMode === "DSF-SM-BLR-P-TO-Q-RELATION" ? "P" : "Q";
  const targetReference = problem.solveMode === "DSF-SM-BLR-P-TO-Q-RELATION" ? "Q" : "P";
  return [
    statement(`TARGET_${target}`, "TARGET_EXACT", 1, `${targetSubject} is the ${relationText(target)} of ${targetReference}.`, (w) => targetAnswer(problem.solveMode, w) === target),
    statement(`REVERSE_TARGET_${reverseTarget}`, "REVERSE_TARGET_EXACT", 1, `${targetReference} is the ${relationText(reverseTarget)} of ${targetSubject}.`, (w) => reverseTargetAnswer(problem.solveMode, w) === reverseTarget),
    statement(`FIRST_${a.firstKey}`, "FIRST_CLUE_EXACT", 1, firstText, (w) => w.firstKey === a.firstKey),
    statement(`SECOND_${a.secondKey}`, "SECOND_CLUE_EXACT", 1, secondText, (w) => w.secondKey === a.secondKey),
    statement(`CHAIN_${a.firstKey}_${a.secondKey}`, "CHAIN_EXACT", 3, `${firstText} ${secondText}`, (w) => w.firstKey === a.firstKey && w.secondKey === a.secondKey),
    statement(`PG_${a.pGender}`, "P_GENDER", 2, genderStatementText("P", a.pGender), (w) => w.pGender === a.pGender),
    statement(`XG_${a.xGender}`, "X_GENDER", 2, genderStatementText("X", a.xGender), (w) => w.xGender === a.xGender),
    statement(`QG_${a.qGender}`, "Q_GENDER", 2, genderStatementText("Q", a.qGender), (w) => w.qGender === a.qGender),
    statement(`FC_${category(a.firstRelation)}`, "FIRST_CATEGORY", 2, `The stated P-X clue is a ${category(a.firstRelation).toLowerCase()}-type relation.`, (w) => category(w.firstRelation) === category(a.firstRelation)),
    statement(`SC_${category(a.secondRelation)}`, "SECOND_CATEGORY", 2, `The stated X-Q clue is a ${category(a.secondRelation).toLowerCase()}-type relation.`, (w) => category(w.secondRelation) === category(a.secondRelation)),
    statement(`FO_${a.firstOrientation}`, "FIRST_ORIENTATION", 2, `The P-X clue is stated with ${a.firstClue.subjectId} as the subject and ${a.firstClue.referenceId} as the reference person.`, (w) => w.firstOrientation === a.firstOrientation),
    statement(`SO_${a.secondOrientation}`, "SECOND_ORIENTATION", 2, `The X-Q clue is stated with ${a.secondClue.subjectId} as the subject and ${a.secondClue.referenceId} as the reference person.`, (w) => w.secondOrientation === a.secondOrientation),
    statement(`FB_${isBlood(a.firstRelation)}`, "FIRST_IS_BLOOD", 2, `The P-X link is ${isBlood(a.firstRelation) ? "a blood relation" : "a spouse relation"}.`, (w) => isBlood(w.firstRelation) === isBlood(a.firstRelation)),
    statement(`SB_${isBlood(a.secondRelation)}`, "SECOND_IS_BLOOD", 2, `The X-Q link is ${isBlood(a.secondRelation) ? "a blood relation" : "a spouse relation"}.`, (w) => isBlood(w.secondRelation) === isBlood(a.secondRelation)),
  ];
}

function pairQuality(first: BloodStatement, second: BloodStatement, evaluation: TwoStatementSufficiencyEvaluation<string>): number {
  let score = first.family === second.family ? -8 : 6;
  if (evaluation.classification === "BOTH_TOGETHER_ONLY") score += 14;
  if (evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") score += 6;
  if (first.family.includes("CLUE") || second.family.includes("CLUE")) score += 2;
  score += Math.min(8, Math.floor((evaluation.statementI.worldCount + evaluation.statementII.worldCount) / 12));
  score -= first.complexity + second.complexity;
  return score;
}

function synthesizePair(problem: BloodProblem, seed: number, desiredClass: SufficiencyClass): Pair {
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
        // Inconsistent conjunctions are invalid DS evidence pairs.
      }
    }
  }
  if (!candidates.length) throw new Error(`CP012 Blood V2 cannot synthesize ${desiredClass} for ${problem.solveMode}`);
  candidates.sort((a, b) => b.quality - a.quality || a.statementI.id.localeCompare(b.statementI.id) || a.statementII.id.localeCompare(b.statementII.id));
  const best = candidates[0]!.quality;
  const top = candidates.filter((candidate) => candidate.quality >= best - 2);
  return pick(createRng(seed, `pair:${desiredClass}`), top);
}

function difficultyFor(pair: Pair): Difficulty {
  if (pair.evaluation.classification === "EACH_STATEMENT_ALONE") return "Easy";
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  return pair.statementI.complexity + pair.statementII.complexity <= 3 ? "Easy" : "Medium";
}

function counterexampleText(problem: BloodProblem, worlds: readonly BloodWorld[]): string {
  const byAnswer = new Map<string, BloodWorld>();
  for (const world of worlds) {
    const answer = targetAnswer(problem.solveMode, world);
    if (!byAnswer.has(answer)) byAnswer.set(answer, world);
    if (byAnswer.size >= 2) break;
  }
  const entries = [...byAnswer.entries()];
  return entries.length >= 2
    ? `For example, the surviving family chains can still make the answer ${relationText(entries[0]![0])} or ${relationText(entries[1]![0])}.`
    : "The surviving family chains do not yet force one exact relation.";
}

function explanationFor(problem: BloodProblem, pair: Pair): string {
  const e = pair.evaluation;
  const base = adapter.enumerateBaseWorlds(problem);
  const worldsI = base.filter((w) => pair.statementI.test(w));
  const worldsII = base.filter((w) => pair.statementII.test(w));
  const worldsTogether = base.filter((w) => pair.statementI.test(w) && pair.statementII.test(w));
  const line = (label: string, sufficient: boolean, worlds: readonly BloodWorld[]) => sufficient
    ? `${label} is sufficient: all ${worlds.length} valid source family chains give the same exact relation.`
    : `${label} is not sufficient. ${counterexampleText(problem, worlds)}`;
  return [
    `We need to determine ${targetLabel(problem.solveMode)}.`,
    line("Statement I", e.statementI.sufficient, worldsI),
    line("Statement II", e.statementII.sufficient, worldsII),
    line("Together", e.together.sufficient, worldsTogether),
    `Hence the sufficiency class is ${e.classification}.`,
  ].join(" ");
}

function structuralFingerprint(problem: BloodProblem, pair: Pair): string {
  return [problem.solveMode, pair.evaluation.classification, pair.statementI.family, pair.statementII.family, problem.anchor.firstOrientation, problem.anchor.secondOrientation, problem.anchor.pToQ, problem.anchor.qToP].join("|");
}

function generationIdentity(seed: number, problem: BloodProblem, pair: Pair): string {
  return createHash("sha256").update([DSF_CP012_BLOOD_RUNTIME_VERSION, seed, problem.solveMode, problem.anchor.firstKey, problem.anchor.secondKey, pair.statementI.id, pair.statementII.id].join("|")).digest("hex");
}

export function normalizeDsfCp012BloodStem(stem: string): string {
  return stem.toLowerCase().replace(/\b\d+(?:\.\d+)?\b/g, "#").replace(/\s+/g, " ").trim();
}

export function generateDsfCp012BloodQuestion(seed: number) {
  const solveMode = modeForSeed(seed);
  const desiredClass = classForSeed(seed);
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const random = createRng(seed + attempt * 104729, `problem:${solveMode}`);
    const anchor = pick(random, BLOOD_WORLDS);
    const context = CONTEXTS[Math.abs(seed + attempt) % CONTEXTS.length]!;
    const intro = context.intros[Math.abs(seed * 3 + attempt) % context.intros.length]!;
    const problem: BloodProblem = { solveMode, anchor, contextId: context.id, intro };
    try {
      const pair = synthesizePair(problem, seed + attempt * 997, desiredClass);
      const options = DS_STANDARD_5_EN.map((option) => option.label);
      const correctOption = optionForClass("DS_STANDARD_5", desiredClass);
      const correctIndex = DS_STANDARD_5_EN.findIndex((option) => option.key === correctOption.key);
      const stem = `${intro} ${promptFor(solveMode)}\n\nStatement I: ${pair.statementI.text}\nStatement II: ${pair.statementII.text}`;
      return Object.freeze({
        runtimeVersion: DSF_CP012_BLOOD_RUNTIME_VERSION,
        sourceChapterId: "BLR-001" as const,
        sourceSolver: "BLR-001/foundation/graph-closure::solveRelationFromGraph" as const,
        sourceWorldCount: BLOOD_WORLDS.length,
        seed,
        solveMode,
        targetKind: solveMode === "DSF-SM-BLR-P-TO-Q-RELATION" ? "P_TO_Q_RELATION" as const : "Q_TO_P_RELATION" as const,
        contextId: context.id,
        difficulty: difficultyFor(pair),
        stem,
        options,
        correctIndex,
        correctClass: desiredClass,
        statementI: pair.statementI.text,
        statementII: pair.statementII.text,
        statementIFamily: pair.statementI.family,
        statementIIFamily: pair.statementII.family,
        evaluation: pair.evaluation,
        explanation: explanationFor(problem, pair),
        generationIdentity: generationIdentity(seed, problem, pair),
        studentSurfaceFingerprint: structuralFingerprint(problem, pair),
        lifecycle: Object.freeze({
          contentStatus: "CP012_REASONING_REVIEW_CANDIDATE" as const,
          questionStudioDiscoverable: false as const,
          questionBankWritable: false as const,
          testEligible: false as const,
          mockTestEligible: false as const,
          publiclyPublishable: false as const,
        }),
      });
    } catch {
      // Retry with another valid BLR anchor if this exact world cannot realize the requested class.
    }
  }
  throw new Error(`CP012 Blood V2 failed to generate seed ${seed} for ${desiredClass}`);
}
