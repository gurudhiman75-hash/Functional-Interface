import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import { evaluateConstraint } from "../../../SeatingArrangement/SEA-001/constraints/evaluate.ts";
import { LinearTopology } from "../../../SeatingArrangement/SEA-001/topology/linear.ts";
import { solveLinear } from "../../../SeatingArrangement/SEA-001/solver/production-solver.ts";
import { enumerateLinearOracle } from "../../../SeatingArrangement/SEA-001/solver/independent-oracle.ts";
import type {
  FacingDirection,
  LinearConstraint,
  PersonId,
  SolverModel,
} from "../../../SeatingArrangement/SEA-001/types.ts";

export const DSF_CP013_SEATING_RUNTIME_VERSION = "DSF_CP013_SEATING_RUNTIME_V1" as const;
export const DSF_CP013_SEATING_SOLVE_MODES = [
  "DSF-SM-SEA-MIDDLE-OCCUPANT",
  "DSF-SM-SEA-AMAN-POSITION",
  "DSF-SM-SEA-COUNT-BETWEEN-AMAN-BINA",
  "DSF-SM-SEA-CHARAN-RELATIVE-TO-DIYA",
] as const;

export type DsfCp013SeatingSolveMode = (typeof DSF_CP013_SEATING_SOLVE_MODES)[number];
type Difficulty = "Easy" | "Medium" | "Hard";
type ContextId =
  | "TRAINING_ROW"
  | "SEMINAR_ROW"
  | "WAITING_BENCH"
  | "INTERVIEW_ROW"
  | "BRIEFING_ROW"
  | "CONFERENCE_ROW";
type StatementFamily =
  | "TARGET_EXACT"
  | "ABSOLUTE_SEAT"
  | "LEFT_END_POSITION"
  | "AT_END"
  | "AT_MIDDLE"
  | "ADJACENT"
  | "NOT_ADJACENT"
  | "EXACT_COUNT_BETWEEN"
  | "RELATIVE_POSITION";

type SeatingWorld = Readonly<{
  model: SolverModel;
  placement: ReadonlyMap<PersonId, number>;
}>;

type SeatingProblem = Readonly<{
  solveMode: DsfCp013SeatingSolveMode;
  facing: FacingDirection;
  anchor: SeatingWorld;
  contextId: ContextId;
  intro: string;
}>;

type SeatingStatement = Readonly<{
  id: string;
  family: StatementFamily;
  complexity: 1 | 2 | 3;
  text: string;
  test: (world: SeatingWorld) => boolean;
}>;

type Pair = Readonly<{
  statementI: SeatingStatement;
  statementII: SeatingStatement;
  evaluation: TwoStatementSufficiencyEvaluation<string | number>;
  quality: number;
}>;

const PEOPLE = ["Aman", "Bina", "Charan", "Diya", "Eshan"] as const;
const PERSON_IDS: readonly PersonId[] = PEOPLE;
const TOPOLOGY = new LinearTopology(PEOPLE.length);
const CANONICAL_PAIRS = [
  ["Aman", "Bina"],
  ["Aman", "Charan"],
  ["Bina", "Diya"],
  ["Charan", "Eshan"],
  ["Charan", "Diya"],
] as const;

const CONTEXTS = [
  { id: "TRAINING_ROW" as const, intros: ["Five trainees are seated in a straight row.", "A row of five trainees is being analysed.", "Five people attending a training session occupy one straight row.", "Consider a straight row of five trainees."] },
  { id: "SEMINAR_ROW" as const, intros: ["Five participants are seated in one straight seminar row.", "A seminar row contains five participants.", "Five seminar participants occupy consecutive seats in a straight row.", "Consider five people seated in a seminar row."] },
  { id: "WAITING_BENCH" as const, intros: ["Five people are seated in a straight line on a waiting bench.", "A waiting bench has five people seated in one row.", "Five visitors occupy consecutive places on a straight bench.", "Consider five people seated along one straight bench."] },
  { id: "INTERVIEW_ROW" as const, intros: ["Five candidates are seated in a straight row outside an interview room.", "An interview waiting row contains five candidates.", "Five candidates occupy one straight row before an interview.", "Consider a row of five interview candidates."] },
  { id: "BRIEFING_ROW" as const, intros: ["Five staff members are seated in a straight row for a briefing.", "A briefing row contains five staff members.", "Five people occupy one straight briefing row.", "Consider five staff members seated in one row."] },
  { id: "CONFERENCE_ROW" as const, intros: ["Five delegates are seated in a straight conference row.", "A conference row contains five delegates.", "Five delegates occupy consecutive places in a straight row.", "Consider five people seated in a conference row."] },
] as const;

