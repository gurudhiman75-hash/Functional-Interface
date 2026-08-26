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

export const DSF_CP012_BLOOD_RUNTIME_VERSION = "DSF_CP012_BLOOD_RUNTIME_V1" as const;
export const DSF_CP012_BLOOD_SOLVE_MODES = [
  "DSF-SM-BLR-P-TO-Q-RELATION",
  "DSF-SM-BLR-Q-TO-P-RELATION",
] as const;

export type DsfCp012BloodSolveMode = (typeof DSF_CP012_BLOOD_SOLVE_MODES)[number];
type Difficulty = "Easy" | "Medium" | "Hard";
type ContextId = "FAMILY_TREE" | "FAMILY_GATHERING" | "HOUSEHOLD_RECORD" | "RELATION_CHAIN" | "PEDIGREE_NOTE" | "KINSHIP_RECORD";
type DirectCategory = "PARENT" | "CHILD" | "SIBLING" | "SPOUSE";
type GenerationDirection = "ABOVE" | "BELOW" | "SAME";
type StatementFamily =
  | "TARGET_EXACT"
  | "FIRST_CLUE_EXACT"
  | "SECOND_CLUE_EXACT"
  | "BOTH_CLUES_EXACT"
  | "P_GENDER"
  | "X_GENDER"
  | "Q_GENDER"
  | "FIRST_CATEGORY"
  | "SECOND_CATEGORY"
  | "FIRST_GENERATION_DIRECTION"
  | "SECOND_GENERATION_DIRECTION"
  | "FIRST_IS_BLOOD"
  | "SECOND_IS_BLOOD";

