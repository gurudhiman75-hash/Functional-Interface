import { refinePrt001E2Topology } from "./e2-topology-refiner";
import { addRational, normalizeRatio, rational, subtractRational, ZERO } from "./math";
import { formatPrt001Money } from "./parameter-generator";
import { solvePrt001State } from "./solver";
import type { Prt001PilotParameters } from "./types";

/**
 * E2 production normalization has two bounded responsibilities:
 *
 * 1. refine the relational three-partner QLs so equal-contribution examples do
 *    not collapse into one repeated 1:1:1 topology across seeds;
 * 2. for allocation questions, choose a gross profit that leaves clean whole-
 *    rupee ratio parts after fixed allocations or gross-percentage commission.
 *
 * Neither step changes the solve authority or answer contract.
 */
export function normalizePrt001E2ProductionMoney(
  input: Prt001PilotParameters,
): Prt001PilotParameters {
  const parameters = refinePrt001E2Topology(input);
  if (parameters.state.allocations.length === 0) return parameters;

  const initial = solvePrt001State(parameters.state);
  const ratio = normalizeRatio(
    initial.timeline.weights.map((item) => item.effectiveCapital),
  );
  const totalParts = ratio.reduce((sum, part) => sum + part, 0n);
  const baseGross = rational(totalParts * 20_000n);
  const fixedTotal = parameters.state.allocations
    .filter((item) => item.basis === "FIXED_AMOUNT")
    .map((item) => item.value)
    .reduce(addRational, ZERO);
  const hasGrossPercentage = parameters.state.allocations.some(
    (item) => item.basis === "PERCENT_OF_GROSS_PROFIT",
  );

  // For gross-percentage commission, gross = totalParts × ₹20,000 leaves
  // totalParts × ₹18,000 at 10% or × ₹16,000 at 20%, both clean per part.
  // For fixed allocations, add them on top so the distributable pool is
  // exactly totalParts × ₹20,000.
  const grossProfitOrLoss = hasGrossPercentage
    ? baseGross
    : addRational(baseGross, fixedTotal);
  const state = { ...parameters.state, grossProfitOrLoss };
  const solution = solvePrt001State(state);
  const renderVariables: Record<string, string | number> = {
    ...parameters.renderVariables,
    totalProfit: formatPrt001Money(grossProfitOrLoss),
  };

  if (parameters.targetPartnerId) {
    const receipt = solution.finalPartnerReceipts[parameters.targetPartnerId];
    if (receipt) {
      renderVariables.finalReceipt = formatPrt001Money(receipt);
      renderVariables.sleepingPartnerReceipt = formatPrt001Money(receipt);
    }
  }

  const [partnerA, partnerB] = state.partners;
  if (partnerA && partnerB) {
    const difference = subtractRational(
      solution.finalPartnerReceipts[partnerA.partnerId]!,
      solution.finalPartnerReceipts[partnerB.partnerId]!,
    );
    const absolute =
      difference.numerator < 0n
        ? rational(-difference.numerator, difference.denominator)
        : difference;
    renderVariables.finalReceiptDifference = formatPrt001Money(absolute);
  }

  return { ...parameters, state, renderVariables };
}
