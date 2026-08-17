import { classifyConclusionPrimary } from "./primary-solver";
import type {
  CanonicalConclusion,
  PrimitiveConstraint,
  SolverAgreementResult,
  TermId,
} from "./types";
import { classifyConclusionIndependent } from "./witness-model-verifier";

export function verifySolverAgreement(
  premises: readonly PrimitiveConstraint[],
  conclusion: CanonicalConclusion,
  termOrder: readonly TermId[],
): SolverAgreementResult {
  const primary = classifyConclusionPrimary(premises, conclusion, termOrder);
  const independent = classifyConclusionIndependent(premises, conclusion, termOrder);
  return {
    agreed:
      primary.canBeTrue === independent.canBeTrue
      && primary.canBeFalse === independent.canBeFalse
      && primary.classification === independent.classification,
    primary,
    independent,
  };
}
