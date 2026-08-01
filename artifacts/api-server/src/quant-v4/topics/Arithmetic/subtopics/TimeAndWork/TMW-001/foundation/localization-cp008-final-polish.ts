import { tmwCp008ContributionVector } from "./cp008-engine";
import type { TmwCp008GeneratedQuestion } from "./cp008-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp008Number,
} from "./localization-cp008-language";

function pair(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

export function finalizeTmwCp008FinalText(
  text: string,
  language: TmwLocalizedLanguage,
): string {
  if (language === "hi") {
    return text
      .replace(/भुगतान पाने वाला:/g, "भुगतान के लिए चुने गए नाम:")
      .replace(/चुने योगदान को/g, "चुने व्यक्ति या समूह के योगदान को")
      .replace(/श्रेणी योगदान अनुपात/g, "श्रेणियों का योगदान अनुपात")
      .replace(/तीनों श्रेणी योगदान/g, "तीनों श्रेणियों के योगदान")
      .replace(/बोनस पूल:/g, "बोनस राशि:")
      .replace(/भुगतान पूल:/g, "भुगतान राशि:")
      .replace(/यह विकल्प पहले से दिए भुगतान कुल राशि से नहीं घटाता।/g, "यह विकल्प पहले से दिए भुगतानों को कुल राशि से नहीं घटाता।")
      .replace(/स्वीकृत कार्य-मात्रा:/g, "स्वीकृत काम की मात्रा:")
      .replace(/अस्वीकृत\/पुनःकार्य/g, "अस्वीकृत या पुनःकार्य")
      .replace(/अतिरिक्त योगदान-भार/g, "अतिरिक्त योगदान");
  }
  return text
    .replace(/ਭੁਗਤਾਨ ਲੈਣ ਵਾਲਾ:/g, "ਭੁਗਤਾਨ ਲਈ ਚੁਣੇ ਨਾਮ:")
    .replace(/ਚੁਣੇ ਯੋਗਦਾਨ ਨੂੰ/g, "ਚੁਣੇ ਵਿਅਕਤੀ ਜਾਂ ਸਮੂਹ ਦੇ ਯੋਗਦਾਨ ਨੂੰ")
    .replace(/ਸ਼੍ਰੇਣੀ ਯੋਗਦਾਨ ਅਨੁਪਾਤ/g, "ਸ਼੍ਰੇਣੀਆਂ ਦਾ ਯੋਗਦਾਨ ਅਨੁਪਾਤ")
    .replace(/ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀ ਯੋਗਦਾਨ/g, "ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਯੋਗਦਾਨ")
    .replace(/ਬੋਨਸ ਪੂਲ:/g, "ਬੋਨਸ ਰਕਮ:")
    .replace(/ਭੁਗਤਾਨ ਪੂਲ:/g, "ਭੁਗਤਾਨ ਰਕਮ:")
    .replace(/ਇਹ ਚੋਣ ਪਹਿਲਾਂ ਦਿੱਤੇ ਭੁਗਤਾਨ ਕੁੱਲ ਰਕਮ ਵਿੱਚੋਂ ਨਹੀਂ ਘਟਾਉਂਦੀ।/g, "ਇਹ ਚੋਣ ਪਹਿਲਾਂ ਦਿੱਤੇ ਭੁਗਤਾਨਾਂ ਨੂੰ ਕੁੱਲ ਰਕਮ ਵਿੱਚੋਂ ਨਹੀਂ ਘਟਾਉਂਦੀ।")
    .replace(/ਮਨਜ਼ੂਰ ਕੰਮ-ਮਾਤਰਾ:/g, "ਮਨਜ਼ੂਰ ਕੰਮ ਦੀ ਮਾਤਰਾ:")
    .replace(/ਰੱਦ\/ਮੁੜ-ਕੰਮ/g, "ਰੱਦ ਜਾਂ ਮੁੜ-ਕੰਮ")
    .replace(/ਵਾਧੂ ਯੋਗਦਾਨ-ਭਾਰ/g, "ਵਾਧੂ ਯੋਗਦਾਨ");
}

export function finalizeTmwCp008FinalStem(
  source: TmwCp008GeneratedQuestion,
  stem: string,
  language: TmwLocalizedLanguage,
): string {
  let output = finalizeTmwCp008FinalText(stem, language);
  if (source.solveMode === "findResidualPayment") {
    if (language === "hi") {
      return output
        .replace(/^.*?के लिए कुल राशि (₹[^।\s]+) निर्धारित है।\s*/, "कुल राशि $1 निर्धारित है। ")
        .replace(/^.*?के लिए कुल (₹[^।\s]+) निर्धारित हैं।\s*/, "कुल राशि $1 निर्धारित है। ");
    }
    return output
      .replace(/^.*?ਲਈ ਕੁੱਲ ਰਕਮ (₹[^।\s]+) ਨਿਰਧਾਰਤ ਹੈ।\s*/, "ਕੁੱਲ ਰਕਮ $1 ਨਿਰਧਾਰਤ ਹੈ। ")
      .replace(/^.*?ਲਈ ਕੁੱਲ (₹[^।\s]+) ਨਿਰਧਾਰਤ ਹਨ।\s*/, "ਕੁੱਲ ਰਕਮ $1 ਨਿਰਧਾਰਤ ਹੈ। ");
  }
  if (language === "pa" && source.solveMode === "findMissingTimeFromPayment") {
    output = output
      .replace(/ਉਨ੍ਹਾਂ ਦੀ ਦਰ /g, "ਉਨ੍ਹਾਂ ਦੀਆਂ ਦਰਾਂ ")
      .replace(/ ਹੈ ਅਤੇ ਰੋਜ਼ਾਨਾ ਘੰਟੇ ਇੱਕੋ ਹਨ/g, " ਹਨ ਅਤੇ ਰੋਜ਼ਾਨਾ ਘੰਟੇ ਇੱਕੋ ਹਨ");
  }
  if (language === "pa" && source.solveMode === "findMixedCategoryPaymentDistribution") {
    output = output
      .replace(/ਉਨ੍ਹਾਂ ਦੀ ਵਿਅਕਤੀਗਤ ਦਰ ਕ੍ਰਮਵਾਰ/g, "ਉਨ੍ਹਾਂ ਦੀਆਂ ਵਿਅਕਤੀਗਤ ਦਰਾਂ ਕ੍ਰਮਵਾਰ")
      .replace(/ ਹੈ; ਸਭ ਨੇ/g, " ਹਨ; ਸਭ ਨੇ");
  }
  return output;
}

export function finalizeTmwCp008FinalGivens(
  givens: string[],
  language: TmwLocalizedLanguage,
): string[] {
  return givens.map((given) => finalizeTmwCp008FinalText(given, language));
}

export function finalizeTmwCp008FinalShortcut(
  source: TmwCp008GeneratedQuestion,
  shortcut: { title: string; steps: string[] },
  answerText: string,
  language: TmwLocalizedLanguage,
): { title: string; steps: string[] } {
  if (source.solveMode === "findBonusShareFromExtraContribution") {
    const target = source.parameters.targetIndex ?? 0;
    const weight = tmwCp008ContributionVector(source.parameters)[target];
    return {
      title: finalizeTmwCp008FinalText(shortcut.title, language),
      steps: [
        pair(language, "हर व्यक्ति के वास्तविक उत्पादन में से उसका लक्ष्य घटाएँ।", "ਹਰ ਵਿਅਕਤੀ ਦੇ ਅਸਲ ਉਤਪਾਦਨ ਵਿੱਚੋਂ ਉਸ ਦਾ ਟੀਚਾ ਘਟਾਓ।"),
        pair(
          language,
          `लक्षित व्यक्ति का अतिरिक्त योगदान ${cp008Number(weight)} इकाई है। बोनस अनुपात से उत्तर ${answerText}।`,
          `ਟੀਚਾ ਵਿਅਕਤੀ ਦਾ ਵਾਧੂ ਯੋਗਦਾਨ ${cp008Number(weight)} ਇਕਾਈ ਹੈ। ਬੋਨਸ ਅਨੁਪਾਤ ਤੋਂ ਉੱਤਰ ${answerText}।`,
        ),
      ],
    };
  }
  return {
    title: finalizeTmwCp008FinalText(shortcut.title, language),
    steps: shortcut.steps.map((step) => finalizeTmwCp008FinalText(step, language)),
  };
}

export function finalizeTmwCp008FinalTrap(
  explanation: string,
  language: TmwLocalizedLanguage,
): string {
  return finalizeTmwCp008FinalText(explanation, language);
}

export function finalizeTmwCp008FinalConclusion(
  conclusion: string,
  language: TmwLocalizedLanguage,
): string {
  return finalizeTmwCp008FinalText(conclusion, language);
}
