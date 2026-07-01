import type {
  ExplanationEvidence,
  ExplanationRenderer,
  ExplanationStep,
} from "./explanation-engine";

type TeacherProfile = {
  opening: readonly string[];
  relation: readonly string[];
  working: readonly string[];
  conclusion: readonly string[];
};

const PROFILES: Record<string, TeacherProfile> = {
  percentToFraction: profile("The percentage must first be written over 100.", "Reduce the resulting fraction to its lowest terms.", "After cancelling the common factor,", "Hence, the percentage in fractional form is"),
  valueAsPercent: profile("Compare the given value with the total on a base of 100.", "Required percentage = given value ÷ total × 100.", "Using the figures in the question,", "Hence, the required percentage is"),
  directRelation: profile("The required quantity is the stated percentage of the base quantity.", "Required quantity = percentage ÷ 100 × base quantity.", "Using the stated percentage and base,", "Hence, the required quantity is"),
  moreToLess: profile("Take the smaller quantity as 100 parts.", "Percentage less is measured on the larger quantity.", "The difference is compared with the larger value,", "Hence, the smaller quantity is less by"),
  lessToMore: profile("Take the larger quantity as 100 parts.", "Percentage more is measured on the smaller quantity.", "The difference is compared with the smaller value,", "Hence, the larger quantity is more by"),
  ratioFromPercentEquality: profile("Equate the two percentage amounts.", "If p% of one quantity equals q% of another, their ratio is q:p.", "Reversing the percentage coefficients and simplifying,", "Hence, the required ratio is"),
  increaseNewValue: profile("The increase is added to the original amount.", "New value = original value × (100 + increase)% ÷ 100.", "Using the original value and increase rate,", "Hence, the increased value is"),
  decreaseNewValue: profile("The decrease is removed from the original amount.", "New value = original value × (100 − decrease)% ÷ 100.", "Using the original value and decrease rate,", "Hence, the reduced value is"),
  reverseIncrease: profile("The final amount represents more than 100% of the original.", "Original value = final value × 100 ÷ final percentage.", "Expressing the increased amount as a percentage of the original,", "Hence, the original value is"),
  reverseDecrease: profile("The final amount is the percentage left after the decrease.", "Original value = final value × 100 ÷ remaining percentage.", "Using the remaining percentage,", "Hence, the original value is"),
  increaseByAmount: profile("The added amount itself represents the stated percentage of the original.", "Original value = increase amount × 100 ÷ increase rate.", "Comparing the increase with the original base,", "Hence, the original value is"),
  percentOfKnownNumber: profile("Both amounts refer to the same number.", "Required amount = known amount × required percentage ÷ known percentage.", "The common number cancels in the proportion,", "Hence, the required amount is"),
  differenceOfPercents: profile("The difference of the two rates represents the given difference in value.", "Number = stated difference × 100 ÷ difference of rates.", "Using the percentage gap,", "Hence, the number is"),
  restoreAfterDecrease: profile("The lost percentage must be restored on the smaller remaining base.", "Required increase = decrease × 100 ÷ remaining percentage.", "Comparing the loss with the reduced value,", "Hence, the required increase is"),
  successiveIncrease: profile("The second increase acts on the already increased value.", "Equivalent increase = first increase + second increase + product ÷ 100.", "Combining the two successive increases,", "Hence, the single equivalent increase is"),
  compoundGrowth: profile("Each period multiplies the quantity by the same growth factor.", "Final value = initial value × growth factor for each period.", "Applying the growth factor successively,", "Hence, the value after the stated periods is"),
  compoundDecay: profile("Each period leaves the same fraction of the previous value.", "Final value = initial value × decay factor for each period.", "Applying the decay factor successively,", "Hence, the remaining value is"),
  areaChange: profile("Area changes with both length and breadth.", "New area factor = length factor × breadth factor.", "Multiplying the two dimensional changes,", "Hence, the percentage change in area is"),
  squareAreaChange: profile("The area of a square depends on the square of its side.", "New area factor = new side factor².", "Squaring the changed side factor,", "Hence, the percentage change in area is"),
  invarianceDecrease: profile("The product of the two quantities must remain unchanged.", "Required decrease = increase × 100 ÷ (100 + increase).", "Balancing the increase with an inverse change,", "Hence, the required decrease is"),
  invarianceIncrease: profile("The product of the two quantities must remain unchanged.", "Required increase = decrease × 100 ÷ (100 − decrease).", "Balancing the fall with an inverse change,", "Hence, the permissible increase is"),
  restoreAfterIncrease: profile("The reduction is calculated on the increased value.", "Required reduction = increase × 100 ÷ (100 + increase).", "Comparing the excess with the new value,", "Hence, the required reduction is"),
  revenueChange: profile("Revenue changes through both the rate and the number of sales.", "New revenue factor = new rate factor × new sales factor.", "Combining the two effects,", "Hence, the net change in revenue is"),
  circleAreaDecrease: profile("The area of a circle varies as the square of its radius.", "New area factor = new radius factor².", "Squaring the remaining radius factor,", "Hence, the percentage decrease in area is"),
  incomePartition: profile("Savings are the portion left after all stated expenses.", "Savings percentage = 100 − total expense percentage.", "The given saving is matched with this remaining percentage,", "Hence, the total income is"),
  successiveExpense: profile("Each later expense is taken from the amount still remaining.", "Remaining amount = salary × first remaining fraction × second remaining fraction.", "Working backwards from the final balance,", "Hence, the salary is"),
  winnerVotes: profile("With two candidates, the loser's share is the complement of the winner's share.", "Winning margin percentage = winner percentage − loser percentage.", "The vote margin is matched with this percentage gap,", "Hence, the total number of votes is"),
  cancelledVotes: profile("Only valid votes are divided between the two candidates.", "Margin on total votes = valid-vote fraction × margin among valid votes.", "Relating the actual margin to all votes cast,", "Hence, the total votes are"),
  passMarks: profile("Passing marks equal marks obtained plus the shortage.", "Maximum marks = passing marks × 100 ÷ pass percentage.", "First finding the passing mark and then the full total,", "Hence, the maximum marks are"),
  partToTotal: profile("The given part represents the complementary percentage of the total.", "Total = given part × 100 ÷ represented percentage.", "Matching the known part with its percentage,", "Hence, the total is"),
  complementOfTotal: profile("The required group is the remainder after removing the stated group.", "Required percentage = 100 − stated percentage.", "Applying this complementary percentage to the total,", "Hence, the required number is"),
  moreMarksBase: profile("The larger score represents more than 100% of the smaller score.", "Smaller score = larger score × 100 ÷ represented percentage.", "Working back to the 100% base,", "Hence, the smaller score is"),
  twoShareRemainder: profile("The final share is the percentage left after the first two shares.", "Original amount = remaining amount × 100 ÷ remaining percentage.", "Matching the remainder with its percentage,", "Hence, the original amount is"),
  loserVotes: profile("With two candidates, the winner receives the complementary share.", "Defeat margin percentage = winner percentage − loser percentage.", "Matching the vote margin with this gap,", "Hence, the total number of votes is"),
  dilutionAddWater: profile("The amount of acid remains unchanged when only water is added.", "Initial acid = final concentration × final volume.", "Equating the acid before and after dilution,", "Hence, the water added is"),
  dryFromFresh: profile("The solid matter remains unchanged while water is removed.", "Initial solid matter = final solid matter.", "Equating the unchanged dry matter,", "Hence, the weight of dry fruit is"),
  addSolute: profile("The original water remains unchanged when pure solute is added.", "Original water = water fraction of the final solution.", "Equating the unchanged water content,", "Hence, the pure solute added is"),
  dilutedPercent: profile("The amount of alcohol remains unchanged when water is added.", "New concentration = unchanged alcohol ÷ new total volume × 100.", "Dividing the original alcohol by the enlarged volume,", "Hence, the new concentration is"),
  freshFromDry: profile("The solid matter is unchanged in the fresh and dry states.", "Fresh solid matter = dry solid matter.", "Equating the unchanged solid portion,", "Hence, the fresh weight was"),
  addPureComponent: profile("The original non-alcohol part remains unchanged.", "Original non-alcohol = final non-alcohol fraction × final volume.", "Equating the unchanged non-alcohol content,", "Hence, the pure alcohol added is"),
  evaporationOriginal: profile("Sugar remains unchanged while only water evaporates.", "Initial sugar = final sugar.", "Equating the sugar content before and after evaporation,", "Hence, the original weight was"),
  alloyComplement: profile("Zinc forms the percentage left after copper.", "Zinc percentage = 100 − copper percentage.", "Applying this percentage to the alloy weight,", "Hence, the weight of zinc is"),
  fractionalError: profile("Compare the wrong value with the correct value.", "Percentage error = difference ÷ correct value × 100.", "Using the correct value as the base,", "Hence, the percentage error is"),
  wrongMultiplier: profile("The error comes from multiplying by the wrong fraction.", "Percentage error = change in multiplier ÷ correct multiplier × 100.", "Comparing the two multipliers,", "Hence, the percentage error is"),
  wrongDivisor: profile("Changing the divisor changes the quotient inversely.", "Percentage error = difference between quotients ÷ correct quotient × 100.", "Comparing the correct and wrong quotients,", "Hence, the percentage error is"),
  tieredCommission: profile("Commission must be calculated separately for each applicable slab.", "Total commission = sum of commission from all slabs.", "Adding the slab-wise amounts,", "Hence, the total commission is"),
  tieredTax: profile("Tax must be worked out separately over each taxable slab.", "Total tax = sum of tax charged in all slabs.", "Adding the slab-wise tax amounts,", "Hence, the total tax is"),
  piecewiseRate: profile("Split the total quantity at the rate boundary.", "Total charge = charge below the limit + charge above the limit.", "Adding the two portions,", "Hence, the total charge is"),
  weightedSubgroup: profile("Each subgroup contributes according to both its size and its own rate.", "Overall percentage = sum of weighted subgroup percentages.", "Combining the subgroup contributions,", "Hence, the overall percentage is"),
  hierarchicalPopulation: profile("Work through the population levels in their stated order.", "Each percentage is applied to the population remaining at that stage.", "Following the hierarchy step by step,", "Hence, the required population is"),
  branchAggregation: profile("Calculate the contribution from each branch separately.", "Overall result = sum of all branch contributions.", "Adding the branch-wise values,", "Hence, the combined result is"),
  iterativeDilution: profile("The pure component is reduced at every dilution stage.", "Final pure fraction = product of the retained fractions.", "Multiplying the retained fraction at each stage,", "Hence, the final concentration is"),
  multiTierPiecewiseRate: profile("Separate the total across all applicable tiers.", "Total charge = sum of the charge from every tier.", "Adding the tier-wise amounts,", "Hence, the total charge is"),
  reversePiecewiseRate: profile("Remove the completed slab charges before solving the final slab.", "Amount in final slab = remaining charge ÷ final slab rate.", "Working backwards through the slabs,", "Hence, the original total is"),
  variableReplacement: profile("Each replacement leaves a stated fraction of the pure component.", "Final pure fraction = product of all retained fractions.", "Multiplying the successive retention factors,", "Hence, the pure component remaining is"),
  electionMargin: profile("Convert every voting condition into a percentage of total registered voters.", "Winning margin = winner's total share − loser's total share.", "Matching the actual margin with the resulting percentage gap,", "Hence, the total electorate is"),
  multiStageAttrition: profile("Each stage removes a percentage from the amount entering that stage.", "Final amount = initial amount × all successive retention factors.", "Multiplying the stage-wise retained fractions,", "Hence, the final amount is"),
  shiftedBaseChain: profile("Each percentage is taken on the new base created by the previous step.", "Final value = initial value × successive change factors.", "Following the changing base through the chain,", "Hence, the final value is"),
  simpleLinkage: profile("Make the common term equal in the two ratios.", "The linked ratio is obtained after matching the common quantity.", "Combining the aligned ratios,", "Hence, the combined ratio is"),
  ratioTreeLinkage: profile("Link the ratios through their common quantities.", "Cancel the intermediate quantities to compare the two ends.", "Multiplying along the ratio chain,", "Hence, the required ratio is"),
  scalingByComponent: profile("Find the value represented by one ratio part.", "Required value = value of one part × required ratio parts.", "Scaling from the known component,", "Hence, the required value is"),
  decimalNormalization: profile("Remove the decimals by multiplying both terms by the same power of 10.", "A ratio is unchanged when both terms are multiplied equally.", "Converting both terms to whole numbers and reducing,", "Hence, the simplest ratio is"),
  shareDifference: profile("First find the value represented by one ratio part.", "Difference of shares = difference of ratio terms × value of one part.", "Using the difference between the required ratio terms,", "Hence, the difference of shares is"),
  reversePartition: profile("The stated difference represents the difference of ratio parts.", "Value of one part = stated difference ÷ difference of ratio terms.", "Using one part to rebuild the whole ratio,", "Hence, the total amount is"),
  salaryDistribution: profile("Salary is divided into expenditure and saving in the given ratio.", "Value of one part = total salary ÷ sum of ratio terms.", "Multiplying one part by the saving term,", "Hence, the saving is"),
  twoStateAddition: profile("Represent the original quantities by the given ratio parts.", "After the addition, their new ratio gives one equation.", "Solving the changed-ratio equation,", "Hence, the original required quantity is"),
  twoStateSubtraction: profile("Represent the original quantities by the given ratio parts.", "After the removal, their new ratio gives one equation.", "Solving the changed-ratio equation,", "Hence, the original total is"),
  twoStateTransfer: profile("A transfer decreases one side and increases the other by the same amount.", "Use the final ratio after adjusting both quantities.", "Solving the transfer equation,", "Hence, the original required quantity is"),
  incomeExpenditureSystem: profile("Write income and expenditure in their respective ratio parts.", "Saving = income − expenditure for each person.", "Equating the stated savings condition,", "Hence, the required income is"),
  multiStageTransformation: profile("Apply the addition and removal to the correct sides of the original ratio.", "The transformed quantities must satisfy the final ratio.", "Solving the resulting ratio equation,", "Hence, the original required quantity is"),
  meanProportional: profile("The mean proportional is the square root of the product of the two numbers.", "Mean proportional² = first number × second number.", "Taking the positive square root,", "Hence, the mean proportional is"),
  thirdProportional: profile("For a third proportional, the first two terms repeat in proportion.", "First : second = second : required number.", "Cross-multiplying the proportion,", "Hence, the third proportional is"),
  fourthProportional: profile("Form a proportion with the first three numbers.", "First : second = third : required number.", "Cross-multiplying the proportion,", "Hence, the fourth proportional is"),
  directVariation: profile("In direct variation, both quantities change in the same ratio.", "First value ÷ first base = second value ÷ second base.", "Using the constant ratio,", "Hence, the required value is"),
  inverseVariation: profile("In inverse variation, the product of the two quantities remains constant.", "First pair product = second pair product.", "Equating the two products,", "Hence, the required value is"),
  coinCounting: profile("Convert the value contributed by each coin type into a common money unit.", "Total value = sum of count × denomination for each coin type.", "Using the count ratio and total value,", "Hence, the required number of coins is"),
  multiDenominationMapping: profile("Map each ratio part to the value of its denomination.", "Total value = common count factor × weighted sum of denominations.", "Finding the common count factor,", "Hence, the required coin count is"),
  weightedMapping: profile("Each group contributes its ratio part multiplied by its weight.", "Total weighted value = common factor × weighted ratio sum.", "Finding the common factor from the total,", "Hence, the required quantity is"),
  weightedMarks: profile("Total marks are the sum of marks from each question category.", "Total marks = count × marks per question for all categories.", "Using the question-count ratio,", "Hence, the required number of questions is"),
  binaryMixture: profile("The two components together make the whole mixture.", "Required component = total mixture × its ratio part ÷ sum of ratio terms.", "Dividing the mixture according to the ratio,", "Hence, the required component is"),
  mixtureComponentFinding: profile("Use the known component to determine the value of one ratio part.", "Required component = known component × required parts ÷ known parts.", "Scaling from the known component,", "Hence, the required quantity is"),
  threeComponentMixture: profile("Add all three ratio terms to obtain the total number of parts.", "Required component = total mixture × required parts ÷ total parts.", "Dividing the mixture among the three components,", "Hence, the required component is"),
  variableReplacementRatio: profile("Track the actual amounts after removal and replacement.", "New ratio = adjusted first component : adjusted second component.", "Applying the stated replacement and simplifying,", "Hence, the new ratio is"),
  acidConcentration: profile("Concentration is the acid amount as a percentage of the whole solution.", "Acid percentage = acid volume ÷ total volume × 100.", "Comparing the acid with the complete mixture,", "Hence, the concentration is"),
};

