import type {
  TmwCp009GeneratedQuestion,
  TmwCp009SolveMode,
} from "./cp009-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import type { TmwCp009LocalizedEditorialFields } from "./cp009-editorial-review-remediation";
import { polishTmwCp009Text } from "./localization-cp009-polish";

function pair(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function conclusion(
  solveMode: TmwCp009SolveMode,
  answerText: string,
  language: TmwLocalizedLanguage,
): string {
  switch (solveMode) {
    case "findFillTimeFromPositiveInlets":
    case "findFillTimeFromMixedPipes":
      return pair(language, `अतः टंकी के पूरी तरह भरने का समय ${answerText} है।`, `ਇਸ ਲਈ ਟੈਂਕੀ ਦੇ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰਨ ਦਾ ਸਮਾਂ ${answerText} ਹੈ।`);
    case "findEmptyTimeFromMixedPipes":
      return pair(language, `अतः पूरी भरी टंकी के खाली होने का समय ${answerText} है।`, `ਇਸ ਲਈ ਪੂਰੀ ਭਰੀ ਟੈਂਕੀ ਦੇ ਖਾਲੀ ਹੋਣ ਦਾ ਸਮਾਂ ${answerText} ਹੈ।`);
    case "findNetFractionChangedInGivenTime":
      return pair(language, `अतः परिणाम: ${answerText}।`, `ਇਸ ਲਈ ਨਤੀਜਾ: ${answerText}।`);
    case "findMissingInletTime":
      return pair(language, `अतः अज्ञात भरने वाली पाइप का अकेले भरने का समय ${answerText} है।`, `ਇਸ ਲਈ ਅਣਜਾਣ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਦਾ ਇਕੱਲੇ ਭਰਨ ਦਾ ਸਮਾਂ ${answerText} ਹੈ।`);
    case "findMissingOutletOrLeakTime":
      return pair(language, `अतः अज्ञात निकासी पाइप या रिसाव का अकेले खाली करने का समय ${answerText} है।`, `ਇਸ ਲਈ ਅਣਜਾਣ ਨਿਕਾਸੀ ਪਾਈਪ ਜਾਂ ਰਿਸਾਅ ਦਾ ਇਕੱਲੇ ਖਾਲੀ ਕਰਨ ਦਾ ਸਮਾਂ ${answerText} ਹੈ।`);
    case "findIdenticalPipeCountForTargetTime":
      return pair(language, `अतः लक्ष्य समय के लिए ${answerText} चाहिए।`, `ਇਸ ਲਈ ਟੀਚੇ ਵਾਲੇ ਸਮੇਂ ਲਈ ${answerText} ਚਾਹੀਦੀਆਂ ਹਨ।`);
    case "findTankCapacityFromFlowAndTime":
      return pair(language, `अतः टंकी की क्षमता ${answerText} है।`, `ਇਸ ਲਈ ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ ${answerText} ਹੈ।`);
    case "findFlowRateFromCapacityAndTime":
      return pair(language, `अतः आवश्यक प्रवाह दर ${answerText} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਪ੍ਰਵਾਹ ਦਰ ${answerText} ਹੈ।`);
    case "findTimeFromCapacityAndNetFlow":
      return pair(language, `अतः टंकी भरने का समय ${answerText} है।`, `ਇਸ ਲਈ ਟੈਂਕੀ ਭਰਨ ਦਾ ਸਮਾਂ ${answerText} ਹੈ।`);
    case "convertFlowUnits":
      return pair(language, `अतः बदली हुई प्रवाह दर ${answerText} है।`, `ਇਸ ਲਈ ਬਦਲੀ ਹੋਈ ਪ੍ਰਵਾਹ ਦਰ ${answerText} ਹੈ।`);
    case "findTimeFromInitialLevelToBoundary":
      return pair(language, `अतः लक्ष्य स्तर तक पहुँचने का समय ${answerText} है।`, `ਇਸ ਲਈ ਟੀਚੇ ਵਾਲੇ ਪੱਧਰ ਤੱਕ ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ ${answerText} ਹੈ।`);
    case "findFinalLevelAfterGivenTime":
      return pair(language, `अतः निर्धारित समय बाद टंकी ${answerText} होगी।`, `ਇਸ ਲਈ ਨਿਰਧਾਰਤ ਸਮੇਂ ਬਾਅਦ ਟੈਂਕੀ ${answerText} ਹੋਵੇਗੀ।`);
    case "compareTankCapacities":
      return pair(language, `अतः पूछे गए क्रम में टंकियों की क्षमता का अनुपात ${answerText} है।`, `ਇਸ ਲਈ ਪੁੱਛੇ ਕ੍ਰਮ ਵਿੱਚ ਟੈਂਕੀਆਂ ਦੀ ਸਮਰੱਥਾ ਦਾ ਅਨੁਪਾਤ ${answerText} ਹੈ।`);
    case "findReducedPipeEfficiencyFromChangedTime":
      return pair(language, `अतः पूछे गए क्रम में दक्षता अनुपात ${answerText} है।`, `ਇਸ ਲਈ ਪੁੱਛੇ ਕ੍ਰਮ ਵਿੱਚ ਦੱਖਤਾ ਅਨੁਪਾਤ ${answerText} ਹੈ।`);
    case "findBlockagePercentFromChangedTime":
      return pair(language, `अतः पाइप में अवरोध ${answerText} है।`, `ਇਸ ਲਈ ਪਾਈਪ ਵਿੱਚ ਰੁਕਾਵਟ ${answerText} ਹੈ।`);
    case "findNetRateDirection":
    case "findBoundaryEventFeasibility":
      return pair(language, `अतः ${answerText}।`, `ਇਸ ਲਈ ${answerText}।`);
  }
}

export function finalizeTmwCp009LocalizedEditorial(
  source: TmwCp009GeneratedQuestion,
  fields: TmwCp009LocalizedEditorialFields,
  answerText: string,
  language: TmwLocalizedLanguage,
): TmwCp009LocalizedEditorialFields {
  const polish = (text: string): string => polishTmwCp009Text(text, language);
  return {
    stem: polish(fields.stem),
    opening: polish(fields.opening),
    givens: fields.givens.map(polish),
    workedSteps: fields.workedSteps.map(polish),
    shortcut: {
      title: polish(fields.shortcut.title),
      steps: fields.shortcut.steps.map(polish),
    },
    trapExplanation: polish(fields.trapExplanation),
    conclusion: polish(conclusion(source.solveMode, answerText, language)),
  };
}
