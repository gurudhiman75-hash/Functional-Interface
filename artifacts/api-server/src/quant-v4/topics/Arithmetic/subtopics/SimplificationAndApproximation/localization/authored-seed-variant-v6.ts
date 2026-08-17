import type { SapTranslationLanguage } from "./types";

function L(language: SapTranslationLanguage, hi: string, pa: string) {
  return language === "hi" ? hi : pa;
}

export function applySapAuthoredSeedVariantV6(base: any, current: any, language: SapTranslationLanguage) {
  if (String(base.questionLanguageId ?? "") !== "SAP-QL-148") return current;
  const english = String(base.stem ?? "").trim();
  const tail = english.match(/([\d.]+\s*[×÷]\s*[\d.]+)\.?$/u)?.[1]
    ?? english.match(/(\\\([\s\S]*?\\\))\.?$/u)?.[1];
  if (!tail) return current;
  const stem = L(
    language,
    `आवश्यक संख्याओं को निकटतम पूर्णांक तक पूर्णांकित करके अनुमान लगाइए: ${tail}`,
    `ਲੋੜੀਂਦੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਤੱਕ ਰਾਊਂਡ ਕਰਕੇ ਅੰਦਾਜ਼ਾ ਲਗਾਓ: ${tail}`,
  );
  return Object.freeze({
    ...current,
    stem,
    traceability: Object.freeze({
      ...(current.traceability ?? {}),
      localizedSeedVariantFix: "SAP-QL-148-AUTHORED-SEED-VARIANT-V6",
    }),
  });
}
