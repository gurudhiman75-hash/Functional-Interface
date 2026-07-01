import { composeEducationalExplanation, renderEducationalExplanation, type ChapterOwnedEducationalStep } from "../../../../../../shared/education";
import { formatNumber, mathJaxBlock } from "./math";
import type { Pct003Explanation, Pct003Parameters, Pct003ReasoningGraph, Pct003SolverResult } from "./types";

function sentenceWithMath(statement: string, consequence: string) {
  return [statement, mathJaxBlock(consequence)];
}

function chapterOwnedStepsFromLines(lines: readonly string[], parameters: Pct003Parameters): ChapterOwnedEducationalStep[] {
  const steps: ChapterOwnedEducationalStep[] = [];
  for (let index = 0; index < lines.length; index += 2) {
    const statement = lines[index];
    const mathjax = lines[index + 1];
    if (!statement || !mathjax) continue;
    steps.push({
      id: `${parameters.explanationId}:step-${steps.length + 1}`,
      statement,
      mathjax,
      kind: "percentage",
    });
  }
  return steps;
}

function displayValue(parameters: Pct003Parameters, numeric: number) {
  const prefix = String(parameters.variables["valuePrefix"] ?? "");
  return `${prefix}${formatNumber(numeric)}`;
}

function percent(numeric: number) {
  return `${formatNumber(numeric)}\\%`;
}

function asNumber(parameters: Pct003Parameters, name: string) {
  return Number(parameters.variables[name] ?? 0);
}

