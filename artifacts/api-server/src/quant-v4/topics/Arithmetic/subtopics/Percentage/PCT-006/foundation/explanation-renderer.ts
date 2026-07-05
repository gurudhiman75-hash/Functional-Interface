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

function localizedText(parameters: Pct006Parameters, en: string, hi: string, pa: string) {
  if (parameters.language === "hi") return hi;
  if (parameters.language === "pa") return pa;
  return en;
}

function renderLocalizedPct006Explanation(
  parameters: Pct006Parameters,
  solver: Pct006SolverResult,
): string[] | null {
  if (parameters.language === "en") return null;

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
          localizedText(
            parameters,
            `${formatNumber(rate)}% more means the new ${wholeLabel} is ${formatNumber(100 + rate)}% of the base ${wholeLabel}.`,
            `${formatNumber(rate)}% अधिक का अर्थ है कि नया ${wholeLabel}, आधार ${wholeLabel} का ${formatNumber(100 + rate)}% है।`,
            `${formatNumber(rate)}% ਵੱਧ ਦਾ ਅਰਥ ਹੈ ਕਿ ਨਵਾਂ ${wholeLabel}, ਆਧਾਰ ${wholeLabel} ਦਾ ${formatNumber(100 + rate)}% ਹੈ।`,
          ),
          `${formatNumber(100 + rate)}\\%=\\frac{${formatNumber(100 + rate)}}{100}`,
        ),
      );
      if (parameters.solveMode === "moreFindBase") {
        lines.push(
          ...sentenceWithMath(
            localizedText(
              parameters,
              `The given figure is the higher ${wholeLabel}, so divide it by the multiplier to recover the base.`,
              `दिया गया मान बड़ा ${wholeLabel} है, इसलिए आधार मान प्राप्त करने के लिए इसे गुणक से भाग दें।`,
              `ਦਿੱਤਾ ਗਿਆ ਮਾਨ ਵੱਡਾ ${wholeLabel} ਹੈ, ਇਸ ਲਈ ਆਧਾਰ ਮਾਨ ਲੱਭਣ ਲਈ ਇਸ ਨੂੰ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦਿਓ।`,
            ),
            `${formatNumber(given)}\\div${formatNumber(multiplier)}=${formatNumber(base)}`,
          ),
        );
      } else {
        lines.push(
          ...sentenceWithMath(
            localizedText(
              parameters,
              `Multiply the base ${wholeLabel} by the comparison multiplier.`,
              `आधार ${wholeLabel} को तुलना गुणक से गुणा कीजिए।`,
              `ਆਧਾਰ ${wholeLabel} ਨੂੰ ਤੁਲਨਾ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰੋ।`,
            ),
            `${formatNumber(base)}\\times${formatNumber(multiplier)}=${formatNumber(greater)}`,
          ),
        );
      }
      lines.push(
        ...sentenceWithMath(
          localizedText(
            parameters,
            `So the required answer is ${renderedAnswer}.`,
            `अतः आवश्यक उत्तर ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਜਵਾਬ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{उत्तर}=${renderedAnswer}` : `\\text{ਜਵਾਬ}=${renderedAnswer}`,
        ),
      );
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
          localizedText(
            parameters,
            `${formatNumber(rate)}% less means the reduced ${wholeLabel} is ${formatNumber(100 - rate)}% of the higher value.`,
            `${formatNumber(rate)}% कम का अर्थ है कि घटा हुआ ${wholeLabel}, बड़े मान का ${formatNumber(100 - rate)}% है।`,
            `${formatNumber(rate)}% ਘੱਟ ਦਾ ਅਰਥ ਹੈ ਕਿ ਘਟਿਆ ਹੋਇਆ ${wholeLabel}, ਵੱਡੇ ਮਾਨ ਦਾ ${formatNumber(100 - rate)}% ਹੈ।`,
          ),
          `${formatNumber(100 - rate)}\\%=\\frac{${formatNumber(100 - rate)}}{100}`,
        ),
      );
      if (parameters.solveMode === "lessFindBase") {
        lines.push(
          ...sentenceWithMath(
            localizedText(
              parameters,
              `The given figure is the lower ${wholeLabel}, so divide it by the multiplier to recover the higher value.`,
              `दिया गया मान छोटा ${wholeLabel} है, इसलिए बड़ा मान प्राप्त करने के लिए इसे गुणक से भाग दें।`,
              `ਦਿੱਤਾ ਗਿਆ ਮਾਨ ਛੋਟਾ ${wholeLabel} ਹੈ, ਇਸ ਲਈ ਵੱਡਾ ਮਾਨ ਲੱਭਣ ਲਈ ਇਸ ਨੂੰ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦਿਓ।`,
            ),
            `${formatNumber(given)}\\div${formatNumber(multiplier)}=${formatNumber(higher)}`,
          ),
        );
      } else {
        lines.push(
          ...sentenceWithMath(
            localizedText(
              parameters,
              `Multiply the higher ${wholeLabel} by the reduction multiplier.`,
              `बड़े ${wholeLabel} को कमी वाले गुणक से गुणा कीजिए।`,
              `ਵੱਡੇ ${wholeLabel} ਨੂੰ ਘਟਾਓ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰੋ।`,
            ),
            `${formatNumber(higher)}\\times${formatNumber(multiplier)}=${formatNumber(lower)}`,
          ),
        );
      }
      lines.push(
        ...sentenceWithMath(
          localizedText(
            parameters,
            `So the required answer is ${renderedAnswer}.`,
            `अतः आवश्यक उत्तर ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਜਵਾਬ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{उत्तर}=${renderedAnswer}` : `\\text{ਜਵਾਬ}=${renderedAnswer}`,
        ),
      );
      break;
    }
    case "reverseBaseSwitchingComparison":
      lines.push(
        ...sentenceWithMath(
          localizedText(
            parameters,
            `Reverse comparison needs a new base, so we divide the original percentage gap by the new base percentage.`,
            `उलटी तुलना के लिए नया आधार चाहिए, इसलिए मूल प्रतिशत अंतर को नए आधार प्रतिशत से भाग देते हैं।`,
            `ਉਲਟੀ ਤੁਲਨਾ ਲਈ ਨਵਾਂ ਆਧਾਰ ਲੈਣਾ ਪੈਂਦਾ ਹੈ, ਇਸ ਲਈ ਮੂਲ ਪ੍ਰਤੀਸ਼ਤ ਅੰਤਰ ਨੂੰ ਨਵੇਂ ਆਧਾਰ ਪ੍ਰਤੀਸ਼ਤ ਨਾਲ ਭਾਗ ਦਿੰਦੇ ਹਾਂ।`,
          ),
          String(solver.mathJax["core"] ?? ""),
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `That gives the reverse comparison directly.`,
            `इससे उलटी तुलना सीधे मिल जाती है।`,
            `ਇਸ ਨਾਲ ਉਲਟੀ ਤੁਲਨਾ ਸਿੱਧੀ ਮਿਲ ਜਾਂਦੀ ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{उलटी तुलना}=${renderedAnswer}` : `\\text{ਉਲਟੀ ਤੁਲਨਾ}=${renderedAnswer}`,
        ),
      );
      break;
    case "differenceAsPercentageOfSelectedBase":
      lines.push(
        ...sentenceWithMath(
          localizedText(
            parameters,
            `First take the absolute difference between the two values.`,
            `पहले दोनों मानों का निरपेक्ष अंतर ज्ञात कीजिए।`,
            `ਪਹਿਲਾਂ ਦੋਵੇਂ ਮਾਨਾਂ ਦਾ ਪਰਮ ਅੰਤਰ ਕੱਢੋ।`,
          ),
          `${formatNumber(Number(solver.evidence["difference"] ?? 0))}`,
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `Now divide by the stated base and multiply by 100.`,
            `अब दिए गए आधार से भाग देकर 100 से गुणा कीजिए।`,
            `ਹੁਣ ਦਿੱਤੇ ਆਧਾਰ ਨਾਲ ਭਾਗ ਦੇ ਕੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।`,
          ),
          String(solver.mathJax["core"] ?? ""),
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `So the required percentage is ${renderedAnswer}.`,
            `अतः आवश्यक प्रतिशत ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{प्रतिशत}=${renderedAnswer}` : `\\text{ਪ੍ਰਤੀਸ਼ਤ}=${renderedAnswer}`,
        ),
      );
      break;
    case "ratioBasedPercentageComparison":
      lines.push(
        ...sentenceWithMath(
          localizedText(
            parameters,
            `Use the ratio difference and divide by the selected base part of the ratio.`,
            `अनुपात के अंतर को चुने गए आधार भाग से भाग दीजिए।`,
            `ਅਨੁਪਾਤ ਦੇ ਅੰਤਰ ਨੂੰ ਚੁਣੇ ਹੋਏ ਆਧਾਰ ਹਿੱਸੇ ਨਾਲ ਭਾਗ ਦਿਓ।`,
          ),
          String(solver.mathJax["core"] ?? ""),
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `So the comparison percentage is ${renderedAnswer}.`,
            `अतः तुलना प्रतिशत ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਤੁਲਨਾ ਪ੍ਰਤੀਸ਼ਤ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{तुलना प्रतिशत}=${renderedAnswer}` : `\\text{ਤੁਲਨਾ ਪ੍ਰਤੀਸ਼ਤ}=${renderedAnswer}`,
        ),
      );
      break;
    case "requiredPercentageChangeToMatchTarget":
      lines.push(
        ...sentenceWithMath(
          localizedText(
            parameters,
            `Required change is always measured on the value that must be revised.`,
            `आवश्यक परिवर्तन हमेशा उसी मान पर निकाला जाता है जिसे बदलना है।`,
            `ਲੋੜੀਂਦਾ ਬਦਲਾਅ ਹਮੇਸ਼ਾਂ ਉਸੇ ਮਾਨ ਤੇ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ ਜਿਸ ਨੂੰ ਬਦਲਣਾ ਹੈ।`,
          ),
          `${formatNumber(asNumber(parameters, "value1"))}`,
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `Take the gap from target and divide by the present value.`,
            `लक्ष्य तक का अंतर लेकर वर्तमान मान से भाग दीजिए।`,
            `ਨਿਸ਼ਾਨੇ ਤੱਕ ਦਾ ਅੰਤਰ ਲੈ ਕੇ ਮੌਜੂਦਾ ਮਾਨ ਨਾਲ ਭਾਗ ਦਿਓ।`,
          ),
          String(solver.mathJax["core"] ?? ""),
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `So the required percentage change is ${renderedAnswer}.`,
            `अतः आवश्यक प्रतिशत परिवर्तन ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{प्रतिशत परिवर्तन}=${renderedAnswer}` : `\\text{ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ}=${renderedAnswer}`,
        ),
      );
      break;
    case "compareAfterDifferentPercentageChanges":
      lines.push(
        ...sentenceWithMath(
          localizedText(
            parameters,
            `Apply the stated percentage change to each value separately.`,
            `दिए गए प्रतिशत परिवर्तन को दोनों मानों पर अलग-अलग लागू कीजिए।`,
            `ਦਿੱਤਾ ਗਿਆ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਦੋਵੇਂ ਮਾਨਾਂ ਤੇ ਵੱਖ-ਵੱਖ ਲਾਗੂ ਕਰੋ।`,
          ),
          `${formatNumber(Number(solver.evidence["final1"] ?? 0))},\\;${formatNumber(Number(solver.evidence["final2"] ?? 0))}`,
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `Now compare the two final values.`,
            `अब दोनों अंतिम मानों की तुलना कीजिए।`,
            `ਹੁਣ ਦੋਵੇਂ ਅੰਤਿਮ ਮਾਨਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।`,
          ),
          `${formatNumber(Number(solver.evidence["difference"] ?? 0))}`,
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `So the required comparison is ${renderedAnswer}.`,
            `अतः आवश्यक तुलना ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਤੁਲਨਾ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{तुलना}=${renderedAnswer}` : `\\text{ਤੁਲਨਾ}=${renderedAnswer}`,
        ),
      );
      break;
    case "chainPercentageComparison":
      lines.push(
        ...sentenceWithMath(
          localizedText(
            parameters,
            `Convert both comparison statements into multipliers and combine them.`,
            `दोनों तुलना कथनों को गुणकों में बदलकर उन्हें मिलाइए।`,
            `ਦੋਵੇਂ ਤੁਲਨਾ ਵਾਲੇ ਵਾਕਾਂ ਨੂੰ ਗੁਣਕਾਂ ਵਿੱਚ ਬਦਲ ਕੇ ਇਕੱਠੇ ਕਰੋ।`,
          ),
          String(solver.mathJax["core"] ?? ""),
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `The combined multiplier tells us how ${asString(parameters, "subjectA", "A")} compares with ${asString(parameters, "subjectC", "C")}.`,
            `संयुक्त गुणक बताता है कि ${asString(parameters, "subjectA", "A")} की तुलना ${asString(parameters, "subjectC", "C")} से कैसी है।`,
            `ਸੰਯੁਕਤ ਗੁਣਕ ਦੱਸਦਾ ਹੈ ਕਿ ${asString(parameters, "subjectA", "A")} ਦੀ ${asString(parameters, "subjectC", "C")} ਨਾਲ ਤੁਲਨਾ ਕਿਵੇਂ ਹੈ।`,
          ),
          `${formatNumber(Number(solver.evidence["factorAC"] ?? 0))}`,
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `So the final relation is ${renderedAnswer}.`,
            `अतः अंतिम संबंध ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਅੰਤਿਮ ਸੰਬੰਧ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{अंतिम संबंध}=${renderedAnswer}` : `\\text{ਅੰਤਿਮ ਸੰਬੰਧ}=${renderedAnswer}`,
        ),
      );
      break;
    case "percentagePointsVsPercentageChange":
      lines.push(
        ...sentenceWithMath(
          localizedText(
            parameters,
            `Percentage-point change is the simple difference between the two rates.`,
            `प्रतिशत-बिंदु परिवर्तन दोनों दरों का साधारण अंतर होता है।`,
            `ਪ੍ਰਤੀਸ਼ਤ-ਬਿੰਦੂ ਬਦਲਾਅ ਦੋਵੇਂ ਦਰਾਂ ਦਾ ਸਧਾਰਣ ਅੰਤਰ ਹੁੰਦਾ ਹੈ।`,
          ),
          `${formatNumber(Number(solver.evidence["pointDifference"] ?? 0))}`,
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `Relative change compares that difference with the old rate.`,
            `सापेक्ष परिवर्तन उस अंतर की तुलना पुरानी दर से करता है।`,
            `ਸਾਪੇਖ ਬਦਲਾਅ ਉਸ ਅੰਤਰ ਦੀ ਪੁਰਾਣੀ ਦਰ ਨਾਲ ਤੁਲਨਾ ਕਰਦਾ ਹੈ।`,
          ),
          String(solver.mathJax["core"] ?? ""),
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `So the required result is ${renderedAnswer}.`,
            `अतः आवश्यक परिणाम ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਨਤੀਜਾ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{परिणाम}=${renderedAnswer}` : `\\text{ਨਤੀਜਾ}=${renderedAnswer}`,
        ),
      );
      break;
    case "crossBasePercentageComparison":
      lines.push(
        ...sentenceWithMath(
          localizedText(
            parameters,
            `When the totals are different, convert each percentage into its actual value first.`,
            `जब कुल अलग-अलग हों, तो पहले प्रत्येक प्रतिशत को उसके वास्तविक मान में बदलें।`,
            `ਜਦੋਂ ਕੁੱਲ ਵੱਖਰੇ ਹੋਣ, ਤਾਂ ਪਹਿਲਾਂ ਹਰ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਉਸਦੇ ਅਸਲ ਮਾਨ ਵਿੱਚ ਬਦਲੋ।`,
          ),
          `${formatNumber(Number(solver.evidence["actual1"] ?? 0))},\\;${formatNumber(Number(solver.evidence["actual2"] ?? 0))}`,
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `Now compare the actual values, not the percentages alone.`,
            `अब केवल प्रतिशत नहीं, बल्कि वास्तविक मानों की तुलना कीजिए।`,
            `ਹੁਣ ਕੇਵਲ ਪ੍ਰਤੀਸ਼ਤ ਨਹੀਂ, ਸਗੋਂ ਅਸਲ ਮਾਨਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।`,
          ),
          `${formatNumber(Number(solver.evidence["difference"] ?? 0))}`,
        ),
        ...sentenceWithMath(
          localizedText(
            parameters,
            `So the required answer is ${renderedAnswer}.`,
            `अतः आवश्यक उत्तर ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਜਵਾਬ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{उत्तर}=${renderedAnswer}` : `\\text{ਜਵਾਬ}=${renderedAnswer}`,
        ),
      );
      break;
  }

  return lines;
}

export function renderPct006Explanation(
  parameters: Pct006Parameters,
  solver: Pct006SolverResult,
  _graph: Pct006ReasoningGraph,
): Pct006Explanation {
  const localizedLines = renderLocalizedPct006Explanation(parameters, solver);
  if (localizedLines) {
    return {
      explanationId: parameters.explanationId,
      lines: localizedLines,
    };
  }

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
