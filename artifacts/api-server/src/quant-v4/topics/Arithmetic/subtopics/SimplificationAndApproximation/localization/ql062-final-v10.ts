import type { SapTranslationLanguage } from "./types";

function L(language: SapTranslationLanguage, hi: string, pa: string) {
  return language === "hi" ? hi : pa;
}

function ql062Expression(english: string) {
  return english
    .replace(/^What is the exact value of\s*/u, "")
    .replace(/^What is the value of\s*/u, "")
    .replace(/^What is\s*/u, "")
    .replace(/^Find the exact value of\s*/u, "")
    .replace(/^Find the value of\s*/u, "")
    .replace(/^Evaluate\s*:?\s*/u, "")
    .replace(/^Simplify\s*:?\s*/u, "")
    .replace(/[?.]$/u, "")
    .trim();
}

export function applySapQl062FinalV10(base: any, current: any, language: SapTranslationLanguage) {
  if (String(base.questionLanguageId ?? "") !== "SAP-QL-062") return current;

  const expression = ql062Expression(String(base.stem ?? ""));
  const stem = L(
    language,
    `सटीक मान ज्ञात कीजिए: ${expression}`,
    `ਸਟੀਕ ਮੁੱਲ ਕੱਢੋ: ${expression}`,
  );

  return Object.freeze({
    ...current,
    stem,
    traceability: Object.freeze({
      ...(current.traceability ?? {}),
      localizedQl062Final: "SAP-QL062-FINAL-V10",
    }),
  });
}
