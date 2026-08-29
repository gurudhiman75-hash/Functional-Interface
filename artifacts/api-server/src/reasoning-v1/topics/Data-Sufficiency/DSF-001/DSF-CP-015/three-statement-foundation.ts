import {
  evaluateWorldSet,
  findMinimalSufficientSubsets,
} from "../foundation/sufficiency-evaluator.ts";
import type { FiniteDomainSufficiencyAdapter } from "../foundation/domain-adapter.ts";
import {
  SufficiencyInvariantError,
  type StatementId,
  type StatementSubsetEvaluation,
  type SufficiencyEvaluation,
} from "../foundation/types.ts";

export const DSF_CP015_THREE_STATEMENT_FOUNDATION_VERSION = "DSF_CP015_THREE_STATEMENT_FOUNDATION_V1" as const;

export type ThreeStatementId = Extract<StatementId, "I" | "II" | "III">;
export type ThreeStatementSubset = readonly ThreeStatementId[];

export const THREE_STATEMENT_NONEMPTY_SUBSETS: readonly ThreeStatementSubset[] = Object.freeze([
  Object.freeze(["I"] as const),
  Object.freeze(["II"] as const),
  Object.freeze(["III"] as const),
  Object.freeze(["I", "II"] as const),
  Object.freeze(["I", "III"] as const),
  Object.freeze(["II", "III"] as const),
  Object.freeze(["I", "II", "III"] as const),
]);

export type ThreeStatementSemanticKey = string;

export interface ThreeStatementSufficiencyInput<World, Answer> {
  readonly baseWorlds: readonly World[];
  readonly statementI: (world: World) => boolean;
  readonly statementII: (world: World) => boolean;
  readonly statementIII: (world: World) => boolean;
  readonly evaluateTarget: (world: World) => Answer;
  readonly normalizeAnswer: (answer: Answer) => string;
}

export interface ThreeStatementSufficiencyEvaluation<Answer> {
  readonly base: SufficiencyEvaluation<Answer>;
  readonly subsetEvaluations: readonly StatementSubsetEvaluation<Answer>[];
  readonly minimalSufficientSets: readonly ThreeStatementSubset[];
  readonly semanticKey: ThreeStatementSemanticKey;
  readonly allThree: SufficiencyEvaluation<Answer>;
}

const STATEMENT_ORDER: Readonly<Record<ThreeStatementId, number>> = Object.freeze({ I: 0, II: 1, III: 2 });

function canonicalSubset(statementIds: readonly StatementId[]): ThreeStatementSubset {
  const ids = statementIds.filter((id): id is ThreeStatementId => id === "I" || id === "II" || id === "III");
  if (ids.length !== statementIds.length || ids.length === 0) {
    throw new SufficiencyInvariantError("DSF_INVALID_THREE_STATEMENT_SUBSET", `Invalid three-statement subset: ${statementIds.join(",")}`);
  }
  return Object.freeze([...ids].sort((left, right) => STATEMENT_ORDER[left] - STATEMENT_ORDER[right]));
}

export function threeStatementSubsetKey(statementIds: readonly StatementId[]): string {
  return canonicalSubset(statementIds).join("+");
}

function compareSubsets(left: ThreeStatementSubset, right: ThreeStatementSubset): number {
  if (left.length !== right.length) return left.length - right.length;
  return threeStatementSubsetKey(left).localeCompare(threeStatementSubsetKey(right));
}

export function threeStatementSemanticKey(minimalSufficientSets: readonly (readonly StatementId[])[]): ThreeStatementSemanticKey {
  if (minimalSufficientSets.length === 0) return "NONE";
  return minimalSufficientSets
    .map(canonicalSubset)
    .sort(compareSubsets)
    .map(threeStatementSubsetKey)
    .join("|");
}

function isSubset(left: readonly ThreeStatementId[], right: readonly ThreeStatementId[]): boolean {
  return left.every((id) => right.includes(id));
}

function uniqueAnswer<Answer>(result: SufficiencyEvaluation<Answer>): string | undefined {
  return result.sufficient ? result.normalizedTargetAnswers[0] : undefined;
}