function profile(opening: string, relation: string, working: string, conclusion: string): TeacherProfile {
  return {
    opening: [
      opening,
      `A useful starting point is this: ${opening}`,
      `Begin with this fact: ${opening}`,
      `Notice the key relation: ${opening}`,
      `${opening} This determines the rest of the working.`,
    ],
    relation: [
      relation,
      `The working relation is: ${relation}`,
      `This gives the relation: ${relation}`,
      `Use the relation: ${relation}`,
      `So we write: ${relation}`,
    ],
    working: [
      working,
      working.replace(/^Using /, "With "),
      working.replace(/^Combining /, "On combining "),
      working.replace(/^Applying /, "On applying "),
      working.replace(/^Equating /, "On equating "),
    ],
    conclusion: [
      conclusion,
      conclusion.replace(/^Hence, /, "Therefore, "),
      conclusion.replace(/^Hence, /, "Thus, "),
      conclusion.replace(/^Hence, /, "So, "),
      conclusion.replace(/^Hence, /, "Accordingly, "),
    ],
  };
}

function cleanMath(value: string | undefined, taskKind: string) {
  if (!value) return "";
  const cleaned = value
    .replace(/^\$+|\$+$/g, "")
    .replace(/\\text\{[^}]*\}\s*:\s*/gi, "")
    .replace(/^\s*(?:setup|calculation)\s*:\s*/i, "")
    .replace(/\\text\{(?:setup|calculation)\}/gi, "")
    .replace(/^\\\(|\\\)$/g, "")
    .trim();
  return cleaned.toLowerCase().includes(taskKind.toLowerCase()) ? "" : cleaned;
}

