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

function localizedText(parameters: Pct003Parameters, en: string, hi: string, pa: string) {
  if (parameters.language === "hi") return hi;
  if (parameters.language === "pa") return pa;
  return en;
}

function renderLocalizedPct003Explanation(parameters: Pct003Parameters, solver: Pct003SolverResult): string[] | null {
  if (parameters.language === "en") return null;

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
          localizedText(
            parameters,
            `An increase of ${formatNumber(increaseRate)}% makes the ${wholeLabel} equal to ${formatNumber(100 + increaseRate)}% of its original value.`,
            `${formatNumber(increaseRate)}% की वृद्धि से ${wholeLabel}, अपने मूल मान का ${formatNumber(100 + increaseRate)}% हो जाता है।`,
            `${formatNumber(increaseRate)}% ਦੇ ਵਾਧੇ ਨਾਲ ${wholeLabel}, ਆਪਣੇ ਮੂਲ ਮਾਨ ਦਾ ${formatNumber(100 + increaseRate)}% ਬਣ ਜਾਂਦਾ ਹੈ।`,
          ),
          `100\\%+${percent(increaseRate)}=${percent(100 + increaseRate)}`,
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `So multiply the original ${wholeLabel} by ${formatNumber(100 + increaseRate)}/100.`,
            `अतः मूल ${wholeLabel} को ${formatNumber(100 + increaseRate)}/100 से गुणा कीजिए।`,
            `ਇਸ ਲਈ ਮੂਲ ${wholeLabel} ਨੂੰ ${formatNumber(100 + increaseRate)}/100 ਨਾਲ ਗੁਣਾ ਕਰੋ।`,
          ),
          `${formatNumber(originalValue)}\\times\\frac{${formatNumber(100 + increaseRate)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `Therefore the new ${wholeLabel} is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`,
            `अतः नया ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} है।`,
            `ਇਸ ਲਈ ਨਵਾਂ ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{नया मान}=${renderedAnswer}` : `\\text{ਨਵਾਂ ਮਾਨ}=${renderedAnswer}`,
        ),
      );
      break;
    case "increaseAmount":
      lines.push(
        ...sentenceWithMath(
          localizedText(
            parameters,
            `Only the increased part is required here, so we need ${formatNumber(increaseRate)}% of the original ${wholeLabel}.`,
            `यहाँ केवल बढ़ी हुई मात्रा चाहिए, इसलिए मूल ${wholeLabel} का ${formatNumber(increaseRate)}% ज्ञात करना है।`,
            `ਇੱਥੇ ਸਿਰਫ਼ ਵਧੀ ਹੋਈ ਮਾਤਰਾ ਚਾਹੀਦੀ ਹੈ, ਇਸ ਲਈ ਮੂਲ ${wholeLabel} ਦਾ ${formatNumber(increaseRate)}% ਕੱਢਣਾ ਹੈ।`,
          ),
          `${percent(increaseRate)}\\text{ of }${displayValue(parameters, originalValue)}`,
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `Now take ${formatNumber(increaseRate)}% of ${displayValue(parameters, originalValue)}.`,
            `अब ${displayValue(parameters, originalValue)} का ${formatNumber(increaseRate)}% ज्ञात कीजिए।`,
            `ਹੁਣ ${displayValue(parameters, originalValue)} ਦਾ ${formatNumber(increaseRate)}% ਕੱਢੋ।`,
          ),
          `${formatNumber(originalValue)}\\times\\frac{${formatNumber(increaseRate)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          localizedText(parameters, `Therefore the increase amount is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`, `अतः वृद्धि की मात्रा ${displayValue(parameters, solver.numericAnswer ?? 0)} है।`, `ਇਸ ਲਈ ਵਾਧੇ ਦੀ ਮਾਤਰਾ ${displayValue(parameters, solver.numericAnswer ?? 0)} ਹੈ।`),
          parameters.language === "hi" ? `\\text{वृद्धि}=${renderedAnswer}` : `\\text{ਵਾਧਾ}=${renderedAnswer}`,
        ),
      );
      break;
    case "originalValueFromIncreasedValue":
      lines.push(
        ...sentenceWithMath(
          localizedText(
            parameters,
            `After a ${formatNumber(increaseRate)}% rise, the new ${wholeLabel} represents ${formatNumber(100 + increaseRate)}% of the original.`,
            `${formatNumber(increaseRate)}% वृद्धि के बाद नया ${wholeLabel}, मूल का ${formatNumber(100 + increaseRate)}% होता है।`,
            `${formatNumber(increaseRate)}% ਵਾਧੇ ਤੋਂ ਬਾਅਦ ਨਵਾਂ ${wholeLabel}, ਮੂਲ ਦਾ ${formatNumber(100 + increaseRate)}% ਹੁੰਦਾ ਹੈ।`,
          ),
          `${percent(100 + increaseRate)}\\rightarrow${displayValue(parameters, increasedValue)}`,
        ),
        ...sentenceWithMath(
          localizedText(parameters, `So divide ${displayValue(parameters, increasedValue)} by ${formatNumber(100 + increaseRate)} to find the value of 1%.`, `1% का मान पाने के लिए ${displayValue(parameters, increasedValue)} को ${formatNumber(100 + increaseRate)} से भाग दीजिए।`, `1% ਦਾ ਮਾਨ ਲੱਭਣ ਲਈ ${displayValue(parameters, increasedValue)} ਨੂੰ ${formatNumber(100 + increaseRate)} ਨਾਲ ਭਾਗ ਦਿਓ।`),
          `1\\%=\\frac{${formatNumber(increasedValue)}}{${formatNumber(100 + increaseRate)}}=${formatNumber(onePercentValue)}`,
        ),
        ...sentenceWithMath(
          localizedText(parameters, `Now multiply the value of 1% by 100 to get the original ${wholeLabel}.`, `अब मूल ${wholeLabel} पाने के लिए 1% के मान को 100 से गुणा कीजिए।`, `ਹੁਣ ਮੂਲ ${wholeLabel} ਲੱਭਣ ਲਈ 1% ਦੇ ਮਾਨ ਨੂੰ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।`),
          `100\\%=${formatNumber(onePercentValue)}\\times100=${formatNumber(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          localizedText(parameters, `Therefore the original ${wholeLabel} was ${displayValue(parameters, solver.numericAnswer ?? 0)}.`, `अतः मूल ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} था।`, `ਇਸ ਲਈ ਮੂਲ ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} ਸੀ।`),
          parameters.language === "hi" ? `\\text{मूल मान}=${renderedAnswer}` : `\\text{ਮੂਲ ਮਾਨ}=${renderedAnswer}`,
        ),
      );
      break;
    case "equivalentMultiplier":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `A ${formatNumber(increaseRate)}% increase means the new value becomes ${formatNumber(100 + increaseRate)}% of the old value.`, `${formatNumber(increaseRate)}% वृद्धि का अर्थ है कि नया मान पुराने मान का ${formatNumber(100 + increaseRate)}% हो जाता है।`, `${formatNumber(increaseRate)}% ਵਾਧੇ ਦਾ ਅਰਥ ਹੈ ਕਿ ਨਵਾਂ ਮਾਨ ਪੁਰਾਣੇ ਮਾਨ ਦਾ ${formatNumber(100 + increaseRate)}% ਬਣ ਜਾਂਦਾ ਹੈ।`), `100\\%+${percent(increaseRate)}=${percent(100 + increaseRate)}`),
        ...sentenceWithMath(localizedText(parameters, "Express that new percentage as a multiplier by dividing by 100.", "अब इस नए प्रतिशत को 100 से भाग देकर गुणक के रूप में लिखिए।", "ਹੁਣ ਇਸ ਨਵੇਂ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ 100 ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਗੁਣਕ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।"), `\\frac{${formatNumber(100 + increaseRate)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `Therefore the equivalent multiplier is ${formatNumber(solver.numericAnswer ?? 0)}.`, `अतः समतुल्य गुणक ${formatNumber(solver.numericAnswer ?? 0)} है।`, `ਇਸ ਲਈ ਸਮਤੁਲ ਗੁਣਕ ${formatNumber(solver.numericAnswer ?? 0)} ਹੈ।`), parameters.language === "hi" ? `\\text{गुणक}=${renderedAnswer}` : `\\text{ਗੁਣਕ}=${renderedAnswer}`),
      );
      break;
    case "repeatedPercentageIncrease":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `After the first increase of ${formatNumber(rate1)}%, the ${wholeLabel} becomes ${formatNumber(100 + rate1)}% of its original value.`, `पहली ${formatNumber(rate1)}% वृद्धि के बाद ${wholeLabel}, अपने मूल मान का ${formatNumber(100 + rate1)}% हो जाता है।`, `ਪਹਿਲੇ ${formatNumber(rate1)}% ਵਾਧੇ ਤੋਂ ਬਾਅਦ ${wholeLabel}, ਆਪਣੇ ਮੂਲ ਮਾਨ ਦਾ ${formatNumber(100 + rate1)}% ਬਣ ਜਾਂਦਾ ਹੈ।`), `${formatNumber(originalValue)}\\times\\frac{${formatNumber(100 + rate1)}}{100}=${formatNumber(afterFirstValue)}`),
        ...sentenceWithMath(localizedText(parameters, `Now apply the second increase of ${formatNumber(rate2)}% to this new value.`, `अब इस नए मान पर दूसरी ${formatNumber(rate2)}% वृद्धि लागू कीजिए।`, `ਹੁਣ ਇਸ ਨਵੇਂ ਮਾਨ ਉੱਤੇ ਦੂਜਾ ${formatNumber(rate2)}% ਵਾਧਾ ਲਾਗੂ ਕਰੋ।`), `${formatNumber(afterFirstValue)}\\times\\frac{${formatNumber(100 + rate2)}}{100}=${formatNumber(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `Therefore the ${wholeLabel} after both increases is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`, `अतः दोनों वृद्धियों के बाद ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} है।`, `ਇਸ ਲਈ ਦੋਵੇਂ ਵਾਧਿਆਂ ਤੋਂ ਬਾਅਦ ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} ਹੈ।`), parameters.language === "hi" ? `\\text{अंतिम मान}=${renderedAnswer}` : `\\text{ਅੰਤਿਮ ਮਾਨ}=${renderedAnswer}`),
      );
      break;
    case "netIncreasePercentage":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, "Convert the two increases into growth factors.", "दोनों वृद्धियों को वृद्धि-गुणकों में बदलिए।", "ਦੋਵੇਂ ਵਾਧਿਆਂ ਨੂੰ ਵਾਧਾ-ਗੁਣਕਾਂ ਵਿੱਚ ਬਦਲੋ।"), `\\frac{${formatNumber(100 + rate1)}}{100}\\times\\frac{${formatNumber(100 + rate2)}}{100}`),
        ...sentenceWithMath(localizedText(parameters, "This combined factor tells us how many times the original value becomes after both increases.", "यह संयुक्त गुणक बताता है कि दोनों वृद्धियों के बाद मूल मान कितनी गुना हो जाता है।", "ਇਹ ਸੰਯੁਕਤ ਗੁਣਕ ਦੱਸਦਾ ਹੈ ਕਿ ਦੋਵੇਂ ਵਾਧਿਆਂ ਤੋਂ ਬਾਅਦ ਮੂਲ ਮਾਨ ਕਿੰਨੀ ਗੁਣਾ ਬਣਦਾ ਹੈ।"), `\\frac{${formatNumber(100 + rate1)}}{100}\\times\\frac{${formatNumber(100 + rate2)}}{100}=${formatNumber(1 + netPercent / 100)}`),
        ...sentenceWithMath(localizedText(parameters, "So subtract 1 from the combined factor and convert the result into a percentage increase.", "अब संयुक्त गुणक में से 1 घटाकर उसे प्रतिशत वृद्धि में बदलिए।", "ਹੁਣ ਸੰਯੁਕਤ ਗੁਣਕ ਵਿੱਚੋਂ 1 ਘਟਾ ਕੇ ਉਸ ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧੇ ਵਿੱਚ ਬਦਲੋ।"), `${percent(netPercent)}`),
        ...sentenceWithMath(localizedText(parameters, `Therefore the overall percentage increase is ${formatNumber(netPercent)}%.`, `अतः कुल प्रतिशत वृद्धि ${formatNumber(netPercent)}% है।`, `ਇਸ ਲਈ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ${formatNumber(netPercent)}% ਹੈ।`), parameters.language === "hi" ? `\\text{कुल वृद्धि}=${renderedAnswer}` : `\\text{ਕੁੱਲ ਵਾਧਾ}=${renderedAnswer}`),
      );
      break;
    case "comparativeIncrease":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `First find the new value of ${labelA} after its increase.`, `पहले ${labelA} का नया मान वृद्धि के बाद ज्ञात कीजिए।`, `ਪਹਿਲਾਂ ${labelA} ਦਾ ਨਵਾਂ ਮਾਨ ਵਾਧੇ ਤੋਂ ਬਾਅਦ ਕੱਢੋ।`), `${formatNumber(originalA)}\\times\\frac{${formatNumber(100 + rateA)}}{100}=${formatNumber(newA)}`),
        ...sentenceWithMath(localizedText(parameters, `Now find the new value of ${labelB} after its increase.`, `अब ${labelB} का नया मान वृद्धि के बाद ज्ञात कीजिए।`, `ਹੁਣ ${labelB} ਦਾ ਨਵਾਂ ਮਾਨ ਵਾਧੇ ਤੋਂ ਬਾਅਦ ਕੱਢੋ।`), `${formatNumber(originalB)}\\times\\frac{${formatNumber(100 + rateB)}}{100}=${formatNumber(newB)}`),
        ...sentenceWithMath(localizedText(parameters, "Finally compare these two new values.", "अंत में इन दोनों नए मानों की तुलना कीजिए।", "ਅੰਤ ਵਿੱਚ ਇਨ੍ਹਾਂ ਦੋਵੇਂ ਨਵੇਂ ਮਾਨਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।"), `\\left|${formatNumber(newA)}-${formatNumber(newB)}\\right|=${formatNumber(difference)}`),
        ...sentenceWithMath(localizedText(parameters, `Therefore the difference between the new values is ${displayValue(parameters, difference)}.`, `अतः नए मानों के बीच का अंतर ${displayValue(parameters, difference)} है।`, `ਇਸ ਲਈ ਨਵੇਂ ਮਾਨਾਂ ਵਿਚਲਾ ਅੰਤਰ ${displayValue(parameters, difference)} ਹੈ।`), parameters.language === "hi" ? `\\text{अंतर}=${renderedAnswer}` : `\\text{ਅੰਤਰ}=${renderedAnswer}`),
      );
      break;
    case "percentageIncreaseInParts":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `At first, ${formatNumber(partRate)}% of the ${wholeLabel} are ${partLabel}, so split the original total into ${partLabel} and ${otherLabel}.`, `शुरू में ${wholeLabel} का ${formatNumber(partRate)}% ${partLabel} है, इसलिए कुल को ${partLabel} और ${otherLabel} में बाँटिए।`, `ਸ਼ੁਰੂ ਵਿੱਚ ${wholeLabel} ਦਾ ${formatNumber(partRate)}% ${partLabel} ਹੈ, ਇਸ ਲਈ ਕੁੱਲ ਨੂੰ ${partLabel} ਅਤੇ ${otherLabel} ਵਿੱਚ ਵੰਡੋ।`), `${formatNumber(totalValue)}\\times\\frac{${formatNumber(partRate)}}{100}=${formatNumber(initialPartValue)},\\ ${formatNumber(initialOtherValue)}`),
        ...sentenceWithMath(localizedText(parameters, `Now increase the number of ${partLabel} and ${otherLabel} by their respective percentages.`, `अब ${partLabel} और ${otherLabel} की संख्याओं में उनके-उनके प्रतिशत से वृद्धि कीजिए।`, `ਹੁਣ ${partLabel} ਅਤੇ ${otherLabel} ਦੀਆਂ ਗਿਣਤੀਆਂ ਵਿੱਚ ਆਪਣੇ-ਆਪਣੇ ਪ੍ਰਤੀਸ਼ਤ ਅਨੁਸਾਰ ਵਾਧਾ ਕਰੋ।`), `${formatNumber(initialPartValue)}\\times\\frac{${formatNumber(100 + partIncreaseRate)}}{100}=${formatNumber(newPartValue)},\\ ${formatNumber(initialOtherValue)}\\times\\frac{${formatNumber(100 + otherIncreaseRate)}}{100}=${formatNumber(newOtherValue)}`),
        ...sentenceWithMath(localizedText(parameters, `Use the new total to find the updated percentage of ${partLabel}.`, `अब ${partLabel} का नया प्रतिशत ज्ञात करने के लिए नए कुल का उपयोग कीजिए।`, `ਹੁਣ ${partLabel} ਦਾ ਨਵਾਂ ਪ੍ਰਤੀਸ਼ਤ ਲੱਭਣ ਲਈ ਨਵੇਂ ਕੁੱਲ ਦੀ ਵਰਤੋਂ ਕਰੋ।`), `\\frac{${formatNumber(newPartValue)}}{${formatNumber(newTotalValue)}}\\times100=${percent(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `Therefore the new percentage of ${partLabel} is ${formatNumber(solver.numericAnswer ?? 0)}%.`, `अतः ${partLabel} का नया प्रतिशत ${formatNumber(solver.numericAnswer ?? 0)}% है।`, `ਇਸ ਲਈ ${partLabel} ਦਾ ਨਵਾਂ ਪ੍ਰਤੀਸ਼ਤ ${formatNumber(solver.numericAnswer ?? 0)}% ਹੈ।`), parameters.language === "hi" ? `\\text{नया प्रतिशत}=${renderedAnswer}` : `\\text{ਨਵਾਂ ਪ੍ਰਤੀਸ਼ਤ}=${renderedAnswer}`),
      );
      break;
    case "requiredIncrease":
      if (currentValue === targetValue) {
        lines.push(
          ...sentenceWithMath(localizedText(parameters, `The current ${wholeLabel} is already equal to the target ${wholeLabel}.`, `वर्तमान ${wholeLabel} पहले से ही लक्ष्य ${wholeLabel} के बराबर है।`, `ਮੌਜੂਦਾ ${wholeLabel} ਪਹਿਲਾਂ ਹੀ ਨਿਸ਼ਾਨੇ ਵਾਲੇ ${wholeLabel} ਦੇ ਬਰਾਬਰ ਹੈ।`), `${displayValue(parameters, currentValue)}=${displayValue(parameters, targetValue)}`),
          ...sentenceWithMath(localizedText(parameters, "So no increase is required.", "अतः किसी वृद्धि की आवश्यकता नहीं है।", "ਇਸ ਲਈ ਕਿਸੇ ਵਾਧੇ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।"), `0\\%`),
          ...sentenceWithMath(localizedText(parameters, "Therefore the required percentage increase is 0%.", "अतः आवश्यक प्रतिशत वृद्धि 0% है।", "ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ 0% ਹੈ।"), parameters.language === "hi" ? `\\text{आवश्यक वृद्धि}=0\\%` : `\\text{ਲੋੜੀਂਦਾ ਵਾਧਾ}=0\\%`),
        );
      } else {
        lines.push(
          ...sentenceWithMath(localizedText(parameters, `First find how much extra ${wholeLabel} is needed to reach the target.`, `पहले लक्ष्य तक पहुँचने के लिए आवश्यक अतिरिक्त ${wholeLabel} ज्ञात कीजिए।`, `ਪਹਿਲਾਂ ਨਿਸ਼ਾਨੇ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਲੋੜੀਂਦੀ ਵਾਧੂ ${wholeLabel} ਕੱਢੋ।`), `${formatNumber(targetValue)}-${formatNumber(currentValue)}=${formatNumber(neededAmount)}`),
          ...sentenceWithMath(localizedText(parameters, `Now compare this extra amount with the current ${wholeLabel}.`, `अब इस अतिरिक्त मात्रा की तुलना वर्तमान ${wholeLabel} से कीजिए।`, `ਹੁਣ ਇਸ ਵਾਧੂ ਮਾਤਰਾ ਦੀ ਤੁਲਨਾ ਮੌਜੂਦਾ ${wholeLabel} ਨਾਲ ਕਰੋ।`), `\\frac{${formatNumber(neededAmount)}}{${formatNumber(currentValue)}}\\times100=${percent(solver.numericAnswer ?? 0)}`),
          ...sentenceWithMath(localizedText(parameters, `Therefore the required percentage increase is ${formatNumber(solver.numericAnswer ?? 0)}%.`, `अतः आवश्यक प्रतिशत वृद्धि ${formatNumber(solver.numericAnswer ?? 0)}% है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ${formatNumber(solver.numericAnswer ?? 0)}% ਹੈ।`), parameters.language === "hi" ? `\\text{आवश्यक वृद्धि}=${renderedAnswer}` : `\\text{ਲੋੜੀਂਦਾ ਵਾਧਾ}=${renderedAnswer}`),
        );
      }
      break;
    case "growthBridge":
      lines.push(
        ...sentenceWithMath(localizedText(parameters, `Each increase of ${formatNumber(growthRate)}% multiplies the ${wholeLabel} by ${formatNumber(100 + growthRate)}/100.`, `${formatNumber(growthRate)}% की प्रत्येक वृद्धि ${wholeLabel} को ${formatNumber(100 + growthRate)}/100 से गुणा करती है।`, `${formatNumber(growthRate)}% ਦਾ ਹਰ ਵਾਧਾ ${wholeLabel} ਨੂੰ ${formatNumber(100 + growthRate)}/100 ਨਾਲ ਗੁਣਾ ਕਰਦਾ ਹੈ।`), `\\frac{${formatNumber(100 + growthRate)}}{100}`),
        ...sentenceWithMath(localizedText(parameters, `Since the same increase happens for ${formatNumber(periodCount)} periods, use this factor ${formatNumber(periodCount)} times.`, `क्योंकि यही वृद्धि ${formatNumber(periodCount)} अवधियों तक होती है, इसलिए इस गुणक का ${formatNumber(periodCount)} बार उपयोग कीजिए।`, `ਕਿਉਂਕਿ ਇਹੀ ਵਾਧਾ ${formatNumber(periodCount)} अवधੀਆਂ ਲਈ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਇਸ ਗੁਣਕ ਨੂੰ ${formatNumber(periodCount)} ਵਾਰ ਵਰਤੋ।`), `\\left(\\frac{${formatNumber(100 + growthRate)}}{100}\\right)^{${formatNumber(periodCount)}}`),
        ...sentenceWithMath(localizedText(parameters, `Now multiply the current ${wholeLabel} by the overall factor.`, `अब वर्तमान ${wholeLabel} को कुल गुणक से गुणा कीजिए।`, `ਹੁਣ ਮੌਜੂਦਾ ${wholeLabel} ਨੂੰ ਕੁੱਲ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰੋ।`), `${formatNumber(currentValue)}\\times\\left(\\frac{${formatNumber(100 + growthRate)}}{100}\\right)^{${formatNumber(periodCount)}}=${formatNumber(solver.numericAnswer ?? 0)}`),
        ...sentenceWithMath(localizedText(parameters, `Therefore the ${wholeLabel} after ${formatNumber(periodCount)} periods is ${displayValue(parameters, solver.numericAnswer ?? 0)}.`, `अतः ${formatNumber(periodCount)} अवधियों के बाद ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} है।`, `ਇਸ ਲਈ ${formatNumber(periodCount)} अवधੀਆਂ ਤੋਂ ਬਾਅਦ ${wholeLabel} ${displayValue(parameters, solver.numericAnswer ?? 0)} ਹੈ।`), parameters.language === "hi" ? `\\text{अंतिम मान}=${renderedAnswer}` : `\\text{ਅੰਤਿਮ ਮਾਨ}=${renderedAnswer}`),
      );
      break;
  }

  return lines;
}

export function renderPct003Explanation(
  parameters: Pct003Parameters,
  solver: Pct003SolverResult,
  graph: Pct003ReasoningGraph,
): Pct003Explanation {
  const localizedLines = renderLocalizedPct003Explanation(parameters, solver);
  if (localizedLines) {
    return {
      explanationId: parameters.explanationId,
      lines: localizedLines,
    };
  }

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
