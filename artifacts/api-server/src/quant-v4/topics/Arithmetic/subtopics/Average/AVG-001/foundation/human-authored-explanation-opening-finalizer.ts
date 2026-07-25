import type { Avg001QuestionPackage } from "./types";

type Language = "en" | "hi" | "pa";

export const AVG_001_DIRECT_EXPLANATION_OPENING =
  "AVG-001 direct concept-first explanation opening v1";

const EN_PREFIXES = [
  "Begin with this fact",
  "Use this relation",
  "The key idea is simple",
  "Start from this relationship",
  "The calculation rests on this",
  "Connect the figures through this",
  "A direct solution uses this",
  "First note this",
  "This rule governs the calculation",
  "Keep this fact in view",
  "Use the data with this principle",
  "The numbers are linked by this",
  "A clean solution starts here",
  "The decisive relation is",
  "Work from this fact",
  "The arithmetic follows this rule",
  "Frame the calculation this way",
  "Use this as the starting point",
  "The method depends on this",
  "The useful observation is",
  "Organise the data around this",
  "The shortest valid route is",
  "Here is the controlling fact",
] as const;

const HI_PREFIXES = [
  "इस तथ्य से शुरू करें",
  "यह संबंध उपयोग करें",
  "मुख्य विचार सरल है",
  "इस संबंध से शुरुआत करें",
  "गणना इस तथ्य पर टिकी है",
  "आँकड़ों को इस नियम से जोड़ें",
  "सीधा हल इस विचार से मिलता है",
  "पहले यह ध्यान दें",
  "यही नियम गणना चलाता है",
  "इस तथ्य को ध्यान में रखें",
  "दिए मानों पर यह सिद्धांत लगाएँ",
  "संख्याएँ इस संबंध से जुड़ी हैं",
  "साफ हल यहाँ से शुरू होता है",
  "निर्णायक संबंध यह है",
  "इस तथ्य के आधार पर चलें",
  "गणना इस नियम का पालन करती है",
  "गणना को इस तरह लिखें",
  "इसे शुरुआती बिंदु बनाएँ",
  "विधि इस तथ्य पर निर्भर है",
  "उपयोगी निरीक्षण यह है",
  "आँकड़ों को इस विचार के अनुसार रखें",
  "सबसे सीधा सही तरीका है",
  "गणना को नियंत्रित करने वाला तथ्य है",
] as const;

const PA_PREFIXES = [
  "ਇਸ ਤੱਥ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ",
  "ਇਹ ਸੰਬੰਧ ਵਰਤੋ",
  "ਮੁੱਖ ਵਿਚਾਰ ਸੌਖਾ ਹੈ",
  "ਇਸ ਸੰਬੰਧ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ",
  "ਗਣਨਾ ਇਸ ਤੱਥ ਉੱਤੇ ਟਿਕੀ ਹੈ",
  "ਅੰਕੜਿਆਂ ਨੂੰ ਇਸ ਨਿਯਮ ਨਾਲ ਜੋੜੋ",
  "ਸਿੱਧਾ ਹੱਲ ਇਸ ਵਿਚਾਰ ਨਾਲ ਮਿਲਦਾ ਹੈ",
  "ਪਹਿਲਾਂ ਇਹ ਧਿਆਨ ਦਿਓ",
  "ਇਹੀ ਨਿਯਮ ਗਣਨਾ ਚਲਾਉਂਦਾ ਹੈ",
  "ਇਸ ਤੱਥ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖੋ",
  "ਦਿੱਤੇ ਮੁੱਲਾਂ ਉੱਤੇ ਇਹ ਸਿਧਾਂਤ ਲਗਾਓ",
  "ਸੰਖਿਆਵਾਂ ਇਸ ਸੰਬੰਧ ਨਾਲ ਜੁੜੀਆਂ ਹਨ",
  "ਸਾਫ਼ ਹੱਲ ਇੱਥੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ",
  "ਫੈਸਲਾਕੁਨ ਸੰਬੰਧ ਇਹ ਹੈ",
  "ਇਸ ਤੱਥ ਦੇ ਆਧਾਰ ਉੱਤੇ ਚਲੋ",
  "ਗਣਨਾ ਇਸ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਕਰਦੀ ਹੈ",
  "ਗਣਨਾ ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਲਿਖੋ",
  "ਇਸ ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਬਣਾਓ",
  "ਵਿਧੀ ਇਸ ਤੱਥ ਉੱਤੇ ਨਿਰਭਰ ਹੈ",
  "ਲਾਭਦਾਇਕ ਨਿਰੀਖਣ ਇਹ ਹੈ",
  "ਅੰਕੜਿਆਂ ਨੂੰ ਇਸ ਵਿਚਾਰ ਅਨੁਸਾਰ ਰੱਖੋ",
  "ਸਭ ਤੋਂ ਸਿੱਧਾ ਸਹੀ ਤਰੀਕਾ ਹੈ",
  "ਗਣਨਾ ਨੂੰ ਚਲਾਉਣ ਵਾਲਾ ਤੱਥ ਹੈ",
] as const;

function languageOf(pkg: Avg001QuestionPackage): Language {
  return pkg.language === "hi" || pkg.language === "pa" ? pkg.language : "en";
}

function capitaliseEnglish(value: string) {
  return value.length === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`;
}

function directOpening(line: string, language: Language) {
  const prefixes = language === "hi" ? HI_PREFIXES : language === "pa" ? PA_PREFIXES : EN_PREFIXES;
  const index = prefixes.findIndex((prefix) => line.startsWith(`${prefix}:`));
  if (index < 0) return line;

  const concept = line.slice(prefixes[index].length + 1).trim();
  return language === "en" ? capitaliseEnglish(concept) : concept;
}

export function finalizeAvg001ExplanationOpening(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const lines = [...pkg.explanation.lines];
  if (lines.length === 0) return pkg;

  const firstLine = directOpening(lines[0], languageOf(pkg));
  if (firstLine === lines[0]) return pkg;

  lines[0] = firstLine;
  return {
    ...pkg,
    explanation: {
      ...pkg.explanation,
      lines,
    },
  };
}
