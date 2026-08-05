import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";

function clean(text: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return text
      .replace(/कुल उत्पादक क्षमता/g, "कुल काम करने की क्षमता")
      .replace(/बदली व्यवस्था/g, "नई स्थिति")
      .replace(/मूल व्यवस्था/g, "पुरानी स्थिति")
      .replace(/समायोजन/g, "बदलाव");
  }
  return text
    .replace(/ਕੁੱਲ ਉਤਪਾਦਕ ਸਮਰੱਥਾ/g, "ਕੁੱਲ ਕੰਮ ਕਰਨ ਦੀ ਸਮਰੱਥਾ")
    .replace(/ਬਦਲੀ ਵਿਵਸਥਾ/g, "ਨਵੀਂ ਸਥਿਤੀ")
    .replace(/ਮੂਲ ਵਿਵਸਥਾ/g, "ਪੁਰਾਣੀ ਸਥਿਤੀ")
    .replace(/ਸਮਾਯੋਜਨ/g, "ਬਦਲਾਅ");
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
        explanation: clean(question.explanation.commonTrap.explanation, language),
      },
      conclusion: clean(question.explanation.conclusion, language),
    },
  };
}
