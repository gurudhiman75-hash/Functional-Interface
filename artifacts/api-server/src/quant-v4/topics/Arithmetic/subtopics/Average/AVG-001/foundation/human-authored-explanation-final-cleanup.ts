import type { Avg001QuestionPackage } from "./types";

function cleanRepeatedUnits(line: string) {
  return line
    .replace(/\b(units|runs|marks|kg|km\/h|km|years)\s+\1\b/gi, "$1")
    .replace(/\b(इकाइयाँ|अंक|किग्रा|किलोमीटर|किमी\/घंटा|किमी|रन|वर्ष)\s+\1\b/g, "$1")
    .replace(/\b(ਇਕਾਈਆਂ|ਅੰਕ|ਕਿਲੋਗ੍ਰਾਮ|ਕਿਮੀ\/ਘੰਟਾ|ਕਿਮੀ|ਦੌੜਾਂ|ਸਾਲ)\s+\1\b/g, "$1")
    .replaceAll("₹₹", "₹");
}

function shortenCp006Concept(line: string) {
  return line
    .replace(
      "the group totals and member counts must form the combined total before the final average is taken.",
      "combine group totals and member counts before taking the final average.",
    )
    .replace(
      "अंतिम औसत से पहले समूहों के कुल और सदस्य-संख्याएँ जोड़ी जाती हैं।",
      "अंतिम औसत से पहले समूह-कुल और सदस्य-संख्याएँ जोड़ें।",
    )
    .replace(
      "ਅੰਤਿਮ ਔਸਤ ਤੋਂ ਪਹਿਲਾਂ ਸਮੂਹਾਂ ਦੇ ਕੁੱਲ ਅਤੇ ਮੈਂਬਰ-ਗਿਣਤੀਆਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।",
      "ਅੰਤਿਮ ਔਸਤ ਤੋਂ ਪਹਿਲਾਂ ਸਮੂਹ-ਕੁੱਲ ਅਤੇ ਮੈਂਬਰ-ਗਿਣਤੀਆਂ ਜੋੜੋ।",
    );
}

function rendered(pkg: Avg001QuestionPackage, key: string) {
  const value = pkg.parameters.renderVariables[key] ?? pkg.parameters.values[key];
  return value === undefined || value === null ? "" : String(value);
}

function ageShiftMethod(pkg: Avg001QuestionPackage) {
  const scenario = String(pkg.parameters.scenarioVariant ?? "");
  if (!/(?:AfterYears|ElapsedYears)/.test(scenario)) return undefined;
  const years = rendered(pkg, "yearsElapsed") || rendered(pkg, "elapsedYears");
  if (pkg.language === "hi") {
    return years
      ? `${years} वर्ष बाद, समूह बदलने से पहले प्रत्येक मूल आयु में ${years} वर्ष जोड़ें।`
      : "समूह बदलने से पहले बीते वर्षों का प्रभाव प्रत्येक मूल आयु में जोड़ें।";
  }
  if (pkg.language === "pa") {
    return years
      ? `${years} ਸਾਲ ਬਾਅਦ, ਸਮੂਹ ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਹਰ ਮੂਲ ਉਮਰ ਵਿੱਚ ${years} ਸਾਲ ਜੋੜੋ।`
      : "ਸਮੂਹ ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਬੀਤੇ ਸਾਲਾਂ ਦਾ ਅਸਰ ਹਰ ਮੂਲ ਉਮਰ ਵਿੱਚ ਜੋੜੋ।";
  }
  return years
    ? `After ${years} years, add ${years} years to every original age before changing the group.`
    : "After the elapsed time, update every original age before changing the group.";
}

export function finalizeAvg001ExplanationCleanup(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const lines = pkg.explanation.lines.map((line) =>
    cleanRepeatedUnits(
      pkg.canonicalProblemId === "AVG-CP-006" ? shortenCp006Concept(line) : line,
    ),
  );
  const ageMethod = ageShiftMethod(pkg);
  if (ageMethod && lines.length > 1 && !lines.join(" ").toLowerCase().includes("after")) {
    lines[1] = ageMethod;
  }
  return {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      explanationFinalCleanup: "AVG-001 explanation final cleanup v2",
    },
  };
}
