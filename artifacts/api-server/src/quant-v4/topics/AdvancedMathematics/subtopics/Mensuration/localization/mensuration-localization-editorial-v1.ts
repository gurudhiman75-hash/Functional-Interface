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
 * Presentation-only math repair shared by English, Hindi and Punjabi surfaces.
 * It must not alter mathematical values, operators or answer semantics.
 */
export function repairMensurationLearnerMathSurface(text: string) {
  return text
    .replace(/\\pih\b/g, "\\pi h")
    // Raw CP008 QL077 source can contain a formatted RHS nested inside an
    // outer MathJax span: `$TSA-CSA=$128\\pi\\text{ cm}^{2}$$`.
    .replace(
      /\$TSA-CSA=\$(\d+\\pi\\text\{ cm\}\^\{2\})\$\$/g,
      (_match, rhs: string) => `$TSA-CSA=${rhs}$`,
    )
    // After localization/protection the redundant trailing delimiter may
    // already have been collapsed, leaving three dollars. Remove only the
    // duplicated middle opener to retain one balanced span.
    .replace(/\$TSA-CSA=\$(?=\d)/g, () => "$TSA-CSA=");
}

/**
 * Final learner-language polish that must not add or remove mathematical
 * notation relative to the English authority. Keep these rewrites semantic:
 * worded relations remain worded relations rather than new symbols.
 */
export function polishMensurationLocalizedText(text: string, language: MensurationLocalizedLanguage) {
  const mathSafe = repairMensurationLearnerMathSurface(text);
  if (language === "hi") {
    return mathSafe
      .replace(/वक्र पृष्ठ क्षेत्रफल\s*=\s*परिधि\s*×\s*ऊँचाई/g, "वक्र पृष्ठ क्षेत्रफल परिधि × ऊँचाई के बराबर होता है")
      .replace(/\.\s*$/g, ".")
      .trim();
  }
  return mathSafe
    .replace(/ਵਕਰ ਸਤਹ ਖੇਤਰਫਲ\s*=\s*ਪਰਿਧੀ\s*×\s*ਉਚਾਈ/g, "ਵਕਰ ਸਤਹ ਖੇਤਰਫਲ ਪਰਿਧੀ × ਉਚਾਈ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ")
    .replace(/\.\s*$/g, ".")
    .trim();
}