function numericWorking(value: string | undefined, taskKind: string, answer: string) {
  const cleaned = cleanMath(value, taskKind);
  if (!cleaned) return "";
  const proseCheck = cleaned
    .replace(/\\(?:frac|times|div|cdot|left|right|%|sqrt|quad|,)/g, "")
    .replace(/[{}_^()[\]\s+\-*/=.:0-9%]/g, "");
  if (/[A-Za-z]/.test(proseCheck)) return "";
  const compact = cleaned.replace(/[^0-9.:%-]/g, "");
  const compactAnswer = answer.replace(/[^0-9.:%-]/g, "");
  return compact === compactAnswer ? "" : cleaned;
}

function variantIndex(evidence: ExplanationEvidence) {
  const source = JSON.stringify(evidence.variables);
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }
  return hash % 5;
}

function num(variables: Record<string, number | string>, key: string) {
  return Number(variables[key]);
}

function text(variables: Record<string, number | string>, key: string) {
  return String(variables[key]);
}

function signedAnswer(answer: string) {
  return answer.endsWith("%") ? answer : `${answer}`;
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return String(value);
  const rounded = Math.round((value + Number.EPSILON) * 1_000_000) / 1_000_000;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(6).replace(/\.?0+$/, "");
}

function sanitizeMathExpression(expression: string) {
  return expression.replace(/-?\d+\.\d{6,}/g, (match) => formatNumber(Number(match)));
}

