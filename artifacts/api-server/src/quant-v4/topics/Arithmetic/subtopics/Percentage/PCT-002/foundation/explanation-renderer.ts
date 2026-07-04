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

function renderLocalizedPercentageFromPartAndWholeExplanation(
  parameters: Pct002Parameters,
  solver: Pct002SolverResult,
  wholeValue: number,
  partValue: number,
  onePercentValue: number,
  wholeLabel: string,
  partLabel: string,
  renderedAnswer: string,
) {
  if (parameters.language === "hi") {
    return [
      ...sentenceWithMath(
        `कुल ${wholeLabel} 100% के बराबर है।`,
        `100\\%\\rightarrow${displayValue(parameters, wholeValue)}`,
      ),
      ...sentenceWithMath(
        `इसलिए 1% का मान ज्ञात करने के लिए ${displayValue(parameters, wholeValue)} को 100 से भाग दें।`,
        `1\\%=\\frac{${formatNumber(wholeValue)}}{100}=${formatNumber(onePercentValue)}`,
      ),
      ...sentenceWithMath(
        `अब ${displayValue(parameters, partValue)} की तुलना 1% के मान से करके आवश्यक प्रतिशत ज्ञात करें।`,
        `\\text{आवश्यक प्रतिशत}=\\frac{${formatNumber(partValue)}}{${formatNumber(onePercentValue)}}=${percent(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `अतः ${partLabel}, ${wholeLabel} का ${formatNumber(solver.numericAnswer ?? 0)}% है।`,
        `\\text{${partLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  if (parameters.language === "pa") {
    return [
      ...sentenceWithMath(
        `ਕੁੱਲ ${wholeLabel} 100% ਦੇ ਬਰਾਬਰ ਹੈ।`,
        `100\\%\\rightarrow${displayValue(parameters, wholeValue)}`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ 1% ਦਾ ਮਾਨ ਕੱਢਣ ਲਈ ${displayValue(parameters, wholeValue)} ਨੂੰ 100 ਨਾਲ ਭਾਗ ਦਿਓ।`,
        `1\\%=\\frac{${formatNumber(wholeValue)}}{100}=${formatNumber(onePercentValue)}`,
      ),
      ...sentenceWithMath(
        `ਹੁਣ ${displayValue(parameters, partValue)} ਦੀ ਤੁਲਨਾ 1% ਦੇ ਮਾਨ ਨਾਲ ਕਰਕੇ ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
        `\\text{ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ}=\\frac{${formatNumber(partValue)}}{${formatNumber(onePercentValue)}}=${percent(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ ${partLabel}, ${wholeLabel} ਦਾ ${formatNumber(solver.numericAnswer ?? 0)}% ਹੈ।`,
        `\\text{${partLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  return null;
}

function renderLocalizedReversePercentageMappingExplanation(
  parameters: Pct002Parameters,
  solver: Pct002SolverResult,
  knownRate: number,
  knownValue: number,
  targetValue: number,
  onePercentValue: number,
  wholeLabel: string,
  renderedAnswer: string,
) {
  if (parameters.language === "hi") {
    return [
      ...sentenceWithMath(
        `यहाँ ${wholeLabel} का ${formatNumber(knownRate)}% ${displayValue(parameters, knownValue)} है।`,
        `${percent(knownRate)}\\rightarrow${displayValue(parameters, knownValue)}`,
      ),
      ...sentenceWithMath(
        `1% का मान ज्ञात करने के लिए ${displayValue(parameters, knownValue)} को ${formatNumber(knownRate)} से भाग दें।`,
        `1\\%=\\frac{${formatNumber(knownValue)}}{${formatNumber(knownRate)}}=${formatNumber(onePercentValue)}`,
      ),
      ...sentenceWithMath(
        `अब ${displayValue(parameters, targetValue)} की तुलना 1% के मान से करके आवश्यक प्रतिशत ज्ञात करें।`,
        `\\text{आवश्यक प्रतिशत}=\\frac{${formatNumber(targetValue)}}{${formatNumber(onePercentValue)}}=${percent(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `अतः ${displayValue(parameters, targetValue)}, ${wholeLabel} का ${formatNumber(solver.numericAnswer ?? 0)}% है।`,
        `\\text{आवश्यक प्रतिशत}=${renderedAnswer}`,
      ),
    ];
  }

  if (parameters.language === "pa") {
    return [
      ...sentenceWithMath(
        `ਇੱਥੇ ${wholeLabel} ਦਾ ${formatNumber(knownRate)}% ${displayValue(parameters, knownValue)} ਹੈ।`,
        `${percent(knownRate)}\\rightarrow${displayValue(parameters, knownValue)}`,
      ),
      ...sentenceWithMath(
        `1% ਦਾ ਮਾਨ ਕੱਢਣ ਲਈ ${displayValue(parameters, knownValue)} ਨੂੰ ${formatNumber(knownRate)} ਨਾਲ ਭਾਗ ਦਿਓ।`,
        `1\\%=\\frac{${formatNumber(knownValue)}}{${formatNumber(knownRate)}}=${formatNumber(onePercentValue)}`,
      ),
      ...sentenceWithMath(
        `ਹੁਣ ${displayValue(parameters, targetValue)} ਦੀ ਤੁਲਨਾ 1% ਦੇ ਮਾਨ ਨਾਲ ਕਰਕੇ ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
        `\\text{ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ}=\\frac{${formatNumber(targetValue)}}{${formatNumber(onePercentValue)}}=${percent(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ ${displayValue(parameters, targetValue)}, ${wholeLabel} ਦਾ ${formatNumber(solver.numericAnswer ?? 0)}% ਹੈ।`,
        `\\text{ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ}=${renderedAnswer}`,
      ),
    ];
  }

  return null;
}

function renderLocalizedRatioToPercentageExplanation(
  parameters: Pct002Parameters,
  solver: Pct002SolverResult,
  partA: number,
  partB: number,
  targetPartValue: number,
  totalParts: number,
  targetPartLabel: string,
  renderedAnswer: string,
) {
  if (parameters.language === "hi") {
    return [
      ...sentenceWithMath(
        `पहले अनुपात के दोनों भागों को जोड़कर कुल भागों की संख्या ज्ञात करें।`,
        `\\text{कुल भाग}=${formatNumber(partA)}+${formatNumber(partB)}=${formatNumber(totalParts)}`,
      ),
      ...sentenceWithMath(
        `${targetPartLabel}, इन ${formatNumber(totalParts)} भागों में से ${formatNumber(targetPartValue)} भाग है।`,
        `\\text{हिस्से का भिन्न}=\\frac{${formatNumber(targetPartValue)}}{${formatNumber(totalParts)}}`,
      ),
      ...sentenceWithMath(
        `अब इस भिन्न को प्रतिशत में बदलें।`,
        `\\text{आवश्यक प्रतिशत}=\\frac{${formatNumber(targetPartValue)}}{${formatNumber(totalParts)}}\\times100=${percent(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `अतः ${targetPartLabel} ${formatNumber(solver.numericAnswer ?? 0)}% के बराबर है।`,
        `\\text{${targetPartLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  if (parameters.language === "pa") {
    return [
      ...sentenceWithMath(
        `ਪਹਿਲਾਂ ਅਨੁਪਾਤ ਦੇ ਦੋਵੇਂ ਭਾਗ ਜੋੜ ਕੇ ਕੁੱਲ ਭਾਗਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`,
        `\\text{ਕੁੱਲ ਭਾਗ}=${formatNumber(partA)}+${formatNumber(partB)}=${formatNumber(totalParts)}`,
      ),
      ...sentenceWithMath(
        `${targetPartLabel}, ਇਨ੍ਹਾਂ ${formatNumber(totalParts)} ਭਾਗਾਂ ਵਿੱਚੋਂ ${formatNumber(targetPartValue)} ਭਾਗ ਹੈ।`,
        `\\text{ਹਿੱਸੇ ਦਾ ਭਿੰਨ}=\\frac{${formatNumber(targetPartValue)}}{${formatNumber(totalParts)}}`,
      ),
      ...sentenceWithMath(
        `ਹੁਣ ਇਸ ਭਿੰਨ ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲੋ।`,
        `\\text{ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ}=\\frac{${formatNumber(targetPartValue)}}{${formatNumber(totalParts)}}\\times100=${percent(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ ${targetPartLabel} ${formatNumber(solver.numericAnswer ?? 0)}% ਦੇ ਬਰਾਬਰ ਹੈ।`,
        `\\text{${targetPartLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  return null;
}

function renderLocalizedComplementaryPercentageExplanation(
  parameters: Pct002Parameters,
  solver: Pct002SolverResult,
  knownRate: number,
  partLabel: string,
  complementLabel: string,
  renderedAnswer: string,
) {
  if (parameters.language === "hi") {
    return [
      ...sentenceWithMath(
        `पूरी मात्रा हमेशा 100% होती है।`,
        `${partLabel}+${complementLabel}=100\\%`,
      ),
      ...sentenceWithMath(
        `इसलिए ${formatNumber(knownRate)}% को 100% में से घटाकर शेष प्रतिशत ज्ञात करें।`,
        `${complementLabel}=100\\%-${percent(knownRate)}=${percent(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `अतः ${complementLabel} का प्रतिशत ${formatNumber(solver.numericAnswer ?? 0)}% है।`,
        `\\text{${complementLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  if (parameters.language === "pa") {
    return [
      ...sentenceWithMath(
        `ਪੂਰੀ ਮਾਤਰਾ ਹਮੇਸ਼ਾਂ 100% ਹੁੰਦੀ ਹੈ।`,
        `${partLabel}+${complementLabel}=100\\%`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ ${formatNumber(knownRate)}% ਨੂੰ 100% ਵਿੱਚੋਂ ਘਟਾਕੇ ਬਚਿਆ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
        `${complementLabel}=100\\%-${percent(knownRate)}=${percent(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ ${complementLabel} ਦਾ ਪ੍ਰਤੀਸ਼ਤ ${formatNumber(solver.numericAnswer ?? 0)}% ਹੈ।`,
        `\\text{${complementLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  return null;
}

function renderLocalizedDifferenceBetweenPercentagePartsExplanation(
  parameters: Pct002Parameters,
  solver: Pct002SolverResult,
  rate1: number,
  rate2: number,
  partLabel: string,
  otherLabel: string,
  renderedAnswer: string,
) {
  if (parameters.language === "hi") {
    return [
      ...sentenceWithMath(
        `दोनों हिस्से एक ही कुल के प्रतिशत के रूप में दिए गए हैं।`,
        `${partLabel}=${percent(rate1)},\\ ${otherLabel}=${percent(rate2)}`,
      ),
      ...sentenceWithMath(
        `इसलिए बड़े प्रतिशत में से छोटे प्रतिशत को घटाइए।`,
        `\\text{अंतर}=${percent(rate1)}-${percent(rate2)}=${percent(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `अतः प्रतिशत का अंतर ${formatNumber(solver.numericAnswer ?? 0)}% है।`,
        `\\text{अंतर}=${renderedAnswer}`,
      ),
    ];
  }

  if (parameters.language === "pa") {
    return [
      ...sentenceWithMath(
        `ਦੋਵੇਂ ਹਿੱਸੇ ਇੱਕੋ ਕੁੱਲ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਵਜੋਂ ਦਿੱਤੇ ਗਏ ਹਨ।`,
        `${partLabel}=${percent(rate1)},\\ ${otherLabel}=${percent(rate2)}`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ ਵੱਡੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚੋਂ ਛੋਟਾ ਪ੍ਰਤੀਸ਼ਤ ਘਟਾਓ।`,
        `\\text{ਅੰਤਰ}=${percent(rate1)}-${percent(rate2)}=${percent(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ ਪ੍ਰਤੀਸ਼ਤ ਦਾ ਅੰਤਰ ${formatNumber(solver.numericAnswer ?? 0)}% ਹੈ।`,
        `\\text{ਅੰਤਰ}=${renderedAnswer}`,
      ),
    ];
  }

  return null;
}

function renderLocalizedPercentagePartitionExplanation(
  parameters: Pct002Parameters,
  solver: Pct002SolverResult,
  totalValue: number,
  targetRate: number,
  onePercentValue: number,
  wholeLabel: string,
  targetLabel: string,
  renderedAnswer: string,
) {
  if (parameters.language === "hi") {
    return [
      ...sentenceWithMath(
        `कुल ${wholeLabel} 100% के बराबर है।`,
        `100\\%\\rightarrow${displayValue(parameters, totalValue)}`,
      ),
      ...sentenceWithMath(
        `इसलिए 1% का मान ज्ञात करने के लिए ${displayValue(parameters, totalValue)} को 100 से भाग दें।`,
        `1\\%=\\frac{${formatNumber(totalValue)}}{100}=${formatNumber(onePercentValue)}`,
      ),
      ...sentenceWithMath(
        `अब ${targetLabel} ज्ञात करने के लिए 1% के मान को ${formatNumber(targetRate)} से गुणा करें।`,
        `${percent(targetRate)}=${formatNumber(onePercentValue)}\\times${formatNumber(targetRate)}=${formatNumber(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `अतः ${targetLabel} का मान ${displayValue(parameters, solver.numericAnswer ?? 0)} है।`,
        `\\text{${targetLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  if (parameters.language === "pa") {
    return [
      ...sentenceWithMath(
        `ਕੁੱਲ ${wholeLabel} 100% ਦੇ ਬਰਾਬਰ ਹੈ।`,
        `100\\%\\rightarrow${displayValue(parameters, totalValue)}`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ 1% ਦਾ ਮਾਨ ਕੱਢਣ ਲਈ ${displayValue(parameters, totalValue)} ਨੂੰ 100 ਨਾਲ ਭਾਗ ਦਿਓ।`,
        `1\\%=\\frac{${formatNumber(totalValue)}}{100}=${formatNumber(onePercentValue)}`,
      ),
      ...sentenceWithMath(
        `ਹੁਣ ${targetLabel} ਪਤਾ ਕਰਨ ਲਈ 1% ਦੇ ਮਾਨ ਨੂੰ ${formatNumber(targetRate)} ਨਾਲ ਗੁਣਾ ਕਰੋ।`,
        `${percent(targetRate)}=${formatNumber(onePercentValue)}\\times${formatNumber(targetRate)}=${formatNumber(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ ${targetLabel} ਦਾ ਮਾਨ ${displayValue(parameters, solver.numericAnswer ?? 0)} ਹੈ।`,
        `\\text{${targetLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  return null;
}

function renderLocalizedMissingPercentageExplanation(
  parameters: Pct002Parameters,
  solver: Pct002SolverResult,
  rate1: number,
  rate2: number,
  rate3: number,
  partLabel: string,
  otherLabel: string,
  thirdLabel: string,
  complementLabel: string,
  renderedAnswer: string,
) {
  const knownTotal = rate1 + rate2 + rate3;

  if (parameters.language === "hi") {
    return [
      ...sentenceWithMath(
        `पूरा वितरण 100% होता है।`,
        `${partLabel}+${otherLabel}+${thirdLabel}+${complementLabel}=100\\%`,
      ),
      ...sentenceWithMath(
        `पहले दिए गए प्रतिशतों को जोड़िए।`,
        `${percent(rate1)}+${percent(rate2)}+${percent(rate3)}=${percent(knownTotal)}`,
      ),
      ...sentenceWithMath(
        `अब इस योग को 100% में से घटाकर शेष प्रतिशत ज्ञात कीजिए।`,
        `${complementLabel}=100\\%-${percent(knownTotal)}=${percent(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `अतः ${complementLabel} का प्रतिशत ${formatNumber(solver.numericAnswer ?? 0)}% है।`,
        `\\text{${complementLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  if (parameters.language === "pa") {
    return [
      ...sentenceWithMath(
        `ਪੂਰਾ ਵੰਡ 100% ਹੁੰਦਾ ਹੈ।`,
        `${partLabel}+${otherLabel}+${thirdLabel}+${complementLabel}=100\\%`,
      ),
      ...sentenceWithMath(
        `ਪਹਿਲਾਂ ਦਿੱਤੇ ਹੋਏ ਪ੍ਰਤੀਸ਼ਤ ਜੋੜੋ।`,
        `${percent(rate1)}+${percent(rate2)}+${percent(rate3)}=${percent(knownTotal)}`,
      ),
      ...sentenceWithMath(
        `ਹੁਣ ਇਸ ਜੋੜ ਨੂੰ 100% ਵਿੱਚੋਂ ਘਟਾਕੇ ਬਚਿਆ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
        `${complementLabel}=100\\%-${percent(knownTotal)}=${percent(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ ${complementLabel} ਦਾ ਪ੍ਰਤੀਸ਼ਤ ${formatNumber(solver.numericAnswer ?? 0)}% ਹੈ।`,
        `\\text{${complementLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  return null;
}

function renderLocalizedMultiCategoryDistributionExplanation(
  parameters: Pct002Parameters,
  solver: Pct002SolverResult,
  totalValue: number,
  targetRate: number,
  onePercentValue: number,
  wholeLabel: string,
  targetLabel: string,
  renderedAnswer: string,
) {
  if (parameters.language === "hi") {
    return [
      ...sentenceWithMath(
        `कुल ${wholeLabel} 100% के बराबर है।`,
        `100\\%\\rightarrow${displayValue(parameters, totalValue)}`,
      ),
      ...sentenceWithMath(
        `इसलिए 1% का मान ज्ञात करने के लिए ${displayValue(parameters, totalValue)} को 100 से भाग दें।`,
        `1\\%=\\frac{${formatNumber(totalValue)}}{100}=${formatNumber(onePercentValue)}`,
      ),
      ...sentenceWithMath(
        `अब ${targetLabel} के लिए 1% के मान को ${formatNumber(targetRate)} से गुणा करें।`,
        `${percent(targetRate)}=${formatNumber(onePercentValue)}\\times${formatNumber(targetRate)}=${formatNumber(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `अतः ${targetLabel} का मान ${displayValue(parameters, solver.numericAnswer ?? 0)} है।`,
        `\\text{${targetLabel}}=${renderedAnswer}`,
      ),
    ];
  }

  if (parameters.language === "pa") {
    return [
      ...sentenceWithMath(
        `ਕੁੱਲ ${wholeLabel} 100% ਦੇ ਬਰਾਬਰ ਹੈ।`,
        `100\\%\\rightarrow${displayValue(parameters, totalValue)}`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ 1% ਦਾ ਮਾਨ ਕੱਢਣ ਲਈ ${displayValue(parameters, totalValue)} ਨੂੰ 100 ਨਾਲ ਭਾਗ ਦਿਓ।`,
        `1\\%=\\frac{${formatNumber(totalValue)}}{100}=${formatNumber(onePercentValue)}`,
      ),
      ...sentenceWithMath(
        `ਹੁਣ ${targetLabel} ਲਈ 1% ਦੇ ਮਾਨ ਨੂੰ ${formatNumber(targetRate)} ਨਾਲ ਗੁਣਾ ਕਰੋ।`,
        `${percent(targetRate)}=${formatNumber(onePercentValue)}\\times${formatNumber(targetRate)}=${formatNumber(solver.numericAnswer ?? 0)}`,
      ),
      ...sentenceWithMath(
        `ਇਸ ਲਈ ${targetLabel} ਦਾ ਮਾਨ ${displayValue(parameters, solver.numericAnswer ?? 0)} ਹੈ।`,
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
      {
        const localizedLines = renderLocalizedPercentageFromPartAndWholeExplanation(
          parameters,
          solver,
          wholeValue,
          partValue,
          onePercentValue,
          wholeLabel,
          partLabel,
          renderedAnswer,
        );
        lines.push(
          ...(localizedLines ?? [
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
          ])
        );
      }
      break;
    case "reversePercentageMapping":
      {
        const localizedLines = renderLocalizedReversePercentageMappingExplanation(
          parameters,
          solver,
          knownRate,
          knownValue,
          targetValue,
          onePercentValue,
          wholeLabel,
          renderedAnswer,
        );
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
          `Now compare ${displayValue(parameters, targetValue)} with the value of 1% to find the required percentage.`,
          `\\text{Required percent}=\\frac{${formatNumber(targetValue)}}{${formatNumber(onePercentValue)}}=${percent(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore ${displayValue(parameters, targetValue)} is ${formatNumber(solver.numericAnswer ?? 0)}% of the ${wholeLabel}.`,
          `\\text{Required percent}=${renderedAnswer}`,
        ),
          ])
        );
      }
      break;
    case "ratioToPercentage": {
      const totalParts = partA + partB;
      const targetPartValue = targetPartIndex(parameters) === 1 ? partA : partB;
      const localizedLines = renderLocalizedRatioToPercentageExplanation(
        parameters,
        solver,
        partA,
        partB,
        targetPartValue,
        totalParts,
        targetPartLabel,
        renderedAnswer,
      );
      lines.push(
        ...(localizedLines ?? [
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
        ])
      );
      break;
    }
    case "complementaryPercentage":
      {
        const localizedLines = renderLocalizedComplementaryPercentageExplanation(
          parameters,
          solver,
          knownRate,
          partLabel,
          complementLabel,
          renderedAnswer,
        );
        lines.push(
          ...(localizedLines ?? [
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
          ])
        );
      }
      break;
    case "differenceBetweenPercentageParts":
      {
        const rate1 = Number(parameters.variables["rate1"] ?? 0);
        const rate2 = Number(parameters.variables["rate2"] ?? 0);
        const localizedLines = renderLocalizedDifferenceBetweenPercentagePartsExplanation(
          parameters,
          solver,
          rate1,
          rate2,
          partLabel,
          otherLabel,
          renderedAnswer,
        );
        lines.push(
          ...(localizedLines ?? [
        ...sentenceWithMath(
          `Both parts are already given as percentages of the same whole.`,
          `${partLabel}=${percent(rate1)},\\ ${otherLabel}=${percent(rate2)}`,
        ),
        ...sentenceWithMath(
          `So subtract the smaller percentage from the larger percentage.`,
          `\\text{Difference}=${percent(rate1)}-${percent(rate2)}=${percent(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the percentage difference is ${formatNumber(solver.numericAnswer ?? 0)}%.`,
          `\\text{Difference}=${renderedAnswer}`,
        ),
          ])
        );
      }
      break;
    case "percentagePartition":
      {
        const localizedLines = renderLocalizedPercentagePartitionExplanation(
          parameters,
          solver,
          totalValue,
          targetRate,
          onePercentValue,
          wholeLabel,
          targetLabel,
          renderedAnswer,
        );
        lines.push(
          ...(localizedLines ?? [
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
          ])
        );
      }
      break;
    case "missingPercentage":
      {
        const rate1 = Number(parameters.variables["rate1"] ?? 0);
        const rate2 = Number(parameters.variables["rate2"] ?? 0);
        const rate3 = Number(parameters.variables["rate3"] ?? 0);
        const localizedLines = renderLocalizedMissingPercentageExplanation(
          parameters,
          solver,
          rate1,
          rate2,
          rate3,
          partLabel,
          otherLabel,
          thirdLabel,
          complementLabel,
          renderedAnswer,
        );
        lines.push(
          ...(localizedLines ?? [
        ...sentenceWithMath(
          `The full distribution adds up to 100%.`,
          `${partLabel}+${otherLabel}+${thirdLabel}+${complementLabel}=100\\%`,
        ),
        ...sentenceWithMath(
          `First add the known percentages.`,
          `${percent(rate1)}+${percent(rate2)}+${percent(rate3)}=${percent(100 - (solver.numericAnswer ?? 0))}`,
        ),
        ...sentenceWithMath(
          `Now subtract that total from 100% to get the missing percentage.`,
          `${complementLabel}=100\\%-${percent(100 - (solver.numericAnswer ?? 0))}=${percent(solver.numericAnswer ?? 0)}`,
        ),
        ...sentenceWithMath(
          `Therefore the missing percentage is ${formatNumber(solver.numericAnswer ?? 0)}%.`,
          `\\text{${complementLabel}}=${renderedAnswer}`,
        ),
          ])
        );
      }
      break;
    case "multiCategoryPercentageDistribution":
      {
        const localizedLines = renderLocalizedMultiCategoryDistributionExplanation(
          parameters,
          solver,
          totalValue,
          targetRate,
          onePercentValue,
          wholeLabel,
          targetLabel,
          renderedAnswer,
        );
        lines.push(
          ...(localizedLines ?? [
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
          ])
        );
      }
      break;
  }

  return {
    explanationId: parameters.explanationId,
    lines,
  };
}
