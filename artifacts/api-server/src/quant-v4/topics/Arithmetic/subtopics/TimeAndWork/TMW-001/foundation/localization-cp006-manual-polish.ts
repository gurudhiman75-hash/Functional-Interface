import { toLatex } from "./rational";
import type { TmwCp006GeneratedQuestion } from "./cp006-types";
import { cp006Copy, cp006Dimensions } from "./localization-cp006-language";
import { polishTmwCp006LocalizedProse } from "./localization-cp006-polish";
import type { TmwLocalizedLanguage } from "./localization-types";

function hindiManualPolish(text: string): string {
  return text
    .replace(/सड़क-मरम्मत का ठेका को/g, "सड़क-मरम्मत का काम")
    .replace(/चारदीवारी का निर्माण को/g, "चारदीवारी का निर्माण")
    .replace(/रंगाई का ठेका को/g, "रंगाई का काम")
    .replace(/निरीक्षण का कार्य को/g, "निरीक्षण का कार्य")
    .replace(/पैकिंग का ऑर्डर का/g, "पैकिंग के काम का")
    .replace(/पैकिंग का ऑर्डर को/g, "पैकिंग का काम")
    .replace(/दस्तावेज़ सत्यापन की खेप को/g, "दस्तावेज़ सत्यापन का काम")
    .replace(/दस्तावेज़ सत्यापन की खेप/g, "दस्तावेज़ सत्यापन का काम")
    .replace(/पुर्ज़ों के उत्पादन का ऑर्डर को/g, "पुर्ज़ों का उत्पादन")
    .replace(/छपाई का ऑर्डर को/g, "छपाई का काम")
    .replace(/बोतल भरने का लक्ष्य को/g, "बोतल भरने का काम")
    .replace(/असेंबली का लक्ष्य को/g, "असेंबली का काम")
    .replace(/मूल काम का (.+?) गुना काम को/g, "मूल काम का $1 गुना काम")
    .replace(/उतना ही काम को/g, "उतना ही काम")
    .replace(/([2-9]|\d{2,}) श्रमिक को/g, "$1 श्रमिकों को")
    .replace(/([2-9]|\d{2,}) क्लर्क को/g, "$1 क्लर्कों को")
    .replace(/([2-9]|\d{2,}) पैकिंग कर्मी को/g, "$1 पैकिंग कर्मियों को")
    .replace(/([2-9]|\d{2,}) पेंटर को/g, "$1 पेंटरों को")
    .replace(/([2-9]|\d{2,}) निरीक्षक को/g, "$1 निरीक्षकों को")
    .replace(/([2-9]|\d{2,}) श्रमिक ने/g, "$1 श्रमिकों ने")
    .replace(/([2-9]|\d{2,}) क्लर्क ने/g, "$1 क्लर्कों ने")
    .replace(/([2-9]|\d{2,}) पैकिंग कर्मी ने/g, "$1 पैकिंग कर्मियों ने")
    .replace(/([2-9]|\d{2,}) पेंटर ने/g, "$1 पेंटरों ने")
    .replace(/([2-9]|\d{2,}) निरीक्षक ने/g, "$1 निरीक्षकों ने")
    .replace(/([2-9]|\d{2,}) बोतल भरने वाली लाइनें को/g, "$1 बोतल भरने वाली लाइनों को")
    .replace(/([2-9]|\d{2,}) प्रिंटिंग मशीनें को/g, "$1 प्रिंटिंग मशीनों को")
    .replace(/([2-9]|\d{2,}) मशीनें को/g, "$1 मशीनों को")
    .replace(/([2-9]|\d{2,}) असेंबली इकाइयाँ को/g, "$1 असेंबली इकाइयों को")
    .replace(/((?:बोतल भरने वाली लाइनें|प्रिंटिंग मशीनें|मशीनें|असेंबली इकाइयाँ)[^।?\n]*) बनाते हैं/g, "$1 बनाती हैं")
    .replace(/((?:बोतल भरने वाली लाइनें|प्रिंटिंग मशीनें|मशीनें|असेंबली इकाइयाँ)[^।?\n]*) बनाएँगे/g, "$1 बनाएँगी")
    .replace(/((?:हर बोतल भरने वाली लाइन|प्रत्येक प्रिंटिंग मशीन|प्रत्येक मशीन|प्रत्येक असेंबली इकाई)[^।?\n]*) बनाता है/g, "$1 बनाती है")
    .replace(/कितने बोतलें/g, "कितनी बोतलें")
    .replace(/कितने प्रतियाँ/g, "कितनी प्रतियाँ")
    .replace(/कितने इकाइयाँ/g, "कितनी इकाइयाँ")
    .replace(/(पालियाँ|बोतलें|प्रतियाँ|इकाइयाँ) है/g, "$1 हैं");
}

