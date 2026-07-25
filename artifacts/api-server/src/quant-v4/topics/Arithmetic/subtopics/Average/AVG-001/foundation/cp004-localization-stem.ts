import { localizedGapStem } from "./cp004-localization-gap-stem";
import { avg001Cp004MultiLexicon, avg001Cp004PairLexicon, avg001Cp004SpeedLexicon, type Avg001Cp004PilotLanguage } from "./cp004-localization-lexicon";
import { contextUnit, display, joined } from "./cp004-localization-format";
import { rationalText, shown, variant } from "./cp004-localization-values";
import type { Avg001QuestionPackage } from "./types";

function pairStem(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  const words = avg001Cp004PairLexicon(variant(pkg), language);
  const unit = contextUnit(pkg);
  if (pkg.solveMode === "findCombinedAverageOfTwoGroups") {
    const count1 = shown(pkg, "count1");
    const count2 = shown(pkg, "count2");
    const average1 = display(shown(pkg, "average1"), unit, language);
    const average2 = display(shown(pkg, "average2"), unit, language);
    return language === "hi"
      ? `${count1} ${words.first} हैं और ${words.firstMeasure} ${average1} है। ${count2} ${words.second} हैं और ${words.secondMeasure} ${average2} है। ${words.result} ज्ञात कीजिए।`
      : `${count1} ${words.first} ਹਨ ਅਤੇ ${words.firstMeasure} ${average1} ਹੈ। ${count2} ${words.second} ਹਨ ਅਤੇ ${words.secondMeasure} ${average2} ਹੈ। ${words.result} ਪਤਾ ਕਰੋ।`;
  }
  if (pkg.solveMode === "findGroupCountFromCombinedAverage") {
    const knownCount = shown(pkg, "knownCount");
    const knownAverage = display(shown(pkg, "knownAverage"), unit, language);
    const unknownAverage = display(shown(pkg, "unknownAverage"), unit, language);
    const combinedAverage = display(shown(pkg, "combinedAverage"), unit, language);
    return language === "hi"
      ? `${knownCount} ${words.first} हैं और ${words.firstMeasure} ${knownAverage} है। ${words.secondMeasure} ${unknownAverage} तथा दोनों समूहों का संयुक्त औसत ${combinedAverage} है। ${words.secondCount} ज्ञात कीजिए।`
      : `${knownCount} ${words.first} ਹਨ ਅਤੇ ${words.firstMeasure} ${knownAverage} ਹੈ। ${words.secondMeasure} ${unknownAverage} ਅਤੇ ਦੋਵਾਂ ਸਮੂਹਾਂ ਦੀ ਸੰਯੁਕਤ ਔਸਤ ${combinedAverage} ਹੈ। ${words.secondCount} ਪਤਾ ਕਰੋ।`;
  }
  const count1 = shown(pkg, "count1");
  const count2 = shown(pkg, "count2");
  const average1 = display(shown(pkg, "average1"), unit, language);
  const combinedAverage = display(shown(pkg, "combinedAverage"), unit, language);
  return language === "hi"
    ? `${count1} ${words.first} हैं और ${words.firstMeasure} ${average1} है। ${count2} ${words.second} को मिलाने पर संयुक्त औसत ${combinedAverage} हो जाता है। ${words.secondMeasure} ज्ञात कीजिए।`
    : `${count1} ${words.first} ਹਨ ਅਤੇ ${words.firstMeasure} ${average1} ਹੈ। ${count2} ${words.second} ਨੂੰ ਮਿਲਾਉਣ ਉੱਤੇ ਸੰਯੁਕਤ ਔਸਤ ${combinedAverage} ਹੋ ਜਾਂਦੀ ਹੈ। ${words.secondMeasure} ਪਤਾ ਕਰੋ।`;
}

function multiStem(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  const words = avg001Cp004MultiLexicon(variant(pkg), language);
  const counts = pkg.parameters.values.groupCounts ?? [];
  const averages = (pkg.parameters.values.groupAverages ?? [])
    .map((value) => display(rationalText(value), contextUnit(pkg), language));
  return language === "hi"
    ? `${words.groups} में ${words.members} की संख्याएँ क्रमशः ${joined(counts.map(String), language)} हैं और उनके ${words.measure} क्रमशः ${joined(averages, language)} हैं। ${words.result} ज्ञात कीजिए।`
    : `${words.groups} ਵਿੱਚ ${words.members} ਦੀਆਂ ਗਿਣਤੀਆਂ ਕ੍ਰਮਵਾਰ ${joined(counts.map(String), language)} ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ${words.measure} ਕ੍ਰਮਵਾਰ ${joined(averages, language)} ਹਨ। ${words.result} ਪਤਾ ਕਰੋ।`;
}

function speedStem(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  const scenario = variant(pkg);
  const words = avg001Cp004SpeedLexicon(scenario, language);
  const speed1 = display(shown(pkg, "speed1"), contextUnit(pkg), language);
  const speed2 = display(shown(pkg, "speed2"), contextUnit(pkg), language);
  if (pkg.solveMode === "findAverageSpeedEqualDistance") {
    return language === "hi"
      ? `${words.subject} में दो समान दूरियाँ क्रमशः ${speed1} और ${speed2} की गति से तय की जाती हैं। ${words.result} ज्ञात कीजिए।`
      : `${words.subject} ਵਿੱਚ ਦੋ ਬਰਾਬਰ ਦੂਰੀਆਂ ਕ੍ਰਮਵਾਰ ${speed1} ਅਤੇ ${speed2} ਦੀ ਗਤੀ ਨਾਲ ਤੈਅ ਕੀਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ${words.result} ਪਤਾ ਕਰੋ।`;
  }
  if (scenario === "abstractEqualWeights") {
    return language === "hi"
      ? `समान समय तक लागू दो दरें क्रमशः ${speed1} और ${speed2} हैं। ${words.result} ज्ञात कीजिए।`
      : `ਬਰਾਬਰ ਸਮੇਂ ਲਈ ਲਾਗੂ ਦੋ ਦਰਾਂ ਕ੍ਰਮਵਾਰ ${speed1} ਅਤੇ ${speed2} ਹਨ। ${words.result} ਪਤਾ ਕਰੋ।`;
  }
  return language === "hi"
    ? `${words.subject} के लिए समान समय के दो चरणों की दरें क्रमशः ${speed1} और ${speed2} हैं। ${words.result} ज्ञात कीजिए।`
    : `${words.subject} ਲਈ ਬਰਾਬਰ ਸਮੇਂ ਦੇ ਦੋ ਪੜਾਵਾਂ ਦੀਆਂ ਦਰਾਂ ਕ੍ਰਮਵਾਰ ${speed1} ਅਤੇ ${speed2} ਹਨ। ${words.result} ਪਤਾ ਕਰੋ।`;
}

export function localizedStem(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  if (
    pkg.solveMode === "findGroupCountRatioFromCombinedAverage" ||
    pkg.solveMode === "findAverageSpeedForUnequalDistances" ||
    pkg.solveMode === "findAverageSpeedForUnequalTimes"
  ) {
    return localizedGapStem(pkg, language);
  }
  if (pkg.solveMode === "findCombinedAverageOfThreeOrFourGroups") return multiStem(pkg, language);
  if (pkg.solveMode === "findAverageSpeedEqualDistance" || pkg.solveMode === "findAverageSpeedEqualTime") return speedStem(pkg, language);
  return pairStem(pkg, language);
}
