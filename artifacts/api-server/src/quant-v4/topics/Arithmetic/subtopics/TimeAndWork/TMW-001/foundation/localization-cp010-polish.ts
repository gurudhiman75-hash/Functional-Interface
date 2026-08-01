import type { TmwLocalizedLanguage } from "./localization-types";

function normalizeMixedFractions(text: string): string {
  return text.replace(
    /(^|[^\d])(-?\d+)\s+(\d+)\/(\d+)(?!\d)/g,
    (_match, prefix: string, whole: string, numerator: string, denominator: string) =>
      `${prefix}\\(${whole}\\frac{${numerator}}{${denominator}}\\)`,
  );
}

function polishHindi(text: string): string {
  return text
    .replace(/_\{cycle\}/g, "_{चक्र}")
    .replace(/_\{target\}/g, "_{लक्ष्य}")
    .replace(/_\{threshold\}/g, "_{सीमा}")
    .replace(/_\{after\\ switch\}/g, "_{बदलाव के बाद}")
    .replace(/_\{off\}/g, "_{बंद}")
    .replace(/_\{on\}/g, "_{चालू}")
    .replace(/_\{old\}/g, "_{पुराना}")
    .replace(/\\text\{tank\/hour\}/g, "\\text{टंकी/घंटा}")
    .replace(/\\text\{hours earlier\}/g, "\\text{घंटे पहले}")
    .replace(/\\text\{hours later\}/g, "\\text{घंटे बाद}")
    .replace(/\\text\{hours\}/g, "\\text{घंटे}")
    .replace(/\\text\{litres\}/g, "\\text{लीटर}")
    .replace(/\\text\{Stage (\d+): \}/g, "\\text{चरण $1: }")
    .replace(/Complete cycles before the terminal cycle/g, "अंतिम चक्र से पहले पूरे चक्र")
    .replace(/drainage still required at its start/g, "खंड के आरंभ पर शेष निकासी")
    .replace(/level still required at its start/g, "खंड के आरंभ पर शेष स्तर")
    .replace(/completion occurs exactly at the end of /g, "समापन ठीक इसके अंत में होता है: ")
    .replace(/terminal segment is /g, "अंतिम सक्रिय खंड: ")
    .replace(/Process full cycles, then test each terminal segment/g, "पूरे चक्र लें, फिर अंतिम चक्र के प्रत्येक खंड को जाँचें")
    .replace(/((?:[2-9]|\d{2,})) घंटे में/g, "$1 घंटों में")
    .replace(/((?:[2-9]|\d{2,})) घंटे तक/g, "$1 घंटों तक")
    .replace(/पूरी तरह भरी होने तक/g, "पूरी तरह भरने तक")
    .replace(/पूरी तरह खाली होने तक/g, "पूरी तरह खाली होने तक")
    .replace(/पाइपें एक साथ चलते हैं/g, "पाइपें एक साथ चलती हैं")
    .replace(/पाइपें चलती है/g, "पाइपें चलती हैं");
}

function polishPunjabi(text: string): string {
  return text
    .replace(/_\{cycle\}/g, "_{ਚੱਕਰ}")
    .replace(/_\{target\}/g, "_{ਟੀਚਾ}")
    .replace(/_\{threshold\}/g, "_{ਸੀਮਾ}")
    .replace(/_\{after\\ switch\}/g, "_{ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ}")
    .replace(/_\{off\}/g, "_{ਬੰਦ}")
    .replace(/_\{on\}/g, "_{ਚਾਲੂ}")
    .replace(/_\{old\}/g, "_{ਪੁਰਾਣਾ}")
    .replace(/\\text\{tank\/hour\}/g, "\\text{ਟੈਂਕੀ/ਘੰਟਾ}")
    .replace(/\\text\{hours earlier\}/g, "\\text{ਘੰਟੇ ਪਹਿਲਾਂ}")
    .replace(/\\text\{hours later\}/g, "\\text{ਘੰਟੇ ਬਾਅਦ}")
    .replace(/\\text\{hours\}/g, "\\text{ਘੰਟੇ}")
    .replace(/\\text\{litres\}/g, "\\text{ਲੀਟਰ}")
    .replace(/\\text\{Stage (\d+): \}/g, "\\text{ਪੜਾਅ $1: }")
    .replace(/Complete cycles before the terminal cycle/g, "ਅੰਤਿਮ ਚੱਕਰ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੇ ਚੱਕਰ")
    .replace(/drainage still required at its start/g, "ਖੰਡ ਦੇ ਸ਼ੁਰੂ ਉੱਤੇ ਬਾਕੀ ਨਿਕਾਸੀ")
    .replace(/level still required at its start/g, "ਖੰਡ ਦੇ ਸ਼ੁਰੂ ਉੱਤੇ ਬਾਕੀ ਪੱਧਰ")
    .replace(/completion occurs exactly at the end of /g, "ਪੂਰਨਤਾ ਠੀਕ ਇਸ ਦੇ ਅੰਤ ਉੱਤੇ ਹੁੰਦੀ ਹੈ: ")
    .replace(/terminal segment is /g, "ਅੰਤਿਮ ਸਰਗਰਮ ਖੰਡ: ")
    .replace(/Process full cycles, then test each terminal segment/g, "ਪੂਰੇ ਚੱਕਰ ਲਓ, ਫਿਰ ਅੰਤਿਮ ਚੱਕਰ ਦੇ ਹਰ ਖੰਡ ਨੂੰ ਜਾਂਚੋ")
    .replace(/((?:[2-9]|\d{2,})) ਘੰਟੇ ਵਿੱਚ/g, "$1 ਘੰਟਿਆਂ ਵਿੱਚ")
    .replace(/((?:[2-9]|\d{2,})) ਘੰਟੇ ਲਈ/g, "$1 ਘੰਟਿਆਂ ਲਈ")
    .replace(/ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰੀ ਹੋਣ ਤੱਕ/g, "ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰਨ ਤੱਕ")
    .replace(/ਪਾਈਪਾਂ ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ/g, "ਪਾਈਪਾਂ ਇਕੱਠੀਆਂ ਚੱਲਦੀਆਂ ਹਨ")
    .replace(/ਪਾਈਪਾਂ ਚੱਲਦੀ ਹੈ/g, "ਪਾਈਪਾਂ ਚੱਲਦੀਆਂ ਹਨ");
}

export function polishTmwCp010Text(
  text: string,
  language: TmwLocalizedLanguage,
): string {
  const normalized = normalizeMixedFractions(text);
  return language === "hi" ? polishHindi(normalized) : polishPunjabi(normalized);
}