type BloodWorld = Readonly<{
  firstRelation: DirectRelationId;
  secondRelation: DirectRelationId;
  firstClue: DirectRelationClue;
  secondClue: DirectRelationClue;
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

function generationDirection(relation: DirectRelationId): GenerationDirection {
  if (category(relation) === "PARENT") return "ABOVE";
  if (category(relation) === "CHILD") return "BELOW";
  return "SAME";
}

function isBlood(relation: DirectRelationId): boolean {
  return category(relation) !== "SPOUSE";
}

function personGender(graph: FamilyGraph, id: "P" | "X" | "Q"): BlrGender {
  return graph.persons.find((person) => person.personId === id)?.gender ?? "UNKNOWN";
}

function enumerateWorlds(): readonly BloodWorld[] {
  const worlds: BloodWorld[] = [];
  for (const firstRelation of DIRECT_RELATIONS) {
    for (const secondRelation of DIRECT_RELATIONS) {
      const firstClue: DirectRelationClue = { subjectId: "P", relationId: firstRelation, referenceId: "X" };
      const secondClue: DirectRelationClue = { subjectId: "X", relationId: secondRelation, referenceId: "Q" };
      try {
        const graph = graphFromClues([firstClue, secondClue], PERSON_NAMES, ["P", "X", "Q"]);
        const pToQ = solveRelationFromGraph(graph, "P", "Q").relationId;
        const qToP = solveRelationFromGraph(graph, "Q", "P").relationId;
        worlds.push(Object.freeze({
          firstRelation,
          secondRelation,
          firstClue,
          secondClue,
          graph,
          pToQ,
          qToP,
          pGender: personGender(graph, "P"),
          xGender: personGender(graph, "X"),
          qGender: personGender(graph, "Q"),
        }));
      } catch {
        // Invalid, unsupported or ambiguous BLR chains are outside the finite source domain.
      }
    }
  }
  if (worlds.length < 12) throw new Error(`BLR source universe unexpectedly thin: ${worlds.length} valid worlds`);
  return Object.freeze(worlds);
}

const BLOOD_WORLDS = enumerateWorlds();
export const DSF_CP012_BLOOD_BASE_WORLD_COUNT = BLOOD_WORLDS.length;

function targetAnswer(mode: DsfCp012BloodSolveMode, world: BloodWorld): string {
  return mode === "DSF-SM-BLR-P-TO-Q-RELATION" ? world.pToQ : world.qToP;
}

const adapter = {
  adapterId: "DSF-CP012-BLR-001-SOURCE-BOUND-V1",
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
  if (!values.length) throw new Error("CP012 Blood Relations cannot pick from an empty set");
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
  if (gender === "UNKNOWN") return `The gender of ${person} is not specified by the direct relation wording.`;
  return `${person} is ${gender === "MALE" ? "male" : "female"}.`;
}

function buildStatementPool(problem: BloodProblem): readonly BloodStatement[] {
  const a = problem.anchor;
  const target = targetAnswer(problem.solveMode, a);
  const firstText = clueToNormalizedText(a.firstClue, PERSON_NAMES);
  const secondText = clueToNormalizedText(a.secondClue, PERSON_NAMES);

  return [
    statement(`TARGET_${target}`, "TARGET_EXACT", 1, `The exact answer is that ${problem.solveMode === "DSF-SM-BLR-P-TO-Q-RELATION" ? "P" : "Q"} is the ${relationText(target)} of ${problem.solveMode === "DSF-SM-BLR-P-TO-Q-RELATION" ? "Q" : "P"}.`, (w) => targetAnswer(problem.solveMode, w) === target),
    statement(`FIRST_${a.firstRelation}`, "FIRST_CLUE_EXACT", 1, firstText, (w) => w.firstRelation === a.firstRelation),
    statement(`SECOND_${a.secondRelation}`, "SECOND_CLUE_EXACT", 1, secondText, (w) => w.secondRelation === a.secondRelation),
    statement(`BOTH_${a.firstRelation}_${a.secondRelation}`, "BOTH_CLUES_EXACT", 3, `${firstText} ${secondText}`, (w) => w.firstRelation === a.firstRelation && w.secondRelation === a.secondRelation),
    statement(`PG_${a.pGender}`, "P_GENDER", 2, genderStatementText("P", a.pGender), (w) => w.pGender === a.pGender),
    statement(`XG_${a.xGender}`, "X_GENDER", 2, genderStatementText("X", a.xGender), (w) => w.xGender === a.xGender),
    statement(`QG_${a.qGender}`, "Q_GENDER", 2, genderStatementText("Q", a.qGender), (w) => w.qGender === a.qGender),
    statement(`FC_${category(a.firstRelation)}`, "FIRST_CATEGORY", 2, `P is related to X as a ${category(a.firstRelation).toLowerCase()}, but the exact gender-specific label is not stated.`, (w) => category(w.firstRelation) === category(a.firstRelation)),
    statement(`SC_${category(a.secondRelation)}`, "SECOND_CATEGORY", 2, `X is related to Q as a ${category(a.secondRelation).toLowerCase()}, but the exact gender-specific label is not stated.`, (w) => category(w.secondRelation) === category(a.secondRelation)),
    statement(`FG_${generationDirection(a.firstRelation)}`, "FIRST_GENERATION_DIRECTION", 2, `Relative to X, P is in the ${generationDirection(a.firstRelation) === "ABOVE" ? "older" : generationDirection(a.firstRelation) === "BELOW" ? "younger" : "same"} generation.`, (w) => generationDirection(w.firstRelation) === generationDirection(a.firstRelation)),
    statement(`SG_${generationDirection(a.secondRelation)}`, "SECOND_GENERATION_DIRECTION", 2, `Relative to Q, X is in the ${generationDirection(a.secondRelation) === "ABOVE" ? "older" : generationDirection(a.secondRelation) === "BELOW" ? "younger" : "same"} generation.`, (w) => generationDirection(w.secondRelation) === generationDirection(a.secondRelation)),
    statement(`FB_${isBlood(a.firstRelation)}`, "FIRST_IS_BLOOD", 2, `The P-X link is ${isBlood(a.firstRelation) ? "a blood relation" : "a spouse relation"}.`, (w) => isBlood(w.firstRelation) === isBlood(a.firstRelation)),
    statement(`SB_${isBlood(a.secondRelation)}`, "SECOND_IS_BLOOD", 2, `The X-Q link is ${isBlood(a.secondRelation) ? "a blood relation" : "a spouse relation"}.`, (w) => isBlood(w.secondRelation) === isBlood(a.secondRelation)),
  ];
}

function pairQuality(first: BloodStatement, second: BloodStatement, evaluation: TwoStatementSufficiencyEvaluation<string>): number {
  let score = first.family === second.family ? -8 : 6;
  if (evaluation.classification === "BOTH_TOGETHER_ONLY") score += 12;
  if (evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") score += 4;
  score += Math.min(6, Math.floor((evaluation.statementI.worldCount + evaluation.statementII.worldCount) / 8));
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
        // Reject inconsistent conjunctions.
      }
    }
  }
  if (!candidates.length) throw new Error(`No BLR-001 pair for ${problem.solveMode}/${desiredClass}`);
  const best = Math.max(...candidates.map((candidate) => candidate.quality));
  const shortlist = candidates.filter((candidate) => candidate.quality >= best - 2);
  return pick(createRng(seed, `pair:${problem.solveMode}:${desiredClass}`), shortlist);
}

