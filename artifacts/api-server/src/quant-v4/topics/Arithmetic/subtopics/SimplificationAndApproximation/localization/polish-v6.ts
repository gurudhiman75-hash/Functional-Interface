import { applySapLocalizationPolishV4 } from "./polish-v4";
import type { SapTranslationLanguage } from "./types";

function repairHindi(value: string) {
  return value
    .replace(/पूर्णांकित कीजिएed/gu, "पूर्णांकित")
    .replace(/पूर्णांकित करेंed/gu, "पूर्णांकित")
    .replace(/राउंड करेंed/gu, "राउंड किया गया")
    .replace(/भिन्नों\/गुणा/gu, "भिन्नों और गुणा")
    .replace(/प्रत्यक्ष\/पहले/gu, "प्रत्यक्ष")
    .replace(/स्थानांतरित ऊपर\/नीचे/gu, "ऊपर या नीचे स्थानांतरित")
    .replace(/ऊपर\/नीचे/gu, "ऊपर या नीचे")
    .replace(/मान लीजिए एक हो मान/gu, "मान लीजिए A वह मान है जो")
    .replace(/\bएक\s*([<>=])\s*B\b/gu, "A $1 B")
    .replace(/\bएक\s*=\s*([^,.;।\n]+)/gu, "A = $1")
    .replace(/लिखें एक पर/gu, "A को लिखें")
    .replace(/लिखें एक ऊपर/gu, "A को लिखें")
    .replace(/एक के अनुरूप/gu, "A के अनुरूप")
    .replace(/एक तक (\d+)/gu, "A के लिए $1")
    .replace(/तुलना करें यह के साथ B/gu, "B से इसकी तुलना करें")
    .replace(/तुलना करें यह साथ B/gu, "B से इसकी तुलना करें")
    .replace(/यह बराबर B/gu, "यह B के बराबर है")
    .replace(/\bकोई त्रुटि\b/gu, "कोई त्रुटि नहीं")
    .replace(/\bकरें नहीं\b/gu, "न करें")
    .replace(/\bयह नहीं\b/gu, "यह नहीं")
    .replace(/\bपर एक बार\b/gu, "एक बार में")
    .replace(/\bपर दोनों पक्ष\b/gu, "दोनों ओर")
    .replace(/\bपर दोनों\b/gu, "दोनों ओर")
    .replace(/\bपर वह स्थान\b/gu, "उस स्थान पर")
    .replace(/\bपर इकाई\b/gu, "इकाई स्थान पर");
}

function repairPunjabi(value: string) {
  return value
    .replace(/ਰਾਊਂਡ ਕਰੋed/gu, "ਰਾਊਂਡ ਕੀਤਾ")
    .replace(/ਰਾਊਂਡ ਕੀਤਾed/gu, "ਰਾਊਂਡ ਕੀਤਾ")
    .replace(/ਭਿੰਨਾਂ\/ਗੁਣਾ/gu, "ਭਿੰਨਾਂ ਅਤੇ ਗੁਣਾ")
    .replace(/ਸਿੱਧਾ\/ਪਹਿਲਾਂ/gu, "ਸਿੱਧਾ")
    .replace(/ਨੀਤੀ\/ਨੈੜੇ/gu, "ਨਿਯਮ")
    .replace(/ਥਾਂ ਬਦਲੋ ਉੱਪਰ\/ਹੇਠਾਂ/gu, "ਉੱਪਰ ਜਾਂ ਹੇਠਾਂ ਥਾਂ ਬਦਲੋ")
    .replace(/ਉੱਪਰ\/ਹੇਠਾਂ/gu, "ਉੱਪਰ ਜਾਂ ਹੇਠਾਂ")
    .replace(/ਮੰਨੋ ਇੱਕ ਹੋਵੇ ਮੁੱਲ/gu, "ਮੰਨੋ A ਉਹ ਮੁੱਲ ਹੈ ਜੋ")
    .replace(/\bਇੱਕ\s*([<>=])\s*B\b/gu, "A $1 B")
    .replace(/\bਇੱਕ\s*=\s*([^,.\n]+)/gu, "A = $1")
    .replace(/ਲਿਖੋ ਇੱਕ ਉੱਤੇ/gu, "A ਨੂੰ ਲਿਖੋ")
    .replace(/ਲਿਖੋ ਇੱਕ ਤੇ/gu, "A ਨੂੰ ਲਿਖੋ")
    .replace(/ਇੱਕ ਦੇ ਅਨੁਸਾਰ/gu, "A ਦੇ ਅਨੁਸਾਰ")
    .replace(/ਇੱਕ ਤੱਕ (\d+)/gu, "A ਲਈ $1")
    .replace(/ਤੁਲਨਾ ਕਰੋ ਇਹ ਨਾਲ B/gu, "B ਨਾਲ ਇਸ ਦੀ ਤੁਲਨਾ ਕਰੋ")
    .replace(/ਇਹ ਬਰਾਬਰ B/gu, "ਇਹ B ਦੇ ਬਰਾਬਰ ਹੈ")
    .replace(/\bਕੋਈ ਗਲਤੀ\b/gu, "ਕੋਈ ਗਲਤੀ ਨਹੀਂ")
    .replace(/\bਕਰੋ ਨਹੀਂ\b/gu, "ਨਾ ਕਰੋ")
    .replace(/\bਤੇ ਇੱਕ ਵਾਰ\b/gu, "ਇੱਕ ਵਾਰ ਵਿੱਚ")
    .replace(/\bਉੱਤੇ ਦੋਵੇਂ ਪਾਸਾ\b/gu, "ਦੋਵੇਂ ਪਾਸਿਆਂ ਤੇ")
    .replace(/\bਉੱਤੇ ਦੋਵੇਂ\b/gu, "ਦੋਵੇਂ ਪਾਸਿਆਂ ਤੇ")
    .replace(/\bਤੇ ਉਹ ਸਥਾਨ\b/gu, "ਉਸ ਸਥਾਨ ਤੇ")
    .replace(/\bਤੇ ਇਕਾਈ\b/gu, "ਇਕਾਈ ਸਥਾਨ ਤੇ");
}

function repair(value: string, language: SapTranslationLanguage) {
  return language === "hi" ? repairHindi(value) : repairPunjabi(value);
}

export function applySapLocalizationPolishV6(pkg: any, language: SapTranslationLanguage) {
  const base = applySapLocalizationPolishV4(pkg, language);
  const options = Object.freeze(base.options.map((option: unknown) => repair(String(option ?? ""), language)));
  const correctIndex = Number(base.correctIndex);
  const answer = options[correctIndex];
  const explanationLines = Object.freeze(
    (base.explanation?.lines ?? []).map((line: unknown) => repair(String(line ?? ""), language)),
  );
  return Object.freeze({
    ...base,
    stem: repair(String(base.stem ?? ""), language),
    options,
    correctIndex,
    answer,
    explanation: Object.freeze({ lines: explanationLines }),
    traceability: Object.freeze({
      ...(base.traceability ?? {}),
      localizationEditorialPolish: "SAP-HI-PA-EDITORIAL-POLISH-V6",
    }),
  });
}
