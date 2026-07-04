import { formatNumber, mathJaxBlock } from "./math";
import type { Pct002Explanation, Pct002Parameters, Pct002ReasoningGraph, Pct002SolverResult } from "./types";

function sentenceWithMath(statement: string, consequence: string) {
  return [statement, mathJaxBlock(consequence)];
}

function displayValue(parameters: Pct002Parameters, numeric: number) {
  const prefix = String(parameters.variables["valuePrefix"] ?? "");
  return `${prefix}${formatNumber(numeric)}`;
}

function percent(numeric: number) {
  return `${formatNumber(numeric)}\\%`;
}

function targetPartIndex(parameters: Pct002Parameters) {
  const explicitIndex = Number(parameters.variables["targetPartIndex"]);
  if (explicitIndex === 1 || explicitIndex === 2) return explicitIndex;
  return String(parameters.variables["targetPartLabel"]) === "first part" ? 1 : 2;
}

function renderLocalizedWholeFromPartExplanation(
  parameters: Pct002Parameters,
  solver: Pct002SolverResult,
  knownRate: number,
  knownValue: number,
  onePercentValue: number,
  wholeLabel: string,
  renderedAnswer: string,
) {
  const answerValue = solver.numericAnswer ?? 0;

  if (parameters.language === "hi") {
    return [
      ...sentenceWithMath(
        `यहाँ ${formatNumber(knownRate)}% ${wholeLabel} का मान ${displayValue(parameters, knownValue)} है।`,
        `${percent(knownRate)}\\rightarrow${displayValue(parameters, knownValue)}`,
      ),
      ...sentenceWithMath(
        `1% का मान निकालने के लिए ${displayValue(parameters, knownValue)} को ${formatNumber(knownRate)} से भाग दें।`,
        `1\\%=\\frac{${formatNumber(knownValue)}}{${formatNumber(knownRate)}}=${formatNumber(onePercentValue)}`,
      ),
      ...sentenceWithMath(
        `अब कुल मान प्राप्त करने के लिए 1% के मान को 100 से गुणा करें।`,
        `100\\%=${formatNumber(onePercentValue)}\\times100=${formatNumber(answerValue)}`,
      ),
      ...sentenceWithMath(
        `इसलिए कुल ${wholeLabel} ${displayValue(parameters, answerValue)} है।`,
        `\\text{कुल ${wholeLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  if (parameters.language === "pa") {
    return [
      ...sentenceWithMath(
        `ਇੱਥੇ ${formatNumber(knownRate)}% ${wholeLabel} ਦਾ ਮਾਨ ${displayValue(parameters, knownValue)} ਹੈ।`,
        `${percent(knownRate)}\\rightarrow${displayValue(parameters, knownValue)}`,
      ),
      ...sentenceWithMath(
        `1% ਦਾ ਮਾਨ ਕੱਢਣ ਲਈ ${displayValue(parameters, knownValue)} ਨੂੰ ${formatNumber(knownRate)} ਨਾਲ ਭਾਗ ਕਰੋ।`,
        `1\\%=\\frac{${formatNumber(knownValue)}}{${formatNumber(knownRate)}}=${formatNumber(onePercentValue)}`,
      ),
      ...sentenceWithMath(
        `ਹੁਣ ਕੁੱਲ ਮਾਨ ਲੈਣ ਲਈ 1% ਦੇ ਮਾਨ ਨੂੰ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।`,
        `100\\%=${formatNumber(onePercentValue)}\\times100=${formatNumber(answerValue)}`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ ਕੁੱਲ ${wholeLabel} ${displayValue(parameters, answerValue)} ਹੈ।`,
        `\\text{ਕੁੱਲ ${wholeLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  return null;
}

function renderLocalizedAnotherPercentageExplanation(
  parameters: Pct002Parameters,
  solver: Pct002SolverResult,
  knownRate: number,
  knownValue: number,
  targetRate: number,
  onePercentValue: number,
  wholeLabel: string,
  targetLabel: string,
  renderedAnswer: string,
) {
  const answerValue = solver.numericAnswer ?? 0;

  if (parameters.language === "hi") {
    return [
      ...sentenceWithMath(
        `यहाँ ${formatNumber(knownRate)}% ${wholeLabel} का मान ${displayValue(parameters, knownValue)} है।`,
        `${percent(knownRate)}\\rightarrow${displayValue(parameters, knownValue)}`,
      ),
      ...sentenceWithMath(
        `पहले 1% का मान निकालने के लिए ${displayValue(parameters, knownValue)} को ${formatNumber(knownRate)} से भाग दें।`,
        `1\\%=\\frac{${formatNumber(knownValue)}}{${formatNumber(knownRate)}}=${formatNumber(onePercentValue)}`,
      ),
      ...sentenceWithMath(
        `अब ${formatNumber(targetRate)}% का मान निकालने के लिए 1% के मान को ${formatNumber(targetRate)} से गुणा करें।`,
        `${percent(targetRate)}=${formatNumber(onePercentValue)}\\times${formatNumber(targetRate)}=${formatNumber(answerValue)}`,
      ),
      ...sentenceWithMath(
        `इसलिए ${formatNumber(targetRate)}% ${wholeLabel} का मान ${displayValue(parameters, answerValue)} है।`,
        `\\text{${targetLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  if (parameters.language === "pa") {
    return [
      ...sentenceWithMath(
        `ਇੱਥੇ ${formatNumber(knownRate)}% ${wholeLabel} ਦਾ ਮਾਨ ${displayValue(parameters, knownValue)} ਹੈ।`,
        `${percent(knownRate)}\\rightarrow${displayValue(parameters, knownValue)}`,
      ),
      ...sentenceWithMath(
        `ਪਹਿਲਾਂ 1% ਦਾ ਮਾਨ ਕੱਢਣ ਲਈ ${displayValue(parameters, knownValue)} ਨੂੰ ${formatNumber(knownRate)} ਨਾਲ ਭਾਗ ਕਰੋ।`,
        `1\\%=\\frac{${formatNumber(knownValue)}}{${formatNumber(knownRate)}}=${formatNumber(onePercentValue)}`,
      ),
      ...sentenceWithMath(
        `ਹੁਣ ${formatNumber(targetRate)}% ਦਾ ਮਾਨ ਕੱਢਣ ਲਈ 1% ਦੇ ਮਾਨ ਨੂੰ ${formatNumber(targetRate)} ਨਾਲ ਗੁਣਾ ਕਰੋ।`,
        `${percent(targetRate)}=${formatNumber(onePercentValue)}\\times${formatNumber(targetRate)}=${formatNumber(answerValue)}`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ ${formatNumber(targetRate)}% ${wholeLabel} ਦਾ ਮਾਨ ${displayValue(parameters, answerValue)} ਹੈ।`,
        `\\text{${targetLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  return null;
}

export function renderPct002Explanation(parameters: Pct002Parameters, solver: Pct002SolverResult, _graph: Pct002ReasoningGraph): Pct002Explanation {
  const lines: string[] = [];
  const knownRate = Number(parameters.variables["knownRate"] ?? 0);
  const knownValue = Number(parameters.variables["knownValue"] ?? 0);
  const targetRate = Number(parameters.variables["targetRate"] ?? 0);
  const wholeValue = Number(parameters.variables["wholeValue"] ?? 0);
  const partValue = Number(parameters.variables["partValue"] ?? 0);
  const targetValue = Number(parameters.variables["targetValue"] ?? 0);
  const totalValue = Number(parameters.variables["totalValue"] ?? 0);
  const partA = Number(parameters.variables["partA"] ?? 0);
  const partB = Number(parameters.variables["partB"] ?? 0);
  const onePercentValue = Number(solver.evidence["onePercentValue"] ?? 0);
  const partLabel = String(parameters.variables["partLabel"] ?? "part");
  const wholeLabel = String(parameters.variables["wholeLabel"] ?? "whole");
  const targetLabel = String(parameters.variables["targetLabel"] ?? partLabel);
  const complementLabel = String(parameters.variables["complementLabel"] ?? "remaining part");
  const otherLabel = String(parameters.variables["otherLabel"] ?? "other part");
  const thirdLabel = String(parameters.variables["thirdLabel"] ?? "third part");
  const fourthLabel = String(parameters.variables["fourthLabel"] ?? "fourth part");
  const targetPartLabel = String(parameters.variables["targetPartLabel"] ?? "first part");
  const renderedAnswer = solver.answer.replaceAll("$$", "");

  switch (parameters.taskKind) {
    case "wholeFromPart": {
      const localizedLines =
        parameters.canonicalProblemId === "PCT-CP-001"
          ? renderLocalizedWholeFromPartExplanation(
              parameters,
              solver,
              knownRate,
              knownValue,
              onePercentValue,
              wholeLabel,
              renderedAnswer,
            )
          : null;

      lines.push(
        ...(localizedLines ?? [
        ...sentenceWithMath(
          `Here, ${formatNumber(knownRate)}% of the ${wholeLabel} equals ${displayValue(parameters, knownValue)}.`,
          `${percent(knownRate)}\\rightarrow${displayValue(parameters, knownValue)}`,
        ),
        ...sentenceWithMath(
          `To determine the value of 1%, divide ${displayValue(parameters, knownValue)} by ${formatNumber(knownRate)}.`,
          `1\\%=\\frac{${formatNumber(knownValue)}}{${formatNumber(knownRate)}}=${formatNumber(onePercentValue)}`,
        ),
        ...sentenceWithMath(
          `Now multiply the value of 1% by 100 to get the whole.`,
          `100\\%=${formatNumber(onePercentValue)}\\times100=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the total ${wholeLabel} is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{Total ${wholeLabel}}=${renderedAnswer}`,
        ),
        ])
      );
      break;
    }
    case "anotherPercentageFromKnownPercentage": {
      const localizedLines =
        parameters.canonicalProblemId === "PCT-CP-002"
          ? renderLocalizedAnotherPercentageExplanation(
              parameters,
              solver,
              knownRate,
              knownValue,
              targetRate,
              onePercentValue,
              wholeLabel,
              targetLabel,
              renderedAnswer,
            )
          : null;

      lines.push(
        ...(localizedLines ?? [
        ...sentenceWithMath(
          `Here, ${formatNumber(knownRate)}% of the ${wholeLabel} equals ${displayValue(parameters, knownValue)}.`,
          `${percent(knownRate)}\\rightarrow${displayValue(parameters, knownValue)}`,
        ),
        ...sentenceWithMath(
          `First find the value corresponding to 1% by dividing ${displayValue(parameters, knownValue)} by ${formatNumber(knownRate)}.`,
          `1\\%=\\frac{${formatNumber(knownValue)}}{${formatNumber(knownRate)}}=${formatNumber(onePercentValue)}`,
        ),
        ...sentenceWithMath(
          `Now multiply the value of 1% by ${formatNumber(targetRate)} to get ${formatNumber(targetRate)}%.`,
          `${percent(targetRate)}=${formatNumber(onePercentValue)}\\times${formatNumber(targetRate)}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore ${formatNumber(targetRate)}% of the ${wholeLabel} is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{${targetLabel}}=${renderedAnswer}`,
        ),
        ])
      );
      break;
    }
    case "percentageFromPartAndWhole":
      lines.push(
        ...sentenceWithMath(
          `The whole ${wholeLabel} corresponds to 100%.`,
          `100\\%\\rightarrow${displayValue(parameters, wholeValue)}`,
        ),
        ...sentenceWithMath(
          `So 1% is obtained by dividing ${displayValue(parameters, wholeValue)} by 100.`,
          `1\\%=\\frac{${formatNumber(wholeValue)}}{100}=${formatNumber(onePercentValue)}`,
        ),
        ...sentenceWithMath(
          `Now compare ${displayValue(parameters, partValue)} with the value of 1% to get the required percentage.`,
          `\\text{Required percent}=\\frac{${formatNumber(partValue)}}{${formatNumber(onePercentValue)}}=${percent(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore ${displayValue(parameters, partValue)} is ${formatNumber(solver.numericAnswer ?? 0)}% of the ${wholeLabel}.`,
          `\\text{${partLabel}}=${renderedAnswer}`,
        ),
      );
      break;
    case "reversePercentageMapping":
      lines.push(
        ...sentenceWithMath(
          `Here, ${formatNumber(knownRate)}% of the ${wholeLabel} equals ${displayValue(parameters, knownValue)}.`,
          `${percent(knownRate)}\\rightarrow${displayValue(parameters, knownValue)}`,
        ),
        ...sentenceWithMath(
          `To determine the value of 1%, divide ${displayValue(parameters, knownValue)} by ${formatNumber(knownRate)}.`,
          `1\\%=\\frac{${formatNumber(knownValue)}}{${formatNumber(knownRate)}}=${formatNumber(onePercentValue)}`,
        ),
        ...sentenceWithMath(
          `Now compare ${displayValue(parameters, targetValue)} with the value of 1% to find the required percentage.`,
          `\\text{Required percent}=\\frac{${formatNumber(targetValue)}}{${formatNumber(onePercentValue)}}=${percent(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore ${displayValue(parameters, targetValue)} is ${formatNumber(solver.numericAnswer ?? 0)}% of the ${wholeLabel}.`,
          `\\text{Required percent}=${renderedAnswer}`,
        ),
      );
      break;
    case "ratioToPercentage": {
      const totalParts = partA + partB;
      const targetPartValue = targetPartIndex(parameters) === 1 ? partA : partB;
      lines.push(
        ...sentenceWithMath(
          `First add the ratio parts to get the whole number of equal parts.`,
          `\\text{Total parts}=${formatNumber(partA)}+${formatNumber(partB)}=${formatNumber(totalParts)}`,
        ),
        ...sentenceWithMath(
          `The ${targetPartLabel} accounts for ${formatNumber(targetPartValue)} out of these ${formatNumber(totalParts)} parts.`,
          `\\text{Share fraction}=\\frac{${formatNumber(targetPartValue)}}{${formatNumber(totalParts)}}`,
        ),
        ...sentenceWithMath(
          `Convert that share into a percentage.`,
          `\\text{Required percent}=\\frac{${formatNumber(targetPartValue)}}{${formatNumber(totalParts)}}\\times100=${percent(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the ${targetPartLabel} corresponds to ${formatNumber(solver.numericAnswer ?? 0)}%.`,
          `\\text{${targetPartLabel}}=${renderedAnswer}`,
        ),
      );
      break;
    }
    case "complementaryPercentage":
      lines.push(
        ...sentenceWithMath(
          `The full quantity is always 100%.`,
          `${partLabel}+${complementLabel}=100\\%`,
        ),
        ...sentenceWithMath(
          `So subtract ${formatNumber(knownRate)}% from 100% to get the remaining percentage.`,
          `${complementLabel}=100\\%-${percent(knownRate)}=${percent(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the ${complementLabel} percentage is ${formatNumber(solver.numericAnswer ?? 0)}%.`,
          `\\text{${complementLabel}}=${renderedAnswer}`,
        ),
      );
      break;
    case "differenceBetweenPercentageParts":
      lines.push(
        ...sentenceWithMath(
          `Both parts are already given as percentages of the same whole.`,
          `${partLabel}=${percent(Number(parameters.variables["rate1"] ?? 0))},\\ ${otherLabel}=${percent(Number(parameters.variables["rate2"] ?? 0))}`,
        ),
        ...sentenceWithMath(
          `So subtract the smaller percentage from the larger percentage.`,
          `\\text{Difference}=${percent(Number(parameters.variables["rate1"] ?? 0))}-${percent(Number(parameters.variables["rate2"] ?? 0))}=${percent(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the percentage difference is ${formatNumber(solver.numericAnswer ?? 0)}%.`,
          `\\text{Difference}=${renderedAnswer}`,
        ),
      );
      break;
    case "percentagePartition":
      lines.push(
        ...sentenceWithMath(
          `The whole ${wholeLabel} corresponds to 100%.`,
          `100\\%\\rightarrow${displayValue(parameters, totalValue)}`,
        ),
        ...sentenceWithMath(
          `So the value corresponding to 1% is obtained by dividing ${displayValue(parameters, totalValue)} by 100.`,
          `1\\%=\\frac{${formatNumber(totalValue)}}{100}=${formatNumber(onePercentValue)}`,
        ),
        ...sentenceWithMath(
          `Now multiply the value of 1% by ${formatNumber(targetRate)} to find the ${targetLabel}.`,
          `${percent(targetRate)}=${formatNumber(onePercentValue)}\\times${formatNumber(targetRate)}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the ${targetLabel} count is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{${targetLabel}}=${renderedAnswer}`,
        ),
      );
      break;
    case "missingPercentage":
      lines.push(
        ...sentenceWithMath(
          `The full distribution adds up to 100%.`,
          `${partLabel}+${otherLabel}+${thirdLabel}+${complementLabel}=100\\%`,
        ),
        ...sentenceWithMath(
          `First add the known percentages.`,
          `${percent(Number(parameters.variables["rate1"] ?? 0))}+${percent(Number(parameters.variables["rate2"] ?? 0))}+${percent(Number(parameters.variables["rate3"] ?? 0))}=${percent(100 - (solver.numericAnswer ?? 0))}`,
        ),
        ...sentenceWithMath(
          `Now subtract that total from 100% to get the missing percentage.`,
          `${complementLabel}=100\\%-${percent(100 - (solver.numericAnswer ?? 0))}=${percent(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the missing percentage is ${formatNumber(solver.numericAnswer ?? 0)}%.`,
          `\\text{${complementLabel}}=${renderedAnswer}`,
        ),
      );
      break;
    case "multiCategoryPercentageDistribution":
      lines.push(
        ...sentenceWithMath(
          `The whole ${wholeLabel} corresponds to 100%.`,
          `100\\%\\rightarrow${displayValue(parameters, totalValue)}`,
        ),
        ...sentenceWithMath(
          `So the value corresponding to 1% is obtained by dividing ${displayValue(parameters, totalValue)} by 100.`,
          `1\\%=\\frac{${formatNumber(totalValue)}}{100}=${formatNumber(onePercentValue)}`,
        ),
        ...sentenceWithMath(
          `Now multiply the value of 1% by the percentage for ${targetLabel}.`,
          `${percent(targetRate)}=${formatNumber(onePercentValue)}\\times${formatNumber(targetRate)}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the value for ${targetLabel} is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
          `\\text{${targetLabel}}=${renderedAnswer}`,
        ),
      );
      break;
  }

  return {
    explanationId: parameters.explanationId,
    lines,
  };
}