function assertSubsetLatticeInvariants<Answer>(evaluations: readonly StatementSubsetEvaluation<Answer>[]): void {
  const allThree = evaluations.find((entry) => entry.statementIds.length === 3);
  if (!allThree?.result.consistent) {
    throw new SufficiencyInvariantError(
      "DSF_INCONSISTENT_THREE_STATEMENT_SET",
      "Statements I, II and III must be jointly consistent with at least one valid base world.",
    );
  }

  for (const lowerEntry of evaluations) {
    const lower = canonicalSubset(lowerEntry.statementIds);
    if (!lowerEntry.result.consistent) {
      throw new SufficiencyInvariantError(
        "DSF_INCONSISTENT_STATEMENT_SET",
        `Statement subset ${threeStatementSubsetKey(lower)} leaves no valid worlds.`,
      );
    }
    if (!lowerEntry.result.sufficient) continue;

    for (const upperEntry of evaluations) {
      const upper = canonicalSubset(upperEntry.statementIds);
      if (lower.length >= upper.length || !isSubset(lower, upper)) continue;
      if (!upperEntry.result.sufficient) {
        throw new SufficiencyInvariantError(
          "DSF_SUFFICIENCY_MONOTONICITY_BROKEN",
          `${threeStatementSubsetKey(lower)} is sufficient but superset ${threeStatementSubsetKey(upper)} is not.`,
        );
      }
      if (uniqueAnswer(lowerEntry.result) !== uniqueAnswer(upperEntry.result)) {
        throw new SufficiencyInvariantError(
          "DSF_TARGET_ANSWER_CHANGED_AFTER_CONJUNCTION",
          `${threeStatementSubsetKey(lower)} and ${threeStatementSubsetKey(upper)} determine different target answers.`,
        );
      }
    }
  }
}

export function evaluateThreeStatementSufficiency<World, Answer>(
  input: ThreeStatementSufficiencyInput<World, Answer>,
): ThreeStatementSufficiencyEvaluation<Answer> {
  if (input.baseWorlds.length === 0) {
    throw new SufficiencyInvariantError("DSF_EMPTY_BASE_WORLD_SET", "The base problem must have at least one valid world.");
  }

  const base = evaluateWorldSet(input.baseWorlds, input.evaluateTarget, input.normalizeAnswer);
  if (base.sufficient) {
    throw new SufficiencyInvariantError(
      "DSF_BASE_ALREADY_SUFFICIENT",
      "The target is already uniquely determined before Statements I, II and III are used.",
    );
  }

  const predicates: Readonly<Record<ThreeStatementId, (world: World) => boolean>> = {
    I: input.statementI,
    II: input.statementII,
    III: input.statementIII,
  };

  const subsetEvaluations: StatementSubsetEvaluation<Answer>[] = THREE_STATEMENT_NONEMPTY_SUBSETS.map((statementIds) => {
    const worlds = input.baseWorlds.filter((world) => statementIds.every((id) => predicates[id](world)));
    return {
      statementIds,
      result: evaluateWorldSet(worlds, input.evaluateTarget, input.normalizeAnswer),
    };
  });

  assertSubsetLatticeInvariants(subsetEvaluations);

  const minimalSufficientSets = findMinimalSufficientSubsets(subsetEvaluations)
    .map(canonicalSubset)
    .sort(compareSubsets);
  const semanticKey = threeStatementSemanticKey(minimalSufficientSets);
  const allThree = subsetEvaluations.find((entry) => entry.statementIds.length === 3)!.result;

  return Object.freeze({
    base,
    subsetEvaluations: Object.freeze(subsetEvaluations),
    minimalSufficientSets: Object.freeze(minimalSufficientSets),
    semanticKey,
    allThree,
  });
}

export function evaluateFiniteDomainTriple<Problem, World, Statement, Answer>(
  adapter: FiniteDomainSufficiencyAdapter<Problem, World, Statement, Answer>,
  problem: Problem,
  statementI: Statement,
  statementII: Statement,
  statementIII: Statement,
): ThreeStatementSufficiencyEvaluation<Answer> {
  return evaluateThreeStatementSufficiency({
    baseWorlds: adapter.enumerateBaseWorlds(problem),
    statementI: (world) => adapter.statementHolds(problem, world, statementI),
    statementII: (world) => adapter.statementHolds(problem, world, statementII),
    statementIII: (world) => adapter.statementHolds(problem, world, statementIII),
    evaluateTarget: (world) => adapter.evaluateTarget(problem, world),
    normalizeAnswer: (answer) => adapter.normalizeAnswer(answer),
  });
}
