import type { MensurationLocalizedLanguage } from "./mensuration-localization-foundation-v3";

export function protectMensurationFormulaIdentifiers(text: string) {
  const values: string[] = [];
  const save = (value: string) => {
    const token = `⟦V${values.length}⟧`;
    values.push(value);
    return token;
  };
  let protectedText = text.replace(
    /\b([A-Za-z])\b(?=\s*(?:[_²³^=+×÷−\-*/)]))/g,
    (match) => save(match),
  );
  protectedText = protectedText.replace(
    /([=+×÷−\-*/(]\s*)([A-Za-z])\b/g,
    (_match, prefix: string, variable: string) => `${prefix}${save(variable)}`,
  );
  return {
    text: protectedText,
    restore(value: string) {
      let restored = value;
      values.forEach((variable, index) => {
        restored = restored.replace(`⟦V${index}⟧`, variable);
      });
      return restored;
    },
  };
}

/**
 * Final learner-language polish that must not add or remove mathematical
 * notation relative to the English authority. Keep these rewrites semantic:
 * worded relations remain worded relations rather than new symbols.
 */
export function polishMensurationLocalizedText(text: string, language: MensurationLocalizedLanguage) {
  if (language === "hi") {
    return text
      .replace(/वक्र पृष्ठ क्षेत्रफल\s*=\s*परिधि\s*×\s*ऊँचाई/g, "वक्र पृष्ठ क्षेत्रफल परिधि × ऊँचाई के बराबर होता है")
      .replace(/\.\s*$/g, ".")
      .trim();
  }
  return text
    .replace(/ਵਕਰ ਸਤਹ ਖੇਤਰਫਲ\s*=\s*ਪਰਿਧੀ\s*×\s*ਉਚਾਈ/g, "ਵਕਰ ਸਤਹ ਖੇਤਰਫਲ ਪਰਿਧੀ × ਉਚਾਈ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ")
    .replace(/\.\s*$/g, ".")
    .trim();
}
