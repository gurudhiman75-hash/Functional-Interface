import {
  avg001Cp004RatioLexicon,
  avg001Cp004TravelSubject,
  type Avg001Cp004RatioUnit,
} from "./cp004-localization-gap-lexicon";
import type { Avg001Cp004PilotLanguage } from "./cp004-localization-types";
import { display } from "./cp004-localization-format";
import { shown } from "./cp004-localization-values";
import type { Avg001QuestionPackage } from "./types";

function ratioValue(raw: string, unit: Avg001Cp004RatioUnit, language: Avg001Cp004PilotLanguage) {
  if (unit === "rainfall") return `${raw} ${language === "hi" ? "सेमी" : "ਸੈਮੀ"}`;
  if (unit === "thousandCurrency") return `₹${raw} ${language === "hi" ? "हजार" : "ਹਜ਼ਾਰ"}`;
  return display(raw, unit, language);
}

function ratioStem(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  const words = avg001Cp004RatioLexicon(pkg.parameters.scenarioVariant, language);
  const first = ratioValue(shown(pkg, "groupAverage1"), words.unit, language);
  const second = ratioValue(shown(pkg, "groupAverage2"), words.unit, language);
  const combined = ratioValue(shown(pkg, "combinedAverage"), words.unit, language);
  return language === "hi"
    ? `${words.firstAverage} ${first} और ${words.secondAverage} ${second} है। ${words.combinedAverage} ${combined} है। ${words.ratio} ज्ञात कीजिए।`
    : `${words.firstAverage} ${first} ਅਤੇ ${words.secondAverage} ${second} ਹੈ। ${words.combinedAverage} ${combined} ਹੈ। ${words.ratio} ਪਤਾ ਕਰੋ।`;
}

function travelStem(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  const subject = avg001Cp004TravelSubject(pkg.parameters.scenarioVariant, language);
  const speed1 = shown(pkg, "speed1");
  const speed2 = shown(pkg, "speed2");
  if (pkg.solveMode === "findAverageSpeedForUnequalDistances") {
    const distance1 = shown(pkg, "distance1");
    const distance2 = shown(pkg, "distance2");
    return language === "hi"
      ? `${subject} पहले ${distance1} किमी की दूरी ${speed1} किमी/घंटा और फिर ${distance2} किमी की दूरी ${speed2} किमी/घंटा की गति से तय करता है। पूरी यात्रा की औसत गति ज्ञात कीजिए।`
      : `${subject} ਪਹਿਲਾਂ ${distance1} ਕਿਮੀ ਦੀ ਦੂਰੀ ${speed1} ਕਿਮੀ/ਘੰਟਾ ਅਤੇ ਫਿਰ ${distance2} ਕਿਮੀ ਦੀ ਦੂਰੀ ${speed2} ਕਿਮੀ/ਘੰਟਾ ਦੀ ਗਤੀ ਨਾਲ ਤੈਅ ਕਰਦਾ ਹੈ। ਪੂਰੀ ਯਾਤਰਾ ਦੀ ਔਸਤ ਗਤੀ ਪਤਾ ਕਰੋ।`;
  }
  const time1 = shown(pkg, "time1");
  const time2 = shown(pkg, "time2");
  return language === "hi"
    ? `${subject} ${speed1} किमी/घंटा की गति से ${time1} घंटे और ${speed2} किमी/घंटा की गति से ${time2} घंटे चलता है। पूरी यात्रा की औसत गति ज्ञात कीजिए।`
    : `${subject} ${speed1} ਕਿਮੀ/ਘੰਟਾ ਦੀ ਗਤੀ ਨਾਲ ${time1} ਘੰਟੇ ਅਤੇ ${speed2} ਕਿਮੀ/ਘੰਟਾ ਦੀ ਗਤੀ ਨਾਲ ${time2} ਘੰਟੇ ਚਲਦਾ ਹੈ। ਪੂਰੀ ਯਾਤਰਾ ਦੀ ਔਸਤ ਗਤੀ ਪਤਾ ਕਰੋ।`;
}

export function localizedGapStem(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  if (pkg.solveMode === "findGroupCountRatioFromCombinedAverage") return ratioStem(pkg, language);
  if (pkg.solveMode === "findAverageSpeedForUnequalDistances" || pkg.solveMode === "findAverageSpeedForUnequalTimes") {
    return travelStem(pkg, language);
  }
  throw new Error(`Unsupported CP-004 gap solve mode ${pkg.solveMode}`);
}
