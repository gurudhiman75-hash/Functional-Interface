import type { TmwLocalizedLanguage } from "./localization-types";

interface StemmedQuestion {
  stem: string;
}

function remediateHindi(qlId: string, source: string): string {
  let stem = source;
  switch (qlId) {
    case "TMW-QL-002":
      stem = stem.replace(
        /(\d+) दिन में एक रिकॉर्ड क्लर्क का कुल (\d+) फाइलें पूरी हुई हैं।/,
        "एक रिकॉर्ड क्लर्क ने $1 दिनों में कुल $2 फाइलें पूरी कीं।",
      );
      break;
    case "TMW-QL-005":
      stem = stem.replace(
        /एक ठेकेदार एक दिन में दिए गए काम का (.+?) भाग पूरा होता है।/,
        "एक ठेकेदार एक दिन में दिए गए काम का $1 भाग पूरा करता है।",
      );
      break;
    case "TMW-QL-131":
      stem = stem.replace("केवल भारी मशीनें से", "केवल भारी मशीनों से");
      break;
    case "TMW-QL-151":
      stem = stem.replace("बड़ा प्रेषण ऑर्डर के लिए", "बड़े प्रेषण ऑर्डर के लिए");
      break;
    case "TMW-QL-181":
      stem = stem.replace(
        /जब तक स्तर (\\\([\s\S]*?\\\)) भरी न हो जाए/,
        "जब तक टंकी $1 न भर जाए",
      );
      break;
    case "TMW-QL-187":
      stem = stem.replace(
        /टंकी का स्तर (\\\([\s\S]*?\\\)) भरी और (\\\([\s\S]*?\\\)) भरी के बीच/,
        "टंकी का स्तर $1 और $2 के बीच",
      );
      break;
    case "TMW-QL-192":
      stem = stem.replace("ठीक 10 घंटों तक भरने", "ठीक 10 घंटे में भरने");
      break;
    case "TMW-QL-193":
      stem = stem.replace("6 दिनों का कुल ज्ञात कीजिए", "6 दिनों में कुल कितनी पुस्तिकाएँ पूरी होंगी");
      break;
    case "TMW-QL-195":
      stem = stem.replace(
        /6 दिनों का कुल (\d+) पुस्तिकाएँ हैं/,
        "6 दिनों में कुल $1 पुस्तिकाएँ पूरी हुईं",
      );
      break;
    case "TMW-QL-196":
      stem = stem.replace(
        /8 दिनों का कुल (\d+) पेटियाँ हैं/,
        "8 दिनों में कुल $1 पेटियाँ पूरी हुईं",
      );
      break;
    case "TMW-QL-197":
      stem = stem.replace("5 दिनों का कुल ज्ञात कीजिए", "5 दिनों में कुल कितनी पुस्तिकाएँ पूरी होंगी");
      break;
    case "TMW-QL-199":
      stem = stem.replace(
        /5 दिनों का कुल (\d+) फाइलें हैं/,
        "5 दिनों में कुल $1 फाइलें पूरी हुईं",
      );
      break;
    case "TMW-QL-200":
      stem = stem.replace(
        /4 दिनों का कुल (\d+) पुर्ज़े हैं/,
        "4 दिनों में कुल $1 पुर्ज़े बने",
      );
      break;
    case "TMW-QL-203":
      stem = stem.replace(
        /8 दिनों का कुल (\d+) फाइलें पूरी हुईं/,
        "8 दिनों में कुल $1 फाइलें पूरी हुईं",
      );
      break;
    case "TMW-QL-205":
      stem = stem.replace(
        /पहले दिन की दरें (\d+) और (\d+) फाइलें हैं/,
        "पहले दिन की दरें क्रमशः $1 और $2 फाइलें प्रतिदिन हैं",
      );
      break;
    case "TMW-QL-206":
      stem = stem
        .replace(/पहले दिन (\d+) पुर्ज़े है/g, "पहले दिन $1 पुर्ज़े हैं")
        .replace(/दैनिक बदलाव (\d+) है/g, "दैनिक बदलाव $1 पुर्ज़े है");
      break;
    case "TMW-QL-208":
      stem = stem.replace(/(\d+) पेटियाँ पूरा करने/, "$1 पेटियाँ पूरी करने");
      break;
    case "TMW-QL-209":
      stem = stem.replace("8 दिनों का कुल ज्ञात कीजिए", "8 दिनों में कुल कितनी फाइलें पूरी होंगी");
      break;
  }
  return stem;
}