function parityCheckedWorlds(facing: FacingDirection): readonly SeatingWorld[] {
  const production = solveLinear({ personIds: PERSON_IDS, facing, constraints: [] });
  if (production.truncated) throw new Error(`SEA-001 production solver unexpectedly truncated the empty-clue ${facing} universe.`);
  const oracle = enumerateLinearOracle({ personIds: PERSON_IDS, facing, constraints: [] });
  const productionKeys = production.models.map((model) => model.canonicalKey).sort();
  const oracleKeys = oracle.map((model) => model.canonicalKey).sort();
  if (productionKeys.length !== 120 || oracleKeys.length !== 120) {
    throw new Error(`SEA-001 five-person universe must contain 120 models per facing; production=${productionKeys.length}, oracle=${oracleKeys.length}.`);
  }
  if (productionKeys.join("|") !== oracleKeys.join("|")) {
    throw new Error(`SEA-001 production solver/oracle disagreement for ${facing}.`);
  }
  return Object.freeze(production.models.map((model) => Object.freeze({
    model,
    placement: new Map(model.seatOrder.map((personId, index) => [personId, index] as const)),
  })));
}

const WORLDS_BY_FACING: Readonly<Record<FacingDirection, readonly SeatingWorld[]>> = Object.freeze({
  NORTH: parityCheckedWorlds("NORTH"),
  SOUTH: parityCheckedWorlds("SOUTH"),
});

export const DSF_CP013_SEATING_WORLD_COUNTS = Object.freeze({ NORTH: 120, SOUTH: 120 });

function constraintHolds(world: SeatingWorld, constraint: LinearConstraint): boolean {
  return evaluateConstraint(constraint, world.placement, TOPOLOGY, world.model.facing) === "SATISFIED";
}

function seatOf(world: SeatingWorld, personId: PersonId): number {
  const seat = world.placement.get(personId);
  if (seat === undefined) throw new Error(`SEA-001 world is missing ${personId}.`);
  return seat;
}

function relativeAnswer(world: SeatingWorld, subjectId: PersonId, referenceId: PersonId): string {
  for (const direction of ["LEFT", "RIGHT"] as const) {
    for (let steps = 1; steps < PEOPLE.length; steps += 1) {
      const constraint: LinearConstraint = {
        id: `TARGET_REL_${subjectId}_${referenceId}_${direction}_${steps}`,
        kind: "RELATIVE_POSITION",
        subjectId,
        referenceId,
        direction,
        steps,
      };
      if (constraintHolds(world, constraint)) return `${direction}_${steps}`;
    }
  }
  throw new Error(`SEA-001 could not resolve the relation of ${subjectId} to ${referenceId}.`);
}

function targetAnswer(mode: DsfCp013SeatingSolveMode, world: SeatingWorld): string | number {
  switch (mode) {
    case "DSF-SM-SEA-MIDDLE-OCCUPANT":
      return world.model.seatOrder[2]!;
    case "DSF-SM-SEA-AMAN-POSITION":
      return seatOf(world, "Aman") + 1;
    case "DSF-SM-SEA-COUNT-BETWEEN-AMAN-BINA":
      return Math.abs(seatOf(world, "Aman") - seatOf(world, "Bina")) - 1;
    case "DSF-SM-SEA-CHARAN-RELATIVE-TO-DIYA":
      return relativeAnswer(world, "Charan", "Diya");
  }
}

