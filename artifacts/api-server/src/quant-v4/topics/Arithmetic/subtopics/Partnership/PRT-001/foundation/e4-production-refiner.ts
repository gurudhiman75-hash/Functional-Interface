import { rational } from "./math";
import { formatPrt001Duration, formatPrt001Money } from "./parameter-generator";
import { solvePrt001State } from "./solver";
import type { Prt001PilotParameters } from "./types";

/**
 * E4 keeps reverse/difference questions exam-like. In particular, the weighted
 * profit-difference contract must not collapse to equal contributions (₹0
 * difference), because that erases the intended ratio reasoning and produces
 * a poor option surface.
 */
export function refinePrt001E4ProductionState(parameters: Prt001PilotParameters): Prt001PilotParameters {
  if (parameters.entry.solveMode !== "findProfitDifferenceFromCapitalDurationWeights") return parameters;
  const initial = solvePrt001State(parameters.state);
  if (initial.normalizedRatio.length !== 2 || initial.normalizedRatio[0] !== initial.normalizedRatio[1]) return parameters;

  const [a, b] = parameters.state.partners;
  const b0 = b!.capitalSegments[0]!;
  const shortenedEnd = rational(Number(b0.end.numerator / b0.end.denominator) - 1);
  const refinedB = { ...b!, capitalSegments: [{ ...b0, end: shortenedEnd }] };
  const provisionalState = { ...parameters.state, partners: [a!, refinedB] };
  const provisional = solvePrt001State(provisionalState);
  const totalParts = provisional.normalizedRatio.reduce((sum, part) => sum + part, 0n);
  const grossProfitOrLoss = rational(totalParts * 18_000n);
  const state = { ...provisionalState, grossProfitOrLoss };
  return {
    ...parameters,
    state,
    renderVariables: {
      ...parameters.renderVariables,
      durationB: formatPrt001Duration(shortenedEnd, parameters.language),
      totalProfit: formatPrt001Money(grossProfitOrLoss),
    },
  };
}
