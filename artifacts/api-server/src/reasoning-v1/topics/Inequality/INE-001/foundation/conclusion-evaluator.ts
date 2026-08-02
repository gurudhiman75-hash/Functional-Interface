import { solvePairRelation } from "./graph-solver";
import { relationAcceptsAtomicOrder } from "./relations";
import type {
  ComparisonConstraint,
  ConclusionEvaluationEvidence,
  ConclusionTruth,
} from "./types";

export function evaluateConclusion(
  statements: readonly ComparisonConstraint[],
  conclusion: ComparisonConstraint,
): ConclusionEvaluationEvidence {
  const pairEvidence = solvePairRelation(
    statements,
    conclusion.leftId,
    conclusion.rightId,
  );
  const satisfyingAtomicRelations = pairEvidence.possibleAtomicRelations.filter(
    (order) => relationAcceptsAtomicOrder(conclusion.relation, order),
  );
  const rejectingAtomicRelations = pairEvidence.possibleAtomicRelations.filter(
    (order) => !relationAcceptsAtomicOrder(conclusion.relation, order),
  );

  let truth: ConclusionTruth;
  if (satisfyingAtomicRelations.length === 0) truth = "IMPOSSIBLE";
  else if (rejectingAtomicRelations.length === 0) truth = "DEFINITELY_TRUE";
  else truth = "POSSIBLY_TRUE";

  return {
    conclusion,
    truth,
    pairEvidence,
    satisfyingAtomicRelations,
    rejectingAtomicRelations,
  };
}
