import type { Avg001QuestionPackage } from "./types";

const HI_CONTINUATIONS = [
  "",
  " दिए मान इसी समानता से जुड़े हैं।",
  " यही प्रश्न का मुख्य संबंध है।",
  " आँकड़े इसी संबंध से मेल खाते हैं।",
  " सभी राशियाँ एक आधार पर हैं।",
  " आँकड़े परस्पर संगत हैं।",
  " यही अज्ञात मान निर्धारित करता है।",
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
  " ਇਹੀ ਅਣਜਾਣ ਮੁੱਲ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ।",
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

export function finalizeAvg001LocalizedExplanationOpeningVariant(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const lines = [...pkg.explanation.lines];
  if (lines.length === 0 || (pkg.language !== "hi" && pkg.language !== "pa")) return pkg;

  const continuations = pkg.language === "hi" ? HI_CONTINUATIONS : PA_CONTINUATIONS;
  const variant = Number(pkg.traceability.explanationOpeningVariant);
  if (!Number.isInteger(variant) || variant < 0 || variant >= continuations.length) return pkg;

  if (continuations.some((continuation) => continuation && lines[0].endsWith(continuation))) return pkg;

  const continuation = continuations[variant];
  if (!continuation) return pkg;

  lines[0] = `${lines[0]}${continuation}`;
  return {
    ...pkg,
    explanation: {
      ...pkg.explanation,
      lines,
    },
  };
}
