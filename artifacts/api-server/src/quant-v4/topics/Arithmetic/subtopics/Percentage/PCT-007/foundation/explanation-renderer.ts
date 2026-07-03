import { formatNumber, formatPercent, mathJaxBlock } from "./math";
import type { Pct007Explanation, Pct007Parameters, Pct007ReasoningGraph, Pct007SolverResult } from "./types";

function pair(statement: string, expression: string) {
  return [statement, mathJaxBlock(expression)];
}

function asNumber(parameters: Pct007Parameters, key: string) {
  return Number(parameters.variables[key] ?? 0);
}

function asString(parameters: Pct007Parameters, key: string, fallback = "") {
  return String(parameters.variables[key] ?? fallback);
}

function stableDryingPart(parameters: Pct007Parameters, solver: Pct007SolverResult) {
  const direct = Number(solver.evidence["solidAmount"] ?? solver.evidence["soluteAmount"] ?? NaN);
  if (Number.isFinite(direct)) return direct;

  const baseValue = asNumber(parameters, "baseValue");
  const waterRate = asNumber(parameters, "waterRate");
  if (baseValue > 0 && waterRate > 0) return (baseValue * (100 - waterRate)) / 100;

  const oldRate = asNumber(parameters, "oldRate");
  if (baseValue > 0 && oldRate > 0) return (baseValue * oldRate) / 100;

  const finalWeight = asNumber(parameters, "value1");
  const dryWaterRate = asNumber(parameters, "dryWaterRate");
  if (finalWeight > 0 && dryWaterRate > 0) return (finalWeight * (100 - dryWaterRate)) / 100;

  return 0;
}

function cleanRenderedAnswer(answer: string) {
  return answer.replaceAll("$$", "").trim().replace(/\.+$/, "");
}