function punjabiManualPolish(text: string): string {
  return text
    .replace(/मीटर/g, "ਮੀਟਰ")
    .replace(/ਸੜਕ ਮੁਰੰਮਤ ਦਾ ਠੇਕਾ ਨੂੰ/g, "ਸੜਕ ਮੁਰੰਮਤ ਦਾ ਕੰਮ")
    .replace(/ਚਾਰਦੀਵਾਰੀ ਦਾ ਨਿਰਮਾਣ ਨੂੰ/g, "ਚਾਰਦੀਵਾਰੀ ਦਾ ਨਿਰਮਾਣ")
    .replace(/ਰੰਗ ਕਰਨ ਦਾ ਠੇਕਾ ਨੂੰ/g, "ਰੰਗ ਕਰਨ ਦਾ ਕੰਮ")
    .replace(/ਜਾਂਚ ਦਾ ਕੰਮ ਨੂੰ/g, "ਜਾਂਚ ਦਾ ਕੰਮ")
    .replace(/ਪੈਕਿੰਗ ਦਾ ਆਰਡਰ ਦਾ/g, "ਪੈਕਿੰਗ ਦੇ ਕੰਮ ਦਾ")
    .replace(/ਪੈਕਿੰਗ ਦਾ ਆਰਡਰ ਨੂੰ/g, "ਪੈਕਿੰਗ ਦਾ ਕੰਮ")
    .replace(/ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ ਦੀ ਖੇਪ ਨੂੰ/g, "ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ ਦਾ ਕੰਮ")
    .replace(/ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ ਦੀ ਖੇਪ/g, "ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ ਦਾ ਕੰਮ")
    .replace(/ਪੁਰਜ਼ਿਆਂ ਦੇ ਉਤਪਾਦਨ ਦਾ ਆਰਡਰ ਨੂੰ/g, "ਪੁਰਜ਼ਿਆਂ ਦਾ ਉਤਪਾਦਨ")
    .replace(/ਛਪਾਈ ਦਾ ਆਰਡਰ ਨੂੰ/g, "ਛਪਾਈ ਦਾ ਕੰਮ")
    .replace(/ਬੋਤਲਾਂ ਭਰਨ ਦਾ ਟੀਚਾ ਨੂੰ/g, "ਬੋਤਲਾਂ ਭਰਨ ਦਾ ਕੰਮ")
    .replace(/ਅਸੈਂਬਲੀ ਦਾ ਟੀਚਾ ਨੂੰ/g, "ਅਸੈਂਬਲੀ ਦਾ ਕੰਮ")
    .replace(/ਮੂਲ ਕੰਮ ਦਾ (.+?) ਗੁਣਾ ਕੰਮ ਨੂੰ/g, "ਮੂਲ ਕੰਮ ਦਾ $1 ਗੁਣਾ ਕੰਮ")
    .replace(/ਉਤਨਾ ਹੀ ਕੰਮ ਨੂੰ/g, "ਉਹੀ ਕੰਮ")
    .replace(/ਉਤਨਾ ਹੀ ਕੰਮ/g, "ਉਹੀ ਕੰਮ")
    .replace(/([2-9]|\d{2,}) ਮਜ਼ਦੂਰ ਨੂੰ/g, "$1 ਮਜ਼ਦੂਰਾਂ ਨੂੰ")
    .replace(/([2-9]|\d{2,}) ਕਲਰਕ ਨੂੰ/g, "$1 ਕਲਰਕਾਂ ਨੂੰ")
    .replace(/([2-9]|\d{2,}) ਪੈਕਿੰਗ ਕਰਮਚਾਰੀ ਨੂੰ/g, "$1 ਪੈਕਿੰਗ ਕਰਮਚਾਰੀਆਂ ਨੂੰ")
    .replace(/([2-9]|\d{2,}) ਪੇਂਟਰ ਨੂੰ/g, "$1 ਪੇਂਟਰਾਂ ਨੂੰ")
    .replace(/([2-9]|\d{2,}) ਜਾਂਚ ਕਰਮਚਾਰੀ ਨੂੰ/g, "$1 ਜਾਂਚ ਕਰਮਚਾਰੀਆਂ ਨੂੰ")
    .replace(/([2-9]|\d{2,}) ਮਜ਼ਦੂਰ ਨੇ/g, "$1 ਮਜ਼ਦੂਰਾਂ ਨੇ")
    .replace(/([2-9]|\d{2,}) ਕਲਰਕ ਨੇ/g, "$1 ਕਲਰਕਾਂ ਨੇ")
    .replace(/([2-9]|\d{2,}) ਪੈਕਿੰਗ ਕਰਮਚਾਰੀ ਨੇ/g, "$1 ਪੈਕਿੰਗ ਕਰਮਚਾਰੀਆਂ ਨੇ")
    .replace(/([2-9]|\d{2,}) ਪੇਂਟਰ ਨੇ/g, "$1 ਪੇਂਟਰਾਂ ਨੇ")
    .replace(/([2-9]|\d{2,}) ਜਾਂਚ ਕਰਮਚਾਰੀ ਨੇ/g, "$1 ਜਾਂਚ ਕਰਮਚਾਰੀਆਂ ਨੇ")
    .replace(/((?:ਬੋਤਲ ਭਰਨ ਵਾਲੀਆਂ ਲਾਈਨਾਂ|ਪ੍ਰਿੰਟਿੰਗ ਮਸ਼ੀਨਾਂ|ਮਸ਼ੀਨਾਂ|ਅਸੈਂਬਲੀ ਇਕਾਈਆਂ)[^।?\n]*) ਬਣਾਉਂਦੇ ਹਨ/g, "$1 ਬਣਾਉਂਦੀਆਂ ਹਨ")
    .replace(/((?:ਬੋਤਲ ਭਰਨ ਵਾਲੀਆਂ ਲਾਈਨਾਂ|ਪ੍ਰਿੰਟਿੰਗ ਮਸ਼ੀਨਾਂ|ਮਸ਼ੀਨਾਂ|ਅਸੈਂਬਲੀ ਇਕਾਈਆਂ)[^।?\n]*) ਬਣਾਉਣਗੇ/g, "$1 ਬਣਾਉਣਗੀਆਂ")
    .replace(/((?:ਹਰ ਬੋਤਲ ਭਰਨ ਵਾਲੀ ਲਾਈਨ|ਹਰ ਪ੍ਰਿੰਟਿੰਗ ਮਸ਼ੀਨ|ਹਰ ਮਸ਼ੀਨ|ਹਰ ਅਸੈਂਬਲੀ ਇਕਾਈ)[^।?\n]*) ਬਣਾਉਂਦਾ ਹੈ/g, "$1 ਬਣਾਉਂਦੀ ਹੈ")
    .replace(/ਕਿੰਨੇ ਬੋਤਲਾਂ/g, "ਕਿੰਨੀਆਂ ਬੋਤਲਾਂ")
    .replace(/ਕਿੰਨੇ ਕਾਪੀਆਂ/g, "ਕਿੰਨੀਆਂ ਕਾਪੀਆਂ")
    .replace(/ਕਿੰਨੇ ਇਕਾਈਆਂ/g, "ਕਿੰਨੀਆਂ ਇਕਾਈਆਂ")
    .replace(/ਕਿੰਨੇ ਅਰਜ਼ੀਆਂ/g, "ਕਿੰਨੀਆਂ ਅਰਜ਼ੀਆਂ")
    .replace(/(ਸ਼ਿਫ਼ਟਾਂ|ਬੋਤਲਾਂ|ਕਾਪੀਆਂ|ਇਕਾਈਆਂ) ਹੈ/g, "$1 ਹਨ");
}