function remediatePunjabi(qlId: string, source: string): string {
  let stem = source;
  switch (qlId) {
    case "TMW-QL-002":
      stem = stem.replace(
        /(\d+) ਦਿਨ ਵਿੱਚ ਇੱਕ ਰਿਕਾਰਡ ਕਲਰਕ ਦਾ ਕੁੱਲ (\d+) ਫਾਈਲਾਂ ਪੂਰੀਆਂ ਹੋਈਆਂ ਹਨ।/,
        "ਇੱਕ ਰਿਕਾਰਡ ਕਲਰਕ ਨੇ $1 ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ $2 ਫਾਈਲਾਂ ਪੂਰੀਆਂ ਕੀਤੀਆਂ ਹਨ।",
      );
      break;
    case "TMW-QL-005":
      stem = stem.replace(
        /ਇੱਕ ਠੇਕੇਦਾਰ ਇੱਕ ਦਿਨ ਵਿੱਚ ਦਿੱਤੇ ਹੋਏ ਕੰਮ ਦਾ (.+?) ਹਿੱਸਾ ਪੂਰਾ ਹੁੰਦਾ ਹੈ।/,
        "ਇੱਕ ਠੇਕੇਦਾਰ ਇੱਕ ਦਿਨ ਵਿੱਚ ਦਿੱਤੇ ਹੋਏ ਕੰਮ ਦਾ $1 ਹਿੱਸਾ ਪੂਰਾ ਕਰਦਾ ਹੈ।",
      );
      break;
    case "TMW-QL-092":
      stem = stem.replace("ਟੀਮ B ਇਕੱਲੀ ਸਾਰਾ ਕੰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਕਰੇਗਾ", "ਟੀਮ B ਇਕੱਲੀ ਸਾਰਾ ਕੰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਕਰੇਗੀ");
      break;
    case "TMW-QL-151":
      stem = stem.replace("ਵੱਡਾ ਡਿਸਪੈਚ ਆਰਡਰ ਲਈ", "ਵੱਡੇ ਡਿਸਪੈਚ ਆਰਡਰ ਲਈ");
      break;
    case "TMW-QL-181":
      stem = stem.replace(
        /ਜਦੋਂ ਤੱਕ ਪੱਧਰ (\\\([\s\S]*?\\\)) ਭਰੀ ਨਾ ਹੋ ਜਾਵੇ/,
        "ਜਦੋਂ ਤੱਕ ਟੈਂਕੀ $1 ਨਾ ਭਰ ਜਾਵੇ",
      );
      break;
    case "TMW-QL-187":
      stem = stem.replace(
        /ਟੈਂਕੀ ਦਾ ਪੱਧਰ (\\\([\s\S]*?\\\)) ਭਰੀ ਅਤੇ (\\\([\s\S]*?\\\)) ਭਰੀ ਦੇ ਵਿਚਕਾਰ/,
        "ਟੈਂਕੀ ਦਾ ਪੱਧਰ $1 ਅਤੇ $2 ਦੇ ਵਿਚਕਾਰ",
      );
      break;
    case "TMW-QL-192":
      stem = stem.replace("ਠੀਕ 10 ਘੰਟੇ ਤੱਕ ਭਰਨ", "ਠੀਕ 10 ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਨ");
      break;
    case "TMW-QL-193":
      stem = stem.replace("6 ਦਿਨਾਂ ਦਾ ਕੁੱਲ ਲੱਭੋ", "6 ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੀਆਂ ਪੁਸਤਿਕਾਵਾਂ ਪੂਰੀਆਂ ਹੋਣਗੀਆਂ");
      break;
    case "TMW-QL-195":
      stem = stem.replace(
        /6 ਦਿਨਾਂ ਦਾ ਕੁੱਲ (\d+) ਪੁਸਤਿਕਾਵਾਂ ਹਨ/,
        "6 ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ $1 ਪੁਸਤਿਕਾਵਾਂ ਪੂਰੀਆਂ ਹੋਈਆਂ",
      );
      break;
    case "TMW-QL-196":
      stem = stem.replace(
        /8 ਦਿਨਾਂ ਦਾ ਕੁੱਲ (\d+) ਪੇਟੀਆਂ ਹੈ/,
        "8 ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ $1 ਪੇਟੀਆਂ ਪੂਰੀਆਂ ਹੋਈਆਂ",
      );
      break;
    case "TMW-QL-197":
      stem = stem.replace("5 ਦਿਨਾਂ ਦਾ ਕੁੱਲ ਲੱਭੋ", "5 ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੀਆਂ ਪੁਸਤਿਕਾਵਾਂ ਪੂਰੀਆਂ ਹੋਣਗੀਆਂ");
      break;
    case "TMW-QL-199":
      stem = stem.replace(
        /5 ਦਿਨਾਂ ਦਾ ਕੁੱਲ (\d+) ਫਾਈਲਾਂ ਹਨ/,
        "5 ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ $1 ਫਾਈਲਾਂ ਪੂਰੀਆਂ ਹੋਈਆਂ",
      );
      break;
    case "TMW-QL-200":
      stem = stem.replace(
        /4 ਦਿਨਾਂ ਦਾ ਕੁੱਲ (\d+) ਪੁਰਜ਼ੇ ਹਨ/,
        "4 ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ $1 ਪੁਰਜ਼ੇ ਬਣੇ",
      );
      break;
    case "TMW-QL-203":
      stem = stem.replace(
        /8 ਦਿਨਾਂ ਦਾ ਕੁੱਲ (\d+) ਫਾਈਲਾਂ ਪੂਰੀਆਂ ਹੋਈਆਂ/,
        "8 ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ $1 ਫਾਈਲਾਂ ਪੂਰੀਆਂ ਹੋਈਆਂ",
      );
      break;
    case "TMW-QL-205":
      stem = stem.replace(
        /ਪਹਿਲੇ ਦਿਨ ਦੀਆਂ ਦਰਾਂ (\d+) ਅਤੇ (\d+) ਫਾਈਲਾਂ ਹਨ/,
        "ਪਹਿਲੇ ਦਿਨ ਦੀਆਂ ਦਰਾਂ ਕ੍ਰਮਵਾਰ $1 ਅਤੇ $2 ਫਾਈਲਾਂ ਪ੍ਰਤੀ ਦਿਨ ਹਨ",
      );
      break;
    case "TMW-QL-209":
      stem = stem.replace("8 ਦਿਨਾਂ ਦਾ ਕੁੱਲ ਲੱਭੋ", "8 ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੀਆਂ ਫਾਈਲਾਂ ਪੂਰੀਆਂ ਹੋਣਗੀਆਂ");
      break;
  }
  return stem;
}

export function applyTmw001MultilingualStemRemediationWave02<T extends StemmedQuestion>(
  question: T,
  qlId: string,
  language: TmwLocalizedLanguage,
): T {
  const stem = language === "hi"
    ? remediateHindi(qlId, question.stem)
    : remediatePunjabi(qlId, question.stem);
  return { ...question, stem };
}
