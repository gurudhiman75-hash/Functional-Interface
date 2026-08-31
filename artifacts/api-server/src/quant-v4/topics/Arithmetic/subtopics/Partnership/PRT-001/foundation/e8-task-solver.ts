import type {
  Prt001IndependentVerification,
  Prt001PilotParameters,
  Prt001Solution,
  Prt001TaskAnswer,
  Rational,
} from "./types";
import { formatPrt001Money } from "./parameter-generator";

function moneyAnswer(exact: Rational): Prt001TaskAnswer {
  return { kind: "RATIONAL", exact, display: formatPrt001Money(exact) };
}

export function solvePrt001E8Task(
  parameters: Prt001PilotParameters,
  solution: Prt001Solution,
): Prt001TaskAnswer {
  switch (parameters.questionLanguageId) {
    case "PRT-QL-104":
      return moneyAnswer(solution.finalPartnerReceipts[parameters.targetPartnerId!]!);
    case "PRT-QL-105":
      return moneyAnswer(solution.distributedShares[parameters.targetPartnerId!]!);
    default:
      throw new Error(`E8 task solver does not support ${parameters.questionLanguageId}`);
  }
}

export function independentlySolvePrt001E8Task(
  parameters: Prt001PilotParameters,
  verification: Prt001IndependentVerification,
): Prt001TaskAnswer {
  switch (parameters.questionLanguageId) {
    case "PRT-QL-104":
      return moneyAnswer(verification.finalPartnerReceipts[parameters.targetPartnerId!]!);
    case "PRT-QL-105":
      return moneyAnswer(verification.distributedShares[parameters.targetPartnerId!]!);
    default:
      throw new Error(`E8 independent task solver does not support ${parameters.questionLanguageId}`);
  }
}
