import type { Avg001QuestionPackage } from "./types";

export const AVG_001_CP005_EXAM_STRATEGY =
  "AVG-CP-005 compact exam shortcut and trap guidance v1";

type SupportedLanguage = "en" | "hi" | "pa";

function shown(pkg: Avg001QuestionPackage, key: string) {
  const value = pkg.parameters.renderVariables[key] ?? pkg.parameters.values[key];
  return value === undefined || value === null ? "" : String(value);
}

function numericAnswer(pkg: Avg001QuestionPackage) {
  return pkg.answer.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/)?.[0] ?? pkg.answer;
}

function languageOf(pkg: Avg001QuestionPackage): SupportedLanguage {
  return pkg.language === "hi" || pkg.language === "pa" ? pkg.language : "en";
}

function sentence(
  language: SupportedLanguage,
  shortcut: string,
  trap: string,
  conclusion: string,
) {
  if (language === "hi") {
    return `परीक्षा शॉर्टकट: ${shortcut}। सामान्य भूल: ${trap}। ${conclusion}`;
  }
  if (language === "pa") {
    return `ਇਮਤਿਹਾਨੀ ਛੋਟਾ ਤਰੀਕਾ: ${shortcut}। ਆਮ ਗਲਤੀ: ${trap}। ${conclusion}`;
  }
  return `Exam shortcut: ${shortcut}. Trap: ${trap}. ${conclusion}`;
}

function strategyLine(pkg: Avg001QuestionPackage, conclusion: string) {
  const language = languageOf(pkg);
  const count = shown(pkg, "count");
  const reported = shown(pkg, "reportedAverage");
  const corrected = shown(pkg, "correctedAverage");
  const wrong = shown(pkg, "incorrectValue");
  const correct = shown(pkg, "correctValue");
  const wrong2 = shown(pkg, "incorrectValue2");
  const correct2 = shown(pkg, "correctValue2");
  const difference = shown(pkg, "entryDifference");
  const averageChange = shown(pkg, "averageChange");
  const answer = numericAnswer(pkg);

  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake":
      return sentence(
        language,
        `${reported} + (${correct} - ${wrong}) ÷ ${count} = ${answer}`,
        language === "hi"
          ? "सुधार हमेशा सही मान − गलत मान है, इसका उल्टा नहीं"
          : language === "pa"
            ? "ਸੁਧਾਰ ਹਮੇਸ਼ਾ ਸਹੀ ਮੁੱਲ − ਗਲਤ ਮੁੱਲ ਹੈ, ਇਸ ਦਾ ਉਲਟ ਨਹੀਂ"
            : "the correction is correct value − wrong value, never the reverse",
        conclusion,
      );

    case "findReportedAverageBeforeCorrection":
      return sentence(
        language,
        `${corrected} - (${correct} - ${wrong}) ÷ ${count} = ${answer}`,
        language === "hi"
          ? "पुराने औसत पर लौटते समय सुधार का प्रभाव उल्टा करें"
          : language === "pa"
            ? "ਪੁਰਾਣੀ ਔਸਤ ਵੱਲ ਮੁੜਦੇ ਸਮੇਂ ਸੁਧਾਰ ਦਾ ਪ੍ਰਭਾਵ ਉਲਟ ਕਰੋ"
            : "reverse the correction when moving back to the reported average",
        conclusion,
      );

    case "findCorrectValueFromAverageShift":
      return sentence(
        language,
        `${wrong} + (${corrected} - ${reported}) × ${count} = ${answer}`,
        language === "hi"
          ? "औसत बढ़े तो कुल सुधार जोड़ें और घटे तो घटाएँ"
          : language === "pa"
            ? "ਔਸਤ ਵਧੇ ਤਾਂ ਕੁੱਲ ਸੁਧਾਰ ਜੋੜੋ ਅਤੇ ਘਟੇ ਤਾਂ ਘਟਾਓ"
            : "an average rise adds the total correction, while a fall subtracts it",
        conclusion,
      );

    case "findIncorrectValueFromCorrection":
      return sentence(
        language,
        `${correct} - (${corrected} - ${reported}) × ${count} = ${answer}`,
        language === "hi"
          ? "सही मान से पीछे जाते समय कुल सुधार घटाएँ"
          : language === "pa"
            ? "ਸਹੀ ਮੁੱਲ ਤੋਂ ਪਿੱਛੇ ਜਾਂਦੇ ਸਮੇਂ ਕੁੱਲ ਸੁਧਾਰ ਘਟਾਓ"
            : "work backward from the correct value by removing the total correction",
        conclusion,
      );

    case "findEntryDifferenceFromAverageCorrection":
      return sentence(
        language,
        `|${corrected} - ${reported}| × ${count} = ${answer}`,
        language === "hi"
          ? "औसत-अंतर का परिमाण लें, चिह्न नहीं"
          : language === "pa"
            ? "ਔਸਤ-ਅੰਤਰ ਦਾ ਪਰਿਮਾਣ ਲਵੋ, ਚਿੰਨ੍ਹ ਨਹੀਂ"
            : "use the magnitude of the average change, not its sign",
        conclusion,
      );

    case "findAverageChangeFromEntryCorrection":
      return sentence(
        language,
        `|${correct} - ${wrong}| ÷ ${count} = ${answer}`,
        language === "hi"
          ? "प्रविष्टि-अंतर को कुल संख्या से भाग दें, संख्या में एक जोड़ें या घटाएँ नहीं"
          : language === "pa"
            ? "ਐਂਟਰੀ-ਅੰਤਰ ਨੂੰ ਕੁੱਲ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ, ਗਿਣਤੀ ਵਿੱਚ ਇੱਕ ਜੋੜੋ ਜਾਂ ਘਟਾਓ ਨਾ"
            : "divide by the full count; do not use count plus or minus one",
        conclusion,
      );

    case "findNumberOfItemsFromTotalCorrection":
      return sentence(
        language,
        `${difference} ÷ ${averageChange} = ${answer}`,
        language === "hi"
          ? "कुल त्रुटि को औसत-परिवर्तन से भाग दें, गुणा नहीं"
          : language === "pa"
            ? "ਕੁੱਲ ਗਲਤੀ ਨੂੰ ਔਸਤ-ਤਬਦੀਲੀ ਨਾਲ ਭਾਗ ਦਿਓ, ਗੁਣਾ ਨਹੀਂ"
            : "divide total error by average change; do not multiply",
        conclusion,
      );

    case "findCorrectedAverageFromMultipleMistakes":
      return sentence(
        language,
        `${reported} + [(${correct} - ${wrong}) + (${correct2} - ${wrong2})] ÷ ${count} = ${answer}`,
        language === "hi"
          ? "हर सुधार का अपना धन या ऋण चिह्न बनाए रखें"
          : language === "pa"
            ? "ਹਰ ਸੁਧਾਰ ਦਾ ਆਪਣਾ ਧਨ ਜਾਂ ਰਿਣ ਚਿੰਨ੍ਹ ਕਾਇਮ ਰੱਖੋ"
            : "preserve the positive or negative sign of every correction",
        conclusion,
      );

    default:
      return conclusion;
  }
}

export function applyAvg001Cp005ExamStrategy(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-005" || pkg.explanation.lines.length !== 4) {
    return pkg;
  }

  const lines = [...pkg.explanation.lines];
  lines[3] = strategyLine(pkg, lines[3]!);

  return {
    ...pkg,
    explanation: { ...pkg.explanation, lines },
    traceability: {
      ...pkg.traceability,
      cp005ExamStrategyFinalizer: AVG_001_CP005_EXAM_STRATEGY,
    },
  };
}
