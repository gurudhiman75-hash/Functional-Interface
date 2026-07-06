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

function localizedText(parameters: Pct004Parameters, en: string, hi: string, pa: string) {
  if (parameters.language === "hi") return hi;
  if (parameters.language === "pa") return pa;
  return en;
}

function fractionShortcut(parameters: Pct004Parameters, percentValue: number) {
  const key = `${formatNumber(percentValue)}%`;
  const fraction = getFractionEquivalent(key);
  if (!fraction) return [] as string[];
  const [numerator, denominator] = fraction.split("/");
  return sentenceWithMath(
    localizedText(
      parameters,
      `${key} can also be written as the fraction ${numerator}/${denominator}.`,
      `${key} को ${numerator}/${denominator} भिन्न के रूप में भी लिखा जा सकता है।`,
      `${key} ਨੂੰ ${numerator}/${denominator} ਭਿੰਨ ਵਜੋਂ ਵੀ ਲਿਖਿਆ ਜਾ ਸਕਦਾ ਹੈ।`,
    ),
    `${formatNumber(percentValue)}\\%=\\frac{${numerator}}{${denominator}}`,
  );
}

function renderLocalizedPct004Explanation(parameters: Pct004Parameters, solver: Pct004SolverResult): string[] | null {
  if (parameters.language === "en") return null;

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
        ...sentenceWithMath(localizedText(parameters, `Decrease = ${formatNumber(decreaseRate)}%. So the remaining value is ${formatNumber(remainingPercent)}% of the original.`, `कमी = ${formatNumber(decreaseRate)}% है। इसलिए शेष मान मूल का ${formatNumber(remainingPercent)}% है।`, `ਘਟਾਉ = ${formatNumber(decreaseRate)}% ਹੈ। ਇਸ ਲਈ ਬਚਿਆ ਮਾਨ ਮੂਲ ਦਾ ${formatNumber(remainingPercent)}% ਹੈ।`), `100\\%-${percent(decreaseRate)}=${percent(remainingPercent)}`),
        ...fractionShortcut(parameters, remainingPercent),
        ...sentenceWithMath(localizedText(parameters, `Now take ${formatNumber(remainingPercent)}% of the original ${wholeLabel}.`, `अब मूल ${wholeLabel} का ${formatNumber(remainingPercent)}% ज्ञात कीजिए।`, `ਹੁਣ ਮੂਲ ${wholeLabel} ਦਾ ${formatNumber(remainingPercent)}% ਕੱਢੋ।`), `${formatNumber(originalValue)}\\times\\frac{${formatNumber(remainingPercent)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `So the new ${wholeLabel} is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`, `अतः नया ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} है।`, `ਇਸ ਲਈ ਨਵਾਂ ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} ਹੈ।`), parameters.language === "hi" ? `\\text{नया मान}=${renderedAnswer}` : `\\text{ਨਵਾਂ ਮਾਨ}=${renderedAnswer}`),
      );
      break;
    case "decreaseAmount":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `Only the reduced part is needed here.`, `यहाँ केवल घटी हुई मात्रा चाहिए।`, `ਇੱਥੇ ਸਿਰਫ਼ ਘਟੀ ਹੋਈ ਮਾਤਰਾ ਚਾਹੀਦੀ ਹੈ।`), `${percent(decreaseRate)}\\text{ of }${displayValue(parameters, originalValue)}`),
        ...fractionShortcut(parameters, decreaseRate),
        ...sentenceWithMath(localizedText(parameters, `So find ${formatNumber(decreaseRate)}% of the original ${wholeLabel}.`, `अतः मूल ${wholeLabel} का ${formatNumber(decreaseRate)}% ज्ञात कीजिए।`, `ਇਸ ਲਈ ਮੂਲ ${wholeLabel} ਦਾ ${formatNumber(decreaseRate)}% ਕੱਢੋ।`), `${formatNumber(originalValue)}\\times\\frac{${formatNumber(decreaseRate)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `So the decrease amount is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`, `अतः कमी की मात्रा ${displayValue(parameters, solver.numericAnswer ?? 0)} है।`, `ਇਸ ਲਈ ਘਟਾਉ ਦੀ ਮਾਤਰਾ ${displayValue(parameters, solver.numericAnswer ?? 0)} ਹੈ।`), parameters.language === "hi" ? `\\text{कमी}=${renderedAnswer}` : `\\text{ਘਟਾਉ}=${renderedAnswer}`),
      );
      break;
    case "originalValueFromDecreasedValue":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `After a decrease of ${formatNumber(decreaseRate)}%, the new value becomes ${formatNumber(remainingPercent)}% of the original.`, `${formatNumber(decreaseRate)}% की कमी के बाद नया मान मूल का ${formatNumber(remainingPercent)}% रह जाता है।`, `${formatNumber(decreaseRate)}% ਦੀ ਘਟਾਉ ਤੋਂ ਬਾਅਦ ਨਵਾਂ ਮਾਨ ਮੂਲ ਦਾ ${formatNumber(remainingPercent)}% ਰਹਿ ਜਾਂਦਾ ਹੈ।`), `${percent(remainingPercent)}\\rightarrow${displayValue(parameters, decreasedValue)}`),
        ...fractionShortcut(parameters, remainingPercent),
        ...sentenceWithMath(localizedText(parameters, `First find the value of 1% by dividing ${displayValue(parameters, decreasedValue)} by ${formatNumber(remainingPercent)}.`, `1% का मान पाने के लिए ${displayValue(parameters, decreasedValue)} को ${formatNumber(remainingPercent)} से भाग दीजिए।`, `1% ਦਾ ਮਾਨ ਲੱਭਣ ਲਈ ${displayValue(parameters, decreasedValue)} ਨੂੰ ${formatNumber(remainingPercent)} ਨਾਲ ਭਾਗ ਦਿਓ।`), `1\\%=\\frac{${formatNumber(decreasedValue)}}{${formatNumber(remainingPercent)}}=${formatNumber(onePercentValue)}`),
        ...sentenceWithMath(localizedText(parameters, `Now multiply the value of 1% by 100 to get the original value.`, `अब मूल मान पाने के लिए 1% के मान को 100 से गुणा कीजिए।`, `ਹੁਣ ਮੂਲ ਮਾਨ ਲੱਭਣ ਲਈ 1% ਦੇ ਮਾਨ ਨੂੰ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।`), `100\\%=${formatNumber(onePercentValue)}\\times100=${formatNumber(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `So the original ${wholeLabel} was ${displayValue(parameters, solver.numericAnswer ?? 0)}.`, `अतः मूल ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} था।`, `ਇਸ ਲਈ ਮੂਲ ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} ਸੀ।`), parameters.language === "hi" ? `\\text{मूल मान}=${renderedAnswer}` : `\\text{ਮੂਲ ਮਾਨ}=${renderedAnswer}`),
      );
      break;
    case "decreaseMultiplier":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `A decrease of ${formatNumber(decreaseRate)}% leaves ${formatNumber(remainingPercent)}% of the original.`, `${formatNumber(decreaseRate)}% की कमी से मूल का ${formatNumber(remainingPercent)}% बचता है।`, `${formatNumber(decreaseRate)}% ਦੀ ਘਟਾਉ ਨਾਲ ਮੂਲ ਦਾ ${formatNumber(remainingPercent)}% ਬਚਦਾ ਹੈ।`), `100\\%-${percent(decreaseRate)}=${percent(remainingPercent)}`),
        ...fractionShortcut(parameters, remainingPercent),
        ...sentenceWithMath(localizedText(parameters, `Write this remaining percentage as a multiplier.`, `इस बचे हुए प्रतिशत को गुणक के रूप में लिखिए।`, `ਇਸ ਬਚੇ ਹੋਏ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਗੁਣਕ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`), `\\frac{${formatNumber(remainingPercent)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `So the decrease multiplier is ${formatNumber(solver.numericAnswer ?? 0)}.`, `अतः कमी का गुणक ${formatNumber(solver.numericAnswer ?? 0)} है।`, `ਇਸ ਲਈ ਘਟਾਉ ਗੁਣਕ ${formatNumber(solver.numericAnswer ?? 0)} ਹੈ।`), parameters.language === "hi" ? `\\text{गुणक}=${renderedAnswer}` : `\\text{ਗੁਣਕ}=${renderedAnswer}`),
      );
      break;
    case "successiveDecrease":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `After the first decrease of ${formatNumber(rate1)}%, the ${wholeLabel} becomes ${formatNumber(100 - rate1)}% of its original value.`, `पहली ${formatNumber(rate1)}% कमी के बाद ${wholeLabel}, अपने मूल मान का ${formatNumber(100 - rate1)}% रह जाता है।`, `ਪਹਿਲੀ ${formatNumber(rate1)}% ਘਟਾਉ ਤੋਂ ਬਾਅਦ ${wholeLabel}, ਆਪਣੇ ਮੂਲ ਮਾਨ ਦਾ ${formatNumber(100 - rate1)}% ਰਹਿ ਜਾਂਦਾ ਹੈ।`), `${formatNumber(originalValue)}\\times\\frac{${formatNumber(100 - rate1)}}{100}=${formatNumber(afterFirstValue)}`),
        ...sentenceWithMath(localizedText(parameters, `Now decrease this new value by ${formatNumber(rate2)}%.`, `अब इस नए मान में ${formatNumber(rate2)}% की कमी कीजिए।`, `ਹੁਣ ਇਸ ਨਵੇਂ ਮਾਨ ਵਿੱਚ ${formatNumber(rate2)}% ਦੀ ਘਟਾਉ ਕਰੋ।`), `${formatNumber(afterFirstValue)}\\times\\frac{${formatNumber(100 - rate2)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `So the ${wholeLabel} after both decreases is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`, `अतः दोनों कमियों के बाद ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} है।`, `ਇਸ ਲਈ ਦੋਵੇਂ ਘਟਾਵਾਂ ਤੋਂ ਬਾਅਦ ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} ਹੈ।`), parameters.language === "hi" ? `\\text{अंतिम मान}=${renderedAnswer}` : `\\text{ਅੰਤਿਮ ਮਾਨ}=${renderedAnswer}`),
      );
      break;
    case "netPercentageDecrease":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `Convert both decreases into retained factors.`, `दोनों कमियों को शेष रहने वाले गुणकों में बदलिए।`, `ਦੋਵੇਂ ਘਟਾਵਾਂ ਨੂੰ ਬਚੇ ਰਹਿਣ ਵਾਲੇ ਗੁਣਕਾਂ ਵਿੱਚ ਬਦਲੋ।`), `\\frac{${formatNumber(100 - rate1)}}{100}\\times\\frac{${formatNumber(100 - rate2)}}{100}`),
        ...sentenceWithMath(localizedText(parameters, `This combined factor shows what fraction of the original still remains.`, `यह संयुक्त गुणक बताता है कि मूल का कितना भाग अभी बचा है।`, `ਇਹ ਸੰਯੁਕਤ ਗੁਣਕ ਦੱਸਦਾ ਹੈ ਕਿ ਮੂਲ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਅਜੇ ਬਚਿਆ ਹੈ।`), `\\frac{${formatNumber(100 - rate1)}}{100}\\times\\frac{${formatNumber(100 - rate2)}}{100}=${formatNumber(1 - netPercent / 100)}`),
        ...sentenceWithMath(localizedText(parameters, `So subtract the remaining fraction from 1 and convert it into percent.`, `अब बचे हुए भिन्न को 1 से घटाकर प्रतिशत में बदलिए।`, `ਹੁਣ ਬਚੇ ਹੋਏ ਭਿੰਨ ਨੂੰ 1 ਵਿੱਚੋਂ ਘਟਾ ਕੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲੋ।`), `${percent(netPercent)}`),
        ...sentenceWithMath(localizedText(parameters, `So the overall percentage decrease is ${formatNumber(netPercent)}%.`, `अतः कुल प्रतिशत कमी ${formatNumber(netPercent)}% है।`, `ਇਸ ਲਈ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਘਟਾਉ ${formatNumber(netPercent)}% ਹੈ।`), parameters.language === "hi" ? `\\text{कुल कमी}=${renderedAnswer}` : `\\text{ਕੁੱਲ ਘਟਾਉ}=${renderedAnswer}`),
      );
      break;
    case "comparativeDecrease":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `First find the new value of ${labelA} after its decrease.`, `पहले ${labelA} का नया मान कमी के बाद ज्ञात कीजिए।`, `ਪਹਿਲਾਂ ${labelA} ਦਾ ਨਵਾਂ ਮਾਨ ਘਟਾਉ ਤੋਂ ਬਾਅਦ ਕੱਢੋ।`), `${formatNumber(originalA)}\\times\\frac{${formatNumber(100 - rateA)}}{100}=${formatNumber(newA)}`),
        ...sentenceWithMath(localizedText(parameters, `Now find the new value of ${labelB} after its decrease.`, `अब ${labelB} का नया मान कमी के बाद ज्ञात कीजिए।`, `ਹੁਣ ${labelB} ਦਾ ਨਵਾਂ ਮਾਨ ਘਟਾਉ ਤੋਂ ਬਾਅਦ ਕੱਢੋ।`), `${formatNumber(originalB)}\\times\\frac{${formatNumber(100 - rateB)}}{100}=${formatNumber(newB)}`),
        ...sentenceWithMath(localizedText(parameters, `Now compare the two new values.`, `अब दोनों नए मानों की तुलना कीजिए।`, `ਹੁਣ ਦੋਵੇਂ ਨਵੇਂ ਮਾਨਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।`), `\\left|${formatNumber(newA)}-${formatNumber(newB)}\\right|=${formatNumber(difference)}`),
        ...sentenceWithMath(localizedText(parameters, `So the difference between the new values is ${displayValue(parameters, difference)}.`, `अतः नए मानों के बीच का अंतर ${displayValue(parameters, difference)} है।`, `ਇਸ ਲਈ ਨਵੇਂ ਮਾਨਾਂ ਵਿਚਲਾ ਅੰਤਰ ${displayValue(parameters, difference)} ਹੈ।`), parameters.language === "hi" ? `\\text{अंतर}=${renderedAnswer}` : `\\text{ਅੰਤਰ}=${renderedAnswer}`),
      );
      break;
    case "componentWiseDecrease":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `At first, ${formatNumber(partRate)}% of the ${wholeLabel} are ${partLabel}. So split the original total.`, `शुरू में ${wholeLabel} का ${formatNumber(partRate)}% ${partLabel} है। इसलिए मूल कुल को बाँटिए।`, `ਸ਼ੁਰੂ ਵਿੱਚ ${wholeLabel} ਦਾ ${formatNumber(partRate)}% ${partLabel} ਹੈ। ਇਸ ਲਈ ਮੂਲ ਕੁੱਲ ਨੂੰ ਵੰਡੋ।`), `${formatNumber(totalValue)}\\times\\frac{${formatNumber(partRate)}}{100}=${formatNumber(initialPartValue)},\\ ${formatNumber(initialOtherValue)}`),
        ...sentenceWithMath(localizedText(parameters, `Now decrease the numbers of ${partLabel} and ${otherLabel} by their respective percentages.`, `अब ${partLabel} और ${otherLabel} की संख्याओं में उनके-उनके प्रतिशत से कमी कीजिए।`, `ਹੁਣ ${partLabel} ਅਤੇ ${otherLabel} ਦੀਆਂ ਗਿਣਤੀਆਂ ਵਿੱਚ ਆਪਣੇ-ਆਪਣੇ ਪ੍ਰਤੀਸ਼ਤ ਅਨੁਸਾਰ ਘਟਾਉ ਕਰੋ।`), `${formatNumber(initialPartValue)}\\times\\frac{${formatNumber(100 - partDecreaseRate)}}{100}=${formatNumber(newPartValue)},\\ ${formatNumber(initialOtherValue)}\\times\\frac{${formatNumber(100 - otherDecreaseRate)}}{100}=${formatNumber(newOtherValue)}`),
        ...sentenceWithMath(localizedText(parameters, `Use the new total to find the updated percentage of ${partLabel}.`, `अब ${partLabel} का नया प्रतिशत ज्ञात करने के लिए नए कुल का उपयोग कीजिए।`, `ਹੁਣ ${partLabel} ਦਾ ਨਵਾਂ ਪ੍ਰਤੀਸ਼ਤ ਲੱਭਣ ਲਈ ਨਵੇਂ ਕੁੱਲ ਦੀ ਵਰਤੋਂ ਕਰੋ।`), `\\frac{${formatNumber(newPartValue)}}{${formatNumber(newTotalValue)}}\\times100=${percent(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `So the new percentage of ${partLabel} is ${formatNumber(solver.numericAnswer ?? 0)}%.`, `अतः ${partLabel} का नया प्रतिशत ${formatNumber(solver.numericAnswer ?? 0)}% है।`, `ਇਸ ਲਈ ${partLabel} ਦਾ ਨਵਾਂ ਪ੍ਰਤੀਸ਼ਤ ${formatNumber(solver.numericAnswer ?? 0)}% ਹੈ।`), parameters.language === "hi" ? `\\text{नया प्रतिशत}=${renderedAnswer}` : `\\text{ਨਵਾਂ ਪ੍ਰਤੀਸ਼ਤ}=${renderedAnswer}`),
      );
      break;
    case "requiredDecrease":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `First find how much reduction is needed to reach the target.`, `पहले लक्ष्य तक पहुँचने के लिए आवश्यक कमी ज्ञात कीजिए।`, `ਪਹਿਲਾਂ ਨਿਸ਼ਾਨੇ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਲੋੜੀਂਦੀ ਘਟਾਉ ਕੱਢੋ।`), `${formatNumber(currentValue)}-${formatNumber(targetValue)}=${formatNumber(neededReduction)}`),
        ...sentenceWithMath(localizedText(parameters, `Now compare this reduction with the current ${wholeLabel}.`, `अब इस कमी की तुलना वर्तमान ${wholeLabel} से कीजिए।`, `ਹੁਣ ਇਸ ਘਟਾਉ ਦੀ ਤੁਲਨਾ ਮੌਜੂਦਾ ${wholeLabel} ਨਾਲ ਕਰੋ।`), `\\frac{${formatNumber(neededReduction)}}{${formatNumber(currentValue)}}\\times100=${percent(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `So the required percentage decrease is ${formatNumber(solver.numericAnswer ?? 0)}%.`, `अतः आवश्यक प्रतिशत कमी ${formatNumber(solver.numericAnswer ?? 0)}% है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਪ੍ਰਤੀਸ਼ਤ ਘਟਾਉ ${formatNumber(solver.numericAnswer ?? 0)}% ਹੈ।`), parameters.language === "hi" ? `\\text{आवश्यक कमी}=${renderedAnswer}` : `\\text{ਲੋੜੀਂਦੀ ਘਟਾਉ}=${renderedAnswer}`),
      );
      break;
    case "percentageDecreaseBridge":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `Each decrease of ${formatNumber(decreaseRate)}% leaves ${formatNumber(remainingPercent)}% of the ${wholeLabel}.`, `${formatNumber(decreaseRate)}% की प्रत्येक कमी ${wholeLabel} का ${formatNumber(remainingPercent)}% छोड़ती है।`, `${formatNumber(decreaseRate)}% ਦੀ ਹਰ ਘਟਾਉ ${wholeLabel} ਦਾ ${formatNumber(remainingPercent)}% ਛੱਡਦੀ ਹੈ।`), `100\\%-${percent(decreaseRate)}=${percent(remainingPercent)}`),
        ...fractionShortcut(parameters, remainingPercent),
        ...sentenceWithMath(localizedText(parameters, `Since the same decrease happens for ${formatNumber(periodCount)} periods, use the retained factor ${formatNumber(periodCount)} times.`, `क्योंकि यही कमी ${formatNumber(periodCount)} अवधियों तक होती है, इसलिए शेष गुणक का ${formatNumber(periodCount)} बार उपयोग कीजिए।`, `ਕਿਉਂਕਿ ਇਹੀ ਘਟਾਉ ${formatNumber(periodCount)} अवधੀਆਂ ਲਈ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਬਚੇ ਗੁਣਕ ਨੂੰ ${formatNumber(periodCount)} ਵਾਰ ਵਰਤੋ।`), `\\left(\\frac{${formatNumber(remainingPercent)}}{100}\\right)^{${formatNumber(periodCount)}}`),
        ...sentenceWithMath(localizedText(parameters, `Now multiply the current ${wholeLabel} by this overall factor.`, `अब वर्तमान ${wholeLabel} को इस कुल गुणक से गुणा कीजिए।`, `ਹੁਣ ਮੌਜੂਦਾ ${wholeLabel} ਨੂੰ ਇਸ ਕੁੱਲ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰੋ।`), `${formatNumber(currentValue)}\\times\\left(\\frac{${formatNumber(remainingPercent)}}{100}\\right)^{${formatNumber(periodCount)}}=${formatNumber(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `So the ${wholeLabel} after ${formatNumber(periodCount)} periods is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`, `अतः ${formatNumber(periodCount)} अवधियों के बाद ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} है।`, `ਇਸ ਲਈ ${formatNumber(periodCount)} अवधੀਆਂ ਤੋਂ ਬਾਅਦ ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} ਹੈ।`), parameters.language === "hi" ? `\\text{अंतिम मान}=${renderedAnswer}` : `\\text{ਅੰਤਿਮ ਮਾਨ}=${renderedAnswer}`),
      );
      break;
  }

  return lines;
}

export function renderPct004Explanation(
  parameters: Pct004Parameters,
  solver: Pct004SolverResult,
  _graph: Pct004ReasoningGraph,
): Pct004Explanation {
  const localizedLines = renderLocalizedPct004Explanation(parameters, solver);
  if (localizedLines) {
    return {
      explanationId: parameters.explanationId,
      lines: localizedLines,
    };
  }

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
        ...fractionShortcut(parameters, remainingPercent),
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
        ...fractionShortcut(parameters, decreaseRate),
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
        ...fractionShortcut(parameters, remainingPercent),
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
        ...fractionShortcut(parameters, remainingPercent),
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
        ...fractionShortcut(parameters, remainingPercent),
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
