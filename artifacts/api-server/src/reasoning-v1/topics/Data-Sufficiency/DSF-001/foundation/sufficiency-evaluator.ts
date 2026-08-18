import {
  SufficiencyInvariantError,
  type StatementId,
  type StatementSubsetEvaluation,
  type SufficiencyClass,
  type SufficiencyEvaluation,
  type TwoStatementSufficiencyEvaluation,
  type TwoStatementSufficiencyInput,
} from "./types.ts";

function normalizedUniqueAnswer<Answer>(result: SufficiencyEvaluation<Answer>): string | undefined {
  return result.sufficient ? result.normalizedTargetAnswers[0] : undefined;
}

function assertConsistent<Answer>(label: string, result: SufficiencyEvaluation<Answer>): void {
  if (!result.consistent) {
    throw new SufficiencyInvariantError(
      "DSF_INCONSISTENT_STATEMENT_SET",
      `${label} leaves no valid worlds. Generated Data Sufficiency statements must be mutually consistent with the base problem.`,
    );
  }
}

function assertMonotonicUniqueTarget<Answer>(
  label: string,
  alone: SufficiencyEvaluation<Answer>,
  together: SufficiencyEvaluation<Answer>,
): void {
  if (!alone.sufficient) return;
  if (!together.sufficient) {
    throw new SufficiencyInvariantError(
      "DSF_SUFFICIENCY_MONOTONICITY_BROKEN",
      `${label} is sufficient alone, but the consistent conjunction is not sufficient.`,
    );
  }
  if (normalizedUniqueAnswer(alone) !== normalizedUniqueAnswer(together)) {
    throw new SufficiencyInvariantError(
      "DSF_TARGET_ANSWER_CHANGED_AFTER_CONJUNCTION",
      `${label} fixes a different target answer from the conjunction.`,
    );
  }
}

export function evaluateWorldSet<World, Answer>(
  worlds: readonly World[],
  evaluateTarget: (world: World) => Answer,
  normalizeAnswer: (answer: Answer) => string,
): SufficiencyEvaluation<Answer> {
  if (worlds.length === 0) {
    return {
      consistent: false,
      worldCount: 0,
      normalizedTargetAnswers: [],
      sufficient: false,
    };
  }

  const answerByKey = new Map<string, Answer>();
  for (const world of worlds) {
    const answer = evaluateTarget(world);
    const key = normalizeAnswer(answer);
    if (key.length === 0) {
      throw new SufficiencyInvariantError(
        "DSF_EMPTY_NORMALIZED_TARGET",
        "Target-answer normalizers must return a non-empty stable semantic key.",
      );
    }
    if (!answerByKey.has(key)) answerByKey.set(key, answer);
  }

  const normalizedTargetAnswers = [...answerByKey.keys()].sort();
  const sufficient = normalizedTargetAnswers.length === 1;
  const uniqueAnswer = sufficient ? answerByKey.get(normalizedTargetAnswers[0]!) : undefined;

  return {
    consistent: true,
    worldCount: worlds.length,
    normalizedTargetAnswers,
    sufficient,
    ...(sufficient ? { uniqueAnswer } : {}),
  };
}

export function classifyTwoStatementResults<Answer>(
  statementI: SufficiencyEvaluation<Answer>,
  statementII: SufficiencyEvaluation<Answer>,
  together: SufficiencyEvaluation<Answer>,
): SufficiencyClass {
  assertConsistent("Statement I", statementI);
  assertConsistent("Statement II", statementII);
  assertConsistent("Statements I and II together", together);

  assertMonotonicUniqueTarget("Statement I", statementI, together);
  assertMonotonicUniqueTarget("Statement II", statementII, together);

  if (statementI.sufficient && statementII.sufficient) {
    if (normalizedUniqueAnswer(statementI) !== normalizedUniqueAnswer(statementII)) {
      throw new SufficiencyInvariantError(
        "DSF_EACH_ALONE_ANSWER_DISAGREEMENT",
        "Statements I and II are each sufficient but determine different target answers.",
      );
    }
    return "EACH_STATEMENT_ALONE";
  }
  if (statementI.sufficient) return "STATEMENT_I_ONLY";
  if (statementII.sufficient) return "STATEMENT_II_ONLY";
  if (together.sufficient) return "BOTH_TOGETHER_ONLY";
  return "INSUFFICIENT_EVEN_TOGETHER";
}

function isSubset(subset: readonly StatementId[], superset: readonly StatementId[]): boolean {
  return subset.every((statementId) => superset.includes(statementId));
}

export function findMinimalSufficientSubsets<Answer>(
  evaluations: readonly StatementSubsetEvaluation<Answer>[],
): readonly (readonly StatementId[])[] {
  const sufficient = evaluations
    .filter((entry) => entry.result.consistent && entry.result.sufficient)
    .sort((left, right) => left.statementIds.length - right.statementIds.length);

  const minimal: StatementId[][] = [];
  for (const entry of sufficient) {
    if (minimal.some((known) => isSubset(known, entry.statementIds))) continue;
    minimal.push([...entry.statementIds]);
  }
  return minimal;
}

export function evaluateTwoStatementSufficiency<World, Answer>(
  input: TwoStatementSufficiencyInput<World, Answer>,
): TwoStatementSufficiencyEvaluation<Answer> {
  if (input.baseWorlds.length === 0) {
    throw new SufficiencyInvariantError(
      "DSF_EMPTY_BASE_WORLD_SET",
      "The base problem must have at least one valid world before statements are evaluated.",
    );
  }

  // Independence is architectural: each standalone pass starts from baseWorlds.
  const worldsI = input.baseWorlds.filter(input.statementI);
  const worldsII = input.baseWorlds.filter(input.statementII);
  const worldsTogether = input.baseWorlds.filter(
    (world) => input.statementI(world) && input.statementII(world),
  );

  const statementI = evaluateWorldSet(worldsI, input.evaluateTarget, input.normalizeAnswer);
  const statementII = evaluateWorldSet(worldsII, input.evaluateTarget, input.normalizeAnswer);
  const together = evaluateWorldSet(worldsTogether, input.evaluateTarget, input.normalizeAnswer);
  const classification = classifyTwoStatementResults(statementI, statementII, together);

  const minimalSufficientSets = findMinimalSufficientSubsets([
    { statementIds: ["I"], result: statementI },
    { statementIds: ["II"], result: statementII },
    { statementIds: ["I", "II"], result: together },
  ]);

  return {
    statementI,
    statementII,
    together,
    classification,
    minimalSufficientSets,
  };
}
