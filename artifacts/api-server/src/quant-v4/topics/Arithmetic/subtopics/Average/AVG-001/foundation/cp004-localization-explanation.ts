import { localizedGapExplanation } from "./cp004-localization-gap-explanation";
import { avg001Cp004MultiLexicon, avg001Cp004PairLexicon, avg001Cp004SpeedLexicon, type Avg001Cp004PilotLanguage } from "./cp004-localization-lexicon";
import { contextUnit, display } from "./cp004-localization-format";
import { rationalText, shown, variant } from "./cp004-localization-values";
import type { Avg001QuestionPackage } from "./types";

function resultContext(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  if (pkg.solveMode === "findCombinedAverageOfThreeOrFourGroups") {
    return avg001Cp004MultiLexicon(variant(pkg), language).result;
  }
  if (pkg.solveMode === "findAverageSpeedEqualDistance" || pkg.solveMode === "findAverageSpeedEqualTime") {
    return avg001Cp004SpeedLexicon(variant(pkg), language).result;
  }
  const words = avg001Cp004PairLexicon(variant(pkg), language);
  if (pkg.solveMode === "findGroupCountFromCombinedAverage") return words.secondCount;
  if (pkg.solveMode === "findMissingGroupAverage") return words.secondMeasure;
  return words.result;
}

function finalLine(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  const answer = pkg.parameters.answerType === "COUNT"
    ? pkg.answer
    : display(pkg.answer, contextUnit(pkg), language);
  return language === "hi"
    ? `अतः ${resultContext(pkg, language)} ${answer} है।`
    : `ਇਸ ਲਈ ${resultContext(pkg, language)} ${answer} ਹੈ।`;
}

function combinedExplanation(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  const counts = pkg.parameters.values.groupCounts ?? [];
  const averages = pkg.parameters.values.groupAverages ?? [];
  const totals = pkg.parameters.values.groupTotals ?? [];
  const combinedCount = pkg.parameters.values.combinedCount ?? pkg.parameters.values.count;
  const combinedTotal = rationalText(pkg.parameters.values.combinedTotal ?? pkg.parameters.values.total);
  const products = averages.map((average, index) => `${rationalText(average)}×${counts[index]}`).join("+");
  const totalsText = totals.map(rationalText).join("+");
  const opening = language === "hi"
    ? `${resultContext(pkg, language)} के लिए प्रत्येक समूह के औसत को उसकी संख्या से गुणा करके समूह-कुल बनाया जाता है।`
    : `${resultContext(pkg, language)} ਲਈ ਹਰ ਸਮੂਹ ਦੀ ਔਸਤ ਨੂੰ ਉਸ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਸਮੂਹ-ਕੁੱਲ ਬਣਾਇਆ ਜਾਂਦਾ ਹੈ।`;
  return { lines: [
    opening,
    language === "hi" ? `$$समूह-कुल = ${products} = ${totalsText} = ${combinedTotal}$$` : `$$ਸਮੂਹ-ਕੁੱਲ = ${products} = ${totalsText} = ${combinedTotal}$$`,
    language === "hi" ? `$$संयुक्त औसत = ${combinedTotal}÷${combinedCount} = ${pkg.answer}$$` : `$$ਸੰਯੁਕਤ ਔਸਤ = ${combinedTotal}÷${combinedCount} = ${pkg.answer}$$`,
    finalLine(pkg, language),
  ] };
}

function countExplanation(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  const values = pkg.parameters.values;
  const knownCount = values.knownGroupCount!;
  const knownAverage = rationalText(values.knownGroupAverage);
  const unknownAverage = rationalText(values.unknownGroupAverage);
  const combinedAverage = rationalText(values.combinedAverage);
  return { lines: language === "hi" ? [
    `${resultContext(pkg, language)} संयुक्त औसत के दोनों ओर के भारित अंतर को संतुलित करने से मिलती है।`,
    `$$ज्ञात समूह का अंतर-योग = ${knownCount}×(${combinedAverage}-${knownAverage})$$`,
    `$$अज्ञात संख्या = ${knownCount}×(${combinedAverage}-${knownAverage})÷(${unknownAverage}-${combinedAverage}) = ${pkg.answer}$$`,
    finalLine(pkg, language),
  ] : [
    `${resultContext(pkg, language)} ਸੰਯੁਕਤ ਔਸਤ ਦੇ ਦੋਵਾਂ ਪਾਸਿਆਂ ਦੇ ਭਾਰਿਤ ਅੰਤਰ ਨੂੰ ਸੰਤੁਲਿਤ ਕਰਕੇ ਮਿਲਦੀ ਹੈ।`,
    `$$ਜਾਣੇ ਸਮੂਹ ਦਾ ਅੰਤਰ-ਜੋੜ = ${knownCount}×(${combinedAverage}-${knownAverage})$$`,
    `$$ਅਣਜਾਣ ਗਿਣਤੀ = ${knownCount}×(${combinedAverage}-${knownAverage})÷(${unknownAverage}-${combinedAverage}) = ${pkg.answer}$$`,
    finalLine(pkg, language),
  ] };
}