function arithmeticChain(taskKind: string, evidence: ExplanationEvidence): string[] {
  const v = evidence.variables;
  const d = evidence.derivedValues;
  const answer = String(evidence.answer);
  const n = (key: string) => num(v, key);
  const s = (key: string) => text(v, key);
  const result = `=${signedAnswer(answer)}`;

  switch (taskKind) {
    case "percentToFraction":
      return [`${n("percentageRate")}\\%=\\frac{${n("percentageRate")}}{100}`, `\\frac{${n("percentageRate")}}{100}`, result];
    case "valueAsPercent":
      return [`\\frac{${n("value")}}{${n("baseValue")}}\\times100`, `${n("value")}\\times\\frac{100}{${n("baseValue")}}`, result];
    case "directRelation":
      return [`${n("percentageRate")}\\%\\text{ of }${n("baseValue")}`, `\\frac{${n("percentageRate")}}{100}\\times${n("baseValue")}`, result];
    case "moreToLess":
      return [`B=100,\\ A=${100 + n("percentageRate")}`, `\\frac{${n("percentageRate")}}{${100 + n("percentageRate")}}\\times100`, result];
    case "lessToMore":
      return [`B=100,\\ A=${100 - n("percentageRate")}`, `\\frac{${n("percentageRate")}}{${100 - n("percentageRate")}}\\times100`, result];
    case "ratioFromPercentEquality":
      return [`${n("rate1")}A=${n("rate2")}B`, `A:B=${n("rate2")}:${n("rate1")}`, result];
    case "increaseNewValue":
      return [`${n("baseValue")}\\times\\frac{100+${n("percentageRate")}}{100}`, `${n("baseValue")}\\times\\frac{${100 + n("percentageRate")}}{100}`, result];
    case "decreaseNewValue":
      return [`${n("baseValue")}\\times\\frac{100-${n("percentageRate")}}{100}`, `${n("baseValue")}\\times\\frac{${100 - n("percentageRate")}}{100}`, result];
    case "reverseIncrease":
      return [`100+${n("percentageRate")}=${100 + n("percentageRate")}\\%`, `\\frac{${n("finalValue")}\\times100}{${100 + n("percentageRate")}}`, result];
    case "reverseDecrease":
      return [`100-${n("percentageRate")}=${100 - n("percentageRate")}\\%`, `\\frac{${n("finalValue")}\\times100}{${100 - n("percentageRate")}}`, result];
    case "increaseByAmount":
      return [`${n("percentageRate")}\\%=${n("value")}`, `\\frac{${n("value")}\\times100}{${n("percentageRate")}}`, result];
    case "percentOfKnownNumber":
      return [`${n("rate1")}\\%=${n("value1")}`, `${n("rate2")}\\%=\\frac{${n("value1")}\\times${n("rate2")}}{${n("rate1")}}`, result];
    case "differenceOfPercents":
      return [`|${n("rate1")}-${n("rate2")}|\\%=${n("value")}`, `\\frac{${n("value")}\\times100}{|${n("rate1")}-${n("rate2")}|}`, result];
    case "restoreAfterDecrease":
      return [`\\text{Remaining}=100-${n("percentageRate")}=${100 - n("percentageRate")}`, `\\frac{${n("percentageRate")}\\times100}{${100 - n("percentageRate")}}`, result];
    case "successiveIncrease":
      return [`${n("rate1")}+${n("rate2")}+\\frac{${n("rate1")}\\times${n("rate2")}}{100}`, `${n("rate1") + n("rate2")}+\\frac{${n("rate1") * n("rate2")}}{100}`, result];
    case "compoundGrowth":
      return [`1+\\frac{${n("percentageRate")}}{100}=\\frac{${100 + n("percentageRate")}}{100}`, `${n("initialValue")}\\left(\\frac{${100 + n("percentageRate")}}{100}\\right)^2`, result];
    case "compoundDecay":
      return [`1-\\frac{${n("percentageRate")}}{100}=\\frac{${100 - n("percentageRate")}}{100}`, `${n("initialValue")}\\left(\\frac{${100 - n("percentageRate")}}{100}\\right)^2`, result];
    case "areaChange":
      return [`\\frac{${100 + n("rate1")}}{100}\\times\\frac{${100 + n("rate2")}}{100}`, `\\left(\\frac{${100 + n("rate1")}}{100}\\times\\frac{${100 + n("rate2")}}{100}-1\\right)100`, result];
    case "squareAreaChange":
      return [`\\text{Side factor}=\\frac{${100 + n("percentageRate")}}{100}`, `\\left[\\left(\\frac{${100 + n("percentageRate")}}{100}\\right)^2-1\\right]100`, result];
    case "invarianceDecrease":
    case "restoreAfterIncrease": {
      const rate = taskKind === "restoreAfterIncrease" ? n("rate1") : n("percentageRate");
      return [`\\text{New base}=100+${rate}=${100 + rate}`, `\\frac{${rate}\\times100}{${100 + rate}}`, result];
    }
    case "invarianceIncrease":
      return [`\\text{New base}=100-${n("percentageRate")}=${100 - n("percentageRate")}`, `\\frac{${n("percentageRate")}\\times100}{${100 - n("percentageRate")}}`, result];
    case "revenueChange":
      return [`\\frac{${100 - n("rate1")}}{100}\\times\\frac{${100 + n("rate2")}}{100}`, `\\left(\\frac{${100 - n("rate1")}\\times${100 + n("rate2")}}{10000}-1\\right)100`, result];
    case "circleAreaDecrease":
      return [`\\text{Radius factor}=\\frac{${100 - n("percentageRate")}}{100}`, `\\left[1-\\left(\\frac{${100 - n("percentageRate")}}{100}\\right)^2\\right]100`, result];
    case "incomePartition": {
      const remaining = 100 - n("rate1") - n("rate2") - n("rate3");
      return [`100-${n("rate1")}-${n("rate2")}-${n("rate3")}=${remaining}\\%`, `\\frac{${n("value")}\\times100}{${remaining}}`, result];
    }
    case "successiveExpense":
      return [`\\text{Remaining fraction}=\\frac{${100 - n("rate1")}}{100}\\times\\frac{${100 - n("rate2")}}{100}`, `\\frac{${n("value")}\\times10000}{${100 - n("rate1")}\\times${100 - n("rate2")}}`, result];
    case "winnerVotes": {
      const gap = 2 * n("percentageRate") - 100;
      return [`${n("percentageRate")}-(100-${n("percentageRate")})=${gap}\\%`, `\\frac{${n("voteDifference")}\\times100}{${gap}}`, result];
    }
    case "cancelledVotes": {
      const valid = 100 - n("rate1");
      const gap = 2 * n("rate2") - 100;
      return [`\\text{Effective gap}=\\frac{${valid}\\times${gap}}{100}\\%`, `\\frac{${n("voteDifference")}\\times10000}{${valid}\\times${gap}}`, result];
    }
    case "passMarks": {
      const passing = n("marksObtained") + n("failMargin");
      return [`${n("marksObtained")}+${n("failMargin")}=${passing}`, `\\frac{${passing}\\times100}{${n("passRate")}}`, result];
    }
    case "partToTotal":
      return [`\\text{Known part}=${100 - n("rate1")}\\%`, `\\frac{${n("value")}\\times100}{${100 - n("rate1")}}`, result];
    case "complementOfTotal":
      return [`100-${n("percentageRate")}=${100 - n("percentageRate")}\\%`, `\\frac{${n("totalPopulation")}\\times${100 - n("percentageRate")}}{100}`, result];
    case "moreMarksBase":
      return [`100+${n("rate1")}=${100 + n("rate1")}\\%`, `\\frac{${n("marks")}\\times100}{${100 + n("rate1")}}`, result];
    case "twoShareRemainder": {
      const remaining = 100 - n("rate1") - n("rate2");
      return [`100-${n("rate1")}-${n("rate2")}=${remaining}\\%`, `\\frac{${n("value")}\\times100}{${remaining}}`, result];
    }
    case "loserVotes": {
      const gap = 100 - 2 * n("rate1");
      return [`(100-${n("rate1")})-${n("rate1")}=${gap}\\%`, `\\frac{${n("voteDifference")}\\times100}{${gap}}`, result];
    }
    case "dilutionAddWater": {
      const acid = n("totalMixture") * n("percentageRate") / 100;
      return [`\\text{Acid}=\\frac{${n("percentageRate")}}{100}\\times${n("totalMixture")}`, `\\text{Final volume}=\\frac{${acid}\\times100}{${n("newRate")}}`, `\\text{Water}=\\frac{${acid}\\times100}{${n("newRate")}}-${n("totalMixture")}=${answer}`];
    }
    case "dryFromFresh":
      return [`\\text{Solid matter}=\\frac{${100 - n("waterRate")}}{100}\\times${n("totalQuantity")}`, `\\text{Dry weight}=\\frac{${n("totalQuantity")}\\times${100 - n("waterRate")}}{${100 - n("dryWaterRate")}}`, result];
    case "addSolute":
      return [`\\text{Water}=\\frac{${100 - n("percentageRate")}}{100}\\times${n("totalMixture")}`, `\\text{Final volume}=\\frac{${n("totalMixture")}\\times${100 - n("percentageRate")}}{${100 - n("newRate")}}`, `\\text{Solute added}=\\text{Final volume}-${n("totalMixture")}=${answer}`];
    case "dilutedPercent":
      return [`\\text{Alcohol}=\\frac{${n("percentageRate")}}{100}\\times${n("totalMixture")}`, `\\frac{${n("totalMixture")}\\times${n("percentageRate")}}{${n("totalMixture") + n("value")}}`, result];
    case "freshFromDry":
      return [`\\text{Dry solid}=\\frac{${100 - n("rate2")}}{100}\\times${n("value")}`, `\\text{Fresh weight}=\\frac{${n("value")}\\times${100 - n("rate2")}}{${100 - n("rate1")}}`, result];
    case "addPureComponent":
      return [`\\text{Non-alcohol}=\\frac{${100 - n("percentageRate")}}{100}\\times${n("totalMixture")}`, `\\text{Final volume}=\\frac{${n("totalMixture")}\\times${100 - n("percentageRate")}}{${100 - n("newRate")}}`, `\\text{Alcohol added}=\\text{Final volume}-${n("totalMixture")}=${answer}`];
    case "evaporationOriginal":
      return [`\\frac{${n("percentageRate")}}{100}W=\\frac{${n("newRate")}}{100}(W-${n("value")})`, `${n("percentageRate")}W=${n("newRate")}W-${n("newRate") * n("value")}`, result];
    case "alloyComplement":
      return [`100-${n("percentageRate")}=${100 - n("percentageRate")}\\%`, `\\frac{${n("totalWeight")}\\times${100 - n("percentageRate")}}{100}`, result];
    case "fractionalError":
      return [`\\text{Correct}=\\frac{${n("correctNumerator")}}{${n("correctDenominator")}},\\quad\\text{Wrong}=\\frac{${n("wrongNumerator")}}{${n("wrongDenominator")}}`, `\\left(\\frac{\\frac{${n("wrongNumerator")}}{${n("wrongDenominator")}}}{\\frac{${n("correctNumerator")}}{${n("correctDenominator")}}}-1\\right)100`, result];
    case "wrongMultiplier":
      return [`\\text{Error factor}=\\frac{${n("wrongMultiplier")}}{${n("correctMultiplier")}}`, `\\left(\\frac{${n("wrongMultiplier")}}{${n("correctMultiplier")}}-1\\right)100`, result];
    case "wrongDivisor":
      return [`\\text{Quotient factor}=\\frac{${n("correctDivisor")}}{${n("wrongDivisor")}}`, `\\left|\\frac{${n("correctDivisor")}}{${n("wrongDivisor")}}-1\\right|100`, result];
    case "tieredCommission": {
      const first = Math.min(n("salesAmount"), n("thresholdAmount"));
      const extra = Math.max(0, n("salesAmount") - n("thresholdAmount"));
      return [`\\frac{${first}\\times${n("baseCommissionRate")}}{100}+\\frac{${extra}\\times${n("bonusCommissionRate")}}{100}`, result, `\\text{Commission}=${answer}`];
    }
    case "tieredTax":
      return [`\\text{Taxable income}=${n("grossIncome")}-${n("exemptionAmount")}`, `\\frac{(${n("grossIncome")}-${n("exemptionAmount")})${n("taxPercentage")}}{100}`, result];
    case "piecewiseRate": {
      const first = Math.min(n("usageAmount"), n("thresholdAmount"));
      const extra = Math.max(0, n("usageAmount") - n("thresholdAmount"));
      return [`${first}\\times${n("baseChargeRate")}+${extra}\\times${n("extraChargeRate")}`, result, `\\text{Total charge}=${answer}`];
    }
    case "weightedSubgroup":
      return [`\\frac{${n("malePercentage")}\\times${n("maleTraitPercentage")}}{100}+\\frac{${100 - n("malePercentage")}\\times${n("femaleTraitPercentage")}}{100}`, result, `\\text{Overall percentage}=${answer}`];
    case "hierarchicalPopulation":
      return [`\\text{First group}=\\frac{${n("totalPopulation")}\\times${n("malePercentage")}}{100}`, `\\text{Required}=\\frac{${n("totalPopulation")}\\times${n("malePercentage")}\\times${n("maleTraitPercentage")}}{10000}`, result];
    case "branchAggregation":
      return [`\\frac{${n("groupAPercentage")}\\times${n("groupATraitPercentage")}}{100}+\\frac{${100 - n("groupAPercentage")}\\times${n("groupBTraitPercentage")}}{100}`, result, `\\text{Combined percentage}=${answer}`];
    case "iterativeDilution":
      return [`1-\\frac{${n("replacementVolume")}}{${n("initialVolume")}}`, `${n("initialVolume")}\\left(1-\\frac{${n("replacementVolume")}}{${n("initialVolume")}}\\right)^{${n("numberOfOperations")}}`, result];
    case "multiTierPiecewiseRate":
      return [`\\frac{${n("tier1Limit")}\\times${n("tier1Rate")}}{100}+\\frac{(${n("tier2Limit")}-${n("tier1Limit")})${n("tier2Rate")}}{100}+\\frac{(${n("totalBase")}-${n("tier2Limit")})${n("tier3Rate")}}{100}`, result, `\\text{Total}=${answer}`];
    case "reversePiecewiseRate":
      return [`\\text{First slab}=\\frac{${n("tier1Limit")}\\times${n("tier1Rate")}}{100}`, `\\text{Extra base}=\\frac{(${n("totalResult")}-\\frac{${n("tier1Limit")}\\times${n("tier1Rate")}}{100})100}{${n("tier2Rate")}}`, result];
    case "variableReplacement":
      return [`\\left(1-\\frac{${n("replacementRate1")}}{100}\\right)\\left(1-\\frac{${n("replacementRate2")}}{100}\\right)\\left(1-\\frac{${n("replacementRate3")}}{100}\\right)`, `100\\times\\frac{${100 - n("replacementRate1")}}{100}\\times\\frac{${100 - n("replacementRate2")}}{100}\\times\\frac{${100 - n("replacementRate3")}}{100}`, result];
    case "electionMargin":
      return [`\\text{Valid votes}=\\frac{${n("polledPercentage")}\\times${100 - n("invalidPercentage")}}{100}\\%`, `\\text{Margin}=\\frac{${n("polledPercentage")}\\times${100 - n("invalidPercentage")}\\times${2 * n("winnerPercentage") - 100}}{10000}\\%`, result];
    case "multiStageAttrition":
      return [`${n("initialCount")}\\times\\frac{${100 - n("firstDropPercentage")}}{100}\\times\\frac{${100 - n("secondDropPercentage")}}{100}\\times\\frac{${100 - n("thirdDropPercentage")}}{100}`, result, `\\text{Final count}=${answer}`];
    case "shiftedBaseChain":
      return [`${n("initialCount")}\\times\\frac{${n("firstPassPercentage")}}{100}\\times\\frac{${n("secondPassPercentage")}}{100}\\times\\frac{${n("thirdPassPercentage")}}{100}`, result, `\\text{Final count}=${answer}`];
    case "simpleLinkage":
      return [`${s("personA")}:${s("personB")}=${n("ratioA1")}:${n("ratioB1")}`, `${s("personB")}:${s("personC")}=${n("ratioB2")}:${n("ratioC2")}`, `${s("personA")}:${s("personB")}:${s("personC")}=${answer}`];
    case "ratioTreeLinkage":
      return [`\\frac{${s("personA")}}{${s("personB")}}=\\frac{${n("ratioA")}}{${n("ratioB")}},\\ \\frac{${s("personB")}}{${s("personC")}}=\\frac{${n("ratioB_prime")}}{${n("ratioC")}}`, `\\frac{${s("personC")}}{${s("personD")}}=\\frac{${n("ratioC_prime")}}{${n("ratioD")}}`, `${s("personA")}:${s("personD")}=${answer}`];
    case "scalingByComponent":
      return [`\\text{One part}=\\frac{${n("valueA")}}{${n("ratioA")}}`, `${s("personB")}=${n("ratioB")}\\times\\frac{${n("valueA")}}{${n("ratioA")}}`, result];
    case "decimalNormalization":
      return [`${n("decimalA")}:${n("decimalB")}`, `${n("decimalA")}\\times10:${n("decimalB")}\\times10`, result];
    case "shareDifference": {
      const sum = n("ratioA") + n("ratioB") + n("ratioC");
      return [`\\text{One part}=\\frac{${n("totalAmount")}}{${sum}}`, `(${n("ratioA")}-${n("ratioC")})\\times\\frac{${n("totalAmount")}}{${sum}}`, result];
    }
    case "reversePartition": {
      const diff = n("ratioA") - n("ratioC");
      const sum = n("ratioA") + n("ratioB") + n("ratioC");
      return [`\\text{One part}=\\frac{${n("shareDifference")}}{${diff}}`, `\\frac{${n("shareDifference")}}{${diff}}\\times${sum}`, result];
    }
    case "salaryDistribution":
      return [`\\text{One part}=\\frac{${n("totalSalary")}}{${n("ratioExp") + n("ratioSav")}}`, `${n("ratioSav")}\\times\\frac{${n("totalSalary")}}{${n("ratioExp") + n("ratioSav")}}`, result];
    case "twoStateAddition":
      return [`\\frac{${n("ratioA")}x+${n("addedCount")}}{${n("ratioB")}x}=\\frac{${n("finalRatioA")}}{${n("finalRatioB")}}`, `${n("finalRatioB")}(${n("ratioA")}x+${n("addedCount")})=${n("finalRatioA") * n("ratioB")}x`, result];
    case "twoStateSubtraction":
      return [`\\frac{${n("ratioA")}x-${n("removedCount")}}{${n("ratioB")}x}=\\frac{${n("finalRatioA")}}{${n("finalRatioB")}}`, `${n("finalRatioB")}(${n("ratioA")}x-${n("removedCount")})=${n("finalRatioA") * n("ratioB")}x`, result];
    case "twoStateTransfer":
      return [`\\frac{${n("ratioA")}x+${n("transferredCount")}}{${n("ratioB")}x-${n("transferredCount")}}=\\frac{${n("finalRatioA")}}{${n("finalRatioB")}}`, `${n("finalRatioB")}(${n("ratioA")}x+${n("transferredCount")})=${n("finalRatioA")}(${n("ratioB")}x-${n("transferredCount")})`, result];
    case "incomeExpenditureSystem":
      return [`${n("incomeRatioA")}x-${n("expRatioA")}y=${n("savingsAmount")}`, `${n("incomeRatioB")}x-${n("expRatioB")}y=${n("savingsAmount")}`, result];
    case "multiStageTransformation":
      return [`\\frac{${n("ratioA")}x+${n("addedCount")}}{${n("ratioB")}x-${n("removedCount")}}=\\frac{${n("finalRatioA")}}{${n("finalRatioB")}}`, `${n("finalRatioB")}(${n("ratioA")}x+${n("addedCount")})=${n("finalRatioA")}(${n("ratioB")}x-${n("removedCount")})`, result];
    case "meanProportional":
      return [`x^2=${n("numA")}\\times${n("numB")}`, `x=\\sqrt{${n("numA")}\\times${n("numB")}}`, result];
    case "thirdProportional":
      return [`${n("numA")}:${n("numB")}=${n("numB")}:x`, `x=\\frac{${n("numB")}^2}{${n("numA")}}`, result];
    case "fourthProportional":
      return [`${n("numA")}:${n("numB")}=${n("numC")}:x`, `x=\\frac{${n("numB")}\\times${n("numC")}}{${n("numA")}}`, result];
    case "directVariation":
      return [`\\frac{${n("varY1")}}{${n("varX1")}}=\\frac{y}{${n("varX2")}}`, `y=\\frac{${n("varY1")}\\times${n("varX2")}}{${n("varX1")}}`, result];
    case "inverseVariation":
      return [`${n("varX1")}\\times${n("varY1")}=${n("varX2")}\\times y`, `y=\\frac{${n("varX1")}\\times${n("varY1")}}{${n("varX2")}}`, result];
    case "coinCounting":
      return [`x(${n("ratio1")}\\times${n("denom1")}+${n("ratio2")}\\times${n("denom2")}+${n("ratio3")}\\times${n("denom3")})=${n("totalValue")}`, `x=\\frac{${n("totalValue")}}{${n("ratio1")}\\times${n("denom1")}+${n("ratio2")}\\times${n("denom2")}+${n("ratio3")}\\times${n("denom3")}}`, result];
    case "multiDenominationMapping":
      return [`x(${n("valRatio1")}+${n("valRatio2")}+${n("valRatio3")}+${n("valRatio4")})=${n("totalCoins")}`, `x=\\frac{${n("totalCoins")}}{${n("valRatio1") + n("valRatio2") + n("valRatio3") + n("valRatio4")}}`, result];
    case "weightedMapping":
      return [`x(${n("countA")}\\times${n("ratioA")}+${n("countB")}\\times${n("ratioB")}+${n("countC")}\\times${n("ratioC")})=${n("totalWeight")}`, `x=\\frac{${n("totalWeight")}}{${n("countA")}\\times${n("ratioA")}+${n("countB")}\\times${n("ratioB")}+${n("countC")}\\times${n("ratioC")}}`, result];
    case "weightedMarks":
      return [`x(${n("ratio1")}\\times${n("w1")}+${n("ratio2")}\\times${n("w2")}+${n("ratio3")}\\times${n("w3")})=${n("totalScore")}`, `x=\\frac{${n("totalScore")}}{${n("ratio1")}\\times${n("w1")}+${n("ratio2")}\\times${n("w2")}+${n("ratio3")}\\times${n("w3")}}`, result];
    case "binaryMixture":
      return [`${s("liquid1")}:${s("liquid2")}=${n("ratio1")}:${n("ratio2")}`, `${n("ratio1")}x:${n("ratio2")}x+${n("addedAmount")}=${n("finalRatio1")}:${n("finalRatio2")}`, result];
    case "mixtureComponentFinding":
      return [`\\text{One part}=\\frac{${n("totalVolume")}}{${n("ratio1") + n("ratio2")}}`, `${n("ratio1")}x:${n("ratio2")}x+y=${n("finalRatio1")}:${n("finalRatio2")}`, result];
    case "threeComponentMixture":
      return [`\\text{One part}=\\frac{\\text{initial total}}{${n("ratio1") + n("ratio2") + n("ratio3")}}`, `${n("ratio1")}x:${n("ratio2")}x+${n("addedAmount")}:${n("ratio3")}x=${n("finalRatio1")}:${n("finalRatio2")}:${n("finalRatio3")}`, result];
    case "variableReplacementRatio":
      return [`\\text{Retained fraction}=\\left(1-\\frac{${n("removedVolume1")}}{${n("initialVolume")}}\\right)\\left(1-\\frac{${n("removedVolume2")}}{${n("initialVolume")}}\\right)`, `${s("liquidA")}:${s("liquidB")}=${answer}`, result];
    case "acidConcentration":
      return [`\\text{Total volume}=${n("acidVolume")}+${n("waterVolume")}`, `\\frac{${n("acidVolume")}}{${n("acidVolume") + n("waterVolume")}}\\times100`, result];
    default: {
      const values = Object.entries(v).filter(([, value]) => typeof value === "number").map(([key, value]) => `${key}=${value}`);
      return [`\\text{Given: }${values.join(",\\ ")}`, `\\text{Required value}`, result];
    }
  }
}

export class TaskKindTeacherRenderer implements ExplanationRenderer {
  constructor(
    private readonly taskKind: string,
    private readonly solverMathJax: Record<string, string>,
  ) {}

  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const selected = PROFILES[this.taskKind];
    if (!selected) throw new Error(`Teacher profile missing for taskKind: ${this.taskKind}`);

    const variant = variantIndex(evidence);
    const answer = String(evidence.answer);
    const chain = arithmeticChain(this.taskKind, evidence).map(sanitizeMathExpression);
    const cleanAnswer = sanitizeMathExpression(answer);

    return [
      { stepId: "step-1", type: "GOAL", narrative: "Given", mathLatex: chain[0]! },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: "Calculation",
        mathLatex: chain[1]!,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: "=",
        mathLatex: chain[2]!,
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: "Answer",
        mathLatex: cleanAnswer,
      },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: `${selected.conclusion[variant]} ${cleanAnswer}.`,
      },
    ];
  }
}
