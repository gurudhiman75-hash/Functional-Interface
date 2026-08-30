import {
  addRational,
  divideRational,
  normalizeRatio,
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

function ratioAnswer(weights: readonly Rational[]): Prt001TaskAnswer {
  const ratio = normalizeRatio(weights);
  return { kind: "RATIO", ratio, display: ratio.join(":") };
}

function rationalAnswer(parameters: Prt001PilotParameters, exact: Rational): Prt001TaskAnswer {
  return {
    kind: "RATIONAL",
    exact,
    display:
      parameters.entry.answerType === "DURATION"
        ? formatPrt001Duration(exact, parameters.language)
        : formatPrt001Money(exact),
  };
}

function structuralAnswer(parameters: Prt001PilotParameters): Rational {
  const [partnerA, partnerB, partnerC] = parameters.state.partners;
  switch (parameters.entry.solveMode) {
    case "findUnknownLeaveTimeFromProfitRatio":
      return partnerA!.capitalSegments.at(-1)!.end;
    case "findUnknownCapitalOfLateJoiningPartner":
      return partnerB!.capitalSegments[0]!.capital;
    case "findUnknownCapitalWithStaggeredParticipation":
      if (!partnerC) throw new Error("missing third partner");
      return partnerC.capitalSegments[0]!.capital;
    default:
      throw new Error(`no E1 structural answer for ${parameters.entry.solveMode}`);
  }
}

export function solvePrt001E1Task(
  parameters: Prt001PilotParameters,
  solution: Prt001Solution,
): Prt001TaskAnswer {
  switch (parameters.entry.solveMode) {
    case "findProfitRatioWithJoinAndLeaveEvents":
    case "findProfitRatioAfterPercentageCapitalIncrease":
    case "findProfitRatioWithChangesForMultiplePartners":
    case "findProfitRatioWithJoinLeaveAndCapitalChange":
      return ratioAnswer(solution.timeline.weights.map((item) => item.effectiveCapital));
    case "findSharesFromCapitalMultiplesAndDurations":
      return rationalAnswer(parameters, solution.distributedShares[parameters.targetPartnerId!]!);
    case "findPartnerReceiptsWithMultipleOrderedAllocations":
      return rationalAnswer(parameters, solution.finalPartnerReceipts[parameters.targetPartnerId!]!);
    case "findTotalProfitFromActivePartnerFinalReceipt":
      return rationalAnswer(parameters, parameters.state.grossProfitOrLoss);
    case "findUnknownLeaveTimeFromProfitRatio":
    case "findUnknownCapitalOfLateJoiningPartner":
    case "findUnknownCapitalWithStaggeredParticipation":
      return rationalAnswer(parameters, structuralAnswer(parameters));
    default:
      throw new Error(`E1 task solver does not support ${parameters.entry.solveMode}`);
  }
}

export function independentlySolvePrt001E1Task(
  parameters: Prt001PilotParameters,
  verification: Prt001IndependentVerification,
): Prt001TaskAnswer {
  switch (parameters.entry.solveMode) {
    case "findProfitRatioWithJoinAndLeaveEvents":
    case "findProfitRatioAfterPercentageCapitalIncrease":
    case "findProfitRatioWithChangesForMultiplePartners":
    case "findProfitRatioWithJoinLeaveAndCapitalChange":
      return ratioAnswer(verification.weights.map((item) => item.effectiveCapital));
    case "findSharesFromCapitalMultiplesAndDurations":
      return rationalAnswer(parameters, verification.distributedShares[parameters.targetPartnerId!]!);
    case "findPartnerReceiptsWithMultipleOrderedAllocations":
      return rationalAnswer(parameters, verification.finalPartnerReceipts[parameters.targetPartnerId!]!);
    case "findTotalProfitFromActivePartnerFinalReceipt": {
      const finalReceipt = verification.finalPartnerReceipts[parameters.targetPartnerId!]!;
      const salary = parameters.state.allocations.find((item) => item.kind === "SALARY")!.value;
      const targetWeight = verification.weights.find(
        (item) => item.partnerId === parameters.targetPartnerId,
      )!.effectiveCapital;
      const totalWeight = verification.weights
        .map((item) => item.effectiveCapital)
        .reduce(addRational);
      const targetFraction = divideRational(targetWeight, totalWeight);
      const ratioShare = subtractRational(finalReceipt, salary);
      const distributable = divideRational(ratioShare, targetFraction);
      return rationalAnswer(parameters, addRational(distributable, salary));
    }
    case "findUnknownLeaveTimeFromProfitRatio":
    case "findUnknownCapitalOfLateJoiningPartner":
    case "findUnknownCapitalWithStaggeredParticipation":
      return rationalAnswer(parameters, structuralAnswer(parameters));
    default:
      throw new Error(`E1 independent task solver does not support ${parameters.entry.solveMode}`);
  }
}
