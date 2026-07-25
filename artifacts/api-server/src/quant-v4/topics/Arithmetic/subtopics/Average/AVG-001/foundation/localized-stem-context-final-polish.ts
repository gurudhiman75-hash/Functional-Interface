import type { Avg001QuestionPackage } from "./types";

type PilotLanguage = "hi" | "pa";

function cp001FinalPolish(stem: string, id: number, language: PilotLanguage) {
  if (language === "hi") {
    if (id === 30) {
      return stem.replace(/एक छात्रावास भोजन पर (\d+ दिनों तक)/, "एक छात्रावास $1 भोजन पर");
    }
    if (id === 49) {
      return stem.replace("वस्तुएँ बने", "वस्तुएँ बनीं");
    }
    if (id === 50) {
      return stem.replace("कुल अंक", "कुल अंक").replace(" है और औसत", " हैं और प्रति विद्यार्थी औसत");
    }
    if (id === 54) {
      return stem
        .replace("एक परिवार ने कुल", "एक परिवार कुल")
        .replace(" हैं और औसत दैनिक खर्च", " खर्च करता है और उसका औसत दैनिक खर्च");
    }
    return stem;
  }

  if (id === 30) {
    return stem.replace(/ਇੱਕ ਹੋਸਟਲ ਭੋਜਨ ਉੱਤੇ (\d+ ਦਿਨਾਂ ਤੱਕ)/, "ਇੱਕ ਹੋਸਟਲ $1 ਭੋਜਨ ਉੱਤੇ");
  }
  if (id === 49) {
    return stem.replace("ਵਸਤਾਂ ਬਣੇ", "ਵਸਤਾਂ ਬਣੀਆਂ");
  }
  if (id === 50) {
    return stem.replace("ਹੈ ਅਤੇ ਔਸਤ", "ਹਨ ਅਤੇ ਪ੍ਰਤੀ ਵਿਦਿਆਰਥੀ ਔਸਤ");
  }
  if (id === 54) {
    return stem
      .replace("ਇੱਕ ਪਰਿਵਾਰ ਨੇ ਕੁੱਲ", "ਇੱਕ ਪਰਿਵਾਰ ਕੁੱਲ")
      .replace(" ਹਨ ਅਤੇ ਔਸਤ ਰੋਜ਼ਾਨਾ ਖਰਚ", " ਖਰਚ ਕਰਦਾ ਹੈ ਅਤੇ ਉਸ ਦਾ ਔਸਤ ਰੋਜ਼ਾਨਾ ਖਰਚ");
  }
  return stem;
}

