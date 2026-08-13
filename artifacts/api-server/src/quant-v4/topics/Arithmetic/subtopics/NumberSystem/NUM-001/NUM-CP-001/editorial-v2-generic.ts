export function buildGenericEditorialSurface(frozen: any, language: "en" | "hi" | "pa") {
  const math = (value: string) => `\\(${value}\\)`;
  const formatOption = (value: string) => {
    const raw = value.trim().replace(/(-?\d+)\/1\b/gu, "$1");
    const root = raw.match(/^√(\d+)$/u);
    if (root) return math(`\\sqrt{${root[1]}}`);
    const fraction = raw.match(/^(-?\d+)\/(-?\d+)$/u);
    if (fraction) return math(`\\frac{${fraction[1]}}{${fraction[2]}}`);
    if (/^-?\d+(?:\.\d+)?$/u.test(raw)) return math(raw);
    return raw;
  };
  const options = Object.freeze((frozen.options ?? []).map((option: any) => formatOption(String(option.value ?? option))));
  const correctIndex = Number(frozen.correctIndex);
  const answer = options[correctIndex] ?? String(frozen.canonicalAnswer);
  let stem = String(frozen.stem).replace(/√\s*(\d+)/gu, (_m, n) => math(`\\sqrt{${n}}`)).replace(/(-?\d+)\/1\b/gu, "$1");
  if (language === "en") stem = stem.replace(/^In this question, natural numbers begin at 1\.\s*/u, "").replace(/^Here\s+/u, "").replace(/\bguaranteed\b/giu, "always");
  const core = Array.isArray(frozen.explanation?.coreConcept) ? frozen.explanation.coreConcept.map(String) : [];
  const steps = Array.isArray(frozen.explanation?.stepByStep) ? frozen.explanation.stepByStep.map(String).slice(0, 4) : [];
  const concept = String(core[0] ?? "Use the relevant Number System rule.").replace(/admissible/giu, "allowed").replace(/topology/giu, "case");
  return { stem, options, correctIndex, answer, concept, steps };
}
