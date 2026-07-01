import { getFractionEquivalent } from "../../../../../../shared/percentage/fraction-equivalent-service";
import { formatNumber, mathJaxBlock } from "./math";
import type { Pct004Explanation, Pct004Parameters, Pct004ReasoningGraph, Pct004SolverResult } from "./types";

function sentenceWithMath(statement: string, consequence: string) {
  return [statement, mathJaxBlock(consequence)];
}

function displayValue(parameters: Pct004Parameters, numeric: number) {
  const prefix = String(parameters.variables["valuePrefix"] ?? "");
  return `${prefix}${formatNumber(numeric)}`;
}

function percent(numeric: number) {
  return `${formatNumber(numeric)}\\%`;
}

function asNumber(parameters: Pct004Parameters, name: string) {
  return Number(parameters.variables[name] ?? 0);
}

function fractionShortcut(percentValue: number) {
  const key = `${formatNumber(percentValue)}%`;
  const fraction = getFractionEquivalent(key);
  if (!fraction) return [] as string[];
  const [numerator, denominator] = fraction.split("/");
  return sentenceWithMath(
    `${key} can also be written as the fraction ${numerator}/${denominator}.`,
    `${formatNumber(percentValue)}\\%=\\frac{${numerator}}{${denominator}}`,
  );
}

