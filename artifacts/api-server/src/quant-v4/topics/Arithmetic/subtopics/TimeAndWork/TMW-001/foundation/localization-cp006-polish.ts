import type { TmwLocalizedLanguage } from "./localization-types";

export function polishTmwCp006LocalizedProse(
  text: string,
  language: TmwLocalizedLanguage,
): string {
  if (language === "hi") {
    return text
      .replace(/\b1 दिन में\b/g, "एक दिन में")
      .replace(/\b([2-9]|\d{2,}) दिन में\b/g, "$1 दिनों में")
      .replace(/\b1 घंटा में\b/g, "एक घंटे में")
      .replace(/\b([2-9]|\d{2,}) घंटा में\b/g, "$1 घंटे में");
  }

  return text
    .replace(/\b1 ਦਿਨ ਵਿੱਚ\b/g, "ਇੱਕ ਦਿਨ ਵਿੱਚ")
    .replace(/\b([2-9]|\d{2,}) ਦਿਨ ਵਿੱਚ\b/g, "$1 ਦਿਨਾਂ ਵਿੱਚ")
    .replace(/\b1 ਘੰਟਾ ਵਿੱਚ\b/g, "ਇੱਕ ਘੰਟੇ ਵਿੱਚ")
    .replace(/\b([2-9]|\d{2,}) ਘੰਟਾ ਵਿੱਚ\b/g, "$1 ਘੰਟਿਆਂ ਵਿੱਚ")
    .replace(/\b([2-9]|\d{2,}) ਘੰਟੇ ਵਿੱਚ\b/g, "$1 ਘੰਟਿਆਂ ਵਿੱਚ");
}
