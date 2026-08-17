import { applySapLocalizationPolishV2 } from "./polish-v2";
import type { SapTranslationLanguage } from "./types";

function normalizePunjabiPunctuation(value: string, language: SapTranslationLanguage) {
  return language === "pa"
    ? value.replace(/[।॥]/gu, ".")
    : value;
}

export function applySapLocalizationPolishV3(pkg: any, language: SapTranslationLanguage) {
  const base = applySapLocalizationPolishV2(pkg, language);
  const options = Object.freeze(
    base.options.map((option: unknown) => normalizePunjabiPunctuation(String(option ?? ""), language)),
  );
  const correctIndex = Number(base.correctIndex);
  const answer = options[correctIndex];
  const explanationLines = Object.freeze(
    (base.explanation?.lines ?? []).map((line: unknown) =>
      normalizePunjabiPunctuation(String(line ?? ""), language),
    ),
  );
  return Object.freeze({
    ...base,
    stem: normalizePunjabiPunctuation(String(base.stem ?? ""), language),
    options,
    correctIndex,
    answer,
    explanation: Object.freeze({ lines: explanationLines }),
    traceability: Object.freeze({
      ...(base.traceability ?? {}),
      localizationEditorialPolish: "SAP-HI-PA-EDITORIAL-POLISH-V3",
    }),
  });
}
