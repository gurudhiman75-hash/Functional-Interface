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

export function finalizeAvg001ExplanationCleanup(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const lines = pkg.explanation.lines.map((line) =>
    cleanRepeatedUnits(
      pkg.canonicalProblemId === "AVG-CP-006" ? shortenCp006Concept(line) : line,
    ),
  );
  return {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      explanationFinalCleanup: "AVG-001 explanation final cleanup v1",
    },
  };
}
