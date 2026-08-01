import type { TmwLocalizedLanguage } from "./localization-types";

export function polishTmwCp009Text(
  text: string,
  language: TmwLocalizedLanguage,
): string {
  if (language === "hi") {
    return text
      .replace(/((?:[2-9]|\d{2,})) घंटे में/g, "$1 घंटों में")
      .replace(/((?:[2-9]|\d{2,})) घंटे के भीतर/g, "$1 घंटों के भीतर")
      .replace(/पाइपें एक साथ खोलने/g, "पाइपों को एक साथ खोलने")
      .replace(/सभी पाइपें लगातार खुली रहती हैं/g, "सभी पाइप लगातार खुले रहते हैं")
      .replace(/सभी पाइपें एक साथ खोलने पर/g, "सभी पाइप एक साथ खोलने पर")
      .replace(/ज्ञात पाइपें:/g, "ज्ञात पाइप:");
  }
  return text
    .replace(/अकेले/g, "ਇਕੱਲੀ")
    .replace(/में टंकी भरती है/g, "ਵਿੱਚ ਟੈਂਕੀ ਭਰਦੀ ਹੈ")
    .replace(/में टंकी खाली करती है/g, "ਵਿੱਚ ਟੈਂਕੀ ਖਾਲੀ ਕਰਦੀ ਹੈ")
    .replace(/टंकी/g, "ਟੈਂਕੀ")
    .replace(/भरती है/g, "ਭਰਦੀ ਹੈ")
    .replace(/खाली करती है/g, "ਖਾਲੀ ਕਰਦੀ ਹੈ")
    .replace(/में/g, "ਵਿੱਚ")
    .replace(/((?:[2-9]|\d{2,})) ਘੰਟੇ ਵਿੱਚ/g, "$1 ਘੰਟਿਆਂ ਵਿੱਚ")
    .replace(/((?:[2-9]|\d{2,})) ਘੰਟੇ ਦੇ ਅੰਦਰ/g, "$1 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ")
    .replace(/ਪਤਾ ਪਾਈਪਾਂ:/g, "ਪਤਾ ਪਾਈਪ:");
}
