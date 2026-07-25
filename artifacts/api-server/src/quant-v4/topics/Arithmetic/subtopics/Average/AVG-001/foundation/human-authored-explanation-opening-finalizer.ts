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

const EN_CONTINUATIONS = [
  "",
  " The quantities match this equality.",
  " This relation governs the question.",
  " The figures fit this relation.",
  " All quantities stay aligned.",
  " The data remain consistent.",
  " This fixes the unknown value.",
  " The unknown satisfies this equality.",
  " The supplied data balance.",
  " The stated values follow it.",
  " This preserves the quantity link.",
  " The numbers obey this rule.",
  " This gives the unknown directly.",
  " This fixes the required quantity.",
  " The data match this structure.",
  " This equality must hold.",
  " Known and unknown values align.",
  " The data preserve this balance.",
  " This controls the unknown.",
  " The information supports it.",
  " This captures the condition.",
  " The answer must satisfy it.",
  " This is the exact relation.",
] as const;

const HI_CONTINUATIONS = [
  "",
  " दिए मान इसी समानता से जुड़े हैं।",
  " यही प्रश्न का मुख्य संबंध है।",
  " आँकड़े इसी संबंध से मेल खाते हैं।",
  " सभी राशियाँ एक आधार पर हैं।",
  " आँकड़े परस्पर संगत हैं।",
  " यही अज्ञात मान तय करता है।",
  " अज्ञात मान यही समानता संतुष्ट करता है।",
  " दिए आँकड़े संतुलित हैं।",
  " दिए मान इसी का पालन करते हैं।",
  " राशियों का संबंध बना रहता है।",
  " संख्याएँ इसी नियम से जुड़ी हैं।",
  " अज्ञात मान सीधे मिलता है।",
  " आवश्यक राशि इसी से तय है।",
  " आँकड़े इसी संरचना से मेल खाते हैं।",
  " यही समानता बनी रहनी चाहिए।",
  " ज्ञात और अज्ञात मान जुड़े हैं।",
  " आँकड़े यही संतुलन बनाए रखते हैं।",
  " यही अज्ञात मान नियंत्रित करता है।",
  " दी गई जानकारी इसका समर्थन करती है।",
  " यही पूरी शर्त व्यक्त करता है।",
  " उत्तर को यही संबंध संतुष्ट करना है।",
  " यही सटीक संबंध है।",
] as const;

const PA_CONTINUATIONS = [
  "",
  " ਦਿੱਤੇ ਮੁੱਲ ਇਸੇ ਬਰਾਬਰੀ ਨਾਲ ਜੁੜੇ ਹਨ।",
  " ਇਹੀ ਸਵਾਲ ਦਾ ਮੁੱਖ ਸੰਬੰਧ ਹੈ।",
  " ਅੰਕੜੇ ਇਸੇ ਸੰਬੰਧ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਹਨ।",
  " ਸਾਰੀਆਂ ਰਾਸ਼ੀਆਂ ਇੱਕੋ ਆਧਾਰ ਉੱਤੇ ਹਨ।",
  " ਅੰਕੜੇ ਆਪਸ ਵਿੱਚ ਸੰਗਤ ਹਨ।",
  " ਇਹੀ ਅਣਜਾਣ ਮੁੱਲ ਤੈਅ ਕਰਦਾ ਹੈ।",
  " ਅਣਜਾਣ ਮੁੱਲ ਇਹੀ ਬਰਾਬਰੀ ਪੂਰੀ ਕਰਦਾ ਹੈ।",
  " ਦਿੱਤੇ ਅੰਕੜੇ ਸੰਤੁਲਿਤ ਹਨ।",
  " ਦਿੱਤੇ ਮੁੱਲ ਇਸੇ ਦੀ ਪਾਲਣਾ ਕਰਦੇ ਹਨ।",
  " ਰਾਸ਼ੀਆਂ ਦਾ ਸੰਬੰਧ ਬਣਿਆ ਰਹਿੰਦਾ ਹੈ।",
  " ਸੰਖਿਆਵਾਂ ਇਸੇ ਨਿਯਮ ਨਾਲ ਜੁੜੀਆਂ ਹਨ।",
  " ਅਣਜਾਣ ਮੁੱਲ ਸਿੱਧਾ ਮਿਲਦਾ ਹੈ।",
  " ਲੋੜੀਂਦੀ ਰਾਸ਼ੀ ਇਸੇ ਨਾਲ ਤੈਅ ਹੈ।",
  " ਅੰਕੜੇ ਇਸੇ ਬਣਤਰ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਹਨ।",
  " ਇਹੀ ਬਰਾਬਰੀ ਕਾਇਮ ਰਹਿਣੀ ਚਾਹੀਦੀ ਹੈ।",
  " ਜਾਣੇ ਅਤੇ ਅਣਜਾਣ ਮੁੱਲ ਜੁੜੇ ਹਨ।",
  " ਅੰਕੜੇ ਇਹੀ ਸੰਤੁਲਨ ਕਾਇਮ ਰੱਖਦੇ ਹਨ।",
  " ਇਹੀ ਅਣਜਾਣ ਮੁੱਲ ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਦਾ ਹੈ।",
  " ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਇਸ ਦਾ ਸਮਰਥਨ ਕਰਦੀ ਹੈ।",
  " ਇਹੀ ਪੂਰੀ ਸ਼ਰਤ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ।",
  " ਜਵਾਬ ਨੂੰ ਇਹੀ ਸੰਬੰਧ ਪੂਰਾ ਕਰਨਾ ਹੈ।",
  " ਇਹੀ ਸਟੀਕ ਸੰਬੰਧ ਹੈ।",
] as const;

function languageOf(pkg: Avg001QuestionPackage): Language {
  return pkg.language === "hi" || pkg.language === "pa" ? pkg.language : "en";
}

function capitaliseEnglish(value: string) {
  return value.length === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`;
}

function directOpening(line: string, language: Language) {
  const prefixes = language === "hi" ? HI_PREFIXES : language === "pa" ? PA_PREFIXES : EN_PREFIXES;
  const continuations = language === "hi" ? HI_CONTINUATIONS : language === "pa" ? PA_CONTINUATIONS : EN_CONTINUATIONS;

  const index = prefixes.findIndex((prefix) => line.startsWith(`${prefix}:`));
  if (index < 0) return line;

  const concept = line.slice(prefixes[index].length + 1).trim();
  const directConcept = language === "en" ? capitaliseEnglish(concept) : concept;
  return `${directConcept}${continuations[index]}`;
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
