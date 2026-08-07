import { verifySolverAgreement } from "../foundation/solver-agreement";
import type {
  AtomicOrder,
  ComparisonConstraint,
  ComparisonRelation,
} from "../foundation/types";
import type {
  IneCp004ComplementEvidence,
  IneCp004ConclusionPair,
  IneCp004PairStatus,
} from "./types";

const ATOMIC_ORDER: readonly AtomicOrder[] = ["LT", "EQ", "GT"];

function reverseRelation(relation: ComparisonRelation): ComparisonRelation {
  if (relation === "GREATER_THAN") return "LESS_THAN";
  if (relation === "LESS_THAN") return "GREATER_THAN";
  if (relation === "GREATER_THAN_OR_EQUAL") return "LESS_THAN_OR_EQUAL";
  if (relation === "LESS_THAN_OR_EQUAL") return "GREATER_THAN_OR_EQUAL";
  return "EQUAL_TO";
}

function relationInFirstOrientation(
  reference: ComparisonConstraint,
  candidate: ComparisonConstraint,
): ComparisonRelation | undefined {
  if (
    reference.leftId === candidate.leftId &&
    reference.rightId === candidate.rightId
  )
    return candidate.relation;
  if (
    reference.leftId === candidate.rightId &&
    reference.rightId === candidate.leftId
  )
    return reverseRelation(candidate.relation);
  return undefined;
}

function satisfyingRelations(
  relation: ComparisonRelation,
): readonly AtomicOrder[] {
  if (relation === "GREATER_THAN") return ["GT"];
  if (relation === "LESS_THAN") return ["LT"];
  if (relation === "EQUAL_TO") return ["EQ"];
  if (relation === "GREATER_THAN_OR_EQUAL") return ["EQ", "GT"];
  return ["LT", "EQ"];
}

function intersection(
  left: readonly AtomicOrder[],
  right: readonly AtomicOrder[],
): AtomicOrder[] {
  return ATOMIC_ORDER.filter(
    (relation) => left.includes(relation) && right.includes(relation),
  );
}

function union(
  left: readonly AtomicOrder[],
  right: readonly AtomicOrder[],
): AtomicOrder[] {
  return ATOMIC_ORDER.filter(
    (relation) => left.includes(relation) || right.includes(relation),
  );
}

function sameSet(
  left: readonly AtomicOrder[],
  right: readonly AtomicOrder[],
): boolean {
  return (
    left.length === right.length && left.every((entry) => right.includes(entry))
  );
}

export function classifyComplementaryEvidence(
  evidence: IneCp004ComplementEvidence,
): IneCp004PairStatus | undefined {
  if (evidence.validEitherOr) return "VALID_EITHER_OR";
  if (!evidence.mutuallyExclusive && evidence.jointlyExhaustive)
    return "NOT_EXCLUSIVE";
  if (evidence.mutuallyExclusive && !evidence.jointlyExhaustive)
    return "NOT_EXHAUSTIVE";
  return undefined;
}

export function evaluateComplementaryPair(
  statements: readonly ComparisonConstraint[],
  pair: IneCp004ConclusionPair,
): IneCp004ComplementEvidence {
  const secondRelation = relationInFirstOrientation(pair.first, pair.second);
  const sameCanonicalPair = secondRelation !== undefined;
  const agreement = verifySolverAgreement(
    statements,
    pair.first.leftId,
    pair.first.rightId,
  );
  const validAtomicRelations = agreement.modelEvidence.possibleAtomicRelations;
  const firstSatisfyingRelations = intersection(
    satisfyingRelations(pair.first.relation),
    validAtomicRelations,
  );
  const secondSatisfyingRelations = secondRelation
    ? intersection(satisfyingRelations(secondRelation), validAtomicRelations)
    : [];
  const mutuallyExclusive =
    intersection(firstSatisfyingRelations, secondSatisfyingRelations).length ===
    0;
  const jointlyExhaustive = sameSet(
    union(firstSatisfyingRelations, secondSatisfyingRelations),
    validAtomicRelations,
  );
  const firstDefinitelyTrue = sameSet(
    firstSatisfyingRelations,
    validAtomicRelations,
  );
  const secondDefinitelyTrue = sameSet(
    secondSatisfyingRelations,
    validAtomicRelations,
  );
  const validEitherOr =
    sameCanonicalPair &&
    agreement.graphAnalysis.consistent &&
    agreement.modelEvidence.validModelCount > 0 &&
    !firstDefinitelyTrue &&
    !secondDefinitelyTrue &&
    firstSatisfyingRelations.length > 0 &&
    secondSatisfyingRelations.length > 0 &&
    mutuallyExclusive &&
    jointlyExhaustive;
  const evidence: IneCp004ComplementEvidence = {
    sameCanonicalPair,
    consistent: agreement.graphAnalysis.consistent,
    validAtomicRelations,
    firstSatisfyingRelations,
    secondSatisfyingRelations,
    firstDefinitelyTrue,
    secondDefinitelyTrue,
    mutuallyExclusive,
    jointlyExhaustive,
    validEitherOr,
  };
  return { ...evidence, status: classifyComplementaryEvidence(evidence) };
}