export function polishTmwCp006ManualText(
  text: string,
  language: TmwLocalizedLanguage,
): string {
  const firstPass = polishTmwCp006LocalizedProse(text, language);
  return language === "hi" ? hindiManualPolish(firstPass) : punjabiManualPolish(firstPass);
}

export function polishTmwCp006ManualOpening(
  source: TmwCp006GeneratedQuestion,
  opening: string,
  language: TmwLocalizedLanguage,
): string {
  if (source.solveMode === "findOriginalWorkforceFromChangedSchedule") {
    return language === "hi"
      ? "बदली कर्मचारी संख्या और वास्तविक दिनों का गुणन कुल काम देता है। उसे नियोजित दिनों से भाग देकर मूल कर्मचारी संख्या निकालें।"
      : "ਬਦਲੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਅਤੇ ਅਸਲ ਦਿਨਾਂ ਦਾ ਗੁਣਾ ਕੁੱਲ ਕੰਮ ਦਿੰਦਾ ਹੈ। ਇਸ ਨੂੰ ਯੋਜਿਤ ਦਿਨਾਂ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮੂਲ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਕੱਢੋ।";
  }
  if (source.solveMode === "findPercentWorkCompletedFromResourceHours") {
    return language === "hi"
      ? "पूरे काम के संसाधन-घंटे और उपयोग किए संसाधन-घंटे निकालें। दोनों का अनुपात लेकर 100 से गुणा करें।"
      : "ਪੂਰੇ ਕੰਮ ਦੇ ਸਰੋਤ-ਘੰਟੇ ਅਤੇ ਵਰਤੇ ਸਰੋਤ-ਘੰਟੇ ਕੱਢੋ। ਦੋਵਾਂ ਦਾ ਅਨੁਪਾਤ ਲੈ ਕੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।";
  }
  return polishTmwCp006ManualText(opening, language);
}

