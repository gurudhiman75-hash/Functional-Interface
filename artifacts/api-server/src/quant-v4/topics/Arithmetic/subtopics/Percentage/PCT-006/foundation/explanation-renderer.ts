import { formatNumber, formatPercent, mathJaxBlock, percentMultiplier } from "./math";
import type { Pct006Explanation, Pct006Parameters, Pct006ReasoningGraph, Pct006SolverResult } from "./types";

function sentenceWithMath(statement: string, consequence: string) {
  return [statement, mathJaxBlock(consequence)];
}

function asNumber(parameters: Pct006Parameters, name: string) {
  return Number(parameters.variables[name] ?? 0);
}

function asString(parameters: Pct006Parameters, name: string, fallback = "") {
  return String(parameters.variables[name] ?? fallback);
}

function cleanRenderedAnswer(answer: string) {
  return answer.replaceAll("$$", "").trim().replace(/\.+$/, "");
}

export function renderPct006Explanation(
  parameters: Pct006Parameters,
  solver: Pct006SolverResult,
  _graph: Pct006ReasoningGraph,
): Pct006Explanation {
  const lines: string[] = [];
  const wholeLabel = asString(parameters, "wholeLabel", "value");
  const renderedAnswer = cleanRenderedAnswer(solver.answer);

  switch (parameters.taskKind) {
    case "directMoreThanComparison": {
      const rate = asNumber(parameters, "percentageRate");
      const given = asNumber(parameters, "baseValue");
      const multiplier = percentMultiplier("more", rate);
      const base = Number(solver.evidence["base"] ?? given);
      const greater = Number(solver.evidence["greater"] ?? 0);
      lines.push(
        ...sentenceWithMath(
          `${formatNumber(rate)}% more means the new ${wholeLabel} is ${formatNumber(100 + rate)}% of the base ${wholeLabel}.`,
          `${formatNumber(100 + rate)}\\%=\\frac{${formatNumber(100 + rate)}}{100}`,
        ),
        ...sentenceWithMath(
          `So the comparison multiplier is ${formatNumber(multiplier)}.`,
          `\\text{Multiplier}=${formatNumber(multiplier)}`,
        ),
      );
      if (parameters.solveMode === "moreFindBase") {
        lines.push(
          ...sentenceWithMath(
            `The given figure is the higher ${wholeLabel}, so divide it by the multiplier to recover the base.`,
            `\\text{Base ${wholeLabel}}=${formatNumber(given)}\\div${formatNumber(multiplier)}=${formatNumber(base)}`,
          ),
        );
      } else {
        lines.push(
          ...sentenceWithMath(
            `Multiply the base ${wholeLabel} by the comparison multiplier.`,
            `\\text{Higher value}=${formatNumber(base)}\\times${formatNumber(multiplier)}=${formatNumber(greater)}`,
          ),
        );
      }
      lines.push(...sentenceWithMath(`So the required answer is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`));
      break;
    }
    case "directLessThanComparison": {
      const rate = asNumber(parameters, "percentageRate");
      const given = asNumber(parameters, "baseValue");
      const multiplier = percentMultiplier("less", rate);
      const higher = Number(solver.evidence["higher"] ?? 0);
      const lower = Number(solver.evidence["lower"] ?? 0);
      lines.push(
        ...sentenceWithMath(
          `${formatNumber(rate)}% less means the reduced ${wholeLabel} is ${formatNumber(100 - rate)}% of the higher value.`,
          `${formatNumber(100 - rate)}\\%=\\frac{${formatNumber(100 - rate)}}{100}`,
        ),
        ...sentenceWithMath(
          `So the comparison multiplier is ${formatNumber(multiplier)}.`,
          `\\text{Multiplier}=${formatNumber(multiplier)}`,
        ),
      );
      if (parameters.solveMode === "lessFindBase") {
        lines.push(
          ...sentenceWithMath(
            `The given figure is the lower ${wholeLabel}, so divide it by the multiplier to recover the higher value.`,
            `\\text{Higher value}=${formatNumber(given)}\\div${formatNumber(multiplier)}=${formatNumber(higher)}`,
          ),
        );
      } else {
        lines.push(
          ...sentenceWithMath(
            `Multiply the higher ${wholeLabel} by the reduction multiplier.`,
            `\\text{Lower value}=${formatNumber(higher)}\\times${formatNumber(multiplier)}=${formatNumber(lower)}`,
          ),
        );
      }
      lines.push(...sentenceWithMath(`So the required answer is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`));
      break;
    }
    case "reverseBaseSwitchingComparison":
      lines.push(
        ...sentenceWithMath(
          `Reverse comparison needs a new base, so we divide the original percentage gap by the new base percentage.`,
          String(solver.mathJax["core"] ?? ""),
        ),
        ...sentenceWithMath(
          `That gives the reverse comparison directly.`,
          `\\text{Reverse comparison}=${renderedAnswer}`,
        ),
      );
      break;
    case "differenceAsPercentageOfSelectedBase":
      lines.push(
        ...sentenceWithMath(
          `First take the absolute difference between the two values.`,
          `\\text{Difference}=${formatNumber(Number(solver.evidence["difference"] ?? 0))}`,
        ),
        ...sentenceWithMath(
          `Now divide by the stated base and multiply by 100.`,
          String(solver.mathJax["core"] ?? ""),
        ),
        ...sentenceWithMath(`So the required percentage is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    case "ratioBasedPercentageComparison":
      lines.push(
        ...sentenceWithMath(
          `Use the ratio difference and divide by the selected base part of the ratio.`,
          String(solver.mathJax["core"] ?? ""),
        ),
        ...sentenceWithMath(`So the comparison percentage is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    case "requiredPercentageChangeToMatchTarget":
      lines.push(
        ...sentenceWithMath(
          `Required change is always measured on the value that must be revised.`,
          `\\text{Base for change}=${formatNumber(asNumber(parameters, "value1"))}`,
        ),
        ...sentenceWithMath(
          `Take the gap from target and divide by the present value.`,
          String(solver.mathJax["core"] ?? ""),
        ),
        ...sentenceWithMath(`So the required percentage change is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    case "compareAfterDifferentPercentageChanges":
      lines.push(
        ...sentenceWithMath(
          `Apply the stated percentage change to each value separately.`,
          `\\text{Final 1}=${formatNumber(Number(solver.evidence["final1"] ?? 0))},\\;\\text{Final 2}=${formatNumber(Number(solver.evidence["final2"] ?? 0))}`,
        ),
        ...sentenceWithMath(
          `Now compare the two final values.`,
          `\\text{Difference}=${formatNumber(Number(solver.evidence["difference"] ?? 0))}`,
        ),
        ...sentenceWithMath(`So the required comparison is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    case "chainPercentageComparison":
      lines.push(
        ...sentenceWithMath(
          `Convert both comparison statements into multipliers and combine them.`,
          String(solver.mathJax["core"] ?? ""),
        ),
        ...sentenceWithMath(
          `The combined multiplier tells us how ${asString(parameters, "subjectA", "A")} compares with ${asString(parameters, "subjectC", "C")}.`,
          `\\text{Combined effect}=${formatNumber(Number(solver.evidence["factorAC"] ?? 0))}`,
        ),
        ...sentenceWithMath(`So the final relation is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    case "percentagePointsVsPercentageChange":
      lines.push(
        ...sentenceWithMath(
          `Percentage-point change is the simple difference between the two rates.`,
          `\\text{Point change}=${formatNumber(Number(solver.evidence["pointDifference"] ?? 0))}`,
        ),
        ...sentenceWithMath(
          `Relative change compares that difference with the old rate.`,
          String(solver.mathJax["core"] ?? ""),
        ),
        ...sentenceWithMath(`So the required result is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    case "crossBasePercentageComparison":
      lines.push(
        ...sentenceWithMath(
          `When the totals are different, convert each percentage into its actual value first.`,
          `\\text{Actual 1}=${formatNumber(Number(solver.evidence["actual1"] ?? 0))},\\;\\text{Actual 2}=${formatNumber(Number(solver.evidence["actual2"] ?? 0))}`,
        ),
        ...sentenceWithMath(
          `Now compare the actual values, not the percentages alone.`,
          `\\text{Difference}=${formatNumber(Number(solver.evidence["difference"] ?? 0))}`,
        ),
        ...sentenceWithMath(`So the required answer is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
  }

  return {
    explanationId: parameters.explanationId,
    lines,
  };
}
