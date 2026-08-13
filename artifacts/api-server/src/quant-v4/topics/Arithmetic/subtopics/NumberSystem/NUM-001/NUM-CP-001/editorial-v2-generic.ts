import { buildLocalizedEditorialA } from "./editorial-v2-localized-a";
import { buildLocalizedEditorialB } from "./editorial-v2-localized-b";
import { polishLocalizedEditorialSurface } from "./editorial-v2-localized-polish";

export function buildGenericEditorialSurface(frozen: any, language: "en" | "hi" | "pa") {
  if (language !== "en") {
    const localized = buildLocalizedEditorialA(frozen, language, Number(frozen.seed)) ?? buildLocalizedEditorialB(frozen, language, Number(frozen.seed));
    if (localized) return polishLocalizedEditorialSurface(localized, language);
  }
  const math = (value: string) => `\\(${value}\\)`;
  const cleanText = (value: string) => value
    .replace(/admissible/giu, "allowed")
    .replace(/topology/giu, "case")
    .replace(/candidate-set/giu, "possible-value")
    .replace(/residue condition/giu, "divisibility condition")
    .replace(/universal guarantee/giu, "always-divisible value")
    .replace(/sharpness/giu, "largest-value check")
    .replace(/√\s*(\d+)/gu, (_m, n) => math(`\\sqrt{${n}}`))
    .replace(/([A-Za-z0-9)]+)²/gu, (_m, base) => math(`${base}^{2}`))
    .replace(/([A-Za-z0-9)]+)³/gu, (_m, base) => math(`${base}^{3}`))
    .replace(/(-?\d+)\/1\b/gu, "$1");
  const formatOption = (value: string) => {
    const raw = value.trim().replace(/(-?\d+)\/1\b/gu, "$1");
    const root = raw.match(/^√(\d+)$/u);
    if (root) return math(`\\sqrt{${root[1]}}`);
    const fraction = raw.match(/^(-?\d+)\/(-?\d+)$/u);
    if (fraction) return math(`\\frac{${fraction[1]}}{${fraction[2]}}`);
    if (/^-?\d+(?:\.\d+)?$/u.test(raw)) return math(raw);
    return cleanText(raw);
  };
  const options = Object.freeze((frozen.options ?? []).map((option: any) => formatOption(String(option.value ?? option))));
  const correctIndex = Number(frozen.correctIndex);
  const answer = options[correctIndex] ?? String(frozen.canonicalAnswer);
  let stem = cleanText(String(frozen.stem));
  if (language === "en") stem = stem.replace(/^In this question, natural numbers begin at 1\.\s*/u, "").replace(/^Here\s+/u, "").replace(/\bguaranteed\b/giu, "always");
  if (language === "hi") stem = stem.replace(/^इस प्रश्न में प्राकृतिक संख्याएँ 1 से शुरू होती हैं।\s*/u, "");
  if (language === "pa") stem = stem.replace(/^ਇਸ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਕੁਦਰਤੀ ਸੰਖਿਆਵਾਂ 1 ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀਆਂ ਹਨ।\s*/u, "");
  const core = Array.isArray(frozen.explanation?.coreConcept) ? frozen.explanation.coreConcept.map(String) : [];
  const steps = Array.isArray(frozen.explanation?.stepByStep) ? frozen.explanation.stepByStep.map((value: unknown) => cleanText(String(value))).slice(0, 4) : [];
  const concept = cleanText(String(core[0] ?? "Use the relevant Number System rule."));
  const fallback = { stem, options, correctIndex, answer, concept, steps };
  return language === "en" ? fallback : polishLocalizedEditorialSurface(fallback, language);
}
