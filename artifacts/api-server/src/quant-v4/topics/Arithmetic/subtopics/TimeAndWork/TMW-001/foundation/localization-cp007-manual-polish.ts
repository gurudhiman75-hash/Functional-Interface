import type { TmwCp007GeneratedQuestion } from "./cp007-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import { polishTmwCp007LocalizedText } from "./localization-cp007-polish";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const hindiOblique: readonly [string, string][] = [
  ["पुरुष श्रमिक", "पुरुष श्रमिकों"],
  ["महिला श्रमिक", "महिला श्रमिकों"],
  ["बाल श्रमिक", "बाल श्रमिकों"],
  ["कुशल श्रमिक", "कुशल श्रमिकों"],
  ["अकुशल श्रमिक", "अकुशल श्रमिकों"],
  ["प्रशिक्षु", "प्रशिक्षुओं"],
  ["वरिष्ठ क्लर्क", "वरिष्ठ क्लर्कों"],
  ["कनिष्ठ क्लर्क", "कनिष्ठ क्लर्कों"],
  ["सहायक", "सहायकों"],
  ["मुख्य पेंटर", "मुख्य पेंटरों"],
  ["पेंटर", "पेंटरों"],
  ["सहायक श्रमिक", "सहायक श्रमिकों"],
  ["तेज़ प्रिंटर", "तेज़ प्रिंटरों"],
  ["मानक प्रिंटर", "मानक प्रिंटरों"],
  ["डेस्कटॉप प्रिंटर", "डेस्कटॉप प्रिंटरों"],
  ["भारी मशीनें", "भारी मशीनों"],
  ["मानक मशीनें", "मानक मशीनों"],
  ["छोटी मशीनें", "छोटी मशीनों"],
  ["तेज़ मशीनें", "तेज़ मशीनों"],
  ["स्वचालित बोतल लाइनें", "स्वचालित बोतल लाइनों"],
  ["अर्ध-स्वचालित बोतल लाइनें", "अर्ध-स्वचालित बोतल लाइनों"],
  ["हाथ से चलने वाले स्टेशन", "हाथ से चलने वाले स्टेशनों"],
];

const punjabiOblique: readonly [string, string][] = [
  ["ਮਰਦ ਮਜ਼ਦੂਰ", "ਮਰਦ ਮਜ਼ਦੂਰਾਂ"],
  ["ਮਹਿਲਾ ਮਜ਼ਦੂਰ", "ਮਹਿਲਾ ਮਜ਼ਦੂਰਾਂ"],
  ["ਬਾਲ ਮਜ਼ਦੂਰ", "ਬਾਲ ਮਜ਼ਦੂਰਾਂ"],
  ["ਕੁਸ਼ਲ ਮਜ਼ਦੂਰ", "ਕੁਸ਼ਲ ਮਜ਼ਦੂਰਾਂ"],
  ["ਅਕੁਸ਼ਲ ਮਜ਼ਦੂਰ", "ਅਕੁਸ਼ਲ ਮਜ਼ਦੂਰਾਂ"],
  ["ਸਿਖਿਆਰਥੀ", "ਸਿਖਿਆਰਥੀਆਂ"],
  ["ਸੀਨੀਅਰ ਕਲਰਕ", "ਸੀਨੀਅਰ ਕਲਰਕਾਂ"],
  ["ਜੂਨੀਅਰ ਕਲਰਕ", "ਜੂਨੀਅਰ ਕਲਰਕਾਂ"],
  ["ਸਹਾਇਕ", "ਸਹਾਇਕਾਂ"],
  ["ਮੁੱਖ ਪੇਂਟਰ", "ਮੁੱਖ ਪੇਂਟਰਾਂ"],
  ["ਪੇਂਟਰ", "ਪੇਂਟਰਾਂ"],
  ["ਸਹਾਇਕ ਮਜ਼ਦੂਰ", "ਸਹਾਇਕ ਮਜ਼ਦੂਰਾਂ"],
  ["ਤੇਜ਼ ਪ੍ਰਿੰਟਰ", "ਤੇਜ਼ ਪ੍ਰਿੰਟਰਾਂ"],
  ["ਮਿਆਰੀ ਪ੍ਰਿੰਟਰ", "ਮਿਆਰੀ ਪ੍ਰਿੰਟਰਾਂ"],
  ["ਡੈਸਕਟਾਪ ਪ੍ਰਿੰਟਰ", "ਡੈਸਕਟਾਪ ਪ੍ਰਿੰਟਰਾਂ"],
  ["ਭਾਰੀ ਮਸ਼ੀਨਾਂ", "ਭਾਰੀ ਮਸ਼ੀਨਾਂ"],
  ["ਮਿਆਰੀ ਮਸ਼ੀਨਾਂ", "ਮਿਆਰੀ ਮਸ਼ੀਨਾਂ"],
  ["ਛੋਟੀਆਂ ਮਸ਼ੀਨਾਂ", "ਛੋਟੀਆਂ ਮਸ਼ੀਨਾਂ"],
  ["ਤੇਜ਼ ਮਸ਼ੀਨਾਂ", "ਤੇਜ਼ ਮਸ਼ੀਨਾਂ"],
  ["ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ", "ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ"],
  ["ਅਰਧ-ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ", "ਅਰਧ-ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ"],
  ["ਹੱਥ ਨਾਲ ਚੱਲਣ ਵਾਲੇ ਸਟੇਸ਼ਨ", "ਹੱਥ ਨਾਲ ਚੱਲਣ ਵਾਲੇ ਸਟੇਸ਼ਨਾਂ"],
];

