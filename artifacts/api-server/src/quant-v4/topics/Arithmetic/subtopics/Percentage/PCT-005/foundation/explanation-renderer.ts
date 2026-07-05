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

function localizedText(parameters: Pct005Parameters, en: string, hi: string, pa: string) {
  if (parameters.language === "hi") return hi;
  if (parameters.language === "pa") return pa;
  return en;
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

function concludeLocalizedNetChange(parameters: Pct005Parameters, netPercent: number) {
  if (parameters.language === "hi") {
    if (netPercent > 0) return `कुल परिवर्तन ${formatNumber(netPercent)}% की वृद्धि है।`;
    if (netPercent < 0) return `कुल परिवर्तन ${formatNumber(Math.abs(netPercent))}% की कमी है।`;
    return "कुल परिवर्तन 0% है।";
  }
  if (parameters.language === "pa") {
    if (netPercent > 0) return `ਕੁੱਲ ਬਦਲਾਅ ${formatNumber(netPercent)}% ਦਾ ਵਾਧਾ ਹੈ।`;
    if (netPercent < 0) return `ਕੁੱਲ ਬਦਲਾਅ ${formatNumber(Math.abs(netPercent))}% ਦੀ ਘਟਾਉ ਹੈ।`;
    return "ਕੁੱਲ ਬਦਲਾਅ 0% ਹੈ।";
  }
  return concludeNetChange(netPercent);
}

function buildLocalizedStageLines(
  parameters: Pct005Parameters,
  stageLabelEn: string,
  stageLabelHi: string,
  stageLabelPa: string,
  directionValue: Pct005Direction,
  rate: number,
) {
  const newPercent = stagePercent(directionValue, rate);
  const factor = stageFactor(directionValue, rate);
  return [
    ...sentenceWithMath(
      localizedText(
        parameters,
        `For ${stageLabelEn}, ${stageVerb(directionValue)} = ${formatNumber(rate)}%. So the new value becomes ${formatNumber(newPercent)}% of the previous value.`,
        `${stageLabelHi} के लिए ${directionValue === "increase" ? "वृद्धि" : "कमी"} = ${formatNumber(rate)}% है। इसलिए नया मान पिछले मान का ${formatNumber(newPercent)}% हो जाता है।`,
        `${stageLabelPa} ਲਈ ${directionValue === "increase" ? "ਵਾਧਾ" : "ਘਟਾਉ"} = ${formatNumber(rate)}% ਹੈ। ਇਸ ਲਈ ਨਵਾਂ ਮਾਨ ਪਿਛਲੇ ਮਾਨ ਦਾ ${formatNumber(newPercent)}% ਬਣ ਜਾਂਦਾ ਹੈ।`,
      ),
      `100\\%${stageSign(directionValue)}${percent(rate)}=${percent(newPercent)}`,
    ),
    ...fractionShortcut(newPercent),
    ...sentenceWithMath(
      localizedText(
        parameters,
        `So the multiplier for ${stageLabelEn} is ${formatNumber(newPercent)}/100.`,
        `अतः ${stageLabelHi} का गुणक ${formatNumber(newPercent)}/100 है।`,
        `ਇਸ ਲਈ ${stageLabelPa} ਦਾ ਗੁਣਕ ${formatNumber(newPercent)}/100 ਹੈ।`,
      ),
      `\\frac{${formatNumber(newPercent)}}{100}=${formatNumber(factor)}`,
    ),
  ];
}

function renderLocalizedPct005Explanation(parameters: Pct005Parameters, solver: Pct005SolverResult): string[] | null {
  if (parameters.language === "en") return null;

  const lines: string[] = [];
  const renderedAnswer = solver.answer.replaceAll("$$", "");
  const wholeLabel = String(parameters.variables["wholeLabel"] ?? "value");
  const originalValue = asNumber(parameters, "originalValue");
  const finalValue = asNumber(parameters, "finalValue");
  const rate1 = asNumber(parameters, "rate1");
  const rate2 = asNumber(parameters, "rate2");
  const direction1 = direction(parameters, "direction1", parameters.taskKind === "successiveDecrease" || parameters.taskKind === "decreaseThenIncrease" ? "decrease" : "increase");
  const direction2 = direction(parameters, "direction2", parameters.taskKind === "successiveDecrease" || parameters.taskKind === "increaseThenDecrease" ? "decrease" : "increase");
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
        ...buildLocalizedStageLines(parameters, "first stage", "पहले चरण", "ਪਹਿਲੇ ਪੜਾਅ", direction1, rate1),
        ...sentenceWithMath(localizedText(parameters, `Apply the first-stage multiplier to the original ${wholeLabel}.`, `पहले चरण के गुणक को मूल ${wholeLabel} पर लागू कीजिए।`, `ਪਹਿਲੇ ਪੜਾਅ ਦੇ ਗੁਣਕ ਨੂੰ ਮੂਲ ${wholeLabel} ਤੇ ਲਾਗੂ ਕਰੋ।`), `${formatNumber(originalValue)}\\times${formatNumber(stage1Factor)}=${formatNumber(afterFirstValue)}`),
        ...buildLocalizedStageLines(parameters, "second stage", "दूसरे चरण", "ਦੂਜੇ ਪੜਾਅ", direction2, rate2),
        ...sentenceWithMath(localizedText(parameters, `Now multiply by both stage multipliers to get the final ${wholeLabel}.`, `अब अंतिम ${wholeLabel} पाने के लिए दोनों चरणों के गुणकों से गुणा कीजिए।`, `ਹੁਣ ਅੰਤਿਮ ${wholeLabel} ਲੱਭਣ ਲਈ ਦੋਵੇਂ ਪੜਾਅਾਂ ਦੇ ਗੁਣਕਾਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।`), `${formatNumber(originalValue)}\\times${formatNumber(stage1Factor)}\\times${formatNumber(stage2Factor)}=${formatNumber(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `So the final ${wholeLabel} is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`, `अतः अंतिम ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} है।`, `ਇਸ ਲਈ ਅੰਤਿਮ ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} ਹੈ।`), parameters.language === "hi" ? `\\text{अंतिम मान}=${renderedAnswer}` : `\\text{ਅੰਤਿਮ ਮਾਨ}=${renderedAnswer}`),
      );
      break;
    case "netPercentageChange":
      lines.push(
        ...buildLocalizedStageLines(parameters, "first stage", "पहले चरण", "ਪਹਿਲੇ ਪੜਾਅ", direction1, rate1),
        ...buildLocalizedStageLines(parameters, "second stage", "दूसरे चरण", "ਦੂਜੇ ਪੜਾਅ", direction2, rate2),
        ...sentenceWithMath(localizedText(parameters, `Multiply the two stage multipliers to get the overall multiplier.`, `दोनों चरणों के गुणकों को गुणा करके कुल गुणक ज्ञात कीजिए।`, `ਦੋਵੇਂ ਪੜਾਅਾਂ ਦੇ ਗੁਣਕਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਕੁੱਲ ਗੁਣਕ ਲੱਭੋ।`), `${formatNumber(stage1Factor)}\\times${formatNumber(stage2Factor)}=${formatNumber(combinedFactor)}`),
        ...sentenceWithMath(localizedText(parameters, `Now compare this overall multiplier with 1 to find the net percentage change.`, `अब कुल गुणक की 1 से तुलना करके कुल प्रतिशत परिवर्तन ज्ञात कीजिए।`, `ਹੁਣ ਕੁੱਲ ਗੁਣਕ ਦੀ 1 ਨਾਲ ਤੁਲਨਾ ਕਰਕੇ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਕੱਢੋ।`), `\\left(${formatNumber(combinedFactor)}-1\\right)\\times100=${percent(netPercent)}`),
        ...sentenceWithMath(concludeLocalizedNetChange(parameters, netPercent), parameters.language === "hi" ? `\\text{कुल परिवर्तन}=${renderedAnswer}` : `\\text{ਕੁੱਲ ਬਦਲਾਅ}=${renderedAnswer}`),
      );
      break;
    case "equivalentSingleMultiplier":
      lines.push(
        ...buildLocalizedStageLines(parameters, "first stage", "पहले चरण", "ਪਹਿਲੇ ਪੜਾਅ", direction1, rate1),
        ...buildLocalizedStageLines(parameters, "second stage", "दूसरे चरण", "ਦੂਜੇ ਪੜਾਅ", direction2, rate2),
        ...sentenceWithMath(localizedText(parameters, `Multiply the stage multipliers to get one equivalent multiplier.`, `दोनों चरणों के गुणकों को गुणा करके एक समतुल्य गुणक ज्ञात कीजिए।`, `ਦੋਵੇਂ ਪੜਾਅਾਂ ਦੇ ਗੁਣਕਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਇੱਕ ਸਮਤੁਲ ਗੁਣਕ ਲੱਭੋ।`), `${formatNumber(stage1Factor)}\\times${formatNumber(stage2Factor)}=${formatNumber(combinedFactor)}`),
        ...sentenceWithMath(localizedText(parameters, `So the single equivalent multiplier is ${formatNumber(combinedFactor)}.`, `अतः एकल समतुल्य गुणक ${formatNumber(combinedFactor)} है।`, `ਇਸ ਲਈ ਇਕੱਲਾ ਸਮਤੁਲ ਗੁਣਕ ${formatNumber(combinedFactor)} ਹੈ।`), parameters.language === "hi" ? `\\text{गुणक}=${renderedAnswer}` : `\\text{ਗੁਣਕ}=${renderedAnswer}`),
      );
      break;
    case "reverseSuccessiveChange":
      lines.push(
        ...buildLocalizedStageLines(parameters, "first stage", "पहले चरण", "ਪਹਿਲੇ ਪੜਾਅ", direction1, rate1),
        ...buildLocalizedStageLines(parameters, "second stage", "दूसरे चरण", "ਦੂਜੇ ਪੜਾਅ", direction2, rate2),
        ...sentenceWithMath(localizedText(parameters, `Multiply the stage multipliers to get the overall multiplier.`, `दोनों चरणों के गुणकों को गुणा करके कुल गुणक ज्ञात कीजिए।`, `ਦੋਵੇਂ ਪੜਾਅਾਂ ਦੇ ਗੁਣਕਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਕੁੱਲ ਗੁਣਕ ਲੱਭੋ।`), `${formatNumber(stage1Factor)}\\times${formatNumber(stage2Factor)}=${formatNumber(combinedFactor)}`),
        ...sentenceWithMath(localizedText(parameters, `The final value is already known. So divide it by the overall multiplier to get the original value.`, `अंतिम मान पहले से ज्ञात है। इसलिए मूल मान पाने के लिए इसे कुल गुणक से भाग दीजिए।`, `ਅੰਤਿਮ ਮਾਨ ਪਹਿਲਾਂ ਹੀ ਪਤਾ ਹੈ। ਇਸ ਲਈ ਮੂਲ ਮਾਨ ਲੱਭਣ ਲਈ ਇਸ ਨੂੰ ਕੁੱਲ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦਿਓ।`), `\\frac{${formatNumber(finalValue)}}{${formatNumber(combinedFactor)}}=${formatNumber(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `So the original ${wholeLabel} was ${displayValue(parameters, solver.numericAnswer ?? 0)}.`, `अतः मूल ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} था।`, `ਇਸ ਲਈ ਮੂਲ ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} ਸੀ।`), parameters.language === "hi" ? `\\text{मूल मान}=${renderedAnswer}` : `\\text{ਮੂਲ ਮਾਨ}=${renderedAnswer}`),
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
        ...buildLocalizedStageLines(parameters, `${labelA} first stage`, `${labelA} का पहला चरण`, `${labelA} ਦਾ ਪਹਿਲਾ ਪੜਾਅ`, dirA1, rateA1),
        ...buildLocalizedStageLines(parameters, `${labelA} second stage`, `${labelA} का दूसरा चरण`, `${labelA} ਦਾ ਦੂਜਾ ਪੜਾਅ`, dirA2, rateA2),
        ...sentenceWithMath(localizedText(parameters, `So the final value of ${labelA} is found by applying its combined multiplier.`, `अतः ${labelA} का अंतिम मान उसका संयुक्त गुणक लागू करके मिलता है।`, `ਇਸ ਲਈ ${labelA} ਦਾ ਅੰਤਿਮ ਮਾਨ ਉਸਦੇ ਸੰਯੁਕਤ ਗੁਣਕ ਨੂੰ ਲਾਗੂ ਕਰਕੇ ਮਿਲਦਾ ਹੈ।`), `${formatNumber(asNumber(parameters, "originalA"))}\\times${formatNumber(factorA)}=${formatNumber(finalA)}`),
        ...buildLocalizedStageLines(parameters, `${labelB} first stage`, `${labelB} का पहला चरण`, `${labelB} ਦਾ ਪਹਿਲਾ ਪੜਾਅ`, dirB1, rateB1),
        ...buildLocalizedStageLines(parameters, `${labelB} second stage`, `${labelB} का दूसरा चरण`, `${labelB} ਦਾ ਦੂਜਾ ਪੜਾਅ`, dirB2, rateB2),
        ...sentenceWithMath(localizedText(parameters, `So the final value of ${labelB} is found by applying its combined multiplier.`, `अतः ${labelB} का अंतिम मान उसका संयुक्त गुणक लागू करके मिलता है।`, `ਇਸ ਲਈ ${labelB} ਦਾ ਅੰਤਿਮ ਮਾਨ ਉਸਦੇ ਸੰਯੁਕਤ ਗੁਣਕ ਨੂੰ ਲਾਗੂ ਕਰਕੇ ਮਿਲਦਾ ਹੈ।`), `${formatNumber(asNumber(parameters, "originalB"))}\\times${formatNumber(factorB)}=${formatNumber(finalB)}`),
        ...sentenceWithMath(localizedText(parameters, `Now compare the two final values.`, `अब दोनों अंतिम मानों की तुलना कीजिए।`, `ਹੁਣ ਦੋਵੇਂ ਅੰਤਿਮ ਮਾਨਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।`), `\\left|${formatNumber(finalA)}-${formatNumber(finalB)}\\right|=${formatNumber(difference)}`),
        ...sentenceWithMath(localizedText(parameters, `So the difference between the final values is ${displayValue(parameters, difference)}.`, `अतः अंतिम मानों के बीच का अंतर ${displayValue(parameters, difference)} है।`, `ਇਸ ਲਈ ਅੰਤਿਮ ਮਾਨਾਂ ਵਿਚਲਾ ਅੰਤਰ ${displayValue(parameters, difference)} ਹੈ।`), parameters.language === "hi" ? `\\text{अंतर}=${renderedAnswer}` : `\\text{ਅੰਤਰ}=${renderedAnswer}`),
      );
      break;
    }
    case "multiStageSuccessiveChange":
    case "contextualSuccessiveChange": {
      const stages = buildStageArray(parameters);
      const factorTerms: string[] = [];
      for (const stage of stages) {
        lines.push(...buildLocalizedStageLines(parameters, `stage ${stage.index}`, `चरण ${stage.index}`, `ਪੜਾਅ ${stage.index}`, stage.direction, stage.rate));
        factorTerms.push(formatNumber(stageFactor(stage.direction, stage.rate)));
      }
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `Multiply all the stage multipliers to get one overall multiplier.`, `सभी चरणों के गुणकों को गुणा करके एक कुल गुणक ज्ञात कीजिए।`, `ਸਾਰੇ ਪੜਾਅਾਂ ਦੇ ਗੁਣਕਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਇੱਕ ਕੁੱਲ ਗੁਣਕ ਲੱਭੋ।`), `${factorTerms.join("\\times")}=${formatNumber(factorTerms.reduce((acc, term) => acc * Number(term), 1))}`),
        ...sentenceWithMath(localizedText(parameters, `Now multiply the original ${wholeLabel} by the overall multiplier.`, `अब मूल ${wholeLabel} को कुल गुणक से गुणा कीजिए।`, `ਹੁਣ ਮੂਲ ${wholeLabel} ਨੂੰ ਕੁੱਲ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰੋ।`), `${formatNumber(originalValue)}\\times${factorTerms.join("\\times")}=${formatNumber(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `So the final ${wholeLabel} is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`, `अतः अंतिम ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} है।`, `ਇਸ ਲਈ ਅੰਤਿਮ ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} ਹੈ।`), parameters.language === "hi" ? `\\text{अंतिम मान}=${renderedAnswer}` : `\\text{ਅੰਤਿਮ ਮਾਨ}=${renderedAnswer}`),
      );
      break;
    }
  }

  return lines;
}

export function renderPct005Explanation(
  parameters: Pct005Parameters,
  solver: Pct005SolverResult,
  _graph: Pct005ReasoningGraph,
): Pct005Explanation {
  const localizedLines = renderLocalizedPct005Explanation(parameters, solver);
  if (localizedLines) {
    return {
      explanationId: parameters.explanationId,
      lines: localizedLines,
    };
  }

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