function cp002Variation(stem: string, id: number, language: PilotLanguage) {
  const variant = id % 3;
  if (variant === 0) return stem;

  if (language === "hi") {
    if (variant === 1) {
      return stem
        .replace(" हैं; पहला ", " हैं। इनमें पहला ")
        .replace(" और अंतिम ", " तथा अंतिम ")
        .replace("उनका औसत ज्ञात कीजिए।", "इस क्रम का औसत निकालिए।")
        .replace(" हैं और इस क्रम का औसत ", " हैं। पूरे क्रम का औसत ")
        .replace(" हैं। उनका औसत ", " हैं, जिनका औसत ")
        .replace(" और समान अंतर ", " तथा समान अंतर ")
        .replace("उनकी कुल संख्या ज्ञात कीजिए।", "ऐसे पदों की कुल संख्या निकालिए।")
        .replace("समान अंतर ज्ञात कीजिए।", "दो क्रमागत पदों का अंतर निकालिए।");
    }
    return stem
      .replace(" हैं; पहला ", " हैं। क्रम का पहला ")
      .replace(" और अंतिम ", ", जबकि अंतिम ")
      .replace("उनका औसत ज्ञात कीजिए।", "इन सभी का औसत क्या होगा?")
      .replace(" हैं और इस क्रम का औसत ", " हैं। इनका औसत ")
      .replace(" हैं। उनका औसत ", " हैं। दिए गए क्रम का औसत ")
      .replace("उनकी कुल संख्या ज्ञात कीजिए।", "बताइए, इस क्रम में कुल कितने पद हैं।")
      .replace("समान अंतर ज्ञात कीजिए।", "क्रमिक अंतर का मान बताइए।");
  }

  if (variant === 1) {
    return stem
      .replace(" ਹਨ; ਪਹਿਲਾ ", " ਹਨ। ਇਨ੍ਹਾਂ ਵਿੱਚ ਪਹਿਲਾ ")
      .replace(" ਅਤੇ ਆਖਰੀ ", " ਅਤੇ ਅੰਤਿਮ ")
      .replace("ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।", "ਇਸ ਕ੍ਰਮ ਦੀ ਔਸਤ ਕੱਢੋ।")
      .replace(" ਹਨ ਅਤੇ ਇਸ ਕ੍ਰਮ ਦੀ ਔਸਤ ", " ਹਨ। ਪੂਰੇ ਕ੍ਰਮ ਦੀ ਔਸਤ ")
      .replace(" ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ", " ਹਨ, ਜਿਨ੍ਹਾਂ ਦੀ ਔਸਤ ")
      .replace(" ਅਤੇ ਬਰਾਬਰ ਅੰਤਰ ", " ਅਤੇ ਸਾਂਝਾ ਅੰਤਰ ")
      .replace("ਉਨ੍ਹਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।", "ਅਜਿਹੇ ਪਦਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਕੱਢੋ।")
      .replace("ਬਰਾਬਰ ਅੰਤਰ ਪਤਾ ਕਰੋ।", "ਦੋ ਲਗਾਤਾਰ ਪਦਾਂ ਵਿਚਲਾ ਅੰਤਰ ਕੱਢੋ।");
  }
  return stem
    .replace(" ਹਨ; ਪਹਿਲਾ ", " ਹਨ। ਕ੍ਰਮ ਦਾ ਪਹਿਲਾ ")
    .replace(" ਅਤੇ ਆਖਰੀ ", ", ਜਦਕਿ ਆਖਰੀ ")
    .replace("ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।", "ਇਨ੍ਹਾਂ ਸਭ ਦੀ ਔਸਤ ਕੀ ਹੋਵੇਗੀ?")
    .replace(" ਹਨ ਅਤੇ ਇਸ ਕ੍ਰਮ ਦੀ ਔਸਤ ", " ਹਨ। ਇਨ੍ਹਾਂ ਦੀ ਔਸਤ ")
    .replace(" ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ", " ਹਨ। ਦਿੱਤੇ ਕ੍ਰਮ ਦੀ ਔਸਤ ")
    .replace("ਉਨ੍ਹਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।", "ਦੱਸੋ, ਇਸ ਕ੍ਰਮ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਪਦ ਹਨ।")
    .replace("ਬਰਾਬਰ ਅੰਤਰ ਪਤਾ ਕਰੋ।", "ਲਗਾਤਾਰ ਅੰਤਰ ਦਾ ਮੁੱਲ ਦੱਸੋ।");
}

export function applyAvg001LocalizedStemContextFinalPolish(
  pkg: Avg001QuestionPackage,
  language: PilotLanguage,
): Avg001QuestionPackage {
  const id = Number(pkg.questionLanguageId.slice(-3));
  const stem = pkg.canonicalProblemId === "AVG-CP-001"
    ? cp001FinalPolish(pkg.stem, id, language)
    : pkg.canonicalProblemId === "AVG-CP-002"
      ? cp002Variation(pkg.stem, id, language)
      : pkg.stem;

  return {
    ...pkg,
    stem,
    traceability: {
      ...pkg.traceability,
      localizedStemContextFinalPolish: "AVG-001 localized stem context final polish v1",
    },
  };
}