function inflectCountPostpositions(
  text: string,
  forms: readonly [string, string][],
  postpositions: string,
): string {
  let output = text;
  for (const [base, oblique] of forms) {
    output = output.replace(
      new RegExp(`((?:[2-9]|\\d{2,})) ${escapeRegExp(base)} (${postpositions})`, "g"),
      `$1 ${oblique} $2`,
    );
  }
  return output;
}

function hindiPolish(text: string): string {
  let output = text
    .replace(/का काम का/g, "के काम का")
    .replace(/का काम को/g, "के काम को")
    .replace(/का काम पर/g, "के काम पर")
    .replace(/कार्य-इकाइयाँ का/g, "कार्य-इकाइयों का")
    .replace(/कार्य-इकाइयाँ को/g, "कार्य-इकाइयों को")
    .replace(/प्रतियाँ का/g, "प्रतियों का")
    .replace(/प्रतियाँ को/g, "प्रतियों को")
    .replace(/बोतलें का/g, "बोतलों का")
    .replace(/बोतलें को/g, "बोतलों को")
    .replace(/फाइलें का/g, "फाइलों का")
    .replace(/फाइलें को/g, "फाइलों को")
    .replace(/पुर्ज़े का/g, "पुर्ज़ों का")
    .replace(/पुर्ज़े को/g, "पुर्ज़ों को")
    .replace(/कितने अतिरिक्त (स्वचालित|अर्ध-स्वचालित) बोतल लाइनें/g, "कितनी अतिरिक्त $1 बोतल लाइनें")
    .replace(/लक्ष्य श्रेणी का संख्या/g, "लक्ष्य श्रेणी की संख्या")
    .replace(/(कार्य-इकाइयाँ|प्रतियाँ|बोतलें|फाइलें) ([^।;]+) पूरे होते हैं/g, "$1 $2 पूरी होती हैं")
    .replace(/(भारी मशीनें|मानक मशीनें|छोटी मशीनें|तेज़ मशीनें|स्वचालित बोतल लाइनें|अर्ध-स्वचालित बोतल लाइनें)([^।]{0,160}) एक साथ काम करते हैं/g, "$1$2 एक साथ काम करती हैं")
    .replace(/^अतः उत्तर (.+) है।$/g, "अतः उत्तर: $1।");
  output = inflectCountPostpositions(output, hindiOblique, "की|के|को|ने|से|का");
  return output;
}

