import type {
  Pnc002AnyParameters,
  Pnc002IndependentVerification,
  Pnc002ReasoningEvidence,
  Pnc002SolverResult,
} from "./types";

export function buildPnc002Cp010ReasoningEvidence(
  parameters: Pnc002AnyParameters,
  solver: Pnc002SolverResult,
  verification: Pnc002IndependentVerification,
): Pnc002ReasoningEvidence {
  const e = solver.evidence;
  return {
    conceptId: String(parameters.solveMode),
    givens: {
      totalObjects: e.totalObjects,
      condition: parameters.constraintProfile,
      ...(e.blockSizes.length ? { blockSizes: e.blockSizes.join(",") } : {}),
      ...(e.clockwiseGap !== undefined ? { clockwiseGap: e.clockwiseGap } : {}),
      ...(e.minimumClockwiseGap !== undefined ? { minimumClockwiseGap: e.minimumClockwiseGap } : {}),
      ...(e.maximumClockwiseGap !== undefined ? { maximumClockwiseGap: e.maximumClockwiseGap } : {}),
      ...(e.clockwiseOrderLength !== undefined ? { clockwiseOrderLength: e.clockwiseOrderLength } : {}),
      ...(e.categorySizes ? { categorySizes: e.categorySizes.join(",") } : {}),
      ...(e.target !== undefined ? { target: e.target } : {}),
    },
    equations: [`\\(${solver.mathJax}\\)`],
    intermediateValues: {
      unrestrictedCount: e.unrestrictedCount ?? "",
      circularUnitCount: e.circularUnitCount ?? e.unitCount,
      internalArrangementMultiplier: e.internalArrangementMultiplier,
      clockwisePositionChoices: e.clockwisePositionChoices ?? "",
      reflectionSymmetryDivisor: e.reflectionSymmetryDivisor ?? 1,
    },
    decisiveCalculation: `\\(${solver.mathJax}\\)`,
    verification: `${verification.method}; verified count = ${verification.answer}.`,
  };
}
