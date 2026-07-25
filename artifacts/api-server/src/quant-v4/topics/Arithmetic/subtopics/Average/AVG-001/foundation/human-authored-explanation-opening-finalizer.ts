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
  " The stated quantities are linked by this equality.",
  " This is the central numerical relationship in the question.",
  " The given figures fit this relationship directly.",
  " This keeps every quantity on the same numerical basis.",
  " The data therefore form one consistent calculation.",
  " This relation determines the required value.",
  " The unknown must satisfy this equality.",
  " This is the balance represented by the supplied data.",
  " The values in the question follow this relationship.",
  " The calculation preserves this connection among the quantities.",
  " The stated numbers are connected through this rule.",
  " This gives the direct numerical path to the unknown.",
  " The required quantity is fixed by this relation.",
  " This relationship matches the structure of the given data.",
  " The arithmetic must preserve this equality.",
  " This places the known and unknown quantities in one relation.",
  " The stated data correspond to this numerical balance.",
  " This relation controls the value of the unknown.",
  " The given information is consistent with this statement.",
  " This equality captures the whole numerical condition.",
  " The answer must satisfy this relationship.",
  " This is the exact relation encoded by the question.",
] as const;

const HI_CONTINUATIONS = [
  "",
  " दिए गए मान इसी समानता से जुड़े हैं।",
  " प्रश्न का मुख्य संख्यात्मक संबंध यही है।",
  " दिए गए आँकड़े सीधे इसी संबंध में बैठते हैं।",
  " इससे सभी राशियाँ एक ही संख्यात्मक आधार पर रहती हैं।",
  " इसलिए दिए गए आँकड़े एक संगत गणना बनाते हैं।",
  " यही संबंध आवश्यक मान निर्धारित करता है।",
  " अज्ञात मान को यही समानता संतुष्ट करनी होगी।",
  " दिए गए आँकड़ों का संतुलन इसी से बनता है।",
  " प्रश्न में दिए मान इसी संबंध का पालन करते हैं।",
  " गणना में राशियों के बीच यही संबंध बना रहता है।",
  " दिए गए अंक इसी नियम से जुड़े हैं।",
  " अज्ञात मान तक पहुँचने का सीधा संख्यात्मक मार्ग यही है।",
  " आवश्यक राशि इसी संबंध से निश्चित होती है।",
  " यह संबंध दिए गए आँकड़ों की संरचना से मेल खाता है।",
  " अंकगणित में यही समानता बनाए रखनी होती है।",
  " इससे ज्ञात और अज्ञात राशियाँ एक ही संबंध में आ जाती हैं।",
  " दिए गए आँकड़े इसी संख्यात्मक संतुलन के अनुरूप हैं।",
  " अज्ञात मान का मूल्य यही संबंध नियंत्रित करता है।",
  " दी गई जानकारी इसी कथन के अनुरूप है।",
  " पूरी संख्यात्मक शर्त इसी समानता में व्यक्त होती है।",
  " उत्तर को इसी संबंध को संतुष्ट करना होगा।",
  " प्रश्न में निहित सटीक संबंध यही है।",
] as const;

