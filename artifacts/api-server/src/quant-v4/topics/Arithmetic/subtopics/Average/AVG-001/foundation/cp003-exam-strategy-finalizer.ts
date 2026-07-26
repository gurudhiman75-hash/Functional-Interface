import type { Avg001QuestionPackage } from "./types";

export const AVG_001_CP003_EXAM_STRATEGY =
  "AVG-CP-003 compact exam shortcut and trap guidance v1";

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
    return `${conclusion} परीक्षा शॉर्टकट: ${shortcut}। सामान्य भूल: ${trap}।`;
  }
  if (language === "pa") {
    return `${conclusion} ਇਮਤਿਹਾਨੀ ਛੋਟਾ ਤਰੀਕਾ: ${shortcut}। ਆਮ ਗਲਤੀ: ${trap}।`;
  }
  return `${conclusion} Exam shortcut: ${shortcut}. Trap: ${trap}.`;
}

function strategyLine(pkg: Avg001QuestionPackage, conclusion: string) {
  const language = languageOf(pkg);

  switch (pkg.solveMode) {
    case "findNewAverageAfterAddition":
      return sentence(
        language,
        language === "hi"
          ? "जुड़े मान और पुराने औसत का अंतर नई संख्या में बाँटकर पुराना औसत समायोजित करें"
          : language === "pa"
            ? "ਜੁੜੇ ਮੁੱਲ ਅਤੇ ਪੁਰਾਣੀ ਔਸਤ ਦਾ ਅੰਤਰ ਨਵੀਂ ਗਿਣਤੀ ਵਿੱਚ ਵੰਡ ਕੇ ਪੁਰਾਣੀ ਔਸਤ ਠੀਕ ਕਰੋ"
            : "spread the added value's difference from the old average over the new count",
        language === "hi"
          ? "भाग नई संख्या से दें, पुरानी से नहीं"
          : language === "pa"
            ? "ਭਾਗ ਨਵੀਂ ਗਿਣਤੀ ਨਾਲ ਦਿਓ, ਪੁਰਾਣੀ ਨਾਲ ਨਹੀਂ"
            : "divide by the new count, not the old count",
        conclusion,
      );

    case "findNewAverageAfterRemoval":
      return sentence(
        language,
        language === "hi"
          ? "पुराने औसत और हटे मान का अंतर शेष संख्या में बाँटकर औसत बदलें"
          : language === "pa"
            ? "ਪੁਰਾਣੀ ਔਸਤ ਅਤੇ ਹਟੇ ਮੁੱਲ ਦਾ ਅੰਤਰ ਬਾਕੀ ਗਿਣਤੀ ਵਿੱਚ ਵੰਡ ਕੇ ਔਸਤ ਬਦਲੋ"
            : "spread the gap between the old average and removed value over the remaining count",
        language === "hi"
          ? "शेष संख्या लें और अंतर का चिह्न न बदलें"
          : language === "pa"
            ? "ਬਾਕੀ ਗਿਣਤੀ ਲਵੋ ਅਤੇ ਅੰਤਰ ਦਾ ਚਿੰਨ੍ਹ ਨਾ ਬਦਲੋ"
            : "use the remaining count and keep the direction of the difference",
        conclusion,
      );

    case "findNewAverageAfterReplacement":
      return sentence(
        language,
        language === "hi"
          ? "नए और पुराने मान का अंतर अपरिवर्तित संख्या में बाँटकर औसत समायोजित करें"
          : language === "pa"
            ? "ਨਵੇਂ ਅਤੇ ਪੁਰਾਣੇ ਮੁੱਲ ਦਾ ਅੰਤਰ ਨਾ ਬਦਲੀ ਗਿਣਤੀ ਵਿੱਚ ਵੰਡ ਕੇ ਔਸਤ ਠੀਕ ਕਰੋ"
            : "divide new value minus old value by the unchanged count and adjust the average",
        language === "hi"
          ? "बदलाव में समूह की संख्या नहीं बदलती"
          : language === "pa"
            ? "ਬਦਲੀ ਵਿੱਚ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਨਹੀਂ ਬਦਲਦੀ"
            : "replacement does not change the group count",
        conclusion,
      );

    case "findAddedMemberValueFromShift":
      return sentence(
        language,
        language === "hi"
          ? "औसत-वृद्धि को पुरानी संख्या से गुणा करके नया औसत जोड़ें"
          : language === "pa"
            ? "ਔਸਤ-ਵਾਧੇ ਨੂੰ ਪੁਰਾਣੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਨਵੀਂ ਔਸਤ ਜੋੜੋ"
            : "multiply the average rise by the old count, then add the new average",
        language === "hi"
          ? "गुणा पुरानी संख्या से करें और नया औसत जोड़ना न भूलें"
          : language === "pa"
            ? "ਗੁਣਾ ਪੁਰਾਣੀ ਗਿਣਤੀ ਨਾਲ ਕਰੋ ਅਤੇ ਨਵੀਂ ਔਸਤ ਜੋੜਨੀ ਨਾ ਭੁੱਲੋ"
            : "use the old count in the product and include the new average",
        conclusion,
      );

    case "findRemovedMemberValueFromShift":
      return sentence(
        language,
        language === "hi"
          ? "पुराने और नए औसत का अंतर पुरानी संख्या से गुणा करके नया औसत जोड़ें"
          : language === "pa"
            ? "ਪੁਰਾਣੀ ਅਤੇ ਨਵੀਂ ਔਸਤ ਦਾ ਅੰਤਰ ਪੁਰਾਣੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਨਵੀਂ ਔਸਤ ਜੋੜੋ"
            : "multiply old average minus new average by the old count, then add the new average",
        language === "hi"
          ? "गुणा पुरानी संख्या से करें, शेष संख्या से नहीं"
          : language === "pa"
            ? "ਗੁਣਾ ਪੁਰਾਣੀ ਗਿਣਤੀ ਨਾਲ ਕਰੋ, ਬਾਕੀ ਗਿਣਤੀ ਨਾਲ ਨਹੀਂ"
            : "multiply by the old count, not the remaining count",
        conclusion,
      );

    case "findReplacementValueFromShift":
      return sentence(
        language,
        language === "hi"
          ? "औसत-परिवर्तन को समूह-संख्या से गुणा करके पुराने मान में जोड़ें"
          : language === "pa"
            ? "ਔਸਤ-ਤਬਦੀਲੀ ਨੂੰ ਸਮੂਹ-ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਪੁਰਾਣੇ ਮੁੱਲ ਵਿੱਚ ਜੋੜੋ"
            : "multiply the average change by the group count and add it to the replaced value",
        language === "hi"
          ? "बदली के समय संख्या वही रहती है"
          : language === "pa"
            ? "ਬਦਲੀ ਵੇਲੇ ਗਿਣਤੀ ਉਹੀ ਰਹਿੰਦੀ ਹੈ"
            : "the count stays unchanged during replacement",
        conclusion,
      );

    case "findInningsValueOrNewCricketAverage":
      if (pkg.parameters.answerType === "AVERAGE") {
        return sentence(
          language,
          language === "hi"
            ? "अगली पारी के रन और पुराने औसत का अंतर नई पारी-संख्या में बाँटें"
            : language === "pa"
              ? "ਅਗਲੀ ਪਾਰੀ ਦੀਆਂ ਦੌੜਾਂ ਅਤੇ ਪੁਰਾਣੀ ਔਸਤ ਦਾ ਅੰਤਰ ਨਵੀਂ ਪਾਰੀ-ਗਿਣਤੀ ਵਿੱਚ ਵੰਡੋ"
              : "spread the next score's difference from the old average over the new innings count",
          language === "hi"
            ? "हर नई पारी को हर में शामिल करें"
            : language === "pa"
              ? "ਹਰ ਨਵੀਂ ਪਾਰੀ ਨੂੰ ਹਰ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ"
              : "include the new innings in the denominator",
          conclusion,
        );
      }
      return sentence(
        language,
        language === "hi"
          ? "लक्षित औसत-वृद्धि को मौजूदा पारियों से गुणा करके लक्षित औसत जोड़ें"
          : language === "pa"
            ? "ਟੀਚੇ ਵਾਲੇ ਔਸਤ-ਵਾਧੇ ਨੂੰ ਮੌਜੂਦਾ ਪਾਰੀਆਂ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਟੀਚਾ ਔਸਤ ਜੋੜੋ"
            : "multiply the target average rise by the current innings, then add the target average",
        language === "hi"
          ? "लक्षित कुल में अगली पारी भी शामिल होती है"
          : language === "pa"
            ? "ਟੀਚੇ ਵਾਲੇ ਕੁੱਲ ਵਿੱਚ ਅਗਲੀ ਪਾਰੀ ਵੀ ਸ਼ਾਮਲ ਹੁੰਦੀ ਹੈ"
            : "the target total includes one additional innings",
        conclusion,
      );

    case "findOriginalCountFromJoiningMemberShift":
      return sentence(
        language,
        language === "hi"
          ? "नए सदस्य की पुराने औसत से अधिकता को औसत-वृद्धि से भाग देकर एक घटाएँ"
          : language === "pa"
            ? "ਨਵੇਂ ਮੈਂਬਰ ਦੀ ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ ਵਾਧੂ ਰਕਮ ਨੂੰ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਇੱਕ ਘਟਾਓ"
            : "divide the member's excess over the old average by the average rise, then subtract one",
        language === "hi"
          ? "जुड़ने वाले प्रश्न में अंतिम एक घटाना न भूलें"
          : language === "pa"
            ? "ਜੁੜਨ ਵਾਲੇ ਸਵਾਲ ਵਿੱਚ ਅਖੀਰਲਾ ਇੱਕ ਘਟਾਉਣਾ ਨਾ ਭੁੱਲੋ"
            : "a joining-member count needs the final minus one",
        conclusion,
      );

    case "findOriginalCountFromLeavingMemberShift":
      return sentence(
        language,
        language === "hi"
          ? "हटे सदस्य का पुराने औसत से अंतर औसत-परिवर्तन से भाग देकर एक जोड़ें"
          : language === "pa"
            ? "ਹਟੇ ਮੈਂਬਰ ਦਾ ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ ਅੰਤਰ ਔਸਤ-ਤਬਦੀਲੀ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਇੱਕ ਜੋੜੋ"
            : "divide the member's gap from the old average by the average change, then add one",
        language === "hi"
          ? "हटने वाले प्रश्न में अंतिम एक जोड़ें, घटाएँ नहीं"
          : language === "pa"
            ? "ਹਟਣ ਵਾਲੇ ਸਵਾਲ ਵਿੱਚ ਅਖੀਰਲਾ ਇੱਕ ਜੋੜੋ, ਘਟਾਓ ਨਾ"
            : "a leaving-member count needs plus one, not minus one",
        conclusion,
      );

    default:
      return conclusion;
  }
}

export function applyAvg001Cp003ExamStrategy(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-003" || pkg.explanation.lines.length !== 4) {
    return pkg;
  }

  const lines = [...pkg.explanation.lines];
  lines[3] = strategyLine(pkg, lines[3]!);

  return {
    ...pkg,
    explanation: { ...pkg.explanation, lines },
    traceability: {
      ...pkg.traceability,
      cp003ExamStrategyFinalizer: AVG_001_CP003_EXAM_STRATEGY,
    },
  };
}
