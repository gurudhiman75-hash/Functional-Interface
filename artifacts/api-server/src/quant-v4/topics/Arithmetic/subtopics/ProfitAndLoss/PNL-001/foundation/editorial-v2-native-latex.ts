import type { NativeEditorialLanguage } from "./editorial-v2-native-stems";

const HINDI_TERMS: Readonly<Record<string, string>> = {
  "profit": "लाभ",
  "loss": "हानि",
  "units": "इकाइयाँ",
  "unit": "इकाई",
  "cost": "लागत",
  "selling price": "विक्रय मूल्य",
  "cost price": "क्रय मूल्य",
  "marked price": "अंकित मूल्य",
  "revenue": "राजस्व",
  "contribution": "योगदान",
  "fixed cost": "स्थिर लागत",
  "variable cost": "परिवर्ती लागत",
  "target profit": "लक्षित लाभ",
  "break-even": "ब्रेक-ईवन",
  "effective cost": "प्रभावी लागत",
  "net receipt": "शुद्ध प्राप्ति",
  "gross selling price": "सकल विक्रय मूल्य",
  "rate": "दर",
  "amount": "राशि",
  "quantity": "मात्रा",
  "group data": "समूह आंकड़े",
  "target rate": "लक्षित दर",
};

const PUNJABI_TERMS: Readonly<Record<string, string>> = {
  "profit": "ਲਾਭ",
  "loss": "ਹਾਨੀ",
  "units": "ਇਕਾਈਆਂ",
  "unit": "ਇਕਾਈ",
  "cost": "ਲਾਗਤ",
  "selling price": "ਵਿਕਰੀ ਮੁੱਲ",
  "cost price": "ਲਾਗਤ ਮੁੱਲ",
  "marked price": "ਅੰਕਿਤ ਮੁੱਲ",
  "revenue": "ਆਮਦਨ",
  "contribution": "ਯੋਗਦਾਨ",
  "fixed cost": "ਸਥਿਰ ਲਾਗਤ",
  "variable cost": "ਬਦਲਣਯੋਗ ਲਾਗਤ",
  "target profit": "ਟੀਚਾ ਲਾਭ",
  "break-even": "ਬ੍ਰੇਕ-ਈਵਨ",
  "effective cost": "ਪ੍ਰਭਾਵੀ ਲਾਗਤ",
  "net receipt": "ਨੈੱਟ ਪ੍ਰਾਪਤੀ",
  "gross selling price": "ਸਕਲ ਵਿਕਰੀ ਮੁੱਲ",
  "rate": "ਦਰ",
  "amount": "ਰਕਮ",
  "quantity": "ਮਾਤਰਾ",
  "group data": "ਸਮੂਹ ਅੰਕੜੇ",
  "target rate": "ਟੀਚਾ ਦਰ",
};

function translateTextLabel(
  language: NativeEditorialLanguage,
  label: string,
): string {
  const terms = language === "hi" ? HINDI_TERMS : PUNJABI_TERMS;
  const normalized = label.trim().toLowerCase();
  if (terms[normalized]) return terms[normalized];

  let output = label;
  for (const [english, native] of Object.entries(terms).sort((a, b) => b[0].length - a[0].length)) {
    const escaped = english.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    output = output.replace(new RegExp(`\\b${escaped}\\b`, "gi"), native);
  }
  return output;
}

export function localizeEditorialLatex(
  language: NativeEditorialLanguage,
  latex: string | undefined,
): string | undefined {
  if (!latex) return undefined;
  return latex.replace(/\\text\{([^{}]*)\}/g, (_full, label: string) => {
    return `\\text{${translateTextLabel(language, label)}}`;
  });
}
