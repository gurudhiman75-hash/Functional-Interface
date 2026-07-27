import type { Avg001QuestionPackage } from "./types";

const REPLACEMENTS = {
  en: {
    from: "The enlarged group uses one additional observation after the incoming value is added.",
    to: "The reduced group uses one fewer observation after the outgoing value is removed.",
  },
  hi: {
    from: "नया मान जुड़ने के बाद बड़े समूह में एक प्रेक्षण अधिक होता है।",
    to: "मान हटने के बाद छोटे समूह में एक प्रेक्षण कम रहता है।",
  },
  pa: {
    from: "ਨਵਾਂ ਮੁੱਲ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਵੱਡੇ ਸਮੂਹ ਵਿੱਚ ਇੱਕ ਪ੍ਰੇਖਣ ਵੱਧ ਹੁੰਦਾ ਹੈ।",
    to: "ਮੁੱਲ ਹਟਣ ਤੋਂ ਬਾਅਦ ਛੋਟੇ ਸਮੂਹ ਵਿੱਚ ਇੱਕ ਪ੍ਰੇਖਣ ਘੱਟ ਰਹਿੰਦਾ ਹੈ।",
  },
} as const;

export function applyAvg001Cp003RemovedMemberSupportFix(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (
    pkg.canonicalProblemId !== "AVG-CP-003" ||
    pkg.solveMode !== "findRemovedMemberValueFromShift"
  ) {
    return pkg;
  }

  const language = pkg.language === "hi" || pkg.language === "pa" ? pkg.language : "en";
  const replacement = REPLACEMENTS[language];
  let changed = false;
  const lines = pkg.explanation.lines.map((line) => {
    if (line !== replacement.from) return line;
    changed = true;
    return replacement.to;
  });
  if (!changed) return pkg;

  return {
    ...pkg,
    explanation: { ...pkg.explanation, lines },
    traceability: {
      ...pkg.traceability,
      cp003RemovedMemberSupportFix: "AVG-CP-003 removed-member support correction v1",
    },
  };
}
