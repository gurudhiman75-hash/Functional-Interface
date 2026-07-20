import type { Rap003Explanation, Rap003Parameters } from "./types";

function supportLines(parameters: Rap003Parameters) {
  switch (parameters.taskKind) {
    case "partnershipNewPartnerCapital":
      return [
        "The new partner's capital is chosen so that the investment-time products match the required profit ratio.",
        "Substituting the calculated capital reproduces that profit-sharing ratio.",
      ];
    case "partnershipTimeFromProfitRatio":
      return [
        "Only the investment period is unknown; the capital amounts remain fixed.",
        "Substituting the calculated time reproduces the required profit ratio.",
      ];
    case "partnershipCapitalRatioTimeRatio":
      return [
        "Capital ratio alone is insufficient because the investment periods are different.",
        "The reduced investment-time products determine the final profit ratio.",
      ];
    case "workContributionShare":
      return [
        "Efficiency alone does not determine contribution; the number of days must also be included.",
        "The reduced efficiency-day products give the contribution ratio.",
      ];
    case "partnershipProfitFromKnownShare":
      return [
        "The known share and its effective-contribution fraction refer to the same total profit.",
        "Multiplying back by the reciprocal recovers the complete profit.",
      ];
    case "partnershipTargetPartnerShareFromRatio":
      return [
        "The effective ratio already includes the relevant capital and time effects.",
        "The two partner shares together use the complete profit amount.",
      ];
    case "partnershipRemainingProfitAfterCommission":
      return [
        "Commission is removed before the remaining profit is divided.",
        "The partner shares together equal the post-commission profit.",
      ];
    default:
      return [
        "The distributable amount is divided only after the effective contributions have been calculated.",
        "The resulting partner shares follow the investment-time ratio.",
      ];
  }
}

export function ensureRap003MeaningfulSupport(
  parameters: Rap003Parameters,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en" || explanation.lines.length >= 7) return explanation;
  const finalIndex = explanation.lines.findIndex((line) => /^So,/i.test(line.trim()));
  const insertAt = finalIndex >= 0 ? finalIndex : explanation.lines.length;
  const lines = [...explanation.lines];
  for (const support of supportLines(parameters)) {
    if (lines.length >= 7) break;
    lines.splice(insertAt, 0, support);
  }
  return { ...explanation, lines };
}