export function renderPct007Explanation(
  parameters: Pct007Parameters,
  solver: Pct007SolverResult,
  _graph: Pct007ReasoningGraph,
): Pct007Explanation {
  const lines: string[] = [];
  const renderedAnswer = cleanRenderedAnswer(solver.answer);

  switch (parameters.solveMode) {
    case "findSavingsFromSpendRate":
    case "findExpenditureFromSavingsRate":
    case "findIncomeFromSavingsAmount":
    case "findIncomeFromExpenditureAmount":
    case "findExpenditureFromSavingsAmount": {
      const income = Number(solver.evidence["income"] ?? 0);
      const savingsRate = Number(solver.evidence["savingsRate"] ?? 0);
      const spendRate = Number(solver.evidence["spendRate"] ?? solver.evidence["expenditureRate"] ?? 0);
      lines.push(
        ...pair(
          "Income, expenditure, and savings are parts of the same base, so first identify the relevant percentage of income.",
          `\\text{Savings rate} + \\text{Expenditure rate} = 100\\%`,
        ),
      );
      if (income > 0) {
        lines.push(...pair("Now use the identified percentage on the income.", String(solver.mathJax["core"] ?? "")));
      } else {
        lines.push(...pair("Recover the income from the known percentage part first.", String(solver.mathJax["core"] ?? "")));
      }
      if (savingsRate > 0) {
        lines.push(...pair(`The savings percentage here is ${formatPercent(savingsRate)}.`, `\\text{Savings rate}=${formatPercent(savingsRate)}`));
      } else if (spendRate > 0) {
        lines.push(...pair(`The expenditure percentage here is ${formatPercent(spendRate)}.`, `\\text{Expenditure rate}=${formatPercent(spendRate)}`));
      }
      lines.push(...pair(`So the required answer is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`));
      break;
    }
    case "findMarksFromTotalMarks":
    case "findTotalFromMarksPercent":
    case "findPassMarksFromTotalMarks":
    case "findTotalFromFailMargin":
    case "findTotalFromPassMargin": {
      lines.push(
        ...pair(
          "Use the marks percentage relation from the question and substitute the given values.",
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair("This directly gives the required marks or total marks.", `\\text{Result}=${renderedAnswer}`),
      );
      break;
    }
    case "findVotesPolledFromTurnout":
    case "findValidVotesFromInvalidRate":
    case "findCandidateVotesFromValidVotes":
    case "findWinningMarginFromVoteShare":
    case "findTotalVotersFromVotesPolled": {
      const votesPolled = Number(solver.evidence["votesPolled"] ?? 0);
      const validVotes = Number(solver.evidence["validVotes"] ?? 0);
      lines.push(
        ...pair(
          "Election questions move in stages: votes polled, valid votes, and then the required candidate votes or margin.",
          `\\text{Votes polled} = \\frac{\\text{Turnout rate}}{100}\\times\\text{Total voters}`,
        ),
      );

      if (parameters.solveMode === "findVotesPolledFromTurnout" || parameters.solveMode === "findTotalVotersFromVotesPolled") {
        lines.push(...pair("Now apply the turnout relation directly or reverse it as required.", String(solver.mathJax["core"] ?? "")));
      } else if (parameters.solveMode === "findValidVotesFromInvalidRate") {
        if (votesPolled > 0) {
          lines.push(...pair("First find the votes polled.", `\\text{Votes polled}=${formatNumber(votesPolled)}`));
        }
        lines.push(...pair("Now remove invalid votes from the polled votes.", String(solver.mathJax["core"] ?? "")));
      } else if (parameters.solveMode === "findCandidateVotesFromValidVotes") {
        if (votesPolled > 0) {
          lines.push(...pair("First find the votes polled.", `\\text{Votes polled}=${formatNumber(votesPolled)}`));
        }
        if (validVotes > 0) {
          lines.push(...pair("After removing invalid votes, we get the valid votes.", `\\text{Valid votes}=${formatNumber(validVotes)}`));
        }
        lines.push(...pair("Now apply the candidate's share to the valid votes.", String(solver.mathJax["core"] ?? "")));
      } else {
        if (votesPolled > 0) {
          lines.push(...pair("First find the votes polled.", `\\text{Votes polled}=${formatNumber(votesPolled)}`));
        }
        if (validVotes > 0) {
          lines.push(...pair("After removing invalid votes, we get the valid votes.", `\\text{Valid votes}=${formatNumber(validVotes)}`));
        }
        lines.push(...pair("Now compare the two candidate vote totals.", String(solver.mathJax["core"] ?? "")));
      }

      lines.push(...pair(`So the required answer is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`));
      break;
    }
    case "findRevisedValueAfterIncrease":
    case "findOriginalValueBeforeIncrease":
    case "findRevisedValueAfterDecrease":
    case "findUsedQuantityFromPercent":
    case "findRemainingQuantityFromPercent": {
      lines.push(
        ...pair(
          "Keep the stated quantity as the base and apply the percentage change shown in the question.",
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair(`So the required quantity is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    }
    case "findComponentFromTotalAndRate":
    case "findOtherComponentFromTotalAndRate":
    case "findTotalFromComponentAndRate":
    case "findRateFromComponentAndTotal":
    case "findTotalFromOtherComponentAndRate": {
      lines.push(
        ...pair(
          "Direct mixture questions depend on the component share of the total mixture.",
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair(`So the required result is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    }
    case "findFinalDryWeight":
    case "findWaterLostAfterDrying":
    case "findFinalVolumeAfterEvaporation":
    case "findEvaporatedAmount":
    case "findInitialWeightFromFinalDryWeight": {
      lines.push(
        ...pair(
          "In drying and evaporation, the solid or solute remains unchanged; only the water part changes.",
          `\\text{Unchanged solid or solute} = \\text{same before and after}`,
        ),
        ...pair("First express the unchanged solid or solute quantity.", `\\text{Stable part}=${formatNumber(stableDryingPart(parameters, solver))}`),
        ...pair("Now use the new percentage composition to obtain the required quantity.", String(solver.mathJax["core"] ?? "")),
        ...pair(`So the required answer is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    }
    case "findDiscountAmount":
    case "findBillAfterDiscount":
    case "findTaxOrChargeAmount":
    case "findFinalBillAfterDiscountAndTax":
    case "findCommissionAmount": {
      lines.push(
        ...pair(
          "Apply each billing percentage to the correct amount in the stated order.",
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair(`So the required bill amount or charge is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    }
    case "findPercentageErrorFromWrongAndCorrect":
    case "findCorrectValueFromOverstatement":
    case "findCorrectValueFromUnderstatement":
    case "findPercentageErrorOnBill":
    case "findActualValueFromMeasuredError": {
      const isDirectError =
        parameters.solveMode === "findPercentageErrorFromWrongAndCorrect" ||
        parameters.solveMode === "findPercentageErrorOnBill";
      lines.push(
        ...pair(
          isDirectError
            ? "First find the absolute error, then compare it with the correct value."
            : "Use the stated percentage error to reverse the recorded value.",
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair(`So the required result is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    }
    case "findRemainingAfterOneRemoval":
    case "findRemainingAfterTwoSameRemovals":
    case "findRemainingAfterThreeSameRemovals":
    case "findRemainingAfterTwoDifferentRemovals":
    case "findTotalRemovedAfterTwoDifferentRemovals": {
      const afterFirst = Number(solver.evidence["afterFirst"] ?? NaN);
      const afterSecond = Number(solver.evidence["afterSecond"] ?? NaN);
      const remaining = Number(solver.evidence["remaining"] ?? NaN);
      lines.push(
        ...pair(
          "Repeated reduction always acts on the current remainder, not on the original quantity again.",
          `\\text{Remainder after one step} = \\text{Current quantity}\\times\\frac{100-\\text{Rate}}{100}`,
        ),
      );
      if (Number.isFinite(afterFirst)) {
        lines.push(...pair("After the first reduction, we get the new remainder.", `\\text{After first reduction}=${formatNumber(afterFirst)}`));
      }
      if (Number.isFinite(afterSecond)) {
        lines.push(...pair("After the second reduction, use the new remainder again.", `\\text{After second reduction}=${formatNumber(afterSecond)}`));
      } else if (
        parameters.solveMode !== "findRemainingAfterOneRemoval" &&
        Number.isFinite(remaining) &&
        parameters.solveMode !== "findTotalRemovedAfterTwoDifferentRemovals"
      ) {
        lines.push(...pair("After the repeated reduction, we get the final remainder.", `\\text{Final remainder}=${formatNumber(remaining)}`));
      }

      if (parameters.solveMode === "findTotalRemovedAfterTwoDifferentRemovals") {
        if (Number.isFinite(remaining)) {
          lines.push(...pair("After the second reduction, identify the quantity left.", `\\text{Final remainder}=${formatNumber(remaining)}`));
        }
        lines.push(...pair("Now subtract the final remainder from the original quantity to get the total removed.", String(solver.mathJax["core"] ?? "")));
      } else {
        lines.push(...pair("Now apply the final reduction step required in the question.", String(solver.mathJax["core"] ?? "")));
      }

      lines.push(...pair(`So the required remaining or used quantity is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`));
      break;
    }
    case "findCaseletSavings":
    case "findCaseletCandidateVotes":
    case "findCaseletFinalBill":
    case "findCaseletRemainingGoodUnits":
    case "findCaseletComparison": {
      const subjectA = asString(parameters, "subjectA", "First");
      const subjectB = asString(parameters, "subjectB", "Second");
      const leadByMode: Record<string, string> = {
        findCaseletSavings: "Savings are the part of income left after expenses.",
        findCaseletCandidateVotes: "After removing invalid votes, apply the candidate's share to the valid votes.",
        findCaseletFinalBill: "Apply the discount first, then apply the tax or charge to the reduced bill.",
        findCaseletRemainingGoodUnits: "First remove defective units, then apply the second percentage to the good units.",
        findCaseletComparison: "Convert each percentage into its actual value before comparing the two sides.",
      };
      lines.push(
        ...pair(
          leadByMode[String(parameters.solveMode)] ?? "Use the given percentages in order to reach the required value.",
          String(solver.mathJax["core"] ?? ""),
        ),
      );
      if (parameters.solveMode === "findCaseletComparison") {
        lines.push(...pair(`Now compare the actual values of ${subjectA} and ${subjectB}.`, `\\text{Comparison}=${renderedAnswer}`));
      } else {
        lines.push(...pair(`This gives the required value as ${renderedAnswer}.`, `\\text{Result}=${renderedAnswer}`));
      }
      lines.push(...pair(`So the final answer is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`));
      break;
    }
  }

  return {
    explanationId: parameters.explanationId,
    lines,
  };
}