function punjabiPolish(text: string): string {
  let output = text
    .replace(/ਦਾ ਕੰਮ ਦਾ/g, "ਦੇ ਕੰਮ ਦਾ")
    .replace(/ਦਾ ਕੰਮ ਨੂੰ/g, "ਦੇ ਕੰਮ ਨੂੰ")
    .replace(/ਦਾ ਕੰਮ ਉੱਤੇ/g, "ਦੇ ਕੰਮ ਉੱਤੇ")
    .replace(/ਕਿੰਨੇ ਵਾਧੂ (ਆਟੋਮੈਟਿਕ|ਅਰਧ-ਆਟੋਮੈਟਿਕ) ਬੋਤਲ ਲਾਈਨਾਂ/g, "ਕਿੰਨੀਆਂ ਵਾਧੂ $1 ਬੋਤਲ ਲਾਈਨਾਂ")
    .replace(/(ਕੰਮ-ਇਕਾਈਆਂ|ਕਾਪੀਆਂ|ਬੋਤਲਾਂ|ਫਾਈਲਾਂ) ([^।;]+) ਪੂਰੇ ਹੁੰਦੇ ਹਨ/g, "$1 $2 ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ")
    .replace(/(ਭਾਰੀ ਮਸ਼ੀਨਾਂ|ਮਿਆਰੀ ਮਸ਼ੀਨਾਂ|ਛੋਟੀਆਂ ਮਸ਼ੀਨਾਂ|ਤੇਜ਼ ਮਸ਼ੀਨਾਂ|ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ|ਅਰਧ-ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ)([^।]{0,160}) ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ/g, "$1$2 ਇਕੱਠੇ ਕੰਮ ਕਰਦੀਆਂ ਹਨ")
    .replace(/^ਇਸ ਲਈ ਉੱਤਰ (.+) ਹੈ।$/g, "ਇਸ ਲਈ ਉੱਤਰ: $1।");
  output = inflectCountPostpositions(output, punjabiOblique, "ਦੀ|ਦੇ|ਨੂੰ|ਨੇ|ਤੋਂ|ਦਾ");
  return output;
}

export function polishTmwCp007ManualText(
  text: string,
  language: TmwLocalizedLanguage,
): string {
  const firstPass = polishTmwCp007LocalizedText(text, language);
  return language === "hi" ? hindiPolish(firstPass) : punjabiPolish(firstPass);
}

export function polishTmwCp007ManualGivens(
  source: TmwCp007GeneratedQuestion,
  givens: string[],
  language: TmwLocalizedLanguage,
): string[] {
  if (source.solveMode === "findCrewCompositionFromTwoOutputFacts") {
    const p = source.parameters;
    const output = language === "hi" ? "कार्य/उत्पादन" : "ਕੰਮ/ਉਤਪਾਦਨ";
    return language === "hi"
      ? [
          `पहला तथ्य: ${source.solution.formulaLatex.includes("xe_A") ? "पहली टीम" : output}, ${p.daysA.numerator}/${p.daysA.denominator === 1 ? "1" : p.daysA.denominator} दिन का अभिलेख।`,
          `दूसरा तथ्य: पहली श्रेणी की संख्या दोगुनी; ${p.daysB.numerator}/${p.daysB.denominator === 1 ? "1" : p.daysB.denominator} दिन का अभिलेख।`,
        ].map((line) => line.replace(/\/1 दिन/g, " दिन"))
      : [
          `ਪਹਿਲਾ ਤੱਥ: ਪਹਿਲੀ ਟੀਮ ਦਾ ${p.daysA.numerator}/${p.daysA.denominator === 1 ? "1" : p.daysA.denominator} ਦਿਨਾਂ ਦਾ ਰਿਕਾਰਡ।`,
          `ਦੂਜਾ ਤੱਥ: ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ ਦੁੱਗਣੀ; ${p.daysB.numerator}/${p.daysB.denominator === 1 ? "1" : p.daysB.denominator} ਦਿਨਾਂ ਦਾ ਰਿਕਾਰਡ।`,
        ].map((line) => line.replace(/\/1 ਦਿਨਾਂ/g, " ਦਿਨਾਂ"));
  }
  return givens.map((line) => polishTmwCp007ManualText(line, language));
}

export function polishTmwCp007ManualConclusion(
  source: TmwCp007GeneratedQuestion,
  answerText: string,
  conclusion: string,
  language: TmwLocalizedLanguage,
): string {
  if (source.solution.answerType === "COUNT") {
    return language === "hi"
      ? `अतः आवश्यक संख्या: ${answerText}।`
      : `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਗਿਣਤੀ: ${answerText}।`;
  }
  if (source.solution.answerType === "WORK") {
    return language === "hi"
      ? `अतः कुल उत्पादन: ${answerText}।`
      : `ਇਸ ਲਈ ਕੁੱਲ ਉਤਪਾਦਨ: ${answerText}।`;
  }
  if (source.solution.answerType === "RESOURCE_TIME") {
    return language === "hi"
      ? `अतः संयुक्त योगदान ${answerText} के बराबर है।`
      : `ਇਸ ਲਈ ਸਾਂਝਾ ਯੋਗਦਾਨ ${answerText} ਦੇ ਬਰਾਬਰ ਹੈ।`;
  }
  return polishTmwCp007ManualText(conclusion, language);
}