export function renderPct003Explanation(
  parameters: Pct003Parameters,
  solver: Pct003SolverResult,
  graph: Pct003ReasoningGraph,
): Pct003Explanation {
  const lines: string[] = [];
  const renderedAnswer = solver.answer.replaceAll("$$", "");

  const originalValue = asNumber(parameters, "originalValue");
  const increaseRate = asNumber(parameters, "increaseRate");
  const increasedValue = asNumber(parameters, "increasedValue");
  const rate1 = asNumber(parameters, "rate1");
  const rate2 = asNumber(parameters, "rate2");
  const originalA = asNumber(parameters, "originalA");
  const originalB = asNumber(parameters, "originalB");
  const rateA = asNumber(parameters, "rateA");
  const rateB = asNumber(parameters, "rateB");
  const totalValue = asNumber(parameters, "totalValue");
  const partRate = asNumber(parameters, "partRate");
  const partIncreaseRate = asNumber(parameters, "partIncreaseRate");
  const otherIncreaseRate = asNumber(parameters, "otherIncreaseRate");
  const currentValue = asNumber(parameters, "currentValue");
  const targetValue = asNumber(parameters, "targetValue");
  const growthRate = asNumber(parameters, "growthRate");
  const periodCount = asNumber(parameters, "periodCount");

  const wholeLabel = String(parameters.variables["wholeLabel"] ?? "quantity");
  const partLabel = String(parameters.variables["partLabel"] ?? "part");
  const otherLabel = String(parameters.variables["otherLabel"] ?? "other part");
  const labelA = String(parameters.variables["labelA"] ?? "first quantity");
  const labelB = String(parameters.variables["labelB"] ?? "second quantity");

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
  const neededAmount = Number(solver.evidence["neededAmount"] ?? 0);

  switch (parameters.taskKind) {
    case "directPercentageIncrease":
      lines.push(
        ...sentenceWithMath(
          `An increase of ${formatNumber(increaseRate)}% makes the ${wholeLabel} equal to ${formatNumber(100 + increaseRate)}% of its original value.`,
          `\\text{New percent}=100\\%+${percent(increaseRate)}=${percent(100 + increaseRate)}`,
        ),
        ...sentenceWithMath(
          `So multiply the original ${wholeLabel} by ${formatNumber(100 + increaseRate)}/100.`,
          `\\text{New ${wholeLabel}}=${formatNumber(originalValue)}\\times\\frac{${formatNumber(100 + increaseRate)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the new ${wholeLabel} is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{New ${wholeLabel}}=${renderedAnswer}`,
        ),
      );
      break;
    case "increaseAmount":
      lines.push(
        ...sentenceWithMath(
          `Only the increased part is required here, so we need ${formatNumber(increaseRate)}% of the original ${wholeLabel}.`,
          `\\text{Increase amount}=${percent(increaseRate)}\\text{ of }${displayValue(parameters, originalValue)}`,
        ),
        ...sentenceWithMath(
          `Now take ${formatNumber(increaseRate)}% of ${displayValue(parameters, originalValue)}.`,
          `\\text{Increase amount}=${formatNumber(originalValue)}\\times\\frac{${formatNumber(increaseRate)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the increase amount is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{Increase amount}=${renderedAnswer}`,
        ),
      );
      break;
    case "originalValueFromIncreasedValue":
      lines.push(
        ...sentenceWithMath(
          `After a ${formatNumber(increaseRate)}% rise, the new ${wholeLabel} represents ${formatNumber(100 + increaseRate)}% of the original.`,
          `${percent(100 + increaseRate)}\\rightarrow${displayValue(parameters, increasedValue)}`,
        ),
        ...sentenceWithMath(
          `So divide ${displayValue(parameters, increasedValue)} by ${formatNumber(100 + increaseRate)} to find the value of 1%.`,
          `1\\%=\\frac{${formatNumber(increasedValue)}}{${formatNumber(100 + increaseRate)}}=${formatNumber(onePercentValue)}`,
        ),
        ...sentenceWithMath(
          `Now multiply the value of 1% by 100 to get the original ${wholeLabel}.`,
          `100\\%=${formatNumber(onePercentValue)}\\times100=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the original ${wholeLabel} was ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{Original ${wholeLabel}}=${renderedAnswer}`,
        ),
      );
      break;
    case "equivalentMultiplier":
      lines.push(
        ...sentenceWithMath(
          `A ${formatNumber(increaseRate)}% increase means the new value becomes ${formatNumber(100 + increaseRate)}% of the old value.`,
          `\\text{New percent}=100\\%+${percent(increaseRate)}=${percent(100 + increaseRate)}`,
        ),
        ...sentenceWithMath(
          `Express that new percentage as a multiplier by dividing by 100.`,
          `\\text{Multiplier}=\\frac{${formatNumber(100 + increaseRate)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the equivalent multiplier is ${formatNumber(solver.numericAnswer ?? 0)}.`,
          `\\text{Multiplier}=${renderedAnswer}`,
        ),
      );
      break;
    case "repeatedPercentageIncrease":
      lines.push(
        ...sentenceWithMath(
          `After the first increase of ${formatNumber(rate1)}%, the ${wholeLabel} becomes ${formatNumber(100 + rate1)}% of its original value.`,
          `\\text{After first increase}=${formatNumber(originalValue)}\\times\\frac{${formatNumber(100 + rate1)}}{100}=${formatNumber(afterFirstValue)}`,
        ),
        ...sentenceWithMath(
          `Now apply the second increase of ${formatNumber(rate2)}% to this new value.`,
          `\\text{Final value}=${formatNumber(afterFirstValue)}\\times\\frac{${formatNumber(100 + rate2)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the ${wholeLabel} after both increases is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{Final ${wholeLabel}}=${renderedAnswer}`,
        ),
      );
      break;
    case "netIncreasePercentage":
      lines.push(
        ...sentenceWithMath(
          `Convert the two increases into growth factors.`,
          `\\text{Combined factor}=\\frac{${formatNumber(100 + rate1)}}{100}\\times\\frac{${formatNumber(100 + rate2)}}{100}`,
        ),
        ...sentenceWithMath(
          `This combined factor tells us how many times the original value becomes after both increases.`,
          `\\text{Combined factor}=\\frac{${formatNumber(100 + rate1)}}{100}\\times\\frac{${formatNumber(100 + rate2)}}{100}=${formatNumber(1 + netPercent / 100)}`,
        ),
        ...sentenceWithMath(
          `So subtract 1 from the combined factor and convert the result into a percentage increase.`,
          `\\text{Net increase}=${percent(netPercent)}`,
        ),
        ...sentenceWithMath(
          `Therefore the overall percentage increase is ${formatNumber(netPercent)}%.`,
          `\\text{Net increase}=${renderedAnswer}`,
        ),
      );
      break;
    case "comparativeIncrease":
      lines.push(
        ...sentenceWithMath(
          `First find the new value of ${labelA} after its increase.`,
          `\\text{New ${labelA}}=${formatNumber(originalA)}\\times\\frac{${formatNumber(100 + rateA)}}{100}=${formatNumber(newA)}`,
        ),
        ...sentenceWithMath(
          `Now find the new value of ${labelB} after its increase.`,
          `\\text{New ${labelB}}=${formatNumber(originalB)}\\times\\frac{${formatNumber(100 + rateB)}}{100}=${formatNumber(newB)}`,
        ),
        ...sentenceWithMath(
          `Finally compare these two new values.`,
          `\\text{Difference}=\\left|${formatNumber(newA)}-${formatNumber(newB)}\\right|=${formatNumber(difference)}`,
        ),
        ...sentenceWithMath(
          `Therefore the difference between the new values is ${displayValue(parameters, difference)}.`,
          `\\text{Difference}=${renderedAnswer}`,
        ),
      );
      break;
    case "percentageIncreaseInParts":
      lines.push(
        ...sentenceWithMath(
          `At first, ${formatNumber(partRate)}% of the ${wholeLabel} are ${partLabel}, so split the original total into ${partLabel} and ${otherLabel}.`,
          `\\text{Initial ${partLabel}}=${formatNumber(totalValue)}\\times\\frac{${formatNumber(partRate)}}{100}=${formatNumber(initialPartValue)},\\ \\text{Initial ${otherLabel}}=${formatNumber(initialOtherValue)}`,
        ),
        ...sentenceWithMath(
          `Now increase the number of ${partLabel} and ${otherLabel} by their respective percentages.`,
          `\\text{New ${partLabel}}=${formatNumber(initialPartValue)}\\times\\frac{${formatNumber(100 + partIncreaseRate)}}{100}=${formatNumber(newPartValue)},\\ \\text{New ${otherLabel}}=${formatNumber(initialOtherValue)}\\times\\frac{${formatNumber(100 + otherIncreaseRate)}}{100}=${formatNumber(newOtherValue)}`,
        ),
        ...sentenceWithMath(
          `Use the new total to find the updated percentage of ${partLabel}.`,
          `\\text{New ${partLabel} percent}=\\frac{${formatNumber(newPartValue)}}{${formatNumber(newTotalValue)}}\\times100=${percent(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the new percentage of ${partLabel} is ${formatNumber(solver.numericAnswer ?? 0)}%.`,
          `\\text{New ${partLabel} percent}=${renderedAnswer}`,
        ),
      );
      break;
    case "requiredIncrease":
      if (currentValue === targetValue) {
        lines.push(
          ...sentenceWithMath(
            `The current ${wholeLabel} is already equal to the target ${wholeLabel}.`,
            `${displayValue(parameters, currentValue)}=${displayValue(parameters, targetValue)}`,
          ),
          ...sentenceWithMath(
            `So no increase is required.`,
            `\\text{Required increase}=0\\%`,
          ),
          ...sentenceWithMath(
            `Therefore the required percentage increase is 0%.`,
            `\\text{Required increase}=${renderedAnswer}`,
          ),
        );
      } else {
        lines.push(
          ...sentenceWithMath(
            `First find how much extra ${wholeLabel} is needed to reach the target.`,
            `\\text{Needed amount}=${formatNumber(targetValue)}-${formatNumber(currentValue)}=${formatNumber(neededAmount)}`,
          ),
          ...sentenceWithMath(
            `Now compare this extra amount with the current ${wholeLabel}.`,
            `\\text{Required increase}=\\frac{${formatNumber(neededAmount)}}{${formatNumber(currentValue)}}\\times100=${percent(solver.numericAnswer ?? 0)}`,
          ),
          ...sentenceWithMath(
            `Therefore the required percentage increase is ${formatNumber(solver.numericAnswer ?? 0)}%.`,
            `\\text{Required increase}=${renderedAnswer}`,
          ),
        );
      }
      break;
    case "growthBridge":
      lines.push(
        ...sentenceWithMath(
          `Each increase of ${formatNumber(growthRate)}% multiplies the ${wholeLabel} by ${formatNumber(100 + growthRate)}/100.`,
          `\\text{One-period factor}=\\frac{${formatNumber(100 + growthRate)}}{100}`,
        ),
        ...sentenceWithMath(
          `Since the same increase happens for ${formatNumber(periodCount)} periods, use this factor ${formatNumber(periodCount)} times.`,
          `\\text{Overall factor}=\\left(\\frac{${formatNumber(100 + growthRate)}}{100}\\right)^{${formatNumber(periodCount)}}`,
        ),
        ...sentenceWithMath(
          `Now multiply the current ${wholeLabel} by the overall factor.`,
          `\\text{Final ${wholeLabel}}=${formatNumber(currentValue)}\\times\\left(\\frac{${formatNumber(100 + growthRate)}}{100}\\right)^{${formatNumber(periodCount)}}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the ${wholeLabel} after ${formatNumber(periodCount)} periods is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{Final ${wholeLabel}}=${renderedAnswer}`,
        ),
      );
      break;
  }

  const chapterOwnedSteps = chapterOwnedStepsFromLines(lines, parameters);
  const educationalExplanation = composeEducationalExplanation({
    reasoningGraph: graph,
    answer: solver.answer,
    topic: "Percentage",
    canonicalProblemId: parameters.canonicalProblemId,
    taskKind: parameters.taskKind,
    metadata: {
      archetypeId: parameters.archetypeId,
      questionId: parameters.questionId,
      explanationId: parameters.explanationId,
      language: parameters.language,
      difficultyBand: parameters.difficultyBand,
    },
    chapterOwnedSteps,
  });
  const rendered = renderEducationalExplanation(educationalExplanation, "statement-math-lines");

  return {
    explanationId: parameters.explanationId,
    lines: [...(rendered.lines ?? lines)],
  };
}