const adapter = {
  adapterId: "DSF-CP013-SEA-001-LINEAR-SOURCE-BOUND-V1",
  domainFamily: "REASONING" as const,
  sourceChapterId: "SEA-001",
  enumerateBaseWorlds: (problem: SeatingProblem) => WORLDS_BY_FACING[problem.facing],
  statementHolds: (_problem: SeatingProblem, world: SeatingWorld, statement: SeatingStatement) => statement.test(world),
  evaluateTarget: (problem: SeatingProblem, world: SeatingWorld) => targetAnswer(problem.solveMode, world),
  normalizeAnswer: (answer: string | number) => String(answer),
};

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  for (const character of `${DSF_CP013_SEATING_RUNTIME_VERSION}:${seed}:${salt}`) {
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
  if (!values.length) throw new Error("CP013 Seating cannot pick from an empty set.");
  return values[Math.floor(random() * values.length)]!;
}

function modeForSeed(seed: number): DsfCp013SeatingSolveMode {
  return DSF_CP013_SEATING_SOLVE_MODES[Math.abs(seed) % DSF_CP013_SEATING_SOLVE_MODES.length]!;
}

function classForSeed(seed: number): SufficiencyClass {
  const block = Math.floor(Math.abs(seed) / DSF_CP013_SEATING_SOLVE_MODES.length);
  return SUFFICIENCY_CLASSES[block % SUFFICIENCY_CLASSES.length]!;
}

function statement(
  id: string,
  family: StatementFamily,
  complexity: 1 | 2 | 3,
  text: string,
  test: (world: SeatingWorld) => boolean,
): SeatingStatement {
  return { id, family, complexity, text, test };
}

function positionWord(index: number): string {
  return ["first", "second", "third", "fourth", "fifth"][index] ?? `${index + 1}th`;
}

function placesWord(steps: number): string {
  return steps === 1 ? "immediately" : `${steps} places`;
}

function targetPrompt(mode: DsfCp013SeatingSolveMode): string {
  switch (mode) {
    case "DSF-SM-SEA-MIDDLE-OCCUPANT": return "Who occupies the middle seat?";
    case "DSF-SM-SEA-AMAN-POSITION": return "What is Aman's position from the left end?";
    case "DSF-SM-SEA-COUNT-BETWEEN-AMAN-BINA": return "How many people sit between Aman and Bina?";
    case "DSF-SM-SEA-CHARAN-RELATIVE-TO-DIYA": return "What is Charan's exact position relative to Diya?";
  }
}

function targetLabel(mode: DsfCp013SeatingSolveMode): string {
  switch (mode) {
    case "DSF-SM-SEA-MIDDLE-OCCUPANT": return "the person in the middle seat";
    case "DSF-SM-SEA-AMAN-POSITION": return "Aman's exact seat position from the left end";
    case "DSF-SM-SEA-COUNT-BETWEEN-AMAN-BINA": return "the exact number of people between Aman and Bina";
    case "DSF-SM-SEA-CHARAN-RELATIVE-TO-DIYA": return "Charan's exact left/right position relative to Diya";
  }
}

function trueConstraintStatement(problem: SeatingProblem, constraint: LinearConstraint, family: StatementFamily, complexity: 1 | 2 | 3, text: string): SeatingStatement {
  if (!constraintHolds(problem.anchor, constraint)) throw new Error(`Attempted to emit a false SEA-001 source clue: ${constraint.id}`);
  return statement(constraint.id, family, complexity, text, (world) => constraintHolds(world, constraint));
}

function relationConstraint(problem: SeatingProblem, subjectId: PersonId, referenceId: PersonId): LinearConstraint {
  const answer = relativeAnswer(problem.anchor, subjectId, referenceId);
  const [direction, stepsText] = answer.split("_") as ["LEFT" | "RIGHT", string];
  return {
    id: `REL_${subjectId}_${referenceId}_${direction}_${stepsText}`,
    kind: "RELATIVE_POSITION",
    subjectId,
    referenceId,
    direction,
    steps: Number(stepsText),
  };
}