export function polishTmwCp006ManualGivens(
  source: TmwCp006GeneratedQuestion,
  givens: string[],
  language: TmwLocalizedLanguage,
): string[] {
  const p = source.parameters;
  if (source.solveMode === "findDimensionalWorkRatio" && p.dimensionsA && p.dimensionsB && p.dimensionLabels) {
    return language === "hi"
      ? [
          `मूल आयाम: ${cp006Dimensions(p.dimensionsA, p.dimensionLabels, language)}।`,
          `बदले आयाम: ${cp006Dimensions(p.dimensionsB, p.dimensionLabels, language)}।`,
        ].map((line) => polishTmwCp006ManualText(line, language))
      : [
          `ਮੂਲ ਮਾਪ: ${cp006Dimensions(p.dimensionsA, p.dimensionLabels, language)}।`,
          `ਬਦਲੇ ਮਾਪ: ${cp006Dimensions(p.dimensionsB, p.dimensionLabels, language)}।`,
        ].map((line) => polishTmwCp006ManualText(line, language));
  }
  if (source.solveMode === "findEquivalentResourceTime") {
    const durationUnit = p.context.resourceTimeUnit.endsWith("hours")
      ? language === "hi" ? "घंटे" : "ਘੰਟੇ"
      : language === "hi" ? "दिन" : "ਦਿਨ";
    return language === "hi"
      ? [
          `संसाधनों की संख्या: \\(N=${toLatex(p.stateA.resources)}\\)।`,
          `अवधि: \\(T=${toLatex(p.stateA.days)}\\) ${durationUnit}।`,
        ]
      : [
          `ਸਰੋਤਾਂ ਦੀ ਗਿਣਤੀ: \\(N=${toLatex(p.stateA.resources)}\\)।`,
          `ਮਿਆਦ: \\(T=${toLatex(p.stateA.days)}\\) ${durationUnit}।`,
        ];
  }
  return givens.map((line) => polishTmwCp006ManualText(line, language));
}

