import type { Avg001QuestionPackage } from "./types";

export const AVG_001_CP005_EXAM_STRATEGY =
  "AVG-CP-005 compact exam shortcut and trap guidance v1";

type SupportedLanguage = "en" | "hi" | "pa";

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

  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake":
      return sentence(
        language,
        language === "hi"
          ? "शुद्ध प्रविष्टि-सुधार को प्रति मान बाँटकर बताए गए औसत पर सीधे लागू करें"
          : language === "pa"
            ? "ਸ਼ੁੱਧ ਐਂਟਰੀ-ਸੁਧਾਰ ਨੂੰ ਪ੍ਰਤੀ ਮੁੱਲ ਵੰਡ ਕੇ ਦਰਜ ਔਸਤ ਉੱਤੇ ਸਿੱਧਾ ਲਗਾਓ"
            : "spread the net entry correction per item and apply it directly to the reported average",
        language === "hi"
          ? "सुधार हमेशा सही मान घटा गलत मान है, इसका उल्टा नहीं"
          : language === "pa"
            ? "ਸੁਧਾਰ ਹਮੇਸ਼ਾ ਸਹੀ ਮੁੱਲ ਵਿੱਚੋਂ ਗਲਤ ਮੁੱਲ ਘਟਾ ਕੇ ਮਿਲਦਾ ਹੈ, ਇਸ ਦਾ ਉਲਟ ਨਹੀਂ"
            : "the correction is correct value minus wrong value, never the reverse",
        conclusion,
      );

    case "findReportedAverageBeforeCorrection":
      return sentence(
        language,
        language === "hi"
          ? "सही औसत से प्रति मान सुधार का प्रभाव उल्टा करके पुराना बताया गया औसत पाएँ"
          : language === "pa"
            ? "ਸਹੀ ਔਸਤ ਤੋਂ ਪ੍ਰਤੀ ਮੁੱਲ ਸੁਧਾਰ ਦਾ ਪ੍ਰਭਾਵ ਉਲਟ ਕਰਕੇ ਪੁਰਾਣੀ ਦਰਜ ਔਸਤ ਲਵੋ"
            : "reverse the per-item correction from the corrected average to recover the reported average",
        language === "hi"
          ? "पुराने औसत पर लौटते समय सुधार की दिशा भी उलटती है"
          : language === "pa"
            ? "ਪੁਰਾਣੀ ਔਸਤ ਵੱਲ ਮੁੜਦੇ ਸਮੇਂ ਸੁਧਾਰ ਦੀ ਦਿਸ਼ਾ ਵੀ ਉਲਟਦੀ ਹੈ"
            : "the correction direction reverses when moving back to the reported average",
        conclusion,
      );

    case "findCorrectValueFromAverageShift":
      return sentence(
        language,
        language === "hi"
          ? "औसत-अंतर को कुल संख्या से गुणा करके प्रविष्टि का पूरा सुधार निकालें"
          : language === "pa"
            ? "ਔਸਤ-ਅੰਤਰ ਨੂੰ ਕੁੱਲ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਐਂਟਰੀ ਦਾ ਪੂਰਾ ਸੁਧਾਰ ਕੱਢੋ"
            : "turn the average shift into a total shift and apply it to the wrong value",
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
        language === "hi"
          ? "औसत-अंतर का कुल प्रभाव निकालकर सही मान से पीछे की ओर काम करें"
          : language === "pa"
            ? "ਔਸਤ-ਅੰਤਰ ਦਾ ਕੁੱਲ ਪ੍ਰਭਾਵ ਕੱਢ ਕੇ ਸਹੀ ਮੁੱਲ ਤੋਂ ਪਿੱਛੇ ਵੱਲ ਕੰਮ ਕਰੋ"
            : "convert the average shift to a total correction and work backward from the correct value",
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
        language === "hi"
          ? "औसत में परिवर्तन का परिमाण कुल संख्या से गुणा करके प्रविष्टि-अंतर पाएँ"
          : language === "pa"
            ? "ਔਸਤ ਦੀ ਤਬਦੀਲੀ ਦਾ ਪਰਿਮਾਣ ਕੁੱਲ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਐਂਟਰੀ-ਅੰਤਰ ਲਵੋ"
            : "multiply the magnitude of the average shift by the count to recover the entry difference",
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
        language === "hi"
          ? "प्रविष्टि-अंतर को पूरे समूह में बाँटकर औसत का परिवर्तन पाएँ"
          : language === "pa"
            ? "ਐਂਟਰੀ-ਅੰਤਰ ਨੂੰ ਪੂਰੇ ਸਮੂਹ ਵਿੱਚ ਵੰਡ ਕੇ ਔਸਤ ਦੀ ਤਬਦੀਲੀ ਲਵੋ"
            : "spread the entry difference over the full group to obtain the average change",
        language === "hi"
          ? "कुल संख्या लें, संख्या में एक जोड़ें या घटाएँ नहीं"
          : language === "pa"
            ? "ਕੁੱਲ ਗਿਣਤੀ ਲਵੋ, ਗਿਣਤੀ ਵਿੱਚ ਇੱਕ ਜੋੜੋ ਜਾਂ ਘਟਾਓ ਨਾ"
            : "use the full count; do not use count plus or minus one",
        conclusion,
      );

    case "findNumberOfItemsFromTotalCorrection":
      return sentence(
        language,
        language === "hi"
          ? "कुल प्रविष्टि-त्रुटि को प्रति मान औसत-परिवर्तन से बाँटकर संख्या पाएँ"
          : language === "pa"
            ? "ਕੁੱਲ ਐਂਟਰੀ-ਗਲਤੀ ਨੂੰ ਪ੍ਰਤੀ ਮੁੱਲ ਔਸਤ-ਤਬਦੀਲੀ ਨਾਲ ਵੰਡ ਕੇ ਗਿਣਤੀ ਲਵੋ"
            : "divide the total entry error by the average change per item to recover the count",
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
        language === "hi"
          ? "सभी प्रविष्टि-सुधार उनके चिह्न सहित जोड़कर प्रति मान शुद्ध सुधार लागू करें"
          : language === "pa"
            ? "ਸਾਰੇ ਐਂਟਰੀ-ਸੁਧਾਰ ਉਨ੍ਹਾਂ ਦੇ ਚਿੰਨ੍ਹਾਂ ਸਮੇਤ ਜੋੜ ਕੇ ਪ੍ਰਤੀ ਮੁੱਲ ਸ਼ੁੱਧ ਸੁਧਾਰ ਲਗਾਓ"
            : "combine every signed entry correction, then spread the net correction over the count",
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