export function renderPct004Explanation(
  parameters: Pct004Parameters,
  solver: Pct004SolverResult,
  _graph: Pct004ReasoningGraph,
): Pct004Explanation {
  const lines: string[] = [];
  const renderedAnswer = solver.answer.replaceAll("$$", "");

  const originalValue = asNumber(parameters, "originalValue");
  const decreaseRate = asNumber(parameters, "decreaseRate");
  const decreasedValue = asNumber(parameters, "decreasedValue");
  const rate1 = asNumber(parameters, "rate1");
  const rate2 = asNumber(parameters, "rate2");
  const originalA = asNumber(parameters, "originalA");
  const originalB = asNumber(parameters, "originalB");
  const rateA = asNumber(parameters, "rateA");
  const rateB = asNumber(parameters, "rateB");
  const totalValue = asNumber(parameters, "totalValue");
  const partRate = asNumber(parameters, "partRate");
  const partDecreaseRate = asNumber(parameters, "partDecreaseRate");
  const otherDecreaseRate = asNumber(parameters, "otherDecreaseRate");
  const currentValue = asNumber(parameters, "currentValue");
  const targetValue = asNumber(parameters, "targetValue");
  const periodCount = asNumber(parameters, "periodCount");

  const wholeLabel = String(parameters.variables["wholeLabel"] ?? "quantity");
  const partLabel = String(parameters.variables["partLabel"] ?? "part");
  const otherLabel = String(parameters.variables["otherLabel"] ?? "other part");
  const labelA = String(parameters.variables["labelA"] ?? "first quantity");
  const labelB = String(parameters.variables["labelB"] ?? "second quantity");

  const remainingPercent = Number(solver.evidence["remainingPercent"] ?? 0);
  const onePercentValue = Number(solver.evidence["onePercentValue"] ?? 0);
  const afterFirstValue = Number(solver.evidence["afterFirstValue"] ?? 0);
  const netPercent = Number(solver.evidence["netPercent"] ?? 0);
  const newA = Number(solver.evidence["newA"] ?? 0);
  const newB = Number(solver.evidence["newB"] ?? 0);
  const difference = Number(solver.evidence["difference"] ?? 0);
  const initialPartValue = Number(solver.evidence["initialPartValue"] ?? 0);
  const initialOtherValue = Number(solver.evidence["initialOtherValue"] ?? 0);
  const newPartValue = Number(solver.evidence["newPartValue"] ?? 0);
  const newOtherValue = Number(solver.evidence["newOtherValue"] ?? 0);
  const newTotalValue = Number(solver.evidence["newTotalValue"] ?? 0);
  const neededReduction = Number(solver.evidence["neededReduction"] ?? 0);

  switch (parameters.taskKind) {
    case "directPercentageDecrease":
      lines.push(
        ...sentenceWithMath(
          `Decrease = ${formatNumber(decreaseRate)}%. So the remaining value is ${formatNumber(remainingPercent)}% of the original.`,
          `100\\%-${percent(decreaseRate)}=${percent(remainingPercent)}`,
        ),
        ...fractionShortcut(remainingPercent),
        ...sentenceWithMath(
          `Now take ${formatNumber(remainingPercent)}% of the original ${wholeLabel}.`,
          `\\text{New ${wholeLabel}}=${formatNumber(originalValue)}\\times\\frac{${formatNumber(remainingPercent)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `So the new ${wholeLabel} is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{New ${wholeLabel}}=${renderedAnswer}`,
        ),
      );
      break;
    case "decreaseAmount":
      lines.push(
        ...sentenceWithMath(
          `Only the reduced part is needed here.`,
          `\\text{Decrease amount}=${percent(decreaseRate)}\\text{ of }${displayValue(parameters, originalValue)}`,
        ),
        ...fractionShortcut(decreaseRate),
        ...sentenceWithMath(
          `So find ${formatNumber(decreaseRate)}% of the original ${wholeLabel}.`,
          `\\text{Decrease amount}=${formatNumber(originalValue)}\\times\\frac{${formatNumber(decreaseRate)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `So the decrease amount is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{Decrease amount}=${renderedAnswer}`,
        ),
      );
      break;
    case "originalValueFromDecreasedValue":
      lines.push(
        ...sentenceWithMath(
          `After a decrease of ${formatNumber(decreaseRate)}%, the new value becomes ${formatNumber(remainingPercent)}% of the original.`,
          `${percent(remainingPercent)}\\rightarrow${displayValue(parameters, decreasedValue)}`,
        ),
        ...fractionShortcut(remainingPercent),
        ...sentenceWithMath(
          `First find the value of 1% by dividing ${displayValue(parameters, decreasedValue)} by ${formatNumber(remainingPercent)}.`,
          `1\\%=\\frac{${formatNumber(decreasedValue)}}{${formatNumber(remainingPercent)}}=${formatNumber(onePercentValue)}`,
        ),
        ...sentenceWithMath(
          `Now multiply the value of 1% by 100 to get the original value.`,
          `100\\%=${formatNumber(onePercentValue)}\\times100=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `So the original ${wholeLabel} was ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{Original ${wholeLabel}}=${renderedAnswer}`,
        ),
      );
      break;
    case "decreaseMultiplier":
      lines.push(
        ...sentenceWithMath(
          `A decrease of ${formatNumber(decreaseRate)}% leaves ${formatNumber(remainingPercent)}% of the original.`,
          `100\\%-${percent(decreaseRate)}=${percent(remainingPercent)}`,
        ),
        ...fractionShortcut(remainingPercent),
        ...sentenceWithMath(
          `Write this remaining percentage as a multiplier.`,
          `\\text{Multiplier}=\\frac{${formatNumber(remainingPercent)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `So the decrease multiplier is ${formatNumber(solver.numericAnswer ?? 0)}.`,
          `\\text{Multiplier}=${renderedAnswer}`,
        ),
      );
      break;
    case "successiveDecrease":
      lines.push(
        ...sentenceWithMath(
          `After the first decrease of ${formatNumber(rate1)}%, the ${wholeLabel} becomes ${formatNumber(100 - rate1)}% of its original value.`,
          `\\text{After first decrease}=${formatNumber(originalValue)}\\times\\frac{${formatNumber(100 - rate1)}}{100}=${formatNumber(afterFirstValue)}`,
        ),
        ...sentenceWithMath(
          `Now decrease this new value by ${formatNumber(rate2)}%.`,
          `\\text{Final value}=${formatNumber(afterFirstValue)}\\times\\frac{${formatNumber(100 - rate2)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `So the ${wholeLabel} after both decreases is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{Final ${wholeLabel}}=${renderedAnswer}`,
        ),
      );
      break;
    case "netPercentageDecrease":
      lines.push(
        ...sentenceWithMath(
          `Convert both decreases into retained factors.`,
          `\\text{Combined factor}=\\frac{${formatNumber(100 - rate1)}}{100}\\times\\frac{${formatNumber(100 - rate2)}}{100}`,
        ),
        ...sentenceWithMath(
          `This combined factor shows what fraction of the original still remains.`,
          `\\text{Combined factor}=\\frac{${formatNumber(100 - rate1)}}{100}\\times\\frac{${formatNumber(100 - rate2)}}{100}=${formatNumber(1 - netPercent / 100)}`,
        ),
        ...sentenceWithMath(
          `So subtract the remaining fraction from 1 and convert it into percent.`,
          `\\text{Net decrease}=${percent(netPercent)}`,
        ),
        ...sentenceWithMath(
          `So the overall percentage decrease is ${formatNumber(netPercent)}%.`,
          `\\text{Net decrease}=${renderedAnswer}`,
        ),
      );
      break;
    case "comparativeDecrease":
      lines.push(
        ...sentenceWithMath(
          `First find the new value of ${labelA} after its decrease.`,
          `\\text{New ${labelA}}=${formatNumber(originalA)}\\times\\frac{${formatNumber(100 - rateA)}}{100}=${formatNumber(newA)}`,
        ),
        ...sentenceWithMath(
          `Now find the new value of ${labelB} after its decrease.`,
          `\\text{New ${labelB}}=${formatNumber(originalB)}\\times\\frac{${formatNumber(100 - rateB)}}{100}=${formatNumber(newB)}`,
        ),
        ...sentenceWithMath(
          `Now compare the two new values.`,
          `\\text{Difference}=\\left|${formatNumber(newA)}-${formatNumber(newB)}\\right|=${formatNumber(difference)}`,
        ),
        ...sentenceWithMath(
          `So the difference between the new values is ${displayValue(parameters, difference)}.`,
          `\\text{Difference}=${renderedAnswer}`,
        ),
      );
      break;
    case "componentWiseDecrease":
      lines.push(
        ...sentenceWithMath(
          `At first, ${formatNumber(partRate)}% of the ${wholeLabel} are ${partLabel}. So split the original total.`,
          `\\text{Initial ${partLabel}}=${formatNumber(totalValue)}\\times\\frac{${formatNumber(partRate)}}{100}=${formatNumber(initialPartValue)},\\ \\text{Initial ${otherLabel}}=${formatNumber(initialOtherValue)}`,
        ),
        ...sentenceWithMath(
          `Now decrease the numbers of ${partLabel} and ${otherLabel} by their respective percentages.`,
          `\\text{New ${partLabel}}=${formatNumber(initialPartValue)}\\times\\frac{${formatNumber(100 - partDecreaseRate)}}{100}=${formatNumber(newPartValue)},\\ \\text{New ${otherLabel}}=${formatNumber(initialOtherValue)}\\times\\frac{${formatNumber(100 - otherDecreaseRate)}}{100}=${formatNumber(newOtherValue)}`,
        ),
        ...sentenceWithMath(
          `Use the new total to find the updated percentage of ${partLabel}.`,
          `\\text{New ${partLabel} percent}=\\frac{${formatNumber(newPartValue)}}{${formatNumber(newTotalValue)}}\\times100=${percent(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `So the new percentage of ${partLabel} is ${formatNumber(solver.numericAnswer ?? 0)}%.`,
          `\\text{New ${partLabel} percent}=${renderedAnswer}`,
        ),
      );
      break;
    case "requiredDecrease":
      lines.push(
        ...sentenceWithMath(
          `First find how much reduction is needed to reach the target.`,
          `\\text{Needed reduction}=${formatNumber(currentValue)}-${formatNumber(targetValue)}=${formatNumber(neededReduction)}`,
        ),
        ...sentenceWithMath(
          `Now compare this reduction with the current ${wholeLabel}.`,
          `\\text{Required decrease}=\\frac{${formatNumber(neededReduction)}}{${formatNumber(currentValue)}}\\times100=${percent(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `So the required percentage decrease is ${formatNumber(solver.numericAnswer ?? 0)}%.`,
          `\\text{Required decrease}=${renderedAnswer}`,
        ),
      );
      break;
    case "percentageDecreaseBridge":
      lines.push(
        ...sentenceWithMath(
          `Each decrease of ${formatNumber(decreaseRate)}% leaves ${formatNumber(remainingPercent)}% of the ${wholeLabel}.`,
          `100\\%-${percent(decreaseRate)}=${percent(remainingPercent)}`,
        ),
        ...fractionShortcut(remainingPercent),
        ...sentenceWithMath(
          `Since the same decrease happens for ${formatNumber(periodCount)} periods, use the retained factor ${formatNumber(periodCount)} times.`,
          `\\text{Overall factor}=\\left(\\frac{${formatNumber(remainingPercent)}}{100}\\right)^{${formatNumber(periodCount)}}`,
        ),
        ...sentenceWithMath(
          `Now multiply the current ${wholeLabel} by this overall factor.`,
          `\\text{Final ${wholeLabel}}=${formatNumber(currentValue)}\\times\\left(\\frac{${formatNumber(remainingPercent)}}{100}\\right)^{${formatNumber(periodCount)}}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `So the ${wholeLabel} after ${formatNumber(periodCount)} periods is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{Final ${wholeLabel}}=${renderedAnswer}`,
        ),
      );
      break;
  }

  return {
    explanationId: parameters.explanationId,
    lines,
  };
}