function buildProblem(seed: number, attempt: number): BloodProblem {
  const solveMode = modeForSeed(seed);
  const random = createRng(seed + attempt * 65537, `problem:${solveMode}`);
  const context = pick(random, CONTEXTS);
  return { solveMode, anchor: pick(random, BLOOD_WORLDS), contextId: context.id, intro: pick(random, context.intros) };
}

function difficultyFor(pair: Pair): Difficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  if (pair.statementI.complexity === 1 && pair.statementII.complexity === 1) return "Easy";
  return "Medium";
}

function explanationFor(label: string, answers: readonly string[], sufficient: boolean): string {
  if (sufficient) return `${label} fixes the exact kinship as ${relationText(answers[0]!)}. Therefore it is sufficient alone.`;
  if (answers.length >= 2) return `${label} permits different kinships, for example ${relationText(answers[0]!)} and ${relationText(answers[1]!)}. Therefore it is not sufficient alone.`;
  return `${label} does not fix one unique kinship. Therefore it is not sufficient alone.`;
}

function normalizeSurface(text: string): string {
  return text.toLowerCase().replace(/[^a-z]+/g, " ").trim().replace(/\s+/g, " ");
}

export function normalizeDsfCp012BloodSurface(text: string): string {
  return normalizeSurface(text);
}

export function generateDsfCp012BloodQuestion(seed: number) {
  const desiredClass = classForSeed(seed);
  let problem: BloodProblem | undefined;
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
  if (!problem || !pair) throw lastError instanceof Error ? lastError : new Error(`Unable to synthesize CP012 Blood Relations DS seed ${seed}`);

  const prompt = promptFor(problem.solveMode);
  const stem = `${problem.intro} P and Q are connected through X by two direct family links. ${prompt}`;
  const evaluation = pair.evaluation;
  const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
  const together = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? evaluation.together.sufficient
      ? `Together, the two statements fix the exact kinship as ${relationText(evaluation.together.normalizedTargetAnswers[0]!)}. Therefore the combination is sufficient.`
      : `Even together, the statements allow different kinships such as ${evaluation.together.normalizedTargetAnswers.slice(0, 2).map(relationText).join(" and ")}. Therefore the combination is insufficient.`
    : undefined;

  const generationIdentity = createHash("sha256")
    .update(`${DSF_CP012_BLOOD_RUNTIME_VERSION}|${seed}|${problem.solveMode}|${problem.contextId}|${pair.statementI.id}|${pair.statementII.id}`)
    .digest("hex")
    .slice(0, 24);

  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-012" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP012_BLOOD_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficultyFor(pair),
    domainFamily: "REASONING" as const,
    sourceChapterId: "BLR-001" as const,
    sourceCapabilities: ["BLR-001/foundation/graph-closure::graphFromClues", "BLR-001/foundation/graph-closure::solveRelationFromGraph"] as const,
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
      askedTarget: `We need to determine ${targetLabel(problem.solveMode)}.`,
      statementI: explanationFor("Statement I", evaluation.statementI.normalizedTargetAnswers, evaluation.statementI.sufficient),
      statementII: explanationFor("Statement II", evaluation.statementII.normalizedTargetAnswers, evaluation.statementII.sufficient),
      ...(together ? { together } : {}),
      conclusion: correct.text,
    },
    proof: {
      baseWorldCount: BLOOD_WORLDS.length,
      statementIWorldCount: evaluation.statementI.worldCount,
      statementIIWorldCount: evaluation.statementII.worldCount,
      togetherWorldCount: evaluation.together.worldCount,
      statementITargetAnswers: evaluation.statementI.normalizedTargetAnswers,
      statementIITargetAnswers: evaluation.statementII.normalizedTargetAnswers,
      togetherTargetAnswers: evaluation.together.normalizedTargetAnswers,
      minimalSufficientSets: evaluation.minimalSufficientSets,
    },
    sourceAncestry: ["BLR-001", "BLR-CP-001", "graph-closure", "solveRelationFromGraph"] as const,
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

export function generateDsfCp012BloodBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp012BloodQuestion);
}
