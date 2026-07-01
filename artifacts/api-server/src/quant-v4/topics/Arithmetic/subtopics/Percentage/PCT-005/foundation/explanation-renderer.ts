import { getFractionEquivalent } from "../../../../../../shared/percentage/fraction-equivalent-service";
import { formatNumber, mathJaxBlock, stageFactor, stagePercent } from "./math";
import type { Pct005Direction, Pct005Explanation, Pct005Parameters, Pct005ReasoningGraph, Pct005SolverResult } from "./types";

function sentenceWithMath(statement: string, consequence: string) {
  return [statement, mathJaxBlock(consequence)];
}

function displayValue(parameters: Pct005Parameters, numeric: number) {
  const prefix = String(parameters.variables["valuePrefix"] ?? "");
  return `${prefix}${formatNumber(numeric)}`;
}

function percent(numeric: number) {
  return `${formatNumber(numeric)}\\%`;
}

function asNumber(parameters: Pct005Parameters, name: string) {
  return Number(parameters.variables[name] ?? 0);
}

function direction(parameters: Pct005Parameters, name: string, fallback: Pct005Direction = "increase"): Pct005Direction {
  const value = String(parameters.variables[name] ?? "");
  return value === "decrease" ? "decrease" : fallback;
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

function stageVerb(directionValue: Pct005Direction) {
  return directionValue === "increase" ? "increase" : "decrease";
}

function stageSign(directionValue: Pct005Direction) {
  return directionValue === "increase" ? "+" : "-";
}

function buildStageLines(stageLabel: string, directionValue: Pct005Direction, rate: number) {
  const newPercent = stagePercent(directionValue, rate);
  const factor = stageFactor(directionValue, rate);
  return [
    ...sentenceWithMath(
      `For ${stageLabel}, ${stageVerb(directionValue)} = ${formatNumber(rate)}%. So the new value becomes ${formatNumber(newPercent)}% of the previous value.`,
      `100\\%${stageSign(directionValue)}${percent(rate)}=${percent(newPercent)}`,
    ),
    ...fractionShortcut(newPercent),
    ...sentenceWithMath(
      `So the multiplier for ${stageLabel} is ${formatNumber(newPercent)}/100.`,
      `\\text{${stageLabel} multiplier}=\\frac{${formatNumber(newPercent)}}{100}=${formatNumber(factor)}`,
    ),
  ];
}

function buildStageArray(parameters: Pct005Parameters) {
  const stages: { index: number; direction: Pct005Direction; rate: number }[] = [];
  const stageCount = Math.max(0, Math.floor(asNumber(parameters, "stageCount")));
  if (stageCount > 0) {
    for (let index = 1; index <= stageCount; index += 1) {
      stages.push({
        index,
        direction: direction(parameters, `direction${index}`),
        rate: asNumber(parameters, `rate${index}`),
      });
    }
    return stages;
  }

  if (Number.isFinite(asNumber(parameters, "rate1")) && Number.isFinite(asNumber(parameters, "rate2"))) {
    stages.push({
      index: 1,
      direction: direction(parameters, "direction1", direction(parameters, "direction1", "increase")),
      rate: asNumber(parameters, "rate1"),
    });
    stages.push({
      index: 2,
      direction: direction(parameters, "direction2", direction(parameters, "direction2", "increase")),
      rate: asNumber(parameters, "rate2"),
    });
  }
  return stages;
}

function concludeNetChange(netPercent: number) {
  if (netPercent > 0) return `Overall change = increase of ${formatNumber(netPercent)}%.`;
  if (netPercent < 0) return `Overall change = decrease of ${formatNumber(Math.abs(netPercent))}%.`;
  return "Overall change = 0%.";
}

export function renderPct005Explanation(
  parameters: Pct005Parameters,
  solver: Pct005SolverResult,
  _graph: Pct005ReasoningGraph,
): Pct005Explanation {
  const lines: string[] = [];
  const renderedAnswer = solver.answer.replaceAll("$$", "");
  const wholeLabel = String(parameters.variables["wholeLabel"] ?? "value");

  const originalValue = asNumber(parameters, "originalValue");
  const finalValue = asNumber(parameters, "finalValue");
  const rate1 = asNumber(parameters, "rate1");
  const rate2 = asNumber(parameters, "rate2");
  const direction1 = direction(parameters, "direction1", parameters.taskKind === "successiveDecrease" || parameters.taskKind === "decreaseThenIncrease" ? "decrease" : "increase");
  const direction2 = direction(parameters, "direction2", parameters.taskKind === "successiveDecrease" || parameters.taskKind === "increaseThenDecrease" ? "decrease" : "increase");
  const stage1Percent = Number(solver.evidence["stage1Percent"] ?? 0);
  const stage2Percent = Number(solver.evidence["stage2Percent"] ?? 0);
  const stage1Factor = Number(solver.evidence["stage1Factor"] ?? 0);
  const stage2Factor = Number(solver.evidence["stage2Factor"] ?? 0);
  const combinedFactor = Number(solver.evidence["combinedFactor"] ?? 0);
  const afterFirstValue = Number(solver.evidence["afterFirstValue"] ?? 0);
  const netPercent = Number(solver.evidence["netPercent"] ?? 0);
  const finalA = Number(solver.evidence["finalA"] ?? 0);
  const finalB = Number(solver.evidence["finalB"] ?? 0);
  const difference = Number(solver.evidence["difference"] ?? 0);

  switch (parameters.taskKind) {
    case "successiveIncrease":
    case "successiveDecrease":
    case "increaseThenDecrease":
    case "decreaseThenIncrease":
      lines.push(
        ...buildStageLines("first stage", direction1, rate1),
        ...sentenceWithMath(
          `Apply the first-stage multiplier to the original ${wholeLabel}.`,
          `\\text{After first stage}=${formatNumber(originalValue)}\\times${formatNumber(stage1Factor)}=${formatNumber(afterFirstValue)}`,
        ),
        ...buildStageLines("second stage", direction2, rate2),
        ...sentenceWithMath(
          `Now multiply by both stage multipliers to get the final ${wholeLabel}.`,
          `\\text{Final ${wholeLabel}}=${formatNumber(originalValue)}\\times${formatNumber(stage1Factor)}\\times${formatNumber(stage2Factor)}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `So the final ${wholeLabel} is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{Final ${wholeLabel}}=${renderedAnswer}`,
        ),
      );
      break;
    case "netPercentageChange":
      lines.push(
        ...buildStageLines("first stage", direction1, rate1),
        ...buildStageLines("second stage", direction2, rate2),
        ...sentenceWithMath(
          `Multiply the two stage multipliers to get the overall multiplier.`,
          `\\text{Overall multiplier}=${formatNumber(stage1Factor)}\\times${formatNumber(stage2Factor)}=${formatNumber(combinedFactor)}`,
        ),
        ...sentenceWithMath(
          `Now compare this overall multiplier with 1 to find the net percentage change.`,
          `\\text{Net change}=\\left(${formatNumber(combinedFactor)}-1\\right)\\times100=${percent(netPercent)}`,
        ),
        ...sentenceWithMath(
          concludeNetChange(netPercent),
          `\\text{Net percentage change}=${renderedAnswer}`,
        ),
      );
      break;
    case "equivalentSingleMultiplier":
      lines.push(
        ...buildStageLines("first stage", direction1, rate1),
        ...buildStageLines("second stage", direction2, rate2),
        ...sentenceWithMath(
          `Multiply the stage multipliers to get one equivalent multiplier.`,
          `\\text{Equivalent multiplier}=${formatNumber(stage1Factor)}\\times${formatNumber(stage2Factor)}=${formatNumber(combinedFactor)}`,
        ),
        ...sentenceWithMath(
          `So the single equivalent multiplier is ${formatNumber(combinedFactor)}.`,
          `\\text{Equivalent multiplier}=${renderedAnswer}`,
        ),
      );
      break;
    case "reverseSuccessiveChange":
      lines.push(
        ...buildStageLines("first stage", direction1, rate1),
        ...buildStageLines("second stage", direction2, rate2),
        ...sentenceWithMath(
          `Multiply the stage multipliers to get the overall multiplier.`,
          `\\text{Overall multiplier}=${formatNumber(stage1Factor)}\\times${formatNumber(stage2Factor)}=${formatNumber(combinedFactor)}`,
        ),
        ...sentenceWithMath(
          `The final value is already known. So divide it by the overall multiplier to get the original value.`,
          `\\text{Original value}=\\frac{${formatNumber(finalValue)}}{${formatNumber(combinedFactor)}}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `So the original ${wholeLabel} was ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{Original ${wholeLabel}}=${renderedAnswer}`,
        ),
      );
      break;
    case "comparativeSuccessiveChange": {
      const labelA = String(parameters.variables["labelA"] ?? "A");
      const labelB = String(parameters.variables["labelB"] ?? "B");
      const dirA1 = direction(parameters, "directionA1");
      const dirA2 = direction(parameters, "directionA2");
      const dirB1 = direction(parameters, "directionB1");
      const dirB2 = direction(parameters, "directionB2");
      const rateA1 = asNumber(parameters, "rateA1");
      const rateA2 = asNumber(parameters, "rateA2");
      const rateB1 = asNumber(parameters, "rateB1");
      const rateB2 = asNumber(parameters, "rateB2");
      const factorA = Number(solver.evidence["factorA"] ?? 0);
      const factorB = Number(solver.evidence["factorB"] ?? 0);

      lines.push(
        ...buildStageLines(`${labelA} first stage`, dirA1, rateA1),
        ...buildStageLines(`${labelA} second stage`, dirA2, rateA2),
        ...sentenceWithMath(
          `So the final value of ${labelA} is found by applying its combined multiplier.`,
          `\\text{Final ${labelA}}=${formatNumber(asNumber(parameters, "originalA"))}\\times${formatNumber(factorA)}=${formatNumber(finalA)}`,
        ),
        ...buildStageLines(`${labelB} first stage`, dirB1, rateB1),
        ...buildStageLines(`${labelB} second stage`, dirB2, rateB2),
        ...sentenceWithMath(
          `So the final value of ${labelB} is found by applying its combined multiplier.`,
          `\\text{Final ${labelB}}=${formatNumber(asNumber(parameters, "originalB"))}\\times${formatNumber(factorB)}=${formatNumber(finalB)}`,
        ),
        ...sentenceWithMath(
          `Now compare the two final values.`,
          `\\text{Difference}=\\left|${formatNumber(finalA)}-${formatNumber(finalB)}\\right|=${formatNumber(difference)}`,
        ),
        ...sentenceWithMath(
          `So the difference between the final values is ${displayValue(parameters, difference)}.`,
          `\\text{Difference}=${renderedAnswer}`,
        ),
      );
      break;
    }
    case "multiStageSuccessiveChange":
    case "contextualSuccessiveChange": {
      const stages = buildStageArray(parameters);
      const factorTerms: string[] = [];
      for (const stage of stages) {
        lines.push(...buildStageLines(`stage ${stage.index}`, stage.direction, stage.rate));
        factorTerms.push(formatNumber(stageFactor(stage.direction, stage.rate)));
      }
      lines.push(
        ...sentenceWithMath(
          `Multiply all the stage multipliers to get one overall multiplier.`,
          `\\text{Overall multiplier}=${factorTerms.join("\\times")}=${formatNumber(factorTerms.reduce((acc, term) => acc * Number(term), 1))}`,
        ),
        ...sentenceWithMath(
          `Now multiply the original ${wholeLabel} by the overall multiplier.`,
          `\\text{Final ${wholeLabel}}=${formatNumber(originalValue)}\\times${factorTerms.join("\\times")}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `So the final ${wholeLabel} is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{Final ${wholeLabel}}=${renderedAnswer}`,
        ),
      );
      break;
    }
  }

  return {
    explanationId: parameters.explanationId,
    lines,
  };
}
