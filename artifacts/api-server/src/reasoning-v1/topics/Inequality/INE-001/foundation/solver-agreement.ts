import { analyzeInequalityGraph, solvePairRelation } from "./graph-solver";
import { enumeratePairRelationModels } from "./model-enumerator";
import type {
  ComparisonConstraint,
  ModelEnumerationOptions,
  SolverAgreementEvidence,
} from "./types";

function sameDomain(
  left: readonly string[],
  right: readonly string[],
): boolean {
  return (
    left.length === right.length && left.every((value) => right.includes(value))
  );
}

export function verifySolverAgreement(
  constraints: readonly ComparisonConstraint[],
  leftId: string,
  rightId: string,
  options: ModelEnumerationOptions = {},
): SolverAgreementEvidence {
  const graphAnalysis = analyzeInequalityGraph(constraints, [leftId, rightId]);
  const modelEvidence = enumeratePairRelationModels(
    constraints,
    leftId,
    rightId,
    options,
  );
  if (modelEvidence.truncated) {
    throw new Error(
      "Independent model enumeration was truncated before proof completed.",
    );
  }

  if (!graphAnalysis.consistent) {
    return {
      graphAnalysis,
      modelEvidence,
      agreed: modelEvidence.validModelCount === 0,
    };
  }

  const graphEvidence = solvePairRelation(constraints, leftId, rightId);
  return {
    graphAnalysis,
    graphEvidence,
    modelEvidence,
    agreed:
      modelEvidence.validModelCount > 0 &&
      sameDomain(
        graphEvidence.possibleAtomicRelations,
        modelEvidence.possibleAtomicRelations,
      ),
  };
}

export function assertSolverAgreement(
  constraints: readonly ComparisonConstraint[],
  leftId: string,
  rightId: string,
  options: ModelEnumerationOptions = {},
): SolverAgreementEvidence {
  const evidence = verifySolverAgreement(constraints, leftId, rightId, options);
  if (!evidence.agreed) {
    throw new Error(
      `Inequality solvers disagree for ${leftId}/${rightId}: graph=${evidence.graphEvidence?.possibleAtomicRelations.join("|") ?? "CONTRADICTION"}, models=${evidence.modelEvidence.possibleAtomicRelations.join("|") || "NONE"}.`,
    );
  }
  return evidence;
}
