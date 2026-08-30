import {
  ZERO,
  addRational,
  divideRational,
  multiplyRational,
  normalizeRatio,
  rational,
  subtractRational,
} from "./math";
import { formatPrt001Duration, formatPrt001Money } from "./parameter-generator";
import type {
  Prt001IndependentVerification,
  Prt001PilotParameters,
  Prt001Solution,
  Prt001TaskAnswer,
  Rational,
} from "./types";

function abs(value: Rational): Rational {
  return value.numerator < 0n
    ? rational(-value.numerator, value.denominator)
    : value;
}

function ratioAnswer(values: readonly Rational[]): Prt001TaskAnswer {
  const ratio = normalizeRatio(values);
  return { kind: "RATIO", ratio, display: ratio.join(":") };
}

function rationalAnswer(
  parameters: Prt001PilotParameters,
  exact: Rational,
): Prt001TaskAnswer {
  return {
    kind: "RATIONAL",
    exact,
    display:
      parameters.entry.answerType === "DURATION"
        ? formatPrt001Duration(exact, parameters.language)
        : formatPrt001Money(exact),
  };
}

function firstDuration(parameters: Prt001PilotParameters, index: number): Rational {
  const segment = parameters.state.partners[index]!.capitalSegments[0]!;
  return subtractRational(segment.end, segment.start);
}

function capitalRatio(parameters: Prt001PilotParameters): Prt001TaskAnswer {
  return ratioAnswer(
    parameters.state.partners.map((item) => item.capitalSegments[0]!.capital),
  );
}

function durationRatio(parameters: Prt001PilotParameters): Prt001TaskAnswer {
  return ratioAnswer(
    parameters.state.partners.map((_item, index) => firstDuration(parameters, index)),
  );
}

function finalReceiptDifference(
  parameters: Prt001PilotParameters,
  receipts: Readonly<Record<string, Rational>>,
): Rational {
  const [a, b] = parameters.state.partners;
  return abs(subtractRational(receipts[a!.partnerId]!, receipts[b!.partnerId]!));
}

export function solvePrt001E2Task(
  parameters: Prt001PilotParameters,
  solution: Prt001Solution,
): Prt001TaskAnswer {
  switch (parameters.entry.solveMode) {
    case "findTotalProfitFromShareDifferenceAndCapitals":
    case "findTotalProfitFromSleepingPartnerReceipt":
    case "findTotalProfitFromMixedTimelineFinalReceipt":
      return rationalAnswer(parameters, parameters.state.grossProfitOrLoss);
    case "findCapitalRatioFromProfitRatioAndTimeRatio":
    case "findCapitalRatioFromPartnerShareRelations":
      return capitalRatio(parameters);
    case "findTimeRatioFromProfitRatioAndCapitalRatio":
      return durationRatio(parameters);
    case "findProfitRatioWithMultipleChangesForOnePartner":
    case "findFourPartnerProfitRatio":
      return ratioAnswer(
        solution.timeline.weights.map((item) => item.effectiveCapital),
      );
    case "findUnknownCapitalChangeTimeFromProfitRatio":
      return rationalAnswer(
        parameters,
        parameters.state.partners[0]!.capitalSegments[1]!.start,
      );
    case "findUnknownDurationInThreePartnerSystem":
      return rationalAnswer(parameters, firstDuration(parameters, 2));
    case "findPartnerReceiptWithSalaryAndDeduction":
    case "findShareWithDynamicCapitalAndPercentCommission":
      return rationalAnswer(
        parameters,
        solution.finalPartnerReceipts[parameters.targetPartnerId!]!,
      );
    case "findUnknownJoinTimeWithCapitalChangeHistory":
      return rationalAnswer(
        parameters,
        parameters.state.partners[1]!.capitalSegments[0]!.start,
      );
    case "findDifferenceBetweenFinalReceiptsInMixedSystem":
      return rationalAnswer(
        parameters,
        finalReceiptDifference(parameters, solution.finalPartnerReceipts),
      );
    default:
      throw new Error(`E2 task solver does not support ${parameters.entry.solveMode}`);
  }
}

