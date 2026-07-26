import type { Avg001QuestionPackage } from "./types";

export const AVG_001_CP004_EXAM_STRATEGY =
  "AVG-CP-004 compact exam shortcut and trap guidance v1";

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
    case "findCombinedAverageOfTwoGroups":
      return sentence(
        language,
        language === "hi"
          ? "समूह-संख्या अनुपात से दोनों औसतों का अंतर बाँटें"
          : language === "pa"
            ? "ਸਮੂਹ-ਗਿਣਤੀ ਅਨੁਪਾਤ ਨਾਲ ਦੋਵਾਂ ਔਸਤਾਂ ਦਾ ਅੰਤਰ ਵੰਡੋ"
            : "use the group-count ratio to split the gap between the two averages",
        language === "hi"
          ? "समूह समान न हों तो दोनों औसतों का साधारण औसत न लें"
          : language === "pa"
            ? "ਸਮੂਹ ਬਰਾਬਰ ਨਾ ਹੋਣ ਤਾਂ ਦੋਵਾਂ ਔਸਤਾਂ ਦੀ ਸਧਾਰਣ ਔਸਤ ਨਾ ਲਵੋ"
            : "do not take the simple mean unless the group counts are equal",
        conclusion,
      );

    case "findCombinedAverageOfThreeOrFourGroups":
      return sentence(
        language,
        language === "hi"
          ? "पास का आधार औसत लें और चिह्नित भारित अंतर को कुल संख्या से बाँटें"
          : language === "pa"
            ? "ਨੇੜਲੀ ਆਧਾਰ ਔਸਤ ਲਵੋ ਅਤੇ ਚਿੰਨ੍ਹਿਤ ਭਾਰਿਤ ਅੰਤਰ ਨੂੰ ਕੁੱਲ ਗਿਣਤੀ ਨਾਲ ਵੰਡੋ"
            : "choose a nearby base and divide the signed weighted differences by the total count",
        language === "hi"
          ? "समूह औसतों को उनकी संख्याओं के बिना न जोड़ें"
          : language === "pa"
            ? "ਸਮੂਹ ਔਸਤਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਤੋਂ ਬਿਨਾਂ ਨਾ ਜੋੜੋ"
            : "group averages must carry their group counts",
        conclusion,
      );

    case "findGroupCountFromCombinedAverage":
      return sentence(
        language,
        language === "hi"
          ? "संयुक्त औसत से उलटी दूरियों का अनुपात लें और ज्ञात संख्या के अनुसार बढ़ाएँ"
          : language === "pa"
            ? "ਸਾਂਝੀ ਔਸਤ ਤੋਂ ਉਲਟ ਦੂਰੀਆਂ ਦਾ ਅਨੁਪਾਤ ਲਵੋ ਅਤੇ ਜਾਣੀ ਗਿਣਤੀ ਅਨੁਸਾਰ ਵਧਾਓ"
            : "use inverse distances from the combined average, then match the known count",
        language === "hi"
          ? "संयुक्त औसत से अधिक दूर वाला औसत छोटे समूह का होता है"
          : language === "pa"
            ? "ਸਾਂਝੀ ਔਸਤ ਤੋਂ ਵੱਧ ਦੂਰ ਵਾਲੀ ਔਸਤ ਛੋਟੇ ਸਮੂਹ ਦੀ ਹੁੰਦੀ ਹੈ"
            : "the average farther from the combined value belongs to the smaller group",
        conclusion,
      );

    case "findMissingGroupAverage":
      return sentence(
        language,
        language === "hi"
          ? "संयुक्त औसत के चारों ओर चिह्नित भारित अंतर संतुलित करके लापता औसत पाएँ"
          : language === "pa"
            ? "ਸਾਂਝੀ ਔਸਤ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਚਿੰਨ੍ਹਿਤ ਭਾਰਿਤ ਅੰਤਰ ਸੰਤੁਲਿਤ ਕਰਕੇ ਗੁੰਮ ਔਸਤ ਲਵੋ"
            : "balance signed weighted differences around the combined average to find the missing average",
        language === "hi"
          ? "किसी भी समूह की संख्या को अनदेखा न करें"
          : language === "pa"
            ? "ਕਿਸੇ ਵੀ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਨੂੰ ਅਣਡਿੱਠਾ ਨਾ ਕਰੋ"
            : "do not ignore either group count",
        conclusion,
      );

    case "findGroupCountRatioFromCombinedAverage":
      return sentence(
        language,
        language === "hi"
          ? "संयुक्त औसत से दोनों औसतों की उलटी दूरियाँ समूह-संख्या अनुपात देती हैं"
          : language === "pa"
            ? "ਸਾਂਝੀ ਔਸਤ ਤੋਂ ਦੋਵਾਂ ਔਸਤਾਂ ਦੀਆਂ ਉਲਟ ਦੂਰੀਆਂ ਸਮੂਹ-ਗਿਣਤੀ ਅਨੁਪਾਤ ਦਿੰਦੀਆਂ ਹਨ"
            : "inverse distances from the combined average give the group-count ratio",
        language === "hi"
          ? "हर समूह के साथ सामने वाली दूरी लिखें"
          : language === "pa"
            ? "ਹਰ ਸਮੂਹ ਨਾਲ ਸਾਹਮਣੇ ਵਾਲੀ ਦੂਰੀ ਲਿਖੋ"
            : "pair each group with the opposite distance",
        conclusion,
      );

    case "findAverageSpeedEqualDistance":
      return sentence(
        language,
        language === "hi"
          ? "समान दूरी के लिए दोनों चालों का हार्मोनिक औसत लें"
          : language === "pa"
            ? "ਬਰਾਬਰ ਦੂਰੀ ਲਈ ਦੋਵਾਂ ਚਾਲਾਂ ਦੀ ਹਾਰਮੋਨਿਕ ਔਸਤ ਲਵੋ"
            : "use the harmonic mean of the two speeds for equal distances",
        language === "hi"
          ? "समान दूरी में साधारण औसत गलत होता है"
          : language === "pa"
            ? "ਬਰਾਬਰ ਦੂਰੀ ਵਿੱਚ ਸਧਾਰਣ ਔਸਤ ਗਲਤ ਹੁੰਦੀ ਹੈ"
            : "the simple mean is wrong for equal distances",
        conclusion,
      );

    case "findAverageSpeedEqualTime":
      return sentence(
        language,
        language === "hi"
          ? "समान समय होने से दोनों चालों का साधारण औसत लें"
          : language === "pa"
            ? "ਬਰਾਬਰ ਸਮਾਂ ਹੋਣ ਕਰਕੇ ਦੋਵਾਂ ਚਾਲਾਂ ਦੀ ਸਧਾਰਣ ਔਸਤ ਲਵੋ"
            : "use the ordinary mean because both travel times are equal",
        language === "hi"
          ? "यहाँ हार्मोनिक औसत न लगाएँ"
          : language === "pa"
            ? "ਇੱਥੇ ਹਾਰਮੋਨਿਕ ਔਸਤ ਨਾ ਲਗਾਓ"
            : "do not use the harmonic mean here",
        conclusion,
      );

    case "findAverageSpeedForUnequalDistances":
      return sentence(
        language,
        language === "hi"
          ? "कुल दूरी को अलग-अलग चरणों में लगे कुल समय से भाग दें"
          : language === "pa"
            ? "ਕੁੱਲ ਦੂਰੀ ਨੂੰ ਵੱਖ-ਵੱਖ ਪੜਾਵਾਂ ਵਿੱਚ ਲੱਗੇ ਕੁੱਲ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿਓ"
            : "divide total distance by the sum of the times taken on each stage",
        language === "hi"
          ? "चालों का सीधा औसत न लें"
          : language === "pa"
            ? "ਚਾਲਾਂ ਦੀ ਸਿੱਧੀ ਔਸਤ ਨਾ ਲਵੋ"
            : "do not average the speeds directly",
        conclusion,
      );

    case "findAverageSpeedForUnequalTimes":
      return sentence(
        language,
        language === "hi"
          ? "हर चाल को उसके यात्रा-समय के अनुसार भार दें"
          : language === "pa"
            ? "ਹਰ ਚਾਲ ਨੂੰ ਉਸ ਦੇ ਯਾਤਰਾ-ਸਮੇਂ ਅਨੁਸਾਰ ਭਾਰ ਦਿਓ"
            : "weight each speed by its travel time",
        language === "hi"
          ? "साधारण औसत केवल समान समय में सही है"
          : language === "pa"
            ? "ਸਧਾਰਣ ਔਸਤ ਸਿਰਫ਼ ਬਰਾਬਰ ਸਮੇਂ ਵਿੱਚ ਸਹੀ ਹੈ"
            : "the simple mean works only when the times are equal",
        conclusion,
      );

    default:
      return conclusion;
  }
}

export function applyAvg001Cp004ExamStrategy(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-004" || pkg.explanation.lines.length !== 4) {
    return pkg;
  }

  const lines = [...pkg.explanation.lines];
  lines[3] = strategyLine(pkg, lines[3]!);

  return {
    ...pkg,
    explanation: { ...pkg.explanation, lines },
    traceability: {
      ...pkg.traceability,
      cp004ExamStrategyFinalizer: AVG_001_CP004_EXAM_STRATEGY,
    },
  };
}
