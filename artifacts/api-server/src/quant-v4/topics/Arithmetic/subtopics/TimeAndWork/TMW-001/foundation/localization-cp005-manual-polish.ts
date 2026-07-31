import type {
  TmwCp005GeneratedQuestion,
  TmwCp005MisconceptionId,
} from "./cp005-types";
import type { TmwLocalizedLanguage } from "./localization-types";

function pluralizeNumberedUnits(value: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return value
      .replace(/(\d+) दिन में/g, (_, raw: string) => raw === "1" ? "एक दिन में" : `${raw} दिनों में`)
      .replace(/(\d+) घंटा में/g, (_, raw: string) => raw === "1" ? "एक घंटे में" : `${raw} घंटों में`)
      .replace(/(\d+) घंटा/g, (_, raw: string) => raw === "1" ? "1 घंटा" : `${raw} घंटे`)
      .replace(/(\d+) चक्र के बाद/g, (_, raw: string) => raw === "1" ? "1 चक्र के बाद" : `${raw} चक्रों के बाद`);
  }
  return value
    .replace(/(\d+) ਦਿਨ ਵਿੱਚ/g, (_, raw: string) => raw === "1" ? "ਇੱਕ ਦਿਨ ਵਿੱਚ" : `${raw} ਦਿਨਾਂ ਵਿੱਚ`)
    .replace(/(\d+) ਘੰਟਾ ਵਿੱਚ/g, (_, raw: string) => raw === "1" ? "ਇੱਕ ਘੰਟੇ ਵਿੱਚ" : `${raw} ਘੰਟਿਆਂ ਵਿੱਚ`)
    .replace(/(\d+) ਘੰਟਾ/g, (_, raw: string) => raw === "1" ? "1 ਘੰਟਾ" : `${raw} ਘੰਟੇ`)
    .replace(/(\d+) ਚੱਕਰ ਤੋਂ ਬਾਅਦ/g, (_, raw: string) => raw === "1" ? "1 ਚੱਕਰ ਤੋਂ ਬਾਅਦ" : `${raw} ਚੱਕਰਾਂ ਤੋਂ ਬਾਅਦ`);
}

function neutralizeSoloAssignment(value: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return value.replace(
      /^(.+?) अकेले पूरा करने में /,
      "दिया गया कार्य: $1। इसे अकेले पूरा करने में ",
    );
  }
  return value.replace(
    /^(.+?) ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ /,
    "ਦਿੱਤਾ ਗਿਆ ਕੰਮ: $1। ਇਸ ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ",
  );
}

function neutralizeCycleResponsibility(value: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return value
      .replace(/([^;।]+?) तक काम ([^;।]+?) से होता है/g, "$1 तक काम की जिम्मेदारी $2 की रहती है")
      .replace(/हर दिन काम ([^;।]+?) से होता है/g, "हर दिन काम की जिम्मेदारी $1 की रहती है")
      .replace(/पहले दिन काम ([^;।]+?) से और दूसरे दिन ([^;।]+?) से होता है/g, "पहले दिन काम की जिम्मेदारी $1 की और दूसरे दिन $2 की रहती है")
      .replace(/एक दिन काम केवल ([^;।]+?) से होता है/g, "एक दिन काम की जिम्मेदारी केवल $1 की रहती है");
  }
  return value
    .replace(/([^;।]+?) ਲਈ ਕੰਮ ([^;।]+?) ਨਾਲ ਹੁੰਦਾ ਹੈ/g, "$1 ਲਈ ਕੰਮ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ $2 ਦੀ ਰਹਿੰਦੀ ਹੈ")
    .replace(/ਹਰ ਦਿਨ ਕੰਮ ([^;।]+?) ਨਾਲ ਹੁੰਦਾ ਹੈ/g, "ਹਰ ਦਿਨ ਕੰਮ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ $1 ਦੀ ਰਹਿੰਦੀ ਹੈ")
    .replace(/ਪਹਿਲੇ ਦਿਨ ਕੰਮ ([^;।]+?) ਨਾਲ ਅਤੇ ਦੂਜੇ ਦਿਨ ([^;।]+?) ਨਾਲ ਹੁੰਦਾ ਹੈ/g, "ਪਹਿਲੇ ਦਿਨ ਕੰਮ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ $1 ਦੀ ਅਤੇ ਦੂਜੇ ਦਿਨ $2 ਦੀ ਰਹਿੰਦੀ ਹੈ")
    .replace(/ਇੱਕ ਦਿਨ ਕੰਮ ਸਿਰਫ਼ ([^;।]+?) ਨਾਲ ਹੁੰਦਾ ਹੈ/g, "ਇੱਕ ਦਿਨ ਕੰਮ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ ਸਿਰਫ਼ $1 ਦੀ ਰਹਿੰਦੀ ਹੈ");
}