export function independentlySolvePrt001E2Task(
  parameters: Prt001PilotParameters,
  verification: Prt001IndependentVerification,
): Prt001TaskAnswer {
  const partners = parameters.state.partners;
  const weights = verification.weights.map((item) => item.effectiveCapital);
  const totalWeight = weights.reduce(addRational, ZERO);
  switch (parameters.entry.solveMode) {
    case "findTotalProfitFromShareDifferenceAndCapitals": {
      const difference = abs(
        subtractRational(
          verification.distributedShares[partners[0]!.partnerId]!,
          verification.distributedShares[partners[1]!.partnerId]!,
        ),
      );
      const weightDifference = abs(subtractRational(weights[0]!, weights[1]!));
      const reconstructed = divideRational(
        multiplyRational(difference, totalWeight),
        weightDifference,
      );
      return rationalAnswer(parameters, reconstructed);
    }
    case "findCapitalRatioFromProfitRatioAndTimeRatio":
    case "findCapitalRatioFromPartnerShareRelations":
      return ratioAnswer(
        weights.map((weight, index) =>
          divideRational(weight, firstDuration(parameters, index)),
        ),
      );
    case "findTimeRatioFromProfitRatioAndCapitalRatio":
      return ratioAnswer(
        weights.map((weight, index) =>
          divideRational(
            weight,
            partners[index]!.capitalSegments[0]!.capital,
          ),
        ),
      );
    case "findProfitRatioWithMultipleChangesForOnePartner":
    case "findFourPartnerProfitRatio":
      return ratioAnswer(weights);
    case "findUnknownCapitalChangeTimeFromProfitRatio": {
      const [first, second] = partners[0]!.capitalSegments;
      const total = parameters.state.totalDuration;
      const numerator = subtractRational(
        weights[0]!,
        multiplyRational(second!.capital, total),
      );
      const denominator = subtractRational(first!.capital, second!.capital);
      return rationalAnswer(parameters, divideRational(numerator, denominator));
    }
    case "findUnknownDurationInThreePartnerSystem":
      return rationalAnswer(
        parameters,
        divideRational(weights[2]!, partners[2]!.capitalSegments[0]!.capital),
      );
    case "findTotalProfitFromSleepingPartnerReceipt": {
      const targetId = parameters.targetPartnerId!;
      const targetIndex = partners.findIndex((item) => item.partnerId === targetId);
      const sleepingReceipt = verification.finalPartnerReceipts[targetId]!;
      const pool = divideRational(
        multiplyRational(sleepingReceipt, totalWeight),
        weights[targetIndex]!,
      );
      const salary = parameters.state.allocations.find((item) => item.kind === "SALARY")!.value;
      return rationalAnswer(parameters, addRational(pool, salary));
    }
    case "findPartnerReceiptWithSalaryAndDeduction":
    case "findShareWithDynamicCapitalAndPercentCommission":
      return rationalAnswer(
        parameters,
        verification.finalPartnerReceipts[parameters.targetPartnerId!]!,
      );
    case "findUnknownJoinTimeWithCapitalChangeHistory": {
      const bCapital = partners[1]!.capitalSegments[0]!.capital;
      const activeDuration = divideRational(weights[1]!, bCapital);
      return rationalAnswer(
        parameters,
        subtractRational(parameters.state.totalDuration, activeDuration),
      );
    }
    case "findTotalProfitFromMixedTimelineFinalReceipt": {
      const targetId = parameters.targetPartnerId!;
      const targetIndex = partners.findIndex((item) => item.partnerId === targetId);
      const salary = parameters.state.allocations.find((item) => item.kind === "SALARY")!.value;
      const finalReceipt = verification.finalPartnerReceipts[targetId]!;
      const distributed = subtractRational(finalReceipt, salary);
      const pool = divideRational(
        multiplyRational(distributed, totalWeight),
        weights[targetIndex]!,
      );
      return rationalAnswer(parameters, addRational(pool, salary));
    }
    case "findDifferenceBetweenFinalReceiptsInMixedSystem":
      return rationalAnswer(
        parameters,
        finalReceiptDifference(parameters, verification.finalPartnerReceipts),
      );
    default:
      throw new Error(`E2 independent solver does not support ${parameters.entry.solveMode}`);
  }
}
