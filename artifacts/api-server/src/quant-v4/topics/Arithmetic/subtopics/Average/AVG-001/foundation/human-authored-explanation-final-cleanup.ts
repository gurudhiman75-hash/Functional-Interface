import type { Avg001QuestionPackage } from "./types";

function cleanRepeatedUnits(line: string) {
  return line
    .replace(/\b(units|runs|marks|kg|km\/h|km|years)\s+\1\b/gi, "$1")
    .replace(/\b(इकाइयाँ|अंक|किग्रा|किलोमीटर|किमी\/घंटा|किमी|रन|वर्ष)\s+\1\b/g, "$1")
    .replace(/\b(ਇਕਾਈਆਂ|ਅੰਕ|ਕਿਲੋਗ੍ਰਾਮ|ਕਿਮੀ\/ਘੰਟਾ|ਕਿਮੀ|ਦੌੜਾਂ|ਸਾਲ)\s+\1\b/g, "$1")
    .replaceAll("₹₹", "₹");
}

function softenFormalEnglish(line: string) {
  if (/\$\$/.test(line)) return line;
  return line
    .replace(/\breconstruct\b/gi, "rebuild")
    .replace(/\brecover\b/gi, "find")
    .replace(/\bderive\b/gi, "find")
    .replace(/\bdetermine\b/gi, "find")
    .replace(/\bweighted aggregation\b/gi, "weighted total")
    .replace(/\bsolve mode\b/gi, "method");
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

function elapsedAgeOpening(pkg: Avg001QuestionPackage) {
  const scenario = String(pkg.parameters.scenarioVariant ?? "");
  if (!/(?:AfterYears|ElapsedYears)/.test(scenario)) return undefined;

  const years = rendered(pkg, "yearsElapsed") || rendered(pkg, "elapsedYears");
  const shownYears = years || (pkg.language === "en" ? "the elapsed" : "");

  if (pkg.language === "hi") {
    if (scenario === "newbornAfterElapsedYears") {
      return years
        ? `${years} वर्ष बाद, मूल आयुओं से पुराना कुल निकालें; नवजात की आयु शून्य है।`
        : "बीते वर्षों के बाद मूल आयुओं से पुराना कुल निकालें; नवजात की आयु शून्य है।";
    }
    if (scenario === "childJoinsFamilyAfterYears") {
      return years
        ? `${years} वर्ष बाद, मूल आयुओं को बढ़ाकर बच्चे की आयु पुराने कुल में जोड़ें।`
        : "बीते वर्षों के बाद मूल आयुओं को बढ़ाकर बच्चे की आयु पुराने कुल में जोड़ें।";
    }
    return years
      ? `${years} वर्ष बाद, मूल आयुओं को अद्यतन करके पुराना कुल निकालें।`
      : "बीते वर्षों के बाद मूल आयुओं को अद्यतन करके पुराना कुल निकालें।";
  }

  if (pkg.language === "pa") {
    if (scenario === "newbornAfterElapsedYears") {
      return years
        ? `${years} ਸਾਲ ਬਾਅਦ, ਮੂਲ ਉਮਰਾਂ ਤੋਂ ਪੁਰਾਣਾ ਕੁੱਲ ਕੱਢੋ; ਨਵਜੰਮੇ ਦੀ ਉਮਰ ਸਿਫ਼ਰ ਹੈ।`
        : "ਬੀਤੇ ਸਾਲਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ ਉਮਰਾਂ ਤੋਂ ਪੁਰਾਣਾ ਕੁੱਲ ਕੱਢੋ; ਨਵਜੰਮੇ ਦੀ ਉਮਰ ਸਿਫ਼ਰ ਹੈ।";
    }
    if (scenario === "childJoinsFamilyAfterYears") {
      return years
        ? `${years} ਸਾਲ ਬਾਅਦ, ਮੂਲ ਉਮਰਾਂ ਵਧਾ ਕੇ ਬੱਚੇ ਦੀ ਉਮਰ ਪੁਰਾਣੇ ਕੁੱਲ ਵਿੱਚ ਜੋੜੋ।`
        : "ਬੀਤੇ ਸਾਲਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ ਉਮਰਾਂ ਵਧਾ ਕੇ ਬੱਚੇ ਦੀ ਉਮਰ ਪੁਰਾਣੇ ਕੁੱਲ ਵਿੱਚ ਜੋੜੋ।";
    }
    return years
      ? `${years} ਸਾਲ ਬਾਅਦ, ਮੂਲ ਉਮਰਾਂ ਨੂੰ ਅਪਡੇਟ ਕਰਕੇ ਪੁਰਾਣਾ ਕੁੱਲ ਕੱਢੋ।`
      : "ਬੀਤੇ ਸਾਲਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ ਉਮਰਾਂ ਨੂੰ ਅਪਡੇਟ ਕਰਕੇ ਪੁਰਾਣਾ ਕੁੱਲ ਕੱਢੋ।";
  }

  if (scenario === "newbornAfterElapsedYears") {
    return `After ${shownYears} years, update the original ages to form the old total; the newborn adds zero years.`;
  }
  if (scenario === "childJoinsFamilyAfterYears") {
    return `After ${shownYears} years, update the original ages before adding the joining child's age to the old total.`;
  }
  return `After ${shownYears} years, update every original age before forming the old total.`;
}

export function finalizeAvg001ExplanationCleanup(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const cleaned = pkg.explanation.lines.map((line) => {
    const shortened = pkg.canonicalProblemId === "AVG-CP-006"
      ? shortenCp006Concept(line)
      : line;
    const unitClean = cleanRepeatedUnits(shortened);
    return pkg.language === "en" ? softenFormalEnglish(unitClean) : unitClean;
  });

  const lines = cleaned.length > 1
    ? [cleaned[0]!, ...cleaned.slice(2)]
    : cleaned;
  const ageOpening = elapsedAgeOpening(pkg);
  if (ageOpening && lines.length) lines[0] = ageOpening;

  return {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      explanationFinalCleanup: "AVG-001 explanation final cleanup v6",
      explanationLineContract: "AVG-001 four-line explanations v1",
    },
  };
}