function normalizeRepeatedCycleVerbs(value: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return value
      .replace(/चक्र([^।]*) दोहरता है/g, "चक्र$1 दोहराया जाता है")
      .replace(/क्रम([^।]*) दोहरता है/g, "क्रम$1 दोहराया जाता है");
  }
  return value
    .replace(/ਚੱਕਰ([^।]*) ਦੁਹਰਦਾ ਹੈ/g, "ਚੱਕਰ$1 ਦੁਹਰਾਇਆ ਜਾਂਦਾ ਹੈ")
    .replace(/ਕ੍ਰਮ([^।]*) ਦੁਹਰਦਾ ਹੈ/g, "ਕ੍ਰਮ$1 ਦੁਹਰਾਇਆ ਜਾਂਦਾ ਹੈ");
}

export function polishTmwCp005LocalizedText(
  value: string,
  language: TmwLocalizedLanguage,
): string {
  let result = neutralizeSoloAssignment(value, language);
  result = neutralizeCycleResponsibility(result, language);
  result = pluralizeNumberedUnits(result, language);
  result = normalizeRepeatedCycleVerbs(result, language);
  if (language === "hi") {
    return result
      .replaceAll("फिर अंतिम अधूरी बारी को उसकी सक्रिय दर से अलग पूरा करें।", "फिर बचे काम को अंतिम सक्रिय बारी की दर से पूरा करें।")
      .replaceAll("हर खंड का दर", "हर खंड की दर")
      .replaceAll("पाली-अवधि", "पाली की अवधि")
      .replaceAll("हर kवें दिन सहायता", "निर्धारित अंतराल पर सहायता")
      .replaceAll("k-दिन के चक्र में केवल kवें दिन सहायक की दर जोड़ें", "निर्धारित चक्र में केवल सहायक वाले दिन उसकी दर जोड़ें")
      .replaceAll("दोनों मशीनों का दर × समय जोड़ें", "दोनों मशीनों के लिए दर × समय जोड़ें");
  }
  return result
    .replaceAll("ਫਿਰ ਆਖ਼ਰੀ ਅਧੂਰੀ ਵਾਰੀ ਨੂੰ ਉਸ ਦੀ ਸਰਗਰਮ ਦਰ ਨਾਲ ਵੱਖ ਪੂਰਾ ਕਰੋ।", "ਫਿਰ ਬਾਕੀ ਕੰਮ ਨੂੰ ਆਖ਼ਰੀ ਸਰਗਰਮ ਵਾਰੀ ਦੀ ਦਰ ਨਾਲ ਪੂਰਾ ਕਰੋ।")
    .replaceAll("ਹਰ ਖੰਡ ਦਾ ਦਰ", "ਹਰ ਖੰਡ ਦੀ ਦਰ")
    .replaceAll("ਸ਼ਿਫ਼ਟ ਮਿਆਦ", "ਸ਼ਿਫ਼ਟ ਦੀ ਮਿਆਦ")
    .replaceAll("ਹਰ kਵੇਂ ਦਿਨ ਮਦਦ", "ਨਿਰਧਾਰਤ ਅੰਤਰਾਲ ਉੱਤੇ ਮਦਦ")
    .replaceAll("k-ਦਿਨਾਂ ਦੇ ਚੱਕਰ ਵਿੱਚ ਸਿਰਫ਼ kਵੇਂ ਦਿਨ ਮਦਦਗਾਰ ਦੀ ਦਰ ਜੋੜੋ", "ਨਿਰਧਾਰਤ ਚੱਕਰ ਵਿੱਚ ਸਿਰਫ਼ ਮਦਦਗਾਰ ਵਾਲੇ ਦਿਨ ਉਸ ਦੀ ਦਰ ਜੋੜੋ")
    .replaceAll("ਦੋਵਾਂ ਮਸ਼ੀਨਾਂ ਦਾ ਦਰ × ਸਮਾਂ ਜੋੜੋ", "ਦੋਵਾਂ ਮਸ਼ੀਨਾਂ ਲਈ ਦਰ × ਸਮਾਂ ਜੋੜੋ");
}

