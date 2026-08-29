import { evaluateTwoStatementSufficiency } from "./sufficiency-evaluator.ts";
import type { TwoStatementSufficiencyEvaluation } from "./types.ts";

export interface FiniteDomainSufficiencyAdapter<Problem, World, Statement, Answer> {
  readonly adapterId: string;
  readonly domainFamily: "QUANT" | "REASONING";
  readonly sourceChapterId?: string;
  enumerateBaseWorlds(problem: Problem): readonly World[];
  statementHolds(problem: Problem, world: World, statement: Statement): boolean;
  evaluateTarget(problem: Problem, world: World): Answer;
  normalizeAnswer(answer: Answer): string;
}

/**
 * Mandatory bridge for finite-domain adapters. Domain adapters supply domain
 * truth only; the shared DSF evaluator owns statement isolation, conjunction,
 * target projection, consistency checks and canonical classification.
 */
export function evaluateFiniteDomainPair<Problem, World, Statement, Answer>(
  adapter: FiniteDomainSufficiencyAdapter<Problem, World, Statement, Answer>,
  problem: Problem,
  statementI: Statement,
  statementII: Statement,
): TwoStatementSufficiencyEvaluation<Answer> {
  const baseWorlds = adapter.enumerateBaseWorlds(problem);
  return evaluateTwoStatementSufficiency({
    baseWorlds,
    statementI: (world) => adapter.statementHolds(problem, world, statementI),
    statementII: (world) => adapter.statementHolds(problem, world, statementII),
    evaluateTarget: (world) => adapter.evaluateTarget(problem, world),
    normalizeAnswer: (answer) => adapter.normalizeAnswer(answer),
  });
}
