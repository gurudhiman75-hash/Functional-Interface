import type { Rap003Explanation, Rap003Parameters } from "./types";

function domain(parameters: Rap003Parameters) {
  const task = parameters.taskKind;
  if (task.startsWith("partnership") || task === "workContributionShare") return "partnership";
  if (task.startsWith("age")) return "age";
  if (/income|expenditure|expense|savings|salarySpending|shopRevenue|pocketMoney|familyIncome|givenOneSaves|givenOneSpends|equalIncome|equalExpense/.test(task)) return "income";
  if (/alloy|weightedAverage|averagePrice|mixingRatio|marksAverage|reverseWeighted|weightedProfit|weightedDiscount|sugarSolution/.test(task)) return "mixture";
  if (task.startsWith("replacement")) return "replacement";
  if (/denomination|ticketValue|marksPerQuestion/.test(task)) return "denomination";
  if (/^sdt|fixedDistance|fixedTime|trainPlatform|workEfficiency|machinesOutput|pipesTime|workersEfficiency|findMissingRate|timeSaved|distanceSlower|sameWork|rateProduct|relativeSpeed/.test(task)) return "rate";
  if (task.startsWith("population")) return "population";
  if (/^election|marketShare|surveyResponse/.test(task)) return "election";
  if (/^geometric|^mapScale|similarSolid/.test(task)) return "geometry";
  return "ratio";
}

function calculationSentence(parameters: Rap003Parameters) {
  switch (domain(parameters)) {
    case "partnership": return "Use the investment-time ratio in the profit calculation.";
    case "age": return "Solve the age equation with the same time shift on both ages.";
    case "income": return "Use income minus expenditure to apply the savings condition.";
    case "mixture": return "Use the component balance to calculate the required mixture value.";
    case "replacement": return "Apply the retained fraction for the stated number of rounds.";
    case "denomination": return "Use the weighted denomination total to calculate the missing count or value.";
    case "rate": return "Use the rate-time relation with consistent units.";
    case "population": return "Use the completed row and column totals for the requested population cell.";
    case "election": return "Use the electorate-to-candidate vote chain in the required direction.";
    case "geometry": return "Apply the square or cube relation and simplify.";
    default: return "Substitute the stated values in the ratio equation and simplify.";
  }
}

function replaceGenericProse(parameters: Rap003Parameters, line: string) {
  const sentence = calculationSentence(parameters);
  return line
    .replace(/^Substituting the given values gives\.?$/i, sentence)
    .replace(/^Now substitute and simplify\.?$/i, sentence)
    .replace(/^Rearrange the relation to the requested ratio or time\.?$/i, sentence)
    .replace(/^Compute the weighted component amount and divide by the total mixture\.?$/i, sentence)
    .replace(/^Apply the savings condition or form the final savings ratio\.?$/i, sentence)
    .replace(/^Use the time shift or age difference to find the common unit\.?$/i, sentence)
    .replace(/^Use the stated valid votes or reverse the margin into valid votes\.?$/i, sentence)
    .replace(/^Raise the retention factor to the number of rounds\.?$/i, sentence)
    .replace(/^Use the relevant cells from the completed table\.?$/i, sentence)
    .replace(/^The substituted values satisfy the relation in the question\.?$/i, "The calculated value satisfies the numerical condition in the stem.");
}

function cleanMathLabels(line: string) {
  return line
    .replace(/\\text\{Setup\}=/g, "")
    .replace(/\\text\{Equation\}=/g, "")
    .replace(/\\text\{Calculation\}=/g, "")
    .replace(/\\text\{Result\}=/g, "")
    .replace(/\\text\{Answer\}=/g, "")
    .replace(/\\text\{Target ratio\}=/g, "")
    .replace(/\\text\{Required ratio\}=/g, "");
}

export function polishRap003EditorialLines(
  parameters: Rap003Parameters,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en") return explanation;
  const lines = explanation.lines.map((value) => {
    const cleaned = cleanMathLabels(value);
    const mathIndex = cleaned.indexOf("\n\n$$");
    if (mathIndex < 0) return replaceGenericProse(parameters, cleaned);
    const prose = cleaned.slice(0, mathIndex);
    const math = cleaned.slice(mathIndex);
    return `${replaceGenericProse(parameters, prose)}${math}`;
  });
  return { ...explanation, lines };
}