export function polishTmwCp006ManualTrap(
  source: TmwCp006GeneratedQuestion,
  trap: string,
  language: TmwLocalizedLanguage,
): string {
  const trapId = source.explanation.commonTrap.misconceptionId;
  if (source.solveMode === "findOvertimeHoursForDeadline" && trapId === "TOTAL_REPORTED_AS_CHANGE") {
    return language === "hi"
      ? "यह विकल्प कुल आवश्यक दैनिक घंटे देता है, जबकि प्रश्न नियमित घंटों से अधिक अतिरिक्त घंटे पूछता है।"
      : "ਇਹ ਚੋਣ ਕੁੱਲ ਲੋੜੀਂਦੇ ਰੋਜ਼ਾਨਾ ਘੰਟੇ ਦਿੰਦੀ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਨਿਯਮਤ ਘੰਟਿਆਂ ਤੋਂ ਵੱਧ ਵਾਧੂ ਘੰਟੇ ਪੁੱਛਦਾ ਹੈ।";
  }
  if (source.solveMode === "findEquivalentResourceTime" && trapId === "WORK_RATIO_OMITTED") {
    return language === "hi"
      ? "यह विकल्प संसाधनों की संख्या या कार्य-अवधि में से एक गुणक छोड़ देता है। समतुल्य संसाधन-समय के लिए दोनों का गुणन आवश्यक है।"
      : "ਇਹ ਚੋਣ ਸਰੋਤਾਂ ਦੀ ਗਿਣਤੀ ਜਾਂ ਕੰਮ ਮਿਆਦ ਵਿੱਚੋਂ ਇੱਕ ਗੁਣਕ ਛੱਡ ਦਿੰਦੀ ਹੈ। ਬਰਾਬਰ ਸਰੋਤ-ਸਮੇਂ ਲਈ ਦੋਵਾਂ ਦਾ ਗੁਣਾ ਲਾਜ਼ਮੀ ਹੈ।";
  }
  return polishTmwCp006ManualText(trap, language);
}

export function polishTmwCp006ManualConclusion(
  source: TmwCp006GeneratedQuestion,
  answerText: string,
  conclusion: string,
  language: TmwLocalizedLanguage,
): string {
  if (source.solveMode === "findWorkQuantity") {
    const feminineHindi = new Set(["copies", "bottles", "units"]);
    const femininePunjabi = new Set(["applications", "copies", "bottles", "units"]);
    if (language === "hi") {
      return `अतः नई व्यवस्था में कुल ${answerText} ${feminineHindi.has(source.parameters.context.outputUnit) ? "बनेंगी" : "बनेंगे"}।`;
    }
    return `ਇਸ ਲਈ ਨਵੀਂ ਵਿਵਸਥਾ ਵਿੱਚ ਕੁੱਲ ${answerText} ${femininePunjabi.has(source.parameters.context.outputUnit) ? "ਬਣਨਗੀਆਂ" : "ਬਣਨਗੇ"}।`;
  }
  if (source.solveMode === "findShiftCountForProductionTarget") {
    return language === "hi"
      ? `अतः लक्ष्य पूरा करने के लिए ${answerText} आवश्यक हैं।`
      : `ਇਸ ਲਈ ਟੀਚਾ ਪੂਰਾ ਕਰਨ ਲਈ ${answerText} ਲੋੜੀਂਦੀਆਂ ਹਨ।`;
  }
  return polishTmwCp006ManualText(conclusion, language);
}