function buildStatementPool(problem: SeatingProblem): readonly SeatingStatement[] {
  const a = problem.anchor;
  const pool: SeatingStatement[] = [];

  for (const personId of PEOPLE) {
    const seatIndex = seatOf(a, personId);
    const absolute: LinearConstraint = { id: `ABS_${personId}_${seatIndex}`, kind: "ABSOLUTE_SEAT", personId, seatIndex };
    pool.push(trueConstraintStatement(problem, absolute, "ABSOLUTE_SEAT", 1, `${personId} occupies the ${positionWord(seatIndex)} seat from the left end.`));
    pool.push(statement(
      `LEFT_END_${personId}_${seatIndex}`,
      "LEFT_END_POSITION",
      1,
      `${seatIndex} ${seatIndex === 1 ? "person sits" : "people sit"} to the left of ${personId} when positions are counted from the left end.`,
      (world) => seatOf(world, personId) === seatIndex,
    ));
  }

  for (const personId of [a.model.seatOrder[0]!, a.model.seatOrder[4]!]) {
    const constraint: LinearConstraint = { id: `END_${personId}`, kind: "AT_END", personId };
    pool.push(trueConstraintStatement(problem, constraint, "AT_END", 2, `${personId} sits at one of the two ends.`));
  }

  const middlePerson = a.model.seatOrder[2]!;
  pool.push(trueConstraintStatement(problem, { id: `MID_${middlePerson}`, kind: "AT_MIDDLE", personId: middlePerson }, "AT_MIDDLE", 1, `${middlePerson} sits in the middle.`));

  for (let index = 0; index < PEOPLE.length - 1; index += 1) {
    const firstId = a.model.seatOrder[index]!;
    const secondId = a.model.seatOrder[index + 1]!;
    const constraint: LinearConstraint = { id: `ADJ_${firstId}_${secondId}`, kind: "ADJACENT", firstId, secondId };
    pool.push(trueConstraintStatement(problem, constraint, "ADJACENT", 2, `${firstId} and ${secondId} sit next to each other.`));
  }

  for (const [firstId, secondId] of CANONICAL_PAIRS) {
    const count = Math.abs(seatOf(a, firstId) - seatOf(a, secondId)) - 1;
    const between: LinearConstraint = { id: `BET_${firstId}_${secondId}_${count}`, kind: "EXACT_COUNT_BETWEEN", firstId, secondId, count };
    pool.push(trueConstraintStatement(problem, between, "EXACT_COUNT_BETWEEN", 2, `${count} ${count === 1 ? "person sits" : "people sit"} between ${firstId} and ${secondId}.`));
    if (count > 0) {
      const notAdjacent: LinearConstraint = { id: `NADJ_${firstId}_${secondId}`, kind: "NOT_ADJACENT", firstId, secondId };
      pool.push(trueConstraintStatement(problem, notAdjacent, "NOT_ADJACENT", 3, `${firstId} and ${secondId} are not adjacent.`));
    }
  }

  for (const [subjectId, referenceId] of [["Charan", "Diya"], ["Aman", "Bina"]] as const) {
    const direct = relationConstraint(problem, subjectId, referenceId);
    pool.push(trueConstraintStatement(problem, direct, "RELATIVE_POSITION", 1, `${subjectId} sits ${placesWord(direct.steps)} to the ${direct.direction.toLowerCase()} of ${referenceId}.`));
    const inverse = relationConstraint(problem, referenceId, subjectId);
    pool.push(trueConstraintStatement(problem, inverse, "RELATIVE_POSITION", 1, `${referenceId} sits ${placesWord(inverse.steps)} to the ${inverse.direction.toLowerCase()} of ${subjectId}.`));
  }

  const target = targetAnswer(problem.solveMode, a);
  pool.push(statement(
    `TARGET_${problem.solveMode}_${String(target)}`,
    "TARGET_EXACT",
    1,
    (() => {
      switch (problem.solveMode) {
        case "DSF-SM-SEA-MIDDLE-OCCUPANT": return `${String(target)} sits in the middle seat.`;
        case "DSF-SM-SEA-AMAN-POSITION": return `Aman is ${positionWord(Number(target) - 1)} from the left end.`;
        case "DSF-SM-SEA-COUNT-BETWEEN-AMAN-BINA": return `${String(target)} ${Number(target) === 1 ? "person sits" : "people sit"} between Aman and Bina.`;
        case "DSF-SM-SEA-CHARAN-RELATIVE-TO-DIYA": {
          const [direction, stepsText] = String(target).split("_");
          return `Charan sits ${placesWord(Number(stepsText))} to the ${direction!.toLowerCase()} of Diya.`;
        }
      }
    })(),
    (world) => targetAnswer(problem.solveMode, world) === target,
  ));

  return Object.freeze(pool);
}

