import { applyAvg001HumanAuthoredExplanation as applyBasePlanner } from "./human-authored-explanation";
import type { Avg001QuestionPackage } from "./types";

function hasSubstitutedArithmetic(line: string) {
  return (
    line.includes("\\times") ||
    line.includes("\\div") ||
    line.includes("×") ||
    line.includes("÷") ||
    /[+\-]=?/.test(line)
  );
}

function rendered(pkg: Avg001QuestionPackage, key: string) {
  return String(pkg.parameters.renderVariables[key] ?? "");
}

function naturalizeOpening(pkg: Avg001QuestionPackage) {
  const lines = [...pkg.explanation.lines];
  if (!lines.length) return pkg;
  if (pkg.language === "hi") {
    lines[0] = lines[0]!
      .replace("कुल = औसत × संख्या।", "कुल पाने के लिए औसत को संख्या से गुणा किया जाता है।")
      .replace("औसत = कुल ÷ संख्या।", "औसत पाने के लिए कुल को संख्या से भाग दिया जाता है।")
      .replace("संख्या = कुल ÷ औसत।", "संख्या पाने के लिए कुल को औसत से भाग दिया जाता है।")
      .replace("लापता मान = अपेक्षित कुल - ज्ञात उप-कुल।", "लापता मान पाने के लिए अपेक्षित कुल में से ज्ञात उप-कुल घटाया जाता है।");
  } else if (pkg.language === "pa") {
    lines[0] = lines[0]!
      .replace("ਕੁੱਲ = ਔਸਤ × ਗਿਣਤੀ।", "ਕੁੱਲ ਲੱਭਣ ਲਈ ਔਸਤ ਨੂੰ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।")
      .replace("ਔਸਤ = ਕੁੱਲ ÷ ਗਿਣਤੀ।", "ਔਸਤ ਲੱਭਣ ਲਈ ਕੁੱਲ ਨੂੰ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।")
      .replace("ਗਿਣਤੀ = ਕੁੱਲ ÷ ਔਸਤ।", "ਗਿਣਤੀ ਲੱਭਣ ਲਈ ਕੁੱਲ ਨੂੰ ਔਸਤ ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।")
      .replace("ਗੁੰਮ ਮੁੱਲ = ਲੋੜੀਂਦਾ ਕੁੱਲ - ਜਾਣਿਆ ਉਪ-ਕੁੱਲ।", "ਗੁੰਮ ਮੁੱਲ ਲੱਭਣ ਲਈ ਲੋੜੀਂਦੇ ਕੁੱਲ ਵਿੱਚੋਂ ਜਾਣਿਆ ਉਪ-ਕੁੱਲ ਘਟਾਇਆ ਜਾਂਦਾ ਹੈ।");
  }
  return { ...pkg, explanation: { lines } };
}

function reconstructedArithmetic(pkg: Avg001QuestionPackage) {
  if (pkg.solveMode === "findMiddleTermFromAverage") {
    const first = rendered(pkg, "firstTerm");
    const last = rendered(pkg, "lastTerm");
    if (first && last) {
      if (pkg.language === "hi") return `$$मध्य पद = (${first} + ${last}) \\div 2 = ${pkg.answer}$$`;
      if (pkg.language === "pa") return `$$ਮੱਧਲਾ ਪਦ = (${first} + ${last}) \\div 2 = ${pkg.answer}$$`;
      return `$$Middle term = (${first} + ${last}) \\div 2 = ${pkg.answer}$$`;
    }
  }
  return undefined;
}

export function applyAvg001HumanAuthoredExplanation(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const planned = naturalizeOpening(applyBasePlanner(pkg));
  if (planned.explanation.lines.some(hasSubstitutedArithmetic)) return planned;

  const verifiedArithmetic =
    pkg.explanation.lines.find(hasSubstitutedArithmetic) ?? reconstructedArithmetic(pkg);
  if (!verifiedArithmetic) return planned;

  const lines = [...planned.explanation.lines];
  const insertionIndex = Math.max(1, lines.length - 2);
  lines.splice(insertionIndex, 0, verifiedArithmetic);
  return {
    ...planned,
    explanation: { lines: lines.slice(0, 8) },
  };
}
