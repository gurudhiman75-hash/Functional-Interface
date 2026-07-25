import { avg001Cp004RatioLexicon } from "./cp004-localization-gap-lexicon";
import type { Avg001Cp004PilotLanguage } from "./cp004-localization-types";
import { shown } from "./cp004-localization-values";
import type { Avg001QuestionPackage } from "./types";

function ratioExplanation(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  const words = avg001Cp004RatioLexicon(pkg.parameters.scenarioVariant, language);
  const lower = Number(shown(pkg, "groupAverage1"));
  const upper = Number(shown(pkg, "groupAverage2"));
  const combined = Number(shown(pkg, "combinedAverage"));
  const upperDistance = upper - combined;
  const lowerDistance = combined - lower;
  return { lines: language === "hi" ? [
    `${words.ratio} संयुक्त औसत से दोनों समूह-औसतों की दूरियों के उल्टे अनुपात से मिलता है।`,
    `$$ऊपरी दूरी = ${upper}-${combined} = ${upperDistance}$$`,
    `$$पहला समूह:दूसरा समूह = (${upper}-${combined}):(${combined}-${lower}) = ${upperDistance}:${lowerDistance} = ${pkg.answer}$$`,
    `अतः ${words.ratio} ${pkg.answer} है।`,
  ] : [
    `${words.ratio} ਸੰਯੁਕਤ ਔਸਤ ਤੋਂ ਦੋਵਾਂ ਸਮੂਹ-ਔਸਤਾਂ ਦੀਆਂ ਦੂਰੀਆਂ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਨਾਲ ਮਿਲਦਾ ਹੈ।`,
    `$$ਉੱਪਰੀ ਦੂਰੀ = ${upper}-${combined} = ${upperDistance}$$`,
    `$$ਪਹਿਲਾ ਸਮੂਹ:ਦੂਜਾ ਸਮੂਹ = (${upper}-${combined}):(${combined}-${lower}) = ${upperDistance}:${lowerDistance} = ${pkg.answer}$$`,
    `ਇਸ ਲਈ ${words.ratio} ${pkg.answer} ਹੈ।`,
  ] };
}

function distanceExplanation(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  const distance1 = Number(shown(pkg, "distance1"));
  const distance2 = Number(shown(pkg, "distance2"));
  const speed1 = Number(shown(pkg, "speed1"));
  const speed2 = Number(shown(pkg, "speed2"));
  const time1 = distance1 / speed1;
  const time2 = distance2 / speed2;
  const totalDistance = distance1 + distance2;
  const totalTime = time1 + time2;
  return { lines: language === "hi" ? [
    "असमान दूरियों के लिए औसत गति कुल दूरी को दोनों चरणों के कुल समय से भाग देकर मिलती है।",
    `$$कुल समय = ${distance1}÷${speed1} + ${distance2}÷${speed2} = ${time1}+${time2} = ${totalTime} घंटे$$`,
    `$$औसत गति = (${distance1}+${distance2})÷${totalTime} = ${totalDistance}÷${totalTime} = ${pkg.answer}$$`,
    `अतः पूरी यात्रा की औसत गति ${pkg.answer} किमी/घंटा है।`,
  ] : [
    "ਅਸਮਾਨ ਦੂਰੀਆਂ ਲਈ ਔਸਤ ਗਤੀ ਕੁੱਲ ਦੂਰੀ ਨੂੰ ਦੋਵਾਂ ਪੜਾਵਾਂ ਦੇ ਕੁੱਲ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮਿਲਦੀ ਹੈ।",
    `$$ਕੁੱਲ ਸਮਾਂ = ${distance1}÷${speed1} + ${distance2}÷${speed2} = ${time1}+${time2} = ${totalTime} ਘੰਟੇ$$`,
    `$$ਔਸਤ ਗਤੀ = (${distance1}+${distance2})÷${totalTime} = ${totalDistance}÷${totalTime} = ${pkg.answer}$$`,
    `ਇਸ ਲਈ ਪੂਰੀ ਯਾਤਰਾ ਦੀ ਔਸਤ ਗਤੀ ${pkg.answer} ਕਿਮੀ/ਘੰਟਾ ਹੈ।`,
  ] };
}

function timeExplanation(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  const speed1 = Number(shown(pkg, "speed1"));
  const speed2 = Number(shown(pkg, "speed2"));
  const time1 = Number(shown(pkg, "time1"));
  const time2 = Number(shown(pkg, "time2"));
  const firstDistance = speed1 * time1;
  const secondDistance = speed2 * time2;
  const totalDistance = firstDistance + secondDistance;
  const totalTime = time1 + time2;
  return { lines: language === "hi" ? [
    "असमान समय के लिए प्रत्येक गति को उस गति पर बिताए समय से भार दिया जाता है।",
    `$$कुल दूरी = ${speed1}×${time1} + ${speed2}×${time2} = ${firstDistance}+${secondDistance} = ${totalDistance} किमी$$`,
    `$$औसत गति = ${totalDistance}÷(${time1}+${time2}) = ${totalDistance}÷${totalTime} = ${pkg.answer}$$`,
    `अतः पूरी यात्रा की औसत गति ${pkg.answer} किमी/घंटा है।`,
  ] : [
    "ਅਸਮਾਨ ਸਮੇਂ ਲਈ ਹਰ ਗਤੀ ਨੂੰ ਉਸ ਗਤੀ ਉੱਤੇ ਬਿਤਾਏ ਸਮੇਂ ਅਨੁਸਾਰ ਭਾਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।",
    `$$ਕੁੱਲ ਦੂਰੀ = ${speed1}×${time1} + ${speed2}×${time2} = ${firstDistance}+${secondDistance} = ${totalDistance} ਕਿਮੀ$$`,
    `$$ਔਸਤ ਗਤੀ = ${totalDistance}÷(${time1}+${time2}) = ${totalDistance}÷${totalTime} = ${pkg.answer}$$`,
    `ਇਸ ਲਈ ਪੂਰੀ ਯਾਤਰਾ ਦੀ ਔਸਤ ਗਤੀ ${pkg.answer} ਕਿਮੀ/ਘੰਟਾ ਹੈ।`,
  ] };
}

export function localizedGapExplanation(pkg: Avg001QuestionPackage, language: Avg001Cp004PilotLanguage) {
  if (pkg.solveMode === "findGroupCountRatioFromCombinedAverage") return ratioExplanation(pkg, language);
  if (pkg.solveMode === "findAverageSpeedForUnequalDistances") return distanceExplanation(pkg, language);
  if (pkg.solveMode === "findAverageSpeedForUnequalTimes") return timeExplanation(pkg, language);
  throw new Error(`Unsupported CP-004 gap explanation mode ${pkg.solveMode}`);
}