function pairQuality(first: SeatingStatement, second: SeatingStatement, evaluation: TwoStatementSufficiencyEvaluation<string | number>): number {
  let score = first.family === second.family ? -8 : 7;
  if (evaluation.classification === "BOTH_TOGETHER_ONLY") score += 14;
  if (evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") score += 5;
  if (first.family === "TARGET_EXACT" || second.family === "TARGET_EXACT") score -= 2;
  score += Math.min(8, Math.floor((evaluation.statementI.worldCount + evaluation.statementII.worldCount) / 30));
  return score - first.complexity - second.complexity;
}

function synthesizePair(problem: SeatingProblem, seed: number, desiredClass: SufficiencyClass): Pair {
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
        // Inconsistent conjunctions are not valid DS questions.
      }
    }
  }
  if (!candidates.length) throw new Error(`CP013 Seating cannot synthesize ${desiredClass} for ${problem.solveMode}/${problem.facing}.`);
  candidates.sort((left, right) => right.quality - left.quality || left.statementI.id.localeCompare(right.statementI.id) || left.statementII.id.localeCompare(right.statementII.id));
  const best = candidates[0]!.quality;
  const top = candidates.filter((candidate) => candidate.quality >= best - 2);
  return pick(createRng(seed, `pair:${problem.solveMode}:${desiredClass}`), top);
}

function difficultyFor(semanticClass: SufficiencyClass): Difficulty {
  if (semanticClass === "EACH_STATEMENT_ALONE") return "Easy";
  if (semanticClass === "STATEMENT_I_ONLY" || semanticClass === "STATEMENT_II_ONLY") return "Medium";
  return "Hard";
}

function counterexample(answers: readonly string[]): string {
  if (answers.length >= 2) return `For example, the surviving arrangements still allow ${answers[0]} or ${answers[1]} as the target answer.`;
  return "The surviving arrangements do not force one unique target answer.";
}

function explanationFor(problem: SeatingProblem, pair: Pair): string {
  const e = pair.evaluation;
  const line = (label: string, sufficient: boolean, answers: readonly string[], count: number) => sufficient
    ? `${label} is sufficient: all ${count} source-valid arrangements give the same target answer.`
    : `${label} is not sufficient. ${counterexample(answers)}`;
  return [
    `We need to determine ${targetLabel(problem.solveMode)}.`,
    line("Statement I", e.statementI.sufficient, e.statementI.normalizedTargetAnswers, e.statementI.worldCount),
    line("Statement II", e.statementII.sufficient, e.statementII.normalizedTargetAnswers, e.statementII.worldCount),
    line("Together", e.together.sufficient, e.together.normalizedTargetAnswers, e.together.worldCount),
    `Therefore the correct sufficiency class is ${e.classification}.`,
  ].join(" ");
}

function normalizeSurface(text: string): string {
  return text.toLowerCase().replace(/\b\d+(?:\.\d+)?\b/g, "#").replace(/\s+/g, " ").trim();
}

export function normalizeDsfCp013SeatingSurface(text: string): string {
  return normalizeSurface(text);
}

