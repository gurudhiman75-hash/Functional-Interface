import type { TmwLocalizedLanguage } from "./localization-types";

function normalizeMixedFractions(text: string): string {
  return text.replace(
    /(^|[^\d])(-?\d+)\s+(\d+)\/(\d+)(?!\d)/g,
    (_match, prefix: string, whole: string, numerator: string, denominator: string) =>
      `${prefix}\\(${whole}\\frac{${numerator}}{${denominator}}\\)`,
  );
}

export function polishTmwCp006LocalizedProse(
  text: string,
  language: TmwLocalizedLanguage,
): string {
  const normalized = normalizeMixedFractions(text);
  if (language === "hi") {
    return normalized
      .replace(/1 दिन में/g, "एक दिन में")
      .replace(/([2-9]|\d{2,}) दिन में/g, "$1 दिनों में")
      .replace(/1 घंटा में/g, "एक घंटे में")
      .replace(/([2-9]|\d{2,}) घंटा में/g, "$1 घंटे में");
  }

  return normalized
    .replace(/1 ਦਿਨ ਵਿੱਚ/g, "ਇੱਕ ਦਿਨ ਵਿੱਚ")
    .replace(/([2-9]|\d{2,}) ਦਿਨ ਵਿੱਚ/g, "$1 ਦਿਨਾਂ ਵਿੱਚ")
    .replace(/1 ਘੰਟਾ ਵਿੱਚ/g, "ਇੱਕ ਘੰਟੇ ਵਿੱਚ")
    .replace(/([2-9]|\d{2,}) ਘੰਟਾ ਵਿੱਚ/g, "$1 ਘੰਟਿਆਂ ਵਿੱਚ")
    .replace(/([2-9]|\d{2,}) ਘੰਟੇ ਵਿੱਚ/g, "$1 ਘੰਟਿਆਂ ਵਿੱਚ");
}