function missingExplanation(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  const values = pkg.parameters.values;
  const knownCount = values.knownGroupCount!;
  const unknownCount = values.unknownGroupCount!;
  const knownAverage = rationalText(values.knownGroupAverage);
  const combinedAverage = rationalText(values.combinedAverage);
  const combinedCount = values.combinedCount!;
  const knownTotal = rationalText(values.groupTotals?.[0]);
  const combinedTotal = rationalText(values.combinedTotal);
  return { lines: language === "hi" ? [
    `${resultContext(pkg, language)} के लिए पूरे समूह के कुल में से ज्ञात समूह का कुल घटाया जाता है।`,
    `$$ज्ञात कुल = ${knownAverage}×${knownCount} = ${knownTotal}; संयुक्त कुल = ${combinedAverage}×${combinedCount} = ${combinedTotal}$$`,
    `$$अज्ञात समूह का औसत = (${combinedTotal}-${knownTotal})÷${unknownCount} = ${pkg.answer}$$`,
    finalLine(pkg, language),
  ] : [
    `${resultContext(pkg, language)} ਲਈ ਪੂਰੇ ਸਮੂਹ ਦੇ ਕੁੱਲ ਵਿੱਚੋਂ ਜਾਣੇ ਸਮੂਹ ਦਾ ਕੁੱਲ ਘਟਾਇਆ ਜਾਂਦਾ ਹੈ।`,
    `$$ਜਾਣਿਆ ਕੁੱਲ = ${knownAverage}×${knownCount} = ${knownTotal}; ਸੰਯੁਕਤ ਕੁੱਲ = ${combinedAverage}×${combinedCount} = ${combinedTotal}$$`,
    `$$ਅਣਜਾਣ ਸਮੂਹ ਦੀ ਔਸਤ = (${combinedTotal}-${knownTotal})÷${unknownCount} = ${pkg.answer}$$`,
    finalLine(pkg, language),
  ] };
}

function speedExplanation(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  const speed1 = shown(pkg, "speed1");
  const speed2 = shown(pkg, "speed2");
  if (pkg.solveMode === "findAverageSpeedEqualDistance") {
    return { lines: language === "hi" ? [
      `${resultContext(pkg, language)} निकालते समय धीमे चरण का समय अधिक होता है, इसलिए दोनों गतियों का साधारण औसत नहीं लिया जाता।`,
      `$$समान दूरी के लिए कुल समय = दूरी÷${speed1} + दूरी÷${speed2}$$`,
      `$$औसत गति = 2×${speed1}×${speed2}÷(${speed1}+${speed2}) = ${pkg.answer}$$`,
      finalLine(pkg, language),
    ] : [
      `${resultContext(pkg, language)} ਕੱਢਦੇ ਸਮੇਂ ਹੌਲੇ ਪੜਾਅ ਦਾ ਸਮਾਂ ਵੱਧ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਦੋਵਾਂ ਗਤੀਆਂ ਦੀ ਸਧਾਰਨ ਔਸਤ ਨਹੀਂ ਲਈ ਜਾਂਦੀ।`,
      `$$ਬਰਾਬਰ ਦੂਰੀ ਲਈ ਕੁੱਲ ਸਮਾਂ = ਦੂਰੀ÷${speed1} + ਦੂਰੀ÷${speed2}$$`,
      `$$ਔਸਤ ਗਤੀ = 2×${speed1}×${speed2}÷(${speed1}+${speed2}) = ${pkg.answer}$$`,
      finalLine(pkg, language),
    ] };
  }
  return { lines: language === "hi" ? [
    `${resultContext(pkg, language)} निकालते समय दोनों दरें समान समय तक लागू होती हैं, इसलिए उनका भार बराबर है।`,
    `$$समान समय में कुल प्रभाव = ${speed1}+${speed2}$$`,
    `$$औसत दर = (${speed1}+${speed2})÷2 = ${pkg.answer}$$`,
    finalLine(pkg, language),
  ] : [
    `${resultContext(pkg, language)} ਕੱਢਦੇ ਸਮੇਂ ਦੋਵਾਂ ਦਰਾਂ ਬਰਾਬਰ ਸਮੇਂ ਲਈ ਲਾਗੂ ਹੁੰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦਾ ਭਾਰ ਬਰਾਬਰ ਹੈ।`,
    `$$ਬਰਾਬਰ ਸਮੇਂ ਵਿੱਚ ਕੁੱਲ ਪ੍ਰਭਾਵ = ${speed1}+${speed2}$$`,
    `$$ਔਸਤ ਦਰ = (${speed1}+${speed2})÷2 = ${pkg.answer}$$`,
    finalLine(pkg, language),
  ] };
}

export function localizedExplanation(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  if (
    pkg.solveMode === "findGroupCountRatioFromCombinedAverage" ||
    pkg.solveMode === "findAverageSpeedForUnequalDistances" ||
    pkg.solveMode === "findAverageSpeedForUnequalTimes"
  ) {
    return localizedGapExplanation(pkg, language);
  }
  if (pkg.solveMode === "findGroupCountFromCombinedAverage") return countExplanation(pkg, language);
  if (pkg.solveMode === "findMissingGroupAverage") return missingExplanation(pkg, language);
  if (pkg.solveMode === "findAverageSpeedEqualDistance" || pkg.solveMode === "findAverageSpeedEqualTime") return speedExplanation(pkg, language);
  return combinedExplanation(pkg, language);
}