export function generateDsfCp013SeatingQuestion(seed: number) {
  const solveMode = modeForSeed(seed);
  const desiredClass = classForSeed(seed);
  const facing: FacingDirection = Math.floor(Math.abs(seed) / 20) % 2 === 0 ? "NORTH" : "SOUTH";

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const random = createRng(seed + attempt * 104729, `problem:${solveMode}:${facing}`);
    const anchor = pick(random, WORLDS_BY_FACING[facing]);
    const context = CONTEXTS[Math.abs(seed + attempt) % CONTEXTS.length]!;
    const intro = context.intros[Math.abs(seed * 3 + attempt) % context.intros.length]!;
    const problem: SeatingProblem = { solveMode, facing, anchor, contextId: context.id, intro };
    try {
      const pair = synthesizePair(problem, seed + attempt * 997, desiredClass);
      const evaluation = pair.evaluation;
      const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
      const stem = `${intro} All five face ${facing === "NORTH" ? "north" : "south"}. ${targetPrompt(solveMode)}\n\nStatement I: ${pair.statementI.text}\nStatement II: ${pair.statementII.text}`;
      const generationIdentity = createHash("sha256")
        .update([DSF_CP013_SEATING_RUNTIME_VERSION, seed, solveMode, facing, anchor.model.canonicalKey, pair.statementI.id, pair.statementII.id].join("|"))
        .digest("hex")
        .slice(0, 24);
      return Object.freeze({
        packageId: "DSF-001" as const,
        checkpointId: "DSF-CP-013" as const,
        qlId: "DSF-QL-001" as const,
        runtimeVersion: DSF_CP013_SEATING_RUNTIME_VERSION,
        seed,
        locale: "en-IN" as const,
        difficulty: difficultyFor(evaluation.classification),
        domainFamily: "REASONING" as const,
        sourceChapterId: "SEA-001" as const,
        sourceCapabilities: [
          "SEA-001/solver/production-solver::solveLinear",
          "SEA-001/solver/independent-oracle::enumerateLinearOracle",
          "SEA-001/constraints/evaluate::evaluateConstraint",
          "SEA-001/topology/linear::LinearTopology",
        ] as const,
        sourceWorldCount: WORLDS_BY_FACING[facing].length,
        solverOracleParity: true as const,
        solveModeId: solveMode,
        facing,
        targetKind: targetLabel(solveMode),
        contextId: context.id,
        answerContractId: "DS_STANDARD_5" as const,
        taskDirection: "DATA_SUFFICIENCY" as const,
        answerSemantic: "SUFFICIENCY_CLASS" as const,
        stem,
        questionPrompt: targetPrompt(solveMode),
        statements: [
          { id: "I" as const, statementRuleId: pair.statementI.id, statementFamily: pair.statementI.family, text: pair.statementI.text },
          { id: "II" as const, statementRuleId: pair.statementII.id, statementFamily: pair.statementII.family, text: pair.statementII.text },
        ] as const,
        options: DS_STANDARD_5_EN.options.map((option) => ({
          key: option.key,
          value: option.text,
          semanticClass: option.semanticClass,
          isCorrect: option.semanticClass === evaluation.classification,
        })),
        correctIndex: DS_STANDARD_5_EN.options.findIndex((option) => option.semanticClass === evaluation.classification),
        canonicalAnswer: evaluation.classification,
        explanation: explanationFor(problem, pair),
        proof: Object.freeze({
          baseWorldCount: WORLDS_BY_FACING[facing].length,
          statementIWorldCount: evaluation.statementI.worldCount,
          statementIIWorldCount: evaluation.statementII.worldCount,
          togetherWorldCount: evaluation.together.worldCount,
          statementITargetAnswers: evaluation.statementI.normalizedTargetAnswers,
          statementIITargetAnswers: evaluation.statementII.normalizedTargetAnswers,
          togetherTargetAnswers: evaluation.together.normalizedTargetAnswers,
          minimalSufficientSets: evaluation.minimalSufficientSets,
          productionOracleParity: true as const,
        }),
        correctOptionText: correct.text,
        generationIdentity,
        studentSurfaceFingerprint: [
          solveMode,
          evaluation.classification,
          facing,
          pair.statementI.family,
          pair.statementII.family,
          String(targetAnswer(solveMode, anchor)),
          context.id,
        ].join("|"),
        lifecycle: Object.freeze({
          contentStatus: "CP013_REASONING_WAVE2_REVIEW_CANDIDATE" as const,
          questionStudioDiscoverable: false as const,
          questionBankWritable: false as const,
          testEligible: false as const,
          mockTestEligible: false as const,
          publiclyPublishable: false as const,
        }),
      });
    } catch {
      // Semantic retry only: choose another source-valid arrangement for the requested class.
    }
  }

  throw new Error(`CP013 Seating failed to generate seed ${seed} for ${desiredClass}.`);
}

export function generateDsfCp013SeatingBatch(seeds: readonly number[]) {
  return seeds.map((seed) => generateDsfCp013SeatingQuestion(seed));
}
