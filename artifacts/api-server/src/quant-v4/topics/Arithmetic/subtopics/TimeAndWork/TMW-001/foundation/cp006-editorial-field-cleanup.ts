import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";

function clean(text: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return text
      .replace(/कुल उत्पादक क्षमता/g, "कुल काम करने की क्षमता")
      .replace(/बदली व्यवस्था/g, "नई स्थिति")
      .replace(/मूल व्यवस्था/g, "पुरानी स्थिति")
      .replace(/समायोजन/g, "बदलाव")
      .replace(/अतः हटाए गए लोगों की संख्या (.+) है।/g, "अतः $1 हटाए जा सकते हैं।");
  }
  return text
    .replace(/ਕੁੱਲ ਉਤਪਾਦਕ ਸਮਰੱਥਾ/g, "ਕੁੱਲ ਕੰਮ ਕਰਨ ਦੀ ਸਮਰੱਥਾ")
    .replace(/ਬਦਲੀ ਵਿਵਸਥਾ/g, "ਨਵੀਂ ਸਥਿਤੀ")
    .replace(/ਮੂਲ ਵਿਵਸਥਾ/g, "ਪੁਰਾਣੀ ਸਥਿਤੀ")
    .replace(/ਸਮਾਯੋਜਨ/g, "ਬਦਲਾਅ")
    .replace(/ਇਸ ਲਈ ਹਟਾਏ ਗਏ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ (.+) ਹੈ।/g, "ਇਸ ਲਈ $1 ਹਟਾਏ ਜਾ ਸਕਦੇ ਹਨ।");
}

function cleanTrap(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
): string {
  if (
    question.solveMode === "findOvertimeHoursForDeadline" &&
    question.explanation.commonTrap.misconceptionId === "TOTAL_REPORTED_AS_CHANGE"
  ) {
    return language === "hi"
      ? "यह विकल्प अतिरिक्त घंटों के बजाय प्रतिदिन आवश्यक कुल घंटे बता देता है।"
      : "ਇਹ ਵਿਕਲਪ ਵਾਧੂ ਘੰਟਿਆਂ ਦੀ ਥਾਂ ਹਰ ਦਿਨ ਦੇ ਕੁੱਲ ਲੋੜੀਂਦੇ ਘੰਟੇ ਦੱਸ ਦਿੰਦਾ ਹੈ।";
  }
  return clean(question.explanation.commonTrap.explanation, language);
}

export function cleanupTmwCp006EditorialFields(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  return {
    ...question,
    stem: clean(question.stem, language),
    explanation: {
      ...question.explanation,
      opening: clean(question.explanation.opening, language),
      givens: question.explanation.givens?.map((text) => clean(text, language)),
      shortcut: {
        title: clean(question.explanation.shortcut.title, language),
        steps: question.explanation.shortcut.steps.map((text) => clean(text, language)),
      },
      commonTrap: {
        ...question.explanation.commonTrap,
        explanation: cleanTrap(question, language),
      },
      conclusion: clean(question.explanation.conclusion, language),
    },
  };
}
