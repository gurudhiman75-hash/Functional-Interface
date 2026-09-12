import { ZERO, addRational, divideRational, formatRational, multiplyRational, normalizeRatio, rational, subtractRational } from "./math";
import { formatPrt001Duration, formatPrt001Money } from "./parameter-generator";
import type { Prt001IndependentVerification, Prt001PilotParameters, Prt001Solution, Prt001TaskAnswer, Rational } from "./types";

function abs(value: Rational): Rational { return value.numerator < 0n ? rational(-value.numerator, value.denominator) : value; }
function answer(parameters: Prt001PilotParameters, exact: Rational): Prt001TaskAnswer {
  const display = parameters.entry.answerType === "DURATION"
    ? formatPrt001Duration(exact, parameters.language)
    : parameters.entry.answerType === "PERCENT"
      ? `${formatRational(exact)}%`
      : formatPrt001Money(exact);
  return { kind: "RATIONAL", exact, display };
}
function ratioAnswer(values: readonly Rational[]): Prt001TaskAnswer { const ratio = normalizeRatio(values); return { kind: "RATIO", ratio, display: ratio.join(":") }; }
function duration(partner: Prt001PilotParameters["state"]["partners"][number]): Rational { const s = partner.capitalSegments[0]!; return subtractRational(s.end, s.start); }

export function solvePrt001E3ATask(parameters: Prt001PilotParameters, solution: Prt001Solution): Prt001TaskAnswer {
  const [a] = parameters.state.partners;
  switch (parameters.entry.solveMode) {
    case "findTotalProfitFromShareDifferenceAndWeights": return answer(parameters, parameters.state.grossProfitOrLoss);
    case "findUnknownPercentageCapitalChange": {
      const [first, second] = a!.capitalSegments;
      return answer(parameters, multiplyRational(divideRational(subtractRational(second!.capital, first!.capital), first!.capital), rational(100)));
    }
    case "findInitialCapitalFromFinalShareAndChangeHistory": return answer(parameters, a!.capitalSegments[0]!.capital);
    case "findDurationRatioFromPartnerShareRelations": return ratioAnswer(parameters.state.partners.map(duration));
    case "findUnknownCommissionPercentFromFinalReceipt": return answer(parameters, parameters.state.allocations.find((item) => item.kind === "COMMISSION")!.value);
    case "findUnknownDeductionFromPartnerShare": return answer(parameters, parameters.state.allocations.find((item) => item.kind === "EXPENSE")!.value);
    case "findProfitRatioFromFinalReceiptsWhenOnePartnerGetsSalary": return ratioAnswer(solution.timeline.weights.map((item) => item.effectiveCapital));
    default: throw new Error(`E3A task solver does not support ${parameters.entry.solveMode}`);
  }
}

export function independentlySolvePrt001E3ATask(parameters: Prt001PilotParameters, verification: Prt001IndependentVerification): Prt001TaskAnswer {
  const partners = parameters.state.partners;
  const weights = verification.weights.map((item) => item.effectiveCapital);
  const totalWeight = weights.reduce(addRational, ZERO);
  switch (parameters.entry.solveMode) {
    case "findTotalProfitFromShareDifferenceAndWeights": {
      const diffShare = abs(subtractRational(verification.distributedShares[partners[0]!.partnerId]!, verification.distributedShares[partners[1]!.partnerId]!));
      const diffWeight = abs(subtractRational(weights[0]!, weights[1]!));
      return answer(parameters, divideRational(multiplyRational(diffShare, totalWeight), diffWeight));
    }
    case "findUnknownPercentageCapitalChange": {
      const [first, second] = partners[0]!.capitalSegments;
      const before = subtractRational(first!.end, first!.start);
      const after = subtractRational(parameters.state.totalDuration, second!.start);
      const changedCapital = divideRational(subtractRational(weights[0]!, multiplyRational(first!.capital, before)), after);
      const pct = multiplyRational(divideRational(subtractRational(changedCapital, first!.capital), first!.capital), rational(100));
      return answer(parameters, pct);
    }
    case "findInitialCapitalFromFinalShareAndChangeHistory": {
      const [first, second] = partners[0]!.capitalSegments;
      const added = subtractRational(second!.capital, first!.capital);
      const after = subtractRational(parameters.state.totalDuration, second!.start);
      const initial = divideRational(subtractRational(weights[0]!, multiplyRational(added, after)), parameters.state.totalDuration);
      return answer(parameters, initial);
    }
    case "findDurationRatioFromPartnerShareRelations":
      return ratioAnswer(weights.map((weight, index) => divideRational(weight, partners[index]!.capitalSegments[0]!.capital)));
    case "findUnknownCommissionPercentFromFinalReceipt": {
      const gross = parameters.state.grossProfitOrLoss;
      const finalA = verification.finalPartnerReceipts[partners[0]!.partnerId]!;
      const weightFraction = divideRational(weights[0]!, totalWeight);
      const receiptFraction = divideRational(finalA, gross);
      const commissionFraction = divideRational(subtractRational(receiptFraction, weightFraction), subtractRational(rational(1), weightFraction));
      return answer(parameters, multiplyRational(commissionFraction, rational(100)));
    }
    case "findUnknownDeductionFromPartnerShare": {
      const known = verification.distributedShares[partners[1]!.partnerId]!;
      const pool = divideRational(multiplyRational(known, totalWeight), weights[1]!);
      return answer(parameters, subtractRational(parameters.state.grossProfitOrLoss, pool));
    }
    case "findProfitRatioFromFinalReceiptsWhenOnePartnerGetsSalary": {
      const salary = parameters.state.allocations.find((item) => item.kind === "SALARY")!.value;
      const distributedA = subtractRational(verification.finalPartnerReceipts[partners[0]!.partnerId]!, salary);
      const distributedB = verification.finalPartnerReceipts[partners[1]!.partnerId]!;
      return ratioAnswer([distributedA, distributedB]);
    }
    default: throw new Error(`E3A independent solver does not support ${parameters.entry.solveMode}`);
  }
}