const PA_CONTINUATIONS = [
  "",
  " ਦਿੱਤੀਆਂ ਰਾਸ਼ੀਆਂ ਇਸੇ ਬਰਾਬਰੀ ਨਾਲ ਜੁੜੀਆਂ ਹਨ।",
  " ਸਵਾਲ ਦਾ ਮੁੱਖ ਸੰਖਿਆਤਮਕ ਸੰਬੰਧ ਇਹੀ ਹੈ।",
  " ਦਿੱਤੇ ਅੰਕੜੇ ਸਿੱਧੇ ਇਸੇ ਸੰਬੰਧ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਹਨ।",
  " ਇਸ ਨਾਲ ਸਾਰੀਆਂ ਰਾਸ਼ੀਆਂ ਇੱਕੋ ਸੰਖਿਆਤਮਕ ਆਧਾਰ ਉੱਤੇ ਰਹਿੰਦੀਆਂ ਹਨ।",
  " ਇਸ ਲਈ ਦਿੱਤੇ ਅੰਕੜੇ ਇੱਕ ਸੰਗਤ ਗਣਨਾ ਬਣਾਉਂਦੇ ਹਨ।",
  " ਇਹੀ ਸੰਬੰਧ ਲੋੜੀਂਦਾ ਮੁੱਲ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ।",
  " ਅਣਜਾਣ ਮੁੱਲ ਨੂੰ ਇਹੀ ਬਰਾਬਰੀ ਪੂਰੀ ਕਰਨੀ ਹੋਵੇਗੀ।",
  " ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਦਾ ਸੰਤੁਲਨ ਇਸੇ ਨਾਲ ਬਣਦਾ ਹੈ।",
  " ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੇ ਮੁੱਲ ਇਸੇ ਸੰਬੰਧ ਦੀ ਪਾਲਣਾ ਕਰਦੇ ਹਨ।",
  " ਗਣਨਾ ਵਿੱਚ ਰਾਸ਼ੀਆਂ ਵਿਚਕਾਰ ਇਹੀ ਸੰਬੰਧ ਬਣਿਆ ਰਹਿੰਦਾ ਹੈ।",
  " ਦਿੱਤੀਆਂ ਸੰਖਿਆਵਾਂ ਇਸੇ ਨਿਯਮ ਨਾਲ ਜੁੜੀਆਂ ਹਨ।",
  " ਅਣਜਾਣ ਮੁੱਲ ਤੱਕ ਪਹੁੰਚਣ ਦਾ ਸਿੱਧਾ ਸੰਖਿਆਤਮਕ ਰਸਤਾ ਇਹੀ ਹੈ।",
  " ਲੋੜੀਂਦੀ ਰਾਸ਼ੀ ਇਸੇ ਸੰਬੰਧ ਨਾਲ ਨਿਰਧਾਰਤ ਹੁੰਦੀ ਹੈ।",
  " ਇਹ ਸੰਬੰਧ ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਦੀ ਬਣਤਰ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।",
  " ਹਿਸਾਬ ਵਿੱਚ ਇਹੀ ਬਰਾਬਰੀ ਕਾਇਮ ਰੱਖਣੀ ਹੁੰਦੀ ਹੈ।",
  " ਇਸ ਨਾਲ ਜਾਣੀਆਂ ਅਤੇ ਅਣਜਾਣ ਰਾਸ਼ੀਆਂ ਇੱਕੋ ਸੰਬੰਧ ਵਿੱਚ ਆ ਜਾਂਦੀਆਂ ਹਨ।",
  " ਦਿੱਤੇ ਅੰਕੜੇ ਇਸੇ ਸੰਖਿਆਤਮਕ ਸੰਤੁਲਨ ਦੇ ਅਨੁਕੂਲ ਹਨ।",
  " ਅਣਜਾਣ ਮੁੱਲ ਨੂੰ ਇਹੀ ਸੰਬੰਧ ਨਿਯੰਤਰਿਤ ਕਰਦਾ ਹੈ।",
  " ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਇਸੇ ਕਥਨ ਦੇ ਅਨੁਕੂਲ ਹੈ।",
  " ਪੂਰੀ ਸੰਖਿਆਤਮਕ ਸ਼ਰਤ ਇਸੇ ਬਰਾਬਰੀ ਵਿੱਚ ਪ੍ਰਗਟ ਹੁੰਦੀ ਹੈ।",
  " ਜਵਾਬ ਨੂੰ ਇਹੀ ਸੰਬੰਧ ਪੂਰਾ ਕਰਨਾ ਹੋਵੇਗਾ।",
  " ਸਵਾਲ ਵਿੱਚ ਮੌਜੂਦ ਸਟੀਕ ਸੰਬੰਧ ਇਹੀ ਹੈ।",
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