export function polishTmwCp005LocalizedTrap(
  source: TmwCp005GeneratedQuestion,
  misconceptionId: Exclude<TmwCp005MisconceptionId, "CORRECT">,
  fallback: string,
  language: TmwLocalizedLanguage,
): string {
  if (source.solveMode === "findTimeFromArbitraryCyclePhase") {
    return language === "hi"
      ? "यह विकल्प प्रश्न में दी गई शुरुआती बारी को छोड़कर सामान्य पहली बारी से चक्र चलाता है, इसलिए अंतिम चक्र की गणना गलत हो जाती है।"
      : "ਇਹ ਚੋਣ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਸ਼ੁਰੂਆਤੀ ਵਾਰੀ ਨੂੰ ਛੱਡ ਕੇ ਆਮ ਪਹਿਲੀ ਵਾਰੀ ਤੋਂ ਚੱਕਰ ਚਲਾਉਂਦੀ ਹੈ, ਇਸ ਲਈ ਆਖ਼ਰੀ ਚੱਕਰ ਦੀ ਗਿਣਤੀ ਗਲਤ ਹੋ ਜਾਂਦੀ ਹੈ।";
  }
  if (misconceptionId !== "FINAL_CYCLE_OMITTED") return fallback;
  if (source.solveMode === "findUnknownTimeFromAlternatingCompletion") {
    return language === "hi"
      ? "यह विकल्प ज्ञात पूर्णता समय की अंतिम बारी का काम नहीं गिनता, इसलिए अज्ञात दर और उसका उलटा समय दोनों गलत निकलते हैं।"
      : "ਇਹ ਚੋਣ ਦਿੱਤੇ ਪੂਰਾ ਹੋਣ ਦੇ ਸਮੇਂ ਦੀ ਆਖ਼ਰੀ ਵਾਰੀ ਦਾ ਕੰਮ ਨਹੀਂ ਗਿਣਦੀ, ਇਸ ਲਈ ਅਣਜਾਣ ਦਰ ਅਤੇ ਉਸ ਦਾ ਉਲਟ ਸਮਾਂ ਦੋਵੇਂ ਗਲਤ ਨਿਕਲਦੇ ਹਨ।";
  }
  if (source.solveMode === "findOutputUnderPeriodicMachineSchedule") {
    return language === "hi"
      ? "यह विकल्प अंतिम मशीन-चक्र का उत्पादन नहीं जोड़ता, इसलिए कुल उत्पादन कम आता है।"
      : "ਇਹ ਚੋਣ ਆਖ਼ਰੀ ਮਸ਼ੀਨ-ਚੱਕਰ ਦਾ ਉਤਪਾਦਨ ਨਹੀਂ ਜੋੜਦੀ, ਇਸ ਲਈ ਕੁੱਲ ਉਤਪਾਦਨ ਘੱਟ ਆਉਂਦਾ ਹੈ।";
  }
  return language === "hi"
    ? "यह विकल्प अंतिम आवश्यक चक्र या अधूरी बारी का काम और समय नहीं गिनता, इसलिए उत्तर कम आता है।"
    : "ਇਹ ਚੋਣ ਆਖ਼ਰੀ ਲੋੜੀਂਦੇ ਚੱਕਰ ਜਾਂ ਅਧੂਰੀ ਵਾਰੀ ਦਾ ਕੰਮ ਅਤੇ ਸਮਾਂ ਨਹੀਂ ਗਿਣਦੀ, ਇਸ ਲਈ ਉੱਤਰ ਘੱਟ ਆਉਂਦਾ ਹੈ।";
}

export function polishTmwCp005LocalizedConclusion(
  source: TmwCp005GeneratedQuestion,
  conclusion: string,
  answerText: string,
  language: TmwLocalizedLanguage,
): string {
  if (source.solveMode === "findUnknownTimeFromAlternatingCompletion") {
    return language === "hi"
      ? `अतः पूरा काम अकेले करने का आवश्यक समय ${answerText} है।`
      : `ਇਸ ਲਈ ਸਾਰਾ ਕੰਮ ਇਕੱਲੇ ਕਰਨ ਲਈ ਲੋੜੀਂਦਾ ਸਮਾਂ ${answerText} ਹੈ।`;
  }
  if (source.solveMode === "findOutputUnderPeriodicMachineSchedule") {
    const cycles = source.parameters.givenCycles ?? 1;
    return language === "hi"
      ? `अतः ${cycles} दोहरावों में कुल उत्पादन ${answerText} है।`
      : `ਇਸ ਲਈ ${cycles} ਦੁਹਰਾਵਾਂ ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ ${answerText} ਹੈ।`;
  }
  if (source.solution.answerType !== "TIME") return conclusion;
  const uninflectedPostposition = language === "hi"
    ? `${answerText} में`
    : `${answerText} ਵਿੱਚ`;
  if (!conclusion.includes(uninflectedPostposition)) return conclusion;
  return language === "hi"
    ? `अतः काम पूरा होने का कुल समय ${answerText} है।`
    : `ਇਸ ਲਈ ਕੰਮ ਪੂਰਾ ਹੋਣ ਦਾ ਕੁੱਲ ਸਮਾਂ ${answerText} ਹੈ।`;
}
