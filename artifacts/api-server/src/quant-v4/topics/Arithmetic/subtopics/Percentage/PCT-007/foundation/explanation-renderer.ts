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

export function renderPct007Explanation(
  parameters: Pct007Parameters,
  solver: Pct007SolverResult,
  _graph: Pct007ReasoningGraph,
): Pct007Explanation {
  const lines: string[] = [];
  const renderedAnswer = solver.answer.replaceAll("$$", "");

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
          "Marks questions are solved by taking the required percentage of the total, or by reversing that step when the part is given.",
          `\\text{Required marks} = \\frac{\\text{Rate}}{100}\\times\\text{Total}`,
        ),
        ...pair("Apply the percentage relation to the given data.", String(solver.mathJax["core"] ?? "")),
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
          "Election questions move in stages: registered voters, votes polled, valid votes, and then candidate votes or margin.",
          `\\text{Votes polled} = \\frac{\\text{Turnout rate}}{100}\\times\\text{Total voters}`,
        ),
      );
      if (votesPolled > 0) {
        lines.push(...pair(`First find the votes polled.`, `\\text{Votes polled}=${formatNumber(votesPolled)}`));
      }
      if (validVotes > 0) {
        lines.push(...pair(`After removing invalid votes, we get the valid votes.`, `\\text{Valid votes}=${formatNumber(validVotes)}`));
      }
      lines.push(...pair("Now apply the final step required in the question.", String(solver.mathJax["core"] ?? "")));
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
          "For population, production, and consumption applications, keep the original quantity as the base unless the question explicitly changes it.",
          `\\text{New value} = \\text{Old value}\\times\\frac{100\\pm\\text{Rate}}{100}`,
        ),
        ...pair("Use the required increase, decrease, used, or remaining relation.", String(solver.mathJax["core"] ?? "")),
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
          "Direct mixture questions depend only on the component share of the total mixture.",
          `\\text{Component amount} = \\frac{\\text{Component rate}}{100}\\times\\text{Total mixture}`,
        ),
        ...pair("Apply the direct component-percentage relation or reverse it as needed.", String(solver.mathJax["core"] ?? "")),
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
        ...pair("First express the unchanged solid or solute quantity.", `\\text{Stable part}=${formatNumber(Number(solver.evidence["solidAmount"] ?? solver.evidence["soluteAmount"] ?? 0))}`),
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
          "Billing questions are solved by applying each percentage on the correct base amount in order.",
          `\\text{Part} = \\frac{\\text{Rate}}{100}\\times\\text{Base amount}`,
        ),
        ...pair("Compute the intermediate bill or charge first where needed.", String(solver.mathJax["core"] ?? "")),
        ...pair(`So the required bill amount or charge is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    }
    case "findPercentageErrorFromWrongAndCorrect":
    case "findCorrectValueFromOverstatement":
    case "findCorrectValueFromUnderstatement":
    case "findPercentageErrorOnBill":
    case "findActualValueFromMeasuredError": {
      lines.push(
        ...pair(
          "Percentage error is always measured on the correct value, not on the wrong value.",
          `\\text{Percentage error} = \\frac{\\text{Absolute error}}{\\text{Correct value}}\\times100`,
        ),
        ...pair("Use that relation directly, or reverse it when the wrong value and error rate are given.", String(solver.mathJax["core"] ?? "")),
        ...pair(`So the required result is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    }
    case "findRemainingAfterOneRemoval":
    case "findRemainingAfterTwoSameRemovals":
    case "findRemainingAfterThreeSameRemovals":
    case "findRemainingAfterTwoDifferentRemovals":
    case "findTotalRemovedAfterTwoDifferentRemovals": {
      lines.push(
        ...pair(
          "Repeated reduction always acts on the current remainder, not on the original quantity again.",
          `\\text{Remainder after one step} = \\text{Current quantity}\\times\\frac{100-\\text{Rate}}{100}`,
        ),
        ...pair("Apply the reduction step in sequence.", String(solver.mathJax["core"] ?? "")),
        ...pair(`So the required remaining or used quantity is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    }
    case "findCaseletSavings":
    case "findCaseletCandidateVotes":
    case "findCaseletFinalBill":
    case "findCaseletRemainingGoodUnits":
    case "findCaseletComparison": {
      const subjectA = asString(parameters, "subjectA", "First");
      const subjectB = asString(parameters, "subjectB", "Second");
      lines.push(
        ...pair(
          "For a mini caselet, first reduce the given facts to one clean percentage computation.",
          `\\text{Use only the facts stated in the stem}`,
        ),
        ...pair("Carry out that single deterministic computation.", String(solver.mathJax["core"] ?? "")),
      );
      if (parameters.solveMode === "findCaseletComparison") {
        lines.push(...pair(`Now compare the actual values of ${subjectA} and ${subjectB}.`, `\\text{Comparison}=${renderedAnswer}`));
      } else {
        lines.push(...pair("This gives the required caselet result directly.", `\\text{Result}=${renderedAnswer}`));
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
